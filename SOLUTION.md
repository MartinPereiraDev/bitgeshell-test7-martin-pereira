# SOLUTION.md

## Docker & Environment Setup

- A `docker-compose.yml` is provided with two services:
  - **backend**: Node.js 18, uses `nodemon` for hot-reloading.
  - **frontend**: Node.js 18, uses `nodemon` for hot-reloading.
- Both services use `.env` files for configuration.  
  - **Create a `.env` file in both `frontend` and `backend` directories.**
  - An example file `.env.example` is provided for the frontend.
- To build and run both services:
  ```bash
  docker-compose up -d --build
  ```
- **Note:**  
  Docker Compose does not automatically install `node_modules` for backend and frontend if they are not present locally.  
  If you encounter missing modules, run `npm install` manually inside each service directory.

---

## Backend

### 1. Refactor Blocking I/O

- The original `src/routes/items.js` used `fs.readFileSync`, which blocks the event loop.
- Now, all file operations use async/await with `fs.promises` for non-blocking I/O.

**Example:**
```js
async function readData() {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('Data file not found');
    }
    throw err;
  }
}
```

- The `/api/items` endpoint is now fully asynchronous.

---

### 2. Performance: Stats Caching

- The `/api/stats` endpoint calculates statistics (total, average, min, max) and caches them in memory.
- The cache is invalidated automatically if `items.json` changes (add, edit, or delete).
- This avoids recalculating stats on every request and improves performance.

---

### 3. Testing

- **Jest** is used as the testing framework.
- **supertest** is used for HTTP assertions on the Express app.
- **mock-fs** is used to mock the filesystem during tests.
- Tests cover happy paths and error cases for the items routes.
- Validation is handled with **Joi** (and optionally `express-validator`).

---

### 4. Validation

- **Joi** is used for validating item creation and updates.
- Separate schemas are used for POST (all fields required) and PATCH (all fields optional, at least one required).

---

### 5. Logging

- Logging middleware is present, but a log file is not yet implemented.

---

## Frontend

### 1. Memory Leak Fix

- The `Items.js` component previously leaked memory if unmounted before a fetch completed.
- This is fixed by using an `AbortController` and passing its `signal` to the fetch, ensuring no state updates after unmount.

---

### 2. Pagination & Search

- The product list supports server-side pagination and search by name (`q` parameter).
- The backend handles pagination, search, and ordering.

---

### 3. Performance: Virtualization

- The product list uses **react-window** for virtualization, ensuring smooth UI even with large datasets.

---

### 4. UI/UX

- The UI includes a navigation bar, search input, pagination controls, and a stats page.
- Product names link to their detail pages.
- A "View Detail" button is provided for each product.
- The stats page shows total products, average price, cheapest and most expensive products.

---

## Naming Convention Note

Throughout the project, many files, components, and variables use generic names such as `item`, `items`, `ItemDetail`, etc. This can make the codebase harder to maintain and understand, especially as the project grows or if multiple entities are introduced.

**In a real-world scenario, I would use more descriptive and domain-specific names** (e.g., `Product`, `ProductDetail`, `Order`, etc.) to improve clarity and maintainability. Due to time constraints and the scope of this technical assessment, I kept the original naming, but I recommend refactoring for better readability in a production environment.

---

## Environment Variables for API Base URL

To make the frontend easily configurable for different environments, the base URL for the backend API is set using an environment variable.

- Create a `.env` file in the `frontend` directory with the following content:
  ```
  REACT_APP_API_BASE_URL=http://localhost:3001
  ```
- An example file `.env.example` is provided. Copy it to `.env` and adjust the value as needed for your environment (e.g., production, staging).
- In the code, the API base URL is accessed via `process.env.REACT_APP_API_BASE_URL`.

This approach allows you to change the backend address without modifying the source code.

---

## Additional Notes

- If you encounter issues with Docker Compose not installing dependencies, run `npm install` manually in both `backend` and `frontend`.
- The project is structured for clarity and maintainability, with clear separation between backend and frontend logic.

---

**Thank you for reviewing this solution!**
   
   