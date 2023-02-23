import { Router } from "express";
import { DevController } from "./controllers/DevController";
import { EmailController } from "./controllers/EmailController";
import { SistemaController } from "./controllers/SistemaController";
import { SolicitacaoController } from "./controllers/SolicitacaoController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import formidableMiddleware from "express-formidable";

const router = Router();
//DEVS
router.get("/devs", ensureAuthenticated, DevController.lista);
router.post("/devs", ensureAuthenticated, DevController.insere);
router.put("/devs", ensureAuthenticated, DevController.atualiza);
router.delete("/devs/:id", ensureAuthenticated, DevController.deleta);
router.get("/devsAtivos", ensureAuthenticated, DevController.listaAtivos);
//SISTEMAS
router.get("/sistemas", ensureAuthenticated, SistemaController.lista);
router.post("/sistemas", ensureAuthenticated, SistemaController.insere);
router.put("/sistemas", ensureAuthenticated, SistemaController.atualiza);
router.put("/sistemas", ensureAuthenticated, SistemaController.atualiza);
router.put("/sistemasAtivos", ensureAuthenticated, SistemaController.listaAtivos);
//SOLICITAÇÕES
router.get("/solicitacoes/:id", ensureAuthenticated, SolicitacaoController.getById);
router.get("/solicitacoes", ensureAuthenticated, SolicitacaoController.listaSolicitacoesPendentes);
router.get("/solicitacoesByUser", ensureAuthenticated, SolicitacaoController.listaSolicitacoesByUser);
router.get("/solicitacoesResolvidas", ensureAuthenticated, SolicitacaoController.listaSolicitacoesResolvidas);
router.get("/solicitacoes/cancelar/:id", ensureAuthenticated, SolicitacaoController.cancelar);
router.post("/solicitacoes", ensureAuthenticated, formidableMiddleware(), SolicitacaoController.insere);
router.put("/solicitacoes", ensureAuthenticated, formidableMiddleware(), SolicitacaoController.atualiza);
router.delete("/solicitacoes", ensureAuthenticated, SolicitacaoController.deleta);
router.get("/arquivos/:id", SolicitacaoController.getArquivo);
router.get("/foto/:matricula", SolicitacaoController.getFoto);
//ENVIAR EMAIL
router.post("/email", EmailController.enviaEmail);
router.get("/clock", (req, res) => {
  const date = new Date();
  console.log(date);
  return res.status(200).json(date);
});

export { router };
