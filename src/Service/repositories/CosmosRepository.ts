import { Address } from "../models/Address";
import { IDatabaseService } from "../services/IDatabaseService";
import { ICosmosRepository } from "./ICosmosRepository";

export class CosmosRepository implements ICosmosRepository {
    public readonly _service: IDatabaseService;

    constructor(databaseService: IDatabaseService) {
        this._service = databaseService;
    }

    async upsert(address: Address): Promise<Address> {
        return await this._service.upsert(address);
    }

    async queryByZip(zipCode: string): Promise<Address[]> {
        return await this._service.queryByZip(zipCode);
    }

    async queryByState(state: string): Promise<Address[]> {
        return await this._service.queryByState(state);
    }
}