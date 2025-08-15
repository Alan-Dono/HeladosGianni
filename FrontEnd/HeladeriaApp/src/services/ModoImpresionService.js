import apiClient from "../api/ApiCliente";

const ModoImpresionService = {
  obtenerModoImpresion: async () => {
    try {
      const response = await apiClient.get("/ventas/modo-impresion");
      return response.data.modo;
    } catch (error) {
      console.error("Error obteniendo modo impresión:", error);
      return 0; // Valor por defecto
    }
  },

  cambiarModoImpresion: async (modo) => {
    try {
      await apiClient.post(`/ventas/cambiar-modo-impresion/${modo}`);
      return true;
    } catch (error) {
      console.error("Error cambiando modo impresión:", error);
      return false;
    }
  }
};

export default ModoImpresionService;