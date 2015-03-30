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

Simply include the ma.js file in your <head> after your jQuery inclusion.  


# Methods

To make the tracking implementation much faster Maneki Analytics include a set of multiple methods covering most of the tracking requirements.

The methods will differ regarding to what Digital Analytics platform is currently used.

## Google Analytics

For reference regarding Google Analytics general implementation please see Google’s documentation:

- ma.ga(‚load’, ‚**account ID**, (optional) **domain name**, (optional) **custom variables**);
Loads GA and sends initial call. In short, works exactly like a regular GA tracking code. 

Example: 
'''
ma.ga(‚load’, ‚UA-55450170-1’);
''' 

- ma.ga(‘click’, **CSS selector**, ‘event’, **cat**, **act**, (optional) **lab**, (optional) **val**, (optional) **custom variables**);
Sends a GA event on a click of a certain element. Basically based on jQuery’s .on(‚click’). 

Example:
'''
ma.ga(‚click’, ‚#myBanner’, ‚event’, ‚Homepage’, ‚Banner 1 Click’, ‚Header’);
'''

# Wishlist
