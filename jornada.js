// Estado compartilhado entre a prévia e o orçamento, sem cookies ou armazenamento.
const JORNADA = (() => {
  function ler(busca = location.search) {
    const q = new URLSearchParams(busca);
    const ramo = RAMOS.find((r) => r.id === (q.get('ramo') || q.get('m'))) || RAMOS[0];
    const tipo = TIPOS.some((t) => t.id === q.get('tipo')) ? q.get('tipo') : ramo.tipo;
    return {
      ramo: ramo.id, tipo,
      nome: (q.get('nome') || '').trim().slice(0, 40),
      cidade: (q.get('cidade') || '').trim().slice(0, 40),
      cor: /^#[0-9a-f]{6}$/i.test(q.get('cor') || '') ? q.get('cor') : '#0f8f7e',
      extras: Math.max(0, Math.min(15, parseInt(q.get('extras'), 10) || 0)),
      plano: ['0', '1', '2'].includes(q.get('plano')) ? Number(q.get('plano')) : 0,
      modo: q.get('modo') === 'avista' ? 'avista' : 'mensal',
      adicionais: new Set(q.has('adds')
        ? q.get('adds').split(',').filter((id) => ADICIONAIS.some((a) => a.id === id))
        : ramo.adicionais),
    };
  }
  function parametros(e) {
    const q = new URLSearchParams({ ramo: e.ramo, tipo: e.tipo, extras: e.extras,
      plano: e.plano, modo: e.modo, adds: [...e.adicionais].join(',') });
    if (e.nome) q.set('nome', e.nome);
    if (e.cidade) q.set('cidade', e.cidade);
    if (/^#[0-9a-f]{6}$/i.test(e.cor || '')) q.set('cor', e.cor);
    return q;
  }
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const luminancia = (hex) => rgb(hex).map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const contraste = (a, b) => (Math.max(luminancia(a), luminancia(b)) + 0.05) / (Math.min(luminancia(a), luminancia(b)) + 0.05);
  const textoNaCor = (hex) => contraste(hex, '#000000') > contraste(hex, '#ffffff') ? '#000000' : '#ffffff';
  function corLegivel(hex, fundo) {
    const origem = rgb(hex), destino = rgb(textoNaCor(fundo));
    for (let passo = 0; passo <= 20; passo++) {
      const cor = '#' + origem.map((v, i) => Math.round(v + (destino[i] - v) * passo / 20).toString(16).padStart(2, '0')).join('');
      if (contraste(cor, fundo) >= 4.5) return cor;
    }
    return textoNaCor(fundo);
  }
  return { ler, parametros, textoNaCor, corLegivel, contraste };
})();
