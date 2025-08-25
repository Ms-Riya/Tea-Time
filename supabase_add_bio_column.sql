-- Add bio column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add some sample data if needed
UPDATE profiles SET bio = 'Spilling the hottest tea since 2024 ☕ Drama connoisseur and red flag detector 🚩' WHERE bio IS NULL;
