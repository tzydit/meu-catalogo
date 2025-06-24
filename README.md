# Meu Catálogo

Este projeto é um app Vue 3 + Vite com vue-router e axios.

## Funcionalidades
- Tela de cadastro (/cadastro): usuário, e-mail, senha, botão, mensagem de erro.
- Tela de login (/login): usuário, senha, botão, mensagem de erro.
- Página inicial (/) após login: "Bem-vindo".
- Integração com API REST usando axios (baseURL: http://localhost:8080).
- CSS dark mode minimalista, inputs arredondados, botão preto com texto branco.

## Instalação
```sh
npm install
```

## Executar em modo desenvolvimento
```sh
npm run dev
```

## Estrutura de rotas
- `/cadastro` — Cadastro
- `/login` — Login
- `/` — Página inicial

## Configuração do backend
- POST `/auth/register` para cadastro
- POST `/auth/login` para login

---

> Feito com Vue 3, Vite, vue-router e axios.
