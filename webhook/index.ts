import * as AWS from 'aws-sdk';

AWS.config.apiVersions = {
    dynamodb: '2012-08-10'
};
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {updateViolation} from "../service/dynamoService";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello World Panda'
    };

    console.log('BELOW IS THE EVENT');
    console.log(JSON.stringify(event));

    if (event.body === null) {
        response.statusCode = 400;
        return response;
    }
    const requestBody = JSON.parse(event.body);

    if (requestBody.event.type === 'user.exited_geofence') {
        const phoneNumber = requestBody.event.user.userId;
        const result = await updateViolation(phoneNumber);
        if (!result) {
            response.statusCode = 500;
            response.body = 'Failed to update Violation information'
        }
    }

    return response;
};
