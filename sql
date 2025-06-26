-- Creación de la base de datos
CREATE DATABASE moviesdb;

-- Usar
USE moviesdb;

-- Crear la tabla movie
CREATE TABLE movie (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  title VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  director VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  poster TEXT,
  rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

-- Crear la tabla genre
CREATE TABLE genre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Crear la tabla movie_genres
CREATE TABLE movie_genres (
  movie_id BINARY(16) REFERENCES movie(id),
  genre_id INT REFERENCES genres(id),
  PRIMARY KEY (movie_id, genre_id)
);

-- Insertar géneros
INSERT INTO genre (name) VALUES
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance');

-- Insertar películas
INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID()), "Inception", 2010, "Christopher Nolan", 180, "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg", 8.8),
(UUID_TO_BIN(UUID()), "The Shawshank Redemption", 1994, "Frank Darabond", 142, "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp", 9),
(UUID_TO_BIN(UUID()), "The Dark Knight", 2008, "Christopher Nolan", 152, "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg", 9);

-- Insertar relaciones entre películas y géneros
INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN('7e3fd5ab-60ff-4ae2-92b6-9597f0308d1b'), "Gladiator", 2000, "Ridley Scott", 155, "https://img.fruugo.com/product/0/60/14417600_max.jpg", 8.5),
(UUID_TO_BIN('c906673b-3948-4402-ac7f-73ac3a9e3105'), "The Matrix", 1999, "Lana Wachowski", 136, "https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg", 8.7),
(UUID_TO_BIN('b6e03689-cccd-478e-8565-d92f40813b13'), "Interstellar", 2014, "Christopher Nolan", 169, "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg", 8.6),
(UUID_TO_BIN('aa391090-b938-42eb-b520-86ea0aa3917b'), "The Lord of the Rings: The Return of the King", 2003, "Peter Jackson", 201, "https://i.ebayimg.com/images/g/0hoAAOSwe7peaMLW/s-l1600.jpg", 8.9),
(UUID_TO_BIN('2e6900e2-0b48-4fb6-ad48-09c7086e54fe'), "The Lion King", 1994, "Roger Allers, Rob Minkoff", 88, "https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg", 8.5),
(UUID_TO_BIN('04986507-b3ed-442c-8ae7-4c5df804f896'), "The Avengers", 2012, "Joss Whedon", 143, "https://img.fruugo.com/product/7/41/14532417_max.jpg", 8.0),
(UUID_TO_BIN('7d2832f8-c70a-410e-8963-4c93bf36cc9c'), "Jurassic Park", 1993, "Steven Spielberg", 127, "https://vice-press.com/cdn/shop/products/Jurassic-Park-Editions-poster-florey.jpg?v=1654518755&width=1024", 8.1),
(UUID_TO_BIN('ccf36f2e-8566-47f7-912d-9f4647250bc7'), "Titanic", 1997, "James Cameron", 195, "https://i.pinimg.com/originals/42/42/65/4242658e6f1b0d6322a4a93e0383108b.png", 7.8),
(UUID_TO_BIN('8fb17ae1-bdfe-45e5-a871-4772d7e526b8'), "The Social Network", 2010, "David Fincher", 120, "https://i.pinimg.com/originals/7e/37/b9/7e37b994b613e94cba64f307b1983e39.jpg", 7.7),
(UUID_TO_BIN('6a360a18-c645-4b47-9a7b-2a71babbf3e0'), "Avatar", 2009, "James Cameron", 162, "https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg", 7.8);

-- Verificar que los datos se insertaron correctamente
SELECT *, BIN_TO_UUID (id) id FROM movie;
SELECT * FROM genre;
SELECT * FROM movie_genres;


-- DROP DATABASE IF EXISTS moviesdb;