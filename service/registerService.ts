import {APIGatewayProxyResult} from "aws-lambda";
import {upsertUser} from "./dynamoService";

export const registerUser = async (requestBody: any): Promise<APIGatewayProxyResult> => {
    const item: any = {};
    if (requestBody.firstName) { item.firstName = { S: requestBody.firstName }; }
    if (requestBody.lastName) { item.lastName = { S: requestBody.lastName }; }
    if (requestBody.phoneNumber) { item.phoneNumber = { S: requestBody.phoneNumber }; }
    if (requestBody.startTime) { item.startTime = { N: requestBody.startTime }; }
    if (requestBody.quarantineTime) { item.quarantineTime = { N: requestBody.quarantineTime }; }
    if (requestBody.address) { item.address = { S: requestBody.address }; }
    item.isAdmin = { BOOL: false };

    const result = await upsertUser(item);

    if (!result) {
        return {
            statusCode: 400,
            body: 'Failure'
        };
    }

    return {
        statusCode: 200,
        body: 'Success'
    };
};
