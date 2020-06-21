export const splitWord = (element) => {
  var child = element.firstChild;
  while (child) {
    // have to get a reference before we replace the child node
    var nextSibling = child.nextSibling;

    if (child.nodeType === 1) {
      // element node
      splitWord(child);
    } else if (child.nodeType === 3) {
      // text node
      var d_ = document.createDocumentFragment();

      for (var i = 0, len = child.nodeValue.length; i < len; i++) {
        var span = document.createElement("span");
        span.innerHTML = child.nodeValue.charAt(i);
        d_.appendChild(span);
      }
      // document fragments are just awesome
      child.parentNode.replaceChild(d_, child);
    }
    child = nextSibling;
  }
};

export const debounce = (f, ms) => {
  let isCooldown = false;

  return function () {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => (isCooldown = false), ms);
  };
};
