# 📚 Book-Store-MERN-ML

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) book store integrated with **Machine Learning** for personalized recommendations and sentiment analysis.

---

## 💡 Features

- 📖 Book Catalog CRUD (Create, Read, Update, Delete)
- 🤖 Book Recommendation System (ML-powered)
- 🧠 Sentiment Analysis on Book Reviews
- 🔒 User Authentication
- ⚡ Real-time Feedback on Reviews
- 🖥️ Responsive and User-Friendly Interface

---

## 🧱 Tech Stack

- **Frontend**: React.js, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: MongoDB + Mongoose
- **Machine Learning**: Python (NLP, Scikit-learn, NLTK / Transformers)
- **Hosting**: Vercel (Frontend), Render (Backend), ML Model (Flask API)

---

## 🚀 Live Demo

👉 [Live Site](https://bookstore-ml.vercel.app)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- Python 3.x + pip

### Clone the Repo

```bash
git clone https://github.com/SahilMalavi/Book-Store-MERN-ML.git
cd Book-Store-MERN-ML
```

⚙️ Backend Setup
```bash

cd backend
npm install
cp .env.example .env  # Fill in your MongoDB URI and JWT secret
npm run dev
```

💻 Frontend Setup
```bash

cd frontend
npm install
cp .env.example .env  # Set REACT_APP_API_URL=http://localhost:5000
npm start
```


🤖 ML Model Setup
```bash

cd ml-model
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python train_model.py
python app.py  # Runs Flask API for ML model
```

## ✨ Future Enhancements

- 🧬 Deep Learning for better sentiment & recommendations
- 📊 Analytics dashboard for admin
- 🌐 Dockerize backend + ML model
- 🔁 GitHub Actions CI/CD
---

## 🤝 Contributing

- Fork the repo
- Create a feature branch
- Commit your changes
- Open a Pull Request
---

👨‍💻 Author
- Made with ❤️ by Sahil Malavi
