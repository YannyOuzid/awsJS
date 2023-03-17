/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_BUCKETNODE_BUCKETNAME
	STORAGE_USERDB_ARN
	STORAGE_USERDB_NAME
	STORAGE_USERDB_STREAMARN
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const https = require('https');
const url = require('url');

const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  let response;
  try {
    // Read document name from event
    const documentName = event.Records[0].s3.object.key

    // Download document from S3
    const s3Object = await s3.getObject({
      Bucket: process.env.STORAGE_BUCKETNODE_BUCKETNAME,
      Key: documentName
    }).promise();
    console.log('s3Object', s3Object);
    const document = JSON.parse(s3Object.Body);

    // Read user id from document
    const userId = document[0].user_uuid;

    // Read webhook url from DDB
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

    const webhook = item.webhook;
    if (webhook === undefined) {
      throw new Error('No webhook url');
    }

    // Send data to webhook url
    const URL = new url.parse(webhook);
    const options = {
      hostname: URL.hostname,
      path: URL.pathname,
      method: 'POST',
      body: JSON.stringify(document),
    }
    const res = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.on('data', (d) => {
          process.stdout.write(d)
        })
        res.on('end', () => {
          resolve(res)
        })
      })
      req.on('error', (e) => {
        reject(e)
      })
      req.write(options.body)
      req.end()
    });

    response = {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (e) {
    console.error(e);
    response = {
      statusCode: 500,
      body: e.message,
    }
  }

  return response;
};
