-- Additional tables for educational features

-- Grammar topics and explanations
CREATE TABLE grammar_topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100), -- parts of speech, tenses, punctuation, etc.
    examples TEXT[], -- JSON array of examples
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Grammar exercises
CREATE TABLE grammar_exercises (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES grammar_topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instruction TEXT NOT NULL,
    exercise_type VARCHAR(50) NOT NULL, -- fill_blank, multiple_choice, reorder, correction
    content JSONB NOT NULL, -- Exercise data structure
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Sentence building templates
CREATE TABLE sentence_templates (
    id SERIAL PRIMARY KEY,
    template TEXT NOT NULL, -- e.g., "The {adjective} {noun} {verb} {adverb}"
    category VARCHAR(100), -- simple, compound, complex
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    example_sentence TEXT,
    word_types JSONB, -- {"adjective": ["big", "small"], "noun": ["cat", "dog"]}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Puzzles
CREATE TABLE puzzles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    puzzle_type VARCHAR(50) NOT NULL, -- word_search, crossword, anagram
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    content JSONB NOT NULL, -- Puzzle data
    solution JSONB, -- Solution data
    category VARCHAR(100),
    estimated_time INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Quizzes
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- vocabulary, grammar, comprehension
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    time_limit INTEGER, -- in minutes
    passing_score INTEGER DEFAULT 70, -- percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Quiz questions
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- multiple_choice, fill_blank, true_false, matching
    options JSONB, -- For multiple choice, matching, etc.
    correct_answer JSONB NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    question_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation topics for audio practice
CREATE TABLE conversation_topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    scenario TEXT NOT NULL, -- conversation context
    vocabulary_focus TEXT[], -- key vocabulary
    grammar_focus TEXT[], -- key grammar points
    sample_dialogue JSONB, -- Array of {speaker, text, audio_url}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User progress tracking
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- grammar, exercise, puzzle, quiz, conversation
    activity_id INTEGER NOT NULL,
    score INTEGER,
    max_score INTEGER,
    time_spent INTEGER, -- in seconds
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attempts INTEGER DEFAULT 1
);

-- Insert sample grammar topics
INSERT INTO grammar_topics (title, slug, description, content, difficulty_level, category, examples) VALUES
('Present Simple Tense', 'present-simple', 'Learn about the present simple tense for habits and facts', 
 'The present simple tense is used to describe habits, facts, and general truths. It is formed with the base form of the verb (add -s for third person singular).', 
 'beginner', 'tenses', 
 ARRAY['I eat breakfast every morning.', 'She works in an office.', 'The sun rises in the east.']),

('Articles: A, An, The', 'articles', 'Understanding when to use definite and indefinite articles', 
 'Articles are words that define nouns. "A" and "an" are indefinite articles, while "the" is the definite article.', 
 'beginner', 'parts of speech', 
 ARRAY['I saw a cat.', 'She is an engineer.', 'The book is on the table.']),

('Past Perfect Tense', 'past-perfect', 'Learn about actions completed before another past action', 
 'The past perfect tense shows that an action was completed before another action in the past. It is formed with "had" + past participle.', 
 'intermediate', 'tenses', 
 ARRAY['I had finished my homework before dinner.', 'She had left when I arrived.']);

-- Insert sample exercises
INSERT INTO grammar_exercises (topic_id, title, instruction, exercise_type, content, difficulty_level, points) VALUES
(1, 'Present Simple Practice', 'Fill in the blanks with the correct form of the verb', 'fill_blank', 
 '{"sentences": [{"text": "She _____ (work) in a hospital.", "answer": "works"}, {"text": "They _____ (play) football every weekend.", "answer": "play"}]}', 
 'beginner', 10),

(2, 'Choose the Correct Article', 'Select the appropriate article for each sentence', 'multiple_choice', 
 '{"questions": [{"text": "I need ___ umbrella.", "options": ["a", "an", "the"], "correct": 1}, {"text": "___ sun is bright today.", "options": ["a", "an", "the"], "correct": 2}]}', 
 'beginner', 15);

-- Insert sample sentence templates
INSERT INTO sentence_templates (template, category, difficulty_level, example_sentence, word_types) VALUES
('The {adjective} {noun} {verb} {adverb}.', 'simple', 'beginner', 'The happy dog runs quickly.', 
 '{"adjective": ["happy", "big", "small", "beautiful"], "noun": ["dog", "cat", "bird", "car"], "verb": ["runs", "jumps", "flies", "moves"], "adverb": ["quickly", "slowly", "carefully", "loudly"]}'),

('{noun} {verb} {preposition} the {adjective} {noun}.', 'simple', 'intermediate', 'Students study in the quiet library.', 
 '{"noun": ["students", "teachers", "children", "people"], "verb": ["study", "work", "play", "read"], "preposition": ["in", "on", "under", "beside"], "adjective": ["quiet", "busy", "large", "small"]}');

-- Insert sample quizzes
INSERT INTO quizzes (title, description, category, difficulty_level, time_limit, passing_score) VALUES
('Basic Grammar Quiz', 'Test your knowledge of basic English grammar', 'grammar', 'beginner', 15, 70),
('Vocabulary Challenge', 'Challenge yourself with advanced vocabulary', 'vocabulary', 'advanced', 20, 80);

-- Insert sample quiz questions
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points, question_order) VALUES
(1, 'Which sentence is correct?', 'multiple_choice', 
 '["She go to school every day.", "She goes to school every day.", "She going to school every day."]', 
 '1', 'In present simple, we add -s to the verb for third person singular.', 2, 1),

(1, 'Fill in the blank: I _____ coffee every morning.', 'fill_blank', 
 '{}', '"drink"', 'Present simple uses the base form for I/you/we/they.', 2, 2);

-- Insert sample conversation topics
INSERT INTO conversation_topics (title, description, difficulty_level, scenario, vocabulary_focus, grammar_focus, sample_dialogue) VALUES
('Ordering Food at a Restaurant', 'Practice ordering food and drinks', 'beginner', 
 'You are at a restaurant and want to order a meal. Practice polite expressions and food vocabulary.', 
 ARRAY['menu', 'order', 'delicious', 'bill', 'waiter'], 
 ARRAY['would like', 'can I have', 'present simple'], 
 '[{"speaker": "waiter", "text": "Good evening! Welcome to our restaurant. How can I help you?"}, {"speaker": "customer", "text": "Hello! Could I see the menu, please?"}, {"speaker": "waiter", "text": "Of course! Here you are. Would you like something to drink while you decide?"}]'),

('Job Interview', 'Practice common job interview questions and answers', 'intermediate', 
 'You are in a job interview. Practice professional language and talking about your experience.', 
 ARRAY['experience', 'skills', 'qualification', 'position', 'salary'], 
 ARRAY['present perfect', 'past simple', 'future plans'], 
 '[{"speaker": "interviewer", "text": "Tell me about your previous work experience."}, {"speaker": "candidate", "text": "I have worked in marketing for three years. In my last position, I managed social media campaigns."}]');

-- Create indexes for performance
CREATE INDEX idx_grammar_exercises_topic_id ON grammar_exercises(topic_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_activity ON user_progress(activity_type, activity_id);
