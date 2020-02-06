import { RoomModel } from '~/models/room-model';
import { Room } from './room';


export class Rooms {

  public rooms: Room[];

  public constructor(rooms: RoomModel[]) {
    this.rooms = rooms ? rooms.map((model: RoomModel) => Room.of(model)) : [];
  }
}
