// Dados da empresa. Troque aqui e o site inteiro atualiza.
const CONFIG = {
  nome: "Vem Site",
  whatsapp: "5519991369828", // DDI + DDD + número, só dígitos
  email: "vemsitecontato@gmail.com",
  linkedin: "https://www.linkedin.com/company/vemsite/",
  horario: "Segunda a sexta, das 8h às 17h30",
  // Chave gratuita da API PageSpeed Insights (Google Cloud). Restrinja a chave ao
  // domínio do site. Vazia = o raio-X vira pedido manual pelo WhatsApp.
  pagespeedKey: "AIzaSyD3LGKyQCyFFr-2ylO8D7OWY3Tbv6Ws1nY",
};

// Tipos de site do configurador.
// mensal = assinatura de 12 meses (já inclui o plano Básico). O preço à vista é calculado
// pela regra DESCONTO_AVISTA, logo abaixo dos planos.
const TIPOS = [
  { id: "landing", nome: "Landing page", desc: "Uma página para vender um serviço ou captar contatos.", mensal: 147, dias: 7, paginas: 1, extras: false },
  { id: "institucional", nome: "Site institucional", desc: "Até 5 páginas: início, sobre, serviços, galeria e contato.", mensal: 247, dias: 12, paginas: 5, extras: true },
  { id: "loja", nome: "Loja virtual", desc: "Catálogo, carrinho e pagamento on-line.", mensal: 397, dias: 25, paginas: 5, extras: true },
];

const PAGINA_EXTRA = { mensal: 20, dias: 1 };

const ADICIONAIS = [
  { id: "agendamento", nome: "Agendamento on-line", desc: "O cliente marca horário pelo site.", mensal: 60, dias: 4 },
  { id: "catalogo", nome: "Cardápio ou catálogo digital", desc: "Produtos e preços que você mesmo atualiza.", mensal: 45, dias: 3 },
  { id: "blog", nome: "Blog", desc: "Área de artigos para aparecer mais no Google.", mensal: 30, dias: 2 },
  { id: "textos", nome: "Textos profissionais", desc: "A gente escreve os textos do site para você.", mensal: 30, dias: 2 },
];

const PLANOS = [
  { nome: "Básico", preco: 127, itens: ["Hospedagem e certificado de segurança", "Backup diário", "Monitoramento 24h com aviso no WhatsApp", "1 alteração por mês pelo WhatsApp", "Domínio no seu nome"] },
  { nome: "Profissional", preco: 297, destaque: true, itens: ["Tudo do Básico", "Até 4 alterações por mês (2 horas)", "Pedidos de alteração pelo WhatsApp", "Relatório mensal de visitas e contatos"] },
  { nome: "Completo", preco: 697, itens: ["Tudo do Profissional", "Google Meu Negócio cuidado por nós", "Um artigo de blog por mês", "Atendimento em 1 dia útil"] },
];

// À vista = 12 mensalidades com este desconto, arredondado para dezenas, já com o
// primeiro ano do plano de manutenção escolhido. Sem fidelidade.
const DESCONTO_AVISTA = 0.1;
const avistaDe = (mensal) => Math.round((mensal * 12 * (1 - DESCONTO_AVISTA)) / 10) * 10;
[...TIPOS, ...ADICIONAIS, PAGINA_EXTRA].forEach((x) => (x.avista = avistaDe(x.mensal)));

function calcularOrcamento(e) {
  const tipo = TIPOS.find((t) => t.id === e.tipo);
  const extras = tipo.extras ? e.extras : 0;
  const adds = ADICIONAIS.filter((a) => e.adicionais.has(a.id));
  const plano = PLANOS[e.plano || 0];
  const difPlano = plano.preco - PLANOS[0].preco;
  const mensal = tipo.mensal + extras * PAGINA_EXTRA.mensal + adds.reduce((s, a) => s + a.mensal, 0) + difPlano;
  // O desconto e o arredondamento são aplicados uma única vez ao total.
  return { tipo, extras, adds, plano, difPlano, mensal, avista: avistaDe(mensal),
    dias: tipo.dias + extras * PAGINA_EXTRA.dias + adds.reduce((s, a) => s + a.dias, 0),
    paginas: tipo.paginas + extras };
}

const AVULSOS = [
  { id: "lento", nome: "Site lento", desc: "Otimização de velocidade", preco: 450, prazo: "3 dias úteis" },
  { id: "google", nome: "Aparecer melhor no Google", desc: "Títulos, descrições e ajustes técnicos", preco: 390, prazo: "3 dias úteis" },
  { nome: "Site fora do ar ou invadido", desc: "Recuperação e limpeza", preco: 690, prazo: "1 dia útil" },
  { nome: "Troca de hospedagem", desc: "Migração sem tirar o site do ar", preco: 390, prazo: "2 dias úteis" },
  { nome: "Adequação à LGPD", desc: "Aviso de cookies e política de privacidade", preco: 350, prazo: "3 dias úteis" },
  { nome: "Pacote de 5 ajustes", desc: "Textos, imagens, telefones e preços", preco: 290, prazo: "2 dias úteis" },
  { nome: "Google Meu Negócio", desc: "Criação e configuração do perfil", preco: 250, prazo: "3 dias úteis" },
];

// Página de suporte (suporte.html), gerada por ferramentas/gerar_suporte.py.
// Cada chamado avulso tem até 1 hora de trabalho, remoto, no horário de CONFIG.horario.
const SUPORTE = [
  { id: "email", nome: "E-mail profissional", desc: "Criar contas no seu domínio, configurar no celular e no computador, recuperar acesso e resolver e-mail que não chega ou não sai.", preco: 120 },
  { id: "dominio", nome: "Domínio e hospedagem", desc: "Renovar o domínio, ajustar o DNS, apontar para o site ou para o e-mail e resolver site fora do ar por falta de pagamento ou configuração.", preco: 120 },
  { id: "computador", nome: "Suporte remoto no computador", desc: "Instalar e configurar programas, resolver lentidão, travamentos, vírus e atualizações, por acesso remoto com a sua autorização.", preco: 120 },
];
const SUPORTE_MENSAL = { nome: "Suporte mensal", preco: 349, itens: ["Até 4 chamados por mês, de até 1 hora cada", "E-mail, domínio e computadores no mesmo pacote", "Até 5 computadores ou usuários", "Prioridade na fila de atendimento", "Pedidos pelo WhatsApp"] };

const RAMOS = [
  { id: "saude", pagina: "site-para-clinicas-e-consultorios.html", nome: "Saúde e estética", titulo: "Agenda cheia começa no Google", texto: "Clínicas, consultórios, dentistas e salões: o paciente pesquisa, compara e marca pelo celular.", itens: ["Agendamento on-line e botão de WhatsApp", "Página para cada especialidade ou tratamento", "Avaliações do Google em destaque"], tipo: "institucional", adicionais: ["agendamento"] },
  { id: "alimentacao", pagina: "site-para-restaurantes.html", nome: "Alimentação", titulo: "Seu cardápio a um toque do pedido", texto: "Restaurantes, lanchonetes, confeitarias e deliveries: cardápio sempre atualizado e pedido direto, sem taxa de aplicativo.", itens: ["Cardápio digital que você mesmo atualiza", "Pedido pelo WhatsApp", "Horário, endereço e mapa sempre certos"], tipo: "landing", adicionais: ["catalogo"] },
  { id: "servicos", pagina: "site-para-prestadores-de-servico.html", nome: "Prestadores de serviço", titulo: "Seja o primeiro que o cliente encontra", texto: "Elétrica, climatização, reformas, limpeza e manutenção: quem aparece no Google com cara profissional leva o orçamento.", itens: ["Pedido de orçamento em um toque", "Fotos de serviços realizados", "Página por serviço e por bairro atendido"], tipo: "institucional", adicionais: [] },
  { id: "escritorios", pagina: "site-para-advogados-e-contadores.html", nome: "Advocacia e contabilidade", titulo: "Autoridade antes da primeira reunião", texto: "Escritórios que precisam passar confiança e explicar suas áreas de atuação com clareza.", itens: ["Página por área de atuação", "Artigos para ser encontrado no Google", "Formulário de contato com sigilo"], tipo: "institucional", adicionais: ["blog"] },
  { id: "lojas", pagina: "site-para-lojas.html", nome: "Lojas", titulo: "Venda também quando a loja está fechada", texto: "Do catálogo com pedido pelo WhatsApp à loja virtual completa com pagamento on-line.", itens: ["Catálogo ou loja com carrinho", "Pagamento por Pix e cartão", "Você cadastra produtos sem depender de ninguém"], tipo: "loja", adicionais: [] },
  { id: "outros", pagina: "site-para-pequenos-negocios.html", nome: "Outro negócio", titulo: "Qualquer negócio, do jeito certo", texto: "Escolas, academias, igrejas, eventos, imobiliárias, profissionais autônomos: montamos o site em volta do que você precisa.", itens: ["Modelo pensado para o seu ramo", "Botão de WhatsApp e mapa", "Google Meu Negócio configurado"], tipo: "institucional", adicionais: [] },
];

const FAQ = [
  ["Quanto custa?", "O preço está na tela. Você monta o site no configurador e vê o valor e o prazo na hora, à vista ou por assinatura."],
  ["Como funciona a assinatura?", "Você paga uma mensalidade por 12 meses, sem entrada. Ela já inclui a criação do site, a hospedagem e a manutenção básica. Depois dos 12 meses o site é seu e você pode levá-lo embora sem custo."],
  ["E se o site atrasar?", "O prazo combinado começa a contar quando recebemos seus textos e fotos. Se passarmos dele, a primeira mensalidade é por nossa conta."],
  ["O domínio fica no meu nome?", "Sim, sempre. Textos, fotos e logotipo também são seus desde o primeiro dia."],
  ["Vocês mexem em site que não fizeram?", "Sim. Os serviços avulsos e os planos de manutenção valem para qualquer site. Antes de começar, fazemos um raio-X grátis para saber o que ele precisa."],
  ["O que conta como alteração?", "Troca de texto, imagem, telefone, horário ou preço, com até 30 minutos de trabalho. O plano Básico inclui uma por mês e o Profissional, até quatro. Página ou função nova tem orçamento à parte."],
  ["Vocês fazem suporte de TI?", "Fazemos suporte remoto para pequenos negócios: e-mail profissional, domínio e hospedagem e computadores (programas, lentidão, vírus e atualizações). O atendimento é de segunda a sexta, das 8h às 17h30, por chamado avulso ou pacote mensal. Os preços estão na página de suporte."],
  ["Posso pagar à vista?", "Pode. O valor à vista é o das 12 mensalidades com 10% de desconto, já com o primeiro ano de manutenção e sem fidelidade."],
  ["Qual tipo de site é indicado para o meu negócio?", "Para divulgar um serviço e receber pedidos, uma landing page pode ser suficiente. Para apresentar a empresa e vários serviços, indicamos o institucional. Para vender com carrinho e pagamento on-line, escolha a loja virtual. As páginas por ramo mostram exemplos de cada caso."],
  ["O site vai aparecer em primeiro no Google ou nas IAs?", "Não há garantia de posição ou recomendação. Preparamos títulos, páginas, conteúdo e estrutura para facilitar a leitura pelos buscadores. Os resultados dependem também da concorrência, da relevância do conteúdo e do reconhecimento do negócio."],
  ["Já tenho um site. Preciso refazer tudo?", "Nem sempre. O raio-X gratuito ajuda a identificar problemas de velocidade e boas práticas. Depois da análise, podemos indicar um conserto pontual, um plano de manutenção ou uma reformulação, com orçamento antes de começar."],
];
