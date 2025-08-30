import httpx
import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

class MapboxDirectionsService:
    """
    Service for getting walking directions between trail stops using Mapbox Directions API.
    """
    
    def __init__(self):
        load_dotenv('../.env.local')
        load_dotenv()  # Also load from current directory if exists
        
        self.api_key = os.getenv('NEXT_PUBLIC_MAPBOX_TOKEN')
        self.base_url = "https://api.mapbox.com/directions/v5/mapbox"
        
        if not self.api_key:
            print("Warning: NEXT_PUBLIC_MAPBOX_TOKEN not found in environment variables")
    
    async def get_walking_directions(self, coordinates: List[Dict[str, float]]) -> Optional[Dict[str, Any]]:
        """
        Get walking directions for a series of coordinate points.
        
        Args:
            coordinates: List of {"lat": float, "lng": float} dictionaries
            
        Returns:
            Dictionary containing route information including:
            - geometry: Encoded polyline for the route
            - duration: Total walking time in seconds
            - distance: Total distance in meters
            - steps: Detailed turn-by-turn directions
        """
        if not self.api_key:
            return self._get_mock_directions(coordinates)
        
        if len(coordinates) < 2:
            return None
            
        try:
            # Format coordinates for Mapbox API (longitude,latitude)
            coord_string = ";".join([f"{coord['lng']},{coord['lat']}" for coord in coordinates])
            
            # Build request URL
            url = f"{self.base_url}/walking/{coord_string}"
            
            params = {
                "access_token": self.api_key,
                "geometries": "geojson",
                "steps": "true",
                "overview": "full"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                
                if data.get("routes") and len(data["routes"]) > 0:
                    route = data["routes"][0]
                    
                    return {
                        "geometry": route["geometry"],
                        "duration": route["duration"],  # seconds
                        "distance": route["distance"],  # meters
                        "steps": self._format_steps(route.get("legs", [])),
                        "polyline": route["geometry"]["coordinates"]
                    }
                else:
                    print("No routes found in Mapbox response")
                    return self._get_mock_directions(coordinates)
                    
        except Exception as e:
            print(f"Error fetching directions from Mapbox: {e}")
            return self._get_mock_directions(coordinates)
    
    def _format_steps(self, legs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format the detailed turn-by-turn directions."""
        formatted_steps = []
        
        for leg in legs:
            for step in leg.get("steps", []):
                formatted_steps.append({
                    "instruction": step.get("maneuver", {}).get("instruction", "Continue"),
                    "distance": step.get("distance", 0),
                    "duration": step.get("duration", 0),
                    "geometry": step.get("geometry", {}),
                    "type": step.get("maneuver", {}).get("type", "continue")
                })
        
        return formatted_steps
    
    def _get_mock_directions(self, coordinates: List[Dict[str, float]]) -> Dict[str, Any]:
        """Return mock directions data for development/testing."""
        total_distance = 0
        total_duration = 0
        
        # Calculate approximate walking distance and time
        for i in range(len(coordinates) - 1):
            # Simple distance calculation (not accurate for real use)
            lat_diff = abs(coordinates[i+1]["lat"] - coordinates[i]["lat"])
            lng_diff = abs(coordinates[i+1]["lng"] - coordinates[i]["lng"])
            segment_distance = ((lat_diff ** 2 + lng_diff ** 2) ** 0.5) * 111000  # rough meters
            
            total_distance += segment_distance
            total_duration += segment_distance / 1.4  # ~1.4 m/s walking speed
        
        # Create mock polyline coordinates
        polyline = []
        for coord in coordinates:
            polyline.append([coord["lng"], coord["lat"]])
        
        return {
            "geometry": {
                "type": "LineString",
                "coordinates": polyline
            },
            "duration": int(round(total_duration)),
            "distance": int(round(total_distance)),
            "steps": [
                {
                    "instruction": f"Walk to {coordinates[i+1].get('name', f'Stop {i+2}')}",
                    "distance": int(round(total_distance / (len(coordinates) - 1))),
                    "duration": int(round(total_duration / (len(coordinates) - 1))),
                    "type": "continue"
                }
                for i in range(len(coordinates) - 1)
            ],
            "polyline": polyline
        }
    
    def format_duration(self, seconds: int) -> str:
        """Convert seconds to human-readable duration."""
        if seconds < 60:
            return f"{seconds} sec"
        elif seconds < 3600:
            minutes = seconds // 60
            return f"{minutes} min"
        else:
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60
            return f"{hours}h {minutes}m"
    
    def format_distance(self, meters: int) -> str:
        """Convert meters to human-readable distance."""
        if meters < 1000:
            return f"{meters} m"
        else:
            km = meters / 1000
            return f"{km:.1f} km"
