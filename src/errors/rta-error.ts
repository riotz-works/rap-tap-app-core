export default class RtaError extends Error {
  public errorType: {
    type: string;
    message: string;
  };

  public constructor(obj: { type: string; message: string }) {
    super(obj.message);
    this.errorType = obj;
  }
}

export const errorTypes: { [key: string]: { type: string; message: string }} = {
  ROOM_ALREADY_CLOSED: {
    type: 'RoomAlreadyClosed',
    message: 'Room is already closed'
  }
};
