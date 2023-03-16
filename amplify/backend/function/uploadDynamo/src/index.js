/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_UPLOADDB_ARN
	STORAGE_UPLOADDB_NAME
	STORAGE_UPLOADDB_STREAMARN
Amplify Params - DO NOT EDIT */
const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, PutCommand} = require("@aws-sdk/lib-dynamodb");
const {v4: uuidv4} = require("uuid")

exports.handler = async (event) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  const client = new DynamoDBClient();
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  let response;
  try {
    const item = {
      uuid: uuidv4(),
      user_uuid: event.body.user_uuid,
      file_content: JSON.stringify(event.body.file_content),
    }
    // Save item in DB
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.STORAGE_UPLOADDB_NAME,
      Item: item
    }))

    response = {
      statusCode: 200,
      body: JSON.stringify(item)
    }
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: JSON.stringify({error: e.message})
    };
  }

  ddbDocClient.destroy();
  client.destroy();

  return response;
};
