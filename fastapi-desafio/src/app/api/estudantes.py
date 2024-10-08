from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session

from app.services import service_estudante as service
from app.models.model_estudante import EstudanteDB, EstudanteSchema
from app.database.db import SessionLocal


router = APIRouter()


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.post("/", response_model=EstudanteDB, status_code=201)
def create_estudante(*, db: Session = Depends(get_db), payload: EstudanteSchema):
    estudante = service.post(db_session=db, payload=payload)
    return estudante


@router.get("/{id}/", response_model=EstudanteDB)
def read_estudante(
    *, db: Session = Depends(get_db), id: int = Path(..., gt=0),
):
    estudante = service.get(db_session=db, id=id)
    if not estudante:
        raise HTTPException(status_code=404, detail="Estudante not found")
    return estudante


# Modificado para retornar dados paginados
@router.get("/", response_model=Dict[str, Any])
def read_all_estudantes(
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(10, ge=1, le=100),  # Limite entre 1 e 100 registros por página
    offset: Optional[int] = Query(0, ge=0)  # Offset a partir de qual registro começar
):
    estudantes_paginados = service.get_all(db_session=db, limit=limit, offset=offset)
    total_items = service.get_total_count(db_session=db)

    # Calcula o número total de páginas
    total_pages = (total_items + limit - 1) // limit
    current_page = (offset // limit) + 1

    return {
        "total_items": total_items,
        "total_pages": total_pages,
        "current_page": current_page,
        "estudantes": estudantes_paginados
    }


@router.put("/{id}/", response_model=EstudanteDB)
def update_estudante(
    *, db: Session = Depends(get_db), id: int = Path(..., gt=0), payload: EstudanteSchema
):
    estudante = service.get(db_session=db, id=id)
    if not estudante:
        raise HTTPException(status_code=404, detail="Estudante not found")
    
    estudante = service.put(
        db_session=db, estudante=estudante, nome=payload.nome, email=payload.email, idade=payload.idade, curso=payload.curso
    )
    return estudante


@router.delete("/{id}/", status_code=204)
def delete_estudante(*, db: Session = Depends(get_db), id: int = Path(..., gt=0)):
    estudante = service.get(db_session=db, id=id)
    if not estudante:
        raise HTTPException(status_code=404, detail="Estudante not found")
    
    service.delete(db_session=db, id=id)
    return {"detail": "Estudante deleted successfully"}
