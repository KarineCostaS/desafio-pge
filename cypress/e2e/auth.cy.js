import { login } from "../support/api";

describe('Autenticação - Login', () => {

    it ('CT 01 - Login com credenciais válidas ', () => {
        login().then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token').and.to.be.a('string');

            Cypress.env('token', response.body.token);
        })
    })

    it('CT 02 - Login com credenciais inválidas', () => {
        login('admin_teste', 'password').then(response => {
            expect(response.status).to.eq(401);
        })
    })
})