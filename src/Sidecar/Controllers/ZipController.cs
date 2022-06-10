using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Sidecar.Model;
using Sidecar.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Sidecar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZipController : ControllerBase
    {
        private readonly IDataAccess<Address> _dataAccess;

        public ZipController(IDataAccess<Address> dataAccess)
        {
            _dataAccess = dataAccess;
        }

        // GET api/<ZipController1>/30542
        [HttpGet("{zipCode}")]
        public async Task<string> Get(string zipCode)
        {
            var data = await _dataAccess.QueryByZip(zipCode);
            return JsonConvert.SerializeObject(data);
        }
    }
}
