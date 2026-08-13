# SDK Installation

Follow the steps below to install the RLaaS Rate Limiter SDK for your programming language.

---

## 1. TypeScript / Node.js SDK

The TypeScript SDK is packaged as an ES module and includes complete, built-in type definitions.

### Install via Package Manager

Install the package in your backend application:

```bash
# npm
npm install token-bucket-rate-limiter-sdk

# pnpm
pnpm add token-bucket-rate-limiter-sdk

# yarn
yarn add token-bucket-rate-limiter-sdk
```

### Peer Dependencies
If you plan to use the built-in Express middleware, ensure you have `express` installed:

```bash
npm install express
```

### ES Module Configuration
Ensure your `package.json` specifies module loading:

```json
{
  "type": "module"
}
```

If you use TypeScript, configure your `tsconfig.json` accordingly:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

---

## 2. Python SDK (Planned)

The Python SDK provides an asynchronous client for rate limiting backend services.

### Install via pip / poetry

Install the library in your virtual environment:

```bash
# pip
pip install rlaas-rate-limiter-sdk

# poetry
poetry add rlaas-rate-limiter-sdk
```

### Dependencies
The Python SDK relies on:
- `httpx` (async HTTP library)
- `pydantic` (for input validation and configuration models)
