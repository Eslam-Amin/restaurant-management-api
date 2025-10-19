<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

<!--
  README.md — Documentation for the Restaurant Management API
  This project is a NestJS-based REST API that manages restaurants and users,
  supports authentication (session-based), and provides features like
  following restaurants, favoriting cuisines, and location-based nearby queries.
-->

# Restaurant Management API

Lightweight REST API built with NestJS for managing restaurants and users. It
includes session-based authentication, restaurant search and discovery, user
profiles with favorite cuisines and followed restaurants, and Swagger API
documentation.

## Table of Contents

- About
- Features
- Tech stack
- Getting started
  - Requirements
  - Install
  - Environment
  - Run
- API overview
  - Auth endpoints
  - Restaurants endpoints
  - Swagger docs
- Scripts
- Testing
- Contributing
- License

## About

This repository contains the backend API for a restaurant discovery and
management platform. It exposes endpoints to create and manage restaurants and
users, supports following/unfollowing restaurants, toggling favorite cuisines,
and querying nearby restaurants by latitude/longitude.

The API is built with NestJS, uses MongoDB (via Mongoose) as the data store,
and serves Swagger UI at `/api-docs` for interactive documentation.

## Features

- Session-based authentication (signup, login, logout, whoami)
- Create, update, delete restaurants
- Pagination and cuisine filtering
- Nearby restaurants search using lat/lng
- Follow/unfollow restaurants (protected)
- Add/remove favorite cuisines (protected)
- Swagger documentation available

## Tech stack

- Node.js (NestJS)
- TypeScript
- Express
- MongoDB (Mongoose)
- Swagger (OpenAPI) for docs

## Getting started

### Requirements

- Node.js 18+ (recommend LTS)
- npm
- MongoDB instance (local or cloud)

### Install

Run:

```powershell
npm install
```

### Environment

The project uses dotenv and loads `.env.<NODE_ENV>` files. Common variables:

- PORT — server port (default 3000)
- MONGO_URI — MongoDB connection string
- COOKIE_KEY — key used for cookie-session
- NODE_ENV — environment (development, production, test)

Create an environment file, for example `.env.development`:

```text
PORT=3000
MONGO_URI=mongodb://localhost:27017/restaurant-db
COOKIE_KEY=some_secure_random_value
NODE_ENV=development
```

### Run the app

Development:

```powershell
npm run start:dev
```

Production (build then run):

```powershell
npm run build
npm run start:prod
```

The server exposes a simple health check at `/health` and prints the listening
URL after startup.

## API overview

Swagger UI is available when the app is running at `/api-docs`.

Below is a short summary of the main endpoints (see Swagger for full details).

Auth (prefix: `/auth`)

- POST /auth/signup — Create a new user (body: firstName, lastName, email, password,...)
- POST /auth/login — Login and create a session (body: email, password)
- POST /auth/logout — Logout (clears session)
- GET /auth/whoami — Returns the current authenticated user (requires session)

Restaurants (prefix: `/restaurants`)

- POST /restaurants — Create a restaurant (protected/provide payload)
- GET /restaurants — List restaurants (query: page, limit, cuisine)
- GET /restaurants/nearby?lat=<>&lng=<> — List nearby restaurants (page/limit supported)
- GET /restaurants/:identifier — Get a restaurant by id or slug
- PATCH /restaurants/:id — Update a restaurant
- DELETE /restaurants/:id — Delete a restaurant
- PATCH /restaurants/:id/follow — Follow a restaurant (authenticated)
- PATCH /restaurants/:id/unfollow — Unfollow a restaurant (authenticated)
- PATCH /restaurants/:cuisine/favorite — Add cuisine to favorites (authenticated)
- PATCH /restaurants/:cuisine/unfavorite — Remove cuisine from favorites (authenticated)

Note: Some endpoints are protected by an `AuthGuard` and require a valid
session cookie to access.

## Postman collection

The API is documented as a Postman collection which you can import into
Postman for exploration and testing.

- View the collection in Postman: https://documenter.getpostman.com/view/23525113/2sB3QQK81U

To import into Postman:

1. Open Postman -> File -> Import -> Paste the collection URL above or choose "Link" and paste it.
2. The requests and example environments (if included) will be imported.
3. Update the environment variables (e.g., base URL, auth) if necessary before running requests.

## Scripts

Key npm scripts from `package.json`:

- npm run start — start in development
- npm run start:dev — start in watch mode
- npm run start:prod — run built app
- npm run build — compile project
- npm run test — run unit tests
- npm run test:e2e — run e2e tests
- npm run test:cov — run tests with coverage

## Testing

The project uses Jest for testing. To run unit tests:

```powershell
npm run test
```

To run end-to-end tests:

```powershell
npm run test:e2e
```

## Contributing

If you'd like to contribute:

1. Fork the repository and create a branch for your change.
2. Add tests for any new behavior.
3. Run linting and tests locally.
4. Open a pull request describing your changes.

Coding style follows typical NestJS/TypeScript conventions. ESLint and
Prettier configuration are included in the repo.

## Future Enhancements

The following features are planned for future releases:

### Email Verification System

- **Email verification for new users**: Implement a verification email system that sends a verification code to each new user's email address upon registration
- **Email verification endpoint**: Add an endpoint to verify user email addresses using the verification code
- **Email service integration**: Integrate with email service providers (e.g., SendGrid, AWS SES, or Nodemailer) for reliable email delivery
- **Verification status tracking**: Track verification status in user profiles and restrict access to certain features until email is verified

### JWT Authentication Enhancement

- **Migrate from session-based to JWT authentication**: Replace the current session-based authentication system with JWT (JSON Web Tokens)
- **JWT token management**: Implement access tokens and refresh tokens for enhanced security
- **Token expiration handling**: Add automatic token refresh mechanisms and proper token expiration handling
- **Stateless authentication**: Enable stateless authentication for better scalability and API compatibility

### Performance Optimization

- **Caching middleware**: Implement Redis-based caching middleware to enhance system performance
- **Query result caching**: Cache complex database queries and aggregations to reduce response times
- **API response caching**: Cache frequently accessed API responses (restaurant lists, nearby searches)
- **Cache invalidation strategies**: Implement smart cache invalidation for data consistency
- **Cache warming**: Pre-populate cache with commonly requested data

### Additional Security Features

- **Password reset functionality**: Implement secure password reset via email verification
- **Account lockout protection**: Add protection against brute force attacks
- **Two-factor authentication (2FA)**: Optional 2FA support for enhanced account security

## Notes & Next steps

- Check `src/config/database.config.ts` and `src/database/database.module.ts` to
  configure connection options for MongoDB.
- If you plan to deploy, ensure secure COOKIE_KEY and proper NODE_ENV and
  connection strings are set.

## License

This project is licensed under the terms in the repository (check package.json).
