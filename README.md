# Google OAuth2 Authentication with JWT

This repository contains a complete implementation of Google OAuth2 authentication using Passport.js, combined with JSON Web Tokens (JWT) for user authentication in Node.js applications. This setup is designed to streamline the user registration and login process by leveraging Google's authentication system while providing a secure token-based approach for managing user sessions.

## Features

- **Google OAuth2 Integration**: Allows users to sign in using their Google accounts.
- **User Registration**: Automatically registers new users upon successful authentication with Google.
- **JWT for Authentication**: Issues JWT tokens for authenticated users, enabling secure communication between the client and server.
- **Session Management**: Handles user sessions without relying on server-side storage, making it scalable and efficient.
- **Sign Out Functionality**: Provides an endpoint for users to sign out, ensuring their tokens are managed effectively on the client side.
