-- +goose Up
CREATE TABLE quote (id integer primary key, author_id integer, topic text, content text);
CREATE TABLE author (id integer primary key, command text, full_name text, picture_url text);
CREATE TABLE picture (id integer primary key, command text, url text);

-- +goose Down
--DROP TABLE quote;
--DROP TABLE author;
--DROP TABLE picture;
