# CampusCare — Master Build Prompt for GitHub Copilot

> Paste this whole file into Copilot Chat (or use it as `.github/copilot-instructions.md` in the repo root so Copilot always has this context). Build in the phases listed at the bottom — don't ask Copilot to generate everything in one shot.

---

## 1. Project Overview

Build **CampusCare**, a full-stack MERN web application that lets college students report campus issues (electrical, plumbing, internet, etc.), lets staff resolve them, and lets admins manage users, assignments, and analytics.

Three roles: **Student**, **Staff**, **Admin** — each with a separate dashboard and permission set.

---

## 2. Tech Stack

**Frontend**
- React.js (Vite, not CRA)
- Tailwind CSS
- React Router v6
- Axios
- React Hook Form + Zod (for form validation)
- Recharts (for admin analytics charts)

**Backend**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT for auth, bcryptjs for password hashing
- Multer + Cloudinary for image uploads
- express-validator for request validation
- cors, dotenv, morgan (dev logging)

**Deployment target**
- Frontend → Vercel
- Backend → Render
- DB → MongoDB Atlas
- Images → Cloudinary

---

## 3. Folder Structure

```
campuscare/
├── client/                # React app
│   ├── src/
│   │   ├── api/            # axios instance + endpoint functions
│   │   ├── components/     # shared UI (Button, Card, Table, Navbar, Sidebar, etc.)
│   │   ├── context/         # AuthContext
│   │   ├── layouts/         # StudentLayout, StaffLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── student/
│   │   │   ├── staff/
│   │   │   └── admin/
│   │   ├── routes/          # ProtectedRoute, RoleRoute
│   │   ├── utils/
│   │   └── App.jsx
│   └── tailwind.config.js
│
└── server/                # Express API
    ├── config/            # db.js, cloudinary.js
    ├── controllers/
    ├── middleware/        # auth.js, role.js, errorHandler.js, upload.js
    ├── models/            # User.js, Complaint.js
    ├── routes/
    ├── utils/
    └── server.js
```

---

## 4. Design System / Color Theme

Give it a **clean, trustworthy "modern campus" feel** — not generic bootstrap blue.

**Palette:**
| Purpose | Color | Hex |
|---|---|---|
| Primary (brand) | Indigo | `#4F46E5` |
| Primary Dark (hover) | Deep Indigo | `#4338CA` |
| Secondary / Accent | Teal | `#14B8A6` |
| Success | Emerald | `#10B981` |
| Warning / Pending | Amber | `#F59E0B` |
| Danger / Urgent | Rose | `#F43F5E` |
| Background | Off-white | `#F8FAFC` |
| Surface / Card | White | `#FFFFFF` |
| Border | Slate | `#E2E8F0` |
| Text Primary | Slate 800 | `#1E293B` |
| Text Secondary | Slate 500 | `#64748B` |

**Status badge colors:**
- Pending → Amber
- In Progress → Indigo/Blue
- Resolved → Emerald
- Priority High → Rose, Medium → Amber, Low → Slate

**Typography:** `Inter` or `Poppins` from Google Fonts. Headings semi-bold, body regular.

**UI feel:** rounded-xl cards, soft shadows (`shadow-sm`/`shadow-md`), generous whitespace, subtle hover transitions. Sidebar navigation for logged-in roles, top navbar for public pages.

---

## 5. Database Models

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String, // bcrypt hashed
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  department: String,
  rollNumber: String,      // students only
  year: String,            // students only
  employeeId: String,      // staff only
  phone: String,
  profilePicture: String,
  isActive: { type: Boolean, default: true }, // for disable/enable
  createdAt: Date
}
```

### Complaint
```js
{
  title: String,
  description: String,
  category: { type: String, enum: ['Electrical','Plumbing','Furniture','Internet','Cleaning','Others'] },
  location: String,
  priority: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  status: { type: String, enum: ['Pending','Assigned','In Progress','Resolved'], default: 'Pending' },
  image: String,
  completionImage: String,
  studentId: { type: ObjectId, ref: 'User' },
  assignedTo: { type: ObjectId, ref: 'User' },
  staffNotes: String,
  timeline: [{ status: String, note: String, date: Date }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. Auth Rules

- Only students can self-register via `/register`.
- Staff and Admin accounts are created only by Admin (`POST /api/users/staff`).
- JWT stored in httpOnly cookie (preferred) or localStorage — pick one and be consistent.
- Middleware: `protect` (verifies JWT) and `authorize(...roles)` (checks role).
- Passwords hashed with bcrypt before save (Mongoose pre-save hook).

---

## 7. API Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | /api/auth/register | Register student | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/profile | Get profile | Authenticated |
| PUT | /api/auth/profile | Update profile | Authenticated |
| PUT | /api/auth/change-password | Change password | Authenticated |
| POST | /api/complaints | Create complaint | Student |
| GET | /api/complaints/my | My complaints | Student |
| GET | /api/complaints | All complaints | Admin |
| GET | /api/complaints/assigned | Assigned complaints | Staff |
| GET | /api/complaints/:id | Complaint details | Authorized |
| PUT | /api/complaints/:id | Edit complaint | Student/Admin |
| DELETE | /api/complaints/:id | Delete complaint | Admin |
| PUT | /api/complaints/:id/assign | Assign staff | Admin |
| PUT | /api/complaints/:id/priority | Set priority | Admin |
| PUT | /api/complaints/:id/status | Update status | Staff |
| PUT | /api/complaints/:id/notes | Add notes | Staff |
| POST | /api/users/staff | Create staff | Admin |
| GET | /api/users | List users | Admin |
| PUT | /api/users/:id | Update user | Admin |
| DELETE | /api/users/:id | Disable/Delete user | Admin |
| GET | /api/dashboard/student | Student dashboard stats | Student |
| GET | /api/dashboard/staff | Staff dashboard stats | Staff |
| GET | /api/dashboard/admin | Admin dashboard stats | Admin |

---

## 8. Pages (by role)

**Public:** Landing (`/`), Login (`/login`), Student Register (`/register`)

**Student:** Dashboard, New Complaint, My Complaints (table w/ search, filter, sort), Complaint Details (with status timeline), Profile

**Staff:** Dashboard, Assigned Complaints (table + filters), Complaint Details (Start Work / Mark In Progress / Mark Resolved buttons), Update Complaint (status + notes + completion image), Profile

**Admin:** Dashboard (with charts), All Complaints, Complaint Details, Assign Complaint, Manage Students, Manage Staff, Reports & Analytics (Export PDF/CSV), Profile

Full field-level breakdown for every page is already specified in the source doc — Copilot should follow that structure exactly (card layouts, table columns, form fields, buttons) rather than inventing new fields.

---

## 9. Coding Conventions for Copilot to Follow

- Functional React components + hooks only. No class components.
- One component per file. Keep components under ~200 lines; extract subcomponents if larger.
- Centralize all API calls in `client/src/api/` — pages should never call `axios` directly.
- Use `AuthContext` for user/role/token state; wrap protected routes with `ProtectedRoute` + `RoleRoute`.
- Backend: controller functions wrapped in try/catch, errors passed to a centralized `errorHandler` middleware — no inline error responses scattered everywhere.
- Validate all incoming request bodies with `express-validator` before hitting controller logic.
- Environment variables via `.env` (never hardcode Mongo URI, JWT secret, or Cloudinary keys).
- Consistent REST response shape: `{ success: true/false, data, message }`.

---

## 10. Build Order (do this in phases, not all at once)

1. **Scaffold** — Initialize `client` (Vite + React + Tailwind) and `server` (Express) folders with the structure above. Set up `.env`, `db.js` Mongo connection, and a basic `server.js` with a health-check route.
2. **Models + Auth** — Build `User` model, register/login/JWT middleware, and test with Postman/Thunder Client before touching the frontend.
3. **Complaint model + core CRUD** — Create complaint, get my complaints, get by id.
4. **Student frontend** — Auth pages (login/register), Student layout + Dashboard, New Complaint form, My Complaints table, Complaint Details page.
5. **Staff routes + frontend** — Assigned complaints, status/notes update endpoints, Staff dashboard and pages.
6. **Admin routes + frontend** — User management, assign/priority endpoints, Admin dashboard with charts, Manage Students/Staff, Reports page.
7. **Polish** — Landing page, profile pages for all roles, image upload via Cloudinary, loading/empty/error states, responsive check on mobile.
8. **Deploy** — Push to GitHub, deploy client to Vercel, server to Render, connect Atlas + Cloudinary env vars.

Work through one phase at a time and confirm each phase runs correctly before moving to the next.
