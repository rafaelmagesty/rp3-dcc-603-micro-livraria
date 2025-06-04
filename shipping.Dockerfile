# Imagem base derivada do Node
FROM node

# Diretório de trabalho
WORKDIR /app

# Copiar o projeto para dentro do container
COPY . /app

# Instalar dependências
RUN npm install

# Rodar o serviço de shipping
CMD ["node", "/app/services/shipping/index.js"]
