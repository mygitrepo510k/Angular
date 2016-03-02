/**
 * Angular Carousel - Mobile friendly touch carousel for AngularJS
 * @version v0.3.7 - 2014-11-11
 * @link http://revolunet.github.com/angular-carousel
 * @author Julien Bouquillon <julien@revolunet.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module("angular-carousel",["ngTouch","angular-carousel.shifty"]),angular.module("angular-carousel").directive("rnCarouselAutoSlide",["$timeout",function(a){return{restrict:"A",link:function(b,c,d){var e=Math.round(1e3*parseFloat(d.rnCarouselAutoSlide)),f=increment=!1,g=c.children().length;b.carouselExposedIndex||(b.carouselExposedIndex=0),stopAutoplay=function(){angular.isDefined(f)&&a.cancel(f),f=void 0},increment=function(){b.carouselExposedIndex=b.carouselExposedIndex<g-1?b.carouselExposedIndex+1:0},restartTimer=function(){stopAutoplay(),f=a(increment,e)},b.$watch("carouselIndex",function(){restartTimer()}),restartTimer(),d.rnCarouselPauseOnHover&&"false"!=d.rnCarouselPauseOnHover&&(c.on("mouseenter",stopAutoplay),c.on("mouseleave",restartTimer)),b.$on("$destroy",function(){stopAutoplay(),c.off("mouseenter",stopAutoplay),c.off("mouseleave",restartTimer)})}}}]),angular.module("angular-carousel").directive("rnCarouselIndicators",["$parse",function(a){return{restrict:"A",scope:{slides:"=",index:"=rnCarouselIndex"},templateUrl:"carousel-indicators.html",link:function(b,c,d){var e=a(d.rnCarouselIndex);b.goToSlide=function(a){e.assign(b.$parent.$parent,a)}}}}]),angular.module("angular-carousel").run(["$templateCache",function(a){a.put("carousel-indicators.html",'<div class="rn-carousel-indicator">\n<span ng-repeat="slide in slides" ng-class="{active: $index==index}" ng-click="goToSlide($index)">●</span></div>')}]),function(){"use strict";angular.module("angular-carousel").service("DeviceCapabilities",function(){function a(){var a="transform",b="webkitTransform";return"undefined"!=typeof document.body.style[a]?["webkit","moz","o","ms"].every(function(b){var c="-"+b+"-transform";return"undefined"!=typeof document.body.style[c]?(a=c,!1):!0}):a="undefined"!=typeof document.body.style[b]?"-webkit-transform":void 0,a}function b(){var a,b=document.createElement("p"),c={webkitTransform:"-webkit-transform",msTransform:"-ms-transform",transform:"transform"};document.body.insertBefore(b,null);for(var d in c)void 0!==b.style[d]&&(b.style[d]="translate3d(1px,1px,1px)",a=window.getComputedStyle(b).getPropertyValue(c[d]));return document.body.removeChild(b),void 0!==a&&a.length>0&&"none"!==a}return{has3d:b(),transformProperty:a()}}).service("computeCarouselSlideStyle",["DeviceCapabilities",function(a){return function(b,c,d){var e,f={display:"inline-block"},g=100*b+c,h=a.has3d?"translate3d("+g+"%, 0, 0)":"translate3d("+g+"%, 0)",i=(100-Math.abs(g))/100;if(a.transformProperty)if("fadeAndSlide"==d)f[a.transformProperty]=h,e=0,Math.abs(g)<100&&(e=.3+.7*i),f.opacity=e;else if("hexagon"==d){var j=100,k=0,l=60*(i-1);j=-100*b>c?100:0,k=-100*b>c?l:-l,f[a.transformProperty]=h+" rotateY("+k+"deg)",f[a.transformProperty+"-origin"]=j+"% 50%"}else if("zoom"==d){f[a.transformProperty]=h;var m=1;Math.abs(g)<100&&(m=1+2*(1-i)),f[a.transformProperty]+=" scale("+m+")",f[a.transformProperty+"-origin"]="50% 50%",e=0,Math.abs(g)<100&&(e=.3+.7*i),f.opacity=e}else f[a.transformProperty]=h;else f["margin-left"]=g+"%";return f}}]).service("createStyleString",function(){return function(a){var b=[];return angular.forEach(a,function(a,c){b.push(c+":"+a)}),b.join(";")}}).directive("rnCarousel",["$swipe","$window","$document","$parse","$compile","$timeout","$interval","computeCarouselSlideStyle","createStyleString","Tweenable",function(a,b,c,d,e,f,g,h,i,j){function k(a,b,c){var d=c;return a.every(function(a,c){return angular.equals(a,b)?(d=c,!1):!0}),d}{var l=0;b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame}return{restrict:"A",scope:!0,compile:function(m,n){var o,p,q=m[0].querySelector("li"),r=q?q.attributes:[],s=!1,t=!1;return["ng-repeat","data-ng-repeat","ng:repeat","x-ng-repeat"].every(function(a){var b=r[a];if(angular.isDefined(b)){var c=b.value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),d=c[3];if(o=c[1],p=c[2],o)return angular.isDefined(n.rnCarouselBuffered)&&(t=!0,b.value=o+" in "+p+"|carouselSlice:carouselBufferIndex:carouselBufferSize",d&&(b.value+=" track by "+d)),s=!0,!1}return!0}),function(m,n,o){function q(){return n[0].querySelectorAll("ul[rn-carousel] > li")}function r(a){L=!0,A({x:a.clientX,y:a.clientY},a)}function u(a){var b=100*m.carouselBufferIndex+a;angular.forEach(q(),function(a,c){a.style.cssText=i(h(c,b,I.transitionType))})}function v(a,b){if(void 0===a&&(a=m.carouselIndex),b=b||{},b.animate===!1||"none"===I.transitionType)return O=!1,K=-100*a,m.carouselIndex=a,B(),void 0;O=!0;var c=new j;c.tween({from:{x:K},to:{x:-100*a},duration:I.transitionDuration,easing:I.transitionEasing,step:function(a){u(a.x)},finish:function(){O=!1,m.$apply(function(){m.carouselIndex=a,K=-100*a,B()})}})}function w(){var a=n[0].getBoundingClientRect();return a.width?a.width:a.right-a.left}function x(){M=w()}function y(a){return c.bind("mouseup",r),x(),N=n[0].querySelector("li").getBoundingClientRect().left,D=!0,E=a.x,!1}function z(a){if(!O){var b,c;if(D&&(b=a.x,c=E-b,c>2||-2>c)){L=!0;var d=K+100*-c/M;u(d)}return!1}}function A(a,b){if((!b||L)&&(c.unbind("mouseup",r),D=!1,L=!1,F=E-a.x,0!==F&&!O))if(K+=100*-F/M,I.isSequential){var d=I.moveTreshold*M,e=-F,f=-Math[e>=0?"ceil":"floor"](e/M),g=Math.abs(e)>d;G&&f+m.carouselIndex>=G.length&&(f=G.length-1-m.carouselIndex),f+m.carouselIndex<0&&(f=-m.carouselIndex);var h=g?f:0;F=m.carouselIndex+h,v(F)}else m.$apply(function(){m.carouselIndex=parseInt(-K/100,10),B()})}function B(){var a=0,b=(m.carouselBufferSize-1)/2;t?(a=m.carouselIndex<=b?0:G&&G.length<m.carouselBufferSize?0:G&&m.carouselIndex>G.length-m.carouselBufferSize?G.length-m.carouselBufferSize:m.carouselIndex-b,m.carouselBufferIndex=a,f(function(){u(K)},0,!1)):f(function(){u(K)},0,!1)}function C(){x(),v()}l++;var D,E,F,G,H={transitionType:o.rnCarouselTransition||"slide",transitionEasing:"easeTo",transitionDuration:300,isSequential:!0,autoSlideDuration:3,bufferSize:5,moveTreshold:.1},I=angular.extend({},H),J=!1,K=0,L=!1,M=null,N=null,O=!1;if(void 0!==o.rnCarouselControls){var P='<div class="rn-carousel-controls">\n  <span class="rn-carousel-control rn-carousel-control-prev" ng-click="prevSlide()" ng-if="carouselIndex > 0"></span>\n  <span class="rn-carousel-control rn-carousel-control-next" ng-click="nextSlide()" ng-if="carouselIndex < '+p+'.length - 1"></span>\n</div>';n.append(e(angular.element(P))(m))}a.bind(n,{start:y,move:z,end:A,cancel:function(a){A({},a)}}),m.nextSlide=function(a){var b=m.carouselIndex+1;b>G.length-1&&(b=0),O||v(b,a)},m.prevSlide=function(a){var b=m.carouselIndex-1;0>b&&(b=G.length-1),v(b,a)};var Q=!0;m.carouselIndex=0,s||(G=[],angular.forEach(q(),function(a,b){G.push({id:b})}));var R;if(void 0!==o.rnCarouselAutoSlide){var S=parseInt(o.rnCarouselAutoSlide,10)||I.autoSlideDuration;R=g(function(){O||D||m.nextSlide()},1e3*S)}if(o.rnCarouselIndex){var T=function(a){U.assign(m.$parent,a)},U=d(o.rnCarouselIndex);angular.isFunction(U.assign)?(m.$watch("carouselIndex",function(a){O||T(a)}),m.$parent.$watch(U,function(a){void 0!==a&&null!==a&&(G&&a>=G.length?(a=G.length-1,T(a)):G&&0>a&&(a=0,T(a)),O||v(a,{animate:!Q}),Q=!1)}),J=!0):isNaN(o.rnCarouselIndex)||v(parseInt(o.rnCarouselIndex,10),{animate:!1})}else v(0,{animate:!Q}),Q=!1;if(o.rnCarouselLocked&&m.$watch(o.rnCarouselLocked,function(a){O=a===!0?!0:!1}),s){var V=void 0!==o.rnCarouselDeepWatch;m[V?"$watch":"$watchCollection"](p,function(a,b){(G||a).slice();if(G=a,V&&angular.isArray(a)){var c=b[m.carouselIndex],d=k(a,c,m.carouselIndex);v(d,{animate:!1})}else v(m.carouselIndex,{animate:!1})},!0)}m.$on("$destroy",function(){c.unbind("mouseup",r)}),m.carouselBufferIndex=0,m.carouselBufferSize=I.bufferSize;var W=angular.element(b);W.bind("orientationchange",C),W.bind("resize",C),m.$on("$destroy",function(){c.unbind("mouseup",r),W.unbind("orientationchange",C),W.unbind("resize",C)})}}}}])}(),angular.module("angular-carousel.shifty",[]).factory("Tweenable",function(){return function(a){var b=function(){"use strict";function b(){}function c(a,b){var c;for(c in a)Object.hasOwnProperty.call(a,c)&&b(c)}function d(a,b){return c(b,function(c){a[c]=b[c]}),a}function e(a,b){c(b,function(c){"undefined"==typeof a[c]&&(a[c]=b[c])})}function f(a,b,c,d,e,f,h){var i,j=(a-f)/e;for(i in b)b.hasOwnProperty(i)&&(b[i]=g(c[i],d[i],l[h[i]],j));return b}function g(a,b,c,d){return a+(b-a)*c(d)}function h(a,b){var d=k.prototype.filter,e=a._filterArgs;c(d,function(c){"undefined"!=typeof d[c][b]&&d[c][b].apply(a,e)})}function i(a,b,c,d,e,g,i,j,k){s=b+c,t=Math.min(r(),s),u=t>=s,v=c-(s-t),a.isPlaying()&&!u?(a._scheduleId=k(a._timeoutHandler,p),h(a,"beforeTween"),f(t,d,e,g,c,b,i),h(a,"afterTween"),j(d,a._attachment,v)):u&&(j(g,a._attachment,v),a.stop(!0))}function j(a,b){var d={};return"string"==typeof b?c(a,function(a){d[a]=b}):c(a,function(a){d[a]||(d[a]=b[a]||n)}),d}function k(a,b){this._currentState=a||{},this._configured=!1,this._scheduleFunction=m,"undefined"!=typeof b&&this.setConfig(b)}var l,m,n="linear",o=500,p=1e3/60,q=Date.now?Date.now:function(){return+new Date},r="undefined"!=typeof SHIFTY_DEBUG_NOW?SHIFTY_DEBUG_NOW:q;m="undefined"!=typeof window?window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||window.mozCancelRequestAnimationFrame&&window.mozRequestAnimationFrame||setTimeout:setTimeout;var s,t,u,v;return k.prototype.tween=function(a){return this._isTweening?this:(void 0===a&&this._configured||this.setConfig(a),this._timestamp=r(),this._start(this.get(),this._attachment),this.resume())},k.prototype.setConfig=function(a){a=a||{},this._configured=!0,this._attachment=a.attachment,this._pausedAtTime=null,this._scheduleId=null,this._start=a.start||b,this._step=a.step||b,this._finish=a.finish||b,this._duration=a.duration||o,this._currentState=a.from||this.get(),this._originalState=this.get(),this._targetState=a.to||this.get();var c=this._currentState,d=this._targetState;return e(d,c),this._easing=j(c,a.easing||n),this._filterArgs=[c,this._originalState,d,this._easing],h(this,"tweenCreated"),this},k.prototype.get=function(){return d({},this._currentState)},k.prototype.set=function(a){this._currentState=a},k.prototype.pause=function(){return this._pausedAtTime=r(),this._isPaused=!0,this},k.prototype.resume=function(){this._isPaused&&(this._timestamp+=r()-this._pausedAtTime),this._isPaused=!1,this._isTweening=!0;var a=this;return this._timeoutHandler=function(){i(a,a._timestamp,a._duration,a._currentState,a._originalState,a._targetState,a._easing,a._step,a._scheduleFunction)},this._timeoutHandler(),this},k.prototype.seek=function(a){return this._timestamp=r()-a,this.isPlaying()||(this._isTweening=!0,this._isPaused=!1,i(this,this._timestamp,this._duration,this._currentState,this._originalState,this._targetState,this._easing,this._step,this._scheduleFunction),this._timeoutHandler(),this.pause()),this},k.prototype.stop=function(c){return this._isTweening=!1,this._isPaused=!1,this._timeoutHandler=b,(a.cancelAnimationFrame||a.webkitCancelAnimationFrame||a.oCancelAnimationFrame||a.msCancelAnimationFrame||a.mozCancelRequestAnimationFrame||a.clearTimeout)(this._scheduleId),c&&(d(this._currentState,this._targetState),h(this,"afterTweenEnd"),this._finish.call(this,this._currentState,this._attachment)),this},k.prototype.isPlaying=function(){return this._isTweening&&!this._isPaused},k.prototype.setScheduleFunction=function(a){this._scheduleFunction=a},k.prototype.dispose=function(){var a;for(a in this)this.hasOwnProperty(a)&&delete this[a]},k.prototype.filter={},k.prototype.formula={linear:function(a){return a}},l=k.prototype.formula,d(k,{now:r,each:c,tweenProps:f,tweenProp:g,applyFilter:h,shallowCopy:d,defaults:e,composeEasingObject:j}),"function"==typeof SHIFTY_DEBUG_NOW&&(a.timeoutHandler=i),"object"==typeof exports?module.exports=k:"function"==typeof define&&define.amd?define(function(){return k}):"undefined"==typeof a.Tweenable&&(a.Tweenable=k),k}();!function(){b.shallowCopy(b.prototype.formula,{easeInQuad:function(a){return Math.pow(a,2)},easeOutQuad:function(a){return-(Math.pow(a-1,2)-1)},easeInOutQuad:function(a){return(a/=.5)<1?.5*Math.pow(a,2):-.5*((a-=2)*a-2)},easeInCubic:function(a){return Math.pow(a,3)},easeOutCubic:function(a){return Math.pow(a-1,3)+1},easeInOutCubic:function(a){return(a/=.5)<1?.5*Math.pow(a,3):.5*(Math.pow(a-2,3)+2)},easeInQuart:function(a){return Math.pow(a,4)},easeOutQuart:function(a){return-(Math.pow(a-1,4)-1)},easeInOutQuart:function(a){return(a/=.5)<1?.5*Math.pow(a,4):-.5*((a-=2)*Math.pow(a,3)-2)},easeInQuint:function(a){return Math.pow(a,5)},easeOutQuint:function(a){return Math.pow(a-1,5)+1},easeInOutQuint:function(a){return(a/=.5)<1?.5*Math.pow(a,5):.5*(Math.pow(a-2,5)+2)},easeInSine:function(a){return-Math.cos(a*(Math.PI/2))+1},easeOutSine:function(a){return Math.sin(a*(Math.PI/2))},easeInOutSine:function(a){return-.5*(Math.cos(Math.PI*a)-1)},easeInExpo:function(a){return 0===a?0:Math.pow(2,10*(a-1))},easeOutExpo:function(a){return 1===a?1:-Math.pow(2,-10*a)+1},easeInOutExpo:function(a){return 0===a?0:1===a?1:(a/=.5)<1?.5*Math.pow(2,10*(a-1)):.5*(-Math.pow(2,-10*--a)+2)},easeInCirc:function(a){return-(Math.sqrt(1-a*a)-1)},easeOutCirc:function(a){return Math.sqrt(1-Math.pow(a-1,2))},easeInOutCirc:function(a){return(a/=.5)<1?-.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)},easeOutBounce:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},easeInBack:function(a){var b=1.70158;return a*a*((b+1)*a-b)},easeOutBack:function(a){var b=1.70158;return(a-=1)*a*((b+1)*a+b)+1},easeInOutBack:function(a){var b=1.70158;return(a/=.5)<1?.5*a*a*(((b*=1.525)+1)*a-b):.5*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},elastic:function(a){return-1*Math.pow(4,-8*a)*Math.sin(2*(6*a-1)*Math.PI/2)+1},swingFromTo:function(a){var b=1.70158;return(a/=.5)<1?.5*a*a*(((b*=1.525)+1)*a-b):.5*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},swingFrom:function(a){var b=1.70158;return a*a*((b+1)*a-b)},swingTo:function(a){var b=1.70158;return(a-=1)*a*((b+1)*a+b)+1},bounce:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},bouncePast:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?2-(7.5625*(a-=1.5/2.75)*a+.75):2.5/2.75>a?2-(7.5625*(a-=2.25/2.75)*a+.9375):2-(7.5625*(a-=2.625/2.75)*a+.984375)},easeFromTo:function(a){return(a/=.5)<1?.5*Math.pow(a,4):-.5*((a-=2)*Math.pow(a,3)-2)},easeFrom:function(a){return Math.pow(a,4)},easeTo:function(a){return Math.pow(a,.25)}})}(),function(){function a(a,b,c,d,e,f){function g(a){return((n*a+o)*a+p)*a}function h(a){return((q*a+r)*a+s)*a}function i(a){return(3*n*a+2*o)*a+p}function j(a){return 1/(200*a)}function k(a,b){return h(m(a,b))}function l(a){return a>=0?a:0-a}function m(a,b){var c,d,e,f,h,j;for(e=a,j=0;8>j;j++){if(f=g(e)-a,l(f)<b)return e;if(h=i(e),l(h)<1e-6)break;e-=f/h}if(c=0,d=1,e=a,c>e)return c;if(e>d)return d;for(;d>c;){if(f=g(e),l(f-a)<b)return e;a>f?c=e:d=e,e=.5*(d-c)+c}return e}var n=0,o=0,p=0,q=0,r=0,s=0;return p=3*b,o=3*(d-b)-p,n=1-p-o,s=3*c,r=3*(e-c)-s,q=1-s-r,k(a,j(f))}function c(b,c,d,e){return function(f){return a(f,b,c,d,e,1)}}b.setBezierFunction=function(a,d,e,f,g){var h=c(d,e,f,g);return h.x1=d,h.y1=e,h.x2=f,h.y2=g,b.prototype.formula[a]=h},b.unsetBezierFunction=function(a){delete b.prototype.formula[a]}}(),function(){function a(a,c,d,e,f){return b.tweenProps(e,c,a,d,1,0,f)}var c=new b;c._filterArgs=[],b.interpolate=function(d,e,f,g){var h=b.shallowCopy({},d),i=b.composeEasingObject(d,g||"linear");c.set({});var j=c._filterArgs;j.length=0,j[0]=h,j[1]=d,j[2]=e,j[3]=i,b.applyFilter(c,"tweenCreated"),b.applyFilter(c,"beforeTween");var k=a(d,h,e,f,i);return b.applyFilter(c,"afterTween"),k}}(),function(a){function b(a,b){B.length=0;var c,d=a.length;for(c=0;d>c;c++)B.push("_"+b+"_"+c);return B}function c(a){var b=a.match(v);return b?(1===b.length||a[0].match(u))&&b.unshift(""):b=["",""],b.join(A)}function d(b){a.each(b,function(a){var c=b[a];"string"==typeof c&&c.match(z)&&(b[a]=e(c))})}function e(a){return i(z,a,f)}function f(a){var b=g(a);return"rgb("+b[0]+","+b[1]+","+b[2]+")"}function g(a){return a=a.replace(/#/,""),3===a.length&&(a=a.split(""),a=a[0]+a[0]+a[1]+a[1]+a[2]+a[2]),C[0]=h(a.substr(0,2)),C[1]=h(a.substr(2,2)),C[2]=h(a.substr(4,2)),C}function h(a){return parseInt(a,16)}function i(a,b,c){var d=b.match(a),e=b.replace(a,A);if(d)for(var f,g=d.length,h=0;g>h;h++)f=d.shift(),e=e.replace(A,c(f));return e}function j(a){return i(x,a,k)}function k(a){for(var b=a.match(w),c=b.length,d=a.match(y)[0],e=0;c>e;e++)d+=parseInt(b[e],10)+",";return d=d.slice(0,-1)+")"}function l(d){var e={};return a.each(d,function(a){var f=d[a];if("string"==typeof f){var g=r(f);e[a]={formatString:c(f),chunkNames:b(g,a)}}}),e}function m(b,c){a.each(c,function(a){for(var d=b[a],e=r(d),f=e.length,g=0;f>g;g++)b[c[a].chunkNames[g]]=+e[g];delete b[a]})}function n(b,c){a.each(c,function(a){var d=b[a],e=o(b,c[a].chunkNames),f=p(e,c[a].chunkNames);d=q(c[a].formatString,f),b[a]=j(d)})}function o(a,b){for(var c,d={},e=b.length,f=0;e>f;f++)c=b[f],d[c]=a[c],delete a[c];return d}function p(a,b){D.length=0;for(var c=b.length,d=0;c>d;d++)D.push(a[b[d]]);return D}function q(a,b){for(var c=a,d=b.length,e=0;d>e;e++)c=c.replace(A,+b[e].toFixed(4));return c}function r(a){return a.match(w)}function s(b,c){a.each(c,function(a){for(var d=c[a],e=d.chunkNames,f=e.length,g=b[a].split(" "),h=g[g.length-1],i=0;f>i;i++)b[e[i]]=g[i]||h;delete b[a]})}function t(b,c){a.each(c,function(a){for(var d=c[a],e=d.chunkNames,f=e.length,g="",h=0;f>h;h++)g+=" "+b[e[h]],delete b[e[h]];b[a]=g.substr(1)})}var u=/(\d|\-|\.)/,v=/([^\-0-9\.]+)/g,w=/[0-9.\-]+/g,x=new RegExp("rgb\\("+w.source+/,\s*/.source+w.source+/,\s*/.source+w.source+"\\)","g"),y=/^.*\(/,z=/#([0-9]|[a-f]){3,6}/gi,A="VAL",B=[],C=[],D=[];a.prototype.filter.token={tweenCreated:function(a,b,c){d(a),d(b),d(c),this._tokenData=l(a)},beforeTween:function(a,b,c,d){s(d,this._tokenData),m(a,this._tokenData),m(b,this._tokenData),m(c,this._tokenData)},afterTween:function(a,b,c,d){n(a,this._tokenData),n(b,this._tokenData),n(c,this._tokenData),t(d,this._tokenData)}}}(b)}(window),window.Tweenable}),function(){"use strict";angular.module("angular-carousel").filter("carouselSlice",function(){return function(a,b,c){return angular.isArray(a)?a.slice(b,b+c):angular.isObject(a)?a:void 0}})}();

// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

/**
 * Angularjs-Google-Maps
 * @version v1.1.0 
 * @link https://github.com/allenhwkim/angularjs-google-maps
 * @author allenhwkim
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

var ngMap=angular.module("ngMap",[]);ngMap.service("Attr2Options",["$parse","NavigatorGeolocation","GeoCoder",function($parse,NavigatorGeolocation,GeoCoder){var SPECIAL_CHARS_REGEXP=/([\:\-\_]+(.))/g,MOZ_HACK_REGEXP=/^moz([A-Z])/,orgAttributes=function(e){e.length>0&&(e=e[0]);for(var t={},n=0;n<e.attributes.length;n++){var r=e.attributes[n];t[r.name]=r.value}return t},camelCase=function(e){return e.replace(SPECIAL_CHARS_REGEXP,function(e,t,n,r){return r?n.toUpperCase():n}).replace(MOZ_HACK_REGEXP,"Moz$1")},JSONize=function(e){try{return JSON.parse(e),e}catch(t){return e.replace(/([\$\w]+)\s*:/g,function(e,t){return'"'+t+'":'}).replace(/'([^']+)'/g,function(e,t){return'"'+t+'"'})}},toOptionValue=function(input,options){var output,key=options.key,scope=options.scope;try{var num=Number(input);if(isNaN(num))throw"Not a number";output=num}catch(err){try{if(input.match(/^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/)&&(input="["+input+"]"),output=JSON.parse(JSONize(input)),output instanceof Array){var t1stEl=output[0];if(t1stEl.constructor==Object);else if(t1stEl.constructor==Array)output=output.map(function(e){return new google.maps.LatLng(e[0],e[1])});else if(!isNaN(parseFloat(t1stEl))&&isFinite(t1stEl))return new google.maps.LatLng(output[0],output[1])}}catch(err2){if(input.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/))try{var exp="new google.maps."+input;output=eval(exp)}catch(e){output=input}else if(input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/))try{var matches=input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/);output=google.maps[matches[1]][matches[2]]}catch(e){output=input}else if(input.match(/^[A-Z]+$/))try{var capitalizedKey=key.charAt(0).toUpperCase()+key.slice(1);key.match(/temperatureUnit|windSpeedUnit|labelColor/)?(capitalizedKey=capitalizedKey.replace(/s$/,""),output=google.maps.weather[capitalizedKey][input]):output=google.maps[capitalizedKey][input]}catch(e){output=input}else output=input}}return output},setDelayedGeoLocation=function(e,t,n,r){r=r||{};var a=e.centered||r.centered,o=function(){var n=r.fallbackLocation||new google.maps.LatLng(0,0);e[t](n)};!n||n.match(/^current/i)?NavigatorGeolocation.getCurrentPosition().then(function(n){var r=n.coords.latitude,o=n.coords.longitude,i=new google.maps.LatLng(r,o);e[t](i),a&&e.map.setCenter(i)},o):GeoCoder.geocode({address:n}).then(function(n){e[t](n[0].geometry.location),a&&e.map.setCenter(n[0].geometry.location)},o)},getAttrsToObserve=function(e){var t=[];if(e["ng-repeat"]||e.ngRepeat);else for(var n in e){var r=e[n];r&&r.match(/\{\{.*\}\}/)&&t.push(camelCase(n))}return t},observeAttrSetObj=function(e,t,n){var r=getAttrsToObserve(e);Object.keys(r).length;for(var a=0;a<r.length;a++)observeAndSet(t,r[a],n)},observeAndSet=function(e,t,n){e.$observe(t,function(e){if(e){var r=camelCase("set-"+t),a=toOptionValue(e,{key:t});n[r]&&(t.match(/center|position/)&&"string"==typeof a?setDelayedGeoLocation(n,r,a):n[r](a))}})};return{filter:function(e){var t={};for(var n in e)n.match(/^\$/)||n.match(/^ng[A-Z]/)||(t[n]=e[n]);return t},getOptions:function(e,t){var n={};for(var r in e)if(e[r]){if(r.match(/^on[A-Z]/))continue;if(r.match(/ControlOptions$/))continue;n[r]=toOptionValue(e[r],{scope:t,key:r})}return n},getEvents:function(e,t){var n={},r=function(e){return"_"+e.toLowerCase()},a=function(t){var n=t.match(/([^\(]+)\(([^\)]*)\)/),r=n[1],a=n[2].replace(/event[ ,]*/,""),o=e.$eval("["+a+"]");return function(t){e[r].apply(this,[t].concat(o)),e.$apply()}};for(var o in t)if(t[o]){if(!o.match(/^on[A-Z]/))continue;var i=o.replace(/^on/,"");i=i.charAt(0).toLowerCase()+i.slice(1),i=i.replace(/([A-Z])/g,r);var s=t[o];n[i]=new a(s)}return n},getControlOptions:function(e){var t={};if("object"!=typeof e)return!1;for(var n in e)if(e[n]){if(!n.match(/(.*)ControlOptions$/))continue;var r=e[n],a=r.replace(/'/g,'"');a=a.replace(/([^"]+)|("[^"]+")/g,function(e,t,n){return t?t.replace(/([a-zA-Z0-9]+?):/g,'"$1":'):n});try{var o=JSON.parse(a);for(var i in o)if(o[i]){var s=o[i];if("string"==typeof s?s=s.toUpperCase():"mapTypeIds"===i&&(s=s.map(function(e){return e.match(/^[A-Z]+$/)?google.maps.MapTypeId[e.toUpperCase()]:e})),"style"===i){var p=n.charAt(0).toUpperCase()+n.slice(1),c=p.replace(/Options$/,"")+"Style";o[i]=google.maps[c][s]}else o[i]="position"===i?google.maps.ControlPosition[s]:s}t[n]=o}catch(l){}}return t},toOptionValue:toOptionValue,camelCase:camelCase,setDelayedGeoLocation:setDelayedGeoLocation,getAttrsToObserve:getAttrsToObserve,observeAndSet:observeAndSet,observeAttrSetObj:observeAttrSetObj,orgAttributes:orgAttributes}}]),ngMap.service("GeoCoder",["$q",function(e){return{geocode:function(t){var n=e.defer(),r=new google.maps.Geocoder;return r.geocode(t,function(e,t){t==google.maps.GeocoderStatus.OK?n.resolve(e):n.reject("Geocoder failed due to: "+t)}),n.promise}}}]),ngMap.service("NavigatorGeolocation",["$q",function(e){return{getCurrentPosition:function(){var t=e.defer();return navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){t.resolve(e)},function(e){t.reject(e)}):t.reject("Browser Geolocation service failed."),t.promise},watchPosition:function(){return"TODO"},clearWatch:function(){return"TODO"}}}]),ngMap.service("StreetView",["$q",function(e){return{getPanorama:function(t,n){n=n||t.getCenter();var r=e.defer(),a=new google.maps.StreetViewService;return a.getPanoramaByLocation(n||t.getCenter,100,function(e,t){t===google.maps.StreetViewStatus.OK?r.resolve(e.location.pano):r.resolve(!1)}),r.promise},setPanorama:function(e,t){var n=new google.maps.StreetViewPanorama(e.getDiv(),{enableCloseButton:!0});n.setPano(t)}}}]),ngMap.directive("bicyclingLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.BicyclingLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=n(p,c);o.addObject("bicyclingLayers",l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("cloudLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.weather.CloudLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=n(p,c);o.addObject("cloudLayers",l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("customControl",["Attr2Options","$compile",function(e,t){var n=e;return{restrict:"E",require:"^map",link:function(e,r,a,o){r.css("display","none");var i=(n.orgAttributes(r),n.filter(a)),s=n.getOptions(i,e),p=n.getEvents(e,i),c=t(r.html().trim())(e),l=c[0];for(var u in p)google.maps.event.addDomListener(l,u,p[u]);o.addObject("customControls",l),e.$on("mapInitialized",function(e,t){var n=s.position;t.controls[google.maps.ControlPosition[n]].push(l)})}}}]),ngMap.directive("dynamicMapsEngineLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.visualization.DynamicMapsEngineLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.filter(a),s=t.getOptions(i),p=t.getEvents(e,i,p),c=n(s,p);o.addObject("mapsEngineLayers",c)}}}]),ngMap.directive("fusionTablesLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.FusionTablesLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.filter(a),s=t.getOptions(i),p=t.getEvents(e,i,p),c=n(s,p);o.addObject("fusionTablesLayers",c)}}}]),ngMap.directive("heatmapLayer",["Attr2Options","$window",function(e,t){var n=e;return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=n.filter(a),s=n.getOptions(i);if(s.data=t[a.data]||e[a.data],!(s.data instanceof Array))throw"invalid heatmap data";s.data=new google.maps.MVCArray(s.data);{var p=new google.maps.visualization.HeatmapLayer(s);n.getEvents(e,i)}o.addObject("heatmapLayers",p)}}}]),ngMap.directive("infoWindow",["Attr2Options","$compile",function(e,t){var n=e,r=function(e,t){var r;if(e.position instanceof google.maps.LatLng)r=new google.maps.InfoWindow(e);else{var a=e.position;e.position=new google.maps.LatLng(0,0),r=new google.maps.InfoWindow(e),n.setDelayedGeoLocation(r,"setPosition",a)}Object.keys(t).length>0;for(var o in t)o&&google.maps.event.addListener(r,o,t[o]);return r};return{restrict:"E",require:"^map",link:function(e,a,o,i){a.css("display","none");var s=n.orgAttributes(a),p=n.filter(o),c=n.getOptions(p,e),l=n.getEvents(e,p),u=a.html().trim();if(1!=angular.element(u).length)throw"info-window working as a template must have a container";var g=r(c,l);g.template=u.replace(/ng-non-/,""),i.addObject("infoWindows",g),n.observeAttrSetObj(s,o,g),e.showInfoWindow=e.showInfoWindow||function(t,n,r){var a=i.map.infoWindows[n],o=a.template.trim(),s=o.replace(/{{([^}]+)}}/g,function(t,n){return e.$eval(n)});a.setContent(s),r?(a.setPosition(r),a.open(i.map)):this.getPosition?a.open(i.map,this):a.open(i.map)},g.visible&&e.$on("mapInitialized",function(){var n=t(g.template)(e);g.setContent(n.html()),g.open(i.map)}),g.visibleOnMarker&&e.$on("mapInitialized",function(){var n=i.map.markers[g.visibleOnMarker];if(!n)throw"Invalid marker id";var r=t(g.template)(e);g.setContent(r.html()),g.open(i.map,n)})}}}]),ngMap.directive("kmlLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.KmlLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=n(p,c);o.addObject("kmlLayers",l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("mapData",["Attr2Options",function(e){var t=e;return{restrict:"E",require:"^map",link:function(e,n,r){var a=t.filter(r),o=t.getOptions(a),i=t.getEvents(e,a,i);e.$on("mapInitialized",function(t,n){for(var r in o)if(r){var a=o[r];"function"==typeof e[a]?n.data[r](e[a]):n.data[r](a)}for(var s in i)i[s]&&n.data.addListener(s,i[s])})}}}]),ngMap.directive("mapType",["Attr2Options","$window",function(e,t){return{restrict:"E",require:"^map",link:function(e,n,r,a){var o,i=r.name;if(!i)throw"invalid map-type name";if(r.object){var s=e[r.object]?e:t;o=s[r.object],"function"==typeof o&&(o=new o)}if(!o)throw"invalid map-type object";e.$on("mapInitialized",function(e,t){t.mapTypes.set(i,o)}),a.addObject("mapTypes",o)}}}]),ngMap.directive("map",["Attr2Options","$timeout",function(e,t){function n(e,t){if(e.currentStyle)var n=e.currentStyle[t];else if(window.getComputedStyle)var n=document.defaultView.getComputedStyle(e,null).getPropertyValue(t);return n}var r=e;return{restrict:"AE",controller:ngMap.MapController,link:function(a,o,i,s){var p=r.orgAttributes(o);a.google=google;var c=document.createElement("div");c.style.width="100%",c.style.height="100%",o.prepend(c),"block"!=n(o[0],"display")&&o.css("display","block"),n(o[0],"height").match(/^0/)&&o.css("height","300px");var l=function(n,o){var l=new google.maps.Map(c,{});l.markers={},l.shapes={},t(function(){google.maps.event.trigger(l,"resize")}),n.zoom=n.zoom||15;var u=n.center;u instanceof google.maps.LatLng||(delete n.center,e.setDelayedGeoLocation(l,"setCenter",u,g.geoFallbackCenter)),l.setOptions(n);for(var m in o)m&&google.maps.event.addListener(l,m,o[m]);r.observeAttrSetObj(p,i,l),s.map=l,s.addObjects(s._objects),a.map=l,a.map.scope=a,a.$emit("mapInitialized",l),a.maps=a.maps||{},a.maps[g.id||Object.keys(a.maps).length]=l,a.$emit("mapsInitialized",a.maps)},u=r.filter(i),g=r.getOptions(u,a),m=r.getControlOptions(u),v=angular.extend(g,m),f=r.getEvents(a,u);i.initEvent?a.$on(i.initEvent,function(){!s.map&&l(v,f)}):l(v,f)}}}]),ngMap.MapController=function(){this.map=null,this._objects=[],this.addMarker=function(e){if(this.map){this.map.markers=this.map.markers||{},e.setMap(this.map),e.centered&&this.map.setCenter(e.position);var t=Object.keys(this.map.markers).length;this.map.markers[e.id||t]=e}else this._objects.push(e)},this.addShape=function(e){if(this.map){this.map.shapes=this.map.shapes||{},e.setMap(this.map);var t=Object.keys(this.map.shapes).length;this.map.shapes[e.id||t]=e}else this._objects.push(e)},this.addObject=function(e,t){if(this.map){this.map[e]=this.map[e]||{};var n=Object.keys(this.map[e]).length;this.map[e][t.id||n]=t,"infoWindows"!=e&&t.setMap&&t.setMap(this.map)}else t.groupName=e,this._objects.push(t)},this.addObjects=function(e){for(var t=0;t<e.length;t++){var n=e[t];n instanceof google.maps.Marker?this.addMarker(n):n instanceof google.maps.Circle||n instanceof google.maps.Polygon||n instanceof google.maps.Polyline||n instanceof google.maps.Rectangle||n instanceof google.maps.GroundOverlay?this.addShape(n):this.addObject(n.groupName,n)}}},ngMap.directive("mapsEngineLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.visualization.MapsEngineLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.filter(a),s=t.getOptions(i),p=t.getEvents(e,i,p),c=n(s,p);o.addObject("mapsEngineLayers",c)}}}]),ngMap.directive("marker",["Attr2Options",function(e){var t=e,n=function(e,n){var r;if(e.icon instanceof Object){(""+e.icon.path).match(/^[A-Z_]+$/)&&(e.icon.path=google.maps.SymbolPath[e.icon.path]);for(var a in e.icon){var o=e.icon[a];"anchor"==a||"origin"==a?e.icon[a]=new google.maps.Point(o[0],o[1]):("size"==a||"scaledSize"==a)&&(e.icon[a]=new google.maps.Size(o[0],o[1]))}}if(e.position instanceof google.maps.LatLng)r=new google.maps.Marker(e);else{var i=e.position;e.position=new google.maps.LatLng(0,0),r=new google.maps.Marker(e),t.setDelayedGeoLocation(r,"setPosition",i)}Object.keys(n).length>0;for(var s in n)s&&google.maps.event.addListener(r,s,n[s]);return r};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s,e),c=t.getEvents(e,s);r.bind("$destroy",function(){var e=l.map.markers;for(var t in e)e[t]==l&&delete e[t];l.setMap(null)});var l=n(p,c);o.addMarker(l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("overlayMapType",["Attr2Options","$window",function(e,t){return{restrict:"E",require:"^map",link:function(e,n,r,a){var o,i=r.initMethod||"insertAt";if(r.object){var s=e[r.object]?e:t;o=s[r.object],"function"==typeof o&&(o=new o)}if(!o)throw"invalid map-type object";e.$on("mapInitialized",function(e,t){if("insertAt"==i){var n=parseInt(r.index,10);t.overlayMapTypes.insertAt(n,o)}else"push"==i&&t.overlayMapTypes.push(o)}),a.addObject("overlayMapTypes",o)}}}]),ngMap.directive("shape",["Attr2Options",function(e){var t=e,n=function(e){return new google.maps.LatLngBounds(e[0],e[1])},r=function(e,r){var a,o=e.name;if(delete e.name,e.icons)for(var i=0;i<e.icons.length;i++){var s=e.icons[i];s.icon.path.match(/^[A-Z_]+$/)&&(s.icon.path=google.maps.SymbolPath[s.icon.path])}switch(o){case"circle":if(e.center instanceof google.maps.LatLng)a=new google.maps.Circle(e);else{var p=e.center;e.center=new google.maps.LatLng(0,0),a=new google.maps.Circle(e),t.setDelayedGeoLocation(a,"setCenter",p)}break;case"polygon":a=new google.maps.Polygon(e);break;case"polyline":a=new google.maps.Polyline(e);break;case"rectangle":e.bounds&&(e.bounds=n(e.bounds)),a=new google.maps.Rectangle(e);break;case"groundOverlay":case"image":var c=e.url,l=n(e.bounds),u={opacity:e.opacity,clickable:e.clickable,id:e.id};a=new google.maps.GroundOverlay(c,l,u)}for(var g in r)r[g]&&google.maps.event.addListener(a,g,r[g]);return a};return{restrict:"E",require:"^map",link:function(e,n,a,o){var i=t.orgAttributes(n),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=r(p,c);o.addShape(l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("trafficLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.TrafficLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=n(p,c);o.addObject("trafficLayers",l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("transitLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.TransitLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=n(p,c);o.addObject("transitLayers",l),t.observeAttrSetObj(i,a,l)}}}]),ngMap.directive("weatherLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.weather.WeatherLayer(e);for(var r in t)google.maps.event.addListener(n,r,t[r]);return n};return{restrict:"E",require:"^map",link:function(e,r,a,o){var i=t.orgAttributes(r),s=t.filter(a),p=t.getOptions(s),c=t.getEvents(e,s),l=n(p,c);o.addObject("weatherLayers",l),t.observeAttrSetObj(i,a,l)}}}]);