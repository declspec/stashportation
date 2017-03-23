using System;

namespace Stashportation.Database.Entities {
    public class StashEntity
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string SerializedTags { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
