require("./setup");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");

describe("Transactions API", () => {
  let token;

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany();
    }
  });

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Tx User",
        email: "tx@taxpal.com",
        password: "password123",
        country: "United States",
      });
    token = res.body.data.token;
  });

  it("creates and lists transactions", async () => {
    const createRes = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "expense",
        amount: 50,
        category: "Food",
        date: "2026-03-01",
      });

    expect(createRes.status).toBe(201);

    const listRes = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.data.length).toBe(1);
    expect(listRes.body.data.pagination.total).toBe(1);
  });

  it("rejects invalid category", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "expense",
        amount: 50,
        category: "NonExistent",
        date: "2026-03-01",
      });

    expect(res.status).toBe(400);
  });
});
