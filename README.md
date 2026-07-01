# Projeto-01-Barbearia-
Projeto referente a agendamentos e soluções práticas de problemas cotidianos e simples que acabam causando desconforto na hora do atendimento.

## Como rodar

### Front-end
Abra `home.html` no navegador (ou sirva a pasta com uma extensão tipo Live Server).

### Backend (integração com Google Agenda)

A autenticação usa OAuth (login único do dono da barbearia), pois contas Google Workspace costumam bloquear a criação de chaves de conta de serviço.

1. No [Google Cloud Console](https://console.cloud.google.com), crie um projeto, ative a **Google Calendar API** e crie um **ID do cliente OAuth** (tipo "Aplicativo da Web") com o URI de redirecionamento `http://localhost:3001/oauth2callback`.
2. Entre na pasta `server`:
   ```
   cd server
   npm install
   cp .env.example .env
   ```
3. Preencha o `.env` com `GOOGLE_CALENDAR_ID`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`. Deixe `GOOGLE_REFRESH_TOKEN` vazio por enquanto.
4. Inicie o servidor:
   ```
   npm start
   ```
5. Abra `http://localhost:3001/autorizar` no navegador, faça login com a conta Google da barbearia e aceite as permissões.
6. O servidor vai imprimir o **refresh token** no terminal. Copie-o para `GOOGLE_REFRESH_TOKEN` no `.env` e reinicie o servidor (`npm start`).

A partir daí, `POST /api/agendar` cria o evento na agenda automaticamente quando o formulário do site é enviado.

