namespace Sidecar.Services
{
    public interface IDataAccess<T>
    {
        Task<List<T>> QueryByZip(string zipcode);
        Task<List<T>> QueryByState(string state);
    }
}
