using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Stashportation.Models {
    public class StashSummary {
        public long Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        [MaxLength(50, ErrorMessage = "A maximum of 50 tags can be set on a stash")]
        public IList<string> Tags { get; set; }
    }

    public class Stash : StashSummary {
        [Required]
        public string Content { get; set; }
    }
}
