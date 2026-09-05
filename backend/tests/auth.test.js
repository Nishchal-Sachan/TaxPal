require("./setup");
const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@taxpal.com",
        password: "password123",
        country: "India",
      });
    token = res.body.data.token;
  });

  it("registers a new user with default categories", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "another@taxpal.com",
        password: "password123",
        country: "India",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
  });

  it("logs in existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@taxpal.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it("gets current user profile", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Test User");
  });

  it("rejects invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@taxpal.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });
});
