const connection = require("../db/connection")
const endpoints = require('../endpoints.json')
const fs = require('fs')

exports.getTopics = async () => {
    try {
        const query = await connection.query(`
        SELECT * FROM topics;
        `)

        const {rows} = query

        // sort by date descending order

        const sortedRows = rows.sort((a,b) => {
            return new Date(a.created_at) - new Date(b.created_at)
            
        })

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

exports.getArticles = async() => {
    try {
        const query = await connection.query(`
        SELECT * FROM articles;
        `)

        const {rows} = query


        const sortedRows = rows.sort((a,b) => {
            return new Date(b.created_at) - new Date(a.created_at)
            
        })

        const removedBody = sortedRows.map((article) => {
            let newArticle = {...article}
            delete newArticle.body;
            return newArticle
        })

        return removedBody
    }

    catch(err) {
        
    }
}

exports.getAllComments = async (article_id) => {
    try {
        const query = await connection.query(`

        SELECT * FROM comments WHERE article_id = ${article_id};

        `)

        const {rows} = query

        if (rows.length === 0) {
            return Promise.reject({msg: 'no comments found for article ID'})
        }

        const sortedComments = rows.sort((a,b) => {
            return new Date(b.created_at) - new Date(a.created_at)
            
        })

        return sortedComments
    }

    catch(err) {

    }
}