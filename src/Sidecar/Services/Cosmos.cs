using Microsoft.Azure.Cosmos;
using Sidecar.Model;

namespace Sidecar.Services
{
    public class Cosmos : IDataAccess<Address>
    {
        private readonly CosmosClient cosmosClient;
        private readonly Container container;
        private readonly Database database;

        public Cosmos()
        {
            string conn = Environment.GetEnvironmentVariable("ConnString");
            string databaseId = Environment.GetEnvironmentVariable("DatabaseId");
            string containerId = Environment.GetEnvironmentVariable("ContainerId");

            cosmosClient = new CosmosClient(conn);
            database = cosmosClient.CreateDatabaseIfNotExistsAsync(databaseId).GetAwaiter().GetResult();
            container = database.CreateContainerIfNotExistsAsync(containerId, "/zipCode").GetAwaiter().GetResult();
        }

        public async Task<List<Address>> QueryByZip(string zipcode)
        {
            var sqlQueryText = $"SELECT * FROM c WHERE c.zipCode = '{zipcode}'";

            QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
            FeedIterator<Address> queryResultSetIterator = this.container.GetItemQueryIterator<Address>(queryDefinition);

            List<Address> addresses = new List<Address>();

            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<Address> currentResultSet = await queryResultSetIterator.ReadNextAsync();
                foreach (Address Address in currentResultSet)
                {
                    addresses.Add(Address);
                }
            }

            return addresses;
        }

        public async Task<List<Address>> QueryByState(string state)
        {
            var sqlQueryText = $"SELECT * FROM c WHERE c.state = '{state}'";

            QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
            FeedIterator<Address> queryResultSetIterator = this.container.GetItemQueryIterator<Address>(queryDefinition);

            List<Address> addresses = new List<Address>();

            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<Address> currentResultSet = await queryResultSetIterator.ReadNextAsync();
                foreach (Address Address in currentResultSet)
                {
                    addresses.Add(Address);
                }
            }

            return addresses;
        }
    }
}
