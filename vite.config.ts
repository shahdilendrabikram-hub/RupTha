import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';
import { defineConfig, Plugin } from 'vite';
import express from 'express';
import { apiRouter } from './src/server/apiRouter';

// Patch http.ServerResponse prototype globally so any Connect / Node response has status and json
if (typeof (http.ServerResponse.prototype as any).status !== 'function') {
  (http.ServerResponse.prototype as any).status = function (code: number) {
    this.statusCode = code;
    return this;
  };
}

if (typeof (http.ServerResponse.prototype as any).json !== 'function') {
  (http.ServerResponse.prototype as any).json = function (data: any) {
    if (!this.headersSent) {
      try {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
      } catch {}
    }
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    this.end(jsonStr);
    return this;
  };
}

if (typeof (http.ServerResponse.prototype as any).send !== 'function') {
  (http.ServerResponse.prototype as any).send = function (data: any) {
    if (typeof data === 'object') {
      return (this as any).json(data);
    }
    this.end(data);
    return this;
  };
}

function expressApiPlugin(): Plugin {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Decorate res methods directly on Node/Connect response
        (res as any).status = function (code: number) {
          this.statusCode = code;
          return this;
        };

        (res as any).json = function (data: any) {
          if (!this.headersSent) {
            try {
              this.setHeader('Content-Type', 'application/json; charset=utf-8');
            } catch {}
          }
          const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
          this.end(jsonStr);
          return this;
        };

        (res as any).send = function (data: any) {
          if (typeof data === 'object') {
            return (this as any).json(data);
          }
          this.end(data);
          return this;
        };

        const url = req.url || '';
        if (url === '/api' || url.startsWith('/api/') || url.startsWith('/api?')) {
          app(req as any, res as any, next);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
