
# POC - Programa de Fidelidade Dotz - SDD


## 1. Objetivo do Produto
Desenvolver uma aplicação web completa para o Programa de Fidelidade Dotz, permitindo que clientes se cadastrem, gerenciem endereços, consultem saldo e extrato, resgatem produtos e acompanhem pedidos. A solução contempla frontend e backend, com persistência real dos dados.

---

## 2. Arquitetura e Tecnologias (visão geral)
- **Frontend:** Aplicação single-page construída com o framework Angular.  
- **Backend:** API RESTful desenvolvida em Node.js.  
- **Banco de dados:** PostgreSQL relacional.  
- **Comunicação:** Frontend consome a API backend via requisições HTTP (JSON).  
- **Autenticação:** Baseada em JWT (token armazenado no frontend).  

---

## 3. Escopo

### Inclui:
- Frontend Angular com rotas, componentes e serviços para consumir a API.
- Backend Node.js com todos os endpoints necessários.
- Banco de dados PostgreSQL com tabelas para usuários, endereços, produtos, pedidos, transações de pontos, etc.
- Regras de negócio (validação de saldo, débito de pontos, criação de pedidos).

### Exclui:
- Integração com gateways de pagamento reais ou logística externa (os status de entrega são atualizados via operador ou job simulado).

---

## 4. Personas
- **Usuário Cliente:** deseja acumular pontos, resgatar produtos e acompanhar entregas.  
- **Operador (backoffice):** (fora do escopo desta versão) poderá atualizar status de pedidos manualmente.  

---

## 5. Requisitos Funcionais (Backend + Frontend)

### 5.1 Cadastro de Usuário

| Identificador | RF-01 |
|------|------|
| Descrição | Permitir novo cadastro com e-mail (identificador único) e senha |
| Frontend | Formulário com validação; chama POST /api/usuarios |
| Backend | Recebe e-mail e senha (hash com bcrypt). Verifica unicidade. Insere na tabela usuarios. Retorna 201 ou erro |
| BD | Tabela usuarios (id, email, senha_hash, saldo_pontos (default 0), criado_em) |
| User Story | Como novo cliente, quero me cadastrar para começar a acumular pontos |

**Critérios de Aceite**
1. E-mail único e formato válido  
2. Senha mínima 6 caracteres, armazenada com hash  
3. Após cadastro, redirecionar para login  
4. Campo saldo_pontos inicia em 0  

---

### 5.2 Autenticação e Autorização

| Identificador | RF-02 |
|------|------|
| Descrição | Login gera token JWT; acesso a rotas protegidas exige token válido |
| Frontend | Tela de login; envia POST /api/login. Armazena token em localStorage. Interceptador HTTP adiciona token aos headers. Logout remove token. Guardas de rota protegem páginas internas |
| Backend | Verifica credenciais. Gera JWT (expiração 8h). Endpoint /api/me retorna dados do usuário autenticado |
| BD | Leitura da tabela usuarios |

**Critérios de Aceite**
1. Login inválido exibe erros  
2. Token é enviado no header Authorization: Bearer \<token>  
3. Rotas como /resgate, /pedidos são bloqueadas sem token  
4. Logout limpa o token local  

---

### 5.3 Cadastro de Endereço de Entrega

| Identificador | RF-03 |
|------|------|
| Descrição | Usuário pode cadastrar, editar, listar e excluir endereços. Um pode ser marcado como padrão |
| Frontend | Componente de gestão de endereços. Consome GET /api/enderecos, POST /api/enderecos, PUT /api/enderecos/:id, DELETE /api/enderecos/:id |
| Backend | Valida campos obrigatórios. Associa endereço ao usuario_id (via token) |
| BD | Tabela enderecos (id, usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado, padrao boolean). Apenas um padrão por usuário |

**Critérios de Aceite**
1. Usuário pode ter múltiplos endereços  
2. Ao resgatar produto, lista endereços disponíveis  
3. Edição/exclusão só permitida para endereços do próprio usuário  

---

### 5.4 Consulta de Saldo de Pontos e Extrato

| Identificador | RF-04 |
|------|------|
| Descrição | Exibir saldo atual e histórico de transações (ganhos e resgates) |
| Frontend | Página com saldo e tabela de extrato. Chama GET /api/saldo e GET /api/extrato?periodo=.... |
| Backend | saldo retorna campo saldo_pontos da tabela usuarios. extrato busca na tabela transacoes do usuário, ordenada por data. Filtro por período é aplicado na consulta SQL |
| BD | Tabela transacoes (id, usuario_id, tipo ('ganho' ou 'resgate'), pontos, descricao, data_criacao) |

**Critérios de Aceite**
1. Saldo é calculado via soma das transações (ou campo denormalizado)  
2. Extrato paginado (10 registros por vez)  
3. Filtros: último mês, 3 meses, personalizado  

---

### 5.5 Listagem de Produtos Disponíveis para Resgate

| Identificador | RF-05 |
|------|------|
| Descrição | Catálogo com categorias, subcategorias, busca e paginação |
| Frontend | Chamada GET /api/produtos?categoria=&subcategoria=&busca=&pagina=. Exibe cards com imagem, nome, pontos |
| Backend | Endpoint com suporte a filtros. Retorna lista paginada e total de registros. Produtos são estáticos (criados previamente no banco) |
| BD | Tabela produtos (id, nome, descricao, pontos_necessarios, categoria, subcategoria, imagem_url, ativo) |

**Critérios de Aceite**
1. Filtros combinados funcionam corretamente  
2. Produtos inativos (ativo = false) não aparecem  
3. Página de detalhe: GET /api/produtos/:id  

---

### 5.6 Resgate de Produtos (Troca)

| Identificador | RF-06 |
|------|------|
| Descrição | Usuário troca pontos por produto, desde que tenha saldo suficiente e endereço cadastrado |
| Frontend | Botão "Resgatar" → verificação de endereço → modal de confirmação → POST /api/resgates com { produto_id, endereco_id } |
| Backend | 1. Verificar saldo atual (consulta saldo) <br> 2. Verificar produto ativo e pontos necessários <br> 3. Verificar se endereço pertence ao usuário <br> 4. Em transação: debitar pontos, criar pedido com status 'Confirmado' <br> 5. Atualizar campo saldo_pontos |
| BD | Tabela pedidos (id, usuario_id, produto_id, endereco_entrega_id, pontos_gastos, status, data_pedido) |

**Critérios de Aceite**
1. Saldo insuficiente → erro 400  
2. Sem endereço cadastrado → erro 422  
3. Resgate bem-sucedido → retorna 201  
4. Operação atômica  

---

### 5.7 Listagem de Pedidos (com Status de Entrega)

| Identificador | RF-07 |
|------|------|
| Descrição | Histórico de pedidos do usuário com status e detalhes |
| Frontend | GET /api/pedidos |
| Backend | Retorna pedidos do usuário autenticado |
| BD | pedidos com relacionamento |

**Critérios de Aceite**
1. Pedidos ordenados do mais recente para o mais antigo  
2. Status visualmente distintos  
3. Detalhe mostra endereço completo  
4. Não permite acessar pedidos de outros usuários  

---

## 6. Requisitos Não Funcionais

| ID | Descrição |
|----|----------|
| RNF-01 | Segurança: Senhas com hash bcrypt (fator 10). JWT com chave secreta em variável de ambiente. |
| RNF-02 | Desempenho: Respostas da API em menos de 200ms para consultas comuns (com índices adequados). |
| RNF-03 | Estrutura do código: Backend em Node.js (Express); Frontend Angular com módulos, serviços e componentes reutilizáveis. |
| RNF-04 | Banco de dados: Utilizar PostgreSQL. Criar índices em usuarios(email), transacoes(usuario_id, data_criacao), pedidos(usuario_id). |
| RNF-05 | Tratamento de erros: API deve retornar códigos HTTP semanticamente corretos (400, 401, 403, 404, 422, 500) e mensagens em JSON padronizada { "erro": "descrição" }. |
| RNF-06 | Documentação da API: (Opcional, mas recomendado) Swagger para os endpoints. |
| RNF-07 | Responsividade: Frontend Angular deve ser responsivo (mobile-first). |

---

## 7. Priorização (MoSCoW)

| Must have | Should have | Could have |
|----------|------------|-----------|
| Cadastro e login | Múltiplos endereços | Filtro de extrato por período |
| Cadastro de endereço | Edição/exclusão de endereço | Busca de produtos |
| Consulta de saldo e extrato | Página de detalhe do produto | |
| Listagem de produtos | | |
| Resgate de produtos | | |
| Listagem de pedidos | | |

---

## 8. Endpoints da API (Resumo)

| Método | Rota | Descrição | Autenticação |
|--------|------|----------|-------------|
| POST | /api/usuarios | Cadastrar novo usuário | Não |
| POST | /api/login | Autenticar e receber JWT | Não |
| GET | /api/me | Dados do usuário logado | Sim |
| GET | /api/enderecos | Listar endereços | Sim |
| POST | /api/enderecos | Criar endereço | Sim |
| PUT | /api/enderecos/:id | Atualizar endereço | Sim |
| DELETE | /api/enderecos/:id | Remover endereço | Sim |
| GET | /api/saldo | Obter saldo | Sim |
| GET | /api/extrato | Listar transações | Sim |
| GET | /api/produtos | Listar produtos | Sim |
| GET | /api/produtos/:id | Detalhe do produto | Sim |
| POST | /api/resgates | Realizar resgate | Sim |
| GET | /api/pedidos | Histórico de pedidos | Sim |
| GET | /api/pedidos/:id | Detalhe do pedido | Sim |

---

## 9. Fluxos de Navegação (Frontend)
- Cadastro → Login → Dashboard (exibe saldo via API)
- Dashboard → catálogo de produtos (carregado da API) → detalhe → resgate → seleção de endereço → confirmação → pedidos 
- Perfil/Endereços → CRUD de endereços via API  
- Extrato → requisição para /api/extrato com filtros  
- Meus Pedidos → lista de resgates com status reais  

---

## 10. Considerações de Implementação
- O backend deve ser desenvolvido primeiro (API funcional) e o frontend Angular consumirá os endpoints reais. 
- Utilize migrações para criar as tabelas e dados iniciais (ex: produtos de exemplo, transações de demonstração).  
- O cálculo do saldo pode ser feito tanto pelo campo denormalizado (usuarios.saldo_pontos) quanto pela soma das transações. Recomenda-se manter ambos com triggers ou lógica na aplicação para consistência. 
- Para simular ganhos de pontos (ex: compras em parceiros), crie um endpoint administrativo simples (fora do escopo principal) ou insira transações manuais via seed. 
- O status dos pedidos pode ser atualizado por um operador via painel interno (não requisitado agora, mas deixar estrutura pronta). 
- Testes automatizados (unitários no backend, testes e2e e frontend) são bem-vindos. 