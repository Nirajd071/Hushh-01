import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);
let initialized = false;

async function init() {
    if (initialized) return;
    await registerRoutes(httpServer, app);
    initialized = true;
}

export default async function handler(req: any, res: any) {
    await init();
    app(req, res);
}
