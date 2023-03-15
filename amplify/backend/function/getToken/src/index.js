const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, ScanCommand, PutCommand} = require("@aws-sdk/lib-dynamodb");
const {checkSecret, createSecret} = require('/opt/nodejs/utils')
const {v4: uuidv4} = require("uuid")

exports.handler = async (event) => {
  await checkSecret('awsJsprofil', event.headers['x-api-key'])
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  const client = new DynamoDBClient();
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  let response;

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
      const item = {
        id1: uuidv4(),
        lastname: body.lastname,
        firstname: body.firstname,
        age: body.age
      }

      // Create token in secrets manager
      const token = uuidv4();
      await createSecret(token, 'pk', item.id1);

      // Save user in DB
      await ddbDocClient.send(new PutCommand({
        TableName: process.env.STORAGE_AWSJSDB_NAME,
        Item: item
      }))

      response = {
        statusCode: 200,
        body: JSON.stringify({
          user: item,
          token
        })
      }
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
