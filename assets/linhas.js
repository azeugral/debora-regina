/* Linhas finas douradas sobre o breu, como traço de fine line, com alguns pontos de luz
   (o "ponto de luz" das joias de piercing). As linhas são curvas de nível de um campo de ruído;
   a espessura é medida em pixels pelo gradiente (3 amostras), então ficam com ~1 px em qualquer ecrã.
   Hero: um quadro parado, com o centro escuro para o logo. Agendamento (#marcar): animado, o traço
   desenha-se quando a secção entra no ecrã e depois escorre devagar.
   `t` = tempo em s; `ent` = 0→1 (o traço a ser desenhado); `mio` = escurece o centro; `luz` = intensidade. */
(function () {
  const FS = `precision highp float;
uniform vec2 r;uniform float t;uniform float ent;uniform float cel;uniform float mio;uniform float luz;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 g2(vec2 p){float a=h(p)*6.2831;return vec2(cos(a),sin(a));}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(dot(g2(i),f),dot(g2(i+vec2(1,0)),f-vec2(1,0)),u.x),
             mix(dot(g2(i+vec2(0,1)),f-vec2(0,1)),dot(g2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}
float campo(vec2 p){
  p=mat2(.94,-.34,.34,.94)*p;                                   // fios em diagonal suave
  vec2 q=p*vec2(.62,1.75)+vec2(t*.018,0.);
  q+=.45*vec2(n(q*.55+vec2(t*.025,1.3)),n(q*.55+vec2(4.1,-t*.02)));   // torção lenta, véu de tinta
  return n(q)+.32*n(q*2.05+7.3);
}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
  float e=1./r.y;
  float N=mix(11.,9.,cel);
  float v=campo(p), vx=campo(p+vec2(e,0.)), vy=campo(p+vec2(0.,e));
  float gr=length(vec2(vx-v,vy-v))/e;
  float f=v*N;
  float d=abs(fract(f+.5)-.5);                  // 0 em cima de cada curva inteira
  float px=d/(gr*N*e+1e-6);                     // distância à linha em pixels
  float k=floor(f+.5);
  // cada linha tem a sua força; umas quase somem (traço fino, não grade)
  float forca=.25+.75*smoothstep(.35,.95,h(vec2(k,3.1)));
  float linha=smoothstep(1.25,.15,px)*forca;
  float halo=exp(-px*.55)*.12*forca;
  // entrada: o traço corre ao longo da curva, como a agulha a desenhar
  float corre=fract(h(vec2(k,9.7))+(p.x*.35+p.y*.2));
  float desenhado=smoothstep(corre-.02,corre+.02,ent*1.25-.12);
  // centro mais escuro para o logo e o título
  vec2 c=p*vec2(mix(.85,1.25,cel),1.);
  float miolo=mix(1.,smoothstep(.12,.62,length(c-vec2(0.,mix(.02,.06,cel)))),mio);
  float borda=smoothstep(1.35,.45,length(p*vec2(.6,1.)));
  vec3 ouro=vec3(.86,.66,.44), claro=vec3(1.,.88,.7);
  vec3 col=vec3(.047,.039,.035);
  float brilhoTom=.5+.5*sin(k*1.7+t*.25);
  col+=mix(ouro,claro,brilhoTom*.4)*(linha*.85+halo)*desenhado*miolo*(.55+.45*borda)*luz;
  // pontos de luz: poucos, sobre as linhas, que acendem e apagam
  vec2 cel2=floor(gl_FragCoord.xy/r.y*26.);
  float s=h(cel2+.5);
  if(s>.985){
    vec2 cc=(cel2+.5)/26.*r.y;
    float dd=length(gl_FragCoord.xy-cc)/ (r.y/900.);
    float pisca=pow(.5+.5*sin(t*(.6+s*1.4)+s*80.),6.);
    col+=claro*(exp(-dd*.9)*1.4+exp(-dd*.12)*.08)*pisca*ent*miolo*luz;
  }
  // grão leve contra bandas
  col+=(h(gl_FragCoord.xy+fract(t))-.5)/255.;
  gl_FragColor=vec4(col,1.);
}`;

  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toque = matchMedia('(pointer: coarse)').matches;

  function ligar(tela, op) {
    const gl = tela.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { tela.classList.add('sem-gl'); return; }
    const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
    const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
    const fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { tela.classList.add('sem-gl'); return; }
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { tela.classList.add('sem-gl'); return; }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const uR = U('r'), uT = U('t'), uE = U('ent'), uC = U('cel'), uMio = U('mio'), uL = U('luz');

    let w = 0, hgt = 0;
    function medir() {
      const dpr = Math.min(devicePixelRatio || 1, toque ? 2 : 1.75);
      const b = tela.getBoundingClientRect();
      w = Math.round(b.width * dpr); hgt = Math.round(b.height * dpr);
      if (tela.width !== w || tela.height !== hgt) { tela.width = w; tela.height = hgt; }
    }
    function desenhar(s, ent) {
      gl.viewport(0, 0, w, hgt);
      gl.uniform2f(uR, w, hgt); gl.uniform1f(uT, s); gl.uniform1f(uE, ent);
      gl.uniform1f(uC, w < hgt ? 1 : 0); gl.uniform1f(uMio, op.miolo ? 1 : 0); gl.uniform1f(uL, op.luz);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    medir();

    if (!op.anima || parado) {
      const fixo = () => { medir(); desenhar(op.fase, 1); };
      fixo(); addEventListener('resize', fixo);
      tela.classList.add('pronto');
      return;
    }

    addEventListener('resize', medir);
    let visivel = false, t0 = null, pedido = 0;
    const pedir = () => { if (!pedido) pedido = requestAnimationFrame(quadro); };
    function quadro(agora) {
      pedido = 0;
      if (t0 === null) t0 = agora;
      const s = (agora - t0) / 1000;
      const ent = Math.min(1, s / 3.2);
      desenhar(op.fase + s, 1 - Math.pow(1 - ent, 3));
      if (visivel && !document.hidden) pedir();
    }
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) pedir(); }, { rootMargin: '0px 0px -10% 0px' }).observe(tela);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && visivel) pedir(); });
    tela.classList.add('pronto');
  }

  const hero = document.getElementById('linhas');
  if (hero) ligar(hero, { anima: false, miolo: true, luz: 1, fase: 40 });
  const fundo = document.getElementById('linhas-marcar');
  if (fundo) ligar(fundo, { anima: true, miolo: false, luz: .62, fase: 12 });
})();
