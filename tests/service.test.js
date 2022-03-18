const request = require("supertest");
const path = require('path');
const app = require("../src/app");
const User = require("../src/models/user");
const Service = require("../src/models/service");
const { uploadFile, getFileStream } = require("../src/helpers/s3");
const fs = require('fs')
const {S3} = require('aws-sdk')
const { PassThrough } = require('stream')

const {
  normalUserId,
  normalUser,
  setupDatabase,
  adminUserId,
  adminUser,
  serviceRefurbish,
  resetDatabase
} = require("./fixtures/db");

beforeEach(setupDatabase);

afterAll(resetDatabase);

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
  await request(app)
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

const mockReadable = new PassThrough()

jest.mock('../src/helpers/s3', () => {
  return {
    uploadFile: jest.fn().mockReturnThis(),
    getObject: jest.fn().mockReturnThis(),
    getFileStream: jest.fn().mockImplementation(() => mockReadable),
 };
});

describe("Operation on service image", () => {
  const image = path.resolve(__dirname, `./fixtures/image.jpg`);
  let service;

  beforeAll(async () => {
    service = await Service.findById(serviceRefurbish._id)
  });
  
  test('Should be able to update service image', async () => {
    expect(service.picture_link).toBeUndefined()

    await request(app)
      .post(`/v1/services/picture/${serviceRefurbish._id}`)
      .set('content-type', 'application/octet-stream')
      .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
      .attach('image', image)
      .expect(200);

    expect(uploadFile).toHaveBeenCalledTimes(1)
    service = await Service.findById(serviceRefurbish._id)
    
    expect(service.picture_link).toBeTruthy()
  })

  // test('Should be able to get service image', async () => {

  //   await request(app)
  //   .get(`/v1/images/${service.picture_link}`)
  //   .expect(response => {console.log(response)})
  //   .expect(200);

  //   setTimeout(() => {
  //     mockReadable.emit('data', 'beep!')
  //     mockReadable.emit('end')
  //   }, 100)

  //   expect(getFileStream).toHaveBeenCalledTimes(1)

  // })

  test('Should be able to delete service image', async () => { 
    await request(app)
    .delete(`/v1/services/picture/${serviceRefurbish._id}`)
    .set("Authorization", `Bearer ${adminUser.tokens[0].token}`)
    .expect(200);
    service = await Service.findById(serviceRefurbish._id)

    expect(service.picture_link).toBeUndefined()
  })
});