using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Stashportation.Config;
using Stashportation.Database.Repositories;
using Stashportation.Services;

namespace Stashportation {
    public class Startup {
        public IConfiguration Configuration { get; }

        public Startup() {
            Configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
        }

        public void ConfigureServices(IServiceCollection services) {
            services.ConfigureDatabase(Configuration);

            services.AddSingleton<ITagRepository, TagRepository>();
            services.AddSingleton<IStashRepository, StashRepository>();

            services.AddSingleton<IStashService, StashService>();

            services.ConfigureMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseMvc(routes => {

            });
        }
    }
}
