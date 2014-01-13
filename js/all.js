/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/
var docCookies = {
  getItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toGMTString();
          break;
      }
    }
    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
  },
  removeItem: function (sKey, sPath) {
    if (!sKey || !this.hasItem(sKey)) { return; }
    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
    return aKeys;
  }
};

var addAccessibilityToolbar = function() {
  var body = document.getElementsByTagName('body')[0];
  body.innerHTML += "<nav class='accessibility'><a href='#' class='contrasted'>high contrast</a> <a href='#' class='normal-contrast'>normal contrast</a> <a href='#' class='normal-font'>Aa</a> <a href='#' class='large-font'>aA</a></nav>";
}

var applyAccessibility = function() {
  var html       = document.documentElement;
  var contrasted = docCookies.getItem('contrasted') == 'yes';
  var largeFont  = docCookies.getItem('large-font') == 'yes';
  
  if(contrasted) {
    html.className += ' contrasted';
  } else {
    html.className = html.className.replace(/\s?contrasted/g, '');
  }
  
  if(largeFont) {
    html.className += ' large-font';
  } else {
    html.className = html.className.replace(/\s?large-font/g, '');
  }
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', addAccessibilityToolbar, false);
}

if (document.captureEvents) { document.captureEvents(Event.CLICK); }

document.onclick = function(event) {
  var target = event.srcElement || event.target;
  
  if(target.parentNode.className == 'accessibility') {
    event.preventDefault();
    
    if(target.className == 'contrasted') {
      docCookies.setItem('contrasted', 'yes');
    } else if(target.className == 'normal-contrast') {
      docCookies.setItem('contrasted', 'no');
    } else if(target.className == 'large-font') {
      docCookies.setItem('large-font', 'yes');
    } else if(target.className == 'normal-font') {
      docCookies.setItem('large-font', 'no');
    }
    
    applyAccessibility();
  }
}

window.addEventListener('devicelight', function(e) {
  var lux = e.value;
  
  console.log("Lux: " + lux);
  
  if (lux <= 65) {
    docCookies.setItem('contrasted', 'yes');
  } else {
    docCookies.setItem('contrasted', 'no');
  }
  
  applyAccessibility();
});

applyAccessibility();
