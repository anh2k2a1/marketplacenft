-- Add OAuth2 provider fields to users table
ALTER TABLE users
ADD COLUMN provider VARCHAR(20) DEFAULT 'LOCAL',
ADD COLUMN provider_id VARCHAR(255);

-- Update existing users to have LOCAL provider
UPDATE users SET provider = 'LOCAL' WHERE provider IS NULL;

-- Add index for faster OAuth2 lookups
CREATE INDEX idx_users_provider_provider_id ON users(provider, provider_id);
