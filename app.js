(function () {
  const $ = (s) => document.querySelector(s);
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const temWhatsApp = /^\d{12,13}$/.test(CONFIG.whatsapp) && !/0{8}/.test(CONFIG.whatsapp);
  const wa = (texto) => temWhatsApp
    ? "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto)
    : "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Pedido pelo site Vem Site") + "&body=" + encodeURIComponent(texto);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const estado = JORNADA.ler();
  // Sem ramo na URL, mantém o orçamento inicial simples, sem adicionais.
  if (!new URLSearchParams(location.search).has('ramo')) estado.adicionais = new Set();
  const MAX_EXTRAS = 15;

  // Marca, rodapé e links fixos de WhatsApp
  document.querySelectorAll("[data-nome]").forEach((el) => (el.textContent = CONFIG.nome));
  $("#ano").textContent = new Date().getFullYear();
  $("#emailLink").textContent = CONFIG.email;
  $("#emailLink").href = "mailto:" + CONFIG.email;
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = wa(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });
  $("#contatoTopo").href = wa('Olá! Quero conversar sobre um site.');
  $("#rPedir").textContent = temWhatsApp ? 'Pedir este site pelo WhatsApp' : 'Pedir este site por e-mail';
  if (!temWhatsApp) {
    document.querySelectorAll('[data-wa]').forEach((el) => {
      if (el.classList.contains('wa-fixo')) {
        el.setAttribute('aria-label', 'Falar por e-mail');
        el.querySelector('span').textContent = 'E-mail';
        el.querySelector('svg').innerHTML = '<path fill="currentColor" d="M3 5h18v14H3V5Zm2 2v1l7 5 7-5V7l-7 5-7-5Zm0 3v7h14v-7l-7 5-7-5Z"/>';
      } else el.textContent = el.textContent.replace(/(?:no|pelo) WhatsApp/g, 'por e-mail');
    });
  }

  // Navegação acessível também no celular.
  const menuToggle = $('.menu-toggle');
  const fecharMenu = () => { menuToggle.setAttribute('aria-expanded', 'false'); $('#menuPrincipal').classList.remove('aberto'); };
  menuToggle.addEventListener('click', () => {
    const aberto = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(aberto));
    $('#menuPrincipal').classList.toggle('aberto', aberto);
  });
  $('#menuPrincipal').addEventListener('click', (ev) => { if (ev.target.closest('a')) fecharMenu(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { fecharMenu(); menuToggle.focus(); } });

  function calcular(e) {
    const tipo = TIPOS.find((t) => t.id === e.tipo);
    const extras = tipo.extras ? e.extras : 0;
    const adds = ADICIONAIS.filter((a) => e.adicionais.has(a.id));
    const soma = (campo) => tipo[campo] + extras * PAGINA_EXTRA[campo] + adds.reduce((s, a) => s + a[campo], 0);
    // Assinatura com plano maior: soma a diferença para o Básico.
    const plano = PLANOS[e.plano || 0];
    const difPlano = plano.preco - PLANOS[0].preco;
    return {
      tipo, extras, adds, plano, difPlano,
      avista: soma("avista") + avistaDe(difPlano),
      mensal: soma("mensal") + difPlano,
      dias: soma("dias"),
      paginas: tipo.paginas + extras,
    };
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
          <a href="${r.pagina}">Saiba mais sobre sites para ${esc(r.nome.toLowerCase())} →</a>
        </div>
      </div>
      <ul>${r.itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  }
  $("#ramoChips").addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-ramo]");
    if (!b) return;
    estado.ramo = b.dataset.ramo;
    const ramo = RAMOS.find((r) => r.id === estado.ramo);
    estado.tipo = ramo.tipo;
    estado.adicionais = new Set(ramo.adicionais);
    estado.extras = 0;
    desenharOpcoes();
    atualizar();
    $('#pvRamo').value = estado.ramo;
    atualizarMiniPrevia();
    desenharRamos();
    $(`[data-ramo="${estado.ramo}"]`).focus();
  });
  $("#ramoPainel").addEventListener("click", (ev) => {
    if (!ev.target.closest("#ramoUsar")) return;
    const r = RAMOS.find((x) => x.id === estado.ramo);
    estado.tipo = r.tipo;
    estado.extras = 0;
    estado.adicionais = new Set(r.adicionais);
    estado.plano = 0;
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
    $("#planoLista").innerHTML = PLANOS.map((p, i) => {
      const dif = p.preco - PLANOS[0].preco;
      const preco = i === 0 ? "incluso" : estado.modo === "mensal" ? "+ " + brl(dif) + "/mês" : "+ " + brl(avistaDe(dif));
      return `<label class="opcao">
        <input type="radio" name="plano" value="${i}" ${i === estado.plano ? "checked" : ""}>
        <span class="opcao-txt"><strong>${esc(p.nome)}</strong><span>${esc(p.itens.filter((t) => !/^Tudo do/.test(t)).slice(i === 0 ? 3 : 0, i === 0 ? 4 : 2).join(" · "))}</span></span>
        <span class="opcao-preco">${preco}</span>
      </label>`;
    }).join("");
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
    $('#movelPreco').textContent = novoPreco + (mensal ? '/mês' : ' à vista');
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
      : `Pagamento único, ${Math.round(DESCONTO_AVISTA * 100)}% abaixo da assinatura, com o primeiro ano de manutenção incluso. Sem fidelidade.`;
    $("#rPrazo").textContent = c.dias + " dias";
    $("#rPaginas").textContent = c.paginas === 1 ? "1 página" : c.paginas + " páginas";

    const inclui = [c.tipo.nome, ...c.adds.map((a) => a.nome), "Botão de WhatsApp e Google Meu Negócio", "Domínio no seu nome"];
    inclui.push(`Plano ${c.plano.nome} de manutenção${mensal ? "" : " no primeiro ano"}`);
    $("#rInclui").innerHTML = inclui.map((i) => `<li>${esc(i)}</li>`).join("");

    const ramo = RAMOS.find((r) => r.id === estado.ramo).nome;
    const linhas = [
      "Olá! Montei meu site no configurador:",
      ...(estado.nome ? [`• Negócio: ${estado.nome}`, ...(estado.cidade ? [`• Cidade: ${estado.cidade}`] : []), `• Cor: ${estado.cor}`] : []),
      `• Tipo: ${c.tipo.nome} (${c.paginas} ${c.paginas === 1 ? "página" : "páginas"})`,
      `• Adicionais: ${c.adds.length ? c.adds.map((a) => a.nome).join(", ") : "nenhum"}`,
      `• Ramo: ${ramo}`,
      `• Manutenção: plano ${c.plano.nome}`,
      `• Pagamento: ${mensal ? "assinatura de " + brl(c.mensal) + "/mês por 12 meses" : brl(c.avista) + " à vista, com o primeiro ano de manutenção"}`,
      `• Prazo: ${c.dias} dias`,
    ];
    $("#rPedir").href = wa(linhas.join("\n"));
    $('#pedidoContexto').hidden = !estado.nome;
    $('#pedidoNome').textContent = `Orçamento para ${estado.nome}${estado.cidade ? ' · ' + estado.cidade : ''}`;
    const params = JORNADA.parametros(estado);
    params.set('m', estado.ramo);
    $('#editarPrevia').href = 'modelo.html?' + params;
    document.querySelectorAll('[data-modo]').forEach((b) => {
      const ativo = b.dataset.modo === estado.modo;
      b.classList.toggle('ativo', ativo);
      b.setAttribute('aria-pressed', String(ativo));
    });
  }

  $("#tipoLista").addEventListener("change", (ev) => {
    estado.tipo = ev.target.value;
    if (!TIPOS.find((t) => t.id === estado.tipo).extras) estado.extras = 0;
    atualizar();
  });
  $("#addLista").addEventListener("change", (ev) => {
    ev.target.checked ? estado.adicionais.add(ev.target.value) : estado.adicionais.delete(ev.target.value);
    atualizar();
  });
  $("#planoLista").addEventListener("change", (ev) => {
    estado.plano = Number(ev.target.value);
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
        <a href="#consertoPedido" data-conserto="${esc(a.nome)}">Pedir →</a>
      </div>
    </article>`
  ).join("") + `<article class="avulso avulso-personalizado"><span class="avulso-tag">Do seu jeito</span><h3>Não encontrou o que precisa?</h3><p>Conte o problema com suas palavras. A gente avalia e envia uma proposta.</p><div class="avulso-pe"><div><div class="avulso-preco">Sob avaliação</div><div class="avulso-prazo">Preço e prazo antes de aprovar</div></div><a href="#consertoPedido" data-conserto="">Contar →</a></div></article>`;

  // Pedido de conserto: rascunho local, enviado somente pelo cliente no canal escolhido.
  let textoConserto = '';
  function atualizarServicoConserto() {
    const servico = AVULSOS.find((a) => a.nome === $('#consertoServico').value);
    $('#consertoSelecao').hidden = !servico;
    $('#consertoSelecao').textContent = servico
      ? `${servico.nome}: ${brl(servico.preco)} · ${servico.prazo}. O escopo é confirmado após avaliar o seu site.` : '';
  }
  $('#avulsosLista').addEventListener('click', (ev) => {
    const link = ev.target.closest('[data-conserto]');
    if (!link) return;
    $('#consertoServico').value = link.dataset.conserto;
    atualizarServicoConserto();
    $('#consertoRevisao').hidden = true;
  });
  $('#consertoForm').addEventListener('input', () => {
    $('#consertoContador').textContent = `${$('#consertoDescricao').value.length}/1000`;
    $('#consertoRevisao').hidden = true;
    $('#consertoCopiaStatus').textContent = '';
    atualizarServicoConserto();
  });
  if (temWhatsApp) {
    $('#consertoEnviar').textContent = 'Preparar pedido pelo WhatsApp';
    $('#consertoAbrir').textContent = 'Abrir WhatsApp com o pedido →';
    $('#consertoCanal').textContent = 'O pedido abre no WhatsApp para você revisar e enviar. Não há cobrança nesta etapa.';
  }
  $('#consertoForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const descricao = $('#consertoDescricao').value.trim();
    const entrada = $('#consertoUrl').value.trim();
    let url = '';
    let urlValida = !entrada;
    if (entrada) {
      try {
        const candidata = new URL(/^[a-z][a-z\d+.-]*:/i.test(entrada) ? entrada : 'https://' + entrada);
        urlValida = ['https:', 'http:'].includes(candidata.protocol) && candidata.hostname.includes('.') && !candidata.username && !candidata.password && !/\s/.test(entrada);
        if (urlValida) url = candidata.href;
      } catch { urlValida = false; }
    }
    const descricaoValida = descricao.length >= 10 && descricao.length <= 1000;
    $('#consertoUrlErro').hidden = urlValida;
    $('#consertoUrl').setAttribute('aria-invalid', String(!urlValida));
    $('#consertoDescricaoErro').hidden = descricaoValida;
    $('#consertoDescricao').setAttribute('aria-invalid', String(!descricaoValida));
    if (!urlValida || !descricaoValida) {
      $('#consertoRevisao').hidden = true;
      return (!urlValida ? $('#consertoUrl') : $('#consertoDescricao')).focus();
    }
    const servico = AVULSOS.find((a) => a.nome === $('#consertoServico').value);
    textoConserto = [
      'Olá! Preciso de ajuda com meu site.',
      `Serviço: ${servico ? servico.nome : 'Avaliação de outro problema'}`,
      ...(servico ? [`Referência na tabela: ${brl(servico.preco)} · ${servico.prazo} (escopo a confirmar).`] : []),
      `Site: ${url || 'não informado'}`,
      '', 'O que preciso resolver:', descricao,
      '', 'Gostaria de receber a avaliação e combinar o preço e o prazo antes de começar.',
    ].join('\n');
    $('#consertoRevisaoTexto').textContent = textoConserto;
    $('#consertoAbrir').href = wa(textoConserto);
    $('#consertoRevisao').hidden = false;
  });
  $('#consertoCopiar').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(textoConserto);
      $('#consertoCopiaStatus').textContent = 'Texto copiado. Cole no seu e-mail para enviar.';
    } catch {
      $('#consertoCopiaStatus').textContent = 'Não foi possível copiar automaticamente. Selecione o texto acima e copie.';
    }
  });

  // FAQ
  // As dúvidas já são publicadas em HTML pelo gerador, inclusive para robôs sem JS.

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
    "meta-refresh": "A página se recarrega sozinha, o que atrapalha quem está lendo",
    "meta-viewport": "O site impede o visitante de dar zoom no celular",
    "button-name": "Botões sem nome para leitores de tela",
    "link-name": "Links sem texto que diga para onde levam",
    "image-alt": "Imagens sem descrição",
    "color-contrast": "Texto com pouco contraste, difícil de ler",
    "label": "Campos de formulário sem nome",
    "document-title": "Página sem título",
    "html-has-lang": "Página sem idioma definido",
    "heading-order": "Títulos fora de ordem",
    "aria-allowed-attr": "Marcações de acessibilidade usadas de forma errada",
    "aria-required-attr": "Marcações de acessibilidade incompletas",
    "aria-hidden-focus": "Elementos escondidos que ainda recebem foco",
    "frame-title": "Quadros incorporados sem título",
    "list": "Listas montadas de forma errada",
    "listitem": "Itens de lista fora de uma lista",
    "tap-targets": "Botões e links pequenos ou colados demais para o dedo",
    "target-size": "Botões e links pequenos ou colados demais para o dedo",
    "meta-description": "Falta a descrição que aparece no Google",
    "link-text": "Links com texto genérico, como \"clique aqui\"",
    "crawlable-anchors": "Links que o Google não consegue seguir",
    "is-crawlable": "A página está bloqueada para o Google",
    "robots-txt": "Arquivo de regras para o Google com problema",
    "hreflang": "Indicação de idioma errada para o Google",
    "canonical": "Endereço principal da página mal indicado",
    "http-status-code": "A página responde com erro",
    "font-size": "Letras pequenas demais no celular",
    "errors-in-console": "O site registra erros ao carregar",
    "deprecations": "O site usa recursos antigos do navegador",
    "inspector-issues": "O navegador aponta problemas no site",
    "third-party-cookies": "Cookies de terceiros que os navegadores estão bloqueando",
    "image-aspect-ratio": "Imagens esticadas ou achatadas",
    "image-size-responsive": "Imagens com resolução baixa para a tela",
    "valid-source-maps": "Arquivos técnicos de depuração ausentes",
    "csp-xss": "Falta uma proteção contra scripts maliciosos",
    "geolocation-on-start": "O site pede localização assim que abre",
    "notification-on-start": "O site pede para enviar notificações assim que abre",
    "paste-preventing-inputs": "Campos que impedem colar texto",
    "doctype": "Página sem a declaração de tipo do documento",
    "charset": "Codificação de caracteres não declarada",
    "unsized-images": "Imagens sem tamanho definido, que fazem a página pular",
    "render-blocking-resources": "Arquivos que atrasam a primeira exibição",
    "unused-javascript": "Código carregado que não é usado",
    "unused-css-rules": "Estilos carregados que não são usados",
    "uses-optimized-images": "Imagens pesadas que podem ser comprimidas",
    "modern-image-formats": "Imagens em formato antigo e mais pesado",
    "offscreen-images": "Imagens carregadas antes de aparecerem na tela",
    "server-response-time": "Servidor demora a responder",
    "redirects": "Redirecionamentos que atrasam a abertura",
    "interactive": "Demora para a página responder ao toque",
    "max-potential-fid": "Demora para responder ao primeiro toque",
    "interaction-to-next-paint": "Demora para responder ao toque",
  };
  // O Google às vezes devolve títulos em inglês mesmo pedindo português; esses ficam de fora.
  const pareceIngles = (t) => /\b(the|is|are|uses?|do not|does not|have|has|elements?|should|avoid|ensure)\b/i.test(t);
  const temChave = Boolean(CONFIG.pagespeedKey);
  $("#raioxTexto").textContent = temChave
    ? "Informe o endereço e veja em até 1 minuto a nota do seu site em velocidade, Google, segurança e acessibilidade, com o que vale consertar e quanto custa."
    : "Informe o endereço. Em até 1 dia útil você recebe pelo WhatsApp a nota do seu site em velocidade, Google, segurança e acessibilidade, com o que vale consertar e quanto custa.";
  if (!temChave) $("#raioxBtn").textContent = "Pedir raio-X";

  const faixa = (n) => (n >= 90 ? ["rx-bom", "Bom"] : n >= 50 ? ["rx-medio", "Precisa melhorar"] : ["rx-ruim", "Ruim"]);
  // "2,420 ms" (milhar em inglês) vira "2,4 s"; "2.3 s" vira "2,3 s".
  const virgula = (v) => {
    const t = String(v).replace(/\u00a0/g, " ");
    const ms = /^([\d,.]+)\s*ms$/.exec(t);
    if (ms) {
      const n = Number(ms[1].replace(/,/g, ""));
      if (n >= 1000) return (n / 1000).toFixed(1).replace(".", ",") + " s";
      return Math.round(n) + " ms";
    }
    return t.replace(/(\d)([.,])(?=\d)/g, (_, d, c) => d + (c === "." ? "," : "."));
  };
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
          const titulo = RX_SIMPLES[r.id] || limpar(a.title);
          if (!RX_SIMPLES[r.id] && pareceIngles(titulo)) return;
          problemas.push({ titulo, valor: a.displayValue, peso: r.weight * (1 - a.score) });
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
    $("#raioxStatus").textContent = "Abrindo seu site em um celular simulado. Isso pode levar até 1 minuto.";
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
        <div class="mod-corpo mod-capa" style="--m-capa:url(img/modelos/${m.capa}.webp)"><small>${esc(m.tag)}</small><strong>${esc(m.chamada)}</strong><span class="mod-cta">${esc(m.cta)}</span></div>
      </div>
      <div class="mod-pe"><strong>${esc(m.nome)}</strong><span>${esc(m.ramo)} · modelo</span></div>
    </a>`
  ).join("");

  // Quem chega de um modelo (?ramo=id) já encontra o ramo e o site indicado selecionados.
  // Tipo, adicionais e dados da prévia já foram validados por JORNADA.ler().

  desenharRamos();
  desenharOpcoes();
  atualizar();

  // Prévia: abre o site-modelo do ramo com o nome, a cidade e a cor do negócio.
  const CORES = [
    ["#0f8f7e", "Verde-água"], ["#2457e6", "Azul"], ["#7c3aed", "Roxo"],
    ["#c2410c", "Terracota"], ["#be185d", "Rosa"], ["#1f2937", "Grafite"],
    ["#15803d", "Verde-floresta"], ["#65a30d", "Verde-lima"], ["#0891b2", "Turquesa"],
    ["#0f172a", "Azul-marinho"], ["#4f46e5", "Índigo"], ["#a855f7", "Lilás"],
    ["#dc2626", "Vermelho"], ["#f97316", "Laranja"], ["#eab308", "Amarelo"],
    ["#a16207", "Dourado"], ["#78350f", "Café"], ["#f5e6d3", "Areia"],
  ];
  $("#pvRamo").innerHTML = RAMOS.map((r) => `<option value="${r.id}"${r.id === estado.ramo ? " selected" : ""}>${esc(r.nome)}</option>`).join("");
  $("#pvCores").innerHTML = CORES.map(([c, n], i) =>
    `<label class="previa-cor" style="--c:${c}" title="${n}"><input type="radio" name="pvCor" value="${c}"${c.toLowerCase() === estado.cor.toLowerCase() ? " checked" : ""}><span class="oculto">${n}</span></label>`
  ).join("");
  $('#pvNome').value = estado.nome;
  $('#pvCidade').value = estado.cidade;
  $('#pvCorPersonalizada').value = estado.cor;
  $('#pvCorHex').value = estado.cor.toUpperCase();
  if (!$('[name=pvCor]:checked')) $('#pvCorLivre').checked = true;
  const corDaPrevia = () => $('[name=pvCor]:checked')?.value === 'personalizada'
    ? $('#pvCorPersonalizada').value : ($('[name=pvCor]:checked')?.value || estado.cor);
  $('#pvCorPersonalizada').addEventListener('input', () => {
    $('#pvCorLivre').checked = true;
    $('#pvCorHex').value = $('#pvCorPersonalizada').value.toUpperCase();
    $('#pvCorErro').hidden = true;
    $('#pvCorHex').setAttribute('aria-invalid', 'false');
  });
  $('#pvCorHex').addEventListener('input', () => {
    $('#pvCorLivre').checked = true;
    const valor = $('#pvCorHex').value.trim();
    const valido = /^#[0-9a-f]{6}$/i.test(valor);
    $('#pvCorErro').hidden = valido;
    $('#pvCorHex').setAttribute('aria-invalid', String(!valido));
    if (valido) $('#pvCorPersonalizada').value = valor;
  });
  function atualizarMiniPrevia() {
    $('#pvMiniNome').textContent = $('#pvNome').value.trim() || 'O nome do seu negócio';
    $('#pvMiniCidade').textContent = $('#pvCidade').value.trim() || 'Sua presença na internet começa aqui.';
    $('#pvMiniRamo').textContent = RAMOS.find((r) => r.id === $('#pvRamo').value)?.nome || '';
    const cor = corDaPrevia();
    $('#previaViva').style.setProperty('--pv-cor', cor);
    const nomeCor = CORES.find(([c]) => c.toLowerCase() === cor.toLowerCase())?.[1] || 'Cor personalizada';
    $('#pvCorNome').textContent = nomeCor + ' · ' + cor.toUpperCase();
    if (!$('#pvCorLivre').checked) { $('#pvCorErro').hidden = true; $('#pvCorHex').setAttribute('aria-invalid', 'false'); }
  }
  $('#previaForm').addEventListener('input', atualizarMiniPrevia);
  $('#pvRamo').addEventListener('change', atualizarMiniPrevia);
  atualizarMiniPrevia();
  $("#previaForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const nome = $("#pvNome").value.trim();
    $("#pvErro").hidden = !!nome;
    if (!nome) return $("#pvNome").focus();
    if ($('#pvCorLivre').checked && !/^#[0-9a-f]{6}$/i.test($('#pvCorHex').value.trim())) {
      $('#pvCorErro').hidden = false;
      $('#pvCorHex').setAttribute('aria-invalid', 'true');
      return $('#pvCorHex').focus();
    }
    const ramo = RAMOS.find((r) => r.id === $('#pvRamo').value);
    if (ramo.id !== estado.ramo) {
      estado.tipo = ramo.tipo; estado.adicionais = new Set(ramo.adicionais); estado.extras = 0;
    }
    Object.assign(estado, { ramo: ramo.id, nome, cidade: $('#pvCidade').value.trim(), cor: corDaPrevia() });
    const p = JORNADA.parametros(estado);
    p.set('m', estado.ramo);
    location.href = "modelo.html?" + p;
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      $('#orcamentoMovel').hidden = !entry.isIntersecting;
      document.body.classList.toggle('com-orcamento', entry.isIntersecting);
    }, { threshold: 0 }).observe($('#montar'));
    const etapas = new IntersectionObserver((entries) => {
      const ativa = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!ativa) return;
      document.querySelectorAll('[data-etapa]').forEach((a) => {
        if (a.dataset.etapa === ativa.target.id) a.setAttribute('aria-current', 'step');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -45% 0px' });
    ['previa', 'montar', 'pedido'].forEach((id) => etapas.observe(document.getElementById(id)));
  }

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

  if (!calmo) {
    const alvos = document.querySelectorAll(
      ".sec h2, .sec .sub, .chips, .ramo, .mods > *, .mods-titulo, .config, .planos > *, .avulsos > *, .raiox-form, .grade3 > article, .faq > *, .final-in, .numeros > li, .passos > li, .comp, .sis, .previa-form"
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
