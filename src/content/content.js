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

var wikiLinks = $("a[href^=/wiki]").not("a.internal");
console.log(wikiLinks);

wikiLinks.each(function(i) {
  var qItem = {};
  qItem.url = getBaseURL() + $(this).attr('href');
  qItem.title = $(this).attr('innerText');
  qItem.origin = $(this).attr('baseURI');
  qItem.state = "new";

  // Get the current tab's index
  // Later we can use this to optionally add it
  // behind the originating tab for context
  // TODO: What happens between sessions or when
  // the originating tab is gone?
  // chrome.tabs.getSelected(function(tab) {
  //   qItem.tabId = tab.id;
  // });

  $(this).mouseup(function(){
    chrome.extension.sendRequest(qItem, function(response) {
       console.log(response);
    });
  });

  $(this).removeAttr('href');
});


function getBaseURL() {
  var url = location.href;  // entire url including querystring - also: window.location.href;
  var baseURL = url.substring(0, url.indexOf('/', 14));
    if (baseURL.indexOf('http://localhost') != -1) {
      // Base Url for localhost
      var url = location.href;  // window.location.href;
      var pathname = location.pathname;  // window.location.pathname;
      var index1 = url.indexOf(pathname);
      var index2 = url.indexOf("/", index1 + 1);
      var baseLocalUrl = url.substr(0, index2);

      return baseLocalUrl + "/";
    }
    else {
      // Root Url for domain name
      return baseURL;
    }
}