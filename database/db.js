const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'server.json');

const readData = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const delayReadData = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
    return await readData();
};

const writeData = async (data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = {
    readData,
    delayReadData,
    writeData
};
