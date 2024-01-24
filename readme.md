# ActivityPub Blog

This project is about learning the ActivityPub protocol and implementing it. I have decided to make a simple blog page with a self written api that functions according to the activitypub protocol.
This repository contains the back - and - frontend code for the project.
In this project I have used:

- [Firebase](https://firebase.google.com/docs) - A platform for building web and mobile applications.
- [Deno](https://deno.land/manual) - A secure runtime for JavaScript and TypeScript.
- [TypeScript](https://www.typescriptlang.org/docs) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Vue](https://vuejs.org/v2/guide/) - A progressive JavaScript framework for building user interfaces.
- [Hono](https://hono.dev/docs) - A library for managing HTTP requests in Deno.

### project status

Frontend did not get finished in time. Will try to still deliver a working application.

### license

MIT License

Copyright (c) 2024 ArneVanhyfte

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

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
