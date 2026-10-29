# Débora Regina · Tattoos & Piercings

Prévia do site da Débora Regina ([@deboraregina.ink](https://www.instagram.com/deboraregina.ink/)), tatuadora e body piercer no Espaço Beleza, em Agualva-Cacém (Sintra, Portugal).

Publicado em https://azeugral.github.io/debora-regina/ (com `noindex` até a aprovação).

## Página

`index.html`, numa página só, com estas secções:
- **Hero:** logo oficial dela (com um reflexo dourado que corre pelas letras) sobre linhas finas douradas animadas em shader (`assets/linhas.js`).
- **Frase e valores.**
- **Portas:** Tatuagem e Piercing.
- **Trabalhos:** 28 fotos com filtro (fine line, blackwork e pontilhismo, lettering, piercing) e foto ampliada.
- **Flash:** pacote de 1 a 4 tatuagens.
- **Vale-presente.**
- **Marcações:** a política de sinal dela, tirada do post "Política de Marcações", e a Klarna 3x.
- **Sobre.**
- **Pedido:** formulário que monta a mensagem para o WhatsApp, com as linhas douradas animadas no fundo.

O texto está em português de Portugal e trata o cliente por "tu", como nas legendas dela.

## Identidade

- **Cores:** breu `#0c0a09` e o dourado metálico do logo oficial (`#d6a44e`, gradiente `--metal` nos botões e preços); o rosa `#d98aa0` só aparece no piercing, como no cartaz "Novo serviço: piercings".
- **Fontes:** Bodoni Moda nos títulos, Pinyon Script nas frases de destaque (eco do script do logo) e Hanken Grotesk no texto.
- **Logo:** arte oficial "Débora Regina · Tattoos & Piercings" (`_ref/logo-oficial.webp`, já transparente). `tools/logo.py` gera os tamanhos, a coroa recortada (vale-presente e favicon) e os favicons.

## Ferramentas

```
python -I tools/logo.py       # logo.webp, logo-800.webp, coroa.webp e favicons
python -I tools/processar.py  # fotos 4:5 a partir de ../_ref/ig (extração do Instagram)
python -I tools/og.py         # og.jpg
```

## CONFIRMAR antes do domínio

- [ ] **WhatsApp:** o site usa o 962 312 792 (o número de MB Way da política de marcações). Confirmar se é o WhatsApp dela. O cartaz do Espaço Beleza traz o 969 970 112.
- [ ] **Valores do flash:** o cartaz de flash diz 35/55/70/95€, a legenda de janeiro diz 90€ para 4 tatuagens e a promo de Halloween diz 40/60/70/95€. O site mostra 35/55/70/95.
- [ ] **Piercing:** valores por zona e joias (não publicados no Instagram).
- [ ] **Vale-presente:** valores e se vale para piercing também (o destaque "Presente" não foi lido).
- [ ] **Flashes disponíveis:** o destaque "P. Disponível" pode virar uma galeria de flashes.
- [ ] **Horário** de atendimento.
- [ ] **Foto do "Sobre"**: retrato enviado em 29/10 (`_ref/debora-retrato.jpg`, 677 px; pedir o original em alta).
- [ ] **Texto do "Sobre"** e o uso das fotos das clientes.
- [ ] **Instagram de piercing:** @debora.regink aparece nos cartazes. Decidir se entra no rodapé.
- [ ] **Domínio** (sugestão: deboraregina.pt) e remover o `noindex`.

Site por [L R G Z](https://lrgz.com.br).
