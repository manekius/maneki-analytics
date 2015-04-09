# maneki-analytics
Digital Analytics Implementations Simplified by Maneki (http://maneki.us/)

# Introduction

**Maneki Analytics** is a jQuery-based JavaScript library that aims to greatly reduce time and development required to implement advanced tracking across various digital analytics platforms.

## Requirements 

To work Maneki Analytics currently requires at least jQuery 2.x.

## Supported platforms

Maneki Analytics currently supports:
- Google Analytics - Universal Analytics

### Planned support

In the future we plan to add support for:
- Adobe Analytics (SiteCatalyst)
- Piwik
- Mixpanel

# Installation

Simply include the ma.js file in your `<head>` after your jQuery inclusion.

# Methods

To make the tracking implementation much faster Maneki Analytics include a set of multiple methods covering most of the tracking requirements.

The methods will differ regarding to what Digital Analytics platform is currently being used.

## Google Analytics

For reference regarding Google Analytics general implementation please see Google's documentation:

- ma.ga('load', '**account ID**, (optional) **domain name**, (optional) **custom variables**);
Loads GA and sends initial call. In short, works exactly like a regular GA tracking code. 

Example: 
```js
ma.ga('load', 'UA-55450170-1');
``` 

- ma.ga(‘click', **CSS selector**, ‘event', **cat**, **act**, (optional) **lab**, (optional) **val**, (optional) **custom variables**);
Sends a GA event on a click of a certain element. Basically based on jQuery's .on('click'). 

Example:
```js
ma.ga('click', '#myBanner', 'event', 'Homepage', 'Banner 1 Click', 'Header');
```

# Scroll Tracking

In addition to tracking loads and clicks Maneki Analytics also features advanced scroll tracking right out of the box! 

## Methods

- ma.scrollTracking();
Tracks scrolling according to the configuration. 
To configure set up the .config object with the following parameters:
```js
ma.scrollTracking.config = {
	'platform' : 'your platform', //(eg. 'ga')
	'scrollPoints' : ['your scrollpoints in percents'], //(eg. ['25, 50, 75, 100'])
	'events' : {
		'scroll point 1' : ['Category','Action','Label (optional)'], 
		'scroll point 2' : ['Category','Action','Label (optional)'],
		'scroll point 3' : ['Category','Action','Label (optional)'],
		'scroll point 4' : ['Category','Action','Label (optional)']
	}
};
```
Then, simply call the ma.scrollTracking() function. 

Example:
```js
$(document).ready(function(){
	ma.scrollTracking.config = {
	'platform' : 'ga',
	'scrollPoints' : '[25, 50, 75, 100]',
	'events' : {
		'25' : ['Scrolling','25%'],
		'50' : ['Scrolling','50%'],
		'75' : ['Scrolling','75%'],
		'100' : ['Scrolling','100%']
		}
	};

	ma.scrollTracking();
});
```

# Wishlist

We are planning on adding much more features in the future releases, such as:
- automatic form abandonment tracking,
- even better scroll tracking (with custom elements instead percents as breakpoints), 
- support for Adobe Analytics, 
- support for Piwik. 
