'use strict';

class JSONEditor extends HTMLElement {
  connectedCallback() {
    var editor = this.ace = ace.edit(this.id);
    editor.$blockScrolling = Infinity;
    var session = editor.getSession();
    session.setMode('ace/mode/json');
    session.setTabSize(2);
    session.setUseSoftTabs(true);
  }

  setValue(data) {
    var text = JSON.stringify(data, null, '  ');
    this.ace.setValue(text);
    this.ace.gotoLine(1);
  }

  getValue() {
    var text = this.ace.getValue();
    try { return JSON.parse(text); } catch(e) {}
  }

  on() {
    var session = this.ace.getSession();
    return session.on.apply(session, arguments);
  }
}

customElements.define('json-editor', JSONEditor);
