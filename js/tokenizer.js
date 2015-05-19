// Tokenizer is a class that helps parse strings. It was written to help
// parse CSV files, but could be used for other parsing needs
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
