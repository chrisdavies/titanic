(function () {
  'use strict';

  var records = csvToObjects(titanic, ['id', 'survived', 'pclass', 'name'], true);

  console.log(records);
})();
