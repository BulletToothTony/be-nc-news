const app = require("../app.js");
const request = require("supertest");
const endpoints = require("../endpoints.json");
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
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("3. app /api/ returns 200", () => {
  describe("/api/", () => {
    describe("GET /api/ returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/topics").expect(200);
      });
    });

    test("Will return object, containing slug and description properties", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints);
        });
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
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test("Will return 404 when invalid ID given", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Article ID not found");
        });
    });
  });
});

describe("5. GET /api/articles returns 200", () => {
  describe("/api/articles", () => {
    describe("GET /api/articles returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/articles").expect(200);
      });
    });

    test("Will return array of objects, containting all articles and properties, sorted by date descending", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
        });
    });

    test("Will return array of objects, containting all articles and properties, sorted by date descending", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });
});

describe("6. GET /api/articles/:article_id/comments returns 200", () => {
  describe("/api/articles/:article_id/comments", () => {
    describe("GET /api/articles/1/comments returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
      });
    });

    test("Will return object with correct properties", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body }) => {
          body.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
        });
    });
  });

  test("Will return array of objects, sorted by most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
});

describe("7. POST /api/articles/:article_id/comments", () => {
  describe("POST /api/articles/:article_id/comments", () => {
    describe("POST /api/articles/:article_id/comments returns 201", () => {
      test("status code: 201", () => {
        const body = {
          username: "rogersop",
          body: "Test add to article 10",
        };

        return request(app)
          .post("/api/articles/10/comments")
          .send(body)
          .expect(201);
      });
    });

    test("Will return comment posted to article", () => {
      const body = {
        username: "rogersop",
        body: "Test add to article 10",
      };
      return request(app)
        .post("/api/articles/10/comments")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            body: "Test add to article 10",
          });
        });
    });

    test("Will return 404 if invalid article ID", () => {
      const body = {
        username: "rogersop",
        body: "Test add to article 10",
      };
      return request(app)
        .post("/api/articles/100/comments")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Article ID not found");
        });
    });

    test("Will return 404 if invalid username constraint", () => {
      const body = {
        username: "rogersopINVALID",
        body: "Test add to article 10",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Username not found");
        });
    });
  });
});

describe("8. PATCH /api/articles/:article_id votes", () => {
  describe("/api/articles/:article_id", () => {
    describe("PATCH /api/articles/:article_id returns 201", () => {
      test("status code: 201", () => {
        const body = {
          inc_votes: 10,
        };

        return request(app).patch("/api/articles/10").send(body).expect(201);
      });
    });

    test("Will update article with number of votes incremented", () => {
      const body = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/10")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body[0].votes).toBe(15);
        });
    });

    test("Will update article with number of votes decremented", () => {
      const body = {
        inc_votes: -5,
      };
      return request(app)
        .patch("/api/articles/10")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body[0].votes).toBe(10);
        });
    });

    test("Invalid article ID returns 404 and error message", () => {
      const body = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/999")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID not found");
        });
    });
  });
});

describe("9. DELETE /api/comments/:comment_id returns 204", () => {
  describe("/api/comments/:comment_id", () => {
    describe("DELETE /api/comments/:comment_id returns 204", () => {
      test("status code: 204", () => {
        // Article 9 has comment IDs 1, 17 after deleting should only have comment_id 1
        return request(app)
          .delete("/api/comments/17/")
          .expect(204)
          .then(() => {
            request(app)
              .get("/api/articles/9/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body).toEqual([
                  {
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 9,
                    author: "butter_bridge",
                    votes: 16,
                    created_at: "2020-04-06T12:17:00.000Z",
                  },
                ]);
              });
          });
      });
    });

    test("Invalid ID returns still returns 204 as the there is nothing to delete", () => {
      return request(app).delete("/api/comments/100/").expect(204);
    });
  });
});

describe("10. GET /api/users", () => {
  describe("/api/users", () => {
    describe("GET /api/users/ returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/users/").expect(200);
      });
    });

    test("Returns array of objects ", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          body.forEach((topic) => {
            expect(topic).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("11. GET /api/articles topic query", () => {
  describe("/api/users", () => {
    describe("GET /api/users/ returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/articles?topic=cats").expect(200);
      });
    });
  });

  test("status code: 404", () => {
    return request(app).get("/api/articles?topic=catsSSSS").expect(404).then(({body}) => {
      expect(body).toEqual({msg: 'No topics found'})
    });
  });
});

  test("Returns array of objects ", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((topic) => {
          expect(topic).toMatchObject({
            "article_id": expect.any(Number),
            "title": expect.any(String),
            "topic": expect.any(String),
            "author": expect.any(String),
            "body": expect.any(String),
            "created_at": expect.any(String),
            "votes": expect.any(Number),
            "article_img_url": expect.any(String),
            "comment_count": expect.any(String),
          });
        });
      });
  });

  test("Returns single object for cats ", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          articles: [
            {
              article_id: 5,
              title: 'UNCOVERED: catspiracy to bring down democracy',
              topic: 'cats',
              author: 'rogersop',
              body: 'Bastet walks amongst us, and the cats are taking arms!',
              created_at: '2020-08-03T13:14:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
              comment_count: '2'
            }
          ]
        });
      });
  });

describe("12. GET /api/articles/:article_id (comment_count)", () => {
  describe("/api/articles/:article_id", () => {
    describe("GET /api/articles/:article_id returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
    });

    test("Returns object with comment count included ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).hasOwnProperty({
            comment_count: "11",
          });
        });
    });
  });
});


describe("17. GET /api/users/:username", () => {
  describe("/api/users/:username", () => {
    describe("GET /api/users/:username returns 200", () => {
      test("status code: 200", () => {
        return request(app).get("/api/users/lurker").expect(200);
      });
    });

    test("Returns user object", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            "username": expect.any(String),
            "avatar_url": expect.any(String),
            "name": expect.any(String)
          });
        });
    });

    test("404 for no user", () => {
      return request(app)
        .get("/api/users/fakeuser")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({msg: "Username not found"})
        });
    });
  });
});

describe("18. PATCH /api/comments/:comment_id", () => {
  describe("/api/comments/:comment_id", () => {
    describe("PATCH /api/comments/:comment_id", () => {
      test("status code: 201", () => {

        body = {
          "inc_votes": 5
        }

        return request(app).patch("/api/comments/1").send(body).expect(201);
      });
    });

    test("Will update comments with number of votes incremented", () => {
      const body = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body[0].votes).toBe(22);
        });
    });

    test("Will decrease comment votes", () => {
      const body = {
        inc_votes: -2,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body[0].votes).toBe(20);
        });
    });

    test("Invalid comment ID returns 404 and error message", () => {
      const body = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/comments/999")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment ID not found");
        });
    });
  });
});