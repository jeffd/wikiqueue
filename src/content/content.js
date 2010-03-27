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

console.log("We be on Wikipedia");
var spinnerImg = chrome.extension.getURL("content/progress-full.png");
var spinnerImgR = chrome.extension.getURL("content/spinner-right.png");
var spinnerImgL = chrome.extension.getURL("content/spinner-left.png");
var spinnerImgLR = chrome.extension.getURL("content/spinner-lr.png");
var wikiLinks = $("a[href^=/wiki]").not("a.internal");

var OVERRIDEBEHAVIOR = "overrideBehavior";
var SPINIMATION = "spinimation";
var SPINNERIMAGES = [];

function spinnerImageURL(num) {
  return "url("+chrome.extension.getURL("content/progress-" + num +".png")+")";
}

// function preloadImages() {
//   for (var i=0; i < 15; i++) {
//     var img = new Image();
//     img.src = spinnerImageURL(i);
//     SPINNERIMAGES[i] = img.src;
//   }
// }

var spinner = $(document.createElement("p")).attr("id", "spinner");

wikiLinks.each(function(i) {
  var qItem = {};
  qItem.url = getBaseURL() + $(this).attr('href');
  qItem.title = $(this).attr('innerText');
  qItem.baseuri = $(this).attr('baseURI');
  qItem.visited = false;

  // Get the current tab's index
  // Later we can use this to optionally add it
  // behind the originating tab for context
  // TODO: What happens between sessions or when
  // the originating tab is gone?
  // chrome.tabs.getSelected(function(tab) {
  //   qItem.tabId = tab.id;
  // });

  $(this).mousedown(function(event) {
    spinner.bind("mouseleave", stopTimer);
    spinner.bind("mouseup", stopTimer);
    $("body").bind("mouseleave", stopTimer);
    $("body").bind("mouseup", stopTimer);

    // When the user holds down the mouse
    // Wait a few seconds before starting the spinner
    // because we don't want to start it on a normal click.
    // This gives us a slight buffer time.
    spinner.oneTime(300, OVERRIDEBEHAVIOR, function() {
      spinner.css("top", event.pageY);
      spinner.css("left", event.pageX);
      $("body").prepend(spinner);
      spinner.css("-webkit-mask-image", spinnerImageURL(0));

      spinner.everyTime(75, SPINIMATION, function(i) {
        console.log("tick: "+ i );
        spinner.css("-webkit-mask-image", spinnerImageURL(i));
      }, 14);

      spinner.oneTime(1700, OVERRIDEBEHAVIOR, function() {
        $("#spinner").remove();
        // Go to the URL
        gotoURL(qItem.url);
      });
    });
  });

  var queueURL = function() {
    chrome.extension.sendRequest(qItem, function(response) {
      console.log(response);
    });
  };

  $(this).bind("click", queueURL);
  $(this).removeAttr('href');
});

var stopTimer = function() {
  spinner.stopTime(OVERRIDEBEHAVIOR);
  spinner.remove();
  spinner.stopTime(SPINIMATION);
};

function gotoURL(aURL) {
  window.location = aURL;
}

function displayNotification(event) {

}


function getBaseURL() {
  var url = location.href;  // entire url including querystring - also: window.location.href;
  var baseURL = url.substring(0, url.indexOf('/', 14));
  if (baseURL.indexOf('http://localhost') != -1) {
    // Base Url for localhost
    var bURL = location.href;  // window.location.href;
    var pathname = location.pathname;  // window.location.pathname;
    var index1 = bURL.indexOf(pathname);
    var index2 = bURL.indexOf("/", index1 + 1);
    var baseLocalUrl = bURL.substr(0, index2);

    return baseLocalUrl + "/";
  }
  else {
    // Root Url for domain name
    return baseURL;
  }
}