    private async Task<DataTable> GetRetroResultsDataTableAsync(
        string propertyId,
        int jobNum,
        SqlConnection connection)
    {
        var dt = new DataTable();
        using var command = new SqlCommand(@"
            SELECT 
                t.*,
                dbo.mntname(t.mnt) as mnt_display,
                s.sugtsname,
                m.fullname as payer_name,
                m.maintz as payer_id
            FROM Temparnmforat t
            LEFT JOIN sugts s ON t.sugts = s.sugts
            LEFT JOIN msp m ON t.mspkod = m.mspkod
            WHERE t.hs = @propertyId
            AND t.jobnum = @jobNum
            AND (ISNULL(t.paysum, 0) <> 0 OR ISNULL(t.sumhan, 0) <> 0)
            ORDER BY t.mnt, t.hdtme, t.IsNewCalculation, t.hnckod", connection);

        command.Parameters.AddWithValue("@propertyId", propertyId);
        command.Parameters.AddWithValue("@jobNum", jobNum);

        using var adapter = new SqlDataAdapter(command);
        await Task.Run(() => adapter.Fill(dt));

        return dt;
    }