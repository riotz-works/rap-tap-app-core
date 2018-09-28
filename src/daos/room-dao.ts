import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as moment from 'moment';
import RtaError, { errorTypes } from '~/errors/rta-error';
import { RapperModel, RoomModel } from '~/models/room-model';

const DynamoDB = require('aws-sdk/clients/dynamodb');
(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol('Symbol.asyncIterator');


export class RoomDao {

  private mapper: DataMapper = new DataMapper({ client: new DynamoDB() });
  private client = new DynamoDB.DocumentClient();


  public async put(model: RoomModel): Promise<RoomModel> {
    const updated: RoomModel = await this.mapper.put(model);
    return updated;
  }

  public async find(roomId?: string): Promise<RoomModel> {
    const now: moment.Moment = moment.utc();
    const start: moment.Moment = moment.utc().subtract(1, 'hours');
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

    const result = await this.client.query(params).promise();
    return result.Items.pop();
  }

  public async list(): Promise<RoomModel[]> {
    const now: moment.Moment = moment.utc();
    const start: moment.Moment = moment.utc().subtract(1, 'hours');
    const params = {
      TableName: 'Rooms',
      KeyConditionExpression: 'registeredDateYearMonth = :registeredDateYearMonth and registeredDateRoomId BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':registeredDateYearMonth': start.format('YYYY-MM'),
        ':start': start.toISOString(),
        ':end': now.toISOString()
      }
    };

    const result = await this.client.query(params).promise();
    return result.Items;
  }

  public async listMatched(): Promise<RoomModel[]> {
    const now: moment.Moment = moment.utc();
    const start: moment.Moment = moment.utc().subtract(1, 'hours');
    const params = {
      TableName: 'Rooms',
      KeyConditionExpression: 'registeredDateYearMonth = :registeredDateYearMonth and registeredDateRoomId BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':registeredDateYearMonth': start.format('YYYY-MM'),
        ':start': start.toISOString(),
        ':end': now.toISOString()
      }
    };

    const result = await this.client.query(params).promise();
    return result.Items.filter((item: RoomModel) => item.rappers && item.rappers.length === 2);
  }

  public async addRapper(roomId?: string, rapper?: RapperModel): Promise<RoomModel> {
    const current: RoomModel = await this.find(roomId);
    if (current.rappers && 2 <= current.rappers.length) {
      throw new RtaError(errorTypes.ROOM_ALREADY_CLOSED);
    }

    const model: RoomModel = Object.assign(new RoomModel(), current);
    if (rapper) {
      model.rappers.push(rapper);
    }
    return this.put(model);
  }
}
