import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { dependencies, devDependencies, name, version } from '../../package.json';


/**
 * Systems Web API's AWS Lambda handler function.
 *
 * @param event – event data.
 * @see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 */
export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));
  if (event.queryStringParameters && event.queryStringParameters.detail === 'true') {
    return new Result({ name, version, dependencies, devDependencies });
  }
  return Promise.resolve(new Result({ name, version }));
};


class Result implements APIGatewayProxyResult {
  public statusCode = 200;
  public headers: { [header: string]: string } = { 'Access-Control-Allow-Origin': '*' };
  public body: string;

  public constructor(body: object) {
    this.body = JSON.stringify(body);
  }
}
