(function () {
  'use strict';

  // parseCsv(csvString, ['id', 'survived', 'pclass'], true);

  // var records = CSV.toArray(titanic)
  //   .map(arrayToObject(['id', 'survived', 'pclass', 'name']))
  //   .slice(1);

  var records = CSV.toArray(titanic)
    .map(function (columns) {
      return {
        id: columns[0],
        survived: columns[1],
        pclass: columns[2],
        name: columns[3]
      }
    })
    .slice(1);

  console.log(records);
})();
