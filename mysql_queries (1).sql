
-- 1. Get the average number of likes per post
SELECT post_id, AVG(liked_by_user_id) AS avg_likes
FROM post_likes
GROUP BY post_id
HAVING avg_likes > 10;

-- 2. Find all users who follow more than 5 other users
SELECT user_id, COUNT(follower_user_id) AS follower_count
FROM followers
GROUP BY user_id
HAVING follower_count > 5;

-- 3. Get the average number of views per story
SELECT story_id, AVG(viewer_user_id) AS avg_views
FROM story_views
GROUP BY story_id;

-- 4. Rename column in the users table (renaming 'bio' to 'biography')
ALTER TABLE users RENAME COLUMN bio TO biography;

-- 5. Drop a column from the comments table (dropping 'commented_at' column)
ALTER TABLE comments DROP COLUMN commented_at;

-- 6. Add a new column to the posts table
ALTER TABLE posts ADD COLUMN location VARCHAR(255);

-- 7. Drop the 'followers' table
DROP TABLE followers;

-- 8. Find the average session time in the login_sessions table
SELECT user_id, AVG(TIMESTAMPDIFF(SECOND, login_time, logout_time)) AS avg_session_time
FROM login_sessions
GROUP BY user_id;

-- 9. Rename the table 'chats' to 'conversations'
ALTER TABLE chats RENAME TO conversations;

-- 10. Get the average number of comments per post
SELECT post_id, AVG(comment_id) AS avg_comments
FROM comments
GROUP BY post_id;

-- 11. Find users with an average of more than 20 views on their stories
SELECT s.user_id, AVG(sv.viewer_user_id) AS avg_story_views
FROM stories s
JOIN story_views sv ON s.story_id = sv.story_id
GROUP BY s.user_id
HAVING avg_story_views > 20;

-- 12. Get the average number of hashtags used per post
SELECT post_id, AVG(hashtag_id) AS avg_hashtags
FROM post_hashtags
GROUP BY post_id;

-- 13. Add a new column to store post categories in the posts table
ALTER TABLE posts ADD COLUMN category VARCHAR(100);

-- 14. Drop the 'login_sessions' table
DROP TABLE login_sessions;

-- 15. Rename the column 'caption' in the posts table to 'post_caption'
ALTER TABLE posts RENAME COLUMN caption TO post_caption;

-- 16. Get the posts with more than 5 comments
SELECT post_id, COUNT(comment_id) AS comment_count
FROM comments
GROUP BY post_id
HAVING comment_count > 5;

-- 17. Find users who have liked more than 10 posts
SELECT liked_by_user_id, COUNT(post_id) AS like_count
FROM post_likes
GROUP BY liked_by_user_id
HAVING like_count > 10;

