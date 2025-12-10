
# TravellaRwanda – Hotel Booking System

TravellaRwanda is a modern hotel booking platform designed to help travelers easily discover, compare, and book the best hotels across Rwanda.  
Whether exploring Kigali, Rubavu, Musanze, Nyagatare, or other destinations, Travella provides a seamless search, booking, and payment experience for users — and powerful hotel management tools for administrators.

---

##  Features

###  User Features
- Browse hotels across Rwanda (Kigali, Rubavu, Musanze, Nyagatare, etc.)
- View hotel details: amenities, pricing, room types, and availability
- Create an account and log in securely
- Two-Factor Authentication (2FA) via email verification code
- Book rooms and make secure payments
- View booking history
- Reset forgotten passwords via email

###  Admin Features
- Manage hotels, rooms, and hotel information
- View number of bookings per hotel
- Track occupied vs available rooms
- Monitor payments and revenue
- Manage guests and reservations
- Dashboard analytics for hotel performance

---

##  Technologies Used

### Backend
- **Java**
- Spring Boot (if applicable)
- PostgreSQL / MySQL (your DB)
- JPA / Hibernate
- Java Mail (for 2FA and password reset)

### Frontend
- **React.js**
- JavaScript / TypeScript
- TailwindCSS or Bootstrap (if applicable)
- Axios for API calls

### Other Tools
- Postman (API testing)
- Maven (backend build tool)
- Git & GitHub

---

##  Project Structure

### Backend (Java)

src/
├── config/
├──controller/
├── dto/
├── exception/
├── model/
├── repository/
├── security/
├── service/
├── uploads/
└── resources/


### Frontend (React)

src/
├── assets/
├── components/
└── pages

---

##  Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/samira00221/travella-rwanda.git
cd travella-rwanda
````

---

## Backend Setup (Java)

### Install Dependencies

```bash
mvn clean install
```

### Environment Variables

Create an `.env` or include in `application.properties`:

```
DB_URL=jdbc:postgresql://localhost:5432/hotelDB
DB_USERNAME=postgres
DB_PASSWORD=samira@25510

EMAIL_USERNAME=email
EMAIL_PASSWORD=email_app_password
JWT_SECRET=your_secret_key
```

### Run Backend

```bash
mvn spring-boot:run
```

---

## Frontend Setup (React)

### Install Dependencies

```bash
npm install
```

### Run App

```bash
npm start
```

---

## Database Entities

* **Hotel**
* **Room**
* **Guest**
* **Booking**
* **Payment**
* **User (Authentication)**

---

## Security

* Email-based **Two-Factor Authentication (2FA)**
* JWT authentication (if used)
* Password hashing (BCrypt)
* Role-based access control: `USER`, `ADMIN`

---

## Future Enhancements

* Mobile application
* Google Maps hotel location integration
* Review & rating system
* Loyalty points for frequent travelers

---

##  Author

**Ndimbati Samira**
Hotel Booking System Developer
Backend & Cloud Enthusiast | Rwanda

---


##  Acknowledgments

* Rwanda tourism & travel inspirations
* Open-source community
* My AUCA peers
