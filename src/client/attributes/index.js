'use strict';

var attributes = {
  caption: require('./caption')
};

module.exports = function addAttribute(ElClass, attrName) {
  if (!attributes[attrName]) throw new Error('Unknown attribute', attrName);
  var attrs = ElClass.observedAttributes = ElClass.observedAttributes || [];
  if (attrs.indexOf(attrName) == -1) attrs.push(attrName);
  if (!ElClass.prototype.attributeChangedCallback) {
    ElClass.prototype.attributeChangedCallback = attributeChangedCallback;
  }

  function attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrs.indexOf(attrName) == -1) return;
    attributes[attrName].call(this, oldVal, newVal);
  }
}
