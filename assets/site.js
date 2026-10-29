/* Débora Regina Ink · topo, menu, revelar ao rolar, filtro e foto ampliada, pedido para o WhatsApp. */
(function () {
  const WHATS = '351962312792';
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // topo ganha fundo depois do hero
  const topo = $('.topo');
  const rolar = () => topo.classList.toggle('rolou', scrollY > 40);
  addEventListener('scroll', rolar, { passive: true }); rolar();

  // menu do celular
  const bt = $('.abre-menu'), menu = $('#menu');
  const fechar = () => { menu.classList.remove('aberto'); bt.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  bt.addEventListener('click', () => {
    const abre = !menu.classList.contains('aberto');
    menu.classList.toggle('aberto', abre); bt.setAttribute('aria-expanded', String(abre));
    document.body.style.overflow = abre ? 'hidden' : '';
  });
  $$('a', menu).forEach(a => a.addEventListener('click', fechar));

  // revelar ao rolar
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.revela').forEach(el => io.observe(el));

  // filtro dos trabalhos
  const itens = $$('#grade li');
  function filtrar(f) {
    $$('.filtro').forEach(b => { const on = b.dataset.f === f; b.classList.toggle('ativo', on); b.setAttribute('aria-pressed', String(on)); });
    itens.forEach(li => {
      const mostra = f === 'todos' || li.dataset.g.split(' ').includes(f === 'tattoo' ? 'tattoo' : f);
      li.classList.toggle('some', !mostra);
      if (mostra) { li.classList.remove('entra-f'); void li.offsetWidth; li.classList.add('entra-f'); }
    });
  }
  $$('.filtro').forEach(b => b.addEventListener('click', () => filtrar(b.dataset.f)));
  $$('[data-filtro]').forEach(a => a.addEventListener('click', () => {
    const f = a.dataset.filtro;
    if (f === 'tattoo') { filtrar('todos'); itens.forEach(li => li.classList.toggle('some', !li.dataset.g.includes('tattoo'))); $$('.filtro').forEach(b => { b.classList.remove('ativo'); b.setAttribute('aria-pressed', 'false'); }); }
    else filtrar(f);
  }));

  // foto ampliada
  const amp = $('#ampliada'), ampImg = $('img', amp);
  let lista = [], i = 0, voltaFoco = null;
  function mostrar(n) {
    i = (n + lista.length) % lista.length;
    const a = lista[i];
    ampImg.style.opacity = 0;
    const im = new Image(); im.src = a.href;
    im.onload = () => { ampImg.src = a.href; ampImg.alt = $('img', a).alt; ampImg.style.opacity = 1; };
  }
  function abrir(a) {
    lista = itens.filter(li => !li.classList.contains('some')).map(li => $('a', li));
    voltaFoco = a; amp.hidden = false; requestAnimationFrame(() => amp.classList.add('aberta'));
    mostrar(lista.indexOf(a)); document.body.style.overflow = 'hidden'; $('.ampliada__fechar').focus();
  }
  function fecharAmp() { amp.classList.remove('aberta'); setTimeout(() => { amp.hidden = true; }, 300); document.body.style.overflow = ''; voltaFoco && voltaFoco.focus(); }
  itens.forEach(li => $('a', li).addEventListener('click', e => { e.preventDefault(); abrir(e.currentTarget); }));
  $('.ampliada__fechar').addEventListener('click', fecharAmp);
  $('.ampliada__seta--ant').addEventListener('click', () => mostrar(i - 1));
  $('.ampliada__seta--prox').addEventListener('click', () => mostrar(i + 1));
  amp.addEventListener('click', e => { if (e.target === amp) fecharAmp(); });
  addEventListener('keydown', e => {
    if (amp.hidden) return;
    if (e.key === 'Escape') fecharAmp();
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
  });
  let x0 = null;
  amp.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  amp.addEventListener('touchend', e => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) mostrar(i + (dx < 0 ? 1 : -1));
  });

  // botões que já escolhem o serviço no pedido
  const form = $('#pedido');
  $$('[data-servico]').forEach(a => a.addEventListener('click', () => {
    const r = $(`input[name=servico][value="${a.dataset.servico}"]`, form); if (r) r.checked = true;
  }));

  // pedido → WhatsApp
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form), nome = (d.get('nome') || '').trim();
    const campoNome = form.elements.nome.closest('.campo');
    if (!nome) { campoNome.classList.add('erro'); form.elements.nome.focus(); return; }
    campoNome.classList.remove('erro');
    const linhas = [`Olá Débora! Sou ${nome} e queria marcar: ${d.get('servico')}.`];
    const add = (rot, k) => { const v = (d.get(k) || '').trim(); if (v) linhas.push(`${rot}: ${v}`); };
    add('Ideia', 'ideia'); add('Local do corpo', 'local'); add('Tamanho', 'tamanho'); add('Disponibilidade', 'quando');
    linhas.push('(mensagem enviada pelo site)');
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
  });
})();
