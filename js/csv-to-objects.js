function Tokenizer(str) {
  this.str = str;
  this.tokenStart = 0;
  this.index = 0;
}

Tokenizer.prototype = {
  get char () {
    return this.str[this.index];
  },

  get peek () {
    return this.str[this.index + 1];
  },

  get EOF () {
    return this.index >= this.str.length;
  },

  moveNext: function () {
    return ++this.index < this.str.length;
  },

  nextIndexOf: function (fn) {
    for (var i = this.index; i < this.str.length; ++i) {
      if (fn(this.str[i])) {
        return i;
      }
    }

    return -1;
  },

  popChar: function () {
    var ch = this.char;
    this.tokenStart = ++this.index;
    return ch;
  },

  popToken: function () {
    var token = this.str.slice(this.tokenStart, this.index);
    this.tokenStart = this.index;
    return token;
  }
};

function csvTo2DArray(tokenizer) {
  return readRows(tokenizer);

  function readRows(tokenizer) {
    var rows = [];

    while (!tokenizer.EOF) {
      rows.push(readFields(tokenizer));
    }

    return rows;
  }

  function readFields(tokenizer) {
    var fields = [];

    while (!tokenizer.EOF) {
      var field;

      if (isQuotedField(tokenizer)) {
        field = readQuotedField(tokenizer);
      } else {
        field = readUnquotedField(tokenizer);
      }

      fields.push(field.replace(/\"\"\"/g, '"'));

      if (tokenizer.popChar() === '\n') {
        break;
      }
    }

    return fields;
  }

  function isQuotedField(tokenizer) {
    // Find the index of the next non-quote character
    var nonQuotedCharIndex = tokenizer.nextIndexOf(function (ch) {
      return ch !== '"';
    });

    return tokenizer.char === '"' && ((nonQuotedCharIndex - tokenizer.index) % 3);
  }

  function readQuotedField(tokenizer) {
    while (tokenizer.moveNext() && (tokenizer.char !== '"' || tokenizer.peek === '"')) {
      if (tokenizer.char === '"') {
        skipTripleQuotes(tokenizer);
      }
    }

    tokenizer.moveNext();
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

function csvToObjects(csv, propertyNames, ignoreFirstRecord) {
  var records = csvTo2DArray(new Tokenizer(csv))
    .map(lineToObject);

  if (ignoreFirstRecord) {
    return records.slice(1);
  } else {
    return records;
  }

  function lineToObject(fields) {
    var obj = {};

    fields.forEach(function (field, index) {
      var propName = propertyNames[index];

      if (propName) {
        obj[propName] = field;
      }
    });

    return obj;
  }
}
