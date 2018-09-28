/* tslint:disable:completed-docs */  // For value objects of model class
import { RapperModel, RoomModel } from '~/models/room-model';


export class Room {

  public roomId?: string;
  public roomName?: string;
  public rappers?: Rapper[];

  public static of(model: RoomModel): Room {
    const room: Room = new Room();
    room.roomId = model.roomId;
    room.roomName = model.roomName;
    room.rappers = model.rappers ? model.rappers.map((rapper: RapperModel) => new Rapper(rapper.nickname, rapper.peerId)) : [];
    return room;
  }
}


export class Rapper {

  public nickname?: string;
  public peerId?: string;

  public constructor(nickName?: string, peerId?: string) {
    this.nickname = nickName;
    this.peerId = peerId;
  }
}
