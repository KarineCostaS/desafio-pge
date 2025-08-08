export function login (usuario, senha){
    usuario = usuario || Cypress.env('USUARIO');
    senha = senha || Cypress.env('SENHA')

    return cy.request({
        method:'POST',
        url:`${Cypress.env('baseUrl')}/login`,
        body:{usuario, senha},
        failOnStatusCode: false
    })
}

export function cadastrarContribuinte(token, dados){
    return cy.request({
        method:'POST',
        url: `${Cypress.env('baseUrl')}/contribuintes`,
        headers: {'x-access-token': token},
        body: dados,
        failOnStatusCode: false
    })
}
export function consultarInscricoes(token, cpf_protestado){
    return cy.request({
        method:'GET',
        url:`${Cypress.env('baseUrl')}/inscricoes/${cpf_protestado}`,
        headers: {'x-access-token': token},
        failOnStatusCode: false
    })
}
