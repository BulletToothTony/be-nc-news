const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");

const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
  return db.end();
});

beforeAll(() => {
  return seed(testData);
});

describe("app /api/topics returns 200", () => {
  describe("/api/topics", () => {
    describe("GET /api/topics returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/topics").expect(200);
      });
    });

    test("Will return array of objects, containing slug and description properties", () => {
      return request(app).get("/api/topics").expect(200).then(({body}) => {
        body.forEach((topic) => {
            // console.log(topic)
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            })
        })
      })
    });
  });
});

describe("app /api/ returns 200", () => {
    describe("/api/", () => {
      describe("GET /api/ returns 200", () => {
        test("status code: 200", () => {
          return request(app).get("/api/topics").expect(200);
        });
      });
  
      test("Will return object, containing slug and description properties", () => {
        return request(app).get("/api/").expect(200).then(({body}) => {
          expect(body).toEqual({
            "GET /api": {
              "description": "serves up a json representation of all the available endpoints of the api"
            },
            "GET /api/topics": {
              "description": "serves an array of all topics",
              "queries": [],
              "exampleResponse": {
                "topics": [{ "slug": "football", "description": "Footie!" }]
              }
            },
            "GET /api/articles": {
              "description": "serves an array of all articles",
              "queries": ["author", "topic", "sort_by", "order"],
              "exampleResponse": {
                "articles": [
                  {
                    "title": "Seafood substitutions are increasing",
                    "topic": "cooking",
                    "author": "weegembump",
                    "body": "Text from the article..",
                    "created_at": "2018-05-30T15:59:13.341Z",
                    "votes": 0,
                    "comment_count": 6
                  }
                ]
              }
            }
          })
        })
      });
    });
  });
  
  describe("4. GET /api/articles/:article_id", () => {
    describe("/api/articles/:article_id", () => {
      describe("GET /api/topics returns 200", () => {
        test("status code: 200", () => {
          return request(app).get("/api/topics").expect(200);
        });
      });
  
      test("Will return array of objects, containing slug and description properties", () => {
        return request(app).get("/api/articles/1").expect(200).then(({body}) => {
          expect(body[0]).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
          })
        })
      });
      test('Will return 404 when invalid ID given', () => {
        return request(app).get('/api/articles/999').expect(404).then(({body}) => {
            expect(body.msg).toEqual('Article ID not found')
        })
      })
    });
  });