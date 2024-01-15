const connection = require("../db/connection")

exports.getTopics = async () => {
    try {
        const query = await connection.query(`
        SELECT * FROM topics;
        `)

        const {rows} = query

        return rows;
    }

    catch(err) {
        console.log(err)
    }
}