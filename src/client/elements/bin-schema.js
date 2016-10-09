'use strict';

var BinEditor = require('./bin-editor');

class BinSchema extends BinEditor {
  // connectedCallback() {
  //   this.editor = document.createElement('json-editor');
  //   this.editor.id = this.getAttribute('name');
  //   this.appendChild(this.editor);
  // }
}

customElements.define('bin-schema', BinSchema);
