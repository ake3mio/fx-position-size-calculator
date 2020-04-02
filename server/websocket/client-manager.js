const clients = new Map();

const add = ({accountId, token}, sessionId, ws) => {
    if (!clients.has(accountId)) {
        clients.set(accountId, {
            token,
            sockets: new Map()
        });
    }
    const sessions = clients.get(accountId);
    sessions.sockets.set(sessionId, ws);
    clients.set(accountId, sessions);
};

const remove = ({accountId}, sessionId) => {

    if (clients.has(accountId)) {

        const sessions = clients.get(accountId);
        sessions.sockets.delete(sessionId);

        if (sessions.sockets.size === 0) {
            clients.delete(accountId);
        }
    }

};

module.exports = {
    add,
    remove,
    getAll: () => clients
};
