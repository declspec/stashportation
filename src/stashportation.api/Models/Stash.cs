using System.Collections.Generic;

namespace Stashportation.Models {
    public class StashSummary {
        public long Id { get; set; }
        public string Title { get; set; }
        public IList<string> Tags { get; set; }
    }

    public class Stash : StashSummary {
        public string Content { get; set; }
    }
}
