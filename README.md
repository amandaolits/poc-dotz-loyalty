# Dotz Loyalty

> Plataforma de fidelidade onde usuários acumulam e trocam pontos (Dotz) por produtos, gift cards, cupons e assinaturas.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Angular 19 (Standalone Components, Signals) |
| **Backend** | Node.js + Express |
| **Banco** | PostgreSQL 15 |
| **Autenticação** | JWT (8h) + bcrypt |
| **Container** | Docker |

---

## Telas do Sistema

### Dashboard (`/dashboard`)
Cartão de saldo com pontos atuais, atalhos para ações rápidas (resgatar, endereços, extrato), banner promocional e lista de atividades recentes.

### Login (`/login`)
Autenticação com e-mail/senha. Layout com gradiente, suporte a login social (Google/Apple — placeholder), campo de senha com toggle de visibilidade.

### Cadastro (`/cadastro`)
Formulário de registro com e-mail, senha e confirmação de senha. Validação em tempo real (senhas conferem, mínimo 6 caracteres). Exibe mensagens de erro como "Email já cadastrado".

### Produtos (`/produtos`)
Catálogo com grid responsivo (1-4 colunas). Busca por texto, filtros por categoria e subcategoria (selects com arrow customizada), paginação. Cada card exibe imagem, nome e pontos necessários.

### Detalhe do Produto (`/produtos/:id`)
Exibe imagem ampliada, descrição, pontos necessários e botão "Resgatar agora". Condições: usuário precisa ter saldo suficiente e um endereço cadastrado.

### Checkout (`/checkout/:produtoId`)
Fluxo de resgate: exibe saldo atual, pontos do produto, seleção de endereço de entrega e botão de confirmação. A transação é atômica (valida saldo, produto ativo, endereço do usuário → debita pontos → cria pedido).

### Meus Pedidos (`/pedidos`)
Lista de pedidos com filtros (últimos 30 dias, este ano). Card por pedido com imagem, status (chip colorido: Confirmado, Em trânsito, Entregue, Cancelado), pontos gastos e link para detalhes.

### Detalhe do Pedido (`/pedidos/:id`)
Exibe dados do produto, endereço de entrega e status atualizado.

### Endereços (`/enderecos`)
CRUD completo: listagem com cards, formulário de novo/edição com layout em grid (CEP, estado, cidade, bairro, logradouro, número, complemento), toggle para endereço padrão.

### Extrato (`/extrato`)
Histórico de transações (ganhos/resgates) com filtro por período (1 mês, 3 meses, todas), ícone por tipo, valores em verde (ganho) ou vermelho (resgate) e paginação.

---

## Como Rodar o Projeto

### Pré-requisitos

| Ferramenta | Versão | Download |
|------------|--------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| Docker | 24+ | [docker.com](https://www.docker.com/) |
| DBeaver | 24+ | [dbeaver.io](https://dbeaver.io/) |
| Git | Qualquer | [git-scm.com](https://git-scm.com/) |

### Passo 1 — Clonar o repositório

```bash
git clone https://github.com/amandaolits/poc-dotz-loyalty.git
cd poc-dotz-loyalty
```

### Passo 2 — Subir o banco com Docker

```bash
docker run -d \
  --name dotz-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dotz_loyalty \
  -p 5432:5432 \
  postgres:15-alpine
```

Verifique se o container está rodando:

```bash
docker ps
# CONTAINER ID   IMAGE                ...   PORTS                    NAMES
# e3581d0cdba3   postgres:15-alpine   ...   0.0.0.0:5432->5432/tcp   dotz-postgres
```

### Passo 3 — Conectar com DBeaver

1. Abra o DBeaver
2. Clique no ícone **"Nova Conexão"** (plugue +, ou `Ctrl + Shift + N`)
3. Escolha **PostgreSQL**
4. Preencha:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `dotz_loyalty`
   - **Username**: `postgres`
   - **Password**: `postgres`
5. Marque **"Salvar senha"** para não digitar toda vez
6. Clique em **"Testar Conexão"** — deve aparecer "Connected"
7. Clique em **"Concluir"**

Agora você pode navegar pelas tabelas, executar queries e visualizar dados diretamente pelo DBeaver.

### Passo 4 — Configurar o Backend

```bash
cd backend
cp .env.example .env
npm install
```

O arquivo `.env` já vem com os valores corretos para o Docker. Verifique se está assim:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dotz_loyalty
JWT_SECRET=dotz-secret-key-2026
JWT_EXPIRES_IN=8h
```

### Passo 5 — Rodar Migrations

```bash
cd backend
npm run db:migrate up
```

Isso cria as 5 tabelas:

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Usuários cadastrados (id, email, senha_hash, saldo_pontos) |
| `enderecos` | Endereços de entrega por usuário |
| `produtos` | Catálogo com nome, descrição, pontos, categoria, imagem |
| `transacoes` | Histórico de ganhos e resgates de pontos |
| `pedidos` | Pedidos de resgate vinculados a produto + endereço |

### Passo 6 — Popular o Banco (Seed)

Pelo terminal:

```bash
docker exec -i dotz-postgres psql -U postgres -d dotz_loyalty < backend/seeds/001_init.sql
```

Ou pelo DBeaver:
1. Com o banco conectado, abra uma aba de SQL (`Ctrl + ]`)
2. **File → Open File** → selecione `backend/seeds/001_init.sql`
3. Execute (`Ctrl + Enter`)

Isso insere:
- **5 usuários** (maria, joao, ana, carlos, juliana — senha: `123456`)
- **8 endereços** (SP, RJ, MG, PR, DF)
- **15 produtos** em 6 categorias (Cupons, Eletronicos, Gift Cards, Assinaturas, Produtos, Casa)
- **27 transações** (ganhos e resgates com datas variadas)
- **7 pedidos** com status diferentes

### Passo 7 — Iniciar o Backend

```bash
cd backend
npm run dev
```

O servidor sobe em `http://localhost:3000` com hot-reload.

Teste:

```bash
curl http://localhost:3000/api/produtos
```

### Passo 8 — Iniciar o Frontend

```bash
cd frontend
npm install
ng serve
```

O Angular sobe em `http://localhost:4200`.

---

## Usuários de Teste (seed)

| Email | Senha | Saldo (DZ) |
|-------|-------|------------|
| maria@email.com | 123456 | 50.000 |
| joao@email.com | 123456 | 15.000 |
| ana@email.com | 123456 | 500 |
| carlos@email.com | 123456 | 35.000 |
| juliana@email.com | 123456 | 8.000 |

---

## Comandos Úteis

### Docker — Gerenciar o banco

```bash
# Parar o container
docker stop dotz-postgres

# Iniciar novamente
docker start dotz-postgres

# Ver logs
docker logs dotz-postgres

# Acessar o psql dentro do container
docker exec -it dotz-postgres psql -U postgres -d dotz_loyalty

# Remover o container (cuidado: apaga os dados)
docker rm -f dotz-postgres
```

### Seed — Resetar dados

```bash
# Limpar tudo e recarregar
docker exec -i dotz-postgres psql -U postgres -d dotz_loyalty -c "TRUNCATE TABLE produtos CASCADE;"
docker exec -i dotz-postgres psql -U postgres -d dotz_loyalty < backend/seeds/001_init.sql
```

### Pontos — Ajustar saldo manualmente

```bash
docker exec -i dotz-postgres psql -U postgres -d dotz_loyalty -c "UPDATE usuarios SET saldo_pontos = 10000 WHERE email = 'maria@email.com';"
```

### DBeaver — Dicas rápidas

| Ação | Atalho / Como fazer |
|------|---------------------|
| Nova aba SQL | `Ctrl + ]` |
| Executar query | `Ctrl + Enter` |
| Ver dados da tabela | Duplo clique na tabela no navegador |
| Editar célula | Clique duplo na célula no grid |
| Exportar resultado | Clique direito no grid → "Export Data" |

---

## API — Visão Geral

Base: `http://localhost:3000/api`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/usuarios` | — | Cadastrar |
| POST | `/login` | — | Login (retorna JWT) |
| GET | `/me` | JWT | Dados do usuário |
| GET | `/enderecos` | JWT | Listar endereços |
| POST | `/enderecos` | JWT | Criar endereço |
| PUT | `/enderecos/:id` | JWT | Editar endereço |
| DELETE | `/enderecos/:id` | JWT | Excluir endereço |
| GET | `/saldo` | JWT | Saldo de pontos |
| GET | `/extrato?periodo=&pagina=&limite=` | JWT | Extrato com filtros |
| GET | `/produtos?categoria=&subcategoria=&busca=&pagina=` | JWT | Catálogo paginado |
| GET | `/produtos/:id` | JWT | Detalhe do produto |
| POST | `/resgates` | JWT | Resgatar (transação atômica) |
| GET | `/pedidos?periodo=` | JWT | Listar pedidos |
| GET | `/pedidos/:id` | JWT | Detalhe do pedido |

---

## Estrutura do Projeto

```
poc-dotz-loyalty/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexão DB, env
│   │   ├── controllers/     # Handlers das rotas
│   │   ├── middlewares/     # Auth JWT, validação Zod, erros
│   │   ├── models/          # Queries SQL
│   │   ├── routes/          # Definição de rotas Express
│   │   ├── services/        # Lógica de negócio (resgate atômico)
│   │   ├── app.js           # Montagem do Express
│   │   └── server.js        # Entry point
│   ├── migrations/          # node-pg-migrate
│   ├── seeds/               # SQL de dados iniciais
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/app/
│   │   ├── core/            # Auth, guards, interceptors, API service
│   │   ├── features/        # Páginas (lazy loading)
│   │   │   ├── auth/        # Login + Cadastro
│   │   │   ├── dashboard/   # Home
│   │   │   ├── produtos/    # Catálogo + Detalhe
│   │   │   ├── checkout/    # Fluxo de resgate
│   │   │   ├── pedidos/     # Lista + Detalhe
│   │   │   ├── enderecos/   # CRUD completo
│   │   │   └── extrato/     # Histórico de transações
│   │   └── shared/          # Componentes reutilizáveis
│   ├── environments/        # URL da API (dev/prod)
│   └── package.json
└── README.md
```

---

## Observações

- Prova de conceito — sem testes automatizados, sem recuperação de senha, sem confirmação de e-mail
- Upload de imagens não implementado (usamos URLs externas)
- Saldo inicial de novos usuários é 0 (ganho simulado via seed ou SQL manual)
