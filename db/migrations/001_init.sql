-- +goose Up
CREATE TABLE quote (id integer primary key, author_id integer, topic text, content text);
CREATE TABLE author (id integer primary key, command text, full_name text, picture_url text);
CREATE TABLE picture (id integer primary key, command text, url text);
CREATE TABLE birthday (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_tag TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL UNIQUE,
    birthday DATE NOT NULL
);

-- +goose Down
--DROP TABLE quote;
--DROP TABLE author;
--DROP TABLE picture;
