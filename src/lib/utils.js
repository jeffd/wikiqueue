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

/***
* function: setItem
*
* Adds an item to the local DB
*
* ! NOTICE !
* It assumes that it is an object passed to it
* and will convert it to a string
***/
utils.setItem = function(key, value) {
  try {
    // Convert the object to a string
    var qItemString = JSON.stringify(value);
    utils.log("Inside setItem:" + key + ":" + value);
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, qItemString);
  }catch(e) {
    utils.log("Error inside setItem");
    utils.log(e);
  }
  utils.log("Return from setItem" + key + ":" +  value);
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
  window.localStorage.clear();
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
