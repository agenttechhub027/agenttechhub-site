# AgentTech Hub

Site institucional da AgentTech Hub, feito em Django + Tailwind CSS + Alpine.js.

## Setup do ambiente

```bash
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

## Rodando em desenvolvimento

O CSS não vem mais de um CDN — ele é compilado localmente via [django-tailwind](https://github.com/timonweb/django-tailwind) (app `theme/`). Isso significa que, além do servidor do Django, é preciso rodar o compilador do Tailwind em modo "watch" pra qualquer classe nova usada nos templates aparecer no CSS gerado.

Abra **dois terminais** (o comando `tailwind dev`, que rodaria os dois juntos, não funciona no Windows):

```bash
# Terminal 1 — servidor Django
python manage.py runserver

# Terminal 2 — compilador do Tailwind, observando mudanças em tempo real
python manage.py tailwind start
```

Com os dois rodando, qualquer classe Tailwind nova usada em um template (`.html`) é detectada e o CSS recompila automaticamente — só recarregar a página no navegador.

Se `tailwind start` não estiver rodando, o site ainda funciona, mas o CSS fica "congelado" na última vez que foi compilado (não vai refletir classes novas até rodar `tailwind build` manualmente ou reiniciar o watcher).

### Onde mexer no CSS/tema

- **Cores, fontes e tokens do design system**: `theme/static_src/src/styles.css` (bloco `@theme`).
- **Classes utilitárias custom** (ex: `scrollbar-hide`, `[x-cloak]`): também em `theme/static_src/src/styles.css`.
- Depois de editar `styles.css`, se o `tailwind start` estiver rodando, não precisa fazer nada — ele recompila sozinho.

## Build de produção

Antes de subir pra produção (ou sempre que quiser gerar o CSS final sem deixar o watcher rodando):

```bash
python manage.py tailwind build
```

Isso gera o CSS minificado em `theme/static/css/dist/styles.css`, que é o arquivo servido pela tag `{% tailwind_css %}` no `base.html`.

## Primeira instalação num ambiente novo (clone do zero)

Se for a primeira vez rodando o projeto numa máquina nova (o app `theme/` já vem no repositório, não precisa rodar `tailwind init` de novo):

```bash
pip install -r requirements.txt
python manage.py tailwind install   # instala as dependências Node do Tailwind (precisa de Node.js instalado)
python manage.py tailwind build     # gera o CSS uma vez
```

No Windows, se `tailwind install`/`build`/`start` reclamar que não encontra o `npm`, confira se `NPM_BIN_PATH` está configurado corretamente em `config/settings.py` (aponta para o caminho do `npm.cmd`).
