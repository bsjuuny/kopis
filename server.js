import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy API requests to KOPIS
app.use('/api', createProxyMiddleware({
    target: 'https://www.kopis.or.kr/openApi/restful',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying: ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
}));

// Serve static files from dist directory
app.use('/kopis', express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all routes under /kopis
app.get('/kopis/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/kopis/');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/kopis/`);
    console.log(`📡 API proxy: http://localhost:${PORT}/api -> https://www.kopis.or.kr/openApi/restful`);
});
