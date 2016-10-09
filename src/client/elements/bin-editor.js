'use strict';

class BinEditor extends HTMLElement {
  connectedCallback() {
    this.editor = document.createElement('json-editor');
    this.editor.id = this.getAttribute('name');
    this.appendChild(this.editor);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName == 'caption') {
      var h2 = this.getElementsByTagName('h2')[0];
      if (!h2) {
        h2 = document.createElement('h2');
        this.insertBefore(h2, this.childNodes[0]);
      }
      h2.innerHTML = newVal;
    }
  }
}

BinEditor.observedAttributes = ['caption'];

module.exports = BinEditor;
