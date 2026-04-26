CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INT,
  amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name) VALUES
('Ali'), ('Veli'), ('Ayşe');

INSERT INTO transactions (user_id, amount) VALUES
(1, 100),
(1, 200),
(2, 300),
(3, 50);