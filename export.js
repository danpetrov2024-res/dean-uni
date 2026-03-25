app.get("/export", async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Users");

    sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Роль", key: "role", width: 20 },
        { header: "ФИО", key: "fio", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Пароль", key: "password", width: 20 }
    ];

    db.all("SELECT * FROM users", [], async (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });

        rows.forEach(row => sheet.addRow(row));

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=users.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    });
});