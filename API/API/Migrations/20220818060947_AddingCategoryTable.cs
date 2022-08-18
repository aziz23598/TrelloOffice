using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddingCategoryTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "TB_M_TASK",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TB_M_CATEGORY",
                columns: table => new
                {
                    CategoryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_M_CATEGORY", x => x.CategoryId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TB_M_TASK_CategoryId",
                table: "TB_M_TASK",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_M_TASK_TB_M_CATEGORY_CategoryId",
                table: "TB_M_TASK",
                column: "CategoryId",
                principalTable: "TB_M_CATEGORY",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_M_TASK_TB_M_CATEGORY_CategoryId",
                table: "TB_M_TASK");

            migrationBuilder.DropTable(
                name: "TB_M_CATEGORY");

            migrationBuilder.DropIndex(
                name: "IX_TB_M_TASK_CategoryId",
                table: "TB_M_TASK");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "TB_M_TASK");
        }
    }
}
