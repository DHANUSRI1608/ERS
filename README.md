## Expense Reporting System

> A full-stack web application for managing employee expense reimbursements, built with React and Spring Boot.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat&logo=apache-maven&logoColor=white)

---

## Tech Stack 🎯

**Frontend**
- React
- React Router
- Vite
- Custom CSS

**Backend**
- Spring Boot
- REST APIs
- MySQL 
- Maven

---

## Project Structure

```
ERS/
├── frontend/                   # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── index.html
└── backend/                    # Spring Boot app
    └── src/main/
        ├── java/               # Controllers, Services, Repositories
        └── resources/          # application.properties
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ERS.git
cd ERS
```

### 2. Run the backend (Spring Boot)

```bash
# macOS / Linux
cd backend
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 3. Run the frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## User Roles

| Role | Access |
|---|---|
| **Admin** | Full access - users, reports, settings, permissions |
| **Analyst** | Upload requests, Builder module, Reports |
| **User** | Dashboard, personal Reports |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/logout` | End session |
| `GET` | `/api/reports` | List all reports |
| `POST` | `/api/expenses` | Submit a new expense |
| `GET` | `/api/expenses/:id` | Get expense details |
| `PATCH` | `/api/expenses/:id` | Update expense status (Admin) |
| `GET` | `/api/admin/users` | Manage users (Admin) |

---
> If you find this project useful, give it a ⭐ on GitHub — it helps others discover it too!
