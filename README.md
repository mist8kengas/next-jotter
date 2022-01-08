## next-jotter

Jotter application built on Next.js

### Installation

1. Run `npm install` to install dependencies
2. Create a `.env` file with the following parameters:
    - `DB_HOST` MongoDB server address with `mongodb://` URL scheme
    - `DB_NAME` MongoDB database with a `jotter` collection inside
3. ~~Create a RSA private key file called `private.pem` in the `/bin/jwt` directory~~

### Running

> Run the application in `next dev` by executing `npm run dev`

1. `npm run build` Build the application
2. `npm start` Serve the application on `http://localhost:3000`
