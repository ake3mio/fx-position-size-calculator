const clients = new Map();

const add = ({accountId, token}, sessionId, ws) => {

    if (!clients.has(accountId)) {
        clients.set(accountId, {
            token,
            sockets: new Map()
        });
    }

    const sessions = clients.get(accountId);
    if (!sessions.sockets.get(sessionId)) {
        sessions.sockets.set(sessionId, []);
    }

    const wss = sessions.sockets.get(sessionId);
    wss.push(ws);

    sessions.sockets.set(sessionId, wss);
    clients.set(accountId, sessions);
};

const remove = ({accountId}, ws, sessionId) => {

    if (clients.has(accountId)) {

        const sessions = clients.get(accountId);

        const wss = sessions.sockets.get(sessionId);

        if (wss) {
            sessions.sockets.set(sessionId, wss.filter(sock => sock !== ws));
        }

        if (sessions.sockets.get(sessionId).length === 0) {
            sessions.sockets.delete(sessionId)
        }

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
