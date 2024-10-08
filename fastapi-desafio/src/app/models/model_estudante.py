from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.db import Base


# SQLAlchemy Model


class Estudante(Base):

    __tablename__ = "estudantes"

    id = Column(Integer, primary_key=True)
    nome = Column(String(50))
    email = Column(String(100))
    idade = Column(Integer)
    curso = Column(String(200))
    created_date = Column(DateTime, default=func.now(), nullable=False)

    def __init__(self, nome, email, idade, curso):
        self.nome = nome
        self.email = email
        self.idade = idade
        self.curso = curso


# Pydantic Model

class EstudanteSchema(BaseModel):
    nome: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=3, max_length=100)
    idade: int = Field(..., ge=0)
    curso: str = Field(..., min_length=3, max_length=200)


class EstudanteDB(EstudanteSchema):
    id: int

    class Config:
        orm_mode = True
