using System.Data;

namespace Stashportation.Database.Migrations {
    public interface IMigration {
        long Version { get; }
        void Up(IDbConnection connection);
        void Down(IDbConnection connection);
    }
}