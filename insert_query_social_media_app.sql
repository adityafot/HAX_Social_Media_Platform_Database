USE social_media_app;

-- Inserting into Users Table
INSERT INTO users (username, password, bio, profile_picture_url) VALUES
('ashish', 'hashed_password_ashish', 'Student at IIT Delhi, loves coding.', 'http://example.com/ashish.jpg'),
('piyush', 'hashed_password_piyush', 'Electrical Engineering student at NIT Jaipur.', 'http://example.com/piyush.jpg'),
('aditya', 'hashed_password_aditya', 'Mechanical Engineering student, passionate about robotics.', 'http://example.com/aditya.jpg'),
('anubhav', 'hashed_password_anubhav', 'Computer Science student at BITS Pilani, AI enthusiast.', 'http://example.com/anubhav.jpg');

-- Inserting into Followers Table
INSERT INTO followers (user_id, follower_user_id) VALUES
(1, 2), -- Piyush follows Ashish
(1, 3), -- Aditya follows Ashish
(2, 4), -- Anubhav follows Piyush
(3, 1); -- Ashish follows Aditya

-- Inserting into Posts Table
INSERT INTO posts (user_id, caption, resource_link) VALUES
(1, 'Working on my new AI project', 'http://example.com/ai_project.pdf'),
(2, 'Excited about my new internship!', 'http://example.com/internship.jpg'),
(3, 'Check out my robotics prototype!', 'http://example.com/robotics.mp4'),
(4, 'Learning deep learning techniques.', 'http://example.com/deep_learning.png');

-- Inserting into Post Likes Table
INSERT INTO post_likes (post_id, liked_by_user_id) VALUES
(1, 2), -- Piyush liked Ashish's post
(1, 4), -- Anubhav liked Ashish's post
(3, 1), -- Ashish liked Aditya's post
(4, 3); -- Aditya liked Anubhav's post

-- Inserting into Comments Table
INSERT INTO comments (post_id, user_id, commented_text) VALUES
(1, 3, 'Awesome work Ashish! Keep it up.'),
(2, 1, 'Congrats Piyush! All the best.'),
(3, 4, 'This is impressive! Let\'s collaborate.'),
(4, 2, 'Deep learning is the future!');

-- Inserting into Shared Posts Table
INSERT INTO shared_posts (post_id, shared_by_user_id, shared_to_user_id) VALUES
(1, 2, 3), -- Piyush shared Ashish's post with Aditya
(3, 4, 1); -- Anubhav shared Aditya's post with Ashish

-- Inserting into Stories Table
INSERT INTO stories (user_id, resource_link, caption) VALUES
(1, 'http://example.com/ashish_story.jpg', 'Coding all day!'),
(2, 'http://example.com/piyush_story.jpg', 'Started my internship!'),
(3, 'http://example.com/aditya_story.jpg', 'Building a robot!'),
(4, 'http://example.com/anubhav_story.jpg', 'AI is fascinating!');

-- Inserting into Story Views Table
INSERT INTO story_views (story_id, viewer_user_id) VALUES
(1, 2), -- Piyush viewed Ashish's story
(2, 3), -- Aditya viewed Piyush's story
(3, 4), -- Anubhav viewed Aditya's story
(4, 1); -- Ashish viewed Anubhav's story

-- Inserting into Highlights Table
INSERT INTO highlights (user_id, highlight_name) VALUES
(1, 'Ashish\'s Best Moments'),
(2, 'Piyush\'s Internship Journey'),
(3, 'Aditya\'s Robotics'),
(4, 'Anubhav\'s AI Projects');

-- Inserting into Highlight Stories Table
INSERT INTO highlight_stories (highlight_id, story_id) VALUES
(1, 1), -- Ashish's story in his highlights
(2, 2), -- Piyush's story in his highlights
(3, 3), -- Aditya's story in his highlights
(4, 4); -- Anubhav's story in his highlights

-- Inserting into Chats Table
INSERT INTO chats (user1_id, user2_id) VALUES
(1, 2), -- Chat between Ashish and Piyush
(3, 4); -- Chat between Aditya and Anubhav

-- Inserting into Chat Logs Table
INSERT INTO chat_logs (chat_id, sender_user_id, message_text) VALUES
(1, 1, 'Hey Piyush, how is your internship going?'),
(1, 2, 'It\'s going great! Learning a lot.'),
(2, 3, 'Anubhav, let\'s discuss the new robotics project.'),
(2, 4, 'Absolutely! Excited to work on it.');

-- Inserting into Login Sessions Table
INSERT INTO login_sessions (user_id, session_token, login_ip, is_active) VALUES
(1, 'token_ashish', '192.168.1.1', TRUE),
(2, 'token_piyush', '192.168.1.2', TRUE),
(3, 'token_aditya', '192.168.1.3', TRUE),
(4, 'token_anubhav', '192.168.1.4', TRUE);

-- Inserting into Hashtags Table
INSERT INTO hashtags (hashtag_name) VALUES
('#AI', '#Robotics', '#Coding', '#Internship');

-- Inserting into User Hashtag Follows Table
INSERT INTO user_hashtag_follows (user_id, hashtag_id) VALUES
(1, 1), -- Ashish follows #AI
(2, 4), -- Piyush follows #Internship
(3, 2), -- Aditya follows #Robotics
(4, 1); -- Anubhav follows #AI

-- Inserting into Post Hashtags Table
INSERT INTO post_hashtags (post_id, hashtag_id) VALUES
(1, 1), -- Ashish's post is tagged with #AI
(3, 2), -- Aditya's post is tagged with #Robotics
(2, 4), -- Piyush's post is tagged with #Internship
(4, 1); -- Anubhav's post is tagged with #AI
