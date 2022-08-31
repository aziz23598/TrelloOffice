using Client.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Client.Repositories
{
    public class GenericRepository<TModel> : IGeneralRepository<TModel>
        where TModel : class
    {
        string request;
        internal readonly IHttpContextAccessor accessor;
        internal readonly HttpClient client;
        internal readonly Uri baseUrl = new Uri("https://localhost:44313/api/");
        public GenericRepository(string request)
        {
            this.request = request;
            accessor = new HttpContextAccessor();
            client = new HttpClient();
            client.BaseAddress = baseUrl;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessor.HttpContext.Session.GetString("JWToken"));
        }

        #region Delete
        public HttpStatusCode Delete(TModel model)
        {
            using(var client = new HttpClient())
            {
                var requestDelete = new HttpRequestMessage
                {
                    Method = HttpMethod.Delete,
                    RequestUri = new Uri($"{baseUrl}{request}"),
                    Content = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json")
                };
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessor.HttpContext.Session.GetString("JWToken"));
                var response = client.SendAsync(requestDelete);
                response.Wait();
                var result = response.Result.StatusCode;
                return result;
            }
        }
        #endregion Delete

        #region Get
        public async Task<List<TModel>> Get()
        {

            List<TModel> results = null;
            var responseTask = await client.GetAsync($"{request}/");

            if (responseTask.IsSuccessStatusCode)
            {
                var readTask = responseTask.Content.ReadAsStringAsync().Result;
                var parseObject = JObject.Parse(readTask);
                var dataOnly = parseObject["data"].ToString();

                results = JsonConvert.DeserializeObject<List<TModel>>(dataOnly);
                return results;
            }
            return results;
        }
        #endregion Get

        #region Get By Id
        public async Task<TModel> Get(int id)
        {
            TModel model = null;
            var responseTask = await client.GetAsync($"{request}/" + id.ToString());
            if (responseTask.IsSuccessStatusCode)
            {
                var readTask = responseTask.Content.ReadAsStringAsync().Result;
                var parsedObject = JObject.Parse(readTask);
                var dataOnly = parsedObject["data"].ToString();

                model = JsonConvert.DeserializeObject<TModel>(dataOnly);
                return model;
            }
            return model;
        }
        #endregion Get By Id

        #region Post
        public HttpStatusCode Post(TModel model)
        {
            var postTask = client.PostAsJsonAsync<TModel>($"{request}", model);
            postTask.Wait();

            var result = postTask.Result.StatusCode;
            return result;
        }
        #endregion Post

        #region Put
        public HttpStatusCode Put(TModel model)
        {
            var postTask = client.PutAsJsonAsync<TModel>($"{request}", model);
            postTask.Wait();

            var result = postTask.Result.StatusCode;
            return result;
        }
        #endregion Put
    }
}
