import math
from typing import List, Dict, Any
from dataclasses import dataclass

@dataclass
class ScoredPlace:
    place: Dict[str, Any]
    score: float
    vibe_match_score: float
    quality_score: float
    proximity_score: float
    hidden_gem_score: float

class TrailModel:
    """
    In-house heuristic model for scoring and selecting POIs to create cohesive trails.
    This is our core IP - the algorithm that makes LocalVibe unique.
    """
    
    def __init__(self):
        # Vibe-specific type mappings for relevance scoring
        self.vibe_type_mappings = {
            'cozy': ['cafe', 'book_store', 'library', 'tea_house', 'quiet_restaurant', 'park'],
            'artsy': ['art_gallery', 'museum', 'creative_space', 'design_studio', 'artisan_shop', 'theater'],
            'historic': ['historic_site', 'landmark', 'museum', 'historic_building', 'monument', 'church'],
            'trendy': ['modern_restaurant', 'boutique', 'designer_store', 'hip_cafe', 'contemporary_art', 'bar'],
            'nature': ['park', 'garden', 'nature_reserve', 'hiking_trail', 'botanical_garden', 'beach'],
            'foodie': ['restaurant', 'food_market', 'bakery', 'farm_to_table', 'gourmet', 'wine_bar'],
            'nightlife': ['bar', 'nightclub', 'live_music', 'entertainment', 'dance_club', 'theater'],
            'hidden': ['local_favorite', 'hidden_gem', 'off_the_beaten_path', 'local_secret', 'neighborhood_spot']
        }
        
        # Type relevance scores (how well each type matches each vibe)
        self.type_relevance_scores = {
            'cozy': {
                'cafe': 0.9, 'book_store': 0.8, 'library': 0.7, 'tea_house': 0.9,
                'quiet_restaurant': 0.7, 'park': 0.6, 'art_gallery': 0.3, 'museum': 0.4
            },
            'artsy': {
                'art_gallery': 0.9, 'museum': 0.8, 'creative_space': 0.9, 'design_studio': 0.8,
                'artisan_shop': 0.7, 'theater': 0.6, 'cafe': 0.4, 'restaurant': 0.3
            },
            'historic': {
                'historic_site': 0.9, 'landmark': 0.9, 'museum': 0.8, 'historic_building': 0.8,
                'monument': 0.7, 'church': 0.6, 'park': 0.4, 'cafe': 0.2
            },
            'trendy': {
                'modern_restaurant': 0.8, 'boutique': 0.9, 'designer_store': 0.8, 'hip_cafe': 0.9,
                'contemporary_art': 0.8, 'bar': 0.7, 'art_gallery': 0.6, 'restaurant': 0.6
            },
            'nature': {
                'park': 0.9, 'garden': 0.9, 'nature_reserve': 0.9, 'hiking_trail': 0.8,
                'botanical_garden': 0.9, 'beach': 0.8, 'cafe': 0.3, 'restaurant': 0.2
            },
            'foodie': {
                'restaurant': 0.9, 'food_market': 0.8, 'bakery': 0.7, 'farm_to_table': 0.9,
                'gourmet': 0.8, 'wine_bar': 0.7, 'cafe': 0.5, 'bar': 0.6
            },
            'nightlife': {
                'bar': 0.9, 'nightclub': 0.9, 'live_music': 0.8, 'entertainment': 0.8,
                'dance_club': 0.9, 'theater': 0.6, 'restaurant': 0.4, 'cafe': 0.2
            },
            'hidden': {
                'local_favorite': 0.9, 'hidden_gem': 0.9, 'off_the_beaten_path': 0.8,
                'local_secret': 0.9, 'neighborhood_spot': 0.8, 'cafe': 0.6, 'restaurant': 0.6
            }
        }
    
    def score_and_select_pois(self, places: List[Dict[str, Any]], vibes: List[str]) -> List[Dict[str, Any]]:
        """
        Score and select the best POIs to create a cohesive trail.
        
        Args:
            places: List of candidate places from Google Places API
            vibes: List of selected vibe tags
            
        Returns:
            List of 3-4 selected places forming the trail
        """
        if not places:
            return []
        
        # Score each place
        scored_places = []
        for place in places:
            score = self._calculate_place_score(place, vibes)
            scored_places.append(score)
        
        # Sort by score (highest first)
        scored_places.sort(key=lambda x: x.score, reverse=True)
        
        # Select top places and optimize for walkability
        selected_places = self._optimize_trail_walkability(scored_places)
        
        # Format places for response
        return self._format_places_for_response(selected_places)
    
    def get_alternative_stops(self, places: List[Dict[str, Any]], vibes: List[str], current_trail: Dict[str, Any], stop_index: int) -> List[Dict[str, Any]]:
        """
        Get alternative stops for a specific position in the trail.
        
        Args:
            places: List of candidate places
            vibes: List of selected vibes
            current_trail: Current trail data
            stop_index: Index of the stop to replace
            
        Returns:
            List of alternative stops sorted by score
        """
        if not places:
            return []
        
        # Get current stop types to avoid duplicates
        current_stop_types = set()
        for i, stop in enumerate(current_trail['stops']):
            if i != stop_index:
                current_stop_types.update(stop.get('types', []))
        
        # Filter out places that are too similar to current stops
        filtered_places = []
        for place in places:
            place_types = set(place.get('types', []))
            # Check if this place is already in the trail
            if place.get('place_id') in [stop.get('place_id') for stop in current_trail['stops']]:
                continue
            
            # Check if this place is too similar to other stops
            if place_types.intersection(current_stop_types):
                continue
                
            filtered_places.append(place)
        
        if not filtered_places:
            return []
        
        # Score the filtered places
        scored_places = []
        for place in filtered_places:
            score = self._calculate_place_score(place, vibes)
            scored_places.append(score)
        
        # Sort by score and return top alternatives
        scored_places.sort(key=lambda x: x.score, reverse=True)
        
        # Return top 3 alternatives
        return self._format_places_for_response(scored_places[:3])
    
    def _calculate_place_score(self, place: Dict[str, Any], vibes: List[str]) -> ScoredPlace:
        """Calculate a comprehensive score for a place based on multiple factors."""
        
        # 1. Vibe Match Score (how well the place matches selected vibes)
        vibe_match_score = self._calculate_vibe_match_score(place, vibes)
        
        # 2. Quality Score (based on ratings and review count)
        quality_score = self._calculate_quality_score(place)
        
        # 3. Proximity Score (how close to other potential stops)
        proximity_score = self._calculate_proximity_score(place, vibes)
        
        # 4. Hidden Gem Score (boost for highly-rated but less-reviewed places)
        hidden_gem_score = self._calculate_hidden_gem_score(place)
        
        # 5. Calculate weighted final score
        final_score = (
            vibe_match_score * 0.4 +      # 40% weight for vibe matching
            quality_score * 0.3 +         # 30% weight for quality
            proximity_score * 0.2 +       # 20% weight for proximity
            hidden_gem_score * 0.1        # 10% weight for hidden gem factor
        )
        
        return ScoredPlace(
            place=place,
            score=final_score,
            vibe_match_score=vibe_match_score,
            quality_score=quality_score,
            proximity_score=proximity_score,
            hidden_gem_score=hidden_gem_score
        )
    
    def _calculate_vibe_match_score(self, place: Dict[str, Any], vibes: List[str]) -> float:
        """Calculate how well a place matches the selected vibes."""
        if not place.get('types'):
            return 0.0
        
        place_types = place['types']
        total_score = 0.0
        
        for vibe in vibes:
            vibe_score = 0.0
            if vibe in self.type_relevance_scores:
                for place_type in place_types:
                    if place_type in self.type_relevance_scores[vibe]:
                        vibe_score = max(vibe_score, self.type_relevance_scores[vibe][place_type])
            
            # Also check if place name/description contains vibe-related keywords
            place_name = place.get('name', '').lower()
            if any(keyword in place_name for keyword in self._get_vibe_keywords(vibe)):
                vibe_score = max(vibe_score, 0.7)
            
            total_score += vibe_score
        
        return total_score / len(vibes)  # Average score across all vibes
    
    def _calculate_quality_score(self, place: Dict[str, Any]) -> float:
        """Calculate quality score based on ratings and review count."""
        rating = place.get('rating', 0)
        review_count = place.get('user_ratings_total', 0)
        
        # Normalize rating to 0-1 scale
        rating_score = rating / 5.0
        
        # Normalize review count (log scale to handle wide range)
        review_score = min(1.0, math.log(max(review_count, 1)) / math.log(1000))
        
        # Weighted combination (rating more important than review count)
        return rating_score * 0.7 + review_score * 0.3
    
    def _calculate_proximity_score(self, place: Dict[str, Any], vibes: List[str]) -> float:
        """Calculate proximity score (simplified for MVP - could be enhanced with actual distance calculations)"""
        # For MVP, we'll use a simple heuristic based on coordinates
        # In production, this would calculate actual walking distances
        
        # Base score - we want places that are reasonably close together
        base_score = 0.5
        
        # Could be enhanced with actual distance calculations between places
        # For now, return base score
        return base_score
    
    def _calculate_hidden_gem_score(self, place: Dict[str, Any]) -> float:
        """Calculate hidden gem score - boost for highly-rated but less-reviewed places."""
        rating = place.get('rating', 0)
        review_count = place.get('user_ratings_total', 0)
        
        # High rating with fewer reviews suggests a hidden gem
        if rating >= 4.5 and review_count < 200:
            return 0.8
        elif rating >= 4.0 and review_count < 100:
            return 0.6
        elif rating >= 4.5 and review_count < 500:
            return 0.4
        
        return 0.0
    
    def _get_vibe_keywords(self, vibe: str) -> List[str]:
        """Get relevant keywords for a vibe."""
        keywords = {
            'cozy': ['cozy', 'quiet', 'peaceful', 'comfortable', 'warm'],
            'artsy': ['art', 'creative', 'artistic', 'design', 'craft'],
            'historic': ['historic', 'old', 'classic', 'traditional', 'heritage'],
            'trendy': ['trendy', 'modern', 'hip', 'contemporary', 'stylish'],
            'nature': ['nature', 'outdoor', 'green', 'natural', 'park'],
            'foodie': ['food', 'culinary', 'gourmet', 'restaurant', 'dining'],
            'nightlife': ['night', 'evening', 'vibrant', 'energetic', 'lively'],
            'hidden': ['hidden', 'secret', 'local', 'neighborhood', 'gem']
        }
        return keywords.get(vibe, [])
    
    def _optimize_trail_walkability(self, scored_places: List[ScoredPlace]) -> List[ScoredPlace]:
        """Optimize the trail for walkability by selecting places that form a logical route."""
        if len(scored_places) <= 4:
            return scored_places[:4]
        
        # For MVP, we'll use a simple approach: select top 4 places
        # In production, this would implement actual route optimization algorithms
        
        selected = scored_places[:4]
        
        # Simple optimization: try to ensure variety in place types
        place_types = set()
        optimized_selection = []
        
        for place in selected:
            place_types.update(place.place.get('types', []))
            optimized_selection.append(place)
        
        return optimized_selection
    
    def _format_places_for_response(self, scored_places: List[ScoredPlace]) -> List[Dict[str, Any]]:
        """Format the selected places for API response."""
        formatted_places = []
        
        for scored_place in scored_places:
            place = scored_place.place
            
            # Standardize the place format
            formatted_place = {
                'id': place.get('place_id', f"place_{len(formatted_places)}"),
                'name': place.get('name', 'Unknown Place'),
                'address': place.get('formatted_address', 'Address not available'),
                'rating': place.get('rating', 0.0),
                'user_ratings_total': place.get('user_ratings_total', 0),
                'types': place.get('types', []),
                'photos': place.get('photos', []),
                'place_id': place.get('place_id', ''),
                'geometry': place.get('geometry', {
                    'location': {
                        'lat': 0.0,
                        'lng': 0.0
                    }
                })
            }
            
            formatted_places.append(formatted_place)
        
        return formatted_places
