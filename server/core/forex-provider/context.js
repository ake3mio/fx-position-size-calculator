const axios = require('axios');
const url = require('url');

const httpGet = (token, path) => axios.get(url.resolve('https://api-fxtrade.oanda.com', path), {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

const responseToRawBody = (result) => {
    if (result.data) {
        return JSON.stringify(result.data);
    } else if (result.errorMessage) {
        return JSON.stringify(result);
    } else {
        return JSON.stringify({errorMessage: 'No response'});
    }
};

const request = (token) => async (
    method,
    path,
    body,
    _,
    handleResponse
) => {

    let result;

    try {
        switch (method) {
            case 'GET':
                result = await httpGet(token, path);
        }
    } catch (error) {
        result = {
            errorMessage: error.message
        }
    }

    const response = {
        rawBody: responseToRawBody(result),
        contentType: 'application/json',
        statusCode: result.status,
    };

    handleResponse(response);
};

module.exports = {
    request
};
