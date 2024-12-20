
-- Get the average number of likes per post
SELECT post_id, AVG(liked_by_user_id) AS avg_likes
FROM post_likes
GROUP BY post_id
HAVING avg_likes > 10;

--Find all users who follow more than 5 other users
SELECT user_id, COUNT(follower_user_id) AS follower_count
FROM followers
GROUP BY user_id
HAVING follower_count > 5;


-- Rename column in the users table (renaming 'bio' to 'biography')
ALTER TABLE users RENAME COLUMN bio TO biography;

-- Drop a column from the comments table (dropping 'commented_at' column)
ALTER TABLE comments DROP COLUMN commented_at;

-- Add a new column to the posts table
ALTER TABLE posts ADD COLUMN location VARCHAR(255);

-- Drop the 'followers' table
DROP TABLE followers;



-- Rename the table 'chats' to 'conversations'
ALTER TABLE chats RENAME TO conversations;

--  Get the average number of comments per post
SELECT post_id, AVG(comment_id) AS avg_comments
FROM comments
GROUP BY post_id;


-- Add a new column to store post categories in the posts table
ALTER TABLE posts ADD COLUMN category VARCHAR(100);


-- Rename the column 'caption' in the posts table to 'post_caption'
ALTER TABLE posts RENAME COLUMN caption TO post_caption;

-- Get the posts with more than 5 comments
SELECT post_id, COUNT(comment_id) AS comment_count
FROM comments
GROUP BY post_id
HAVING comment_count > 5;

-- Find users who have liked more than 10 posts
SELECT liked_by_user_id, COUNT(post_id) AS like_count
FROM post_likes
GROUP BY liked_by_user_id
HAVING like_count > 10;

