"use strict";
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.CodeMirror=t()}(this,function(){"use strict";var e=navigator.userAgent,t=navigator.platform,r=/gecko\/\d/i.test(e),n=/MSIE \d/.test(e),i=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e),o=/Edge\/(\d+)/.exec(e),l=n||i||o,s=l&&(n?document.documentMode||6:+(o||i)[1]),a=!o&&/WebKit\//.test(e),u=a&&/Qt\/\d+\.\d+/.test(e),c=!o&&/Chrome\//.test(e),h=/Opera\//.test(e),f=/Apple Computer/.test(navigator.vendor),d=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e),p=/PhantomJS/.test(e),g=!o&&/AppleWebKit/.test(e)&&/Mobile\/\w+/.test(e),v=/Android/.test(e),m=g||v||/webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e),y=g||/Mac/.test(t),b=/\bCrOS\b/.test(e),w=/win/i.test(t),x=h&&e.match(/Version\/(\d*\.\d*)/);x&&(x=Number(x[1])),x&&x>=15&&(h=!1,a=!0);var C=y&&(u||h&&(null==x||x<12.11)),S=r||l&&s>=9;function L(e){return new RegExp("(^|\\s)"+e+"(?:$|\\s)\\s*")}var k,T=function(e,t){var r=e.className,n=L(t).exec(r);if(n){var i=r.slice(n.index+n[0].length);e.className=r.slice(0,n.index)+(i?n[1]+i:"")}};function M(e){for(var t=e.childNodes.length;t>0;--t)e.removeChild(e.firstChild);return e}function N(e,t){return M(e).appendChild(t)}function O(e,t,r,n){var i=document.createElement(e);if(r&&(i.className=r),n&&(i.style.cssText=n),"string"==typeof t)i.appendChild(document.createTextNode(t));else if(t)for(var o=0;o<t.length;++o)i.appendChild(t[o]);return i}function A(e,t,r,n){var i=O(e,t,r,n);return i.setAttribute("role","presentation"),i}function D(e,t){if(3==t.nodeType&&(t=t.parentNode),e.contains)return e.contains(t);do{if(11==t.nodeType&&(t=t.host),t==e)return!0}while(t=t.parentNode)}function W(){var e;try{e=document.activeElement}catch(t){e=document.body||null}for(;e&&e.shadowRoot&&e.shadowRoot.activeElement;)e=e.shadowRoot.activeElement;return e}function H(e,t){var r=e.className;L(t).test(r)||(e.className+=(r?" ":"")+t)}function F(e,t){for(var r=e.split(" "),n=0;n<r.length;n++)r[n]&&!L(r[n]).test(t)&&(t+=" "+r[n]);return t}k=document.createRange?function(e,t,r,n){var i=document.createRange();return i.setEnd(n||e,r),i.setStart(e,t),i}:function(e,t,r){var n=document.body.createTextRange();try{n.moveToElementText(e.parentNode)}catch(e){return n}return n.collapse(!0),n.moveEnd("character",r),n.moveStart("character",t),n};var P=function(e){e.select()};function E(e){var t=Array.prototype.slice.call(arguments,1);return function(){return e.apply(null,t)}}function I(e,t,r){for(var n in t||(t={}),e)!e.hasOwnProperty(n)||!1===r&&t.hasOwnProperty(n)||(t[n]=e[n]);return t}function z(e,t,r,n,i){null==t&&-1==(t=e.search(/[^\s\u00a0]/))&&(t=e.length);for(var o=n||0,l=i||0;;){var s=e.indexOf("\t",o);if(s<0||s>=t)return l+(t-o);l+=s-o,l+=r-l%r,o=s+1}}g?P=function(e){e.selectionStart=0,e.selectionEnd=e.value.length}:l&&(P=function(e){try{e.select()}catch(e){}});var R=function(){this.id=null};function B(e,t){for(var r=0;r<e.length;++r)if(e[r]==t)return r;return-1}R.prototype.set=function(e,t){clearTimeout(this.id),this.id=setTimeout(t,e)};var G=30,U={toString:function(){return"CodeMirror.Pass"}},V={scroll:!1},K={origin:"*mouse"},j={origin:"+move"};function X(e,t,r){for(var n=0,i=0;;){var o=e.indexOf("\t",n);-1==o&&(o=e.length);var l=o-n;if(o==e.length||i+l>=t)return n+Math.min(l,t-i);if(i+=o-n,n=o+1,(i+=r-i%r)>=t)return n}}var Y=[""];function _(e){for(;Y.length<=e;)Y.push($(Y)+" ");return Y[e]}function $(e){return e[e.length-1]}function q(e,t){for(var r=[],n=0;n<e.length;n++)r[n]=t(e[n],n);return r}function Z(){}function Q(e,t){var r;return Object.create?r=Object.create(e):(Z.prototype=e,r=new Z),t&&I(t,r),r}var J=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;function ee(e){return/\w/.test(e)||e>"\x80"&&(e.toUpperCase()!=e.toLowerCase()||J.test(e))}function te(e,t){return t?!!(t.source.indexOf("\\w")>-1&&ee(e))||t.test(e):ee(e)}function re(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!1;return!0}var ne=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;function ie(e){return e.charCodeAt(0)>=768&&ne.test(e)}function oe(e,t,r){for(;(r<0?t>0:t<e.length)&&ie(e.charAt(t));)t+=r;return t}function le(e,t,r){for(var n=t>r?-1:1;;){if(t==r)return t;var i=(t+r)/2,o=n<0?Math.ceil(i):Math.floor(i);if(o==t)return e(o)?t:r;e(o)?r=o:t=o+n}}function se(e,t){if((t-=e.first)<0||t>=e.size)throw new Error("There is no line "+(t+e.first)+" in the document.");for(var r=e;!r.lines;)for(var n=0;;++n){var i=r.children[n],o=i.chunkSize();if(t<o){r=i;break}t-=o}return r.lines[t]}function ae(e,t,r){var n=[],i=t.line;return e.iter(t.line,r.line+1,function(e){var o=e.text;i==r.line&&(o=o.slice(0,r.ch)),i==t.line&&(o=o.slice(t.ch)),n.push(o),++i}),n}function ue(e,t,r){var n=[];return e.iter(t,r,function(e){n.push(e.text)}),n}function ce(e,t){var r=t-e.height;if(r)for(var n=e;n;n=n.parent)n.height+=r}function he(e){if(null==e.parent)return null;for(var t=e.parent,r=B(t.lines,e),n=t.parent;n;t=n,n=n.parent)for(var i=0;n.children[i]!=t;++i)r+=n.children[i].chunkSize();return r+t.first}function fe(e,t){var r=e.first;e:do{for(var n=0;n<e.children.length;++n){var i=e.children[n],o=i.height;if(t<o){e=i;continue e}t-=o,r+=i.chunkSize()}return r}while(!e.lines);for(var l=0;l<e.lines.length;++l){var s=e.lines[l].height;if(t<s)break;t-=s}return r+l}function de(e,t){return t>=e.first&&t<e.first+e.size}function pe(e,t){return String(e.lineNumberFormatter(t+e.firstLineNumber))}function ge(e,t,r){if(void 0===r&&(r=null),!(this instanceof ge))return new ge(e,t,r);this.line=e,this.ch=t,this.sticky=r}function ve(e,t){return e.line-t.line||e.ch-t.ch}function me(e,t){return e.sticky==t.sticky&&0==ve(e,t)}function ye(e){return ge(e.line,e.ch)}function be(e,t){return ve(e,t)<0?t:e}function we(e,t){return ve(e,t)<0?e:t}function xe(e,t){return Math.max(e.first,Math.min(t,e.first+e.size-1))}function Ce(e,t){if(t.line<e.first)return ge(e.first,0);var r=e.first+e.size-1;return t.line>r?ge(r,se(e,r).text.length):function(e,t){var r=e.ch;return null==r||r>t?ge(e.line,t):r<0?ge(e.line,0):e}(t,se(e,t.line).text.length)}function Se(e,t){for(var r=[],n=0;n<t.length;n++)r[n]=Ce(e,t[n]);return r}var Le=!1,ke=!1;function Te(e,t,r){this.marker=e,this.from=t,this.to=r}function Me(e,t){if(e)for(var r=0;r<e.length;++r){var n=e[r];if(n.marker==t)return n}}function Ne(e,t){for(var r,n=0;n<e.length;++n)e[n]!=t&&(r||(r=[])).push(e[n]);return r}function Oe(e,t){if(t.full)return null;var r=de(e,t.from.line)&&se(e,t.from.line).markedSpans,n=de(e,t.to.line)&&se(e,t.to.line).markedSpans;if(!r&&!n)return null;var i=t.from.ch,o=t.to.ch,l=0==ve(t.from,t.to),s=function(e,t,r){var n;if(e)for(var i=0;i<e.length;++i){var o=e[i],l=o.marker;if(null==o.from||(l.inclusiveLeft?o.from<=t:o.from<t)||o.from==t&&"bookmark"==l.type&&(!r||!o.marker.insertLeft)){var s=null==o.to||(l.inclusiveRight?o.to>=t:o.to>t);(n||(n=[])).push(new Te(l,o.from,s?null:o.to))}}return n}(r,i,l),a=function(e,t,r){var n;if(e)for(var i=0;i<e.length;++i){var o=e[i],l=o.marker;if(null==o.to||(l.inclusiveRight?o.to>=t:o.to>t)||o.from==t&&"bookmark"==l.type&&(!r||o.marker.insertLeft)){var s=null==o.from||(l.inclusiveLeft?o.from<=t:o.from<t);(n||(n=[])).push(new Te(l,s?null:o.from-t,null==o.to?null:o.to-t))}}return n}(n,o,l),u=1==t.text.length,c=$(t.text).length+(u?i:0);if(s)for(var h=0;h<s.length;++h){var f=s[h];if(null==f.to){var d=Me(a,f.marker);d?u&&(f.to=null==d.to?null:d.to+c):f.to=i}}if(a)for(var p=0;p<a.length;++p){var g=a[p];if(null!=g.to&&(g.to+=c),null==g.from)Me(s,g.marker)||(g.from=c,u&&(s||(s=[])).push(g));else g.from+=c,u&&(s||(s=[])).push(g)}s&&(s=Ae(s)),a&&a!=s&&(a=Ae(a));var v=[s];if(!u){var m,y=t.text.length-2;if(y>0&&s)for(var b=0;b<s.length;++b)null==s[b].to&&(m||(m=[])).push(new Te(s[b].marker,null,null));for(var w=0;w<y;++w)v.push(m);v.push(a)}return v}function Ae(e){for(var t=0;t<e.length;++t){var r=e[t];null!=r.from&&r.from==r.to&&!1!==r.marker.clearWhenEmpty&&e.splice(t--,1)}return e.length?e:null}function De(e){var t=e.markedSpans;if(t){for(var r=0;r<t.length;++r)t[r].marker.detachLine(e);e.markedSpans=null}}function We(e,t){if(t){for(var r=0;r<t.length;++r)t[r].marker.attachLine(e);e.markedSpans=t}}function He(e){return e.inclusiveLeft?-1:0}function Fe(e){return e.inclusiveRight?1:0}function Pe(e,t){var r=e.lines.length-t.lines.length;if(0!=r)return r;var n=e.find(),i=t.find(),o=ve(n.from,i.from)||He(e)-He(t);if(o)return-o;var l=ve(n.to,i.to)||Fe(e)-Fe(t);return l||t.id-e.id}function Ee(e,t){var r,n=ke&&e.markedSpans;if(n)for(var i=void 0,o=0;o<n.length;++o)(i=n[o]).marker.collapsed&&null==(t?i.from:i.to)&&(!r||Pe(r,i.marker)<0)&&(r=i.marker);return r}function Ie(e){return Ee(e,!0)}function ze(e){return Ee(e,!1)}function Re(e,t){var r,n=ke&&e.markedSpans;if(n)for(var i=0;i<n.length;++i){var o=n[i];o.marker.collapsed&&(null==o.from||o.from<t)&&(null==o.to||o.to>t)&&(!r||Pe(r,o.marker)<0)&&(r=o.marker)}return r}function Be(e,t,r,n,i){var o=se(e,t),l=ke&&o.markedSpans;if(l)for(var s=0;s<l.length;++s){var a=l[s];if(a.marker.collapsed){var u=a.marker.find(0),c=ve(u.from,r)||He(a.marker)-He(i),h=ve(u.to,n)||Fe(a.marker)-Fe(i);if(!(c>=0&&h<=0||c<=0&&h>=0)&&(c<=0&&(a.marker.inclusiveRight&&i.inclusiveLeft?ve(u.to,r)>=0:ve(u.to,r)>0)||c>=0&&(a.marker.inclusiveRight&&i.inclusiveLeft?ve(u.from,n)<=0:ve(u.from,n)<0)))return!0}}}function Ge(e){for(var t;t=Ie(e);)e=t.find(-1,!0).line;return e}function Ue(e,t){var r=se(e,t),n=Ge(r);return r==n?t:he(n)}function Ve(e,t){if(t>e.lastLine())return t;var r,n=se(e,t);if(!Ke(e,n))return t;for(;r=ze(n);)n=r.find(1,!0).line;return he(n)+1}function Ke(e,t){var r=ke&&t.markedSpans;if(r)for(var n=void 0,i=0;i<r.length;++i)if((n=r[i]).marker.collapsed){if(null==n.from)return!0;if(!n.marker.widgetNode&&0==n.from&&n.marker.inclusiveLeft&&je(e,t,n))return!0}}function je(e,t,r){if(null==r.to){var n=r.marker.find(1,!0);return je(e,n.line,Me(n.line.markedSpans,r.marker))}if(r.marker.inclusiveRight&&r.to==t.text.length)return!0;for(var i=void 0,o=0;o<t.markedSpans.length;++o)if((i=t.markedSpans[o]).marker.collapsed&&!i.marker.widgetNode&&i.from==r.to&&(null==i.to||i.to!=r.from)&&(i.marker.inclusiveLeft||r.marker.inclusiveRight)&&je(e,t,i))return!0}function Xe(e){for(var t=0,r=(e=Ge(e)).parent,n=0;n<r.lines.length;++n){var i=r.lines[n];if(i==e)break;t+=i.height}for(var o=r.parent;o;o=(r=o).parent)for(var l=0;l<o.children.length;++l){var s=o.children[l];if(s==r)break;t+=s.height}return t}function Ye(e){if(0==e.height)return 0;for(var t,r=e.text.length,n=e;t=Ie(n);){var i=t.find(0,!0);n=i.from.line,r+=i.from.ch-i.to.ch}for(n=e;t=ze(n);){var o=t.find(0,!0);r-=n.text.length-o.from.ch,r+=(n=o.to.line).text.length-o.to.ch}return r}function _e(e){var t=e.display,r=e.doc;t.maxLine=se(r,r.first),t.maxLineLength=Ye(t.maxLine),t.maxLineChanged=!0,r.iter(function(e){var r=Ye(e);r>t.maxLineLength&&(t.maxLineLength=r,t.maxLine=e)})}var $e=null;function qe(e,t,r){var n;$e=null;for(var i=0;i<e.length;++i){var o=e[i];if(o.from<t&&o.to>t)return i;o.to==t&&(o.from!=o.to&&"before"==r?n=i:$e=i),o.from==t&&(o.from!=o.to&&"before"!=r?n=i:$e=i)}return null!=n?n:$e}var Ze=function(){var e="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",t="nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";var r=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,n=/[stwN]/,i=/[LRr]/,o=/[Lb1n]/,l=/[1n]/;function s(e,t,r){this.level=e,this.from=t,this.to=r}return function(a,u){var c="ltr"==u?"L":"R";if(0==a.length||"ltr"==u&&!r.test(a))return!1;for(var h,f=a.length,d=[],p=0;p<f;++p)d.push((h=a.charCodeAt(p))<=247?e.charAt(h):1424<=h&&h<=1524?"R":1536<=h&&h<=1785?t.charAt(h-1536):1774<=h&&h<=2220?"r":8192<=h&&h<=8203?"w":8204==h?"b":"L");for(var g=0,v=c;g<f;++g){var m=d[g];"m"==m?d[g]=v:v=m}for(var y=0,b=c;y<f;++y){var w=d[y];"1"==w&&"r"==b?d[y]="n":i.test(w)&&(b=w,"r"==w&&(d[y]="R"))}for(var x=1,C=d[0];x<f-1;++x){var S=d[x];"+"==S&&"1"==C&&"1"==d[x+1]?d[x]="1":","!=S||C!=d[x+1]||"1"!=C&&"n"!=C||(d[x]=C),C=S}for(var L=0;L<f;++L){var k=d[L];if(","==k)d[L]="N";else if("%"==k){var T=void 0;for(T=L+1;T<f&&"%"==d[T];++T);for(var M=L&&"!"==d[L-1]||T<f&&"1"==d[T]?"1":"N",N=L;N<T;++N)d[N]=M;L=T-1}}for(var O=0,A=c;O<f;++O){var D=d[O];"L"==A&&"1"==D?d[O]="L":i.test(D)&&(A=D)}for(var W=0;W<f;++W)if(n.test(d[W])){var H=void 0;for(H=W+1;H<f&&n.test(d[H]);++H);for(var F="L"==(W?d[W-1]:c),P=F==("L"==(H<f?d[H]:c))?F?"L":"R":c,E=W;E<H;++E)d[E]=P;W=H-1}for(var I,z=[],R=0;R<f;)if(o.test(d[R])){var B=R;for(++R;R<f&&o.test(d[R]);++R);z.push(new s(0,B,R))}else{var G=R,U=z.length;for(++R;R<f&&"L"!=d[R];++R);for(var V=G;V<R;)if(l.test(d[V])){G<V&&z.splice(U,0,new s(1,G,V));var K=V;for(++V;V<R&&l.test(d[V]);++V);z.splice(U,0,new s(2,K,V)),G=V}else++V;G<R&&z.splice(U,0,new s(1,G,R))}return"ltr"==u&&(1==z[0].level&&(I=a.match(/^\s+/))&&(z[0].from=I[0].length,z.unshift(new s(0,0,I[0].length))),1==$(z).level&&(I=a.match(/\s+$/))&&($(z).to-=I[0].length,z.push(new s(0,f-I[0].length,f)))),"rtl"==u?z.reverse():z}}();function Qe(e,t){var r=e.order;return null==r&&(r=e.order=Ze(e.text,t)),r}var Je=[],et=function(e,t,r){if(e.addEventListener)e.addEventListener(t,r,!1);else if(e.attachEvent)e.attachEvent("on"+t,r);else{var n=e._handlers||(e._handlers={});n[t]=(n[t]||Je).concat(r)}};function tt(e,t){return e._handlers&&e._handlers[t]||Je}function rt(e,t,r){if(e.removeEventListener)e.removeEventListener(t,r,!1);else if(e.detachEvent)e.detachEvent("on"+t,r);else{var n=e._handlers,i=n&&n[t];if(i){var o=B(i,r);o>-1&&(n[t]=i.slice(0,o).concat(i.slice(o+1)))}}}function nt(e,t){var r=tt(e,t);if(r.length)for(var n=Array.prototype.slice.call(arguments,2),i=0;i<r.length;++i)r[i].apply(null,n)}function it(e,t,r){return"string"==typeof t&&(t={type:t,preventDefault:function(){this.defaultPrevented=!0}}),nt(e,r||t.type,e,t),ct(t)||t.codemirrorIgnore}function ot(e){var t=e._handlers&&e._handlers.cursorActivity;if(t)for(var r=e.curOp.cursorActivityHandlers||(e.curOp.cursorActivityHandlers=[]),n=0;n<t.length;++n)-1==B(r,t[n])&&r.push(t[n])}function lt(e,t){return tt(e,t).length>0}function st(e){e.prototype.on=function(e,t){et(this,e,t)},e.prototype.off=function(e,t){rt(this,e,t)}}function at(e){e.preventDefault?e.preventDefault():e.returnValue=!1}function ut(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0}function ct(e){return null!=e.defaultPrevented?e.defaultPrevented:0==e.returnValue}function ht(e){at(e),ut(e)}function ft(e){return e.target||e.srcElement}function dt(e){var t=e.which;return null==t&&(1&e.button?t=1:2&e.button?t=3:4&e.button&&(t=2)),y&&e.ctrlKey&&1==t&&(t=3),t}var pt,gt,vt=function(){if(l&&s<9)return!1;var e=O("div");return"draggable"in e||"dragDrop"in e}();function mt(e){if(null==pt){var t=O("span","\u200b");N(e,O("span",[t,document.createTextNode("x")])),0!=e.firstChild.offsetHeight&&(pt=t.offsetWidth<=1&&t.offsetHeight>2&&!(l&&s<8))}var r=pt?O("span","\u200b"):O("span","\xa0",null,"display: inline-block; width: 1px; margin-right: -1px");return r.setAttribute("cm-text",""),r}function yt(e){if(null!=gt)return gt;var t=N(e,document.createTextNode("A\u062eA")),r=k(t,0,1).getBoundingClientRect(),n=k(t,1,2).getBoundingClientRect();return M(e),!(!r||r.left==r.right)&&(gt=n.right-r.right<3)}var bt,wt=3!="\n\nb".split(/\n/).length?function(e){for(var t=0,r=[],n=e.length;t<=n;){var i=e.indexOf("\n",t);-1==i&&(i=e.length);var o=e.slice(t,"\r"==e.charAt(i-1)?i-1:i),l=o.indexOf("\r");-1!=l?(r.push(o.slice(0,l)),t+=l+1):(r.push(o),t=i+1)}return r}:function(e){return e.split(/\r\n?|\n/)},xt=window.getSelection?function(e){try{return e.selectionStart!=e.selectionEnd}catch(e){return!1}}:function(e){var t;try{t=e.ownerDocument.selection.createRange()}catch(e){}return!(!t||t.parentElement()!=e)&&0!=t.compareEndPoints("StartToEnd",t)},Ct="oncopy"in(bt=O("div"))||(bt.setAttribute("oncopy","return;"),"function"==typeof bt.oncopy),St=null;var Lt={},kt={};function Tt(e){if("string"==typeof e&&kt.hasOwnProperty(e))e=kt[e];else if(e&&"string"==typeof e.name&&kt.hasOwnProperty(e.name)){var t=kt[e.name];"string"==typeof t&&(t={name:t}),(e=Q(t,e)).name=t.name}else{if("string"==typeof e&&/^[\w\-]+\/[\w\-]+\+xml$/.test(e))return Tt("application/xml");if("string"==typeof e&&/^[\w\-]+\/[\w\-]+\+json$/.test(e))return Tt("application/json")}return"string"==typeof e?{name:e}:e||{name:"null"}}function Mt(e,t){t=Tt(t);var r=Lt[t.name];if(!r)return Mt(e,"text/plain");var n=r(e,t);if(Nt.hasOwnProperty(t.name)){var i=Nt[t.name];for(var o in i)i.hasOwnProperty(o)&&(n.hasOwnProperty(o)&&(n["_"+o]=n[o]),n[o]=i[o])}if(n.name=t.name,t.helperType&&(n.helperType=t.helperType),t.modeProps)for(var l in t.modeProps)n[l]=t.modeProps[l];return n}var Nt={};function Ot(e,t){I(t,Nt.hasOwnProperty(e)?Nt[e]:Nt[e]={})}function At(e,t){if(!0===t)return t;if(e.copyState)return e.copyState(t);var r={};for(var n in t){var i=t[n];i instanceof Array&&(i=i.concat([])),r[n]=i}return r}function Dt(e,t){for(var r;e.innerMode&&(r=e.innerMode(t))&&r.mode!=e;)t=r.state,e=r.mode;return r||{mode:e,state:t}}function Wt(e,t,r){return!e.startState||e.startState(t,r)}var Ht=function(e,t,r){this.pos=this.start=0,this.string=e,this.tabSize=t||8,this.lastColumnPos=this.lastColumnValue=0,this.lineStart=0,this.lineOracle=r};Ht.prototype.eol=function(){return this.pos>=this.string.length},Ht.prototype.sol=function(){return this.pos==this.lineStart},Ht.prototype.peek=function(){return this.string.charAt(this.pos)||void 0},Ht.prototype.next=function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)},Ht.prototype.eat=function(e){var t=this.string.charAt(this.pos);if("string"==typeof e?t==e:t&&(e.test?e.test(t):e(t)))return++this.pos,t},Ht.prototype.eatWhile=function(e){for(var t=this.pos;this.eat(e););return this.pos>t},Ht.prototype.eatSpace=function(){for(var e=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>e},Ht.prototype.skipToEnd=function(){this.pos=this.string.length},Ht.prototype.skipTo=function(e){var t=this.string.indexOf(e,this.pos);if(t>-1)return this.pos=t,!0},Ht.prototype.backUp=function(e){this.pos-=e},Ht.prototype.column=function(){return this.lastColumnPos<this.start&&(this.lastColumnValue=z(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue-(this.lineStart?z(this.string,this.lineStart,this.tabSize):0)},Ht.prototype.indentation=function(){return z(this.string,null,this.tabSize)-(this.lineStart?z(this.string,this.lineStart,this.tabSize):0)},Ht.prototype.match=function(e,t,r){if("string"!=typeof e){var n=this.string.slice(this.pos).match(e);return n&&n.index>0?null:(n&&!1!==t&&(this.pos+=n[0].length),n)}var i=function(e){return r?e.toLowerCase():e};if(i(this.string.substr(this.pos,e.length))==i(e))return!1!==t&&(this.pos+=e.length),!0},Ht.prototype.current=function(){return this.string.slice(this.start,this.pos)},Ht.prototype.hideFirstChars=function(e,t){this.lineStart+=e;try{return t()}finally{this.lineStart-=e}},Ht.prototype.lookAhead=function(e){var t=this.lineOracle;return t&&t.lookAhead(e)},Ht.prototype.baseToken=function(){var e=this.lineOracle;return e&&e.baseToken(this.pos)};var Ft=function(e,t){this.state=e,this.lookAhead=t},Pt=function(e,t,r,n){this.state=t,this.doc=e,this.line=r,this.maxLookAhead=n||0,this.baseTokens=null,this.baseTokenPos=1};function Et(e,t,r,n){var i=[e.state.modeGen],o={};jt(e,t.text,e.doc.mode,r,function(e,t){return i.push(e,t)},o,n);for(var l=r.state,s=function(n){r.baseTokens=i;var s=e.state.overlays[n],a=1,u=0;r.state=!0,jt(e,t.text,s.mode,r,function(e,t){for(var r=a;u<e;){var n=i[a];n>e&&i.splice(a,1,e,i[a+1],n),a+=2,u=Math.min(e,n)}if(t)if(s.opaque)i.splice(r,a-r,e,"overlay "+t),a=r+2;else for(;r<a;r+=2){var o=i[r+1];i[r+1]=(o?o+" ":"")+"overlay "+t}},o),r.state=l,r.baseTokens=null,r.baseTokenPos=1},a=0;a<e.state.overlays.length;++a)s(a);return{styles:i,classes:o.bgClass||o.textClass?o:null}}function It(e,t,r){if(!t.styles||t.styles[0]!=e.state.modeGen){var n=zt(e,he(t)),i=t.text.length>e.options.maxHighlightLength&&At(e.doc.mode,n.state),o=Et(e,t,n);i&&(n.state=i),t.stateAfter=n.save(!i),t.styles=o.styles,o.classes?t.styleClasses=o.classes:t.styleClasses&&(t.styleClasses=null),r===e.doc.highlightFrontier&&(e.doc.modeFrontier=Math.max(e.doc.modeFrontier,++e.doc.highlightFrontier))}return t.styles}function zt(e,t,r){var n=e.doc,i=e.display;if(!n.mode.startState)return new Pt(n,!0,t);var o=function(e,t,r){for(var n,i,o=e.doc,l=r?-1:t-(e.doc.mode.innerMode?1e3:100),s=t;s>l;--s){if(s<=o.first)return o.first;var a=se(o,s-1),u=a.stateAfter;if(u&&(!r||s+(u instanceof Ft?u.lookAhead:0)<=o.modeFrontier))return s;var c=z(a.text,null,e.options.tabSize);(null==i||n>c)&&(i=s-1,n=c)}return i}(e,t,r),l=o>n.first&&se(n,o-1).stateAfter,s=l?Pt.fromSaved(n,l,o):new Pt(n,Wt(n.mode),o);return n.iter(o,t,function(r){Rt(e,r.text,s);var n=s.line;r.stateAfter=n==t-1||n%5==0||n>=i.viewFrom&&n<i.viewTo?s.save():null,s.nextLine()}),r&&(n.modeFrontier=s.line),s}function Rt(e,t,r,n){var i=e.doc.mode,o=new Ht(t,e.options.tabSize,r);for(o.start=o.pos=n||0,""==t&&Bt(i,r.state);!o.eol();)Gt(i,o,r.state),o.start=o.pos}function Bt(e,t){if(e.blankLine)return e.blankLine(t);if(e.innerMode){var r=Dt(e,t);return r.mode.blankLine?r.mode.blankLine(r.state):void 0}}function Gt(e,t,r,n){for(var i=0;i<10;i++){n&&(n[0]=Dt(e,r).mode);var o=e.token(t,r);if(t.pos>t.start)return o}throw new Error("Mode "+e.name+" failed to advance stream.")}Pt.prototype.lookAhead=function(e){var t=this.doc.getLine(this.line+e);return null!=t&&e>this.maxLookAhead&&(this.maxLookAhead=e),t},Pt.prototype.baseToken=function(e){if(!this.baseTokens)return null;for(;this.baseTokens[this.baseTokenPos]<=e;)this.baseTokenPos+=2;var t=this.baseTokens[this.baseTokenPos+1];return{type:t&&t.replace(/( |^)overlay .*/,""),size:this.baseTokens[this.baseTokenPos]-e}},Pt.prototype.nextLine=function(){this.line++,this.maxLookAhead>0&&this.maxLookAhead--},Pt.fromSaved=function(e,t,r){return t instanceof Ft?new Pt(e,At(e.mode,t.state),r,t.lookAhead):new Pt(e,At(e.mode,t),r)},Pt.prototype.save=function(e){var t=!1!==e?At(this.doc.mode,this.state):this.state;return this.maxLookAhead>0?new Ft(t,this.maxLookAhead):t};var Ut=function(e,t,r){this.start=e.start,this.end=e.pos,this.string=e.current(),this.type=t||null,this.state=r};function Vt(e,t,r,n){var i,o,l=e.doc,s=l.mode,a=se(l,(t=Ce(l,t)).line),u=zt(e,t.line,r),c=new Ht(a.text,e.options.tabSize,u);for(n&&(o=[]);(n||c.pos<t.ch)&&!c.eol();)c.start=c.pos,i=Gt(s,c,u.state),n&&o.push(new Ut(c,i,At(l.mode,u.state)));return n?o:new Ut(c,i,u.state)}function Kt(e,t){if(e)for(;;){var r=e.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!r)break;e=e.slice(0,r.index)+e.slice(r.index+r[0].length);var n=r[1]?"bgClass":"textClass";null==t[n]?t[n]=r[2]:new RegExp("(?:^|s)"+r[2]+"(?:$|s)").test(t[n])||(t[n]+=" "+r[2])}return e}function jt(e,t,r,n,i,o,l){var s=r.flattenSpans;null==s&&(s=e.options.flattenSpans);var a,u=0,c=null,h=new Ht(t,e.options.tabSize,n),f=e.options.addModeClass&&[null];for(""==t&&Kt(Bt(r,n.state),o);!h.eol();){if(h.pos>e.options.maxHighlightLength?(s=!1,l&&Rt(e,t,n,h.pos),h.pos=t.length,a=null):a=Kt(Gt(r,h,n.state,f),o),f){var d=f[0].name;d&&(a="m-"+(a?d+" "+a:d))}if(!s||c!=a){for(;u<h.start;)i(u=Math.min(h.start,u+5e3),c);c=a}h.start=h.pos}for(;u<h.pos;){var p=Math.min(h.pos,u+5e3);i(p,c),u=p}}var Xt=function(e,t,r){this.text=e,We(this,t),this.height=r?r(this):1};function Yt(e){e.parent=null,De(e)}Xt.prototype.lineNo=function(){return he(this)},st(Xt);var _t={},$t={};function qt(e,t){if(!e||/^\s*$/.test(e))return null;var r=t.addModeClass?$t:_t;return r[e]||(r[e]=e.replace(/\S+/g,"cm-$&"))}function Zt(e,t){var r=A("span",null,null,a?"padding-right: .1px":null),n={pre:A("pre",[r],"CodeMirror-line"),content:r,col:0,pos:0,cm:e,trailingSpace:!1,splitSpaces:e.getOption("lineWrapping")};t.measure={};for(var i=0;i<=(t.rest?t.rest.length:0);i++){var o=i?t.rest[i-1]:t.line,l=void 0;n.pos=0,n.addToken=Jt,yt(e.display.measure)&&(l=Qe(o,e.doc.direction))&&(n.addToken=er(n.addToken,l)),n.map=[],rr(o,n,It(e,o,t!=e.display.externalMeasured&&he(o))),o.styleClasses&&(o.styleClasses.bgClass&&(n.bgClass=F(o.styleClasses.bgClass,n.bgClass||"")),o.styleClasses.textClass&&(n.textClass=F(o.styleClasses.textClass,n.textClass||""))),0==n.map.length&&n.map.push(0,0,n.content.appendChild(mt(e.display.measure))),0==i?(t.measure.map=n.map,t.measure.cache={}):((t.measure.maps||(t.measure.maps=[])).push(n.map),(t.measure.caches||(t.measure.caches=[])).push({}))}if(a){var s=n.content.lastChild;(/\bcm-tab\b/.test(s.className)||s.querySelector&&s.querySelector(".cm-tab"))&&(n.content.className="cm-tab-wrap-hack")}return nt(e,"renderLine",e,t.line,n.pre),n.pre.className&&(n.textClass=F(n.pre.className,n.textClass||"")),n}function Qt(e){var t=O("span","\u2022","cm-invalidchar");return t.title="\\u"+e.charCodeAt(0).toString(16),t.setAttribute("aria-label",t.title),t}function Jt(e,t,r,n,i,o,a){if(t){var u,c=e.splitSpaces?function(e,t){if(e.length>1&&!/  /.test(e))return e;for(var r=t,n="",i=0;i<e.length;i++){var o=e.charAt(i);" "!=o||!r||i!=e.length-1&&32!=e.charCodeAt(i+1)||(o="\xa0"),n+=o,r=" "==o}return n}(t,e.trailingSpace):t,h=e.cm.state.specialChars,f=!1;if(h.test(t)){u=document.createDocumentFragment();for(var d=0;;){h.lastIndex=d;var p=h.exec(t),g=p?p.index-d:t.length-d;if(g){var v=document.createTextNode(c.slice(d,d+g));l&&s<9?u.appendChild(O("span",[v])):u.appendChild(v),e.map.push(e.pos,e.pos+g,v),e.col+=g,e.pos+=g}if(!p)break;d+=g+1;var m=void 0;if("\t"==p[0]){var y=e.cm.options.tabSize,b=y-e.col%y;(m=u.appendChild(O("span",_(b),"cm-tab"))).setAttribute("role","presentation"),m.setAttribute("cm-text","\t"),e.col+=b}else"\r"==p[0]||"\n"==p[0]?((m=u.appendChild(O("span","\r"==p[0]?"\u240d":"\u2424","cm-invalidchar"))).setAttribute("cm-text",p[0]),e.col+=1):((m=e.cm.options.specialCharPlaceholder(p[0])).setAttribute("cm-text",p[0]),l&&s<9?u.appendChild(O("span",[m])):u.appendChild(m),e.col+=1);e.map.push(e.pos,e.pos+1,m),e.pos++}}else e.col+=t.length,u=document.createTextNode(c),e.map.push(e.pos,e.pos+t.length,u),l&&s<9&&(f=!0),e.pos+=t.length;if(e.trailingSpace=32==c.charCodeAt(t.length-1),r||n||i||f||a){var w=r||"";n&&(w+=n),i&&(w+=i);var x=O("span",[u],w,a);return o&&(x.title=o),e.content.appendChild(x)}e.content.appendChild(u)}}function er(e,t){return function(r,n,i,o,l,s,a){i=i?i+" cm-force-border":"cm-force-border";for(var u=r.pos,c=u+n.length;;){for(var h=void 0,f=0;f<t.length&&!((h=t[f]).to>u&&h.from<=u);f++);if(h.to>=c)return e(r,n,i,o,l,s,a);e(r,n.slice(0,h.to-u),i,o,null,s,a),o=null,n=n.slice(h.to-u),u=h.to}}}function tr(e,t,r,n){var i=!n&&r.widgetNode;i&&e.map.push(e.pos,e.pos+t,i),!n&&e.cm.display.input.needsContentAttribute&&(i||(i=e.content.appendChild(document.createElement("span"))),i.setAttribute("cm-marker",r.id)),i&&(e.cm.display.input.setUneditable(i),e.content.appendChild(i)),e.pos+=t,e.trailingSpace=!1}function rr(e,t,r){var n=e.markedSpans,i=e.text,o=0;if(n)for(var l,s,a,u,c,h,f,d=i.length,p=0,g=1,v="",m=0;;){if(m==p){a=u=c=h=s="",f=null,m=1/0;for(var y=[],b=void 0,w=0;w<n.length;++w){var x=n[w],C=x.marker;"bookmark"==C.type&&x.from==p&&C.widgetNode?y.push(C):x.from<=p&&(null==x.to||x.to>p||C.collapsed&&x.to==p&&x.from==p)?(null!=x.to&&x.to!=p&&m>x.to&&(m=x.to,u=""),C.className&&(a+=" "+C.className),C.css&&(s=(s?s+";":"")+C.css),C.startStyle&&x.from==p&&(c+=" "+C.startStyle),C.endStyle&&x.to==m&&(b||(b=[])).push(C.endStyle,x.to),C.title&&!h&&(h=C.title),C.collapsed&&(!f||Pe(f.marker,C)<0)&&(f=x)):x.from>p&&m>x.from&&(m=x.from)}if(b)for(var S=0;S<b.length;S+=2)b[S+1]==m&&(u+=" "+b[S]);if(!f||f.from==p)for(var L=0;L<y.length;++L)tr(t,0,y[L]);if(f&&(f.from||0)==p){if(tr(t,(null==f.to?d+1:f.to)-p,f.marker,null==f.from),null==f.to)return;f.to==p&&(f=!1)}}if(p>=d)break;for(var k=Math.min(d,m);;){if(v){var T=p+v.length;if(!f){var M=T>k?v.slice(0,k-p):v;t.addToken(t,M,l?l+a:a,c,p+M.length==m?u:"",h,s)}if(T>=k){v=v.slice(k-p),p=k;break}p=T,c=""}v=i.slice(o,o=r[g++]),l=qt(r[g++],t.cm.options)}}else for(var N=1;N<r.length;N+=2)t.addToken(t,i.slice(o,o=r[N]),qt(r[N+1],t.cm.options))}function nr(e,t,r){this.line=t,this.rest=function(e){for(var t,r;t=ze(e);)e=t.find(1,!0).line,(r||(r=[])).push(e);return r}(t),this.size=this.rest?he($(this.rest))-r+1:1,this.node=this.text=null,this.hidden=Ke(e,t)}function ir(e,t,r){for(var n,i=[],o=t;o<r;o=n){var l=new nr(e.doc,se(e.doc,o),o);n=o+l.size,i.push(l)}return i}var or=null;var lr=null;function sr(e,t){var r=tt(e,t);if(r.length){var n,i=Array.prototype.slice.call(arguments,2);or?n=or.delayedCallbacks:lr?n=lr:(n=lr=[],setTimeout(ar,0));for(var o=function(e){n.push(function(){return r[e].apply(null,i)})},l=0;l<r.length;++l)o(l)}}function ar(){var e=lr;lr=null;for(var t=0;t<e.length;++t)e[t]()}function ur(e,t,r,n){for(var i=0;i<t.changes.length;i++){var o=t.changes[i];"text"==o?fr(e,t):"gutter"==o?pr(e,t,r,n):"class"==o?dr(e,t):"widget"==o&&gr(e,t,n)}t.changes=null}function cr(e){return e.node==e.text&&(e.node=O("div",null,null,"position: relative"),e.text.parentNode&&e.text.parentNode.replaceChild(e.node,e.text),e.node.appendChild(e.text),l&&s<8&&(e.node.style.zIndex=2)),e.node}function hr(e,t){var r=e.display.externalMeasured;return r&&r.line==t.line?(e.display.externalMeasured=null,t.measure=r.measure,r.built):Zt(e,t)}function fr(e,t){var r=t.text.className,n=hr(e,t);t.text==t.node&&(t.node=n.pre),t.text.parentNode.replaceChild(n.pre,t.text),t.text=n.pre,n.bgClass!=t.bgClass||n.textClass!=t.textClass?(t.bgClass=n.bgClass,t.textClass=n.textClass,dr(e,t)):r&&(t.text.className=r)}function dr(e,t){!function(e,t){var r=t.bgClass?t.bgClass+" "+(t.line.bgClass||""):t.line.bgClass;if(r&&(r+=" CodeMirror-linebackground"),t.background)r?t.background.className=r:(t.background.parentNode.removeChild(t.background),t.background=null);else if(r){var n=cr(t);t.background=n.insertBefore(O("div",null,r),n.firstChild),e.display.input.setUneditable(t.background)}}(e,t),t.line.wrapClass?cr(t).className=t.line.wrapClass:t.node!=t.text&&(t.node.className="");var r=t.textClass?t.textClass+" "+(t.line.textClass||""):t.line.textClass;t.text.className=r||""}function pr(e,t,r,n){if(t.gutter&&(t.node.removeChild(t.gutter),t.gutter=null),t.gutterBackground&&(t.node.removeChild(t.gutterBackground),t.gutterBackground=null),t.line.gutterClass){var i=cr(t);t.gutterBackground=O("div",null,"CodeMirror-gutter-background "+t.line.gutterClass,"left: "+(e.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+"px; width: "+n.gutterTotalWidth+"px"),e.display.input.setUneditable(t.gutterBackground),i.insertBefore(t.gutterBackground,t.text)}var o=t.line.gutterMarkers;if(e.options.lineNumbers||o){var l=cr(t),s=t.gutter=O("div",null,"CodeMirror-gutter-wrapper","left: "+(e.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+"px");if(e.display.input.setUneditable(s),l.insertBefore(s,t.text),t.line.gutterClass&&(s.className+=" "+t.line.gutterClass),!e.options.lineNumbers||o&&o["CodeMirror-linenumbers"]||(t.lineNumber=s.appendChild(O("div",pe(e.options,r),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+n.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+e.display.lineNumInnerWidth+"px"))),o)for(var a=0;a<e.options.gutters.length;++a){var u=e.options.gutters[a],c=o.hasOwnProperty(u)&&o[u];c&&s.appendChild(O("div",[c],"CodeMirror-gutter-elt","left: "+n.gutterLeft[u]+"px; width: "+n.gutterWidth[u]+"px"))}}}function gr(e,t,r){t.alignable&&(t.alignable=null);for(var n=t.node.firstChild,i=void 0;n;n=i)i=n.nextSibling,"CodeMirror-linewidget"==n.className&&t.node.removeChild(n);mr(e,t,r)}function vr(e,t,r,n){var i=hr(e,t);return t.text=t.node=i.pre,i.bgClass&&(t.bgClass=i.bgClass),i.textClass&&(t.textClass=i.textClass),dr(e,t),pr(e,t,r,n),mr(e,t,n),t.node}function mr(e,t,r){if(yr(e,t.line,t,r,!0),t.rest)for(var n=0;n<t.rest.length;n++)yr(e,t.rest[n],t,r,!1)}function yr(e,t,r,n,i){if(t.widgets)for(var o=cr(r),l=0,s=t.widgets;l<s.length;++l){var a=s[l],u=O("div",[a.node],"CodeMirror-linewidget");a.handleMouseEvents||u.setAttribute("cm-ignore-events","true"),br(a,u,r,n),e.display.input.setUneditable(u),i&&a.above?o.insertBefore(u,r.gutter||r.text):o.appendChild(u),sr(a,"redraw")}}function br(e,t,r,n){if(e.noHScroll){(r.alignable||(r.alignable=[])).push(t);var i=n.wrapperWidth;t.style.left=n.fixedPos+"px",e.coverGutter||(i-=n.gutterTotalWidth,t.style.paddingLeft=n.gutterTotalWidth+"px"),t.style.width=i+"px"}e.coverGutter&&(t.style.zIndex=5,t.style.position="relative",e.noHScroll||(t.style.marginLeft=-n.gutterTotalWidth+"px"))}function wr(e){if(null!=e.height)return e.height;var t=e.doc.cm;if(!t)return 0;if(!D(document.body,e.node)){var r="position: relative;";e.coverGutter&&(r+="margin-left: -"+t.display.gutters.offsetWidth+"px;"),e.noHScroll&&(r+="width: "+t.display.wrapper.clientWidth+"px;"),N(t.display.measure,O("div",[e.node],null,r))}return e.height=e.node.parentNode.offsetHeight}function xr(e,t){for(var r=ft(t);r!=e.wrapper;r=r.parentNode)if(!r||1==r.nodeType&&"true"==r.getAttribute("cm-ignore-events")||r.parentNode==e.sizer&&r!=e.mover)return!0}function Cr(e){return e.lineSpace.offsetTop}function Sr(e){return e.mover.offsetHeight-e.lineSpace.offsetHeight}function Lr(e){if(e.cachedPaddingH)return e.cachedPaddingH;var t=N(e.measure,O("pre","x")),r=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,n={left:parseInt(r.paddingLeft),right:parseInt(r.paddingRight)};return isNaN(n.left)||isNaN(n.right)||(e.cachedPaddingH=n),n}function kr(e){return G-e.display.nativeBarWidth}function Tr(e){return e.display.scroller.clientWidth-kr(e)-e.display.barWidth}function Mr(e){return e.display.scroller.clientHeight-kr(e)-e.display.barHeight}function Nr(e,t,r){if(e.line==t)return{map:e.measure.map,cache:e.measure.cache};for(var n=0;n<e.rest.length;n++)if(e.rest[n]==t)return{map:e.measure.maps[n],cache:e.measure.caches[n]};for(var i=0;i<e.rest.length;i++)if(he(e.rest[i])>r)return{map:e.measure.maps[i],cache:e.measure.caches[i],before:!0}}function Or(e,t,r,n){return Wr(e,Dr(e,t),r,n)}function Ar(e,t){if(t>=e.display.viewFrom&&t<e.display.viewTo)return e.display.view[an(e,t)];var r=e.display.externalMeasured;return r&&t>=r.lineN&&t<r.lineN+r.size?r:void 0}function Dr(e,t){var r=he(t),n=Ar(e,r);n&&!n.text?n=null:n&&n.changes&&(ur(e,n,r,rn(e)),e.curOp.forceUpdate=!0),n||(n=function(e,t){var r=he(t=Ge(t)),n=e.display.externalMeasured=new nr(e.doc,t,r);n.lineN=r;var i=n.built=Zt(e,n);return n.text=i.pre,N(e.display.lineMeasure,i.pre),n}(e,t));var i=Nr(n,t,r);return{line:t,view:n,rect:null,map:i.map,cache:i.cache,before:i.before,hasHeights:!1}}function Wr(e,t,r,n,i){t.before&&(r=-1);var o,a=r+(n||"");return t.cache.hasOwnProperty(a)?o=t.cache[a]:(t.rect||(t.rect=t.view.text.getBoundingClientRect()),t.hasHeights||(!function(e,t,r){var n=e.options.lineWrapping,i=n&&Tr(e);if(!t.measure.heights||n&&t.measure.width!=i){var o=t.measure.heights=[];if(n){t.measure.width=i;for(var l=t.text.firstChild.getClientRects(),s=0;s<l.length-1;s++){var a=l[s],u=l[s+1];Math.abs(a.bottom-u.bottom)>2&&o.push((a.bottom+u.top)/2-r.top)}}o.push(r.bottom-r.top)}}(e,t.view,t.rect),t.hasHeights=!0),(o=function(e,t,r,n){var i,o=Pr(t.map,r,n),a=o.node,u=o.start,c=o.end,h=o.collapse;if(3==a.nodeType){for(var f=0;f<4;f++){for(;u&&ie(t.line.text.charAt(o.coverStart+u));)--u;for(;o.coverStart+c<o.coverEnd&&ie(t.line.text.charAt(o.coverStart+c));)++c;if((i=l&&s<9&&0==u&&c==o.coverEnd-o.coverStart?a.parentNode.getBoundingClientRect():Er(k(a,u,c).getClientRects(),n)).left||i.right||0==u)break;c=u,u-=1,h="right"}l&&s<11&&(i=function(e,t){if(!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI||!function(e){if(null!=St)return St;var t=N(e,O("span","x")),r=t.getBoundingClientRect(),n=k(t,0,1).getBoundingClientRect();return St=Math.abs(r.left-n.left)>1}(e))return t;var r=screen.logicalXDPI/screen.deviceXDPI,n=screen.logicalYDPI/screen.deviceYDPI;return{left:t.left*r,right:t.right*r,top:t.top*n,bottom:t.bottom*n}}(e.display.measure,i))}else{var d;u>0&&(h=n="right"),i=e.options.lineWrapping&&(d=a.getClientRects()).length>1?d["right"==n?d.length-1:0]:a.getBoundingClientRect()}if(l&&s<9&&!u&&(!i||!i.left&&!i.right)){var p=a.parentNode.getClientRects()[0];i=p?{left:p.left,right:p.left+tn(e.display),top:p.top,bottom:p.bottom}:Fr}for(var g=i.top-t.rect.top,v=i.bottom-t.rect.top,m=(g+v)/2,y=t.view.measure.heights,b=0;b<y.length-1&&!(m<y[b]);b++);var w=b?y[b-1]:0,x=y[b],C={left:("right"==h?i.right:i.left)-t.rect.left,right:("left"==h?i.left:i.right)-t.rect.left,top:w,bottom:x};i.left||i.right||(C.bogus=!0);e.options.singleCursorHeightPerLine||(C.rtop=g,C.rbottom=v);return C}(e,t,r,n)).bogus||(t.cache[a]=o)),{left:o.left,right:o.right,top:i?o.rtop:o.top,bottom:i?o.rbottom:o.bottom}}var Hr,Fr={left:0,right:0,top:0,bottom:0};function Pr(e,t,r){for(var n,i,o,l,s,a,u=0;u<e.length;u+=3)if(s=e[u],a=e[u+1],t<s?(i=0,o=1,l="left"):t<a?o=(i=t-s)+1:(u==e.length-3||t==a&&e[u+3]>t)&&(i=(o=a-s)-1,t>=a&&(l="right")),null!=i){if(n=e[u+2],s==a&&r==(n.insertLeft?"left":"right")&&(l=r),"left"==r&&0==i)for(;u&&e[u-2]==e[u-3]&&e[u-1].insertLeft;)n=e[2+(u-=3)],l="left";if("right"==r&&i==a-s)for(;u<e.length-3&&e[u+3]==e[u+4]&&!e[u+5].insertLeft;)n=e[(u+=3)+2],l="right";break}return{node:n,start:i,end:o,collapse:l,coverStart:s,coverEnd:a}}function Er(e,t){var r=Fr;if("left"==t)for(var n=0;n<e.length&&(r=e[n]).left==r.right;n++);else for(var i=e.length-1;i>=0&&(r=e[i]).left==r.right;i--);return r}function Ir(e){if(e.measure&&(e.measure.cache={},e.measure.heights=null,e.rest))for(var t=0;t<e.rest.length;t++)e.measure.caches[t]={}}function zr(e){e.display.externalMeasure=null,M(e.display.lineMeasure);for(var t=0;t<e.display.view.length;t++)Ir(e.display.view[t])}function Rr(e){zr(e),e.display.cachedCharWidth=e.display.cachedTextHeight=e.display.cachedPaddingH=null,e.options.lineWrapping||(e.display.maxLineChanged=!0),e.display.lineNumChars=null}function Br(){return c&&v?-(document.body.getBoundingClientRect().left-parseInt(getComputedStyle(document.body).marginLeft)):window.pageXOffset||(document.documentElement||document.body).scrollLeft}function Gr(){return c&&v?-(document.body.getBoundingClientRect().top-parseInt(getComputedStyle(document.body).marginTop)):window.pageYOffset||(document.documentElement||document.body).scrollTop}function Ur(e){var t=0;if(e.widgets)for(var r=0;r<e.widgets.length;++r)e.widgets[r].above&&(t+=wr(e.widgets[r]));return t}function Vr(e,t,r,n,i){if(!i){var o=Ur(t);r.top+=o,r.bottom+=o}if("line"==n)return r;n||(n="local");var l=Xe(t);if("local"==n?l+=Cr(e.display):l-=e.display.viewOffset,"page"==n||"window"==n){var s=e.display.lineSpace.getBoundingClientRect();l+=s.top+("window"==n?0:Gr());var a=s.left+("window"==n?0:Br());r.left+=a,r.right+=a}return r.top+=l,r.bottom+=l,r}function Kr(e,t,r){if("div"==r)return t;var n=t.left,i=t.top;if("page"==r)n-=Br(),i-=Gr();else if("local"==r||!r){var o=e.display.sizer.getBoundingClientRect();n+=o.left,i+=o.top}var l=e.display.lineSpace.getBoundingClientRect();return{left:n-l.left,top:i-l.top}}function jr(e,t,r,n,i){return n||(n=se(e.doc,t.line)),Vr(e,n,Or(e,n,t.ch,i),r)}function Xr(e,t,r,n,i,o){function l(t,l){var s=Wr(e,i,t,l?"right":"left",o);return l?s.left=s.right:s.right=s.left,Vr(e,n,s,r)}n=n||se(e.doc,t.line),i||(i=Dr(e,n));var s=Qe(n,e.doc.direction),a=t.ch,u=t.sticky;if(a>=n.text.length?(a=n.text.length,u="before"):a<=0&&(a=0,u="after"),!s)return l("before"==u?a-1:a,"before"==u);function c(e,t,r){return l(r?e-1:e,1==s[t].level!=r)}var h=qe(s,a,u),f=$e,d=c(a,h,"before"==u);return null!=f&&(d.other=c(a,f,"before"!=u)),d}function Yr(e,t){var r=0;t=Ce(e.doc,t),e.options.lineWrapping||(r=tn(e.display)*t.ch);var n=se(e.doc,t.line),i=Xe(n)+Cr(e.display);return{left:r,right:r,top:i,bottom:i+n.height}}function _r(e,t,r,n,i){var o=ge(e,t,r);return o.xRel=i,n&&(o.outside=!0),o}function $r(e,t,r){var n=e.doc;if((r+=e.display.viewOffset)<0)return _r(n.first,0,null,!0,-1);var i=fe(n,r),o=n.first+n.size-1;if(i>o)return _r(n.first+n.size-1,se(n,o).text.length,null,!0,1);t<0&&(t=0);for(var l=se(n,i);;){var s=Jr(e,l,i,t,r),a=Re(l,s.ch+(s.xRel>0?1:0));if(!a)return s;var u=a.find(1);if(u.line==i)return u;l=se(n,i=u.line)}}function qr(e,t,r,n){n-=Ur(t);var i=t.text.length,o=le(function(t){return Wr(e,r,t-1).bottom<=n},i,0);return{begin:o,end:i=le(function(t){return Wr(e,r,t).top>n},o,i)}}function Zr(e,t,r,n){return r||(r=Dr(e,t)),qr(e,t,r,Vr(e,t,Wr(e,r,n),"line").top)}function Qr(e,t,r,n){return!(e.bottom<=r)&&(e.top>r||(n?e.left:e.right)>t)}function Jr(e,t,r,n,i){i-=Xe(t);var o=Dr(e,t),l=Ur(t),s=0,a=t.text.length,u=!0,c=Qe(t,e.doc.direction);if(c){var h=(e.options.lineWrapping?function(e,t,r,n,i,o,l){var s=qr(e,t,n,l),a=s.begin,u=s.end;/\s/.test(t.text.charAt(u-1))&&u--;for(var c=null,h=null,f=0;f<i.length;f++){var d=i[f];if(!(d.from>=u||d.to<=a)){var p=1!=d.level,g=Wr(e,n,p?Math.min(u,d.to)-1:Math.max(a,d.from)).right,v=g<o?o-g+1e9:g-o;(!c||h>v)&&(c=d,h=v)}}c||(c=i[i.length-1]);c.from<a&&(c={from:a,to:c.to,level:c.level});c.to>u&&(c={from:c.from,to:u,level:c.level});return c}:function(e,t,r,n,i,o,l){var s=le(function(s){var a=i[s],u=1!=a.level;return Qr(Xr(e,ge(r,u?a.to:a.from,u?"before":"after"),"line",t,n),o,l,!0)},0,i.length-1),a=i[s];if(s>0){var u=1!=a.level,c=Xr(e,ge(r,u?a.from:a.to,u?"after":"before"),"line",t,n);Qr(c,o,l,!0)&&c.top>l&&(a=i[s-1])}return a})(e,t,r,o,c,n,i);s=(u=1!=h.level)?h.from:h.to-1,a=u?h.to:h.from-1}var f,d,p=null,g=null,v=le(function(t){var r=Wr(e,o,t);return r.top+=l,r.bottom+=l,!!Qr(r,n,i,!1)&&(r.top<=i&&r.left<=n&&(p=t,g=r),!0)},s,a),m=!1;if(g){var y=n-g.left<g.right-n,b=y==u;v=p+(b?0:1),d=b?"after":"before",f=y?g.left:g.right}else{u||v!=a&&v!=s||v++,d=0==v?"after":v==t.text.length?"before":Wr(e,o,v-(u?1:0)).bottom+l<=i==u?"after":"before";var w=Xr(e,ge(r,v,d),"line",t,o);f=w.left,m=i<w.top||i>=w.bottom}return _r(r,v=oe(t.text,v,1),d,m,n-f)}function en(e){if(null!=e.cachedTextHeight)return e.cachedTextHeight;if(null==Hr){Hr=O("pre");for(var t=0;t<49;++t)Hr.appendChild(document.createTextNode("x")),Hr.appendChild(O("br"));Hr.appendChild(document.createTextNode("x"))}N(e.measure,Hr);var r=Hr.offsetHeight/50;return r>3&&(e.cachedTextHeight=r),M(e.measure),r||1}function tn(e){if(null!=e.cachedCharWidth)return e.cachedCharWidth;var t=O("span","xxxxxxxxxx"),r=O("pre",[t]);N(e.measure,r);var n=t.getBoundingClientRect(),i=(n.right-n.left)/10;return i>2&&(e.cachedCharWidth=i),i||10}function rn(e){for(var t=e.display,r={},n={},i=t.gutters.clientLeft,o=t.gutters.firstChild,l=0;o;o=o.nextSibling,++l)r[e.options.gutters[l]]=o.offsetLeft+o.clientLeft+i,n[e.options.gutters[l]]=o.clientWidth;return{fixedPos:nn(t),gutterTotalWidth:t.gutters.offsetWidth,gutterLeft:r,gutterWidth:n,wrapperWidth:t.wrapper.clientWidth}}function nn(e){return e.scroller.getBoundingClientRect().left-e.sizer.getBoundingClientRect().left}function on(e){var t=en(e.display),r=e.options.lineWrapping,n=r&&Math.max(5,e.display.scroller.clientWidth/tn(e.display)-3);return function(i){if(Ke(e.doc,i))return 0;var o=0;if(i.widgets)for(var l=0;l<i.widgets.length;l++)i.widgets[l].height&&(o+=i.widgets[l].height);return r?o+(Math.ceil(i.text.length/n)||1)*t:o+t}}function ln(e){var t=e.doc,r=on(e);t.iter(function(e){var t=r(e);t!=e.height&&ce(e,t)})}function sn(e,t,r,n){var i=e.display;if(!r&&"true"==ft(t).getAttribute("cm-not-content"))return null;var o,l,s=i.lineSpace.getBoundingClientRect();try{o=t.clientX-s.left,l=t.clientY-s.top}catch(t){return null}var a,u=$r(e,o,l);if(n&&1==u.xRel&&(a=se(e.doc,u.line).text).length==u.ch){var c=z(a,a.length,e.options.tabSize)-a.length;u=ge(u.line,Math.max(0,Math.round((o-Lr(e.display).left)/tn(e.display))-c))}return u}function an(e,t){if(t>=e.display.viewTo)return null;if((t-=e.display.viewFrom)<0)return null;for(var r=e.display.view,n=0;n<r.length;n++)if((t-=r[n].size)<0)return n}function un(e){e.display.input.showSelection(e.display.input.prepareSelection())}function cn(e,t){void 0===t&&(t=!0);for(var r=e.doc,n={},i=n.cursors=document.createDocumentFragment(),o=n.selection=document.createDocumentFragment(),l=0;l<r.sel.ranges.length;l++)if(t||l!=r.sel.primIndex){var s=r.sel.ranges[l];if(!(s.from().line>=e.display.viewTo||s.to().line<e.display.viewFrom)){var a=s.empty();(a||e.options.showCursorWhenSelecting)&&hn(e,s.head,i),a||dn(e,s,o)}}return n}function hn(e,t,r){var n=Xr(e,t,"div",null,null,!e.options.singleCursorHeightPerLine),i=r.appendChild(O("div","\xa0","CodeMirror-cursor"));if(i.style.left=n.left+"px",i.style.top=n.top+"px",i.style.height=Math.max(0,n.bottom-n.top)*e.options.cursorHeight+"px",n.other){var o=r.appendChild(O("div","\xa0","CodeMirror-cursor CodeMirror-secondarycursor"));o.style.display="",o.style.left=n.other.left+"px",o.style.top=n.other.top+"px",o.style.height=.85*(n.other.bottom-n.other.top)+"px"}}function fn(e,t){return e.top-t.top||e.left-t.left}function dn(e,t,r){var n=e.display,i=e.doc,o=document.createDocumentFragment(),l=Lr(e.display),s=l.left,a=Math.max(n.sizerWidth,Tr(e)-n.sizer.offsetLeft)-l.right,u="ltr"==i.direction;function c(e,t,r,n){t<0&&(t=0),t=Math.round(t),n=Math.round(n),o.appendChild(O("div",null,"CodeMirror-selected","position: absolute; left: "+e+"px;\n                             top: "+t+"px; width: "+(null==r?a-e:r)+"px;\n                             height: "+(n-t)+"px"))}function h(t,r,n){var o,l,h=se(i,t),f=h.text.length;function d(r,n){return jr(e,ge(t,r),"div",h,n)}function p(t,r,n){var i=Zr(e,h,null,t),o="ltr"==r==("after"==n)?"left":"right";return d("after"==n?i.begin:i.end-(/\s/.test(h.text.charAt(i.end-1))?2:1),o)[o]}var g=Qe(h,i.direction);return function(e,t,r,n){if(!e)return n(t,r,"ltr",0);for(var i=!1,o=0;o<e.length;++o){var l=e[o];(l.from<r&&l.to>t||t==r&&l.to==t)&&(n(Math.max(l.from,t),Math.min(l.to,r),1==l.level?"rtl":"ltr",o),i=!0)}i||n(t,r,"ltr")}(g,r||0,null==n?f:n,function(e,t,i,h){var v="ltr"==i,m=d(e,v?"left":"right"),y=d(t-1,v?"right":"left"),b=null==r&&0==e,w=null==n&&t==f,x=0==h,C=!g||h==g.length-1;if(y.top-m.top<=3){var S=(u?w:b)&&C,L=(u?b:w)&&x?s:(v?m:y).left,k=S?a:(v?y:m).right;c(L,m.top,k-L,m.bottom)}else{var T,M,N,O;v?(T=u&&b&&x?s:m.left,M=u?a:p(e,i,"before"),N=u?s:p(t,i,"after"),O=u&&w&&C?a:y.right):(T=u?p(e,i,"before"):s,M=!u&&b&&x?a:m.right,N=!u&&w&&C?s:y.left,O=u?p(t,i,"after"):a),c(T,m.top,M-T,m.bottom),m.bottom<y.top&&c(s,m.bottom,null,y.top),c(N,y.top,O-N,y.bottom)}(!o||fn(m,o)<0)&&(o=m),fn(y,o)<0&&(o=y),(!l||fn(m,l)<0)&&(l=m),fn(y,l)<0&&(l=y)}),{start:o,end:l}}var f=t.from(),d=t.to();if(f.line==d.line)h(f.line,f.ch,d.ch);else{var p=se(i,f.line),g=se(i,d.line),v=Ge(p)==Ge(g),m=h(f.line,f.ch,v?p.text.length+1:null).end,y=h(d.line,v?0:null,d.ch).start;v&&(m.top<y.top-2?(c(m.right,m.top,null,m.bottom),c(s,y.top,y.left,y.bottom)):c(m.right,m.top,y.left-m.right,m.bottom)),m.bottom<y.top&&c(s,m.bottom,null,y.top)}r.appendChild(o)}function pn(e){if(e.state.focused){var t=e.display;clearInterval(t.blinker);var r=!0;t.cursorDiv.style.visibility="",e.options.cursorBlinkRate>0?t.blinker=setInterval(function(){return t.cursorDiv.style.visibility=(r=!r)?"":"hidden"},e.options.cursorBlinkRate):e.options.cursorBlinkRate<0&&(t.cursorDiv.style.visibility="hidden")}}function gn(e){e.state.focused||(e.display.input.focus(),mn(e))}function vn(e){e.state.delayingBlurEvent=!0,setTimeout(function(){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1,yn(e))},100)}function mn(e,t){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1),"nocursor"!=e.options.readOnly&&(e.state.focused||(nt(e,"focus",e,t),e.state.focused=!0,H(e.display.wrapper,"CodeMirror-focused"),e.curOp||e.display.selForContextMenu==e.doc.sel||(e.display.input.reset(),a&&setTimeout(function(){return e.display.input.reset(!0)},20)),e.display.input.receivedFocus()),pn(e))}function yn(e,t){e.state.delayingBlurEvent||(e.state.focused&&(nt(e,"blur",e,t),e.state.focused=!1,T(e.display.wrapper,"CodeMirror-focused")),clearInterval(e.display.blinker),setTimeout(function(){e.state.focused||(e.display.shift=!1)},150))}function bn(e){for(var t=e.display,r=t.lineDiv.offsetTop,n=0;n<t.view.length;n++){var i=t.view[n],o=void 0;if(!i.hidden){if(l&&s<8){var a=i.node.offsetTop+i.node.offsetHeight;o=a-r,r=a}else{var u=i.node.getBoundingClientRect();o=u.bottom-u.top}var c=i.line.height-o;if(o<2&&(o=en(t)),(c>.005||c<-.005)&&(ce(i.line,o),wn(i.line),i.rest))for(var h=0;h<i.rest.length;h++)wn(i.rest[h])}}}function wn(e){if(e.widgets)for(var t=0;t<e.widgets.length;++t){var r=e.widgets[t],n=r.node.parentNode;n&&(r.height=n.offsetHeight)}}function xn(e,t,r){var n=r&&null!=r.top?Math.max(0,r.top):e.scroller.scrollTop;n=Math.floor(n-Cr(e));var i=r&&null!=r.bottom?r.bottom:n+e.wrapper.clientHeight,o=fe(t,n),l=fe(t,i);if(r&&r.ensure){var s=r.ensure.from.line,a=r.ensure.to.line;s<o?(o=s,l=fe(t,Xe(se(t,s))+e.wrapper.clientHeight)):Math.min(a,t.lastLine())>=l&&(o=fe(t,Xe(se(t,a))-e.wrapper.clientHeight),l=a)}return{from:o,to:Math.max(l,o+1)}}function Cn(e){var t=e.display,r=t.view;if(t.alignWidgets||t.gutters.firstChild&&e.options.fixedGutter){for(var n=nn(t)-t.scroller.scrollLeft+e.doc.scrollLeft,i=t.gutters.offsetWidth,o=n+"px",l=0;l<r.length;l++)if(!r[l].hidden){e.options.fixedGutter&&(r[l].gutter&&(r[l].gutter.style.left=o),r[l].gutterBackground&&(r[l].gutterBackground.style.left=o));var s=r[l].alignable;if(s)for(var a=0;a<s.length;a++)s[a].style.left=o}e.options.fixedGutter&&(t.gutters.style.left=n+i+"px")}}function Sn(e){if(!e.options.lineNumbers)return!1;var t=e.doc,r=pe(e.options,t.first+t.size-1),n=e.display;if(r.length!=n.lineNumChars){var i=n.measure.appendChild(O("div",[O("div",r)],"CodeMirror-linenumber CodeMirror-gutter-elt")),o=i.firstChild.offsetWidth,l=i.offsetWidth-o;return n.lineGutter.style.width="",n.lineNumInnerWidth=Math.max(o,n.lineGutter.offsetWidth-l)+1,n.lineNumWidth=n.lineNumInnerWidth+l,n.lineNumChars=n.lineNumInnerWidth?r.length:-1,n.lineGutter.style.width=n.lineNumWidth+"px",ai(e),!0}return!1}function Ln(e,t){var r=e.display,n=en(e.display);t.top<0&&(t.top=0);var i=e.curOp&&null!=e.curOp.scrollTop?e.curOp.scrollTop:r.scroller.scrollTop,o=Mr(e),l={};t.bottom-t.top>o&&(t.bottom=t.top+o);var s=e.doc.height+Sr(r),a=t.top<n,u=t.bottom>s-n;if(t.top<i)l.scrollTop=a?0:t.top;else if(t.bottom>i+o){var c=Math.min(t.top,(u?s:t.bottom)-o);c!=i&&(l.scrollTop=c)}var h=e.curOp&&null!=e.curOp.scrollLeft?e.curOp.scrollLeft:r.scroller.scrollLeft,f=Tr(e)-(e.options.fixedGutter?r.gutters.offsetWidth:0),d=t.right-t.left>f;return d&&(t.right=t.left+f),t.left<10?l.scrollLeft=0:t.left<h?l.scrollLeft=Math.max(0,t.left-(d?0:10)):t.right>f+h-3&&(l.scrollLeft=t.right+(d?0:10)-f),l}function kn(e,t){null!=t&&(Nn(e),e.curOp.scrollTop=(null==e.curOp.scrollTop?e.doc.scrollTop:e.curOp.scrollTop)+t)}function Tn(e){Nn(e);var t=e.getCursor();e.curOp.scrollToPos={from:t,to:t,margin:e.options.cursorScrollMargin}}function Mn(e,t,r){null==t&&null==r||Nn(e),null!=t&&(e.curOp.scrollLeft=t),null!=r&&(e.curOp.scrollTop=r)}function Nn(e){var t=e.curOp.scrollToPos;t&&(e.curOp.scrollToPos=null,On(e,Yr(e,t.from),Yr(e,t.to),t.margin))}function On(e,t,r,n){var i=Ln(e,{left:Math.min(t.left,r.left),top:Math.min(t.top,r.top)-n,right:Math.max(t.right,r.right),bottom:Math.max(t.bottom,r.bottom)+n});Mn(e,i.scrollLeft,i.scrollTop)}function An(e,t){Math.abs(e.doc.scrollTop-t)<2||(r||si(e,{top:t}),Dn(e,t,!0),r&&si(e),ri(e,100))}function Dn(e,t,r){t=Math.min(e.display.scroller.scrollHeight-e.display.scroller.clientHeight,t),(e.display.scroller.scrollTop!=t||r)&&(e.doc.scrollTop=t,e.display.scrollbars.setScrollTop(t),e.display.scroller.scrollTop!=t&&(e.display.scroller.scrollTop=t))}function Wn(e,t,r,n){t=Math.min(t,e.display.scroller.scrollWidth-e.display.scroller.clientWidth),(r?t==e.doc.scrollLeft:Math.abs(e.doc.scrollLeft-t)<2)&&!n||(e.doc.scrollLeft=t,Cn(e),e.display.scroller.scrollLeft!=t&&(e.display.scroller.scrollLeft=t),e.display.scrollbars.setScrollLeft(t))}function Hn(e){var t=e.display,r=t.gutters.offsetWidth,n=Math.round(e.doc.height+Sr(e.display));return{clientHeight:t.scroller.clientHeight,viewHeight:t.wrapper.clientHeight,scrollWidth:t.scroller.scrollWidth,clientWidth:t.scroller.clientWidth,viewWidth:t.wrapper.clientWidth,barLeft:e.options.fixedGutter?r:0,docHeight:n,scrollHeight:n+kr(e)+t.barHeight,nativeBarWidth:t.nativeBarWidth,gutterWidth:r}}var Fn=function(e,t,r){this.cm=r;var n=this.vert=O("div",[O("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),i=this.horiz=O("div",[O("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");n.tabIndex=i.tabIndex=-1,e(n),e(i),et(n,"scroll",function(){n.clientHeight&&t(n.scrollTop,"vertical")}),et(i,"scroll",function(){i.clientWidth&&t(i.scrollLeft,"horizontal")}),this.checkedZeroWidth=!1,l&&s<8&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")};Fn.prototype.update=function(e){var t=e.scrollWidth>e.clientWidth+1,r=e.scrollHeight>e.clientHeight+1,n=e.nativeBarWidth;if(r){this.vert.style.display="block",this.vert.style.bottom=t?n+"px":"0";var i=e.viewHeight-(t?n:0);this.vert.firstChild.style.height=Math.max(0,e.scrollHeight-e.clientHeight+i)+"px"}else this.vert.style.display="",this.vert.firstChild.style.height="0";if(t){this.horiz.style.display="block",this.horiz.style.right=r?n+"px":"0",this.horiz.style.left=e.barLeft+"px";var o=e.viewWidth-e.barLeft-(r?n:0);this.horiz.firstChild.style.width=Math.max(0,e.scrollWidth-e.clientWidth+o)+"px"}else this.horiz.style.display="",this.horiz.firstChild.style.width="0";return!this.checkedZeroWidth&&e.clientHeight>0&&(0==n&&this.zeroWidthHack(),this.checkedZeroWidth=!0),{right:r?n:0,bottom:t?n:0}},Fn.prototype.setScrollLeft=function(e){this.horiz.scrollLeft!=e&&(this.horiz.scrollLeft=e),this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz,"horiz")},Fn.prototype.setScrollTop=function(e){this.vert.scrollTop!=e&&(this.vert.scrollTop=e),this.disableVert&&this.enableZeroWidthBar(this.vert,this.disableVert,"vert")},Fn.prototype.zeroWidthHack=function(){var e=y&&!d?"12px":"18px";this.horiz.style.height=this.vert.style.width=e,this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none",this.disableHoriz=new R,this.disableVert=new R},Fn.prototype.enableZeroWidthBar=function(e,t,r){e.style.pointerEvents="auto",t.set(1e3,function n(){var i=e.getBoundingClientRect();("vert"==r?document.elementFromPoint(i.right-1,(i.top+i.bottom)/2):document.elementFromPoint((i.right+i.left)/2,i.bottom-1))!=e?e.style.pointerEvents="none":t.set(1e3,n)})},Fn.prototype.clear=function(){var e=this.horiz.parentNode;e.removeChild(this.horiz),e.removeChild(this.vert)};var Pn=function(){};function En(e,t){t||(t=Hn(e));var r=e.display.barWidth,n=e.display.barHeight;In(e,t);for(var i=0;i<4&&r!=e.display.barWidth||n!=e.display.barHeight;i++)r!=e.display.barWidth&&e.options.lineWrapping&&bn(e),In(e,Hn(e)),r=e.display.barWidth,n=e.display.barHeight}function In(e,t){var r=e.display,n=r.scrollbars.update(t);r.sizer.style.paddingRight=(r.barWidth=n.right)+"px",r.sizer.style.paddingBottom=(r.barHeight=n.bottom)+"px",r.heightForcer.style.borderBottom=n.bottom+"px solid transparent",n.right&&n.bottom?(r.scrollbarFiller.style.display="block",r.scrollbarFiller.style.height=n.bottom+"px",r.scrollbarFiller.style.width=n.right+"px"):r.scrollbarFiller.style.display="",n.bottom&&e.options.coverGutterNextToScrollbar&&e.options.fixedGutter?(r.gutterFiller.style.display="block",r.gutterFiller.style.height=n.bottom+"px",r.gutterFiller.style.width=t.gutterWidth+"px"):r.gutterFiller.style.display=""}Pn.prototype.update=function(){return{bottom:0,right:0}},Pn.prototype.setScrollLeft=function(){},Pn.prototype.setScrollTop=function(){},Pn.prototype.clear=function(){};var zn={native:Fn,null:Pn};function Rn(e){e.display.scrollbars&&(e.display.scrollbars.clear(),e.display.scrollbars.addClass&&T(e.display.wrapper,e.display.scrollbars.addClass)),e.display.scrollbars=new zn[e.options.scrollbarStyle](function(t){e.display.wrapper.insertBefore(t,e.display.scrollbarFiller),et(t,"mousedown",function(){e.state.focused&&setTimeout(function(){return e.display.input.focus()},0)}),t.setAttribute("cm-not-content","true")},function(t,r){"horizontal"==r?Wn(e,t):An(e,t)},e),e.display.scrollbars.addClass&&H(e.display.wrapper,e.display.scrollbars.addClass)}var Bn=0;function Gn(e){var t;e.curOp={cm:e,viewChanged:!1,startHeight:e.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++Bn},t=e.curOp,or?or.ops.push(t):t.ownsGroup=or={ops:[t],delayedCallbacks:[]}}function Un(e){!function(e,t){var r=e.ownsGroup;if(r)try{!function(e){var t=e.delayedCallbacks,r=0;do{for(;r<t.length;r++)t[r].call(null);for(var n=0;n<e.ops.length;n++){var i=e.ops[n];if(i.cursorActivityHandlers)for(;i.cursorActivityCalled<i.cursorActivityHandlers.length;)i.cursorActivityHandlers[i.cursorActivityCalled++].call(null,i.cm)}}while(r<t.length)}(r)}finally{or=null,t(r)}}(e.curOp,function(e){for(var t=0;t<e.ops.length;t++)e.ops[t].cm.curOp=null;!function(e){for(var t=e.ops,r=0;r<t.length;r++)Vn(t[r]);for(var n=0;n<t.length;n++)(i=t[n]).updatedDisplay=i.mustUpdate&&oi(i.cm,i.update);var i;for(var o=0;o<t.length;o++)Kn(t[o]);for(var l=0;l<t.length;l++)jn(t[l]);for(var s=0;s<t.length;s++)Xn(t[s])}(e)})}function Vn(e){var t=e.cm,r=t.display;!function(e){var t=e.display;!t.scrollbarsClipped&&t.scroller.offsetWidth&&(t.nativeBarWidth=t.scroller.offsetWidth-t.scroller.clientWidth,t.heightForcer.style.height=kr(e)+"px",t.sizer.style.marginBottom=-t.nativeBarWidth+"px",t.sizer.style.borderRightWidth=kr(e)+"px",t.scrollbarsClipped=!0)}(t),e.updateMaxLine&&_e(t),e.mustUpdate=e.viewChanged||e.forceUpdate||null!=e.scrollTop||e.scrollToPos&&(e.scrollToPos.from.line<r.viewFrom||e.scrollToPos.to.line>=r.viewTo)||r.maxLineChanged&&t.options.lineWrapping,e.update=e.mustUpdate&&new ii(t,e.mustUpdate&&{top:e.scrollTop,ensure:e.scrollToPos},e.forceUpdate)}function Kn(e){var t=e.cm,r=t.display;e.updatedDisplay&&bn(t),e.barMeasure=Hn(t),r.maxLineChanged&&!t.options.lineWrapping&&(e.adjustWidthTo=Or(t,r.maxLine,r.maxLine.text.length).left+3,t.display.sizerWidth=e.adjustWidthTo,e.barMeasure.scrollWidth=Math.max(r.scroller.clientWidth,r.sizer.offsetLeft+e.adjustWidthTo+kr(t)+t.display.barWidth),e.maxScrollLeft=Math.max(0,r.sizer.offsetLeft+e.adjustWidthTo-Tr(t))),(e.updatedDisplay||e.selectionChanged)&&(e.preparedSelection=r.input.prepareSelection())}function jn(e){var t=e.cm;null!=e.adjustWidthTo&&(t.display.sizer.style.minWidth=e.adjustWidthTo+"px",e.maxScrollLeft<t.doc.scrollLeft&&Wn(t,Math.min(t.display.scroller.scrollLeft,e.maxScrollLeft),!0),t.display.maxLineChanged=!1);var r=e.focus&&e.focus==W();e.preparedSelection&&t.display.input.showSelection(e.preparedSelection,r),(e.updatedDisplay||e.startHeight!=t.doc.height)&&En(t,e.barMeasure),e.updatedDisplay&&ui(t,e.barMeasure),e.selectionChanged&&pn(t),t.state.focused&&e.updateInput&&t.display.input.reset(e.typing),r&&gn(e.cm)}function Xn(e){var t=e.cm,r=t.display,n=t.doc;(e.updatedDisplay&&li(t,e.update),null==r.wheelStartX||null==e.scrollTop&&null==e.scrollLeft&&!e.scrollToPos||(r.wheelStartX=r.wheelStartY=null),null!=e.scrollTop&&Dn(t,e.scrollTop,e.forceScroll),null!=e.scrollLeft&&Wn(t,e.scrollLeft,!0,!0),e.scrollToPos)&&function(e,t){if(!it(e,"scrollCursorIntoView")){var r=e.display,n=r.sizer.getBoundingClientRect(),i=null;if(t.top+n.top<0?i=!0:t.bottom+n.top>(window.innerHeight||document.documentElement.clientHeight)&&(i=!1),null!=i&&!p){var o=O("div","\u200b",null,"position: absolute;\n                         top: "+(t.top-r.viewOffset-Cr(e.display))+"px;\n                         height: "+(t.bottom-t.top+kr(e)+r.barHeight)+"px;\n                         left: "+t.left+"px; width: "+Math.max(2,t.right-t.left)+"px;");e.display.lineSpace.appendChild(o),o.scrollIntoView(i),e.display.lineSpace.removeChild(o)}}}(t,function(e,t,r,n){var i;null==n&&(n=0),e.options.lineWrapping||t!=r||(r="before"==(t=t.ch?ge(t.line,"before"==t.sticky?t.ch-1:t.ch,"after"):t).sticky?ge(t.line,t.ch+1,"before"):t);for(var o=0;o<5;o++){var l=!1,s=Xr(e,t),a=r&&r!=t?Xr(e,r):s,u=Ln(e,i={left:Math.min(s.left,a.left),top:Math.min(s.top,a.top)-n,right:Math.max(s.left,a.left),bottom:Math.max(s.bottom,a.bottom)+n}),c=e.doc.scrollTop,h=e.doc.scrollLeft;if(null!=u.scrollTop&&(An(e,u.scrollTop),Math.abs(e.doc.scrollTop-c)>1&&(l=!0)),null!=u.scrollLeft&&(Wn(e,u.scrollLeft),Math.abs(e.doc.scrollLeft-h)>1&&(l=!0)),!l)break}return i}(t,Ce(n,e.scrollToPos.from),Ce(n,e.scrollToPos.to),e.scrollToPos.margin));var i=e.maybeHiddenMarkers,o=e.maybeUnhiddenMarkers;if(i)for(var l=0;l<i.length;++l)i[l].lines.length||nt(i[l],"hide");if(o)for(var s=0;s<o.length;++s)o[s].lines.length&&nt(o[s],"unhide");r.wrapper.offsetHeight&&(n.scrollTop=t.display.scroller.scrollTop),e.changeObjs&&nt(t,"changes",t,e.changeObjs),e.update&&e.update.finish()}function Yn(e,t){if(e.curOp)return t();Gn(e);try{return t()}finally{Un(e)}}function _n(e,t){return function(){if(e.curOp)return t.apply(e,arguments);Gn(e);try{return t.apply(e,arguments)}finally{Un(e)}}}function $n(e){return function(){if(this.curOp)return e.apply(this,arguments);Gn(this);try{return e.apply(this,arguments)}finally{Un(this)}}}function qn(e){return function(){var t=this.cm;if(!t||t.curOp)return e.apply(this,arguments);Gn(t);try{return e.apply(this,arguments)}finally{Un(t)}}}function Zn(e,t,r,n){null==t&&(t=e.doc.first),null==r&&(r=e.doc.first+e.doc.size),n||(n=0);var i=e.display;if(n&&r<i.viewTo&&(null==i.updateLineNumbers||i.updateLineNumbers>t)&&(i.updateLineNumbers=t),e.curOp.viewChanged=!0,t>=i.viewTo)ke&&Ue(e.doc,t)<i.viewTo&&Jn(e);else if(r<=i.viewFrom)ke&&Ve(e.doc,r+n)>i.viewFrom?Jn(e):(i.viewFrom+=n,i.viewTo+=n);else if(t<=i.viewFrom&&r>=i.viewTo)Jn(e);else if(t<=i.viewFrom){var o=ei(e,r,r+n,1);o?(i.view=i.view.slice(o.index),i.viewFrom=o.lineN,i.viewTo+=n):Jn(e)}else if(r>=i.viewTo){var l=ei(e,t,t,-1);l?(i.view=i.view.slice(0,l.index),i.viewTo=l.lineN):Jn(e)}else{var s=ei(e,t,t,-1),a=ei(e,r,r+n,1);s&&a?(i.view=i.view.slice(0,s.index).concat(ir(e,s.lineN,a.lineN)).concat(i.view.slice(a.index)),i.viewTo+=n):Jn(e)}var u=i.externalMeasured;u&&(r<u.lineN?u.lineN+=n:t<u.lineN+u.size&&(i.externalMeasured=null))}function Qn(e,t,r){e.curOp.viewChanged=!0;var n=e.display,i=e.display.externalMeasured;if(i&&t>=i.lineN&&t<i.lineN+i.size&&(n.externalMeasured=null),!(t<n.viewFrom||t>=n.viewTo)){var o=n.view[an(e,t)];if(null!=o.node){var l=o.changes||(o.changes=[]);-1==B(l,r)&&l.push(r)}}}function Jn(e){e.display.viewFrom=e.display.viewTo=e.doc.first,e.display.view=[],e.display.viewOffset=0}function ei(e,t,r,n){var i,o=an(e,t),l=e.display.view;if(!ke||r==e.doc.first+e.doc.size)return{index:o,lineN:r};for(var s=e.display.viewFrom,a=0;a<o;a++)s+=l[a].size;if(s!=t){if(n>0){if(o==l.length-1)return null;i=s+l[o].size-t,o++}else i=s-t;t+=i,r+=i}for(;Ue(e.doc,r)!=r;){if(o==(n<0?0:l.length-1))return null;r+=n*l[o-(n<0?1:0)].size,o+=n}return{index:o,lineN:r}}function ti(e){for(var t=e.display.view,r=0,n=0;n<t.length;n++){var i=t[n];i.hidden||i.node&&!i.changes||++r}return r}function ri(e,t){e.doc.highlightFrontier<e.display.viewTo&&e.state.highlight.set(t,E(ni,e))}function ni(e){var t=e.doc;if(!(t.highlightFrontier>=e.display.viewTo)){var r=+new Date+e.options.workTime,n=zt(e,t.highlightFrontier),i=[];t.iter(n.line,Math.min(t.first+t.size,e.display.viewTo+500),function(o){if(n.line>=e.display.viewFrom){var l=o.styles,s=o.text.length>e.options.maxHighlightLength?At(t.mode,n.state):null,a=Et(e,o,n,!0);s&&(n.state=s),o.styles=a.styles;var u=o.styleClasses,c=a.classes;c?o.styleClasses=c:u&&(o.styleClasses=null);for(var h=!l||l.length!=o.styles.length||u!=c&&(!u||!c||u.bgClass!=c.bgClass||u.textClass!=c.textClass),f=0;!h&&f<l.length;++f)h=l[f]!=o.styles[f];h&&i.push(n.line),o.stateAfter=n.save(),n.nextLine()}else o.text.length<=e.options.maxHighlightLength&&Rt(e,o.text,n),o.stateAfter=n.line%5==0?n.save():null,n.nextLine();if(+new Date>r)return ri(e,e.options.workDelay),!0}),t.highlightFrontier=n.line,t.modeFrontier=Math.max(t.modeFrontier,n.line),i.length&&Yn(e,function(){for(var t=0;t<i.length;t++)Qn(e,i[t],"text")})}}var ii=function(e,t,r){var n=e.display;this.viewport=t,this.visible=xn(n,e.doc,t),this.editorIsHidden=!n.wrapper.offsetWidth,this.wrapperHeight=n.wrapper.clientHeight,this.wrapperWidth=n.wrapper.clientWidth,this.oldDisplayWidth=Tr(e),this.force=r,this.dims=rn(e),this.events=[]};function oi(e,t){var r=e.display,n=e.doc;if(t.editorIsHidden)return Jn(e),!1;if(!t.force&&t.visible.from>=r.viewFrom&&t.visible.to<=r.viewTo&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo)&&r.renderedView==r.view&&0==ti(e))return!1;Sn(e)&&(Jn(e),t.dims=rn(e));var i=n.first+n.size,o=Math.max(t.visible.from-e.options.viewportMargin,n.first),l=Math.min(i,t.visible.to+e.options.viewportMargin);r.viewFrom<o&&o-r.viewFrom<20&&(o=Math.max(n.first,r.viewFrom)),r.viewTo>l&&r.viewTo-l<20&&(l=Math.min(i,r.viewTo)),ke&&(o=Ue(e.doc,o),l=Ve(e.doc,l));var s=o!=r.viewFrom||l!=r.viewTo||r.lastWrapHeight!=t.wrapperHeight||r.lastWrapWidth!=t.wrapperWidth;!function(e,t,r){var n=e.display;0==n.view.length||t>=n.viewTo||r<=n.viewFrom?(n.view=ir(e,t,r),n.viewFrom=t):(n.viewFrom>t?n.view=ir(e,t,n.viewFrom).concat(n.view):n.viewFrom<t&&(n.view=n.view.slice(an(e,t))),n.viewFrom=t,n.viewTo<r?n.view=n.view.concat(ir(e,n.viewTo,r)):n.viewTo>r&&(n.view=n.view.slice(0,an(e,r)))),n.viewTo=r}(e,o,l),r.viewOffset=Xe(se(e.doc,r.viewFrom)),e.display.mover.style.top=r.viewOffset+"px";var u=ti(e);if(!s&&0==u&&!t.force&&r.renderedView==r.view&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo))return!1;var c=function(e){if(e.hasFocus())return null;var t=W();if(!t||!D(e.display.lineDiv,t))return null;var r={activeElt:t};if(window.getSelection){var n=window.getSelection();n.anchorNode&&n.extend&&D(e.display.lineDiv,n.anchorNode)&&(r.anchorNode=n.anchorNode,r.anchorOffset=n.anchorOffset,r.focusNode=n.focusNode,r.focusOffset=n.focusOffset)}return r}(e);return u>4&&(r.lineDiv.style.display="none"),function(e,t,r){var n=e.display,i=e.options.lineNumbers,o=n.lineDiv,l=o.firstChild;function s(t){var r=t.nextSibling;return a&&y&&e.display.currentWheelTarget==t?t.style.display="none":t.parentNode.removeChild(t),r}for(var u=n.view,c=n.viewFrom,h=0;h<u.length;h++){var f=u[h];if(f.hidden);else if(f.node&&f.node.parentNode==o){for(;l!=f.node;)l=s(l);var d=i&&null!=t&&t<=c&&f.lineNumber;f.changes&&(B(f.changes,"gutter")>-1&&(d=!1),ur(e,f,c,r)),d&&(M(f.lineNumber),f.lineNumber.appendChild(document.createTextNode(pe(e.options,c)))),l=f.node.nextSibling}else{var p=vr(e,f,c,r);o.insertBefore(p,l)}c+=f.size}for(;l;)l=s(l)}(e,r.updateLineNumbers,t.dims),u>4&&(r.lineDiv.style.display=""),r.renderedView=r.view,function(e){if(e&&e.activeElt&&e.activeElt!=W()&&(e.activeElt.focus(),e.anchorNode&&D(document.body,e.anchorNode)&&D(document.body,e.focusNode))){var t=window.getSelection(),r=document.createRange();r.setEnd(e.anchorNode,e.anchorOffset),r.collapse(!1),t.removeAllRanges(),t.addRange(r),t.extend(e.focusNode,e.focusOffset)}}(c),M(r.cursorDiv),M(r.selectionDiv),r.gutters.style.height=r.sizer.style.minHeight=0,s&&(r.lastWrapHeight=t.wrapperHeight,r.lastWrapWidth=t.wrapperWidth,ri(e,400)),r.updateLineNumbers=null,!0}function li(e,t){for(var r=t.viewport,n=!0;(n&&e.options.lineWrapping&&t.oldDisplayWidth!=Tr(e)||(r&&null!=r.top&&(r={top:Math.min(e.doc.height+Sr(e.display)-Mr(e),r.top)}),t.visible=xn(e.display,e.doc,r),!(t.visible.from>=e.display.viewFrom&&t.visible.to<=e.display.viewTo)))&&oi(e,t);n=!1){bn(e);var i=Hn(e);un(e),En(e,i),ui(e,i),t.force=!1}t.signal(e,"update",e),e.display.viewFrom==e.display.reportedViewFrom&&e.display.viewTo==e.display.reportedViewTo||(t.signal(e,"viewportChange",e,e.display.viewFrom,e.display.viewTo),e.display.reportedViewFrom=e.display.viewFrom,e.display.reportedViewTo=e.display.viewTo)}function si(e,t){var r=new ii(e,t);if(oi(e,r)){bn(e),li(e,r);var n=Hn(e);un(e),En(e,n),ui(e,n),r.finish()}}function ai(e){var t=e.display.gutters.offsetWidth;e.display.sizer.style.marginLeft=t+"px"}function ui(e,t){e.display.sizer.style.minHeight=t.docHeight+"px",e.display.heightForcer.style.top=t.docHeight+"px",e.display.gutters.style.height=t.docHeight+e.display.barHeight+kr(e)+"px"}function ci(e){var t=e.display.gutters,r=e.options.gutters;M(t);for(var n=0;n<r.length;++n){var i=r[n],o=t.appendChild(O("div",null,"CodeMirror-gutter "+i));"CodeMirror-linenumbers"==i&&(e.display.lineGutter=o,o.style.width=(e.display.lineNumWidth||1)+"px")}t.style.display=n?"":"none",ai(e)}function hi(e){var t=B(e.gutters,"CodeMirror-linenumbers");-1==t&&e.lineNumbers?e.gutters=e.gutters.concat(["CodeMirror-linenumbers"]):t>-1&&!e.lineNumbers&&(e.gutters=e.gutters.slice(0),e.gutters.splice(t,1))}ii.prototype.signal=function(e,t){lt(e,t)&&this.events.push(arguments)},ii.prototype.finish=function(){for(var e=0;e<this.events.length;e++)nt.apply(null,this.events[e])};var fi=0,di=null;function pi(e){var t=e.wheelDeltaX,r=e.wheelDeltaY;return null==t&&e.detail&&e.axis==e.HORIZONTAL_AXIS&&(t=e.detail),null==r&&e.detail&&e.axis==e.VERTICAL_AXIS?r=e.detail:null==r&&(r=e.wheelDelta),{x:t,y:r}}function gi(e){var t=pi(e);return t.x*=di,t.y*=di,t}function vi(e,t){var n=pi(t),i=n.x,o=n.y,l=e.display,s=l.scroller,u=s.scrollWidth>s.clientWidth,c=s.scrollHeight>s.clientHeight;if(i&&u||o&&c){if(o&&y&&a)e:for(var f=t.target,d=l.view;f!=s;f=f.parentNode)for(var p=0;p<d.length;p++)if(d[p].node==f){e.display.currentWheelTarget=f;break e}if(i&&!r&&!h&&null!=di)return o&&c&&An(e,Math.max(0,s.scrollTop+o*di)),Wn(e,Math.max(0,s.scrollLeft+i*di)),(!o||o&&c)&&at(t),void(l.wheelStartX=null);if(o&&null!=di){var g=o*di,v=e.doc.scrollTop,m=v+l.wrapper.clientHeight;g<0?v=Math.max(0,v+g-50):m=Math.min(e.doc.height,m+g+50),si(e,{top:v,bottom:m})}fi<20&&(null==l.wheelStartX?(l.wheelStartX=s.scrollLeft,l.wheelStartY=s.scrollTop,l.wheelDX=i,l.wheelDY=o,setTimeout(function(){if(null!=l.wheelStartX){var e=s.scrollLeft-l.wheelStartX,t=s.scrollTop-l.wheelStartY,r=t&&l.wheelDY&&t/l.wheelDY||e&&l.wheelDX&&e/l.wheelDX;l.wheelStartX=l.wheelStartY=null,r&&(di=(di*fi+r)/(fi+1),++fi)}},200)):(l.wheelDX+=i,l.wheelDY+=o))}}l?di=-.53:r?di=15:c?di=-.7:f&&(di=-1/3);var mi=function(e,t){this.ranges=e,this.primIndex=t};mi.prototype.primary=function(){return this.ranges[this.primIndex]},mi.prototype.equals=function(e){if(e==this)return!0;if(e.primIndex!=this.primIndex||e.ranges.length!=this.ranges.length)return!1;for(var t=0;t<this.ranges.length;t++){var r=this.ranges[t],n=e.ranges[t];if(!me(r.anchor,n.anchor)||!me(r.head,n.head))return!1}return!0},mi.prototype.deepCopy=function(){for(var e=[],t=0;t<this.ranges.length;t++)e[t]=new yi(ye(this.ranges[t].anchor),ye(this.ranges[t].head));return new mi(e,this.primIndex)},mi.prototype.somethingSelected=function(){for(var e=0;e<this.ranges.length;e++)if(!this.ranges[e].empty())return!0;return!1},mi.prototype.contains=function(e,t){t||(t=e);for(var r=0;r<this.ranges.length;r++){var n=this.ranges[r];if(ve(t,n.from())>=0&&ve(e,n.to())<=0)return r}return-1};var yi=function(e,t){this.anchor=e,this.head=t};function bi(e,t){var r=e[t];e.sort(function(e,t){return ve(e.from(),t.from())}),t=B(e,r);for(var n=1;n<e.length;n++){var i=e[n],o=e[n-1];if(ve(o.to(),i.from())>=0){var l=we(o.from(),i.from()),s=be(o.to(),i.to()),a=o.empty()?i.from()==i.head:o.from()==o.head;n<=t&&--t,e.splice(--n,2,new yi(a?s:l,a?l:s))}}return new mi(e,t)}function wi(e,t){return new mi([new yi(e,t||e)],0)}function xi(e){return e.text?ge(e.from.line+e.text.length-1,$(e.text).length+(1==e.text.length?e.from.ch:0)):e.to}function Ci(e,t){if(ve(e,t.from)<0)return e;if(ve(e,t.to)<=0)return xi(t);var r=e.line+t.text.length-(t.to.line-t.from.line)-1,n=e.ch;return e.line==t.to.line&&(n+=xi(t).ch-t.to.ch),ge(r,n)}function Si(e,t){for(var r=[],n=0;n<e.sel.ranges.length;n++){var i=e.sel.ranges[n];r.push(new yi(Ci(i.anchor,t),Ci(i.head,t)))}return bi(r,e.sel.primIndex)}function Li(e,t,r){return e.line==t.line?ge(r.line,e.ch-t.ch+r.ch):ge(r.line+(e.line-t.line),e.ch)}function ki(e){e.doc.mode=Mt(e.options,e.doc.modeOption),Ti(e)}function Ti(e){e.doc.iter(function(e){e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null)}),e.doc.modeFrontier=e.doc.highlightFrontier=e.doc.first,ri(e,100),e.state.modeGen++,e.curOp&&Zn(e)}function Mi(e,t){return 0==t.from.ch&&0==t.to.ch&&""==$(t.text)&&(!e.cm||e.cm.options.wholeLineUpdateBefore)}function Ni(e,t,r,n){function i(e){return r?r[e]:null}function o(e,r,i){!function(e,t,r,n){e.text=t,e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null),null!=e.order&&(e.order=null),De(e),We(e,r);var i=n?n(e):1;i!=e.height&&ce(e,i)}(e,r,i,n),sr(e,"change",e,t)}function l(e,t){for(var r=[],o=e;o<t;++o)r.push(new Xt(u[o],i(o),n));return r}var s=t.from,a=t.to,u=t.text,c=se(e,s.line),h=se(e,a.line),f=$(u),d=i(u.length-1),p=a.line-s.line;if(t.full)e.insert(0,l(0,u.length)),e.remove(u.length,e.size-u.length);else if(Mi(e,t)){var g=l(0,u.length-1);o(h,h.text,d),p&&e.remove(s.line,p),g.length&&e.insert(s.line,g)}else if(c==h)if(1==u.length)o(c,c.text.slice(0,s.ch)+f+c.text.slice(a.ch),d);else{var v=l(1,u.length-1);v.push(new Xt(f+c.text.slice(a.ch),d,n)),o(c,c.text.slice(0,s.ch)+u[0],i(0)),e.insert(s.line+1,v)}else if(1==u.length)o(c,c.text.slice(0,s.ch)+u[0]+h.text.slice(a.ch),i(0)),e.remove(s.line+1,p);else{o(c,c.text.slice(0,s.ch)+u[0],i(0)),o(h,f+h.text.slice(a.ch),d);var m=l(1,u.length-1);p>1&&e.remove(s.line+1,p-1),e.insert(s.line+1,m)}sr(e,"change",e,t)}function Oi(e,t,r){!function e(n,i,o){if(n.linked)for(var l=0;l<n.linked.length;++l){var s=n.linked[l];if(s.doc!=i){var a=o&&s.sharedHist;r&&!a||(t(s.doc,a),e(s.doc,n,a))}}}(e,null,!0)}function Ai(e,t){if(t.cm)throw new Error("This document is already in use.");e.doc=t,t.cm=e,ln(e),ki(e),Di(e),e.options.lineWrapping||_e(e),e.options.mode=t.modeOption,Zn(e)}function Di(e){("rtl"==e.doc.direction?H:T)(e.display.lineDiv,"CodeMirror-rtl")}function Wi(e){this.done=[],this.undone=[],this.undoDepth=1/0,this.lastModTime=this.lastSelTime=0,this.lastOp=this.lastSelOp=null,this.lastOrigin=this.lastSelOrigin=null,this.generation=this.maxGeneration=e||1}function Hi(e,t){var r={from:ye(t.from),to:xi(t),text:ae(e,t.from,t.to)};return zi(e,r,t.from.line,t.to.line+1),Oi(e,function(e){return zi(e,r,t.from.line,t.to.line+1)},!0),r}function Fi(e){for(;e.length;){if(!$(e).ranges)break;e.pop()}}function Pi(e,t,r,n){var i=e.history;i.undone.length=0;var o,l,s=+new Date;if((i.lastOp==n||i.lastOrigin==t.origin&&t.origin&&("+"==t.origin.charAt(0)&&i.lastModTime>s-(e.cm?e.cm.options.historyEventDelay:500)||"*"==t.origin.charAt(0)))&&(o=function(e,t){return t?(Fi(e.done),$(e.done)):e.done.length&&!$(e.done).ranges?$(e.done):e.done.length>1&&!e.done[e.done.length-2].ranges?(e.done.pop(),$(e.done)):void 0}(i,i.lastOp==n)))l=$(o.changes),0==ve(t.from,t.to)&&0==ve(t.from,l.to)?l.to=xi(t):o.changes.push(Hi(e,t));else{var a=$(i.done);for(a&&a.ranges||Ii(e.sel,i.done),o={changes:[Hi(e,t)],generation:i.generation},i.done.push(o);i.done.length>i.undoDepth;)i.done.shift(),i.done[0].ranges||i.done.shift()}i.done.push(r),i.generation=++i.maxGeneration,i.lastModTime=i.lastSelTime=s,i.lastOp=i.lastSelOp=n,i.lastOrigin=i.lastSelOrigin=t.origin,l||nt(e,"historyAdded")}function Ei(e,t,r,n){var i=e.history,o=n&&n.origin;r==i.lastSelOp||o&&i.lastSelOrigin==o&&(i.lastModTime==i.lastSelTime&&i.lastOrigin==o||function(e,t,r,n){var i=t.charAt(0);return"*"==i||"+"==i&&r.ranges.length==n.ranges.length&&r.somethingSelected()==n.somethingSelected()&&new Date-e.history.lastSelTime<=(e.cm?e.cm.options.historyEventDelay:500)}(e,o,$(i.done),t))?i.done[i.done.length-1]=t:Ii(t,i.done),i.lastSelTime=+new Date,i.lastSelOrigin=o,i.lastSelOp=r,n&&!1!==n.clearRedo&&Fi(i.undone)}function Ii(e,t){var r=$(t);r&&r.ranges&&r.equals(e)||t.push(e)}function zi(e,t,r,n){var i=t["spans_"+e.id],o=0;e.iter(Math.max(e.first,r),Math.min(e.first+e.size,n),function(r){r.markedSpans&&((i||(i=t["spans_"+e.id]={}))[o]=r.markedSpans),++o})}function Ri(e){if(!e)return null;for(var t,r=0;r<e.length;++r)e[r].marker.explicitlyCleared?t||(t=e.slice(0,r)):t&&t.push(e[r]);return t?t.length?t:null:e}function Bi(e,t){var r=function(e,t){var r=t["spans_"+e.id];if(!r)return null;for(var n=[],i=0;i<t.text.length;++i)n.push(Ri(r[i]));return n}(e,t),n=Oe(e,t);if(!r)return n;if(!n)return r;for(var i=0;i<r.length;++i){var o=r[i],l=n[i];if(o&&l)e:for(var s=0;s<l.length;++s){for(var a=l[s],u=0;u<o.length;++u)if(o[u].marker==a.marker)continue e;o.push(a)}else l&&(r[i]=l)}return r}function Gi(e,t,r){for(var n=[],i=0;i<e.length;++i){var o=e[i];if(o.ranges)n.push(r?mi.prototype.deepCopy.call(o):o);else{var l=o.changes,s=[];n.push({changes:s});for(var a=0;a<l.length;++a){var u=l[a],c=void 0;if(s.push({from:u.from,to:u.to,text:u.text}),t)for(var h in u)(c=h.match(/^spans_(\d+)$/))&&B(t,Number(c[1]))>-1&&($(s)[h]=u[h],delete u[h])}}}return n}function Ui(e,t,r,n){if(n){var i=e.anchor;if(r){var o=ve(t,i)<0;o!=ve(r,i)<0?(i=t,t=r):o!=ve(t,r)<0&&(t=r)}return new yi(i,t)}return new yi(r||t,t)}function Vi(e,t,r,n,i){null==i&&(i=e.cm&&(e.cm.display.shift||e.extend)),_i(e,new mi([Ui(e.sel.primary(),t,r,i)],0),n)}function Ki(e,t,r){for(var n=[],i=e.cm&&(e.cm.display.shift||e.extend),o=0;o<e.sel.ranges.length;o++)n[o]=Ui(e.sel.ranges[o],t[o],null,i);_i(e,bi(n,e.sel.primIndex),r)}function ji(e,t,r,n){var i=e.sel.ranges.slice(0);i[t]=r,_i(e,bi(i,e.sel.primIndex),n)}function Xi(e,t,r,n){_i(e,wi(t,r),n)}function Yi(e,t,r){var n=e.history.done,i=$(n);i&&i.ranges?(n[n.length-1]=t,$i(e,t,r)):_i(e,t,r)}function _i(e,t,r){$i(e,t,r),Ei(e,e.sel,e.cm?e.cm.curOp.id:NaN,r)}function $i(e,t,r){(lt(e,"beforeSelectionChange")||e.cm&&lt(e.cm,"beforeSelectionChange"))&&(t=function(e,t,r){var n={ranges:t.ranges,update:function(t){this.ranges=[];for(var r=0;r<t.length;r++)this.ranges[r]=new yi(Ce(e,t[r].anchor),Ce(e,t[r].head))},origin:r&&r.origin};return nt(e,"beforeSelectionChange",e,n),e.cm&&nt(e.cm,"beforeSelectionChange",e.cm,n),n.ranges!=t.ranges?bi(n.ranges,n.ranges.length-1):t}(e,t,r)),qi(e,Qi(e,t,r&&r.bias||(ve(t.primary().head,e.sel.primary().head)<0?-1:1),!0)),r&&!1===r.scroll||!e.cm||Tn(e.cm)}function qi(e,t){t.equals(e.sel)||(e.sel=t,e.cm&&(e.cm.curOp.updateInput=e.cm.curOp.selectionChanged=!0,ot(e.cm)),sr(e,"cursorActivity",e))}function Zi(e){qi(e,Qi(e,e.sel,null,!1))}function Qi(e,t,r,n){for(var i,o=0;o<t.ranges.length;o++){var l=t.ranges[o],s=t.ranges.length==e.sel.ranges.length&&e.sel.ranges[o],a=eo(e,l.anchor,s&&s.anchor,r,n),u=eo(e,l.head,s&&s.head,r,n);(i||a!=l.anchor||u!=l.head)&&(i||(i=t.ranges.slice(0,o)),i[o]=new yi(a,u))}return i?bi(i,t.primIndex):t}function Ji(e,t,r,n,i){var o=se(e,t.line);if(o.markedSpans)for(var l=0;l<o.markedSpans.length;++l){var s=o.markedSpans[l],a=s.marker;if((null==s.from||(a.inclusiveLeft?s.from<=t.ch:s.from<t.ch))&&(null==s.to||(a.inclusiveRight?s.to>=t.ch:s.to>t.ch))){if(i&&(nt(a,"beforeCursorEnter"),a.explicitlyCleared)){if(o.markedSpans){--l;continue}break}if(!a.atomic)continue;if(r){var u=a.find(n<0?1:-1),c=void 0;if((n<0?a.inclusiveRight:a.inclusiveLeft)&&(u=to(e,u,-n,u&&u.line==t.line?o:null)),u&&u.line==t.line&&(c=ve(u,r))&&(n<0?c<0:c>0))return Ji(e,u,t,n,i)}var h=a.find(n<0?-1:1);return(n<0?a.inclusiveLeft:a.inclusiveRight)&&(h=to(e,h,n,h.line==t.line?o:null)),h?Ji(e,h,t,n,i):null}}return t}function eo(e,t,r,n,i){var o=n||1,l=Ji(e,t,r,o,i)||!i&&Ji(e,t,r,o,!0)||Ji(e,t,r,-o,i)||!i&&Ji(e,t,r,-o,!0);return l||(e.cantEdit=!0,ge(e.first,0))}function to(e,t,r,n){return r<0&&0==t.ch?t.line>e.first?Ce(e,ge(t.line-1)):null:r>0&&t.ch==(n||se(e,t.line)).text.length?t.line<e.first+e.size-1?ge(t.line+1,0):null:new ge(t.line,t.ch+r)}function ro(e){e.setSelection(ge(e.firstLine(),0),ge(e.lastLine()),V)}function no(e,t,r){var n={canceled:!1,from:t.from,to:t.to,text:t.text,origin:t.origin,cancel:function(){return n.canceled=!0}};return r&&(n.update=function(t,r,i,o){t&&(n.from=Ce(e,t)),r&&(n.to=Ce(e,r)),i&&(n.text=i),void 0!==o&&(n.origin=o)}),nt(e,"beforeChange",e,n),e.cm&&nt(e.cm,"beforeChange",e.cm,n),n.canceled?null:{from:n.from,to:n.to,text:n.text,origin:n.origin}}function io(e,t,r){if(e.cm){if(!e.cm.curOp)return _n(e.cm,io)(e,t,r);if(e.cm.state.suppressEdits)return}if(!(lt(e,"beforeChange")||e.cm&&lt(e.cm,"beforeChange"))||(t=no(e,t,!0))){var n=Le&&!r&&function(e,t,r){var n=null;if(e.iter(t.line,r.line+1,function(e){if(e.markedSpans)for(var t=0;t<e.markedSpans.length;++t){var r=e.markedSpans[t].marker;!r.readOnly||n&&-1!=B(n,r)||(n||(n=[])).push(r)}}),!n)return null;for(var i=[{from:t,to:r}],o=0;o<n.length;++o)for(var l=n[o],s=l.find(0),a=0;a<i.length;++a){var u=i[a];if(!(ve(u.to,s.from)<0||ve(u.from,s.to)>0)){var c=[a,1],h=ve(u.from,s.from),f=ve(u.to,s.to);(h<0||!l.inclusiveLeft&&!h)&&c.push({from:u.from,to:s.from}),(f>0||!l.inclusiveRight&&!f)&&c.push({from:s.to,to:u.to}),i.splice.apply(i,c),a+=c.length-3}}return i}(e,t.from,t.to);if(n)for(var i=n.length-1;i>=0;--i)oo(e,{from:n[i].from,to:n[i].to,text:i?[""]:t.text,origin:t.origin});else oo(e,t)}}function oo(e,t){if(1!=t.text.length||""!=t.text[0]||0!=ve(t.from,t.to)){var r=Si(e,t);Pi(e,t,r,e.cm?e.cm.curOp.id:NaN),ao(e,t,r,Oe(e,t));var n=[];Oi(e,function(e,r){r||-1!=B(n,e.history)||(fo(e.history,t),n.push(e.history)),ao(e,t,null,Oe(e,t))})}}function lo(e,t,r){var n=e.cm&&e.cm.state.suppressEdits;if(!n||r){for(var i,o=e.history,l=e.sel,s="undo"==t?o.done:o.undone,a="undo"==t?o.undone:o.done,u=0;u<s.length&&(i=s[u],r?!i.ranges||i.equals(e.sel):i.ranges);u++);if(u!=s.length){for(o.lastOrigin=o.lastSelOrigin=null;;){if(!(i=s.pop()).ranges){if(n)return void s.push(i);break}if(Ii(i,a),r&&!i.equals(e.sel))return void _i(e,i,{clearRedo:!1});l=i}var c=[];Ii(l,a),a.push({changes:c,generation:o.generation}),o.generation=i.generation||++o.maxGeneration;for(var h=lt(e,"beforeChange")||e.cm&&lt(e.cm,"beforeChange"),f=function(r){var n=i.changes[r];if(n.origin=t,h&&!no(e,n,!1))return s.length=0,{};c.push(Hi(e,n));var o=r?Si(e,n):$(s);ao(e,n,o,Bi(e,n)),!r&&e.cm&&e.cm.scrollIntoView({from:n.from,to:xi(n)});var l=[];Oi(e,function(e,t){t||-1!=B(l,e.history)||(fo(e.history,n),l.push(e.history)),ao(e,n,null,Bi(e,n))})},d=i.changes.length-1;d>=0;--d){var p=f(d);if(p)return p.v}}}}function so(e,t){if(0!=t&&(e.first+=t,e.sel=new mi(q(e.sel.ranges,function(e){return new yi(ge(e.anchor.line+t,e.anchor.ch),ge(e.head.line+t,e.head.ch))}),e.sel.primIndex),e.cm)){Zn(e.cm,e.first,e.first-t,t);for(var r=e.cm.display,n=r.viewFrom;n<r.viewTo;n++)Qn(e.cm,n,"gutter")}}function ao(e,t,r,n){if(e.cm&&!e.cm.curOp)return _n(e.cm,ao)(e,t,r,n);if(t.to.line<e.first)so(e,t.text.length-1-(t.to.line-t.from.line));else if(!(t.from.line>e.lastLine())){if(t.from.line<e.first){var i=t.text.length-1-(e.first-t.from.line);so(e,i),t={from:ge(e.first,0),to:ge(t.to.line+i,t.to.ch),text:[$(t.text)],origin:t.origin}}var o=e.lastLine();t.to.line>o&&(t={from:t.from,to:ge(o,se(e,o).text.length),text:[t.text[0]],origin:t.origin}),t.removed=ae(e,t.from,t.to),r||(r=Si(e,t)),e.cm?function(e,t,r){var n=e.doc,i=e.display,o=t.from,l=t.to,s=!1,a=o.line;e.options.lineWrapping||(a=he(Ge(se(n,o.line))),n.iter(a,l.line+1,function(e){if(e==i.maxLine)return s=!0,!0}));n.sel.contains(t.from,t.to)>-1&&ot(e);Ni(n,t,r,on(e)),e.options.lineWrapping||(n.iter(a,o.line+t.text.length,function(e){var t=Ye(e);t>i.maxLineLength&&(i.maxLine=e,i.maxLineLength=t,i.maxLineChanged=!0,s=!1)}),s&&(e.curOp.updateMaxLine=!0));(function(e,t){if(e.modeFrontier=Math.min(e.modeFrontier,t),!(e.highlightFrontier<t-10)){for(var r=e.first,n=t-1;n>r;n--){var i=se(e,n).stateAfter;if(i&&(!(i instanceof Ft)||n+i.lookAhead<t)){r=n+1;break}}e.highlightFrontier=Math.min(e.highlightFrontier,r)}})(n,o.line),ri(e,400);var u=t.text.length-(l.line-o.line)-1;t.full?Zn(e):o.line!=l.line||1!=t.text.length||Mi(e.doc,t)?Zn(e,o.line,l.line+1,u):Qn(e,o.line,"text");var c=lt(e,"changes"),h=lt(e,"change");if(h||c){var f={from:o,to:l,text:t.text,removed:t.removed,origin:t.origin};h&&sr(e,"change",e,f),c&&(e.curOp.changeObjs||(e.curOp.changeObjs=[])).push(f)}e.display.selForContextMenu=null}(e.cm,t,n):Ni(e,t,n),$i(e,r,V)}}function uo(e,t,r,n,i){var o;(n||(n=r),ve(n,r)<0)&&(r=(o=[n,r])[0],n=o[1]);"string"==typeof t&&(t=e.splitLines(t)),io(e,{from:r,to:n,text:t,origin:i})}function co(e,t,r,n){r<e.line?e.line+=n:t<e.line&&(e.line=t,e.ch=0)}function ho(e,t,r,n){for(var i=0;i<e.length;++i){var o=e[i],l=!0;if(o.ranges){o.copied||((o=e[i]=o.deepCopy()).copied=!0);for(var s=0;s<o.ranges.length;s++)co(o.ranges[s].anchor,t,r,n),co(o.ranges[s].head,t,r,n)}else{for(var a=0;a<o.changes.length;++a){var u=o.changes[a];if(r<u.from.line)u.from=ge(u.from.line+n,u.from.ch),u.to=ge(u.to.line+n,u.to.ch);else if(t<=u.to.line){l=!1;break}}l||(e.splice(0,i+1),i=0)}}}function fo(e,t){var r=t.from.line,n=t.to.line,i=t.text.length-(n-r)-1;ho(e.done,r,n,i),ho(e.undone,r,n,i)}function po(e,t,r,n){var i=t,o=t;return"number"==typeof t?o=se(e,xe(e,t)):i=he(t),null==i?null:(n(o,i)&&e.cm&&Qn(e.cm,i,r),o)}function go(e){this.lines=e,this.parent=null;for(var t=0,r=0;r<e.length;++r)e[r].parent=this,t+=e[r].height;this.height=t}function vo(e){this.children=e;for(var t=0,r=0,n=0;n<e.length;++n){var i=e[n];t+=i.chunkSize(),r+=i.height,i.parent=this}this.size=t,this.height=r,this.parent=null}yi.prototype.from=function(){return we(this.anchor,this.head)},yi.prototype.to=function(){return be(this.anchor,this.head)},yi.prototype.empty=function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch},go.prototype={chunkSize:function(){return this.lines.length},removeInner:function(e,t){for(var r=e,n=e+t;r<n;++r){var i=this.lines[r];this.height-=i.height,Yt(i),sr(i,"delete")}this.lines.splice(e,t)},collapse:function(e){e.push.apply(e,this.lines)},insertInner:function(e,t,r){this.height+=r,this.lines=this.lines.slice(0,e).concat(t).concat(this.lines.slice(e));for(var n=0;n<t.length;++n)t[n].parent=this},iterN:function(e,t,r){for(var n=e+t;e<n;++e)if(r(this.lines[e]))return!0}},vo.prototype={chunkSize:function(){return this.size},removeInner:function(e,t){this.size-=t;for(var r=0;r<this.children.length;++r){var n=this.children[r],i=n.chunkSize();if(e<i){var o=Math.min(t,i-e),l=n.height;if(n.removeInner(e,o),this.height-=l-n.height,i==o&&(this.children.splice(r--,1),n.parent=null),0==(t-=o))break;e=0}else e-=i}if(this.size-t<25&&(this.children.length>1||!(this.children[0]instanceof go))){var s=[];this.collapse(s),this.children=[new go(s)],this.children[0].parent=this}},collapse:function(e){for(var t=0;t<this.children.length;++t)this.children[t].collapse(e)},insertInner:function(e,t,r){this.size+=t.length,this.height+=r;for(var n=0;n<this.children.length;++n){var i=this.children[n],o=i.chunkSize();if(e<=o){if(i.insertInner(e,t,r),i.lines&&i.lines.length>50){for(var l=i.lines.length%25+25,s=l;s<i.lines.length;){var a=new go(i.lines.slice(s,s+=25));i.height-=a.height,this.children.splice(++n,0,a),a.parent=this}i.lines=i.lines.slice(0,l),this.maybeSpill()}break}e-=o}},maybeSpill:function(){if(!(this.children.length<=10)){var e=this;do{var t=new vo(e.children.splice(e.children.length-5,5));if(e.parent){e.size-=t.size,e.height-=t.height;var r=B(e.parent.children,e);e.parent.children.splice(r+1,0,t)}else{var n=new vo(e.children);n.parent=e,e.children=[n,t],e=n}t.parent=e.parent}while(e.children.length>10);e.parent.maybeSpill()}},iterN:function(e,t,r){for(var n=0;n<this.children.length;++n){var i=this.children[n],o=i.chunkSize();if(e<o){var l=Math.min(t,o-e);if(i.iterN(e,l,r))return!0;if(0==(t-=l))break;e=0}else e-=o}}};var mo=function(e,t,r){if(r)for(var n in r)r.hasOwnProperty(n)&&(this[n]=r[n]);this.doc=e,this.node=t};function yo(e,t,r){Xe(t)<(e.curOp&&e.curOp.scrollTop||e.doc.scrollTop)&&kn(e,r)}mo.prototype.clear=function(){var e=this.doc.cm,t=this.line.widgets,r=this.line,n=he(r);if(null!=n&&t){for(var i=0;i<t.length;++i)t[i]==this&&t.splice(i--,1);t.length||(r.widgets=null);var o=wr(this);ce(r,Math.max(0,r.height-o)),e&&(Yn(e,function(){yo(e,r,-o),Qn(e,n,"widget")}),sr(e,"lineWidgetCleared",e,this,n))}},mo.prototype.changed=function(){var e=this,t=this.height,r=this.doc.cm,n=this.line;this.height=null;var i=wr(this)-t;i&&(Ke(this.doc,n)||ce(n,n.height+i),r&&Yn(r,function(){r.curOp.forceUpdate=!0,yo(r,n,i),sr(r,"lineWidgetChanged",r,e,he(n))}))},st(mo);var bo=0,wo=function(e,t){this.lines=[],this.type=t,this.doc=e,this.id=++bo};function xo(e,t,r,n,i){if(n&&n.shared)return function(e,t,r,n,i){(n=I(n)).shared=!1;var o=[xo(e,t,r,n,i)],l=o[0],s=n.widgetNode;return Oi(e,function(e){s&&(n.widgetNode=s.cloneNode(!0)),o.push(xo(e,Ce(e,t),Ce(e,r),n,i));for(var a=0;a<e.linked.length;++a)if(e.linked[a].isParent)return;l=$(o)}),new Co(o,l)}(e,t,r,n,i);if(e.cm&&!e.cm.curOp)return _n(e.cm,xo)(e,t,r,n,i);var o=new wo(e,i),l=ve(t,r);if(n&&I(n,o,!1),l>0||0==l&&!1!==o.clearWhenEmpty)return o;if(o.replacedWith&&(o.collapsed=!0,o.widgetNode=A("span",[o.replacedWith],"CodeMirror-widget"),n.handleMouseEvents||o.widgetNode.setAttribute("cm-ignore-events","true"),n.insertLeft&&(o.widgetNode.insertLeft=!0)),o.collapsed){if(Be(e,t.line,t,r,o)||t.line!=r.line&&Be(e,r.line,t,r,o))throw new Error("Inserting collapsed marker partially overlapping an existing one");ke=!0}o.addToHistory&&Pi(e,{from:t,to:r,origin:"markText"},e.sel,NaN);var s,a=t.line,u=e.cm;if(e.iter(a,r.line+1,function(e){u&&o.collapsed&&!u.options.lineWrapping&&Ge(e)==u.display.maxLine&&(s=!0),o.collapsed&&a!=t.line&&ce(e,0),function(e,t){e.markedSpans=e.markedSpans?e.markedSpans.concat([t]):[t],t.marker.attachLine(e)}(e,new Te(o,a==t.line?t.ch:null,a==r.line?r.ch:null)),++a}),o.collapsed&&e.iter(t.line,r.line+1,function(t){Ke(e,t)&&ce(t,0)}),o.clearOnEnter&&et(o,"beforeCursorEnter",function(){return o.clear()}),o.readOnly&&(Le=!0,(e.history.done.length||e.history.undone.length)&&e.clearHistory()),o.collapsed&&(o.id=++bo,o.atomic=!0),u){if(s&&(u.curOp.updateMaxLine=!0),o.collapsed)Zn(u,t.line,r.line+1);else if(o.className||o.title||o.startStyle||o.endStyle||o.css)for(var c=t.line;c<=r.line;c++)Qn(u,c,"text");o.atomic&&Zi(u.doc),sr(u,"markerAdded",u,o)}return o}wo.prototype.clear=function(){if(!this.explicitlyCleared){var e=this.doc.cm,t=e&&!e.curOp;if(t&&Gn(e),lt(this,"clear")){var r=this.find();r&&sr(this,"clear",r.from,r.to)}for(var n=null,i=null,o=0;o<this.lines.length;++o){var l=this.lines[o],s=Me(l.markedSpans,this);e&&!this.collapsed?Qn(e,he(l),"text"):e&&(null!=s.to&&(i=he(l)),null!=s.from&&(n=he(l))),l.markedSpans=Ne(l.markedSpans,s),null==s.from&&this.collapsed&&!Ke(this.doc,l)&&e&&ce(l,en(e.display))}if(e&&this.collapsed&&!e.options.lineWrapping)for(var a=0;a<this.lines.length;++a){var u=Ge(this.lines[a]),c=Ye(u);c>e.display.maxLineLength&&(e.display.maxLine=u,e.display.maxLineLength=c,e.display.maxLineChanged=!0)}null!=n&&e&&this.collapsed&&Zn(e,n,i+1),this.lines.length=0,this.explicitlyCleared=!0,this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,e&&Zi(e.doc)),e&&sr(e,"markerCleared",e,this,n,i),t&&Un(e),this.parent&&this.parent.clear()}},wo.prototype.find=function(e,t){var r,n;null==e&&"bookmark"==this.type&&(e=1);for(var i=0;i<this.lines.length;++i){var o=this.lines[i],l=Me(o.markedSpans,this);if(null!=l.from&&(r=ge(t?o:he(o),l.from),-1==e))return r;if(null!=l.to&&(n=ge(t?o:he(o),l.to),1==e))return n}return r&&{from:r,to:n}},wo.prototype.changed=function(){var e=this,t=this.find(-1,!0),r=this,n=this.doc.cm;t&&n&&Yn(n,function(){var i=t.line,o=he(t.line),l=Ar(n,o);if(l&&(Ir(l),n.curOp.selectionChanged=n.curOp.forceUpdate=!0),n.curOp.updateMaxLine=!0,!Ke(r.doc,i)&&null!=r.height){var s=r.height;r.height=null;var a=wr(r)-s;a&&ce(i,i.height+a)}sr(n,"markerChanged",n,e)})},wo.prototype.attachLine=function(e){if(!this.lines.length&&this.doc.cm){var t=this.doc.cm.curOp;t.maybeHiddenMarkers&&-1!=B(t.maybeHiddenMarkers,this)||(t.maybeUnhiddenMarkers||(t.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(e)},wo.prototype.detachLine=function(e){if(this.lines.splice(B(this.lines,e),1),!this.lines.length&&this.doc.cm){var t=this.doc.cm.curOp;(t.maybeHiddenMarkers||(t.maybeHiddenMarkers=[])).push(this)}},st(wo);var Co=function(e,t){this.markers=e,this.primary=t;for(var r=0;r<e.length;++r)e[r].parent=this};function So(e){return e.findMarks(ge(e.first,0),e.clipPos(ge(e.lastLine())),function(e){return e.parent})}function Lo(e){for(var t=function(t){var r=e[t],n=[r.primary.doc];Oi(r.primary.doc,function(e){return n.push(e)});for(var i=0;i<r.markers.length;i++){var o=r.markers[i];-1==B(n,o.doc)&&(o.parent=null,r.markers.splice(i--,1))}},r=0;r<e.length;r++)t(r)}Co.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var e=0;e<this.markers.length;++e)this.markers[e].clear();sr(this,"clear")}},Co.prototype.find=function(e,t){return this.primary.find(e,t)},st(Co);var ko=0,To=function(e,t,r,n,i){if(!(this instanceof To))return new To(e,t,r,n,i);null==r&&(r=0),vo.call(this,[new go([new Xt("",null)])]),this.first=r,this.scrollTop=this.scrollLeft=0,this.cantEdit=!1,this.cleanGeneration=1,this.modeFrontier=this.highlightFrontier=r;var o=ge(r,0);this.sel=wi(o),this.history=new Wi(null),this.id=++ko,this.modeOption=t,this.lineSep=n,this.direction="rtl"==i?"rtl":"ltr",this.extend=!1,"string"==typeof e&&(e=this.splitLines(e)),Ni(this,{from:o,to:o,text:e}),_i(this,wi(o),V)};To.prototype=Q(vo.prototype,{constructor:To,iter:function(e,t,r){r?this.iterN(e-this.first,t-e,r):this.iterN(this.first,this.first+this.size,e)},insert:function(e,t){for(var r=0,n=0;n<t.length;++n)r+=t[n].height;this.insertInner(e-this.first,t,r)},remove:function(e,t){this.removeInner(e-this.first,t)},getValue:function(e){var t=ue(this,this.first,this.first+this.size);return!1===e?t:t.join(e||this.lineSeparator())},setValue:qn(function(e){var t=ge(this.first,0),r=this.first+this.size-1;io(this,{from:t,to:ge(r,se(this,r).text.length),text:this.splitLines(e),origin:"setValue",full:!0},!0),this.cm&&Mn(this.cm,0,0),_i(this,wi(t),V)}),replaceRange:function(e,t,r,n){uo(this,e,t=Ce(this,t),r=r?Ce(this,r):t,n)},getRange:function(e,t,r){var n=ae(this,Ce(this,e),Ce(this,t));return!1===r?n:n.join(r||this.lineSeparator())},getLine:function(e){var t=this.getLineHandle(e);return t&&t.text},getLineHandle:function(e){if(de(this,e))return se(this,e)},getLineNumber:function(e){return he(e)},getLineHandleVisualStart:function(e){return"number"==typeof e&&(e=se(this,e)),Ge(e)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(e){return Ce(this,e)},getCursor:function(e){var t=this.sel.primary();return null==e||"head"==e?t.head:"anchor"==e?t.anchor:"end"==e||"to"==e||!1===e?t.to():t.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:qn(function(e,t,r){Xi(this,Ce(this,"number"==typeof e?ge(e,t||0):e),null,r)}),setSelection:qn(function(e,t,r){Xi(this,Ce(this,e),Ce(this,t||e),r)}),extendSelection:qn(function(e,t,r){Vi(this,Ce(this,e),t&&Ce(this,t),r)}),extendSelections:qn(function(e,t){Ki(this,Se(this,e),t)}),extendSelectionsBy:qn(function(e,t){Ki(this,Se(this,q(this.sel.ranges,e)),t)}),setSelections:qn(function(e,t,r){if(e.length){for(var n=[],i=0;i<e.length;i++)n[i]=new yi(Ce(this,e[i].anchor),Ce(this,e[i].head));null==t&&(t=Math.min(e.length-1,this.sel.primIndex)),_i(this,bi(n,t),r)}}),addSelection:qn(function(e,t,r){var n=this.sel.ranges.slice(0);n.push(new yi(Ce(this,e),Ce(this,t||e))),_i(this,bi(n,n.length-1),r)}),getSelection:function(e){for(var t,r=this.sel.ranges,n=0;n<r.length;n++){var i=ae(this,r[n].from(),r[n].to());t=t?t.concat(i):i}return!1===e?t:t.join(e||this.lineSeparator())},getSelections:function(e){for(var t=[],r=this.sel.ranges,n=0;n<r.length;n++){var i=ae(this,r[n].from(),r[n].to());!1!==e&&(i=i.join(e||this.lineSeparator())),t[n]=i}return t},replaceSelection:function(e,t,r){for(var n=[],i=0;i<this.sel.ranges.length;i++)n[i]=e;this.replaceSelections(n,t,r||"+input")},replaceSelections:qn(function(e,t,r){for(var n=[],i=this.sel,o=0;o<i.ranges.length;o++){var l=i.ranges[o];n[o]={from:l.from(),to:l.to(),text:this.splitLines(e[o]),origin:r}}for(var s=t&&"end"!=t&&function(e,t,r){for(var n=[],i=ge(e.first,0),o=i,l=0;l<t.length;l++){var s=t[l],a=Li(s.from,i,o),u=Li(xi(s),i,o);if(i=s.to,o=u,"around"==r){var c=e.sel.ranges[l],h=ve(c.head,c.anchor)<0;n[l]=new yi(h?u:a,h?a:u)}else n[l]=new yi(a,a)}return new mi(n,e.sel.primIndex)}(this,n,t),a=n.length-1;a>=0;a--)io(this,n[a]);s?Yi(this,s):this.cm&&Tn(this.cm)}),undo:qn(function(){lo(this,"undo")}),redo:qn(function(){lo(this,"redo")}),undoSelection:qn(function(){lo(this,"undo",!0)}),redoSelection:qn(function(){lo(this,"redo",!0)}),setExtending:function(e){this.extend=e},getExtending:function(){return this.extend},historySize:function(){for(var e=this.history,t=0,r=0,n=0;n<e.done.length;n++)e.done[n].ranges||++t;for(var i=0;i<e.undone.length;i++)e.undone[i].ranges||++r;return{undo:t,redo:r}},clearHistory:function(){this.history=new Wi(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},changeGeneration:function(e){return e&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null),this.history.generation},isClean:function(e){return this.history.generation==(e||this.cleanGeneration)},getHistory:function(){return{done:Gi(this.history.done),undone:Gi(this.history.undone)}},setHistory:function(e){var t=this.history=new Wi(this.history.maxGeneration);t.done=Gi(e.done.slice(0),null,!0),t.undone=Gi(e.undone.slice(0),null,!0)},setGutterMarker:qn(function(e,t,r){return po(this,e,"gutter",function(e){var n=e.gutterMarkers||(e.gutterMarkers={});return n[t]=r,!r&&re(n)&&(e.gutterMarkers=null),!0})}),clearGutter:qn(function(e){var t=this;this.iter(function(r){r.gutterMarkers&&r.gutterMarkers[e]&&po(t,r,"gutter",function(){return r.gutterMarkers[e]=null,re(r.gutterMarkers)&&(r.gutterMarkers=null),!0})})}),lineInfo:function(e){var t;if("number"==typeof e){if(!de(this,e))return null;if(t=e,!(e=se(this,e)))return null}else if(null==(t=he(e)))return null;return{line:t,handle:e,text:e.text,gutterMarkers:e.gutterMarkers,textClass:e.textClass,bgClass:e.bgClass,wrapClass:e.wrapClass,widgets:e.widgets}},addLineClass:qn(function(e,t,r){return po(this,e,"gutter"==t?"gutter":"class",function(e){var n="text"==t?"textClass":"background"==t?"bgClass":"gutter"==t?"gutterClass":"wrapClass";if(e[n]){if(L(r).test(e[n]))return!1;e[n]+=" "+r}else e[n]=r;return!0})}),removeLineClass:qn(function(e,t,r){return po(this,e,"gutter"==t?"gutter":"class",function(e){var n="text"==t?"textClass":"background"==t?"bgClass":"gutter"==t?"gutterClass":"wrapClass",i=e[n];if(!i)return!1;if(null==r)e[n]=null;else{var o=i.match(L(r));if(!o)return!1;var l=o.index+o[0].length;e[n]=i.slice(0,o.index)+(o.index&&l!=i.length?" ":"")+i.slice(l)||null}return!0})}),addLineWidget:qn(function(e,t,r){return function(e,t,r,n){var i=new mo(e,r,n),o=e.cm;return o&&i.noHScroll&&(o.display.alignWidgets=!0),po(e,t,"widget",function(t){var r=t.widgets||(t.widgets=[]);if(null==i.insertAt?r.push(i):r.splice(Math.min(r.length-1,Math.max(0,i.insertAt)),0,i),i.line=t,o&&!Ke(e,t)){var n=Xe(t)<e.scrollTop;ce(t,t.height+wr(i)),n&&kn(o,i.height),o.curOp.forceUpdate=!0}return!0}),o&&sr(o,"lineWidgetAdded",o,i,"number"==typeof t?t:he(t)),i}(this,e,t,r)}),removeLineWidget:function(e){e.clear()},markText:function(e,t,r){return xo(this,Ce(this,e),Ce(this,t),r,r&&r.type||"range")},setBookmark:function(e,t){var r={replacedWith:t&&(null==t.nodeType?t.widget:t),insertLeft:t&&t.insertLeft,clearWhenEmpty:!1,shared:t&&t.shared,handleMouseEvents:t&&t.handleMouseEvents};return xo(this,e=Ce(this,e),e,r,"bookmark")},findMarksAt:function(e){var t=[],r=se(this,(e=Ce(this,e)).line).markedSpans;if(r)for(var n=0;n<r.length;++n){var i=r[n];(null==i.from||i.from<=e.ch)&&(null==i.to||i.to>=e.ch)&&t.push(i.marker.parent||i.marker)}return t},findMarks:function(e,t,r){e=Ce(this,e),t=Ce(this,t);var n=[],i=e.line;return this.iter(e.line,t.line+1,function(o){var l=o.markedSpans;if(l)for(var s=0;s<l.length;s++){var a=l[s];null!=a.to&&i==e.line&&e.ch>=a.to||null==a.from&&i!=e.line||null!=a.from&&i==t.line&&a.from>=t.ch||r&&!r(a.marker)||n.push(a.marker.parent||a.marker)}++i}),n},getAllMarks:function(){var e=[];return this.iter(function(t){var r=t.markedSpans;if(r)for(var n=0;n<r.length;++n)null!=r[n].from&&e.push(r[n].marker)}),e},posFromIndex:function(e){var t,r=this.first,n=this.lineSeparator().length;return this.iter(function(i){var o=i.text.length+n;if(o>e)return t=e,!0;e-=o,++r}),Ce(this,ge(r,t))},indexFromPos:function(e){var t=(e=Ce(this,e)).ch;if(e.line<this.first||e.ch<0)return 0;var r=this.lineSeparator().length;return this.iter(this.first,e.line,function(e){t+=e.text.length+r}),t},copy:function(e){var t=new To(ue(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep,this.direction);return t.scrollTop=this.scrollTop,t.scrollLeft=this.scrollLeft,t.sel=this.sel,t.extend=!1,e&&(t.history.undoDepth=this.history.undoDepth,t.setHistory(this.getHistory())),t},linkedDoc:function(e){e||(e={});var t=this.first,r=this.first+this.size;null!=e.from&&e.from>t&&(t=e.from),null!=e.to&&e.to<r&&(r=e.to);var n=new To(ue(this,t,r),e.mode||this.modeOption,t,this.lineSep,this.direction);return e.sharedHist&&(n.history=this.history),(this.linked||(this.linked=[])).push({doc:n,sharedHist:e.sharedHist}),n.linked=[{doc:this,isParent:!0,sharedHist:e.sharedHist}],function(e,t){for(var r=0;r<t.length;r++){var n=t[r],i=n.find(),o=e.clipPos(i.from),l=e.clipPos(i.to);if(ve(o,l)){var s=xo(e,o,l,n.primary,n.primary.type);n.markers.push(s),s.parent=n}}}(n,So(this)),n},unlinkDoc:function(e){if(e instanceof Ll&&(e=e.doc),this.linked)for(var t=0;t<this.linked.length;++t){if(this.linked[t].doc==e){this.linked.splice(t,1),e.unlinkDoc(this),Lo(So(this));break}}if(e.history==this.history){var r=[e.id];Oi(e,function(e){return r.push(e.id)},!0),e.history=new Wi(null),e.history.done=Gi(this.history.done,r),e.history.undone=Gi(this.history.undone,r)}},iterLinkedDocs:function(e){Oi(this,e)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(e){return this.lineSep?e.split(this.lineSep):wt(e)},lineSeparator:function(){return this.lineSep||"\n"},setDirection:qn(function(e){var t;("rtl"!=e&&(e="ltr"),e!=this.direction)&&(this.direction=e,this.iter(function(e){return e.order=null}),this.cm&&Yn(t=this.cm,function(){Di(t),Zn(t)}))})}),To.prototype.eachLine=To.prototype.iter;var Mo=0;function No(e){var t=this;if(Oo(t),!it(t,e)&&!xr(t.display,e)){at(e),l&&(Mo=+new Date);var r=sn(t,e,!0),n=e.dataTransfer.files;if(r&&!t.isReadOnly())if(n&&n.length&&window.FileReader&&window.File)for(var i=n.length,o=Array(i),s=0,a=function(e,n){if(!t.options.allowDropFileTypes||-1!=B(t.options.allowDropFileTypes,e.type)){var l=new FileReader;l.onload=_n(t,function(){var e=l.result;if(/[\x00-\x08\x0e-\x1f]{2}/.test(e)&&(e=""),o[n]=e,++s==i){var a={from:r=Ce(t.doc,r),to:r,text:t.doc.splitLines(o.join(t.doc.lineSeparator())),origin:"paste"};io(t.doc,a),Yi(t.doc,wi(r,xi(a)))}}),l.readAsText(e)}},u=0;u<i;++u)a(n[u],u);else{if(t.state.draggingText&&t.doc.sel.contains(r)>-1)return t.state.draggingText(e),void setTimeout(function(){return t.display.input.focus()},20);try{var c=e.dataTransfer.getData("Text");if(c){var h;if(t.state.draggingText&&!t.state.draggingText.copy&&(h=t.listSelections()),$i(t.doc,wi(r,r)),h)for(var f=0;f<h.length;++f)uo(t.doc,"",h[f].anchor,h[f].head,"drag");t.replaceSelection(c,"around","paste"),t.display.input.focus()}}catch(e){}}}}function Oo(e){e.display.dragCursor&&(e.display.lineSpace.removeChild(e.display.dragCursor),e.display.dragCursor=null)}function Ao(e){if(document.getElementsByClassName)for(var t=document.getElementsByClassName("CodeMirror"),r=0;r<t.length;r++){var n=t[r].CodeMirror;n&&e(n)}}var Do=!1;function Wo(){var e;Do||(et(window,"resize",function(){null==e&&(e=setTimeout(function(){e=null,Ao(Ho)},100))}),et(window,"blur",function(){return Ao(yn)}),Do=!0)}function Ho(e){var t=e.display;t.cachedCharWidth=t.cachedTextHeight=t.cachedPaddingH=null,t.scrollbarsClipped=!1,e.setSize()}for(var Fo={3:"Pause",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"=",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"=",109:"-",110:".",111:"/",127:"Delete",145:"ScrollLock",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"},Po=0;Po<10;Po++)Fo[Po+48]=Fo[Po+96]=String(Po);for(var Eo=65;Eo<=90;Eo++)Fo[Eo]=String.fromCharCode(Eo);for(var Io=1;Io<=12;Io++)Fo[Io+111]=Fo[Io+63235]="F"+Io;var zo={};function Ro(e){var t,r,n,i,o=e.split(/-(?!$)/);e=o[o.length-1];for(var l=0;l<o.length-1;l++){var s=o[l];if(/^(cmd|meta|m)$/i.test(s))i=!0;else if(/^a(lt)?$/i.test(s))t=!0;else if(/^(c|ctrl|control)$/i.test(s))r=!0;else{if(!/^s(hift)?$/i.test(s))throw new Error("Unrecognized modifier name: "+s);n=!0}}return t&&(e="Alt-"+e),r&&(e="Ctrl-"+e),i&&(e="Cmd-"+e),n&&(e="Shift-"+e),e}function Bo(e){var t={};for(var r in e)if(e.hasOwnProperty(r)){var n=e[r];if(/^(name|fallthrough|(de|at)tach)$/.test(r))continue;if("..."==n){delete e[r];continue}for(var i=q(r.split(" "),Ro),o=0;o<i.length;o++){var l=void 0,s=void 0;o==i.length-1?(s=i.join(" "),l=n):(s=i.slice(0,o+1).join(" "),l="...");var a=t[s];if(a){if(a!=l)throw new Error("Inconsistent bindings for "+s)}else t[s]=l}delete e[r]}for(var u in t)e[u]=t[u];return e}function Go(e,t,r,n){var i=(t=jo(t)).call?t.call(e,n):t[e];if(!1===i)return"nothing";if("..."===i)return"multi";if(null!=i&&r(i))return"handled";if(t.fallthrough){if("[object Array]"!=Object.prototype.toString.call(t.fallthrough))return Go(e,t.fallthrough,r,n);for(var o=0;o<t.fallthrough.length;o++){var l=Go(e,t.fallthrough[o],r,n);if(l)return l}}}function Uo(e){var t="string"==typeof e?e:Fo[e.keyCode];return"Ctrl"==t||"Alt"==t||"Shift"==t||"Mod"==t}function Vo(e,t,r){var n=e;return t.altKey&&"Alt"!=n&&(e="Alt-"+e),(C?t.metaKey:t.ctrlKey)&&"Ctrl"!=n&&(e="Ctrl-"+e),(C?t.ctrlKey:t.metaKey)&&"Cmd"!=n&&(e="Cmd-"+e),!r&&t.shiftKey&&"Shift"!=n&&(e="Shift-"+e),e}function Ko(e,t){if(h&&34==e.keyCode&&e.char)return!1;var r=Fo[e.keyCode];return null!=r&&!e.altGraphKey&&(3==e.keyCode&&e.code&&(r=e.code),Vo(r,e,t))}function jo(e){return"string"==typeof e?zo[e]:e}function Xo(e,t){for(var r=e.doc.sel.ranges,n=[],i=0;i<r.length;i++){for(var o=t(r[i]);n.length&&ve(o.from,$(n).to)<=0;){var l=n.pop();if(ve(l.from,o.from)<0){o.from=l.from;break}}n.push(o)}Yn(e,function(){for(var t=n.length-1;t>=0;t--)uo(e.doc,"",n[t].from,n[t].to,"+delete");Tn(e)})}function Yo(e,t,r){var n=oe(e.text,t+r,r);return n<0||n>e.text.length?null:n}function _o(e,t,r){var n=Yo(e,t.ch,r);return null==n?null:new ge(t.line,n,r<0?"after":"before")}function $o(e,t,r,n,i){if(e){var o=Qe(r,t.doc.direction);if(o){var l,s=i<0?$(o):o[0],a=i<0==(1==s.level)?"after":"before";if(s.level>0||"rtl"==t.doc.direction){var u=Dr(t,r);l=i<0?r.text.length-1:0;var c=Wr(t,u,l).top;l=le(function(e){return Wr(t,u,e).top==c},i<0==(1==s.level)?s.from:s.to-1,l),"before"==a&&(l=Yo(r,l,1))}else l=i<0?s.to:s.from;return new ge(n,l,a)}}return new ge(n,i<0?r.text.length:0,i<0?"before":"after")}zo.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"},zo.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"},zo.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars","Ctrl-O":"openLine"},zo.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",fallthrough:["basic","emacsy"]},zo.default=y?zo.macDefault:zo.pcDefault;var qo={selectAll:ro,singleSelection:function(e){return e.setSelection(e.getCursor("anchor"),e.getCursor("head"),V)},killLine:function(e){return Xo(e,function(t){if(t.empty()){var r=se(e.doc,t.head.line).text.length;return t.head.ch==r&&t.head.line<e.lastLine()?{from:t.head,to:ge(t.head.line+1,0)}:{from:t.head,to:ge(t.head.line,r)}}return{from:t.from(),to:t.to()}})},deleteLine:function(e){return Xo(e,function(t){return{from:ge(t.from().line,0),to:Ce(e.doc,ge(t.to().line+1,0))}})},delLineLeft:function(e){return Xo(e,function(e){return{from:ge(e.from().line,0),to:e.from()}})},delWrappedLineLeft:function(e){return Xo(e,function(t){var r=e.charCoords(t.head,"div").top+5;return{from:e.coordsChar({left:0,top:r},"div"),to:t.from()}})},delWrappedLineRight:function(e){return Xo(e,function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:e.display.lineDiv.offsetWidth+100,top:r},"div");return{from:t.from(),to:n}})},undo:function(e){return e.undo()},redo:function(e){return e.redo()},undoSelection:function(e){return e.undoSelection()},redoSelection:function(e){return e.redoSelection()},goDocStart:function(e){return e.extendSelection(ge(e.firstLine(),0))},goDocEnd:function(e){return e.extendSelection(ge(e.lastLine()))},goLineStart:function(e){return e.extendSelectionsBy(function(t){return Zo(e,t.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(e){return e.extendSelectionsBy(function(t){return Qo(e,t.head)},{origin:"+move",bias:1})},goLineEnd:function(e){return e.extendSelectionsBy(function(t){return function(e,t){var r=se(e.doc,t),n=function(e){for(var t;t=ze(e);)e=t.find(1,!0).line;return e}(r);n!=r&&(t=he(n));return $o(!0,e,r,t,-1)}(e,t.head.line)},{origin:"+move",bias:-1})},goLineRight:function(e){return e.extendSelectionsBy(function(t){var r=e.cursorCoords(t.head,"div").top+5;return e.coordsChar({left:e.display.lineDiv.offsetWidth+100,top:r},"div")},j)},goLineLeft:function(e){return e.extendSelectionsBy(function(t){var r=e.cursorCoords(t.head,"div").top+5;return e.coordsChar({left:0,top:r},"div")},j)},goLineLeftSmart:function(e){return e.extendSelectionsBy(function(t){var r=e.cursorCoords(t.head,"div").top+5,n=e.coordsChar({left:0,top:r},"div");return n.ch<e.getLine(n.line).search(/\S/)?Qo(e,t.head):n},j)},goLineUp:function(e){return e.moveV(-1,"line")},goLineDown:function(e){return e.moveV(1,"line")},goPageUp:function(e){return e.moveV(-1,"page")},goPageDown:function(e){return e.moveV(1,"page")},goCharLeft:function(e){return e.moveH(-1,"char")},goCharRight:function(e){return e.moveH(1,"char")},goColumnLeft:function(e){return e.moveH(-1,"column")},goColumnRight:function(e){return e.moveH(1,"column")},goWordLeft:function(e){return e.moveH(-1,"word")},goGroupRight:function(e){return e.moveH(1,"group")},goGroupLeft:function(e){return e.moveH(-1,"group")},goWordRight:function(e){return e.moveH(1,"word")},delCharBefore:function(e){return e.deleteH(-1,"char")},delCharAfter:function(e){return e.deleteH(1,"char")},delWordBefore:function(e){return e.deleteH(-1,"word")},delWordAfter:function(e){return e.deleteH(1,"word")},delGroupBefore:function(e){return e.deleteH(-1,"group")},delGroupAfter:function(e){return e.deleteH(1,"group")},indentAuto:function(e){return e.indentSelection("smart")},indentMore:function(e){return e.indentSelection("add")},indentLess:function(e){return e.indentSelection("subtract")},insertTab:function(e){return e.replaceSelection("\t")},insertSoftTab:function(e){for(var t=[],r=e.listSelections(),n=e.options.tabSize,i=0;i<r.length;i++){var o=r[i].from(),l=z(e.getLine(o.line),o.ch,n);t.push(_(n-l%n))}e.replaceSelections(t)},defaultTab:function(e){e.somethingSelected()?e.indentSelection("add"):e.execCommand("insertTab")},transposeChars:function(e){return Yn(e,function(){for(var t=e.listSelections(),r=[],n=0;n<t.length;n++)if(t[n].empty()){var i=t[n].head,o=se(e.doc,i.line).text;if(o)if(i.ch==o.length&&(i=new ge(i.line,i.ch-1)),i.ch>0)i=new ge(i.line,i.ch+1),e.replaceRange(o.charAt(i.ch-1)+o.charAt(i.ch-2),ge(i.line,i.ch-2),i,"+transpose");else if(i.line>e.doc.first){var l=se(e.doc,i.line-1).text;l&&(i=new ge(i.line,1),e.replaceRange(o.charAt(0)+e.doc.lineSeparator()+l.charAt(l.length-1),ge(i.line-1,l.length-1),i,"+transpose"))}r.push(new yi(i,i))}e.setSelections(r)})},newlineAndIndent:function(e){return Yn(e,function(){for(var t=e.listSelections(),r=t.length-1;r>=0;r--)e.replaceRange(e.doc.lineSeparator(),t[r].anchor,t[r].head,"+input");t=e.listSelections();for(var n=0;n<t.length;n++)e.indentLine(t[n].from().line,null,!0);Tn(e)})},openLine:function(e){return e.replaceSelection("\n","start")},toggleOverwrite:function(e){return e.toggleOverwrite()}};function Zo(e,t){var r=se(e.doc,t),n=Ge(r);return n!=r&&(t=he(n)),$o(!0,e,n,t,1)}function Qo(e,t){var r=Zo(e,t.line),n=se(e.doc,r.line),i=Qe(n,e.doc.direction);if(!i||0==i[0].level){var o=Math.max(0,n.text.search(/\S/)),l=t.line==r.line&&t.ch<=o&&t.ch;return ge(r.line,l?0:o,r.sticky)}return r}function Jo(e,t,r){if("string"==typeof t&&!(t=qo[t]))return!1;e.display.input.ensurePolled();var n=e.display.shift,i=!1;try{e.isReadOnly()&&(e.state.suppressEdits=!0),r&&(e.display.shift=!1),i=t(e)!=U}finally{e.display.shift=n,e.state.suppressEdits=!1}return i}var el=new R;function tl(e,t,r,n){var i=e.state.keySeq;if(i){if(Uo(t))return"handled";if(/\'$/.test(t)?e.state.keySeq=null:el.set(50,function(){e.state.keySeq==i&&(e.state.keySeq=null,e.display.input.reset())}),rl(e,i+" "+t,r,n))return!0}return rl(e,t,r,n)}function rl(e,t,r,n){var i=function(e,t,r){for(var n=0;n<e.state.keyMaps.length;n++){var i=Go(t,e.state.keyMaps[n],r,e);if(i)return i}return e.options.extraKeys&&Go(t,e.options.extraKeys,r,e)||Go(t,e.options.keyMap,r,e)}(e,t,n);return"multi"==i&&(e.state.keySeq=t),"handled"==i&&sr(e,"keyHandled",e,t,r),"handled"!=i&&"multi"!=i||(at(r),pn(e)),!!i}function nl(e,t){var r=Ko(t,!0);return!!r&&(t.shiftKey&&!e.state.keySeq?tl(e,"Shift-"+r,t,function(t){return Jo(e,t,!0)})||tl(e,r,t,function(t){if("string"==typeof t?/^go[A-Z]/.test(t):t.motion)return Jo(e,t)}):tl(e,r,t,function(t){return Jo(e,t)}))}var il=null;function ol(e){var t=this;if(t.curOp.focus=W(),!it(t,e)){l&&s<11&&27==e.keyCode&&(e.returnValue=!1);var r=e.keyCode;t.display.shift=16==r||e.shiftKey;var n=nl(t,e);h&&(il=n?r:null,!n&&88==r&&!Ct&&(y?e.metaKey:e.ctrlKey)&&t.replaceSelection("",null,"cut")),18!=r||/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className)||function(e){var t=e.display.lineDiv;function r(e){18!=e.keyCode&&e.altKey||(T(t,"CodeMirror-crosshair"),rt(document,"keyup",r),rt(document,"mouseover",r))}H(t,"CodeMirror-crosshair"),et(document,"keyup",r),et(document,"mouseover",r)}(t)}}function ll(e){16==e.keyCode&&(this.doc.sel.shift=!1),it(this,e)}function sl(e){var t=this;if(!(xr(t.display,e)||it(t,e)||e.ctrlKey&&!e.altKey||y&&e.metaKey)){var r=e.keyCode,n=e.charCode;if(h&&r==il)return il=null,void at(e);if(!h||e.which&&!(e.which<10)||!nl(t,e)){var i=String.fromCharCode(null==n?r:n);"\b"!=i&&(function(e,t,r){return tl(e,"'"+r+"'",t,function(t){return Jo(e,t,!0)})}(t,e,i)||t.display.input.onKeyPress(e))}}}var al,ul,cl=function(e,t,r){this.time=e,this.pos=t,this.button=r};function hl(e){var t=this,r=t.display;if(!(it(t,e)||r.activeTouch&&r.input.supportsTouch()))if(r.input.ensurePolled(),r.shift=e.shiftKey,xr(r,e))a||(r.scroller.draggable=!1,setTimeout(function(){return r.scroller.draggable=!0},100));else{var n=dt(e);if(3==n&&S?!vl(t,e):!pl(t,e)){var i=sn(t,e),o=i?function(e,t){var r=+new Date;return ul&&ul.compare(r,e,t)?(al=ul=null,"triple"):al&&al.compare(r,e,t)?(ul=new cl(r,e,t),al=null,"double"):(al=new cl(r,e,t),ul=null,"single")}(i,n):"single";window.focus(),1==n&&t.state.selectingText&&t.state.selectingText(e),i&&function(e,t,r,n,i){var o="Click";"double"==n?o="Double"+o:"triple"==n&&(o="Triple"+o);return tl(e,Vo(o=(1==t?"Left":2==t?"Middle":"Right")+o,i),i,function(t){if("string"==typeof t&&(t=qo[t]),!t)return!1;var n=!1;try{e.isReadOnly()&&(e.state.suppressEdits=!0),n=t(e,r)!=U}finally{e.state.suppressEdits=!1}return n})}(t,n,i,o,e)||(1==n?i?function(e,t,r,n){l?setTimeout(E(gn,e),0):e.curOp.focus=W();var i,o=function(e,t,r){var n=e.getOption("configureMouse"),i=n?n(e,t,r):{};if(null==i.unit){var o=b?r.shiftKey&&r.metaKey:r.altKey;i.unit=o?"rectangle":"single"==t?"char":"double"==t?"word":"line"}(null==i.extend||e.doc.extend)&&(i.extend=e.doc.extend||r.shiftKey);null==i.addNew&&(i.addNew=y?r.metaKey:r.ctrlKey);null==i.moveOnDrag&&(i.moveOnDrag=!(y?r.altKey:r.ctrlKey));return i}(e,r,n),u=e.doc.sel;e.options.dragDrop&&vt&&!e.isReadOnly()&&"single"==r&&(i=u.contains(t))>-1&&(ve((i=u.ranges[i]).from(),t)<0||t.xRel>0)&&(ve(i.to(),t)>0||t.xRel<0)?function(e,t,r,n){var i=e.display,o=!1,u=_n(e,function(t){a&&(i.scroller.draggable=!1),e.state.draggingText=!1,rt(i.wrapper.ownerDocument,"mouseup",u),rt(i.wrapper.ownerDocument,"mousemove",c),rt(i.scroller,"dragstart",h),rt(i.scroller,"drop",u),o||(at(t),n.addNew||Vi(e.doc,r,null,null,n.extend),a||l&&9==s?setTimeout(function(){i.wrapper.ownerDocument.body.focus(),i.input.focus()},20):i.input.focus())}),c=function(e){o=o||Math.abs(t.clientX-e.clientX)+Math.abs(t.clientY-e.clientY)>=10},h=function(){return o=!0};a&&(i.scroller.draggable=!0);e.state.draggingText=u,u.copy=!n.moveOnDrag,i.scroller.dragDrop&&i.scroller.dragDrop();et(i.wrapper.ownerDocument,"mouseup",u),et(i.wrapper.ownerDocument,"mousemove",c),et(i.scroller,"dragstart",h),et(i.scroller,"drop",u),vn(e),setTimeout(function(){return i.input.focus()},20)}(e,n,t,o):function(e,t,r,n){var i=e.display,o=e.doc;at(t);var l,s,a=o.sel,u=a.ranges;n.addNew&&!n.extend?(s=o.sel.contains(r),l=s>-1?u[s]:new yi(r,r)):(l=o.sel.primary(),s=o.sel.primIndex);if("rectangle"==n.unit)n.addNew||(l=new yi(r,r)),r=sn(e,t,!0,!0),s=-1;else{var c=fl(e,r,n.unit);l=n.extend?Ui(l,c.anchor,c.head,n.extend):c}n.addNew?-1==s?(s=u.length,_i(o,bi(u.concat([l]),s),{scroll:!1,origin:"*mouse"})):u.length>1&&u[s].empty()&&"char"==n.unit&&!n.extend?(_i(o,bi(u.slice(0,s).concat(u.slice(s+1)),0),{scroll:!1,origin:"*mouse"}),a=o.sel):ji(o,s,l,K):(s=0,_i(o,new mi([l],0),K),a=o.sel);var h=r;function f(t){if(0!=ve(h,t))if(h=t,"rectangle"==n.unit){for(var i=[],u=e.options.tabSize,c=z(se(o,r.line).text,r.ch,u),f=z(se(o,t.line).text,t.ch,u),d=Math.min(c,f),p=Math.max(c,f),g=Math.min(r.line,t.line),v=Math.min(e.lastLine(),Math.max(r.line,t.line));g<=v;g++){var m=se(o,g).text,y=X(m,d,u);d==p?i.push(new yi(ge(g,y),ge(g,y))):m.length>y&&i.push(new yi(ge(g,y),ge(g,X(m,p,u))))}i.length||i.push(new yi(r,r)),_i(o,bi(a.ranges.slice(0,s).concat(i),s),{origin:"*mouse",scroll:!1}),e.scrollIntoView(t)}else{var b,w=l,x=fl(e,t,n.unit),C=w.anchor;ve(x.anchor,C)>0?(b=x.head,C=we(w.from(),x.anchor)):(b=x.anchor,C=be(w.to(),x.head));var S=a.ranges.slice(0);S[s]=function(e,t){var r=t.anchor,n=t.head,i=se(e.doc,r.line);if(0==ve(r,n)&&r.sticky==n.sticky)return t;var o=Qe(i);if(!o)return t;var l=qe(o,r.ch,r.sticky),s=o[l];if(s.from!=r.ch&&s.to!=r.ch)return t;var a,u=l+(s.from==r.ch==(1!=s.level)?0:1);if(0==u||u==o.length)return t;if(n.line!=r.line)a=(n.line-r.line)*("ltr"==e.doc.direction?1:-1)>0;else{var c=qe(o,n.ch,n.sticky),h=c-l||(n.ch-r.ch)*(1==s.level?-1:1);a=c==u-1||c==u?h<0:h>0}var f=o[u+(a?-1:0)],d=a==(1==f.level),p=d?f.from:f.to,g=d?"after":"before";return r.ch==p&&r.sticky==g?t:new yi(new ge(r.line,p,g),n)}(e,new yi(Ce(o,C),b)),_i(o,bi(S,s),K)}}var d=i.wrapper.getBoundingClientRect(),p=0;function g(t){e.state.selectingText=!1,p=1/0,at(t),i.input.focus(),rt(i.wrapper.ownerDocument,"mousemove",v),rt(i.wrapper.ownerDocument,"mouseup",m),o.history.lastSelOrigin=null}var v=_n(e,function(t){0!==t.buttons&&dt(t)?function t(r){var l=++p;var s=sn(e,r,!0,"rectangle"==n.unit);if(!s)return;if(0!=ve(s,h)){e.curOp.focus=W(),f(s);var a=xn(i,o);(s.line>=a.to||s.line<a.from)&&setTimeout(_n(e,function(){p==l&&t(r)}),150)}else{var u=r.clientY<d.top?-20:r.clientY>d.bottom?20:0;u&&setTimeout(_n(e,function(){p==l&&(i.scroller.scrollTop+=u,t(r))}),50)}}(t):g(t)}),m=_n(e,g);e.state.selectingText=m,et(i.wrapper.ownerDocument,"mousemove",v),et(i.wrapper.ownerDocument,"mouseup",m)}(e,n,t,o)}(t,i,o,e):ft(e)==r.scroller&&at(e):2==n?(i&&Vi(t.doc,i),setTimeout(function(){return r.input.focus()},20)):3==n&&(S?gl(t,e):vn(t)))}}}function fl(e,t,r){if("char"==r)return new yi(t,t);if("word"==r)return e.findWordAt(t);if("line"==r)return new yi(ge(t.line,0),Ce(e.doc,ge(t.line+1,0)));var n=r(e,t);return new yi(n.from,n.to)}function dl(e,t,r,n){var i,o;if(t.touches)i=t.touches[0].clientX,o=t.touches[0].clientY;else try{i=t.clientX,o=t.clientY}catch(t){return!1}if(i>=Math.floor(e.display.gutters.getBoundingClientRect().right))return!1;n&&at(t);var l=e.display,s=l.lineDiv.getBoundingClientRect();if(o>s.bottom||!lt(e,r))return ct(t);o-=s.top-l.viewOffset;for(var a=0;a<e.options.gutters.length;++a){var u=l.gutters.childNodes[a];if(u&&u.getBoundingClientRect().right>=i)return nt(e,r,e,fe(e.doc,o),e.options.gutters[a],t),ct(t)}}function pl(e,t){return dl(e,t,"gutterClick",!0)}function gl(e,t){xr(e.display,t)||vl(e,t)||it(e,t,"contextmenu")||e.display.input.onContextMenu(t)}function vl(e,t){return!!lt(e,"gutterContextMenu")&&dl(e,t,"gutterContextMenu",!1)}function ml(e){e.display.wrapper.className=e.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+e.options.theme.replace(/(^|\s)\s*/g," cm-s-"),Rr(e)}cl.prototype.compare=function(e,t,r){return this.time+400>e&&0==ve(t,this.pos)&&r==this.button};var yl={toString:function(){return"CodeMirror.Init"}},bl={},wl={};function xl(e){ci(e),Zn(e),Cn(e)}function Cl(e,t,r){if(!t!=!(r&&r!=yl)){var n=e.display.dragFunctions,i=t?et:rt;i(e.display.scroller,"dragstart",n.start),i(e.display.scroller,"dragenter",n.enter),i(e.display.scroller,"dragover",n.over),i(e.display.scroller,"dragleave",n.leave),i(e.display.scroller,"drop",n.drop)}}function Sl(e){e.options.lineWrapping?(H(e.display.wrapper,"CodeMirror-wrap"),e.display.sizer.style.minWidth="",e.display.sizerWidth=null):(T(e.display.wrapper,"CodeMirror-wrap"),_e(e)),ln(e),Zn(e),Rr(e),setTimeout(function(){return En(e)},100)}function Ll(e,t){var n=this;if(!(this instanceof Ll))return new Ll(e,t);this.options=t=t?I(t):{},I(bl,t,!1),hi(t);var i=t.value;"string"==typeof i?i=new To(i,t.mode,null,t.lineSeparator,t.direction):t.mode&&(i.modeOption=t.mode),this.doc=i;var o=new Ll.inputStyles[t.inputStyle](this),u=this.display=new function(e,t,n){var i=this;this.input=n,i.scrollbarFiller=O("div",null,"CodeMirror-scrollbar-filler"),i.scrollbarFiller.setAttribute("cm-not-content","true"),i.gutterFiller=O("div",null,"CodeMirror-gutter-filler"),i.gutterFiller.setAttribute("cm-not-content","true"),i.lineDiv=A("div",null,"CodeMirror-code"),i.selectionDiv=O("div",null,null,"position: relative; z-index: 1"),i.cursorDiv=O("div",null,"CodeMirror-cursors"),i.measure=O("div",null,"CodeMirror-measure"),i.lineMeasure=O("div",null,"CodeMirror-measure"),i.lineSpace=A("div",[i.measure,i.lineMeasure,i.selectionDiv,i.cursorDiv,i.lineDiv],null,"position: relative; outline: none");var o=A("div",[i.lineSpace],"CodeMirror-lines");i.mover=O("div",[o],null,"position: relative"),i.sizer=O("div",[i.mover],"CodeMirror-sizer"),i.sizerWidth=null,i.heightForcer=O("div",null,null,"position: absolute; height: "+G+"px; width: 1px;"),i.gutters=O("div",null,"CodeMirror-gutters"),i.lineGutter=null,i.scroller=O("div",[i.sizer,i.heightForcer,i.gutters],"CodeMirror-scroll"),i.scroller.setAttribute("tabIndex","-1"),i.wrapper=O("div",[i.scrollbarFiller,i.gutterFiller,i.scroller],"CodeMirror"),l&&s<8&&(i.gutters.style.zIndex=-1,i.scroller.style.paddingRight=0),a||r&&m||(i.scroller.draggable=!0),e&&(e.appendChild?e.appendChild(i.wrapper):e(i.wrapper)),i.viewFrom=i.viewTo=t.first,i.reportedViewFrom=i.reportedViewTo=t.first,i.view=[],i.renderedView=null,i.externalMeasured=null,i.viewOffset=0,i.lastWrapHeight=i.lastWrapWidth=0,i.updateLineNumbers=null,i.nativeBarWidth=i.barHeight=i.barWidth=0,i.scrollbarsClipped=!1,i.lineNumWidth=i.lineNumInnerWidth=i.lineNumChars=null,i.alignWidgets=!1,i.cachedCharWidth=i.cachedTextHeight=i.cachedPaddingH=null,i.maxLine=null,i.maxLineLength=0,i.maxLineChanged=!1,i.wheelDX=i.wheelDY=i.wheelStartX=i.wheelStartY=null,i.shift=!1,i.selForContextMenu=null,i.activeTouch=null,n.init(i)}(e,i,o);for(var c in u.wrapper.CodeMirror=this,ci(this),ml(this),t.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap"),Rn(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,draggingText:!1,highlight:new R,keySeq:null,specialChars:null},t.autofocus&&!m&&u.input.focus(),l&&s<11&&setTimeout(function(){return n.display.input.reset(!0)},20),function(e){var t=e.display;et(t.scroller,"mousedown",_n(e,hl)),et(t.scroller,"dblclick",l&&s<11?_n(e,function(t){if(!it(e,t)){var r=sn(e,t);if(r&&!pl(e,t)&&!xr(e.display,t)){at(t);var n=e.findWordAt(r);Vi(e.doc,n.anchor,n.head)}}}):function(t){return it(e,t)||at(t)});S||et(t.scroller,"contextmenu",function(t){return gl(e,t)});var r,n={end:0};function i(){t.activeTouch&&(r=setTimeout(function(){return t.activeTouch=null},1e3),(n=t.activeTouch).end=+new Date)}function o(e,t){if(null==t.left)return!0;var r=t.left-e.left,n=t.top-e.top;return r*r+n*n>400}et(t.scroller,"touchstart",function(i){if(!it(e,i)&&!function(e){if(1!=e.touches.length)return!1;var t=e.touches[0];return t.radiusX<=1&&t.radiusY<=1}(i)&&!pl(e,i)){t.input.ensurePolled(),clearTimeout(r);var o=+new Date;t.activeTouch={start:o,moved:!1,prev:o-n.end<=300?n:null},1==i.touches.length&&(t.activeTouch.left=i.touches[0].pageX,t.activeTouch.top=i.touches[0].pageY)}}),et(t.scroller,"touchmove",function(){t.activeTouch&&(t.activeTouch.moved=!0)}),et(t.scroller,"touchend",function(r){var n=t.activeTouch;if(n&&!xr(t,r)&&null!=n.left&&!n.moved&&new Date-n.start<300){var l,s=e.coordsChar(t.activeTouch,"page");l=!n.prev||o(n,n.prev)?new yi(s,s):!n.prev.prev||o(n,n.prev.prev)?e.findWordAt(s):new yi(ge(s.line,0),Ce(e.doc,ge(s.line+1,0))),e.setSelection(l.anchor,l.head),e.focus(),at(r)}i()}),et(t.scroller,"touchcancel",i),et(t.scroller,"scroll",function(){t.scroller.clientHeight&&(An(e,t.scroller.scrollTop),Wn(e,t.scroller.scrollLeft,!0),nt(e,"scroll",e))}),et(t.scroller,"mousewheel",function(t){return vi(e,t)}),et(t.scroller,"DOMMouseScroll",function(t){return vi(e,t)}),et(t.wrapper,"scroll",function(){return t.wrapper.scrollTop=t.wrapper.scrollLeft=0}),t.dragFunctions={enter:function(t){it(e,t)||ht(t)},over:function(t){it(e,t)||(!function(e,t){var r=sn(e,t);if(r){var n=document.createDocumentFragment();hn(e,r,n),e.display.dragCursor||(e.display.dragCursor=O("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),e.display.lineSpace.insertBefore(e.display.dragCursor,e.display.cursorDiv)),N(e.display.dragCursor,n)}}(e,t),ht(t))},start:function(t){return function(e,t){if(l&&(!e.state.draggingText||+new Date-Mo<100))ht(t);else if(!it(e,t)&&!xr(e.display,t)&&(t.dataTransfer.setData("Text",e.getSelection()),t.dataTransfer.effectAllowed="copyMove",t.dataTransfer.setDragImage&&!f)){var r=O("img",null,null,"position: fixed; left: 0; top: 0;");r.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",h&&(r.width=r.height=1,e.display.wrapper.appendChild(r),r._top=r.offsetTop),t.dataTransfer.setDragImage(r,0,0),h&&r.parentNode.removeChild(r)}}(e,t)},drop:_n(e,No),leave:function(t){it(e,t)||Oo(e)}};var a=t.input.getField();et(a,"keyup",function(t){return ll.call(e,t)}),et(a,"keydown",_n(e,ol)),et(a,"keypress",_n(e,sl)),et(a,"focus",function(t){return mn(e,t)}),et(a,"blur",function(t){return yn(e,t)})}(this),Wo(),Gn(this),this.curOp.forceUpdate=!0,Ai(this,i),t.autofocus&&!m||this.hasFocus()?setTimeout(E(mn,this),20):yn(this),wl)wl.hasOwnProperty(c)&&wl[c](n,t[c],yl);Sn(this),t.finishInit&&t.finishInit(this);for(var d=0;d<kl.length;++d)kl[d](n);Un(this),a&&t.lineWrapping&&"optimizelegibility"==getComputedStyle(u.lineDiv).textRendering&&(u.lineDiv.style.textRendering="auto")}Ll.defaults=bl,Ll.optionHandlers=wl;var kl=[];function Tl(e,t,r,n){var i,o=e.doc;null==r&&(r="add"),"smart"==r&&(o.mode.indent?i=zt(e,t).state:r="prev");var l=e.options.tabSize,s=se(o,t),a=z(s.text,null,l);s.stateAfter&&(s.stateAfter=null);var u,c=s.text.match(/^\s*/)[0];if(n||/\S/.test(s.text)){if("smart"==r&&((u=o.mode.indent(i,s.text.slice(c.length),s.text))==U||u>150)){if(!n)return;r="prev"}}else u=0,r="not";"prev"==r?u=t>o.first?z(se(o,t-1).text,null,l):0:"add"==r?u=a+e.options.indentUnit:"subtract"==r?u=a-e.options.indentUnit:"number"==typeof r&&(u=a+r),u=Math.max(0,u);var h="",f=0;if(e.options.indentWithTabs)for(var d=Math.floor(u/l);d;--d)f+=l,h+="\t";if(f<u&&(h+=_(u-f)),h!=c)return uo(o,h,ge(t,0),ge(t,c.length),"+input"),s.stateAfter=null,!0;for(var p=0;p<o.sel.ranges.length;p++){var g=o.sel.ranges[p];if(g.head.line==t&&g.head.ch<c.length){var v=ge(t,c.length);ji(o,p,new yi(v,v));break}}}Ll.defineInitHook=function(e){return kl.push(e)};var Ml=null;function Nl(e){Ml=e}function Ol(e,t,r,n,i){var o=e.doc;e.display.shift=!1,n||(n=o.sel);var l,s=e.state.pasteIncoming||"paste"==i,a=wt(t),u=null;if(s&&n.ranges.length>1)if(Ml&&Ml.text.join("\n")==t){if(n.ranges.length%Ml.text.length==0){u=[];for(var c=0;c<Ml.text.length;c++)u.push(o.splitLines(Ml.text[c]))}}else a.length==n.ranges.length&&e.options.pasteLinesPerSelection&&(u=q(a,function(e){return[e]}));for(var h=n.ranges.length-1;h>=0;h--){var f=n.ranges[h],d=f.from(),p=f.to();f.empty()&&(r&&r>0?d=ge(d.line,d.ch-r):e.state.overwrite&&!s?p=ge(p.line,Math.min(se(o,p.line).text.length,p.ch+$(a).length)):Ml&&Ml.lineWise&&Ml.text.join("\n")==t&&(d=p=ge(d.line,0))),l=e.curOp.updateInput;var g={from:d,to:p,text:u?u[h%u.length]:a,origin:i||(s?"paste":e.state.cutIncoming?"cut":"+input")};io(e.doc,g),sr(e,"inputRead",e,g)}t&&!s&&Dl(e,t),Tn(e),e.curOp.updateInput=l,e.curOp.typing=!0,e.state.pasteIncoming=e.state.cutIncoming=!1}function Al(e,t){var r=e.clipboardData&&e.clipboardData.getData("Text");if(r)return e.preventDefault(),t.isReadOnly()||t.options.disableInput||Yn(t,function(){return Ol(t,r,0,null,"paste")}),!0}function Dl(e,t){if(e.options.electricChars&&e.options.smartIndent)for(var r=e.doc.sel,n=r.ranges.length-1;n>=0;n--){var i=r.ranges[n];if(!(i.head.ch>100||n&&r.ranges[n-1].head.line==i.head.line)){var o=e.getModeAt(i.head),l=!1;if(o.electricChars){for(var s=0;s<o.electricChars.length;s++)if(t.indexOf(o.electricChars.charAt(s))>-1){l=Tl(e,i.head.line,"smart");break}}else o.electricInput&&o.electricInput.test(se(e.doc,i.head.line).text.slice(0,i.head.ch))&&(l=Tl(e,i.head.line,"smart"));l&&sr(e,"electricInput",e,i.head.line)}}}function Wl(e){for(var t=[],r=[],n=0;n<e.doc.sel.ranges.length;n++){var i=e.doc.sel.ranges[n].head.line,o={anchor:ge(i,0),head:ge(i+1,0)};r.push(o),t.push(e.getRange(o.anchor,o.head))}return{text:t,ranges:r}}function Hl(e,t){e.setAttribute("autocorrect","off"),e.setAttribute("autocapitalize","off"),e.setAttribute("spellcheck",!!t)}function Fl(){var e=O("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),t=O("div",[e],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");return a?e.style.width="1000px":e.setAttribute("wrap","off"),g&&(e.style.border="1px solid black"),Hl(e),t}function Pl(e,t,r,n,i){var o=t,l=r,s=se(e,t.line);function a(n){var o,l;if(null==(o=i?function(e,t,r,n){var i=Qe(t,e.doc.direction);if(!i)return _o(t,r,n);r.ch>=t.text.length?(r.ch=t.text.length,r.sticky="before"):r.ch<=0&&(r.ch=0,r.sticky="after");var o=qe(i,r.ch,r.sticky),l=i[o];if("ltr"==e.doc.direction&&l.level%2==0&&(n>0?l.to>r.ch:l.from<r.ch))return _o(t,r,n);var s,a=function(e,r){return Yo(t,e instanceof ge?e.ch:e,r)},u=function(r){return e.options.lineWrapping?(s=s||Dr(e,t),Zr(e,t,s,r)):{begin:0,end:t.text.length}},c=u("before"==r.sticky?a(r,-1):r.ch);if("rtl"==e.doc.direction||1==l.level){var h=1==l.level==n<0,f=a(r,h?1:-1);if(null!=f&&(h?f<=l.to&&f<=c.end:f>=l.from&&f>=c.begin)){var d=h?"before":"after";return new ge(r.line,f,d)}}var p=function(e,t,n){for(var o=function(e,t){return t?new ge(r.line,a(e,1),"before"):new ge(r.line,e,"after")};e>=0&&e<i.length;e+=t){var l=i[e],s=t>0==(1!=l.level),u=s?n.begin:a(n.end,-1);if(l.from<=u&&u<l.to)return o(u,s);if(u=s?l.from:a(l.to,-1),n.begin<=u&&u<n.end)return o(u,s)}},g=p(o+n,n,c);if(g)return g;var v=n>0?c.end:a(c.begin,-1);return null==v||n>0&&v==t.text.length||!(g=p(n>0?0:i.length-1,n,u(v)))?null:g}(e.cm,s,t,r):_o(s,t,r))){if(n||(l=t.line+r)<e.first||l>=e.first+e.size||(t=new ge(l,t.ch,t.sticky),!(s=se(e,l))))return!1;t=$o(i,e.cm,s,t.line,r)}else t=o;return!0}if("char"==n)a();else if("column"==n)a(!0);else if("word"==n||"group"==n)for(var u=null,c="group"==n,h=e.cm&&e.cm.getHelper(t,"wordChars"),f=!0;!(r<0)||a(!f);f=!1){var d=s.text.charAt(t.ch)||"\n",p=te(d,h)?"w":c&&"\n"==d?"n":!c||/\s/.test(d)?null:"p";if(!c||f||p||(p="s"),u&&u!=p){r<0&&(r=1,a(),t.sticky="after");break}if(p&&(u=p),r>0&&!a(!f))break}var g=eo(e,t,o,l,!0);return me(o,g)&&(g.hitSide=!0),g}function El(e,t,r,n){var i,o,l=e.doc,s=t.left;if("page"==n){var a=Math.min(e.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight),u=Math.max(a-.5*en(e.display),3);i=(r>0?t.bottom:t.top)+r*u}else"line"==n&&(i=r>0?t.bottom+3:t.top-3);for(;(o=$r(e,s,i)).outside;){if(r<0?i<=0:i>=l.height){o.hitSide=!0;break}i+=5*r}return o}var Il=function(e){this.cm=e,this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null,this.polling=new R,this.composing=null,this.gracePeriod=!1,this.readDOMTimeout=null};function zl(e,t){var r=Ar(e,t.line);if(!r||r.hidden)return null;var n=se(e.doc,t.line),i=Nr(r,n,t.line),o=Qe(n,e.doc.direction),l="left";o&&(l=qe(o,t.ch)%2?"right":"left");var s=Pr(i.map,t.ch,l);return s.offset="right"==s.collapse?s.end:s.start,s}function Rl(e,t){return t&&(e.bad=!0),e}function Bl(e,t,r){var n;if(t==e.display.lineDiv){if(!(n=e.display.lineDiv.childNodes[r]))return Rl(e.clipPos(ge(e.display.viewTo-1)),!0);t=null,r=0}else for(n=t;;n=n.parentNode){if(!n||n==e.display.lineDiv)return null;if(n.parentNode&&n.parentNode==e.display.lineDiv)break}for(var i=0;i<e.display.view.length;i++){var o=e.display.view[i];if(o.node==n)return Gl(o,t,r)}}function Gl(e,t,r){var n=e.text.firstChild,i=!1;if(!t||!D(n,t))return Rl(ge(he(e.line),0),!0);if(t==n&&(i=!0,t=n.childNodes[r],r=0,!t)){var o=e.rest?$(e.rest):e.line;return Rl(ge(he(o),o.text.length),i)}var l=3==t.nodeType?t:null,s=t;for(l||1!=t.childNodes.length||3!=t.firstChild.nodeType||(l=t.firstChild,r&&(r=l.nodeValue.length));s.parentNode!=n;)s=s.parentNode;var a=e.measure,u=a.maps;function c(t,r,n){for(var i=-1;i<(u?u.length:0);i++)for(var o=i<0?a.map:u[i],l=0;l<o.length;l+=3){var s=o[l+2];if(s==t||s==r){var c=he(i<0?e.line:e.rest[i]),h=o[l]+n;return(n<0||s!=t)&&(h=o[l+(n?1:0)]),ge(c,h)}}}var h=c(l,s,r);if(h)return Rl(h,i);for(var f=s.nextSibling,d=l?l.nodeValue.length-r:0;f;f=f.nextSibling){if(h=c(f,f.firstChild,0))return Rl(ge(h.line,h.ch-d),i);d+=f.textContent.length}for(var p=s.previousSibling,g=r;p;p=p.previousSibling){if(h=c(p,p.firstChild,-1))return Rl(ge(h.line,h.ch+g),i);g+=p.textContent.length}}Il.prototype.init=function(e){var t=this,r=this,n=r.cm,i=r.div=e.lineDiv;function o(e){if(!it(n,e)){if(n.somethingSelected())Nl({lineWise:!1,text:n.getSelections()}),"cut"==e.type&&n.replaceSelection("",null,"cut");else{if(!n.options.lineWiseCopyCut)return;var t=Wl(n);Nl({lineWise:!0,text:t.text}),"cut"==e.type&&n.operation(function(){n.setSelections(t.ranges,0,V),n.replaceSelection("",null,"cut")})}if(e.clipboardData){e.clipboardData.clearData();var o=Ml.text.join("\n");if(e.clipboardData.setData("Text",o),e.clipboardData.getData("Text")==o)return void e.preventDefault()}var l=Fl(),s=l.firstChild;n.display.lineSpace.insertBefore(l,n.display.lineSpace.firstChild),s.value=Ml.text.join("\n");var a=document.activeElement;P(s),setTimeout(function(){n.display.lineSpace.removeChild(l),a.focus(),a==i&&r.showPrimarySelection()},50)}}Hl(i,n.options.spellcheck),et(i,"paste",function(e){it(n,e)||Al(e,n)||s<=11&&setTimeout(_n(n,function(){return t.updateFromDOM()}),20)}),et(i,"compositionstart",function(e){t.composing={data:e.data,done:!1}}),et(i,"compositionupdate",function(e){t.composing||(t.composing={data:e.data,done:!1})}),et(i,"compositionend",function(e){t.composing&&(e.data!=t.composing.data&&t.readFromDOMSoon(),t.composing.done=!0)}),et(i,"touchstart",function(){return r.forceCompositionEnd()}),et(i,"input",function(){t.composing||t.readFromDOMSoon()}),et(i,"copy",o),et(i,"cut",o)},Il.prototype.prepareSelection=function(){var e=cn(this.cm,!1);return e.focus=this.cm.state.focused,e},Il.prototype.showSelection=function(e,t){e&&this.cm.display.view.length&&((e.focus||t)&&this.showPrimarySelection(),this.showMultipleSelections(e))},Il.prototype.getSelection=function(){return this.cm.display.wrapper.ownerDocument.getSelection()},Il.prototype.showPrimarySelection=function(){var e=this.getSelection(),t=this.cm,n=t.doc.sel.primary(),i=n.from(),o=n.to();if(t.display.viewTo==t.display.viewFrom||i.line>=t.display.viewTo||o.line<t.display.viewFrom)e.removeAllRanges();else{var l=Bl(t,e.anchorNode,e.anchorOffset),s=Bl(t,e.focusNode,e.focusOffset);if(!l||l.bad||!s||s.bad||0!=ve(we(l,s),i)||0!=ve(be(l,s),o)){var a=t.display.view,u=i.line>=t.display.viewFrom&&zl(t,i)||{node:a[0].measure.map[2],offset:0},c=o.line<t.display.viewTo&&zl(t,o);if(!c){var h=a[a.length-1].measure,f=h.maps?h.maps[h.maps.length-1]:h.map;c={node:f[f.length-1],offset:f[f.length-2]-f[f.length-3]}}if(u&&c){var d,p=e.rangeCount&&e.getRangeAt(0);try{d=k(u.node,u.offset,c.offset,c.node)}catch(e){}d&&(!r&&t.state.focused?(e.collapse(u.node,u.offset),d.collapsed||(e.removeAllRanges(),e.addRange(d))):(e.removeAllRanges(),e.addRange(d)),p&&null==e.anchorNode?e.addRange(p):r&&this.startGracePeriod()),this.rememberSelection()}else e.removeAllRanges()}}},Il.prototype.startGracePeriod=function(){var e=this;clearTimeout(this.gracePeriod),this.gracePeriod=setTimeout(function(){e.gracePeriod=!1,e.selectionChanged()&&e.cm.operation(function(){return e.cm.curOp.selectionChanged=!0})},20)},Il.prototype.showMultipleSelections=function(e){N(this.cm.display.cursorDiv,e.cursors),N(this.cm.display.selectionDiv,e.selection)},Il.prototype.rememberSelection=function(){var e=this.getSelection();this.lastAnchorNode=e.anchorNode,this.lastAnchorOffset=e.anchorOffset,this.lastFocusNode=e.focusNode,this.lastFocusOffset=e.focusOffset},Il.prototype.selectionInEditor=function(){var e=this.getSelection();if(!e.rangeCount)return!1;var t=e.getRangeAt(0).commonAncestorContainer;return D(this.div,t)},Il.prototype.focus=function(){"nocursor"!=this.cm.options.readOnly&&(this.selectionInEditor()||this.showSelection(this.prepareSelection(),!0),this.div.focus())},Il.prototype.blur=function(){this.div.blur()},Il.prototype.getField=function(){return this.div},Il.prototype.supportsTouch=function(){return!0},Il.prototype.receivedFocus=function(){var e=this;this.selectionInEditor()?this.pollSelection():Yn(this.cm,function(){return e.cm.curOp.selectionChanged=!0}),this.polling.set(this.cm.options.pollInterval,function t(){e.cm.state.focused&&(e.pollSelection(),e.polling.set(e.cm.options.pollInterval,t))})},Il.prototype.selectionChanged=function(){var e=this.getSelection();return e.anchorNode!=this.lastAnchorNode||e.anchorOffset!=this.lastAnchorOffset||e.focusNode!=this.lastFocusNode||e.focusOffset!=this.lastFocusOffset},Il.prototype.pollSelection=function(){if(null==this.readDOMTimeout&&!this.gracePeriod&&this.selectionChanged()){var e=this.getSelection(),t=this.cm;if(v&&c&&this.cm.options.gutters.length&&function(e){for(var t=e;t;t=t.parentNode)if(/CodeMirror-gutter-wrapper/.test(t.className))return!0;return!1}(e.anchorNode))return this.cm.triggerOnKeyDown({type:"keydown",keyCode:8,preventDefault:Math.abs}),this.blur(),void this.focus();if(!this.composing){this.rememberSelection();var r=Bl(t,e.anchorNode,e.anchorOffset),n=Bl(t,e.focusNode,e.focusOffset);r&&n&&Yn(t,function(){_i(t.doc,wi(r,n),V),(r.bad||n.bad)&&(t.curOp.selectionChanged=!0)})}}},Il.prototype.pollContent=function(){null!=this.readDOMTimeout&&(clearTimeout(this.readDOMTimeout),this.readDOMTimeout=null);var e,t,r,n=this.cm,i=n.display,o=n.doc.sel.primary(),l=o.from(),s=o.to();if(0==l.ch&&l.line>n.firstLine()&&(l=ge(l.line-1,se(n.doc,l.line-1).length)),s.ch==se(n.doc,s.line).text.length&&s.line<n.lastLine()&&(s=ge(s.line+1,0)),l.line<i.viewFrom||s.line>i.viewTo-1)return!1;l.line==i.viewFrom||0==(e=an(n,l.line))?(t=he(i.view[0].line),r=i.view[0].node):(t=he(i.view[e].line),r=i.view[e-1].node.nextSibling);var a,u,c=an(n,s.line);if(c==i.view.length-1?(a=i.viewTo-1,u=i.lineDiv.lastChild):(a=he(i.view[c+1].line)-1,u=i.view[c+1].node.previousSibling),!r)return!1;for(var h=n.doc.splitLines(function(e,t,r,n,i){var o="",l=!1,s=e.doc.lineSeparator(),a=!1;function u(){l&&(o+=s,a&&(o+=s),l=a=!1)}function c(e){e&&(u(),o+=e)}function h(t){if(1==t.nodeType){var r=t.getAttribute("cm-text");if(r)return void c(r);var o,f=t.getAttribute("cm-marker");if(f){var d=e.findMarks(ge(n,0),ge(i+1,0),(v=+f,function(e){return e.id==v}));return void(d.length&&(o=d[0].find(0))&&c(ae(e.doc,o.from,o.to).join(s)))}if("false"==t.getAttribute("contenteditable"))return;var p=/^(pre|div|p|li|table|br)$/i.test(t.nodeName);if(!/^br$/i.test(t.nodeName)&&0==t.textContent.length)return;p&&u();for(var g=0;g<t.childNodes.length;g++)h(t.childNodes[g]);/^(pre|p)$/i.test(t.nodeName)&&(a=!0),p&&(l=!0)}else 3==t.nodeType&&c(t.nodeValue.replace(/\u200b/g,"").replace(/\u00a0/g," "));var v}for(;h(t),t!=r;)t=t.nextSibling,a=!1;return o}(n,r,u,t,a)),f=ae(n.doc,ge(t,0),ge(a,se(n.doc,a).text.length));h.length>1&&f.length>1;)if($(h)==$(f))h.pop(),f.pop(),a--;else{if(h[0]!=f[0])break;h.shift(),f.shift(),t++}for(var d=0,p=0,g=h[0],v=f[0],m=Math.min(g.length,v.length);d<m&&g.charCodeAt(d)==v.charCodeAt(d);)++d;for(var y=$(h),b=$(f),w=Math.min(y.length-(1==h.length?d:0),b.length-(1==f.length?d:0));p<w&&y.charCodeAt(y.length-p-1)==b.charCodeAt(b.length-p-1);)++p;if(1==h.length&&1==f.length&&t==l.line)for(;d&&d>l.ch&&y.charCodeAt(y.length-p-1)==b.charCodeAt(b.length-p-1);)d--,p++;h[h.length-1]=y.slice(0,y.length-p).replace(/^\u200b+/,""),h[0]=h[0].slice(d).replace(/\u200b+$/,"");var x=ge(t,d),C=ge(a,f.length?$(f).length-p:0);return h.length>1||h[0]||ve(x,C)?(uo(n.doc,h,x,C,"+input"),!0):void 0},Il.prototype.ensurePolled=function(){this.forceCompositionEnd()},Il.prototype.reset=function(){this.forceCompositionEnd()},Il.prototype.forceCompositionEnd=function(){this.composing&&(clearTimeout(this.readDOMTimeout),this.composing=null,this.updateFromDOM(),this.div.blur(),this.div.focus())},Il.prototype.readFromDOMSoon=function(){var e=this;null==this.readDOMTimeout&&(this.readDOMTimeout=setTimeout(function(){if(e.readDOMTimeout=null,e.composing){if(!e.composing.done)return;e.composing=null}e.updateFromDOM()},80))},Il.prototype.updateFromDOM=function(){var e=this;!this.cm.isReadOnly()&&this.pollContent()||Yn(this.cm,function(){return Zn(e.cm)})},Il.prototype.setUneditable=function(e){e.contentEditable="false"},Il.prototype.onKeyPress=function(e){0==e.charCode||this.composing||(e.preventDefault(),this.cm.isReadOnly()||_n(this.cm,Ol)(this.cm,String.fromCharCode(null==e.charCode?e.keyCode:e.charCode),0))},Il.prototype.readOnlyChanged=function(e){this.div.contentEditable=String("nocursor"!=e)},Il.prototype.onContextMenu=function(){},Il.prototype.resetPosition=function(){},Il.prototype.needsContentAttribute=!0;var Ul=function(e){this.cm=e,this.prevInput="",this.pollingFast=!1,this.polling=new R,this.hasSelection=!1,this.composing=null};Ul.prototype.init=function(e){var t=this,r=this,n=this.cm;this.createField(e);var i=this.textarea;function o(e){if(!it(n,e)){if(n.somethingSelected())Nl({lineWise:!1,text:n.getSelections()});else{if(!n.options.lineWiseCopyCut)return;var t=Wl(n);Nl({lineWise:!0,text:t.text}),"cut"==e.type?n.setSelections(t.ranges,null,V):(r.prevInput="",i.value=t.text.join("\n"),P(i))}"cut"==e.type&&(n.state.cutIncoming=!0)}}e.wrapper.insertBefore(this.wrapper,e.wrapper.firstChild),g&&(i.style.width="0px"),et(i,"input",function(){l&&s>=9&&t.hasSelection&&(t.hasSelection=null),r.poll()}),et(i,"paste",function(e){it(n,e)||Al(e,n)||(n.state.pasteIncoming=!0,r.fastPoll())}),et(i,"cut",o),et(i,"copy",o),et(e.scroller,"paste",function(t){xr(e,t)||it(n,t)||(n.state.pasteIncoming=!0,r.focus())}),et(e.lineSpace,"selectstart",function(t){xr(e,t)||at(t)}),et(i,"compositionstart",function(){var e=n.getCursor("from");r.composing&&r.composing.range.clear(),r.composing={start:e,range:n.markText(e,n.getCursor("to"),{className:"CodeMirror-composing"})}}),et(i,"compositionend",function(){r.composing&&(r.poll(),r.composing.range.clear(),r.composing=null)})},Ul.prototype.createField=function(e){this.wrapper=Fl(),this.textarea=this.wrapper.firstChild},Ul.prototype.prepareSelection=function(){var e=this.cm,t=e.display,r=e.doc,n=cn(e);if(e.options.moveInputWithCursor){var i=Xr(e,r.sel.primary().head,"div"),o=t.wrapper.getBoundingClientRect(),l=t.lineDiv.getBoundingClientRect();n.teTop=Math.max(0,Math.min(t.wrapper.clientHeight-10,i.top+l.top-o.top)),n.teLeft=Math.max(0,Math.min(t.wrapper.clientWidth-10,i.left+l.left-o.left))}return n},Ul.prototype.showSelection=function(e){var t=this.cm.display;N(t.cursorDiv,e.cursors),N(t.selectionDiv,e.selection),null!=e.teTop&&(this.wrapper.style.top=e.teTop+"px",this.wrapper.style.left=e.teLeft+"px")},Ul.prototype.reset=function(e){if(!this.contextMenuPending&&!this.composing){var t=this.cm;if(t.somethingSelected()){this.prevInput="";var r=t.getSelection();this.textarea.value=r,t.state.focused&&P(this.textarea),l&&s>=9&&(this.hasSelection=r)}else e||(this.prevInput=this.textarea.value="",l&&s>=9&&(this.hasSelection=null))}},Ul.prototype.getField=function(){return this.textarea},Ul.prototype.supportsTouch=function(){return!1},Ul.prototype.focus=function(){if("nocursor"!=this.cm.options.readOnly&&(!m||W()!=this.textarea))try{this.textarea.focus()}catch(e){}},Ul.prototype.blur=function(){this.textarea.blur()},Ul.prototype.resetPosition=function(){this.wrapper.style.top=this.wrapper.style.left=0},Ul.prototype.receivedFocus=function(){this.slowPoll()},Ul.prototype.slowPoll=function(){var e=this;this.pollingFast||this.polling.set(this.cm.options.pollInterval,function(){e.poll(),e.cm.state.focused&&e.slowPoll()})},Ul.prototype.fastPoll=function(){var e=!1,t=this;t.pollingFast=!0,t.polling.set(20,function r(){t.poll()||e?(t.pollingFast=!1,t.slowPoll()):(e=!0,t.polling.set(60,r))})},Ul.prototype.poll=function(){var e=this,t=this.cm,r=this.textarea,n=this.prevInput;if(this.contextMenuPending||!t.state.focused||xt(r)&&!n&&!this.composing||t.isReadOnly()||t.options.disableInput||t.state.keySeq)return!1;var i=r.value;if(i==n&&!t.somethingSelected())return!1;if(l&&s>=9&&this.hasSelection===i||y&&/[\uf700-\uf7ff]/.test(i))return t.display.input.reset(),!1;if(t.doc.sel==t.display.selForContextMenu){var o=i.charCodeAt(0);if(8203!=o||n||(n="\u200b"),8666==o)return this.reset(),this.cm.execCommand("undo")}for(var a=0,u=Math.min(n.length,i.length);a<u&&n.charCodeAt(a)==i.charCodeAt(a);)++a;return Yn(t,function(){Ol(t,i.slice(a),n.length-a,null,e.composing?"*compose":null),i.length>1e3||i.indexOf("\n")>-1?r.value=e.prevInput="":e.prevInput=i,e.composing&&(e.composing.range.clear(),e.composing.range=t.markText(e.composing.start,t.getCursor("to"),{className:"CodeMirror-composing"}))}),!0},Ul.prototype.ensurePolled=function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)},Ul.prototype.onKeyPress=function(){l&&s>=9&&(this.hasSelection=null),this.fastPoll()},Ul.prototype.onContextMenu=function(e){var t=this,r=t.cm,n=r.display,i=t.textarea,o=sn(r,e),u=n.scroller.scrollTop;if(o&&!h){r.options.resetSelectionOnContextMenu&&-1==r.doc.sel.contains(o)&&_n(r,_i)(r.doc,wi(o),V);var c=i.style.cssText,f=t.wrapper.style.cssText;t.wrapper.style.cssText="position: absolute";var d,p=t.wrapper.getBoundingClientRect();if(i.style.cssText="position: absolute; width: 30px; height: 30px;\n      top: "+(e.clientY-p.top-5)+"px; left: "+(e.clientX-p.left-5)+"px;\n      z-index: 1000; background: "+(l?"rgba(255, 255, 255, .05)":"transparent")+";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);",a&&(d=window.scrollY),n.input.focus(),a&&window.scrollTo(null,d),n.input.reset(),r.somethingSelected()||(i.value=t.prevInput=" "),t.contextMenuPending=!0,n.selForContextMenu=r.doc.sel,clearTimeout(n.detectingSelectAll),l&&s>=9&&v(),S){ht(e);var g=function(){rt(window,"mouseup",g),setTimeout(m,20)};et(window,"mouseup",g)}else setTimeout(m,50)}function v(){if(null!=i.selectionStart){var e=r.somethingSelected(),o="\u200b"+(e?i.value:"");i.value="\u21da",i.value=o,t.prevInput=e?"":"\u200b",i.selectionStart=1,i.selectionEnd=o.length,n.selForContextMenu=r.doc.sel}}function m(){if(t.contextMenuPending=!1,t.wrapper.style.cssText=f,i.style.cssText=c,l&&s<9&&n.scrollbars.setScrollTop(n.scroller.scrollTop=u),null!=i.selectionStart){(!l||l&&s<9)&&v();var e=0,o=function(){n.selForContextMenu==r.doc.sel&&0==i.selectionStart&&i.selectionEnd>0&&"\u200b"==t.prevInput?_n(r,ro)(r):e++<10?n.detectingSelectAll=setTimeout(o,500):(n.selForContextMenu=null,n.input.reset())};n.detectingSelectAll=setTimeout(o,200)}}},Ul.prototype.readOnlyChanged=function(e){e||this.reset(),this.textarea.disabled="nocursor"==e},Ul.prototype.setUneditable=function(){},Ul.prototype.needsContentAttribute=!1,function(e){var t=e.optionHandlers;function r(r,n,i,o){e.defaults[r]=n,i&&(t[r]=o?function(e,t,r){r!=yl&&i(e,t,r)}:i)}e.defineOption=r,e.Init=yl,r("value","",function(e,t){return e.setValue(t)},!0),r("mode",null,function(e,t){e.doc.modeOption=t,ki(e)},!0),r("indentUnit",2,ki,!0),r("indentWithTabs",!1),r("smartIndent",!0),r("tabSize",4,function(e){Ti(e),Rr(e),Zn(e)},!0),r("lineSeparator",null,function(e,t){if(e.doc.lineSep=t,t){var r=[],n=e.doc.first;e.doc.iter(function(e){for(var i=0;;){var o=e.text.indexOf(t,i);if(-1==o)break;i=o+t.length,r.push(ge(n,o))}n++});for(var i=r.length-1;i>=0;i--)uo(e.doc,t,r[i],ge(r[i].line,r[i].ch+t.length))}}),r("specialChars",/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g,function(e,t,r){e.state.specialChars=new RegExp(t.source+(t.test("\t")?"":"|\t"),"g"),r!=yl&&e.refresh()}),r("specialCharPlaceholder",Qt,function(e){return e.refresh()},!0),r("electricChars",!0),r("inputStyle",m?"contenteditable":"textarea",function(){throw new Error("inputStyle can not (yet) be changed in a running editor")},!0),r("spellcheck",!1,function(e,t){return e.getInputField().spellcheck=t},!0),r("rtlMoveVisually",!w),r("wholeLineUpdateBefore",!0),r("theme","default",function(e){ml(e),xl(e)},!0),r("keyMap","default",function(e,t,r){var n=jo(t),i=r!=yl&&jo(r);i&&i.detach&&i.detach(e,n),n.attach&&n.attach(e,i||null)}),r("extraKeys",null),r("configureMouse",null),r("lineWrapping",!1,Sl,!0),r("gutters",[],function(e){hi(e.options),xl(e)},!0),r("fixedGutter",!0,function(e,t){e.display.gutters.style.left=t?nn(e.display)+"px":"0",e.refresh()},!0),r("coverGutterNextToScrollbar",!1,function(e){return En(e)},!0),r("scrollbarStyle","native",function(e){Rn(e),En(e),e.display.scrollbars.setScrollTop(e.doc.scrollTop),e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)},!0),r("lineNumbers",!1,function(e){hi(e.options),xl(e)},!0),r("firstLineNumber",1,xl,!0),r("lineNumberFormatter",function(e){return e},xl,!0),r("showCursorWhenSelecting",!1,un,!0),r("resetSelectionOnContextMenu",!0),r("lineWiseCopyCut",!0),r("pasteLinesPerSelection",!0),r("readOnly",!1,function(e,t){"nocursor"==t&&(yn(e),e.display.input.blur()),e.display.input.readOnlyChanged(t)}),r("disableInput",!1,function(e,t){t||e.display.input.reset()},!0),r("dragDrop",!0,Cl),r("allowDropFileTypes",null),r("cursorBlinkRate",530),r("cursorScrollMargin",0),r("cursorHeight",1,un,!0),r("singleCursorHeightPerLine",!0,un,!0),r("workTime",100),r("workDelay",100),r("flattenSpans",!0,Ti,!0),r("addModeClass",!1,Ti,!0),r("pollInterval",100),r("undoDepth",200,function(e,t){return e.doc.history.undoDepth=t}),r("historyEventDelay",1250),r("viewportMargin",10,function(e){return e.refresh()},!0),r("maxHighlightLength",1e4,Ti,!0),r("moveInputWithCursor",!0,function(e,t){t||e.display.input.resetPosition()}),r("tabindex",null,function(e,t){return e.display.input.getField().tabIndex=t||""}),r("autofocus",null),r("direction","ltr",function(e,t){return e.doc.setDirection(t)},!0),r("phrases",null)}(Ll),function(e){var t=e.optionHandlers,r=e.helpers={};e.prototype={constructor:e,focus:function(){window.focus(),this.display.input.focus()},setOption:function(e,r){var n=this.options,i=n[e];n[e]==r&&"mode"!=e||(n[e]=r,t.hasOwnProperty(e)&&_n(this,t[e])(this,r,i),nt(this,"optionChange",this,e))},getOption:function(e){return this.options[e]},getDoc:function(){return this.doc},addKeyMap:function(e,t){this.state.keyMaps[t?"push":"unshift"](jo(e))},removeKeyMap:function(e){for(var t=this.state.keyMaps,r=0;r<t.length;++r)if(t[r]==e||t[r].name==e)return t.splice(r,1),!0},addOverlay:$n(function(t,r){var n=t.token?t:e.getMode(this.options,t);if(n.startState)throw new Error("Overlays may not be stateful.");!function(e,t,r){for(var n=0,i=r(t);n<e.length&&r(e[n])<=i;)n++;e.splice(n,0,t)}(this.state.overlays,{mode:n,modeSpec:t,opaque:r&&r.opaque,priority:r&&r.priority||0},function(e){return e.priority}),this.state.modeGen++,Zn(this)}),removeOverlay:$n(function(e){for(var t=this.state.overlays,r=0;r<t.length;++r){var n=t[r].modeSpec;if(n==e||"string"==typeof e&&n.name==e)return t.splice(r,1),this.state.modeGen++,void Zn(this)}}),indentLine:$n(function(e,t,r){"string"!=typeof t&&"number"!=typeof t&&(t=null==t?this.options.smartIndent?"smart":"prev":t?"add":"subtract"),de(this.doc,e)&&Tl(this,e,t,r)}),indentSelection:$n(function(e){for(var t=this.doc.sel.ranges,r=-1,n=0;n<t.length;n++){var i=t[n];if(i.empty())i.head.line>r&&(Tl(this,i.head.line,e,!0),r=i.head.line,n==this.doc.sel.primIndex&&Tn(this));else{var o=i.from(),l=i.to(),s=Math.max(r,o.line);r=Math.min(this.lastLine(),l.line-(l.ch?0:1))+1;for(var a=s;a<r;++a)Tl(this,a,e);var u=this.doc.sel.ranges;0==o.ch&&t.length==u.length&&u[n].from().ch>0&&ji(this.doc,n,new yi(o,u[n].to()),V)}}}),getTokenAt:function(e,t){return Vt(this,e,t)},getLineTokens:function(e,t){return Vt(this,ge(e),t,!0)},getTokenTypeAt:function(e){e=Ce(this.doc,e);var t,r=It(this,se(this.doc,e.line)),n=0,i=(r.length-1)/2,o=e.ch;if(0==o)t=r[2];else for(;;){var l=n+i>>1;if((l?r[2*l-1]:0)>=o)i=l;else{if(!(r[2*l+1]<o)){t=r[2*l+2];break}n=l+1}}var s=t?t.indexOf("overlay "):-1;return s<0?t:0==s?null:t.slice(0,s-1)},getModeAt:function(t){var r=this.doc.mode;return r.innerMode?e.innerMode(r,this.getTokenAt(t).state).mode:r},getHelper:function(e,t){return this.getHelpers(e,t)[0]},getHelpers:function(e,t){var n=[];if(!r.hasOwnProperty(t))return n;var i=r[t],o=this.getModeAt(e);if("string"==typeof o[t])i[o[t]]&&n.push(i[o[t]]);else if(o[t])for(var l=0;l<o[t].length;l++){var s=i[o[t][l]];s&&n.push(s)}else o.helperType&&i[o.helperType]?n.push(i[o.helperType]):i[o.name]&&n.push(i[o.name]);for(var a=0;a<i._global.length;a++){var u=i._global[a];u.pred(o,this)&&-1==B(n,u.val)&&n.push(u.val)}return n},getStateAfter:function(e,t){var r=this.doc;return zt(this,(e=xe(r,null==e?r.first+r.size-1:e))+1,t).state},cursorCoords:function(e,t){var r=this.doc.sel.primary();return Xr(this,null==e?r.head:"object"==typeof e?Ce(this.doc,e):e?r.from():r.to(),t||"page")},charCoords:function(e,t){return jr(this,Ce(this.doc,e),t||"page")},coordsChar:function(e,t){return $r(this,(e=Kr(this,e,t||"page")).left,e.top)},lineAtHeight:function(e,t){return e=Kr(this,{top:e,left:0},t||"page").top,fe(this.doc,e+this.display.viewOffset)},heightAtLine:function(e,t,r){var n,i=!1;if("number"==typeof e){var o=this.doc.first+this.doc.size-1;e<this.doc.first?e=this.doc.first:e>o&&(e=o,i=!0),n=se(this.doc,e)}else n=e;return Vr(this,n,{top:0,left:0},t||"page",r||i).top+(i?this.doc.height-Xe(n):0)},defaultTextHeight:function(){return en(this.display)},defaultCharWidth:function(){return tn(this.display)},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(e,t,r,n,i){var o,l,s,a=this.display,u=(e=Xr(this,Ce(this.doc,e))).bottom,c=e.left;if(t.style.position="absolute",t.setAttribute("cm-ignore-events","true"),this.display.input.setUneditable(t),a.sizer.appendChild(t),"over"==n)u=e.top;else if("above"==n||"near"==n){var h=Math.max(a.wrapper.clientHeight,this.doc.height),f=Math.max(a.sizer.clientWidth,a.lineSpace.clientWidth);("above"==n||e.bottom+t.offsetHeight>h)&&e.top>t.offsetHeight?u=e.top-t.offsetHeight:e.bottom+t.offsetHeight<=h&&(u=e.bottom),c+t.offsetWidth>f&&(c=f-t.offsetWidth)}t.style.top=u+"px",t.style.left=t.style.right="","right"==i?(c=a.sizer.clientWidth-t.offsetWidth,t.style.right="0px"):("left"==i?c=0:"middle"==i&&(c=(a.sizer.clientWidth-t.offsetWidth)/2),t.style.left=c+"px"),r&&(o=this,l={left:c,top:u,right:c+t.offsetWidth,bottom:u+t.offsetHeight},null!=(s=Ln(o,l)).scrollTop&&An(o,s.scrollTop),null!=s.scrollLeft&&Wn(o,s.scrollLeft))},triggerOnKeyDown:$n(ol),triggerOnKeyPress:$n(sl),triggerOnKeyUp:ll,triggerOnMouseDown:$n(hl),execCommand:function(e){if(qo.hasOwnProperty(e))return qo[e].call(null,this)},triggerElectric:$n(function(e){Dl(this,e)}),findPosH:function(e,t,r,n){var i=1;t<0&&(i=-1,t=-t);for(var o=Ce(this.doc,e),l=0;l<t&&!(o=Pl(this.doc,o,i,r,n)).hitSide;++l);return o},moveH:$n(function(e,t){var r=this;this.extendSelectionsBy(function(n){return r.display.shift||r.doc.extend||n.empty()?Pl(r.doc,n.head,e,t,r.options.rtlMoveVisually):e<0?n.from():n.to()},j)}),deleteH:$n(function(e,t){var r=this.doc.sel,n=this.doc;r.somethingSelected()?n.replaceSelection("",null,"+delete"):Xo(this,function(r){var i=Pl(n,r.head,e,t,!1);return e<0?{from:i,to:r.head}:{from:r.head,to:i}})}),findPosV:function(e,t,r,n){var i=1,o=n;t<0&&(i=-1,t=-t);for(var l=Ce(this.doc,e),s=0;s<t;++s){var a=Xr(this,l,"div");if(null==o?o=a.left:a.left=o,(l=El(this,a,i,r)).hitSide)break}return l},moveV:$n(function(e,t){var r=this,n=this.doc,i=[],o=!this.display.shift&&!n.extend&&n.sel.somethingSelected();if(n.extendSelectionsBy(function(l){if(o)return e<0?l.from():l.to();var s=Xr(r,l.head,"div");null!=l.goalColumn&&(s.left=l.goalColumn),i.push(s.left);var a=El(r,s,e,t);return"page"==t&&l==n.sel.primary()&&kn(r,jr(r,a,"div").top-s.top),a},j),i.length)for(var l=0;l<n.sel.ranges.length;l++)n.sel.ranges[l].goalColumn=i[l]}),findWordAt:function(e){var t=se(this.doc,e.line).text,r=e.ch,n=e.ch;if(t){var i=this.getHelper(e,"wordChars");"before"!=e.sticky&&n!=t.length||!r?++n:--r;for(var o=t.charAt(r),l=te(o,i)?function(e){return te(e,i)}:/\s/.test(o)?function(e){return/\s/.test(e)}:function(e){return!/\s/.test(e)&&!te(e)};r>0&&l(t.charAt(r-1));)--r;for(;n<t.length&&l(t.charAt(n));)++n}return new yi(ge(e.line,r),ge(e.line,n))},toggleOverwrite:function(e){null!=e&&e==this.state.overwrite||((this.state.overwrite=!this.state.overwrite)?H(this.display.cursorDiv,"CodeMirror-overwrite"):T(this.display.cursorDiv,"CodeMirror-overwrite"),nt(this,"overwriteToggle",this,this.state.overwrite))},hasFocus:function(){return this.display.input.getField()==W()},isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:$n(function(e,t){Mn(this,e,t)}),getScrollInfo:function(){var e=this.display.scroller;return{left:e.scrollLeft,top:e.scrollTop,height:e.scrollHeight-kr(this)-this.display.barHeight,width:e.scrollWidth-kr(this)-this.display.barWidth,clientHeight:Mr(this),clientWidth:Tr(this)}},scrollIntoView:$n(function(e,t){null==e?(e={from:this.doc.sel.primary().head,to:null},null==t&&(t=this.options.cursorScrollMargin)):"number"==typeof e?e={from:ge(e,0),to:null}:null==e.from&&(e={from:e,to:null}),e.to||(e.to=e.from),e.margin=t||0,null!=e.from.line?function(e,t){Nn(e),e.curOp.scrollToPos=t}(this,e):On(this,e.from,e.to,e.margin)}),setSize:$n(function(e,t){var r=this,n=function(e){return"number"==typeof e||/^\d+$/.test(String(e))?e+"px":e};null!=e&&(this.display.wrapper.style.width=n(e)),null!=t&&(this.display.wrapper.style.height=n(t)),this.options.lineWrapping&&zr(this);var i=this.display.viewFrom;this.doc.iter(i,this.display.viewTo,function(e){if(e.widgets)for(var t=0;t<e.widgets.length;t++)if(e.widgets[t].noHScroll){Qn(r,i,"widget");break}++i}),this.curOp.forceUpdate=!0,nt(this,"refresh",this)}),operation:function(e){return Yn(this,e)},startOperation:function(){return Gn(this)},endOperation:function(){return Un(this)},refresh:$n(function(){var e=this.display.cachedTextHeight;Zn(this),this.curOp.forceUpdate=!0,Rr(this),Mn(this,this.doc.scrollLeft,this.doc.scrollTop),ai(this),(null==e||Math.abs(e-en(this.display))>.5)&&ln(this),nt(this,"refresh",this)}),swapDoc:$n(function(e){var t=this.doc;return t.cm=null,Ai(this,e),Rr(this),this.display.input.reset(),Mn(this,e.scrollLeft,e.scrollTop),this.curOp.forceScroll=!0,sr(this,"swapDoc",this,t),t}),phrase:function(e){var t=this.options.phrases;return t&&Object.prototype.hasOwnProperty.call(t,e)?t[e]:e},getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}},st(e),e.registerHelper=function(t,n,i){r.hasOwnProperty(t)||(r[t]=e[t]={_global:[]}),r[t][n]=i},e.registerGlobalHelper=function(t,n,i,o){e.registerHelper(t,n,o),r[t]._global.push({pred:i,val:o})}}(Ll);var Vl="iter insert remove copy getEditor constructor".split(" ");for(var Kl in To.prototype)To.prototype.hasOwnProperty(Kl)&&B(Vl,Kl)<0&&(Ll.prototype[Kl]=function(e){return function(){return e.apply(this.doc,arguments)}}(To.prototype[Kl]));return st(To),Ll.inputStyles={textarea:Ul,contenteditable:Il},Ll.defineMode=function(e){Ll.defaults.mode||"null"==e||(Ll.defaults.mode=e),function(e,t){arguments.length>2&&(t.dependencies=Array.prototype.slice.call(arguments,2)),Lt[e]=t}.apply(this,arguments)},Ll.defineMIME=function(e,t){kt[e]=t},Ll.defineMode("null",function(){return{token:function(e){return e.skipToEnd()}}}),Ll.defineMIME("text/plain","null"),Ll.defineExtension=function(e,t){Ll.prototype[e]=t},Ll.defineDocExtension=function(e,t){To.prototype[e]=t},Ll.fromTextArea=function(e,t){if((t=t?I(t):{}).value=e.value,!t.tabindex&&e.tabIndex&&(t.tabindex=e.tabIndex),!t.placeholder&&e.placeholder&&(t.placeholder=e.placeholder),null==t.autofocus){var r=W();t.autofocus=r==e||null!=e.getAttribute("autofocus")&&r==document.body}function n(){e.value=s.getValue()}var i;if(e.form&&(et(e.form,"submit",n),!t.leaveSubmitMethodAlone)){var o=e.form;i=o.submit;try{var l=o.submit=function(){n(),o.submit=i,o.submit(),o.submit=l}}catch(e){}}t.finishInit=function(t){t.save=n,t.getTextArea=function(){return e},t.toTextArea=function(){t.toTextArea=isNaN,n(),e.parentNode.removeChild(t.getWrapperElement()),e.style.display="",e.form&&(rt(e.form,"submit",n),"function"==typeof e.form.submit&&(e.form.submit=i))}},e.style.display="none";var s=Ll(function(t){return e.parentNode.insertBefore(t,e.nextSibling)},t);return s},function(e){e.off=rt,e.on=et,e.wheelEventPixels=gi,e.Doc=To,e.splitLines=wt,e.countColumn=z,e.findColumn=X,e.isWordChar=ee,e.Pass=U,e.signal=nt,e.Line=Xt,e.changeEnd=xi,e.scrollbarModel=zn,e.Pos=ge,e.cmpPos=ve,e.modes=Lt,e.mimeModes=kt,e.resolveMode=Tt,e.getMode=Mt,e.modeExtensions=Nt,e.extendMode=Ot,e.copyState=At,e.startState=Wt,e.innerMode=Dt,e.commands=qo,e.keyMap=zo,e.keyName=Ko,e.isModifierKey=Uo,e.lookupKey=Go,e.normalizeKeyMap=Bo,e.StringStream=Ht,e.SharedTextMarker=Co,e.TextMarker=wo,e.LineWidget=mo,e.e_preventDefault=at,e.e_stopPropagation=ut,e.e_stop=ht,e.addClass=H,e.contains=D,e.rmClass=T,e.keyNames=Fo}(Ll),Ll.version="5.40.2",Ll});
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";var t="CodeMirror-activeline",n="CodeMirror-activeline-background",i="CodeMirror-activeline-gutter";function r(e){for(var r=0;r<e.state.activeLines.length;r++)e.removeLineClass(e.state.activeLines[r],"wrap",t),e.removeLineClass(e.state.activeLines[r],"background",n),e.removeLineClass(e.state.activeLines[r],"gutter",i)}function o(e,o){for(var a=[],s=0;s<o.length;s++){var c=o[s],l=e.getOption("styleActiveLine");if("object"==typeof l&&l.nonEmpty?c.anchor.line==c.head.line:c.empty()){var f=e.getLineHandleVisualStart(c.head.line);a[a.length-1]!=f&&a.push(f)}}(function(e,t){if(e.length!=t.length)return!1;for(var n=0;n<e.length;n++)if(e[n]!=t[n])return!1;return!0})(e.state.activeLines,a)||e.operation(function(){r(e);for(var o=0;o<a.length;o++)e.addLineClass(a[o],"wrap",t),e.addLineClass(a[o],"background",n),e.addLineClass(a[o],"gutter",i);e.state.activeLines=a})}function a(e,t){o(e,t.ranges)}e.defineOption("styleActiveLine",!1,function(t,n,i){var s=i!=e.Init&&i;n!=s&&(s&&(t.off("beforeSelectionChange",a),r(t),delete t.state.activeLines),n&&(t.state.activeLines=[],o(t,t.listSelections()),t.on("beforeSelectionChange",a)))})});
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){function o(o,n,t){var i,r=o.getWrapperElement().parentElement.parentElement;return(i=r.appendChild(document.createElement("div"))).className=t?"CodeMirror-dialog CodeMirror-dialog-bottom":"CodeMirror-dialog CodeMirror-dialog-top","string"==typeof n?i.innerHTML=n:i.appendChild(n),e.addClass(r,"dialog-opened"),i}function n(e,o){e.state.currentNotificationClose&&e.state.currentNotificationClose(),e.state.currentNotificationClose=o}e.defineExtension("openDialog",function(t,i,r){r||(r={}),n(this,null);var u=o(this,t,r.bottom),l=!1,a=this;function c(o){if("string"==typeof o)s.value=o;else{if(l)return;l=!0,e.rmClass(u.parentNode,"dialog-opened"),u.parentNode.removeChild(u),a.focus(),r.onClose&&r.onClose(u)}}var d,s=u.getElementsByTagName("input")[0];return s?(s.focus(),r.value&&(s.value=r.value,!1!==r.selectValueOnOpen&&s.select()),r.onInput&&e.on(s,"input",function(e){r.onInput(e,s.value,c)}),r.onKeyUp&&e.on(s,"keyup",function(e){r.onKeyUp(e,s.value,c)}),e.on(s,"keydown",function(o){r&&r.onKeyDown&&r.onKeyDown(o,s.value,c)||((27==o.keyCode||!1!==r.closeOnEnter&&13==o.keyCode)&&(s.blur(),e.e_stop(o),c()),13==o.keyCode&&i(s.value,o))}),!1!==r.closeOnBlur&&e.on(s,"blur",c)):(d=u.getElementsByTagName("button")[0])&&(e.on(d,"click",function(){c(),a.focus()}),!1!==r.closeOnBlur&&e.on(d,"blur",c),d.focus()),c}),e.defineExtension("openConfirm",function(t,i,r){n(this,null);var u=o(this,t,r&&r.bottom),l=u.getElementsByTagName("button"),a=!1,c=this,d=1;function s(){a||(a=!0,e.rmClass(u.parentNode,"dialog-opened"),u.parentNode.removeChild(u),c.focus())}l[0].focus();for(var f=0;f<l.length;++f){var p=l[f];!function(o){e.on(p,"click",function(n){e.e_preventDefault(n),s(),o&&o(c)})}(i[f]),e.on(p,"blur",function(){--d,setTimeout(function(){d<=0&&s()},200)}),e.on(p,"focus",function(){++d})}}),e.defineExtension("openNotification",function(t,i){n(this,c);var r,u=o(this,t,i&&i.bottom),l=!1,a=i&&void 0!==i.duration?i.duration:5e3;function c(){l||(l=!0,clearTimeout(r),e.rmClass(u.parentNode,"dialog-opened"),u.parentNode.removeChild(u))}return e.on(u,"click",function(o){e.e_preventDefault(o),c()}),a&&(r=setTimeout(c,a)),c})});
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("./searchcursor"),require("../dialog/dialog")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./searchcursor","../dialog/dialog"],e):e(CodeMirror)}(function(e){"use strict";function n(e){return e.state.search||(e.state.search=new function(){this.posFrom=this.posTo=this.lastQuery=this.query=null,this.overlay=null})}function o(e){return"string"==typeof e&&e==e.toLowerCase()}function r(e,n,r){return e.getSearchCursor(n,r,{caseFold:o(n),multiline:!0})}function t(e,n,o,r,t){e.openDialog?e.openDialog(n,t,{value:r,selectValueOnOpen:!0}):t(prompt(o,r))}function i(e){return e.replace(/\\(.)/g,function(e,n){return"n"==n?"\n":"r"==n?"\r":n})}function a(e){var n=e.match(/^\/(.*)\/([a-z]*)$/);if(n)try{e=new RegExp(n[1],-1==n[2].indexOf("i")?"":"i")}catch(e){}else e=i(e);return("string"==typeof e?""==e:e.test(""))&&(e=/x^/),e}function s(e,n,r){n.queryText=r,n.query=a(r),e.removeOverlay(n.overlay,o(n.query)),n.overlay=function(e,n){return"string"==typeof e?e=new RegExp(e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),n?"gi":"g"):e.global||(e=new RegExp(e.source,e.ignoreCase?"gi":"g")),{token:function(n){e.lastIndex=n.pos;var o=e.exec(n.string);if(o&&o.index==n.pos)return n.pos+=o[0].length||1,"searching";o?n.pos=o.index:n.skipToEnd()}}}(n.query,o(n.query)),e.addOverlay(n.overlay),e.showMatchesOnScrollbar&&(n.annotate&&(n.annotate.clear(),n.annotate=null),n.annotate=e.showMatchesOnScrollbar(n.query,o(n.query)))}function c(o,r,i,a){var c=n(o);if(c.query)return l(o,r);var p=o.getSelection()||c.lastQuery;if(p instanceof RegExp&&"x^"==p.source&&(p=null),i&&o.openDialog){var d=null,y=function(n,r){e.e_stop(r),n&&(n!=c.queryText&&(s(o,c,n),c.posFrom=c.posTo=o.getCursor()),d&&(d.style.opacity=1),l(o,r.shiftKey,function(e,n){var r;n.line<3&&document.querySelector&&(r=o.display.wrapper.querySelector(".CodeMirror-dialog"))&&r.getBoundingClientRect().bottom-4>o.cursorCoords(n,"window").top&&((d=r).style.opacity=.4)}))};!function(e,n,o,r,t){e.openDialog(n,r,{value:o,selectValueOnOpen:!0,closeOnEnter:!1,onClose:function(){u(e)},onKeyDown:t})}(o,f(o),p,y,function(r,t){var i=e.keyName(r),a=o.getOption("extraKeys"),c=a&&a[i]||e.keyMap[o.getOption("keyMap")][i];"findNext"==c||"findPrev"==c||"findPersistentNext"==c||"findPersistentPrev"==c?(e.e_stop(r),s(o,n(o),t),o.execCommand(c)):"find"!=c&&"findPersistent"!=c||(e.e_stop(r),y(t,r))}),a&&p&&(s(o,c,p),l(o,r))}else t(o,f(o),"Search for:",p,function(e){e&&!c.query&&o.operation(function(){s(o,c,e),c.posFrom=c.posTo=o.getCursor(),l(o,r)})})}function l(o,t,i){o.operation(function(){var a=n(o),s=r(o,a.query,t?a.posFrom:a.posTo);(s.find(t)||(s=r(o,a.query,t?e.Pos(o.lastLine()):e.Pos(o.firstLine(),0))).find(t))&&(o.setSelection(s.from(),s.to()),o.scrollIntoView({from:s.from(),to:s.to()},20),a.posFrom=s.from(),a.posTo=s.to(),i&&i(s.from(),s.to()))})}function u(e){e.operation(function(){var o=n(e);o.lastQuery=o.query,o.query&&(o.query=o.queryText=null,e.removeOverlay(o.overlay),o.annotate&&(o.annotate.clear(),o.annotate=null))})}function f(e){return'<span class="CodeMirror-search-label">'+e.phrase("Search:")+'</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint"></span>'}function p(e,n,o){e.operation(function(){for(var t=r(e,n);t.findNext();)if("string"!=typeof n){var i=e.getRange(t.from(),t.to()).match(n);t.replace(o.replace(/\$(\d)/g,function(e,n){return i[n]}))}else t.replace(o)})}function d(e,o){if(!e.getOption("readOnly")){var s=e.getSelection()||n(e).lastQuery,c='<span class="CodeMirror-search-label">'+(o?e.phrase("Replace all:"):e.phrase("Replace:"))+"</span>";t(e,c+function(e){return' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'+e.phrase("(Use /re/ syntax for regexp search)")+"</span>"}(e),c,s,function(n){n&&(n=a(n),t(e,function(e){return'<span class="CodeMirror-search-label">'+e.phrase("With:")+'</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/>'}(e),e.phrase("Replace with:"),"",function(t){if(t=i(t),o)p(e,n,t);else{u(e);var a=r(e,n,e.getCursor("from")),s=function(){var o,i=a.from();!(o=a.findNext())&&(a=r(e,n),!(o=a.findNext())||i&&a.from().line==i.line&&a.from().ch==i.ch)||(e.setSelection(a.from(),a.to()),e.scrollIntoView({from:a.from(),to:a.to()}),function(e,n,o,r){e.openConfirm?e.openConfirm(n,r):confirm(o)&&r[0]()}(e,function(e){return'<span class="CodeMirror-search-label">'+e.phrase("Replace?")+"</span> <button>"+e.phrase("Yes")+"</button> <button>"+e.phrase("No")+"</button> <button>"+e.phrase("All")+"</button> <button>"+e.phrase("Stop")+"</button> "}(e),e.phrase("Replace?"),[function(){c(o)},s,function(){p(e,n,t)}]))},c=function(e){a.replace("string"==typeof n?t:t.replace(/\$(\d)/g,function(n,o){return e[o]})),s()};s()}}))})}}e.commands.find=function(e){u(e),c(e)},e.commands.findPersistent=function(e){u(e),c(e,!1,!0)},e.commands.findPersistentNext=function(e){c(e,!1,!0,!0)},e.commands.findPersistentPrev=function(e){c(e,!0,!0,!0)},e.commands.findNext=c,e.commands.findPrev=function(e){c(e,!0)},e.commands.clearSearch=u,e.commands.replace=d,e.commands.replaceAll=function(e){d(e,!0)}});
!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],t):t(CodeMirror)}(function(t){"use strict";var n,e,r=t.Pos;function i(t,n){for(var e=function(t){var n=t.flags;return null!=n?n:(t.ignoreCase?"i":"")+(t.global?"g":"")+(t.multiline?"m":"")}(t),r=e,i=0;i<n.length;i++)-1==r.indexOf(n.charAt(i))&&(r+=n.charAt(i));return e==r?t:new RegExp(t.source,r)}function o(t,n,e){n=i(n,"g");for(var o=e.line,l=e.ch,h=t.lastLine();o<=h;o++,l=0){n.lastIndex=l;var s=t.getLine(o),c=n.exec(s);if(c)return{from:r(o,c.index),to:r(o,c.index+c[0].length),match:c}}}function l(t,n){for(var e,r=0;;){n.lastIndex=r;var i=n.exec(t);if(!i)return e;if((r=(e=i).index+(e[0].length||1))==t.length)return e}}function h(t,n,e,r){if(t.length==n.length)return e;for(var i=0,o=e+Math.max(0,t.length-n.length);;){if(i==o)return i;var l=i+o>>1,h=r(t.slice(0,l)).length;if(h==e)return l;h>e?o=l:i=l+1}}function s(t,s,c,f){var u;this.atOccurrence=!1,this.doc=t,c=c?t.clipPos(c):r(0,0),this.pos={from:c,to:c},"object"==typeof f?u=f.caseFold:(u=f,f=null),"string"==typeof s?(null==u&&(u=!1),this.matches=function(i,o){return(i?function(t,i,o,l){if(!i.length)return null;var s=l?n:e,c=s(i).split(/\r|\n\r?/);t:for(var f=o.line,u=o.ch,a=t.firstLine()-1+c.length;f>=a;f--,u=-1){var g=t.getLine(f);u>-1&&(g=g.slice(0,u));var m=s(g);if(1==c.length){var v=m.lastIndexOf(c[0]);if(-1==v)continue t;return{from:r(f,h(g,m,v,s)),to:r(f,h(g,m,v+c[0].length,s))}}var d=c[c.length-1];if(m.slice(0,d.length)==d){var p=1;for(o=f-c.length+1;p<c.length-1;p++)if(s(t.getLine(o+p))!=c[p])continue t;var x=t.getLine(f+1-c.length),L=s(x);if(L.slice(L.length-c[0].length)==c[0])return{from:r(f+1-c.length,h(x,L,x.length-c[0].length,s)),to:r(f,h(g,m,d.length,s))}}}}:function(t,i,o,l){if(!i.length)return null;var s=l?n:e,c=s(i).split(/\r|\n\r?/);t:for(var f=o.line,u=o.ch,a=t.lastLine()+1-c.length;f<=a;f++,u=0){var g=t.getLine(f).slice(u),m=s(g);if(1==c.length){var v=m.indexOf(c[0]);if(-1==v)continue t;return o=h(g,m,v,s)+u,{from:r(f,h(g,m,v,s)+u),to:r(f,h(g,m,v+c[0].length,s)+u)}}var d=m.length-c[0].length;if(m.slice(d)==c[0]){for(var p=1;p<c.length-1;p++)if(s(t.getLine(f+p))!=c[p])continue t;var x=t.getLine(f+c.length-1),L=s(x),C=c[c.length-1];if(L.slice(0,C.length)==C)return{from:r(f,h(g,m,d,s)+u),to:r(f+c.length-1,h(x,L,C.length,s))}}}})(t,s,o,u)}):(s=i(s,"gm"),f&&!1===f.multiline?this.matches=function(n,e){return(n?function(t,n,e){n=i(n,"g");for(var o=e.line,h=e.ch,s=t.firstLine();o>=s;o--,h=-1){var c=t.getLine(o);h>-1&&(c=c.slice(0,h));var f=l(c,n);if(f)return{from:r(o,f.index),to:r(o,f.index+f[0].length),match:f}}}:o)(t,s,e)}:this.matches=function(n,e){return(n?function(t,n,e){n=i(n,"gm");for(var o,h=1,s=e.line,c=t.firstLine();s>=c;){for(var f=0;f<h;f++){var u=t.getLine(s--);o=null==o?u.slice(0,e.ch):u+"\n"+o}h*=2;var a=l(o,n);if(a){var g=o.slice(0,a.index).split("\n"),m=a[0].split("\n"),v=s+g.length,d=g[g.length-1].length;return{from:r(v,d),to:r(v+m.length-1,1==m.length?d+m[0].length:m[m.length-1].length),match:a}}}}:function(t,n,e){if(!function(t){return/\\s|\\n|\n|\\W|\\D|\[\^/.test(t.source)}(n))return o(t,n,e);n=i(n,"gm");for(var l,h=1,s=e.line,c=t.lastLine();s<=c;){for(var f=0;f<h&&!(s>c);f++){var u=t.getLine(s++);l=null==l?u:l+"\n"+u}h*=2,n.lastIndex=e.ch;var a=n.exec(l);if(a){var g=l.slice(0,a.index).split("\n"),m=a[0].split("\n"),v=e.line+g.length-1,d=g[g.length-1].length;return{from:r(v,d),to:r(v+m.length-1,1==m.length?d+m[0].length:m[m.length-1].length),match:a}}}})(t,s,e)})}String.prototype.normalize?(n=function(t){return t.normalize("NFD").toLowerCase()},e=function(t){return t.normalize("NFD")}):(n=function(t){return t.toLowerCase()},e=function(t){return t}),s.prototype={findNext:function(){return this.find(!1)},findPrevious:function(){return this.find(!0)},find:function(n){for(var e=this.matches(n,this.doc.clipPos(n?this.pos.from:this.pos.to));e&&0==t.cmpPos(e.from,e.to);)n?e.from.ch?e.from=r(e.from.line,e.from.ch-1):e=e.from.line==this.doc.firstLine()?null:this.matches(n,this.doc.clipPos(r(e.from.line-1))):e.to.ch<this.doc.getLine(e.to.line).length?e.to=r(e.to.line,e.to.ch+1):e=e.to.line==this.doc.lastLine()?null:this.matches(n,r(e.to.line+1,0));if(e)return this.pos=e,this.atOccurrence=!0,this.pos.match||!0;var i=r(n?this.doc.firstLine():this.doc.lastLine()+1,0);return this.pos={from:i,to:i},this.atOccurrence=!1},from:function(){if(this.atOccurrence)return this.pos.from},to:function(){if(this.atOccurrence)return this.pos.to},replace:function(n,e){if(this.atOccurrence){var i=t.splitLines(n);this.doc.replaceRange(i,this.pos.from,this.pos.to,e),this.pos.to=r(this.pos.from.line+i.length-1,i[i.length-1].length+(1==i.length?this.pos.from.ch:0))}}},t.defineExtension("getSearchCursor",function(t,n,e){return new s(this.doc,t,n,e)}),t.defineDocExtension("getSearchCursor",function(t,n,e){return new s(this,t,n,e)}),t.defineExtension("selectMatches",function(n,e){for(var r=[],i=this.getSearchCursor(n,this.getCursor("from"),e);i.findNext()&&!(t.cmpPos(i.to(),this.getCursor("to"))>0);)r.push({anchor:i.from(),head:i.to()});r.length&&this.setSelections(r,0)})});
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("../dialog/dialog")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../dialog/dialog"],e):e(CodeMirror)}(function(e){"use strict";function r(e,r){var o=Number(r);return/^[-+]/.test(r)?e.getCursor().line+o:o-1}e.commands.jumpToLine=function(e){var o=e.getCursor();!function(e,r,o,t,i){e.openDialog?e.openDialog(r,i,{value:t,selectValueOnOpen:!0}):i(prompt(o,t))}(e,function(e){return e.phrase("Jump to line:")+' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'+e.phrase("(Use line:column or scroll% syntax)")+"</span>"}(e),e.phrase("Jump to line:"),o.line+1+":"+o.ch,function(t){var i;if(t)if(i=/^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/.exec(t))e.setCursor(r(e,i[1]),Number(i[2]));else if(i=/^\s*([\+\-]?\d+(\.\d+)?)\%\s*/.exec(t)){var n=Math.round(e.lineCount()*Number(i[1])/100);/^[-+]/.test(i[1])&&(n=o.line+n+1),e.setCursor(n-1,o.ch)}else(i=/^\s*\:?\s*([\+\-]?\d+)\s*/.exec(t))&&e.setCursor(r(e,i[1]),o.ch)})},e.keyMap.default["Alt-G"]="jumpToLine"});
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";var n={},t=/[^\s\u00a0]/,i=e.Pos;function l(e){var n=e.search(t);return-1==n?0:n}function o(e,n){var t=e.getMode();return!1!==t.useInnerComments&&t.innerMode?e.getModeAt(n):t}e.commands.toggleComment=function(e){e.toggleComment()},e.defineExtension("toggleComment",function(e){e||(e=n);for(var t=1/0,l=this.listSelections(),o=null,r=l.length-1;r>=0;r--){var a=l[r].from(),m=l[r].to();a.line>=t||(m.line>=t&&(m=i(t,0)),t=a.line,null==o?this.uncomment(a,m,e)?o="un":(this.lineComment(a,m,e),o="line"):"un"==o?this.uncomment(a,m,e):this.lineComment(a,m,e))}}),e.defineExtension("lineComment",function(e,r,a){a||(a=n);var m=this,c=o(m,e),f=m.getLine(e.line);if(null!=f&&(g=e,s=f,!/\bstring\b/.test(m.getTokenTypeAt(i(g.line,0)))||/^[\'\"\`]/.test(s))){var g,s,d=a.lineComment||c.lineComment;if(d){var u=Math.min(0!=r.ch||r.line==e.line?r.line+1:r.line,m.lastLine()+1),h=null==a.padding?" ":a.padding,p=a.commentBlankLines||e.line==r.line;m.operation(function(){if(a.indent){for(var n=null,o=e.line;o<u;++o){var r=(c=m.getLine(o)).slice(0,l(c));(null==n||n.length>r.length)&&(n=r)}for(o=e.line;o<u;++o){var c=m.getLine(o),f=n.length;(p||t.test(c))&&(c.slice(0,f)!=n&&(f=l(c)),m.replaceRange(n+d+h,i(o,0),i(o,f)))}}else for(o=e.line;o<u;++o)(p||t.test(m.getLine(o)))&&m.replaceRange(d+h,i(o,0))})}else(a.blockCommentStart||c.blockCommentStart)&&(a.fullLines=!0,m.blockComment(e,r,a))}}),e.defineExtension("blockComment",function(e,l,r){r||(r=n);var a=this,m=o(a,e),c=r.blockCommentStart||m.blockCommentStart,f=r.blockCommentEnd||m.blockCommentEnd;if(c&&f){if(!/\bcomment\b/.test(a.getTokenTypeAt(i(e.line,0)))){var g=Math.min(l.line,a.lastLine());g!=e.line&&0==l.ch&&t.test(a.getLine(g))&&--g;var s=null==r.padding?" ":r.padding;e.line>g||a.operation(function(){if(0!=r.fullLines){var n=t.test(a.getLine(g));a.replaceRange(s+f,i(g)),a.replaceRange(c+s,i(e.line,0));var o=r.blockCommentLead||m.blockCommentLead;if(null!=o)for(var d=e.line+1;d<=g;++d)(d!=g||n)&&a.replaceRange(o+s,i(d,0))}else a.replaceRange(f,l),a.replaceRange(c,e)})}}else(r.lineComment||m.lineComment)&&0!=r.fullLines&&a.lineComment(e,l,r)}),e.defineExtension("uncomment",function(e,l,r){r||(r=n);var a,m=this,c=o(m,e),f=Math.min(0!=l.ch||l.line==e.line?l.line:l.line-1,m.lastLine()),g=Math.min(e.line,f),s=r.lineComment||c.lineComment,d=[],u=null==r.padding?" ":r.padding;e:if(s){for(var h=g;h<=f;++h){var p=m.getLine(h),v=p.indexOf(s);if(v>-1&&!/comment/.test(m.getTokenTypeAt(i(h,v+1)))&&(v=-1),-1==v&&t.test(p))break e;if(v>-1&&t.test(p.slice(0,v)))break e;d.push(p)}if(m.operation(function(){for(var e=g;e<=f;++e){var n=d[e-g],t=n.indexOf(s),l=t+s.length;t<0||(n.slice(l,l+u.length)==u&&(l+=u.length),a=!0,m.replaceRange("",i(e,t),i(e,l)))}}),a)return!0}var C=r.blockCommentStart||c.blockCommentStart,b=r.blockCommentEnd||c.blockCommentEnd;if(!C||!b)return!1;var k=r.blockCommentLead||c.blockCommentLead,L=m.getLine(g),x=L.indexOf(C);if(-1==x)return!1;var R=f==g?L:m.getLine(f),O=R.indexOf(b,f==g?x+C.length:0),T=i(g,x+1),y=i(f,O+1);if(-1==O||!/comment/.test(m.getTokenTypeAt(T))||!/comment/.test(m.getTokenTypeAt(y))||m.getRange(T,y,"\n").indexOf(b)>-1)return!1;var E=L.lastIndexOf(C,e.ch),M=-1==E?-1:L.slice(0,e.ch).indexOf(b,E+C.length);if(-1!=E&&-1!=M&&M+b.length!=e.ch)return!1;M=R.indexOf(b,l.ch);var S=R.slice(l.ch).lastIndexOf(C,M-l.ch);return E=-1==M||-1==S?-1:l.ch+S,(-1==M||-1==E||E==l.ch)&&(m.operation(function(){m.replaceRange("",i(f,O-(u&&R.slice(O-u.length,O)==u?u.length:0)),i(f,O+b.length));var e=x+C.length;if(u&&L.slice(e,e+u.length)==u&&(e+=u.length),m.replaceRange("",i(g,x),i(g,e)),k)for(var n=g+1;n<=f;++n){var l=m.getLine(n),o=l.indexOf(k);if(-1!=o&&!t.test(l.slice(0,o))){var r=o+k.length;u&&l.slice(r,r+u.length)==u&&(r+=u.length),m.replaceRange("",i(n,o),i(n,r))}}}),!0)})});
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.commands.scrollUp = function(cm) {
    cm.scrollUp();
  };

  CodeMirror.commands.scrollDown = function(cm) {
    cm.scrollDown();
  };

  CodeMirror.defineExtension("scrollUp", function(options) {
	let y = this.getScrollInfo().top;
	y -= this.defaultTextHeight();
	this.scrollTo(null, y);
  });

  CodeMirror.defineExtension("scrollDown", function(options) {
	let y = this.getScrollInfo().top;
	y += this.defaultTextHeight();
	this.scrollTo(null, y);
  });
});
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var Pos = CodeMirror.Pos;

  CodeMirror.commands.unindent = function(cm) {
    cm.unindent();
  };

  CodeMirror.defineExtension("unindent", function(options)
  {
    let tabsize = this.getOption("tabSize");
    let minLine = Infinity;
    let ranges = this.listSelections();
    let cm = this;
    this.operation(function() {
          let didSomething = false;
          for (let i=ranges.length-1; i>=0; i--)
          {
            let from = ranges[i].from();
            let to = ranges[i].to();
            if (from.line >= minLine) continue;
            if (to.line >= minLine) to = Pos(minLine, 0);
            let end = Math.min(to.ch != 0 || to.line == from.line ? to.line : to.line - 1, cm.lastLine());
            let start = Math.min(from.line, end);
            for (let l=start; l<=end; l++)
            {
              let line = cm.getLine(l);
              if (! line) continue;
              let empty = 0;
              for (let j=0; j<Math.min(tabsize, line.length); j++)
              {
                if (line[j] == ' ') empty++;
                else if (line[j] == '\t') { empty = tabsize; break; }
                else break;
              }
              if (empty == tabsize) cm.indentLine(l, "subtract");
            }
          }
        });
    return true;
  });
});
// CodeMirror mode "text/tscript"

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("text/tscript", function(config, parserConfig)
{
	const keywords = {
			"var": true,
			"function": true,
			"if": true,
			"then": true,
			"else": true,
			"for": true,
			"do": true,
			"while": true,
			"break": true,
			"continue": true,
			"return": true,
			"not": true,
			"and": true,
			"or": true,
			"xor": true,
			"null": true,
			"true": true,
			"false": true,
			"try": true,
			"catch": true,
			"throw": true,
			"class": true,
			"public": true,
			"protected": true,
			"private": true,
			"static": true,
			"constructor": true,
			"this": true,
			"super": true,
			"namespace": true,
			"use": true,
			"from": true,
			"module": true,
			"include": true,
			"import": true,
			"export": true,
			"const": true,
			"switch": true,
			"case": true,
			"default": true,
			"enum": true,
			"operator": true,
		};
	const builtins = {
			"Null": true,
			"Boolean": true,
			"Integer": true,
			"Real": true,
			"String": true,
			"Array": true,
			"Dictionary": true,
			"Function": true,
			"Range": true,
			"Type": true,
		};
	const digits = "0123456789";
	const operators = "=<>!^+-*/%:";
	const groupings = "()[]{}";
	const delimiters = ",;.";

	// Interface
	return {
		startState: function()
		{
			return {
				"prev": null,
				"blockcomment": false,
				"indent": 0,
			};
		},

	    token: function(stream, state)
	    {
			state.indent = stream.indentation();
			state.prev = null;

			stream.eatSpace();

			if (state.blockcomment)
			{
				let star = false;
				while (! stream.eol())
				{
					let c = stream.next();
					if (c == '#')
					{
						if (star)
						{
							state.blockcomment = false;
							break;
						}
					}
					star = (c == '*');
				}
				return "comment";
			}

			var s = "";
			var type = null;
			var err = false;
			let c = stream.next();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
			{
				// parse an identifier or a keyword
				type = "variable";
				s += c;
				while (! stream.eol())
				{
					let c = stream.next();
					if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_') s += c;
					else { stream.backUp(1); break; }
				}
				if (keywords.hasOwnProperty(s)) type = "keyword";
				else if (builtins.hasOwnProperty(s)) type = "builtin";
			}
			else if (c >= '0' && c <= '9')
			{
				// parse a number, integer or float
				type = "atom";
				s += c;
				while (! stream.eol())
				{
					c = stream.next();
					if (digits.indexOf(c) >= 0) s += c;
					else { stream.backUp(1); break; }
				}
				if (! stream.eol())
				{
					if (! stream.eol())
					{
						c = stream.next();
						if (c == '.')
						{
							// parse fractional part
							s += c;
							type = "number";
							if (stream.eol()) err = true;
							else
							{
								c = stream.next();
								if (digits.indexOf(c) >= 0) s += c;
								else err = true;
								while (! stream.eol())
								{
									c = stream.next();
									if (digits.indexOf(c) >= 0) s += c;
									else { stream.backUp(1); break; }
								}
							}
						}
						else stream.backUp(1);
					}

					if (! stream.eol())
					{
						c = stream.next();
						if (c == 'e' || c == 'E')
						{
							// parse exponent
							s += c;
							type = "number";
							c = stream.next();
							if (c == '+' || c == '-') { s += c; c = stream.next(); }
							if (digits.indexOf(c) < 0) err = true;
							else if (c !== null) s += c;
							while (! stream.eol())
							{
								c = stream.next();
								if (digits.indexOf(c) >= 0) s += c;
								else { stream.backUp(1); break; }
							}
						}
						else stream.backUp(1);
					}
				}
				try
				{
					let n = parseFloat(s);
					if (type == "atom" && (n > 2147483647)) type = "number";
				}
				catch (ex)
				{
					err = true;
				}
			}
			else if (c == '\"')
			{
				// parse string token
				type = "string";
				while (true)
				{
					if (stream.eol()) { err = true; break; }
					c = stream.next();
					if (c == '\\')
					{
						c = stream.next();
						if (c == 'r') c = '\r';
						else if (c == 'n') c = '\n';
						else if (c == 't') c = '\t';
						else if (c == '\\') c = '\\';
						else err = true;
					}
					else if (c == '\"') break;
				}
			}
			else if (operators.indexOf(c) >= 0)
			{
				type = "operator";
				s += c;
				while (! stream.eol())
				{
					c = stream.next();
					if (operators.indexOf(c) >= 0) s += c;
					else { stream.backUp(1); break; }
				}
			}
			else if (c == "#")
			{
				type = "comment";
				if (! stream.eol() && stream.next() == "*")
				{
					let star = false;
					while (! stream.eol())
					{
						c = stream.next();
						if (c == '#')
						{
							if (star) return type;
						}
						star = (c == '*');
					}
					state.blockcomment = true;
				}
				else
				{
					stream.skipToEnd();
				}
			}
			else if (groupings.indexOf(c) >= 0)
			{
				state.prev = c;
				type = "bracket";
			}
			else if (delimiters.indexOf(c) >= 0) type = "punctuation";
			stream.eatSpace();

			if (err) return (type) ? (type + " error") : "error";
			else return type;
	    },

		indent: function(state, textAfter)
		{
			if (textAfter && textAfter[0] == '}') return (state.prev == '{') ? state.indent : state.indent - 4;
			else if (state.prev == '{') return state.indent + 4;
			else return CodeMirror.Pass;
		},

		electricInput: /^\s*[{}]$/,
		blockCommentStart: "#*",
		blockCommentEnd: "*#",
		lineComment: "#",
		fold: "brace"
	};
});

});
"use strict";

let isStrict = (function() { return !this; })();
if (! isStrict) console.log("WARNING: NOT IN STRICT MODE!");

///////////////////////////////////////////////////////////
// The TScript Programming Language
//
// This file defines the complete TScript programming
// language. See the documentation for details.
//


let TScript = (function() {

let module = {
	// T-Script version
	version: {
			type: "beta",
			major: 0,
			minor: 5,
			patch: 41,
			day: 2,
			month: 12,
			year: 2020,
			full: function()
					{
						let s = "TScript version " + module.version.major
								+ "." + module.version.minor
								+ "." + module.version.patch;
						if (module.version.type) s += " " + module.version.type
						s += " - released " + module.version.day
								+ "." + module.version.month
								+ "." + module.version.year
								+ " - (C) Tobias Glasmachers 2018" + "-" + module.version.year;
						return s;
					},
		},

	// hard-coded IDs of the core types
	typeid_null: 0,
	typeid_boolean: 1,
	typeid_integer: 2,
	typeid_real: 3,
	typeid_string: 4,
	typeid_array: 5,
	typeid_dictionary: 6,
	typeid_function: 7,
	typeid_range: 8,
	typeid_type: 9,
	typeid_class: 10,   // class IDs start here

	// implementation limit
	maxstacksize: 1000,

	// options and configurations
	options: {
			checkstyle: false,   // must be false by default, so counter examples in the documentation work
		},
};


///////////////////////////////////////////////////////////
// small helper functions
//

module.ex2string = function(ex)
{
	if (ex === undefined) return "undefined";
	if (ex === null) return "null";
	if (typeof ex == "object")
	{
		if (ex.hasOwnProperty("message")) return ex.message;
		if (ex.hasOwnProperty("name")) return ex.name;
	}
	return String(ex);
}

// exception type
function AssertionError(msg) { this.message = msg; }
AssertionError.prototype = new Error();

module.assert = function(condition, message)
{
	if (message === undefined) message = "TScript internal assertion failed";
	else message = "TScript internal assertion failed; " + message;
	if (! condition) throw new AssertionError(message);
}

// obtain the "displayname", which is the "name" if no special displayname is defined
module.displayname = function(arg)
{
	if (arg.hasOwnProperty("displayname")) return arg.displayname;
	else if (arg.hasOwnProperty("name")) return arg.name;
	else return "";
}

// check whether type equals or is derived from super
module.isDerivedFrom = function(type, super_id)
{
	if (typeof super_id == "number")
	{
		while (type)
		{
			if (type.id == super_id) return true;
			type = type.superclass;
		}
	}
	else if (typeof super_id == "string")
	{
		while (type)
		{
			if (module.displayname(type) == super_id) return true;
			type = type.superclass;
		}
	}
	return false;
}

// check whether type is derived from integer or real
module.isNumeric = function(type)
{
	while (type)
	{
		if (module.isDerivedFrom(type, module.typeid_integer) || module.isDerivedFrom(type, module.typeid_real)) return true;
		type = type.superclass;
	}
	return false;
}

// Recursively apply an operation to a loop-free typed data structure.
// If a loop is detected then a "recursive data structure" exception is thrown.
// The function operation is invoked on each non-container value.
// The function compose(...) is invoked on a container holding return values
// of operation and container. Both functions return the processed result.
function recApply(value, operation, compose)
{
	function doit(v, k)
	{
		if (v.type.id == module.typeid_array)
		{
			if (k.has(v)) throw "recursive data structure";
			let known = new Set(k)
			known.add(v);
			let b = [];
			for (let i=0; i<v.value.b.length; i++)
			{
				let c = doit.call(this, v.value.b[i], known);
				b.push(c);
			}
			return compose.call(this, b);
		}
		else if (v.type.id == module.typeid_dictionary)
		{
			if (k.has(v)) throw "recursive data structure";
			let known = new Set(k)
			known.add(v);
			let b = {};
			for (let key in v.value.b)
			{
				if (! v.value.b.hasOwnProperty(key)) continue;
				let c = doit.call(this, v.value.b[key], known);
				b[key] = c;
			}
			return compose.call(this, b);
		}
		else
		{
			return operation.call(this, v);
		}
	}
	return doit.call(this, value, new Set());
}

// convert typed value to string
module.toString = function (arg)
{
	try
	{
		return recApply(arg,
				function(value)
				{
					if (module.isDerivedFrom(value.type, module.typeid_null)) return "null";
					else if (module.isDerivedFrom(value.type, module.typeid_boolean)) return value.value.b ? "true" : "false";
					else if (module.isDerivedFrom(value.type, module.typeid_integer)) return value.value.b.toString();
					else if (module.isDerivedFrom(value.type, module.typeid_real)) return value.value.b.toString();
					else if (module.isDerivedFrom(value.type, module.typeid_string)) return value.value.b;
					else if (module.isDerivedFrom(value.type, module.typeid_function))
					{
						let s = "<Function";
						if (value.value.b.func.displayname) s += " " + value.value.b.func.displayname;
						else if (value.value.b.func.name) s += " " + value.value.b.func.name;
						else if (value.value.b.func.where) s += " anonymous " + value.value.b.func.where.line + ":" + value.value.b.func.where.ch;
						s += ">";
						return s;
					}
					else if (module.isDerivedFrom(value.type, module.typeid_range)) return value.value.b.begin.toString() + ":" + value.value.b.end.toString();
					else if (module.isDerivedFrom(value.type, module.typeid_type)) return "<Type " + module.displayname(value.value.b) + ">";
					else return "<" + module.displayname(value.type) + ">";
				},
				function(value)
				{
					if (Array.isArray(value))
					{
						let s = "[";
						for (let i=0; i<value.length; i++)
						{
							if (i += 0) s += ",";
							s += value[i];
						}
						s += "]";
						return s;
					}
					else if (typeof value == "object" && value.constructor == Object)
					{
						let s = "{";
						let first = true;
						for (let key in value)
						{
							if (! value.hasOwnProperty(key)) continue;
							if (first) first = false;
							else s += ",";
							s += key.substring(1) + ":" + value[key];
						}
						s += "}";
						return s;
					}
					else module.assert(false, "[module.toString] internal error");
				});
	}
	catch (ex)
	{
		if (ex == "recursive data structure") this.error("/argument-mismatch/am-43");
		else throw ex;
	}
}

module.isInt32 = function(arg)
{
	return (Number.isInteger(arg) && arg >= -2147483648 && arg <= 2147483647);
}

module.mul32 = function(lhs, rhs)
{
	let a = lhs & 0xffff;
	let b = lhs - a;
	return ((b * rhs | 0) + (a * rhs)) | 0;
}

module.mod = function(lhs, rhs)
{
	if (rhs == 0) this.error("/argument-mismatch/am-15");
	else return (rhs > 0)
			? lhs - rhs * Math.floor(lhs / rhs)
			: rhs * Math.floor(lhs / rhs) - lhs;
}

// convert a JSON value to a typed data structure, call with interpreter as this argument
module.json2typed = function(arg)
{
	let t = typeof arg;
	if (arg === null)
	{
		return {"type": this.program.types[module.typeid_null], "value": {"b": arg}};
	}
	else if (t == "boolean")
	{
		return {"type": this.program.types[module.typeid_boolean], "value": {"b": arg}};
	}
	else if (t == "number")
	{
		if (module.isInt32(arg)) return {"type": this.program.types[module.typeid_integer], "value": {"b": arg}};
		else return {"type": this.program.types[module.typeid_real], "value": {"b": arg}};
	}
	else if (t == "string")
	{
		return {"type": this.program.types[module.typeid_string], "value": {"b": arg}};
	}
	else if (Array.isArray(arg))
	{
		let ret = [];
		for (let i=0; i<arg.length; i++) ret.push(module.json2typed.call(this, arg[i]));
		return {"type": this.program.types[module.typeid_array], "value": {"b": ret}};
	}
	else if (t == "object" && arg.constructor == Object)
	{
		let ret = {};
		for (let key in arg)
		{
			if (! arg.hasOwnProperty(key)) continue;
			ret['#' + key] = module.json2typed.call(this, arg[key]);
		}
		return {"type": this.program.types[module.typeid_dictionary], "value": {"b": ret}};
	}
	else
	{
		throw new Error("[json2typed] invalid argument");
	}
}

// convert typed data structure to a JSON value, call with interpreter as this argument
module.typed2json = function(arg)
{
	return recApply(arg,
			function(value)
			{
				module.assert(value.type.id === module.typeid_null
						|| value.type.id === module.typeid_boolean
						|| value.type.id === module.typeid_integer
						|| value.type.id === module.typeid_real
						|| value.type.id === module.typeid_string,
						"[typed2json] invalid argument");
				return value.value.b;
			},
			function(value)
			{
				if (Array.isArray(value))
				{
					return value;
				}
				else
				{
					let ret = {};
					for (let key in value)
					{
						if (! value.hasOwnProperty(key)) continue;
						ret[key.substring(1)] = value[key];
					}
					return ret;
				}
			});
}

// compare typed values for equality, return true or false
module.equal = function(lhs, rhs)
{
	let rec = function(lhs, rhs, k)
	{
		if (lhs === rhs) return true;
		else if (lhs.type === rhs.type && lhs.value == rhs.value) return true;
		else if (module.isDerivedFrom(lhs.type, module.typeid_null) && module.isDerivedFrom(rhs.type, module.typeid_null))
		{
			// null values are always equal
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
		{
			// compare booleans
			return (lhs.value.b == rhs.value.b);
		}
		else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
		{
			// compare numbers
			return ((isNaN(lhs.value.b) && isNaN(rhs.value.b)) || (lhs.value.b == rhs.value.b));
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_string) && module.isDerivedFrom(rhs.type, module.typeid_string))
		{
			// compare strings
			return (lhs.value.b == rhs.value.b);
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_array) && module.isDerivedFrom(rhs.type, module.typeid_array))
		{
			// compare arrays lexicographically by items
			if (lhs.value.b.length != rhs.value.b.length) return false;
			if (k.has(lhs)) throw "recursive data structure";
			if (k.has(rhs)) throw "recursive data structure";
			let known = new Set(k)
			known.add(lhs);
			known.add(rhs);
			for (let i=0; i<lhs.value.b.length; i++)
			{
				if (! rec.call(this, lhs.value.b[i], rhs.value.b[i], known)) return false;
			}
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_dictionary) && module.isDerivedFrom(rhs.type, module.typeid_dictionary))
		{
			// compare dictionaries by keys and values
			if (k.has(lhs)) throw "recursive data structure";
			if (k.has(rhs)) throw "recursive data structure";
			let known = new Set(k)
			known.add(lhs);
			known.add(rhs);
			for (let key in lhs.value.b)
			{
				if (! lhs.value.b.hasOwnProperty(key)) continue;
				if (! rhs.value.b.hasOwnProperty(key)) return false;
			}
			for (let key in rhs.value.b)
			{
				if (! rhs.value.b.hasOwnProperty(key)) continue;
				if (! lhs.value.b.hasOwnProperty(key)) return false;
				if (! rec.call(this, lhs.value.b[key], rhs.value.b[key], known)) return false;
			}
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_function) && module.isDerivedFrom(rhs.type, module.typeid_function))
		{
			// compare functions by function pointer
			if (lhs.value.b.func != rhs.value.b.func) return false;
			// now both sides are the same, either function or method or closure

			// check for methods
			if (lhs.value.b.hasOwnProperty("object"))
			{
				if (lhs.value.b.object != rhs.value.b.object) return false;
			}

			// check for closures
			if (lhs.value.b.hasOwnProperty("enclosed"))
			{
				// compare closure dictionaries by values (keys do automatically agree)
				if (k.has(lhs)) throw "recursive data structure";
				if (k.has(rhs)) throw "recursive data structure";
				let known = new Set(k)
				known.add(lhs);
				known.add(rhs);
				for (let key in rhs.value.b.enclosed)
				{
					if (! rhs.value.b.enclosed.hasOwnProperty(key)) continue;
					if (! rec.call(this, lhs.value.b.enclosed[key], rhs.value.b.enclosed[key], known)) return false;
				}
			}

			// the functions agree
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_range) && module.isDerivedFrom(rhs.type, module.typeid_range))
		{
			// compare range by begin and end
			return (lhs.value.b.begin == rhs.value.b.begin && lhs.value.b.end == rhs.value.b.end);
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_type) && module.isDerivedFrom(rhs.type, module.typeid_type))
		{
			// compare types by ID
			return (lhs.value.b.id == rhs.value.b.id);
		}
		else
		{
			// compare all the rest by object identity
			return (lhs === rhs);
		}
	}

	try
	{
		return rec.call(this, lhs, rhs, new Set());
	}
	catch (ex)
	{
		if (ex == "recursive data structure") this.error("/argument-mismatch/am-43");
		else throw ex;
	}
}

// compare typed values for order, return -1, 0, or +1,
// or report an error if the types cannot be ordered
module.order = function(lhs, rhs)
{
	function rec(lhs, rhs, k)
	{
		if (lhs === rhs) return 0;
		else if (module.isDerivedFrom(lhs.type, module.typeid_null) && module.isDerivedFrom(rhs.type, module.typeid_null))
		{
			// null values are always equal
			return 0;
		}
		else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
		{
			// compare numbers
			return (lhs.value.b <= rhs.value.b) ? ((lhs.value.b < rhs.value.b) ? -1 : 0) : 1;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_string) && module.isDerivedFrom(rhs.type, module.typeid_string))
		{
			// compare strings lexicographically
			return (lhs.value.b <= rhs.value.b) ? ((lhs.value.b < rhs.value.b) ? -1 : 0) : 1;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_array) && module.isDerivedFrom(rhs.type, module.typeid_array))
		{
			// compare arrays lexicographically by items
			if (k.has(lhs)) throw "recursive data structure";
			if (k.has(rhs)) throw "recursive data structure";
			let known = new Set(k)
			known.add(lhs);
			known.add(rhs);
			let m = Math.min(lhs.value.b.length, rhs.value.b.length);
			for (let i=0; i<m; i++)
			{
				let tmp = rec.call(this, lhs.value.b[i], rhs.value.b[i], known);
				if (tmp != 0) return tmp;
			}
			if (lhs.value.b.length > m) return 1;
			else if (rhs.value.b.length > m) return -1;
			else return 0;
		}

		// report an error
		if (lhs.type.id == rhs.type.id) this.error("/argument-mismatch/am-16", [module.displayname(lhs.type)]);
		else this.error("/argument-mismatch/am-16b", [module.displayname(lhs.type), module.displayname(rhs.type)]);
	}

	try
	{
		return rec.call(this, lhs, rhs, new Set());
	}
	catch (ex)
	{
		if (ex == "recursive data structure") this.error("/argument-mismatch/am-43");
		else throw ex;
	}
}

// Convert typed value to string, as a "preview" for display.
// The preview does not attempt to represent the value completely,
// however, it makes an effort to make its type recognizable.
module.previewValue = function (arg, depth)
{
	if (depth === undefined) depth = 1;
	if (! arg.hasOwnProperty("type") || ! arg.hasOwnProperty("value")) throw "[module.previewValue] invalid argument";

	if (arg.type.id == module.typeid_null) return "null";
	else if (arg.type.id == module.typeid_boolean) return arg.value.b ? "true" : "false";
	else if (arg.type.id == module.typeid_integer) return arg.value.b.toString();
	else if (arg.type.id == module.typeid_real)
	{
		let ret = arg.value.b.toString();
		if (ret.indexOf('.') < 0 && ret.indexOf('e') < 0 && ret.indexOf('E') < 0) ret += ".0";
		return ret;
	}
	else if (arg.type.id == module.typeid_string) return '\"' + arg.value.b + '\"';
	else if (arg.type.id == module.typeid_array)
	{
		if (depth == 0) return "[\u2026]";
		let s = "[";
		let n = Math.min(arg.value.b.length, 3);
		for (let i=0; i<n; i++)
		{
			if (i += 0) s += ",";
			s += module.previewValue.call(this, arg.value.b[i], 0);
		}
		if (arg.value.b.length > n) s += ",\u2026";
		s += "]";
		return s;
	}
	else if (arg.type.id == module.typeid_dictionary)
	{
		if (depth == 0) return "{\u2026}";
		let s = "{";
		let n = 0;
		for (let key in arg.value.b)
		{
			if (! arg.value.b.hasOwnProperty(key)) continue;
			if (n == 3)
			{
				s += ",\u2026";
				break;
			}
			if (n > 0) s += ",";
			s += key.substring(1) + ":" + module.previewValue.call(this, arg.value.b[key], 0);
			n++;
		}
		s += "}";
		return s;
	}
	else if (arg.type.id == module.typeid_function)
	{
		let s = "<Function ";
		if (arg.value.b.hasOwnProperty("object"))
		{
			module.assert(arg.value.b.func.parent.petype == "type", "[previewValue] invalid method object");
			s += module.displayname(arg.value.b.func.parent) + ".";
		}
		if (arg.value.b.func.displayname) s += arg.value.b.func.displayname;
		else if (arg.value.b.func.name) s += arg.value.b.func.name;
		else
		{
			s += "anonymous";
			if (arg.value.b.func.where) s += " " + arg.value.b.func.where.line + ":" + arg.value.b.func.where.ch;
		}
		s += ">";
		return s;
	}
	else if (arg.type.id == module.typeid_range) return arg.value.b.begin.toString() + ":" + arg.value.b.end.toString();
	else if (arg.type.id == module.typeid_type) return "<Type " + module.displayname(arg.value.b) + ">";
	else
	{
		let s = "<" + module.displayname(arg.type);
		if (depth == 0) return s + ">";
		let n = 0;
		let c = arg.type;
		while (c && c.variables)
		{
			for (let i=0; i<c.variables.length; i++)
			{
				if (n == 3)
				{
					s += " \u2026";
					break;
				}
				s += " " + module.displayname(c.variables[i]) + "=" + module.previewValue(arg.value.a[c.variables[i].id], 0);
				n++;
			}
			c = c.superclass;
		}
		s += ">";
		return s;
	}
}


///////////////////////////////////////////////////////////
// error messages
//
// Nested dictionary of all error messages. An error is
// identified by an ID, which is an absolute path into the
// data structure.
//

let errors = {
	"syntax": {
		"se-1": "syntax error in floating point literal",
		"se-2": "syntax error in string literal; closing double quotes '\"' expected before end-of-line",
		"se-3": "syntax error in string literal; invalid Unicode escape sequence",
		"se-4": "syntax error in string literal; invalid escape sequence '\\$$'",
		"se-5": "syntax error; invalid character '$$'",
		"se-6": "syntax error; 'super' cannot be used outside of a class declaration",
		"se-7": "syntax error; 'super' cannot be used in a class without super class",
		"se-8": "syntax error in super reference; dot '.' expected after 'super'",
		"se-9": "syntax error in super reference; identifier expected after dot '.'",
		"se-10": "syntax error in $$; name (identifier or super name) expected",
		"se-11": "syntax error in namespace reference; identifier expected after dot '.'",
		"se-13": "error in $$; $$ '$$' requires a 'this' object and hence cannot be accessed from a static context",
		"se-14": "syntax error in argument list; positional argument follows named argument",
		"se-15": "syntax error in argument list; expected comma ',' or closing parenthesis ')'",
		"se-16": "error in function call; attempt to call a value of type '$$'; 'function' or 'type' expected",
		"se-21": "operators are not allowed on the left-hand side of an assignment",
		"se-22": "syntax error in expression; missing closing parenthesis ')'",
		"se-23": "syntax error in integer literal: maximal value of 2147483647 exceeded",
		"se-24": "syntax error in array; comma ',' or closing bracket ']' expected",
		"se-25": "syntax error in array; unexpected end-of-file",
		"se-26": "syntax error in dictionary; duplicate key '$$'",
		"se-27": "syntax error in dictionary; comma ',' or closing brace '}' expected",
		"se-28": "syntax error in dictionary key; string constant or identifier expected",
		"se-29": "syntax error in dictionary; colon ':' expected",
		"se-30": "syntax error in dictionary; unexpected end-of-file",
		"se-31": "syntax error in closure parameter declaration; comma ',' or closing bracket ']' expected",
		"se-32": "syntax error in closure parameter declaration; identifier expected as the parameter name",
		"se-33": "syntax error in parameter declaration; identifier expected as the parameter name",
		"se-35": "syntax error in anonymous function; opening bracket '[' or opening parenthesis '(' expected",
		"se-36": "syntax error in $$; opening parenthesis '(' expected",
		"se-37": "syntax error in parameter declaration; comma ',' or closing parenthesis ')' expected",
		"se-38": "error in parameter declaration; default value must be a constant",
		"se-40": "syntax error in $$; opening brace '{' expected",
		"se-41": "syntax error in expression; unexpected keyword '$$', expression expected",
		"se-42": "syntax error in expression; unexpected token '$$', expression expected",
		"se-43": "syntax error in member access: identifier expected right of the dot '.'",
		"se-44": "syntax error in item access: closing bracket ']' expected",
		"se-47": "syntax error; 'this' cannot be used in this context",
		"se-48": "syntax error in assignment; semicolon ';' expected",
		"se-49": "syntax error in expression; operator or semicolon ';' expected",
		"se-50": "syntax error in variable declaration; identifier expected as the variable name",
		"se-51": "syntax error in variable declaration; expected initializer '=', comma ',' or semicolon ';'",
		"se-51b": "syntax error in variable declaration; expected comma ',' or semicolon ';'",
		"se-52": "syntax error in function declaration; identifier expected as the function name",
		"se-53": "syntax error in constructor declaration; 'super' expected after colon ':'",
		"se-54": "syntax error in class declaration; identifier expected as the class name",
		"se-55": "syntax error in access modifier: colon ':' expected after '$$'",
		"se-56": "syntax error in class declaration; member declaration without access modifier",
		"se-57": "syntax error in class declaration; attribute initializer must be a constant",
		"se-58": "error in class declaration; the super class has a private constructor, therefore it cannot be sub-classed",
		"se-59": "error in class declaration; constructor cannot be static",
		"se-59b": "error in class declaration; the constructor was already declared",
		"se-60": "error in class declaration; class declaration cannot be static",
		"se-61": "error in class declaration; use directive cannot be static",
		"se-62": "syntax error in class declaration; member declaration, use directive, or access modifier expected",
		"se-63": "syntax error in namespace declaration; a namespace may be declared only at global scope or within another namespace",
		"se-64": "syntax error in namespace declaration; identifier expected as the namespace name",
		"se-65": "syntax error in use directive: keyword 'use' expected",
		"se-66": "syntax error in use directive; 'namespace' and 'as' cannot be combined",
		"se-67": "syntax error in use directive; identifier expected after 'as'",
		"se-68": "syntax error in use directive; comma ',' or semicolon ';' expected",
		"se-69": "syntax error in conditional statement: 'then' expected",
		"se-70": "syntax error in for-loop: identifier expected as the loop variable",
		"se-71": "syntax error in for-loop: 'in' expected",
		"se-72": "syntax error in for-loop: keyword 'do' expected",
		"se-73": "syntax error in for-loop; 'in' or 'do' expected",
		"se-74": "syntax error in do-while-loop: 'while' expected",
		"se-75": "syntax error in do-while-loop: semicolon ';' expected",
		"se-76": "syntax error in while-do-loop: 'do' expected",
		"se-77": "syntax error; 'break' statement must not appear outside a loop body",
		"se-78": "syntax error; 'continue' statement must not appear outside a loop body",
		"se-79": "syntax error in return; a constructor does not return a value",
		"se-80": "syntax error in return; the program does not return a value",
		"se-81": "syntax error in return; semicolon ';' expected",
		"se-81b": "syntax error in break; semicolon ';' expected",
		"se-81c": "syntax error in continue; semicolon ';' expected",
		"se-82": "syntax error in try-catch statement: 'catch' expected",
		"se-84": "syntax error in try-catch statement: 'var' expected after 'catch'",
		"se-85": "syntax error in try-catch statement: identifier expected after 'var'",
		"se-86": "syntax error in try-catch statement: 'do' expected after exception",
		"se-87": "syntax error in throw; semicolon ';' expected",
		"se-88": "syntax error; unexpected closing brace '}'",
		"se-89": "syntax error; unexpected keyword '$$', statement expected",
		"se-90": "syntax error; unexpected token '$$', statement expected",
	},
	"argument-mismatch": {
		"am-1": "argument type mismatch; parameter '$$' of '$$' must be a $$; found '$$'",
		"am-2": "cannot logically negate type '$$'",
		"am-3": "cannot apply unary plus to type '$$'",
		"am-4": "cannot arithmetically negate type '$$'",
		"am-5": "cannot add '$$' and '$$'",
		"am-6": "cannot subtract '$$' from '$$'",
		"am-7": "cannot multiply '$$' with '$$'",
		"am-8": "cannot divide '$$' by '$$'",
		"am-9": "cannot compute the remainder '$$' by '$$'",
		"am-10": "cannot compute power of '$$' by '$$'",
		"am-11": "arguments of operator : must be integers",
		"am-12": "cannot apply logic operator '$$' to '$$' and '$$'",
		"am-13": "cannot convert infinity or not-a-number to integer",
		"am-14": "failed to parse string into an integer",
		"am-15": "division by zero",
		"am-16": "cannot order type '$$'",
		"am-16b": "cannot order types '$$' and '$$'",
		"am-17": "cannot construct an array of negative size",
		"am-18": "parameter 'position' of 'Array.insert' is out of range; position is $$, array size is $$",
		"am-18b": "'Array.pop' cannot be applied to an empty array",
		"am-19": "the 'comparator' function passed to 'Array.sort' must return a numeric value, found '$$'",
		"am-20": "invalid string index '$$' of type '$$', 'Integer' or 'Range' expected",
		"am-21": "string index '$$' out of range; index must not be negative",
		"am-22": "string index '$$' out of range; must be less than the string size of $$",
		"am-23": "array index '$$' out of range; index must not be negative",
		"am-24": "array index '$$' out of range; must be and less than array size of $$",
		"am-25": "invalid array index '$$' of type '$$', 'integer' expected",
		"am-26": "invalid array index '$$' of type '$$', 'integer' or 'range' expected",
		"am-27": "dictionary index '$$' is not a key of the dictionary",
		"am-28": "invalid dictionary index of type '$$', 'string' expected",
		"am-29": "range index '$$' out of range; must be non-negative and less than the range size of $$",
		"am-30": "invalid range index '$$' of type '$$', 'Integer' or 'Range' expected",
		"am-31": "attempt to access an item of type '$$'; string, array, dictionary, or range expected",
		"am-31b": "attempt to access an item of type '$$'; string, array, or dictionary expected",
		"am-32": "cannot assign to $$",
		"am-33": "condition in conditional statement is not boolean but rather of type '$$'",
		"am-34": "attempt to loop over the non-iterable type '$$', 'Range' or 'Array' expected",
		"am-35": "error in for-loop; '$$' does not refer to a variable, but to a $$",
		"am-36": "condition in do-while-loop is not boolean but rather of type '$$'",
		"am-37": "condition in while-do-loop is not boolean but rather of type '$$'",
		"am-38": "loading the value failed, key '$$' does not exist",
		"am-39": "saving the value failed, JSON expected",
		"am-40": "invalid event name '$$'",
		"am-41": "argument handler passed to setEventHandler must be a function with exactly one parameter",
		"am-42": "deepcopy failed due to $$",
		"am-43": "infinite recursion due to recursive data structure",
	},
	"name": {
		"ne-1": "error in function call; named parameter '$$' is already specified in call to function '$$'",
		"ne-2": "error in function call; named parameter '$$' not found in function '$$'",
		"ne-3": "error in function call; too many arguments for call to function '$$'",
		"ne-4": "error in function call; parameter number $$ is missing when calling function '$$'",
		"ne-5": "error in $$; '$$' is not defined",
		"ne-6": "error in $$; cannot access variable '$$', which is declared in a different class",
		"ne-7": "error in $$; cannot access variable '$$', which is declared in a different function",
		"ne-8": "error in $$; '$$' cannot be accessed because it is a private member of type '$$'",
		"ne-9": "error in namespace lookup; name '$$' not found in namespace '$$'",
		"ne-11": "a name referring to a namespace is not allowed in this context",
		"ne-12": "type '$$' does not have a public static member '$$'",
		"ne-13": "type '$$' does not have a public member '$$'",
		"ne-14": "declaration of variable '$$' conflicts with previous declaration; double use of the same name",
		"ne-15": "declaration of function '$$' conflicts with previous declaration; double use of the same name",
		"ne-16": "declaration of parameter '$$' conflicts with previous declaration; double use of the same name",
		"ne-17": "declaration of closure parameter '$$' conflicts with previous declaration; double use of the same name",
		"ne-18": "declaration of class '$$' conflicts with previous declaration; double use of the same name",
		"ne-19": "declaration of namespace '$$' conflicts with previous declaration; double use of the same name",
		"ne-21": "error in constructor declaration; super constructor call without a super class",
		"ne-22": "error in super class declaration; '$$' does not refer to a type",
		"ne-23": "error in use directive; '$$' is not a namespace",
		"ne-24": "use of identifier '$$' conflicts with previous declaration; double use of the same name",
		"ne-25": "error in constructor call; the constructor of type '$$' is declared $$",
		"ne-26": "error in super class declaration; class '$$' inherits itself",
	},
	"logic": {
		"le-1": "too much recursion",
		"le-2": "enterEventMode failed; the program is already in event mode",
		"le-3": "quitEventMode failed; the program is not in event mode",
	},
	"user": {
		"ue-1": "assertion failed; $$",
		"ue-2": "runtime error; $$",
		"ue-3": "uncaught exception; $$",
	},
	"style": {
		"ste-1": "coding style violation; invalid line indentation",
		"ste-2": "coding style violation; inconsistent block indentation",
		"ste-3": "coding style violation; the $$ name '$$' should start with a lowercase letter or with an underscore",
		"ste-4": "coding style violation; the class name '$$' should start with a capital letter",
	},
	"internal": {
		"ie-1": "internal parser error; $$",
		"ie-2": "internal interpreter error; $$",
	}
};

// given an error ID (path), return the error message template
module.errorTemplate = function(path)
{
	let tokens = path.split("/");
	module.assert(tokens[0] == "", "[getError] invalid path: " + path);
	let ret = errors;
	for (let i=1; i<tokens.length; i++)
	{
		module.assert(ret.hasOwnProperty(tokens[i]), "[getError] invalid path: " + path);
		ret = ret[tokens[i]];
	}
	return ret;
}

// given an error ID (path) and a list of arguments, compose the error message
module.composeError = function(path, args)
{
	let err = module.errorTemplate(path);
	let tokens = err.split("$$");
	module.assert(tokens.length == args.length + 1);
	let ret = tokens[0];
	for (let i=0; i<args.length; i++) ret += args[i] + tokens[i+1];
	return ret;
}


///////////////////////////////////////////////////////////
// built-in declarations
//
// Definition of the TScript core and a number of useful
// libraries.
//

// the core language
let core = {
	"source":
		`
			class Null
			{
			public:
				constructor() { }
			}

			class Boolean
			{
			public:
				constructor(value) { }
			}

			class Integer
			{
			public:
				constructor(value) { }
			}

			class Real
			{
			public:
				constructor(value) { }
				function isFinite() { }
				function isInfinite() { }
				function isNan() { }
				static function inf() { }
				static function nan() { }
			}

			class String
			{
			public:
				constructor(value) { }
				function size() { }
				function find(searchterm, start = 0, backward = false) { }
				function split(separator) { }
				static function fromUnicode(characters) { }
			}

			class Array
			{
			public:
				constructor(size_or_other, value = null) { }
				function size() { }
				function push(item) { }
				function pop() { }
				function insert(position, item) { }
				function remove(range) { }
				function sort(comparator = null) { }
				function keys() { }
				function values() { }
				static function concat(first, second) { }
			}

			class Dictionary
			{
			public:
				constructor(other) { }
				function size() { }
				function has(key) { }
				function remove(key) { }
				function keys() { }
				function values() { }
				static function merge(first, second) { }
			}

			class Function
			{
			public:
				constructor(value) { }
			}

			class Range
			{
			public:
				constructor(begin, end) { }
				function size() { }
				function begin() { }
				function end() { }
			}

			class Type
			{
			public:
				constructor(value) { }
				static function superclass(type) { }
				static function isOfType(value, type) { }
				static function isDerivedFrom(subclass, superclass) { }
			}

			function terminate() { }
			function assert(condition, message = "") { }
			function error(message) { }
			function same(first, second) { }
			function version() { }
			function print(text) { }
			function alert(text) { }
			function confirm(text) { }
			function prompt(text) { }
			function wait(milliseconds) { }
			function time() { }
			function localtime() { }
			function setEventHandler(event, handler) { }
			function enterEventMode() { }
			function quitEventMode(result = null) { }
			function exists(key) { }
			function load(key) { }
			function save(key, value) { }
			function deepcopy(value) { }
		`,
	"impl": {
			"Null": {
					"constructor": function(object) {
						object.value.b = null;
					},
			},
			"Boolean": {
					"constructor": function(object, value) {
						if (! module.isDerivedFrom(value.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["value", "Boolean.constructor", "boolean", module.displayname(value.type)]);
						object.value.b = value.value.b;
					},
			},
			"Integer": {
					"constructor": function(object, arg) {
						if (module.isDerivedFrom(arg.type, module.typeid_boolean)) object.value.b = arg.value.b ? 1 : 0;
						else if (module.isDerivedFrom(arg.type, module.typeid_integer)) object.value.b = arg.value.b;
						else if (module.isDerivedFrom(arg.type, module.typeid_real))
						{
							if (! Number.isFinite(arg.value.b)) this.error("/argument-mismatch/am-13");
							object.value.b = (Math.floor(arg.value.b) | 0);
						}
						else if (module.isDerivedFrom(arg.type, module.typeid_string))
						{
							let s = arg.value.b.trim();
							let v = 1;
							if (s.length == 0) this.error("/argument-mismatch/am-14");
							if (s[0] == '-') { v = -1; s = s.substr(1); }
							else if (s[0] == '+') { s = s.substr(1); }
							if (s.length == 0 || "0123456789.".indexOf(s[0]) < 0) this.error("/argument-mismatch/am-14");
							v *= Number(s);
							if (! Number.isFinite(v)) this.error("/argument-mismatch/am-13");
							object.value.b = Math.floor(v) | 0;
						}
						else this.error("/argument-mismatch/am-1", ["value", "Integer.constructor", "boolean, integer, real, or string", module.displayname(arg.type)]);
					},
			},
			"Real": {
					"constructor": function(object, arg) {
						if (module.isDerivedFrom(arg.type, module.typeid_boolean)) object.value.b = arg.value.b ? 1 : 0;
						else if (module.isDerivedFrom(arg.type, module.typeid_integer) || module.isDerivedFrom(arg.type, module.typeid_real)) object.value.b = arg.value.b;
						else if (module.isDerivedFrom(arg.type, module.typeid_string)) object.value.b = Number(arg.value.b);
						else object.value.b = NaN;
					},
					"isFinite": function(object) {
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": Number.isFinite(object.value.b)}};
					},
					"isInfinite": function(object) {
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": object.value.b == Number.POSITIVE_INFINITY || object.value.b == Number.NEGATIVE_INFINITY}};
					},
					"isNan": function(object) {
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": Number.isNaN(object.value.b)}};
					},
					"inf": function(first, second) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": Infinity}};
					},
					"nan": function(first, second) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": NaN}};
					},
			},
			"String": {
					"constructor": function(object, value) {
						object.value.b = module.toString.call(this, value);
					},
					"size": function(object) {
						return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.length}};
					},
					"find": function(object, searchterm, start, backward) {
						if (! module.isDerivedFrom(searchterm.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["searchterm", "String.find", "string", module.displayname(searchterm.type)]);
						if (! module.isDerivedFrom(start.type, module.typeid_integer)) this.error("/argument-mismatch/am-1", ["start", "String.find", "integer", module.displayname(start.type)]);
						if (! module.isDerivedFrom(backward.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["backward", "String.find", "boolean", module.displayname(backward.type)]);
						let pos;
						if (backward.value.b) pos = object.value.b.lastIndexOf(searchterm.value.b, start.value.b);
						else pos = object.value.b.indexOf(searchterm.value.b, start.value.b);
						if (pos == -1) return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
						else return {"type": this.program.types[module.typeid_integer], "value": {"b": pos}};
					},
					"split": function(object, separator) {
						if (! module.isDerivedFrom(separator.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["separator", "String.split", "string", module.displayname(separator.type)]);
						let a = object.value.b.split(separator.value.b);
						let arr = [];
						for (let i=0; i<a.length; i++) arr.push({"type": this.program.types[module.typeid_string], "value": {"b": a[i]}});
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
					"fromUnicode": function(characters) {
						let s = "";
						if (module.isDerivedFrom(characters.type, module.typeid_integer))
						{
							s += String.fromCharCode(characters.value.b);
						}
						else if (module.isDerivedFrom(characters.type, module.typeid_array))
						{
							for (let i=0; i<characters.value.b.length; i++)
							{
								let sub = characters.value.b[i];
								if (! module.isDerivedFrom(sub.type, module.typeid_integer)) this.error("/argument-mismatch/am-1", ["characters", "String.fromUnicode", "integer or an array of integers", "array containing '" + module.displayname(sub.type) + "'"]);
								s += String.fromCharCode(sub.value.b);
							}
						}
						else this.error("/argument-mismatch/am-1", ["characters", "String.fromUnicode", "integer or an array of integers", module.displayname(characters.type)]);
						return {"type": this.program.types[module.typeid_string], "value": {"b": s}};
					},
			},
			"Array": {
					"constructor": function(object, size_or_other, value) {
						if (module.isDerivedFrom(size_or_other.type, module.typeid_integer))
						{
							if (size_or_other.value.b < 0) this.error("/argument-mismatch/am-17");
							let ret = [];
							for (let i=0; i<size_or_other.value.b; i++) ret.push(value);
							object.value.b = ret;
						}
						else if (module.isDerivedFrom(size_or_other.type, module.typeid_array))
						{
							object.value.b = size_or_other.value.b.slice();
						}
						else if (module.isDerivedFrom(size_or_other.type, module.typeid_range))
						{
							object.value.b = [];
							for (let i=size_or_other.value.b.begin; i<size_or_other.value.b.end; i++)
							{
								object.value.b.push({"type": this.program.types[module.typeid_integer], "value": {"b": i}});
							}
						}
						else this.error("/argument-mismatch/am-1", ["size_or_other", "Array.constructor", "integer, an array, or a range", module.displayname(size_or_other.type)]);
					},
					"size": function(object) {
						return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.length}};
					},
					"push": function(object, item) {
						object.value.b.push(item);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"pop": function(object) {
						if (object.value.b.length == 0) this.error("/argument-mismatch/am-18b");
						return object.value.b.pop();
					},
					"insert": function(object, position, item) {
						if (! module.isDerivedFrom(position.type, module.typeid_integer)) this.error("/argument-mismatch/am-1", ["position", "Array.insert", "integer", module.displayname(position.type)]);
						let index = position.value.b;
						if (index < 0 || index > object.value.b.length) this.error("/argument-mismatch/am-18", [index, object.value.b.length]);
						object.value.b.splice(position.value.b, 0, item);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"remove": function(object, range) {
						let a, b;
						if (module.isDerivedFrom(range.type, module.typeid_range))
						{
							a = range.value.b.begin;
							b = range.value.b.end;
						}
						else if (module.isDerivedFrom(range.type, module.typeid_integer))
						{
							a = range.value.b;
							b = range.value.b + 1;
						}
						else this.error("/argument-mismatch/am-1", ["range", "Array.remove", "range or an integer", module.displayname(range.type)]);
						if (a < 0) a = 0;
						if (b > object.value.b.length) b = object.value.b.length;
						object.value.b.splice(a, b - a);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"sort": {
						"step": function() {
							// iterative merge sort
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								if (frame.object.value.b.length <= 1)
								{
									// trivial case
									this.stack.pop();
									this.stack[this.stack.length - 1].temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
									return false;
								}
								if (module.isDerivedFrom(frame.variables[0].type, module.typeid_null))
								{
									// one-step solution
									let interpreter = this;
									frame.object.value.b.sort(function(lhs, rhs)
											{
												return module.order.call(interpreter, lhs, rhs);
											});

									// return null
									this.stack.pop();
									this.stack[this.stack.length - 1].temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
									return false;
								}
								else if (module.isDerivedFrom(frame.variables[0].type, module.typeid_function) && frame.variables[0].value.b.func.params.length == 2)
								{
									// prepare the merge sort state data structure
									let state = {
											"src": frame.object.value.b,   // source array
											"dst": [],                     // destination array
											"chunksize": 1,                // size of chunks to merge
											"lb": 0, "le": 1,              // "left" chunk [lb, le[
											"rb": 1, "re": 2,              // "right" chunk [rb, re[
										};
									frame.temporaries.push(state);
									return false;
								}
								else this.error("/argument-mismatch/am-1", ["comparator", "Array.sort", "function of two arguments", module.displayname(frame.variables[0].type)]);
							}
							else if (ip == 1)
							{
								// push the next comparison onto the stack
								let state = frame.temporaries[frame.temporaries.length - 1];
								let comp = frame.variables[0].value.b;
								let params = [state.src[state.lb], state.src[state.rb]];
								if (comp.hasOwnProperty("enclosed")) params = comp.enclosed.concat(params);
								let newframe = {
										"pe": [comp.func],
										"ip": [-1],
										"temporaries": [],
										"variables": params,
									};
								if (comp.hasOwnProperty("object")) newframe.object = comp.object;
								if (comp.hasOwnProperty("enclosed")) newframe.enclosed = comp.enclosed;
								this.stack.push(newframe);
								if (this.stack.length >= module.maxstacksize) this.error("/logic/le-1");
								return false;
							}
							else if (ip == 2)
							{
								// evaluate the comparison
								let result = frame.temporaries.pop();
								if (! module.isNumeric(result.type)) this.error("/argument-mismatch/am-19", [module.displayname(result.type)]);

								let state = frame.temporaries[frame.temporaries.length - 1];

								// perform a merge step
								if (result.value.b <= 0)
								{
									state.dst.push(state.src[state.lb]);
									state.lb++;
									if (state.lb == state.le)
									{
										while (state.rb < state.re)
										{
											state.dst.push(state.src[state.rb]);
											state.rb++;
										}
									}
								}
								else
								{
									state.dst.push(state.src[state.rb]);
									state.rb++;
									if (state.rb == state.re)
									{
										while (state.lb < state.le)
										{
											state.dst.push(state.src[state.lb]);
											state.lb++;
										}
									}
								}

								if (state.lb == state.le)
								{
									// merging the current chunks is complete
									if (state.src.length - state.re <= state.chunksize)
									{
										// copy the last chunk
										while (state.re < state.src.length)
										{
											state.dst.push(state.src[state.re]);
											state.re++;
										}

										// move on to larger chunks
										state.chunksize *= 2;
										state.lb = 0;
										state.le = state.chunksize;
										state.rb = state.chunksize;
										state.re = Math.min(2 * state.chunksize, state.src.length);
										state.src = state.dst;
										state.dst = [];

										// check whether we are done
										if (state.chunksize >= state.src.length) return false;
									}
									else
									{
										// prepare the next chunk
										state.lb = state.dst.length;
										state.le = state.lb + state.chunksize;
										state.rb = state.le;
										state.re = Math.min(state.rb + state.chunksize, state.src.length);
									}
								}

								// move back to step 1
								frame.ip[frame.ip.length - 1] = 1 - 1;
								return false;
							}
							else
							{
								// clean up
								let state = frame.temporaries[frame.temporaries.length - 1];
								frame.object.value.b = state.src;
								frame.temporaries.pop();

								// return null
								module.assert(frame.temporaries.length == 0, "non-empty temporaries stack in return from Array.sort");
								this.stack.pop();
								this.stack[this.stack.length - 1].temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
								return false;
							}
						},
						"sim": simfalse,
					},
					"keys": function(object) {
						return {"type": this.program.types[module.typeid_range], "value": {"b": {"begin": 0, "end": object.value.b.length}}};
					},
					"values": function(object) {
						return object;
					},
					"concat": function(first, second) {
						if (! module.isDerivedFrom(first.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["first", "Array.concat", "array", module.displayname(first.type)]);
						if (! module.isDerivedFrom(second.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["second", "Array.concat", "array", module.displayname(second.type)]);
						let arr = [];
						for (let i=0; i<first.value.b.length; i++) arr.push(first.value.b[i]);
						for (let i=0; i<second.value.b.length; i++) arr.push(second.value.b[i]);
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
			},
			"Dictionary": {
					"constructor": function(object, other) {
						if (module.isDerivedFrom(other.type, module.typeid_null))
						{
							object.value.b = {};
						}
						else if (module.isDerivedFrom(other.type, module.typeid_dictionary))
						{
							object.value.b = Object.assign({}, other.value.b);
						}
						else this.error("/argument-mismatch/am-1", ["other", "Dictionary.constructor", "null or a dictionary", module.displayname(other.type)]);
					},
					"size": function(object) {
						return {"type": this.program.types[module.typeid_integer], "value": {"b": Object.keys(object.value.b).length}};
					},
					"has": function(object, key) {
						if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "Dictionary.has", "string", module.displayname(key.type)]);
						let ret = object.value.b.hasOwnProperty('#' + key.value.b);
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
					},
					"remove": function(object, key) {
						if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "Dictionary.remove", "string", module.displayname(key.type)]);
						delete object.value.b['#' + key.value.b];
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"keys": function(object) {
						let arr = [];
						for (let key in object.value.b)
						{
							if (! object.value.b.hasOwnProperty(key)) continue;
							arr.push({"type": this.program.types[module.typeid_string], "value": {"b": key.substring(1)}});
						}
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
					"values": function(object) {
						let arr = [];
						for (let key in object.value.b)
						{
							if (! object.value.b.hasOwnProperty(key)) continue;
							arr.push(object.value.b[key]);
						}
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
					"merge": function(first, second) {
						if (! module.isDerivedFrom(first.type, module.typeid_dictionary)) this.error("/argument-mismatch/am-1", ["first", "Dictionary.merge", "dictionary", module.displayname(first.type)]);
						if (! module.isDerivedFrom(second.type, module.typeid_dictionary)) this.error("/argument-mismatch/am-1", ["second", "Dictionary.merge", "dictionary", module.displayname(second.type)]);
						let dict = {};
						for (let key in first.value.b)
						{
							if (! first.value.b.hasOwnProperty(key)) continue;
							dict[key] = first.value.b[key];
						}
						for (let key in second.value.b)
						{
							if (! second.value.b.hasOwnProperty(key)) continue;
							dict[key] = second.value.b[key];
						}
						return {"type": this.program.types[module.typeid_dictionary], "value": {"b": dict}};
					},
			},
			"Function": {
				"constructor": function(object, value) {
					if (! module.isDerivedFrom(value.type, module.typeid_function)) this.error("/argument-mismatch/am-1", ["value", "Function.constructor", "function", module.displayname(value.type)]);
					object.value.b = value.value.b;
				},
			},
			"Range": {
				"constructor": function(object, begin, end) {
					if (module.isDerivedFrom(begin.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(begin.type, module.typeid_real) && module.isInt32(begin.value.b)) { }
					else this.error("/argument-mismatch/am-1", ["begin", "Range.constructor", "integer", module.displayname(begin.type)]);
					if (module.isDerivedFrom(end.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(end.type, module.typeid_real) && module.isInt32(end.value.b)) { }
					else this.error("/argument-mismatch/am-1", ["end", "Range.constructor", "integer", module.displayname(end.type)]);
					object.value.b = {"begin": begin.value.b, "end": end.value.b};
				},
				"size": function(object) {
					return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.max(0, object.value.b.end - object.value.b.begin)}};
				},
				"begin": function(object) {
					return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.begin}};
				},
				"end": function(object) {
					return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.end}};
				},
			},
			"Type": {
				"constructor": function(object, value) {
					object.value.b = value.type;
				},
				"superclass": function(type) {
					if (! module.isDerivedFrom(type.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["type", "Type.superclass", "type", module.displayname(type.type)]);
					if (type.value.b.hasOwnProperty("superclass")) return {"type": this.program.types[module.typeid_type], "value": {"b": type.value.b.superclass}};
					else return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
				},
				"isOfType": function(value, type) {
					if (! module.isDerivedFrom(type.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["type", "Type.isOfType", "type", module.displayname(type.type)]);
					let ret = false;
					let sub = value.type;
					let sup = type.value.b;
					while (true)
					{
						if (sub == sup) { ret = true; break; }
						if (sub.hasOwnProperty("superclass")) sub = sub.superclass;
						else break;
					}
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
				},
				"isDerivedFrom": function(subclass, superclass) {
					if (! module.isDerivedFrom(subclass.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["subclass", "Type.isDerivedFrom", "type", module.displayname(subclass.type)]);
					if (! module.isDerivedFrom(superclass.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["superclass", "Type.isDerivedFrom", "type", module.displayname(superclass.type)]);
					let ret = false;
					let sub = subclass.value.b;
					let sup = superclass.value.b;
					while (true)
					{
						if (sub == sup) { ret = true; break; }
						if (sub.hasOwnProperty("superclass")) sub = sub.superclass;
						else break;
					}
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
				},
			},

			"terminate": function() {
				this.status = "finished";
				if (this.service.statechanged) this.service.statechanged(true);
			},
			"assert": function(condition, message) {
				if (! module.isDerivedFrom(condition.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["condition", "assert", "boolean", module.displayname(condition.type)]);
				if (! module.isDerivedFrom(message.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["message", "assert", "string", module.displayname(message.type)]);
				if (! condition.value.b) this.error("/user/ue-1", [message.value.b]);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"error": function(message) {
				if (! module.isDerivedFrom(message.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["message", "error", "string", module.displayname(message.type)]);
				this.error("/user/ue-2", [message.value.b]);
			},
			"same": function(first, second) {
				return {"type": this.program.types[module.typeid_boolean], "value": {"b": (first === second)}};
			},
			"version": function() {
				let ret = {
							"#type":  {"type": this.program.types[module.typeid_string],  "value": {"b": module.version.type}},
							"#major": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.major}},
							"#minor": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.minor}},
							"#patch": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.patch}},
							"#day":   {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.day}},
							"#month": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.month}},
							"#year":  {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.year}},
							"#full":  {"type": this.program.types[module.typeid_string],  "value": {"b": module.version.full()}},
						};
				return {"type": this.program.types[module.typeid_dictionary], "value": {"b": ret}};
			},
			"print": function(text) {
				let s = module.toString.call(this, text);
				if (this.service.print) this.service.print(s);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"alert": function(text) {
				let s = module.toString.call(this, text);
				if (! this.service.documentation_mode && this.service.alert) this.service.alert(s);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"confirm": function(text) {
				let s = module.toString.call(this, text);
				let ret = false;
				if (! this.service.documentation_mode && this.service.confirm) ret = this.service.confirm(s);
				return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
			},
			"prompt": function(text) {
				let s = module.toString.call(this, text);
				let ret = null;
				if (! this.service.documentation_mode && this.service.prompt)
				{
					ret = this.service.prompt(s);
					if (ret === null) return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					else return {"type": this.program.types[module.typeid_string], "value": {"b": ret}};
				}
				else return {"type": this.program.types[module.typeid_string], "value": {"b": ""}};
			},
			"wait": function(milliseconds) {
				if (! module.isNumeric(milliseconds.type)) this.error("/argument-mismatch/am-1", ["milliseconds", "wait", "numeric argument", module.displayname(arg.type)]);
				if (! this.service.documentation_mode) this.wait(milliseconds.value.b);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"time": function() {
				return {"type": this.program.types[module.typeid_real], "value": {"b": (new Date()).getTime()}};
			},
			"localtime": function() {
				let d = new Date();
				return {"type": this.program.types[module.typeid_real], "value": {"b": d.getTime() - 60000.0 * d.getTimezoneOffset()}};
			},
			"exists": function(key) {
				if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "exists", "string", module.displayname(key.type)]);
				let ret = localStorage.getItem("tscript.data." + key.value.b) !== null;
				return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
			},
			"load": function(key) {
				if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "load", "string", module.displayname(key.type)]);
				let s = localStorage.getItem("tscript.data." + key.value.b);
				if (s === null) this.error("/argument-mismatch/am-38", [key.value.b]);
				let j = JSON.parse(s);
				return module.json2typed.call(this, j);
			},
			"save": function(key, value) {
				if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "save", "string", module.displayname(key.type)]);
				try
				{
					let j = module.typed2json.call(this, value);
					let s = JSON.stringify(j);
					localStorage.setItem("tscript.data." + key.value.b, s);
					return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
				}
				catch (ex)
				{
					this.error("/argument-mismatch/am-39");
				}
			},
			"deepcopy": function(value) {
				try
				{
					function copy(v, k)
					{
						if (v.type.id < module.typeid_array) return v;
						else if (v.type.id == module.typeid_array)
						{
							if (k.has(v)) throw "recursive data structure";
							let known = new Set(k)
							known.add(v);
							let b = [];
							for (let i=0; i<v.value.b.length; i++)
							{
								let c = copy.call(this, v.value.b[i], known);
								b.push(c);
							}
							return {"type": this.program.types[module.typeid_array], "value": {"b": b}};
						}
						else if (v.type.id == module.typeid_dictionary)
						{
							if (k.has(v)) throw "recursive data structure";
							let known = new Set(k)
							known.add(v);
							let b = {};
							for (let key in v.value.b)
							{
								if (! v.value.b.hasOwnProperty(key)) continue;
								let c = copy.call(this, v.value.b[key], known);
								b[key] = c;
							}
							return {"type": this.program.types[module.typeid_dictionary], "value": {"b": b}};
						}
						else if (v.type.id == module.typeid_function) throw "a function in the data structure";
						else if (v.type.id == module.typeid_range) return v;
						else if (v.type.id == module.typeid_type) return v;
						else throw "an object in the data structure";
					}

					return copy.call(this, value, new Set());
				}
				catch (ex)
				{
					this.error("/argument-mismatch/am-42", [ex]);
				}
			},
			"setEventHandler": function(event, handler) {
				if (! module.isDerivedFrom(event.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["event", "setEventHandler", "string", module.displayname(event.type)]);
				let name = event.value.b;
				if (! this.service.documentation_mode && ! this.eventnames.hasOwnProperty(name)) this.error("/argument-mismatch/am-40", [name]);
				if (handler.type.id != module.typeid_null && ! module.isDerivedFrom(handler.type, module.typeid_function)) this.error("/argument-mismatch/am-1", ["handler", "setEventHandler", "Null or Function", module.displayname(handler.type)]);
				if (handler.value.b && handler.value.b.func.params.length != 1) this.error("/argument-mismatch/am-41");
				this.setEventHandler(name, handler);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"enterEventMode": {
					"step": function()
					{
						if (this.service.documentation_mode)
						{
							this.status = "finished";
							return false;
						}

						if (this.eventmode) this.error("/logic/le-2");
						this.eventmode = true;
						this.stack[this.stack.length - 1].pe.push({
							// this cumbersome inner command is necessary since function.step is expected to always return false
							"step": function()
							{
								let frame = this.stack[this.stack.length - 1];
								if (! this.eventmode)
								{
									// return from event mode
									this.stack.pop();
									this.stack[this.stack.length - 1].temporaries.push(this.eventmodeReturnValue);
									return true;
								}

								// infinite loop
								frame.ip[frame.ip.length - 1]--;   // infinite loop
								frame.temporaries = [];            // discard return values (hack...)

								if (this.eventqueue.length == 0)
								{
									if (! this.service.documentation_mode) this.wait(10);
								}
								else
								{
									// handle the next event
									let t = this.eventqueue[0].type;
									let e = this.eventqueue[0].event;
									this.eventqueue.splice(0, 1);
									// this allows another timer event to be enqueued,
									// while the timer event is executed
									if (t == "timer") this.timerEventEnqueued = false;
									if (this.eventhandler.hasOwnProperty(t))
									{
										let handler = this.eventhandler[t];

										// argument list for the call
										let params = new Array(1);
										params[0] = e;

										// handle closure parameters
										if (handler.hasOwnProperty("enclosed")) params = handler.enclosed.concat(params);

										// create a new stack frame with the function arguments as local variables
										let frame = {
												"pe": [handler.func],
												"ip": [-1],
												"temporaries": [],
												"variables": params,
											};
										if (handler.hasOwnProperty("object")) frame.object = handler.object;
										if (handler.hasOwnProperty("enclosed")) frame.enclosed = handler.enclosed;
										this.stack.push(frame);
										if (this.stack.length >= module.maxstacksize) this.error("/logic/le-1");
									}
								}

								return true;
							},
							"sim": simtrue,
						});
						return false;
					},
					"sim": simfalse,
			},
			"quitEventMode": function(result) {
				if (! this.eventmode) this.error("/logic/le-3");
				this.eventmode = false;
				this.eventmodeReturnValue = result;
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
		},
	};

let lib_math = {
	"source":
		`
			namespace math
			{
				function pi() { }
				function e() { }
				function abs(x) { }
				function sqrt(x) { }
				function cbrt(x) { }
				function floor(x) { }
				function round(x) { }
				function ceil(x) { }
				function sin(x) { }
				function cos(x) { }
				function tan(x) { }
				function sinh(x) { }
				function cosh(x) { }
				function tanh(x) { }
				function asin(x) { }
				function acos(x) { }
				function atan(x) { }
				function atan2(y, x) { }
				function asinh(x) { }
				function acosh(x) { }
				function atanh(x) { }
				function exp(x) { }
				function log(x) { }
				function log2(x) { }
				function log10(x) { }
				function pow(base, exponent) { }
				function sign(x) { }
				function min(a, b) { }
				function max(a, b) { }
				function random() { }
			}
		`,
		"impl": {
			"math": {
					"pi": function(arg) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": 3.141592653589793}};
					},
					"e": function(arg) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": 2.718281828459045}};
					},
					"abs": function(arg) {
						if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.abs(arg.value.b) | 0 }};
						else if (module.isDerivedFrom(arg.type, module.typeid_real)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.abs(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.abs", "numeric argument", module.displayname(arg.type)]);
					},
					"sqrt": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.sqrt(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sqrt", "numeric argument", module.displayname(arg.type)]);
					},
					"cbrt": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.cbrt(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.cbrt", "numeric argument", module.displayname(arg.type)]);
					},
					"floor": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.floor(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.floor", "numeric argument", module.displayname(arg.type)]);
					},
					"round": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.round(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.round", "numeric argument", module.displayname(arg.type)]);
					},
					"ceil": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.ceil(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.ceil", "numeric argument", module.displayname(arg.type)]);
					},
					"sin": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.sin(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sin", "numeric argument", module.displayname(arg.type)]);
					},
					"cos": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.cos(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.cos", "numeric argument", module.displayname(arg.type)]);
					},
					"tan": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.tan(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.tan", "numeric argument", module.displayname(arg.type)]);
					},
					"sinh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.sinh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sinh", "numeric argument", module.displayname(arg.type)]);
					},
					"cosh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.cosh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.cosh", "numeric argument", module.displayname(arg.type)]);
					},
					"tanh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.tanh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.tanh", "numeric argument", module.displayname(arg.type)]);
					},
					"asin": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.asin(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.asin", "numeric argument", module.displayname(arg.type)]);
					},
					"acos": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.acos(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.acos", "numeric argument", module.displayname(arg.type)]);
					},
					"atan": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.atan(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.atan", "numeric argument", module.displayname(arg.type)]);
					},
					"atan2": function(y, x) {
						if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["x", "math.atan2", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "math.atan2", "numeric argument", module.displayname(y.type)]);
						return {"type": this.program.types[module.typeid_real], "value": {"b": Math.atan2(y.value.b, x.value.b) }};
					},
					"asinh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.asinh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.asinh", "numeric argument", module.displayname(arg.type)]);
					},
					"acosh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.acosh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.acosh", "numeric argument", module.displayname(arg.type)]);
					},
					"atanh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.atanh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.atanh", "numeric argument", module.displayname(arg.type)]);
					},
					"exp": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.exp(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.exp", "numeric argument", module.displayname(arg.type)]);
					},
					"log": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.log(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.log", "numeric argument", module.displayname(arg.type)]);
					},
					"log2": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.log2(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.log2", "numeric argument", module.displayname(arg.type)]);
					},
					"log10": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.log10(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.log10", "numeric argument", module.displayname(arg.type)]);
					},
					"pow": function(base, exponent) {
						if (! module.isNumeric(base.type)) this.error("/argument-mismatch/am-1", ["base", "math.pow", "numeric argument", module.displayname(base.type)]);
						if (! module.isNumeric(exponent.type))this.error("/argument-mismatch/am-1", ["exponent", "math.pow", "numeric argument", module.displayname(exponent.type)]);
						return {"type": this.program.types[module.typeid_real], "value": {"b": Math.pow(base.value.b, exponent.value.b) }};
					},
					"sign": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.isDerivedFrom(arg.type, module.typeid_integer) ? module.typeid_integer : module.typeid_real], "value": {"b": Math.sign(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sign", "numeric argument", module.displayname(arg.type)]);
					},
					"min": function(a, b) {
						if (module.order.call(this, a, b) <= 0) return a; else return b;
					},
					"max": function(a, b) {
						if (module.order.call(this, a, b) >= 0) return a; else return b;
					},
					"random": function() {
						return {"type": this.program.types[module.typeid_real], "value": {"b": Math.random() }};
					},
			},
		},
	};

let lib_turtle = {
	"source":
		`
			namespace turtle {
				function reset(x = 0, y = 0, degrees = 0, down = true) { }
				function move(distance) { }
				function turn(degrees) { }
				function color(red, green, blue) { }
				function pen(down) { }
			}
		`,
	"impl": {
			"turtle": {
					"reset": function(x, y, degrees, down) {
						if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "turtle.reset", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["y", "turtle.reset", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(degrees.type)) this.error("/argument-mismatch/am-1", ["degrees", "turtle.reset", "numeric argument", module.displayname(degrees.type)]);
						if (! module.isDerivedFrom(down.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["down", "turtle.reset", "boolean", module.displayname(down.type)]);
						if (this.service.turtle) this.service.turtle.reset.call(this, x.value.b, y.value.b, degrees.value.b, down.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"move": function(distance) {
						if (! module.isNumeric(distance.type)) this.error("/argument-mismatch/am-1", ["distance", "turtle.move", "numeric argument", module.displayname(distance.type)]);
						if (this.service.turtle) this.service.turtle.move.call(this, distance.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"turn": function(degrees) {
						if (! module.isNumeric(degrees.type)) this.error("/argument-mismatch/am-1", ["degrees", "turtle.turn", "numeric argument", module.displayname(degrees.type)]);
						if (this.service.turtle) this.service.turtle.turn.call(this, degrees.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"color": function(red, green, blue) {
						if (! module.isNumeric(  red.type)) this.error("/argument-mismatch/am-1", [  "red", "turtle.color", "numeric argument", module.displayname(  red.type)]);
						if (! module.isNumeric(green.type)) this.error("/argument-mismatch/am-1", ["green", "turtle.color", "numeric argument", module.displayname(green.type)]);
						if (! module.isNumeric( blue.type)) this.error("/argument-mismatch/am-1", [ "blue", "turtle.color", "numeric argument", module.displayname( blue.type)]);
						if (this.service.turtle) this.service.turtle.color.call(this, red.value.b, green.value.b, blue.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"pen": function(down) {
						if (! module.isDerivedFrom(down.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["down", "turtle.pen", "boolean", module.displayname(down.type)]);
						if (this.service.turtle) this.service.turtle.pen.call(this, down.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
			},
		},
	};
let lib_canvas = {
	"source":
		`
			namespace canvas {
				function width() { }
				function height() { }
				function setLineWidth(width) { }
				function setLineColor(red, green, blue, alpha = 1.0) { }
				function setFillColor(red, green, blue, alpha = 1.0) { }
				function setFont(fontface, fontsize) { }
				function setTextAlign(alignment) { }
				function clear() { }
				function line(x1, y1, x2, y2) { }
				function rect(left, top, width, height) { }
				function fillRect(left, top, width, height) { }
				function frameRect(left, top, width, height) { }
				function circle(x, y, radius) { }
				function fillCircle(x, y, radius) { }
				function frameCircle(x, y, radius) { }
				function curve(points, close = false) { }
				function fillArea(points) { }
				function frameArea(points) { }
				function text(x, y, str) { }
				function reset() { }
				function shift(dx, dy) { }
				function scale(factor) { }
				function rotate(angle) { }
				function transform(A, b) { }
				class ResizeEvent
				{
				public:
					var width;
					var height;
				}
				class MouseMoveEvent
				{
				public:
					var x;
					var y;
					var buttons;
					var shift;
					var control;
					var alt;
					var meta;
				}
				class MouseButtonEvent
				{
				public:
					var x;
					var y;
					var button;
					var buttons;
					var shift;
					var control;
					var alt;
					var meta;
				}
				class KeyboardEvent
				{
				public:
					var key;
					var shift;
					var control;
					var alt;
					var meta;
				}
			}
		`,
	"impl": {
			"canvas": {
					"width": function() {
						let ret = this.service.canvas.width.call(this);
						return {"type": this.program.types[module.typeid_integer], "value": {"b": ret}};
					},
					"height": function() {
						let ret = this.service.canvas.height.call(this);
						return {"type": this.program.types[module.typeid_integer], "value": {"b": ret}};
					},
					"setLineWidth": function(width) {
						if (! module.isNumeric(width.type)) this.error("/argument-mismatch/am-1", ["width", "canvas.setLineWidth", "numeric argument", module.displayname(width.type)]);
						if (width.value.b <= 0) this.error("/user/ue-2", ["error in canvas.setLineWidth; width must be positive"]);
						this.service.canvas.setLineWidth.call(this, width.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setLineColor": function(red, green, blue, alpha) {
						if (! module.isNumeric(red.type))   this.error("/argument-mismatch/am-1", ["red",   "canvas.setLineColor", "numeric argument", module.displayname(red.type)]);
						if (! module.isNumeric(green.type)) this.error("/argument-mismatch/am-1", ["green", "canvas.setLineColor", "numeric argument", module.displayname(green.type)]);
						if (! module.isNumeric(blue.type))  this.error("/argument-mismatch/am-1", ["blue",  "canvas.setLineColor", "numeric argument", module.displayname(blue.type)]);
						if (! module.isNumeric(alpha.type)) this.error("/argument-mismatch/am-1", ["alpha", "canvas.setLineColor", "numeric argument", module.displayname(alpha.type)]);
						this.service.canvas.setLineColor.call(this, red.value.b, green.value.b, blue.value.b, alpha.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setFillColor": function(red, green, blue, alpha) {
						if (! module.isNumeric(red.type))   this.error("/argument-mismatch/am-1", ["red",   "canvas.setFillColor", "numeric argument", module.displayname(red.type)]);
						if (! module.isNumeric(green.type)) this.error("/argument-mismatch/am-1", ["green", "canvas.setFillColor", "numeric argument", module.displayname(green.type)]);
						if (! module.isNumeric(blue.type))  this.error("/argument-mismatch/am-1", ["blue",  "canvas.setFillColor", "numeric argument", module.displayname(blue.type)]);
						if (! module.isNumeric(alpha.type)) this.error("/argument-mismatch/am-1", ["alpha", "canvas.setFillColor", "numeric argument", module.displayname(alpha.type)]);
						this.service.canvas.setFillColor.call(this, red.value.b, green.value.b, blue.value.b, alpha.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setFont": function(fontface, fontsize) {
						if (! module.isDerivedFrom(fontface.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["fontface", "canvas.setFont", "string", module.displayname(fontface.type)]);
						if (! module.isNumeric(fontsize.type)) this.error("/argument-mismatch/am-1", ["fontsize", "canvas.setFont", "numeric argument", module.displayname(fontsize.type)]);
						if (fontsize.value.b <= 0) this.error("/user/ue-2", ["error in canvas.setFont; fontsize must be positive"]);
						this.service.canvas.setFont.call(this, fontface.value.b, fontsize.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setTextAlign": function(alignment) {
						if (! module.isDerivedFrom(alignment.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["alignment", "canvas.setTextAlign", "string", module.displayname(alignment.type)]);
						let a = alignment.value.b;
						if (a != "left" && a != "center" && a != "right") this.error("/user/ue-2", ["error in canvas.setTextAlign; invalid alignment value"]);
						this.service.canvas.setTextAlign.call(this, alignment.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"clear": function() {
						this.service.canvas.clear.call(this);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"line": function(x1, y1, x2, y2) {
						if (! module.isNumeric(x1.type)) this.error("/argument-mismatch/am-1", ["x1", "canvas.line", "numeric argument", module.displayname(x1.type)]);
						if (! module.isNumeric(y1.type)) this.error("/argument-mismatch/am-1", ["y1", "canvas.line", "numeric argument", module.displayname(y1.type)]);
						if (! module.isNumeric(x2.type)) this.error("/argument-mismatch/am-1", ["x2", "canvas.line", "numeric argument", module.displayname(x2.type)]);
						if (! module.isNumeric(y2.type)) this.error("/argument-mismatch/am-1", ["y2", "canvas.line", "numeric argument", module.displayname(y2.type)]);
						this.service.canvas.line.call(this, x1.value.b, y1.value.b, x2.value.b, y2.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"rect": function(left, top, width, height) {
						if (! module.isNumeric(left.type))   this.error("/argument-mismatch/am-1", ["left",   "canvas.rect", "numeric argument", module.displayname(left.type)]);
						if (! module.isNumeric(top.type))    this.error("/argument-mismatch/am-1", ["top",    "canvas.rect", "numeric argument", module.displayname(top.type)]);
						if (! module.isNumeric(width.type))  this.error("/argument-mismatch/am-1", ["width",  "canvas.rect", "numeric argument", module.displayname(width.type)]);
						if (! module.isNumeric(height.type)) this.error("/argument-mismatch/am-1", ["height", "canvas.rect", "numeric argument", module.displayname(height.type)]);
						this.service.canvas.rect.call(this, left.value.b, top.value.b, width.value.b, height.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"fillRect": function(left, top, width, height) {
						if (! module.isNumeric(left.type))   this.error("/argument-mismatch/am-1", ["left",   "canvas.fillRect", "numeric argument", module.displayname(left.type)]);
						if (! module.isNumeric(top.type))    this.error("/argument-mismatch/am-1", ["top",    "canvas.fillRect", "numeric argument", module.displayname(top.type)]);
						if (! module.isNumeric(width.type))  this.error("/argument-mismatch/am-1", ["width",  "canvas.fillRect", "numeric argument", module.displayname(width.type)]);
						if (! module.isNumeric(height.type)) this.error("/argument-mismatch/am-1", ["height", "canvas.fillRect", "numeric argument", module.displayname(height.type)]);
						this.service.canvas.fillRect.call(this, left.value.b, top.value.b, width.value.b, height.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"frameRect": function(left, top, width, height) {
						if (! module.isNumeric(left.type))   this.error("/argument-mismatch/am-1", ["left",   "canvas.frameRect", "numeric argument", module.displayname(left.type)]);
						if (! module.isNumeric(top.type))    this.error("/argument-mismatch/am-1", ["top",    "canvas.frameRect", "numeric argument", module.displayname(top.type)]);
						if (! module.isNumeric(width.type))  this.error("/argument-mismatch/am-1", ["width",  "canvas.frameRect", "numeric argument", module.displayname(width.type)]);
						if (! module.isNumeric(height.type)) this.error("/argument-mismatch/am-1", ["height", "canvas.frameRect", "numeric argument", module.displayname(height.type)]);
						this.service.canvas.frameRect.call(this, left.value.b, top.value.b, width.value.b, height.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"circle": function(x, y, radius) {
						if (! module.isNumeric(x.type))      this.error("/argument-mismatch/am-1", ["x",      "canvas.circle", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type))      this.error("/argument-mismatch/am-1", ["y",      "canvas.circle", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(radius.type)) this.error("/argument-mismatch/am-1", ["radius", "canvas.circle", "numeric argument", module.displayname(radius.type)]);
						this.service.canvas.circle.call(this, x.value.b, y.value.b, radius.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"fillCircle": function(x, y, radius) {
						if (! module.isNumeric(x.type))      this.error("/argument-mismatch/am-1", ["x",      "canvas.fillCircle", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type))      this.error("/argument-mismatch/am-1", ["y",      "canvas.fillCircle", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(radius.type)) this.error("/argument-mismatch/am-1", ["radius", "canvas.fillCircle", "numeric argument", module.displayname(radius.type)]);
						this.service.canvas.fillCircle.call(this, x.value.b, y.value.b, radius.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"frameCircle": function(x, y, radius) {
						if (! module.isNumeric(x.type))      this.error("/argument-mismatch/am-1", ["x",      "canvas.frameCircle", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type))      this.error("/argument-mismatch/am-1", ["y",      "canvas.frameCircle", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(radius.type)) this.error("/argument-mismatch/am-1", ["radius", "canvas.frameCircle", "numeric argument", module.displayname(radius.type)]);
						this.service.canvas.frameCircle.call(this, x.value.b, y.value.b, radius.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"curve": function(points, closed) {
						if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points", "canvas.curve", "array", module.displayname(points.type)]);
						if (! module.isDerivedFrom(closed.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["closed", "canvas.curve", "boolean", module.displayname(closed.type)]);
						let list = [];
						for (let i=0; i<points.value.b.length; i++)
						{
							let p = points.value.b[i];
							if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.curve", "array", module.displayname(p.type)]);
							if (p.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.curve; point[" + i + "] must be an array of size two."]);
							let x = p.value.b[0];
							let y = p.value.b[1];
							if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.curve", "numeric argument", module.displayname(x.type)]);
							if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.curve", "numeric argument", module.displayname(y.type)]);
							list.push([x.value.b, y.value.b]);
						}
						this.service.canvas.curve.call(this, list, closed.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"fillArea": function(points) {
						if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points", "canvas.fillArea", "array", module.displayname(points.type)]);
						let list = [];
						for (let i=0; i<points.value.b.length; i++)
						{
							let p = points.value.b[i];
							if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.fillArea", "array", module.displayname(p.type)]);
							if (p.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.fillArea; point[" + i + "] must be an array of size two."]);
							let x = p.value.b[0];
							let y = p.value.b[1];
							if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.fillArea", "numeric argument", module.displayname(x.type)]);
							if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.fillArea", "numeric argument", module.displayname(y.type)]);
							list.push([x.value.b, y.value.b]);
						}
						this.service.canvas.fillArea.call(this, list);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"frameArea": function(points) {
						if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points", "canvas.frameArea", "array", module.displayname(points.type)]);
						let list = [];
						for (let i=0; i<points.value.b.length; i++)
						{
							let p = points.value.b[i];
							if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.frameArea", "array", module.displayname(p.type)]);
							if (p.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.frameArea; point[" + i + "] must be an array of size two."]);
							let x = p.value.b[0];
							let y = p.value.b[1];
							if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.frameArea", "numeric argument", module.displayname(x.type)]);
							if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.frameArea", "numeric argument", module.displayname(y.type)]);
							list.push([x.value.b, y.value.b]);
						}
						this.service.canvas.frameArea.call(this, list);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"text": function(x, y, str) {
						if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "canvas.text", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["y", "canvas.text", "numeric argument", module.displayname(y.type)]);
						this.service.canvas.text.call(this, x.value.b, y.value.b, module.toString(str));
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"reset": function() {
						this.service.canvas.reset.call(this);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"shift": function(dx, dy) {
						if (! module.isNumeric(dx.type)) this.error("/argument-mismatch/am-1", ["dx", "canvas.shift", "numeric argument", module.displayname(dx.type)]);
						if (! module.isNumeric(dy.type)) this.error("/argument-mismatch/am-1", ["dy", "canvas.shift", "numeric argument", module.displayname(dy.type)]);
						this.service.canvas.shift.call(this, dx.value.b, dy.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"scale": function(factor) {
						if (! module.isNumeric(factor.type)) this.error("/argument-mismatch/am-1", ["factor", "canvas.scale", "numeric argument", module.displayname(factor.type)]);
						this.service.canvas.scale.call(this, factor.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"rotate": function(angle) {
						if (! module.isNumeric(angle.type)) this.error("/argument-mismatch/am-1", ["angle", "canvas.rotate", "numeric argument", module.displayname(angle.type)]);
						this.service.canvas.rotate.call(this, angle.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"transform": function(A, b) {
						if (! module.isDerivedFrom(A.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["A", "canvas.transform", "array", module.displayname(A.type)]);
						if (! module.isDerivedFrom(b.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["b", "canvas.transform", "array", module.displayname(b.type)]);
						if (A.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; A must be an array of size two."]);
						if (A.value.b[0].value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; A[0] must be an array of size two."]);
						if (A.value.b[1].value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; A[1] must be an array of size two."]);
						if (! module.isNumeric(A.value.b[0].value.b[0].type)) this.error("/argument-mismatch/am-1", ["A[0][0]", "canvas.transform", "numeric argument", module.displayname(A.value.b[0].value.b[0].type)]);
						if (! module.isNumeric(A.value.b[0].value.b[1].type)) this.error("/argument-mismatch/am-1", ["A[0][1]", "canvas.transform", "numeric argument", module.displayname(A.value.b[0].value.b[1].type)]);
						if (! module.isNumeric(A.value.b[1].value.b[0].type)) this.error("/argument-mismatch/am-1", ["A[1][0]", "canvas.transform", "numeric argument", module.displayname(A.value.b[1].value.b[0].type)]);
						if (! module.isNumeric(A.value.b[1].value.b[1].type)) this.error("/argument-mismatch/am-1", ["A[1][1]", "canvas.transform", "numeric argument", module.displayname(A.value.b[1].value.b[1].type)]);
						if (b.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; b must be an array of size two."]);
						if (! module.isNumeric(b.value.b[0].type)) this.error("/argument-mismatch/am-1", ["b[0]", "canvas.transform", "numeric argument", module.displayname(b.value.b[0].type)]);
						if (! module.isNumeric(b.value.b[1].type)) this.error("/argument-mismatch/am-1", ["b[1]", "canvas.transform", "numeric argument", module.displayname(b.value.b[1].type)]);
						this.service.canvas.transform.call(this,
								[[A.value.b[0].value.b[0].value.b, A.value.b[0].value.b[1].value.b],
								 [A.value.b[1].value.b[0].value.b, A.value.b[1].value.b[1].value.b]],
								[b.value.b[0].value.b, b.value.b[1].value.b]);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
			},
		},
	};


///////////////////////////////////////////////////////////
// lexer
//
// The task of the lexer is to return the next token in the
// input stream. It handles composite operators properly.
//


module.keywords = {
		"var": true,
		"function": true,
		"if": true,
		"then": true,
		"else": true,
		"for": true,
		"do": true,
		"while": true,
		"break": true,
		"continue": true,
		"return": true,
		"not": true,
		"and": true,
		"or": true,
		"xor": true,
		"null": true,
		"true": true,
		"false": true,
		"try": true,
		"catch": true,
		"throw": true,
		"class": true,
		"public": true,
		"protected": true,
		"private": true,
		"static": true,
		"constructor": true,
		"this": true,
		"super": true,
		"namespace": true,
		"use": true,
		"from": true,
		"module": true,
		"include": true,
		"import": true,
		"export": true,
		"const": true,
		"switch": true,
		"case": true,
		"default": true,
		"enum": true,
		"operator": true,
	};
module.operators = "=<>!^+-*/%:";
module.groupings = "()[]{}";
module.delimiters = ",;.";

// This is the central interface function of the lexer. It returns an
// object with the fields value and type:
//  * type is one of: "keyword", "identifier", "integer", "real", "string", "operator", "grouping", "delimiter", "end-of-file"
//  * value is a substring of the source code
//  * code is the sequence of characters that was parsed into the token
// If peek is set then the state will not be modified, unless an error
// occurs. In case of an error the function throws an exception.
// Note that one cannot rely on the token value alone to infer its type,
// since string tokens can take on any value. Therefore a token must
// always be tested for its type first, and then for a certain value.
module.get_token = function (state, peek)
{
	peek = (peek !== undefined) ? peek : false;
	let where = (peek) ? state.get() : false;
	state.skip();
	let line = state.line;
	if (state.eof()) return {"type": "end-of-file", "value": "", "code": "", "line": line};

	let indent = state.indentation();
	let tok = null;

	let c = state.current();
	if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
	{
		// parse an identifier or a keyword
		let start = state.pos;
		state.advance();
		while (state.good())
		{
			let c = state.current();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_') state.advance();
			else break;
		}
		let value = state.source.substring(start, state.pos);
		if (where) state.set(where); else state.skip();
		tok = {"type": (module.keywords.hasOwnProperty(value)) ? "keyword" : "identifier", "value": value, "code": value, "line": line};
	}
	else if (c >= '0' && c <= '9')
	{
		// parse a number, integer or float
		let start = state.pos;
		let digits = "0123456789";
		let type = "integer";
		while (! state.eof() && digits.indexOf(state.current()) >= 0) state.advance();
		if (! state.eof())
		{
			if (state.current() == '.')
			{
				// parse fractional part
				type = "real";
				state.advance();
				if (state.eof() || (state.current() < '0' || state.current() > '9')) state.error("/syntax/se-1");
				while (! state.eof() && (state.current() >= '0' && state.current() <= '9')) state.advance();
			}
			if (state.current() == 'e' || state.current() == 'E')
			{
				// parse exponent
				type = "real";
				state.advance();
				if (state.current() == '+' || state.current() == '-') state.advance();
				if (state.current() < '0' || state.current() > '9') state.error("/syntax/se-1");
				while (! state.eof() && (state.current() >= '0' && state.current() <= '9')) state.advance();
			}
		}
		let value = state.source.substring(start, state.pos);
		let n = parseFloat(value);
		if (where) state.set(where); else state.skip();
		tok = {"type": type, "value": n, "code": value, "line": line};
	}
	else if (c == '\"')
	{
		// parse string token
		let start = state.pos;
		let code = "";
		let value = "";
		state.advance();
		while (true)
		{
			if (! state.good()) state.error("/syntax/se-2");
			let c = state.current();
			if (c == '\\')
			{
				state.advance();
				let c = state.current();
				state.advance();
				if (c == '\\') c = '\\';
				else if (c == '\"') c = '\"';
				else if (c == 'r') c = '\r';
				else if (c == 'n') c = '\n';
				else if (c == 't') c = '\t';
				else if (c == 'f') c = '\f';
				else if (c == 'b') c = '\b';
				else if (c == '/') c = '/';
				else if (c == 'u')
				{
					const digits = "0123456789abcdefABCDEF";
					let code = "";
					for (let i=0; i<4; i++)
					{
						if (digits.indexOf(state.current()) < 0) state.error("/syntax/se-3");
						code += state.current();
						state.advance();
					}
					c = String.fromCharCode(parseInt(code, 16));
				}
				else state.error("/syntax/se-4", [c]);
				value += c;
			}
			else if (c == '\r' || c == '\n') state.error("/syntax/se-2");
			else if (c == '\"')
			{
				state.advance();
				code = state.source.substring(start, state.pos);
				break;
			}
			else
			{
				value += c;
				state.advance();
			}
		}
		if (where) state.set(where); else state.skip();
		tok = {"type": "string", "value": value, "code": code, "line": line};
	}
	else
	{
		// all the rest, including operators
		state.advance();
		if (module.operators.indexOf(c) >= 0)
		{
			let op = c;
			if (state.current() == '/' && c == '/') { state.advance(); op += '/'; }
			if (state.current() == '=' && c != ':') { state.advance(); op += '='; }
			if (op != "!")
			{
				if (where) state.set(where); else state.skip();
				tok = {"type": "operator", "value": op, "code": op, "line": line};
			}
		}
		if (tok === null)
		{
			let type = null;
			if (module.groupings.indexOf(c) >= 0) type = "grouping";
			else if (module.delimiters.indexOf(c) >= 0) type = "delimiter";
			else state.error("/syntax/se-5", [c]);
			if (where) state.set(where); else state.skip();
			tok = {"type": type, "value": c, "code": c, "line": line};
		}
	}

	if (module.options.checkstyle && ! state.builtin())
	{
		// check for indentation problems
		if (tok.type == "keyword" && (tok.value == "public" || tok.value == "protected" || tok.value == "private"))
		{ }
		else if (tok.type == "operator" && tok.value == ":")
		{ }
		else
		{
			let topmost = state.indent[state.indent.length - 1];
			if (topmost < 0 && line != -1-topmost)
			{
				if (indent <= state.indent[state.indent.length - 2]) state.error("/style/ste-1");
				state.indent[state.indent.length - 1] = indent;
			}
			else if (indent < topmost && state.current() != '}') state.error("/style/ste-1");
		}
	}

	return tok;
}


///////////////////////////////////////////////////////////
// The parser parses source code and translates the program
// into a description object, based on an abstract syntax
// tree. Each object in the structure shall provide the
// following fields:
//  * petype: program element type, a string
//  * parent: parent scope
//  * step: function executing the current "step" (as in
//          "step-into" debugging). The function has no
//          parameters, but it has access to the
//          interpreter as its "this" context.
//          The function may modify the instruction pointer,
//          but it is not guaranteed to point to the next
//          step. Possible return values are:
//          true  - step was executed
//          false - possibly something was done, but not a
//                  full step; increment the IP and
//                  continue
//  * sim: function providing the return value of the next
//         call to step without actually running it.
//  * where: object with fields pos, line and ch describing
//           the location in the source code where the
//           program element is defined (missing for a few
//           implicit elements, as well as for built-ins).
//

const assignments = {
		"=": true,
		"+=": true,
		"-=": true,
		"*=": true,
		"/=": true,
		"//=": true,
		"%=": true,
		"^=": true
	};

const left_unary_operator_precedence = {
		'+': 2,
		'-': 2,
		"not": 7,
	};

const binary_operator_precedence = {
		'+': 4,
		'-': 4,
		'*': 3,
		'/': 3,
		'//': 3,
		'%': 3,
		'^': 1,
		':': 5,
		'==': 6,
		'!=': 6,
		'<': 6,
		'<=': 6,
		'>': 6,
		'>=': 6,
		"and": 8,
		"or": 9,
		"xor": 9,
	};

const left_unary_operator_impl = {
		"not": function(arg)
				{
						if (module.isDerivedFrom(arg.type, module.typeid_boolean)) return {"type": this.program.types[module.typeid_boolean], "value": {"b": !arg.value.b} };
						else if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": ~arg.value.b} };
						else this.error("/argument-mismatch/am-2", [module.displayname(arg.type)]);
				},
		'+': function(arg)
				{
					if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": arg.value.b} };
					else if (module.isDerivedFrom(arg.type, module.typeid_real)) return {"type": this.program.types[module.typeid_real], "value": {"b": arg.value.b} };
					else this.error("/argument-mismatch/am-3", [module.displayname(arg.type)]);
				},
		'-': function(arg)
				{
					if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": (-arg.value.b) | 0} };
					else if (module.isDerivedFrom(arg.type, module.typeid_real)) return {"type": this.program.types[module.typeid_real], "value": {"b": -arg.value.b} };
					else this.error("/argument-mismatch/am-4", [module.displayname(arg.type)]);
				},
	};

const binary_operator_impl = {
		'+': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": (lhs.value.b + rhs.value.b) | 0} };
					}
					else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b + rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_string) || module.isDerivedFrom(rhs.type, module.typeid_string))
					{
						return {"type": this.program.types[module.typeid_string], "value": {"b": module.toString.call(this, lhs) + module.toString.call(this, rhs)} };
					}
					else this.error("/argument-mismatch/am-5", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'-': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": (lhs.value.b - rhs.value.b) | 0} };
					else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b - rhs.value.b} };
					else this.error("/argument-mismatch/am-6", [module.displayname(rhs.type), module.displayname(lhs.type)]);
				},
		'*': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": module.mul32(lhs.value.b, rhs.value.b)} };
					else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b * rhs.value.b} };
					else this.error("/argument-mismatch/am-7", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'/': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b / rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-8", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'//': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
						{
							if (rhs.value.b == 0) this.error("/argument-mismatch/am-15");
							return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.floor(lhs.value.b / rhs.value.b) | 0} };
						}
						else
						{
							return {"type": this.program.types[module.typeid_real], "value": {"b": Math.floor(lhs.value.b / rhs.value.b)} };
						}
					}
					else this.error("/argument-mismatch/am-8", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'%': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.round(module.mod.call(this, lhs.value.b, rhs.value.b)) | 0} };
						else return {"type": this.program.types[module.typeid_real], "value": {"b": module.mod.call(this, lhs.value.b, rhs.value.b)} };
					}
					else this.error("/argument-mismatch/am-9", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'^': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer) && rhs.value.b >= 0)
						{
							let ret = 1;
							let factor = lhs.value.b;
							for (let i=0; i<32; i++)
							{
								if ((1 << i) & rhs.value.b) ret = module.mul32(ret, factor);
								factor = module.mul32(factor, factor);
							}
							return {"type": this.program.types[module.typeid_integer], "value": {"b": ret} };
						}
						else return {"type": this.program.types[module.typeid_real], "value": {"b": Math.pow(lhs.value.b, rhs.value.b)} };
					}
					else this.error("/argument-mismatch/am-10", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		':': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(lhs.type, module.typeid_real) && module.isInt32(lhs.value.b)) { }
					else this.error("/argument-mismatch/am-11");
					if (module.isDerivedFrom(rhs.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(rhs.type, module.typeid_real) && module.isInt32(rhs.value.b)) { }
					else this.error("/argument-mismatch/am-11");
					return {"type": this.program.types[module.typeid_range], "value": {"b": { "begin": lhs.value.b | 0, "end": rhs.value.b | 0 } } }
				},
		'==': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.equal.call(this, lhs, rhs)} };
				},
		'!=': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": ! module.equal.call(this, lhs, rhs)} };
				},
		'<': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) < 0} };
				},
		'<=': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) <= 0} };
				},
		'>': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) > 0} };
				},
		'>=': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) >= 0} };
				},
		"and": function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
					{
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": lhs.value.b && rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": lhs.value.b & rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-12", ["and", module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		"or": function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
					{
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": lhs.value.b || rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": lhs.value.b | rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-12", ["or", module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		"xor": function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
					{
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": lhs.value.b != rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": lhs.value.b ^ rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-12", ["xor", module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
	};

// This function checks whether the next token is a keyword. If so then
// the keyword is returned without altering the state, otherwise the
// function returns the empty string.
function peek_keyword(state)
{
	let where = state.get();
	state.skip();
	if (state.eof()) return "";

	let c = state.current();
	if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
	{
		// parse an identifier or a keyword
		let start = state.pos;
		state.advance();
		while (state.good())
		{
			let c = state.current();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_') state.advance();
			else break;
		}
		let value = state.source.substring(start, state.pos);
		state.set(where);
		if (module.keywords.hasOwnProperty(value)) return value;
		else return "";
	}
	else
	{
		state.set(where);
		return "";
	}
}


///////////////////////////////////////////////////////////
// parser
//
// The parser consists of a number of free functions.
// Functions starting with "parse_" alter the parser state.
// These functions return the program element they created.
// They throw an exception on error. The only purpose of
// the exception is to interrupt the control flow; the
// actual error message is stored in the state object.
//

// deep copy of a JSON-like data structure
function deepcopy(value, excludekeys)
{
	if (excludekeys === undefined) excludekeys = {};

	if (Array.isArray(value))
	{
		let ret = [];
		for (let i=0; i<value.length; i++) ret.push(deepcopy(value[i], excludekeys));
		return ret;
	}
	else if ((typeof value === "object") && (value !== null))
	{
		let ret = {};
		for (let key in value)
		{
			if (! value.hasOwnProperty(key)) continue;
			if (excludekeys.hasOwnProperty(key)) continue;
			ret[key] = deepcopy(value[key], excludekeys);
		}
		return ret;
	}
	else return value;
}

// deep copy of a boxed constant
function copyconstant(constant)
{
	if (constant.type.id == module.typeid_array)
	{
		let value = [];
		for (let i=0; i<constant.value.b.length; i++) value.push(copyconstant.call(this, constant.value.b[i]));
		return {"type": this.program.types[module.typeid_array], "value": {"b": value}};
	}
	else if (constant.type.id == module.typeid_dictionary)
	{
		let value = {};
		for (let key in constant.value.b)
		{
			if (constant.value.b.hasOwnProperty(key)) value[key] = copyconstant.call(this, constant.value.b[key]);
		}
		return {"type": this.program.types[module.typeid_dictionary], "value": {"b": value}};
	}
	else return constant;
}

function simfalse()
{ return false; }

function simtrue()
{ return true; }

// step function of all constants
function constantstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	frame.temporaries.push(copyconstant.call(this, pe.typedvalue));
	frame.pe.pop();
	frame.ip.pop();
	return false;
};

// step function of most scopes, including global scope and functions
function scopestep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip < pe.commands.length)
	{
		if (! pe.commands[ip].declaration)
		{
			frame.pe.push(pe.commands[ip]);
			frame.ip.push(-1);
		}
		return false;
	}
	else
	{
		frame.pe.pop();
		frame.ip.pop();
		if (pe.petype == "function")
		{
			this.stack.pop();
			let frame = this.stack[this.stack.length - 1];
			frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
			return false;
		}
		else if (pe.petype == "global scope")
		{
			// the program has finished
			this.stack.pop();
			return false;
		}
		else return false;
	}
}

// step function of constructors
function constructorstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip == 0)
	{
		// call the super class constructor
		if (pe.hasOwnProperty("supercall"))
		{
			frame.pe.push(pe.supercall);
			frame.ip.push(-1);
		}
		return false;
	}
	else if (ip < pe.commands.length + 1)
	{
		// run the constructor commands
		if (! pe.commands[ip - 1].declaration)
		{
			frame.pe.push(pe.commands[ip - 1]);
			frame.ip.push(-1);
		}
		return false;
	}
	else
	{
		// return without a value
		frame.pe.pop();
		frame.ip.pop();
		this.stack.pop();
		return false;
	}
}

// step function of function calls
function callstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	if (ip == 0)
	{
		// evaluate base
		frame.pe.push(pe.base);
		frame.ip.push(-1);
		return false;
	}
	else if (ip <= n)
	{
		// evaluate arguments of the call
		frame.pe.push(pe.arguments[ip - 1]);
		frame.ip.push(-1);
		return false;
	}
	else if (ip == n+1)
	{
		// load the accumulated temporaries
		let args = new Array(n);
		for (let i=0; i<n; i++) args[n-1-i] = frame.temporaries.pop();
		let f = frame.temporaries.pop();

		// check for a callable object
		let f_obj = null;
		let f_pe = null;
		if (module.isDerivedFrom(f.type, module.typeid_function))
		{
			f_pe = f.value.b.func;
			if (f.value.b.hasOwnProperty("object")) f_obj = f.value.b.object;
		}
		else if (module.isDerivedFrom(f.type, module.typeid_type))
		{
			module.assert(f.value.b.hasOwnProperty("class_constructor"), "[callstep] internal error; type does not have a constructor");
			f_pe = f.value.b.class_constructor;
			if (pe.petype == "super call") f_obj = frame.object;
			else
			{
				// prepare the object for the constructor chain
				let cls = f.value.b;
				module.assert(cls.petype == "type", "[callstep] cannot find class of constructor");
				f_obj = { "type": cls, "value": { } };
				if (cls.objectsize > 0)
				{
					f_obj.value.a = [];
					let n = {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					for (let i=0; i<cls.objectsize; i++) f_obj.value.a.push(n);
				}
				// initialize attributes
				let c = cls;
				while (c && c.variables)
				{
					for (let i=0; i<c.variables.length; i++)
					{
						if (c.variables[i].hasOwnProperty("initializer"))
						{
							f_obj.value.a[c.variables[i].id] = copyconstant.call(this, c.variables[i].initializer.typedvalue);
						}
					}
					c = c.superclass;
				}

				// return value of construction is the new object
				frame.temporaries.push(f_obj);
			}
		}
		else this.error("/syntax/se-16", [module.displayname(f.type)]);

		// argument list for the call
		let m = f_pe.params.length;
		let params = new Array(m);

		// handle positional and named arguments
		for (let i=0; i<n; i++)
		{
			if (pe.arguments[i].petype == "named argument")
			{
				// parameter name lookup
				let name = pe.arguments[i].name;
				let found = false;
				for (let j=0; j<m; j++)
				{
					if (f_pe.params[j].hasOwnProperty("name") && f_pe.params[j].name == name)
					{
						if (params[j] !== undefined) this.error("/name/ne-1", [name, module.displayname(f_pe)]);
						params[j] = args[i];
						found = true;
						break;
					}
				}
				if (! found) this.error("/name/ne-2", [name, module.displayname(f_pe)]);
			}
			else
			{
				if (i < params.length) params[i] = args[i];
				else this.error("/name/ne-3", [module.displayname(f_pe)]);
			}
		}

		// handle default values
		for (let j=0; j<m; j++)
		{
			if (params[j] === undefined)
			{
				if (f_pe.params[j].hasOwnProperty("defaultvalue")) params[j] = f_pe.params[j].defaultvalue;
				else this.error("/name/ne-4", [(j+1), module.displayname(f_pe)]);
			}
		}

		// handle closure parameters
		if (f.value.b.hasOwnProperty("enclosed")) params = f.value.b.enclosed.concat(params);

		// make the actual call
		{
			// create a new stack frame with the function arguments as local variables
			let frame = {
					"pe": [f_pe],
					"ip": [-1],
					"temporaries": [],
					"variables": params,
				};
			if (f_obj) frame.object = f_obj;
			if (f.value.b.hasOwnProperty("enclosed")) frame.enclosed = f.value.b.enclosed;
			this.stack.push(frame);
			if (this.stack.length >= module.maxstacksize) this.error("/logic/le-1");
		}
		return true;
	}
	else
	{
		frame.pe.pop();
		frame.ip.pop();
		return false;
	}
}

function callsim()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	return (ip == n + 1);
}

// Create a program element of type breakpoint.
// The breakpoint is initially inactive.
function create_breakpoint(parent, state)
{
	let active = false;
	return {
			"petype": "breakpoint",
			"parent": parent,
			"line": state.line,
			"where": state.get(),
			"active": function()
					{ return active; },
			"set": function()
					{ active = true; },
			"clear": function()
					{ active = false; },
			"toggle": function()
					{ active = !active; },
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						if (active && frame.ip[frame.ip.length-1] == 0)
						{
							frame.ip[frame.ip.length-1]++;
							this.interrupt();
							if (this.service.breakpoint) this.service.breakpoint();
							return true;
						}
						frame.pe.pop();
						frame.ip.pop();
						return false;
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						return active && frame.ip[frame.ip.length-1] == 0;
					},
			};
}

function get_program(pe)
{
	while (pe.parent) pe = pe.parent;
	return pe;
}

function get_function(pe)
{
	while (true)
	{
		if (pe.petype == "function" || pe.petype == "method") return pe;
		if (pe.petype == "type") return null;
		if (! pe.parent) return pe;
		pe = pe.parent;
	}
}

function get_type(pe)
{
	while (pe)
	{
		if (pe.petype == "type") return pe;
		pe = pe.parent;
	}
	return null;
}

function get_context(pe)
{
	while (true)
	{
		if (pe.petype == "function" || pe.petype == "method" || pe.petype == "type" || ! pe.parent) return pe;
		pe = pe.parent;
	}
}

// Return an alternative pe, which is a constant, if possible.
// Otherwise return null.
function asConstant(pe, state)
{
	if (pe.petype == "constant")
	{
		return pe;
	}
	else if (pe.petype == "array")
	{
		let value = [];
		for (let i=0; i<pe.elements.length; i++)
		{
			let sub = asConstant(pe.elements[i], state);
			if (sub === null) return null;
			value.push(sub.typedvalue);
		}
		return { "petype": "constant", "where": pe.where, "typedvalue": {"type": get_program(pe).types[module.typeid_array], "value": {"b": value}}, "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype == "dictionary")
	{
		let value = {};
		for (let i=0; i<pe.keys.length; i++)
		{
			let sub = asConstant(pe.values[i], state);
			if (sub === null) return null;
			value['#' + pe.keys[i]] = sub.typedvalue;
		}
		return { "petype": "constant", "where": pe.where, "typedvalue": {"type": get_program(pe).types[module.typeid_dictionary], "value": {"b": value}}, "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype.substring(0, 20) == "left-unary operator ")
	{
		let sub = asConstant(pe.argument, state);
		if (sub === null) return null;
		let symbol = pe.petype.substring(20);
		return { "petype": "constant", "where": pe.where, "typedvalue": left_unary_operator_impl[symbol].call(state, sub.typedvalue), "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype.substring(0, 16) == "binary operator ")
	{
		let lhs = asConstant(pe.lhs, state);
		if (lhs === null) return null;
		let rhs = asConstant(pe.rhs, state);
		if (rhs === null) return null;
		let symbol = pe.petype.substring(16);
		return { "petype": "constant", "where": pe.where, "typedvalue": binary_operator_impl[symbol].call(state, lhs.typedvalue, rhs.typedvalue), "step": constantstep, "sim": simfalse };
	}
	else return null;
}

// Locate the parent of the program element to which a given name
// refers. Report an error if the name cannot be resolved.
// The actual program element is returnvalue.names[name].
function resolve_name(state, name, parent, errorname)
{
	// prepare a generic "not defined" error
	let error = "/name/ne-5";
	let arg = [errorname, name];
	let lookup = null;
	let pe = parent;
	while (pe)
	{
		// check name inside pe
		if (pe.hasOwnProperty("names") && pe.names.hasOwnProperty(name))
		{
			let n = pe.names[name];

			// check whether a variable or function is accessible
			if (n.petype == "variable" || n.petype == "function" || n.petype == "attribute" || n.petype == "method")
			{
				// find the context
				let context = get_context(pe);
				if (context.petype == "global scope")
				{
					// global scope is always okay
					module.assert(n.petype == "variable" || n.petype == "function");
				}
				else if (context.petype == "type")
				{
					// non-static members must live in the same class
					if (n.petype == "attribute" || n.petype == "method")
					{
						let cl = get_type(parent);
						if (cl != context) state.error("/name/ne-6", [errorname, name]);
					}
				}
				else
				{
					// local variables must live in the same function
					module.assert(n.petype == "variable" || n.petype == "function");
					if (n.petype == "variable")
					{
						let fn = get_function(parent);
						if (fn != context) state.error("/name/ne-7", [errorname, name]);
					}
				}
			}
			return pe;
		}

		// check the superclass chain
		if (pe.petype == "type")
		{
			let sup = pe.superclass;
			while (sup)
			{
				if (sup.names.hasOwnProperty(name))
				{
					if (sup.names[name].access == "private")
					{
						// prepare the error, don't raise it yet!
						error = "/name/ne-8";
						arg = [errorname, name, module.displayname(sup)];
					}
					else return sup;
				}
				sup = sup.superclass;
			}
		}

		// move upwards in the scope hierarchy
		if (! pe.hasOwnProperty("parent")) break;
		pe = pe.parent;
	}
	state.error(error, arg);
}

// Parse a name. This can be a simple identifier, or it can be
// super.name, or it can be a name inside a namespace of the form
// namespace1.namespace2. [...] .name . The function looks up the name.
// It returns the full name, the program element holding the entity as
// a name, and the result of the lookup.
// In addition, the function reports and error if the name refers to a
// non-static member for which "this" is not available.
function parse_name(state, parent, errorname, allow_namespace)
{
	if (allow_namespace === undefined) allow_namespace = false;

	let ref = parent;
	let token = module.get_token(state);

	// handle "super"
	let isSuper = false;
	if (token.type == "keyword" && token.value == "super")
	{
		// check for a super class
		let cls = get_type(parent);
		if (cls === null) state.error("/syntax/se-6");
		if (! cls.hasOwnProperty("superclass")) state.error("/syntax/se-7");
		ref = cls.superclass;

		// parser super.identifier
		token = module.get_token(state);
		if (token.type != "delimiter" || token.value != '.') state.error("/syntax/se-8");
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-9");

		isSuper = true;
	}
	else if (token.type != "identifier") state.error("/syntax/se-10", [errorname]);

	// look up the name
	let name = token.value;
	let pe = resolve_name(state, token.value, ref, errorname);
	let lookup = pe.names[token.value];
	if (isSuper && lookup.hasOwnProperty("access") && lookup.access == "private") state.error("/name/ne-8", ["name lookup", name, module.displayname(pe)]);

	// handle namespace names
	while (lookup.petype == "namespace")
	{
		token = module.get_token(state, true);
		if (token.type != "delimiter" || token.value != '.')
		{
			if (allow_namespace) break;
			else state.error("/name/ne-11");
		}
		module.get_token(state);
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-11");

		if (! lookup.names.hasOwnProperty(token.value)) state.error("/name/ne-9", [token.value, name]);
		name += "." + token.value;
		pe = lookup;
		lookup = lookup.names[token.value];
	}

	// check whether "this" is available
	if (lookup.petype == "attribute" || lookup.petype == "method")
	{
		// check for the enclosing type
		let sub_cl = get_type(parent);
		let super_cl = get_type(lookup);
		module.assert(sub_cl && module.isDerivedFrom(sub_cl, super_cl.id));   // this used to raise se-12, however, that case should now be covered in resolve_name

		// check for an enclosing non-static method
		let fn = get_function(parent);
		if (fn && fn.petype != "method") state.error("/syntax/se-13", [errorname, lookup.petype, name]);
	}

	return { "name": name, "pe": pe, "lookup": lookup };
}

// Parse the argument list of a function call.
// The expression to the left of the parenthesis is provided as #base.
function parse_call(state, parent, base)
{
	// parse the opening parenthesis, which is assumed to be already detected
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.value == '(', "[parse_call] internal error");

	// parse comma-separated list of possibly named expressions
	let args = [];
	token = module.get_token(state, true);
	if (token.type == "grouping" && token.value == ')') module.get_token(state);
	else
	{
		let forcenamed = false;
		while (true)
		{
			// check for named parameters
			let where = state.get();
			let named = false;
			let name = module.get_token(state);
			if (name.type == "identifier")
			{
				let token = module.get_token(state);
				if (token.type == "operator" && token.value == '=') named = true;
				else state.set(where);
			}
			else state.set(where);
			if (forcenamed && ! named) state.error("/syntax/se-14");
			if (named) forcenamed = true;

			// handle the actual argument
			let ex = parse_expression(state, parent);
			if (named)
			{
				let pe = {"petype": "named argument", "where": where, "parent": parent, "name": name.value, "argument": ex,
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										frame.pe.push(pe.argument);
										frame.ip.push(-1);
										return false;
									}
									else
									{
										frame.pe.pop();
										frame.ip.pop();
										return false;
									}
								},
						"sim": simfalse,
					};
				args.push(pe);
			}
			else args.push(ex);

			// delimiter or end
			token = module.get_token(state);
			if (token.type == "grouping" && token.value == ')') break;
			else if (token.value != ',') state.error("/syntax/se-15");
		}
	}

	// check arguments at parse time if possible (which is the case most of the time)
	if (base.petype == "constant")
	{
		// check base type
		let f = null;
		if (module.isDerivedFrom(base.typedvalue.type, module.typeid_function)) f = base.typedvalue.value.b.func;
		else if (module.isDerivedFrom(base.typedvalue.type, module.typeid_type))
		{
			let cls = base.typedvalue.value.b;
			if (cls.class_constructor.access != "public")
			{
				// check whether the constructor is accessible from the current context
				let sub_cl = get_type(parent);
				let error = false;
				if (cls.class_constructor.access == "private")
				{
					if (sub_cl === null || sub_cl != cls.id) error = true;
				}
				else if (cls.class_constructor.access == "protected")
				{
					if (sub_cl === null || ! module.isDerivedFrom(sub_cl, cls.id)) error = true;
				}
				else error = true;
				if (error) state.error("/name/ne-25", [module.displayname(cls), cls.class_constructor.access]);
			}
			f = base.typedvalue.value.b.class_constructor;
		}
		else state.error("/syntax/se-16", [base.typedvalue.type]);

		let n = args.length;       // number of given arguments
		let m = f.params.length;   // number of required parameters
		let params = [];           // which parameters are provided?
		for (let i=0; i<m; i++) params.push(false);

		// handle positional and named arguments
		for (let i=0; i<n; i++)
		{
			if (args[i].petype == "named argument")
			{
				// parameter name lookup
				let name = args[i].name;
				let found = false;
				for (let j=0; j<m; j++)
				{
					if (f.params[j].hasOwnProperty("name") && f.params[j].name == name)
					{
						if (params[j]) state.error("/name/ne-1", [name, module.displayname(f)]);
						params[j] = true;
						found = true;
						break;
					}
				}
				if (! found) state.error("/name/ne-2", [name, module.displayname(f)]);
			}
			else
			{
				if (i < params.length) params[i] = args[i];
				else state.error("/name/ne-3", [module.displayname(f)]);
			}
		}

		// check whether all missing parameters are covered by default values
		for (let j=0; j<m; j++)
		{
			if (! params[j] && ! f.params[j].hasOwnProperty("defaultvalue")) state.error("/name/ne-4", [(j+1), module.displayname(f)]);
		}
	}

	// create the function call operator
	return { "petype": "function call", "where": where, "parent": parent, "base": base, "arguments": args, "step": callstep, "sim": callsim };
}

function parse_expression(state, parent, lhs)
{
	if (lhs === undefined) lhs = false;

	// stack of expressions and operators
	let stack = [];

	while (true)
	{
		// obtain the next token
		let where = state.get();
		let token = module.get_token(state);

		// left-unary operators, parse now but handle later
		while ((token.type == "operator" || token.type == "keyword") && left_unary_operator_impl.hasOwnProperty(token.value))
		{
			if (lhs) state.error("/syntax/se-21");
			stack.push({"operator": token.value, "unary": true, "precedence": left_unary_operator_precedence[token.value], "where": where});
			where = state.get();
			token = module.get_token(state);
		}

		// actual core expression
		let ex = { "parent": parent, "where": where };
		if (token.type == "grouping" && token.value == '(')
		{
			ex.petype = "group";
			ex.sub = parse_expression(state, parent);
			let token = module.get_token(state);
			if (token.type != "grouping" || token.value != ')') state.error("/syntax/se-22");
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						if (ip == 0)
						{
							frame.pe.push(pe.sub);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					};
			ex.sim = simfalse;
		}
		else if (token.type == "keyword" && token.value == "null")
		{
			// constant
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_null], "value": {"b": null}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "keyword" && (token.value == "true" || token.value == "false"))
		{
			// constant
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_boolean], "value": {"b": (token.value == "true")}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "integer")
		{
			// constant
			let v = parseFloat(token.value);
			if (v > 2147483647) state.error("/syntax/se-23");
			v = v | 0;
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_integer], "value": {"b": v}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "real")
		{
			// constant
			let v = parseFloat(token.value);
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_real], "value": {"b": v}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "string")
		{
			// constant
			let v = token.value;
			while (true)
			{
				token = module.get_token(state, true);
				if (token.type != "string") break;
				token = module.get_token(state);
				v += token.value;
			}
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_string], "value": {"b": v}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.value == '[')
		{
			// create an array
			ex.petype = "array";
			ex.elements = [];
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip < pe.elements.length)
						{
							// get element number ip
							frame.pe.push(pe.elements[ip]);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// compose all elements to an array
							let a = new Array(pe.elements.length);
							for (let i=0; i<pe.elements.length; i++)
							{
								a[pe.elements.length - 1 - i] = frame.temporaries.pop();
							}
							frame.temporaries.push({ "type": this.program.types[module.typeid_array], "value": {"b": a }});
							frame.pe.pop();
							frame.ip.pop();
							return true;
						}
					};
			ex.sim = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip >= pe.elements.length);
					};

			// parse the array elements
			let first = true;
			while (! state.eof())
			{
				let token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == ']') { module.get_token(state); break; }
				if (first) first = false;
				else
				{
					if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-24");
					module.get_token(state);
					token = module.get_token(state, true);
					if (token.type == "grouping" && token.value == ']') { module.get_token(state); break; }
				}
				ex.elements.push(parse_expression(state, parent));
			}
			if (state.eof()) state.error("/syntax/se-25");

			// turn into a constant if possible
			let c = asConstant(ex, state);
			if (c !== null) ex = c;
		}
		else if (token.value == '{')
		{
			// create a dictionary
			ex.petype = "dictionary";
			ex.keys = [];
			ex.values = [];
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let n = pe.keys.length;
						if (ip < n)
						{
							// get a value
							frame.pe.push(pe.values[ip]);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// compose all elements to a dictionary
							let d = { };
							for (let i=0; i<n; i++)
							{
								let k = pe.keys[i];
								let v = frame.temporaries[frame.temporaries.length-n+i];
								module.assert(! d.hasOwnProperty('#' + k), "internal error; duplicate key in dictionary");
								d['#' + k] = v;
							}
							frame.temporaries = frame.temporaries.slice(0, frame.temporaries.length - n);
							frame.temporaries.push({"type": this.program.types[module.typeid_dictionary], "value": {"b": d}});
							frame.pe.pop();
							frame.ip.pop();
							return true;
						}
					};
			ex.sim = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let n = pe.keys.length;
						return (ip >= n);
					};

			// parse the dictionary elements
			let first = true;
			let keys = {};
			while (! state.eof())
			{
				let token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == '}') { module.get_token(state); break; }
				if (first) first = false;
				else
				{
					if (token.type == "delimiter" && token.value != ',') state.error("/syntax/se-27");
					module.get_token(state);
					token = module.get_token(state, true);
					if (token.type == "grouping" && token.value == '}') { module.get_token(state); break; }
				}
				token = module.get_token(state);
				if (token.type != "string" && token.type != "identifier") state.error("/syntax/se-28");
				if (keys.hasOwnProperty('#' + token.value)) state.error("/syntax/se-26", [token.value]);
				keys['#' + token.value] = true;
				ex.keys.push(token.value);
				token = module.get_token(state);
				if (token.type != "operator" || token.value != ':') state.error("/syntax/se-29");
				ex.values.push(parse_expression(state, parent));
			}
			if (state.eof()) state.error("/syntax/se-30");

			// turn into a constant if possible
			let c = asConstant(ex, state);
			if (c !== null) ex = c;
		}
		else if (token.type == "identifier" || (token.type == "keyword" && token.value == "super"))
		{
			state.set(where);
			let result = parse_name(state, parent, "expression");
			let name = result.name;
			let lookup = result.lookup;

			// create the "name" object
			ex.petype = "name";
			ex.name = name;
			ex.reference = lookup;
			if (lookup.petype == "variable" || lookup.petype == "attribute")
			{
				ex.scope = lookup.scope;
				ex.id = lookup.id;
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (pe.scope == "global")
								frame.temporaries.push(this.stack[0].variables[pe.id]);
							else if (pe.scope == "local")
								frame.temporaries.push(frame.variables[pe.id]);
							else if (pe.scope == "object")
								frame.temporaries.push(frame.object.value.a[pe.id]);
							else module.assert(false, "unknown scope: " + pe.scope);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else if (lookup.petype == "function")
			{
				ex.petype = "constant";
				ex.typedvalue = {"type": get_program(parent).types[module.typeid_function], "value": {"b": {"func": lookup}}};
				ex.step = constantstep;
				ex.sim = simfalse;
			}
			else if (lookup.petype == "method")
			{
				ex.scope = lookup.scope;
				ex.id = lookup.id;
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							let result = {
									"type": this.program.types[module.typeid_function],
									"value": {"b": {"func": pe.reference, "object": frame.object}}
								};
							frame.temporaries.push(result);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else if (lookup.petype == "type")
			{
				ex.petype = "constant";
				ex.typedvalue = {"type": get_program(parent).types[module.typeid_type], "value": {"b": lookup}};
				ex.step = constantstep;
				ex.sim = simfalse;
			}
			else module.assert(false, "If this assertion fails then error ne-10 must be re-activated.");
		}
		else if (token.type == "keyword" && token.value == "this")
		{
			// check for a method or an anonymous function
			let fn = get_function(parent);
			if (fn.petype == "method")
			{
				let cls = fn.parent;
				module.assert(cls.petype == "type", "cannot find class around this");

				// create the "this" object
				ex.petype = "this";
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							frame.temporaries.push(frame.object);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else if (fn.petype == "function" && ! fn.hasOwnProperty("name") && fn.displayname == "(anonymous)")
			{
				// create the "this" object
				ex.petype = "this";
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let f = {"type": this.program.types[module.typeid_function], "value": {"b": {"func": fn}}};
							if (frame.enclosed) f.value.b.enclosed = frame.enclosed;
							frame.temporaries.push(f);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else state.error("/syntax/se-47");
		}
		else if (token.type == "keyword" && token.value == "function")
		{
			// create the anonymous function
			let func = {"petype": "function", "parent": parent, "where": where, "displayname": "(anonymous)", "commands": [], "variables": [], "names": {}, "closureparams": [], "params": [], "step": scopestep, "sim": simfalse};

			// parse the closure parameters
			token = module.get_token(state);
			if (token.type == "grouping" && token.value == '[')
			{
				while (true)
				{
					// parse ] or ,
					let where = state.get();
					let token = module.get_token(state);
					if (token.type == "grouping" && token.value == ']') break;
					if (func.closureparams.length != 0)
					{
						if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-31");
						where = state.get();
						token = module.get_token(state);
					}

					// parse the parameter name
					if (token.type != "identifier") state.error("/syntax/se-32");
					let name = token.value; 
					if (func.names.hasOwnProperty(name)) state.error("/name/ne-17", [name]);
					let id = func.variables.length;
					let variable = { "petype": "variable", "where": where, "parent": ex, "name": name, "id": id, "scope": "local" };

					// parse the initializer
					token = module.get_token(state, true);
					if (token.type == "operator" && token.value == '=')
					{
						// explicit initializer, consume the "=" token
						module.get_token(state);
					}
					else
					{
						if (token.type == "delimiter" && token.value == ",") { }
						else if (token.type == "grouping" && token.value == "]") { }
						else state.error("/syntax/se-31");

						// parse the identifier again, but this time as its own initializer
						state.set(where);
					}
					let initializer = parse_expression(state, parent);

					// register the closure parameter
					let param = { "name": name, "initializer": initializer };
					func.names[name] = variable;
					func.variables[id] = variable;
					func.closureparams.push(param);
				}

				// prepare the opening parenthesis
				token = module.get_token(state);
			}
			else if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-35");

			// parse the parameters
			if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-36", ["anonymous function"]);
			while (true)
			{
				// parse ) or ,
				let token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == ')')
				{
					module.get_token(state);
					break;
				}
				if (func.params.length != 0)
				{
					if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-37");
					module.get_token(state);
				}

				// parse the parameter name
				let where = state.get();
				token = module.get_token(state);
				if (token.type != "identifier") state.error("/syntax/se-33");
				let name = token.value; 
				let id = func.variables.length;
				let variable = { "petype": "variable", "where": where, "parent": func, "name": name, "id": id, "scope": "local" };
				let param = { "name": name };

				// check for a default value
				token = module.get_token(state, true);
				if (token.type == "operator" && token.value == '=')
				{
					module.get_token(state);
					let defaultvalue = parse_expression(state, parent);
					if (defaultvalue.petype != "constant") state.error("/syntax/se-38");
					param.defaultvalue = defaultvalue.typedvalue;
				}

				// register the parameter
				if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
				func.names[name] = variable;
				func.variables[id] = variable;
				func.params.push(param);
			}

			// parse the function body
			token = module.get_token(state);
			if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["anonymous function"]);
			state.indent.push(-1 - token.line);
			while (true)
			{
				token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == '}')
				{
					state.indent.pop();
					if (module.options.checkstyle && ! state.builtin())
					{
						let indent = state.indentation();
						let topmost = state.indent[state.indent.length - 1];
						if (topmost >= 0 && topmost > indent) state.error("/style/ste-2");
					}
					module.get_token(state);
					break;
				}
				let cmd = parse_statement_or_declaration(state, func);
				func.commands.push(cmd);
			}

			// create the actual closure expression, which evaluates the closure parameters
			ex.petype = "closure";
			ex.func = func;
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let n = pe.func.closureparams.length;
						if (ip < n)
						{
							// evaluate the closure parameters
							frame.pe.push(pe.func.closureparams[ip].initializer);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// create and return the closure function object
							let enc = frame.temporaries.slice(frame.temporaries.length - n);
							frame.temporaries.splice(frame.temporaries.length - n, n);
							frame.temporaries.push({"type": this.program.types[module.typeid_function], "value": {"b": {"func": pe.func, "enclosed": enc}}});
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					};
			ex.sim = simfalse;
		}
		else if (token.type == "keyword") state.error("/syntax/se-41", [token.value]);
		else state.error("/syntax/se-42", [token.value]);

		// right-unary operators: dot, access, and call
		while (! state.eof())
		{
			let where = state.get();
			token = module.get_token(state, true);
			if (token.type == "delimiter" && token.value == '.')
			{
				// public member access operator
				module.get_token(state);
				let token = module.get_token(state);
				if (token.type != "identifier") state.error("/syntax/se-43");
				let op = { "petype": "access of member " + token.value, "where": where, "parent": parent, "object": ex, "member": token.value,
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										// evaluate the object
										frame.pe.push(pe.object);
										frame.ip.push(-1);
										return false;
									}
									else
									{
										// the actual access
										let object = frame.temporaries.pop();

										// find the public member in the super class chain
										let m = null;
										if (module.isDerivedFrom(object.type, module.typeid_type))
										{
											// static case
											let type = object.value.b;
											let sup = type;
											while (sup)
											{
												if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
												{
													m = sup.staticmembers[pe.member];
													break;
												}
												sup = sup.superclass;
											}
											if (m === null) this.error("/name/ne-12", [module.displayname(type), pe.member]);
										}
										else
										{
											// non-static case
											let type = object.type;
											let sup = type;
											while (sup)
											{
												if (sup.members.hasOwnProperty(pe.member) && sup.members[pe.member].access == "public")
												{
													m = sup.members[pe.member];
													break;
												}
												else if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
												{
													m = sup.staticmembers[pe.member];
													break;
												}
												sup = sup.superclass;
											}
											if (m === null) this.error("/name/ne-13", [module.displayname(type), pe.member]);
										}

										// return the appropriate access object
										if (m.petype == "method")
										{
											// non-static method
											frame.temporaries.push({"type": this.program.types[module.typeid_function], "value": {"b": {"func": m, "object": object}}});
										}
										else if (m.petype == "attribute")
										{
											// non-static attribute
											frame.temporaries.push(object.value.a[m.id]);
										}
										else if (m.petype == "function")
										{
											// static function
											frame.temporaries.push({"type": this.program.types[module.typeid_function], "value": {"b": {"func": m}}});
										}
										else if (m.petype == "variable")
										{
											// static variable
											frame.temporaries.push(this.stack[0].variables[m.id]);
										}
										else if (m.petype == "type")
										{
											// nested class
											frame.temporaries.push({"type": this.program.types[module.typeid_type], "value": {"b": m}});
										}
										else module.assert(false, "[member access] internal error; unknown member type " + m.petype);

										frame.pe.pop();
										frame.ip.pop();
										return true;
									}
								},
						"sim": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									return (ip != 0);
								},
					};
				ex.parent = op;
				ex = op;
			}
			else if (token.type == "grouping" && token.value == '(')
			{
				let op = parse_call(state, parent, ex);
				ex.parent = op;
				ex = op;
			}
			else if (token.type == "grouping" && token.value == '[')
			{
				// parse a single argument, no argument list
				module.get_token(state);
				let arg = parse_expression(state, parent);
				let token = module.get_token(state);
				if (token.type != "grouping" || token.value != ']') state.error("/syntax/se-44");
				let op = { "petype": "item access", "where": where, "parent": parent, "base": ex, "argument": arg,
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										// evaluate base
										frame.pe.push(pe.base);
										frame.ip.push(-1);
										return false;
									}
									else if (ip == 1)
									{
										// evaluate the argument
										frame.pe.push(pe.argument);
										frame.ip.push(-1);
										return false;
									}
									else if (ip == 2)
									{
										// the actual access
										let index = frame.temporaries.pop();
										let container = frame.temporaries.pop();
										if (module.isDerivedFrom(container.type, module.typeid_string))
										{
											if (module.isDerivedFrom(index.type, module.typeid_integer))
											{
												if (index.value.b < 0) this.error("/argument-mismatch/am-21", [module.toString.call(this, index)]);
												else if (index.value.b >= container.value.b.length) this.error("/argument-mismatch/am-22", [module.toString.call(this, index), container.value.b.length]);
												let code = container.value.b.charCodeAt(index.value.b);
												let ret = {"type": this.program.types[module.typeid_integer], "value": {"b": code}};
												frame.temporaries.push(ret);
											}
											else if (module.isDerivedFrom(index.type, module.typeid_range))
											{
												let a = index.value.b.begin;
												let b = index.value.b.end;
												if (a < 0) a = 0;
												if (b > container.value.b.length) b = container.value.b.length;
												let str = container.value.b.substring(a, b);
												let ret = {"type": this.program.types[module.typeid_string], "value": {"b": str}};
												frame.temporaries.push(ret);
											}
											else this.error("/argument-mismatch/am-20", [module.toString.call(this, index), module.displayname(index.type)]);
										}
										else if (module.isDerivedFrom(container.type, module.typeid_array))
										{
											if (module.isDerivedFrom(index.type, module.typeid_integer))
											{
												if (index.value.b < 0) this.error("/argument-mismatch/am-23", [module.toString.call(this, index)]);
												else if (index.value.b >= container.value.b.length) this.error("/argument-mismatch/am-24", [module.toString.call(this, index), container.value.b.length]);
												else frame.temporaries.push(container.value.b[index.value.b]);
											}
											else if (module.isDerivedFrom(index.type, module.typeid_range))
											{
												let a = index.value.b.begin;
												let b = index.value.b.end;
												if (a < 0) a = 0;
												if (b > container.value.b.length) b = container.value.b.length;
												let arr = [];
												for (let i=a; i<b; i++) arr.push(container.value.b[i]);
												let ret = {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
												frame.temporaries.push(ret);
											}
											else this.error("/argument-mismatch/am-26", [module.toString.call(this, index), module.displayname(index.type)]);
										}
										else if (module.isDerivedFrom(container.type, module.typeid_dictionary))
										{
											if (module.isDerivedFrom(index.type, module.typeid_string))
											{
												if (container.value.b.hasOwnProperty('#' + index.value.b)) frame.temporaries.push(container.value.b['#' + index.value.b]);
												else this.error("/argument-mismatch/am-27", [index.value.b]);
											}
											else this.error("/argument-mismatch/am-28", [module.displayname(index.type)]);
										}
										else if (module.isDerivedFrom(container.type, module.typeid_range))
										{
											if (module.isDerivedFrom(index.type, module.typeid_integer))
											{
												let len = Math.max(0, container.value.b.end - container.value.b.begin);
												if (index.value.b < 0 || index.value.b >= len) this.error("/argument-mismatch/am-29", [module.toString.call(this, index), len]);
												let ret = {"type": this.program.types[module.typeid_integer], "value": {"b": container.value.b.begin + index.value.b}};
												frame.temporaries.push(ret);
											}
											else if (module.isDerivedFrom(index.type, module.typeid_range))
											{
												let len = Math.max(0, container.value.b.end - container.value.b.begin);
												let a = index.value.b.begin;
												let b = index.value.b.end;
												if (a < 0) a = 0;
												if (b > len) b = len;
												let ret = {"type": this.program.types[module.typeid_range], "value": {"b": {"begin": container.value.b.begin + a, "end": container.value.b.begin + b}}};
												frame.temporaries.push(ret);
											}
											else this.error("/argument-mismatch/am-30", [module.toString.call(this, index), module.displayname(index.type)]);
										}
										else this.error("/argument-mismatch/am-31", [module.displayname(container.type)]);
										return true;
									}
									else
									{
										frame.pe.pop();
										frame.ip.pop();
										return false;
									}
								},
						"sim": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									return (ip == 2);
								},
					};
				ex.parent = op;
				ex = op;
			}
			else break;
		}

		// push onto the stack
		stack.push(ex);

		// check for a binary operator
		token = module.get_token(state, true);
		if ((token.type == "operator" || token.type == "keyword") && binary_operator_impl.hasOwnProperty(token.value))
		{
			if (lhs) state.error("/syntax/se-21");
			stack.push({"operator": token.value, "unary": false, "precedence": binary_operator_precedence[token.value], "where": where});
			module.get_token(state);
		}
		else break;
	}

	// process the unary operator at position j
	let processUnary = function(j)
			{
				// apply left-unary operator to encapsulate an expression
				module.assert(j >= 0 && j < stack.length, "[processUnary] index out of range");
				module.assert(stack[j].hasOwnProperty("precedence") && stack[j].unary, "[processUnary] unary operator expected");
				module.assert(left_unary_operator_impl.hasOwnProperty(stack[j].operator), "[processUnary] cannot find left-unary operator " + stack[j].operator);
				module.assert(stack.length > j+1, "[processUnary] corrupted stack");
				module.assert(! stack[j+1].hasOwnProperty("precedence"), "[processUnary] corrupted stack");
				let ex = { "petype": "left-unary operator " + stack[j].operator, "where": stack[j].where, "parent": parent, "operator": stack[j].operator, "argument": stack[j+1],
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										frame.pe.push(pe.argument);
										frame.ip.push(-1);
										return false;
									}
									else
									{
										// execute the actual operator logic
										let arg = frame.temporaries.pop();
										frame.temporaries.push(left_unary_operator_impl[pe.operator].call(this, arg));

										frame.pe.pop();
										frame.ip.pop();
										return true;
									}
								},
						"sim": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									return (ip != 0);
								},
					};

				// turn into a constant if possible
				let c = asConstant(ex, state);
				if (c !== null) ex = c;

				// update the stack
				stack[j+1].parent = ex;
				stack.splice(j, 2, ex);
			};

	// process the binary operator at position j
	let processBinary = function(j)
			{
				// apply the operator to merge two expression
				module.assert(j >= 0 && j < stack.length, "[processBinary] index out of range");
				module.assert(stack[j].hasOwnProperty("precedence") && ! stack[j].unary, "[processBinary] binary operator expected");
				module.assert(binary_operator_impl.hasOwnProperty(stack[j].operator), "[processBinary] cannot find binary operator " + stack[j].operator);
				module.assert(j > 0 && stack.length > j+1, "[processBinary] corrupted stack");
				module.assert(! stack[j-1].hasOwnProperty("precedence"), "[processBinary] corrupted stack");
				module.assert(! stack[j+1].hasOwnProperty("precedence"), "[processBinary] corrupted stack");
				let ex = { "petype": "binary operator " + stack[j].operator, "where": stack[j].where, "parent": parent, "operator": stack[j].operator, "lhs": stack[j-1], "rhs": stack[j+1] };
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								frame.pe.push(pe.lhs);
								frame.ip.push(-1);
								return false;
							}
							else if (ip == 1)
							{
								frame.pe.push(pe.rhs);
								frame.ip.push(-1);
								return false;
							}
							else
							{
								// execute the actual operator logic
								let rhs = frame.temporaries.pop();
								let lhs = frame.temporaries.pop();
								let result = binary_operator_impl[pe.operator].call(this, lhs, rhs);
								frame.temporaries.push(result);

								frame.pe.pop();
								frame.ip.pop();
								return true;
							}
						};
				ex.sim = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							return (ip > 1);
						};

				// turn into a constant if possible
				let c = asConstant(ex, state);
				if (c !== null) ex = c;

				// update the stack
				stack[j-1].parent = ex;
				stack[j+1].parent = ex;
				stack.splice(j-1, 3, ex);
			};

	// reduce the stack at position #pos into an expression binding
	// with strength of at least #precedence
	let reduce = function(pos, precedence)
	{
		module.assert(pos < stack.length, "[reduce] invalid position");

		// handle leading unary operators
		if (stack[pos].hasOwnProperty("precedence"))
		{
			// the sequence starts with a unary operator
			module.assert(stack[pos].unary, "[reduce] unary operator expected");
			reduce(pos + 1, stack[pos].precedence);
			module.assert(! stack[pos+1].hasOwnProperty("precedence"), "[reduce] corrupted stack");
			processUnary(pos);
			module.assert(! stack[pos].hasOwnProperty("precedence"), "[reduce] corrupted stack");
		}

		// stop the recursion
		if (precedence <= 0) return;

		// handle binary operators and recurse
		while (true)
		{
			// recurse to handle stronger bindings
			reduce(pos, precedence - 1);

			// check for a binary operator
			if (pos+1 >= stack.length) break;
			module.assert(stack[pos+1].hasOwnProperty("precedence") && ! stack[pos+1].unary && stack[pos+1].precedence >= precedence, "[reduce] operator mismatch");
			if (stack[pos+1].precedence > precedence) break;

			// recurse to handle stronger bindings on the RHS
			module.assert(pos+2 < stack.length, "[reduce] invalid RHS position");
			reduce(pos+2, precedence - 1);

			// apply the binary operator
			processBinary(pos+1);
			module.assert(! stack[pos].hasOwnProperty("precedence"), "[reduce] corrupted stack");
		}
	}

	// reduce the whole stack
	reduce(0, 10);
	module.assert(stack.length == 1, "[parse_expression] stack was not reduced");

	if (lhs)
	{
		if (stack[0].petype == "group") state.error("/argument-mismatch/am-32", ["expression in parentheses"]);
		if (stack[0].petype == "constant") state.error("/argument-mismatch/am-32", ["a constant"]);
		if (stack[0].petype == "function") state.error("/argument-mismatch/am-32", ["a function"]);
		if (stack[0].petype == "function call") state.error("/argument-mismatch/am-32", ["the result of a function call"]);
	}

	// return the resulting expression
	return stack[0];
}

function parse_lhs(state, parent)
{
	// parse the LHS as an expression
	let ex = parse_expression(state, parent, true);

	// replace the topmost step function
	if (ex.petype == "name")
	{
		if (ex.reference.petype != "variable" && ex.reference.petype != "attribute") state.error("/argument-mismatch/am-32", ["name of type '" + ex.reference.petype + "'"]);
		ex.step = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];

					let op = frame.temporaries.pop();
					let rhs = frame.temporaries.pop();
					let base = null;
					if (pe.scope == "global") base = this.stack[0].variables;
					else if (pe.scope == "local") base = frame.variables;
					else if (pe.scope == "object") base = frame.object.value.a;
					else module.assert(false, "unknown scope type " + pe.scope);
					let index = pe.id;

					if (op != '=')
					{
						// binary operator corresponding to compound assignment
						let binop = op.substring(0, op.length - 1);
						rhs = binary_operator_impl[binop].call(this, base[index], rhs);
					}

					// actual assignment as a copy of the typed value
					base[index] = { "type": rhs.type, "value": rhs.value };

					frame.pe.pop();
					frame.ip.pop();
					return true;
				};
		ex.sim = simtrue;
	}
	else if (ex.petype == "item access")
	{
		ex.step = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];

					if (ip == 0)
					{
						// evaluate the container
						frame.pe.push(pe.base);
						frame.ip.push(-1);
						return false;
					}
					else if (ip == 1)
					{
						// evaluate the index
						frame.pe.push(pe.argument);
						frame.ip.push(-1);
						return false;
					}
					else
					{
						// obtain all relevant values
						let index = frame.temporaries.pop();
						let container = frame.temporaries.pop();
						let op = frame.temporaries.pop();
						let rhs = frame.temporaries.pop();

						// check validity
						let key;
						if (module.isDerivedFrom(container.type, module.typeid_string))
						{
							this.error("/argument-mismatch/am-32", ["a substring"]);
						}
						else if (module.isDerivedFrom(container.type, module.typeid_array))
						{
							if (module.isDerivedFrom(index.type, module.typeid_integer))
							{
								if (index.value.b < 0) this.error("/argument-mismatch/am-23", [module.toString.call(this, index)]);
								else if (index.value.b >= container.value.b.length) this.error("/argument-mismatch/am-24", [module.toString.call(this, index), container.value.b.length]);
								key = index.value.b;
							}
							else this.error("/argument-mismatch/am-25", [module.toString.call(this, index), module.displayname(index.type)]);
						}
						else if (module.isDerivedFrom(container.type, module.typeid_dictionary))
						{
							if (! module.isDerivedFrom(index.type, module.typeid_string)) this.error("/argument-mismatch/am-28", [module.displayname(index.type)]);
							key = '#' + index.value.b;
						}
						else this.error("/argument-mismatch/am-31b", [container.type]);

						if (op != '=')
						{
							// binary operator corresponding to compound assignment
							let binop = op.substring(0, op.length - 1);

							// in this specific case the key must exist
							if (module.isDerivedFrom(container.type, module.typeid_dictionary))
							{
								if (! container.value.b.hasOwnProperty(key)) this.error("/argument-mismatch/am-27", [index.value.b]);
							}

							rhs = binary_operator_impl[binop].call(this, container.value.b[key], rhs);
						}

						// actual assignment as a deep copy of the typed value
						container.value.b[key] = { "type": rhs.type, "value": rhs.value };

						frame.pe.pop();
						frame.ip.pop();
						return true;
					}
				};
		ex.sim = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					return (ip > 1);
				};
	}
	else if (ex.petype.substring(0, 17) == "access of member ")
	{
		ex.step = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					if (ip == 0)
					{
						// evaluate the object
						frame.pe.push(pe.object);
						frame.ip.push(-1);
						return false;
					}
					else
					{
						// obtain all relevant values
						let object = frame.temporaries.pop();
						let op = frame.temporaries.pop();
						let rhs = frame.temporaries.pop();

						// find the public member in the super class chain
						let m = null;
						if (module.isDerivedFrom(object.type, module.typeid_type))
						{
							// static case
							let type = object.value.b;
							let sup = type;
							while (sup)
							{
								if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
								{
									m = sup.staticmembers[pe.member];
									break;
								}
								sup = sup.superclass;
							}
							if (m === null) this.error("/name/ne-12", [module.displayname(type), pe.member]);
						}
						else
						{
							// non-static case
							let type = object.type;
							let sup = type;
							while (sup)
							{
								if (sup.members.hasOwnProperty(pe.member) && sup.members[pe.member].access == "public")
								{
									m = sup.members[pe.member];
									break;
								}
								else if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
								{
									m = sup.staticmembers[pe.member];
									break;
								}
								sup = sup.superclass;
							}
							if (m === null) this.error("/name/ne-13", [module.displayname(type), pe.member]);
						}

						// obtain container and index
						let container = null;
						let index = null;
						if (m.petype == "method")
						{
							// non-static method
							this.error("/argument-mismatch/am-32", ["a method"]);
						}
						else if (m.petype == "attribute")
						{
							// non-static attribute
							container = object.value.a;
							index = m.id;
						}
						else if (m.petype == "function")
						{
							// static function
							this.error("/argument-mismatch/am-32", ["a static method"]);
						}
						else if (m.petype == "variable")
						{
							// static variable
							container = this.stack[0].variables;
							index = m.id;
						}
						else if (m.petype == "type")
						{
							// nested class
							this.error("/argument-mismatch/am-32", ["a class"]);
						}
						else module.assert(false, "[member access] internal error; unknown member type " + m.petype);

						if (op != '=')
						{
							// binary operator corresponding to compound assignment
							let binop = op.substring(0, op.length - 1);
							rhs = binary_operator_impl[binop].call(this, container[index], rhs);
						}

						// actual assignment as a deep copy of the typed value
						container[index] = { "type": rhs.type, "value": rhs.value };

						frame.pe.pop();
						frame.ip.pop();
						return true;
					}
				};
		ex.sim = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					return (ip != 0);
				};
	}
	else state.error("/argument-mismatch/am-32", [ex.petype]);

	return ex;
}

function parse_assignment_or_expression(state, parent)
{
	// try to parse an expression
	let where = state.get();
	let ex = parse_expression(state, parent);
	let token = module.get_token(state);
	if (token.type == "operator" && assignments.hasOwnProperty(token.value))
	{
		// retry as an assignment
		state.set(where);
		let lhs = parse_lhs(state, parent);
		where = state.get();
		let op = module.get_token(state);
		let rhs = parse_expression(state, parent);
		token = module.get_token(state);
		if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-48");

		return { "petype": "assignment " + op.value, "where": where, "parent": parent, "operator": op.value, "lhs": lhs, "rhs": rhs,
				"step": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								// evaluate the rhs
								frame.pe.push(pe.rhs);
								frame.ip.push(-1);
								return false;
							}
							else if (ip == 1)
							{
								// push the operator
								frame.temporaries.push(pe.operator);

								// assign to the lhs
								frame.pe.push(pe.lhs);
								frame.ip.push(-1);
								return false;
							}
							else
							{
								frame.pe.pop();
								frame.ip.pop();
								return false;
							}
						},
				"sim": simfalse,
			};
	}
	else if (token.type == "delimiter" && token.value == ';')
	{
		return { "petype": "expression", "where": where, "parent": parent, "sub": ex,
				"step": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								// run the expression as a statement
								frame.pe.push(pe.sub);
								frame.ip.push(-1);
								return false;
							}
							else
							{
								// ignore the return value
								frame.temporaries.pop();

								frame.pe.pop();
								frame.ip.pop();
								return false;
							}
						},
				"sim": simfalse,
			};
	}
	else
	{
		state.error("/syntax/se-49");
	}
}

// Parse a "var" statement. Even for multiple variables it is treated as
// a single statement. The variables are placed into the container,
// which defaults to the enclosing function or global scope.
function parse_var(state, parent, container)
{
	container = (container !== undefined) ? container : get_function(parent);

	// handle "var" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "var", "[parse_var] internal error");

	// prepare "group of variable declarations" object
	let ret = { "petype": "variable declaration", "where": where, "parent": parent, "vars": [],
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip < pe.vars.length)
						{
							// push the var onto the stack
							frame.pe.push(pe.vars[ip]);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};

	// parse individual variables
	while (true)
	{
		// obtain variable name
		let where = state.get();
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-50");
		if (parent.names.hasOwnProperty(token.value)) state.error("/name/ne-14", [token.value]);

		// check variable name
		if (module.options.checkstyle && ! state.builtin() && token.value[0] >= 'A' && token.value[0] <= 'Z')
		{
			state.error("/style/ste-3", ["variable", token.value]);
		}

		// create the variable
		let id = (container.petype == "type") ? container.objectsize : container.variables.length;
		let pe = { "petype": "variable", "where": where, "parent": parent, "name": token.value, "id": id,
				"step": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								// push the value onto the stack
								if (pe.hasOwnProperty("initializer"))
								{
									frame.pe.push(pe.initializer);
									frame.ip.push(-1);
									return false;
								}
								else
								{
									frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
									return true;
								}
							}
							else if (ip == 1)
							{
								// assign the value to the variable
								frame.variables[pe.id] = frame.temporaries.pop();
								return false;
							}
							else
							{
								frame.pe.pop();
								frame.ip.pop();
								return false;
							}
						},
				"sim": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								let pe = frame.pe[frame.pe.length - 1];
								return (! pe.hasOwnProperty("initializer"));
							}
							else return false;
						},
			};

		// remember the scope to which the variable's id refers
		if (container.petype == "global scope") pe.scope = "global";
		else if (container.petype == "function" || container.petype == "method") pe.scope = "local";
		else if (container.petype == "type") pe.scope = "object";
		else module.assert(false, "unknown variable scope");

		// parse the initializer
		token = module.get_token(state);
		if (token.type == "operator" && token.value == '=')
		{
			pe.initializer = parse_expression(state, parent);
			token = module.get_token(state);
		}

		// register the variable
		container.variables.push(pe);
		parent.names[pe.name] = pe;
		ret.vars.push(pe);
		if (container.petype == "type") parent.objectsize++;

		// parse the delimiter
		if (token.type == "delimiter" && token.value == ';') break;
		else if (token.type != "delimiter" || token.value != ',') state.error(pe.initializer ? "/syntax/se-51b" : "/syntax/se-51");
	}
	return ret;
}

// Parse a function declaration.
function parse_function(state, parent, petype)
{
	if (petype === undefined) petype = "function";

	// handle "function" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "function", "[parse_function] internal error");

	// obtain function name
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-52");
	let fname = token.value;
	if (parent.names.hasOwnProperty(fname)) state.error("/name/ne-15", [fname]);

	// check function name
	if (module.options.checkstyle && ! state.builtin() && fname[0] >= 'A' && fname[0] <= 'Z')
	{
		state.error("/style/ste-3", ["function", fname]);
	}

	// create the function
	let func = { "petype": petype, "where": where, "declaration": true, "parent": parent, "commands": [], "variables": [], "name": fname, "names": {}, "params": [], "step": scopestep, "sim": simfalse };
	parent.names[fname] = func;

	// parse the parameters
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-36", ["function declaration"]);
	while (true)
	{
		// parse ) or ,
		let token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == ')')
		{
			module.get_token(state);
			break;
		}
		if (func.params.length != 0)
		{
			if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-37");
			module.get_token(state);
		}

		// parse the parameter name
		let where = state.get();
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-33");
		let name = token.value; 
		let id = func.variables.length;
		let variable = { "petype": "variable", "where": where, "parent": func, "name": name, "id": id, "scope": "local" };
		let param = { "name": name };

		// check for a default value
		token = module.get_token(state, true);
		if (token.type == "operator" && token.value == '=')
		{
			module.get_token(state);
			let defaultvalue = parse_expression(state, parent);
			if (defaultvalue.petype != "constant") state.error("/syntax/se-38");
			param.defaultvalue = defaultvalue.typedvalue;
		}

		// register the parameter
		if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
		func.names[name] = variable;
		func.variables[id] = variable;
		func.params.push(param);
	}

	// parse the function body
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["function declaration"]);
	state.indent.push(-1 - token.line);
	while (true)
	{
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}
		let cmd = parse_statement_or_declaration(state, func);
		func.commands.push(cmd);
	}

	// replace the function body with built-in functionality
	if (func.commands.length == 0)
	{
		let fullname = [];
		let p = func;
		while (p.parent)
		{
			fullname.unshift(p.name);
			p = p.parent;
		}
		let d = state.impl;
		for (let i=0; i<fullname.length; i++)
		{
			if (d.hasOwnProperty(fullname[i])) d = d[fullname[i]];
			else { d = null; break; }
		}
		if (d)
		{
			if (typeof d == "function")
			{
				func.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let params = frame.variables;
							if (frame.object) params.unshift(frame.object);
							let ret = pe.body.apply(this, params);
							if (this.stack.length == 0) return false;
							this.stack.pop();
							frame = this.stack[this.stack.length - 1];
							frame.temporaries.push(ret);
							return false;
						};
				func.sim = simfalse;
				func.body = d;
			}
			else if (d.hasOwnProperty("step"))
			{
				func.step = d.step;
				func.sim = d.hasOwnProperty("sim") ? d.sim : simfalse;
			}
			else throw "[parse_function] invalid built-in function";
		}
	}

	return func;
}

// Parse a constructor declaration.
function parse_constructor(state, parent)
{
	// check that the parent is indeed a type
	module.assert(parent.petype == "type", "[parse_constructor] internal error; parent is expected to be a type");

	// handle "constructor" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "constructor", "[parse_constructor] internal error");

	// create the function
	let func = { "petype": "method", "where": where, "declaration": true, "parent": parent, "commands": [], "variables": [], "name": "constructor", "names": {}, "params": [], "step": constructorstep, "sim": simfalse };

	// parse the parameters
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-36", ["constructor declaration"]);
	while (true)
	{
		// parse ) or ,
		let token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == ')')
		{
			module.get_token(state);
			break;
		}
		if (func.params.length != 0)
		{
			if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-37");
			module.get_token(state);
		}

		// parse the parameter name
		let where = state.get();
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-33");
		let name = token.value;
		let id = func.variables.length;
		let variable = { "petype": "variable", "where": where, "parent": func, "name": name, "id": id, "scope": "local" };
		let param = { "name": name };

		// check for a default value
		token = module.get_token(state, true);
		if (token.type == "operator" && token.value == '=')
		{
			module.get_token(state);
			let defaultvalue = parse_expression(state, parent);
			if (defaultvalue.petype != "constant") state.error("/syntax/se-38");
			param.defaultvalue = defaultvalue.typedvalue;
		}

		// register the parameter
		if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
		func.names[name] = variable;
		func.variables[id] = variable;
		func.params.push(param);
	}

	token = module.get_token(state);
	if (parent.hasOwnProperty("superclass"))
	{
		// implicit expression to the left of the super call
		let base = {"petype": "constant",
		            "where": state.get(),
		            "typedvalue": {"type": get_program(parent).types[module.typeid_type], "value": {"b": parent.superclass}},
		            "step": constantstep, "sim": simfalse};

		if (token.type == "operator" && token.value == ':')
		{
			// parse explicit super class constructor call
			token = module.get_token(state);
			if (token.type != "keyword" || token.value != "super") state.error("/syntax/se-53");
			func.supercall = parse_call(state, func, base);
			func.supercall.petype = "super call";

			// prepare parsing of '{'
			token = module.get_token(state);
		}
		else 
		{
			// create the implicit default super class constructor call
			func.supercall = { "petype": "super call", "where": where, "parent": func, "base": base, "arguments": [], "step": callstep, "sim": callsim };
		}
	}
	else if (token.type == "operator" && token.value == ':') state.error("/name/ne-21");

	// parse the constructor body
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["constructor declaration"]);
	state.indent.push(-1 - token.line);
	while (true)
	{
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}
		let cmd = parse_statement_or_declaration(state, func, true);
		func.commands.push(cmd);
	}

	// replace the function body with built-in functionality
	if (func.commands.length == 0)
	{
		let fullname = [];
		let p = func;
		while (p.parent)
		{
			fullname.unshift(p.name);
			p = p.parent;
		}
		let d = state.impl;
		for (let i=0; i<fullname.length; i++)
		{
			if (d.hasOwnProperty(fullname[i])) d = d[fullname[i]];
			else { d = null; break; }
		}
		if (d)
		{
			if (typeof d == "function")
			{
				func.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let params = frame.variables;
							if (frame.object) params.unshift(frame.object);
							let ret = pe.body.apply(this, params);
							this.stack.pop();
							return false;
						};
				func.sim = simfalse;
				func.body = d;
			}
			else if (d.hasOwnProperty("step"))
			{
				func.step = d.step;
				func.sim = d.hasOwnProperty("sim") ? d.sim : simfalse;
			}
			else throw "[parse_constructor] invalid built-in function";
		}
	}

	return func;
}

// Parse a class declaration.
function parse_class(state, parent)
{
	// handle the "class" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "class", "[parse_class] internal error");

	// obtain the class name
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-54");
	let cname = token.value;
	if (parent.names.hasOwnProperty(cname)) state.error("/name/ne-18", [cname]);

	// check class name
	if (module.options.checkstyle && ! state.builtin() && (cname[0] < 'A' || cname[0] > 'Z'))
	{
		state.error("/style/ste-4", [cname]);
	}

	// create the class
	let cls = { "petype": "type", "where": where, "parent": parent, "objectsize": 0, "variables": [], "staticvariables": [], "members": {}, "staticmembers": {}, "name": cname, "names": {},
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						// initialize static variables and nested classes
						let keys = Object.keys(pe.staticmembers);
						if (ip < keys.length)
						{
							let sub = pe.staticmembers[keys[ip]];
							if (sub.petype == "type" || sub.petype == "variable")
							{
								frame.pe.push(sub);
								frame.ip.push(-1);
								return false;
							}
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};
	parent.names[cname] = cls;

	// register the class as a new type
	let prog = get_program(parent);
	let id = prog.types.length;
	cls.id = id;
	prog.types.push(cls);

	// parse the optional super class
	token = module.get_token(state);
	if (token.type == "operator" && token.value == ':')
	{
		let result = parse_name(state, parent, "super class declaration");
		cls.superclass = result.lookup;

		if (cls.superclass.petype != "type") state.error("/name/ne-22", [result.name]);
		if (cls == cls.superclass) state.error("/name/ne-26", [result.name]);
		cls.objectsize = cls.superclass.objectsize;

		if (cls.superclass.class_constructor && cls.superclass.class_constructor.access == "private") state.error("/syntax/se-58");

		// parse the next token to check for '{'
		token = module.get_token(state);
	}
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["class declaration"]);
	state.indent.push(-1 - token.line);

	// parse the class body
	let access = null;
	while (true)
	{
		// check for end-of-class-body
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}

		// parse access modifiers
		if (token.type == "keyword" && (token.value == "public" || token.value == "protected" || token.value == "private"))
		{
			access = token.value;
			module.get_token(state);
			token = module.get_token(state);
			if (token.type != "operator" || token.value != ':') state.error("/syntax/se-55", [access]);
			continue;
		}

		// parse static modifier
		let stat = false;
		if (token.type == "keyword" && token.value == "static")
		{
			stat = true;
			module.get_token(state);
			token = module.get_token(state, true);
		}

		// parse the actual member
		if (token.type == "keyword" && token.value == "var")
		{
			if (access === null) state.error("/syntax/se-56");

			let group = parse_var(state, cls, stat ? get_program(parent) : cls);
			for (let i=0; i<group.vars.length; i++)
			{
				let pe = group.vars[i];
				if (pe.hasOwnProperty("initializer") && pe.initializer.petype != "constant") state.error("/syntax/se-57");

				pe.access = access;
				if (! stat)
				{
					pe.petype = "attribute";
					cls.members[pe.name] = pe;
				}
				else
				{
					pe.displayname = cname + "." + pe.name;
					cls.staticmembers[pe.name] = pe;
					cls.staticvariables.push(pe);
				}
			}
		}
		else if (token.type == "keyword" && token.value == "function")
		{
			if (access === null) state.error("/syntax/se-56");

			let pe = parse_function(state, cls, (stat ? "function" : "method"));
			if (stat) pe.displayname = cname + "." + pe.name;
			pe.access = access;
			if (stat) cls.staticmembers[pe.name] = pe;
			else cls.members[pe.name] = pe;
		}
		else if (token.type == "keyword" && token.value == "constructor")
		{
			if (cls.hasOwnProperty("class_constructor")) state.error("/syntax/se-59b");
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-59");

			let pe = parse_constructor(state, cls);
			pe.access = access;
			cls.class_constructor = pe;
		}
		else if (token.type == "keyword" && token.value == "class")
		{
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-60");

			let pe = parse_class(state, cls);
			pe.displayname = cname + "." + pe.name;
			pe.access = access;
			cls.staticmembers[pe.name] = pe;
		}
		else if (token.type == "keyword" && (token.value == "use" || token.value == "from"))
		{
			if (stat) state.error("/syntax/se-61");
			parse_use(state, cls);
		}
		else state.error("/syntax/se-62");
	}
	// no semicolon required after the class body (in contrast to C++)

	// create a public default constructor if necessary
	if (! cls.hasOwnProperty("class_constructor"))
	{
		cls.class_constructor = { "petype": "method", "where": cls.where, "access": "public", "declaration": true, "parent": cls, "commands": [], "variables": [], "name": "constructor", "names": {}, "params": [], "step": constructorstep, "sim": simfalse };
		if (cls.hasOwnProperty("superclass"))
		{
			let base = {"petype": "constant",
			            "where": state.get(),
			            "typedvalue": {"type": get_program(parent).types[module.typeid_type], "value": {"b": cls.superclass}},
			            "step": constantstep, "sim": simfalse};
			cls.class_constructor.supercall = { "petype": "super call", "parent": cls.class_constructor, "base": base, "arguments": [], "step": callstep, "sim": callsim };
		}
	}

	return cls;
}

// Parse a namespace declaration.
function parse_namespace(state, parent)
{
	// handle "namespace" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "namespace", "[parse_namespace] internal error");

	// check the parent
	if (parent.petype != "global scope" && parent.petype != "namespace") state.error("/syntax/se-63");

	// display name prefix
	let prefix = "";
	{
		let p = parent;
		while (p.petype == "namespace")
		{
			prefix = p.name + "." + prefix;
			p = p.parent;
		}
	}

	// obtain namespace name
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-64");
	let nname = token.value;

	// check namespace name
	if (module.options.checkstyle && ! state.builtin() && nname[0] >= 'A' && nname[0] <= 'Z')
	{
		state.error("/style/ste-3", ["namespace", nname]);
	}

	// obtain the named object corresponding to the namespace globally across instances
	let global_nspace = null;
	if (parent.names.hasOwnProperty(nname))
	{
		// extend the existing namespace
		global_nspace = parent.names[nname];
		if (global_nspace.petype != "namespace") state.error("/name/ne-19", [nname]);
	}
	else
	{
		// create the namespace
		global_nspace = { "petype": "namespace", "parent": parent, "name": nname, "displayname": prefix + nname, "names": {}, "declaration": true };
		parent.names[nname] = global_nspace;
	}

	// create the local namespace PE instance containing the commands
	let local_nspace = { "petype": "namespace", "where": where, "parent": parent, "names": global_nspace.names, "commands": [], "name": nname, "displayname": prefix + nname, "step": scopestep, "sim": simfalse };

	// parse the namespace body
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["namespace declaration"]);
	state.indent.push(-1 - token.line);
	while (true)
	{
		// check for end-of-body
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}

		// parse sub-declarations
		let sub = parse_statement_or_declaration(state, local_nspace);
		if (sub.hasOwnProperty("name")) sub.displayname = prefix + nname + "." + sub.name;
		local_nspace.commands.push(sub);
	}

	return local_nspace;
}

// Parse a "use" declaration.
function parse_use(state, parent)
{
	// handle "use" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && (token.value == "use" || token.value == "from"), "[parse_use] internal error");

	// create the use directive
	let use = { "petype": "use", "where": where, "parent": parent, "declaration": true };

	// handle the optional "from" part
	let from = parent;
	if (token.value == "from")
	{
		let result = parse_name(state, parent, "use directive", true);
		from = result.lookup;
		use.from = from;
		if (from.petype != "namespace") state.error("/name/ne-23", [result.name]);

		token = module.get_token(state);
		if (token.type != "keyword" || token.value != "use") state.error("/syntax/se-65");
	}

	// parse names with optional identifiers
	while (true)
	{
		// check for namespace keyword
		let kw = peek_keyword(state);
		if (kw == "namespace") module.get_token(state);

		// parse a name
		let result = parse_name(state, from, "use directive", true);
		let identifier = result.name.split(".").pop();

		// parse optional "as" part
		token = module.get_token(state);
		if (token.type == "identifier" && token.value == "as")
		{
			if (kw == "namespace") state.error("/syntax/se-66");
			token = module.get_token(state);
			if (token.type != "identifier") state.error("/syntax/se-67");
			identifier = token.value;
			token = module.get_token(state);
		}

		// actual name import
		if (kw == "namespace")
		{
			// import all names from the namespace
			if (result.lookup.petype != "namespace") state.error("/name/ne-23", [result.name]);
			for (let key in result.lookup.names)
			{
				if (! result.lookup.names.hasOwnProperty(key)) continue;
				if (parent.names.hasOwnProperty(key))
				{
					// tolerate double import of the same entity, otherwise report an error
					if (parent.names[key] != result.lookup.names[key]) state.error("/name/ne-24", [key]);
				}
				else
				{
					// import the name
					parent.names[key] = result.lookup.names[key];
				}
			}
		}
		else
		{
			// import a single name
			if (parent.names.hasOwnProperty(identifier))
			{
				// tolerate double import of the same entity, otherwise report an error
				if (parent.names[identifier] != result.lookup) state.error("/name/ne-24", [identifier]);
			}
			else
			{
				// import the name
				parent.names[identifier] = result.lookup;
			}
		}

		// check for delimiter
		if (token.type == "delimiter" && token.value == ';') break;
		else if (token.type == "delimiter" && token.value == ',') { }
		else state.error("/syntax/se-68");
	}

	return use;
}

function parse_ifthenelse(state, parent)
{
	// handle "if" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "if", "[parse_ifthenelse] internal error");

	// create the conditional object
	let ifthenelse = {
			"petype": "conditional statement",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// push the condition onto the stack
							frame.pe.push(pe.condition);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// evaluate the condition
							let cond = frame.temporaries.pop();
							if (! module.isDerivedFrom(cond.type, module.typeid_boolean)) this.error("/argument-mismatch/am-33", [module.displayname(cond.type)]);
							if (cond.value.b)
							{
								// push the "then" part onto the stack
								frame.pe.push(pe.then_part);
								frame.ip.push(-1);
							}
							else
							{
								// push the "else" part onto the stack, or skip it if there is none
								if (pe.hasOwnProperty("else_part"))
								{
									frame.pe.push(pe.else_part);
									frame.ip.push(-1);
								}
								else
								{
									frame.pe.pop();
									frame.ip.pop();
								}
							}
							return false;
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};

	// parse the condition
	ifthenelse.condition = parse_expression(state, parent);

	// parse the then-part
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "then") state.error("/syntax/se-69");
	ifthenelse.then_part = parse_statement(state, parent);

	// parse the else-part
	let kw = peek_keyword(state);
	if (kw == "else")
	{
		token = module.get_token(state);
		module.assert(token.type == "keyword" && token.value == "else", "[parse_ifthenelse] internal error");
		ifthenelse.else_part = parse_statement(state, parent);
	}

	return ifthenelse;
}

function parse_for(state, parent)
{
	// handle "for" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "for", "[parse_for] internal error");

	// create the loop object
	let forloop = {
			"petype": "for-loop",
			"where": where,
			"parent": parent,
			"names": {},
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == -2)
						{
							// handle "break" statement
							frame.temporaries.pop();
							frame.temporaries.pop();
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
						else if (ip == -1)
						{
							// recover from "continue", jump to ip = 4
							frame.ip[frame.ip.length - 1] = 4 - 1;
							return false;
						}
						else if (ip == 0)
						{
							// preparation phase: evaluate the iterable container
							frame.pe.push(pe.iterable);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// preparation phase: push a copy of the container and the first index onto the temporaries stack
							let iterable = frame.temporaries.pop();
							let container = module.isDerivedFrom(iterable.type, module.typeid_range) ? { "rangemarker": null, "begin": iterable.value.b.begin, "end": iterable.value.b.end, "length": Math.max(0, iterable.value.b.end - iterable.value.b.begin) } : [];
							if (module.isDerivedFrom(iterable.type, module.typeid_array))
							{
								for (let i=0; i<iterable.value.b.length; i++) container.push(iterable.value.b[i]);
							}
							else if (! module.isDerivedFrom(iterable.type, module.typeid_range)) this.error("/argument-mismatch/am-34", [module.displayname(iterable.type)]);
							frame.temporaries.push(container);
							frame.temporaries.push(0);
							return false;
						}
						else if (ip == 2)
						{
							// check the end-of-loop condition and set the loop variable
							let container = frame.temporaries[frame.temporaries.length - 2];
							let index = frame.temporaries[frame.temporaries.length - 1];
							if (index >= container.length)
							{
								frame.temporaries.pop();
								frame.temporaries.pop();
								frame.pe.pop();
								frame.ip.pop();
							}
							else if (pe.hasOwnProperty("var_id"))
							{
								let typedvalue = container.hasOwnProperty("rangemarker")
										? {"type": this.program.types[module.typeid_integer], "value": {"b": (container.begin + index) | 0}}
										: container[index];
								if (pe.var_scope == "global")
									this.stack[0].variables[pe.var_id] = typedvalue;
								else if (pe.var_scope == "local")
									frame.variables[pe.var_id] = typedvalue;
								else if (pe.var_scope == "object")
									frame.object.value.a[pe.var_id] = typedvalue;
								else module.assert(false, "unknown scope: " + pe.var_scope);
							}
							return true;
						}
						else if (ip == 3)
						{
							// push the body onto the stack
							frame.pe.push(pe.body);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 4)
						{
							// increment the loop counter and jump to ip = 2
							frame.temporaries[frame.temporaries.length - 1]++;
							frame.ip[frame.ip.length - 1] = 2 - 1;
							return false;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip == 2);
					},
		};

	// parse the variable
	let vardecl = false;
	where = state.get();
	token = module.get_token(state, true);
	if (token.type == "keyword" && token.value == "var")
	{
		// create and register a new variable
		// Note: the program element does *not* need a step function, it is only there to define the variable's id
		module.get_token(state);
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-70");
		let fn = get_function(parent);
		let id = fn.variables.length;
		let pe = { "petype": "variable", "where": where, "parent": forloop, "name": token.value, "id": id, "scope": "local" };
		fn.variables.push(pe);
		forloop.names[token.value] = pe;
		forloop.var_id = id;
		forloop.var_scope = "local";

		// parse "in"
		token = module.get_token(state);
		if (token.type != "identifier" || token.value != "in") state.error("/syntax/se-71");

		// parse the iterable object
		forloop.iterable = parse_expression(state, parent);

		// parse the "do" keyword
		token = module.get_token(state);
		if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-72");
	}
	else
	{
		let w = state.get();
		let ex = parse_expression(state, forloop);

		token = module.get_token(state);
		if (token.type == "identifier" && token.value == "in")
		{
			state.set(w);
			let result = parse_name(state, parent, "for-loop");
			let v = result.lookup;
			if (v.petype != "variable" && v.petype != "attribute") state.error("/argument-mismatch/am-35", [result.name, result.lookup.petype]);
			forloop.var_id = v.id;
			forloop.var_scope = v.scope;

			// parse "in"
			token = module.get_token(state);
			module.assert(token.type == "identifier" && token.value == "in", "[parse_for] internal error");

			// parse the iterable object
			forloop.iterable = parse_expression(state, parent);

			// parse the "do" keyword
			token = module.get_token(state);
			if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-72");
		}
		else if (token.type == "keyword" && token.value == "do")
		{
			forloop.iterable = ex;
		}
		else state.error("/syntax/se-73");
	}

	// parse the loop body
	forloop.body = parse_statement(state, forloop);

	return forloop;
}

function parse_dowhile(state, parent)
{
	// handle "do" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "do", "[parse_dowhile] internal error");

	// create the loop object
	let dowhile = {
			"petype": "do-while-loop",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == -2)
						{
							// handle "break" statement
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
						else if (ip == -1)
						{
							// recover from "continue" statement
							return false;
						}
						else if (ip == 0)
						{
							// push the body onto the stack
							frame.pe.push(pe.body);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// push the condition onto the stack
							frame.pe.push(pe.condition);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 2)
						{
							// evaluate the condition
							let cond = frame.temporaries.pop();
							if (! module.isDerivedFrom(cond.type, module.typeid_boolean)) this.error("/argument-mismatch/am-36", [module.displayname(cond.type)]);
							if (cond.value.b)
							{
								// start over
								frame.ip.pop();
								frame.ip.push(-1);
							}
							else
							{
								// leave the loop
								frame.pe.pop();
								frame.ip.pop();
							}
							return true;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip == 2);
					},
		};

	// parse the loop body
	dowhile.body = parse_statement(state, dowhile);

	// parse the "while" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "while") state.error("/syntax/se-74");

	// parse the condition
	dowhile.condition = parse_expression(state, parent);

	// parse the final semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ";") state.error("/syntax/se-75");

	return dowhile;
}

function parse_whiledo(state, parent)
{
	// handle "while" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "while", "[parse_whiledo] internal error");

	// create the loop object
	let whiledo = {
			"petype": "while-do-loop",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == -2)
						{
							// handle "break" statement
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
						else if (ip == -1)
						{
							// recover from "continue" statement
							return false;
						}
						else if (ip == 0)
						{
							// push the condition onto the stack
							frame.pe.push(pe.condition);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// evaluate the condition
							let cond = frame.temporaries.pop();
							if (! module.isDerivedFrom(cond.type, module.typeid_boolean)) this.error("/argument-mismatch/am-37", [module.displayname(cond.type)]);
							if (cond.value.b)
							{
								// push the body onto the stack
								frame.pe.push(pe.body);
								frame.ip.push(-1);
							}
							else
							{
								// leave the loop
								frame.pe.pop();
								frame.ip.pop();
							}
							return true;
						}
						else if (ip == 2)
						{
							// return to the condition
							frame.ip.pop();
							frame.ip.push(-1);
							return false;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip == 1);
					},
		};

	// parse the condition
	whiledo.condition = parse_expression(state, parent);

	// parse the "do" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-76");

	// parse the loop body
	whiledo.body = parse_statement(state, whiledo);

	return whiledo;
}

function parse_break(state, parent)
{
	// handle "break" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "break", "[parse_break] internal error");

	// ensure that we are inside a loop
	let p = parent;
	while (p)
	{
		if (p.petype == "function" || p.petype == "method" || p.petype == "global scope") state.error("/syntax/se-77");
		if (p.petype.indexOf("loop") >= 0) break;
		p = p.parent;
	}

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-81b");

	// create the break object
	return {
			"petype": "continue",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];

						// leave scopes until we hit a loop
						while (frame.pe.length > 0)
						{
							frame.ip.pop();
							let pe = frame.pe.pop();
							if (pe.petype.indexOf("loop") >= 0)
							{
								frame.pe.push(pe);
								frame.ip.push(-3);   // special "break" marker handled by loops
								return true;
							}
						}
						module.assert(false, "internal error in break: no enclosing loop context found");
					},
			"sim": simtrue,
		};
}

function parse_continue(state, parent)
{
	// handle "continue" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "continue", "[parse_continue] internal error");

	// ensure that we are inside a loop
	let p = parent;
	while (p)
	{
		if (p.petype == "function" || p.petype == "method" || p.petype == "global scope") state.error("/syntax/se-78");
		if (p.petype.indexOf("loop") >= 0) break;
		p = p.parent;
	}

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-81c");

	// create the continue object
	return {
			"petype": "continue",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];

						// leave scopes until we hit a loop
						while (frame.pe.length > 0)
						{
							frame.ip.pop();
							let pe = frame.pe.pop();
							if (pe.petype.indexOf("loop") >= 0)
							{
								frame.pe.push(pe);
								frame.ip.push(-2);   // special "continue" marker handled by loops
								return true;
							}
						}
						module.assert(false, "internal error in continue: no enclosing loop context found");
					},
			"sim": simtrue,
		};
}

function parse_return(state, parent)
{
	// handle "return" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "return", "[parse_return] internal error");

	// create the return object
	let ret = {
			"petype": "return",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						if (ip == 0)
						{
							// evaluate the argument
							if (pe.hasOwnProperty("argument"))
							{
								frame.pe.push(pe.argument);
								frame.ip.push(-1);
							}
							else frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
							return false;
						}
						else
						{
							// actual function return, move the argument to the then-current temporaries stack
							let arg = frame.temporaries.pop();
							this.stack.pop();
							if (this.stack.length > 0) this.stack[this.stack.length - 1].temporaries.push(arg);
							return true;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip != 0);
					},
		};

	// parse the optional argument
	token = module.get_token(state, true);
	if (token.type != "delimiter" || token.value != ';')
	{
		ret.argument = parse_expression(state, parent);
		let fn = get_function(parent);
		if (fn.name == "constructor") state.error("/syntax/se-79");
		if (fn.petype == "global scope" || fn.petype == "namespace") state.error("/syntax/se-80");
	}

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-81");

	return ret;
}

function parse_trycatch(state, parent)
{
	// handle "try" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "try", "[parse_trycatch] internal error");

	// create the try-catch object
	let trycatch = {
			"petype": "try-catch",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// run the try part
							frame.pe.push(pe.try_part);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 2)
						{
							// catch landing point, an exception is on the temporary stack
							frame.pe.push(pe.catch_part);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// done, either with try or with catch
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};

	// create the try part
	trycatch.try_part = {
			"petype": "try",
			"parent": parent,
			"where": where,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// run the try part
							frame.pe.push(pe.command);
							frame.ip.push(-1);
							return false;							
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};

	// parse the try part
	trycatch.try_part.command = parse_statement(state, parent);

	// parse the catch statement
	let where_catch = state.get();
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "catch") state.error("/syntax/se-82");

	// handle the "var" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "var") state.error("/syntax/se-84");

	// parse the variable name
	let where_var = state.get();
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-85");
	let name = token.value;

	// handle the "do" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-86");

	// create the catch part, which declares the exception variable
	trycatch.catch_part = {
			"petype": "catch",
			"parent": parent,
			"where": where_catch,
			"names": { },
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// initialize the variable
							frame.variables[pe.var_id] = frame.temporaries.pop();

							// run the catch part
							frame.pe.push(pe.command);
							frame.ip.push(-1);
							return false;							
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};

	// create and register a new variable
	// Note: the program element does *not* need a step function, it is only there to define the variable's id
	let fn = get_function(parent);
	let id = fn.variables.length;
	let pe = { "petype": "variable", "where": where_var, "parent": trycatch.catch_part, "name": name, "id": id, "scope": "local" };
	fn.variables.push(pe);
	trycatch.catch_part.names[name] = pe;
	trycatch.catch_part.var_id = id;

	// parse the catch part
	trycatch.catch_part.command = parse_statement(state, trycatch.catch_part);

	return trycatch;
}

function parse_throw(state, parent)
{
	// handle "throw" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "throw", "[parse_throw] internal error");

	// create the throw object
	let ret = {
			"petype": "throw",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						if (ip == 0)
						{
							// evaluate the exception
							frame.pe.push(pe.argument);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// save the exception
							let ex = frame.temporaries.pop();

							// search for a try block
							let remove_frame = 0;
							let remove_pe = 0;
							while (true)
							{
								let f = this.stack[this.stack.length - remove_frame - 1];
								if (f.pe[f.pe.length - 1 - remove_pe].petype == "try") break;
								remove_pe++;
								if (remove_pe >= f.pe.length)
								{
									remove_pe = 0;
									remove_frame++;
									if (remove_frame >= this.stack.length) this.error("/user/ue-3", [module.toString(ex)]);
								}
							}

							// modify the stack so that we jump to the catch statement
							this.stack.splice(this.stack.length - remove_frame, remove_frame);
							let f = this.stack[this.stack.length - 1];
							module.assert(remove_pe <= f.pe.length - 2, "[throw] corrupted stack");
							f.pe.splice(f.pe.length - remove_pe - 1, remove_pe + 1);
							f.ip.splice(f.ip.length - remove_pe - 2, remove_pe + 2, 1);

							// pass the exception into the catch block
							f.temporaries.push(ex);

							return true;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip != 0);
					},
		};

	// parse the exception argument
	ret.argument = parse_expression(state, parent);

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-87");

	return ret;
}

// Parse var, function, class, or namespace
// The function return null if no declaration is found.
function parse_declaration(state, parent)
{
	let kw = peek_keyword(state);

	if (kw == "var") return parse_var(state, parent);
	else if (kw == "function") return parse_function(state, parent);
	else if (kw == "class") return parse_class(state, parent);
	else if (kw == "namespace") return parse_namespace(state, parent);
	else if (kw == "use" || kw == "from") return parse_use(state, parent);
	else return null;
}

// Parse a single statement, or a group of statements.
function parse_statement(state, parent, var_allowed)
{
	if (var_allowed === undefined) var_allowed = false;

	let kw = peek_keyword(state);

	if (kw == "if") return parse_ifthenelse(state, parent);
	else if (kw == "for") return parse_for(state, parent);
	else if (kw == "do") return parse_dowhile(state, parent);
	else if (kw == "while") return parse_whiledo(state, parent);
	else if (kw == "break") return parse_break(state, parent);
	else if (kw == "continue") return parse_continue(state, parent);
	else if (kw == "return") return parse_return(state, parent);
	else if (kw == "try") return parse_trycatch(state, parent);
	else if (kw == "throw") return parse_throw(state, parent);
	else
	{
		let where = state.get();
		let token = module.get_token(state, true);
		if (token.type == "identifier")
		{
			return parse_assignment_or_expression(state, parent);
		}
		else if ((token.type == "keyword" && (token.value == "null" || token.value == "true" || token.value == "false" || token.value == "not" || token.value == "this" || token.value == "super"))
				|| (token.type == "grouping" && (token.value == '(' || token.value == '['))
				|| (token.type == "operator" && (token.value == '+' || token.value == '-'))
				|| token.type == "integer"
				|| token.type == "real"
				|| token.type == "string")
		{
			// rather stupid cases, forbid them??
			return parse_assignment_or_expression(state, parent);
		}
		else if (token.type == "delimiter" && token.value == ';')
		{
			// ignore solitude semicolon
			module.get_token(state);
			return {
					"petype": "no-operation",
					"where": where,
					"step": function()
							{
								let frame = this.stack[this.stack.length - 1];
								frame.pe.pop();
								frame.ip.pop();
								return false;
							},
					"sim": simfalse,
				};
		}
		else if (token.type == "grouping" && token.value == '{')
		{
			// parse a scope
			module.get_token(state);
			state.indent.push(-1 - token.line);
			let scope = { "petype": "scope", "where": where, "parent": parent, "commands": [], "names": {}, "step": scopestep, "sim": simfalse };
			while (true)
			{
				token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == '}')
				{
					state.indent.pop();
					if (module.options.checkstyle && ! state.builtin())
					{
						let indent = state.indentation();
						let topmost = state.indent[state.indent.length - 1];
						if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
					}
					module.get_token(state);
					break;
				}
				let cmd = parse_statement_or_declaration(state, scope);
				scope.commands.push(cmd);
			}
			return scope;
		}
		else if (token.type == "grouping" && token.value == '}') state.error("/syntax/se-88");
		else if (token.type == "keyword") state.error("/syntax/se-89", [token.value]);
		else state.error("/syntax/se-90", [token.value]);
	}
}

function parse_statement_or_declaration(state, parent)
{
	function markAsBuiltin(value)
			{
				if (Array.isArray(value))
				{
					for (let i=0; i<value.length; i++) markAsBuiltin(value[i]);
				}
				else if (value !== null && typeof value == "object" && value.constructor == Object)
				{
					if (value.hasOwnProperty("builtin") && value.builtin) return;
					if (value.hasOwnProperty("petype"))
					{
						if (value.hasOwnProperty("where")) delete value.where;
						value.builtin = true;
					}
					for (let key in value)
					{
						if (! value.hasOwnProperty(key)) continue;
						if (key == "parent") continue;
						markAsBuiltin(value[key]);
					}
				}
			};

	if (! state.builtin())
	{
		state.skip();

		if (! state.program.breakpoints.hasOwnProperty(state.line))
		{
			// create and register a new breakpoint
			let b = create_breakpoint(parent, state);
			state.program.breakpoints[state.line] = b;
			parent.commands.push(b);
		}
	}

	let ret = parse_declaration(state, parent);
	if (ret !== null)
	{
		if (state.builtin()) markAsBuiltin(ret);
		return ret;
	}
	ret = parse_statement(state, parent);
	if (state.builtin()) markAsBuiltin(ret);
	return ret;
}

// The parse function parses source code and translates it into an
// abstract syntax tree. It actually performs far more than that, in
// particular (static) name resolution. This allows the parser to catch
// a wide range of errors, as it would otherwise be done by a compiler.
// The function returns an object with the fields
//   program - the "parsed" program as an AST object, or null in case of failure
//   errors  - an array of with array error objects with fields type, line, message
// If module.option.checkstyle is set to true then the parser reports
// coding style warnings in the errors return value.
module.parse = function(sourcecode)
{
	function ParseError(msg) { this.message = msg; }
	ParseError.prototype = new Error();

	// create the initial program structure
	let program = {
		"petype": "global scope",   // like a main function, but with more stuff
		"parent": null,             // top of the hierarchy
		"commands": [],             // sequence of commands
		"types": [],                // array of all types
		"names": {},                // names of all global things
		"variables": [],            // mapping of index to name
		"breakpoints": {},          // mapping of line numbers (preceded by '#') to breakpoints (some lines do not have breakpoints)
		"lines": 0,                 // total number of lines in the program = maximal line number
		"step": scopestep,          // execute all commands within the scope
		"sim": simfalse,            // simulate commands
	};

	// create the parser state
	let state = {
			"program": program,     // program tree to be built during parsing
			"source": "",           // complete source code
			"pos": 0,               // zero-based position in the source code string
			"line": 1,              // one-based line number
			"ch": 0,                // zero-based character number within the line
			"indent": [0],          // stack of nested indentation widths
			"errors": [],           // list of errors, currently at most one
			"impl": {},             // implementations of built-in functions
			"builtin": function()
					{ return Object.keys(this.impl).length > 0; },
			"setSource": function(source, impl)
					{
						this.impl = (impl === undefined) ? {} : impl;
						this.source = source;
						this.pos = 0;
						this.line = 1;
						this.ch = 0;
						this.skip();
					},
			"good": function()
					{ return (this.pos < this.source.length) && (this.errors.length == 0); },
			"bad": function()
					{ return (! this.good()); },
			"eof": function()
					{ return this.pos >= this.source.length; },
			"error": function(path, args)
					{
						if (args === undefined) args = [];
						let msg = module.composeError(path, args);
						this.errors.push({"type": "error", "line": this.line, "ch": this.ch, "message": msg, "href": "#/errors" + path});
						throw new ParseError("error");
					},
			"warning": function(msg)
					{ this.errors.push({"type": "warning", "line": this.line, "message": msg}); },
			"current": function()
					{ return (this.pos >= this.source.length) ? "" : this.source[this.pos]; },
			"lookahead": function(num)
					{ return (this.pos + num >= this.source.length) ? "" : this.source[this.pos + num]; },
			"next": function()
					{ return this.lookahead(1); },
			"get": function()
					{ return { "pos": this.pos, "line": this.line, "ch": this.ch }; },
			"set": function(where)
					{ this.pos = where.pos; this.line = where.line, this.ch = where.ch },
			"indentation": function()
					{
						let w = 0;
						for (let i=this.pos - this.ch; i<this.pos; i++)
						{
							let c = this.source[i];
							if (c == ' ') w++;
							else if (c == '\t') { w += 4; w -= (w % 4); }
							else break;
						}
						return w;
					},
			"advance": function(n)
					{
						if (n === undefined) n = 1;

						if (this.pos + n > this.source.length) n = this.source.length - this.pos;
						for (let i=0; i<n; i++)
						{
							let c = this.current();
							if (c == '\n') { this.line++; this.ch = 0; }
							this.pos++; this.ch++;
						}
					},
			"skip": function()
					{
						let lines = [];
						while (this.good())
						{
							let c = this.current();
							if (c == '#')
							{
								this.pos++; this.ch++;
								if (this.current() == '*')
								{
									this.pos++; this.ch++;
									let star = false;
									while (this.good())
									{
										if (this.current() == '\n')
										{
											this.pos++;
											this.line++; this.ch = 0;
											star = false;
											continue;
										}
										if (star && this.current() == '#')
										{
											this.pos++; this.ch++;
											break;
										}
										star = (this.current() == '*');
										this.pos++; this.ch++;
									}
								}
								else
								{
									while (this.good() && this.current() != '\n') { this.pos++; this.ch++; }
								}
								continue;
							}
							if (c != ' ' && c != '\t' && c != '\r' && c != '\n') break;
							if (c == '\n') { this.line++; this.ch = 0; lines.push(this.line); }
							else this.ch++;
							this.pos++;
						}
						return lines;
					},
		};

	// parse one library or program
	let parse1 = function(source, impl)
			{
				state.setSource(source, impl);
				if (impl === undefined) program.where = state.get();
				while (state.good()) program.commands.push(parse_statement_or_declaration(state, program));
				if (impl === undefined) program.lines = state.line;
			};

	try
	{
		// parse the language core
		parse1(core.source, core.impl);

		// parse the built-in libraries
		parse1(lib_math.source, lib_math.impl);
		parse1(lib_turtle.source, lib_turtle.impl);
		parse1(lib_canvas.source, lib_canvas.impl);

		// parse the user's source code
		parse1(sourcecode);

		// append an "end" breakpoint
		state.skip();
		if (! program.breakpoints.hasOwnProperty(state.line))
		{
			// create and register a new breakpoint
			let b = create_breakpoint(program, state);
			program.breakpoints[state.line] = b;
			program.commands.push(b);
		}
	}
	catch (ex)
	{
		// ignore the actual exception and rely on state.errors instead
		if (ex instanceof ParseError)
		{
			if (state.errors.length > 0) return { "program": null, "errors": state.errors };
		}
		else
		{
			// report an internal parser error
			let err = {
						type: "error",
						href: "#/errors/internal/ie-1",
						message: module.composeError("/internal/ie-1", [module.ex2string(ex)]),
					};
			return { "program": null, "errors": [err] };
		}
	}

	if (state.errors.length > 0) return { "program": null, "errors": state.errors };
	else return { "program": program, "errors": [] };
};


///////////////////////////////////////////////////////////
//
// The "interpreter" class executes a parsed program.
//
// The interpreter is built around a call stack. This stack
// contains one frame per function, which holds the state
// consisting of instruction pointer (ip) and the values of
// all local variables. The bottom-most frame is the global
// scope, holding the global variables.
//
// Each frame holds stacks for pe (program element), ip
// (instruction pointer), temporaries, and an array of
// variables. The pe and ip stacks are always in sync, the
// ip index refers to a position within the corresponding
// pe. The temporary stack stores all temporary values. For
// calls to non-static methods, the frame contains a field
// for the object in addition.
//


// Interpreter constructor.
// An interpreter instance holds the state of a (parsed) program at any
// given point in time during execution, and it holds the "program
// pointer". It runs the program in a background thread, which should be
// stopped before the interpreter is discarded. If the program is not
// running in the background, then it can also be triggered step-by-step
// in the foreground thread.
module.Interpreter = function(program)
{
	///////////////////////////////////////////////////////////
	// constructor
	//

	// create attributes
	this.program = program;   // the program to execute
	this.thread = false;      // state of the thread
	this.stop = false;        // request to stop the thread
	this.background = false;  // is the thread responsible for running the program?
	this.halt = null;         // function testing whether the thread should be halted
	this.status = "";         // program status: "running", "waiting", "error", "finished"
	this.stack = [];          // full state of the program
	this.breakpoints = {};    // breakpoints for debugging, keys are lines
	this.stepcounter = 0;     // number of program steps already executed
	this.waittime = 0;        // time to wait before execution can continue
	this.eventqueue = [];     // queue of events, with entries of the form {type, event}.
	this.eventhandler = {};   // event handler by event type
	this.service = { };       // external services, mostly for communication with the IDE
	this.eventnames = { };    // registry of event types
	this.eventmode = false;   // is the program in event handling mode?
	this.hook = null;         // function to be called before each step with the interpreter as this argument

	this.service.turtle = {
		"x": 0.0,
		"y": 0.0,
		"angle": 0.0,
		"down": true,
		"rgb": "rgb(0,0,0)",
		"reset": function(x, y, degrees, down) {
			this.service.turtle.x = x;
			this.service.turtle.y = y;
			this.service.turtle.angle = degrees;
			this.service.turtle.down = down;
			this.service.turtle.rgb = "rgb(0,0,0)";
		},
		"move": function(distance) {
			let a = Math.PI / 180 * this.service.turtle.angle;
			let s = Math.sin(a);
			let c = Math.cos(a);
			let x = this.service.turtle.x + distance * s;
			let y = this.service.turtle.y + distance * c;
			if (this.service.turtle.down && this.service.turtle.dom)
			{
				let ctx = this.service.turtle.dom.getContext("2d");
				ctx.lineWidth = 1;
				ctx.strokeStyle = this.service.turtle.rgb;
				ctx.beginPath();
				ctx.moveTo(300+3*this.service.turtle.x, 300-3*this.service.turtle.y);
				ctx.lineTo(300+3*x, 300-3*y);
				ctx.stroke();
			}
			this.service.turtle.x = x;
			this.service.turtle.y = y;
		},
		"turn": function(degrees) {
			this.service.turtle.angle = (this.service.turtle.angle + degrees) % 360.0;
		},
		"color": function(red, green, blue) {
			if (red < 0) red = 0;
			else if (red > 1) red = 1;
			if (green < 0) green = 0;
			else if (green > 1) green = 1;
			if (blue < 0) blue = 0;
			else if (blue > 1) blue = 1;
			this.service.turtle.rgb = "rgb(" + Math.round(255*red) + "," + Math.round(255*green) + "," + Math.round(255*blue) + ")";
		},
		"pen": function(down) {
			this.service.turtle.down = down;
		}
	};

	this.service.canvas = {
		"font_size": 16,
		"width": function() {
			if (! this.service.canvas.dom) return 0;
			return this.service.canvas.dom.width;
		},
		"height": function() {
			if (! this.service.canvas.dom) return 0;
			return this.service.canvas.dom.height;
		},
		"setLineWidth": function(width) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.lineWidth = width;
		},
		"setLineColor": function(red, green, blue, alpha) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			let r = Math.min(1, Math.max(0, red));
			let g = Math.min(1, Math.max(0, green));
			let b = Math.min(1, Math.max(0, blue));
			let a = Math.min(1, Math.max(0, alpha));
			ctx.strokeStyle = "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + a + ")";
		},
		"setFillColor": function(red, green, blue, alpha) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			let r = Math.min(1, Math.max(0, red));
			let g = Math.min(1, Math.max(0, green));
			let b = Math.min(1, Math.max(0, blue));
			let a = Math.min(1, Math.max(0, alpha));
			ctx.fillStyle = "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + a + ")";
		},
		"setFont": function(fontface, fontsize) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.font = fontsize + "px " + fontface;
			this.service.canvas.font_size = fontsize;
		},
		"setTextAlign": function(alignment) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.textAlign = alignment;
		},
		"clear": function() {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillRect(0, 0, this.service.canvas.dom.width, this.service.canvas.dom.height);
		},
		"line": function(x1, y1, x2, y2) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		},
		"rect": function(left, top, width, height) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.rect(left, top, width, height);
			ctx.stroke();
		},
		"fillRect": function(left, top, width, height) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.fillRect(left, top, width, height);
		},
		"frameRect": function(left, top, width, height) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.rect(left, top, width, height);
			ctx.fill();
			ctx.stroke();
		},
		"circle": function(x, y, radius) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.stroke();
		},
		"fillCircle": function(x, y, radius) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fill();
		},
		"frameCircle": function(x, y, radius) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.stroke();
		},
		"curve": function(points, closed) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			let n = points.length;
			if (n > 0)
			{
				let p = points[0];
				ctx.moveTo(p[0], p[1]);
				for (let i=1; i<n; i++)
				{
					let p = points[i];
					ctx.lineTo(p[0], p[1]);
				}
			}
			if (closed) ctx.closePath();
			ctx.stroke();
		},
		"fillArea": function(points) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			let n = points.length;
			if (n > 0)
			{
				let p = points[0];
				ctx.moveTo(p[0], p[1]);
				for (let i=1; i<n; i++)
				{
					let p = points[i];
					ctx.lineTo(p[0], p[1]);
				}
			}
			ctx.closePath();
			ctx.fill();
		},
		"frameArea": function(points) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			let n = points.length;
			if (n > 0)
			{
				let p = points[0];
				ctx.moveTo(p[0], p[1]);
				for (let i=1; i<n; i++)
				{
					let p = points[i];
					ctx.lineTo(p[0], p[1]);
				}
			}
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		},
		"text": function(x, y, str) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.textBaseline = "top";
			let lines = str.split('\n');
			for (let i=0; i<lines.length; i++)
			{
				ctx.fillText(lines[i], x, y);
				y += this.service.canvas.font_size;
			}
		},
		"reset": function() {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		},
		"shift": function(dx, dy) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.translate(dx, dy);
		},
		"scale": function(factor) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.scale(factor, factor);
		},
		"rotate": function(angle) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.rotate(angle);
		},
		"transform": function(A, b) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.transform(A[0][0], A[1][0], A[0][1], A[1][1], b[0], b[1]);
		}
	};

	// exception type
	function RuntimeError(msg, line, ch, href)
	{
		if (line === undefined) line = null;
		if (ch === undefined) ch = null;
		if (href === undefined) href = "";
		this.message = msg;
		this.line = line;
		this.ch = ch;
		this.href = href;
	}
	RuntimeError.prototype = new Error();


	///////////////////////////////////////////////////////////
	// members
	//

	// background "thread": run a chunk of code for about
	// 15 milliseconds, then trigger the next chunk
	this.chunk = function()
	{
		if (this.stop)
		{
			this.thread = false;
			this.stop = false;
			return;
		}

		if (this.status == "waiting")
		{
			let t = (new Date()).getTime();
			if (t >= this.waittime)
			{
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status == "running")
		{
			let start = (new Date()).getTime();
			while (this.background && (new Date()).getTime() - start < 14 && this.status == "running")
			{
				this.exec_step();

				if (this.halt)
				{
					if (this.halt.call(this))
					{
						this.halt = null;
						this.background = false;
						if (this.service.statechanged) this.service.statechanged(true);
					}
				}
			}
			if (this.background && !this.timerEventEnqueued)
			{
				this.timerEventEnqueued = this.enqueueEvent("timer", {"type": this.program.types[module.typeid_null], "value": {"b": null}});
			}
		}

		let context = this;
		setTimeout(function() { context.chunk(); }, 1);
	};

	// reset the program state, set the instruction pointer to its start
	this.reset = function()
	{
		this.halt = null;
		this.background = false;
		this.stack = [{
				"pe": [this.program],       // array(n), program elements
				"ip": [0],                  // array(n), indices used by step functions
				"temporaries": [],          // stack of intermediate "return values"
				"variables": []             // array, global variables
			}];
		this.status = "running";
		if (this.service.statechanged) this.service.statechanged(false);
	};

	// start or continue running the program in the background
	this.run = function()
	{
		if (this.status == "running" || this.status == "waiting")
		{
			this.background = true;
			if (this.service.statechanged) this.service.statechanged(false);
		}
	};

	// interrupt the program in the background, keep the state
	this.interrupt = function()
	{
		this.halt = null;
		this.background = false;
		if (this.service.statechanged) this.service.statechanged(true);
	};

	// raise a fatal runtime error, preserve the interpreter state for debugging
	this.error = function(path, args)
	{
		if (args === undefined) args = [];

		let message = module.composeError(path, args);
		let href = "#/errors" + path;
		let line = null, ch = null;
		for (let j=this.stack.length-1; j>=0; j--)
		{
			let frame = this.stack[j];
			for (let i=frame.pe.length-1; i>=0; i--)
			{
				let pe = frame.pe[i];
				if (pe && pe.where)
				{
					line = pe.where.line;
					ch = pe.where.ch;
					break;
				}
			}
			if (line !== null) break;
		}
		throw new RuntimeError(message, line, ch, href);
	};

	// make the interpreter wait (at least) for the given number of milliseconds
	this.wait = function(milliseconds)
	{
		if (this.status != "running") return false;
		this.waittime = (new Date()).getTime() + milliseconds;
		this.status = "waiting";
		if (this.service.statechanged) this.service.statechanged(false);
		return true;
	};

	// Progress the instruction pointer to the next executable function.
	// This must happen after every call to pe.step(). The process
	// advances the instruction pointer. Furthermore, it may involve
	// returning from one or more functions. The number of functions
	// left in this way is returned.
	function progress()
	{
		let start = this.stack.length;

		// progress the instruction pointer
		while (this.stack.length > 0)
		{
			let frame = this.stack[this.stack.length - 1];
			if (frame.ip.length == 0)
			{
				// implicit return from a function
				module.assert(frame.temporaries.length == 0, "[Interpreter.progress] temporaries stack is not empty at the end of the function scope");
				this.stack.pop();
				if (this.stack.length == 0)
				{
					// end of the program
					break;
				}
				else
				{
					// implicit return null
					let frame = this.stack[this.stack.length - 1];
					frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
				}
			}
			else
			{
				frame.ip[frame.ip.length - 1]++;
				break;
			}
		}

		return start - this.stack.length;
	}

	// Run the next command. Steps are considered atomic from the
	// perspective of the debugger, although under the hood they are of
	// course not.
	// The first step moves the instruction pointer to the first
	// non-trivial command. All further steps execute one command and
	// then move the instruction pointer to the next non-trivial
	// command.
	this.exec_step = function()
	{
		if (this.status == "waiting")
		{
			let t = (new Date()).getTime();
			if (t >= this.waittime)
			{
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status != "running") return;

		if (this.stack.length == 0)
		{
			this.status = "finished";
			if (this.service.statechanged) this.service.statechanged(true);
			return;
		}

		if (this.hook)
		{
			try
			{
				this.hook.call(this);
			}
			catch (ex)
			{
				console.log("[Interpreter] ignoring exception thrown by the hook");
			}
		}

		try
		{
			// execute a step that returns true
			let frame = this.stack[this.stack.length - 1];
			let pe = frame.pe[frame.pe.length - 1];
			if (frame.ip.length != 1 || frame.ip[0] != 0)
			{
				// execute the current program element, and demand that it "did something"
				let done = pe.step.call(this);
				module.assert(done, "[Interpreter.exec_step] 'done' expected");

				// progress the instruction pointer
				this.stepcounter++;
				progress.call(this);
			}

			// execute trivial steps
			while (this.stack.length > 0 && (this.status == "running" || this.status == "waiting"))
			{
				let frame = this.stack[this.stack.length - 1];
				let pe = frame.pe[frame.pe.length - 1];

				// check whether we are done
				let done = pe.sim.call(this);
				if (done) break;

				// execute the current program element
				done = pe.step.call(this);
				module.assert(! done, "[Interpreter.exec_step] 'not done' expected");

				// progress the instruction pointer
				progress.call(this);
			}
		}
		catch (ex)
		{
			if (ex instanceof RuntimeError)
			{
				this.halt = null;
				this.background = false;
				if (this.service.message)
				{
					this.service.message("runtime error in line " + ex.line + ": " + ex.message, ex.line, ex.ch, ex.href);
				}
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
			}
			else
			{
				// report an internal interpreter error
				console.log("internal runtime error!");
				console.log(ex);
				let msg = module.composeError("/internal/ie-2", [module.ex2string(ex)]);
				if (this.service.message) this.service.message(msg, null, null, "#/errors/internal/ie-2");

				this.halt = null;
				this.background = false;
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
			}
		}
	};

	this.step_into = function()
	{
		if (this.background || this.status != "running") return;
		this.halt = function() { return true; };
		this.background = true;
	};

	// move to a different line in the same function
	this.step_over = function()
	{
		if (this.background || this.status != "running") return;
		let len = this.stack.length;
		if (len == 0)
		{
			this.halt = function() { return true; };
			this.background = true;
			return;
		}
		let frame = this.stack[len - 1];
		let pe = frame.pe[frame.pe.length - 1];
		let line = pe.where ? pe.where.line : -1;
		this.halt = (function(len, line) { return function()
				{
					if (this.stack.length < len) return true;
					else if (this.stack.length == len)
					{
						let pe = frame.pe[frame.pe.length - 1];
						let ln = pe.where ? pe.where.line : -1;
						if (ln != line) return true;
					}
					return false;
				}; })(len, line);
		this.background = true;
	};

	// move out of the current function
	this.step_out = function()
	{
		if (this.background || this.status != "running") return;
		let len = this.stack.length;
		if (len == 0) this.halt = function() { return true; };
		else this.halt = (function(len) { return function()
				{
					return (this.stack.length < len);
				}; })(len);
		this.background = true;
	};

	// request to stop the background thread
	this.stopthread = function()
	{
		this.stop = true;
	};
	
	// event limits
	this.timerEventEnqueued = false;

	// queue an event
	// returns true when event got enqueued, false otherwise
	this.enqueueEvent = function(type, event)
	{
		if (this.eventmode) this.eventqueue.push({"type": type, "event": event});
		return this.eventmode;
	};

	// define an event handler - there can only be one :)
	this.setEventHandler = function(type, handler)
	{
		if (handler.type.id == module.typeid_null) delete this.eventhandler[type];
		else if (module.isDerivedFrom(handler.type, module.typeid_function))
		{
			if (handler.value.b.func.params.length != 1) throw new RuntimeError("[Interpreter.setEventHandler] handler must be a function with exactly one parameter");
			this.eventhandler[type] = handler.value.b;
		}
		else throw new RuntimeError("[Interpreter.setEventHandler] invalid argument");
	};

	// Request to define a number of breakpoints. This function should
	// be called right after construction of the interpreter. It returns
	// the line numbers where actual breakpoints are set as the keys of
	// a dictionary. Some breakpoints may get merged this way. If all
	// provided breakpoints are in legal positions then the function
	// returns null.
	this.defineBreakpoints = function(lines)
	{
		let pos = {};
		let changed = false;

		// loop over all positions
		for (let i=0; i<lines.length; i++)
		{
			let line = lines[i];
			if (this.program.breakpoints.hasOwnProperty(line))
			{
				// position is valid
				pos[line] = true;
			}
			else
			{
				// find a valid position if possible
				changed = true;
				while (line <= this.program.lines)
				{
					if (this.program.breakpoints.hasOwnProperty(line))
					{
						pos[line] = true;
						break;
					}
					else line++;
				}
			}
		}

		// enable/disable break points
		for (let key in this.program.breakpoints)
		{
			if (pos.hasOwnProperty(key)) this.program.breakpoints[key].set();
			else this.program.breakpoints[key].clear();
		}

		// return the result
		if (changed) return pos;
		else return null;
	}

	// Request to toggle a breakpoint. Not every line is a valid break
	// point position, therefore the function returns the following:
	// {
	//   line: number,       // position of the toggle
	//   active: boolean,    // is the breakpoint active after the action?
	// }
	// It no valid position can be found then the function returns null.
	this.toggleBreakpoint = function(line)
	{
		while (line <= this.program.lines)
		{
			if (this.program.breakpoints.hasOwnProperty(line))
			{
				this.program.breakpoints[line].toggle();
				return { "line": line, "active": this.program.breakpoints[line].active() };
			}
			else line++;
		}
		return null;
	}

	// start the background thread
	this.thread = true;
	let context = this;
	setTimeout(function() { context.chunk(); }, 1);
};


return module;
}());
"use strict";

///////////////////////////////////////////////////////////
// simplistic GUI framework
//


let tgui = (function() {
let module = {};


// global mapping of hotkeys to handlers
let hotkeys = {};
let hotkeyElement = null;

// normalize the hotkey to lowercase
module.normalizeHotkey = function(hotkey)
{
	let pos = hotkey.lastIndexOf('-') + 1;
	let key = hotkey.substr(pos);
	if (key.length == 1) return hotkey.substr(0, pos) + key.toLowerCase();
	else return hotkey;
}

// return true if the hotkey is in use
module.hotkey = function(hotkey)
{ return (hotkeys.hasOwnProperty(module.normalizeHotkey(hotkey))); }

// register a new hotkey, check for conflicts
// * hotkey: key name, possibly preceded by a dash-separated list of the modifiers "shift", "control", and "alt", in this order; example: "shift-alt-a"
// * handler: event handler function with an "event" parameter
module.setHotkey = function(hotkey, handler)
{
	if (! hotkey) return;
	hotkey = module.normalizeHotkey(hotkey);
	if (hotkeys.hasOwnProperty(hotkey)) throw "[tgui.setHotkey] hotkey conflict; key '" + hotkey + "' is already taken";
	hotkeys[hotkey] = handler;
}

// remove a hotkey
module.releaseHotkey = function(hotkey)
{
	if (! hotkey) return;
	delete hotkeys[module.normalizeHotkey(hotkey)];
}

// remove all hotkeys
module.releaseAllHotkeys = function()
{ hotkeys = {}; }

// enable hotkeys only if the given element is visible
module.setHotkeyElement = function(element)
{ hotkeyElement = element; }

module.setTooltip = function(element, tooltip = "", direction="left")
{
	let tt = element.getElementsByClassName("tgui-tooltip");
	for (let i=0; i<tt.length; i++) element.removeChild(tt[i]);
	createControl("div", {"parent": element, "text": tooltip}, "tgui tgui-tooltip tgui-tooltip-" + direction);
}

// Create a new DOM element, acting as the control's main DOM element.
// Several standard properties of the description are honored.
function createControl(type, description, classname)
{
	let element = document.createElement(type);

	// set classes
	if (classname) element.className = classname;

	// set ID
	if (description.hasOwnProperty("id")) element.id = description.id;

	// add properties to the element
	if (description.hasOwnProperty("properties"))
	{
		for (let key in description.properties)
		{
			if (! description.properties.hasOwnProperty(key)) continue;
			element[key] = description.properties[key];
		}
	}

	// apply styles
	if (description.hasOwnProperty("style"))
	{
		for (let key in description.style)
		{
			if (! description.style.hasOwnProperty(key)) continue;
			element.style[key] = description.style[key];
		}
	}

	// add inner text
	if (description.hasOwnProperty("text")) element.appendChild(document.createTextNode(description.text));

	// add inner html
	if (description.hasOwnProperty("html")) element.innerHTML += description.html;

	// add a tooltip
	if (description.hasOwnProperty("tooltip")) module.setTooltip(element, description.tooltip);
	else if (description.hasOwnProperty("tooltip-right")) module.setTooltip(element, description["tooltip-right"], "right");

	// add a click handler
	if (description.hasOwnProperty("click"))
	{
		element.addEventListener("click", description.click);
		element.style.cursor = "pointer";
	}

	// add arbitrary event handlers
	if (description.hasOwnProperty("event"))
	{
		for (let key in description.event)
		{
			if (! description.event.hasOwnProperty(key)) continue;
			element.addEventListener(key, description.event[key]);
		}
	}

	// add to a parent
	if (description.parent) description.parent.appendChild(element);

	return element;
}

// Remove all children from an element.
module.clearElement = function(element)
{
	element.innerHTML = "";
}

// Simplistic convenience function for creating an HTML text node.
// Fields of the description object:
// * parent - optionl DOM object containing the element
// * text - optional text to be added to the element as a text node
module.createText = function(text, parent = null)
{
	let element = document.createTextNode(text);
	if (parent) parent.appendChild(element);
	return element;
}

// Convenience function for creating an HTML element.
// Fields of the description object:
// * type - HTML element type name, e.g., "div"
// * classname - optional CSS class
// * properties - dictionary of properties of the HTML document (should not be used for id, className, and innerHTML)
// * style - dictionary of CSS styles
// * parent - optionl DOM object containing the element
// * id - optional ID of the element
// * tooltip - optional tooltip
// * text - optional text to be added to the element as a text node
// * html - optional innerHTML to be added after the text
// * click - optional click handler
module.createElement = function(description)
{
	return createControl(description.type, description, description.classname);
}

// Create a new label. A label is a control with easily configurable
// read-only content.
// Fields of the #description object:
// * text - for text buttons, default: ""
// * style - dictionary of CSS styles
// * parent - optionl DOM object containing the control
// * id - optional ID of the control
// * tooltip - optional tooltip
module.createLabel = function(description)
{
	// main DOM element with styling
	let element = createControl("span", description, "tgui tgui-control tgui-label");

	// return the control
	return {
			"dom": element,
			"setText": function(text)
					{
						module.clearElement(this.dom);
						module.createText(text, this.dom);
						return this;
					},
			"setBackground": function(color)
					{
						this.dom.style.background = color;
						return this;
					},
		};
};

// Create a new button.
// Fields of the #description object:
// * click - event handler, taking an "event" argument
// * text - for text buttons, default: ""
// * draw - for canvas buttons, function with a "canvas" argument that draws the button face
// * width - for canvas buttons, canvas width
// * height - for canvas buttons, canvas height
// * classname - optional CSS class
// * style - optional dictionary of CSS styles
// * parent - optionl DOM object containing the control
// * id - optional ID of the control
// * tooltip - optional tooltip
// * hotkey - optional hotkey, see setHotkey
module.createButton = function(description)
{
	// main DOM element with styling
	let element = createControl("button", description, "tgui tgui-control tgui-button" + (description.text ? "-text" : "-canvas") + (description.classname ? (" " + description.classname) : ""));

	// create the actual content
	if (description.draw)
	{
		// fancy canvas button
		let canvas = module.createElement({"type": "canvas", "parent": element, "classname": "tgui", "style": {"display": "block"}});
		canvas.width = description.width;
		canvas.height = description.height;
		description.draw(canvas);
	}
	else if (! description.text) throw "[tgui.createButton] either .text or .draw are required";

	// add a hotkey
	module.setHotkey(description.hotkey, description.click);

	// return the control
	return { "dom": element };
};

// Create a new tree control.
// The tree content is determined by the function description.info.
// On calling
//   control.update(info)
// the tree is rebuilt from scratch. The function
//   control.value(element)
// returns the value identifying a given tree element.
//
// fields of the #description object:
// * style - dictionary of CSS styles
// * parent - optionl DOM object containing the control
// * id - optional ID of the control
// * tooltip - optional tooltip
// * info - function describing the tree content, see below
// * nodeclick - click handler for tree nodes, signature function(event, value, id)
//
// The parameter info is a function taking a value and the ID of the
// node. It is expected to return an object with three properties:
// * element: DOM element representing the value
// * opened: boolean indicating whether the tree node should be opened or closed by default
// * children: array of child values
// * ids: array of unique string IDs of the child nodes
// * visible: optional boolean, if true then scroll to make this element visible
module.createTreeControl = function(description)
{
	// control with styling
	let element = createControl("div", description, "tgui tgui-control tgui-tree");

	// create the root state, serving as a dummy holding the tree's top-level nodes
	// state object layout:
	// .value: JS value represented by the tree node, or null for the root node
	// .id: unique string ID of the node
	// .open: boolean indicating whether the node is "opened" or "closed", relevant only if .children.length > 0
	// .expanded: boolean indicating whether the node's children have already been created
	// .main: main DOM element, a table, can be null for the root node
	// .childrows: array of table rows of the child elements
	// .toggle: DOM element for toggling open/close
	// .element: DOM element for the value
	// .children: array of sub-states
	let state = {
			"value": null,
			"id": "",
			"open": true,
			"expanded": false,
			"main": element,
			"childrows": [],
			"toggle": null,
			"element": null,
			"children": [],
		};

	// create the control object
	let control = {
			"dom": element,
			"info": description.info ? description.info : null,
			"update": null,
			"value": null,
			"state": state,
			"visible": null,
			"numberOfNodes": 0,
			"nodeclick": description.nodeclick ? description.nodeclick : null,
			"element2state": {},
			"id2state": {},
			"id2open": {},             // preserved across updates
		};

	// recursively add elements to the reverse lookup
	function updateLookup(state)
	{
		if (state.element) this.element2state[state.element.id] = state;
		if (state.id) this.id2state[state.id] = state;
		for (let i=0; i<state.children.length; i++) updateLookup.call(this, state.children[i]);
	}

	// As part of createInternalTree, this function creates the actual
	// child nodes. It is called when the node is opened for the first
	// time, or if the node is created in the opened state.
	function createChildNodes(state, result)
	{
		for (let i=0; i<result.children.length; i++)
		{
			let child = result.children[i];
			let child_id = result.ids[i];
			let substate = createInternalTree.call(this, child, child_id);
			state.children.push(substate);
			if (state.value === null)
			{
				state.main.appendChild(substate.main);
			}
			else
			{
				let tr = module.createElement({"type": "tr", "parent": state.main, "classname": "tgui"});
				let td1 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-toggle"});
				let td2 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-content"});
				td2.appendChild(substate.main);
				state.childrows.push(tr);
			}
		}
		state.expanded = true;
	}

	// Recursively create a new state and DOM tree.
	// The function assumes that #this is the control.
	function createInternalTree(value, id)
	{
		let result = this.info(value, id);

		// create a new state
		let state = {
				"value": value,
				"id": id,
				"open": (value === null) ? true : (this.id2open.hasOwnProperty(id) ? this.id2open[id]: result.opened),
				"expanded": false,
				"main": (value === null) ? this.dom : module.createElement({"type": "table", "classname": "tgui tgui-tree-main"}),
				"childrows": [],
				"toggle": (value === null) ? null : module.createElement({"type": "div", "classname": "tgui tgui-tree-toggle"}),
				"element": (value === null) ? null : result.element,
				"children": [],
			};

		if (value !== null)
		{
			// create a table cell for the element
			let tr = module.createElement({"type": "tr", "parent": state.main, "classname": "tgui"});
			let td1 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-toggle"});
			let td2 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-content"});
			td1.appendChild(state.toggle);
			td2.appendChild(state.element);

			state.element.id = "tgui.id." + (Math.random() + 1);
			state.element.className = "tgui tgui-tree-element";

			// initialize the toggle button
			let s = ((result.children.length > 0) ? (state.open ? "\u25be" : "\u25b8") : "\u25ab");
			state.toggle.innerHTML = s;

			// make the toggle button clickable
			if (result.children.length > 0)
			{
				td1.style.cursor = "pointer";
				td1.addEventListener("click", function(event)
						{
							let element = this.parentNode.childNodes[1].childNodes[0];
							let state = control.element2state[element.id];
							if (state.open)
							{
								// close the node, i.e., add the tgui-hidden class to all child rows
								for (let i=0; i<state.childrows.length; i++) state.childrows[i].className = "tgui tgui-hidden";
							}
							else
							{
								// expand the tree
								if (! state.expanded)
								{
									let result = control.info(state.value, state.id);
									createChildNodes.call(control, state, result);
									updateLookup.call(control, state);
								}

								// open the node, i.e., remove the tgui-hidden class from all child rows
								for (let i=0; i<state.childrows.length; i++) state.childrows[i].className = "tgui";
							}
							state.open = ! state.open;
							control.id2open[state.id] = state.open;
							let s = (state.open ? "\u25be" : "\u25b8");
							state.toggle.innerHTML = s;
						});
			}

			// make the element clickable
			if (this.nodeclick)
			{
				td2.style.cursor = "pointer";
				td2.addEventListener("click", function(event)
						{
							let element = this.childNodes[0];
							let state = control.element2state[element.id];
							control.nodeclick(event, state.value, state.id);
						});
			}
		}

		// honor the "visible" property
		if (result.visible) this.visible = this.numberOfNodes;

		// count this node
		this.numberOfNodes++;

		// process the children and recurse
		if (state.open)
		{
			createChildNodes.call(this, state, result);
			state.expanded = true;
		}

		return state;
	};

	// Update the tree to represent new data, i.e., replace the stored
	// info function and apply the new function to obtain the tree.
	control.update = function(info)
	{
		// store the new info object for later use
		this.info = info;
		this.visible = null;
		this.numberOfNodes = 0;

		// clear the root DOM element
		module.clearElement(this.dom);

		// update the state and the DOM based on info
		this.state = createInternalTree.call(this, null, "");

		// prepare reverse lookup
		this.element2state = {};
		this.id2state = {};
		updateLookup.call(this, this.state);

		// scroll a specific element into view
		if (this.visible !== null)
		{
			window.setTimeout(function()
					{
						let h = control.dom.clientHeight;
						let y = control.dom.scrollHeight * control.visible / control.numberOfNodes;
						if (y < control.dom.scrollTop + 0.1 * h || y >= control.dom.scrollTop + 0.9 * h)
						{
							y -= 0.666 * h;
							if (y < 0) y = 0;
							control.dom.scrollTop = y;
						}
					}, 0);
		}
	};

	// obtain the value corresponding to a DOM element
	control.value = function(element)
	{
		if (! this.element2state.hasOwnProperty(element.id)) throw "[tgui TreeControl.get] unknown element";
		return this.element2state[element.id].value;
	}

	// initialize the control
	if (control.info) control.update.call(control, control.info);

	return control;
};


///////////////////////////////////////////////////////////
// Panels are window-like areas that can be arranged in
// various ways.
//

// lists of panels
module.panels = [];
module.panels_left = [];
module.panels_right = [];
module.panels_float = [];
module.panel_max = null;

// panel containers
module.panelcontainer = null;
module.iconcontainer = null;

// load panel arrangement data from local storage
function loadPanelData(title)
{
	let str = localStorage.getItem("tgui.panels");
	if (str)
	{
		let paneldata = JSON.parse(str);
		if (paneldata.hasOwnProperty(title)) return paneldata[title];
	}
	return null;
}

// save panel arrangement data to local storage
function savePanelData()
{
	let paneldata = {};
	for (let i=0; i<module.panels.length; i++)
	{
		let p = module.panels[i];
		let d = {};
		d.state = p.state;
		d.fallbackState = p.fallbackState;
		d.pos = p.pos;
		d.size = p.size;
		d.floatingpos = p.floatingpos;
		d.floatingsize = p.floatingsize;
		d.dockedheight = p.dockedheight;
		paneldata[p.title] = d;
	}
	localStorage.setItem("tgui.panels", JSON.stringify(paneldata));
}

module.preparePanels = function(panelcontainer, iconcontainer)
{
	module.panelcontainer = panelcontainer;
	module.iconcontainer = iconcontainer;
}

// arrange a set of docked panels so that they fit
function arrangeDocked(list, left, width, height)
{
	if (list.length == 0) return;

	// compute desired vertical space
	const min_h = 100;
	let desired = 0;
	for (let i=0; i<list.length; i++)
	{
		let p = list[i];
		desired += Math.max(min_h, p.dockedheight);
	}

	// assign vertical space
	let totalSlack = desired - min_h * list.length;
	let targetSlack = height - min_h * list.length;
	let y = 0;
	for (let i=0; i<list.length; i++)
	{
		let p = list[i];
		let oldslack = p.dockedheight - min_h;
		let newslack = (totalSlack == 0)
				? Math.round(targetSlack / list.length)
				: Math.round(targetSlack * oldslack / totalSlack);
		if (newslack < 0) newslack = 0;
		let new_h = min_h + newslack;

		p.dom.style.left = left + "px";
		p.dom.style.top = y + "px";
		p.dom.style.width = width + "px";
		p.dom.style.height = new_h + "px";
		p.pos = [left, y];					
		if (p.size[0] != width || p.size[1] != new_h)
		{
			p.size = [width, new_h];
			p.dockedheight = new_h;
			p.onResize(width, Math.max(0, new_h - 22));
		}
		p.onArrange();
		y += new_h;
	}
};

// keep track of the current size
let currentW = 0, currentH = 0;

// arrange all panels so that they fit
function arrange()
{
	if (! module.panelcontainer) return;
	let w = module.panelcontainer.clientWidth;
	let h = module.panelcontainer.clientHeight;
	currentW = w;
	currentH = h;
	let w60 = Math.round(0.6 * w);
	let w40 = w - w60;

	if (module.panel_max)
	{
		let p = module.panel_max;
		let size = [w, h];
		let sc = (size[0] != p.size[0] || size[1] != p.size[1]);
		p.pos = [0, 0];
		if (sc)
		{
			p.size = size;
			p.dom.style.width = size[0] + "px";
			p.dom.style.height = size[1] + "px";
			p.onResize(p.size[0], Math.max(0, p.size[1] - 22));
		}
		p.onArrange();
	}

	for (let i=0; i<module.panels_float.length; i++)
	{
		let p = module.panels_float[i];
		let px = p.floatingpos[0];
		let py = p.floatingpos[1];
		let pw = p.floatingsize[0];
		let ph = p.floatingsize[1];
		if (pw >= w) { px = 0; pw = w; }
		else if (px + pw >= w) { px = w - pw; }
		if (ph >= h) { py = 0; ph = h; }
		else if (py + ph >= h) { py = h - ph; }
		if (px != p.pos[0] || py != p.pos[1])
		{
			p.dom.style.left = px + "px";
			p.dom.style.top = py + "px";
			p.pos = [px, py];
			p.floatingpos = p.pos;
		}
		if (pw != p.size[0] || ph != p.size[1])
		{
			p.size = [pw, ph];
			p.floatingsize = p.size;
			p.dom.style.width = pw + "px";
			p.dom.style.height = ph + "px";
			p.onResize(pw, Math.max(0, ph - 22));
		}
		p.onArrange();
	}

	arrangeDocked(module.panels_left, 0, (module.panels_right.length > 0) ? w60 : w, h);
	arrangeDocked(module.panels_right, (module.panels_left.length > 0) ? w60 : 0, (module.panels_left.length > 0) ? w40 : w, h);

	savePanelData();
}

let arrangerequest = (new Date()).getTime();
module.arrangePanels = function()
{
	let now = (new Date()).getTime();
	if (now < arrangerequest) return;
	let delta = 200;   // limit arrange frequency to 5Hz
	arrangerequest = (new Date()).getTime() + delta;
	window.setTimeout(function()
			{
				arrangerequest -= delta;
				arrange();
			}, delta);
}

// Monitor size changes and propagate them to the panels.
// We use two mechanisms: window size changes and container
// size changes. The latter are polled in a 5Hz loop.
window.addEventListener("resize", module.arrangePanels);
function poll()
{
	if (module.panelcontainer)
	{
		let w = module.panelcontainer.clientWidth;
		let h = module.panelcontainer.clientHeight;
		if (w != 0 && h != 0)
		{
			if (w != currentW || h != currentH)
			{
				module.arrangePanels();
			}
		}
	}
	window.setTimeout(poll, 200);
}
window.setTimeout(poll, 1000);   // start with a short delay


// Create a panel.
// The description object has the following fields:
// title: text in the title bar
// floatingpos: [left, top] floating position
// floatingsize: [width, height] size in floating state
// dockedheight: height in left or right state
// state: current state, i.e., "left", "right", "max", "float", "icon", "disabled"
// icondraw: draw function for the icon representing the panel in "icon" mode
// onResize: callback function(width, height) on resize
// onArrange: callback function() on arranging (possible position/size change)
let free_panel_id = 1;
module.createPanel = function(description)
{
	// load state from local storage if possible
	let stored = loadPanelData(description.title);
	if (stored)
	{
		// load position and size
		description.pos = stored.pos;
		description.size = stored.size;
		description.floatingpos = stored.floatingpos;
		description.floatingsize = stored.floatingsize;
		description.dockedheight = stored.dockedheight;
		description.state = stored.state;
		description.fallbackState = stored.fallbackState;
	}
	else
	{
		// define position and size
		if (! description.hasOwnProperty("floatingpos")) description.floatingpos = [100 + 20*module.panels.length, 100 + 10*module.panels.length];
		if (! description.hasOwnProperty("floatingsize")) description.floatingsize = [400, 250];
		if (! description.hasOwnProperty("dockedheight")) description.dockedheight = 200;
		if (! description.hasOwnProperty("state")) description.state = "float";
		if (! description.hasOwnProperty("fallbackState")) description.fallbackState = "float";
		description.pos = description.floatingpos;
		description.size = description.floatingsize;
		if (description.hasOwnProperty("dockedheight") && (description.state == "left" || description.state == "right")) description.size[1] = description.dockedheight;
	}

	// create the main objects
	let control = Object.assign({}, description);
	control.state = "disabled";
	let panel = tgui.createElement({"type": "div", "classname": "tgui-panel-container"});
	control.dom = panel;
	control.panelID = free_panel_id;
	free_panel_id++;

	// register the panel
	module.panels.push(control);

	// create the title bar with buttons
	control.titlebar_container = tgui.createElement({
				"type": "div",
				"parent": panel,
				"classname": "tgui tgui-panel-titlebar",
		});
	control.titlebar = tgui.createElement({
				"type": "span",
				"parent": control.titlebar_container,
				"text": control.title,
		});

	control.button_icon = tgui.createButton({
				"click": function (event) { control.dock("icon"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 2.5;
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.moveTo( 3, 15);
					ctx.lineTo(15, 15);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "minimize",
			});
	control.button_float = tgui.createButton({
				"click": function () { control.dock("float"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#666";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(4.5, 5.5, 9, 8);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(4.5, 5.5, 9, 8);
					ctx.fillStyle = "#00c";
					ctx.fillRect(4.5, 5.5, 9, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "floating",
			});
	control.button_max = tgui.createButton({
				"click": function () { control.dock("max"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.fillStyle = "#fff";
					ctx.fillRect(2.5, 2.5, 13, 13);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.fillStyle = "#00c";
					ctx.fillRect(2.5, 2.5, 13, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "maximize",
			});
	control.button_right = tgui.createButton({
				"click": function () { control.dock("right"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#666";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(8.5, 2.5, 7, 13);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(8.5, 2.5, 7, 13);
					ctx.fillStyle = "#00c";
					ctx.fillRect(8.5, 2.5, 7, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "dock right",
			});
	control.button_left = tgui.createButton({
				"click": function () { control.dock("left"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#666";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(2.5, 2.5, 7, 13);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 7, 13);
					ctx.fillStyle = "#00c";
					ctx.fillRect(2.5, 2.5, 7, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "dock left",
			});

	// create the content div
	control.content = tgui.createElement({"type": "div", parent: panel, "classname": "tgui tgui-panel-content"});

	if (! control.hasOwnProperty("icondraw")) control.icondraw = function(canvas)
			{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.fillStyle = "#fff";
					ctx.fillRect(2.5, 2.5, 15, 15);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 15, 15);
					ctx.fillStyle = "#00c";
					ctx.fillRect(2.5, 2.5, 15, 3);
					ctx.stroke();
			};

	// create the icon
	control.icon = tgui.createButton({
				"click": function() { control.dock(control.fallbackState); return false; },
				"width": 20,
				"height": 20,
				"draw": control.icondraw,
				"tooltip": control.title,
				"style": {
						"margin": 0,
						"padding": 0,
						"width": "22px",
						"height": "22px",
					},
			});
	let icon = control.icon.dom;

	if (! control.hasOwnProperty("onResize")) control.onResize = function(w, h) { };
	if (! control.hasOwnProperty("onArrange")) control.onArrange = function() { };

	// dock function for changing docking state
	control.dock = function(state, create = false)
			{
				if (! create)
				{
					if (state == this.state) return;

					// disable
					interact(panel).draggable(false).resizable(false);
					panel.style.zIndex = 0;
					if (icon.parentNode) icon.parentNode.removeChild(icon);
					if (panel.parentNode) panel.parentNode.removeChild(panel);
					if (this.state == "left") module.panels_left.splice(module.panels_left.indexOf(this), 1);
					if (this.state == "right") module.panels_right.splice(module.panels_right.indexOf(this), 1);
					if (this.state == "float") module.panels_float.splice(module.panels_float.indexOf(this), 1);
					if (module.panel_max == this) module.panel_max = null;
				}

				// enable again
				if (state == "left")
				{
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = 0;
					panel.style.top = 0;
					panel.style.width = "60%";
					panel.style.height = "100%";
					panel.style.zIndex = 0;
					this.fallbackState = state;
					module.panels_left.push(this);
					module.panels_left.sort(function(lhs, rhs){return lhs.panelID - rhs.panelID;});
					let self = this;
					interact(panel).resizable({
							"edges": { bottom: true },
							"restrictEdges": { "outer": "parent", "endOnly": false },
							"restrictSize": { "min": { "height": 100 }, },
							"inertia": false,
							"onmove": function (event)
									{
										if (module.panels_left[module.panels_left.length - 1] == self) return;
										control.dockedheight = event.rect.height;
										let w = module.panelcontainer.clientWidth;
										let h = module.panelcontainer.clientHeight;
										let w60 = Math.round(0.6 * w);
										arrangeDocked(module.panels_left, 0, w60, h);
										savePanelData();
									},
						});
				}
				else if (state == "right")
				{
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = "60%";
					panel.style.top = 0;
					panel.style.width = "40%";
					panel.style.height = "100%";
					panel.style.zIndex = 0;
					this.fallbackState = state;
					module.panels_right.push(this);
					module.panels_right.sort(function(lhs, rhs){return lhs.panelID - rhs.panelID;});
					let self = this;
					interact(panel).resizable({
							"edges": { bottom: true },
							"restrictEdges": { "outer": "parent", "endOnly": false },
							"restrictSize": { "min": { "height": 100 }, },
							"inertia": false,
							"onmove": function (event)
									{
										if (module.panels_right[module.panels_right.length - 1] == self) return;
										control.dockedheight = event.rect.height;
										let w = module.panelcontainer.clientWidth;
										let h = module.panelcontainer.clientHeight;
										let w60 = Math.round(0.6 * w);
										let w40 = w - w60;
										arrangeDocked(module.panels_right, w60, w40, h);
										savePanelData();
									},
						});
				}
				else if (state == "max")
				{
					if (module.panel_max) module.panel_max.dock(module.panel_max.fallbackState);
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = 0;
					panel.style.top = 0;
					panel.style.width = "100%";
					panel.style.height = "100%";
					panel.style.zIndex = 2;
					module.panel_max = this;
				}
				else if (state == "float")
				{
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = this.pos[0] + "px";
					panel.style.top = this.pos[1] + "px";
					panel.style.width = this.size[0] + "px";
					panel.style.height = this.size[1] + "px";
					panel.style.zIndex = 1;
					this.fallbackState = state;
					module.panels_float.push(this);
					interact(panel).draggable({
							"inertia": true,
							"allowFrom": ".tgui-panel-titlebar",
							"restrict": {
									"restriction": "parent",
									"endOnly": false,
									"elementRect": { top: 0, left: 0, bottom: 1, right: 1 }
								},
							"autoScroll": false,
							"onmove": function (event)
									{
										let x = control.pos[0] + event.pageX - event.x0;
										let y = control.pos[1] + event.pageY - event.y0;
										panel.style.left = x + "px";
										panel.style.top = y + "px";
									},
							"onend": function (event)
									{
										let x = control.pos[0] + event.pageX - event.x0;
										let y = control.pos[1] + event.pageY - event.y0;
										panel.style.left = x + "px";
										panel.style.top = y + "px";
										control.pos = [x, y];
										if (control.state == "float") control.floatingpos = [x, y];
									},
						}).resizable({
							"edges": { right: true, bottom: true },
							"restrictEdges": { "outer": "parent", "endOnly": false },
							"restrictSize": { "min": { "width": 250, "height": 100 }, },
							"inertia": false,
							"onmove": function (event)
									{
										let w = event.rect.width;
										let h = event.rect.height;
										panel.style.width = w + "px";
										panel.style.height = h + "px";
										control.size = [w, h];
										if (control.state == "float") control.floatingsize = [w, h];
										else if (control.state == "left" || control.state == "right") control.dockedheight = h;
										control.onResize(w, Math.max(0, h - 22));
									},
						});
				}
				else if (state == "icon")
				{
					if (control.state != "disabled") control.fallbackState = control.state;
					module.iconcontainer.appendChild(control.icon.dom);
				}
				else if (state == "disabled")
				{ }
				else throw "[createPanel] invalid state: " + state;
				control.state = state;

				module.arrangePanels();

				if (create) control.onResize(control.size[0], Math.max(0, control.size[1] - 22));
			};

	if (description.state != "disabled") control.dock(description.state, true);

	return control;
}


let separator = module.createElement({
		"type": "div",
		"id": "tgui-separator",
		"classname": "tgui tgui-separator",
		"click": function(event)
				{
					// TODO: close popups, but not modal dialogs...?
					return false;   // important: consume clicks
				},
		});
let modal = [];

// Show a (newly created) element as a modal dialog. Modal dialogs can
// be stacked. The element should not have been added to a parent yet.
// It has "fixed" positioning and hence is expected to have been styled
// with top, left, width, and height.
module.startModal = function(element)
{
	if (modal.length == 0)
	{
		// activate the separator
		document.body.appendChild(separator);
	}
	else
	{
		// move the old topmost dialog below the separator
		modal[modal.length - 1].style.zIndex = 0;
	}

	// add the new modal dialog
	element.style.display = "block";
	element.style.zIndex = 100;
	element.className += " tgui tgui-modal";
	document.body.appendChild(element);
	modal.push(element);
}

// Discard the topmost modal dialog.
module.stopModal = function()
{
	if (modal.length == 0) throw "[tgui.stopModel] no modal dialog to close";

	// remove the topmost modal element
	let element = modal.pop();
	document.body.removeChild(element);

	// remove the separator after the last modal dialog was closed
	if (modal.length == 0) document.body.removeChild(separator);
	else modal[modal.length - 1].style.zIndex = 100;
}

// check whether an element is currently visible to the user
// https://stackoverflow.com/a/7557433
function isElementInViewport(element)
{
	var rect = element.getBoundingClientRect();
	if (rect.width == 0 || rect.height == 0) return false;
	if (rect.top >= (window.innerHeight || document.documentElement.clientHeight)) return false;
	if (rect.bottom < 0) return false;
	if (rect.left >= (window.innerWidth || document.documentElement.clientWidth)) return false;
	if (rect.right < 0) return false;
	return true;
}

// register a global key listener for hotkey events
document.addEventListener("keydown", function(event)
{
	if (modal.length > 0)
	{
		// redirect key events to the topmost dialog
		let dlg = modal[modal.length - 1];
		if (dlg.hasOwnProperty("onKeyDown"))
		{
			dlg.onKeyDown(event);
			return false;
		}
	}
	else
	{
		if (hotkeyElement && ! isElementInViewport(hotkeyElement)) return true;

		// compose the key code string
		let key = event.key;
		if (event.altKey) key = "alt-" + key;
		if (event.ctrlKey) key = "control-" + key;
		if (event.shiftKey) key = "shift-" + key;
		key = module.normalizeHotkey(key);

		// handle global hotkeys
		if (hotkeys.hasOwnProperty(key))
		{
			hotkeys[key](event);
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	}
	return true;
});


return module;
}());
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).interact=e()}}(function(){var e=function(t){var n;return function(e){return n||t(n={exports:{},parent:e},n.exports),n.exports}},f=e(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Scope=t.ActionName=void 0;var i=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt),n=u(N),r=u(R),o=u(S),a=u(pt),s=u(me),l=u(E({}));function u(e){return e&&e.__esModule?e:{default:e}}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function d(e,t,n){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=p(e)););return e}(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(n):o.value}})(e,t,n||e)}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function g(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e,t,n){return t&&h(e.prototype,t),n&&h(e,n),e}var m,b=i.win,w=i.browser,O=i.raf,x=i.Signals,P=i.events;(t.ActionName=m)||(t.ActionName=m={});var _=function(){function e(){var t=this;g(this,e),this.signals=new x,this.browser=w,this.events=P,this.utils=i,this.defaults=i.clone(r.default),this.Eventable=o.default,this.actions={names:[],methodDict:{},eventTypes:[]},this.InteractEvent=s.default,this.interactables=new j(this),this.documents=[],this._plugins=[],this._pluginMap={},this.onWindowUnload=function(e){return t.removeDocument(e.target)};var n=this;this.Interactable=function(e){function t(){return g(this,t),f(this,p(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(t,a.default),y(t,[{key:"set",value:function(e){return d(p(t.prototype),"set",this).call(this,e),n.interactables.signals.fire("set",{options:e,interactable:this}),this}},{key:"unset",value:function(){d(p(t.prototype),"unset",this).call(this),n.interactables.signals.fire("unset",{interactable:this})}},{key:"_defaults",get:function(){return n.defaults}}]),t}()}return y(e,[{key:"init",value:function(e){return M(this,e)}},{key:"pluginIsInstalled",value:function(e){return this._pluginMap[e.id]||-1!==this._plugins.indexOf(e)}},{key:"usePlugin",value:function(e,t){return this.pluginIsInstalled(e)||(e.install(this,t),this._plugins.push(e),e.id&&(this._pluginMap[e.id]=e)),this}},{key:"addDocument",value:function(e,t){if(-1!==this.getDocIndex(e))return!1;var n=b.getWindow(e);t=t?i.extend({},t):{},this.documents.push({doc:e,options:t}),P.documents.push(e),e!==this.document&&P.add(n,"unload",this.onWindowUnload),this.signals.fire("add-document",{doc:e,window:n,scope:this,options:t})}},{key:"removeDocument",value:function(e){var t=this.getDocIndex(e),n=b.getWindow(e),r=this.documents[t].options;P.remove(n,"unload",this.onWindowUnload),this.documents.splice(t,1),P.documents.splice(t,1),this.signals.fire("remove-document",{doc:e,window:n,scope:this,options:r})}},{key:"getDocIndex",value:function(e){for(var t=0;t<this.documents.length;t++)if(this.documents[t].doc===e)return t;return-1}},{key:"getDocOptions",value:function(e){var t=this.getDocIndex(e);return-1===t?null:this.documents[t].options}},{key:"now",value:function(){return(this.window.Date||Date).now()}}]),e}();t.Scope=_;var j=function(){function t(e){g(this,t),this.scope=e,this.signals=new i.Signals,this.list=[]}return y(t,[{key:"new",value:function(e,t){t=i.extend(t||{},{actions:this.scope.actions});var n=new this.scope.Interactable(e,t,this.scope.document);return this.scope.addDocument(n._doc),this.list.push(n),this.signals.fire("new",{target:e,options:t,interactable:n,win:this.scope._win}),n}},{key:"indexOfElement",value:function(e,t){t=t||this.scope.document;for(var n=this.list,r=0;r<n.length;r++){var o=n[r];if(o.target===e&&o._context===t)return r}return-1}},{key:"get",value:function(e,t,n){var r=this.list[this.indexOfElement(e,t&&t.context)];return r&&(i.is.string(e)||n||r.inContext(e))?r:null}},{key:"forEachMatch",value:function(e,t){for(var n=0;n<this.list.length;n++){var r=this.list[n],o=void 0;if((i.is.string(r.target)?i.is.element(e)&&i.dom.matchesSelector(e,r.target):e===r.target)&&r.inContext(e)&&(o=t(r)),void 0!==o)return o}}}]),t}();function M(e,t){return b.init(t),n.default.init(t),w.init(t),O.init(t),P.init(t),l.default.install(e),e.document=t.document,e.window=t,e}}),E=e(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.newInteraction=i,t.default=void 0;var x=n(q),s=n(N),c=n(Ue),o=n(rn),P=n(Re),l=n(Dt),u=n(m({}));function n(e){return e&&e.__esModule?e:{default:e}}function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var g=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer","windowBlur"];function h(w,O){return function(e){var t=O.interactions.list,n=P.default.getPointerType(e),r=_(P.default.getEventTargets(e),2),o=r[0],i=r[1],a=[];if(x.default.supportsTouch&&/touch/.test(e.type)){O.prevTouchTime=O.now();for(var s=0;s<e.changedTouches.length;s++){var l=e.changedTouches[s],u={pointer:l,pointerId:P.default.getPointerId(l),pointerType:n,eventType:e.type,eventTarget:o,curEventTarget:i,scope:O},c=j(u);a.push([u.pointer,u.eventTarget,u.curEventTarget,c])}}else{var f=!1;if(!x.default.supportsPointerEvent&&/mouse/.test(e.type)){for(var d=0;d<t.length&&!f;d++)f="mouse"!==t[d].pointerType&&t[d].pointerIsDown;f=f||O.now()-O.prevTouchTime<500||0===e.timeStamp}if(!f){var p={pointer:e,pointerId:P.default.getPointerId(e),pointerType:n,eventType:e.type,curEventTarget:i,eventTarget:o,scope:O},v=j(p);a.push([p.pointer,p.eventTarget,p.curEventTarget,v])}}for(var g=0;g<a.length;g++){var h=_(a[g],4),y=h[0],m=h[1],b=h[2];h[3][w](y,e,m,b)}}}function j(e){var t=e.pointerType,n=e.scope,r={interaction:o.default.search(e),searchDetails:e};return n.interactions.signals.fire("find",r),r.interaction||i({pointerType:t},n)}function i(e,t){var n=t.interactions.new(e);return t.interactions.list.push(n),n}function y(e,t){var n=e.doc,r=e.scope,o=e.options,i=r.interactions.eventMap,a=0===t.indexOf("add")?c.default.add:c.default.remove;for(var s in r.browser.isIOS&&!o.events&&(o.events={passive:!1}),c.default.delegatedEvents)a(n,s,c.default.delegateListener),a(n,s,c.default.delegateUseCapture,!0);var l=o&&o.events;for(var u in i)a(n,u,i[u],l)}var a={id:"core/interactions",install:function(n){for(var t=new l.default,e={},r=0;r<g.length;r++){var o=g[r];e[o]=h(o,n)}var i=x.default.pEventTypes,a={};s.default.PointerEvent?(a[i.down]=e.pointerDown,a[i.move]=e.pointerMove,a[i.up]=e.pointerUp,a[i.cancel]=e.pointerUp):(a.mousedown=e.pointerDown,a.mousemove=e.pointerMove,a.mouseup=e.pointerUp,a.touchstart=e.pointerDown,a.touchmove=e.pointerMove,a.touchend=e.pointerUp,a.touchcancel=e.pointerUp),a.blur=function(e){for(var t=0;t<n.interactions.list.length;t++)n.interactions.list[t].documentBlur(e)},n.signals.on("add-document",y),n.signals.on("remove-document",y),n.prevTouchTime=0,n.Interaction=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),d(this,p(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(t,u.default),function(e,t,n){t&&f(e.prototype,t),n&&f(e,n)}(t,[{key:"_now",value:function(){return n.now()}},{key:"pointerMoveTolerance",get:function(){return n.interactions.pointerMoveTolerance},set:function(e){n.interactions.pointerMoveTolerance=e}}]),t}(),n.interactions={signals:t,list:[],new:function(e){return e.signals=t,new n.Interaction(e)},listeners:e,eventMap:a,pointerMoveTolerance:1}},onDocSignal:y,doOnInteractions:h,newInteraction:i,methodNames:g};t.default=a}),m=e(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"PointerInfo",{enumerable:!0,get:function(){return l.default}}),t.default=t.Interaction=void 0;var n,s=r(Yt),i=r(me),l=(n=Et)&&n.__esModule?n:{default:n},o=f({});function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var u=function(){function r(e){var t=e.pointerType,n=e.signals;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),this.interactable=null,this.element=null,this.prepared={name:null,axis:null,edges:null},this.pointers=[],this.downEvent=null,this.downPointer={},this._latestPointer={pointer:null,event:null,eventTarget:null},this.prevEvent=null,this.pointerIsDown=!1,this.pointerWasMoved=!1,this._interacting=!1,this._ending=!1,this.simulation=null,this.doMove=s.warnOnce(function(e){this.move(e)},"The interaction.doMove() method has been renamed to interaction.move()"),this.coords={start:s.pointer.newCoords(),prev:s.pointer.newCoords(),cur:s.pointer.newCoords(),delta:s.pointer.newCoords(),velocity:s.pointer.newCoords()},this._signals=n,this.pointerType=t,this._signals.fire("new",{interaction:this})}return function(e,t,n){t&&a(e.prototype,t),n&&a(e,n)}(r,[{key:"pointerDown",value:function(e,t,n){var r=this.updatePointer(e,t,n,!0);this._signals.fire("down",{pointer:e,event:t,eventTarget:n,pointerIndex:r,interaction:this})}},{key:"start",value:function(e,t,n){return!(this.interacting()||!this.pointerIsDown||this.pointers.length<(e.name===o.ActionName.Gesture?2:1)||!t.options[e.name].enabled)&&(s.copyAction(this.prepared,e),this.interactable=t,this.element=n,this.rect=t.getRect(n),this.edges=this.prepared.edges,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:i.EventPhase.Start}),this._interacting)}},{key:"pointerMove",value:function(e,t,n){this.simulation||(this.updatePointer(e,t,n,!1),s.pointer.setCoords(this.coords.cur,this.pointers.map(function(e){return e.pointer}),this._now()));var r,o,i=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(r=this.coords.cur.client.x-this.coords.start.client.x,o=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=s.hypot(r,o)>this.pointerMoveTolerance);var a={pointer:e,pointerIndex:this.getPointerIndex(e),event:t,eventTarget:n,dx:r,dy:o,duplicate:i,interaction:this};i||(s.pointer.setCoordDeltas(this.coords.delta,this.coords.prev,this.coords.cur),s.pointer.setCoordVelocity(this.coords.velocity,this.coords.delta)),this._signals.fire("move",a),i||(this.interacting()&&this.move(a),this.pointerWasMoved&&s.pointer.copyCoords(this.coords.prev,this.coords.cur))}},{key:"move",value:function(e){(e=s.extend({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this,noBefore:!1},e||{})).phase=i.EventPhase.Move,this._doPhase(e)}},{key:"pointerUp",value:function(e,t,n,r){var o=this.getPointerIndex(e);-1===o&&(o=this.updatePointer(e,t,n,!1)),this._signals.fire(/cancel$/i.test(t.type)?"cancel":"up",{pointer:e,pointerIndex:o,event:t,eventTarget:n,curEventTarget:r,interaction:this}),this.simulation||this.end(t),this.pointerIsDown=!1,this.removePointer(e,t)}},{key:"documentBlur",value:function(e){this.end(e),this._signals.fire("blur",{event:e,interaction:this})}},{key:"end",value:function(e){var t;this._ending=!0,e=e||this._latestPointer.event,this.interacting()&&(t=this._doPhase({event:e,interaction:this,phase:i.EventPhase.End})),!(this._ending=!1)===t&&this.stop()}},{key:"currentAction",value:function(){return this._interacting?this.prepared.name:null}},{key:"interacting",value:function(){return this._interacting}},{key:"stop",value:function(){this._signals.fire("stop",{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this.prepared.name=this.prevEvent=null}},{key:"getPointerIndex",value:function(e){var t=s.pointer.getPointerId(e);return"mouse"===this.pointerType||"pen"===this.pointerType?this.pointers.length-1:s.arr.findIndex(this.pointers,function(e){return e.id===t})}},{key:"getPointerInfo",value:function(e){return this.pointers[this.getPointerIndex(e)]}},{key:"updatePointer",value:function(e,t,n,r){var o=s.pointer.getPointerId(e),i=this.getPointerIndex(e),a=this.pointers[i];return r=!1!==r&&(r||/(down|start)$/i.test(t.type)),a?a.pointer=e:(a=new l.default(o,e,t,null,null),i=this.pointers.length,this.pointers.push(a)),r&&(this.pointerIsDown=!0,this.interacting()||(s.pointer.setCoords(this.coords.start,this.pointers.map(function(e){return e.pointer}),this._now()),s.pointer.copyCoords(this.coords.cur,this.coords.start),s.pointer.copyCoords(this.coords.prev,this.coords.start),s.pointer.pointerExtend(this.downPointer,e),this.downEvent=t,a.downTime=this.coords.cur.timeStamp,a.downTarget=n,this.pointerWasMoved=!1)),this._updateLatestPointer(e,t,n),this._signals.fire("update-pointer",{pointer:e,event:t,eventTarget:n,down:r,pointerInfo:a,pointerIndex:i,interaction:this}),i}},{key:"removePointer",value:function(e,t){var n=this.getPointerIndex(e);if(-1!==n){var r=this.pointers[n];this._signals.fire("remove-pointer",{pointer:e,event:t,pointerIndex:n,pointerInfo:r,interaction:this}),this.pointers.splice(n,1)}}},{key:"_updateLatestPointer",value:function(e,t,n){this._latestPointer.pointer=e,this._latestPointer.event=t,this._latestPointer.eventTarget=n}},{key:"_createPreparedEvent",value:function(e,t,n,r){var o=this.prepared.name;return new i.default(this,e,o,t,this.element,null,n,r)}},{key:"_fireEvent",value:function(e){this.interactable.fire(e),(!this.prevEvent||e.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=e)}},{key:"_doPhase",value:function(e){var t=e.event,n=e.phase,r=e.preEnd,o=e.type;if(!e.noBefore&&!1===this._signals.fire("before-action-".concat(n),e))return!1;var i=e.iEvent=this._createPreparedEvent(t,n,r,o),a=this.rect;if(a){var s=this.edges||this.prepared.edges||{left:!0,right:!0,top:!0,bottom:!0};s.top&&(a.top+=i.delta.y),s.bottom&&(a.bottom+=i.delta.y),s.left&&(a.left+=i.delta.x),s.right&&(a.right+=i.delta.x)}return this._signals.fire("action-".concat(n),e),this._fireEvent(i),this._signals.fire("after-action-".concat(n),e),!0}},{key:"_now",value:function(){return Date.now()}},{key:"pointerMoveTolerance",get:function(){return 1}}]),r}(),c=t.Interaction=u;t.default=c}),s={};function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];e.push(r)}return e}function n(e,t){for(var n=0;n<e.length;n++)if(t(e[n],n,e))return n;return-1}Object.defineProperty(s,"__esModule",{value:!0}),s.contains=function(e,t){return-1!==e.indexOf(t)},s.remove=function(e,t){return e.splice(e.indexOf(t),1)},s.merge=t,s.from=function(e){return t([],e)},s.findIndex=n,s.find=function(e,t){return e[n(e,t)]},s.some=function(e,t){return-1!==n(e,t)};var r={};Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e,t){for(var n in t)e[n]=t[n];return e};var o={};Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;o.default=function(e){return!(!e||!e.Window)&&e instanceof e.Window};var a={};Object.defineProperty(a,"__esModule",{value:!0}),a.init=c,a.getWindow=d,a.default=void 0;var i,l=(i=o)&&i.__esModule?i:{default:i};var u={realWindow:void 0,window:void 0,getWindow:d,init:c};function c(e){var t=(u.realWindow=e).document.createTextNode("");t.ownerDocument!==e.document&&"function"==typeof e.wrap&&e.wrap(t)===t&&(e=e.wrap(e)),u.window=e}function d(e){return(0,l.default)(e)?e:(e.ownerDocument||e).defaultView||u.window}"undefined"==typeof window?(u.window=void 0,u.realWindow=void 0):c(window),u.init=c;var p=u;a.default=p;var v={};Object.defineProperty(v,"__esModule",{value:!0}),v.array=v.plainObject=v.element=v.string=v.bool=v.number=v.func=v.object=v.docFrag=v.window=void 0;var g=y(o),h=y(a);function y(e){return e&&e.__esModule?e:{default:e}}function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}v.window=function(e){return e===h.default.window||(0,g.default)(e)};v.docFrag=function(e){return w(e)&&11===e.nodeType};var w=function(e){return!!e&&"object"===b(e)};v.object=w;var O=function(e){return"function"==typeof e};v.func=O;v.number=function(e){return"number"==typeof e};v.bool=function(e){return"boolean"==typeof e};v.string=function(e){return"string"==typeof e};v.element=function(e){if(!e||"object"!==b(e))return!1;var t=h.default.getWindow(e)||h.default.window;return/object|function/.test(b(t.Element))?e instanceof t.Element:1===e.nodeType&&"string"==typeof e.nodeName};v.plainObject=function(e){return w(e)&&!!e.constructor&&/function Object\b/.test(e.constructor.toString())};v.array=function(e){return w(e)&&void 0!==e.length&&O(e.splice)};var x={};Object.defineProperty(x,"__esModule",{value:!0}),x.default=function n(t,r,o){o=o||{};j.string(t)&&-1!==t.search(" ")&&(t=M(t));if(j.array(t))return t.reduce(function(e,t){return(0,_.default)(e,n(t,r,o))},o);j.object(t)&&(r=t,t="");if(j.func(r))o[t]=o[t]||[],o[t].push(r);else if(j.array(r))for(var e=0;e<r.length;e++){var i=r[e];n(t,i,o)}else if(j.object(r))for(var a in r){var s=M(a).map(function(e){return"".concat(t).concat(e)});n(s,r[a],o)}return o};var P,_=(P=r)&&P.__esModule?P:{default:P},j=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v);function M(e){return e.trim().split(/ +/)}var S={};Object.defineProperty(S,"__esModule",{value:!0}),S.default=void 0;var T=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(s),D=z(r),k=z(x);function z(e){return e&&e.__esModule?e:{default:e}}function I(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function A(e,t){for(var n=0;n<t.length;n++){var r=t[n];if(e.immediatePropagationStopped)break;r(e)}}var C=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.types={},this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.options=(0,D.default)({},e||{})}return function(e,t,n){t&&I(e.prototype,t),n&&I(e,n)}(t,[{key:"fire",value:function(e){var t,n=this.global;(t=this.types[e.type])&&A(e,t),!e.propagationStopped&&n&&(t=n[e.type])&&A(e,t)}},{key:"on",value:function(e,t){var n=(0,k.default)(e,t);for(e in n)this.types[e]=T.merge(this.types[e]||[],n[e])}},{key:"off",value:function(e,t){var n=(0,k.default)(e,t);for(e in n){var r=this.types[e];if(r&&r.length)for(var o=0;o<n[e].length;o++){var i=n[e][o],a=r.indexOf(i);-1!==a&&r.splice(a,1)}}}}]),t}();S.default=C;var R={};Object.defineProperty(R,"__esModule",{value:!0}),R.default=R.defaults=void 0;var X={base:{preventDefault:"auto",deltaSource:"page"},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}},Y=R.defaults=X;R.default=Y;var N={};Object.defineProperty(N,"__esModule",{value:!0}),N.default=void 0;var F={init:function(e){var t=e;F.document=t.document,F.DocumentFragment=t.DocumentFragment||L,F.SVGElement=t.SVGElement||L,F.SVGSVGElement=t.SVGSVGElement||L,F.SVGElementInstance=t.SVGElementInstance||L,F.Element=t.Element||L,F.HTMLElement=t.HTMLElement||F.Element,F.Event=t.Event,F.Touch=t.Touch||L,F.PointerEvent=t.PointerEvent||t.MSPointerEvent},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function L(){}var W=F;N.default=W;var q={};Object.defineProperty(q,"__esModule",{value:!0}),q.default=void 0;var V=B(N),G=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v),U=B(a);function B(e){return e&&e.__esModule?e:{default:e}}var H={init:function(e){var t=V.default.Element,n=U.default.window.navigator;H.supportsTouch="ontouchstart"in e||G.func(e.DocumentTouch)&&V.default.document instanceof e.DocumentTouch,H.supportsPointerEvent=!1!==n.pointerEnabled&&!!V.default.PointerEvent,H.isIOS=/iP(hone|od|ad)/.test(n.platform),H.isIOS7=/iP(hone|od|ad)/.test(n.platform)&&/OS 7[^\d]/.test(n.appVersion),H.isIe9=/MSIE 9/.test(n.userAgent),H.isOperaMobile="Opera"===n.appName&&H.supportsTouch&&/Presto/.test(n.userAgent),H.prefixedMatchesSelector="matches"in t.prototype?"matches":"webkitMatchesSelector"in t.prototype?"webkitMatchesSelector":"mozMatchesSelector"in t.prototype?"mozMatchesSelector":"oMatchesSelector"in t.prototype?"oMatchesSelector":"msMatchesSelector",H.pEventTypes=H.supportsPointerEvent?V.default.PointerEvent===e.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,H.wheelEvent="onmousewheel"in V.default.document?"mousewheel":"wheel"},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null};var $=H;q.default=$;var K={};Object.defineProperty(K,"__esModule",{value:!0}),K.nodeContains=function(e,t){for(;t;){if(t===e)return!0;t=t.parentNode}return!1},K.closest=function(e,t){for(;Z.element(e);){if(re(e,t))return e;e=ne(e)}return null},K.parentNode=ne,K.matchesSelector=re,K.indexOfDeepestElement=function(e){var t,n,r,o,i,a=[],s=[],l=e[0],u=l?0:-1;for(o=1;o<e.length;o++)if((t=e[o])&&t!==l)if(l){if(t.parentNode!==t.ownerDocument)if(l.parentNode!==t.ownerDocument){if(!a.length)for(n=l;n.parentNode&&n.parentNode!==n.ownerDocument;)a.unshift(n),n=n.parentNode;if(l instanceof J.default.HTMLElement&&t instanceof J.default.SVGElement&&!(t instanceof J.default.SVGSVGElement)){if(t===l.parentNode)continue;n=t.ownerSVGElement}else n=t;for(s=[];n.parentNode!==n.ownerDocument;)s.unshift(n),n=n.parentNode;for(i=0;s[i]&&s[i]===a[i];)i++;var c=[s[i-1],s[i],a[i]];for(r=c[0].lastChild;r;){if(r===c[1]){l=t,u=o,a=[];break}if(r===c[2])break;r=r.previousSibling}}else l=t,u=o}else l=t,u=o;return u},K.matchesUpTo=function(e,t,n){for(;Z.element(e);){if(re(e,t))return!0;if((e=ne(e))===n)return re(e,t)}return!1},K.getActualElement=function(e){return e instanceof J.default.SVGElementInstance?e.correspondingUseElement:e},K.getScrollXY=oe,K.getElementClientRect=ie,K.getElementRect=function(e){var t=ie(e);if(!Q.default.isIOS7&&t){var n=oe(ee.default.getWindow(e));t.left+=n.x,t.right+=n.x,t.top+=n.y,t.bottom+=n.y}return t},K.getPath=function(e){var t=[];for(;e;)t.push(e),e=ne(e);return t},K.trySelector=function(e){return!!Z.string(e)&&(J.default.document.querySelector(e),!0)};var Q=te(q),J=te(N),Z=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v),ee=te(a);function te(e){return e&&e.__esModule?e:{default:e}}function ne(e){var t=e.parentNode;if(Z.docFrag(t)){for(;(t=t.host)&&Z.docFrag(t););return t}return t}function re(e,t){return ee.default.window!==ee.default.realWindow&&(t=t.replace(/\/deep\//g," ")),e[Q.default.prefixedMatchesSelector](t)}function oe(e){return{x:(e=e||ee.default.window).scrollX||e.document.documentElement.scrollLeft,y:e.scrollY||e.document.documentElement.scrollTop}}function ie(e){var t=e instanceof J.default.SVGElement?e.getBoundingClientRect():e.getClientRects()[0];return t&&{left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width||t.right-t.left,height:t.height||t.bottom-t.top}}var ae={};Object.defineProperty(ae,"__esModule",{value:!0}),ae.getStringOptionResult=ce,ae.resolveRectLike=fe,ae.rectToXY=de,ae.xywhToTlbr=pe,ae.tlbrToXywh=ve,ae.default=void 0;var se,le=(se=r)&&se.__esModule?se:{default:se},ue=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v);function ce(e,t,n){return ue.string(e)?e="parent"===e?(0,K.parentNode)(n):"self"===e?t.getRect(n):(0,K.closest)(n,e):null}function fe(e,t,n,r){return e=ce(e,t,n)||e,ue.func(e)&&(e=e.apply(null,r)),ue.element(e)&&(e=(0,K.getElementRect)(e)),e}function de(e){return e&&{x:"x"in e?e.x:e.left,y:"y"in e?e.y:e.top}}function pe(e){return!e||"left"in e&&"top"in e||((e=(0,le.default)({},e)).left=e.x||0,e.top=e.y||0,e.right=e.right||e.left+e.width,e.bottom=e.bottom||e.top+e.height),e}function ve(e){return!e||"x"in e&&"y"in e||((e=(0,le.default)({},e)).x=e.left||0,e.y=e.top||0,e.width=e.width||e.right-e.x,e.height=e.height||e.bottom-e.y),e}var ge={getStringOptionResult:ce,resolveRectLike:fe,rectToXY:de,xywhToTlbr:pe,tlbrToXywh:ve};ae.default=ge;var he={};Object.defineProperty(he,"__esModule",{value:!0}),he.default=function(e,t,n){var r=e.options[n],o=r&&r.origin||e.options.origin,i=(0,ae.resolveRectLike)(o,e,t,[e&&t]);return(0,ae.rectToXY)(i)||{x:0,y:0}};var ye={};Object.defineProperty(ye,"__esModule",{value:!0}),ye.default=void 0;ye.default=function(e,t){return Math.sqrt(e*e+t*t)};var me={};Object.defineProperty(me,"__esModule",{value:!0}),me.default=me.InteractEvent=me.EventPhase=void 0;var be,we,Oe=je(r),xe=je(he),Pe=je(ye),_e=je(R);function je(e){return e&&e.__esModule?e:{default:e}}function Me(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}me.EventPhase=be,(we=be||(me.EventPhase=be={})).Start="start",we.Move="move",we.End="end",we._NONE="";var Ee=function(){function g(e,t,n,r,o,i,a,s){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,g),this.immediatePropagationStopped=!1,this.propagationStopped=!1,o=o||e.element;var l=e.interactable,u=(l&&l.options||_e.default).deltaSource,c=(0,xe.default)(l,o,n),f="start"===r,d="end"===r,p=f?this:e.prevEvent,v=f?e.coords.start:d?{page:p.page,client:p.client,timeStamp:e.coords.cur.timeStamp}:e.coords.cur;this.page=(0,Oe.default)({},v.page),this.client=(0,Oe.default)({},v.client),this.timeStamp=v.timeStamp,d||(this.page.x-=c.x,this.page.y-=c.y,this.client.x-=c.x,this.client.y-=c.y),this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.button=t.button,this.buttons=t.buttons,this.target=o,this.currentTarget=o,this.relatedTarget=i||null,this.preEnd=a,this.type=s||n+(r||""),this.interaction=e,this.interactable=l,this.t0=f?e.pointers[e.pointers.length-1].downTime:p.t0,this.x0=e.coords.start.page.x-c.x,this.y0=e.coords.start.page.y-c.y,this.clientX0=e.coords.start.client.x-c.x,this.clientY0=e.coords.start.client.y-c.y,this.delta=f||d?{x:0,y:0}:{x:this[u].x-p[u].x,y:this[u].y-p[u].y},this.dt=e.coords.delta.timeStamp,this.duration=this.timeStamp-this.t0,this.velocity=(0,Oe.default)({},e.coords.velocity[u]),this.speed=(0,Pe.default)(this.velocity.x,this.velocity.y),this.swipe=d||"inertiastart"===r?this.getSwipe():null}return function(e,t,n){t&&Me(e.prototype,t),n&&Me(e,n)}(g,[{key:"getSwipe",value:function(){var e=this.interaction;if(e.prevEvent.speed<600||150<this.timeStamp-e.prevEvent.timeStamp)return null;var t=180*Math.atan2(e.prevEvent.velocityY,e.prevEvent.velocityX)/Math.PI;t<0&&(t+=360);var n=112.5<=t&&t<247.5,r=202.5<=t&&t<337.5;return{up:r,down:!r&&22.5<=t&&t<157.5,left:n,right:!n&&(292.5<=t||t<67.5),angle:t,speed:e.prevEvent.speed,velocity:{x:e.prevEvent.velocityX,y:e.prevEvent.velocityY}}}},{key:"preventDefault",value:function(){}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"pageX",get:function(){return this.page.x},set:function(e){this.page.x=e}},{key:"pageY",get:function(){return this.page.y},set:function(e){this.page.y=e}},{key:"clientX",get:function(){return this.client.x},set:function(e){this.client.x=e}},{key:"clientY",get:function(){return this.client.y},set:function(e){this.client.y=e}},{key:"dx",get:function(){return this.delta.x},set:function(e){this.delta.x=e}},{key:"dy",get:function(){return this.delta.y},set:function(e){this.delta.y=e}},{key:"velocityX",get:function(){return this.velocity.x},set:function(e){this.velocity.x=e}},{key:"velocityY",get:function(){return this.velocity.y},set:function(e){this.velocity.y=e}}]),g}(),Se=me.InteractEvent=Ee;me.default=Se;var Te={};Object.defineProperty(Te,"__esModule",{value:!0}),Te.default=function e(t){var n={};for(var r in t){var o=t[r];ke.plainObject(o)?n[r]=e(o):ke.array(o)?n[r]=De.from(o):n[r]=o}return n};var De=ze(s),ke=ze(v);function ze(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}var Ie={};function Ae(e,t){for(var n in t){var r=Ae.prefixedPropREs,o=!1;for(var i in r)if(0===n.indexOf(i)&&r[i].test(n)){o=!0;break}o||"function"==typeof t[n]||(e[n]=t[n])}return e}Object.defineProperty(Ie,"__esModule",{value:!0}),Ie.pointerExtend=Ae,Ie.default=void 0,Ae.prefixedPropREs={webkit:/(Movement[XY]|Radius[XY]|RotationAngle|Force)$/};var Ce=Ae;Ie.default=Ce;var Re={};Object.defineProperty(Re,"__esModule",{value:!0}),Re.default=void 0;var Xe=qe(q),Ye=qe(N),Ne=We(K),Fe=qe(ye),Le=We(v);function We(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function qe(e){return e&&e.__esModule?e:{default:e}}var Ve={copyCoords:function(e,t){e.page=e.page||{},e.page.x=t.page.x,e.page.y=t.page.y,e.client=e.client||{},e.client.x=t.client.x,e.client.y=t.client.y,e.timeStamp=t.timeStamp},setCoordDeltas:function(e,t,n){e.page.x=n.page.x-t.page.x,e.page.y=n.page.y-t.page.y,e.client.x=n.client.x-t.client.x,e.client.y=n.client.y-t.client.y,e.timeStamp=n.timeStamp-t.timeStamp},setCoordVelocity:function(e,t){var n=Math.max(t.timeStamp/1e3,.001);e.page.x=t.page.x/n,e.page.y=t.page.y/n,e.client.x=t.client.x/n,e.client.y=t.client.y/n,e.timeStamp=n},isNativePointer:function(e){return e instanceof Ye.default.Event||e instanceof Ye.default.Touch},getXY:function(e,t,n){return e=e||"page",(n=n||{}).x=t[e+"X"],n.y=t[e+"Y"],n},getPageXY:function(e,t){return t=t||{x:0,y:0},Xe.default.isOperaMobile&&Ve.isNativePointer(e)?(Ve.getXY("screen",e,t),t.x+=window.scrollX,t.y+=window.scrollY):Ve.getXY("page",e,t),t},getClientXY:function(e,t){return t=t||{},Xe.default.isOperaMobile&&Ve.isNativePointer(e)?Ve.getXY("screen",e,t):Ve.getXY("client",e,t),t},getPointerId:function(e){return Le.number(e.pointerId)?e.pointerId:e.identifier},setCoords:function(e,t,n){var r=1<t.length?Ve.pointerAverage(t):t[0],o={};Ve.getPageXY(r,o),e.page.x=o.x,e.page.y=o.y,Ve.getClientXY(r,o),e.client.x=o.x,e.client.y=o.y,e.timeStamp=n},pointerExtend:qe(Ie).default,getTouchPair:function(e){var t=[];return Le.array(e)?(t[0]=e[0],t[1]=e[1]):"touchend"===e.type?1===e.touches.length?(t[0]=e.touches[0],t[1]=e.changedTouches[0]):0===e.touches.length&&(t[0]=e.changedTouches[0],t[1]=e.changedTouches[1]):(t[0]=e.touches[0],t[1]=e.touches[1]),t},pointerAverage:function(e){for(var t={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<e.length;n++){var r=e[n];for(var o in t)t[o]+=r[o]}for(var i in t)t[i]/=e.length;return t},touchBBox:function(e){if(!(e.length||e.touches&&1<e.touches.length))return null;var t=Ve.getTouchPair(e),n=Math.min(t[0].pageX,t[1].pageX),r=Math.min(t[0].pageY,t[1].pageY),o=Math.max(t[0].pageX,t[1].pageX),i=Math.max(t[0].pageY,t[1].pageY);return{x:n,y:r,left:n,top:r,right:o,bottom:i,width:o-n,height:i-r}},touchDistance:function(e,t){var n=t+"X",r=t+"Y",o=Ve.getTouchPair(e),i=o[0][n]-o[1][n],a=o[0][r]-o[1][r];return(0,Fe.default)(i,a)},touchAngle:function(e,t){var n=t+"X",r=t+"Y",o=Ve.getTouchPair(e),i=o[1][n]-o[0][n],a=o[1][r]-o[0][r];return 180*Math.atan2(a,i)/Math.PI},getPointerType:function(e){return Le.string(e.pointerType)?e.pointerType:Le.number(e.pointerType)?[void 0,void 0,"touch","pen","mouse"][e.pointerType]:/touch/.test(e.type)||e instanceof Ye.default.Touch?"touch":"mouse"},getEventTargets:function(e){var t=Le.func(e.composedPath)?e.composedPath():e.path;return[Ne.getActualElement(t?t[0]:e.target),Ne.getActualElement(e.currentTarget)]},newCoords:function(){return{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},coordsToEvent:function(e){return{coords:e,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target}}}},Ge=Ve;Re.default=Ge;var Ue={};Object.defineProperty(Ue,"__esModule",{value:!0}),Ue.default=Ue.FakeEvent=void 0;var Be=Je(K),He=Je(v),$e=Qe(Ie),Ke=Qe(Re);function Qe(e){return e&&e.__esModule?e:{default:e}}function Je(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function Ze(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function et(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var tt=[],nt=[],rt={},ot=[];function it(e,t,n,r){var o=ut(r),i=tt.indexOf(e),a=nt[i];a||(a={events:{},typeCount:0},i=tt.push(e)-1,nt.push(a)),a.events[t]||(a.events[t]=[],a.typeCount++),(0,s.contains)(a.events[t],n)||(e.addEventListener(t,n,ft.supportsOptions?o:!!o.capture),a.events[t].push(n))}function at(e,t,n,r){var o=ut(r),i=tt.indexOf(e),a=nt[i];if(a&&a.events)if("all"!==t){if(a.events[t]){var s=a.events[t].length;if("all"===n){for(var l=0;l<s;l++)at(e,t,a.events[t][l],o);return}for(var u=0;u<s;u++)if(a.events[t][u]===n){e.removeEventListener(t,n,ft.supportsOptions?o:!!o.capture),a.events[t].splice(u,1);break}a.events[t]&&0===a.events[t].length&&(a.events[t]=null,a.typeCount--)}a.typeCount||(nt.splice(i,1),tt.splice(i,1))}else for(t in a.events)a.events.hasOwnProperty(t)&&at(e,t,"all")}function st(e,t){for(var n=ut(t),r=new ct(e),o=rt[e.type],i=et(Ke.default.getEventTargets(e),1)[0],a=i;He.element(a);){for(var s=0;s<o.selectors.length;s++){var l=o.selectors[s],u=o.contexts[s];if(Be.matchesSelector(a,l)&&Be.nodeContains(u,i)&&Be.nodeContains(u,a)){var c=o.listeners[s];r.currentTarget=a;for(var f=0;f<c.length;f++){var d=et(c[f],3),p=d[0],v=d[1],g=d[2];v===!!n.capture&&g===n.passive&&p(r)}}}a=Be.parentNode(a)}}function lt(e){return st.call(this,e,!0)}function ut(e){return He.object(e)?e:{capture:e}}var ct=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.originalEvent=e,(0,$e.default)(this,e)}return function(e,t,n){t&&Ze(e.prototype,t),n&&Ze(e,n)}(t,[{key:"preventOriginalDefault",value:function(){this.originalEvent.preventDefault()}},{key:"stopPropagation",value:function(){this.originalEvent.stopPropagation()}},{key:"stopImmediatePropagation",value:function(){this.originalEvent.stopImmediatePropagation()}}]),t}();Ue.FakeEvent=ct;var ft={add:it,remove:at,addDelegate:function(e,t,n,r,o){var i=ut(o);if(!rt[n]){rt[n]={contexts:[],listeners:[],selectors:[]};for(var a=0;a<ot.length;a++){var s=ot[a];it(s,n,st),it(s,n,lt,!0)}}var l,u=rt[n];for(l=u.selectors.length-1;0<=l&&(u.selectors[l]!==e||u.contexts[l]!==t);l--);-1===l&&(l=u.selectors.length,u.selectors.push(e),u.contexts.push(t),u.listeners.push([])),u.listeners[l].push([r,!!i.capture,i.passive])},removeDelegate:function(e,t,n,r,o){var i,a=ut(o),s=rt[n],l=!1;if(s)for(i=s.selectors.length-1;0<=i;i--)if(s.selectors[i]===e&&s.contexts[i]===t){for(var u=s.listeners[i],c=u.length-1;0<=c;c--){var f=et(u[c],3),d=f[0],p=f[1],v=f[2];if(d===r&&p===!!a.capture&&v===a.passive){u.splice(c,1),u.length||(s.selectors.splice(i,1),s.contexts.splice(i,1),s.listeners.splice(i,1),at(t,n,st),at(t,n,lt,!0),s.selectors.length||(rt[n]=null)),l=!0;break}}if(l)break}},delegateListener:st,delegateUseCapture:lt,delegatedEvents:rt,documents:ot,supportsOptions:!1,supportsPassive:!1,_elements:tt,_targets:nt,init:function(e){e.document.createElement("div").addEventListener("test",null,{get capture(){return ft.supportsOptions=!0},get passive(){return ft.supportsPassive=!0}})}},dt=ft;Ue.default=dt;var pt={};Object.defineProperty(pt,"__esModule",{value:!0}),pt.default=pt.Interactable=void 0;var vt=Pt(s),gt=xt(q),ht=xt(Te),yt=xt(Ue),mt=xt(r),bt=Pt(v),wt=xt(x),Ot=xt(S);function xt(e){return e&&e.__esModule?e:{default:e}}function Pt(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function _t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var jt=function(){function r(e,t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),this.events=new Ot.default,this._actions=t.actions,this.target=e,this._context=t.context||n,this._win=(0,a.getWindow)((0,K.trySelector)(e)?this._context:e),this._doc=this._win.document,this.set(t)}return function(e,t,n){t&&_t(e.prototype,t),n&&_t(e,n)}(r,[{key:"setOnEvents",value:function(e,t){return bt.func(t.onstart)&&this.on("".concat(e,"start"),t.onstart),bt.func(t.onmove)&&this.on("".concat(e,"move"),t.onmove),bt.func(t.onend)&&this.on("".concat(e,"end"),t.onend),bt.func(t.oninertiastart)&&this.on("".concat(e,"inertiastart"),t.oninertiastart),this}},{key:"updatePerActionListeners",value:function(e,t,n){bt.array(t)&&this.off(e,t),bt.array(n)&&this.on(e,n)}},{key:"setPerAction",value:function(e,t){var n=this._defaults;for(var r in t){var o=this.options[e],i=t[r],a=bt.array(i);"listeners"===r&&this.updatePerActionListeners(e,o.listeners,i),a?o[r]=vt.from(i):!a&&bt.plainObject(i)?(o[r]=(0,mt.default)(o[r]||{},(0,ht.default)(i)),bt.object(n.perAction[r])&&"enabled"in n.perAction[r]&&(o[r].enabled=!1!==i.enabled)):bt.bool(i)&&bt.object(n.perAction[r])?o[r].enabled=i:o[r]=i}}},{key:"getRect",value:function(e){return e=e||(bt.element(this.target)?this.target:null),bt.string(this.target)&&(e=e||this._context.querySelector(this.target)),(0,K.getElementRect)(e)}},{key:"rectChecker",value:function(e){return bt.func(e)?(this.getRect=e,this):null===e?(delete this.getRect,this):this.getRect}},{key:"_backCompatOption",value:function(e,t){if((0,K.trySelector)(t)||bt.object(t)){this.options[e]=t;for(var n=0;n<this._actions.names.length;n++){var r=this._actions.names[n];this.options[r][e]=t}return this}return this.options[e]}},{key:"origin",value:function(e){return this._backCompatOption("origin",e)}},{key:"deltaSource",value:function(e){return"page"===e||"client"===e?(this.options.deltaSource=e,this):this.options.deltaSource}},{key:"context",value:function(){return this._context}},{key:"inContext",value:function(e){return this._context===e.ownerDocument||(0,K.nodeContains)(this._context,e)}},{key:"testIgnoreAllow",value:function(e,t,n){return!this.testIgnore(e.ignoreFrom,t,n)&&this.testAllow(e.allowFrom,t,n)}},{key:"testAllow",value:function(e,t,n){return!e||!!bt.element(n)&&(bt.string(e)?(0,K.matchesUpTo)(n,e,t):!!bt.element(e)&&(0,K.nodeContains)(e,n))}},{key:"testIgnore",value:function(e,t,n){return!(!e||!bt.element(n))&&(bt.string(e)?(0,K.matchesUpTo)(n,e,t):!!bt.element(e)&&(0,K.nodeContains)(e,n))}},{key:"fire",value:function(e){return this.events.fire(e),this}},{key:"_onOff",value:function(e,t,n,r){bt.object(t)&&!bt.array(t)&&(r=n,n=null);var o="on"===e?"add":"remove",i=(0,wt.default)(t,n);for(var a in i){"wheel"===a&&(a=gt.default.wheelEvent);for(var s=0;s<i[a].length;s++){var l=i[a][s];vt.contains(this._actions.eventTypes,a)?this.events[e](a,l):bt.string(this.target)?yt.default["".concat(o,"Delegate")](this.target,this._context,a,l,r):yt.default[o](this.target,a,l,r)}}return this}},{key:"on",value:function(e,t,n){return this._onOff("on",e,t,n)}},{key:"off",value:function(e,t,n){return this._onOff("off",e,t,n)}},{key:"set",value:function(e){var t=this._defaults;for(var n in bt.object(e)||(e={}),this.options=(0,ht.default)(t.base),this._actions.methodDict){var r=this._actions.methodDict[n];this.options[n]={},this.setPerAction(n,(0,mt.default)((0,mt.default)({},t.perAction),t.actions[n])),this[r](e[n])}for(var o in e)bt.func(this[o])&&this[o](e[o]);return this}},{key:"unset",value:function(){if(yt.default.remove(this.target,"all"),bt.string(this.target))for(var e in yt.default.delegatedEvents){var t=yt.default.delegatedEvents[e];t.selectors[0]===this.target&&t.contexts[0]===this._context&&(t.selectors.splice(0,1),t.contexts.splice(0,1),t.listeners.splice(0,1),t.selectors.length||(t[e]=null)),yt.default.remove(this._context,e,yt.default.delegateListener),yt.default.remove(this._context,e,yt.default.delegateUseCapture,!0)}else yt.default.remove(this.target,"all")}},{key:"_defaults",get:function(){return{base:{},perAction:{},actions:{}}}}]),r}(),Mt=pt.Interactable=jt;pt.default=Mt;var Et={};Object.defineProperty(Et,"__esModule",{value:!0}),Et.default=Et.PointerInfo=void 0;var St=function e(t,n,r,o,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.id=t,this.pointer=n,this.event=r,this.downTime=o,this.downTarget=i},Tt=Et.PointerInfo=St;Et.default=Tt;var Dt={};function kt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}Object.defineProperty(Dt,"__esModule",{value:!0}),Dt.default=void 0;var zt=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.listeners={}}return function(e,t,n){t&&kt(e.prototype,t),n&&kt(e,n)}(e,[{key:"on",value:function(e,t){this.listeners[e]?this.listeners[e].push(t):this.listeners[e]=[t]}},{key:"off",value:function(e,t){if(this.listeners[e]){var n=this.listeners[e].indexOf(t);-1!==n&&this.listeners[e].splice(n,1)}}},{key:"fire",value:function(e,t){var n=this.listeners[e];if(n)for(var r=0;r<n.length;r++){if(!1===(0,n[r])(t,e))return!1}}}]),e}();Dt.default=zt;var It={};Object.defineProperty(It,"__esModule",{value:!0}),It.default=void 0;var At,Ct,Rt=0;var Xt={request:function(e){return At(e)},cancel:function(e){return Ct(e)},init:function(e){if(At=e.requestAnimationFrame,Ct=e.cancelAnimationFrame,!At)for(var t=["ms","moz","webkit","o"],n=0;n<t.length;n++){var r=t[n];At=e["".concat(r,"RequestAnimationFrame")],Ct=e["".concat(r,"CancelAnimationFrame")]||e["".concat(r,"CancelRequestAnimationFrame")]}At||(At=function(e){var t=Date.now(),n=Math.max(0,16-(t-Rt)),r=setTimeout(function(){e(t+n)},n);return Rt=t+n,r},Ct=function(e){return clearTimeout(e)})}};It.default=Xt;var Yt={};Object.defineProperty(Yt,"__esModule",{value:!0}),Yt.warnOnce=function(e,t){var n=!1;return function(){return n||(Wt.default.window.console.warn(t),n=!0),e.apply(this,arguments)}},Yt._getQBezierValue=nn,Yt.getQuadraticCurvePoint=function(e,t,n,r,o,i,a){return{x:nn(a,e,n,o),y:nn(a,t,r,i)}},Yt.easeOutQuad=function(e,t,n,r){return-n*(e/=r)*(e-2)+t},Yt.copyAction=function(e,t){return e.name=t.name,e.axis=t.axis,e.edges=t.edges,e},Object.defineProperty(Yt,"win",{enumerable:!0,get:function(){return Wt.default}}),Object.defineProperty(Yt,"browser",{enumerable:!0,get:function(){return qt.default}}),Object.defineProperty(Yt,"clone",{enumerable:!0,get:function(){return Vt.default}}),Object.defineProperty(Yt,"events",{enumerable:!0,get:function(){return Gt.default}}),Object.defineProperty(Yt,"extend",{enumerable:!0,get:function(){return Ut.default}}),Object.defineProperty(Yt,"getOriginXY",{enumerable:!0,get:function(){return Bt.default}}),Object.defineProperty(Yt,"hypot",{enumerable:!0,get:function(){return Ht.default}}),Object.defineProperty(Yt,"normalizeListeners",{enumerable:!0,get:function(){return $t.default}}),Object.defineProperty(Yt,"pointer",{enumerable:!0,get:function(){return Kt.default}}),Object.defineProperty(Yt,"raf",{enumerable:!0,get:function(){return Qt.default}}),Object.defineProperty(Yt,"rect",{enumerable:!0,get:function(){return Jt.default}}),Object.defineProperty(Yt,"Signals",{enumerable:!0,get:function(){return Zt.default}}),Yt.is=Yt.dom=Yt.arr=void 0;var Nt=tn(s);Yt.arr=Nt;var Ft=tn(K);Yt.dom=Ft;var Lt=tn(v);Yt.is=Lt;var Wt=en(a),qt=en(q),Vt=en(Te),Gt=en(Ue),Ut=en(r),Bt=en(he),Ht=en(ye),$t=en(x),Kt=en(Re),Qt=en(It),Jt=en(ae),Zt=en(Dt);function en(e){return e&&e.__esModule?e:{default:e}}function tn(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function nn(e,t,n,r){var o=1-e;return o*o*t+2*o*e*n+e*e*r}var rn={};Object.defineProperty(rn,"__esModule",{value:!0}),rn.default=void 0;var on=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt);var an={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(e){for(var t=0;t<an.methodOrder.length;t++){var n;n=an.methodOrder[t];var r=an[n](e);if(r)return r}},simulationResume:function(e){var t=e.pointerType,n=e.eventType,r=e.eventTarget,o=e.scope;if(!/down|start/i.test(n))return null;for(var i=0;i<o.interactions.list.length;i++){var a=o.interactions.list[i],s=r;if(a.simulation&&a.simulation.allowResume&&a.pointerType===t)for(;s;){if(s===a.element)return a;s=on.dom.parentNode(s)}}return null},mouseOrPen:function(e){var t,n=e.pointerId,r=e.pointerType,o=e.eventType,i=e.scope;if("mouse"!==r&&"pen"!==r)return null;for(var a=0;a<i.interactions.list.length;a++){var s=i.interactions.list[a];if(s.pointerType===r){if(s.simulation&&!sn(s,n))continue;if(s.interacting())return s;t||(t=s)}}if(t)return t;for(var l=0;l<i.interactions.list.length;l++){var u=i.interactions.list[l];if(!(u.pointerType!==r||/down/i.test(o)&&u.simulation))return u}return null},hasPointer:function(e){for(var t=e.pointerId,n=e.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(sn(o,t))return o}return null},idle:function(e){for(var t=e.pointerType,n=e.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(1===o.pointers.length){var i=o.interactable;if(i&&!i.options.gesture.enabled)continue}else if(2<=o.pointers.length)continue;if(!o.interacting()&&t===o.pointerType)return o}return null}};function sn(e,t){return on.arr.some(e.pointers,function(e){return e.id===t})}var ln=an;rn.default=ln;var un={};Object.defineProperty(un,"__esModule",{value:!0}),un.default=void 0;var cn=f({}),fn=pn(s),dn=pn(v);function pn(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function vn(e){var t=e.interaction;if("drag"===t.prepared.name){var n=t.prepared.axis;"x"===n?(t.coords.cur.page.y=t.coords.start.page.y,t.coords.cur.client.y=t.coords.start.client.y,t.coords.velocity.client.y=0,t.coords.velocity.page.y=0):"y"===n&&(t.coords.cur.page.x=t.coords.start.page.x,t.coords.cur.client.x=t.coords.start.client.x,t.coords.velocity.client.x=0,t.coords.velocity.page.x=0)}}function gn(e){var t=e.iEvent,n=e.interaction;if("drag"===n.prepared.name){var r=n.prepared.axis;if("x"===r||"y"===r){var o="x"===r?"y":"x";t.page[o]=n.coords.start.page[o],t.client[o]=n.coords.start.client[o],t.delta[o]=0}}}cn.ActionName.Drag="drag";var hn={id:"actions/drag",install:function(e){var t=e.actions,n=e.Interactable,r=e.interactions,o=e.defaults;r.signals.on("before-action-move",vn),r.signals.on("action-resume",vn),r.signals.on("action-move",gn),n.prototype.draggable=hn.draggable,t[cn.ActionName.Drag]=hn,t.names.push(cn.ActionName.Drag),fn.merge(t.eventTypes,["dragstart","dragmove","draginertiastart","dragresume","dragend"]),t.methodDict.drag="draggable",o.actions.drag=hn.defaults},draggable:function(e){return dn.object(e)?(this.options.drag.enabled=!1!==e.enabled,this.setPerAction("drag",e),this.setOnEvents("drag",e),/^(xy|x|y|start)$/.test(e.lockAxis)&&(this.options.drag.lockAxis=e.lockAxis),/^(xy|x|y)$/.test(e.startAxis)&&(this.options.drag.startAxis=e.startAxis),this):dn.bool(e)?(this.options.drag.enabled=e,this):this.options.drag},beforeMove:vn,move:gn,defaults:{startAxis:"xy",lockAxis:"xy"},checker:function(e,t,n){var r=n.options.drag;return r.enabled?{name:"drag",axis:"start"===r.lockAxis?r.startAxis:r.lockAxis}:null},getCursor:function(){return"move"}},yn=hn;un.default=yn;var mn={};Object.defineProperty(mn,"__esModule",{value:!0}),mn.default=void 0;var bn=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(s);function wn(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function On(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var xn=function(){function a(e,t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),this.propagationStopped=!1,this.immediatePropagationStopped=!1;var r="dragleave"===n?e.prev:e.cur,o=r.element,i=r.dropzone;this.type=n,this.target=o,this.currentTarget=o,this.dropzone=i,this.dragEvent=t,this.relatedTarget=t.target,this.interaction=t.interaction,this.draggable=t.interactable,this.timeStamp=t.timeStamp}return function(e,t,n){t&&On(e.prototype,t),n&&On(e,n)}(a,[{key:"reject",value:function(){var r=this,e=this.interaction.dropState;if("dropactivate"===this.type||this.dropzone&&e.cur.dropzone===this.dropzone&&e.cur.element===this.target)if(e.prev.dropzone=this.dropzone,e.prev.element=this.target,e.rejected=!0,e.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){var t=e.activeDrops,n=bn.findIndex(t,function(e){var t=e.dropzone,n=e.element;return t===r.dropzone&&n===r.target});e.activeDrops=[].concat(wn(t.slice(0,n)),wn(t.slice(n+1)));var o=new a(e,this.dragEvent,"dropdeactivate");o.dropzone=this.dropzone,o.target=this.target,this.dropzone.fire(o)}else this.dropzone.fire(new a(e,this.dragEvent,"dragleave"))}},{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),a}();mn.default=xn;var Pn={};Object.defineProperty(Pn,"__esModule",{value:!0}),Pn.default=void 0;var _n=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt),jn=En(un),Mn=En(mn);function En(e){return e&&e.__esModule?e:{default:e}}function Sn(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=r.dropzone,i=r.element;t.dropzone=o,t.target=i,o.fire(t),t.propagationStopped=t.immediatePropagationStopped=!1}}function Tn(e,t){for(var n=function(e,t){for(var n=e.interactables,r=[],o=0;o<n.list.length;o++){var i=n.list[o];if(i.options.drop.enabled){var a=i.options.drop.accept;if(!(_n.is.element(a)&&a!==t||_n.is.string(a)&&!_n.dom.matchesSelector(t,a)||_n.is.func(a)&&!a({dropzone:i,draggableElement:t})))for(var s=_n.is.string(i.target)?i._context.querySelectorAll(i.target):_n.is.array(i.target)?i.target:[i.target],l=0;l<s.length;l++){var u=s[l];u!==t&&r.push({dropzone:i,element:u})}}}return r}(e,t),r=0;r<n.length;r++){var o=n[r];o.rect=o.dropzone.getRect(o.element)}return n}function Dn(e,t,n){for(var r=e.dropState,o=e.interactable,i=e.element,a=[],s=0;s<r.activeDrops.length;s++){var l=r.activeDrops[s],u=l.dropzone,c=l.element,f=l.rect;a.push(u.dropCheck(t,n,o,i,c,f)?c:null)}var d=_n.dom.indexOfDeepestElement(a);return r.activeDrops[d]||null}function kn(e,t,n){var r=e.dropState,o={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return"dragstart"===n.type&&(o.activate=new Mn.default(r,n,"dropactivate"),o.activate.target=null,o.activate.dropzone=null),"dragend"===n.type&&(o.deactivate=new Mn.default(r,n,"dropdeactivate"),o.deactivate.target=null,o.deactivate.dropzone=null),r.rejected||(r.cur.element!==r.prev.element&&(r.prev.dropzone&&(o.leave=new Mn.default(r,n,"dragleave"),n.dragLeave=o.leave.target=r.prev.element,n.prevDropzone=o.leave.dropzone=r.prev.dropzone),r.cur.dropzone&&(o.enter=new Mn.default(r,n,"dragenter"),n.dragEnter=r.cur.element,n.dropzone=r.cur.dropzone)),"dragend"===n.type&&r.cur.dropzone&&(o.drop=new Mn.default(r,n,"drop"),n.dropzone=r.cur.dropzone,n.relatedTarget=r.cur.element),"dragmove"===n.type&&r.cur.dropzone&&(o.move=new Mn.default(r,n,"dropmove"),(o.move.dragmove=n).dropzone=r.cur.dropzone)),o}function zn(e,t){var n=e.dropState,r=n.activeDrops,o=n.cur,i=n.prev;t.leave&&i.dropzone.fire(t.leave),t.move&&o.dropzone.fire(t.move),t.enter&&o.dropzone.fire(t.enter),t.drop&&o.dropzone.fire(t.drop),t.deactivate&&Sn(r,t.deactivate),n.prev.dropzone=o.dropzone,n.prev.element=o.element}function In(e,t){var n=e.interaction,r=e.iEvent,o=e.event;if("dragmove"===r.type||"dragend"===r.type){var i=n.dropState;t.dynamicDrop&&(i.activeDrops=Tn(t,n.element));var a=r,s=Dn(n,a,o);i.rejected=i.rejected&&!!s&&s.dropzone===i.cur.dropzone&&s.element===i.cur.element,i.cur.dropzone=s&&s.dropzone,i.cur.element=s&&s.element,i.events=kn(n,0,a)}}var An={id:"actions/drop",install:function(o){var e=o.actions,t=o.interact,n=o.Interactable,r=o.interactions,i=o.defaults;o.usePlugin(jn.default),r.signals.on("before-action-start",function(e){var t=e.interaction;"drag"===t.prepared.name&&(t.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:null})}),r.signals.on("after-action-start",function(e){var t=e.interaction,n=(e.event,e.iEvent);if("drag"===t.prepared.name){var r=t.dropState;r.activeDrops=null,r.events=null,r.activeDrops=Tn(o,t.element),r.events=kn(t,0,n),r.events.activate&&Sn(r.activeDrops,r.events.activate)}}),r.signals.on("action-move",function(e){return In(e,o)}),r.signals.on("action-end",function(e){return In(e,o)}),r.signals.on("after-action-move",function(e){var t=e.interaction;"drag"===t.prepared.name&&(zn(t,t.dropState.events),t.dropState.events={})}),r.signals.on("after-action-end",function(e){var t=e.interaction;"drag"===t.prepared.name&&zn(t,t.dropState.events)}),r.signals.on("stop",function(e){var t=e.interaction;if("drag"===t.prepared.name){var n=t.dropState;n.activeDrops=null,n.events=null,n.cur.dropzone=null,n.cur.element=null,n.prev.dropzone=null,n.prev.element=null,n.rejected=!1}}),n.prototype.dropzone=function(e){return function(e,t){if(_n.is.object(t)){if(e.options.drop.enabled=!1!==t.enabled,t.listeners){var r=_n.normalizeListeners(t.listeners),n=Object.keys(r).reduce(function(e,t){var n=/^(enter|leave)/.test(t)?"drag".concat(t):/^(activate|deactivate|move)/.test(t)?"drop".concat(t):t;return e[n]=r[t],e},{});e.off(e.options.drop.listeners),e.on(n),e.options.drop.listeners=n}return _n.is.func(t.ondrop)&&e.on("drop",t.ondrop),_n.is.func(t.ondropactivate)&&e.on("dropactivate",t.ondropactivate),_n.is.func(t.ondropdeactivate)&&e.on("dropdeactivate",t.ondropdeactivate),_n.is.func(t.ondragenter)&&e.on("dragenter",t.ondragenter),_n.is.func(t.ondragleave)&&e.on("dragleave",t.ondragleave),_n.is.func(t.ondropmove)&&e.on("dropmove",t.ondropmove),/^(pointer|center)$/.test(t.overlap)?e.options.drop.overlap=t.overlap:_n.is.number(t.overlap)&&(e.options.drop.overlap=Math.max(Math.min(1,t.overlap),0)),"accept"in t&&(e.options.drop.accept=t.accept),"checker"in t&&(e.options.drop.checker=t.checker),e}return _n.is.bool(t)?(e.options.drop.enabled=t,e):e.options.drop}(this,e)},n.prototype.dropCheck=function(e,t,n,r,o,i){return function(e,t,n,r,o,i,a){var s=!1;if(!(a=a||e.getRect(i)))return!!e.options.drop.checker&&e.options.drop.checker(t,n,s,e,i,r,o);var l=e.options.drop.overlap;if("pointer"===l){var u=_n.getOriginXY(r,o,"drag"),c=_n.pointer.getPageXY(t);c.x+=u.x,c.y+=u.y;var f=c.x>a.left&&c.x<a.right,d=c.y>a.top&&c.y<a.bottom;s=f&&d}var p=r.getRect(o);if(p&&"center"===l){var v=p.left+p.width/2,g=p.top+p.height/2;s=v>=a.left&&v<=a.right&&g>=a.top&&g<=a.bottom}if(p&&_n.is.number(l)){var h=Math.max(0,Math.min(a.right,p.right)-Math.max(a.left,p.left))*Math.max(0,Math.min(a.bottom,p.bottom)-Math.max(a.top,p.top)),y=h/(p.width*p.height);s=l<=y}return e.options.drop.checker&&(s=e.options.drop.checker(t,n,s,e,i,r,o)),s}(this,e,t,n,r,o,i)},t.dynamicDrop=function(e){return _n.is.bool(e)?(o.dynamicDrop=e,t):o.dynamicDrop},_n.arr.merge(e.eventTypes,["dragenter","dragleave","dropactivate","dropdeactivate","dropmove","drop"]),e.methodDict.drop="dropzone",o.dynamicDrop=!1,i.actions.drop=An.defaults},getActiveDrops:Tn,getDrop:Dn,getDropEvents:kn,fireDropEvents:zn,defaults:{enabled:!1,accept:null,overlap:"pointer"}},Cn=An;Pn.default=Cn;var Rn={};Object.defineProperty(Rn,"__esModule",{value:!0}),Rn.default=void 0;var Xn,Yn=(Xn=me)&&Xn.__esModule?Xn:{default:Xn},Nn=f({}),Fn=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt);Nn.ActionName.Gesture="gesture";var Ln={id:"actions/gesture",install:function(e){var t=e.actions,n=e.Interactable,r=e.interactions,o=e.defaults;n.prototype.gesturable=function(e){return Fn.is.object(e)?(this.options.gesture.enabled=!1!==e.enabled,this.setPerAction("gesture",e),this.setOnEvents("gesture",e),this):Fn.is.bool(e)?(this.options.gesture.enabled=e,this):this.options.gesture},r.signals.on("action-start",Wn),r.signals.on("action-move",Wn),r.signals.on("action-end",Wn),r.signals.on("new",function(e){e.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0}}),t[Nn.ActionName.Gesture]=Ln,t.names.push(Nn.ActionName.Gesture),Fn.arr.merge(t.eventTypes,["gesturestart","gesturemove","gestureend"]),t.methodDict.gesture="gesturable",o.actions.gesture=Ln.defaults},defaults:{},checker:function(e,t,n,r,o){return 2<=o.pointers.length?{name:"gesture"}:null},getCursor:function(){return""}};function Wn(e){var t=e.interaction,n=e.iEvent,r=e.event,o=e.phase;if("gesture"===t.prepared.name){var i=t.pointers.map(function(e){return e.pointer}),a="start"===o,s="end"===o,l=t.interactable.options.deltaSource;if(n.touches=[i[0],i[1]],a)n.distance=Fn.pointer.touchDistance(i,l),n.box=Fn.pointer.touchBBox(i),n.scale=1,n.ds=0,n.angle=Fn.pointer.touchAngle(i,l),n.da=0,t.gesture.startDistance=n.distance,t.gesture.startAngle=n.angle;else if(s||r instanceof Yn.default){var u=t.prevEvent;n.distance=u.distance,n.box=u.box,n.scale=u.scale,n.ds=0,n.angle=u.angle,n.da=0}else n.distance=Fn.pointer.touchDistance(i,l),n.box=Fn.pointer.touchBBox(i),n.scale=n.distance/t.gesture.startDistance,n.angle=Fn.pointer.touchAngle(i,l),n.ds=n.scale-t.gesture.scale,n.da=n.angle-t.gesture.angle;t.gesture.distance=n.distance,t.gesture.angle=n.angle,Fn.is.number(n.scale)&&n.scale!==1/0&&!isNaN(n.scale)&&(t.gesture.scale=n.scale)}}var qn=Ln;Rn.default=qn;var Vn={};Object.defineProperty(Vn,"__esModule",{value:!0}),Vn.default=void 0;var Gn=f({}),Un=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt);var Bn={id:"actions/resize",install:function(t){var e=t.actions,n=t.browser,r=t.Interactable,o=t.interactions,i=t.defaults;o.signals.on("new",function(e){e.resizeAxes="xy"}),o.signals.on("action-start",$n),o.signals.on("action-move",Kn),o.signals.on("action-start",Qn),o.signals.on("action-move",Qn),Bn.cursors=function(e){return e.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"}}(n),Bn.defaultMargin=n.supportsTouch||n.supportsPointerEvent?20:10,r.prototype.resizable=function(e){return function(e,t,n){return Un.is.object(t)?(e.options.resize.enabled=!1!==t.enabled,e.setPerAction("resize",t),e.setOnEvents("resize",t),Un.is.string(t.axis)&&/^x$|^y$|^xy$/.test(t.axis)?e.options.resize.axis=t.axis:null===t.axis&&(e.options.resize.axis=n.defaults.actions.resize.axis),Un.is.bool(t.preserveAspectRatio)?e.options.resize.preserveAspectRatio=t.preserveAspectRatio:Un.is.bool(t.square)&&(e.options.resize.square=t.square),e):Un.is.bool(t)?(e.options.resize.enabled=t,e):e.options.resize}(this,e,t)},e[Gn.ActionName.Resize]=Bn,e.names.push(Gn.ActionName.Resize),Un.arr.merge(e.eventTypes,["resizestart","resizemove","resizeinertiastart","resizeresume","resizeend"]),e.methodDict.resize="resizable",i.actions.resize=Bn.defaults},defaults:{square:!(Gn.ActionName.Resize="resize"),preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},checker:function(e,t,n,r,o,i){if(!i)return null;var a=Un.extend({},o.coords.cur.page),s=n.options;if(s.resize.enabled){var l=s.resize,u={left:!1,right:!1,top:!1,bottom:!1};if(Un.is.object(l.edges)){for(var c in u)u[c]=Hn(c,l.edges[c],a,o._latestPointer.eventTarget,r,i,l.margin||this.defaultMargin);if(u.left=u.left&&!u.right,u.top=u.top&&!u.bottom,u.left||u.right||u.top||u.bottom)return{name:"resize",edges:u}}else{var f="y"!==s.resize.axis&&a.x>i.right-this.defaultMargin,d="x"!==s.resize.axis&&a.y>i.bottom-this.defaultMargin;if(f||d)return{name:"resize",axes:(f?"x":"")+(d?"y":"")}}}return null},cursors:null,getCursor:function(e){var t=Bn.cursors;if(e.axis)return t[e.name+e.axis];if(e.edges){for(var n="",r=["top","bottom","left","right"],o=0;o<4;o++)e.edges[r[o]]&&(n+=r[o]);return t[n]}return null},defaultMargin:null};function Hn(e,t,n,r,o,i,a){if(!t)return!1;if(!0===t){var s=Un.is.number(i.width)?i.width:i.right-i.left,l=Un.is.number(i.height)?i.height:i.bottom-i.top;if(a=Math.min(a,("left"===e||"right"===e?s:l)/2),s<0&&("left"===e?e="right":"right"===e&&(e="left")),l<0&&("top"===e?e="bottom":"bottom"===e&&(e="top")),"left"===e)return n.x<(0<=s?i.left:i.right)+a;if("top"===e)return n.y<(0<=l?i.top:i.bottom)+a;if("right"===e)return n.x>(0<=s?i.right:i.left)-a;if("bottom"===e)return n.y>(0<=l?i.bottom:i.top)-a}return!!Un.is.element(r)&&(Un.is.element(t)?t===r:Un.dom.matchesUpTo(r,t,o))}function $n(e){var t=e.iEvent,n=e.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=n.interactable.getRect(n.element),o=n.interactable.options.resize;if(o.square||o.preserveAspectRatio){var i=Un.extend({},n.prepared.edges);i.top=i.top||i.left&&!i.bottom,i.left=i.left||i.top&&!i.right,i.bottom=i.bottom||i.right&&!i.top,i.right=i.right||i.bottom&&!i.left,n.prepared._linkedEdges=i}else n.prepared._linkedEdges=null;o.preserveAspectRatio&&(n.resizeStartAspectRatio=r.width/r.height),n.resizeRects={start:r,current:Un.extend({},r),inverted:Un.extend({},r),previous:Un.extend({},r),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},t.rect=n.resizeRects.inverted,t.deltaRect=n.resizeRects.delta}}function Kn(e){var t=e.iEvent,n=e.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r,o=n.interactable.options.resize,i=o.invert,a="reposition"===i||"negate"===i,s=n.prepared.edges,l=n.resizeRects.start,u=n.resizeRects.current,c=n.resizeRects.inverted,f=n.resizeRects.delta,d=Un.extend(n.resizeRects.previous,c),p=s,v=Un.extend({},t.delta);if(o.preserveAspectRatio||o.square){var g=o.preserveAspectRatio?n.resizeStartAspectRatio:1;s=n.prepared._linkedEdges,p.left&&p.bottom||p.right&&p.top?v.y=-v.x/g:p.left||p.right?v.y=v.x/g:(p.top||p.bottom)&&(v.x=v.y*g)}if(s.top&&(u.top+=v.y),s.bottom&&(u.bottom+=v.y),s.left&&(u.left+=v.x),s.right&&(u.right+=v.x),a){if(Un.extend(c,u),"reposition"===i)c.top>c.bottom&&(r=c.top,c.top=c.bottom,c.bottom=r),c.left>c.right&&(r=c.left,c.left=c.right,c.right=r)}else c.top=Math.min(u.top,l.bottom),c.bottom=Math.max(u.bottom,l.top),c.left=Math.min(u.left,l.right),c.right=Math.max(u.right,l.left);for(var h in c.width=c.right-c.left,c.height=c.bottom-c.top,c)f[h]=c[h]-d[h];t.edges=n.prepared.edges,t.rect=c,t.deltaRect=f}}function Qn(e){var t=e.interaction,n=e.iEvent;"resize"===e.action&&t.resizeAxes&&(t.interactable.options.resize.square?("y"===t.resizeAxes?n.delta.x=n.delta.y:n.delta.y=n.delta.x,n.axes="xy"):(n.axes=t.resizeAxes,"x"===t.resizeAxes?n.delta.y=0:"y"===t.resizeAxes&&(n.delta.x=0)))}var Jn=Bn;Vn.default=Jn;var Zn={};Object.defineProperty(Zn,"__esModule",{value:!0}),Zn.install=function(e){nr.default.install(e),rr.default.install(e),er.default.install(e),tr.default.install(e)},Object.defineProperty(Zn,"drag",{enumerable:!0,get:function(){return er.default}}),Object.defineProperty(Zn,"drop",{enumerable:!0,get:function(){return tr.default}}),Object.defineProperty(Zn,"gesture",{enumerable:!0,get:function(){return nr.default}}),Object.defineProperty(Zn,"resize",{enumerable:!0,get:function(){return rr.default}}),Zn.id=void 0;var er=or(un),tr=or(Pn),nr=or(Rn),rr=or(Vn);function or(e){return e&&e.__esModule?e:{default:e}}Zn.id="actions";var ir={};Object.defineProperty(ir,"__esModule",{value:!0}),ir.getContainer=dr,ir.getScroll=pr,ir.getScrollSize=function(e){lr.window(e)&&(e=window.document.body);return{x:e.scrollWidth,y:e.scrollHeight}},ir.getScrollSizeDelta=function(e,t){var n=e.interaction,r=e.element,o=n&&n.interactable.options[n.prepared.name].autoScroll;if(!o||!o.enabled)return t(),{x:0,y:0};var i=dr(o.container,n.interactable,r),a=pr(i);t();var s=pr(i);return{x:s.x-a.x,y:s.y-a.y}},ir.default=void 0;var ar,sr=cr(K),lr=cr(v),ur=(ar=It)&&ar.__esModule?ar:{default:ar};function cr(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}var fr={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:null,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(e,t){fr.isScrolling=!0,ur.default.cancel(fr.i),(e.autoScroll=fr).interaction=e,fr.prevTime=t.now(),fr.i=ur.default.request(fr.scroll)},stop:function(){fr.isScrolling=!1,fr.interaction&&(fr.interaction.autoScroll=null),ur.default.cancel(fr.i)},scroll:function(){var e=fr.interaction,t=e.interactable,n=e.element,r=t.options[fr.interaction.prepared.name].autoScroll,o=dr(r.container,t,n),i=this.scope.now(),a=(i-fr.prevTime)/1e3,s=r.speed*a;if(1<=s){var l={x:fr.x*s,y:fr.y*s};if(l.x||l.y){var u=pr(o);lr.window(o)?o.scrollBy(l.x,l.y):o&&(o.scrollLeft+=l.x,o.scrollTop+=l.y);var c=pr(o),f={x:c.x-u.x,y:c.y-u.y};(f.x||f.y)&&t.fire({type:"autoscroll",target:n,interactable:t,delta:f,interaction:e,container:o})}fr.prevTime=i}fr.isScrolling&&(ur.default.cancel(fr.i),fr.i=ur.default.request(fr.scroll))},check:function(e,t){var n=e.options;return n[t].autoScroll&&n[t].autoScroll.enabled},onInteractionMove:function(e,t){var n=e.interaction,r=e.pointer;if(n.interacting()&&fr.check(n.interactable,n.prepared.name))if(n.simulation)fr.x=fr.y=0;else{var o,i,a,s,l=n.interactable,u=n.element,c=l.options[n.prepared.name].autoScroll,f=dr(c.container,l,u);if(lr.window(f))s=r.clientX<fr.margin,o=r.clientY<fr.margin,i=r.clientX>f.innerWidth-fr.margin,a=r.clientY>f.innerHeight-fr.margin;else{var d=sr.getElementClientRect(f);s=r.clientX<d.left+fr.margin,o=r.clientY<d.top+fr.margin,i=r.clientX>d.right-fr.margin,a=r.clientY>d.bottom-fr.margin}fr.x=i?1:s?-1:0,fr.y=a?1:o?-1:0,fr.isScrolling||(fr.margin=c.margin,fr.speed=c.speed,fr.start(n,t))}}};function dr(e,t,n){return(lr.string(e)?(0,ae.getStringOptionResult)(e,t,n):e)||(0,a.getWindow)(n)}function pr(e){return lr.window(e)&&(e=window.document.body),{x:e.scrollLeft,y:e.scrollTop}}var vr={id:"auto-scroll",install:function(t){var e=t.interactions,n=t.defaults,r=t.actions;(t.autoScroll=fr).now=function(){return t.now()},e.signals.on("new",function(e){e.interaction.autoScroll=null}),e.signals.on("stop",fr.stop),e.signals.on("action-move",function(e){return fr.onInteractionMove(e,t)}),r.eventTypes.push("autoscroll"),n.perAction.autoScroll=fr.defaults}};ir.default=vr;var gr={};Object.defineProperty(gr,"__esModule",{value:!0}),gr.default=void 0;var hr=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v);function yr(e,t,n,r){var o=this.defaultActionChecker(e,t,n,r);return this.options.actionChecker?this.options.actionChecker(e,t,o,this,r,n):o}function mr(e){return hr.bool(e)?(this.options.styleCursor=e,this):null===e?(delete this.options.styleCursor,this):this.options.styleCursor}function br(e){return hr.func(e)?(this.options.actionChecker=e,this):null===e?(delete this.options.actionChecker,this):this.options.actionChecker}var wr={id:"auto-start/interactableMethods",install:function(e){var t=e.Interactable,o=e.actions;t.prototype.getAction=yr,t.prototype.ignoreFrom=(0,Yt.warnOnce)(function(e){return this._backCompatOption("ignoreFrom",e)},"Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),t.prototype.allowFrom=(0,Yt.warnOnce)(function(e){return this._backCompatOption("allowFrom",e)},"Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),t.prototype.actionChecker=br,t.prototype.styleCursor=mr,t.prototype.defaultActionChecker=function(e,t,n,r){return function(e,t,n,r,o,i){for(var a=e.getRect(o),s=n.buttons||{0:1,1:4,3:8,4:16}[n.button],l=null,u=0;u<i.names.length;u++){var c=i.names[u];if((!r.pointerIsDown||!/mouse|pointer/.test(r.pointerType)||0!=(s&e.options[c].mouseButtons))&&(l=i[c].checker(t,n,e,o,r,a)))return l}}(this,e,t,n,r,o)}}};gr.default=wr;var Or={};Object.defineProperty(Or,"__esModule",{value:!0}),Or.default=void 0;var xr,Pr=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt),_r=(xr=gr)&&xr.__esModule?xr:{default:xr};function jr(e,t,n,r,o){return t.testIgnoreAllow(t.options[e.name],n,r)&&t.options[e.name].enabled&&Tr(t,n,e,o)?e:null}function Mr(e,t,n,r,o,i,a){for(var s=0,l=r.length;s<l;s++){var u=r[s],c=o[s],f=u.getAction(t,n,e,c);if(f){var d=jr(f,u,c,i,a);if(d)return{action:d,interactable:u,element:c}}}return{action:null,interactable:null,element:null}}function Er(e,t,n,r,o){var i=[],a=[],s=r;function l(e){i.push(e),a.push(s)}for(;Pr.is.element(s);){i=[],a=[],o.interactables.forEachMatch(s,l);var u=Mr(e,t,n,i,a,r,o);if(u.action&&!u.interactable.options[u.action.name].manualStart)return u;s=Pr.dom.parentNode(s)}return{action:null,interactable:null,element:null}}function Sr(e,t,n){var r=t.action,o=t.interactable,i=t.element;if(r=r||{},e.interactable&&e.interactable.options.styleCursor&&kr(e.element,"",n),e.interactable=o,e.element=i,Pr.copyAction(e.prepared,r),e.rect=o&&r.name?o.getRect(i):null,o&&o.options.styleCursor){var a=r?n.actions[r.name].getCursor(r):"";kr(e.element,a,n)}n.autoStart.signals.fire("prepared",{interaction:e})}function Tr(e,t,n,r){var o=e.options,i=o[n.name].max,a=o[n.name].maxPerElement,s=r.autoStart.maxInteractions,l=0,u=0,c=0;if(!(i&&a&&s))return!1;for(var f=0;f<r.interactions.list.length;f++){var d=r.interactions.list[f],p=d.prepared.name;if(d.interacting()){if(s<=++l)return!1;if(d.interactable===e){if(i<=(u+=p===n.name?1:0))return!1;if(d.element===t&&(c++,p===n.name&&a<=c))return!1}}}return 0<s}function Dr(e,t){return Pr.is.number(e)?(t.autoStart.maxInteractions=e,this):t.autoStart.maxInteractions}function kr(e,t,n){n.autoStart.cursorElement&&(n.autoStart.cursorElement.style.cursor=""),e.ownerDocument.documentElement.style.cursor=t,e.style.cursor=t,n.autoStart.cursorElement=t?e:null}var zr={id:"auto-start/base",install:function(i){var e=i.interact,t=i.interactions,n=i.defaults;_r.default.install(i),t.signals.on("down",function(e){var t=e.interaction,n=e.pointer,r=e.event,o=e.eventTarget;t.interacting()||Sr(t,Er(t,n,r,o,i),i)}),t.signals.on("move",function(e){var t=e.interaction,n=e.pointer,r=e.event,o=e.eventTarget;"mouse"!==t.pointerType||t.pointerIsDown||t.interacting()||Sr(t,Er(t,n,r,o,i),i)}),t.signals.on("move",function(e){var t=e.interaction;if(t.pointerIsDown&&!t.interacting()&&t.pointerWasMoved&&t.prepared.name){i.autoStart.signals.fire("before-start",e);var n=t.interactable;t.prepared.name&&n&&(n.options[t.prepared.name].manualStart||!Tr(n,t.element,t.prepared,i)?t.stop():t.start(t.prepared,n,t.element))}}),t.signals.on("stop",function(e){var t=e.interaction,n=t.interactable;n&&n.options.styleCursor&&kr(t.element,"",i)}),n.base.actionChecker=null,n.base.styleCursor=!0,Pr.extend(n.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),e.maxInteractions=function(e){return Dr(e,i)},i.autoStart={maxInteractions:1/0,withinInteractionLimit:Tr,cursorElement:null,signals:new Pr.Signals}},maxInteractions:Dr,withinInteractionLimit:Tr,validateAction:jr};Or.default=zr;var Ir={};Object.defineProperty(Ir,"__esModule",{value:!0}),Ir.default=void 0;var Ar,Cr=f({}),Rr=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v),Xr=(Ar=Or)&&Ar.__esModule?Ar:{default:Ar};var Yr={id:"auto-start/dragAxis",install:function(p){p.autoStart.signals.on("before-start",function(e){var r=e.interaction,o=e.eventTarget,t=e.dx,n=e.dy;if("drag"===r.prepared.name){var i=Math.abs(t),a=Math.abs(n),s=r.interactable.options.drag,l=s.startAxis,u=a<i?"x":i<a?"y":"xy";if(r.prepared.axis="start"===s.lockAxis?u[0]:s.lockAxis,"xy"!=u&&"xy"!==l&&l!==u){r.prepared.name=null;for(var c=o,f=function(e){if(e!==r.interactable){var t=r.interactable.options.drag;if(!t.manualStart&&e.testIgnoreAllow(t,c,o)){var n=e.getAction(r.downPointer,r.downEvent,r,c);if(n&&n.name===Cr.ActionName.Drag&&function(e,t){if(!t)return!1;var n=t.options[Cr.ActionName.Drag].startAxis;return"xy"===e||"xy"===n||n===e}(u,e)&&Xr.default.validateAction(n,e,c,o,p))return e}}};Rr.element(c);){var d=p.interactables.forEachMatch(c,f);if(d){r.prepared.name=Cr.ActionName.Drag,r.interactable=d,r.element=c;break}c=(0,K.parentNode)(c)}}}})}};Ir.default=Yr;var Nr={};Object.defineProperty(Nr,"__esModule",{value:!0}),Nr.default=void 0;var Fr,Lr=(Fr=Or)&&Fr.__esModule?Fr:{default:Fr};function Wr(e){var t=e.prepared&&e.prepared.name;if(!t)return null;var n=e.interactable.options;return n[t].hold||n[t].delay}var qr={id:"auto-start/hold",install:function(e){var t=e.autoStart,n=e.interactions,r=e.defaults;e.usePlugin(Lr.default),r.perAction.hold=0,r.perAction.delay=0,n.signals.on("new",function(e){e.autoStartHoldTimer=null}),t.signals.on("prepared",function(e){var t=e.interaction,n=Wr(t);0<n&&(t.autoStartHoldTimer=setTimeout(function(){t.start(t.prepared,t.interactable,t.element)},n))}),n.signals.on("move",function(e){var t=e.interaction,n=e.duplicate;t.pointerWasMoved&&!n&&clearTimeout(t.autoStartHoldTimer)}),t.signals.on("before-start",function(e){var t=e.interaction;0<Wr(t)&&(t.prepared.name=null)})},getHoldDuration:Wr};Nr.default=qr;var Vr={};Object.defineProperty(Vr,"__esModule",{value:!0}),Vr.install=function(e){Gr.default.install(e),Br.default.install(e),Ur.default.install(e)},Object.defineProperty(Vr,"autoStart",{enumerable:!0,get:function(){return Gr.default}}),Object.defineProperty(Vr,"dragAxis",{enumerable:!0,get:function(){return Ur.default}}),Object.defineProperty(Vr,"hold",{enumerable:!0,get:function(){return Br.default}}),Vr.id=void 0;var Gr=Hr(Or),Ur=Hr(Ir),Br=Hr(Nr);function Hr(e){return e&&e.__esModule?e:{default:e}}Vr.id="auto-start";var $r={};Object.defineProperty($r,"__esModule",{value:!0}),$r.install=eo,$r.default=void 0;var Kr,Qr=(Kr=Ue)&&Kr.__esModule?Kr:{default:Kr},Jr=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v);function Zr(e){var t=e.interaction,n=e.event;t.interactable&&t.interactable.checkAndPreventDefault(n)}function eo(r){var e=r.Interactable;e.prototype.preventDefault=function(e){return function(e,t){return/^(always|never|auto)$/.test(t)?(e.options.preventDefault=t,e):Jr.bool(t)?(e.options.preventDefault=t?"always":"never",e):e.options.preventDefault}(this,e)},e.prototype.checkAndPreventDefault=function(e){return function(e,t,n){var r=e.options.preventDefault;if("never"!==r)if("always"!==r){if(Qr.default.supportsPassive&&/^touch(start|move)$/.test(n.type)){var o=(0,a.getWindow)(n.target).document,i=t.getDocOptions(o);if(!i||!i.events||!1!==i.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(n.type)||Jr.element(n.target)&&(0,K.matchesSelector)(n.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||n.preventDefault()}else n.preventDefault()}(this,r,e)};for(var t=["down","move","up","cancel"],n=0;n<t.length;n++){var o=t[n];r.interactions.signals.on(o,Zr)}r.interactions.eventMap.dragstart=function(e){for(var t=0;t<r.interactions.list.length;t++){var n=r.interactions.list[t];if(n.element&&(n.element===e.target||(0,K.nodeContains)(n.element,e.target)))return void n.interactable.checkAndPreventDefault(e)}}}var to={id:"core/interactablePreventDefault",install:eo};$r.default=to;var no={};Object.defineProperty(no,"__esModule",{value:!0}),no.touchAction=po,no.boxSizing=vo,no.noListeners=go,no.default=no.noListenersMessage=no.boxSizingMessage=no.touchActionMessage=no.install=no.links=void 0;var ro=ao(N),oo=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v),io=ao(a);function ao(e){return e&&e.__esModule?e:{default:e}}var so={touchAction:"https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",boxSizing:"https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"};no.links=so;var lo=function(n){var e=(1<arguments.length&&void 0!==arguments[1]?arguments[1]:{}).logger;e=e||console,n.logger=e,n.interactions.signals.on("action-start",function(e){var t=e.interaction;po(t,n.logger),vo(t,n.logger),go(t,n.logger)})};no.install=lo;var uo='[interact.js] Consider adding CSS "touch-action: none" to this element\n';no.touchActionMessage=uo;var co='[interact.js] Consider adding CSS "box-sizing: border-box" to this resizable element';no.boxSizingMessage=co;var fo="[interact.js] There are no listeners set for this action";function po(e,t){var n=e.element;(function(e,t,n){var r=e;for(;oo.element(r);){if(ho(r,t,n))return!0;r=(0,K.parentNode)(r)}return!1})(n,"touchAction",/pan-|pinch|none/)||t.warn(uo,n,so.touchAction)}function vo(e,t){var n=e.element;"resize"===e.prepared.name&&n instanceof ro.default.HTMLElement&&!ho(n,"boxSizing",/border-box/)&&t.warn(co,n,so.boxSizing)}function go(e,t){var n=e.prepared.name;(e.interactable.events.types["".concat(n,"move")]||[]).length||t.warn(fo,n,e.interactable)}function ho(e,t,n){return n.test(e.style[t]||io.default.window.getComputedStyle(e)[t])}no.noListenersMessage=fo;var yo={id:"dev-tools",install:lo};no.default=yo;var mo={};Object.defineProperty(mo,"__esModule",{value:!0}),mo.default=void 0;var bo,wo=(bo=r)&&bo.__esModule?bo:{default:bo};function Oo(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function xo(e){for(var t=0;t<e.states.length;t++){var n=e.states[t];n.methods.start&&(e.state=n).methods.start(e)}}function Po(e,t){return e?{left:t.x-e.left,top:t.y-e.top,right:e.right-t.x,bottom:e.bottom-t.y}:{left:0,top:0,right:0,bottom:0}}function _o(e,t,n){var r=e.interaction,o=e.phase,i=r.interactable,a=r.element,s=Mo(zo(r,n)),l=(0,wo.default)({},r.rect);"width"in l||(l.width=l.right-l.left),"height"in l||(l.height=l.bottom-l.top);var u=Po(l,t);r.modifiers.startOffset=u,r.modifiers.startDelta={x:0,y:0};var c={interaction:r,interactable:i,element:a,pageCoords:t,phase:o,rect:l,startOffset:u,states:s,preEnd:!1,requireEndOnly:!1};return r.modifiers.states=s,r.modifiers.result=null,xo(c),c.pageCoords=(0,wo.default)({},r.coords.start.page),r.modifiers.result=jo(c)}function jo(e){var t=e.interaction,n=e.prevCoords,r=void 0===n?t.modifiers.result?t.modifiers.result.coords:t.coords.prev.page:n,o=e.phase,i=e.preEnd,a=e.requireEndOnly,s=e.rect,l=e.skipModifiers?e.states.slice(t.modifiers.skip):e.states;e.coords=(0,wo.default)({},e.pageCoords),e.rect=(0,wo.default)({},s);for(var u={delta:{x:0,y:0},coords:e.coords,changed:!0},c=0;c<l.length;c++){var f=l[c],d=f.options;f.methods.set&&Io(d,i,a,o)&&(e.state=f).methods.set(e)}return u.delta.x=e.coords.x-e.pageCoords.x,u.delta.y=e.coords.y-e.pageCoords.y,u.changed=r.x!==u.coords.x||r.y!==u.coords.y,u}function Mo(e){for(var t=[],n=0;n<e.length;n++){var r=e[n],o=r.options,i=r.methods,a=r.name;if(!o||!1!==o.enabled){var s={options:o,methods:i,index:n,name:a};t.push(s)}}return t}function Eo(e){var t=e.interaction,n=e.phase,r=e.preEnd,o=e.skipModifiers,i=t.interactable,a=t.element,s=jo({interaction:t,interactable:i,element:a,preEnd:r,phase:n,pageCoords:t.coords.cur.page,rect:i.getRect(a),states:t.modifiers.states,requireEndOnly:!1,skipModifiers:o});if(!(t.modifiers.result=s).changed&&t.interacting())return!1}function So(e){var t=e.interaction,n=e.event,r=e.noPreEnd,o=t.modifiers.states;if(!r&&o&&o.length)for(var i=!1,a=0;a<o.length;a++){var s=o[a],l=(e.state=s).options,u=s.methods;if(!1===(u.beforeEnd&&u.beforeEnd(e)))return!1;!i&&Io(l,!0,!0)&&(t.move({event:n,preEnd:!0}),i=!0)}}function To(e){var t=e.interaction,n=t.modifiers.states;if(n&&n.length){var r=(0,wo.default)({states:n,interactable:t.interactable,element:t.element},e);ko(e);for(var o=0;o<n.length;o++){var i=n[o];(r.state=i).methods.stop&&i.methods.stop(r)}e.interaction.modifiers.states=null}}function Do(e){var t=e.interaction,n=e.phase,r=e.curCoords||t.coords.cur,o=e.startCoords||t.coords.start,i=t.modifiers,a=i.result,s=i.startDelta,l=a.delta;"start"===n&&(0,wo.default)(t.modifiers.startDelta,a.delta);for(var u=[[o,s],[r,l]],c=0;c<u.length;c++){var f=Oo(u[c],2),d=f[0],p=f[1];d.page.x+=p.x,d.page.y+=p.y,d.client.x+=p.x,d.client.y+=p.y}}function ko(e){var t=e.interaction,n=t.coords,r=t.modifiers;if(r.result)for(var o=r.startDelta,i=r.result.delta,a=[[n.start,o],[n.cur,i]],s=0;s<a.length;s++){var l=Oo(a[s],2),u=l[0],c=l[1];u.page.x-=c.x,u.page.y-=c.y,u.client.x-=c.x,u.client.y-=c.y}}function zo(e,t){var n=e.interactable.options[e.prepared.name],r=n.modifiers;return r&&r.length?r.map(function(e){return!e.methods&&e.type?t[e.type](e):e}):["snap","snapSize","snapEdges","restrict","restrictEdges","restrictSize"].map(function(e){var t=n[e];return t&&t.enabled&&{options:t,methods:t._methods}}).filter(function(e){return!!e})}function Io(e,t,n,r){return e?!1!==e.enabled&&(t||!e.endOnly)&&(!n||e.endOnly)&&(e.setStart||"start"!==r):!n}var Ao={id:"modifiers/base",install:function(t){var e=t.interactions;t.defaults.perAction.modifiers=[],t.modifiers={},e.signals.on("new",function(e){e.interaction.modifiers={startOffset:{left:0,right:0,top:0,bottom:0},offsets:{},states:null,result:null}}),e.signals.on("before-action-start",function(e){_o(e,e.interaction.coords.start.page,t.modifiers)}),e.signals.on("action-resume",function(e){Eo(e),_o(e,e.interaction.coords.cur.page,t.modifiers)}),e.signals.on("before-action-move",Eo),e.signals.on("before-action-end",So),e.signals.on("before-action-start",Do),e.signals.on("before-action-move",Do),e.signals.on("after-action-start",ko),e.signals.on("after-action-move",ko),e.signals.on("stop",To)},startAll:xo,setAll:jo,prepareStates:Mo,start:_o,beforeMove:Eo,beforeEnd:So,stop:To,shouldDo:Io,getModifierList:zo,getRectOffset:Po,makeModifier:function(e,n){var r=e.defaults,o={start:e.start,set:e.set,beforeEnd:e.beforeEnd,stop:e.stop},t=function(e){for(var t in(e=e||{}).enabled=!1!==e.enabled,r)t in e||(e[t]=r[t]);return{options:e,methods:o,name:n}};return"string"==typeof n&&(Object.defineProperty(t,"name",{value:n}),t._defaults=r,t._methods=o),t}};mo.default=Ao;var Co={};Object.defineProperty(Co,"__esModule",{value:!0}),Co.default=void 0;var Ro=No(mo),Xo=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt),Yo=No(It);function No(e){return e&&e.__esModule?e:{default:e}}function Fo(e,t){var n=Vo(e),r=n.resistance,o=-Math.log(n.endSpeed/t.v0)/r;t.x0=e.prevEvent.page.x,t.y0=e.prevEvent.page.y,t.t0=t.startEvent.timeStamp/1e3,t.sx=t.sy=0,t.modifiedXe=t.xe=(t.vx0-o)/r,t.modifiedYe=t.ye=(t.vy0-o)/r,t.te=o,t.lambda_v0=r/t.v0,t.one_ve_v0=1-n.endSpeed/t.v0}function Lo(e){qo(e),Xo.pointer.setCoordDeltas(e.coords.delta,e.coords.prev,e.coords.cur),Xo.pointer.setCoordVelocity(e.coords.velocity,e.coords.delta);var t=e.inertia,n=Vo(e).resistance,r=e._now()/1e3-t.t0;if(r<t.te){var o=1-(Math.exp(-n*r)-t.lambda_v0)/t.one_ve_v0;if(t.modifiedXe===t.xe&&t.modifiedYe===t.ye)t.sx=t.xe*o,t.sy=t.ye*o;else{var i=Xo.getQuadraticCurvePoint(0,0,t.xe,t.ye,t.modifiedXe,t.modifiedYe,o);t.sx=i.x,t.sy=i.y}e.move(),t.timeout=Yo.default.request(function(){return Lo(e)})}else t.sx=t.modifiedXe,t.sy=t.modifiedYe,e.move(),e.end(t.startEvent),t.active=!1,e.simulation=null;Xo.pointer.copyCoords(e.coords.prev,e.coords.cur)}function Wo(e){qo(e);var t=e.inertia,n=e._now()-t.t0,r=Vo(e).smoothEndDuration;n<r?(t.sx=Xo.easeOutQuad(n,0,t.xe,r),t.sy=Xo.easeOutQuad(n,0,t.ye,r),e.move(),t.timeout=Yo.default.request(function(){return Wo(e)})):(t.sx=t.xe,t.sy=t.ye,e.move(),e.end(t.startEvent),t.smoothEnd=t.active=!1,e.simulation=null)}function qo(e){var t=e.inertia;if(t.active){var n=t.upCoords.page,r=t.upCoords.client;Xo.pointer.setCoords(e.coords.cur,[{pageX:n.x+t.sx,pageY:n.y+t.sy,clientX:r.x+t.sx,clientY:r.y+t.sy}],e._now())}}function Vo(e){var t=e.interactable,n=e.prepared;return t&&t.options&&n.name&&t.options[n.name].inertia}me.EventPhase.Resume="resume",me.EventPhase.InertiaStart="inertiastart";var Go={id:"inertia",install:function(t){var e=t.interactions,n=t.defaults;e.signals.on("new",function(e){e.interaction.inertia={active:!1,smoothEnd:!1,allowResume:!1,upCoords:{},timeout:null}}),e.signals.on("before-action-end",function(e){return function(e,t){var n=e.interaction,r=e.event,o=e.noPreEnd,i=n.inertia;if(!n.interacting()||n.simulation&&n.simulation.active||o)return null;var a,s=Vo(n),l=n._now(),u=n.coords.velocity.client,c=Xo.hypot(u.x,u.y),f=!1,d=s&&s.enabled&&"gesture"!==n.prepared.name&&r!==i.startEvent,p=d&&l-n.coords.cur.timeStamp<50&&c>s.minSpeed&&c>s.endSpeed,v={interaction:n,pageCoords:Xo.extend({},n.coords.cur.page),states:d&&n.modifiers.states.map(function(e){return Xo.extend({},e)}),preEnd:!0,prevCoords:void 0,requireEndOnly:null};return d&&!p&&(v.prevCoords=n.prevEvent.page,v.requireEndOnly=!1,(a=Ro.default.setAll(v)).changed&&(f=!0)),p||f?(Xo.pointer.copyCoords(i.upCoords,n.coords.cur),n.pointers[0].pointer=i.startEvent=new t.InteractEvent(n,r,n.prepared.name,me.EventPhase.InertiaStart,n.element),i.t0=l,i.active=!0,i.allowResume=s.allowResume,n.simulation=i,n.interactable.fire(i.startEvent),p?(i.vx0=n.coords.velocity.client.x,i.vy0=n.coords.velocity.client.y,i.v0=c,Fo(n,i),Xo.extend(v.pageCoords,n.coords.cur.page),v.pageCoords.x+=i.xe,v.pageCoords.y+=i.ye,v.prevCoords=void 0,v.requireEndOnly=!0,a=Ro.default.setAll(v),i.modifiedXe+=a.delta.x,i.modifiedYe+=a.delta.y,i.timeout=Yo.default.request(function(){return Lo(n)})):(i.smoothEnd=!0,i.xe=a.delta.x,i.ye=a.delta.y,i.sx=i.sy=0,i.timeout=Yo.default.request(function(){return Wo(n)})),!1):null}(e,t)}),e.signals.on("down",function(e){return function(e,t){var n=e.interaction,r=e.event,o=e.pointer,i=e.eventTarget,a=n.inertia;if(a.active)for(var s=i;Xo.is.element(s);){if(s===n.element){Yo.default.cancel(a.timeout),a.active=!1,n.simulation=null,n.updatePointer(o,r,i,!0),Xo.pointer.setCoords(n.coords.cur,n.pointers.map(function(e){return e.pointer}),n._now());var l={interaction:n};t.interactions.signals.fire("action-resume",l);var u=new t.InteractEvent(n,r,n.prepared.name,me.EventPhase.Resume,n.element);n._fireEvent(u),Xo.pointer.copyCoords(n.coords.prev,n.coords.cur);break}s=Xo.dom.parentNode(s)}}(e,t)}),e.signals.on("stop",function(e){return function(e){var t=e.interaction,n=t.inertia;n.active&&(Yo.default.cancel(n.timeout),n.active=!1,t.simulation=null)}(e)}),n.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300},t.usePlugin(Ro.default)},calcInertia:Fo,inertiaTick:Lo,smothEndTick:Wo,updateInertiaCoords:qo};Co.default=Go;var Uo={};Object.defineProperty(Uo,"__esModule",{value:!0}),Uo.default=Uo.scope=Uo.interact=void 0;var Bo=f({}),Ho=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt),$o=Qo(q),Ko=Qo(Ue);function Qo(e){return e&&e.__esModule?e:{default:e}}var Jo={},Zo=new Bo.Scope;Uo.scope=Zo;var ei=function(e,t){var n=Zo.interactables.get(e,t);return n||((n=Zo.interactables.new(e,t)).events.global=Jo),n};(Uo.interact=ei).use=function(e,t){return Zo.usePlugin(e,t),ei},ei.isSet=function(e,t){return-1!==Zo.interactables.indexOfElement(e,t&&t.context)},ei.on=function(e,t,n){Ho.is.string(e)&&-1!==e.search(" ")&&(e=e.trim().split(/ +/));if(Ho.is.array(e)){for(var r=0;r<e.length;r++){var o=e[r];ei.on(o,t,n)}return ei}if(Ho.is.object(e)){for(var i in e)ei.on(i,e[i],t);return ei}Ho.arr.contains(Zo.actions.eventTypes,e)?Jo[e]?Jo[e].push(t):Jo[e]=[t]:Ko.default.add(Zo.document,e,t,{options:n});return ei},ei.off=function(e,t,n){Ho.is.string(e)&&-1!==e.search(" ")&&(e=e.trim().split(/ +/));if(Ho.is.array(e)){for(var r=0;r<e.length;r++){var o=e[r];ei.off(o,t,n)}return ei}if(Ho.is.object(e)){for(var i in e)ei.off(i,e[i],t);return ei}var a;Ho.arr.contains(Zo.actions.eventTypes,e)?e in Jo&&-1!==(a=Jo[e].indexOf(t))&&Jo[e].splice(a,1):Ko.default.remove(Zo.document,e,t,n);return ei},ei.debug=function(){return Zo},ei.getPointerAverage=Ho.pointer.pointerAverage,ei.getTouchBBox=Ho.pointer.touchBBox,ei.getTouchDistance=Ho.pointer.touchDistance,ei.getTouchAngle=Ho.pointer.touchAngle,ei.getElementRect=Ho.dom.getElementRect,ei.getElementClientRect=Ho.dom.getElementClientRect,ei.matchesSelector=Ho.dom.matchesSelector,ei.closest=Ho.dom.closest,ei.supportsTouch=function(){return $o.default.supportsTouch},ei.supportsPointerEvent=function(){return $o.default.supportsPointerEvent},ei.stop=function(){for(var e=0;e<Zo.interactions.list.length;e++){var t=Zo.interactions.list[e];t.stop()}return ei},ei.pointerMoveTolerance=function(e){if(Ho.is.number(e))return Zo.interactions.pointerMoveTolerance=e,ei;return Zo.interactions.pointerMoveTolerance},Zo.interactables.signals.on("unset",function(e){var t=e.interactable;Zo.interactables.list.splice(Zo.interactables.list.indexOf(t),1);for(var n=0;n<Zo.interactions.list.length;n++){var r=Zo.interactions.list[n];r.interactable===t&&r.interacting()&&r._ending&&r.stop()}}),ei.addDocument=function(e,t){return Zo.addDocument(e,t)},ei.removeDocument=function(e){return Zo.removeDocument(e)};var ti=Zo.interact=ei;Uo.default=ti;var ni={};Object.defineProperty(ni,"__esModule",{value:!0}),ni.default=void 0;var ri,oi=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v),ii=(ri=ae)&&ri.__esModule?ri:{default:ri};function ai(e,t,n){return oi.func(e)?ii.default.resolveRectLike(e,t.interactable,t.element,[n.x,n.y,t]):ii.default.resolveRectLike(e,t.interactable,t.element)}var si={start:function(e){var t=e.rect,n=e.startOffset,r=e.state,o=r.options.elementRect,i={};t&&o?(i.left=n.left-t.width*o.left,i.top=n.top-t.height*o.top,i.right=n.right-t.width*(1-o.right),i.bottom=n.bottom-t.height*(1-o.bottom)):i.left=i.top=i.right=i.bottom=0,r.offset=i},set:function(e){var t=e.coords,n=e.interaction,r=e.state,o=r.options,i=r.offset,a=ai(o.restriction,n,t);if(!a)return r;var s=a;"x"in a&&"y"in a?(t.x=Math.max(Math.min(s.x+s.width-i.right,t.x),s.x+i.left),t.y=Math.max(Math.min(s.y+s.height-i.bottom,t.y),s.y+i.top)):(t.x=Math.max(Math.min(s.right-i.right,t.x),s.left+i.left),t.y=Math.max(Math.min(s.bottom-i.bottom,t.y),s.top+i.top))},getRestrictionRect:ai,defaults:{enabled:!1,restriction:null,elementRect:null}};ni.default=si;var li={};Object.defineProperty(li,"__esModule",{value:!0}),li.default=void 0;var ui=fi(r),ci=fi(ae);function fi(e){return e&&e.__esModule?e:{default:e}}var di=fi(ni).default.getRestrictionRect,pi={top:1/0,left:1/0,bottom:-1/0,right:-1/0},vi={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function gi(e,t){for(var n=["top","left","bottom","right"],r=0;r<n.length;r++){var o=n[r];o in e||(e[o]=t[o])}return e}var hi={noInner:pi,noOuter:vi,getRestrictionRect:di,start:function(e){var t,n=e.interaction,r=e.state,o=r.options,i=n.modifiers.startOffset;if(o){var a=di(o.offset,n,n.coords.start.page);t=ci.default.rectToXY(a)}t=t||{x:0,y:0},r.offset={top:t.y+i.top,left:t.x+i.left,bottom:t.y-i.bottom,right:t.x-i.right}},set:function(e){var t=e.coords,n=e.interaction,r=e.state,o=r.offset,i=r.options,a=n.prepared._linkedEdges||n.prepared.edges;if(a){var s=(0,ui.default)({},t),l=di(i.inner,n,s)||{},u=di(i.outer,n,s)||{};gi(l,pi),gi(u,vi),a.top?t.y=Math.min(Math.max(u.top+o.top,s.y),l.top+o.top):a.bottom&&(t.y=Math.max(Math.min(u.bottom+o.bottom,s.y),l.bottom+o.bottom)),a.left?t.x=Math.min(Math.max(u.left+o.left,s.x),l.left+o.left):a.right&&(t.x=Math.max(Math.min(u.right+o.right,s.x),l.right+o.right))}},defaults:{enabled:!1,inner:null,outer:null,offset:null}};li.default=hi;var yi={};Object.defineProperty(yi,"__esModule",{value:!0}),yi.default=void 0;var mi=Oi(r),bi=Oi(ae),wi=Oi(li);function Oi(e){return e&&e.__esModule?e:{default:e}}var xi={width:-1/0,height:-1/0},Pi={width:1/0,height:1/0};var _i={start:function(e){return wi.default.start(e)},set:function(e){var t=e.interaction,n=e.state,r=n.options,o=t.prepared.linkedEdges||t.prepared.edges;if(o){var i=bi.default.xywhToTlbr(t.resizeRects.inverted),a=bi.default.tlbrToXywh(wi.default.getRestrictionRect(r.min,t))||xi,s=bi.default.tlbrToXywh(wi.default.getRestrictionRect(r.max,t))||Pi;n.options={enabled:r.enabled,endOnly:r.endOnly,inner:(0,mi.default)({},wi.default.noInner),outer:(0,mi.default)({},wi.default.noOuter)},o.top?(n.options.inner.top=i.bottom-a.height,n.options.outer.top=i.bottom-s.height):o.bottom&&(n.options.inner.bottom=i.top+a.height,n.options.outer.bottom=i.top+s.height),o.left?(n.options.inner.left=i.right-a.width,n.options.outer.left=i.right-s.width):o.right&&(n.options.inner.right=i.left+a.width,n.options.outer.right=i.left+s.width),wi.default.set(e),n.options=r}},defaults:{enabled:!1,min:null,max:null}};yi.default=_i;var ji={};Object.defineProperty(ji,"__esModule",{value:!0}),ji.default=void 0;var Mi=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt);var Ei={start:function(e){var t,n=e.interaction,r=e.interactable,o=e.element,i=e.rect,a=e.state,s=e.startOffset,l=a.options,u=[],c=Mi.rect.rectToXY(Mi.rect.resolveRectLike(l.origin))||Mi.getOriginXY(r,o,n.prepared.name);if("startCoords"===l.offset)t={x:n.coords.start.page.x-c.x,y:n.coords.start.page.y-c.y};else{var f=Mi.rect.resolveRectLike(l.offset,r,o,[n]);t=Mi.rect.rectToXY(f)||{x:0,y:0}}var d=l.relativePoints||[];if(i&&l.relativePoints&&l.relativePoints.length)for(var p=0;p<d.length;p++){var v=d[p];u.push({index:p,relativePoint:v,x:s.left-i.width*v.x+t.x,y:s.top-i.height*v.y+t.y})}else u.push(Mi.extend({index:0,relativePoint:null},t));a.offsets=u},set:function(e){var t,n,r=e.interaction,o=e.coords,i=e.state,a=i.options,s=i.offsets,l=Mi.getOriginXY(r.interactable,r.element,r.prepared.name),u=Mi.extend({},o),c=[];u.x-=l.x,u.y-=l.y,i.realX=u.x,i.realY=u.y;for(var f=a.targets&&a.targets.length,d=0;d<s.length;d++)for(var p=s[d],v=u.x-p.x,g=u.y-p.y,h=0;h<a.targets.length;h++){var y=a.targets[h];(t=Mi.is.func(y)?y(v,g,r,p,h):y)&&c.push({x:Mi.is.number(t.x)?t.x+p.x:v,y:Mi.is.number(t.y)?t.y+p.y:g,range:Mi.is.number(t.range)?t.range:a.range})}var m={target:null,inRange:!1,distance:0,range:0,dx:0,dy:0};for(n=0,f=c.length;n<f;n++){var b=(t=c[n]).range,w=t.x-u.x,O=t.y-u.y,x=Mi.hypot(w,O),P=x<=b;b===1/0&&m.inRange&&m.range!==1/0&&(P=!1),m.target&&!(P?m.inRange&&b!==1/0?x/b<m.distance/m.range:b===1/0&&m.range!==1/0||x<m.distance:!m.inRange&&x<m.distance)||(m.target=t,m.distance=x,m.range=b,m.inRange=P,m.dx=w,m.dy=O,i.range=b)}m.inRange&&(o.x=m.target.x,o.y=m.target.y),i.closest=m},defaults:{enabled:!1,range:1/0,targets:null,offset:null,relativePoints:null}};ji.default=Ei;var Si={};Object.defineProperty(Si,"__esModule",{value:!0}),Si.default=void 0;var Ti=zi(r),Di=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v),ki=zi(ji);function zi(e){return e&&e.__esModule?e:{default:e}}function Ii(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var Ai={start:function(e){var t=e.interaction,n=e.state,r=n.options,o=t.prepared.edges;if(!o)return null;e.state={options:{relativePoints:[{x:o.left?0:1,y:o.top?0:1}],origin:{x:0,y:0},offset:r.offset||"self",range:r.range}},n.targetFields=n.targetFields||[["width","height"],["x","y"]],ki.default.start(e),n.offsets=e.state.offsets,e.state=n},set:function(e){var t=e.interaction,n=e.state,r=e.coords,o=n.options,i=n.offsets,a={x:r.x-i[0].x,y:r.y-i[0].y};n.options=(0,Ti.default)({},o),n.options.targets=[];for(var s=0;s<(o.targets||[]).length;s++){var l=(o.targets||[])[s],u=void 0;if(u=Di.func(l)?l(a.x,a.y,t):l){for(var c=0;c<n.targetFields.length;c++){var f=Ii(n.targetFields[c],2),d=f[0],p=f[1];if(d in u||p in u){u.x=u[d],u.y=u[p];break}}n.options.targets.push(u)}}ki.default.set(e),n.options=o},defaults:{enabled:!1,range:1/0,targets:null,offset:null}};Si.default=Ai;var Ci={};Object.defineProperty(Ci,"__esModule",{value:!0}),Ci.default=void 0;var Ri=Ni(Te),Xi=Ni(r),Yi=Ni(Si);function Ni(e){return e&&e.__esModule?e:{default:e}}var Fi={start:function(e){var t=e.interaction.prepared.edges;return t?(e.state.targetFields=e.state.targetFields||[[t.left?"left":"right",t.top?"top":"bottom"]],Yi.default.start(e)):null},set:function(e){return Yi.default.set(e)},defaults:(0,Xi.default)((0,Ri.default)(Yi.default.defaults),{offset:{x:0,y:0}})};Ci.default=Fi;var Li={};Object.defineProperty(Li,"__esModule",{value:!0}),Li.restrictSize=Li.restrictEdges=Li.restrict=Li.snapEdges=Li.snapSize=Li.snap=void 0;var Wi=$i(mo),qi=$i(li),Vi=$i(ni),Gi=$i(yi),Ui=$i(Ci),Bi=$i(ji),Hi=$i(Si);function $i(e){return e&&e.__esModule?e:{default:e}}var Ki=Wi.default.makeModifier,Qi=Ki(Bi.default,"snap");Li.snap=Qi;var Ji=Ki(Hi.default,"snapSize");Li.snapSize=Ji;var Zi=Ki(Ui.default,"snapEdges");Li.snapEdges=Zi;var ea=Ki(Vi.default,"restrict");Li.restrict=ea;var ta=Ki(qi.default,"restrictEdges");Li.restrictEdges=ta;var na=Ki(Gi.default,"restrictSize");Li.restrictSize=na;var ra={};Object.defineProperty(ra,"__esModule",{value:!0}),ra.default=void 0;var oa,ia=(oa=Re)&&oa.__esModule?oa:{default:oa};function aa(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var sa=function(){function l(e,t,n,r,o,i){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),this.propagationStopped=!1,this.immediatePropagationStopped=!1,ia.default.pointerExtend(this,n),n!==t&&ia.default.pointerExtend(this,t),this.interaction=o,this.timeStamp=i,this.originalEvent=n,this.type=e,this.pointerId=ia.default.getPointerId(t),this.pointerType=ia.default.getPointerType(t),this.target=r,this.currentTarget=null,"tap"===e){var a=o.getPointerIndex(t);this.dt=this.timeStamp-o.pointers[a].downTime;var s=this.timeStamp-o.tapTime;this.double=!!(o.prevTap&&"doubletap"!==o.prevTap.type&&o.prevTap.target===this.target&&s<500)}else"doubletap"===e&&(this.dt=t.timeStamp-o.tapTime)}return function(e,t,n){t&&aa(e.prototype,t),n&&aa(e,n)}(l,[{key:"subtractOrigin",value:function(e){var t=e.x,n=e.y;return this.pageX-=t,this.pageY-=n,this.clientX-=t,this.clientY-=n,this}},{key:"addOrigin",value:function(e){var t=e.x,n=e.y;return this.pageX+=t,this.pageY+=n,this.clientX+=t,this.clientY+=n,this}},{key:"preventDefault",value:function(){this.originalEvent.preventDefault()}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),l}();ra.default=sa;var la={};Object.defineProperty(la,"__esModule",{value:!0}),la.default=void 0;var ua,ca=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(Yt),fa=(ua=ra)&&ua.__esModule?ua:{default:ua};var da=new ca.Signals,pa=["down","up","cancel"],va=["down","up","cancel"],ga={id:"pointer-events/base",install:function(g){var e=g.interactions;g.pointerEvents=ga,g.defaults.actions.pointerEvents=ga.defaults,e.signals.on("new",function(e){var t=e.interaction;t.prevTap=null,t.tapTime=0}),e.signals.on("update-pointer",function(e){var t=e.down,n=e.pointerInfo;!t&&n.hold||(n.hold={duration:1/0,timeout:null})}),e.signals.on("move",function(e){var t=e.interaction,n=e.pointer,r=e.event,o=e.eventTarget,i=e.duplicateMove,a=t.getPointerIndex(n);i||t.pointerIsDown&&!t.pointerWasMoved||(t.pointerIsDown&&clearTimeout(t.pointers[a].hold.timeout),ha({interaction:t,pointer:n,event:r,eventTarget:o,type:"move"},g))}),e.signals.on("down",function(e){for(var t=e.interaction,n=e.pointer,r=e.event,o=e.eventTarget,i=e.pointerIndex,a=t.pointers[i].hold,s=ca.dom.getPath(o),l={interaction:t,pointer:n,event:r,eventTarget:o,type:"hold",targets:[],path:s,element:null},u=0;u<s.length;u++){var c=s[u];l.element=c,da.fire("collect-targets",l)}if(l.targets.length){for(var f=1/0,d=0;d<l.targets.length;d++){var p=l.targets[d],v=p.eventable.options.holdDuration;v<f&&(f=v)}a.duration=f,a.timeout=setTimeout(function(){ha({interaction:t,eventTarget:o,pointer:n,event:r,type:"hold"},g)},f)}});for(var t=["up","cancel"],n=0;n<t.length;n++){var r=t[n];e.signals.on(r,function(e){var t=e.interaction,n=e.pointerIndex;t.pointers[n].hold&&clearTimeout(t.pointers[n].hold.timeout)})}for(var o=0;o<pa.length;o++)e.signals.on(pa[o],ma(va[o],g));e.signals.on("up",function(e){var t=e.interaction,n=e.pointer,r=e.event,o=e.eventTarget;t.pointerWasMoved||ha({interaction:t,eventTarget:o,pointer:n,event:r,type:"tap"},g)})},signals:da,PointerEvent:fa.default,fire:ha,collectEventTargets:ya,createSignalListener:ma,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:["down","move","up","cancel","tap","doubletap","hold"]};function ha(e,t){for(var n=e.interaction,r=e.pointer,o=e.event,i=e.eventTarget,a=e.type,s=void 0===a?e.pointerEvent.type:a,l=e.targets,u=void 0===l?ya(e):l,c=e.pointerEvent,f=void 0===c?new fa.default(s,r,o,i,n,t.now()):c,d={interaction:n,pointer:r,event:o,eventTarget:i,targets:u,type:s,pointerEvent:f},p=0;p<u.length;p++){var v=u[p];for(var g in v.props||{})f[g]=v.props[g];var h=ca.getOriginXY(v.eventable,v.element);if(f.subtractOrigin(h),f.eventable=v.eventable,f.currentTarget=v.element,v.eventable.fire(f),f.addOrigin(h),f.immediatePropagationStopped||f.propagationStopped&&p+1<u.length&&u[p+1].element!==f.currentTarget)break}if(da.fire("fired",d),"tap"===s){var y=f.double?ha({interaction:n,pointer:r,event:o,eventTarget:i,type:"doubletap"},t):f;n.prevTap=y,n.tapTime=y.timeStamp}return f}function ya(e){var t=e.interaction,n=e.pointer,r=e.event,o=e.eventTarget,i=e.type,a=t.getPointerIndex(n),s=t.pointers[a];if("tap"===i&&(t.pointerWasMoved||!s||s.downTarget!==o))return[];for(var l=ca.dom.getPath(o),u={interaction:t,pointer:n,event:r,eventTarget:o,type:i,path:l,targets:[],element:null},c=0;c<l.length;c++){var f=l[c];u.element=f,da.fire("collect-targets",u)}return"hold"===i&&(u.targets=u.targets.filter(function(e){return e.eventable.options.holdDuration===t.pointers[a].hold.duration})),u.targets}function ma(o,i){return function(e){var t=e.interaction,n=e.pointer,r=e.event;ha({interaction:t,eventTarget:e.eventTarget,pointer:n,event:r,type:o},i)}}var ba=ga;la.default=ba;var wa={};Object.defineProperty(wa,"__esModule",{value:!0}),wa.default=void 0;var Oa,xa=(Oa=la)&&Oa.__esModule?Oa:{default:Oa};function Pa(e){var t=e.pointerEvent;"hold"===t.type&&(t.count=(t.count||0)+1)}function _a(e){var t=e.interaction;t.holdIntervalHandle&&(clearInterval(t.holdIntervalHandle),t.holdIntervalHandle=null)}var ja={id:"pointer-events/holdRepeat",install:function(t){var e=t.pointerEvents,n=t.interactions;t.usePlugin(xa.default),e.signals.on("new",Pa),e.signals.on("fired",function(e){return function(e,t){var n=e.interaction,r=e.pointerEvent,o=e.eventTarget,i=e.targets;if("hold"===r.type&&i.length){var a=i[0].eventable.options.holdRepeatInterval;a<=0||(n.holdIntervalHandle=setTimeout(function(){t.pointerEvents.fire({interaction:n,eventTarget:o,type:"hold",pointer:r,event:r},t)},a))}}(e,t)});for(var r=["move","up","cancel","endall"],o=0;o<r.length;o++){var i=r[o];n.signals.on(i,_a)}e.defaults.holdRepeatInterval=0,e.types.push("holdrepeat")}};wa.default=ja;var Ma={};Object.defineProperty(Ma,"__esModule",{value:!0}),Ma.default=void 0;var Ea,Sa=(Ea=r)&&Ea.__esModule?Ea:{default:Ea},Ta=function(e){{if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}}(v);function Da(e){return(0,Sa.default)(this.events.options,e),this}var ka={id:"pointer-events/interactableTargets",install:function(t){var r=t.pointerEvents,e=t.actions,n=t.Interactable,o=t.interactables;r.signals.on("collect-targets",function(e){var r=e.targets,o=e.element,i=e.type,a=e.eventTarget;t.interactables.forEachMatch(o,function(e){var t=e.events,n=t.options;t.types[i]&&t.types[i].length&&Ta.element(o)&&e.testIgnoreAllow(n,o,a)&&r.push({element:o,eventable:t,props:{interactable:e}})})}),o.signals.on("new",function(e){var t=e.interactable;t.events.getRect=function(e){return t.getRect(e)}}),o.signals.on("set",function(e){var t=e.interactable,n=e.options;(0,Sa.default)(t.events.options,r.defaults),(0,Sa.default)(t.events.options,n.pointerEvents||{})}),(0,s.merge)(e.eventTypes,r.types),n.prototype.pointerEvents=Da;var i=n.prototype._backCompatOption;n.prototype._backCompatOption=function(e,t){var n=i.call(this,e,t);return n===this&&(this.events.options[e]=t),n}}};Ma.default=ka;var za={};Object.defineProperty(za,"__esModule",{value:!0}),za.install=function(e){Ia.default.install(e),Aa.default.install(e),Ca.default.install(e)},Object.defineProperty(za,"pointerEvents",{enumerable:!0,get:function(){return Ia.default}}),Object.defineProperty(za,"holdRepeat",{enumerable:!0,get:function(){return Aa.default}}),Object.defineProperty(za,"interactableTargets",{enumerable:!0,get:function(){return Ca.default}}),za.id=void 0;var Ia=Ra(la),Aa=Ra(wa),Ca=Ra(Ma);function Ra(e){return e&&e.__esModule?e:{default:e}}za.id="pointer-events";var Xa={};Object.defineProperty(Xa,"__esModule",{value:!0}),Xa.install=Na,Xa.default=void 0;var Ya=E({});function Na(n){for(var e=n.actions,t=n.interactions,r=n.Interactable,o=0;o<e.names.length;o++){var i=e.names[o];e.eventTypes.push("".concat(i,"reflow"))}t.signals.on("stop",function(e){var t=e.interaction;"reflow"===t.pointerType&&(t._reflowResolve&&t._reflowResolve(),Yt.arr.remove(n.interactions.list,t))}),r.prototype.reflow=function(e){return function(s,l,u){for(var c=Yt.is.string(s.target)?Yt.arr.from(s._context.querySelectorAll(s.target)):[s.target],f=Yt.win.window.Promise,d=f?[]:null,e=function(){var t=c[p],e=s.getRect(t);if(!e)return"break";var n=Yt.arr.find(u.interactions.list,function(e){return e.interacting()&&e.interactable===s&&e.element===t&&e.prepared.name===l.name}),r=void 0;if(n)n.move(),d&&(r=n._reflowPromise||new f(function(e){n._reflowResolve=e}));else{var o=Yt.rect.tlbrToXywh(e),i={page:{x:o.x,y:o.y},client:{x:o.x,y:o.y},timeStamp:u.now()},a=Yt.pointer.coordsToEvent(i);r=function(e,t,n,r,o){var i=(0,Ya.newInteraction)({pointerType:"reflow"},e),a={interaction:i,event:o,pointer:o,eventTarget:n,phase:"reflow"};i.interactable=t,i.element=n,i.prepared=(0,Yt.extend)({},r),i.prevEvent=o,i.updatePointer(o,o,n,!0),i._doPhase(a);var s=Yt.win.window.Promise?new Yt.win.window.Promise(function(e){i._reflowResolve=e}):null;i._reflowPromise=s,i.start(r,t,n),i._interacting?(i.move(a),i.end(o)):i.stop();return i.removePointer(o,o),i.pointerIsDown=!1,s}(u,s,t,l,a)}d&&d.push(r)},p=0;p<c.length;p++){var t=e();if("break"===t)break}return d&&f.all(d).then(function(){return s})}(this,e,n)}}var Fa={id:"reflow",install:Na};Xa.default=Fa;var La={};Object.defineProperty(La,"__esModule",{value:!0}),La.init=ts,Object.defineProperty(La,"autoScroll",{enumerable:!0,get:function(){return qa.default}}),Object.defineProperty(La,"interactablePreventDefault",{enumerable:!0,get:function(){return Ga.default}}),Object.defineProperty(La,"inertia",{enumerable:!0,get:function(){return Ba.default}}),Object.defineProperty(La,"modifiers",{enumerable:!0,get:function(){return $a.default}}),Object.defineProperty(La,"reflow",{enumerable:!0,get:function(){return Qa.default}}),Object.defineProperty(La,"interact",{enumerable:!0,get:function(){return Ja.default}}),La.pointerEvents=La.actions=La.default=void 0;var Wa=es(Zn);La.actions=Wa;var qa=Za(ir),Va=es(Vr),Ga=Za($r),Ua=Za(no),Ba=Za(Co),Ha=es(Li),$a=Za(mo),Ka=es(za);La.pointerEvents=Ka;var Qa=Za(Xa),Ja=es(Uo);function Za(e){return e&&e.__esModule?e:{default:e}}function es(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function ts(e){for(var t in Ja.scope.init(e),Ja.default.use(Ga.default),Ja.default.use(Ba.default),Ja.default.use(Ka),Ja.default.use(Va),Ja.default.use(Wa),Ja.default.use($a.default),Ha){var n=Ha[t],r=n._defaults,o=n._methods;r._methods=o,Ja.scope.defaults.perAction[t]=r}return Ja.default.use(qa.default),Ja.default.use(Qa.default),Ja.default.use(Ua.default),Ja.default}Ja.default.version=ts.version="1.4.0-rc.4";var ns=Ja.default;La.default=ns;var rs={};function os(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}Object.defineProperty(rs,"__esModule",{value:!0}),rs.default=void 0;var is=function(v){var g=[["x","y"],["left","top"],["right","bottom"],["width","height"]].filter(function(e){var t=os(e,2),n=t[0],r=t[1];return n in v||r in v});return function(e,t){for(var n=v.range,r=v.limits,o=void 0===r?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:r,i=v.offset,a=void 0===i?{x:0,y:0}:i,s={range:n},l=0;l<g.length;l++){var u=os(g[l],2),c=u[0],f=u[1],d=Math.round((e-a.x)/v[c]),p=Math.round((t-a.y)/v[f]);s[c]=Math.max(o.left,Math.min(o.right,d*v[c]+a.x)),s[f]=Math.max(o.top,Math.min(o.bottom,p*v[f]+a.y))}return s}};rs.default=is;var as={};Object.defineProperty(as,"__esModule",{value:!0}),Object.defineProperty(as,"grid",{enumerable:!0,get:function(){return ls.default}});var ss,ls=(ss=rs)&&ss.__esModule?ss:{default:ss};var us={exports:{}};Object.defineProperty(us.exports,"__esModule",{value:!0}),us.exports.init=ys,us.exports.default=void 0;var cs,fs=gs(La),ds=gs(Li),ps=(cs=r)&&cs.__esModule?cs:{default:cs},vs=gs(as);function gs(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}function hs(e){return(hs="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ys(e){return(0,fs.init)(e),fs.default.use({id:"interactjs",install:function(e){fs.default.modifiers=(0,ps.default)(e.modifiers,ds),fs.default.snappers=vs,fs.default.createSnapGrid=fs.default.snappers.grid}})}"object"===("undefined"==typeof window?"undefined":hs(window))&&window&&ys(window);var ms=fs.default;return us.exports.default=ms,fs.default.default=fs.default,fs.default.init=ys,"object"===hs(us)&&us&&(us.exports=fs.default),us=us.exports});
"use strict"

///////////////////////////////////////////////////////////
// Simple Javascript Search Engine
//
// This rather simple search engine allows for inexact
// keyword search in a body of plain text documents.
//


let createSearchEngine = function() {
let module = {};


// Configuration of the search engine module.
module.config = {
		"maxreldist":    0.3,   // maximal relative distance between search key and word
		"minwordlength": 2,     // minimal word length
	};


// The two following variables represents the full state of the search
// engine. They can be serialized to JSON in order to preserve the state,
// i.e., to load a data base at startup.

// dictionary of document IDs mapped to number of words in the document
module.doclength = {};

// dictionary of words mapped to word counts and number of documents using the word
module.dictionary = {};


// Tokenize an input string into words, discard white space and rubbish.
module.tokenize = function(s)
{
	let words = s.toLowerCase().match(/[a-z0-9äöüß-]+\w+/g);
	let ret = [];
	for (let i=0; i<words.length; i++)
	{
		let w = words[i];
		if (w.length < module.config.minwordlength) continue;
		ret.push(w);
	}
	return ret;
}

// Compute an asymmetric variant of the Levenshtein distance between
// a word and a search key. The value is computed with the
// Wagner-Fischer algorithm, but deletions from the word are counted
// only as 1/2.
function distance(word, key)
{
	let prev = [];
	for (let i=0; i<=word.length; i++) prev.push(i);

	for (let j=1; j<=key.length; j++)
	{
		let dist = [j];
		for (let i=1; i<=word.length; i++)
		{
			dist.push(Math.min(Math.min(
					prev[i-1] + ((word[i-1] == key[j-1]) ? 0 : 1),
					prev[i] + 1),
					dist[i-1] + 0.5));
		}
		prev = dist;
	}

	return prev.pop();
}

// Compute a score of a match between a keyword and a search term
// based on the length of the word, the Levenshtein distance, the number
// of occurrences of the word in a document, and the number of documents
// in which the keyword occurs.
function score(length, distance, count, docs)
{
	let relevance = Math.min(1.0, 1.0 / (docs + 3)) * length / (length + 8 * distance);
	return count * relevance * relevance;
}


// Reset the search engine, i.e., make it forget all calls to "add".
module.clear = function()
{
	module.doclength = {};
	module.dictionary = {};
}

// Add a new document with given content to the data base. The document
// is identified by a string ID, which is returned in search results.
// Adding the same document ID twice results in an error.
module.add = function(id, content)
{
	if (module.doclength.hasOwnProperty(id)) throw "[searchengine] document ID is already in use";
	let tokens = module.tokenize(content);
	module.doclength[id] = tokens.length;
	for (let i=0; i<tokens.length; i++)
	{
		let t = tokens[i];
		if (! module.dictionary.hasOwnProperty(t)) module.dictionary[t] = {"docs": {}, "numdocs": 0};
		let worddata = module.dictionary[t];
		if (! worddata.docs.hasOwnProperty(id))
		{
			worddata.numdocs++;
			worddata.docs[id] = 0;
		}
		worddata.docs[id]++;
	}
}

// Search the documents. The function returns an array of at most n
// result objects with fields id, score, and matches.
module.find = function(keys, n = 10)
{
	if (typeof keys == "string") keys = module.tokenize(keys);
	if (keys.length == 0) return [];

	// compute a document score based on fuzzy matches of keywords
	let resultdict = {};
	for (let i=0; i<keys.length; i++)
	{
		let key = keys[i];
		for (let word in module.dictionary)
		{
			if (! module.dictionary.hasOwnProperty(word)) continue;
			let threshold = Math.floor(module.config.maxreldist * word.length);
			let dist = distance(word, key);
			if (dist > threshold) continue;
			let worddata = module.dictionary[word];
			let num = worddata.numdocs;
			for (let id in worddata.docs)
			{
				if (! worddata.docs.hasOwnProperty(id)) continue;
				if (! resultdict.hasOwnProperty(id)) resultdict[id] = {"id": id, "score": 0.0, "matches": {}};
				let s = score(word.length, dist, worddata.docs[id], num);
				resultdict[id].score += s
				if (! resultdict[id].matches.hasOwnProperty(word)) resultdict[id].matches[word] = 0.0;
				resultdict[id].matches[word] += s;
			}
		}
	}

	// compile a results array
	let resultarray = [];
	for (let id in resultdict)
	{
		if (! resultdict.hasOwnProperty(id)) continue;
		let result = resultdict[id];
		result.score = Math.log(result.score) / Math.log(module.doclength[id]);
		resultarray.push(result);
	}

	// return the best n results
	resultarray.sort(function(lhs, rhs){ return rhs.score - lhs.score; });   // higher score is better
	return resultarray.slice(0, n);
}


return module;
};

let searchengine = createSearchEngine();   // default instance
"use strict"

///////////////////////////////////////////////////////////
// TScript documentation
//

let doc = (function() {

// define the central documentation data object, to be extended in other files
let module = { "id": "", "name": "TScript Documentation", "title": "TScript Documentation", "children": [], "content":
`
<p>
Welcome to TScript!
</p>
<p>
TScript (&quot;teaching-script&quot;) is a programming language created
specifically for programming beginners. Its clean design yields a smooth
learning experience. It offers simple graphics manipulation
environments, which greatly boost motivation and stimulate a playful and
explorative learning style.
</p>

<h2>Overview</h2>
<p>
Being a reference documentation, this collection of documents is not
designed for being read front to end, but rather as a resource for
looking up information. For programmers experienced with other
programming languages, the section
<a href="#/concepts">core concepts</a> is a good starting point, the
<a href="#/cheatsheet">cheat sheet</a> provides the most
important bits in compact form, and for the impatient there are a few
<a href="#/examples">examples</a>.
</p>
`
};

let docpath = "";
let doctree = null;


// This function copies #text to the clipboard when run
// from within an event handler.
function toClipboard(text)
{
	// dummy text area
	let textarea = document.createElement("textarea");
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();

	try
	{
		// actual copy
		document.execCommand('copy');
	}
	catch (err)
	{
		// ignore
	}

	// cleanup
	document.body.removeChild(textarea);
}

function docinfo(value, node_id)
{
	let ret = { "children": [], "ids": [] };

	if (value === null)
	{
		ret.children.push(doc);
		ret.ids.push("");
	}
	else
	{
		ret.opened = (node_id.split("/").length <= 2) || (docpath.substr(0, node_id.length) == node_id);
		for (var i=0; i<value.children.length; i++)
		{
			ret.children.push(value.children[i]);
			ret.ids.push(node_id + "/" + value.children[i].id);
		}
		ret.element = tgui.createElement({"type": "span"});
		tgui.createElement({
				"type": "span",
				"parent": ret.element,
				"classname": (node_id == docpath ? "entry current" : "entry"),
				"text": value.name,
			});
	}

	return ret;
}

// tokenizer for EBNF, compatible with the lexer interface
let get_token_ebnf = function(state)
{
	let c = state.current();
	if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
	{
		// parse an identifier or a keyword
		state.advance();
		while (state.good())
		{
			let c = state.current();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_' || c == '-') state.advance();
			else break;
		}
		return { "type": "identifier" };
	}
	else if (c == '\"')
	{
		// parse string literal
		state.advance();
		while (true)
		{
			if (! state.good()) state.error("syntax error in string literal; closing double quotes '\"' expected");
			let c = state.current();
			if (c == '\r' || c == '\n') state.error("syntax error in string literal; closing double quotes '\"' expected before end-of-line");
			else if (c == '\"')
			{
				state.advance();
				break;
			}
			else state.advance();
		}
		return { "type": "literal" };
	}
	else if (c == '\'')
	{
		// parse string literal
		state.advance();
		while (true)
		{
			if (! state.good()) state.error("syntax error in string literal; closing single quotes ' expected");
			let c = state.current();
			if (c == '\r' || c == '\n') state.error("syntax error in string literal; closing double quotes '\"' expected before end-of-line");
			else if (c == '\'')
			{
				state.advance();
				break;
			}
			else state.advance();
		}
		return { "type": "literal" };
	}
	else if (c == '$')
	{
		// parse special
		state.advance();
		while (true)
		{
			if (! state.good()) state.error("syntax error in special; closing dollar sigh '$' expected");
			let c = state.current();
			state.advance();
			if (c == '$') break;
		}
		return { "type": "special" };
	}
	else
	{
		// all the rest, including operators
		state.advance();
		if ("=-*|".indexOf(c) >= 0) return { "type": "operator" };
		if ("()[]{}".indexOf(c) >= 0) return { "type": "grouping" };
		if (";".indexOf(c) >= 0) return { "type": "delimiter" };
		state.error("EBNF syntax error; invalid character '" + c + "'");
	}
}

let get_token_code = function(state)
{
	if (state.current() == '#')
	{
		state.advance();
		if (state.current() == '*')
		{
			state.advance();
			while ((state.current() != '*' || state.next() != '#') && state.current() != "") state.advance();
			state.advance(2);
			return { "type": "comment" };
		}
		else
		{
			while (state.current() != '\n' && state.current() != "") state.advance();
			state.advance();
			return { "type": "comment" };
		}
	}
	else
	{
		let ret = TScript.get_token(state, true);
		state.advance(ret.code.length);
		return ret;
	}
}

function processCode(code, css_prefix, lex)
{
	const white = " \t\r";
	if (code.indexOf('\n') >= 0)
	{
		// multiple lines: find shared indentation
		let lines = code.split('\n');
		let indent = "";
		let maxlength = 1000000;
		for (let i=0; i<lines.length; i++)
		{
			let line = lines[i];
			if (maxlength >= 1000000)
			{
				for (let j=0; j<line.length; j++)
				{
					if (white.indexOf(line[j]) < 0)
					{
						indent = line.substr(0, j);
						maxlength = j;
						break;
					}
				}
			}
			else
			{
				for (let j=0; j<line.length; j++)
				{
					if (j >= maxlength) break;
					if (indent[j] != line[j])
					{
						maxlength = j;
						indent = indent.substr(0, maxlength);
						break;
					}
				}
			}
		}

		// encode lines individually
		let ret = "<div class=\"" + css_prefix + "\"><pre class=\"" + css_prefix + "\">";
		for (let i=0; i<lines.length; i++)
		{
			let line = lines[i];
			if (i == 0 && line.length <= indent.length) continue;
			if (line.length > indent.length) ret += processCode(line.substr(indent.length), css_prefix, lex);
			ret += '\n';
		}
		while (ret.length > 0 && ret[ret.length-1] == '\n') ret = ret.substr(0, ret.length - 1);
		ret += "</pre></div>";
		return ret;
	}
	else
	{
		// single line
		let state = {
				"source": code,
				"pos": 0,               // zero-based position in the source code string
				"good": function()
						{ return (this.pos < this.source.length); },
				"bad": function()
						{ return (! this.good()); },
				"eof": function()
						{ return this.pos >= this.source.length; },
				"indentation": function()
						{ return 0; },
				"error": function(path, args)
						{
							if (args === undefined) args = [];
							let str = "documentation internal error in code: '" + this.source + "'";
							console.log(str);
							console.log(path, args);
							throw new Error(str);
						},
				"current": function()
						{ return (this.pos >= this.source.length) ? "" : this.source[this.pos]; },
				"lookahead": function(num)
						{ return (this.pos + num >= this.source.length) ? "" : this.source[this.pos + num]; },
				"next": function()
						{ return this.lookahead(1); },
				"get": function()
						{ return { "pos": this.pos, "line": this.line, "ch": this.ch }; },
				"set": function(where)
						{ this.pos = where.pos; this.line = where.line, this.ch = where.ch },
				"advance": function(n)
						{
							if (n === undefined) n = 1;
							if (this.pos + n > this.source.length) n = this.source.length - this.pos;
							for (let i=0; i<n; i++)
							{
								let c = this.current();
								if (c == '\n') { this.line++; this.ch = 0; }
								this.pos++; this.ch++;
							}
						},
				"skip": function()
						{
							while (this.good())
							{
								let c = this.current();
								if (c == '#')
								{
									this.pos++; this.ch++;
									if (this.current() == '*')
									{
										this.pos++; this.ch++;
										let star = false;
										while (this.good())
										{
											if (this.current() == '\n')
											{
												this.pos++;
												this.line++; this.ch = 0;
												star = false;
												continue;
											}
											if (star && this.current() == '#')
											{
												this.pos++; this.ch++;
												break;
											}
											star = (this.current() == '*');
											this.pos++; this.ch++;
										}
									}
									else
									{
										while (this.good() && this.current() != '\n') { this.pos++; this.ch++; }
									}
									continue;
								}
								if (c != ' ' && c != '\t' && c != '\r' && c != '\n') break;
								if (c == '\n') { this.line++; this.ch = 0; }
								else this.ch++;
								this.pos++;
							}
						},
			};

		let ret = "<code class=\"" + css_prefix + "\">";
		while (! state.eof())
		{
			while (state.good())
			{
				let c = state.current();
				if (white.indexOf(c) < 0) break;
				if (c == ' ') ret += c;
				else if (c == '\t') ret += "    ";
				else if (c == '\r') { }
				state.advance();
			}
			if (state.eof()) break;
			let start = state.pos;
			let token = lex(state);
			let value = code.substr(start, state.pos - start);
			ret += "<span class=\"" + css_prefix + "-" + token.type + "\">" + value + "</span>";
		}
		ret += "</code>";
		return ret;
	}
}

// Check code for correctness by parsing and running it.
// On success, the function does nothing, otherwise is throws an error message.
function checkCode(code)
{
	let result = TScript.parse(code);
	if (result.hasOwnProperty("errors") && result.errors.length > 0) throw result.errors[0].message;
	let interpreter = new TScript.Interpreter(result.program);
	interpreter.reset();
	interpreter.service.message = function(msg) { throw msg; }
	interpreter.service.documentation_mode = true;
	while (interpreter.status == "running" || interpreter.status == "waiting") interpreter.exec_step();
	if (interpreter.status != "finished") alert("code sample failed to run:\n" + code);
}

// This function returns an altered version of the pseudo-html #content
// suitable for placing it as innerHTML into the DOM. It performs a
// number of stylistic replacements:
// * It scans for the ebnf tag and adds proper syntax highlighting.
// * It scans for the tscript tag and adds proper syntax highlighting.
//   As an additional sanity check, it parses and executes the code.
// * For the above tags, it removes leading empty lines, removes leading
//   indentation, and converts the remaining leading tabulators to four
//   spaces each.
// * It scans for keyword tags, which are styled appropriately.
function prepare(content)
{
	let search = content.toLowerCase();
	let ret = "";
	let start = 0;
	while (start < content.length)
	{
		let pos = search.indexOf('<', start);
		if (pos < 0)
		{
			ret += content.substr(start);
			break;
		}
		ret += content.substr(start, pos - start);
		start = pos;
		if (search.substr(start, 6) == "<ebnf>")
		{
			start += 6;
			let end = search.indexOf("</ebnf>", start);
			if (end < 0) throw "[doc] <ebnf> tag not closed";
			let ebnf = content.substr(start, end - start);
			start = end + 7;
			ret += processCode(ebnf, "ebnf", get_token_ebnf);
		}
		else if (search.substr(start, 9) == "<tscript>")
		{
			start += 9;
			let end = search.indexOf("</tscript>", start);
			if (end < 0) throw "[doc] <tscript> tag not closed";
			let code = content.substr(start, end - start);
			start = end + 10;
			checkCode(code);
			ret += processCode(code, "code", get_token_code);
		}
		else if (search.substr(start, 20) == "<tscript do-not-run>")
		{
			start += 20;
			let end = search.indexOf("</tscript>", start);
			if (end < 0) throw "[doc] <tscript> tag not closed";
			let code = content.substr(start, end - start);
			start = end + 10;
			ret += processCode(code, "code", get_token_code);
		}
		else if (search.substr(start, 9) == "<keyword>")
		{
			start += 9;
			let end = search.indexOf("</keyword>", start);
			if (end < 0) throw "[doc] <keyword> tag not closed";
			let kw = content.substr(start, end - start);
			start = end + 10;
			ret += "<span class=\"keyword\">" + kw + "</span>";
		}
		else
		{
			ret += content[start];
			start++;
		}
	}
	return ret;
}

// This function returns an altered version of the pseudo-html #content
// suitable for searching. It removes all tags, as well as the contents
// of ebnf and tscript tags.
function plaintext(content)
{
	let search = content.toLowerCase();
	let ret = "";
	let start = 0;
	while (start < content.length)
	{
		let pos = search.indexOf('<', start);
		if (pos < 0)
		{
			ret += content.substr(start);
			break;
		}
		ret += content.substr(start, pos - start);
		start = pos;
		if (search.substr(start, 6) == "<ebnf>")
		{
			start += 6;
			let end = search.indexOf("</ebnf>", start);
			if (end < 0) throw "[doc] <ebnf> tag not closed";
			start = end + 7;
			ret += " ";
		}
		else if (search.substr(start, 10) == "<tscript>")
		{
			start += 10;
			let end = search.indexOf("</tscript>", start);
			if (end < 0) throw "[doc] <tscript> tag not closed";
			start = end + 11;
			ret += " ";
		}
		else if (search.substr(start, 4) == "<h1>")
		{
			start += 4;
			let end = search.indexOf("</h1>", start);
			if (end < 0) throw "[doc] <h1> tag not closed";
			let s = content.substr(start, end - start) + " ";
			start = end + 5;
			ret += s;
			ret += s;
			ret += s;
			ret += s;
			ret += s;
		}
		else if (search.substr(start, 4) == "<h2>")
		{
			start += 4;
			let end = search.indexOf("</h2>", start);
			if (end < 0) throw "[doc] <h2> tag not closed";
			let s = content.substr(start, end - start) + " ";
			start = end + 5;
			ret += s;
			ret += s;
			ret += s;
		}
		else if (search.substr(start, 4) == "<h3>")
		{
			start += 4;
			let end = search.indexOf("</h3>", start);
			if (end < 0) throw "[doc] <h3> tag not closed";
			let s = content.substr(start, end - start) + " ";
			start = end + 5;
			ret += s;
			ret += s;
		}
		else
		{
			let end = content.indexOf('>', start+1);
			if (end < 0) throw "[doc] tag not closed";
			start = end+1;
			ret += " ";
		}
	}
	return ret;
}

function getnode(path)
{
	let tokens = path.split("/");
	if (tokens[0] != "") throw "invalid path: " + path;
	let parent = null;
	let parentpath = null;
	let index = -1;
	let node = doc;
	for (let i=1; i<tokens.length; i++)
	{
		if (! node.hasOwnProperty("children")) throw "invalid path: " + path;
		let ch = node.children;
		let found = null;
		for (let j=0; j<ch.length; j++)
		{
			if (ch[j].id == tokens[i])
			{
				parent = node;
				parentpath = (parent == doc) ? "" : parentpath + "/" + parent.id;
				index = j;
				found = ch[j];
				break;
			}
		}
		if (found === null) throw "invalid path: " + path;
		node = found;
	}
	return [node, parent, parentpath, index];
}

module.setpath = function(path)
{
	if (! path) path = "";
	if (path.length > 0 && path[0] == "#") path = path.substr(1);

	if (path.substr(0, 7) == "search/")
	{
		// prepare the search results page
		let keys = path.substr(7).split('/');
		let html = "<h2>Search Results for <i>&quot;";
		for (let i=0; i<keys.length; i++)
		{
			if (i != 0) html += " ";
			html += keys[i];
		}
		html += "&quot;</i></h2>";
		let results = searchengine.find(keys);
		if (results.length > 0)
		{
			html += "<ul>";
			for (let i=0; i<results.length; i++)
			{
				let path = results[i].id;
				let node = getnode(path)[0];
				html += "<li><a href=\"#" + path + "\">" + node.title + "</a><div class=\"searchresults\">terms:<i>";
				// sort words by relevance
				let words = [];
				for (let word in results[i].matches)
				{
					if (! results[i].matches.hasOwnProperty(word)) continue;
					words.push([word, results[i].matches[word]]);
				}
				words.sort(function(lhs, rhs){ return rhs[1] - lhs[1]; });
				for (let i=0; i<words.length; i++)
				{
					html += " " + words[i][0];
				}
				html += "</i></div></li>";
			}
			html += "</ul>";
		}
		else
		{
			html += "<p>sorry, no results found</p>";
		}

		// display the page
		module.dom_content.innerHTML = html;
		module.dom_content.scrollTop = 0;
		docpath = "";
		doctree.update(docinfo);
	}
	else
	{
		try
		{
			let data = getnode(path);
			let node = data[0];
			let parent = data[1];
			let parentpath = data[2];
			let index = data[3];
			let html = "<h1>" + node.title + "</h1>\n";
			if (node.hasOwnProperty("content")) html += node.content + "\n";
			if (node.hasOwnProperty("children"))
			{
				html += "<div class=\"related\">\n";
				html += "<h2>Related Topics</h2>\n<ul>\n";
				if (parent)
				{
					html += "back to enclosing topic: <a href=\"#" + parentpath + "\">" + parent.name + "<a><br/>\n";
					if (index > 0)
					{
						let sibling = parent.children[index - 1];
						html += "previous topic: <a href=\"#" + parentpath + "/" + sibling.id + "\">" + sibling.name + "<a><br/>\n";
					}
					if (index + 1 < parent.children.length)
					{
						let sibling = parent.children[index + 1];
						html += "next topic: <a href=\"#" + parentpath + "/" + sibling.id + "\">" + sibling.name + "<a><br/>\n";
					}
				}
				if (node.children.length > 0)
				{
					html += "<h3>Subordinate Topics</h3>\n<ul>\n";
					for (let i=0; i<node.children.length; i++) html += "<li><a href=\"#" + path + "/" + node.children[i].id + "\">" + node.children[i].name + "</a></li>\n";
					html += "</ul>\n";
				}
				html += "</div>\n";
			}
			html += "<div class=\"pad\"></div>\n";

			module.dom_content.innerHTML = prepare(html);
			module.dom_content.scrollTop = 0;
			docpath = path;
			doctree.update(docinfo);

			let pres = document.getElementsByTagName("pre");
			for (let i=0; i<pres.length; i++)
			{
				let pre = pres[i];
				if (pre.className.indexOf("code") >= 0)
				{
					let c = pre.textContent + "\n";
					pre.parentNode.addEventListener("click", function(event) { toClipboard(c); });
				}
			}
		}
		catch (ex)
		{
			if (ex.message) alert(ex.message);
			else alert(ex);
			throw ex;
		}
	}
}

function initsearch(path, node)
{
	let s = plaintext("<h1>" + node.title + "</h1>\n" + node.content);
	searchengine.add(path, s);
	for (let i=0; i<node.children.length; i++)
	{
		let c = node.children[i];
		initsearch(path + "/" + c.id, c);
	}
}

function checklinks(node, path)
{
	let start = 0;
	while (true)
	{
		let pos = node.content.indexOf("href=\"", start);
		if (pos < 0) break;
		start = pos + 6;
		pos = node.content.indexOf('\"', start);
		let s = node.content.substr(start, pos-start);
		start = pos + 1;
		if (s.length > 0 && s[0] == '#')
		{
			try
			{
				getnode(s.substr(1));
			}
			catch (ex)
			{
				// invalid link
				alert("[link checker] broken link to '" + s + "' in document '" + path + "'");
			}
		}
	}

	for (let i=0; i<node.children.length; i++) checklinks(node.children[i], path + "/" + node.children[i].id);
}

module.dom_container = null;
module.dom_main = null;
module.dom_sidebar = null;
module.dom_version = null;
module.dom_search = null;
module.dom_searchtext = null;
module.dom_tree = null;
module.dom_content = null;
module.embedded = false;

module.create = function(container, options)
{
	if (! options) options = {
			embedded: false,
		};

	module.embedded = options.embedded;
	if (! options.embedded) document.title = "TScript Documentation";

	// create the framing html elements
	module.dom_container = container;
	module.dom_main = tgui.createElement({type: "div", parent: container, id: "doc-main"});
	module.dom_sidebar = tgui.createElement({type: "div", parent: container, id: "sidebar"});
		module.dom_version = tgui.createElement({type: "div", parent: module.dom_sidebar, id: "version"});
		module.dom_search = tgui.createElement({type: "div", parent: module.dom_sidebar, id: "search"});
		module.dom_searchtext = tgui.createElement({type: "input", parent: module.dom_search, id: "searchtext", properties: {type:"text", placeholder:"search"}});
		module.dom_tree = tgui.createElement({type: "div", parent: module.dom_sidebar, id: "tree"});
	module.dom_content = tgui.createElement({type: "div", parent: container, id: "content"});

	// display the version
	window.setTimeout(function(event)
	{
		module.dom_version.innerHTML = TScript.version.full();
		module.dom_version.addEventListener("click", function(event)
				{
					let base = window.location.href.split("#")[0];
					window.location.href = base + "#/legal";
					module.setpath("/legal");
	 			});
	}, 100);

	// prepare the error sub-tree of the documentation tree
	let rec = function(entry, path = "")
			{
				let placeholders = ["X", "Y", "Z", "W", "V"];
				if (! entry.hasOwnProperty("name"))
				{
					let tmpl = TScript.errorTemplate(path);
					let tokens = tmpl.split("$$");
					entry.name = tokens[0];
					for (let i=1; i<tokens.length; i++) entry.name += placeholders[i-1] + tokens[i];
				}
				if (! entry.hasOwnProperty("title")) entry.title = "Error Message: " + entry.name;
				for (let i=0; i<entry.children.length; i++)
				{
					rec(entry.children[i], path + "/" + entry.children[i].id);
				}
			};
	for (let i=0; i<doc.children.length; i++)
	{
		if (doc.children[i].id == "errors") rec(doc.children[i]);
	}

	// prepare the tree control
	doctree = tgui.createTreeControl({
			"parent": module.dom_tree,
			"info": docinfo,
			"nodeclick": function(event, value, id)
					{
						if (! module.embedded)
						{
							let base = window.location.href.split("#")[0];
							window.location.href = base + "#" + id;
						}
						module.setpath(id);
					},
		});

	// make the search field functional
	searchengine.clear();
	initsearch("", doc);   // index the docs
	module.dom_searchtext.addEventListener("keypress", function(event)
	{
		if (event.key != "Enter") return;

		let keys = searchengine.tokenize(module.dom_searchtext.value);
		let h = "#search";
		for (let i=0; i<keys.length; i++) h += "/" + keys[i];
		if (module.embedded)
		{
			sessionStorage.setItem("docpath", h);
			module.setpath(h);
		}
		else window.location.hash = h;
	});

	// check all internal links
	checklinks(doc, "#");

	if (options.embedded)
	{
		let path = sessionStorage.getItem("docpath");
		if (! path) path = "#";
		module.setpath(path);
	}
	else
	{
		// process the "anchor" part of the URL
		window.addEventListener("hashchange", function()
		{
			let path = window.location.hash;
			module.setpath(path);
		});
		let path = window.location.hash;
		module.setpath(path);
	}

	if (module.embedded)
	{
		document.addEventListener("click", function(event)
		{
			let target = event.target || event.srcElement;
			if (target.tagName === 'A')
			{
				let href = target.getAttribute("href");
				if (href.length == 0) return true;
				if (href[0] != "#") return true;
				sessionStorage.setItem("docpath", href);
				module.setpath(href);
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				return false;
			}
		});
	}
};

return module;
}());
"use strict"

if (doc) doc.children.push({
"id": "concepts",
"name": "Core Concepts",
"title": "Core Concepts of the TScript Programming Language",
"content": `
	<p>
	The TScript language is carefully designed with the goal to create
	an ideal programming language for programming beginners. This
	overarching goal encompasses a number of sub-goals and design
	principles.
	<ul>
	<li>
		<b>Visual Tasks.</b>
		Programming beginners are new to programming, but they are
		usually not new to computers. Their expectation is to program
		things they experienced before, in particular graphical user
		interfaces. They may quickly lose interest when being confronted
		with writing console programs they can hardly relate to.
		Therefore TScript comes with easy-to-use graphics programming
		libraries: an extremely simple one for turtle graphics, and a
		little more advanced one featuring a canvas for drawing and for
		receiving user input.
	</li>
	<li>
		<b>Avoid error-prone constructions.</b>
		Surprisingly many programming languages carry a legacy of
		constructions around that are known to be problematic in one way
		or another, going far beyond the infamous
		<code class="code">goto</code> statement.
		Examples are macros in C++, the division operator of Python 2,
		Javascript's default behavior of turning assignments to mistyped
		variables into globals, obscure scoping rules, and improper
		information hiding in classes. TScript aims to be strict about
		such issues, in the conviction that this is the best way to
		avoid many small but hard to find errors that will frustrate
		beginners.
	</li>
	<li>
		<b>Clean syntax.</b>
		The C-family of programming languages is known for its rather
		verbose syntax and for its extensive use of special characters
		in expressions. For example, the statement
			<div>
				<code class="code">for (i=0; a[i]; i++) *a[i] = *(b++) = -(c++);</code>
			</div>
		makes perfect sense in C, but it is hard to parse, not only for
		beginners.
		While TScript builds on the expressiveness of operators, it
		tries to avoid some of the complications of C. First of all,
		there are no pointers, and hence no pointer arithmetics. Second,
		assignments cannot be chained because they do not return a
		value, which enforces a clean separation of tests and side
		effects. Third, core language constructs like conditions and
		loops use a rather keyword-rich and verbose syntax without
		parentheses.
	</li>
	<li>
		<b>Better fail than do the wrong thing.</b>
		Sometimes it is convenient to handle inputs gracefully. For
		example, when expecting an integer, one may accept a string
		representing an integer as a decimal number. Another example is
		the implicit conversion of integers and even strings to
		booleans, which allows such types to appear in conditions.
		TScript largely disallows such code. The only implicit
		conversions are between integers and reals holding actual
		integer values, and conversions to string when printing. The
		reason is that implicit conversions can be really irritating, in
		particular for beginners, in case that things go wrong and the
		conversion is unintended. Then the better solution is to demand
		an explicit cast and to fail otherwise with a clear error
		message that points the programmer to the problem.
	</li>
	<li>
		<b>Implementation of all standard concepts.</b> TScript is a
		pretty complete imperative and object oriented programming
		language, in the sense that it covers all the standard
		constructions like conditionals, loops, functions, classes,
		namespaces, and the like. This is important since its aim is to
		prepare the programmer for work with other languages designed
		for more serious use. There are some exception to the above
		rule, i.e., TScript does not come with a switch-case construct,
		it does not have a ternary operator, and it does not allow for
		operator overloading.
	</li>
	</ul>
	</p>
	<p>
	The following documents should be helpful for readers with some
	programming experience to get an quick overview of tscript:
	<ul>
	<li><a href="#/cheatsheet">Cheat Sheet</a></li>
	<li><a href="#/concepts/overview">The Language at a Glance</a></li>
	<li><a href="#/concepts/design">Design Decisions</a></li>
	<li><a href="#/concepts/arithmetics">Arithmetics</a></li>
	</ul>
	</p>
`,
"children": [
	{"id": "overview",
	"name": "The Language at a Glance",
	"title": "The Language at a Glance",
	"content": `
		<p>
		TScript is an imperative and object oriented language. In many
		aspects it has similarities to "scripting" languages like Python
		and Javascript: code is executed as it is encountered, so there
		is no explicit entry point, variables are untyped, they
		reference values instead of containing them, and memory is fully
		managed.
		</p>
		<p>
		For a closer look, let's start with an example:
		<tscript>
			for var i in 0:10 do print(93 - 8 * i);
		</tscript>
		This line reveals a lot about the syntax of the language. First
		of all, it is semicolon delimited. Variables are declared with
		the <keyword>var</keyword> keyword. There is a special
		<a href="#/language/types/range">range</a>
		type, objects of which are created with the colon operator.
		Function calls and computations are denoted in the usual way.
		However, the <a href="#/language/statements/for-loops">for-loop</a>
		is rather verbose, involving the keywords <keyword>for</keyword>,
		<keyword>in</keyword>, and <keyword>do</keyword>.
		</p>
		<p>
		<a href="#/language/declarations/functions">Functions</a>
		are declared with the <keyword>function</keyword>
		keyword:
		<tscript>
			function factorial(n)
			{
				if n == 0 then return 1;
				else return n * factorial(n - 1);
			}
			print(factorial(10));   # 3628800
		</tscript>
		The maybe only surprise here is the keyword
		<keyword>then</keyword>, which is another example of the verbose
		syntax when it comes to control structures. It is also possible
		to assign functions to variables and to define
		<a href="#/language/expressions/literals/anonymous-functions">anonymous (lambda) functions enclosing variables</a>.
		</p>
		<p>
		Like JSON, the TScript language knows the types
		<a href="#/language/types/null">null</a>,
		<a href="#/language/types/boolean">boolean</a>,
		<a href="#/language/types/real">real</a> (number in JSON),
		<a href="#/language/types/string">string</a>,
		<a href="#/language/types/null">array</a>, and
		<a href="#/language/types/dictionary">dictionary</a> (object in JSON),
		and JSON expressions are valid literals. In addition,
		TScript has a signed 32bit
		<a href="#/language/types/integer">integer</a> type, a
		<a href="#/language/types/range">range</a> type, a
		<a href="#/language/types/function">function</a> type, and a
		<a href="#/language/types/type">type</a> type. Arrays are
		denoted with square brackets and dictionaries with curly braces.
		Dictionary keys can be identifiers or strings:
		<tscript>
			var a = [2, 3, 5, 7, 11];         # an array
			var d = {name: "John", age: 25};  #* a dictionary *#
		</tscript>
		The above example also demonstrates line and block
		<a href="#/language/syntax/comments">comments</a>.
		</p>
		<p>
		The built-in types can be extended by declaring
		<a href="#/language/declarations/classes">classes</a>:
		<tscript>
			class Person
			{
			private:
				static var m_free_id = 0;
				var m_id;
				var m_name;
				var m_age;

			public:
				constructor(name, age)
				{
					m_name = name;
					m_age = age;
					m_id = m_free_id;
					m_free_id += 1;
				}

				function name()
				{ return m_name; }

				function age()
				{ return m_age; }

				function id()
				{ return m_id; }
			}
		</tscript>
		In contrast to many other scripting languages, TScript
		constructors are easily recognizable as such, and classes
		support proper information hiding.
		</p>
		<p>
		Further features of interest are
		<a href="#/language/declarations/namespaces">namespaces</a> and
		corresponding <a href="#/language/directives/use">use directives</a>,
		as well as <a href="#/language/statements/throw">exceptions</a>.
		For a more complete and more formal overview of the language please
		refer to the <a href="#/language">reference documentation</a>.
		</p>
		<p>
		An important aspect of TScript as a teaching language is the closed
		and rather limited universe it lives in. The language is not designed
		as a general purpose tool, capable of interacting with arbitrary
		operating systems and libraries. Instead, its scope is limited to a
		very specific and highly standardized working environment. It comes
		with easily accessible <a href="#/library/turtle">turtle graphics</a>
		and <a href="#/library/canvas">canvas graphics</a> modules. While the
		former is ideal for visual demonstrations of programming concepts
		like loops and recursion, the latter allows for the creating of all
		kinds of (classic) games. Check the <a href="#/examples">examples</a>
		for demonstrations.
		</p>
	`,
	"children": []},
	{"id": "design",
	"name": "Design Decisions",
	"title": "Design Decisions",
	"content": `
		<p>
		Most programming languages in common use exist for an extended
		period of time and underwent significant changes. Such changes
		regularly aim to fix design bugs introduced early on. This naturally
		creates a tension between designing a proper solution and avoiding
		to break existing code. Therefore many such fixes are rather newly
		designed workarounds. The main claim to fame of TScript is that its
		initial design is already very well crafted, which will hopefully
		avoid the need for larger changes in the future. The most important
		factor making this possible is that the language is very limited in
		scope, which greatly reduces the need for future changes.
		</p>
		<p>
		Starting with a clean design is only possible by building on prior
		(positive and negative) experience. TScript combines well-designed
		concepts from a range of existing programming languages &mdash; and
		sure, the decision which concepts are well-designed or not is a
		somewhat subjective one. This affects its basic syntax, the level
		of abstraction of many concepts, as well as a number of specific
		but important design decisions, some of which are listed in the
		following.
		</p>
		<ul>
			<li>
				The family of C-style languages has contributed
				insignificance of whitespace, the semicolon as a delimiter,
				braces as block markers, and scoping rules for variables,
				block comments, and many minor details like the use of
				square brackets for variables enclosed by lambda functions.
				Most class-related features like proper information hiding,
				a fixed class layout and static members are inspired by C++
				and Java.
			</li>
			<li>
				Automatic memory management, runtime typing, variables being
				references to values, and the absence of an explicit entry
				point are very common concepts in high-level scripting
				languages.
			</li>
			<li>
				TScript is fully compatible with
				<a target="_blank" href="http://json.org/">JSON</a>, in the
				sense that every JSON expression is a legal TScript constant.
				JSON lays the foundation for the system of TScript core types.
			</li>
			<li>
				Python has contributed named parameters and separate operators
				for integer and floating point division, and Matlab and NumPy
				have inspired array slicing and hence the Range type.
				TScript's keyword-rich syntax for expressing conditionals and
				loops without the need to enclose conditions into parentheses
				is not taken directly from a specific language, but it is
				inspired by the simplicity of Python syntax.
			</li>
			<li>
				Anonymous functions and closures are inspired by Javascript's
				powerful event handling abilities, although the mechanism of
				enclosing values instead of variables is a bit different.
			</li>
		</ul>
		<p>
		It is understood that many of these features are also present in other
		languages and that it is near impossible to give proper credit to every
		programming language out there.
		</p>
	`,
	"children": []},
	{"id": "arithmetics",
	"name": "Arithmetics",
	"title": "Arithmetics",
	"content": `
		<p>
		TScript has two fundamental arithmetic types: Integer and Real.
		At first glance, they seem to be rather similar, to the extent
		that one may conclude that Integers are superfluous, since their
		entire range is covered by Reals. Indeed, most functions and
		operators that are designed for one type accept both types, and
		also mixed types in case of multiple arguments.
		</p>
		<p>
		However, merging the two types would clearly violate the
		<a target="_blank" href="https://en.wikipedia.org/wiki/Single_responsibility_principle">single responsibility principle</a>.
		This is because integers and reals have very different (primary)
		roles in the core language: integers act as array indices, while
		reals are numeric values.
		</p>
		<p>
		It turns out that array indexing requires its own arithmetics,
		e.g, for implementing a two-dimensional grid with an array.
		Think of a matrix stored in
		<a target="_blank" href="https://en.wikipedia.org/wiki/Matrix_representation">row-major format</a>
		as an example. For a matrix of width <i>w</i> and height <i>h</i>
		and for zero-based column and row indices <i>(x,y)</i>, the index
		of the corresponding array item is
		<code class="code">i=x+w*y</code>. The operation is inverted by
		<code class="code">x=i%w</code> and
		<code class="code">y=i//w</code>, which justifies the way
		integer division and modulo are defined. By induction, this
		argument extends to <i>n</i>-dimensional grids.
		</p>
		<p>
		The differences between integer and floating point arithmetics
		can be broken down to three points:
		<ul>
			<li>division,</li>
			<li>overflow (and underflow), and</li>
			<li>rounding errors.</li>
		</ul>
		Overflow is often considered a minor issue, at least if it is
		clear a-priori that the program will not have to handle very
		large values. Rounding errors can cause
		<a target="_blank" href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html">problems</a>
		in floating point arithmetics, but it tends to occur is contexts
		where it is clear that we deal with reals, and experienced
		programmers of numerically sensitive algorithms are usually
		aware of it. Division is problematic as follows:
		<tscript>
			function compute(a, b)
			{ return a / b; }

			print(compute(1, 3));       # prints 0.3333...
			print(compute(1.0, 3.0));   # prints 0.3333...
		</tscript>
		</p>
		<p>
		Assume for a second that the division operator would use the
		arithmetics induced by its types, then the first case would
		trigger integer division and the statement would print zero!
		</p>
		<p>
		The problem is that in a runtime-typed language like TScript
		the compute function cannot know which types its arguments
		will take. However, most probably the zero result is not
		intended by the programmer. Runtime type checking and forced
		conversion can fix the problem,
		<tscript>
			function compute1(a, b)
			{
				assert(Type(a) == Real and Type(b) == Real);
				return a / b;
			}
			function compute2(a, b)
			{ return Real(a) / Real(b); }
		</tscript>
		but demanding this solution from the programmer is a far too
		error prone approach.
		</p>
		<p>
		This dilemma is resolved by introducing two distinct division
		operators, <code class="code">/</code> for reals and
		<code class="code">//</code> for integers. This design is not
		elegant, but it solves an important problem by avoiding
		frequent and hard-to-find division bugs. This solution is of
		course inspired by Python3.
		</p>
		<p>
		The power operator <code class="code">^</code> is particularly
		prone to integer overflow. However, it is rarely applied with
		large exponents. Instead of providing a second operator that
		is more safe with respect to integer overflow, the function
		<a href="#/library/math">math.pow</a> is provided as an alternative.
		</p>
	`,
	"children": []},
	{"id": "style",
	"name": "Style",
	"title": "Coding Style",
	"content": `
		<p>
		Also beyond its basic syntax, the TScript language aims to teach
		good coding style. Therefore there exists an official style
		guide. It aims to be not too restrictive, while emphasizing a
		few points that can make code much easier to read. These two
		points are:
		<ul>
			<li>indentation, and</li>
			<li>capitalization of identifiers.</li>
		</ul>
		</p>
		<h3>Style Checking Mode</h3>
		<p>
		Although the core language does not enforce any particular
		coding style, it can be helpful for beginners to get used to a
		style that fosters readable code early on. Therefore the TScript
		IDE offers the option to enable a special <i>style checking
		mode</i>. In this mode, violations of this style guide are
		reported as errors. The mode can be enabled/disables in the
		configuration dialog accessible through the toolbar.
		</p>
		<h3>Indentation</h3>
		<p>
		The language syntax does not enforce indentation. Quite the
		contrary is the case: whitespace is entirely insignificant.
		However, it is clear that cleanly indented code is significantly
		easier to read. Therefore, clean indentation of blocks is
		enforced by this style guide.
		</p>
		<p>
		RULES: Each block (scope, function/class/namespace body) is
		indented uniformly. Its indentation exceeds the indentation of
		the surrounding block. Lines containing matching opening and
		closing braces must have the same indentation.
		</p>
		<p>
		</p>
		<tscript>
			function foo()
			{ print("foo"); }   # okay

			function bar() {
					print("bar");
				} # wrong; indentation of braces does not match

			function foo2()
			{
					print("foo");
				print("foo2");	# wrong; block is not indented consistently
			}

			function bar2()
			{
			print("bar2");   # wrong; indentation does not increase
			}
		</tscript>
		</p>
		<h3>Capitalization of Identifiers</h3>
		<p>
		TScript uses the convention that identifiers starting with a
		capital letter denote types, while all other identifiers denote
		variables, functions, and namespaces. 
		</p>
		<tscript>
			var N = 1000;         # should be "n"
			function Display(x)   # should be "display"
			{ print(x); }
			namespace Stuff {     # should be "stuff"
				class set { }     # should be "Set"
			}
			var T = Integer;      # this is borderline, but should be "t"
		</tscript>
	`,
	"children": []},
]
});
"use strict"

if (doc) doc.children.push({
"id": "ide",
"name": "The TScript IDE",
"title": "The TScript Integrated Development Environment (IDE)",
"content": `
	<p>
	TScript is not only a programming language, it also comes with a
	fully fledged integrated development environment (IDE). The IDE
	includes a code editor and powerful debugging facilities.
	</p>
	<p>
	In principle, the IDE can be decoupled from the programming language,
	and a single IDE can be used for a multitude of languages. However,
	providing a default IDE for the language has advantages for
	beginners. No choices need to be made. More importantly, there is no
	friction in setup and configuration processes.
	</p>
	<p>
	The TScript IDE main window consists of a toolbar at the top and an
	area holding several panels. The panels can be docked to a wide area
	on the left or to a more narrow area on the right. They can also
	float around freely on top of docked panels, one panel can be
	maximizied on top of all others, and panels can be reduced to icons.
	All of this is controlled with the buttons in the title bar of each
	panel. Panels can be resized by dragging the lower and right edges.
	</p>
`,
"children": [
	{"id": "toolbar",
	"name": "Toolbar",
	"title": "Toolbar",
	"content": `
		<p>
		The IDE has a toolbar at the top. It features a number of central
		controls.
		</p>
		<p>
		The four leftmost buttons manage files. They create a new
		document, open a document from a file, save to file, and save
		under a different name. Currently, documents can only be stored
		in the local storage of the browser.
		<div class="warning">
			Local storage is not a safe place to store data! It can be
			cleared at any time by the browser, and it is actively
			cleared by some plug-ins when removing cookies. Do not rely
			on your source code being safely stored when using this
			technology!
		</div>
		Furthermore, when opening TScript from multiple locations on the
		web or in the file system, the browser treats the websites as
		different, and files stored in one instance are not available in
		the others.
		</p>
		<p>
		The next group of buttons controls program execution. They start
		or continue, interrupt, and abort the program. Three further
		buttons belong the the debugger. They step through the programs
		at different levels of granularity. The button with the little
		red dot toggles (sets/removes) the breakpoint in the current
		line, or the closest line below that is a legal breakpoint
		location.
		</p>
		<p>
		The green arrow opens the export dialog. It allows to export
		programs using turtle graphics or canvas graphics as standalone
		applications (web pages). These files can be ran in a browser,
		i.e., independent of the TScript IDE.
		</p>
		<p>
		The button with the gear symbol opens the configuration dialog.
		Currently it allows to configure the hotkeys associated with the
		toolbar buttons. Furthermore, there is a checkbox that enables
		<a href="#/concepts/style">style checking mode</a>.
		</p>
		<p>
		It follows a wide element with colored background, called the
		program state indicator. It indicates whether the program is just
		about to be written, whether it was parsed successfully or whether
		an error occurred, and whether the program is running, waiting, or
		interrupted.
		</p>
		<p>
		Right of the program indicator there is an area collecting icons of
		iconified panels. The icons can be clicked to restore the previous
		non-icon state of a panel.
		</p>
		<p>
		Finally, the button on the far right opens the documentation (i.e.,
		this very collection of documents) in a new window or browser tab.
		</p>
	`,
	"children": []},
	{"id": "editor",
	"name": "Source Code Editor",
	"title": "Source Code Editor",
	"content": `
		<p>
		The source code editor is the most important panel. It consists
		of a modern browser-based text editor with syntax highlighting
		for the TScript programming language. The program code is typed,
		pasted, or loaded into this panel. Breakpoints can be toggled
		(added/removed) by clicking the gutter on the left. The gutter
		also displays line numbers.
		</p>
		<p>
		Besides the hotkeys defined for the
		<a href="#/ide/toolbar">toolbar</a> buttons, the editor provides
		the following hotkeys:
		<table class="nicetable">
			<tr><th>key</th><th>effect</th></tr>
			<tr><td>control-A</td><td>select all</td></tr>
			<tr><td>control-Z</td><td>undo last change</td></tr>
			<tr><td>shift-control-Z</td><td>redo last change</td></tr>
			<tr><td>control-Y</td><td>redo last change</td></tr>
			<tr><td>control-Home</td><td>jump to start of the document</td></tr>
			<tr><td>control-End</td><td>jump to end of the document</td></tr>
			<tr><td>shift-Tabulator</td><td>auto-indent the current line</td></tr>
			<tr><td>control-D</td><td>comment/uncomment selected lines</td></tr>
			<tr><td>control-F</td><td>open the <i>find</i> dialog</td></tr>
			<tr><td>shift-control-F</td><td>open the <i>find+replace</i> dialog</td></tr>
			<tr><td>control-G</td><td>next search result</td></tr>
			<tr><td>shift-control-G</td><td>previous search result</td></tr>
			<tr><td>alt-G</td><td>open the <i>goto line</i> dialog</td></tr>
		</table>
		On MacOS, use the command key instead of the control key.
		</p>
	`,
	"children": []},
	{"id": "messages",
	"name": "Message Area",
	"title": "Message Area",
	"content": `
		<p>
		The message area contains two types of entities: text printed by
		the program with the <a href="#/library/core">print</a> function,
		and error messages. Errors are clickable, highlighting the line
		of code in which the error occurred. Also, there is a clickable
		information symbol &#128712; that opens the documentation of the
		error.
		</p>
	`,
	"children": []},
	{"id": "debugging",
	"name": "Debugging Facilities",
	"title": "Debugging Facilities",
	"content": `
		<p>
		The debugger is firmly integrated into the IDE. It consists of
		several elements. The most prominent ones are stack and program
		view. Furthermore, stepwise program execution is controlled with
		the toolbar buttons, the message area collects error messages,
		which are often a starting point for debugging, and breakpoints
		are defined in the source code error.
		</p>

		<h2>The Stack View</h2>
		<p>
		This panel contains information only while the program is running.
		It displays the program state as a tree. At the topmost level, the
		tree contains one node per stack frame, which is the entity holding
		all local variables of a function. The bottom-most stack frame
		(with index [0]) holds the global variables.
		</p>
		<p>
		Each stack frame holds one sub-node per variable. If the variable
		refers to a container or an object, then the node can be opened and
		the items or attributes are found in the next layer. For example,
		an array holding 10 items is represented by 10 sub-nodes, one for
		each item.
		</p>
		<p>
		Furthermore, each stack frame holds a list of temporary values. A
		temporary value exists only during the evaluation of an expression,
		before it is consumed by another expression.
		</p>
		</p>
		The panel allows to inspect the values of all variables at runtime.
		This information is invaluable for debugging. While running the
		program step by step the programmer can monitor the effect of all
		commands on the variables.
		<p>

		<h2>The Program View</h2>
		<p>
		This panel contains information only after the program is parsed.
		It displays the program structure as a tree. The root node
		represents the global scope. Nodes below this one represent
		declarations and statements, which again have sub-nodes, all the
		way down to atomic units like literals, names, operators, etc.
		Clicking a node of the tree navigates the cursor in the source code
		editor to the corresponding element. The position of the element is
		furthermore provided in parentheses, in the form (line:character).
		</p>
		<p>
		During runtime, the tree displays the current instruction by
		highlighting it with an orange background. It provides an
		instructive illustration of the program flow, which can be a
		valuable debugging aid.
		</p>
	`,
	"children": []},
	{"id": "program",
	"name": "Program IO Panels",
	"title": "Program IO Panels",
	"content": `
		<p>
		There are two panels dedicated to input and output of the program:
		one for turtle graphics, and one for a proper graphical user interface.
		It is uncommon to include these facilities directly into an IDE. This
		is because programs are supposed to run independent of the IDE. For
		TScript this is a minor concern, since the language is not designed
		for production use.
		</p>

		<h2>Turtle Graphics</h2>
		<p>
		The turtle graphics panel represents the area in which the fictitious
		turtle robot moves around. The panel contains the lines drawn by the
		robot while moving. It does not display the turtle.
		</p>
		<p>
		The panel is automatically cleared at program start. The drawing
		remains even after the program has finished.
		</p>
		<p>
		The drawing area is a square. However, for display, the area is
		stretched along one axis to match the aspect ratio of the panel.
		Therefore it is best practice to keep the panel roughly square shaped.
		</p>

		<h2>Canvas Graphics</h2>
		<p>
		The canvas panel contains a canvas for drawing geometric shapes and
		text. With these tools it is rather easy to display images, for
		example for simple video games. The panel allows for rich user
		interaction. Mouse clicks and mouse pointer movement as well as key
		presses generate events that can be processed by the program to
		create interactive applications.
		</p>
	`,
	"children": []},
]
});
"use strict"

if (doc) doc.children.push({
"id": "language",
"name": "The TScript Language",
"title": "Reference Documentation for the TScript Programming Language",
"content": `
	<p>
	This is the reference documentation of the TScript programming
	language. It covers all language features in great detail and with
	precision.
	</p>
`,
"children": [
	{"id": "syntax",
	"name": "Syntax",
	"title": "Syntax",
	"content": `
		<p>
		The syntax of the TScript language specifies whether a text is
		a well-formed (valid) or ill-formed (invalid) program. A
		well-formed program can be executed, while trying to run
		an ill-formed (or malformed) program results in an error
		message already before the program starts. The syntax is
		specified in terms of an
		<a target="_blank" href="https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form">Extended Backus-Naur Form (EBNF)</a>.
		</p>
		<p>
		The documents within this section define various general aspects
		of the TScript syntax. For completeness sake, we also provide a
		<a href="#/language/syntax/EBNF-syntax">complete formal EBNF definition of the TScript syntax</a>.
		</p>
	`,
	"children": [
		{"id": "character-set",
		"name": "Character Set",
		"title": "Character Set",
		"content": `
			<p>
			TScript source code consists of unicode characters from the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane">Basic Multilingual Plane</a> (BMP).
			These characters have codes in the range U+0000 to U+FFFF.
			In other words, each character (or "code point") can be
			represented as an unsigned 16-bit integer.
			</p>
			<p>
			However, this document does not specify the <i>character
			encoding</i>, but only the <i>character set</i>. So for
			example UTF-8 encoded text is fine, as long as it does not
			contain code points above U+FFFF.
			</p>
			<p>
			Outside of
			<a href="#/language/syntax/comments">comments</a> and
			<a href="#/language/expressions/literals/strings">string literals</a>,
			only the printable ASCII range U+0020 to U+007E and the
			ASCII control characters U+0009 (horizontal tabulator),
			U+000A (line feed), and U+000D (carriage return) are valid.
			</p>
			<p>
			Inside comments and string literals, the full range U+0000
			to U+FFFF is legal. Every character can be denoted in plain
			ASCII by means of an escaping mechanism.
			</p>
			<p>
			<b>Note:</b>
			The TScript implementation is based directly on Javascript
			(ECMAScript&nbsp;6). Javascript allows its implementations
			to support the complete unicode range by composing
			characters outside the BMP with the UTF16 encoding, but this
			feature is not mandatory. In practice, Javascript engines do
			support the mechanism, which amounts to representing the
			unicode characters outside the BMP with two characters in
			the range U+0000 to U+FFFF. This solution is error-prone.
			For example, it is somewhat surprising if a string that
			prints as a single character consists of two characters, as
			revealed by the size method and when accessing the
			characters, slicing the string, etc. It is therefore
			recommended to restrict string contents to the BMP.
			</p>
		`,
		"children": []},
		{"id": "tokens",
		"name": "Tokens",
		"title": "Tokens",
		"content": `
			<p>
			A TScript program consists of a sequence of tokens. Each
			token is a meaningful and often short string of characters
			with clear semantics. Tokens can be separated by whitespace,
			comments, other terminals, or they can be self-delimiting.
			A sequence of input characters that does not match any of
			the token types results in a syntax error.
			</p>

			<h2>Whitespace and Comments</h2>
			<p>
			Whitespace and
			<a href="#/language/syntax/comments">comments</a> are not
			by themselves considered tokens, but they separate tokens
			and therefore they must be defined:
			<ebnf>
				whitespace = " " | tabulator | carriage-return | line-feed ;
				tabulator = $ U+0009 $ ;
				carriage-return = $ U+000A $ ;
				line-feed = $ U+000D $ ;
				comment = line-comment | block-comment ;
				line-comment = "#" (unicode-char - "*" - line-feed)
				                   { unicode-char - line-feed } ;
				block-comment = "#*" { (unicode-char - "*")
				                       | ("*" { "*" } (unicode-char - "#"))
				                     } "*#" ;
				unicode-char = $ any Unicode character U+0000 to U+FFFF $ ;
			</ebnf>
			</p>

			<h2>Identifiers and Keywords</h2>
			<p>
			An identifier is defined as follows:
			<ebnf>
				identifier = id_or_key - keyword ;
				id_or_key = (letter | "_") { letter | digit | "_" } ;
				letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
				       | "H" | "I" | "J" | "K" | "L" | "M" | "N"
				       | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
				       | "V" | "W" | "X" | "Y" | "Z" | "a" | "b"
				       | "c" | "d" | "e" | "f" | "g" | "h" | "i"
				       | "j" | "k" | "l" | "m" | "n" | "o" | "p"
				       | "q" | "r" | "s" | "t" | "u" | "v" | "w"
				       | "x" | "y" | "z" ;
				digit = "0" | "1" | "2" | "3" | "4" | "5" | "6"
				      | "7" | "8" | "9" ;
				keyword = $ list of TScript keywords $ ;
			</ebnf>
			It is essentially a non-empty name consisting of letters,
			digits and underscores that does not start with a digit.
			For the definition of <ebnf>keyword</ebnf> see the
			<a href="#/language/syntax/keywords">list of keywords</a>.
			</p>

			<h2>Integers</h2>
			<p>
			An integer is simply defined as a non-empty sequence of
			digits:
			<ebnf>
				integer = digit { digit } ;
			</ebnf>
			Too large tokens exceeding the
			<a href="#/language/types/integer">integer</a> range result
			in an error message when parsing the literal formed from the
			token.
			</p>

			<h2>Reals</h2>
			<p>
			A real must contain a fractional part, or an exponent, or both:
			<ebnf>
				real = integer "." integer
					 | integer ("e" | "E") [ "+" | "-" ] integer
				     | integer "." integer ("e" | "E") [ "+" | "-" ] integer ;
			</ebnf>
			</p>

			<h2>Strings</h2>
			<p>
			Simple strings are character sequences enclosed in double
			quotes. A string token can contain escape sequences. It is
			defined as follows:
			<ebnf>
				string = '"' { (unicode-char - "\\" - line-feed) | escape } '"' ;
				escape = "\\" "\\"
				       | "\\" '"'
				       | "\\" "r"
				       | "\\" "n"
				       | "\\" "t"
				       | "\\" "f"
				       | "\\" "b"
				       | "\\" "/"
				       | "\\" "u" hex hex hex hex ;
				hex = digit | "A" | "B" | "C" | "D" | "E" | "F"
				            | "a" | "b" | "c" | "d" | "e" | "f" ;
			</ebnf>
			A <a href="#/language/expressions/literals/strings">string literal</a>
			can consist of multiple such tokens.
			</p>

			<h2>Operators, Groupings, and Separators</h2>
			<p>
			For these simple token types, we let the definition speak
			for itself. Note that some operators start with a shorter
			sequence that also forms an operator. The token is always
			the longest possible sequence.
			</p>
			<ebnf>
				operator = arithmetic_op | compare_op | assign-op ;
				binary-op = "+" | "-" | "*" | "/" | "//" | "%" | "^" ;
				compare_op = "==" | "!=" | "<" | "<=" | ">" | ">=" ;
				assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
				grouping = "(" | ")" | "[" | "]" | "{" | "}" ;
				separator = "," | "." | ";" ;
			</ebnf>
		`,
		"children": []},
		{"id": "keywords",
		"name": "Keywords",
		"title": "List of Keywords",
		"content": `
			<p>
			Certain identifier names are disallowed, namely the
			so-called keywords. Here is a complete list of all TScript
			keywords in alphabetical order:
			</p>
			<ul>
				<li><keyword>and</keyword></li>
				<li><keyword>break</keyword></li>
				<li><keyword>case</keyword></li>
				<li><keyword>catch</keyword></li>
				<li><keyword>class</keyword></li>
				<li><keyword>const</keyword></li>
				<li><keyword>constructor</keyword></li>
				<li><keyword>continue</keyword></li>
				<li><keyword>default</keyword></li>
				<li><keyword>do</keyword></li>
				<li><keyword>else</keyword></li>
				<li><keyword>enum</keyword></li>
				<li><keyword>export</keyword></li>
				<li><keyword>false</keyword></li>
				<li><keyword>for</keyword></li>
				<li><keyword>from</keyword></li>
				<li><keyword>function</keyword></li>
				<li><keyword>if</keyword></li>
				<li><keyword>import</keyword></li>
				<li><keyword>include</keyword></li>
				<li><keyword>module</keyword></li>
				<li><keyword>namespace</keyword></li>
				<li><keyword>not</keyword></li>
				<li><keyword>null</keyword></li>
				<li><keyword>operator</keyword></li>
				<li><keyword>or</keyword></li>
				<li><keyword>private</keyword></li>
				<li><keyword>protected</keyword></li>
				<li><keyword>public</keyword></li>
				<li><keyword>return</keyword></li>
				<li><keyword>static</keyword></li>
				<li><keyword>super</keyword></li>
				<li><keyword>switch</keyword></li>
				<li><keyword>then</keyword></li>
				<li><keyword>this</keyword></li>
				<li><keyword>throw</keyword></li>
				<li><keyword>true</keyword></li>
				<li><keyword>try</keyword></li>
				<li><keyword>use</keyword></li>
				<li><keyword>var</keyword></li>
				<li><keyword>while</keyword></li>
				<li><keyword>xor</keyword></li>
			</ul>
			<p>
			Not all keywords are used in the current version of the language,
			some are reserved for future extensions.
			</p>
		`,
		"children": []},
		{"id": "comments",
		"name": "Comments",
		"title": "Line and Block Comments",
		"content": `
			<p>
			Comments are pieces of program code without any semantic
			meaning. In other words, comments are ignored when running
			the program. While being ignored by the machine, they are
			intended to be read by humans, usually for the purpose of
			documentation. In TScript there are two types of comments:
			line comments and block comments.
			</p>
			<h2>Line Comments</h2>
			<p>
			Line comments start with the token
			<code class="code">#</code> not immediately followed by
			<code class="code">*</code> and extend to the end of the
			line. One beneficial property of line comments is that they
			can be nested, i.e.,
			<tscript>
				# # a nested line comment
			</tscript>
			is still a valid comment, since the fact that a comment is
			inside another comment is ignored.
			</p>
			<h2>Block Comments</h2>
			<p>
			Block comments start with <code class="code">#*</code> and end with
			<code class="code">*#</code>. In contrast to line comments, block
			comments are entirely free in their extent. They may span
			only a small part of a line or even multiple lines. The price to pay is that
			block comments cannot be nested, since in
			<div class="code"><pre class="code"><code class="code"><span class="code-comment">#* a broken #* block *#</span> comment *#</code></pre></div>
			the comment ends with the <i>first</i> occurrence of
			<code class="code">*#</code>, so that <code class="code">comment *</code> is
			interpreted as program code (which is most probably malformed),
			and the final <code class="code">#</code> as the start of a
			line comment.
			</p>
		`,
		"children": []},
		{"id": "lexical-blocks",
		"name": "Lexical Blocks and Separators",
		"title": "Lexical Blocks and Separators",
		"content": `
			<p>
			In TScript, whitespace is useful for separating tokens, but
			it is insignificant for separating language constructs like
			definitions, statements, and directives. In particular,
			indentation is optional, and statements can extend beyond
			the end of the current line. Instead, declarations and
			statements are delimited by keywords and, in most cases,
			with a semicolon&nbsp;<tscript>;</tscript>. This means that
			in many cases the tokens in between semicolons form a single
			statement.
			</p>
			<p>
			Another useful structural property of the TScript language that
			becomes apparent already at the lexical level are parentheses
			<code class="code">( )</code>, square brackets <code class="code">[ ]</code>,
			and curly braces <code class="code">{ }</code>. The TScript syntax
			is designed so that opening and closing tokens must always match.
			For example, when encountering the sequence of tokens
			<code class="code">{(</code> then <code class="code">)</code> is fine, while
			encountering <code class="code">}</code> first indicates a syntax error.
			</p>
		`,
		"children": []},
		{"id": "EBNF-syntax",
		"name": "Complete EBNF Syntax",
		"title": "Complete Formal EBNF Definition of the TScript Syntax",
		"content": `
			<p>
			This section collects all syntax rules for reference.
			</p>

			<ebnf>
			whitespace = " " | tabulator | carriage-return | line-feed ;
			tabulator = $ U+0009 $ ;
			carriage-return = $ U+000A $ ;
			line-feed = $ U+000D $ ;
			comment = line-comment | block-comment ;
			line-comment = "#" (unicode-char - "*" - line-feed)
			                   { unicode-char - line-feed } ;
			block-comment = "#*" { (unicode-char - "*")
			                       | ("*" { "*" } (unicode-char - "#"))
			                     } "*#" ;
			unicode-char = $ any Unicode character U+0000 to U+FFFF $ ;
			identifier = id_or_key - keyword ;
			id_or_key = (letter | "_") { letter | digit | "_" } ;
			letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
			       | "H" | "I" | "J" | "K" | "L" | "M" | "N"
			       | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
			       | "V" | "W" | "X" | "Y" | "Z" | "a" | "b"
			       | "c" | "d" | "e" | "f" | "g" | "h" | "i"
			       | "j" | "k" | "l" | "m" | "n" | "o" | "p"
			       | "q" | "r" | "s" | "t" | "u" | "v" | "w"
			       | "x" | "y" | "z" ;
			digit = "0" | "1" | "2" | "3" | "4" | "5" | "6"
			      | "7" | "8" | "9" ;
			keyword = "and" | "break" | "catch" | "class" | "constructor"
			        | "continue" | "do" | "else" | "false" | "for" | "from"
			        | "function" | "if" | "namespace" | "not" | "null"
			        | "or" | "private" | "protected" | "public" | "return"
			        | "static" | "super" | "then" | "this" | "throw"
			        | "true" | "try" | "use" | "var" | "while" | "xor" ;

			integer = digit { digit } ;
			real = integer "." integer
				 | integer ("e" | "E") [ "+" | "-" ] integer
			     | integer "." integer ("e" | "E") [ "+" | "-" ] integer ;
			string = '"' { (unicode-char - "\\" - line-feed) | escape } '"' ;
			escape = "\\" "\\"
			       | "\\" '"'
			       | "\\" "r"
			       | "\\" "n"
			       | "\\" "t"
			       | "\\" "f"
			       | "\\" "b"
			       | "\\" "/"
			       | "\\" "u" hex hex hex hex ;
			hex = digit | "A" | "B" | "C" | "D" | "E" | "F"
			            | "a" | "b" | "c" | "d" | "e" | "f" ;

			operator = arithmetic_op | compare_op | assign-op ;
			binary-op = "+" | "-" | "*" | "/" | "//" | "%" | "^" ;
			compare_op = "==" | "!=" | "<" | "<=" | ">" | ">=" ;
			assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
			grouping = "(" | ")" | "[" | "]" | "{" | "}" ;
			separator = "," | "." | ";" ;

			declaration = var-decl
			            | func-decl
			            | class-decl
			            | namespace-decl ;

			var-decl = "var" single-var { "," single-var } ";" ;
			single-var = identifier [ "=" expression ] ;
			func-decl = "function" identifier "(" param-list ")" func-body ;
			param-list = [ param-decl { "," param-decl } ] ;
			param-decl = identifier [ "=" constant-ex ] ;
			constant-ex = $ expression that evaluates to a constant $ ;
			func-body = "{" { declaration | statement | directive } "}" ;
			class-decl = "class" identifier [ ":" name ] class-body ;
			class-body = "{" "}" | "{" visibility { visibility
			                                        | constructor
			                                        | [ "static" ] declaration
			                                        | directive }
			                         "}" ;
			visibility = ("public" | "procected" | "private") ":" ;
			constructor = "constructor" "(" param-list ")"
			         [ ":" "super" "(" [ expression { "," expression } ] ")" ]
			         func-body ;
			namespace-decl = "namespace" identifier namespace-body ;
			namespace-body = "{" { declaration | statement | directive } "}"

			directive = use ;
			use-directive = [ "from" name ] "use" name-import
			                                     { "," name-import } ";" ;
			name-import = ("namespace" use-name)
			            | (use-name [ "as" identifier ]) ;
			use-name = identifier { "." identifier } ;

			expression = literal
			           | group
			           | unary-operator
			           | binary-operator
			           | function-call
			           | item-access
			           | member-access
			           | name ;
			literal = null
			        | boolean
			        | integer
			        | real
			        | string { string }
			        | array
			        | dictionary
			        | lambda ;
			null = "null" ;
			boolean = "true" | "false" ;
			array = empty-array | nonempty-array ;
			empty-array = "[" "]" ;
			nonempty-array = "[" expression { "," expression } [ "," ] "]" ;
			dictionary = empty-dictionary | nonempty-dictionary ;
			empty-dictionary = "{" "}" ;
			nonempty-dictionary = "{" key-value { "," key-value } [ "," ] "}" ;
			key-value = (string | identifier) ":" expression ;
			lambda = "function" [ closure ] "(" param-list ")" func-body ;
			closure = "[" [ closure-param { "," closure-param } ] "]" ;
			closure-param = [ identifier "=" ] expression ;
			param-list = [ param-decl { "," param-decl } ] ;
			param-decl = identifier [ "=" constant-ex ] ;
			constant-ex = $ expression that evaluates to a constant $ ;
			func-body = "{" { declaration | statement | directive } "}" ;
			name = ("super" "." identifier) | (identifier {"." identifier})

			block = "{" { declaration | statement | directive } "}" ;
			assignment = lhs assign-op expression ";" ;
			lhs = name
			        | expression "[" expression "]"
			        | expression "." identifier ;
			assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
			condition = "if" expression "then" statement
			                          [ "else" statement ] ;
			for-loop = "for" [ loop-var "in" ] expression "do" statement ;
			loop-var = ("var" identifier) | name ;
			while-do-loop = "while" expression "do" statement ;
			do-while-loop = "do" statement "while" expression ";" ;
			break = "break" ";" ;
			continue = "continue" ";" ;
			return = "return" [ expression ] ";" ;
			throw = "throw" expression ";" ;
			try-catch = "try" statement
			            "catch" "var" identifier "do" statement ;

			program = { declaration | statement | directive } ;
			</ebnf>
		`,
		"children": []},
	]},
	{"id": "declarations",
	"name": "Declarations",
	"title": "Declarations",
	"content": `
		<p>
		A declaration defines a named entity. Possible entities are variables,
		functions, classes, and namespaces. Hence, a declaration is defined
		formally as follows:
		<ebnf>
			declaration = var-decl
			            | func-decl
			            | class-decl
			            | namespace-decl ;
		</ebnf>
		The terms on the right hand side are defined in the following
		sub-sections.
		</p>
	`,
	"children": [
		{"id": "variables",
		"name": "Variables",
		"title": "Variables",
		"content": `
			<p>
			A variable is a named entity referencing a value.
			</p>

			<h2>Syntax</h2>
			<p>
			Variables are declared with following syntax:
			<ebnf>
				var-decl = "var" single-var { "," single-var } ";" ;
				  single-var = identifier [ "=" expression ] ;
			</ebnf>
			They are referenced by their name.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a, b=5, c=b+1;
					print(a);
					print(b + c);
				</tscript>
			</div>
			<p>
			At each time, a variable references exactly one value. Variables
			are untyped; they can refer to a values of any type, and the type
			can change during runtime.
			If a variable is not initialized (like <code class="code">a</code>
			in the above example), then it is implicitly set to
			<keyword>null</keyword>. Therefore the following two statements
			are equivalent:
			<tscript>
				var x;
			</tscript>
			<tscript>
				var x = null;
			</tscript>
			The variable name must not appear anywhere in its initializer,
			i.e., in the expression on the right hand side of the equals sign.
			</p>
			<p>
			Multiple variables can refer to the same value.
			<a href="#/language/statements/assignments">Assigning</a> a value
			to a variable only references the value, it does not copy the value.
			It is different from initialization, and the variable itself may
			appear on the right hand side, referring to the old value before
			the actual assignment takes place:
			<tscript>
				var x = 3;       # initialization
				x = 2 * x + 1;   # assignment
			</tscript>
			</p>
			<p>
			Parameters of functions are also variables, although they are
			declared without <keyword>var</keyword>
			(see <a href="#/language/declarations/functions">functions</a>).
			They are initialized to a value provided by the function
			call or to their default value, if present. Default values
			are limited to constant expressions.
			</p>
			<p>
			Variables inside classes are called attributes. These variables
			can be initialized, but the initializer must evaluate to a
			constant. Variable that should be initialized to a value
			computed at runtime can be set in the constructor.
			</p>
			<p>
			Closure parameters are somewhere in between the above two cases.
			They are stored inside the function closure like attributes in
			an object. Whenever the closure is called they are copied, and
			the copies become parameters of the function.
			</p>

			<h2>Lifetime of Variables</h2>
			<p>
			TScript distinguishes three types of variables:
			<ul>
				<li>Global variables are declared at global scope, in a namespace, or as static attributes of global classes. They are available for the whole runtime of the program.</li>
				<li>Local variables are declared in a non-global non-class scope, or as parameters of a function or closure. They are available inside their defining scope, or for closure parameters, inside the function body. After the scope is left they "go out of scope" and cannot be accessed any more.</li>
				<li>Attributes are declared in a class scope. Non-static attributes are part of an object, and hence their lifetime is bound to the lifetime of the object.</li>
			</ul>
			It may seem at first glance that binding a variable to a closure extends its lifetime to the lifetime of the closure. This is not the case. Instead, values are <i>copied</i> into closure parameters, which are independent variables, as demonstrated here:
			<tscript>
				function f()
				{
					var x = 42;
					var ret = function [x] () { return x; };
					x *= 2;
					return ret;
				}
				print(f()());   # prints 42, not 84
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "functions",
		"name": "Functions",
		"title": "Functions",
		"content": `
			<p>
			A function is a named block of code that can be invoked arbitrarily
			often, possibly with different parameter values.
			</p>

			<h2>Syntax</h2>
			<p>
			Functions are declared with the following syntax:
			<ebnf>
				func-decl = "function" identifier "(" param-list ")" func-body ;
				  param-list = [ param-decl { "," param-decl } ] ;
				  param-decl = identifier [ "=" constant-ex ] ;
				  constant-ex = $ expression that evaluates to a constant $ ;
				  func-body = "{" { declaration | statement | directive } "}" ;
			</ebnf>
			It is referenced by its name, and invoked by
			<a href="#/language/expressions/function-calls">providing
			values for the parameters in parentheses</a>. The effect of invoking a
			function is that the control flow is transferred to the function body.
			After the function body is left with a <keyword>return</keyword>
			statement or by reaching the end of the function body, the control flow
			is returned to the calling context.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function circleArea(radius)
					{
						return math.pi() * radius * radius;
					}
					var func = circleArea;
					print(circleArea(3));   # prints 9*pi = 28.2743...
					print(func(3));         # prints 9*pi = 28.2743...
				</tscript>
			</div>
			<p>
			Parameters of functions are always named, with an optional default value.
			As can be seen in the above example, function names are valid expressions
			(of type <a href="#/language/types/function">Function</a>).
			</p>
			<p>
			An alternative way to define functions are
			<a href="#/language/expressions/literals/anonymous-functions">anonymous
			functions</a>.
			</p>
		`,
		"children": []},
		{"id": "classes",
		"name": "Classes",
		"title": "Classes",
		"content": `
			<p>
			A class declaration adds a new type to the program. Values or objects
			of this type can be instantiated by calling the type like a function.
			</p>

			<h2>Syntax</h2>
			<p>
			A class is declared with the following syntax:
			<ebnf>
				class-decl = "class" identifier [ ":" name ] class-body ;
				  class-body = "{" "}" | "{" visibility { visibility
				                                        | constructor
				                                        | [ "static" ] declaration
				                                        | directive }
				                         "}" ;
				  visibility = ("public" | "procected" | "private") ":" ;
				  constructor = "constructor" "(" param-list ")"
				         [ ":" "super" "(" [ expression { "," expression } ] ")" ]
				         func-body ;
			</ebnf>
			Refer to <a href="#/language/declarations/functions">functions</a>
			for a definition of <ebnf>param-list</ebnf> and <ebnf>func-body</ebnf>.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					class Circle
					{
						use namespace math;

					private:
						var m_radius = 0;

					public:
						constructor(radius)
						{ m_radius = radius; }
						function radius()
						{ return m_radius; }
						function area()
						{ return pi() * m_radius * m_radius; }
					}

					var c = Circle(3);
					print("The circle has radius " + c.radius() +
							" and area " + c.area() + ".");
				</tscript>
			</div>

			<h2>The Constructor</h2>
			<p>
			The constructor of a class is called whenever the class is instantiated,
			i.e., when a new object of that very class is created. Its role is to
			initialize the object's state, comprised by its attributes. Attributes
			can equally well be declared with a constant initializer. Non-constant
			(parameter-dependent) initialization is done in the constructor.
			Of course, the constructor can perform further tasks. Uninitialized
			members hold the value <keyword>null</keyword>.
			</p>
			<p>
			Classes with a public constructor can be instantiated from everywhere,
			and the same holds for classes without constructor (which implies the
			generation of a public default constructor). Constructors can also be
			protected or private. A class with private constructor can be
			instantiated only from within a method of the class, and the class
			cannot have sub-classes. A class with protected constructor can have
			sub-classes, since the constructor can be called from a sub-class
			constructor.
			</p>

			<h2>Static and Non-Static Members</h2>
			<p>
			Declarations inside the function body as known as members of the class.
			Members can be declared <keyword>static</keyword>. Static members belong
			to the class, not to its objects. For a static variable (also called a
			class variable) this means that a single instance of the variable with
			global lifetime exists, independent of the number of objects of the
			class. In contrast, the liftime of attributes (non-static variables) is
			bound to the object. A non-static function member is called a method.
			</p>
			<p>
			A public member of a class is referenced with the dot-operator, as seen
			in the example above. Inside the class, its members can be accessed by
			their names. The object itself, i.e., the left-hand-side of the
			<a href="#/language/expressions/member-access">dot operator</a>,
			is available under the name <keyword>this</keyword>. A static function
			can be invoked without referring to an instance of the class, and hence
			<keyword>this</keyword> is undefined in a static function. The following
			example demonstrates static members:
			<tscript>
				class Counted
				{
				private:
					static var m_counter = 0;

				public:
					constructor() { m_counter += 1; }
					function doSomething() { #* dummy *# }
					static function numberOfInstances()
					{
						# doSomething();   # error; this is not defined
						# return this;     # error; this is not defined
						return m_counter;
					}
				}
				var a = Counted(), b = Counted(), c = Counted();
				print(Counted.numberOfInstances());
				print(a.numberOfInstances());
			</tscript>
			</p>

			<h2>Dynamic Dispatching</h2>
			<p>
			Member name lookup of the form <code class="code">a.numberOfInstances</code>
			in the above code happens dynamically at runtime. The result of the
			<a href="#/language/expressions/member-access">member access</a> (and
			therefore, in this context, the invoked function) depends on the type
			of the left-hand-side, provided that multiple classes declare a member
			of the same name. This is an elegant mechanism for creating implicit
			switches in code based on the type of data it encounters. Referencing
			a member name that does not exist in the type (more precisely, in its
			public interface) results in an error message.
			</p>

			<h2>Visibility of Members</h2>
			<p>
			TScript classes allow for proper information hiding, i.e., they can
			hide implementation details behind a public or protected interface. From
			outside the class, only members declared <keyword>public</keyword> are
			visible, i.e., members following a <keyword>public</keyword> declaration.
			In addition, <keyword>protected</keyword> members are visible within
			sub-classes (see below), while <keyword>private</keyword> members are
			only visible within the class itself. It is common practice to declare
			most attributes as private to the class, and to provide access
			facilities in terms of protected and public methods.
			</p>
			<p>
			Also inside classes, the general principle that declarations can be
			used only after they were declared is applied. Therefore it is common
			practice to declare attributes towards the beginning of the class, so
			that they can be accessed by methods declared below them.
			</p>
			<p>
			Hiding information is not always necessary, and sometimes
			over-complicates matters. In some cases simple classes consisting
			only of public attributes are a meaningful choice. For example, the
			following class may represent a point in a two-dimensional coordinate
			system:
			<tscript>
				class Point
				{
				public:
					var x, y;

					constructor(x_, y_)
					{ x = x_; y = y_; }
				}
				
			</tscript>
			The same data can of course be held in an array
			<code class="code">[x,y]</code> or a dictionary
			<code class="code">{"x":x,"y":y}</code>, but the class has the
			advantages of making the role of the type and of its members explicit.
			This makes code more readable and more maintainable. Furthermore it
			adds the ability of code to test for its the data type to clarify the
			role of a value, which is not possible with generic containers since
			they are used for many purposes.
			</p>

			<h2>Inheritance</h2>
			<p>
			A class can be based on any other type, including all the
			<a href="#/language/types">built-in types</a> (however, note that
			aggregation is often preferable over inheriting an immutable type).
			This means that the type, also known as the sub-class in this context,
			inherits all properties and members from its super-class.
			</p>
			<p>
			Subclassing is a common mechanism for extending the functionality of
			a type, and for creating a set of types with a uniform interface.
			The mechanism allows to override (generic) functionality of the base
			or super class with (specialized) functionality of the sub-class,
			simply by declaring a method of the same name as in the super class.
			This does not create a name conflict. When invoking such a method on
			an object of the sub-class then the dispatching rules dictate that the
			method declared in the sub-class is invoked, and the method in the
			super class is ignored.
			</p>
			<p>
			When implementing sub-classes, there regularly is the demand to access
			a super-class member of the same name or the super class constructor.
			This can be achieved with a special syntax for the constructor and for
			names based on the <keyword>super</keyword> keyword, as follows:
			<tscript>
				class Person
				{
				private:
					var m_name;
					var m_address;

				public:
					constructor(name, address)
					{
						m_name = name;
						m_address = address;
					}

					function description()
					{ return "name: " + m_name + "\\naddress: " + m_address + "\\n"; }
				}

				class Customer : Person
				{
				private:
					var m_customerID;

				public:
					constructor(id, name, address)
					: super(name, address)
					{ m_customerID = id; }

					function description()
					{ return "id: " + m_customerID + "\\n" + super.description(); }
				}

				var c = Customer("1357", "Joe", "city center");
				print(c.description());
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "namespaces",
		"name": "Namespaces",
		"title": "Namespaces",
		"content": `
			<p>
			A namespace is a named scope designed to organize declarations.
			</p>

			<h2>Syntax</h2>
			Namespaces are declared with the following syntax:
			<p>
			<ebnf>
				namespace-decl = "namespace" identifier namespace-body ;
				  namespace-body = "{" { declaration | statement | directive } "}" ;
			</ebnf>
			Namespaces can only be declared at global scope or within other
			namespaces. However, the same namespace can be declared multiple
			times. The different declarations are treated as parts of the same
			namespace.
			</p>

			<div class="example">
				<h3>Example</h3>
				<tscript>
					namespace distributions
					{
						namespace detail
						{
							function gaussian()
							{
								var g = math.sin(2 * math.pi() * math.random());
								g *= math.sqrt(-2 * math.log(math.random()));
								return g;
							}
						}

						function uniform(lower, upper)
						{
							return lower + (upper - lower) * math.random();
						}

						function exponential(lambda)
						{
							return -math.log(math.random()) / lambda;
						}

						function gaussian(mu, sigma)
						{
							return mu + sigma * detail.gaussian();
						}
					}

					for var i in 0:20 do print(distributions.gaussian(1.5, 0.1));
				</tscript>
			</div>
			<p>
			Namespaces allow to keep globally accessible names out of the global
			scope. For large collections of declarations this greatly reduces the
			chance of name collisions. This is particularly important when working
			with large software libraries.
			</p>
			<p>
			As a price, the full names of declarations get longer, since the
			namespace name is prepended to the declared name, separated with a dot.
			This is not necessarily an issue since individual names and even whole
			namespaces can be <a href="#/language/directives/use">imported</a> into
			the scopes where they are used. Since import is usually selective, name
			collisions are still rate.
			</p>
		`,
		"children": []},
	]},
	{"id": "directives",
	"name": "Directives",
	"title": "Directives",
	"content": `
		<p>
		A directive is an instruction to the TScript language that is
		not directly related to the program flow itself. It is neither a
		declaration nor a statement.
		<ebnf>
			directive = use ;
		</ebnf>
		Currently, the only directive is the
		<a href="#/language/directives/use">use</a> directive. There exist
		plans to add directives for including external files and libraries
		in the future.
		</p>
	`,
	"children": [
		{"id": "use",
		"name": "Using Names from Namespaces with Use Directives",
		"title": "Using Names from Namespaces with Use Directives",
		"content": `
			<p>
			A <keyword>use</keyword> directive imports names declared in a
			namespace directly into the current scope. This allows for
			easier access to names that are otherwise lengthy to write
			out. The syntax is as follows:
			<ebnf>
				use-directive = [ "from" name ] "use" name-import
				                                     { "," name-import } ";" ;
				name-import = ("namespace" use-name)
				            | (use-name [ "as" identifier ]) ;
				use-name = identifier { "." identifier } ;
			</ebnf>
			</p>
			<p>
			A <ebnf>name</ebnf> refers to a declaration inside
			a namespace, possibly to a namespace itself. The first form
			<ebnf>"namespace" name</ebnf> imports all names <i>inside</i>
			the the referenced namespace into the current scope. The
			second form <ebnf>name ["as" identifier]</ebnf> imports a
			single name. In the latter case the optional identifier is
			a new alias name under which the original declaration is
			made available. If it is not provided, then the last identifier
			of the fully qualified name is used, e.g., <code class="code">c</code>
			is used when importing the name <code class="code">a.b.c</code>.
			If <ebnf>"from" name</ebnf> is provided,
			then all subsequent names are looked up in the context of
			the given namespace, not in the context of the current
			scope.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					namespace a {
					    namespace b {
					        var y = "hello";
					    }
					}
					# all of the print statements output "hello":
					print(a.b.y);
					{
					    use namespace a;
					    print(b.y);
					}
					{
					    use namespace a.b;
					    print(y);
					}
					{
					    use a.b.y;
					    print(y);
					}
					{
					    from a use namespace b;
					    print(y);
					}
					{
					    from a use b.y;
					    print(y);
					}
					{
					    from a.b use y;
					    print(y);
					}
					{
					    from a.b use y as z;
					    print(z);
					}
				</tscript>
			</div>
		`,
		"children": []},
	]},
	{"id": "expressions",
	"name": "Expressions",
	"title": "Expressions",
	"content": `
		<p>
		An expression is a computation that produces a value. The simplest atomic
		expressions are constants and names referring to declarations. Expressions
		can be combined by means of operators into more complex expressions.
		</p>

		<h2>Syntax</h2>
		<p>
		Here we list groups of expression types, which are further differentiated
		in a number of sub-sections.
		<ebnf>
			expression = literal
			           | group
			           | unary-operator
			           | binary-operator
			           | function-call
			           | item-access
			           | member-access
			           | name ;
		</ebnf>
		</p>

		<h2>Side Effects</h2>
		<p>
		Some expressions have side effects. A side effect is defined as an effect
		that is unrelated to the computation of the expression result. In many
		cases, the only purpose of evaluating such expressions is to invoke the
		side effects. A simple example is the
		<a href="#/library/core">print</a> function:
		it prints its argument as a side effect and return <keyword>null</keyword>.
		In order to facilitate the invocation of such functions,
		<a href="#/language/statements/expressions">expressions can be used as
		statements</a>.
		</p>
	`,
	"children": [
		{"id": "literals",
		"name": "Literals",
		"title": "Literals",
		"content": `
		<p>
		TScript knows five types of atomic literals. From these,
		container-valued composite literals can be created. In addition,
		lambda functions are considered a special type of literal:
		<ebnf>
			literal = null
			        | boolean
			        | integer
			        | real
			        | string { string }
			        | array
			        | dictionary
			        | lambda ;
		</ebnf>
		</p>
		`,
		"children": [
			{"id": "null",
			"name": "The Null Literal",
			"title": "The Null Literal",
			"content": `
				<p>
				There is only one value of type
				<a href="#/language/types/null">Null</a>,
				denoted by the keyword <keyword>null</keyword>:
				<ebnf>
					null = "null" ;
				</ebnf>
				It is commonly used to represent a "meaningless" value,
				or a yet uninitialized value.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a;             # a is implicitly set to null
						var b = null;      # b is explicitly set to null
						if b == null then print("b is null.");
					</tscript>
				</div>
			`,
			"children": []},
			{"id": "booleans",
			"name": "Boolean Literals",
			"title": "Boolean Literals",
			"content": `
				<p>
				The <a href="#/language/types/boolean">Boolean</a> type represent the
				logical values <keyword>true</keyword> and <keyword>false</keyword>,
				both of which are keywords. They result from comparisons, and act as
				input to if-conditions and loop-statements:
				<ebnf>
					boolean = "true" | "false" ;
				</ebnf>
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = true;
						var b = false;
						var c = 3 == 5;     # assignment of false
						if c then
						    print("3 equals 5");
						else
						    print("3 differs from 5");
					</tscript>
				</div>
			`,
			"children": []},
			{"id": "integers",
			"name": "Integer Literals",
			"title": "Integer Literals",
			"content": `
				<p>
				An Integer literal represents a constant of type
				<a href="#/language/types/integer">Integer</a>. It is denoted by
				an integer <a href="#/language/syntax/tokens">token</a>.
				The value must lie in the integer range, i.e., it must not exceed
				2<sup>31</sup> - 1 = 2147483647.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = 0;
						var b = 42;
						var c = -99;             # negated literal 99
						# var d = -2147483648;   # error, range exceeded
						var e = -2147483647-1;
					</tscript>
				</div>
			`,
			"children": []},
			{"id": "reals",
			"name": "Real Literals",
			"title": "Real Literals",
			"content": `
				<p>
				A Real literal represents a constant of type
				<a href="#/language/types/real">Real</a>. It is denoted by a
				real <a href="#/language/syntax/tokens">token</a>.
				</p>
				<p>
				There is no syntax for denoting the special IEEE floating point
				values INF (infinity) and NaN (not a number) as literals. Instead
				the functions <a href="#/language/types/real">Real.inf()</a> and
				<a href="#/language/types/real">Real.nan()</a> can be used to create such
				literals. The methods <a href="#/language/types/real">Real.isFinite()</a>,
				<a href="#/language/types/real">Real.isInfinite()</a>, and
				<a href="#/language/types/real">Real.isNan()</a> test for degenerate values.
				Real numbers that exceed the range specified in the
				<a href="https://de.wikipedia.org/wiki/IEEE_754" target="_blank">IEEE 754 standard</a>
				overflow to positive or negative infinity, or underflow to zero.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = 4;             # not a real, but an integer
						var b = 4.0;           # real literal representing 4
						var c = 4e0;           # real literal representing 4
						var d = 400e-2;        # real literal representing 4
						var e = 0.04e2;        # real literal representing 4
						var f = -123.456e+78;  # negated literal 123.456e+78
						var g = 1E1000;        # overflow to infinity
						var h = 1E-1000;       # underflow to zero
						var pi = 3.1415926535897931;   # full precision literal
					</tscript>
				</div>
			`,
			"children": []},
			{"id": "strings",
			"name": "String Literals",
			"title": "String Literals",
			"content": `
				<p>A <a href="#/language/types/string">String</a>
				literal consists of a sequence of
				<a href="#/language/syntax/tokens">string tokens</a>,
				each of which is text enclosed in double quotes within a
				single line of code. String tokens must be separated only
				by whitespace including newlines, and comments.
				</p>
				<p>
				Every
				<a href="#/language/syntax/character-set">character</a>
				in between the double quotes is a part of the text
				belonging to the string literal, with one exception: the
				backslash '\' acts as a so-called escape character. This
				character introduces an escape sequence with a special
				meaning, as follows:
				</p>
				<ul>
					<li><code class="code">\\\\</code> represents a single backslash (ASCII 92)</li>
					<li><code class="code">\\"</code> represents double quotes (ASCII 34)</li>
					<li><code class="code">\\t</code> represents a horizontal tabulator (ASCII 9)</li>
					<li><code class="code">\\r</code> represents a carriage return (ASCII 13)</li>
					<li><code class="code">\\n</code> represents a line feed (ASCII 10)</li>
					<li><code class="code">\\f</code> represents a form feed (ASCII 12)</li>
					<li><code class="code">\\b</code> represents a backspace (ASCII 8)</li>
					<li><code class="code">\\/</code> represents a slash (ASCII 47)</li>
					<li><code class="code">\\uXXXX</code> represents any Unicode character, where XXXX is the 4-digit hexadecimal code of the character (or code point)</li>
				</ul>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						print("hello world");
						print("this string prints "
						        "on a single line");
						print("this string prints\\non two lines");
						print("a quote \\"Alea iacta est!\\" inside a string");
						print("escaped Euro sign: \\u20AC");
						print("multi "
						      "line "
						      "string "
						      "literal");
					</tscript>
				</div>
			`,
			"children": []},
			{"id": "arrays",
			"name": "Array Literals",
			"title": "Array Literals",
			"content": `
				<p><a href="#/language/types/array">Array</a>
				literals are comma-separated sequences of expressions enclosed
				in square brackets. The results of evaluating the expressions
				become the items of the array literal:
				<ebnf>
					array = empty-array | nonempty-array ;
					  empty-array = "[" "]" ;
					  nonempty-array = "[" expression { "," expression } [ "," ] "]" ;
				</ebnf>
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = [];                     # empty array
						var b = [16, true, "hello"];
						var c = [["nested", "array"], "literal"];
						var d = [c, 7*b[0], 2^10];
					</tscript>
				</div>
				<p>
				If all items are constants, then the whole array is a constant.
				</p>
			`,
			"children": []},
			{"id": "dictionaries",
			"name": "Dictionary Literals",
			"title": "Dictionary Literals",
			"content": `
				<p><a href="#/language/types/dictionary">Dictionary</a>
				literals are comma-separated sequences of key-value pairs enclosed
				in curly braces. A key-value pair consists of a key, which is either
				a string or an identifier, and a value, which is the result of an
				arbitrary expression:
				<ebnf>
					dictionary = empty-dictionary | nonempty-dictionary ;
					  empty-dictionary = "{" "}" ;
					  nonempty-dictionary = "{" key-value { "," key-value } [ "," ] "}" ;
					  key-value = (string | identifier) ":" expression ;
				</ebnf>
				The key-value pairs become the items of the
				dictionary literal. Importantly, the identifier is not looked up as
				a name, but it represents the string that would arise if it were
				enclosed in double quotes, so using identifiers instead of strings
				for keys is merely syntactic sugar that saves typing the double
				quotes. Keys are string tokens, not string literals, and hence cannot
				span multiple lines.
				</p>
				<p>
				Note that not all keys can be represented with the identifier
				short-notation, simply because they are not valid identifiers. Also
				note that this means that string variables cannot act as keys in
				string literals; this can be achieved with the
				<a href="#/language/expressions/item-access">item access operator</a>.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = {};             # empty dictionary
						# identifier keys:
						var b = {name: "Sam", phone: "911", age: 35};
						# non-identifier keys:
						var c = {"name": "Sam", "phone": "911", "age": 35};
						var d = {"---": math.sin(2), "true": math.cos(2)};

						# item access:
						print(b["name"]);
						print(c["name"]);
						print(d["---"]);
					</tscript>
				</div>
				<p>
				If all values are constants, then the whole dictionary is a constant.
				</p>
			`,
			"children": []},
			{"id": "anonymous-functions",
			"name": "Anonymous Functions",
			"title": "Anonymous Functions",
			"content": `
				<p>
				An anonymous function or lambda function follows the syntax:
				<ebnf>
					lambda = "function" [ closure ] "(" param-list ")" func-body ;
					  closure = "[" [ closure-param { "," closure-param } ] "]" ;
					  closure-param = [ identifier "=" ] expression ;
					  param-list = [ param-decl { "," param-decl } ] ;
					  param-decl = identifier [ "=" constant-ex ] ;
					  constant-ex = $ expression that evaluates to a constant $ ;
					  func-body = "{" { declaration | statement | directive } "}" ;
				</ebnf>
				In contrast to a <a href="#/language/declarations/functions">function
				declaration</a> it does not have a name by which is could be referenced.
				However, being an expression it can be stored in a variable or returned
				from a function. An anonymous function is of type
				<a href="#/language/types/function">Function</a>.
				</p>
				<p>
				Anonymous functions can enclose variables from their surrounding scopes,
				which are stored in the function object. In fact, the result of arbitrary
				expressions can be stored. These expressions are evaluated when the
				anonymous function is created. They are available from inside the
				function body when the function is invoked, which can be at a later time
				and, importantly, from a different scope. In the following (somewhat
				contrived) example, the variable <code class="code">square</code> is not
				accessible from the global scope where <code class="code">lambda</code>
				is defined, yet the variable is available inside the anonymous function
				because its value is enclosed in the function as a closure parameter.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						function createAreaCalculator(radius)
						{
							var square = radius * radius;
							return function [square] ()
								{
									return math.pi() * square;
								};  # the semicolon terminates the first return statement
						}
						var lambda = createAreaCalculator(3);
						print(lambda());   # prints 9*pi = 28.2743...
					</tscript>
				</div>
				<p>
				The abilities of anonymous functions to be declared in-place as an
				expression and to enclose values from a surrounding scope are
				particularly well-suited for callbacks.
				</p>
				<p>
				Lambda functions do not have a name, therefore they cannot be referred
				to by name. This is a problem when writing recursive algorithms, since
				the function must be able to call itself. To allow for recursion, the
				<keyword>this</keyword> keyword refers to the function itself. Hence,
				the following code computes the factorial of a number:
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var fac = function(n)
							{
								if n == 0
								then return 1;
								else return n * this(n-1);
							};
						print(fac(7));   # 5040
					</tscript>
				</div>
				<p>
				Note that writing the else-case as
				<code class="code">else return n * fac(n-1);</code> does not work
				because <code class="code">fac</code> is a variable that cannot be
				used until it is fully initialized, and the else-statement is part
				of the initializer.
				</p>
				<p>
				When invoking a lambda function, all closure variables are
				<i>copied</i> into the local frame. Hence, any modification of a
				closure variable is limited to the duration of the function
				execution.
				</p>
			`,
			"children": []},
		]},
		{"id": "unary-operators",
		"name": "Unary Operators",
		"title": "Unary Operators",
		"content": `
			<p>
			There are three unary operators, all of which are left-unary operators
			binding to an argument on their right-hand side.
			</p>
		`,
		"children": [
			{"id": "not",
			"name": "Logical or Bitwise Negation",
			"title": "Logical or Bitwise Negation",
			"content": `
				<p>
				<code class="code">operator not</code> performs a logical or bitwise
				negation of its argument. For <keyword>true</keyword> it returns
				<keyword>false</keyword> and for <keyword>false</keyword> it returns
				<keyword>true</keyword>, and it flips all 32 bits of an integer.
				When applied to a value that is not a
				<a href="#/language/types/boolean">Boolean</a> or an
				<a href="#/language/types/integer">Integer</a> then the operator
				reports an error.
				</p>
				<p>
				Note: For an integer x, <code class="code">(not x)</code> is
				equivalent to <code class="code">(-1 - x)</code>.
				</p>
			`,
			"children": []},
			{"id": "plus",
			"name": "Arithmetic Positive",
			"title": "Arithmetic Positive",
			"content": `
				<p>
				The unary <code class="code">operator +</code> represents "no sign
				change". In other words, it returns its argument unaltered.
				When applied to a non-numeric argument, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, the operator reports an
				error.
				</p>
			`,
			"children": []},
			{"id": "minus",
			"name": "Arithmetic Negation",
			"title": "Arithmetic Negation",
			"content": `
				<p>
				The unary <code class="code">operator -</code> represents algebraic
				negation, which is a change of sign; it returns "minus" its argument.
				When applied to a non-numeric argument, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, the operator reports an
				error.
				</p>
				<p>
				When applied to an <a href="#/language/types/integer">Integer</a>,
				then the operator is subject to integer overflow. Overflow happens
				only in a single case:
				<tscript>
					var a = -2^31;
					print(a);        # -2147483648
					print(-a);       # -2147483648 due to overflow
				</tscript>
				</p>
			`,
			"children": []},
		]},
		{"id": "binary-operators",
		"name": "Binary Operators",
		"title": "Binary Operators",
		"content": `
			<p>
			TScript defines a total of 17 binary operators. There are seven
			arithmetic operators, six comparison operators, three logical
			operators, and the range operator.
			</p>
		`,
		"children": [
			{"id": "addition",
			"name": "Addition",
			"title": "Addition",
			"content": `
				<p>
				The binary <code class="code">operator +</code> returns the sum of
				its arguments. If at least one argument is a string, then the
				concatenation of the arguments converted to strings.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, and if not at least one of
				the arguments is a <a href="#/language/types/string">String</a>,
				then the operator reports an error.
				</p>
				<p>
				Two integers are added as integers, and two reals are added as
				reals. Mixed cases are always treated as reals. This means that
				only in the first case the result is an integer. The corresponding
				overflow rules apply.
				</p>
				<p>
				For string concatenation, a non-string arguments is first converted
				to a string with the <a href="#/language/types/string">String</a>
				constructor. For core types like booleans, numeric types, array
				and dictionary containers and ranges this usually gives the desired
				result.
				</p>
			`,
			"children": []},
			{"id": "subtraction",
			"name": "Subtraction",
			"title": "Subtraction",
			"content": `
				<p>
				The binary <code class="code">operator -</code> returns the
				difference between its arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				Two integers are subtracted as integers, and two reals are subtracted
				as reals. Mixed cases are always treated as reals. This means that
				only in the first case the result is an integer. The corresponding
				overflow rules apply.
				</p>
			`,
			"children": []},
			{"id": "multiplication",
			"name": "Multiplication",
			"title": "Multiplication",
			"content": `
				<p>
				The binary <code class="code">operator *</code> returns the
				product of its arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				Two integers are multiplied as integers, and two reals are multiplied
				as reals. Mixed cases are always treated as reals. This means that
				only in the first case the result is an integer. The corresponding
				overflow rules apply.
				</p>
			`,
			"children": []},
			{"id": "real-division",
			"name": "Real Division",
			"title": "Real Division",
			"content": `
				<p>
				The binary <code class="code">operator /</code> returns the
				quotient of its arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				The arguments are always treated as reals. This means that the result
				is always a real, which can have a fractional part.
				</p>
			`,
			"children": []},
			{"id": "integer-division",
			"name": "Integer Division",
			"title": "Integer Division",
			"content": `
				<p>
				The binary <code class="code">operator //</code> returns the
				quotient of its arguments, rounded down to the nearest integer.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				If both arguments are integers then the result of the division is an
				integer. Integer division overflows only in a single case:
				<tscript>
					var a = -2^31;
					print(a);        # -2147483648
					print(a / -1);   # 2147483648 (real)
					print(a // -1);  # -2147483648 due to overflow
				</tscript>
				If at least one argument is a real then the arguments are treated
				as reals, and the result is real.
				</p>
			`,
			"children": []},
			{"id": "modulo",
			"name": "Modulo",
			"title": "Modulo",
			"content": `
				<p>
				The binary <code class="code">operator %</code> returns the
				remainder of the
				<a href="#/language/expressions/binary-operators/integer-division">integer division</a>
				of its arguments:</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a % b = a - (a // b) * b</code></br>
				If one of the arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				If both arguments are integers then the result is an integer,
				otherwise the operation is carried out in floating point
				arithmetics and the result is real. The result of the modulo
				operation is always in the range<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">0 <= a % b < math.abs(b)</code></br>
				</p>
			`,
			"children": []},
			{"id": "power",
			"name": "Power",
			"title": "Power",
			"content": `
				<p>
				The binary <code class="code">operator ^</code> returns its
				left argument to the power of its right arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="#/language/types/integer">Integer</a> nor a
				<a href="#/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				If both arguments are integers and the right-hand-side is non-negative,
				then the operation is performed with integer arithmetics. All other
				cases are treated as reals. This means that only in the first case the
				result is an integer. The corresponding overflow rules apply.
				</p>
				<p>
				This behavior may not always be desired. The function
				<a href="#/library/math">math.pow</a> performs the same operation, but it always
				applies floating point arithmetics.
				</p>
			`,
			"children": []},
			{"id": "equality",
			"name": "Comparison for Equality",
			"title": "Comparison for Equality",
			"content": `
				<p>
				Two values can be compared for equality with
				<code class="code">operator ==</code>. Given two arbitrary values, the
				operator returns a <a href="#/language/types/boolean">Boolean</a>.
				Equivalently, <code class="code">operator !=</code> checks for inequality.
				<code class="code">a != b</code> is equivalent to
				<code class="code">not a == b</code>.
				</p>

				<h2>Definition of Value Equality</h2>
				<p>
				The definition of value equality depends on the type. For built-in atomic
				types like boolean, integers, reals and strings, two values are equal if
				they are of the same type and they hold the same boolean, number or string.
				In particular the integer <code class="code">2</code> and the real number
				<code class="code">2.0</code> compare equal, but they differ from the
				string <code class="code">"2"</code>.
				</p>
				<p>
				Containers are considered equal if they are of the same type and all of
				their keys and items are equal. Care must be taken to avoid recursive
				references, see below.
				</p>
				<p>
				Ranges are equal if begin and end are equal numbers. Types compare equal
				only if they represent the same built-in type or class. Functions compare
				equal if calling them invokes the same TScript code. For methods, the
				object must agree in addition, and for closures, all enclosed parameters
				must compare equal.
				</p>
				<p>
				There is currently no meaningful way to compare objects, even within the
				same class. Therefore all objects are considered different, and the check
				for equality coincides with the check for identity performed by the
				standard library function <a href="">same</a>. Classes that inherit the
				built-in types are compares like these, while their attributes are
				ignored.
				</p>

				<h2>A Note on Infinite Recursion</h2>
				<p>
				Warning: Comparing recursively defined containers results in an infinite
				recursion of the comparison! See the following example:
				<tscript>
					var a = [];
					var b = [a];
					a.push(b);         # now a refers to b and b refers to a
					# print(a == b);   # error due to infinite recursion
				</tscript>
				</p>
			`,
			"children": []},
			{"id": "order",
			"name": "Comparison for Order",
			"title": "Comparison for Order",
			"content": `
				<p>
				Two values can be compared for order with
				<code class="code">operator &lt;</code>. Given two arbitrary values, the
				operator returns a <a href="#/language/types/boolean">Boolean</a> if the
				values can be ordered. Otherwise it reports an error.
				Equivalently, <code class="code">operator &lt;=</code>,
				<code class="code">operator &gt;</code>, and
				<code class="code">operator &gt;=</code> can be used to compare for order,
				with the following identity:
				<code class="code">a &lt; b</code> is equivalent to
				<code class="code">not b &lt;= a</code>,
				<code class="code">b &gt; a</code>, and
				<code class="code">not a &gt;= b</code>.
				</p>

				<h2>Definition of Order and Applicability</h2>
				<p>
				The definition of value order depends on the type. Booleans cannot be
				ordered. Numbers (integers and reals) are ordered in the usual way.
				Strings and arrays are ordered
				<a target="_blank" href="https://en.wikipedia.org/wiki/Lexicographical_order">lexicographically</a>.
				Dictionaries, functions, ranges, types, and classes cannot be ordered.
				</p>

				<h2>A Note on Infinite Recursion</h2>
				<p>
				Warning: Comparing recursively defined arrays results in an infinite
				recursion of the comparison! See the following example:
				<tscript>
					var a = [];
					var b = [a];
					a.push(b);          # now a refers to b and b refers to a
					# print(a &lt; b);  # error due to infinite recursion
				</tscript>
				</p>
			`,
			"children": []},
			{"id": "and",
			"name": "Conjunction",
			"title": "Conjunction",
			"content": `
				<p>
				The binary <code class="code">operator and</code> returns the
				logical or bitwise conjunction of its arguments. Both arguments
				must be <a href="#/language/types/boolean">Boolean</a>s or
				<a href="#/language/types/integer">Integer</a>s, otherwise
				the operator reports an error. The result is defined as follows:
				<table class="nicetable">
					<tr><th>or</th><th>false</th><th>true</th></tr>
					<tr><th>false</th><td>false</td><td>false</td></tr>
					<tr><th>true</th><td>false</td><td>true</td></tr>
				</table>
				It applies to all 32 bits of an integer accordingly.
				</p>
			`,
			"children": []},
			{"id": "or",
			"name": "Disjunction",
			"title": "Disjunction",
			"content": `
				<p>
				The binary <code class="code">operator or</code> returns the
				(non-exclusive) logical or bitwise disjunction of its arguments.
				Both arguments must be
				<a href="#/language/types/boolean">Boolean</a>s or
				<a href="#/language/types/integer">Integer</a>s, otherwise
				the operator reports an error. The result is defined as follows:
				<table class="nicetable">
					<tr><th>or</th><th>false</th><th>true</th></tr>
					<tr><th>false</th><td>false</td><td>true</td></tr>
					<tr><th>true</th><td>true</td><td>true</td></tr>
				</table>
				It applies to all 32 bits of an integer accordingly.
				</p>
			`,
			"children": []},
			{"id": "xor",
			"name": "Exclusive Disjunction",
			"title": "Exclusive Disjunction",
			"content": `
				<p>
				The binary <code class="code">operator xor</code> returns the
				exclusive logical or bitwise disjunction of its arguments. Both
				arguments must be <a href="#/language/types/boolean">Boolean</a>s
				or <a href="#/language/types/integer">Integer</a>s, otherwise
				the operator reports an error. The result is defined as follows:
				<table class="nicetable">
					<tr><th>xor</th><th>false</th><th>true</th></tr>
					<tr><th>false</th><td>false</td><td>true</td></tr>
					<tr><th>true</th><td>true</td><td>false</td></tr>
				</table>
				It applies to all 32 bits of an integer accordingly.
				</p>
				<p>
				Note: For booleans, the operator is equivalent to
				<code class="code">operator !=</code>.
				</p>
			`,
			"children": []},
			{"id": "range",
			"name": "Range Operator",
			"title": "Range Operator",
			"content": `
				<p>
				The binary <code class="code">operator :</code> constructs a
				<a href="#/language/types/range">Range</a> from its arguments.
				Both arguments must be integers, or reals with equivalent values,
				otherwise the operator reports an error. The left-hand-side becomes
				the begin of the range, the right-hand-side becomes the end.
				Applying the operator is equivalent to passing the arguments to
				the <a href="#/language/types/range">Range</a> constructor.
				</p>
			`,
			"children": []},
		]},
		{"id": "function-calls",
		"name": "Function Calls",
		"title": "Function Calls",
		"content": `
			<h2>Syntax</h2>
			<p>
			A function call is an expression with the following syntax:
			<ebnf>
				function-call = expression "(" argument { "," argument } ")" ";" ;
				argument = [ identifier "=" ] expression ;
			</ebnf>
			The first expression must resolve to a callable object, hereafter
			referred to as the function for short, which is a
			<a href="#/language/declarations/functions">function</a> or
			<a href="#/language/declarations/classes">method</a> declaration,
			a <a href="#/language/types">type</a>, or an
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>.
			The arguments must match the function's parameters.
			</p>

			<h2>Control Flow</h2>
			<p>
			The effect of the call is that a new stack frame is created with
			one local variable per parameter. These parameter variables are
			initialized to the values of the arguments. Then the control flow
			continues at the beginning of the function body. After the function
			returns, either by means of an explicit
			<a href="#/language/statements/return">return</a> statement or when
			reaching the end of its body, the return value becomes the value
			of the function call expression, the stack frame is removed, and
			the program continues in the original frame.
			</p>

			<h2>Positional and Named Arguments</h2>
			<p>
			In simple cases there is exactly one argument for each parameter
			of the function. The matting between arguments are parameters is
			determined by their order. Such arguments are called <i>positional</i>
			arguments.
			</p>
			<p>
			If a parameter of a function specifies a default value then the
			corresponding argument can be dropped. A neat way of providing
			values only for some parameters is to use <i>named</i> arguments,
			i.e., arguments with <ebnf>identifier "="</ebnf>
			present. Named arguments must not be followed by positional arguments,
			since that would be extremely confusing and error-prone. Also
			arguments without default values can be specified by name, although
			this is not required.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function f(a, b=0, c=0) { print(a+b+c); }
					f(3, 4, 5);        # a=3, b=4, c=5
					f(3);              # a=3, b=0, c=0
					f(3, c=5);         # a=3, b=0, c=5
					f(a=3, c=5);       # a=3, b=0, c=5
					f(a=3, b=4, c=5);  # a=3, b=4, c=5
					# f(3, b=4, 5);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "item-access",
		"name": "Item Access",
		"title": "Item Access",
		"content": `
			<p>
			An item access is an expression with the following syntax:
			<ebnf>
				item-access = expression "[" expression "]" ";" ;
			</ebnf>
			The first (base) expression must resolve to a
			<a href="#/language/types/string">string</a>,
			<a href="#/language/types/array">array</a>,
			<a href="#/language/types/dictionary">dictionary</a>, or
			<a href="#/language/types/range">range</a>.
			The second (index) expression must resolve to a valid
			index or key, the type of which depends on the former one.
			</p>
			<p>
			The result of an item access depends on the base type and
			on the key type as follows:
			<ul>
			<li>A string indexed with an integer returns the Unicode
			code point of the character at the given (zero-based)
			position.</li>
			<li>A string indexed with a range returns the corresponding
			substring.</li>
			<li>An array indexed with an integer returns the item at
			the given (zero-based) position.</li>
			<li>An array indexed with a range returns the sub-array
			of items indexed by the range.</li>
			<li>A dictionary indexed with a string returns the value
			associated with the corresponding key.</li>
			<li>A range behaves exactly like an array holding the
			values represented by the range as consecutive values,
			however, when indexed with a range it returns another
			range.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "member-access",
		"name": "Member Access",
		"title": "Member Access",
		"content": `
			<p>
			A member access is an expression with the following syntax:
			<ebnf>
				member-access = expression "." identifier ;
			</ebnf>
			The expression evaluates to a public member of the object to
			which the <ebnf>expression</ebnf> evaluates. If the expression
			does not have a member with the name given by the
			<ebnf>identifier</ebnf> then an error is reported. If the
			expression evaluates to a type, then this syntax accesses its
			static public members.
			</p>
			<p>
			The member access operator cannot be used to access private
			and protected members. This does not even work inside of a
			class. These members can be accessed by name (with the
			<ebnf>identifier</ebnf> alone), or with
			<a href="#/language/declarations/classes">super</a>.
			</p>
		`,
		"children": []},
		{"id": "names",
		"name": "Names and Name Lookup",
		"title": "Names and Name Lookup",
		"content": `
			<p>
			A name has the syntax
			<ebnf>
				name = ("super" "." identifier) | (identifier {"." identifier})
			</ebnf>
			where all but the last <ebnf>identifier</ebnf> must refer to
			a <a href="#/language/declarations/namespaces">namespace</a>.
			The keyword <keyword>super</keyword> refers to the super class
			of the enclosing
			<a href="#/language/declarations/classes">class</a>, hence
			it can be used only inside of a class declaration.
			The declaration a name refers to is determined by the name
			lookup rules found below.
			</p>

			<h2>Scopes and Visibility of Names</h2>
			<p>
			TScript imposes strict rules on the visibility of declarations
			based on scopes.
			In TScript, every block enclosed in curly braces is a scope.
			Scopes can apparently be nested, as in the following example,
			which contains five scopes: the global scope, a class, a
			function, and two blocks.
			<tscript>
				var a;
				{
					var x;
					class Cl
					{
					public:
						function m()
						{
							x = 99;
							# y = 99;  # error: y is not yet defined
						}
					}
					var y;
					{
						# z = 1;   # error: z is not yet defined
						var z;
						z = 2;
					}
					a = 42;
					x = 42;
					y = 42;
					# z = 42;      # error: cannot access z from here
				}
			</tscript>
			Names of variables, functions, classes and namespaces declared
			within a scope are only visible from within that scope, and from
			within sub-scopes. They are neither visible before they are declared,
			nor after their enclosing scope ends. This makes it possible to have
			multiple declarations of the same name, as along as they are found in
			different scopes. The name always refers to the declaration in the
			innermost scope:
			<tscript>
				var a = 1;
				{
					print(a);   # prints 1
					var a = 2;
					{
						print(a);       # prints 2
						var a = 3;
						print(a);       # prints 3
						# var a = 4;    # error; the name 'a' is already
						                # defined in this scope
					}
					print(a);   # prints 2
				}
				print(a);   # prints 1
			</tscript>
			This means that declarations of the same name mask each other, but
			they do not result in errors.
			</p>

			<h2>Namespaces</h2>
			<p>
			Declarations defined inside a namespace are accessed with the dot
			operator:
			<tscript>
			namespace N {
				var a;
				function say() { print("a = " + a); }
			}
			# a = 7;     # the enclosing scope of 'a' is not visible
			# say();     # the enclosing scope of 'say' is not visible
			N.a = 7;     # works as desired
			N.say();     # works as desired
			</tscript>
			This works because the <code class="code">namespace N</code> is visible
			from the perspective of the statement. Its members
			<code class="code">a</code> and <code class="code">say</code> are not directly visible,
			however, they can be accessed as members of <code class="code">N</code>.
			</p>
			<p>
			When accessing members of a namespace many times it can be
			convenient to make names from a namespace directly available in the
			current scope:
			<tscript>
			namespace N {
				var a;
				function say() { print("a = " + a); }
			}
			use namespace N;   # make all names from N visible
			a = 7;       # now this works!
			say();       # now this works!
			N.a = 7;     # this also still works
			N.say();     # this also still works
			</tscript>
			Names can even be imported into classes. Then variables and functions
			defined in the namespace can be accessed like static members of the
			class.
			</p>

			<h2>Names in Classes and Super Classes</h2>
			<p>
			The above rules also apply within classes. In particular, names must
			be declared before they are used. This implies that in TScript
			attributes are usually declared first to make them accessible for
			methods:
			<tscript>
			class A
			{
			private:
				var x;
			public:
				function f()
				{
					print(x);
					# print(y);   # error; y was not declared yet
				}
			private:
				var y;
			}
			</tscript>
			</p>
			<p>
			Inside a class it is possible to access the public and protected
			members of all super classes, although they are declared in unrelated
			scopes:
			<tscript>
			class A
			{
			protected:
				var m, n;
			}
			class B : A   # B inherits A, and therefore its members m and n
			{
			public:
				var n;
				function set(value)
				{
					m = value;         # access to m works
					n = value;         # sets B.n
					super.n = value;   # sets A.n
				}
			}
			</tscript>
			</p>

			<h2>Name Lookup</h2>
			<p>
			When TScript encounters a name, then it proceeds as follows.
			It checks all scopes for a declaration with the given name,
			starting from the innermost scope and moving towards enclosing
			scopes until the global scope is processed. For each scope, it
			does the following:
			<ul>
				<li>If the name is defined inside of the scope and before
					its use, then the lookup is successful.</li>
				<li>If the name is imported from a namespace into the scope
					before its use, then the lookup is successful.</li>
				<li>If the scope is a class, then loop through the chain of
					super classes, starting at the current class. If the
					name is defined in a class, or if it is imported from a
					namespace, then the name lookup is successful.</li>
			</ul>
			</p>
			<p>
			These rules imply that some names refer to objects that are not
			accessible, like in the following example:
			<tscript>
			function f()
			{
				var x = 7;
				function g()
				{
					# return x + 1;   # error!
				}
				return g;
			}
			var h = f();
			print(h);     # prints &lt;Function g&gt;
			print(h());
			</tscript>
			The problem is that when g is called under the name h in the last
			line, then x has already gone out of scope. This can be avoided
			by turning g into a closure:
			<tscript>
			function f()
			{
				var x = 7;
				return function [x] ()
				{
					return x + 1;   # works
				};
			}
			var h = f();
			print(h);     # prints &lt;Function anonymous 4:11&gt;
			print(h());   # prints 8
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "precedence",
		"name": "Precedence of Operations",
		"title": "Precedence of Operations",
		"content": `
			<h2>Order of Evaluation of Expressions and Operators</h2>
			<p>
			Different operators have different precedence, i.e., binding
			strength. In the following example, the order of operations
			depends on the binding strength of the operators:
			</p>
			<tscript>
				var x = [2, 3, 5, 7];
				var i = 4 - 1 * 2;
				var a = -2^x[i];
			</tscript>
			<p>
			In the second line the usual mathematical convention that multiplication
			is computed before addition is expected. This is realized in TScript by
			giving <code class="code">operator&nbsp;*</code> a higher precedence
			(binding strength) than <code class="code">operator&nbsp;+</code>.
			Though, a higher precedence is traditionally expressed by a lower number,
			see the table below.
			</p>
			<p>
			Similarly, the minus sign in the last statement is applied to the
			power, not only to its base, since the exponentiation
			<code class="code">operator&nbsp;^</code> binds stronger than the arithmetic negation
			<code class="code">operator&nbsp;-</code>.
			</p>
			<p>
			Also for operators of the equal precedence the evaluation order can matter
			for the result, as in <code class="code">7 - 4 - 3</code>. Furthermore,
			expressions can have side-effects, the order of which depends on the
			evaluation order. In TScript, the evaluation order is always well-defined.
			Operators of the same precedence and the expressions in between are
			evaluated either left-to-right or right-to-left.
			</p>

			<h2>Precedence and Evaluation Order Rules</h2>
			<p>
			The precedence rules are summarized in the following table.
			</p>
			<table class="nicetable">
				<tr><th>precedence</th><th>operator type</th><th>operators</th><th>evaluation order</th></tr>
				<tr><td>0</td><td>right&nbsp;unary</td><td><code class="code">[]</code> <code class="code">.</code></td><td>left-to-right</td></tr>
				<tr><td>0</td><td>right&nbsp;n-ary</td><td><code class="code">()</code></td><td>left-to-right</td></tr>
				<tr><td>1</td><td>binary</td><td><code class="code">^</code></td><td>left-to-right</td></tr>
				<tr><td>2</td><td>left&nbsp;unary</td><td><code class="code">+</code> <code class="code">-</code></td><td>right-to-left</td></tr>
				<tr><td>3</td><td>binary</td><td><code class="code">*</code> <code class="code">/</code> <code class="code">\/\/</code> <code class="code">%</code></td><td>left-to-right</td></tr>
				<tr><td>4</td><td>binary</td><td><code class="code">+</code> <code class="code">-</code></td><td>left-to-right</td></tr>
				<tr><td>5</td><td>binary</td><td><code class="code">:</code></td><td>left-to-right</td></tr>
				<tr><td>6</td><td>binary</td><td><code class="code">==</code> <code class="code">!=</code> <code class="code">&lt;</code> <code class="code">&lt;=</code> <code class="code">&gt;</code> <code class="code">&gt;=</code></td><td>left-to-right</td></tr>
				<tr><td>7</td><td>left&nbsp;unary</td><td><code class="code">not</code></td><td>right-to-left</td></tr>
				<tr><td>8</td><td>binary</td><td><code class="code">and</code></td><td>left-to-right</td></tr>
				<tr><td>9</td><td>binary</td><td><code class="code">or</code> <code class="code">xor</code></td><td>left-to-right</td></tr>
				<tr><td>10</td><td>assignment</td><td><code class="code">=</code> <code class="code">+=</code> <code class="code">-=</code> <code class="code">*=</code> <code class="code">/=</code> <code class="code">\/\/=</code> <code class="code">%=</code> <code class="code">^=</code></td><td>right-to-left</td></tr>
			</table>

			<h2>Parentheses</h2>
			<p>
			Every part of an expression can be enclosed in parentheses, which
			bind stronger than all operators. The most common reason is to
			override operator precedence, as in the following example:
			<tscript>
				var a = 2;
				var b = (3 + a) * 6;
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "constants",
		"name": "Constants",
		"title": "Constants",
		"content": `
			<p>
			Constants are expressions that do not depend on the values
			of variables. Their main uses are as immediate values within
			expressions and as initializers of attributes. A further use
			is as default values of function parameters.
			</p>
			<p>
			All <a href="#/language/expressions/literals">literals</a> of
			non-container types are constants. This includes all
			<a href="#/concepts/design">JSON</a> types, but also
			functions (excluding non-static methods). Array and dictionary
			literals are constants if all of their items are constants:
			<tscript>
				var c1 = null;                  # constant
				var c2 = true;                  # constant
				var c3 = 42;                    # constant
				var c4 = 8.57e-7;               # constant
				var c5 = "hello";               # constant
				var c6 = print;                 # constant
				var c7 = [true, 42];            # constant
				var c8 = {"a": true, "b": 42};  # constant
				var n = [c2, c3];               # not a constant
			</tscript>
			The last expression is not a constant since c2 and c3 are
			variables.
			</p>
			<p>
			Other expressions are de-facto constants, in particular the
			return values of functions without side-effects with constant
			parameters, e.g.,
			<tscript>
				var n = math.sqrt(2);           # not a constant
			</tscript>
			The above expression is not considered a constant in TScript,
			since it is evaluated at runtime. The core language does not
			have any knowledge about which functions have side effects
			and which ones do not.
			</p>
		`,
		"children": []},
	]},
	{"id": "statements",
	"name": "Statements",
	"title": "Statements",
	"content": `
		<p>
		Statements are instructions that change the state of the
		program. For example, they can modify a variable or change the
		program flow. Besides assignments and constructs like
		conditionals and loops, also simple expressions are considered
		statements since they can have side effects, e.g., by calling
		<code class="code">print</code> or <code class="code">wait</code>.
		Statements are formally defined as follows:
		<ebnf>
			statement = block
			          | assignment
			          | expression ";"
			          | condition
			          | for-loop
			          | while-do-loop
			          | do-while-loop
			          | break
			          | continue
			          | return
			          | throw
			          | try-catch
		</ebnf>
		</p>
	`,
	"children": [
		{"id": "blocks",
		"name": "Blocks of Statements",
		"title": "Blocks of Statements",
		"content": `
			<p>
			A block of statements has the following syntax:
			<ebnf>
				block = "{" { declaration | statement | directive } "}" ;
			</ebnf>
			The whole block can take the role of a single statement,
			allowing to execute multiple statements where a single one
			is specified by the formal syntax, i.e., in conditions,
			loops, and try/catch-blocks. Furthermore, beyond multiple
			statements, a block can contain declarations and directives.
			</p>
			<p>
			At the same time, the block acts as a scope, so the usual
			<a href="#/language/expressions/names">name lookup</a> rules
			apply. This means that declarations made inside the block
			become invalid as soon as the block is left. Of course,
			functions declared inside the block can be returned or
			assigned to variables declared outside the block, and the
			same holds for objects of locally declared classes.
			</p>
		`,
		"children": []},
		{"id": "assignments",
		"name": "Assignments",
		"title": "Assignments",
		"content": `
			<p>
			Assignments have the following form:
			<ebnf>
				assignment = lhs assign-op expression ";" ;
				  lhs = name
				        | expression "[" expression "]"
				        | expression "." identifier ;
				  assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
			</ebnf>
			The expression <ebnf>lhs</ebnf> on the left-hand-side (lhs) of the
			assignment must refer to a variable. It must not refer to a function
			or to a constant.
			</p>
			<p>
			Assignments are evaluated from right to left: the <ebnf>expression</ebnf>
			on the right-hand-side (rhs) is evaluated before the <ebnf>lhs</ebnf>. The
			effect of an assignment with <code class="code">operator =</code> is
			that the variable referenced by the <ebnf>lhs</ebnf> is overwritten
			with the result of the <ebnf>expression</ebnf>. In other words, after
			the assignment the variable references the value to which the rhs
			evaluates. Note that an assignment does not copy the value represented by
			the rhs, it only makes the lhs reference the same value, as can be seen in
			the following example:
			<tscript>
				var a = [2, 3, 5, 7];
				var b = a;
				a[2] = 97;
				print(b);   # prints [2,3,97,7]
			</tscript>
			</p>
			<p>
			The assignment operators <code class="code">+= -= *= /= %= ^=</code> are
			called compound assignment operators. The statement
			<code class="code">a += 3;</code> is equivalent to
			<code class="code">a = a + 3;</code>, and the same applies to the other
			binary arithmetic <a href="#/language/expressions/binary-operators">operators</a>.
			However, this equivalence is not exact in general, since with compound
			assignment the lhs expression is evaluated only once. This difference
			is demonstrated in the following example:
			<tscript>
				var counter = 0;
				var a = [0, 0];
				function get()
				{
					counter += 1;
					return a;
				}
				get()[0] += 7;
				print(a);                # prints [7, 0]
				print(counter);          # prints 1
				get()[1] = get()[1] + 7;
				print(a);                # prints [7, 7]
				print(counter);          # prints 3
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "expressions",
		"name": "Expressions",
		"title": "Expressions",
		"content": `
			<p>
			An expression followed by a semicolon is a valid statement.
			For many expressions this is rather pointless:
			<tscript>
				"hello world";
				math.sqrt(81) == 9;
			</tscript>
			An expression makes sense as a standalone statement if it has
			side-effects. Primary examples are calls to standard library
			functions:
			<tscript>
				print("hello world");
				assert(math.sqrt(81) == 9);
			</tscript>
			Of course, a function call can result in an arbitrary sequence
			of commands being executed inside the function body and further
			functions called from there, and therefore the side effects can
			become arbitrarily complex.
			</p>
		`,
		"children": []},
		{"id": "if-then-else",
		"name": "Conditions with if then else",
		"title": "Conditions with if then else",
		"content": `
			<p>
			A conditional control structure is denoted as follows:
			<ebnf>
			condition = "if" expression "then" statement
			                          [ "else" statement ] ;
			</ebnf>
			The <ebnf>expression</ebnf> must evaluate to a
			<a href="#/language/types/boolean">Boolean</a>, otherwise an error
			is reported.
			If the <ebnf>expression</ebnf> evaluates to <keyword>true</keyword>
			then the <ebnf>statement</ebnf> following <keyword>then</keyword>
			is executed, otherwise the <ebnf>statement</ebnf> following
			<keyword>else</keyword> is executed, if present. It is common that
			the statements are <a href="#/language/statements/blocks">blocks</a>.
			</p>
		`,
		"children": []},
		{"id": "for-loops",
		"name": "For-Loops",
		"title": "For-Loops",
		"content": `
			<p>
			A for-loop has the following syntax:
			<ebnf>
			for-loop = "for" [ loop-var "in" ] expression "do" statement ;
			  loop-var = ("var" identifier) | name ;
			</ebnf>
			The <ebnf>expression</ebnf> must evaluate to a
			<a href="#/language/types/range">Range</a> or an
			<a href="#/language/types/array">Array</a>, otherwise an error is
			reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# print 9, 16, 25, 36, 49 in five lines
					for var i in 3:8 do print(i*i);

					# print "hello" and "world" in two lines
					for var i in ["hello", "world"] do print(i);
				</tscript>
			</div>
			<p>
			The for-loop executes the <ebnf>statement</ebnf> exactly once for
			each value in the range or array. This value is assigned to the loop
			variable. An already declared variable can be used as the loop
			variable, which is referenced by the given <ebnf>name</ebnf>, so it
			can even be declared in another namespace.
			Alternatively, a new variable can declared with the
			<ebnf>"var" identifier</ebnf> syntax. This variable belongs to the
			loop, which acts as its scope, hence its name does not collide with
			other declarations outside the loop, and the variable goes out of
			scope after the last loop iteration. It is common to execute
			multiple statements in each loop iteration by using a
			<a href="#/language/statements/blocks">block</a>.
			</p>

			<h2>Repeated Execution</h2>
			<p>
			Looping over a range is the idiomatic way to execute code a number
			of times in a row. The loop counter provides an easy way to
			parameterize the repeated code:
			<tscript>
				for var i in 0:10 do print(10-i + "...");
				print("now!");
			</tscript>
			In simple contexts the loop variable is not needed. Consequently,
			it can be dropped:
			<tscript>
				for 0:10 do print("wait...");
				print("now!");
			</tscript>
			</p>

			<h2>Looping over Containers</h2>
			<p>
			Looping over an array works directly with a for-loop. For a
			dictionary it is not clear whether the loop variable shall hold
			keys, values, or both. Therefore an explicit decision must be
			made by the programmer, using the Dictionary methods
			<a href="#/language/types/dictionary">keys</a> or
			<a href="#/language/types/dictionary">values</a>, as shown in
			the following example:
			<tscript>
				var dict = {a: 3, b: 10, c: null};
				for var i in dict.keys() do print(i + ": " + dict[i]);
				for var i in dict.values() do print(i);
			</tscript>
			Since arrays also have keys and values() methods, this technique can
			loop over containers (arrays and dictionaries) in a generic fashion:
			<tscript>
				var arr = [3, 10, null];
				var dict = {a: 3, b: 10, c: null};

				function printContainer(container)
				{
					print(Type(container));
					for var i in container.keys() do
					{
						print(i + ": " + container[i]);
					}
				}

				printContainer(arr);
				printContainer(dict);
			</tscript>
			</p>

			<h2>Modifying the Container in the Loop</h2>
			<p>
			It is safe to modify the object iterated over during execution of the loop.
			The loop is entirely unaffected by such modification because it iterates
			over a copy of the object. For example, the following is not an infinite loop:
			</p>
			<tscript>
				var arr = ["foo"];
				for var i in arr do arr.push(i);
				print(arr);   # prints [foo,foo]
			</tscript>

			<h2>Changing the Control Flow</h2>
			<p>
			Equally well, modifying the loop variable does not have an effect on the
			control flow, because in the next iteration the variable is assigned the
			next value from the container:
			<tscript>
				for var i in 0:10 do
				{
					if i == 3 then i = 7;   # attempt to skip 3,4,5,6 fails
					print(i);   # prints 0, 1, 2, <span style="color:red">7</span>, 4, 5, 6, 7, 8, 9
				}
			</tscript>
			</p>
			<p>
			Sometimes it is necessary to change the control flow during execution
			of the loop. We have seen that modifying the loop variable and the
			loop object does not achieve this effect. Instead, the following two
			operations work.
			The loop a a whole can be aborted with <a href="#/language/statements/break-continue">break</a>.
			The current iteration can be aborted with <a href="#/language/statements/break-continue">continue</a>.
			It is not possible to extend a for loop during execution. If this is
			a requirement then a
			<a href="#/language/statements/while-do-loops">while-do-loop</a>
			can be used.
			</p>
		`,
		"children": []},
		{"id": "while-do-loops",
		"name": "While-Do-Loops",
		"title": "While-Do-Loops",
		"content": `
			<p>
			The while-do-loop syntax is as follows:
			<ebnf>
				while-do-loop = "while" expression "do" statement ;
			</ebnf>
			The loop evaluates the <ebnf>expression</ebnf>. If it does not result in
			a <a href="#/language/types/boolean">Boolean</a>, then an error is emitted.
			If the expression evaluates to <keyword>false</keyword> then the loop is
			finished. However, if it evaluates to <keyword>true</keyword> then the
			<ebnf>statement</ebnf> is executed and the loop starts over by re-evaluating
			the expression. This scheme corresponds to a pre-checked loop, i.e., a loop
			that checks the condition <i>before</i> executing the statement.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# find a zero of a function with Newton's method
					function f(x)
					{ return x^5 - 7 * x^3 + 2 * x^2 + x + 4.2; }
					function df(x)
					{ return 5 * x^4 - 21 * x^2 + 4 * x + 1; }

					var x = 0.0;
					while math.abs(f(x)) > 1e-5 do
					{
						var step = f(x) / df(x);
						x -= step;
					}
					print("The zero of f is close to x=" + x);
					print("The function value at x is f(x)=" + f(x));
				</tscript>
			</div>
			<p>
			It is easy to create an infinite while-do loop:
			<pre class="code"><code class="code">while true do { }</code></pre>
			The construction can actually be useful if the loop is aborted with a
			<keyword>break</keyword> statement.
			</p>
		`,
		"children": []},
		{"id": "do-while-loops",
		"name": "Do-While-Loops",
		"title": "Do-While-Loops",
		"content": `
			<p>
			The do-while-loop syntax is as follows:
			<ebnf>
				do-while-loop = "do" statement "while" expression ";" ;
			</ebnf>
			The loop executes the <ebnf>statement</ebnf>. Then it evaluates the
			<ebnf>expression</ebnf>. If it does not result in a
			<a href="#/language/types/boolean">Boolean</a>, then an error is emitted.
			If the expression evaluates to <keyword>false</keyword> then the loop is
			finished. However, if it evaluates to <keyword>true</keyword> then the
			loop starts over. This scheme corresponds to a post-checked loop, i.e., a
			loop that checks the condition <i>after</i> executing the statement.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# find a zero of a function with Newton's method
					function f(x)
					{ return x^5 - 7 * x^3 + 2 * x^2 + x + 4.2; }
					function df(x)
					{ return 5 * x^4 - 21 * x^2 + 4 * x + 1; }

					var x = 0.0;
					do
					{
						var step = f(x) / df(x);
						x -= step;
					}
					while math.abs(f(x)) > 1e-5;
					print("The zero of f is close to x=" + x);
					print("The function value at x is f(x)=" + f(x));
				</tscript>
			</div>
			<p>
			It is easy to create an infinite while loop:
			<pre class="code"><code class="code">do { } while true;</code></pre>
			The construction can actually be useful if the loop is aborted with a
			<keyword>break</keyword> statement.
			</p>
		`,
		"children": []},
		{"id": "break-continue",
		"name": "Break and Continue",
		"title": "Break and Continue",
		"content": `
			<p>
			The <keyword>break</keyword> and <keyword>continue</keyword> statements
			change the control flow of the current innermost loop within the current
			function. The break statement exits the loop. The continue statement
			skips the remainder of a loop iteration. Their syntax is trivial:
			<ebnf>
				break = "break" ";" ;
				continue = "continue" ";" ;
			</ebnf>
			After a continue statement, the loop jumps to its check of the stopping
			criterion. If it does not stop then it continues with the next loop
			iteration, otherwise with the next statement following the loop body.
			Break and continue statements outside of a loop body result in an error
			message.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# find all primes below some number
					var N = 100;                  # look for primes up to this point
					var primes = [];
					for var i in 2:N do
					{
						# check whether i is prime by finding a factor
						var factor = null;
						for var p in primes do
						{
							if p * p > i then break;  # don't check too large primes
							if i % p == 0 then
							{
								# found a factor
								factor = p;
								break;                # don't check further factors
							}
						}
						if factor != null then continue;  # skip non-primes
						print(i + " is prime");
						primes.push(i);
					}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "return",
		"name": "Return",
		"title": "Return",
		"content": `
			<p>
			The return statement immediately returns from a function.
			Its syntax is as follows:
			<ebnf>
				return = "return" [ expression ] ";" ;
			</ebnf>
			If the optional <ebnf>expression</ebnf> is not present, then
			<keyword>null</keyword> is used as the default value.
			</p>
			<p>
			The return statement first evaluates the expression, known as the
			return value, then leaves the current function, and returns the
			value to the caller. In other words, the function call expression
			in the calling context evaluates to the return value.
			</p>
			<p>
			When executed at global scope, the return statement terminates the
			program. A constructor as well as the global scope do not return a
			value. Therefore, in these contexts, a return statement must not
			contain a return value.
			</p>
		`,
		"children": []},
		{"id": "throw",
		"name": "Throw",
		"title": "Throw",
		"content": `
			<h2>Syntax and Effect</h2>
			<p>
			An exception is thrown with the following syntax:
			<ebnf>
				throw = "throw" expression ";" ;
			</ebnf>
			The result of evaluating the <ebnf>expression</ebnf> is called
			an exception.
			The effect of throwing an exception is that execution continues
			in the <keyword>catch</keyword>-part of the closest enclosing 
			<keyword>try</keyword>-<keyword>catch</keyword> block.
			The search for the closest enclosing <keyword>try</keyword> block
			works as follows. The current scope is left until a
			<keyword>try</keyword> block, global scope, or a function scope
			is found. In case of a <keyword>try</keyword> block the search
			is successful, and the exception is assigned to the variable
			declared in the <keyword>catch</keyword> block. Otherwise the
			runtime system leaves the current function and continues the
			search in the calling function. If no <keyword>try</keyword>-block
			is found before global scope is encountered, then the program
			terminates with an error message, which contains a string
			representation of the exception.
			</p>

			<h2>Error Handling</h2>
			<p>
			Exceptions are regularly used for error reporting across possibly
			deeply nested function calls. The role of the exception is to
			provide a useful description of the error, which can be either
			handled programmatically by the catch block, or reported to the
			user. 
			</p>
			<p>
			Sometimes only certain types of errors should be handled in a
			specific <keyword>catch</keyword> block. In this case the
			exception can be caught, examined, and possibly re-thrown.
			</p>
		`,
		"children": []},
		{"id": "try-catch",
		"name": "Try and Catch",
		"title": "Try and Catch",
		"content": `
			<h2>Syntax</h2>
			<p>
			The syntax of a <keyword>try</keyword>-<keyword>catch</keyword>
			statement is as follows:
			<ebnf>
				try-catch = "try" statement
				            "catch" "var" identifier "do" statement ;
			</ebnf>
			Under normal conditions, the try-catch-block executes only
			the statement following <keyword>try</keyword>. This is nearly
			always a block of statements, also referred to as the try-block.
			</p>
			<p>
			However, if an exception is thrown in the try-block or in any
			function called from this block, then execution continues in
			the statement following <keyword>do</keyword>. This is again
			usually a block of statements, called the catch-block. The value
			passed to the <keyword>throw</keyword> instruction, known as the
			<i>exception</i>, is assigned to the variable declared after
			<keyword>catch</keyword>. Catch blocks are used to react to
			error conditions, which are reported by throwing an
			exception.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var sum = 0;
				try
				{
					# this sum is doomed to fail
					var numbers = [3.2, 5.6, 0.0, 8.0, 2.4];
					for var i in numbers do
					{
						for var j in numbers do
						{
							if (i == 0) then throw "division by zero";
							else sum += j / i;
						}
					}
					print(sum);
				}
				catch var ex do
				{
					# and here we "handle" the error
					if ex == "division by zero" then
						print("division by zero, partial sum: " + sum);
					else throw ex;
				}
				</tscript>
			</div>
		`,
		"children": []},
	]},
	{"id": "types",
	"name": "The Type System",
	"title": "The Type System",
	"content": `
		<p>
		A type defines a set of values, which are of similar nature.
		They are associated with operations acting on the value, i.e.,
		evaluating or manipulating values. The available data types
		therefore define how information can be represented natively,
		which units of information can be processed atomically, and
		how information can be aggregated.
		</p>
		<p>
		TScript's core type system is rather minimal. It does not aim
		for completeness, but it is extensible. For example, there is
		no built-in type representing a date, but it is easy enough to
		add a class taking that role.
		</p>
		<p>
		Not all types represent typical units of information, like bits,
		numbers, and strings. Two such types are Function and Type. The
		ability to use functions as types enables powerful programming
		techniques. Types as values are used to check for the types of
		variables referenced by variables at runtime.
		</p>
		<p>
		Programmers can extend the type system to new kinds of information
		by writing their own classes. Simple classes like a date class can
		behave similar to atomic types. More complex classes can for
		example act as containers, or represent resources (like files).
		Classes support proper information hiding, which allows the
		programmer to separate implementation details from a public
		interface.
		</p>
		<p>
		TScript does not distinguish between built-in types and classes,
		in the sense that all types are equally capable of taking each role.
		For example, it is perfectly legal to use a built-in type like
		Integer as a super class, which might make sense for a date class.
		However, it is not possible to overload operators. For classes, the
		capabilities of operators must therefore be emulated with functions.
		</p>
	`,
	"children": [
		{"id": "null",
		"name": "Null",
		"title": "The Type <i>Null</i>",
		"content": `
			<p>
			The Null type has only a single value, the
			<a href="#/language/expressions/literals/null">null literal</a>.
			This value is immutable. It does not offer any operations.
			While it is clear that <keyword>null</keyword> cannot represent
			much useful information, is has a twofold role: first of all, it
			acts as a <i>default initializer</i> for all variables, and second,
			it is a canonical <i>marker</i> for an exceptional state, like an
			error condition or marking a process as incomplete. For example, a
			function that is expected to return an integer may use a return
			value of <keyword>null</keyword> to indicate that it was not
			able to complete its task (for whatever reason).
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor()</code> creates a null
				value.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "boolean",
		"name": "Boolean",
		"title": "The Type <i>Boolean</i>",
		"content": `
			<p>
			The type Boolean represents the two logical values, denoted by the
			<a href="#/language/expressions/literals/booleans">literals</a>
			<keyword>true</keyword> and <keyword>false</keyword>. They are
			immutable.
			</p>

			<h2>Operations</h2>
			Booleans offer a number of operations, namely the operators
			<a href="#/language/expressions/unary-operators/not">not</a>,
			<a href="#/language/expressions/binary-operators/and">and</a>,
			<a href="#/language/expressions/binary-operators/or">or</a>, and
			<a href="#/language/expressions/binary-operators/xor">xor</a>.
			They can be compared for equality with the operators
			<code class="code">==</code> and <code class="code">!=</code>
			(and in fact, for Boolean, the operators
			<code class="code">xor</code> and <code class="code">!=</code>
			are equivalent), but they cannot be ordered. Booleans are
			demanded by the language as conditions in
			<a href="#/language/statements/if-then-else">conditionals</a>
			and <a href="#/language/statements/while-do-loops">pre-</a> and
			<a href="#/language/statements/do-while-loops">post-</a>checked
			loops. Furthermore, they are frequently used as flags, and they
			can be used to represent single bits.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(value)</code> creates a copy
				of a boolean value.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "integer",
		"name": "Integer",
		"title": "The Type <i>Integer</i>",
		"content": `
			<p>
			There exist <i>2<sup>32</sup></i> values of type Integer, namely
			the whole numbers in the range <i>-2147483648 = -2<sup>31</sup></i>
			to <i>2147483647 = 2<sup>31</sup>-1</i>. Non-negative integers can be
			represented directly as
			<a href="#/language/expressions/literals/integers">integer literals</a>.
			The values are immutable.
			</p>

			<h2>Operations</h2>
			<p>
			Integers can be combined with a number of unary and binary operators.
			When the result of such an operator is outside the integer range then
			the result <i>underflows</i> or <i>overflows</i>, i.e., wraps around
			the range, which can be understood as representatives of the integers
			modulo <i>2<sup>32</sup></i>. Being aware of this behavior is important
			when dealing with large numbers, in particular since the operations are
			not fully consistent from an algebraic perspective.
			</p>
			<table class="methods">
			<tr><th>unary&nbsp;+</th><td>
				The operator is a no-operation, or more correctly, the identity
				mapping. It returns its argument unmodified. It merely exists for
				symmetry with unary&nbsp;-, e.g., in the following situation:
				<tscript>
					var a = [-1, +1];
				</tscript>
			</td></tr>
			<tr><th>unary&nbsp;-</th><td>
				The operator negates its argument. This operation overflows only
				for the value <i>-2<sup>31</sup> = -2147483648</i>, resulting in
				the exact same value.
			</td></tr>
			<tr><th>unary&nbsp;not</th><td>
				The operator flips all 32 bits of its argument.
			</td></tr>
			<tr><th>binary&nbsp;+</th><td>
				Add the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;-</th><td>
				Subtract the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;*</th><td>
				Multiply the arguments. The result is subject to under- and overflow,
				which is particularly common for this operation. Example:
				<tscript>
					print(65535 * 65537);   # overflows to -1
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;/</th><td>
				Divide the arguments as reals. The arguments are first converted
				to reals, then they are divided as reals, and the result is of
				type Real, even if the remainder of the integer division is zero.
				<tscript>
					print(6 / 3);     # 2
					print(5 / 3);     # 1.6666...
					print(4 / 3);     # 1.3333...
					print(1 / 3);     # 0.3333...
					print(-1 / 3);    # -0.3333...
					print(1 / -3);    # -0.3333...
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;\/\/</th><td>
				Divide the arguments as integers, defined as</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a // b = math.floor(a / b)</code></br>
				Note that <code class="code">a * b = c</code> implies
				<code class="code">c // a = b</code> only if the multiplication
				does not overflow. Division is not well-defined in the modulo
				arithmetic implied by overflow!
				Instead "normal" integer division (without modulo) is assumed.
				The result is rounded down to the closest integer. For example:
				<tscript>
					print(6 // 3);     # 2
					print(5 // 3);     # 1
					print(4 // 3);     # 1
					print(1 // 3);     # 0
					print(-1 // 3);    # -1, since we round down
					print(1 // -3);    # -1 again
					print(-(1 // 3));  # 0
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;%</th><td>
				Remainder of the integer division. The result is defined by
				the following identity:</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a % b = a - (a // b) * b</code></br>
				This ensures that the result is always in the range</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">0 <= a % b < math.abs(b)</code></br>
				For example:
				<tscript>
					print(6 % 3);     # 0
					print(5 % 3);     # 2
					print(4 % 3);     # 1
					print(1 % 3);     # 1
					print(-1 % 3);    # 2, not -1
					print(1 % -3);    # 2 again, since 1//-3 = -1//3
					print(-(1 % 3));  # -1
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;^</th><td>
				The operation <i>n ^ m</i> computes the <i>m</i>-th power of
				<i>n</i>. If <i>m</i> is non-negative then the result is an
				integer, which is subject to the usual under- and overflow rules.
				For negative exponent both arguments are converted to reals
				before applying the same operator for reals. Examples:
				<tscript>
					print(2 ^ 4);       # 16
					print(-2 ^ 4);      # -16
					print((-2) ^ 4);    # 16
					print(2 ^ -2);      # 0.25
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;and</th><td>
				The operator returns the bitwise conjunction applied independently
				to all 32 bits of its arguments.
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;or</th><td>
				The operator returns the bitwise non-exclusive disjunction applied
				independently to all 32 bits of its arguments.
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;xor</th><td>
				The operator returns the bitwise exclusive disjunction applied
				independently to all 32 bits of its arguments.
				</tscript>
			</td></tr>
			</table>
			<p>
			Integers can be
			<a href="#/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="#/language/expressions/binary-operators/order">ordered</a>.
			</p>
			<p>
			Note: bitwise operators have a very low precedence, i.e., a low binding
			strength. Therefore, in a condition like <code class="code">x and 64 == 0</code>
			the comparison operator <code class="code">==</code> is executed
			<i>before</i> the bitwise operator <code class="code">and</code>. This
			is usually intended for logical operators, but not for bitwise operators.
			Therefore bitwise operators should always be used with parentheses:
			<code class="code">(x and 64) == 0</code>.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(value)</code> converts the
				value to an integer. For integers this amounts to copying, reals
				are rounded down, and strings are parsed as decimal numbers.
				The result is subject to integer overflow. Other types as well as
				the special Real values infinity and not-a-number raise an error.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "real",
		"name": "Real",
		"title": "The Type <i>Real</i>",
		"content": `
			<p>
			The type Real represents floating point numbers according to the
			<a target="_blank" href="https://de.wikipedia.org/wiki/IEEE_754">IEEE 754 standard</a>.
			This number format offers an excessive range and a precision of
			about 15-16 decimal digits. Although the precision is more than
			sufficient for most tasks, one should be aware of its limitations
			like rounding errors, which can result in catastrophic cancellation.
			These aspects have been discussed in detail in
			<a target="_blank" href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html">this classic article</a>.
			Positive reals can be represented directly as
			<a href="#/language/expressions/literals/reals">real literals</a>.
			The values are immutable.
			</p>

			<h2>Operations</h2>
			<p>
			Reals can be combined with a number of unary and binary operators.
			When the result of such an operator is outside the floating point range
			then the result <i>underflows</i> (to zero) or <i>overflows</i> (to
			positive or negative infinity). Being aware of this behavior is important
			when dealing with large numbers, in particular since the operations are
			not fully consistent from an algebraic perspective. Computations with
			infinite values easily result in undefined results, which are encoded by
			the special value NaN (not-a-number).
			</p>
			<table class="methods">
			<tr><th>unary&nbsp;+</th><td>
				The unary <code class="code">operator +</code> is a no-operation,
				or more correctly, the identity mapping. It returns its argument
				unmodified. It merely exists for symmetry with unary&nbsp;-, i.e.,
				in the following situation:
				<tscript>
					var a = [-1.0, +1.0];
				</tscript>
			</td></tr>
			<tr><th>unary&nbsp;-</th><td>
				The unary <code class="code">operator -</code> negates its argument.
			</td></tr>
			<tr><th>binary&nbsp;+</th><td>
				Add the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;-</th><td>
				Subtract the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;*</th><td>
				Multiply the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;/</th><td>
				Divide the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;//</th><td>
				Divide the arguments and round the result down to the closest integer.
				Yet, the result is of type Real. This operator is compatible with
				integer division and with the modulo operation defined below.
				For example:
				<tscript>
					print(3.5 // 1.5);      # 2
					print(-3.5 // 1.5);     # -3
					print(-(3.5 // 1.5));   # -2
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;%</th><td>
				Remainder of the division, pretending that the quotient had been
				rounded down to the nearest integer. The result is defined as</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a % b = a - b * (a // b)</code></br>
				(for positive denominator, otherwise the result is negated).
				For example:
				<tscript>
					print(3.5 % 1.5);      # 0.5
					print(-3.5 % 1.5);     # 1
					print(-(3.5 % 1.5));   # -0.5
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;^</th><td>
				The operation <i>n&nbsp;^&nbsp;m</i> computes the <i>m</i>-th power of
				<i>n</i>. Note that raising a negative number to a non-integer power is
				not a well-defined operation, yielding the result NaN.
			</td></tr>
			</table>
			<p>
			Reals can be
			<a href="#/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="#/language/expressions/binary-operators/order">ordered</a>.
			All operations on reals can mix integers and reals. The integer is then
			converted to a real, and the operation is executed with floating-point
			logic, even if the numbers represented by the reals could be converted
			to integers without loss of precision.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(value)</code> converts the
				value to a real. For reals this amounts to copying, integers
				are converted, and strings are parsed as decimal numbers.
				The result is subject to roundoff errors. All other types
				and all error conditions result in not-a-number.
			</td></tr>
			<tr><th>isFinite</th><td>
				<code class="code">isFinite()</code> test whether the value
				is finite. This is the case if it is neither infinite nor
				NaN.
			</td></tr>
			<tr><th>isInfinite</th><td>
				<code class="code">isInfinite()</code> test whether the value
				is infinite. This is the case if it equals positive or
				negative infinity.
			</td></tr>
			<tr><th>isNan</th><td>
				<code class="code">isNan()</code> test whether the value
				is not-a-number.
			</td></tr>
			<tr><th>inf</th><td>
				<code class="code">static inf()</code> returns positive
				infinity.
			</td></tr>
			<tr><th>nan</th><td>
				<code class="code">static nan()</code> returns not-a-number.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "string",
		"name": "String",
		"title": "The Type <i>String</i>",
		"content": `
			<p>
			The type String represents text. A string is a sequence of
			<a href="#/language/syntax/character-set">characters</a> of
			arbitrary length, also known as the <i>size</i> of the string.
			Although strings can contain any Unicode code point in the
			range U+0000 to U+FFFF,
			<a href="#/language/expressions/literals/strings">string
			literals</a> allow to encode all characters with plain ASCII.
			Despite their sequence nature, strings are immutable. Hence
			when the need for modifying a string arises then a new string
			must be constructed.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>binary&nbsp;+</th><td>
				Concatenate two strings as sequences of characters. Only one of the
				operands needs to be a string in order to trigger the application of
				this operator; the other operand is converted to a string as if it
				had been passed to the String constructor. The following two
				statements are equivalent:
				<tscript>
					print("pi = " + math.pi());
					print("pi = " + String(math.pi()));
				</tscript>
			</td></tr>
			<tr><th>item&nbsp;access&nbsp;[]</th><td>
				If the index is of type Integer then the single character at the
				specified (zero-based) position is returned. The position must be
				valid, i.e., it must neither be negative nor exceed the size of
				the string. The character is returned as an integer in the range
				0 to 65535 representing the unicode code point.
				<tscript>
					print("hello world"[5]); # prints 32, the code of " "
				</tscript>
				If the index is of type Range then the substring described by the
				range is extracted. Parts of the range that lie outside the valid
				index range are ignored.
				<tscript>
					print("hello world"[6:100]); # prints "world"
				</tscript>
			</td></tr>
			</table>
			<p>
			Strings can be
			<a href="#/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="#/language/expressions/binary-operators/order">ordered</a>.
			Strings are equal if they have the same length and all characters
			coincide. They are ordered lexicographically.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(value)</code> converts the
				value to a string.
			</td></tr>
			<tr><th>size</th><td>
				The <code class="code">function size()</code> returns the size of
				the string, which is the number of characters in the sequence.
			</td></tr>
			<tr><th>find</th><td>
				The <code class="code">function find(searchterm, start=0, backward=false)</code>
				searches for the string <i>searchterm</i> inside the string.
				If <i>backward</i> is <keyword>false</keyword> then it returns
				the first position not smaller than <i>start</i> where it encounters
				<i>searchterm</i> inside the string, or <keyword>null</keyword>
				if it is not found. If <i>backward</i> is <keyword>true</keyword>
				then the last position no larger than <i>start</i> where
				<i>searchterm</i> is found inside the string is returned.
			</td></tr>
			<tr><th>split</th><td>
				The <code class="code">function split(separator)</code> splits
				the string into substrings, separated by the separator string.
				It returns the substrings as an array. In case of two consecutive
				separators or a separator at the beginning or end of the string
				the resulting substring is empty. Example:
				<tscript>
					var s = "hello,A,,B,";
					var a = s.split(",");
					# a = ["hello", "A", "", "B", ""]
				</tscript>
			</td></tr>
			<tr><th>fromUnicode</th><td>
				The <code class="code">static function fromUnicode(characters)</code>
				converts a single integer or an array of integers into a string
				the character codes of which coincide with the integers.
				<tscript>
					print(String.fromUnicode([50, 8364])); # prints "2\u20ac"
				</tscript>
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "array",
		"name": "Array",
		"title": "The Type <i>Array</i>",
		"content": `
			<p>
			The type Array is a container capable of holding multiple values,
			called items of the array. Items are arranged in a sequence. They
			are accessed by integer-valued indices. Arrays are mutable: items
			can be inserted, deleted, and overwritten. Arrays can be created
			as <a href="#/language/expressions/literals/arrays">literals</a>.
			These literals can contain arbitrary expressions (not necessarily
			literals), which evaluate to the items.
			</p>

			<h2>Indexing</h2>
			<p>
			An array with <i>n</i> items has size <i>n</i>. The items are accessed with
			<a target="_blank" href="https://en.wikipedia.org/wiki/Zero-based_numbering#Computer_programming">zero-based indices</a>
			in the range 0 to <i>n-1</i>.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>item&nbsp;access&nbsp;[]</th><td>
				If the index is of type Integer then the single item at the
				specified (zero-based) position is returned. The position must be
				valid, i.e., it must neither be negative nor exceed the size of
				the array.
				If the index is of type Range then the sub-array described by the
				range is extracted. Parts of the range that lie outside the valid
				index range are ignored.
			</td></tr>
			</table>
			<p>
			Arrays can be
			<a href="#/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="#/language/expressions/binary-operators/order">ordered</a>,
			if all of their items are ordered.
			Arrays are equal if they have the same length and all items compare
			equal. They are ordered lexicographically. Ordering two array with
			items that are not ordered results in an error message.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(size_or_other=0, value=null)</code>
				creates a new array. If <i>size_or_other</i> is an integer then the
				array contains <i>size_or_other</i> copies of <i>value</i>.
				If <i>size_or_other</i> is an array then the array is copied.
				if <i>size_or_other</i> is a range then an array is created
				that contains the elements are the range as items.
			</td></tr>
			<tr><th>size</th><td>
				The <code class="code">function size()</code> returns the size of
				the array, which is the number of items.
			</td></tr>
			<tr><th>push</th><td>
				The <code class="code">function push(item)</code> appends the
				given item to the array.
			</td></tr>
			<tr><th>pop</th><td>
				The <code class="code">function pop()</code> removes and returns
				the last item from the array. When applied to the empty array it
				raises an error.
			</td></tr>
			<tr><th>insert</th><td>
				The <code class="code">function insert(position, item)</code>
				inserts a new item at a given position. The index must be
				non-negative and it must not exceed the array size.
			</td></tr>
			<tr><th>remove</th><td>
				The <code class="code">function remove(range)</code> removes
				the indicated range of items from the array. If range is an
				integer, then it is interpreted as range:range+1.
			</td></tr>
			<tr><th>sort</th><td>
				The <code class="code">function sort(comparator=null)</code>
				sorts the array in-place. Sorting is stable, i.e., the order of
				equivalent items is preserved. If <i>comparator</i> equals
				<keyword>null</keyword> then the built-in
				<a href="#/language/expressions/binary-operators/order">order
				relation</a> is used for sorting, which means that all items
				in the array must be ordered. Otherwise <i>comparator</i> is
				assumed to be a function of two arguments (denoted lhs and rhs)
				that returns a numeric value. A negative return value means that
				<i>lhs</i> should appear before <i>rhs</i>, a positive return
				value means <i>lhs</i> should appear after <i>rhs</i>, and zero
				indicates that the order does not matter, i.e., <i>lhs</i> and
				<i>rhs</i> are equivalent with respect to the order relation.
				The <i>compare</i> function is assumed to induce a
				<a target="_blank" href="https://en.wikipedia.org/wiki/Weak_ordering#Strict_weak_orderings">strict weak order relation</a>.
				If this assumption is not fulfilled then there is no guarantee
				that the function will manage to sort the array.
			</td></tr>
			<tr><th>keys</th><td>
				The <code class="code">function keys()</code> returns the
				range <code class="code">0:size()</code>. Its main purpose is
				compatibility with
				<a href="#/language/types/dictionary">Dictionary.keys</a>.
			</td></tr>
			<tr><th>values</th><td>
				The <code class="code">function values()</code> returns the
				array itself. Its main purpose is compatibility with
				<a href="#/language/types/dictionary">Dictionary.values</a>.
			</td></tr>
			<tr><th>concat</th><td>
				<code class="code">static function concat(first, second)</code>
				concatenates two arrays. It returns the concatenated array.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "dictionary",
		"name": "Dictionary",
		"title": "The Type <i>Dictionary</i>",
		"content": `
			<p>
			The type Dictionary is a container capable of holding multiple
			values, called items of the dictionary. Items are accessed with
			string-valued keys. Dictionaries are mutable: items can be inserted,
			deleted, and overwritten. Dictionaries can be created as
			<a href="#/language/expressions/literals/dictionaries">literals</a>.
			These literals can contain arbitrary expressions (not necessarily
			literals), which evaluate to the items.
			</p>

			<h2>Indexing</h2>
			<p>
			A dictionary with <i>n</i> items has size <i>n</i>. The items are
			accessed with keys. Any two different strings form two different
			keys, which can refer to different items. The empty string is a
			legal key. Of course, not every possible string refers to an item,
			but only keys that were explicitly defined.
			</p>
			<p>
			Conceptually, keys in a dictionary are not ordered. In particular,
			the lexicographical order of strings does not apply. Instead, the
			<code class="code">keys()</code> and <code class="code">values()</code>
			methods report items chronologically, i.e., in the order they were
			inserted. This order also applies when converting a dictionary to
			a string.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>item&nbsp;access&nbsp;[]</th><td>
				The index is expected to be of type string. The string must be
				a valid key, i.e., an item with that key must have been defined
				before. The operator returns the value stored with the key.
			</td></tr>
			</table>
			<p>
			Dictionaries can be
			<a href="#/language/expressions/binary-operators/equality">compared for equality</a>,
			but they are not <a href="#/language/expressions/binary-operators/order">ordered</a>.
			Two dictionaries compare equal if they contain the same keys, and if
			the items associated with these keys compare equal.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(other=null)</code>
				creates a new dictionary. If <i>other</i> is null then the
				dictionary is empty. If <i>other</i> is a dictionary then it
				is copied.
			</td></tr>
			<tr><th>size</th><td>
				The <code class="code">function size()</code> returns the size of
				the dictionary, which is the number of items.
			</td></tr>
			<tr><th>has</th><td>
				The <code class="code">function has(key)</code> tests whether
				<i>key</i> is the key of an item.
			</td></tr>
			<tr><th>remove</th><td>
				The <code class="code">function remove(key)</code> removes the
				item with the given key.
			</td></tr>
			<tr><th>keys</th><td>
				The <code class="code">function keys()</code> returns an array
				of strings holding all keys of the dictionary. This method
				provides an easy way of iterating over all items of a dictionary:
				<tscript>
					var d = {a: 6, b: "foo", c: true};
					for var key in d.keys() do
						print(key + ": " + d[key]);
				</tscript>
			</td></tr>
			<tr><th>values</th><td>
				The <code class="code">function values()</code> returns an array
				holding all values of the dictionary. The order of the values
				is the same as the order of keys returned by
				<code class="code">function keys()</code>.
			</td></tr>
			<tr><th>merge</th><td>
				<code class="code">static function merge(first, second)</code>
				merges two dictionaries, i.e., it joins the key/value pairs from
				both dictionaries into a single dictionary. If a key appears in
				both dictionaries then the value from the second one prevails.
				The function returns the merged dictionary.
			</td></tr>
			</table>
			</table>
		`,
		"children": []},
		{"id": "function",
		"name": "Function",
		"title": "The Type <i>Function</i>",
		"content": `
			<p>
			The Function type represents
			<a href="#/language/declarations/functions">function declarations</a>,
			<a href="#/language/declarations/classes">member function
			declarations</a> applied to an object, and
			<a href="#/language/expressions/literals/anonymous-functions">anonymous
			functions</a>, possibly with enclosed parameters. This summarizes
			all blocks of code that can be
			<a href="#/language/expressions/function-calls">called or invoked</a>
			by providing parameters in parentheses.
			Functions are immutable. The only operation they provide is the call
			operator.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>function&nbsp;call&nbsp;()</th><td>
				Calls the function. See
				<a href="#/language/expressions/function-calls">function calls</a>
				for details.
			</td></tr>
			</table>
			<p>
			Functions can be
			<a href="#/language/expressions/binary-operators/equality">compared for equality</a>,
			but they are not <a href="#/language/expressions/binary-operators/order">ordered</a>.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(value)</code> creates a copy
				of a function value.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "range",
		"name": "Range",
		"title": "The Type <i>Range</i>",
		"content": `
			<p>
			The Range type represents a range of integers. It is defined by
			two integers, <i>begin</i> and <i>end</i>. They define the half-open
			range<br/>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{x in N | begin &lt;= x &lt; end}</i>.<br/>
			Consequently, in case
			of <i>begin&nbsp;&gt;=&nbsp;end</i> the range is empty. Begin and end
			can be any values in the valid <a href="#/language/types/integer">integer</a>
			range; in particular, they can be negative.
			</p>
			<p>
			A range can be
			constructed with the range constructor or with the
			<a href="#/language/expressions/binary-operators/range">range operator&nbsp;:</a>.
			The two options are equivalent:
			<tscript>
				var r1 = Range(10, 15);
				var r2 = 10:15;
				print(r1 == r2);   # prints true
			</tscript>
			Once constructed, a range is immutable.
			</p>

			<h2>Operations</h2>
			<p>
			Ranges offer two rather trivial operations, both by means of the
			<a href="#/language/expressions/item-access">item access operator</a>,
			namely access of items by index and slicing. The behavior is designed
			to mimic that of an array holding the elements of the range as items:
			<tscript>
				var range = 10:15;   # pretend: var range = [10,11,12,13,14];
				print(range[3]);     # prints 13
				print(range[-2:2]);  # prints 10:12
			</tscript>
			Item access with an integer index requires that the index is valid,
			i.e., it is non-negative and less than the size of the range, which
			is defined as max(<i>end-begin</i>,&nbsp;0). Slicing access with another
			range does not require all indices to be valid, and the resulting range
			is clipped to the valid range.
			</p>
			<p>
			Two ranges compare equal if and
			only if begin and end coincide. This means that two empty ranges with
			different begin and end do not compare equal, although they represent the
			same (empty) set of integers. Ranges are not ordered.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(begin, end)</code> creates a
				new range from begin to end. Both arguments must be integers, or
				reals representing integer values.
			</td></tr>
			<tr><th>size</th><td>
				<code class="code">function size()</code> returns the size of
				the range.
			</td></tr>
			<tr><th>begin</th><td>
				<code class="code">function begin()</code> returns the begin of
				the range.
			</td></tr>
			<tr><th>end</th><td>
				<code class="code">function end()</code> returns the end of
				the range.
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "type",
		"name": "Type",
		"title": "The Type <i>Type</i>",
		"content": `
			<p>
			The values of type Type represent types, i.e., built-in types and
			classes. They are immutable. A type value can be constructed from
			any value.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a = [];
					var t = Type(a);
					print(t);       # &lt;Type Array&gt;
					print(Array);   # &lt;Type Array&gt;
					if t == Array then print("a is an array");

					var tt = Type(t);
					print(tt);      # &lt;Type Type&gt;
					var ttt = Type(tt);
					print(ttt);     # &lt;Type Type&gt;

					var b = t(3:8); # construct a new Array from a range using "t"
					print(b);       # [3,4,5,6,7]
				</tscript>
			</div>
			<p>
			Type values are useful for three purposes:
			<ol>
			<li>
				Testing at runtime whether a value is of a specific type.
				For example, this allows to test whether a number is an
				integer or a real, and hence for determining whether
				<a href="#/language/types/integer">integer</a> or
				<a href="#/language/types/real">floating point</a> arithmetic
				is used when applying an operator.
			</li>
			<li>
				Constructing new objects of a type determined at runtime,
				e.g., in a factory pattern.
			</li>
			<li>
				Type values can access static members of classes:
				<tscript>
					class A
					{
					public:
						static var s = 18;
					}

					var a = A();
					var t = Type(a);
					print(a.s);   # prints 18
					print(t.s);   # prints 18
				</tscript>
			</li>
			</ol>
			</p>

			<h2>Operations</h2>
			<p>
			Type values do not offer any operations other than the function call
			operator, which invokes the constructor of the type, and the member
			access operator, which accesses static members of the class.
			Two type values compare equal if they refer to the same type. Types
			are not ordered.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(value)</code> creates a new
				type object. It describes the type of <i>value</i>.
			</td></tr>
			<tr><th>superclass</th><td>
				<code class="code">static function superclass(type)</code>
				returns a type object representing the direct super class of
				the given <i>type</i>, or null if the it does not have a super
				class.
			</td></tr>
			<tr><th>isOfType</th><td>
				<code class="code">static function isOfType(value, type)</code>
				tests whether <i>value</i> is of type <i>type</i> or a derived
				class. This test is equivalent to
				<code class="code">Type.isDerivedFrom(Type(value), type)</code>.
			</td></tr>
			<tr><th>isDerivedFrom</th><td>
				<code class="code">static function isDerivedFrom(subclass, superclass)</code>
				tests whether <i>subclass</i> inherits <i>superclass</i> as a direct
				or indirect base (including the case that the types coincide).
			</td></tr>
			</table>
		`,
		"children": []},
		{"id": "class",
		"name": "Classes",
		"title": "Classes",
		"content": `
			<p>
			A Class is a user-defined type. It is created through a
			<a href="#/language/declarations/classes">class declaration</a>;
			the technical aspects of class declarations are discussed right
			there.
			</p>
			<p>
			Classes allow the programmer to extend the
			<a href="#/language/types">system of built-in types</a>. They open
			up the whole world of
			<a target="_blank" href="https://en.wikipedia.org/wiki/Object-oriented_programming">object-oriented programming</a>,
			a programming paradigm in which data and functionality is organized
			into objects, which are instances of classes. Objects organize data
			into semantically meaningful units. Classes bind functions operating
			on these chunks to the corresponding object. Classes define a public
			(possibly a protected) interface, defining the functionality. The
			implementation of the functionality is opaque to the user of a class
			or object, and hence allows the implementer to modify implementation
			details without affecting the outside world. This principle is known
			as "encapsulation" or "information hiding". Furthermore, classes can
			extend existing types through (single) inheritance.
			</p>

			<h2>Demonstration of Class Features</h2>
			<p>
			The following is a non-trivial example of a (rather minimal) class
			representing a date.
			</p>
			<tscript>
				# The Date class represents a date as the number of days since
				# 01.01.1970. The range is limited to years 1970 to 2099, for
				# ease of leap year handling. Objects store this value in an
				# integer, not in a member variable, but by inheriting type
				# Integer. In an object oriented view this means that a Date
				# *is* an integer. This design makes the integer operators
				# for arithmetics and comparison available for dates. The
				# class is based on the Gregorian calendar, and the date
				# format is European: "day.month.year", not "year, month day".
				class Date : Integer
				{
				private:
					static var month_start = [0, 31, 59, 90, 120, 151,
					        181, 212, 243, 273, 304, 334, 365];
					static var weekdays = ["Monday", "Tuesday", "Wednesday",
							"Thursday", "Friday", "Saturday", "Sunday"];

				public:
					# construct a date from the number of days since 1.1.1970
					constructor(daysSince1970) : super(daysSince1970)
					{ assert(daysSince1970 >= 0, "invalid date"); }

					# construct a date from day, month, and year
					static function fromDMY(day, month, year)
					{
						assert(Type(year) == Integer, "invalid date");
						assert(Type(month) == Integer, "invalid date");
						assert(Type(day) == Integer, "invalid date");
						assert(year >= 1970 and year < 2100, "invalid date");
						assert(month >= 1 and month <= 12, "invalid date");
						var leapyears = (year - 1 - 1968) // 4;
						var leapyear = year % 4 == 0;
						var mlen = month_start[month] - month_start[month - 1];
						if month == 2 and leapyear then mlen += 1;
						assert(day >= 1 and day <= mlen, "invalid date");

						var x = 365 * (year - 1970) + leapyears
						          + month_start[month - 1] + (day - 1);
						if leapyear and month > 2 then x += 1;
						return Date(x);
					}

					# return the date x days later
					function advance(x)
					{
						return Date(this + x);
					}

					# return the year component of the date
					function year()
					{
						return Integer((this + 0.5) / 365.25) + 1970;
					}

					# return the month component of the date
					function month()
					{
						var y = year();
						var r;
						if (this < 2*365) then r = (this % 365);
						else
						{
							r = Integer((this - 2*365) % 365.25);
							if y % 4 == 0 and r >= 31 + 28 then r -= 1;
						}
						for var i in 0:12 do
						{
							var m = 11 - i;
							if r >= month_start[m] then return m + 1;
						}
					}

					# return the day component of the date
					function day()
					{
						var y = year();
						var r, feb29 = 0;
						if (this < 2*365) then r = (this % 365);
						else
						{
							r = Integer((this - 2*365) % 365.25);
							if y % 4 == 0 then
							{
								if r == 59 then feb29 = 1;
								if r >= 59 then r -= 1;
							}
						}
						for var i in 0:12 do
						{
							var m = 11 - i;
							if r >= month_start[m] then
								return r - month_start[m] + 1 + feb29;
						}
					}

					# return the day-of-week as a string
					function dayOfWeek()
					{
						return weekdays[(this + 3) % 7];
					}

					# return a nice string representation of the date
					function prettyString()
					{
						return dayOfWeek() + ", " + day()
						                    + "." + month()
						                    + "." + year();
					}
				}

				# construct various dates
				var daysSince1970 = Integer(time() // 86400000);
				var today = Date(daysSince1970);
				var release = Date.fromDMY(version()["day"],
				                           version()["month"],
				                           version()["year"]);
				var ch = Date.fromDMY(24, 12, 1990);
				var ny = ch.advance(8);

				# operations on dates
				print("Days since TScript release: " + (today - release));
				if release > ny then print("TScript was released after 1990.");

				# date methods
				print("Christmas day 1990 was " + ch.dayOfWeek() + ", "
						+ ch.day() + "."
						+ ch.month() + "."
						+ ch.year());
				print("Newyear's day 1991 was " + ny.prettyString());
			</tscript>
		`,
		"children": []},
	]},
]
});
"use strict"

if (doc) doc.children.push({
"id": "library",
"name": "The TScript Standard Library",
"title": "Reference Documentation for the TScript Standard Library",
"content": `
	<p>
	This is the reference documentation of the TScript standard library.
	Its core consists of a hand full of general utility functions and a set
	of standard mathematical functions. Further parts of the library cover
	turtle and canvas graphics.
	</p>
`,
"children": [
	{"id": "core",
	"name": "Core Functions",
	"title": "Core Functions",
	"content": `
		<p>
		The functions described in this section perform essential core tasks.
		Instead of being library functions, they could equally well be
		implemented as language features.
		</p>
		<table class="methods">
		<tr><th>terminate</th><td>
			The <code class="code">function terminate()</code> immediately
			terminates the program. This is considered &quot;normal&quot;
			termination, in contrast to termination due to an error.
		</td></tr>
		<tr><th>assert</th><td>
			The <code class="code">function assert(condition, message)</code>
			tests whether <i>condition</i> evaluates to false. In that case it
			stops the program and emits <i>message</i> as an error message.
			This function should be used to verify that invariants of the
			program are fulfilled. Ideally, an assertion should never fail,
			and if it does then it indicates a bug. Assertions should not be
			used to check user input or other error conditions. An exception
			should be thrown in that case.
		</td></tr>
		<tr><th>error</th><td>
			The <code class="code">function error(message)</code>
			stops the program and emits <i>message</i> as an error message.
			This function should be used to report unrecoverable errors. As
			such, errors have a different role than exceptions, which should
			indicate recoverable errors.
		</td></tr>
		<tr><th>same</th><td>
			The <code class="code">function same(first, second)</code> tests
			whether its arguments refer to the same object.
		</td></tr>
		<tr><th>version</th><td>
			The <code class="code">function version()</code> returns a
			dictionary describing the current TScript version. The
			returned dictionary holds the following fields:
			<ul>
			<li>type: release type (string)</li>
			<li>major: first and most significant part of the version number</li>
			<li>minor: middle part of the version number</li>
			<li>patch: last and least significant part of the version number</li>
			<li>day: day of the release date</li>
			<li>month: month of the release date</li>
			<li>year: year of the release date</li>
			<li>full: human-readable version string</li>
			</ul>
		</td></tr>
		<tr><th>print</th><td>
			The <code class="code">function print(text)</code> outputs its
			argument as a new line into the message area. For this purpose,
			the argument is converted to a string.
		</td></tr>
		<tr><th>alert</th><td>
			The <code class="code">function alert(text)</code> opens a modal
			message box presenting the text to the user. For this purpose,
			the argument is converted to a string. The program continues
			after the user has closed the message box.
		</td></tr>
		<tr><th>confirm</th><td>
			The <code class="code">function confirm(text)</code> opens a
			modal message box presenting the text to the user. For this
			purpose, the argument is converted to a string. The user can
			either confirm or cancel the dialog, resulting in a return
			value of <code class="code">true</code> or
			<code class="code">false</code>, respectively. The program
			continues after the user has processed the message box.
		</td></tr>
		<tr><th>prompt</th><td>
			The <code class="code">function prompt(text)</code> opens a
			modal message box presenting the text to the user. For this
			purpose, the argument is converted to a string. The user can
			input a string in response, which is returned by the function.
			The program continues after the user has processed the message
			box.
		</td></tr>
		<tr><th>wait</th><td>
			The <code class="code">function wait(ms)</code> delays program
			execution for <i>ms</i> milliseconds.
		</td></tr>
		<tr><th>time</th><td>
			The <code class="code">function time()</code> returns the number
			of milliseconds since midnight 01.01.1970
			<a target="_blank" href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time">UTC</a>
			as a real.
		</td></tr>
		<tr><th>localtime</th><td>
			The <code class="code">function localtime()</code> returns the number
			of milliseconds since midnight 01.01.1970
			as a real. The value refers to local time, i.e., taking the
			local time zone and daylight saving time into account.
		</td></tr>
		<tr><th>exists</th><td>
			The <code class="code">function exists(key)</code> returns
			<keyword>true</keyword> if a value was stored with the given
			key, and <keyword>false</keyword> otherwise. This is analogous
			to checking whether a file exists in the file system.
		</td></tr>
		<tr><th>load</th><td>
			The <code class="code">function load(key)</code> returns the
			value that was stored with the given key. If the key does
			not exist then the function reports an error. This is
			analogous to loading data from a file into memory.
		</td></tr>
		<tr><th>save</th><td>
			The <code class="code">function save(key, value)</code> stores
			the value with the given key to a persistent storage. The
			stored value remains stored even after the program terminates.
			It can be loaded at any later time, even by a different program.
			This is analogous to storing data in a file. The stored data is
			restricted to JSON format. This means that the value must be of
			type Null, Boolean, Integer, Real, or String, or it must be an
			Array or Dictionary holding JSON values. JSON values must not
			form cycles: an Array or Dictionary value may not be nested,
			i.e., be contained as an item inside itself or one of its
			sub-items.
		</td></tr>
		<tr><th>deepcopy</th><td>
			<p>
			The <code class="code">function deepcopy(value)</code> creates
			a deep copy of a container. If the container holds other
			containers as values then they are deep copied, too. The copied
			data structure must fulfill the following requirements:
			<ul>
				<li>It must not contain functions.</li>
				<li>It must not contain objects.</li>
				<li>It must not contain a loop, i.e., contain a value as its own sub-value.</li>
			</ul>
			</p>
		</td></tr>
		<tr><th>setEventHandler</th><td>
			The <code class="code">function setEventHandler(event, handler)</code>
			sets an event handler for a named event. The handler is a callback
			function that is called with an event parameter whenever the
			corresponding event is triggered. The event name is provided
			as a string. The most common use of this function is to handle
			GUI-related events emitted by the <a href="#/library/canvas">canvas</a>.
			The standard library provides a &quot;timer&quot; event,
			which is fired roughly every 20 milliseonds.
			<tscript>
				function onTick(event)
				{
					print("tick...");
				}
				setEventHandler("timer", onTick);
				enterEventMode();
			</tscript>
			Events are triggered and handled only after calling
			<code class="code">enterEventMode</code>. The event handler is
			called with an event parameter, the type of which depends on the
			event type. For the timer event, the event is simply a
			<keyword>null</keyword> value. Calling
			<code class="code">setEventHandler</code> with
			<code class="code">handler = null</code> removes the handler for
			the given event type.
			
			When events take more than 20 milliseconds to complete,
			the &quot;timer&quot; event only gets called once for this timespan.
		</td></tr>
		<tr><th>enterEventMode</th><td>
			The <code class="code">function enterEventMode()</code> puts the
			program into event handling mode. The function returns only after
			calling <code class="code">quitEventMode</code> from within an
			event handler. The program still continues to run, handling all
			events received from external sources, like mouse and keyboard
			events for the canvas. Of course, at least one event handler
			should be registered before calling this function.
		</td></tr>
		<tr><th>quitEventMode</th><td>
			The <code class="code">function quitEventMode(result = null)</code>
			puts the program back into normal processing mode. It is usually
			called from within an event handler. The program handles all
			queued events, then it continues with the next statement
			following <code class="code">enterEventMode</code>. The parameter
			<code class="code">result</code> becomes the return value of
			<code class="code">function enterEventMode()</code>.
		</td></tr>
		</table>
	`,
	"children": [
	]},
	{"id": "math",
	"name": "Math Functions",
	"title": "Math Functions",
	"content": `
		<p>
		The <code class="code">namespace math</code> contains a number
		of functions computing powers, logarithms, trigonometric and
		hyperbolic functions. Unless stated differently, all functions
		operate on real numbers, and integers are converted to reals.
		</p>
		<table class="methods">
		<tr><th>pi</th><td>
			The <code class="code">function math.pi()</code> returns the constant
			<a target="_blank" href="https://en.wikipedia.org/wiki/Pi">pi</a>.
		</td></tr>
		<tr><th>e</th><td>
			The <code class="code">function math.e()</code> returns Euler's constant
			<a target="_blank" href="https://en.wikipedia.org/wiki/E_(mathematical_constant)">e</a>.
		</td></tr>
		<tr><th>abs</th><td>
			The <code class="code">function math.abs(x)</code> returns the absolute
			value of its argument. For an integer argument the result is of type
			integer. The function overflows only for the value <code class="code">-2147483648</a>.
		</td></tr>
		<tr><th>sqrt</th><td>
			The <code class="code">function math.sqrt(x)</code> returns the square
			root of its argument.
		</td></tr>
		<tr><th>cbrt</th><td>
			The <code class="code">function math.cbrt(x)</code> returns the cubic
			root of its argument.
		</td></tr>
		<tr><th>floor</th><td>
			The <code class="code">function math.floor(x)</code> returns the argument
			rounded down, i.e., the closest integer not larger than <i>x/<i>.
		</td></tr>
		<tr><th>round</th><td>
			The <code class="code">function math.round(x)</code> returns the argument
			rounded to the nearest integer.
		</td></tr>
		<tr><th>ceil</th><td>
			The <code class="code">function math.ceil(x)</code> returns the argument
			rounded up, i.e., the closest integer not smaller than <i>x/<i>.
		</td></tr>
		<tr><th>sin</th><td>
			The <code class="code">function math.sin(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">sine</a>
			of its argument.
		</td></tr>
		<tr><th>cos</th><td>
			The <code class="code">function math.cos(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">cosine</a>
			of its argument.
		</td></tr>
		<tr><th>tan</th><td>
			The <code class="code">function math.tan(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of its argument.
		</td></tr>
		<tr><th>sinh</th><td>
			The <code class="code">function math.sinh(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic sine</a>
			of its argument.
		</td></tr>
		<tr><th>cosh</th><td>
			The <code class="code">function math.cosh(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic cosine</a>
			of its argument.
		</td></tr>
		<tr><th>tanh</th><td>
			The <code class="code">function math.tanh(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic tangent</a>
			of its argument.
		</td></tr>
		<tr><th>asin</th><td>
			The <code class="code">function math.asin(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">sine</a>
			of its argument.
		</td></tr>
		<tr><th>acos</th><td>
			The <code class="code">function math.acos(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">cosine</a>
			of its argument.
		</td></tr>
		<tr><th>atan</th><td>
			The <code class="code">function math.atan(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of its argument.
		</td></tr>
		<tr><th>atan2</th><td>
			The <code class="code">function math.atan2(y, x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of <i>y/x</i>. This is the angle between the vectors (x, y) and (1, 0) in radians.
		</td></tr>
		<tr><th>asinh</th><td>
			The <code class="code">function math.asinh(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic sine</a>
			of its argument.
		</td></tr>
		<tr><th>acosh</th><td>
			The <code class="code">function math.acosh(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic cosine</a>
			of its argument.
		</td></tr>
		<tr><th>atanh</th><td>
			The <code class="code">function math.atanh(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic tangent</a>
			of its argument.
		</td></tr>
		<tr><th>exp</th><td>
			The <code class="code">function math.exp(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Exponential_function">exponential function</a>
			of its argument.
		</td></tr>
		<tr><th>log</th><td>
			The <code class="code">function math.log(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Natural_logarithm">natural logarithm</a>
			of its argument.
		</td></tr>
		<tr><th>log2</th><td>
			The <code class="code">function math.log2(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Logarithm">logarithm with base 2</a>
			of its argument.
		</td></tr>
		<tr><th>log10</th><td>
			The <code class="code">function math.log10(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Logarithm">logarithm with base 10</a>
			of its argument.
		</td></tr>
		<tr><th>pow</th><td>
			The <code class="code">function math.pow(b, e)</code> returns the <i>e</i>-th power of <i>b</i>.
			It is an alternative to <a href="#/language/expressions/binary-operators/power">operator ^</a> that always works with reals.
		</td></tr>
		<tr><th>sign</th><td>
			The <code class="code">function math.sign(x)</code> returns the
			sign of its argument, encoded as <i>-1</i>, <i>0</i>, or <i>+1</i>.
			The return type is an integer if the argument is, otherwise it is real.
		</td></tr>
		<tr><th>min</th><td>
			The <code class="code">function math.min(a, b)</code> returns the smaller
			of its two arguments. The function is applicable to non-numeric arguments
			as long as they are ordered. It is equivalent to<br/>
			<code class="code">if a <= b then return a; else return b;</code>
		</td></tr>
		<tr><th>max</th><td>
			The <code class="code">function math.max(a, b)</code> returns the larger
			of its two arguments. The function is applicable to non-numeric arguments
			as long as they are ordered. It is equivalent to<br/>
			<code class="code">if a >= b then return a; else return b;</code>
		</td></tr>
		<tr><th>random</th><td>
			The <code class="code">function math.random()</code> returns a real number
			drawn from the uniform distribution on the half-open unit interval [0,&nbsp;1[.
		</td></tr>
		</table>
	`,
	"children": [
	]},
	{"id": "turtle",
	"name": "Turtle Graphics",
	"title": "Turtle Graphics",
	"content": `
		<p>
		The functions in this section control the "turtle", an imaginary robot
		equipped with a pen that can move around and draw lines. The turtle
		moves in a two-dimensional area. It is described by a Cartesian
		coordinate system with horizontal (x) and vertical (y) axes. The origin
		is at the center of the area, and the visible area extends from -100 to
		+100 in each direction. The turtle can leave the visible area.
		</p>
		<p>
		At program start, the turtle is located at the origin of its coordinate
		system, it is equipped with a black pen, it and faces upwards, or in
		other words, along the positive y-axis. The turtle can move and turn.
		While doing so it can lower and raise a pen. While lowered, the pen
		draws the path taken by the turtle. The result of such drawing is known
		as "turtle graphics". The color of the pen can be changed.
		</p>
		<table class="methods">
		<tr><th>reset</th><td>
			The <code class="code">function reset(x=0, y=0, degrees=0, down=true)</code>
			places the turtle at position <i>(x, y)</i> on its drawing area.
			Its orientation is given by <i>degrees</i>, the color is set to
			black, and the pen is active if <i>down</i> is true. Using this
			function for actual drawing is considered improper use, or "cheating",
			since this operation is not available to an actual robot. The
			intended use is to initialize the turtle in a different position
			than the center.
		</td></tr>
		<tr><th>move</th><td>
			The <code class="code">function move(distance)</code> moves the
			turtle forward by the given distance, or backward if the distance
			is negative. If the pen is down in this state then a line is drawn.
		</td></tr>
		<tr><th>turn</th><td>
			The <code class="code">function turn(degrees)</code> rotates the
			turtle clockwise, where 360 <i>degrees</i> are one full rotation.
		</td></tr>
		<tr><th>color</th><td>
			The <code class="code">function color(red, green, blue)</code>
			sets the color of the pen, defined by red, green and blue components.
			All values are clipped to the range [0,&nbsp;1].
		</td></tr>
		<tr><th>pen</th><td>
			The <code class="code">function pen(down)</code> lifts the pen if
			<i>down</i> is false and lowers the pen if <i>down</i> is true.
		</td></tr>
		</table>
	`,
	"children": [
	]},
	{"id": "canvas",
	"name": "Canvas Graphics",
	"title": "Canvas Graphics",
	"content": `
		<p>
		The functions in this section control the "canvas", a rectangular
		surface for drawing geometric shapes and text. Canvas graphics is
		significantly more flexible than turtle graphics. The canvas
		provides user-triggered mouse and keyboard events.
		</p>
		<p>
		The canvas is a two-dimensional grid of pixels. Each pixel covers
		an area of size 1x1. The origin of the coordinate system is the
		top/left corner of the top/left pixel. The x-coordinate grows
		towards the right, while the y-coordinate grows towards the bottom.
		The latter is in contrast to a standard mathematical coordinate
		system, however, the convention is common for computer screens.
		The size of the canvas depends on the size of the window containing
		the canvas. Drawing outside the canvas has no effect.
		</p>
		<p>
		Note that the above convention means that integer coordinates refer
		to the corners of pixels. Hence, the coordinates of the center of
		the top/left pixel are (0.5, 0.5). All drawing operations are
		defined in continuous coordinates. Conceptually, drawing a red line
		of width 1 from point (10, 10) to point (20, 10) spills red ink
		over the rectangle with corners (10, 9.5), (10, 10.5), (20, 10.5),
		(20, 9.5). Therefore the pixels in rows y=9 and y=10 are covered
		by 50% red ink. When drawing on top of white background, then the
		drawing command results in two consecutive horizontal pixel rows
		of light red color. However, the intended is most probably to fill
		a single pixel row with fully red color. This is achieved by
		drawing a line of width 1 from (10, 10.5) to (20, 10.5). This shift
		of 0.5 is a bit unintuitive at first, and it is caused by integer
		coordinates referring to the corners of pixels, not to their centers.
		</p>
		<p>
		Canvas drawing is stateful. This means that properties of drawing
		operations like line and fill color and line width are set before
		the actual drawing commands are issued. This makes it easy to draw,
		e.g., many lines of the same width and color in sequence.
		</p>
		<p>
		The canvas namespace provides a large number of functions. They are
		split into five categories: reading properties, setting properties,
		transformations, drawing, and managing events.
		</p>

		<h3>Reading Properties</h3>
		<table class="methods">
		<tr><th>width</th><td>
			The <code class="code">function width()</code> returns the current
			width of the canvas in pixels.
		</td></tr>
		<tr><th>height</th><td>
			The <code class="code">function height()</code> returns the current
			height of the canvas in pixels.
		</td></tr>
		</table>

		<h3>Setting Properties</h3>
		<table class="methods">
		<tr><th>setLineWidth</th><td>
			The <code class="code">function setLineWidth(width)</code> sets
			the line width. The parameter <code class="code">width</code>
			must be a positive number.
		</td></tr>
		<tr><th>setLineColor</th><td>
			The <code class="code">function setLineColor(red, green, blue, alpha)</code>
			sets the line color. All arguments are in the range 0 to 1. The
			alpha (opacity) argument is optional, it defaults to 1.
		</td></tr>
		<tr><th>setFillColor</th><td>
			The <code class="code">function setFillColor(red, green, blue, alpha)</code>
			sets the fill color. All arguments are in the range 0 to 1. The
			alpha (opacity) argument is optional, it defaults to 1.
		</td></tr>
		<tr><th>setFont</th><td>
			The <code class="code">function setFont(fontface, fontsize)</code>
			sets the current font. The fontface is a string, it must correspond
			to a font existing on the system. The fontsize is defined in pixels,
			it must be a positive number. The default font is a 16px Helvetica
			font.
		</td></tr>
		<tr><th>setTextAlign</th><td>
			The <code class="code">function setTextAlign(alignment)</code>
			sets the text alignment. Possible values are
			<code class="code">&quot;left&quot;</code> (the default),
			<code class="code">&quot;center&quot;</code>, and
			<code class="code">&quot;right&quot;</code>.
			The position given in text drawing commands is relative to the
			alignment.
		</td></tr>
		</table>

		<h3>Drawing</h3>
		<table class="methods">
		<tr><th>clear</th><td>
			The <code class="code">function clear()</code> erases all drawn
			content by filling the entire canvas with the current fill color.
			It also resets the transformation (see function reset() below).
		</td></tr>
		<tr><th>line</th><td>
			The <code class="code">function line(x1, y1, x2, y2)</code> draws
			a line from (x1, y1) to (x2, y2) using the current line width and
			line color.
		</td></tr>
		<tr><th>rect</th><td>
			The <code class="code">function rect(left, top, width, height)</code>
			draws the outline of a rectangle with the current line width and
			line color.
		</td></tr>
		<tr><th>fillRect</th><td>
			The <code class="code">function fillRect(left, top, width, height)</code>
			fills a rectangle with the current fill color.
		</td></tr>
		<tr><th>frameRect</th><td>
			The <code class="code">function frameRect(left, top, width, height)</code>
			fills a rectangle with the current fill color and draws the outline with
			the current line color and line width.
		</td></tr>
		<tr><th>circle</th><td>
			The <code class="code">function circle(x, y, radius)</code>
			draws the outline of a circle with the current line width and
			line color.
		</td></tr>
		<tr><th>fillCircle</th><td>
			The <code class="code">function fillCircle(x, y, radius)</code>
			fills a circle with the current fill color.
		</td></tr>
		<tr><th>frameCircle</th><td>
			The <code class="code">function frameCircle(x, y, radius)</code>
			fills a circle with the current fill color and draws the outline with
			the current line color and line width.
		</td></tr>
		<tr><th>curve</th><td>
			The <code class="code">function curve(points, closed)</code> draws
			a polygon given by the array <code class="code">points</code>, each
			entry of which is an array containing (x, y) coordinates. If the
			optional argument <code class="code">closed</code> is set to true then
			the first and the last point are connected, resulting in a closed
			polygon. The curve is drawn with the current line width and line color.
		</td></tr>
		<tr><th>fillArea</th><td>
			The <code class="code">function fillArea(points)</code> fills the
			closed polygon given by <code class="code">points</code> (see function
			curve) with the current fill color.
		</td></tr>
		<tr><th>frameArea</th><td>
			The <code class="code">function frameArea(points)</code> fills the
			closed polygon given by <code class="code">points</code> (see function
			curve) with the current fill color, and then draws the polygon outline
			with the given line color and line width.
		</td></tr>
		<tr><th>text</th><td>
			The <code class="code">function text(x, y, str)</code> draws the string
			<code class="code">str</code> at position (x, y), relative to the
			current text alignment, using the current font and fill color.
		</td></tr>
		</table>

		<h3>Transformations</h3>
		<table class="methods">
		<tr><th>reset</th><td>
			The <code class="code">function reset()</code> resets the current
			transformation. Afterwards the origin of the coordinate system is
			the top left corner, with axes extending to the right and to the
			bottom.
		</td></tr>
		<tr><th>shift</th><td>
			The <code class="code">function shift(dx, dy)</code> translates
			the origin of the coordinate system by the vector (dx, dy).
		</td></tr>
		<tr><th>scale</th><td>
			The <code class="code">function scale(factor)</code> scales the
			coordinate system by the given factor.
		</td></tr>
		<tr><th>rotate</th><td>
			The <code class="code">function rotate(angle)</code> rotates the
			coordinate system clockwise by the given angle. The angle is given
			in radians, i.e., a full rotation corresponds to the angle
			<code class="code">2 * math.pi()</code>.
		</td></tr>
		<tr><th>transform</th><td>
			The <code class="code">function transform(A, b)</code> transforms
			coordinates (x, y) into new coordinates A (x, y) + b, where A is
			the 2x2 matrix <code class="code">[[A11, A12], [A21, A22]]</code>
			and b is the vector <code class="code">[b1, b2]</code>.
		</td></tr>
		</table>

		<h3>Managing Events</h3>
		<p>
		The canvas emits the following events:
			<table class="nicetable">
			<tr><th>event name</th><th>event type</th><th>meaning</th></tr>
			<tr><td>&quot;canvas.mousemove&quot;</td><td>MouseMoveEvent</td><td>mouse pointer moved to new position within the canvas</td></tr>
			<tr><td>&quot;canvas.mouseout&quot;</td><td>Null</td><td>mouse pointer left the canvas</td></tr>
			<tr><td>&quot;canvas.mousedown&quot;</td><td>MouseButtonEvent</td><td>mouse button pressed</td></tr>
			<tr><td>&quot;canvas.mouseup&quot;</td><td>MouseButtonEvent</td><td>mouse button released</td></tr>
			<tr><td>&quot;canvas.keydown&quot;</td><td>KeyboardEvent</td><td>keyboard key pressed</td></tr>
			<tr><td>&quot;canvas.keyup&quot;</td><td>KeyboardEvent</td><td>keyboard key released</td></tr>
			<tr><td>&quot;canvas.resize&quot;</td><td>ResizeEvent</td><td>canvas resized</td></tr>
			</table>
		They can be received by setting corresponding event handlers with the
		standard library function <code class="code">setEventHandler</code>.
		</p>
		<p>
		The different event types are lightweight classes providing
		public attributes. They are defined as follows:
		<tscript>
			class MouseMoveEvent
			{
			public:
				var x;         # horizontal pointer position
				var y;         # vertical pointer position
				var buttons;   # array of pressed buttons
				var shift;     # shift key pressed?
				var control;   # control key pressed?
				var alt;       # alt key pressed?
				var meta;      # meta key pressed?
			}

			class MouseButtonEvent
			{
			public:
				var x;         # horizontal pointer position
				var y;         # vertical pointer position
				var button;    # button that caused the event
				var buttons;   # array of pressed buttons
				var shift;     # shift key pressed?
				var control;   # control key pressed?
				var alt;       # alt key pressed?
				var meta;      # meta key pressed?
			}

			class KeyboardEvent
			{
			public:
				var key;       # name of the key that caused the event
				var shift;     # shift key pressed?
				var control;   # control key pressed?
				var alt;       # alt key pressed?
				var meta;      # meta key pressed?
			}

			class ResizeEvent
			{
			public:
				var width;     # new width of the canvas
				var height;    # new height of the canvas
			}
		</tscript>
		Buttons are named <code class="code">"left"</code>,
		<code class="code">"middle"</code>, and <code class="code">"right"</code>.
		Keys are named according to the
		<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values">JavaScript rules</a>.
		</p>
	`,
	"children": [
	]},
]
});
"use strict"

if (doc) doc.children.push({
"id": "examples",
"name": "Example Programs",
"title": "Example Programs",
"content": `
	<p>
	This section provides example programs demonstrating the use of
	turtle and canvas graphics. They can by copied by clicking the code.
	Simply paste the code into the editor and run the programs. You may
	need to activate the corresponding panels (turtle or canvas) in
	order to see the output.
	</p>
	<ul>
		<li><a href="#/examples/koch-snowflake">Koch snowflake (turtle graphics)</a></li>
		<li><a href="#/examples/game-of-life">Conway's Game of Life (canvas graphics)</a></li>
		<li><a href="#/examples/cube-3D">Rotating 3D Cube (canvas graphics)</a></li>
	</ul>
`,
"children": [
	{"id": "koch-snowflake",
	"name": "Koch Snowflake",
	"title": "Koch Snowflake",
	"content": `
		<tscript do-not-run>
			#
			# Koch snowflake
			# https://en.wikipedia.org/wiki/Koch_snowflake
			#

			function segment(length, depth)
			{
				if depth <= 0 then
				{
					turtle.move(length);
				}
				else
				{
					segment(length/3, depth-1);
					turtle.turn(60);
					segment(length/3, depth-1);
					turtle.turn(-120);
					segment(length/3, depth-1);
					turtle.turn(60);
					segment(length/3, depth-1);
				}
			}

			var h0 = -80 / 3 * math.sqrt(3);
			for var depth in 1:7 do
			{
				turtle.reset(-80, h0, 90);
				turtle.color(0, 0, 0);
				for 0:3 do
				{
					segment(160, depth);
					turtle.turn(-120);
				}
				if depth == 6 then break;
				wait(1000);
				turtle.reset(-80, h0, 90);
				turtle.color(1, 1, 1);
				for 0:3 do
				{
					segment(160, depth);
					turtle.turn(-120);
				}
			}
		</tscript>
	`,
	"children": []},
	{"id": "game-of-life",
	"name": "Game of Life",
	"title": "Game of Life",
	"content": `
		<tscript do-not-run>
			#
			# Game of Life
			# https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
			#

			# initialize the field
			var fieldsize = 25;
			var field = [];
			for var y in 0:fieldsize do
			{
				var row = [];
				for var x in 0:fieldsize do row.push(math.random() < 0.2);
				field.push(row);
			}

			# progress the dynamics by one time step
			function step()
			{
				var newfield = [];
				for var y in 0:fieldsize do
				{
					var row = [];
					for var x in 0:fieldsize do
					{
						var n = 0;
						for var b in -1:2 do
							for var a in -1:2 do
								if field[(y+b+fieldsize) % fieldsize][(x+a+fieldsize) % fieldsize] then n += 1;
						if field[y][x] then row.push(n == 3 or n == 4);
						else row.push(n == 3);
					}
					newfield.push(row);
				}
				field = newfield;
			}

			# redraw the whole field
			function draw()
			{
				# size of a cell in pixels
				var sz = math.min(canvas.width() // fieldsize, canvas.height() // fieldsize);
				if sz <= 0 then return;

				for var y in 0:fieldsize do
				{
					for var x in 0:fieldsize do
					{
						if field[y][x] then canvas.setFillColor(1, 1, 1);
						else canvas.setFillColor(0, 0, 1);
						canvas.fillRect(x*sz, y*sz, sz, sz);
					}
				}
			}

			# draw the initial state
			canvas.setFillColor(0, 0, 0);
			canvas.clear();
			draw();

			# infinite "game" loop
			while true do
			{
				step();
				draw();
			}
		</tscript>
	`,
	"children": []},
	{"id": "cube-3D",
	"name": "3D Cube",
	"title": "3D Cube",
	"content": `
		<tscript do-not-run>
			#
			# 3D cube
			#

			use namespace math;

			class Face
			{
			public:
				var color;
				var points;
				constructor(points_, color_)
				{
					points = points_;
					color = color_;
				}
			}

			var points3d = [
					[-1,-1,-1],
					[+1,-1,-1],
					[-1,+1,-1],
					[+1,+1,-1],
					[-1,-1,+1],
					[+1,-1,+1],
					[-1,+1,+1],
					[+1,+1,+1],
				];
			var faces = [
					Face([0,1,3,2], [1,0,0]),
					Face([1,0,4,5], [1,1,0]),
					Face([3,1,5,7], [0,1,0]),
					Face([2,3,7,6], [0,0,1]),
					Face([0,2,6,4], [1,0,1]),
					Face([6,7,5,4], [0,1,1]),
				];

			function matmat(m1, m2)
			{
				var ret = [[1,0,0], [0,1,0], [0,0,1]];
				for var i in 0:3 do
				{
					for var j in 0:3 do
					{
						var sum = 0.0;
						for var k in 0:3 do sum += m1[i][k] * m2[k][j];
						ret[i][j] = sum;
					}
				}
				return ret;
			}

			function matvec(m, v)
			{
				var ret = [0,0,0];
				for var j in 0:3 do
				{
					var sum = 0.0;
					for var k in 0:3 do sum += m[j][k] * v[k];
					ret[j] = sum;
				}
				return ret;
			}

			function projection(v)
			{
				use namespace canvas;
				var w = width() / 2;
				var h = height() / 2;
				var s = min(w, h);
				return [w + s * v[0] / (v[2] + 3), h + s * v[1] / (v[2] + 3)];
			}

			function draw(yaw, pitch)
			{
				var rot_yaw = [[cos(yaw),0,sin(yaw)], [0,1,0], [-sin(yaw),0,cos(yaw)]];
				var rot_pitch = [[1,0,0], [0,cos(pitch),sin(pitch)], [0,-sin(pitch),cos(pitch)]];
				var rot = matmat(rot_yaw, rot_pitch);
				var points2d = [];
				for var p in points3d do
				{
					var p3d = matvec(rot, p);
					var p2d = projection(p3d);
					points2d.push(p2d);
				}
				for var f in faces do
				{
					var list = [];
					for var i in f.points do list.push(points2d[i]);
					var v0 = [list[1][0] - list[0][0], list[1][1] - list[0][1]];
					var v1 = [list[2][0] - list[1][0], list[2][1] - list[1][1]];
					var det = v0[0] * v1[1] - v0[1] * v1[0];
					if det <= 0 then continue;
					use namespace canvas;
					setFillColor(f.color[0], f.color[1], f.color[2]);
					frameArea(list);
				}
			}

			draw(0, 0);

			function onMouseMove(event)
			{
				use namespace canvas;
				setFillColor(1, 1, 1);
				clear();
				draw(width() / 2 - event.x / 100, event.y / 100 - height() / 2);
			}

			alert("Move the mouse over the canvas!");
			setEventHandler("canvas.mousemove", onMouseMove);
			enterEventMode();
		</tscript>
	`,
	"children": []},
]
});
"use strict"

if (doc) doc.children.push({
"id": "errors",
"name": "Error Messages",
"title": "All Error Messages Explained",
"content": `
	<p>
	Sometimes error messages can be really confusing. Experienced
	programmers know how to read and interpret even seemingly obscure
	errors, and they have adapted to the oddities of their tools.
	However, beginners can get lost rather quickly when trying to
	understand the root cause of an error.
	One reason for difficult to understand error messages is that in
	some situations the parser or interpreter emitting the message would
	have to guess in order to determine the most probable cause of the
	error, while reporting only the symptoms down the road is easy.
	</p>
	<div class="example">
		<h3>Example</h3>
		Say, the programmer accidentally deleted a brace closing a
		scope. Then an error message may complain that a closing brace
		is missing at the end of the program. Or it may complain that a
		constructor is allowed only inside of a class, as in the example
		below.
		<tscript>
		class A
		{
		public:
			var x;
			function set(y)
			{
				if x == y then {
					x = y;
				}  # <-- what happens if this closing brace is removed?
				x = 3 / y;
			}
			constructor()
			{
				x = 0;
			}
		}
		</tscript>
		Assume that the marked brace was accidentally deleted.
		What the programmer perceives is that according his code layout
		the constructor is indeed part of the class, so the error does
		not seem to make any sense. In contrast, TScript sees the
		constructor as being declared within function
		<code class="code">set</code>, because it
		keeps interpreting closing braces differently than the programmer
		until it finally encounters an unresolvable situation and
		reports an error. By the time it encounters the constructor it
		knows nothing about the class being never closed by a brace,
		from which a really smart program may then be able to narrow down
		the error, or at least conclude that the error's root cause could
		possibly be found in many different places.
	</div>
	<p>
	Such situations are hard to avoid in entirety. Therefore, when
	encountering a strange error it is helpful to understand how error
	messages come about. For sure, the true cause of the error is found
	<i>before</i> the reported error position, and as the above example
	demonstrates, it may be far from the position where an error is
	finally reported. More often than not, the true error is in the
	statement <i>just preceding</i> the one where an error is reported.
	In addition to such general but somewhat limited insights, this
	section aims to help by explaining in detail what each error message
	means, how it typically occurs, and which pitfalls one should be
	aware of.
	</p>

	<h2>Placeholders</h2>
	<p>
	Many error messages in this documentation contain placeholders like
	'X' and 'Y'. In an actual error message, these placeholders are
	replaced with actual names. For example, the error message
	<b>cannot order type 'X'</b> in the documentation could appear in a
	real context as <b>cannot order type 'Dictionary'</b>.
	</p>
`,
"children": [
	{"id": "syntax",
	"name": "Syntax Errors",
	"title": "Syntax Errors",
	"content": `
		<p>
		A syntax error indicates failure to follow the
		<a href="#/language/syntax/EBNF-syntax">formal syntax</a>
		of the language.
		</p>
	`,
	"children": [
		{"id": "se-1",
		"content": `
			<p>
			This error occurs in two situations:
			<ol>
				<li>
					A number is parsed as a floating point literal with decimal dot
					<code class="code">.</code>, but the dot is not followed by a
					number, as it should.
				</li>
				<li>
					A number is parsed as a floating point literal with exponent
					indicator <code class="code">E</code> or <code class="code">e</code>,
					but the indicator is not followed by a number, as it should.
				</li>
			</lo>
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(5.0);         # number with decimal place
					# print(5.);        # error
					# print(.5);        # (different error)
					print(-6.2E+002);   # number with exponent
					# print(-6.2E+);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-2",
		"content": `
			<p>
			Each <a href="#/language/expressions/literals/strings">string literal</a>
			must end within a single line. This error indicates that the
			closing double quotes character was not found before the end
			of the line.
			</p>
		`,
		"children": []},
		{"id": "se-3",
		"content": `
			<p>
			A Unicode escape sequence in a
			<a href="#/language/expressions/literals/strings">string literal</a>
			is of the form <code class="code">\\uXXXX</code>, where each
			X represents a hexadecimal digit, i.e., a digit or a lower
			or upper case letter in the range A to F. This error is
			reported if not all of the four characters following the \\u
			sequence are hex digits.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print("\\u20AC");    # Euro sign
					# print("\\u20");    # error: too few characters
					# print("\\u20YZ");  # error: Y and Z are invalid
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-4",
		"content": `
			<p>
			In a
			<a href="#/language/expressions/literals/strings">string literal</a>,
			the backslash character starts an escape sequence. Only specific codes
			are allowed in escape sequences, as specified
			<a href="#/language/syntax/tokens">here</a>. This error occurs if an
			invalid code is encountered.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print("\\n");     # line feed
					# print("\\z");   # error: z is not a value escape code
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-5",
		"content": `
			<p>
			This error is reported if an invalid character was encountered
			in the program. All characters are legal inside comments and
			string literals, but not in the rest of the program. The exact
			rules which character is legal in which context are determined
			by the
			<a href="#/language/syntax/EBNF-syntax">syntax rules</a>.
			For example, the character <code class="code">@</code> is not
			legal outside comments and string literals.
			</p>
		`,
		"children": []},
		{"id": "se-6",
		"content": `
			<p>
			The keyword <keyword>super</keyword> refers to the super class
			of the current class. Therefore, using this keyword outside of
			a class declaration results in this error.
			</p>
		`,
		"children": []},
		{"id": "se-7",
		"content": `
			<p>
			The keyword <keyword>super</keyword> refers to the super class
			of the current class. Therefore, using this keyword in a class
			that does not have a super class results in this error.
			</p>
		`,
		"children": []},
		{"id": "se-8",
		"content": `
			<p>
			The keyword <keyword>super</keyword> is used to refer to members
			of the super class. The reference is of the form
			<code class="code">super.name</code>. This error indicates that
			the dot is missing after super.
			</p>
		`,
		"children": []},
		{"id": "se-9",
		"content": `
			<p>
			The keyword <keyword>super</keyword> is used to refer to members
			of the super class. The reference is of the form
			<code class="code">super.name</code>. This error indicates that
			the identifier is missing after super.
			</p>
		`,
		"children": []},
		{"id": "se-10",
		"content": `
			<p>
			This error can occur in multiple contexts, namely when parsing the
			super class in a class declaration, in a use directive, and when
			parsing the loop variable of a for-loop. It indicates that a name
			referring to a type or variable is expected but not found.
			</p>
		`,
		"children": []},
		{"id": "se-11",
		"content": `
			<p>
			A name is a sequence of identifiers separated by dots. This error
			indicates that the name ends with a dot, while it should end with
			an identifier. In other words, there is either a trailing dot or
			an identifier is missing at the end.
			</p>
		`,
		"children": []},
//		{"id": "se-12",
//		"content": `
//			<p>
//			This error occurs if a name refers to a non-static member of an outer
//			class. It cannot be accessed because the <keyword>this</keyword> object
//			of the inner class is unrelated.
//			</p>
//		`,
//		"children": []},
		{"id": "se-13",
		"content": `
			<p>
			This error message indicates that a name refers to a non-static
			attribute or method, which requires <keyword>this</keyword> to be
			valid, but the lookup happens from a static context where no
			<keyword>this</keyword> object exists.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					var x;
					static function f()
					{
						# print(x);   # error
					}
				}
				</tscript>
			</div>
			<p>
			A context where this error may be unintuitive at first is when
			using a function name as a
			<a href="#/language/expressions/constants">constant expression</a>,
			i.e., as the default value of a parameter or as the initializer
			of an attribute. A constant can refer to a function declaration
			only if it is not a member of a class or if it is static.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					function f() { }
					static function s() { }
					# var y = f;      # error
					var z = s;        # okay
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-14",
		"content": `
			<p>
			When calling a function, all positional arguments must precede
			the named arguments. This error occurs when that rule is violated
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a, b=0, c=0) { /*...*/ }
				f(7, c=2);      # okay
				# f(b=2, 6);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-15",
		"content": `
			<p>
			This error indicates that a function call is broken. The argument list
			is a comma-separated list of expressions in parentheses. In other words,
			each expression is followed either by a comma or by a closing parenthesis.
			The error is reported if a different token is encountered.
			</p>
		`,
		"children": []},
		{"id": "se-16",
		"content": `
			<p>
			The formal syntax of a function call does not ensure that the object
			being called is indeed callable.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a) { }
				var a = f;
				a(3);      # okay
				a = 42;
				# a(3);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-21",
		"content": `
			<p>
			The result of applying a left-unary of binary operator like
			<code class="code">+</code> is a temporary value. Assigning
			to this value does not make any sense, and therefore is a
			syntax error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var a;
				a = 1 + 2;      # okay
				# a + 1 = 2;    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-22",
		"content": `
			<p>
			Any expression can be enclosed in parentheses, usually for the
			purpose of overriding operator precedence rules. When nesting
			many parenthesis in a single expression, it is a common mistake
			to forget to close a parenthesis, which results in this error.
			</p>
		`,
		"children": []},
		{"id": "se-23",
		"content": `
			<p>
			A sequence of digits forms an integer <i>token</i>. However, an integer
			<i>literal</i> is limited to the range 0 to 2147483647=2<sup>31</sup>-1,
			since otherwise overflow would apply, which is undesirable for literals.
			This error indicates that the valid range was exceeded.
			</p>
			<p>
			This poses the difficulty of representing the smallest integer value,
			which is -2147483648. It cannot be denoted as such, because its
			positive counterpart exceeds the valid range, so an error occurs
			before negation is applied. Instead, the value can be denoted as
			follows:
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var a = -2147483647 - 1;          # usable as a constant
				var b = -2^31;                    # usable as a constant
				var c = Integer(-2147483648.0);   # not usable as a constant
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-24",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/arrays">array literal</a>
			starts with an opening bracket <code class="code">[</code> and stops with
			a closing bracket <code class="code">]</code>, enclosing a comma-separated
			list of expressions. This error indicates that neither a comma nor a
			closing bracket was found after an expression.
			</p>
		`,
		"children": []},
		{"id": "se-25",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/arrays">array literal</a>
			starts with an opening bracket <code class="code">[</code> and stops with
			a closing bracket <code class="code">]</code>. This error indicates that
			the end of the program was reached without encountering the closing
			bracket.
			</p>
		`,
		"children": []},
		{"id": "se-26",
		"content": `
			<p>
			Keys in a dictionary must be unique. This error occurs if a
			<a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			specifies the given key more than once.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var dict = {
						"name": "john",
						"age": 25,
						# "name": "smith",   # error: duplicate key 'name'
						"address": "..."
					};
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-27",
		"content": `
			<p>
			A <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			starts with an opening brace <code class="code">{</code> and stops with
			a closing brace <code class="code">}</code>, enclosing a comma-separated
			list of key-value pairs. This error indicates that neither a comma nor a
			closing brace was found after a value.
			</p>
		`,
		"children": []},
		{"id": "se-28",
		"content": `
			<p>
			Keys in a <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			are identifiers or strings. This error is reported if neither of them
			was found where a key was expected.
			</p>
		`,
		"children": []},
		{"id": "se-29",
		"content": `
			<p>
			In a <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>,
			keys and values are separated by colons. This error occurs is there is
			no colon found after the key.
			</p>
		`,
		"children": []},
		{"id": "se-30",
		"content": `
			<p>
			A <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			starts with an opening brace <code class="code">{</code> and stops with
			a closing brace <code class="code">}</code>. This error indicates that
			the end of the program was reached without encountering the closing
			brace.
			</p>
		`,
		"children": []},
		{"id": "se-31",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>
			expression encloses variables as a comma-separated list of named expressions
			enclosed in square brackets. In other words, a comma or a closing bracket
			must follow each variable or expression, otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-32",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>
			expression encloses variables as a comma-separated list of named expressions
			in square brackets. It can enclose variables under their names in the
			surrounding scope, or it can enclose an expression under an explicitly
			given (variable) name. In the latter case, if the variable name is missing
			then this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-33",
		"content": `
			<p>
			The parameter list of a function is a comma separated list of identifiers,
			possibly with the definition of default values, enclosed in parentheses.
			Hence, each identifier (optionally with its default value) must be followed
			by a comma or closing parenthesis, otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-35",
		"content": `
			<p>
			When using the keyword <keyword>function</keyword> in an expression,
			an <a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>
			is declared. The keyword is followed by an optional list of closure
			variables enclosed in square brackets or by a parameter list in
			enclosed parentheses, otherwise this error is emitted.
			</p>
		`,
		"children": []},
		{"id": "se-36",
		"content": `
			<p>
			When declaring a <a href="#/language/declarations/functions">function</a>,
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>,
			or a <a href="#/language/declarations/classes">constructor</a>,
			then a parameter list must be defined, even if it is empty. This
			error indicates that the opening parenthesis was not found.
			</p>
		`,
		"children": []},
		{"id": "se-37",
		"content": `
			<p>
			A <href="#/language/declarations/functions">function</a> declares
			parameters as a comma-separated list in parentheses. Hence, each
			parameter must be followed by a comma or a closing parenthesis,
			otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-38",
		"content": `
			<p>
			Default values of
			<href="#/language/declarations/functions">function</a> parameters
			must be <a href="#/language/expressions/constants">constants</a>.
			This error indicates that the default value expression is not
			considered a proper constant in TScript.
			</p>
		`,
		"children": []},
		{"id": "se-40",
		"content": `
			<p>
			This error indicates that a namespace, class, or function body is
			missing in a <a href="#/language/declarations">declaration</a> or
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>.
			</p>
		`,
		"children": []},
		{"id": "se-41",
		"content": `
			<p>
			A keyword that cannot initiate an expression was detected in a context
			where an expression is expected. Such contexts are manifold, i.e.,
			on the right-hand-side of an assignment operator, within a function
			call, in the condition of a do-while or while-do loop, etc.
			</p>
			<p>
			For example, the keyword <keyword>true</keyword> itself represents a
			valid expression. On the contrary, the keyword <keyword>while</keyword>
			cannot be part of an expression.
			</p>
		`,
		"children": []},
		{"id": "se-42",
		"content": `
			<p>
			A token that cannot initiate an expression was detected in a context
			where an expression is expected. Such contexts are manifold, i.e.,
			on the right-hand-side of an assignment operator, within a function
			call, in the condition of a do-while or while-do loop, etc.
			</p>
			<p>
			For example, integer, real and string tokens represents valid expressions.
			On the contrary, an expression cannot start with the token
			<code class="code">,</code> (a comma).
			</p>
		`,
		"children": []},
		{"id": "se-43",
		"content": `
			<p>
			A <a href="#/language/expressions/names">name</a> used to
			<a href="#/language/expressions/member-access">access a member</a>
			of an object or a namespace is a sequence of identifiers separated
			with dots. This error indicates that the sequence ends with a dot,
			and not with an identifier, as it should.
			</p>
		`,
		"children": []},
		{"id": "se-44",
		"content": `
			<p>
			Characters of strings and items of arrays and dictionaries are
			<a href="#/language/expressions/item-access">accessed with an index in square brackets</a>.
			This error indicates that the closing square bracket is missing
			after the index expression.
			</p>
		`,
		"children": []},
		{"id": "se-47",
		"content": `
			<p>
			Within a <a href="#/language/declarations/classes">class declaration</a>
			the keyword <keyword>this</keyword> refers to the object upon which
			a method acts. The keyword is only meaningful in contexts that do
			actually act on an object. The use of <keyword>this</keyword> in
			static functions and inner functions results in this error message.
			</p>
			<p>
			A second legal use of the <keyword>this</keyword> keyword is within an
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>.
			There it refers to the function itself, and hence allows the function
			to recursively call itself.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					function f()
					{
						print(this);          # okay
						var a = function ()
						{
							# print(this);    # error
						};
					}
					static function s()
					{
						# print(this);        # error
					}
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-48",
		"content": `
			<p>
			An <a href="#/language/statements/assignments">assignment</a> ends with
			a semicolon. This error indicates that the semicolon was not found after
			the expression on the right-hand-side of the assignment operator.
			</p>
			<p>
			Common reasons for this error are that
			<ul>
			<li>the programmer either forgot to put the semicolon, <b>often in the preceding line</b>, or</li>
			<li>the right-hand-side expression ends earlier than anticipated by the
			programmer, usually due to a mistake.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "se-49",
		"content": `
			<p>
			This error indicates that an <a href="#/language/expressions">expression</a>
			ended in an unexpected way. When
			<a href="#/language/statements/expressions">using an expression as a statement</a>,
			the expression must be terminated with a semicolon. Alternatively, the expression
			can be continued by appending a binary operator and a further expression.
			If these expectations are not met then this error is reported.
			</p>
			<p>
			Common reasons for this error are that
			<ul>
			<li>the programmer either forgot to put the semicolon, or</li>
			<li>the expression ends earlier than anticipated by the programmer,
			usually due to a mistake.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "se-50",
		"content": `
			<p>
			In a <a href="#/language/declarations/variables">variable declaration</a>,
			the names of all variables must be identifiers. This error indicates that
			a different type of <a href="#/language/syntax/tokens">token</a> was
			encountered instead.
			</p>
		`,
		"children": []},
		{"id": "se-51",
		"content": `
			<p>
			This error indicates that the basic syntax of a
			<a href="#/language/declarations/variables">variable declaration</a>
			is violated. Variables are separated with commas, the list closes with a
			semicolon, and each variable can have an initializer starting with an
			equals sign. Therefore the identifier must be followed by an equals sign,
			a comma, or a semicolon. Otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-51b",
		"content": `
			<p>
			This error indicates that the basic syntax of a
			<a href="#/language/declarations/variables">variable declaration</a>
			is violated. Variables are separated with commas, the list closes with a
			semicolon. Therefore the initializer must be followed by a comma or a
			semicolon. Otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-52",
		"content": `
			<p>
			A <a href="#/language/declarations/functions">function declaration</a>
			must have a name, which is an identifier. This error indicates that the
			name was not found after the <keyword>function</keyword> keyword.
			</p>
			<p>
			One possible cause of this error is the attempt to denote an anonymous
			function in an expression forming a statement. This does not work directly,
			since the <keyword>function</keyword> keyword triggers a function
			declaration, which is different from an anonymous function expression.
			The anonymous function can be enclosed in parentheses in order to ensure
			proper parsing as an expression.
			</p>
		`,
		"children": []},
		{"id": "se-53",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			can invoke the constructor of the super class with a special syntax,
			</p>
		`,
		"children": []},
		{"id": "se-54",
		"content": `
			<p>
			A <a href="#/language/declarations/classes">class declaration</a>
			contains an identifier acting as the name of the class. This error
			indicates that no identifier was found after the keyword
			<keyword>class</keyword>.
			</p>
		`,
		"children": []},
		{"id": "se-55",
		"content": `
			<p>
			An <a href="#/language/declarations/classes">access modifier in a class declaration</a>
			consists of one of the keywords <keyword>public</keyword>, <keyword>protected</keyword>,
			or <keyword>private</keyword>, followed by a colon. This error indicates that the colon
			is missing.
			</p>
		`,
		"children": []},
		{"id": "se-56",
		"content": `
			<p>
			All <a href="#/language/declarations/classes">members of a class</a>
			are subject to a visibility modifier, consisting of one of the keywords
			<keyword>public</keyword>, <keyword>protected</keyword>, or
			<keyword>private</keyword>, followed by a colon. This error indicates
			that a member declaration precedes the first visibility modifier.
			</p>
		`,
		"children": []},
		{"id": "se-57",
		"content": `
			<p>
			<a href="#/language/declarations/classes">Attributes of a class</a>
			can be initialized in their declaration by providing an initializer.
			This works for static as well as for non-static attributes. However,
			in contrast to global and local variables, the initializer must be
			a <a href="#/language/expressions/constants">constant</a>.
			</p>
		`,
		"children": []},
		{"id": "se-58",
		"content": `
			<p>
			All <a href="#/language/declarations/classes">members of a class</a>
			are subject to visibility settings. The constructor of a class always
			calls the constructor of the super class. This even holds for the
			default constructor, which is generated if no constructor is
			explicitly declared.
			</p>
			<p>
			If the super class has declared its constructor private then the
			sub-class cannot properly initialize the super class. Therefore
			inheriting a class with private constructor is not possible.
			</p>
		`,
		"children": []},
		{"id": "se-59",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			needs a <keyword>this</keyword> reference to the object to be initialized,
			therefore it cannot be static. This error indicates that the constructor
			was marked as static.
			</p>
		`,
		"children": []},
		{"id": "se-59b",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			must be unique, it cannot be overloaded. Remove all but one constructor
			to fix this error.
			</p>
		`,
		"children": []},
		{"id": "se-60",
		"content": `
			<p>
			The only members of a <a href="#/language/declarations/classes">class</a>
			that can be declared are attributes and methods. This error indicates that
			a class declaration found inside the scope of another class is declared
			static.
			</p>
		`,
		"children": []},
		{"id": "se-61",
		"content": `
			<p>
			The only members of a <a href="#/language/declarations/classes">class</a>
			that can be declared are attributes and methods. This error indicates that
			a <a href="#/language/directives/use">use directive</a> found inside the
			scope of another class is declared static.
			</p>
		`,
		"children": []},
		{"id": "se-62",
		"content": `
			<p>
			This error indicates that an unexpected entity was found inside a
			<a href="#/language/declarations/classes">class</a>. The class syntax
			demands that only access modifiers, attribute and method declarations,
			declarations of nested classes, and use-directives are allowed.
			</p>
		`,
		"children": []},
		{"id": "se-63",
		"content": `
			<p>
			As the error message states, a
			<a href="#/language/declarations/namespaces">namespace</a> can be
			declared only at global scope or nested within another namespace.
			It must not be declared at function of class scope. The error
			message indicates that this rule was violated.
			</p>
		`,
		"children": []},
		{"id": "se-64",
		"content": `
			<p>
			A <a href="#/language/declarations/namespaces">namespace declaration</a>
			contains an identifier acting as the name of the class. This error
			indicates that no identifier was found after the keyword
			<keyword>namespace</keyword>.
			</p>
		`,
		"children": []},
		{"id": "se-65",
		"content": `
			<p>
			<a href="#/language/directives/use">Use directives</a> can have two forms.
			This error occurs if the form starting with <keyword>from</keyword> does
			not contain the keyword <keyword>use</keyword> after the from-clause.
			</p>
		`,
		"children": []},
		{"id": "se-66",
		"content": `
			<p>
			In a <a href="#/language/directives/use">use directive</a>, an imported name
			can be remapped to a different name with an <keyword>as</keyword> clause.
			However, the same mechanism does not work when importing all name from a
			namespace. This error indicates that the attempt was made nevertheless.
			</p>
		`,
		"children": []},
		{"id": "se-67",
		"content": `
			<p>
			This error indicates that the <ebnf>identifier</ebnf> is missing after
			<keyword>as</keyword> in a <a href="#/language/directives/use">use directive</a>.
			</p>
		`,
		"children": []},
		{"id": "se-68",
		"content": `
			<p>
			In a <a href="#/language/directives/use">use directive</a>, multiple names
			or whole namespaces can be imported. The individual imports are separated
			with commas, and the overall use directive closes with a semicolon. Therefore
			each import must be followed either by a comma or by a semicolon. This error
			indicates that the above rule is violated.
			</p>
		`,
		"children": []},
		{"id": "se-69",
		"content": `
			<p>
			The error indicates that in an
			<a href="#/language/statements/if-then-else">if-then-else</a> conditional
			statement the keyword <keyword>then</keyword> is missing. This mistake is
			commonly made by programmers coming from C-style languages which do not
			have this keyword.
			</p>
		`,
		"children": []},
		{"id": "se-70",
		"content": `
			<p>
			A <a href="#/language/statements/for-loops">for loop</a> uses a loop
			variable to indicate its current iteration. If this variable is declared
			within the loop with the <keyword>var</keyword> keyword, then the variable
			name must be a plain <ebnf>identifier</ebnf>. The error message indicates
			that a non-identifier token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-71",
		"content": `
			<p>
			In a <a href="#/language/statements/for-loops">for loop</a> declaring its
			own loop variable, the keyword <keyword>in</keyword> must follow the loop
			variable declaration. This error indicates that some other token was
			encountered.
			</p>
		`,
		"children": []},
		{"id": "se-72",
		"content": `
			<p>
			In a <a href="#/language/statements/for-loops">for loop</a> after the
			container to loop over must be followed by the keyword <keyword>do</keyword>.
			This error indicates that some other token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-73",
		"content": `
			<p>
			If a <a href="#/language/statements/for-loops">for loop</a> does not use
			loop variable declared within the loop, then the expression following
			the keyword <keyword>for</keyword> could either be an externally declared
			loop variable or the container to iterate over. In the former case, the
			expression must be followed by <keyword>in</keyword>, in the latter case
			by <keyword>do</keyword>. The error message indicates that neither one
			was found.
			</p>
		`,
		"children": []},
		{"id": "se-74",
		"content": `
			<p>
			The syntax of a <a href="#/language/statements/do-while-loops">do-while loop</a>
			demands that the loop body is followed by the keyword <keyword>while</keyword>.
			This error message indicates that an different token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-75",
		"content": `
			<p>
			The syntax of a <a href="#/language/statements/do-while-loops">do-while loop</a>
			demands that the condition is followed by a semicolon.
			This error message indicates that an different token was encountered.
			It may indicate that the expression representing the loop condition
			is broken.
			</p>
		`,
		"children": []},
		{"id": "se-76",
		"content": `
			<p>
			The syntax of a <a href="#/language/statements/while-do-loops">while-do loop</a>
			demands that the condition is followed by the keyword <keyword>do</keyword>.
			This error message indicates that an different token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-77",
		"content": `
			<p>
			A <a href="#/language/statements/break-continue">break</a> statement
			can only appear inside a loop. This error message indicates that there
			is no loop surrounding the statement.
			</p>
		`,
		"children": []},
		{"id": "se-78",
		"content": `
			<p>
			A <a href="#/language/statements/break-continue">continue</a> statement
			can only appear inside a loop. This error message indicates that there
			is no loop surrounding the statement.
			</p>
		`,
		"children": []},
		{"id": "se-79",
		"content": `
			<p>
			A <a href="#/language/statements/return">return</a> statement returns
			the control flow from the current function back to the calling context.
			When doing so, it can also return a value, which then becomes the value
			of the function call expression. However, a constructor does not evaluate
			to an arbitrary expression and therefore cannot return a value. A return
			statement inside a constructor must not contain a return value, otherwise
			this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-80",
		"content": `
			<p>
			A <a href="#/language/statements/return">return</a> statement returns
			the control flow from the current function back to the calling context.
			When doing so, it can also return a value, which then becomes the value
			of the function call expression. When applied at global or namespace
			scope, the return statement ends the program. Since a program does not
			have a value, a return statement at global or namespace scope must not
			contain a return value, otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-81",
		"content": `
			<p>
			A <a href="#/language/statements/return">return</a> statement ends with
			a semicolon. The error message indicates that this is not the case.
			The most probably reason is that the return expression is broken.
			</p>
		`,
		"children": []},
		{"id": "se-81b",
		"content": `
			<p>
			A <a href="#/language/statements/break-continue">break</a> statement ends with
			a semicolon. The error message indicates that this is not the case.
			</p>
		`,
		"children": []},
		{"id": "se-81c",
		"content": `
			<p>
			A <a href="#/language/statements/break-continue">continue</a> statement ends with
			a semicolon. The error message indicates that this is not the case.
			</p>
		`,
		"children": []},
		{"id": "se-82",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-84",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-85",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-86",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-87",
		"content": `
			<p>
			A <a href="#/language/statements/throw">throw</a> statements ends with
			a semicolon. This error message indicates that the semicolon is missing.
			The most probably cause of this error is a bug in the expression preceding
			the semicolon.
			</p>
		`,
		"children": []},
		{"id": "se-88",
		"content": `
			<p>
			Curly braces can close
			<a href="#/language/statements/blocks">blocks of statements</a> and
			<a href="#/language/expressions/literals/dictionaries">dictionary literals</a>.
			This error indicates that a closing brace was found in a different
			context. The most common cause of this error is that the declaration
			or statement preceding the closing brace is broken.
			</p>
		`,
		"children": []},
		{"id": "se-89",
		"content": `
			<p>
			This error is reported if a keyword that cannot start a statement
			(like, e.g., <keyword>static</keyword>) was encountered where a
			statement was expected. This error has two common causes:
			<ul>
				<li>a keyword was used as an identifier, or</li>
				<li>the preceding statement is broken.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "se-90",
		"content": `
			<p>
			This error is reported if a token that cannot start a statement
			(like, e.g., <code class="code">+=</code>) was encountered where a
			statement was expected. This error usually indicates that the
			statement directly preceding the location where the error is
			reported is broken.
			</p>
		`,
		"children": []},
	]},
	{"id": "argument-mismatch",
	"name": "Argument Mismatch",
	"title": "Argument Mismatch",
	"content": `
		<p>
		Values passed into a function or operator can mismatch the needs
		and expectations of the function being called in several ways.
		Arguments can be of the wrong type, or their values can be in an
		invalid range. Errors in this category reflect such events.
		</p>
	`,
	"children": [
		{"id": "am-1",
		"content": `
			<p>
			A function specifies how many arguments it expects, but the formal
			function declaration does not specify which types can be processed.
			For example, the wait function expects the number of milliseconds
			to wait as an argument, which must be a number. If a value of
			unrelated type is passed, say, a dictionary, then the function
			reports this error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					wait(10);         # okay
					# wait("foo");    # error
					# wait({a: 2});   # error
				</tscript>
			</div>
			<p>
			Such errors occur for two frequent reasons.
			<ol>
			<li>The programmer passes positional
			arguments in the wrong order. For example, the function
			String.find expects a search key (string), a start position
			(integer), and a flag (boolean). If the programmer passes
			the start position first, then the function tries to
			interpret it as the search key. Since the value is not a
			string, the attempt fails and an error is reported.</li>
			<li>A variable or expression
			passed to a function as a parameter is of a type that is
			not expected by the programmer.</li>
			</ol>
			</p>
		`,
		"children": []},
		{"id": "am-2",
		"content": `
			<p>
			The <a href="#/language/expressions/unary-operators/minus">unary operator not</a>
			is only defined for boolean arguments. Applying unary not
			to a value of any other type results in this error.
			</p>
		`,
		"children": []},
		{"id": "am-3",
		"content": `
			<p>
			The <a href="#/language/expressions/unary-operators/plus">unary operator +</a>
			is only defined for numerical arguments. Applying unary plus
			to a value of any other type results in this error.
			</p>
		`,
		"children": []},
		{"id": "am-4",
		"content": `
			<p>
			The <a href="#/language/expressions/unary-operators/minus">unary operator -</a>
			is only defined for numerical arguments. Applying unary minus
			to a value of any other type results in this error.
			</p>
		`,
		"children": []},
		{"id": "am-5",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/addition">binary operator +</a>
			is applied to two types that cannot be added. The operator supports
			numeric types as well as string concatenation. All other operand
			types result in this error.
			</p>
		`,
		"children": []},
		{"id": "am-6",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/subtraction">binary operator -</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-7",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/multiplication">binary operator +</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-8",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/real-division">binary operator /</a>
			or the
			<a href="#/language/expressions/binary-operators/integer-division">binary operator \/\/</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-9",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/modulo">binary operator %</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-10",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/power">binary operator ^</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-11",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/addition">binary operator :</a>
			is applied to non-integer arguments.
			</p>
		`,
		"children": []},
		{"id": "am-12",
		"content": `
			<p>
			This error occurs if one of the binary operators
			<a href="#/language/expressions/binary-operators/and">and</a>,
			<a href="#/language/expressions/binary-operators/or">or</a>, or
			<a href="#/language/expressions/binary-operators/xor">xor</a>
			is applied to non-boolean non-integer arguments.
			</p>
		`,
		"children": []},
		{"id": "am-13",
		"content": `
			<p>
			This error occurs when a value is converted to an integer. The
			value is often a real, but it can also be a string that is
			interpreted as a real. If the real is not a finite value or if
			the string representation overflows to an infinite value then
			the error occurs. It is an error because integers cannot
			represent infinity and not-a-number, and also the integer
			overflow rules are unsuitable to resolve this situation.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var r = Real.inf();
					var s = "1e1000";
					# print(Integer(r));  # error: r is infinite
					# print(Integer(s));  # error: s parsed as Real
					                      # overflows to infinity
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "am-14",
		"content": `
			<p>
			This error occurs when a string is converted to an integer
			and the string value does not represent a number.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(Integer("42"));        # prints 42
					# print(Integer(""));        # error
					# print(Integer("hello"));   # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "am-15",
		"content": `
			<p>
			This error occurs when a value is divided by zero with the
			integer division operator <code class="code">\/\/</code> or
			with the modulo operator <code class="code">%</code>. In
			contrast to this behavior, the real division operator
			<code class="code">/</code> does not emit an error and instead
			produces an infinite result or not-a-number.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(3 / 0);      # prints Infinity
					# print(3 \/\/ 0);   # error
					# print(3 % 0);    # error
				</tscript>
			</div>
			<p>
			This error usually occurs when dividing by a variable or by
			the result of a complex expression the value of which was not
			foreseen by the programmer to be zero. Example:
			<tscript>
				var a = math.pi();
				var b = a - 2 * math.atan(1e100);  # numerically evaluates to zero
				# var c = math.e() % b;            # error
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "am-16",
		"content": `
			<p>
			Values are said to be ordered if they can be compared with operators
			<code class="code">&lt;</code>, <code class="code">&lt;=</code>,
			<code class="code">&gt;</code>, and <code class="code">&gt;=</code>.
			The rules for ordering values are found
			<a href="#/language/expressions/binary-operators/order">here</a>.
			For example, arrays can be ordered, while dictionaries cannot.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(1 < 2);               # prints true
					print("hello" > "world");   # prints false
					print([] < [42]);           # prints true
					# print({} < {a: 7});       # error: dictionaries are not ordered
				</tscript>
			</div>
			<p>
			This error occurs frequently if one of the operands of the comparison
			is of a type the programmer did not expect. E.g., a function like
			<a href="#/language/types/string">String.find</a> usually returns a
			number, but in occasional error conditions it returns null. Therefore
			a statement like
			<tscript>
				var s = "hello";
				# ... code that modifies s ...
				if s.find("e") < 10 then print("found e close to the beginning");
			</tscript>
			raises an error, but only if the search key is not found.
			</p>
		`,
		"children": []},
		{"id": "am-16b",
		"content": `
			<p>
			Values are said to be ordered if they can be compared with operators
			<code class="code">&lt;</code>, <code class="code">&lt;=</code>,
			<code class="code">&gt;</code>, and <code class="code">&gt;=</code>.
			The rules for ordering values are found
			<a href="#/language/expressions/binary-operators/order">here</a>.
			For example, arrays can be ordered, while dictionaries cannot.
			In most cases, values of different types cannot be ordered. Integer
			and Real are exceptions:
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(3 < 3.14159);        # prints true
					# print(3 < true);         # error: cannot order integer and boolean
				</tscript>
			</div>
			<p>
			This error occurs frequently if one of the operands of the comparison
			is of a type the programmer did not expect. E.g., a function like
			<a href="#/language/types/string">String.find</a> usually returns a
			number, but in occasional error conditions it returns null. Therefore
			a statement like
			<tscript>
				var s = "hello";
				# ... code that modifies s ...
				if s.find("e") < 10 then print("found e close to the beginning");
			</tscript>
			raises an error, but only if the search key is not found.
			</p>
		`,
		"children": []},
		{"id": "am-17",
		"content": `
			<p>
			When calling the Array constructor with an integer as the first
			argument, an array of the given size is created. If this size is
			negative then this error is reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a = Array(3, false);      # [false, false, false]
					# var b = Array(-5, false);   # error
				</tscript>
			</div>
			<p>
			This error occurs if the expression controlling the array size
			happens to become negative, which was usually not anticipated by
			the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-18",
		"content": `
			<p>
			The <a href="#/language/types/array">Array.insert</a> function
			takes a position within the array as its argument. The position
			must neither be negative nor exceed the array length. If it does,
			then this error is reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a = [6, "foo", true];
					a.insert(3, null);       # works, inserts at the end
					# a.insert(-2, false);   # error, negative position
					# a.insert(10, "bar");   # error, position beyond the end
				</tscript>
			</div>
			<p>
			This error occurs if the expression controlling the array position
			happens to take values not anticipated by the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-18b",
		"content": `
			<p>
			The <a href="#/language/types/array">Array.pop</a> function removes
			the last item of the array, which is returned. If the array is
			empty and hence there is no item to remove and return then this
			error is reported.
			</p>
		`,
		"children": []},
		{"id": "am-19",
		"content": `
			<p>
			The <a href="#/language/types/array">Array.sort</a> function can
			sort the array according to a user-specificed order relation,
			defined by the 'comparator' function passed as an argument to
			Array.sort. Given two items as arguments, this function must
			return a numeric value. If the value is non-numeric, then this
			error is reported.
			</p>
		`,
		"children": []},
		{"id": "am-20",
		"content": `
			<p>
			This error is reported if the items of a
			<a href="#/language/types/string">string</a> are
			<a href="#/language/expressions/item-access">accessed</a>
			with an invalid index of key type. Valid index types are
			integer and range.
			</p>
		`,
		"children": []},
		{"id": "am-21",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a>
			a single character of a <a href="#/language/types/string">string</a>
			as an integer code, the index must be a valid position within the
			string. This error indicates that the index is negative.
			</p>
		`,
		"children": []},
		{"id": "am-22",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a>
			a single character of a <a href="#/language/types/string">string</a>
			as an integer code, the index must be a valid position within the
			string. This error indicates that the index exceeds the valid range,
			which is upper bounded by the string size.
			</p>
		`,
		"children": []},
		{"id": "am-23",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an array, a valid (zero-based) index is neither negative, not does it
			exceed the size of the array. This error indicates that the index is
			negative. This error is usually caused by an expression evaluating to a
			negative number, which was not anticipated by the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-24",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an <a href="#/language/types/array">array</a>, a valid (zero-based)
			index is neither negative, not does it exceed the size of the array.
			This error indicates that the index is at least at large as the array size.
			The error is usually caused by an expression evaluating to a too large
			number, which was not anticipated by the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-25",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an <a href="#/language/types/array">array</a>, a valid index is of
			type integer or range. If the expression is on the left-hand-side of an
			assignment operator, then the only valid index type is an integer. This
			error indicates that the index expression evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-26",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an <a href="#/language/types/array">array</a>, a valid index is of
			type integer or range. This error indicates that the index expression
			evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-27",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/dictionary">dictionary</a>, the index
			must be a key of the dictionary. This error indicates that the index was
			not found as a key in the dictionary.
			</p>
		`,
		"children": []},
		{"id": "am-28",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/dictionary">dictionary</a>, a valid key
			is of type string. This error indicates that the index expression
			evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-29",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/range">range</a>, the index must be a
			valid index of an array representing the elements of the range. This
			means that it must not be negative, and it must be less than the size of
			the range. This error indicates that the index is outside these bounds.
			</p>
		`,
		"children": []},
		{"id": "am-30",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/range">range</a>, the index must be a of
			type integer or range. This error indicates that the index expression
			evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-31",
		"content": `
			<p>
			The <a href="#/language/expressions/item-access">access operator</a>
			provides access to the items of a container. The only types supporting
			this mechanism are string, array, dictionary, and range. This error
			indicates that it was attempted to access an item of a different type.
			</p>
		`,
		"children": []},
		{"id": "am-31b",
		"content": `
			<p>
			The <a href="#/language/expressions/item-access">access operator</a>
			provides access to the items of a container. The only types supporting
			this mechanism when used on the left-hand-side of an assignment are
			array and dictionary. This error indicates that it was attempted to
			set an item of a different type.
			</p>
		`,
		"children": []},
		{"id": "am-32",
		"content": `
			<p>
			The left-hand side of an
			<a href="#/language/statements/assignments">assignment operator</a>
			is an expression. However, not all expressions can be assigned to.
			This error indicates that it was attempted to assign to an expression
			that does not refer to a variable in which the result of the
			right-hand-side can be stored.
			</p>
		`,
		"children": []},
		{"id": "am-33",
		"content": `
			<p>
			The condition in an
			<a href="#/language/statements/if-then-else">if-then-else</a>
			statement decides whether the then-branch or the else-branch is
			executed. The expression must evaluate to a
			<a href="#/language/types/boolean">boolean</a> value, otherwise
			this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-34",
		"content": `
			<p>
			A <a href="#/language/statements/for-loops">for-loop</a> iterates
			over the items of a range or array. If the expression defining the
			container evaluates to a different type then this error is emitted.
			</p>
		`,
		"children": []},
		{"id": "am-35",
		"content": `
			<p>
			A <a href="#/language/statements/for-loops">for-loop</a> stores
			the current item of the container it iterates over in a variable.
			It this variable is not declared inside the loop, then an arbitrary
			name can be provided. This name must refer to a variable, otherwise
			this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-36",
		"content": `
			<p>
			The condition in a
			<a href="#/language/statements/do-while-loops">do-while loop</a>
			decides whether to stop or to continue the loop. The expression
			must evaluate to a <a href="#/language/types/boolean">boolean</a>
			value, otherwise this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-37",
		"content": `
			<p>
			The condition in a
			<a href="#/language/statements/while-do-loops">while-do loop</a>
			decides whether to stop or to continue the loop. The expression
			must evaluate to a <a href="#/language/types/boolean">boolean</a>
			value, otherwise this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-38",
		"content": `
			<p>
			Loading a value with the standard library's
			<code class="code">load</code> function failed because the key does
			not exist.
			</p>
			<p>
			This error occurs when trying to load a value from a key that was
			not saved before. Use the <code class="code">exists</code> function
			to check whether a key exists.
			</p>
		`,
		"children": []},
		{"id": "am-39",
		"content": `
			<p>
			Saving a value with the standard library's <code class="code">save</code>
			function failed because the value is not a
			<a target="_blank" href="http://json.org/">JSON</a> constant.
			Values of type Null, Boolean, Integer, Real, and String are legal,
			as well as Array and Dictionary, if all of the values stored
			therein are legal JSON values and the data structure is an
			acyclic graph (a tree).
			</p>
			<p>
			This error occurs if the value to be stored is or contains a value
			of a disallowed type, like a Range, Function, Type, or a user-defined
			class. This error is also reported if the data structure is recursive,
			i.e., if an array or dictionary contains itself as a value, possibly
			indirectly.
			</p>
		`,
		"children": []},
		{"id": "am-40",
		"content": `
			<p>
			The given event name is not known.
			</p>
			<p>
			The most probable reason for this error is a misspelled event name.
			</p>
		`,
		"children": []},
		{"id": "am-41",
		"content": `
			<p>
			The function registered as an event handler is expected to take exactly
			one argument, the event object. A common way to declare event handlers
			is as follows:
			<tscript>
				function onKey(event)
				{
					print(event.key);
				}
				setEventHandler("canvas.keydown", onKey);
				setEventHandler("canvas.keyup", function(event) { print(event.key); });
			</tscript>
			The event parameter must be present even for events emitting an empty
			event dictionary.
			</p>
			<p>
			This error is raised if the event handler takes no arguments or more
			than one argument.
			</p>
		`,
		"children": []},
		{"id": "am-42",
		"content": `
			<p>
			The function <i>deepcopy</i> creates a deep copy of a container.
			If the container holds other containers as values then they are
			deep copied, too. The copied data structure must fulfill the
			following requirements:
			<ul>
				<li>It must not contain functions.</li>
				<li>It must not contain objects.</li>
				<li>It must not contain a loop, i.e., contain a value as its own sub-value.</li>
			</ul>
			This error message indicates that the first or second property
			is not fulfilled.
			</p>
		`,
		"children": []},
		{"id": "am-43",
		"content": `
			<p>
			The error indicates that a recursive data structure was passed
			to a function that cannot handle this case since it would result
			in an infinite recursion, as illustrated by the following example:
			<tscript>
				var a = [];
				a.push(a);
				# print(a);          # error; would result in infinite recursion
			</tscript>
			</p>
		`,
		"children": []},
	]},
	{"id": "name",
	"name": "Name Lookup Errors",
	"title": "Name Lookup Errors",
	"content": `
		<p>
		A <a href="#/language/expressions/names">name</a> refers to a declaration
		according to the name lookup rules. The errors in this category indicate
		that something went wrong either when declaring or when resolving a name.
		</p>
	`,
	"children": [
		{"id": "ne-1",
		"content": `
			<p>
			When providing named arguments in a function call, each parameter
			can be specified only once. This error indicates that a parameter
			was specified multiple times. This includes the case that the
			parameter was specified as a positional and as a names argument.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function f(a, b, c=0) { }
					f(3, 5);           # okay
					# f(3, 5, b=8);    # error
				</tscript>
			</div>
			<p>
		`,
		"children": []},
		{"id": "ne-2",
		"content": `
			<p>
			When calling a function with named parameters then the function to be
			called must have a parameter with the given name &ndash; otherwise
			this error is reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function f(a, b = 0) { }
					f(a=3);      # okay
					# f(x=4);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-3",
		"content": `
			<p>
			A function cannot be called with more arguments than it has
			parameters. An attempt to do so results in this error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a, b, c) { }
				f(3, 5, 8);         # okay
				# f(3, 5, 8, 2);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-4",
		"content": `
			<p>
			When calling a function, all (non-default) parameters must be
			specified by providing corresponding (positional or named)
			arguments. Failure to specify a parameter results in this error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a, b, c) { }
				f(3, 5, 8);   # okay
				# f(3, 8);    # error: c not specified
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-5",
		"content": `
			<p>
			This error means that the given name cannot be resolved
			since no declaration of the given name exists. The three most
			common causes of this error are
			<ol>
				<li>the programmer forgot to declare the name,</li>
				<li>the name was mistyped, and</li>
				<li>the programmer forgot to make the name available with a use directive.</li>
			</ol>
			</p>
		`,
		"children": []},
		{"id": "ne-6",
		"content": `
			<p>
			In certain situations a name is resolved into a variable that cannot
			be accessed from the current context. This error refers to the case
			that the variable requires a <keyword>this</keyword> argument that
			is not present, i.e., when accessing a non-static attribute from
			within a nested function or class.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					var x;
					class B
					{
					public:
						static function f()
						{
							# print(x);   # error
						}
					}
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-7",
		"content": `
			<p>
			In certain situations a name is resolved into a variable that cannot
			be accessed from the current context. This error refers to the case
			that the name refers to a local variable in an outer function.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				function f()
				{
					var a = 7;
					function g()
					{
						# print(a);   # error
					}
					var h = function[a]()
					{
						print(a);     # okay
					};
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-8",
		"content": `
			<p>
			In certain situations a name is resolved into a variable that cannot
			be accessed from the current context. This error refers to the case
			that the only candidate to which the name could resolve is a private
			member up a (direct or indirect) super class.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				class A
				{
				private:
					var x;
				}
				class B : A
				{
				public:
					function f()
					{
						# print(x);   # error
					}
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-9",
		"content": `
			<p>
			This error indicates that a name was not found inside a namespace.
			For a name of the form <code class="ebnf">identifier "." identifier</code>
			with the left identifier referring to a namespace, the right identifier
			is looked up inside that namespace. If the name is not found in there
			then this error is reported.
			</p>
		`,
		"children": []},
//		{"id": "ne-10",
//		"content": `
//			<p>
//			When parsing an expression, a name is expected to resolve to a
//			declaration that can be used as a value. This works for variables,
//			function and types, but not for namespaces and non-static members.
//			This error indicates that a name refers to a declaration that
//			cannot be used as a value.
//			</p>
//		`,
//		"children": []},
		{"id": "ne-11",
		"content": `
			<p>
			This error indicates that a name refers to a namespace, while a
			different entity was expected.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				namespace A
				{ }
				class B # : A      # error; super class expected, namespace found
				{ }
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-12",
		"content": `
			<p>
			The <a href="#/language/expressions/member-access">member access operator .</a>
			references a public member of a type. If the left-hand-side evaluates
			to a type then access is restricted to public static members.
			This error is reported if neither the type nor any of its super
			classes has a public static member of the given name.
			</p>
		`,
		"children": []},
		{"id": "ne-13",
		"content": `
			<p>
			The <a href="#/language/expressions/member-access">member access operator .</a>
			references a public member of a type. This error is reported if neither
			the type nor any of its super classes has a public member of the given
			name.
			</p>
		`,
		"children": []},
		{"id": "ne-14",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a variable name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-15",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a function name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-16",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a parameter name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope. Therefore a function
			parameter can conflict with a
			<a href="#/language/expressions/literals/anonymous-functions">closure</a>
			parameter, which is declared first.
			</p>
		`,
		"children": []},
		{"id": "ne-17",
		"content": `
			<p>
			All <a href="#/language/expressions/literals/anonymous-functions">closure</a>
			parameters belong to the same scope, therefore they must be unique.
			If two closure parameters are declared with same name are declared
			then this error is reported.
			</p>
		`,
		"children": []},
		{"id": "ne-18",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a class name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-19",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a namespace name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-21",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			can invoke the constructor of the super class with a special syntax
			starting with a colon after the parameter list. Calling the super class
			constructor makes sense only if the class has a super class. This error
			indicates that the super class constructor is called although there does
			not exist a super class.
			</p>
		`,
		"children": []},
		{"id": "ne-22",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">super class of a class</a>
			is provided as a name. The name must refer to a type, otherwise this
			error is reported.
			</p>
		`,
		"children": []},
		{"id": "ne-23",
		"content": `
			<p>
			When importing all name from a namespace with a
			<a href="#/language/directives/use">use directive</a> of the form
			<ebnf>"use" "namespace" use-name</ebnf>, then the namespace is
			provided as a name. This is done in the assumption that the name
			indeed refers to a namespace, otherwise this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "ne-24",
		"content": `
			<p>
			When importing a name from a namespace with a
			<a href="#/language/directives/use">use directive</a>, then the
			names are made available in the current scope as if the declarations
			were members of the scope. Since names of declarations in a scope
			must be unique, this can trigger conflicts. This error indicates that
			the attempt to import a name creates such a conflict, since the name
			was already taken by a declaration or by another name import.
			</p>
			<p>
			The often easiest way to fix this problem is to remove the use directive
			and to access the declaration by its full name. When importing a single
			name, a better solution is to import the conflicting declaration under
			an alias name.
			</p>
		`,
		"children": []},
		{"id": "ne-25",
		"content": `
			<p>
			It was attempted to call a constructor of a type with a protected or
			private constructor from outside the scope of the class, and for a
			protected constructor, from outside the scope of its sub-classes.
			This violates the member access rules explained
			< href="#/language/declarations/classes">here</a>.
			</p>
			<p>
			An easy fix is to make the constructor public. However, this error
			usually indicates that objects of the given type should not ever be
			created directly from outside the class.
			</p>
		`,
		"children": []},
		{"id": "ne-26",
		"content": `
			<p>
			It was attempted to use a class as its own super class.
			That's not possible because inheritance chains must be cycle-free.
			</p>
		`,
		"children": []},
	]},
	{"id": "logic",
	"name": "Logic Errors",
	"title": "Logic Errors",
	"content": `
		The errors in this category indicate a severe bug in the logic of a
		TScript program.
	`,
	"children": [
		{"id": "le-1",
		"content": `
			<p>
			This error indicates that too many function calls were nested.
			It is often caused by an infinite recursion.
			</p>
		`,
		"children": []},
		{"id": "le-2",
		"content": `
			<p>
			The function <code class="code">enterEventMode</code> was called,
			directly or indirectly, from within an event handler. Event
			handling mode cannot be nested, hence this error is reported.
			</p>
		`,
		"children": []},
		{"id": "le-3",
		"content": `
			<p>
			This error indicates that the function
			<code class="code">quitEventMode</code> was called although the
			program was not in event handling mode.
			</p>
		`,
		"children": []},
	]},
	{"id": "user",
	"name": "User-Defined Errors",
	"title": "User-Defined Errors",
	"content": `
		This section collects errors reported by the program itself, not by
		the TScript programming language and its runtime environment.
	`,
	"children": [
		{"id": "ue-1",
		"content": `
			<p>
			The library function <a href="#/library/core">assert</a> can be
			called in order to report an error in case a condition is violated.
			The error is reported by user or library code, not by the core language.
			</p>
		`,
		"children": []},
		{"id": "ue-2",
		"content": `
			<p>
			The library function <a href="#/library/core">error</a> can be
			called in order to report an error. The error is reported by user
			or library code, not by the core language.
			</p>
		`,
		"children": []},
		{"id": "ue-3",
		"content": `
			<p>
			If an exception is <a href="#/language/statements/throw">thrown</a>
			and not <a href="#/language/statements/try-catch">caught</a> then
			the program stops and this error message is reported. This is often
			unintended by the programmer and hints at an internal error that
			should be fixed.
			</p>
		`,
		"children": []},
	]},
	{"id": "style",
	"name": "Style Errors",
	"title": "Style Errors",
	"content": `
		This section collects errors reported by the style checker. They are not
		programming errors in a strict sense. Yet, if configured to do so,
		TScript reports style errors to enforce good programming style. This
		behavior can be changed in the configuration dialog.
	`,
	"children": [
		{"id": "ste-1",
		"content": `
			<p>
			This error is reported if the indentation of a program is
			inconsistent. The indentation in each block must be larger
			than in its surrounding block, and it must be consistent
			within the block.
			<tscript>
			print("hello");
			{
			print("world");   # wrong; inner block indentation must
			                  # exceed outer block indentation
			}
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "ste-2",
		"content": `
			<p>
			This error is reported if the indentation of program block
			markers is inconsistent, i.e., if the indentation of the line
			containing an opening brace differs from the indentation of
			the line with the corresponding closing brace:
			<tscript>
			if true then {
				print("true!");
				}   # This brace must not be indented
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "ste-3",
		"content": `
			<p>
			This error can occur when a variable, function, or namespace name
			starts with a capital letter. By convention, these names start with
			a lowercase letter or an underscore.
			</p>
			<tscript>
			{
				var foo = 7;   # okay
				var Bar = 8;   # wrong; easily mistaken for a type
			}
			</tscript>
		`,
		"children": []},
		{"id": "ste-4",
		"content": `
			<p>
			This error can occur when a class name starts with a
			lowercase letter or an underscore. By convention, TScript
			class names start with a capital letter.
			</p>
			<tscript>
			{
				class Foo {}   # okay
				class bar {}   # wrong
			}
			</tscript>
		`,
		"children": []},
	]},
	{"id": "internal",
	"name": "Internal Errors",
	"title": "Internal Errors",
	"content": `
		This section collects errors reported by TScript about itself.
		Such errors <i>should of course never occur</i>, however, it is
		clear that bugs are unavoidable.
	`,
	"children": [
		{"id": "ie-1",
		"content": `
			<p>
			This error is reported if the TScript parser fails to
			operate as expected. This is not the fault of the program
			written by the user, but rather a bug on the side of
			TScript.
			</p>
		`,
		"children": []},
		{"id": "ie-2",
		"content": `
			<p>
			This error is reported if the TScript interpreter fails to
			operate as expected. This is not the fault of the program
			written by the user, but rather a bug on the side of
			TScript or its standard library.
			</p>
		`,
		"children": []},
	]},
]
});
"use strict"

if (doc) doc.children.push({
"id": "cheatsheet",
"name": "Cheat Sheet",
"title": "Cheat Sheet",
"content": `
	<div class="flex">
	<table class="nicetable">
	<tr><th><a href="#/language/expressions/literals">literals</a></th><th>example</th></tr>
	<tr><td><a href="#/language/expressions/literals/integers">integer</a></td><td><code>42</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/reals">real</a></td><td><code>6.62607015e-34</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/strings">string</a></td><td><code>"This is a test.\\nNext line."</code></td></tr>
	<tr><td>range</td><td><code>20:30</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/arrays">array</a></td><td><code>["foo", 42, false];</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/dictionaries">dictionary</a></td><td><code>{foo: 42, "bar-bar": false}</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/statements">control structures</a></th><th>example / syntax</th></tr>
	<tr><td><a href="#/language/statements/if-then-else">condition</a></td><td><code>if i == 0 then { ... } else { ... }</code></td></tr>
	<tr><td><a href="#/language/statements/for-loops">for-loop</a></td><td><code>for var i in 0:n do { ... }</code></td></tr>
	<tr><td><a href="#/language/statements/while-do-loops">while-do-loop</a></td><td><code>while not happy do { ... }</code></td></tr>
	<tr><td><a href="#/language/statements/do-while-loops">do-while-loop</a></td><td><code>do { ... } while not happy;</code></td></tr>
	<tr><td><a href="#/language/statements/try-catch">try-catch-block</a></td><td><code>try { ... } catch var ex do { ... }</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/syntax/comments">comments</a></th><th>example</th></tr>
	<tr><td>line comment</td><td><code># comment</code></td></tr>
	<tr><td>range comment</td><td><code>#* comment *#</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/declarations/variables">variables</a></th><th>example</th></tr>
	<tr><td>declare variable(s)</td><td><code>var a, b;</code></td></tr>
	<tr><td>declare and initialize</td><td><code>var c = 7;</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th>functions</th><th>example / syntax</th></tr>
	<tr><td><a href="#/language/declarations/functions">function</a> or <a href="#/language/declarations/classes">method</a></td><td><code>function myfunc (...) { ... }</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/anonymous-functions">lambda function</a></td><td><code>function (...) { ... }</code></td></tr>
	<tr><td>enclosing <a href="#/language/expressions/literals/anonymous-functions">lambda function</a></td><td><code>function [...] (...) { ... }</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th>namespaces</th><th>example / syntax</th></tr>
	<tr><td>define <a href="#/language/declarations/namespaces">namespace</a></td><td><code>namespace myspace { ... }</code></td></tr>
	<tr><td><a href="#/language/directives/use">import</a> specific name(s)</td><td><code>from myspace use foo, bar;</code></td></tr>
	<tr><td><a href="#/language/directives/use">import</a> whole namespace</td><td><code>use namespace myspace;</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/library">standard library</a></th><th>topic</th></tr>
	<tr><td><a href="#/library/core">code functions</a></td><td>messages, time, errors, files, events</td></tr>
	<tr><td><a href="#/library/math">math functions</a></td><td>e.g., sine and square root</td></tr>
	<tr><td><a href="#/library/turtle">turtle graphics</a></td><td>simple graphics</td></tr>
	<tr><td><a href="#/library/canvas">canvas graphics</a></td><td>powerful 2D graphics</td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/declarations/classes">classes</a></th><th>example / syntax</th></tr>
	<tr><td>define class</td><td><code>class MyStuff { ... }</code></td></tr>
	<tr><td>define subclass</td><td><code>class MyCoolStuff : MyStuff { ... }</code></td></tr>
	<tr><td>constructor</td><td><code>constructor (...) { ... }</code></td></tr>
	<tr><td>constructor calling super class</td><td><code>constructor (...) : super(...) { ... }</code></td></tr>
	<tr><td>visibility sections</td><td><code>public:</code><br/><code>protected:</code><br/><code>private:</code></td></tr>
	<tr><td>class-related keywords</td><td><code>static</code>, <code>this</code>, <code>super</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/types">data type</a></th><th>values</th></tr>
	<tr><td><a href="#/language/types/null"><code>Null</code></a></td><td><code>null</code></td></tr>
	<tr><td><a href="#/language/types/boolean"><code>Boolean</code></a></td><td><code>true</code>, <code>false</code></td></tr>
	<tr><td><a href="#/language/types/integer"><code>Integer</code></a></td><td>signed 32-bit integers</td></tr>
	<tr><td><a href="#/language/types/real"><code>Real</code></a></td><td>floating point numbers</td></tr>
	<tr><td><a href="#/language/types/string"><code>String</code></a></td><td>text</td></tr>
	<tr><td><a href="#/language/types/array"><code>Array</code></a></td><td>ordered container with integer keys</td></tr>
	<tr><td><a href="#/language/types/dictionary"><code>Dictionary</code></a></td><td>associative container with string keys</td></tr>
	<tr><td><a href="#/language/types/function"><code>Function</code></a></td><td>function, lambda function, method</td></tr>
	<tr><td><a href="#/language/types/range"><code>Range</code></a></td><td>range of integers, <code>from:to</code></td></tr>
	<tr><td><a href="#/language/types/type"><code>Type</code></a></td><td>description of a type</td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/expressions/precedence">operator</a></th><th>meaning</th></tr>
	<tr><td><a href="#/language/expressions/binary-operators/addition"><code>+</code></a></td><td>addition</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/subtraction"><code>-</code></a></td><td>negation, subtraction</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/multiplication"><code>*</code></a></td><td>multiplication</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/real-division"><code>/</code></a></td><td>real division</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/integer-division"><code>//</code></a></td><td>integer division</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/modulo"><code>%</code></a></td><td>modulo</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/power"><code>^</code></a></td><td>power</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/equality"><code>==</code>, <code>!=</code></a></td><td>equality</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/order"><code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code></a></td><td>order comparison</td></tr>
	<tr><td><a href="#/language/expressions/unary-operators/not"><code>not</code></a></td><td>logical or bitwise not</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/and"><code>and</code></a></td><td>logical or bitwise and</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/or"><code>or</code></a></td><td>logical or bitwise or</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/xor"><code>xor</code></a></td><td>logical or bitwise exclusive or</td></tr>
	</table>
	</div>
`,
"children": [],
});
"use strict"

if (doc) doc.children.push({
"id": "legal",
"name": "Legal Information",
"title": "Legal Information",
"content": `
	<p>
	This is the reference implementation of the TScript programming language.
	The software/website is provided under an
	<a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/MIT_License\">MIT license</a>.
	</p>

	<h2>License</h2>
	<p>
	Copyright (C) by Tobias Glasmachers.
	</p>
	<p>
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the \"Software\"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	</p>
	<p>
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	</p>
	<p>
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	</p>

	<h2>Acknowledgments</h2>
	<p>
	The TScript IDE uses the following libraries:
	<ul>
		<li>
			The <a target=\"_blank\" href=\"https://codemirror.net\">CodeMirror</a>
			editor is used under an
			<a target=\"_blank\" href=\"https://codemirror.net/LICENSE\">MIT license</a>.
		</li>
		<li>
			The <a target=\"_blank\" href=\"http://interactjs.io/\">interact</a>
			library is used under an
			<a target=\"_blank\" href=\"https://github.com/taye/interact.js/blob/master/LICENSE\">MIT license</a>.
		</li>
	</ul>
	Thanks to <a href="https://github.com/manuel-fischer">Manuel Fischer</a> for contributions.
	</p>
`,
"children": [],
});
"use strict";

///////////////////////////////////////////////////////////
// IDE for TScript development
//

let ide = (function() {
if (window.location.search != "") return null;

let module = {};

function guid()
{
	return (((1 + Math.random()) * 0x10000000000) | 0).toString(16).substring(1)
			+ "-"
			+ (((new Date()).getTime() * 1000 | 0) % 0x1000000 + 0x1000000).toString(16).substring(1);
}

function makeMarker()
{
	let marker = document.createElement("span");
	marker.style.color = "#a00";
	marker.innerHTML = "\u25CF";
	return marker;
};

function relpos(element, x, y)
{
	while (element)
	{
		x -= element.offsetLeft;
		y -= element.offsetTop;
		element = element.offsetParent;
	}
	return {"x": x, "y": y};
}

// manage documentation container or window
module.onDocumentationClick = null;
module.documentationWindow = null;
function showdoc(path)
{
	if (! path) path = "";
	if (module.onDocumentationClick)
	{
		// notify a surrounding application of a doc link click
		module.onDocumentationClick(path);
	}
	else
	{
		// open documentation in a new window; this enables proper browser navigation
		if (module.documentationWindow)
		{
			module.documentationWindow.close();
			module.documentationWindow = null;
		}
		let fn = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
		module.documentationWindow = window.open(fn + "?doc" + path, 'TScript documentation');
	}
}


// document properties
module.document = {
			filename: "",     // name in local storage, or empty string
			dirty: false,     // does the state differ from the last saved state?
		},


// current interpreter, non-null after successful parsing
module.interpreter = null;


// set the cursor in the editor; line is 1-based, ch (char within the line) is 0-based
let setCursorPosition = function(line, ch)
{
	if (ch === undefined) ch = 0;
	module.sourcecode.setCursor(line-1, ch);
	module.sourcecode.focus();
//	module.sourcecode.scrollIntoView({"line": line-1, "ch": 0}, 40);
	let s = module.sourcecode.getScrollInfo();
	let y = module.sourcecode.charCoords({"line": line-1, "ch": 0}, "local").top;
	let h = module.sourcecode.getScrollerElement().offsetHeight;
	if (y < s.top + 0.1 * s.clientHeight || y >= s.top + 0.9 * s.clientHeight)
	{
		y = y - 0.5 * h - 5;
		module.sourcecode.scrollTo(null, y);
	}
};

let text2html = function(s)
{
	return s.replace(/&/g, "&amp;")
	        .replace(/</g, "&lt;")
	        .replace(/>/g, "&gt;")
	        .replace(/"/g, "&quot;")
	        .replace(/'/g, "&#039;");
}

const type2css = ["ide-keyword", "ide-keyword", "ide-integer", "ide-real", "ide-string", "ide-collection", "ide-collection", "ide-builtin", "ide-builtin", "ide-builtin", "ide-builtin"];

// This function defines the stack trace tree.
function stackinfo(value, node_id)
{
	let ret = { "children": [], "ids": [] };
	if (! module.interpreter) return ret;

	if (value === null)
	{
		for (let i=module.interpreter.stack.length-1; i>=0; i--)
		{
			ret.children.push({
					"nodetype": "frame",
					"index": i,
					"frame": module.interpreter.stack[i],
				});
			ret.ids.push("/" + i);
		}
	}
	else
	{
		if (! value.hasOwnProperty("nodetype")) throw "[stacktree.update] missing value.nodetype";
		if (value.nodetype == "frame")
		{
			ret.opened = true;
			let func = value.frame.pe[0];
			ret.element = document.createElement("span");
			tgui.createElement({
					"type": "span",
					"parent": ret.element,
					"text": "[" + value.index + "] ",
					"classname": "ide-index",
				});
			tgui.createText(func.petype + " " + TScript.displayname(func), ret.element);
			if (value.frame.object)
			{
				ret.children.push({
						"nodetype": "typedvalue",
						"index": "this",
						"typedvalue": value.frame.object,
					});
				ret.ids.push(node_id + "/this");
			}
			for (let i=0; i<value.frame.variables.length; i++)
			{
				if (! value.frame.variables[i]) continue;
				ret.children.push({
						"nodetype": "typedvalue",
						"index": TScript.displayname(func.variables[i]),
						"typedvalue": value.frame.variables[i],
					});
				ret.ids.push(node_id + "/" + func.variables[i].name);
			}
			if (value.frame.temporaries.length > 0)
			{
				ret.children.push({
						"nodetype": "temporaries",
						"index": "temporaries",
						"frame": value.frame,
					});
				ret.ids.push(node_id + "/<temporaries>");
			}
		}
		else if (value.nodetype == "typedvalue")
		{
			ret.opened = false;
			ret.element = document.createElement("span");

			let s = ret.opened ? value.typedvalue.type.name : TScript.previewValue(value.typedvalue);
			if (value.typedvalue.type.id == TScript.typeid_array)
			{
				for (let i=0; i<value.typedvalue.value.b.length; i++)
				{
					ret.children.push({
							"nodetype": "typedvalue",
							"index": i,
							"typedvalue": value.typedvalue.value.b[i],
						});
					ret.ids.push(node_id + "/" + i);
				}
				s = "Array(" + ret.children.length + ") " + s;
			}
			else if (value.typedvalue.type.id == TScript.typeid_dictionary)
			{
				for (let key in value.typedvalue.value.b)
				{
					if (value.typedvalue.value.b.hasOwnProperty(key))
					{
						ret.children.push({
								"nodetype": "typedvalue",
								"index": key,
								"typedvalue": value.typedvalue.value.b[key],
							});
						ret.ids.push(node_id + "/" + key);
					}
				}
				s = "Dictionary(" + ret.children.length + ") " + s;
			}
			else if (value.typedvalue.type.id == TScript.typeid_function)
			{
				if (value.typedvalue.value.b.hasOwnProperty("object"))
				{
					ret.children.push({
							"nodetype": "typedvalue",
							"index": "this",
							"typedvalue": value.typedvalue.value.b.object,
						});
					ret.ids.push(node_id + "/this");
				}
				if (value.typedvalue.value.b.hasOwnProperty("enclosed"))
				{
					for (let i=0; i<value.typedvalue.value.b.enclosed.length; i++)
					{
						ret.children.push({
								"nodetype": "typedvalue",
								"index": value.typedvalue.value.b.func.closureparams[i].name,
								"typedvalue": value.typedvalue.value.b.enclosed[i],
							});
						ret.ids.push(node_id + "/" + value.typedvalue.value.b.func.closureparams[i].name);
					}
				}
			}
			else if (value.typedvalue.type.id >= TScript.typeid_class)
			{
				let type = value.typedvalue.type;
				let types = [];
				while (type)
				{
					types.unshift(type);
					type = type.superclass;
				}
				for (let j=0; j<types.length; j++)
				{
					type = types[j];
					if (! type.variables) continue;
					for (let i=0; i<type.variables.length; i++)
					{
						ret.children.push({
								"nodetype": "typedvalue",
								"index": type.variables[i].name,
								"typedvalue": value.typedvalue.value.a[type.variables[i].id],
							});
						ret.ids.push(node_id + "/" + type.variables[i].name);
					}
				}
			}
			tgui.createElement({"type": "span", "parent": ret.element, "text": value.index + ": ", "classname": "ide-index"});
			tgui.createElement({
					"type": "span",
					"parent": ret.element,
					"classname": (value.typedvalue.type.id < type2css.length) ? type2css[value.typedvalue.type.id] : "ide-userclass",
					"text": s,
				});
		}
		else if (value.nodetype == "temporaries")
		{
			ret.opened = true;
			ret.element = tgui.createElement({"type": "span", "parent": ret.element, "text": "[temporaries]"});
			let j = 0;
			for (let i=0; i<value.frame.temporaries.length; i++)
			{
	if (! value.frame.temporaries[i]) continue;
				if (value.frame.temporaries[i].hasOwnProperty("type") && value.frame.temporaries[i].hasOwnProperty("value"))
				{
					ret.children.push({
							"nodetype": "typedvalue",
							"index": i,
							"typedvalue": value.frame.temporaries[i],
						});
					ret.ids.push(node_id + "/" + j);
					j++;
				}
			}
		}
		else throw "[stacktree.update] unknown nodetype: " + value.nodetype;
	}
	return ret;
}

// This function defines the program tree.
function programinfo(value, node_id)
{
	let ret = { "children": [], "ids": [] };
	if (! module.interpreter) return ret;
	if (module.interpreter.stack.length == 0) return ret;

	let frame = module.interpreter.stack[module.interpreter.stack.length - 1];
	let current_pe = frame.pe[frame.pe.length - 1];
	let current_pes = new Set();
	for (let i=0; i<frame.pe.length; i++) current_pes.add(frame.pe[i]);

	if (value === null)
	{
		ret.children.push(module.interpreter.program);
		ret.ids.push("");
	}
	else
	{
		ret.opened = true;

		let pe = value;
		if (pe.petype == "expression") pe = pe.sub;
		while (pe.petype == "group") pe = pe.sub;

		ret.element = document.createElement("div");
		let s = "";
		let css = "";
		s += pe.petype;
		if (pe.name) s += " " + pe.name;

		let petype = String(pe.petype);
		if (petype == "global scope" || petype == "scope" || petype == "namespace")
		{
			for (let i=0; i<pe.commands.length; i++)
			{
				if (pe.commands[i].hasOwnProperty("builtin") && pe.commands[i].builtin) continue;
				if (pe.commands[i].petype == "breakpoint") continue;
				ret.children.push(pe.commands[i]);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "conditional statement")
		{
			ret.children.push(pe.condition);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.then_part);
			ret.ids.push(node_id + "/" + ret.children.length);
			if (pe.else_part)
			{
				ret.children.push(pe.else_part);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "for-loop")
		{
			ret.children.push(pe.iterable);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.body);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "do-while-loop" || petype == "while-do-loop")
		{
			ret.children.push(pe.condition);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.body);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "break")
		{ }
		else if (petype == "continue")
		{ }
		else if (petype == "return")
		{
			if (pe.argument)
			{
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "variable declaration")
		{
			for (let i=0; i<pe.vars.length; i++)
			{
				ret.children.push(pe.vars[i]);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "variable" || petype == "attribute")
		{
			if (pe.initializer)
			{
				ret.children.push(pe.initializer);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "function" || petype == "method")
		{
			for (let i=0; i<pe.params.length; i++)
			{
				let n = pe.names[pe.params[i].name];
				if (n)
				{
					ret.children.push(n);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			for (let i=0; i<pe.commands.length; i++)
			{
				if (pe.commands[i].petype == "breakpoint") continue;
				ret.children.push(pe.commands[i]);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "type")
		{
			ret.children.push(pe.class_constructor);
			ret.ids.push(node_id + "/" + ret.children.length);
			for (let key in pe.members)
			{
				if (pe.members.hasOwnProperty(key))
				{
					ret.children.push(pe.members[key]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
			for (let key in pe.staticmembers)
			{
				if (pe.staticmembers.hasOwnProperty(key))
				{
					ret.children.push(pe.staticmembers[key]);
					ret.ids.push(node_id + "/" + ret.children.length);
				}
			}
		}
		else if (petype == "constant")
		{
			s = TScript.previewValue(pe.typedvalue);
			css = (pe.typedvalue.type.id < type2css.length) ? type2css[pe.typedvalue.type.id] : "ide-userclass";
		}
		else if (petype == "name")
		{
			// nothing to do...?
		}
		else if (petype == "this")
		{ }
		else if (petype == "closure")
		{
			ret.children.push(pe.func);
			ret.ids.push(node_id + "/" + ret.children.length);
			for (let i=0; i<pe.func.closureparams.length; i++)
			{
				ret.children.push(pe.func.closureparams[i].initializer);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "array")
		{
			for (let i=0; i<pe.elements.length; i++)
			{
				ret.children.push(pe.elements[i]);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "dictionary")
		{
			for (let i=0; i<pe.values.length; i++)
			{
				ret.children.push(pe.values[i]);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "function call")
		{
			ret.children.push(pe.base);
			ret.ids.push(node_id + "/" + ret.children.length);
			for (let i=0; i<pe.arguments.length; i++)
			{
				ret.children.push(pe.arguments[i]);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "named argument")
		{
			s = pe.name;
			if (pe.argument)
			{
				ret.children.push(pe.argument);
				ret.ids.push(node_id + "/" + ret.children.length);
			}
		}
		else if (petype == "item access")
		{
			ret.children.push(pe.base);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.argument);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype.substr(0, 17) == "access of member ")
		{
			ret.children.push(pe.object);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype.substr(0, 11) == "assignment ")
		{
			ret.children.push(pe.lhs);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.rhs);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype.substr(0, 20) == "left-unary operator ")
		{
			ret.children.push(pe.argument);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype.substr(0, 16) == "binary operator ")
		{
			ret.children.push(pe.lhs);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.rhs);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "try-catch")
		{
			ret.children.push(pe.try_part);
			ret.ids.push(node_id + "/" + ret.children.length);
			ret.children.push(pe.catch_part);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "try")
		{
			ret.children.push(pe.command);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "catch")
		{
			ret.children.push(pe.command);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "throw")
		{
			ret.children.push(pe.argument);
			ret.ids.push(node_id + "/" + ret.children.length);
		}
		else if (petype == "use")
		{ }
		else if (petype == "no-operation")
		{ }
		else if (petype == "breakpoint")
		{
			throw "[programinfo] internal error; breakpoints should not be listed";
		}
		else
		{
			throw "[programinfo] petype '" + petype + "' not covered";
		}

		if (current_pes.has(pe))
		{
			if (pe == current_pe)
			{
				css += " ide-program-current";
				ret.visible = true;
			}
			else css += " ide-program-ancestor";
		}

		tgui.createElement({
				"type": "span",
				"parent": ret.element,
				"classname": css,
				"text": s,
			});
		if (pe.where) tgui.createElement({"type": "span", "parent": ret.element, "text": " (" + pe.where.line + ":" + pe.where.ch + ")", "classname": "ide-index"});
	}

	return ret;
}

// visually indicate the interpreter state
function updateStatus()
{
	// update status indicator
	if (module.interpreter)
	{
		if (module.interpreter.status == "running")
		{
			if (module.interpreter.background) module.programstate.running();
			else module.programstate.stepping();
		}
		else if (module.interpreter.status == "waiting") module.programstate.waiting();
		else if (module.interpreter.status == "error") module.programstate.error();
		else if (module.interpreter.status == "finished") module.programstate.finished();
		else throw "internal error; unknown interpreter state";
	}
	else
	{
		if (module.messages.innerHTML != "") module.programstate.error();
		else module.programstate.unchecked();
	}

	// update read-only state of the editor
	if (module.sourcecode)
	{
		let should = module.interpreter && (module.interpreter.status == "running" || module.interpreter.status == "waiting");
		if (module.sourcecode.getOption("readOnly") != should)
		{
			module.sourcecode.setOption("readOnly", should);
			let ed = document.getElementsByClassName("CodeMirror");
			let value = should ? 0.6 : 1;
			for (let i=0; i<ed.length; i++) ed[i].style.opacity = value;
		}
	}
}

// update the controls to reflect the interpreter state
function updateControls()
{
	// move the cursor in the source code
	if (module.interpreter)
	{
		if (module.interpreter.stack.length > 0)
		{
			let frame = module.interpreter.stack[module.interpreter.stack.length - 1];
			let pe = frame.pe[frame.pe.length - 1];
			if (pe.where) setCursorPosition(pe.where.line, pe.where.ch);
		}
		else
		{
			setCursorPosition(module.sourcecode.lineCount(), 1000000);
		}
	}

	// show the current stack state
	module.stacktree.update(stackinfo);

	// show the current program tree
	module.programtree.update(programinfo);

	updateStatus();
}

// add a message to the message panel
module.addMessage = function(type, text, line, ch, href)
{
	let color = {"print": "#00f", "warning": "#f80", "error": "#f00"};
	let tr = tgui.createElement({"type": "tr", "parent": module.messages, "classname": "ide", "style": {"vertical-align": "top"}});
	let th = tgui.createElement({"type": "th", "parent": tr, "classname": "ide", "style": {"width": "20px"}});
	let bullet = tgui.createElement({"type": "span", "parent": th, "style": {"width": "20px", "color": color[type]}, "html": (href ? "&#128712;" : "\u2022")});
	if (href)
	{
		bullet.style.cursor = "pointer";
		bullet.addEventListener("click", function(event)
				{
					showdoc(href);
					return false;
				});
	}
	let td = tgui.createElement({"type": "td", "parent": tr, "classname": "ide"});
	let lines = text.split('\n');
	for (let i=0; i<lines.length; i++)
	{
		let s = lines[i];
		let msg = tgui.createElement({"type": "div", "parent": td, "classname": "ide ide-message" + (type != "print" ? " ide-errormessage" : ""), "text": s});
		if (line !== undefined)
		{
			msg.ide_line = line;
			msg.ide_ch = ch;
			msg.addEventListener("click", function(event)
					{
						setCursorPosition(event.target.ide_line, event.target.ide_ch);
						if (module.interpreter && (module.interpreter.status != "running" || !module.interpreter.background))
						{
							updateControls();
						}
						return false;
					});
		}
	}
	module.messagecontainer.scrollTop = module.messagecontainer.scrollHeight;
	if (href) module.sourcecode.focus();
}

// Stop the interpreter and clear all output,
// put the IDE into "not yet checked" mode.
function clear()
{
	if (module.interpreter) module.interpreter.stopthread();
	module.interpreter = null;

	tgui.clearElement(module.messages);
	{
		let ctx = module.turtle.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, module.turtle.width, module.turtle.height);
	}
	if (module.interpreter) module.interpreter.service.turtle.reset.call(module.interpreter, 0, 0, 0, true);

	let ctx = module.canvas.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, module.canvas.width, module.canvas.height);
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "#000";
	ctx.font = "16px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
}

// Prepare everything for the program to start running,
// put the IDE into stepping mode at the start of the program.
module.prepare_run = function()
{
	clear();

	// make sure that there is a trailing line for the "end" breakpoint
	let source = module.sourcecode.getValue();
	if (source.length != 0 && source[source.length - 1] != '\n')
	{
		source += '\n';
		module.sourcecode.getDoc().replaceRange('\n', CodeMirror.Pos(module.sourcecode.lastLine()));
	}

	let result = TScript.parse(source);
	let program = result.program;
	let html = "";
	let errors = result.errors;
	if (errors)
	{
		for (let i=0; i<errors.length; i++)
		{
			let err = errors[i];
			module.addMessage(err.type, err.type + " in line " + err.line + ": " + err.message, err.line, err.ch, err.href);
		}
	}

	if (program)
	{
//console.log(program);
		module.interpreter = new TScript.Interpreter(program);
		module.interpreter.service.documentation_mode = false;
		module.interpreter.service.print = (function(msg) { module.addMessage("print", msg); });
		module.interpreter.service.alert = (function(msg) { alert(msg); });
		module.interpreter.service.confirm = (function(msg) { return confirm(msg); });
		module.interpreter.service.prompt = (function(msg) { return prompt(msg); });
		module.interpreter.service.message = (function(msg, line, ch, href)
				{
					if (line === undefined) line = null;
					if (ch === undefined) ch = null;
					if (href === undefined) href = "";
					module.addMessage("error", msg, line, ch, href);
				});
		module.interpreter.service.statechanged = function(stop)
				{
					if (stop) updateControls();
					else updateStatus();
					if (module.interpreter.status == "finished") module.sourcecode.focus();
				};
		module.interpreter.service.breakpoint = function()
				{
					updateControls();
				};
		module.interpreter.service.turtle.dom = module.turtle;
		module.interpreter.service.canvas.dom = module.canvas;
		module.interpreter.eventnames["canvas.resize"] = true;
		module.interpreter.eventnames["canvas.mousedown"] = true;
		module.interpreter.eventnames["canvas.mouseup"] = true;
		module.interpreter.eventnames["canvas.mousemove"] = true;
		module.interpreter.eventnames["canvas.mouseout"] = true;
		module.interpreter.eventnames["canvas.keydown"] = true;
		module.interpreter.eventnames["canvas.keyup"] = true;
		module.interpreter.eventnames["timer"] = true;
		module.interpreter.reset();

		// set and correct breakpoints
		let br = [];
		for (let i=1; i<=module.sourcecode.lineCount(); i++)
		{
			if (module.sourcecode.lineInfo(i-1).gutterMarkers) br.push(i);
		}
		let result = module.interpreter.defineBreakpoints(br);
		if (result !== null)
		{
			for (let i=1; i<=module.sourcecode.lineCount(); i++)
			{
				if (module.sourcecode.lineInfo(i-1).gutterMarkers)
				{
					if (! result.hasOwnProperty(i)) module.sourcecode.setGutterMarker(i-1, "breakpoints", null);
				}
				else
				{
					if (result.hasOwnProperty(i)) module.sourcecode.setGutterMarker(i-1, "breakpoints", makeMarker());
				}
			}
			alert("Note: breakpoints were moved to valid locations");
		}
	}

//	updateControls();
};

let cmd_reset = function()
{
	clear();
	updateControls();
}

let cmd_run = function()
{
	if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
	if (! module.interpreter) return;
	module.interpreter.run();
//	updateControls();
	module.canvas.parentElement.focus();
};

let cmd_interrupt = function()
{
	if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
	module.interpreter.interrupt();
//	updateControls();
};

let cmd_step_into = function()
{
	if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
	if (! module.interpreter) return;
	if (module.interpreter.running) return;
	module.interpreter.step_into();
//	updateControls();
};

let cmd_step_over = function()
{
	if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
	if (! module.interpreter) return;
	if (module.interpreter.running) return;
	module.interpreter.step_over();
//	updateControls();
};

let cmd_step_out = function()
{
	if (! module.interpreter || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) module.prepare_run();
	if (! module.interpreter) return;
	if (module.interpreter.running) return;
	module.interpreter.step_out();
//	updateControls();
};

let cmd_export = function()
{
	let title = module.document.filename;
	if (! title || title == "") title = "tscript-export";
	let fn = title;
	if (! fn.endsWith("html") && ! fn.endsWith("HTML") && ! fn.endsWith("htm") && ! fn.endsWith("HTM")) fn += ".html";

	let dlg = tgui.createElement({
			"type": "div",
			"style": {"position": "fixed", "width": "50vw", "left": "25vw", "height": "50vh", "top": "25vh", "background": "#eee", "overflow": "hidden"},
		});
	let titlebar = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"style": {"position": "absolute", "width": "50vw", "left": "0", "height": "22px", "top": "0", "background": "#008", "color": "#fff", "padding": "2px 10px"},
			"text": "export",
		});
	let status = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"text": "status: preparing ...",
			"style": {"position": "absolute", "width": "40vw", "left": "5vw", "height": "40px", "line-height": "40px", "top": "40px", "color": "#000", "padding": "2px 10px", "vertical-align": "middle", "border": "1px solid #000"},
		});
	let download_turtle = tgui.createElement({
			"parent": dlg,
			"type": "a",
			"properties": {"target": "_blank", "download": fn},
			"text": "download standalone turtle application",
			"style": {"position": "absolute", "width": "40vw", "left": "5vw", "height": "40px", "line-height": "40px", "top": "100px", "background": "#fff", "color": "#44c", "font-decoration": "underline", "padding": "2px 10px", "vertical-align": "middle", "border": "1px solid #000", "display": "none"},
		});
	let download_canvas = tgui.createElement({
			"parent": dlg,
			"type": "a",
			"properties": {"target": "_blank", "download": fn},
			"text": "download standalone canvas application",
			"style": {"position": "absolute", "width": "40vw", "left": "5vw", "height": "40px", "line-height": "40px", "top": "160px", "background": "#fff", "color": "#44c", "font-decoration": "underline", "padding": "2px 10px", "vertical-align": "middle", "border": "1px solid #000", "display": "none"},
		});

	let close = tgui.createElement({
			"parent": dlg,
			"type": "button",
			"style": {"position": "absolute", "right": "10px", "bottom": "10px", "width": "100px", "height": "25px"},
			"text": "Close",
		});
	close.addEventListener("click", function(event)
			{
				saveConfig();
				tgui.stopModal();
				event.preventDefault();
				event.stopPropagation();
				return false;
			});

	dlg.onKeyDown = function(event)
			{
				if (event.key == "Escape")
				{
					saveConfig();
					tgui.stopModal();
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			};

	tgui.startModal(dlg);

	let source = ide.sourcecode.getValue().replace(/\\n/g, "\\\\n").replace(/\n/g, "\\n").replace(/'/g, "\\'");

	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", window.location, true);
		xhr.overrideMimeType("text/html");
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4)
			{
				let page = xhr.responseText;

				let key = '"export key"';
				let pos = page.indexOf(key);
				pos = page.indexOf(key, pos+1);
				if (pos < 0) { alert("internal error during export"); return; }
				pos += key.length + 1;
				let title1 = page.indexOf("<title>") + 7;
				let title2 = page.indexOf("</title>");

				let s1 = page.substr(0, title1);
				let s2 = page.substr(title2, pos - title2);
				let s3 = page.substr(pos);

				let s_init = "ide.sourcecode.setValue('" + source + "');\nide.prepare_run();\nif (ide.interpreter) ide.interpreter.run(); else { cv.innerHTML = ''; cv.appendChild(ide.messagecontainer); };\n";
				let turtle = 'window.addEventListener("load", function() {\ntgui.releaseAllHotkeys();\ndocument.body.innerHTML = "";\nide.turtle.parentNode.removeChild(ide.turtle);\ndocument.body.appendChild(ide.turtle);\nide.turtle.style.width="100vh";\nide.turtle.style.height="100vh";\n' + s_init + '}, false);\n';
				let canvas = 'window.addEventListener("load", function() {\ntgui.releaseAllHotkeys();\ndocument.body.innerHTML = "";\nlet cv = ide.canvas.parentNode;\ncv.parentNode.removeChild(cv);\ndocument.body.appendChild(cv);\ncv.style.width="100vw";\ncv.style.height="100vh";\ncv.style.top="0px";\nlet init = function() {\nif (cv.offsetWidth == 0 || cv.offsetHeight == 0) { window.setTimeout(init, 1); return; }\nide.canvas.width = cv.offsetWidth;\nide.canvas.height = cv.offsetHeight;\n' + s_init + 'cv.focus();\n};\nwindow.setTimeout(init, 1);\n}, false);\n';

				status.innerHTML = "status: ready for download";
				download_turtle.href="data:text/plain," + encodeURIComponent(s1 + title + s2 + turtle + s3);
				download_turtle.style.display = "block";
				download_canvas.href="data:text/plain," + encodeURIComponent(s1 + title + s2 + canvas + s3);
				download_canvas.style.display = "block";
			}
		}
		xhr.send();
	}
}

let cmd_toggle_breakpoint = function()
{
	let cm = module.sourcecode;
	let line = cm.doc.getCursor().line;
	if (module.interpreter)
	{
		// ask the interpreter for the correct position of the marker
		let result = module.interpreter.toggleBreakpoint(line+1);
		if (result !== null)
		{
			line = result.line;
			cm.setGutterMarker(line-1, "breakpoints", result.active ? makeMarker() : null);
			module.sourcecode.scrollIntoView({"line": line-1}, 40);
		}
	}
	else
	{
		// set the marker optimistically, fix as soon as an interpreter is created
		cm.setGutterMarker(line, "breakpoints", cm.lineInfo(line).gutterMarkers ? null : makeMarker());
	}
}

let cmd_new = function()
{
	if (module.document.dirty)
	{
		if (! confirm("The document may have unsaved changes.\nDo you want to discard the code?")) return;
	}

	clear();

	module.editor_title.innerHTML = "editor";
	module.document.filename = "";
	module.sourcecode.setValue("");
	module.sourcecode.getDoc().clearHistory();
	module.document.dirty = false;

	updateControls();
	module.sourcecode.focus();
}

let cmd_load = function()
{
	if (module.document.dirty)
	{
		if (! confirm("The document has unsaved changes.\nDo you want to discard the code?")) return;
	}

	let dlg = fileDlg("load file", module.document.filename, false, function(filename)
			{
				clear();

				module.editor_title.innerHTML = "editor &mdash; ";
				tgui.createText(filename, module.editor_title);
				module.document.filename = filename;
				module.sourcecode.setValue(localStorage.getItem("tscript.code." + filename));
				module.sourcecode.getDoc().setCursor({line: 0, ch: 0}, );
				module.sourcecode.getDoc().clearHistory();
				module.document.dirty = false;

				updateControls();
				module.sourcecode.focus();
			});
}

let cmd_save = function()
{
	if (module.document.filename == "")
	{
		cmd_save_as();
		return;
	}

	localStorage.setItem("tscript.code." + module.document.filename, module.sourcecode.getValue());
	module.document.dirty = false;
}

let cmd_save_as = function()
{
	let dlg = fileDlg("save file as ...", module.document.filename, true, function(filename)
			{
				module.editor_title.innerHTML = "editor &mdash; ";
				tgui.createText(filename, module.editor_title);
				module.document.filename = filename;
				cmd_save();
				module.sourcecode.focus();
			});
}



// Toolbar icons
// icon parts used several times are written as a function,
// the 2d context of the canvas is passed as a parameter,
// resulting in less code

function draw_icon_paper(ctx)
{
	ctx.strokeStyle = "#333";
	ctx.fillStyle = "#fff";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(4.5, 7.5);
	ctx.lineTo(8.5, 3.5);
	ctx.lineTo(14.5, 3.5);
	ctx.lineTo(14.5, 16.5);
	ctx.lineTo(4.5, 16.5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(4.5, 7.5);
	ctx.lineTo(8.5, 7.5);
	ctx.lineTo(8.5, 3.5);
	ctx.stroke();
}

function draw_icon_floppy_disk(ctx)
{
	ctx.fillStyle = "#36d";
	ctx.strokeStyle = "#139";
	ctx.beginPath();
	ctx.moveTo(3.5, 3.5);
	ctx.lineTo(16.5, 3.5);
	ctx.lineTo(16.5, 16.5);
	ctx.lineTo(5.5, 16.5);
	ctx.lineTo(3.5, 14.5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = "#eef";
	ctx.fillRect(7, 11, 6, 5);
	ctx.fillStyle = "#36d";
	ctx.fillRect(8, 12, 2, 3);

	ctx.fillStyle = "#fff";
	ctx.fillRect(6, 4, 8, 5);
}

function draw_icon_pencil_overlay(ctx)
{
	// draw pencil
	// shadow
	ctx.strokeStyle = "#0005";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(8, 8);
	ctx.lineTo(8+10, 8+10);
	ctx.stroke();


	ctx.fillStyle = "#fc9";
	ctx.beginPath();
	ctx.moveTo(8, 6);
	ctx.lineTo(12, 8);
	ctx.lineTo(10, 10);
	ctx.fill();

	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.moveTo(8, 6);
	ctx.lineTo(10, 6);
	ctx.lineTo(8, 8);
	ctx.fill();

	ctx.strokeStyle = "#000";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(10, 8);
	ctx.lineTo(18, 16);
	ctx.stroke();

	ctx.strokeStyle = "#dd0";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(10, 8);
	ctx.lineTo(18, 16);
	ctx.stroke();

	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.arc(18, 16, 1.5, 0, 2*Math.PI, false);
	ctx.fill();

	ctx.fillStyle = "#f33";
	ctx.fillRect(17, 14.5, 2, 2);
}



let buttons = [
		{
			"click": cmd_new,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						draw_icon_paper(ctx);

						ctx.strokeStyle = "#030";
						ctx.fillStyle = "#0a0";
						ctx.beginPath();
						ctx.arc(14, 14, 4.75, 0, 2 * Math.PI, false);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();

						ctx.strokeStyle = "#fff";
						ctx.lineWidth = 2;
						ctx.beginPath();
						ctx.moveTo(14, 17);
						ctx.lineTo(14, 11);
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(11, 14);
						ctx.lineTo(17, 14);
						ctx.stroke();
					},
			"tooltip": "new document",
			"hotkey": "shift-control-n",
		},
		{
			"click": cmd_load,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						ctx.fillStyle = "#ec5";
						ctx.strokeStyle = "#330";
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(2.5, 4.5);
						ctx.lineTo(7.5, 4.5);
						ctx.lineTo(9.5, 6.5);
						ctx.lineTo(15.5, 6.5);
						ctx.lineTo(15.5, 15.5);
						ctx.lineTo(2.5, 15.5);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();

						ctx.fillStyle = "#fd6";
						ctx.strokeStyle = "#330";
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(5.5, 8.5);
						ctx.lineTo(17.5, 8.5);
						ctx.lineTo(15.5, 15.5);
						ctx.lineTo(3.5, 15.5);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();
					},
			"tooltip": "open document",
			"hotkey": "control-o",
		},
		{
			"click": cmd_save,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						draw_icon_floppy_disk(ctx);
					},
			"tooltip": "save document",
			"hotkey": "control-s",
		},
		{
			"click": cmd_save_as,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						draw_icon_floppy_disk(ctx);
						draw_icon_pencil_overlay(ctx);
					},
			"tooltip": "save document as ...",
			"hotkey": "shift-control-s",
		},
		{
			"click": cmd_run,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#080";
						ctx.beginPath();
						ctx.moveTo(5, 5);
						ctx.lineTo(15, 10);
						ctx.lineTo(5, 15);
						ctx.fill();
					},
			"tooltip": "run the program, or continue running the program",
			"hotkey": "F7",
		},
		{
			"click": cmd_interrupt,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#c00";
						ctx.fillRect(5, 5, 4, 10);
						ctx.fillRect(11, 5, 4, 10);
					},
			"tooltip": "interrupt the program",
			"hotkey": "shift-F7",
		},
		{
			"click": cmd_reset,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#c00";
						ctx.fillRect(5, 5, 10, 10);
					},
			"tooltip": "abort the program",
			"hotkey": "F10",
		},
		{
			"click": cmd_step_into,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#000";
						ctx.fillRect(10,  3, 7, 2);
						ctx.fillRect(13,  6, 4, 2);
						ctx.fillRect(13,  9, 4, 2);
						ctx.fillRect(13, 12, 4, 2);
						ctx.fillRect(10, 15, 7, 2);
						ctx.lineWidth = 1;
						ctx.strokeStyle = "#00f";
						ctx.beginPath();
						ctx.moveTo(8, 4);
						ctx.lineTo(3, 4);
						ctx.lineTo(3, 10);
						ctx.lineTo(6, 10);
						ctx.stroke();
						ctx.fillStyle = "#00f";
						ctx.beginPath();
						ctx.moveTo(5, 7);
						ctx.lineTo(5, 13);
						ctx.lineTo(9.5, 10);
						ctx.fill();
					},
			"tooltip": "run the current command, step into function calls",
			"hotkey": "shift-control-F11",
		},
		{
			"click": cmd_step_over,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#000";
						ctx.fillRect(10,  3, 7, 2);
						ctx.fillRect(13,  6, 4, 2);
						ctx.fillRect(13,  9, 4, 2);
						ctx.fillRect(13, 12, 4, 2);
						ctx.fillRect(10, 15, 7, 2);
						ctx.lineWidth = 1;
						ctx.strokeStyle = "#00f";
						ctx.beginPath();
						ctx.moveTo(8, 4);
						ctx.lineTo(3, 4);
						ctx.lineTo(3, 16);
						ctx.lineTo(6, 16);
						ctx.stroke();
						ctx.fillStyle = "#00f";
						ctx.beginPath();
						ctx.moveTo(5, 13);
						ctx.lineTo(5, 19);
						ctx.lineTo(9.5, 16);
						ctx.fill();
					},
			"tooltip": "run the current line of code, do no step into function calls",
			"hotkey": "control-F11",
		},
		{
			"click": cmd_step_out,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#000";
						ctx.fillRect(10,  3, 7, 2);
						ctx.fillRect(13,  6, 4, 2);
						ctx.fillRect(13,  9, 4, 2);
						ctx.fillRect(13, 12, 4, 2);
						ctx.fillRect(10, 15, 7, 2);
						ctx.lineWidth = 1;
						ctx.strokeStyle = "#00f";
						ctx.beginPath();
						ctx.moveTo(11, 10);
						ctx.lineTo(3, 10);
						ctx.lineTo(3, 16);
						ctx.lineTo(6, 16);
						ctx.stroke();
						ctx.fillStyle = "#00f";
						ctx.beginPath();
						ctx.moveTo(5, 13);
						ctx.lineTo(5, 19);
						ctx.lineTo(9.5, 16);
						ctx.fill();
					},
			"tooltip": "step out of the current function",
			"hotkey": "shift-F11",
		},
		{
			"click": cmd_toggle_breakpoint,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#c00";
						ctx.arc(10, 10, 4.0, 0, 2 * Math.PI, false);
						ctx.fill();
					},
			"tooltip": "toggle breakpoint",
			"hotkey": "F8",
		},
	];

// load hotkeys
function loadConfig()
{
	let str = localStorage.getItem("tscript.ide.config");
	if (str)
	{
		let config = JSON.parse(str);
		if (config.hasOwnProperty("hotkeys"))
		{
			let n = Math.min(buttons.length, config.hotkeys.length);
			for (let i=0; i<n; i++)
			{
				buttons[i].hotkey = config.hotkeys[i];
			}
		}
		if (config.hasOwnProperty("options"))
		{
			TScript.options = config.options;
		}
	}
	return null;
}
loadConfig();

// save hotkeys
function saveConfig()
{
	let config = {"options": TScript.options, "hotkeys": []};
	for (let i=0; i<buttons.length; i++)
	{
		config.hotkeys.push(buttons[i].hotkey);
	}
	localStorage.setItem("tscript.ide.config", JSON.stringify(config));
}

function configDlg()
{
	let dlg = tgui.createElement({
			"type": "div",
			"style": {"position": "fixed", "width": "50vw", "left": "25vw", "height": "50vh", "top": "25vh", "background": "#eee", "overflow": "hidden"},
		});
	let titlebar = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"style": {"position": "absolute", "width": "50vw", "left": "0", "height": "22px", "top": "0", "background": "#008", "color": "#fff", "padding": "2px 10px"},
			"text": "configuration",
		});
	let content = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"html": "<h3 style=\"margin-top: 20px;\">Configure Hotkeys</h3><p>Click a button to configure its hotkey.</p>",
		});
	let dlg_buttons = [];
	let div = tgui.createElement({parent: dlg, type: "div"});
	for (let i=0; i<buttons.length; i++)
	{
		let description = Object.assign({}, buttons[i]);
		description.width = 20;
		description.height = 20;
		description.style = {"height": "22px"};
		if (description.hotkey) description.tooltip += " (" + description.hotkey + ")";
		delete description.hotkey;
		description.parent = div;
		{
			let btn = i;
			description.click = function()
					{
						let dlg = tgui.createElement({
								"type": "div",
								"style": {"position": "fixed", "width": "30vw", "left": "35vw", "height": "30vh", "top": "35vh", "background": "#eee"},
								"html": "<p>press the hotkey to assign, or press escape to remove the current hotkey</p>",
							});
						dlg.onKeyDown = function(event)
								{
									event.preventDefault();
									event.stopPropagation();

									let key = event.key;
									if (key == "Shift" || key == "Control" || key == "Alt" || key == "OS" || key == "Meta") return;
									if (buttons[btn].hotkey)
									{
										tgui.setTooltip(buttons[btn].control.dom, buttons[btn].tooltip);
										tgui.setTooltip(dlg_buttons[btn].dom, buttons[btn].tooltip);
										tgui.releaseHotkey(buttons[btn].hotkey);
										delete buttons[btn].hotkey;
									}
									if (key == "Escape")
									{
										tgui.stopModal();
										return false;
									}

									if (event.altKey) key = "alt-" + key;
									if (event.ctrlKey) key = "control-" + key;
									if (event.shiftKey) key = "shift-" + key;
									key = tgui.normalizeHotkey(key);

									if (tgui.hotkey(key))
									{
										alert("hotkey " + key + " is already in use");
									}
									else
									{
										buttons[btn].hotkey = key;
										tgui.setHotkey(key, buttons[btn].click);
										tgui.setTooltip(buttons[btn].control.dom, buttons[btn].tooltip + " (" + key + ")");
										tgui.setTooltip(dlg_buttons[btn].dom, buttons[btn].tooltip + " (" + key + ")");
										tgui.stopModal();
									}
									return false;
								};
						tgui.startModal(dlg);
					};
		}
		dlg_buttons.push(tgui.createButton(description));
	}

	let checked = "";

	div = tgui.createElement({parent: dlg, type: "div"});
	let h3 = tgui.createElement({parent: div, type: "h3", style: {"margin-top": "20px"}, text: "Coding Style"});
	let p = tgui.createElement({parent: div, type: "p"});
	let lbl = tgui.createElement({parent: p, type: "label", "html":" enable style errors "});
	let checkbox = tgui.createElement({parent: lbl, type: "input", properties: {type: "checkbox"},
				click: function(event)
				{ TScript.options.checkstyle = checkbox.checked; },
			});
	if (TScript.options.checkstyle) checkbox.checked = true;

	let close = tgui.createElement({
			"parent": dlg,
			"type": "button",
			"style": {"position": "absolute", "right": "10px", "bottom": "10px", "width": "100px", "height": "25px"},
			"text": "Close",
		});
	close.addEventListener("click", function(event)
			{
				saveConfig();
				tgui.stopModal();
				event.preventDefault();
				event.stopPropagation();
				return false;
			});

	dlg.onKeyDown = function(event)
			{
				if (event.key == "Escape")
				{
					saveConfig();
					tgui.stopModal();
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			};

	tgui.startModal(dlg);
}

function fileDlg(title, filename, allowNewFilename, onOkay)
{
	// populate array of existing files
	let files = [];
	for (let key in localStorage)
	{
		if (key.substr(0, 13) == "tscript.code.") files.push(key.substr(13));
	}
	files.sort();

	// create controls
	let dlg = tgui.createElement({
			"type": "div",
			"style": {"position": "fixed", "width": "50vw", "left": "25vw", "height": "70vh", "top": "15vh", "background": "#eee", "overflow": "hidden"},
		});
	let titlebar = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"style": {"position": "absolute", "width": "50vw", "left": "0", "height": "20px", "top": "0", "background": "#008", "color": "#fff", "padding": "2px 10px"},
			"text": title,
		});
	let list = tgui.createElement({
			"parent": dlg,
			"type": files.length > 0 ? "select" : "text",
			"properties": {"size": Math.max(2, files.length)},
			"style": {"position": "absolute", "width": "46vw", "left": "2vw", "height": "calc(70vh - 80px)", "top": "30px", "background": "#fff", "overflow": "scroll"},
			"text": files.length > 0 ? "" : "No documents saved.",
		});
	let buttons = tgui.createElement({
			"parent": dlg,
			"type": "div",
			"style": {"position": "absolute", "width": "46vw", "left": "2vw", "height": "25px", "bottom": "10px"},
		});
	let name = {value: filename};
	if (allowNewFilename)
	{
		name = tgui.createElement({
				"parent": dlg,
				"type": "input",
				"style": {"position": "absolute", "width": "46vw", "left": "2vw", "height": "25px", "bottom": "40px"},
				"text": filename,
				"properties": {type:"text", placeholder:"Filename"}
			});
		list.style.height = "calc(70vh - 110px)";
	}
	let okay = tgui.createElement({
			"parent": buttons,
			"type": "button",
			"style": {"width": "100px", "height": "25px", "margin-left": "10px"},
			"text": "Okay",
		});
	let cancel = tgui.createElement({
			"parent": buttons,
			"type": "button",
			"style": {"width": "100px", "height": "25px", "margin-left": "10px"},
			"text": "Cancel",
		});
	let deleteBtn = tgui.createElement({
			"parent": buttons,
			"type": "button",
			"style": {"width": "100px", "height": "25px", "margin-left": "10px"},
			"text": "Delete file",
			"click": () => deleteFile(name.value),
		});

	let exportBtn = tgui.createElement({
			"parent": buttons,
			"type": "button",
			"style": {"width": "100px", "height": "25px", "margin-left": "10px"},
			"text": "Export",
			"click": () => exportFile(name.value)
		});
	
	let importBtn = tgui.createElement({
			"parent": buttons,
			"type": "button",
			"style": {"width": "100px", "height": "25px", "margin-left": "10px"},
			"text": "Import",
			"click": () => importFile()
		});
	// populate options
	for (let i=0; i<files.length; i++)
	{
		let option = new Option(files[i], files[i]);
		list.options[i] = option;
	}

	// event handlers
	list.addEventListener("change", function(event)
			{
				if (event.target && event.target.value) name.value = event.target.value;
			});
	list.addEventListener("keydown", function(event)
			{
				if (event.key == "Backspace" || event.key == "Delete")
				{
					event.preventDefault();
					event.stopPropagation();
					deleteFile(name.value);
					return false;
				}
			});
	okay.addEventListener("click", function(event)
			{
				event.preventDefault();
				event.stopPropagation();
				let fn = name.value;
				if (fn != "")
				{
					if (allowNewFilename || files.indexOf(fn) >= 0)
					{
						tgui.stopModal();
						onOkay(fn);
					}
				}
				return false;
			});
	cancel.addEventListener("click", function(event)
			{
				tgui.stopModal();
				event.preventDefault();
				event.stopPropagation();
				return false;
			});

	dlg.onKeyDown = function(event)
			{
				if (event.key == "Escape")
				{
					tgui.stopModal();
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
				else if (event.key == "Enter")
				{
					event.preventDefault();
					event.stopPropagation();
					let fn = name.value;
					if (fn != "")
					{
						if (allowNewFilename || files.indexOf(fn) >= 0)
						{
							tgui.stopModal();
							onOkay(fn);
						}
					}
					return false;
				}
			};

	tgui.startModal(dlg);
	(allowNewFilename ? name : list).focus();
	return dlg;

	function deleteFile(filename)
	{
		let index = files.indexOf(filename);
		if (index >= 0)
		{
			if (confirm("Delete file \"" + filename + "\"\nAre you sure?"))
			{
				localStorage.removeItem("tscript.code." + filename);
				files.splice(index, 1);
				list.remove(index);
			}
		}
	}

	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
	  
		element.style.display = 'none';
		document.body.appendChild(element);
	  
		element.click();
	  
		document.body.removeChild(element);
	}

	function exportFile(filename){
		let data = localStorage.getItem("tscript.code." + filename);
		download(filename + ".tscript", data);
	}

	function importFile(){
		let fileImport = document.createElement('input');
		fileImport.type = "file";
		fileImport.style.display = "none";
		fileImport.accept = ".tscript";

		fileImport.addEventListener('change', async (event) => {
			if(event.target.files){
				var file = event.target.files[0];
				var filename = file.name.split('.tscript')[0];
				var data = await file.text();
				localStorage.setItem("tscript.code." + filename, data);
				files.push(filename);
				var option = document.createElement('option');
				option.text = filename;
				tgui.stopModal();
			}
		});

		fileImport.click();
	}
}

module.create = function(container, options)
{
	if (! options) options = {"export-button": true, "documentation-button": true};

	tgui.releaseAllHotkeys();

	// create HTML elements of the GUI
	module.main = tgui.createElement({"type": "div", "parent": container, "classname": "ide ide-main"});
	tgui.setHotkeyElement(module.main);

	module.toolbar = tgui.createElement({"type": "div", "parent": module.main, "classname": "ide ide-toolbar"});

	// add the export button on demand
	if (options["export-button"])
	{
		buttons.push(
			{
				"click": cmd_export,
				"draw": function(canvas)
						{
							let ctx = canvas.getContext("2d");
							ctx.strokeStyle = "#080";
							ctx.lineWidth = 1.5;
							ctx.beginPath();
							ctx.moveTo( 3,  7);
							ctx.lineTo(10,  7);
							ctx.lineTo(10,  3);
							ctx.lineTo(17, 10);
							ctx.lineTo(10, 17);
							ctx.lineTo(10, 13);
							ctx.lineTo( 3, 13);
							ctx.closePath();
							ctx.stroke();
						},
				"tooltip": "export program as webpage",
			},
		);
	}

	// prepare menu bar
	let sep = [false, false, false, true, false, false, true, false, false, false, true, true];
	for (let i=0; i<buttons.length; i++)
	{
		let description = Object.assign({}, buttons[i]);
		description.width = 20;
		description.height = 20;
		description.style = {"float": "left", "height": "22px"};
		if (description.hotkey) description.tooltip += " (" + description.hotkey + ")";
		description.parent = module.toolbar;
		buttons[i].control = tgui.createButton(description);

		if (sep[i])
		{
			tgui.createElement({
						"type": "div",
						"parent": module.toolbar,
						"classname":
						"tgui tgui-control",
						"style": {
							"float": "left",
							"width": "1px",
							"height": "22px",
							"background": "#666",
							"margin": "3px 10px 3px 10px"
							}
						});
		}
	}

	tgui.createButton({
			"click": function ()
					{
						configDlg();
						return false;
					},
			"width": 20,
			"height": 20,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.fillStyle = "#000";
						ctx.strokeStyle = "#000";
						ctx.arc(9.5, 9.5, 2.0, 0, 2 * Math.PI, false);
						ctx.fill();
						ctx.lineWidth = 3;
						ctx.strokeStyle = "#000";
						ctx.beginPath();
						ctx.arc(9.5, 9.5, 5.7, 0, 2 * Math.PI, false);
						ctx.closePath();
						ctx.stroke();
						ctx.lineWidth = 2;
						ctx.beginPath();
						for (let i=0; i<12; i++)
						{
							let a = i * Math.PI / 6;
							ctx.moveTo(9.5 + 6.0 * Math.cos(a), 9.5 + 6.0 * Math.sin(a));
							ctx.lineTo(9.5 + 8.8 * Math.cos(a), 9.5 + 8.8 * Math.sin(a));
						}
						ctx.stroke();
					},
			"parent": module.toolbar,
			"style": {"float": "left"},
			"tooltip": "configuration",
		});

	tgui.createElement({
				"type": "div",
				"parent": module.toolbar,
				"classname": "tgui tgui-control",
				"style": {
						"float": "left",
						"width": "1px",
						"height": "22px",
						"background": "#666",
						"margin": "3px 10px 3px 10px"
					},
				});

	module.programstate = tgui.createLabel({
				"parent": module.toolbar,
				"style": {
					"float": "left",
					"width": "250px",
					"text-align": "center",
					"background": "#fff"
					}
		});
	module.programstate.unchecked = function() { this.setText("program has not been checked").setBackground("#ee8"); }
	module.programstate.error = function() { this.setText("an error has occurred").setBackground("#f44"); }
	module.programstate.running = function() { this.setText("program is running").setBackground("#8e8"); }
	module.programstate.waiting = function() { this.setText("program is waiting").setBackground("#aca"); }
	module.programstate.stepping = function() { this.setText("program is in stepping mode").setBackground("#8ee"); }
	module.programstate.finished = function() { this.setText("program has finished").setBackground("#88e"); }
	module.programstate.unchecked();

	tgui.createElement({
				"type": "div",
				"parent": module.toolbar,
				"classname": "tgui tgui-control",
				"style": {
						"float": "left",
						"width": "1px",
						"height": "22px",
						"background": "#666",
						"margin": "3px 10px 3px 10px"
					},
				});

	tgui.createButton({
			"click": function ()
					{
						for (let i=0; i<tgui.panels.length; i++)
						{
							let p = tgui.panels[i];
							if (p.title == "editor" || p.title == "messages")
								p.dock("left");
							else
								p.dock("right");
						}
						savePanelData();
						return false;
					},
			"width": 20,
			"height": 20,
			"draw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						ctx.lineWidth = 1;
						ctx.fillStyle = "#ffe";
						ctx.strokeStyle = "#000";
						ctx.beginPath();
						ctx.rect(5.5, 6.5, 12, 9);
						ctx.fill();
						ctx.stroke();
						ctx.beginPath();
						ctx.rect(2.5, 5.5, 10, 6);
						ctx.fill();
						ctx.stroke();
						ctx.beginPath();
						ctx.rect(8.5, 2.5, 7, 5);
						ctx.fill();
						ctx.stroke();
					},
			"parent": module.toolbar,
			"style": {"float": "left"},
			"tooltip": "restore panels",
		});

	tgui.createElement({
				"type": "div",
				"parent": module.toolbar,
				"classname": "tgui tgui-control",
				"style": {
						"float": "left",
						"width": "1px",
						"height": "22px",
						"background": "#666",
						"margin": "3px 10px 3px 10px"
					},
				});

	module.iconlist = tgui.createElement({
			"type": "div",
			"parent": module.toolbar,
			"classname": "tgui",
				"style": {
						"float": "left",
						"width": "200px",
						"height": "100%",
						"border": "none",
						"margin": "3px",
					},
		});

	tgui.createElement({
				"type": "div",
				"parent": module.toolbar,
				"classname": "tgui tgui-control",
				"style": {
						"float": "left",
						"width": "1px",
						"height": "22px",
						"background": "#666",
						"margin": "3px 10px 3px 10px"
					},
				});

	if (options["documentation-button"])
	{
		tgui.createButton({
				"click": function ()
						{
							showdoc();
							return false;
						},
				"text": "documentation",
				"parent": module.toolbar,
				"style": {"float": "right"},
			});
	}

	// area containing all panels
	let area = tgui.createElement({"type": "div", "parent": module.main, "classname": "ide ide-panel-area"});

	// prepare tgui panels
	tgui.preparePanels(area, module.iconlist);

	let panel_editor = tgui.createPanel({
			"title": "editor",
			"state": "left",
			"fallbackState": "float",
			"dockedheight": 600,
			"onArrange": function() { if (module.sourcecode) module.sourcecode.refresh(); },
			"icondraw": function(canvas)
					{
						let ctx = canvas.getContext("2d");
						draw_icon_paper(ctx);

						ctx.fillStyle = "#777";
						ctx.fillRect(10, 5, 3, 1);
						ctx.fillRect(10, 7, 2, 1);
						ctx.fillRect( 7, 9, 4, 1);
						ctx.fillRect( 6,11, 7, 1);
						ctx.fillRect( 9,13, 4, 1);
					}
		});
	panel_editor.textarea = tgui.createElement({"type": "textarea", "parent": panel_editor.content, "classname": "ide ide-sourcecode"});
	module.sourcecode = CodeMirror.fromTextArea(panel_editor.textarea, {
			gutters: ["CodeMirror-linenumbers", "breakpoints"],
			lineNumbers: true,
			matchBrackets: true,
			styleActiveLine: true,
			mode: "text/tscript",
			indentUnit: 4,
			tabSize: 4,
			indentWithTabs: true,
			extraKeys: {
					"Ctrl-D": "toggleComment",
					"Cmd-D": "toggleComment",
					"F3": "findNext",
					"Shift-F3": "findPrev",
					"Ctrl-Up": "scrollUp",
					"Ctrl-Down": "scrollDown",
					"Shift-Tab": "unindent",
				},
		});
	module.sourcecode.on("change", function(cm, changeObj)
			{
				module.document.dirty = true;
				if (module.interpreter)
				{
					clear();
					updateControls();
				}
			});
	module.sourcecode.on("gutterClick", function(cm, line)
			{
				if (module.interpreter)
				{
					// ask the interpreter for the correct position of the marker
					let result = module.interpreter.toggleBreakpoint(line+1);
					if (result !== null)
					{
						line = result.line;
						cm.setGutterMarker(line-1, "breakpoints", result.active ? makeMarker() : null);
						module.sourcecode.scrollIntoView({"line": line}, 40);
					}
				}
				else
				{
					// set the marker optimistically, fix as soon as an interpreter is created
					cm.setGutterMarker(line, "breakpoints", cm.lineInfo(line).gutterMarkers ? null : makeMarker());
				}
			});
	module.editor_title = panel_editor.titlebar;

	let panel_messages = tgui.createPanel({
			"title": "messages",
			"state": "left",
			"dockedheight": 200,
			"icondraw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						ctx.fillStyle = "#fff";
						ctx.strokeStyle = "#222";
						ctx.beginPath();
						ctx.ellipse(9.5, 8.5, 7, 6, 0, 0.73*Math.PI, 2.57*Math.PI, false);
						ctx.lineTo(4.5, 17);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();

						ctx.fillStyle = "#777";
						ctx.fillRect(8,  6, 3, 1);
						ctx.fillRect(6,  8, 2, 1);
						ctx.fillRect(9,  8, 5, 1);
						ctx.fillRect(7, 10, 4, 1);
					}
		});
	module.messagecontainer = tgui.createElement({"type": "div", "parent": panel_messages.content, "classname": "ide ide-messages"});
	module.messages = tgui.createElement({"type": "table", "parent": module.messagecontainer, "classname": "ide", "style": {"width": "100%"}});

	// prepare stack tree control
	let panel_stackview = tgui.createPanel({
			"title": "stack",
			"state": "icon",
			"fallbackState": "right",
			"icondraw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						ctx.strokeStyle = "#222";

						// white top
						ctx.fillStyle = "#fff";
						ctx.beginPath();
						ctx.moveTo( 4,  5.5);
						ctx.lineTo(10,  8.5);
						ctx.lineTo(16,  5.5);
						ctx.lineTo(10,  2.5);
						ctx.fill();

						// shaded lower pages
						ctx.fillStyle = "#bbb";
						ctx.beginPath();
						ctx.moveTo( 4,  5.5);
						ctx.lineTo( 4, 14.5);
						ctx.lineTo(10, 17.5);
						ctx.lineTo(16, 14.5);
						ctx.lineTo(16,  5.5);
						ctx.lineTo(10,  8.5);
						ctx.fill();


						let i = 8;
						for(; i < 17; i+=3)
						{
							ctx.beginPath();
							ctx.moveTo( 3, i + 0.5);
							ctx.lineTo(10, i + 3.5);
							ctx.lineTo(17, i + 0.5);
							ctx.stroke();
						}

						// top frame
						ctx.beginPath();
						ctx.moveTo( 3.5, 5.3);
						ctx.lineTo( 3.5, 5.7);
						ctx.lineTo(10,   8.5);
						ctx.lineTo(16.5, 5.7);
						ctx.lineTo(16.5, 5.3);
						ctx.lineTo(10,   2.5);
						ctx.closePath();
						ctx.stroke();
					}
		});
	module.stacktree = tgui.createTreeControl({"parent": panel_stackview.content});

	// prepare program tree control
	let panel_programview = tgui.createPanel({
			"title": "program",
			"state": "icon",
			"fallbackState": "right",
			"icondraw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						ctx.fillStyle = "#000";
						ctx.fillRect(4,  3,  8, 2);
						ctx.fillRect(6,  6,  8, 2);
						ctx.fillRect(8,  9,  8, 2);
						ctx.fillRect(4, 12,  8, 2);
						ctx.fillRect(6, 15,  8, 2);
					}
		});
	module.programtree = tgui.createTreeControl({
			"parent": panel_programview.content,
			"nodeclick": function(event, value, id)
					{
						if (value.where)
						{
							setCursorPosition(value.where.line, value.where.ch);
						}
					},
		});

	// prepare turtle output panel
	let panel_turtle = tgui.createPanel({
			"title": "turtle",
			"state": "right",
			"fallbackState": "float",
			"icondraw": function(canvas)
					{
						// draws literally a turtle
						let ctx = canvas.getContext("2d");

						//ctx.fillStyle = "#4d5";
						ctx.fillStyle = "#2c3";
						ctx.strokeStyle = "#050";

						// head
						ctx.beginPath();
						ctx.ellipse(9.5, 5, 2, 2.5, 0, 0*Math.PI, 2*Math.PI, false);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();

						// legs
						ctx.lineWidth = 1.6;

						ctx.beginPath();
						ctx.moveTo(3.5, 6);
						ctx.lineTo(9.5, 11);
						ctx.lineTo(15.5, 6);
						ctx.stroke();

						ctx.beginPath();
						ctx.moveTo(4.5, 17);
						ctx.lineTo(9.5, 10);
						ctx.lineTo(14.5, 17);
						ctx.stroke();

						// tail
						ctx.lineWidth = 1.3;

						ctx.beginPath();
						ctx.moveTo(9.5, 17);
						ctx.lineTo(8.5, 19);
						ctx.stroke();

						// main body
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.ellipse(9.5, 11.5, 4, 5, 0, 0*Math.PI, 2*Math.PI, false);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();

						ctx.strokeStyle = "#0509";
						ctx.beginPath();
						ctx.ellipse(8.7, 10.7, 4, 5, 0, -0.3*Math.PI, 0.8*Math.PI, false);
						ctx.stroke();
					}
		});
	module.turtle = tgui.createElement({
			"type": "canvas",
			"parent": panel_turtle.content,
			"properties": {"width": 600, "height": 600},
			"classname": "ide ide-turtle",
		});
	module.turtle.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; });

	// ensure that the turtle area remains square and centered
	let makeSquare = function()
	{
		let w = module.turtle.parentElement.offsetWidth;
		let h = module.turtle.parentElement.offsetHeight;
		let size = Math.min(w, h);
		module.turtle.style.width = size + "px";
		module.turtle.style.height = size + "px";
		module.turtle.style.marginLeft = ((w > size) ? Math.floor((w - size) / 2) : 0) + "px";
		module.turtle.style.marginTop = ((h > size) ? Math.floor((h - size) / 2) : 0) + "px";
	};
	panel_turtle.onArrange = makeSquare;
	panel_turtle.onResize = makeSquare;

	function createTypedEvent(displayname, dict)
	{
		if (! module.interpreter) throw new Error("[createTypedEvent] internal error");
		let p = module.interpreter.program;
		for (let idx=10; idx<p.types.length; idx++)
		{
			let t = p.types[idx];
			if (t.displayname == displayname)
			{
				// create the object without calling the constructor, considering default values, etc
				let obj = { "type": t, "value": { "a": [] } };
				let n = {"type": p.types[module.typeid_null], "value": {"b": null}};
				for (let i=0; i<t.objectsize; i++) obj.value.a.push(n);

				// fill its attributes
				for (let key in t.members)
				{
					if (! dict.hasOwnProperty(key)) continue;
					obj.value.a[t.members[key].id] = TScript.json2typed.call(module.interpreter, dict[key]);
				}
				return obj;
			}
		}
		throw new Error("[createTypedEvent] unknown type " + displayname);
	}

	// prepare canvas output panel
	let panel_canvas = tgui.createPanel({
			"title": "canvas",
			"state": "icon",
			"fallbackState": "right",
			"onResize": function(w, h)
					{
						if (module.canvas)
						{
							module.canvas.width = w;
							module.canvas.height = h;
						}
						if (module.interpreter)
						{
							let e = {"width": w, "height": h};
							e = createTypedEvent("canvas.ResizeEvent", e);
							module.interpreter.enqueueEvent("canvas.resize", e);
						}
					},
			"icondraw": function(canvas)
					{
						let ctx = canvas.getContext("2d");

						ctx.fillStyle = "#333";
						ctx.fillRect(3, 2, 14, 16);
						ctx.fillStyle = "#fff";
						ctx.fillRect(4, 3, 12, 14);
						ctx.fillStyle = "#00c8";
						ctx.strokeStyle = "#00cc";
						ctx.beginPath();
						ctx.rect(5.5, 5.5, 6, 6);
						ctx.fill();
						ctx.stroke();
						ctx.fillStyle = "#c008";
						ctx.strokeStyle = "#c00c";
						ctx.beginPath();
						ctx.arc(11, 11, 3.5, 0, 2*Math.PI);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();
					}
		});
	module.canvas = tgui.createElement({
			"type": "canvas",
			"parent": panel_canvas.content,
			"properties": {"width": panel_canvas.content.clientWidth, "height": panel_canvas.content.clientHeight},
			"classname": "ide ide-canvas",
		});
	module.canvas.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; });
	panel_canvas.content.tabIndex = -1;
	panel_canvas.size = [0, 0];
//	module.canvas.font_size = 16;
	function buttonName(button)
	{
		if (button == 0) return "left";
		else if (button == 1) return "middle";
		else return "right";
	}
	function buttonNames(buttons)
	{
		let ret = [];
		if (buttons & 1) ret.push("left");
		if (buttons & 4) ret.push("middle");
		if (buttons & 2) ret.push("right");
		return ret;
	}
	let ctx = module.canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "#000";
	ctx.font = "16px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	module.canvas.addEventListener("mousedown", function(event) {
				if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
				let e = {
						"button": buttonName(event.button),
						"buttons": buttonNames(event.buttons),
						"shift": event.shiftKey,
						"control": event.ctrlKey,
						"alt": event.altKey,
						"meta": event.metaKey,
					};
				e = Object.assign(e, relpos(module.canvas, event.pageX, event.pageY));
				e = createTypedEvent("canvas.MouseButtonEvent", e);
				module.interpreter.enqueueEvent("canvas.mousedown", e);
			});
	module.canvas.addEventListener("mouseup", function(event) {
				if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
				let e = {
						"button": buttonName(event.button),
						"buttons": buttonNames(event.buttons),
						"shift": event.shiftKey,
						"control": event.ctrlKey,
						"alt": event.altKey,
						"meta": event.metaKey,
					};
				e = Object.assign(e, relpos(module.canvas, event.pageX, event.pageY));
				e = createTypedEvent("canvas.MouseButtonEvent", e);
				module.interpreter.enqueueEvent("canvas.mouseup", e);
			});
	module.canvas.addEventListener("mousemove", function(event) {
				if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
				let e = {
						"button": 0,
						"buttons": buttonNames(event.buttons),
						"shift": event.shiftKey,
						"control": event.ctrlKey,
						"alt": event.altKey,
						"meta": event.metaKey,
					};
				e = Object.assign(e, relpos(module.canvas, event.pageX, event.pageY));
				e = createTypedEvent("canvas.MouseMoveEvent", e);
				module.interpreter.enqueueEvent("canvas.mousemove", e);
			});
	module.canvas.addEventListener("mouseout", function(event) {
				if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
				let e = {"type": module.interpreter.program.types[module.typeid_null], "value": {"b": null}};
				module.interpreter.enqueueEvent("canvas.mouseout", e);
			});
	panel_canvas.content.addEventListener("keydown", function(event) {
				if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
				let e = {
						"key": event.key,
						"shift": event.shiftKey,
						"control": event.ctrlKey,
						"alt": event.altKey,
						"meta": event.metaKey,
					};
				e = createTypedEvent("canvas.KeyboardEvent", e);
				module.interpreter.enqueueEvent("canvas.keydown", e);
			});
	panel_canvas.content.addEventListener("keyup", function(event) {
				if (! module.interpreter || ! module.interpreter.background || (module.interpreter.status != "running" && module.interpreter.status != "waiting")) return;
				let e = {
						"key": event.key,
						"shift": event.shiftKey,
						"control": event.ctrlKey,
						"alt": event.altKey,
						"meta": event.metaKey,
					};
				e = createTypedEvent("canvas.KeyboardEvent", e);
				module.interpreter.enqueueEvent("canvas.keyup", e);
			});
	tgui.arrangePanels();

	module.sourcecode.focus();
}

return module;
}());

window.onbeforeunload = function(event){
if (String(document.title).startsWith("TScript IDE")) { event.preventDefault(); event.returnValue = ''; }
};
