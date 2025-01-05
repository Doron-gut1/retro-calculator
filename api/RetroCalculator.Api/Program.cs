using RetroCalculator.Api.Services;
using RetroCalculator.Api.Services.Implementations;
using RetroCalculator.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "RetroCalculator API", Version = "v1" });
});

// Add health checks
builder.Services.AddHealthChecks();

// Add CORS with multiple origins support
builder.Services.AddCors(options =>
{
    var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>();
    options.AddPolicy("ReactApp",
        policyBuilder => policyBuilder
            .WithOrigins(origins ?? new[] { "http://localhost:5173", "http://localhost:3000" })
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Register services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IRetroService, RetroService>();
builder.Services.AddScoped<ICalcProcessManager, CalcProcessManager>();

var app = builder.Build();

// Basic diagnostics route
app.MapGet("/", () => "RetroCalculator API is running");
app.MapHealthChecks("/health");

// Swagger UI at /swagger instead of root
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RetroCalculator API V1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();