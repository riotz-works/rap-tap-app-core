import { Room } from './room'
import {RoomModel} from '../../models/room-model';

export class Rooms {
  rooms: Array<Room>

  constructor(roomModels: RoomModel[]) {
    this.rooms = roomModels ? roomModels.map(model => {
      const room = new Room();
      room.roomId = model.roomId;
      room.roomName = model.roomName;
      return room;
    })
    : [];
  }

}
