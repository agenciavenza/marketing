# Venza — Landing page

Implementação estática (HTML + CSS) da landing page Venza a partir do
design no Figma (`node 0:450`).

## Estrutura

- `index.html` — marcação semântica de toda a página
- `styles.css` — tokens de design, layout e componentes

A página foi construída em HTML/CSS puros, sem dependências de
framework, usando a fonte Inter via Google Fonts.

## Como visualizar

Qualquer servidor estático funciona, por exemplo:

```bash
# com Python
python3 -m http.server 5173

# ou com npx
npx serve .
```

Depois abra <http://localhost:5173>.

## Seções implementadas

1. Hero com título "Fora do Padrão. Conectados com Propósito."
2. Faixa de logos de clientes
3. Sobre a Venza ("Da Inconformidade Nasce um Sonho")
4. Projetos Venza — três cases (Rafain Chopp, Dra. Grasielle, Ali Badawi)
5. Por Que Escolher a Venza? — cinco cards de serviço
6. Diferenciais — quatro blocos (Performance Real, Venza Flow,
   Propósito no Centro, Comunicação Transparente)
7. Time da agência (3 membros)
8. Depoimentos com controles de carrossel
9. CTA "Cansado de Estratégias Que Não Geram ROI?"
10. Rodapé com soluções e redes sociais

## Notas

- Os ícones e ilustrações dos cards de serviço/diferenciais foram
  recriados em CSS puro a partir do design original.
- As imagens dos cases e do time aparecem como blocos com gradientes
  representando os enquadramentos. Substitua as classes
  `.case__img--*` e `.member__photo--*` por `background-image` apontando
  para as imagens finais quando estiverem disponíveis.
- O layout é responsivo: breakpoints em 1100px e 640px.
