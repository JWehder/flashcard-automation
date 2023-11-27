from bs4 import BeautifulSoup
import requests
import google.generativeai as palm
import os
from models import Flashcard, Set 
from config import db, app

palm.configure(api_key=os.getenv('PALM_API_KEY'))

headers = {'user-agent': 'flashcard-automation/0.0.1'}

html = requests.get('https://www.interviewbit.com/python-interview-questions/', headers=headers)

doc = BeautifulSoup(html.text, 'html.parser')
questions = doc.select('.ibpage-article-header')

set_name = "test_set"

test_set = Set(
    name=set_name
)
with app.app_context():
    db.session.add(test_set)
    db.session.commit()

    set_id = test_set.id

x=0

# want to iterate through the first four values

for _ in range(4):
    # data = val.select('h3')[0]
    data = questions[x].select('h3')[0]
    question = data.contents[0]
    response = palm.generate_text(prompt=f"Can you comprehensively answer this question about Python. Please answer it with less than 150 words. The question: {question}")
    flashcard = Flashcard(
        term=str(question),
        definition=str(response.result),
        set_id=test_set.id
    )
    with app.app_context():
        db.session.add(flashcard)
    x+=1

with app.app_context():
    db.session.commit()

