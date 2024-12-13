# Event management app Back-End Repo for Node/React Practicum

Welcome to Event management app backend repository for the Node/React Practicum. Dive in to set up and operate the backend components crucial for Event management operations.

**Front-End Repository:** 
[Link to Front-End Repository](https://github.com/Code-the-Dream-School/hh-team7-front)

## Table of Contents

- [Introduction](#introduction)
  - [Running the project](#running-the-project)
- [Screenshots](#screenshots)
- [User Authentication & Management](#user-authentication--management)
  - [User Authentication](#user-authentication)
  - [Endpoints](#endpoints)
- [Schemas & Data Structures](#schemas--data-structures)
  - [User Schema](#user-schema)
  - [Event Schema](#event-schema)
  - [Registration Schema](#registration-schema)
- [Events Functionality](#Event-functionality)
  - [Endpoints](#endpoints-1)
- [Registration Functionality](#registration-functionality)
  - [Endpoints](#endpoints-2)
- [Error Handling](#error-handling)
- [Password recovery Functionality](#rassword-recovery-functionality)
  - [Endpoints](#endpoints-3)
- [Technologies Used](#technologies-used)
- [Authors](#authors)
- [Contributing & Improvements](#contributing--improvements)
- [License](#license)

## Introduction

This Event Management Application is designed to help users efficiently organize, manage, and track events. It allows users to create and manage events, view upcoming events, and register for events they are interested in. Whether you're hosting a local gathering or attending events, this platform provides an intuitive solution to keep everything organized and accessible.

### Running the project

1. Clone the repository onto your local device (following steps):

```
git clone git@github.com:Code-the-Dream-School/dd-prac-team7-back.git
cd dd-prac-team7-back
npm install
```

2. Set up Postgress database by installing [Postgress](https://www.postgresql.org/)
3. Obtain the following API Keys:

   - [SENDGRID](https://sendgrid.com/)

4. Copy the `.env.example` file and rename it to `.env`:

```
cp .env.example .env
```

5. Replace the placeholders with your specific values:
 This configuration ensures the app can connect to the database, manage JWT tokens, and integrate with email services, among other tasks. Below are the variables you need to set:
```
DB_USER: Your PostgreSQL database username.
DB_PASSWORD: The password for your PostgreSQL database user.
DB_HOST: The host address for your PostgreSQL database. This is typically provided by your hosting service (e.g., Render, Heroku).
DB_PORT: The port on which your PostgreSQL database is running (default is 5432).
DB_NAME: The name of your PostgreSQL database.
DB_SSL: If your database requires an SSL connection, set this to true; otherwise, use false.
For JWT and authentication-related settings:

JWT_LIFETIME: Duration for which JWT tokens are valid (e.g., 1h for 1 hour).
AUTH_COOKIE_EXPIRES: Expiration time for the authentication cookie (in days).
AUTH_COOKIES_NAME: The name of the cookie that stores the authentication token.
For authentication:

JWT_SECRET: The secret key used to sign JWT tokens.
JWT_PASSWORD_RESET_LIFETIME: Expiration time for the password reset token (e.g., 10m for 10 minutes).
For the password reset functionality:

FORGOT_PASSWORD_URL_CLIENT: The URL for your frontend password reset page. This is where users are redirected after requesting a password reset.
FORGOT_PASSWORD_URL_TOKEN_PARAMETER_NAME: The query parameter name that contains the reset token, typically auth.
For email sending:

SENDGRID_API_KEY: Your SendGrid API key for sending emails. You can get this by signing up for SendGrid.
SENDGRID_SENDER: The sender email address used for sending emails (this can be your personal email or a dedicated email service).
```

6. Run `npm run start` to start the development server
7. The app will be served at <http://localhost:3000/>.
8. Your back-end server is now running. You can now run the front-end app.
```Make sure that the port used in the frontend project execution is the same as the one in the FORGOT_PASSWORD_URL_CLIENT variable.```

## Screenshots
#### Home page
![Home page](public/images/home.gif) 

#### Login page
![Login page](public/images/login.gif)

## User Authentication & Management
### User Authentication

Managing user sessions and ensuring security is paramount. The process involves:

- Registering new users
- Logging in and out
- Password management (including forgotten and reset functions)

### Endpoints

| HTTP Verbs | Endpoints                           | Action          |
| ---------- | ----------------------------------  | --------------- |
| POST       | /api/v1/users/register              | Register User   |
| POST       | /api/v1/users/login                 | Login User      |
| POST       | /api/v1/users/logout                | Logout User     |
| POST       | /api/v1/users/password-reset/request| Forgot Password |
| POST       | /api/v1/users/password-reset/update | Update Password |

**Note**: Proper validation and error handling are implemented for user security.

## Schemas & Data Structures

### User Schema

- Defines the structure for user data, including:
    - Name (unique and between 3 and 50 characters)
    - Email (unique, validated as a proper email format)
    - Password (hashed, between 6 and 100 characters)
    - Role (either 'organizer' or 'attendee')
    - Created and modified dates (automatically set)
        Includes hooks for password hashing during user creation and updating the modified_date before any user update.

### Event Schema

- Defines event details, including:
    - Name (between 3 and 100 characters)
    - Description (up to 1000 characters)
    - Date (must be a valid date)
    - Location (between 3 and 100 characters)
    - Capacity (must be a positive integer)
    - Status (with possible values: 'draft', 'published', 'cancelled', 'completed')
    - Event type (can be 'in-person', 'virtual', or 'hybrid')
    - Price (decimal value)
    - Registration deadline (optional)
    - Min/Max capacity (min is 0, max is at least 1)
    - Privacy settings (boolean)
    - Organizer ID (foreign key reference to the User)
- Automatically sets created_date and modified_date.

### Registration Schema

- Defines user event registration details, including:
    - User ID (foreign key referencing User model)
    - Event ID (foreign key referencing Event model)
    - Registration date (automatically set)
    - Status (values: 'pending', 'confirmed', 'cancelled', 'attended')
    - Payment status (values: 'pending', 'completed', 'refunded')
    - Notes (optional text field)
    - Check-in time (optional date field)

## Events Functionality

Allows users to manage their events.

### Endpoints

| HTTP Verbs | Endpoints                  | Action               |
| ---------- | -------------------------- | -------------------- |
| GET        | /api/v1/events             | Fetch all Events     |
| POST       | /api/v1/events             | Create Event         |
| GET        | /api/v1/events/:id         | Get Event by ID      |
| PUT        | /api/v1/events/:id         | Update Event         |
| DELETE     | /api/v1/events/:id         | Delete Event         |

**Note**: Authentication is required. Only creators can modify their events.

## Registration Functionality

Allows users to register and update registration.

### Endpoints

| HTTP Verbs | Endpoints                 | Action                 |
| ---------- | ------------------------  | ---------------------- |
| GET        | /api/v1/registrations/    | Get all registrations  |
| POST       | /api/v1/registrations/    | Create registration    |
| PUT        | /api/v1/registrations/:id | Update registration    |
| DELETE     | /api/v1/registrations/:id | Delete registration    |

**Note**: Authentication is required. Only the creators can modify their meal plans.

## Error Handling

Responses follow a consistent format. Errors return appropriate HTTP status codes and messages.

## Password recovery Functionality

### Endpoints

| HTTP Verbs | Endpoints                            | Action             |
| ---------- | ------------------------------------ | ------------------ |
| POST       | /api/v1/users/password-reset/request | Send an Email      |
| POST       | /api/v1/users/password-reset/verify  | Verify reset token |
| POST       | /api/v1/users/password-reset/update  | Password updated   |

**Note**: Authentication is required. Only authorized users can reset password.

## Technologies Used

- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://www.expresjs.org/)
- [Postgress](https://www.postgresql.org/)
- [jsonwebtoken](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/blob/master/README.md)
- [SendGrid](https://sendgrid.com/)

## Authors

| Frontend                                             | Backend                                                |
| ---------------------------------------------------- | ------------------------------------------------------ |
| [Toryalai Helali](https://github.com/Toryalai)       | [Cristian Rosales](https://github.com/Unstoppable7)    |
| [Risqua Mussa](https://github.com/risquaMussa)       | [Kate Podkorytova](https://github.compodko-va)         |

## Contributing & Improvements

We are constantly striving to enhance and improve our project. If you have any suggestions, improvements, or encounter any bugs, please feel free to submit an issue or open a pull request in our GitHub repository.

Before submitting a pull request, please ensure the following:

Your code is clearly documented and adheres to the project's coding standards.
Your changes are thoroughly tested and do not introduce new issues.
Provide a detailed description of the changes you have made.

We greatly appreciate all contributions and look forward to collaborating with you!

## License

This project is available for use under the MIT License.
