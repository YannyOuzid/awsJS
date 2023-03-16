/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_BUCKETNODE_BUCKETNAME
Amplify Params - DO NOT EDIT */const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const {v4: uuidv4} = require("uuid")

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

    console.log(upload)
    
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
        body: JSON.stringify(upload.Location),
    };
};
