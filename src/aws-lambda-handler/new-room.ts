import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { RoomModel } from '~/models/room-model';
import { RoomService } from '~/services/room-service';
import { Room } from './models/room';


/**
 * Rooms Web API's AWS Lambda handler function.
 *
 * @param event – event data.
 * @see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 */
export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));

  const body: Room = event.body ? JSON.parse(event.body) as Room : { roomName: undefined };
  const service: RoomService = new RoomService();
  const model: RoomModel = await service.newRoom(body.roomName);

  const room: Room = Room.of(model);
  return new Result(room);
};


/* tslint:disable:completed-docs */  // For value objects of model class
class Result implements APIGatewayProxyResult {
  public statusCode: number = 200;
  public headers: { [header: string]: string } = { 'Access-Control-Allow-Origin': '*' };
  public body: string;

  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}
/* tslint:enable */
