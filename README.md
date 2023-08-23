# Full Stack Web Developer Challenge

## Instructions

## Getting Started

- Clone this repository
  ```
  git clone https://github.com/Duncan-Wood/FullStackDeveloperChallenge.git
    cd FullStackDeveloperChallenge
  ```

### Backend RESTful API for Search Engine

**Prerequisites**
Before running the API, ensure you have the following installed:

Python 3.x

**Create the Virtual Environment**

```
cd Backend
python -m venv search-engine-venv
source search-engine-venv/bin/activate  # On macOS and Linux
# For Windows Command Prompt:
# search-engine-venv\Scripts\activate
# For Windows PowerShell:
# search-engine-venv\Scripts\Activate.ps1
```

**_ Install the dependencies _**

```
pip install -r requirements.txt
python -m spacy download en_core_web_md
```

**_ Run the API _**

```
cd search-engine-flask
./bootstrap.sh
```

**_ Open the API in browser_**

[API Home Page](http://localhost:5000/)

**Frontend**

- start the app by running 'npm start' in the root directory (search-engine-react)

## Sources

- [ChatGPT](https://chat.openai.com/) used for ideas using Word2Vec, and developing some of the code for the search engine.
- [PSPDFKit](https://pspdfkit.com/) I found the version of this book in pdf format online, and used this SDK to display it similar to the one from the example. There is a watermark but it could be removed if purchased.
- [Stack Overflow](https://stackoverflow.com/) Searched various answers for some bugs I encountered, in particular helped me understand some of the reasons that my Word2Vek pretrained libraries were not working. (It was because my version of gensim was too new, and the pretrained models were too old)
- [Spacy](https://spacy.io/) Used for the tokenizer.
- [Flask](https://flask.palletsprojects.com/en/1.1.x/) Used for the web server.
- Methods tried to get similar words: Gensim, Spacy, ChatGPT, Scipy, Word2Vek, SKlearn and others.

```

```
