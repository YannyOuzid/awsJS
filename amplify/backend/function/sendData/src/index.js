const {getSecret} = require('/opt/nodejs/utils')

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    await getSecret('awsJsprofil', event.headers['x-api-key'])
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
