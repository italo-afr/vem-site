(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const id = new URLSearchParams(location.search).get("m");
  const m = MODELOS.find((x) => x.id === id) || MODELOS[0];

  Object.entries(m.tema).forEach(([k, v]) => document.body.style.setProperty("--" + k, v));
  document.title = `${m.nome} · modelo de demonstração ${CONFIG.nome}`;
  document.querySelectorAll("[data-nome]").forEach((el) => (el.textContent = CONFIG.nome));
  document.getElementById("demoNome").textContent = m.nome;
  document.getElementById("demoQuero").href = `index.html?ramo=${m.id}#montar`;

  const secao = (s) => {
    if (s.tipo === "cards")
      return `<div class="m-cards">${s.itens.map((i) => `<article class="m-card"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p>${i.p ? `<div class="m-preco">${esc(i.p)}</div>` : ""}</article>`).join("")}</div>`;
    if (s.tipo === "menu")
      return `<div class="m-menu">${s.grupos.map((g) => `<div><h3>${esc(g.nome)}</h3>${g.itens.map((i) => `<div class="m-item"><div class="m-item-linha"><span>${esc(i.t)}</span><span>${esc(i.p)}</span></div><p>${esc(i.d)}</p></div>`).join("")}</div>`).join("")}</div>`;
    if (s.tipo === "passos")
      return `<div class="m-passos">${s.itens.map((i) => `<div class="m-passo"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div>`).join("")}</div>`;
    return "";
  };

  const heroTexto = `<p class="m-tag">${esc(m.tag)}</p><h1>${esc(m.chamada)}</h1><p class="m-lead">${esc(m.texto)}</p><a class="m-btn" href="#contato">${esc(m.cta)}</a>`;
  const hero = m.hero === "split"
    ? `<section class="m-hero m-hero-split"><div class="m-wrap"><div>${heroTexto}</div><div class="m-painel">${m.destaques.map((d) => `<div>${esc(d)}</div>`).join("")}</div></div></section>`
    : `<section class="m-hero m-hero-centro"><div class="m-wrap">${heroTexto}<div class="m-destaques">${m.destaques.map((d) => `<span>${esc(d)}</span>`).join("")}</div></div></section>`;

  document.getElementById("app").innerHTML = `
    <header class="m-topo"><div class="m-wrap m-topo-in">
      <a class="m-marca" href="#">${esc(m.nome)}</a>
      <nav class="m-nav" aria-label="Seções">${m.secoes.map((s) => `<a href="#${s.id}">${esc(s.titulo)}</a>`).join("")}<a href="#contato">Contato</a></nav>
      <a class="m-btn m-btn-sm" href="#contato">${esc(m.cta)}</a>
    </div></header>
    <main>
      ${hero}
      ${m.secoes.map((s) => `<section class="m-sec" id="${s.id}"><div class="m-wrap"><h2>${esc(s.titulo)}</h2>${secao(s)}</div></section>`).join("")}
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
    <footer class="m-rodape"><div class="m-wrap">${esc(m.nome)} é um negócio fictício criado pela ${esc(CONFIG.nome)} para demonstração. Endereço, telefone, preços e produtos não são reais.</div></footer>`;
})();
