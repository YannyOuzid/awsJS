/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_FILEUPLOAD_NAME
	FUNCTION_UPLOADDYNAMO_NAME
	REGION
Amplify Params - DO NOT EDIT */
//const {checkSecret, getSecret} = require('/opt/nodejs/utils')
const AWS = require('aws-sdk');

const lambdaNames = { DB: process.env.FUNCTION_UPLOADDYNAMO_NAME, S3: process.env.FUNCTION_FILEUPLOAD_NAME };

const lambda = new AWS.Lambda();

exports.handler = async (event) => {
  console.log('event', event);
  let response;
  try {
    //await checkSecret('awsJsprofil', event.headers['x-api-key']);
    //const userId = await getSecret(event.headers['x-user-token'], 'pk');

    const {db, data} = JSON.parse(event.body);

    if (db === undefined) {
      throw new Error('No db specified');
    }
    if (data === undefined) {
      throw new Error('No data');
    }

    const lambdaParams = {
      FunctionName: lambdaNames[db],
      Payload: JSON.stringify({body: {user_uuid: '123', file_content: data}})
    }
    
    const body = await lambda.invoke(lambdaParams).promise();

    response = {
      statusCode: 200,
      body: JSON.parse(body.Payload).body
    }
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: JSON.stringify({error: e.message}, null, 2)
    };
  }

  return response;
};
