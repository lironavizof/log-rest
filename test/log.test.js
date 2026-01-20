/* This file contains Jest/Supertest unit tests for the Logging Microservice.
* We use Mocking to simulate the Database and Middleware behavior,
* ensuring we test only the route logic in isolation. */
const request = require('supertest');

/*  Mock logger middleware so it won't send logs to DB/service during tests */
jest.mock('../middleware/logger', () => (req, res, next) => next());

/*  Mock Log model (no real MongoDB) */
jest.mock('../models/log', () => ({
    create: jest.fn(),
    find: jest.fn(),
}));

const Log = require('../models/log');
const app = require('../app');

describe('Log service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/logs', () => {
        test('400 when payload is invalid', async () => {
            const res = await request(app)
                .post('/api/logs')
                .send({ url: '/x', statusCode: 200 }); // missing method

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                id: 400,
                message: 'Invalid log payload',
            });
            expect(Log.create).not.toHaveBeenCalled();
        });

        test('201 when payload is valid', async () => {
            const payload = {
                service: 'cost-rest',
                method: 'GET',
                url: '/costs/api/report?userid=1&year=2026&month=1',
                statusCode: 200,
                endpoint: '/costs/api/report',
                timestamp: new Date().toISOString(),
                message: 'ok',
                error: null,
            };

            const saved = { _id: 'abc123', ...payload };
            Log.create.mockResolvedValue(saved);

            const res = await request(app).post('/api/logs').send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body._id).toBe('abc123');
            expect(Log.create).toHaveBeenCalledTimes(1);
            expect(Log.create).toHaveBeenCalledWith(payload);
        });

        test('500 when Log.create throws', async () => {
            Log.create.mockRejectedValue(new Error('db fail'));

            const res = await request(app)
                .post('/api/logs')
                .send({ method: 'GET', url: '/x', statusCode: 200 });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('id', 500);
            expect(res.body).toHaveProperty('message', 'db fail');
        });
    });

    describe('GET /api/logs', () => {
        test('200 returns array of logs', async () => {
            const fakeLogs = [
                { _id: '1', method: 'GET', url: '/', statusCode: 200, timestamp: new Date() },
                { _id: '2', method: 'POST', url: '/api/logs', statusCode: 201, timestamp: new Date() },
            ];

            // mock chain: find().sort().lean()
            Log.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(fakeLogs),
                }),
            });

            const res = await request(app).get('/api/logs');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });

        test('500 when Log.find throws', async () => {
            Log.find.mockImplementation(() => {
                throw new Error('db fail');
            });

            const res = await request(app).get('/api/logs');


            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('id', 1);
            expect(res.body).toHaveProperty('message', 'db fail');
        });
    });

    describe('404 handler', () => {
        /* Test Case: Ensuring the system handles non-existent routes correctly */
        test('unknown route returns 404 JSON', async () => {
            const res = await request(app).get('/no-such-route');
            /* // Expecting standard 404 response for undefined endpoints */
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ id: 404, message: 'Route not found' });
        });
    });
});