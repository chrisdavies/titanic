function csvToObjects(csv, propertyNames, ignoreFirstRecord) {
  var records = csv.split('\n')
    .map(sanitizeLine)
    .map(lineToObject);

  if (ignoreFirstRecord) {
    return records.slice(1);
  } else {
    return records;
  }

  function lineToObject(line) {
    var fields = line.split(',');
    var obj = {};

    fields.forEach(function (field, index) {
      var propName = propertyNames[index];

      if (propName) {
        obj[propName] = field;
      }
    });

    return obj;
  }

  function sanitizeLine(line) {
    var sanitizedStr = '';
    var isInQuote = false;

    for (var i = 0; i < line.length; ++i) {
      var ch = line[i];

      if (isInQuote && ch === '"') {
        isInQuote = false;
      } else if (ch === '"') {
        isInQuote = true;
      }

      if (!isInQuote || ch !== ',') {
        sanitizedStr += ch;
      }
    }

    return sanitizedStr;
  }
}
