-- +goose Up
INSERT INTO author (command, full_name, picture_url) VALUES ('tux', 'Tux', 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg');
INSERT INTO quote (author_id, topic, content) VALUES (1, 'Linux', 'Linux is a great OS');
INSERT INTO picture (command, url) VALUES ('tuxpic', 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg');
INSERT INTO birthdays (user_tag, birthday) VALUES ('tux', '1991-08-25');
INSERT INTO counter (tag, description, count) VALUES ('tux', 'Some description', 0);

-- +goose Down
--DELETE FROM author;
--DELETE FROM quote;
--DELETE FROM picture;
