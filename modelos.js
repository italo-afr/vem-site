// Sites-modelo do portfólio. Todos os negócios, endereços e telefones são fictícios.
// Cada modelo usa o id do ramo correspondente em RAMOS (config.js).
const CONTATO_FICTICIO = { endereco: "Rua das Flores, 123 · Centro", telefone: "(00) 00000-0000" };

// Trabalhos reais. Só entra aqui o que foi de fato entregue, com autorização do cliente.
// "link" é opcional: sem ele o cartão não é clicável.
const TRABALHOS = [
  {
    nome: "Livia Barbuti", tipo: "Site + sistema · no ar", tag: "Educação parental",
    chamada: "Site, área dos pais e painel de atendimento.",
    desc: "Site de uma página com vídeo e chamada para agendar, área com login para as famílias e painel para a profissional montar e publicar os planos.",
    cta: "Ver site no ar", link: "https://liviabarbuti.com.br",
    tema: { bg: "#fef0f6", tinta: "#4a4d3c", cor: "#6f7652", corTinta: "#ffffff", fonte: "'Fraunces', Georgia, serif" },
  },
  {
    nome: "Nexo ERP", tipo: "Sistema sob medida · demonstração", tag: "Gestão financeira",
    chamada: "Vendas, contas e contratos em um só sistema.",
    desc: "Orçamentos e vendas parceladas, contas a pagar e a receber, contratos mensais, estoque simples e relatório de caixa. Versão de demonstração com dados fictícios.",
    cta: "Versão de demonstração",
    tema: { bg: "#111827", tinta: "#eef2ff", cor: "#818cf8", corTinta: "#111827", fonte: "'Space Grotesk', system-ui, sans-serif" },
  },
  {
    nome: "ServiçoFlow", tipo: "Sistema sob medida · demonstração", tag: "Ordens de serviço",
    chamada: "Do pedido ao serviço feito, em um só lugar.",
    desc: "Para empresas de manutenção: o atendente monta o orçamento e agenda a visita, o cliente aprova por um link sem criar conta e o técnico registra o serviço com fotos pelo celular. Demonstração com dados fictícios.",
    cta: "Ver as telas", id: "servicoflow", codigo: "https://github.com/italo-afr/servico-flow",
    pontos: [
      { t: "Atendente", d: "Registra o pedido, monta o orçamento e agenda a visita sem conflito de horário." },
      { t: "Cliente", d: "Abre um link privado, vê o orçamento e aceita ou recusa, sem criar conta." },
      { t: "Técnico", d: "Vê as visitas no celular, registra o que fez e envia as fotos do serviço." },
    ],
    telas: [
      { src: "img/servicoflow/01-painel.png", legenda: "Painel com o resumo das ordens e das visitas do dia" },
      { src: "img/servicoflow/06-agenda-semana.png", legenda: "Agenda da semana por técnico" },
      { src: "img/servicoflow/04-cliente-orcamento-celular.png", legenda: "O cliente decide o orçamento pelo celular", cel: true },
      { src: "img/servicoflow/07-tecnico-minhas-visitas-celular.png", legenda: "O técnico vê as visitas do dia", cel: true },
      { src: "img/servicoflow/08-tecnico-execucao-celular.png", legenda: "Registro do serviço feito, com fotos", cel: true },
    ],
    tema: { bg: "#eef6fb", tinta: "#0f2b3d", cor: "#0b76b8", corTinta: "#ffffff", fonte: "'Plus Jakarta Sans', system-ui, sans-serif" },
  },
];

const MODELOS = [
  {
    id: "saude", ramo: "Saúde e estética", nome: "Clínica Aurora", tag: "Odontologia e estética",
    tema: { bg: "#f3f8f6", papel: "#ffffff", tinta: "#12302c", suave: "#55726d", cor: "#0f8f7e", corTinta: "#ffffff", fonte: "'Fraunces', Georgia, serif" },
    hero: "split", chamada: "Seu sorriso bem cuidado, sem espera.",
    texto: "Atendimento com hora marcada, equipe fixa e orçamento explicado antes de qualquer procedimento.",
    cta: "Agendar avaliação", destaques: ["Avaliação em até 48h", "Parcelamento no cartão", "Emergência no mesmo dia"],
    horario: "Segunda a sexta, 8h às 19h · Sábado, 8h às 12h",
    secoes: [
      { tipo: "cards", id: "tratamentos", titulo: "Tratamentos", itens: [
        { t: "Limpeza e prevenção", d: "Consulta completa com orientação de higiene e aplicação de flúor." },
        { t: "Clareamento", d: "Em consultório ou caseiro supervisionado, com acompanhamento." },
        { t: "Aparelhos e alinhadores", d: "Planejamento digital para adultos e adolescentes." },
        { t: "Implantes", d: "Do planejamento à prótese, com a mesma equipe." },
        { t: "Harmonização facial", d: "Procedimentos estéticos com avaliação individual." },
        { t: "Odontopediatria", d: "Primeira consulta sem pressa, para a criança se sentir segura." } ] },
      { tipo: "passos", id: "como-funciona", titulo: "Como funciona", itens: [
        { t: "Agende on-line", d: "Escolha o dia e o horário em menos de um minuto." },
        { t: "Avaliação", d: "Exame, conversa e plano de tratamento por escrito." },
        { t: "Tratamento", d: "Datas combinadas e lembrete por WhatsApp antes de cada consulta." } ] },
    ],
  },
  {
    id: "alimentacao", ramo: "Alimentação", nome: "Cantina do Nono", tag: "Massas artesanais",
    tema: { bg: "#fbf4ea", papel: "#fffaf3", tinta: "#3a1d14", suave: "#7c5a4c", cor: "#c2410c", corTinta: "#ffffff", fonte: "'DM Serif Display', Georgia, serif" },
    hero: "centro", chamada: "Massa fresca feita hoje, molho de panela.",
    texto: "Almoço e jantar no salão ou na sua casa. Peça direto com a gente, sem taxa de aplicativo.",
    cta: "Fazer pedido", destaques: ["Entrega em 40 min", "Massa feita no dia", "Opções vegetarianas"],
    horario: "Terça a domingo, 11h30 às 15h e 18h30 às 23h",
    secoes: [
      { tipo: "menu", id: "cardapio", titulo: "Cardápio", grupos: [
        { nome: "Massas", itens: [
          { t: "Tagliatelle ao ragu", d: "Ragu de carne cozido por seis horas.", p: "R$ 48" },
          { t: "Nhoque da casa", d: "Batata, molho de tomate fresco e manjericão.", p: "R$ 42" },
          { t: "Ravióli de queijo", d: "Quatro queijos, manteiga e sálvia.", p: "R$ 52" } ] },
        { nome: "Para dividir", itens: [
          { t: "Polpetas ao sugo", d: "Seis unidades com pão da casa.", p: "R$ 36" },
          { t: "Burrata com tomates", d: "Tomates assados, azeite e pesto.", p: "R$ 44" } ] },
        { nome: "Sobremesas", itens: [
          { t: "Tiramisù", d: "Receita da família.", p: "R$ 24" },
          { t: "Panna cotta", d: "Com calda de frutas vermelhas.", p: "R$ 22" } ] } ] },
      { tipo: "passos", id: "pedido", titulo: "Como pedir", itens: [
        { t: "Escolha no cardápio", d: "Preços e pratos sempre atualizados." },
        { t: "Peça pelo WhatsApp", d: "Seu pedido chega pronto para a cozinha." },
        { t: "Receba ou retire", d: "Entrega no bairro ou retirada no balcão." } ] },
    ],
  },
  {
    id: "servicos", ramo: "Prestadores de serviço", nome: "ClimaCerto", tag: "Ar-condicionado e refrigeração",
    tema: { bg: "#0d1b2a", papel: "#13263a", tinta: "#eaf2fb", suave: "#9db4cc", cor: "#38bdf8", corTinta: "#06243a", fonte: "'Space Grotesk', system-ui, sans-serif" },
    hero: "split", chamada: "Ar gelando hoje. Orçamento em 10 minutos.",
    texto: "Instalação, limpeza e conserto de ar-condicionado para casas e empresas, com garantia por escrito.",
    cta: "Pedir orçamento", destaques: ["Atendimento no mesmo dia", "Garantia de 90 dias", "Técnicos certificados"],
    horario: "Segunda a sábado, 7h às 19h · Plantão aos domingos",
    secoes: [
      { tipo: "cards", id: "servicos", titulo: "Serviços", itens: [
        { t: "Instalação", d: "Split, cassete e piso-teto, com acabamento limpo.", p: "a partir de R$ 450" },
        { t: "Limpeza completa", d: "Higienização de evaporadora, filtros e dreno.", p: "a partir de R$ 180" },
        { t: "Conserto", d: "Diagnóstico na hora e peças com nota.", p: "visita R$ 90" },
        { t: "Contrato para empresas", d: "Manutenção preventiva mensal com relatório.", p: "sob consulta" } ] },
      { tipo: "passos", id: "atendimento", titulo: "Como atendemos", itens: [
        { t: "Você manda uma foto", d: "Do aparelho e do local, pelo WhatsApp." },
        { t: "Orçamento fechado", d: "Valor e prazo antes de sair de casa." },
        { t: "Serviço com garantia", d: "Termo de garantia enviado no mesmo dia." } ] },
    ],
  },
  {
    id: "escritorios", ramo: "Advocacia e contabilidade", nome: "Moura & Teles", tag: "Advocacia empresarial",
    tema: { bg: "#f6f3ee", papel: "#ffffff", tinta: "#1c1f2b", suave: "#5f6475", cor: "#7a5c2e", corTinta: "#ffffff", fonte: "'Fraunces', Georgia, serif" },
    hero: "centro", chamada: "Decisões seguras para a sua empresa.",
    texto: "Assessoria jurídica para pequenas e médias empresas, com linguagem clara e honorários combinados antes.",
    cta: "Falar com o escritório", destaques: ["Primeira conversa sem custo", "Atendimento on-line", "Sigilo profissional"],
    horario: "Segunda a sexta, 9h às 18h",
    secoes: [
      { tipo: "cards", id: "areas", titulo: "Áreas de atuação", itens: [
        { t: "Contratos", d: "Elaboração e revisão de contratos comerciais e de prestação de serviço." },
        { t: "Trabalhista empresarial", d: "Prevenção de passivos e defesa em reclamações." },
        { t: "Societário", d: "Abertura, alteração e acordo de sócios." },
        { t: "Tributário", d: "Revisão de enquadramento e recuperação de créditos." } ] },
      { tipo: "cards", id: "artigos", titulo: "Artigos recentes", itens: [
        { t: "O que não pode faltar em um contrato de prestação de serviço", d: "Cinco cláusulas que evitam a maior parte das disputas." },
        { t: "Sócio saindo da empresa: por onde começar", d: "O passo a passo para uma saída sem conflito." },
        { t: "MEI, ME ou LTDA: como escolher", d: "As diferenças que pesam no dia a dia." } ] },
    ],
  },
  {
    id: "lojas", ramo: "Lojas", nome: "Casa Lume", tag: "Decoração e presentes",
    tema: { bg: "#faf7f2", papel: "#ffffff", tinta: "#2a2622", suave: "#746b62", cor: "#b4532a", corTinta: "#ffffff", fonte: "'DM Serif Display', Georgia, serif" },
    hero: "split", chamada: "Peças que deixam a casa com a sua cara.",
    texto: "Cerâmicas, velas e têxteis feitos por pequenos produtores. Compre on-line e receba em todo o Brasil.",
    cta: "Ver produtos", destaques: ["Frete grátis acima de R$ 250", "Pix com 5% de desconto", "Troca em 30 dias"],
    horario: "Loja física: segunda a sábado, 10h às 19h",
    secoes: [
      { tipo: "cards", id: "produtos", titulo: "Mais vendidos", itens: [
        { t: "Vaso de cerâmica Areia", d: "Feito à mão, 22 cm.", p: "R$ 189" },
        { t: "Vela Figo e Cedro", d: "Cera vegetal, 40 horas de queima.", p: "R$ 79" },
        { t: "Manta de algodão Trama", d: "1,30 m × 1,70 m, cru.", p: "R$ 249" },
        { t: "Jogo de xícaras Lume", d: "Quatro peças esmaltadas.", p: "R$ 159" },
        { t: "Bandeja de madeira", d: "Freijó com acabamento natural.", p: "R$ 129" },
        { t: "Kit presente Casa Nova", d: "Vela, vaso pequeno e cartão.", p: "R$ 219" } ] },
      { tipo: "passos", id: "compra", titulo: "Como comprar", itens: [
        { t: "Escolha as peças", d: "Fotos reais e medidas em cada produto." },
        { t: "Pague por Pix ou cartão", d: "Em até 6 vezes sem juros." },
        { t: "Receba em casa", d: "Embalagem reforçada e código de rastreio." } ] },
    ],
  },
  {
    id: "outros", ramo: "Outro negócio", nome: "Studio Vértice", tag: "Pilates e treino funcional",
    tema: { bg: "#f5f3ff", papel: "#ffffff", tinta: "#1e1b3a", suave: "#625e85", cor: "#6d28d9", corTinta: "#ffffff", fonte: "'Space Grotesk', system-ui, sans-serif" },
    hero: "centro", chamada: "Movimento no seu ritmo, com turma pequena.",
    texto: "Aulas de pilates e funcional com no máximo seis alunos. A primeira aula é por nossa conta.",
    cta: "Marcar aula experimental", destaques: ["Até 6 alunos por turma", "Aula experimental grátis", "Horários das 6h às 21h"],
    horario: "Segunda a sexta, 6h às 21h · Sábado, 8h às 12h",
    secoes: [
      { tipo: "cards", id: "planos", titulo: "Planos", itens: [
        { t: "1 vez por semana", d: "Para começar ou manter.", p: "R$ 189/mês" },
        { t: "2 vezes por semana", d: "O mais procurado.", p: "R$ 319/mês" },
        { t: "Livre", d: "Todas as modalidades, sem limite.", p: "R$ 449/mês" } ] },
      { tipo: "cards", id: "modalidades", titulo: "Modalidades", itens: [
        { t: "Pilates com aparelhos", d: "Força, postura e alongamento." },
        { t: "Funcional", d: "Circuitos de 45 minutos." },
        { t: "Mobilidade", d: "Para quem passa o dia sentado." } ] },
    ],
  },
];
