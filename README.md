# disagro-fakeshop

## Running with Docker

This project provides Dockerfiles for both the backend and frontend services, using Node.js version 22.13.1 (slim images). The recommended way to run the project is with Docker Compose, which sets up both services and a shared network.

### Requirements
- Docker and Docker Compose installed
- Node.js version: 22.13.1 (as specified in Dockerfiles)
- Required environment files:
  - `./backend/.env` (required, loaded automatically)
  - `./frontend/.env.local` (optional, uncomment in compose file if needed)

### Build and Run

1. Ensure your environment files are present:
   - `./backend/.env` (see backend for required variables)
   - Optionally, `./frontend/.env.local`

2. Build and start the services:

   ```sh
   docker compose up --build
   ```

   This will build and start both the backend and frontend containers.

### Service Details

- **Backend (`js-backend`)**
  - Context: `./backend`
  - Dockerfile: `../backendDockerfile`
  - Exposes port **3001**
  - Loads environment variables from `./backend/.env`

- **Frontend (`js-frontend`)**
  - Context: `./frontend`
  - Dockerfile: `../frontendDockerfile`
  - Exposes port **3000**
  - Optionally loads environment variables from `./frontend/.env.local`
  - Depends on backend service

- **Network**
  - Both services are connected via the `disagro-net` bridge network for internal communication.

### Notes
- Both containers run as non-root users for security.
- The backend and frontend are started with `npm start` in production mode.
- If you need to customize environment variables, edit the respective `.env` files before building.

---
