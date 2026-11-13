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
    cta: "Ver as telas", id: "servicoflow",
    pontos: [
      { t: "Atendente", d: "Registra o pedido, monta o orçamento e agenda a visita sem conflito de horário." },
      { t: "Cliente", d: "Abre um link privado, vê o orçamento e aceita ou recusa, sem criar conta." },
      { t: "Técnico", d: "Vê as visitas no celular, registra o que fez e envia as fotos do serviço." },
    ],
    telas: [
      { src: "img/servicoflow/01-painel.webp", legenda: "Painel com os números do dia, as visitas de hoje e as ordens recentes" },
      { src: "img/servicoflow/03-ordem-com-orcamento.webp", legenda: "Ordem de serviço com o orçamento enviado ao cliente" },
      { src: "img/servicoflow/11-ordens-lista.webp", legenda: "Lista de ordens com estado e prioridade" },
      { src: "img/servicoflow/06-agenda-semana.webp", legenda: "Agenda da semana por técnico" },
      { src: "img/servicoflow/04-cliente-orcamento-celular.webp", legenda: "O cliente decide o orçamento pelo celular", cel: true },
      { src: "img/servicoflow/07-tecnico-minhas-visitas-celular.webp", legenda: "O técnico vê as visitas do dia", cel: true },
      { src: "img/servicoflow/08-tecnico-execucao-celular.webp", legenda: "Registro do serviço feito, com fotos", cel: true },
    ],
    tema: { bg: "#eef6fb", tinta: "#0f2b3d", cor: "#0b76b8", corTinta: "#ffffff", fonte: "'Plus Jakarta Sans', system-ui, sans-serif" },
  },
];

const MODELOS = [
  {
    id: "saude", ramo: "Saúde e estética", nome: "Clínica Aurora", tag: "Odontologia e estética",
    tema: { bg: "#f3f8f6", papel: "#ffffff", tinta: "#12302c", suave: "#55726d", cor: "#0f8f7e", corTinta: "#ffffff", fonte: "'Fraunces', Georgia, serif" },
    hero: "foto", capa: "saude-hero", capaAlt: "Paciente sorrindo na cadeira de uma clínica odontológica clara",
    chamada: "Seu sorriso bem cuidado, sem espera.",
    texto: "Atendimento com hora marcada, equipe fixa e orçamento explicado antes de qualquer procedimento.",
    cta: "Agendar avaliação", destaques: ["Avaliação em até 48h", "Parcelamento no cartão", "Emergência no mesmo dia", "Equipe fixa"],
    horario: "Segunda a sexta, 8h às 19h · Sábado, 8h às 12h",
    secoes: [
      { tipo: "sobre", id: "clinica", menu: "A clínica", rotulo: "A clínica", titulo: "Cuidado de verdade, com tecnologia e sem pressa.",
        texto: "Consultórios novos, exames feitos na hora e uma equipe que explica cada passo. Você sai sabendo o que vai ser feito, em quanto tempo e por quanto.",
        img: "saude-clinica", alt: "Consultório odontológico moderno em tons de branco e verde-água",
        numeros: [{ n: "15 anos", t: "de clínica" }, { n: "4,9", t: "de nota no Google" }, { n: "48h", t: "para a primeira avaliação" }] },
      { tipo: "cards", id: "tratamentos", titulo: "Tratamentos", itens: [
        { t: "Limpeza e prevenção", d: "Consulta completa com orientação de higiene e aplicação de flúor." },
        { t: "Clareamento", d: "Em consultório ou caseiro supervisionado, com acompanhamento." },
        { t: "Aparelhos e alinhadores", d: "Planejamento digital para adultos e adolescentes." },
        { t: "Implantes", d: "Do planejamento à prótese, com a mesma equipe." },
        { t: "Harmonização facial", d: "Procedimentos estéticos com avaliação individual." },
        { t: "Odontopediatria", d: "Primeira consulta sem pressa, para a criança se sentir segura." } ] },
      { tipo: "perfil", id: "equipe", menu: "Equipe", rotulo: "Quem cuida de você", nome: "Dra. Helena Prado", cargo: "Responsável técnica da clínica",
        img: "saude-dentista", alt: "Dentista de jaleco branco sorrindo",
        itens: ["Especialista em implantes e reabilitação", "15 anos de atendimento", "Atende adultos e crianças"] },
      { tipo: "passos", id: "como-funciona", titulo: "Como funciona", itens: [
        { t: "Agende on-line", d: "Escolha o dia e o horário em menos de um minuto." },
        { t: "Avaliação", d: "Exame, conversa e plano de tratamento por escrito." },
        { t: "Tratamento", d: "Datas combinadas e lembrete por WhatsApp antes de cada consulta." } ] },
    ],
  },
  {
    id: "alimentacao", ramo: "Alimentação", nome: "Cantina do Nono", tag: "Massas artesanais desde 1987",
    tema: { bg: "#1a120d", papel: "#261a13", tinta: "#f6eadb", suave: "#c9b29c", cor: "#e9824a", corTinta: "#1a120d", fonte: "'DM Serif Display', Georgia, serif" },
    hero: "escuro", capa: "cantina-hero", capaAlt: "Prato de tagliatelle ao ragu sobre mesa de madeira",
    chamada: "Massa fresca feita hoje, molho de panela.",
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
      { tipo: "sobre", id: "casa", menu: "A casa", rotulo: "A casa", titulo: "Trinta lugares, uma cozinha e a receita do nono.",
        texto: "A cantina continua do tamanho que sempre foi. A massa é aberta toda manhã e o molho fica na panela desde cedo. Reserve a sua mesa pelo WhatsApp.",
        img: "cantina-salao", alt: "Salão de cantina italiana com mesas de madeira e luz quente", inverter: true,
        numeros: [{ n: "1987", t: "ano de abertura" }, { n: "30", t: "lugares no salão" }, { n: "40 min", t: "de entrega no bairro" }] },
      { tipo: "passos", id: "pedido", titulo: "Como pedir", itens: [
        { t: "Escolha no cardápio", d: "Preços e pratos sempre atualizados." },
        { t: "Peça pelo WhatsApp", d: "Seu pedido chega pronto para a cozinha." },
        { t: "Receba ou retire", d: "Entrega no bairro ou retirada no balcão." } ] },
    ],
  },
  {
    id: "servicos", ramo: "Prestadores de serviço", nome: "ClimaCerto", tag: "Ar-condicionado e refrigeração",
    tema: { bg: "#f3f7fc", papel: "#ffffff", tinta: "#0b2540", suave: "#52677e", cor: "#ff8a1f", corTinta: "#1f1300", cor2: "#0b5cad", fonte: "'Space Grotesk', system-ui, sans-serif" },
    hero: "lado", capa: "clima-hero", capaAlt: "Técnico instalando um ar-condicionado split na parede",
    chamada: "Ar gelando hoje. Orçamento em 10 minutos.",
    texto: "Instalação, limpeza e conserto de ar-condicionado para casas e empresas, com garantia por escrito.",
    cta: "Pedir orçamento", destaques: ["Atendimento no mesmo dia", "Garantia de 90 dias", "Técnicos certificados"],
    horario: "Segunda a sábado, 7h às 19h · Plantão aos domingos",
    secoes: [
      { tipo: "cards", id: "servicos", titulo: "Serviços", itens: [
        { t: "Instalação", d: "Split, cassete e piso-teto, com acabamento limpo.", p: "a partir de R$ 450" },
        { t: "Limpeza completa", d: "Higienização de evaporadora, filtros e dreno.", p: "a partir de R$ 180" },
        { t: "Conserto", d: "Diagnóstico na hora e peças com nota.", p: "visita R$ 90" },
        { t: "Contrato para empresas", d: "Manutenção preventiva mensal com relatório.", p: "sob consulta" } ] },
      { tipo: "sobre", id: "porque", menu: "Por que a gente", rotulo: "Por que a ClimaCerto", titulo: "Casa fresca, sem sujeira e sem surpresa na conta.",
        texto: "O técnico chega no horário combinado, protege os móveis e deixa tudo limpo. O valor é fechado antes de começar e a garantia vai por escrito.",
        img: "clima-sala", alt: "Sala de estar clara com ar-condicionado split na parede",
        numeros: [{ n: "90 dias", t: "de garantia" }, { n: "10 min", t: "para o orçamento" }, { n: "7 dias", t: "por semana" }] },
      { tipo: "passos", id: "atendimento", titulo: "Como atendemos", itens: [
        { t: "Você manda uma foto", d: "Do aparelho e do local, pelo WhatsApp." },
        { t: "Orçamento fechado", d: "Valor e prazo antes de sair de casa." },
        { t: "Serviço com garantia", d: "Termo de garantia enviado no mesmo dia." } ] },
    ],
  },
  {
    id: "escritorios", ramo: "Advocacia e contabilidade", nome: "Moura & Teles", tag: "Advocacia empresarial",
    tema: { bg: "#0f1a2e", papel: "#17243c", tinta: "#f1ece2", suave: "#b3b9c7", cor: "#c9a45c", corTinta: "#0f1a2e", fonte: "'Fraunces', Georgia, serif" },
    hero: "escuro", centro: true, capa: "adv-hero", capaAlt: "Sala de reunião de escritório com estante de livros",
    chamada: "Decisões seguras para a sua empresa.",
    texto: "Assessoria jurídica para pequenas e médias empresas, com linguagem clara e honorários combinados antes.",
    cta: "Falar com o escritório", destaques: ["Primeira conversa sem custo", "Atendimento on-line", "Sigilo profissional"],
    horario: "Segunda a sexta, 9h às 18h",
    secoes: [
      { tipo: "sobre", id: "escritorio", menu: "O escritório", rotulo: "O escritório", titulo: "Direito explicado em português claro.",
        texto: "Atendemos empresas que não têm departamento jurídico. Cada cliente fala direto com um dos sócios, recebe o parecer por escrito e sabe quanto vai pagar antes de começar.",
        numeros: [{ n: "20 anos", t: "de atuação" }, { n: "2 sócios", t: "no atendimento direto" }, { n: "100%", t: "dos honorários combinados antes" }] },
      { tipo: "cards", id: "areas", titulo: "Áreas de atuação", numerado: true, itens: [
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
    hero: "lado", capa: "lume-hero", capaAlt: "Canto de sala com aparador, vasos de cerâmica e poltrona com manta",
    chamada: "Peças que deixam a casa com a sua cara.",
    texto: "Cerâmicas, velas e têxteis feitos por pequenos produtores. Compre on-line e receba em todo o Brasil.",
    cta: "Ver produtos", destaques: ["Frete grátis acima de R$ 250", "Pix com 5% de desconto", "Troca em 30 dias"],
    horario: "Loja física: segunda a sábado, 10h às 19h",
    secoes: [
      { tipo: "cards", id: "produtos", titulo: "Mais vendidos", colunas: 4, itens: [
        { t: "Vaso de cerâmica Areia", d: "Feito à mão, 22 cm.", p: "R$ 189", img: "lume-vaso" },
        { t: "Vela Figo e Cedro", d: "Cera vegetal, 40 horas de queima.", p: "R$ 79", img: "lume-vela" },
        { t: "Manta de algodão Trama", d: "1,30 m × 1,70 m, cru.", p: "R$ 249", img: "lume-manta" },
        { t: "Jogo de xícaras Lume", d: "Quatro peças esmaltadas.", p: "R$ 159", img: "lume-xicaras" } ] },
      { tipo: "passos", id: "compra", titulo: "Como comprar", itens: [
        { t: "Escolha as peças", d: "Fotos reais e medidas em cada produto." },
        { t: "Pague por Pix ou cartão", d: "Em até 6 vezes sem juros." },
        { t: "Receba em casa", d: "Embalagem reforçada e código de rastreio." } ] },
    ],
  },
  {
    id: "outros", ramo: "Outro negócio", nome: "Studio Vértice", tag: "Pilates e treino funcional",
    tema: { bg: "#f4efe6", papel: "#fffaf2", tinta: "#2c362b", suave: "#667062", cor: "#5a7050", corTinta: "#ffffff", fonte: "'Fraunces', Georgia, serif" },
    hero: "arco", capa: "studio-hero", capaAlt: "Aluna fazendo exercício em um aparelho de pilates em estúdio claro",
    chamada: "Movimento no seu ritmo, com turma pequena.",
    texto: "Aulas de pilates e funcional com no máximo seis alunos. A primeira aula é por nossa conta.",
    cta: "Marcar aula experimental", destaques: ["Até 6 alunos por turma", "Aula experimental grátis", "Horários das 6h às 21h"],
    horario: "Segunda a sexta, 6h às 21h · Sábado, 8h às 12h",
    secoes: [
      { tipo: "sobre", id: "estudio", menu: "O estúdio", rotulo: "O estúdio", titulo: "Turma pequena, atenção de aula particular.",
        texto: "Com poucos alunos por horário, a instrutora corrige cada movimento e adapta o treino ao seu corpo. Serve para quem está começando e para quem voltou de uma lesão.",
        img: "studio-aula", alt: "Turma pequena em aula de pilates no solo com instrutora", inverter: true,
        numeros: [{ n: "6", t: "alunos por turma, no máximo" }, { n: "45 min", t: "por aula" }, { n: "1ª aula", t: "por nossa conta" }] },
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
