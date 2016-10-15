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
