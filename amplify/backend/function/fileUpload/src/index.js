const { writeFileSync, readFileSync } = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        writeFileSync('./test.json', JSON.stringify(event, null, 2), "utf8");
        console.log("Data successfully saved");
    } catch (error) {
        console.log("An error has occurred ", error);
    }

      
      const upload = await s3.upload({
        Bucket: 'awscoursjs',
        Key: 'test.json',
        Body: JSON.stringify(event, null, 2),
      }).promise()

      console.log(upload)
    
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
