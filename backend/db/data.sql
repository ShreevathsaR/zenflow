CREATE DATABASE zenflow;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id), 
    full_name TEXT, 
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE Organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id INTEGER REFERENCES Users(id) ON DELETE SET NULL
);
