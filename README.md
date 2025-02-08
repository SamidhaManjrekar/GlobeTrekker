# GlobeTrekker - Smart Personalized Travel Planner

**GlobeTrekker** is an AI-powered travel planning platform that helps users generate optimized itineraries, recommend attractions, and manage travel budgets efficiently. The platform leverages machine learning to provide personalized travel experiences based on user preferences and constraints.

## 🚀 Features
- **Personalized Itinerary Generation**: AI-driven recommendations based on user preferences.
- **Budget Optimization**: Smart cost management for Economy, Standard, and Luxury travel tiers.
- **Attraction & Activity Suggestions**: Tailored recommendations for local experiences.
- **Real-Time Travel Cost Estimation**: Estimated expenses based on seasonality and location trends.
- **User Preferences & Customization**: Allows users to input specific requirements for tailored results.
- **Travel Blog**: Users can read and contribute travel experiences and tips.

## 🏗️ Tech Stack
- **Frontend**: React (Vite) with Tailwind CSS & Framer Motion
- **Backend**: Django with REST API
- **Database**: PostgreSQL
- **Machine Learning**: Collaborative Filtering, Clustering, and Cost Trend Predictions
- **AI Integration**: Gemini API for travel itinerary suggestions
- **Image Optimization**: ImageKit for efficient image hosting

## 🎯 How It Works
1. **User Input**: Travelers provide details like:
   - Traveling from & to
   - Departure & return dates
   - Number of adults & children
   - Budget tier (Economy, Standard, Luxury)
   - Specific preferences (e.g., adventure, cultural experiences)
2. **AI Processing**: The system generates an itinerary using AI-based recommendations and ML algorithms.
3. **Itinerary Display**: The user receives a structured travel plan, including attractions, accommodation, and cost estimates.
4. **Customization & Optimization**: Users can tweak their itinerary and get budget-friendly alternatives.
5. **Travel Blog Access**: Users can explore travel stories, tips, and recommendations from other travelers.

## 📌 Installation & Setup
### 1. Clone the Repository
```bash
git clone https://github.com/SamidhaManjrekar/GlobeTrekker.git
cd GlobeTrekker
```

### 2. Backend Setup
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Future Enhancements
- **Real-time Flight & Hotel API Integration**
- **Multi-language Support**
- **Enhanced AI Recommendations with RAG/LangChain**
- **Offline Mode for Itinerary Viewing**

## 📜 License
This project is licensed under the MIT License.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, submit pull requests, or suggest features.

## 📬 Contact
- **GitHub**: [SamidhaManjrekar](https://github.com/SamidhaManjrekar)
- **LinkedIn**: [Samidha Manjrekar](https://www.linkedin.com/in/samidha-manjrekar-3a519a283/)

