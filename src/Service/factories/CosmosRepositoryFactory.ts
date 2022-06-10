import { CosmosRepository } from "../repositories/CosmosRepository";
import { ICosmosRepository } from "../repositories/ICosmosRepository";
import { CosmosService } from "../services/DatabaseServices";
import { IDatabaseService } from "../services/IDatabaseService";
import { SidecarService } from "../services/SidecarService";

export function cosmosRepositoryFactory() : ICosmosRepository {
    let isSideCar = process.env.USE_SIDECAR!;
    let databaseService: IDatabaseService;

    if (isSideCar) {
        databaseService = new SidecarService();
    } else {
        databaseService = new CosmosService();
    }

    return new CosmosRepository(databaseService);
}