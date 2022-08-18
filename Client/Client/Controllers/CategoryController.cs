using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers
{
    public class CategoryController : Controller
    {
        private readonly CategoryRepository categoryRepository;

        public CategoryController(CategoryRepository categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }


        #region Get
        public IActionResult Index()
        {
            return View();
        }
        #endregion Get

        #region GetJSON
        public ActionResult GetJSON()
        {
            var result = categoryRepository.Get();
            if (result != null) return Ok(new
            {
                status = 200,
                message = "SUCCESS",
                data = result
            });
            return NotFound(new
            {
                status = 404,
                message = "NOT FOUND"
            });
        }
        #endregion

        #region PostJSON
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult PostJSON(Category category)
        {
            var result = categoryRepository.Post(category);
            if (result == System.Net.HttpStatusCode.Created) return Ok(new
            {
                status = result,
                message = "CREATED"
            });
            return BadRequest(new
            {
                status = 400,
                message = "Bad Request"
            });
        }
        #endregion

        #region GetJSONById
        public ActionResult GetJSONById(int id)
        {
            var result = categoryRepository.Get(id);
            if (result != null) return Ok(new
            {
                status = 200,
                message = "SUCCESS",
                data = result
            });
            return BadRequest(new
            {
                status = 400,
                message = "BAD REQUEST"
            });
        }
        #endregion GetJSONById

        #region EditJSON
        [HttpPut]
        [ValidateAntiForgeryToken]
        public ActionResult EditJson(Category category)
        {
            var result = categoryRepository.Put(category);
            if (result == System.Net.HttpStatusCode.OK) return Ok(new
            {
                status = 200,
                message = "EDITED"
            });
            return BadRequest(new
            {
                status = 400,
                message = "Bad Request"
            });
        }
        #endregion DeleteJSON

        #region DeleteJSON
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteJSON(Category category)
        {
            var result = categoryRepository.Delete(category);
            if (result == System.Net.HttpStatusCode.OK) return Ok(new
            {
                status = 200,
                message = "DELETED"
            });
            return BadRequest(new
            {
                status = 400,
                message = "BAD REQUEST"
            });
        }
        #endregion DeleteJSON
    }
}
