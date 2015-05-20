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

  // An example of a more generic filter function
  function findWhere(arr, key, value) {
    return records.filter(function (passenger) {
      return passenger[key] === 'value';
    });
  }

  findWhere(records, 'sex', 'male');

  // Example of filter... Find all females that are older than 30
  var womenOlderThan30 = records.filter(function (passenger) {
    return passenger.sex === 'female' && parseInt(passenger.age) > 30;
  });

  var menOlderThan30 = records.filter(function (passenger) {
    return passenger.sex === 'male' && parseInt(passenger.age) > 30;
  });

  console.log(records);
})();
