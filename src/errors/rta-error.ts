/**
 * Application Error.
 */
export default class RtaError extends Error {

  /**
   * Error type.
   */
  public errorType: {
    type: string;
    message: string;
  };

  public constructor(obj: { type: string; message: string }) {
    super(obj.message);
    this.errorType = obj;
  }
}

/**
 * Constants representing error type.
 */
export const errorTypes: { [key: string]: { type: string; message: string }} = {
  ROOM_ALREADY_CLOSED: {
    type: 'RoomAlreadyClosed',
    message: 'Room is already closed'
  }
};
