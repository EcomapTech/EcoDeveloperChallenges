# Full Stack Web Developer Challenge

Welcome to my take on the Full Stack Web Developer Challenge! This project showcases my skills as a full-stack developer through a search engine application. Below, you'll find instructions on how to set up both the backend RESTful API and the frontend React app, along with other relevant project details.

This app can allow users to search words from the corpus of text, create new words, update existing words, and delete words.

## Instructions

Follow the steps below to set up and run both the backend and frontend components of the search engine application.

## Getting Started

Begin by cloning this repository and navigating into the project directory:

```
git clone https://github.com/Duncan-Wood/FullStackDeveloperChallenge.git
cd FullStackDeveloperChallenge
```

### Backend RESTful API for Search Engine

**Prerequisites**
Before you begin, make sure you have Python3 installed on your system.

**Create the Virtual Environment**
Navigate to the backend directory and set up a virtual environment:

```
cd Backend
python3 -m venv search-engine-venv
source search-engine-venv/bin/activate  # On macOS and Linux
# For Windows Command Prompt:
# search-engine-venv\Scripts\activate
# For Windows PowerShell:
# search-engine-venv\Scripts\Activate.ps1
```

**Install the dependencies**
Install the required dependencies for the backend API:

```
pip install -r requirements.txt
python -m spacy download en_core_web_md
```

**Run the API**
Navigate to the search engine Flask app and run the API:

```
cd search-engine-flask
./bootstrap.sh
```

_The bootstrap.sh script prepares the environment and executes the Flask application, making it accessible on all network interfaces._

**Open the API in browser**

Access the API's home page in your browser by visiting the [API Home Page](http://localhost:5000/)

_The home page provides direct links to various API endpoints, making it easy for users to explore and understand the functionalities offered by the API._

## Frontend React App for Search Engine

**Prerequisites**
Before you start, ensure that you have Node.js installed on your system.

**Navigate to the Frontend folder**
Open a separate terminal window and navigate to the frontend app's directory:

```
cd Frontend/search-engine-app
```

**Install Dependencies using NPM**
Install the necessary dependencies for the frontend app:

```
npm install
```

**Run the App**
Start the development server to run the frontend app:

```
npm start
```

This will automatically open the app in your default web browser. Alternatively, you can access the app at [here](http://localhost:3000)

## Technologies Used

**Frontend**

- React: A JavaScript library for building user interfaces.
- axios: A promise-based HTTP client for making requests to the backend.
- pspdfkit: Used for displaying PDF documents.

**Backend**

- Flask: A lightweight web framework for building APIs.
- Flask-Cors: Enables Cross-Origin Resource Sharing (CORS) support in Flask applications.
- Spacy: Industrial-strength natural language processing in Python.
- NumPy: A fundamental package for scientific computing with Python.
- en_core_web_md: A pre-trained English model essential for enabling accurate natural language processing functionalities within the application.

## Known Issues

- after much trial and error using technologies like Gensim, Word2Vec, Spacy, and others, I struggled to create a function that accurately produces similar words to a given word. I was able to create a function that returns similar words, but the results are not very accurate. I would like to continue working on this function to improve its accuracy.

## Sources

- [ChatGPT](https://chat.openai.com/)
- [PSPDFKit](https://pspdfkit.com/) (watermark can be removed with purchase)
- [Stack Overflow](https://stackoverflow.com/)
- [Spacy](https://spacy.io/)
- [en-core-web-md](https://spacy.io/models/en)
- [Flask](https://flask.palletsprojects.com/en/1.1.x/)
- [NumPy](https://numpy.org/)
