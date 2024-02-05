const cors = require('cors');

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
  getSingleUser,
  patchComments,
  postArticle,
} = require("./controllers/controller");

const app = express();
app.use(cors());
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

app.get("/api/users/:username", getSingleUser)

app.patch("/api/comments/:comment_id", patchComments)

app.post("/api/articles", postArticle)


// Custom Errors
app.use((err, req, res, next) => {

    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }

});

// PSQL Errors

// All Else

module.exports = app;
