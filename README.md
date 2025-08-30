# LocalVibe 🗺️

**AI-Curated Local Experiences & Vibe Trails**

Transform urban discovery by replacing generic search with personalized, AI-curated local experiences. Stop searching, start experiencing your city.

## 🚀 Overview

LocalVibe is a web application that generates unique, themed "Vibe Trails" for users based on their mood. Instead of an overwhelming list of options, users get a curated, walkable adventure, complete with a narrative that turns their outing into a story.

### Key Features

- **Vibe Selection**: Choose from 8 curated vibes (Cozy, Artsy, Historic, Trendy, Nature, Foodie, Nightlife, Hidden Gems)
- **AI Trail Generation**: Sophisticated backend system creates personalized multi-stop itineraries
- **Interactive Maps**: Visual trail display with Mapbox integration
- **AI Narratives**: Google Gemini-powered descriptions that make each trail feel like a personal recommendation
- **Smart Scoring**: In-house heuristic algorithm prioritizes relevance, quality, and walkability

## 🏗️ Architecture

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Mapbox GL** for interactive maps
- **Supabase** for authentication and data storage

### Backend
- **FastAPI** (Python) for the API server
- **Google Places API** for location data
- **Google Gemini API** for narrative generation
- **In-house Trail Model** for intelligent POI selection

### Database
- **Supabase** for user management and trail storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- API keys for:
  - Google Maps/Places API
  - Google Gemini API
  - Mapbox
  - Supabase

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp ../env.example .env
   # Edit .env with your API keys
   ```

5. **Run the API server:**
   ```bash
   python main.py
   # Or: uvicorn main:app --reload
   ```

6. **API will be available at [http://localhost:8000](http://localhost:8000)**

## 🔑 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Schema

### Tables

#### `profiles`
- `id` (UUID, primary key)
- `email` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `saved_trails`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to profiles.id)
- `trail_data` (JSONB)
- `vibes` (text[])
- `created_at` (timestamp)

## 🧠 Core Algorithm

The Trail Model uses a sophisticated scoring system:

1. **Vibe Match Score (40%)**: How well a place matches selected vibes
2. **Quality Score (30%)**: Based on ratings and review count
3. **Proximity Score (20%)**: Optimized for walkability
4. **Hidden Gem Score (10%)**: Boost for highly-rated but less-reviewed places

## 🎯 API Endpoints

### `POST /generate-trail`
Generate a personalized Vibe Trail

**Request:**
```json
{
  "vibes": ["cozy", "artsy"],
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "narrative": {
    "title": "Cozy & Artsy Brooklyn Adventure",
    "description": "Unwind with peaceful spots and creative inspiration..."
  },
  "stops": [
    {
      "id": "place_1",
      "name": "The Daily Press",
      "address": "123 Main St, Brooklyn, NY",
      "rating": 4.8,
      "types": ["cafe", "restaurant"],
      "geometry": {
        "location": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      }
    }
  ]
}
```

### `GET /vibes`
Get all available vibe options

### `GET /health`
Health check endpoint

## 🎨 UI Components

- **VibeSelector**: Interactive vibe selection grid
- **TrailDisplay**: Complete trail visualization with map and details
- **TrailMap**: Interactive Mapbox map showing trail route
- **Header**: Navigation and branding

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Google Cloud Run)
```bash
# Build and deploy to Cloud Run
gcloud run deploy localvibe-api --source .
```

## 🔮 Future Enhancements

- **User Feedback Loop**: Rate generated trails to improve ML model
- **Social Features**: Share favorite trails with friends
- **Business Portal**: Analytics dashboard for local businesses
- **Sponsored Trails**: Partner with local brands
- **Advanced Routing**: Real-time walking directions and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Places API for location data
- Google Gemini for AI narrative generation
- Mapbox for interactive maps
- Supabase for backend services
- Next.js and FastAPI communities

---

**Built with ❤️ for urban explorers and local discovery enthusiasts**
