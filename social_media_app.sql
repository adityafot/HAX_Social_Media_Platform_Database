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

create table followeers(
user_id int not null primary key,
follower_user_id int not null primary key,
followed_at timestamp default current_timestamp,
foreign key (user_id) references users(user_id) on delete cascade,
foreign key(follower_user_id) references users(user_id) on delete cascade
);

create table post_likes(
post_id int primary key ,
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


