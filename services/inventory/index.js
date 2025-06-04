// Arquivo: services/inventory/index.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Carrega o .proto de Inventory (caminho relativo ao diretório onde este arquivo está)
const packageDefinition = protoLoader.loadSync(
    __dirname + '/../../proto/inventory.proto'
);
const inventoryProto = grpc.loadPackageDefinition(packageDefinition).inventory;

// Lista de produtos (JSON estático)
const products = require('./products.json');

function SearchAllProducts(call, callback) {
    // Retorna todos os produtos no formato esperado (ProductsResponse)
    callback(null, { products: products });
}

function SearchProductByID(call, callback) {
    // Extrai o ID enviado pelo cliente: call.request.id
    const idBuscado = call.request.id;
    // Busca no array products o objeto cujo product.id == idBuscado
    const produtoEncontrado = products.find((product) => product.id === idBuscado);
    // Retorna o produto encontrado ou, se não existir, um objeto vazio
    callback(null, produtoEncontrado || {});
}

function main() {
    const server = new grpc.Server();

    // Registra o serviço e as implementações das funções
    server.addService(inventoryProto.InventoryService.service, {
        SearchAllProducts: SearchAllProducts,
        SearchProductByID: SearchProductByID
    });

    // Sobe o servidor gRPC na porta 50052 (pode ser alterada se desejar)
    server.bindAsync(
        '0.0.0.0:50052',
        grpc.ServerCredentials.createInsecure(),
        () => {
            server.start();
            console.log('Inventory service rodando em 0.0.0.0:50052');
        }
    );
}

main();
