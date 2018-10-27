export const environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: {
        users: process.env.DB_USERS_URL || './data/users.json',
        clients: process.env.DB_CLIENTS_URL || './data/clients.json',
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'mkdata-api-secret',
        enableHTTPS: process.env.ENABLE_HTTPS || true,
        certificate: process.env.CERT_FILE || './security/keys/cert.pem',
        key: process.env.KEY_FILE || './security/keys/key.pem'
    }
}
