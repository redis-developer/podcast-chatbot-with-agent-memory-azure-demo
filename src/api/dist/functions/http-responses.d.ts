import type { HttpResponseInit } from '@azure/functions';
declare const responses: {
    ok: <T>(data: T) => HttpResponseInit;
    created: <T>(data: T) => HttpResponseInit;
    noContent: () => HttpResponseInit;
    badRequest: (message: string) => HttpResponseInit;
    notFound: (message: string) => HttpResponseInit;
    serverError: (message: string) => HttpResponseInit;
};
export default responses;
//# sourceMappingURL=http-responses.d.ts.map