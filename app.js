const Hapi = require("hapi");
const Joi = require("joi");
const org = require('./index');
const hapiJwt = require('hapi-auth-jwt2');
const CryptoJS = require("crypto-js");

const people = {
    1: {
        id: 1,
        name: 'Jen Jones'
    }
};

const header = {
    alg: "HS256",
    typ: "jwt"
};

const validate = (decoded, request, response) =>  {
    console.log('~~~~', decoded);
    if (!people[decoded.id]) {
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
            validate: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

    server.auth.default('jwt');

    
    server.route({
        method: "GET",
        path: "/token",
        config: { auth: false },
        handler: (request, response) => {
            const base64url = (source) => {
                // Encode in classical base64
                encodedSource = CryptoJS.enc.Base64.stringify(source);
                
                // Remove padding equal characters
                encodedSource = encodedSource.replace(/=+$/, '');
                
                // Replace characters according to base64url specifications
                encodedSource = encodedSource.replace(/\+/g, '-');
                encodedSource = encodedSource.replace(/\//g, '_');
                
                return encodedSource;
              }
              const secret = 'secret key 123';
              const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
              const encodedHeader = base64url(stringifiedHeader);
              
              const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(people));
              const encodedData = base64url(stringifiedData);
              
              let signature = encodedHeader + "." + encodedData;
              console.log(signature);
              signature = CryptoJS.HmacSHA256(signature, secret);
              signature = base64url(signature);
              return signature;
        }
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
