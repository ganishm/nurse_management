const express = require("express");
const cors = require("cors");
const nurseRoutes = require("./route/route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", nurseRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});