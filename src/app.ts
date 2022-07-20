import express from 'express';
import {Pool, PoolClient} from 'pg';
import routes from './routes/routes';
import jwt from 'jsonwebtoken';

const cors = require('cors');
const cfg = require('../config.json');
const app = express();

const dbprops = cfg.dbConfig;
app.use(express.json())
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": true,
    "optionsSuccessStatus": 204
  }));
app.use("/user", routes);
const pool = new Pool(dbprops)
const msg = `The app is running on http://localhost:${cfg.serverConfig.port}`;


app.get("/", async (req, res) => {
    res.status(200).send(msg);
})

app.listen(cfg.serverConfig.port,() => {
    console.log(msg);
});