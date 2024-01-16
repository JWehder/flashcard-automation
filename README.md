# flashcard-automation

## Description

I created this app with the intention of replacing the app Quizlet as well as implementing features like data scraping, mass data upload, and AI to build flashcards automatically for me. For example, I have used data scraping to pull software engineering interview questions off websites, send these questions to Google's old Bard AI API to answer said questions, and then create flashcards with these two points. All it required was a simple script. During the development of this project, however, Quizlet implemented these features into their site along with other AI powered features.

Although Bard is no longer available, it is very easy to use either Google's AI assistant or ChatGPT to create flashcards in JSON format, copy and paste the data into the backend of the app, and run a script to automatically transmit that data into the app with flashcards.

If you would simply like to use the app to create flashcards yourself, you can easily do so similarly to how you would in Quizlet. There is a blank term and definition card beneath all of the cards fetched from the database. There, you can create, edit, and delete flashcards. You can also save flashcards by clicking the star button on each flashcard.

## Setup

Start by **cloning** (not forking) the project template repository and removing
the remote:

```console
$ git clone https://github.com/JWehder/phase-4-project.git
$ cd phase-4-project
```

In order to get started with the backend you must download all of the Python packages that I have installed. From the command line, run pipenv install. Then, run pipenv run to enter into the python environment.

After you've installed the dependencies, run the following

export FLASK_APP=app.py
export DATABASE_URL=sqlite:///yourdatabase.db

flask db init

flask db migrate -m 'Initial migration'

flask db upgrade

## Requirements

- Python 3.8.13
- NodeJS (v16), and npm
- SQLite

## Usage

