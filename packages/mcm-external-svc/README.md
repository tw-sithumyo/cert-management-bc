# External MCM (Mojaloop Certificate Management) SVC
This external API service is responsible for providing public certificates to verify the signature of the JWS signed by the DFSPs.

Default port: 3220

## Build

```bash
npm run build
```

## Run this service

Anywhere in the repo structure:
```bash
npm run start:dev
```

## Auto build (watch)

```bash
npm run watch
```

## Unit Tests

```bash
npm run test:unit
```

## Integration Tests

```bash
npm run test:integration
```
