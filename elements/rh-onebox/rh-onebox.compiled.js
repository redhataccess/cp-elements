!function(e,t){if("function"==typeof define&&define.amd)define(["exports","../rhelement/rhelement.compiled.js","../../whatwg-fetch/fetch.js"],t);else if("undefined"!=typeof exports)t(exports,require("../rhelement/rhelement.compiled.js"),require("../../whatwg-fetch/fetch.js"));else{var n={};t(n,e.rhelementCompiled,e.fetch),e.rhOnebox=n}}(this,function(e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(t),r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){function t(e,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.template||console.warn("A template needs to be provided in the constructor"),r.elementName=e,r.config=n,r.htmlTemplate=n.template,r.loading=!1,r.successHandler=r.successHandler.bind(r),r.errorHandler=r.errorHandler.bind(r),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.default),r(t,null,[{key:"observedAttributes",get:function(){return["source","term"]}}]),r(t,[{key:"attributeChangedCallback",value:function(e,t,n){switch(e){case"source":this.source=n,this.getData(this.source);break;case"term":this.term=n}}},{key:"getData",value:function(e){var t=this;if(this.htmlTemplate)return this.loading=!0,fetch(e).then(function(e){return e.json()},function(e){return t.errorHandler}).then(this.successHandler).then(function(){return t.loading=!1})}},{key:"successHandler",value:function(e){this.data=e,this.render()}},{key:"errorHandler",value:function(e){console.log(e)}},{key:"findMatch",value:function(){var e=this,t=void 0;return this.data[this.config.arrayName].forEach(function(n){n[e.config.matchArrayName].forEach(function(r){r.toLowerCase()===e.term.toLowerCase().trim()&&(t=n)})}),t}},{key:"render",value:function(e){var t=this.findMatch(),n=this.htmlTemplate(t);window.ShadyCSS&&ShadyCSS.prepareTemplate(n,this.elementName),this.shadowRoot.appendChild(n.content.cloneNode(!0)),window.ShadyCSS&&ShadyCSS.styleElement(this)}}]),t}();e.default=o});