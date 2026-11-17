(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const foto = (n) => `img/modelos/${n}.webp`;
  const id = new URLSearchParams(location.search).get("m");
  const m = structuredClone(MODELOS.find((x) => x.id === id) || MODELOS[0]);

  // Prévia personalizada: ?nome=&cidade=&cor= vindos do formulário da página principal.
  const q = new URLSearchParams(location.search);
  const pvNome = (q.get("nome") || "").trim().slice(0, 40);
  const pvCidade = (q.get("cidade") || "").trim().slice(0, 40);
  const pvCor = /^#[0-9a-f]{6}$/i.test(q.get("cor") || "") ? q.get("cor") : "";
  const previa = !!pvNome;
  let enderecoDemo = CONTATO_FICTICIO.endereco;
  if (previa) {
    document.body.classList.add('personalizado');
    m.nome = pvNome;
    if (pvCor) {
      m.tema.cor = pvCor;
      m.tema.cor2 = JORNADA.corLegivel(pvCor, m.tema.bg);
      m.tema.corTinta = JORNADA.textoNaCor(pvCor);
    }
    if (pvCidade) {
      enderecoDemo = `Rua das Flores, 123 · Centro · ${pvCidade}`;
      m.texto = `${m.texto} Em ${pvCidade}.`;
    }
  }

  Object.entries(m.tema).forEach(([k, v]) => document.body.style.setProperty("--" + k, v));
  document.body.classList.add("m-" + m.id);
  document.title = `${m.nome} · modelo de demonstração ${CONFIG.nome}`;
  document.querySelectorAll("[data-nome]").forEach((el) => (el.textContent = CONFIG.nome));
  document.getElementById("demoNome").textContent = m.nome;
  const jornada = JORNADA.ler();
  jornada.ramo = m.id;
  const voltarOrcamento = 'index.html?' + JORNADA.parametros(jornada) + '#montar';
  document.getElementById("demoQuero").href = voltarOrcamento;
  if (previa) {
    document.title = `${m.nome} · prévia ${CONFIG.nome}`;
    document.querySelector(".demo-faixa > span").innerHTML =
      `Prévia do site de <strong>${esc(m.nome)}</strong>, montada pela <strong>${esc(CONFIG.nome)}</strong>. Textos, fotos e preços são de exemplo.`;
    const quero = document.getElementById("demoQuero");
    quero.textContent = "Ver preço da minha prévia →";
    quero.href = voltarOrcamento;
  }

  const numeros = (ns) => (ns ? `<dl class="m-numeros">${ns.map((n) => `<div><dt>${esc(n.n)}</dt><dd>${esc(n.t)}</dd></div>`).join("")}</dl>` : "");
  const cta = (classe = "") => `<a class="m-btn ${classe}" href="#contato">${esc(m.cta)}</a>`;

  // Cada estilo de "cards" tem uma estrutura própria, para os modelos não parecerem o mesmo site.
  const cards = (s) => {
    const it = s.itens;
    if (s.estilo === "linhas")
      return `<div class="m-linhas">${it.map((i) => `<article class="m-linha"><div><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div><strong class="m-preco">${esc(i.p)}</strong><a class="m-btn m-btn-sm" href="#contato">Pedir</a></article>`).join("")}</div>`;
    if (s.estilo === "lista")
      return `<ol class="m-lista">${it.map((i) => `<li><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></li>`).join("")}</ol>`;
    if (s.estilo === "artigos")
      return `<div class="m-artigos">${it.map((i) => `<a class="m-artigo" href="#contato"><span>Artigo</span><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p><em>Ler artigo →</em></a>`).join("")}</div>`;
    if (s.estilo === "produtos")
      return `<div class="m-produtos">${it.map((i) => `<article class="m-produto"><img src="${foto(i.img)}" alt="${esc(i.t)}" loading="lazy"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p><div class="m-produto-pe"><strong>${esc(i.p)}</strong><a class="m-btn m-btn-sm" href="#contato">Comprar</a></div></article>`).join("")}</div>`;
    if (s.estilo === "planos")
      return `<div class="m-planos">${it.map((i, n) => `<article class="m-plano${n === 1 ? " destaque" : ""}">${n === 1 ? `<span class="m-plano-tag">Mais procurado</span>` : ""}<h3>${esc(i.t)}</h3><div class="m-plano-preco">${esc(i.p)}</div><p>${esc(i.d)}</p><a class="m-btn" href="#contato">Quero este</a></article>`).join("")}</div>`;
    if (s.estilo === "pilulas")
      return `<div class="m-pilulas">${it.map((i) => `<div class="m-pilula"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div>`).join("")}</div>`;
    return `<div class="m-cards${s.estilo === "icones" ? " m-icones" : ""}">${it.map((i) => `<article class="m-card"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p>${i.p ? `<div class="m-preco">${esc(i.p)}</div>` : ""}</article>`).join("")}</div>`;
  };

  const corpo = (s) => {
    if (s.tipo === "cards") return `<h2>${esc(s.titulo)}</h2>${cards(s)}`;
    if (s.tipo === "menu")
      return `<h2>${esc(s.titulo)}</h2><div class="m-menu">${s.grupos.map((g) => `<div><h3>${esc(g.nome)}</h3>${g.itens.map((i) => `<div class="m-item"><div class="m-item-linha"><span>${esc(i.t)}</span><i></i><span>${esc(i.p)}</span></div><p>${esc(i.d)}</p></div>`).join("")}</div>`).join("")}</div>`;
    if (s.tipo === "passos")
      return `<h2>${esc(s.titulo)}</h2><div class="m-passos p-${s.estilo || "padrao"}">${s.itens.map((i) => `<div class="m-passo"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div>`).join("")}</div>`;
    if (s.tipo === "sobre") {
      const txt = `<p class="m-tag">${esc(s.rotulo)}</p><h2>${esc(s.titulo)}</h2><p class="m-lead">${esc(s.texto)}</p>${numeros(s.numeros)}`;
      if (s.estilo === "faixa") return `<div class="m-faixa-caixa">${txt}</div>`;
      return `<div class="m-sobre${s.img ? "" : " m-sobre-so"}${s.inverter ? " m-inv" : ""}"><div>${txt}</div>${s.img ? `<img class="m-sobre-img" src="${foto(s.img)}" alt="${esc(s.alt)}" loading="lazy">` : ""}</div>`;
    }
    if (s.tipo === "perfil")
      return `<div class="m-perfil"><img src="${foto(s.img)}" alt="${esc(s.alt)}" loading="lazy">
        <div><p class="m-tag">${esc(s.rotulo)}</p><h2>${esc(s.nome)}</h2><p class="m-cargo">${esc(s.cargo)}</p>
        <ul class="m-check">${s.itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>${cta()}</div></div>`;
    return "";
  };
  const secao = (s) => {
    const faixa = s.tipo === "sobre" && s.estilo === "faixa";
    return `<section class="m-sec s-${s.tipo}${s.estilo ? " e-" + s.estilo : ""}" id="${s.id}">${faixa ? `<img class="h-bg" src="${foto(s.img)}" alt="${esc(s.alt)}" loading="lazy">` : ""}<div class="m-wrap">${corpo(s)}</div></section>`;
  };

  // Hero
  const texto = `<p class="m-tag">${esc(m.tag)}</p><h1>${esc(m.chamada)}</h1><p class="m-lead">${esc(m.texto)}</p>${cta()}`;
  const fundo = `<img class="h-bg" src="${foto(m.capa)}" alt="${esc(m.capaAlt)}">`;
  let hero;
  if (m.hero === "foto")
    hero = `<section class="m-hero h-foto">${fundo}<div class="m-wrap"><div class="h-txt">${texto}</div><ul class="h-faixa">${m.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div></section>`;
  else if (m.hero === "escuro")
    hero = `<section class="m-hero h-escuro${m.centro ? " h-centro" : ""}">${fundo}<div class="m-wrap"><div class="h-txt">${texto}</div><div class="m-destaques">${m.destaques.map((d) => `<span>${esc(d)}</span>`).join("")}</div></div></section>`;
  else if (m.hero === "banner")
    hero = `<section class="m-hero h-banner"><div class="m-wrap"><div class="h-banner-img"><img src="${foto(m.capa)}" alt="${esc(m.capaAlt)}"><div class="h-banner-caixa">${texto}</div></div>
      <ul class="h-vantagens">${m.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div></section>`;
  else
    hero = `<section class="m-hero h-lado${m.hero === "arco" ? " h-arco" : ""}"><div class="m-wrap"><div>${texto}<ul class="m-check h-lista">${m.destaques.slice(1).map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
      <div class="h-caixa"><img src="${foto(m.capa)}" alt="${esc(m.capaAlt)}"><span class="h-selo">${esc(m.destaques[0])}</span></div></div></section>`;

  // Cabeçalho: seis estruturas diferentes
  const links = m.secoes.map((s) => `<a href="#${s.id}">${esc(s.menu || s.titulo)}</a>`).concat(`<a href="#contato">Contato</a>`);
  const marca = `<a class="m-marca" href="#">${esc(m.nome)}</a>`;
  const meio = Math.ceil(links.length / 2);
  const topos = {
    padrao: `${marca}<nav class="m-nav" aria-label="Seções">${links.join("")}</nav>${cta("m-btn-sm")}`,
    centro: `<nav class="m-nav" aria-label="Seções">${links.slice(0, meio).join("")}</nav><div class="t-marca">${marca}<small>${esc(m.tag)}</small></div><nav class="m-nav t-dir" aria-label="Mais seções">${links.slice(meio).join("")}${cta("m-btn-sm")}</nav>`,
    contato: `${marca}<nav class="m-nav" aria-label="Seções">${links.join("")}</nav><div class="t-fone"><small>Ligue agora</small><strong>${esc(CONTATO_FICTICIO.telefone)}</strong></div>${cta("m-btn-sm")}`,
    linha: `${marca}<nav class="m-nav" aria-label="Seções">${links.join("")}</nav>${cta("m-btn-sm m-btn-contorno")}`,
    loja: `<div class="t-loja"><span class="t-busca">Buscar produtos</span>${marca}<span class="t-conta"><a href="#contato">Minha conta</a><a href="#contato">Sacola (0)</a></span></div><nav class="m-nav" aria-label="Seções">${links.join("")}</nav>`,
    pilula: `${marca}<nav class="m-nav" aria-label="Seções">${links.join("")}</nav>${cta("m-btn-sm")}`,
  };

  document.getElementById("app").innerHTML = `
    ${m.aviso ? `<div class="m-aviso">${esc(m.aviso)}</div>` : ""}
    <header class="m-topo t-${m.topo}"><div class="m-wrap m-topo-in">${topos[m.topo] || topos.padrao}</div></header>
    <main>
      ${hero}
      ${m.secoes.map(secao).join("")}
      <section class="m-sec m-contato" id="contato"><div class="m-wrap">
        <div>
          <h2>Contato</h2>
          <dl>
            <div><dt>Endereço</dt><dd>${esc(enderecoDemo)}</dd></div>
            <div><dt>Horário</dt><dd>${esc(m.horario)}</dd></div>
            <div><dt>WhatsApp</dt><dd>${esc(CONTATO_FICTICIO.telefone)}</dd></div>
          </dl>
        </div>
        <div class="m-caixa">
          <h3>${esc(m.cta)}</h3>
          <p>No site de verdade, este botão abre o WhatsApp do negócio com a mensagem pronta. Aqui é só uma demonstração.</p>
          <a class="m-btn" href="${esc(voltarOrcamento)}">Ver preço deste site →</a>
        </div>
      </div></section>
    </main>
    <footer class="m-rodape"><div class="m-wrap">
      <div class="m-rodape-topo"><strong class="m-marca">${esc(m.nome)}</strong><nav aria-label="Rodapé">${links.join("")}</nav></div>
      <p>${previa
        ? `Prévia do site de ${esc(m.nome)} montada pela ${esc(CONFIG.nome)} a partir de um modelo. Textos, endereço, telefone, preços e pessoas são de exemplo, e as imagens foram geradas por inteligência artificial.`
        : `${esc(m.nome)} é um negócio fictício criado pela ${esc(CONFIG.nome)} para demonstração. Endereço, telefone, preços, pessoas e produtos não são reais, e as imagens foram geradas por inteligência artificial.`}</p>
    </div></footer>`;
  // O aviso de demonstração tem altura variável no celular e com nomes longos.
  const faixaDemo = document.querySelector('.demo-faixa');
  const atualizarOffset = () => document.documentElement.style.setProperty('--demo-altura', faixaDemo.offsetHeight + 'px');
  atualizarOffset();
  if ('ResizeObserver' in window) new ResizeObserver(atualizarOffset).observe(faixaDemo);
})();
