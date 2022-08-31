using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Client.Models
{
    public class TaskVM
    {
        [Key]
        [JsonPropertyName("TaskId")]
        public int TaskId { get; set; }

        [Required]
        [ForeignKey("Project")]
        [JsonPropertyName("ProjectId")]
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        [Required]
        [ForeignKey("Category")]
        [JsonPropertyName("CategoryId")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        [Required]
        [JsonPropertyName("Name")]
        public string Name { get; set; }

        [Required]
        [JsonPropertyName("Description")]
        public string Description { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        [JsonPropertyName("DueDate")]
        public string DueDate { get; set; }

        [Required]
        [JsonPropertyName("IsCompleted")]
        public bool IsCompleted { get; set; }
    }
}
