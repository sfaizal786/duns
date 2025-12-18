const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 THIS ROUTE MUST EXIST
app.get("/dnb-search", async (req, res) => {
  const { company, country } = req.query;

  if (!company || !country) {
    return res.status(400).json({ error: "Missing params" });
  }

  try {
    const response = await axios.get(
      "https://www.dnb.com/business-directory/api/cleansematch",
      {
        params: {
          countrycode: country.toLowerCase(),
          location: "",
          searchterm: company,
          streetaddress: ""
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer":
            "https://www.dnb.com/business-directory/company-search.html",
          "Origin": "https://www.dnb.com"
        },
        timeout: 15000
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("DNB ERROR:", err.message);
    res.status(500).json({
      error: "DNB request failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
