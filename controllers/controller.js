const { getTopics, getEndpoints } = require("../models/model")

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