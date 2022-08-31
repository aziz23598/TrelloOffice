using Client.Models;

namespace Client.Repositories.Data
{
    public class TaskRepository : GenericRepository<TaskVM>
    {
        public TaskRepository(string request = "Task") : base(request)
        {

        }
    }
}
