-- ============================================================
-- SEED: Popula banco com dados realistas para teste de interface
-- Todas as senhas: 123456 (bcrypt hash gerado com 10 rounds)
-- ============================================================

-- Usuários
INSERT INTO usuarios (id, email, senha_hash, saldo_pontos) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'maria@email.com',   '$2b$10$ihIFrF1BJnf/HVwA7K31peEKSDnMm8kSyT9JVFv1XYg.eaywubG7G', 50000),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'joao@email.com',    '$2b$10$ihIFrF1BJnf/HVwA7K31peEKSDnMm8kSyT9JVFv1XYg.eaywubG7G', 15000),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'ana@email.com',     '$2b$10$ihIFrF1BJnf/HVwA7K31peEKSDnMm8kSyT9JVFv1XYg.eaywubG7G', 500),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'carlos@email.com',  '$2b$10$ihIFrF1BJnf/HVwA7K31peEKSDnMm8kSyT9JVFv1XYg.eaywubG7G', 35000),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'juliana@email.com', '$2b$10$ihIFrF1BJnf/HVwA7K31peEKSDnMm8kSyT9JVFv1XYg.eaywubG7G', 8000);

-- Endereços
INSERT INTO enderecos (id, usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado, padrao) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '01310-100', 'Avenida Paulista',   '1000', 'Apto 42',   'Bela Vista',   'São Paulo',       'SP', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '04538-001', 'Rua Funchal',        '500',  'Cj 101',    'Vila Olímpia', 'São Paulo',       'SP', false),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '20040-002', 'Avenida Rio Branco', '185',  'Sala 305',  'Centro',       'Rio de Janeiro',  'RJ', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '22775-001', 'Estrada da Gávea',   '800',  'Casa',      'Barra da Tijuca', 'Rio de Janeiro', 'RJ', false),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '30140-071', 'Rua Bahia',          '350',  NULL,        'Funcionários', 'Belo Horizonte',  'MG', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '80060-140', 'Rua das Flores',     '200',  'Apto 15',   'Centro',       'Curitiba',        'PR', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '82630-010', 'Rua XV de Novembro', '1500', NULL,        'Água Verde',   'Curitiba',        'PR', false),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', '70070-010', 'SHS Quadra 6',       '100',  'Bloco A',   'Asa Sul',      'Brasília',        'DF', true);

-- Produtos
INSERT INTO produtos (id, nome, descricao, pontos_necessarios, categoria, subcategoria, imagem_url, ativo) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Cupom R$ 10 iFood',           'Cupom de desconto de R$10 no iFood',                         500,   'Cupons',      'Alimentacao',  'https://picsum.photos/seed/ifood/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Cupom R$ 20 Uber',            'Cupom de desconto de R$20 na Uber',                          900,   'Cupons',      'Transporte',   'https://picsum.photos/seed/uber/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Fone Bluetooth JBL',          'Fone sem fio JBL Tune 510BT - som incrivel',                 3500,  'Eletronicos', 'Audio',        'https://picsum.photos/seed/fone-jbl/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Gift Card Amazon R$ 50',      'Cartao presente Amazon no valor de R$50',                    2500,  'Gift Cards',  'E-commerce',   'https://picsum.photos/seed/amazon/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Spotify 3 meses',             'Assinatura de 3 meses do Spotify Premium',                   1800,  'Assinaturas', 'Musica',       'https://picsum.photos/seed/spotify/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Camiseta Dotz',               'Camiseta exclusiva da marca Dotz - algodao premium',         1200,  'Produtos',    'Vestuario',    'https://picsum.photos/seed/camiseta/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Garrafa Termica',             'Garrafa termica Inox 500ml - mantem a temperatura',          800,   'Produtos',    'Acessorios',   'https://picsum.photos/seed/garrafa/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Cupom R$ 50 Magalu',          'Cupom de R$50 para usar no Magazine Luiza',                  2200,  'Cupons',      'Varejo',       'https://picsum.photos/seed/magalu/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Smartwatch Xiaomi',           'Smartwatch Xiaomi Redmi Watch 3',                             4500,  'Eletronicos', 'Relogios',     'https://picsum.photos/seed/smartwatch/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'Gift Card Netflix R$ 30',     'Cartao presente Netflix R$30 - 1 mes',                        1500,  'Gift Cards',  'Streaming',    'https://picsum.photos/seed/netflix/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jogo de Panelas',             'Jogo de panelas antiaderente 5 pecas',                       2800,  'Casa',        'Cozinha',      'https://picsum.photos/seed/panelas/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Mochila Executiva',           'Mochila para notebook 15.6 - couro sintetico',               1600,  'Produtos',    'Acessorios',   'https://picsum.photos/seed/mochila/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Cadeira Gamer',               'Cadeira giratória ergonômica com apoio de lombar',           7200,  'Eletronicos', 'Escritorio',   'https://picsum.photos/seed/cadeira-gamer/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Vale Livro Saraiva R$ 40',    'Vale presente Saraiva no valor de R$40',                     2000,  'Gift Cards',  'Livraria',     'https://picsum.photos/seed/saraiva/400/300', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Cupom R$ 100 Airbnb',         'Cupom de desconto de R$100 no Airbnb',                       4000,  'Cupons',      'Viagem',       'https://picsum.photos/seed/airbnb/400/300', true);

-- Transações (extrato)
INSERT INTO transacoes (usuario_id, tipo, pontos, descricao, data_criacao) VALUES
  -- Maria: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   10000, 'Bonus de cadastro',                   '2025-11-15 09:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   15000, 'Compra no parceiro Magazine Luiza',   '2025-12-20 14:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   8000,  'Compra no parceiro iFood',            '2026-01-10 11:15:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   5000,  'Compra no parceiro Uber',             '2026-02-14 08:45:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   7000,  'Compra no parceiro Amazon',           '2026-03-05 16:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   5000,  'Bonus promocao dobra de pontos',      '2026-04-01 10:00:00'),
  -- Maria: resgates
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'resgate', 3500,  'Resgate: Fone Bluetooth JBL',         '2026-04-15 10:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'resgate', 2200,  'Resgate: Cupom R$ 50 Magalu',         '2026-05-06 09:15:00'),
  -- João: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   5000,  'Bonus de cadastro',                   '2026-01-05 09:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   6000,  'Compra no parceiro iFood',            '2026-02-10 12:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   4000,  'Compra no parceiro Amazon',           '2026-03-01 15:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   3000,  'Compra no parceiro Spotify',          '2026-03-20 10:45:00'),
  -- João: resgates
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'resgate', 800,   'Resgate: Garrafa Termica',            '2026-04-10 14:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'resgate', 1200,  'Resgate: Camiseta Dotz',              '2026-04-25 11:30:00'),
  -- Ana: ganho único (saldo baixo)
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'ganho',   500,   'Bonus de cadastro',                   '2026-05-01 09:00:00'),
  -- Carlos: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   10000, 'Bonus de cadastro',                   '2025-12-01 09:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   12000, 'Compra no parceiro Magazine Luiza',   '2026-01-15 14:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   8000,  'Compra no parceiro iFood',            '2026-02-20 10:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   6000,  'Compra no parceiro Americanas',       '2026-03-10 11:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   9000,  'Bonus promocao triple de pontos',     '2026-04-05 09:30:00'),
  -- Carlos: resgates
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'resgate', 4500,  'Resgate: Smartwatch Xiaomi',          '2026-04-20 15:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'resgate', 2500,  'Resgate: Gift Card Amazon R$ 50',     '2026-05-05 10:00:00'),
  -- Juliana: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   3000,  'Bonus de cadastro',                   '2026-03-01 09:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   4000,  'Compra no parceiro Uber',             '2026-04-01 08:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   2000,  'Compra no parceiro iFood',            '2026-04-20 12:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   1000,  'Bonus indicacao amigo',               '2026-05-02 14:00:00'),
  -- Juliana: resgates
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'resgate', 500,   'Resgate: Cupom R$ 10 iFood',          '2026-05-03 10:00:00');

-- Pedidos (histórico de resgates)
INSERT INTO pedidos (usuario_id, produto_id, endereco_entrega_id, pontos_gastos, status, data_pedido) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 3500, 'Entregue',    '2026-04-15 10:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 800,  'Entregue',    '2026-04-10 14:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 1200, 'Entregue',    '2026-04-25 11:30:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 4500, 'Em transito', '2026-04-20 15:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 2500, 'Confirmado',  '2026-05-05 10:00:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 2200, 'Confirmado',  '2026-05-06 09:15:00'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 500,  'Confirmado',  '2026-05-03 10:00:00');
