# TF-IDF Document Search

TF-IDF Document Search is a Node.js library for information retrieval and keyword search. The implementation allows one to instantiate a corpus of documents and compute their similarity relative to an input query and/or document. Using this measure of similar one can compute which document in their corpus is most relevant to a particular query and/or input document.

## Background

The library is based on the vector space model wherein each document is tokenized into a vector who's indices correspond to a unique term in an input query/document. Subsequently, we caclulate the TF-IDF for each term ![formula](https://render.githubusercontent.com/render/math?math=t) in the document vector, where TF-IDF is defined to be:

![formula](https://render.githubusercontent.com/render/math?math=TF\-IDF(t,d)=TF(t,d)%20\cdot%20IDF(t)$)

![formula](https://render.githubusercontent.com/render/math?math=TF(t,d)=$) frequency of term ![formula](https://render.githubusercontent.com/render/math?math=t$) in document ![formula](https://render.githubusercontent.com/render/math?math=d$)

![formula](https://render.githubusercontent.com/render/math?math=IDF(t)=log(\frac{n}{f_t})$),  where ![formula](https://render.githubusercontent.com/render/math?math=n$) is the humber of documents in the corpus and ![formula](https://render.githubusercontent.com/render/math?math=f_t$) is the number of documents in which term ![formula](https://render.githubusercontent.com/render/math?math=t$) appears

Once we define TF-IDF vectors ![formula](https://render.githubusercontent.com/render/math?math=v_1,v_2,v_3...,v_n$) for each of the documents in our corpus, we calculate their similarity to a query vector ![formula](https://render.githubusercontent.com/render/math?math=q_1) to be:

![formula](https://render.githubusercontent.com/render/math?math=Similarity=\LARGE%20\frac{v_i%20\cdot%20q_1}{|v_i|%20\cdot%20|q_1|}$)

Ranking the similarity measure for each document, one can determine which is the most relevant to a given query:)


## Installation


```bash
npm install tf-idf-search
```

## Usage
In order to begin using the package please instantiate a TF-IDF object and load your documents. Loading documents can either be done by passing a String array or an array of paths to the respective files:

``` js script
TfIdf = require('tf-idf-search');
tf_idf = new TfIdf()

//initialize corpus from an array of file paths, returns the current state of the corpus
var corpus = tf_idf.createCorpusFromPathArray(["./doc1.txt", "./doc2.txt", "doc3.txt"]);

//initialize corpus from an array of Strings, returns the current state of the corpus
var corpus = tf_idf.createCorpusFromStringArray(
["This is the content of doc1",
"This is the content of doc2",
"This is the content of doc3"]
);

//add document to the corpus by string , returns the current state of the corpus
var corpus = tf_idf.addDocumentFromString("String containing doucment contents");

//add document to the corpus by file path, returns the current state of the corpus
var corpus = tf_idf.addDocumentFromPath("./doc2.txt");
```

After instantiating a corpus and loading your documents you can calculate the tf-idf vectors, deterimine cosine similarity and rank the relavance of documents based on queries:

``` js script
//Rank documents relative to a query containing a String of keywords
var search_result = tf_idf.rankDocumentsByQuery("javascript npm keyword search")
```
This will output an array of objects, which contain the relevent search results in order of most relevant to least relevant. The index property corresponds to the documents position in the corpus:

```
[
    {
      document: ['this', 'is', 'content', 'of, 'document', '1'],
      similarityIndex: 0.534,
      index: 0,
    },
    {
      document: ['this', 'is', 'content', 'of, 'document', '2'],
      similarityIndex: 0.102,
      index: 1,
    },
    {
      document: ['this', 'is', 'content', 'of, 'document', '3'],
      similarityIndex: 0.003,
      index: 2,
    },
]
```

If you wish to see the mapping between the returned indicees and the original input format of your document, you can use the
indicesOfInputs() function as follows:

``` js script
/*
* Find mapping between indices and original inputs
* returns an array of objects
*/
var indices = tf_idf.indicesOfInputs()
```

This function returns an array outlining the mapping of every document in the corpus as follows:
```
[
    {
      index: 0,
      document: '\test1.txt',

    },
    {
      index: 1,
      document: '\test2.text',
    },
    {
      index: 2,
      document: "document added as a string format",
    },
]
```


In addition to the above operation, you can also compute individual aspects of the tf-idf model as follows:

``` js script
// Create the idf vector for an input query
var vector = tf_idf.createIdfModel('Romeo Juliet playwrite');   // [1.2341, 0.124, 1.531]

// Create tf-idf vector for a document given input query
var vector = tf_idf.createVectorSpaceModel('Romeo Juliet playwrite', tf_idf.corpus[0]); // [0.257, 1.245, 0.1]

// Calculate similarity index between a document and a given input query
var similarity = tf_idf.calculateSimilarityIndex('Romeo Juliet playwrite', tf_idf.corpus[0]);  // 0.3421
```

## Contributing
Pull requests are welcome. If you wish to contribute feel free to fork the repo :).

## License
[MIT](https://choosealicense.com/licenses/mit/)
