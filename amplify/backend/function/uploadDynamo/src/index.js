const dynamodb = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'awscoursjs',
    Item: {
        id: Date.now(),
        payload: JSON.stringify(event, null, 2)
    }
};

await dynamodb.put(params).promise();

console.log(`EVENT: ${JSON.stringify(event)}`);

return {
    statusCode: 200,
    // Uncomment below to enable CORS requests
    // headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Headers": "*"
    // },
    body: JSON.stringify('Hello from Lambda!')
};

