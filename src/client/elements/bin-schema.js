'use strict';

var BinEditor = require('./bin-editor');
var ajv = new Ajv({v5: true});

class BinSchema extends BinEditor {
  connectedCallback() {
    super.connectedCallback();
    this.editor.on('change', () => {
      var schema = this.editor.getValue();
      if (schema === undefined) return;
      this.statusEl.innerHTML = typeof schema != 'object'
                                ? 'Must be object'
                                : ajv.validateSchema(schema)
                                  ? ''
                                  : 'Schema is invalid';
    });
  }

  getValue() {
    return {
      schema: this.editor.getValue()
    };
  }
}

customElements.define('bin-schema', BinSchema);
