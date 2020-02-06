import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as moment from 'moment';
import RtaError, { errorTypes } from '~/errors/rta-error';
import { RapperModel, RoomModel } from '~/models/room-model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const DynamoDB = require('aws-sdk/clients/dynamodb');


/**
 * DAO handling RoomModel.
 */
export class RoomDao {

  private readonly mapper: DataMapper = new DataMapper({ client: new DynamoDB() });
  private readonly client = new DynamoDB.DocumentClient();


  /**
   * Register a new record in the database, or overwrite it if exists.
   * @param model RoomModel to register.
   */
  public async put(model: RoomModel): Promise<RoomModel> {
    const updated: RoomModel = await this.mapper.put(model);
    return updated;
  }

  /**
   * Search by Room ID.
   * @param roomId Room ID.
   */
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

  /**
   * List registered rooms.
   */
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

  /**
   * List matched rooms.
   */
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

  /**
   * Add a Rapper to Room.
   * @param roomId Room ID.
   * @param rapper Rapper to add.
   */
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
