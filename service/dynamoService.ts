import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

export const validateUser = async (phoneNumber: string, password: string) => {
    const query = {
        Key: {
            'phoneNumber': {
                S: phoneNumber
            }
        },
        TableName: 'quarantineApplication'
    };
    const user = await dynamoDb.getItem(query).promise();
    if (user === null || Object.keys(user).length === 0 || !user.Item) {
        return null;
    }

    return {
        isAdmin: user.Item.isAdmin.BOOL,
        validUser: user.Item.password.S === password,
        user
    };
};

export const upsertUser = async (item: any) => {
    const query = {
        Item: item,
        TableName: 'quarantineApplication'
    };
    const result = await dynamoDb.putItem(query).promise();
    if (result.$response.httpResponse.statusCode !== 200) {
        return false;
    }

    return true;
};

export const updateQuarantineTime = async (phoneNumber: string, quarantineTime: number, longitude?: number, latitude?: number) => {
    const query: any = {
        Key: {
            'phoneNumber': {
                S: phoneNumber
            }
        },
        ExpressionAttributeValues: {
            ':qt': {N: quarantineTime.toString(10)},
            ':lg': {N: (longitude || 0).toString(10)},
            ':lt': {N: (latitude || 0).toString(10)},
        },
        ReturnValues: "ALL_NEW",
        TableName: 'quarantineApplication',
        UpdateExpression: `set quarantineTime = :qt, longitude = :lg, latitude = :lt`
    };
    const result = await dynamoDb.updateItem(query).promise();
    if (result.$response.httpResponse.statusCode !== 200) {
        return false;
    }

    console.log(`Successfully upserted user: ${JSON.stringify(result)}`);
    return true;
};

export const updateViolation = async (phoneNumber: string) => {
    var date = new Date();
    const query: any = {
        Key: {
            'phoneNumber': {
                S: phoneNumber
            }
        },
        ExpressionAttributeValues: {
            ':vt': {N: date.getTime().toString(10)},
            ':v': {BOOL: true},
        },
        ReturnValues: "ALL_NEW",
        TableName: 'quarantineApplication',
        UpdateExpression: `set violationTime = :vt, violated = :v`
    };
    const result = await dynamoDb.updateItem(query).promise();
    if (result.$response.httpResponse.statusCode !== 200) {
        return false;
    }

    console.log(`Successfully upserted violation Time: ${JSON.stringify(result)}`);
    return true;
};

export const getQuarantineTime = async (phoneNumber: string) => {
    const query = {
        Key: {
            'phoneNumber': {
                S: phoneNumber
            }
        },
        TableName: 'quarantineApplication'
    };
    const user = await dynamoDb.getItem(query).promise();
    if (user === null || Object.keys(user).length === 0 || !user.Item) {
        return null;
    }

    return user.Item.quarantineTime.N;
};
