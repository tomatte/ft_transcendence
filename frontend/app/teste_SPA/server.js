const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

// app.get("/*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
// });
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "teste_SPA", "index.html"));
});

--// app.get("/", (req, res) => {
const port = process.env.PORT || 5060; // Definindo a porta padrão como 3000, caso não seja especificada via variável de ambiente

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
