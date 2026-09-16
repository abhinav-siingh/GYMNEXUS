# GymNexus Backend

Spring Boot + MySQL backend for the GymNexus fitness club management system.

## Prerequisites
- JDK 17+
- Maven 3.8+
- MySQL 8 running locally

## Setup
1. In `src/main/resources/application.properties`, set your MySQL username/password
   (the database `gymnexus_db` is auto-created).
2. Run:
   ```
   mvn spring-boot:run
   ```
3. Server starts on `http://localhost:8080`.

## Default Admin (seeded automatically on first run)
- Phone: `9999999999`
- Password: `admin123`
- **Change this before going live** — check the console log on first startup for the warning.

## Auth
- `POST /api/auth/signup` — members only. Body: `{ name, phone, password, plan }` (`plan`: monthly|quarterly|yearly)
- `POST /api/auth/login` — works for both member and admin. Body: `{ phone, password }`
- Both return `{ token, role, id, name }`. Send `Authorization: Bearer <token>` on every other request.

## Member endpoints (role: MEMBER)
- `GET /api/members/me` — own profile, plan, status, trainer
- `GET /api/subscriptions/me` / `POST /api/subscriptions/me/renew`
- `POST /api/attendance/checkin` / `GET /api/attendance/me`
- `GET /api/diet/today` — auto day-wise plan (everyone)
- `GET /api/diet/me/additional` — trainer's extra plan, if any

## Admin endpoints (role: ADMIN)
- `GET /api/members` — full member list
- `PUT /api/members/{id}/trainer` — body `{ trainerId }`
- `POST /api/trainers` / `DELETE /api/trainers/{id}`
- `GET /api/attendance/today` / `POST /api/attendance/mark` — body `{ memberId }`
- `POST /api/diet/assign` — body `{ memberId, trainerId, details }`

## Connecting the existing frontend
Replace the `localStorage`-based demo logic in `landing.js`, `member.js`, and `admin.js`
with `fetch()` calls to these endpoints, storing the returned JWT (e.g. in a variable
or `sessionStorage`) and sending it as `Authorization: Bearer <token>` on subsequent calls.
