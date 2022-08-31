using Client.Models;
using Client.Repositories.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Client.Controllers
{
    [Authorize(Roles = "Manager")]
    public class ProjectController : Controller
    {
        private readonly ProjectRepository projectRepository;

        public ProjectController(ProjectRepository projectRepository)
        {
            this.projectRepository = projectRepository;
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
            var result = await projectRepository.Get();
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
        public ActionResult PostJSON(Project project)
        {
            var result = projectRepository.Post(project);
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
            var result = await projectRepository.Get(id);
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
        public ActionResult EditJson(Project project)
        {
            var result = projectRepository.Put(project);
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
        public ActionResult DeleteJSON(Project project)
        {
            var result = projectRepository.Delete(project);
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
