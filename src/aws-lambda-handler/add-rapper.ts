import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import RtaError from '~/errors/rta-error';
import { RapperModel } from '~/models/room-model';
import { RoomService } from '~/services/room-service';
import { Rapper } from './models/room';


/**
 * Rappers Web API's AWS Lambda handler function.
 *
 * @param event – event data.
 * @see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 */
export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));

  const roomId: string | undefined = event.pathParameters ? event.pathParameters.roomId : undefined;
  const body: Rapper = event.body ? JSON.parse(event.body) as Rapper : new Rapper();

  const rapper: RapperModel = new RapperModel();
  rapper.nickname = body.nickname;
  rapper.peerId = body.peerId;

  const service: RoomService = new RoomService();
  try {
    await service.addRapper(roomId, rapper);
    return new Result({});
  } catch (err) {
    console.error(JSON.stringify(err));
    if (err instanceof RtaError) {
      return new ErrorResult({ message: err.message });
    }
    return new FatalResult({ message: JSON.stringify(err) });
  }
};


class Result implements APIGatewayProxyResult {
  public statusCode = 200;
  public headers: { [header: string]: string } = { 'Access-Control-Allow-Origin': '*' };
  public body: string;

  public constructor(body: object, statusCode?: number, headers?: { [header: string]: string }) {
    this.body = JSON.stringify(body);
    if (statusCode) { this.statusCode = statusCode; }
    if (headers) { this.headers = headers; }
  }
}

class ErrorResult extends Result implements APIGatewayProxyResult {
  public constructor(body: object) {
    super(body, 400);
  }
}

class FatalResult extends Result implements APIGatewayProxyResult {
  public constructor(body: object) {
    super(body, 500);
  }
}
