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

// Add CORS
builder.Services.AddCors(options =>
{
    var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>();
    options.AddPolicy("ReactApp",
        policyBuilder => policyBuilder
            .WithOrigins(origins ?? Array.Empty<string>())
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Register services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IRetroService, RetroService>();
builder.Services.AddScoped<ICalculationService, CalculationService>();
builder.Services.AddSingleton<IRetroCalculationDllFactory, RetroCalculationDllFactory>();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RetroCalculator API V1");
    c.RoutePrefix = string.Empty; // This makes Swagger UI the root page
});

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();