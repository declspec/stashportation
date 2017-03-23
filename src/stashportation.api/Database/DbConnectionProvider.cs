using System;
using System.Data;

namespace Stashportation.Database {
    public interface IDbConnectionProvider {
        IDbConnection GetConnection();
    }

    public class DbConnectionProvider : IDbConnectionProvider {
        private readonly Func<IDbConnection> _resolver;

        public DbConnectionProvider(Func<IDbConnection> resolver) {
            _resolver = resolver;
        }

        public IDbConnection GetConnection() {
            return _resolver.Invoke();
        }
    }
}
