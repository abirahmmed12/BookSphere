import React from 'react'
import Navbar from '../components/Navbar'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cards from "../components/Cards"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SENTIMENT_API = import.meta.env.VITE_API_ML_URL;

function BookDescription() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [review, setReview] = useState("");
    const [sentiment, setSentiment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [error, setError] = useState(null);
    const [sentimentLoading, setSentimentLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/book/${id}`)
            .then(response => {
                setBook(response.data);
                setImageError(false);
            })
            .catch(error => {
                console.error("Error fetching book details:", error);
            });
    }, [id]);

    useEffect(() => {
        if (!book || !book.title) return;
        
        setLoading(true);
        setError(null);
        
        axios.post(`${SENTIMENT_API}/recommend`, { title: book.title })
            .then(res => {
                setRecommendedBooks(res.data.recommended_books || []);
                setLoading(false);
            })
            .catch(err => {
                setRecommendedBooks([]);
                setError(err.response?.data?.error || "Failed to load recommendations");
                setLoading(false);
            });
    }, [book?.title]);

    const analyzeSentiment = async () => {
        if (!review.trim()) return;
        
        setSentimentLoading(true);
        try {
            const response = await axios.post(`${SENTIMENT_API}/analyze`, { review });
            setSentiment(response.data.sentiment);
        } catch (error) {
            console.error("Error analyzing sentiment:", error);
        } finally {
            setSentimentLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const handleImageError = () => {
        setImageError(true);
    };

    if (!book) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                            <div className="relative border-4 border-blue-600 border-t-transparent rounded-full w-20 h-20 animate-spin"></div>
                        </div>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                            Loading book details...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                }
            }
        ]
    };

    const getSentimentIcon = (sentiment) => {
        if (sentiment === 'positive') {
            return (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        } else if (sentiment === 'negative') {
            return (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        } else {
            return (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <Link to="/books" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Books
                            </Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
                                {book.title}
                            </span>
                        </nav>
                    </div>
                </div>

                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    {/* Book Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-12">
                        <div className="flex flex-col lg:flex-row">
                            {/* Book Image Section */}
                            <div className="lg:w-2/5 p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                                <div className="relative group">
                                    {imageError ? (
                                        <div className="w-72 h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-2xl">
                                            <div className="text-center p-6">
                                                <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <p className="text-gray-500 dark:text-gray-400">Image not available</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                className="w-72 h-96 object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                                                onError={handleImageError}
                                            />
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Book Details Section */}
                            <div className="lg:w-3/5 p-8 lg:p-12">
                                {/* Category Badge */}
                                <div className="inline-flex items-center px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {book.category}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {book.title}
                                </h1>

                                {/* Author */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {book.author?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Written by</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {book.author}
                                        </p>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    {book.year_of_publication && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Published</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {book.year_of_publication}
                                            </p>
                                        </div>
                                    )}
                                    {book.publisher && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Publisher</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {book.publisher}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                        About this book
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Read Now
                                    </button>
                                    <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Save
                                    </button>
                                    <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                You might also like
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                                <div className="relative w-16 h-16 mb-4">
                                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                                    <div className="relative border-4 border-blue-600 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">Finding similar books...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-bold text-red-700 dark:text-red-300 mb-2">Error loading recommendations</p>
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        ) : recommendedBooks && recommendedBooks.length > 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <Slider {...sliderSettings}>
                                    {recommendedBooks.map((item) => (
                                        <div key={item._id || item.id} className="px-2">
                                            <Link to={`/books/${item._id}`}>
                                                <Cards item={item} />
                                            </Link>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                                <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No recommendations available yet</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Check back later for similar books!</p>
                            </div>
                        )}
                    </div>

                    {/* Sentiment Analysis Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 lg:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Share Your Review</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered sentiment analysis</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                placeholder="What did you think about this book? Share your thoughts..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows="5"
                            ></textarea>

                            <button
                                onClick={analyzeSentiment}
                                disabled={!review.trim() || sentimentLoading}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {sentimentLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Analyze Sentiment
                                    </>
                                )}
                            </button>

                            {/* Sentiment Result */}
                            {sentiment && (
                                <div className={`mt-6 p-6 rounded-2xl border-2 ${
                                    sentiment === 'positive' 
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                        : sentiment === 'negative'
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                } animate-fadeIn`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                            sentiment === 'positive' 
                                                ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' 
                                                : sentiment === 'negative'
                                                ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300'
                                                : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300'
                                        }`}>
                                            {getSentimentIcon(sentiment)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Sentiment Analysis Result
                                            </p>
                                            <p className={`text-2xl font-bold ${
                                                sentiment === 'positive' 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : sentiment === 'negative'
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookDescription