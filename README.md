# 🏋️ GYMNEXUS

GYMNEXUS is a full-stack Gym Management System designed to simplify and automate gym operations such as member management, trainer management, attendance tracking, subscriptions, and diet planning.

The project provides a modern web-based frontend along with a Spring Boot REST API backend and MySQL database.

---
---

## 🎯 Project Objectives

> GYMNEXUS is designed to provide a **smart, secure, and centralized platform** for managing day-to-day gym operations.

| | Objective | Description |
|:---:|:---|:---|
| 🏢 | **Digitize Gym Operations** | Replace traditional manual processes with a centralized digital management system |
| 📝 | **Reduce Manual Record Keeping** | Maintain member, trainer, attendance, subscription, and diet records digitally |
| 👥 | **Simplify Member & Trainer Management** | Easily manage member profiles, trainer details, and trainer assignments |
| 📊 | **Automate Attendance & Subscriptions** | Track attendance and subscription status efficiently |
| 🥗 | **Centralize Diet Management** | Create, manage, and assign personalized diet plans from a single platform |
| 🔐 | **Enhance Security** | Protect application resources using authentication, authorization, and JWT-based security |
| ⚡ | **Build a Scalable Architecture** | Develop a structured full-stack system that can be extended with new features |

---

## 🔮 Future Scope

GYMNEXUS can be further enhanced with advanced features to create a more complete and intelligent fitness management ecosystem.

<table>
<tr>
<td width="50%" valign="top">

**💳 Online Payment Integration**  
Secure online subscription and membership payments

**📧 Email & SMS Notifications**  
Automated reminders for subscriptions and attendance

**📈 Advanced Dashboard & Analytics**  
Graphical insights into members and gym performance

**🏋️ Workout Plan Management**  
Workout creation, assignment, and progress tracking

**📱 Mobile Application**  
Extend GYMNEXUS to Android and iOS platforms

</td>
<td width="50%" valign="top">

**☁️ Cloud Deployment**  
Remote accessibility and horizontal scalability

**📄 Automated Reports**  
Reports for attendance, subscriptions, members, trainers

**👨‍💼 Advanced Admin Analytics**  
Detailed insights and performance metrics

**🤖 AI-Based Recommendations**  
Personalized workout and nutrition suggestions

</td>
</tr>
</table>

---

## 👨‍💻 Author

<div align="center">

### **Abhinav Singh**

🎓 **MCA Student** · GL Bajaj Institute of Technology and Management

💻 Full-Stack Developer

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abhinav-singh-5790a42b5/)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:Abhisiingh8789@gmail.com)

</div>

---


## 🚀 Features

### 👤 Member Management
- Add and manage gym members
- View member details
- Assign trainers
- Manage member subscriptions

### 🏋️ Trainer Management
- Add and manage trainers
- View trainer information
- Assign trainers to members
- Track trainer-related data

### 📅 Attendance Management
- Mark member attendance
- Track attendance records
- View attendance information

### 💳 Subscription Management
- Manage gym subscription plans
- Assign subscriptions to members
- Track subscription status
- Manage subscription expiry

### 🥗 Diet Management
- Create diet templates
- Assign diet plans to members
- Manage diet-related information

### 🔐 Authentication & Security
- User login and signup
- Role-based access
- JWT-based authentication
- Spring Security integration

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- React
- Bootstrap
- Tailwind CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- REST APIs
- Maven

### Database
- MySQL
- Hibernate / JPA

### Tools
- Git
- GitHub
- VS Code
- IntelliJ IDEA / Eclipse

---

## 📂 Project Structure

```text
GYMNEXUS/
│
├── frontend/
│   ├── index.html                  # Landing page (public) + login/signup modal
│   ├── member.html                 # Member portal (protected)
│   ├── admin.html                  # Admin console (protected)
│   │
│   ├── css/
│   │   ├── style.css               # Shared theme (charcoal + blue, dashboards)
│   │   └── landing.css             # Landing-page-only styles (navbar, hero, modal)
│   │
│   ├── js/
│   │   ├── landing.js              # Auth (signup/login), BMI calculator
│   │   ├── member.js               # Member dashboard — profile, attendance, diet
│   │   └── admin.js                # Admin dashboard — members, trainers, diet
│   │
│   └── assets/
│       └── bodybuilder.png         # Hero image
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── gymnexus/
│   │       │           ├── GymnexusBackendApplication.java
│   │       │           │
│   │       │           ├── config/
│   │       │           │   ├── SecurityConfig.java        # Routes, CORS, BCrypt
│   │       │           │   └── DataSeeder.java            # Seeds admin, trainers, diets
│   │       │           │
│   │       │           ├── controller/
│   │       │           │   ├── AuthController.java        # /api/auth
│   │       │           │   ├── MemberController.java      # /api/members
│   │       │           │   ├── TrainerController.java     # /api/trainers
│   │       │           │   ├── AttendanceController.java  # /api/attendance
│   │       │           │   ├── SubscriptionController.java# /api/subscriptions
│   │       │           │   └── DietController.java        # /api/diet
│   │       │           │
│   │       │           ├── dto/
│   │       │           │   ├── SignupRequest.java
│   │       │           │   ├── LoginRequest.java
│   │       │           │   ├── AuthResponse.java
│   │       │           │   ├── MemberResponse.java
│   │       │           │   ├── TrainerRequest.java
│   │       │           │   ├── AssignTrainerRequest.java
│   │       │           │   ├── AttendanceMarkRequest.java
│   │       │           │   ├── AttendanceResponse.java
│   │       │           │   ├── DietAssignRequest.java
│   │       │           │   ├── DietPlanResponse.java
│   │       │           │   └── SubscriptionResponse.java
│   │       │           │
│   │       │           ├── entity/
│   │       │           │   ├── User.java                  # Admin + members (role-based)
│   │       │           │   ├── Role.java                  # ADMIN | MEMBER
│   │       │           │   ├── Trainer.java
│   │       │           │   ├── Subscription.java
│   │       │           │   ├── PlanType.java              # MONTHLY | QUARTERLY | YEARLY
│   │       │           │   ├── Attendance.java
│   │       │           │   ├── DietPlan.java              # Admin-assigned extra plan
│   │       │           │   └── DietTemplate.java          # Auto day-wise plan
│   │       │           │
│   │       │           ├── exception/
│   │       │           │   ├── GlobalExceptionHandler.java
│   │       │           │   ├── ResourceNotFoundException.java
│   │       │           │   └── DuplicateResourceException.java
│   │       │           │
│   │       │           ├── repository/
│   │       │           │   ├── UserRepository.java
│   │       │           │   ├── TrainerRepository.java
│   │       │           │   ├── SubscriptionRepository.java
│   │       │           │   ├── AttendanceRepository.java
│   │       │           │   ├── DietPlanRepository.java
│   │       │           │   └── DietTemplateRepository.java
│   │       │           │
│   │       │           ├── security/
│   │       │           │   ├── JwtUtil.java                   # Token generate/validate
│   │       │           │   ├── JwtAuthFilter.java             # Per-request auth filter
│   │       │           │   └── CustomUserDetailsService.java  # Loads user by phone
│   │       │           │
│   │       │           └── service/
│   │       │               ├── AuthService.java
│   │       │               ├── MemberService.java
│   │       │               ├── TrainerService.java
│   │       │               ├── AttendanceService.java
│   │       │               ├── SubscriptionService.java
│   │       │               ├── DietService.java
│   │       │               └── SubscriptionStatusHelper.java
│   │       │
│   │       └── resources/
│   │           └── application.properties      # MySQL + JPA + JWT config
│   │
│   ├── pom.xml
│   ├── README.md
│   └── .gitignore
│
└── README.md
```

## 🎯 Project Objectives

GYMNEXUS is designed to provide a **smart, secure, and centralized platform** for managing day-to-day gym operations.

- 🏢 **Digitize Gym Operations** — Replace traditional manual processes with a centralized digital management system.
- 📝 **Reduce Manual Record Keeping** — Maintain member, trainer, attendance, subscription, and diet records digitally.
- 👥 **Simplify Member & Trainer Management** — Easily manage member profiles, trainer details, and trainer assignments.
- 📊 **Automate Attendance & Subscription Tracking** — Track attendance and subscription status efficiently.
- 🥗 **Centralize Diet Management** — Create, manage, and assign personalized diet plans from a single platform.
- 🔐 **Enhance Security** — Protect application resources using authentication, authorization, and JWT-based security.
- ⚡ **Build a Scalable Architecture** — Develop a structured full-stack system that can be extended with new features in the future.

---

## 🔮 Future Scope

GYMNEXUS can be further enhanced with advanced features to create a more complete and intelligent fitness management ecosystem.

- 💳 **Online Payment Integration** — Enable secure online subscription and membership payments.
- 📧 **Email & SMS Notifications** — Send automated reminders for subscriptions, attendance, and other important updates.
- 📈 **Advanced Dashboard & Analytics** — Provide graphical insights into members, attendance, subscriptions, and gym performance.
- 🏋️ **Workout Plan Management** — Add workout creation, assignment, and progress tracking.
- 📱 **Mobile Application** — Extend GYMNEXUS to Android and iOS platforms.
- ☁️ **Cloud Deployment** — Deploy the application on cloud platforms for remote accessibility and scalability.
- 📄 **Automated Reports** — Generate reports for attendance, subscriptions, members, trainers, and other gym activities.
- 👨‍💼 **Advanced Admin Analytics** — Provide administrators with detailed insights and performance metrics.
- 🤖 **AI-Based Fitness & Diet Recommendations** — Use AI to provide personalized workout and nutrition recommendations.

---

## 👨‍💻 Author

### **Abhinav Singh**

🎓 **MCA Student**  
🏫 **GL Bajaj Institute of Technology and Management**  
💻 **Full-Stack Developer | Java | Spring Boot | Web Development**

---
## 📜 License

This project is developed for **educational and academic purposes**.

<div align="center">

⭐ **If you found this project helpful, consider giving it a star!** ⭐

</div>
---
