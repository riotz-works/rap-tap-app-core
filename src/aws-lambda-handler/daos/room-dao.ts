import { DataMapper } from '@aws/dynamodb-data-mapper';
import { RoomModel } from '../models/room-model';
import * as moment from 'moment';

const DynamoDB = require('aws-sdk/clients/dynamodb');


(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("Symbol.asyncIterator");


const client = new DynamoDB();

export class RoomDao {
  private mapper: DataMapper;

  public constructor() {
    this.mapper = new DataMapper({
      client: client
    });
  }

  public async create(model: RoomModel): Promise<RoomModel> {
    const created: RoomModel = await this.mapper.put(model);
    return created;
  }

  public async find(roomId: string): Promise<RoomModel> {
    const now = moment.utc();
    const start = moment.utc().subtract(1, 'hours');
    const params = {
      TableName: 'Rooms',
      IndexName: 'roomId-index',
      KeyConditionExpression: 'roomId = :roomId and registeredDateRoomId BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':roomId': roomId,
        ':start': start.toISOString(),
        ':end': now.toISOString()
      }
    };
    const docClient = new DynamoDB.DocumentClient();
    const queryResult = await docClient.query(params).promise();

    return queryResult.Items.pop();
  }

  public async list(): Promise<RoomModel[]> {
    const now = moment.utc();
    const start = moment.utc().subtract(1, 'hours');
    const params = {
      TableName: 'Rooms',
      KeyConditionExpression: 'registeredDateYearMonth = :registeredDateYearMonth and registeredDateRoomId BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':registeredDateYearMonth': start.format('YYYY-MM'),
        ':start': start.toISOString(),
        ':end': now.toISOString()
      }
    };
    const docClient = new DynamoDB.DocumentClient();
    const queryResult = await docClient.query(params).promise();

    return queryResult.Items;
  }
}
