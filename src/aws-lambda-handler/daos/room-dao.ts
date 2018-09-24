import { DataMapper } from '@aws/dynamodb-data-mapper';
import { RoomModel } from '../models/room-model';

const DynamoDB = require('aws-sdk/clients/dynamodb');

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
}
