import { login, consultarInscricoes} from '../support/api.js'

describe ('Visualização de Inscrições Protestadas', () => {
    let token
    const cpf_protestado = Cypress.env('cpf_protestado')
    const cpf = Cypress.env('cpf')

    before(() =>{
        return login(Cypress.env('USUARIO'), Cypress.env('SENHA')).then(response => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      Cypress.env('token', token);
    })
})

    it('CT 01 - Consulta de inscrições existentes para contribuinte autenticado', () => {
          return consultarInscricoes(token, cpf_protestado).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0);

            const inscricao = response.body[0]
            expect(inscricao).to.be.include.all.keys(
                    'cpf',
                    'data_inscricao',
                    'data_prazo',
                    'descricao',
                    'numero',
                    'valor'
            )
       })
    })

    it('CT 02 - Consulta de inscrições inexistentes para contribuinte autenticado', () => {
        consultarInscricoes(token, cpf).then((response) => {
            expect(response.status).to.eq(404)
            expect (response.body).to.have.property('erro')
            expect(response.body.erro).to.eq('Nenhuma inscrição encontrada para este contribuinte')
        })
    })

    it('CT 03 - Consulta de inscrições sem autenticação', () => {
        const token_invalido = 'token_invalido';
        
        consultarInscricoes(token_invalido, cpf).then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body).to.have.property('erro')
            expect(response.body.erro).to.eq('Token inválido')
        })
    })
}) 