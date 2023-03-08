-- CreateTable
CREATE TABLE "solicitacao" (
    "id" SERIAL NOT NULL,
    "id_sistema" INTEGER NOT NULL,
    "id_dev" INTEGER NOT NULL DEFAULT 0,
    "matricula" INTEGER NOT NULL DEFAULT 0,
    "username" TEXT NOT NULL DEFAULT '',
    "nome" TEXT NOT NULL DEFAULT '',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "tipo" TEXT NOT NULL DEFAULT '',
    "criticidade" TEXT NOT NULL DEFAULT '',
    "resumo" TEXT NOT NULL DEFAULT '',
    "reproduzivel" BOOLEAN NOT NULL DEFAULT true,
    "descricao" VARCHAR(2048) NOT NULL DEFAULT '',
    "sugestao" VARCHAR(2048) NOT NULL DEFAULT '',
    "area" TEXT NOT NULL DEFAULT '',
    "encaminhado" TEXT NOT NULL DEFAULT '',
    "comentarios" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "prioridade" TEXT NOT NULL DEFAULT '',
    "complexidade" TEXT NOT NULL DEFAULT '',
    "resolucao" VARCHAR(2048) NOT NULL DEFAULT '',
    "resolvido_por" TEXT,
    "resolvido_em" TIMESTAMP(3),
    "testado_por" TEXT,
    "testado_em" TIMESTAMP(3),
    "deferido" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "solicitado_diretor" BOOLEAN DEFAULT false,

    CONSTRAINT "solicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacao_historicos" (
    "id" SERIAL NOT NULL,
    "id_solicitacao" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matricula" INTEGER NOT NULL DEFAULT 0,
    "username" TEXT NOT NULL DEFAULT '',
    "nome" TEXT NOT NULL DEFAULT '',
    "descricao" TEXT NOT NULL,

    CONSTRAINT "solicitacao_historicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacao_arquivos" (
    "id" SERIAL NOT NULL,
    "id_solicitacao" INTEGER NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'print',

    CONSTRAINT "solicitacao_arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sistema" (
    "id" SERIAL NOT NULL,
    "id_responsavel" INTEGER,
    "id_reserva" INTEGER,
    "nome" TEXT NOT NULL DEFAULT '',
    "banco" TEXT NOT NULL DEFAULT '',
    "ip" TEXT NOT NULL DEFAULT '',
    "ip_homolog" TEXT DEFAULT '',
    "servidor" TEXT NOT NULL DEFAULT '',
    "tecnologia" TEXT NOT NULL DEFAULT '',
    "observacoes" TEXT DEFAULT '',
    "descricao" TEXT DEFAULT '',
    "ativo" BOOLEAN DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dev" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "dev_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "solicitacao" ADD CONSTRAINT "solicitacao_id_sistema_fkey" FOREIGN KEY ("id_sistema") REFERENCES "sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao" ADD CONSTRAINT "solicitacao_id_dev_fkey" FOREIGN KEY ("id_dev") REFERENCES "dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_historicos" ADD CONSTRAINT "solicitacao_historicos_id_solicitacao_fkey" FOREIGN KEY ("id_solicitacao") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_arquivos" ADD CONSTRAINT "solicitacao_arquivos_id_solicitacao_fkey" FOREIGN KEY ("id_solicitacao") REFERENCES "solicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sistema" ADD CONSTRAINT "sistema_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "dev"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sistema" ADD CONSTRAINT "sistema_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "dev"("id") ON DELETE SET NULL ON UPDATE CASCADE;
