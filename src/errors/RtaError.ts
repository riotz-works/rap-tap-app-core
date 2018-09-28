export default class RtaError extends Error {
  errorType: { type: string;
  message: string; };

  constructor(obj: { type: string; message: string; }) {
    super(obj.message);
    this.errorType = obj;
  }
}

export const errorTypes = {
  ROOM_ALREADY_CLOSED: {
    type: 'RoomAlreadyClosed',
    message: 'Room is already closed'
  }
};
