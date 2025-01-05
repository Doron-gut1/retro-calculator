// ... הקוד הקודם נשאר אותו דבר עד לחלק של הקריאה ל-DLL

            // הפעלת החישוב
            _logger.LogInformation("Starting DLL calculation");
            var success = await _calcProcessManager.CalculateRetroAsync(
                odbcName,
                "RetroWeb",
                jobNum,
                1,
                request.PropertyId);

            if (!success)
            {
                _logger.LogError("DLL calculation failed");
                throw new InvalidOperationException("DLL calculation failed");
            }

            _logger.LogInformation("DLL calculation completed successfully");
            return await GetRetroResultsAsync(request.PropertyId, jobNum, odbcName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during retro calculation");
            
            var cleanupCommand = new SqlCommand(
                "DELETE FROM Temparnmforat WHERE jobnum = @jobnum",
                connection);
            cleanupCommand.Parameters.AddWithValue("@jobnum", jobNum);
            await cleanupCommand.ExecuteNonQueryAsync();
            
            throw;
        }
    }