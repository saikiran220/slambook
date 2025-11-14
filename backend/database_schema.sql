-- Slam Book Database Schema
-- PostgreSQL Database Schema for Slam Book Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Entries Table
CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Entry fields
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    birthday VARCHAR(50) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    likes TEXT,
    dislikes TEXT,
    favorite_movie VARCHAR(255),
    favorite_food VARCHAR(255),
    about TEXT NOT NULL,
    message TEXT NOT NULL,
    tags TEXT[],  -- Array of strings for tags
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraint
    CONSTRAINT fk_entry_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_is_favorite ON entries(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_entries_tags ON entries USING GIN(tags);  -- GIN index for array searches

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entries_updated_at BEFORE UPDATE ON entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample queries for reference:

-- Get all entries for a user
-- SELECT * FROM entries WHERE user_id = 'user-uuid' ORDER BY created_at DESC;

-- Get favorite entries for a user
-- SELECT * FROM entries WHERE user_id = 'user-uuid' AND is_favorite = TRUE ORDER BY created_at DESC;

-- Get entries by tag
-- SELECT * FROM entries WHERE user_id = 'user-uuid' AND 'tag-name' = ANY(tags);

-- Get user statistics
-- SELECT 
--     COUNT(*) as total_entries,
--     COUNT(*) FILTER (WHERE is_favorite = TRUE) as favorite_entries,
--     COUNT(DISTINCT unnest(tags)) as unique_tags
-- FROM entries 
-- WHERE user_id = 'user-uuid';

-- Search entries by name or nickname
-- SELECT * FROM entries 
-- WHERE user_id = 'user-uuid' 
-- AND (name ILIKE '%search-term%' OR nickname ILIKE '%search-term%');

