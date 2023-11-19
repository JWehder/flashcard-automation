from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from config import db

class Base(db.Model, SerializerMixin):
    __abstract__ = True
    # include_timestamps = False

    def to_dict(self, visited=None, exclude=None):
        if visited is None:
            visited = set()
        if exclude is None:
            exclude = set()

        if self in visited:
            return {}

        visited.add(self)

        serialized = {}
        for column in self.__table__.columns:
            serialized[column.name] = getattr(self, column.name)

        for relationship in self.__mapper__.relationships:
            if relationship.key not in exclude:
                related_obj = getattr(self, relationship.key)
                if related_obj is None:
                    serialized[relationship.key] = None
                elif isinstance(related_obj, list):
                    serialized[relationship.key] = [obj.to_dict(visited) for obj in related_obj]
                else:
                    serialized[relationship.key] = related_obj.to_dict(visited)

        visited.remove(self)
        return serialized

    def to_serializable(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at
        }

class Set(Base):
    __tablename__ = 'sets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime)
    flashcards = db.relationship('Flashcard', back_populates='set', cascade="all, delete-orphan")

    def __init__(self, name) -> None:
        self.created_at = datetime.utcnow()
        self.name = name

class Flashcard(Base):
    __tablename__ = 'flashcards'

    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String, nullable=False)
    definition = db.Column(db.String, nullable=False)
    set_id = db.Column('set_id', db.Integer, db.ForeignKey('sets.id'))

    set = db.relationship("Set", back_populates="flashcards")

    def __repr__(self):
        return f'Flashcard {self.question} - {self.answer}'

    @validates('term')
    def validate_term_length(self, key, term):
        if len(term) <= 0:
            raise AttributeError('Term must have more than zero characters')
        return term

    @validates('definition')
    def validate_def_length(self, key, definition):
        if len(definition) <= 0:
            raise AttributeError('Definition must have more than zero characters')
        return definition