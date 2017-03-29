using Microsoft.AspNetCore.Hosting;
using System.Runtime.InteropServices;

namespace Stashportation {
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Startup>();

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                builder.UseIISIntegration();

            var host = builder.Build();
            host.Run();
        }
    }
}
