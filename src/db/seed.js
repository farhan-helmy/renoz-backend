const adminUserId = nanoid(5)
const adminUser = {
    _id: adminUserId,
    name: 'farhan',
    email: 'admin@example.com',
    password: 'ExampleUser123!',
    address: 'jalan bnangi',
    phone_no: 1234145,
    house_type: "kondominium",
    isAdmin: true,
    tokens: [{
        token: jwt.sign({ _id: adminUserId }, process.env.JWT_SECRET)
    }]
}