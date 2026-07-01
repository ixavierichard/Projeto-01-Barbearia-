require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { getAuthUrl, trocarCodigoPorToken, criarEvento } = require("./googleCalendar");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(express.json());

// Passo único de autorização: abra http://localhost:3001/autorizar no navegador,
// faça login com a conta Google da barbearia e aceite as permissões.
app.get("/autorizar", (req, res) => {
    res.redirect(getAuthUrl());
});

// O Google redireciona para cá depois da autorização, trazendo o refresh token
// no terminal. Copie o valor para GOOGLE_REFRESH_TOKEN no .env e reinicie o servidor.
app.get("/oauth2callback", async (req, res) => {

    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Código de autorização não recebido.");
    }

    try {
        const tokens = await trocarCodigoPorToken(code);

        console.log("\nRefresh token gerado, copie para o .env em GOOGLE_REFRESH_TOKEN:\n");
        console.log(tokens.refresh_token);
        console.log("");

        res.send("Autorização concluída! Copie o refresh token exibido no terminal do servidor para o seu .env (GOOGLE_REFRESH_TOKEN) e reinicie o servidor.");
    } catch (erro) {
        console.error("Erro ao trocar código por token:", erro);
        res.status(500).send("Erro ao concluir autorização.");
    }

});

app.post("/api/agendar", async (req, res) => {

    const { nome, telefone, servicos, barbeiro, data, horario, total } = req.body;

    if (!nome || !telefone || !Array.isArray(servicos) || servicos.length === 0 || !barbeiro || !data || !horario) {
        return res.status(400).json({ error: "Dados incompletos." });
    }

    try {
        const evento = await criarEvento({ nome, telefone, servicos, barbeiro, data, horario, total });
        res.json({ success: true, eventLink: evento.htmlLink });
    } catch (erro) {
        console.error("Erro ao criar evento no Google Agenda:", erro);
        res.status(500).json({ error: "Não foi possível agendar no Google Agenda." });
    }

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
