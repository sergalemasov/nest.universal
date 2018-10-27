const api = 'localhost:4000';
const proxyConfig = {
    "/api": {
        "target": `http://${api}`,
        "changeOrigin": true
    },
};

console.log('***********');
console.log(`* API: ${api}`);
console.log('***********\n');

module.exports = proxyConfig;
