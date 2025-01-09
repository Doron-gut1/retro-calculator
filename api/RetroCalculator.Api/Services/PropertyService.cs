using System.Data;
using System.Data.SqlClient;
using RetroCalculator.Api.Models;

namespace RetroCalculator.Api.Services
{
    public class PropertyService : IPropertyService
    {
        private string _connectionString;
        
        public void SetConnectionString(string odbcName)
        {
            _connectionString = $"DSN={odbcName};";
        }

        public async Task<PropertyDto> GetPropertyAsync(string id, string odbcName)
        {
            SetConnectionString(odbcName);
            
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var propertyCommand = new SqlCommand("GetPropertyDetails", connection);
            propertyCommand.CommandType = CommandType.StoredProcedure;
            propertyCommand.Parameters.AddWithValue("@hskod", id);
            
            using var reader = await propertyCommand.ExecuteReaderAsync();
            if (!(await reader.ReadAsync()))
            {
                throw new KeyNotFoundException($"Property {id} not found");
            }
            
            // השאר נשאר אותו דבר
            return new PropertyDto
            {
                PropertyId = reader["hskod"].ToString(),
                PayerId = Convert.ToInt32(reader["mspkod"]),
                PayerNumber = reader["maintz"].ToString(),
                PayerName = reader["fullname"].ToString(),
                Size1 = reader["godel"] != DBNull.Value ? Convert.ToDecimal(reader["godel"]) : 0,
                Tariff1 = reader["mas"] != DBNull.Value ? Convert.ToInt32(reader["mas"]) : 0,
                Size2 = reader["gdl2"] != DBNull.Value ? Convert.ToDecimal(reader["gdl2"]) : 0,
                Tariff2 = reader["mas2"] != DBNull.Value ? Convert.ToInt32(reader["mas2"]) : 0,
                Size3 = reader["gdl3"] != DBNull.Value ? Convert.ToDecimal(reader["gdl3"]) : 0,
                Tariff3 = reader["mas3"] != DBNull.Value ? Convert.ToInt32(reader["mas3"]) : 0,
                Size4 = reader["gdl4"] != DBNull.Value ? Convert.ToDecimal(reader["gdl4"]) : 0,
                Tariff4 = reader["mas4"] != DBNull.Value ? Convert.ToInt32(reader["mas4"]) : 0,
                Size5 = reader["gdl5"] != DBNull.Value ? Convert.ToDecimal(reader["gdl5"]) : 0,
                Tariff5 = reader["mas5"] != DBNull.Value ? Convert.ToInt32(reader["mas5"]) : 0,
                Size6 = reader["gdl6"] != DBNull.Value ? Convert.ToDecimal(reader["gdl6"]) : 0,
                Tariff6 = reader["mas6"] != DBNull.Value ? Convert.ToInt32(reader["mas6"]) : 0,
                Size7 = reader["gdl7"] != DBNull.Value ? Convert.ToDecimal(reader["gdl7"]) : 0,
                Tariff7 = reader["mas7"] != DBNull.Value ? Convert.ToInt32(reader["mas7"]) : 0,
                Size8 = reader["gdl8"] != DBNull.Value ? Convert.ToDecimal(reader["gdl8"]) : 0,
                Tariff8 = reader["mas8"] != DBNull.Value ? Convert.ToInt32(reader["mas8"]) : 0,
                ValidFrom = reader["valdate"] != DBNull.Value ? Convert.ToDateTime(reader["valdate"]) : null,
                ValidTo = reader["valdatesof"] != DBNull.Value ? Convert.ToDateTime(reader["valdatesof"]) : null
            };
        }
    }
}