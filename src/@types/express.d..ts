import { User } from "@supabase/supabase-js"; // Adjust the User type according to your Supabase implementation

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}
