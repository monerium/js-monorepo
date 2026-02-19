const fetchMock = require('jest-fetch-mock');
global.fetch = fetchMock;
fetchMock.dontMock();
