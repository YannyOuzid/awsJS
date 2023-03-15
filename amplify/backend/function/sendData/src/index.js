/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const {getSecret} = require('/opt/nodejs/utils')

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  let response;

  try {
    await getSecret('awsJsprofil', event.headers['x-api-key']);
    const userId = await getSecret(event.headers['x-user-token'], 'pk');

    const {db, data} = JSON.parse(event.body);

    response = {
      statusCode: 200,
      body: JSON.stringify({userId, db, data})
    }
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: JSON.stringify({error: e.message})
    };
  }

  return response;
};
