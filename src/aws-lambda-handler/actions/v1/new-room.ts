import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { RoomService } from '../../services/room-service';
import { RoomModel } from '../../models/room-model';
import { Room } from '../models/room';

export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));

  const body: any = event.body ? JSON.parse(event.body) : { roomName: null };
  const service: RoomService = new RoomService();
  const model: RoomModel = await service.newRoom(body.roomName);

  const room: Room = Room.of(model);

  return new Result(room);

}

class Result implements APIGatewayProxyResult {

  /** HTTP Status Code to respond **/
  public statusCode: number = 200;

  /** HTTP Headers to respond. */
  public headers: { [ header: string ]: string } = { 'Access-Control-Allow-Origin': '*' };

  /** Response body. */
  public body: string;

  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}

