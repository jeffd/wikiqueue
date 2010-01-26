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

//
// Sample HTML5 storage code taken from:
// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm
//

var logging  = true;

console.log('call first time only');

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
    else
      sendResponse({}); // snub them.
});


function setItem(key, value) {
  try {
    log("Inside setItem:" + key + ":" + value);
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e) {
    log("Error inside setItem");
    log(e);
  }
  log("Return from setItem" + key + ":" +  value);
}

function getItem(key) {
  var value;
  log('Get Item:' + key);
  try {
    value = window.localStorage.getItem(key);
  }catch(e) {
    log("Error inside getItem() for key:" + key);
    log(e);
    value = "null";
  }
  log("Returning value: " + value);
  return value;
}

function clearStrg() {
  log('about to clear local storage');
  window.localStorage.clear();
  log('cleared');
}

function log(txt) {
  if(logging) {
    console.log(txt);
  }
}