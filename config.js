// Dados da empresa. Troque aqui e o site inteiro atualiza.
// ATENÇÃO: WhatsApp e e-mail abaixo são provisórios.
const CONFIG = {
  nome: "Vem Site",
  whatsapp: "5500000000000", // DDI + DDD + número, só dígitos
  email: "contato@exemplo.com.br",
  // Chave gratuita da API PageSpeed Insights (Google Cloud). Restrinja a chave ao
  // domínio do site. Vazia = o raio-X vira pedido manual pelo WhatsApp.
  pagespeedKey: "AIzaSyD3LGKyQCyFFr-2ylO8D7OWY3Tbv6Ws1nY",
};

// Tipos de site do configurador.
// avista = preço único; mensal = assinatura de 12 meses (já inclui o plano Básico).
const TIPOS = [
  { id: "landing", nome: "Landing page", desc: "Uma página para vender um serviço ou captar contatos.", avista: 1200, mensal: 147, dias: 7, paginas: 1, extras: false },
  { id: "institucional", nome: "Site institucional", desc: "Até 5 páginas: início, sobre, serviços, galeria e contato.", avista: 2800, mensal: 247, dias: 12, paginas: 5, extras: true },
  { id: "loja", nome: "Loja virtual", desc: "Catálogo, carrinho e pagamento on-line.", avista: 5500, mensal: 397, dias: 25, paginas: 5, extras: true },
];

const PAGINA_EXTRA = { avista: 250, mensal: 20, dias: 1 };

const ADICIONAIS = [
  { id: "agendamento", nome: "Agendamento on-line", desc: "O cliente marca horário pelo site.", avista: 700, mensal: 60, dias: 4 },
  { id: "catalogo", nome: "Cardápio ou catálogo digital", desc: "Produtos e preços que você mesmo atualiza.", avista: 500, mensal: 45, dias: 3 },
  { id: "blog", nome: "Blog", desc: "Área de artigos para aparecer mais no Google.", avista: 400, mensal: 30, dias: 2 },
  { id: "textos", nome: "Textos profissionais", desc: "A gente escreve os textos do site para você.", avista: 350, mensal: 30, dias: 2 },
];

const PLANOS = [
  { nome: "Básico", preco: 127, itens: ["Hospedagem e certificado de segurança", "Backup diário", "Monitoramento 24h com aviso no WhatsApp", "Domínio no seu nome"] },
  { nome: "Profissional", preco: 297, destaque: true, itens: ["Tudo do Básico", "2 horas de alterações por mês", "Pedidos de alteração pelo WhatsApp", "Relatório mensal de visitas e contatos"] },
  { nome: "Completo", preco: 697, itens: ["Tudo do Profissional", "Google Meu Negócio cuidado por nós", "Um artigo de blog por mês", "Atendimento em 1 dia útil"] },
];

const AVULSOS = [
  { id: "lento", nome: "Site lento", desc: "Otimização de velocidade", preco: 450, prazo: "3 dias úteis" },
  { id: "google", nome: "Aparecer melhor no Google", desc: "Títulos, descrições e ajustes técnicos", preco: 390, prazo: "3 dias úteis" },
  { nome: "Site fora do ar ou invadido", desc: "Recuperação e limpeza", preco: 690, prazo: "1 dia útil" },
  { nome: "Troca de hospedagem", desc: "Migração sem tirar o site do ar", preco: 390, prazo: "2 dias úteis" },
  { nome: "Adequação à LGPD", desc: "Aviso de cookies e política de privacidade", preco: 350, prazo: "3 dias úteis" },
  { nome: "Pacote de 5 ajustes", desc: "Textos, imagens, telefones e preços", preco: 290, prazo: "2 dias úteis" },
  { nome: "Google Meu Negócio", desc: "Criação e configuração do perfil", preco: 250, prazo: "3 dias úteis" },
];

const RAMOS = [
  { id: "saude", nome: "Saúde e estética", titulo: "Agenda cheia começa no Google", texto: "Clínicas, consultórios, dentistas e salões: o paciente pesquisa, compara e marca pelo celular.", itens: ["Agendamento on-line e botão de WhatsApp", "Página para cada especialidade ou tratamento", "Avaliações do Google em destaque"], tipo: "institucional", adicionais: ["agendamento"] },
  { id: "alimentacao", nome: "Alimentação", titulo: "Seu cardápio a um toque do pedido", texto: "Restaurantes, lanchonetes, confeitarias e deliveries: cardápio sempre atualizado e pedido direto, sem taxa de aplicativo.", itens: ["Cardápio digital que você mesmo atualiza", "Pedido pelo WhatsApp", "Horário, endereço e mapa sempre certos"], tipo: "landing", adicionais: ["catalogo"] },
  { id: "servicos", nome: "Prestadores de serviço", titulo: "Seja o primeiro que o cliente encontra", texto: "Elétrica, climatização, reformas, limpeza e manutenção: quem aparece no Google com cara profissional leva o orçamento.", itens: ["Pedido de orçamento em um toque", "Fotos de serviços realizados", "Página por serviço e por bairro atendido"], tipo: "institucional", adicionais: [] },
  { id: "escritorios", nome: "Advocacia e contabilidade", titulo: "Autoridade antes da primeira reunião", texto: "Escritórios que precisam passar confiança e explicar suas áreas de atuação com clareza.", itens: ["Página por área de atuação", "Artigos para ser encontrado no Google", "Formulário de contato com sigilo"], tipo: "institucional", adicionais: ["blog"] },
  { id: "lojas", nome: "Lojas", titulo: "Venda também quando a loja está fechada", texto: "Do catálogo com pedido pelo WhatsApp à loja virtual completa com pagamento on-line.", itens: ["Catálogo ou loja com carrinho", "Pagamento por Pix e cartão", "Você cadastra produtos sem depender de ninguém"], tipo: "loja", adicionais: [] },
  { id: "outros", nome: "Outro negócio", titulo: "Qualquer negócio, do jeito certo", texto: "Escolas, academias, igrejas, eventos, imobiliárias, profissionais autônomos: montamos o site em volta do que você precisa.", itens: ["Modelo pensado para o seu ramo", "Botão de WhatsApp e mapa", "Google Meu Negócio configurado"], tipo: "institucional", adicionais: [] },
];

const FAQ = [
  ["Quanto custa?", "O preço está na tela. Você monta o site no configurador e vê o valor e o prazo na hora, à vista ou por assinatura."],
  ["Como funciona a assinatura?", "Você paga uma mensalidade por 12 meses, sem entrada. Ela já inclui a criação do site, a hospedagem e a manutenção básica. Depois dos 12 meses o site é seu e você pode levá-lo embora sem custo."],
  ["E se o site atrasar?", "O prazo combinado começa a contar quando recebemos seus textos e fotos. Se passarmos dele, a primeira mensalidade é por nossa conta."],
  ["O domínio fica no meu nome?", "Sim, sempre. Textos, fotos e logotipo também são seus desde o primeiro dia."],
  ["Vocês mexem em site que não fizeram?", "Sim. Os serviços avulsos e os planos de manutenção valem para qualquer site. Antes de começar, fazemos um raio-X grátis para saber o que ele precisa."],
  ["O que conta como alteração?", "Troca de texto, imagem, telefone, horário ou preço, com até 30 minutos de trabalho. Página ou função nova tem orçamento à parte."],
];
