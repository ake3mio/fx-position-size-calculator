const WebSocket = require('ws');
const SubscriptionManager = require('./subscription-manager');
const prices = require('./prices');
const ClientManager = require('./client-manager');
const {composeMiddleware} = require('../core/server/utils');
const {createError, ErrorCauses, EventType} = require('../../common/websockets');
const {StoreName} = require('../../common/forex');

module.exports = (server, middleware) => {

    const {
        cookieParser,
        sessionParser,
        userMiddleware,
    } = middleware;

    const wss = new WebSocket.Server({clientTracking: false, noServer: true});

    const runMiddleware = (socket, head) => composeMiddleware([
        cookieParser,
        sessionParser,
        userMiddleware,
        (request) => {

            if (!request.session || !request.session.id) {
                socket.destroy();
                return;
            }

            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit('connection', ws, request);
            });
        }
    ]);

    server.on('upgrade', function (request, socket, head) {
        runMiddleware(socket, head)(request, {});
    });

    wss.on('connection', function (ws, request) {


        if (!request.user.hasCurrentUser()) {
            const {code, errorCause} = createError(ErrorCauses.UNAUTHORIZED_USER);
            ws.close(code, errorCause);
            return;
        }

        const sessionId = request.session.id;
        const symbols = request.cookies[StoreName.INSTRUMENTS];
        const user = request.user.getCurrentUser();

        if (symbols && user) {
            SubscriptionManager.receiver(user, {
                type: EventType.ADD_INSTRUMENTS,
                payload: symbols
            });
        }

        ClientManager.add(user, sessionId, ws);

        ws.on('message', function (message) {
            console.log(`Received message ${message} from user`);
            SubscriptionManager.receiver(user, JSON.parse(message));
        });

        const close = function () {
            SubscriptionManager.removeFromRecord(user);
            ClientManager.remove(user, sessionId);
        };

        ws.on('close', close);

    });

    prices.sender(ClientManager.getAll);
};
