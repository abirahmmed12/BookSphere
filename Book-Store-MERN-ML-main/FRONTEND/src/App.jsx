import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import BookList from './components/BookList';
import ContactUs from './components/ContactUs';
import BookDescription from './components/BookDescription';
import Login from './home/Login';
import Registration from './home/Registration';

function App() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-900 dark:text-white">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/books/:id" element={<BookDescription />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
