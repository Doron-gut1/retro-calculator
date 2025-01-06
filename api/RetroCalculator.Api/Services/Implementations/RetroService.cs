    public async Task<bool> CalculateRetroAsync(
        RetroCalculationRequest request,
        string odbcName)
    {
        _logger.LogInformation(
            "Starting retro calculation for property {PropertyId}",
            request.PropertyId);

        using var connection = await GetConnectionAsync(odbcName);
        
        // Get property and payer details
        using var propertyCommand = new SqlCommand(
            "SELECT h.mspkod FROM hs h WHERE h.hskod = @hskod", 
            connection);
        propertyCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
        var mspkod = await propertyCommand.ExecuteScalarAsync() as int?;

        if (!mspkod.HasValue)
        {
            throw new InvalidOperationException($"Property {request.PropertyId} not found");
        }

        // המשך הקוד הקיים, אבל נשתמש ב-mspkod שקיבלנו
        var jobNum = new Random().Next(1000000, 9999999);

        try
        {
            // Check if property is locked
            using var lockCheckCommand = new SqlCommand(
                "SELECT 1 FROM Temparnmforat WHERE hs = @hskod AND moneln <> 0", connection);
            lockCheckCommand.Parameters.AddWithValue("@hskod", request.PropertyId);
            var isLocked = await lockCheckCommand.ExecuteScalarAsync() != null;

            if (isLocked)
            {
                throw new InvalidOperationException("Property is locked by another process");
            }

            await CleanupTempData(connection, request.PropertyId, jobNum);

            // Insert initial data with correct mspkod
            using var insertCommand = new SqlCommand(@"
                INSERT INTO Temparnmforat (
                    hs, mspkod, sugts, 
                    gdl1, trf1, gdl2, trf2, gdl3, trf3, gdl4, trf4,
                    gdl5, trf5, gdl6, trf6, gdl7, trf7, gdl8, trf8,
                    hdtme, hdtad, jobnum, valdate, valdatesof, hkarn
                ) VALUES (
                    @hs, @mspkod, @sugts,
                    @gdl1, @trf1, @gdl2, @trf2, @gdl3, @trf3, @gdl4, @trf4,
                    @gdl5, @trf5, @gdl6, @trf6, @gdl7, @trf7, @gdl8, @trf8,
                    @hdtme, @hdtad, @jobnum, @valdate, @valdatesof, @hkarn
                )", connection);

            insertCommand.Parameters.AddWithValue("@hs", request.PropertyId);
            insertCommand.Parameters.AddWithValue("@mspkod", mspkod.Value);  // שימוש ב-mspkod שקיבלנו
            insertCommand.Parameters.AddWithValue("@sugts", 1010);
            insertCommand.Parameters.AddWithValue("@hdtme", request.StartDate);
            insertCommand.Parameters.AddWithValue("@hdtad", request.EndDate);
            insertCommand.Parameters.AddWithValue("@jobnum", jobNum);
            insertCommand.Parameters.AddWithValue("@valdate", DBNull.Value);
            insertCommand.Parameters.AddWithValue("@valdatesof", DBNull.Value);
            insertCommand.Parameters.AddWithValue("@hkarn", request.Hkarn);

            // המשך הקוד כרגיל...
        }