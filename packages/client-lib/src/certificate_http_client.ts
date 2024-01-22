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
import { IAuthenticatedHttpRequester } from "@mojaloop/security-bc-public-types-lib";
import {
    UnableToCreateCertificateError,
    UnableToGetCertificateError,
    UnableToUpdateCertificateError,
} from "./errors";

export class CertificatesHttpClient {
    // Properties received through the constructor.
    private readonly _logger: ILogger;
    // Other properties.
    private readonly _baseUrlHttpService: string;
    private readonly _authRequester: IAuthenticatedHttpRequester;

    constructor(
        // logger: ILogger,
        baseUrlHttpService: string
        // authRequester: IAuthenticatedHttpRequester,
    ) {
        // this._logger = logger.createChild(this.constructor.name);
        this._baseUrlHttpService = baseUrlHttpService;
        // this._authRequester = authRequester;
    }

    public async getCertificate(certId: string): Promise<string | null> {
        try {
            const url = new URL(
                `/certs/${certId}`,
                this._baseUrlHttpService
            ).toString();
            // const resp = await this._authRequester.fetch(url);
            const resp = await fetch(url);

            const respText = await resp.text();

            if (resp.status === 200) {
                return respText;
            }

            if (resp.status == 404) {
                return null;
            }

            throw new UnableToGetCertificateError();
        } catch (e: unknown) {
            if (e instanceof Error) throw e;
            // handle everything else
            throw new UnableToGetCertificateError();
        }
    }

    public async postCertificate(certId: string, cert: string): Promise<void> {
        try {
            const url = new URL("/certs", this._baseUrlHttpService).toString();
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ensure to set the Content-Type header
                },
                body: JSON.stringify({ certId, cert }),
            });

            const resp = await fetch(request);
            // const resp = await this._authRequester.fetch(request);

            const respBody = await resp.text();

            if (resp.status === 200) {
                return;
            }
            console.log(resp.status);

            throw new UnableToCreateCertificateError(`Response status: ${resp.status}, Body: ${respBody}`);
        } catch (e: unknown) {
            if (e instanceof Error) throw e;
            // handle everything else
            throw new UnableToCreateCertificateError();
        }
    }

    public async putCertificate(
        certId: string,
        cert: string
    ): Promise<void> {
        try {
            const url = new URL(
                `/certs/${certId}`,
                this._baseUrlHttpService
            ).toString();
            const request = new Request(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ certId, cert }),
            });

            // const resp = await this._authRequester.fetch(request);
            const resp = await fetch(request);

            if (resp.status === 200) {
                return;
            }

            throw new UnableToUpdateCertificateError();
        } catch (e: unknown) {
            if (e instanceof Error) throw e;
            // handle everything else
            throw new UnableToUpdateCertificateError();
        }
    }
}
