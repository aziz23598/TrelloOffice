using Client.Models;

namespace Client.Repositories.Data
{
    public class CategoryRepository : GenericRepository<Category>
    {
        public CategoryRepository(string request = "Category") : base(request)
        {
        }
    }
}
