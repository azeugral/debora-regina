# Débora Regina Ink · Tatuagem e piercing

Prévia do site da Débora Regina ([@deboraregina.ink](https://www.instagram.com/deboraregina.ink/)), tatuadora e body piercer no Espaço Beleza, em Agualva-Cacém (Sintra, Portugal).

Publicado em https://azeugral.github.io/debora-regina/ (com `noindex` até a aprovação).

## Página

`index.html`, numa página só, com estas secções:
- **Hero:** monograma DR dela (vetorizado do cartão oficial), com linhas finas douradas em shader (`assets/linhas.js`).
- **Frase e valores.**
- **Portas:** Tatuagem e Piercing.
- **Trabalhos:** 28 fotos com filtro (fine line, blackwork e pontilhismo, lettering, piercing) e foto ampliada.
- **Flash:** pacote de 1 a 4 tatuagens.
- **Vale-presente.**
- **Marcações:** a política de sinal dela, tirada do post "Política de Marcações", e a Klarna 3x.
- **Sobre.**
- **Pedido:** formulário que monta a mensagem para o WhatsApp.

O texto está em português de Portugal e trata o cliente por "tu", como nas legendas dela.

## Identidade

- **Cores:** breu `#0c0a09` e o dourado do monograma DR `#cfa271`; o rosa `#d98aa0` só aparece no piercing, como no cartaz "Novo serviço: piercings".
- **Fontes:** Cinzel (o nome do cartão oficial é numa romana em caixa alta) e Hanken Grotesk.
- **Logo:** o DR é a arte dela vetorizada (`tools/logo.py`). A coroa e o arabesco do original eram finos demais para vetorizar e foram redesenhados à mão em SVG.

## Ferramentas

```
python -I tools/logo.py       # dr.svg, favicons e o <symbol id="dr"> no index.html
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
- [ ] **Texto do "Sobre"** e o uso das fotos das clientes.
- [ ] **Instagram de piercing:** @debora.regink aparece nos cartazes. Decidir se entra no rodapé.
- [ ] **Domínio** (sugestão: deboraregina.pt) e remover o `noindex`.

Site por [L R G Z](https://lrgz.com.br).
