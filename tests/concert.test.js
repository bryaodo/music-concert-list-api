const request = require('supertest')
const app = require('../src/app')
const Concert = require('../src/models/concert')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create concert for user', async () => {
    const response = await request(app)
        .post('/concerts')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "concert": "WILD BUNCH FEST 2019",
            "venue": "fukuoka",
            "dateAttended": "07/18/2019"
        })
        .expect(201)
    const concert = await Concert.findById(response.body._id)
    expect(concert).not.toBeNull()
    expect(concert.venue).toEqual("fukuoka")
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/concerts')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/concerts/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const concert = await Concert.findById(taskOne._id)
    expect(concert).not.toBeNull()
})
