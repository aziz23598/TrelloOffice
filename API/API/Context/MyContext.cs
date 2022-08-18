using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Context
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Employee> TB_M_EMPLOYEE { get; set; }
        public DbSet<User> TB_M_USER { get; set; }
        public DbSet<RoleUser> TB_M_ROLEUSER { get; set; }
        public DbSet<Role> TB_M_ROLE { get; set; }
        public DbSet<TaskUser> TB_M_TASKUSER { get; set; }
        public DbSet<Project> TB_M_PROJECT { get; set; }
        public DbSet<Task> TB_M_TASK { get; set; }
        public DbSet<Category> TB_M_CATEGORY { get; set; }
    }
}
