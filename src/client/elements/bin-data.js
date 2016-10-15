'use strict';

var BinEditor = require('./bin-editor');

class BinData extends BinEditor {
  getValue() {
    return {
      data: this.editor.getValue()
    };
  }
}

customElements.define('bin-data', BinData);
