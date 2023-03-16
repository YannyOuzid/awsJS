/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_UPLOADDYNAMO_NAME
	REGION
	STORAGE_USERDB_ARN
	STORAGE_USERDB_NAME
	STORAGE_USERDB_STREAMARN
Amplify Params - DO NOT EDIT */
const {checkSecret, getSecret} = require('/opt/nodejs/utils')
const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();
const dynamo = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  console.log('event', event);
  let response;
  try {
    await checkSecret('awsJsprofil', event.headers['x-api-key']);
    const userId = await getSecret(event.headers['x-user-token'], 'pk');

    const {webhook, data} = JSON.parse(event.body);

    if (webhook === undefined) {
      throw new Error('No db specified');
    }
    if (data === undefined) {
      throw new Error('No data');
    }

    // Save webhook url in DDB
    const found = await dynamo.get({
      TableName: process.env.STORAGE_USERDB_NAME,
      Key: {
        id: userId
      }
    }).promise();
    console.log('found', found);

    const item = found.Item;
    if (item === undefined) {
      throw new Error('User not found');
    }

    dynamo.update({
      TableName: process.env.STORAGE_USERDB_NAME,
      Key: {
        id: userId
      },
      UpdateExpression: 'set webhook = :webhook',
      ExpressionAttributeValues: {
        ':webhook': webhook
      }
    });

    // Save data in DDB
    const lambdaParams = {
      FunctionName: process.env.FUNCTION_UPLOADDYNAMO_NAME,
      Payload: JSON.stringify({body: {user_uuid: userId, file_content: data}})
    }
    const dataResponse = await lambda.invoke(lambdaParams).promise();
    console.log('dataResponse', dataResponse);

    // Send user id to SQS
    const sqsParams = {
      MessageBody: userId,
      QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/314161511803/awsJsSqs',
    };
    const sqsResponse = await sqs.sendMessage(sqsParams).promise();
    console.log('sqsResponse', sqsResponse);

    // Prepare response
    response = { statusCode: 200 }
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: JSON.stringify({error: e.message}, null, 2)
    };
  }

  return response;
};
