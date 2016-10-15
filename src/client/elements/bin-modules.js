'use strict';

var attributes = require('../attributes');

class BinModules extends HTMLElement {
  connectedCallback() {
    var modTagName = this.getAttribute('module');
    var mod = document.createElement(modTagName);
    mod.setAttribute('name', 'schema');
    this.appendChild(mod);
    this.modules = [mod];
  }

  getValues() {
    return this.modules.map(m => m.getValue());
  }
}

attributes(BinModules, 'caption');

customElements.define('bin-modules', BinModules);
