const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 3786; // Choisir un port libre
const ADGUARD_SERV_URL = "https://api.adguard-dns.io/oapi/v1/dns_servers";
const ADGUARD_ACCOUNT_URL = "https://api.adguard-dns.io/oapi/v1/account/limits";
const TOKEN = process.env.ADGUARD_TOKEN; // change ton token dans le fichier .env

// Recuperation des données de l'API AdGuard
app.get("/adguard-dns", async (req, res) => {
    try {
        const [servResponse, accountResponse] = await Promise.all([
            axios.get(ADGUARD_SERV_URL, { headers: { Authorization: `Bearer ${TOKEN}` } }),
            axios.get(ADGUARD_ACCOUNT_URL, { headers: { Authorization: `Bearer ${TOKEN}` } })
            ]);

        const serv = servResponse.data[0];
        const account = accountResponse.data;

        // Reformater les données
        res.json({
            server_name: serv.name,
            protection_enabled: serv.settings.protection_enabled ? 1 : 0,
            user_rules_count: serv.settings.user_rules_settings.rules_count,
            filter_list_count: serv.settings.filter_lists_settings.filter_list.length,
            block_private_relay: serv.settings.block_private_relay ? 1 : 0,
            connected_devices: serv.device_ids.length,
            used_requests: account.requests.used,
            limit_requests: account.requests.limit,
            requests_summary: `${account.requests.used} / ${account.requests.limit}`
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.response?.data || error.message);
        res.status(500).json({ error: "Impossible de récupérer les données d'AdGuard" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy AdGuard en cours d'exécution sur http://localhost:${PORT}/adguard-dns`);
});
