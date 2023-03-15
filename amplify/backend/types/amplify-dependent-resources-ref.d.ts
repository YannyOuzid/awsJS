export type AmplifyDependentResourcesAttributes = {
  "api": {
    "awsJSapi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "awsjsf81cbd6a": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "awsjsutils": {
      "Arn": "string"
    },
    "getToken": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "sendData": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "awsJSDB": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "SortKeyName": "string",
      "SortKeyType": "string",
      "StreamArn": "string"
    },
    "dataStorage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}