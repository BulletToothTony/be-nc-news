const express = require("express");
const {
  getAllTopics,
  getApiEndpoints,
  getArticle,
  getAllArticles,
  getAllCommentsArticle,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
  getArticleTopic,
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

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)


// Custom Errors
app.use((err, req, res, next) => {
    // console.log(err)
  res.status(404).send(err);
// if  
});

// PSQL Errors

// All Else

module.exports = app;
