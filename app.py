from bs4 import BeautifulSoup
import requests

headers = {'user-agent': 'flashcard-automation/0.0.1'}

html = requests.get('https://www.interviewbit.com/python-interview-questions/', headers=headers)

doc = BeautifulSoup(html.text, 'html.parser')

x = 0
for _ in range(4):
    data = doc.select('.ibpage-article-header')[x].select('h3')[0]
    parsed_data = data.contents[0]
    
    x+=1
