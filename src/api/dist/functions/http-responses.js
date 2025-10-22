const responses = {
    ok: (data) => ({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: data
    }),
    created: (data) => ({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: data
    }),
    noContent: () => ({
        status: 204,
        headers: {}
    }),
    badRequest: (message) => ({
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { error: message }
    }),
    notFound: (message) => ({
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { error: message }
    }),
    serverError: (message) => ({
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { error: message }
    })
};
export default responses;
//# sourceMappingURL=http-responses.js.map