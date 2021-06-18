exports.ifEquals = function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
}

exports.increase = function(value, options) {
  return parseInt(value) + 1;
}