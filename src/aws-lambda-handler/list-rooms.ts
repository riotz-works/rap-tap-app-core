import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { RoomModel } from '~/models/room-model';
import { RoomService } from '~/services/room-service';
import { Rooms } from './models/rooms';


/**
 * Rooms Web API's AWS Lambda handler function.
 *
 * @param event – event data.
 * @see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 */
export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));

  const service: RoomService = new RoomService();
  const models: RoomModel[] = await service.listRooms();

  const rooms: Rooms = new Rooms(models);
  return new Result(rooms);
};


class Result implements APIGatewayProxyResult {
  public statusCode = 200;
  public headers: { [header: string]: string } = { 'Access-Control-Allow-Origin': '*' };
  public body: string;

  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}
