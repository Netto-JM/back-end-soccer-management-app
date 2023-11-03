# Back-End Soccer Management App

<img src="https://github.com/Netto-JM/back-end-soccer-management-app/assets/32754552/1ef11468-52bd-4025-8d76-eabb5d2dfeed" alt="soccer" width="100" height="100">
<br>
<br>
This is the README for the "Back-End Soccer Management App" project. This is a dockerized backend that provides functionality to manage soccer matches and is intended to be consumed by an already available frontend.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation Requirements](#installation-requirements)
3. [How to Use](#how-to-use)
4. [Project Structure](#project-structure)
5. [Endpoints](#endpoints)
6. [Configuration](#configuration)
7. [Author](#author)
8. [Contact](#contact)

## Technologies Used

### Dependencies:

- **bcryptjs**: Library for password encryption.
- **cors**: Middleware to enable cross-origin resource sharing (CORS) for the API.
- **express**: Framework for building RESTful APIs in Node.js.
- **express-async-errors**: Middleware to simplify handling of asynchronous errors.
- **joi**: Library for data validation and schema definition.
- **jsonwebtoken**: Implementation of JSON Web Tokens for authentication.
- **mysql2**: Package for interacting with MySQL databases.
- **sequelize**: Object-Relational Mapping (ORM) for database operations.

### DevDependencies:

- **chai**: Assertion framework used with Mocha for testing.
- **chai-as-promised**: Extension for working with promises in Chai tests.
- **chai-http**: Extension for making HTTP requests in Chai tests.
- **eslint**: Tool for linting and code correction in JavaScript/TypeScript.
- **mocha**: Testing framework.
- **nodemon**: Utility that monitors file changes and automatically restarts the server.
- **nyc**: Code coverage tool for testing.
- **sequelize-cli**: Command Line Interface (CLI) for Sequelize, used for running database-related tasks.
- **sinon**: Library for creating spies and stubs in tests.
- **ts-node**: TypeScript executor for Node.js.
- **ts-node-dev**: Tool for automatically restarting the Node server when TypeScript files change.
- **typescript**: Programming language for Node.js.

- TypeScript type definition packages (e.g., `@types/bcryptjs`, `@types/chai`, etc.) for improved type support in TypeScript projects.

## Installation Requirements

To run this project, you need to have Docker installed on your system. Follow the steps below:

1. Clone this repository to your local environment.
2. Navigate to the project's root directory.
3. Execute the following command to start the Docker containers:

   npm run compose:up

This command will start the containerized services, including the backend, frontend, and MySQL database.

## How to Use

Make sure the Docker containers are running. The backend should be listening on port 3001. The frontend will communicate with the backend service at `http://localhost:3001` through the endpoints defined in the backend.

Authentication is required to add a match. Users must be logged in to make changes.

## Project Structure

The project structure consists of three main parts: the database, the backend, and the frontend. Here is an overview of the structure:

- `db`: Contains database configuration and runs in a Docker MySQL container.
- `app/backend`: The source code of the backend, including routes and controllers. It runs on port 3001.
- `app/frontend`: The frontend that communicates with the backend through the defined endpoints.

## Endpoints

The "Back-End Soccer Management App" API offers the following endpoints for performing operations related to teams, matches, authentication, and leaderboard:

### Teams

- **List All Teams**
  - Method: GET
  - Route: `/teams/`
  - Description: Returns a list of all teams.
  - Authentication: No authentication required.

- **Get Team by ID**
  - Method: GET
  - Route: `/teams/:id`
  - Description: Returns information about a team based on the provided ID.
  - Authentication: No authentication required.

### Authentication

- **Get Role of Logged-In User**
  - Method: GET
  - Route: `/login/role`
  - Description: Returns the role of the authenticated user.
  - Authentication: Requires user authentication.

- **User Login**
  - Method: POST
  - Route: `/login/`
  - Description: Allows a user to log in to the system.
  - Authentication: No authentication required.

### Matches

- **List All Matches**
  - Method: GET
  - Route: `/matches/`
  - Description: Returns a list of all matches.
  - Authentication: No authentication required.

- **Create Match**
  - Method: POST
  - Route: `/matches/`
  - Description: Creates a new match.
  - Authentication: Requires user authentication.

- **Update Match by ID**
  - Method: PATCH
  - Route: `/matches/:id/`
  - Description: Updates an existing match based on the provided ID.
  - Authentication: Requires user authentication.

- **Finish Match by ID**
  - Method: PATCH
  - Route: `/matches/:id/finish`
  - Description: Marks a match as finished based on the provided ID.
  - Authentication: Requires user authentication.

### Leaderboard

- **List Overall Leaderboard**
  - Method: GET
  - Route: `/leaderboard/`
  - Description: Returns the overall leaderboard for all teams.
  - Authentication: No authentication required.

- **List Home Teams Leaderboard**
  - Method: GET
  - Route: `/leaderboard/home`
  - Description: Returns the leaderboard for home teams.
  - Authentication: No authentication required.

- **List Away Teams Leaderboard**
  - Method: GET
  - Route: `/leaderboard/away`
  - Description: Returns the leaderboard for away teams.
  - Authentication: No authentication required.

## Configuration

Ensure that the endpoints are correctly configured in your application and are accessible through the routes defined in your route files.

For specific details on the functionalities of each endpoint, refer to the source code in the `app/routes` directory.

## Author

- Juvenal Martins dos Santos Netto

## Contact

If you have any questions or need assistance, please contact me via email: nettojm86@gmail.com.
