'use strict';

var attributes = require('../attributes');

class BinEditor extends HTMLElement {
  connectedCallback() {
    this.editor = document.createElement('json-editor');
    this.editor.id = this.getAttribute('name');
    this.appendChild(this.editor);
  }
}

attributes(BinEditor, 'caption');

module.exports = BinEditor;
