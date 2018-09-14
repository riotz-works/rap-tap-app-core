import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { dependencies, devDependencies, name, version } from '../../package.json';


/**
 * System Web API's AWS Lambda handler function.
 *
 * @param event – event data.
 * @see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 */
export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));
  if (event.queryStringParameters && event.queryStringParameters.detail === 'true') {
    return new Result({ name, version, dependencies, devDependencies });
  }
  return new Result({ name, version });
};


class Result implements APIGatewayProxyResult {

  /** HTTP Status Code to respond. */
  public statusCode: number = 200;

  /** HTTP Headers to respond. */
  public headers: {[ header: string ]: string } = { 'Access-Control-Allow-Origin': '*' };

  /** Response body. */
  public body: string;


  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}
