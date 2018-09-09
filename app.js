const Hapi = require("hapi");
const Joi = require("joi");
const org = require('./index');
const hapiJwt = require('hapi-auth-jwt2');
const jsonwebtoken = require('jsonwebtoken');

const people = {
        id: 1,
        name: 'Jen Jones'
    };

const header = {
    alg: "HS256",
    typ: "jwt"
};

const validateToken = (decoded, request, response) =>  {
    if (!decoded.id) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
};

const init = async () => {
    const server = new Hapi.Server({
        host: 'localhost',
        port: 3000,
    });

    await server.register(hapiJwt);

    server.auth.strategy('jwt', 'jwt',
        {
            key: 'secret key 123',
            validate: validateToken,
            verifyOptions: { algorithms: ['HS256'] }
        });

    server.auth.default('jwt');

    
    server.route({
        method: "GET",
        path: "/token",
        config: { auth: false },
        handler: (request, response) => jsonwebtoken.sign(people, 'secret key 123')
    });
    server.route({
        method: "GET",
        path: "/org",
        config: { auth: 'jwt' },
        handler: async (request, response) => org.getOrgs(),
    });

    server.route({
        method: "GET",
        path: "/org/name/{name}",
        config: {
            validate: {
                params: {
                    name: Joi.string().required()
                },
            }
        },
        handler: (request, response) => org.getOrgsByName(request.params.name),
    });

    server.route({
        method: "GET",
        path: "/org/code/{code}",
        handler: (request, response) => 'not implemented'
    });

    server.route({
        method: "POST",
        path: "/org",
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    code: Joi.string().required(),
                    type: Joi.string().required(),
                }
            },
            auth: false,
        },
        handler: async (request, response) => org.addOrgs(request.payload),
    });

    await server.start();
    return server;
};

init().then(server => {
    console.log('Server running at:', server.info.uri);
})
.catch(error => {
    console.log(error);
});
