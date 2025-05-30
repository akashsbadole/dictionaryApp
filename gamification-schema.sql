-- Enhanced schema for gamification and interactive learning

-- User profiles and progress tracking
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    current_level INTEGER DEFAULT 1,
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    learning_language VARCHAR(10) DEFAULT 'en',
    native_language VARCHAR(10) DEFAULT 'en',
    daily_goal INTEGER DEFAULT 20, -- minutes per day
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses and lessons structure
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    language_code VARCHAR(10) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    course_order INTEGER DEFAULT 1,
    total_lessons INTEGER DEFAULT 0,
    estimated_hours INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Individual lessons within courses
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_order INTEGER DEFAULT 1,
    lesson_type VARCHAR(50) NOT NULL, -- translation, listening, speaking, fill_blank, multiple_choice, story
    content JSONB NOT NULL, -- Lesson content structure
    points_reward INTEGER DEFAULT 10,
    estimated_minutes INTEGER DEFAULT 5,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User lesson progress
CREATE TABLE user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed, mastered
    score INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    completed_at TIMESTAMP,
    last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Points and achievements system
CREATE TABLE point_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- lesson_complete, streak_bonus, achievement, daily_goal
    reference_id INTEGER, -- lesson_id, achievement_id, etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges and achievements
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    badge_type VARCHAR(50) NOT NULL, -- streak, points, lessons, special
    requirement_value INTEGER, -- e.g., 7 for 7-day streak
    points_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User earned badges
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Leaderboards
CREATE TABLE leaderboard_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    leaderboard_type VARCHAR(50) NOT NULL, -- weekly, monthly, all_time, friends
    points INTEGER NOT NULL,
    rank_position INTEGER,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friends and social features
CREATE TABLE user_friends (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

-- Language clubs
CREATE TABLE language_clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    language_code VARCHAR(10) NOT NULL,
    club_type VARCHAR(50) DEFAULT 'public', -- public, private, school
    member_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Club memberships
CREATE TABLE club_memberships (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES language_clubs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- member, moderator, admin
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(club_id, user_id)
);

-- Discussion forums
CREATE TABLE forum_posts (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES language_clubs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'discussion', -- discussion, question, tip, announcement
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum replies
CREATE TABLE forum_replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offline content downloads
CREATE TABLE offline_downloads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- lesson, course, audio
    content_id INTEGER NOT NULL,
    download_size INTEGER, -- in bytes
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- School/classroom management
CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    teacher_id INTEGER REFERENCES users(id),
    class_code VARCHAR(20) UNIQUE NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Student enrollments
CREATE TABLE classroom_enrollments (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(classroom_id, student_id)
);

-- Custom assignments
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_ids INTEGER[], -- Array of lesson IDs
    due_date TIMESTAMP,
    points_possible INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Assignment submissions
CREATE TABLE assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP,
    feedback TEXT,
    UNIQUE(assignment_id, student_id)
);

-- Insert default badges
INSERT INTO badges (name, description, badge_type, requirement_value, points_reward) VALUES
('First Steps', 'Complete your first lesson', 'lessons', 1, 50),
('Week Warrior', 'Maintain a 7-day streak', 'streak', 7, 100),
('Century Club', 'Earn 100 total points', 'points', 100, 25),
('Dedicated Learner', 'Complete 10 lessons', 'lessons', 10, 75),
('Month Master', 'Maintain a 30-day streak', 'streak', 30, 500),
('Point Collector', 'Earn 500 total points', 'points', 500, 100),
('Lesson Legend', 'Complete 50 lessons', 'lessons', 50, 200),
('Streak Superstar', 'Maintain a 100-day streak', 'streak', 100, 1000),
('Grammar Guru', 'Complete 20 grammar lessons', 'special', 20, 150),
('Conversation King', 'Complete 15 conversation lessons', 'special', 15, 150);

-- Insert sample courses
INSERT INTO courses (title, description, language_code, difficulty_level, total_lessons, estimated_hours) VALUES
('English Basics', 'Learn fundamental English grammar and vocabulary', 'en', 'beginner', 25, 10),
('Conversational English', 'Practice real-world English conversations', 'en', 'intermediate', 30, 15),
('Business English', 'Professional English for the workplace', 'en', 'advanced', 20, 12),
('Spanish Fundamentals', 'Basic Spanish for beginners', 'es', 'beginner', 28, 12),
('French Essentials', 'Essential French vocabulary and grammar', 'fr', 'beginner', 26, 11),
('German Basics', 'Introduction to German language', 'de', 'beginner', 24, 10),
('Italian for Travelers', 'Practical Italian for travel', 'it', 'beginner', 22, 9),
('Japanese Fundamentals', 'Basic Japanese writing and speaking', 'ja', 'beginner', 35, 18),
('Chinese Mandarin Basics', 'Introduction to Mandarin Chinese', 'zh', 'beginner', 32, 16),
('Portuguese Essentials', 'Brazilian Portuguese fundamentals', 'pt', 'beginner', 25, 11);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_leaderboard_entries_type_period ON leaderboard_entries(leaderboard_type, period_start, period_end);
CREATE INDEX idx_forum_posts_club_id ON forum_posts(club_id);
CREATE INDEX idx_classroom_enrollments_classroom_id ON classroom_enrollments(classroom_id);
