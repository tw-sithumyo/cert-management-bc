
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

import { ILogger } from "@mojaloop/logging-bc-public-types-lib";
import { IConfigurationClient } from "@mojaloop/platform-configuration-bc-public-types-lib";
import { IMessageProducer } from "@mojaloop/platform-shared-lib-messaging-types-lib";
import path from "path";
import fs from "fs";
import {
    CertDirCreateError,
    CertIDInvalidError,
    CertReadingError,
    CertStoringError,
} from "./errors";

const CERTS_DIR = path.join(__dirname, "..", "certs");

export class CertificateAggregate {
    private _logger: ILogger;
    private _configClient: IConfigurationClient;
    private _messageProducer: IMessageProducer;

    constructor(
        configClient: IConfigurationClient,
        messageProducer: IMessageProducer,
        logger: ILogger
    ) {
        this._configClient = configClient;
        this._messageProducer = messageProducer;
        this._logger = logger.createChild(this.constructor.name);
    }

    async init(): Promise<void> {
        try {
            await fs.promises.mkdir(CERTS_DIR, { recursive: true });
            this._messageProducer.connect();
        } catch (error: any) {
            const errMsg = `CERTS_DIR '${CERTS_DIR}; create error: ${(error as Error).message}`;
            this._logger.error(errMsg);
            throw new CertDirCreateError(errMsg);
        }
    }

    private _validateCertId(certId: string): boolean {
        // sanitize the input
        if (!certId) {
            return false;
        }
        // Example validation: ensure certId is
        return /^[a-zA-Z0-9-_]{3,30}$/.test(certId);
    }

    public async getCertificate(certId: string): Promise<string> {
        if (!this._validateCertId(certId)) {
            const errMsg = `Invalid certificate ID '${certId}': allow only alphanumerical, hyphen and underscore`;
            this._logger.error(errMsg);
            throw new CertIDInvalidError(errMsg);
        }
        try {
            const filePath = path.join(CERTS_DIR, `${certId}.pem`);
            const cert = await fs.promises.readFile(filePath, "utf8");
            return cert;
        } catch (error: any) {
            const errMsg = `Error Certificate Not Found: '${certId}'`;
            this._logger.error(errMsg);
            throw new CertReadingError(errMsg);
        }
    }

    public async storeCertificate(certId: string, cert: string): Promise<void> {
        if (!this._validateCertId(certId)) {
            const errMsg = `Invalid certificate ID: ${certId}`;
            this._logger.error(errMsg);
            throw new CertIDInvalidError(errMsg);
        }

        const filePath = path.join(CERTS_DIR, `${certId}.pem`);
        if (fs.existsSync(filePath)) {
            const errMsg = "Certificate already exists";
            this._logger.error(errMsg);
            throw new Error(errMsg);
        }

        try {
            await fs.promises.writeFile(filePath, cert);
        } catch (error: any) {
            const errMsg = `Error Storing certificate: ${(error as Error).message}`;
            this._logger.error(errMsg);
            throw new CertStoringError("Error Storing Certificate");
        }
    }

    public async updateCertificate(
        certId: string,
        cert: string
    ): Promise<void> {
        if (!this._validateCertId(certId)) {
            const errMsg = `Invalid certificate ID: ${certId}`;
            this._logger.error(errMsg);
            throw new CertIDInvalidError(errMsg);
        }

        const filePath = path.join(CERTS_DIR, `${certId}.pem`);
        if (!fs.existsSync(filePath)) {
            const errMsg = "Certificate does not exist";
            this._logger.error(errMsg);
            throw new Error(errMsg);
        }

        try {
            await fs.promises.writeFile(filePath, cert);
        } catch (error: any) {
            const errMsg = `Error Updating certificate: ${(error as Error).message}`;
            this._logger.error(errMsg);
            throw new CertStoringError("Error Updating Certificate");
        }
    }
}
