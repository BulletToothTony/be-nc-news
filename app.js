const express = require("express");
const {
  getAllTopics,
  getApiEndpoints,
  getArticle,
  getAllArticles,
  getAllCommentsArticle,
  postComment,
  patchVotes,
} = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getApiEndpoints);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes)

app.use((err, req, res, next) => {
  res.status(404).send(err);
});


module.exports = app;
