const axios = require("axios");

const axiosSpaceX = axios.create({
  baseURL: process.env.SPACEX_API,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosSpaceX;
