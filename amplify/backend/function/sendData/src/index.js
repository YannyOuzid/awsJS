/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const {checkSecret, getSecret} = require('/opt/nodejs/utils')
exports.handler = async (event) => {
  let response;
  try {
    await checkSecret('awsJsprofil', event.headers['x-api-key']);
    const userId = await getSecret(event.headers['x-user-token'], 'pk');
    const {db, data} = JSON.parse(event.body);
    response = {
      statusCode: 200,
      body: JSON.stringify({userId, db, data})
    }
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: JSON.stringify({error: e.message})
    };
  }
  return response;
};
