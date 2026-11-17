// Um único destino de contato para a página inicial e os projetos.
const CONTATO = (() => {
  const whatsappDisponivel = /^\d{12,13}$/.test(CONFIG.whatsapp) && !/0{8}/.test(CONFIG.whatsapp);
  const url = (texto) => whatsappDisponivel
    ? 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto)
    : 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Pedido pelo site Vem Site') + '&body=' + encodeURIComponent(texto);
  function normalizarSite(entrada) {
    const texto = entrada.trim();
    if (!texto || /\s/.test(texto)) return null;
    try {
      const site = new URL(/^[a-z][a-z\d+.-]*:(?!\d)/i.test(texto) ? texto : 'https://' + texto);
      return ['https:', 'http:'].includes(site.protocol) && site.hostname.includes('.') && !site.username && !site.password ? site.href : null;
    } catch { return null; }
  }
  return { whatsappDisponivel, url, normalizarSite };
})();
