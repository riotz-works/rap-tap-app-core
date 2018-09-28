import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { RoomService } from '~/services/room-service';
import { RoomModel } from '~/models/room-model';
import { Room } from './models/room';

export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));
  // @ts-ignore
  const roomId: string | null = event.pathParameters.roomId;

  const service: RoomService = new RoomService();
  const model: RoomModel = await service.getRoom(roomId)

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
