# Ricorda API
- Live: https://fathomless-scrubland-69489.herokuapp.com
- Client Repository: https://github.com/thinkful-ei-gecko/Yulia-JamesL-Spaced-Repetition-Client

## Teammates: James Lee & Yulia Khisamutdonova

## Description
Ricorda API is the Express/NodeJS server responsible for handling API requests for Ricorda app. Users can make the following API requests:


`POST /api/user`  Create a user account. Required fields:
  - first name
  - last name
  - user name
  - password (must contain at least one special character, digit, capital and lowercase letter, 8 -72 character long)

`POST /api/auth/token` Log in. Reqired fields:
 - username
 - password

`GET /api/language` Dashboard displays words to learn and score.

`GET /api/language/head` Get next word for learning

`POST /api/language/guess` Post user's answer

## Local dev setup
- Clone the repository and run `npm i`
- Create local Postgresql databases: `spaced-repetition` and `spaced-repetition-test`

```bash
createdb -U dbuser-name spaced-repetition
createdb -U dbuser-name spaced-repetition-test
```
- Run `mv example.env .env` and provide the local database locations within your `.env` file

If your database user has a password be sure to set it in `.env` for all appropriate fields.

- Run migration commands to create appropriate tables

```bash
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`

## Tech stack
- NodeJS
- Express
- PostgresQL
