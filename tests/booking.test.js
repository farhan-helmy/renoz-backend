const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const Service = require("../src/models/service");
const {
  normalUserId,
  normalUser,
  setupDatabase,
  adminUserId,
  adminUser,
  serviceRefurbish,
  bookingId,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create booking", async () => {
  await request(app)
    .post("/booking")
    .set("Authorization", `Bearer ${normalUser.tokens[0].token}`)
    .send({
      service_id: serviceRefurbish._id,
    })
    .expect(201);
});

test("Should get one booking", async () => {
  await request(app)
    .get(`/booking/${bookingId}`)
    .set("Authorization", `Bearer ${normalUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Admin should get all booking", async () => {
  await request(app)
    .get(`/booking`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Normal user should not get all booking", async () => {
  await request(app)
    .get(`/booking`)
    .set("Authorization", `Bearer ${normalUser.tokens[0].token}`)
    .send()
    .expect(401);
});
