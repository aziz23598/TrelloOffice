using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Client.Models
{
    public class TaskUser
    {
        [Key]
        [JsonPropertyName("TaskUserId")]
        public int TaskUserId { get; set; }

        public TaskVM Task { get; set; }
        [Required]
        [ForeignKey("TaskId")]
        [JsonPropertyName("TaskId")]
        public int TaskId { get; set; }

        public User User { get; set; }
        [Required]
        [ForeignKey("UserId")]
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }
    }
}
