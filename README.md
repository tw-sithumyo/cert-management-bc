# mcm-svc

**EXPERIMENTAL** vNext Mojaloop Certificate Management Service

**Notes:**
- Replace `package-dir-name` with the correct module name, it corresponds to the directory name
- Replace `npm_dependency_name` with the correct dependency name
- Common devDependencies, such as linters or test frameworks, should be installed/dependend in the main `package.json` to avoid repeating them in each of the monorepo's modules

TBD finish this

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

### Execute locally the pre-commit checks - these will be executed with every commit and in the default CI/CD pipeline
Make sure these pass before committing any code

```bash
npm run pre_commit_check
```

