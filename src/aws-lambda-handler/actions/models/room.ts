import {RoomModel} from '../../models/room-model';

export class Room {
  public roomId?: string;
  public roomName?: string;
  public rappers?: Rapper[]| undefined;

  constructor(roomModel: RoomModel) {
    this.roomId = roomModel.roomId;
    this.roomName = roomModel.roomName;
    this.rappers = roomModel.rappers ?
      roomModel.rappers.map(model => new Rapper(model.nickname, model.peerId))
      : []


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
