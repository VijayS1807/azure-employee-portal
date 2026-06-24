using EmployeePortal.Functions.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Isolated Worker model: Functions run in a separate process from the host.
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureFunctionsApplicationInsights()
    .ConfigureServices((context, services) =>
    {
        var config = context.Configuration;

        services.AddDbContext<FunctionsDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
    })
    .Build();

host.Run();
