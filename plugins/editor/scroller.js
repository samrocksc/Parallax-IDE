'use strict';

var _ = require('lodash');

function generateContent(lines, start, minLength) {
  return _(lines)
    .slice(start)
    .thru(function(array){
      if(array.length < minLength){
        // pad whitespace at top of array
        return _(new Array(minLength - array.length))
          .fill('\u2009')
          .concat(array)
          .value();
      }else{
        return array;
      }
    })
    .map(function(line){
      if(line.length === 0){
        // insert a blank space to prevent pre omitting a trailing newline,
        // even though pre/pre-nowrap/pre-line are specified.
        return '\u2009';
      }
      return line;
    })
    .join('\n');
}

var Scroller = function() {
  this.lines = [];
  this.minVisible = 30;
  this.startPosition = 0;
  this.animateRequest = null;
  this.sticky = true;
  this.jumpToBottom = true;
  this.dirty = false;
  this.console = null;

  //pre-bind functions and throttle expansion
  this.refresh = this._renderVisible.bind(this);
  this.scroll = this._onScroll.bind(this);
  this.expand = _.throttle(this._expand.bind(this), 150, {
    leading: true,
    trailing: true
  });
};

Scroller.prototype.setLines = function(newLines) {
  var len = newLines.length;
  this.lines = newLines;
  if(this.sticky){
    this.startPosition = Math.max(0, len - this.minVisible);
  }else if(newLines.length === 1 && newLines[0].length === 0){
    // ^^ `lines` is reset to an array with one empty line. ugh.

    // handle the reset case when lines is replaced with an empty array
    // we don't have a direct event that can call this
    this.reset();
  }
  this.dirty = true;
};

Scroller.prototype.reset = function(){
  this.startPosition = Math.max(0, this.lines.length - this.minVisible);
  this.jumpToBottom = true;
  this.sticky = true;
  this.dirty = true;
};

Scroller.prototype.requestRefresh = function(){
  if(this.console){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype._renderVisible = function(){
  var top = this.console.scrollTop;
  this.animateRequest = null;
  if(this.dirty && this.console){
    if(this.sticky){
      this.startPosition = Math.max(0, this.lines.length - this.minVisible);
    }
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.minVisible);
    if(this.jumpToBottom){
      this.console.scrollTop = 350000;
      this.jumpToBottom = false;
    }else if(!this.sticky && this.startPosition > 0 && top === 0){
      //cover the situation where the window was fully scrolled faster than expand could keep up and locked to the top
      requestAnimationFrame(this.expand);
    }
    this.dirty = false;
  }
};

Scroller.prototype._expand = function(){
  this.startPosition = Math.max(0, this.startPosition - this.minVisible);
  this.sticky = false;
  if(this.console){
    var scrollHeight = this.console.scrollHeight;
    var scrollTop = this.console.scrollTop;

    // do an inline scroll to avoid potential scroll interleaving
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.minVisible);
    var newScrollHeight = this.console.scrollHeight;
    this.console.scrollTop = scrollTop + newScrollHeight - scrollHeight;

    this.dirty = false;
  }
};

Scroller.prototype._onScroll = function(){
  var height = this.console.offsetHeight;
  var scrollHeight = this.console.scrollHeight;
  var scrollTop = this.console.scrollTop;
  if(!this.jumpToBottom && scrollTop < 15 && this.startPosition > 0){
    this.expand();
  }else if(!this.sticky && scrollTop + height > scrollHeight - 30){
    this.jumpToBottom = true;
    this.sticky = true;
    this.dirty = true;
  }else if(this.sticky && scrollTop + height < scrollHeight - 30){
    this.sticky = false;
  }

  if(this.dirty && !this.animateRequest){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype.setConsole = function(console){
  this.console = console;
};

module.exports = Scroller;
