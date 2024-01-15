const express = require("express");
const { getAllTopics, getApiEndpoints } = require("./controllers/controller");

const app = express();

app.get('/api/topics', getAllTopics)

app.get('/api', getApiEndpoints)

module.exports = app;