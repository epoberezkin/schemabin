(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function caption(oldVal, newVal) {
  var h2 = this.getElementsByTagName('h2')[0];
  if (!h2) {
    h2 = document.createElement('h2');
    this.insertBefore(h2, this.childNodes[0]);
  }
  h2.innerHTML = newVal;
}

},{}],2:[function(require,module,exports){
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

},{"./caption":1}],3:[function(require,module,exports){
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

},{"./bin-editor":4}],4:[function(require,module,exports){
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

},{"../attributes":2}],5:[function(require,module,exports){
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

},{"../attributes":2}],6:[function(require,module,exports){
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

},{"./bin-editor":4}],7:[function(require,module,exports){
'use strict';

var BinEditor = require('./bin-editor');

class BinValidator extends BinEditor {
}

customElements.define('bin-validator', BinValidator);

},{"./bin-editor":4}],8:[function(require,module,exports){
'use strict';

require('./json-editor');
require('./bin-validator');
require('./bin-schema');
require('./bin-modules');
require('./bin-data');

},{"./bin-data":3,"./bin-modules":5,"./bin-schema":6,"./bin-validator":7,"./json-editor":9}],9:[function(require,module,exports){
'use strict';

class JSONEditor extends HTMLElement {
  connectedCallback() {
    var editor = this.ace = ace.edit(this.id);
    editor.$blockScrolling = Infinity;
    var session = this.ace_session = editor.getSession();
    session.setMode('ace/mode/json');
    session.setTabSize(2);
    session.setUseSoftTabs(true);

    session.on('change', () => {
      var text = this.ace.getValue();
      try { this.ace_value = JSON.parse(text); }
      catch(e) { this.ace_value = undefined; }
    });
  }

  setValue(data) {
    var text = JSON.stringify(data, null, '  ');
    this.ace.setValue(text);
    this.ace.gotoLine(1);
  }

  getValue() {
    return this.ace_value;
  }

  on() {
    return this.ace_session.on.apply(this.ace_session, arguments);
  }
}

customElements.define('json-editor', JSONEditor);

},{}],10:[function(require,module,exports){
'use strict';

require('./elements');

var optionsEditor = getEditor('options', {allErrors: true});
var schemaEditor = getEditor('schema', {$schema: 'http://json-schema.org/draft-04/schema#'});
var dataEditor = getEditor('data', {});
var schemaModules = document.getElementById('schemas');

var resultsEditor = ace.edit('results');
resultsEditor.setReadOnly(true);
resultsEditor.$blockScrolling = Infinity;


function getEditor(id, data) {
  var editor = document.getElementById(id);
  if (data) editor.setValue(data);
  editor.on('change', validate);
  return editor;
}

function validate() {
  var options = optionsEditor.getValue();
  var schema = schemaEditor.getValue();
  // var schemas = schemaModules.getValues();
  var data = dataEditor.getValue();
  var session = resultsEditor.getSession();
  session.setMode('ace/mode/text');
  session.setUseWrapMode(false);
  var results;
  if (typeof options == 'object' && typeof schema == 'object' && data !== undefined) {
    var ajv = new Ajv(options);
    var validate;
    try {
      validate = ajv.compile(schema);
      if (validate(data)) {
        results = 'Data is valid';
      } else {
        results = JSON.stringify(validate.errors, null, '  ');
        session.setMode('ace/mode/json');
      }
    } catch(e) {
      results = e.message;
      session.setUseWrapMode(true);
    }
  } else {
    results = typeof options == 'object' ? '' : 'Options should be an object\n';
    results += typeof schema == 'object' ? '' : 'Schema should be an object\n';
    results += data !== undefined ? '' : 'Data should be valid JSON';
  };
  resultsEditor.setValue(results);
  resultsEditor.gotoLine(1);
}

},{"./elements":8}]},{},[10]);
