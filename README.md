# Guestbook Application

## Overview

This is a simple guestbook application built with React for the frontend and PHP for the backend. Users can leave messages which are then displayed in chronological order with the most recent at the top.

## Features

- Users can submit a message via a web form.
- Messages are saved to a MySQL database.
- All messages are displayed on the main page with a timestamp.

## Local Development

Before starting, make sure you have `npm` and a local server like XAMPP running PHP and MySQL.

### Setting Up the Backend

1. Import the `guestbook.sql` file into your MySQL database to create the necessary tables.
2. Configure the database connection settings in `backend/get-messages.php` and `backend/post-message.php`.

### Running the Frontend

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open `http://localhost:3000` (or the port provided in your terminal) to view the app.

## Deployment

To deploy this application:

1. Build the frontend for production with `npm run build`.
2. Upload the `dist` folder contents and the `backend` folder to your web server.
3. Make sure the server is configured to serve the `dist` directory as the root for the site.
4. Update the `base` URL in `vite.config.js` and rebuild if your app will be served from a subdirectory.

[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=13649934)
