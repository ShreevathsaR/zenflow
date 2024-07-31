CREATE DATABASE zenflow;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE notes(
    noteid SERIAL PRIMARY KEY,
    id INTEGER REFERENCES users(userid),
    notes_title VARCHAR(255) NOT NULL,
    notes_desc TEXT NOT NULL
);

INSERT INTO users (email, password) VALUES ('vathsaworks@gmail.com', '9353152800@Chiu');

INSERT INTO notes (id, notes_title, notes_desc) VALUES (1, 'Greetings', 'Hello world!!');
-- INSERT INTO notes (id, notes_title, notes_desc) VALUES (2, 'Greetings', 'Hello world!!');