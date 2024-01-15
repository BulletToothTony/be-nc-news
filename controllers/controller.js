const { getTopics } = require("../models/model")

exports.getAllTopics = async (req, res) => {
    try {
        const allTopics = await getTopics()

        res.status(200).send(allTopics)
    }

    catch(err) {
        console.log(err)
    }
}