import os
from supabase import create_client, Client
from typing import Dict, Any, Optional

class SupabaseService:
    """
    Service for interacting with Supabase for authentication and data storage.
    """
    
    def __init__(self):
        from dotenv import load_dotenv
        # Load environment variables from project root
        load_dotenv('../.env.local')
        load_dotenv()  # Also load from current directory if exists
        
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if self.supabase_url and self.supabase_key:
            try:
                # Initialize Supabase client with minimal options to avoid compatibility issues
                self.client: Client = create_client(
                    supabase_url=self.supabase_url,
                    supabase_key=self.supabase_key
                )
                print("Supabase client initialized successfully")
            except Exception as e:
                print(f"Warning: Failed to initialize Supabase client: {e}")
                print(f"Error details: {type(e).__name__}: {str(e)}")
                # For now, continue without Supabase for development
                self.client = None
        else:
            print("Warning: Supabase credentials not found in environment variables")
            self.client = None
    
    async def create_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Create a new user account."""
        if not self.client:
            return None
        
        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password
            })
            
            if response.user:
                return {
                    "id": response.user.id,
                    "email": response.user.email,
                    "created_at": response.user.created_at
                }
            
            return None
            
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    async def sign_in_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Sign in an existing user."""
        if not self.client:
            return None
        
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if response.user:
                return {
                    "id": response.user.id,
                    "email": response.user.email,
                    "access_token": response.session.access_token
                }
            
            return None
            
        except Exception as e:
            print(f"Error signing in user: {e}")
            return None
    
    async def save_trail(self, user_id: str, trail_data: Dict[str, Any], vibes: list[str]) -> Optional[str]:
        """Save a generated trail to the user's profile."""
        if not self.client:
            return None
        
        try:
            # Insert trail data into saved_trails table
            response = self.client.table('saved_trails').insert({
                'user_id': user_id,
                'trail_data': trail_data,
                'vibes': vibes
            }).execute()
            
            if response.data:
                return response.data[0]['id']
            
            return None
            
        except Exception as e:
            print(f"Error saving trail: {e}")
            return None
    
    async def get_user_trails(self, user_id: str) -> list[Dict[str, Any]]:
        """Get all saved trails for a user."""
        if not self.client:
            return []
        
        try:
            response = self.client.table('saved_trails')\
                .select('*')\
                .eq('user_id', user_id)\
                .order('created_at', desc=True)\
                .execute()
            
            return response.data if response.data else []
            
        except Exception as e:
            print(f"Error fetching user trails: {e}")
            return []
    
    async def delete_trail(self, trail_id: str, user_id: str) -> bool:
        """Delete a saved trail."""
        if not self.client:
            return False
        
        try:
            response = self.client.table('saved_trails')\
                .delete()\
                .eq('id', trail_id)\
                .eq('user_id', user_id)\
                .execute()
            
            return len(response.data) > 0 if response.data else False
            
        except Exception as e:
            print(f"Error deleting trail: {e}")
            return False
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile information."""
        if not self.client:
            return None
        
        try:
            response = self.client.table('profiles')\
                .select('*')\
                .eq('id', user_id)\
                .single()\
                .execute()
            
            return response.data if response.data else None
            
        except Exception as e:
            print(f"Error fetching user profile: {e}")
            return None
    
    async def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> bool:
        """Update user profile information."""
        if not self.client:
            return False
        
        try:
            response = self.client.table('profiles')\
                .update(profile_data)\
                .eq('id', user_id)\
                .execute()
            
            return len(response.data) > 0 if response.data else False
            
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return False
    
    def is_authenticated(self) -> bool:
        """Check if the service is properly configured."""
        return self.client is not None
    
    async def health_check(self) -> Dict[str, Any]:
        """Check the health of the Supabase connection."""
        if not self.client:
            return {
                "status": "unavailable",
                "error": "Supabase credentials not configured"
            }
        
        try:
            # Try a simple query to test connection
            response = self.client.table('saved_trails').select('count', count='exact').limit(1).execute()
            
            return {
                "status": "healthy",
                "connection": "successful",
                "timestamp": "now"
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": "now"
            }
