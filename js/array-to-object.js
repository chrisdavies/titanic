function arrayToObject(propertyNames) {
  return function (arr) {
    var obj = {};

    arr.forEach(function (field, index) {
      var propName = propertyNames[index];

      if (propName) {
        obj[propName] = field;
      }
    });

    return obj;
  };
}
