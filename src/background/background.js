/* -*- Mode: js2-mode; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: sw=2 ts=2 et :*/
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

// Start the magic!
utils.initDB();

var WIKIQUEUE = {};

/***
* event: addListener
*
* Waits for events and if
***/
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.hasOwnProperty("visited")) {
      var qItem = request;

      // Get its tabid
      //qItem.tabid = WIKIQUEUE.getCurrentTabID();

      // Add it to the DB
      var addResults = utils.addItem(qItem);

      // Tell the sender the results, either true or false
      sendResponse({success: addResults});
    } else if (request.hasOwnProperty("query")) {
      var resp = {};
      var rQuery = request.query;

      utils.getItemsFromQuery(rQuery, function(items) {
        resp.query = rQuery;
        resp.results = JSON.stringify(items);

        // Now the response
        sendResponse(resp);
     });
    }
    else {
      sendResponse({}); // snub them
    }
});


WIKIQUEUE.getCurrentTabID = function() {
  var tID;
  chrome.windows.getCurrent(function(curWin) {
    chrome.tabs.getSelected(curWin.id, function(tab) {
     tID =  tab.id;
    });
  });

  return tID;
};


Array.prototype.copy =
  function() {
    return [].concat(this);
  };