function freyraumPseudoRandom(){const cryptoApi=globalThis.crypto;if(cryptoApi&&cryptoApi.getRandomValues){const values=new Uint32Array(1);cryptoApi.getRandomValues(values);return values[0]/4294967296}const now=Date.now();const perf=globalThis.performance&&globalThis.performance.now?globalThis.performance.now():0;return (Math.sin(now+perf)*10000)%1}
var qx=Object.defineProperty;var Zx=(Rn,Hn,Mr)=>Hn in Rn?qx(Rn,Hn,{enumerable:!0,configurable:!0,writable:!0,value:Mr}):Rn[Hn]=Mr;var x=(Rn,Hn,Mr)=>Zx(Rn,typeof Hn!="symbol"?Hn+"":Hn,Mr);(function(){"use strict";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Bu,zu;const Rn="166",Cn="",Nt="srgb",nn="srgb-linear",Da="display-p3",as="display-p3-linear",os="linear",ht="srgb",ls="rec709",cs="p3",fl="300 es";class Ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pl=1234567;const wr=Math.PI/180,Ai=180/Math.PI;function ti(){const i=freyraumPseudoRandom()*4294967295|0,e=freyraumPseudoRandom()*4294967295|0,t=freyraumPseudoRandom()*4294967295|0,n=freyraumPseudoRandom()*4294967295|0;return(Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]).toLowerCase()}function Rt(i,e,t){return Math.max(e,Math.min(t,i))}function Na(i,e){return(i%e+e)%e}function ch(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function dh(i,e,t){return i!==e?(t-i)/(e-i):0}function Er(i,e,t){return(1-t)*i+t*e}function uh(i,e,t,n){return Er(i,e,1-Math.exp(-t*n))}function hh(i,e=1){return e-Math.abs(Na(i,e*2)-e)}function fh(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function ph(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function mh(i,e){return i+Math.floor(freyraumPseudoRandom()*(e-i+1))}function gh(i,e){return i+freyraumPseudoRandom()*(e-i)}function vh(i){return i*(.5-freyraumPseudoRandom())}function yh(i){i!==void 0&&(pl=i);let e=pl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function xh(i){return i*wr}function _h(i){return i*Ai}function bh(i){return(i&i-1)===0&&i!==0}function Sh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Mh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function wh(i,e,t,n,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),d=a((e+n)/2),u=s((e-n)/2),h=a((e-n)/2),f=s((n-e)/2),g=a((n-e)/2);switch(r){case"XYX":i.set(o*d,l*u,l*h,o*c);break;case"YZY":i.set(l*h,o*d,l*u,o*c);break;case"ZXZ":i.set(l*u,l*h,o*d,o*c);break;case"XZX":i.set(o*d,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*d,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ri(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Vt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Eh={DEG2RAD:wr,RAD2DEG:Ai,generateUUID:ti,clamp:Rt,euclideanModulo:Na,mapLinear:ch,inverseLerp:dh,lerp:Er,damp:uh,pingpong:hh,smoothstep:fh,smootherstep:ph,randInt:mh,randFloat:gh,randFloatSpread:vh,seededRandom:yh,degToRad:xh,radToDeg:_h,isPowerOfTwo:bh,ceilPowerOfTwo:Sh,floorPowerOfTwo:Mh,setQuaternionFromProperEuler:wh,normalize:Vt,denormalize:Ri};class me{constructor(e=0,t=0){me.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $e{constructor(e,t,n,r,s,a,o,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=t,d[4]=s,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],u=n[7],h=n[2],f=n[5],g=n[8],v=r[0],m=r[3],p=r[6],b=r[1],y=r[4],_=r[7],L=r[2],C=r[5],T=r[8];return s[0]=a*v+o*b+l*L,s[3]=a*m+o*y+l*C,s[6]=a*p+o*_+l*T,s[1]=c*v+d*b+u*L,s[4]=c*m+d*y+u*C,s[7]=c*p+d*_+u*T,s[2]=h*v+f*b+g*L,s[5]=h*m+f*y+g*C,s[8]=h*p+f*_+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*s*d+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*s,f=c*s-a*l,g=t*u+n*h+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(r*c-d*n)*v,e[2]=(o*n-r*a)*v,e[3]=h*v,e[4]=(d*t-r*l)*v,e[5]=(r*s-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Fa.makeScale(e,t)),this}rotate(e){return this.premultiply(Fa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Fa=new $e;function ml(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Tr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Th(){const i=Tr("canvas");return i.style.display="block",i}const gl={};function vl(i){i in gl||(gl[i]=!0,console.warn(i))}function Ah(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const yl=new $e().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),xl=new $e().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ds={[nn]:{transfer:os,primaries:ls,toReference:i=>i,fromReference:i=>i},[Nt]:{transfer:ht,primaries:ls,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[as]:{transfer:os,primaries:cs,toReference:i=>i.applyMatrix3(xl),fromReference:i=>i.applyMatrix3(yl)},[Da]:{transfer:ht,primaries:cs,toReference:i=>i.convertSRGBToLinear().applyMatrix3(xl),fromReference:i=>i.applyMatrix3(yl).convertLinearToSRGB()}},Rh=new Set([nn,as]),lt={enabled:!0,_workingColorSpace:nn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Rh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=ds[e].toReference,r=ds[t].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return ds[i].primaries},getTransfer:function(i){return i===Cn?os:ds[i].transfer}};function Ci(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Oa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Pi;class Ch{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Pi===void 0&&(Pi=Tr("canvas")),Pi.width=e.width,Pi.height=e.height;const n=Pi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Pi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=Tr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Ci(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ci(t[n]/255)*255):t[n]=Ci(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ph=0;class _l{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ph++}),this.uuid=ti(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ba(r[a].image)):s.push(Ba(r[a]))}else s=Ba(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Ba(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Ch.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ih=0;class Ct extends Ti{constructor(e=Ct.DEFAULT_IMAGE,t=Ct.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,l=1009,c=Ct.DEFAULT_ANISOTROPY,d=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=ti(),this.name="",this.source=new _l(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new me(0,0),this.repeat=new me(1,1),this.center=new me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ct.DEFAULT_IMAGE=null,Ct.DEFAULT_MAPPING=300,Ct.DEFAULT_ANISOTROPY=1;class ft{constructor(e=0,t=0,n=0,r=1){ft.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,_=(f+1)/2,L=(p+1)/2,C=(d+h)/4,T=(u+v)/4,U=(g+m)/4;return y>_&&y>L?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=C/n,s=T/n):_>L?_<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),n=C/r,s=U/r):L<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(L),n=T/s,r=U/s),this.set(n,r,s,t),this}let b=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-v)/b,this.z=(h-d)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this.w=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Lh extends Ti{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Ct(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new _l(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $t extends Lh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class bl extends Ct{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Uh extends Ct{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ni{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],d=n[r+2],u=n[r+3];const h=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==h||c!==f||d!==g){let m=1-o;const p=l*h+c*f+d*g+u*v,b=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const L=Math.sqrt(y),C=Math.atan2(L,p*b);m=Math.sin(m*C)/L,o=Math.sin(o*C)/L}const _=o*b;if(l=l*m+h*_,c=c*m+f*_,d=d*m+g*_,u=u*m+v*_,m===1-o){const L=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=L,c*=L,d*=L,u*=L}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],d=n[r+3],u=s[a],h=s[a+1],f=s[a+2],g=s[a+3];return e[t]=o*g+d*u+l*f-c*h,e[t+1]=l*g+d*h+c*u-o*f,e[t+2]=c*g+d*f+o*h-l*u,e[t+3]=d*g-o*u-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(r/2),u=o(s/2),h=l(n/2),f=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=h*d*u+c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u-h*f*g;break;case"YXZ":this._x=h*d*u+c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u+h*f*g;break;case"ZXY":this._x=h*d*u-c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u-h*f*g;break;case"ZYX":this._x=h*d*u-c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u+h*f*g;break;case"YZX":this._x=h*d*u+c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u-h*f*g;break;case"XZY":this._x=h*d*u-c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=n+o+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-l)*f,this._y=(s-c)*f,this._z=(a-r)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(d-l)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-c)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(l+d)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-r)/f,this._x=(s+c)/f,this._y=(l+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+r*c-s*l,this._y=r*d+a*l+s*o-n*c,this._z=s*d+a*c+n*l-r*o,this._w=a*d-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=n*u+this._x*h,this._y=r*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*freyraumPseudoRandom(),t=2*Math.PI*freyraumPseudoRandom(),n=freyraumPseudoRandom(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,t=0,n=0){R.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Sl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Sl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),d=2*(o*t-s*r),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*d,this.y=n+l*d+o*c-s*u,this.z=r+l*u+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return za.copy(this).projectOnVector(e),this.sub(za)}reflect(e){return this.sub(za.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this}randomDirection(){const e=freyraumPseudoRandom()*Math.PI*2,t=freyraumPseudoRandom()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const za=new R,Sl=new ni;class ii{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ln):ln.fromBufferAttribute(s,a),ln.applyMatrix4(e.matrixWorld),this.expandByPoint(ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),us.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),us.copy(n.boundingBox)),us.applyMatrix4(e.matrixWorld),this.union(us)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ln),ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ar),hs.subVectors(this.max,Ar),Ii.subVectors(e.a,Ar),Li.subVectors(e.b,Ar),Ui.subVectors(e.c,Ar),Gn.subVectors(Li,Ii),Vn.subVectors(Ui,Li),ri.subVectors(Ii,Ui);let t=[0,-Gn.z,Gn.y,0,-Vn.z,Vn.y,0,-ri.z,ri.y,Gn.z,0,-Gn.x,Vn.z,0,-Vn.x,ri.z,0,-ri.x,-Gn.y,Gn.x,0,-Vn.y,Vn.x,0,-ri.y,ri.x,0];return!Ha(t,Ii,Li,Ui,hs)||(t=[1,0,0,0,1,0,0,0,1],!Ha(t,Ii,Li,Ui,hs))?!1:(fs.crossVectors(Gn,Vn),t=[fs.x,fs.y,fs.z],Ha(t,Ii,Li,Ui,hs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Pn=[new R,new R,new R,new R,new R,new R,new R,new R],ln=new R,us=new ii,Ii=new R,Li=new R,Ui=new R,Gn=new R,Vn=new R,ri=new R,Ar=new R,hs=new R,fs=new R,si=new R;function Ha(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){si.fromArray(i,s);const o=r.x*Math.abs(si.x)+r.y*Math.abs(si.y)+r.z*Math.abs(si.z),l=e.dot(si),c=t.dot(si),d=n.dot(si);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const kh=new ii,Rr=new R,Ga=new R;class Cr{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):kh.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Rr.subVectors(e,this.center);const t=Rr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Rr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Rr.copy(e.center).add(Ga)),this.expandByPoint(Rr.copy(e.center).sub(Ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const In=new R,Va=new R,ps=new R,Wn=new R,Wa=new R,ms=new R,Xa=new R;class Dh{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,In)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=In.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(In.copy(this.origin).addScaledVector(this.direction,t),In.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Va.copy(e).add(t).multiplyScalar(.5),ps.copy(t).sub(e).normalize(),Wn.copy(this.origin).sub(Va);const s=e.distanceTo(t)*.5,a=-this.direction.dot(ps),o=Wn.dot(this.direction),l=-Wn.dot(ps),c=Wn.lengthSq(),d=Math.abs(1-a*a);let u,h,f,g;if(d>0)if(u=a*l-o,h=a*o-l,g=s*d,u>=0)if(h>=-g)if(h<=g){const v=1/d;u*=v,h*=v,f=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=s,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*l)+c;else h<=-g?(u=Math.max(0,-(-a*s+o)),h=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c):h<=g?(u=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(u=Math.max(0,-(a*s+o)),h=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c);else h=a>0?-s:s,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Va).addScaledVector(ps,h),f}intersectSphere(e,t){In.subVectors(e.center,this.origin);const n=In.dot(this.direction),r=In.dot(In)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),d>=0?(s=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,In)!==null}intersectTriangle(e,t,n,r,s){Wa.subVectors(t,e),ms.subVectors(n,e),Xa.crossVectors(Wa,ms);let a=this.direction.dot(Xa),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Wn.subVectors(this.origin,e);const l=o*this.direction.dot(ms.crossVectors(Wn,ms));if(l<0)return null;const c=o*this.direction.dot(Wa.cross(Wn));if(c<0||l+c>a)return null;const d=-o*Wn.dot(Xa);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class at{constructor(e,t,n,r,s,a,o,l,c,d,u,h,f,g,v,m){at.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,d,u,h,f,g,v,m)}set(e,t,n,r,s,a,o,l,c,d,u,h,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new at().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/ki.setFromMatrixColumn(e,0).length(),s=1/ki.setFromMatrixColumn(e,1).length(),a=1/ki.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const h=a*d,f=a*u,g=o*d,v=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=h-v*c,t[9]=-o*l,t[2]=v-h*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,f=l*u,g=c*d,v=c*u;t[0]=h+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=f*o-g,t[6]=v+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,f=l*u,g=c*d,v=c*u;t[0]=h-v*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*d,t[9]=v-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,f=a*u,g=o*d,v=o*u;t[0]=l*d,t[4]=g*c-f,t[8]=h*c+v,t[1]=l*u,t[5]=v*c+h,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*d,t[4]=v-h*u,t[8]=g*u+f,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=f*u+g,t[10]=h-v*u}else if(e.order==="XZY"){const h=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+v,t[5]=a*d,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*d,t[10]=v*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Nh,e,Fh)}lookAt(e,t,n){const r=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),Xn.crossVectors(n,Kt),Xn.lengthSq()===0&&(Math.abs(n.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),Xn.crossVectors(n,Kt)),Xn.normalize(),gs.crossVectors(Kt,Xn),r[0]=Xn.x,r[4]=gs.x,r[8]=Kt.x,r[1]=Xn.y,r[5]=gs.y,r[9]=Kt.y,r[2]=Xn.z,r[6]=gs.z,r[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],u=n[5],h=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],b=n[3],y=n[7],_=n[11],L=n[15],C=r[0],T=r[4],U=r[8],w=r[12],S=r[1],P=r[5],G=r[9],N=r[13],F=r[2],W=r[6],V=r[10],J=r[14],X=r[3],oe=r[7],he=r[11],Me=r[15];return s[0]=a*C+o*S+l*F+c*X,s[4]=a*T+o*P+l*W+c*oe,s[8]=a*U+o*G+l*V+c*he,s[12]=a*w+o*N+l*J+c*Me,s[1]=d*C+u*S+h*F+f*X,s[5]=d*T+u*P+h*W+f*oe,s[9]=d*U+u*G+h*V+f*he,s[13]=d*w+u*N+h*J+f*Me,s[2]=g*C+v*S+m*F+p*X,s[6]=g*T+v*P+m*W+p*oe,s[10]=g*U+v*G+m*V+p*he,s[14]=g*w+v*N+m*J+p*Me,s[3]=b*C+y*S+_*F+L*X,s[7]=b*T+y*P+_*W+L*oe,s[11]=b*U+y*G+_*V+L*he,s[15]=b*w+y*N+_*J+L*Me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+s*l*u-r*c*u-s*o*h+n*c*h+r*o*f-n*l*f)+v*(+t*l*f-t*c*h+s*a*h-r*a*f+r*c*d-s*l*d)+m*(+t*c*u-t*o*f-s*a*u+n*a*f+s*o*d-n*c*d)+p*(-r*o*d-t*l*u+t*o*h+r*a*u-n*a*h+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],b=u*m*c-v*h*c+v*l*f-o*m*f-u*l*p+o*h*p,y=g*h*c-d*m*c-g*l*f+a*m*f+d*l*p-a*h*p,_=d*v*c-g*u*c+g*o*f-a*v*f-d*o*p+a*u*p,L=g*u*l-d*v*l-g*o*h+a*v*h+d*o*m-a*u*m,C=t*b+n*y+r*_+s*L;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/C;return e[0]=b*T,e[1]=(v*h*s-u*m*s-v*r*f+n*m*f+u*r*p-n*h*p)*T,e[2]=(o*m*s-v*l*s+v*r*c-n*m*c-o*r*p+n*l*p)*T,e[3]=(u*l*s-o*h*s-u*r*c+n*h*c+o*r*f-n*l*f)*T,e[4]=y*T,e[5]=(d*m*s-g*h*s+g*r*f-t*m*f-d*r*p+t*h*p)*T,e[6]=(g*l*s-a*m*s-g*r*c+t*m*c+a*r*p-t*l*p)*T,e[7]=(a*h*s-d*l*s+d*r*c-t*h*c-a*r*f+t*l*f)*T,e[8]=_*T,e[9]=(g*u*s-d*v*s-g*n*f+t*v*f+d*n*p-t*u*p)*T,e[10]=(a*v*s-g*o*s+g*n*c-t*v*c-a*n*p+t*o*p)*T,e[11]=(d*o*s-a*u*s-d*n*c+t*u*c+a*n*f-t*o*f)*T,e[12]=L*T,e[13]=(d*v*r-g*u*r+g*n*h-t*v*h-d*n*m+t*u*m)*T,e[14]=(g*o*r-a*v*r-g*n*l+t*v*l+a*n*m-t*o*m)*T,e[15]=(a*u*r-d*o*r+d*n*l-t*u*l-a*n*h+t*o*h)*T,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+n,d*l-r*a,0,c*l-r*o,d*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,d=a+a,u=o+o,h=s*c,f=s*d,g=s*u,v=a*d,m=a*u,p=o*u,b=l*c,y=l*d,_=l*u,L=n.x,C=n.y,T=n.z;return r[0]=(1-(v+p))*L,r[1]=(f+_)*L,r[2]=(g-y)*L,r[3]=0,r[4]=(f-_)*C,r[5]=(1-(h+p))*C,r[6]=(m+b)*C,r[7]=0,r[8]=(g+y)*T,r[9]=(m-b)*T,r[10]=(1-(h+v))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=ki.set(r[0],r[1],r[2]).length();const a=ki.set(r[4],r[5],r[6]).length(),o=ki.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],cn.copy(this);const c=1/s,d=1/a,u=1/o;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=d,cn.elements[5]*=d,cn.elements[6]*=d,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,t.setFromRotationMatrix(cn),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=2e3){const l=this.elements,c=2*s/(t-e),d=2*s/(n-r),u=(t+e)/(t-e),h=(n+r)/(n-r);let f,g;if(o===2e3)f=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===2001)f=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=2e3){const l=this.elements,c=1/(t-e),d=1/(n-r),u=1/(a-s),h=(t+e)*c,f=(n+r)*d;let g,v;if(o===2e3)g=(a+s)*u,v=-2*u;else if(o===2001)g=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ki=new R,cn=new at,Nh=new R(0,0,0),Fh=new R(1,1,1),Xn=new R,gs=new R,Kt=new R,Ml=new at,wl=new ni;class gn{constructor(e=0,t=0,n=0,r=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],d=r[9],u=r[2],h=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(Rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Rt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Rt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Rt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ml.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ml,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wl.setFromEuler(this),this.setFromQuaternion(wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class El{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Oh=0;const Tl=new R,Di=new ni,Ln=new at,vs=new R,Pr=new R,Bh=new R,zh=new ni,Al=new R(1,0,0),Rl=new R(0,1,0),Cl=new R(0,0,1),Pl={type:"added"},Hh={type:"removed"},Ni={type:"childadded",child:null},$a={type:"childremoved",child:null};class St extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=ti(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new R,t=new gn,n=new ni,r=new R(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new at},normalMatrix:{value:new $e}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new El,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.multiply(Di),this}rotateOnWorldAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.premultiply(Di),this}rotateX(e){return this.rotateOnAxis(Al,e)}rotateY(e){return this.rotateOnAxis(Rl,e)}rotateZ(e){return this.rotateOnAxis(Cl,e)}translateOnAxis(e,t){return Tl.copy(e).applyQuaternion(this.quaternion),this.position.add(Tl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Al,e)}translateY(e){return this.translateOnAxis(Rl,e)}translateZ(e){return this.translateOnAxis(Cl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?vs.copy(e):vs.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(Pr,vs,this.up):Ln.lookAt(vs,Pr,this.up),this.quaternion.setFromRotationMatrix(Ln),r&&(Ln.extractRotation(r.matrixWorld),Di.setFromRotationMatrix(Ln),this.quaternion.premultiply(Di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Pl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hh),$a.child=e,this.dispatchEvent($a),$a.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Pl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pr,e,Bh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pr,zh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}St.DEFAULT_UP=new R(0,1,0),St.DEFAULT_MATRIX_AUTO_UPDATE=!0,St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new R,Un=new R,Ya=new R,kn=new R,Fi=new R,Oi=new R,Il=new R,qa=new R,Za=new R,ja=new R;class vn{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),dn.subVectors(e,t),r.cross(dn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){dn.subVectors(r,t),Un.subVectors(n,t),Ya.subVectors(e,t);const a=dn.dot(dn),o=dn.dot(Un),l=dn.dot(Ya),c=Un.dot(Un),d=Un.dot(Ya),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(c*l-o*d)*h,g=(a*d-o*l)*h;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,kn.x),l.addScaledVector(a,kn.y),l.addScaledVector(o,kn.z),l)}static isFrontFacing(e,t,n,r){return dn.subVectors(n,t),Un.subVectors(e,t),dn.cross(Un).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return dn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),dn.cross(Un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return vn.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return vn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;Fi.subVectors(r,n),Oi.subVectors(s,n),qa.subVectors(e,n);const l=Fi.dot(qa),c=Oi.dot(qa);if(l<=0&&c<=0)return t.copy(n);Za.subVectors(e,r);const d=Fi.dot(Za),u=Oi.dot(Za);if(d>=0&&u<=d)return t.copy(r);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(Fi,a);ja.subVectors(e,s);const f=Fi.dot(ja),g=Oi.dot(ja);if(g>=0&&f<=g)return t.copy(s);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Oi,o);const m=d*g-f*u;if(m<=0&&u-d>=0&&f-g>=0)return Il.subVectors(s,r),o=(u-d)/(u-d+(f-g)),t.copy(r).addScaledVector(Il,o);const p=1/(m+v+h);return a=v*p,o=h*p,t.copy(n).addScaledVector(Fi,a).addScaledVector(Oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ll={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},ys={h:0,s:0,l:0};function Ka(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Le{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=lt.workingColorSpace){if(e=Na(e,1),t=Rt(t,0,1),n=Rt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Ka(a,s,e+1/3),this.g=Ka(a,s,e),this.b=Ka(a,s,e-1/3)}return lt.toWorkingColorSpace(this,r),this}setStyle(e,t=Nt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Nt){const n=Ll[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ci(e.r),this.g=Ci(e.g),this.b=Ci(e.b),this}copyLinearToSRGB(e){return this.r=Oa(e.r),this.g=Oa(e.g),this.b=Oa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Nt){return lt.fromWorkingColorSpace(Ot.copy(this),e),Math.round(Rt(Ot.r*255,0,255))*65536+Math.round(Rt(Ot.g*255,0,255))*256+Math.round(Rt(Ot.b*255,0,255))}getHexString(e=Nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(Ot.copy(this),t);const n=Ot.r,r=Ot.g,s=Ot.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=Nt){lt.fromWorkingColorSpace(Ot.copy(this),e);const t=Ot.r,n=Ot.g,r=Ot.b;return e!==Nt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL($n),this.setHSL($n.h+e,$n.s+t,$n.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL($n),e.getHSL(ys);const n=Er($n.h,ys.h,t),r=Er($n.s,ys.s,t),s=Er($n.l,ys.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ot=new Le;Le.NAMES=Ll;let Gh=0;class Ir extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gh++}),this.uuid=ti(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Le(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class Yn extends Ir{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mt=new R,xs=new me;class un{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return vl("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xs.fromBufferAttribute(this,t),xs.applyMatrix3(e),this.setXY(t,xs.x,xs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ri(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ri(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ri(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ri(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ri(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),r=Vt(r,this.array),s=Vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}}class Ul extends un{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class kl extends un{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Wt extends un{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Vh=0;const rn=new at,Qa=new St,Bi=new R,Qt=new ii,Lr=new ii,Pt=new R;class yn extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vh++}),this.uuid=ti(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ml(e)?kl:Ul)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new $e().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return rn.makeRotationFromQuaternion(e),this.applyMatrix4(rn),this}rotateX(e){return rn.makeRotationX(e),this.applyMatrix4(rn),this}rotateY(e){return rn.makeRotationY(e),this.applyMatrix4(rn),this}rotateZ(e){return rn.makeRotationZ(e),this.applyMatrix4(rn),this}translate(e,t,n){return rn.makeTranslation(e,t,n),this.applyMatrix4(rn),this}scale(e,t,n){return rn.makeScale(e,t,n),this.applyMatrix4(rn),this}lookAt(e){return Qa.lookAt(e),Qa.updateMatrix(),this.applyMatrix4(Qa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(e){const t=[];for(let n=0,r=e.length;n<r;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Wt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ii);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Qt.setFromBufferAttribute(s),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,Qt.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,Qt.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(Qt.min),this.boundingBox.expandByPoint(Qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(Qt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Lr.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors(Qt.min,Lr.min),Qt.expandByPoint(Pt),Pt.addVectors(Qt.max,Lr.max),Qt.expandByPoint(Pt)):(Qt.expandByPoint(Lr.min),Qt.expandByPoint(Lr.max))}Qt.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Pt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Pt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Pt.fromBufferAttribute(o,c),l&&(Bi.fromBufferAttribute(e,c),Pt.add(Bi)),r=Math.max(r,n.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new un(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<n.count;U++)o[U]=new R,l[U]=new R;const c=new R,d=new R,u=new R,h=new me,f=new me,g=new me,v=new R,m=new R;function p(U,w,S){c.fromBufferAttribute(n,U),d.fromBufferAttribute(n,w),u.fromBufferAttribute(n,S),h.fromBufferAttribute(s,U),f.fromBufferAttribute(s,w),g.fromBufferAttribute(s,S),d.sub(c),u.sub(c),f.sub(h),g.sub(h);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(v.copy(d).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(P),m.copy(u).multiplyScalar(f.x).addScaledVector(d,-g.x).multiplyScalar(P),o[U].add(v),o[w].add(v),o[S].add(v),l[U].add(m),l[w].add(m),l[S].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let U=0,w=b.length;U<w;++U){const S=b[U],P=S.start,G=S.count;for(let N=P,F=P+G;N<F;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const y=new R,_=new R,L=new R,C=new R;function T(U){L.fromBufferAttribute(r,U),C.copy(L);const w=o[U];y.copy(w),y.sub(L.multiplyScalar(L.dot(w))).normalize(),_.crossVectors(C,w);const P=_.dot(l[U])<0?-1:1;a.setXYZW(U,y.x,y.y,y.z,P)}for(let U=0,w=b.length;U<w;++U){const S=b[U],P=S.start,G=S.count;for(let N=P,F=P+G;N<F;N+=3)T(e.getX(N+0)),T(e.getX(N+1)),T(e.getX(N+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new un(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const r=new R,s=new R,a=new R,o=new R,l=new R,c=new R,d=new R,u=new R;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),d.subVectors(a,s),u.subVectors(r,s),d.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(d),l.add(d),c.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,s),u.subVectors(r,s),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*d;for(let p=0;p<d;p++)h[g++]=c[f++]}return new un(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new yn,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],f=e(h,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const f=c[u];d.push(f.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],u=s[c];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Dl=new at,ai=new Dh,_s=new Cr,Nl=new R,zi=new R,Hi=new R,Gi=new R,Ja=new R,bs=new R,Ss=new me,Ms=new me,ws=new me,Fl=new R,Ol=new R,Bl=new R,Es=new R,Ts=new R;class He extends St{constructor(e=new yn,t=new Yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){bs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],u=s[l];d!==0&&(Ja.fromBufferAttribute(u,e),a?bs.addScaledVector(Ja,d):bs.addScaledVector(Ja.sub(t),d))}t.add(bs)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),_s.copy(n.boundingSphere),_s.applyMatrix4(s),ai.copy(e.ray).recast(e.near),!(_s.containsPoint(ai.origin)===!1&&(ai.intersectSphere(_s,Nl)===null||ai.origin.distanceToSquared(Nl)>(e.far-e.near)**2))&&(Dl.copy(s).invert(),ai.copy(e.ray).applyMatrix4(Dl),!(n.boundingBox!==null&&ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ai)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){const m=h[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,L=y;_<L;_+=3){const C=o.getX(_),T=o.getX(_+1),U=o.getX(_+2);r=As(this,p,e,n,c,d,u,C,T,U),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const b=o.getX(m),y=o.getX(m+1),_=o.getX(m+2);r=As(this,a,e,n,c,d,u,b,y,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){const m=h[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,L=y;_<L;_+=3){const C=_,T=_+1,U=_+2;r=As(this,p,e,n,c,d,u,C,T,U),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const b=m,y=m+1,_=m+2;r=As(this,a,e,n,c,d,u,b,y,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Wh(i,e,t,n,r,s,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===0,o),l===null)return null;Ts.copy(o),Ts.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ts);return c<t.near||c>t.far?null:{distance:c,point:Ts.clone(),object:i}}function As(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,zi),i.getVertexPosition(l,Hi),i.getVertexPosition(c,Gi);const d=Wh(i,e,t,n,zi,Hi,Gi,Es);if(d){r&&(Ss.fromBufferAttribute(r,o),Ms.fromBufferAttribute(r,l),ws.fromBufferAttribute(r,c),d.uv=vn.getInterpolation(Es,zi,Hi,Gi,Ss,Ms,ws,new me)),s&&(Ss.fromBufferAttribute(s,o),Ms.fromBufferAttribute(s,l),ws.fromBufferAttribute(s,c),d.uv1=vn.getInterpolation(Es,zi,Hi,Gi,Ss,Ms,ws,new me)),a&&(Fl.fromBufferAttribute(a,o),Ol.fromBufferAttribute(a,l),Bl.fromBufferAttribute(a,c),d.normal=vn.getInterpolation(Es,zi,Hi,Gi,Fl,Ol,Bl,new R),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};vn.getNormal(zi,Hi,Gi,u.normal),d.face=u}return d}class Ut extends yn{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],u=[];let h=0,f=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Wt(c,3)),this.setAttribute("normal",new Wt(d,3)),this.setAttribute("uv",new Wt(u,2));function g(v,m,p,b,y,_,L,C,T,U,w){const S=_/T,P=L/U,G=_/2,N=L/2,F=C/2,W=T+1,V=U+1;let J=0,X=0;const oe=new R;for(let he=0;he<V;he++){const Me=he*P-N;for(let ee=0;ee<W;ee++){const Ve=ee*S-G;oe[v]=Ve*b,oe[m]=Me*y,oe[p]=F,c.push(oe.x,oe.y,oe.z),oe[v]=0,oe[m]=0,oe[p]=C>0?1:-1,d.push(oe.x,oe.y,oe.z),u.push(ee/T),u.push(1-he/U),J+=1}}for(let he=0;he<U;he++)for(let Me=0;Me<T;Me++){const ee=h+Me+W*he,Ve=h+Me+W*(he+1),K=h+(Me+1)+W*(he+1),de=h+(Me+1)+W*he;l.push(ee,Ve,de),l.push(Ve,K,de),X+=6}o.addGroup(f,X,w),f+=X,h+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ut(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Vi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Xt(i){const e={};for(let t=0;t<i.length;t++){const n=Vi(i[t]);for(const r in n)e[r]=n[r]}return e}function Xh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function zl(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}const Wi={clone:Vi,merge:Xt};var $h=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kt extends Ir{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$h,this.fragmentShader=Yh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Vi(e.uniforms),this.uniformsGroups=Xh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Hl extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=2e3}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new R,Gl=new me,Vl=new me;class Bt extends Hl{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ai*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ai*2*Math.atan(Math.tan(wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qn.x,qn.y).multiplyScalar(-e/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qn.x,qn.y).multiplyScalar(-e/qn.z)}getViewSize(e,t){return this.getViewBounds(e,Gl,Vl),t.subVectors(Vl,Gl)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(wr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Xi=-90,$i=1;class qh extends St{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Bt(Xi,$i,e,t);r.layers=this.layers,this.add(r);const s=new Bt(Xi,$i,e,t);s.layers=this.layers,this.add(s);const a=new Bt(Xi,$i,e,t);a.layers=this.layers,this.add(a);const o=new Bt(Xi,$i,e,t);o.layers=this.layers,this.add(o);const l=new Bt(Xi,$i,e,t);l.layers=this.layers,this.add(l);const c=new Bt(Xi,$i,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,r),e.render(t,d),e.setRenderTarget(u,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Wl extends Ct{constructor(e,t,n,r,s,a,o,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:301,super(e,t,n,r,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Zh extends $t{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Wl(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:1006}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ut(5,5,5),s=new kt({name:"CubemapFromEquirect",uniforms:Vi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new He(r,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new qh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}const eo=new R,jh=new R,Kh=new $e;class oi{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=eo.subVectors(n,t).cross(jh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(eo),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Kh.getNormalMatrix(e),r=this.coplanarPoint(eo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Cr,Rs=new R;class to{constructor(e=new oi,t=new oi,n=new oi,r=new oi,s=new oi,a=new oi){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],d=r[5],u=r[6],h=r[7],f=r[8],g=r[9],v=r[10],m=r[11],p=r[12],b=r[13],y=r[14],_=r[15];if(n[0].setComponents(l-s,h-c,m-f,_-p).normalize(),n[1].setComponents(l+s,h+c,m+f,_+p).normalize(),n[2].setComponents(l+a,h+d,m+g,_+b).normalize(),n[3].setComponents(l-a,h-d,m-g,_-b).normalize(),n[4].setComponents(l-o,h-u,m-v,_-y).normalize(),t===2e3)n[5].setComponents(l+o,h+u,m+v,_+y).normalize();else if(t===2001)n[5].setComponents(o,u,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(e){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Rs.x=r.normal.x>0?e.max.x:e.min.x,Rs.y=r.normal.y>0?e.max.y:e.min.y,Rs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Rs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Xl(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Qh(i){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,d),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const d=l.array,u=l._updateRange,h=l.updateRanges;if(i.bindBuffer(c,o),u.count===-1&&h.length===0&&i.bufferSubData(c,0,d),h.length!==0){for(let f=0,g=h.length;f<g;f++){const v=h[f];i.bufferSubData(c,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}l.clearUpdateRanges()}u.count!==-1&&(i.bufferSubData(c,u.offset*d.BYTES_PER_ELEMENT,d,u.offset,u.count),u.count=-1),l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Yt extends yn{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,d=l+1,u=e/o,h=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<d;p++){const b=p*h-a;for(let y=0;y<c;y++){const _=y*u-s;g.push(_,-b,0),v.push(0,0,1),m.push(y/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const y=b+c*p,_=b+c*(p+1),L=b+1+c*(p+1),C=b+1+c*p;f.push(y,_,C),f.push(_,L,C)}this.setIndex(f),this.setAttribute("position",new Wt(g,3)),this.setAttribute("normal",new Wt(v,3)),this.setAttribute("uv",new Wt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.width,e.height,e.widthSegments,e.heightSegments)}}var Jh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ef=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,tf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,af=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,of=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,cf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,df=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ff=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,pf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,mf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,gf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_f=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Sf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Mf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,wf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ef=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Tf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Af=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Rf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pf="gl_FragColor = linearToOutputTexel( gl_FragColor );",If=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Lf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Uf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Df=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Of=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,zf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Gf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,$f=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Yf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Qf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Jf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ep=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,tp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,np=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ip=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ap=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,cp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,up=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,gp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,yp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Mp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ep=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Tp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ap=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Cp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ip=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Up=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Np=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Op=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Bp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Hp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Vp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$p=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Yp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Qp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ye={alphahash_fragment:Jh,alphahash_pars_fragment:ef,alphamap_fragment:tf,alphamap_pars_fragment:nf,alphatest_fragment:rf,alphatest_pars_fragment:sf,aomap_fragment:af,aomap_pars_fragment:of,batching_pars_vertex:lf,batching_vertex:cf,begin_vertex:df,beginnormal_vertex:uf,bsdfs:hf,iridescence_fragment:ff,bumpmap_pars_fragment:pf,clipping_planes_fragment:mf,clipping_planes_pars_fragment:gf,clipping_planes_pars_vertex:vf,clipping_planes_vertex:yf,color_fragment:xf,color_pars_fragment:_f,color_pars_vertex:bf,color_vertex:Sf,common:Mf,cube_uv_reflection_fragment:wf,defaultnormal_vertex:Ef,displacementmap_pars_vertex:Tf,displacementmap_vertex:Af,emissivemap_fragment:Rf,emissivemap_pars_fragment:Cf,colorspace_fragment:Pf,colorspace_pars_fragment:If,envmap_fragment:Lf,envmap_common_pars_fragment:Uf,envmap_pars_fragment:kf,envmap_pars_vertex:Df,envmap_physical_pars_fragment:$f,envmap_vertex:Nf,fog_vertex:Ff,fog_pars_vertex:Of,fog_fragment:Bf,fog_pars_fragment:zf,gradientmap_pars_fragment:Hf,lightmap_pars_fragment:Gf,lights_lambert_fragment:Vf,lights_lambert_pars_fragment:Wf,lights_pars_begin:Xf,lights_toon_fragment:Yf,lights_toon_pars_fragment:qf,lights_phong_fragment:Zf,lights_phong_pars_fragment:jf,lights_physical_fragment:Kf,lights_physical_pars_fragment:Qf,lights_fragment_begin:Jf,lights_fragment_maps:ep,lights_fragment_end:tp,logdepthbuf_fragment:np,logdepthbuf_pars_fragment:ip,logdepthbuf_pars_vertex:rp,logdepthbuf_vertex:sp,map_fragment:ap,map_pars_fragment:op,map_particle_fragment:lp,map_particle_pars_fragment:cp,metalnessmap_fragment:dp,metalnessmap_pars_fragment:up,morphinstance_vertex:hp,morphcolor_vertex:fp,morphnormal_vertex:pp,morphtarget_pars_vertex:mp,morphtarget_vertex:gp,normal_fragment_begin:vp,normal_fragment_maps:yp,normal_pars_fragment:xp,normal_pars_vertex:_p,normal_vertex:bp,normalmap_pars_fragment:Sp,clearcoat_normal_fragment_begin:Mp,clearcoat_normal_fragment_maps:wp,clearcoat_pars_fragment:Ep,iridescence_pars_fragment:Tp,opaque_fragment:Ap,packing:Rp,premultiplied_alpha_fragment:Cp,project_vertex:Pp,dithering_fragment:Ip,dithering_pars_fragment:Lp,roughnessmap_fragment:Up,roughnessmap_pars_fragment:kp,shadowmap_pars_fragment:Dp,shadowmap_pars_vertex:Np,shadowmap_vertex:Fp,shadowmask_pars_fragment:Op,skinbase_vertex:Bp,skinning_pars_vertex:zp,skinning_vertex:Hp,skinnormal_vertex:Gp,specularmap_fragment:Vp,specularmap_pars_fragment:Wp,tonemapping_fragment:Xp,tonemapping_pars_fragment:$p,transmission_fragment:Yp,transmission_pars_fragment:qp,uv_pars_fragment:Zp,uv_pars_vertex:jp,uv_vertex:Kp,worldpos_vertex:Qp,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},_e={common:{diffuse:{value:new Le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Le(16777215)},opacity:{value:1},center:{value:new me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},xn={basic:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Le(0)},specular:{value:new Le(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:Xt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:Xt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:Xt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:Xt([_e.points,_e.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:Xt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:Xt([_e.common,_e.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:Xt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:Xt([_e.sprite,_e.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:Xt([_e.common,_e.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:Xt([_e.lights,_e.fog,{color:{value:new Le(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};xn.physical={uniforms:Xt([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Le(0)},specularColor:{value:new Le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Cs={r:0,b:0,g:0},ci=new gn,Jp=new at;function em(i,e,t,n,r,s,a){const o=new Le(0);let l=s===!0?0:1,c,d,u=null,h=0,f=null;function g(b){let y=b.isScene===!0?b.background:null;return y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y)),y}function v(b){let y=!1;const _=g(b);_===null?p(o,l):_&&_.isColor&&(p(_,1),y=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,a):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,y){const _=g(y);_&&(_.isCubeTexture||_.mapping===306)?(d===void 0&&(d=new He(new Ut(1,1,1),new kt({name:"BackgroundCubeMaterial",uniforms:Vi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(L,C,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),ci.copy(y.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),d.material.uniforms.envMap.value=_,d.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Jp.makeRotationFromEuler(ci)),d.material.toneMapped=lt.getTransfer(_.colorSpace)!==ht,(u!==_||h!==_.version||f!==i.toneMapping)&&(d.material.needsUpdate=!0,u=_,h=_.version,f=i.toneMapping),d.layers.enableAll(),b.unshift(d,d.geometry,d.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new He(new Yt(2,2),new kt({name:"BackgroundMaterial",uniforms:Vi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=lt.getTransfer(_.colorSpace)!==ht,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||h!==_.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=_,h=_.version,f=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,y){b.getRGB(Cs,zl(i)),n.buffers.color.setClear(Cs.r,Cs.g,Cs.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(b,y=1){o.set(b),l=y,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,p(o,l)},render:v,addToRenderList:m}}function tm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,a=!1;function o(S,P,G,N,F){let W=!1;const V=u(N,G,P);s!==V&&(s=V,c(s.object)),W=f(S,N,G,F),W&&g(S,N,G,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,_(S,P,G,N),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function d(S){return i.deleteVertexArray(S)}function u(S,P,G){const N=G.wireframe===!0;let F=n[S.id];F===void 0&&(F={},n[S.id]=F);let W=F[P.id];W===void 0&&(W={},F[P.id]=W);let V=W[N];return V===void 0&&(V=h(l()),W[N]=V),V}function h(S){const P=[],G=[],N=[];for(let F=0;F<t;F++)P[F]=0,G[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:N,object:S,attributes:{},index:null}}function f(S,P,G,N){const F=s.attributes,W=P.attributes;let V=0;const J=G.getAttributes();for(const X in J)if(J[X].location>=0){const he=F[X];let Me=W[X];if(Me===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(Me=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(Me=S.instanceColor)),he===void 0||he.attribute!==Me||Me&&he.data!==Me.data)return!0;V++}return s.attributesNum!==V||s.index!==N}function g(S,P,G,N){const F={},W=P.attributes;let V=0;const J=G.getAttributes();for(const X in J)if(J[X].location>=0){let he=W[X];he===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(he=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(he=S.instanceColor));const Me={};Me.attribute=he,he&&he.data&&(Me.data=he.data),F[X]=Me,V++}s.attributes=F,s.attributesNum=V,s.index=N}function v(){const S=s.newAttributes;for(let P=0,G=S.length;P<G;P++)S[P]=0}function m(S){p(S,0)}function p(S,P){const G=s.newAttributes,N=s.enabledAttributes,F=s.attributeDivisors;G[S]=1,N[S]===0&&(i.enableVertexAttribArray(S),N[S]=1),F[S]!==P&&(i.vertexAttribDivisor(S,P),F[S]=P)}function b(){const S=s.newAttributes,P=s.enabledAttributes;for(let G=0,N=P.length;G<N;G++)P[G]!==S[G]&&(i.disableVertexAttribArray(G),P[G]=0)}function y(S,P,G,N,F,W,V){V===!0?i.vertexAttribIPointer(S,P,G,F,W):i.vertexAttribPointer(S,P,G,N,F,W)}function _(S,P,G,N){v();const F=N.attributes,W=G.getAttributes(),V=P.defaultAttributeValues;for(const J in W){const X=W[J];if(X.location>=0){let oe=F[J];if(oe===void 0&&(J==="instanceMatrix"&&S.instanceMatrix&&(oe=S.instanceMatrix),J==="instanceColor"&&S.instanceColor&&(oe=S.instanceColor)),oe!==void 0){const he=oe.normalized,Me=oe.itemSize,ee=e.get(oe);if(ee===void 0)continue;const Ve=ee.buffer,K=ee.type,de=ee.bytesPerElement,we=K===i.INT||K===i.UNSIGNED_INT||oe.gpuType===1013;if(oe.isInterleavedBufferAttribute){const xe=oe.data,Be=xe.stride,Ne=oe.offset;if(xe.isInstancedInterleavedBuffer){for(let We=0;We<X.locationSize;We++)p(X.location+We,xe.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let We=0;We<X.locationSize;We++)m(X.location+We);i.bindBuffer(i.ARRAY_BUFFER,Ve);for(let We=0;We<X.locationSize;We++)y(X.location+We,Me/X.locationSize,K,he,Be*de,(Ne+Me/X.locationSize*We)*de,we)}else{if(oe.isInstancedBufferAttribute){for(let xe=0;xe<X.locationSize;xe++)p(X.location+xe,oe.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let xe=0;xe<X.locationSize;xe++)m(X.location+xe);i.bindBuffer(i.ARRAY_BUFFER,Ve);for(let xe=0;xe<X.locationSize;xe++)y(X.location+xe,Me/X.locationSize,K,he,Me*de,Me/X.locationSize*xe*de,we)}}else if(V!==void 0){const he=V[J];if(he!==void 0)switch(he.length){case 2:i.vertexAttrib2fv(X.location,he);break;case 3:i.vertexAttrib3fv(X.location,he);break;case 4:i.vertexAttrib4fv(X.location,he);break;default:i.vertexAttrib1fv(X.location,he)}}}}b()}function L(){U();for(const S in n){const P=n[S];for(const G in P){const N=P[G];for(const F in N)d(N[F].object),delete N[F];delete P[G]}delete n[S]}}function C(S){if(n[S.id]===void 0)return;const P=n[S.id];for(const G in P){const N=P[G];for(const F in N)d(N[F].object),delete N[F];delete P[G]}delete n[S.id]}function T(S){for(const P in n){const G=n[P];if(G[S.id]===void 0)continue;const N=G[S.id];for(const F in N)d(N[F].object),delete N[F];delete G[S.id]}}function U(){w(),a=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:U,resetDefaultState:w,dispose:L,releaseStatesOfGeometry:C,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function nm(i,e,t){let n;function r(c){n=c}function s(c,d){i.drawArrays(n,c,d),t.update(d,n,1)}function a(c,d,u){u!==0&&(i.drawArraysInstanced(n,c,d,u),t.update(d,n,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,u);let f=0;for(let g=0;g<u;g++)f+=d[g];t.update(f,n,1)}function l(c,d,u,h){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],d[g],h[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,d,0,h,0,u);let g=0;for(let v=0;v<u;v++)g+=d[v];for(let v=0;v<h.length;v++)t.update(g,n,h[v])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function im(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==1023&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const T=C===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==1009&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==1015&&!T)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,L=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:v,maxAttributes:m,maxVertexUniforms:p,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:_,maxSamples:L}}function rm(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new oi,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||n!==0||r;return r=h,n=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?d(null):c();else{const b=s?0:n,y=b*4;let _=p.clippingState||null;l.value=_,_=d(g,h,y,f);for(let L=0;L!==y;++L)_[L]=t[L];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,h,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,_=f;y!==v;++y,_+=4)a.copy(u[y]).applyMatrix4(b,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function sm(i){let e=new WeakMap;function t(a,o){return o===303?a.mapping=301:o===304&&(a.mapping=302),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===303||o===304)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Zh(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Ps extends Hl{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Yi=4,$l=[.125,.215,.35,.446,.526,.582],di=20,no=new Ps,Yl=new Le;let io=null,ro=0,so=0,ao=!1;const ui=(1+Math.sqrt(5))/2,qi=1/ui,ql=[new R(-ui,qi,0),new R(ui,qi,0),new R(-qi,0,ui),new R(qi,0,ui),new R(0,ui,-qi),new R(0,ui,qi),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class Is{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){io=this._renderer.getRenderTarget(),ro=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),ao=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(io,ro,so),this._renderer.xr.enabled=ao,e.scissorTest=!1,Ls(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),io=this._renderer.getRenderTarget(),ro=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),ao=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:nn,depthBuffer:!1},r=Zl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zl(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=am(s)),this._blurMaterial=om(s,e,t)}return r}_compileMaterial(e){const t=new He(this._lodPlanes[0],e);this._renderer.compile(t,no)}_sceneToCubeUV(e,t,n,r){const o=new Bt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(Yl),d.toneMapping=0,d.autoClear=!1;const f=new Yn({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),g=new He(new Ut,f);let v=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,v=!0):(f.color.copy(Yl),v=!0);for(let p=0;p<6;p++){const b=p%3;b===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):b===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const y=this._cubeSize;Ls(r,b*y,p>2?y:0,y,y),d.setRenderTarget(r),v&&d.render(g,o),d.render(e,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new He(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Ls(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,no)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ql[(r-s-1)%ql.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new He(this._lodPlanes[r],c),h=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*di-1),v=s/g,m=isFinite(s)?1+Math.floor(d*v):di;m>di&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${di}`);const p=[];let b=0;for(let T=0;T<di;++T){const U=T/v,w=Math.exp(-U*U/2);p.push(w),T===0?b+=w:T<m&&(b+=2*w)}for(let T=0;T<p.length;T++)p[T]=p[T]/b;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:y}=this;h.dTheta.value=g,h.mipInt.value=y-n;const _=this._sizeLods[r],L=3*_*(r>y-Yi?r-y+Yi:0),C=4*(this._cubeSize-_);Ls(t,L,C,3*_,2*_),l.setRenderTarget(t),l.render(u,no)}}function am(i){const e=[],t=[],n=[];let r=i;const s=i-Yi+1+$l.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>i-Yi?l=$l[a-i+Yi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,g=6,v=3,m=2,p=1,b=new Float32Array(v*g*f),y=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let C=0;C<f;C++){const T=C%3*2/3-1,U=C>2?0:-1,w=[T,U,0,T+2/3,U,0,T+2/3,U+1,0,T,U,0,T+2/3,U+1,0,T,U+1,0];b.set(w,v*g*C),y.set(h,m*g*C);const S=[C,C,C,C,C,C];_.set(S,p*g*C)}const L=new yn;L.setAttribute("position",new un(b,v)),L.setAttribute("uv",new un(y,m)),L.setAttribute("faceIndex",new un(_,p)),e.push(L),r>Yi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Zl(i,e,t){const n=new $t(i,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ls(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function om(i,e,t){const n=new Float32Array(di),r=new R(0,1,0);return new kt({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function jl(){return new kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Kl(){return new kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function oo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function lm(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===303||l===304,d=l===301||l===302;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Is(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||d&&f&&r(f)?(t===null&&(t=new Is(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function cm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&vl("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function dm(i,e,t,n){const r={},s=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const v=h.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)e.remove(v[m])}h.removeEventListener("dispose",a),delete r[h.id];const f=s.get(h);f&&(e.remove(f),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const g in h)e.update(h[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)e.update(v[m],i.ARRAY_BUFFER)}}function c(u){const h=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const b=f.array;v=f.version;for(let y=0,_=b.length;y<_;y+=3){const L=b[y+0],C=b[y+1],T=b[y+2];h.push(L,C,C,T,T,L)}}else if(g!==void 0){const b=g.array;v=g.version;for(let y=0,_=b.length/3-1;y<_;y+=3){const L=y+0,C=y+1,T=y+2;h.push(L,C,C,T,T,L)}}else return;const m=new(ml(h)?kl:Ul)(h,1);m.version=v;const p=s.get(u);p&&e.remove(p),s.set(u,m)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function um(i,e,t){let n;function r(h){n=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,f){i.drawElements(n,f,s,h*a),t.update(f,n,1)}function c(h,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,h*a,g),t.update(f,n,g))}function d(h,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,h,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(h,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,h,0,v,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b];for(let b=0;b<v.length;b++)t.update(p,n,v[b])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function hm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function fm(i,e,t){const n=new WeakMap,r=new ft;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=n.get(o);if(h===void 0||h.count!==u){let w=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;f===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let _=o.attributes.position.count*y,L=1;_>e.maxTextureSize&&(L=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const C=new Float32Array(_*L*4*u),T=new bl(C,_,L,u);T.type=1015,T.needsUpdate=!0;const U=y*4;for(let S=0;S<u;S++){const P=m[S],G=p[S],N=b[S],F=_*L*4*S;for(let W=0;W<P.count;W++){const V=W*U;f===!0&&(r.fromBufferAttribute(P,W),C[F+V+0]=r.x,C[F+V+1]=r.y,C[F+V+2]=r.z,C[F+V+3]=0),g===!0&&(r.fromBufferAttribute(G,W),C[F+V+4]=r.x,C[F+V+5]=r.y,C[F+V+6]=r.z,C[F+V+7]=0),v===!0&&(r.fromBufferAttribute(N,W),C[F+V+8]=r.x,C[F+V+9]=r.y,C[F+V+10]=r.z,C[F+V+11]=N.itemSize===4?r.w:1)}}h={count:u,texture:T,size:new me(_,L)},n.set(o,h),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function pm(i,e,t,n){let r=new WeakMap;function s(l){const c=n.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return u}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class Ql extends Ct{constructor(e,t,n,r,s,a,o,l,c,d=1026){if(d!==1026&&d!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===1026&&(n=1014),n===void 0&&d===1027&&(n=1020),super(null,r,s,a,o,l,d,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Jl=new Ct,ec=new Ql(1,1),tc=new bl,nc=new Uh,ic=new Wl,rc=[],sc=[],ac=new Float32Array(16),oc=new Float32Array(9),lc=new Float32Array(4);function Zi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=rc[r];if(s===void 0&&(s=new Float32Array(r),rc[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function At(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Us(i,e){let t=sc[e];t===void 0&&(t=new Int32Array(e),sc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function mm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function gm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),At(t,e)}}function vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),At(t,e)}}function ym(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),At(t,e)}}function xm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;lc.set(n),i.uniformMatrix2fv(this.addr,!1,lc),At(t,n)}}function _m(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;oc.set(n),i.uniformMatrix3fv(this.addr,!1,oc),At(t,n)}}function bm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;ac.set(n),i.uniformMatrix4fv(this.addr,!1,ac),At(t,n)}}function Sm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Mm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),At(t,e)}}function wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),At(t,e)}}function Em(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),At(t,e)}}function Tm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Am(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),At(t,e)}}function Rm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),At(t,e)}}function Cm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),At(t,e)}}function Pm(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(ec.compareFunction=515,s=ec):s=Jl,t.setTexture2D(e||s,r)}function Im(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||nc,r)}function Lm(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||ic,r)}function Um(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||tc,r)}function km(i){switch(i){case 5126:return mm;case 35664:return gm;case 35665:return vm;case 35666:return ym;case 35674:return xm;case 35675:return _m;case 35676:return bm;case 5124:case 35670:return Sm;case 35667:case 35671:return Mm;case 35668:case 35672:return wm;case 35669:case 35673:return Em;case 5125:return Tm;case 36294:return Am;case 36295:return Rm;case 36296:return Cm;case 35678:case 36198:case 36298:case 36306:case 35682:return Pm;case 35679:case 36299:case 36307:return Im;case 35680:case 36300:case 36308:case 36293:return Lm;case 36289:case 36303:case 36311:case 36292:return Um}}function Dm(i,e){i.uniform1fv(this.addr,e)}function Nm(i,e){const t=Zi(e,this.size,2);i.uniform2fv(this.addr,t)}function Fm(i,e){const t=Zi(e,this.size,3);i.uniform3fv(this.addr,t)}function Om(i,e){const t=Zi(e,this.size,4);i.uniform4fv(this.addr,t)}function Bm(i,e){const t=Zi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function zm(i,e){const t=Zi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Hm(i,e){const t=Zi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Gm(i,e){i.uniform1iv(this.addr,e)}function Vm(i,e){i.uniform2iv(this.addr,e)}function Wm(i,e){i.uniform3iv(this.addr,e)}function Xm(i,e){i.uniform4iv(this.addr,e)}function $m(i,e){i.uniform1uiv(this.addr,e)}function Ym(i,e){i.uniform2uiv(this.addr,e)}function qm(i,e){i.uniform3uiv(this.addr,e)}function Zm(i,e){i.uniform4uiv(this.addr,e)}function jm(i,e,t){const n=this.cache,r=e.length,s=Us(t,r);Tt(n,s)||(i.uniform1iv(this.addr,s),At(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Jl,s[a])}function Km(i,e,t){const n=this.cache,r=e.length,s=Us(t,r);Tt(n,s)||(i.uniform1iv(this.addr,s),At(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||nc,s[a])}function Qm(i,e,t){const n=this.cache,r=e.length,s=Us(t,r);Tt(n,s)||(i.uniform1iv(this.addr,s),At(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||ic,s[a])}function Jm(i,e,t){const n=this.cache,r=e.length,s=Us(t,r);Tt(n,s)||(i.uniform1iv(this.addr,s),At(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||tc,s[a])}function eg(i){switch(i){case 5126:return Dm;case 35664:return Nm;case 35665:return Fm;case 35666:return Om;case 35674:return Bm;case 35675:return zm;case 35676:return Hm;case 5124:case 35670:return Gm;case 35667:case 35671:return Vm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return $m;case 36294:return Ym;case 36295:return qm;case 36296:return Zm;case 35678:case 36198:case 36298:case 36306:case 35682:return jm;case 35679:case 36299:case 36307:return Km;case 35680:case 36300:case 36308:case 36293:return Qm;case 36289:case 36303:case 36311:case 36292:return Jm}}class tg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=km(t.type)}}class ng{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=eg(t.type)}}class ig{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const lo=/(\w+)(\])?(\[|\.)?/g;function cc(i,e){i.seq.push(e),i.map[e.id]=e}function rg(i,e,t){const n=i.name,r=n.length;for(lo.lastIndex=0;;){const s=lo.exec(n),a=lo.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){cc(t,c===void 0?new tg(o,i,e):new ng(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new ig(o),cc(t,u)),t=u}}}class ks{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);rg(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function dc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const sg=37297;let ag=0;function og(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function lg(i){const e=lt.getPrimaries(lt.workingColorSpace),t=lt.getPrimaries(i);let n;switch(e===t?n="":e===cs&&t===ls?n="LinearDisplayP3ToLinearSRGB":e===ls&&t===cs&&(n="LinearSRGBToLinearDisplayP3"),i){case nn:case as:return[n,"LinearTransferOETF"];case Nt:case Da:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function uc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+og(i.getShaderSource(e),a)}else return r}function cg(i,e){const t=lg(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function dg(i,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="OptimizedCineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function ug(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ur).join(`
`)}function hg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function fg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ur(i){return i!==""}function hc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function fc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const pg=/^[ \t]*#include +<([\w\d./]+)>/gm;function co(i){return i.replace(pg,gg)}const mg=new Map;function gg(i,e){let t=Ye[e];if(t===void 0){const n=mg.get(e);if(n!==void 0)t=Ye[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return co(t)}const vg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pc(i){return i.replace(vg,yg)}function yg(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function mc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function xg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===1?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===2?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===3&&(e="SHADOWMAP_TYPE_VSM"),e}function _g(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function bg(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function Sg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function Mg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function wg(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=xg(t),c=_g(t),d=bg(t),u=Sg(t),h=Mg(t),f=ug(t),g=hg(s),v=r.createProgram();let m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ur).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ur).join(`
`),p.length>0&&(p+=`
`)):(m=[mc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ur).join(`
`),p=[mc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ye.tonemapping_pars_fragment:"",t.toneMapping!==0?dg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,cg("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ur).join(`
`)),a=co(a),a=hc(a,t),a=fc(a,t),o=co(o),o=hc(o,t),o=fc(o,t),a=pc(a),o=pc(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===fl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===fl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=b+m+a,_=b+p+o,L=dc(r,r.VERTEX_SHADER,y),C=dc(r,r.FRAGMENT_SHADER,_);r.attachShader(v,L),r.attachShader(v,C),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function T(P){if(i.debug.checkShaderErrors){const G=r.getProgramInfoLog(v).trim(),N=r.getShaderInfoLog(L).trim(),F=r.getShaderInfoLog(C).trim();let W=!0,V=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,L,C);else{const J=uc(r,L,"vertex"),X=uc(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+G+`
`+J+`
`+X)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(N===""||F==="")&&(V=!1);V&&(P.diagnostics={runnable:W,programLog:G,vertexShader:{log:N,prefix:m},fragmentShader:{log:F,prefix:p}})}r.deleteShader(L),r.deleteShader(C),U=new ks(r,v),w=fg(r,v)}let U;this.getUniforms=function(){return U===void 0&&T(this),U};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(v,sg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ag++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=L,this.fragmentShader=C,this}let Eg=0;class Tg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Ag(e),t.set(e,n)),n}}class Ag{constructor(e){this.id=Eg++,this.code=e,this.usedTimes=0}}function Rg(i,e,t,n,r,s,a){const o=new El,l=new Tg,c=new Set,d=[],u=r.logarithmicDepthBuffer,h=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,S,P,G,N){const F=G.fog,W=N.geometry,V=w.isMeshStandardMaterial?G.environment:null,J=(w.isMeshStandardMaterial?t:e).get(w.envMap||V),X=J&&J.mapping===306?J.image.height:null,oe=g[w.type];w.precision!==null&&(f=r.getMaxPrecision(w.precision),f!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",f,"instead."));const he=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Me=he!==void 0?he.length:0;let ee=0;W.morphAttributes.position!==void 0&&(ee=1),W.morphAttributes.normal!==void 0&&(ee=2),W.morphAttributes.color!==void 0&&(ee=3);let Ve,K,de,we;if(oe){const Ke=xn[oe];Ve=Ke.vertexShader,K=Ke.fragmentShader}else Ve=w.vertexShader,K=w.fragmentShader,l.update(w),de=l.getVertexShaderID(w),we=l.getFragmentShaderID(w);const xe=i.getRenderTarget(),Be=N.isInstancedMesh===!0,Ne=N.isBatchedMesh===!0,We=!!w.map,Je=!!w.matcap,k=!!J,ct=!!w.aoMap,Xe=!!w.lightMap,Ue=!!w.bumpMap,Re=!!w.normalMap,dt=!!w.displacementMap,Fe=!!w.emissiveMap,ze=!!w.metalnessMap,I=!!w.roughnessMap,M=w.anisotropy>0,$=w.clearcoat>0,re=w.dispersion>0,le=w.iridescence>0,ie=w.sheen>0,Ie=w.transmission>0,ge=M&&!!w.anisotropyMap,A=$&&!!w.clearcoatMap,j=$&&!!w.clearcoatNormalMap,B=$&&!!w.clearcoatRoughnessMap,Q=le&&!!w.iridescenceMap,se=le&&!!w.iridescenceThicknessMap,pe=ie&&!!w.sheenColorMap,ae=ie&&!!w.sheenRoughnessMap,ve=!!w.specularMap,Ae=!!w.specularColorMap,ke=!!w.specularIntensityMap,D=Ie&&!!w.transmissionMap,ue=Ie&&!!w.thicknessMap,te=!!w.gradientMap,ne=!!w.alphaMap,ce=w.alphaTest>0,Ee=!!w.alphaHash,et=!!w.extensions;let gt=0;w.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(gt=i.toneMapping);const wt={shaderID:oe,shaderType:w.type,shaderName:w.name,vertexShader:Ve,fragmentShader:K,defines:w.defines,customVertexShaderID:de,customFragmentShaderID:we,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:f,batching:Ne,batchingColor:Ne&&N._colorsTexture!==null,instancing:Be,instancingColor:Be&&N.instanceColor!==null,instancingMorph:Be&&N.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:xe===null?i.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:nn,alphaToCoverage:!!w.alphaToCoverage,map:We,matcap:Je,envMap:k,envMapMode:k&&J.mapping,envMapCubeUVHeight:X,aoMap:ct,lightMap:Xe,bumpMap:Ue,normalMap:Re,displacementMap:h&&dt,emissiveMap:Fe,normalMapObjectSpace:Re&&w.normalMapType===1,normalMapTangentSpace:Re&&w.normalMapType===0,metalnessMap:ze,roughnessMap:I,anisotropy:M,anisotropyMap:ge,clearcoat:$,clearcoatMap:A,clearcoatNormalMap:j,clearcoatRoughnessMap:B,dispersion:re,iridescence:le,iridescenceMap:Q,iridescenceThicknessMap:se,sheen:ie,sheenColorMap:pe,sheenRoughnessMap:ae,specularMap:ve,specularColorMap:Ae,specularIntensityMap:ke,transmission:Ie,transmissionMap:D,thicknessMap:ue,gradientMap:te,opaque:w.transparent===!1&&w.blending===1&&w.alphaToCoverage===!1,alphaMap:ne,alphaTest:ce,alphaHash:Ee,combine:w.combine,mapUv:We&&v(w.map.channel),aoMapUv:ct&&v(w.aoMap.channel),lightMapUv:Xe&&v(w.lightMap.channel),bumpMapUv:Ue&&v(w.bumpMap.channel),normalMapUv:Re&&v(w.normalMap.channel),displacementMapUv:dt&&v(w.displacementMap.channel),emissiveMapUv:Fe&&v(w.emissiveMap.channel),metalnessMapUv:ze&&v(w.metalnessMap.channel),roughnessMapUv:I&&v(w.roughnessMap.channel),anisotropyMapUv:ge&&v(w.anisotropyMap.channel),clearcoatMapUv:A&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:j&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:B&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:se&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:ae&&v(w.sheenRoughnessMap.channel),specularMapUv:ve&&v(w.specularMap.channel),specularColorMapUv:Ae&&v(w.specularColorMap.channel),specularIntensityMapUv:ke&&v(w.specularIntensityMap.channel),transmissionMapUv:D&&v(w.transmissionMap.channel),thicknessMapUv:ue&&v(w.thicknessMap.channel),alphaMapUv:ne&&v(w.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Re||M),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!W.attributes.uv&&(We||ne),fog:!!F,useFog:w.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:N.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:ee,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:gt,decodeVideoTexture:We&&w.map.isVideoTexture===!0&&lt.getTransfer(w.map.colorSpace)===ht,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===2,flipSided:w.side===1,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:et&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(et&&w.extensions.multiDraw===!0||Ne)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return wt.vertexUv1s=c.has(1),wt.vertexUv2s=c.has(2),wt.vertexUv3s=c.has(3),c.clear(),wt}function p(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)S.push(P),S.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(b(S,w),y(S,w),S.push(i.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function b(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function y(w,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.skinning&&o.enable(4),S.morphTargets&&o.enable(5),S.morphNormals&&o.enable(6),S.morphColors&&o.enable(7),S.premultipliedAlpha&&o.enable(8),S.shadowMapEnabled&&o.enable(9),S.doubleSided&&o.enable(10),S.flipSided&&o.enable(11),S.useDepthPacking&&o.enable(12),S.dithering&&o.enable(13),S.transmission&&o.enable(14),S.sheen&&o.enable(15),S.opaque&&o.enable(16),S.pointsUvs&&o.enable(17),S.decodeVideoTexture&&o.enable(18),S.alphaToCoverage&&o.enable(19),w.push(o.mask)}function _(w){const S=g[w.type];let P;if(S){const G=xn[S];P=Wi.clone(G.uniforms)}else P=w.uniforms;return P}function L(w,S){let P;for(let G=0,N=d.length;G<N;G++){const F=d[G];if(F.cacheKey===S){P=F,++P.usedTimes;break}}return P===void 0&&(P=new wg(i,S,w,s),d.push(P)),P}function C(w){if(--w.usedTimes===0){const S=d.indexOf(w);d[S]=d[d.length-1],d.pop(),w.destroy()}}function T(w){l.remove(w)}function U(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:L,releaseProgram:C,releaseShaderCache:T,programs:d,dispose:U}}function Cg(){let i=new WeakMap;function e(s){let a=i.get(s);return a===void 0&&(a={},i.set(s,a)),a}function t(s){i.delete(s)}function n(s,a,o){i.get(s)[a]=o}function r(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:r}}function Pg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function gc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function vc(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(u,h,f,g,v,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),e++,p}function o(u,h,f,g,v,m){const p=a(u,h,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(u,h,f,g,v,m){const p=a(u,h,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(u,h){t.length>1&&t.sort(u||Pg),n.length>1&&n.sort(h||gc),r.length>1&&r.sort(h||gc)}function d(){for(let u=e,h=i.length;u<h;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:d,sort:c}}function Ig(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new vc,i.set(n,[a])):r>=s.length?(a=new vc,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Lg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Le};break;case"SpotLight":t={position:new R,direction:new R,color:new Le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Le,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Le,groundColor:new Le};break;case"RectAreaLight":t={color:new Le,position:new R,halfWidth:new R,halfHeight:new R};break}return i[e.id]=t,t}}}function Ug(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let kg=0;function Dg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Ng(i){const e=new Lg,t=Ug(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const r=new R,s=new at,a=new at;function o(c){let d=0,u=0,h=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,b=0,y=0,_=0,L=0,C=0,T=0;c.sort(Dg);for(let w=0,S=c.length;w<S;w++){const P=c[w],G=P.color,N=P.intensity,F=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=G.r*N,u+=G.g*N,h+=G.b*N;else if(P.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(P.sh.coefficients[V],N);T++}else if(P.isDirectionalLight){const V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const J=P.shadow,X=t.get(P);X.shadowIntensity=J.intensity,X.shadowBias=J.bias,X.shadowNormalBias=J.normalBias,X.shadowRadius=J.radius,X.shadowMapSize=J.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=P.shadow.matrix,b++}n.directional[f]=V,f++}else if(P.isSpotLight){const V=e.get(P);V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(G).multiplyScalar(N),V.distance=F,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,n.spot[v]=V;const J=P.shadow;if(P.map&&(n.spotLightMap[L]=P.map,L++,J.updateMatrices(P),P.castShadow&&C++),n.spotLightMatrix[v]=J.matrix,P.castShadow){const X=t.get(P);X.shadowIntensity=J.intensity,X.shadowBias=J.bias,X.shadowNormalBias=J.normalBias,X.shadowRadius=J.radius,X.shadowMapSize=J.mapSize,n.spotShadow[v]=X,n.spotShadowMap[v]=W,_++}v++}else if(P.isRectAreaLight){const V=e.get(P);V.color.copy(G).multiplyScalar(N),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=V,m++}else if(P.isPointLight){const V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),V.distance=P.distance,V.decay=P.decay,P.castShadow){const J=P.shadow,X=t.get(P);X.shadowIntensity=J.intensity,X.shadowBias=J.bias,X.shadowNormalBias=J.normalBias,X.shadowRadius=J.radius,X.shadowMapSize=J.mapSize,X.shadowCameraNear=J.camera.near,X.shadowCameraFar=J.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=P.shadow.matrix,y++}n.point[g]=V,g++}else if(P.isHemisphereLight){const V=e.get(P);V.skyColor.copy(P.color).multiplyScalar(N),V.groundColor.copy(P.groundColor).multiplyScalar(N),n.hemi[p]=V,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;const U=n.hash;(U.directionalLength!==f||U.pointLength!==g||U.spotLength!==v||U.rectAreaLength!==m||U.hemiLength!==p||U.numDirectionalShadows!==b||U.numPointShadows!==y||U.numSpotShadows!==_||U.numSpotMaps!==L||U.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=_+L-C,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=T,U.directionalLength=f,U.pointLength=g,U.spotLength=v,U.rectAreaLength=m,U.hemiLength=p,U.numDirectionalShadows=b,U.numPointShadows=y,U.numSpotShadows=_,U.numSpotMaps=L,U.numLightProbes=T,n.version=kg++)}function l(c,d){let u=0,h=0,f=0,g=0,v=0;const m=d.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const y=c[p];if(y.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),u++}else if(y.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(m),a.identity(),s.copy(y.matrixWorld),s.premultiply(m),a.extractRotation(s),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const _=n.point[h];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(m),h++}else if(y.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function yc(i){const e=new Ng(i),t=[],n=[];function r(d){c.camera=d,t.length=0,n.length=0}function s(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function Fg(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new yc(i),e.set(r,[o])):s>=a.length?(o=new yc(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class Og extends Ir{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Bg extends Ir{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Gg(i,e,t){let n=new to;const r=new me,s=new me,a=new ft,o=new Og({depthPacking:3201}),l=new Bg,c={},d=t.maxTextureSize,u={0:1,1:0,2:2},h=new kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new me},radius:{value:4}},vertexShader:zg,fragmentShader:Hg}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new yn;g.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new He(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(C,T,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const w=i.getRenderTarget(),S=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),G=i.state;G.setBlending(0),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const N=p!==3&&this.type===3,F=p===3&&this.type!==3;for(let W=0,V=C.length;W<V;W++){const J=C[W],X=J.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const oe=X.getFrameExtents();if(r.multiply(oe),s.copy(X.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/oe.x),r.x=s.x*oe.x,X.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/oe.y),r.y=s.y*oe.y,X.mapSize.y=s.y)),X.map===null||N===!0||F===!0){const Me=this.type!==3?{minFilter:1003,magFilter:1003}:{};X.map!==null&&X.map.dispose(),X.map=new $t(r.x,r.y,Me),X.map.texture.name=J.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const he=X.getViewportCount();for(let Me=0;Me<he;Me++){const ee=X.getViewport(Me);a.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),G.viewport(a),X.updateMatrices(J,Me),n=X.getFrustum(),_(T,U,X.camera,J,this.type)}X.isPointLightShadow!==!0&&this.type===3&&b(X,U),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(w,S,P)};function b(C,T){const U=e.update(v);h.defines.VSM_SAMPLES!==C.blurSamples&&(h.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new $t(r.x,r.y)),h.uniforms.shadow_pass.value=C.map.texture,h.uniforms.resolution.value=C.mapSize,h.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(T,null,U,h,v,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(T,null,U,f,v,null)}function y(C,T,U,w){let S=null;const P=U.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(P!==void 0)S=P;else if(S=U.isPointLight===!0?l:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const G=S.uuid,N=T.uuid;let F=c[G];F===void 0&&(F={},c[G]=F);let W=F[N];W===void 0&&(W=S.clone(),F[N]=W,T.addEventListener("dispose",L)),S=W}if(S.visible=T.visible,S.wireframe=T.wireframe,w===3?S.side=T.shadowSide!==null?T.shadowSide:T.side:S.side=T.shadowSide!==null?T.shadowSide:u[T.side],S.alphaMap=T.alphaMap,S.alphaTest=T.alphaTest,S.map=T.map,S.clipShadows=T.clipShadows,S.clippingPlanes=T.clippingPlanes,S.clipIntersection=T.clipIntersection,S.displacementMap=T.displacementMap,S.displacementScale=T.displacementScale,S.displacementBias=T.displacementBias,S.wireframeLinewidth=T.wireframeLinewidth,S.linewidth=T.linewidth,U.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const G=i.properties.get(S);G.light=U}return S}function _(C,T,U,w,S){if(C.visible===!1)return;if(C.layers.test(T.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&S===3)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,C.matrixWorld);const N=e.update(C),F=C.material;if(Array.isArray(F)){const W=N.groups;for(let V=0,J=W.length;V<J;V++){const X=W[V],oe=F[X.materialIndex];if(oe&&oe.visible){const he=y(C,oe,w,S);C.onBeforeShadow(i,C,T,U,N,he,X),i.renderBufferDirect(U,null,N,he,C,X),C.onAfterShadow(i,C,T,U,N,he,X)}}}else if(F.visible){const W=y(C,F,w,S);C.onBeforeShadow(i,C,T,U,N,W,null),i.renderBufferDirect(U,null,N,W,C,null),C.onAfterShadow(i,C,T,U,N,W,null)}}const G=C.children;for(let N=0,F=G.length;N<F;N++)_(G[N],T,U,w,S)}function L(C){C.target.removeEventListener("dispose",L);for(const U in c){const w=c[U],S=C.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}function Vg(i){function e(){let D=!1;const ue=new ft;let te=null;const ne=new ft(0,0,0,0);return{setMask:function(ce){te!==ce&&!D&&(i.colorMask(ce,ce,ce,ce),te=ce)},setLocked:function(ce){D=ce},setClear:function(ce,Ee,et,gt,wt){wt===!0&&(ce*=gt,Ee*=gt,et*=gt),ue.set(ce,Ee,et,gt),ne.equals(ue)===!1&&(i.clearColor(ce,Ee,et,gt),ne.copy(ue))},reset:function(){D=!1,te=null,ne.set(-1,0,0,0)}}}function t(){let D=!1,ue=null,te=null,ne=null;return{setTest:function(ce){ce?we(i.DEPTH_TEST):xe(i.DEPTH_TEST)},setMask:function(ce){ue!==ce&&!D&&(i.depthMask(ce),ue=ce)},setFunc:function(ce){if(te!==ce){switch(ce){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}te=ce}},setLocked:function(ce){D=ce},setClear:function(ce){ne!==ce&&(i.clearDepth(ce),ne=ce)},reset:function(){D=!1,ue=null,te=null,ne=null}}}function n(){let D=!1,ue=null,te=null,ne=null,ce=null,Ee=null,et=null,gt=null,wt=null;return{setTest:function(Ke){D||(Ke?we(i.STENCIL_TEST):xe(i.STENCIL_TEST))},setMask:function(Ke){ue!==Ke&&!D&&(i.stencilMask(Ke),ue=Ke)},setFunc:function(Ke,ut,Dt){(te!==Ke||ne!==ut||ce!==Dt)&&(i.stencilFunc(Ke,ut,Dt),te=Ke,ne=ut,ce=Dt)},setOp:function(Ke,ut,Dt){(Ee!==Ke||et!==ut||gt!==Dt)&&(i.stencilOp(Ke,ut,Dt),Ee=Ke,et=ut,gt=Dt)},setLocked:function(Ke){D=Ke},setClear:function(Ke){wt!==Ke&&(i.clearStencil(Ke),wt=Ke)},reset:function(){D=!1,ue=null,te=null,ne=null,ce=null,Ee=null,et=null,gt=null,wt=null}}}const r=new e,s=new t,a=new n,o=new WeakMap,l=new WeakMap;let c={},d={},u=new WeakMap,h=[],f=null,g=!1,v=null,m=null,p=null,b=null,y=null,_=null,L=null,C=new Le(0,0,0),T=0,U=!1,w=null,S=null,P=null,G=null,N=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,V=0;const J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(J)[1]),W=V>=1):J.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),W=V>=2);let X=null,oe={};const he=i.getParameter(i.SCISSOR_BOX),Me=i.getParameter(i.VIEWPORT),ee=new ft().fromArray(he),Ve=new ft().fromArray(Me);function K(D,ue,te,ne){const ce=new Uint8Array(4),Ee=i.createTexture();i.bindTexture(D,Ee),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let et=0;et<te;et++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(ue,0,i.RGBA,1,1,ne,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(ue+et,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return Ee}const de={};de[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),de[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),de[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),we(i.DEPTH_TEST),s.setFunc(3),Ue(!1),Re(1),we(i.CULL_FACE),ct(0);function we(D){c[D]!==!0&&(i.enable(D),c[D]=!0)}function xe(D){c[D]!==!1&&(i.disable(D),c[D]=!1)}function Be(D,ue){return d[D]!==ue?(i.bindFramebuffer(D,ue),d[D]=ue,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ue),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ue),!0):!1}function Ne(D,ue){let te=h,ne=!1;if(D){te=u.get(ue),te===void 0&&(te=[],u.set(ue,te));const ce=D.textures;if(te.length!==ce.length||te[0]!==i.COLOR_ATTACHMENT0){for(let Ee=0,et=ce.length;Ee<et;Ee++)te[Ee]=i.COLOR_ATTACHMENT0+Ee;te.length=ce.length,ne=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,ne=!0);ne&&i.drawBuffers(te)}function We(D){return f!==D?(i.useProgram(D),f=D,!0):!1}const Je={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};Je[103]=i.MIN,Je[104]=i.MAX;const k={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function ct(D,ue,te,ne,ce,Ee,et,gt,wt,Ke){if(D===0){g===!0&&(xe(i.BLEND),g=!1);return}if(g===!1&&(we(i.BLEND),g=!0),D!==5){if(D!==v||Ke!==U){if((m!==100||y!==100)&&(i.blendEquation(i.FUNC_ADD),m=100,y=100),Ke)switch(D){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}p=null,b=null,_=null,L=null,C.set(0,0,0),T=0,v=D,U=Ke}return}ce=ce||ue,Ee=Ee||te,et=et||ne,(ue!==m||ce!==y)&&(i.blendEquationSeparate(Je[ue],Je[ce]),m=ue,y=ce),(te!==p||ne!==b||Ee!==_||et!==L)&&(i.blendFuncSeparate(k[te],k[ne],k[Ee],k[et]),p=te,b=ne,_=Ee,L=et),(gt.equals(C)===!1||wt!==T)&&(i.blendColor(gt.r,gt.g,gt.b,wt),C.copy(gt),T=wt),v=D,U=!1}function Xe(D,ue){D.side===2?xe(i.CULL_FACE):we(i.CULL_FACE);let te=D.side===1;ue&&(te=!te),Ue(te),D.blending===1&&D.transparent===!1?ct(0):ct(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),s.setFunc(D.depthFunc),s.setTest(D.depthTest),s.setMask(D.depthWrite),r.setMask(D.colorWrite);const ne=D.stencilWrite;a.setTest(ne),ne&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Fe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?we(i.SAMPLE_ALPHA_TO_COVERAGE):xe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(D){w!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),w=D)}function Re(D){D!==0?(we(i.CULL_FACE),D!==S&&(D===1?i.cullFace(i.BACK):D===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):xe(i.CULL_FACE),S=D}function dt(D){D!==P&&(W&&i.lineWidth(D),P=D)}function Fe(D,ue,te){D?(we(i.POLYGON_OFFSET_FILL),(G!==ue||N!==te)&&(i.polygonOffset(ue,te),G=ue,N=te)):xe(i.POLYGON_OFFSET_FILL)}function ze(D){D?we(i.SCISSOR_TEST):xe(i.SCISSOR_TEST)}function I(D){D===void 0&&(D=i.TEXTURE0+F-1),X!==D&&(i.activeTexture(D),X=D)}function M(D,ue,te){te===void 0&&(X===null?te=i.TEXTURE0+F-1:te=X);let ne=oe[te];ne===void 0&&(ne={type:void 0,texture:void 0},oe[te]=ne),(ne.type!==D||ne.texture!==ue)&&(X!==te&&(i.activeTexture(te),X=te),i.bindTexture(D,ue||de[D]),ne.type=D,ne.texture=ue)}function $(){const D=oe[X];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function re(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function le(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ie(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ge(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function A(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function B(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function pe(D){ee.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ee.copy(D))}function ae(D){Ve.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Ve.copy(D))}function ve(D,ue){let te=l.get(ue);te===void 0&&(te=new WeakMap,l.set(ue,te));let ne=te.get(D);ne===void 0&&(ne=i.getUniformBlockIndex(ue,D.name),te.set(D,ne))}function Ae(D,ue){const ne=l.get(ue).get(D);o.get(ue)!==ne&&(i.uniformBlockBinding(ue,ne,D.__bindingPointIndex),o.set(ue,ne))}function ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},X=null,oe={},d={},u=new WeakMap,h=[],f=null,g=!1,v=null,m=null,p=null,b=null,y=null,_=null,L=null,C=new Le(0,0,0),T=0,U=!1,w=null,S=null,P=null,G=null,N=null,ee.set(0,0,i.canvas.width,i.canvas.height),Ve.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:we,disable:xe,bindFramebuffer:Be,drawBuffers:Ne,useProgram:We,setBlending:ct,setMaterial:Xe,setFlipSided:Ue,setCullFace:Re,setLineWidth:dt,setPolygonOffset:Fe,setScissorTest:ze,activeTexture:I,bindTexture:M,unbindTexture:$,compressedTexImage2D:re,compressedTexImage3D:le,texImage2D:Q,texImage3D:se,updateUBOMapping:ve,uniformBlockBinding:Ae,texStorage2D:j,texStorage3D:B,texSubImage2D:ie,texSubImage3D:Ie,compressedTexSubImage2D:ge,compressedTexSubImage3D:A,scissor:pe,viewport:ae,reset:ke}}function xc(i,e,t,n){const r=Wg(n);switch(t){case 1021:return i*e;case 1024:return i*e;case 1025:return i*e*2;case 1028:return i*e/r.components*r.byteLength;case 1029:return i*e/r.components*r.byteLength;case 1030:return i*e*2/r.components*r.byteLength;case 1031:return i*e*2/r.components*r.byteLength;case 1022:return i*e*3/r.components*r.byteLength;case 1023:return i*e*4/r.components*r.byteLength;case 1033:return i*e*4/r.components*r.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Wg(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Xg(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new me,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(I){}function g(I,M){return f?new OffscreenCanvas(I,M):Tr("canvas")}function v(I,M,$){let re=1;const le=ze(I);if((le.width>$||le.height>$)&&(re=$/Math.max(le.width,le.height)),re<1)if(typeof HTMLImageElement!="undefined"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&I instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&I instanceof ImageBitmap||typeof VideoFrame!="undefined"&&I instanceof VideoFrame){const ie=Math.floor(re*le.width),Ie=Math.floor(re*le.height);u===void 0&&(u=g(ie,Ie));const ge=M?g(ie,Ie):u;return ge.width=ie,ge.height=Ie,ge.getContext("2d").drawImage(I,0,0,ie,Ie),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+le.width+"x"+le.height+") to ("+ie+"x"+Ie+")."),ge}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+le.width+"x"+le.height+")."),I;return I}function m(I){return I.generateMipmaps&&I.minFilter!==1003&&I.minFilter!==1006}function p(I){i.generateMipmap(I)}function b(I,M,$,re,le=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ie=M;if(M===i.RED&&($===i.FLOAT&&(ie=i.R32F),$===i.HALF_FLOAT&&(ie=i.R16F),$===i.UNSIGNED_BYTE&&(ie=i.R8)),M===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(ie=i.R8UI),$===i.UNSIGNED_SHORT&&(ie=i.R16UI),$===i.UNSIGNED_INT&&(ie=i.R32UI),$===i.BYTE&&(ie=i.R8I),$===i.SHORT&&(ie=i.R16I),$===i.INT&&(ie=i.R32I)),M===i.RG&&($===i.FLOAT&&(ie=i.RG32F),$===i.HALF_FLOAT&&(ie=i.RG16F),$===i.UNSIGNED_BYTE&&(ie=i.RG8)),M===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(ie=i.RG8UI),$===i.UNSIGNED_SHORT&&(ie=i.RG16UI),$===i.UNSIGNED_INT&&(ie=i.RG32UI),$===i.BYTE&&(ie=i.RG8I),$===i.SHORT&&(ie=i.RG16I),$===i.INT&&(ie=i.RG32I)),M===i.RGB&&$===i.UNSIGNED_INT_5_9_9_9_REV&&(ie=i.RGB9_E5),M===i.RGBA){const Ie=le?os:lt.getTransfer(re);$===i.FLOAT&&(ie=i.RGBA32F),$===i.HALF_FLOAT&&(ie=i.RGBA16F),$===i.UNSIGNED_BYTE&&(ie=Ie===ht?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(ie=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(ie=i.RGB5_A1)}return(ie===i.R16F||ie===i.R32F||ie===i.RG16F||ie===i.RG32F||ie===i.RGBA16F||ie===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function y(I,M){let $;return I?M===null||M===1014||M===1020?$=i.DEPTH24_STENCIL8:M===1015?$=i.DEPTH32F_STENCIL8:M===1012&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===1014||M===1020?$=i.DEPTH_COMPONENT24:M===1015?$=i.DEPTH_COMPONENT32F:M===1012&&($=i.DEPTH_COMPONENT16),$}function _(I,M){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==1003&&I.minFilter!==1006?Math.log2(Math.max(M.width,M.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?M.mipmaps.length:1}function L(I){const M=I.target;M.removeEventListener("dispose",L),T(M),M.isVideoTexture&&d.delete(M)}function C(I){const M=I.target;M.removeEventListener("dispose",C),w(M)}function T(I){const M=n.get(I);if(M.__webglInit===void 0)return;const $=I.source,re=h.get($);if(re){const le=re[M.__cacheKey];le.usedTimes--,le.usedTimes===0&&U(I),Object.keys(re).length===0&&h.delete($)}n.remove(I)}function U(I){const M=n.get(I);i.deleteTexture(M.__webglTexture);const $=I.source,re=h.get($);delete re[M.__cacheKey],a.memory.textures--}function w(I){const M=n.get(I);if(I.depthTexture&&I.depthTexture.dispose(),I.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(M.__webglFramebuffer[re]))for(let le=0;le<M.__webglFramebuffer[re].length;le++)i.deleteFramebuffer(M.__webglFramebuffer[re][le]);else i.deleteFramebuffer(M.__webglFramebuffer[re]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[re])}else{if(Array.isArray(M.__webglFramebuffer))for(let re=0;re<M.__webglFramebuffer.length;re++)i.deleteFramebuffer(M.__webglFramebuffer[re]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let re=0;re<M.__webglColorRenderbuffer.length;re++)M.__webglColorRenderbuffer[re]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[re]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const $=I.textures;for(let re=0,le=$.length;re<le;re++){const ie=n.get($[re]);ie.__webglTexture&&(i.deleteTexture(ie.__webglTexture),a.memory.textures--),n.remove($[re])}n.remove(I)}let S=0;function P(){S=0}function G(){const I=S;return I>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+r.maxTextures),S+=1,I}function N(I){const M=[];return M.push(I.wrapS),M.push(I.wrapT),M.push(I.wrapR||0),M.push(I.magFilter),M.push(I.minFilter),M.push(I.anisotropy),M.push(I.internalFormat),M.push(I.format),M.push(I.type),M.push(I.generateMipmaps),M.push(I.premultiplyAlpha),M.push(I.flipY),M.push(I.unpackAlignment),M.push(I.colorSpace),M.join()}function F(I,M){const $=n.get(I);if(I.isVideoTexture&&dt(I),I.isRenderTargetTexture===!1&&I.version>0&&$.__version!==I.version){const re=I.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ve($,I,M);return}}t.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+M)}function W(I,M){const $=n.get(I);if(I.version>0&&$.__version!==I.version){Ve($,I,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+M)}function V(I,M){const $=n.get(I);if(I.version>0&&$.__version!==I.version){Ve($,I,M);return}t.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+M)}function J(I,M){const $=n.get(I);if(I.version>0&&$.__version!==I.version){K($,I,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+M)}const X={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},oe={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},he={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function Me(I,M){if(M.type===1015&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===1006||M.magFilter===1007||M.magFilter===1005||M.magFilter===1008||M.minFilter===1006||M.minFilter===1007||M.minFilter===1005||M.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,X[M.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,X[M.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,X[M.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,oe[M.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,oe[M.minFilter]),M.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,he[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===1003||M.minFilter!==1005&&M.minFilter!==1008||M.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const $=e.get("EXT_texture_filter_anisotropic");i.texParameterf(I,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function ee(I,M){let $=!1;I.__webglInit===void 0&&(I.__webglInit=!0,M.addEventListener("dispose",L));const re=M.source;let le=h.get(re);le===void 0&&(le={},h.set(re,le));const ie=N(M);if(ie!==I.__cacheKey){le[ie]===void 0&&(le[ie]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,$=!0),le[ie].usedTimes++;const Ie=le[I.__cacheKey];Ie!==void 0&&(le[I.__cacheKey].usedTimes--,Ie.usedTimes===0&&U(M)),I.__cacheKey=ie,I.__webglTexture=le[ie].texture}return $}function Ve(I,M,$){let re=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(re=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(re=i.TEXTURE_3D);const le=ee(I,M),ie=M.source;t.bindTexture(re,I.__webglTexture,i.TEXTURE0+$);const Ie=n.get(ie);if(ie.version!==Ie.__version||le===!0){t.activeTexture(i.TEXTURE0+$);const ge=lt.getPrimaries(lt.workingColorSpace),A=M.colorSpace===Cn?null:lt.getPrimaries(M.colorSpace),j=M.colorSpace===Cn||ge===A?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let B=v(M.image,!1,r.maxTextureSize);B=Fe(M,B);const Q=s.convert(M.format,M.colorSpace),se=s.convert(M.type);let pe=b(M.internalFormat,Q,se,M.colorSpace,M.isVideoTexture);Me(re,M);let ae;const ve=M.mipmaps,Ae=M.isVideoTexture!==!0,ke=Ie.__version===void 0||le===!0,D=ie.dataReady,ue=_(M,B);if(M.isDepthTexture)pe=y(M.format===1027,M.type),ke&&(Ae?t.texStorage2D(i.TEXTURE_2D,1,pe,B.width,B.height):t.texImage2D(i.TEXTURE_2D,0,pe,B.width,B.height,0,Q,se,null));else if(M.isDataTexture)if(ve.length>0){Ae&&ke&&t.texStorage2D(i.TEXTURE_2D,ue,pe,ve[0].width,ve[0].height);for(let te=0,ne=ve.length;te<ne;te++)ae=ve[te],Ae?D&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ae.width,ae.height,Q,se,ae.data):t.texImage2D(i.TEXTURE_2D,te,pe,ae.width,ae.height,0,Q,se,ae.data);M.generateMipmaps=!1}else Ae?(ke&&t.texStorage2D(i.TEXTURE_2D,ue,pe,B.width,B.height),D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,B.width,B.height,Q,se,B.data)):t.texImage2D(i.TEXTURE_2D,0,pe,B.width,B.height,0,Q,se,B.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ae&&ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,pe,ve[0].width,ve[0].height,B.depth);for(let te=0,ne=ve.length;te<ne;te++)if(ae=ve[te],M.format!==1023)if(Q!==null)if(Ae){if(D)if(M.layerUpdates.size>0){const ce=xc(ae.width,ae.height,M.format,M.type);for(const Ee of M.layerUpdates){const et=ae.data.subarray(Ee*ce/ae.data.BYTES_PER_ELEMENT,(Ee+1)*ce/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,Ee,ae.width,ae.height,1,Q,et,0,0)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ae.width,ae.height,B.depth,Q,ae.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,pe,ae.width,ae.height,B.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ae?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ae.width,ae.height,B.depth,Q,se,ae.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,pe,ae.width,ae.height,B.depth,0,Q,se,ae.data)}else{Ae&&ke&&t.texStorage2D(i.TEXTURE_2D,ue,pe,ve[0].width,ve[0].height);for(let te=0,ne=ve.length;te<ne;te++)ae=ve[te],M.format!==1023?Q!==null?Ae?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,ae.width,ae.height,Q,ae.data):t.compressedTexImage2D(i.TEXTURE_2D,te,pe,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ae?D&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ae.width,ae.height,Q,se,ae.data):t.texImage2D(i.TEXTURE_2D,te,pe,ae.width,ae.height,0,Q,se,ae.data)}else if(M.isDataArrayTexture)if(Ae){if(ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,pe,B.width,B.height,B.depth),D)if(M.layerUpdates.size>0){const te=xc(B.width,B.height,M.format,M.type);for(const ne of M.layerUpdates){const ce=B.data.subarray(ne*te/B.data.BYTES_PER_ELEMENT,(ne+1)*te/B.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ne,B.width,B.height,1,Q,se,ce)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,B.width,B.height,B.depth,Q,se,B.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,pe,B.width,B.height,B.depth,0,Q,se,B.data);else if(M.isData3DTexture)Ae?(ke&&t.texStorage3D(i.TEXTURE_3D,ue,pe,B.width,B.height,B.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,B.width,B.height,B.depth,Q,se,B.data)):t.texImage3D(i.TEXTURE_3D,0,pe,B.width,B.height,B.depth,0,Q,se,B.data);else if(M.isFramebufferTexture){if(ke)if(Ae)t.texStorage2D(i.TEXTURE_2D,ue,pe,B.width,B.height);else{let te=B.width,ne=B.height;for(let ce=0;ce<ue;ce++)t.texImage2D(i.TEXTURE_2D,ce,pe,te,ne,0,Q,se,null),te>>=1,ne>>=1}}else if(ve.length>0){if(Ae&&ke){const te=ze(ve[0]);t.texStorage2D(i.TEXTURE_2D,ue,pe,te.width,te.height)}for(let te=0,ne=ve.length;te<ne;te++)ae=ve[te],Ae?D&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,Q,se,ae):t.texImage2D(i.TEXTURE_2D,te,pe,Q,se,ae);M.generateMipmaps=!1}else if(Ae){if(ke){const te=ze(B);t.texStorage2D(i.TEXTURE_2D,ue,pe,te.width,te.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Q,se,B)}else t.texImage2D(i.TEXTURE_2D,0,pe,Q,se,B);m(M)&&p(re),Ie.__version=ie.version,M.onUpdate&&M.onUpdate(M)}I.__version=M.version}function K(I,M,$){if(M.image.length!==6)return;const re=ee(I,M),le=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+$);const ie=n.get(le);if(le.version!==ie.__version||re===!0){t.activeTexture(i.TEXTURE0+$);const Ie=lt.getPrimaries(lt.workingColorSpace),ge=M.colorSpace===Cn?null:lt.getPrimaries(M.colorSpace),A=M.colorSpace===Cn||Ie===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,A);const j=M.isCompressedTexture||M.image[0].isCompressedTexture,B=M.image[0]&&M.image[0].isDataTexture,Q=[];for(let ne=0;ne<6;ne++)!j&&!B?Q[ne]=v(M.image[ne],!0,r.maxCubemapSize):Q[ne]=B?M.image[ne].image:M.image[ne],Q[ne]=Fe(M,Q[ne]);const se=Q[0],pe=s.convert(M.format,M.colorSpace),ae=s.convert(M.type),ve=b(M.internalFormat,pe,ae,M.colorSpace),Ae=M.isVideoTexture!==!0,ke=ie.__version===void 0||re===!0,D=le.dataReady;let ue=_(M,se);Me(i.TEXTURE_CUBE_MAP,M);let te;if(j){Ae&&ke&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,ve,se.width,se.height);for(let ne=0;ne<6;ne++){te=Q[ne].mipmaps;for(let ce=0;ce<te.length;ce++){const Ee=te[ce];M.format!==1023?pe!==null?Ae?D&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce,0,0,Ee.width,Ee.height,pe,Ee.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce,ve,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ae?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce,0,0,Ee.width,Ee.height,pe,ae,Ee.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce,ve,Ee.width,Ee.height,0,pe,ae,Ee.data)}}}else{if(te=M.mipmaps,Ae&&ke){te.length>0&&ue++;const ne=ze(Q[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,ve,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(B){Ae?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Q[ne].width,Q[ne].height,pe,ae,Q[ne].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,ve,Q[ne].width,Q[ne].height,0,pe,ae,Q[ne].data);for(let ce=0;ce<te.length;ce++){const et=te[ce].image[ne].image;Ae?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce+1,0,0,et.width,et.height,pe,ae,et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce+1,ve,et.width,et.height,0,pe,ae,et.data)}}else{Ae?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,pe,ae,Q[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,ve,pe,ae,Q[ne]);for(let ce=0;ce<te.length;ce++){const Ee=te[ce];Ae?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce+1,0,0,pe,ae,Ee.image[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce+1,ve,pe,ae,Ee.image[ne])}}}m(M)&&p(i.TEXTURE_CUBE_MAP),ie.__version=le.version,M.onUpdate&&M.onUpdate(M)}I.__version=M.version}function de(I,M,$,re,le,ie){const Ie=s.convert($.format,$.colorSpace),ge=s.convert($.type),A=b($.internalFormat,Ie,ge,$.colorSpace);if(!n.get(M).__hasExternalTextures){const B=Math.max(1,M.width>>ie),Q=Math.max(1,M.height>>ie);le===i.TEXTURE_3D||le===i.TEXTURE_2D_ARRAY?t.texImage3D(le,ie,A,B,Q,M.depth,0,Ie,ge,null):t.texImage2D(le,ie,A,B,Q,0,Ie,ge,null)}t.bindFramebuffer(i.FRAMEBUFFER,I),Re(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,le,n.get($).__webglTexture,0,Ue(M)):(le===i.TEXTURE_2D||le>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&le<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,re,le,n.get($).__webglTexture,ie),t.bindFramebuffer(i.FRAMEBUFFER,null)}function we(I,M,$){if(i.bindRenderbuffer(i.RENDERBUFFER,I),M.depthBuffer){const re=M.depthTexture,le=re&&re.isDepthTexture?re.type:null,ie=y(M.stencilBuffer,le),Ie=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=Ue(M);Re(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge,ie,M.width,M.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge,ie,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ie,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ie,i.RENDERBUFFER,I)}else{const re=M.textures;for(let le=0;le<re.length;le++){const ie=re[le],Ie=s.convert(ie.format,ie.colorSpace),ge=s.convert(ie.type),A=b(ie.internalFormat,Ie,ge,ie.colorSpace),j=Ue(M);$&&Re(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,j,A,M.width,M.height):Re(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,j,A,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,A,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xe(I,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,I),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),F(M.depthTexture,0);const re=n.get(M.depthTexture).__webglTexture,le=Ue(M);if(M.depthTexture.format===1026)Re(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0,le):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0);else if(M.depthTexture.format===1027)Re(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0,le):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Be(I){const M=n.get(I),$=I.isWebGLCubeRenderTarget===!0;if(I.depthTexture&&!M.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");xe(M.__webglFramebuffer,I)}else if($){M.__webglDepthbuffer=[];for(let re=0;re<6;re++)t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[re]),M.__webglDepthbuffer[re]=i.createRenderbuffer(),we(M.__webglDepthbuffer[re],I,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=i.createRenderbuffer(),we(M.__webglDepthbuffer,I,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ne(I,M,$){const re=n.get(I);M!==void 0&&de(re.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&Be(I)}function We(I){const M=I.texture,$=n.get(I),re=n.get(M);I.addEventListener("dispose",C);const le=I.textures,ie=I.isWebGLCubeRenderTarget===!0,Ie=le.length>1;if(Ie||(re.__webglTexture===void 0&&(re.__webglTexture=i.createTexture()),re.__version=M.version,a.memory.textures++),ie){$.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(M.mipmaps&&M.mipmaps.length>0){$.__webglFramebuffer[ge]=[];for(let A=0;A<M.mipmaps.length;A++)$.__webglFramebuffer[ge][A]=i.createFramebuffer()}else $.__webglFramebuffer[ge]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){$.__webglFramebuffer=[];for(let ge=0;ge<M.mipmaps.length;ge++)$.__webglFramebuffer[ge]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(Ie)for(let ge=0,A=le.length;ge<A;ge++){const j=n.get(le[ge]);j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&Re(I)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let ge=0;ge<le.length;ge++){const A=le[ge];$.__webglColorRenderbuffer[ge]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[ge]);const j=s.convert(A.format,A.colorSpace),B=s.convert(A.type),Q=b(A.internalFormat,j,B,A.colorSpace,I.isXRRenderTarget===!0),se=Ue(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,se,Q,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,$.__webglColorRenderbuffer[ge])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),we($.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ie){t.bindTexture(i.TEXTURE_CUBE_MAP,re.__webglTexture),Me(i.TEXTURE_CUBE_MAP,M);for(let ge=0;ge<6;ge++)if(M.mipmaps&&M.mipmaps.length>0)for(let A=0;A<M.mipmaps.length;A++)de($.__webglFramebuffer[ge][A],I,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,A);else de($.__webglFramebuffer[ge],I,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);m(M)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ie){for(let ge=0,A=le.length;ge<A;ge++){const j=le[ge],B=n.get(j);t.bindTexture(i.TEXTURE_2D,B.__webglTexture),Me(i.TEXTURE_2D,j),de($.__webglFramebuffer,I,j,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,0),m(j)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let ge=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(ge=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,re.__webglTexture),Me(ge,M),M.mipmaps&&M.mipmaps.length>0)for(let A=0;A<M.mipmaps.length;A++)de($.__webglFramebuffer[A],I,M,i.COLOR_ATTACHMENT0,ge,A);else de($.__webglFramebuffer,I,M,i.COLOR_ATTACHMENT0,ge,0);m(M)&&p(ge),t.unbindTexture()}I.depthBuffer&&Be(I)}function Je(I){const M=I.textures;for(let $=0,re=M.length;$<re;$++){const le=M[$];if(m(le)){const ie=I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Ie=n.get(le).__webglTexture;t.bindTexture(ie,Ie),p(ie),t.unbindTexture()}}}const k=[],ct=[];function Xe(I){if(I.samples>0){if(Re(I)===!1){const M=I.textures,$=I.width,re=I.height;let le=i.COLOR_BUFFER_BIT;const ie=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ie=n.get(I),ge=M.length>1;if(ge)for(let A=0;A<M.length;A++)t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+A,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+A,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let A=0;A<M.length;A++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(le|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(le|=i.STENCIL_BUFFER_BIT)),ge){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ie.__webglColorRenderbuffer[A]);const j=n.get(M[A]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,j,0)}i.blitFramebuffer(0,0,$,re,0,0,$,re,le,i.NEAREST),l===!0&&(k.length=0,ct.length=0,k.push(i.COLOR_ATTACHMENT0+A),I.depthBuffer&&I.resolveDepthBuffer===!1&&(k.push(ie),ct.push(ie),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ct)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,k))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ge)for(let A=0;A<M.length;A++){t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+A,i.RENDERBUFFER,Ie.__webglColorRenderbuffer[A]);const j=n.get(M[A]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+A,i.TEXTURE_2D,j,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){const M=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Ue(I){return Math.min(r.maxSamples,I.samples)}function Re(I){const M=n.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function dt(I){const M=a.render.frame;d.get(I)!==M&&(d.set(I,M),I.update())}function Fe(I,M){const $=I.colorSpace,re=I.format,le=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||$!==nn&&$!==Cn&&(lt.getTransfer($)===ht?(re!==1023||le!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),M}function ze(I){return typeof HTMLImageElement!="undefined"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame!="undefined"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=P,this.setTexture2D=F,this.setTexture2DArray=W,this.setTexture3D=V,this.setTextureCube=J,this.rebindTextures=Ne,this.setupRenderTarget=We,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=Xe,this.setupDepthRenderbuffer=Be,this.setupFrameBufferTexture=de,this.useMultisampledRTT=Re}function $g(i,e){function t(n,r=Cn){let s;const a=lt.getTransfer(r);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1024)return i.LUMINANCE;if(n===1025)return i.LUMINANCE_ALPHA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===ht)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===ht?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===ht?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36492)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Yg extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Zn extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qg={type:"move"};class uo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qg)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Zn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Zg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Kg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new Ct,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new kt({vertexShader:Zg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new He(new Yt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Qg extends Ti{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,f=null,g=null;const v=new Kg,m=t.getContextAttributes();let p=null,b=null;const y=[],_=[],L=new me;let C=null;const T=new Bt;T.layers.enable(1),T.viewport=new ft;const U=new Bt;U.layers.enable(2),U.viewport=new ft;const w=[T,U],S=new Yg;S.layers.enable(1),S.layers.enable(2);let P=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let de=y[K];return de===void 0&&(de=new uo,y[K]=de),de.getTargetRaySpace()},this.getControllerGrip=function(K){let de=y[K];return de===void 0&&(de=new uo,y[K]=de),de.getGripSpace()},this.getHand=function(K){let de=y[K];return de===void 0&&(de=new uo,y[K]=de),de.getHandSpace()};function N(K){const de=_.indexOf(K.inputSource);if(de===-1)return;const we=y[de];we!==void 0&&(we.update(K.inputSource,K.frame,c||a),we.dispatchEvent({type:K.type,data:K.inputSource}))}function F(){r.removeEventListener("select",N),r.removeEventListener("selectstart",N),r.removeEventListener("selectend",N),r.removeEventListener("squeeze",N),r.removeEventListener("squeezestart",N),r.removeEventListener("squeezeend",N),r.removeEventListener("end",F),r.removeEventListener("inputsourceschange",W);for(let K=0;K<y.length;K++){const de=_[K];de!==null&&(_[K]=null,y[K].disconnect(de))}P=null,G=null,v.reset(),e.setRenderTarget(p),f=null,h=null,u=null,r=null,b=null,Ve.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",N),r.addEventListener("selectstart",N),r.addEventListener("selectend",N),r.addEventListener("squeeze",N),r.addEventListener("squeezestart",N),r.addEventListener("squeezeend",N),r.addEventListener("end",F),r.addEventListener("inputsourceschange",W),m.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(L),r.renderState.layers===void 0){const de={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,de),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new $t(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let de=null,we=null,xe=null;m.depth&&(xe=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=m.stencil?1027:1026,we=m.stencil?1020:1014);const Be={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:s};u=new XRWebGLBinding(r,t),h=u.createProjectionLayer(Be),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),b=new $t(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new Ql(h.textureWidth,h.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Ve.setContext(r),Ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function W(K){for(let de=0;de<K.removed.length;de++){const we=K.removed[de],xe=_.indexOf(we);xe>=0&&(_[xe]=null,y[xe].disconnect(we))}for(let de=0;de<K.added.length;de++){const we=K.added[de];let xe=_.indexOf(we);if(xe===-1){for(let Ne=0;Ne<y.length;Ne++)if(Ne>=_.length){_.push(we),xe=Ne;break}else if(_[Ne]===null){_[Ne]=we,xe=Ne;break}if(xe===-1)break}const Be=y[xe];Be&&Be.connect(we)}}const V=new R,J=new R;function X(K,de,we){V.setFromMatrixPosition(de.matrixWorld),J.setFromMatrixPosition(we.matrixWorld);const xe=V.distanceTo(J),Be=de.projectionMatrix.elements,Ne=we.projectionMatrix.elements,We=Be[14]/(Be[10]-1),Je=Be[14]/(Be[10]+1),k=(Be[9]+1)/Be[5],ct=(Be[9]-1)/Be[5],Xe=(Be[8]-1)/Be[0],Ue=(Ne[8]+1)/Ne[0],Re=We*Xe,dt=We*Ue,Fe=xe/(-Xe+Ue),ze=Fe*-Xe;de.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(ze),K.translateZ(Fe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert();const I=We+Fe,M=Je+Fe,$=Re-ze,re=dt+(xe-ze),le=k*Je/M*I,ie=ct*Je/M*I;K.projectionMatrix.makePerspective($,re,le,ie,I,M),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}function oe(K,de){de===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(de.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;v.texture!==null&&(K.near=v.depthNear,K.far=v.depthFar),S.near=U.near=T.near=K.near,S.far=U.far=T.far=K.far,(P!==S.near||G!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),P=S.near,G=S.far,T.near=P,T.far=G,U.near=P,U.far=G,T.updateProjectionMatrix(),U.updateProjectionMatrix(),K.updateProjectionMatrix());const de=K.parent,we=S.cameras;oe(S,de);for(let xe=0;xe<we.length;xe++)oe(we[xe],de);we.length===2?X(S,T,U):S.projectionMatrix.copy(T.projectionMatrix),he(K,S,de)};function he(K,de,we){we===null?K.matrix.copy(de.matrixWorld):(K.matrix.copy(we.matrixWorld),K.matrix.invert(),K.matrix.multiply(de.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(de.projectionMatrix),K.projectionMatrixInverse.copy(de.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ai*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(K){l=K,h!==null&&(h.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let Me=null;function ee(K,de){if(d=de.getViewerPose(c||a),g=de,d!==null){const we=d.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let xe=!1;we.length!==S.cameras.length&&(S.cameras.length=0,xe=!0);for(let Ne=0;Ne<we.length;Ne++){const We=we[Ne];let Je=null;if(f!==null)Je=f.getViewport(We);else{const ct=u.getViewSubImage(h,We);Je=ct.viewport,Ne===0&&(e.setRenderTargetTextures(b,ct.colorTexture,h.ignoreDepthValues?void 0:ct.depthStencilTexture),e.setRenderTarget(b))}let k=w[Ne];k===void 0&&(k=new Bt,k.layers.enable(Ne),k.viewport=new ft,w[Ne]=k),k.matrix.fromArray(We.transform.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale),k.projectionMatrix.fromArray(We.projectionMatrix),k.projectionMatrixInverse.copy(k.projectionMatrix).invert(),k.viewport.set(Je.x,Je.y,Je.width,Je.height),Ne===0&&(S.matrix.copy(k.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),xe===!0&&S.cameras.push(k)}const Be=r.enabledFeatures;if(Be&&Be.includes("depth-sensing")){const Ne=u.getDepthInformation(we[0]);Ne&&Ne.isValid&&Ne.texture&&v.init(e,Ne,r.renderState)}}for(let we=0;we<y.length;we++){const xe=_[we],Be=y[we];xe!==null&&Be!==void 0&&Be.update(xe,de,c||a)}Me&&Me(K,de),de.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:de}),g=null}const Ve=new Xl;Ve.setAnimationLoop(ee),this.setAnimationLoop=function(K){Me=K},this.dispose=function(){}}}const hi=new gn,Jg=new at;function ev(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,zl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,b,y,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),d(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=e.get(p),y=b.envMap,_=b.envMapRotation;y&&(m.envMap.value=y,hi.copy(_),hi.x*=-1,hi.y*=-1,hi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(Jg.makeRotationFromEuler(hi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function tv(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,y){const _=y.program;n.uniformBlockBinding(b,_)}function c(b,y){let _=r[b.id];_===void 0&&(g(b),_=d(b),r[b.id]=_,b.addEventListener("dispose",m));const L=y.program;n.updateUBOMapping(b,L);const C=e.render.frame;s[b.id]!==C&&(h(b),s[b.id]=C)}function d(b){const y=u();b.__bindingPointIndex=y;const _=i.createBuffer(),L=b.__size,C=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,L,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){const y=r[b.id],_=b.uniforms,L=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let C=0,T=_.length;C<T;C++){const U=Array.isArray(_[C])?_[C]:[_[C]];for(let w=0,S=U.length;w<S;w++){const P=U[w];if(f(P,C,w,L)===!0){const G=P.__offset,N=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let W=0;W<N.length;W++){const V=N[W],J=v(V);typeof V=="number"||typeof V=="boolean"?(P.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,G+F,P.__data)):V.isMatrix3?(P.__data[0]=V.elements[0],P.__data[1]=V.elements[1],P.__data[2]=V.elements[2],P.__data[3]=0,P.__data[4]=V.elements[3],P.__data[5]=V.elements[4],P.__data[6]=V.elements[5],P.__data[7]=0,P.__data[8]=V.elements[6],P.__data[9]=V.elements[7],P.__data[10]=V.elements[8],P.__data[11]=0):(V.toArray(P.__data,F),F+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,y,_,L){const C=b.value,T=y+"_"+_;if(L[T]===void 0)return typeof C=="number"||typeof C=="boolean"?L[T]=C:L[T]=C.clone(),!0;{const U=L[T];if(typeof C=="number"||typeof C=="boolean"){if(U!==C)return L[T]=C,!0}else if(U.equals(C)===!1)return U.copy(C),!0}return!1}function g(b){const y=b.uniforms;let _=0;const L=16;for(let T=0,U=y.length;T<U;T++){const w=Array.isArray(y[T])?y[T]:[y[T]];for(let S=0,P=w.length;S<P;S++){const G=w[S],N=Array.isArray(G.value)?G.value:[G.value];for(let F=0,W=N.length;F<W;F++){const V=N[F],J=v(V),X=_%L;X!==0&&L-X<J.boundary&&(_+=L-X),G.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=_,_+=J.storage}}}const C=_%L;return C>0&&(_+=L-C),b.__size=_,b.__cache={},this}function v(b){const y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function m(b){const y=b.target;y.removeEventListener("dispose",m);const _=a.indexOf(y.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function p(){for(const b in r)i.deleteBuffer(r[b]);a=[],r={},s={}}return{bind:l,update:c,dispose:p}}class nv{constructor(e={}){const{canvas:t=Th(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=a;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Nt,this.toneMapping=0,this.toneMappingExposure=1;const y=this;let _=!1,L=0,C=0,T=null,U=-1,w=null;const S=new ft,P=new ft;let G=null;const N=new Le(0);let F=0,W=t.width,V=t.height,J=1,X=null,oe=null;const he=new ft(0,0,W,V),Me=new ft(0,0,W,V);let ee=!1;const Ve=new to;let K=!1,de=!1;const we=new at,xe=new R,Be=new ft,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let We=!1;function Je(){return T===null?J:1}let k=n;function ct(E,O){return t.getContext(E,O)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Rn}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",ne,!1),t.addEventListener("webglcontextcreationerror",ce,!1),k===null){const O="webgl2";if(k=ct(O,E),k===null)throw ct(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Xe,Ue,Re,dt,Fe,ze,I,M,$,re,le,ie,Ie,ge,A,j,B,Q,se,pe,ae,ve,Ae,ke;function D(){Xe=new cm(k),Xe.init(),ve=new $g(k,Xe),Ue=new im(k,Xe,e,ve),Re=new Vg(k),dt=new hm(k),Fe=new Cg,ze=new Xg(k,Xe,Re,Fe,Ue,ve,dt),I=new sm(y),M=new lm(y),$=new Qh(k),Ae=new tm(k,$),re=new dm(k,$,dt,Ae),le=new pm(k,re,$,dt),se=new fm(k,Ue,ze),j=new rm(Fe),ie=new Rg(y,I,M,Xe,Ue,Ae,j),Ie=new ev(y,Fe),ge=new Ig,A=new Fg(Xe),Q=new em(y,I,M,Re,le,h,l),B=new Gg(y,le,Ue),ke=new tv(k,dt,Ue,Re),pe=new nm(k,Xe,dt),ae=new um(k,Xe,dt),dt.programs=ie.programs,y.capabilities=Ue,y.extensions=Xe,y.properties=Fe,y.renderLists=ge,y.shadowMap=B,y.state=Re,y.info=dt}D();const ue=new Qg(y,k);this.xr=ue,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const E=Xe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Xe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(E){E!==void 0&&(J=E,this.setSize(W,V,!1))},this.getSize=function(E){return E.set(W,V)},this.setSize=function(E,O,Y=!0){if(ue.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=E,V=O,t.width=Math.floor(E*J),t.height=Math.floor(O*J),Y===!0&&(t.style.width=E+"px",t.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(W*J,V*J).floor()},this.setDrawingBufferSize=function(E,O,Y){W=E,V=O,J=Y,t.width=Math.floor(E*Y),t.height=Math.floor(O*Y),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(S)},this.getViewport=function(E){return E.copy(he)},this.setViewport=function(E,O,Y,q){E.isVector4?he.set(E.x,E.y,E.z,E.w):he.set(E,O,Y,q),Re.viewport(S.copy(he).multiplyScalar(J).round())},this.getScissor=function(E){return E.copy(Me)},this.setScissor=function(E,O,Y,q){E.isVector4?Me.set(E.x,E.y,E.z,E.w):Me.set(E,O,Y,q),Re.scissor(P.copy(Me).multiplyScalar(J).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(E){Re.setScissorTest(ee=E)},this.setOpaqueSort=function(E){X=E},this.setTransparentSort=function(E){oe=E},this.getClearColor=function(E){return E.copy(Q.getClearColor())},this.setClearColor=function(){Q.setClearColor.apply(Q,arguments)},this.getClearAlpha=function(){return Q.getClearAlpha()},this.setClearAlpha=function(){Q.setClearAlpha.apply(Q,arguments)},this.clear=function(E=!0,O=!0,Y=!0){let q=0;if(E){let H=!1;if(T!==null){const fe=T.texture.format;H=fe===1033||fe===1031||fe===1029}if(H){const fe=T.texture.type,ye=fe===1009||fe===1014||fe===1012||fe===1020||fe===1017||fe===1018,be=Q.getClearColor(),Te=Q.getClearAlpha(),Oe=be.r,Ge=be.g,De=be.b;ye?(f[0]=Oe,f[1]=Ge,f[2]=De,f[3]=Te,k.clearBufferuiv(k.COLOR,0,f)):(g[0]=Oe,g[1]=Ge,g[2]=De,g[3]=Te,k.clearBufferiv(k.COLOR,0,g))}else q|=k.COLOR_BUFFER_BIT}O&&(q|=k.DEPTH_BUFFER_BIT),Y&&(q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",ne,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),ge.dispose(),A.dispose(),Fe.dispose(),I.dispose(),M.dispose(),le.dispose(),Ae.dispose(),ke.dispose(),ie.dispose(),ue.dispose(),ue.removeEventListener("sessionstart",Dt),ue.removeEventListener("sessionend",Tn),Zt.stop()};function te(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function ne(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const E=dt.autoReset,O=B.enabled,Y=B.autoUpdate,q=B.needsUpdate,H=B.type;D(),dt.autoReset=E,B.enabled=O,B.autoUpdate=Y,B.needsUpdate=q,B.type=H}function ce(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ee(E){const O=E.target;O.removeEventListener("dispose",Ee),et(O)}function et(E){gt(E),Fe.remove(E)}function gt(E){const O=Fe.get(E).programs;O!==void 0&&(O.forEach(function(Y){ie.releaseProgram(Y)}),E.isShaderMaterial&&ie.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,Y,q,H,fe){O===null&&(O=Ne);const ye=H.isMesh&&H.matrixWorld.determinant()<0,be=ll(E,O,Y,q,H);Re.setMaterial(q,ye);let Te=Y.index,Oe=1;if(q.wireframe===!0){if(Te=re.getWireframeAttribute(Y),Te===void 0)return;Oe=2}const Ge=Y.drawRange,De=Y.attributes.position;let rt=Ge.start*Oe,pt=(Ge.start+Ge.count)*Oe;fe!==null&&(rt=Math.max(rt,fe.start*Oe),pt=Math.min(pt,(fe.start+fe.count)*Oe)),Te!==null?(rt=Math.max(rt,0),pt=Math.min(pt,Te.count)):De!=null&&(rt=Math.max(rt,0),pt=Math.min(pt,De.count));const mt=pt-rt;if(mt<0||mt===1/0)return;Ae.setup(H,q,be,Y,Te);let zt,st=pe;if(Te!==null&&(zt=$.get(Te),st=ae,st.setIndex(zt)),H.isMesh)q.wireframe===!0?(Re.setLineWidth(q.wireframeLinewidth*Je()),st.setMode(k.LINES)):st.setMode(k.TRIANGLES);else if(H.isLine){let Ce=q.linewidth;Ce===void 0&&(Ce=1),Re.setLineWidth(Ce*Je()),H.isLineSegments?st.setMode(k.LINES):H.isLineLoop?st.setMode(k.LINE_LOOP):st.setMode(k.LINE_STRIP)}else H.isPoints?st.setMode(k.POINTS):H.isSprite&&st.setMode(k.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)st.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))st.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ce=H._multiDrawStarts,bt=H._multiDrawCounts,nt=H._multiDrawCount,Ht=Te?$.get(Te).bytesPerElement:1,mn=Fe.get(q).currentProgram.getUniforms();for(let Gt=0;Gt<nt;Gt++)mn.setValue(k,"_gl_DrawID",Gt),st.render(Ce[Gt]/Ht,bt[Gt])}else if(H.isInstancedMesh)st.renderInstances(rt,mt,H.count);else if(Y.isInstancedBufferGeometry){const Ce=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,bt=Math.min(Y.instanceCount,Ce);st.renderInstances(rt,mt,bt)}else st.render(rt,mt)};function wt(E,O,Y){E.transparent===!0&&E.side===2&&E.forceSinglePass===!1?(E.side=1,E.needsUpdate=!0,wi(E,O,Y),E.side=0,E.needsUpdate=!0,wi(E,O,Y),E.side=2):wi(E,O,Y)}this.compile=function(E,O,Y=null){Y===null&&(Y=E),m=A.get(Y),m.init(O),b.push(m),Y.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),E!==Y&&E.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights();const q=new Set;return E.traverse(function(H){const fe=H.material;if(fe)if(Array.isArray(fe))for(let ye=0;ye<fe.length;ye++){const be=fe[ye];wt(be,Y,H),q.add(be)}else wt(fe,Y,H),q.add(fe)}),b.pop(),m=null,q},this.compileAsync=function(E,O,Y=null){const q=this.compile(E,O,Y);return new Promise(H=>{function fe(){if(q.forEach(function(ye){Fe.get(ye).currentProgram.isReady()&&q.delete(ye)}),q.size===0){H(E);return}setTimeout(fe,10)}Xe.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Ke=null;function ut(E){Ke&&Ke(E)}function Dt(){Zt.stop()}function Tn(){Zt.start()}const Zt=new Xl;Zt.setAnimationLoop(ut),typeof self!="undefined"&&Zt.setContext(self),this.setAnimationLoop=function(E){Ke=E,ue.setAnimationLoop(E),E===null?Zt.stop():Zt.start()},ue.addEventListener("sessionstart",Dt),ue.addEventListener("sessionend",Tn),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ue.enabled===!0&&ue.isPresenting===!0&&(ue.cameraAutoUpdate===!0&&ue.updateCamera(O),O=ue.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,O,T),m=A.get(E,b.length),m.init(O),b.push(m),we.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ve.setFromProjectionMatrix(we),de=this.localClippingEnabled,K=j.init(this.clippingPlanes,de),v=ge.get(E,p.length),v.init(),p.push(v),ue.enabled===!0&&ue.isPresenting===!0){const fe=y.xr.getDepthSensingMesh();fe!==null&&Mi(fe,O,-1/0,y.sortObjects)}Mi(E,O,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(X,oe),We=ue.enabled===!1||ue.isPresenting===!1||ue.hasDepthSensing()===!1,We&&Q.addToRenderList(v,E),this.info.render.frame++,K===!0&&j.beginShadows();const Y=m.state.shadowsArray;B.render(Y,E,O),K===!0&&j.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=v.opaque,H=v.transmissive;if(m.setupLights(),O.isArrayCamera){const fe=O.cameras;if(H.length>0)for(let ye=0,be=fe.length;ye<be;ye++){const Te=fe[ye];_r(q,H,E,Te)}We&&Q.render(E);for(let ye=0,be=fe.length;ye<be;ye++){const Te=fe[ye];it(v,E,Te,Te.viewport)}}else H.length>0&&_r(q,H,E,O),We&&Q.render(E),it(v,E,O);T!==null&&(ze.updateMultisampleRenderTarget(T),ze.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(y,E,O),Ae.resetDefaultState(),U=-1,w=null,b.pop(),b.length>0?(m=b[b.length-1],K===!0&&j.setGlobalState(y.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function Mi(E,O,Y,q){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ve.intersectsSprite(E)){q&&Be.setFromMatrixPosition(E.matrixWorld).applyMatrix4(we);const ye=le.update(E),be=E.material;be.visible&&v.push(E,ye,be,Y,Be.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ve.intersectsObject(E))){const ye=le.update(E),be=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Be.copy(E.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Be.copy(ye.boundingSphere.center)),Be.applyMatrix4(E.matrixWorld).applyMatrix4(we)),Array.isArray(be)){const Te=ye.groups;for(let Oe=0,Ge=Te.length;Oe<Ge;Oe++){const De=Te[Oe],rt=be[De.materialIndex];rt&&rt.visible&&v.push(E,ye,rt,Y,Be.z,De)}}else be.visible&&v.push(E,ye,be,Y,Be.z,null)}}const fe=E.children;for(let ye=0,be=fe.length;ye<be;ye++)Mi(fe[ye],O,Y,q)}function it(E,O,Y,q){const H=E.opaque,fe=E.transmissive,ye=E.transparent;m.setupLightsView(Y),K===!0&&j.setGlobalState(y.clippingPlanes,Y),q&&Re.viewport(S.copy(q)),H.length>0&&br(H,O,Y),fe.length>0&&br(fe,O,Y),ye.length>0&&br(ye,O,Y),Re.buffers.depth.setTest(!0),Re.buffers.depth.setMask(!0),Re.buffers.color.setMask(!0),Re.setPolygonOffset(!1)}function _r(E,O,Y,q){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[q.id]===void 0&&(m.state.transmissionRenderTarget[q.id]=new $t(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));const fe=m.state.transmissionRenderTarget[q.id],ye=q.viewport||S;fe.setSize(ye.z,ye.w);const be=y.getRenderTarget();y.setRenderTarget(fe),y.getClearColor(N),F=y.getClearAlpha(),F<1&&y.setClearColor(16777215,.5),We?Q.render(Y):y.clear();const Te=y.toneMapping;y.toneMapping=0;const Oe=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),m.setupLightsView(q),K===!0&&j.setGlobalState(y.clippingPlanes,q),br(E,Y,q),ze.updateMultisampleRenderTarget(fe),ze.updateRenderTargetMipmap(fe),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let De=0,rt=O.length;De<rt;De++){const pt=O[De],mt=pt.object,zt=pt.geometry,st=pt.material,Ce=pt.group;if(st.side===2&&mt.layers.test(q.layers)){const bt=st.side;st.side=1,st.needsUpdate=!0,zn(mt,Y,q,zt,st,Ce),st.side=bt,st.needsUpdate=!0,Ge=!0}}Ge===!0&&(ze.updateMultisampleRenderTarget(fe),ze.updateRenderTargetMipmap(fe))}y.setRenderTarget(be),y.setClearColor(N,F),Oe!==void 0&&(q.viewport=Oe),y.toneMapping=Te}function br(E,O,Y){const q=O.isScene===!0?O.overrideMaterial:null;for(let H=0,fe=E.length;H<fe;H++){const ye=E[H],be=ye.object,Te=ye.geometry,Oe=q===null?ye.material:q,Ge=ye.group;be.layers.test(Y.layers)&&zn(be,O,Y,Te,Oe,Ge)}}function zn(E,O,Y,q,H,fe){E.onBeforeRender(y,O,Y,q,H,fe),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.transparent===!0&&H.side===2&&H.forceSinglePass===!1?(H.side=1,H.needsUpdate=!0,y.renderBufferDirect(Y,O,q,H,E,fe),H.side=0,H.needsUpdate=!0,y.renderBufferDirect(Y,O,q,H,E,fe),H.side=2):y.renderBufferDirect(Y,O,q,H,E,fe),E.onAfterRender(y,O,Y,q,H,fe)}function wi(E,O,Y){O.isScene!==!0&&(O=Ne);const q=Fe.get(E),H=m.state.lights,fe=m.state.shadowsArray,ye=H.state.version,be=ie.getParameters(E,H.state,fe,O,Y),Te=ie.getProgramCacheKey(be);let Oe=q.programs;q.environment=E.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(E.isMeshStandardMaterial?M:I).get(E.envMap||q.environment),q.envMapRotation=q.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Oe===void 0&&(E.addEventListener("dispose",Ee),Oe=new Map,q.programs=Oe);let Ge=Oe.get(Te);if(Ge!==void 0){if(q.currentProgram===Ge&&q.lightsStateVersion===ye)return Sr(E,be),Ge}else be.uniforms=ie.getUniforms(E),E.onBeforeCompile(be,y),Ge=ie.acquireProgram(be,Te),Oe.set(Te,Ge),q.uniforms=be.uniforms;const De=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(De.clippingPlanes=j.uniform),Sr(E,be),q.needsLights=Ca(E),q.lightsStateVersion=ye,q.needsLights&&(De.ambientLightColor.value=H.state.ambient,De.lightProbe.value=H.state.probe,De.directionalLights.value=H.state.directional,De.directionalLightShadows.value=H.state.directionalShadow,De.spotLights.value=H.state.spot,De.spotLightShadows.value=H.state.spotShadow,De.rectAreaLights.value=H.state.rectArea,De.ltc_1.value=H.state.rectAreaLTC1,De.ltc_2.value=H.state.rectAreaLTC2,De.pointLights.value=H.state.point,De.pointLightShadows.value=H.state.pointShadow,De.hemisphereLights.value=H.state.hemi,De.directionalShadowMap.value=H.state.directionalShadowMap,De.directionalShadowMatrix.value=H.state.directionalShadowMatrix,De.spotShadowMap.value=H.state.spotShadowMap,De.spotLightMatrix.value=H.state.spotLightMatrix,De.spotLightMap.value=H.state.spotLightMap,De.pointShadowMap.value=H.state.pointShadowMap,De.pointShadowMatrix.value=H.state.pointShadowMatrix),q.currentProgram=Ge,q.uniformsList=null,Ge}function Ei(E){if(E.uniformsList===null){const O=E.currentProgram.getUniforms();E.uniformsList=ks.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function Sr(E,O){const Y=Fe.get(E);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function ll(E,O,Y,q,H){O.isScene!==!0&&(O=Ne),ze.resetTextureUnits();const fe=O.fog,ye=q.isMeshStandardMaterial?O.environment:null,be=T===null?y.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:nn,Te=(q.isMeshStandardMaterial?M:I).get(q.envMap||ye),Oe=q.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Ge=!!Y.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),De=!!Y.morphAttributes.position,rt=!!Y.morphAttributes.normal,pt=!!Y.morphAttributes.color;let mt=0;q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(mt=y.toneMapping);const zt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,st=zt!==void 0?zt.length:0,Ce=Fe.get(q),bt=m.state.lights;if(K===!0&&(de===!0||E!==w)){const jt=E===w&&q.id===U;j.setState(q,E,jt)}let nt=!1;q.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==bt.state.version||Ce.outputColorSpace!==be||H.isBatchedMesh&&Ce.batching===!1||!H.isBatchedMesh&&Ce.batching===!0||H.isBatchedMesh&&Ce.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ce.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ce.instancing===!1||!H.isInstancedMesh&&Ce.instancing===!0||H.isSkinnedMesh&&Ce.skinning===!1||!H.isSkinnedMesh&&Ce.skinning===!0||H.isInstancedMesh&&Ce.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ce.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ce.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ce.instancingMorph===!1&&H.morphTexture!==null||Ce.envMap!==Te||q.fog===!0&&Ce.fog!==fe||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==j.numPlanes||Ce.numIntersection!==j.numIntersection)||Ce.vertexAlphas!==Oe||Ce.vertexTangents!==Ge||Ce.morphTargets!==De||Ce.morphNormals!==rt||Ce.morphColors!==pt||Ce.toneMapping!==mt||Ce.morphTargetsCount!==st)&&(nt=!0):(nt=!0,Ce.__version=q.version);let Ht=Ce.currentProgram;nt===!0&&(Ht=wi(q,O,H));let mn=!1,Gt=!1,ei=!1;const _t=Ht.getUniforms(),on=Ce.uniforms;if(Re.useProgram(Ht.program)&&(mn=!0,Gt=!0,ei=!0),q.id!==U&&(U=q.id,Gt=!0),mn||w!==E){_t.setValue(k,"projectionMatrix",E.projectionMatrix),_t.setValue(k,"viewMatrix",E.matrixWorldInverse);const jt=_t.map.cameraPosition;jt!==void 0&&jt.setValue(k,xe.setFromMatrixPosition(E.matrixWorld)),Ue.logarithmicDepthBuffer&&_t.setValue(k,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&_t.setValue(k,"isOrthographic",E.isOrthographicCamera===!0),w!==E&&(w=E,Gt=!0,ei=!0)}if(H.isSkinnedMesh){_t.setOptional(k,H,"bindMatrix"),_t.setOptional(k,H,"bindMatrixInverse");const jt=H.skeleton;jt&&(jt.boneTexture===null&&jt.computeBoneTexture(),_t.setValue(k,"boneTexture",jt.boneTexture,ze))}H.isBatchedMesh&&(_t.setOptional(k,H,"batchingTexture"),_t.setValue(k,"batchingTexture",H._matricesTexture,ze),_t.setOptional(k,H,"batchingIdTexture"),_t.setValue(k,"batchingIdTexture",H._indirectTexture,ze),_t.setOptional(k,H,"batchingColorTexture"),H._colorsTexture!==null&&_t.setValue(k,"batchingColorTexture",H._colorsTexture,ze));const tn=Y.morphAttributes;if((tn.position!==void 0||tn.normal!==void 0||tn.color!==void 0)&&se.update(H,Y,Ht),(Gt||Ce.receiveShadow!==H.receiveShadow)&&(Ce.receiveShadow=H.receiveShadow,_t.setValue(k,"receiveShadow",H.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(on.envMap.value=Te,on.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(on.envMapIntensity.value=O.environmentIntensity),Gt&&(_t.setValue(k,"toneMappingExposure",y.toneMappingExposure),Ce.needsLights&&is(on,ei),fe&&q.fog===!0&&Ie.refreshFogUniforms(on,fe),Ie.refreshMaterialUniforms(on,q,J,V,m.state.transmissionRenderTarget[E.id]),ks.upload(k,Ei(Ce),on,ze)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(ks.upload(k,Ei(Ce),on,ze),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&_t.setValue(k,"center",H.center),_t.setValue(k,"modelViewMatrix",H.modelViewMatrix),_t.setValue(k,"normalMatrix",H.normalMatrix),_t.setValue(k,"modelMatrix",H.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const jt=q.uniformsGroups;for(let rs=0,cl=jt.length;rs<cl;rs++){const An=jt[rs];ke.update(An,Ht),ke.bind(An,Ht)}}return Ht}function is(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function Ca(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,O,Y){Fe.get(E.texture).__webglTexture=O,Fe.get(E.depthTexture).__webglTexture=Y;const q=Fe.get(E);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=Y===void 0,q.__autoAllocateDepthBuffer||Xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){const Y=Fe.get(E);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,Y=0){T=E,L=O,C=Y;let q=!0,H=null,fe=!1,ye=!1;if(E){const Te=Fe.get(E);Te.__useDefaultFramebuffer!==void 0?(Re.bindFramebuffer(k.FRAMEBUFFER,null),q=!1):Te.__webglFramebuffer===void 0?ze.setupRenderTarget(E):Te.__hasExternalTextures&&ze.rebindTextures(E,Fe.get(E.texture).__webglTexture,Fe.get(E.depthTexture).__webglTexture);const Oe=E.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(ye=!0);const Ge=Fe.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ge[O])?H=Ge[O][Y]:H=Ge[O],fe=!0):E.samples>0&&ze.useMultisampledRTT(E)===!1?H=Fe.get(E).__webglMultisampledFramebuffer:Array.isArray(Ge)?H=Ge[Y]:H=Ge,S.copy(E.viewport),P.copy(E.scissor),G=E.scissorTest}else S.copy(he).multiplyScalar(J).floor(),P.copy(Me).multiplyScalar(J).floor(),G=ee;if(Re.bindFramebuffer(k.FRAMEBUFFER,H)&&q&&Re.drawBuffers(E,H),Re.viewport(S),Re.scissor(P),Re.setScissorTest(G),fe){const Te=Fe.get(E.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+O,Te.__webglTexture,Y)}else if(ye){const Te=Fe.get(E.texture),Oe=O||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Te.__webglTexture,Y||0,Oe)}U=-1},this.readRenderTargetPixels=function(E,O,Y,q,H,fe,ye){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Fe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ye!==void 0&&(be=be[ye]),be){Re.bindFramebuffer(k.FRAMEBUFFER,be);try{const Te=E.texture,Oe=Te.format,Ge=Te.type;if(!Ue.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ue.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-q&&Y>=0&&Y<=E.height-H&&k.readPixels(O,Y,q,H,ve.convert(Oe),ve.convert(Ge),fe)}finally{const Te=T!==null?Fe.get(T).__webglFramebuffer:null;Re.bindFramebuffer(k.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(E,O,Y,q,H,fe,ye){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Fe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ye!==void 0&&(be=be[ye]),be){Re.bindFramebuffer(k.FRAMEBUFFER,be);try{const Te=E.texture,Oe=Te.format,Ge=Te.type;if(!Ue.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ue.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-q&&Y>=0&&Y<=E.height-H){const De=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,De),k.bufferData(k.PIXEL_PACK_BUFFER,fe.byteLength,k.STREAM_READ),k.readPixels(O,Y,q,H,ve.convert(Oe),ve.convert(Ge),0),k.flush();const rt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);await Ah(k,rt,4);try{k.bindBuffer(k.PIXEL_PACK_BUFFER,De),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,fe)}finally{k.deleteBuffer(De),k.deleteSync(rt)}return fe}}finally{const Te=T!==null?Fe.get(T).__webglFramebuffer:null;Re.bindFramebuffer(k.FRAMEBUFFER,Te)}}},this.copyFramebufferToTexture=function(E,O=null,Y=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);const q=Math.pow(2,-Y),H=Math.floor(E.image.width*q),fe=Math.floor(E.image.height*q),ye=O!==null?O.x:0,be=O!==null?O.y:0;ze.setTexture2D(E,0),k.copyTexSubImage2D(k.TEXTURE_2D,Y,0,0,ye,be,H,fe),Re.unbindTexture()},this.copyTextureToTexture=function(E,O,Y=null,q=null,H=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,E=arguments[1],O=arguments[2],H=arguments[3]||0,Y=null);let fe,ye,be,Te,Oe,Ge;Y!==null?(fe=Y.max.x-Y.min.x,ye=Y.max.y-Y.min.y,be=Y.min.x,Te=Y.min.y):(fe=E.image.width,ye=E.image.height,be=0,Te=0),q!==null?(Oe=q.x,Ge=q.y):(Oe=0,Ge=0);const De=ve.convert(O.format),rt=ve.convert(O.type);ze.setTexture2D(O,0),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,O.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,O.unpackAlignment);const pt=k.getParameter(k.UNPACK_ROW_LENGTH),mt=k.getParameter(k.UNPACK_IMAGE_HEIGHT),zt=k.getParameter(k.UNPACK_SKIP_PIXELS),st=k.getParameter(k.UNPACK_SKIP_ROWS),Ce=k.getParameter(k.UNPACK_SKIP_IMAGES),bt=E.isCompressedTexture?E.mipmaps[H]:E.image;k.pixelStorei(k.UNPACK_ROW_LENGTH,bt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,bt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,be),k.pixelStorei(k.UNPACK_SKIP_ROWS,Te),E.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,H,Oe,Ge,fe,ye,De,rt,bt.data):E.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,H,Oe,Ge,bt.width,bt.height,De,bt.data):k.texSubImage2D(k.TEXTURE_2D,H,Oe,Ge,fe,ye,De,rt,bt),k.pixelStorei(k.UNPACK_ROW_LENGTH,pt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,mt),k.pixelStorei(k.UNPACK_SKIP_PIXELS,zt),k.pixelStorei(k.UNPACK_SKIP_ROWS,st),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Ce),H===0&&O.generateMipmaps&&k.generateMipmap(k.TEXTURE_2D),Re.unbindTexture()},this.copyTextureToTexture3D=function(E,O,Y=null,q=null,H=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,q=arguments[1]||null,E=arguments[2],O=arguments[3],H=arguments[4]||0);let fe,ye,be,Te,Oe,Ge,De,rt,pt;const mt=E.isCompressedTexture?E.mipmaps[H]:E.image;Y!==null?(fe=Y.max.x-Y.min.x,ye=Y.max.y-Y.min.y,be=Y.max.z-Y.min.z,Te=Y.min.x,Oe=Y.min.y,Ge=Y.min.z):(fe=mt.width,ye=mt.height,be=mt.depth,Te=0,Oe=0,Ge=0),q!==null?(De=q.x,rt=q.y,pt=q.z):(De=0,rt=0,pt=0);const zt=ve.convert(O.format),st=ve.convert(O.type);let Ce;if(O.isData3DTexture)ze.setTexture3D(O,0),Ce=k.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)ze.setTexture2DArray(O,0),Ce=k.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,O.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,O.unpackAlignment);const bt=k.getParameter(k.UNPACK_ROW_LENGTH),nt=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Ht=k.getParameter(k.UNPACK_SKIP_PIXELS),mn=k.getParameter(k.UNPACK_SKIP_ROWS),Gt=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,mt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,mt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Te),k.pixelStorei(k.UNPACK_SKIP_ROWS,Oe),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Ge),E.isDataTexture||E.isData3DTexture?k.texSubImage3D(Ce,H,De,rt,pt,fe,ye,be,zt,st,mt.data):O.isCompressedArrayTexture?k.compressedTexSubImage3D(Ce,H,De,rt,pt,fe,ye,be,zt,mt.data):k.texSubImage3D(Ce,H,De,rt,pt,fe,ye,be,zt,st,mt),k.pixelStorei(k.UNPACK_ROW_LENGTH,bt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,nt),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ht),k.pixelStorei(k.UNPACK_SKIP_ROWS,mn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Gt),H===0&&O.generateMipmaps&&k.generateMipmap(Ce),Re.unbindTexture()},this.initRenderTarget=function(E){Fe.get(E).__webglFramebuffer===void 0&&ze.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?ze.setTextureCube(E,0):E.isData3DTexture?ze.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ze.setTexture2DArray(E,0):ze.setTexture2D(E,0),Re.unbindTexture()},this.resetState=function(){L=0,C=0,T=null,Re.reset(),Ae.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Da?"display-p3":"srgb",t.unpackColorSpace=lt.workingColorSpace===as?"display-p3":"srgb"}}class kr extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ho extends Ct{constructor(e=null,t=1,n=1,r,s,a,o,l,c=1003,d=1003,u,h){super(null,a,o,l,c,d,r,s,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _c extends un{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ji=new at,bc=new at,Ds=[],Sc=new ii,iv=new at,Dr=new He,Nr=new Cr;class rv extends He{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _c(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,iv)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ii),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ji),Sc.copy(e.boundingBox).applyMatrix4(ji),this.boundingBox.union(Sc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Cr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ji),Nr.copy(e.boundingSphere).applyMatrix4(ji),this.boundingSphere.union(Nr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=r[a+o]}raycast(e,t){const n=this.matrixWorld,r=this.count;if(Dr.geometry=this.geometry,Dr.material=this.material,Dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Nr.copy(this.boundingSphere),Nr.applyMatrix4(n),e.ray.intersectsSphere(Nr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,ji),bc.multiplyMatrices(n,ji),Dr.matrixWorld=bc,Dr.raycast(e,Ds);for(let a=0,o=Ds.length;a<o;a++){const l=Ds[a];l.instanceId=s,l.object=this,t.push(l)}Ds.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new _c(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new ho(new Float32Array(r*this.count),r,this.count,1028,1015));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=r*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ns extends Ct{constructor(e,t,n,r,s,a,o,l,c){super(e,t,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class _n{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let r=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===a)return r/(s-1);const d=n[r],h=n[r+1]-d,f=(a-d)/h;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new me:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new R,r=[],s=[],a=[],o=new R,l=new at;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new R)}s[0]=new R,a[0]=new R;let c=Number.MAX_VALUE;const d=Math.abs(r[0].x),u=Math.abs(r[0].y),h=Math.abs(r[0].z);d<=c&&(c=d,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Rt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(Rt(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class fo extends _n{constructor(e=0,t=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new me){const n=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*d-f*u+this.aX,c=h*u+f*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class sv extends fo{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function po(){let i=0,e=0,t=0,n=0;function r(s,a,o,l){i=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,d,u){let h=(a-s)/c-(o-s)/(c+d)+(o-a)/d,f=(o-a)/d-(l-a)/(d+u)+(l-o)/u;h*=d,f*=d,r(a,o,h,f)},calc:function(s){const a=s*s,o=a*s;return i+e*s+t*a+n*o}}}const Fs=new R,mo=new po,go=new po,vo=new po;class av extends _n{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new R){const n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,d;this.closed||o>0?c=r[(o-1)%s]:(Fs.subVectors(r[0],r[1]).add(r[0]),c=Fs);const u=r[o%s],h=r[(o+1)%s];if(this.closed||o+2<s?d=r[(o+2)%s]:(Fs.subVectors(r[s-1],r[s-2]).add(r[s-1]),d=Fs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),mo.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,g,v,m),go.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,g,v,m),vo.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,g,v,m)}else this.curveType==="catmullrom"&&(mo.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),go.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),vo.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return n.set(mo.calc(l),go.calc(l),vo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new R().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Mc(i,e,t,n,r){const s=(n-e)*.5,a=(r-t)*.5,o=i*i,l=i*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*i+t}function ov(i,e){const t=1-i;return t*t*e}function lv(i,e){return 2*(1-i)*i*e}function cv(i,e){return i*i*e}function Fr(i,e,t,n){return ov(i,e)+lv(i,t)+cv(i,n)}function dv(i,e){const t=1-i;return t*t*t*e}function uv(i,e){const t=1-i;return 3*t*t*i*e}function hv(i,e){return 3*(1-i)*i*i*e}function fv(i,e){return i*i*i*e}function Or(i,e,t,n,r){return dv(i,e)+uv(i,t)+hv(i,n)+fv(i,r)}class wc extends _n{constructor(e=new me,t=new me,n=new me,r=new me){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new me){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Or(e,r.x,s.x,a.x,o.x),Or(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class pv extends _n{constructor(e=new R,t=new R,n=new R,r=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new R){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Or(e,r.x,s.x,a.x,o.x),Or(e,r.y,s.y,a.y,o.y),Or(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ec extends _n{constructor(e=new me,t=new me){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new me){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new me){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class mv extends _n{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Tc extends _n{constructor(e=new me,t=new me,n=new me){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new me){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Fr(e,r.x,s.x,a.x),Fr(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class gv extends _n{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Fr(e,r.x,s.x,a.x),Fr(e,r.y,s.y,a.y),Fr(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ac extends _n{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new me){const n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],d=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Mc(o,l.x,c.x,d.x,u.x),Mc(o,l.y,c.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new me().fromArray(r))}return this}}var Rc=Object.freeze({__proto__:null,ArcCurve:sv,CatmullRomCurve3:av,CubicBezierCurve:wc,CubicBezierCurve3:pv,EllipseCurve:fo,LineCurve:Ec,LineCurve3:mv,QuadraticBezierCurve:Tc,QuadraticBezierCurve3:gv,SplineCurve:Ac});class vv extends _n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Rc[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(new Rc[r.type]().fromJSON(r))}return this}}class Br extends vv{constructor(e){super(),this.type="Path",this.currentPoint=new me,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Ec(this.currentPoint.clone(),new me(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){const s=new Tc(this.currentPoint.clone(),new me(e,t),new me(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){const o=new wc(this.currentPoint.clone(),new me(e,t),new me(n,r),new me(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Ac(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,r,s,a,o,l),this}absellipse(e,t,n,r,s,a,o,l){const c=new fo(e,t,n,r,s,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class yo extends Br{constructor(e){super(e),this.uuid=ti(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(new Br().fromJSON(r))}return this}}const yv={triangulate:function(i,e,t=2){const n=e&&e.length,r=n?e[0]*t:i.length;let s=Cc(i,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,d,u,h,f;if(n&&(s=Mv(i,e,s,t)),i.length>80*t){o=c=i[0],l=d=i[1];for(let g=t;g<r;g+=t)u=i[g],h=i[g+1],u<o&&(o=u),h<l&&(l=h),u>c&&(c=u),h>d&&(d=h);f=Math.max(c-o,d-l),f=f!==0?32767/f:0}return zr(s,a,t,o,l,f,0),a}};function Cc(i,e,t,n,r){let s,a;if(r===kv(i,e,t,n)>0)for(s=e;s<t;s+=n)a=Lc(s,i[s],i[s+1],a);else for(s=t-n;s>=e;s-=n)a=Lc(s,i[s],i[s+1],a);return a&&Os(a,a.next)&&(Gr(a),a=a.next),a}function fi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Os(t,t.next)||vt(t.prev,t,t.next)===0)){if(Gr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function zr(i,e,t,n,r,s,a){if(!i)return;!a&&s&&Rv(i,n,r,s);let o=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,s?_v(i,n,r,s):xv(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Gr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=bv(fi(i),e,t),zr(i,e,t,n,r,s,2)):a===2&&Sv(i,e,t,n,r,s):zr(fi(i),e,t,n,r,s,1);break}}}function xv(i){const e=i.prev,t=i,n=i.next;if(vt(e,t,n)>=0)return!1;const r=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,d=r<s?r<a?r:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,h=r>s?r>a?r:a:s>a?s:a,f=o>l?o>c?o:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=h&&g.y>=u&&g.y<=f&&Ki(r,o,s,l,a,c,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function _v(i,e,t,n){const r=i.prev,s=i,a=i.next;if(vt(r,s,a)>=0)return!1;const o=r.x,l=s.x,c=a.x,d=r.y,u=s.y,h=a.y,f=o<l?o<c?o:c:l<c?l:c,g=d<u?d<h?d:h:u<h?u:h,v=o>l?o>c?o:c:l>c?l:c,m=d>u?d>h?d:h:u>h?u:h,p=xo(f,g,e,t,n),b=xo(v,m,e,t,n);let y=i.prevZ,_=i.nextZ;for(;y&&y.z>=p&&_&&_.z<=b;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==a&&Ki(o,d,l,u,c,h,y.x,y.y)&&vt(y.prev,y,y.next)>=0||(y=y.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==r&&_!==a&&Ki(o,d,l,u,c,h,_.x,_.y)&&vt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==a&&Ki(o,d,l,u,c,h,y.x,y.y)&&vt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;_&&_.z<=b;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==r&&_!==a&&Ki(o,d,l,u,c,h,_.x,_.y)&&vt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function bv(i,e,t){let n=i;do{const r=n.prev,s=n.next.next;!Os(r,s)&&Pc(r,n,n.next,s)&&Hr(r,s)&&Hr(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Gr(n),Gr(n.next),n=i=s),n=n.next}while(n!==i);return fi(n)}function Sv(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Iv(a,o)){let l=Ic(a,o);a=fi(a,a.next),l=fi(l,l.next),zr(a,e,t,n,r,s,0),zr(l,e,t,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function Mv(i,e,t,n){const r=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*n,l=s<a-1?e[s+1]*n:i.length,c=Cc(i,o,l,n,!1),c===c.next&&(c.steiner=!0),r.push(Pv(c));for(r.sort(wv),s=0;s<r.length;s++)t=Ev(r[s],t);return t}function wv(i,e){return i.x-e.x}function Ev(i,e){const t=Tv(i,e);if(!t)return e;const n=Ic(t,i);return fi(n,n.next),fi(t,t.next)}function Tv(i,e){let t=e,n=-1/0,r;const s=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const h=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=s&&h>n&&(n=h,r=t.x<t.next.x?t:t.next,h===s))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let d=1/0,u;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&Ki(a<c?s:n,a,l,c,a<c?n:s,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(s-t.x),Hr(t,i)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&Av(r,t)))&&(r=t,d=u)),t=t.next;while(t!==o);return r}function Av(i,e){return vt(i.prev,i,e.prev)<0&&vt(e.next,i,i.next)<0}function Rv(i,e,t,n){let r=i;do r.z===0&&(r.z=xo(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,Cv(r)}function Cv(i){let e,t,n,r,s,a,o,l,c=1;do{for(t=i,i=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(r=t,t=t.nextZ,o--):(r=n,n=n.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;t=n}s.nextZ=null,c*=2}while(a>1);return i}function xo(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Pv(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ki(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function Iv(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Lv(i,e)&&(Hr(i,e)&&Hr(e,i)&&Uv(i,e)&&(vt(i.prev,i,e.prev)||vt(i,e.prev,e))||Os(i,e)&&vt(i.prev,i,i.next)>0&&vt(e.prev,e,e.next)>0)}function vt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Os(i,e){return i.x===e.x&&i.y===e.y}function Pc(i,e,t,n){const r=zs(vt(i,e,t)),s=zs(vt(i,e,n)),a=zs(vt(t,n,i)),o=zs(vt(t,n,e));return!!(r!==s&&a!==o||r===0&&Bs(i,t,e)||s===0&&Bs(i,n,e)||a===0&&Bs(t,i,n)||o===0&&Bs(t,e,n))}function Bs(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function zs(i){return i>0?1:i<0?-1:0}function Lv(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Pc(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Hr(i,e){return vt(i.prev,i,i.next)<0?vt(i,e,i.next)>=0&&vt(i,i.prev,e)>=0:vt(i,e,i.prev)<0||vt(i,i.next,e)<0}function Uv(i,e){let t=i,n=!1;const r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Ic(i,e){const t=new _o(i.i,i.x,i.y),n=new _o(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Lc(i,e,t,n){const r=new _o(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Gr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function _o(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function kv(i,e,t,n){let r=0;for(let s=e,a=t-n;s<t;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class Vr{static area(e){const t=e.length;let n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return Vr.area(e)<0}static triangulateShape(e,t){const n=[],r=[],s=[];Uc(e),kc(n,e);let a=e.length;t.forEach(Uc);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,kc(n,t[l]);const o=yv.triangulate(n,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Uc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function kc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Hs extends yn{constructor(e=new yo([new me(0,.5),new me(-.5,-.5),new me(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],r=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let d=0;d<e.length;d++)c(e[d]),this.addGroup(o,l,d),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Wt(r,3)),this.setAttribute("normal",new Wt(s,3)),this.setAttribute("uv",new Wt(a,2));function c(d){const u=r.length/3,h=d.extractPoints(t);let f=h.shape;const g=h.holes;Vr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const b=g[m];Vr.isClockWise(b)===!0&&(g[m]=b.reverse())}const v=Vr.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const b=g[m];f=f.concat(b)}for(let m=0,p=f.length;m<p;m++){const b=f[m];r.push(b.x,b.y,0),s.push(0,0,1),a.push(b.x,b.y)}for(let m=0,p=v.length;m<p;m++){const b=v[m],y=b[0]+u,_=b[1]+u,L=b[2]+u;n.push(y,_,L),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Dv(t,e)}static fromJSON(e,t){const n=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];n.push(a)}return new Hs(n,e.curveSegments)}}function Dv(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const r=i[t];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e}class bo extends yn{constructor(e=1,t=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const d=[],u=new R,h=new R,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const b=[],y=p/n;let _=0;p===0&&a===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let L=0;L<=t;L++){const C=L/t;u.x=-e*Math.cos(r+C*s)*Math.sin(a+y*o),u.y=e*Math.cos(a+y*o),u.z=e*Math.sin(r+C*s)*Math.sin(a+y*o),g.push(u.x,u.y,u.z),h.copy(u).normalize(),v.push(h.x,h.y,h.z),m.push(C+_,1-y),b.push(c++)}d.push(b)}for(let p=0;p<n;p++)for(let b=0;b<t;b++){const y=d[p][b+1],_=d[p][b],L=d[p+1][b],C=d[p+1][b+1];(p!==0||a>0)&&f.push(y,_,C),(p!==n-1||l<Math.PI)&&f.push(_,L,C)}this.setIndex(f),this.setAttribute("position",new Wt(g,3)),this.setAttribute("normal",new Wt(v,3)),this.setAttribute("uv",new Wt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Nv extends kt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class hn extends Ir{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dc extends hn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Rt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Le(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Le(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Le(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}const Qi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Nc{constructor(e,t,n){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(d){o++,s===!1&&r.onStart!==void 0&&r.onStart(d,a,o),s=!0},this.itemEnd=function(d){a++,r.onProgress!==void 0&&r.onProgress(d,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(d){r.onError!==void 0&&r.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,u){return c.push(d,u),this},this.removeHandler=function(d){const u=c.indexOf(d);return u!==-1&&c.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=c.length;u<h;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(d))return g}return null}}}const Fc=new Nc;class Gs{constructor(e){this.manager=e!==void 0?e:Fc,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Gs.DEFAULT_MATERIAL_NAME="__DEFAULT";class Fv extends Gs{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Qi.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=Tr("img");function l(){d(),Qi.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){d(),r&&r(u),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class Oc extends Gs{constructor(e){super(e)}load(e,t,n,r){const s=new Ct,a=new Fv(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class Ji extends St{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Le(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ov extends Ji{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const So=new at,Bc=new R,zc=new R;class Mo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new me(512,512),this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new to,this._frameExtents=new me(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Bc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bc),zc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(zc),t.updateMatrixWorld(),So.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(So),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(So)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Bv extends Mo{constructor(){super(new Bt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Ai*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class zv extends Ji{constructor(e,t,n=0,r=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Bv}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Hc=new at,Wr=new R,wo=new R;class Hv extends Mo{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new me(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Wr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Wr),wo.copy(n.position),wo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(wo),n.updateMatrixWorld(),r.makeTranslation(-Wr.x,-Wr.y,-Wr.z),Hc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hc)}}class Gc extends Ji{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new Hv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Gv extends Mo{constructor(){super(new Ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Vc extends Ji{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.shadow=new Gv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Vv extends Ji{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Wc extends Ji{constructor(e,t,n=10,r=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class Wv extends Gs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Qi.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{r&&r(c)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Qi.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),Qi.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});Qi.add(e,l),s.manager.itemStart(e)}}class Xv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Xc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Xc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Xc(){return(typeof performance=="undefined"?Date:performance).now()}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rn}})),typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rn);const $v=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"),Vs=({title:i,width:e,height:t,background:n,accent:r,secondary:s,horizonPercent:a=58})=>{const o=Math.max(e,t),l=Math.min(e,t),c=t*(a/100),d=e*.06,u=t*.92,h=o*.035,f=o*.004,g=o*.012,v=o*.005,m=l*.11,p=$v(i),b=`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${n}"/>
      <stop offset="0.52" stop-color="${s}"/>
      <stop offset="1" stop-color="${r}"/>
    </linearGradient>
    <radialGradient id="light" cx="30%" cy="18%" r="75%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.72"/>
      <stop offset="0.36" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#light)"/>
  <path d="M0 ${c} C ${e*.18} ${t*.47}, ${e*.36} ${t*.66}, ${e*.55} ${t*.54} S ${e*.82} ${t*.38}, ${e} ${t*.5} L ${e} ${t} L 0 ${t} Z" fill="#ffffff" opacity="0.16"/>
  <path d="M${e*.08} ${t*.2} C ${e*.28} ${t*.08}, ${e*.5} ${t*.1}, ${e*.78} ${t*.24}" fill="none" stroke="#ffffff" stroke-width="${g}" stroke-linecap="round" opacity="0.32"/>
  <path d="M${e*.16} ${t*.82} C ${e*.36} ${t*.72}, ${e*.54} ${t*.9}, ${e*.86} ${t*.72}" fill="none" stroke="#11181d" stroke-width="${v}" stroke-linecap="round" opacity="0.18"/>
  <circle cx="${e*.72}" cy="${t*.26}" r="${m}" fill="#ffffff" opacity="0.16"/>
  <text x="${d}" y="${u}" fill="#11181d" opacity="0.28" font-size="${h}" font-family="Inter, Arial, sans-serif" letter-spacing="${f}">${p}</text>
</svg>`;return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(b)}`},$c=[{id:"electric-storm",title:"Electric Storm",subtitle:"Artwork 01",description:"Eine ruhige immersive digitale Kunstpräsentation mit realistischer Materialität und hochwertiger Lichtführung.",year:2025,medium:"Digital painting · 2400 × 1600",image:Vs({title:"Electric Storm",width:2400,height:1600,background:"#dfe5e9",secondary:"#9fb0ba",accent:"#c8b690",horizonPercent:54}),dimensions:{width:2400,height:1600},alt:"Abstrakte Landschaft mit weichen Wolken über einem warm getönten Horizont.",credit:"Freyraum Studio",tags:["landscape","soft-light","warm"],surface:"Matte Leinwand",presentation:"canvas"},{id:"quiet-coastline",title:"Quiet Coastline",subtitle:"Artwork 02",description:"Minimalistische Küstenkomposition mit fein ausgearbeiteter Materialstruktur.",year:2025,medium:"Digital painting · 1800 × 2400",image:Vs({title:"Quiet Coastline",width:1800,height:2400,background:"#eef1f3",secondary:"#c9d4d8",accent:"#a6b4ae",horizonPercent:62}),dimensions:{width:1800,height:2400},alt:"Hochformatige minimalistische Küstenszene in gedämpften Grautönen.",credit:"Freyraum Studio",tags:["portrait","coast","minimal"],surface:"Matte Leinwand",presentation:"canvas"},{id:"tokyo-passage",title:"Tokyo Passage",subtitle:"Artwork 03",description:"Cinematische urbane Perspektiven mit dramatischem Streiflicht.",year:2025,medium:"Digital painting · 2100 × 2100",image:Vs({title:"Tokyo Passage",width:2100,height:2100,background:"#e8e3da",secondary:"#b8c1c5",accent:"#8b9497",horizonPercent:48}),dimensions:{width:2100,height:2100},alt:"Quadratische urbane Szene mit dramatischem Streiflicht in kühlen Tönen.",credit:"Freyraum Studio",tags:["square","urban","cinematic"],surface:"Satinierte Leinwand",presentation:"canvas"},{id:"golden-desert",title:"Golden Desert",subtitle:"Artwork 04",description:"Atmosphärische Lichtstimmung kombiniert mit realistischer Leinwandstruktur.",year:2025,medium:"Digital painting · 2800 × 1200",image:Vs({title:"Golden Desert",width:2800,height:1200,background:"#f0ece4",secondary:"#d8c7a5",accent:"#a98f6d",horizonPercent:57}),dimensions:{width:2800,height:1200},alt:"Ultra-breite Wüstenkomposition in goldenen und sandfarbenen Tönen.",credit:"Freyraum Studio",tags:["ultrawide","desert","warm"],surface:"Matte Leinwand",presentation:"canvas"}],Xr={high:{id:"high",label:"Hoch",description:"Volle Detailtiefe für moderne dedizierte GPUs.",pixelRatioCap:1.6,bloomStrength:.04,bloomRadius:.36,bloomThreshold:1.2,shadows:!0,artworkSegments:180,shaderVariant:"painting-high",normalStrength:.7,detailNormalStrength:.6,bumpStrength:0,specularStrength:.28,anisotropyDivisor:1,aoEnabled:!0,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:1024,proceduralInspectionTileSize:2048,parallaxEnabled:!0,parallaxSteps:10,parallaxScale:.012,selfShadowEnabled:!0,selfShadowSteps:6,selfShadowStrength:.3,selfShadowBias:.05,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:.002,clearcoatEnabled:!0,clearcoatStrength:.12,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0,hubReflection:"planar",hubReflectionDivisor:2,hubSurfaceTileSize:1024,hubShadows:!0},balanced:{id:"balanced",label:"Ausgewogen",description:"Empfohlen für die meisten Laptops und Tablets.",pixelRatioCap:1.25,bloomStrength:.03,bloomRadius:.3,bloomThreshold:1.25,shadows:!0,artworkSegments:120,shaderVariant:"painting-balanced",normalStrength:.45,detailNormalStrength:.4,bumpStrength:.025,specularStrength:.3,anisotropyDivisor:2,aoEnabled:!1,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:512,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0,hubReflection:"ibl",hubReflectionDivisor:3,hubSurfaceTileSize:512,hubShadows:!0},battery:{id:"battery",label:"Akkusparend",description:"Für integrierte GPUs und Akkubetrieb.",pixelRatioCap:1,bloomStrength:0,bloomRadius:.28,bloomThreshold:1.2,shadows:!1,artworkSegments:48,shaderVariant:"painting-battery",normalStrength:.25,detailNormalStrength:0,bumpStrength:0,specularStrength:0,anisotropyDivisor:4,aoEnabled:!1,grazingBoostEnabled:!1,detailNormalEnabled:!1,proceduralTileSize:256,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:0,fxaaEnabled:!1,albedoFidelityFill:0,hubReflection:"off",hubReflectionDivisor:4,hubSurfaceTileSize:256,hubShadows:!1}},Yc="balanced";function $r(i){var e;return(e=Xr[i])!=null?e:Xr[Yc]}function er(i=1.8){var r,s,a;const e=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,n=((a=(s=(r=window.matchMedia)==null?void 0:r.call(window,"(pointer: coarse)"))==null?void 0:s.matches)!=null?a:!1)?Math.min(i,1.5):i;return Math.min(e,n)}const Yv=.5,qv=2;function Zv(){var l,c,d;const i=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,e=(d=(c=(l=window.matchMedia)==null?void 0:l.call(window,"(pointer: coarse)"))==null?void 0:c.matches)!=null?d:!1,t=window.innerWidth*window.innerHeight,n=6e5,r=8e5,s=navigator,a=typeof s.deviceMemory=="number"?s.deviceMemory:void 0,o=typeof s.hardwareConcurrency=="number"?s.hardwareConcurrency:void 0;return a!==void 0&&a<=Yv||o!==void 0&&o<=qv||e&&i>=2&&t<n?"battery":(e&&t<r,"balanced")}const qc="freyraum.diagnostics.mode",Zc=500,jv=2500,tr={debug:10,info:20,warn:30,error:40};function jc(i){if(!i)return null;const e=i.trim().toLowerCase();return e==="1"||e==="true"||e==="info"?"info":e==="verbose"||e==="2"?"verbose":e==="0"||e==="false"||e==="default"?"default":null}function Kv(){try{const i=new URLSearchParams(window.location.search);return jc(i.get("debug"))}catch(i){return null}}function Qv(){try{return jc(localStorage.getItem(qc))}catch(i){return null}}function Jv(i){try{localStorage.setItem(qc,i)}catch(e){}}function e0(i){switch(i){case"verbose":return"debug";case"info":return"info";default:return"warn"}}function Eo(i,e=0,t){if(i==null)return i;if(e>3)return"[max-depth]";if(typeof i=="function")return`[function ${i.name||"anonymous"}]`;if(typeof i=="bigint"||typeof i=="symbol")return i.toString();if(i instanceof Error)return{name:i.name,message:i.message,stack:i.stack};if(Array.isArray(i))return i.map(n=>Eo(n,e+1,t));if(typeof i=="object"){const n=i,r=t!=null?t:new WeakSet;if(r.has(n))return"[circular]";r.add(n);const s={};for(const[a,o]of Object.entries(n))s[a]=Eo(o,e+1,r);return s}return i}class t0{constructor(){x(this,"startedAt",performance.now());x(this,"startedAtIso",new Date().toISOString());x(this,"entries",[]);x(this,"nextId",1);x(this,"mode");x(this,"dedupe",new Map);x(this,"globalHandlersInstalled",!1);x(this,"handlingGlobalError",!1);var e,t;this.mode=(t=(e=Kv())!=null?e:Qv())!=null?t:"default",typeof window!="undefined"&&(window.__FREYRAUM_DIAGNOSTICS__=this.publicApi())}getMode(){return this.mode}setMode(e){this.mode=e,Jv(e),this.info("diagnostics","mode-changed",`Diagnostics mode set to ${e}`)}installGlobalHandlers(){this.globalHandlersInstalled||typeof window=="undefined"||(this.globalHandlersInstalled=!0,window.addEventListener("error",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","uncaught-error",e.message||"Uncaught window error",{filename:e.filename,lineno:e.lineno,colno:e.colno,error:e.error})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle global window error",t)}finally{this.handlingGlobalError=!1}}}),window.addEventListener("unhandledrejection",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","unhandled-rejection","Unhandled promise rejection",{reason:e.reason})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle unhandled rejection",t)}finally{this.handlingGlobalError=!1}}}))}debug(e,t,n,r){this.push("debug",e,t,n,r)}info(e,t,n,r){this.push("info",e,t,n,r)}warn(e,t,n,r){this.push("warn",e,t,n,r)}error(e,t,n,r){this.push("error",e,t,n,r)}child(e){return new n0(this,e)}getEntries(){return this.entries}clear(){this.entries=[],this.dedupe.clear()}snapshot(){return{sessionStartedAt:this.startedAtIso,mode:this.mode,entries:this.entries}}print(e="info"){const t=tr[e];for(const n of this.entries)tr[n.level]<t||this.printEntry(n)}exportJson(){return JSON.stringify(this.snapshot(),null,2)}summarize(){const e=new Map;for(const t of this.entries){const n=`[${t.scope}] ${t.event}`,r=e.get(n);r?(r.count+=t.repeatCount,r.lastMessage=t.message,r.lastMs=t.relativeMs,tr[t.level]>tr[r.level]&&(r.level=t.level)):e.set(n,{count:t.repeatCount,level:t.level,lastMessage:t.message,lastMs:t.relativeMs})}console.group("[freyraum] Diagnostics summary");for(const[t,n]of e){const r=`${t} (×${n.count}, last +${n.lastMs}ms) — ${n.lastMessage}`;n.level==="error"?console.error(r):n.level==="warn"?console.warn(r):n.level==="info"?console.info(r):console.debug(r)}console.groupEnd()}publicApi(){return{getMode:()=>this.getMode(),setMode:e=>this.setMode(e),getEntries:()=>this.getEntries(),clear:()=>this.clear(),print:e=>this.print(e),snapshot:()=>this.snapshot(),exportJson:()=>this.exportJson(),summarize:()=>this.summarize()}}isLevelEnabled(e){return e!=="debug"||this.mode==="verbose"}push(e,t,n,r,s){if(!this.isLevelEnabled(e))return;const a=performance.now(),o=`${e}|${t}|${n}|${r}`,l=this.dedupe.get(o);if(l&&a-l.lastSeen<jv){const u=this.entries.find(h=>h.id===l.entryId);if(u){u.repeatCount+=1,l.lastSeen=a;return}}let c;try{const u=typeof s=="function"?s():s;c=u===void 0?void 0:Eo(u)}catch(u){c={serializationError:u instanceof Error?u.message:String(u)}}const d={id:this.nextId++,timestamp:new Date().toISOString(),relativeMs:Math.round(a-this.startedAt),level:e,scope:t,event:n,message:r,data:c,repeatCount:1};if(this.entries.push(d),this.entries.length>Zc&&(this.entries=this.entries.slice(-Zc)),this.dedupe.set(o,{entryId:d.id,lastSeen:a}),tr[e]>=tr[e0(this.mode)])try{this.printEntry(d)}catch(u){console.error("[freyraum][diagnostics][error] Failed to print diagnostic entry",u)}}printEntry(e){const t=`[freyraum][${e.scope}][${e.level}] +${e.relativeMs}ms ${e.message}`,n={event:e.event};e.repeatCount>1&&(n.repeats=e.repeatCount);const r=e.data!==void 0,s=e.level==="error"?console.error:e.level==="warn"?console.warn:e.level==="info"?console.info:console.debug;if(r)try{console.groupCollapsed(t,n),s("data:",e.data),console.groupEnd()}catch(a){s(t,n,e.data)}else try{s(t,n)}catch(a){console.log(t,n)}}}class n0{constructor(e,t){this.diagnostics=e,this.scope=t}isDebugEnabled(){return this.diagnostics.isLevelEnabled("debug")}debug(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}debugLazy(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}info(e,t,n){this.diagnostics.info(this.scope,e,t,n)}warn(e,t,n){this.diagnostics.warn(this.scope,e,t,n)}error(e,t,n){this.diagnostics.error(this.scope,e,t,n)}}const Kc=new t0;function nr(){return Kc}function Jt(i){return Kc.child(i)}class i0 extends Error{constructor(t,n){super("WebGL renderer initialization failed");x(this,"attempts");x(this,"causeMessage");this.name="WebGLRendererCreationError",this.attempts=t,this.causeMessage=n instanceof Error?n.message:String(n!=null?n:"unknown")}}const r0={createCanvas:()=>document.createElement("canvas"),createRenderer:i=>new nv(i)};function Qc(i){var e;(e=i==null?void 0:i.getExtension("WEBGL_lose_context"))==null||e.loseContext()}function Jc(i={},e=r0){const t=[];let n;const r=[{mode:"preferred",parameters:{...i,antialias:!0,powerPreference:"high-performance"}},{mode:"compatibility",parameters:{...i,antialias:!1,powerPreference:"default",depth:!0,stencil:!1,failIfMajorPerformanceCaveat:!1}},{mode:"battery",parameters:{...i,antialias:!1,powerPreference:"low-power",depth:!0,stencil:!1,failIfMajorPerformanceCaveat:!1}}];for(const s of r){t.push(s.mode);const a=e.createCanvas();let o=null;try{if(o=a.getContext("webgl2",s.parameters),!o)throw new Error("WebGL 2 context creation returned null");return{renderer:e.createRenderer({...s.parameters,canvas:a,context:o}),mode:s.mode,attempts:[...t]}}catch(l){n=l,Qc(o)}}throw new i0(t,n)}function ed(i){var t,n;const e=i.getContext().getContextAttributes();return{version:"webgl2",antialias:(t=e==null?void 0:e.antialias)!=null?t:!1,powerPreference:(n=e==null?void 0:e.powerPreference)!=null?n:"default"}}const ir=Jt("renderer");class s0{constructor(e,t,n="#c7ced4"){x(this,"renderer");x(this,"rendererMode");x(this,"preset");x(this,"wallClearColor");x(this,"renderPaused",!1);x(this,"disposed",!1);x(this,"contextChangeCallback",null);x(this,"_sizeScratch",new me);x(this,"onContextLost",e=>{var t;e.preventDefault(),this.renderPaused=!0,(t=this.contextChangeCallback)==null||t.call(this,"lost"),ir.warn("context-lost","WebGL context lost; render paused until restoration",{width:this.renderer.domElement.width,height:this.renderer.domElement.height})});x(this,"onContextRestored",()=>{var e;this.renderPaused=!1,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(this.rendererMode==="preferred"?er(this.preset.pixelRatioCap):1),this.renderer.setClearColor(new Le(this.wallClearColor)),(e=this.contextChangeCallback)==null||e.call(this,"restored"),ir.info("context-restored","WebGL context restored",{})});this.preset=t,this.wallClearColor=n;const r=Jc();this.renderer=r.renderer,this.rendererMode=r.mode,this.renderer.setPixelRatio(r.mode==="preferred"?er(t.pixelRatioCap):1),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=Nt,this.renderer.toneMapping=0,this.renderer.toneMappingExposure=1,this.renderer.setClearColor(new Le(this.wallClearColor)),this.renderer.shadowMap.enabled=t.shadows&&r.mode==="preferred",this.renderer.shadowMap.type=2,this.applyQualityDataAttribute(t.id);const s=this.renderer.domElement;s.addEventListener("webglcontextlost",this.onContextLost,!1),s.addEventListener("webglcontextrestored",this.onContextRestored,!1),e.appendChild(s),ir.info("created","WebGL renderer initialized",{mode:r.mode,attempts:r.attempts,context:ed(this.renderer),protocol:window.location.protocol})}applyPreset(e){this.preset=e,this.renderer.setPixelRatio(this.rendererMode==="preferred"?er(e.pixelRatioCap):1),this.renderer.shadowMap.enabled=e.shadows&&this.rendererMode==="preferred",this.applyQualityDataAttribute(e.id)}setWallClearColor(e){this.wallClearColor=e,this.renderer.setClearColor(new Le(this.wallClearColor))}resize(e,t){this.renderer.setSize(Math.max(1,e),Math.max(1,t)),this.renderer.setPixelRatio(this.rendererMode==="preferred"?er(this.preset.pixelRatioCap):1)}isRenderPaused(){return this.renderPaused}onContextChange(e){this.contextChangeCallback=e}async prewarm(e,t){const n=this.renderer;try{typeof n.compileAsync=="function"?(await n.compileAsync(e,t),ir.debug("prewarm-async","Shader programs pre-warmed via compileAsync()",{preset:this.preset.id})):(n.compile(e,t),ir.debug("prewarm-sync","Shader programs pre-warmed via compile()",{preset:this.preset.id}))}catch(r){ir.warn("prewarm-failed","Shader pre-warm failed; continuing normally",{message:r instanceof Error?r.message:String(r)})}}getRendererSnapshot(){var n,r;const e=this.renderer.info,t=this._sizeScratch;return this.renderer.getSize(t),{drawCalls:e.render.calls,triangles:e.render.triangles,points:e.render.points,lines:e.render.lines,geometries:e.memory.geometries,textures:e.memory.textures,programs:(r=(n=e.programs)==null?void 0:n.length)!=null?r:0,pixelRatio:this.renderer.getPixelRatio(),width:t.x,height:t.y,renderPaused:this.renderPaused,preset:this.preset.id}}applyQualityDataAttribute(e){try{typeof document!="undefined"&&document.documentElement&&(document.documentElement.dataset.quality=e)}catch(t){}}dispose(){if(this.disposed)return;this.disposed=!0;const e=this.renderer.domElement;e.removeEventListener("webglcontextlost",this.onContextLost,!1),e.removeEventListener("webglcontextrestored",this.onContextRestored,!1),this.contextChangeCallback=null,this.renderer.dispose()}}const Yr={artworkBodyDepth:.04,artworkWallGap:.14,artworkBodyFrontClearance:.002,artworkWallZ:-.18200000000000002,roomHalfWidth:18,roomRearZ:24,floorY:-6.6,ceilingY:7.2,skirtingHeight:.08,skirtingDepth:.018,revealDepth:.14,revealDrop:.16,lightStripDepth:.22,lightStripLift:.006},td=2.6,nd=1.9,Ws=Object.freeze({wallColor:"#f3f3ef",wallRoughness:.86,ceilingRoughness:.93,floorRoughness:.6,colorVariation:0,roughnessVariation:0,wallNormalStrength:0,floorNormalStrength:0,floorColorVariation:0});class id{constructor(e,t="gallery"){x(this,"textureCache",new Map);x(this,"materials",null);x(this,"tileSize");x(this,"anisotropy",1);x(this,"surfaceProfile");this.tileSize=Math.max(64,e|0),this.surfaceProfile=t}getMaterials(e){if(this.materials)return this.materials;const t=this.surfaceProfile==="hub"?new Le(Ws.wallColor):new Le(e.wall),n=t.clone().multiplyScalar(1.04),r=this.surfaceProfile==="hub"?new Le("#d2d4d3"):t.clone().multiplyScalar(.82).lerp(new Le("#aab2ba"),.18),s=this.surfaceProfile==="gallery"?this.detailTexture("plasterNormal"):null,a=this.surfaceProfile==="gallery"?this.detailTexture("plasterRoughness"):null,o=this.surfaceProfile==="gallery"?this.detailTexture("floorNormal"):null,l=this.surfaceProfile==="gallery"?this.detailTexture("floorRoughness"):null,c=new hn({color:t,roughness:this.surfaceProfile==="hub"?Ws.wallRoughness:.965,metalness:0,normalMap:this.surfaceProfile==="gallery"?s:null,normalScale:new me(this.surfaceProfile==="gallery"?.14:0,this.surfaceProfile==="gallery"?.14:0),roughnessMap:a});this.surfaceProfile==="hub"&&(c.userData.architecturalSurfaceProfile="hub-smooth-plaster");const d=new hn({color:n,roughness:this.surfaceProfile==="hub"?Ws.ceilingRoughness:.97,metalness:0,normalMap:s,normalScale:new me(this.surfaceProfile==="gallery"?.06:0,this.surfaceProfile==="gallery"?.06:0)});this.surfaceProfile==="hub"&&(d.userData.architecturalSurfaceProfile="hub-matte-ceiling");const u=new hn({color:r,roughness:this.surfaceProfile==="hub"?Ws.floorRoughness:.62,metalness:0,normalMap:o,normalScale:new me(this.surfaceProfile==="gallery"?.22:0,this.surfaceProfile==="gallery"?.22:0),roughnessMap:l,envMapIntensity:.5});this.surfaceProfile==="hub"&&(u.userData.architecturalSurfaceProfile="hub-satin-mineral");const h=new hn({color:new Le("#31363a"),roughness:.58,metalness:.32}),f=new hn({color:new Le(this.surfaceProfile==="hub"?"#8c8f8b":"#565b5e"),roughness:this.surfaceProfile==="hub"?.94:.96,metalness:0}),g=new Le(this.surfaceProfile==="hub"?"#eef3f1":"#e8edef"),v=new hn({color:g,emissive:g,emissiveIntensity:this.surfaceProfile==="hub"?.72:.56,roughness:.48,metalness:0}),m=new hn({color:new Le("#d8dde1"),roughness:.9,metalness:0});return this.materials={wall:c,ceiling:d,floor:u,trim:h,pocket:f,lightStrip:v,artworkEdge:m},this.materials}setTileSize(e){const t=Math.max(64,e|0);if(t===this.tileSize||(this.tileSize=t,!this.materials))return;const n=[...this.textureCache.values()];this.textureCache.clear(),this.surfaceProfile==="gallery"&&(this.materials.wall.normalMap=this.detailTexture("plasterNormal"),this.materials.wall.roughnessMap=this.detailTexture("plasterRoughness")),this.surfaceProfile==="gallery"&&(this.materials.ceiling.normalMap=this.detailTexture("plasterNormal"),this.materials.floor.normalMap=this.detailTexture("floorNormal"),this.materials.floor.roughnessMap=this.detailTexture("floorRoughness")),this.materials.wall.needsUpdate=!0,this.materials.ceiling.needsUpdate=!0,this.materials.floor.needsUpdate=!0;for(const r of n)r.dispose()}setAnisotropy(e){const t=Math.max(1,e|0);t!==this.anisotropy&&(this.anisotropy=t,this.textureCache.forEach(n=>{n.anisotropy=t,n.needsUpdate=!0}))}dispose(){if(this.textureCache.forEach(e=>e.dispose()),this.textureCache.clear(),this.materials){for(const e of Object.values(this.materials))e.dispose();this.materials=null}}detailTexture(e){const t=`${e}::${this.tileSize}`,n=this.textureCache.get(t);if(n)return n;let r;switch(e){case"plasterNormal":r=this.generateNormal(11,1.9,.42,.05),r.repeat.setScalar(1/td);break;case"plasterRoughness":r=this.generateGrayscale(29,220,34,.62),r.repeat.setScalar(1/td);break;case"floorNormal":r=this.generateNormal(53,3.4,.5,.02),r.repeat.setScalar(1/nd);break;case"floorRoughness":default:r=this.generateGrayscale(71,152,30,.85),r.repeat.setScalar(1/nd);break}return r.anisotropy=this.anisotropy,this.textureCache.set(t,r),r}generateNormal(e,t,n,r){const s=this.tileSize,a=4*t,o=13*t,l=new Float32Array(s*s);for(let d=0;d<s;d+=1)for(let u=0;u<s;u+=1){const h=u/s,f=d/s;l[d*s+u]=this.tileNoise(h,f,a,e)*(1-n)+this.tileNoise(h,f,o,e+7)*n}const c=new Uint8Array(s*s*4);for(let d=0;d<s;d+=1){const u=(d-1+s)%s,h=(d+1)%s;for(let f=0;f<s;f+=1){const g=(d*s+f)*4,v=(f-1+s)%s,m=(f+1)%s,p=(l[d*s+m]-l[d*s+v])*s*.5,b=(l[h*s+f]-l[u*s+f])*s*.5,y=-p*r,_=-b*r,L=1/Math.sqrt(y*y+_*_+1);c[g+0]=Xs(128+y*L*127),c[g+1]=Xs(128+_*L*127),c[g+2]=Xs(128+L*127),c[g+3]=255}}return this.makeTexture(c,s)}generateGrayscale(e,t,n,r){const s=this.tileSize,a=new Uint8Array(s*s*4);for(let o=0;o<s;o+=1)for(let l=0;l<s;l+=1){const c=(o*s+l)*4,d=l/s,u=o/s,h=this.tileNoise(d,u,3,e)-.5,f=this.tileNoise(d,u,17,e+13)-.5,g=Xs(t+(h*r+f*(1-r))*2*n);a[c+0]=g,a[c+1]=g,a[c+2]=g,a[c+3]=255}return this.makeTexture(a,s)}makeTexture(e,t){const n=new ho(e,t,t,1023,1009);return n.colorSpace=nn,n.wrapS=1e3,n.wrapT=1e3,n.minFilter=1008,n.magFilter=1006,n.generateMipmaps=!0,n.needsUpdate=!0,n}tileNoise(e,t,n,r){const s=e*n,a=t*n,o=Math.floor(s),l=Math.floor(a),c=s-o,d=a-l,u=c*c*(3-2*c),h=d*d*(3-2*d),f=(b,y)=>this.latticeHash((b%n+n)%n,(y%n+n)%n,r),g=f(o,l),v=f(o+1,l),m=f(o,l+1),p=f(o+1,l+1);return g*(1-u)*(1-h)+v*u*(1-h)+m*(1-u)*h+p*u*h}latticeHash(e,t,n){let r=n*1664525+e*1013904223>>>0;return r=(r^t*1540483477)>>>0,r=(r^r>>>16)>>>0,r=Math.imul(r,73244475)>>>0,r=(r^r>>>16)>>>0,(r>>>0)/4294967295}}function Xs(i){return i<0?0:i>255?255:i|0}class a0{constructor(e,t,n,r,s=Yr){x(this,"group",new Zn);x(this,"scene");x(this,"config");x(this,"surfaceFactory");x(this,"materials");x(this,"disposed",!1);this.scene=e,this.config=s,this.surfaceFactory=new id(n.hubSurfaceTileSize),this.surfaceFactory.setAnisotropy(r),this.materials=this.surfaceFactory.getMaterials(t),this.buildStage(),this.scene.add(this.group)}applyPreset(e,t){this.disposed||(this.surfaceFactory.setTileSize(e.hubSurfaceTileSize),this.surfaceFactory.setAnisotropy(t))}setVisible(e){this.group.visible=e}dispose(){this.disposed||(this.disposed=!0,this.scene.remove(this.group),this.group.traverse(e=>{const t=e;t.isMesh&&t.geometry.dispose()}),this.surfaceFactory.dispose())}buildStage(){const{roomHalfWidth:e,roomRearZ:t,artworkWallZ:n,floorY:r,ceilingY:s}=this.config,a=e*2,o=s-r,l=t-n,c=r+o*.5,d=n+l*.5,u=new He(new Yt(a,o),this.materials.wall);u.position.set(0,c,n),u.receiveShadow=!0,this.group.add(u);const h=new He(new Yt(a,l),this.materials.floor);h.rotation.x=-Math.PI/2,h.position.set(0,r,d),h.receiveShadow=!0,this.group.add(h);const f=new He(new Yt(a,l),this.materials.ceiling);f.rotation.x=Math.PI/2,f.position.set(0,s,d),f.receiveShadow=!0,this.group.add(f);const g=new He(new Yt(l,o),this.materials.wall);g.rotation.y=Math.PI/2,g.position.set(-e,c,d),g.receiveShadow=!0,this.group.add(g);const v=new He(new Yt(l,o),this.materials.wall);v.rotation.y=-Math.PI/2,v.position.set(e,c,d),v.receiveShadow=!0,this.group.add(v),this.group.add(this.makeSkirting(a,r,n),this.makeSideSkirting(-e,d,l,r,!0),this.makeSideSkirting(e,d,l,r,!1),this.makeFrontReveal(a,s,n),this.makeLightStrip(a,s,n),this.makeSideReveal(-e,d,l,s,!0),this.makeSideReveal(e,d,l,s,!1))}makeSkirting(e,t,n){const r=new He(new Ut(e,this.config.skirtingHeight,this.config.skirtingDepth),this.materials.trim);return r.position.set(0,t+this.config.skirtingHeight*.5,n+this.config.skirtingDepth*.5),r}makeSideSkirting(e,t,n,r,s){const a=new He(new Ut(this.config.skirtingDepth,this.config.skirtingHeight,n),this.materials.trim);return a.position.set(e+(s?this.config.skirtingDepth*.5:-this.config.skirtingDepth*.5),r+this.config.skirtingHeight*.5,t),a}makeFrontReveal(e,t,n){const r=new He(new Ut(e,this.config.revealDrop,this.config.revealDepth),this.materials.trim);return r.position.set(0,t-this.config.revealDrop*.5,n+this.config.revealDepth*.5),r}makeSideReveal(e,t,n,r,s){const a=new He(new Ut(this.config.revealDepth,this.config.revealDrop,n),this.materials.trim);return a.position.set(e+(s?this.config.revealDepth*.5:-this.config.revealDepth*.5),r-this.config.revealDrop*.5,t),a}makeLightStrip(e,t,n){const r=new He(new Yt(e-1.2,this.config.lightStripDepth),this.materials.lightStrip);return r.rotation.x=Math.PI/2,r.position.set(0,t-this.config.revealDrop+this.config.lightStripLift,n+this.config.lightStripDepth*.5),r}}class o0 extends kr{constructor(e=null){super();const t=new Ut;t.deleteAttribute("uv");const n=new hn({side:1}),r=new hn,s=new Gc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new He(t,n);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const o=new He(t,r);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const l=new He(t,r);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);const c=new He(t,r);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const d=new He(t,r);d.position.set(-2.017,.018,6.124),d.rotation.set(0,.333,0),d.scale.set(2.002,4.566,2.064),this.add(d);const u=new He(t,r);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const h=new He(t,r);h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),this.add(h);const f=new He(t,rr(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);const g=new He(t,rr(50));g.position.set(-16.109,18.021,-8.207),g.scale.set(.1,2.425,2.751),this.add(g);const v=new He(t,rr(17));v.position.set(14.904,12.198,-1.832),v.scale.set(.15,4.265,6.331),this.add(v);const m=new He(t,rr(43));m.position.set(-.462,8.89,14.52),m.scale.set(4.38,5.441,.088),this.add(m);const p=new He(t,rr(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const b=new He(t,rr(100));b.position.set(0,20,0),b.scale.set(1,.1,1),this.add(b)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function rr(i){const e=new Yn;return e.color.setScalar(i),e}class l0{constructor(e){x(this,"scene");x(this,"camera");x(this,"environmentTarget",null);this.scene=new kr,this.camera=new Bt(40,window.innerWidth/window.innerHeight,.1,100),this.camera.position.z=7;const t=new Is(e);t.compileEquirectangularShader();const n=new o0(e);this.environmentTarget=t.fromScene(n),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=.55,t.dispose(),n.dispose()}updateAspect(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix()}dispose(){var e;(e=this.environmentTarget)==null||e.dispose(),this.environmentTarget=null}}const rd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class sr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const c0=new Ps(-1,1,1,-1,0,1);class d0 extends yn{constructor(){super(),this.setAttribute("position",new Wt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Wt([0,2,0,0,2,0],2))}}const u0=new d0;class To{constructor(e){this._mesh=new He(u0,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,c0)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class sd extends sr{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof kt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Wi.clone(e.uniforms),this.material=new kt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new To(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ad extends sr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class h0 extends sr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class f0{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new me);this._width=n.width,this._height=n.height,t=new $t(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:1016}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new sd(rd),this.copyPass.material.blending=0,this.clock=new Xv}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let r=0,s=this.passes.length;r<s;r++){const a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ad!==void 0&&(a instanceof ad?n=!0:a instanceof h0&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new me);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class p0 extends sr{constructor(e,t,n=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Le}render(e,t,n){const r=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}}const m0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Le(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class ar extends sr{constructor(e,t,n,r){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=r,this.resolution=e!==void 0?new me(e.x,e.y):new me(256,256),this.clearColor=new Le(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new $t(s,a,{type:1016}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new $t(s,a,{type:1016});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const f=new $t(s,a,{type:1016});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),a=Math.round(a/2)}const o=m0;this.highPassUniforms=Wi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new kt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new me(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const d=rd;this.copyUniforms=Wi.clone(d.uniforms),this.blendMaterial=new kt({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Le,this.oldClearAlpha=1,this.basic=new Yn,this.fsQuad=new To(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,r),this.renderTargetsVertical[s].setSize(n,r),this.separableBlurMaterials[s].uniforms.invSize.value=new me(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(e,t,n,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=ar.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ar.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new kt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new me(.5,.5)},direction:{value:new me(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new kt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}ar.BlurDirectionX=new me(1,0),ar.BlurDirectionY=new me(0,1);const g0={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class v0 extends sr{constructor(){super();const e=g0;this.uniforms=Wi.clone(e.uniforms),this.material=new Nv({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new To(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},lt.getTransfer(this._outputColorSpace)===ht&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===7&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const y0={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new me(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		precision highp float;

		uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

		//----------------------------------------------------------------------------------
		// File:        es3-keplerFXAAassetsshaders/FXAA_DefaultES.frag
		// SDK Version: v3.00
		// Email:       gameworks@nvidia.com
		// Site:        http://developer.nvidia.com/
		//
		// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
		//
		// Redistribution and use in source and binary forms, with or without
		// modification, are permitted provided that the following conditions
		// are met:
		//  * Redistributions of source code must retain the above copyright
		//    notice, this list of conditions and the following disclaimer.
		//  * Redistributions in binary form must reproduce the above copyright
		//    notice, this list of conditions and the following disclaimer in the
		//    documentation and/or other materials provided with the distribution.
		//  * Neither the name of NVIDIA CORPORATION nor the names of its
		//    contributors may be used to endorse or promote products derived
		//    from this software without specific prior written permission.
		//
		// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
		// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
		// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
		// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
		// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
		// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		//
		//----------------------------------------------------------------------------------

		#ifndef FXAA_DISCARD
			//
			// Only valid for PC OpenGL currently.
			// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
			//
			// 1 = Use discard on pixels which don't need AA.
			//     For APIs which enable concurrent TEX+ROP from same surface.
			// 0 = Return unchanged color on pixels which don't need AA.
			//
			#define FXAA_DISCARD 0
		#endif

		/*--------------------------------------------------------------------------*/
		#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
		#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
		/*--------------------------------------------------------------------------*/

		#define NUM_SAMPLES 5

		// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
		float contrast( vec4 a, vec4 b ) {
			vec4 diff = abs( a - b );
			return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
		}

		/*============================================================================

									FXAA3 QUALITY - PC

		============================================================================*/

		/*--------------------------------------------------------------------------*/
		vec4 FxaaPixelShader(
			vec2 posM,
			sampler2D tex,
			vec2 fxaaQualityRcpFrame,
			float fxaaQualityEdgeThreshold,
			float fxaaQualityinvEdgeThreshold
		) {
			vec4 rgbaM = FxaaTexTop(tex, posM);
			vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
			// . S .
			// W M E
			// . N .

			bool earlyExit = max( max( max(
					contrast( rgbaM, rgbaN ),
					contrast( rgbaM, rgbaS ) ),
					contrast( rgbaM, rgbaE ) ),
					contrast( rgbaM, rgbaW ) )
					< fxaaQualityEdgeThreshold;
			// . 0 .
			// 0 0 0
			// . 0 .

			#if (FXAA_DISCARD == 1)
				if(earlyExit) FxaaDiscard;
			#else
				if(earlyExit) return rgbaM;
			#endif

			float contrastN = contrast( rgbaM, rgbaN );
			float contrastS = contrast( rgbaM, rgbaS );
			float contrastE = contrast( rgbaM, rgbaE );
			float contrastW = contrast( rgbaM, rgbaW );

			float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
			relativeVContrast *= fxaaQualityinvEdgeThreshold;

			bool horzSpan = relativeVContrast > 0.;
			// . 1 .
			// 0 0 0
			// . 1 .

			// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
			if( abs( relativeVContrast ) < .3 ) {
				// locate the edge
				vec2 dirToEdge;
				dirToEdge.x = contrastE > contrastW ? 1. : -1.;
				dirToEdge.y = contrastS > contrastN ? 1. : -1.;
				// . 2 .      . 1 .
				// 1 0 2  ~=  0 0 1
				// . 1 .      . 0 .

				// tap 2 pixels and see which ones are "outside" the edge, to
				// determine if the edge is vertical or horizontal

				vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongH = contrast( rgbaM, rgbaAlongH );
				// . 1 .
				// 0 0 1
				// . 0 H

				vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongV = contrast( rgbaM, rgbaAlongV );
				// V 1 .
				// 0 0 1
				// . 0 .

				relativeVContrast = matchAlongV - matchAlongH;
				relativeVContrast *= fxaaQualityinvEdgeThreshold;

				if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
					// 1 1 .
					// 0 0 1
					// . 0 1

					// do a simple blur
					return mix(
						rgbaM,
						(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
						.4
					);
				}

				horzSpan = relativeVContrast > 0.;
			}

			if(!horzSpan) rgbaN = rgbaW;
			if(!horzSpan) rgbaS = rgbaE;
			// . 0 .      1
			// 1 0 1  ->  0
			// . 0 .      1

			bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
			if(!pairN) rgbaN = rgbaS;

			vec2 offNP;
			offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
			offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

			bool doneN = false;
			bool doneP = false;

			float nDist = 0.;
			float pDist = 0.;

			vec2 posN = posM;
			vec2 posP = posM;

			int iterationsUsed = 0;
			int iterationsUsedN = 0;
			int iterationsUsedP = 0;
			for( int i = 0; i < NUM_SAMPLES; i++ ) {
				iterationsUsed = i;

				float increment = float(i + 1);

				if(!doneN) {
					nDist += increment;
					posN = posM + offNP * nDist;
					vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
					doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
					iterationsUsedN = i;
				}

				if(!doneP) {
					pDist += increment;
					posP = posM - offNP * pDist;
					vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
					doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
					iterationsUsedP = i;
				}

				if(doneN || doneP) break;
			}


			if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

			float dist = min(
				doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
				doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
			);

			// hacky way of reduces blurriness of mostly diagonal edges
			// but reduces AA quality
			dist = pow(dist, .5);

			dist = 1. - dist;

			return mix(
				rgbaM,
				rgbaN,
				dist * .5
			);
		}

		void main() {
			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;

			gl_FragColor = FxaaPixelShader(
				vUv,
				tDiffuse,
				resolution,
				edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
				invEdgeDetectionQuality
			);

		}
	`};class x0{constructor(e,t,n,r){x(this,"composer");x(this,"bloomPass");x(this,"fxaaPass");x(this,"renderer");var o;this.renderer=e,this.composer=new f0(e);const s=new p0(t,n);this.composer.addPass(s),this.bloomPass=new ar(new me(window.innerWidth,window.innerHeight),r.bloomStrength,r.bloomRadius,r.bloomThreshold),this.bloomPass.enabled=r.bloomStrength>0,this.composer.addPass(this.bloomPass),this.fxaaPass=new sd(y0),this.applyFXAAResolution(window.innerWidth,window.innerHeight),this.fxaaPass.enabled=(o=r.fxaaEnabled)!=null?o:!0,this.composer.addPass(this.fxaaPass);const a=new v0;this.composer.addPass(a)}applyPreset(e){var t;this.bloomPass.strength=e.bloomStrength,this.bloomPass.radius=e.bloomRadius,this.bloomPass.threshold=e.bloomThreshold,this.bloomPass.enabled=e.bloomStrength>0,this.fxaaPass.enabled=(t=e.fxaaEnabled)!=null?t:!0}resize(e,t){this.composer.setSize(Math.max(1,e),Math.max(1,t)),this.applyFXAAResolution(e,t)}prewarmComposer(e,t){try{this.resize(4,4),this.composer.render()}finally{this.resize(e,t)}}render(){this.composer.render()}dispose(){this.composer.dispose()}applyFXAAResolution(e,t){const n=this.renderer.getPixelRatio();this.fxaaPass.material.uniforms.resolution.value.set(1/(e*n),1/(t*n))}}const _0={ambientIntensity:.75,ambientKelvin:4900,keys:[{kelvin:4400,intensity:78,position:{x:-4.2,y:6,z:5.1},angle:.66,penumbra:.97,decay:1.6},{kelvin:5100,intensity:28,position:{x:4.4,y:5.1,z:4.8},angle:.82,penumbra:.99,decay:1.5}]};function Ao(i,e){const t=Math.max(1e3,Math.min(4e4,i))/100;let n,r,s;t<=66?(n=255,r=99.4708025861*Math.log(t)-161.1195681661,s=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307):(n=329.698727446*Math.pow(t-60,-.1332047592),r=288.1221695283*Math.pow(t-60,-.0755148492),s=255),n=Math.max(0,Math.min(255,n))/255,r=Math.max(0,Math.min(255,r))/255,s=Math.max(0,Math.min(255,s))/255;const a=e!=null?e:new Le;return a.setRGB(n,r,s),a}const b0=100;class S0{constructor(e,t){x(this,"scene");x(this,"ambientLight");x(this,"spots",[]);x(this,"spotTarget");x(this,"accent",null);x(this,"profile");x(this,"animate",!0);x(this,"lastUpdateTime",0);x(this,"animatedTime",0);x(this,"shadowsEnabled",!1);this.scene=e,this.profile=_0,this.ambientLight=new Vv(16777215,this.profile.ambientIntensity),e.add(this.ambientLight),this.spotTarget=new St,this.spotTarget.position.set(0,0,0),e.add(this.spotTarget),this.applyProfile(this.profile),this.applyPreset(t)}applyPreset(e){this.shadowsEnabled=e.shadows,this.spots.forEach((t,n)=>this.applyShadowPreset(t,e,n===0))}getLights(){return[...this.spots,this.ambientLight]}getExpectedShadowCasterCount(){return this.shadowsEnabled?this.spots.length:0}setAnimated(e){this.animate=e}update(e){var r,s;if(!this.animate)return!1;this.lastUpdateTime>0&&(this.animatedTime+=Math.min(e-this.lastUpdateTime,b0)),this.lastUpdateTime=e;const t=this.spots[0];if(!t)return!1;const n=(s=(r=this.profile.keys[0])==null?void 0:r.position.x)!=null?s:-3;return t.position.x=n+Math.sin(this.animatedTime*2e-4)*.25,!0}dispose(){this.ambientLight.dispose();for(const e of this.spots)this.scene.remove(e),e.dispose();this.spots.length=0,this.scene.remove(this.spotTarget),this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}getKeyLightWorldDir(e){const t=e!=null?e:new R,n=this.spots[0];return n?t.copy(n.position).normalize():t.set(0,0,1)}applyProfile(e){var t;for(this.ambientLight.intensity=e.ambientIntensity,Ao(e.ambientKelvin,this.ambientLight.color);this.spots.length<e.keys.length;){const n=new zv(16777215,0);this.scene.add(n),this.spots.push(n)}for(;this.spots.length>e.keys.length;){const n=this.spots.pop();this.scene.remove(n),n.dispose()}e.keys.forEach((n,r)=>this.applyKeyLight(this.spots[r],n)),e.accent?(this.accent||(this.accent=new Gc(16777215,0,30),this.scene.add(this.accent)),Ao(e.accent.kelvin,this.accent.color),this.accent.intensity=e.accent.intensity,this.accent.position.set(e.accent.position.x,e.accent.position.y,e.accent.position.z),this.accent.decay=(t=e.accent.decay)!=null?t:2):this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}applyKeyLight(e,t){var n,r,s;Ao(t.kelvin,e.color),e.intensity=t.intensity,e.distance=80,e.angle=(n=t.angle)!=null?n:.42,e.penumbra=(r=t.penumbra)!=null?r:.9,e.decay=(s=t.decay)!=null?s:1.8,e.position.set(t.position.x,t.position.y,t.position.z),e.target=this.spotTarget}applyShadowPreset(e,t,n){var a;const r=t.shadows&&n;if(e.castShadow!==r&&(e.castShadow=r),!r)return;const s=t.id==="high"?1024:512;(e.shadow.mapSize.x!==s||e.shadow.mapSize.y!==s)&&(e.shadow.mapSize.set(s,s),(a=e.shadow.map)==null||a.dispose(),e.shadow.map=null),e.shadow.bias=-15e-5,e.shadow.normalBias=.025,e.shadow.radius=2.4,e.shadow.camera.near=.5,e.shadow.camera.far=28,e.shadow.focus=.9,e.shadow.camera.updateProjectionMatrix()}}function $s(i){return i.startsWith("data:")?"data-uri":/^https?:\/\//i.test(i)?"external-http":/^file:\/\//i.test(i)?"file-url":"local-relative"}function M0(i,e){var n,r;if($s(i)!=="local-relative")return i;const t=(r=(n=e==null?void 0:e.assetBaseUrl)==null?void 0:n.trim())!=null?r:"";if(t)try{return new URL(i,t).href}catch(s){return i}if(typeof window=="undefined")return i;try{return new URL(i,window.location.href).href}catch(s){return i}}function od(i,e,t){var s;const n=i.trim(),r=M0(n,t);return{declaredUrl:n,resolvedUrl:r,mode:e,declaredUrlType:$s(n),resolvedUrlType:$s(r),bundleId:((s=t==null?void 0:t.bundleId)==null?void 0:s.trim())||null}}function pi(i){var a,o,l,c;const e=i==null?void 0:i.imageSourceContext,t=(o=(a=i==null?void 0:i.image)==null?void 0:a.trim())!=null?o:"",n=(c=(l=i==null?void 0:i.webglImage)==null?void 0:l.trim())!=null?c:"",r=t?od(t,"declared-image",e):null,s=n&&n!==t?od(n,"embedded-webgl-fallback",e):null;return{primary:r,fallback:s}}function Qe(i){if($s(i)!=="data-uri")return i;const e=i.indexOf(";");return`[data-uri:${e<=5?"unknown":i.slice(5,e)}:${i.length}bytes]`}function w0(i,e,t){const n=Math.max(0,Math.floor(i)),r=Math.max(0,Math.floor(e));if(t<=0||n<=0||r<=0||n<=t&&r<=t)return{needsDownscale:!1,sourceWidth:n,sourceHeight:r,targetWidth:n,targetHeight:r};const a=Math.min(t/n,t/r);return{needsDownscale:!0,sourceWidth:n,sourceHeight:r,targetWidth:Math.max(1,Math.floor(n*a)),targetHeight:Math.max(1,Math.floor(r*a))}}function ld(i,e,t,n){const r=w0(e,t,n);if(!r.needsDownscale)return{image:i,fit:r,downscaleApplied:!1};const s=document.createElement("canvas");s.width=r.targetWidth,s.height=r.targetHeight;const a=s.getContext("2d");return a?(a.drawImage(i,0,0,r.targetWidth,r.targetHeight),{image:s,fit:r,downscaleApplied:!0}):{image:i,fit:r,downscaleApplied:!1}}const sn=4,cd=new WeakMap;function E0(i){const e=cd.get(i);if(e)return e;const t=new $t(sn,sn,{depthBuffer:!1,stencilBuffer:!1}),n=new kr,r=new Ps(-1,1,1,-1,0,2);r.position.z=1;const s=new Yn({toneMapped:!1,transparent:!0}),a=new He(new Yt(2,2),s);n.add(a);const o={renderTarget:t,scene:n,camera:r,material:s,buffer:new Uint8Array(sn*sn*4)};return cd.set(i,o),o}function dd(i,e){var t,n,r,s;try{const a=E0(i);a.material.map=e,a.material.needsUpdate=!0;const o=i.getRenderTarget();i.setRenderTarget(a.renderTarget),i.render(a.scene,a.camera),i.readRenderTargetPixels(a.renderTarget,0,0,sn,sn,a.buffer),i.setRenderTarget(o),a.material.map=null;const l=sn*sn;let c=0,d=0,u=0,h=0;for(let v=0;v<a.buffer.length;v+=4)c+=(t=a.buffer[v])!=null?t:0,d+=(n=a.buffer[v+1])!=null?n:0,u+=(r=a.buffer[v+2])!=null?r:0,h+=(s=a.buffer[v+3])!=null?s:0;const f={r:Math.round(c/l),g:Math.round(d/l),b:Math.round(u/l),a:Math.round(h/l)},g=f.a>0;return{pass:g,probeWidth:sn,probeHeight:sn,averageColor:f,reason:g?void 0:"zero-alpha-readback"}}catch(a){return{pass:!1,probeWidth:sn,probeHeight:sn,averageColor:{r:0,g:0,b:0,a:0},reason:a instanceof Error?a.message:"probe-error"}}}function Dn(){return typeof window=="undefined"||!window.location?null:window.location.protocol||null}function Ro(i){return i.debugEnabled?!0:i.runtimeProtocol==="file:"&&i.resolvedUrlType==="file-url"}function T0(i,e){return e&&i.runtimeProtocol==="file:"&&i.resolvedUrlType==="file-url"}function ud(i,e){return e&&Ro(i)}function or(i,e){var r;const t=e.result==="success"?i.info.bind(i):i.warn.bind(i),n=e.result==="success"?`${e.route==="hub"?"Hub":"Gallery"} artwork proved source→decode→GPU→pixels`:`${e.route==="hub"?"Hub":"Gallery"} artwork failed source-to-pixel proof at ${(r=e.firstFailedStage)!=null?r:"unknown"} stage`;t("source-to-pixel-outcome",n,e)}class A0{constructor(e=Fc){x(this,"diagnostics",Jt("texture"));x(this,"cache",new Map);x(this,"externalLoader");x(this,"localLoader");x(this,"maxAnisotropy",1);x(this,"maxTextureSize",0);x(this,"anisotropyDivisor",1);x(this,"renderer",null);x(this,"imageBitmapDecodeSupported",typeof createImageBitmap=="function"&&typeof Wv=="function");x(this,"fallbackKeys",new Set);x(this,"artworkAlbedoSelections",new Map);x(this,"uploadFits",new Map);this.externalLoader=new Oc(e),this.localLoader=new Oc(e),this.externalLoader.setCrossOrigin("anonymous")}init(e){this.renderer=e,this.maxAnisotropy=e.capabilities.getMaxAnisotropy(),this.maxTextureSize=e.capabilities.maxTextureSize,this.diagnostics.info("capabilities","Texture manager initialized",{maxAnisotropy:this.maxAnisotropy,maxTextureSize:this.maxTextureSize,imageBitmapDecodeSupported:this.imageBitmapDecodeSupported,imageBitmapStatus:this.imageBitmapDecodeSupported?"available-for-guarded-benchmark":"unsupported-or-unavailable",compressedTexturePipeline:"ktx2-basis-future-importer-milestone"})}setAnisotropyDivisor(e){const t=Math.max(1,e);if(t===this.anisotropyDivisor){this.diagnostics.debug("anisotropy-noop","Anisotropy divisor unchanged; skipping cache walk",{divisor:t,cacheSize:this.cache.size});return}this.anisotropyDivisor=t;const n=this.getEffectiveAnisotropy();this.cache.forEach(r=>{r.anisotropy=n,r.needsUpdate=!0}),this.diagnostics.debug("anisotropy-applied","Anisotropy divisor changed; cache marked for re-upload",{divisor:t,anisotropy:n,cacheSize:this.cache.size})}getEffectiveAnisotropy(){return Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor))}async preload(e){this.diagnostics.info("preload",`Preloading ${e.length} albedo texture(s)`,{count:e.length,urlTypes:e.map(t=>this.compactUrlType(t))}),await Promise.all(e.map(t=>this.load(t)))}async preloadArtworkAlbedos(e){this.diagnostics.info("preload",`Preloading ${e.length} artwork albedo texture(s)`,{count:e.length,artworks:e.map(t=>{var r,s,a,o,l,c,d,u;const n=pi(t);return{artworkId:t.id,bundleId:(s=(r=n.primary)==null?void 0:r.bundleId)!=null?s:null,declaredImageUrlType:(o=(a=n.primary)==null?void 0:a.declaredUrlType)!=null?o:null,resolvedImageUrlType:(c=(l=n.primary)==null?void 0:l.resolvedUrlType)!=null?c:null,hasEmbeddedFallback:!!n.fallback,embeddedFallbackUrlType:(u=(d=n.fallback)==null?void 0:d.resolvedUrlType)!=null?u:null}})}),await Promise.all(e.map(t=>this.loadArtworkAlbedo(t)))}async loadArtworkAlbedo(e){var l,c,d,u,h,f,g,v,m,p,b;const t=pi(e),n=t.primary,r=this.artworkAlbedoSelections.get(e.id);if(r){const y=(l=this.cache.get(`albedo::${r.selectedUrl}`))!=null?l:n?this.cache.get(`albedo::${n.resolvedUrl}`):void 0;if(y)return y}const s=this.now();if(!n){const y=this.createFallbackTexture(e.id);return(c=this.renderer)==null||c.initTexture(y),this.artworkAlbedoSelections.set(e.id,{selectedUrl:e.image,selectedUrlType:"local-relative",declaredUrl:e.image,declaredUrlType:"local-relative",sourceMode:"declared-image",bundleId:null,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,generatedFallback:!0}),or(this.diagnostics,{route:"gallery",artworkId:e.id,bundleId:null,runtimeProtocol:Dn(),candidateMode:null,resolvedUrlType:null,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,result:"failed",firstFailedStage:"candidate-selected",failureReason:"no-declared-source",elapsedMs:Math.round(this.now()-s),sourceWidth:null,sourceHeight:null,uploadWidth:null,uploadHeight:null,downscaleApplied:!1,rendererMaxTextureSize:this.maxTextureSize||null,visibleProbe:null}),y}const a=await this.loadForRole(n.resolvedUrl,"albedo");if(!this.isFallback(n.resolvedUrl,"albedo")){const y=this.probeArtworkTexture(a,n.resolvedUrlType),_=ud({runtimeProtocol:Dn(),resolvedUrlType:n.resolvedUrlType,debugEnabled:this.diagnostics.isDebugEnabled()},!!t.fallback);if(y.failureReason&&_&&t.fallback){const L=t.fallback,C=`${n.mode}:visible-pixel-probe:${y.failureReason}`;this.diagnostics.warn("artwork-albedo-retry","Declared artwork image failed after GPU upload; retrying embedded fallback",{artworkId:e.id,bundleId:n.bundleId,declaredImageUrl:Qe(n.declaredUrl),fallbackImageUrl:Qe(L.resolvedUrl),declaredImageUrlType:n.declaredUrlType,fallbackImageUrlType:L.resolvedUrlType,fallbackReason:C,visibleProbe:y.visibleProbe});const T=await this.loadForRole(L.resolvedUrl,"albedo");if(!this.isFallback(L.resolvedUrl,"albedo")){const U=this.probeArtworkTexture(T,L.resolvedUrlType);return U.failureReason?(this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:L.bundleId,candidateMode:L.mode,resolvedUrlType:L.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,stage:"visible-pixel-probe",failureReason:`${L.mode}:visible-pixel-probe:${U.failureReason}`,fit:(u=this.uploadFits.get(`albedo::${L.resolvedUrl}`))!=null?u:null,visibleProbe:U.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)):(this.promoteArtworkAlbedo(n.resolvedUrl,T,(d=this.uploadFits.get(`albedo::${L.resolvedUrl}`))!=null?d:null),this.artworkAlbedoSelections.set(e.id,{selectedUrl:L.resolvedUrl,selectedUrlType:L.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:L.mode,bundleId:L.bundleId,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,generatedFallback:!1}),this.diagnostics.info("artwork-albedo-fallback","Artwork albedo resolved through embedded fallback",{artworkId:e.id,bundleId:L.bundleId,declaredImageUrl:Qe(n.declaredUrl),resolvedImageUrl:Qe(L.resolvedUrl),declaredImageUrlType:n.declaredUrlType,resolvedImageUrlType:L.resolvedUrlType}),this.recordAlbedoOutcome(e.id,L.resolvedUrl,L.bundleId,L.mode,L.resolvedUrlType,{usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,texture:T,visibleProbe:U.visibleProbe}),T)}return this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:n.bundleId,candidateMode:n.mode,resolvedUrlType:n.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,startedAt:s,stage:"visible-pixel-probe",failureReason:C,fit:(h=this.uploadFits.get(`albedo::${n.resolvedUrl}`))!=null?h:null,visibleProbe:y.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)}return y.failureReason?(this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:n.bundleId,candidateMode:n.mode,resolvedUrlType:n.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,startedAt:s,stage:"visible-pixel-probe",failureReason:`${n.mode}:visible-pixel-probe:${y.failureReason}`,fit:(f=this.uploadFits.get(`albedo::${n.resolvedUrl}`))!=null?f:null,visibleProbe:y.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)):(this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,generatedFallback:!1}),this.recordAlbedoOutcome(e.id,n.resolvedUrl,n.bundleId,n.mode,n.resolvedUrlType,{usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,startedAt:s,texture:a,visibleProbe:y.visibleProbe}),a)}const o=t.fallback;if(o){this.diagnostics.warn("artwork-albedo-retry","Declared artwork image failed; retrying embedded fallback",{artworkId:e.id,bundleId:n.bundleId,declaredImageUrl:Qe(n.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:n.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType});const y=await this.loadForRole(o.resolvedUrl,"albedo");if(!this.isFallback(o.resolvedUrl,"albedo")){const _=this.probeArtworkTexture(y,o.resolvedUrlType);return _.failureReason?(this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,stage:"visible-pixel-probe",failureReason:`${o.mode}:visible-pixel-probe:${_.failureReason}`,fit:(v=this.uploadFits.get(`albedo::${o.resolvedUrl}`))!=null?v:null,visibleProbe:_.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)):(this.promoteArtworkAlbedo(n.resolvedUrl,y,(g=this.uploadFits.get(`albedo::${o.resolvedUrl}`))!=null?g:null),this.artworkAlbedoSelections.set(e.id,{selectedUrl:o.resolvedUrl,selectedUrlType:o.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:o.mode,bundleId:o.bundleId,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,generatedFallback:!1}),this.diagnostics.info("artwork-albedo-fallback","Artwork albedo resolved through embedded fallback",{artworkId:e.id,bundleId:o.bundleId,declaredImageUrl:Qe(n.declaredUrl),resolvedImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:n.declaredUrlType,resolvedImageUrlType:o.resolvedUrlType}),this.recordAlbedoOutcome(e.id,o.resolvedUrl,o.bundleId,o.mode,o.resolvedUrlType,{usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,texture:y,visibleProbe:_.visibleProbe}),y)}}return this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!!o,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:n.bundleId,candidateMode:(m=o==null?void 0:o.mode)!=null?m:n.mode,resolvedUrlType:(p=o==null?void 0:o.resolvedUrlType)!=null?p:n.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!!o,startedAt:s,stage:"request",failureReason:o?"primary-and-fallback-load-failed":"primary-load-failed-no-fallback",fit:null,visibleProbe:null}),(b=this.cache.get(`albedo::${n.resolvedUrl}`))!=null?b:a}recordAlbedoOutcome(e,t,n,r,s,a){var l,c,d,u,h,f,g;const o=(l=this.uploadFits.get(`albedo::${t}`))!=null?l:null;or(this.diagnostics,{route:"gallery",artworkId:e,bundleId:n,runtimeProtocol:Dn(),candidateMode:r,resolvedUrlType:s,usedEmbeddedFallback:a.usedEmbeddedFallback,attemptedEmbeddedFallback:a.attemptedEmbeddedFallback,result:"success",firstFailedStage:null,failureReason:null,elapsedMs:Math.round(this.now()-a.startedAt),sourceWidth:(c=o==null?void 0:o.sourceWidth)!=null?c:null,sourceHeight:(d=o==null?void 0:o.sourceHeight)!=null?d:null,uploadWidth:(u=o==null?void 0:o.targetWidth)!=null?u:null,uploadHeight:(h=o==null?void 0:o.targetHeight)!=null?h:null,downscaleApplied:(f=o==null?void 0:o.needsDownscale)!=null?f:!1,rendererMaxTextureSize:this.maxTextureSize||null,visibleProbe:(g=a.visibleProbe)!=null?g:null})}getArtworkAlbedoSelection(e){return this.artworkAlbedoSelections.get(e.id)}load(e){return this.loadForRole(e,"albedo")}loadForRole(e,t){const n=`${t}::${e}`;if(this.cache.has(n))return Promise.resolve(this.cache.get(n));const r=/^https?:\/\//i.test(e),s=r?this.externalLoader:this.localLoader,a=this.classifyUrlType(e),o=this.redactUrlForLog(e);return this.diagnostics.debug("load-start",`Starting ${t} texture load`,{url:o,urlType:a,role:t,crossOrigin:r?"anonymous":"none"}),new Promise(l=>{s.load(e,c=>{var d,u;try{this.prepareTexture(c,t);const h=c.image,f="naturalWidth"in h?h.naturalWidth||h.width||0:h.width||0,g="naturalHeight"in h?h.naturalHeight||h.height||0:h.height||0,v=ld(h,f,g,this.maxTextureSize);v.downscaleApplied?(c.image=v.image,c.needsUpdate=!0,this.diagnostics.warn("texture-downscaled",`Downscaled oversized ${t} texture to fit device capability`,{role:t,url:o,urlType:a,sourceWidth:f,sourceHeight:g,uploadWidth:v.fit.targetWidth,uploadHeight:v.fit.targetHeight,maxTextureSize:this.maxTextureSize})):v.fit.needsDownscale&&this.warnIfOversized(t,o,a,f,g),this.uploadFits.set(n,v.fit),(d=this.renderer)==null||d.initTexture(c),this.cache.set(n,c),this.fallbackKeys.delete(n),this.diagnostics.info("load-success",`Loaded ${t} texture`,{url:o,urlType:a,width:v.fit.targetWidth,height:v.fit.targetHeight,sourceWidth:f,sourceHeight:g,downscaleApplied:v.downscaleApplied,fallbackUsed:!1}),l(c)}catch(h){c.dispose(),this.uploadFits.delete(n),this.diagnostics.warn("load-fallback",`Failed to prepare ${t} texture for upload — creating generated fallback`,{url:o,urlType:a,role:t,failureStage:"gpu-upload",errorMessage:h instanceof Error?h.message:String(h)});const f=this.createFallbackTexture(e);this.cache.set(n,f),this.uploadFits.delete(n),(u=this.renderer)==null||u.initTexture(f),this.fallbackKeys.add(n),l(f)}},void 0,c=>{var u;this.diagnostics.warn("load-fallback",`Failed to load ${t} texture — creating generated fallback`,{url:o,urlType:a,role:t,errorMessage:c instanceof Error?c.message:String(c)});const d=this.createFallbackTexture(e);this.cache.set(n,d),this.uploadFits.delete(n),(u=this.renderer)==null||u.initTexture(d),this.fallbackKeys.add(n),l(d)})})}async preloadTextureSet(e){if(!e)return{};const t=["albedo","normal","detailNormal","height","roughness","specular","ao","varnish"],n=t.filter(s=>!!e[s]);this.diagnostics.debug("preload-texture-set",`Loading authored texture set (${n.length} role(s))`,{roles:n});const r={};return await Promise.all(t.map(async s=>{const a=e[s];if(!a)return;const o=await this.loadForRole(a.url,s);r[s]=o})),r}get(e){const t=`albedo::${e}`,n=this.cache.get(t);return n||this.diagnostics.debug("cache-miss","Albedo cache miss — texture not preloaded for this URL",{url:this.redactUrlForLog(e),cacheSize:this.cache.size}),n}getForRole(e,t){return this.cache.get(`${t}::${e}`)}isFallback(e,t="albedo"){return this.fallbackKeys.has(`${t}::${e}`)}dispose(){this.cache.forEach(e=>e.dispose()),this.cache.clear(),this.fallbackKeys.clear(),this.artworkAlbedoSelections.clear(),this.uploadFits.clear()}promoteArtworkAlbedo(e,t,n){const r=`albedo::${e}`,s=this.cache.get(r);s&&s!==t&&s.dispose(),this.cache.set(r,t),this.fallbackKeys.delete(r),n?this.uploadFits.set(r,n):this.uploadFits.delete(r)}installGeneratedFallbackTexture(e,t){var a;const n=`albedo::${e}`,r=this.cache.get(n);r&&r.dispose();const s=this.createFallbackTexture(t);return this.cache.set(n,s),this.uploadFits.delete(n),this.fallbackKeys.add(n),(a=this.renderer)==null||a.initTexture(s),s}recordFailedAlbedoOutcome(e,t){var n,r,s,a,o,l,c,d,u,h;or(this.diagnostics,{route:"gallery",artworkId:e,bundleId:t.bundleId,runtimeProtocol:Dn(),candidateMode:t.candidateMode,resolvedUrlType:t.resolvedUrlType,usedEmbeddedFallback:t.usedEmbeddedFallback,attemptedEmbeddedFallback:t.attemptedEmbeddedFallback,result:"failed",firstFailedStage:t.stage,failureReason:t.failureReason,elapsedMs:Math.round(this.now()-t.startedAt),sourceWidth:(r=(n=t.fit)==null?void 0:n.sourceWidth)!=null?r:null,sourceHeight:(a=(s=t.fit)==null?void 0:s.sourceHeight)!=null?a:null,uploadWidth:(l=(o=t.fit)==null?void 0:o.targetWidth)!=null?l:null,uploadHeight:(d=(c=t.fit)==null?void 0:c.targetHeight)!=null?d:null,downscaleApplied:(h=(u=t.fit)==null?void 0:u.needsDownscale)!=null?h:!1,rendererMaxTextureSize:this.maxTextureSize||null,visibleProbe:t.visibleProbe})}probeArtworkTexture(e,t){var s;if(!Ro({runtimeProtocol:Dn(),resolvedUrlType:t,debugEnabled:this.diagnostics.isDebugEnabled()})||!this.renderer)return{visibleProbe:null,failureReason:null};const r=dd(this.renderer,e);return{visibleProbe:r,failureReason:r.pass?null:(s=r.reason)!=null?s:"probe-failed"}}now(){return typeof performance!="undefined"?performance.now():Date.now()}prepareTexture(e,t){t==="albedo"?e.colorSpace=Nt:e.colorSpace=nn,t==="detailNormal"&&(e.wrapS=1e3,e.wrapT=1e3);const n=Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor));e.anisotropy=n,e.needsUpdate=!0}createFallbackTexture(e){const t=document.createElement("canvas");t.width=1600,t.height=1100;const n=t.getContext("2d");if(n){const s=this.hash(e)%32,a=n.createLinearGradient(0,0,t.width,t.height);a.addColorStop(0,`hsl(${205+s}, 18%, 92%)`),a.addColorStop(.55,`hsl(${35+s}, 22%, 78%)`),a.addColorStop(1,`hsl(${205+s}, 12%, 62%)`),n.fillStyle=a,n.fillRect(0,0,t.width,t.height),n.strokeStyle="rgba(255,255,255,0.34)",n.lineWidth=28,n.beginPath(),n.moveTo(t.width*.08,t.height*.28),n.bezierCurveTo(t.width*.35,t.height*.08,t.width*.58,t.height*.32,t.width*.9,t.height*.22),n.stroke(),n.fillStyle="rgba(17,24,29,0.16)",n.font="700 58px Inter, Arial, sans-serif",n.fillText("FREYRAUM",96,t.height-96)}const r=new Ns(t);return this.prepareTexture(r,"albedo"),r}warnIfOversized(e,t,n,r,s){this.maxTextureSize<=0||r<=this.maxTextureSize&&s<=this.maxTextureSize||this.diagnostics.warn("texture-oversized","Loaded texture exceeds device MAX_TEXTURE_SIZE",{role:e,url:t,urlType:n,width:r,height:s,maxTextureSize:this.maxTextureSize,likelyBrowserDownscale:!0})}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t}classifyUrlType(e){return e.startsWith("data:")?"data-uri":/^https?:\/\//i.test(e)?"external-http":/^file:\/\//i.test(e)?"file-url":"local-relative"}compactUrlType(e){const t=this.classifyUrlType(e);return t==="external-http"?"http":t==="file-url"?"file":t==="local-relative"?"local":`data-uri:${this.dataUriMime(e)}`}redactUrlForLog(e){return this.classifyUrlType(e)!=="data-uri"?e:`[data-uri:${this.dataUriMime(e)}:${e.length}bytes]`}dataUriMime(e){const t=e.indexOf(";");return t<=5?"unknown":e.slice(5,t)}}const lr="matte-print",bn={canvas:{id:"canvas",label:"Canvas",proceduralRoles:["normal","detailNormal","height","roughness","specular"],bodyDepth:.05,backerColor:"#E6E1D5",baseRoughness:.92,specularScale:.42,clearcoatStrength:0,clearcoatRoughness:.36},"fine-art-paper":{id:"fine-art-paper",label:"Fine art paper",proceduralRoles:["roughness"],bodyDepth:.026,backerColor:"#F1ECE2",baseRoughness:.985,specularScale:0,clearcoatStrength:0,clearcoatRoughness:.36},"matte-print":{id:"matte-print",label:"Matte print",proceduralRoles:["roughness"],bodyDepth:.03,backerColor:"#DDD8CE",baseRoughness:.96,specularScale:0,clearcoatStrength:0,clearcoatRoughness:.36},"satin-print":{id:"satin-print",label:"Satin print",proceduralRoles:["roughness","specular"],bodyDepth:.03,backerColor:"#DDD8CE",baseRoughness:.82,specularScale:.82,clearcoatStrength:0,clearcoatRoughness:.32},"glazed-print":{id:"glazed-print",label:"Glazed print",proceduralRoles:["roughness","specular","varnish"],bodyDepth:.03,backerColor:"#DCD7CD",baseRoughness:.8,specularScale:.9,clearcoatStrength:.12,clearcoatRoughness:.26}};function hd(i){if(typeof i!="string")return null;const e=i.trim().toLowerCase();return e&&e in bn?e:null}function R0(i){var e;return(e=hd(i))!=null?e:lr}const fd="#include <common>",C0="#include <map_fragment>",P0="#include <normal_fragment_maps>",pd="#include <lights_fragment_end>";class I0 extends Dc{constructor(t){const n=bn[lr],r=n.clearcoatStrength>0?.06:n.specularScale>0?.04:.015;super({roughness:n.baseRoughness,metalness:0,emissive:16777215,emissiveIntensity:t.albedoFidelityFill,clearcoat:0,specularIntensity:r});x(this,"paintingUniforms");x(this,"currentVariant");x(this,"activePresentation",lr);x(this,"hasDetailNormal",!1);x(this,"hasBump",!1);x(this,"hasAO",!1);x(this,"grazingEnabled",!1);x(this,"parallaxEnabledFlag",!1);x(this,"selfShadowEnabledFlag",!1);x(this,"albedoOnlyEnabled",!1);x(this,"shadowDebugEnabled",!1);x(this,"shadowFilterEnabled",!1);x(this,"reducedMotion",!1);this.paintingUniforms={uDetailNormalStrength:{value:t.detailNormalStrength},uDetailTiling:{value:new me(8,8)},uBumpStrength:{value:t.bumpStrength},uLightGrazingBoost:{value:.16},uReducedMotionScalar:{value:1},tDetailNormal:{value:null},uParallaxScale:{value:t.parallaxEnabled?t.parallaxScale:0},uParallaxSteps:{value:t.parallaxSteps},uShadowSteps:{value:t.selfShadowSteps},uShadowStrength:{value:t.selfShadowStrength},uShadowBias:{value:t.selfShadowBias},uShadowSoftness:{value:t.selfShadowSoftness},uShadowMaxOcclusion:{value:t.selfShadowMaxOcclusion},uShadowProfileScale:{value:.5},uShadowFilterRadius:{value:t.selfShadowFilterRadius},uKeyLightDir:{value:new R(0,0,1)},uAlbedoOnly:{value:0}},this.currentVariant=t.shaderVariant,this.normalScale.set(t.normalStrength,t.normalStrength),this.grazingEnabled=t.grazingBoostEnabled,this.parallaxEnabledFlag=t.parallaxEnabled,this.selfShadowEnabledFlag=t.selfShadowEnabled,this.applyPresentation(lr,t),this.onBeforeCompile=s=>{Object.assign(s.uniforms,this.paintingUniforms);const a=[];this.detailNormalActive()&&a.push("#define PAINTING_USE_DETAIL_NORMAL"),this.hasBump&&this.paintingUniforms.uBumpStrength.value>0&&a.push("#define PAINTING_USE_BUMP"),this.hasAO&&a.push("#define PAINTING_USE_AO"),this.grazingEnabled&&a.push("#define PAINTING_USE_GRAZING_BOOST"),this.parallaxActive()&&a.push("#define PAINTING_USE_PARALLAX"),this.selfShadowActive()&&a.push("#define PAINTING_USE_SELFSHADOW"),this.albedoOnlyEnabled&&a.push("#define PAINTING_DEBUG_ALBEDO_ONLY"),this.shadowDebugEnabled&&a.push("#define PAINTING_DEBUG_SHADOW"),this.shadowFilterEnabled&&this.selfShadowActive()&&this.paintingUniforms.uShadowFilterRadius.value>0&&a.push("#define PAINTING_USE_SHADOW_FILTER");let o=s.fragmentShader;o=o.replace(fd,`${fd}

 #ifdef GL_FRAGMENT_PRECISION_HIGH
 precision highp float;
 precision highp int;
 #else
 precision mediump float;
 precision mediump int;
 #endif
uniform float uDetailNormalStrength;
uniform float uBumpStrength;
uniform float uLightGrazingBoost;
uniform float uReducedMotionScalar;
uniform vec2  uDetailTiling;
uniform sampler2D tDetailNormal;
uniform float uParallaxScale;
uniform float uParallaxSteps;
uniform float uShadowSteps;
uniform float uShadowStrength;
uniform float uShadowBias;
uniform float uShadowSoftness;
uniform float uShadowMaxOcclusion;
uniform float uShadowProfileScale;
uniform float uShadowFilterRadius;
uniform vec3  uKeyLightDir;
uniform float uAlbedoOnly;
`),o=o.replace(C0,`
#ifdef PAINTING_USE_PARALLAX
    vec3 _tsViewDir = normalize(vec3(
        dot(vViewPosition, vTangent.xyz),
        dot(vViewPosition, vBitangent),
        dot(vViewPosition, vNormal)
    ));
    vec2 pUV = vMapUv;
    float _stepSize = 1.0 / max(uParallaxSteps, 1.0);
    float _layerH = 0.0;
    // tsViewDir points FROM surface TOWARDS camera, so we march in -xy.
    vec2 _uvDelta = (-_tsViewDir.xy / max(abs(_tsViewDir.z), 0.2)) * (uParallaxScale * _stepSize);
    for (int _i = 0; _i < 16; _i++) {
        if (float(_i) >= uParallaxSteps) break;
        _layerH += _stepSize;
        pUV += _uvDelta;
        float _h = texture2D(bumpMap, pUV).r;
        if (_h >= _layerH) break;
    }
    pUV = clamp(pUV, 0.001, 0.999);
#else
    vec2 pUV = vMapUv;
#endif

#ifdef USE_MAP
    vec4 sampledDiffuseColor = texture2D( map, vMapUv );
    #ifdef DECODE_VIDEO_TEXTURE
        sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif
    diffuseColor *= sampledDiffuseColor;
#endif
`),o=o.replace(P0,`
#ifdef USE_NORMALMAP_OBJECTSPACE

    normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
    #ifdef FLIP_SIDED
        normal = - normal;
    #endif
    #ifdef DOUBLE_SIDED
        normal = normal * faceDirection;
    #endif
    normal = normalize( normalMatrix * normal );

#elif defined( USE_NORMALMAP_TANGENTSPACE )

    #ifdef PAINTING_USE_PARALLAX
        vec2 _normalUV = pUV;
    #else
        vec2 _normalUV = vNormalMapUv;
    #endif

    vec3 mapN = texture2D( normalMap, _normalUV ).xyz * 2.0 - 1.0;

    #ifdef PAINTING_USE_DETAIL_NORMAL
        vec3 detailN = texture2D( tDetailNormal, _normalUV * uDetailTiling ).xyz * 2.0 - 1.0;
        mapN.xy += detailN.xy * uDetailNormalStrength;
        mapN = normalize( mapN );
    #endif

    mapN.xy *= normalScale;
    normal = normalize( tbn * mapN );

#elif defined( USE_BUMPMAP )

    normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif

#ifdef PAINTING_USE_BUMP
    vec2 paintDH = dHdxy_fwd() * uBumpStrength;
    normal = perturbNormalArb( - vViewPosition, normal, paintDH, faceDirection );
#endif
`);const u=`
${pd}

#ifdef PAINTING_USE_SELFSHADOW
    {
        // uKeyLightDir is supplied per-frame in view space, pointing FROM
        // surface TOWARDS the light source.
        vec3 _tsLight = normalize(vec3(
            dot(uKeyLightDir, vTangent.xyz),
            dot(uKeyLightDir, vBitangent),
            dot(uKeyLightDir, vNormal)
        ));
        // Smoothly fade the whole effect out below the horizon so changing
        // light angles do not produce a hard cutoff edge.
        float _grazeMask = smoothstep(0.05, 0.20, _tsLight.z);
        if (_grazeMask > 0.0) {
            float _shStep = 1.0 / max(uShadowSteps, 1.0);
            #ifdef PAINTING_USE_PARALLAX
                vec2 _shUV = pUV;
            #else
                vec2 _shUV = vMapUv;
            #endif
            float _curH = texture2D(bumpMap, _shUV).r;
            // March towards the light projection in UV space. Scale chosen
            // so 8 steps cover roughly the same UV distance as parallax.
            vec2 _shDelta = (_tsLight.xy / max(abs(_tsLight.z), 0.2)) * (uParallaxScale * _shStep);

            // v0.05: smooth weighted accumulation. Each step contributes
            // smoothstep(excess) instead of a binary break, weighted by an
            // inverse-distance fall-off so far steps cannot dominate. The
            // result is clamped to uShadowMaxOcclusion, preventing broad
            // height plateaus from forming solid dark patches ("stains").
            float _occlusion = 0.0;
            float _totalWeight = 0.0;
            for (int _j = 0; _j < 16; _j++) {
                if (float(_j) >= uShadowSteps) break;
                vec2 _stepUV = clamp(_shUV + _shDelta * float(_j + 1), 0.001, 0.999);
                float _sampleH = texture2D(bumpMap, _stepUV).r;
                float _wantedH = _curH + (_tsLight.z * _shStep * float(_j + 1));
                float _excess = _sampleH - _wantedH - uShadowBias;
                float _softBlocker = smoothstep(0.0, max(uShadowSoftness, 0.001), _excess);
                float _distW = 1.0 / (float(_j) + 1.0);
                _occlusion   += _softBlocker * _distW;
                _totalWeight += _distW;
            }
            _occlusion = (_totalWeight > 0.0) ? (_occlusion / _totalWeight) : 0.0;
            _occlusion = clamp(_occlusion, 0.0, uShadowMaxOcclusion);

            #ifdef PAINTING_USE_SHADOW_FILTER
                {
                    // v0.06: two companion rays perpendicular to the primary
                    // march direction. Averaging three rays removes lateral
                    // texel-step hard edges under raking light without raising
                    // the overall darkening envelope (each ray is clamped to
                    // uShadowMaxOcclusion before averaging).
                    float _dLen = length(_shDelta);
                    vec2 _latDir = (_dLen > 0.0001)
                        ? vec2(-_shDelta.y, _shDelta.x) * (uShadowFilterRadius / _dLen)
                        : vec2(uShadowFilterRadius, 0.0);
                    float _oL = 0.0, _oR = 0.0, _wTot = 0.0;
                    for (int _k = 0; _k < 16; _k++) {
                        if (float(_k) >= uShadowSteps) break;
                        float _fi  = float(_k + 1);
                        float _wk  = 1.0 / _fi;
                        float _wH  = _curH + _tsLight.z * _shStep * _fi;
                        vec2  _bo  = _shDelta * _fi;
                        float _exL = texture2D(bumpMap, clamp(_shUV + _bo - _latDir, 0.001, 0.999)).r
                                     - _wH - uShadowBias;
                        float _exR = texture2D(bumpMap, clamp(_shUV + _bo + _latDir, 0.001, 0.999)).r
                                     - _wH - uShadowBias;
                        _oL   += smoothstep(0.0, max(uShadowSoftness, 0.001), _exL) * _wk;
                        _oR   += smoothstep(0.0, max(uShadowSoftness, 0.001), _exR) * _wk;
                        _wTot += _wk;
                    }
                    float _lOcc = clamp((_wTot > 0.0) ? _oL / _wTot : 0.0, 0.0, uShadowMaxOcclusion);
                    float _rOcc = clamp((_wTot > 0.0) ? _oR / _wTot : 0.0, 0.0, uShadowMaxOcclusion);
                    _occlusion = (_occlusion + _lOcc + _rOcc) / 3.0;
                }
            #endif

            float _shadow = 1.0 - uShadowStrength * _occlusion * uShadowProfileScale * _grazeMask;
            #ifdef PAINTING_DEBUG_SHADOW
                // Stash the greyscale mask in indirectDiffuse so the debug
                // override below can pick it up unambiguously.
                reflectedLight.indirectDiffuse = vec3(_shadow);
            #endif
            reflectedLight.directDiffuse  *= _shadow;
            reflectedLight.directSpecular *= _shadow;
        } else {
            #ifdef PAINTING_DEBUG_SHADOW
                reflectedLight.indirectDiffuse = vec3(1.0);
            #endif
        }
    }
#endif

#ifdef PAINTING_USE_GRAZING_BOOST
    {
        float NdotV = abs( dot( normal, normalize( vViewPosition ) ) );
        float grazingMask = pow( 1.0 - NdotV, 3.0 );
        reflectedLight.directSpecular *= ( 1.0 + grazingMask * uLightGrazingBoost );
    }
#endif

#ifdef PAINTING_DEBUG_ALBEDO_ONLY
    // Strip all shading so reviewers can verify the shader is not
    // re-interpreting the picture. Uses indirectDiffuse so tone mapping and
    // colour-space conversion still run normally (the post-pipeline expects
    // a linear value here).
    reflectedLight.directDiffuse  = vec3(0.0);
    reflectedLight.directSpecular = vec3(0.0);
    reflectedLight.indirectDiffuse  = diffuseColor.rgb;
    reflectedLight.indirectSpecular = vec3(0.0);
#endif

#ifdef PAINTING_DEBUG_SHADOW
    // v0.05: greyscale self-shadow visualisation. White = unshadowed, black =
    // maximum attenuation. The shadow value was stashed into indirectDiffuse
    // by the self-shadow block above. When the self-shadow block is compiled
    // out, this falls back to fully white (no shadow).
    #ifndef PAINTING_USE_SELFSHADOW
        reflectedLight.indirectDiffuse = vec3(1.0);
    #endif
    reflectedLight.directDiffuse   = vec3(0.0);
    reflectedLight.directSpecular  = vec3(0.0);
    reflectedLight.indirectSpecular = vec3(0.0);
#endif
`;o=o.replace(pd,u),s.fragmentShader=a.join(`
`)+`
`+o}}detailNormalActive(){return this.hasDetailNormal&&this.paintingUniforms.uDetailNormalStrength.value>0}parallaxActive(){return this.parallaxEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uParallaxScale.value>0}selfShadowActive(){return this.selfShadowEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uShadowStrength.value>0}applyPreset(t){this.normalScale.set(t.normalStrength,t.normalStrength),this.emissiveIntensity=t.albedoFidelityFill,this.applyPresentationSettings(t),(!t.clearcoatEnabled||bn[this.activePresentation].clearcoatStrength<=0)&&(this.clearcoat=0,this.clearcoatMap&&(this.clearcoatMap=null,this.needsUpdate=!0)),this.paintingUniforms.uDetailNormalStrength.value=t.detailNormalStrength,this.paintingUniforms.uBumpStrength.value=t.bumpStrength,this.paintingUniforms.uParallaxScale.value=t.parallaxEnabled?t.parallaxScale:0,this.paintingUniforms.uParallaxSteps.value=t.parallaxSteps,this.paintingUniforms.uShadowSteps.value=t.selfShadowSteps,this.paintingUniforms.uShadowStrength.value=t.selfShadowStrength,this.paintingUniforms.uShadowBias.value=t.selfShadowBias,this.paintingUniforms.uShadowSoftness.value=t.selfShadowSoftness,this.paintingUniforms.uShadowMaxOcclusion.value=t.selfShadowMaxOcclusion,this.paintingUniforms.uShadowFilterRadius.value=t.selfShadowFilterRadius,(!t.detailNormalEnabled||t.detailNormalStrength<=0)&&(this.paintingUniforms.tDetailNormal.value=null),t.shaderVariant==="painting-battery"&&(this.roughnessMap=null),t.specularStrength<=0&&(this.specularIntensityMap=null);const n=t.aoEnabled&&!!this.aoMap,r=t.detailNormalEnabled&&t.detailNormalStrength>0&&!!this.paintingUniforms.tDetailNormal.value,s=t.bumpStrength>0&&!!this.bumpMap,a=t.grazingBoostEnabled,o=t.parallaxEnabled&&!!this.bumpMap&&t.parallaxScale>0,l=t.selfShadowEnabled&&!!this.bumpMap&&t.selfShadowStrength>0,c=n!==this.hasAO||r!==this.detailNormalActive()||s!==this.hasBump||a!==this.grazingEnabled||o!==this.parallaxEnabledFlag||l!==this.selfShadowEnabledFlag||t.shaderVariant!==this.currentVariant;this.hasAO=n,this.hasDetailNormal=r,this.hasBump=s,this.grazingEnabled=a,this.parallaxEnabledFlag=o,this.selfShadowEnabledFlag=l,this.currentVariant=t.shaderVariant,n||(this.aoMap=null),!s&&!o&&!l&&(this.bumpMap=null),c&&(this.needsUpdate=!0)}applyTextures(t,n,r){var d,u,h,f,g,v,m;this.map=t.albedo,this.emissiveMap=t.albedo,this.emissiveIntensity=r.albedoFidelityFill,this.normalMap=(d=t.normal)!=null?d:null;const s=bn[this.activePresentation];this.roughnessMap=r.shaderVariant==="painting-battery"?null:(u=t.roughness)!=null?u:null,this.roughness=s.baseRoughness;const a=r.specularStrength*s.specularScale;this.specularIntensityMap=a>0&&(h=t.specular)!=null?h:null,this.specularIntensity=a>0?a:this.getPresentationBaseSpecularIntensity(s),this.paintingUniforms.tDetailNormal.value=r.detailNormalEnabled&&r.detailNormalStrength>0&&(f=t.detailNormal)!=null?f:null,this.paintingUniforms.uDetailTiling.value.copy(n);const o=r.bumpStrength>0||r.parallaxEnabled&&r.parallaxScale>0||r.selfShadowEnabled;this.bumpMap=o&&(g=t.height)!=null?g:null,this.bumpScale=1,this.aoMap=(v=t.ao)!=null?v:null,this.aoMapIntensity=1;const l=r.clearcoatEnabled&&s.clearcoatStrength>0&&(m=t.varnish)!=null?m:null,c=l!==this.clearcoatMap;this.clearcoatMap=l,this.clearcoat=r.clearcoatEnabled?s.clearcoatStrength:0,this.clearcoatRoughness=s.clearcoatStrength>0?s.clearcoatRoughness:r.clearcoatRoughnessValue,c&&(this.needsUpdate=!0),this.applyPreset(r)}setReducedMotion(t){this.reducedMotion!==t&&(this.reducedMotion=t,this.paintingUniforms.uReducedMotionScalar.value=1)}applyPresentation(t,n){this.activePresentation=t,this.applyPresentationSettings(n)}setKeyLightDirView(t){this.paintingUniforms.uKeyLightDir.value.copy(t)}setAlbedoOnly(t){this.albedoOnlyEnabled!==t&&(this.albedoOnlyEnabled=t,this.paintingUniforms.uAlbedoOnly.value=t?1:0,this.needsUpdate=!0)}setShadowProfileScale(t){this.paintingUniforms.uShadowProfileScale.value=Math.max(0,Math.min(2,t))}setShadowDebug(t){this.shadowDebugEnabled!==t&&(this.shadowDebugEnabled=t,this.needsUpdate=!0)}setShadowFilterRadius(t,n){this.paintingUniforms.uShadowFilterRadius.value=Math.max(0,t),n!==this.shadowFilterEnabled&&(this.shadowFilterEnabled=n,this.needsUpdate=!0)}get shaderVariant(){return this.currentVariant}activeMaps(){const t=["albedo"];return this.normalMap&&t.push("normal"),this.hasDetailNormal&&t.push("detailNormal"),this.bumpMap&&t.push("height"),this.roughnessMap&&t.push("roughness"),this.specularIntensityMap&&t.push("specular"),this.aoMap&&t.push("ao"),(this.clearcoatMap||this.clearcoat>0)&&t.push("varnish"),this.emissiveMap&&this.emissiveIntensity>0&&t.push("albedoFill"),t}applyPresentationSettings(t){const n=bn[this.activePresentation];this.roughness=n.baseRoughness,this.clearcoatRoughness=n.clearcoatStrength>0?n.clearcoatRoughness:t.clearcoatRoughnessValue;const r=t.specularStrength*n.specularScale;this.specularIntensity=r>0?r:this.getPresentationBaseSpecularIntensity(n),n.clearcoatStrength<=0?this.clearcoat=0:t.clearcoatEnabled?this.clearcoat=n.clearcoatStrength:this.clearcoat=0}getPresentationBaseSpecularIntensity(t){return t.clearcoatStrength>0?.06:t.specularScale>0?.04:.015}}function L0(i){const e=i.image;let t=1,n=1;return"naturalWidth"in e?(t=e.naturalWidth||e.width||1,n=e.naturalHeight||e.height||1):(t=e.width||1,n=e.height||1),{width:t,height:n,aspect:t/n}}function U0(i,e,t){const n=Number.isFinite(i)&&i>0?i:1,r=e/t;return n>=r?{width:e,height:e/n}:{width:t*n,height:t}}class k0{constructor(e,t){x(this,"group");x(this,"artworkMesh");x(this,"artworkBodyMesh");x(this,"artworkBodyMaterial");x(this,"material");x(this,"_artworkAspect",1);x(this,"_artworkWidth",4);x(this,"_artworkHeight",5.7);x(this,"currentSegments");x(this,"scene");x(this,"detailTilesPerWorldUnit",2);x(this,"_lastAspectSource","texture");x(this,"_lastManifestDimensions",null);x(this,"activePresentation",lr);x(this,"activeBodyDepth",Yr.artworkBodyDepth);this.scene=e,this.group=new Zn,this.currentSegments=t.artworkSegments;const n=this.makeArtworkGeometry(this.currentSegments);this.material=new I0(t),this.artworkMesh=new He(n,this.material),this.artworkMesh.castShadow=!1,this.artworkMesh.receiveShadow=!1,this.artworkMesh.renderOrder=3,this.artworkBodyMaterial=new hn({color:new Le(bn[this.activePresentation].backerColor),roughness:.9,metalness:0}),this.artworkBodyMesh=new He(new Ut(1,1,1),this.artworkBodyMaterial),this.artworkBodyMesh.castShadow=!0,this.artworkBodyMesh.receiveShadow=!1,this.artworkBodyMesh.renderOrder=2,this.group.add(this.artworkBodyMesh,this.artworkMesh),this.updateMountedBody(),e.add(this.group)}getArtworkMeshObject(){return this.artworkMesh}makeArtworkGeometry(e){const t=new Yt(4,5.7,e,e),n=t.getAttribute("uv");return n&&!t.getAttribute("uv1")&&t.setAttribute("uv1",n.clone()),t.computeTangents(),t}applyPreset(e){if(this.material.applyPreset(e),e.artworkSegments===this.currentSegments)return;this.currentSegments=e.artworkSegments;const t=this.artworkMesh.geometry,n=this.makeArtworkGeometry(this.currentSegments);this.artworkMesh.geometry=n,t.dispose(),this.artworkMesh.scale.set(this._artworkWidth/4,this._artworkHeight/5.7,1),this.updateMountedBody()}applyPresentation(e,t){const n=bn[e];this.activePresentation=e,this.activeBodyDepth=n.bodyDepth,this.artworkBodyMaterial.color.set(n.backerColor),this.material.applyPresentation(e,t),this.updateMountedBody()}updateAspect(e,t){let n,r;t&&Number.isFinite(t.width)&&t.width>0&&Number.isFinite(t.height)&&t.height>0?(n=t.width/t.height,r="manifest"):(n=L0(e).aspect,r="texture"),this._artworkAspect=n;const{width:s,height:a}=U0(n,4.2,5.8);this._artworkWidth=s,this._artworkHeight=a,this.artworkMesh.scale.set(s/4,a/5.7,1),this._lastAspectSource=r,this._lastManifestDimensions=t!=null?t:null}setPaintingTextures(e,t,n,r=lr){this.applyPresentation(r,t),this.updateAspect(e.albedo,n);const s=new me(this._artworkWidth*this.detailTilesPerWorldUnit,this._artworkHeight*this.detailTilesPerWorldUnit);this.material.applyTextures(e,s,t),this.updateMountedBody()}setTexture(e,t){this.setPaintingTextures({albedo:e},t)}get artworkAspect(){return this._artworkAspect}get artworkWidth(){return this._artworkWidth}get artworkHeight(){return this._artworkHeight}get bodyBackExtent(){return this.activeBodyDepth+Yr.artworkBodyFrontClearance}get lastAspectSource(){return this._lastAspectSource}get lastManifestDimensions(){return this._lastManifestDimensions}dispose(){this.scene.remove(this.group),this.artworkMesh.geometry.dispose(),this.material.dispose(),this.artworkBodyMesh.geometry.dispose(),this.artworkBodyMaterial.dispose()}updateMountedBody(){const e=this._artworkWidth,t=this._artworkHeight;this.artworkBodyMesh.scale.set(e,t,this.activeBodyDepth),this.artworkBodyMesh.position.set(0,0,-(this.activeBodyDepth*.5+Yr.artworkBodyFrontClearance))}}class D0{constructor(){x(this,"cache",new Map);x(this,"currentAnisotropy",1)}generate(e,t,n){const r=Math.max(64,n!=null?n:256),s=`${e}::${t}::${r}`,a=this.cache.get(s);if(a)return a;const o=this.hash(e),l=Math.max(64,Math.floor(r/2));let c;switch(t){case"normal":c=this.generateNormal(o,r,14,6,3,.42);break;case"detailNormal":c=this.generateNormal(o*7+13,r,18,7,2.5,1.1),c.wrapS=1e3,c.wrapT=1e3;break;case"height":c=this.generateHeight(o,r);break;case"roughness":c=this.generateRoughness(o,l);break;case"specular":c=this.generateSpecular(o,l);break;case"ao":c=this.generateAO(o,r);break;case"varnish":c=this.generateVarnish(o,l);break;case"albedo":default:c=this.generateAlbedo(o);break}return this.cache.set(s,c),c.anisotropy=this.currentAnisotropy,c}disposeAll(){this.cache.forEach(e=>e.dispose()),this.cache.clear()}setAnisotropy(e){const t=Math.max(1,e|0);t!==this.currentAnisotropy&&(this.currentAnisotropy=t,this.cache.forEach(n=>{n.anisotropy=t,n.needsUpdate=!0}))}generateNormal(e,t,n,r,s,a){const o=new Uint8Array(t*t*4),l=.055*a,c=.14*a;for(let d=0;d<t;d+=1)for(let u=0;u<t;u+=1){const h=(d*t+u)*4,f=this.valueNoise2d(u*l,d*l,e),g=this.valueNoise2d((u+1)*l,d*l,e),v=this.valueNoise2d(u*l,(d+1)*l,e),m=this.valueNoise2d(u*c,d*c,e+17),p=this.valueNoise2d((u+1)*c,d*c,e+17),b=this.valueNoise2d(u*c,(d+1)*c,e+17),y=(g-f)*n+(p-m)*r,_=(v-f)*n+(b-m)*r;o[h+0]=this.clamp8(128+y*28),o[h+1]=this.clamp8(128+_*28),o[h+2]=255,o[h+3]=255}return this.makeDataTexture(o,t,t,!1)}generateHeight(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.04,r*.04,e)*90,l=this.valueNoise2d(s*.12,r*.09,e+7)*40,c=this.valueNoise2d(s*.55,r*.55,e+31)*3,d=this.clamp8(o+l+c);n[a+0]=d,n[a+1]=d,n[a+2]=d,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateRoughness(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.07,r*.07,e+3),l=this.valueNoise2d(s*.24,r*.24,e+19),c=o*.65+l*.35,d=this.clamp8(140+c*100);n[a+0]=d,n[a+1]=d,n[a+2]=d,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateSpecular(e,t){const n=new Uint8Array(t*t*4);for(let s=0;s<t*t;s+=1)n[s*4+0]=6,n[s*4+1]=6,n[s*4+2]=6,n[s*4+3]=255;const r=4+e%4;for(let s=0;s<r;s+=1){const a=e*(s+7)%t,o=e*(s+13)*3%t,l=14+e*(s+1)%18;for(let c=0;c<t;c+=1)for(let d=0;d<t;d+=1){const u=d-a,h=c-o,f=u*u+h*h,g=Math.exp(-f/(l*l))*50,v=(c*t+d)*4,m=this.clamp8(n[v]+g);n[v+0]=m,n[v+1]=m,n[v+2]=m}}return this.makeDataTexture(n,t,t,!1)}generateAO(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.11,r*.11,e)*18,l=this.clamp8(237+o);n[a+0]=l,n[a+1]=l,n[a+2]=l,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateVarnish(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.035,r*.035,e+101),l=this.valueNoise2d(s*.18,r*.18,e+149),c=this.clamp8((o*.75+l*.25)*85);n[a+0]=c,n[a+1]=c,n[a+2]=c,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateAlbedo(e){const n=new Uint8Array(16384),r=e%32,s=200+r*3%30,a=200+r*5%30,o=200+r*7%30;for(let l=0;l<64*64;l+=1)n[l*4+0]=s,n[l*4+1]=a,n[l*4+2]=o,n[l*4+3]=255;return this.makeDataTexture(n,64,64,!0)}makeDataTexture(e,t,n,r){const s=new ho(e,t,n,1023,1009);return s.colorSpace=r?Nt:nn,s.wrapS=1e3,s.wrapT=1e3,s.minFilter=1008,s.magFilter=1006,s.generateMipmaps=!0,s.needsUpdate=!0,s}clamp8(e){return e<0?0:e>255?255:e|0}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t||1}valueNoise2d(e,t,n){const r=Math.floor(e)|0,s=Math.floor(t)|0,a=e-Math.floor(e),o=t-Math.floor(t),l=a*a*(3-2*a),c=o*o*(3-2*o),d=this.latticeHash(r,s,n),u=this.latticeHash(r+1,s,n),h=this.latticeHash(r,s+1,n),f=this.latticeHash(r+1,s+1,n);return d*(1-l)*(1-c)+u*l*(1-c)+h*(1-l)*c+f*l*c}latticeHash(e,t,n){let r=n*1664525+e*1013904223>>>0;return r=(r^t*1540483477)>>>0,r=(r^r>>>16)>>>0,r=Math.imul(r,73244475)>>>0,r=(r^r>>>16)>>>0,(r>>>0)/4294967295}}function It(i,e,t){return Math.max(e,Math.min(t,i))}function qt(i,e,t,n){return n<=0?i:i+(e-i)*(1-Math.exp(-t*n))}const md=[-1,1],gd=.45,vd=.24;function N0(i){return{x:Math.max(0,(i.artworkWidth-i.visibleWidth)*.5+i.overscrollX),y:Math.max(0,(i.artworkHeight-i.visibleHeight)*.5+i.overscrollY)}}function Co(i,e,t,n,r){const s=Math.max(0,t)*.5,a=Math.max(0,n)*.5,o=Math.max(0,r),l=Math.sin(i),c=Math.cos(i),d=Math.sin(e),u=Math.cos(e);let h=0;const f=(g,v,m)=>{const p=-g*d+(v*l+m*c)*u;h=Math.max(h,-p)};for(const g of md)for(const v of md){const m=g*s,p=v*a;f(m,p,0),f(m,p,-o)}return h}function F0(i){const e=Math.max(0,Math.abs(i.wallZ)-Math.max(0,i.clearanceMargin)),t=Number.isFinite(i.targetRotX)?i.targetRotX:0,n=Number.isFinite(i.targetRotY)?i.targetRotY:0;if(e<=0||t===0&&n===0)return{targetRotX:0,targetRotY:0,appliedScale:0,maxBackShift:0,availableClearance:e};const r=Co(t,n,i.artworkWidth,i.artworkHeight,i.bodyBackDepth);if(r<=e)return{targetRotX:t,targetRotY:n,appliedScale:1,maxBackShift:r,availableClearance:e};let s=0,a=1;for(let d=0;d<18;d+=1){const u=(s+a)*.5;Co(t*u,n*u,i.artworkWidth,i.artworkHeight,i.bodyBackDepth)<=e?s=u:a=u}const o=It(s,0,1),l=t*o,c=n*o;return{targetRotX:l,targetRotY:c,appliedScale:o,maxBackShift:Co(l,c,i.artworkWidth,i.artworkHeight,i.bodyBackDepth),availableClearance:e}}const qr=7,O0=18,B0=3.5,Ys=.2,Po=.12,yd=1.04,z0=.65,xd=1.5,qs=.35,H0=.25,G0=.004,_d=12,Zr=3.5,Io=3,bd=4,Zs=5,js=4.5,Ks=-.6,Sd=.15,cr=.88,V0=.1,Qs=Number.MAX_SAFE_INTEGER,jr=["normal","detailNormal","height","roughness","specular","ao","varnish"],Lo=2,W0=2500,X0=250,Js={"critical-now":0,"near-next":1,background:2},$0=["normal","detailNormal","height"];class Y0{constructor(e,t,n,r,s,a){x(this,"diagnostics",Jt("gallery"));x(this,"artworks");x(this,"currentIndex",0);x(this,"artworkMesh");x(this,"textureManager");x(this,"procedural");x(this,"camera");x(this,"_fovTanCache",NaN);x(this,"_fovTanForFov",NaN);x(this,"viewportMetricsProvider");x(this,"reducedMotion",!1);x(this,"currentPreset",null);x(this,"artworkLoadToken",0);x(this,"inspectionMode",!1);x(this,"pendingResetAfterArtworkLoad",!1);x(this,"lastResetFitZoom",qr);x(this,"frameBudgetNavigationMarker",null);x(this,"interactionActive",!1);x(this,"interactionActiveSince",0);x(this,"interactionFrameCount",0);x(this,"interactionFrameTotalMs",0);x(this,"interactionFrameDropped",0);x(this,"prefetchedTextureSets",new Set);x(this,"fullPrefetchScheduled",!1);x(this,"readiness");x(this,"prefetchQueue",[]);x(this,"activePrefetches",new Set);x(this,"prefetchQueueRunning",!1);x(this,"prefetchSequence",0);x(this,"readinessRadius",Lo);x(this,"startupReadinessMode","full");x(this,"startupEntryTargetCount",Number.MAX_SAFE_INTEGER);x(this,"pendingNavigationProbe",null);x(this,"proceduralQueue",new Set);x(this,"proceduralQueueRunning",!1);x(this,"renderDirtyFrames",8);x(this,"disposed",!1);x(this,"targetX",0);x(this,"targetY",0);x(this,"zoom",qr);x(this,"targetZoom",qr);x(this,"panX",0);x(this,"panY",0);x(this,"targetPanX",0);x(this,"targetPanY",0);x(this,"lastUpdateTime",0);x(this,"onNavigateCallback",null);this.artworks=e,this.artworkMesh=t,this.textureManager=n,this.camera=r,this.procedural=s!=null?s:new D0,this.viewportMetricsProvider=a!=null?a:null,this.readiness=e.map((o,l)=>({index:l,artworkId:o.id,albedoLoaded:!1,pbrLoaded:!o.textureSet,proceduralReady:!1,materialApplied:!1,shaderCompiled:!1,gpuWarmed:!1,pbrMs:0,proceduralMs:0,lastWarmMs:0,lastReason:"init",updatedAt:0}))}setFrameBudgetMarker(e){this.frameBudgetNavigationMarker=e}setInteractionActive(e){if(e!==this.interactionActive)if(e)this.interactionActive=!0,this.interactionActiveSince=this.now(),this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.markRenderDirty(4),this.diagnostics.debug("interaction-start","Pointer interaction window opened; non-critical prefetch paused");else{const t=this.now()-this.interactionActiveSince;this.diagnostics.info("interaction-end","Pointer interaction window ended; resuming background work",{durationMs:Math.round(t),frameCount:this.interactionFrameCount,avgFrameMs:this.interactionFrameCount>0?Math.round(this.interactionFrameTotalMs/this.interactionFrameCount*10)/10:0,droppedFrames:this.interactionFrameDropped,droppedFramePct:this.interactionFrameCount>0?Math.round(this.interactionFrameDropped/this.interactionFrameCount*100):0}),this.interactionActive=!1,this.markRenderDirty(2),this.interactionActiveSince=0,this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.prefetchQueue.length>0&&!this.prefetchQueueRunning&&this.drainPrefetchQueue()}}markInteractionFrame(e){this.interactionActive&&(this.interactionFrameCount+=1,this.interactionFrameTotalMs+=e,e>33&&(this.interactionFrameDropped+=1))}markRenderDirty(e=4){this.renderDirtyFrames=Math.max(this.renderDirtyFrames,Math.max(1,Math.round(e)))}configureReadinessProfile(e){this.readinessRadius=It(Math.round(e.criticalRadius),1,3),this.diagnostics.info("readiness-profile","Applied readiness profile",{criticalRadius:this.readinessRadius,artworkCount:this.artworks.length})}configureStartupReadiness(e){this.startupReadinessMode=e.mode,this.startupEntryTargetCount=e.mode==="full"?this.artworks.length:Math.max(1,Math.min(this.artworks.length,Math.round(e.entryTargetCount))),this.diagnostics.info("startup-readiness","Applied startup readiness contract",{mode:this.startupReadinessMode,entryTargetCount:this.startupEntryTargetCount,artworkCount:this.artworks.length,criticalRadius:this.readinessRadius})}getStartupEntryTargets(e=0){const t=this.getBudgetedWarmOrder(e);return this.startupReadinessMode==="full"?t:t.slice(0,this.startupEntryTargetCount)}get isStagedStartup(){return this.startupReadinessMode!=="full"&&this.startupEntryTargetCount<this.artworks.length}applyPreset(e){const t=this.currentPreset!==null;this.currentPreset=e,this.textureManager.setAnisotropyDivisor(e.anisotropyDivisor),this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy()),this.diagnostics.debug("preset-applied","Applied gallery quality preset",{shaderVariant:e.shaderVariant,anisotropy:this.textureManager.getEffectiveAnisotropy(),proceduralTileSize:e.proceduralTileSize,proceduralInspectionTileSize:e.proceduralInspectionTileSize,specularStrength:e.specularStrength,selfShadowBias:e.selfShadowBias}),this.markRenderDirty(4),t&&this.textureManager.get(this.artworks[this.currentIndex].image)&&this.showArtwork(this.currentIndex)}setInspectionMode(e){e!==this.inspectionMode&&(this.inspectionMode=e,this.markRenderDirty(4),this.diagnostics.info("inspection-mode",`Inspection mode ${e?"enabled":"disabled"}`),this.currentPreset&&this.showArtwork(this.currentIndex))}async init(){const e=this.artworks.map(o=>{var c,d,u,h,f,g,v,m;const l=pi(o);return{id:o.id,bundleId:(d=(c=l.primary)==null?void 0:c.bundleId)!=null?d:null,declaredImageUrlType:(h=(u=l.primary)==null?void 0:u.declaredUrlType)!=null?h:null,resolvedImageUrlType:(g=(f=l.primary)==null?void 0:f.resolvedUrlType)!=null?g:null,hasEmbeddedFallback:!!l.fallback,embeddedFallbackUrlType:(m=(v=l.fallback)==null?void 0:v.resolvedUrlType)!=null?m:null,dimensions:o.dimensions}});this.diagnostics.info("init","Starting gallery init — preloading albedo textures",{artworkCount:e.length,artworks:e}),await this.textureManager.preloadArtworkAlbedos(this.artworks),this.readiness.forEach(o=>this.markReadiness(o.index,"albedoLoaded","init-preload"));const t=this.artworks.filter(o=>!!o.textureSet).length,n=new Set(this.getStartupEntryTargets(0)),r=({artwork:o,index:l})=>!!o.textureSet&&l<Qs&&n.has(l),s=this.artworks.map((o,l)=>({artwork:o,index:l})).filter(r);this.diagnostics.info("init","Preloading entry-target PBR texture sets under loading overlay (v0.68 staged-readiness contract)",{mode:this.startupReadinessMode,pbrCount:s.length,textureSetCount:t,totalArtworks:this.artworks.length,entryTargetCount:n.size,safetyCap:Qs,cappedArtworks:Math.max(0,this.artworks.length-Qs)}),await Promise.allSettled(s.map(({artwork:o,index:l})=>this.preloadAuthoredTextureSet(l,"init-pbr-preload").then(()=>{this.prefetchedTextureSets.add(l),this.diagnostics.debug("preload-all","PBR texture set preloaded during init",{index:l,artworkId:o.id})})));const a=this.artworks.map((o,l)=>({artwork:o,index:l})).filter(({artwork:o,index:l})=>!!o.textureSet&&!this.prefetchedTextureSets.has(l));if(a.length>0){this.diagnostics.info("init","Queuing deferred artworks for deterministic near-next prefetch (v0.68 staged-readiness)",{mode:this.startupReadinessMode,deferredCount:a.length,entryTargetCount:n.size,safetyCap:Qs});for(const{index:o}of a)this.scheduleTextureSetPrefetch(o,"init-staged-deferred-near-next","near-next")}this.preGenerateProceduralWindow(0,this.readinessRadius,"init-critical-window"),this.logGalleryScaleValidation(),this.diagnostics.info("init","Preload complete — showing first artwork",{artworkCount:this.artworks.length,pbrPreloaded:s.length,criticalProceduralReady:this.getCriticalWindowIndices(0,this.readinessRadius).length}),this.pendingResetAfterArtworkLoad=!0,await this.showArtwork(0),this.scheduleFullTextureSetPrefetch()}addZoomDelta(e){const t=this.getViewportMetrics(),n=this.getZoomBounds(t);this.targetZoom=this.clampZoom(this.targetZoom+e,n),this.clampPanTargets(t,n),this.markRenderDirty(4)}setPanOffset(e,t){const n=this.getViewportMetrics(),r=this.getZoomBounds(n),{x:s,y:a}=this.getPanLimits(this.targetZoom,n,r);this.targetPanX=It(this.targetPanX+e,-s,s),this.targetPanY=It(this.targetPanY+t,-a,a),this.markRenderDirty(4)}canPan(){const{x:e,y:t}=this.getPanLimits(this.targetZoom);return e>.01||t>.01}getHoverRotationScale(){const e=this.getZoomBounds(),t=Math.max(.001,e.maxOverviewZoom-e.minInspectionZoom),n=(this.clampZoom(this.targetZoom,e)-e.minInspectionZoom)/t;return{x:.03+n*.13,y:.018+n*.062}}async showArtwork(e){var T,U,w,S,P,G,N,F,W,V,J,X,oe,he,Me,ee,Ve,K,de,we,xe,Be,Ne,We,Je,k,ct,Xe;const t=this.artworks[e],n=this.resolvePresentation(e),r=bn[n],s=pi(t),a=this.textureManager.getArtworkAlbedoSelection(t),o=(w=(U=a==null?void 0:a.selectedUrl)!=null?U:(T=s.primary)==null?void 0:T.resolvedUrl)!=null?w:t.image,l=this.textureManager.get(o),c=++this.artworkLoadToken,d=this.currentPreset,u=((S=this.pendingNavigationProbe)==null?void 0:S.toIndex)===e?this.pendingNavigationProbe:null;if(u&&!u.readinessBefore){const Ue=this.readiness[e];Ue&&(u.readinessBefore={pbrLoaded:Ue.pbrLoaded,proceduralReady:Ue.proceduralReady,gpuWarmed:Ue.gpuWarmed})}if(this.diagnostics.debugLazy("show-artwork","Preparing artwork render state",()=>{var Ue,Re,dt,Fe,ze,I,M,$,re,le;return{index:e,artworkId:t.id,token:c,bundleId:(dt=(Re=a==null?void 0:a.bundleId)!=null?Re:(Ue=s.primary)==null?void 0:Ue.bundleId)!=null?dt:null,hasEmbeddedFallback:!!t.webglImage,albedoSourceMode:(Fe=a==null?void 0:a.sourceMode)!=null?Fe:"declared-image",albedoDeclaredUrlType:(I=(ze=s.primary)==null?void 0:ze.declaredUrlType)!=null?I:"local-relative",albedoResolvedUrlType:(M=a==null?void 0:a.selectedUrlType)!=null?M:"local-relative",usedEmbeddedFallback:($=a==null?void 0:a.usedEmbeddedFallback)!=null?$:!1,generatedFallback:(re=a==null?void 0:a.generatedFallback)!=null?re:!1,dimensions:t.dimensions,surface:(le=t.surface)!=null?le:null,presentation:n}}),!l||!d){this.diagnostics.warn("show-artwork-missing-state","Cannot render artwork because preset or albedo texture is missing",{artworkId:t.id,hasAlbedo:!!l,hasPreset:!!d,bundleId:(N=(G=a==null?void 0:a.bundleId)!=null?G:(P=s.primary)==null?void 0:P.bundleId)!=null?N:null,albedoSourceMode:(F=a==null?void 0:a.sourceMode)!=null?F:"declared-image",albedoDeclaredUrlType:(V=(W=s.primary)==null?void 0:W.declaredUrlType)!=null?V:"local-relative",albedoResolvedUrlType:(J=a==null?void 0:a.selectedUrlType)!=null?J:"local-relative"});return}const h=await this.preloadAuthoredTextureSet(e,"show-artwork");if(t.textureSet&&this.prefetchedTextureSets.add(e),c!==this.artworkLoadToken){this.diagnostics.debugLazy("stale-load","Discarded stale artwork load",()=>({artworkId:t.id,token:c,latestToken:this.artworkLoadToken}));return}const f={albedo:(X=h.albedo)!=null?X:l},g=this.now();let v=!1;for(const Ue of jr)h[Ue]?f[Ue]=h[Ue]:this.shouldFillRole(Ue,d,r)&&(f[Ue]=this.generateProceduralMap(t.id,Ue,d),v=!0);this.markReadiness(e,"proceduralReady","show-artwork",{proceduralMs:v?this.now()-g:0}),this.artworkMesh.setPaintingTextures(f,d,t.dimensions,n);const m=this.clampHoverTargetToStageClearance(this.targetX,this.targetY);this.targetX=m.targetRotX,this.targetY=m.targetRotY,this.markReadiness(e,"materialApplied","show-artwork"),this.markRenderDirty(8);const p={albedo:h.albedo?"authored":"preloaded"};for(const Ue of jr)h[Ue]?p[Ue]="authored":f[Ue]?p[Ue]="procedural":p[Ue]="absent";this.diagnostics.debugLazy("show-artwork-maps","Resolved texture map for artwork",()=>({artworkId:t.id,maps:p,shaderVariant:d.shaderVariant,inspectionMode:this.inspectionMode,presentation:n}));const b=this.textureManager.isFallback(o,"albedo");b&&this.diagnostics.warn("show-artwork-fallback","Central 3D painting is using a GENERATED FALLBACK texture — the customer image could not be loaded as a WebGL texture",{artworkId:t.id,bundleId:(Me=(he=a==null?void 0:a.bundleId)!=null?he:(oe=s.primary)==null?void 0:oe.bundleId)!=null?Me:null,imageUrl:(Ve=(ee=s.primary)==null?void 0:ee.declaredUrl)!=null?Ve:t.image,resolvedImageUrl:(K=a==null?void 0:a.selectedUrl)!=null?K:o,albedoSourceMode:(de=a==null?void 0:a.sourceMode)!=null?de:"declared-image",usedEmbeddedFallback:(we=a==null?void 0:a.usedEmbeddedFallback)!=null?we:!1,manifestWidth:(xe=t.dimensions)==null?void 0:xe.width,manifestHeight:(Be=t.dimensions)==null?void 0:Be.height,fallbackUsed:!0});const y=this.getViewportMetrics(),_=this.getZoomBounds(y),L=this.getPanLimits(_.resetFitZoom,y,_),C=this.isPortraitResetArtwork();this.diagnostics.info("show-artwork-complete","Artwork is ready",{artworkId:t.id,bundleId:(Je=(We=a==null?void 0:a.bundleId)!=null?We:(Ne=s.primary)==null?void 0:Ne.bundleId)!=null?Je:null,activeMaps:this.artworkMesh.material.activeMaps(),inspectionMode:this.inspectionMode,fallbackUsed:b,albedoSourceMode:(k=a==null?void 0:a.sourceMode)!=null?k:"declared-image",usedEmbeddedFallback:(ct=a==null?void 0:a.usedEmbeddedFallback)!=null?ct:!1,generatedFallback:(Xe=a==null?void 0:a.generatedFallback)!=null?Xe:b,aspectSource:this.artworkMesh.lastAspectSource,manifestDimensions:this.artworkMesh.lastManifestDimensions,paintingWidth:this.artworkMesh.artworkWidth,paintingHeight:this.artworkMesh.artworkHeight,paintingAspect:this.artworkMesh.artworkAspect,resetZoom:_.resetFitZoom,minZoom:_.minInspectionZoom,closeZoomMinVisibleFraction:Po,maxZoom:_.maxOverviewZoom,overviewHeadroom:_.maxOverviewZoom-_.resetFitZoom,panOverscrollX:gd,panOverscrollY:vd,panLimitAtReset:{x:L.x,y:L.y},portraitResetApplied:C,portraitResetExtra:C?xd:0,usableViewportWidth:y.usableW,usableViewportHeight:y.usableH,usableViewportFractionX:y.usableFracX,usableViewportFractionY:y.usableFracY,viewportOcclusion:{top:y.occlusionTop,right:y.occlusionRight,bottom:y.occlusionBottom,left:y.occlusionLeft},parallaxEnabled:d.parallaxEnabled,parallaxScale:d.parallaxScale,presentation:n,specularStrength:d.specularStrength,selfShadowBias:d.selfShadowBias,readiness:this.readiness[e]}),this.pendingResetAfterArtworkLoad?(this.pendingResetAfterArtworkLoad=!1,this.resetView()):(this.targetZoom=this.clampZoom(this.targetZoom,_),this.zoom=this.clampZoom(this.zoom,_)),this.clampPanTargets(y,_),this.prefetchAdjacentArtworks(e),this.queueProceduralWindow(e,this.readinessRadius,"show-artwork-adjacent"),this.logNavigationReadinessVerdict(e)}getBudgetedWarmOrder(e=this.currentIndex){const t=this.getCriticalWindowIndices(e,this.readinessRadius),n=this.artworks.map((r,s)=>s).filter(r=>!t.includes(r));return[...t,...n]}markGpuWarmed(e,t,n){this.markReadiness(e,"gpuWarmed",n,{lastWarmMs:t})}markShaderCompiled(e,t){this.markReadiness(e,"shaderCompiled",t)}markAllShaderCompiled(e){this.readiness.forEach(t=>this.markReadiness(t.index,"shaderCompiled",e))}promotePrefetchWindow(e,t){this.scheduleTextureSetPrefetch(e,t,"critical-now"),this.getCriticalWindowIndices(e,this.readinessRadius).forEach(n=>{n!==e&&this.scheduleTextureSetPrefetch(n,`${t}:nearby`,"near-next")}),this.queueProceduralWindow(e,this.readinessRadius,`${t}:nearby`)}hasReadinessWork(){if(this.prefetchQueue.length>0||this.activePrefetches.size>0)return!0;const e=this.readiness[this.currentIndex];return!!e&&(!e.pbrLoaded||!e.proceduralReady||!e.gpuWarmed)}getReadinessLedger(){return this.readiness.map(e=>({...e}))}getFullGalleryReadinessSummary(){const e=this.readiness,t=c=>c.albedoLoaded&&c.pbrLoaded&&c.proceduralReady&&c.materialApplied&&c.shaderCompiled&&c.gpuWarmed,n=e.filter(t).length,r=0,s=e.filter(c=>!t(c)).map(c=>c.artworkId),a=this.isStagedStartup,o=a?new Set(this.getStartupEntryTargets(this.currentIndex)):null,l=o?e.filter(c=>!o.has(c.index)&&!t(c)).length:0;return{totalArtworks:this.artworks.length,fullyReadyCount:n,pendingCount:this.artworks.length-n,gpuWarmedCount:e.filter(c=>c.gpuWarmed).length,pbrLoadedCount:e.filter(c=>c.pbrLoaded).length,proceduralReadyCount:e.filter(c=>c.proceduralReady).length,memoryCapApplied:!1,preloadMode:a?"staged":"strict",unresolvedArtworkIds:s,deferredArtworkCount:l,overflowArtworkCount:r}}getEntryWarmTargets(e,t){const n=Math.max(1,Math.min(this.artworks.length,Math.round(t)));return this.getBudgetedWarmOrder(e).slice(0,n)}async ensureEntryReadiness(e,t){var n;for(const r of e)await this.preloadAuthoredTextureSet(r,`${t}:critical-now`),(n=this.artworks[r])!=null&&n.textureSet&&this.prefetchedTextureSets.add(r),this.preGenerateProceduralWindow(r,0,`${t}:critical-now`),this.scheduleTextureSetPrefetch(r,`${t}:critical-now`,"critical-now")}getEntryReadinessContract(e){const t=[];for(const n of e){const r=this.readiness[n];if(!r){t.push(n);continue}(!r.albedoLoaded||!r.pbrLoaded||!r.proceduralReady||!r.materialApplied||!r.gpuWarmed)&&t.push(n)}return{ready:t.length===0,pendingIndices:t,targetIndices:[...e]}}warmArtworkForGPU(e,t="gpu-warm"){var h,f,g,v,m;const n=this.now(),r=this.artworks[e],s=this.resolvePresentation(e),a=bn[s],o=this.currentPreset;if(!r||!o)return!1;const l=(v=(g=(h=this.textureManager.getArtworkAlbedoSelection(r))==null?void 0:h.selectedUrl)!=null?g:(f=pi(r).primary)==null?void 0:f.resolvedUrl)!=null?v:r.image,c=this.textureManager.get(l);if(!c)return this.diagnostics.warn("warm-gpu","Cannot warm artwork because albedo is not cached",{index:e,artworkId:r.id}),!1;const d={};if(r.textureSet){const p=r.textureSet.albedo?this.textureManager.getForRole(r.textureSet.albedo.url,"albedo"):void 0;p&&(d.albedo=p);for(const b of jr){const y=r.textureSet[b];if(!y)continue;const _=this.textureManager.getForRole(y.url,b);_&&(d[b]=_)}}const u={albedo:(m=d.albedo)!=null?m:c};for(const p of jr)d[p]?u[p]=d[p]:this.shouldFillRole(p,o,a)&&(u[p]=this.generateProceduralMap(r.id,p,o));return this.artworkMesh.setPaintingTextures(u,o,r.dimensions,s),this.markReadiness(e,"proceduralReady",t),this.markReadiness(e,"materialApplied",t),this.diagnostics.debug("warm-gpu","Cached artwork textures bound for GPU warm render",{index:e,artworkId:r.id,activeMaps:this.artworkMesh.material.activeMaps(),reason:t,bindMs:Math.round((this.now()-n)*10)/10}),!0}async preloadAuthoredTextureSet(e,t){const n=this.artworks[e];if(!(n!=null&&n.textureSet))return this.markReadiness(e,"pbrLoaded",t,{pbrMs:0}),{};const r=this.now(),s=await this.textureManager.preloadTextureSet(n.textureSet);return this.markReadiness(e,"pbrLoaded",t,{pbrMs:this.now()-r}),s}generateProceduralMap(e,t,n){const r=n.proceduralInspectionTileSize,a=this.inspectionMode&&r>0&&$0.includes(t)?r:n.proceduralTileSize;return this.procedural.generate(e,t,a)}preGenerateProceduralWindow(e,t,n){var s;const r=this.currentPreset;if(r)for(const a of this.getCriticalWindowIndices(e,t)){const o=this.artworks[a],l=bn[this.resolvePresentation(a)],c=this.now();let d=0;for(const u of jr)(s=o.textureSet)!=null&&s[u]||!this.shouldFillRole(u,r,l)||(this.generateProceduralMap(o.id,u,r),d+=1);this.markReadiness(a,"proceduralReady",n,{proceduralMs:d>0?this.now()-c:0}),this.diagnostics.debug("procedural-pregenerate","Procedural maps prepared for artwork",{index:a,artworkId:o.id,generated:d,reason:n,radius:t})}}getCriticalWindowIndices(e,t){const n=[],r=new Set,s=a=>{a<0||a>=this.artworks.length||r.has(a)||(r.add(a),n.push(a))};s(e);for(let a=1;a<=t;a+=1)s(e-a),s(e+a);return n}markReadiness(e,t,n,r={}){const s=this.readiness[e];s&&(s[t]=!0,s.lastReason=n,s.updatedAt=this.now(),r.pbrMs!==void 0&&(s.pbrMs=Math.round(r.pbrMs*10)/10),r.proceduralMs!==void 0&&(s.proceduralMs=Math.round(r.proceduralMs*10)/10),r.lastWarmMs!==void 0&&(s.lastWarmMs=Math.round(r.lastWarmMs*10)/10),this.markRenderDirty(2),this.diagnostics.debugLazy("readiness",`Artwork readiness updated: ${t}`,()=>({index:e,artworkId:s.artworkId,stage:t,reason:n,ready:{albedoLoaded:s.albedoLoaded,pbrLoaded:s.pbrLoaded,proceduralReady:s.proceduralReady,materialApplied:s.materialApplied,shaderCompiled:s.shaderCompiled,gpuWarmed:s.gpuWarmed},timings:{pbrMs:s.pbrMs,proceduralMs:s.proceduralMs,lastWarmMs:s.lastWarmMs}})))}now(){return typeof performance!="undefined"?performance.now():Date.now()}logGalleryScaleValidation(){const e=this.artworks.length,t=[4,15,20,50],n=t.reduce((r,s)=>Math.abs(s-e)<Math.abs(r-e)?s:r);this.diagnostics.info("validation","v0.23 gallery-size readiness profile",{artworkCount:e,nearestValidationBucket:n,validationBuckets:t,criticalWindowRadius:Lo,criticalWindow:this.getCriticalWindowIndices(0,Lo),warmOrderPreview:this.getBudgetedWarmOrder(0).slice(0,Math.min(e,12)),readinessLedger:this.getReadinessLedger()})}prefetchAdjacentArtworks(e){for(const t of[-1,1,-2,2]){const n=e+t;n<0||n>=this.artworks.length||this.scheduleTextureSetPrefetch(n,`adjacent:${t}`,"near-next")}}scheduleFullTextureSetPrefetch(){if(this.fullPrefetchScheduled)return;this.fullPrefetchScheduled=!0;let e=0;const t=()=>{var r;for(;e<this.artworks.length&&(!((r=this.artworks[e])!=null&&r.textureSet)||this.prefetchedTextureSets.has(e));)e+=1;if(e>=this.artworks.length){this.diagnostics.info("prefetch-complete","Idle artwork texture-set prefetch sweep complete",{artworkCount:this.artworks.length,prefetched:this.prefetchedTextureSets.size});return}const n=e;e+=1,this.scheduleTextureSetPrefetch(n,"idle-sweep","background",t)};this.scheduleIdle(t,500)}scheduleTextureSetPrefetch(e,t,n,r){const s=this.artworks[e];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(e)||this.activePrefetches.has(e)){r==null||r();return}const a=this.prefetchQueue.find(o=>o.index===e);if(a){Js[n]<Js[a.lane]&&(a.lane=n,a.reason=t,a.enqueuedAt=this.now(),this.sortPrefetchQueue()),r==null||r();return}this.prefetchQueue.push({index:e,reason:t,lane:n,enqueuedAt:this.now(),sequence:this.prefetchSequence++}),this.sortPrefetchQueue(),this.diagnostics.debug("prefetch-queued","Artwork texture-set prefetch queued",{index:e,artworkId:s.id,reason:t,lane:n,queueLength:this.prefetchQueue.length}),this.drainPrefetchQueue(r)}drainPrefetchQueue(e){if(this.prefetchQueueRunning){e==null||e();return}const t=()=>{if(!this.prefetchQueue.length){this.prefetchQueueRunning=!1,e==null||e();return}const n=this.prefetchQueue[0];if(this.interactionActive&&n&&n.lane!=="critical-now"){this.prefetchQueueRunning=!1,this.diagnostics.debug("prefetch-deferred-interaction","Non-critical prefetch paused for active interaction window",{deferredLane:n.lane,queueLength:this.prefetchQueue.length});return}const r=this.prefetchQueue.shift(),s=this.artworks[r.index];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(r.index)){this.scheduleIdle(t,50);return}this.activePrefetches.add(r.index),this.scheduleIdle(()=>{this.diagnostics.debug("prefetch-start","Prefetching artwork texture set",{index:r.index,artworkId:s.id,reason:r.reason,lane:r.lane,queueLength:this.prefetchQueue.length}),this.preloadAuthoredTextureSet(r.index,`prefetch:${r.reason}`).then(()=>{this.prefetchedTextureSets.add(r.index),this.diagnostics.debug("prefetch-complete","Artwork texture set prefetched",{index:r.index,artworkId:s.id,reason:r.reason})}).catch(a=>{this.prefetchedTextureSets.delete(r.index),this.diagnostics.warn("prefetch-failed","Artwork texture-set prefetch failed",{index:r.index,artworkId:s.id,reason:r.reason,message:a instanceof Error?a.message:String(a)})}).finally(()=>{this.activePrefetches.delete(r.index),t()})},250)};this.prefetchQueueRunning=!0,t()}sortPrefetchQueue(){const e=this.now(),t=n=>{const r=e-n.enqueuedAt;return n.lane==="background"&&r>=W0?Js["near-next"]:Js[n.lane]};this.prefetchQueue.sort((n,r)=>{const s=t(n)-t(r);return s!==0?s:n.sequence-r.sequence})}scheduleIdle(e,t){const n=()=>{this.disposed||e()},r=window.requestIdleCallback;if(typeof r=="function"){r(n,{timeout:t});return}window.setTimeout(n,1)}shouldFillRole(e,t,n){if(!n.proceduralRoles.includes(e))return!1;switch(e){case"normal":return!0;case"detailNormal":return t.detailNormalEnabled&&t.detailNormalStrength>0;case"height":return t.bumpStrength>0||t.parallaxEnabled&&t.parallaxScale>0||t.selfShadowEnabled;case"roughness":return t.shaderVariant!=="painting-battery";case"specular":return t.specularStrength>0;case"varnish":return t.clearcoatEnabled&&n.clearcoatStrength>0;case"ao":return t.aoEnabled;default:return!1}}resolvePresentation(e){var t;return R0((t=this.artworks[e])==null?void 0:t.presentation)}navigate(e){var r,s,a,o;const t=this.currentIndex,n=It((this.currentIndex+e+this.artworks.length)%this.artworks.length,0,this.artworks.length-1);this.diagnostics.info("navigate",`Navigate ${e>0?"forward":"back"}`,{fromIndex:t,toIndex:n,fromArtworkId:(r=this.artworks[t])==null?void 0:r.id,toArtworkId:(s=this.artworks[n])==null?void 0:s.id,direction:e,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:e*js,seedPositionZ:this.reducedMotion?0:Ks,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/Zr))}),this.reducedMotion||(this.artworkMesh.group.position.x=e*js,this.artworkMesh.group.position.z=Ks,this.artworkMesh.group.rotation.y=e*Sd,this.artworkMesh.group.scale.set(cr,cr,cr)),this.currentIndex=n,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:n,trigger:e>0?"navigate-next":"navigate-prev",startedAt:this.now()},this.promotePrefetchWindow(n,`navigate:${e>0?"next":"prev"}`),this.showArtwork(n),(a=this.frameBudgetNavigationMarker)==null||a.call(this),this.resetView(),(o=this.onNavigateCallback)==null||o.call(this,this.currentIndex)}goTo(e){var s,a,o,l;if(e===this.currentIndex)return;const t=this.currentIndex,n=e>this.currentIndex?1:-1,r=e-this.currentIndex;this.diagnostics.info("navigate","goTo direct navigation",{fromIndex:this.currentIndex,toIndex:e,fromArtworkId:(s=this.artworks[this.currentIndex])==null?void 0:s.id,toArtworkId:(a=this.artworks[e])==null?void 0:a.id,diff:r,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:(r>0?1:-1)*js,seedPositionZ:this.reducedMotion?0:Ks,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/Zr))}),this.currentIndex=e,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:e,trigger:"timeline-select",startedAt:this.now()},this.promotePrefetchWindow(e,"timeline-select"),this.reducedMotion||(this.artworkMesh.group.position.x=(r>0?1:-1)*js,this.artworkMesh.group.position.z=Ks,this.artworkMesh.group.rotation.y=n*Sd,this.artworkMesh.group.scale.set(cr,cr,cr)),this.showArtwork(e),(o=this.frameBudgetNavigationMarker)==null||o.call(this),this.resetView(),(l=this.onNavigateCallback)==null||l.call(this,this.currentIndex)}setReducedMotion(e){this.reducedMotion=e}handleViewportMetricsChanged(){const e=Math.abs(this.targetZoom-this.lastResetFitZoom)<=H0,t=this.getViewportMetrics(),n=this.getZoomBounds(t);e?this.targetZoom=n.resetFitZoom:this.targetZoom=It(this.targetZoom,n.minInspectionZoom,n.maxOverviewZoom),this.zoom=It(this.zoom,n.minInspectionZoom,n.maxOverviewZoom),this.lastResetFitZoom=n.resetFitZoom,this.clampPanTargets(t,n),this.markRenderDirty(4),this.diagnostics.info("viewport-refit","Artwork viewport metrics changed",{resetFitZoom:n.resetFitZoom,minInspectionZoom:n.minInspectionZoom,maxOverviewZoom:n.maxOverviewZoom,overviewHeadroom:n.maxOverviewZoom-n.resetFitZoom,wasNearReset:e,viewport:t})}setHoverTarget(e,t){const n=this.clampHoverTargetToStageClearance(t,e);this.targetY===n.targetRotY&&this.targetX===n.targetRotX||(this.targetY=n.targetRotY,this.targetX=n.targetRotX,this.markRenderDirty(2))}onNavigate(e){this.onNavigateCallback=e}get index(){return this.currentIndex}whenArtworkInteractive(e,t){const n=this.readiness[e];if(!n||this.disposed)return Promise.resolve("timeout");const r=()=>n.albedoLoaded&&n.materialApplied&&n.shaderCompiled;return r()?Promise.resolve("ready"):new Promise(s=>{const a=this.now(),o=()=>{if(this.disposed||!this.readiness[e]){s("timeout");return}if(r()){s("ready");return}if(this.now()-a>=t){s("timeout");return}window.setTimeout(o,50)};window.setTimeout(o,50)})}get artworkAspect(){return this.artworkMesh.artworkAspect}get proceduralFactory(){return this.procedural}update(e){const t=this.artworkMesh.group,n=this.readAnimationSnapshot();let r=0;this.lastUpdateTime>0&&(r=Math.min((e-this.lastUpdateTime)/1e3,V0)),this.lastUpdateTime=e;const s=this.getViewportMetrics(),a=this.getZoomBounds(s);this.targetZoom=this.clampZoom(this.targetZoom,a),this.clampPanTargets(s,a);const o=this.clampHoverTargetToStageClearance(this.targetX,this.targetY);return this.targetX=o.targetRotX,this.targetY=o.targetRotY,r<=0?this.consumeRenderDirty()||this.animationSnapshotChanged(n):(t.rotation.x=qt(t.rotation.x,this.targetX,_d,r),t.rotation.y=qt(t.rotation.y,this.targetY,_d,r),t.position.x=qt(t.position.x,0,Zr,r),t.position.y=qt(t.position.y,0,Zr,r),t.position.z=qt(t.position.z,0,Zr,r),t.scale.x=qt(t.scale.x,1,Io,r),t.scale.y=qt(t.scale.y,1,Io,r),t.scale.z=qt(t.scale.z,1,Io,r),this.zoom=qt(this.zoom,this.targetZoom,bd,r),this.camera.position.z=qt(this.camera.position.z,this.zoom,bd,r),this.panX=qt(this.panX,this.targetPanX,Zs,r),this.panY=qt(this.panY,this.targetPanY,Zs,r),this.camera.position.x=qt(this.camera.position.x,this.panX,Zs,r),this.camera.position.y=qt(this.camera.position.y,this.panY,Zs,r),this.consumeRenderDirty()||this.animationSnapshotChanged(n))}resetView(){const e=this.getZoomBounds();this.targetPanX=0,this.targetPanY=0,this.targetZoom=e.resetFitZoom,this.lastResetFitZoom=e.resetFitZoom,this.targetX=0,this.targetY=0,this.markRenderDirty(4)}consumeRenderDirty(){return this.renderDirtyFrames<=0?!1:(this.renderDirtyFrames-=1,!0)}readAnimationSnapshot(){const e=this.artworkMesh.group;return{groupX:e.position.x,groupY:e.position.y,groupZ:e.position.z,groupRotX:e.rotation.x,groupRotY:e.rotation.y,groupScaleX:e.scale.x,groupScaleY:e.scale.y,groupScaleZ:e.scale.z,zoom:this.zoom,cameraX:this.camera.position.x,cameraY:this.camera.position.y,cameraZ:this.camera.position.z,panX:this.panX,panY:this.panY,targetX:this.targetX,targetY:this.targetY,targetZoom:this.targetZoom,targetPanX:this.targetPanX,targetPanY:this.targetPanY}}animationSnapshotChanged(e){const t=this.readAnimationSnapshot();return Object.keys(e).some(n=>{const r=n;return Math.abs(t[r]-e[r])>1e-5})}clampZoom(e,t=this.getZoomBounds()){return It(e,t.minInspectionZoom,t.maxOverviewZoom)}clampPanTargets(e=this.getViewportMetrics(),t=this.getZoomBounds(e)){const n=this.getPanLimits(this.targetZoom,e,t);this.targetPanX=It(this.targetPanX,-n.x,n.x),this.targetPanY=It(this.targetPanY,-n.y,n.y)}getFovTan(){const e=this.camera.fov;return e!==this._fovTanForFov&&(this._fovTanForFov=e,this._fovTanCache=Math.tan(Eh.degToRad(e*.5))),this._fovTanCache}getPanLimits(e,t=this.getViewportMetrics(),n=this.getZoomBounds(t)){const s=2*It(e,n.minInspectionZoom,n.maxOverviewZoom)*this.getFovTan()*t.usableFracY,a=s*t.effectiveAspect;return N0({artworkWidth:this.artworkMesh.artworkWidth,artworkHeight:this.artworkMesh.artworkHeight,visibleWidth:a,visibleHeight:s,overscrollX:gd,overscrollY:vd})}clampHoverTargetToStageClearance(e,t){return F0({targetRotX:e,targetRotY:t,artworkWidth:this.artworkMesh.artworkWidth,artworkHeight:this.artworkMesh.artworkHeight,bodyBackDepth:this.artworkMesh.bodyBackExtent,wallZ:Yr.artworkWallZ,clearanceMargin:G0})}getZoomBounds(e=this.getViewportMetrics()){const t=this.getInspectionMinZoom(e),n=this.getResetFitZoom(e),r=Math.max(O0,n+B0);return{minInspectionZoom:It(t,Ys,n),resetFitZoom:It(n,Ys,r),maxOverviewZoom:r}}getInspectionMinZoom(e){const t=this.getFovTan(),n=this.artworkMesh.artworkHeight*Po,r=this.artworkMesh.artworkWidth*Po,s=n/(2*t*e.usableFracY),a=r/(2*t*this.camera.aspect*e.usableFracX);return It(Math.max(Ys,s,a),Ys,qr)}getResetFitZoom(e){const t=this.artworkMesh.artworkWidth+.4,n=this.artworkMesh.artworkHeight+.4,r=this.getFovTan(),s=n*yd/(2*r*e.usableFracY),a=t*yd/(2*r*this.camera.aspect*e.usableFracX),o=Math.max(qr,s,a);return this.isPortraitResetArtwork()?o+xd:o}isPortraitResetArtwork(){return this.artworkMesh.artworkAspect<z0}getViewportMetrics(){var l,c;const e=(c=(l=this.viewportMetricsProvider)==null?void 0:l.call(this))!=null?c:this.getDefaultViewportMetrics(),t=Math.max(1,e.viewportW),n=Math.max(1,e.viewportH),r=It(e.usableW,t*qs,t),s=It(e.usableH,n*qs,n),a=It(e.usableFracX||r/t,qs,1),o=It(e.usableFracY||s/n,qs,1);return{viewportW:t,viewportH:n,usableW:r,usableH:s,usableFracX:a,usableFracY:o,effectiveAspect:Math.max(.1,e.effectiveAspect||r/s),occlusionTop:Math.max(0,e.occlusionTop),occlusionRight:Math.max(0,e.occlusionRight),occlusionBottom:Math.max(0,e.occlusionBottom),occlusionLeft:Math.max(0,e.occlusionLeft)}}getDefaultViewportMetrics(){const e=typeof window!="undefined"?window.innerWidth:1,t=typeof window!="undefined"?window.innerHeight:1;return{viewportW:e,viewportH:t,usableW:e,usableH:t,usableFracX:1,usableFracY:1,effectiveAspect:e/Math.max(1,t),occlusionTop:0,occlusionRight:0,occlusionBottom:0,occlusionLeft:0}}queueProceduralWindow(e,t,n){if(this.getCriticalWindowIndices(e,t).forEach(s=>this.proceduralQueue.add(s)),this.proceduralQueueRunning)return;this.proceduralQueueRunning=!0;const r=()=>{const s=this.proceduralQueue.values().next();if(s.done){this.proceduralQueueRunning=!1;return}const a=s.value;this.proceduralQueue.delete(a),this.scheduleIdle(()=>{this.preGenerateProceduralWindow(a,0,`${n}:queued`),r()},X0)};r()}logNavigationReadinessVerdict(e){const t=this.pendingNavigationProbe;if(!t||t.toIndex!==e)return;this.pendingNavigationProbe=null;const n=t.readinessBefore;if(!n)return;const r=this.readiness[e];if(!r)return;const s=!n.pbrLoaded,a=!n.proceduralReady,o=!n.gpuWarmed,l=s||a||o;this.diagnostics.info(l?"cold-path-detected":"hot-path-confirmed",l?"Navigation required remaining readiness work":"Navigation stayed on prepared hot path",{trigger:t.trigger,fromIndex:t.fromIndex,toIndex:t.toIndex,durationMs:Math.round((this.now()-t.startedAt)*10)/10,cold:{pbr:s,procedural:a,gpu:o},readiness:r})}dispose(){this.disposed=!0,this.prefetchQueue.length=0,this.proceduralQueue.clear(),this.activePrefetches.clear(),this.onNavigateCallback=null,this.pendingNavigationProbe=null}}class q0{constructor(e){x(this,"el");x(this,"helpBtn");x(this,"infoBtn");x(this,"backBtn");x(this,"onHelpClick");x(this,"onInfoClick");x(this,"onBackClick");this.el=document.createElement("header"),this.el.className="topbar",this.el.setAttribute("role","banner");const t=document.createElement("div");t.className="topbar__left",this.backBtn=document.createElement("button"),this.backBtn.className="topbar__back-btn",this.backBtn.setAttribute("aria-label","Zurück zum Museum"),this.backBtn.innerHTML=`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      <span class="topbar__back-btn-label topbar__back-btn-label--full">Zurück zum Museum</span>
      <span class="topbar__back-btn-label topbar__back-btn-label--short">Museum</span>
    `,this.backBtn.addEventListener("click",()=>{var s;this.backBtn.disabled||(s=this.onBackClick)==null||s.call(this)});const n=document.createElement("div");n.className="topbar__brand-group",n.innerHTML=`
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `,t.appendChild(this.backBtn),t.appendChild(n),this.el.appendChild(t);const r=document.createElement("div");r.className="topbar__right",this.infoBtn=document.createElement("button"),this.infoBtn.className="topbar__chrome-btn",this.infoBtn.setAttribute("aria-label","Werkinformationen einblenden"),this.infoBtn.innerHTML=`
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span class="topbar__chrome-btn-label">Info</span>
    `,this.infoBtn.addEventListener("click",()=>{var s;return(s=this.onInfoClick)==null?void 0:s.call(this)}),this.helpBtn=document.createElement("button"),this.helpBtn.className="topbar__help-btn",this.helpBtn.setAttribute("aria-label","Tastaturkürzel anzeigen"),this.helpBtn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',this.helpBtn.addEventListener("click",()=>{var s;return(s=this.onHelpClick)==null?void 0:s.call(this)}),r.appendChild(this.infoBtn),r.appendChild(this.helpBtn),this.el.appendChild(r),e.appendChild(this.el)}setBackBusy(e){this.backBtn.disabled=e,this.backBtn.setAttribute("aria-busy",e?"true":"false")}dispose(){this.el.remove()}}const Ra=class Ra{constructor(e,t){x(this,"el");x(this,"eyebrow");x(this,"title");x(this,"meta");x(this,"description");x(this,"credit");this.el=document.createElement("section"),this.el.className="info-panel",this.el.setAttribute("aria-live","polite"),this.el.setAttribute("aria-label","Informationen zum aktuellen Werk"),this.eyebrow=document.createElement("p"),this.eyebrow.className="info-panel__eyebrow",this.title=document.createElement("h1"),this.title.className="info-panel__title",this.meta=document.createElement("p"),this.meta.className="info-panel__meta",this.description=document.createElement("p"),this.description.className="info-panel__description",this.credit=document.createElement("p"),this.credit.className="info-panel__credit",this.el.append(this.eyebrow,this.title,this.meta,this.description,this.credit),e.appendChild(this.el),this.update(t)}update(e,t=!1){t?(this.el.classList.add("is-transitioning"),window.setTimeout(()=>{this.setContent(e),window.requestAnimationFrame(()=>{this.el.classList.remove("is-transitioning")})},Ra.CONTENT_SWAP_DELAY_MS)):this.setContent(e)}setCompact(e){this.el.classList.toggle("info-panel--compact",e)}setContent(e){this.eyebrow.textContent=`${e.subtitle} · ${e.year}`,this.title.textContent=e.title,this.meta.textContent=[e.medium,e.surface].filter(Boolean).join(" · "),this.description.textContent=e.description,this.credit.textContent=`© ${e.credit}`}dispose(){this.el.remove()}};x(Ra,"CONTENT_SWAP_DELAY_MS",520);let Uo=Ra;const Bn=class Bn{constructor(e){x(this,"el");x(this,"prevBtn");x(this,"nextBtn");x(this,"onPrevCallback",null);x(this,"onNextCallback",null);x(this,"hintIdleTimer",null);x(this,"hintAnimationTimer",null);x(this,"hintDismissed",!1);x(this,"hintStarted",!1);x(this,"hintKeydownListener",null);x(this,"onHintStartCallback",null);x(this,"onHintFinishedCallback",null);this.el=document.createElement("nav"),this.el.className="nav-controls",this.el.setAttribute("aria-label","Galerie-Navigation"),this.prevBtn=document.createElement("button"),this.prevBtn.className="nav-btn",this.prevBtn.setAttribute("aria-label","Vorheriges Werk"),this.prevBtn.textContent="←",this.prevBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onPrevCallback)==null||t.call(this)}),this.nextBtn=document.createElement("button"),this.nextBtn.className="nav-btn",this.nextBtn.setAttribute("aria-label","Nächstes Werk"),this.nextBtn.textContent="→",this.nextBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onNextCallback)==null||t.call(this)}),this.el.appendChild(this.prevBtn),this.el.appendChild(this.nextBtn),e.appendChild(this.el)}onHintStart(e){this.onHintStartCallback=e}onHintFinished(e){this.onHintFinishedCallback=e}setHiddenMode(e){this.el.classList.toggle("nav-controls--hidden",e)}enableIdleHint(){if(this.hintStarted||(this.hintStarted=!0,this.readHintSeen())||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;this.hintIdleTimer=window.setTimeout(()=>{var t;this.hintIdleTimer=null,this.hintDismissed||((t=this.onHintStartCallback)==null||t.call(this),document.documentElement.dataset.navHint="active",this.hintAnimationTimer=window.setTimeout(()=>{var n;this.hintAnimationTimer=null,this.hintDismissed||(delete document.documentElement.dataset.navHint,(n=this.onHintFinishedCallback)==null||n.call(this))},Bn.HINT_ANIM_DURATION_MS))},Bn.HINT_IDLE_DELAY_MS);const e=()=>this.dismissHint();this.prevBtn.addEventListener("pointerenter",e,{once:!0}),this.nextBtn.addEventListener("pointerenter",e,{once:!0}),this.prevBtn.addEventListener("focus",e,{once:!0}),this.nextBtn.addEventListener("focus",e,{once:!0}),this.hintKeydownListener=t=>{(t.key==="ArrowLeft"||t.key==="ArrowRight")&&this.dismissHint()},document.addEventListener("keydown",this.hintKeydownListener)}dismissHint(){var e;if(!this.hintDismissed){this.hintDismissed=!0,this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),delete document.documentElement.dataset.navHint,this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),(e=this.onHintFinishedCallback)==null||e.call(this);try{localStorage.setItem(Bn.HINT_STORAGE_KEY,"1")}catch(t){}}}readHintSeen(){try{return localStorage.getItem(Bn.HINT_STORAGE_KEY)==="1"}catch(e){return!1}}onPrev(e){this.onPrevCallback=e}onNext(e){this.onNextCallback=e}dispose(){this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),delete document.documentElement.dataset.navHint,this.el.remove()}};x(Bn,"HINT_STORAGE_KEY","freyraum-nav-hint-seen"),x(Bn,"HINT_IDLE_DELAY_MS",5e3),x(Bn,"HINT_ANIM_DURATION_MS",3*1600+300);let ko=Bn;class Z0{constructor(e){x(this,"el");this.el=document.createElement("p"),this.el.className="hint-text",this.el.setAttribute("aria-hidden","true"),this.updateHint(),e.appendChild(this.el)}updateHint(){var t;const e=(t=document.documentElement.dataset.pointerPrimary)!=null?t:"fine";this.el.textContent=e==="coarse"?"Wischen zum Navigieren · Zwei Finger zum Zoomen.":"Scrollen zum Zoomen · Ziehen zum freien Bewegen."}dispose(){this.el.remove()}}const Md=.6;class j0{constructor(e,t){x(this,"el");x(this,"galleryManager");this.galleryManager=t,this.el=document.createElement("div"),this.el.className="zoom-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Zoom-Steuerung");const n=this.createButton("zoom-controls__btn","Vergrößern","＋",()=>{this.galleryManager.addZoomDelta(-Md)}),r=this.createButton("zoom-controls__btn","Verkleinern","−",()=>{this.galleryManager.addZoomDelta(Md)}),s=this.createButton("zoom-controls__btn zoom-controls__btn--reset","Ansicht zurücksetzen","⟲",()=>{this.galleryManager.resetView()});this.el.append(n,r,s),e.appendChild(this.el)}createButton(e,t,n,r){const s=document.createElement("button");s.type="button",s.className=e,s.setAttribute("aria-label",t);const a=document.createElement("span");return a.className="zoom-controls__icon",a.setAttribute("aria-hidden","true"),a.textContent=n,s.appendChild(a),s.addEventListener("click",r),s}dispose(){this.el.remove()}}class K0{constructor(e,t=document.documentElement){x(this,"btn");x(this,"target");x(this,"toggle",()=>{if(!document.fullscreenEnabled){this.btn.setAttribute("aria-disabled","true");return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.target.requestFullscreen().catch(()=>{})});x(this,"handleChange",()=>{const e=!!document.fullscreenElement;this.btn.setAttribute("aria-pressed",e?"true":"false"),document.documentElement.dataset.presentation=e?"on":"off"});this.target=t,this.btn=document.createElement("button"),this.btn.type="button",this.btn.className="fullscreen-btn",this.btn.setAttribute("aria-pressed","false"),this.btn.setAttribute("aria-label","Vollbild umschalten"),this.btn.innerHTML=`
      <span class="fullscreen-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path class="fullscreen-btn__enter" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path class="fullscreen-btn__exit" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        </svg>
      </span>
    `,this.btn.addEventListener("click",this.toggle),document.addEventListener("fullscreenchange",this.handleChange),e.appendChild(this.btn)}dispose(){this.btn.removeEventListener("click",this.toggle),document.removeEventListener("fullscreenchange",this.handleChange),this.btn.remove()}}const mi=.3;function ea(i){return Math.max(0,Math.min(100,i))/100*mi}function ta(i){const e=Math.max(0,Math.min(mi,i));return e<=0?0:Math.round(e/mi*100)}const dr=ea(50);class Q0{constructor(e,t){x(this,"root");x(this,"trigger");x(this,"panel");x(this,"isOpen",!1);x(this,"unsubscribe");x(this,"audioStatusMessage",null);x(this,"motionInput",null);x(this,"contrastInput",null);x(this,"chromeInput",null);x(this,"audioMutedInput",null);x(this,"audioVolumeInput",null);x(this,"audioValueLabel",null);x(this,"audioStatusEl",null);x(this,"isVolumeDragging",!1);x(this,"handleToggle",()=>{this.setOpen(!this.isOpen)});x(this,"handleOutsideClick",e=>{this.isOpen&&(this.root.contains(e.target)||(this.setOpen(!1),this.trigger.focus()))});x(this,"handleEscape",e=>{e.key==="Escape"&&this.isOpen&&(e.preventDefault(),e.stopPropagation(),this.setOpen(!1),this.trigger.focus())});this.prefs=t,this.root=document.createElement("div"),this.root.className="prefs",this.trigger=document.createElement("button"),this.trigger.type="button",this.trigger.className="prefs__trigger",this.trigger.setAttribute("aria-haspopup","true"),this.trigger.setAttribute("aria-expanded","false"),this.trigger.setAttribute("aria-controls","freyraum-prefs-panel"),this.trigger.setAttribute("aria-label","Einstellungen öffnen"),this.trigger.innerHTML=`
      <span class="prefs__trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
        </svg>
      </span>
    `,this.trigger.addEventListener("click",this.handleToggle),this.panel=document.createElement("div"),this.panel.id="freyraum-prefs-panel",this.panel.className="prefs__panel",this.panel.setAttribute("role","dialog"),this.panel.setAttribute("aria-labelledby","freyraum-prefs-heading"),this.panel.setAttribute("aria-modal","true"),this.panel.hidden=!0,this.buildPanel(),this.root.append(this.trigger,this.panel),e.appendChild(this.root),document.addEventListener("click",this.handleOutsideClick),document.addEventListener("keydown",this.handleEscape),this.unsubscribe=this.prefs.subscribe(()=>this.patchPanel())}buildPanel(){var c;const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:r,audioVolume:s,alwaysShowChrome:a}=this.prefs.current,o=Object.values(Xr).map(d=>`
          <label class="prefs__radio">
            <input type="radio" name="freyraum-quality" value="${d.id}" ${n===d.id?"checked":""} />
            <span class="prefs__radio-label">
              <span class="prefs__radio-title">${d.label}</span>
              <span class="prefs__radio-desc">${d.description}</span>
            </span>
          </label>
        `).join(""),l=ta(s);this.panel.innerHTML=`
      <h2 class="prefs__heading" id="freyraum-prefs-heading">Anzeige</h2>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-motion" ${e?"checked":""} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Reduzierte Bewegung</span>
          <span class="prefs__toggle-desc">Sanftere Übergänge und ruhige Galerie.</span>
        </span>
      </label>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-contrast" ${t==="high"?"checked":""} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Hoher Kontrast</span>
          <span class="prefs__toggle-desc">Stärkere Lesbarkeit über allen Werken.</span>
        </span>
      </label>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-chrome" ${a?"checked":""} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Bedienleiste immer einblenden</span>
          <span class="prefs__toggle-desc">Zeitleiste und Werkinformationen dauerhaft anzeigen.</span>
        </span>
      </label>
      <h2 class="prefs__heading">Hintergrundmusik</h2>
      <label class="prefs__toggle">
        <input type="checkbox" id="freyraum-audio-muted" ${r?"checked":""} />
        <span class="prefs__toggle-track" aria-hidden="true"></span>
        <span class="prefs__toggle-label">
          <span class="prefs__toggle-title">Ton stummschalten</span>
          <span class="prefs__toggle-desc">Beruhigende Hintergrundmusik ein- oder ausschalten.</span>
        </span>
      </label>
      <label class="prefs__range" for="freyraum-audio-volume">
        <span class="prefs__range-label">Lautstärke</span>
        <input
          type="range"
          id="freyraum-audio-volume"
          min="0"
          max="100"
          step="1"
          value="${l}"
          aria-valuetext="${l} Prozent"
          style="--volume-pct: ${l}%;"
        />
        <span class="prefs__range-value" id="freyraum-audio-volume-label">${l}%</span>
      </label>
      <p class="prefs__note" role="status" id="freyraum-audio-status" ${this.audioStatusMessage?"":"hidden"}>${(c=this.audioStatusMessage)!=null?c:""}</p>
      <h2 class="prefs__heading">Performance</h2>
      <fieldset class="prefs__group">
        <legend class="prefs__legend">Qualitätsstufe</legend>
        ${o}
      </fieldset>
    `,this.motionInput=this.panel.querySelector("#freyraum-motion"),this.contrastInput=this.panel.querySelector("#freyraum-contrast"),this.chromeInput=this.panel.querySelector("#freyraum-chrome"),this.audioMutedInput=this.panel.querySelector("#freyraum-audio-muted"),this.audioVolumeInput=this.panel.querySelector("#freyraum-audio-volume"),this.audioValueLabel=this.panel.querySelector("#freyraum-audio-volume-label"),this.audioStatusEl=this.panel.querySelector("#freyraum-audio-status"),this.bindPanelEvents()}bindPanelEvents(){var e,t,n,r;if((e=this.motionInput)==null||e.addEventListener("change",s=>{this.prefs.setReducedMotion(s.target.checked)}),(t=this.contrastInput)==null||t.addEventListener("change",s=>{this.prefs.setContrastMode(s.target.checked?"high":"auto")}),(n=this.chromeInput)==null||n.addEventListener("change",s=>{this.prefs.setAlwaysShowChrome(s.target.checked)}),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(s=>{s.addEventListener("change",()=>{s.checked&&this.prefs.setQuality(s.value)})}),(r=this.audioMutedInput)==null||r.addEventListener("change",s=>{this.prefs.setAudioMuted(s.target.checked)}),this.audioVolumeInput){const s=this.audioVolumeInput;s.addEventListener("pointerdown",()=>{this.isVolumeDragging=!0}),s.addEventListener("pointerup",()=>{this.isVolumeDragging=!1}),s.addEventListener("pointercancel",()=>{this.isVolumeDragging=!1}),s.addEventListener("input",()=>{const a=Number(s.value);if(Number.isNaN(a))return;this.audioValueLabel&&(this.audioValueLabel.textContent=`${Math.round(a)}%`);const o=Math.round(a);s.style.setProperty("--volume-pct",`${o}%`),s.setAttribute("aria-valuetext",`${o} Prozent`),this.prefs.setAudioVolume(ea(a))}),s.addEventListener("change",()=>{this.isVolumeDragging=!1;const a=Number(s.value);Number.isNaN(a)||this.prefs.setAudioVolume(ea(a))})}}patchPanel(){const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:r,audioVolume:s,alwaysShowChrome:a}=this.prefs.current;if(this.motionInput&&(this.motionInput.checked=e),this.contrastInput&&(this.contrastInput.checked=t==="high"),this.chromeInput&&(this.chromeInput.checked=a),this.audioMutedInput&&(this.audioMutedInput.checked=r),!this.isVolumeDragging&&this.audioVolumeInput&&this.audioValueLabel){const o=ta(s);this.audioVolumeInput.value=String(o),this.audioVolumeInput.style.setProperty("--volume-pct",`${o}%`),this.audioVolumeInput.setAttribute("aria-valuetext",`${o} Prozent`),this.audioValueLabel.textContent=`${o}%`}this.audioStatusEl&&(this.audioStatusMessage?(this.audioStatusEl.textContent=this.audioStatusMessage,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden","")),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(o=>{o.checked=o.value===n})}setAudioStatusMessage(e){this.audioStatusMessage=e,this.audioStatusEl&&(e?(this.audioStatusEl.textContent=e,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden",""))}setOpen(e){var t;this.isOpen=e,this.trigger.setAttribute("aria-expanded",e?"true":"false"),this.panel.hidden=!e,e&&((t=this.panel.querySelector("input"))==null||t.focus())}dispose(){document.removeEventListener("click",this.handleOutsideClick),document.removeEventListener("keydown",this.handleEscape),this.unsubscribe(),this.root.remove()}}const J0={INFO_PANEL_TRIGGER_BAND_PX:120,NAV_TRIGGER_BAND_PX:220,HIDE_DELAY_MS:2500,NAV_HIDE_DELAY_MS:2e3,TOUCH_REVEAL_DURATION_MS:4e3,FORCE_REVEAL_DURATION_MS:3200,IOS_EDGE_DEAD_ZONE_PX:22,INFO_PANEL_TOUCH_MAX_PX:80};class ey{constructor(e,t,n,r={}){x(this,"diag",Jt("chrome-visibility"));x(this,"config");x(this,"options");x(this,"infoPanelEl");x(this,"prefs");x(this,"appRoot");x(this,"infoPanelPeekHit",null);x(this,"srStatusEl",null);x(this,"panels",new Map);x(this,"boundOnPointerMove");x(this,"boundOnPointerDown");x(this,"boundOnKeyDown");x(this,"boundOnViewportLeave");x(this,"unsubscribePrefs",null);x(this,"initialised",!1);x(this,"settleTimer",null);this.infoPanelEl=e,this.prefs=t,this.appRoot=n,this.options=r,this.config={...J0,...r.config},this.boundOnPointerMove=this.onPointerMove.bind(this),this.boundOnPointerDown=this.onPointerDown.bind(this),this.boundOnKeyDown=this.onKeyDown.bind(this),this.boundOnViewportLeave=this.onViewportLeave.bind(this)}init(){if(!this.initialised){this.initialised=!0,this.panels.set("info-panel",this.createPanelState("info-panel",this.infoPanelEl,"Werkinformationen")),this.applyMode(this.currentMode()),this.createPeekElements(),this.createSrStatusElement(),window.addEventListener("pointermove",this.boundOnPointerMove,{passive:!0}),window.addEventListener("pointerdown",this.boundOnPointerDown,{passive:!0}),document.addEventListener("keydown",this.boundOnKeyDown,{passive:!0}),document.addEventListener("mouseleave",this.boundOnViewportLeave,{passive:!0}),window.addEventListener("blur",this.boundOnViewportLeave,{passive:!0});for(const e of this.panels.values())e.el.addEventListener("focusin",e.onFocusIn),e.el.addEventListener("focusout",e.onFocusOut),e.el.addEventListener("pointerenter",e.onPointerEnter),e.el.addEventListener("pointerleave",e.onPointerLeave);this.unsubscribePrefs=this.prefs.subscribe(()=>this.applyMode(this.currentMode())),this.diag.info("init","ChromeVisibilityManager initialised",{mode:this.currentMode()})}}dispose(){var e,t,n;if(this.initialised){this.initialised=!1,window.removeEventListener("pointermove",this.boundOnPointerMove),window.removeEventListener("pointerdown",this.boundOnPointerDown),document.removeEventListener("keydown",this.boundOnKeyDown),document.removeEventListener("mouseleave",this.boundOnViewportLeave),window.removeEventListener("blur",this.boundOnViewportLeave),(e=this.unsubscribePrefs)==null||e.call(this),this.unsubscribePrefs=null;for(const r of this.panels.values())r.hideTimerId!==null&&clearTimeout(r.hideTimerId),r.el.removeEventListener("focusin",r.onFocusIn),r.el.removeEventListener("focusout",r.onFocusOut),r.el.removeEventListener("pointerenter",r.onPointerEnter),r.el.removeEventListener("pointerleave",r.onPointerLeave);this.panels.clear(),(t=this.infoPanelPeekHit)==null||t.remove(),(n=this.srStatusEl)==null||n.remove(),this.infoPanelPeekHit=null,this.srStatusEl=null,this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null),this.diag.info("dispose","ChromeVisibilityManager disposed")}}forceReveal(e){!this.initialised||this.currentMode()==="visible"||!this.panels.get(e)||(this.reveal(e,"forced"),this.scheduleHide(e,this.config.FORCE_REVEAL_DURATION_MS),this.diag.debug("force-reveal","Panel force-revealed",{panelId:e}))}registerNavControls(e,t){if(!this.initialised){this.diag.warn("register-nav","registerNavControls called before init() — ignored");return}if(this.panels.has("nav-controls")){this.diag.warn("register-nav","Nav controls already registered — ignored");return}const n=this.createPanelState("nav-controls",e,"Navigation");this.panels.set("nav-controls",n),e.addEventListener("focusin",n.onFocusIn),e.addEventListener("focusout",n.onFocusOut),e.addEventListener("pointerenter",n.onPointerEnter),e.addEventListener("pointerleave",n.onPointerLeave),this.currentMode()==="visible"&&this.reveal("nav-controls","preference"),t.onHintStart(()=>{this.reveal("nav-controls","hint"),this.diag.debug("nav-hint-start","Nav controls revealed for onboarding hint")}),t.onHintFinished(()=>{const r=this.panels.get("nav-controls");r&&(this.currentMode()==="clean"&&this.shouldHide(r)&&(this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-hint-dismiss","Nav hint finished; scheduled re-hide",{delay:this.config.NAV_HIDE_DELAY_MS})),this.triggerAffordanceSettle())}),this.diag.info("register-nav","Nav controls registered as managed chrome surface",{mode:this.currentMode()})}triggerAffordanceSettle(){window.matchMedia("(prefers-reduced-motion: reduce)").matches||(this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling")),this.appRoot.classList.add("affordance-settling"),this.diag.debug("affordance-settle-start","Affordance settle phase started"),this.settleTimer=window.setTimeout(()=>{this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null,this.diag.debug("affordance-settle-end","Affordance settle phase complete")},2100))}currentMode(){return this.prefs.current.alwaysShowChrome?"visible":"clean"}createPanelState(e,t,n){return{id:e,el:t,label:n,revealed:!1,reason:null,hideTimerId:null,focusActive:!1,pointerInZone:!1,pointerInPanel:!1,onFocusIn:()=>this.onPanelFocusIn(e),onFocusOut:()=>this.onPanelFocusOut(e),onPointerEnter:()=>this.onPanelPointerEnter(e),onPointerLeave:()=>this.onPanelPointerLeave(e)}}applyMode(e){if(document.documentElement.dataset.chromeMode=e,e==="visible")for(const t of this.panels.keys())this.reveal(t,"preference");else for(const t of this.panels.values())this.shouldHide(t)&&this.hide(t.id)}reveal(e,t){var r,s;const n=this.panels.get(e);n&&(n.hideTimerId!==null&&(clearTimeout(n.hideTimerId),n.hideTimerId=null),!(n.revealed&&n.reason===t)&&(n.el.classList.add("is-revealed"),n.revealed=!0,n.reason=t,this.announceToScreenReader(n,!0),(s=(r=this.options).onRevealChange)==null||s.call(r,e,!0,t),this.diag.debug("reveal","Panel revealed",{panelId:e,reason:t})))}hide(e){var n,r;const t=this.panels.get(e);t&&(t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),t.revealed&&(t.el.classList.remove("is-revealed"),t.revealed=!1,t.reason=null,this.announceToScreenReader(t,!1),(r=(n=this.options).onRevealChange)==null||r.call(n,e,!1,null),this.diag.debug("hide","Panel hidden",{panelId:e})))}scheduleHide(e,t=this.config.HIDE_DELAY_MS){const n=this.panels.get(e);n&&(n.hideTimerId!==null&&clearTimeout(n.hideTimerId),n.hideTimerId=setTimeout(()=>this.hide(e),t))}shouldHide(e){return!e.pointerInZone&&!e.pointerInPanel&&!e.focusActive}onPointerMove(e){if(this.currentMode()==="visible"||e.pointerType==="touch")return;const t=e.clientX,n=e.clientY,r=window.innerHeight;this.updateZone("info-panel",t<=this.config.INFO_PANEL_TRIGGER_BAND_PX),this.panels.has("nav-controls")&&this.updateZone("nav-controls",n>=r-this.config.NAV_TRIGGER_BAND_PX,this.config.NAV_HIDE_DELAY_MS)}onPointerDown(e){if(e.pointerType==="mouse"||this.currentMode()==="visible")return;const t=e.clientX;t>=this.config.IOS_EDGE_DEAD_ZONE_PX&&t<=this.config.INFO_PANEL_TOUCH_MAX_PX&&(this.reveal("info-panel","touch"),this.scheduleHide("info-panel",this.config.TOUCH_REVEAL_DURATION_MS))}onViewportLeave(){if(this.currentMode()!=="visible")for(const e of this.panels.keys())this.updateZone(e,!1)}onKeyDown(e){if(this.currentMode()==="visible"||((e.key==="ArrowLeft"||e.key==="ArrowRight")&&this.panels.has("nav-controls")&&(this.reveal("nav-controls","keyboard"),this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-keyboard-reveal","Nav controls revealed by keyboard",{key:e.key})),e.key!=="Escape"))return;let t=!1;for(const n of this.panels.values())n.revealed&&!n.el.contains(document.activeElement)&&(this.hide(n.id),t=!0);t&&this.diag.debug("escape-dismiss","Chrome dismissed via Escape")}onPanelFocusIn(e){const t=this.panels.get(e);t&&(t.focusActive=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),this.currentMode()==="clean"&&this.reveal(e,"focus"))}onPanelFocusOut(e){requestAnimationFrame(()=>{const t=this.panels.get(e);t&&(t.el.contains(document.activeElement)||(t.focusActive=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e)))})}onPanelPointerEnter(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null))}onPanelPointerLeave(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e))}updateZone(e,t,n){const r=this.panels.get(e);r&&t!==r.pointerInZone&&(r.pointerInZone=t,t?this.reveal(e,"proximity"):this.shouldHide(r)&&this.scheduleHide(e,n))}createPeekElements(){const e=this.makeEl("div","info-panel-chevron");this.infoPanelPeekHit=this.makeEl("div","info-panel-peek-hit",[this.makeEl("div","info-panel-peek"),e]),this.infoPanelPeekHit.setAttribute("aria-hidden","true"),this.appRoot.appendChild(this.infoPanelPeekHit),this.diag.debug("peek-affordances-created","Visual chrome affordances mounted",{infoPanel:["info-panel-peek","info-panel-chevron"]})}createSrStatusElement(){this.srStatusEl=this.makeEl("div","sr-only"),this.srStatusEl.id="freyraum-chrome-status",this.srStatusEl.setAttribute("aria-live","polite"),this.srStatusEl.setAttribute("aria-atomic","true"),this.appRoot.appendChild(this.srStatusEl)}announceToScreenReader(e,t){this.srStatusEl&&(this.srStatusEl.textContent=t?`${e.label} eingeblendet`:"")}makeEl(e,t,n=[]){const r=document.createElement(e);r.className=t;for(const s of n)r.appendChild(s);return r}}const na=Jt("audio-controls");class ty{constructor(e,t,n){x(this,"el");x(this,"muteBtn");x(this,"volumeInput");x(this,"unsubscribe");x(this,"currentState");x(this,"handleMuteClick",()=>{const{muted:e,playing:t,autoplayBlocked:n,available:r}=this.currentState;r&&(e?(this.prefs.setAudioMuted(!1),na.info("user-unmute","User unmuted audio via main-page control")):t?(this.prefs.setAudioMuted(!0),na.info("user-mute","User muted audio via main-page control")):(this.audioManager.play("user-activate"),na.info("user-activate","User activated audio via main-page control",{autoplayBlocked:n})))});x(this,"handleVolumeInput",()=>{const e=Number(this.volumeInput.value);if(Number.isNaN(e))return;const t=Math.round(e);this.volumeInput.style.setProperty("--volume-pct",`${t}%`),this.volumeInput.setAttribute("aria-valuenow",String(t)),this.volumeInput.setAttribute("aria-valuetext",`${t} Prozent`);const n=ea(e);this.prefs.setAudioVolume(n),na.debug("user-volume","User adjusted volume via main-page slider",{displayPct:e,gain:n})});this.prefs=t,this.audioManager=n,this.currentState=n.getState(),this.el=document.createElement("div"),this.el.className="audio-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Hintergrundmusik"),this.muteBtn=document.createElement("button"),this.muteBtn.type="button",this.muteBtn.className="audio-controls__btn",this.muteBtn.addEventListener("click",this.handleMuteClick);const r=document.createElement("div");r.className="audio-controls__slider-wrap",this.volumeInput=document.createElement("input"),this.volumeInput.type="range",this.volumeInput.className="audio-controls__slider",this.volumeInput.min="0",this.volumeInput.max="100",this.volumeInput.step="1",this.volumeInput.setAttribute("aria-label","Lautstärke"),this.volumeInput.addEventListener("input",this.handleVolumeInput),r.appendChild(this.volumeInput),this.el.append(this.muteBtn,r),e.appendChild(this.el),this.unsubscribe=n.subscribe(s=>this.update(s))}update(e){if(this.currentState=e,this.el.hidden=!e.available,!e.available)return;const t=e.muted,n=e.autoplayBlocked,r=e.playing;this.muteBtn.classList.toggle("audio-controls__btn--muted",t),this.muteBtn.classList.toggle("audio-controls__btn--blocked",n&&!t),this.muteBtn.classList.toggle("audio-controls__btn--playing",r&&!t);let s;n&&!t?s="Klicken zum Aktivieren der Hintergrundmusik":t?s="Ton einschalten":r?s="Ton ausschalten":s="Hintergrundmusik abspielen",this.muteBtn.setAttribute("aria-label",s),this.muteBtn.setAttribute("aria-pressed",r&&!t?"true":"false"),this.muteBtn.innerHTML=`
      <span class="audio-controls__btn-icon" aria-hidden="true">
        ${t?iy:n?ry:ny}
      </span>
      ${n&&!t?'<span class="audio-controls__indicator" aria-hidden="true"></span>':""}
    `;const a=ta(e.targetVolume);this.volumeInput.value=String(a),this.volumeInput.disabled=t,this.volumeInput.setAttribute("aria-valuenow",String(a)),this.volumeInput.setAttribute("aria-valuetext",`${a} Prozent`),this.volumeInput.style.setProperty("--volume-pct",`${a}%`)}dispose(){this.unsubscribe(),this.el.remove()}}const ny=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`,iy=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`,ry=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="15" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/>
  </svg>`,wd={"webgl-unavailable":{title:"Museum im 2D-Modus",body:"Auf diesem Gerät steht WebGL nicht zur Verfügung. Sie können die Kunstwerke weiterhin ansehen und lesen."},"renderer-initialization":{title:"Museum im 2D-Modus",body:"Die immersive 3D-Ansicht konnte nicht gestartet werden. Die Kunstwerke bleiben hier vollständig zugänglich."},startup:{title:"Vorschau konnte nicht vollständig starten",body:"Beim Laden ist ein unerwarteter Fehler aufgetreten. Dies ist nicht automatisch ein WebGL-Problem."},"preview-assets":{title:"Vorschau ist unvollständig",body:"Erforderliche lokale Vorschaudateien fehlen. Bitte erstellen Sie die Kundenvorschau erneut."}};function sy(i){return i.image||i.webglImage||""}function Ed(i,e){var c,d,u,h,f,g,v;const t=nr();i.dataset.experience="fallback",(c=i.querySelector(".fallback-screen"))==null||c.remove(),(d=i.querySelector(".loading-overlay"))==null||d.remove();const n=document.createElement("section");n.className="fallback-screen",n.setAttribute("aria-labelledby","fallback-screen-title"),(u=e.surfaceColor)!=null&&u.trim()&&(n.style.backgroundColor=e.surfaceColor.trim());const r=document.createElement("div");r.className="fallback-screen__card";const s=document.createElement("p");s.className="fallback-screen__eyebrow",s.textContent="FREYRAUM";const a=document.createElement("h1");a.id="fallback-screen-title",a.className="fallback-screen__title",a.textContent=wd[e.category].title;const o=document.createElement("p");o.className="fallback-screen__body",o.textContent=wd[e.category].body,r.append(s,a,o);const l=document.createElement("div");if(l.className="fallback-screen__actions",(h=e.artworks)!=null&&h.length){const m=document.createElement("a");m.className="fallback-screen__action",m.href="#fallback-artworks",m.textContent="In 2D fortfahren",l.appendChild(m)}if(e.onRetry){const m=document.createElement("button");m.className="fallback-screen__action",m.type="button",m.textContent="3D erneut versuchen",m.addEventListener("click",()=>{var p;m.disabled=!0,m.textContent="3D wird erneut gestartet …",(p=e.onRetry)==null||p.call(e)},{once:!0}),l.appendChild(m)}if(l.childElementCount&&r.appendChild(l),t.getMode()!=="default"){const m=document.createElement("details");m.className="fallback-screen__detail";const p=document.createElement("summary");p.textContent="Technische Details";const b=document.createElement("p");b.textContent=e.reason,m.append(p,b),r.appendChild(m)}if(n.appendChild(r),(f=e.artworks)!=null&&f.length){const m=document.createElement("section");m.id="fallback-artworks",m.className="fallback-screen__museum",m.setAttribute("aria-label","Kunstwerke");for(const p of e.artworks){const b=document.createElement("article");b.className="fallback-screen__artwork";const y=document.createElement("img");y.loading="lazy",y.decoding="async",y.alt=p.alt;const _=sy(p);y.src=_,p.webglImage&&p.webglImage!==_&&y.addEventListener("error",()=>{var S;y.src=(S=p.webglImage)!=null?S:""},{once:!0});const L=document.createElement("div"),C=document.createElement("h2");C.textContent=p.title;const T=document.createElement("p");T.className="fallback-screen__metadata",T.textContent=`${p.year} · ${p.medium}`;const U=document.createElement("p");U.textContent=p.description;const w=document.createElement("p");w.className="fallback-screen__metadata",w.textContent=p.credit,L.append(C,T,U,w),b.append(y,L),m.appendChild(b)}n.appendChild(m)}i.appendChild(n),t.info("fallback","shown","Fallback experience shown",{category:e.category,artworkCount:(v=(g=e.artworks)==null?void 0:g.length)!=null?v:0,protocol:window.location.protocol})}const Td=20,Kr=5;class ay{constructor(e,t){x(this,"diagnostics",nr());x(this,"el");x(this,"listEl");x(this,"counterEl");x(this,"prevButton");x(this,"nextButton");x(this,"artworks");x(this,"items",[]);x(this,"thumbs",[]);x(this,"virtualized");x(this,"currentIndex",0);x(this,"renderedStart",-1);x(this,"renderedEnd",-1);x(this,"onSelectCallback",null);x(this,"onPreviewCallback",null);x(this,"handleThumbKey",e=>{var r;const t=e.currentTarget,n=Number((r=t.dataset.index)!=null?r:"0");switch(e.key){case"ArrowRight":case"ArrowDown":e.preventDefault(),this.focusThumb((n+1)%this.artworks.length);break;case"ArrowLeft":case"ArrowUp":e.preventDefault(),this.focusThumb((n-1+this.artworks.length)%this.artworks.length);break;case"Home":e.preventDefault(),this.focusThumb(0);break;case"End":e.preventDefault(),this.focusThumb(this.artworks.length-1);break;case"Enter":case" ":{e.key===" "&&e.preventDefault();break}}});x(this,"onPrevPage",()=>{this.listEl.scrollBy({left:-this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});x(this,"onNextPage",()=>{this.listEl.scrollBy({left:this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});x(this,"onScroll",()=>{this.renderWindowFromScroll(),this.updateScrollState()});x(this,"onResize",()=>{this.virtualized&&this.renderWindowAround(this.currentIndex),this.updateScrollState()});this.artworks=t,this.virtualized=t.length>Td,this.el=document.createElement("nav"),this.el.className="timeline",this.el.setAttribute("aria-label","Werke der Ausstellung"),this.prevButton=this.createArrowButton("prev","Vorherige Werke anzeigen","‹"),this.nextButton=this.createArrowButton("next","Weitere Werke anzeigen","›"),this.counterEl=document.createElement("div"),this.counterEl.className="timeline__counter",this.counterEl.setAttribute("aria-live","polite");const n=document.createElement("ul");n.className="timeline__list",n.setAttribute("role","list"),this.listEl=n,this.el.append(this.prevButton,n,this.nextButton,this.counterEl),t.forEach((r,s)=>{const a=document.createElement("li");a.className="timeline__item",a.dataset.index=String(s),this.items.push(a),this.thumbs.push(null),n.appendChild(a)}),this.virtualized?(this.renderWindowAround(0),this.diagnostics.info("timeline","virtualization-enabled","Timeline virtual rendering enabled",{artworkCount:t.length,threshold:Td,buffer:Kr})):t.forEach((r,s)=>this.ensureThumb(s)),this.prevButton.addEventListener("click",this.onPrevPage),this.nextButton.addEventListener("click",this.onNextPage),this.listEl.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("resize",this.onResize,{passive:!0}),e.appendChild(this.el),this.setActive(0),this.updateScrollState(),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>this.centerThumb(0,"auto")))}createArrowButton(e,t,n){const r=document.createElement("button");return r.type="button",r.className=`timeline__arrow timeline__arrow--${e}`,r.setAttribute("aria-label",t),r.textContent=n,r}ensureThumb(e){if(e<0||e>=this.artworks.length)return null;const t=this.thumbs[e];if(t)return t;const n=this.artworks[e],r=this.items[e],s=document.createElement("button");s.type="button",s.className="timeline__thumb",s.setAttribute("aria-label",`${n.subtitle}: ${n.title}`),s.setAttribute("aria-pressed",e===this.currentIndex?"true":"false"),s.setAttribute("aria-current",e===this.currentIndex?"true":"false"),s.setAttribute("data-index",String(e)),s.tabIndex=e===this.currentIndex?0:-1;const a=n.dimensions.width/n.dimensions.height,o=document.createElement("span");o.className="timeline__frame",o.style.setProperty("--thumb-aspect",String(a.toFixed(4)));const l=document.createElement("span");l.className="timeline__skeleton",l.setAttribute("aria-hidden","true"),o.appendChild(l);const c=document.createElement("img");c.className="timeline__img",c.src=n.image,c.alt="",c.loading="lazy",c.decoding="async",c.addEventListener("load",()=>o.classList.add("is-loaded")),c.addEventListener("error",()=>o.classList.add("is-loaded","is-error")),o.appendChild(c);const d=document.createElement("span");return d.className="timeline__thumb-label",d.textContent=n.subtitle,s.append(o,d),s.addEventListener("click",()=>this.select(e)),s.addEventListener("pointerenter",()=>this.preview(e)),s.addEventListener("focus",()=>this.preview(e)),s.addEventListener("keydown",this.handleThumbKey),this.thumbs[e]=s,r.replaceChildren(s),s}unmountThumb(e){var n;if(e===this.currentIndex)return;const t=this.thumbs[e];!t||t.matches(":focus-within")||(t.removeEventListener("keydown",this.handleThumbKey),this.thumbs[e]=null,(n=this.items[e])==null||n.replaceChildren())}focusThumb(e){this.virtualized&&this.renderWindowAround(e);const t=this.ensureThumb(e);t&&(this.thumbs.forEach((n,r)=>{n&&(n.tabIndex=r===e?0:-1)}),t.focus(),this.centerThumb(e,this.preferredScrollBehavior()))}select(e){var t;(t=this.onSelectCallback)==null||t.call(this,e)}preview(e){var t;(t=this.onPreviewCallback)==null||t.call(this,e)}setActive(e){const t=this.thumbs[this.currentIndex];t&&(t.classList.remove("is-active"),t.setAttribute("aria-pressed","false"),t.setAttribute("aria-current","false")),this.currentIndex=e,this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(this.currentIndex);n&&(n.classList.add("is-active"),n.setAttribute("aria-pressed","true"),n.setAttribute("aria-current","true"),this.thumbs.forEach((r,s)=>{r&&(r.tabIndex=s===e?0:-1)}),this.centerThumb(e,this.preferredScrollBehavior())),this.updateCounter(),this.updateScrollState()}renderWindowAround(e){const t=Math.max(4,Math.ceil(this.listEl.clientWidth/this.approxThumbPitch())||4),n=Math.max(0,e-Kr),r=Math.min(this.artworks.length-1,e+t+Kr);this.renderWindow(n,r)}renderWindowFromScroll(){if(!this.virtualized)return;const e=this.approxThumbPitch(),t=Math.max(4,Math.ceil(this.listEl.clientWidth/e)||4),n=Math.max(0,Math.floor(this.listEl.scrollLeft/e)-Kr),r=Math.min(this.artworks.length-1,n+t+Kr*2);this.renderWindow(n,r)}renderWindow(e,t){if(!(e===this.renderedStart&&t===this.renderedEnd)){for(let n=e;n<=t;n+=1)this.ensureThumb(n);for(let n=0;n<this.thumbs.length;n+=1)(n<e||n>t)&&this.unmountThumb(n);this.renderedStart=e,this.renderedEnd=t}}approxThumbPitch(){const e=this.thumbs.find(Boolean);return e?e.getBoundingClientRect().width+12:162}centerThumb(e,t){this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(e);if(!n)return;const r=this.listEl.getBoundingClientRect(),s=n.getBoundingClientRect();if(r.width<=0||s.width<=0)return;const a=s.left+s.width*.5-(r.left+r.width*.5);if(Math.abs(a)<1)return;const o=this.listEl.scrollLeft+a;this.listEl.scrollTo({left:o,behavior:t}),this.diagnostics.getMode()!=="default"&&this.diagnostics.debug("timeline","center-active","Centered active timeline thumbnail",{index:e,delta:Math.round(a),targetLeft:Math.round(o),behavior:t})}updateCounter(){this.counterEl.textContent=`${this.currentIndex+1} / ${this.artworks.length}`}updateScrollState(){this.updateCounter();const e=Math.max(0,this.listEl.scrollWidth-this.listEl.clientWidth-1),t=this.listEl.scrollLeft<=1,n=this.listEl.scrollLeft>=e;this.prevButton.disabled=t,this.nextButton.disabled=n,this.el.classList.toggle("timeline--at-start",t),this.el.classList.toggle("timeline--at-end",n)}preferredScrollBehavior(){if(document.documentElement.dataset.motion==="reduced")return"auto";try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}catch(e){return"smooth"}}async prewarmUnderOverlay(){const e=[];for(let s=0;s<this.artworks.length;s+=1){const a=this.ensureThumb(s);if(!a)continue;const o=a.querySelector(".timeline__img");o&&(o.loading="eager",a.offsetWidth,a.getBoundingClientRect(),typeof o.decode=="function"&&e.push(o.decode().then(()=>"decoded").catch(()=>"failed")))}this.el.offsetHeight,this.listEl.scrollWidth,getComputedStyle(this.el).opacity;const t=await Promise.allSettled(e);let n=0,r=0;return t.forEach(s=>{s.status==="fulfilled"&&s.value==="decoded"?n+=1:r+=1}),this.updateScrollState(),this.diagnostics.info("timeline","prewarm-under-overlay","Timeline DOM and thumbnail images prebuilt under loading overlay",{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:r,virtualized:this.virtualized}),{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:r}}onSelect(e){this.onSelectCallback=e}onPreview(e){this.onPreviewCallback=e}dispose(){this.prevButton.removeEventListener("click",this.onPrevPage),this.nextButton.removeEventListener("click",this.onNextPage),this.listEl.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onResize),this.thumbs.forEach(e=>e==null?void 0:e.removeEventListener("keydown",this.handleThumbKey)),this.thumbs.length=0,this.items.length=0,this.el.remove()}}const Ad=.6;function oy(i){if(!(i instanceof HTMLElement))return!1;const e=i.tagName;return!!(e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||i.isContentEditable)}class ly{constructor(e,t){x(this,"galleryManager");x(this,"keyboardHelp");x(this,"fullscreenTarget",document.documentElement);x(this,"enabled",!0);x(this,"onEscape");x(this,"handleKeyDown",e=>{var t,n;if(!(!this.enabled||e.defaultPrevented)&&!oy(e.target)&&!(e.target instanceof HTMLElement&&e.target.closest(".timeline")&&(e.key==="ArrowLeft"||e.key==="ArrowRight")))switch(e.key){case"ArrowLeft":e.preventDefault(),this.galleryManager.navigate(-1);break;case"ArrowRight":e.preventDefault(),this.galleryManager.navigate(1);break;case"+":case"=":e.preventDefault(),this.galleryManager.addZoomDelta(-Ad);break;case"-":case"_":e.preventDefault(),this.galleryManager.addZoomDelta(Ad);break;case"0":case"r":case"R":e.preventDefault(),this.galleryManager.resetView();break;case"f":case"F":e.preventDefault(),this.toggleFullscreen();break;case"?":e.preventDefault(),(t=this.keyboardHelp)==null||t.open();break;case"Escape":if(document.fullscreenElement)break;(n=this.onEscape)==null||n.call(this);break}});this.galleryManager=e,this.keyboardHelp=t,window.addEventListener("keydown",this.handleKeyDown)}setFullscreenTarget(e){this.fullscreenTarget=e}setEnabled(e){this.enabled=e}toggleFullscreen(){document.fullscreenEnabled&&(document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.fullscreenTarget.requestFullscreen().catch(()=>{}))}dispose(){window.removeEventListener("keydown",this.handleKeyDown)}}const ia=Jt("KeyboardHelp"),cy=[["←  →","Nächstes / vorheriges Bild"],["+  −","Heran-/Herauszoomen"],["R","Ansicht zurücksetzen"],["F","Vollbild ein-/ausschalten"],["Esc","Dialog schließen"],["?","Diese Hilfe anzeigen"]];class dy{constructor(){x(this,"dialog");x(this,"opener",null);x(this,"onKeyDown",e=>{if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.close();return}e.key==="Tab"&&this.trapFocus(e)});this.dialog=this.build(),document.body.appendChild(this.dialog),ia.debug("init","KeyboardHelp component created")}build(){const e=document.createElement("div");return e.id="keyboard-help",e.className="keyboard-help",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","keyboard-help-title"),e.hidden=!0,e.innerHTML=`
      <div class="keyboard-help__panel">
        <h2 id="keyboard-help-title" class="keyboard-help__title">Tastaturkürzel</h2>
        <table class="keyboard-help__table">
          <tbody>
            ${cy.map(([t,n])=>`<tr><td><kbd class="keyboard-help__key">${t}</kbd></td><td>${n}</td></tr>`).join("")}
          </tbody>
        </table>
        <p class="keyboard-help__hint">Mausbewegung zum unteren oder linken Bildschirmrand enthüllt Zeitleiste, Navigation und Bildinformationen.</p>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`,e.querySelector(".keyboard-help__close").addEventListener("click",()=>this.close()),e.addEventListener("click",t=>{t.target===e&&this.close()}),e}open(e){var t;this.opener=e!=null?e:null,this.dialog.hidden=!1,document.addEventListener("keydown",this.onKeyDown),(t=this.dialog.querySelector(".keyboard-help__close"))==null||t.focus(),ia.debug("open","keyboard help opened")}close(){var e;this.dialog.hidden=!0,document.removeEventListener("keydown",this.onKeyDown),(e=this.opener)==null||e.focus(),this.opener=null,ia.debug("close","keyboard help closed")}trapFocus(e){const t=Array.from(this.dialog.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'));if(!t.length)return;const n=t[0],r=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),n.focus())}dispose(){document.removeEventListener("keydown",this.onKeyDown),this.dialog.remove(),ia.debug("dispose","KeyboardHelp component disposed")}}const uy=50;class hy{constructor(e,t){x(this,"canvas");x(this,"galleryManager");x(this,"diagnostics",Jt("interaction"));x(this,"usePointerEvents");x(this,"disposed",!1);x(this,"enabled",!0);x(this,"state","idle");x(this,"active",new Map);x(this,"lastPinchDist",0);x(this,"onPointerDown",e=>{if(this.enabled&&!(e.pointerType==="mouse"&&e.button!==0)){try{this.canvas.setPointerCapture(e.pointerId)}catch(t){}if(this.active.set(e.pointerId,{id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY}),this.active.size===1)this.state=this.galleryManager.canPan()?"panning":"swipe-candidate",this.diagnostics.debug("gesture-start","Pointer gesture started",{pointerType:e.pointerType,state:this.state});else if(this.active.size===2){const t=[...this.active.values()];this.lastPinchDist=Rd(t[0].lastX,t[0].lastY,t[1].lastX,t[1].lastY),this.state="pinching",this.diagnostics.debug("gesture-start","Pinch gesture started",{})}}});x(this,"onPointerMove",e=>{this.handlePointerMove(e)});x(this,"onGlobalPointerMove",e=>{e.target!==this.canvas&&this.handlePointerMove(e)});x(this,"onPointerUp",e=>{if(!this.enabled)return;const t=this.active.get(e.pointerId);this.active.delete(e.pointerId);try{this.canvas.releasePointerCapture(e.pointerId)}catch(n){}if(this.state==="pinching"&&this.active.size<2){this.state=this.galleryManager.canPan()?"panning":"swipe-candidate";return}this.state==="swipe-candidate"&&t&&this.active.size===0&&this.resolveSwipe(t,e.clientX,e.clientY),this.active.size===0&&(this.state="idle")});x(this,"onGlobalPointerUp",e=>{e.target!==this.canvas&&this.onPointerUp(e)});x(this,"onPointerCancel",e=>{this.enabled&&(this.active.delete(e.pointerId),this.active.size===0&&(this.state="idle",this.diagnostics.debug("gesture-cancel","Pointer gesture cancelled",{})))});x(this,"onGlobalPointerCancel",e=>{e.target!==this.canvas&&this.onPointerCancel(e)});x(this,"onTouchStart",e=>{if(this.enabled)if(e.cancelable&&e.preventDefault(),e.touches.length===1){const t=e.touches[0];this.active.clear(),this.active.set(0,{id:0,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY}),this.state=this.galleryManager.canPan()?"panning":"swipe-candidate"}else e.touches.length===2&&(this.state="pinching",this.lastPinchDist=this.getTouchDist(e))});x(this,"onTouchMove",e=>{if(!this.enabled)return;if(e.touches.length>=2){e.cancelable&&e.preventDefault();const a=this.getTouchDist(e),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02),this.state="pinching";return}if(e.touches.length!==1)return;const t=this.active.get(0);if(!t)return;const n=e.touches[0],r=n.clientX-t.lastX,s=n.clientY-t.lastY;t.lastX=n.clientX,t.lastY=n.clientY,this.galleryManager.canPan()&&(e.cancelable&&e.preventDefault(),this.galleryManager.setPanOffset(r*.004,-s*.004),this.state="panning")});x(this,"onGlobalTouchMove",e=>{e.target===this.canvas||this.state==="idle"||this.onTouchMove(e)});x(this,"onTouchEnd",e=>{if(this.enabled){if(this.state==="swipe-candidate"&&e.changedTouches.length>0){const t=this.active.get(0);t&&this.resolveSwipe(t,e.changedTouches[0].clientX,e.changedTouches[0].clientY)}e.touches.length===0&&(this.active.clear(),this.state="idle")}});x(this,"onWheel",e=>{this.enabled&&this.galleryManager.addZoomDelta(e.deltaY*.0045)});x(this,"onLegacyMouseMove",e=>{this.enabled&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY)});this.canvas=e,this.galleryManager=t,this.usePointerEvents=typeof window.PointerEvent=="function",this.usePointerEvents?(this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointercancel",this.onPointerCancel),this.canvas.addEventListener("lostpointercapture",this.onPointerCancel),window.addEventListener("pointermove",this.onGlobalPointerMove,{passive:!0}),window.addEventListener("pointerup",this.onGlobalPointerUp,{passive:!0}),window.addEventListener("pointercancel",this.onGlobalPointerCancel,{passive:!0})):(this.canvas.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.onTouchEnd,{passive:!0}),this.canvas.addEventListener("touchcancel",this.onTouchEnd,{passive:!0}),window.addEventListener("mousemove",this.onLegacyMouseMove,{passive:!0}),window.addEventListener("touchmove",this.onGlobalTouchMove,{passive:!1})),this.canvas.addEventListener("wheel",this.onWheel,{passive:!0}),this.diagnostics.info("init","Canvas interaction initialised",{backend:this.usePointerEvents?"pointer-events":"touch-events-fallback"})}handlePointerMove(e){if(!this.enabled)return;const t=this.active.get(e.pointerId);if(!t){e.pointerType==="mouse"&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY);return}const n=e.clientX-t.lastX,r=e.clientY-t.lastY;if(t.lastX=e.clientX,t.lastY=e.clientY,this.state==="pinching"&&this.active.size===2){const s=[...this.active.values()],a=Rd(s[0].lastX,s[0].lastY,s[1].lastX,s[1].lastY),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02);return}this.active.size===1&&this.galleryManager.canPan()&&(this.state="panning",this.galleryManager.setPanOffset(n*.004,-r*.004))}getTouchDist(e){const t=e.touches[0].clientX-e.touches[1].clientX,n=e.touches[0].clientY-e.touches[1].clientY;return Math.sqrt(t*t+n*n)}updateHoverRotation(e,t){if(document.documentElement.dataset.pointerPrimary==="coarse")return;const n=e/window.innerWidth*2-1,r=t/window.innerHeight*2-1,s=this.galleryManager.getHoverRotationScale();this.galleryManager.setHoverTarget(n*s.x,r*s.y)}resolveSwipe(e,t,n){const r=t-e.startX,s=n-e.startY;Math.abs(r)>Math.abs(s)&&Math.abs(r)>uy&&(this.galleryManager.navigate(r<0?1:-1),this.diagnostics.debug("swipe","Swipe resolved",{direction:r<0?"next":"prev"}))}setEnabled(e){this.enabled!==e&&(this.enabled=e,e||(this.active.clear(),this.state="idle",this.galleryManager.setHoverTarget(0,0)))}dispose(){this.disposed||(this.disposed=!0,this.usePointerEvents?(this.canvas.removeEventListener("pointerdown",this.onPointerDown),this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas.removeEventListener("pointerup",this.onPointerUp),this.canvas.removeEventListener("pointercancel",this.onPointerCancel),this.canvas.removeEventListener("lostpointercapture",this.onPointerCancel),window.removeEventListener("pointermove",this.onGlobalPointerMove),window.removeEventListener("pointerup",this.onGlobalPointerUp),window.removeEventListener("pointercancel",this.onGlobalPointerCancel)):(this.canvas.removeEventListener("touchstart",this.onTouchStart),this.canvas.removeEventListener("touchmove",this.onTouchMove),this.canvas.removeEventListener("touchend",this.onTouchEnd),this.canvas.removeEventListener("touchcancel",this.onTouchEnd),window.removeEventListener("mousemove",this.onLegacyMouseMove),window.removeEventListener("touchmove",this.onGlobalTouchMove)),this.canvas.removeEventListener("wheel",this.onWheel),this.active.clear())}}function Rd(i,e,t,n){const r=t-i,s=n-e;return Math.sqrt(r*r+s*s)}const je=1e-6,Cd=.022,fy=.002,Z=(i,e)=>({x:i,y:e}),qe=(i,e,t)=>({x:i,y:e,z:t});function tt(i){return{x:i.x,y:i.y}}function fn(i){return i.map(tt)}function Qr(i){let e=0;for(let t=0;t<i.length;t+=1){const n=i[t],r=i[(t+1)%i.length];e+=n.x*r.y-r.x*n.y}return e/2}function Pd(i){return Qr(i)>0}function ra(i){return Pd(i)?i:[i[0],i[3],i[2],i[1]]}function ur(i){let e=0;for(let t=0;t<i.length;t+=1){const n=i[t],r=i[(t+1)%i.length],s=i[(t+2)%i.length],a=(r.x-n.x)*(s.y-r.y)-(r.y-n.y)*(s.x-r.x),o=Math.sign(a);if(o!==0){if(e!==0&&o!==e)return!1;e=o}}return e!==0}function Jr(i,e=je){return Math.abs(Qr(i))<=e}function sa(i,e){return Math.hypot(e.x-i.x,e.y-i.y)}function Id(i){return Math.min(sa(i[0],i[1]),sa(i[1],i[2]),sa(i[2],i[3]),sa(i[3],i[0]))}function gi(i,e){let t=!1;for(let n=0,r=e.length-1;n<e.length;r=n,n+=1){const s=e[n],a=e[r],o=a.y-s.y,l=Math.abs(o)<=je?o<0?-je:je:o;s.y>i.y!=a.y>i.y&&i.x<(a.x-s.x)*(i.y-s.y)/l+s.x&&(t=!t)}return t}function Ld(i,e){let t=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY;for(const r of i){const s=r.x*e.x+r.y*e.y;s<t&&(t=s),s>n&&(n=s)}return{min:t,max:n}}function Do(i,e){const t=[i,e];for(const n of t)for(let r=0;r<n.length;r+=1){const s=n[r],a=n[(r+1)%n.length],o=Z(a.x-s.x,a.y-s.y),l=Z(-o.y,o.x),c=Ld(i,l),d=Ld(e,l);if(c.max<d.min||d.max<c.min)return!1}return!0}function No(i,e){const t=i.reduce((n,r)=>Z(n.x+r.x,n.y+r.y),Z(0,0));return t.x/=i.length,t.y/=i.length,i.map(n=>Z(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e))}function hr(i){const e=ra(i);if(Jr(e)||!ur(e))return null;const[t,n,r,s]=e,a=n.x-r.x,o=n.y-r.y,l=s.x-r.x,c=s.y-r.y,d=t.x-n.x+r.x-s.x,u=t.y-n.y+r.y-s.y,h=a*c-l*o;if(Math.abs(h)<=je)return null;const f=(d*c-l*u)/h,g=(a*u-d*o)/h,v=n.x-t.x+f*n.x,m=s.x-t.x+g*s.x,p=t.x,b=n.y-t.y+f*n.y,y=s.y-t.y+g*s.y,_=t.y;return[v,m,p,b,y,_,f,g,1]}function aa(i){const[e,t,n,r,s,a,o,l,c]=i,d=s*c-a*l,u=-(r*c-a*o),h=r*l-s*o,f=-(t*c-n*l),g=e*c-n*o,v=-(e*l-t*o),m=t*a-n*s,p=-(e*a-n*r),b=e*s-t*r,y=e*d+t*u+n*h;if(Math.abs(y)<=je)return null;const _=1/y;return[d*_,f*_,m*_,u*_,g*_,p*_,h*_,v*_,b*_]}function Ud(i,e){return[i[0]*e[0]+i[1]*e[3]+i[2]*e[6],i[0]*e[1]+i[1]*e[4]+i[2]*e[7],i[0]*e[2]+i[1]*e[5]+i[2]*e[8],i[3]*e[0]+i[4]*e[3]+i[5]*e[6],i[3]*e[1]+i[4]*e[4]+i[5]*e[7],i[3]*e[2]+i[4]*e[5]+i[5]*e[8],i[6]*e[0]+i[7]*e[3]+i[8]*e[6],i[6]*e[1]+i[7]*e[4]+i[8]*e[7],i[6]*e[2]+i[7]*e[5]+i[8]*e[8]]}function vi(i,e,t){const[n,r,s,a,o,l,c,d,u]=i,h=c*e+d*t+u;return Math.abs(h)<=je?null:Z((n*e+r*t+s)/h,(a*e+o*t+l)/h)}function kd(i,e,t){const n=Math.max(1,e),r=Math.max(1,t);return[i[0]/n,i[1]/r,i[2],i[3]/n,i[4]/r,i[5],i[6]/n,i[7]/r,i[8]]}function Dd(i){return`matrix3d(${i[0]}, ${i[3]}, 0, ${i[6]}, ${i[1]}, ${i[4]}, 0, ${i[7]}, 0, 0, 1, 0, ${i[2]}, ${i[5]}, 0, ${i[8]})`}function oa(i,e){const t=hr(i.quad);if(!t)return null;const n=aa(t);return n?vi(n,e.x,e.y):null}function Nd(i){const e=i.map(o=>o.x),t=i.map(o=>o.y),n=Math.min(...e),r=Math.max(...e),s=Math.min(...t),a=Math.max(...t);return{minX:n,minY:s,maxX:r,maxY:a,width:r-n,height:a-s}}function fr(i,e){return qe(i.x-e.x,i.y-e.y,i.z-e.z)}function Nn(i,e){return qe(i.x+e.x,i.y+e.y,i.z+e.z)}function yi(i,e){return qe(i.x*e,i.y*e,i.z*e)}function la(i,e){return i.x*e.x+i.y*e.y+i.z*e.z}function ca(i,e){return qe(i.y*e.z-i.z*e.y,i.z*e.x-i.x*e.z,i.x*e.y-i.y*e.x)}function Fn(i){const e=Math.hypot(i.x,i.y,i.z);return Number.isFinite(e)&&e>je?yi(i,1/e):null}function Fd(i){const e=Fn(fr(i.target,i.position)),t=qe(0,1,0),n=e?Fn(ca(e,t)):null,r=n&&e?Fn(ca(n,e)):null;return!e||!n||!r?null:{right:n,up:r,forward:e}}function py(i,e){if(!Number.isFinite(i.verticalFovDeg)||i.verticalFovDeg<=1||i.verticalFovDeg>=179||e.width<=0||e.height<=0)return null;const t=Math.tan(i.verticalFovDeg*Math.PI/360);if(!Number.isFinite(t)||t<=je)return null;const n=e.height/(2*t);return[n,0,e.width/2,0,-n,e.height/2,0,0,1]}function Fo(i,e){const t=Fd(i);return t?qe(t.right.x*e.x+t.up.x*e.y+t.forward.x*e.z,t.right.y*e.x+t.up.y*e.y+t.forward.y*e.z,t.right.z*e.x+t.up.z*e.y+t.forward.z*e.z):null}function Oo(i){return Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z)}function es(i,e){return Nn(Nn(i.origin,yi(i.axisU,e.x)),yi(i.axisV,e.y))}function Bo(i){return Fn(ca(i.axisU,i.axisV))}function Od(i,e,t,n,r){const s=yi(e,n/2),a=yi(t,r/2);return[Nn(fr(i,s),a),Nn(Nn(i,s),a),fr(Nn(i,s),a),fr(fr(i,s),a)]}function Bd(i,e,t,n,r=fy,s=Cd){const a=Fn(i.axisU),o=Fn(i.axisV);if(!a||!o||Math.abs(la(a,o))>1e-5||!Number.isFinite(t)||t<=je||!Number.isFinite(n)||n<=je||!Number.isFinite(r)||r<0||!Number.isFinite(s)||s<=je)return null;const l=Fn(ca(a,o));if(!l)return null;const c=t*n,d=es(i,e),u=Nn(d,yi(l,r)),h=Nn(u,yi(l,s));return{basisU:a,basisV:o,basisN:l,wallCenter:d,backCenter:u,frontCenter:h,width:c,height:t,depth:s,mountingGap:r,backQuad:Od(u,a,o,c,t),frontQuad:Od(h,a,o,c,t)}}function my(i){return[Z(0,i.height),Z(i.width,i.height),Z(i.width,0),Z(0,0)]}function pr(i,e,t){var g,v,m,p;if(!Oo(i.position)||!Oo(i.target)||!Oo(e)||!Number.isFinite(i.verticalFovDeg)||!Number.isFinite(i.near)||i.far!==void 0&&(!Number.isFinite(i.far)||i.far<=i.near)||i.verticalFovDeg<=1||i.verticalFovDeg>=179||i.near<=0||t.width<=0||t.height<=0)return null;const n=Fd(i);if(!n)return null;const r=fr(e,i.position),s=la(r,n.right),a=la(r,n.up),o=la(r,n.forward);if(!Number.isFinite(s)||!Number.isFinite(a)||!Number.isFinite(o)||o<=i.near||i.far!==void 0&&o>=i.far)return null;const l=Math.tan(i.verticalFovDeg*Math.PI/360),c=t.width/t.height;if(!Number.isFinite(l)||l<=je||!Number.isFinite(c)||c<=je)return null;const d=s/(o*l*c),u=a/(o*l);if(!Number.isFinite(d)||!Number.isFinite(u))return null;const h=(v=(g=i.lensShift)==null?void 0:g.x)!=null?v:0,f=(p=(m=i.lensShift)==null?void 0:m.y)!=null?p:0;return Z((d+1)*t.width/2+h*t.width,(1-u)*t.height/2+f*t.height)}function zd(i,e,t,n){return pr(e,es(i,t),n)}function Hd(i,e,t){const n=my(i).map(s=>zd(i,e,s,t));if(n.some(s=>s===null))return null;const r=[n[0],n[1],n[2],n[3]];return Jr(r)||!ur(r)?null:ra(r)}function zo(i,e,t,n){const r=t.map(s=>zd(i,e,s,n));return r.some(s=>s===null)?null:r}function Gd(i,e,t){return i.doorwayExclusions.map(n=>zo(i,e,n,t)).filter(n=>n!==null)}function Vd(i,e){if(!i||!e||i.length!==e.length||i.length===0)return{max:null,mean:null};const t=i.map((n,r)=>Math.hypot(n.x-e[r].x,n.y-e[r].y));return{max:Math.max(...t),mean:t.reduce((n,r)=>n+r,0)/t.length}}function Wd(i,e=.02){const t=i[1].x-i[0].x,n=Math.abs(t)<=je?0:(i[1].y-i[0].y)/t;return Math.abs(n)<=e?"flat":n>0?"left":"right"}function Xd(i,e,t,n,r,s,a=36){var b,y,_,L;const o=Vd(t,e),l=Vd(r,n),c=Math.hypot(i.axisU.x,i.axisU.y,i.axisU.z),d=Math.hypot(i.axisV.x,i.axisV.y,i.axisV.z),u=c>je&&d>je?(i.axisU.x*i.axisV.x+i.axisU.y*i.axisV.y+i.axisU.z*i.axisV.z)/(c*d):Number.POSITIVE_INFINITY,h=e[1].x-e[0].x,f=Math.abs(h)<=je?0:(e[1].y-e[0].y)/h,g=Wd(e),v=g===s,m=Qr(e)>je,p=m&&v&&Math.abs(c-1)<=.08&&Math.abs(d-1)<=.08&&Math.abs(u)<=.08&&((b=o.max)!=null?b:Number.POSITIVE_INFINITY)<=a&&((y=l.max)!=null?y:0)<=a;return{referenceResidualMaxPx:(_=o.max)!=null?_:Number.POSITIVE_INFINITY,referenceResidualMeanPx:(L=o.mean)!=null?L:Number.POSITIVE_INFINITY,safeResidualMaxPx:l.max,safeResidualMeanPx:l.mean,axisULength:c,axisVLength:d,axisDot:u,expectedConvergence:s,projectedConvergence:g,convergenceSlope:f,convergenceMatchesExpected:v,windingClockwise:m,thresholdPx:a,passes:p}}function gy(i,e,t,n,r,s,a=36){const o=hr(e),l=py(n,r);if(!o||!l)return null;const c=aa(l);if(!c)return null;const d=(N,F)=>{const W=[1/Math.max(je,N),0,0,0,-1/Math.max(je,F),1,0,0,1],V=Ud(o,W),J=Ud(c,V),X=qe(J[0],J[3],J[6]),oe=qe(J[1],J[4],J[7]),he=qe(J[2],J[5],J[8]),Me=Math.hypot(X.x,X.y,X.z),ee=Math.hypot(oe.x,oe.y,oe.z);return Me<=je||ee<=je?null:{homography:V,basis1:X,basis2:oe,origin:he,norm1:Me,norm2:ee}},u=d(i.width,i.height);if(!u)return null;const h=i.width*u.norm1,f=i.height*u.norm2,g=d(h,f);if(!g)return null;const v=qe(g.origin.x,g.origin.y,g.origin.z),m=Fn(g.basis1),p=Fn(g.basis2),b=Fo(n,v),y=m?Fo(n,m):null,_=p?Fo(n,p):null;if(!b||!y||!_)return null;const L=h/i.width,C=f/i.height,T=N=>Z(N.x*L,N.y*C),U=t&&t.length>=3?(()=>{const N=aa(g.homography);if(!N)return i.safePolygon.map(T);const F=t.map(W=>vi(N,W.x,W.y)).filter(W=>W!==null);return F.length===t.length?F:i.safePolygon.map(T)})():i.safePolygon.map(T),w={origin:Nn(n.position,b),axisU:y,axisV:_,width:h,height:f,safePolygon:U,doorwayExclusions:i.doorwayExclusions.map(N=>N.map(T)),hangingBand:{minY:i.hangingBand.minY*C,maxY:i.hangingBand.maxY*C,margin:i.hangingBand.margin*C}},S=Hd(w,n,r);if(!S)return null;const P=zo(w,n,w.safePolygon,r),G=Xd(w,S,e,P,t,s,a);return{room:w,scaleX:L,scaleY:C,projectedQuad:S,projectedSafePolygon:P,realism:G}}function $d(i){return{minX:Math.min(...i.map(e=>e.x)),maxX:Math.max(...i.map(e=>e.x)),minY:Math.min(...i.map(e=>e.y)),maxY:Math.max(...i.map(e=>e.y))}}function vy(i,e,t){const n=e/2,r=t/2;return[Z(i.x-n,i.y+r),Z(i.x+n,i.y+r),Z(i.x+n,i.y-r),Z(i.x-n,i.y-r)]}function Ho(i,e,t,n){const r=$d(i.safePolygon),s=Math.max(je,n),a=Math.max(je,r.maxX-r.minX),o=Math.max(je,i.hangingBand.maxY-i.hangingBand.minY-i.hangingBand.margin*2),l=Math.max(je,Math.min(t,o,a/s)),c=(T,U)=>{const w=vy(T,U*s,U),S=[...w,T].every(V=>Number.isFinite(V.x)&&Number.isFinite(V.y)),P=w.every(V=>gi(V,i.safePolygon)),G=i.doorwayExclusions.every(V=>!Do(w,V)),N=w.every(V=>V.y>=i.hangingBand.minY+i.hangingBand.margin-je&&V.y<=i.hangingBand.maxY-i.hangingBand.margin+je),F=ur(w)&&Math.abs(Qr(w))>je;return{anchor:T,mountedHeight:U,localQuad:w,validity:{finite:S,contained:P,doorwayClear:G,inHangingBand:N,orientationConsistent:F},moved:!1,scaleFactor:1,candidateCount:1,adjustmentReason:"none",rejectionReason:S?F?P?G?N?"none":"outside-hanging-band":"doorway-overlap":"outside-safe-region":"degenerate-local-quad":"non-finite"}},d=[1,.97,.94,.91,.88,.85,.82,.79,.76,.73,.7,.67,.64,.61,.58,.55],u=i.doorwayExclusions.map(T=>$d(T)),h=T=>Math.round(T*1e4)/1e4,f=(T,U,w,S)=>{if(!Number.isFinite(U))return;const P=Math.min(S,Math.max(w,U));T.some(G=>Math.abs(G-P)<=1e-4)||T.push(h(P))},g=c(Z(e.x,e.y),l);let v=g,m=null,p=Number.POSITIVE_INFINITY,b=0;for(const T of d){const U=Math.max(je,l*T),w=U*s/2,S=U/2,P=r.minX+w,G=r.maxX-w,N=i.hangingBand.minY+i.hangingBand.margin+S,F=i.hangingBand.maxY-i.hangingBand.margin-S;if(P>G||N>F)continue;const W=[],V=[],J=Math.min(G,Math.max(P,e.x)),X=Math.min(F,Math.max(N,e.y));f(W,J,P,G),f(W,P,P,G),f(W,G,P,G),f(V,X,N,F),f(V,N,N,F),f(V,F,N,F);for(const he of i.safePolygon)f(W,he.x,P,G),f(V,he.y,N,F);const oe=Math.max(.01,i.hangingBand.margin*.5);for(const he of u)f(W,he.minX-w-oe,P,G),f(W,he.maxX+w+oe,P,G),f(V,he.maxY+S+oe,N,F),f(V,he.minY-S-oe,N,F);for(const he of V)for(const Me of W){b+=1;const ee=c(Z(Me,he),U);if(ee.scaleFactor=T,ee.candidateCount=b,v=ee,!ee.validity.finite||!ee.validity.contained||!ee.validity.doorwayClear||!ee.validity.inHangingBand||!ee.validity.orientationConsistent)continue;const Ve=Math.hypot(ee.anchor.x-e.x,ee.anchor.y-e.y),K=Math.abs(l-U)/Math.max(l,je),de=Ve+K*.75;de<p-1e-6&&(p=de,m=ee)}if(m)break}const y=m!=null?m:v,_=Math.abs(y.anchor.x-e.x)>1e-6||Math.abs(y.anchor.y-e.y)>1e-6,L=Math.abs(y.mountedHeight-t)>1e-6;y.moved=_,y.candidateCount=Math.max(b,1),y.scaleFactor=Math.max(je,y.mountedHeight/Math.max(t,je));const C=!g.validity.doorwayClear;return y.adjustmentReason=m?_&&L?"shifted-and-shrunk":_?C?"shifted-away-from-doorway":"clamped-safe-region":L?"shrunk-to-fit":"none":"rejected",m?(y.rejectionReason="none",y):(y.rejectionReason=y.rejectionReason==="none"?"no-valid-candidate":y.rejectionReason,y)}function da(i,e,t,n){if(i.room&&i.camera&&e.anchor){const b=Ho(i.room,e.anchor,e.mountedHeight,t);if(!b.validity.finite||!b.validity.contained||!b.validity.doorwayClear||!b.validity.inHangingBand||!b.validity.orientationConsistent||i.projectionRealism&&!i.projectionRealism.passes)return null;const y=Bd(i.room,b.anchor,b.mountedHeight,t,e.mountingGap);if(!y)return null;const _=y.frontQuad.map(P=>pr(i.camera,P,n));if(_.some(P=>P===null))return null;const L=y.frontQuad,C=ra([_[0],_[1],_[2],_[3]]);if(Jr(C)||!ur(C)||i.safePolygon&&!C.every(P=>gi(P,i.safePolygon)))return null;const T=Math.max(1,b.mountedHeight/i.room.height*n.height),U=Math.max(1,T*Math.max(je,t)),w=hr(C);if(!w)return null;const S=kd(w,U,T);return{localQuad:b.localQuad,worldQuad:L,projectedQuad:C,bounds:Nd(C),sourceWidth:U,sourceHeight:T,cssMatrix3d:Dd(S),shortEdge:Id(C),placement:b,projectedAnchor:pr(i.camera,y.frontCenter,n),validity:b.validity,realism:i.projectionRealism}}const r=Math.max(je,t),s=Math.max(je,Math.min(1,i.planeAspect/r)),a=Math.max(je,Math.min(e.mountedHeight,s)),l=a*r/Math.max(je,i.planeAspect)/2,c=a/2,d=[Z(e.center.x-l,e.center.y-c),Z(e.center.x+l,e.center.y-c),Z(e.center.x+l,e.center.y+c),Z(e.center.x-l,e.center.y+c)],u=hr(i.quad);if(!u)return null;const h=d.map(b=>vi(u,b.x,b.y));if(h.some(b=>b===null))return null;const f=ra([h[0],h[1],h[2],h[3]]),g=Math.max(1,a*n.height),v=Math.max(1,g*t),m=hr(f);if(!m)return null;const p=kd(m,v,g);return{localQuad:d,projectedQuad:f,bounds:Nd(f),sourceWidth:v,sourceHeight:g,cssMatrix3d:Dd(p),shortEdge:Id(f),placement:null}}const yy=new Set(["Backgrounds/museum-target.png"]);function xy(i){return i.trim().replace(/^[./]+/,"").replace(/^backgrounds\//i,"Backgrounds/")}function _y(i,e,t){return t||!i||!e||i===e?null:e}function Go(i){return i===404}function Vo(i){return i.trim()?yy.has(xy(i)):!1}const ua=6,Sn={width:1366,height:768},Wo=Sn.width/Sn.height,mr="Backgrounds/museum-empty.png",Yd="#C7CED4",by=1500,ha=72,fa={position:qe(0,1.72,9),target:qe(0,2.05,-1.2),verticalFovDeg:48,near:.1,far:40,lensShift:Z(0,0)},xi=9,Mn=12,en=5.2,jn=2.3;function Xo(i,e,t,n,r=[]){return{origin:i,axisU:e,axisV:qe(0,1,0),width:t,height:n,safePolygon:[Z(.14,.14),Z(t-.14,.14),Z(t-.14,n-.14),Z(.14,n-.14)],doorwayExclusions:r,hangingBand:{minY:.42,maxY:n-.28,margin:.08}}}function pa(i,e,t,n){return{origin:i,axisU:e,axisV:qe(0,1,0),width:t,height:n}}const Sy=[{id:"wall-front",group:"front",planeAspect:xi/en,quad:[Z(417.26,206.29),Z(948.74,206.29),Z(951.84,514.71),Z(414.16,514.71)],safePolygon:[Z(422.61,506.32),Z(943.39,506.32),Z(940.55,214.5),Z(425.45,214.5)],drawableRegion:[Z(.14,.14),Z(8.86,.14),Z(8.86,4.92),Z(.14,4.92)],transform:pa(qe(-4.5,0,-5.5),qe(1,0,0),xi,en),hangingBand:{minY:.42,maxY:3.4,margin:.08},shadowVector:Z(0,14),room:Xo(qe(-4.5,0,-5.5),qe(1,0,0),xi,en)},{id:"wall-right",group:"right",planeAspect:Mn/en,quad:[Z(948.74,206.29),Z(2169.34,-738.13),Z(2271.63,1019.43),Z(951.84,514.71)],safePolygon:[Z(954.38,507.24),Z(2182.95,938.83),Z(2096.06,-637.45),Z(951.4,212.59)],drawableRegion:[Z(.14,.14),Z(11.86,.14),Z(11.86,4.92),Z(.14,4.92)],exclusionPolygons:[[Z(8,0),Z(9.05,0),Z(9.05,jn),Z(8,jn)]],transform:pa(qe(4.5,0,-5.5),qe(0,0,1),Mn,en),hangingBand:{minY:.42,maxY:3.4,margin:.08},shadowVector:Z(8,14),room:Xo(qe(4.5,0,-5.5),qe(0,0,1),Mn,en,[[Z(8,0),Z(9.05,0),Z(9.05,jn),Z(8,jn)]])},{id:"wall-rear",group:"rear",role:"bounds-only",planeAspect:xi/en,transform:pa(qe(4.5,0,6.5),qe(-1,0,0),xi,en)},{id:"wall-left",group:"left",planeAspect:Mn/en,quad:[Z(-803.34,-738.13),Z(417.26,206.29),Z(414.16,514.71),Z(-905.63,1019.43)],safePolygon:[Z(-816.95,938.83),Z(411.62,507.24),Z(414.6,212.59),Z(-730.06,-637.45)],drawableRegion:[Z(.14,.14),Z(11.86,.14),Z(11.86,4.92),Z(.14,4.92)],exclusionPolygons:[[Z(2.95,0),Z(4,0),Z(4,jn),Z(2.95,jn)]],transform:pa(qe(-4.5,0,6.5),qe(0,0,-1),Mn,en),hangingBand:{minY:.42,maxY:3.4,margin:.08},shadowVector:Z(-8,14),room:Xo(qe(-4.5,0,6.5),qe(0,0,-1),Mn,en,[[Z(2.95,0),Z(4,0),Z(4,jn),Z(2.95,jn)]])}],My=1.9,ma=.002,qd=.5;function gr(i,e,t,n){const r=My,s=ma;return{wallId:i,horizontalPosition:e,centerHeight:r,physicalHeight:n,mountingGap:s,center:Z(e,1-r/en),anchor:Z(e*t,r),uv:Z(e,r/en),mountedHeight:n,targetSizePolicy:"fixed-height",minScale:1,maxScale:1,zOffset:s+.022}}const $o=[{suffix:"wall-front.a",wallId:"wall-front",intendedUse:"portrait",placement:gr("wall-front",.28,xi,2.25)},{suffix:"wall-front.b",wallId:"wall-front",intendedUse:"panoramic",placement:gr("wall-front",.72,xi,2.05)},{suffix:"wall-left.a",wallId:"wall-left",intendedUse:"landscape",placement:gr("wall-left",.84,Mn,2)},{suffix:"wall-left.b",wallId:"wall-left",intendedUse:"square",placement:gr("wall-left",.585,Mn,1.75)},{suffix:"wall-right.a",wallId:"wall-right",intendedUse:"landscape",placement:gr("wall-right",.16,Mn,2)},{suffix:"wall-right.b",wallId:"wall-right",intendedUse:"square",placement:gr("wall-right",.415,Mn,1.75)}],wy=new Map($o.map(i=>[i.suffix,i.wallId])),Ey={"room-01.wall-front.a":"quiet-coastline","room-01.wall-front.b":"golden-desert","room-01.wall-left.a":"electric-storm","room-01.wall-left.b":"tokyo-passage"},ot=i=>Math.min(1,Math.max(0,i)),Zd=i=>typeof i=="string"&&/^#[0-9a-fA-F]{6}$/.test(i.trim()),jd=i=>`room-${String(i+1).padStart(2,"0")}`;function Kd(i){return i<.9?"portrait":i<=1.15?"square":i<1.9?"landscape":"panoramic"}function Yo(){return{galleryWall:Yd,museumWall:Yd}}function ga(){return{verticalBand:{minY:.42,maxY:3.12},sideMargin:.14,doorwayClearance:.35}}function Ty(i){return Wd(i,.01)}function Qd(i){const e=Number.isFinite(i.width)?Math.max(640,Math.min(4096,i.width)):Sn.width,t=Number.isFinite(i.height)?Math.max(360,Math.min(4096,i.height)):Sn.height;return{width:e,height:t}}function qo(i){return[tt(i[0]),tt(i[1]),tt(i[2]),tt(i[3])]}function yt(i){return qe(i.x,i.y,i.z)}function va(i){return{origin:yt(i.origin),axisU:yt(i.axisU),axisV:yt(i.axisV),width:i.width,height:i.height}}function Zo(i){return{origin:yt(i.origin),axisU:yt(i.axisU),axisV:yt(i.axisV),width:i.width,height:i.height,safePolygon:fn(i.safePolygon),doorwayExclusions:i.doorwayExclusions.map(e=>fn(e)),hangingBand:{...i.hangingBand}}}function ts(i){return{position:yt(i.position),target:yt(i.target),verticalFovDeg:i.verticalFovDeg,near:i.near,far:i.far,lensShift:i.lensShift?tt(i.lensShift):void 0}}function Ay(i){var t,n;const e=i.quad?qo(i.quad):[Z(0,0),Z(1,0),Z(1,1),Z(0,1)];return{id:i.id,planeAspect:i.planeAspect,quad:e,safePolygon:(n=(t=i.drawableRegion)!=null?t:i.safePolygon)!=null?n:fn(No(e,.92)),shadowVector:i.shadowVector,room:i.room}}function ns(){return Sy.map(i=>{var e;return{...i,quad:i.quad?qo(i.quad):void 0,safePolygon:i.safePolygon?fn(i.safePolygon):void 0,drawableRegion:i.drawableRegion?fn(i.drawableRegion):void 0,exclusionPolygons:(e=i.exclusionPolygons)==null?void 0:e.map(t=>fn(t)),transform:i.transform?va(i.transform):void 0,hangingBand:i.hangingBand?{...i.hangingBand}:void 0,shadowVector:i.shadowVector?tt(i.shadowVector):void 0,room:i.room?Zo(i.room):void 0}})}function Jd(i){const e=[];for(const n of i){const r=n.transform;r&&e.push(yt(r.origin))}const t=[...i].reverse().find(n=>n.transform);return t!=null&&t.transform&&e.push(qe(t.transform.origin.x+t.transform.axisU.x*t.transform.width,t.transform.origin.y+t.transform.axisU.y*t.transform.width,t.transform.origin.z+t.transform.axisU.z*t.transform.width)),e.length>=3?e:[qe(-3.5,0,-2.5),qe(3.5,0,-2.5),qe(3.5,0,4.5),qe(-3.5,0,4.5)]}function eu(i,e){const t=i.flatMap(o=>{const l=o.transform;return l?[l.origin,qe(l.origin.x+l.axisU.x*l.width,l.origin.y+l.axisU.y*l.width+l.axisV.y*l.height,l.origin.z+l.axisU.z*l.width+l.axisV.z*l.height)]:[]}),n=[...e,...t],r=n.map(o=>o.x),s=n.map(o=>o.y),a=n.map(o=>o.z);return{min:qe(Math.min(...r),Math.min(...s),Math.min(...a)),max:qe(Math.max(...r),Math.max(...s),Math.max(...a))}}function ya(i){const e=Jd(i),t=eu(i,e);return{floorOutline:e,bounds:t,floorY:t.min.y,ceilingY:t.max.y,wallThickness:.08}}function jo(i){return $o.map(e=>({id:`${jd(i)}.${e.suffix}`,enabled:!0,selectable:!0,placement:{wallId:e.wallId,center:tt(e.placement.center),mountedHeight:e.placement.mountedHeight,anchor:e.placement.anchor?tt(e.placement.anchor):void 0,uv:e.placement.uv?tt(e.placement.uv):void 0,horizontalPosition:e.placement.horizontalPosition,centerHeight:e.placement.centerHeight,physicalHeight:e.placement.physicalHeight,mountingGap:e.placement.mountingGap,targetSizePolicy:e.placement.targetSizePolicy,minScale:e.placement.minScale,maxScale:e.placement.maxScale,zOffset:e.placement.zOffset,provisional:!1}}))}function xa(i){return i.dimensions.height>0?i.dimensions.width/i.dimensions.height:1}function Ko(i,e){return i.horizontalPosition!==void 0&&i.centerHeight!==void 0&&(e!=null&&e.room)?Z(ot(i.horizontalPosition),ot(i.centerHeight/Math.max(.001,e.room.height))):i.uv?tt(i.uv):i.anchor&&(e!=null&&e.room)?Z(ot(i.anchor.x/Math.max(.001,e.room.width)),ot(i.anchor.y/Math.max(.001,e.room.height))):Z(ot(i.center.x),ot(1-i.center.y))}function Ry(i,e){if(i.horizontalPosition!==void 0&&i.centerHeight!==void 0&&(e!=null&&e.room))return Z(ot(i.horizontalPosition)*e.room.width,i.centerHeight);if(i.anchor)return tt(i.anchor);const t=Ko(i,e);if(!(!t||!(e!=null&&e.room)))return Z(t.x*e.room.width,t.y*e.room.height)}function Cy(i){const e=i.reduce((t,n)=>Z(t.x+n.x,t.y+n.y),Z(0,0));return Z(e.x/Math.max(1,i.length),e.y/Math.max(1,i.length))}function Py(i,e,t){const n=Math.max(0,e.findIndex(r=>r.id===i));return[...e].sort((r,s)=>{const a=r.id===i?-1:0,o=s.id===i?-1:0;if(a!==o)return a-o;const l=r.group===t?0:1,c=s.group===t?0:1;return l!==c?l-c:Math.abs(n-e.findIndex(d=>d.id===r.id))-Math.abs(n-e.findIndex(d=>d.id===s.id))})}function Iy(i,e,t,n){if(i.room&&e.anchor){const b=Ho(i.room,e.anchor,e.mountedHeight,t);return{center:e.center,anchor:b.anchor,mountedHeight:b.mountedHeight,adjusted:Math.abs(b.anchor.x-e.anchor.x)>1e-6||Math.abs(b.anchor.y-e.anchor.y)>1e-6||Math.abs(b.mountedHeight-e.mountedHeight)>1e-6}}const r=Math.max(.25,t),s=Math.max(.25,i.planeAspect);let a=Z(ot(e.center.x),ot(e.center.y)),o=Math.max(.04,Math.min(.9,e.mountedHeight)),l=a.x!==e.center.x||a.y!==e.center.y||o!==e.mountedHeight;const c=Math.max(.04,Math.min(.9,s/r));o>c&&(o=c,l=!0);const d=()=>{const y=o*r/s/2,_=o/2,L=Math.max(0,y),C=Math.min(1,1-y),T=Math.max(0,_),U=Math.min(1,1-_),w=Math.max(L,Math.min(C,a.x)),S=Math.max(T,Math.min(U,a.y));(w!==a.x||S!==a.y)&&(l=!0),a=Z(w,S)};d();const u=()=>da(i,{wallId:e.wallId,center:a,mountedHeight:o},r,n),h=b=>b?b.projectedQuad.reduce((y,_)=>y+(gi(_,i.safePolygon)?1:0),0):-1;let f=h(u()),g=a,v=o;if(f===4)return{center:g,mountedHeight:v,adjusted:l};const m=(()=>{const b=oa(i,Cy(i.safePolygon));return b?Z(ot(b.x),ot(b.y)):Z(.5,.5)})();for(let b=0;b<36;b+=1){a=Z(ot(a.x+(m.x-a.x)*.22),ot(a.y+(m.y-a.y)*.22)),o=Math.max(.04,Math.min(c,o*.985)),d();const y=u(),_=h(y);if(_>f&&(f=_,g=a,v=o),f===4)break}const p=Math.abs(g.x-e.center.x)>1e-6||Math.abs(g.y-e.center.y)>1e-6||Math.abs(v-e.mountedHeight)>1e-6;return{center:g,mountedHeight:v,adjusted:l||p}}function _i(i,e=!1){if(!i||typeof i!="object")return null;const t=i,n=typeof t.x=="number"&&Number.isFinite(t.x)?t.x:NaN,r=typeof t.y=="number"&&Number.isFinite(t.y)?t.y:NaN;return Number.isNaN(n)||Number.isNaN(r)?null:e?Z(ot(n),ot(r)):Z(n,r)}function Kn(i){if(!i||typeof i!="object")return null;const e=i,t=e.x,n=e.y,r=e.z;return typeof t!="number"||typeof n!="number"||typeof r!="number"||!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(r)?null:qe(t,n,r)}function tu(i,e){if(!i||typeof i!="object")return null;const t=i,n=t.minY,r=t.maxY,s=t.margin;return typeof n!="number"||typeof r!="number"||typeof s!="number"||!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(s)||n<0||r>e||r-n<=.2||s<0||s*2>=r-n?null:{minY:n,maxY:r,margin:s}}function Qo(i){var d;if(!i||typeof i!="object")return null;const e=i,t=Kn(e.origin),n=Kn(e.axisU),r=(d=Kn(e.axisV))!=null?d:qe(0,1,0),s=e.width,a=e.height;if(!t||!n||!r||typeof s!="number"||typeof a!="number"||!Number.isFinite(s)||!Number.isFinite(a)||s<=.25||a<=.25)return null;const o=Math.hypot(n.x,n.y,n.z),l=Math.hypot(r.x,r.y,r.z),c=n.x*r.x+n.y*r.y+n.z*r.z;return o<.92||o>1.08||l<.92||l>1.08||Math.abs(c)>.08?null:{origin:t,axisU:n,axisV:r,width:s,height:a}}function nu(i){if(!i||typeof i!="object")return null;const e=i,t=e.verticalBand&&typeof e.verticalBand=="object"?e.verticalBand:null,n=t&&typeof t.minY=="number"&&Number.isFinite(t.minY)&&typeof t.maxY=="number"&&Number.isFinite(t.maxY)&&t.maxY>t.minY?{minY:t.minY,maxY:t.maxY}:void 0,r=typeof e.sideMargin=="number"&&Number.isFinite(e.sideMargin)?Math.max(0,e.sideMargin):void 0,s=typeof e.doorwayClearance=="number"&&Number.isFinite(e.doorwayClearance)?Math.max(0,e.doorwayClearance):void 0;return!n&&r===void 0&&s===void 0?null:{verticalBand:n,sideMargin:r,doorwayClearance:s}}function iu(i){if(!i||typeof i!="object")return null;const e=i,t=Array.isArray(e.floorOutline)?e.floorOutline.map(c=>Kn(c)).filter(c=>c!==null):[],n=e.bounds&&typeof e.bounds=="object"?e.bounds:null,r=n?Kn(n.min):null,s=n?Kn(n.max):null,a=typeof e.floorY=="number"&&Number.isFinite(e.floorY)?e.floorY:void 0,o=typeof e.ceilingY=="number"&&Number.isFinite(e.ceilingY)?e.ceilingY:void 0,l=typeof e.wallThickness=="number"&&Number.isFinite(e.wallThickness)?Math.max(.01,e.wallThickness):void 0;return t.length===0&&(!r||!s)&&a===void 0&&o===void 0&&l===void 0?null:{floorOutline:t.length>=3?t:void 0,bounds:r&&s?{min:r,max:s}:void 0,floorY:a,ceilingY:o,wallThickness:l}}function Ly(i){if(!i||typeof i!="object")return null;const e=i,t=Qo(i);if(!t)return null;const n=vr(e.safePolygon),s=(Array.isArray(e.doorwayExclusions)?e.doorwayExclusions:[]).map(l=>vr(l)).filter(l=>l!==null),a=tu(e.hangingBand,t.height);if(!n||!a)return null;const o=l=>l.x>=0&&l.x<=t.width&&l.y>=0&&l.y<=t.height;return!n.every(o)||s.some(l=>!l.every(o))?null:{origin:t.origin,axisU:t.axisU,axisV:t.axisV,width:t.width,height:t.height,safePolygon:n,doorwayExclusions:s,hangingBand:a}}function ru(i){if(!i||typeof i!="object")return null;const e=i,t=Kn(e.position),n=Kn(e.target),r=e.verticalFovDeg,s=e.near,a=typeof e.far=="number"&&Number.isFinite(e.far)?e.far:40,o=_i(e.lensShift);return!t||!n||typeof r!="number"||typeof s!="number"||!Number.isFinite(r)||!Number.isFinite(s)||!Number.isFinite(a)||r<15||r>100||s<=0||a<=s||Math.hypot(t.x-n.x,t.y-n.y,t.z-n.z)<.1?null:{position:t,target:n,verticalFovDeg:r,near:s,far:a,lensShift:o!=null?o:void 0}}function Uy(i){if(!Array.isArray(i)||i.length!==4)return null;const e=i.map(t=>_i(t));return e.some(t=>t===null)?null:[e[0],e[1],e[2],e[3]]}function vr(i){if(!Array.isArray(i)||i.length<3)return null;const e=i.map(t=>_i(t));return e.some(t=>t===null)?null:e}function ky(i){const e=_i(i);return e!=null?e:void 0}function Dy(i){if(!i||typeof i!="object")return{...Sn};const e=i;return Qd({width:typeof e.width=="number"?e.width:Sn.width,height:typeof e.height=="number"?e.height:Sn.height})}function Ny(i){return i==="right"||i==="front"||i==="rear"?i:"left"}function Fy(i,e){var v,m,p,b,y,_;if(!i||typeof i!="object")return null;const t=i,n=typeof t.id=="string"?t.id.trim():"",r=Ny(t.group),s=t.role==="bounds-only"?"bounds-only":"rendered",a=typeof t.planeAspect=="number"&&Number.isFinite(t.planeAspect)?Math.max(.25,Math.min(8,t.planeAspect)):NaN;if(s==="bounds-only"){const L=Qo(t.transform);return!n||!L?(e.push(`wall "${n||"?"}" ignored: bounds-only walls require an id and a valid transform.`),null):{id:n,group:r,role:s,planeAspect:Number.isNaN(a)?Math.max(.25,Math.min(8,L.width/Math.max(.001,L.height))):a,transform:va(L)}}const o=Uy(t.quad);if(!n||Number.isNaN(a)||!o)return e.push(`wall "${n||"?"}" ignored: requires id, planeAspect, and a four-corner quad.`),null;if(Jr(o)||!ur(o))return e.push(`wall "${n}" ignored: quad must be convex and non-degenerate.`),null;const l=(v=vr(t.safePolygon))!=null?v:fn(No(o,.92)),c=(p=(m=vr(t.drawableRegion))!=null?m:vr(t.safePolygon))!=null?p:void 0,d=Array.isArray(t.exclusionPolygons)?t.exclusionPolygons.map(L=>vr(L)).filter(L=>L!==null):void 0,u=Qo(t.transform),h=u?tu(t.hangingBand,u.height):null,f=Ly(t.room);let g=f!=null?f:void 0;return t.room!==void 0&&!f&&t.transform===void 0&&e.push(`wall "${n}": v3 room plane is invalid; using the calibrated default plane when available.`),t.transform!==void 0&&!u&&e.push(`wall "${n}": transform is invalid; falling back to the legacy room plane when available.`),u&&(g={origin:yt(u.origin),axisU:yt(u.axisU),axisV:yt(u.axisV),width:u.width,height:u.height,safePolygon:(b=c!=null?c:f==null?void 0:f.safePolygon)!=null?b:[Z(.14,.14),Z(u.width-.14,.14),Z(u.width-.14,u.height-.14),Z(.14,u.height-.14)],doorwayExclusions:(y=d!=null?d:f==null?void 0:f.doorwayExclusions)!=null?y:[],hangingBand:(_=h!=null?h:f==null?void 0:f.hangingBand)!=null?_:{minY:.42,maxY:u.height-.28,margin:.08}}),Pd(o)||e.push(`wall "${n}": quad was normalized to clockwise winding.`),Math.abs(Qr(l))<=1e-6&&e.push(`wall "${n}": safePolygon is degenerate; using a derived inset polygon.`),{id:n,group:r,role:"rendered",planeAspect:a,quad:o,safePolygon:l,drawableRegion:c?fn(c):void 0,exclusionPolygons:d==null?void 0:d.map(L=>fn(L)),transform:u?va(u):g?{origin:yt(g.origin),axisU:yt(g.axisU),axisV:yt(g.axisV),width:g.width,height:g.height}:void 0,hangingBand:h!=null?h:g==null?void 0:g.hangingBand,shadowVector:ky(t.shadowVector),room:g!=null?g:void 0}}function Oy(i){var m,p;if(!i||typeof i!="object")return null;const e=i,t=typeof e.wallId=="string"?e.wallId.trim():"",n=typeof e.horizontalPosition=="number"&&Number.isFinite(e.horizontalPosition)?ot(e.horizontalPosition):void 0,r=typeof e.centerHeight=="number"&&Number.isFinite(e.centerHeight)?Math.max(0,Math.min(8,e.centerHeight)):void 0,s=typeof e.physicalHeight=="number"&&Number.isFinite(e.physicalHeight)?Math.max(.04,Math.min(8,e.physicalHeight)):void 0,a=_i(e.uv,!0),o=(p=(m=_i(e.center,!0))!=null?m:a?Z(ot(a.x),ot(1-a.y)):null)!=null?p:n!==void 0&&r!==void 0?Z(n,0):null,l=_i(e.anchor),c=l||a?8:.9,d=typeof e.mountedHeight=="number"&&Number.isFinite(e.mountedHeight)?Math.max(.04,Math.min(c,e.mountedHeight)):s!=null?s:NaN,u=e.targetSizePolicy==="fixed-height"||s!==void 0?"fixed-height":"contain",h=typeof e.minScale=="number"&&Number.isFinite(e.minScale)?Math.max(.4,Math.min(1,e.minScale)):.7,f=typeof e.maxScale=="number"&&Number.isFinite(e.maxScale)?Math.max(1,Math.min(2.5,e.maxScale)):1,g=typeof e.zOffset=="number"&&Number.isFinite(e.zOffset)?Math.max(.001,Math.min(.12,e.zOffset)):.02,v=typeof e.mountingGap=="number"&&Number.isFinite(e.mountingGap)?Math.max(.001,Math.min(.03,e.mountingGap)):ma;return!t||!o||Number.isNaN(d)?null:{wallId:t,horizontalPosition:n,centerHeight:r,physicalHeight:s!=null?s:d,mountingGap:v,center:o,mountedHeight:d,anchor:l!=null?l:void 0,uv:a!=null?a:void 0,targetSizePolicy:u,minScale:h,maxScale:f,zOffset:g,provisional:e.provisional===!0}}function By(i){if(!i||typeof i!="object")return null;const e=i,t=typeof e.cx=="number"&&Number.isFinite(e.cx)?ot(e.cx):NaN,n=typeof e.cy=="number"&&Number.isFinite(e.cy)?ot(e.cy):NaN,r=typeof e.maxW=="number"&&Number.isFinite(e.maxW)?ot(e.maxW):NaN,s=typeof e.maxH=="number"&&Number.isFinite(e.maxH)?ot(e.maxH):NaN,a=typeof e.rotateYDeg=="number"&&Number.isFinite(e.rotateYDeg)?Math.max(-45,Math.min(45,e.rotateYDeg)):0;return[t,n,r,s].some(Number.isNaN)||r<=0||s<=0?null:{cx:t,cy:n,maxW:r,maxH:s,rotateYDeg:a}}function su(i,e,t,n){var p,b,y;const r=e.replace(/^room-\d+\./,""),s=wy.get(r);let a=s!=null?s:"";a||(a=i.cx<.33?"wall-left":i.cx<.67?"wall-front":"wall-right");const o=t.filter(_=>_.role!=="bounds-only"),l=(b=(p=o.find(_=>_.id===a))!=null?p:o[0])!=null?b:t[0],c=Ay(l),d=Z(i.cx*n.width,i.cy*n.height),u=(y=oa(c,d))!=null?y:Z(.5,.5),h=Z(d.x,d.y-i.maxH*n.height/2),f=Z(d.x,d.y+i.maxH*n.height/2),g=oa(c,h),v=oa(c,f),m=g&&v?Math.abs(v.y-g.y):Math.max(.08,i.maxH*1.35);return{wallId:l.id,center:Z(ot(u.x),ot(u.y)),mountedHeight:Math.max(.06,Math.min(.9,m)),provisional:!0}}function Jo(i){const e=i&&typeof i=="object"?i:{},t=typeof e.selectionTimeoutMs=="number"&&Number.isFinite(e.selectionTimeoutMs)?Math.max(250,Math.min(1e4,e.selectionTimeoutMs)):by;return{requireAllMapped:e.requireAllMapped!==!1,autoPlaceUnmapped:e.autoPlaceUnmapped!==!1,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:t,selectionTimeout:"open-exact-target-procedural"}}function au(i){var T,U,w;const e=[];if(i==null)return{config:null,warnings:e,source:"built-in-default"};if(typeof i!="object"||Array.isArray(i))return e.push("museum-hub config ignored: expected a JSON object."),{config:null,warnings:e,source:"built-in-default"};const t=i,n=Yo(),r=t.visualTokens&&typeof t.visualTokens=="object"?t.visualTokens:{};r.galleryWall!==void 0&&(Zd(r.galleryWall)?n.galleryWall=r.galleryWall.trim():e.push("visualTokens.galleryWall is not a valid #RRGGBB color; using default.")),r.museumWall!==void 0&&(Zd(r.museumWall)?r.museumWall.trim().toUpperCase()!==n.galleryWall.toUpperCase()&&e.push("visualTokens.museumWall differs from galleryWall; the authoritative gallery wall token is used everywhere."):e.push("visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.")),n.museumWall=n.galleryWall;const s=Dy(t.stage);let a=Wo,o=mr,l=mr;if(t.background&&typeof t.background=="object"){const S=t.background;typeof S.aspect=="number"&&Number.isFinite(S.aspect)&&S.aspect>.5&&S.aspect<4&&(a=S.aspect),typeof S.src=="string"&&S.src.trim()&&(o=S.src.trim())}if(t.backgroundFallback&&typeof t.backgroundFallback=="object"){const S=t.backgroundFallback;typeof S.src=="string"&&S.src.trim()&&(l=S.src.trim())}Vo(o)&&e.push(`museum-hub background "${o}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds will fall back at runtime.`),Vo(l)&&e.push(`museum-hub background fallback "${l}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds may continue on the neutral wall token.`);const c=(T=ru(t.camera))!=null?T:ts(fa);t.camera!==void 0&&!ru(t.camera)&&e.push("museum-hub camera is invalid; using built-in calibrated camera.");const d=(U=nu(t.hangingRules))!=null?U:ga();t.hangingRules!==void 0&&!nu(t.hangingRules)&&e.push("museum-hub hangingRules are invalid; using built-in doorway/band defaults.");const u=Jo(t.fallbacks),h=typeof t.slotsPerPage=="number"&&Number.isFinite(t.slotsPerPage)?Math.max(1,Math.min(8,Math.round(t.slotsPerPage))):ua;t.slotsPerPage!==void 0&&h!==t.slotsPerPage&&e.push(`museum-hub slotsPerPage was clamped to ${h} (allowed range 1–8).`);const f=Array.isArray(t.slots)?t.slots:[];if(f.length===0)return e.push("museum-hub config ignored: expected a non-empty slots array."),{config:null,warnings:e,source:"built-in-default"};const g=Array.isArray(t.walls)?t.walls:[],v=g.map(S=>Fy(S,e)).filter(S=>S!==null),m=new Map(ns().map(S=>[S.id,S])),p=(v.length>0?v:ns()).map(S=>{var G;if(S.room||S.role==="bounds-only")return S;const P=(G=m.get(S.id))==null?void 0:G.room;return P?(e.push(`wall "${S.id}": missing v3 room plane; using built-in calibrated room plane.`),{...S,room:Zo(P)}):S});g.length>0&&v.length===0&&e.push("museum-hub walls were invalid; using built-in calibrated wall planes.");const b=(w=iu(t.room))!=null?w:ya(p);t.room!==void 0&&!iu(t.room)&&e.push("museum-hub room is invalid; deriving floor/ceiling layout from wall transforms.");const y=typeof t.version=="number"?t.version:1,_=new Set,L=[];let C="injected";for(const S of f){if(!S||typeof S!="object"){e.push("slot ignored: not an object.");continue}const P=S,G=typeof P.id=="string"?P.id.trim():"";if(!G){e.push("slot ignored: missing id.");continue}if(_.has(G)){e.push(`slot "${G}" ignored: duplicate slot ID.`);continue}_.add(G);const N=typeof P.artworkId=="string"&&P.artworkId.trim()?P.artworkId.trim():void 0,F=P.placement,W=Oy(F);let V=null;if(W)V=W;else{const J=By(F);J&&(V=su(J,G,p,s),C=y>=2?"injected":"v1-migrated")}if(!V){e.push(`slot "${G}" ignored: requires a valid v2 placement or migratable v1 placement.`);continue}L.push({id:G,enabled:P.enabled!==!1,selectable:P.selectable!==!1,...N?{artworkId:N}:{},placement:V})}return L.length===0?{config:null,warnings:e,source:"built-in-default"}:(C==="v1-migrated"&&e.push("Version-1 museum-hub slots were migrated to the wall-plane v2 model. Review calibration output and re-save customer-artworks/museum-hub.json."),{config:{version:Math.max(5,y),coverage:"all-active-artworks",stage:s,background:{src:o,aspect:a},backgroundFallback:{src:l},visualTokens:n,camera:c,room:b,hangingRules:d,walls:p,fallbacks:u,slotsPerPage:h,slots:L},warnings:e,source:C})}function zy(i){const e=[];if(!Array.isArray(i)||i.length===0)return{config:null,warnings:e,source:"built-in-default"};e.push("Legacy hub-hotspots.json configuration migrated automatically. Please move to customer-artworks/museum-hub.json.");const t=ns(),n=[],r=new Set,s=jo(0);let a=0;for(const o of i){if(!o||typeof o!="object"){e.push("legacy hotspot ignored: not an object.");continue}const l=o,c=typeof l.artworkId=="string"?l.artworkId.trim():"",d=typeof l.cx=="number"&&Number.isFinite(l.cx)?ot(l.cx):NaN,u=typeof l.cy=="number"&&Number.isFinite(l.cy)?ot(l.cy):NaN,h=typeof l.w=="number"&&Number.isFinite(l.w)?ot(l.w):NaN,f=typeof l.h=="number"&&Number.isFinite(l.h)?ot(l.h):NaN;if(!c||/^@order:/.test(c)||[d,u,h,f].some(Number.isNaN)){e.push(`legacy hotspot "${c||"?"}" could not be migrated.`);continue}const g=s.find(p=>!r.has(p.id)&&Math.abs(p.placement.center.x-d)<.12&&Math.abs(p.placement.center.y-u)<.12),v=g?g.id:`${jd(0)}.legacy-${a+=1}`;if(r.has(v))continue;r.add(v);const m=su({cx:d,cy:u,maxH:f},v,t,Sn);n.push({id:v,enabled:!0,selectable:!0,artworkId:c,placement:m})}return n.length===0?{config:null,warnings:e,source:"built-in-default"}:{config:{version:5,coverage:"all-active-artworks",stage:{...Sn},background:{src:mr,aspect:Wo},backgroundFallback:{src:mr},visualTokens:Yo(),camera:ts(fa),room:ya(t),hangingRules:ga(),walls:t,fallbacks:Jo(void 0),slotsPerPage:ua,slots:n},warnings:e,source:"legacy-migrated"}}function Hy(i,e,t){var we,xe,Be,Ne,We,Je,k,ct,Xe,Ue,Re,dt,Fe,ze,I,M,$,re,le,ie,Ie,ge;let n=au(e);if(!n.config){const A=zy(t);A.config&&(n={...A,warnings:[...n.warnings,...A.warnings]})}const r=[...n.warnings];let s=n.config?n.source:"built-in-default",a;n.config?a=n.config:(a={version:5,coverage:"all-active-artworks",stage:{...Sn},background:{src:mr,aspect:Wo},backgroundFallback:{src:mr},visualTokens:Yo(),camera:ts(fa),room:ya(ns()),hangingRules:ga(),walls:ns(),fallbacks:Jo(void 0),slotsPerPage:ua,slots:jo(0).map(A=>{const j=Ey[A.id];return j!==void 0&&i.some(Q=>Q.id===j)?{...A,artworkId:j}:A})},s="built-in-default");const o=Qd(a.stage),l=a.visualTokens,c=a.background,d=a.backgroundFallback,u=a.camera?ts(a.camera):ts(fa),h=(we=a.room)!=null?we:ya(a.walls),f=(xe=a.hangingRules)!=null?xe:ga(),g=a.fallbacks.selectionTimeoutMs,v=a.fallbacks.autoPlaceUnmapped,m=(Be=a.slotsPerPage)!=null?Be:ua,p=[];for(const A of a.walls){if(A.role==="bounds-only")continue;if(!A.quad){r.push(`wall "${A.id}" is missing a reference quad and will be ignored.`);continue}const j=qo(A.quad),B=A.safePolygon?fn(A.safePolygon):fn(No(j,.92));let Q=A.room?Zo(A.room):void 0,se=null,pe=null,ae={x:1,y:1},ve;const Ae=Ty(j);if(Q){const ce=gy(Q,j,B,u,o,Ae);if(ce){if(Q=ce.room,se=ce.projectedQuad,pe=ce.projectedSafePolygon,ae={x:ce.scaleX,y:ce.scaleY},ve=ce.realism,A.transform&&Q.width>1e-6){const Ee=A.transform.width/Q.width;Number.isFinite(Ee)&&Ee>0&&(Q=Gy(Q,u.position,Ee),ae={x:ce.scaleX*Ee,y:ce.scaleY*Ee})}}else r.push(`wall "${A.id}": room plane could not be reconciled to the reference quad; using the stored room transform.`),se=Hd(Q,u,o),pe=zo(Q,u,Q.safePolygon,o),se&&(ve=Xd(Q,se,j,pe,B,Ae));ve&&!ve.passes&&r.push(`wall "${A.id}": projection realism failed (max residual ${ve.referenceResidualMaxPx.toFixed(1)}px, axis dot ${ve.axisDot.toFixed(3)}, convergence ${ve.projectedConvergence}).`)}const ke=j,D=B,ue=hr(ke),te=ue?aa(ue):null;if(!ue||!te){r.push(`wall "${A.id}" could not build a homography and will be ignored.`);continue}const ne=A.transform?va(A.transform):Q?{origin:yt(Q.origin),axisU:yt(Q.axisU),axisV:yt(Q.axisV),width:Q.width,height:Q.height}:null;if(!ne){r.push(`wall "${A.id}" is missing a room transform and will be ignored.`);continue}p.push({id:A.id,group:A.group,transform:ne,planeAspect:A.planeAspect,quad:ke,safePolygon:D,shadowVector:A.shadowVector?tt(A.shadowVector):void 0,room:Q,camera:Q?u:void 0,referenceQuad:j,referenceSafePolygon:B,projectedQuad:se,projectedSafePolygon:pe,localCalibrationScale:ae,projectionRealism:ve,expectedConvergence:Ae,homography:ue,inverseHomography:te})}const b=new Map(p.map(A=>[A.id,A]));Vy(a,r);const y=(We=(Ne=h.floorOutline)==null?void 0:Ne.map(A=>yt(A)))!=null?We:Jd(a.walls),_=h.bounds?{min:yt(h.bounds.min),max:yt(h.bounds.max)}:eu(a.walls,y),L={floorOutline:y,bounds:_,dimensions:{width:Math.max(.01,_.max.x-_.min.x),height:Math.max(.01,((Je=h.ceilingY)!=null?Je:_.max.y)-((k=h.floorY)!=null?k:_.min.y)),depth:Math.max(.01,_.max.z-_.min.z)},floorY:(ct=h.floorY)!=null?ct:_.min.y,ceilingY:(Xe=h.ceilingY)!=null?Xe:_.max.y,wallThickness:(Ue=h.wallThickness)!=null?Ue:.08,wallIds:p.map(A=>A.id)},C=new Map;i.forEach((A,j)=>C.set(A.id,j));const T=new Set,U=[],w=[];for(const A of a.slots){const j=Math.max(0,Wy(A.id)),B=b.get(A.placement.wallId),Q=(Re=B==null?void 0:B.group)!=null?Re:ou(A.placement.wallId),se=(dt=B==null?void 0:B.localCalibrationScale)!=null?dt:{x:1,y:1},pe=A.placement.horizontalPosition!==void 0&&A.placement.centerHeight!==void 0&&A.placement.physicalHeight!==void 0,ae=Ko(A.placement,B);B!=null&&B.room&&!A.placement.anchor&&(A.placement.horizontalPosition===void 0||A.placement.centerHeight===void 0)&&r.push(`slot "${A.id}": room-local anchor missing; deriving it from the normalized center for calibrated placement.`);const ve=(()=>{const ke=Ry(A.placement,B);return ke?pe?ke:Z(ke.x*se.x,ke.y*se.y):ae&&(B!=null&&B.room)?Z(ae.x*B.room.width,ae.y*B.room.height):B!=null&&B.room?Z(A.placement.center.x*B.room.width,(1-A.placement.center.y)*B.room.height):void 0})(),Ae={id:A.id,pageIndex:j,placement:{wallId:A.placement.wallId,center:ae?Z(ae.x,1-ae.y):tt(A.placement.center),mountedHeight:pe?A.placement.physicalHeight:B!=null&&B.room?A.placement.mountedHeight*se.y:A.placement.mountedHeight,anchor:ve?tt(ve):void 0,uv:ae?tt(ae):void 0,horizontalPosition:ve&&(B!=null&&B.room)?ot(ve.x/Math.max(.001,B.room.width)):ae==null?void 0:ae.x,centerHeight:ve==null?void 0:ve.y,physicalHeight:pe?A.placement.physicalHeight:B!=null&&B.room?A.placement.mountedHeight*se.y:A.placement.mountedHeight,mountingGap:(Fe=A.placement.mountingGap)!=null?Fe:ma,targetSizePolicy:(ze=A.placement.targetSizePolicy)!=null?ze:"contain",minScale:(I=A.placement.minScale)!=null?I:.7,maxScale:(M=A.placement.maxScale)!=null?M:1,zOffset:($=A.placement.zOffset)!=null?$:.02,provisional:A.placement.provisional===!0},wallGroup:Q};if(!A.enabled){U.push({...Ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"explicitly-disabled",mappingSource:"explicit",artworkAspect:1});continue}if(!B){r.push(`slot "${A.id}" references unknown wall "${A.placement.wallId}"; slot disabled.`),U.push({...Ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"missing-wall",mappingSource:"explicit",artworkAspect:1});continue}if(A.artworkId){const ke=C.get(A.artworkId);if(ke===void 0){r.push(`slot "${A.id}": artwork ID "${A.artworkId}" not in the active manifest; slot disabled.`),U.push({...Ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"invalid-mapping",mappingSource:"explicit",artworkAspect:1});continue}if(T.has(A.artworkId)){r.push(`slot "${A.id}": artwork "${A.artworkId}" is already mapped; duplicate slot disabled.`),U.push({...Ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"duplicate-mapping",mappingSource:"explicit",artworkAspect:1});continue}T.add(A.artworkId);const D=i[ke];U.push({...Ae,artworkId:A.artworkId,artworkIndex:ke,displayLabel:D.title,selectable:A.selectable,disabledReason:A.selectable?null:"explicitly-disabled",mappingSource:"explicit",artworkAspect:xa(D)});continue}w.push({...Ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:A.selectable,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1})}const S=v?i.filter(A=>!T.has(A.id)):[],P=new Map($o.map(A=>[A.suffix,A.intendedUse])),G=A=>{const j=A.id.replace(/^room-\d+\./,"");return P.get(j)},N=(A,j)=>{A.artworkId=j.id,A.artworkIndex=C.get(j.id),A.displayLabel=j.title,A.artworkAspect=xa(j),T.add(j.id)},F=[];for(const A of S){const j=Kd(xa(A)),B=w.findIndex(Q=>Q.selectable&&!Q.artworkId&&G(Q)===j);B>=0?N(w[B],A):F.push(A)}for(const A of F){const j=w.find(B=>B.selectable&&!B.artworkId);j&&N(j,A)}for(const A of w)A.artworkId&&U.push(A);let W=i.filter(A=>!T.has(A.id));if(v&&W.length>0){let A=U.reduce((j,B)=>Math.max(j,B.pageIndex),0)+1;for(;W.length>0;){const j=jo(A).map(se=>{var ve,Ae,ke,D,ue,te,ne,ce;const pe=b.get(se.placement.wallId),ae=(ve=pe==null?void 0:pe.localCalibrationScale)!=null?ve:{x:1,y:1};return{id:se.id,pageIndex:A,placement:{wallId:se.placement.wallId,center:tt(se.placement.center),mountedHeight:(Ae=se.placement.physicalHeight)!=null?Ae:pe!=null&&pe.room?se.placement.mountedHeight*ae.y:se.placement.mountedHeight,anchor:pe!=null&&pe.room&&se.placement.anchor?se.placement.horizontalPosition!==void 0&&se.placement.centerHeight!==void 0?tt(se.placement.anchor):Z(se.placement.anchor.x*ae.x,se.placement.anchor.y*ae.y):se.placement.anchor?tt(se.placement.anchor):void 0,uv:se.placement.uv?tt(se.placement.uv):void 0,horizontalPosition:se.placement.horizontalPosition,centerHeight:se.placement.centerHeight,physicalHeight:(ke=se.placement.physicalHeight)!=null?ke:pe!=null&&pe.room?se.placement.mountedHeight*ae.y:se.placement.mountedHeight,mountingGap:(D=se.placement.mountingGap)!=null?D:ma,targetSizePolicy:(ue=se.placement.targetSizePolicy)!=null?ue:"contain",minScale:(te=se.placement.minScale)!=null?te:.7,maxScale:(ne=se.placement.maxScale)!=null?ne:1,zOffset:(ce=se.placement.zOffset)!=null?ce:.02,provisional:!1},artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!0,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1,wallGroup:ou(se.placement.wallId)}}),B=W.slice(0,m),Q=new Set;for(const se of B){const pe=Kd(xa(se)),ae=j.find(Ae=>!Ae.artworkId&&G(Ae)===pe&&!Q.has(Ae.id)),ve=ae!=null?ae:j.find(Ae=>!Ae.artworkId);Q.add(ve.id),N(ve,se)}U.push(...j.filter(se=>se.artworkId)),W=i.filter(se=>!T.has(se.id)),A+=1}}for(const A of U){if(!A.selectable||!A.artworkId)continue;const j=b.get(A.placement.wallId);if(!j)continue;const B=Iy(j,A.placement,A.artworkAspect,o);B.adjusted&&(A.placement.center=B.center,B.anchor&&(A.placement.anchor=B.anchor),B.anchor&&(j!=null&&j.room)&&(A.placement.uv=Z(ot(B.anchor.x/Math.max(.001,j.room.width)),ot(B.anchor.y/Math.max(.001,j.room.height))),A.placement.center=Z(A.placement.uv.x,1-A.placement.uv.y)),A.placement.mountedHeight=B.mountedHeight,A.placement.physicalHeight=B.mountedHeight,A.placement.horizontalPosition=(re=A.placement.uv)==null?void 0:re.x,A.placement.centerHeight=(le=B.anchor)==null?void 0:le.y,r.push(`slot "${A.id}": authored wall placement was adjusted to remain inside the usable mounting area.`),A.placement.provisional&&r.push(`slot "${A.id}": provisional placement was clamped to the wall drawable region.`))}const V=new Map;for(const A of U){if(!A.selectable||!A.artworkId||!A.placement.anchor)continue;const j=b.get(A.placement.wallId);if(!(j!=null&&j.room))continue;const B=Ho(j.room,A.placement.anchor,A.placement.mountedHeight,A.artworkAspect);if(B.rejectionReason!=="none")continue;const Q=B.localQuad.map(ae=>ae.x),se=`${A.pageIndex}:${j.id}`,pe=(ie=V.get(se))!=null?ie:[];pe.push({id:A.id,minX:Math.min(...Q),maxX:Math.max(...Q)}),V.set(se,pe)}for(const A of V.values()){A.sort((j,B)=>j.minX-B.minX);for(let j=1;j<A.length;j+=1){const B=A[j-1],Q=A[j],se=Q.minX-B.maxX;se+1e-6<qd&&r.push(`slots "${B.id}" and "${Q.id}": wall spacing ${se.toFixed(3)} m is below the ${qd.toFixed(2)} m curator minimum.`)}}const J=(A,j)=>{var Ae,ke,D,ue,te,ne,ce,Ee;const B=(ke=(Ae=A.placement.uv)!=null?Ae:Ko(A.placement,j))!=null?ke:Z(A.placement.center.x,1-A.placement.center.y),Q=b.get(A.placement.wallId),se=(ne=(te=(D=Q==null?void 0:Q.room)==null?void 0:D.height)!=null?te:(ue=j.room)==null?void 0:ue.height)!=null?ne:1,pe=(Ee=(ce=j.room)==null?void 0:ce.height)!=null?Ee:se,ae=A.placement.mountedHeight/Math.max(.001,se),ve={wallId:j.id,center:Z(B.x,1-B.y),anchor:j.room?Z(B.x*j.room.width,B.y*j.room.height):void 0,uv:tt(B),mountedHeight:j.room?Math.max(.04,ae*pe):A.placement.mountedHeight,targetSizePolicy:A.placement.targetSizePolicy,minScale:A.placement.minScale,maxScale:A.placement.maxScale,zOffset:A.placement.zOffset,horizontalPosition:B.x,centerHeight:j.room?B.y*j.room.height:void 0,physicalHeight:j.room?ae*j.room.height:A.placement.physicalHeight,mountingGap:A.placement.mountingGap,provisional:A.placement.provisional};return{projection:da(j,ve,A.artworkAspect,o),placement:ve}},X=new Map;for(const A of U){if(!A.selectable||!A.artworkId)continue;const j=b.get(A.placement.wallId);if(!j)continue;let B=null,Q=null,se=null;const pe=Py(j.id,p,j.group);for(const ae of pe){if(ae.projectionRealism&&!ae.projectionRealism.passes)continue;const ve=J(A,ae);if(!(!ve.projection||!ve.projection.projectedQuad.every(ke=>gi(ke,ae.safePolygon)))){B=ae,Q=ve.placement,se=ve.projection;break}}if(X.set(A.id,se),!B||!Q||!se){A.selectable=!1,A.disabledReason=j.projectionRealism&&!j.projectionRealism.passes?"projection-realism":"invalid-projection",r.push(`slot "${A.id}": projected geometry is invalid and the slot was suppressed.`);continue}B.id!==j.id?(A.placement={...Q,center:tt(Q.center),anchor:Q.anchor?tt(Q.anchor):void 0,uv:Q.uv?tt(Q.uv):void 0},A.wallGroup=B.group,r.push(`slot "${A.id}": moved from "${j.id}" to fallback wall "${B.id}" after doorway/containment validation.`)):A.placement={...A.placement,center:tt(Q.center),anchor:Q.anchor?tt(Q.anchor):void 0,uv:Q.uv?tt(Q.uv):void 0,mountedHeight:Q.mountedHeight},se.shortEdge<ha&&r.push(`slot "${A.id}": projected short edge ${se.shortEdge.toFixed(1)}px is below the ${ha}px desktop guidance.`),A.placement.provisional&&r.push(`slot "${A.id}": placement was migrated provisionally and should be recalibrated.`)}const oe=new Map;for(const A of U){const j=(Ie=oe.get(A.pageIndex))!=null?Ie:[];j.push(A),oe.set(A.pageIndex,j)}const he=[...oe.entries()].sort((A,j)=>A[0]-j[0]).map(([A,j])=>({pageIndex:A,slots:j}));for(const A of he){const j=A.slots.filter(B=>B.selectable&&B.artworkId);for(let B=0;B<j.length;B+=1){const Q=j[B],se=X.get(Q.id);if(se)for(let pe=B+1;pe<j.length;pe+=1){const ae=j[pe],ve=X.get(ae.id);ve&&Do(se.projectedQuad,ve.projectedQuad)&&r.push(`page ${A.pageIndex+1}: slot "${Q.id}" overlaps slot "${ae.id}".`)}}}const Me=new Map,ee=new Map;for(const A of U)A.selectable&&A.artworkId&&(Me.set(A.id,A.artworkId),ee.set(A.artworkId,A.id));const Ve=i.filter(A=>!ee.has(A.id)).length;Ve>0&&v&&r.push(`${Ve} active artwork(s) without a selectable slot.`);const K=new Map,de=new Map;for(const A of i)K.set(A.id,A.image),de.set(A.id,{image:A.image,webglImage:(ge=A.webglImage)!=null?ge:null,dimensions:A.dimensions,...A.imageSourceContext?{imageSourceContext:A.imageSourceContext}:{}});return{pages:he,slotToArtwork:Me,artworkToSlot:ee,artworkImageById:K,artworkSourceById:de,background:c,backgroundFallback:d,stage:o,visualTokens:l,camera:u,room:L,hangingRules:f,walls:p,wallById:b,slotsPerPage:m,selectionTimeoutMs:g,source:s,warnings:r,unmappedArtworkCount:Ve}}function ou(i){return i.includes("front")?"front":i.includes("rear")?"rear":i.includes("right")?"right":"left"}const On=.01;function Gy(i,e,t){const n=r=>Z(r.x*t,r.y*t);return{origin:qe(e.x+(i.origin.x-e.x)*t,e.y+(i.origin.y-e.y)*t,e.z+(i.origin.z-e.z)*t),axisU:yt(i.axisU),axisV:yt(i.axisV),width:i.width*t,height:i.height*t,safePolygon:i.safePolygon.map(n),doorwayExclusions:i.doorwayExclusions.map(r=>r.map(n)),hangingBand:{minY:i.hangingBand.minY*t,maxY:i.hangingBand.maxY*t,margin:i.hangingBand.margin*t}}}function lu(i){const e=i.map(t=>t.x);return{min:Math.min(...e),max:Math.max(...e)}}function cu(i){const e=i.map(t=>t.y);return{min:Math.min(...e),max:Math.max(...e)}}function Vy(i,e){var o,l,c,d,u,h,f,g,v,m;const t=i.walls.find(p=>p.role!=="bounds-only"&&p.group==="left"),n=i.walls.find(p=>p.role!=="bounds-only"&&p.group==="right");if(!(t!=null&&t.room)||!(n!=null&&n.room))return;if(Math.abs(t.room.width-n.room.width)>On||Math.abs(t.room.height-n.room.height)>On){e.push("museum-hub mirror symmetry: left/right wall dimensions differ beyond the 1 cm tolerance.");return}const r=t.room.width,s=t.room.doorwayExclusions,a=n.room.doorwayExclusions;if(s.length!==a.length)e.push(`museum-hub mirror symmetry: left wall has ${s.length} doorway(s) but right wall has ${a.length}.`);else for(const p of s){const b=lu(p),y=cu(p);if(!a.some(L=>{const C=lu(L),T=cu(L);return Math.abs(C.min-(r-b.max))<=On&&Math.abs(C.max-(r-b.min))<=On&&Math.abs(T.min-y.min)<=On&&Math.abs(T.max-y.max)<=On})){e.push("museum-hub mirror symmetry: side-wall doorways are not mirrored within the 1 cm tolerance.");break}}for(const p of i.slots){if(p.placement.wallId!==t.id)continue;const b=p.id.replace("wall-left","wall-right");if(b===p.id)continue;const y=i.slots.find(S=>S.id===b);if(!y||y.placement.wallId!==n.id){e.push(`museum-hub mirror symmetry: slot "${p.id}" has no mirrored counterpart "${b}".`);continue}const _=(o=p.placement.horizontalPosition)!=null?o:p.placement.anchor?p.placement.anchor.x/r:p.placement.center.x,L=(l=y.placement.horizontalPosition)!=null?l:y.placement.anchor?y.placement.anchor.x/r:y.placement.center.x,C=(u=(d=p.placement.centerHeight)!=null?d:(c=p.placement.anchor)==null?void 0:c.y)!=null?u:(1-p.placement.center.y)*t.room.height,T=(g=(f=y.placement.centerHeight)!=null?f:(h=y.placement.anchor)==null?void 0:h.y)!=null?g:(1-y.placement.center.y)*n.room.height,U=(v=p.placement.physicalHeight)!=null?v:p.placement.mountedHeight,w=(m=y.placement.physicalHeight)!=null?m:y.placement.mountedHeight;(Math.abs((L-(1-_))*r)>On||Math.abs(T-C)>On||Math.abs(w-U)>On)&&e.push(`museum-hub mirror symmetry: slot "${b}" does not mirror "${p.id}" within the 1 cm tolerance.`)}}function Wy(i){const e=/^room-(\d+)\./.exec(i);if(!e)return 0;const t=Number.parseInt(e[1],10);return Number.isFinite(t)&&t>=1?t-1:0}async function Xy(i,e){if(typeof window=="undefined"||typeof window.fetch!="function")return{ok:null,status:null,reason:"unsupported"};let t="";try{t=new URL(i,window.location.href).protocol}catch(s){return{ok:null,status:null,reason:"unsupported"}}if(t!=="http:"&&t!=="https:")return{ok:null,status:null,reason:"unsupported"};const n=typeof AbortController=="function"?new AbortController:null,r=window.setTimeout(()=>n==null?void 0:n.abort(),Math.max(250,Math.min(e,4e3)));try{const s=await window.fetch(i,{method:"HEAD",cache:"no-store",signal:n==null?void 0:n.signal});return s.status===405||s.status===501?{ok:null,status:s.status,reason:"unsupported"}:{ok:s.ok,status:s.status,reason:s.ok?"ok":"http-error"}}catch(s){return s instanceof DOMException&&s.name==="AbortError"?{ok:null,status:null,reason:"probe-timeout"}:{ok:null,status:null,reason:"network-error"}}finally{window.clearTimeout(r)}}function $y(i,e,t){return new Promise(n=>{let r=!1;const s=c=>{r||(r=!0,window.clearTimeout(l),i.removeEventListener("load",a),i.removeEventListener("error",o),n({status:c}))},a=()=>s("loaded"),o=()=>s("error"),l=window.setTimeout(()=>s("timeout"),t);i.addEventListener("load",a),i.addEventListener("error",o),i.src=e})}function du(i){return i===null?"http-error":Go(i)?"http-404":`http-${i}`}function uu(i,e,t,n){var r,s,a;return{assetRole:i.role,attempt:e.role,path:e.path,url:e.url,primaryPath:i.primaryPath,primaryUrl:i.primaryUrl,fallbackPath:(r=i.fallbackPath)!=null?r:null,fallbackUrl:(s=i.fallbackUrl)!=null?s:null,httpStatus:n,reason:t,referenceOnly:Vo(e.path),context:(a=i.context)!=null?a:null}}function Yy(i,e){var n;const t=_y(i.primaryUrl,(n=i.fallbackUrl)!=null?n:"",e);return!t||!i.fallbackPath?null:{role:"fallback",path:i.fallbackPath,url:t}}function qy(i,e,t,n){const r=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":Go(n)?"returned 404":`returned ${du(n)}`;i.diagnostics.warn("hub-asset-missing",`Hub ${i.role} asset ${r}; retrying shipped fallback without aborting`,uu(i,e,t,n))}function Zy(i,e,t,n){const r=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":Go(n)?"returned 404":`returned ${du(n)}`;i.diagnostics.warn("hub-asset-fallback-failed",e.role==="fallback"?`Hub ${i.role} asset and fallback ${r}; continuing with neutral museum-grey surface`:`Hub ${i.role} asset ${r}; continuing with neutral museum-grey surface`,uu(i,e,t,n))}async function jy(i,e){const t=await Xy(e.url,i.timeoutMs);if(t.ok===!1)return{status:"failed",reason:"http-error",httpStatus:t.status};const n=await $y(i.image,e.url,i.timeoutMs);return n.status==="loaded"?{status:"loaded",httpStatus:t.status}:n.status==="timeout"?{status:"failed",reason:t.reason==="probe-timeout"?"probe-timeout":"timeout",httpStatus:t.status}:t.reason==="network-error"?{status:"failed",reason:"network-error",httpStatus:t.status}:{status:"failed",reason:"image-error",httpStatus:t.status}}async function Ky(i){var r,s;let e={role:"primary",path:i.primaryPath,url:i.primaryUrl},t=!1,n=null;for(;e;){const a=await jy(i,e);if(a.status==="loaded")return{status:e.role==="primary"?"loaded":"fallback-loaded",finalPath:e.path,finalUrl:e.url,httpStatus:a.httpStatus};n=a.httpStatus;const o=Yy(i,t);if(e.role==="primary"&&o){t=!0,qy(i,e,a.reason,a.httpStatus),e=o;continue}return Zy(i,e,a.reason,a.httpStatus),(r=i.onNeutralFallback)==null||r.call(i),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}return(s=i.onNeutralFallback)==null||s.call(i),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}class _a extends He{constructor(){const e=_a.SkyShader,t=new kt({name:e.name,uniforms:Wi.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:1,depthWrite:!1});super(new Ut(1,1,1),t),this.isSky=!0}}_a.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new R},up:{value:new R(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const hu=512,fu=1.5,yr=1.15,pu=.026,mu=.012,gu=.34,ba=.55,vu=.72,yu=.06,xu=2.7,_u=1.55,xr=.82,Qn=.72,Qy=.006,bu=Object.freeze({hemisphere:Object.freeze({sky:15397622,ground:13091769,intensity:.14}),key:Object.freeze({color:16054262,intensity:.55,position:Object.freeze([-3.4,9.8,5.9]),target:Object.freeze([.2,1.1,-1.8])}),fill:Object.freeze({color:15265263,intensity:.16,position:Object.freeze([3.8,5.8,5.2]),target:Object.freeze([-.6,1.6,-1.6])}),ceilingPanel:Object.freeze({color:16054522,intensity:5,edgeInset:.05,ceilingOffset:.045}),skylightPanel:Object.freeze({color:15266034,intensity:3.2,edgeInset:.12,ceilingOffset:.12})}),el=Object.freeze([0,-1,0]),wn=Object.freeze({turbidity:5.6,rayleigh:1.25,mieCoefficient:.004,mieDirectionalG:.78,sunDirection:Object.freeze([-.3,.87,.39]),roofRise:Qn,ribCount:9,glassRoughness:.19,glassTransmission:.72}),Sa=Object.freeze({toneMappingExposure:.92,environmentIntensity:.18,planarReflectionHigh:.16,planarReflectionBalanced:0});class Jy{constructor(e,t,n){x(this,"canvas");x(this,"diagnostics",Jt("hub-room"));x(this,"renderer");x(this,"rendererMode");x(this,"scene",new kr);x(this,"camera");x(this,"cameraTarget",new R);x(this,"resolution");x(this,"pageGroups",new Map);x(this,"slotMeshes",new Map);x(this,"placeholderTextures",new Map);x(this,"surfaceFactory");x(this,"materials");x(this,"shadowMaterial");x(this,"edgeGeometry",new Ut(1,1,1));x(this,"artworkPlaneGeometry",new Yt(1,1));x(this,"contactShadowTexture",null);x(this,"floorMeshes",[]);x(this,"keyLight",null);x(this,"fillLight",null);x(this,"ceilingPanelLights",[]);x(this,"sky",null);x(this,"batterySky",null);x(this,"skylightGlassMaterial",null);x(this,"skylightGlassFallback",null);x(this,"skylightGlassMeshes",[]);x(this,"environmentTarget",null);x(this,"reflectionTarget",null);x(this,"reflectionCamera",new Bt);x(this,"reflectionMatrix",new at);x(this,"reflectionUniforms",{uReflectionMap:{value:null},uReflectionMatrix:{value:new at},uReflectionStrength:{value:0}});x(this,"preset");x(this,"activePageIndex",0);x(this,"disposed",!1);var s;this.resolution=t,this.preset=n;const r=Jc({alpha:!1});this.renderer=r.renderer,this.rendererMode=r.mode,this.renderer.setPixelRatio(r.mode==="preferred"?er(n.pixelRatioCap):1),this.renderer.setSize(t.stage.width,t.stage.height,!1),this.renderer.outputColorSpace=Nt,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=Sa.toneMappingExposure,this.renderer.shadowMap.enabled=r.mode==="preferred",this.renderer.shadowMap.type=2,this.renderer.setClearColor(new Le(t.visualTokens.museumWall),1),this.renderer.domElement.classList.add("museum-hub__canvas"),e.appendChild(this.renderer.domElement),this.canvas=this.renderer.domElement,this.diagnostics.info("created","Hub WebGL renderer initialized",{mode:r.mode,attempts:r.attempts,context:ed(this.renderer),protocol:window.location.protocol}),this.camera=new Bt(t.camera.verticalFovDeg,t.stage.width/t.stage.height,t.camera.near,(s=t.camera.far)!=null?s:40),this.camera.position.set(t.camera.position.x,t.camera.position.y,t.camera.position.z),this.cameraTarget.set(t.camera.target.x,t.camera.target.y,t.camera.target.z),this.camera.lookAt(this.cameraTarget),this.applyLensShift(),this.surfaceFactory=new id(n.hubSurfaceTileSize,"hub"),this.surfaceFactory.setAnisotropy(this.effectiveAnisotropy()),this.materials=this.surfaceFactory.getMaterials({wall:t.visualTokens.museumWall}),this.materials.ceiling.shadowSide=2,this.materials.trim.shadowSide=2,this.attachFloorReflectionShader(this.materials.floor),this.shadowMaterial=new Yn({map:this.contactShadowMap(),color:0,transparent:!0,opacity:.12,depthWrite:!1,toneMapped:!1}),this.buildRoom(),this.buildLights(),this.applyEnvironment(),this.applyReflectionMode(),this.setActivePage(0),this.render(),this.logRenderingDiagnostics()}applyPreset(e){this.disposed||(this.preset=e,this.renderer.setPixelRatio(this.rendererMode==="preferred"?er(e.pixelRatioCap):1),this.renderer.setSize(this.resolution.stage.width,this.resolution.stage.height,!1),this.surfaceFactory.setTileSize(e.hubSurfaceTileSize),this.applyLightingPreset(),this.applySkyPreset(),this.applyShadowPreset(),this.applyEnvironment(),this.applyReflectionMode(),this.render(),this.logRenderingDiagnostics())}setActivePage(e){this.activePageIndex=e;for(const[t,n]of this.pageGroups)n.visible=t===e;this.render()}setSlotHidden(e){const t=this.slotMeshes.get(e);t&&(t.group.visible=!1,this.render())}getMaxTextureSize(){return this.renderer.capabilities.maxTextureSize}upsertSlot(e,t,n,r,s){var b,y,_;const a=this.ensureSlotState(e);if(!a||!t.room||!e.selectable||!e.artworkId)return a&&(a.group.visible=!1),this.render(),{applied:!1,usedImage:!1};const o=e.placement.anchor;if(!o)return a.group.visible=!1,this.render(),{applied:!1,usedImage:!1};const l=!r&&n&&n.complete&&n.naturalWidth>0?n.currentSrc||n.src||`${e.id}:image`:`${e.id}:placeholder:${e.displayLabel}`;let c,d;if(a.textureKey!==l){let L;if(!r&&n&&n.complete&&n.naturalWidth>0){const C=this.imageTexture(n);L=C.texture,c=C.fit;try{this.renderer.initTexture(L)}catch(U){L!==a.artworkMesh.material.map&&L.dispose();const w=U instanceof Error?U.message:String(U);return this.diagnostics.warn("hub-slot-texture-upload-failed","Hub artwork texture failed during GPU upload",{slotId:e.id,artworkId:e.artworkId,sourceUrlType:s,fit:c,failureReason:w}),{applied:!0,usedImage:!1,fit:c,failureStage:"gpu-upload",failureReason:w}}if(Ro({runtimeProtocol:Dn(),resolvedUrlType:s,debugEnabled:this.diagnostics.isDebugEnabled()})&&(d=dd(this.renderer,L),!d.pass))return L!==a.artworkMesh.material.map&&L.dispose(),this.diagnostics.warn("hub-slot-visible-probe-failed","Hub artwork texture bound but produced no visible pixels",{slotId:e.id,artworkId:e.artworkId,sourceUrlType:s,probe:d}),{applied:!0,usedImage:!1,fit:c,visibleProbe:d,failureStage:"visible-pixel-probe",failureReason:(b=d.reason)!=null?b:"probe-failed"}}else L=this.placeholderTexture(e.displayLabel),this.renderer.initTexture(L);a.textureKind==="image"&&((y=a.artworkMesh.material.map)==null||y.dispose()),a.artworkMesh.material.map=L,a.artworkMesh.material.needsUpdate=!0,a.textureKey=l,a.textureKind=r?"placeholder":"image"}const u=Bd(t.room,o,(_=e.placement.physicalHeight)!=null?_:e.placement.mountedHeight,Math.max(.25,e.artworkAspect),e.placement.mountingGap);if(!u)return a.group.visible=!1,this.render(),{applied:!1,usedImage:!1};const{width:h,height:f}=u,g=new R(u.basisU.x,u.basisU.y,u.basisU.z),v=new R(u.basisV.x,u.basisV.y,u.basisV.z),m=new R(u.basisN.x,u.basisN.y,u.basisN.z),p=new at().makeBasis(g,v,m);return a.group.matrixAutoUpdate=!1,p.setPosition(u.frontCenter.x,u.frontCenter.y,u.frontCenter.z),a.group.matrix.copy(p),a.group.matrixWorldNeedsUpdate=!0,a.group.visible=a.pageIndex===this.activePageIndex,a.artworkMesh.scale.set(h,f,1),a.edgeMesh.scale.set(h,f,Cd-.001),a.edgeMesh.position.set(0,0,-.023/2),a.shadowMesh.scale.set(h*1.012,f*1.016,1),a.shadowMesh.position.set(.006,-.009,-u.depth-u.mountingGap+.001),this.render(),{applied:!0,usedImage:!r,fit:c,visibleProbe:d}}dispose(){var e,t,n,r,s,a,o,l,c,d;if(!this.disposed){this.disposed=!0;for(const u of this.slotMeshes.values())u.textureKind==="image"&&((e=u.artworkMesh.material.map)==null||e.dispose()),u.artworkMesh.material.dispose();for(const u of this.placeholderTextures.values())u.dispose();this.shadowMaterial.dispose(),(t=this.contactShadowTexture)==null||t.dispose(),this.edgeGeometry.dispose(),this.artworkPlaneGeometry.dispose(),this.scene.traverse(u=>{const h=u;h.isMesh&&h.geometry!==this.edgeGeometry&&h.geometry!==this.artworkPlaneGeometry&&h.geometry.dispose()}),(r=(n=this.keyLight)==null?void 0:n.shadow.map)==null||r.dispose(),(s=this.reflectionTarget)==null||s.dispose(),(a=this.environmentTarget)==null||a.dispose(),(o=this.sky)==null||o.material.dispose(),(l=this.batterySky)==null||l.material.dispose(),(c=this.skylightGlassMaterial)==null||c.dispose(),(d=this.skylightGlassFallback)==null||d.dispose(),this.surfaceFactory.dispose(),this.renderer.dispose(),this.slotMeshes.clear(),this.pageGroups.clear()}}applyLensShift(){var n,r,s,a;const e=(r=(n=this.resolution.camera.lensShift)==null?void 0:n.x)!=null?r:0,t=(a=(s=this.resolution.camera.lensShift)==null?void 0:s.y)!=null?a:0;if(this.camera.updateProjectionMatrix(),e!==0||t!==0){const o=this.camera.projectionMatrix.elements;o[8]+=e*2,o[9]-=t*2,this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert()}this.reflectionCamera.projectionMatrix.copy(this.camera.projectionMatrix),this.reflectionCamera.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse)}buildLights(){const e=bu,t=new Ov(e.hemisphere.sky,e.hemisphere.ground,e.hemisphere.intensity),n=new Vc(e.key.color,e.key.intensity);n.position.set(...e.key.position),n.target.position.set(...e.key.target);const r=new Vc(e.fill.color,e.fill.intensity);r.position.set(...e.fill.position),r.target.position.set(...e.fill.target),this.keyLight=n,this.fillLight=r,this.scene.add(t,n,n.target,r,r.target);for(const o of this.coveRects()){const l=Math.max(.1,o.maxX-o.minX-e.ceilingPanel.edgeInset*2),c=Math.max(.1,o.maxZ-o.minZ-e.ceilingPanel.edgeInset),d=new Wc(e.ceilingPanel.color,e.ceilingPanel.intensity,l,c);d.position.set((o.minX+o.maxX)/2,this.resolution.room.ceilingY-e.ceilingPanel.ceilingOffset,(o.minZ+o.maxZ)/2),this.orientAreaLightIntoRoom(d),this.ceilingPanelLights.push(d),this.scene.add(d)}const s=this.clerestoryRect(),a=new Wc(e.skylightPanel.color,e.skylightPanel.intensity,Math.max(.1,s.maxX-s.minX-e.skylightPanel.edgeInset*2),Math.max(.1,s.maxZ-s.minZ-e.skylightPanel.edgeInset*2));a.position.set(0,this.resolution.room.ceilingY+xr-e.skylightPanel.ceilingOffset,(s.minZ+s.maxZ)/2),this.orientAreaLightIntoRoom(a),this.ceilingPanelLights.push(a),this.scene.add(a),this.applyLightingPreset(),this.applyShadowPreset()}orientAreaLightIntoRoom(e){e.lookAt(e.position.x+el[0],e.position.y+el[1],e.position.z+el[2])}applyLightingPreset(){const e=this.preset.id!=="battery";for(const t of this.ceilingPanelLights)t.visible=e;this.fillLight&&(this.fillLight.visible=!e)}applySkyPreset(){const e=this.preset.id==="battery";this.sky&&(this.sky.visible=!e),this.batterySky&&(this.batterySky.visible=e);const t=e?this.skylightGlassFallback:this.skylightGlassMaterial;if(t)for(const n of this.skylightGlassMeshes)n.material=t}applyShadowPreset(){var a;const e=this.keyLight;if(!e)return;const t=this.preset.hubShadows;e.castShadow!==t&&(e.castShadow=t);const n=this.preset.id==="high"?2048:1024;e.shadow.mapSize.x!==n&&(e.shadow.mapSize.set(n,n),(a=e.shadow.map)==null||a.dispose(),e.shadow.map=null);const r=this.resolution.room.bounds,s=Math.max(r.max.x-r.min.x,r.max.z-r.min.z)*.72;e.shadow.camera.left=-s,e.shadow.camera.right=s,e.shadow.camera.top=s,e.shadow.camera.bottom=-s,e.shadow.camera.near=.5,e.shadow.camera.far=24,e.shadow.bias=-6e-4,e.shadow.normalBias=.02,e.shadow.camera.updateProjectionMatrix()}logRenderingDiagnostics(){var s,a,o,l,c;const e=new R,t=new ni,n=this.ceilingPanelLights.map(d=>(d.getWorldQuaternion(t),e.set(0,0,-1).applyQuaternion(t).normalize(),{intensity:d.intensity,size:`${d.width.toFixed(2)}x${d.height.toFixed(2)}`,direction:e.toArray().map(u=>Number(u.toFixed(3))),visible:d.visible})),r=this.renderer.info;this.diagnostics.info("rendering-profile","Hub architectural rendering profile",{preset:this.preset.id,toneMapping:this.renderer.toneMapping,exposure:this.renderer.toneMappingExposure,environmentIntensity:this.scene.environment?this.scene.environmentIntensity:0,hemisphereIntensity:bu.hemisphere.intensity,directionalIntensity:(a=(s=this.keyLight)==null?void 0:s.intensity)!=null?a:0,areaLights:n,shadowMapSize:(o=this.keyLight)!=null&&o.castShadow?this.keyLight.shadow.mapSize.x:0,reflectionTarget:this.reflectionTarget?`${this.reflectionTarget.width}x${this.reflectionTarget.height}`:"off",drawCalls:r.render.calls,triangles:r.render.triangles,textures:r.memory.textures,programs:(c=(l=r.programs)==null?void 0:l.length)!=null?c:0})}applyEnvironment(){const e=this.preset.hubReflection!=="off";if(e&&!this.environmentTarget){const t=new Is(this.renderer);t.compileCubemapShader();const n=new kr;n.add(this.createAtmosphericSky()),this.environmentTarget=t.fromScene(n,.08),t.dispose(),n.traverse(r=>{const s=r;s.isMesh&&(s.geometry.dispose(),s.material.dispose())}),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=Sa.environmentIntensity}else!e&&this.environmentTarget&&(this.scene.environment=null,this.environmentTarget.dispose(),this.environmentTarget=null)}attachFloorReflectionShader(e){const t=this.reflectionUniforms,n=e.onBeforeCompile;e.onBeforeCompile=s=>{n(s,this.renderer),s.uniforms.uReflectionMap=t.uReflectionMap,s.uniforms.uReflectionMatrix=t.uReflectionMatrix,s.uniforms.uReflectionStrength=t.uReflectionStrength,s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
uniform mat4 uReflectionMatrix;
varying vec4 vHubReflectionCoord;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vec4 hubWorldPosition = modelMatrix * vec4( transformed, 1.0 );
vHubReflectionCoord = uReflectionMatrix * hubWorldPosition;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D uReflectionMap;
uniform float uReflectionStrength;
varying vec4 vHubReflectionCoord;`).replace("#include <opaque_fragment>",`if ( uReflectionStrength > 0.001 && vHubReflectionCoord.w > 0.0 ) {
  vec2 hubReflUv = vHubReflectionCoord.xy / vHubReflectionCoord.w;
  if ( all( greaterThan( hubReflUv, vec2( 0.0 ) ) ) && all( lessThan( hubReflUv, vec2( 1.0 ) ) ) ) {
    float hubFresnel = pow( 1.0 - saturate( dot( normalize( vViewPosition ), normal ) ), 3.0 );
    float hubWeight = uReflectionStrength * ( 0.35 + 0.65 * hubFresnel ) * ( 1.0 - roughnessFactor );
    vec3 hubReflection = texture2D( uReflectionMap, hubReflUv ).rgb;
    outgoingLight = mix( outgoingLight, hubReflection, clamp( hubWeight, 0.0, 1.0 ) );
  }
}
#include <opaque_fragment>`)};const r=e.customProgramCacheKey;e.customProgramCacheKey=()=>`hub-floor-reflection-${r()}`}applyReflectionMode(){var t,n;const e=this.preset.hubReflection;if(e==="planar"){const r=Math.max(1,this.preset.hubReflectionDivisor),s=Math.max(64,Math.floor(this.resolution.stage.width/r)),a=Math.max(64,Math.floor(this.resolution.stage.height/r));(!this.reflectionTarget||this.reflectionTarget.width!==s||this.reflectionTarget.height!==a)&&((t=this.reflectionTarget)==null||t.dispose(),this.reflectionTarget=new $t(s,a,{minFilter:1006,magFilter:1006}),this.reflectionTarget.texture.colorSpace=nn),this.reflectionUniforms.uReflectionMap.value=this.reflectionTarget.texture,this.reflectionUniforms.uReflectionStrength.value=this.preset.id==="high"?Sa.planarReflectionHigh:Sa.planarReflectionBalanced,this.materials.floor.roughness=.6}else this.reflectionUniforms.uReflectionMap.value=null,this.reflectionUniforms.uReflectionStrength.value=0,(n=this.reflectionTarget)==null||n.dispose(),this.reflectionTarget=null,this.materials.floor.roughness=e==="ibl"?.62:.76}renderReflection(){const e=this.reflectionTarget;if(!e||this.reflectionUniforms.uReflectionStrength.value<=0)return;const t=this.resolution.room.floorY,n=this.reflectionCamera;n.position.copy(this.camera.position),n.position.y=2*t-n.position.y,n.up.set(0,-1,0),n.lookAt(this.cameraTarget.x,2*t-this.cameraTarget.y,this.cameraTarget.z),n.updateMatrixWorld(!0),n.projectionMatrix.copy(this.camera.projectionMatrix),this.reflectionMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),this.reflectionMatrix.multiply(n.projectionMatrix),this.reflectionMatrix.multiply(n.matrixWorldInverse),this.reflectionUniforms.uReflectionMatrix.value.copy(this.reflectionMatrix);for(const s of this.floorMeshes)s.visible=!1;const r=this.renderer.toneMapping;this.renderer.toneMapping=0,this.renderer.setRenderTarget(e),this.renderer.render(this.scene,n),this.renderer.setRenderTarget(null),this.renderer.toneMapping=r;for(const s of this.floorMeshes)s.visible=!0}shellBounds(){const e=this.resolution.room.bounds,t=new R(e.min.x,this.resolution.room.floorY,e.min.z),n=new R(e.max.x,this.resolution.room.ceilingY,e.max.z),r=this.resolution.camera.position.z;return r+fu>n.z&&(n.z=r+fu),{min:t,max:n}}addQuad(e,t,n,r,s,a,o=this.scene){const l=new Yt(s,a),c=l.attributes.uv;for(let f=0;f<c.count;f+=1)c.setXY(f,c.getX(f)*s,c.getY(f)*a);const d=new He(l,e),u=new R().crossVectors(n,r).normalize(),h=new at().makeBasis(n,r,u);return h.setPosition(t.x+n.x*(s/2)+r.x*(a/2),t.y+n.y*(s/2)+r.y*(a/2),t.z+n.z*(s/2)+r.z*(a/2)),d.matrixAutoUpdate=!1,d.matrix.copy(h),d.matrixWorldNeedsUpdate=!0,d.receiveShadow=!0,o.add(d),d}buildRoom(){this.buildCalibratedWalls(),this.buildFloorAndCeiling(),this.buildEntryShell(),this.buildDoorwayPockets(),this.buildSkirting(),this.buildCeilingReveal()}buildCalibratedWalls(){var e,t,n;for(const r of this.resolution.walls){if(!r.room)continue;const s=ex(r);if(!s)continue;const a=new Hs(s),o=new He(a,this.materials.wall);o.receiveShadow=!0,o.matrixAutoUpdate=!1;const l=Bo(r.room),c=new R(r.room.axisU.x,r.room.axisU.y,r.room.axisU.z).normalize(),d=new R(r.room.axisV.x,r.room.axisV.y,r.room.axisV.z).normalize(),u=new R((e=l==null?void 0:l.x)!=null?e:0,(t=l==null?void 0:l.y)!=null?t:0,(n=l==null?void 0:l.z)!=null?n:1).normalize(),h=new at().makeBasis(c,d,u);h.setPosition(r.room.origin.x,r.room.origin.y,r.room.origin.z),o.matrix.copy(h),o.matrixWorldNeedsUpdate=!0,this.scene.add(o)}}buildFloorAndCeiling(){const e=this.shellBounds(),t=this.addQuad(this.materials.floor,new R(e.min.x,e.min.y,e.max.z),new R(1,0,0),new R(0,0,-1),e.max.x-e.min.x,e.max.z-e.min.z);this.floorMeshes.push(t);const n=this.coveRects(),r=this.clerestoryRect(),s=new yo;s.moveTo(e.min.x,e.min.z),s.lineTo(e.max.x,e.min.z),s.lineTo(e.max.x,e.max.z),s.lineTo(e.min.x,e.max.z),s.closePath();for(const l of n){const c=new Br;c.moveTo(l.minX,l.minZ),c.lineTo(l.maxX,l.minZ),c.lineTo(l.maxX,l.maxZ),c.lineTo(l.minX,l.maxZ),c.closePath(),s.holes.push(c)}const a=new Br;a.moveTo(r.minX,r.minZ),a.lineTo(r.maxX,r.minZ),a.lineTo(r.maxX,r.maxZ),a.lineTo(r.minX,r.maxZ),a.closePath(),s.holes.push(a);const o=new He(new Hs(s),this.materials.ceiling);o.rotation.x=Math.PI/2,o.position.y=e.max.y,o.castShadow=!0,o.receiveShadow=!0,this.scene.add(o);for(const l of n)this.buildCove(l,e.max.y);this.buildClerestory(r,e.max.y)}coveRects(){const e=this.resolution.room.bounds,t=e.max.z-e.min.z;if(e.max.x-e.min.x<4||t<5)return[];const n=e.min.z+vu,r=e.max.z-vu;return[{minX:e.min.x+ba,maxX:e.min.x+ba+gu,minZ:n,maxZ:r},{minX:e.max.x-ba-gu,maxX:e.max.x-ba,minZ:n,maxZ:r}]}clerestoryRect(){const e=this.resolution.room.bounds;return{minX:-xu/2,maxX:xu/2,minZ:e.min.z+_u,maxZ:e.max.z-_u}}buildCove(e,t){const n=e.maxZ-e.minZ;this.addQuad(this.materials.trim,new R(e.minX,t,e.maxZ),new R(0,0,-1),new R(0,1,0),n,yu).castShadow=!0,this.addQuad(this.materials.trim,new R(e.maxX,t,e.minZ),new R(0,0,1),new R(0,1,0),n,yu).castShadow=!0,this.addQuad(this.materials.lightStrip,new R(e.minX-.04,t+Qy,e.minZ-.04),new R(1,0,0),new R(0,0,1),e.maxX-e.minX+.08,n+.08)}buildClerestory(e,t){const n=e.maxX-e.minX,r=e.maxZ-e.minZ,s=t+xr;this.addQuad(this.materials.ceiling,new R(e.minX,t,e.maxZ),new R(0,0,-1),new R(0,1,0),r,xr).castShadow=!0,this.addQuad(this.materials.ceiling,new R(e.maxX,t,e.minZ),new R(0,0,1),new R(0,1,0),r,xr).castShadow=!0,this.addQuad(this.materials.ceiling,new R(e.minX,t,e.minZ),new R(1,0,0),new R(0,1,0),n,xr).castShadow=!0,this.addQuad(this.materials.ceiling,new R(e.maxX,t,e.maxZ),new R(-1,0,0),new R(0,1,0),n,xr).castShadow=!0,this.buildSkylightRoof(e,s),this.sky||(this.sky=this.createAtmosphericSky(),this.batterySky=this.createBatterySky(),this.scene.add(this.sky,this.batterySky)),this.applySkyPreset()}buildSkylightRoof(e,t){const n=(e.maxX-e.minX)/2,r=e.maxZ-e.minZ,s=Math.hypot(n,Qn),a=Math.atan2(Qn,n);this.skylightGlassMaterial=new Dc({color:new Le("#dbe8e9"),roughness:wn.glassRoughness,metalness:0,transmission:wn.glassTransmission,thickness:.018,ior:1.48,transparent:!0,opacity:.62,side:2,depthWrite:!1,envMapIntensity:.72}),this.skylightGlassFallback=new Yn({color:new Le("#d8e5e7"),transparent:!0,opacity:.42,side:2,depthWrite:!1,toneMapped:!0});const o=this.addQuad(this.skylightGlassMaterial,new R(e.minX,t,e.minZ),new R(0,0,1),new R(n/s,Qn/s,0),r,s),l=this.addQuad(this.skylightGlassMaterial,new R(e.maxX,t,e.maxZ),new R(0,0,-1),new R(-n/s,Qn/s,0),r,s);o.renderOrder=-1,l.renderOrder=-1,this.skylightGlassMeshes.push(o,l);const c=.045,d=new He(new Ut(c,c,r+.08),this.materials.trim);d.position.set(0,t+Qn,(e.minZ+e.maxZ)/2),d.castShadow=!0,this.scene.add(d);const u=new Ut(s+.06,c,c),h=new rv(u,this.materials.trim,wn.ribCount*2),f=new at,g=new R,v=new ni,m=new R(1,1,1);for(let p=0;p<wn.ribCount;p+=1){const b=e.minZ+r*p/(wn.ribCount-1);g.set(-n/2,t+Qn/2,b),v.setFromAxisAngle(new R(0,0,1),a),f.compose(g,v,m),h.setMatrixAt(p*2,f),g.set(n/2,t+Qn/2,b),v.setFromAxisAngle(new R(0,0,1),-a),f.compose(g,v,m),h.setMatrixAt(p*2+1,f)}h.instanceMatrix.needsUpdate=!0,h.castShadow=!0,this.scene.add(h)}createAtmosphericSky(){const e=new _a;e.scale.setScalar(80);const t=e.material.uniforms;return t.turbidity.value=wn.turbidity,t.rayleigh.value=wn.rayleigh,t.mieCoefficient.value=wn.mieCoefficient,t.mieDirectionalG.value=wn.mieDirectionalG,t.sunPosition.value.set(...wn.sunDirection),e.material.depthWrite=!1,e.renderOrder=-10,e}createBatterySky(){const e=new kt({side:1,depthWrite:!1,toneMapped:!0,vertexShader:["varying vec3 vWorldDirection;","void main() {","  vec4 worldPosition = modelMatrix * vec4(position, 1.0);","  vWorldDirection = normalize(worldPosition.xyz - cameraPosition);","  gl_Position = projectionMatrix * viewMatrix * worldPosition;","}"].join(`
`),fragmentShader:["varying vec3 vWorldDirection;","void main() {","  float horizon = smoothstep(-0.12, 0.72, vWorldDirection.y);","  vec3 low = vec3(0.78, 0.82, 0.82);","  vec3 high = vec3(0.60, 0.72, 0.80);","  gl_FragColor = vec4(mix(low, high, horizon), 1.0);","}"].join(`
`)}),t=new He(new bo(60,16,8),e);return t.renderOrder=-10,t}buildEntryShell(){const e=this.shellBounds(),t=this.resolution.room.bounds.max.z;if(e.max.z<=t+.01)return;const n=e.max.z-t,r=e.max.y-e.min.y;this.addQuad(this.materials.wall,new R(e.min.x,e.min.y,e.max.z),new R(0,0,-1),new R(0,1,0),n,r),this.addQuad(this.materials.wall,new R(e.max.x,e.min.y,t),new R(0,0,1),new R(0,1,0),n,r),this.addQuad(this.materials.wall,new R(e.max.x,e.min.y,e.max.z),new R(-1,0,0),new R(0,1,0),e.max.x-e.min.x,r)}buildDoorwayPockets(){for(const e of this.resolution.walls){const t=e.room;if(!t||t.doorwayExclusions.length===0)continue;const n=Bo(t);if(!n)continue;const r=new R(t.axisU.x,t.axisU.y,t.axisU.z).normalize(),s=new R(t.axisV.x,t.axisV.y,t.axisV.z).normalize(),a=new R(-n.x,-n.y,-n.z);for(const o of t.doorwayExclusions){const l=o.map(p=>p.x),c=o.map(p=>p.y),d=Math.min(...l),u=Math.max(...l),h=Math.min(...c),f=Math.max(...c),g=(p,b,y)=>{const _=es(t,{x:p,y:b});return new R(_.x,_.y,_.z).addScaledVector(a,y)},v=u-d,m=f-h;this.addQuad(this.materials.pocket,g(d,h,0),a.clone(),s.clone(),yr,m).castShadow=!0,this.addQuad(this.materials.pocket,g(u,h,yr),a.clone().negate(),s.clone(),yr,m).castShadow=!0,this.addQuad(this.materials.pocket,g(d,f,0),a.clone(),r.clone(),yr,v).castShadow=!0,this.floorMeshes.push(this.addQuad(this.materials.floor,g(d,h,0),r.clone(),a.clone(),v,yr)),this.addQuad(this.materials.pocket,g(d,h,yr),r.clone(),s.clone(),v,m)}}}buildSkirting(){const e=this.shellBounds(),t=this.resolution.room.bounds.max.z,n=new Ut(1,1,1),r=(s,a,o,l)=>{if(o<=.02)return;const c=new He(n,this.materials.trim);c.scale.set(o,pu,mu);const d=s.clone().addScaledVector(a,o/2).addScaledVector(l,-mu*.25).setY(e.min.y+pu/2);c.position.copy(d),Math.abs(a.z)>Math.abs(a.x)&&(c.rotation.y=Math.PI/2),this.scene.add(c)};for(const s of this.resolution.walls){const a=s.room;if(!a)continue;const o=Bo(a);if(!o)continue;const l=new R(a.axisU.x,a.axisU.y,a.axisU.z).normalize(),c=new R(o.x,o.y,o.z),d=a.doorwayExclusions.filter(f=>Math.min(...f.map(g=>g.y))<=.01).map(f=>({from:Math.min(...f.map(g=>g.x)),to:Math.max(...f.map(g=>g.x))})).sort((f,g)=>f.from-g.from);let u=0;for(const f of d){const g=es(a,{x:u,y:0});r(new R(g.x,g.y,g.z),l,f.from-u,c),u=f.to}const h=es(a,{x:u,y:0});r(new R(h.x,h.y,h.z),l,a.width-u,c)}if(e.max.z>t+.01){const s=e.max.z-t;r(new R(e.min.x,0,t),new R(0,0,1),s,new R(1,0,0)),r(new R(e.max.x,0,t),new R(0,0,1),s,new R(-1,0,0)),r(new R(e.min.x,0,e.max.z),new R(1,0,0),e.max.x-e.min.x,new R(0,0,-1))}}buildCeilingReveal(){const e=this.shellBounds(),t=this.resolution.room.bounds.min.z,n=new Ut(1,1,1),r=(s,a)=>{const o=new He(n,this.materials.trim);o.position.copy(s),o.scale.copy(a),this.scene.add(o)};r(new R(0,e.max.y-.018,t+.012),new R(e.max.x-e.min.x,.025,.024)),r(new R(e.min.x+.012,e.max.y-.018,(e.min.z+e.max.z)/2),new R(.024,.025,e.max.z-e.min.z)),r(new R(e.max.x-.012,e.max.y-.018,(e.min.z+e.max.z)/2),new R(.024,.025,e.max.z-e.min.z))}ensureSlotState(e){const t=this.slotMeshes.get(e.id);if(t)return t;const n=new Yn({transparent:!0,toneMapped:!1}),r=new He(this.artworkPlaneGeometry,n);r.castShadow=!1,r.receiveShadow=!1;const s=new He(this.edgeGeometry,this.materials.artworkEdge);s.castShadow=!0,s.receiveShadow=!1;const a=new He(this.artworkPlaneGeometry,this.shadowMaterial);a.renderOrder=1,s.renderOrder=2,r.renderOrder=3;const o=new Zn;o.add(a,s,r),this.ensurePageGroup(e.pageIndex).add(o);const c={pageIndex:e.pageIndex,group:o,artworkMesh:r,edgeMesh:s,shadowMesh:a,textureKind:null,textureKey:null};return this.slotMeshes.set(e.id,c),c}ensurePageGroup(e){const t=this.pageGroups.get(e);if(t)return t;const n=new Zn;return n.visible=e===this.activePageIndex,this.pageGroups.set(e,n),this.scene.add(n),n}effectiveAnisotropy(){try{return Math.min(4,this.renderer.capabilities.getMaxAnisotropy())}catch(e){return 1}}imageTexture(e){const t=this.renderer.capabilities.maxTextureSize,n=e.naturalWidth||e.width,r=e.naturalHeight||e.height,s=ld(e,n,r,t);s.downscaleApplied?this.diagnostics.warn("hub-slot-texture-downscaled","Downscaled oversized hub artwork texture to fit device capability",{sourceWidth:n,sourceHeight:r,uploadWidth:s.fit.targetWidth,uploadHeight:s.fit.targetHeight,maxTextureSize:t}):s.fit.needsDownscale&&this.diagnostics.warn("hub-slot-texture-oversized","Hub artwork texture exceeds device MAX_TEXTURE_SIZE and could not be downscaled",{sourceWidth:n,sourceHeight:r,maxTextureSize:t});const a=new Ct(s.image);return a.colorSpace=Nt,a.needsUpdate=!0,a.anisotropy=this.effectiveAnisotropy(),{texture:a,fit:s.fit}}contactShadowMap(){if(this.contactShadowTexture)return this.contactShadowTexture;const e=128,t=document.createElement("canvas");t.width=e,t.height=e;const n=t.getContext("2d");n&&(n.filter="blur(6px)",n.fillStyle="rgba(255,255,255,0.9)",n.beginPath(),n.moveTo(17,10),n.lineTo(e-10-7,10),n.quadraticCurveTo(e-10,10,e-10,17),n.lineTo(e-10,e-10-7),n.quadraticCurveTo(e-10,e-10,e-10-7,e-10),n.lineTo(17,e-10),n.quadraticCurveTo(10,e-10,10,e-10-7),n.lineTo(10,17),n.quadraticCurveTo(10,10,17,10),n.closePath(),n.fill());const r=new Ns(t);return r.colorSpace=Cn,this.contactShadowTexture=r,r}placeholderTexture(e){const t=this.placeholderTextures.get(e);if(t)return t;const n=document.createElement("canvas");n.width=hu,n.height=hu;const r=n.getContext("2d");if(!r){const l=new Ns(n);return this.placeholderTextures.set(e,l),l}r.fillStyle=this.resolution.visualTokens.museumWall,r.fillRect(0,0,n.width,n.height),r.strokeStyle="rgba(24, 32, 38, 0.22)",r.lineWidth=12,r.strokeRect(28,28,n.width-56,n.height-56),r.fillStyle="rgba(24, 32, 38, 0.72)",r.font="600 42px Inter, system-ui, sans-serif",r.textAlign="center",r.textBaseline="middle";const a=e.split(/\s+/).reduce((l,c)=>{var h;const d=(h=l[l.length-1])!=null?h:"",u=d?`${d} ${c}`:c;return u.length>14&&d?l.push(c):d?l[l.length-1]=u:l.push(c),l},[]).slice(0,3);a.forEach((l,c)=>{r.fillText(l,n.width/2,n.height/2+(c-(a.length-1)/2)*52)});const o=new Ns(n);return o.colorSpace=Nt,this.placeholderTextures.set(e,o),o}render(){this.disposed||(this.renderReflection(),this.renderer.render(this.scene,this.camera))}}function ex(i){var t,n,r,s,a,o,l,c;if(!i.room)return null;const e=new yo;e.moveTo(0,0),e.lineTo(i.room.width,0),e.lineTo(i.room.width,i.room.height),e.lineTo(0,i.room.height),e.lineTo(0,0);for(const d of i.room.doorwayExclusions){const u=new Br;u.moveTo((n=(t=d[0])==null?void 0:t.x)!=null?n:0,(s=(r=d[0])==null?void 0:r.y)!=null?s:0);for(let h=1;h<d.length;h+=1)u.lineTo(d[h].x,d[h].y);u.lineTo((o=(a=d[0])==null?void 0:a.x)!=null?o:0,(c=(l=d[0])==null?void 0:l.y)!=null?c:0),e.holes.push(u)}return e}const Su=window.location.protocol==="file:"?"../customer-artworks/":"/",tl=5e3,tx=2e4,nx="(max-aspect-ratio: 4/5)",ix=()=>{try{return new URLSearchParams(window.location.search).get("hubCalibrate")==="1"}catch(i){return!1}},rx=()=>{try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(i){return!1}};function Mu(i){return window.location.protocol==="file:"?`${Su}${i}`:`${Su}${i.replace(/^Backgrounds\//,"backgrounds/")}`}const an=class an{constructor(e,t,n){x(this,"element");x(this,"diagnostics",Jt("hub"));x(this,"resolution");x(this,"visual");x(this,"stage");x(this,"hubRoomRenderer");x(this,"roomLayers",[]);x(this,"slotViews",[]);x(this,"entryButton");x(this,"status");x(this,"pager");x(this,"pagerPrev");x(this,"pagerNext");x(this,"pagerCounter");x(this,"narrowQuery");x(this,"imageReady");x(this,"calibrating");x(this,"debugGeometry");x(this,"stageWidth");x(this,"stageHeight");x(this,"resizeObserver");x(this,"calibrationOutput",null);x(this,"calibrationWarnings",null);x(this,"calibrationRestoreButton",null);x(this,"calibrationWallSelect",null);x(this,"calibrationSvg",null);x(this,"calibrationDrag",null);x(this,"activeCalibrationWallId",null);x(this,"lastValidCalibrationSnapshot",null);x(this,"activateCallback",null);x(this,"selectSlotCallback",null);x(this,"disposed",!1);x(this,"pageCount",1);x(this,"viewIndex",0);x(this,"narrowMode",!1);x(this,"lastActivatedSlotId",null);x(this,"selectedArtworkId",null);x(this,"lastSelectionSignature",null);x(this,"decodedPages",new Set);x(this,"idleDecodeHandle",null);x(this,"idleDecodeNextPage",1);x(this,"projectedSlotGeometry",new Map);x(this,"debugProjectionSignatureBySlot",new Map);x(this,"swipeStartX",null);x(this,"swipeStartY",null);x(this,"resizeRafId",0);x(this,"handleActivate",()=>{var e;this.entryButton.disabled||(this.setButtonsDisabled(!0),(e=this.activateCallback)==null||e.call(this))});x(this,"handleNarrowChange",()=>{const e=this.narrowMode;if(this.narrowMode=this.narrowQuery.matches,e!==this.narrowMode){const t=e?Math.floor(this.viewIndex/an.NARROW_VIEWS_PER_PAGE):this.viewIndex;this.viewIndex=this.narrowMode?t*an.NARROW_VIEWS_PER_PAGE:t,this.applyView()}});x(this,"handleResize",()=>{this.resizeRafId===0&&(this.resizeRafId=requestAnimationFrame(()=>{this.resizeRafId=0,this.updateStageScale(),this.applyView(),this.applyAllSlotGeometry(),this.debugGeometry&&this.emitDebugGeometrySnapshot("resize")}))});x(this,"handleKeydown",e=>{this.calibrating||(e.key==="ArrowLeft"?(this.stepView(-1),e.preventDefault()):e.key==="ArrowRight"&&(this.stepView(1),e.preventDefault()))});x(this,"handleSwipeStart",e=>{this.calibrating||(this.swipeStartX=e.clientX,this.swipeStartY=e.clientY)});x(this,"handleSwipeEnd",e=>{if(this.swipeStartX===null||this.swipeStartY===null)return;const t=e.clientX-this.swipeStartX,n=e.clientY-this.swipeStartY;this.swipeStartX=null,this.swipeStartY=null,!(Math.abs(t)<56||Math.abs(t)<Math.abs(n)*1.4)&&this.stepView(t<0?1:-1)});x(this,"handleCalibrationMove",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;const n=this.pointerEventToStage(e);if(n){if(t.kind==="slot"){const r=this.resolution.wallById.get(t.slot.placement.wallId);if(!r)return;const s=r.inverseHomography?this.applyInverseHomography(r,n):null;if(!s)return;if(t.mode==="move")t.slot.placement.center=Z(this.clampLocalX(s.x),this.clampLocalY(s.y)),r.room&&(t.slot.placement.uv=Z(t.slot.placement.center.x,1-t.slot.placement.center.y),t.slot.placement.anchor=Z(t.slot.placement.center.x*r.room.width,(1-t.slot.placement.center.y)*r.room.height));else{const a=Math.abs(s.y-t.slot.placement.center.y)*2;t.slot.placement.mountedHeight=r.room?Math.max(.12,Math.min(r.room.height,a*r.room.height)):Math.max(.04,Math.min(.9,a))}this.applySlotGeometry(t.button,t.slot)}else{const r=this.resolution.wallById.get(t.wallId);if(!r)return;const a=(t.target==="quad"?r.quad:r.safePolygon)[t.index];if(!a)return;a.x=n.x,a.y=n.y,this.applyAllSlotGeometry()}this.renderCalibrationOverlay(),this.updateCalibrationOutput(!1)}});x(this,"handleCalibrationEnd",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;this.calibrationDrag=null;const n=e.currentTarget;n==null||n.removeEventListener("pointermove",this.handleCalibrationMove),n==null||n.removeEventListener("pointerup",this.handleCalibrationEnd),n==null||n.removeEventListener("pointercancel",this.handleCalibrationEnd),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)});var w,S,P,G;this.resolution=t,this.calibrating=ix(),this.debugGeometry=rx(),this.pageCount=Math.max(1,t.pages.length),this.stageWidth=t.stage.width,this.stageHeight=t.stage.height,this.activeCalibrationWallId=(S=(w=t.walls[0])==null?void 0:w.id)!=null?S:null;const r=document.createElement("section");r.className="museum-hub",r.setAttribute("aria-labelledby","museum-hub-title"),r.style.setProperty("--hub-aspect",String(t.background.aspect)),r.style.setProperty("--hub-stage-width",`${this.stageWidth}px`),r.style.setProperty("--hub-stage-height",`${this.stageHeight}px`),r.style.setProperty("--hub-stage-scale","1"),this.calibrating&&r.classList.add("is-calibrating"),this.debugGeometry&&r.classList.add("is-debug-geometry");const s=document.createElement("div");s.className="museum-hub__visual";const a=document.createElement("div");a.className="museum-hub__stage";const o=document.createElement("img");o.className="museum-hub__image",o.alt="",o.decoding="async",o.draggable=!1;const l=Mu(t.background.src),c=Mu(t.backgroundFallback.src),d=Ky({image:o,role:"background",primaryPath:t.background.src,primaryUrl:l,fallbackPath:t.backgroundFallback.src,fallbackUrl:c,timeoutMs:tl,diagnostics:this.diagnostics,context:{hubSource:t.source,stage:`${t.stage.width}x${t.stage.height}`,selectableSlots:t.slotToArtwork.size},onNeutralFallback:()=>{r.classList.add("has-image-error")}}).then(N=>{if(N.status==="neutral-fallback"){r.classList.add("has-image-error");return}r.classList.remove("has-image-error")}).catch(N=>{r.classList.add("has-image-error"),this.diagnostics.warn("hub-asset-loader-unexpected","Hub background loader threw unexpectedly; continuing with neutral museum-grey surface",{primaryPath:t.background.src,fallbackPath:t.backgroundFallback.src,error:N})});a.appendChild(o);let u=null;try{u=new Jy(a,t,n)}catch(N){const F=a.querySelector("canvas");Qc((P=F==null?void 0:F.getContext("webgl2"))!=null?P:null),F==null||F.remove(),r.classList.add("is-2d"),this.diagnostics.warn("renderer-fallback","Hub renderer failed; continuing with the accessible DOM museum",{stage:"hub-renderer-initialization",message:N instanceof Error?N.message:String(N),protocol:window.location.protocol})}this.hubRoomRenderer=u;const h=document.createElement("div");h.className="museum-hub__shade",h.setAttribute("aria-hidden","true");const f=document.createElement("header");f.className="museum-hub__header";const g=document.createElement("p");g.className="museum-hub__eyebrow",g.textContent="FREYRAUM";const v=document.createElement("h1");v.id="museum-hub-title",v.className="museum-hub__title",v.textContent="Museum";const m=document.createElement("p");m.className="museum-hub__introduction",m.textContent="Wählen Sie ein Kunstwerk, um die Ausstellung zu betreten.",f.append(g,v,m);const p=document.createElement("button");p.className="museum-hub__destination",p.type="button",p.setAttribute("aria-describedby","museum-hub-entry-description"),p.innerHTML=`
      <span class="museum-hub__destination-frame" aria-hidden="true"></span>
      <span class="museum-hub__destination-label">Ausstellung betreten</span>
    `;const b=document.createElement("p");b.id="museum-hub-entry-description",b.className="sr-only",b.textContent="Öffnet die interaktive Galerie mit Navigation, Detailansicht und Informationen zu den Kunstwerken.";const y=document.createElement("p");y.className="museum-hub__status sr-only",y.setAttribute("role","status"),y.setAttribute("aria-live","polite");const _=document.createElement("nav");_.className="museum-hub__pager",_.setAttribute("aria-label","Museumsräume");const L=document.createElement("button");L.type="button",L.className="museum-hub__pager-arrow museum-hub__pager-arrow--prev",L.setAttribute("aria-label","Vorherige Wand"),L.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';const C=document.createElement("span");C.className="museum-hub__pager-counter",C.setAttribute("aria-live","polite");const T=document.createElement("button");T.type="button",T.className="museum-hub__pager-arrow museum-hub__pager-arrow--next",T.setAttribute("aria-label","Nächste Wand"),T.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',_.append(L,C,T),a.appendChild(p),s.appendChild(a),r.append(s,h,f,b,_,y),e.appendChild(r),this.element=r,this.visual=s,this.stage=a,this.entryButton=p,this.status=y,this.pager=_,this.pagerPrev=L,this.pagerNext=T,this.pagerCounter=C,this.entryButton.addEventListener("click",this.handleActivate),L.addEventListener("click",()=>this.stepView(-1)),T.addEventListener("click",()=>this.stepView(1)),this.buildSlots();const U=this.resolution.slotToArtwork.size>0;this.entryButton.hidden=U,this.narrowQuery=window.matchMedia(nx),this.narrowMode=this.narrowQuery.matches,this.narrowQuery.addEventListener("change",this.handleNarrowChange),this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.handleResize()):null,(G=this.resizeObserver)==null||G.observe(this.visual),window.addEventListener("resize",this.handleResize),r.addEventListener("pointerdown",this.handleSwipeStart,{passive:!0}),r.addEventListener("pointerup",this.handleSwipeEnd,{passive:!0}),r.addEventListener("keydown",this.handleKeydown),(this.calibrating||this.debugGeometry)&&(this.buildCalibrationOverlay(),this.calibrating&&this.buildCalibrationPanel(r),this.renderCalibrationOverlay()),this.imageReady=Promise.all([d,this.decodePageImages(0)]).then(()=>{this.applyView(!0),this.updateStageScale(),this.applyAllSlotGeometry(),this.applySelectionState("composition-ready"),this.scheduleIdlePageDecode(),this.calibrating&&this.updateCalibrationOutput(!0),this.debugGeometry&&this.emitDebugGeometrySnapshot("composition-ready"),this.diagnostics.info("composition-ready","Hub composition prepared",{pages:this.pageCount,selectableSlots:this.resolution.slotToArtwork.size,source:this.resolution.source,debugGeometry:this.debugGeometry})})}onActivate(e){this.activateCallback=e}applyPreset(e){var t;this.disposed||(t=this.hubRoomRenderer)==null||t.applyPreset(e)}onSelectSlot(e){this.selectSlotCallback=e}setSelectedArtworkId(e,t={}){var s;const n=e&&this.resolution.artworkToSlot.has(e)?e:null;this.selectedArtworkId=n;const r=n?this.slotViews.find(a=>a.slot.artworkId===n&&!a.button.disabled):void 0;r&&t.alignPage!==!1&&this.goToPage(r.slot.pageIndex,r.slot),this.applySelectionState((s=t.source)!=null?s:"external-selection-sync",{restoreFocus:t.restoreFocus===!0})}prepare(){return this.imageReady}enter(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="",this.scheduleIdlePageDecode(),this.applySelectionState("enter"),requestAnimationFrame(()=>this.focusInitialTarget()))}async exit(e){this.disposed||(this.cancelIdlePageDecode(),this.setButtonsDisabled(!0),this.status.textContent="Ausstellung wird geöffnet.",this.element.classList.add("is-exiting"),e||await new Promise(t=>window.setTimeout(t,520)),this.disposed||(this.element.hidden=!0))}showError(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",this.focusInitialTarget())}focusInitialTarget(){var r;const e=this.selectedArtworkId?this.slotViews.find(s=>s.slot.artworkId===this.selectedArtworkId&&!s.button.disabled):void 0;if(e){this.goToPage(e.slot.pageIndex,e.slot),e.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-selected-target");return}const t=this.lastActivatedSlotId?this.slotViews.find(s=>s.slot.id===this.lastActivatedSlotId&&!s.button.disabled):void 0;if(t){this.goToPage(t.slot.pageIndex,t.slot),t.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-restored-slot");return}const n=this.slotViews.find(s=>s.slot.selectable);((r=n==null?void 0:n.button)!=null?r:this.entryButton).focus({preventScroll:!0}),this.logSelectionLifecycle("focus-first-target")}applySelectionState(e,t={}){var s,a;let n;for(const o of this.slotViews){const l=!!this.selectedArtworkId&&o.slot.artworkId===this.selectedArtworkId;o.button.classList.toggle("is-selected",l),l?(o.button.setAttribute("aria-current","true"),n=o):o.button.removeAttribute("aria-current")}const r=`${e}:${(s=this.selectedArtworkId)!=null?s:"none"}:${(a=n==null?void 0:n.slot.id)!=null?a:"none"}:${this.viewIndex}`;this.lastSelectionSignature!==r&&(this.lastSelectionSignature=r,this.logSelectionLifecycle(e)),t.restoreFocus&&n&&n.button.focus({preventScroll:!0})}logSelectionLifecycle(e){var n,r,s;const t=this.selectedArtworkId?this.slotViews.find(a=>a.slot.artworkId===this.selectedArtworkId):void 0;this.diagnostics.info("hub-selection-lifecycle","Hub selection lifecycle updated",{reason:e,selectedArtworkId:this.selectedArtworkId,selectedSlotId:(n=t==null?void 0:t.slot.id)!=null?n:null,selectedPageIndex:(r=t==null?void 0:t.slot.pageIndex)!=null?r:null,currentViewIndex:this.viewIndex,currentWallFocus:(s=this.element.dataset.wallFocus)!=null?s:"full",lastActivatedSlotId:this.lastActivatedSlotId,renderedSlots:this.slotViews.length})}setButtonsDisabled(e){this.entryButton.disabled=e;for(const t of this.slotViews)t.button.disabled=e||!t.slot.selectable;e?(this.pagerPrev.disabled=!0,this.pagerNext.disabled=!0):(this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1)}buildSlots(){const e=document.createElement("div");e.className="museum-hub__rooms";for(const t of this.resolution.pages){const n=document.createElement("div");n.className="museum-hub__room",n.dataset.page=String(t.pageIndex);for(const r of t.slots){if(!this.calibrating&&!this.debugGeometry&&(!r.selectable||!r.artworkId))continue;const s=this.buildSlotButton(r);n.appendChild(s.button),this.slotViews.push(s)}e.appendChild(n),this.roomLayers.push(n)}this.stage.appendChild(e)}buildSlotButton(e){const t=document.createElement("button");t.type="button",t.className="museum-hub__artwork",t.dataset.slotId=e.id,e.artworkId&&(t.dataset.artworkId=e.artworkId);let n=null;if(e.selectable&&e.artworkId){t.setAttribute("aria-label",`Kunstwerk „${e.displayLabel}“ in der Ausstellung öffnen`),n=document.createElement("img"),n.className="museum-hub__art",n.alt="",n.decoding="async",n.draggable=!1,t.appendChild(n);const a=document.createElement("span");a.className="museum-hub__art-placeholder",a.textContent=e.displayLabel,t.appendChild(a)}else t.disabled=!0,t.classList.add("is-disabled-slot"),t.setAttribute("aria-label","Nicht verfügbarer Ausstellungsplatz"),t.setAttribute("aria-disabled","true");const r=document.createElement("span");if(r.className="museum-hub__artwork-label",r.setAttribute("aria-hidden","true"),r.textContent=this.calibrating||this.debugGeometry?`${e.id} · ${e.displayLabel}`:e.displayLabel,t.appendChild(r),this.calibrating){const a=document.createElement("span");a.className="museum-hub__artwork-handle",a.setAttribute("aria-hidden","true"),t.appendChild(a),t.disabled=!1,t.addEventListener("pointerdown",o=>{const l=o.target;this.startSlotCalibrationDrag(o,e,t,l!=null&&l.classList.contains("museum-hub__artwork-handle")?"resize":"move")})}else e.selectable&&t.addEventListener("click",()=>this.handleSlotClick(e));this.applySlotGeometry(t,e);const s={slot:e,button:t,image:n,imageLoadToken:0,imageState:"idle",resolvedSource:null,fallbackReason:null,lastUpsertResult:null};return this.syncSlotRenderer(s),s}applySlotGeometry(e,t){var u,h,f;const n=this.resolution.wallById.get(t.placement.wallId);if(!n){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),(u=this.hubRoomRenderer)==null||u.setSlotHidden(t.id),e.style.width="0px",e.style.height="0px",e.style.clipPath="none",e.style.removeProperty("--hub-clip-path"),this.diagnostics.warn("hub-slot-missing-wall","Hub slot geometry skipped because the wall is missing",{slotId:t.id,wallId:t.placement.wallId});return}const r=da(n,t.placement,Math.max(.25,t.artworkAspect),this.resolution.stage);if(!r){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),(h=this.hubRoomRenderer)==null||h.setSlotHidden(t.id),e.style.width="0px",e.style.height="0px",e.style.clipPath="none",e.style.removeProperty("--hub-clip-path"),this.diagnostics.warn("hub-slot-projection-invalid","Hub slot projection is invalid and will not render interactively",{slotId:t.id,artworkId:t.artworkId,wallId:n.id,projectionRealism:n.projectionRealism});return}this.projectedSlotGeometry.set(t.id,r),e.classList.remove("is-invalid-geometry");const s=r.projectedQuad.reduce((g,v)=>({minX:Math.min(g.minX,v.x),maxX:Math.max(g.maxX,v.x),minY:Math.min(g.minY,v.y),maxY:Math.max(g.maxY,v.y)}),{minX:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY}),a=Math.max(1,s.maxX-s.minX),o=Math.max(1,s.maxY-s.minY),l=`polygon(${r.projectedQuad.map(g=>`${((g.x-s.minX)/a*100).toFixed(3)}% ${((g.y-s.minY)/o*100).toFixed(3)}%`).join(", ")})`;e.style.left=`${s.minX}px`,e.style.top=`${s.minY}px`,e.style.width=`${a}px`,e.style.height=`${o}px`,e.style.transform="none",e.style.clipPath=l,e.style.setProperty("--hub-clip-path",l);const c=(f=n.shadowVector)!=null?f:Z(n.group==="left"?-10:10,16);e.style.setProperty("--hub-shadow-x",`${c.x}px`),e.style.setProperty("--hub-shadow-y",`${c.y}px`);const d=this.slotViews.find(g=>g.slot.id===t.id);d&&this.syncSlotRenderer(d),this.debugGeometry&&this.logSlotProjection(t,n,r)}syncSlotRenderer(e){var r,s;if(!this.hubRoomRenderer){e.lastUpsertResult=null;return}const t=this.resolution.wallById.get(e.slot.placement.wallId);if(!t)return;const n=e.imageState!=="ready"||!e.image||!e.image.complete||e.image.naturalWidth<=0;e.lastUpsertResult=this.hubRoomRenderer.upsertSlot(e.slot,t,e.image,n,(s=(r=e.resolvedSource)==null?void 0:r.resolvedUrlType)!=null?s:null)}applyAllSlotGeometry(){for(const e of this.slotViews)this.applySlotGeometry(e.button,e.slot);this.applySelectionState("geometry-refresh"),(this.calibrating||this.debugGeometry)&&this.renderCalibrationOverlay()}logSlotProjection(e,t,n){var a,o,l,c,d,u;const r=n.projectedQuad.map(h=>`${h.x.toFixed(1)},${h.y.toFixed(1)}`).join("|");if(this.debugProjectionSignatureBySlot.get(e.id)===r)return;this.debugProjectionSignatureBySlot.set(e.id,r);const s=n.projectedQuad.every(h=>gi(h,t.safePolygon));this.diagnostics.info("hub-debug-slot-projection","Projected slot geometry snapshot",{slotId:e.id,wallId:t.id,selectedArtworkId:this.selectedArtworkId,localAnchor:(a=e.placement.anchor)!=null?a:null,localQuad:n.localQuad,worldQuad:(o=n.worldQuad)!=null?o:null,projectedAnchor:(l=n.projectedAnchor)!=null?l:null,projectedQuad:n.projectedQuad,homography:t.homography,inverseHomography:t.inverseHomography,withinSafePolygon:s,shortEdgePx:Math.round(n.shortEdge*100)/100,placement:n.placement,validity:(c=n.validity)!=null?c:null,realism:(u=(d=n.realism)!=null?d:t.projectionRealism)!=null?u:null})}emitDebugGeometrySnapshot(e){if(!this.debugGeometry)return;const t=this.slotViews.filter(({slot:n})=>n.selectable&&!!n.artworkId).map(({slot:n,imageState:r,resolvedSource:s,fallbackReason:a})=>{var c,d,u,h,f,g,v,m,p,b;const o=this.resolution.wallById.get(n.placement.wallId),l=this.projectedSlotGeometry.get(n.id);return{slotId:n.id,wallId:n.placement.wallId,imageState:r,sourceMode:(c=s==null?void 0:s.mode)!=null?c:null,sourceUrlType:(d=s==null?void 0:s.resolvedUrlType)!=null?d:null,bundleId:(u=s==null?void 0:s.bundleId)!=null?u:null,fallbackReason:a,localQuad:(h=l==null?void 0:l.localQuad)!=null?h:null,worldQuad:(f=l==null?void 0:l.worldQuad)!=null?f:null,projectedAnchor:(g=l==null?void 0:l.projectedAnchor)!=null?g:null,projectedQuad:(v=l==null?void 0:l.projectedQuad)!=null?v:null,homography:(m=o==null?void 0:o.homography)!=null?m:null,inverseHomography:(p=o==null?void 0:o.inverseHomography)!=null?p:null,withinSafePolygon:o&&l?l.projectedQuad.every(y=>gi(y,o.safePolygon)):!1,validity:(b=l==null?void 0:l.validity)!=null?b:null}});this.diagnostics.info("hub-debug-geometry","Hub debug geometry snapshot",{reason:e,stage:this.resolution.stage,visualTokens:this.resolution.visualTokens,backgroundState:{imageError:this.element.classList.contains("has-image-error")},selection:{selectedArtworkId:this.selectedArtworkId,lastActivatedSlotId:this.lastActivatedSlotId},walls:this.resolution.walls.map(n=>({id:n.id,group:n.group,quad:n.quad,safePolygon:n.safePolygon,referenceQuad:n.referenceQuad,referenceSafePolygon:n.referenceSafePolygon,projectedQuad:n.projectedQuad,projectedSafePolygon:n.projectedSafePolygon,projectedDoorways:n.room&&n.camera?Gd(n.room,n.camera,this.resolution.stage):[],projectionRealism:n.projectionRealism,expectedConvergence:n.expectedConvergence})),slots:t})}scheduleIdlePageDecode(){if(this.disposed||this.idleDecodeHandle!==null)return;for(;this.idleDecodeNextPage<this.pageCount&&this.decodedPages.has(this.idleDecodeNextPage);)this.idleDecodeNextPage+=1;if(this.idleDecodeNextPage>=this.pageCount)return;const e=typeof window.requestIdleCallback=="function"?t=>window.requestIdleCallback(t,{timeout:4e3}):t=>window.setTimeout(t,600);this.idleDecodeHandle=e(()=>{if(this.idleDecodeHandle=null,this.disposed)return;const t=this.idleDecodeNextPage;this.idleDecodeNextPage+=1,this.decodePageImages(t).then(()=>this.scheduleIdlePageDecode())})}cancelIdlePageDecode(){this.idleDecodeHandle!==null&&(typeof window.cancelIdleCallback=="function"?window.cancelIdleCallback(this.idleDecodeHandle):window.clearTimeout(this.idleDecodeHandle),this.idleDecodeHandle=null)}decodePageImages(e){if(this.decodedPages.has(e))return Promise.resolve();this.decodedPages.add(e);const t=[];for(const n of this.slotViews)n.slot.pageIndex!==e||!n.image||!n.slot.artworkId||t.push(this.resolveSlotImage(n));return Promise.all(t).then(()=>{})}async resolveSlotImage(e){var h,f,g,v,m,p,b,y,_,L,C,T,U,w;const t=e.slot.artworkId&&(h=this.resolution.artworkSourceById.get(e.slot.artworkId))!=null?h:null,n=pi(t),r=Dn(),s=T0({runtimeProtocol:r,resolvedUrlType:(g=(f=n.primary)==null?void 0:f.resolvedUrlType)!=null?g:null,debugEnabled:this.diagnostics.isDebugEnabled()},!!n.fallback),a=s&&n.fallback?n.fallback:n.primary,o=s?null:n.fallback,l=(a==null?void 0:a.mode)==="embedded-webgl-fallback",c=this.now();if(!a||!e.image||!e.slot.artworkId){this.setSlotImageState(e,"missing",null,"no-source"),this.diagnostics.warn("artwork-image-missing","Hub artwork image is unavailable; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:(m=(v=n.fallback)==null?void 0:v.bundleId)!=null?m:null,fallbackReason:"no-source"}),e.slot.artworkId&&or(this.diagnostics,{route:"hub",artworkId:e.slot.artworkId,bundleId:(b=(p=n.fallback)==null?void 0:p.bundleId)!=null?b:null,runtimeProtocol:r,candidateMode:null,resolvedUrlType:null,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,result:"failed",firstFailedStage:"candidate-selected",failureReason:"no-source",elapsedMs:Math.round(this.now()-c),sourceWidth:null,sourceHeight:null,uploadWidth:null,uploadHeight:null,downscaleApplied:!1,rendererMaxTextureSize:(_=(y=this.hubRoomRenderer)==null?void 0:y.getMaxTextureSize())!=null?_:null,visibleProbe:null});return}this.setSlotImageState(e,"loading",null,null);const d=await this.loadSlotImageCandidate(e,a);if(d.status==="ready"){const S=this.applyResolvedSlotSource(e,a,null,"loaded",d);if(S.status==="ready"){this.recordHubSourceToPixelOutcome(e,{bundleId:a.bundleId,candidateMode:a.mode,resolvedUrlType:a.resolvedUrlType,usedEmbeddedFallback:l,attemptedEmbeddedFallback:l,startedAt:c});return}const P=`${a.mode}:${S.stage}:${S.reason}`,G=e.lastUpsertResult,N=ud({runtimeProtocol:r,resolvedUrlType:a.resolvedUrlType,debugEnabled:this.diagnostics.isDebugEnabled()},!!o);if(o&&N){this.diagnostics.warn("artwork-image-retry","Hub artwork source failed after GPU upload; retrying embedded fallback",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:P,visibleProbe:(L=G==null?void 0:G.visibleProbe)!=null?L:null});const F=await this.loadSlotImageCandidate(e,o);if(F.status==="ready"){const V=this.applyResolvedSlotSource(e,o,P,"fallback-loaded",F);if(V.status==="ready"){this.recordHubSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c});return}const J=`${o.mode}:${V.stage}:${V.reason}`,X=e.lastUpsertResult;this.setSlotImageState(e,"missing",null,J),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:J,attemptedSources:[{sourceMode:a.mode,url:Qe(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:Qe(o.resolvedUrl),urlType:o.resolvedUrlType}],visibleProbe:(C=X==null?void 0:X.visibleProbe)!=null?C:null}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c,stage:V.stage,failureReason:J,upsert:X});return}const W=`${o.mode}:${F.reason}`;this.setSlotImageState(e,"missing",null,W),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:W,attemptedSources:[{sourceMode:a.mode,url:Qe(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:Qe(o.resolvedUrl),urlType:o.resolvedUrlType}]}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,startedAt:c,stage:this.slotAttemptFailureStage(F.reason),failureReason:W,upsert:null});return}this.setSlotImageState(e,"missing",null,P),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:a.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:o?Qe(o.resolvedUrl):null,declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:(T=o==null?void 0:o.resolvedUrlType)!=null?T:null,fallbackReason:P,attemptedSources:[{sourceMode:a.mode,url:Qe(a.resolvedUrl),urlType:a.resolvedUrlType},...N&&o?[{sourceMode:o.mode,url:Qe(o.resolvedUrl),urlType:o.resolvedUrlType}]:[]],visibleProbe:(U=G==null?void 0:G.visibleProbe)!=null?U:null}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:a.bundleId,candidateMode:a.mode,resolvedUrlType:a.resolvedUrlType,usedEmbeddedFallback:l,attemptedEmbeddedFallback:l,startedAt:c,stage:S.stage,failureReason:P,upsert:G});return}const u=`${a.mode}:${d.reason}`;if(o){this.diagnostics.warn("artwork-image-retry","Hub artwork source failed; retrying embedded fallback",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:u});const S=await this.loadSlotImageCandidate(e,o);if(S.status==="ready"){const G=this.applyResolvedSlotSource(e,o,u,"fallback-loaded",S);if(G.status==="ready"){this.recordHubSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c});return}const N=`${o.mode}:${G.stage}:${G.reason}`,F=e.lastUpsertResult;this.setSlotImageState(e,"missing",null,N),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:N,attemptedSources:[{sourceMode:a.mode,url:Qe(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:Qe(o.resolvedUrl),urlType:o.resolvedUrlType}],visibleProbe:(w=F==null?void 0:F.visibleProbe)!=null?w:null}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c,stage:G.stage,failureReason:N,upsert:F});return}const P=`${o.mode}:${S.reason}`;this.setSlotImageState(e,"missing",null,P),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:Qe(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:P,attemptedSources:[{sourceMode:a.mode,url:Qe(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:Qe(o.resolvedUrl),urlType:o.resolvedUrlType}]}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,startedAt:c,stage:this.slotAttemptFailureStage(S.reason),failureReason:P,upsert:null});return}this.setSlotImageState(e,"missing",null,u),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:a.bundleId,declaredImageUrl:Qe(a.declaredUrl),fallbackImageUrl:null,declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:null,fallbackReason:u,attemptedSources:[{sourceMode:a.mode,url:Qe(a.resolvedUrl),urlType:a.resolvedUrlType}]}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:a.bundleId,candidateMode:a.mode,resolvedUrlType:a.resolvedUrlType,usedEmbeddedFallback:l,attemptedEmbeddedFallback:l,startedAt:c,stage:this.slotAttemptFailureStage(d.reason),failureReason:u,upsert:null})}recordHubSourceToPixelOutcome(e,t){var r,s,a,o,l,c,d,u,h,f,g,v,m;if(!e.slot.artworkId)return;const n=e.lastUpsertResult;or(this.diagnostics,{route:"hub",artworkId:e.slot.artworkId,bundleId:t.bundleId,runtimeProtocol:Dn(),candidateMode:t.candidateMode,resolvedUrlType:t.resolvedUrlType,usedEmbeddedFallback:t.usedEmbeddedFallback,attemptedEmbeddedFallback:t.attemptedEmbeddedFallback,result:"success",firstFailedStage:null,failureReason:null,elapsedMs:Math.round(this.now()-t.startedAt),sourceWidth:(s=(r=n==null?void 0:n.fit)==null?void 0:r.sourceWidth)!=null?s:null,sourceHeight:(o=(a=n==null?void 0:n.fit)==null?void 0:a.sourceHeight)!=null?o:null,uploadWidth:(c=(l=n==null?void 0:n.fit)==null?void 0:l.targetWidth)!=null?c:null,uploadHeight:(u=(d=n==null?void 0:n.fit)==null?void 0:d.targetHeight)!=null?u:null,downscaleApplied:(f=(h=n==null?void 0:n.fit)==null?void 0:h.needsDownscale)!=null?f:!1,rendererMaxTextureSize:(v=(g=this.hubRoomRenderer)==null?void 0:g.getMaxTextureSize())!=null?v:null,visibleProbe:(m=n==null?void 0:n.visibleProbe)!=null?m:null})}recordHubFailedSourceToPixelOutcome(e,t){var n,r,s,a,o,l,c,d,u,h,f,g,v,m,p,b,y,_,L;e.slot.artworkId&&or(this.diagnostics,{route:"hub",artworkId:e.slot.artworkId,bundleId:t.bundleId,runtimeProtocol:Dn(),candidateMode:t.candidateMode,resolvedUrlType:t.resolvedUrlType,usedEmbeddedFallback:t.usedEmbeddedFallback,attemptedEmbeddedFallback:t.attemptedEmbeddedFallback,result:"failed",firstFailedStage:t.stage,failureReason:t.failureReason,elapsedMs:Math.round(this.now()-t.startedAt),sourceWidth:(s=(r=(n=t.upsert)==null?void 0:n.fit)==null?void 0:r.sourceWidth)!=null?s:null,sourceHeight:(l=(o=(a=t.upsert)==null?void 0:a.fit)==null?void 0:o.sourceHeight)!=null?l:null,uploadWidth:(u=(d=(c=t.upsert)==null?void 0:c.fit)==null?void 0:d.targetWidth)!=null?u:null,uploadHeight:(g=(f=(h=t.upsert)==null?void 0:h.fit)==null?void 0:f.targetHeight)!=null?g:null,downscaleApplied:(p=(m=(v=t.upsert)==null?void 0:v.fit)==null?void 0:m.needsDownscale)!=null?p:!1,rendererMaxTextureSize:(y=(b=this.hubRoomRenderer)==null?void 0:b.getMaxTextureSize())!=null?y:null,visibleProbe:(L=(_=t.upsert)==null?void 0:_.visibleProbe)!=null?L:null})}applyResolvedSlotSource(e,t,n,r,s){this.setSlotImageState(e,"ready",t,n);const a=this.getSlotRenderFailure(e);return a?{status:"failed",...a}:(this.diagnostics.info("artwork-source-resolved","Hub artwork source resolved",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:t.bundleId,sourceMode:t.mode,declaredImageUrl:Qe(t.declaredUrl),resolvedImageUrl:Qe(t.resolvedUrl),declaredImageUrlType:t.declaredUrlType,resolvedImageUrlType:t.resolvedUrlType,requestStatus:r,decodeStatus:"decoded",textureWidth:s.width,textureHeight:s.height,fallbackReason:n}),{status:"ready"})}getSlotRenderFailure(e){var n,r,s;const t=(n=e.lastUpsertResult)==null?void 0:n.failureStage;return t?{stage:t,reason:(s=(r=e.lastUpsertResult)==null?void 0:r.failureReason)!=null?s:"unknown-failure"}:null}slotAttemptFailureStage(e){return e==="decode-error"||e==="decode-timeout"?"decode":e==="no-source"?"candidate-selected":"request"}now(){return typeof performance!="undefined"?performance.now():Date.now()}setSlotImageState(e,t,n,r){e.imageState=t,e.resolvedSource=n,e.fallbackReason=r,e.button.classList.toggle("has-missing-image",t==="missing"),e.button.dataset.artworkSourceState=t,n?(e.button.dataset.artworkSourceMode=n.mode,e.button.dataset.artworkUrlType=n.resolvedUrlType):(delete e.button.dataset.artworkSourceMode,delete e.button.dataset.artworkUrlType),r?e.button.dataset.artworkFallbackReason=r:delete e.button.dataset.artworkFallbackReason,this.syncSlotRenderer(e)}async loadSlotImageCandidate(e,t){if(!e.image)return{status:"failed",reason:"no-source"};const n=++e.imageLoadToken,r=e.image,s=t.resolvedUrlType==="data-uri"?tx:tl,a=await new Promise(l=>{let c=!1;const d=g=>{c||(c=!0,window.clearTimeout(f),r.removeEventListener("load",u),r.removeEventListener("error",h),l(g))},u=()=>d("loaded"),h=()=>d("error"),f=window.setTimeout(()=>d("timeout"),s);r.addEventListener("load",u),r.addEventListener("error",h),r.src=t.resolvedUrl,r.complete&&r.naturalWidth>0&&d("loaded")});if(n!==e.imageLoadToken)return{status:"failed",reason:"load-timeout"};if(a==="error")return{status:"failed",reason:"load-error"};if(a==="timeout")return{status:"failed",reason:"load-timeout"};if(r.naturalWidth<=0||r.naturalHeight<=0)return{status:"failed",reason:"load-error"};const o=await this.decodeSlotImage(r,s);return o!=="decoded"?{status:"failed",reason:o==="timeout"?"decode-timeout":"decode-error"}:{status:"ready",width:r.naturalWidth,height:r.naturalHeight}}async decodeSlotImage(e,t=tl){return typeof e.decode!="function"?"decoded":new Promise(n=>{let r=!1;const s=o=>{r||(r=!0,window.clearTimeout(a),n(o))},a=window.setTimeout(()=>s("timeout"),t);e.decode().then(()=>s("decoded"),()=>s("error"))})}handleSlotClick(e){var t;this.entryButton.disabled||(this.setButtonsDisabled(!0),this.lastActivatedSlotId=e.id,this.setSelectedArtworkId(e.artworkId,{alignPage:!1,source:"slot-click"}),this.status.textContent="Ausstellung wird geöffnet.",(t=this.selectSlotCallback)==null||t.call(this,e))}get viewCount(){return this.narrowMode?this.pageCount*an.NARROW_VIEWS_PER_PAGE:this.pageCount}stepView(e){const t=this.viewIndex+e;t<0||t>=this.viewCount||(this.viewIndex=t,this.applyView())}goToPage(e,t){var n;if(this.narrowMode){const r=Math.max(0,an.NARROW_WALL_ORDER.indexOf((n=t==null?void 0:t.wallGroup)!=null?n:"front"));this.viewIndex=e*an.NARROW_VIEWS_PER_PAGE+r}else this.viewIndex=e;this.applyView()}applyView(e=!1){var s,a;if(this.disposed)return;this.viewIndex=Math.max(0,Math.min(this.viewCount-1,this.viewIndex));const t=this.narrowMode?Math.floor(this.viewIndex/an.NARROW_VIEWS_PER_PAGE):this.viewIndex,n=this.narrowMode?an.NARROW_WALL_ORDER[this.viewIndex%an.NARROW_VIEWS_PER_PAGE]:"full";(s=this.hubRoomRenderer)==null||s.setActivePage(t);for(const o of this.roomLayers){const l=Number.parseInt((a=o.dataset.page)!=null?a:"0",10);o.classList.toggle("is-active",l===t)}this.element.dataset.wallFocus=n,n==="full"?(this.visual.style.setProperty("--hub-focus-scale","1"),this.visual.style.setProperty("--hub-focus-x","0%")):n==="front"?(this.visual.style.setProperty("--hub-focus-scale","1.45"),this.visual.style.setProperty("--hub-focus-x","0%")):(this.visual.style.setProperty("--hub-focus-scale","1.9"),this.visual.style.setProperty("--hub-focus-x",n==="left"?"24%":"-24%"));for(const o of this.slotViews)o.button.classList.toggle("is-off-wall",n!=="full"&&o.slot.wallGroup!==n);const r=this.viewCount>1;if(this.pager.hidden=!r,r){this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1;const o=n==="front"?"Frontwand":n==="left"?"Linke Wand":"Rechte Wand";this.pagerCounter.textContent=this.narrowMode?`Raum ${t+1}/${this.pageCount} · ${o}`:`Raum ${t+1} / ${this.pageCount}`}this.applySelectionState(e?"initial-view":"view-change"),e||this.decodePageImages(t)}updateStageScale(){const e=this.visual.getBoundingClientRect();if(e.width<=0||e.height<=0)return;const t=Math.min(e.width/this.stageWidth,e.height/this.stageHeight);this.element.style.setProperty("--hub-stage-scale",String(t))}buildCalibrationOverlay(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.classList.add("museum-hub__calibration-svg"),e.setAttribute("viewBox",`0 0 ${this.stageWidth} ${this.stageHeight}`),e.setAttribute("aria-hidden","true"),this.stage.appendChild(e),this.calibrationSvg=e}buildCalibrationPanel(e){const t=document.createElement("div");t.className="museum-hub__calibration";const n=document.createElement("p");n.className="museum-hub__calibration-title",n.textContent="Hub-Kalibrierung — Wände, Safe-Zonen und Bildgrößen in customer-artworks/museum-hub.json speichern";const r=document.createElement("div");r.className="museum-hub__calibration-controls";const s=document.createElement("label");s.className="museum-hub__calibration-label",s.textContent="Aktive Wand";const a=document.createElement("select");a.className="museum-hub__calibration-select";for(const u of this.resolution.walls){const h=document.createElement("option");h.value=u.id,h.textContent=`${u.id} (${u.group})`,a.appendChild(h)}this.activeCalibrationWallId&&(a.value=this.activeCalibrationWallId),a.addEventListener("change",()=>{this.activeCalibrationWallId=a.value,this.renderCalibrationOverlay()}),s.appendChild(a);const o=document.createElement("button");o.type="button",o.className="museum-hub__calibration-restore",o.textContent="Letzte gültige Konfiguration wiederherstellen",o.disabled=!0,o.addEventListener("click",()=>this.restoreLastValidCalibrationSnapshot()),r.append(s,o);const l=document.createElement("p");l.className="museum-hub__calibration-label",l.textContent="Prüfungen";const c=document.createElement("ul");c.className="museum-hub__calibration-warnings";const d=document.createElement("textarea");d.className="museum-hub__calibration-output",d.readOnly=!0,d.rows=16,d.setAttribute("aria-label","Museum-Hub-Konfiguration als JSON"),t.append(n,r,l,c,d),e.appendChild(t),this.calibrationOutput=d,this.calibrationWarnings=c,this.calibrationRestoreButton=o,this.calibrationWallSelect=a}startSlotCalibrationDrag(e,t,n,r){e.preventDefault(),this.calibrationDrag={kind:"slot",slot:t,button:n,pointerId:e.pointerId,mode:r},n.setPointerCapture(e.pointerId),n.addEventListener("pointermove",this.handleCalibrationMove),n.addEventListener("pointerup",this.handleCalibrationEnd),n.addEventListener("pointercancel",this.handleCalibrationEnd)}startWallPointCalibrationDrag(e,t,n,r){e.preventDefault();const s=e.currentTarget;this.calibrationDrag={kind:"wall-point",wallId:t,pointerId:e.pointerId,target:n,index:r},s.setPointerCapture(e.pointerId),s.addEventListener("pointermove",this.handleCalibrationMove),s.addEventListener("pointerup",this.handleCalibrationEnd),s.addEventListener("pointercancel",this.handleCalibrationEnd)}pointerEventToStage(e){const t=this.visual.getBoundingClientRect();return t.width<=0||t.height<=0?null:Z(Math.min(this.stageWidth,Math.max(0,(e.clientX-t.left)/t.width*this.stageWidth)),Math.min(this.stageHeight,Math.max(0,(e.clientY-t.top)/t.height*this.stageHeight)))}renderCalibrationOverlay(){if(!this.calibrationSvg)return;this.calibrationSvg.replaceChildren();const e=this.activeCalibrationWallId;for(const t of this.resolution.walls){const n=this.calibrating?t.id===e:!0,r=document.createElementNS("http://www.w3.org/2000/svg","polygon");r.setAttribute("points",this.pointsToSvg(t.quad)),r.setAttribute("class",`museum-hub__calibration-wall${n?" is-active":""}`),this.calibrating&&r.addEventListener("pointerdown",()=>{this.activeCalibrationWallId=t.id,this.calibrationWallSelect&&(this.calibrationWallSelect.value=t.id),this.renderCalibrationOverlay()}),this.calibrationSvg.appendChild(r);const s=document.createElementNS("http://www.w3.org/2000/svg","polygon");s.setAttribute("points",this.pointsToSvg(t.safePolygon)),s.setAttribute("class",`museum-hub__calibration-safe${n?" is-active":""}`),this.calibrationSvg.appendChild(s),this.debugGeometry&&(this.renderProjectedDoorwayDebugOverlay(t),this.renderWallDebugAxes(t)),!(!this.calibrating||!n)&&(t.quad.forEach((a,o)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"quad",o,a,"museum-hub__calibration-handle"))),t.safePolygon.forEach((a,o)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"safe",o,a,"museum-hub__calibration-handle museum-hub__calibration-handle--safe"))))}this.debugGeometry&&(this.renderCameraDebugGuides(),this.renderProjectedSlotDebugOverlay())}createCalibrationHandle(e,t,n,r,s){const a=document.createElementNS("http://www.w3.org/2000/svg","circle");return a.setAttribute("class",s),a.setAttribute("cx",r.x.toFixed(2)),a.setAttribute("cy",r.y.toFixed(2)),a.setAttribute("r","8"),a.addEventListener("pointerdown",o=>this.startWallPointCalibrationDrag(o,e,t,n)),a}renderWallDebugAxes(e){if(!this.calibrationSvg||!e.homography)return;const t=vi(e.homography,.1,.1),n=vi(e.homography,.28,.1),r=vi(e.homography,.1,.28);if(!t||!n||!r)return;this.appendSvgLine(t,n,"museum-hub__debug-axis museum-hub__debug-axis--x"),this.appendSvgLine(t,r,"museum-hub__debug-axis museum-hub__debug-axis--y"),this.appendSvgCircle(t,"museum-hub__debug-origin",3.8);const s=e.projectionRealism,a=s?`${e.id} · ref ${s.referenceResidualMaxPx.toFixed(1)}px · ${s.projectedConvergence}`:e.id;this.appendSvgLabel(Z(t.x+8,t.y-8),a,"museum-hub__debug-wall-label")}renderProjectedDoorwayDebugOverlay(e){if(!(!this.calibrationSvg||!e.room||!e.camera))for(const t of Gd(e.room,e.camera,this.resolution.stage)){const n=document.createElementNS("http://www.w3.org/2000/svg","polygon");n.setAttribute("points",this.pointsToSvg(t)),n.setAttribute("class","museum-hub__debug-doorway"),this.calibrationSvg.appendChild(n)}}renderProjectedSlotDebugOverlay(){var e;if(this.calibrationSvg)for(const{slot:t}of this.slotViews){if(!t.selectable||!t.artworkId)continue;const n=this.resolution.wallById.get(t.placement.wallId),r=this.projectedSlotGeometry.get(t.id);if(!n||!r||!n.homography)continue;const s=vi(n.homography,t.placement.center.x,t.placement.center.y);this.calibrationSvg.appendChild(this.createProjectedQuadElement(r.projectedQuad)),s&&this.appendSvgCircle(s,"museum-hub__debug-slot-center",3.2),r.projectedQuad.forEach(o=>this.appendSvgCircle(o,"museum-hub__debug-slot-corner",2.8));const a=r.projectedQuad[0];if(a){const o=t.placement.anchor?`L ${t.placement.anchor.x.toFixed(2)},${t.placement.anchor.y.toFixed(2)}`:`L ${t.placement.center.x.toFixed(2)},${t.placement.center.y.toFixed(2)}`,l=s?`S ${s.x.toFixed(0)},${s.y.toFixed(0)}`:"S –",c=r.projectedAnchor?`P ${r.projectedAnchor.x.toFixed(0)},${r.projectedAnchor.y.toFixed(0)}`:"P –",d=t.artworkId&&t.artworkId===this.selectedArtworkId?"selected":"idle";this.appendSvgLabel(Z(a.x+8,a.y-8),`${t.id} · ${t.placement.wallId} · ${d} · ${o} · ${l} · ${c} · ${(e=r.validity)!=null&&e.contained&&r.validity.doorwayClear&&r.validity.inHangingBand?"valid":"invalid"}`,"museum-hub__debug-slot-label")}}}renderCameraDebugGuides(){const e=this.resolution.camera,t=pr(e,{x:e.target.x,y:e.target.y,z:e.target.z-24},this.resolution.stage);t&&(this.appendSvgLine(Z(0,t.y),Z(this.stageWidth,t.y),"museum-hub__debug-horizon"),this.appendSvgLabel(Z(12,Math.max(18,t.y-8)),"camera horizon","museum-hub__debug-camera-label"));for(const n of this.resolution.walls){if(!n.room)continue;const r=Z(n.room.width/2,n.room.height/2),s=l=>({x:n.room.origin.x+n.room.axisU.x*l+n.room.axisV.x*r.y,y:n.room.origin.y+n.room.axisU.y*l+n.room.axisV.y*r.y,z:n.room.origin.z+n.room.axisU.z*l+n.room.axisV.z*r.y}),a=pr(e,s(r.x),this.resolution.stage),o=pr(e,s(r.x+40),this.resolution.stage);a&&o&&this.appendSvgLine(a,o,"museum-hub__debug-vanishing")}}createProjectedQuadElement(e){const t=document.createElementNS("http://www.w3.org/2000/svg","polygon");return t.setAttribute("points",this.pointsToSvg(e)),t.setAttribute("class","museum-hub__debug-slot-quad"),t}appendSvgLine(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","line");r.setAttribute("class",n),r.setAttribute("x1",e.x.toFixed(2)),r.setAttribute("y1",e.y.toFixed(2)),r.setAttribute("x2",t.x.toFixed(2)),r.setAttribute("y2",t.y.toFixed(2)),this.calibrationSvg.appendChild(r)}appendSvgCircle(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.setAttribute("class",t),r.setAttribute("cx",e.x.toFixed(2)),r.setAttribute("cy",e.y.toFixed(2)),r.setAttribute("r",n.toFixed(1)),this.calibrationSvg.appendChild(r)}appendSvgLabel(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","text");r.setAttribute("class",n),r.setAttribute("x",e.x.toFixed(2)),r.setAttribute("y",e.y.toFixed(2)),r.textContent=t,this.calibrationSvg.appendChild(r)}pointsToSvg(e){return e.map(t=>`${t.x.toFixed(2)},${t.y.toFixed(2)}`).join(" ")}applyInverseHomography(e,t){if(!e.inverseHomography)return null;const[n,r,s,a,o,l,c,d,u]=e.inverseHomography,h=c*t.x+d*t.y+u;return Math.abs(h)<=1e-6?null:Z((n*t.x+r*t.y+s)/h,(a*t.x+o*t.y+l)/h)}clampLocalX(e){return Math.min(1,Math.max(0,e))}clampLocalY(e){return Math.min(1,Math.max(0,e))}collectCalibrationWarnings(){var n;const e=[];for(const r of this.resolution.walls)(Jr(r.quad)||!ur(r.quad))&&e.push(`Wall ${r.id}: the calibrated wall quad must remain convex and non-degenerate.`),r.safePolygon.length<3&&e.push(`Wall ${r.id}: the safe polygon needs at least three points.`);const t=new Map;for(const r of this.slotViews){const{slot:s}=r;if(!s.selectable||!s.artworkId)continue;const a=this.resolution.wallById.get(s.placement.wallId);if(!a){e.push(`Slot ${s.id}: wall ${s.placement.wallId} is missing.`);continue}const o=da(a,s.placement,s.artworkAspect,this.resolution.stage);if(!o){e.push(`Slot ${s.id}: projected geometry is invalid.`);continue}o.projectedQuad.every(c=>gi(c,a.safePolygon))||e.push(`Slot ${s.id}: artwork extends outside the wall safe zone.`),o.shortEdge<ha&&e.push(`Slot ${s.id}: projected short edge ${o.shortEdge.toFixed(1)}px is below ${ha}px.`);const l=(n=t.get(s.pageIndex))!=null?n:[];l.push({slot:s,quad:o}),t.set(s.pageIndex,l)}for(const[r,s]of t)for(let a=0;a<s.length;a+=1){const o=s[a];for(let l=a+1;l<s.length;l+=1){const c=s[l];Do(o.quad.projectedQuad,c.quad.projectedQuad)&&e.push(`Page ${r+1}: ${o.slot.id} overlaps ${c.slot.id}.`)}}return e}buildCurrentCalibrationConfig(){return{version:4,coverage:"all-active-artworks",stage:this.resolution.stage,background:this.resolution.background,backgroundFallback:this.resolution.backgroundFallback,visualTokens:this.resolution.visualTokens,camera:this.resolution.camera,room:{dimensions:this.resolution.room.dimensions,floorY:this.resolution.room.floorY,ceilingY:this.resolution.room.ceilingY,floorOutline:this.resolution.room.floorOutline.map(e=>({x:this.round(e.x),z:this.round(e.z)}))},hangingRules:this.resolution.hangingRules,walls:this.resolution.walls.map(e=>({id:e.id,group:e.group,planeAspect:Math.round(e.planeAspect*1e3)/1e3,quad:e.quad.map(t=>this.roundPoint(t)),safePolygon:e.safePolygon.map(t=>this.roundPoint(t)),...e.shadowVector?{shadowVector:this.roundPoint(e.shadowVector)}:{},...e.room?{room:{origin:e.room.origin,axisU:e.room.axisU,axisV:e.room.axisV,width:e.room.width,height:e.room.height,safePolygon:e.room.safePolygon.map(t=>this.roundPoint(t)),doorwayExclusions:e.room.doorwayExclusions.map(t=>t.map(n=>this.roundPoint(n))),hangingBand:e.room.hangingBand}}:{},...e.transform?{transform:e.transform}:{},...e.drawableRegion?{drawableRegion:e.drawableRegion}:{},...e.exclusionPolygons?{exclusionPolygons:e.exclusionPolygons}:{},...e.hangingBand?{hangingBand:e.hangingBand}:{}})),fallbacks:{requireAllMapped:!0,autoPlaceUnmapped:!0,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:this.resolution.selectionTimeoutMs,selectionTimeout:"open-exact-target-procedural"},slots:this.slotViews.map(({slot:e})=>({id:e.id,enabled:e.disabledReason!=="explicitly-disabled",selectable:e.selectable,...e.artworkId?{artworkId:e.artworkId}:{},placement:{wallId:e.placement.wallId,center:this.roundPoint(e.placement.center),...e.placement.anchor?{anchor:this.roundPoint(e.placement.anchor)}:{},...e.placement.uv?{uv:this.roundPoint(e.placement.uv)}:{},mountedHeight:this.round(e.placement.mountedHeight),...typeof e.placement.targetSizePolicy=="string"?{targetSizePolicy:e.placement.targetSizePolicy}:{},...typeof e.placement.minScale=="number"?{minScale:this.round(e.placement.minScale)}:{},...typeof e.placement.maxScale=="number"?{maxScale:this.round(e.placement.maxScale)}:{},...typeof e.placement.zOffset=="number"?{zOffset:this.round(e.placement.zOffset)}:{},...e.placement.provisional?{provisional:!0}:{}}}))}}updateCalibrationOutput(e){const t=this.buildCurrentCalibrationConfig(),n=this.collectCalibrationWarnings(),r=JSON.stringify(t,null,2);if(this.calibrationOutput&&(this.calibrationOutput.value=r),this.calibrationWarnings){this.calibrationWarnings.replaceChildren();const s=n.length>0?n:["Keine Warnungen — Konfiguration erfüllt alle Kalibrierungsprüfungen."];for(const a of s){const o=document.createElement("li");o.textContent=a,this.calibrationWarnings.appendChild(o)}}n.length===0&&e&&(this.lastValidCalibrationSnapshot=r,this.calibrationRestoreButton&&(this.calibrationRestoreButton.disabled=!1)),this.diagnostics.info("hub-calibration","Museum hub wall-plane calibration snapshot",{warnings:n,config:t})}restoreLastValidCalibrationSnapshot(){var n,r;if(!this.lastValidCalibrationSnapshot)return;const t=au(JSON.parse(this.lastValidCalibrationSnapshot)).config;if(t){for(const s of t.walls){const a=this.resolution.wallById.get(s.id);if(!a||!s.quad)continue;const o=s.quad;a.quad.forEach((c,d)=>{c.x=o[d].x,c.y=o[d].y});const l=(n=s.safePolygon)!=null?n:[];a.safePolygon.splice(0,a.safePolygon.length,...l.map(c=>tt(c))),a.planeAspect=s.planeAspect,s.shadowVector&&(a.shadowVector=tt(s.shadowVector)),s.transform&&(a.transform=s.transform),a.drawableRegion=s.drawableRegion,a.exclusionPolygons=s.exclusionPolygons,a.hangingBand=s.hangingBand,s.room&&(a.room={origin:{...s.room.origin},axisU:{...s.room.axisU},axisV:{...s.room.axisV},width:s.room.width,height:s.room.height,safePolygon:s.room.safePolygon.map(tt),doorwayExclusions:s.room.doorwayExclusions.map(c=>c.map(tt)),hangingBand:{...s.room.hangingBand}})}for(const s of t.slots){const a=(r=this.slotViews.find(o=>o.slot.id===s.id))==null?void 0:r.slot;a&&(a.placement.wallId=s.placement.wallId,a.placement.center=tt(s.placement.center),a.placement.anchor=s.placement.anchor?tt(s.placement.anchor):void 0,a.placement.uv=s.placement.uv?tt(s.placement.uv):void 0,a.placement.mountedHeight=s.placement.mountedHeight,a.placement.targetSizePolicy=s.placement.targetSizePolicy,a.placement.minScale=s.placement.minScale,a.placement.maxScale=s.placement.maxScale,a.placement.zOffset=s.placement.zOffset,a.placement.provisional=s.placement.provisional===!0)}this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)}}round(e){return Math.round(e*1e3)/1e3}roundPoint(e){return Z(this.round(e.x),this.round(e.y))}dispose(){var e,t;this.disposed||(this.disposed=!0,this.cancelIdlePageDecode(),this.resizeRafId!==0&&cancelAnimationFrame(this.resizeRafId),(e=this.resizeObserver)==null||e.disconnect(),this.narrowQuery.removeEventListener("change",this.handleNarrowChange),window.removeEventListener("resize",this.handleResize),this.element.removeEventListener("pointerdown",this.handleSwipeStart),this.element.removeEventListener("pointerup",this.handleSwipeEnd),this.element.removeEventListener("keydown",this.handleKeydown),this.entryButton.removeEventListener("click",this.handleActivate),this.activateCallback=null,this.selectSlotCallback=null,(t=this.hubRoomRenderer)==null||t.dispose(),this.projectedSlotGeometry.clear(),this.debugProjectionSignatureBySlot.clear(),this.slotViews.length=0,this.roomLayers.length=0,this.element.remove())}};x(an,"NARROW_VIEWS_PER_PAGE",3),x(an,"NARROW_WALL_ORDER",["front","left","right"]);let nl=an;class sx{constructor(e={}){x(this,"destinations",new Map);x(this,"options");x(this,"active",null);x(this,"transition",null);x(this,"generation",0);x(this,"disposed",!1);x(this,"state","loading");this.options=e}register(e){if(this.disposed)throw new Error("Cannot register a destination after disposal.");if(this.destinations.has(e.id))throw new Error(`Destination "${e.id}" is already registered.`);this.destinations.set(e.id,e)}async startAt(e){var n;if(this.active||this.transition)throw new Error("Destination router has already started.");const t=this.requireDestination(e);await((n=t.prepare)==null?void 0:n.call(t)),!this.disposed&&(await t.enter(),!this.disposed&&(this.active=t,this.setState(e==="hub"?"hub":"destination")))}navigate(e){var r;if(this.disposed||((r=this.active)==null?void 0:r.id)===e)return Promise.resolve(!1);if(this.transition)return this.transition;const t=this.requireDestination(e),n=++this.generation;return this.setState("transitioning"),this.transition=this.runTransition(t,n).finally(()=>{this.generation===n&&(this.transition=null)}),this.transition}async runTransition(e,t){var r,s,a,o;const n=this.active;try{return await((r=e.prepare)==null?void 0:r.call(e)),!this.isCurrent(t)||(await((s=n==null?void 0:n.exit)==null?void 0:s.call(n)),!this.isCurrent(t))||(await e.enter(),!this.isCurrent(t))?!1:(this.active=e,this.setState(e.id==="hub"?"hub":"destination"),!0)}catch(l){if(!this.isCurrent(t))return!1;if(n){if(await n.enter(),!this.isCurrent(t))return!1;this.active=n,this.setState(n.id==="hub"?"hub":"destination")}return(o=(a=this.options).onTransitionError)==null||o.call(a,e,l),!1}}requireDestination(e){const t=this.destinations.get(e);if(!t)throw new Error(`Unknown destination "${e}".`);return t}isCurrent(e){return!this.disposed&&this.generation===e}setState(e){var t,n,r,s;this.state=e,(s=(r=this.options).onStateChange)==null||s.call(r,e,(n=(t=this.active)==null?void 0:t.id)!=null?n:null)}get currentState(){return this.state}dispose(){this.disposed||(this.disposed=!0,this.generation+=1,this.destinations.forEach(e=>{var t;return(t=e.dispose)==null?void 0:t.call(e)}),this.destinations.clear(),this.active=null,this.transition=null)}}const ax=300,wu=200,ox=50;class lx{constructor(){x(this,"diagnostics",Jt("audio"));x(this,"audio",new Audio);x(this,"source",null);x(this,"disposed",!1);x(this,"suspended",!1);x(this,"shouldResumeAfterSuspend",!1);x(this,"state",{available:!1,loaded:!1,playing:!1,muted:!1,targetVolume:dr,liveVolume:dr,autoplayBlocked:!1,message:null,activeSource:null});x(this,"listeners",new Set);x(this,"fadeRafHandle",null);x(this,"fadeStartTime",0);x(this,"fadeStartGain",0);x(this,"fadeTargetGain",0);x(this,"fadeDurationMs",0);x(this,"fadeOnComplete",null);x(this,"tickFade",e=>{this.fadeStartTime===0&&(this.fadeStartTime=e);const t=e-this.fadeStartTime,n=this.fadeDurationMs>0?Math.min(1,t/this.fadeDurationMs):1,r=this.fadeStartGain+(this.fadeTargetGain-this.fadeStartGain)*n;if(this.audio.volume=Math.max(0,Math.min(1,r)),this.state={...this.state,liveVolume:this.audio.volume},this.emit(),n<1)this.fadeRafHandle=requestAnimationFrame(this.tickFade);else{this.fadeRafHandle=null,this.diagnostics.debug("audio-fade-complete","Volume fade completed",{gain:this.fadeTargetGain});const s=this.fadeOnComplete;this.fadeOnComplete=null,s==null||s()}});this.audio.preload="auto",this.audio.loop=!0,this.audio.defaultMuted=!1,this.audio.removeAttribute("muted"),this.audio.muted=!1,this.audio.volume=dr,this.bindEvents()}load(e){if(this.disposed)return;this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-load-mute-desync","Repairing muted state desync before loading source",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted);const t=this.pickPlayableSource(e);if(!t){this.audio.removeAttribute("src"),this.audio.load(),this.state={...this.state,available:!1,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:null},this.emit(),this.diagnostics.info("audio-load-empty","No background audio source available");return}this.source=t,this.audio.src=t.src,this.audio.load(),this.state={...this.state,available:!0,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:t},this.emit(),this.diagnostics.info("audio-load-start","Background audio source selected",{file:t.filename,ext:t.ext,mime:t.mime})}subscribe(e){return this.listeners.add(e),e({...this.state}),()=>this.listeners.delete(e)}getState(){return{...this.state}}hasSource(){return!!this.source}async play(e){if(this.disposed||!this.source||this.suspended||this.state.muted)return!1;if(this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-play-mute-desync","Repairing muted state desync before play",{reason:e,expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),!this.audio.paused&&this.state.playing)return this.shouldResumeAfterSuspend=!0,this.diagnostics.debug("audio-play-skip","Play request ignored because audio is already playing",{reason:e}),!0;this.shouldResumeAfterSuspend=!0,this.cancelFade(),this.audio.volume=0,this.state={...this.state,liveVolume:0};try{return await this.audio.play(),this.startFade(this.state.targetVolume,ax,"fade-in"),this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-play",`Background audio playing (${e})`,{reason:e}),!0}catch(t){this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume};const r=(t instanceof Error?t.name:"UnknownError")==="NotAllowedError";return this.state={...this.state,playing:!1,autoplayBlocked:r,message:r?"Klicken Sie auf Ton aktivieren, um Hintergrundmusik zu starten.":"Hintergrundmusik konnte nicht gestartet werden."},this.emit(),this.diagnostics.warn(r?"audio-play-blocked":"audio-play-failed",r?"Background audio blocked by autoplay policy":"Background audio failed to start",{reason:e,error:t}),this.diagnostics.debug("audio-resume-attempt","Play attempt outcome",{reason:e,blocked:r,success:!1}),!1}}pause(e){this.disposed||!this.source||(this.shouldResumeAfterSuspend=!1,this.startFade(0,wu,"fade-out",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-pause",`Background audio paused (${e})`,{reason:e}))}setMuted(e,t){if(!this.disposed){if(this.state.muted===e&&this.audio.muted===e){this.diagnostics.debug("audio-mute-unchanged","Mute request ignored because state is unchanged",{reason:t,muted:e});return}this.state.muted===e&&this.audio.muted!==e&&this.diagnostics.warn("audio-mute-state-desync","Repairing muted state desync between manager and audio element",{reason:t,expectedMuted:e,actualMuted:this.audio.muted}),this.audio.muted=e,this.state={...this.state,muted:e},e?(this.shouldResumeAfterSuspend=!1,this.startFade(0,wu,"fade-out-mute",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1}):!this.disposed&&this.source&&!this.suspended&&this.play(`unmute:${t}`),this.emit(),this.diagnostics.info("audio-mute-change",`Background audio mute changed (${t})`,{reason:t,muted:e})}}setVolume(e,t){if(this.disposed)return;const n=Math.max(0,Math.min(mi,e));this.fadeRafHandle!==null?this.fadeTargetGain=n:this.state.muted||(this.audio.volume=n,this.state={...this.state,liveVolume:n}),this.state={...this.state,targetVolume:n},this.emit(),this.diagnostics.info("audio-volume-change",`Background audio volume changed (${t})`,{reason:t,targetGain:n,liveGain:this.audio.volume}),this.diagnostics.debug("audio-volume-map","Volume mapping record",{targetGain:n,displayPct:ta(n),liveGain:this.audio.volume,reason:t})}handleSuspend(e){this.disposed||this.suspended||(this.suspended=!0,this.shouldResumeAfterSuspend=!this.audio.paused&&!this.state.muted,this.cancelFade(),this.audio.paused||this.audio.pause(),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-lifecycle-suspend",`Background audio suspended (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}))}handleResume(e){this.disposed||!this.suspended||(this.suspended=!1,this.diagnostics.info("audio-lifecycle-resume",`Background audio resumed (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}),this.shouldResumeAfterSuspend&&!this.state.muted&&(this.diagnostics.debug("audio-resume-attempt","Attempting auto-resume after lifecycle resume",{reason:e}),this.play(`resume:${e}`)))}dispose(){this.disposed||(this.disposed=!0,this.cancelFade(),this.listeners.clear(),this.audio.pause(),this.audio.removeAttribute("src"),this.audio.load())}bindEvents(){this.audio.addEventListener("canplay",()=>{this.state={...this.state,loaded:!0},this.emit(),this.diagnostics.info("audio-canplay","Background audio can play")}),this.audio.addEventListener("playing",()=>{this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-playing","Background audio playing event")}),this.audio.addEventListener("pause",()=>{this.state={...this.state,playing:!1},this.emit(),this.diagnostics.debug("audio-pause-event","Background audio pause event")}),this.audio.addEventListener("ended",()=>{this.source&&(this.diagnostics.warn("audio-loop-restart","Audio ended unexpectedly while loop is enabled; restarting"),this.startFade(0,ox,"fade-out-loop",()=>{this.audio.currentTime=0,this.play("ended-fallback")}))}),this.audio.addEventListener("error",()=>{const e=this.audio.error;this.state={...this.state,playing:!1,message:"Hintergrundmusik konnte nicht geladen werden."},this.emit(),this.diagnostics.warn("audio-error","Background audio element emitted an error event",{code:e==null?void 0:e.code,message:e==null?void 0:e.message})}),this.audio.addEventListener("volumechange",()=>{this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-volumechange-mute-desync","Repairing muted state desync during volumechange",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),this.state={...this.state,muted:this.state.muted,liveVolume:this.audio.volume},this.emit()})}pickPlayableSource(e){if(!e||!Array.isArray(e.sources)||e.sources.length===0)return null;const t=e.sources.filter(r=>!!r&&typeof r.src=="string"&&typeof r.ext=="string"&&typeof r.mime=="string"&&typeof r.filename=="string");if(t.length===0)return null;if(typeof this.audio.canPlayType=="function"){for(const r of t){const s=this.audio.canPlayType(r.mime);if(s==="probably"||s==="maybe")return r}return null}if(e.selectedByImporter){const r=t.find(s=>{var a;return s.src===((a=e.selectedByImporter)==null?void 0:a.src)});if(r)return r}return t[0]}startFade(e,t,n,r){this.cancelFade(),this.fadeStartGain=this.audio.volume,this.fadeTargetGain=Math.max(0,Math.min(mi,e)),this.fadeDurationMs=t,this.fadeOnComplete=r!=null?r:null,this.fadeStartTime=0,this.fadeRafHandle=requestAnimationFrame(this.tickFade),this.diagnostics.debug("audio-fade-start","Volume fade started",{label:n,from:this.fadeStartGain,to:this.fadeTargetGain,durationMs:t})}cancelFade(){this.fadeRafHandle!==null&&(cancelAnimationFrame(this.fadeRafHandle),this.fadeRafHandle=null,this.fadeOnComplete=null,this.diagnostics.debug("audio-fade-cancel","Volume fade cancelled"))}emit(){const e={...this.state};this.listeners.forEach(t=>t(e))}}const il="freyraum.preferences.v1",bi=Jt("preferences");function rl(){try{const i=localStorage.getItem(il);if(!i)return{};const e=JSON.parse(i);if(e&&typeof e=="object")return e}catch(i){bi.warn("storage-read-failed","Could not read stored preferences; falling back to defaults")}return{}}function sl(i){try{localStorage.setItem(il,JSON.stringify({...i,audioMuted:!1}))}catch(e){bi.warn("storage-write-failed","Could not persist preferences to localStorage")}}function cx(){var i,e,t;return(t=(e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-reduced-motion: reduce)"))==null?void 0:e.matches)!=null?t:!1}function Eu(){var i,e,t;return(t=(e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-contrast: more)"))==null?void 0:e.matches)!=null?t:!1}class Tu{constructor(){x(this,"prefs");x(this,"listeners",new Set);x(this,"motionMedia",(Bu=window.matchMedia)==null?void 0:Bu.call(window,"(prefers-reduced-motion: reduce)"));x(this,"contrastMedia",(zu=window.matchMedia)==null?void 0:zu.call(window,"(prefers-contrast: more)"));x(this,"handleSystemMotionChange",e=>{rl().reducedMotion===void 0&&(this.prefs.reducedMotion=e.matches,this.emit())});x(this,"handleSystemContrastChange",e=>{this.prefs.contrastMode==="auto"&&(this.prefs.highContrast=e.matches,this.emit())});var o,l,c,d,u;const e=rl(),t=e.quality&&e.quality in Xr?e.quality:Yc,n=e.contrastMode==="high"?"high":"auto";let r=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)?Math.max(0,Math.min(mi,e.audioVolume)):dr;const s=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)&&e.audioVolume<=0;s&&(r=dr,bi.warn("audio-volume-normalized","Normalized stored zero-volume state to startup default",{key:il,stored:e.audioVolume,normalizedTo:r})),this.prefs={reducedMotion:(o=e.reducedMotion)!=null?o:cx(),highContrast:n==="high"?!0:Eu(),contrastMode:n,quality:t,audioMuted:!1,audioVolume:r,alwaysShowChrome:e.alwaysShowChrome===!0};const a=e.audioMuted!==!1;(s||a)&&(sl(this.prefs),bi.info("audio-startup-normalized","Normalized persisted startup audio state",{storedMuted:e.audioMuted,storedVolume:e.audioVolume,normalizedMuted:this.prefs.audioMuted,normalizedVolume:this.prefs.audioVolume})),(c=(l=this.motionMedia)==null?void 0:l.addEventListener)==null||c.call(l,"change",this.handleSystemMotionChange),(u=(d=this.contrastMedia)==null?void 0:d.addEventListener)==null||u.call(d,"change",this.handleSystemContrastChange),this.applyToDocument()}get current(){return{...this.prefs}}setReducedMotion(e){this.prefs.reducedMotion=e,this.emit()}setContrastMode(e){this.prefs.contrastMode=e,this.prefs.highContrast=e==="high"?!0:Eu(),this.emit()}setQuality(e){e in Xr&&(this.prefs.quality=e,this.emit())}setAudioMuted(e){this.prefs.audioMuted=e,this.emit()}setAudioVolume(e){this.prefs.audioVolume=Math.max(0,Math.min(mi,e)),this.emit()}setAlwaysShowChrome(e){this.prefs.alwaysShowChrome!==e&&(this.prefs.alwaysShowChrome=e,bi.info("always-show-chrome","Clean-chrome preference changed",{value:e}),this.emit())}normalizeStartupAudio(e,t=!0){const n=this.prefs.audioVolume>0?this.prefs.audioVolume:dr,r=this.prefs.audioMuted||this.prefs.audioVolume!==n;if(this.prefs={...this.prefs,audioMuted:!1,audioVolume:n},r?bi.info("audio-startup-reset","Reset audio to startup defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}):bi.debug("audio-startup-reset-skip","Startup audio already matches required defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}),t){this.emit();return}sl(this.prefs)}static hasStoredQuality(){return rl().quality!==void 0}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(){this.applyToDocument(),sl(this.prefs),this.listeners.forEach(e=>e(this.current))}applyToDocument(){const e=document.documentElement;e.dataset.motion=this.prefs.reducedMotion?"reduced":"full",e.dataset.contrast=this.prefs.highContrast?"high":"auto",e.dataset.quality=this.prefs.quality,e.dataset.chromeMode=this.prefs.alwaysShowChrome?"visible":"clean"}dispose(){var e,t,n,r;(t=(e=this.motionMedia)==null?void 0:e.removeEventListener)==null||t.call(e,"change",this.handleSystemMotionChange),(r=(n=this.contrastMedia)==null?void 0:n.removeEventListener)==null||r.call(n,"change",this.handleSystemContrastChange),this.listeners.clear()}}class dx{constructor(e){x(this,"samples",[]);x(this,"writeIndex",0);x(this,"filled",!1);x(this,"ema",16.7);x(this,"rolling",16.7);x(this,"lastNow",0);x(this,"cooldownUntil",0);x(this,"_sum",0);x(this,"_aboveCount",0);x(this,"_severeCount",0);x(this,"_sampleOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});x(this,"_readOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});x(this,"budgetMs");x(this,"windowSize");x(this,"emaAlpha");x(this,"cooldownMs");x(this,"severeFrameMs");x(this,"severeFrameLimit");var t,n,r,s,a;this.budgetMs=e.budgetMs,this.windowSize=Math.max(8,(t=e.windowSize)!=null?t:60),this.emaAlpha=(n=e.emaAlpha)!=null?n:.1,this.cooldownMs=(r=e.cooldownMs)!=null?r:600,this.severeFrameMs=(s=e.severeFrameMs)!=null?s:33,this.severeFrameLimit=(a=e.severeFrameLimit)!=null?a:5,this.samples.length=this.windowSize,this.samples.fill(this.budgetMs)}sample(e){if(this.lastNow===0)return this.lastNow=e,this.writeSnapshot(this._sampleOut,0,this._aboveCount,this._severeCount);const t=e-this.lastNow;this.lastNow=e;const n=Math.min(t,250);if(this.filled){const s=this.samples[this.writeIndex];this._sum-=s,s>this.budgetMs&&(this._aboveCount-=1),s>=this.severeFrameMs&&(this._severeCount-=1)}this.samples[this.writeIndex]=n,this._sum+=n,n>this.budgetMs&&(this._aboveCount+=1),n>=this.severeFrameMs&&(this._severeCount+=1),this.writeIndex=(this.writeIndex+1)%this.windowSize,this.writeIndex===0&&(this.filled=!0);const r=this.filled?this.windowSize:this.writeIndex;return this.rolling=this._sum/Math.max(1,r),this.ema=this.ema+this.emaAlpha*(n-this.ema),this.writeSnapshot(this._sampleOut,n,this._aboveCount,this._severeCount)}markNavigation(){this.cooldownUntil=(typeof performance!="undefined"?performance.now():0)+this.cooldownMs}markReadinessWork(){this.markNavigation()}markPresetChange(){this.markNavigation()}writeSnapshot(e,t,n,r){const s=typeof performance!="undefined"?performance.now():0,a=n>this.windowSize*.7,o=r>=this.severeFrameLimit;return e.dtMs=t,e.emaMs=this.ema,e.rollingMs=this.rolling,e.rollingFps=1e3/Math.max(.1,this.rolling),e.belowBudget=a||o,e.severeFrameCount=r,e.inCooldown=s<this.cooldownUntil,e}readSnapshot(){return this.writeSnapshot(this._readOut,0,this._aboveCount,this._severeCount)}}const Ma={gcEventsPerMinute:4,gcPauseP99Ms:1};function ux(i){const e=[];return i.gcEventsPerMinute>Ma.gcEventsPerMinute&&e.push(`GC events/min ${i.gcEventsPerMinute} exceeds ${Ma.gcEventsPerMinute}`),i.gcPauseP99Ms>Ma.gcPauseP99Ms&&e.push(`GC pause P99 ${i.gcPauseP99Ms}ms exceeds ${Ma.gcPauseP99Ms}ms`),{checked:2,violations:e}}function Au(){const i=performance.memory;return i?i.usedJSHeapSize:null}function Ru(i,e){if(i.length===0)return 0;const t=Math.min(i.length-1,Math.max(0,Math.ceil(e*i.length)-1));return i[t]}class hx{constructor(){x(this,"running",!1);x(this,"rafId",null);x(this,"startTime",0);x(this,"lastNow",0);x(this,"frameMs",[]);x(this,"lastHeapBytes",null);x(this,"peakHeapBytes",0);x(this,"startHeapBytes",null);x(this,"gcEventFrameMs",[]);x(this,"longTasks",0);x(this,"longTaskObserver",null)}start(){var t;if(this.running||typeof window=="undefined")return;this.running=!0,this.frameMs.length=0,this.gcEventFrameMs=[],this.longTasks=0,this.startTime=performance.now(),this.lastNow=this.startTime,this.lastHeapBytes=Au(),this.startHeapBytes=this.lastHeapBytes,this.peakHeapBytes=(t=this.lastHeapBytes)!=null?t:0,this.installLongTaskObserver();const e=n=>{this.running&&(this.recordFrame(n),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}stop(){var e;return this.running=!1,this.rafId!==null&&typeof cancelAnimationFrame!="undefined"&&cancelAnimationFrame(this.rafId),this.rafId=null,(e=this.longTaskObserver)==null||e.disconnect(),this.longTaskObserver=null,this.report()}installLongTaskObserver(){if(typeof PerformanceObserver!="undefined")try{this.longTaskObserver=new PerformanceObserver(e=>{this.longTasks+=e.getEntries().length}),this.longTaskObserver.observe({entryTypes:["longtask"]})}catch(e){this.longTaskObserver=null}}recordFrame(e){const t=e-this.lastNow;if(this.lastNow=e,t<=0)return;this.frameMs.push(t);const n=Au();n!==null&&(n>this.peakHeapBytes&&(this.peakHeapBytes=n),this.lastHeapBytes!==null&&n<this.lastHeapBytes&&this.gcEventFrameMs.push(t),this.lastHeapBytes=n)}report(){var g;const e=this.frameMs.length,t=e>0?this.lastNow-this.startTime:0,n=this.frameMs.reduce((v,m)=>v+m,0),r=e>0?n/e:0,s=e>0?this.frameMs.reduce((v,m)=>v+(m-r)*(m-r),0)/e:0,a=[...this.frameMs].sort((v,m)=>v-m),o=this.frameMs.map(v=>1e3/v),l=o.length>0?o.reduce((v,m)=>v+m,0)/o.length:0,c=o.length>0?o.reduce((v,m)=>v+(m-l)*(m-l),0)/o.length:0,d=[...this.gcEventFrameMs].sort((v,m)=>v-m),u=t>0?this.gcEventFrameMs.length/t*6e4:0,h=this.peakHeapBytes>0?this.peakHeapBytes/(1024*1024):null,f=this.startHeapBytes!==null&&this.lastHeapBytes!==null?(this.lastHeapBytes-this.startHeapBytes)/(1024*1024):null;return{frames:e,durationMs:Math.round(t),avgFrameMs:En(r),p99FrameMs:En(Ru(a,.99)),maxFrameMs:En((g=a[a.length-1])!=null?g:0),frameStdDevMs:En(Math.sqrt(s)),avgFps:En(l),fpsStdDev:En(Math.sqrt(c)),gcEventsPerMinute:En(u),gcPauseP99Ms:En(Ru(d,.99)),longTasks:this.longTasks,peakHeapMb:h!==null?En(h):null,heapDeltaMb:f!==null?En(f):null}}get isRunning(){return this.running}}function En(i){return Math.round(i*100)/100}function fx(i){if(!i)return 0;const e=i.getIndex();if(e)return e.count/3;const t=i.getAttribute("position");return t?t.count/3:0}function px(i){const e=[];let t=0;t+=1;const n=i.artworkMesh.geometry;n?n.getAttribute("position")||e.push("artworkMesh.geometry has no position attribute (corrupt buffer)"):e.push("artworkMesh.geometry is null/undefined (geometry ownership lost)");const r=fx(n);typeof i.maxArtworkTriangles=="number"&&(t+=1,r>i.maxArtworkTriangles&&e.push(`artwork triangle count ${Math.round(r)} exceeds max ${i.maxArtworkTriangles}`)),t+=1;const s=i.artworkMesh.material;(!s||Array.isArray(s)&&s.length===0)&&e.push("artworkMesh.material is missing (broken material binding)"),t+=1;const a=i.lights.filter(d=>d.castShadow).length;a!==i.expectedShadowCasterCount&&e.push(`shadow-casting light count ${a} != expected ${i.expectedShadowCasterCount}`),t+=1;let o=0,l=0;i.scene.traverse(d=>{o+=1,d==null&&(l+=1)}),l>0&&e.push(`${l} null/undefined node(s) found in scene graph`);const c=i.artworkMesh.position;return(!Number.isFinite(c.x)||!Number.isFinite(c.y)||!Number.isFinite(c.z))&&e.push("artworkMesh.position contains a non-finite value"),{checked:t,violations:e,measured:{artworkTriangles:Math.round(r),sceneChildren:o,shadowCasterCount:a}}}function mx(i){const e=new hx,t=nr(),n={startPerf:()=>{e.start(),t.info("perf-tools","perf-start","Performance metrics session started")},stopPerf:()=>{const r=e.stop();return t.info("perf-tools","perf-stop","Performance metrics session stopped",r),r},perfReport:()=>e.report(),checkInvariants:()=>{const r=px(i());return r.violations.length>0?t.warn("perf-tools","invariant-violation","Structural invariant violation(s) detected",r):t.info("perf-tools","invariant-ok","All structural invariants hold",r),r},checkTier1Thresholds:r=>{const s=ux(r!=null?r:e.report());return s.violations.length>0?t.warn("perf-tools","tier1-threshold-failed","Tier 1 performance threshold(s) failed",s):t.info("perf-tools","tier1-threshold-ok","Tier 1 performance thresholds passed",s),s}};return typeof window!="undefined"&&(window.__FREYRAUM_PERF_TOOLS__=n),e}const gx={high:"balanced",balanced:"battery",battery:null};class vx{constructor(e,t=4e3,n=!1){x(this,"diagnostics",Jt("quality"));x(this,"current");x(this,"suspended",!1);x(this,"locked");x(this,"holdOffUntil",0);x(this,"holdOffMs");this.current=e,this.holdOffMs=t,this.locked=n}evaluate(e,t){if(this.suspended||e.inCooldown)return null;const n=typeof performance!="undefined"?performance.now():0;if(n<this.holdOffUntil||!e.belowBudget)return null;const r=gx[this.current];return r?this.locked?(this.diagnostics.warn("locked-pressure","Sustained frame-budget pressure detected; automatic quality changes are disabled (quality lock)",{preset:this.current,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.holdOffUntil=n+this.holdOffMs,null):(this.diagnostics.warn("downgrade","Adaptive quality controller requested a downgrade",{from:this.current,to:r,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.current=r,this.holdOffUntil=n+this.holdOffMs,t.markPresetChange(),r):null}notifyManualPreset(e){this.current=e,this.suspended=!0,this.diagnostics.info("manual-override","Adaptive quality suspended after manual preset change",{preset:e})}get isSuspended(){return this.suspended}get isLocked(){return this.locked}suspendForUserOverride(){this.suspended=!0}}const yx="freyraum.backend",wa=Jt("backend");function xx(){try{return typeof window=="undefined"?!1:new URLSearchParams(window.location.search).get("backend")==="webgpu"}catch(i){return!1}}function _x(){try{return localStorage.getItem(yx)==="webgpu"}catch(i){return!1}}function Cu(){return typeof navigator!="undefined"&&"gpu"in navigator&&navigator.gpu!==void 0}async function bx(){const i=xx()||_x();return wa.debug("detect","Evaluating render backend",{optedIn:i,hasNavigatorGPU:Cu()}),i&&Cu()?"webgpu-experimental":"webgl"}async function Sx(){if(await bx()!=="webgpu-experimental")return null;try{wa.info("probe-start","Starting WebGPU probe");const t=await import(new URL("./webgpu-probe.js",window.location.href).toString());if(typeof t.initWebGPUPrototype!="function")throw new Error("webgpu-probe.js does not export initWebGPUPrototype()");const n=await t.initWebGPUPrototype();return wa.info("probe-success","WebGPU probe completed successfully"),n}catch(e){return wa.warn("probe-failed","WebGPU probe failed; staying on WebGL",e),null}}function Pu(){const i=window.innerWidth,e=window.innerHeight,t=e>=i,n=al("(pointer: coarse)"),r=al("(pointer: fine)"),s=al("(hover: hover)"),a=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1;let o;return i<360?o="phone-small":i<600?o="phone-portrait":i<900&&t?o="tablet-portrait":i<900?o="phone-landscape":i<1180?o="tablet-landscape":o="desktop",{layoutTier:o,pointerPrimary:n?"coarse":r?"fine":"none",hasHover:s,dpr:a,orientation:t?"portrait":"landscape",viewportW:i,viewportH:e}}function Iu(i){const e=document.documentElement;e.dataset.layoutTier=i.layoutTier,e.dataset.pointerPrimary=i.pointerPrimary,e.dataset.hover=i.hasHover?"true":"false",e.dataset.orientation=i.orientation,e.dataset.shortHeight=i.viewportH<500?"true":"false"}function al(i){var e,t,n;try{return(n=(t=(e=window.matchMedia)==null?void 0:e.call(window,i))==null?void 0:t.matches)!=null?n:!1}catch(r){return!1}}const Mx="entry-balanced",wx="freyraum:startup-readiness",Ex="startup",ol={defaultPreEntryWarmCount:5,defaultPostRevealFrameBudgetMs:8,defaultPostRevealBatchCap:2};function Lu(i){if(!i)return null;const e=i.trim().toLowerCase();return e==="full"||e==="strict"||e==="all"?"full":e==="entry-balanced"||e==="balanced"?"entry-balanced":e==="entry-minimal"||e==="minimal"?"entry-minimal":null}function Tx(){try{const i=new URLSearchParams(window.location.search),e=Lu(i.get(Ex));if(e)return e}catch(i){}try{const i=Lu(localStorage.getItem(wx));if(i)return i}catch(i){}return Mx}function Ax(i){return i==="phone-small"||i==="phone-portrait"||i==="phone-landscape"}function Rx(i,e,t,n){if(i==="full"||t<=1)return Math.max(1,t);const s=Math.max(1,Math.round(n))*2+1;if(i==="entry-minimal")return Uu(s,t);const a=Ax(e)?2:4;return Uu(s+a,t)}function Uu(i,e){return Math.max(1,Math.min(e,Math.round(i)))}const ku=new R,Du=new R,Cx=500,Px=ol.defaultPreEntryWarmCount,Ix=ol.defaultPostRevealFrameBudgetMs,Lx=ol.defaultPostRevealBatchCap,Ux=["high","balanced","battery"];let Nu=$c;function Si(){return new Promise(i=>requestAnimationFrame(()=>i()))}async function Fu(i){for(let e=0;e<i;e+=1)await Si()}function Ea(i){const e=Number.parseFloat(i);if(Number.isFinite(e))return e;const t=i.match(/-?\d+(?:\.\d+)?/);return t?Number.parseFloat(t[0]):0}function kx(){try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(i){return!1}}function pn(i){if(!i)return null;const e=i.trim();if(!e)return null;const t=new Le;try{return t.setStyle(e),`#${t.getHexString().toUpperCase()}`}catch(n){return null}}function Dx(i){if(!document.body)return null;const e=document.createElement("div");e.className=i,e.style.position="fixed",e.style.left="-10000px",e.style.top="-10000px",e.style.width="4px",e.style.height="4px",document.body.appendChild(e);const t=getComputedStyle(e),n={backgroundColor:t.backgroundColor,backgroundImage:t.backgroundImage};return e.remove(),n}function Jn(i){const e=new me;return i.getSize(e),{width:e.x,height:e.y,pixelRatio:i.getPixelRatio()}}function Nx(i,e){const t=[".topbar",".info-panel",".nav-controls",".nav-btn",".zoom-controls",".zoom-btn",".prefs",".prefs__trigger",".timeline",".timeline__arrow",".timeline__counter",".timeline__thumb",".audio-controls",".audio-controls button",".fullscreen-btn"];let n=0;for(const a of t)i.querySelectorAll(a).forEach(o=>{o.offsetWidth,o.offsetHeight,o.getBoundingClientRect(),getComputedStyle(o).opacity,n+=1});let r=0;const s=i.querySelector(".prefs__panel");return s!=null&&s.hidden&&(s.hidden=!1,s.style.visibility="hidden",s.style.pointerEvents="none",s.offsetHeight,s.querySelectorAll("input, label, fieldset, legend, h2, p").forEach(a=>{a.offsetHeight,getComputedStyle(a).fontSize,n+=1}),s.hidden=!0,s.style.removeProperty("visibility"),s.style.removeProperty("pointer-events"),r+=1),e.info("boot","ui-prebuild-complete","Interactive chrome prebuilt under loading overlay",{elementsMeasured:n,temporarilyOpenedPanels:r}),{elementsMeasured:n,temporarilyOpenedPanels:r}}function Fx(i,e){const t=i.layoutTier==="phone-small"||i.layoutTier==="phone-portrait"||i.layoutTier==="phone-landscape",n=i.layoutTier==="tablet-portrait"||i.layoutTier==="tablet-landscape",r=t?1:2;let s=Px,a=Ix,o=Lx;return t?(s=4,a=5,o=1):n?(s=5,a=6,o=1):(s=7,a=8,o=2),e>=50&&(s=Math.max(3,s-1),o=1),{criticalRadius:r,preEntryWarmCount:Math.min(e,s),postRevealFrameBudgetMs:a,postRevealBatchCap:o}}function Ox(i){return typeof i=="string"&&i.trim()?i.trim().slice(0,96):null}function Bx(i){if(typeof i!="string"||!i.trim())return null;const e=typeof window!="undefined"?window.location.href:"http://localhost/";try{const t=new URL(i.trim(),e);return["http:","https:","file:"].includes(t.protocol)?new URL("./",t.href).href:null}catch(t){return null}}function zx(i){var t,n,r;if(!i)return!1;if(/^data:image\//i.test(i))return!0;const e=(r=(n=(t=/^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(i))==null?void 0:t[1])==null?void 0:n.toLowerCase())!=null?r:null;return e?e==="http"||e==="https"||e==="file":!0}function Ou(i,e,t){if(i==null)return null;if(!Array.isArray(i))return e.warn("boot","artworks-injected-invalid","Ignoring injected artworks: not an array",{typeOf:typeof i}),null;const n=[],r=new Set;let s=0;for(const a of i){if(!a||typeof a!="object"){s++;continue}const o=a,l=typeof o.id=="string"?o.id.trim():"",c=typeof o.image=="string"?o.image.trim():"",d=o.dimensions,u=typeof(d==null?void 0:d.width)=="number"&&Number.isFinite(d.width)?d.width:0,h=typeof(d==null?void 0:d.height)=="number"&&Number.isFinite(d.height)?d.height:0;if(!l||!c||u<=0||h<=0||r.has(l)||!zx(c)){s++;continue}r.add(l);const f=typeof o.title=="string"&&o.title?o.title:l,g=o.tags,v=Array.isArray(g)?g.filter(_=>typeof _=="string"):[],m=typeof o.webglImage=="string"?o.webglImage:"",p=/^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/]/.test(m)?m:void 0,b=typeof o.presentation=="string"?o.presentation:void 0,y=hd(b);b&&!y&&e.warn("boot","artwork-presentation-invalid","Ignoring invalid injected artwork presentation",{artworkId:l,presentation:b}),n.push({id:l,title:f,subtitle:typeof o.subtitle=="string"?o.subtitle:"",description:typeof o.description=="string"?o.description:"",year:typeof o.year=="number"&&Number.isFinite(o.year)?o.year:new Date().getFullYear(),medium:typeof o.medium=="string"?o.medium:"",image:c,...p?{webglImage:p}:{},dimensions:{width:u,height:h},alt:typeof o.alt=="string"?o.alt:f,credit:typeof o.credit=="string"?o.credit:"",tags:v,surface:typeof o.surface=="string"?o.surface:"",...y?{presentation:y}:{},...t?{imageSourceContext:t}:{}})}return s>0&&e.warn("boot","artworks-injected-rejected","Some injected artworks were rejected",{rejected:s,accepted:n.length}),n}function Hx(i,e,t){if(i!=null)if(!i||typeof i!="object"||Array.isArray(i))t.warn("boot","artworks-bundle-invalid","Ignoring injected artwork bundle: expected an object envelope",{typeOf:typeof i});else{const r=i,s=Ox(r.bundleId),a=Bx(r.assetBaseUrl);r.assetBaseUrl!==void 0&&r.assetBaseUrl!==null&&!a&&t.warn("boot","artworks-bundle-base-invalid","Ignoring invalid injected artwork asset base URL",{assetBaseUrlType:typeof r.assetBaseUrl});const o=s||a?{...s?{bundleId:s}:{},...a?{assetBaseUrl:a}:{}}:void 0,l=Ou(r.artworks,t,o);if(l)return{artworks:l,source:"customer-bundle",bundleId:s,assetBaseUrl:a}}const n=Ou(e,t);return n?{artworks:n,source:"customer-legacy-array",bundleId:null,assetBaseUrl:null}:null}function Gx(i,e){var o;if(i==null||typeof i!="object")return null;const t=i,r=(Array.isArray(t.sources)?t.sources:[]).map(l=>l).filter(l=>l&&typeof l.src=="string"&&typeof l.ext=="string"&&typeof l.mime=="string"&&typeof l.filename=="string").map(l=>({src:l.src.trim(),ext:l.ext.trim().toLowerCase(),mime:l.mime.trim().toLowerCase(),filename:l.filename.trim()})).filter(l=>l.src.startsWith("./audio/")&&/^audio\/[a-z0-9.+-]+$/.test(l.mime)&&[".mp3",".ogg",".m4a",".wav"].includes(l.ext));if(r.length===0)return null;const s=t.selectedByImporter&&typeof t.selectedByImporter=="object"?t.selectedByImporter:null,a=s?r.find(l=>l.src===s.src&&l.ext===s.ext&&l.mime===s.mime&&l.filename===s.filename):void 0;return e.info("boot","audio-source-resolved","Background audio payload resolved",{sources:r.map(l=>({file:l.filename,ext:l.ext,mime:l.mime})),selectedByImporter:(o=a==null?void 0:a.filename)!=null?o:null}),{sources:r,...a?{selectedByImporter:a}:{}}}function Ta(i,e,t){var s,a;const n=(s=pn(e.galleryWall))!=null?s:e.galleryWall.trim(),r=(a=pn(e.museumWall))!=null?a:n;return document.documentElement.style.setProperty("--color-gallery-wall",n),document.documentElement.style.setProperty("--color-museum-wall",r),document.documentElement.style.backgroundColor=n,document.body.style.backgroundColor=n,i.style.backgroundColor=n,t==null||t.setWallClearColor(n),{galleryWall:n,museumWall:r}}function Vx(){const i=pn(getComputedStyle(document.documentElement).getPropertyValue("--color-gallery-wall"));return i!=null?i:"#C7CED4"}function Aa(i,e,t,n,r,s,a){var P,G,N,F,W,V,J,X,oe;const o=getComputedStyle(document.documentElement),l=o.getPropertyValue("--color-gallery-wall").trim(),c=o.getPropertyValue("--color-museum-wall").trim(),d=(P=n==null?void 0:n.renderer.getClearColor(new Le))!=null?P:null,u=d?`#${d.getHexString().toUpperCase()}`:null,h=r?getComputedStyle(r):null,f=Dx("fallback-screen"),g=getComputedStyle(document.body),v=getComputedStyle(a),m=s?getComputedStyle(s):null,p=pn(t.galleryWall),b=pn(t.museumWall),y=pn(l),_=pn(c),L=pn((G=h==null?void 0:h.backgroundColor)!=null?G:null),C=pn((N=f==null?void 0:f.backgroundColor)!=null?N:null),T=pn(g.backgroundColor),U=pn(v.backgroundColor),w=[];p&&u&&u!==p&&w.push(`renderer-clear(${u}) != token.galleryWall(${p})`),p&&y&&y!==p&&w.push(`--color-gallery-wall(${y}) != token.galleryWall(${p})`),b&&_&&_!==b&&w.push(`--color-museum-wall(${_}) != token.museumWall(${b})`),b&&L&&L!==b&&w.push(`hub-background(${L}) != token.museumWall(${b})`),p&&C&&C!==p&&w.push(`fallback-background(${C}) != token.galleryWall(${p})`),p&&U&&U!==p&&w.push(`app-background(${U}) != token.galleryWall(${p})`);const S={reason:e,tokens:t,rootVariables:{gallery:l,museum:c,galleryHex:y,museumHex:_},rendererClearHex:u,surfaces:{hubBackgroundColor:(F=h==null?void 0:h.backgroundColor)!=null?F:null,hubBackgroundImage:(W=h==null?void 0:h.backgroundImage)!=null?W:null,loadingOverlayBackgroundColor:(V=m==null?void 0:m.backgroundColor)!=null?V:null,loadingOverlayBackgroundImage:(J=m==null?void 0:m.backgroundImage)!=null?J:null,fallbackProbeBackgroundColor:(X=f==null?void 0:f.backgroundColor)!=null?X:null,fallbackProbeBackgroundImage:(oe=f==null?void 0:f.backgroundImage)!=null?oe:null,bodyBackgroundColor:g.backgroundColor,bodyBackgroundImage:g.backgroundImage,bodyBackgroundHex:T,appBackgroundColor:v.backgroundColor,appBackgroundImage:v.backgroundImage,appBackgroundHex:U},mismatchSignals:w};w.length>0?i.warn("surface","wall-surface-snapshot-mismatch","Museum wall/clear-color consistency mismatch detected",S):i.info("surface","wall-surface-snapshot","Museum wall/clear-color surfaces resolved consistently",S)}function Wx(i){const e=["Kunstwerke werden vorbereitet …","Texturen werden geladen …","Licht und Schatten werden berechnet …","Atmosphäre wird eingestellt …","Fast fertig …"],t=document.createElement("div");t.className="loading-overlay",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-label","Museum wird geladen"),[{x:"10%",y:"14%",size:"280px",color:"rgba(181,154,106,0.32)",duration:"4.2s",delay:"0s",dx1:"52px",dy1:"-44px",dx2:"-68px",dy2:"38px",dx3:"44px",dy3:"-58px"},{x:"78%",y:"12%",size:"340px",color:"rgba(200,214,229,0.26)",duration:"3.6s",delay:"-1.4s",dx1:"-48px",dy1:"60px",dx2:"72px",dy2:"-46px",dx3:"-56px",dy3:"42px"},{x:"16%",y:"74%",size:"400px",color:"rgba(200,214,229,0.24)",duration:"5.1s",delay:"-2.8s",dx1:"64px",dy1:"-52px",dx2:"-40px",dy2:"76px",dx3:"58px",dy3:"-38px"},{x:"84%",y:"70%",size:"290px",color:"rgba(181,154,106,0.28)",duration:"3.9s",delay:"-0.7s",dx1:"-62px",dy1:"42px",dx2:"48px",dy2:"-72px",dx3:"-44px",dy3:"66px"},{x:"50%",y:"6%",size:"220px",color:"rgba(181,154,106,0.22)",duration:"4.7s",delay:"-3.5s",dx1:"44px",dy1:"68px",dx2:"-76px",dy2:"-40px",dx3:"60px",dy3:"52px"},{x:"46%",y:"90%",size:"320px",color:"rgba(200,214,229,0.20)",duration:"3.3s",delay:"-2.1s",dx1:"-58px",dy1:"-62px",dx2:"82px",dy2:"44px",dx3:"-48px",dy3:"-70px"},{x:"26%",y:"50%",size:"240px",color:"rgba(181,154,106,0.18)",duration:"5.8s",delay:"-4.4s",dx1:"70px",dy1:"46px",dx2:"-44px",dy2:"-80px",dx3:"38px",dy3:"64px"},{x:"74%",y:"46%",size:"260px",color:"rgba(200,214,229,0.16)",duration:"4.4s",delay:"-1.9s",dx1:"-46px",dy1:"72px",dx2:"60px",dy2:"-48px",dx3:"-68px",dy3:"56px"},{x:"34%",y:"28%",size:"200px",color:"rgba(181,154,106,0.20)",duration:"3.8s",delay:"-0.5s",dx1:"58px",dy1:"-76px",dx2:"-50px",dy2:"60px",dx3:"76px",dy3:"-42px"},{x:"62%",y:"32%",size:"310px",color:"rgba(200,214,229,0.22)",duration:"5.4s",delay:"-3.1s",dx1:"-72px",dy1:"-48px",dx2:"44px",dy2:"84px",dx3:"-60px",dy3:"-52px"},{x:"8%",y:"44%",size:"350px",color:"rgba(181,154,106,0.16)",duration:"4.0s",delay:"-1.2s",dx1:"46px",dy1:"84px",dx2:"-80px",dy2:"-44px",dx3:"52px",dy3:"68px"},{x:"90%",y:"36%",size:"230px",color:"rgba(200,214,229,0.18)",duration:"5.6s",delay:"-2.5s",dx1:"-84px",dy1:"52px",dx2:"66px",dy2:"-76px",dx3:"-50px",dy3:"46px"}].forEach(v=>{const m=document.createElement("span");m.className="loading-particle",m.setAttribute("aria-hidden","true"),m.style.setProperty("--particle-x",v.x),m.style.setProperty("--particle-y",v.y),m.style.setProperty("--particle-size",v.size),m.style.setProperty("--particle-color",v.color),m.style.setProperty("--particle-duration",v.duration),m.style.setProperty("--particle-delay",v.delay),m.style.setProperty("--particle-drift-x",v.dx1),m.style.setProperty("--particle-drift-y",v.dy1),m.style.setProperty("--particle-drift-x2",v.dx2),m.style.setProperty("--particle-drift-y2",v.dy2),m.style.setProperty("--particle-drift-x3",v.dx3),m.style.setProperty("--particle-drift-y3",v.dy3),t.appendChild(m)});const r=document.createElement("div");r.className="loading-card";const s=document.createElement("div");s.className="loading-wordmark";const a=document.createElement("span");a.className="loading-wordmark__text",a.textContent="FREYRAUM",s.appendChild(a);const o=document.createElement("div");o.className="loading-subtitle",o.textContent="Museum wird geladen";const l=document.createElement("div");l.className="loading-progress-track";const c=document.createElement("div");c.className="loading-progress-fill",l.appendChild(c);const d=document.createElement("div");d.className="loading-progress-pct",d.textContent="0%";const u=document.createElement("div");u.className="loading-hint",u.textContent=e[0];const h=document.createElement("button");h.className="loading-start-btn",h.textContent="Museum betreten",h.setAttribute("aria-label","Museum betreten und Ausstellungen entdecken"),h.disabled=!0,r.append(s,o,l,d,u,h),t.appendChild(r),i.appendChild(t);let f=0;const g=window.setInterval(()=>{f=(f+1)%e.length,u.textContent=e[f]},2e3);return{overlay:t,setProgress(v){const m=Math.max(0,Math.min(100,Math.round(v)));c.style.width=`${m}%`,d.textContent=`${m}%`},setStatus(v){o.textContent=v,t.setAttribute("aria-label",v)},reveal(){return window.clearInterval(g),h.disabled=!1,h.classList.add("is-visible"),h.offsetHeight,getComputedStyle(h).backgroundColor,h.style.setProperty("will-change","background-color"),h.addEventListener("click",()=>{h.style.removeProperty("will-change")},{once:!0}),o.textContent="Museum bereit — zum Starten klicken",u.textContent="Alle Inhalte sind vollständig vorbereitet.",t.setAttribute("aria-label","Museum bereit — zum Starten klicken"),new Promise(v=>{let m=!1;const p=()=>{m||(m=!0,h.disabled=!0,h.removeEventListener("click",p),document.removeEventListener("keydown",b),t.classList.add("is-hidden"),window.setTimeout(()=>{t.remove(),v()},1300))},b=y=>{y.key!=="Enter"&&y.key!==" "||(y.preventDefault(),p())};h.addEventListener("click",p),document.addEventListener("keydown",b),h.addEventListener("transitionend",()=>h.focus(),{once:!0}),window.setTimeout(()=>h.focus(),650)})},dispose(){window.clearInterval(g)}}}async function Xx(){var Wu,Xu,$u,Yu,qu,Zu,ju,Ku,Qu,Ju;const i=performance.now(),e=nr(),t=kx();e.installGlobalHandlers(),e.info("boot","startup","Starting FREYRAUM runtime"),t&&e.info("boot","hub-debug-enabled","Museum hub debug overlay requested via ?hubDebug=1");const n=document.getElementById("app");if(!n){e.error("boot","missing-app-root","Missing #app root element");return}n.dataset.experience="loading";const r=new Tu;e.debug("boot","preferences-ready","Preferences store created",r.current);const s=new lx,a=Pu();if(Iu(a),e.info("layout","capabilities","Device capabilities detected",{tier:a.layoutTier,pointer:a.pointerPrimary,hover:a.hasHover,orientation:a.orientation,viewportW:a.viewportW,viewportH:a.viewportH,dpr:a.dpr}),!Tu.hasStoredQuality()){const z=Zv();z==="battery"&&z!==r.current.quality&&(r.setQuality(z),e.info("quality","startup-capability-default","Applied conservative first-run quality",{applied:z,tier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr}))}const o=window.__FREYRAUM_ARTWORK_BUNDLE__,l=window.__FREYRAUM_ARTWORKS,c=Hx(o,l,e),d=(Wu=c==null?void 0:c.artworks)!=null?Wu:null,u=d&&d.length>0?d:$c;Nu=u;const h=u.map(z=>{var Pe,Ze,xt,Et,Lt,Ia,ss,La,Ua,ka;const Se=pi(z);return{id:z.id,bundleId:(Ze=(Pe=Se.primary)==null?void 0:Pe.bundleId)!=null?Ze:null,declaredImageUrlType:(Et=(xt=Se.primary)==null?void 0:xt.declaredUrlType)!=null?Et:null,resolvedImageUrlType:(Ia=(Lt=Se.primary)==null?void 0:Lt.resolvedUrlType)!=null?Ia:null,hasEmbeddedFallback:!!Se.fallback,embeddedFallbackUrlType:(La=(ss=Se.fallback)==null?void 0:ss.resolvedUrlType)!=null?La:null,dimensions:z.dimensions,surface:(Ua=z.surface)!=null?Ua:null,presentation:(ka=z.presentation)!=null?ka:null}});e.info("boot","artworks-source","Artwork source resolved",{source:d&&d.length>0?(Xu=c==null?void 0:c.source)!=null?Xu:"customer-legacy-array":"built-in",bundleId:($u=c==null?void 0:c.bundleId)!=null?$u:null,assetBaseUrl:(Yu=c==null?void 0:c.assetBaseUrl)!=null?Yu:null,count:u.length,artworks:h,withEmbeddedFallback:h.filter(z=>z.hasEmbeddedFallback).length,withoutEmbeddedFallback:h.filter(z=>!z.hasEmbeddedFallback).length});const f=window.__FREYRAUM_MUSEUM_HUB,g=window.__FREYRAUM_HUB_HOTSPOTS,v=Hy(u,f,g);e.info("boot","museum-hub-resolved","Museum hub configuration resolved",{source:v.source,pages:v.pages.length,selectableSlots:v.slotToArtwork.size,unmappedArtworkCount:v.unmappedArtworkCount,disabledSlots:v.pages.flatMap(z=>z.slots).filter(z=>!z.selectable).map(z=>({slotId:z.id,reason:z.disabledReason})),warnings:v.warnings});const m=v.visualTokens,p=Ta(n,m);e.info("boot","visual-tokens-resolved","Wall color tokens resolved",p);const b=window.__FREYRAUM_AUDIO,y=Gx(b,e);s.load(y);const _=Wx(n),L=new Nc;L.onStart=(z,Se,Pe)=>{_.setStatus("Texturen werden geladen"),_.setProgress(Pe>0?Se/Pe*40:8)},L.onProgress=(z,Se,Pe)=>{_.setProgress(Pe>0?Math.min(48,Se/Pe*48):35)},L.onLoad=()=>{_.setStatus("Galerie wird vorbereitet"),_.setProgress(50)},L.onError=z=>{e.warn("boot","loading-manager-error","Asset failed during loading-manager preload",{url:z.startsWith("data:")?`[data-uri:${z.length}bytes]`:z})};const C=$r(r.current.quality);let T;try{T=new s0(n,C,p.galleryWall)}catch(z){e.error("renderer","init-failed","RendererManager initialization failed",z),_.dispose(),_.overlay.remove(),Ed(n,{category:"renderer-initialization",reason:z instanceof Error?z.message:"WebGL-Renderer konnte nicht initialisiert werden.",surfaceColor:p.galleryWall,artworks:u,onRetry:()=>window.location.reload()});return}Ta(n,p,T),T.renderer.domElement.classList.add("gallery-canvas","gallery-canvas--loading");let U=null;const w=document.createElement("div");w.className="webgl-restore-status",w.setAttribute("role","status"),w.setAttribute("aria-live","polite"),w.textContent="Grafik wird wiederhergestellt …",n.appendChild(w);let S,P=null,G=null,N=null,F=null;T.onContextChange(z=>{var Se,Pe;if(z==="lost"){clearTimeout(S),w.classList.add("is-visible"),e.warn("renderer","context-restore-visible","Showing WebGL restore status"),Aa(e,"renderer-context-lost",p,T,(Se=U==null?void 0:U.element)!=null?Se:null,_.overlay,n);return}Ta(n,p,T),F&&G&&F.applyPreset($r(r.current.quality),G.getEffectiveAnisotropy()),w.textContent="Grafik wiederhergestellt",e.info("renderer","context-restore-hidden","WebGL restore status will hide"),N==null||N.markRenderDirty(8),P&&T.prewarm(P.scene,P.camera),Aa(e,"renderer-context-restored",p,T,(Pe=U==null?void 0:U.element)!=null?Pe:null,_.overlay,n),S=setTimeout(()=>{w.classList.remove("is-visible"),w.textContent="Grafik wird wiederhergestellt …"},1200)});const W=new l0(T.renderer);P=W;const V=new x0(T.renderer,W.scene,W.camera,C),J=new A0(L);G=J,J.init(T.renderer),J.setAnisotropyDivisor(C.anisotropyDivisor),F=new a0(W.scene,{wall:p.galleryWall},C,J.getEffectiveAnisotropy());const X=new S0(W.scene,C),oe=new k0(W.scene,C);mx(()=>({scene:W.scene,artworkMesh:oe.getArtworkMeshObject(),lights:X.getLights(),expectedShadowCasterCount:X.getExpectedShadowCasterCount()}));const he={topbar:null,timeline:null,navControls:null,infoPanel:null},Me=()=>{var rh,sh,ah,oh,lh;const z=window.visualViewport,Se=Math.max(1,Math.round((rh=z==null?void 0:z.width)!=null?rh:window.innerWidth)),Pe=Math.max(1,Math.round((sh=z==null?void 0:z.height)!=null?sh:window.innerHeight)),Ze=window.getComputedStyle(document.documentElement),xt=Ea(Ze.getPropertyValue("--safe-left")),Et=Ea(Ze.getPropertyValue("--safe-right")),Lt=Ea(Ze.getPropertyValue("--chrome-top")),Ia=Ea(Ze.getPropertyValue("--chrome-bottom")),ss=(ah=he.topbar)==null?void 0:ah.getBoundingClientRect(),La=(oh=he.timeline)==null?void 0:oh.getBoundingClientRect(),Ua=(lh=he.navControls)==null?void 0:lh.getBoundingClientRect(),ka=ss?Math.max(0,Math.min(Pe,ss.bottom)):0,$x=[La,Ua].filter(hl=>!!hl).reduce((hl,Yx)=>Math.max(hl,Pe-Math.max(0,Yx.top)),0),eh=Math.max(Lt,ka),th=Math.max(Ia,$x),nh=xt,ih=Et,dl=Math.max(1,Se-nh-ih),ul=Math.max(1,Pe-eh-th);return{viewportW:Se,viewportH:Pe,usableW:dl,usableH:ul,usableFracX:dl/Se,usableFracY:ul/Pe,effectiveAspect:dl/ul,occlusionTop:eh,occlusionRight:ih,occlusionBottom:th,occlusionLeft:nh}},ee=new Y0(u,oe,J,W.camera,void 0,Me);N=ee,ee.applyPreset(C);const Ve=Fx(a,u.length);ee.configureReadinessProfile({criticalRadius:Ve.criticalRadius});const K=Tx(),de=Rx(K,a.layoutTier,u.length,Ve.criticalRadius);ee.configureStartupReadiness({mode:K,entryTargetCount:de}),e.info("boot","startup-readiness-mode","Resolved startup readiness contract",{mode:K,entryTargetCount:de,artworkCount:u.length,criticalRadius:Ve.criticalRadius,layoutTier:a.layoutTier}),e.info("boot","warm-profile","Applied device-aware warm profile",{artworkCount:u.length,layoutTier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr,profile:Ve});const we=!1,xe=new dx({budgetMs:16.7}),Be=new vx(r.current.quality,4e3,!we);ee.setFrameBudgetMarker(()=>xe.markNavigation());let Ne=!1,We;Sx();const Je=new q0(n),k=new Uo(n,u[0]),ct=z=>{k.setCompact(z==="phone-portrait"||z==="phone-small")};ct(a.layoutTier);const Xe=new ko(n),Ue=new j0(n,ee),Re=new K0(n,document.documentElement),dt=new Q0(n,r),Fe=new ty(n,r,s),ze=new Z0(n),I=new ay(n,u);U=new nl(n,v,C),U.setSelectedArtworkId((Zu=(qu=u[ee.index])==null?void 0:qu.id)!=null?Zu:null,{alignPage:!1,source:"boot-gallery-selection"}),Aa(e,"post-hub-composition-create",p,T,U.element,_.overlay,n);const M=s.subscribe(z=>{dt.setAudioStatusMessage(z.message)});he.topbar=n.querySelector(".topbar"),he.timeline=n.querySelector(".timeline"),he.navControls=n.querySelector(".nav-controls"),he.infoPanel=n.querySelector(".info-panel");const $=new ey(he.infoPanel,r,n);$.init(),he.navControls&&$.registerNavControls(he.navControls,Xe),await Promise.all([ee.init(),new Promise(z=>window.setTimeout(z,Cx))]),e.info("boot","gallery-ready","Gallery initialized",{artworkCount:u.length,quality:r.current.quality,lighting:"dramatic"});const re=T.renderer.domElement;re.tabIndex=-1,re.setAttribute("aria-label","Interaktive Galerie"),re.setAttribute("role","img"),re.setAttribute("aria-describedby","freyraum-canvas-help");const le=document.createElement("p");le.id="freyraum-canvas-help",le.className="sr-only",le.textContent="Interaktive 3D-Galerie. Navigation: Pfeiltasten links und rechts oder die Navigationsbuttons. Zoomen: Plus- und Minus-Buttons.",n.appendChild(le);let ie=null,Ie=null,ge=null;const A=()=>{Ie!==null&&(cancelAnimationFrame(Ie),Ie=null),ge!==null&&(cancelAnimationFrame(ge),ge=null)},j=z=>{ie||(ie=document.createElement("div"),ie.id="freyraum-artwork-status",ie.className="sr-only",ie.setAttribute("aria-live","polite"),ie.setAttribute("aria-atomic","true"),n.appendChild(ie)),A(),ie.textContent="";const Se=z?`Aktuelles Werk: ${z}`:"Aktuelles Werk gewechselt";Ie=requestAnimationFrame(()=>{Ie=null,ge=requestAnimationFrame(()=>{ge=null,ie&&(ie.textContent=Se)})})},B=new hy(re,ee),Q=new dy,se=new ly(ee,Q);B.setEnabled(!1),se.setEnabled(!1),Je.onHelpClick=()=>Q.open(Je.helpBtn),Je.onInfoClick=()=>$.forceReveal("info-panel");let pe=!1;const ae=z=>{if(pe)return;const Se=r.current,Pe=s.getState();s.hasSource()&&!Se.audioMuted&&(Pe.autoplayBlocked||!Pe.playing&&Pe.available)&&(pe=!0,e.info("audio","autoplay-recovery-attempt","Retrying audio play after user interaction",{reason:z,autoplayBlocked:Pe.autoplayBlocked}),s.play(`interaction-recovery:${z}`))},ve=()=>ae("pointerdown"),Ae=z=>{(z.key==="ArrowLeft"||z.key==="ArrowRight"||z.key===" "||z.key==="Enter")&&ae(`keydown:${z.key}`)};window.addEventListener("pointerdown",ve,{passive:!0}),window.addEventListener("keydown",Ae);let ke;const D=200,ue=()=>{ke!==void 0&&(clearTimeout(ke),ke=void 0),ee.setInteractionActive(!0)},te=()=>{ke!==void 0&&clearTimeout(ke),ke=setTimeout(()=>{ke=void 0,ee.setInteractionActive(!1)},D)},ne=()=>ue(),ce=()=>te();window.addEventListener("pointerdown",ne,{passive:!0}),window.addEventListener("pointerup",ce,{passive:!0}),window.addEventListener("pointercancel",ce,{passive:!0});const Ee=u.length,et=new $t(4,4,{depthBuffer:!0,stencilBuffer:!1}),gt=(z,Se)=>{const Pe=performance.now();if(!ee.warmArtworkForGPU(z,Se))return!1;const Ze=oe.group.visible;oe.group.visible=!0;const xt=T.renderer.getRenderTarget();return T.renderer.setRenderTarget(et),T.renderer.render(W.scene,W.camera),T.renderer.setRenderTarget(xt),oe.group.visible=Ze,ee.markGpuWarmed(z,performance.now()-Pe,Se),!0},wt=(z,Se)=>{var xt;const Pe=performance.now();if(!ee.warmArtworkForGPU(z,Se))return!1;const Ze=oe.group.visible;return oe.group.visible=!0,V.render(),oe.group.visible=Ze,ee.markGpuWarmed(z,performance.now()-Pe,Se),e.debug("boot","artwork-final-path-warm","Artwork rendered through final post-processing path under loading overlay",{index:z,artworkId:(xt=u[z])==null?void 0:xt.id,reason:Se,durationMs:Math.round((performance.now()-Pe)*10)/10,renderer:Jn(T.renderer)}),!0},Ke=ee.getBudgetedWarmOrder(0),ut=ee.getStartupEntryTargets(0),Dt=Math.max(0,Ke.length-ut.length);e.info("boot","pre-entry-warm-contract","Pre-entry GPU warm contract resolved",{mode:K,warmOrderLength:Ke.length,entryWarmCount:ut.length,deferredWarmCount:Dt,entryTargets:ut}),await ee.ensureEntryReadiness(ut,"overlay-entry-readiness-contract"),_.setStatus("GPU wird vorbereitet"),_.setProgress(50);for(let z=0;z<ut.length;z+=1)_.setStatus(`Gemälde ${z+1} / ${ut.length} wird vorbereitet`),gt(ut[z],"overlay-entry-readiness-contract"),_.setProgress(50+Math.round((z+1)/Math.max(1,ut.length)*45)),await Si();let Tn=ee.getEntryReadinessContract(ut),Zt=0;const Mi=Math.max(2,ut.length+1);for(;!Tn.ready&&Zt<Mi;)Zt+=1,_.setStatus("Zusätzliche Vorbereitung läuft"),await ee.ensureEntryReadiness(Tn.pendingIndices,`overlay-contract-retry-${Zt}`),Tn.pendingIndices.forEach(z=>gt(z,`overlay-contract-retry-${Zt}`)),Tn=ee.getEntryReadinessContract(ut);Tn.ready||e.warn("boot","entry-contract-unresolved","Full-gallery entry readiness contract could not be fully satisfied before reveal",{pendingIndices:Tn.pendingIndices,targetIndices:Tn.targetIndices,attempts:Zt,maxAttempts:Mi}),ee.warmArtworkForGPU(ee.index,"restore-active-after-overlay-warm");const it=ee.getFullGalleryReadinessSummary();if(e.info("boot","full-gallery-ready","Entry readiness contract resolved; enabling entry CTA",{artworkCount:Ee,fullyReadyCount:it.fullyReadyCount,pendingCount:it.pendingCount,gpuWarmedCount:it.gpuWarmedCount,pbrLoadedCount:it.pbrLoadedCount,proceduralReadyCount:it.proceduralReadyCount,memoryCapApplied:it.memoryCapApplied,preloadMode:it.preloadMode,deferredArtworkCount:it.deferredArtworkCount,overflowArtworkCount:it.overflowArtworkCount,entryContractPasses:Zt,entryContractMaxPasses:Mi}),it.pendingCount>0){const z=it.preloadMode==="strict"?"warn":"info";e[z]("boot","entry-unresolved-artworks","Pre-entry unresolved artworks detected",{pendingCount:it.pendingCount,unresolvedArtworkIds:it.unresolvedArtworkIds,preloadMode:it.preloadMode,deferredArtworkCount:it.deferredArtworkCount,overflowArtworkCount:it.overflowArtworkCount,contractSatisfied:it.preloadMode!=="strict"})}e.info("boot","inp-acceptance-target",'INP acceptance criteria: interaction presentation delay must stay below 200 ms (Core Web Vitals "good" threshold)',{baseline_inp_ms:1024,target_inp_ms:200,preloadMode:it.preloadMode,artworkCount:Ee,note:"Measure with Chrome DevTools Performance > Interactions panel or CrUX field data after deploy."}),e.info("boot","gpu-warm-complete","Pre-entry GPU warm finished; entry target set warmed before reveal",{artworkCount:Ee,mode:K,entryWarmCount:ut.length,deferredWarmCount:Dt,warmOrder:Ke,frameBudgetMs:Ve.postRevealFrameBudgetMs,batchCap:Ve.postRevealBatchCap});const _r=3,br=performance.now();e.info("boot","gpu-warm-flush-start","Starting post-warm GPU drain frames before shader prewarm",{frames:_r,artworkCount:Ee,pendingCount:it.pendingCount,preloadMode:it.preloadMode}),await Fu(_r),e.info("boot","gpu-warm-flush-complete","Post-warm GPU drain frames completed",{frames:_r,durationMs:performance.now()-br,artworkCount:Ee,pendingCount:it.pendingCount,preloadMode:it.preloadMode}),_.setStatus("Shader werden vorbereitet"),_.setProgress(97),await T.prewarm(W.scene,W.camera),ee.markAllShaderCompiled("boot-prewarm");const zn=r.current.quality,wi=zn==="battery"||a.pointerPrimary==="coarse"||T.rendererMode!=="preferred",Ei=wi?[]:Ux.filter(z=>z!==zn);if(wi&&e.info("boot","quality-variant-prewarm-skipped","Skipped non-active shader variants on a constrained renderer",{activeQuality:zn,pointer:a.pointerPrimary,rendererMode:T.rendererMode}),Ei.length>0){const z=ee.index,Se=performance.now();e.info("boot","quality-variant-prewarm-start","Prewarming non-active quality shader variants under loading overlay",{activeQuality:zn,variants:Ei,artworkIndex:z,artworkId:(ju=u[z])==null?void 0:ju.id});for(const Ze of Ei){const xt=performance.now(),Et=$r(Ze);T.applyPreset(Et),V.applyPreset(Et),X.applyPreset(Et),oe.applyPreset(Et),ee.applyPreset(Et),F==null||F.applyPreset(Et,J.getEffectiveAnisotropy()),ee.warmArtworkForGPU(z,`overlay-quality-variant-${Ze}`),await T.prewarm(W.scene,W.camera),e.debug("boot","quality-variant-prewarmed","Quality shader variant prewarmed",{quality:Ze,artworkIndex:z,artworkId:(Ku=u[z])==null?void 0:Ku.id,durationMs:Math.round((performance.now()-xt)*10)/10,renderer:Jn(T.renderer)}),await Si()}const Pe=$r(zn);T.applyPreset(Pe),V.applyPreset(Pe),X.applyPreset(Pe),oe.applyPreset(Pe),ee.applyPreset(Pe),F==null||F.applyPreset(Pe,J.getEffectiveAnisotropy()),ee.warmArtworkForGPU(ee.index,"restore-active-after-quality-variant-prewarm"),await T.prewarm(W.scene,W.camera),e.info("boot","quality-variant-prewarm-complete","All non-active quality shader variants prewarmed under loading overlay",{activeQuality:zn,variantsWarmed:Ei,durationMs:Math.round((performance.now()-Se)*10)/10,renderer:Jn(T.renderer)})}const Sr=new me;T.renderer.getSize(Sr),e.info("boot","composer-prewarm-start","Starting EffectComposer shader prewarm (bloom+FXAA passes)"),V.prewarmComposer(Sr.x,Sr.y),e.info("boot","composer-prewarm-complete","EffectComposer shader prewarm complete"),await Fu(1),_.setStatus("Finale Darstellung wird vorbereitet"),_.setProgress(98);const ll=performance.now();let is=0;for(let z=0;z<ut.length;z+=1)wt(ut[z],"overlay-final-path-warm")&&(is+=1),await Si();wt(ee.index,"restore-active-after-final-path-warm"),e.info("boot","all-artworks-final-path-warmed","Entry target artworks rendered through final post-processing path under loading overlay",{artworkCount:Ee,mode:K,warmed:is,targetCount:ut.length,deferredWarmCount:Dt,durationMs:Math.round((performance.now()-ll)*10)/10,renderer:Jn(T.renderer)}),_.setStatus("Bedienelemente werden vorbereitet");const Ca=await I.prewarmUnderOverlay(),E=Nx(n,e);e.info("boot","entry-prebuild-complete","Main page, controls, timeline, and final render path are prebuilt under loading overlay",{timeline:Ca,ui:E,artworkCount:Ee}),_.setProgress(99),it.preloadMode==="bounded-fallback"?_.setStatus(`${it.overflowArtworkCount} Gemälde werden noch optimiert – Galerie kann betreten werden`):it.preloadMode==="staged"&&Dt>0?_.setStatus("Galerie bereit – weitere Gemälde werden im Hintergrund vorbereitet"):_.setStatus("Galerie bereit"),T.renderer.domElement.classList.remove("gallery-canvas--loading"),T.renderer.domElement.classList.add("gallery-canvas--ready");let O=ut.length;const Y=()=>{if(O>=Ke.length){et.dispose(),ee.warmArtworkForGPU(ee.index,"restore-active-after-budget-warm"),e.info("boot","gpu-warm-post-reveal","Post-reveal budgeted warm queue complete; all artworks warmed",{artworkCount:Ee,mode:K,warmed:Ke.length,deferredWarmCount:Dt,readinessLedger:ee.getReadinessLedger()});return}const z=performance.now();let Se=0;for(;O<Ke.length&&Se<Ve.postRevealBatchCap&&performance.now()-z<Ve.postRevealFrameBudgetMs;)gt(Ke[O],"post-reveal-budget"),O+=1,Se+=1;ee.warmArtworkForGPU(ee.index,"restore-active-between-budget-warm"),e.debug("boot","gpu-warm-frame","Budgeted GPU warm frame completed",{warmedThisFrame:Se,warmCursor:O,total:Ke.length}),requestAnimationFrame(Y)};requestAnimationFrame(Y);let q,H=0;const fe=()=>{var Et,Lt;H=0;const z=window.visualViewport,Se=Math.max(1,Math.round((Et=z==null?void 0:z.width)!=null?Et:window.innerWidth)),Pe=Math.max(1,Math.round((Lt=z==null?void 0:z.height)!=null?Lt:window.innerHeight));T.resize(Se,Pe),V.resize(Se,Pe),W.updateAspect(Se,Pe);const Ze=Pu();Iu(Ze),ct(Ze.layoutTier),ze.updateHint();const xt=Me();ee.handleViewportMetricsChanged(),e.info("layout","resize","Viewport resized",{tier:Ze.layoutTier,w:Ze.viewportW,h:Ze.viewportH,measuredW:Se,measuredH:Pe,orientation:Ze.orientation}),e.info("layout","art-viewport","Artwork-safe viewport measured",xt)},ye=()=>{clearTimeout(q),q=setTimeout(()=>{H===0&&(H=requestAnimationFrame(fe))},120)};window.addEventListener("resize",ye),window.addEventListener("orientationchange",ye);const be=window.visualViewport;be==null||be.addEventListener("resize",ye),be==null||be.addEventListener("scroll",ye);const Te=typeof ResizeObserver=="function"?new ResizeObserver(ye):null;for(const z of[he.topbar,he.timeline,he.navControls,he.infoPanel])z&&(Te==null||Te.observe(z));const Oe=z=>{const{reducedMotion:Se,quality:Pe,audioMuted:Ze,audioVolume:xt}=r.current;ee.setReducedMotion(Se),X.setAnimated(!Se),s.setVolume(xt,"preferences-apply"),s.setMuted(Ze,"preferences-apply");const Et=s.getState();!Ze&&s.hasSource()&&(!Et.playing||Et.autoplayBlocked)&&s.play("preferences-apply"),oe.material.setShadowProfileScale(.5);const Lt=$r(Pe);T.applyPreset(Lt),V.applyPreset(Lt),X.applyPreset(Lt),oe.applyPreset(Lt),ee.applyPreset(Lt),F==null||F.applyPreset(Lt,J.getEffectiveAnisotropy()),U==null||U.applyPreset(Lt),ee.setInspectionMode(!1),oe.material.setShadowFilterRadius(0,!1),xe.markPresetChange(),ee.markRenderDirty(6),z&&Be.notifyManualPreset(Pe),e.debug("preferences","applied","Applied current preferences",{manual:z,reducedMotion:Se,quality:Pe,lighting:"dramatic",audioMuted:Ze,audioVolume:xt,inspection:!1})};Oe(!1);const Ge=z=>{Ne||(Ne=!0,s.handleSuspend(z),e.info("lifecycle","suspend",`Runtime suspended (${z})`,{reason:z,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},De=z=>{Ne&&(Ne=!1,s.handleResume(z),xe.markNavigation(),ee.markRenderDirty(6),e.info("lifecycle","resume",`Runtime resumed (${z})`,{reason:z,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},rt=()=>{document.visibilityState==="hidden"?Ge("visibilitychange-hidden"):document.visibilityState==="visible"&&De("visibilitychange-visible")},pt=z=>{r.normalizeStartupAudio(z.persisted?"pagehide-bfcache":"pagehide-close",!1),e.info("audio","startup-audio-persisted","Persisted startup audio defaults during page hide",{persisted:z.persisted})},mt=z=>{z.persisted&&(e.info("audio","startup-audio-restore","Restoring startup audio defaults after bfcache resume",{persisted:z.persisted}),r.normalizeStartupAudio("pageshow-bfcache"))},zt=()=>Ge("page-lifecycle-freeze"),st=()=>De("page-lifecycle-resume");document.addEventListener("visibilitychange",rt),window.addEventListener("pagehide",pt),window.addEventListener("pageshow",mt),window.addEventListener("freeze",zt),window.addEventListener("resume",st);let Ce=null;if(e.getMode()!=="default"&&typeof PerformanceObserver=="function")try{Ce=new PerformanceObserver(z=>{for(const Se of z.getEntries())e.warn("perf","long-task","Long task blocked the main thread",{duration:Math.round(Se.duration),startTime:Math.round(Se.startTime),name:Se.name})}),Ce.observe({type:"longtask",buffered:!0}),e.info("perf","longtask-observer-active","Long Tasks API observer attached")}catch(z){e.info("perf","longtask-unsupported","Long Tasks API not available",{message:z instanceof Error?z.message:String(z)})}let bt;e.getMode()!=="default"&&(bt=setInterval(()=>{Ne||e.info("renderer","snapshot","Renderer info snapshot",T.getRendererSnapshot())},5e3));const nt=nr().getMode()!=="default";let Ht=!1,mn=!1;const Gt=z=>{nt&&(z.key==="a"||z.key==="A"?(Ht=!Ht,oe.material.setAlbedoOnly(Ht),e.info("debug","albedo-toggle",`Albedo-only ${Ht?"ON":"OFF"}`)):(z.key==="s"||z.key==="S")&&(mn=!mn,oe.material.setShadowDebug(mn),e.info("debug","shadow-toggle",`Shadow-only ${mn?"ON":"OFF"}`)))};nt&&(window.addEventListener("keydown",Gt),e.info("debug","controls",'Debug controls active: press "a" for albedo-only, "s" for shadow-only',{mode:e.getMode()}));let ei=r.current;const _t=typeof window.requestIdleCallback=="function"?z=>window.requestIdleCallback(z,{timeout:200}):z=>window.setTimeout(z,0),on=typeof window.cancelIdleCallback=="function"?z=>window.cancelIdleCallback(z):z=>window.clearTimeout(z);let tn=null;const jt=1e-6,rs=r.subscribe(()=>{const z=r.current,Se=z.quality!==ei.quality,Pe=z.audioMuted!==ei.audioMuted||Math.abs(z.audioVolume-ei.audioVolume)>jt;if(ei=z,Pe){tn!==null&&(on(tn),tn=null),Oe(Se);return}tn!==null&&on(tn),tn=_t(()=>{tn=null,Oe(Se),T.prewarm(W.scene,W.camera)})}),cl=z=>{var Se,Pe,Ze,xt,Et,Lt;k.update(u[z],!0),I.setActive(z),j((Pe=(Se=u[z])==null?void 0:Se.title)!=null?Pe:""),U==null||U.setSelectedArtworkId((xt=(Ze=u[z])==null?void 0:Ze.id)!=null?xt:null,{alignPage:!1,source:"gallery-navigate"}),e.info("gallery","navigate","Artwork changed",{index:z,artworkId:(Et=u[z])==null?void 0:Et.id,title:(Lt=u[z])==null?void 0:Lt.title})};ee.onNavigate(cl),Xe.onPrev(()=>ee.navigate(-1)),Xe.onNext(()=>ee.navigate(1)),Xe.enableIdleHint(),I.onSelect(z=>ee.goTo(z)),I.onPreview(z=>ee.promotePrefetchWindow(z,"timeline-preview"));const An=new sx({onStateChange:z=>{var Se;n.dataset.experience=z==="destination"?"gallery":z,Ta(n,p,T),Aa(e,`experience-state:${z}`,p,T,(Se=U==null?void 0:U.element)!=null?Se:null,_.overlay.isConnected?_.overlay:null,n),e.info("navigation","experience-state","Experience state changed",{state:z})},onTransitionError:(z,Se)=>{U==null||U.showError(),e.error("navigation","destination-transition-failed",`Failed to enter destination "${z.id}"`,Se)}});An.register({id:"hub",label:"Main Museum Hub",prepare:()=>U.prepare(),enter:()=>{var z,Se;oe.group.visible=!1,F==null||F.setVisible(!1),B.setEnabled(!1),se.setEnabled(!1),U.setSelectedArtworkId((Se=(z=u[ee.index])==null?void 0:z.id)!=null?Se:null,{alignPage:!0,source:"router-enter-hub"}),U.enter()},exit:()=>U.exit(r.current.reducedMotion)}),An.register({id:"gallery",label:"Interaktive Galerie",prepare:async()=>{oe.group.visible=!0,F==null||F.setVisible(!0),ee.resetView(),await Si()},enter:()=>{var z;B.setEnabled(!0),se.setEnabled(!0),re.focus({preventScroll:!0}),e.info("navigation","gallery-entered","Existing interactive gallery entered from museum hub",{artworkId:(z=u[ee.index])==null?void 0:z.id})},exit:()=>{B.setEnabled(!1),se.setEnabled(!1)}}),U.onActivate(()=>{An.navigate("gallery")});const Hu=new Map;u.forEach((z,Se)=>Hu.set(z.id,Se));let Pa=0;U.onSelectSlot(z=>{const Se=++Pa,Pe=z.artworkId,Ze=Pe!==null?Hu.get(Pe):void 0;if(Pe===null||Ze===void 0){e.warn("navigation","hub-slot-invalid","Hub slot activation without a valid exact target; ignoring",{slotId:z.id,artworkId:Pe}),U.showError();return}e.info("navigation","hub-slot-select","Hub frame selected",{slotId:z.id,artworkId:Pe,artworkIndex:Ze,generation:Se}),ee.goTo(Ze),ee.promotePrefetchWindow(Ze,"hub-slot"),ee.whenArtworkInteractive(Ze,v.selectionTimeoutMs).then(xt=>{if(Se!==Pa){e.info("navigation","hub-slot-stale-readiness","Ignoring stale hub readiness completion",{slotId:z.id,artworkId:Pe,generation:Se,currentGeneration:Pa});return}xt==="timeout"&&e.warn("navigation","hub-slot-readiness-timeout","Hub readiness gate timed out; entering exact target with procedural surface",{slotId:z.id,artworkId:Pe,timeoutMs:v.selectionTimeoutMs}),ee.index!==Ze&&ee.goTo(Ze),An.navigate("gallery")})});const Gu=()=>{Pa+=1,Je.setBackBusy(!0),An.navigate("hub").finally(()=>Je.setBackBusy(!1))};Je.onBackClick=Gu,se.onEscape=()=>{document.querySelector(".keyboard-help:not([hidden])")||document.querySelector(".prefs__panel:not([hidden])")||Gu()};const Vu=z=>{if(We=requestAnimationFrame(Vu),T.isRenderPaused()||Ne)return;ee.hasReadinessWork()&&xe.markReadinessWork();const Se=xe.sample(z);ee.markInteractionFrame(Se.dtMs);const Pe=Be.evaluate(Se,xe);Pe&&Pe!==r.current.quality&&(e.warn("quality","adaptive-downgrade","Adaptive quality downgrade triggered",{from:r.current.quality,to:Pe,rollingFps:Math.round(Se.rollingFps*10)/10,rollingMs:Math.round(Se.rollingMs*10)/10,severeFrameCount:Se.severeFrameCount}),r.setQuality(Pe));const Ze=X.update(z),xt=ee.update(z);!Ze&&!xt&&!ee.hasReadinessWork()||(W.camera.updateMatrixWorld(),X.getKeyLightWorldDir(ku),Du.copy(ku).transformDirection(W.camera.matrixWorldInverse),oe.material.setKeyLightDirView(Du),V.render())};We=requestAnimationFrame(Vu),e.info("boot","pre-entry-raf-start","Production RAF started under loading overlay before entry CTA",{artworkCount:Ee,renderer:Jn(T.renderer)}),await Si(),e.info("boot","first-full-frame-rendered","First full-size production frame rendered under loading overlay",{activeArtwork:(Qu=u[ee.index])==null?void 0:Qu.id,renderer:Jn(T.renderer)}),await Si(),e.info("boot","second-full-frame-presented","Second full-size production frame presented under loading overlay; entry CTA may now be enabled",{activeArtwork:(Ju=u[ee.index])==null?void 0:Ju.id,renderer:Jn(T.renderer)}),e.info("boot","entry-cta-enabled","Loading screen readiness gate complete; enabling entry CTA",{artworkCount:Ee,pendingCount:it.pendingCount,finalPathWarmed:is,timelinePrewarm:Ca,uiPrewarm:E,renderer:Jn(T.renderer)}),e.info("boot","performance-gate","Startup performance gate (v0.67 P-07 acceptance evidence)",{schemaVersion:1,startupReadinessMode:K,artworkCount:Ee,automaticQualityChangesEnabled:we,activeQuality:r.current.quality,entryWarmCount:ut.length,deferredWarmCount:Dt,preloadMode:it.preloadMode,startupMsToEntryCta:Math.round((performance.now()-i)*10)/10,postRevealFrameBudgetMs:Ve.postRevealFrameBudgetMs,postRevealBatchCap:Ve.postRevealBatchCap,fullyReadyCount:it.fullyReadyCount,pendingCount:it.pendingCount,deferredArtworkCount:it.deferredArtworkCount}),oe.group.visible=!1,F==null||F.setVisible(!1),_.setStatus("Museum wird vorbereitet"),await An.startAt("hub"),_.setProgress(100),await _.reveal(),_.dispose(),U.focusInitialTarget(),window.addEventListener("beforeunload",()=>{r.normalizeStartupAudio("beforeunload-close",!1),cancelAnimationFrame(We),H!==0&&cancelAnimationFrame(H),tn!==null&&on(tn),Ce==null||Ce.disconnect(),bt!==void 0&&clearInterval(bt),S!==void 0&&clearTimeout(S),document.removeEventListener("visibilitychange",rt),window.removeEventListener("pagehide",pt),window.removeEventListener("pageshow",mt),window.removeEventListener("freeze",zt),window.removeEventListener("resume",st),rs(),M(),nt&&window.removeEventListener("keydown",Gt),window.removeEventListener("pointerdown",ve),window.removeEventListener("keydown",Ae),window.removeEventListener("pointerdown",ne),window.removeEventListener("pointerup",ce),window.removeEventListener("pointercancel",ce),ke!==void 0&&clearTimeout(ke),window.removeEventListener("resize",ye),window.removeEventListener("orientationchange",ye),be==null||be.removeEventListener("resize",ye),be==null||be.removeEventListener("scroll",ye),Te==null||Te.disconnect(),clearTimeout(q),e.info("boot","shutdown","Disposing FREYRAUM runtime"),An.dispose(),r.dispose(),B.dispose(),$.dispose(),se.dispose(),Q.dispose(),Je.dispose(),k.dispose(),A(),ie==null||ie.remove(),ie=null,Xe.dispose(),Ue.dispose(),Re.dispose(),dt.dispose(),Fe.dispose(),ze.dispose(),I.dispose(),w.remove(),s.dispose(),ee.dispose(),oe.dispose(),F==null||F.dispose(),J.dispose(),ee.proceduralFactory.disposeAll(),X.dispose(),V.dispose(),W.dispose(),T.dispose()})}Xx().catch(i=>{nr().error("boot","startup-failed","Fatal startup failure",i);const e=document.getElementById("app");if(e){const t=Vx();document.documentElement.style.backgroundColor=t,document.body.style.backgroundColor=t,e.style.backgroundColor=t,Ed(e,{category:"startup",reason:i instanceof Error?i.message:"Unbekannter Fehler beim Initialisieren.",surfaceColor:t,artworks:Nu,onRetry:()=>window.location.reload()})}})})();
