# Dotz Loyalty POC

> Proof of Concept de um programa de fidelidade (pontos/recompensas) com backend Node.js + PostgreSQL e frontend Angular 19.

## 📋 Visão Geral

O **Dotz Loyalty** é uma aplicação web que permite aos usuários:
- Criar conta e fazer login (JWT)
- Visualizar saldo de pontos
- Navegar por um catálogo de produtos
- Resgatar produtos usando pontos (com endereço de entrega)
- Visualizar histórico de pedidos e extrato de pontos

### Stack Utilizada

| Camada | Tecnologia |
|--------|-------------|
| **Frontend** | Angular 19 (Standalone Components, Signals, new control flow) |
| **Backend** | Node.js (Express) |
| **Banco de Dados** | PostgreSQL 13+ |
| **Autenticação** | JWT (8h expiry) + bcrypt |
| **Validação** | Zod |
| **Migrations** | node-pg-migrate |

---

## 🔧 Pré-requisitos

- **Node.js** v18+ ([download](https://nodejs.org/))
- **PostgreSQL** 13+ ou **Docker** ([download Docker](https://www.docker.com/))
- **Angular CLI** (opcional): `npm install -g @angular/cli@19`

> Se não quiser instalar o PostgreSQL localmente, use o Docker (instruções abaixo).

---

## 📁 Estrutura do Projeto

```
poc-dotz-loyalty/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── config/            # DB connection, env validation
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database queries
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # Business logic (ex: resgate)
│   │   ├── middlewares/       # Auth, validation, error handling
│   │   ├── app.js            # Express app assembly
│   │   └── server.js         # Entry point
│   ├── db/migrations/        # Database migrations (node-pg-migrate)
│   ├── seeds/                 # Initial data (SQL)
│   ├── .env.example          # Example environment file
│   └── package.json
│
└── frontend/                  # SPA Angular 19
    ├── src/
    │   ├── app/
    │   │   ├── core/          # Services, interceptors, guards
    │   │   ├── features/      # Pages (login, dashboard, produtos, etc.)
    │   │   └── shared/       # Reusable components (button, card, etc.)
    │   ├── environments/      # env.ts (dev/prod)
    │   └── main.ts
    └── package.json
```

---

## ⚙️ Configuração do Ambiente

### Backend (.env)

Copie o arquivo de exemplo e configure:

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dotz_loyalty
JWT_SECRET=dotz-secret-key-change-in-production
JWT_EXPIRES_IN=8h
```

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor backend | `3000` |
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT (mude em produção!) | `your-secret-key` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `8h` |

### Frontend (environment.ts)

O frontend usa arquivos de ambiente Angular (já configurados):

- **Desenvolvimento**: `src/environments/environment.ts` → `apiUrl: 'http://localhost:3000/api'`
- **Produção**: `src/environments/environment.prod.ts` → `apiUrl: '/api'`

---

## 🗄️ Banco de Dados

### Opção 1: Docker (Recomendado)

```bash
# Iniciar PostgreSQL via Docker
docker run -d \
  --name dotz-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dotz_loyalty \
  -p 5432:5432 \
  postgres:15-alpine

# O banco estará disponível em localhost:5432
```

### Opção 2: PostgreSQL Local

```bash
# Criar o banco de dados (via psql)
psql -U postgres -c "CREATE DATABASE dotz_loyalty;"

# Verificar se está rodando
pg_isready -h localhost -p 5432
```

### Rodar Migrations

```bash
cd backend
npm install
npm run db:migrate
```

Isso criará as tabelas:
- `usuarios` — usuários do sistema
- `enderecos` — endereços de entrega
- `produtos` — catálogo de produtos
- `transacoes` — histórico de pontos
- `pedidos` — pedidos de resgate

### Seed (Dados Iniciais)

```bash
# Inserir produtos de exemplo
psql -U postgres -d dotz_loyalty -f seeds/001_init.sql
```

---

## 🚀 Como Rodar a Aplicação

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Rodar migrations (se ainda não rodou)
npm run db:migrate

# Iniciar em modo desenvolvimento (com hot-reload)
npm run dev

# OU iniciar em modo produção
npm start
```

**Backend disponível em**: `http://localhost:3000`

**Validar que está funcionando**:
```bash
curl http://localhost:3000/api/produtos
# Deve retornar um JSON com a lista de produtos
```

### 2. Frontend

```bash
cd frontend

# Instalar dependências (Angular 19)
npm install

# Iniciar servidor de desenvolvimento
npm start

# OU via Angular CLI
ng serve
```

**Frontend disponível em**: `http://localhost:4200`

---

## 🧪 Fluxo de Teste (Passo a Passo)

### Pré-requisitos
- Backend rodando em `localhost:3000`
- Frontend rodando em `localhost:4200`
- Banco populado (seeds executados)

### 1. Criar Usuário
```
1. Acesse http://localhost:4200/cadastro
2. Preencha:
   - Email: teste@dotz.com
   - Senha: 123456 (mínimo 6 caracteres)
3. Clique em "Cadastrar"
4. Deve redirecionar para /login
```

### 2. Fazer Login
```
1. Na tela de login, digite:
   - Email: teste@dotz.com
   - Senha: 123456
2. Clique em "Entrar"
3. Deve redirecionar para /dashboard
4. O saldo inicial será 0 pontos
```

### 3. Adicionar Pontos (Via Banco)
```
-- Por enquanto, pontos são adicionados via SQL:
psql -U postgres -d dotz_loyalty -c "UPDATE usuarios SET saldo_pontos = 1000 WHERE email = 'teste@dotz.com';"
```

### 4. Cadastrar Endereço
```
1. No menu, clique em "Endereços"
2. Clique em "Novo Endereço"
3. Preencha os dados (CEP, logradouro, número, etc.)
4. Marque "Endereço Padrão"
5. Clique em "Salvar"
```

### 5. Visualizar Produtos
```
1. No menu, clique em "Produtos"
2. Navegue pelo catálogo
3. Use a busca para filtrar por nome
4. Use os filtros de categoria
```

### 6. Fazer Resgate
```
1. Clique em um produto para ver detalhes
2. Verifique os pontos necessários
3. Clique em "Resgatar"
4. Selecione o endereço de entrega no checkout
5. Confirme o pedido
6. Deve redirecionar para /pedidos com mensagem de sucesso
```

### 7. Ver Pedidos
```
1. No menu, clique em "Meus Pedidos"
2. Veja o histórico de resgates
3. Clique em um pedido para ver detalhes
```

### 8. Ver Extrato
```
1. No menu, clique em "Extrato"
2. Veja as transações de pontos (ganhos/resgates)
```

---

## 📜 Scripts Disponíveis

### Backend (`backend/package.json`)
| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o servidor em modo produção |
| `npm run dev` | Inicia com nodemon (hot-reload) |
| `npm run db:migrate` | Executa migrations do banco |
| `npm run db:rollback` | Reverte última migration |

### Frontend (`frontend/package.json`)
| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia servidor de desenvolvimento (ng serve) |
| `npm run build` | Build de produção |
| `npm test` | Executa testes (se configurado) |

---

## 🌐 API Endpoints

Todos os endpoints estão sob o prefixo `/api`:

| Método | Rota | Auth? | Descrição |
|--------|------|-------|-----------|
| POST | `/usuarios` | Não | Cadastrar usuário |
| POST | `/login` | Não | Fazer login |
| GET | `/me` | Sim | Dados do usuário logado |
| GET | `/enderecos` | Sim | Listar endereços |
| POST | `/enderecos` | Sim | Criar endereço |
| PUT | `/enderecos/:id` | Sim | Atualizar endereço |
| DELETE | `/enderecos/:id` | Sim | Remover endereço |
| GET | `/saldo` | Sim | Ver saldo de pontos |
| GET | `/extrato` | Sim | Ver extrato (transações) |
| GET | `/produtos` | Sim | Listar produtos (com filtros) |
| GET | `/produtos/:id` | Sim | Detalhe do produto |
| POST | `/resgates` | Sim | Resgatar produto (transação atômica) |
| GET | `/pedidos` | Sim | Listar pedidos |
| GET | `/pedidos/:id` | Sim | Detalhe do pedido |

---

## ⚠️ Problemas Comuns e Soluções

### Erro de Conexão com Banco
```
Error: Missing required env vars: databaseUrl
```
**Solução**: Verifique se o arquivo `backend/.env` existe e se a `DATABASE_URL` está correta.

### Erro de Porta em Uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solução**: Mude a porta no `.env` ou encerre o processo:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro de CORS
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:4200' has been blocked by CORS policy
```
**Solução**: O CORS já está habilitado no backend. Verifique se o frontend está usando a URL correta em `environment.ts`.

### Erro de Build no Angular
```
Module not found: Error: Can't resolve...
```
**Solução**: Execute `npm install` no diretório `frontend/` e verifique se o Angular CLI está na versão 19.

### Saldo Zero / Sem Pontos
O saldo inicia em 0. Para simular pontos:
```bash
psql -U postgres -d dotz_loyalty -c "UPDATE usuarios SET saldo_pontos = 1000 WHERE email = 'seu-email@dotz.com';"
```

### `gen_random_uuid()` Error
```
function gen_random_uuid() does not exist
```
**Solução**: Habilite a extensão pgcrypto no PostgreSQL:
```bash
psql -U postgres -d dotz_loyalty -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"
```

---

## 📝 Observações de POC

Este é um **Proof of Concept** com as seguintes simplificações:

### Simplificações
- **Pontos iniciais**: Sempre inicia em 0; ganho de pontos deve ser feito via SQL ou admin (não implementado)
- **Sem confirmação de email**: Cadastro é imediato
- **Sem recuperação de senha**: Funcionalidade não incluída
- **Sem pagamento real**: O resgate é simulado (pontos → produto)
- **JWT armazenado no localStorage**: Em produção, considere HttpOnly cookies

### Limitações
- Sem testes automatizados (unit/integration)
- Sem documentação Swagger/OpenAPI
- Sem painel administrativo
- Upload de imagens de produtos não implementado (URLs apenas)
- Sem rate limiting ou proteção avançada contra ataques

### O que foi implementado
✅ Todas as 14 rotas da API conforme AGENTS.md  
✅ Transação atômica no resgate (check saldo → check produto → check endereço → debitar pontos → criar pedido)  
✅ Frontend completo com Angular 19 (standalone components, signals, lazy loading)  
✅ Validação de entrada com Zod  
✅ Tratamento de erros centralizado  
✅ Interceptors de auth e erro no frontend  

---

## 📄 Licença

MIT (para fins de POC/teste)

---

**Desenvolvido como POC para o programa de fidelidade Dotz**  
Data: Maio 2026
