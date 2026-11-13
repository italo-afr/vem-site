(function () {
  const $ = (s) => document.querySelector(s);
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const wa = (texto) => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const estado = { tipo: "institucional", extras: 0, adicionais: new Set(), modo: "mensal", ramo: RAMOS[0].id };
  const MAX_EXTRAS = 15;

  // Marca, rodapé e links fixos de WhatsApp
  document.querySelectorAll("[data-nome]").forEach((el) => (el.textContent = CONFIG.nome));
  document.title = CONFIG.nome + " · Sites com preço na tela e manutenção mensal";
  $("#ano").textContent = new Date().getFullYear();
  $("#emailLink").textContent = CONFIG.email;
  $("#emailLink").href = "mailto:" + CONFIG.email;
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = wa(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });

  function calcular(e) {
    const tipo = TIPOS.find((t) => t.id === e.tipo);
    const extras = tipo.extras ? e.extras : 0;
    const adds = ADICIONAIS.filter((a) => e.adicionais.has(a.id));
    const soma = (campo) => tipo[campo] + extras * PAGINA_EXTRA[campo] + adds.reduce((s, a) => s + a[campo], 0);
    return { tipo, extras, adds, avista: soma("avista"), mensal: soma("mensal"), dias: soma("dias"), paginas: tipo.paginas + extras };
  }

  // Cartão de exemplo do topo
  const ex = calcular({ tipo: "institucional", extras: 0, adicionais: new Set(["agendamento"]) });
  $("#hcPreco").textContent = brl(ex.mensal) + "/mês";
  $("#hcPrazo").textContent = ex.dias + " dias";
  $("#nDias").textContent = Math.min(...TIPOS.map((t) => t.dias)) + " dias";
  $("#nMensal").textContent = brl(Math.min(...TIPOS.map((t) => t.mensal))) + "/mês";

  // Ramos
  function desenharRamos() {
    $("#ramoChips").innerHTML = RAMOS.map(
      (r) => `<button type="button" role="tab" aria-selected="${r.id === estado.ramo}" data-ramo="${r.id}">${esc(r.nome)}</button>`
    ).join("");
    const r = RAMOS.find((x) => x.id === estado.ramo);
    $("#ramoPainel").innerHTML = `
      <div>
        <h3 style="font-size:1.5rem">${esc(r.titulo)}</h3>
        <p>${esc(r.texto)}</p>
        <div class="ramo-links">
          <a class="btn" href="#montar" id="ramoUsar">Ver preço para o meu negócio</a>
          <a href="modelo.html?m=${r.id}">Ver site-modelo deste ramo →</a>
        </div>
      </div>
      <ul>${r.itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  }
  $("#ramoChips").addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-ramo]");
    if (!b) return;
    estado.ramo = b.dataset.ramo;
    desenharRamos();
    $(`[data-ramo="${estado.ramo}"]`).focus();
  });
  $("#ramoPainel").addEventListener("click", (ev) => {
    if (!ev.target.closest("#ramoUsar")) return;
    const r = RAMOS.find((x) => x.id === estado.ramo);
    estado.tipo = r.tipo;
    estado.extras = 0;
    estado.adicionais = new Set(r.adicionais);
    desenharOpcoes();
    atualizar();
  });

  // Configurador
  function precoOpcao(o, prefixo) {
    return prefixo + (estado.modo === "mensal" ? brl(o.mensal) + "/mês" : brl(o.avista));
  }
  function desenharOpcoes() {
    $("#tipoLista").innerHTML = TIPOS.map(
      (t) => `<label class="opcao">
        <input type="radio" name="tipo" value="${t.id}" ${t.id === estado.tipo ? "checked" : ""}>
        <span class="opcao-txt"><strong>${esc(t.nome)}</strong><span>${esc(t.desc)}</span></span>
        <span class="opcao-preco">${precoOpcao(t, "")}</span>
      </label>`
    ).join("");
    $("#addLista").innerHTML = ADICIONAIS.map(
      (a) => `<label class="opcao">
        <input type="checkbox" value="${a.id}" ${estado.adicionais.has(a.id) ? "checked" : ""}>
        <span class="opcao-txt"><strong>${esc(a.nome)}</strong><span>${esc(a.desc)}</span><span class="opcao-preco">${precoOpcao(a, "+ ")}</span></span>
      </label>`
    ).join("");
  }

  function atualizar() {
    const c = calcular(estado);
    const mensal = estado.modo === "mensal";

    $("#paginasBox").hidden = !c.tipo.extras;
    $("#pgNum").textContent = c.extras;
    $("#pgMenos").disabled = c.extras <= 0;
    $("#pgMais").disabled = c.extras >= MAX_EXTRAS;
    $("#pgNota").textContent = `${c.tipo.paginas} já inclusas · cada extra ${mensal ? brl(PAGINA_EXTRA.mensal) + "/mês" : brl(PAGINA_EXTRA.avista)}`;

    const novoPreco = brl(mensal ? c.mensal : c.avista);
    if ($("#rPreco").textContent !== novoPreco) {
      const caixa = $("#rPreco").parentElement;
      caixa.classList.remove("pulsa");
      void caixa.offsetWidth;
      caixa.classList.add("pulsa");
    }
    $("#rPreco").textContent = novoPreco;
    $("#rSufixo").textContent = mensal ? "/mês" : "";
    $("#rDet").textContent = mensal
      ? `12 meses, sem entrada. Total de ${brl(c.mensal * 12)}, com hospedagem e manutenção inclusas.`
      : `Pagamento único. Hospedagem e manutenção a partir de ${brl(PLANOS[0].preco)}/mês.`;
    $("#rPrazo").textContent = c.dias + " dias";
    $("#rPaginas").textContent = c.paginas === 1 ? "1 página" : c.paginas + " páginas";

    const inclui = [c.tipo.nome, ...c.adds.map((a) => a.nome), "Botão de WhatsApp e Google Meu Negócio", "Domínio no seu nome"];
    if (mensal) inclui.push("Plano Básico de manutenção");
    $("#rInclui").innerHTML = inclui.map((i) => `<li>${esc(i)}</li>`).join("");

    const ramo = RAMOS.find((r) => r.id === estado.ramo).nome;
    const linhas = [
      "Olá! Montei meu site no configurador:",
      `• Tipo: ${c.tipo.nome} (${c.paginas} ${c.paginas === 1 ? "página" : "páginas"})`,
      `• Adicionais: ${c.adds.length ? c.adds.map((a) => a.nome).join(", ") : "nenhum"}`,
      `• Ramo: ${ramo}`,
      `• Pagamento: ${mensal ? "assinatura de " + brl(c.mensal) + "/mês por 12 meses" : brl(c.avista) + " à vista"}`,
      `• Prazo: ${c.dias} dias`,
    ];
    $("#rPedir").href = wa(linhas.join("\n"));
  }

  $("#tipoLista").addEventListener("change", (ev) => {
    estado.tipo = ev.target.value;
    atualizar();
  });
  $("#addLista").addEventListener("change", (ev) => {
    ev.target.checked ? estado.adicionais.add(ev.target.value) : estado.adicionais.delete(ev.target.value);
    atualizar();
  });
  $("#pgMenos").addEventListener("click", () => {
    estado.extras = Math.max(0, estado.extras - 1);
    atualizar();
  });
  $("#pgMais").addEventListener("click", () => {
    estado.extras = Math.min(MAX_EXTRAS, estado.extras + 1);
    atualizar();
  });
  document.querySelectorAll("[data-modo]").forEach((b) =>
    b.addEventListener("click", () => {
      estado.modo = b.dataset.modo;
      document.querySelectorAll("[data-modo]").forEach((x) => x.classList.toggle("ativo", x === b));
      desenharOpcoes();
      atualizar();
    })
  );

  // Planos
  $("#planosLista").innerHTML = PLANOS.map(
    (p) => `<article class="plano${p.destaque ? " destaque" : ""}">
      ${p.destaque ? '<span class="plano-tag">Mais escolhido</span>' : ""}
      <h3>${esc(p.nome)}</h3>
      <p class="plano-preco">${brl(p.preco)}<small>/mês</small></p>
      <ul>${p.itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      <a class="btn${p.destaque ? "" : " btn-claro"}" target="_blank" rel="noopener" href="${esc(wa(`Olá! Quero o plano ${p.nome} de manutenção (${brl(p.preco)}/mês).`))}">Quero este plano</a>
    </article>`
  ).join("");

  // Avulsos
  $("#avulsosLista").innerHTML = AVULSOS.map(
    (a) => `<article class="avulso">
      <h3>${esc(a.nome)}</h3>
      <p>${esc(a.desc)}</p>
      <div class="avulso-pe">
        <div><div class="avulso-preco">${brl(a.preco)}</div><div class="avulso-prazo">${esc(a.prazo)}</div></div>
        <a target="_blank" rel="noopener" href="${esc(wa(`Olá! Preciso do serviço "${a.nome}" (${brl(a.preco)}).`))}">Pedir →</a>
      </div>
    </article>`
  ).join("");

  // FAQ
  $("#faqLista").innerHTML = FAQ.map(([p, r]) => `<details><summary>${esc(p)}</summary><p>${esc(r)}</p></details>`).join("");

  // Raio-X: com chave do PageSpeed Insights roda na hora; sem chave, vira pedido pelo WhatsApp.
  const RX_CATS = [
    ["performance", "Velocidade no celular"],
    ["seo", "Aparecer no Google"],
    ["best-practices", "Segurança e boas práticas"],
    ["accessibility", "Acessibilidade"],
  ];
  // Nomes simples para as medições que o Google devolve com sigla técnica.
  const RX_SIMPLES = {
    "largest-contentful-paint": "Demora para mostrar o conteúdo principal",
    "first-contentful-paint": "Demora para aparecer o primeiro conteúdo",
    "total-blocking-time": "A página trava enquanto carrega",
    "cumulative-layout-shift": "Elementos mudam de lugar durante o carregamento",
    "speed-index": "Carregamento visual lento",
    "is-on-https": "O site não usa conexão segura (cadeado)",
  };
  const temChave = Boolean(CONFIG.pagespeedKey);
  $("#raioxTexto").textContent = temChave
    ? "Informe o endereço e veja em cerca de 30 segundos a nota do seu site em velocidade, Google, segurança e acessibilidade, com o que vale consertar e quanto custa."
    : "Informe o endereço. Em até 1 dia útil você recebe pelo WhatsApp a nota do seu site em velocidade, Google, segurança e acessibilidade, com o que vale consertar e quanto custa.";
  if (!temChave) $("#raioxBtn").textContent = "Pedir raio-X";

  const faixa = (n) => (n >= 90 ? ["rx-bom", "Bom"] : n >= 50 ? ["rx-medio", "Precisa melhorar"] : ["rx-ruim", "Ruim"]);
  const virgula = (v) => String(v).replace(/(\d)\.(\d)/g, "$1,$2");
  const limpar = (t) => String(t).replace(/`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  function recomendar(notas, lh) {
    const av = (id) => AVULSOS.find((a) => a.id === id);
    const recs = [];
    if (notas.performance < 70) recs.push({ ...av("lento"), motivo: "A velocidade no celular está abaixo do ideal." });
    if (notas.seo < 90) recs.push({ ...av("google"), motivo: "Há ajustes que ajudam o Google a entender e mostrar seu site." });
    const semHttps = lh.audits["is-on-https"] && lh.audits["is-on-https"].score === 0;
    if (semHttps || notas["best-practices"] < 70) {
      const p = PLANOS[0];
      recs.push({ nome: "Plano " + p.nome, preco: p.preco, mensal: true, motivo: semHttps ? "O site não usa conexão segura (cadeado). O plano inclui certificado de segurança." : "Há pontos de segurança e manutenção para corrigir e acompanhar." });
    }
    return recs;
  }

  function mostrarRaioX(url, lh) {
    const notas = {};
    RX_CATS.forEach(([id]) => (notas[id] = Math.round(((lh.categories[id] || {}).score || 0) * 100)));
    const geral = Math.round(RX_CATS.reduce((s, [id]) => s + notas[id], 0) / RX_CATS.length);
    const [corG, rotG] = faixa(geral);

    const vistos = new Set();
    const problemas = [];
    RX_CATS.forEach(([id]) =>
      ((lh.categories[id] || {}).auditRefs || [])
        .filter((r) => r.weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .forEach((r) => {
          const a = lh.audits[r.id];
          if (!a || a.score === null || a.score >= 0.9 || vistos.has(r.id)) return;
          if (a.scoreDisplayMode === "informative" || a.scoreDisplayMode === "notApplicable" || a.scoreDisplayMode === "manual") return;
          vistos.add(r.id);
          problemas.push({ titulo: RX_SIMPLES[r.id] || limpar(a.title), valor: a.displayValue, peso: r.weight * (1 - a.score) });
        })
    );
    problemas.sort((a, b) => b.peso - a.peso);
    const top = problemas.slice(0, 5);
    const recs = recomendar(notas, lh);
    const lcp = lh.audits["largest-contentful-paint"];

    const resumo = `Olá! Fiz o raio-X do site ${url} e a nota foi ${geral}/100 (${RX_CATS.map(([id, n]) => n + ": " + notas[id]).join(", ")}). Quero ajuda para melhorar.`;

    $("#raioxSaida").innerHTML = `
      <div class="rx-topo">
        <div class="rx-nota ${corG}" style="--v:${geral}" role="img" aria-label="Nota geral ${geral} de 100"><span>${geral}</span></div>
        <div>
          <h3 style="font-size:1.3rem">Nota geral: ${rotG.toLowerCase()}</h3>
          <p>${esc(url)}</p>
          ${lcp && lcp.displayValue ? `<p>Tempo para mostrar o conteúdo principal no celular: <strong>${esc(virgula(lcp.displayValue))}</strong></p>` : ""}
        </div>
      </div>
      <div class="rx-cats">${RX_CATS.map(([id, nome]) => {
        const [cor, rot] = faixa(notas[id]);
        return `<div class="rx-cat ${cor}">
          <div class="rx-cat-linha"><span>${nome} · <small>${rot}</small></span><span>${notas[id]}</span></div>
          <div class="rx-barra"><i style="--v:${notas[id]}"></i></div>
        </div>`;
      }).join("")}</div>
      ${top.length ? `<div class="rx-bloco"><h3>O que mais pesa na nota</h3><ul>${top.map((p) => `<li>${esc(p.titulo)}${p.valor ? " (" + esc(virgula(p.valor)) + ")" : ""}</li>`).join("")}</ul></div>` : ""}
      <div class="rx-bloco">
        <h3>${recs.length ? "O que vale consertar" : RX_CATS.every(([id]) => notas[id] >= 90) ? "Seu site está em boa forma" : "Nada urgente por aqui"}</h3>
        ${recs.length
          ? `<div class="rx-recs">${recs.map((r) => `<div class="rx-rec"><div><strong>${esc(r.nome)}</strong><p>${esc(r.motivo)}</p></div><strong>${brl(r.preco)}${r.mensal ? "/mês" : ""}</strong></div>`).join("")}</div>`
          : `<p style="color:var(--suave)">Não encontramos nada urgente. Para manter assim, o plano ${esc(PLANOS[0].nome)} cuida de hospedagem, backup e monitoramento por ${brl(PLANOS[0].preco)}/mês.</p>`}
      </div>
      <div class="acoes"><a class="btn" target="_blank" rel="noopener" href="${esc(wa(resumo))}">${recs.length ? "Quero consertar" : "Falar com a gente"}</a></div>
      <p class="rx-fonte">Análise feita pelo Google PageSpeed Insights simulando um celular. A nota pode variar um pouco a cada teste.</p>`;
    $("#raioxSaida").hidden = false;
    $("#raioxSaida").scrollIntoView({ block: "nearest" });
  }

  function raioxFalhou(url) {
    $("#raioxSaida").innerHTML = `
      <h3>Não conseguimos analisar esse site agora</h3>
      <p style="color:var(--suave);margin-top:6px">Confira se o endereço está certo e tente de novo. Se preferir, peça pelo WhatsApp e enviamos o raio-X em até 1 dia útil.</p>
      <div class="acoes"><a class="btn" target="_blank" rel="noopener" href="${esc(wa("Olá! Quero o raio-X grátis do meu site: " + url))}">Pedir pelo WhatsApp</a></div>`;
    $("#raioxSaida").hidden = false;
  }

  $("#raioxForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    let url = $("#raioxUrl").value.trim();
    const valido = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(url);
    $("#raioxErro").hidden = valido;
    if (!valido) return $("#raioxUrl").focus();
    if (!temChave) return window.open(wa("Olá! Quero o raio-X grátis do meu site: " + url), "_blank", "noopener");
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const btn = $("#raioxBtn");
    btn.disabled = true;
    btn.textContent = "Analisando…";
    $("#raioxStatus").textContent = "Abrindo seu site em um celular simulado. Isso leva cerca de 30 segundos.";
    $("#raioxStatus").hidden = false;
    $("#raioxSaida").hidden = true;
    try {
      const api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&locale=pt-BR" +
        RX_CATS.map(([id]) => "&category=" + id).join("") +
        "&url=" + encodeURIComponent(url) + "&key=" + encodeURIComponent(CONFIG.pagespeedKey);
      const resp = await fetch(api);
      const dados = await resp.json();
      if (!resp.ok || !dados.lighthouseResult) throw new Error("sem resultado");
      mostrarRaioX(url, dados.lighthouseResult);
    } catch (e) {
      raioxFalhou(url);
    } finally {
      btn.disabled = false;
      btn.textContent = "Fazer raio-X";
      $("#raioxStatus").hidden = true;
    }
  });

  // Portfólio: trabalhos reais
  const temaMod = (t) => `--m-bg:${t.bg};--m-tinta:${t.tinta};--m-cor:${t.cor};--m-corTinta:${t.corTinta};--m-fonte:${t.fonte}`;
  $("#trabalhosLista").innerHTML = TRABALHOS.map((t) => {
    const abre = t.telas
      ? `<a class="mod" href="projeto.html?p=${esc(t.id)}" style="${temaMod(t.tema)}">`
      : t.link ? `<a class="mod" href="${esc(t.link)}" target="_blank" rel="noopener" style="${temaMod(t.tema)}">` : `<div class="mod" style="${temaMod(t.tema)}">`;
    return `${abre}
      <div class="mod-tela">
        <div class="mod-barra" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="mod-corpo"><small>${esc(t.tag)}</small><strong>${esc(t.chamada)}</strong><span class="mod-cta">${esc(t.cta)}</span></div>
      </div>
      <div class="mod-pe"><strong>${esc(t.nome)}</strong><span>${esc(t.tipo)}</span></div>
      <p class="mod-desc">${esc(t.desc)}</p>
    ${t.link || t.telas ? "</a>" : "</div>"}`;
  }).join("");

  // Portfólio de modelos
  $("#modelosLista").innerHTML = MODELOS.map(
    (m) => `<a class="mod" href="modelo.html?m=${m.id}" style="--m-bg:${m.tema.bg};--m-tinta:${m.tema.tinta};--m-cor:${m.tema.cor};--m-corTinta:${m.tema.corTinta};--m-fonte:${m.tema.fonte}">
      <div class="mod-tela">
        <div class="mod-barra" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="mod-corpo mod-capa" style="--m-capa:url(img/modelos/${m.capa}.jpg)"><small>${esc(m.tag)}</small><strong>${esc(m.chamada)}</strong><span class="mod-cta">${esc(m.cta)}</span></div>
      </div>
      <div class="mod-pe"><strong>${esc(m.nome)}</strong><span>${esc(m.ramo)} · modelo</span></div>
    </a>`
  ).join("");

  // Quem chega de um modelo (?ramo=id) já encontra o ramo e o site indicado selecionados.
  const ramoUrl = RAMOS.find((r) => r.id === new URLSearchParams(location.search).get("ramo"));
  if (ramoUrl) {
    estado.ramo = ramoUrl.id;
    estado.tipo = ramoUrl.tipo;
    estado.adicionais = new Set(ramoUrl.adicionais);
  }

  desenharRamos();
  desenharOpcoes();
  atualizar();

  // O conteúdo é montado depois do carregamento, então reposiciona quem chegou por um link com âncora.
  if (location.hash.length > 1) {
    const alvo = document.getElementById(location.hash.slice(1));
    if (alvo) requestAnimationFrame(() => alvo.scrollIntoView({ behavior: "instant", block: "start" }));
  }

  // Efeitos: entrada ao rolar, brilho que segue o ponteiro e inclinação do cartão do topo.
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".plano, .avulso, .grade3 article, .ramo, .numeros li").forEach((el) => el.classList.add("luz"));
  document.addEventListener("pointermove", (ev) => {
    const c = ev.target.closest && ev.target.closest(".luz");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", ev.clientX - r.left + "px");
    c.style.setProperty("--my", ev.clientY - r.top + "px");
  });

  if (!calmo || new URLSearchParams(location.search).has("anima")) {
    const alvos = document.querySelectorAll(
      ".sec h2, .sec .sub, .chips, .ramo, .mods > *, .mods-titulo, .config, .planos > *, .avulsos > *, .raiox-form, .grade3 > article, .faq > *, .final-in, .numeros > li, .passos > li, .comp, .sis"
    );
    let faltam = [...alvos];
    faltam.forEach((el) => {
      const i = [...el.parentElement.children].indexOf(el);
      el.style.setProperty("--i", Math.min(i, 5));
      el.classList.add("rev");
    });
    const revelar = () => {
      const limite = innerHeight * 0.94;
      faltam = faltam.filter((el) => {
        if (el.getBoundingClientRect().top > limite) return true;
        el.classList.add("visto");
        return false;
      });
      if (!faltam.length) { removeEventListener("scroll", revelar); removeEventListener("resize", revelar); }
    };
    addEventListener("scroll", revelar, { passive: true });
    addEventListener("resize", revelar);
    document.documentElement.classList.add("anima");
    revelar();

    const vis = $("#heroVis");
    const cartao = vis.querySelector(".hero-card");
    vis.addEventListener("pointermove", (ev) => {
      const r = vis.getBoundingClientRect();
      cartao.style.setProperty("--ry", ((ev.clientX - r.left) / r.width - 0.5) * 10 + "deg");
      cartao.style.setProperty("--rx", (0.5 - (ev.clientY - r.top) / r.height) * 10 + "deg");
    });
    vis.addEventListener("pointerleave", () => { cartao.style.setProperty("--rx", "0deg"); cartao.style.setProperty("--ry", "0deg"); });
  }
})();
