# Complaint Management System

A full-stack complaint management system with a public submission page and an internal dashboard for managing complaints.  
Built with **React + TypeScript + Vite** for the frontend and **Node.js + Express + Supabase** for the backend.

---

## Backend Setup (Node + Express + Supabase)

The backend provides API endpoints to interact with the Supabase database.

## API Endpoints Implemented 

GET /api/complaints – Fetch all complaints

POST /api/complaints – Submit a new complaint

PATCH /api/complaints/:id – Update complaint status

DELETE /api/complaints/:id – Delete a complaint

### Steps 
1. Navigate to the backend folder:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
3. Start the backend server:
   ```bash
   npm run dev
Server will run on http://localhost:5001.

## Frontend Setup (React + TypeScript + Vite)

The frontend uses Vite for fast development and HMR. Tailwind CSS is used for styling.

### Steps

1. Navigate to the frontend folder:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3. Start the frontend server:
   ```bash
   npm run dev
The app will run on http://localhost:5173.

## Assumptions and Tradeoffs 
1. The backend and frontend systems are assumed to run on localhost with the environment variables controling URL endpoints
2. The backend server is assumed to be running and reachable before the frontend requests occur
3. The backend system relies on Supabase for database operations, so assume reliable external connectivity and service time. However, this increases dependency on a third-party, which could increase latency
4. There are minimal security features and protection against invalid fields required when scaling a product


## Additional Project Improvements
1. Sending email notifications once a complaint is submitted and when the status changes
2. Include an internal data analytics tabs to identify trends in complaints
3. Implemet an authentication system to access the Internal Dashboard for admins
