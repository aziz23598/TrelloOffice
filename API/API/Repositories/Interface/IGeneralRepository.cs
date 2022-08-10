﻿using System.Collections.Generic;

namespace API.Repository.Interface
{
    public interface IGeneralRepository<TModel>
        where TModel : class
    {
        List<TModel> Get();
        TModel Get(int Id);
        int Post(TModel model);
        int Put(TModel model);
        int Delete(TModel model);
    }
}