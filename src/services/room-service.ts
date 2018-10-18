import * as moment from 'moment';
import { v4 } from 'uuid';
import { RoomDao } from '~/daos/room-dao';
import { RapperModel, RoomModel } from '~/models/room-model';


/**
 * Service processing RoomModel.
 */
export class RoomService {

  private readonly dao: RoomDao = new RoomDao();


  /**
   * Create a new Room.
   * @param roomName Room name.
   */
  public async newRoom(roomName?: string): Promise<RoomModel> {
    const model: RoomModel = new RoomModel();
    model.roomId = v4();
    model.roomName = roomName;

    const registeredDate: moment.Moment = moment.utc();
    model.registeredDateYearMonth = registeredDate.format('YYYY-MM');
    model.registeredDateRoomId = `${registeredDate.toISOString()}_${model.roomId}`;
    model.rappers = new Array<RapperModel>();
    model.expiresAt = registeredDate.add(1, 'hours').unix();

    const created: RoomModel = await this.dao.put(model);
    return created;
  }

  /**
   * Get Room by ID.
   * @param roomId Room ID.
   */
  public async getRoom(roomId?: string): Promise<RoomModel> {
    return this.dao.find(roomId);
  }

  /**
   * List registered rooms.
   */
  public async listRooms(): Promise<RoomModel[]> {
    return this.dao.list();
  }

  /**
   * List matched rooms.
   */
  public async listMatchedRooms(): Promise<RoomModel[]> {
    return this.dao.listMatched();
  }

  /**
   * Add a Rapper to Room.
   * @param roomId Room ID.
   * @param rapper Rapper to add.
   */
  public async addRapper(roomId?: string, rapper?: RapperModel): Promise<RoomModel> {
    return this.dao.addRapper(roomId, rapper);
  }
}
