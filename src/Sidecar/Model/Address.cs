using Newtonsoft.Json;

namespace Sidecar.Model
{
    public class Address
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("street")]
        public string Street { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("zipCode")]
        public string Zipcode { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }

        public static Address FromString(string json)
        {
            return JsonConvert.DeserializeObject<Address>(json);
        }
    }
}
