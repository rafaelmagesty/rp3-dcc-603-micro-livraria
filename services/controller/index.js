// Arquivo: services/controller/index.js

const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const PORT = process.env.PORT || 3000;

// Carrega o .proto de Inventory
const inventoryPackageDef = protoLoader.loadSync(
    __dirname + '/../../proto/inventory.proto'
);
const inventoryProto = grpc.loadPackageDefinition(inventoryPackageDef).inventory;

// Cria stub para o InventoryService apontando para o servidor gRPC
const inventoryClient = new inventoryProto.InventoryService(
    'localhost:50052', grpc.credentials.createInsecure()
);

// ===========================================================================
// Rota já existente para listar todos os produtos (SearchAllProducts)
app.get('/products', (req, res, next) => {
    inventoryClient.SearchAllProducts({}, (err, response) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'algo deu errado ao buscar todos os produtos' });
        } else {
            // response.products é um array de objetos ProductResponse
            res.json(response.products);
        }
    });
});

// Rota já existente para calcular frete (Shipping)
// Obs.: este trecho já estava no repositório original e não muda aqui
app.get('/shipping/:cep', (req, res, next) => {
    // (implementação do shipping...)
    // Exemplo de chamada ao serviço de frete via gRPC:
    // shippingClient.GetShippingRate({ cep: req.params.cep }, (err, shippingResponse) => {
    //     if (err) { ... }
    //     else { res.json(shippingResponse); }
    // });
});

// ===========================================================================
// >>> NOVA ROTA: busca produto pelo ID (SearchProductByID)
app.get('/product/:id', (req, res, next) => {
    // Converte o parâmetro de rota (string) para inteiro
    const id = parseInt(req.params.id, 10);

    // Chama o método gRPC SearchProductByID com Payload = { id: <valor> }
    inventoryClient.SearchProductByID({ id: id }, (err, product) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'algo deu errado ao buscar produto por ID' });
        } else {
            // product é um objeto ProductResponse ou {}
            res.json(product);
        }
    });
});

// ===========================================================================
// Inicialização do servidor HTTP do Controller
app.listen(PORT, () => {
    console.log(`Controller rodando em http://localhost:${PORT}`);
});
