# Implementation

## Q) What libraries did you add to the frontend? What are they used for?

Here are the libraries added to the frontend and their purposes:

- **`@hookform/resolvers` (v3.10.0)**: Used to integrate validation schemas (like Yup or Zod) with `react-hook-form` for form handling and validation.
- **`@reduxjs/toolkit` (v2.5.0)**: A powerful library for state management. I used Redux Toolkit (RTK) to simplify state management, handle asynchronous actions, and manage global state efficiently.
- **`axios` (v1.7.9)**: A library for making HTTP requests to the backend API. It provides a simple and consistent way to handle API calls.
- **`date-fns` (v4.1.0)**: Used for date manipulation and formatting. It helps in handling dates in a clean and efficient way.
- **`js-cookie` (v3.0.5)**: A lightweight library for handling cookies. It is used to manage authentication tokens stored in cookies.
- **`react-hook-form` (v7.54.2)**: A library for managing form state and validation. It simplifies form handling and improves performance by reducing re-renders.
- **`react-redux` (v9.2.0)**: The official React bindings for Redux. It connects the Redux store to React components.
- **`yup` (v1.6.1)**: A schema validation library. It is used to define validation rules for forms and works seamlessly with `react-hook-form`.
- **`zod` (v3.24.1)**: Another schema validation library. It provides TypeScript-first validation and is used as an alternative to Yup for stricter type safety.

Additionally, I implemented a **context-based system** using React's `useContext` to manage and display notifications across the application. This allows for a centralized way to handle and show notifications to the user.

---

## Q) What libraries did you add to the backend? What are they used for?

Here are the libraries added to the backend and their purposes:

- **`@types/joi` (v17.2.2)**: TypeScript definitions for the `joi` library, enabling type safety when using `joi` for schema validation.
- **`bcryptjs` (v2.4.3)**: A library for hashing passwords. It ensures that user passwords are securely stored in the database by hashing them before saving.
- **`cookie-parser` (v1.4.7)**: Middleware for parsing cookies in incoming requests. It is used to handle authentication tokens stored in cookies.
- **`cors` (v2.8.5)**: Middleware to enable Cross-Origin Resource Sharing (CORS). It allows the frontend to communicate with the backend API securely.
- **`date-fns` (v4.1.0)**: A library for date manipulation and formatting. It is used to handle dates in the backend, such as event dates and timestamps.
- **`dotenv` (v16.4.5)**: A library to load environment variables from a `.env` file into the application. It ensures sensitive configuration data (e.g., database URLs, secrets) is not hardcoded.
- **`express` (v4.19.2)**: A minimal and flexible Node.js web application framework. It is used to build the backend API and handle routing, middleware, and requests.
- **`joi` (v17.13.3)**: A schema validation library. It is used to validate incoming request data (e.g., user inputs, API payloads) and ensure data integrity.
- **`jsonwebtoken` (v9.0.2)**: A library for generating and verifying JSON Web Tokens (JWT). It is used for user authentication and authorization.
- **`mongoose` (v8.4.0)**: An Object Data Modeling (ODM) library for MongoDB. It simplifies interactions with the MongoDB database by providing a schema-based solution.
- **`nodemailer` (v6.9.15)**: A library for sending emails. It is used to implement the email notification feature, such as notifying trainers about event assignments.
- **`typescript` (v5.4.5)**: A superset of JavaScript that adds static typing. It is used to write type-safe and maintainable backend code.
- **`jest`**: A JavaScript testing framework. It is used to write and run unit and integration tests for the backend application.

These libraries help in building a robust, secure, and scalable backend for the application.
---

## Q) How does the application handle the assignment of trainers and the email notification feature?

The application handles the assignment of trainers and email notifications as follows:

1. **Trainer Assignment**:
   - When a trainer is assigned to a course, the backend updates the database with the trainer's details and the event information.
   - The frontend displays the updated assignment in real-time using data fetched from the backend API.

2. **Email Notification Feature**:
   - The backend uses `nodemailer` to send email notifications to trainers when they are assigned to an event.
   - For testing purposes, **Mailhog** is used as a local SMTP server. Mailhog captures all outgoing emails, allowing us to inspect them without actually sending them to real email addresses.
   - The email content includes details about the event, such as the date, time, and location.

3. **Mailhog Integration**:
   - Mailhog is configured in the `.env` file with the following settings:
     ```env
     SMTP_HOST=mailhog
     SMTP_PORT=1025
     ```
   - Emails sent by the application can be viewed in the Mailhog web interface at `http://localhost:8025`.

---

## Q) What command do you use to start the application locally?

To start the application locally, use the following command:

```bash
docker-compose up --build
```

## General

### Q) If you had more time, what improvements or new features would you add?
If I had more time, I would:
- **Enhance the UI**: Add a polished design using a UI library like Material-UI or custom Tailwind components to improve user experience.
- **Add filtering and search functionality**: Allow users to filter courses by date, subject, or location and search for trainers.
- **Implement user roles and permissions**: Introduce admin and regular user roles with specific privileges.
- **Optimize backend performance**: Add indexing for database queries and implement caching for frequently accessed data.
- **Expand email notifications**: Include reminders for trainers and confirmations for participants.
- **Add testing**: Write unit and integration tests for critical functionalities to ensure reliability.
- **Localization support**: Provide multilingual options for users in different regions.

---

### Q) Which parts of the project are you most proud of? Why?
- **Trainer assignment logic**: The algorithm for detecting scheduling conflicts and suggesting the most qualified trainer is efficient and takes multiple constraints into account.
- **Dockerized environment**: The setup for Docker Compose ensures seamless integration of all services, including the frontend, backend, database, and Mailhog.
- **Email notification system**: The implementation using SMTP and Mailhog worked smoothly for testing, ensuring trainers receive accurate course details.

---

### Q) Which parts did you spend the most time on? What did you find most challenging?
- **Scheduling conflict detection and trainer matching**: Developing the logic to handle overlapping schedules while also considering trainer expertise was the most time-consuming and challenging.
- **Docker configuration**: Setting up a fully functional Docker Compose environment that connects all services correctly took time to troubleshoot and refine.
- **Email notifications**: Configuring Mailhog and integrating it with the backend SMTP setup required careful debugging to ensure email delivery worked seamlessly.

---

### Q) How did you find the test overall? Did you encounter any issues or difficulties completing it?
The test was well-structured and covered key areas of full-stack development. It provided a good balance between frontend, backend, and infrastructure setup. However, completing all the tasks within the time limit was challenging, especially for the backend logic and Docker setup. 

---

### Q) Do you have any suggestions on how we can improve the test?
- **Increase the time limit**: Allowing 1.5–2 hours would help candidates implement more features and polish their work.
- **Provide a pre-configured Docker setup**: Including a basic `docker-compose.yml` file would let candidates focus more on the application logic rather than troubleshooting Docker.
- **Clarify the expected scope**: Specifying which features are mandatory and which are "nice to have" would help candidates prioritize their efforts better.
- **Include a small sample dataset**: Pre-seeding the database with a few courses and trainers would allow candidates to focus on the business logic instead of creating data manually during testing.

---
