# Full Stack Web Developer Challenge

## Instructions

**Setup**

- Clone this repository

**Backend**

- start the app by running './bootstrap.sh' in the root directory (search-engine-flask)
- the app will be running on localhost:5000

**Frontend**

- start the app by running 'npm start' in the root directory (search-engine-react)

## Sources

- [ChatGPT](https://chat.openai.com/) used for ideas using Word2Vec, and developing some of the code for the search engine.
- [PSPDFKit](https://pspdfkit.com/) I found the version of this book in pdf format online, and used this SDK to display it similar to the one from the example. There is a watermark but it could be removed if purchased.
- [Stack Overflow](https://stackoverflow.com/) Searched various answers for some bugs I encountered, in particular helped me understand some of the reasons that my Word2Vek pretrained libraries were not working. (It was because my version of gensim was too new, and the pretrained models were too old)
- [Spacy](https://spacy.io/) Used for the tokenizer.
- [Flask](https://flask.palletsprojects.com/en/1.1.x/) Used for the web server.
- Methods tried to get similar words: Gensim, Spacy, ChatGPT, Scipy, Word2Vek, SKlearn and others.
