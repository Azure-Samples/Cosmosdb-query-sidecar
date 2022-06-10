# Azure Cosmos DB Cross-Partition Query Sidecar
Deploy components of an application into a separate process or container to provide isolation and encapsulation. This pattern can also enable applications to be composed of heterogeneous components and technologies.

## Problem
Currently (2022-05-12) the Azure Cosmos DB JavaScript SDK does not support the ability to query documents across partitions in a container. This is needed functionality for many of our customers and partners. After speaking with the team building the product and reviewing the road-map, it was decided that the best course of action is to hand off the query functionality to a sidecar until the feature is implemented at a later date. 

## Solution
This repository is a POC of the [Sidecar pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar) detailed in the Azure Architecture Center. 

![Sidecar Diagram](https://docs.microsoft.com/en-us/azure/architecture/patterns/_images/sidecar.png)

 1. Primary Application: TypeScript Service
 2. Sidecar: C# code that executes the cross-partition query

 The TS service is an HTTP endpoint that will upsert directly to the CosmosDB collection but will also call the Sidecar to query for requested information.
 
 Callstack:
 
 `index.ts` calls to the `CosmosRepositoryFactory.ts` and decides based on a flag to use the direct cosmos connection or to handoff requests to the sidecar.
 
 `index.ts` then accepts requests and calls into the `CosmosRepository.ts` that has the `SidecarService.ts` injected (this is over the `CosmosService.ts` based on the factory flag).
 
 It makes an HTTP call out to the Sidecar container.
 
 The sidecar controller hands off to the Cosmos service that issues the query to the Azure Service and returns the response back to the controller and back to the calling code in the `SidecarService.ts` as an HTTP response.

# Experiment Locally (Docker)

This section covers creating the project(s) as docker containers and running the code locally. 

<b>Content</b>
- [Cosmos DB](#create-a-cosmos-db)
    - [Configure .env](#update-env-files)
- [Create Docker Conatiners](#create-docker-containers)
- [Run the project](#run-containers)
- [Test Solution](#test-solution)

## Create a Cosmos DB
The solution requires an Azure Cosmos DB backend. 

- Open Azure Portal and create an Azure Resource Group
- Create an instance of Azure Cosmos DB in the aforementioned resource group. 
- Create a database in Cosmos
    - Database Name: 
        - Name: addressesdb
    - Create a container in the database
        - Name: address
        - Partition: /zipCode
- Seed the container with records
    - Click on "Items" under your container, then choose New Item
    - For each record:
        - Paste the content and click save <br>Record 1:
        ```json
        {
            "id": "2",
            "street": "2 Microsoft Way",
            "city": "Redmond",
            "state": "WA",
            "zipCode": "98052"
        }
        ``` 
        <br>Record 2:
        ```json
        {
            "id": "3",
            "street": "555 110th Ave NE",
            "city": "Bellevue",
            "state": "WA",
            "zipCode": "98004"
        }
        ```

### Update .env files
In both the ./src/Sidecar and ./src/Service folders create a <b>.env</b> file and copy the appropriate .env.template into it. 

Collect the connection string to the Cosmos DB you created above by visiting the Cosmos Instance and visiting the Keys menu item and copying the value for PRIMARY CONNECTION STRING

- ConnString/CONN_STRING = Connection string just collected.
- DatabaseId/DB_NAME = addressesdb
- ContainerId/CONN_ID = address

## Create Docker Containers
Navigate the the appropriate folder to build the Docker images locally. 

<i>
Hint : 
    SERVICE_IMAGE_NAME = [dockername]/service
    SIDECAR_IMAGE_NAME = [dockername]/cosmos
</i>

Build Service
> .../src/Service > docker build -t SERVICE_IMAGE_NAME .

Build Sidecar

> .../src/Sidecar > docker build -t SIDECAR_IMAGE_NAME .

## Run Containers
To run the containers, so that the Service can talk with the Sidecar, you first need to set up a docker network.

> docker network create sidecarnw

Now you can run both containers:

Service:
> docker run -itd --name service --hostname service --net sidecarnw --env-file ./.env -p 8080:8080 SERVICE_IMAGE_NAME

Sidecar:
> docker run -itd --name sidecar --hostname sidecar --net sidecarnw --env-file ./.env -p 7138:7138 SIDECAR_IMAGE_NAME

## Test Solution
To test the solution, install the Rest Client in Visual Studio Code. 

In Code navigate to the ./src/Service/rest-scripts folder and run each script. 