const express = require("express");
const { getAllTopics, getApiEndpoints, getArticle } = require("./controllers/controller");

const app = express();

app.get('/api/topics', getAllTopics)

app.get('/api', getApiEndpoints)

app.get('/api/articles/:article_id', getArticle)

app.use((err, req, res, next) => {
    res.status(404).send(err)
})

module.exports = app;