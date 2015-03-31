(function (window, document, $, alias) {

  'use strict';

  alias = alias || "ma";
  // create local ma object
  var ma =  {
    ga: function (op) {
      var argsToPass = Array.prototype.slice.call(arguments, 1);
      if (op === 'load') {
        this.ga.prototype.load.apply(this.ga.prototype, argsToPass);
      }
    }
  };
  ma.ga.prototype.load = function (trackingID, domainName, customVars) {
    var config, key, analyticsKey, analyticsObject, script, scripts, gaSets = [], i, len;
    if (arguments.length <= 0) {
      throw new Error('You must provide at least analytics property identifier.');
    }

    if (domainName !== undefined && typeof (domainName) === 'object') {
      customVars = domainName;
      domainName = undefined;
    }
    if (customVars !== undefined && typeof (customVars) !== 'object') {
      throw new Error('custom variables have to be an object.');
    }

    if (!this.gaExists()) {
      analyticsObject = 'ga';
      script = document.createElement('script');
      scripts = document.getElementsByTagName('script')[0];
      window.GoogleAnalyticsObject = analyticsObject;
      window[analyticsObject] = window[analyticsObject] || function () {
        (window[analyticsObject].q = window[analyticsObject].q || []).push(arguments);
      };
      window[analyticsObject].l = new Date();
      window[analyticsObject].l *= 1;
      script.async = true;
      script.src = '//www.google-analytics.com/analytics.js';
      scripts.parentNode.insertBefore(script, scripts);
    }
    config = {length : 0};
    if (domainName) {
      config.cookieDomain = domainName;
      config.length += 1;
    }

    if (customVars) {
      for (key in customVars) {
        if (customVars.hasOwnProperty(key)) {
          if (this.isDimensionMetricKey(key)) {
            analyticsKey = this.analyticsKey(key);
            if (analyticsKey) {
              gaSets.push([analyticsKey, customVars[key]]);
            }
          }
          // possibility to add more settings
        }
      }
    }
    if (config.length === 0) {
      config = 'auto';
    }
    this.getGA()('create', trackingID, config);
    for (i = 0, len = gaSets.length; i < len; i += 1) {
      this.getGA()('set', gaSets[i][0], gaSets[i][1]);
    }
  };
  // check if Google Universal Analytics object exists
  ma.ga.prototype.gaExists = function () {
    return window.GoogleAnalyticsObject !== undefined;
  };

  // get global analytics object
  ma.ga.prototype.getGA = function () {
    return window[window.GoogleAnalyticsObject];
  };

  // check if key refers to dimension or metric
  ma.ga.prototype.isDimensionMetricKey = function (key) {
    return key.match(/(?:(?:[c]?d(?:imension)?)([1-9]\d?$|1\d{2}$|200$)|(?:[c]?m(?:etric)?)([1-9]\d?$|1\d{2}$|200$))/) !== null;
  };

  // return dimension or metric for use in analytcs call
  ma.ga.prototype.analyticsKey = function (key) {
    var m = key.match(/(?:(?:[c]?d(?:imension)?)([1-9]\d?$|1\d{2}$|200$)|(?:[c]?m(?:etric)?)([1-9]\d?$|1\d{2}$|200$))/);
    if (m !== undefined) {
      if (m[1] !== undefined) {
        return 'dimension' + m[1];
      } else if (m[2] !== undefined) {
        return 'metric' + m[2];
      } else {
        return false;
      }
    }
    return false;
  };

  window[alias] = ma;
}(window, document));
