using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Stashportation.Models {
    public class StashSummary {
        public long Id { get; set; }
        [Required(ErrorMessage = "Every stash must have a title")]
        public string Title { get; set; }
        [Required(ErrorMessage = "At least one tag must be specified for a stash")]
        [MaxLength(50, ErrorMessage = "A maximum of 50 tags can be set on a stash")]
        public IList<string> Tags { get; set; }
    }

    public class Stash : StashSummary {
        [Required(ErrorMessage = "Must provide some content in the stash"]
        public string Content { get; set; }
    }
}
