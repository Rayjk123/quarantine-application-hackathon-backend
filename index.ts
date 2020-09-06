import * as AWS from 'aws-sdk';

AWS.config.apiVersions = {
    dynamodb: '2012-08-10'
};
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {authUser} from "./service/authService";
import {registerUser} from "./service/registerService";
import {setupGeofence} from "./service/geofenceService";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello World Panda'
    };

    console.log('BELOW IS THE EVENT');
    console.log(JSON.stringify(event));

    if (event.httpMethod === 'POST') {
        console.log('Post Method is called');
        if (event.body === null) {
            response.statusCode = 400;
            response.body = 'Username and Password are required';
            return response;
        }
        const requestBody = JSON.parse(event.body);
        if (event.path === '/auth') {
            return await authUser(requestBody.phoneNumber, requestBody.password);
        }

        return await registerUser(requestBody);
    }

    // GeoFence
    if (event.httpMethod === 'PUT') {
        console.log('PUT Method is called');
        if (event.body === null) {
            response.statusCode = 400;
            response.body = 'Username and Password are required';
            return response;
        }
        const requestBody = JSON.parse(event.body);
        return await setupGeofence(requestBody);
    }

    return response;
};
