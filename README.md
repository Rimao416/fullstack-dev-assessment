# Seminar Management Application

This project is a comprehensive solution for managing seminars, enabling the creation of courses, assignment of trainers, and sending email notifications to trainers.

## Key Features
- **Course Management**: Creation and display of courses.
- **Trainer Management**: Creation and assignment of trainers to courses.
- **Notifications**: Sending an email to the trainer when they are assigned to a course.
- **Scheduling Conflict Detection**.
- **Optimal Trainer Suggestion** for a given course.

---

## Prerequisites
Before starting, ensure you have the following tools installed on your machine:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## Installation and Setup

### 1. Clone the Project
Clone this repository to your local machine:
```bash
git clone https://github.com/Rimao416/fullstack-dev-assessment.git
cd fullstack-dev-assessment.git
```

# 2. Install Dependencies

Install the necessary dependencies for the frontend and backend.

## Frontend

Navigate to the `frontend` folder:

```bash
cd frontend
npm install
```

## Backend

Navigate to the `backend` folder:

```bash
cd backend
npm install
```

# 3. Configure Environment Files

Ensure you have the `.env` files for the frontend and backend.

### Example `.env` for the backend (an environment file already exists, you can skip this step):

```env
DATABASE_URL=mongodb://mongodb:27017/seminar_management
JWT_SECRET=your_jwt_secret
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
```

### Example `.env` for the frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

# 4. Run the Application with Docker

At the root of the project, execute the following command to build and start the Docker containers:

```bash
docker-compose up --build
```

This command starts:
- The frontend (Next.js)
- The backend (Node.js)
- The database (MongoDB or MySQL)
- Mailhog for testing email notifications

# 5. Test the Application

Once the containers are running:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Mailhog**: [http://localhost:8025](http://localhost:8025)

# 6. Create Initial Data

Ensure the backend Docker container is running. Then, execute the following command to create the initial data:

```bash
docker exec -it test-backend-1 npm run data:create
```

**Note**:  
- `test-backend-1` is the default name of the backend container. If this is not the case, you can check the exact container name using the following command:

```bash
docker ps
```

This will display the list of running containers. Identify the backend container name and replace `test-backend-1` with this name in the command above.

Example:
```bash
docker exec -it backend_container_name npm run data:create
```

This will execute the script to create initial data in the backend container.
