const db = require('../database/db');

const getAllProducts = async () => {
    return await db.delayReadData();
};

const getProductById = async (id) => {
    const products = await db.delayReadData();
    return products.find(product => product.id == id);
};

const createProduct = async (productData) => {
    const products = await db.readData();
    const newProduct = {
        id: Date.now().toString(),
        ...productData
    };
    products.push(newProduct);
    await db.writeData(products);
    return newProduct;
};

const updateProduct = async (id, updateData) => {
    const products = await db.readData();
    const index = products.findIndex(product => product.id == id);
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updateData };
    await db.writeData(products);
    return products[index];
};

const deleteProduct = async (id) => {
    let products = await db.readData();
    const initialLength = products.length;
    products = products.filter(product => product.id != id);
    
    if (products.length === initialLength) return false;
    
    await db.writeData(products);
    return true;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
