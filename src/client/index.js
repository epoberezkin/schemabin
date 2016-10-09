'use strict';

require('./elements');

var optionsEditor = getEditor('options', {allErrors: true});
var schemaEditor = getEditor('schema', {$schema: 'http://json-schema.org/draft-04/schema#'});
var dataEditor = getEditor('data', {});

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
