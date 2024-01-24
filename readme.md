# ActivityPub Blog

This repository contains the back - and - frontend code for the project.
In this project I have used:

- [Firebase](https://firebase.google.com/docs) - A platform for building web and mobile applications.
- [Deno](https://deno.land/manual) - A secure runtime for JavaScript and TypeScript.
- [TypeScript](https://www.typescriptlang.org/docs) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Vue](https://vuejs.org/v2/guide/) - A progressive JavaScript framework for building user interfaces.
- [Hono](https://hono.dev/docs) - A library for managing HTTP requests in Deno.

## Backend

### Prerequisites

Before running the backend, make sure you have the following installed:

- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com) (Node Package Manager)
- [deno](https://deno.land) (JavaScript/TypeScript runtime)

### Installation

```
cd .\backend\
cd .\AP_Server\
npm install
```

### Configuration

1. Add a new project to your firebase with email and password authentication and firestore enabled
2. In the firebase settings, add a service account and download the key into the AP_Server folder. Rename it to AdminKey.json

3. Rename the `.env.example` file to `.env`.

4. Open the `.env` file and update the configuration variables according to your environment. Paste the firebase configuration keys in the file.

### Usage

To start the backend server, run the following command:

```
cd /backend/AP_Server
deno task dev
or
deno run --allow-read --allow-net .\main.ts
```

for linting run:

```
deno lint
```

## Frontend

### Prerequisites

Before running the frontend, make sure you have the following installed:

- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com) (Node Package Manager)

### Installation

```
cd .\frontend\
cd .\activity-pub\
npm install
```

### Configuration

1. Add a new project to your firebase with email and password authentication and firestore enabled
2. In the firebase settings, add a service account and download the key into the AP_Server folder. Rename it to AdminKey.json

3. Rename the `.env.example` file to `.env`.

4. Open the `.env` file and update the configuration variables according to your environment. Paste the firebase configuration keys in the file.

### Usage

To start the backend server, run the following command:

```
cd /backend/AP_Server
deno task dev
or
deno run --allow-read --allow-net .\main.ts
```

for linting run:

```
deno lint
```
