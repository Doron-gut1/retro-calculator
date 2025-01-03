var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        builder => builder
            .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>())
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IRetroService, RetroService>();
builder.Services.AddScoped<ICalculationService, CalculationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();