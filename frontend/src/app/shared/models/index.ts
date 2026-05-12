export interface Usuario { id: string; email: string; saldo_pontos: number; criado_em: string; }
export interface LoginResponse { token: string; usuario: Usuario; }
export interface Endereco { id: string; usuario_id: string; cep: string; logradouro: string; numero: string; complemento?: string; bairro: string; cidade: string; estado: string; padrao: boolean; criado_em: string; }
export interface Produto { id: string; nome: string; descricao: string; pontos_necessarios: number; categoria?: string; subcategoria?: string; imagem_url?: string; ativo: boolean; }
export interface ProdutoListResponse { produtos: Produto[]; total: number; pagina: number; limite: number; categorias: string[]; subcategorias: string[]; }
export interface Transacao { id: string; usuario_id: string; tipo: 'ganho' | 'resgate'; pontos: number; descricao: string; data_criacao: string; }
export interface ExtratoResponse { transacoes: Transacao[]; total: number; pagina: number; }
export interface Pedido { id: string; usuario_id: string; produto_id: string; endereco_entrega_id: string; pontos_gastos: number; status: string; data_pedido: string; produto_nome?: string; produto_imagem?: string; produto_descricao?: string; produto_pontos_necessarios?: number; logradouro?: string; numero?: string; complemento?: string; bairro?: string; cidade?: string; estado?: string; cep?: string; }
export interface SaldoResponse { saldo_pontos: number; }
export interface ToastMessage { id: string; type: 'success' | 'error' | 'info'; message: string; }
