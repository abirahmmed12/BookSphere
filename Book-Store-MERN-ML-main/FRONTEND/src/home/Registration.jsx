import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile, getAuth } from "firebase/auth";

import { AuthContext } from "../../vite-project/src/AuthProvider/AuthProvider";

const Registration = () => {
  const { createuser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await createuser(email, password);

      // Update user's displayName
      await updateProfile(userCredential.user, { displayName: name });

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-10 flex justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Sign Up</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-800 dark:text-gray-200">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-800 dark:text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-800 dark:text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        <p className="mt-4 text-xs text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
