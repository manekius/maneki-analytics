(function (window, document, $, alias) {

  'use strict';

  alias = alias || "ma";
  // create local ma object
  var ma =  {
    ga: function (op) {
      var argsToPass = Array.prototype.slice.call(arguments, 1);
      this.ga.prototype[op].apply(this.ga.prototype, argsToPass);
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

  // send pageview to ga
  ma.ga.prototype.pageview = function () {
    this.getGA()('send', 'pageview');
  };

  // attatch click event to selector that sends ga click event
  // ma.ga(‘click', **CSS selector**, ‘event', **cat**, **act**, (optional) **lab**, (optional) **val**, (optional) **custom variables**)
  ma.ga.prototype.click = function (selector, hittype) {
    var ga, callParams;
    if ((hittype === 'event' && arguments.length < 2)) {
      throw new Error('You need to set category of an event.');
    }
    ga = this.getGA();
    callParams = ['send', hittype];
    if (arguments.length > 2) {
      callParams = callParams.concat(Array.prototype.slice.call(arguments, 2, arguments.length));
    }
    $(selector).on('click', function () {
      window[window.GoogleAnalyticsObject].apply(window, callParams);
    });
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
  ma.scrollTracking = function (config) {
    if (!config && !ma.scrollTracking.config) {
      return new Error("tracking config not provided");
    }
    if (!config.scrollPoints || !(config.scrollPoints instanceof Array)) {
      return new Error("you need to define scrollPoints as Array");
    }

    config.scrollPoints.map(function (value) {
      return parseFloat(value);
    });
    ma.scrollTracking.config = config;

    $(window).on('scroll', function (e) {
      var $w, config, currentPosition, highPoint, event;
      $w = $(window);
      config = ma.scrollTracking.config;
      currentPosition = ($w.scrollTop() + $w.height()) / $(document).height() * 100;
      highPoint = -1;
      config.scrollPoints.forEach(function (val) {
        if (val <= currentPosition) {
          highPoint = val;
        }
      });
      event = config.events[highPoint];
      if (event && !window.sendingEvent) {
        window.sendingEvent = true;
        window[window.GoogleAnalyticsObject]('send', 'event', event[0], event[1], event[2]);
        config.scrollPoints = config.scrollPoints.filter(function (val) {
          return val !== highPoint;
        });
        window.sendingEvent = false;
      }
    });
  };

  window[alias] = ma;
}(window, document, jQuery));
