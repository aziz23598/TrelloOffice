using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Client.Controllers
{
    [Authorize]
    public class TaskUserController : Controller
    {
        private readonly TaskUserRepository taskUserRepository;

        public TaskUserController(TaskUserRepository taskUserRepository)
        {
            this.taskUserRepository = taskUserRepository;
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
            var result = await taskUserRepository.Get();
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

        #region GetJSONId
        public async Task<ActionResult> GetJSONById(int id)
        {
            var result = await taskUserRepository.Get(id);
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
        #endregion GetJSONId

        #region PostJSON
        public ActionResult PostJSON(TaskUser taskUser)
        {
            var result = taskUserRepository.Post(taskUser);
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
        #endregion PostJSON

        #region EditJSON
        [HttpPut]
        [ValidateAntiForgeryToken]
        public ActionResult EditJson(TaskUser taskUser)
        {
            var result = taskUserRepository.Put(taskUser);
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
        #endregion EditJSON
    }
}
