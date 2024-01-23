# mcm-svc

**EXPERIMENTAL** vNext Mojaloop Certificate Management Service

## Packages

### Certificate Management Service - mcm-svc


## Usage

### Install NVM - Node version manager

More information on how to install NVM: https://github.com/nvm-sh/nvm

#### Use NVM to install the correct Node.js version

```bash
# (In the repository root directory - one having the .nvmrc file)
nvm install
nvm use
```

### Install Dependencies

All commands below assume you're positioned at the root of the monorepo.

```bash
npm install
```

### Build

```bash
npm run build
```

### Run The MCM Internal Service

```bash
npm run start:mcm-internal-svc
```

### Run The MCM External Service

```bash
npm run start:mcm-external-svc
```

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

```bash
npm run pre_commit_check
```

