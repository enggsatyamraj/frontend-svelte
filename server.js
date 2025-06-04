import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Serve static files with proper MIME types
app.use('/assets', express.static(join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Serve public static files
app.use(express.static(join(__dirname, 'public')));

// Middleware to log requests
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    next();
});

// Handle SPA routes
app.get('/*', (req, res) => {
    // Don't serve index.html for asset requests
    if (req.url.startsWith('/assets/')) {
        res.status(404).send('Not found');
        return;
    }
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
