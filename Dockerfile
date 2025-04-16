# Usa a imagem mais recente do Ubuntu
FROM ubuntu:latest

# Define diretório padrão
WORKDIR /app

# Define modo não interativo (evita travar na instalação)
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências básicas e Node.js 20
RUN apt update && apt upgrade -y && \
    apt install -y curl gnupg2 ca-certificates git build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs

# Exponha a porta do NestJS
EXPOSE 3000

