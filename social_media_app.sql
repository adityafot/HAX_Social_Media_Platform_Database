create database social_media_app;
use social_media_app;

create table users (
user_id int auto_increment primary key,
username varchar(50) unique not null,
password varchar(255) not null,
bio text,
profile_picture_url varchar(255),
created_at timestamp default current_timestamp
);

create table followers (
user_id int not null,
follower_user_id int not null,
followed_at timestamp default current_timestamp,
primary key (user_id, follower_user_id),
foreign key (user_id) references users(user_id) on delete cascade,
foreign key (follower_user_id) references users(user_id) on delete cascade
);

create table posts (
post_id int auto_increment primary key,
user_id int not null,
caption text,
resource_link varchar(255) not null,  -- url to image or video
created_at timestamp default current_timestamp,
foreign key (user_id) references users(user_id) on delete cascade
);

create table post_likes (
post_id int not null,
liked_by_user_id int not null,
liked_at timestamp default current_timestamp,
primary key (post_id, liked_by_user_id),
foreign key (post_id) references posts(post_id) on delete cascade,
foreign key (liked_by_user_id) references users(user_id) on delete cascade
);

create table comments (
comment_id int auto_increment primary key,
post_id int not null,
user_id int not null,
commented_text text not null,
commented_at timestamp default current_timestamp,
foreign key (post_id) references posts(post_id) on delete cascade,
foreign key (user_id) references users(user_id) on delete cascade
);

create table shared_posts (
share_id int auto_increment primary key,
post_id int not null,
shared_by_user_id int not null,
shared_to_user_id int default null,
shared_at timestamp default current_timestamp,
foreign key (post_id) references posts(post_id) on delete cascade,
foreign key (shared_by_user_id) references users(user_id) on delete cascade,
foreign key (shared_to_user_id) references users(user_id) on delete cascade
);

create table stories (
story_id int auto_increment primary key,
user_id int not null,
resource_link varchar(255) not null,  -- url to image/video
caption text,
created_at timestamp default current_timestamp,
expires_at timestamp default (current_timestamp + interval 24 hour),  -- story expires after 24 hours
foreign key (user_id) references users(user_id) on delete cascade
);

create table story_views (
view_id int auto_increment primary key,
story_id int not null,
viewer_user_id int not null,
viewed_at timestamp default current_timestamp,
foreign key (story_id) references stories(story_id) on delete cascade,
foreign key (viewer_user_id) references users(user_id) on delete cascade
);

create table highlights(
highlight_id int auto_increment primary key,
user_id int not null,
story_id int not null,
highlight_name varchar(100),
created_at timestamp default current_timestamp,
foreign key (story_id) references stories(story_id) on delete cascade,
foreign key (user_id) references users(user_id) on delete cascade
);

create table chats (
chat_id int auto_increment primary key,
user1_id int not null,
user2_id int not null,
started_at timestamp default current_timestamp,
foreign key (user1_id) references users(user_id) on delete cascade,
foreign key (user2_id) references users(user_id) on delete cascade
);

create table chat_logs(
log_id int auto_increment primary key,
chat_id int not null,
sender_user_id int not null,
message text not null,
sent_at timestamp default current_timestamp,
foreign key (chat_id) references chats(chat_id) on delete cascade,
foreign key (sender_user_id) references users(user_id) on delete cascade
);

create table login_sessions (
session_id int auto_increment primary key,
user_id int not null,
session_token varchar(255) not null unique,
login_ip varchar(45),
login_time timestamp default current_timestamp,
logout_time timestamp null,
is_active boolean default true,
foreign key (user_id) references users(user_id) on delete cascade
);

create table hashtags (
hashtag_id int auto_increment primary key,
hashtag_name varchar(50) unique not null
);

create table user_hashtag_follows (
user_id int not null,
hashtag_id int not null,
followed_at timestamp default current_timestamp,
primary key (user_id, hashtag_id),
foreign key (user_id) references users(user_id) on delete cascade,
foreign key (hashtag_id) references hashtags(hashtag_id) on delete cascade
);

create table post_hashtags (
post_id int not null,
hashtag_id int not null,
primary key (post_id, hashtag_id),
foreign key (post_id) references posts(post_id) on delete cascade,
foreign key (hashtag_id) references hashtags(hashtag_id) on delete cascade
);


-- INSERTING VALUES 


INSERT INTO users (username, password, bio, profile_picture_url) VALUES
('ashish', 'hashed_password_ashish', 'Student at FOT DU loves coding.', 'http://example.com/ashish.jpg'),
('piyush', 'hashed_password_piyush', 'Electrical Engineering student at FOT DU.', 'http://example.com/piyush.jpg'),
('aditya', 'hashed_password_aditya', 'CSE student, passionate about tech.', 'http://example.com/aditya.jpg'),
('anubhav', 'hashed_password_anubhav', 'Computer Science student at FOT DU, finance geek.', 'http://example.com/anubhav.jpg');


INSERT INTO followers (user_id, follower_user_id) VALUES
(1, 2), -- Piyush follows Ashish
(1, 3), -- Aditya follows Ashish
(2, 4), -- Anubhav follows Piyush
(3, 1); -- Ashish follows Aditya


INSERT INTO posts (user_id, caption, resource_link) VALUES
(1, 'Carpediem!', 'http://example.com/image_1.jpg'),
(2, 'Freshers 2k24', 'http://example.com/image_2.jpg'),
(3, 'Here Comes the Sun!', 'http://example.com/video_1.mp4'),
(4, 'Stuck In My Mind and Here We Are....', 'http://example.com/video_2.mp4');


INSERT INTO post_likes (post_id, liked_by_user_id) VALUES
(1, 2), -- Piyush liked Ashish's post
(1, 4), -- Anubhav liked Ashish's post
(3, 1), -- Ashish liked Aditya's post
(4, 3); -- Aditya liked Anubhav's post


INSERT INTO comments (post_id, user_id, commented_text) VALUES
(1, 3, 'Too Good Broo :)' ),
(2, 1, 'Memories to Last Forever ✍️(◔◡◔)'),
(3, 4, 'Sunrise Heals For Real Homie.'),
(4, 2, 'Great Singing! Let us collaborate ¯\_( ͡° ͜ʖ ͡°)_/¯');


INSERT INTO shared_posts (post_id, shared_by_user_id, shared_to_user_id) VALUES
(1, 2, 3), -- Piyush shared Ashish's post with Aditya
(3, 4, 1); -- Anubhav shared Aditya's post with Ashish


INSERT INTO stories (user_id, resource_link, caption) VALUES
(1, 'http://example.com/ashish_story.jpg', 'Soo True'),
(2, 'http://example.com/piyush_story.jpg', 'What a day it was!'),
(3, 'http://example.com/aditya_story.jpg', 'New Post!'),
(4, 'http://example.com/anubhav_story.jpg', 'My Singing Video');


INSERT INTO story_views (story_id, viewer_user_id) VALUES
(1, 2), -- Piyush viewed Ashish's story
(2, 3), -- Aditya viewed Piyush's story
(3, 4), -- Anubhav viewed Aditya's story
(4, 1); -- Ashish viewed Anubhav's story


INSERT INTO highlights (user_id, story_id, highlight_name) VALUES
(1, 1,'Ashish\'s Best Moments'),
(2, 2,'Piyush\'s  Journey'),
(3, 3,'Aditya\'s Memories'),
(4, 4,'Anubhav\'s Fun Moments')
;


INSERT INTO chats (user1_id, user2_id) VALUES
(1, 2), -- Chat between Ashish and Piyush
(3, 4); -- Chat between Aditya and Anubhav


INSERT INTO chat_logs (chat_id, sender_user_id, message) VALUES
(1, 1, 'Hey Piyush, how is your life going?'),
(1, 2, 'It\'s going great! Learning a lot.'),
(2, 3, 'Anubhav, let\'s meet at 2 30 pm in the gym.'),
(2, 4, 'Absolutely!');


INSERT INTO login_sessions (user_id, session_token, login_ip, is_active) VALUES
(1, 'token_ashish', '192.168.1.1', TRUE),
(2, 'token_piyush', '192.168.1.2', TRUE),
(3, 'token_aditya', '192.168.1.3', TRUE),
(4, 'token_anubhav', '192.168.1.4', TRUE);

INSERT INTO hashtags (hashtag_name) VALUES
('#fun'),
('#Memories'),
('#Singing'),
('#Holidays');

INSERT INTO user_hashtag_follows (user_id, hashtag_id) VALUES
(1, 1), -- Ashish follows #fun
(2, 4), -- Piyush follows #Holidays
(3, 2), -- Aditya follows #Memories
(4, 1); -- Anubhav follows #Singing

INSERT INTO post_hashtags (post_id, hashtag_id) VALUES
(1, 1), -- Ashish's post is tagged with #fun
(3, 4), -- Aditya's post is tagged with #Holidays
(2, 2), -- Piyush's post is tagged with #Memories
(4, 1); -- Anubhav's post is tagged with #Singing


-- QUERIES FOR DATA RETRIEVAL



-- Get a user's profile information (username, bio, profile picture)

select username, bio, profile_picture_url, created_at 
from users 
where user_id = 1;

--  Get all posts by a user

select post_id, caption, resource_link, created_at 
from posts 
where user_id = 1 
order by created_at desc;

--  Get the number of followers for a user

select count(follower_user_id) as total_followers 
from followers 
where user_id = 1;

--  Get the number of users a user is following

select count(user_id) as total_following 
from followers 
where follower_user_id = 1;

-- Get the followers list for a user

select u.username 
from followers f
join users u on f.follower_user_id = u.user_id
where f.user_id = 1;

-- Get the list of users a user is following

select u.username 
from followers f
join users u on f.user_id = u.user_id
where f.follower_user_id = 1;

-- Get the posts a user has liked

select p.post_id, p.caption, p.resource_link, p.created_at 
from post_likes pl
join posts p on pl.post_id = p.post_id
where pl.liked_by_user_id = 1
order by p.created_at desc;

-- Get all comments on a specific post

select u.username, c.commented_text, c.commented_at 
from comments c
join users u on c.user_id = u.user_id
where c.post_id = 1
order by c.commented_at asc;

-- Get a user's story along with its views count

select s.story_id, s.resource_link, s.caption, s.created_at, count(sv.viewer_user_id) as views_count
from stories s
left join story_views sv on s.story_id = sv.story_id
where s.user_id = 1
group by s.story_id, s.resource_link, s.caption, s.created_at;

--  Get the chat messages between two users

select cl.message, cl.sent_at, u.username as sender 
from chat_logs cl
join users u on cl.sender_user_id = u.user_id
where cl.chat_id = (select chat_id from chats where (user1_id = 1 and user2_id = 2) or (user1_id = 2 and user2_id = 1))
order by cl.sent_at asc;

-- Get posts with a specific hashtag

select p.post_id, p.caption, p.resource_link, p.created_at 
from posts p
join post_hashtags ph on p.post_id = ph.post_id
join hashtags h on ph.hashtag_id = h.hashtag_id
where h.hashtag_name = '#fun'
order by p.created_at desc;

--  Get the users following a specific hashtag

select u.username
from user_hashtag_follows uhf
join users u on uhf.user_id = u.user_id
join hashtags h on uhf.hashtag_id = h.hashtag_id
where h.hashtag_name = '#memories';

-- Get login session details of a user

select session_token, login_ip, login_time, logout_time, is_active 
from login_sessions 
where user_id = 1 
order by login_time desc;

-- Get the most recent posts from users a specific user is following (feed)

select p.post_id, u.username, p.caption, p.resource_link, p.created_at
from posts p
join users u on p.user_id = u.user_id
join followers f on p.user_id = f.user_id
where f.follower_user_id = 1
order by p.created_at desc;



