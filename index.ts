import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Hello World!');

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello World Panda'
    };

    return response;
};
