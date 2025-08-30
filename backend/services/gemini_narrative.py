import os
import google.generativeai as genai
from typing import List, Dict, Any
import json

class GeminiNarrativeService:
    """
    Service for generating AI-powered narratives for Vibe Trails using Google Gemini API.
    """
    
    def __init__(self):
        from dotenv import load_dotenv
        load_dotenv()
        self.api_key = os.getenv('GOOGLE_GEMINI_API_KEY')
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            print("Warning: GOOGLE_GEMINI_API_KEY not found in environment variables")
            self.model = None
    
    async def generate_narrative(self, vibes: List[str], stops: List[Dict[str, Any]], city: str = "Brooklyn") -> Dict[str, str]:
        """
        Generate a compelling narrative for a Vibe Trail using Gemini AI.
        
        Args:
            vibes: List of selected vibe tags
            stops: List of selected places for the trail
            city: City name for context
            
        Returns:
            Dictionary with 'title' and 'description' keys
        """
        if not self.model:
            # Return mock narrative if Gemini is not available
            return self._generate_mock_narrative(vibes, stops, city)
        
        try:
            # Create the prompt for Gemini
            prompt = self._create_narrative_prompt(vibes, stops, city)
            
            # Generate response from Gemini
            response = await self._generate_with_gemini(prompt)
            
            # Parse and validate the response
            narrative = self._parse_gemini_response(response)
            
            return narrative
            
        except Exception as e:
            print(f"Error generating narrative with Gemini: {e}")
            # Fallback to mock narrative
            return self._generate_mock_narrative(vibes, stops, city)
    
    def _create_narrative_prompt(self, vibes: List[str], stops: List[Dict[str, Any]], city: str) -> str:
        """Create a detailed prompt for Gemini to generate the narrative."""
        
        # Format the stops information
        stops_info = []
        for i, stop in enumerate(stops, 1):
            stop_info = f"{i}. {stop['name']} - {', '.join(stop['types'])}"
            stops_info.append(stop_info)
        
        stops_text = "\n".join(stops_info)
        
        # Create vibe descriptions
        vibe_descriptions = {
            'cozy': 'peaceful, comfortable, and quiet',
            'artsy': 'creative, artistic, and inspiring',
            'historic': 'timeless, classic, and heritage-rich',
            'trendy': 'modern, contemporary, and stylish',
            'nature': 'outdoor, natural, and refreshing',
            'foodie': 'culinary, delicious, and gastronomic',
            'nightlife': 'vibrant, energetic, and exciting',
            'hidden': 'secret, local, and off-the-beaten-path'
        }
        
        vibe_text = " and ".join([vibe_descriptions.get(vibe, vibe) for vibe in vibes])
        
        prompt = f"""
        You are a friendly, knowledgeable local guide in {city}. Your job is to create an exciting and engaging narrative for a personalized "Vibe Trail" that will make users excited to explore.

        VIBE CONTEXT:
        The user has selected these vibes: {', '.join(vibes)}
        This creates a {vibe_text} experience.

        TRAIL STOPS:
        {stops_text}

        TASK:
        Create a compelling narrative for this trail that includes:

        1. A catchy, exciting title (max 8 words) that captures the essence of the experience
        2. A short, engaging description (2-3 sentences, max 150 characters) that gets users excited to start their adventure

        REQUIREMENTS:
        - The title should be memorable and use vibrant language
        - The description should feel personal and exciting
        - Mention the vibe/atmosphere the user will experience
        - Make it sound like a perfect day plan
        - Keep it concise but inspiring
        - Use present tense and active voice

        FORMAT YOUR RESPONSE AS JSON:
        {{
            "title": "Your catchy title here",
            "description": "Your engaging description here"
        }}

        Remember: You're not just listing places - you're telling a story that makes someone want to drop everything and start exploring!
        """
        
        return prompt
    
    async def _generate_with_gemini(self, prompt: str) -> str:
        """Generate response from Gemini API."""
        try:
            # For async compatibility, we'll use a simple approach
            # In production, you might want to use proper async Gemini client
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            raise e
    
    def _parse_gemini_response(self, response: str) -> Dict[str, str]:
        """Parse and validate the Gemini response."""
        try:
            # Try to extract JSON from the response
            response_text = response.strip()
            
            # Look for JSON content
            if '{' in response_text and '}' in response_text:
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                json_str = response_text[start:end]
                
                narrative = json.loads(json_str)
                
                # Validate required fields
                if 'title' in narrative and 'description' in narrative:
                    return {
                        'title': narrative['title'].strip(),
                        'description': narrative['description'].strip()
                    }
            
            # If JSON parsing fails, try to extract manually
            return self._extract_narrative_manually(response_text)
            
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            # Return a fallback narrative
            return {
                'title': 'Your Perfect Local Adventure',
                'description': 'Discover amazing local spots that perfectly match your vibe and create unforgettable memories.'
            }
    
    def _extract_narrative_manually(self, response: str) -> Dict[str, str]:
        """Manually extract title and description if JSON parsing fails."""
        lines = response.split('\n')
        title = "Your Perfect Local Adventure"
        description = "Discover amazing local spots that perfectly match your vibe and create unforgettable memories."
        
        for line in lines:
            line = line.strip()
            if line.startswith('"title"') or line.startswith('title'):
                title = line.split(':', 1)[1].strip().strip('"').strip(',')
            elif line.startswith('"description"') or line.startswith('description'):
                description = line.split(':', 1)[1].strip().strip('"').strip(',')
        
        return {'title': title, 'description': description}
    
    def _generate_mock_narrative(self, vibes: List[str], stops: List[Dict[str, Any]], city: str) -> Dict[str, str]:
        """Generate a mock narrative when Gemini is not available."""
        
        # Create vibe-specific narratives
        vibe_narratives = {
            'cozy': {
                'title': f'A Cozy {city} Afternoon',
                'description': f'Unwind with the perfect peaceful experience in {city}. This trail takes you through quiet, comfortable spaces perfect for reflection and relaxation.'
            },
            'artsy': {
                'title': f'Creative {city} Adventure',
                'description': f'Immerse yourself in {city}\'s artistic spirit with this curated trail of creative spaces that will inspire your imagination.'
            },
            'historic': {
                'title': f'Historic {city} Journey',
                'description': f'Step back in time and discover {city}\'s rich heritage through this carefully selected trail of timeless landmarks and stories.'
            },
            'trendy': {
                'title': f'Modern {city} Experience',
                'description': f'Discover the cutting-edge side of {city} with this trail of contemporary spots that define modern urban culture.'
            },
            'nature': {
                'title': f'{city} Nature Escape',
                'description': f'Connect with {city}\'s natural beauty through this refreshing trail of green spaces and outdoor experiences.'
            },
            'foodie': {
                'title': f'{city} Culinary Journey',
                'description': f'Taste the best of {city} with this delicious trail of unique dining experiences and local flavors.'
            },
            'nightlife': {
                'title': f'{city} Night Adventure',
                'description': f'Experience {city}\'s vibrant energy with this exciting trail of evening hotspots and entertainment venues.'
            },
            'hidden': {
                'title': f'{city} Hidden Gems',
                'description': f'Discover {city}\'s best-kept secrets with this trail of local favorites and off-the-beaten-path treasures.'
            }
        }
        
        # Select narrative based on primary vibe
        primary_vibe = vibes[0] if vibes else 'cozy'
        
        if primary_vibe in vibe_narratives:
            return vibe_narratives[primary_vibe]
        
        # Fallback for multiple vibes or unknown vibes
        if len(vibes) > 1:
            return {
                'title': f'{city} Multi-Vibe Adventure',
                'description': f'Experience the perfect blend of {", ".join(vibes)} vibes in {city} with this thoughtfully curated trail.'
            }
        
        return {
            'title': f'Your Perfect {city} Experience',
            'description': f'Discover amazing local spots in {city} that perfectly match your vibe and create unforgettable memories.'
        }
