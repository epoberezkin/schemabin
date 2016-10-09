'use strict';

module.exports = function caption(oldVal, newVal) {
  var h2 = this.getElementsByTagName('h2')[0];
  if (!h2) {
    h2 = document.createElement('h2');
    this.insertBefore(h2, this.childNodes[0]);
  }
  h2.innerHTML = newVal;
}
