DROP TABLE IF EXISTS game;

CREATE TABLE game(
  game_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  total_points INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
  game (user_name, total_points)
VALUES
  ('Bello', 20),
  ('CARN', 450),
  ('MELT', 900),
  ('SIG', 40),
  ('JAN', 8000),
  ('ME', 10),
  ('HIHI', 40),
  ('BELLO', 20),
  ('CARN', 450),
  ('MELT', 900),
  ('PANTS', 310),
  ('JAN', 500),
  ('ME', 10),
  ('LOOOL', 40),
  ('FARM', 20),
  ('CARN', 350),
  ('TIG', 600),
  ('SIG', 40),
  ('JAN', 6400),
  ('WELDER', 10),
  ('HIHI', 90),
  ('BOOBOO', 20),
  ('MALLO', 450),
  ('MELT', 900),
  ('PANTS', 310),
  ('JAN', 500),
  ('ME', 10),
  ('LOOOL', 40),
  ('Bello', 20),
  ('CARN', 350),
  ('BOOBOO', 20),
  ('MALLO', 450),
  ('MELT', 230),
  ('PANTS', 310),
  ('TILLY', 760);