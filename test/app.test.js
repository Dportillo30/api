const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Asegúrate de usar el path correcto



describe('User Registration and Login', () => {

    test('should register a new user', async () => {
        const response = await request(app).post('/register').send({
            username: 'testuser',
            password: 'testpassword',
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Usuario registrado');
    });

    test('should not allow duplicate user registration', async () => {
        await request(app).post('/register').send({
            username: 'testuser',
            password: 'testpassword',
        });
        const response = await request(app).post('/register').send({
            username: 'testuser',
            password: 'testpassword',
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'El usuario ya existe');
    });

    test('should login a registered user', async () => {
        const response = await request(app).post('/login').send({
            username: 'testuser',
            password: 'testpassword',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('should deny access to protected route without token', async () => {
        const response = await request(app).get('/protected');
        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('error', 'Token no proporcionado');
    });

    test('should grant access to protected route with valid token', async () => {
        const loginResponse = await request(app).post('/login').send({
            username: 'testuser',
            password: 'testpassword',
        });
        const token = loginResponse.body.token;

        const response = await request(app).get('/protected').set('Authorization', token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Acceso concedido');
    });
});
