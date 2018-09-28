import {RoomModel} from '~/models/room-model';

export class Room {
  public roomId?: string;
  public roomName?: string;
  public rappers?: Rapper[]| undefined;

  static of(roomModel: RoomModel) {
    let room: Room = new Room();
    room.roomId = roomModel.roomId;
    room.roomName = roomModel.roomName;
    room.rappers = roomModel.rappers ?
      roomModel.rappers.map(model => new Rapper(model.nickname, model.peerId))
      : []
    return room;
  }

  constructor() {

  }

}

class Rapper {
  public nickname : string | undefined;
  public peerId : string | undefined;
  constructor(nickName: string | undefined, peerId: string | undefined) {
    this.nickname = nickName;
    this.peerId = peerId;
  }
}
