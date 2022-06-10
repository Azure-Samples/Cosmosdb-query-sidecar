import { Address } from "../models/Address";
import { IDatabaseService } from "./IDatabaseService";
import axios from "axios";
import { CosmosService } from "./DatabaseServices";


export class SidecarService implements IDatabaseService {
    async upsert(address: Address): Promise<Address> {
        const dbsvc = new CosmosService();
        const addy = await dbsvc.upsert(address);

        return addy;
    }

    async queryByZip(zipCode: string): Promise<Address[]> {
        try {
            const {data, status} = await axios.get<Address[]>(`http://sidecar:7138/api/Zip/${zipCode}`);
            return data;
        } catch (error) {
            console.log(error);
        }

        return new Array<Address>();
    }
    async queryByState(state: string): Promise<Address[]> {
        try {
            const {data, status} = await axios.get<Address[]>(`http://sidecar:7138/api/State/${state}`);
            return data;
        } catch (error) {
            console.log(error);
        }

        return new Array<Address>();
    }
}