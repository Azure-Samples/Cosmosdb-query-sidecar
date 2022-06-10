import { Address } from "../models/Address";

export interface IDatabaseService {
    upsert(address: Address) : Promise<Address>;
    queryByZip(zipCode: string) : Promise<Address[]>;
    queryByState(state: string) : Promise<Address[]>;
}