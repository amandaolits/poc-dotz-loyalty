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
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Cupom R$ 10 iFood',           'Cupom de desconto de R$10 no iFood',                         500,   'Cupons',      'Alimentacao',  'https://images.prismic.io/gdo1/aftBf8BOoF08xrHq_5dd27876e69eab97d4df26ff8b96b621.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Cupom R$ 20 Uber',            'Cupom de desconto de R$20 na Uber',                          900,   'Cupons',      'Transporte',   'https://images.prismic.io/gdo1/aftBf8BOoF08xrHq_5dd27876e69eab97d4df26ff8b96b621.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Fone Bluetooth JBL',          'Fone sem fio JBL Tune 510BT - som incrivel',                 3500,  'Eletronicos', 'Audio',        'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/fone-de-ouvido-sem-fio-jbl-tune-510bt-preto/magazineluiza/236492000/102b297590e4f339f30edeed3ef8521f.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Gift Card Amazon R$ 50',      'Cartao presente Amazon no valor de R$50',                    2500,  'Gift Cards',  'E-commerce',   'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/cartao-presente-amazon-digital-50/magazineluiza/238759300/6b7ddaed36f80b7b404f9e0c8d815a07.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Spotify 3 meses',             'Assinatura de 3 meses do Spotify Premium',                   1800,  'Assinaturas', 'Musica',       'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/assinatura-spotify-premium-3-meses-digital/magazineluiza/238759700/828c6b2b7f087eb99a99328a83e76dc3.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Camiseta Dotz',               'Camiseta exclusiva da marca Dotz - algodao premium',         1200,  'Produtos',    'Vestuario',    'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/camiseta-lisa-masculina-malha-ultra-fria-gola-redonda-manga-curta/magazineluiza/236707500/b7762d17bf1987011cf8b9985204c999.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Garrafa Termica',             'Garrafa termica Inox 500ml - mantem a temperatura',          800,   'Produtos',    'Acessorios',   'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/garrafa-termica-em-aco-inox-montreal-750ml/magazineluiza/236822800/4779dcc504b871a5f8696f7d4e0b1949.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Cupom R$ 50 Magalu',          'Cupom de R$50 para usar no Magazine Luiza',                  2200,  'Cupons',      'Varejo',       'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/cartao-presente-magazine-luiza-50-digital/magazineluiza/238759200/3a42ecb9e0999698c2035269ba8d8a94.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Smartwatch Xiaomi',           'Smartwatch Xiaomi Redmi Watch 3',                             4500,  'Eletronicos', 'Relogios',     'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/smartwatch-xiaomi-redmi-watch-3-1-75-tela-amoled-ntb-preto/magazineluiza/236494600/3b13780d22df555c14534d7dc1b75a45.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'Gift Card Netflix R$ 30',     'Cartao presente Netflix R$30 - 1 mes',                        1500,  'Gift Cards',  'Streaming',    'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/cartao-presente-netflix-30-digital/magazineluiza/238759400/5d22f1b89d5604cd6424146463287b2f.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jogo de Panelas',             'Jogo de panelas antiaderente 5 pecas',                       2800,  'Casa',        'Cozinha',      'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/jogo-de-panelas-antiaderente-5-pecas-tramontina-preto/magazineluiza/236501200/1a8f72921713e0244b9e15be2f4b4e86.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Mochila Executiva',           'Mochila para notebook 15.6 - couro sintetico',               1600,  'Produtos',    'Acessorios',   'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/mochila-para-notebook-executiva-masculina-mash-brasil-couro/magazineluiza/236678900/94acd4de4fb5591f4b02dd35a19e7d89.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Cadeira Gamer',               'Cadeira giratória ergonômica com apoio de lombar',           7200,  'Eletronicos', 'Escritorio',   'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/cadeira-gamer-dt3-sports-rhino-quasar-preto-azul/magazineluiza/236575800/4deed7e39e6e87c6f6955f626b3c7d87.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Vale Livro Saraiva R$ 40',    'Vale presente Saraiva no valor de R$40',                     2000,  'Gift Cards',  'Livraria',     'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/vale-presente-saraiva-40-digital/magazineluiza/238759800/9eec43d0a5d7badab0df2ef6f9c0a38d.jpg', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Cupom R$ 100 Airbnb',         'Cupom de desconto de R$100 no Airbnb',                       4000,  'Cupons',      'Viagem',       'https://a-static.mlcdn.com.br/300xq100/https://a-static.mlcdn.com.br/1500x1500/cartao-presente-airbnb-100-digital/magazineluiza/238759100/47ce0b4e80bd4a60f31c7e6cb6f82f7d.jpg', true);

-- Transações (extrato)
INSERT INTO transacoes (usuario_id, tipo, pontos, descricao) VALUES
  -- Maria: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   10000, 'Bonus de cadastro'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   15000, 'Compra no parceiro Magazine Luiza'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   8000,  'Compra no parceiro iFood'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   5000,  'Compra no parceiro Uber'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   7000,  'Compra no parceiro Amazon'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ganho',   5000,  'Bonus promocao dobra de pontos'),
  -- Maria: resgate
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'resgate', 3500,  'Resgate: Fone Bluetooth JBL'),
  -- João: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   5000,  'Bonus de cadastro'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   6000,  'Compra no parceiro iFood'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   4000,  'Compra no parceiro Amazon'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'ganho',   3000,  'Compra no parceiro Spotify'),
  -- João: resgates
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'resgate', 800,   'Resgate: Garrafa Termica'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'resgate', 1200,  'Resgate: Camiseta Dotz'),
  -- Ana: ganho único (saldo baixo)
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'ganho',   500,   'Bonus de cadastro'),
  -- Carlos: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   10000, 'Bonus de cadastro'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   12000, 'Compra no parceiro Magazine Luiza'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   8000,  'Compra no parceiro iFood'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   6000,  'Compra no parceiro Americanas'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'ganho',   9000,  'Bonus promocao triple de pontos'),
  -- Carlos: resgates
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'resgate', 4500,  'Resgate: Smartwatch Xiaomi'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'resgate', 2500,  'Resgate: Gift Card Amazon R$ 50'),
  -- Juliana: ganhos
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   3000,  'Bonus de cadastro'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   4000,  'Compra no parceiro Uber'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   2000,  'Compra no parceiro iFood'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'ganho',   1000,  'Bonus indicacao amigo');

-- Pedidos (histórico de resgates)
INSERT INTO pedidos (usuario_id, produto_id, endereco_entrega_id, pontos_gastos, status) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 3500, 'Entregue'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 800,  'Entregue'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 1200, 'Entregue'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 4500, 'Entregue'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 2500, 'Entregue');
