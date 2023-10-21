from config import app, db
from models import Set, Flashcard

with app.app_context():
    db.session.query(Flashcard).delete()
    db.session.query(Set).delete()
    db.session.commit()
