import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { name, version } from '../../package.json';


/**
 * System Web API's AWS Lambda handler function.
 *
 * @param event – event data.
 * @see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 */
export const handle: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.debug('Starting Lambda handler: event=%s', JSON.stringify(event));
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      name,
      version
    })
  };
};
