# Backend Setup

## Supabase Configuration

1. **Create a `customers` table** in your Supabase project with the following schema:

   | Column Name | Type       | Constraints          |
   |-------------|------------|----------------------|
   | id          | UUID       | Primary Key          |
   | phone       | Text       | Unique, Not Null     |
   | name        | Text       | Optional             |
   | created_at  | Timestamp  | Default: now()       |

2. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Configure the Supabase client** in `supabaseClient.js`:
   ```javascript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = 'https://your-supabase-url.supabase.co';
   const supabaseKey = 'your-anon-or-service-role-key';

   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

4. **Run the backend**:
   - Add API routes for handling sign-in and customer management.
   - Use the `supabase` client to interact with the database.

## Next Steps
- Implement the sign-in API endpoint.
- Connect the frontend `SignInScreen` to the backend.