/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const s3 = new AWS.S3()

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const filename = 'the-file-name'
    const fileContent = 'test'

    const params = {
        Bucket: 'datastorage',
        Key: `${filename}.jpg`,
        Body: fileContent
    }

    s3.upload(params, (err, data) => {
    if (err) {
        reject(err)
    }
    resolve(data.Location)
    })

    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
};
