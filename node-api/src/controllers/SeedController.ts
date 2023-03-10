import { Request, Response } from "express";
import seed from "../../seed.json";
import prismaClient from "../prisma";
import { DevService } from "../service/DevService";
import { SistemaService } from "../service/SistemaService";

const SeedController = {
  seed: async (request: Request, response: Response) => {
    try {
      let result = true;

      const devs = await prismaClient.dev.createMany({ data: [...seed.devs] });
      //const sistemas = await prismaClient.sistema.createMany({ data: [...seed.sistemas] });
      // seed.devs.forEach(async (dev) => {
      //   await DevService.insereDev(dev);
      // });
      seed.sistemas.forEach(async (sistema) => {
        await SistemaService.insereSistema(sistema);
      });

      if (result) return response.status(200).json({ message: "Sucesso" });
      else return response.status(400).json({ message: "Erro" });
    } catch (err) {
      return response.status(400).json({ message: "Erro" });
    }
  },
};

export default SeedController;
