using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Client.Controllers
{
    [Authorize(Roles = "Manager,Employee")]
    public class TaskController : Controller
    {
        private readonly TaskRepository taskRepository;

        public TaskController(TaskRepository taskRepository)
        {
            this.taskRepository = taskRepository;
        }

        #region Get
        public IActionResult Index()
        {
            return View();
        }
        #endregion Get

        #region GetJSON
        public async Task<ActionResult> GetJSON()
        {
            var result = await taskRepository.Get();
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
        public ActionResult PostJSON(TaskVM task)
        {
            var result = taskRepository.Post(task);
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
        public async Task<ActionResult> GetJSONById(int id)
        {
            var result = await taskRepository.Get(id);
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
        public ActionResult EditJson(TaskVM task)
        {   
            var result = taskRepository.Put(task);
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
        public ActionResult DeleteJSON(TaskVM task)
        {
            var result = taskRepository.Delete(task);
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
