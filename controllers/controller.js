const { getTopics, getEndpoints, getSingleArticle, getArticles, getAllComments, postSingleComments, patchVotes } = require("../models/model")

exports.getAllTopics = async (req, res) => {
    try {
        const allTopics = await getTopics()

        res.status(200).send(allTopics)
    }

    catch(err) {
        console.log(err)
    }
}


exports.getApiEndpoints = async (req, res) => {
    try {
        const apiEndpoints = await getEndpoints()

        res.status(200).send(apiEndpoints)
    }
    catch(err) {
        console.log(err)
    }
}

exports.getArticle = async (req, res, next) => {
    const {article_id} = req.params

    const numId = Number(article_id)

    try {
        const singleArticle = await getSingleArticle(numId)

        res.status(200).send(singleArticle)
    }

    catch(err) {
        next(err)
    }
}

exports.getAllArticles = async(req, res) => {
   try {
        const allArticles = await getArticles()

        res.status(200).send(allArticles)
   }
   catch(err) {
    console.log(err)
   }
}

exports.getAllCommentsArticle = async (req, res, next) => {
    const {article_id} = req.params


    try {
        const allComments = await getAllComments(article_id)

        res.status(200).send(allComments)
    }

    catch(err) {
        next(err)
    }
}

exports.postComment = async(req, res, next) => {
    const {article_id} = req.params
    const {body} = req

    try {
        const postedComment = await postSingleComments(article_id, body)

        res.status(201).send(postedComment)
    }

    catch(err) {
        next(err)
    }
}

exports.patchVotes = async(req, res, next) => {
    const {article_id} = req.params;
    const {body} = req;

    try {
        const patchedArticle = await patchVotes(article_id, body)

        res.status(201).send(patchedArticle)
    }

    catch(err) {
        next(err)
    }
}