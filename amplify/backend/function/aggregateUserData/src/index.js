/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_FILEUPLOAD_NAME
	REGION
	STORAGE_UPLOADDB_ARN
	STORAGE_UPLOADDB_NAME
	STORAGE_UPLOADDB_STREAMARN
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();
const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  let response;

  try {
    const messages = event.Records.map(record => record.body);

    const promises = [];
    for (const userId of messages) {
      console.log(`user id: ${JSON.stringify(userId)}`);

      // Read user data from ddb
      const {Items: documents} = await dynamo.query({
        TableName: process.env.STORAGE_UPLOADDB_NAME,
        IndexName: 'user_uuid__',
        KeyConditionExpression: 'user_uuid = :user_uuid',
        ExpressionAttributeValues: {
          ':user_uuid': userId
        }
      }).promise();
      console.log(`documents: ${JSON.stringify(documents)}`);


      // Upload in S3
      const lambdaParams = {
        FunctionName: process.env.FUNCTION_FILEUPLOAD_NAME,
        Payload: JSON.stringify({body: documents})
      }
      promises.push(lambda.invoke(lambdaParams).promise());
    }

    const s3Responses = await Promise.all(promises);

    response = {
      statusCode: 200,
      body: JSON.stringify(s3Responses),
    }

  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: e.message,
    }
  }

  return response;
};

