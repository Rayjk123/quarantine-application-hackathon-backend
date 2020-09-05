import {validateUser} from "./dynamoService";
import {APIGatewayProxyResult} from "aws-lambda";

export const authUser = async (phoneNumber: string, password: string): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: ''
    };
    let user;
    try {
        user = await validateUser(phoneNumber, password);
    } catch (error) {
        response.statusCode = 500;
        response.body = 'An error occurred while trying to retrieve the user';
        return response;
    }
    if (user === null) {
        response.statusCode = 404;
        response.body = 'User not found';
        return response;
    }
    response.body = JSON.stringify(user);
    return response;
};
