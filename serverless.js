// Command line options
// --stage:       Required System Landscape name, default is 'dev' (Choice: [dev | prd], e.g. --stage dev)
// --region:      Optional, default is determined by the value of `stage` (e.g. --region ap-northeast-1)
// --bucket:      Optional, default is determined by the value of `stage` (e.g. --bucket x-sls-artifacts)
// --aws-profile: Optional, when specifying AWS Profile name (If it exists in `~/.aws/credentials`, e.g. --aws-profile dev )

const pkg = require('./package.json');

module.exports = {
  service: pkg.name,
  provider: {
    name: 'aws',
    stage: '${opt:stage, "dev"}',
    region: '${opt:region, self:custom.regions.${self:provider.stage}}',
    runtime: `nodejs${pkg.engines.node}`,
    memorySize: 512,
    timeout: 29,
    logRetentionInDays: 30,
    deploymentBucket: {
      name: '${opt:bucket, "x-sls-artifacts-${self:service}-${self:provider.region}"}',
      serverSideEncryption: 'AES256'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:*',
        ],
        Resource: '*',
      },
    ]
  },

  plugins: [
    'serverless-webpack',
    'serverless-dynamodb-ttl'
  ],

  custom: {
    webpack: { packager: 'yarn', includeModules: { forceExclude: [ 'aws-sdk' ]}},
    regions:  { dev: 'us-west-2', prd: 'ap-northeast-1' },
    suffixes: { dev: '-dev',      prd: '' },
    names: {
      'lambda-systems': '${self:service}-systems${self:custom.suffixes.${self:provider.stage}}',
      'lambda-post-rooms': '${self:service}-post-rooms${self:custom.suffixes.${self:provider.stage}}',
      'lambda-get-rooms': '${self:service}-get-rooms${self:custom.suffixes.${self:provider.stage}}',
      'lambda-rooms-roomId': '${self:service}-rooms-roomId${self:custom.suffixes.${self:provider.stage}}'
    },
    dynamodb: {
      ttl: [
        {
          table: 'Rooms',
          field: 'expiresAt'
        }
      ]

    }
  },

  functions: {
    Systems: {
      name: '${self:custom.names.lambda-systems}',
      handler: 'src/aws-lambda-handler/systems.handle',
      events: [{ http: { path: 'version', method: 'get', cors: true }}]
    },
    PostRooms: {
      name: '${self:custom.names.lambda-post-rooms}',
      handler: 'src/aws-lambda-handler/actions/v1/new-room.handle',
      events: [{ http: { path: 'rooms', method: 'post', cors: true }}],
    },
    GetRooms: {
      name: '${self:custom.names.lambda-get-rooms}',
      handler: 'src/aws-lambda-handler/actions/v1/list-rooms.handle',
      events: [{ http: { path: 'rooms', method: 'get', cors: true }}],
    },
    RoomsRoomId: {
      name: '${self:custom.names.lambda-rooms-roomId}',
      handler: 'src/aws-lambda-handler/actions/v1/get-room.handle',
      events: [{ http: { path: 'rooms/{roomId}', method: 'get', cors: true }}],
    }
  },

  resources: {
    Resources: {
      RoomsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Rooms',
          AttributeDefinitions: [
            {AttributeName: 'registeredDateYearMonth', AttributeType: 'S'},
            {AttributeName: 'registeredDateRoomId', AttributeType: 'S'},
            {AttributeName: 'roomId', AttributeType: 'S'},
          ],
          KeySchema: [
            {AttributeName: 'registeredDateYearMonth', KeyType: 'HASH'},
            {AttributeName: 'registeredDateRoomId', KeyType: 'RANGE'},
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
          GlobalSecondaryIndexes: [{
            IndexName: 'roomId-index',
            KeySchema: [
              { AttributeName: 'roomId', KeyType: 'HASH' },
              { AttributeName: 'registeredDateRoomId', KeyType: 'RANGE' },
            ],
            Projection: {
              ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
          }]
        }
      }
    }
  }
};
