using API.Context;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace API.Repositories.Data
{
    public class TaskUserRepository : GenericRepository<TaskUser>
    {
        private readonly MyContext myContext;

        public TaskUserRepository(MyContext myContext) : base(myContext)
        {
            this.myContext = myContext;
        }
        public bool IsAlreadyExist(int TaskId, int UserId)
        {
            var data = myContext.TB_M_TASKUSER
                .Where(x => x.TaskId == TaskId && x.UserId == UserId)
                .FirstOrDefault();

            if (data == null) return false;

            return true;
        }
        public List<TaskUser> Get()
        {
            var data = myContext.TB_M_TASKUSER
                .Include(x => x.Task).ThenInclude(x => x.Category)
                .Include(x => x.Task).ThenInclude(x => x.Project)
                .ToList();
            return data;
        }

        public override int Post(TaskUser taskUser)
        {
            bool checkData = IsAlreadyExist(taskUser.TaskId, taskUser.UserId);
            int result = 0;

            if (checkData ==  false)
            {
                myContext.TB_M_TASKUSER.Add(taskUser);
                result = myContext.SaveChanges();
                return result;
            }
            return result;
        }

        public override int Put(TaskUser taskUser)
        {
            bool checkData = IsAlreadyExist(taskUser.TaskId, taskUser.UserId);
            int result = 0;

            if (checkData ==  false)
            {
                myContext.TB_M_TASKUSER.Update(taskUser);
                result = myContext.SaveChanges();
                return result;
            }
            return result;
        }
    }
}
