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

// 🔥 DNB Proxy with proper headers
app.get("/dnb-search", async (req, res) => {
  const { company, country } = req.query;

  const url = "https://www.dnb.com/business-directory/api/cleansematch";

  try {
    const response = await axios.get(url, {
      params: {
        countrycode: country.toLowerCase(),
        location: "",
        searchterm: company,
        streetaddress: ""
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.dnb.com/business-directory/company-search.html",
        "Origin": "https://www.dnb.com",
        "Connection": "keep-alive"
      },
      timeout: 15000
    });

    res.json(response.data);
  } catch (error) {
    console.error("DNB ERROR:", error.response?.status);
    res.status(500).json({
      error: "DNB blocked request",
      status: error.response?.status || "NO_RESPONSE"
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
