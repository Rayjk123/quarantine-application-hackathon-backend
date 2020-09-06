import {APIGatewayProxyResult} from "aws-lambda";
import axios from 'axios';
import {updateQuarantineTime} from "./dynamoService";
import exp from "constants";

const FOURTEEN_DAYS_IN_MILLISECONDS = 1209600000;

export const setupGeofence = async (requestBody: any): Promise<APIGatewayProxyResult> => {

    const longitude = requestBody.longitude;
    const latitude = requestBody.latitude;
    const phoneNumber = requestBody.phoneNumber;
    const tag = 'quarantineApplication';

    const url = `https://api.radar.io/v1/geofences/${tag}/${phoneNumber}`;

    var date = new Date();
    var expireTimeInMilliseconds = date.getTime() + FOURTEEN_DAYS_IN_MILLISECONDS;

    const body = {
        description: `Geofence for ${phoneNumber}`,
        type: 'circle',
        coordinates: `[${longitude},${latitude}]`,
        radius: 50,
        tag,
        externalId: phoneNumber,
        userId: phoneNumber,
        deleteAfter: new Date(expireTimeInMilliseconds).toISOString()
    };

    try {
        const response = await axios.put(url, body, {
            headers: { Authorization: 'prj_live_sk_6c1ba79f31b2521f1004eefd87294bfe7846b12a' }
        });
        console.log(`GeoFence Success Response: ${response}`);
    } catch (error) {
        console.log('Ran into an Error on Upserting Geofence Data', error);
        return {
            statusCode: 500,
            body: 'Ran into an Error on Upserting Geofence Data'
        };
    }

    await updateQuarantineTime(phoneNumber, expireTimeInMilliseconds, longitude, latitude);

    return {
        statusCode: 200,
        body: 'Success'
    };
};
