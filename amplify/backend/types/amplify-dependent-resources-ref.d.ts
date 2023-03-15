export type AmplifyDependentResourcesAttributes = {
    "function": {
        "getToken": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        },
        "awsjsutils": {
            "Arn": "string"
        },
        "sendData": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "storage": {
        "awsJSDB": {
            "Name": "string",
            "Arn": "string",
            "StreamArn": "string",
            "PartitionKeyName": "string",
            "PartitionKeyType": "string",
            "SortKeyName": "string",
            "SortKeyType": "string",
            "Region": "string"
        },
        "dataStorage": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "api": {
        "awsJSapi": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "auth": {
        "awsjsf81cbd6a": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    }
}