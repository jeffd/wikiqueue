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


chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var qItem = request;
    if (!qItem.visited) {
      // Add it to the list UI
      var resultingIndex = addItemToList(qItem);
      chrome.extension.sendRequest(qItem, function(response) {
      // TODO: find out if it succeded
        sendResponse({success: true});
     });
    }
    else {
      sendResponse({}); // snub them
    }
  });

/***
* function: addItemToList
* return: The new item's index
*
* Adds an item to the list in the popup UI
***/
function addItemToList(newQueryItem) {
  if (newQueryItem.state === "unsorted" || newQueryItem.state === "showing"){
    var aResult = $(document.createElement("li"));
    var aLink = $(document.createElement("a")).attr("href", "").html(newQueryItem.title);
    aResult.append(aLink);

    // Bind the click handler
    aResult.mouseup(function(){
      openQueuedItem(newQueryItem);
    });
    $("#queuelist").append(aResult);

    // Change its state and update the db
    newQueryItem.state = "showing";
    utils.setItem(newQueryItem.url, newQueryItem);
    // return some index
  }

  return 0;
}

/***
* function: openQueuedItem
*
* Creates a new tab in the current window
* with the query item that is passed to it
***/
function openQueuedItem(queryItem) {
  var createProperties = {};
  createProperties.url = queryItem.url;
//  createProperties.index = queryItem.tabId + 1;

  chrome.tabs.create(createProperties, function(window) {
    //TODO: Call for the item to be removed from the queue.
    // Change its state and update the db
    queryItem.state = "visited";
    utils.setItem(queryItem.url, queryItem);
  });
  window.close();
}

/***
* function: getAllShowingItems
* return: sorted array of all showing elements
*
* Go through the DB and find all showing elements
***/
function getAllShowingItems() {

  var showingItems = new Array();
  var dbLen = utils.length() - 1;

  while(dbLen >= 0) {
    var item = utils.getItem(utils.key(dbLen));
    addItemToList(item);
    dbLen--;
  }

 return showingItems;
}

$(document).ready(function() {
   //getAllShowingItems();
 });