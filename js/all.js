var addAccessibilityToolbar = function() {
  var body = document.getElementsByTagName('body')[0];
  body.innerHTML += "<aside class='accessibility'><nav><a href='#' class='contrasted'>high contrast</a> <a href='#' class='normal-contrast'>normal contrast</a> | <a href='#' class='normal-font'>a</a> <a href='#' class='large-font'>A</a></nav></aside>";
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', addAccessibilityToolbar, false);
}

if (document.captureEvents) { document.captureEvents(Event.CLICK); }

document.onclick = function(event) {
  var target = event.srcElement || event.target;
  var html   = document.documentElement;
  
  if(target.className == 'contrasted') {
    html.className += ' contrasted';
    event.preventDefault();
  } else if(target.className == 'normal-contrast') {
    html.className = html.className.replace(' contrasted', '');
    event.preventDefault();
  } else if(target.className == 'large-font') {
    html.className += ' large-font';
    event.preventDefault();
  } else if(target.className == 'normal-font') {
    html.className = html.className.replace(' large-font', '');
    event.preventDefault();
  }
}

