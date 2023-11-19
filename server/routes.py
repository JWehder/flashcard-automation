from flask import request, session, jsonify, send_file, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
import traceback
from functools import wraps
from config import app, db, api
from models import Set, Flashcard
from config import Flask, SQLAlchemy, db

#HTTP Constants 
HTTP_SUCCESS = 200
HTTP_CREATED = 201
HTTP_NO_CONTENT = 204
HTTP_UNAUTHORIZED = 401
HTTP_NOT_FOUND = 404
HTTP_BAD_REQUEST = 400
HTTP_CONFLICT = 409
HTTP_SERVER_ERROR = 500
HTTP_UNPROCESSABLE_ENTITY = 422

# possibility of use if I decide to actually deploy a version of it
def authorized(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            return make_response(jsonify({'error': 'Not authorized'}),HTTP_UNAUTHORIZED)
        return func(*args, **kwargs)
    return wrapper

@app.route('/sets/<int:id>', methods=['GET', 'POST', 'DELETE'])
def modify_sets(set_id):
    if request.method == 'GET':
        # retrieve the terms by the particular set that was selected
        _set = Set.query.filter_by(id=set_id).first()
        if _set is None:
            return {'error': 'set not found'}, HTTP_NOT_FOUND
        
        return _set.to_dict(), HTTP_SUCCESS
    elif request.method == 'POST':
        pass
    elif request.method == 'DELETE':
        pass

@app.route('/flashcards', methods=['POST'])
def create_flashcard():
    if request.method == 'POST':
        req_values = request.get_json()
        term = req_values.get('definition')
        definition = req_values.get('term')
        set_id = req_values.get('set_id')
        
        if not term or not definition:
            return jsonify({'error': 'please include the definition and term in your request.'}), HTTP_BAD_REQUEST

        try:
            new_flashcard = Flashcard(
                term=term,
                definition=definition,
                set_id=set_id
            )
            db.session.add(new_flashcard)
            db.session.commit()

            return new_flashcard.to_dict(), HTTP_CREATED

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'An error occurred: {str(e)}'}), HTTP_SERVER_ERROR

@app.route('/flashcards/<int:id>', methods=['DELETE', 'PATCH'])
def modify_flashcards(id):

    if request.method == 'PATCH':
        req_values = request.get_json()

        flashcard = Flashcard.query.filter_by(id=id).first()

        if not flashcard:
            return { 'error': 'Flashcard not found' }, HTTP_NOT_FOUND

        flashcard.definition = req_values.get('definition')
        flashcard.term = req_values.get('term')

        # Commit the changes
        try:
            flashcard_data = {
                'id': flashcard.id,
                'question': flashcard.term,
                'answer': flashcard.definition,
                'set_id': flashcard.set_id
            }
            db.session.add(flashcard_data)
            db.session.commit()
            return jsonify(flashcard_data), HTTP_SUCCESS
        except Exception as e:
            db.session.rollback()
            return jsonify({ 'error': f'An error occurred: {str(e)}' }), HTTP_SERVER_ERROR


    if request.method == 'DELETE':
        flashcard = Flashcard.query.filter_by(id=id).first()

        # Check if the flashcard exists
        if flashcard is None:
            return {'error': 'Flashcard not found'}, HTTP_NOT_FOUND

        try:
            # Delete the flashcard
            db.session.delete(flashcard)
            # Commit the changes to the database
            db.session.commit()

            return {'message': 'Flashcard deleted successfully'}, HTTP_NO_CONTENT

        except Exception as e:
            # Rollback in case of an exception
            db.session.rollback()
            # Return an error response
            return {'error': f'An error occurred: {str(e)}'}, HTTP_SERVER_ERROR

@app.route('/sets', methods=['GET', 'POST'])
def sets():

    if request.method == 'GET':
        sets = Set.query.all()

        if sets:
            serialized_first_set = sets[0].to_dict()
            serialized_sets = [_set.to_serializable() for _set in sets[1:]]

            serialized_sets = [serialized_first_set] + serialized_sets
        else:
            serialized_sets = []
            
        return jsonify(serialized_sets), HTTP_SUCCESS

    elif request.method == 'POST':
        req_values = request.get_json()

        try:
            new_set = Set(
                name = req_values.get('name')
            )
            db.session.add(new_set)
            db.session.commit(new_set)

            return jsonify(new_set.to_dict()), HTTP_CREATED
            
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), HTTP_UNPROCESSABLE_ENTITY

@app.route('/sets/<int:id>', methods=['GET', 'PATCH'])
def get_set(id):
    if request.method == 'GET':
        _set = Set.query.filter_by(id=id).first()

        if not _set:
            return { 'error': 'set not found' }, HTTP_NOT_FOUND

        return _set.to_dict(), HTTP_SUCCESS

    elif request.method == 'PATCH':
        req_values = request.get_json()

        _set = Set.query.filter_by(id=id).first()

        if not _set:
            return jsonify({'error': 'set not found'}), HTTP_NOT_FOUND

        _set.name = req_values.get('name')

        try:
            db.session.commit()

            return jsonify(_set.to_dict()), HTTP_SUCCESS

        except Exception as e:
            return jsonify({'error': f'something went wrong editing this set: {str(e)}'}), HTTP_UNPROCESSABLE_ENTITY

if __name__ == '__main__':
    app.run(port=5555, debug=True)
