from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from config import db, bcrypt, MetaData

class Set(db.Model, SerializerMixin):
    __tablename__ = 'sets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    flashcards = db.relationship('Flashcard', back_populates='set', cascade="all, delete-orphan")

    def __init__(self) -> None:
        self.created_at = datetime.utcnow()

class Flashcard(db.Model, SerializerMixin):
    __tablename__ = 'flashcards'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String, nullable=False)
    answer = db.Column(db.String, nullable=False)
    set_id = db.Column('set_id', db.Integer, db.ForeignKey('sets.id'))

    set = db.relationship("Set", back_populates="flashcards")

    def __repr__(self):
        return f'Flashcard {self.question} - {self.answer}'