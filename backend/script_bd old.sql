-- Criar a base de dados SIRIUS
CREATE DATABASE SIRIUS;
GO

-- Selecionar a base de dados SIRIUS
USE SIRIUS;
GO

-- Criar a tabela Utilizador
CREATE TABLE Utilizador (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
    nome NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    pass NVARCHAR(255) NOT NULL
);
GO

CREATE TABLE Profile (
    id INT IDENTITY(1,1) PRIMARY KEY,
    descricao NVARCHAR(255) NOT NULL,
);
GO

CREATE TABLE Recurso (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL,
    chave NVARCHAR(255) NOT NULL,
);
GO

CREATE TABLE ProfileUser (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    IdUser INT NOT NULL,
    IdProfile INT NOT NULL,
    FOREIGN KEY (IdUser) REFERENCES Utilizador(Id),
    FOREIGN KEY (IdProfile) REFERENCES Profile(Id)
);

-- Inserir os personagens de Game of Thrones na tabela Utilizador
INSERT INTO Utilizador (username, nome, email, pass)
VALUES 
('lutero.chipenhe', 'Lutero Chipenhe', 'lutero.chipenhe@cmc.ao', 'teste'),
('jon.snow', 'Jon Snow', 'jon.snow@got.com', 'valarmorghulis'),
('daenerys.targaryen', 'Daenerys Targaryen', 'daenerys.targaryen@got.com', 'dracarys'),
('tyrion.lannister', 'Tyrion Lannister', 'tyrion.lannister@got.com', 'wittyquote'),
('arya.stark', 'Arya Stark', 'arya.stark@got.com', 'needle'),
('cersei.lannister', 'Cersei Lannister', 'cersei.lannister@got.com', 'hearmeroar');
GO
