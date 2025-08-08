# DESAFIO PROCURADORIA GERAL DO ESTADO DO CEARÁ

## **1 - VISÃO GERAL**
Este relatório apresenta o processo de testes automatizados realizados com **Cypress**, bem como apontamentos de bugs e ajustes necessários na **API de contribuintes**, identificados durante a criação e execução dos testes.

### **1.1 - TESTES AUTOMATIZADOS**
- Os testes estão organizados de forma modular, com os requests encapsulados no arquivo `support/api.js`, promovendo reuso e melhor manutenção.  
- Foi utilizado o padrão de variáveis de ambiente para dados sensíveis e configuráveis (`token`, `cpf`, `baseUrl`).  
- A execução local dos testes apresenta sucesso na maioria dos cenários, garantindo a cobertura de casos de cadastro e consulta de contribuintes.  

### **1.2 - Cenários de Teste Automatizados**
- **CT 01** – Cadastro de Contribuinte com CPF válido  
- **CT 02** – Cadastro de Contribuinte com CPF inválido *(bug identificado)*  
- **CT 03** – Cadastro de Contribuinte com CPF duplicado *(bug identificado)*
- **CT 04** – Cadastro de Contribuinte com campos obrigatorios em branco  
- **CT 05** - Cadastro de Contribuinte sem Token 
- **CT 06** – Consulta de Contribuinte existente na base de Protesto 
- **CT 07** – Consulta de Contribuinte inexistente  na base de Protesto
- **CT 08** – Cadastro de Inscrição na Base de Protesto token de autenticação  
- **CT 09** - Login com credenciais válidas
- **CT 10** - Login com credenciais invalidas

---

## **2 - BUGS E COMPORTAMENTOS INESPERADOS DA API**

### **Cadastro com CPF inválido (CT 02)**
A API está permitindo o cadastro mesmo quando o CPF fornecido é inválido.  
**Esperado:** Erro 400.  
**Obtido:** Created 201.  
**Impacto:** Risco de dados inválidos sendo persistidos no sistema, comprometendo a integridade e confiabilidade dos dados. O comportamento apresentado não atende à regra de negócio definida.

### **Cadastro com CPF duplicado (CT 03)**
A API permite cadastrar múltiplos contribuintes com o mesmo CPF, retornando sucesso 201.  
**Esperado:** Erro 400 indicando duplicidade.  
**Obtido:** Created 201.  
**Impacto:** Possível inconsistência e duplicidade de registros. O comportamento apresentado não atende à regra de negócio definida.

### **CT 01 - Restrição de acesso às inscrições**
Esta funcionalidade não pôde ser testada, pois o processo de autenticação utilizado retorna tokens com acesso **pré-definidos e abrangente**, permitindo o acesso a todos os CPFs.  
Dessa forma, a restrição de acesso por CPF não está disponível para validação nem por testes manuais, nem via testes automatizados atualmente.  
**Recomendação:** Avaliar e ajustar o controle de acesso na API para permitir essa validação em futuros testes.

---

## **3 - RECOMENDAÇÕES PARA AJUSTES NA API**
1. Implementar validação rigorosa do formato e validade do CPF no backend para evitar registros inválidos.  
2. Adicionar verificação para impedir cadastro duplicado de CPF, retornando erro adequado.  
3. Melhorar mensagens de erro para refletir precisamente a causa da falha *(ex: mensagem clara sobre CPF inválido ou duplicado)*.  
4. Garantir que endpoints retornem **status HTTP corretos** e padronizados conforme boas práticas REST.  

---

## **4 - RECOMENDAÇÕES PARA O PROCESSO DE TESTES**
1. Manter os testes automatizados que atualmente falham devido aos bugs da API para garantir rastreabilidade e evidência das falhas.  
2. Integrar os testes automatizados na **pipeline de CI/CD** para garantir validação contínua antes de deploys.  
3. Adicionar **relatórios automatizados** e **capturas de tela** quando possível, para facilitar a visualização do status dos testes em execuções automáticas.  
4. Documentar claramente os testes impactados por bugs externos, com comentários no código e tickets associados.  
5. Criar mecanismos para popular o ambiente de testes com **dados consistentes e isolados**, evitando interferência entre execuções.

# COLLECTION POSTMAN - DOCUMENTAÇÃO

## 1. Visão Geral
Esta collection contém requisições para testes da API do sistema **PGE** (Procuradoria Geral do Estado), contemplando autenticação, cadastro de contribuintes e consulta de inscrições.  
As requisições utilizam variáveis de ambiente para facilitar a execução em diferentes ambientes sem alteração manual.

---

## 2. Ambiente – `Ambiente Teste PGE`
Configure as variáveis abaixo no Postman para que as requisições funcionem corretamente:

| Variável         | Descrição                                  | Valor Exemplo                 |
|------------------|--------------------------------------------|------------------------------|
| `baseUrl`        | URL base da API                            | `http://testeqa.pge.ce.gov.br` |
| `token`          | Token gerado no login                      | *(gerado automaticamente)*   |
| `cpf`            | CPF usado para cadastro                    | `02942069490`                |
| `cpf_protestado` | CPF com inscrição protestada para consulta | `12345678900`                |

---

## 3. Estrutura da Collection

### 3.1 Autenticação – Token

#### 3.1.1 Login com Dados Válidos
- **Método:** `POST`  
- **URL:** `{{baseUrl}}/login`  
- **Body JSON:**  
  ```json
  {
    "usuario": "admin",
    "senha": "password"
  }

  ## Resposta esperada:

**Código HTTP 200 OK**

Retorna JSON com token, que será salvo automaticamente na variável `token` do ambiente.

---

## 3.1.2 Login com Dados Inválidos

- **Método:** `POST`  
- **URL:** `{{baseUrl}}/login`  
- **Body JSON:**  
```json
{
  "usuario": "admin_teste",
  "senha": "password"
}
  ## Resposta esperada:

**Código HTTP 401 Unauthorized**

Retorna JSON com token, que será salvo automaticamente na variável `token` do ambiente.

---
## 3.2 Cadastro de Contribuintes

Todas as requisições desta seção exigem o header:

```http
x-access-token: {{token}}
```

### 3.2.1 Cadastro com Dados Válidos

- **Método:** `POST`  
- **URL:** `{{baseUrl}}/contribuintes`  
- **Body JSON:**  
```json
{
  "cpf": "{{cpf}}",
  "nome": "João da Silva",
  "data_nascimento": "1990-01-01",
  "nome_mae": "Maria da Silva"
}
```

- **Resposta esperada:**  
  Código HTTP `201 Created`

---

### 3.2.2 Cadastro com Dados Inválidos

- CPF inválido (`"cpf": "ABC"`).  
- Espera-se erro `400 Bad Request`.

---

### 3.2.3 Cadastro com CPF Duplicado

- CPF já cadastrado (`"cpf": "{{cpf}}"`).  
- Espera-se erro `409 Conflict`.

---

### 3.2.4 Cadastro com Campos Faltantes

- Campos `cpf` e `nome` vazios.  
- Espera-se erro `400 Bad Request`.

---

### 3.2.5 Cadastro com Token Inválido

- Header `x-access-token` com valor `"token-invalido"`.  
- Espera-se erro `401 Unauthorized`.

---

## 3.3 Consulta de Inscrições

### 3.3.1 Consulta CPF Protestado

- **Método:** `GET`  
- **URL:** `{{baseUrl}}/inscricoes/{{cpf_protestado}}`  
- **Header:**  
```http
x-access-token: {{token}}
```
- **Resposta esperada:**  
  Retorna lista de inscrições relacionadas ao CPF protestado.

---

### 3.3.2 CPF Inexistente na Base

- **URL:** `{{baseUrl}}/inscricoes/{{cpf}}`  
- Espera-se `404 Not Found` ou lista vazia.

---

### 3.3.3 Consulta sem Token

- Token removido do header.  
- Espera-se erro `401 Unauthorized`.

---

## 4. Fluxo de Uso Recomendado

1. Execute a requisição **Login com Dados Válidos** para gerar o token.  
2. Use o token para realizar os testes de cadastro de contribuintes.  
3. Realize consultas utilizando os CPFs configurados.

---

## 5. Observações

- Sempre selecione o ambiente **Ambiente Teste PGE** no Postman antes de executar.  
- Atualize os valores das variáveis `cpf` e `cpf_protestado` para evitar conflitos durante testes.  
- O token tem validade limitada; refaça o login sempre que necessário.
