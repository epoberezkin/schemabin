'use strict';

var attributes = require('../attributes');

class BinEditor extends HTMLElement {
  connectedCallback() {
    this.statusEl = document.createElement('div');
    this.statusEl.className = 'module-status';
    this.appendChild(this.statusEl);

    this.editor = document.createElement('json-editor');
    this.editor.id = this.getAttribute('name');
    this.appendChild(this.editor);

    this.editor.on('change', () => {
      var invalid = this.editor.getValue() === undefined;
      this.statusEl.innerHTML = invalid ? 'JSON error': '';
      if (invalid) return false;
    });
  }
}

attributes(BinEditor, 'caption');

module.exports = BinEditor;
