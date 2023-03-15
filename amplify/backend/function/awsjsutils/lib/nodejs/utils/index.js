// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

const {SecretsManagerClient} = require("@aws-sdk/client-secrets-manager");

const secretManagerClient = new SecretsManagerClient()

exports.getSecret = async (secretName, secretKey) => {
  const response = await secretManagerClient.getSecretValue({
    SecretId: secretName
  }).promise()
  const secretValues = response.SecretString

  if (!secretValues) {
    throw new Error('No keys detected')
  }

  const secretJson = JSON.parse(secretValues)
  const secretKeyValue = secretJson[secretKey]

  if (!secretKeyValue) {
    throw new Error(`No such key: ${secretKey}`)
  }

  if (secretName !== secretKeyValue) {
    throw new Error(`Wrong Authentication Key`)
  }

  return secretKeyValue
}

exports.createSecret = (secretName, secretKey, secretValue) =>
  secretManagerClient.createSecret({
    Name: secretName,
    SecretString: JSON.stringify({[secretKey]: secretValue})
  }).promise()
