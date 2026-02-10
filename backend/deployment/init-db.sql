-- Initial database setup for Personalia application
-- This file is executed when the PostgreSQL container starts for the first time

-- Create UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'Asia/Jakarta';

-- Create application user (if needed for specific permissions)
-- DO $$ 
-- BEGIN
--     IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'personalia_app') THEN
--         CREATE ROLE personalia_app WITH LOGIN PASSWORD 'your_app_password';
--     END IF;
-- END
-- $$;

-- Grant necessary permissions
-- GRANT CONNECT ON DATABASE dev_personalia TO personalia_app;
-- GRANT USAGE ON SCHEMA public TO personalia_app;
-- GRANT CREATE ON SCHEMA public TO personalia_app;

-- Create initial tables (if not using ORM migrations)
-- Note: If you're using Sequelize or Prisma migrations, you can remove this section

-- Example: Create a simple health check table
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('healthy') ON CONFLICT DO NOTHING;

-- Create indexes for better performance (adjust based on your schema)
-- CREATE INDEX IF NOT EXISTS idx_health_check_created_at ON health_check(created_at);

-- Application logs table used by backend log helper.
CREATE TABLE IF NOT EXISTS app_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    error TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_app_logs_created_at ON app_logs(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for health_check table
DROP TRIGGER IF EXISTS update_health_check_updated_at ON health_check;
CREATE TRIGGER update_health_check_updated_at
    BEFORE UPDATE ON health_check
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set default search path
-- ALTER DATABASE dev_personalia SET search_path TO public;

-- Performance optimizations
-- Adjust these based on your server resources
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';
-- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
-- ALTER SYSTEM SET wal_buffers = '16MB';
-- ALTER SYSTEM SET default_statistics_target = 100;

-- Reload configuration (commented out as it requires superuser privileges)
-- SELECT pg_reload_conf();

-- Create database-specific settings
-- ALTER DATABASE dev_personalia SET log_statement = 'all';
-- ALTER DATABASE dev_personalia SET log_min_duration_statement = 1000;

COMMIT;
