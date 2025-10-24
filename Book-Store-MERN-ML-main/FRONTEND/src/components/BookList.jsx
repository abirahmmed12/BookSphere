import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Cards from '../components/Cards';
import axios from 'axios';
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BookList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Philosophy', 'Self-Help', 'Programming', 'Young Adult'];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/book`);
                setBooks(res.data);
                setFilteredBooks(res.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterBooks(query, selectedCategory);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        filterBooks(searchQuery, category);
    };

    const filterBooks = (query, category) => {
        let filtered = books;

        // Filter by search query
        if (query) {
            filtered = filtered.filter((book) =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (category !== 'All') {
            filtered = filtered.filter((book) =>
                book.category === category
            );
        }

        setFilteredBooks(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setFilteredBooks(books);
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold">
                                Discover Your Next Great Read
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                                Explore our vast collection of {books.length}+ books across multiple genres
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto mt-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 pr-12 text-gray-900 placeholder-gray-500 bg-white rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                                        placeholder="Search by title or author..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <svg
                                            className="w-6 h-6 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filter Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Categories */}
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Filter by Category
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryChange(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                                selectedCategory === category
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* View Mode & Clear Filters */}
                            <div className="flex items-center gap-4">
                                {/* View Mode Toggle */}
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-full transition-all duration-200 ${
                                            viewMode === 'grid'
                                                ? 'bg-white dark:bg-gray-600 shadow-md'
                                                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        title="Grid View"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-full transition-all duration-200 ${
                                            viewMode === 'list'
                                                ? 'bg-white dark:bg-gray-600 shadow-md'
                                                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        title="List View"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Clear Filters Button */}
                                {(searchQuery || selectedCategory !== 'All') && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredBooks.length}</span> of{' '}
                                <span className="font-bold text-gray-900 dark:text-white">{books.length}</span> books
                                {selectedCategory !== 'All' && (
                                    <span className="ml-2">
                                        in <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedCategory}</span>
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Book List */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
                            </div>
                            <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">
                                Loading amazing books...
                            </p>
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div
                            className={`${
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                    : 'flex flex-col gap-4'
                            }`}
                        >
                            {filteredBooks.map((item) => (
                                <Link
                                    key={item._id || item.id}
                                    to={`/books/${item._id}`}
                                    className="transform transition-all duration-300 hover:scale-105"
                                >
                                    <Cards item={item} viewMode={viewMode} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                No Books Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                                We couldn't find any books matching your search. Try adjusting your filters or search terms.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default BookList;