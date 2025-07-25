# How to Run the Project

## Prerequisites

- Node.js 18.x
- npm
- Docker & Docker Compose (optional, for containerized setup)

---

## Running with Docker

1. Copy `.env.example` to `.env` in both `frontend` and `backend` if needed.
2. Build and start all services:
   ```bash
   docker-compose up -d --build
   ```
3. Access the frontend at [http://localhost:3000](http://localhost:3000).

**Note:** If you encounter missing modules, run `npm install` manually in each service directory.

---

## Running Locally (without Docker)

### Backend

```bash
cd backend
npm install
npm start
```
The backend will run on [http://localhost:3001](http://localhost:3001).

### Frontend

```bash
cd frontend
npm install
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

---

## Troubleshooting

- If you see errors about missing `node_modules`, run `npm install` in the respective directory.
- Make sure the backend is running before starting the frontend.
- Adjust `.env` files as needed for your environment.

---

## Environment Variables Example (Frontend)

To configure the API base URL for the frontend, create a `.env` file in the `frontend` directory with the following content:

```
REACT_APP_API_BASE_URL=http://localhost:3001
```

You can change the value to match your backend address (e.g., for production or staging environments).

The React app will use this variable to make API requests. Remember to restart the frontend server after changing `.env`.

---

**For any other questions, see SOLUTION.md or contact the team.** 