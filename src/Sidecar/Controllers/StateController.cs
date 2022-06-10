using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Sidecar.Model;
using Sidecar.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Sidecar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly IDataAccess<Address> _dataAccess;

        public StateController(IDataAccess<Address> dataAccess)
        {
            _dataAccess = dataAccess;
        }

        // GET api/<StateController>/WA
        [HttpGet("{state}")]
        public async Task<string> Get(string state)
        {
            var data = await _dataAccess.QueryByState(state);
            return JsonConvert.SerializeObject(data);
        }
    }
}
