const connection = require("../db/connection");
const endpoints = require("../endpoints.json");
const fs = require("fs");

exports.getTopics = async () => {
  try {
    const query = await connection.query(`
        SELECT * FROM topics;
        `);

    const { rows } = query;

    // sort by date descending order

    const sortedRows = rows.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });

    return rows;
  } catch (err) {
    console.log(err);
  }
};

exports.getEndpoints = async () => {
  try {
    return endpoints;
  } catch (err) {
    console.log(err);
  }
};

exports.getSingleArticle = async (article_id) => {
  try {
    const query = await connection.query(`
        SELECT * FROM articles WHERE article_id = ${article_id}
        `);
    const { rows } = query;

    if (rows.length === 0) {
      return Promise.reject({ msg: "Article ID not found" });
    }

    return rows;
  } catch (err) {
    console.log(err);
  }
};

exports.getArticles = async () => {
  try {
    const query = await connection.query(`
        SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;
        `);

    const { rows } = query;

    return rows;
  } catch (err) {}
};

exports.getAllComments = async (article_id) => {
  try {
    const query = await connection.query(`

        SELECT * FROM comments WHERE article_id = ${article_id};

        `);

    const { rows } = query;

    if (rows.length === 0) {
      return Promise.reject({ msg: "no comments found for article ID" });
    }

    const sortedComments = rows.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return sortedComments;
  } catch (err) {}
};

exports.postSingleComments = async (article_id, body) => {
  // console.log(body)

  // only need body, article_id, author/username

  try {
    const query = await connection.query(`
        INSERT INTO comments(body, article_id, author)

        VALUES ('${body.body}', '${article_id}', '${body.username}')

        RETURNING *;
        `);
    return { body: query.rows[0].body };
  } catch (err) {
    return Promise.reject({ msg: "Article ID not found" });
  }
};

exports.patchVotes = async (article_id, body) => {
  // console.log(article_id, 'article model')
  // console.log(body, 'body model')
  try {
    const currentVotes = await connection.query(`
        SELECT votes FROM articles WHERE article_id = ${article_id}
        `);

    let currentVoteNumber = currentVotes.rows[0].votes;

    const newVoteNum = (currentVoteNumber += body.inc_votes);

    const query = await connection.query(`
        UPDATE articles SET votes = ${newVoteNum} WHERE article_id = ${article_id};
        `);

    const updatedArticle = await connection.query(`
        SELECT * FROM articles WHERE article_id = ${article_id}
        `);

    const { rows } = updatedArticle;

    return rows;
  } catch (err) {
    return Promise.reject({ msg: "Article ID not found" });
  }
};

exports.deleteSingleComment = async (comment_id) => {
  try {
    const query = await connection.query(`
        DELETE FROM comments WHERE comment_id = ${comment_id};
        `);

    const { rowCount } = query;

    if (rowCount === 0) {
      throw new Error(404);
    }

    // if rowcount === 0, nothing deleted
  } catch (err) {
    console.log(err, "ERROR");
  }
};

exports.getAllUsers = async () => {
  try {
    const query = await connection.query(`
        SELECT * FROM users;
        `);

    const { rows } = query;

    return rows;
  } catch (err) {
    console.log(err);
  }
};
