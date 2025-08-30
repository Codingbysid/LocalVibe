# CLI Deployment Instructions

If you want to use the CLI method, run these commands one by one:

```bash
# 1. Initialize Vercel project (answer prompts)
vercel

# When prompted:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? localvibe
# - Directory? ./
# - Override settings? N

# 2. Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://rrusriijekehvmointos.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJydXNyaWlqZWtlaHZtb2ludG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzcwMDUsImV4cCI6MjA3MjA1MzAwNX0.ENTPaeffjkbDmsisNWK1UfvG95hg5oDDyJn0QDzZuzM

vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
# Enter: pk.eyJ1IjoiYXNyZnNkZ2RzIiwiYSI6ImNtZXZvb3F2MzBmc2wyaW9kYW1qZmhhamMifQ.hhfixjNeMapdLSNBGazvOA

vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-url.com

# 3. Deploy to production
vercel --prod
```

The web dashboard method is much easier and less prone to interruption.
