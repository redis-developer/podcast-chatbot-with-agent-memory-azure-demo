import azureFunctions from '@azure/functions';
import { fetchSessionHistory } from './fetch-session-history.js';
import { requestAndResponse } from './request-and-response.js';
import { deleteSession } from './delete-session.js';
const { app } = azureFunctions;
app.http('fetchSessionHistory', {
    methods: ['GET'],
    route: 'sessions/{username}',
    authLevel: 'anonymous',
    handler: fetchSessionHistory
});
app.http('requestAndResponse', {
    methods: ['POST'],
    route: 'sessions/{username}',
    authLevel: 'anonymous',
    handler: requestAndResponse
});
app.http('deleteSession', {
    methods: ['DELETE'],
    route: 'sessions/{username}',
    authLevel: 'anonymous',
    handler: deleteSession
});
//# sourceMappingURL=sessions.js.map