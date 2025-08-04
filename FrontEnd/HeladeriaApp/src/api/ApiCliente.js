import axios from "axios";

// Configura la URL base y los headers
const apiClient = axios.create({
  baseURL: "https://localhost:7266/api", // Coloca aquí la URL base de tu API
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiClient;


//https://localhost:7266/api DEVELOPMENT
// http://localhost:8088/api PRODUCTION