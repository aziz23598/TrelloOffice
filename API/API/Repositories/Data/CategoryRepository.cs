using API.Context;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Repositories.Data
{
    public class CategoryRepository : GenericRepository<Category>
    {
        private readonly MyContext myContext;

        public CategoryRepository(MyContext myContext) : base(myContext)
        {
            this.myContext = myContext;
        }

        public List<Category> Get()
        {
            var data = myContext.TB_M_CATEGORY.ToList();
            return data;
        }
    }
}
