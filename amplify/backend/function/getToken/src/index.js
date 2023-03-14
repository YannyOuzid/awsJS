const awsServerlessExpress = require('aws-serverless-express');

const {getSecret} = require('../../awsjsutils/lib/nodejs/utils')


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log( await getSecret('awsJsprofil', event.headers['x-api-key']));
  console.log(`EVENT: ${JSON.stringify(event, null, 2)}`);
  console.log(event.headers['x-api-key']);
  
  return {
    status: 200,
    body: 'ok'
  }
};
