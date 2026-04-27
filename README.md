# 🍳 CookBook – Your Virtual Kitchen Assistant

CookBook is a full-stack web application that helps users discover, create, and manage recipes. It provides personalized recommendations based on ingredients and user preferences, making cooking easier and smarter.

---

## 🚀 Features

* 🔍 Search recipes by name, ingredients, or cuisine
* 📖 View detailed recipe instructions
* ❤️ Save and manage favorite recipes
* ✍️ Create, edit, and delete custom recipes
* 🎯 Personalized recipe recommendations
* 🔐 Secure user authentication (JWT)
* 💬 Feedback & Support system (EmailJS integration)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt

### Database

* MongoDB
* Mongoose

### Tools

* Git & GitHub
* Postman
* VS Code

---

## 📂 Project Structure

```
project/
│
├── frontend/      # React frontend
├── backend/       # Node.js backend
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/cookbook-mern.git
cd cookbook-mern
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the **frontend** folder:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_SUPPORT_TEMPLATE=your_support_template
VITE_EMAILJS_FEEDBACK_TEMPLATE=your_feedback_template
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

⚠️ Do NOT commit `.env` file. Use `.env.example` instead.

---

## 🔄 Project Flow

1. User registers and logs in
2. Searches recipes by ingredients or cuisine
3. Views detailed recipe steps
4. Saves or creates custom recipes
5. System recommends recipes based on preferences

---

## 🎯 Future Enhancements

* 🤖 AI-based recipe recommendations
* 🛒 Grocery list generator
* 🎤 Voice-based search
* 🌙 Dark mode

---

## 📸 Screenshots

(Add your project screenshots here)

---

## 👨‍💻 Author

Preetham

---

## ⭐ Contributing

Feel free to fork this repo and contribute!

---

## 📄 License

This project is for educational purposes.
