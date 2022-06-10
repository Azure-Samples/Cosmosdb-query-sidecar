import { Container, CosmosClient, Database } from "@azure/cosmos";
import { Address } from "../models/Address";
import { IDatabaseService } from "./IDatabaseService";

export class CosmosService implements IDatabaseService {
    private readonly _cosmosClient: CosmosClient;
    private _db: Database | undefined;
    private _container: Container | undefined;

    constructor() {
        this._cosmosClient = new CosmosClient(process.env.CONN_STRING!);
    }

    async upsert(address: Address): Promise<Address> {
        await this.init(); 
        return (await this._container!.items.upsert<Address>(address)).resource as Address;
    }

    async queryByZip(zipCode: string): Promise<Address[]> {
        await this.init();
        let q: string = `SELECT * FROM c`;
        return (await this._container!.items.query(q, { partitionKey: zipCode }).fetchAll()).resources as Address[];
    }

    async queryByState(state: string): Promise<Address[]> {
        await this.init();
        let q: string = `SELECT * FROM c WHERE c.state = ${state}`;
        return (await this._container!.items.query<Address>(q).fetchAll()).resources as Address[];
    }

    // Probably move this into a factory and encapsulate logic in repo factory, inject _container into constructor
    private async init() {
        if (this._db == undefined) {
            this._db = (await this._cosmosClient.databases.createIfNotExists({ id: process.env.DB_NAME! })).database;
        }

        if (this._container == undefined) {
            this._container = (await this._db!.containers.createIfNotExists({ id: process.env.COLL_NAME! })).container;
        }
    }

}
