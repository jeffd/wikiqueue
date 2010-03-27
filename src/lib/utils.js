/* ***** BEGIN LICENSE BLOCK *****
 * Version: MIT
 *
 * Copyright (c) 2010 Jeff Dlouhy
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *  Jeff Dlouhy <jeff.dlouhy@gmail.com>
 *
 * ***** END LICENSE BLOCK ***** */

var utils = {};

utils.logging = true;

utils.DATABASE_NAME = "wikiqueue";
utils.DATABASE_VERSON = "1.0";
utils.ARTICLE_TABLENAME = "articles";

utils.QUERY = {};
utils.QUERY.URL = "url";
utils.QUERY.TITLE = "title";
utils.QUERY.CREATED = "created";
utils.QUERY.BASEURI = "baseuri";
utils.QUERY.TABID = "tabid";
utils.QUERY.VISITED = "visited";

//
// Adapted from http://github.com/remy/html5demos/blob/master/js/tweets.js
//
utils.initDB = function() {
  try {
    if (window.openDatabase) {
      utils.db = openDatabase(utils.DATABASE_NAME, utils.DATABASE_VERSON, "Wikiqueue Extension Database", 200000);
      if (utils.db) {
          utils.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS articles (url TEXT UNIQUE, title TEXT, created INTEGER, baseuri TEXT, tabid INTEGER, visited BOOLEAN)", []);
        });
      } else {
        utils.log("error occurred trying to open DB");
      }
    } else {
      utils.log("Web Databases not supported");
    }
  } catch (e) {
    utils.log("error occurred during DB init, Web Database supported?");
  }
};

/***
* function: setItem
*
* Adds an item to the local DB
***/
utils.addItem = function(queueItem) {
  try {
      utils.db.transaction(function (tx) {
                     tx.executeSql("INSERT INTO articles (url, title, created, baseuri, tabid, visited) values (?, ?, ?, ?, ?, ?)",
                                   [queueItem.url, queueItem.title, queueItem.created, queueItem.baseuri, queueItem.tabid, queueItem.visited]);
                   });
  }catch(e) {
    utils.log("Error inside setItem");
    utils.log(e);
  }
};

/***
* function: getItem
*
* Returns an item to the local DB
* based on the key passed to it
***/
utils.getItem = function(key) {
  var value;
  utils.log('Get Item:' + key);
  try {
    value = window.localStorage.getItem(key);
    var strToJSON = JSON.parse(value);
    value = strToJSON;
  }catch(e) {
    utils.log("Error inside getItem() for key:" + key);
    utils.log(e);
    value = "null";
  }
  utils.log("Returning value: " + value);
  return value;
};

/***
* function: clearStorage
*
* Deletes all the entries in the local DB
***/
utils.clearStorage = function() {
  utils.log('about to clear local storage');
  utils.db.transaction(function (tx) {
     tx.executeSql('DROP TABLE IF EXISTS ?', [utils.ARTICLE_TABLENAME]);
  });
  utils.log('cleared');
};

/***
* function: key
*
* Returns a key at the nth position
***/
utils.key = function(index) {
  var value;
  utils.log('Get Item:' + index);
  try {
    value = window.localStorage.key(index);
  }catch(e) {
    utils.log("Error inside key() for index:" + index);
    utils.log(e);
    value = "null";
  }
  utils.log("Returning value: " + value);
  return value;
};

/***
* function: length
*
* Returns the length of the DB
***/
utils.length = function() {
  var value;
  utils.log('Get length');
  try {
    value = window.localStorage.length;
  }catch(e) {
    utils.log("Error inside length attribute");
    utils.log(e);
    value = "null";
  }
  utils.log("Returning value: " + value);
  return value;
};

utils.log = function(txt) {
  if(utils.logging) {
    console.log(txt);
  }
};
