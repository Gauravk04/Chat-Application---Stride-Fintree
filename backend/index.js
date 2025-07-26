import express from "express";

const app = express();
const PORT = 3200; // Choose only one port

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(PORT, () => {
	console.log(`Server Running on port http://localhost${PORT}`);
});
