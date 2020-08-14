"use strict"

///////////////////////////////////////////////////////////
// Simple Javascript Search Engine
//
// This rather simple search engine allows for inexact
// keyword search in a body of plain text documents.
//


let createSearchEngine = function() {
let module = {};


// Configuration of the search engine module.
module.config = {
		"maxreldist":    0.3,   // maximal relative distance between search key and word
		"minwordlength": 2,     // minimal word length
	};


// The two following variables represents the full state of the search
// engine. They can be serialized to JSON in order to preserve the state,
// i.e., to load a data base at startup.

// dictionary of document IDs mapped to number of words in the document
module.doclength = {};

// dictionary of words mapped to word counts and number of documents using the word
module.dictionary = {};


// Tokenize an input string into words, discard white space and rubbish.
module.tokenize = function(s)
{
	let words = s.toLowerCase().match(/[a-z0-9äöüß-]+\w+/g);
	let ret = [];
	for (let i=0; i<words.length; i++)
	{
		let w = words[i];
		if (w.length < module.config.minwordlength) continue;
		ret.push(w);
	}
	return ret;
}

// Compute an asymmetric variant of the Levenshtein distance between
// a word and a search key. The value is computed with the
// Wagner-Fischer algorithm, but deletions from the word are counted
// only as 1/2.
function distance(word, key)
{
	let prev = [];
	for (let i=0; i<=word.length; i++) prev.push(i);

	for (let j=1; j<=key.length; j++)
	{
		let dist = [j];
		for (let i=1; i<=word.length; i++)
		{
			dist.push(Math.min(Math.min(
					prev[i-1] + ((word[i-1] == key[j-1]) ? 0 : 1),
					prev[i] + 1),
					dist[i-1] + 0.5));
		}
		prev = dist;
	}

	return prev.pop();
}

// Compute a score of a match between a keyword and a search term
// based on the length of the word, the Levenshtein distance, the number
// of occurrences of the word in a document, and the number of documents
// in which the keyword occurs.
function score(length, distance, count, docs)
{
	let relevance = Math.min(1.0, 1.0 / (docs + 3)) * length / (length + 8 * distance);
	return count * relevance * relevance;
}


// Reset the search engine, i.e., make it forget all calls to "add".
module.clear = function()
{
	module.doclength = {};
	module.dictionary = {};
}

// Add a new document with given content to the data base. The document
// is identified by a string ID, which is returned in search results.
// Adding the same document ID twice results in an error.
module.add = function(id, content)
{
	if (module.doclength.hasOwnProperty(id)) throw "[searchengine] document ID is already in use";
	let tokens = module.tokenize(content);
	module.doclength[id] = tokens.length;
	for (let i=0; i<tokens.length; i++)
	{
		let t = tokens[i];
		if (! module.dictionary.hasOwnProperty(t)) module.dictionary[t] = {"docs": {}, "numdocs": 0};
		let worddata = module.dictionary[t];
		if (! worddata.docs.hasOwnProperty(id))
		{
			worddata.numdocs++;
			worddata.docs[id] = 0;
		}
		worddata.docs[id]++;
	}
}

// Search the documents. The function returns an array of at most n
// result objects with fields id, score, and matches.
module.find = function(keys, n = 10)
{
	if (typeof keys == "string") keys = module.tokenize(keys);
	if (keys.length == 0) return [];

	// compute a document score based on fuzzy matches of keywords
	let resultdict = {};
	for (let i=0; i<keys.length; i++)
	{
		let key = keys[i];
		for (let word in module.dictionary)
		{
			if (! module.dictionary.hasOwnProperty(word)) continue;
			let threshold = Math.floor(module.config.maxreldist * word.length);
			let dist = distance(word, key);
			if (dist > threshold) continue;
			let worddata = module.dictionary[word];
			let num = worddata.numdocs;
			for (let id in worddata.docs)
			{
				if (! worddata.docs.hasOwnProperty(id)) continue;
				if (! resultdict.hasOwnProperty(id)) resultdict[id] = {"id": id, "score": 0.0, "matches": {}};
				let s = score(word.length, dist, worddata.docs[id], num);
				resultdict[id].score += s
				if (! resultdict[id].matches.hasOwnProperty(word)) resultdict[id].matches[word] = 0.0;
				resultdict[id].matches[word] += s;
			}
		}
	}

	// compile a results array
	let resultarray = [];
	for (let id in resultdict)
	{
		if (! resultdict.hasOwnProperty(id)) continue;
		let result = resultdict[id];
		result.score = Math.log(result.score) / Math.log(module.doclength[id]);
		resultarray.push(result);
	}

	// return the best n results
	resultarray.sort(function(lhs, rhs){ return rhs.score - lhs.score; });   // higher score is better
	return resultarray.slice(0, n);
}


return module;
};

let searchengine = createSearchEngine();   // default instance
