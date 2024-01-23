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
import { CertificateAggregate } from "@mojaloop/cert-management-bc-domain-lib";

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

        this._mainRouter.get(
            "/certs",
            this._certsListCertificates.bind(this)
        );

        this._mainRouter.get(
            "/certs/:certId",
            this._certsGetCertificate.bind(this)
        );
    }

    get MainRouter(): express.Router {
        return this._mainRouter;
    }

    private async _certsListCertificates(
        req: express.Request,
        res: express.Response,
    ): Promise<void> {
        this._logger.debug("Received request to List Certificates");

        try {
            const certs = await this._certsAgg.listCertificates();
            res.status(200).send(certs);
        } catch (error: unknown) {
            this._logger.error(`Error listing certificates: ${(error as Error).message}`);
            res.status(500).json({
                status: "error",
                msg: (error as Error).message
            });
        }
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
        } catch (error: unknown) {
            this._logger.error(`Error getting certificate: ${(error as Error).message}`);
            res.status(404).json({
                status: "error",
                msg: (error as Error).message
            });
        }
    }
}
