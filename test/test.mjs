(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const should = chai.should();
    chai.use(chaiHttp);

    describe('User API', () => {
        let token = '';

        // Test user registration
        it('Debería registrar un usuario nuevo', (done) => {
            chai.request(server)
                .post('/register')
                .send({ username: 'testuser', password: 'testpassword' })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Usuario registrado');
                    done();
                });
        });

        // Test user login
        it('Debería permitir iniciar sesión con credenciales válidas', (done) => {
            chai.request(server)
                .post('/login')
                .send({ username: 'testuser', password: 'testpassword' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    token = res.body.token; // Save the token for future tests
                    done();
                });
        });

        // Test access to protected route
        it('Debería permitir el acceso a la ruta protegida con un token válido', (done) => {
            chai.request(server)
                .get('/protected')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Acceso concedido');
                    done();
                });
        });

        // Test access to protected route without token
        it('Debería denegar el acceso a la ruta protegida sin token', (done) => {
            chai.request(server)
                .get('/protected')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property('error').eql('Token no proporcionado');
                    done();
                });
        });
    });
})();
