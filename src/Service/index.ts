import fastify from 'fastify'
import * as dotenv from 'dotenv'
import { ICosmosRepository } from './repositories/ICosmosRepository'
import { cosmosRepositoryFactory } from './factories/CosmosRepositoryFactory'
import { Address } from './models/Address'

dotenv.config()
const server = fastify()
const repository: ICosmosRepository = cosmosRepositoryFactory();

// This allows dev certs, really any cert so don't use out side of dev!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

server.post('/upsert', async (request, reply) => {
    const addresses = request.body as Address[];
    addresses.forEach(address => {
        repository.upsert(address);
    });

    reply.status(200).send();
});

server.post('/queryByZip', async (request, reply) => {
    const zip = (request.body as Address).zipCode;
    const addresses = await repository.queryByZip(zip);
    
    reply.status(200).send(addresses);
});

server.post('/queryByState', async (request, reply) => {
    const state = (request.body as Address).state;
    const addresses = await repository.queryByState(state);
    
    reply.status(200).send(addresses);
});

server.listen(8080, '0.0.0.0', (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
