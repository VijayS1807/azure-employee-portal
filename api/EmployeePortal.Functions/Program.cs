using EmployeePortal.Functions.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Isolated Worker model: Functions run in a separate process from the host.
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        var config = context.Configuration;

        // Application Insights: the runtime reads APPLICATIONINSIGHTS_CONNECTION_STRING
        // automatically. This call wires up the .NET worker-side telemetry pipeline.
        services.ConfigureFunctionsApplicationInsights();

        // EF Core → same Azure SQL database as the main API.
        services.AddDbContext<FunctionsDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
    })
    .Build();

host.Run();
