const {
  getTopics,
  getEndpoints,
  getSingleArticle,
  getArticles,
  getAllComments,
  postSingleComments,
  patchVotes,
  deleteSingleComment,
  getAllUsers,
  getUser,
  patchSingleComment,
} = require("../models/model");

exports.getAllTopics = async (req, res, next) => {
  try {
    const allTopics = await getTopics();

    res.status(200).send(allTopics);
  } catch (err) {
    next(err);
  }
};

exports.getApiEndpoints = async (req, res, next) => {
  try {
    const apiEndpoints = await getEndpoints();

    res.status(200).send(apiEndpoints);
  } catch (err) {
    next(err);
  }
};

exports.getArticle = async (req, res, next) => {
  const { article_id } = req.params;

  const numId = Number(article_id);

  try {
    const singleArticle = await getSingleArticle(numId);

    res.status(200).send(singleArticle);
  } catch (err) {
    next(err);
  }
};

exports.getAllArticles = async (req, res, next) => {
  const { query } = req;
  const {sort_by} = req;
  const {order} = req

  try {
    const allArticles = await getArticles(query, sort_by, order);

    res.status(200).send({ articles: allArticles });
  } catch (err) {
    next(err);
  }
};

exports.getAllCommentsArticle = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const allComments = await getAllComments(article_id);

    res.status(200).send(allComments);
  } catch (err) {
    console.log(err, "cont");
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  try {
    const postedComment = await postSingleComments(article_id, body);

    res.status(201).send(postedComment);
  } catch (err) {
    next(err);
  }
};

exports.patchVotes = async (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  try {
    const patchedArticle = await patchVotes(article_id, body);

    res.status(201).send(patchedArticle);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    const deleted = await deleteSingleComment(comment_id);

    res.status(204).send(deleted);
  } catch (err) {
    console.log(err, "error controller");
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();

    res.status(200).send(allUsers);
  } catch (err) {
    next(err);
  }
};

exports.getSingleUser = async(req, res, next) => {
    const {username} = req.params

    try {

        const singleUser = await getUser(username)
    
        res.status(200).send(singleUser)
    
    }
    catch(err) {
        next(err)
    }

}

exports.patchComments = async(req, res, next) => {
    const { comment_id} = req.params
    const { body } = req;

    try {
      const patchedComment = await patchSingleComment(comment_id, body);
  
      res.status(201).send(patchedComment);
    } catch (err) {
      next(err);
    }
}