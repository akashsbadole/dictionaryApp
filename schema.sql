-- Dictionary Database Schema

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main dictionary entries table
CREATE TABLE dictionary_entries (
    id SERIAL PRIMARY KEY,
    headword VARCHAR(255) NOT NULL,
    headword_normalized VARCHAR(255) NOT NULL, -- for case-insensitive search
    pronunciation VARCHAR(255),
    phonetic VARCHAR(255),
    audio_url VARCHAR(500),
    frequency_rank INTEGER,
    frequency_category VARCHAR(20) DEFAULT 'common' CHECK (frequency_category IN ('common', 'uncommon', 'rare')),
    etymology TEXT,
    usage_notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Parts of speech table
CREATE TABLE parts_of_speech (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- noun, verb, adjective, etc.
    abbreviation VARCHAR(10) NOT NULL -- n., v., adj., etc.
);

-- Definitions table (one entry can have multiple definitions)
CREATE TABLE definitions (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL REFERENCES dictionary_entries(id) ON DELETE CASCADE,
    part_of_speech_id INTEGER REFERENCES parts_of_speech(id),
    definition_text TEXT NOT NULL,
    definition_order INTEGER DEFAULT 1,
    register VARCHAR(50), -- formal, informal, technical, etc.
    domain VARCHAR(100), -- computer science, medicine, law, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Examples table
CREATE TABLE examples (
    id SERIAL PRIMARY KEY,
    definition_id INTEGER NOT NULL REFERENCES definitions(id) ON DELETE CASCADE,
    example_text TEXT NOT NULL,
    source VARCHAR(255),
    example_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Synonyms table
CREATE TABLE synonyms (
    id SERIAL PRIMARY KEY,
    definition_id INTEGER NOT NULL REFERENCES definitions(id) ON DELETE CASCADE,
    synonym_word VARCHAR(255) NOT NULL,
    synonym_entry_id INTEGER REFERENCES dictionary_entries(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Antonyms table
CREATE TABLE antonyms (
    id SERIAL PRIMARY KEY,
    definition_id INTEGER NOT NULL REFERENCES definitions(id) ON DELETE CASCADE,
    antonym_word VARCHAR(255) NOT NULL,
    antonym_entry_id INTEGER REFERENCES dictionary_entries(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Word origins and etymology details
CREATE TABLE etymologies (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL REFERENCES dictionary_entries(id) ON DELETE CASCADE,
    origin_language VARCHAR(100),
    origin_word VARCHAR(255),
    origin_meaning TEXT,
    time_period VARCHAR(100),
    etymology_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories/Domains for organization
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between entries and categories
CREATE TABLE entry_categories (
    entry_id INTEGER REFERENCES dictionary_entries(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, category_id)
);

-- Search history for analytics
CREATE TABLE search_history (
    id SERIAL PRIMARY KEY,
    search_term VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    results_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites/Bookmarks
CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_id INTEGER NOT NULL REFERENCES dictionary_entries(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entry_id)
);

-- CSV Import logs
CREATE TABLE import_logs (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER,
    successful_imports INTEGER,
    failed_imports INTEGER,
    error_details TEXT,
    imported_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_dictionary_entries_headword ON dictionary_entries(headword_normalized);
CREATE INDEX idx_dictionary_entries_frequency ON dictionary_entries(frequency_rank);
CREATE INDEX idx_definitions_entry_id ON definitions(entry_id);
CREATE INDEX idx_examples_definition_id ON examples(definition_id);
CREATE INDEX idx_search_history_term ON search_history(search_term);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Insert default parts of speech
INSERT INTO parts_of_speech (name, abbreviation) VALUES
('noun', 'n.'),
('verb', 'v.'),
('adjective', 'adj.'),
('adverb', 'adv.'),
('pronoun', 'pron.'),
('preposition', 'prep.'),
('conjunction', 'conj.'),
('interjection', 'interj.'),
('determiner', 'det.'),
('exclamation', 'excl.');

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('General', 'General vocabulary'),
('Academic', 'Academic and scholarly terms'),
('Technical', 'Technical and specialized terms'),
('Computer Science', 'Computing and technology terms'),
('Medicine', 'Medical terminology'),
('Law', 'Legal terminology'),
('Business', 'Business and finance terms'),
('Science', 'Scientific terminology'),
('Literature', 'Literary terms and concepts'),
('Informal', 'Informal and colloquial terms');

-- Create admin user (password should be hashed in real application)
INSERT INTO users (email, password_hash, role) VALUES
('admin@dictionary.com', '$2b$10$example_hash_here', 'admin');
