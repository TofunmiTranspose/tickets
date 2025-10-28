# Ticketing Dashboard

A responsive dashboard application for managing support tickets. Users can create, edit, and delete tickets, view ticket statistics, and visualize recent activity with charts. The application supports authentication and persists data using browser local storage.

## 🚀 Features

- **User Authentication** (session-based)
- **Create, Edit, Delete Tickets**
- **Ticket Status Tracking** (Open, In Progress, Closed)
- **Dashboard Analytics**
- **Responsive Sidebar with Mobile Support**
- **Persistent Local Storage**
- **Interactive Chart for Ticket Trends**
- **Toast Notifications**

## 🛠️ Technologies Used

- **React + TypeScript**
- **Tailwind CSS**
- **Local Storage for Persistence**
- **Framer Motion for Animations**
- **React Icons**

## 📁 Project Structure

```
src/
├── components/
├── pages/
│   └── Dashboard.tsx
├── App.tsx
└── index.tsx
```

## 📦 Installation

```bash
npm install
npm run dev
```

## 🔐 Authentication

The dashboard checks for an active session using:

```ts
const session = sessionStorage.getItem("activeUser");
```

If no user is detected, the app redirects to the login page.

## 📊 Ticket Features

Each ticket contains:

- Title
- Description
- Status
- Created Date

Tickets are stored in `localStorage` per user session.

## 📈 Dashboard Analytics

- Total Tickets
- Open Tickets
- Recently Created (last 7 days)
- Activity chart (bar visualization)

## 🧭 Navigation

- Responsive Sidebar
- Sidebar options for Dashboard, Tickets, Analytics, and Settings

## 💾 Local Storage Schema

```json
{
  "tickets_<username>": [
    {
      "id": "12345",
      "title": "Fix login bug",
      "description": "User cannot login with Google",
      "status": "open",
      "createdAt": "2025-01-01T10:00:00"
    }
  ]
}
```

## 📌 Future Improvements

- Firebase backend integration
- User roles & permissions
- Real-time updates

## ✨ How to Contribute

1. Fork the repo
2. Create a new feature branch
3. Submit a PR

## 📄 License

This project is licensed under the MIT License.
