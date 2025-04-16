-- CreateTable
CREATE TABLE "bot_configs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "welcomeMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_responses" (
    "id" TEXT NOT NULL,
    "botConfigId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_conversations" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fromCustomer" BOOLEAN NOT NULL,
    "mediaUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bot_configs" ADD CONSTRAINT "bot_configs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_responses" ADD CONSTRAINT "bot_responses_botConfigId_fkey" FOREIGN KEY ("botConfigId") REFERENCES "bot_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_conversations" ADD CONSTRAINT "bot_conversations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_conversations" ADD CONSTRAINT "bot_conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_messages" ADD CONSTRAINT "bot_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "bot_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
