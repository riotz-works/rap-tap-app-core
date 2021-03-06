import dayjs from 'dayjs';
import { ulid } from 'ulid';
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
    model.roomId = ulid();
    model.roomName = roomName;

    const registeredDate: dayjs.Dayjs = dayjs();
    model.registeredDateYearMonth = registeredDate.format('YYYY-MM');
    model.registeredDateRoomId = `${registeredDate.toISOString()}_${model.roomId}`;
    model.rappers = new Array<RapperModel>();
    model.expiresAt = registeredDate.add(1, 'h').unix();

    const created: RoomModel = await this.dao.put(model);
    return created;
  }

  /**
   * Get Room by ID.
   * @param roomId Room ID.
   */
  public getRoom(roomId?: string): Promise<RoomModel> {
    return this.dao.find(roomId);
  }

  /**
   * List registered rooms.
   */
  public listRooms(): Promise<RoomModel[]> {
    return this.dao.list();
  }

  /**
   * List matched rooms.
   */
  public listMatchedRooms(): Promise<RoomModel[]> {
    return this.dao.listMatched();
  }

  /**
   * Add a Rapper to Room.
   * @param roomId Room ID.
   * @param rapper Rapper to add.
   */
  public addRapper(roomId?: string, rapper?: RapperModel): Promise<RoomModel> {
    return this.dao.addRapper(roomId, rapper);
  }
}
