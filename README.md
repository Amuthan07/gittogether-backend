GitTogether💚

GitTogether is a production‑ready backend platform for developers and IT professionals to connect through dating, networking, and project collaboration. It is built with NestJS, MongoDB, and JWT-based authentication, and showcases real‑world backend architecture patterns including secure auth, role-based access control, search, and matching systems.

⸻

✨ Features

🔐 Authentication & Security
	•	JWT authentication with access + refresh tokens
	•	Refresh token rotation and revocation (logout supported)
	•	Role‑based access control (User / Admin)
	•	Resource ownership enforcement
	•	Swagger Bearer authentication

👤 Profiles
	•	Create / update / delete profiles
	•	Fields include tech stack, role, experience, mode, and location
	•	Profile completion logic

🔍 Search & Filtering
	•	Filter profiles by:
	•	Role
	•	Tech stack
	•	Experience
	•	Mode (dating / networking / projects)
	•	City
	•	Pagination support
	•	MongoDB indexes for query performance

🤝 Matching System (Unified Connections Model)
	•	Dating → mutual likes → automatic match
	•	Networking → request → accept
	•	Projects → invite → accept
	•	Single connections collection with:
	•	fromUser
	•	toUser
	•	mode
	•	status (pending / accepted / rejected)

🧑‍⚖️ Admin APIs
	•	View all users
	•	Promote users to admin
	•	View / delete any profile
	•	Fully protected using RolesGuard

📘 Developer Experience
	•	Swagger (OpenAPI) documentation
	•	Modular NestJS architecture
	•	DTO-based validation
	•	Centralized error handling

☁️ Deployment
	•	MongoDB Atlas (cloud database)
	•	Hosted backend on Render
	•	Environment-based configuration

⸻

🧱 Tech Stack
	•	Backend: NestJS (TypeScript)
	•	Database: MongoDB + Mongoose
	•	Authentication: JWT (access + refresh tokens)
	•	Validation: class-validator / class-transformer
	•	API Docs: Swagger (OpenAPI)
	•	Hosting: Render
	•	Database Hosting: MongoDB Atlas

⸻

🏗 Architecture Overview

src/
 ├── auth/           # JWT auth, refresh tokens, guards
 ├── users/          # User schema & logic
 ├── profiles/       # Profiles + search
 ├── connections/    # Matching system
 ├── admin/          # Admin-only APIs
 ├── common/         # Decorators & shared utilities

Authentication Flow

Signup → Login → Access Token + Refresh Token
Access expires → /auth/refresh → new access token
Logout → refresh token revoked

Authorization is enforced using:
	•	JwtAuthGuard (authentication)
	•	RolesGuard (admin access)
	•	Service-level ownership checks

⸻

🔐 Environment Variables

Create a .env file:

MONGO_URI=your_mongodb_atlas_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXP=15m
JWT_REFRESH_EXP=7d


⸻

▶️ Running Locally

npm install
npm run start:dev

Swagger UI:

http://localhost:3000/swagger


⸻

🌍 Live API

Add your deployed backend URL here:

https://gittogether-backend-p75s.onrender.com/api


⸻

🧪 Example API Usage

Login

POST /auth/login

{
  "email": "user@test.com",
  "password": "password"
}


⸻

Search Profiles

GET /profiles/search?role=frontend&city=Chennai


⸻

Send Connection

POST /connections/{toUserId}

{
  "mode": "dating"
}


⸻

💡 Key Engineering Highlights
	•	JWT refresh token lifecycle with rotation and revocation
	•	Unified matching model supporting multiple connection modes
	•	Dynamic MongoDB search queries backed by indexes
	•	Role-based admin APIs using Guards and Decorators
	•	Clear separation of concerns across Auth, Profiles, Connections, and Admin modules

⸻

📈 Resume Summary

Built and deployed a NestJS backend featuring JWT authentication with refresh token rotation, role-based admin APIs, advanced profile search, and a unified matching system for dating, networking, and project collaboration, backed by MongoDB Atlas and hosted on Render.

⸻

🚀 Future Improvements
	•	Profile recommendations
	•	Messaging after match
	•	Rate limiting
	•	Automated tests
	•	CI/CD pipeline
	•	Frontend integration

⸻

👨‍💻 Author

Amuthan CP

Backend Engineer | SDET → Full stack dev | Full‑Stack Learner

⸻

If you found this project interesting, feel free to ⭐ the repo or reach out.
