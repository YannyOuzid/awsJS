/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_BUCKETNODE_BUCKETNAME
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const {v4: uuidv4} = require("uuid")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    let fileName = uuidv4();

    const item = {
        Bucket: process.env.STORAGE_BUCKETNODE_BUCKETNAME,
        Key: fileName + '.json',
        Body: JSON.stringify(event, null, 2),
    }

    const upload = await s3.upload(item).promise()

    const getObjectParams = {
        Bucket: process.env.STORAGE_BUCKETNODE_BUCKETNAME,
        Key: fileName + '.json'
    }

    const client = new S3Client();
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log(url)
    
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
        body: JSON.stringify(url),
    };
};
