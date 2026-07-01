const { google } = require("googleapis");

function getOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
}

function getAuthUrl() {
    const oAuth2Client = getOAuthClient();

    return oAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/calendar"]
    });
}

async function trocarCodigoPorToken(code) {
    const oAuth2Client = getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);

    return tokens;
}

function getAuthorizedClient() {
    const oAuth2Client = getOAuthClient();

    oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    return oAuth2Client;
}

async function criarEvento({ nome, telefone, servicos, barbeiro, data, horario, total }) {

    const auth = getAuthorizedClient();
    const calendar = google.calendar({ version: "v3", auth });

    const duracaoMinutos = Math.max(servicos.length * 30, 30);
    const inicio = new Date(`${data}T${horario}:00`);
    const fim = new Date(inicio.getTime() + duracaoMinutos * 60000);

    const evento = {
        summary: `${barbeiro} - ${servicos.join(", ")} (${nome})`,
        description:
            `Cliente: ${nome}\n` +
            `Telefone: ${telefone}\n` +
            `Serviços: ${servicos.join(", ")}\n` +
            `Total: R$ ${total}`,
        start: { dateTime: inicio.toISOString(), timeZone: "America/Sao_Paulo" },
        end: { dateTime: fim.toISOString(), timeZone: "America/Sao_Paulo" }
    };

    const response = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: evento
    });

    return response.data;
}

module.exports = { getAuthUrl, trocarCodigoPorToken, criarEvento };
