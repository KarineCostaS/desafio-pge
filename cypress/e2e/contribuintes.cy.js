import {login, cadastrarContribuinte } from "../support/api";

describe('Cadastro de um Contribuinte', () => {
    let token;

    before(() =>{
        return login(Cypress.env('USUARIO'), Cypress.env('SENHA')).then(response => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      Cypress.env('token', token);
    })
    })
    it ('CT 01 - Cadastro com dados válidos', () => {
        const dados = {
            cpf: Cypress.env('cpf'),
            nome: 'Maria de Aquino',
            data_nascimento: "1995-05-11",
            nome_mae: 'Joana Silva'
        }
    
    return cadastrarContribuinte(token, dados).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('mensagem', 'Contribuinte cadastrado com sucesso');;
    })
})

    it ('CT 02 - Cadastro com CPF inválido', () => {
        const dadosInvalidos = {
            cpf: 'ABC',
            nome: 'João da Silva',
            data_nascimento:'1996-19-09',
            nome_mae: 'Joaquina Silva'
        };
        cadastrarContribuinte(token, dadosInvalidos).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error')
        })
    })

        it('CT 03 - Cadastro com CPF duplicado', () => {
        const dadosDuplicados = {
           cpf: Cypress.env('cpf'),
            nome:'Maria Aquino',
            data_nascimento:'1996-12-02',
            nome_mae: 'Juliana Silva' 
        } 

        cadastrarContribuinte (token, dadosDuplicados).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('erro')
        })
    })

    it('CT 04 - Cadastro com campos obrigatórios faltando', () => {
        const dadosFaltandocampos = {
            cpf: '',
            nome:'',
            data_nascimento:'1996-12-02',
            nome_mae: 'Juliana Silva'
        }

        cadastrarContribuinte(token, dadosFaltandocampos).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('erro');
            
        })
    })

    it('CT 05 - Cadastro sem token de autenticação', () => {
        const dados = {
            cpf: Cypress.env('cpf'),
            nome: 'Maria da Silva',
            data_nascimento:'2002-04-12',
            nome_mae: 'Cintia Silva'
        }
    cy.request({
        method: 'POST',
        url: `${Cypress.env('baseUrl')}/contribuintes`,
        body: dados,
        failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('erro')
    })
    })
})
