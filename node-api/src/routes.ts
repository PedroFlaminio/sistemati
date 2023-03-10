import { Router } from "express";
import { DevController } from "./controllers/DevController";
import { EmailController } from "./controllers/EmailController";
import { SistemaController } from "./controllers/SistemaController";
import { SolicitacaoController } from "./controllers/SolicitacaoController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import formidableMiddleware from "express-formidable";
import { io } from "./app";
import SeedController from "./controllers/SeedController";

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
router.get("/sistemasAtivos", ensureAuthenticated, SistemaController.listaAtivos);
//SOLICITAÇÕES
router.get("/solicitacoes", ensureAuthenticated, SolicitacaoController.lista);
router.get("/solicitacoesByUser", ensureAuthenticated, SolicitacaoController.listaSolicitacoesByUser);
router.get("/solicitacoesByDev/:matricula", ensureAuthenticated, SolicitacaoController.listaSolicitacoesByDev);
router.get("/solicitacoesPendentes", ensureAuthenticated, SolicitacaoController.listaSolicitacoesPendentes);
router.get("/solicitacoesAguardando", ensureAuthenticated, SolicitacaoController.listaSolicitacoesAguardando);
router.get("/solicitacoesResolvidas", ensureAuthenticated, SolicitacaoController.listaSolicitacoesResolvidas);

router.post("/solicitacoes", ensureAuthenticated, formidableMiddleware(), SolicitacaoController.insere);
router.put("/solicitacoes", ensureAuthenticated, formidableMiddleware(), SolicitacaoController.atualiza);

router.put("/solicitacoes/encaminhar", ensureAuthenticated, SolicitacaoController.encaminha);
router.put("/solicitacoes/aprovar/:id", ensureAuthenticated, SolicitacaoController.aprova);
router.get("/solicitacoes/:id", ensureAuthenticated, SolicitacaoController.getById);
router.get("/solicitacoes/cancelar/:id", ensureAuthenticated, SolicitacaoController.cancelar);
router.delete("/solicitacoes", ensureAuthenticated, SolicitacaoController.deleta);
router.get("/arquivos/:id", SolicitacaoController.getArquivo);
router.get("/prints/:id", SolicitacaoController.getPrint);
router.get("/foto/:matricula", SolicitacaoController.getFoto);
router.get("/seed", SeedController.seed);
//ENVIAR EMAIL
router.post("/email", EmailController.enviaEmail);
router.get("/clock", (req, res) => {
  const date = new Date();
  console.log(date);
  return res.status(200).json(date);
});
router.get("/novaSolicitacao", (req, res) => {
  io
    //
    .of("/sistemati-api/io")
    .emit("solicitacoes", "novaSolicitacao");
  return res.status(200).send("novaSolicitacao");
});
router.get("/usuarisse", (req, res) => {
  io.emit("solicitacoes", "usuarisse");
  return res.status(200).send("usuarisse");
});
router.get("/nabuco", (req, res) => {
  io.emit("solicitacoes", "nabuco");
  return res.status(200).send("nabuco");
});

export { router };
