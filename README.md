# NodeJS JWT Authentication sample

This is a NodeJS API that supports username and password authentication with JWTs
and has APIs that return Chuck Norris phrases. How awesome is that?

## Available APIs

### User APIs

#### POST `/api/auth/register`

You can do a POST to `/api/auth/register` to create a new user.

The body must have:

* `email`: The email
* `username`: The username
* `password`: The password
* `passwordConfirm`: The password to be confirmed

It returns the following:

```json
{
  "token": `jwt_string`
}
```

The JWT is signed with the secret located in the `config/jwt-config.js` file.
That JWT will contain the `id`, `username` and the `date`.

#### POST `/api/auth/login`

You can do a POST to `/api/auth/login` to log a user in.

The body must have:

* `username`: The username
* `password`: The password

It returns the following:

```json
{
  "token": `jwt_string`
}
```

### Quotes API

#### GET `/api/random-quote`

It returns a String with a Random quote from Chuck Norris. It doesn't require authentication.

#### GET `/api/protected/random-quote`

It returns a String with a Random quote from Chuck Norris. It requires authentication. 

The JWT must be sent on the `Authorization` header as follows: `Authorization: Bearer {jwt}`

## Running it

Just clone the repository, run `npm install` and then `node ./bin/www`. That's it :).
