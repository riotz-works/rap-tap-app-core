import { RoomDao } from '../daos/room-dao';
import { Rapper, RoomModel } from '../models/room-model';
import { v4 } from 'uuid';
import * as moment from 'moment';

export class RoomService {
  private dao: RoomDao;

  public constructor() {
    this.dao = new RoomDao();
  }

  public async newRoom(roomName: string): Promise<RoomModel> {
    const model: RoomModel = new RoomModel();
    model.roomId = v4();
    model.roomName = roomName;
    const registeredDate: moment.Moment = moment.utc();
    model.registeredDateYearMonth = registeredDate.format('YYYY-MM');
    model.registeredDateRoomId = `${registeredDate.toISOString()}_${model.roomId}`;
    model.rappers = new Array<Rapper>();
    model.expiresAt = registeredDate.add(1, 'hours').unix();
    const created: RoomModel = await this.dao.create(model);

    return created;
  }

  public async getRoom(roomId: string): Promise<RoomModel> {

    return await this.dao.find(roomId)
  }
}
