const connection = require("../db/connection")
const endpoints = require('../endpoints.json')
const fs = require('fs')

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

exports.getEndpoints = async () => {
    try {

        return endpoints
    }

    catch(err) {
        console.log(err)
    }
}