/* eslint-disable no-multi-spaces */              // 'cuz clarify paired structure
/* eslint-disable no-template-curly-in-string */  // 'cuz syntax of the serverless framework

// Command line options
// --stage:       Required System Landscape name, default is 'dev' (Choice: [dev | prd], e.g. --stage dev)
// --region:      Optional, default is determined by the value of `stage` (e.g. --region ap-northeast-1)
// --bucket:      Optional, default is determined by the value of `stage` (e.g. --bucket x-sls-artifacts)
// --aws-profile: Optional, when specifying AWS Profile name (If `dev` exists in `~/.aws/credentials`, e.g. --aws-profile dev )

const pkg = require('./package.json');


module.exports = {
  service: pkg.name,
  provider: {
    name: 'aws',
    stage: '${opt:stage, "dev"}',
    region: '${opt:region, self:custom.stages.region.${self:provider.stage}}',
    runtime: `nodejs${pkg.engines.node}`,
    apiName: '${self:service}${self:custom.stages.suffix.${self:provider.stage}}',
    memorySize: 256,
    timeout: 29,
    logRetentionInDays: 7,
    versionFunctions: false,
    deploymentBucket: {
      name: '${opt:bucket, "x-sls-artifacts-' + pkg.group + '-${self:provider.region}"}',  /* eslint-disable-line prefer-template */  // 'cuz syntax of the serverless framework
      maxPreviousDeploymentArtifacts: 1,
      blockPublicAccess: true,
      serverSideEncryption: 'AES256'
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:Query',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem'
      ],
      Resource: [
        { 'Fn::GetAtt': [ 'RoomsTable', 'Arn' ]},
        { 'Fn::Join': [ '/', [{ 'Fn::GetAtt': [ 'RoomsTable', 'Arn' ]}, 'index', 'roomId-index' ]]}
      ]
    }],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1
    }
  },

  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dynamodb-ttl'
  ],

  custom: {
    webpack: { packager: 'yarn', webpackConfig: 'deploy/webpack.config.js', includeModules: { forceExclude: [ 'aws-sdk' ]}},
    stages: {
      region: { dev: 'ap-northeast-1', prd: '' },
      suffix: { dev: '-dev',           prd: '' }
    },
    names: {
      'lambda-systems': '${self:service}-systems${self:custom.stages.suffix.${self:provider.stage}}',
      'lambda-post-rooms': '${self:service}-post-rooms${self:custom.stages.suffix.${self:provider.stage}}',
      'lambda-get-rooms': '${self:service}-get-rooms${self:custom.stages.suffix.${self:provider.stage}}',
      'lambda-get-rooms-roomId': '${self:service}-get-rooms-roomId${self:custom.stages.suffix.${self:provider.stage}}',
      'lambda-post-rooms-roomId': '${self:service}-post-rooms-roomId${self:custom.stages.suffix.${self:provider.stage}}',
      'lambda-get-rooms-match': '${self:service}-get-rooms-match${self:custom.stages.suffix.${self:provider.stage}}'
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
    GetRooms: {
      name: '${self:custom.names.lambda-get-rooms}',
      handler: 'src/aws-lambda-handler/list-rooms.handle',
      events: [{ http: { path: 'rooms', method: 'get', cors: true }}]
    },
    PostRooms: {
      name: '${self:custom.names.lambda-post-rooms}',
      handler: 'src/aws-lambda-handler/new-room.handle',
      events: [{ http: { path: 'rooms', method: 'post', cors: true }}]
    },
    GetRoomsRoomId: {
      name: '${self:custom.names.lambda-get-rooms-roomId}',
      handler: 'src/aws-lambda-handler/get-room.handle',
      events: [{ http: { path: 'rooms/{roomId}', method: 'get', cors: true }}]
    },
    PostRoomsRoomId: {
      name: '${self:custom.names.lambda-post-rooms-roomId}',
      handler: 'src/aws-lambda-handler/add-rapper.handle',
      events: [{ http: { path: 'rooms/{roomId}', method: 'post', cors: true }}]
    },
    GetRoomsRoomIdMatch: {
      name: '${self:custom.names.lambda-get-rooms-match}',
      handler: 'src/aws-lambda-handler/list-match-rooms.handle',
      events: [{ http: { path: 'rooms/match', method: 'get', cors: true }}]
    }
  },

  resources: [{
    Resources: {
      RoomsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Rooms',
          AttributeDefinitions: [
            { AttributeName: 'registeredDateYearMonth', AttributeType: 'S' },
            { AttributeName: 'registeredDateRoomId', AttributeType: 'S' },
            { AttributeName: 'roomId', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'registeredDateYearMonth', KeyType: 'HASH' },
            { AttributeName: 'registeredDateRoomId', KeyType: 'RANGE' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
          GlobalSecondaryIndexes: [{
            IndexName: 'roomId-index',
            KeySchema: [
              { AttributeName: 'roomId', KeyType: 'HASH' },
              { AttributeName: 'registeredDateRoomId', KeyType: 'RANGE' }
            ],
            Projection: {
              ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            }
          }]
        }
      }
    }
  }]
};
