import { procesarSolicitud } from "../src/Infraestructure/Adapters/rpc_servidor";

describe("test procesarSolicitud function", () => {
    it("should return 'Solicitud procesada: hola' for procesarSolicitud(hola)", () => {
      expect(procesarSolicitud("hola")).toBe("Solicitud procesada: hola");
    });
  });