using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using EmployeePortal.Functions.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Isolated Worker model: Functions run in a separate process from the host.
var host = new HostBuilder()
    // Layer Key Vault on top of the built-in configuration sources.
    // In Azure: KeyVault__Uri app setting + Managed Identity → pulls secrets.
    // Locally: KeyVault__Uri is empty in local.settings.json → skipped.
    .ConfigureAppConfiguration((context, configBuilder) =>
    {
        var config = configBuilder.Build();
        var kvUri = config["KeyVault:Uri"];
        if (!string.IsNullOrEmpty(kvUri))
        {
            configBuilder.AddAzureKeyVault(new Uri(kvUri), new DefaultAzureCredential());
        }
    })
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        var config = context.Configuration;
        services.AddDbContext<FunctionsDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
    })
    .Build();

host.Run();
