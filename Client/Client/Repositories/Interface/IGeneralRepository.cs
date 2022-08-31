using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Client.Repositories.Interface
{
    public interface IGeneralRepository<TModel>
        where TModel : class
    {
        Task<List<TModel>> Get();
        Task<TModel> Get(int id);
        HttpStatusCode Put(TModel model);
        HttpStatusCode Post(TModel model);
        HttpStatusCode Delete(TModel model);
    }
}
