# PhongTro365 – Online Room Rental Platform

An online room rental platform featuring a booking system, invoice management, interactive maps, and a dedicated admin dashboard.

## Features

### User

- **Create Rental Listings** — add title, address, area, price, description, amenities, and contract duration
- **Booking System** — request booking, cancel booking, landlord can approve/reject
- **Rental Management** — extend contracts, request termination, respond to requests
- **Invoices** — create and view invoices for each booking
- **Comments & Reviews** — leave a review after renting
- **Notifications** — real-time notifications with infinite scroll and unread badge counter
- **Report Violations** — report inappropriate listings

### Admin

- **Separate Admin Login** with a dedicated authentication token
- **Admin Management** — first admin can self-register; subsequent admins require verification
- **Post Management** — view all listings and remove violating posts
- **Report Handling** — review and resolve user reports
- **User Management** — view users and add them to blacklist

---

## Project Structure

```
phongtro365/
├── api/                    # Backend (Express.js)
│   ├── index.js            # Entry point, server configuration
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── routes/
│   │   ├── Admin.js        # Admin APIs
│   │   ├── Bookings.js     # Booking & invoice APIs
│   │   ├── Posts.js        # Posts, comments, favorites, notifications APIs
│   │   └── Users.js        # Authentication & user management APIs
│   └── uploads/            # Uploaded images directory
│
└── client/                 # Frontend (React + Vite)
    └── src/
        ├── main.jsx        # Entry point, admin/user routing
        ├── user/           # User module
        │   ├── App.jsx     # User routes
        │   ├── components/ # Reusable components
        │   └── pages/      # Main pages
        └── admin/          # Admin module
            ├── AdminApp.jsx
            ├── components/
            └── pages/
```

---

## Installation & Setup

### Requirements

- **Node.js** >= 18
- **MySQL** >= 8.0
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone <repository-url>
cd phongtro365
```

### 2. Install dependencies

```bash
# Install all dependencies (root + api + client)
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `api/` directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/phongtro365"
JWT_SECRET="your-jwt-secret-key"
CLIENT_URL="http://localhost:5173"
PORT=4000

# Email (for forgot password feature)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

Create a `.env` file in the `client/` directory (if needed):

```env
VITE_API_URL="http://localhost:4000"
```

### 4. Initialize the Database

```bash
cd api
npx prisma migrate dev
npx prisma generate
```

### 5. Run the Project

#### Development Mode

```bash
# Terminal 1 - Backend
cd api
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

#### Production Mode

```bash
# Build and start
npm run build
npm start
```

> In production mode, Express serves the static files from `client/dist/`.

---

## Database Schema

The system uses **MySQL** with **Prisma ORM**, including the following main models:

| Model          | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `Admin`        | Administrator (supports self-relation for admin creation)   |
| `User`         | User (status: ACTIVE, BLACKLISTED, DEACTIVATED)             |
| `Place`        | Rental listing (status: SEE, HIDDEN, DELETE)                |
| `PlacePhoto`   | Listing images                                              |
| `PlacePerk`    | Room amenities                                              |
| `Booking`      | Booking (status: PENDING, APPROVED, REJECTED, WAIT, RENTED) |
| `Invoice`      | Invoice for each booking                                    |
| `InvoicePhoto` | Invoice attachments                                         |
| `Comment`      | Comment (one per booking)                                   |
| `Report`       | Violation report (status: PENDING, DONE)                    |
| `Favourite`    | Favorite list (unique per user-place)                       |
| `Notification` | In-app notifications                                        |
