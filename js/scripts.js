(function () {
  'use strict';

  var records = CSV.toArray(titanic)
    .map(arrayToObject(['id', 'survived', 'pclass', 'name']))
    .slice(1);

  console.log(records);
})();
