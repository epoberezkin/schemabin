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

function getValue(editor) {
  try { return JSON.parse(editor.getValue()); } catch(e) {}
}

})();
