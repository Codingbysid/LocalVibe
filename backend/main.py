from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import os
from dotenv import load_dotenv
from services.google_places import GooglePlacesService
from services.trail_model import TrailModel
from services.gemini_narrative import GeminiNarrativeService
from services.supabase_service import SupabaseService
from services.mapbox_directions import MapboxDirectionsService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="LocalVibe API",
    description="AI-powered local experience curation API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localvibe.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
google_places = GooglePlacesService()
trail_model = TrailModel()
gemini_narrative = GeminiNarrativeService()
supabase = SupabaseService()
mapbox_directions = MapboxDirectionsService()

class TrailRequest(BaseModel):
    vibes: list[str]
    latitude: float
    longitude: float

class RegenerateStopRequest(BaseModel):
    vibes: list[str]
    latitude: float
    longitude: float
    current_trail: dict
    stop_to_replace: int  # Index of the stop to replace

class TrailResponse(BaseModel):
    narrative: dict
    stops: list[dict]

class RegenerateStopResponse(BaseModel):
    new_stop: dict
    updated_trail: dict

class DirectionsRequest(BaseModel):
    coordinates: list[dict]  # List of {"lat": float, "lng": float}

class DirectionsResponse(BaseModel):
    geometry: dict
    duration: int
    distance: int
    steps: list[dict]
    formatted_duration: str
    formatted_distance: str
    
    @field_validator('duration', 'distance', mode='before')
    @classmethod
    def convert_to_int(cls, v):
        if isinstance(v, float):
            return int(round(v))
        return v

@app.get("/")
async def root():
    return {"message": "LocalVibe API is running! 🗺️"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": {
        "google_places": "available",
        "gemini": "available",
        "trail_model": "available",
        "supabase": "available" if supabase and supabase.client else "unavailable",
        "mapbox_directions": "available"
    }}

@app.post("/generate-trail", response_model=TrailResponse)
async def generate_trail(request: TrailRequest):
    """
    Generate a personalized Vibe Trail based on user's selected vibes and location.
    """
    try:
        print(f"Received request for vibes: {request.vibes} at location: {request.latitude}, {request.longitude}")
        
        # 1. Fetch candidate places from Google Places API
        candidate_places = await google_places.get_places_by_vibe(
            request.vibes, 
            request.latitude, 
            request.longitude
        )
        
        if not candidate_places:
            raise HTTPException(status_code=404, detail="No places found for the selected vibes")
        
        print(f"Found {len(candidate_places)} candidate places")
        
        # 2. Use our in-house model to score, rank, and select the best 3-4 places
        selected_stops = trail_model.score_and_select_pois(
            candidate_places, 
            request.vibes
        )
        
        print(f"Selected {len(selected_stops)} stops for the trail")
        
        # 3. Use Gemini API to generate a narrative for the selected stops
        trail_narrative = await gemini_narrative.generate_narrative(
            vibes=request.vibes, 
            stops=selected_stops,
            city="Brooklyn"  # This could be determined from coordinates
        )
        
        print(f"Generated narrative: {trail_narrative}")
        
        # 4. Combine and return the final trail object
        trail_response = {
            "narrative": trail_narrative,
            "stops": selected_stops
        }
        
        return trail_response
        
    except Exception as e:
        print(f"Error generating trail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate trail: {str(e)}")

@app.post("/regenerate-stop", response_model=RegenerateStopResponse)
async def regenerate_stop(request: RegenerateStopRequest):
    """
    Regenerate a specific stop in a trail while maintaining the overall vibe and narrative.
    """
    try:
        print(f"Regenerating stop {request.stop_to_replace} for vibes: {request.vibes}")
        
        # 1. Fetch fresh candidate places
        candidate_places = await google_places.get_places_by_vibe(
            request.vibes, 
            request.latitude, 
            request.longitude
        )
        
        if not candidate_places:
            raise HTTPException(status_code=404, detail="No places found for the selected vibes")
        
        # 2. Get alternative stops for the specific position
        alternative_stops = trail_model.get_alternative_stops(
            candidate_places,
            request.vibes,
            request.current_trail,
            request.stop_to_replace
        )
        
        if not alternative_stops:
            raise HTTPException(status_code=404, detail="No alternative stops found")
        
        # 3. Select the best alternative
        new_stop = alternative_stops[0]  # Get the best alternative
        
        # 4. Create updated trail
        updated_trail = request.current_trail.copy()
        updated_trail['stops'][request.stop_to_replace] = new_stop
        
        # 5. Regenerate narrative for the updated trail
        updated_narrative = await gemini_narrative.generate_narrative(
            vibes=request.vibes,
            stops=updated_trail['stops'],
            city="Brooklyn"
        )
        
        updated_trail['narrative'] = updated_narrative
        
        return {
            "new_stop": new_stop,
            "updated_trail": updated_trail
        }
        
    except Exception as e:
        print(f"Error regenerating stop: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to regenerate stop: {str(e)}")

@app.get("/vibes")
async def get_available_vibes():
    """Get all available vibe options"""
    vibes = [
        {"id": "cozy", "name": "Cozy & Quiet", "emoji": "☕", "description": "Peaceful spots for reflection and comfort"},
        {"id": "artsy", "name": "Artsy & Creative", "emoji": "🎨", "description": "Creative spaces that inspire imagination"},
        {"id": "historic", "name": "Historic & Classic", "emoji": "🏛️", "description": "Timeless places with rich stories"},
        {"id": "trendy", "name": "Trendy & Modern", "emoji": "✨", "description": "Contemporary spots with cutting-edge vibes"},
        {"id": "nature", "name": "Nature & Outdoors", "emoji": "🌳", "description": "Green spaces and outdoor adventures"},
        {"id": "foodie", "name": "Foodie Paradise", "emoji": "🍽️", "description": "Culinary delights and unique dining experiences"},
        {"id": "nightlife", "name": "Nightlife & Energy", "emoji": "🌙", "description": "Vibrant evening spots with great energy"},
        {"id": "hidden", "name": "Hidden Gems", "emoji": "💎", "description": "Off-the-beaten-path discoveries"}
    ]
    return {"vibes": vibes}

@app.post("/directions", response_model=DirectionsResponse)
async def get_walking_directions(request: DirectionsRequest):
    """
    Get walking directions between a series of coordinates.
    """
    try:
        print(f"Getting directions for {len(request.coordinates)} coordinates")
        
        # Get directions from Mapbox
        directions = await mapbox_directions.get_walking_directions(request.coordinates)
        
        if not directions:
            raise HTTPException(status_code=404, detail="No directions found for the given coordinates")
        
        return DirectionsResponse(
            geometry=directions["geometry"],
            duration=directions["duration"],
            distance=directions["distance"],
            steps=directions["steps"],
            formatted_duration=mapbox_directions.format_duration(directions["duration"]),
            formatted_distance=mapbox_directions.format_distance(directions["distance"])
        )
        
    except Exception as e:
        print(f"Error getting directions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get directions: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
