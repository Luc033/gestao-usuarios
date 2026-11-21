# Gestão de Usuários — DevPool 2027

Aplicação Full-Stack desenvolvida como parte do desafio técnico do processo seletivo DevPool 2027. O projeto consiste em um sistema de gerenciamento de usuários, permitindo cadastrar, consultar, editar e excluir registros por meio de uma interface web integrada a uma API REST.

## Tecnologias utilizadas

### Frontend
- **HTML5:** estruturação das páginas e dos formulários.
- **CSS3:** estilização e personalização da interface.
- **JavaScript Vanilla:** manipulação do DOM, validações e comunicação com a API.
- **Vite 8:** servidor de desenvolvimento e ferramenta de build.
- **Bootstrap 6 Alpha:** componentes e estilos da interface.
- **Bootstrap Icons:** biblioteca de ícones.

### Backend
- **Node.js:** ambiente de execução JavaScript.
- **Express 5:** criação do servidor HTTP e gerenciamento das rotas da API REST.
- **SQLite:** banco de dados relacional para persistência dos usuários.
- **better-sqlite3:** conexão com o banco e execução de comandos SQL.
- **bcrypt:** geração de hashes para armazenamento seguro das senhas.
- **CORS:** configuração da comunicação entre frontend e backend.
- **Nodemon:** reinicialização automática do servidor durante o desenvolvimento.

## Arquitetura do projeto

O backend foi organizado em camadas, separando as responsabilidades da aplicação para facilitar a manutenção, a organização e o isolamento entre as regras de negócio e a persistência dos dados.

### Estrutura de diretórios

```text
gestao-usuarios/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   └── src/
│       ├── controllers/
│       │   └── userController.js
│       │
│       ├── database/
│       │   └── database.js
│       │
│       ├── errors/
│       │   └── AppError.js
│       │
│       ├── middleware/
│       │   └── erroHandler.js
│       │
│       ├── repositories/
│       │   └── userRepository.js
│       │
│       ├── routes/
│       │   └── userRoutes.js
│       │
│       └── services/
│           └── userService.js
│
└── frontend/
    ├── index.html
    ├── users.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    │
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── api.js
        ├── index.js
        ├── users.js
        │
        └── util/
            ├── loading.js
            ├── toast.js
            └── validation.js
```

### Responsabilidade das camadas

| Camada | Responsabilidade |
|---|---|
| Routes | Define os endpoints e direciona as requisições aos controllers. |
| Controllers | Recebe as requisições HTTP, aciona os services e retorna as respostas. |
| Services | Implementa as regras de negócio e as validações dos dados. |
| Repositories | Centraliza as consultas SQL e as operações de persistência. |
| Database | Inicializa a conexão e a estrutura do banco SQLite. |
| Middleware | Realiza o tratamento centralizado de erros da aplicação. |
| Errors | Define a classe de erros personalizados da aplicação. |

No frontend, a comunicação com o backend é centralizada em `api.js`, enquanto `index.js` e `users.js` controlam, respectivamente, a listagem de usuários e o formulário de cadastro e edição.

## Funcionalidades

- Cadastro de usuários.
- Listagem completa dos usuários cadastrados.
- Consulta individual de usuários pelo identificador.
- Edição dos dados cadastrais.
- Alteração de senha por operação específica.
- Exclusão permanente de usuários com confirmação prévia.
- Pesquisa de usuários por nome, e-mail ou login.
- Indicação do status ativo ou inativo.
- Feedback visual de carregamento, sucesso e erro.
- Validação dos dados antes da persistência.

## Regras de negócio e segurança

A aplicação implementa as seguintes validações:

- Nome obrigatório, com no mínimo 3 caracteres.
- E-mail obrigatório, com formato válido e sem duplicidade.
- Login obrigatório, com no mínimo 3 caracteres e sem duplicidade.
- Senha com no mínimo 8 caracteres.
- Identificador único gerado pelo servidor utilizando UUID.
- Status do usuário armazenado no SQLite como inteiro (`0` ou `1`) e apresentado como booleano nas consultas.
- Rejeição de dados inválidos e conflitos de e-mail ou login com HTTP 400 Bad Request.
- Retorno HTTP 404 Not Found quando um usuário não é localizado.
- Senhas armazenadas utilizando hash BCrypt, com fator de custo 12.

O campo de senha e seu respectivo hash não são expostos nas respostas JSON da API.

A exclusão de usuários é física, removendo permanentemente o registro do banco de dados.

O frontend não acessa diretamente o banco de dados. Todas as operações de consulta e alteração são realizadas exclusivamente por meio da API REST.

## Instalação e execução local

### Pré-requisitos

- Node.js 20.19.0 ou superior, ou 22.12.0 ou superior.
- npm.
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/Luc033/gestao-usuarios.git
```

Acessar a pasta do projeto:

```bash
cd gestao-usuarios
```

### 2. Instalar e executar o backend

Acessar a pasta do backend:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

Iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:3001
```

O banco de dados SQLite será criado automaticamente em `backend/data/database.sqlite` na primeira inicialização, caso ainda não exista.

Também é possível iniciar o servidor sem o Nodemon:

```bash
npm start
```

### 3. Instalar e executar o frontend

Com o backend em execução, abrir outro terminal e acessar a pasta do frontend:

```bash
cd gestao-usuarios/frontend
```

Instalar as dependências:

```bash
npm install
```

Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A interface estará disponível em:

```text
http://localhost:5172
```

O frontend utiliza o Vite para servir as páginas localmente. A configuração do CORS no backend permite a comunicação com o endereço do frontend.

### 4. Gerar a versão de produção do frontend

Opcionalmente, para gerar os arquivos otimizados do frontend:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `frontend/dist/`.

## API REST — Endpoints

A API utiliza JSON para receber e retornar dados, com endereço-base:

```text
http://localhost:3001
```

| Método | Endpoint | Descrição | Resposta de sucesso |
|---|---|---|---|
| POST | `/users` | Cadastrar usuário | 201 Created |
| GET | `/users` | Listar usuários | 200 OK |
| GET | `/users/:id` | Consultar usuário por ID | 200 OK |
| PUT | `/users/:id` | Atualizar dados do usuário | 200 OK |
| PATCH | `/users/:id/password` | Alterar senha | 204 No Content |
| DELETE | `/users/:id` | Excluir usuário | 204 No Content |

### Exemplos de chamadas

Os exemplos abaixo utilizam `curl`. No Windows PowerShell, utilize `curl.exe` no lugar de `curl`, caso necessário.

#### 1. Cadastrar usuário — POST /users

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Silva",
    "email": "ana@email.com",
    "login": "ana",
    "password": "Senha123",
    "active": 1
  }'
```

Resposta esperada — HTTP 201:

```json
{
  "id": "UUID-GERADO-PELO-SERVIDOR",
  "name": "ana silva",
  "email": "ana@email.com",
  "login": "ana",
  "active": true
}
```

#### 2. Listar usuários — GET /users

```bash
curl http://localhost:3001/users
```

Retorna a lista completa dos usuários cadastrados, sem expor informações de senha.

#### 3. Consultar usuário — GET /users/:id

```bash
curl http://localhost:3001/users/UUID-DO-USUARIO
```

Retorna os dados do usuário correspondente ao identificador informado.

#### 4. Atualizar usuário — PUT /users/:id

```bash
curl -X PUT http://localhost:3001/users/UUID-DO-USUARIO \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Beatriz Silva",
    "email": "ana.beatriz@email.com",
    "login": "anabeatriz",
    "active": 1
  }'
```

Atualiza os dados cadastrais do usuário. A senha é gerenciada por um endpoint específico.

#### 5. Alterar senha — PATCH /users/:id/password

```bash
curl -X PATCH http://localhost:3001/users/UUID-DO-USUARIO/password \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NovaSenha123"
  }'
```

Retorna HTTP 204 No Content quando a senha é alterada com sucesso.

#### 6. Excluir usuário — DELETE /users/:id

```bash
curl -X DELETE http://localhost:3001/users/UUID-DO-USUARIO
```

Remove permanentemente o usuário correspondente ao identificador informado e retorna HTTP 204 No Content.

### Tratamento de erros

A API possui tratamento centralizado de erros, retornando respostas JSON com mensagens explicativas.

Exemplo de resposta para dados inválidos ou conflito de e-mail/login — HTTP 400:

```json
{
  "message": "Existem conflitos nos dados informados.",
  "errors": [
    {
      "field": "email",
      "message": "O email informado já foi utilizado."
    }
  ]
}
```

Para consultas ou operações envolvendo identificadores inexistentes, a API retorna HTTP 404 Not Found.

Erros internos não tratados são respondidos com HTTP 500 Internal Server Error.

---

**Projeto desenvolvido como parte do desafio técnico Full-Stack — DevPool 2027.**