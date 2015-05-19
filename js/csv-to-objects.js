function csvToObjects(csv, propertyNames, ignoreFirstRecord) {
  var records = csvTo2DArray(csv).map(rowToObject);

  return ignoreFirstRecord ? records.slice(1) : records;

  function rowToObject(row) {
    var obj = {};

    row.forEach(function (field, index) {
      var propName = propertyNames[index];

      if (propName) {
        obj[propName] = field;
      }
    });

    return obj;
  }
}

function csvTo2DArray(csv) {
  return readRows(new Tokenizer(csv));

  function readRows(tokenizer) {
    var rows = [];

    while (!tokenizer.EOF) {
      rows.push(readFields(tokenizer));
    }

    return rows;
  }

  function readFields(tokenizer) {
    var fields = [];

    do {
      fields.push(unescapeQuotes(readField(tokenizer)));
    } while (!tokenizer.EOF && tokenizer.popChar() !== '\n')

    return fields;
  }

  function unescapeQuotes(field) {
    return field.replace(/\"\"\"/g, '"');
  }

  function readField(tokenizer) {
    if (isQuotedField(tokenizer)) {
      return readQuotedField(tokenizer);
    }

    return readUnquotedField(tokenizer);
  }

  function isQuotedField(tokenizer) {
    // Find the index of the next non-quote character
    var nonQuotedCharIndex = tokenizer.nextIndexOf(function (ch) {
      return ch !== '"';
    });

    // If we have a number of quotes that is not divisible by 3, then we have
    // an unescaped quote and we are dealing with a quoted field
    return tokenizer.char === '"' && ((nonQuotedCharIndex - tokenizer.index) % 3);
  }

  function readQuotedField(tokenizer) {
    while (tokenizer.moveNext() && (tokenizer.char !== '"' || tokenizer.peek === '"')) {
      if (tokenizer.char === '"') {
        skipTripleQuotes(tokenizer);
      }
    }

    // Move past the ending quote
    tokenizer.moveNext();

    // Return the token sans surrounding quotes
    return tokenizer.popToken().slice(1, -1);
  }

  function skipTripleQuotes(tokenizer) {
    tokenizer.moveNext();
    tokenizer.moveNext();
  }

  function readUnquotedField(tokenizer) {
    while (tokenizer.moveNext() && tokenizer.char !== ',' && tokenizer.char !== '\n');

    return tokenizer.popToken();
  }
}
