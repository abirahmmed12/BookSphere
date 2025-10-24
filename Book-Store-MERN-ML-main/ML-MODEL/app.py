from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import os
from dotenv import load_dotenv
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "*"  # We'll restrict this after frontend deployment
        ]
    }
})

analyzer = SentimentIntensityAnalyzer()

# Connect to MongoDB - with fallback
MONGO_URI = os.getenv("mongoDbURI") or "mongodb+srv://final:5gidb4iSh8E1cuMN@cluster0.x8pzcmr.mongodb.net/bookStore?retryWrites=true&w=majority&appName=Cluster0"

print(f"🔌 Connecting to MongoDB...")
print(f"📍 Using URI: {MONGO_URI[:60]}...")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    client.server_info()
    print("✅ Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"❌ Failed to connect: {e}")
    raise

db = client["test"]
collection = db["newbooks"] # CHANGED: from "newbooks" to "books"

def fetch_books_from_db():
    """Fetch books from MongoDB and return as a DataFrame."""
    try:
        books_data = list(collection.find({}, {
            "_id": 1, 
            "isbn": 1, 
            "title": 1, 
            "author": 1, 
            "year_of_publication": 1, 
            "publisher": 1, 
            "image": 1, 
            "description": 1, 
            "category": 1
        }))
        
        print(f"📚 Fetched {len(books_data)} books from database")
        
        for book in books_data:
            book['_id'] = str(book['_id'])
        
        return pd.DataFrame(books_data)
    except Exception as e:
        print(f"❌ Error fetching books: {e}")
        return pd.DataFrame()

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the Book Recommendation API",
        "endpoints": {
            "/books": "GET - List all books",
            "/recommend": "POST - Get book recommendations",
            "/analyze": "POST - Analyze review sentiment"
        }
    })

@app.route('/books', methods=['GET'])
def get_all_books():
    """Get all books - useful for debugging"""
    try:
        books = fetch_books_from_db()
        if books.empty:
            return jsonify({
                "error": "No books in database", 
                "count": 0
            }), 404
        
        return jsonify({
            "count": len(books),
            "titles": books['title'].tolist(),
            "books": books.to_dict(orient="records")
        })
    except Exception as e:
        print(f"❌ Error in /books: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        user_input = data.get('title')
        
        print(f"\n📖 Recommendation requested for: '{user_input}'")
        
        if not user_input:
            return jsonify({"error": "Book title is required"}), 400
        
        # Fetch books from MongoDB
        books = fetch_books_from_db()
        
        if books.empty:
            print("❌ No books found in database!")
            return jsonify({"error": "No books found in database"}), 404
        
        print(f"✅ Total books in database: {len(books)}")
        print(f"📋 Sample titles: {books['title'].tolist()[:3]}")
        
        # Check if book exists
        if user_input not in books['title'].values:
            print(f"❌ Book '{user_input}' not found in database!")
            print(f"💡 Available books: {books['title'].tolist()}")
            return jsonify({
                "error": f"Book '{user_input}' not found in database",
                "suggestion": "Please check the book title matches exactly",
                "available_books": books['title'].tolist()[:10]
            }), 404

        print(f"✅ Book found! Generating recommendations...")

        # Fill missing values with empty strings
        books['description'] = books['description'].fillna('')
        books['category'] = books['category'].fillna('')
        books['author'] = books['author'].fillna('')
        
        # Create combined features for similarity computation
        books['combined_features'] = (
            books['description'] + " " + 
            books['category'] + " " + 
            books['author']
        )

        # Compute TF-IDF matrix
        tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf_vectorizer.fit_transform(books['combined_features'])
        
        # Compute Cosine Similarity
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        # Find the index of the book
        idx = books[books['title'] == user_input].index[0]
        
        # Get similarity scores and sort them
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]
        
        # Get recommended book indices
        book_indices = [i[0] for i in sim_scores]
        
        print(f"✅ Found {len(book_indices)} recommendations")
        
        # Extract book details
        recommendations = books.iloc[book_indices][[
            '_id', 'isbn', 'title', 'author',
            'year_of_publication', 'publisher',
            'image', 'category', 'description'
        ]]
        
        recommended_list = recommendations.to_dict(orient="records")
        print(f"📚 Recommended books: {[book['title'] for book in recommended_list[:3]]}")
        
        return jsonify({"recommended_books": recommended_list})
    
    except Exception as e:
        print(f"❌ Error in /recommend: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of a book review"""
    try:
        data = request.json
        review = data.get('review', '')

        if not review:
            return jsonify({"error": "Review text is required"}), 400

        print(f"💭 Analyzing sentiment for review: '{review[:50]}...'")

        sentiment_score = analyzer.polarity_scores(review)

        if sentiment_score['compound'] >= 0.05:
            sentiment = "positive"
        elif sentiment_score['compound'] <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        print(f"✅ Sentiment: {sentiment} (score: {sentiment_score['compound']})")

        return jsonify({
            "sentiment": sentiment, 
            "score": sentiment_score['compound']
        })
    
    except Exception as e:
        print(f"❌ Error in /analyze: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
