const {DynamoDBClient, GetItemCommand} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, QueryCommand, ScanCommand} = require("@aws-sdk/lib-dynamodb");
const {getSecret} = require('../../awsjsutils/lib/nodejs/utils')

exports.handler = async (event, context) => {
  await getSecret('awsJsprofil', event.headers['x-api-key'])
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
  });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  let response = {};

  try {

    // Check if the user already exists in DB
    const allItems = await ddbDocClient.send(new ScanCommand({
      TableName: process.env.STORAGE_AWSJSDB_NAME,
    }))
    const body = JSON.parse(event.body);
    const user = allItems.Items.find(item => item.lastname === body.lastname);

    if (user) {
      response = {
        statusCode: 400,
        body: JSON.stringify({error: "User already exists"})
      };
    } else {
      response = {
        statusCode: 200,
        body: "TODO create new user & token"
      };
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
