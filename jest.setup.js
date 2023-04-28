const { WebSocket } = require("ws");
const fetchMock = require("jest-fetch-mock");
global.WebSocket = WebSocket;

fetchMock.enableMocks();