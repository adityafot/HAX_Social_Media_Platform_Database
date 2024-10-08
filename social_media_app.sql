CREATE DATABASE social_media_app;
USE social_media_app;

create table users(
user_id int auto_increment primary key,
username varchar(50) unique not null,
password text(255) not null,
bio text,
profile_pitcure_url varchar(255),
created_at timestamp default current_timestamp
);

create table followers(
user_id int not null ,
follower_user_id int not null primary key,
followed_at timestamp default current_timestamp,
primary key (user_id , follower_user_id) ,
foreign key (user_id) references users(user_id) on delete cascade,
foreign key(follower_user_id) references users(user_id) on delete cascade
);

create table posts (
post_id int  auto_increment primary key ,
user_id int  not null ,
caption text ,
resource_link varchar(255) not null ,
created_id timestamp default current_timestamp
);

create table post_likes(
post_id int primary key,
liked_by_user_id int primary key,
liked_at timestamp default current_timestamp,
foreign key (post_id) references posts(post_id) on delete cascade
);

create table comments(
comment_id int auto_increment primary key,
post_id int not null,
user_id int not null,
commented_text text not null,
commented_at timestamp default current_timestamp,
foreign key(post_id) references posts(post_id) on delete cascade,
foreign key(user_id) references posts(user_id) on delete cascade
);

create table shared_posts(
share_id int auto_increment primary key,
post_id int not null,
shared_by_user_id int not null,
shared_to_user_id int not null,
shared_at timestamp default current_timestamp,
foreign key (post_id) references posts(post_id) on delete cascade,
foreign key (shared_by_user_id) references users(user_id) on delete cascade,
foreign key (shared_to_user_id) references users(user_id) on delete cascade
);

create table stories(
story_id int auto_increment primary key,
user_id int not null,
resource_link varchar(255) not null,
caption text ,
created_at timestamp default current_timestamp,
expires_at timestamp default (current_timestamp + interval 24 hour),
foreign key (user_id) references users(user_id) on delete cascade
);
create table story_views(
view_id int auto_increment primary key,
story_id int not null,
viewer_user_id int not null,
viewed_at timestamp default current_timestamp,
foreign key (story_id) references stories (story_id) on delete cascade,
foreign key (viewer_user_id) references users(user_id) on delete cascade
);

create table highlights (
highlight_id int  auto_increment primary key,
user_id int not null,
highlight_name varchar(100),
created_at timestamp default current_timestamp,

foreign key (user_id) references users(user_id) on delete cascade
);

create table highlight_stories(
highlight_id int primary key,
story_id int primary key,
foreign key(highlight_id) references highlights(highlight_id) on delete cascade,
foreign key (story_id) references stories(story_id) on delete cascade
);

create table chats (
chat_id int auto_increment primary key ,
user1_id int not null ,
user2_id int not null ,
started timestamp default current_timestamp ,
foreign key (user1_id) references users(user_id) on delete cascade ,
foreign key (user2_id) references users(user_id) on delete cascade 
) ;

create table chat_logs (
log_id int auto_increment primary key ,
chat_id int not null ,
sender_user_id int not null ,
message_text text not null ,
sent_at timestamp default current_timestamp ,
foreign key(sender_user_id) references users(user_id) on delete cascade 
); 

create table login_sessions (
sessions_id  int auto_increment primary key,
user_id      int not null ,
session_token varchar(255) not null unique,
login_ip varchar(45),
login_time timestamp default current_timestamp,
logout_time timestamp null ,
is_active boolean default true ,
foreign key(user_id) references users(user_id) on delete cascade
);

create table hashtags (
hashtag_id int auto_increment primary key ,
hashtag_name varchar(50) unique not null 
);

create table user_hashtag_follows (
user_id int not null ,
hashtag_id int not null ,
followed_at timestamp default current_timestamp,
primary key(user_id , hashtag_id) ,
foreign key(user_id) references users(user_id) on delete cascade,
foreign key(hashtag_id) references hashtags(hashtag_id) on delete cascade 
);

create table post_hashtags (
post_id int not null ,
hashtag_id int not null ,
primary key(post_id ,hashtag_id) ,
foreign key(hashtag_id) references hashtags(hashtag_id) on delete cascade
);




