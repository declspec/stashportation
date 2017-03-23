using Microsoft.Extensions.DependencyInjection;

namespace Stashportation.Config {
    public static class MvcConfig {
        public static void ConfigureMvc(this IServiceCollection services) {
            var builder = services.AddMvcCore();

            builder.AddMvcOptions(opts => {
                var jsonFormatter = new Microsoft.AspNetCore.Mvc.Formatters.JsonOutputFormatter()
            });
        }
    }
}
