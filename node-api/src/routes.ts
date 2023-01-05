import { Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { DevController } from "./controllers/DevController";
import { SistemaController } from "./controllers/SistemaController";
import { SolicitacaoController } from "./controllers/SolicitacaoController";

import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();
//AUTH
router.post("/signin", ensureAuthenticated, AuthController.signin);
//DEVS
router.get("/devs", ensureAuthenticated, DevController.lista);
router.post("/devs", ensureAuthenticated, DevController.insere);
router.put("/devs", ensureAuthenticated, DevController.atualiza);
//SISTEMAS
router.get("/sistemas", ensureAuthenticated, SistemaController.lista);
router.post("/sistemas", ensureAuthenticated, SistemaController.insere);
router.put("/sistemas", ensureAuthenticated, SistemaController.atualiza);
//SISTEMAS
router.get("/solicitacoes", ensureAuthenticated, SolicitacaoController.lista);
router.post("/solicitacoes", ensureAuthenticated, SolicitacaoController.insere);
router.put("/solicitacoes", ensureAuthenticated, SolicitacaoController.atualiza);

export { router };
