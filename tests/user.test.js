const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const {
    normalUserId,
    normalUser,
    setupDatabase,
    adminUser
} = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'farhandota',
        email: 'farhandota@example.com',
        address: 'jalan bnangi',
        phone_no: 1234145,
        house_type: "kondominium",
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'farhandota',
            email: 'farhandota@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: normalUser.email,
        password: normalUser.password
    }).expect(200)
    const user = await User.findById(normalUserId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: normalUser.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${normalUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should get all user', async () => {
    const response = await request(app)
        .get('/users/all')
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${normalUser.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(normalUserId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${normalUser.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)
    const user = await User.findById(normalUserId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${normalUser.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})