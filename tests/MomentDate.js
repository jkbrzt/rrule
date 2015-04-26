// TODO(aramk) Compiled from CoffeeScript - include the original and build it.

var existingPropertyNames, propertyNames,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

this.MomentDate = (function(superClass) {
  extend(MomentDate, superClass);

  function MomentDate() {
    var args, timeZone;
    args = Array.prototype.slice.call(arguments);
    timeZone = void 0;
    if (args.length > 1 && typeof args[args.length - 1] === 'string') {
      timeZone = args.pop();
    }
    if (args.length === 1) {
      args = args[0];
    }
    this._moment = moment.tz(args, timeZone);
  }

  MomentDate.prototype.toString = function() {
    return this._moment.toString();
  };

  MomentDate.prototype.valueOf = function() {
    return this._moment.toDate().getTime();
  };

  MomentDate.prototype.toDate = function() {
    return new Date(this.toString());
  };

  return MomentDate;

})(Date);

propertyNames = Object.getOwnPropertyNames(Date.prototype);

existingPropertyNames = Object.getOwnPropertyNames(MomentDate.prototype);

propertyNames = _.difference(propertyNames, existingPropertyNames);

_.each(propertyNames, function(propertyName) {
  var args;
  args = arguments;
  return MomentDate.prototype[propertyName] = function() {
    var date;
    date = this._moment.toDate();
    return date[propertyName].apply(date, args);
  };
});

RRule.setDateClass(MomentDate);
