using Microsoft.Extensions.DependencyInjection;

namespace Stashportation.Config {
    public static class MvcConfig {
        public static void ConfigureMvc(this IServiceCollection services) {
            var builder = services.AddMvcCore()
                .AddDataAnnotations();

            builder.AddJsonFormatters(settings => {
                settings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
            });
        }
    }
}
