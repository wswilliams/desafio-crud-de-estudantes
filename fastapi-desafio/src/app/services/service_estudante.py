from sqlalchemy.orm import Session
from math import ceil

from app.models.model_estudante import Estudante, EstudanteSchema


def post(db_session: Session, payload: EstudanteSchema):
    estudante = Estudante(nome=payload.nome, email=payload.email, idade=payload.idade, curso=payload.curso)
    db_session.add(estudante)
    db_session.commit()
    db_session.refresh(estudante)
    return estudante


def get(db_session: Session, id: int):
    return db_session.query(Estudante).filter(Estudante.id == id).first()

def get_all(db_session: Session, limit: int, offset: int):
    return db_session.query(Estudante).offset(offset).limit(limit).all()


def get_total_count(db_session: Session):
    return db_session.query(Estudante).count()

def put(db_session: Session, estudante: Estudante, nome: str, email: str, idade: str, curso: str):
    estudante.nome = nome
    estudante.email = email
    estudante.idade = idade
    estudante.curso = curso
    db_session.commit()
    return estudante

def delete(db_session: Session, id: int):
    estudante = db_session.query(Estudante).filter(Estudante.id == id).first()
    if estudante:
        db_session.delete(estudante)
        db_session.commit()
        return True
    return False