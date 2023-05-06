const axios = require('axios');
API_URL = "http://localhost:5000/api"
test('test api', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/test`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp).toEqual('The API is working!');
        });
});
test('test nodes array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/nodes`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp[0].nodeId).toEqual(1);
        });
});
test('test nodes array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/nodes/1`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp[0].location).toEqual('Edison');
        });
});
test('test audits array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/audits`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp[0].userName).toEqual('admin');
        });
});