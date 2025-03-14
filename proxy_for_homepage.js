const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 3786; // Choisir un port libre
const ADGUARD_SERV_URL = "https://api.adguard-dns.io/oapi/v1/dns_servers";
const ADGUARD_ACCOUNT_URL = "https://api.adguard-dns.io/oapi/v1/account/limits";

let TOKEN = process.env.ADGUARD_TOKEN; // Stockage dynamique du token

async function refreshToken() {
    try {
        const response = await axios.post("https://api.adguard-dns.io/oapi/v1/oauth_token", new URLSearchParams({
            username: process.env.ADGUARD_USERNAME,
            password: process.env.ADGUARD_PASSWORD
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const newToken = response.data.access_token;
        console.log("✅ Nouveau token récupéré :", newToken);

        // Mise à jour du fichier .env
        const envPath = path.resolve(__dirname, ".env");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const updatedEnv = envContent.replace(/ADGUARD_TOKEN=.*/, `ADGUARD_TOKEN=${newToken}`);
        fs.writeFileSync(envPath, updatedEnv);

        // Mise à jour du token en mémoire
        TOKEN = newToken;
        return newToken;
    } catch (error) {
        console.error("❌ Erreur lors du renouvellement du token :", error.response?.data || error.message);
        return null;
    }
}

async function fetchAdGuardData() {
    try {
        const [servResponse, accountResponse] = await Promise.all([
            axios.get(ADGUARD_SERV_URL, { headers: { Authorization: `Bearer ${TOKEN}` } }),
            axios.get(ADGUARD_ACCOUNT_URL, { headers: { Authorization: `Bearer ${TOKEN}` } })
        ]);

        return {
            server: servResponse.data[0],
            account: accountResponse.data
        };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("⚠ Token expiré, génération d'un nouveau...");
            const newToken = await refreshToken();
            if (newToken) return fetchAdGuardData(); // Réessaye avec le nouveau token
        }
        throw error;
    }
}

// Endpoint API
app.get("/adguard-dns", async (req, res) => {
    try {
        const data = await fetchAdGuardData();
        res.json({
            server_name: data.server.name,
            protection_enabled: data.server.settings.protection_enabled ? 1 : 0,
            user_rules_count: data.server.settings.user_rules_settings.rules_count,
            filter_list_count: data.server.settings.filter_lists_settings.filter_list.length,
            block_private_relay: data.server.settings.block_private_relay ? 1 : 0,
            connected_devices: data.server.device_ids.length,
            used_requests: data.account.requests.used,
            limit_requests: data.account.requests.limit,
            requests_summary: `${data.account.requests.used} / ${data.account.requests.limit}`
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error.response?.data || error.message);
        res.status(500).json({ error: "Impossible de récupérer les données d'AdGuard" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy AdGuard en cours d'exécution sur http://localhost:${PORT}/adguard-dns`);
});