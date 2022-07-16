## SERVER FOR NOTES RIVER (TypeScript)

This server is in development state if anyone wants to contribute then welcome.

for setup this server in local Follow These instructions.

```bash
    git clone https://github.com/Notes-River/backend-ts.git
```

```bash 
    cd backend-ts
```

```bash
    npm install
```

for install dev dependencies

```bash
    npm i -D
```

After that you have to start local redis-server and mongodb server.

## .ENV FILE SETUP

- create .env file in backent-ts folder
- open file in vscode or any other editor

```
PORT= <Your PORT>
DB_URL=<Your Database url local mongodb/ mongodb Atlas>
EMAIL= <Your Email Id>
PASSWORD= <App Password of that email address>
access=<Your Access String>
secret=<Your Secret String>
```
- For create App Password Follow This step

```bash
    Open Device Settings > Google > Manage Your Google Account > Security > App Passwords > Create
```
- This app password allows you to send mail which is required in this server.
- Access can be any random string
- Secret alson can be any random string


## API Documentation

We are working on it