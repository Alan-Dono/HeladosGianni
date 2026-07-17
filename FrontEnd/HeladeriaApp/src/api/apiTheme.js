import apiClient from "./ApiCliente";

// Guardar configuración del tema
export const guardarConfiguracionTema = async (configuracion) => {
  console.log("Configuración a guardar:", configuracion);

  try {
    // Validar que tengamos la estructura correcta
    if (!configuracion || !configuracion.colors) {
      throw new Error("Configuración inválida: se requiere el campo colors");
    }

    // Hacer POST al endpoint
    const response = await apiClient.post("/theme", {
      colors: configuracion.colors,
    });

    console.log("Configuración guardada exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error guardando configuración de tema:", error);

    // Proporcionar más información del error
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.message || "Error desconocido"
        }`
      );
    } else if (error.request) {
      throw new Error("Error de conexión: No se pudo conectar con el servidor");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Obtener configuración del tema
export const obtenerConfiguracionTema = async () => {
  try {
    console.log("Obteniendo configuración de tema...");

    const response = await apiClient.get("/theme");

    console.log("Configuración obtenida:", response.data);

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data) {
      console.log("No hay configuración guardada, usando defaults");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error obteniendo configuración de tema:", error);

    // Si es un error 404, significa que no hay configuración guardada
    if (error.response && error.response.status === 404) {
      console.log("No se encontró configuración personalizada");
      return null;
    }

    // Para otros errores, lanzar excepción
    if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Error de conexión");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Restablecer tema por defecto
export const restablecerTemaPorDefecto = async () => {
  try {
    console.log("Restableciendo tema por defecto...");

    const response = await apiClient.post("/theme/reset");

    console.log("Tema restablecido exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error restableciendo tema por defecto:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.message || "Error desconocido"
        }`
      );
    } else if (error.request) {
      throw new Error("Error de conexión: No se pudo conectar con el servidor");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Función auxiliar para validar la estructura de configuración
export const validarConfiguracionTema = (configuracion) => {
  if (!configuracion || typeof configuracion !== "object") {
    return {valido: false, error: "Configuración debe ser un objeto"};
  }

  if (!configuracion.colors) {
    return {valido: false, error: "Se requiere el campo colors"};
  }

  try {
    // Si colors es string, verificar que sea JSON válido
    if (typeof configuracion.colors === "string") {
      JSON.parse(configuracion.colors);
    }

    return {valido: true};
  } catch (error) {
    return {valido: false, error: "Campo colors debe ser JSON válido"};
  }
};

// Función para obtener configuración por defecto del servidor
export const obtenerConfiguracionPorDefecto = async () => {
  try {
    console.log("Obteniendo configuración por defecto del servidor...");

    const response = await apiClient.get("/theme/default");

    console.log("Configuración por defecto obtenida:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo configuración por defecto:", error);

    // Si no se puede obtener del servidor, devolver configuración hardcodeada
    return {
      colors: JSON.stringify({
        light: {
          Primary: "#2f27ce",
          Secondary: "#dddbff",
          Background: "#fbfbfe",
          Paper: "#ffffff",
          Componentes: "#443dff",
          TextPrimary: "#050316",
          TextSecondary: "#050316",
          Glow: "#b0adff",
        },
        dark: {
          Primary: "#e35305",
          Secondary: "#050bba",
          Background: "#020b09",
          Paper: "#0a1210",
          Componentes: "#4403bf",
          TextPrimary: "#e0f8f4",
          TextSecondary: "#b8d6d2",
          Glow: "#5a4dff",
          GrayAccent: "#3a3a3a",
        },
      }),
    };
  }
};
