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
  serviceRefurbish
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create service", async () => {
  await request(app)
    .post("/v1/service")
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .send({
      service_name: "Refursbish",
      description: "From my test",
    })
    .expect(201);
});

test("Should not create service (not admin)", async () => {
  await request(app)
    .post("/v1/service")
    .set("Authorization", `Bearer ${normalUser.tokens[0].token}`)
    .send({
      service_name: "Refursbish",
      description: "From my test",
    })
    .expect(401);
});

test("Should get all services", async () => {
  const response = await request(app)
    .get("/v1/services")
    .set("Authorization", `Bearer ${normalUser.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(1);
});

test("Should get one service", async () => {
  const response = await request(app)
    .get(`/v1/services/${serviceRefurbish._id}`)
    .set("Authorization", `Bearer ${normalUser.tokens[0].token}`)
    .send()
    .expect(200);

});


test("Admin should update valid service field", async () => {
    await request(app)
      .patch(`/v1/services/${serviceRefurbish._id}`)
      .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
      .send({
        service_name: "Refursbish2"
      })
      .expect(200);
      const service = await Service.findById(serviceRefurbish._id)
    
      expect(service.service_name).toEqual('Refursbish2')
  });
