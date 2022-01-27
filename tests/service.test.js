const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const Service = require("../src/models/service")
const {
    normalUserId,
    normalUser,
    setupDatabase,
    adminUserId,
    adminUser
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create service', async () => {
    await request(app)
        .post('/service')
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send({
            service_name: "Refursbish",
            description: 'From my test'
        })
        .expect(201)
})

test('Should not create service (not admin)', async () => {
    await request(app)
        .post('/service')
        .set('Authorization', `Bearer ${normalUser.tokens[0].token}`)
        .send({
            service_name: "Refursbish",
            description: 'From my test'
        })
        .expect(401)
})