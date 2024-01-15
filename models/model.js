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

exports.getSingleArticle = async(article_id) => {
    try {
        const query = await connection.query(`
        SELECT * FROM articles WHERE article_id = ${article_id}
        `)
        const {rows} = query

        if (rows.length === 0) {
            return Promise.reject({msg: 'Article ID not found'})
        }

        return rows
    }

    

    catch(err) {
        console.log(err)
    }
}