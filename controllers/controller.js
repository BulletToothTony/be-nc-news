const { getTopics, getEndpoints, getSingleArticle } = require("../models/model")

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
        console.log(err)
        next(err)
    }
}