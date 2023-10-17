from bs4 import BeautifulSoup
import requests
import google.generativeai as palm
import os

palm.configure(api_key=os.getenv('PALM_API_KEY'))

headers = {'user-agent': 'flashcard-automation/0.0.1'}

html = requests.get('https://www.interviewbit.com/python-interview-questions/', headers=headers)

doc = BeautifulSoup(html.text, 'html.parser')
questions = doc.select('.ibpage-article-header')

flashcards = []

for val in questions:
    data = val.select('h3')[0]
    question = data.contents[0]
    response = palm.generate_text(prompt=f"Can you comprehensively answer this question about Python. Please answer it with less than 150 words. Please include before your answer: {question}")
    flashcards.append((question))
