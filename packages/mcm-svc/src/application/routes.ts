/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list (alphabetical ordering) of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * ThitsaWorks
 - Si Thu Myo <sithu.myo@thitsaworks.com>

 --------------
 ******/

"use strict";

import express from "express";
import { ILogger } from "@mojaloop/logging-bc-public-types-lib";
import { IConfigurationClient } from "@mojaloop/platform-configuration-bc-public-types-lib";
import { CertificateAggregate } from "../domain/certificate_agg";
import multer from "multer";

export class ExpressRoutes {
    private _logger: ILogger;
    private _configClient: IConfigurationClient;
    private _certsAgg: CertificateAggregate;

    private _mainRouter = express.Router();

    constructor(
        configClient: IConfigurationClient,
        certsAgg: CertificateAggregate,
        logger: ILogger,
    ) {
        this._configClient = configClient;
        this._logger = logger;
        this._certsAgg = certsAgg;

        const storage = multer.memoryStorage();
        const uploadfile = multer({ storage: storage });

        this._mainRouter.get(
            "/certs/:certId",
            this._certsGetCertificate.bind(this)
        );

        this._mainRouter.post(
            "/certs",
            this._certsStoreCertificate.bind(this)
        );

        this._mainRouter.post(
            "/certs/file",
            uploadfile.single("cert"),
            this._certsStoreFileCertificate.bind(this)
        );

        this._mainRouter.put(
            "/certs/:certId",
            this._certsUpdateCertificate.bind(this)
        );

        this._mainRouter.put(
            "/certs/file/:certId",
            uploadfile.single("cert"),
            this._certsUpdateFileCertificate.bind(this)
        );

    }

    get MainRouter(): express.Router {
        return this._mainRouter;
    }

    private async _certsGetCertificate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        this._logger.debug("Received request to Fetch Public Certificate");
        const certId = req.params.certId;

        try {
            const cert = await this._certsAgg.getCertificate(certId);
            res.status(200).send(cert);
        } catch (error: any) {
            this._logger.error(`Error getting certificate: ${(error as Error).message}`);
            res.status(500).json({
                status: "error",
                msg: (error as Error).message
            });
        }
    }

    private async _certsStoreCertificate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        this._logger.debug(
            "Received request to Store cert uploaded as string"
        );

        const certId = req.body.certId ?? null;
        const cert = req.body.cert;

        try {
            await this._certsAgg.storeCertificate(certId, cert);
            res.status(200).send();
        } catch (error: any) {
            this._logger.error(`Error storing certificate: ${(error as Error).message}`);
            res.status(500).json({
                status: "error",
                msg: (error as Error).message
            });
        }
    }

    private async _certsStoreFileCertificate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        this._logger.debug(
            "Received request to Store cert uploaded as file"
        );

        const certId = req.body.certId ?? null;

        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            const cert = req.file.buffer.toString();

            await this._certsAgg.storeCertificate(certId, cert);
            res.status(200).send();
        } catch (error: any) {
            this._logger.error(`Error storing certificate: ${(error as Error).message}`);
            res.status(500).json({
                status: "error",
                msg: (error as Error).message
            });
        }
    }

    private async _certsUpdateCertificate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        this._logger.debug(
            "Received request to Update cert uploaded as string"
        );

        const certId = req.params.certId ?? null;
        const cert = req.body.cert;

        try {
            await this._certsAgg.updateCertificate(certId, cert);
            res.status(200).send();
        } catch (error: any) {
            this._logger.error(`Error updating certificate: ${(error as Error).message}`);
            res.status(500).json({
                status: "error",
                msg: (error as Error).message
            });
        }
    }

    private async _certsUpdateFileCertificate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        this._logger.debug(
            "Received request to Update cert uploaded as file"
        );

        const certId = req.params.certId ?? null;

        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            const cert = req.file.buffer.toString();

            await this._certsAgg.updateCertificate(certId, cert);
            res.status(200).send();
        } catch (error: any) {
            this._logger.error(`Error updating certificate: ${(error as Error).message}`);
            res.status(500).json({
                status: "error",
                msg: (error as Error).message
            });
        }
    }
}
