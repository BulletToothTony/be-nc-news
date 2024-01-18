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
    const query = await connection.query(
      `
      SELECT articles.*, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [article_id]
    );
    const { rows } = query;

    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article ID not found" });
    }

    return rows[0];
  } catch (err) {
    console.log(err);
  }
};

exports.getArticles = async (topic = '', sort_by = 'created_at', order = 'desc') => {
  // const validSortQueries = []
  // const queryValues = [];
  // let queryStr = `SELECT articles.*, COUNT(comments) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`

  // if (topic.topic) {
  //   queryValues.push(topic.topic)
  //   queryStr += ` WHERE articles.topic = '${topic.topic}'`
  // }

  // console.log(queryStr)

  // if statement for topics if nothign in topic should get all topics
  // SELECT * FROM articles WHERE topic = 'cats' ORDER BY votes DESC;

  // let queryStr = `SELECT * FROM articles`

  // console.log(queryStr)

  // console.log(topic, '<< topic')
  // console.log(sort_by, ' <<< sort')
  // if (topic === undefined) {
  //   queryStr = queryStr
  // }

  // console.log(queryStr)

  // if (topic.topic) {
  //   queryStr += ` WHERE topic = '${topic.topic}'`
  // }

  // if (sort_by) {
  //   queryStr += ` ORDER BY '${sort_by}'`
  // }

  

  // console.log(queryStr)

  
  // // check if topic exists
  // console.log(topic, sort_by, order)

  // // const testing = await connection.query(`
  // //   ${queryStr}
  // // `)

  // console.log(testing.rows)

 


  try {
    if (topic.topic) {
      const query = await connection.query(`
      SELECT articles.*, COUNT(comments) AS comment_count 
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic = $1
      GROUP BY articles.article_id ORDER BY articles.created_at DESC;
      `, [topic.topic]);

      const { rows } = query;

      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No topics found" });
      }

      return rows;
    } else {
      const query = await connection.query(`
      SELECT articles.*, COUNT(comments) AS comment_count 
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id ORDER BY articles.created_at DESC;
      `);

      const { rows } = query;

      return rows;
    }
  } catch (err) {}
};

exports.getAllComments = async (article_id) => {
  try {
    const query = await connection.query(
      `

        SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;
`,
      [article_id]
    );

    const { rows } = query;

    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no comments found for article ID",
      });
    }
    return rows;
  } catch (err) {}
};

exports.postSingleComments = async (article_id, body) => {
  try {
    const query = await connection.query(`
        INSERT INTO comments(body, article_id, author)

        VALUES ('${body.body}', '${article_id}', '${body.username}')

        RETURNING *;
        `);
    return { body: query.rows[0].body };
  } catch (err) {
    if (err.constraint === "comments_article_id_fkey") {
      return Promise.reject({ status: 404, msg: "Article ID not found" });
    } else if (err.constraint === "comments_author_fkey") {
      return Promise.reject({ status: 404, msg: "Username not found" });
    }
  }
};

exports.patchVotes = async (article_id, body) => {
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
    return Promise.reject({ status: 404, msg: "Article ID not found" });
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
