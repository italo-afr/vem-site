(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const foto = (n) => `img/modelos/${n}.jpg`;
  const id = new URLSearchParams(location.search).get("m");
  const m = MODELOS.find((x) => x.id === id) || MODELOS[0];

  Object.entries(m.tema).forEach(([k, v]) => document.body.style.setProperty("--" + k, v));
  document.body.classList.add("m-" + m.id);
  document.title = `${m.nome} · modelo de demonstração ${CONFIG.nome}`;
  document.querySelectorAll("[data-nome]").forEach((el) => (el.textContent = CONFIG.nome));
  document.getElementById("demoNome").textContent = m.nome;
  document.getElementById("demoQuero").href = `index.html?ramo=${m.id}#montar`;

  const numeros = (ns) => (ns ? `<dl class="m-numeros">${ns.map((n) => `<div><dt>${esc(n.n)}</dt><dd>${esc(n.t)}</dd></div>`).join("")}</dl>` : "");

  const secao = (s) => {
    if (s.tipo === "cards")
      return `<h2>${esc(s.titulo)}</h2><div class="m-cards${s.colunas === 4 ? " m-cards-4" : ""}${s.numerado ? " m-numerado" : ""}">${s.itens
        .map((i) => `<article class="m-card${i.img ? " m-prod" : ""}">${i.img ? `<img src="${foto(i.img)}" alt="${esc(i.t)}" loading="lazy">` : ""}<h3>${esc(i.t)}</h3><p>${esc(i.d)}</p>${i.p ? `<div class="m-preco">${esc(i.p)}</div>` : ""}</article>`)
        .join("")}</div>`;
    if (s.tipo === "menu")
      return `<h2>${esc(s.titulo)}</h2><div class="m-menu">${s.grupos.map((g) => `<div><h3>${esc(g.nome)}</h3>${g.itens.map((i) => `<div class="m-item"><div class="m-item-linha"><span>${esc(i.t)}</span><span>${esc(i.p)}</span></div><p>${esc(i.d)}</p></div>`).join("")}</div>`).join("")}</div>`;
    if (s.tipo === "passos")
      return `<h2>${esc(s.titulo)}</h2><div class="m-passos">${s.itens.map((i) => `<div class="m-passo"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div>`).join("")}</div>`;
    if (s.tipo === "sobre")
      return `<div class="m-sobre${s.img ? "" : " m-sobre-so"}${s.inverter ? " m-inv" : ""}">
        <div><p class="m-tag">${esc(s.rotulo)}</p><h2>${esc(s.titulo)}</h2><p class="m-lead">${esc(s.texto)}</p>${numeros(s.numeros)}</div>
        ${s.img ? `<img class="m-sobre-img" src="${foto(s.img)}" alt="${esc(s.alt)}" loading="lazy">` : ""}</div>`;
    if (s.tipo === "perfil")
      return `<div class="m-perfil"><img src="${foto(s.img)}" alt="${esc(s.alt)}" loading="lazy">
        <div><p class="m-tag">${esc(s.rotulo)}</p><h2>${esc(s.nome)}</h2><p class="m-cargo">${esc(s.cargo)}</p>
        <ul class="m-check">${s.itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ul><a class="m-btn" href="#contato">${esc(m.cta)}</a></div></div>`;
    return "";
  };

  const texto = `<p class="m-tag">${esc(m.tag)}</p><h1>${esc(m.chamada)}</h1><p class="m-lead">${esc(m.texto)}</p><a class="m-btn" href="#contato">${esc(m.cta)}</a>`;
  const fundo = `<img class="h-bg" src="${foto(m.capa)}" alt="${esc(m.capaAlt)}">`;
  let hero;
  if (m.hero === "foto")
    hero = `<section class="m-hero h-foto">${fundo}<div class="m-wrap"><div class="h-txt">${texto}</div><ul class="h-faixa">${m.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div></section>`;
  else if (m.hero === "escuro")
    hero = `<section class="m-hero h-escuro${m.centro ? " h-centro" : ""}">${fundo}<div class="m-wrap"><div class="h-txt">${texto}</div><div class="m-destaques">${m.destaques.map((d) => `<span>${esc(d)}</span>`).join("")}</div></div></section>`;
  else
    hero = `<section class="m-hero h-lado${m.hero === "arco" ? " h-arco" : ""}"><div class="m-wrap"><div>${texto}<ul class="m-check h-lista">${m.destaques.slice(1).map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
      <div class="h-caixa"><img src="${foto(m.capa)}" alt="${esc(m.capaAlt)}"><span class="h-selo">${esc(m.destaques[0])}</span></div></div></section>`;

  document.getElementById("app").innerHTML = `
    <header class="m-topo"><div class="m-wrap m-topo-in">
      <a class="m-marca" href="#">${esc(m.nome)}</a>
      <nav class="m-nav" aria-label="Seções">${m.secoes.map((s) => `<a href="#${s.id}">${esc(s.menu || s.titulo)}</a>`).join("")}<a href="#contato">Contato</a></nav>
      <a class="m-btn m-btn-sm" href="#contato">${esc(m.cta)}</a>
    </div></header>
    <main>
      ${hero}
      ${m.secoes.map((s) => `<section class="m-sec s-${s.tipo}" id="${s.id}"><div class="m-wrap">${secao(s)}</div></section>`).join("")}
      <section class="m-sec m-contato" id="contato"><div class="m-wrap">
        <div>
          <h2>Contato</h2>
          <dl>
            <div><dt>Endereço</dt><dd>${esc(CONTATO_FICTICIO.endereco)}</dd></div>
            <div><dt>Horário</dt><dd>${esc(m.horario)}</dd></div>
            <div><dt>WhatsApp</dt><dd>${esc(CONTATO_FICTICIO.telefone)}</dd></div>
          </dl>
        </div>
        <div class="m-caixa">
          <h3>${esc(m.cta)}</h3>
          <p>No site de verdade, este botão abre o WhatsApp do negócio com a mensagem pronta. Aqui é só uma demonstração.</p>
          <a class="m-btn" href="index.html?ramo=${m.id}#montar">Quero um site assim</a>
        </div>
      </div></section>
    </main>
    <footer class="m-rodape"><div class="m-wrap">${esc(m.nome)} é um negócio fictício criado pela ${esc(CONFIG.nome)} para demonstração. Endereço, telefone, preços, pessoas e produtos não são reais, e as imagens foram geradas por inteligência artificial.</div></footer>`;
})();
