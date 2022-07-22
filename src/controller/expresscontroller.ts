import express from 'express';
import routes from '../routes/routes';
const cors = require('cors');
const cfg = require('../../config.json');
const app = express();


export async function initalizeExpress() {
    app.use(express.json());

    app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": true,
        "optionsSuccessStatus": 204
    }));

    app.use("/user", routes);
    const msg = `The app is running on http://localhost:${cfg.serverConfig.port}`;


    app.get("/", async (req, res) => {
        res.status(200).send(msg);
    })

    app.listen(cfg.serverConfig.port,() => {
        console.log(msg);
    }); 
}

module.exports;

