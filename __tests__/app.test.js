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
            console.log(topic)
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            })
        })
      })
    });
  });
});
