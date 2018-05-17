# Word Cloud by Stefan Axelsson

This web application lists the most commonly used words from a RSS Feed. It does this by:

* Parsing the items in a RSS feed
* Using language detection for each item if language is not defined
* Removing stop words based on the language

## Requirements

To run this project you will need the following:

* Node 8
* Npm 6
* Latest Chrome/Firefox

## Installation

Either clone or download this repository.
Open the directory in your terminal and run the following commands:

1.  Install dependencies

```
npm install
```

2.  Start server

```
npm run-script start
```

3.  Open browser

Point your browser to http://localhost:3000
