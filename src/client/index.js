(function() {

var optionsEditor = getEditor('options', '{\n  "allErrors": true\n}');
var schemaEditor = getEditor('schema', '{\n  "$schema": "http://json-schema.org/draft-04/schema#"\n}');
var dataEditor = getEditor('data', '{}');

var resultsEditor = ace.edit('results');
resultsEditor.setReadOnly(true);
resultsEditor.$blockScrolling = Infinity;
// console.log(Ajv);


function getEditor(id, text) {
  var editor = ace.edit(id);
  editor.$blockScrolling = Infinity;
  // editor.setTheme('ace/theme/monokai');
  var session = editor.getSession();
  session.setMode('ace/mode/json');
  session.setTabSize(2);
  session.setUseSoftTabs(true);
  if (text) editor.setValue(text);
  editor.gotoLine(1);
  session.on('change', validate);
  return editor;
}

function validate() {
  var options = getValue(optionsEditor);
  var schema = getValue(schemaEditor);
  var data = getValue(dataEditor);
  if (!(options && schema && data)) return;
  var ajv = new Ajv(options);
  var session = resultsEditor.getSession();
  if (ajv.validate(schema, data)) {
    resultsEditor.setValue('Valid');
    session.setMode('ace/mode/text');
  } else {
    resultsEditor.setValue(JSON.stringify(ajv.errors, null, '  '));
    session.setMode('ace/mode/json');
  }
  resultsEditor.gotoLine(1);
}

function getValue(editor) {
  try { return JSON.parse(editor.getValue()); } catch(e) {}
}

})();
