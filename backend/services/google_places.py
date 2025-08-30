import httpx
import os
from typing import List, Dict, Any
import asyncio

class GooglePlacesService:
    def __init__(self):
        from dotenv import load_dotenv
        load_dotenv()
        self.api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        self.base_url = "https://maps.googleapis.com/maps/api/place"
        
        if not self.api_key:
            print("Warning: GOOGLE_MAPS_API_KEY not found in environment variables")
    
    async def get_places_by_vibe(self, vibes: List[str], lat: float, lng: float) -> List[Dict[str, Any]]:
        """
        Fetch places from Google Places API based on selected vibes and location.
        """
        if not self.api_key:
            # Return mock data for development
            return self._get_mock_places(vibes, lat, lng)
        
        try:
            # Define vibe-specific search terms
            vibe_keywords = self._get_vibe_keywords(vibes)
            
            # Fetch places for each vibe
            all_places = []
            for vibe, keywords in vibe_keywords.items():
                places = await self._search_places(keywords, lat, lng)
                all_places.extend(places)
            
            # Remove duplicates and return unique places
            unique_places = self._deduplicate_places(all_places)
            
            if len(unique_places) == 0:
                # Fallback to mock data if no places found
                return self._get_mock_places(vibes, lat, lng)
            
            return unique_places[:20]  # Limit to top 20 results
            
        except Exception as e:
            print(f"Error fetching places from Google Places API: {e}")
            # Fallback to mock data
            return self._get_mock_places(vibes, lat, lng)
    
    def _get_vibe_keywords(self, vibes: List[str]) -> Dict[str, List[str]]:
        """Map vibes to relevant search keywords for Google Places API"""
        vibe_mapping = {
            'cozy': ['cafe', 'coffee shop', 'bookstore', 'tea house', 'quiet restaurant'],
            'artsy': ['art gallery', 'museum', 'creative space', 'design studio', 'artisan shop'],
            'historic': ['historic site', 'landmark', 'museum', 'historic building', 'monument'],
            'trendy': ['modern restaurant', 'boutique', 'designer store', 'hip cafe', 'contemporary art'],
            'nature': ['park', 'garden', 'nature reserve', 'hiking trail', 'botanical garden'],
            'foodie': ['restaurant', 'food market', 'bakery', 'farm to table', 'gourmet'],
            'nightlife': ['bar', 'nightclub', 'live music', 'entertainment', 'dance club'],
            'hidden': ['local favorite', 'hidden gem', 'off the beaten path', 'local secret']
        }
        
        return {vibe: vibe_mapping.get(vibe, [vibe]) for vibe in vibes}
    
    async def _search_places(self, keywords: List[str], lat: float, lng: float) -> List[Dict[str, Any]]:
        """Search for places using Google Places API"""
        places = []
        
        async with httpx.AsyncClient() as client:
            for keyword in keywords:
                try:
                    # Nearby search
                    url = f"{self.base_url}/nearbysearch/json"
                    params = {
                        'location': f"{lat},{lng}",
                        'radius': '5000',  # 5km radius
                        'keyword': keyword,
                        'key': self.api_key,
                        'type': 'establishment'
                    }
                    
                    response = await client.get(url, params=params)
                    response.raise_for_status()
                    
                    data = response.json()
                    if data['status'] == 'OK':
                        places.extend(data['results'])
                    
                    # Add small delay to respect API rate limits
                    await asyncio.sleep(0.1)
                    
                except Exception as e:
                    print(f"Error searching for keyword '{keyword}': {e}")
                    continue
        
        return places
    
    def _deduplicate_places(self, places: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate places based on place_id"""
        seen_ids = set()
        unique_places = []
        
        for place in places:
            if place.get('place_id') and place['place_id'] not in seen_ids:
                seen_ids.add(place['place_id'])
                unique_places.append(place)
        
        return unique_places
    
    def _get_mock_places(self, vibes: List[str], lat: float, lng: float) -> List[Dict[str, Any]]:
        """Return mock places data for development/testing"""
        mock_places = [
            {
                'place_id': 'mock_1',
                'name': 'The Daily Press',
                'formatted_address': '123 Main St, Brooklyn, NY',
                'rating': 4.8,
                'user_ratings_total': 150,
                'types': ['cafe', 'restaurant', 'food'],
                'geometry': {
                    'location': {
                        'lat': lat + 0.001,
                        'lng': lng + 0.001
                    }
                },
                'photos': []
            },
            {
                'place_id': 'mock_2',
                'name': 'Better Read Than Dead',
                'formatted_address': '456 Oak Ave, Brooklyn, NY',
                'rating': 4.9,
                'user_ratings_total': 80,
                'types': ['book_store', 'store'],
                'geometry': {
                    'location': {
                        'lat': lat + 0.002,
                        'lng': lng + 0.002
                    }
                },
                'photos': []
            },
            {
                'place_id': 'mock_3',
                'name': 'Prospect Park',
                'formatted_address': '789 Park Rd, Brooklyn, NY',
                'rating': 4.7,
                'user_ratings_total': 2000,
                'types': ['park', 'natural_feature', 'establishment'],
                'geometry': {
                    'location': {
                        'lat': lat + 0.003,
                        'lng': lng + 0.003
                    }
                },
                'photos': []
            },
            {
                'place_id': 'mock_4',
                'name': 'Modern Art Collective',
                'formatted_address': '321 Gallery Way, Brooklyn, NY',
                'rating': 4.6,
                'user_ratings_total': 120,
                'types': ['art_gallery', 'museum', 'establishment'],
                'geometry': {
                    'location': {
                        'lat': lat + 0.004,
                        'lng': lng + 0.004
                    }
                },
                'photos': []
            }
        ]
        
        # Add vibe-specific mock places
        if 'foodie' in vibes:
            mock_places.append({
                'place_id': 'mock_5',
                'name': 'Farm-to-Table Bistro',
                'formatted_address': '654 Fresh St, Brooklyn, NY',
                'rating': 4.9,
                'user_ratings_total': 95,
                'types': ['restaurant', 'food', 'establishment'],
                'geometry': {
                    'location': {
                        'lat': lat + 0.005,
                        'lng': lng + 0.005
                    }
                },
                'photos': []
            })
        
        return mock_places
