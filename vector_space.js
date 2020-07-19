/*
* @author spapazov
* Date: 28/7/2019
* License: MIT
* This is a factory for calculating the tf-idf for a text/document
* To be used for the purpose of ranking search results
* Rankings are based upon the classical version of the Vector Space Model
* href = https://en.wikipedia.org/wiki/Vector_space_model
*/

var fs = require('fs');

class TfIdf {

  constructor() {}

/*
* Breaks a string into an array of words (aka document)
*/
  createDocumentFromString(str) {
    str = str.replace('\\n'," ");
    return str.split(" ");
  }


/*
* Creates a corpus from an array of docs
*/
  createCorpusFromStringArray(docs) {
    let corpus = [];
    for(let i = 0; i < docs.length; i++) {
      corpus.push(
        docs[i]
        .replace('\\n',"")
        .split(" ")
      );
    }
    this.corpus = corpus;
    return corpus;
  }

/*
* Creates a corpus from an array of file paths
*/

  createCorpusFromPathArray(docs) {
    let corpus = []
    for(let i = 0; i < docs.length; i++) {
      try {
        let data = fs.readFileSync(docs[i], {encoding: 'utf8'});
        data = data.replace(/[\r\n]/g," ")
        data = data.trim();
        corpus.push(data.split(" "));
      } catch (err) {
        throw err
      }
    }
    this.corpus = corpus;
    return corpus
  }

/*
* Calculates the term frequency (tf) of a given term in a document
* Term frequency is computed as:
* number of ocurrences of the term /length of document;
*/
  calculateTermFrequency(term, doc) {

    let numOccurences = 0;
    for (let i = 0; i < doc.length; i++){
      if (doc[i].toLowerCase() == term.toLowerCase()){
        numOccurences++;
      }
    }
    return (numOccurences * 1.0 / (doc.length + 1))
  }

  /*
  * Calculates the inverse document frequency (idf) of a term in a given document
  * idf = log(number of documents where the term appears / term frequency)
  */

  calculateInverseDocumentFrequency(term) {
    if (this.corpus == null) return -1;
    let numDocs = 0;
    for (let i = 0; i< corpus.length; i++){
      for (let j = 0; j < corpus[i].length; j++) {
        if (corpus[i][j] == term.toLowerCase()){
          numDocs++;
          break;
        }
      }
    }
    return Math.log((this.corpus.length) / (numDocs + 1)) + 1;
  }

  /*
  * Creates a vector of the idf of the query term in a given document
  */

  createIdfModel(query) {
    if (this.corpus == null) return null;
    let model = [];
    for(let i = 0; i < query.length; i++){
      model.push(this.calculateInverseDocumentFrequency(query[i]));
    }
    return model;
  }

  /*
  * creates a vector of the tf-idf values for each query term
  * tf-idf = tf * idf
  */

  createVectorSpaceModel(query, doc) {
    if (this.corpus == null) return null;
    let termFrequencyModel = [];
    let vectorSpaceModel = []
    for (let i = 0; i < query.length; i++){
      termFrequencyModel.push(this.calculateTermFrequency(query[i], doc));
    }
    let idfModel = this.createIdfModel(query);
    for (let j = 0; j < idfModel.length; j++){
      vectorSpaceModel[j] = idfModel[j] * termFrequencyModel[j];
    }
    this.vectorSpaceModel = vectorSpaceModel;
    return vectorSpaceModel
  }

  /*
  * calculates the cosine similarity between two vectors computed as thier dot
  * product. The higher the cosine similarity of a given document the closer of
  * a match it is to the query.
  */
  calculateSimilarityIndex(query, doc){
    let query_vector = this.createVectorSpaceModel(query, query);
    let doc_vector = this.createVectorSpaceModel(query, doc);
    let similarityIndex = 0;
    for (let i = 0; i < query.length; i++){
      let toAdd = query_vector[i] * doc_vector[i];
      if (isNaN(toAdd)) {
        similarityIndex += 0;
      } else {
        similarityIndex += toAdd;
      }
    }
    let query_mag = this.calculateMagnitude(query_vector);
    let doc_mag = this.calculateMagnitude(doc_vector);
    let similarity = 1.0 * similarityIndex / (query_mag * doc_mag);
    return isNaN(similarity) ? 0 : similarity
  }


  /*
  * Ranks the documents in your corpus according to a query
  */
  rankDocumentsByQuery(query){
    query = query.split(" ");
    let ranking = [];
    for(let i = 0; i < this.corpus.length; i++) {
      ranking.push({
        document: this.corpus[i],
        similarityIndex: this.calculateSimilarityIndex(query, this.corpus[i]),
        });
    }
    ranking.sort((a, b) => {
      return b.similarityIndex - a.similarityIndex;
    })
    return ranking;
  }


/*
* Calculates the magnitude of an input vector
*/
  calculateMagnitude(vector) {
    let magnitude = 0
    for (let i = 0; i < vector.length; i++){
      if (isNaN(vector[i])) {
        magnitude += 0;
      } else {
        magnitude += vector[i] * vector[i];
      }
    }
    return Math.sqrt(magnitude);
  }

}

module.exports = TfIdf
