from flask import request, session, jsonify, send_file, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
import traceback
from functools import wraps
from config import app, db, api
from models import Set
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

@app.route('/sets/<int:set_id>')
def get_set_by_id(set_id):
    # retrieve the terms by the particular set that was selected
    _set = Set.query.filter_by(id=set_id).first()
    if _set is None:
        return {'error': 'set not found'}, HTTP_NOT_FOUND
    
    return _set.to_dict(), HTTP_SUCCESS

@app.route('/default_set')
def get_default_set():
    default_set = Set.query.first()
    if default_set is None:
        return {'error': 'no sets have been created yet'}, HTTP_NOT_FOUND

    return default_set.to_dict(), HTTP_SUCCESS

@app.route('/sets')
def get_all_sets():
    sets = Set.query.all()
    sets_list = list()

    for _set in sets:
        sets_list.append(_set.name)

    return jsonify(sets_list), HTTP_SUCCESS

if __name__ == '__main__':
    app.run(port=5555, debug=True)
