import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { RoomService } from '../../services/room-service';
import { RapperModel } from '../../models/room-model';
import RtaError from '../../errors/RtaError';

export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));
  // @ts-ignore
  const roomId: string | null = event.pathParameters.roomId;

  const body: any = event.body ? JSON.parse(event.body) : { roomName: null };

  const rapper = new RapperModel();
  rapper.nickname = body.nickname;
  rapper.peerId = body.peerId;
  const service: RoomService = new RoomService();
  try {
    await service.addRapper(roomId, rapper);
  } catch (e) {
    console.log(e)
    if (e instanceof RtaError) {
      return new ErrorResult({message: e.message})
    } else {
      return new FatalResult(e.message);
    }
  }

  return new Result({});

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

class ErrorResult implements APIGatewayProxyResult {

  /** HTTP Status Code to respond **/
  public statusCode: number = 400;

  /** HTTP Headers to respond. */
  public headers: { [ header: string ]: string } = { 'Access-Control-Allow-Origin': '*' };

  /** Response body. */
  public body: string;

  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}


class FatalResult implements APIGatewayProxyResult {

  /** HTTP Status Code to respond **/
  public statusCode: number = 500;

  /** HTTP Headers to respond. */
  public headers: { [ header: string ]: string } = { 'Access-Control-Allow-Origin': '*' };

  /** Response body. */
  public body: string;

  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}

