import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { RoomService } from '../../services/room-service';
import { RoomModel } from '../../models/room-model';
import { Rooms } from '~/src/aws-lambda-handler/actions/models/rooms';

export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));
  // @ts-ignore

  const service: RoomService = new RoomService();
  const models: RoomModel[] = await service.listMatchedRooms()

  const rooms: Rooms = new Rooms(models);

  return new Result(rooms);

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

