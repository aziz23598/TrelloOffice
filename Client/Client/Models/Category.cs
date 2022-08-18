using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Client.Models
{
    public class Category
    {
        [Key]
        [JsonPropertyName("CategoryId")]
        public int CategoryId { get; set; }
        [Required]
        [JsonPropertyName("Name")]
        public string Name { get; set; }
    }
}
