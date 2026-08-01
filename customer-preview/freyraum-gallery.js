function freyraumPseudoRandom(){const cryptoApi=globalThis.crypto;if(cryptoApi&&cryptoApi.getRandomValues){const values=new Uint32Array(1);cryptoApi.getRandomValues(values);return values[0]/4294967296}const now=Date.now();const perf=globalThis.performance&&globalThis.performance.now?globalThis.performance.now():0;return (Math.sin(now+perf)*10000)%1}
var n0=Object.defineProperty;var i0=(mn,Mn,qi)=>Mn in mn?n0(mn,Mn,{enumerable:!0,configurable:!0,writable:!0,value:qi}):mn[Mn]=qi;var y=(mn,Mn,qi)=>i0(mn,typeof Mn!="symbol"?Mn+"":Mn,qi);(function(){"use strict";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var mu,gu;const mn="166",wn="",Ct="srgb",an="srgb-linear",Vs="display-p3",Rr="display-p3-linear",Pr="linear",ct="srgb",Ir="rec709",Lr="p3",bo="300 es";class ii{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let So=1234567;const Zi=Math.PI/180,ri=180/Math.PI;function Nn(){const i=freyraumPseudoRandom()*4294967295|0,e=freyraumPseudoRandom()*4294967295|0,t=freyraumPseudoRandom()*4294967295|0,n=freyraumPseudoRandom()*4294967295|0;return(Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]).toLowerCase()}function wt(i,e,t){return Math.max(e,Math.min(t,i))}function Ws(i,e){return(i%e+e)%e}function Pu(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Iu(i,e,t){return i!==e?(t-i)/(e-i):0}function Ki(i,e,t){return(1-t)*i+t*e}function Lu(i,e,t,n){return Ki(i,e,1-Math.exp(-t*n))}function Du(i,e=1){return e-Math.abs(Ws(i,e*2)-e)}function Nu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Fu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Uu(i,e){return i+Math.floor(freyraumPseudoRandom()*(e-i+1))}function ku(i,e){return i+freyraumPseudoRandom()*(e-i)}function Ou(i){return i*(.5-freyraumPseudoRandom())}function Bu(i){i!==void 0&&(So=i);let e=So+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zu(i){return i*Zi}function Hu(i){return i*ri}function Gu(i){return(i&i-1)===0&&i!==0}function Vu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xu(i,e,t,n,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),u=a((e+n)/2),h=s((e-n)/2),d=a((e-n)/2),f=s((n-e)/2),g=a((n-e)/2);switch(r){case"XYX":i.set(o*u,l*h,l*d,o*c);break;case"YZY":i.set(l*d,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*d,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function si(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const $u={DEG2RAD:Zi,RAD2DEG:ri,generateUUID:Nn,clamp:wt,euclideanModulo:Ws,mapLinear:Pu,inverseLerp:Iu,lerp:Ki,damp:Lu,pingpong:Du,smoothstep:Nu,smootherstep:Fu,randInt:Uu,randFloat:ku,randFloatSpread:Ou,seededRandom:Bu,degToRad:zu,radToDeg:Hu,isPowerOfTwo:Gu,ceilPowerOfTwo:Vu,floorPowerOfTwo:Wu,setQuaternionFromProperEuler:Xu,normalize:Dt,denormalize:si};class he{constructor(e=0,t=0){he.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class We{constructor(e,t,n,r,s,a,o,l,c){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],v=r[0],p=r[3],m=r[6],b=r[1],x=r[4],E=r[7],I=r[2],A=r[5],C=r[8];return s[0]=a*v+o*b+l*I,s[3]=a*p+o*x+l*A,s[6]=a*m+o*E+l*C,s[1]=c*v+u*b+h*I,s[4]=c*p+u*x+h*A,s[7]=c*m+u*E+h*C,s[2]=d*v+f*b+g*I,s[5]=d*p+f*x+g*A,s[8]=d*m+f*E+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*s,f=c*s-a*l,g=t*h+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*c-u*n)*v,e[2]=(o*n-r*a)*v,e[3]=d*v,e[4]=(u*t-r*l)*v,e[5]=(r*s-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Xs.makeScale(e,t)),this}rotate(e){return this.premultiply(Xs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xs=new We;function Mo(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ji(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yu(){const i=ji("canvas");return i.style.display="block",i}const wo={};function Eo(i){i in wo||(wo[i]=!0,console.warn(i))}function qu(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const To=new We().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ao=new We().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Dr={[an]:{transfer:Pr,primaries:Ir,toReference:i=>i,fromReference:i=>i},[Ct]:{transfer:ct,primaries:Ir,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Rr]:{transfer:Pr,primaries:Lr,toReference:i=>i.applyMatrix3(Ao),fromReference:i=>i.applyMatrix3(To)},[Vs]:{transfer:ct,primaries:Lr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Ao),fromReference:i=>i.applyMatrix3(To).convertLinearToSRGB()}},Zu=new Set([an,Rr]),nt={enabled:!0,_workingColorSpace:an,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Zu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Dr[e].toReference,r=Dr[t].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Dr[i].primaries},getTransfer:function(i){return i===wn?Pr:Dr[i].transfer}};function ai(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let oi;class Ku{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{oi===void 0&&(oi=ji("canvas")),oi.width=e.width,oi.height=e.height;const n=oi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=oi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=ji("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ai(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ai(t[n]/255)*255):t[n]=ai(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ju=0;class Co{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Nn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ys(r[a].image)):s.push(Ys(r[a]))}else s=Ys(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Ys(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Ku.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qu=0;class Et extends ii{constructor(e=Et.DEFAULT_IMAGE,t=Et.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,l=1009,c=Et.DEFAULT_ANISOTROPY,u=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=Nn(),this.name="",this.source=new Co(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Et.DEFAULT_IMAGE=null,Et.DEFAULT_MAPPING=300,Et.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,r=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,E=(f+1)/2,I=(m+1)/2,A=(u+d)/4,C=(h+v)/4,N=(g+p)/4;return x>E&&x>I?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=A/n,s=C/n):E>I?E<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),n=A/r,s=N/r):I<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),n=C/s,r=N/s),this.set(n,r,s,t),this}let b=Math.sqrt((p-g)*(p-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(h-v)/b,this.z=(d-u)/b,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this.w=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ju extends ii{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Et(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Co(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $t extends Ju{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ro extends Et{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ed extends Et{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qi{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],h=n[r+3];const d=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==d||c!==f||u!==g){let p=1-o;const m=l*d+c*f+u*g+h*v,b=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const I=Math.sqrt(x),A=Math.atan2(I,m*b);p=Math.sin(p*A)/I,o=Math.sin(o*A)/I}const E=o*b;if(l=l*p+d*E,c=c*p+f*E,u=u*p+g*E,h=h*p+v*E,p===1-o){const I=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=I,c*=I,u*=I,h*=I}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],h=s[a],d=s[a+1],f=s[a+2],g=s[a+3];return e[t]=o*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-o*f,e[t+2]=c*g+u*f+o*d-l*h,e[t+3]=u*g-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),h=o(s/2),d=l(n/2),f=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(a-r)*f}else if(n>o&&n>h){const f=2*Math.sqrt(1+n-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-n-h);this._w=(s-c)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-o);this._w=(a-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(wt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*h+this._w*d,this._x=n*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*freyraumPseudoRandom(),t=2*Math.PI*freyraumPseudoRandom(),n=freyraumPseudoRandom(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,n=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Po.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Po.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),h=2*(s*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-s*h,this.z=r+l*h+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qs.copy(this).projectOnVector(e),this.sub(qs)}reflect(e){return this.sub(qs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this}randomDirection(){const e=freyraumPseudoRandom()*Math.PI*2,t=freyraumPseudoRandom()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qs=new F,Po=new Qi;class Ji{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Qt):Qt.fromBufferAttribute(s,a),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Nr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Nr.copy(n.boundingBox)),Nr.applyMatrix4(e.matrixWorld),this.union(Nr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(er),Fr.subVectors(this.max,er),li.subVectors(e.a,er),ci.subVectors(e.b,er),ui.subVectors(e.c,er),En.subVectors(ci,li),Tn.subVectors(ui,ci),Fn.subVectors(li,ui);let t=[0,-En.z,En.y,0,-Tn.z,Tn.y,0,-Fn.z,Fn.y,En.z,0,-En.x,Tn.z,0,-Tn.x,Fn.z,0,-Fn.x,-En.y,En.x,0,-Tn.y,Tn.x,0,-Fn.y,Fn.x,0];return!Zs(t,li,ci,ui,Fr)||(t=[1,0,0,0,1,0,0,0,1],!Zs(t,li,ci,ui,Fr))?!1:(Ur.crossVectors(En,Tn),t=[Ur.x,Ur.y,Ur.z],Zs(t,li,ci,ui,Fr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const gn=[new F,new F,new F,new F,new F,new F,new F,new F],Qt=new F,Nr=new Ji,li=new F,ci=new F,ui=new F,En=new F,Tn=new F,Fn=new F,er=new F,Fr=new F,Ur=new F,Un=new F;function Zs(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Un.fromArray(i,s);const o=r.x*Math.abs(Un.x)+r.y*Math.abs(Un.y)+r.z*Math.abs(Un.z),l=e.dot(Un),c=t.dot(Un),u=n.dot(Un);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const td=new Ji,tr=new F,Ks=new F;class js{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):td.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;tr.subVectors(e,this.center);const t=tr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(tr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ks.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(tr.copy(e.center).add(Ks)),this.expandByPoint(tr.copy(e.center).sub(Ks))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const vn=new F,Qs=new F,kr=new F,An=new F,Js=new F,Or=new F,ea=new F;class nd{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vn.copy(this.origin).addScaledVector(this.direction,t),vn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Qs.copy(e).add(t).multiplyScalar(.5),kr.copy(t).sub(e).normalize(),An.copy(this.origin).sub(Qs);const s=e.distanceTo(t)*.5,a=-this.direction.dot(kr),o=An.dot(this.direction),l=-An.dot(kr),c=An.lengthSq(),u=Math.abs(1-a*a);let h,d,f,g;if(u>0)if(h=a*l-o,d=a*o-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Qs).addScaledVector(kr,d),f}intersectSphere(e,t){vn.subVectors(e.center,this.origin);const n=vn.dot(this.direction),r=vn.dot(vn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,vn)!==null}intersectTriangle(e,t,n,r,s){Js.subVectors(t,e),Or.subVectors(n,e),ea.crossVectors(Js,Or);let a=this.direction.dot(ea),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;An.subVectors(this.origin,e);const l=o*this.direction.dot(Or.crossVectors(An,Or));if(l<0)return null;const c=o*this.direction.dot(Js.cross(An));if(c<0||l+c>a)return null;const u=-o*An.dot(ea);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ft{constructor(e,t,n,r,s,a,o,l,c,u,h,d,f,g,v,p){ft.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,h,d,f,g,v,p)}set(e,t,n,r,s,a,o,l,c,u,h,d,f,g,v,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=r,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ft().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/di.setFromMatrixColumn(e,0).length(),s=1/di.setFromMatrixColumn(e,1).length(),a=1/di.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=a*u,f=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d-v*o,t[4]=-a*h,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*u,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*h,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=v-d*h,t[8]=g*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+v,t[5]=a*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=o*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(id,e,rd)}lookAt(e,t,n){const r=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),Cn.crossVectors(n,zt),Cn.lengthSq()===0&&(Math.abs(n.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),Cn.crossVectors(n,zt)),Cn.normalize(),Br.crossVectors(zt,Cn),r[0]=Cn.x,r[4]=Br.x,r[8]=zt.x,r[1]=Cn.y,r[5]=Br.y,r[9]=zt.y,r[2]=Cn.z,r[6]=Br.z,r[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],b=n[3],x=n[7],E=n[11],I=n[15],A=r[0],C=r[4],N=r[8],S=r[12],M=r[1],P=r[5],X=r[9],B=r[13],V=r[2],j=r[6],D=r[10],J=r[14],q=r[3],ce=r[7],fe=r[11],me=r[15];return s[0]=a*A+o*M+l*V+c*q,s[4]=a*C+o*P+l*j+c*ce,s[8]=a*N+o*X+l*D+c*fe,s[12]=a*S+o*B+l*J+c*me,s[1]=u*A+h*M+d*V+f*q,s[5]=u*C+h*P+d*j+f*ce,s[9]=u*N+h*X+d*D+f*fe,s[13]=u*S+h*B+d*J+f*me,s[2]=g*A+v*M+p*V+m*q,s[6]=g*C+v*P+p*j+m*ce,s[10]=g*N+v*X+p*D+m*fe,s[14]=g*S+v*B+p*J+m*me,s[3]=b*A+x*M+E*V+I*q,s[7]=b*C+x*P+E*j+I*ce,s[11]=b*N+x*X+E*D+I*fe,s[15]=b*S+x*B+E*J+I*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],v=e[7],p=e[11],m=e[15];return g*(+s*l*h-r*c*h-s*o*d+n*c*d+r*o*f-n*l*f)+v*(+t*l*f-t*c*d+s*a*d-r*a*f+r*c*u-s*l*u)+p*(+t*c*h-t*o*f-s*a*h+n*a*f+s*o*u-n*c*u)+m*(-r*o*u-t*l*h+t*o*d+r*a*h-n*a*d+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],p=e[14],m=e[15],b=h*p*c-v*d*c+v*l*f-o*p*f-h*l*m+o*d*m,x=g*d*c-u*p*c-g*l*f+a*p*f+u*l*m-a*d*m,E=u*v*c-g*h*c+g*o*f-a*v*f-u*o*m+a*h*m,I=g*h*l-u*v*l-g*o*d+a*v*d+u*o*p-a*h*p,A=t*b+n*x+r*E+s*I;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return e[0]=b*C,e[1]=(v*d*s-h*p*s-v*r*f+n*p*f+h*r*m-n*d*m)*C,e[2]=(o*p*s-v*l*s+v*r*c-n*p*c-o*r*m+n*l*m)*C,e[3]=(h*l*s-o*d*s-h*r*c+n*d*c+o*r*f-n*l*f)*C,e[4]=x*C,e[5]=(u*p*s-g*d*s+g*r*f-t*p*f-u*r*m+t*d*m)*C,e[6]=(g*l*s-a*p*s-g*r*c+t*p*c+a*r*m-t*l*m)*C,e[7]=(a*d*s-u*l*s+u*r*c-t*d*c-a*r*f+t*l*f)*C,e[8]=E*C,e[9]=(g*h*s-u*v*s-g*n*f+t*v*f+u*n*m-t*h*m)*C,e[10]=(a*v*s-g*o*s+g*n*c-t*v*c-a*n*m+t*o*m)*C,e[11]=(u*o*s-a*h*s-u*n*c+t*h*c+a*n*f-t*o*f)*C,e[12]=I*C,e[13]=(u*v*r-g*h*r+g*n*d-t*v*d-u*n*p+t*h*p)*C,e[14]=(g*o*r-a*v*r-g*n*l+t*v*l+a*n*p-t*o*p)*C,e[15]=(a*h*r-u*o*r+u*n*l-t*h*l-a*n*d+t*o*d)*C,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,h=o+o,d=s*c,f=s*u,g=s*h,v=a*u,p=a*h,m=o*h,b=l*c,x=l*u,E=l*h,I=n.x,A=n.y,C=n.z;return r[0]=(1-(v+m))*I,r[1]=(f+E)*I,r[2]=(g-x)*I,r[3]=0,r[4]=(f-E)*A,r[5]=(1-(d+m))*A,r[6]=(p+b)*A,r[7]=0,r[8]=(g+x)*C,r[9]=(p-b)*C,r[10]=(1-(d+v))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=di.set(r[0],r[1],r[2]).length();const a=di.set(r[4],r[5],r[6]).length(),o=di.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Jt.copy(this);const c=1/s,u=1/a,h=1/o;return Jt.elements[0]*=c,Jt.elements[1]*=c,Jt.elements[2]*=c,Jt.elements[4]*=u,Jt.elements[5]*=u,Jt.elements[6]*=u,Jt.elements[8]*=h,Jt.elements[9]*=h,Jt.elements[10]*=h,t.setFromRotationMatrix(Jt),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=2e3){const l=this.elements,c=2*s/(t-e),u=2*s/(n-r),h=(t+e)/(t-e),d=(n+r)/(n-r);let f,g;if(o===2e3)f=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===2001)f=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=2e3){const l=this.elements,c=1/(t-e),u=1/(n-r),h=1/(a-s),d=(t+e)*c,f=(n+r)*u;let g,v;if(o===2e3)g=(a+s)*h,v=-2*h;else if(o===2001)g=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const di=new F,Jt=new ft,id=new F(0,0,0),rd=new F(1,1,1),Cn=new F,Br=new F,zt=new F,Io=new ft,Lo=new Qi;class on{constructor(e=0,t=0,n=0,r=on.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-wt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Io.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Io,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lo.setFromEuler(this),this.setFromQuaternion(Lo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}on.DEFAULT_ORDER="XYZ";class Do{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sd=0;const No=new F,hi=new Qi,_n=new ft,zr=new F,nr=new F,ad=new F,od=new Qi,Fo=new F(1,0,0),Uo=new F(0,1,0),ko=new F(0,0,1),Oo={type:"added"},ld={type:"removed"},fi={type:"childadded",child:null},ta={type:"childremoved",child:null};class xt extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=Nn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new F,t=new on,n=new Qi,r=new F(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ft},normalMatrix:{value:new We}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Do,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hi.setFromAxisAngle(e,t),this.quaternion.multiply(hi),this}rotateOnWorldAxis(e,t){return hi.setFromAxisAngle(e,t),this.quaternion.premultiply(hi),this}rotateX(e){return this.rotateOnAxis(Fo,e)}rotateY(e){return this.rotateOnAxis(Uo,e)}rotateZ(e){return this.rotateOnAxis(ko,e)}translateOnAxis(e,t){return No.copy(e).applyQuaternion(this.quaternion),this.position.add(No.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fo,e)}translateY(e){return this.translateOnAxis(Uo,e)}translateZ(e){return this.translateOnAxis(ko,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?zr.copy(e):zr.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(nr,zr,this.up):_n.lookAt(zr,nr,this.up),this.quaternion.setFromRotationMatrix(_n),r&&(_n.extractRotation(r.matrixWorld),hi.setFromRotationMatrix(_n),this.quaternion.premultiply(hi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Oo),fi.child=e,this.dispatchEvent(fi),fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ld),ta.child=e,this.dispatchEvent(ta),ta.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Oo),fi.child=e,this.dispatchEvent(fi),fi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,e,ad),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,od,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}xt.DEFAULT_UP=new F(0,1,0),xt.DEFAULT_MATRIX_AUTO_UPDATE=!0,xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const en=new F,xn=new F,na=new F,yn=new F,pi=new F,mi=new F,Bo=new F,ia=new F,ra=new F,sa=new F;class ln{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),en.subVectors(e,t),r.cross(en);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){en.subVectors(r,t),xn.subVectors(n,t),na.subVectors(e,t);const a=en.dot(en),o=en.dot(xn),l=en.dot(na),c=xn.dot(xn),u=xn.dot(na),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,g=(a*u-o*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,yn.x),l.addScaledVector(a,yn.y),l.addScaledVector(o,yn.z),l)}static isFrontFacing(e,t,n,r){return en.subVectors(n,t),xn.subVectors(e,t),en.cross(xn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return en.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),en.cross(xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ln.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return ln.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;pi.subVectors(r,n),mi.subVectors(s,n),ia.subVectors(e,n);const l=pi.dot(ia),c=mi.dot(ia);if(l<=0&&c<=0)return t.copy(n);ra.subVectors(e,r);const u=pi.dot(ra),h=mi.dot(ra);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(pi,a);sa.subVectors(e,s);const f=pi.dot(sa),g=mi.dot(sa);if(g>=0&&f<=g)return t.copy(s);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(mi,o);const p=u*g-f*h;if(p<=0&&h-u>=0&&f-g>=0)return Bo.subVectors(s,r),o=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(Bo,o);const m=1/(p+v+d);return a=v*m,o=d*m,t.copy(n).addScaledVector(pi,a).addScaledVector(mi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const zo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},Hr={h:0,s:0,l:0};function aa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ue{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=nt.workingColorSpace){if(e=Ws(e,1),t=wt(t,0,1),n=wt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=aa(a,s,e+1/3),this.g=aa(a,s,e),this.b=aa(a,s,e-1/3)}return nt.toWorkingColorSpace(this,r),this}setStyle(e,t=Ct){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){const n=zo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ai(e.r),this.g=ai(e.g),this.b=ai(e.b),this}copyLinearToSRGB(e){return this.r=$s(e.r),this.g=$s(e.g),this.b=$s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return nt.fromWorkingColorSpace(Pt.copy(this),e),Math.round(wt(Pt.r*255,0,255))*65536+Math.round(wt(Pt.g*255,0,255))*256+Math.round(wt(Pt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Pt.copy(this),t);const n=Pt.r,r=Pt.g,s=Pt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-n)/h+2;break;case s:l=(n-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Ct){nt.fromWorkingColorSpace(Pt.copy(this),e);const t=Pt.r,n=Pt.g,r=Pt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Rn),this.setHSL(Rn.h+e,Rn.s+t,Rn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Rn),e.getHSL(Hr);const n=Ki(Rn.h,Hr.h,t),r=Ki(Rn.s,Hr.s,t),s=Ki(Rn.l,Hr.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new Ue;Ue.NAMES=zo;let cd=0;class ir extends ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=Nn(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class gi extends ir{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const yt=new F,Gr=new he;class cn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Eo("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Gr.fromBufferAttribute(this,t),Gr.applyMatrix3(e),this.setXY(t,Gr.x,Gr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=si(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=si(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=si(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=si(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=si(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array),s=Dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}}class Ho extends cn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Go extends cn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Yt extends cn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ud=0;const qt=new ft,oa=new xt,vi=new F,Ht=new Ji,rr=new Ji,Tt=new F;class bn extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ud++}),this.uuid=Nn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Mo(e)?Go:Ho)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new We().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qt.makeRotationFromQuaternion(e),this.applyMatrix4(qt),this}rotateX(e){return qt.makeRotationX(e),this.applyMatrix4(qt),this}rotateY(e){return qt.makeRotationY(e),this.applyMatrix4(qt),this}rotateZ(e){return qt.makeRotationZ(e),this.applyMatrix4(qt),this}translate(e,t,n){return qt.makeTranslation(e,t,n),this.applyMatrix4(qt),this}scale(e,t,n){return qt.makeScale(e,t,n),this.applyMatrix4(qt),this}lookAt(e){return oa.lookAt(e),oa.updateMatrix(),this.applyMatrix4(oa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vi).negate(),this.translate(vi.x,vi.y,vi.z),this}setFromPoints(e){const t=[];for(let n=0,r=e.length;n<r;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Yt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ji);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Ht.setFromBufferAttribute(s),this.morphTargetsRelative?(Tt.addVectors(this.boundingBox.min,Ht.min),this.boundingBox.expandByPoint(Tt),Tt.addVectors(this.boundingBox.max,Ht.max),this.boundingBox.expandByPoint(Tt)):(this.boundingBox.expandByPoint(Ht.min),this.boundingBox.expandByPoint(Ht.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new js);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(Ht.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];rr.setFromBufferAttribute(o),this.morphTargetsRelative?(Tt.addVectors(Ht.min,rr.min),Ht.expandByPoint(Tt),Tt.addVectors(Ht.max,rr.max),Ht.expandByPoint(Tt)):(Ht.expandByPoint(rr.min),Ht.expandByPoint(rr.max))}Ht.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Tt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Tt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Tt.fromBufferAttribute(o,c),l&&(vi.fromBufferAttribute(e,c),Tt.add(vi)),r=Math.max(r,n.distanceToSquared(Tt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new cn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let N=0;N<n.count;N++)o[N]=new F,l[N]=new F;const c=new F,u=new F,h=new F,d=new he,f=new he,g=new he,v=new F,p=new F;function m(N,S,M){c.fromBufferAttribute(n,N),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,M),d.fromBufferAttribute(s,N),f.fromBufferAttribute(s,S),g.fromBufferAttribute(s,M),u.sub(c),h.sub(c),f.sub(d),g.sub(d);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(P),p.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(P),o[N].add(v),o[S].add(v),o[M].add(v),l[N].add(p),l[S].add(p),l[M].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let N=0,S=b.length;N<S;++N){const M=b[N],P=M.start,X=M.count;for(let B=P,V=P+X;B<V;B+=3)m(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const x=new F,E=new F,I=new F,A=new F;function C(N){I.fromBufferAttribute(r,N),A.copy(I);const S=o[N];x.copy(S),x.sub(I.multiplyScalar(I.dot(S))).normalize(),E.crossVectors(A,S);const P=E.dot(l[N])<0?-1:1;a.setXYZW(N,x.x,x.y,x.z,P)}for(let N=0,S=b.length;N<S;++N){const M=b[N],P=M.start,X=M.count;for(let B=P,V=P+X;B<V;B+=3)C(e.getX(B+0)),C(e.getX(B+1)),C(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new cn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new F,s=new F,a=new F,o=new F,l=new F,c=new F,u=new F,h=new F;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Tt.fromBufferAttribute(e,t),Tt.normalize(),e.setXYZ(t,Tt.x,Tt.y,Tt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,g=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*u;for(let m=0;m<u;m++)d[g++]=c[f++]}return new cn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new bn,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vo=new ft,kn=new nd,Vr=new js,Wo=new F,_i=new F,xi=new F,yi=new F,la=new F,Wr=new F,Xr=new he,$r=new he,Yr=new he,Xo=new F,$o=new F,Yo=new F,qr=new F,Zr=new F;class rt extends xt{constructor(e=new bn,t=new gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Wr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(la.fromBufferAttribute(h,e),a?Wr.addScaledVector(la,u):Wr.addScaledVector(la.sub(t),u))}t.add(Wr)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(s),kn.copy(e.ray).recast(e.near),!(Vr.containsPoint(kn.origin)===!1&&(kn.intersectSphere(Vr,Wo)===null||kn.origin.distanceToSquared(Wo)>(e.far-e.near)**2))&&(Vo.copy(s).invert(),kn.copy(e.ray).applyMatrix4(Vo),!(n.boundingBox!==null&&kn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,kn)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=a[p.materialIndex],b=Math.max(p.start,f.start),x=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let E=b,I=x;E<I;E+=3){const A=o.getX(E),C=o.getX(E+1),N=o.getX(E+2);r=Kr(this,m,e,n,c,u,h,A,C,N),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const b=o.getX(p),x=o.getX(p+1),E=o.getX(p+2);r=Kr(this,a,e,n,c,u,h,b,x,E),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=a[p.materialIndex],b=Math.max(p.start,f.start),x=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let E=b,I=x;E<I;E+=3){const A=E,C=E+1,N=E+2;r=Kr(this,m,e,n,c,u,h,A,C,N),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const b=p,x=p+1,E=p+2;r=Kr(this,a,e,n,c,u,h,b,x,E),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function dd(i,e,t,n,r,s,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===0,o),l===null)return null;Zr.copy(o),Zr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Zr);return c<t.near||c>t.far?null:{distance:c,point:Zr.clone(),object:i}}function Kr(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,_i),i.getVertexPosition(l,xi),i.getVertexPosition(c,yi);const u=dd(i,e,t,n,_i,xi,yi,qr);if(u){r&&(Xr.fromBufferAttribute(r,o),$r.fromBufferAttribute(r,l),Yr.fromBufferAttribute(r,c),u.uv=ln.getInterpolation(qr,_i,xi,yi,Xr,$r,Yr,new he)),s&&(Xr.fromBufferAttribute(s,o),$r.fromBufferAttribute(s,l),Yr.fromBufferAttribute(s,c),u.uv1=ln.getInterpolation(qr,_i,xi,yi,Xr,$r,Yr,new he)),a&&(Xo.fromBufferAttribute(a,o),$o.fromBufferAttribute(a,l),Yo.fromBufferAttribute(a,c),u.normal=ln.getInterpolation(qr,_i,xi,yi,Xo,$o,Yo,new F),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new F,materialIndex:0};ln.getNormal(_i,xi,yi,h.normal),u.face=h}return u}class bi extends bn{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(u,3)),this.setAttribute("uv",new Yt(h,2));function g(v,p,m,b,x,E,I,A,C,N,S){const M=E/C,P=I/N,X=E/2,B=I/2,V=A/2,j=C+1,D=N+1;let J=0,q=0;const ce=new F;for(let fe=0;fe<D;fe++){const me=fe*P-B;for(let Ce=0;Ce<j;Ce++){const $e=Ce*M-X;ce[v]=$e*b,ce[p]=me*x,ce[m]=V,c.push(ce.x,ce.y,ce.z),ce[v]=0,ce[p]=0,ce[m]=A>0?1:-1,u.push(ce.x,ce.y,ce.z),h.push(Ce/C),h.push(1-fe/N),J+=1}}for(let fe=0;fe<N;fe++)for(let me=0;me<C;me++){const Ce=d+me+j*fe,$e=d+me+j*(fe+1),Q=d+(me+1)+j*(fe+1),ie=d+(me+1)+j*fe;l.push(Ce,$e,ie),l.push($e,Q,ie),q+=6}o.addGroup(f,q,S),f+=q,d+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Si(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Nt(i){const e={};for(let t=0;t<i.length;t++){const n=Si(i[t]);for(const r in n)e[r]=n[r]}return e}function hd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function qo(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const sr={clone:Si,merge:Nt};var fd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ft extends ir{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fd,this.fragmentShader=pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Si(e.uniforms),this.uniformsGroups=hd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Zo extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=2e3}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pn=new F,Ko=new he,jo=new he;class Ut extends Zo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ri*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ri*2*Math.atan(Math.tan(Zi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z)}getViewSize(e,t){return this.getViewBounds(e,Ko,jo),t.subVectors(jo,Ko)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zi*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Mi=-90,wi=1;class md extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ut(Mi,wi,e,t);r.layers=this.layers,this.add(r);const s=new Ut(Mi,wi,e,t);s.layers=this.layers,this.add(s);const a=new Ut(Mi,wi,e,t);a.layers=this.layers,this.add(a);const o=new Ut(Mi,wi,e,t);o.layers=this.layers,this.add(o);const l=new Ut(Mi,wi,e,t);l.layers=this.layers,this.add(l);const c=new Ut(Mi,wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Qo extends Et{constructor(e,t,n,r,s,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:301,super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gd extends $t{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Qo(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:1006}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new bi(5,5,5),s=new Ft({name:"CubemapFromEquirect",uniforms:Si(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new rt(r,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new md(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}const ca=new F,vd=new F,_d=new We;class On{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=ca.subVectors(n,t).cross(vd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ca),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||_d.getNormalMatrix(e),r=this.coplanarPoint(ca).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Bn=new js,jr=new F;class ua{constructor(e=new On,t=new On,n=new On,r=new On,s=new On,a=new On){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],h=r[6],d=r[7],f=r[8],g=r[9],v=r[10],p=r[11],m=r[12],b=r[13],x=r[14],E=r[15];if(n[0].setComponents(l-s,d-c,p-f,E-m).normalize(),n[1].setComponents(l+s,d+c,p+f,E+m).normalize(),n[2].setComponents(l+a,d+u,p+g,E+b).normalize(),n[3].setComponents(l-a,d-u,p-g,E-b).normalize(),n[4].setComponents(l-o,d-h,p-v,E-x).normalize(),t===2e3)n[5].setComponents(l+o,d+h,p+v,E+x).normalize();else if(t===2001)n[5].setComponents(o,h,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bn)}intersectsSprite(e){return Bn.center.set(0,0,0),Bn.radius=.7071067811865476,Bn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(jr.x=r.normal.x>0?e.max.x:e.min.x,jr.y=r.normal.y>0?e.max.y:e.min.y,jr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(jr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Jo(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function xd(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l._updateRange,d=l.updateRanges;if(i.bindBuffer(c,o),h.count===-1&&d.length===0&&i.bufferSubData(c,0,u),d.length!==0){for(let f=0,g=d.length;f<g;f++){const v=d[f];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}h.count!==-1&&(i.bufferSubData(c,h.offset*u.BYTES_PER_ELEMENT,u,h.offset,h.count),h.count=-1),l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class zn extends bn{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,h=e/o,d=t/l,f=[],g=[],v=[],p=[];for(let m=0;m<u;m++){const b=m*d-a;for(let x=0;x<c;x++){const E=x*h-s;g.push(E,-b,0),v.push(0,0,1),p.push(x/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<o;b++){const x=b+c*m,E=b+c*(m+1),I=b+1+c*(m+1),A=b+1+c*m;f.push(x,E,A),f.push(E,I,A)}this.setIndex(f),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(v,3)),this.setAttribute("uv",new Yt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zn(e.width,e.height,e.widthSegments,e.heightSegments)}}var yd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bd=`#ifdef USE_ALPHAHASH
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
#endif`,Sd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Md=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ed=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Td=`#ifdef USE_AOMAP
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
#endif`,Ad=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cd=`#ifdef USE_BATCHING
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
#endif`,Rd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Id=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ld=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Dd=`#ifdef USE_IRIDESCENCE
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
#endif`,Nd=`#ifdef USE_BUMPMAP
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
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ud=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Vd=`#define PI 3.141592653589793
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
} // validated`,Wd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xd=`vec3 transformedNormal = objectNormal;
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
#endif`,$d=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kd="gl_FragColor = linearToOutputTexel( gl_FragColor );",jd=`
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
}`,Qd=`#ifdef USE_ENVMAP
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
#endif`,Jd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,eh=`#ifdef USE_ENVMAP
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
#endif`,th=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nh=`#ifdef USE_ENVMAP
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
#endif`,ih=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ah=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,oh=`#ifdef USE_GRADIENTMAP
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
}`,lh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ch=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dh=`uniform bool receiveShadow;
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
#endif`,hh=`#ifdef USE_ENVMAP
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
#endif`,fh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ph=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vh=`PhysicalMaterial material;
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
#endif`,_h=`struct PhysicalMaterial {
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
}`,xh=`
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
#endif`,yh=`#if defined( RE_IndirectDiffuse )
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
#endif`,bh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sh=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mh=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wh=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Eh=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Th=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ah=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ch=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rh=`#if defined( USE_POINTS_UV )
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
#endif`,Ph=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ih=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lh=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Dh=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nh=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fh=`#ifdef USE_MORPHTARGETS
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
#endif`,Uh=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Oh=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gh=`#ifdef USE_NORMALMAP
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
#endif`,Vh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wh=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$h=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qh=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Zh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kh=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qh=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jh=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ef=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sf=`float getShadowMask() {
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
}`,af=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,of=`#ifdef USE_SKINNING
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
#endif`,lf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cf=`#ifdef USE_SKINNING
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
#endif`,uf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,df=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ff=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pf=`#ifdef USE_TRANSMISSION
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
#endif`,mf=`#ifdef USE_TRANSMISSION
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
#endif`,gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_f=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xe={alphahash_fragment:yd,alphahash_pars_fragment:bd,alphamap_fragment:Sd,alphamap_pars_fragment:Md,alphatest_fragment:wd,alphatest_pars_fragment:Ed,aomap_fragment:Td,aomap_pars_fragment:Ad,batching_pars_vertex:Cd,batching_vertex:Rd,begin_vertex:Pd,beginnormal_vertex:Id,bsdfs:Ld,iridescence_fragment:Dd,bumpmap_pars_fragment:Nd,clipping_planes_fragment:Fd,clipping_planes_pars_fragment:Ud,clipping_planes_pars_vertex:kd,clipping_planes_vertex:Od,color_fragment:Bd,color_pars_fragment:zd,color_pars_vertex:Hd,color_vertex:Gd,common:Vd,cube_uv_reflection_fragment:Wd,defaultnormal_vertex:Xd,displacementmap_pars_vertex:$d,displacementmap_vertex:Yd,emissivemap_fragment:qd,emissivemap_pars_fragment:Zd,colorspace_fragment:Kd,colorspace_pars_fragment:jd,envmap_fragment:Qd,envmap_common_pars_fragment:Jd,envmap_pars_fragment:eh,envmap_pars_vertex:th,envmap_physical_pars_fragment:hh,envmap_vertex:nh,fog_vertex:ih,fog_pars_vertex:rh,fog_fragment:sh,fog_pars_fragment:ah,gradientmap_pars_fragment:oh,lightmap_pars_fragment:lh,lights_lambert_fragment:ch,lights_lambert_pars_fragment:uh,lights_pars_begin:dh,lights_toon_fragment:fh,lights_toon_pars_fragment:ph,lights_phong_fragment:mh,lights_phong_pars_fragment:gh,lights_physical_fragment:vh,lights_physical_pars_fragment:_h,lights_fragment_begin:xh,lights_fragment_maps:yh,lights_fragment_end:bh,logdepthbuf_fragment:Sh,logdepthbuf_pars_fragment:Mh,logdepthbuf_pars_vertex:wh,logdepthbuf_vertex:Eh,map_fragment:Th,map_pars_fragment:Ah,map_particle_fragment:Ch,map_particle_pars_fragment:Rh,metalnessmap_fragment:Ph,metalnessmap_pars_fragment:Ih,morphinstance_vertex:Lh,morphcolor_vertex:Dh,morphnormal_vertex:Nh,morphtarget_pars_vertex:Fh,morphtarget_vertex:Uh,normal_fragment_begin:kh,normal_fragment_maps:Oh,normal_pars_fragment:Bh,normal_pars_vertex:zh,normal_vertex:Hh,normalmap_pars_fragment:Gh,clearcoat_normal_fragment_begin:Vh,clearcoat_normal_fragment_maps:Wh,clearcoat_pars_fragment:Xh,iridescence_pars_fragment:$h,opaque_fragment:Yh,packing:qh,premultiplied_alpha_fragment:Zh,project_vertex:Kh,dithering_fragment:jh,dithering_pars_fragment:Qh,roughnessmap_fragment:Jh,roughnessmap_pars_fragment:ef,shadowmap_pars_fragment:tf,shadowmap_pars_vertex:nf,shadowmap_vertex:rf,shadowmask_pars_fragment:sf,skinbase_vertex:af,skinning_pars_vertex:of,skinning_vertex:lf,skinnormal_vertex:cf,specularmap_fragment:uf,specularmap_pars_fragment:df,tonemapping_fragment:hf,tonemapping_pars_fragment:ff,transmission_fragment:pf,transmission_pars_fragment:mf,uv_pars_fragment:gf,uv_pars_vertex:vf,uv_vertex:_f,worldpos_vertex:xf,background_vert:`varying vec2 vUv;
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
}`},pe={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},un={basic:{uniforms:Nt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Nt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Nt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Nt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Nt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Nt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Nt([pe.points,pe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Nt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Nt([pe.common,pe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Nt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Nt([pe.sprite,pe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Nt([pe.common,pe.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Nt([pe.lights,pe.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};un.physical={uniforms:Nt([un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Qr={r:0,b:0,g:0},Hn=new on,yf=new ft;function bf(i,e,t,n,r,s,a){const o=new Ue(0);let l=s===!0?0:1,c,u,h=null,d=0,f=null;function g(b){let x=b.isScene===!0?b.background:null;return x&&x.isTexture&&(x=(b.backgroundBlurriness>0?t:e).get(x)),x}function v(b){let x=!1;const E=g(b);E===null?m(o,l):E&&E.isColor&&(m(E,1),x=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,a):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(b,x){const E=g(x);E&&(E.isCubeTexture||E.mapping===306)?(u===void 0&&(u=new rt(new bi(1,1,1),new Ft({name:"BackgroundCubeMaterial",uniforms:Si(un.backgroundCube.uniforms),vertexShader:un.backgroundCube.vertexShader,fragmentShader:un.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(I,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Hn.copy(x.backgroundRotation),Hn.x*=-1,Hn.y*=-1,Hn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Hn.y*=-1,Hn.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(yf.makeRotationFromEuler(Hn)),u.material.toneMapped=nt.getTransfer(E.colorSpace)!==ct,(h!==E||d!==E.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=E,d=E.version,f=i.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new rt(new zn(2,2),new Ft({name:"BackgroundMaterial",uniforms:Si(un.background.uniforms),vertexShader:un.background.vertexShader,fragmentShader:un.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=nt.getTransfer(E.colorSpace)!==ct,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||d!==E.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=E,d=E.version,f=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function m(b,x){b.getRGB(Qr,qo(i)),n.buffers.color.setClear(Qr.r,Qr.g,Qr.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(b,x=1){o.set(b),l=x,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,m(o,l)},render:v,addToRenderList:p}}function Sf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(M,P,X,B,V){let j=!1;const D=h(B,X,P);s!==D&&(s=D,c(s.object)),j=f(M,B,X,V),j&&g(M,B,X,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,E(M,P,X,B),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,P,X){const B=X.wireframe===!0;let V=n[M.id];V===void 0&&(V={},n[M.id]=V);let j=V[P.id];j===void 0&&(j={},V[P.id]=j);let D=j[B];return D===void 0&&(D=d(l()),j[B]=D),D}function d(M){const P=[],X=[],B=[];for(let V=0;V<t;V++)P[V]=0,X[V]=0,B[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:X,attributeDivisors:B,object:M,attributes:{},index:null}}function f(M,P,X,B){const V=s.attributes,j=P.attributes;let D=0;const J=X.getAttributes();for(const q in J)if(J[q].location>=0){const fe=V[q];let me=j[q];if(me===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(me=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(me=M.instanceColor)),fe===void 0||fe.attribute!==me||me&&fe.data!==me.data)return!0;D++}return s.attributesNum!==D||s.index!==B}function g(M,P,X,B){const V={},j=P.attributes;let D=0;const J=X.getAttributes();for(const q in J)if(J[q].location>=0){let fe=j[q];fe===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(fe=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(fe=M.instanceColor));const me={};me.attribute=fe,fe&&fe.data&&(me.data=fe.data),V[q]=me,D++}s.attributes=V,s.attributesNum=D,s.index=B}function v(){const M=s.newAttributes;for(let P=0,X=M.length;P<X;P++)M[P]=0}function p(M){m(M,0)}function m(M,P){const X=s.newAttributes,B=s.enabledAttributes,V=s.attributeDivisors;X[M]=1,B[M]===0&&(i.enableVertexAttribArray(M),B[M]=1),V[M]!==P&&(i.vertexAttribDivisor(M,P),V[M]=P)}function b(){const M=s.newAttributes,P=s.enabledAttributes;for(let X=0,B=P.length;X<B;X++)P[X]!==M[X]&&(i.disableVertexAttribArray(X),P[X]=0)}function x(M,P,X,B,V,j,D){D===!0?i.vertexAttribIPointer(M,P,X,V,j):i.vertexAttribPointer(M,P,X,B,V,j)}function E(M,P,X,B){v();const V=B.attributes,j=X.getAttributes(),D=P.defaultAttributeValues;for(const J in j){const q=j[J];if(q.location>=0){let ce=V[J];if(ce===void 0&&(J==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),J==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),ce!==void 0){const fe=ce.normalized,me=ce.itemSize,Ce=e.get(ce);if(Ce===void 0)continue;const $e=Ce.buffer,Q=Ce.type,ie=Ce.bytesPerElement,xe=Q===i.INT||Q===i.UNSIGNED_INT||ce.gpuType===1013;if(ce.isInterleavedBufferAttribute){const ve=ce.data,Ne=ve.stride,Oe=ce.offset;if(ve.isInstancedInterleavedBuffer){for(let Ge=0;Ge<q.locationSize;Ge++)m(q.location+Ge,ve.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let Ge=0;Ge<q.locationSize;Ge++)p(q.location+Ge);i.bindBuffer(i.ARRAY_BUFFER,$e);for(let Ge=0;Ge<q.locationSize;Ge++)x(q.location+Ge,me/q.locationSize,Q,fe,Ne*ie,(Oe+me/q.locationSize*Ge)*ie,xe)}else{if(ce.isInstancedBufferAttribute){for(let ve=0;ve<q.locationSize;ve++)m(q.location+ve,ce.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ve=0;ve<q.locationSize;ve++)p(q.location+ve);i.bindBuffer(i.ARRAY_BUFFER,$e);for(let ve=0;ve<q.locationSize;ve++)x(q.location+ve,me/q.locationSize,Q,fe,me*ie,me/q.locationSize*ve*ie,xe)}}else if(D!==void 0){const fe=D[J];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(q.location,fe);break;case 3:i.vertexAttrib3fv(q.location,fe);break;case 4:i.vertexAttrib4fv(q.location,fe);break;default:i.vertexAttrib1fv(q.location,fe)}}}}b()}function I(){N();for(const M in n){const P=n[M];for(const X in P){const B=P[X];for(const V in B)u(B[V].object),delete B[V];delete P[X]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;const P=n[M.id];for(const X in P){const B=P[X];for(const V in B)u(B[V].object),delete B[V];delete P[X]}delete n[M.id]}function C(M){for(const P in n){const X=n[P];if(X[M.id]===void 0)continue;const B=X[M.id];for(const V in B)u(B[V].object),delete B[V];delete X[M.id]}}function N(){S(),a=!0,s!==r&&(s=r,c(s.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:S,dispose:I,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:p,disableUnusedAttributes:b}}function Mf(i,e,t){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,n,1)}function l(c,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v];for(let v=0;v<d.length;v++)t.update(g,n,d[v])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function wf(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==1023&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==1009&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==1015&&!C)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=f>0,I=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:m,maxVaryings:b,maxFragmentUniforms:x,vertexTextures:E,maxSamples:I}}function Ef(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new On,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||r;return r=d,n=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,m=i.get(h);if(!r||g===null||g.length===0||s&&!p)s?u(null):c();else{const b=s?0:n,x=b*4;let E=m.clippingState||null;l.value=E,E=u(g,d,x,f);for(let I=0;I!==x;++I)E[I]=t[I];m.clippingState=E,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,g){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const m=f+v*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<m)&&(p=new Float32Array(m));for(let x=0,E=f;x!==v;++x,E+=4)a.copy(h[x]).applyMatrix4(b,o),a.normal.toArray(p,E),p[E+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function Tf(i){let e=new WeakMap;function t(a,o){return o===303?a.mapping=301:o===304&&(a.mapping=302),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===303||o===304)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new gd(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class da extends Zo{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ei=4,el=[.125,.215,.35,.446,.526,.582],Gn=20,ha=new da,tl=new Ue;let fa=null,pa=0,ma=0,ga=!1;const Vn=(1+Math.sqrt(5))/2,Ti=1/Vn,nl=[new F(-Vn,Ti,0),new F(Vn,Ti,0),new F(-Ti,0,Vn),new F(Ti,0,Vn),new F(0,Vn,-Ti),new F(0,Vn,Ti),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)];class va{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){fa=this._renderer.getRenderTarget(),pa=this._renderer.getActiveCubeFace(),ma=this._renderer.getActiveMipmapLevel(),ga=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fa,pa,ma),this._renderer.xr.enabled=ga,e.scissorTest=!1,Jr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fa=this._renderer.getRenderTarget(),pa=this._renderer.getActiveCubeFace(),ma=this._renderer.getActiveMipmapLevel(),ga=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:an,depthBuffer:!1},r=il(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=il(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Af(s)),this._blurMaterial=Cf(s,e,t)}return r}_compileMaterial(e){const t=new rt(this._lodPlanes[0],e);this._renderer.compile(t,ha)}_sceneToCubeUV(e,t,n,r){const o=new Ut(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(tl),u.toneMapping=0,u.autoClear=!1;const f=new gi({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),g=new rt(new bi,f);let v=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,v=!0):(f.color.copy(tl),v=!0);for(let m=0;m<6;m++){const b=m%3;b===0?(o.up.set(0,l[m],0),o.lookAt(c[m],0,0)):b===1?(o.up.set(0,0,l[m]),o.lookAt(0,c[m],0)):(o.up.set(0,l[m],0),o.lookAt(0,0,c[m]));const x=this._cubeSize;Jr(r,b*x,m>2?x:0,x,x),u.setRenderTarget(r),v&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new rt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Jr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ha)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=nl[(r-s-1)%nl.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new rt(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Gn-1),v=s/g,p=isFinite(s)?1+Math.floor(u*v):Gn;p>Gn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Gn}`);const m=[];let b=0;for(let C=0;C<Gn;++C){const N=C/v,S=Math.exp(-N*N/2);m.push(S),C===0?b+=S:C<p&&(b+=2*S)}for(let C=0;C<m.length;C++)m[C]=m[C]/b;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const E=this._sizeLods[r],I=3*E*(r>x-Ei?r-x+Ei:0),A=4*(this._cubeSize-E);Jr(t,I,A,3*E,2*E),l.setRenderTarget(t),l.render(h,ha)}}function Af(i){const e=[],t=[],n=[];let r=i;const s=i-Ei+1+el.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>i-Ei?l=el[a-i+Ei-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,v=3,p=2,m=1,b=new Float32Array(v*g*f),x=new Float32Array(p*g*f),E=new Float32Array(m*g*f);for(let A=0;A<f;A++){const C=A%3*2/3-1,N=A>2?0:-1,S=[C,N,0,C+2/3,N,0,C+2/3,N+1,0,C,N,0,C+2/3,N+1,0,C,N+1,0];b.set(S,v*g*A),x.set(d,p*g*A);const M=[A,A,A,A,A,A];E.set(M,m*g*A)}const I=new bn;I.setAttribute("position",new cn(b,v)),I.setAttribute("uv",new cn(x,p)),I.setAttribute("faceIndex",new cn(E,m)),e.push(I),r>Ei&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function il(i,e,t){const n=new $t(i,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Jr(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Cf(i,e,t){const n=new Float32Array(Gn),r=new F(0,1,0);return new Ft({name:"SphericalGaussianBlur",defines:{n:Gn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:_a(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function rl(){return new Ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_a(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function sl(){return new Ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function _a(){return`

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
	`}function Rf(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===303||l===304,u=l===301||l===302;if(c||u){let h=e.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new va(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const f=o.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new va(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Pf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Eo("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function If(i,e,t,n){const r={},s=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let p=0,m=v.length;p<m;p++)e.remove(v[p])}d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const f=h.morphAttributes;for(const g in f){const v=f[g];for(let p=0,m=v.length;p<m;p++)e.update(v[p],i.ARRAY_BUFFER)}}function c(h){const d=[],f=h.index,g=h.attributes.position;let v=0;if(f!==null){const b=f.array;v=f.version;for(let x=0,E=b.length;x<E;x+=3){const I=b[x+0],A=b[x+1],C=b[x+2];d.push(I,A,A,C,C,I)}}else if(g!==void 0){const b=g.array;v=g.version;for(let x=0,E=b.length/3-1;x<E;x+=3){const I=x+0,A=x+1,C=x+2;d.push(I,A,A,C,C,I)}}else return;const p=new(Mo(d)?Go:Ho)(d,1);p.version=v;const m=s.get(h);m&&e.remove(m),s.set(h,p)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Lf(i,e,t){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,s,d*a),t.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,d*a,g),t.update(f,n,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}function h(d,f,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)c(d[m]/a,f[m],v[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,v,0,g);let m=0;for(let b=0;b<g;b++)m+=f[b];for(let b=0;b<v.length;b++)t.update(m,n,v[b])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Df(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Nf(i,e,t){const n=new WeakMap,r=new ht;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let x=0;f===!0&&(x=1),g===!0&&(x=2),v===!0&&(x=3);let E=o.attributes.position.count*x,I=1;E>e.maxTextureSize&&(I=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*I*4*h),C=new Ro(A,E,I,h);C.type=1015,C.needsUpdate=!0;const N=x*4;for(let M=0;M<h;M++){const P=p[M],X=m[M],B=b[M],V=E*I*4*M;for(let j=0;j<P.count;j++){const D=j*N;f===!0&&(r.fromBufferAttribute(P,j),A[V+D+0]=r.x,A[V+D+1]=r.y,A[V+D+2]=r.z,A[V+D+3]=0),g===!0&&(r.fromBufferAttribute(X,j),A[V+D+4]=r.x,A[V+D+5]=r.y,A[V+D+6]=r.z,A[V+D+7]=0),v===!0&&(r.fromBufferAttribute(B,j),A[V+D+8]=r.x,A[V+D+9]=r.y,A[V+D+10]=r.z,A[V+D+11]=B.itemSize===4?r.w:1)}}d={count:h,texture:C,size:new he(E,I)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Ff(i,e,t,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class al extends Et{constructor(e,t,n,r,s,a,o,l,c,u=1026){if(u!==1026&&u!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===1026&&(n=1014),n===void 0&&u===1027&&(n=1020),super(null,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const ol=new Et,ll=new al(1,1),cl=new Ro,ul=new ed,dl=new Qo,hl=[],fl=[],pl=new Float32Array(16),ml=new Float32Array(9),gl=new Float32Array(4);function Ai(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=hl[r];if(s===void 0&&(s=new Float32Array(r),hl[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function St(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function es(i,e){let t=fl[e];t===void 0&&(t=new Int32Array(e),fl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Uf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2fv(this.addr,e),Mt(t,e)}}function Of(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;i.uniform3fv(this.addr,e),Mt(t,e)}}function Bf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4fv(this.addr,e),Mt(t,e)}}function zf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;gl.set(n),i.uniformMatrix2fv(this.addr,!1,gl),Mt(t,n)}}function Hf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;ml.set(n),i.uniformMatrix3fv(this.addr,!1,ml),Mt(t,n)}}function Gf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;pl.set(n),i.uniformMatrix4fv(this.addr,!1,pl),Mt(t,n)}}function Vf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Wf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2iv(this.addr,e),Mt(t,e)}}function Xf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3iv(this.addr,e),Mt(t,e)}}function $f(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4iv(this.addr,e),Mt(t,e)}}function Yf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function qf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2uiv(this.addr,e),Mt(t,e)}}function Zf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3uiv(this.addr,e),Mt(t,e)}}function Kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4uiv(this.addr,e),Mt(t,e)}}function jf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(ll.compareFunction=515,s=ll):s=ol,t.setTexture2D(e||s,r)}function Qf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||ul,r)}function Jf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||dl,r)}function ep(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||cl,r)}function tp(i){switch(i){case 5126:return Uf;case 35664:return kf;case 35665:return Of;case 35666:return Bf;case 35674:return zf;case 35675:return Hf;case 35676:return Gf;case 5124:case 35670:return Vf;case 35667:case 35671:return Wf;case 35668:case 35672:return Xf;case 35669:case 35673:return $f;case 5125:return Yf;case 36294:return qf;case 36295:return Zf;case 36296:return Kf;case 35678:case 36198:case 36298:case 36306:case 35682:return jf;case 35679:case 36299:case 36307:return Qf;case 35680:case 36300:case 36308:case 36293:return Jf;case 36289:case 36303:case 36311:case 36292:return ep}}function np(i,e){i.uniform1fv(this.addr,e)}function ip(i,e){const t=Ai(e,this.size,2);i.uniform2fv(this.addr,t)}function rp(i,e){const t=Ai(e,this.size,3);i.uniform3fv(this.addr,t)}function sp(i,e){const t=Ai(e,this.size,4);i.uniform4fv(this.addr,t)}function ap(i,e){const t=Ai(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function op(i,e){const t=Ai(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function lp(i,e){const t=Ai(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function cp(i,e){i.uniform1iv(this.addr,e)}function up(i,e){i.uniform2iv(this.addr,e)}function dp(i,e){i.uniform3iv(this.addr,e)}function hp(i,e){i.uniform4iv(this.addr,e)}function fp(i,e){i.uniform1uiv(this.addr,e)}function pp(i,e){i.uniform2uiv(this.addr,e)}function mp(i,e){i.uniform3uiv(this.addr,e)}function gp(i,e){i.uniform4uiv(this.addr,e)}function vp(i,e,t){const n=this.cache,r=e.length,s=es(t,r);St(n,s)||(i.uniform1iv(this.addr,s),Mt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||ol,s[a])}function _p(i,e,t){const n=this.cache,r=e.length,s=es(t,r);St(n,s)||(i.uniform1iv(this.addr,s),Mt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||ul,s[a])}function xp(i,e,t){const n=this.cache,r=e.length,s=es(t,r);St(n,s)||(i.uniform1iv(this.addr,s),Mt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||dl,s[a])}function yp(i,e,t){const n=this.cache,r=e.length,s=es(t,r);St(n,s)||(i.uniform1iv(this.addr,s),Mt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||cl,s[a])}function bp(i){switch(i){case 5126:return np;case 35664:return ip;case 35665:return rp;case 35666:return sp;case 35674:return ap;case 35675:return op;case 35676:return lp;case 5124:case 35670:return cp;case 35667:case 35671:return up;case 35668:case 35672:return dp;case 35669:case 35673:return hp;case 5125:return fp;case 36294:return pp;case 36295:return mp;case 36296:return gp;case 35678:case 36198:case 36298:case 36306:case 35682:return vp;case 35679:case 36299:case 36307:return _p;case 35680:case 36300:case 36308:case 36293:return xp;case 36289:case 36303:case 36311:case 36292:return yp}}class Sp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=tp(t.type)}}class Mp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bp(t.type)}}class wp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const xa=/(\w+)(\])?(\[|\.)?/g;function vl(i,e){i.seq.push(e),i.map[e.id]=e}function Ep(i,e,t){const n=i.name,r=n.length;for(xa.lastIndex=0;;){const s=xa.exec(n),a=xa.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){vl(t,c===void 0?new Sp(o,i,e):new Mp(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new wp(o),vl(t,h)),t=h}}}class ts{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);Ep(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function _l(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Tp=37297;let Ap=0;function Cp(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Rp(i){const e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(i);let n;switch(e===t?n="":e===Lr&&t===Ir?n="LinearDisplayP3ToLinearSRGB":e===Ir&&t===Lr&&(n="LinearSRGBToLinearDisplayP3"),i){case an:case Rr:return[n,"LinearTransferOETF"];case Ct:case Vs:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function xl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Cp(i.getShaderSource(e),a)}else return r}function Pp(i,e){const t=Rp(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Ip(i,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="OptimizedCineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Lp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ar).join(`
`)}function Dp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Np(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ar(i){return i!==""}function yl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Fp=/^[ \t]*#include +<([\w\d./]+)>/gm;function ya(i){return i.replace(Fp,kp)}const Up=new Map;function kp(i,e){let t=Xe[e];if(t===void 0){const n=Up.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ya(t)}const Op=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sl(i){return i.replace(Op,Bp)}function Bp(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ml(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function zp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===1?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===2?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===3&&(e="SHADOWMAP_TYPE_VSM"),e}function Hp(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Gp(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function Vp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function Wp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Xp(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=zp(t),c=Hp(t),u=Gp(t),h=Vp(t),d=Wp(t),f=Lp(t),g=Dp(s),v=r.createProgram();let p,m,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ar).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ar).join(`
`),m.length>0&&(m+=`
`)):(p=[Ml(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ar).join(`
`),m=[Ml(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Xe.tonemapping_pars_fragment:"",t.toneMapping!==0?Ip("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Pp("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ar).join(`
`)),a=ya(a),a=yl(a,t),a=bl(a,t),o=ya(o),o=yl(o,t),o=bl(o,t),a=Sl(a),o=Sl(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===bo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===bo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=b+p+a,E=b+m+o,I=_l(r,r.VERTEX_SHADER,x),A=_l(r,r.FRAGMENT_SHADER,E);r.attachShader(v,I),r.attachShader(v,A),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function C(P){if(i.debug.checkShaderErrors){const X=r.getProgramInfoLog(v).trim(),B=r.getShaderInfoLog(I).trim(),V=r.getShaderInfoLog(A).trim();let j=!0,D=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,I,A);else{const J=xl(r,I,"vertex"),q=xl(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+X+`
`+J+`
`+q)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(B===""||V==="")&&(D=!1);D&&(P.diagnostics={runnable:j,programLog:X,vertexShader:{log:B,prefix:p},fragmentShader:{log:V,prefix:m}})}r.deleteShader(I),r.deleteShader(A),N=new ts(r,v),S=Np(r,v)}let N;this.getUniforms=function(){return N===void 0&&C(this),N};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(v,Tp)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ap++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=A,this}let $p=0;class Yp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new qp(e),t.set(e,n)),n}}class qp{constructor(e){this.id=$p++,this.code=e,this.usedTimes=0}}function Zp(i,e,t,n,r,s,a){const o=new Do,l=new Yp,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return c.add(S),S===0?"uv":`uv${S}`}function p(S,M,P,X,B){const V=X.fog,j=B.geometry,D=S.isMeshStandardMaterial?X.environment:null,J=(S.isMeshStandardMaterial?t:e).get(S.envMap||D),q=J&&J.mapping===306?J.image.height:null,ce=g[S.type];S.precision!==null&&(f=r.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const fe=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,me=fe!==void 0?fe.length:0;let Ce=0;j.morphAttributes.position!==void 0&&(Ce=1),j.morphAttributes.normal!==void 0&&(Ce=2),j.morphAttributes.color!==void 0&&(Ce=3);let $e,Q,ie,xe;if(ce){const we=un[ce];$e=we.vertexShader,Q=we.fragmentShader}else $e=S.vertexShader,Q=S.fragmentShader,l.update(S),ie=l.getVertexShaderID(S),xe=l.getFragmentShaderID(S);const ve=i.getRenderTarget(),Ne=B.isInstancedMesh===!0,Oe=B.isBatchedMesh===!0,Ge=!!S.map,st=!!S.matcap,L=!!J,dt=!!S.aoMap,qe=!!S.lightMap,et=!!S.bumpMap,Me=!!S.normalMap,it=!!S.displacementMap,Le=!!S.emissiveMap,R=!!S.metalnessMap,T=!!S.roughnessMap,_=S.anisotropy>0,U=S.clearcoat>0,$=S.dispersion>0,Z=S.iridescence>0,K=S.sheen>0,ae=S.transmission>0,ne=_&&!!S.anisotropyMap,ue=U&&!!S.clearcoatMap,De=U&&!!S.clearcoatNormalMap,re=U&&!!S.clearcoatRoughnessMap,de=Z&&!!S.iridescenceMap,ze=Z&&!!S.iridescenceThicknessMap,Ee=K&&!!S.sheenColorMap,ye=K&&!!S.sheenRoughnessMap,ke=!!S.specularMap,Be=!!S.specularColorMap,je=!!S.specularIntensityMap,k=ae&&!!S.transmissionMap,oe=ae&&!!S.thicknessMap,te=!!S.gradientMap,ee=!!S.alphaMap,se=S.alphaTest>0,Re=!!S.alphaHash,Ve=!!S.extensions;let at=0;S.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(at=i.toneMapping);const vt={shaderID:ce,shaderType:S.type,shaderName:S.name,vertexShader:$e,fragmentShader:Q,defines:S.defines,customVertexShaderID:ie,customFragmentShaderID:xe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Oe,batchingColor:Oe&&B._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&B.instanceColor!==null,instancingMorph:Ne&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ve===null?i.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:an,alphaToCoverage:!!S.alphaToCoverage,map:Ge,matcap:st,envMap:L,envMapMode:L&&J.mapping,envMapCubeUVHeight:q,aoMap:dt,lightMap:qe,bumpMap:et,normalMap:Me,displacementMap:d&&it,emissiveMap:Le,normalMapObjectSpace:Me&&S.normalMapType===1,normalMapTangentSpace:Me&&S.normalMapType===0,metalnessMap:R,roughnessMap:T,anisotropy:_,anisotropyMap:ne,clearcoat:U,clearcoatMap:ue,clearcoatNormalMap:De,clearcoatRoughnessMap:re,dispersion:$,iridescence:Z,iridescenceMap:de,iridescenceThicknessMap:ze,sheen:K,sheenColorMap:Ee,sheenRoughnessMap:ye,specularMap:ke,specularColorMap:Be,specularIntensityMap:je,transmission:ae,transmissionMap:k,thicknessMap:oe,gradientMap:te,opaque:S.transparent===!1&&S.blending===1&&S.alphaToCoverage===!1,alphaMap:ee,alphaTest:se,alphaHash:Re,combine:S.combine,mapUv:Ge&&v(S.map.channel),aoMapUv:dt&&v(S.aoMap.channel),lightMapUv:qe&&v(S.lightMap.channel),bumpMapUv:et&&v(S.bumpMap.channel),normalMapUv:Me&&v(S.normalMap.channel),displacementMapUv:it&&v(S.displacementMap.channel),emissiveMapUv:Le&&v(S.emissiveMap.channel),metalnessMapUv:R&&v(S.metalnessMap.channel),roughnessMapUv:T&&v(S.roughnessMap.channel),anisotropyMapUv:ne&&v(S.anisotropyMap.channel),clearcoatMapUv:ue&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:De&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:de&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:ze&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:ye&&v(S.sheenRoughnessMap.channel),specularMapUv:ke&&v(S.specularMap.channel),specularColorMapUv:Be&&v(S.specularColorMap.channel),specularIntensityMapUv:je&&v(S.specularIntensityMap.channel),transmissionMapUv:k&&v(S.transmissionMap.channel),thicknessMapUv:oe&&v(S.thicknessMap.channel),alphaMapUv:ee&&v(S.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Me||_),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!j.attributes.uv&&(Ge||ee),fog:!!V,useFog:S.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:B.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Ce,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:at,decodeVideoTexture:Ge&&S.map.isVideoTexture===!0&&nt.getTransfer(S.map.colorSpace)===ct,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===2,flipSided:S.side===1,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ve&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&S.extensions.multiDraw===!0||Oe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return vt.vertexUv1s=c.has(1),vt.vertexUv2s=c.has(2),vt.vertexUv3s=c.has(3),c.clear(),vt}function m(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)M.push(P),M.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(b(M,S),x(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function b(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function x(S,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.skinning&&o.enable(4),M.morphTargets&&o.enable(5),M.morphNormals&&o.enable(6),M.morphColors&&o.enable(7),M.premultipliedAlpha&&o.enable(8),M.shadowMapEnabled&&o.enable(9),M.doubleSided&&o.enable(10),M.flipSided&&o.enable(11),M.useDepthPacking&&o.enable(12),M.dithering&&o.enable(13),M.transmission&&o.enable(14),M.sheen&&o.enable(15),M.opaque&&o.enable(16),M.pointsUvs&&o.enable(17),M.decodeVideoTexture&&o.enable(18),M.alphaToCoverage&&o.enable(19),S.push(o.mask)}function E(S){const M=g[S.type];let P;if(M){const X=un[M];P=sr.clone(X.uniforms)}else P=S.uniforms;return P}function I(S,M){let P;for(let X=0,B=u.length;X<B;X++){const V=u[X];if(V.cacheKey===M){P=V,++P.usedTimes;break}}return P===void 0&&(P=new Xp(i,M,S,s),u.push(P)),P}function A(S){if(--S.usedTimes===0){const M=u.indexOf(S);u[M]=u[u.length-1],u.pop(),S.destroy()}}function C(S){l.remove(S)}function N(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:E,acquireProgram:I,releaseProgram:A,releaseShaderCache:C,programs:u,dispose:N}}function Kp(){let i=new WeakMap;function e(s){let a=i.get(s);return a===void 0&&(a={},i.set(s,a)),a}function t(s){i.delete(s)}function n(s,a,o){i.get(s)[a]=o}function r(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:r}}function jp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function wl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function El(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(h,d,f,g,v,p){let m=i[e];return m===void 0?(m={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:v,group:p},i[e]=m):(m.id=h.id,m.object=h,m.geometry=d,m.material=f,m.groupOrder=g,m.renderOrder=h.renderOrder,m.z=v,m.group=p),e++,m}function o(h,d,f,g,v,p){const m=a(h,d,f,g,v,p);f.transmission>0?n.push(m):f.transparent===!0?r.push(m):t.push(m)}function l(h,d,f,g,v,p){const m=a(h,d,f,g,v,p);f.transmission>0?n.unshift(m):f.transparent===!0?r.unshift(m):t.unshift(m)}function c(h,d){t.length>1&&t.sort(h||jp),n.length>1&&n.sort(d||wl),r.length>1&&r.sort(d||wl)}function u(){for(let h=e,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function Qp(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new El,i.set(n,[a])):r>=s.length?(a=new El,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Jp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Ue};break;case"SpotLight":t={position:new F,direction:new F,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new F,halfWidth:new F,halfHeight:new F};break}return i[e.id]=t,t}}}function em(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let tm=0;function nm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function im(i){const e=new Jp,t=em(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new F);const r=new F,s=new ft,a=new ft;function o(c){let u=0,h=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,b=0,x=0,E=0,I=0,A=0,C=0;c.sort(nm);for(let S=0,M=c.length;S<M;S++){const P=c[S],X=P.color,B=P.intensity,V=P.distance,j=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=X.r*B,h+=X.g*B,d+=X.b*B;else if(P.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(P.sh.coefficients[D],B);C++}else if(P.isDirectionalLight){const D=e.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const J=P.shadow,q=t.get(P);q.shadowIntensity=J.intensity,q.shadowBias=J.bias,q.shadowNormalBias=J.normalBias,q.shadowRadius=J.radius,q.shadowMapSize=J.mapSize,n.directionalShadow[f]=q,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=P.shadow.matrix,b++}n.directional[f]=D,f++}else if(P.isSpotLight){const D=e.get(P);D.position.setFromMatrixPosition(P.matrixWorld),D.color.copy(X).multiplyScalar(B),D.distance=V,D.coneCos=Math.cos(P.angle),D.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),D.decay=P.decay,n.spot[v]=D;const J=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,J.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[v]=J.matrix,P.castShadow){const q=t.get(P);q.shadowIntensity=J.intensity,q.shadowBias=J.bias,q.shadowNormalBias=J.normalBias,q.shadowRadius=J.radius,q.shadowMapSize=J.mapSize,n.spotShadow[v]=q,n.spotShadowMap[v]=j,E++}v++}else if(P.isRectAreaLight){const D=e.get(P);D.color.copy(X).multiplyScalar(B),D.halfWidth.set(P.width*.5,0,0),D.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=D,p++}else if(P.isPointLight){const D=e.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),D.distance=P.distance,D.decay=P.decay,P.castShadow){const J=P.shadow,q=t.get(P);q.shadowIntensity=J.intensity,q.shadowBias=J.bias,q.shadowNormalBias=J.normalBias,q.shadowRadius=J.radius,q.shadowMapSize=J.mapSize,q.shadowCameraNear=J.camera.near,q.shadowCameraFar=J.camera.far,n.pointShadow[g]=q,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=P.shadow.matrix,x++}n.point[g]=D,g++}else if(P.isHemisphereLight){const D=e.get(P);D.skyColor.copy(P.color).multiplyScalar(B),D.groundColor.copy(P.groundColor).multiplyScalar(B),n.hemi[m]=D,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const N=n.hash;(N.directionalLength!==f||N.pointLength!==g||N.spotLength!==v||N.rectAreaLength!==p||N.hemiLength!==m||N.numDirectionalShadows!==b||N.numPointShadows!==x||N.numSpotShadows!==E||N.numSpotMaps!==I||N.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=E+I-A,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,N.directionalLength=f,N.pointLength=g,N.spotLength=v,N.rectAreaLength=p,N.hemiLength=m,N.numDirectionalShadows=b,N.numPointShadows=x,N.numSpotShadows=E,N.numSpotMaps=I,N.numLightProbes=C,n.version=tm++)}function l(c,u){let h=0,d=0,f=0,g=0,v=0;const p=u.matrixWorldInverse;for(let m=0,b=c.length;m<b;m++){const x=c[m];if(x.isDirectionalLight){const E=n.directional[h];E.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(p),h++}else if(x.isSpotLight){const E=n.spot[f];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(p),E.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(p),f++}else if(x.isRectAreaLight){const E=n.rectArea[g];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(p),a.identity(),s.copy(x.matrixWorld),s.premultiply(p),a.extractRotation(s),E.halfWidth.set(x.width*.5,0,0),E.halfHeight.set(0,x.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const E=n.point[d];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(p),d++}else if(x.isHemisphereLight){const E=n.hemi[v];E.direction.setFromMatrixPosition(x.matrixWorld),E.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:n}}function Tl(i){const e=new im(i),t=[],n=[];function r(u){c.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function rm(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Tl(i),e.set(r,[o])):s>=a.length?(o=new Tl(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class sm extends ir{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class am extends ir{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const om=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lm=`uniform sampler2D shadow_pass;
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
}`;function cm(i,e,t){let n=new ua;const r=new he,s=new he,a=new ht,o=new sm({depthPacking:3201}),l=new am,c={},u=t.maxTextureSize,h={0:1,1:0,2:2},d=new Ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:om,fragmentShader:lm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new bn;g.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new rt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let m=this.type;this.render=function(A,C,N){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;const S=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),X=i.state;X.setBlending(0),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const B=m!==3&&this.type===3,V=m===3&&this.type!==3;for(let j=0,D=A.length;j<D;j++){const J=A[j],q=J.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;r.copy(q.mapSize);const ce=q.getFrameExtents();if(r.multiply(ce),s.copy(q.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ce.x),r.x=s.x*ce.x,q.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ce.y),r.y=s.y*ce.y,q.mapSize.y=s.y)),q.map===null||B===!0||V===!0){const me=this.type!==3?{minFilter:1003,magFilter:1003}:{};q.map!==null&&q.map.dispose(),q.map=new $t(r.x,r.y,me),q.map.texture.name=J.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const fe=q.getViewportCount();for(let me=0;me<fe;me++){const Ce=q.getViewport(me);a.set(s.x*Ce.x,s.y*Ce.y,s.x*Ce.z,s.y*Ce.w),X.viewport(a),q.updateMatrices(J,me),n=q.getFrustum(),E(C,N,q.camera,J,this.type)}q.isPointLightShadow!==!0&&this.type===3&&b(q,N),q.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(S,M,P)};function b(A,C){const N=e.update(v);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new $t(r.x,r.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,N,d,v,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,N,f,v,null)}function x(A,C,N,S){let M=null;const P=N.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)M=P;else if(M=N.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const X=M.uuid,B=C.uuid;let V=c[X];V===void 0&&(V={},c[X]=V);let j=V[B];j===void 0&&(j=M.clone(),V[B]=j,C.addEventListener("dispose",I)),M=j}if(M.visible=C.visible,M.wireframe=C.wireframe,S===3?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:h[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,N.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const X=i.properties.get(M);X.light=N}return M}function E(A,C,N,S,M){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===3)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,A.matrixWorld);const B=e.update(A),V=A.material;if(Array.isArray(V)){const j=B.groups;for(let D=0,J=j.length;D<J;D++){const q=j[D],ce=V[q.materialIndex];if(ce&&ce.visible){const fe=x(A,ce,S,M);A.onBeforeShadow(i,A,C,N,B,fe,q),i.renderBufferDirect(N,null,B,fe,A,q),A.onAfterShadow(i,A,C,N,B,fe,q)}}}else if(V.visible){const j=x(A,V,S,M);A.onBeforeShadow(i,A,C,N,B,j,null),i.renderBufferDirect(N,null,B,j,A,null),A.onAfterShadow(i,A,C,N,B,j,null)}}const X=A.children;for(let B=0,V=X.length;B<V;B++)E(X[B],C,N,S,M)}function I(A){A.target.removeEventListener("dispose",I);for(const N in c){const S=c[N],M=A.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}function um(i){function e(){let k=!1;const oe=new ht;let te=null;const ee=new ht(0,0,0,0);return{setMask:function(se){te!==se&&!k&&(i.colorMask(se,se,se,se),te=se)},setLocked:function(se){k=se},setClear:function(se,Re,Ve,at,vt){vt===!0&&(se*=at,Re*=at,Ve*=at),oe.set(se,Re,Ve,at),ee.equals(oe)===!1&&(i.clearColor(se,Re,Ve,at),ee.copy(oe))},reset:function(){k=!1,te=null,ee.set(-1,0,0,0)}}}function t(){let k=!1,oe=null,te=null,ee=null;return{setTest:function(se){se?xe(i.DEPTH_TEST):ve(i.DEPTH_TEST)},setMask:function(se){oe!==se&&!k&&(i.depthMask(se),oe=se)},setFunc:function(se){if(te!==se){switch(se){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}te=se}},setLocked:function(se){k=se},setClear:function(se){ee!==se&&(i.clearDepth(se),ee=se)},reset:function(){k=!1,oe=null,te=null,ee=null}}}function n(){let k=!1,oe=null,te=null,ee=null,se=null,Re=null,Ve=null,at=null,vt=null;return{setTest:function(we){k||(we?xe(i.STENCIL_TEST):ve(i.STENCIL_TEST))},setMask:function(we){oe!==we&&!k&&(i.stencilMask(we),oe=we)},setFunc:function(we,Gt,Kt){(te!==we||ee!==Gt||se!==Kt)&&(i.stencilFunc(we,Gt,Kt),te=we,ee=Gt,se=Kt)},setOp:function(we,Gt,Kt){(Re!==we||Ve!==Gt||at!==Kt)&&(i.stencilOp(we,Gt,Kt),Re=we,Ve=Gt,at=Kt)},setLocked:function(we){k=we},setClear:function(we){vt!==we&&(i.clearStencil(we),vt=we)},reset:function(){k=!1,oe=null,te=null,ee=null,se=null,Re=null,Ve=null,at=null,vt=null}}}const r=new e,s=new t,a=new n,o=new WeakMap,l=new WeakMap;let c={},u={},h=new WeakMap,d=[],f=null,g=!1,v=null,p=null,m=null,b=null,x=null,E=null,I=null,A=new Ue(0,0,0),C=0,N=!1,S=null,M=null,P=null,X=null,B=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,D=0;const J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(J)[1]),j=D>=1):J.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),j=D>=2);let q=null,ce={};const fe=i.getParameter(i.SCISSOR_BOX),me=i.getParameter(i.VIEWPORT),Ce=new ht().fromArray(fe),$e=new ht().fromArray(me);function Q(k,oe,te,ee){const se=new Uint8Array(4),Re=i.createTexture();i.bindTexture(k,Re),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ve=0;Ve<te;Ve++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(oe,0,i.RGBA,1,1,ee,0,i.RGBA,i.UNSIGNED_BYTE,se):i.texImage2D(oe+Ve,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,se);return Re}const ie={};ie[i.TEXTURE_2D]=Q(i.TEXTURE_2D,i.TEXTURE_2D,1),ie[i.TEXTURE_CUBE_MAP]=Q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[i.TEXTURE_2D_ARRAY]=Q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ie[i.TEXTURE_3D]=Q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),xe(i.DEPTH_TEST),s.setFunc(3),et(!1),Me(1),xe(i.CULL_FACE),dt(0);function xe(k){c[k]!==!0&&(i.enable(k),c[k]=!0)}function ve(k){c[k]!==!1&&(i.disable(k),c[k]=!1)}function Ne(k,oe){return u[k]!==oe?(i.bindFramebuffer(k,oe),u[k]=oe,k===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=oe),k===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=oe),!0):!1}function Oe(k,oe){let te=d,ee=!1;if(k){te=h.get(oe),te===void 0&&(te=[],h.set(oe,te));const se=k.textures;if(te.length!==se.length||te[0]!==i.COLOR_ATTACHMENT0){for(let Re=0,Ve=se.length;Re<Ve;Re++)te[Re]=i.COLOR_ATTACHMENT0+Re;te.length=se.length,ee=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,ee=!0);ee&&i.drawBuffers(te)}function Ge(k){return f!==k?(i.useProgram(k),f=k,!0):!1}const st={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};st[103]=i.MIN,st[104]=i.MAX;const L={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function dt(k,oe,te,ee,se,Re,Ve,at,vt,we){if(k===0){g===!0&&(ve(i.BLEND),g=!1);return}if(g===!1&&(xe(i.BLEND),g=!0),k!==5){if(k!==v||we!==N){if((p!==100||x!==100)&&(i.blendEquation(i.FUNC_ADD),p=100,x=100),we)switch(k){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}m=null,b=null,E=null,I=null,A.set(0,0,0),C=0,v=k,N=we}return}se=se||oe,Re=Re||te,Ve=Ve||ee,(oe!==p||se!==x)&&(i.blendEquationSeparate(st[oe],st[se]),p=oe,x=se),(te!==m||ee!==b||Re!==E||Ve!==I)&&(i.blendFuncSeparate(L[te],L[ee],L[Re],L[Ve]),m=te,b=ee,E=Re,I=Ve),(at.equals(A)===!1||vt!==C)&&(i.blendColor(at.r,at.g,at.b,vt),A.copy(at),C=vt),v=k,N=!1}function qe(k,oe){k.side===2?ve(i.CULL_FACE):xe(i.CULL_FACE);let te=k.side===1;oe&&(te=!te),et(te),k.blending===1&&k.transparent===!1?dt(0):dt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),s.setFunc(k.depthFunc),s.setTest(k.depthTest),s.setMask(k.depthWrite),r.setMask(k.colorWrite);const ee=k.stencilWrite;a.setTest(ee),ee&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Le(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?xe(i.SAMPLE_ALPHA_TO_COVERAGE):ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(k){S!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),S=k)}function Me(k){k!==0?(xe(i.CULL_FACE),k!==M&&(k===1?i.cullFace(i.BACK):k===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ve(i.CULL_FACE),M=k}function it(k){k!==P&&(j&&i.lineWidth(k),P=k)}function Le(k,oe,te){k?(xe(i.POLYGON_OFFSET_FILL),(X!==oe||B!==te)&&(i.polygonOffset(oe,te),X=oe,B=te)):ve(i.POLYGON_OFFSET_FILL)}function R(k){k?xe(i.SCISSOR_TEST):ve(i.SCISSOR_TEST)}function T(k){k===void 0&&(k=i.TEXTURE0+V-1),q!==k&&(i.activeTexture(k),q=k)}function _(k,oe,te){te===void 0&&(q===null?te=i.TEXTURE0+V-1:te=q);let ee=ce[te];ee===void 0&&(ee={type:void 0,texture:void 0},ce[te]=ee),(ee.type!==k||ee.texture!==oe)&&(q!==te&&(i.activeTexture(te),q=te),i.bindTexture(k,oe||ie[k]),ee.type=k,ee.texture=oe)}function U(){const k=ce[q];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ae(){try{i.texSubImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ne(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ue(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function De(){try{i.texStorage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function re(){try{i.texStorage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function de(){try{i.texImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ze(){try{i.texImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ee(k){Ce.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),Ce.copy(k))}function ye(k){$e.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),$e.copy(k))}function ke(k,oe){let te=l.get(oe);te===void 0&&(te=new WeakMap,l.set(oe,te));let ee=te.get(k);ee===void 0&&(ee=i.getUniformBlockIndex(oe,k.name),te.set(k,ee))}function Be(k,oe){const ee=l.get(oe).get(k);o.get(oe)!==ee&&(i.uniformBlockBinding(oe,ee,k.__bindingPointIndex),o.set(oe,ee))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},q=null,ce={},u={},h=new WeakMap,d=[],f=null,g=!1,v=null,p=null,m=null,b=null,x=null,E=null,I=null,A=new Ue(0,0,0),C=0,N=!1,S=null,M=null,P=null,X=null,B=null,Ce.set(0,0,i.canvas.width,i.canvas.height),$e.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:xe,disable:ve,bindFramebuffer:Ne,drawBuffers:Oe,useProgram:Ge,setBlending:dt,setMaterial:qe,setFlipSided:et,setCullFace:Me,setLineWidth:it,setPolygonOffset:Le,setScissorTest:R,activeTexture:T,bindTexture:_,unbindTexture:U,compressedTexImage2D:$,compressedTexImage3D:Z,texImage2D:de,texImage3D:ze,updateUBOMapping:ke,uniformBlockBinding:Be,texStorage2D:De,texStorage3D:re,texSubImage2D:K,texSubImage3D:ae,compressedTexSubImage2D:ne,compressedTexSubImage3D:ue,scissor:Ee,viewport:ye,reset:je}}function Al(i,e,t,n){const r=dm(n);switch(t){case 1021:return i*e;case 1024:return i*e;case 1025:return i*e*2;case 1028:return i*e/r.components*r.byteLength;case 1029:return i*e/r.components*r.byteLength;case 1030:return i*e*2/r.components*r.byteLength;case 1031:return i*e*2/r.components*r.byteLength;case 1022:return i*e*3/r.components*r.byteLength;case 1023:return i*e*4/r.components*r.byteLength;case 1033:return i*e*4/r.components*r.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dm(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function hm(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new he,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(T){}function g(T,_){return f?new OffscreenCanvas(T,_):ji("canvas")}function v(T,_,U){let $=1;const Z=R(T);if((Z.width>U||Z.height>U)&&($=U/Math.max(Z.width,Z.height)),$<1)if(typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&T instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&T instanceof ImageBitmap||typeof VideoFrame!="undefined"&&T instanceof VideoFrame){const K=Math.floor($*Z.width),ae=Math.floor($*Z.height);h===void 0&&(h=g(K,ae));const ne=_?g(K,ae):h;return ne.width=K,ne.height=ae,ne.getContext("2d").drawImage(T,0,0,K,ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+K+"x"+ae+")."),ne}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),T;return T}function p(T){return T.generateMipmaps&&T.minFilter!==1003&&T.minFilter!==1006}function m(T){i.generateMipmap(T)}function b(T,_,U,$,Z=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let K=_;if(_===i.RED&&(U===i.FLOAT&&(K=i.R32F),U===i.HALF_FLOAT&&(K=i.R16F),U===i.UNSIGNED_BYTE&&(K=i.R8)),_===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(K=i.R8UI),U===i.UNSIGNED_SHORT&&(K=i.R16UI),U===i.UNSIGNED_INT&&(K=i.R32UI),U===i.BYTE&&(K=i.R8I),U===i.SHORT&&(K=i.R16I),U===i.INT&&(K=i.R32I)),_===i.RG&&(U===i.FLOAT&&(K=i.RG32F),U===i.HALF_FLOAT&&(K=i.RG16F),U===i.UNSIGNED_BYTE&&(K=i.RG8)),_===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(K=i.RG8UI),U===i.UNSIGNED_SHORT&&(K=i.RG16UI),U===i.UNSIGNED_INT&&(K=i.RG32UI),U===i.BYTE&&(K=i.RG8I),U===i.SHORT&&(K=i.RG16I),U===i.INT&&(K=i.RG32I)),_===i.RGB&&U===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),_===i.RGBA){const ae=Z?Pr:nt.getTransfer($);U===i.FLOAT&&(K=i.RGBA32F),U===i.HALF_FLOAT&&(K=i.RGBA16F),U===i.UNSIGNED_BYTE&&(K=ae===ct?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function x(T,_){let U;return T?_===null||_===1014||_===1020?U=i.DEPTH24_STENCIL8:_===1015?U=i.DEPTH32F_STENCIL8:_===1012&&(U=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===1014||_===1020?U=i.DEPTH_COMPONENT24:_===1015?U=i.DEPTH_COMPONENT32F:_===1012&&(U=i.DEPTH_COMPONENT16),U}function E(T,_){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==1003&&T.minFilter!==1006?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function I(T){const _=T.target;_.removeEventListener("dispose",I),C(_),_.isVideoTexture&&u.delete(_)}function A(T){const _=T.target;_.removeEventListener("dispose",A),S(_)}function C(T){const _=n.get(T);if(_.__webglInit===void 0)return;const U=T.source,$=d.get(U);if($){const Z=$[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&N(T),Object.keys($).length===0&&d.delete(U)}n.remove(T)}function N(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const U=T.source,$=d.get(U);delete $[_.__cacheKey],a.memory.textures--}function S(T){const _=n.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(_.__webglFramebuffer[$]))for(let Z=0;Z<_.__webglFramebuffer[$].length;Z++)i.deleteFramebuffer(_.__webglFramebuffer[$][Z]);else i.deleteFramebuffer(_.__webglFramebuffer[$]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[$])}else{if(Array.isArray(_.__webglFramebuffer))for(let $=0;$<_.__webglFramebuffer.length;$++)i.deleteFramebuffer(_.__webglFramebuffer[$]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let $=0;$<_.__webglColorRenderbuffer.length;$++)_.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[$]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const U=T.textures;for(let $=0,Z=U.length;$<Z;$++){const K=n.get(U[$]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(U[$])}n.remove(T)}let M=0;function P(){M=0}function X(){const T=M;return T>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),M+=1,T}function B(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function V(T,_){const U=n.get(T);if(T.isVideoTexture&&it(T),T.isRenderTargetTexture===!1&&T.version>0&&U.__version!==T.version){const $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$e(U,T,_);return}}t.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+_)}function j(T,_){const U=n.get(T);if(T.version>0&&U.__version!==T.version){$e(U,T,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+_)}function D(T,_){const U=n.get(T);if(T.version>0&&U.__version!==T.version){$e(U,T,_);return}t.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+_)}function J(T,_){const U=n.get(T);if(T.version>0&&U.__version!==T.version){Q(U,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+_)}const q={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},ce={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},fe={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function me(T,_){if(_.type===1015&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===1006||_.magFilter===1007||_.magFilter===1005||_.magFilter===1008||_.minFilter===1006||_.minFilter===1007||_.minFilter===1005||_.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,q[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,q[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,q[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ce[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ce[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,fe[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===1003||_.minFilter!==1005&&_.minFilter!==1008||_.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Ce(T,_){let U=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",I));const $=_.source;let Z=d.get($);Z===void 0&&(Z={},d.set($,Z));const K=B(_);if(K!==T.__cacheKey){Z[K]===void 0&&(Z[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,U=!0),Z[K].usedTimes++;const ae=Z[T.__cacheKey];ae!==void 0&&(Z[T.__cacheKey].usedTimes--,ae.usedTimes===0&&N(_)),T.__cacheKey=K,T.__webglTexture=Z[K].texture}return U}function $e(T,_,U){let $=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&($=i.TEXTURE_3D);const Z=Ce(T,_),K=_.source;t.bindTexture($,T.__webglTexture,i.TEXTURE0+U);const ae=n.get(K);if(K.version!==ae.__version||Z===!0){t.activeTexture(i.TEXTURE0+U);const ne=nt.getPrimaries(nt.workingColorSpace),ue=_.colorSpace===wn?null:nt.getPrimaries(_.colorSpace),De=_.colorSpace===wn||ne===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let re=v(_.image,!1,r.maxTextureSize);re=Le(_,re);const de=s.convert(_.format,_.colorSpace),ze=s.convert(_.type);let Ee=b(_.internalFormat,de,ze,_.colorSpace,_.isVideoTexture);me($,_);let ye;const ke=_.mipmaps,Be=_.isVideoTexture!==!0,je=ae.__version===void 0||Z===!0,k=K.dataReady,oe=E(_,re);if(_.isDepthTexture)Ee=x(_.format===1027,_.type),je&&(Be?t.texStorage2D(i.TEXTURE_2D,1,Ee,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,Ee,re.width,re.height,0,de,ze,null));else if(_.isDataTexture)if(ke.length>0){Be&&je&&t.texStorage2D(i.TEXTURE_2D,oe,Ee,ke[0].width,ke[0].height);for(let te=0,ee=ke.length;te<ee;te++)ye=ke[te],Be?k&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ye.width,ye.height,de,ze,ye.data):t.texImage2D(i.TEXTURE_2D,te,Ee,ye.width,ye.height,0,de,ze,ye.data);_.generateMipmaps=!1}else Be?(je&&t.texStorage2D(i.TEXTURE_2D,oe,Ee,re.width,re.height),k&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re.width,re.height,de,ze,re.data)):t.texImage2D(i.TEXTURE_2D,0,Ee,re.width,re.height,0,de,ze,re.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Be&&je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,Ee,ke[0].width,ke[0].height,re.depth);for(let te=0,ee=ke.length;te<ee;te++)if(ye=ke[te],_.format!==1023)if(de!==null)if(Be){if(k)if(_.layerUpdates.size>0){const se=Al(ye.width,ye.height,_.format,_.type);for(const Re of _.layerUpdates){const Ve=ye.data.subarray(Re*se/ye.data.BYTES_PER_ELEMENT,(Re+1)*se/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,Re,ye.width,ye.height,1,de,Ve,0,0)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ye.width,ye.height,re.depth,de,ye.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,Ee,ye.width,ye.height,re.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?k&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ye.width,ye.height,re.depth,de,ze,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,Ee,ye.width,ye.height,re.depth,0,de,ze,ye.data)}else{Be&&je&&t.texStorage2D(i.TEXTURE_2D,oe,Ee,ke[0].width,ke[0].height);for(let te=0,ee=ke.length;te<ee;te++)ye=ke[te],_.format!==1023?de!==null?Be?k&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,ye.width,ye.height,de,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,te,Ee,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?k&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ye.width,ye.height,de,ze,ye.data):t.texImage2D(i.TEXTURE_2D,te,Ee,ye.width,ye.height,0,de,ze,ye.data)}else if(_.isDataArrayTexture)if(Be){if(je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,Ee,re.width,re.height,re.depth),k)if(_.layerUpdates.size>0){const te=Al(re.width,re.height,_.format,_.type);for(const ee of _.layerUpdates){const se=re.data.subarray(ee*te/re.data.BYTES_PER_ELEMENT,(ee+1)*te/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ee,re.width,re.height,1,de,ze,se)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,de,ze,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,re.width,re.height,re.depth,0,de,ze,re.data);else if(_.isData3DTexture)Be?(je&&t.texStorage3D(i.TEXTURE_3D,oe,Ee,re.width,re.height,re.depth),k&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,de,ze,re.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,re.width,re.height,re.depth,0,de,ze,re.data);else if(_.isFramebufferTexture){if(je)if(Be)t.texStorage2D(i.TEXTURE_2D,oe,Ee,re.width,re.height);else{let te=re.width,ee=re.height;for(let se=0;se<oe;se++)t.texImage2D(i.TEXTURE_2D,se,Ee,te,ee,0,de,ze,null),te>>=1,ee>>=1}}else if(ke.length>0){if(Be&&je){const te=R(ke[0]);t.texStorage2D(i.TEXTURE_2D,oe,Ee,te.width,te.height)}for(let te=0,ee=ke.length;te<ee;te++)ye=ke[te],Be?k&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,de,ze,ye):t.texImage2D(i.TEXTURE_2D,te,Ee,de,ze,ye);_.generateMipmaps=!1}else if(Be){if(je){const te=R(re);t.texStorage2D(i.TEXTURE_2D,oe,Ee,te.width,te.height)}k&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,de,ze,re)}else t.texImage2D(i.TEXTURE_2D,0,Ee,de,ze,re);p(_)&&m($),ae.__version=K.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Q(T,_,U){if(_.image.length!==6)return;const $=Ce(T,_),Z=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+U);const K=n.get(Z);if(Z.version!==K.__version||$===!0){t.activeTexture(i.TEXTURE0+U);const ae=nt.getPrimaries(nt.workingColorSpace),ne=_.colorSpace===wn?null:nt.getPrimaries(_.colorSpace),ue=_.colorSpace===wn||ae===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);const De=_.isCompressedTexture||_.image[0].isCompressedTexture,re=_.image[0]&&_.image[0].isDataTexture,de=[];for(let ee=0;ee<6;ee++)!De&&!re?de[ee]=v(_.image[ee],!0,r.maxCubemapSize):de[ee]=re?_.image[ee].image:_.image[ee],de[ee]=Le(_,de[ee]);const ze=de[0],Ee=s.convert(_.format,_.colorSpace),ye=s.convert(_.type),ke=b(_.internalFormat,Ee,ye,_.colorSpace),Be=_.isVideoTexture!==!0,je=K.__version===void 0||$===!0,k=Z.dataReady;let oe=E(_,ze);me(i.TEXTURE_CUBE_MAP,_);let te;if(De){Be&&je&&t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,ke,ze.width,ze.height);for(let ee=0;ee<6;ee++){te=de[ee].mipmaps;for(let se=0;se<te.length;se++){const Re=te[se];_.format!==1023?Ee!==null?Be?k&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se,0,0,Re.width,Re.height,Ee,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se,ke,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se,0,0,Re.width,Re.height,Ee,ye,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se,ke,Re.width,Re.height,0,Ee,ye,Re.data)}}}else{if(te=_.mipmaps,Be&&je){te.length>0&&oe++;const ee=R(de[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,ke,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(re){Be?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,de[ee].width,de[ee].height,Ee,ye,de[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,ke,de[ee].width,de[ee].height,0,Ee,ye,de[ee].data);for(let se=0;se<te.length;se++){const Ve=te[se].image[ee].image;Be?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se+1,0,0,Ve.width,Ve.height,Ee,ye,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se+1,ke,Ve.width,Ve.height,0,Ee,ye,Ve.data)}}else{Be?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ee,ye,de[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,ke,Ee,ye,de[ee]);for(let se=0;se<te.length;se++){const Re=te[se];Be?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se+1,0,0,Ee,ye,Re.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se+1,ke,Ee,ye,Re.image[ee])}}}p(_)&&m(i.TEXTURE_CUBE_MAP),K.__version=Z.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function ie(T,_,U,$,Z,K){const ae=s.convert(U.format,U.colorSpace),ne=s.convert(U.type),ue=b(U.internalFormat,ae,ne,U.colorSpace);if(!n.get(_).__hasExternalTextures){const re=Math.max(1,_.width>>K),de=Math.max(1,_.height>>K);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,K,ue,re,de,_.depth,0,ae,ne,null):t.texImage2D(Z,K,ue,re,de,0,ae,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),Me(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,n.get(U).__webglTexture,0,et(_)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,n.get(U).__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function xe(T,_,U){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const $=_.depthTexture,Z=$&&$.isDepthTexture?$.type:null,K=x(_.stencilBuffer,Z),ae=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=et(_);Me(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,K,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,K,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,K,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ae,i.RENDERBUFFER,T)}else{const $=_.textures;for(let Z=0;Z<$.length;Z++){const K=$[Z],ae=s.convert(K.format,K.colorSpace),ne=s.convert(K.type),ue=b(K.internalFormat,ae,ne,K.colorSpace),De=et(_);U&&Me(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,De,ue,_.width,_.height):Me(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,De,ue,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ue,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ve(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),V(_.depthTexture,0);const $=n.get(_.depthTexture).__webglTexture,Z=et(_);if(_.depthTexture.format===1026)Me(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(_.depthTexture.format===1027)Me(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Ne(T){const _=n.get(T),U=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");ve(_.__webglFramebuffer,T)}else if(U){_.__webglDepthbuffer=[];for(let $=0;$<6;$++)t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[$]),_.__webglDepthbuffer[$]=i.createRenderbuffer(),xe(_.__webglDepthbuffer[$],T,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer=i.createRenderbuffer(),xe(_.__webglDepthbuffer,T,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(T,_,U){const $=n.get(T);_!==void 0&&ie($.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&Ne(T)}function Ge(T){const _=T.texture,U=n.get(T),$=n.get(_);T.addEventListener("dispose",A);const Z=T.textures,K=T.isWebGLCubeRenderTarget===!0,ae=Z.length>1;if(ae||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=_.version,a.memory.textures++),K){U.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[ne]=[];for(let ue=0;ue<_.mipmaps.length;ue++)U.__webglFramebuffer[ne][ue]=i.createFramebuffer()}else U.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let ne=0;ne<_.mipmaps.length;ne++)U.__webglFramebuffer[ne]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(ae)for(let ne=0,ue=Z.length;ne<ue;ne++){const De=n.get(Z[ne]);De.__webglTexture===void 0&&(De.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&Me(T)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let ne=0;ne<Z.length;ne++){const ue=Z[ne];U.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[ne]);const De=s.convert(ue.format,ue.colorSpace),re=s.convert(ue.type),de=b(ue.internalFormat,De,re,ue.colorSpace,T.isXRRenderTarget===!0),ze=et(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,ze,de,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,U.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),xe(U.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),me(i.TEXTURE_CUBE_MAP,_);for(let ne=0;ne<6;ne++)if(_.mipmaps&&_.mipmaps.length>0)for(let ue=0;ue<_.mipmaps.length;ue++)ie(U.__webglFramebuffer[ne][ue],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ue);else ie(U.__webglFramebuffer[ne],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);p(_)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ae){for(let ne=0,ue=Z.length;ne<ue;ne++){const De=Z[ne],re=n.get(De);t.bindTexture(i.TEXTURE_2D,re.__webglTexture),me(i.TEXTURE_2D,De),ie(U.__webglFramebuffer,T,De,i.COLOR_ATTACHMENT0+ne,i.TEXTURE_2D,0),p(De)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ne=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,$.__webglTexture),me(ne,_),_.mipmaps&&_.mipmaps.length>0)for(let ue=0;ue<_.mipmaps.length;ue++)ie(U.__webglFramebuffer[ue],T,_,i.COLOR_ATTACHMENT0,ne,ue);else ie(U.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,ne,0);p(_)&&m(ne),t.unbindTexture()}T.depthBuffer&&Ne(T)}function st(T){const _=T.textures;for(let U=0,$=_.length;U<$;U++){const Z=_[U];if(p(Z)){const K=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ae=n.get(Z).__webglTexture;t.bindTexture(K,ae),m(K),t.unbindTexture()}}}const L=[],dt=[];function qe(T){if(T.samples>0){if(Me(T)===!1){const _=T.textures,U=T.width,$=T.height;let Z=i.COLOR_BUFFER_BIT;const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=n.get(T),ne=_.length>1;if(ne)for(let ue=0;ue<_.length;ue++)t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let ue=0;ue<_.length;ue++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ae.__webglColorRenderbuffer[ue]);const De=n.get(_[ue]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,De,0)}i.blitFramebuffer(0,0,U,$,0,0,U,$,Z,i.NEAREST),l===!0&&(L.length=0,dt.length=0,L.push(i.COLOR_ATTACHMENT0+ue),T.depthBuffer&&T.resolveDepthBuffer===!1&&(L.push(K),dt.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,dt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,L))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let ue=0;ue<_.length;ue++){t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,ae.__webglColorRenderbuffer[ue]);const De=n.get(_[ue]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,De,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function et(T){return Math.min(r.maxSamples,T.samples)}function Me(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function it(T){const _=a.render.frame;u.get(T)!==_&&(u.set(T,_),T.update())}function Le(T,_){const U=T.colorSpace,$=T.format,Z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||U!==an&&U!==wn&&(nt.getTransfer(U)===ct?($!==1023||Z!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),_}function R(T){return typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame!="undefined"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=P,this.setTexture2D=V,this.setTexture2DArray=j,this.setTexture3D=D,this.setTextureCube=J,this.rebindTextures=Oe,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=Me}function fm(i,e){function t(n,r=wn){let s;const a=nt.getTransfer(r);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1024)return i.LUMINANCE;if(n===1025)return i.LUMINANCE_ALPHA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===ct)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===ct?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===ct?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36492)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class pm extends Ut{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Wn extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mm={type:"move"};class ba{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mm)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const gm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vm=`
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

}`;class _m{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new Et,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ft({vertexShader:gm,fragmentShader:vm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new zn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xm extends ii{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null;const v=new _m,p=t.getContextAttributes();let m=null,b=null;const x=[],E=[],I=new he;let A=null;const C=new Ut;C.layers.enable(1),C.viewport=new ht;const N=new Ut;N.layers.enable(2),N.viewport=new ht;const S=[C,N],M=new pm;M.layers.enable(1),M.layers.enable(2);let P=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ie=x[Q];return ie===void 0&&(ie=new ba,x[Q]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(Q){let ie=x[Q];return ie===void 0&&(ie=new ba,x[Q]=ie),ie.getGripSpace()},this.getHand=function(Q){let ie=x[Q];return ie===void 0&&(ie=new ba,x[Q]=ie),ie.getHandSpace()};function B(Q){const ie=E.indexOf(Q.inputSource);if(ie===-1)return;const xe=x[ie];xe!==void 0&&(xe.update(Q.inputSource,Q.frame,c||a),xe.dispatchEvent({type:Q.type,data:Q.inputSource}))}function V(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",j);for(let Q=0;Q<x.length;Q++){const ie=E[Q];ie!==null&&(E[Q]=null,x[Q].disconnect(ie))}P=null,X=null,v.reset(),e.setRenderTarget(m),f=null,d=null,h=null,r=null,b=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(m=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",V),r.addEventListener("inputsourceschange",j),p.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(I),r.renderState.layers===void 0){const ie={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,ie),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new $t(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let ie=null,xe=null,ve=null;p.depth&&(ve=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=p.stencil?1027:1026,xe=p.stencil?1020:1014);const Ne={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:s};h=new XRWebGLBinding(r,t),d=h.createProjectionLayer(Ne),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new $t(d.textureWidth,d.textureHeight,{format:1023,type:1009,depthTexture:new al(d.textureWidth,d.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),$e.setContext(r),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function j(Q){for(let ie=0;ie<Q.removed.length;ie++){const xe=Q.removed[ie],ve=E.indexOf(xe);ve>=0&&(E[ve]=null,x[ve].disconnect(xe))}for(let ie=0;ie<Q.added.length;ie++){const xe=Q.added[ie];let ve=E.indexOf(xe);if(ve===-1){for(let Oe=0;Oe<x.length;Oe++)if(Oe>=E.length){E.push(xe),ve=Oe;break}else if(E[Oe]===null){E[Oe]=xe,ve=Oe;break}if(ve===-1)break}const Ne=x[ve];Ne&&Ne.connect(xe)}}const D=new F,J=new F;function q(Q,ie,xe){D.setFromMatrixPosition(ie.matrixWorld),J.setFromMatrixPosition(xe.matrixWorld);const ve=D.distanceTo(J),Ne=ie.projectionMatrix.elements,Oe=xe.projectionMatrix.elements,Ge=Ne[14]/(Ne[10]-1),st=Ne[14]/(Ne[10]+1),L=(Ne[9]+1)/Ne[5],dt=(Ne[9]-1)/Ne[5],qe=(Ne[8]-1)/Ne[0],et=(Oe[8]+1)/Oe[0],Me=Ge*qe,it=Ge*et,Le=ve/(-qe+et),R=Le*-qe;ie.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(R),Q.translateZ(Le),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert();const T=Ge+Le,_=st+Le,U=Me-R,$=it+(ve-R),Z=L*st/_*T,K=dt*st/_*T;Q.projectionMatrix.makePerspective(U,$,Z,K,T,_),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}function ce(Q,ie){ie===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ie.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;v.texture!==null&&(Q.near=v.depthNear,Q.far=v.depthFar),M.near=N.near=C.near=Q.near,M.far=N.far=C.far=Q.far,(P!==M.near||X!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,X=M.far,C.near=P,C.far=X,N.near=P,N.far=X,C.updateProjectionMatrix(),N.updateProjectionMatrix(),Q.updateProjectionMatrix());const ie=Q.parent,xe=M.cameras;ce(M,ie);for(let ve=0;ve<xe.length;ve++)ce(xe[ve],ie);xe.length===2?q(M,C,N):M.projectionMatrix.copy(C.projectionMatrix),fe(Q,M,ie)};function fe(Q,ie,xe){xe===null?Q.matrix.copy(ie.matrixWorld):(Q.matrix.copy(xe.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ie.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ie.projectionMatrix),Q.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ri*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let me=null;function Ce(Q,ie){if(u=ie.getViewerPose(c||a),g=ie,u!==null){const xe=u.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let ve=!1;xe.length!==M.cameras.length&&(M.cameras.length=0,ve=!0);for(let Oe=0;Oe<xe.length;Oe++){const Ge=xe[Oe];let st=null;if(f!==null)st=f.getViewport(Ge);else{const dt=h.getViewSubImage(d,Ge);st=dt.viewport,Oe===0&&(e.setRenderTargetTextures(b,dt.colorTexture,d.ignoreDepthValues?void 0:dt.depthStencilTexture),e.setRenderTarget(b))}let L=S[Oe];L===void 0&&(L=new Ut,L.layers.enable(Oe),L.viewport=new ht,S[Oe]=L),L.matrix.fromArray(Ge.transform.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale),L.projectionMatrix.fromArray(Ge.projectionMatrix),L.projectionMatrixInverse.copy(L.projectionMatrix).invert(),L.viewport.set(st.x,st.y,st.width,st.height),Oe===0&&(M.matrix.copy(L.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ve===!0&&M.cameras.push(L)}const Ne=r.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")){const Oe=h.getDepthInformation(xe[0]);Oe&&Oe.isValid&&Oe.texture&&v.init(e,Oe,r.renderState)}}for(let xe=0;xe<x.length;xe++){const ve=E[xe],Ne=x[xe];ve!==null&&Ne!==void 0&&Ne.update(ve,ie,c||a)}me&&me(Q,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),g=null}const $e=new Jo;$e.setAnimationLoop(Ce),this.setAnimationLoop=function(Q){me=Q},this.dispose=function(){}}}const Xn=new on,ym=new ft;function bm(i,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,qo(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function r(p,m,b,x,E){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(p,m):m.isMeshToonMaterial?(s(p,m),h(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m)):m.isMeshStandardMaterial?(s(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,E)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),v(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,b,x):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===1&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===1&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const b=e.get(m),x=b.envMap,E=b.envMapRotation;x&&(p.envMap.value=x,Xn.copy(E),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),p.envMapRotation.value.setFromMatrix4(ym.makeRotationFromEuler(Xn)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,b,x){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*b,p.scale.value=x*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,b){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===1&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const b=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Sm(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,x){const E=x.program;n.uniformBlockBinding(b,E)}function c(b,x){let E=r[b.id];E===void 0&&(g(b),E=u(b),r[b.id]=E,b.addEventListener("dispose",p));const I=x.program;n.updateUBOMapping(b,I);const A=e.render.frame;s[b.id]!==A&&(d(b),s[b.id]=A)}function u(b){const x=h();b.__bindingPointIndex=x;const E=i.createBuffer(),I=b.__size,A=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,I,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,E),E}function h(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const x=r[b.id],E=b.uniforms,I=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let A=0,C=E.length;A<C;A++){const N=Array.isArray(E[A])?E[A]:[E[A]];for(let S=0,M=N.length;S<M;S++){const P=N[S];if(f(P,A,S,I)===!0){const X=P.__offset,B=Array.isArray(P.value)?P.value:[P.value];let V=0;for(let j=0;j<B.length;j++){const D=B[j],J=v(D);typeof D=="number"||typeof D=="boolean"?(P.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,X+V,P.__data)):D.isMatrix3?(P.__data[0]=D.elements[0],P.__data[1]=D.elements[1],P.__data[2]=D.elements[2],P.__data[3]=0,P.__data[4]=D.elements[3],P.__data[5]=D.elements[4],P.__data[6]=D.elements[5],P.__data[7]=0,P.__data[8]=D.elements[6],P.__data[9]=D.elements[7],P.__data[10]=D.elements[8],P.__data[11]=0):(D.toArray(P.__data,V),V+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,X,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,x,E,I){const A=b.value,C=x+"_"+E;if(I[C]===void 0)return typeof A=="number"||typeof A=="boolean"?I[C]=A:I[C]=A.clone(),!0;{const N=I[C];if(typeof A=="number"||typeof A=="boolean"){if(N!==A)return I[C]=A,!0}else if(N.equals(A)===!1)return N.copy(A),!0}return!1}function g(b){const x=b.uniforms;let E=0;const I=16;for(let C=0,N=x.length;C<N;C++){const S=Array.isArray(x[C])?x[C]:[x[C]];for(let M=0,P=S.length;M<P;M++){const X=S[M],B=Array.isArray(X.value)?X.value:[X.value];for(let V=0,j=B.length;V<j;V++){const D=B[V],J=v(D),q=E%I;q!==0&&I-q<J.boundary&&(E+=I-q),X.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=E,E+=J.storage}}}const A=E%I;return A>0&&(E+=I-A),b.__size=E,b.__cache={},this}function v(b){const x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function p(b){const x=b.target;x.removeEventListener("dispose",p);const E=a.indexOf(x.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function m(){for(const b in r)i.deleteBuffer(r[b]);a=[],r={},s={}}return{bind:l,update:c,dispose:m}}class Cl{constructor(e={}){const{canvas:t=Yu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const m=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ct,this.toneMapping=0,this.toneMappingExposure=1;const x=this;let E=!1,I=0,A=0,C=null,N=-1,S=null;const M=new ht,P=new ht;let X=null;const B=new Ue(0);let V=0,j=t.width,D=t.height,J=1,q=null,ce=null;const fe=new ht(0,0,j,D),me=new ht(0,0,j,D);let Ce=!1;const $e=new ua;let Q=!1,ie=!1;const xe=new ft,ve=new F,Ne=new ht,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function st(){return C===null?J:1}let L=n;function dt(w,O){return t.getContext(w,O)}try{const w={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${mn}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",ee,!1),t.addEventListener("webglcontextcreationerror",se,!1),L===null){const O="webgl2";if(L=dt(O,w),L===null)throw dt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let qe,et,Me,it,Le,R,T,_,U,$,Z,K,ae,ne,ue,De,re,de,ze,Ee,ye,ke,Be,je;function k(){qe=new Pf(L),qe.init(),ke=new fm(L,qe),et=new wf(L,qe,e,ke),Me=new um(L),it=new Df(L),Le=new Kp,R=new hm(L,qe,Me,Le,et,ke,it),T=new Tf(x),_=new Rf(x),U=new xd(L),Be=new Sf(L,U),$=new If(L,U,it,Be),Z=new Ff(L,$,U,it),ze=new Nf(L,et,R),De=new Ef(Le),K=new Zp(x,T,_,qe,et,Be,De),ae=new bm(x,Le),ne=new Qp,ue=new rm(qe),de=new bf(x,T,_,Me,Z,d,l),re=new cm(x,Z,et),je=new Sm(L,it,et,Me),Ee=new Mf(L,qe,it),ye=new Lf(L,qe,it),it.programs=K.programs,x.capabilities=et,x.extensions=qe,x.properties=Le,x.renderLists=ne,x.shadowMap=re,x.state=Me,x.info=it}k();const oe=new xm(x,L);this.xr=oe,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const w=qe.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=qe.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(w){w!==void 0&&(J=w,this.setSize(j,D,!1))},this.getSize=function(w){return w.set(j,D)},this.setSize=function(w,O,W=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=w,D=O,t.width=Math.floor(w*J),t.height=Math.floor(O*J),W===!0&&(t.style.width=w+"px",t.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(j*J,D*J).floor()},this.setDrawingBufferSize=function(w,O,W){j=w,D=O,J=W,t.width=Math.floor(w*W),t.height=Math.floor(O*W),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(M)},this.getViewport=function(w){return w.copy(fe)},this.setViewport=function(w,O,W,Y){w.isVector4?fe.set(w.x,w.y,w.z,w.w):fe.set(w,O,W,Y),Me.viewport(M.copy(fe).multiplyScalar(J).round())},this.getScissor=function(w){return w.copy(me)},this.setScissor=function(w,O,W,Y){w.isVector4?me.set(w.x,w.y,w.z,w.w):me.set(w,O,W,Y),Me.scissor(P.copy(me).multiplyScalar(J).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(w){Me.setScissorTest(Ce=w)},this.setOpaqueSort=function(w){q=w},this.setTransparentSort=function(w){ce=w},this.getClearColor=function(w){return w.copy(de.getClearColor())},this.setClearColor=function(){de.setClearColor.apply(de,arguments)},this.getClearAlpha=function(){return de.getClearAlpha()},this.setClearAlpha=function(){de.setClearAlpha.apply(de,arguments)},this.clear=function(w=!0,O=!0,W=!0){let Y=0;if(w){let H=!1;if(C!==null){const le=C.texture.format;H=le===1033||le===1031||le===1029}if(H){const le=C.texture.type,ge=le===1009||le===1014||le===1012||le===1020||le===1017||le===1018,be=de.getClearColor(),Se=de.getClearAlpha(),Fe=be.r,Ie=be.g,Pe=be.b;ge?(f[0]=Fe,f[1]=Ie,f[2]=Pe,f[3]=Se,L.clearBufferuiv(L.COLOR,0,f)):(g[0]=Fe,g[1]=Ie,g[2]=Pe,g[3]=Se,L.clearBufferiv(L.COLOR,0,g))}else Y|=L.COLOR_BUFFER_BIT}O&&(Y|=L.DEPTH_BUFFER_BIT),W&&(Y|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",ee,!1),t.removeEventListener("webglcontextcreationerror",se,!1),ne.dispose(),ue.dispose(),Le.dispose(),T.dispose(),_.dispose(),Z.dispose(),Be.dispose(),je.dispose(),K.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Kt),oe.removeEventListener("sessionend",Jn),jt.stop()};function te(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function ee(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const w=it.autoReset,O=re.enabled,W=re.autoUpdate,Y=re.needsUpdate,H=re.type;k(),it.autoReset=w,re.enabled=O,re.autoUpdate=W,re.needsUpdate=Y,re.type=H}function se(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Re(w){const O=w.target;O.removeEventListener("dispose",Re),Ve(O)}function Ve(w){at(w),Le.remove(w)}function at(w){const O=Le.get(w).programs;O!==void 0&&(O.forEach(function(W){K.releaseProgram(W)}),w.isShaderMaterial&&K.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,W,Y,H,le){O===null&&(O=Oe);const ge=H.isMesh&&H.matrixWorld.determinant()<0,be=ni(w,O,W,Y,H);Me.setMaterial(Y,ge);let Se=W.index,Fe=1;if(Y.wireframe===!0){if(Se=$.getWireframeAttribute(W),Se===void 0)return;Fe=2}const Ie=W.drawRange,Pe=W.attributes.position;let Je=Ie.start*Fe,ot=(Ie.start+Ie.count)*Fe;le!==null&&(Je=Math.max(Je,le.start*Fe),ot=Math.min(ot,(le.start+le.count)*Fe)),Se!==null?(Je=Math.max(Je,0),ot=Math.min(ot,Se.count)):Pe!=null&&(Je=Math.max(Je,0),ot=Math.min(ot,Pe.count));const lt=ot-Je;if(lt<0||lt===1/0)return;Be.setup(H,Y,be,W,Se);let It,Qe=Ee;if(Se!==null&&(It=U.get(Se),Qe=ye,Qe.setIndex(It)),H.isMesh)Y.wireframe===!0?(Me.setLineWidth(Y.wireframeLinewidth*st()),Qe.setMode(L.LINES)):Qe.setMode(L.TRIANGLES);else if(H.isLine){let Te=Y.linewidth;Te===void 0&&(Te=1),Me.setLineWidth(Te*st()),H.isLineSegments?Qe.setMode(L.LINES):H.isLineLoop?Qe.setMode(L.LINE_LOOP):Qe.setMode(L.LINE_STRIP)}else H.isPoints?Qe.setMode(L.POINTS):H.isSprite&&Qe.setMode(L.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)Qe.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(qe.get("WEBGL_multi_draw"))Qe.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Te=H._multiDrawStarts,_t=H._multiDrawCounts,Ye=H._multiDrawCount,Vt=Se?U.get(Se).bytesPerElement:1,Dn=Le.get(Y).currentProgram.getUniforms();for(let kt=0;kt<Ye;kt++)Dn.setValue(L,"_gl_DrawID",kt),Qe.render(Te[kt]/Vt,_t[kt])}else if(H.isInstancedMesh)Qe.renderInstances(Je,lt,H.count);else if(W.isInstancedBufferGeometry){const Te=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,_t=Math.min(W.instanceCount,Te);Qe.renderInstances(Je,lt,_t)}else Qe.render(Je,lt)};function vt(w,O,W){w.transparent===!0&&w.side===2&&w.forceSinglePass===!1?(w.side=1,w.needsUpdate=!0,pn(w,O,W),w.side=0,w.needsUpdate=!0,pn(w,O,W),w.side=2):pn(w,O,W)}this.compile=function(w,O,W=null){W===null&&(W=w),p=ue.get(W),p.init(O),b.push(p),W.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),w!==W&&w.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const Y=new Set;return w.traverse(function(H){const le=H.material;if(le)if(Array.isArray(le))for(let ge=0;ge<le.length;ge++){const be=le[ge];vt(be,W,H),Y.add(be)}else vt(le,W,H),Y.add(le)}),b.pop(),p=null,Y},this.compileAsync=function(w,O,W=null){const Y=this.compile(w,O,W);return new Promise(H=>{function le(){if(Y.forEach(function(ge){Le.get(ge).currentProgram.isReady()&&Y.delete(ge)}),Y.size===0){H(w);return}setTimeout(le,10)}qe.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let we=null;function Gt(w){we&&we(w)}function Kt(){jt.stop()}function Jn(){jt.start()}const jt=new Jo;jt.setAnimationLoop(Gt),typeof self!="undefined"&&jt.setContext(self),this.setAnimationLoop=function(w){we=w,oe.setAnimationLoop(w),w===null?jt.stop():jt.start()},oe.addEventListener("sessionstart",Kt),oe.addEventListener("sessionend",Jn),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(O),O=oe.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,O,C),p=ue.get(w,b.length),p.init(O),b.push(p),xe.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),$e.setFromProjectionMatrix(xe),ie=this.localClippingEnabled,Q=De.init(this.clippingPlanes,ie),v=ne.get(w,m.length),v.init(),m.push(v),oe.enabled===!0&&oe.isPresenting===!0){const le=x.xr.getDepthSensingMesh();le!==null&&ei(le,O,-1/0,x.sortObjects)}ei(w,O,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(q,ce),Ge=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,Ge&&de.addToRenderList(v,w),this.info.render.frame++,Q===!0&&De.beginShadows();const W=p.state.shadowsArray;re.render(W,w,O),Q===!0&&De.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=v.opaque,H=v.transmissive;if(p.setupLights(),O.isArrayCamera){const le=O.cameras;if(H.length>0)for(let ge=0,be=le.length;ge<be;ge++){const Se=le[ge];Wi(Y,H,w,Se)}Ge&&de.render(w);for(let ge=0,be=le.length;ge<be;ge++){const Se=le[ge];Hs(v,w,Se,Se.viewport)}}else H.length>0&&Wi(Y,H,w,O),Ge&&de.render(w),Hs(v,w,O);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(x,w,O),Be.resetDefaultState(),N=-1,S=null,b.pop(),b.length>0?(p=b[b.length-1],Q===!0&&De.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?v=m[m.length-1]:v=null};function ei(w,O,W,Y){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$e.intersectsSprite(w)){Y&&Ne.setFromMatrixPosition(w.matrixWorld).applyMatrix4(xe);const ge=Z.update(w),be=w.material;be.visible&&v.push(w,ge,be,W,Ne.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$e.intersectsObject(w))){const ge=Z.update(w),be=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ne.copy(w.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Ne.copy(ge.boundingSphere.center)),Ne.applyMatrix4(w.matrixWorld).applyMatrix4(xe)),Array.isArray(be)){const Se=ge.groups;for(let Fe=0,Ie=Se.length;Fe<Ie;Fe++){const Pe=Se[Fe],Je=be[Pe.materialIndex];Je&&Je.visible&&v.push(w,ge,Je,W,Ne.z,Pe)}}else be.visible&&v.push(w,ge,be,W,Ne.z,null)}}const le=w.children;for(let ge=0,be=le.length;ge<be;ge++)ei(le[ge],O,W,Y)}function Hs(w,O,W,Y){const H=w.opaque,le=w.transmissive,ge=w.transparent;p.setupLightsView(W),Q===!0&&De.setGlobalState(x.clippingPlanes,W),Y&&Me.viewport(M.copy(Y)),H.length>0&&ti(H,O,W),le.length>0&&ti(le,O,W),ge.length>0&&ti(ge,O,W),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function Wi(w,O,W,Y){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new $t(1,1,{generateMipmaps:!0,type:qe.has("EXT_color_buffer_half_float")||qe.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const le=p.state.transmissionRenderTarget[Y.id],ge=Y.viewport||M;le.setSize(ge.z,ge.w);const be=x.getRenderTarget();x.setRenderTarget(le),x.getClearColor(B),V=x.getClearAlpha(),V<1&&x.setClearColor(16777215,.5),Ge?de.render(W):x.clear();const Se=x.toneMapping;x.toneMapping=0;const Fe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),Q===!0&&De.setGlobalState(x.clippingPlanes,Y),ti(w,W,Y),R.updateMultisampleRenderTarget(le),R.updateRenderTargetMipmap(le),qe.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let Pe=0,Je=O.length;Pe<Je;Pe++){const ot=O[Pe],lt=ot.object,It=ot.geometry,Qe=ot.material,Te=ot.group;if(Qe.side===2&&lt.layers.test(Y.layers)){const _t=Qe.side;Qe.side=1,Qe.needsUpdate=!0,Tr(lt,W,Y,It,Qe,Te),Qe.side=_t,Qe.needsUpdate=!0,Ie=!0}}Ie===!0&&(R.updateMultisampleRenderTarget(le),R.updateRenderTargetMipmap(le))}x.setRenderTarget(be),x.setClearColor(B,V),Fe!==void 0&&(Y.viewport=Fe),x.toneMapping=Se}function ti(w,O,W){const Y=O.isScene===!0?O.overrideMaterial:null;for(let H=0,le=w.length;H<le;H++){const ge=w[H],be=ge.object,Se=ge.geometry,Fe=Y===null?ge.material:Y,Ie=ge.group;be.layers.test(W.layers)&&Tr(be,O,W,Se,Fe,Ie)}}function Tr(w,O,W,Y,H,le){w.onBeforeRender(x,O,W,Y,H,le),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),H.transparent===!0&&H.side===2&&H.forceSinglePass===!1?(H.side=1,H.needsUpdate=!0,x.renderBufferDirect(W,O,Y,H,w,le),H.side=0,H.needsUpdate=!0,x.renderBufferDirect(W,O,Y,H,w,le),H.side=2):x.renderBufferDirect(W,O,Y,H,w,le),w.onAfterRender(x,O,W,Y,H,le)}function pn(w,O,W){O.isScene!==!0&&(O=Oe);const Y=Le.get(w),H=p.state.lights,le=p.state.shadowsArray,ge=H.state.version,be=K.getParameters(w,H.state,le,O,W),Se=K.getProgramCacheKey(be);let Fe=Y.programs;Y.environment=w.isMeshStandardMaterial?O.environment:null,Y.fog=O.fog,Y.envMap=(w.isMeshStandardMaterial?_:T).get(w.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Fe===void 0&&(w.addEventListener("dispose",Re),Fe=new Map,Y.programs=Fe);let Ie=Fe.get(Se);if(Ie!==void 0){if(Y.currentProgram===Ie&&Y.lightsStateVersion===ge)return Xi(w,be),Ie}else be.uniforms=K.getUniforms(w),w.onBeforeCompile(be,x),Ie=K.acquireProgram(be,Se),Fe.set(Se,Ie),Y.uniforms=be.uniforms;const Pe=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Pe.clippingPlanes=De.uniform),Xi(w,be),Y.needsLights=rn(w),Y.lightsStateVersion=ge,Y.needsLights&&(Pe.ambientLightColor.value=H.state.ambient,Pe.lightProbe.value=H.state.probe,Pe.directionalLights.value=H.state.directional,Pe.directionalLightShadows.value=H.state.directionalShadow,Pe.spotLights.value=H.state.spot,Pe.spotLightShadows.value=H.state.spotShadow,Pe.rectAreaLights.value=H.state.rectArea,Pe.ltc_1.value=H.state.rectAreaLTC1,Pe.ltc_2.value=H.state.rectAreaLTC2,Pe.pointLights.value=H.state.point,Pe.pointLightShadows.value=H.state.pointShadow,Pe.hemisphereLights.value=H.state.hemi,Pe.directionalShadowMap.value=H.state.directionalShadowMap,Pe.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Pe.spotShadowMap.value=H.state.spotShadowMap,Pe.spotLightMatrix.value=H.state.spotLightMatrix,Pe.spotLightMap.value=H.state.spotLightMap,Pe.pointShadowMap.value=H.state.pointShadowMap,Pe.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=Ie,Y.uniformsList=null,Ie}function Ar(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=ts.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function Xi(w,O){const W=Le.get(w);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function ni(w,O,W,Y,H){O.isScene!==!0&&(O=Oe),R.resetTextureUnits();const le=O.fog,ge=Y.isMeshStandardMaterial?O.environment:null,be=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:an,Se=(Y.isMeshStandardMaterial?_:T).get(Y.envMap||ge),Fe=Y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ie=!!W.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Pe=!!W.morphAttributes.position,Je=!!W.morphAttributes.normal,ot=!!W.morphAttributes.color;let lt=0;Y.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(lt=x.toneMapping);const It=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qe=It!==void 0?It.length:0,Te=Le.get(Y),_t=p.state.lights;if(Q===!0&&(ie===!0||w!==S)){const Ot=w===S&&Y.id===N;De.setState(Y,w,Ot)}let Ye=!1;Y.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==_t.state.version||Te.outputColorSpace!==be||H.isBatchedMesh&&Te.batching===!1||!H.isBatchedMesh&&Te.batching===!0||H.isBatchedMesh&&Te.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Te.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Te.instancing===!1||!H.isInstancedMesh&&Te.instancing===!0||H.isSkinnedMesh&&Te.skinning===!1||!H.isSkinnedMesh&&Te.skinning===!0||H.isInstancedMesh&&Te.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Te.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Te.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Te.instancingMorph===!1&&H.morphTexture!==null||Te.envMap!==Se||Y.fog===!0&&Te.fog!==le||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==De.numPlanes||Te.numIntersection!==De.numIntersection)||Te.vertexAlphas!==Fe||Te.vertexTangents!==Ie||Te.morphTargets!==Pe||Te.morphNormals!==Je||Te.morphColors!==ot||Te.toneMapping!==lt||Te.morphTargetsCount!==Qe)&&(Ye=!0):(Ye=!0,Te.__version=Y.version);let Vt=Te.currentProgram;Ye===!0&&(Vt=pn(Y,O,H));let Dn=!1,kt=!1,sn=!1;const mt=Vt.getUniforms(),Wt=Te.uniforms;if(Me.useProgram(Vt.program)&&(Dn=!0,kt=!0,sn=!0),Y.id!==N&&(N=Y.id,kt=!0),Dn||S!==w){mt.setValue(L,"projectionMatrix",w.projectionMatrix),mt.setValue(L,"viewMatrix",w.matrixWorldInverse);const Ot=mt.map.cameraPosition;Ot!==void 0&&Ot.setValue(L,ve.setFromMatrixPosition(w.matrixWorld)),et.logarithmicDepthBuffer&&mt.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&mt.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,kt=!0,sn=!0)}if(H.isSkinnedMesh){mt.setOptional(L,H,"bindMatrix"),mt.setOptional(L,H,"bindMatrixInverse");const Ot=H.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),mt.setValue(L,"boneTexture",Ot.boneTexture,R))}H.isBatchedMesh&&(mt.setOptional(L,H,"batchingTexture"),mt.setValue(L,"batchingTexture",H._matricesTexture,R),mt.setOptional(L,H,"batchingIdTexture"),mt.setValue(L,"batchingIdTexture",H._indirectTexture,R),mt.setOptional(L,H,"batchingColorTexture"),H._colorsTexture!==null&&mt.setValue(L,"batchingColorTexture",H._colorsTexture,R));const $i=W.morphAttributes;if(($i.position!==void 0||$i.normal!==void 0||$i.color!==void 0)&&ze.update(H,W,Vt),(kt||Te.receiveShadow!==H.receiveShadow)&&(Te.receiveShadow=H.receiveShadow,mt.setValue(L,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Wt.envMap.value=Se,Wt.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&O.environment!==null&&(Wt.envMapIntensity.value=O.environmentIntensity),kt&&(mt.setValue(L,"toneMappingExposure",x.toneMappingExposure),Te.needsLights&&vo(Wt,sn),le&&Y.fog===!0&&ae.refreshFogUniforms(Wt,le),ae.refreshMaterialUniforms(Wt,Y,J,D,p.state.transmissionRenderTarget[w.id]),ts.upload(L,Ar(Te),Wt,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(ts.upload(L,Ar(Te),Wt,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&mt.setValue(L,"center",H.center),mt.setValue(L,"modelViewMatrix",H.modelViewMatrix),mt.setValue(L,"normalMatrix",H.normalMatrix),mt.setValue(L,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const Ot=Y.uniformsGroups;for(let Yi=0,Gs=Ot.length;Yi<Gs;Yi++){const Cr=Ot[Yi];je.update(Cr,Vt),je.bind(Cr,Vt)}}return Vt}function vo(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function rn(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,O,W){Le.get(w.texture).__webglTexture=O,Le.get(w.depthTexture).__webglTexture=W;const Y=Le.get(w);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=W===void 0,Y.__autoAllocateDepthBuffer||qe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,O){const W=Le.get(w);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,W=0){C=w,I=O,A=W;let Y=!0,H=null,le=!1,ge=!1;if(w){const Se=Le.get(w);Se.__useDefaultFramebuffer!==void 0?(Me.bindFramebuffer(L.FRAMEBUFFER,null),Y=!1):Se.__webglFramebuffer===void 0?R.setupRenderTarget(w):Se.__hasExternalTextures&&R.rebindTextures(w,Le.get(w.texture).__webglTexture,Le.get(w.depthTexture).__webglTexture);const Fe=w.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(ge=!0);const Ie=Le.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ie[O])?H=Ie[O][W]:H=Ie[O],le=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?H=Le.get(w).__webglMultisampledFramebuffer:Array.isArray(Ie)?H=Ie[W]:H=Ie,M.copy(w.viewport),P.copy(w.scissor),X=w.scissorTest}else M.copy(fe).multiplyScalar(J).floor(),P.copy(me).multiplyScalar(J).floor(),X=Ce;if(Me.bindFramebuffer(L.FRAMEBUFFER,H)&&Y&&Me.drawBuffers(w,H),Me.viewport(M),Me.scissor(P),Me.setScissorTest(X),le){const Se=Le.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+O,Se.__webglTexture,W)}else if(ge){const Se=Le.get(w.texture),Fe=O||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Se.__webglTexture,W||0,Fe)}N=-1},this.readRenderTargetPixels=function(w,O,W,Y,H,le,ge){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Le.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ge!==void 0&&(be=be[ge]),be){Me.bindFramebuffer(L.FRAMEBUFFER,be);try{const Se=w.texture,Fe=Se.format,Ie=Se.type;if(!et.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-Y&&W>=0&&W<=w.height-H&&L.readPixels(O,W,Y,H,ke.convert(Fe),ke.convert(Ie),le)}finally{const Se=C!==null?Le.get(C).__webglFramebuffer:null;Me.bindFramebuffer(L.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(w,O,W,Y,H,le,ge){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Le.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ge!==void 0&&(be=be[ge]),be){Me.bindFramebuffer(L.FRAMEBUFFER,be);try{const Se=w.texture,Fe=Se.format,Ie=Se.type;if(!et.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=w.width-Y&&W>=0&&W<=w.height-H){const Pe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Pe),L.bufferData(L.PIXEL_PACK_BUFFER,le.byteLength,L.STREAM_READ),L.readPixels(O,W,Y,H,ke.convert(Fe),ke.convert(Ie),0),L.flush();const Je=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);await qu(L,Je,4);try{L.bindBuffer(L.PIXEL_PACK_BUFFER,Pe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,le)}finally{L.deleteBuffer(Pe),L.deleteSync(Je)}return le}}finally{const Se=C!==null?Le.get(C).__webglFramebuffer:null;Me.bindFramebuffer(L.FRAMEBUFFER,Se)}}},this.copyFramebufferToTexture=function(w,O=null,W=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,w=arguments[1]);const Y=Math.pow(2,-W),H=Math.floor(w.image.width*Y),le=Math.floor(w.image.height*Y),ge=O!==null?O.x:0,be=O!==null?O.y:0;R.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,ge,be,H,le),Me.unbindTexture()},this.copyTextureToTexture=function(w,O,W=null,Y=null,H=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,w=arguments[1],O=arguments[2],H=arguments[3]||0,W=null);let le,ge,be,Se,Fe,Ie;W!==null?(le=W.max.x-W.min.x,ge=W.max.y-W.min.y,be=W.min.x,Se=W.min.y):(le=w.image.width,ge=w.image.height,be=0,Se=0),Y!==null?(Fe=Y.x,Ie=Y.y):(Fe=0,Ie=0);const Pe=ke.convert(O.format),Je=ke.convert(O.type);R.setTexture2D(O,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,O.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,O.unpackAlignment);const ot=L.getParameter(L.UNPACK_ROW_LENGTH),lt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),It=L.getParameter(L.UNPACK_SKIP_PIXELS),Qe=L.getParameter(L.UNPACK_SKIP_ROWS),Te=L.getParameter(L.UNPACK_SKIP_IMAGES),_t=w.isCompressedTexture?w.mipmaps[H]:w.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,_t.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,_t.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,be),L.pixelStorei(L.UNPACK_SKIP_ROWS,Se),w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,H,Fe,Ie,le,ge,Pe,Je,_t.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,H,Fe,Ie,_t.width,_t.height,Pe,_t.data):L.texSubImage2D(L.TEXTURE_2D,H,Fe,Ie,le,ge,Pe,Je,_t),L.pixelStorei(L.UNPACK_ROW_LENGTH,ot),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,lt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,It),L.pixelStorei(L.UNPACK_SKIP_ROWS,Qe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Te),H===0&&O.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Me.unbindTexture()},this.copyTextureToTexture3D=function(w,O,W=null,Y=null,H=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,Y=arguments[1]||null,w=arguments[2],O=arguments[3],H=arguments[4]||0);let le,ge,be,Se,Fe,Ie,Pe,Je,ot;const lt=w.isCompressedTexture?w.mipmaps[H]:w.image;W!==null?(le=W.max.x-W.min.x,ge=W.max.y-W.min.y,be=W.max.z-W.min.z,Se=W.min.x,Fe=W.min.y,Ie=W.min.z):(le=lt.width,ge=lt.height,be=lt.depth,Se=0,Fe=0,Ie=0),Y!==null?(Pe=Y.x,Je=Y.y,ot=Y.z):(Pe=0,Je=0,ot=0);const It=ke.convert(O.format),Qe=ke.convert(O.type);let Te;if(O.isData3DTexture)R.setTexture3D(O,0),Te=L.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)R.setTexture2DArray(O,0),Te=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,O.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,O.unpackAlignment);const _t=L.getParameter(L.UNPACK_ROW_LENGTH),Ye=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Vt=L.getParameter(L.UNPACK_SKIP_PIXELS),Dn=L.getParameter(L.UNPACK_SKIP_ROWS),kt=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,lt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,lt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Se),L.pixelStorei(L.UNPACK_SKIP_ROWS,Fe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ie),w.isDataTexture||w.isData3DTexture?L.texSubImage3D(Te,H,Pe,Je,ot,le,ge,be,It,Qe,lt.data):O.isCompressedArrayTexture?L.compressedTexSubImage3D(Te,H,Pe,Je,ot,le,ge,be,It,lt.data):L.texSubImage3D(Te,H,Pe,Je,ot,le,ge,be,It,Qe,lt),L.pixelStorei(L.UNPACK_ROW_LENGTH,_t),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ye),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Vt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Dn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,kt),H===0&&O.generateMipmaps&&L.generateMipmap(Te),Me.unbindTexture()},this.initRenderTarget=function(w){Le.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),Me.unbindTexture()},this.resetState=function(){I=0,A=0,C=null,Me.reset(),Be.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Vs?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===Rr?"display-p3":"srgb"}}class Sa extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Mm extends Et{constructor(e=null,t=1,n=1,r,s,a,o,l,c=1003,u=1003,h,d){super(null,a,o,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ma extends Et{constructor(e,t,n,r,s,a,o,l,c){super(e,t,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class dn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let r=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===a)return r/(s-1);const u=n[r],d=n[r+1]-u,f=(a-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new he:new F);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new F,r=[],s=[],a=[],o=new F,l=new ft;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new F)}s[0]=new F,a[0]=new F;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(r[f-1],r[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(wt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(wt(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class wa extends dn{constructor(e=0,t=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new he){const n=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class wm extends wa{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Ea(){let i=0,e=0,t=0,n=0;function r(s,a,o,l){i=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,u,h){let d=(a-s)/c-(o-s)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+h)+(l-o)/h;d*=u,f*=u,r(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return i+e*s+t*a+n*o}}}const ns=new F,Ta=new Ea,Aa=new Ea,Ca=new Ea;class Em extends dn{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new F){const n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,u;this.closed||o>0?c=r[(o-1)%s]:(ns.subVectors(r[0],r[1]).add(r[0]),c=ns);const h=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(ns.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=ns),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),Ta.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,v,p),Aa.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,v,p),Ca.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,v,p)}else this.curveType==="catmullrom"&&(Ta.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Aa.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Ca.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(Ta.calc(l),Aa.calc(l),Ca.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new F().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Rl(i,e,t,n,r){const s=(n-e)*.5,a=(r-t)*.5,o=i*i,l=i*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*i+t}function Tm(i,e){const t=1-i;return t*t*e}function Am(i,e){return 2*(1-i)*i*e}function Cm(i,e){return i*i*e}function or(i,e,t,n){return Tm(i,e)+Am(i,t)+Cm(i,n)}function Rm(i,e){const t=1-i;return t*t*t*e}function Pm(i,e){const t=1-i;return 3*t*t*i*e}function Im(i,e){return 3*(1-i)*i*i*e}function Lm(i,e){return i*i*i*e}function lr(i,e,t,n,r){return Rm(i,e)+Pm(i,t)+Im(i,n)+Lm(i,r)}class Pl extends dn{constructor(e=new he,t=new he,n=new he,r=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new he){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(lr(e,r.x,s.x,a.x,o.x),lr(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Dm extends dn{constructor(e=new F,t=new F,n=new F,r=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new F){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(lr(e,r.x,s.x,a.x,o.x),lr(e,r.y,s.y,a.y,o.y),lr(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Il extends dn{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Nm extends dn{constructor(e=new F,t=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new F){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new F){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ll extends dn{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(or(e,r.x,s.x,a.x),or(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fm extends dn{constructor(e=new F,t=new F,n=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new F){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(or(e,r.x,s.x,a.x),or(e,r.y,s.y,a.y),or(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Dl extends dn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){const n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],u=r[a>r.length-2?r.length-1:a+1],h=r[a>r.length-3?r.length-1:a+2];return n.set(Rl(o,l.x,c.x,u.x,h.x),Rl(o,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new he().fromArray(r))}return this}}var Nl=Object.freeze({__proto__:null,ArcCurve:wm,CatmullRomCurve3:Em,CubicBezierCurve:Pl,CubicBezierCurve3:Dm,EllipseCurve:wa,LineCurve:Il,LineCurve3:Nm,QuadraticBezierCurve:Ll,QuadraticBezierCurve3:Fm,SplineCurve:Dl});class Um extends dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(new Nl[r.type]().fromJSON(r))}return this}}class Ra extends Um{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Il(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){const s=new Ll(this.currentPoint.clone(),new he(e,t),new he(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){const o=new Pl(this.currentPoint.clone(),new he(e,t),new he(n,r),new he(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Dl(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,r,s,a,o,l),this}absellipse(e,t,n,r,s,a,o,l){const c=new wa(e,t,n,r,s,a,o,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Pa extends Ra{constructor(e){super(e),this.uuid=Nn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(new Ra().fromJSON(r))}return this}}const km={triangulate:function(i,e,t=2){const n=e&&e.length,r=n?e[0]*t:i.length;let s=Fl(i,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,u,h,d,f;if(n&&(s=Gm(i,e,s,t)),i.length>80*t){o=c=i[0],l=u=i[1];for(let g=t;g<r;g+=t)h=i[g],d=i[g+1],h<o&&(o=h),d<l&&(l=d),h>c&&(c=h),d>u&&(u=d);f=Math.max(c-o,u-l),f=f!==0?32767/f:0}return cr(s,a,t,o,l,f,0),a}};function Fl(i,e,t,n,r){let s,a;if(r===Jm(i,e,t,n)>0)for(s=e;s<t;s+=n)a=Ol(s,i[s],i[s+1],a);else for(s=t-n;s>=e;s-=n)a=Ol(s,i[s],i[s+1],a);return a&&is(a,a.next)&&(dr(a),a=a.next),a}function $n(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(is(t,t.next)||pt(t.prev,t,t.next)===0)){if(dr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function cr(i,e,t,n,r,s,a){if(!i)return;!a&&s&&Ym(i,n,r,s);let o=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,s?Bm(i,n,r,s):Om(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),dr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=zm($n(i),e,t),cr(i,e,t,n,r,s,2)):a===2&&Hm(i,e,t,n,r,s):cr($n(i),e,t,n,r,s,1);break}}}function Om(i){const e=i.prev,t=i,n=i.next;if(pt(e,t,n)>=0)return!1;const r=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=r<s?r<a?r:a:s<a?s:a,h=o<l?o<c?o:c:l<c?l:c,d=r>s?r>a?r:a:s>a?s:a,f=o>l?o>c?o:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Ci(r,o,s,l,a,c,g.x,g.y)&&pt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Bm(i,e,t,n){const r=i.prev,s=i,a=i.next;if(pt(r,s,a)>=0)return!1;const o=r.x,l=s.x,c=a.x,u=r.y,h=s.y,d=a.y,f=o<l?o<c?o:c:l<c?l:c,g=u<h?u<d?u:d:h<d?h:d,v=o>l?o>c?o:c:l>c?l:c,p=u>h?u>d?u:d:h>d?h:d,m=Ia(f,g,e,t,n),b=Ia(v,p,e,t,n);let x=i.prevZ,E=i.nextZ;for(;x&&x.z>=m&&E&&E.z<=b;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=p&&x!==r&&x!==a&&Ci(o,u,l,h,c,d,x.x,x.y)&&pt(x.prev,x,x.next)>=0||(x=x.prevZ,E.x>=f&&E.x<=v&&E.y>=g&&E.y<=p&&E!==r&&E!==a&&Ci(o,u,l,h,c,d,E.x,E.y)&&pt(E.prev,E,E.next)>=0))return!1;E=E.nextZ}for(;x&&x.z>=m;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=p&&x!==r&&x!==a&&Ci(o,u,l,h,c,d,x.x,x.y)&&pt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;E&&E.z<=b;){if(E.x>=f&&E.x<=v&&E.y>=g&&E.y<=p&&E!==r&&E!==a&&Ci(o,u,l,h,c,d,E.x,E.y)&&pt(E.prev,E,E.next)>=0)return!1;E=E.nextZ}return!0}function zm(i,e,t){let n=i;do{const r=n.prev,s=n.next.next;!is(r,s)&&Ul(r,n,n.next,s)&&ur(r,s)&&ur(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),dr(n),dr(n.next),n=i=s),n=n.next}while(n!==i);return $n(n)}function Hm(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Km(a,o)){let l=kl(a,o);a=$n(a,a.next),l=$n(l,l.next),cr(a,e,t,n,r,s,0),cr(l,e,t,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function Gm(i,e,t,n){const r=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*n,l=s<a-1?e[s+1]*n:i.length,c=Fl(i,o,l,n,!1),c===c.next&&(c.steiner=!0),r.push(Zm(c));for(r.sort(Vm),s=0;s<r.length;s++)t=Wm(r[s],t);return t}function Vm(i,e){return i.x-e.x}function Wm(i,e){const t=Xm(i,e);if(!t)return e;const n=kl(t,i);return $n(n,n.next),$n(t,t.next)}function Xm(i,e){let t=e,n=-1/0,r;const s=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const d=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=s&&d>n&&(n=d,r=t.x<t.next.x?t:t.next,d===s))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let u=1/0,h;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&Ci(a<c?s:n,a,l,c,a<c?n:s,a,t.x,t.y)&&(h=Math.abs(a-t.y)/(s-t.x),ur(t,i)&&(h<u||h===u&&(t.x>r.x||t.x===r.x&&$m(r,t)))&&(r=t,u=h)),t=t.next;while(t!==o);return r}function $m(i,e){return pt(i.prev,i,e.prev)<0&&pt(e.next,i,i.next)<0}function Ym(i,e,t,n){let r=i;do r.z===0&&(r.z=Ia(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,qm(r)}function qm(i){let e,t,n,r,s,a,o,l,c=1;do{for(t=i,i=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(r=t,t=t.nextZ,o--):(r=n,n=n.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;t=n}s.nextZ=null,c*=2}while(a>1);return i}function Ia(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Zm(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ci(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function Km(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!jm(i,e)&&(ur(i,e)&&ur(e,i)&&Qm(i,e)&&(pt(i.prev,i,e.prev)||pt(i,e.prev,e))||is(i,e)&&pt(i.prev,i,i.next)>0&&pt(e.prev,e,e.next)>0)}function pt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function is(i,e){return i.x===e.x&&i.y===e.y}function Ul(i,e,t,n){const r=ss(pt(i,e,t)),s=ss(pt(i,e,n)),a=ss(pt(t,n,i)),o=ss(pt(t,n,e));return!!(r!==s&&a!==o||r===0&&rs(i,t,e)||s===0&&rs(i,n,e)||a===0&&rs(t,i,n)||o===0&&rs(t,e,n))}function rs(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ss(i){return i>0?1:i<0?-1:0}function jm(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ul(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ur(i,e){return pt(i.prev,i,i.next)<0?pt(i,e,i.next)>=0&&pt(i,i.prev,e)>=0:pt(i,e,i.prev)<0||pt(i,i.next,e)<0}function Qm(i,e){let t=i,n=!1;const r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function kl(i,e){const t=new La(i.i,i.x,i.y),n=new La(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Ol(i,e,t,n){const r=new La(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function dr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function La(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Jm(i,e,t,n){let r=0;for(let s=e,a=t-n;s<t;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class hr{static area(e){const t=e.length;let n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return hr.area(e)<0}static triangulateShape(e,t){const n=[],r=[],s=[];Bl(e),zl(n,e);let a=e.length;t.forEach(Bl);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,zl(n,t[l]);const o=km.triangulate(n,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Bl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function zl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class fr extends bn{constructor(e=new Pa([new he(0,.5),new he(-.5,-.5),new he(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],r=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Yt(r,3)),this.setAttribute("normal",new Yt(s,3)),this.setAttribute("uv",new Yt(a,2));function c(u){const h=r.length/3,d=u.extractPoints(t);let f=d.shape;const g=d.holes;hr.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=g.length;p<m;p++){const b=g[p];hr.isClockWise(b)===!0&&(g[p]=b.reverse())}const v=hr.triangulateShape(f,g);for(let p=0,m=g.length;p<m;p++){const b=g[p];f=f.concat(b)}for(let p=0,m=f.length;p<m;p++){const b=f[p];r.push(b.x,b.y,0),s.push(0,0,1),a.push(b.x,b.y)}for(let p=0,m=v.length;p<m;p++){const b=v[p],x=b[0]+h,E=b[1]+h,I=b[2]+h;n.push(x,E,I),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return eg(t,e)}static fromJSON(e,t){const n=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];n.push(a)}return new fr(n,e.curveSegments)}}function eg(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const r=i[t];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e}class tg extends Ft{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ri extends ir{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ng extends Ri{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new he(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return wt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}const Pi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Hl{constructor(e,t,n){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const f=c[h],g=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null}}}const Gl=new Hl;class as{constructor(e){this.manager=e!==void 0?e:Gl,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}as.DEFAULT_MATERIAL_NAME="__DEFAULT";class ig extends as{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Pi.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=ji("img");function l(){u(),Pi.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class Vl extends as{constructor(e){super(e)}load(e,t,n,r){const s=new Et,a=new ig(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class pr extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class rg extends pr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Da=new ft,Wl=new F,Xl=new F;class Na{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ua,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Wl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wl),Xl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xl),t.updateMatrixWorld(),Da.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Da),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Da)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class sg extends Na{constructor(){super(new Ut(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ri*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class ag extends pr{constructor(e,t,n=0,r=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new sg}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const $l=new ft,mr=new F,Fa=new F;class og extends Na{constructor(){super(new Ut(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new he(4,2),this._viewportCount=6,this._viewports=[new ht(2,1,1,1),new ht(0,1,1,1),new ht(3,1,1,1),new ht(1,1,1,1),new ht(3,0,1,1),new ht(1,0,1,1)],this._cubeDirections=[new F(1,0,0),new F(-1,0,0),new F(0,0,1),new F(0,0,-1),new F(0,1,0),new F(0,-1,0)],this._cubeUps=[new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,0,1),new F(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),mr.setFromMatrixPosition(e.matrixWorld),n.position.copy(mr),Fa.copy(n.position),Fa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Fa),n.updateMatrixWorld(),r.makeTranslation(-mr.x,-mr.y,-mr.z),$l.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix($l)}}class Yl extends pr{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new og}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class lg extends Na{constructor(){super(new da(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cg extends pr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new lg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ql extends pr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class ug extends as{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Pi.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{r&&r(c)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Pi.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),Pi.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});Pi.add(e,l),s.manager.itemStart(e)}}class dg{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Zl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Zl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Zl(){return(typeof performance=="undefined"?Date:performance).now()}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:mn}})),typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=mn);const hg=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"),os=({title:i,width:e,height:t,background:n,accent:r,secondary:s,horizonPercent:a=58})=>{const o=Math.max(e,t),l=Math.min(e,t),c=t*(a/100),u=e*.06,h=t*.92,d=o*.035,f=o*.004,g=o*.012,v=o*.005,p=l*.11,m=hg(i),b=`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
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
  <circle cx="${e*.72}" cy="${t*.26}" r="${p}" fill="#ffffff" opacity="0.16"/>
  <text x="${u}" y="${h}" fill="#11181d" opacity="0.28" font-size="${d}" font-family="Inter, Arial, sans-serif" letter-spacing="${f}">${m}</text>
</svg>`;return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(b)}`},fg=[{id:"electric-storm",title:"Electric Storm",subtitle:"Artwork 01",description:"Eine ruhige immersive digitale Kunstpräsentation mit realistischer Materialität und hochwertiger Lichtführung.",year:2025,medium:"Digital painting · 2400 × 1600",image:os({title:"Electric Storm",width:2400,height:1600,background:"#dfe5e9",secondary:"#9fb0ba",accent:"#c8b690",horizonPercent:54}),dimensions:{width:2400,height:1600},alt:"Abstrakte Landschaft mit weichen Wolken über einem warm getönten Horizont.",credit:"Freyraum Studio",tags:["landscape","soft-light","warm"],surface:"Matte Leinwand"},{id:"quiet-coastline",title:"Quiet Coastline",subtitle:"Artwork 02",description:"Minimalistische Küstenkomposition mit fein ausgearbeiteter Materialstruktur.",year:2025,medium:"Digital painting · 1800 × 2400",image:os({title:"Quiet Coastline",width:1800,height:2400,background:"#eef1f3",secondary:"#c9d4d8",accent:"#a6b4ae",horizonPercent:62}),dimensions:{width:1800,height:2400},alt:"Hochformatige minimalistische Küstenszene in gedämpften Grautönen.",credit:"Freyraum Studio",tags:["portrait","coast","minimal"],surface:"Matte Leinwand"},{id:"tokyo-passage",title:"Tokyo Passage",subtitle:"Artwork 03",description:"Cinematische urbane Perspektiven mit dramatischem Streiflicht.",year:2025,medium:"Digital painting · 2100 × 2100",image:os({title:"Tokyo Passage",width:2100,height:2100,background:"#e8e3da",secondary:"#b8c1c5",accent:"#8b9497",horizonPercent:48}),dimensions:{width:2100,height:2100},alt:"Quadratische urbane Szene mit dramatischem Streiflicht in kühlen Tönen.",credit:"Freyraum Studio",tags:["square","urban","cinematic"],surface:"Satinierte Leinwand"},{id:"golden-desert",title:"Golden Desert",subtitle:"Artwork 04",description:"Atmosphärische Lichtstimmung kombiniert mit realistischer Leinwandstruktur.",year:2025,medium:"Digital painting · 2800 × 1200",image:os({title:"Golden Desert",width:2800,height:1200,background:"#f0ece4",secondary:"#d8c7a5",accent:"#a98f6d",horizonPercent:57}),dimensions:{width:2800,height:1200},alt:"Ultra-breite Wüstenkomposition in goldenen und sandfarbenen Tönen.",credit:"Freyraum Studio",tags:["ultrawide","desert","warm"],surface:"Matte Leinwand"}],gr={high:{id:"high",label:"Hoch",description:"Volle Detailtiefe für moderne dedizierte GPUs.",pixelRatioCap:1.6,bloomStrength:.04,bloomRadius:.36,bloomThreshold:1.2,shadows:!0,artworkSegments:180,shaderVariant:"painting-high",normalStrength:.7,detailNormalStrength:.6,bumpStrength:0,specularStrength:.28,anisotropyDivisor:1,aoEnabled:!0,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:1024,proceduralInspectionTileSize:2048,parallaxEnabled:!0,parallaxSteps:10,parallaxScale:.012,selfShadowEnabled:!0,selfShadowSteps:6,selfShadowStrength:.3,selfShadowBias:.05,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:.002,clearcoatEnabled:!0,clearcoatStrength:.12,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0},balanced:{id:"balanced",label:"Ausgewogen",description:"Empfohlen für die meisten Laptops und Tablets.",pixelRatioCap:1.25,bloomStrength:.03,bloomRadius:.3,bloomThreshold:1.25,shadows:!0,artworkSegments:120,shaderVariant:"painting-balanced",normalStrength:.45,detailNormalStrength:.4,bumpStrength:.025,specularStrength:.3,anisotropyDivisor:2,aoEnabled:!1,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:512,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0},battery:{id:"battery",label:"Akkusparend",description:"Für integrierte GPUs und Akkubetrieb.",pixelRatioCap:1,bloomStrength:0,bloomRadius:.28,bloomThreshold:1.2,shadows:!1,artworkSegments:48,shaderVariant:"painting-battery",normalStrength:.25,detailNormalStrength:0,bumpStrength:0,specularStrength:0,anisotropyDivisor:4,aoEnabled:!1,grazingBoostEnabled:!1,detailNormalEnabled:!1,proceduralTileSize:256,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:0,fxaaEnabled:!1,albedoFidelityFill:0}},Kl="balanced";function ls(i){var e;return(e=gr[i])!=null?e:gr[Kl]}function cs(i=1.8){var r,s,a;const e=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,n=((a=(s=(r=window.matchMedia)==null?void 0:r.call(window,"(pointer: coarse)"))==null?void 0:s.matches)!=null?a:!1)?Math.min(i,1.5):i;return Math.min(e,n)}const pg=.5,mg=2;function gg(){var l,c,u;const i=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,e=(u=(c=(l=window.matchMedia)==null?void 0:l.call(window,"(pointer: coarse)"))==null?void 0:c.matches)!=null?u:!1,t=window.innerWidth*window.innerHeight,n=6e5,r=8e5,s=navigator,a=typeof s.deviceMemory=="number"?s.deviceMemory:void 0,o=typeof s.hardwareConcurrency=="number"?s.hardwareConcurrency:void 0;return a!==void 0&&a<=pg||o!==void 0&&o<=mg||e&&i>=2&&t<n?"battery":(e&&t<r,"balanced")}const jl="freyraum.diagnostics.mode",Ql=500,vg=2500,Ii={debug:10,info:20,warn:30,error:40};function Jl(i){if(!i)return null;const e=i.trim().toLowerCase();return e==="1"||e==="true"||e==="info"?"info":e==="verbose"||e==="2"?"verbose":e==="0"||e==="false"||e==="default"?"default":null}function _g(){try{const i=new URLSearchParams(window.location.search);return Jl(i.get("debug"))}catch(i){return null}}function xg(){try{return Jl(localStorage.getItem(jl))}catch(i){return null}}function yg(i){try{localStorage.setItem(jl,i)}catch(e){}}function bg(i){switch(i){case"verbose":return"debug";case"info":return"info";default:return"warn"}}function Ua(i,e=0,t){if(i==null)return i;if(e>3)return"[max-depth]";if(typeof i=="function")return`[function ${i.name||"anonymous"}]`;if(typeof i=="bigint"||typeof i=="symbol")return i.toString();if(i instanceof Error)return{name:i.name,message:i.message,stack:i.stack};if(Array.isArray(i))return i.map(n=>Ua(n,e+1,t));if(typeof i=="object"){const n=i,r=t!=null?t:new WeakSet;if(r.has(n))return"[circular]";r.add(n);const s={};for(const[a,o]of Object.entries(n))s[a]=Ua(o,e+1,r);return s}return i}class Sg{constructor(){y(this,"startedAt",performance.now());y(this,"startedAtIso",new Date().toISOString());y(this,"entries",[]);y(this,"nextId",1);y(this,"mode");y(this,"dedupe",new Map);y(this,"globalHandlersInstalled",!1);y(this,"handlingGlobalError",!1);var e,t;this.mode=(t=(e=_g())!=null?e:xg())!=null?t:"default",typeof window!="undefined"&&(window.__FREYRAUM_DIAGNOSTICS__=this.publicApi())}getMode(){return this.mode}setMode(e){this.mode=e,yg(e),this.info("diagnostics","mode-changed",`Diagnostics mode set to ${e}`)}installGlobalHandlers(){this.globalHandlersInstalled||typeof window=="undefined"||(this.globalHandlersInstalled=!0,window.addEventListener("error",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","uncaught-error",e.message||"Uncaught window error",{filename:e.filename,lineno:e.lineno,colno:e.colno,error:e.error})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle global window error",t)}finally{this.handlingGlobalError=!1}}}),window.addEventListener("unhandledrejection",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","unhandled-rejection","Unhandled promise rejection",{reason:e.reason})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle unhandled rejection",t)}finally{this.handlingGlobalError=!1}}}))}debug(e,t,n,r){this.push("debug",e,t,n,r)}info(e,t,n,r){this.push("info",e,t,n,r)}warn(e,t,n,r){this.push("warn",e,t,n,r)}error(e,t,n,r){this.push("error",e,t,n,r)}child(e){return new Mg(this,e)}getEntries(){return this.entries}clear(){this.entries=[],this.dedupe.clear()}snapshot(){return{sessionStartedAt:this.startedAtIso,mode:this.mode,entries:this.entries}}print(e="info"){const t=Ii[e];for(const n of this.entries)Ii[n.level]<t||this.printEntry(n)}exportJson(){return JSON.stringify(this.snapshot(),null,2)}summarize(){const e=new Map;for(const t of this.entries){const n=`[${t.scope}] ${t.event}`,r=e.get(n);r?(r.count+=t.repeatCount,r.lastMessage=t.message,r.lastMs=t.relativeMs,Ii[t.level]>Ii[r.level]&&(r.level=t.level)):e.set(n,{count:t.repeatCount,level:t.level,lastMessage:t.message,lastMs:t.relativeMs})}console.group("[freyraum] Diagnostics summary");for(const[t,n]of e){const r=`${t} (×${n.count}, last +${n.lastMs}ms) — ${n.lastMessage}`;n.level==="error"?console.error(r):n.level==="warn"?console.warn(r):n.level==="info"?console.info(r):console.debug(r)}console.groupEnd()}publicApi(){return{getMode:()=>this.getMode(),setMode:e=>this.setMode(e),getEntries:()=>this.getEntries(),clear:()=>this.clear(),print:e=>this.print(e),snapshot:()=>this.snapshot(),exportJson:()=>this.exportJson(),summarize:()=>this.summarize()}}isLevelEnabled(e){return e!=="debug"||this.mode==="verbose"}push(e,t,n,r,s){if(!this.isLevelEnabled(e))return;const a=performance.now(),o=`${e}|${t}|${n}|${r}`,l=this.dedupe.get(o);if(l&&a-l.lastSeen<vg){const h=this.entries.find(d=>d.id===l.entryId);if(h){h.repeatCount+=1,l.lastSeen=a;return}}let c;try{const h=typeof s=="function"?s():s;c=h===void 0?void 0:Ua(h)}catch(h){c={serializationError:h instanceof Error?h.message:String(h)}}const u={id:this.nextId++,timestamp:new Date().toISOString(),relativeMs:Math.round(a-this.startedAt),level:e,scope:t,event:n,message:r,data:c,repeatCount:1};if(this.entries.push(u),this.entries.length>Ql&&(this.entries=this.entries.slice(-Ql)),this.dedupe.set(o,{entryId:u.id,lastSeen:a}),Ii[e]>=Ii[bg(this.mode)])try{this.printEntry(u)}catch(h){console.error("[freyraum][diagnostics][error] Failed to print diagnostic entry",h)}}printEntry(e){const t=`[freyraum][${e.scope}][${e.level}] +${e.relativeMs}ms ${e.message}`,n={event:e.event};e.repeatCount>1&&(n.repeats=e.repeatCount);const r=e.data!==void 0,s=e.level==="error"?console.error:e.level==="warn"?console.warn:e.level==="info"?console.info:console.debug;if(r)try{console.groupCollapsed(t,n),s("data:",e.data),console.groupEnd()}catch(a){s(t,n,e.data)}else try{s(t,n)}catch(a){console.log(t,n)}}}class Mg{constructor(e,t){this.diagnostics=e,this.scope=t}isDebugEnabled(){return this.diagnostics.isLevelEnabled("debug")}debug(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}debugLazy(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}info(e,t,n){this.diagnostics.info(this.scope,e,t,n)}warn(e,t,n){this.diagnostics.warn(this.scope,e,t,n)}error(e,t,n){this.diagnostics.error(this.scope,e,t,n)}}const ec=new Sg;function Li(){return ec}function Zt(i){return ec.child(i)}const vr=Zt("renderer");class wg{constructor(e,t,n="#d8dddb"){y(this,"renderer");y(this,"preset");y(this,"wallClearColor");y(this,"renderPaused",!1);y(this,"disposed",!1);y(this,"contextChangeCallback",null);y(this,"_sizeScratch",new he);y(this,"onContextLost",e=>{var t;e.preventDefault(),this.renderPaused=!0,(t=this.contextChangeCallback)==null||t.call(this,"lost"),vr.warn("context-lost","WebGL context lost; render paused until restoration",{width:this.renderer.domElement.width,height:this.renderer.domElement.height})});y(this,"onContextRestored",()=>{var e;this.renderPaused=!1,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(cs(this.preset.pixelRatioCap)),this.renderer.setClearColor(new Ue(this.wallClearColor)),(e=this.contextChangeCallback)==null||e.call(this,"restored"),vr.info("context-restored","WebGL context restored",{})});this.preset=t,this.wallClearColor=n,this.renderer=new Cl({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(cs(t.pixelRatioCap)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=Ct,this.renderer.toneMapping=0,this.renderer.toneMappingExposure=1,this.renderer.setClearColor(new Ue(this.wallClearColor)),this.renderer.shadowMap.enabled=t.shadows,this.renderer.shadowMap.type=2,this.applyQualityDataAttribute(t.id);const r=this.renderer.domElement;r.addEventListener("webglcontextlost",this.onContextLost,!1),r.addEventListener("webglcontextrestored",this.onContextRestored,!1),e.appendChild(r)}applyPreset(e){this.preset=e,this.renderer.setPixelRatio(cs(e.pixelRatioCap)),this.renderer.shadowMap.enabled=e.shadows,this.applyQualityDataAttribute(e.id)}setWallClearColor(e){this.wallClearColor=e,this.renderer.setClearColor(new Ue(this.wallClearColor))}resize(e,t){this.renderer.setSize(Math.max(1,e),Math.max(1,t)),this.renderer.setPixelRatio(cs(this.preset.pixelRatioCap))}isRenderPaused(){return this.renderPaused}onContextChange(e){this.contextChangeCallback=e}async prewarm(e,t){const n=this.renderer;try{typeof n.compileAsync=="function"?(await n.compileAsync(e,t),vr.debug("prewarm-async","Shader programs pre-warmed via compileAsync()",{preset:this.preset.id})):(n.compile(e,t),vr.debug("prewarm-sync","Shader programs pre-warmed via compile()",{preset:this.preset.id}))}catch(r){vr.warn("prewarm-failed","Shader pre-warm failed; continuing normally",{message:r instanceof Error?r.message:String(r)})}}getRendererSnapshot(){var n,r;const e=this.renderer.info,t=this._sizeScratch;return this.renderer.getSize(t),{drawCalls:e.render.calls,triangles:e.render.triangles,points:e.render.points,lines:e.render.lines,geometries:e.memory.geometries,textures:e.memory.textures,programs:(r=(n=e.programs)==null?void 0:n.length)!=null?r:0,pixelRatio:this.renderer.getPixelRatio(),width:t.x,height:t.y,renderPaused:this.renderPaused,preset:this.preset.id}}applyQualityDataAttribute(e){try{typeof document!="undefined"&&document.documentElement&&(document.documentElement.dataset.quality=e)}catch(t){}}dispose(){if(this.disposed)return;this.disposed=!0;const e=this.renderer.domElement;e.removeEventListener("webglcontextlost",this.onContextLost,!1),e.removeEventListener("webglcontextrestored",this.onContextRestored,!1),this.contextChangeCallback=null,this.renderer.dispose()}}class Eg extends Sa{constructor(e=null){super();const t=new bi;t.deleteAttribute("uv");const n=new Ri({side:1}),r=new Ri,s=new Yl(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new rt(t,n);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const o=new rt(t,r);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const l=new rt(t,r);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);const c=new rt(t,r);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const u=new rt(t,r);u.position.set(-2.017,.018,6.124),u.rotation.set(0,.333,0),u.scale.set(2.002,4.566,2.064),this.add(u);const h=new rt(t,r);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);const d=new rt(t,r);d.position.set(-2.193,-.369,-5.547),d.rotation.set(0,.516,0),d.scale.set(3.875,3.487,2.986),this.add(d);const f=new rt(t,Di(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);const g=new rt(t,Di(50));g.position.set(-16.109,18.021,-8.207),g.scale.set(.1,2.425,2.751),this.add(g);const v=new rt(t,Di(17));v.position.set(14.904,12.198,-1.832),v.scale.set(.15,4.265,6.331),this.add(v);const p=new rt(t,Di(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);const m=new rt(t,Di(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const b=new rt(t,Di(100));b.position.set(0,20,0),b.scale.set(1,.1,1),this.add(b)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Di(i){const e=new gi;return e.color.setScalar(i),e}class Tg{constructor(e){y(this,"scene");y(this,"camera");y(this,"environmentTarget",null);this.scene=new Sa,this.camera=new Ut(40,window.innerWidth/window.innerHeight,.1,100),this.camera.position.z=7;const t=new va(e);t.compileEquirectangularShader();const n=new Eg(e);this.environmentTarget=t.fromScene(n),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=.55,t.dispose(),n.dispose()}updateAspect(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix()}dispose(){var e;(e=this.environmentTarget)==null||e.dispose(),this.environmentTarget=null}}const tc={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ni{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ag=new da(-1,1,1,-1,0,1);class Cg extends bn{constructor(){super(),this.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Yt([0,2,0,0,2,0],2))}}const Rg=new Cg;class ka{constructor(e){this._mesh=new rt(Rg,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ag)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class nc extends Ni{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=sr.clone(e.uniforms),this.material=new Ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ka(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ic extends Ni{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class Pg extends Ni{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ig{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new he);this._width=n.width,this._height=n.height,t=new $t(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:1016}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new nc(tc),this.copyPass.material.blending=0,this.clock=new dg}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let r=0,s=this.passes.length;r<s;r++){const a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ic!==void 0&&(a instanceof ic?n=!0:a instanceof Pg&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new he);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Lg extends Ni{constructor(e,t,n=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ue}render(e,t,n){const r=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}}const Dg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ue(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Fi extends Ni{constructor(e,t,n,r){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=r,this.resolution=e!==void 0?new he(e.x,e.y):new he(256,256),this.clearColor=new Ue(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new $t(s,a,{type:1016}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const d=new $t(s,a,{type:1016});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new $t(s,a,{type:1016});f.texture.name="UnrealBloomPass.v"+h,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),a=Math.round(a/2)}const o=Dg;this.highPassUniforms=sr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ft({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new he(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=tc;this.copyUniforms=sr.clone(u.uniforms),this.blendMaterial=new Ft({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ue,this.oldClearAlpha=1,this.basic=new gi,this.fsQuad=new ka(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,r),this.renderTargetsVertical[s].setSize(n,r),this.separableBlurMaterials[s].uniforms.invSize.value=new he(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(e,t,n,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Fi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Fi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Ft({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new he(.5,.5)},direction:{value:new he(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new Ft({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Fi.BlurDirectionX=new he(1,0),Fi.BlurDirectionY=new he(0,1);const Ng={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Fg extends Ni{constructor(){super();const e=Ng;this.uniforms=sr.clone(e.uniforms),this.material=new tg({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ka(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},nt.getTransfer(this._outputColorSpace)===ct&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===7&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Ug={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new he(1/1024,1/512)}},vertexShader:`

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
	`};class kg{constructor(e,t,n,r){y(this,"composer");y(this,"bloomPass");y(this,"fxaaPass");y(this,"renderer");var o;this.renderer=e,this.composer=new Ig(e);const s=new Lg(t,n);this.composer.addPass(s),this.bloomPass=new Fi(new he(window.innerWidth,window.innerHeight),r.bloomStrength,r.bloomRadius,r.bloomThreshold),this.bloomPass.enabled=r.bloomStrength>0,this.composer.addPass(this.bloomPass),this.fxaaPass=new nc(Ug),this.applyFXAAResolution(window.innerWidth,window.innerHeight),this.fxaaPass.enabled=(o=r.fxaaEnabled)!=null?o:!0,this.composer.addPass(this.fxaaPass);const a=new Fg;this.composer.addPass(a)}applyPreset(e){var t;this.bloomPass.strength=e.bloomStrength,this.bloomPass.radius=e.bloomRadius,this.bloomPass.threshold=e.bloomThreshold,this.bloomPass.enabled=e.bloomStrength>0,this.fxaaPass.enabled=(t=e.fxaaEnabled)!=null?t:!0}resize(e,t){this.composer.setSize(Math.max(1,e),Math.max(1,t)),this.applyFXAAResolution(e,t)}prewarmComposer(e,t){try{this.resize(4,4),this.composer.render()}finally{this.resize(e,t)}}render(){this.composer.render()}dispose(){this.composer.dispose()}applyFXAAResolution(e,t){const n=this.renderer.getPixelRatio();this.fxaaPass.material.uniforms.resolution.value.set(1/(e*n),1/(t*n))}}const Og={ambientIntensity:.8,ambientKelvin:3e3,keys:[{kelvin:2700,intensity:200,position:{x:-9,y:6,z:6},angle:.4,penumbra:.8,decay:1.7}],accent:{kelvin:8e3,intensity:16,position:{x:7,y:-3,z:5},decay:2}};function Oa(i,e){const t=Math.max(1e3,Math.min(4e4,i))/100;let n,r,s;t<=66?(n=255,r=99.4708025861*Math.log(t)-161.1195681661,s=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307):(n=329.698727446*Math.pow(t-60,-.1332047592),r=288.1221695283*Math.pow(t-60,-.0755148492),s=255),n=Math.max(0,Math.min(255,n))/255,r=Math.max(0,Math.min(255,r))/255,s=Math.max(0,Math.min(255,s))/255;const a=e!=null?e:new Ue;return a.setRGB(n,r,s),a}const Bg=100;class zg{constructor(e,t){y(this,"scene");y(this,"ambientLight");y(this,"spots",[]);y(this,"spotTarget");y(this,"accent",null);y(this,"profile");y(this,"animate",!0);y(this,"lastUpdateTime",0);y(this,"animatedTime",0);y(this,"shadowsEnabled",!1);this.scene=e,this.profile=Og,this.ambientLight=new ql(16777215,this.profile.ambientIntensity),e.add(this.ambientLight),this.spotTarget=new xt,this.spotTarget.position.set(0,0,0),e.add(this.spotTarget),this.applyProfile(this.profile),this.applyPreset(t)}applyPreset(e){this.shadowsEnabled=e.shadows;for(const t of this.spots)t.castShadow=e.shadows}getLights(){return[...this.spots,this.ambientLight]}getExpectedShadowCasterCount(){return this.shadowsEnabled?this.spots.length:0}setAnimated(e){this.animate=e}update(e){var r,s;if(!this.animate)return!1;this.lastUpdateTime>0&&(this.animatedTime+=Math.min(e-this.lastUpdateTime,Bg)),this.lastUpdateTime=e;const t=this.spots[0];if(!t)return!1;const n=(s=(r=this.profile.keys[0])==null?void 0:r.position.x)!=null?s:-3;return t.position.x=n+Math.sin(this.animatedTime*2e-4)*.25,!0}dispose(){this.ambientLight.dispose();for(const e of this.spots)this.scene.remove(e),e.dispose();this.spots.length=0,this.scene.remove(this.spotTarget),this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}getKeyLightWorldDir(e){const t=e!=null?e:new F,n=this.spots[0];return n?t.copy(n.position).normalize():t.set(0,0,1)}applyProfile(e){var t;for(this.ambientLight.intensity=e.ambientIntensity,Oa(e.ambientKelvin,this.ambientLight.color);this.spots.length<e.keys.length;){const n=new ag(16777215,0);this.scene.add(n),this.spots.push(n)}for(;this.spots.length>e.keys.length;){const n=this.spots.pop();this.scene.remove(n),n.dispose()}e.keys.forEach((n,r)=>this.applyKeyLight(this.spots[r],n)),e.accent?(this.accent||(this.accent=new Yl(16777215,0,30),this.scene.add(this.accent)),Oa(e.accent.kelvin,this.accent.color),this.accent.intensity=e.accent.intensity,this.accent.position.set(e.accent.position.x,e.accent.position.y,e.accent.position.z),this.accent.decay=(t=e.accent.decay)!=null?t:2):this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}applyKeyLight(e,t){var n,r,s;Oa(t.kelvin,e.color),e.intensity=t.intensity,e.distance=80,e.angle=(n=t.angle)!=null?n:.42,e.penumbra=(r=t.penumbra)!=null?r:.9,e.decay=(s=t.decay)!=null?s:1.8,e.position.set(t.position.x,t.position.y,t.position.z),e.target=this.spotTarget}}class Hg{constructor(e=Gl){y(this,"diagnostics",Zt("texture"));y(this,"cache",new Map);y(this,"externalLoader");y(this,"localLoader");y(this,"maxAnisotropy",1);y(this,"maxTextureSize",0);y(this,"anisotropyDivisor",1);y(this,"renderer",null);y(this,"imageBitmapDecodeSupported",typeof createImageBitmap=="function"&&typeof ug=="function");y(this,"fallbackKeys",new Set);this.externalLoader=new Vl(e),this.localLoader=new Vl(e),this.externalLoader.setCrossOrigin("anonymous")}init(e){this.renderer=e,this.maxAnisotropy=e.capabilities.getMaxAnisotropy(),this.maxTextureSize=e.capabilities.maxTextureSize,this.diagnostics.info("capabilities","Texture manager initialized",{maxAnisotropy:this.maxAnisotropy,maxTextureSize:this.maxTextureSize,imageBitmapDecodeSupported:this.imageBitmapDecodeSupported,imageBitmapStatus:this.imageBitmapDecodeSupported?"available-for-guarded-benchmark":"unsupported-or-unavailable",compressedTexturePipeline:"ktx2-basis-future-importer-milestone"})}setAnisotropyDivisor(e){const t=Math.max(1,e);if(t===this.anisotropyDivisor){this.diagnostics.debug("anisotropy-noop","Anisotropy divisor unchanged; skipping cache walk",{divisor:t,cacheSize:this.cache.size});return}this.anisotropyDivisor=t;const n=this.getEffectiveAnisotropy();this.cache.forEach(r=>{r.anisotropy=n,r.needsUpdate=!0}),this.diagnostics.debug("anisotropy-applied","Anisotropy divisor changed; cache marked for re-upload",{divisor:t,anisotropy:n,cacheSize:this.cache.size})}getEffectiveAnisotropy(){return Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor))}async preload(e){this.diagnostics.info("preload",`Preloading ${e.length} albedo texture(s)`,{count:e.length,urlTypes:e.map(t=>this.compactUrlType(t))}),await Promise.all(e.map(t=>this.load(t)))}load(e){return this.loadForRole(e,"albedo")}loadForRole(e,t){const n=`${t}::${e}`;if(this.cache.has(n))return Promise.resolve(this.cache.get(n));const r=/^https?:\/\//i.test(e),s=r?this.externalLoader:this.localLoader,a=this.classifyUrlType(e),o=this.redactUrlForLog(e);return this.diagnostics.debug("load-start",`Starting ${t} texture load`,{url:o,urlType:a,role:t,crossOrigin:r?"anonymous":"none"}),new Promise(l=>{s.load(e,c=>{var f;this.prepareTexture(c,t),this.cache.set(n,c),(f=this.renderer)==null||f.initTexture(c);const u=c.image,h="naturalWidth"in u?u.naturalWidth||u.width||0:u.width||0,d="naturalHeight"in u?u.naturalHeight||u.height||0:u.height||0;this.warnIfOversized(t,o,a,h,d),this.diagnostics.info("load-success",`Loaded ${t} texture`,{url:o,urlType:a,width:h,height:d,fallbackUsed:!1}),l(c)},void 0,c=>{var h;this.diagnostics.warn("load-fallback",`Failed to load ${t} texture — creating generated fallback`,{url:o,urlType:a,role:t,errorMessage:c instanceof Error?c.message:String(c)});const u=this.createFallbackTexture(e);this.cache.set(n,u),(h=this.renderer)==null||h.initTexture(u),this.fallbackKeys.add(n),l(u)})})}async preloadTextureSet(e){if(!e)return{};const t=["albedo","normal","detailNormal","height","roughness","specular","ao","varnish"],n=t.filter(s=>!!e[s]);this.diagnostics.debug("preload-texture-set",`Loading authored texture set (${n.length} role(s))`,{roles:n});const r={};return await Promise.all(t.map(async s=>{const a=e[s];if(!a)return;const o=await this.loadForRole(a.url,s);r[s]=o})),r}get(e){const t=`albedo::${e}`,n=this.cache.get(t);return n||this.diagnostics.debug("cache-miss","Albedo cache miss — texture not preloaded for this URL",{url:this.redactUrlForLog(e),cacheSize:this.cache.size}),n}getForRole(e,t){return this.cache.get(`${t}::${e}`)}isFallback(e,t="albedo"){return this.fallbackKeys.has(`${t}::${e}`)}dispose(){this.cache.forEach(e=>e.dispose()),this.cache.clear()}prepareTexture(e,t){t==="albedo"?e.colorSpace=Ct:e.colorSpace=an,t==="detailNormal"&&(e.wrapS=1e3,e.wrapT=1e3);const n=Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor));e.anisotropy=n,e.needsUpdate=!0}createFallbackTexture(e){const t=document.createElement("canvas");t.width=1600,t.height=1100;const n=t.getContext("2d");if(n){const s=this.hash(e)%32,a=n.createLinearGradient(0,0,t.width,t.height);a.addColorStop(0,`hsl(${205+s}, 18%, 92%)`),a.addColorStop(.55,`hsl(${35+s}, 22%, 78%)`),a.addColorStop(1,`hsl(${205+s}, 12%, 62%)`),n.fillStyle=a,n.fillRect(0,0,t.width,t.height),n.strokeStyle="rgba(255,255,255,0.34)",n.lineWidth=28,n.beginPath(),n.moveTo(t.width*.08,t.height*.28),n.bezierCurveTo(t.width*.35,t.height*.08,t.width*.58,t.height*.32,t.width*.9,t.height*.22),n.stroke(),n.fillStyle="rgba(17,24,29,0.16)",n.font="700 58px Inter, Arial, sans-serif",n.fillText("FREYRAUM",96,t.height-96)}const r=new Ma(t);return this.prepareTexture(r,"albedo"),r}warnIfOversized(e,t,n,r,s){this.maxTextureSize<=0||r<=this.maxTextureSize&&s<=this.maxTextureSize||this.diagnostics.warn("texture-oversized","Loaded texture exceeds device MAX_TEXTURE_SIZE",{role:e,url:t,urlType:n,width:r,height:s,maxTextureSize:this.maxTextureSize,likelyBrowserDownscale:!0})}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t}classifyUrlType(e){return e.startsWith("data:")?"data-uri":/^https?:\/\//i.test(e)?"external-http":"local-relative"}compactUrlType(e){const t=this.classifyUrlType(e);return t==="external-http"?"http":t==="local-relative"?"local":`data-uri:${this.dataUriMime(e)}`}redactUrlForLog(e){return this.classifyUrlType(e)!=="data-uri"?e:`[data-uri:${this.dataUriMime(e)}:${e.length}bytes]`}dataUriMime(e){const t=e.indexOf(";");return t<=5?"unknown":e.slice(5,t)}}const rc="#include <common>",Gg="#include <map_fragment>",Vg="#include <normal_fragment_maps>",sc="#include <lights_fragment_end>";class Wg extends ng{constructor(t){super({roughness:.88,metalness:0,emissive:16777215,emissiveIntensity:t.albedoFidelityFill,clearcoat:0,specularIntensity:.3});y(this,"paintingUniforms");y(this,"currentVariant");y(this,"hasDetailNormal",!1);y(this,"hasBump",!1);y(this,"hasAO",!1);y(this,"grazingEnabled",!1);y(this,"parallaxEnabledFlag",!1);y(this,"selfShadowEnabledFlag",!1);y(this,"albedoOnlyEnabled",!1);y(this,"shadowDebugEnabled",!1);y(this,"shadowFilterEnabled",!1);y(this,"reducedMotion",!1);this.paintingUniforms={uDetailNormalStrength:{value:t.detailNormalStrength},uDetailTiling:{value:new he(8,8)},uBumpStrength:{value:t.bumpStrength},uLightGrazingBoost:{value:.25},uReducedMotionScalar:{value:1},tDetailNormal:{value:null},uParallaxScale:{value:t.parallaxEnabled?t.parallaxScale:0},uParallaxSteps:{value:t.parallaxSteps},uShadowSteps:{value:t.selfShadowSteps},uShadowStrength:{value:t.selfShadowStrength},uShadowBias:{value:t.selfShadowBias},uShadowSoftness:{value:t.selfShadowSoftness},uShadowMaxOcclusion:{value:t.selfShadowMaxOcclusion},uShadowProfileScale:{value:.5},uShadowFilterRadius:{value:t.selfShadowFilterRadius},uKeyLightDir:{value:new F(0,0,1)},uAlbedoOnly:{value:0}},this.currentVariant=t.shaderVariant,this.normalScale.set(t.normalStrength,t.normalStrength),this.grazingEnabled=t.grazingBoostEnabled,this.parallaxEnabledFlag=t.parallaxEnabled,this.selfShadowEnabledFlag=t.selfShadowEnabled,this.onBeforeCompile=n=>{Object.assign(n.uniforms,this.paintingUniforms);const r=[];this.detailNormalActive()&&r.push("#define PAINTING_USE_DETAIL_NORMAL"),this.hasBump&&this.paintingUniforms.uBumpStrength.value>0&&r.push("#define PAINTING_USE_BUMP"),this.hasAO&&r.push("#define PAINTING_USE_AO"),this.grazingEnabled&&r.push("#define PAINTING_USE_GRAZING_BOOST"),this.parallaxActive()&&r.push("#define PAINTING_USE_PARALLAX"),this.selfShadowActive()&&r.push("#define PAINTING_USE_SELFSHADOW"),this.albedoOnlyEnabled&&r.push("#define PAINTING_DEBUG_ALBEDO_ONLY"),this.shadowDebugEnabled&&r.push("#define PAINTING_DEBUG_SHADOW"),this.shadowFilterEnabled&&this.selfShadowActive()&&this.paintingUniforms.uShadowFilterRadius.value>0&&r.push("#define PAINTING_USE_SHADOW_FILTER");let s=n.fragmentShader;s=s.replace(rc,`${rc}

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
`),s=s.replace(Gg,`
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
`),s=s.replace(Vg,`
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
`);const c=`
${sc}

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
`;s=s.replace(sc,c),n.fragmentShader=r.join(`
`)+`
`+s}}detailNormalActive(){return this.hasDetailNormal&&this.paintingUniforms.uDetailNormalStrength.value>0}parallaxActive(){return this.parallaxEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uParallaxScale.value>0}selfShadowActive(){return this.selfShadowEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uShadowStrength.value>0}applyPreset(t){this.normalScale.set(t.normalStrength,t.normalStrength),this.clearcoatRoughness=t.clearcoatRoughnessValue,this.emissiveIntensity=t.albedoFidelityFill,t.clearcoatEnabled||(this.clearcoat=0,this.clearcoatMap&&(this.clearcoatMap=null,this.needsUpdate=!0)),this.paintingUniforms.uDetailNormalStrength.value=t.detailNormalStrength,this.paintingUniforms.uBumpStrength.value=t.bumpStrength,this.paintingUniforms.uParallaxScale.value=t.parallaxEnabled?t.parallaxScale:0,this.paintingUniforms.uParallaxSteps.value=t.parallaxSteps,this.paintingUniforms.uShadowSteps.value=t.selfShadowSteps,this.paintingUniforms.uShadowStrength.value=t.selfShadowStrength,this.paintingUniforms.uShadowBias.value=t.selfShadowBias,this.paintingUniforms.uShadowSoftness.value=t.selfShadowSoftness,this.paintingUniforms.uShadowMaxOcclusion.value=t.selfShadowMaxOcclusion,this.paintingUniforms.uShadowFilterRadius.value=t.selfShadowFilterRadius,(!t.detailNormalEnabled||t.detailNormalStrength<=0)&&(this.paintingUniforms.tDetailNormal.value=null),t.shaderVariant==="painting-battery"&&(this.roughnessMap=null),t.specularStrength<=0&&(this.specularIntensityMap=null);const n=t.aoEnabled&&!!this.aoMap,r=t.detailNormalEnabled&&t.detailNormalStrength>0&&!!this.paintingUniforms.tDetailNormal.value,s=t.bumpStrength>0&&!!this.bumpMap,a=t.grazingBoostEnabled,o=t.parallaxEnabled&&!!this.bumpMap&&t.parallaxScale>0,l=t.selfShadowEnabled&&!!this.bumpMap&&t.selfShadowStrength>0,c=n!==this.hasAO||r!==this.detailNormalActive()||s!==this.hasBump||a!==this.grazingEnabled||o!==this.parallaxEnabledFlag||l!==this.selfShadowEnabledFlag||t.shaderVariant!==this.currentVariant;this.hasAO=n,this.hasDetailNormal=r,this.hasBump=s,this.grazingEnabled=a,this.parallaxEnabledFlag=o,this.selfShadowEnabledFlag=l,this.currentVariant=t.shaderVariant,n||(this.aoMap=null),!s&&!o&&!l&&(this.bumpMap=null),c&&(this.needsUpdate=!0)}applyTextures(t,n,r){var l,c,u,h,d,f,g;this.map=t.albedo,this.emissiveMap=t.albedo,this.emissiveIntensity=r.albedoFidelityFill,this.normalMap=(l=t.normal)!=null?l:null,this.roughnessMap=r.shaderVariant==="painting-battery"?null:(c=t.roughness)!=null?c:null,this.roughnessMap&&(this.roughness=1),this.specularIntensityMap=r.specularStrength>0&&(u=t.specular)!=null?u:null,this.specularIntensity=r.specularStrength>0?r.specularStrength:.3,this.paintingUniforms.tDetailNormal.value=r.detailNormalEnabled&&r.detailNormalStrength>0&&(h=t.detailNormal)!=null?h:null,this.paintingUniforms.uDetailTiling.value.copy(n);const s=r.bumpStrength>0||r.parallaxEnabled&&r.parallaxScale>0||r.selfShadowEnabled;this.bumpMap=s&&(d=t.height)!=null?d:null,this.bumpScale=1,this.aoMap=(f=t.ao)!=null?f:null,this.aoMapIntensity=1;const a=r.clearcoatEnabled&&(g=t.varnish)!=null?g:null,o=a!==this.clearcoatMap;this.clearcoatMap=a,this.clearcoat=r.clearcoatEnabled&&t.varnish?r.clearcoatStrength:0,this.clearcoatRoughness=r.clearcoatRoughnessValue,o&&(this.needsUpdate=!0),this.applyPreset(r)}setReducedMotion(t){this.reducedMotion!==t&&(this.reducedMotion=t,this.paintingUniforms.uReducedMotionScalar.value=1)}setKeyLightDirView(t){this.paintingUniforms.uKeyLightDir.value.copy(t)}setAlbedoOnly(t){this.albedoOnlyEnabled!==t&&(this.albedoOnlyEnabled=t,this.paintingUniforms.uAlbedoOnly.value=t?1:0,this.needsUpdate=!0)}setShadowProfileScale(t){this.paintingUniforms.uShadowProfileScale.value=Math.max(0,Math.min(2,t))}setShadowDebug(t){this.shadowDebugEnabled!==t&&(this.shadowDebugEnabled=t,this.needsUpdate=!0)}setShadowFilterRadius(t,n){this.paintingUniforms.uShadowFilterRadius.value=Math.max(0,t),n!==this.shadowFilterEnabled&&(this.shadowFilterEnabled=n,this.needsUpdate=!0)}get shaderVariant(){return this.currentVariant}activeMaps(){const t=["albedo"];return this.normalMap&&t.push("normal"),this.hasDetailNormal&&t.push("detailNormal"),this.bumpMap&&t.push("height"),this.roughnessMap&&t.push("roughness"),this.specularIntensityMap&&t.push("specular"),this.aoMap&&t.push("ao"),(this.clearcoatMap||this.clearcoat>0)&&t.push("varnish"),this.emissiveMap&&this.emissiveIntensity>0&&t.push("albedoFill"),t}}function Xg(i){const e=i.image;let t=1,n=1;return"naturalWidth"in e?(t=e.naturalWidth||e.width||1,n=e.naturalHeight||e.height||1):(t=e.width||1,n=e.height||1),{width:t,height:n,aspect:t/n}}function $g(i,e,t){const n=Number.isFinite(i)&&i>0?i:1,r=e/t;return n>=r?{width:e,height:e/n}:{width:t*n,height:t}}class Yg{constructor(e,t){y(this,"group");y(this,"artworkMesh");y(this,"material");y(this,"_artworkAspect",1);y(this,"_artworkWidth",4);y(this,"_artworkHeight",5.7);y(this,"currentSegments");y(this,"scene");y(this,"detailTilesPerWorldUnit",2);y(this,"_lastAspectSource","texture");y(this,"_lastManifestDimensions",null);this.scene=e,this.group=new Wn,this.currentSegments=t.artworkSegments;const n=this.makeArtworkGeometry(this.currentSegments);this.material=new Wg(t),this.artworkMesh=new rt(n,this.material),this.group.add(this.artworkMesh),e.add(this.group)}getArtworkMeshObject(){return this.artworkMesh}makeArtworkGeometry(e){const t=new zn(4,5.7,e,e),n=t.getAttribute("uv");return n&&!t.getAttribute("uv1")&&t.setAttribute("uv1",n.clone()),t.computeTangents(),t}applyPreset(e){if(this.material.applyPreset(e),e.artworkSegments===this.currentSegments)return;this.currentSegments=e.artworkSegments;const t=this.artworkMesh.geometry,n=this.makeArtworkGeometry(this.currentSegments);this.artworkMesh.geometry=n,t.dispose(),this.artworkMesh.scale.set(this._artworkWidth/4,this._artworkHeight/5.7,1)}updateAspect(e,t){let n,r;t&&Number.isFinite(t.width)&&t.width>0&&Number.isFinite(t.height)&&t.height>0?(n=t.width/t.height,r="manifest"):(n=Xg(e).aspect,r="texture"),this._artworkAspect=n;const{width:s,height:a}=$g(n,4.2,5.8);this._artworkWidth=s,this._artworkHeight=a,this.artworkMesh.scale.set(s/4,a/5.7,1),this._lastAspectSource=r,this._lastManifestDimensions=t!=null?t:null}setPaintingTextures(e,t,n){this.updateAspect(e.albedo,n);const r=new he(this._artworkWidth*this.detailTilesPerWorldUnit,this._artworkHeight*this.detailTilesPerWorldUnit);this.material.applyTextures(e,r,t)}setTexture(e,t){this.setPaintingTextures({albedo:e},t)}get artworkAspect(){return this._artworkAspect}get artworkWidth(){return this._artworkWidth}get artworkHeight(){return this._artworkHeight}get lastAspectSource(){return this._lastAspectSource}get lastManifestDimensions(){return this._lastManifestDimensions}dispose(){this.scene.remove(this.group),this.artworkMesh.geometry.dispose(),this.material.dispose()}}class qg{constructor(){y(this,"cache",new Map);y(this,"currentAnisotropy",1)}generate(e,t,n){const r=Math.max(64,n!=null?n:256),s=`${e}::${t}::${r}`,a=this.cache.get(s);if(a)return a;const o=this.hash(e),l=Math.max(64,Math.floor(r/2));let c;switch(t){case"normal":c=this.generateNormal(o,r,14,6,3,.42);break;case"detailNormal":c=this.generateNormal(o*7+13,r,18,7,2.5,1.1),c.wrapS=1e3,c.wrapT=1e3;break;case"height":c=this.generateHeight(o,r);break;case"roughness":c=this.generateRoughness(o,l);break;case"specular":c=this.generateSpecular(o,l);break;case"ao":c=this.generateAO(o,r);break;case"varnish":c=this.generateVarnish(o,l);break;case"albedo":default:c=this.generateAlbedo(o);break}return this.cache.set(s,c),c.anisotropy=this.currentAnisotropy,c}disposeAll(){this.cache.forEach(e=>e.dispose()),this.cache.clear()}setAnisotropy(e){const t=Math.max(1,e|0);t!==this.currentAnisotropy&&(this.currentAnisotropy=t,this.cache.forEach(n=>{n.anisotropy=t,n.needsUpdate=!0}))}generateNormal(e,t,n,r,s,a){const o=new Uint8Array(t*t*4),l=.055*a,c=.14*a;for(let u=0;u<t;u+=1)for(let h=0;h<t;h+=1){const d=(u*t+h)*4,f=this.valueNoise2d(h*l,u*l,e),g=this.valueNoise2d((h+1)*l,u*l,e),v=this.valueNoise2d(h*l,(u+1)*l,e),p=this.valueNoise2d(h*c,u*c,e+17),m=this.valueNoise2d((h+1)*c,u*c,e+17),b=this.valueNoise2d(h*c,(u+1)*c,e+17),x=(g-f)*n+(m-p)*r,E=(v-f)*n+(b-p)*r;o[d+0]=this.clamp8(128+x*28),o[d+1]=this.clamp8(128+E*28),o[d+2]=255,o[d+3]=255}return this.makeDataTexture(o,t,t,!1)}generateHeight(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.04,r*.04,e)*90,l=this.valueNoise2d(s*.12,r*.09,e+7)*40,c=this.valueNoise2d(s*.55,r*.55,e+31)*3,u=this.clamp8(o+l+c);n[a+0]=u,n[a+1]=u,n[a+2]=u,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateRoughness(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.07,r*.07,e+3),l=this.valueNoise2d(s*.24,r*.24,e+19),c=o*.65+l*.35,u=this.clamp8(140+c*100);n[a+0]=u,n[a+1]=u,n[a+2]=u,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateSpecular(e,t){const n=new Uint8Array(t*t*4);for(let s=0;s<t*t;s+=1)n[s*4+0]=6,n[s*4+1]=6,n[s*4+2]=6,n[s*4+3]=255;const r=4+e%4;for(let s=0;s<r;s+=1){const a=e*(s+7)%t,o=e*(s+13)*3%t,l=14+e*(s+1)%18;for(let c=0;c<t;c+=1)for(let u=0;u<t;u+=1){const h=u-a,d=c-o,f=h*h+d*d,g=Math.exp(-f/(l*l))*50,v=(c*t+u)*4,p=this.clamp8(n[v]+g);n[v+0]=p,n[v+1]=p,n[v+2]=p}}return this.makeDataTexture(n,t,t,!1)}generateAO(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.11,r*.11,e)*18,l=this.clamp8(237+o);n[a+0]=l,n[a+1]=l,n[a+2]=l,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateVarnish(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.035,r*.035,e+101),l=this.valueNoise2d(s*.18,r*.18,e+149),c=this.clamp8((o*.75+l*.25)*85);n[a+0]=c,n[a+1]=c,n[a+2]=c,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateAlbedo(e){const n=new Uint8Array(16384),r=e%32,s=200+r*3%30,a=200+r*5%30,o=200+r*7%30;for(let l=0;l<64*64;l+=1)n[l*4+0]=s,n[l*4+1]=a,n[l*4+2]=o,n[l*4+3]=255;return this.makeDataTexture(n,64,64,!0)}makeDataTexture(e,t,n,r){const s=new Mm(e,t,n,1023,1009);return s.colorSpace=r?Ct:an,s.wrapS=1e3,s.wrapT=1e3,s.minFilter=1008,s.magFilter=1006,s.generateMipmaps=!0,s.needsUpdate=!0,s}clamp8(e){return e<0?0:e>255?255:e|0}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t||1}valueNoise2d(e,t,n){const r=Math.floor(e)|0,s=Math.floor(t)|0,a=e-Math.floor(e),o=t-Math.floor(t),l=a*a*(3-2*a),c=o*o*(3-2*o),u=this.latticeHash(r,s,n),h=this.latticeHash(r+1,s,n),d=this.latticeHash(r,s+1,n),f=this.latticeHash(r+1,s+1,n);return u*(1-l)*(1-c)+h*l*(1-c)+d*(1-l)*c+f*l*c}latticeHash(e,t,n){let r=n*1664525+e*1013904223>>>0;return r=(r^t*1540483477)>>>0,r=(r^r>>>16)>>>0,r=Math.imul(r,73244475)>>>0,r=(r^r>>>16)>>>0,(r>>>0)/4294967295}}function At(i,e,t){return Math.max(e,Math.min(t,i))}function Bt(i,e,t,n){return n<=0?i:i+(e-i)*(1-Math.exp(-t*n))}const _r=7,Zg=18,Kg=3.5,us=.2,Ba=.12,ac=1.04,jg=.65,oc=1.5,ds=.35,Qg=.25,lc=1.2,cc=.6,uc=12,xr=3.5,za=3,dc=4,hs=5,fs=4.5,ps=-.6,hc=.15,Ui=.88,Jg=.1,ms=Number.MAX_SAFE_INTEGER,yr=["normal","detailNormal","height","roughness","specular","ao","varnish"],Ha=2,ev=2500,tv=250,gs={"critical-now":0,"near-next":1,background:2},nv=["normal","detailNormal","height"];class iv{constructor(e,t,n,r,s,a){y(this,"diagnostics",Zt("gallery"));y(this,"artworks");y(this,"currentIndex",0);y(this,"artworkMesh");y(this,"textureManager");y(this,"procedural");y(this,"camera");y(this,"_fovTanCache",NaN);y(this,"_fovTanForFov",NaN);y(this,"viewportMetricsProvider");y(this,"reducedMotion",!1);y(this,"currentPreset",null);y(this,"artworkLoadToken",0);y(this,"inspectionMode",!1);y(this,"pendingResetAfterArtworkLoad",!1);y(this,"lastResetFitZoom",_r);y(this,"frameBudgetNavigationMarker",null);y(this,"interactionActive",!1);y(this,"interactionActiveSince",0);y(this,"interactionFrameCount",0);y(this,"interactionFrameTotalMs",0);y(this,"interactionFrameDropped",0);y(this,"prefetchedTextureSets",new Set);y(this,"fullPrefetchScheduled",!1);y(this,"readiness");y(this,"prefetchQueue",[]);y(this,"activePrefetches",new Set);y(this,"prefetchQueueRunning",!1);y(this,"prefetchSequence",0);y(this,"readinessRadius",Ha);y(this,"startupReadinessMode","full");y(this,"startupEntryTargetCount",Number.MAX_SAFE_INTEGER);y(this,"pendingNavigationProbe",null);y(this,"proceduralQueue",new Set);y(this,"proceduralQueueRunning",!1);y(this,"renderDirtyFrames",8);y(this,"targetX",0);y(this,"targetY",0);y(this,"zoom",_r);y(this,"targetZoom",_r);y(this,"panX",0);y(this,"panY",0);y(this,"targetPanX",0);y(this,"targetPanY",0);y(this,"lastUpdateTime",0);y(this,"onNavigateCallback",null);this.artworks=e,this.artworkMesh=t,this.textureManager=n,this.camera=r,this.procedural=s!=null?s:new qg,this.viewportMetricsProvider=a!=null?a:null,this.readiness=e.map((o,l)=>({index:l,artworkId:o.id,albedoLoaded:!1,pbrLoaded:!o.textureSet,proceduralReady:!1,materialApplied:!1,shaderCompiled:!1,gpuWarmed:!1,pbrMs:0,proceduralMs:0,lastWarmMs:0,lastReason:"init",updatedAt:0}))}setFrameBudgetMarker(e){this.frameBudgetNavigationMarker=e}setInteractionActive(e){if(e!==this.interactionActive)if(e)this.interactionActive=!0,this.interactionActiveSince=this.now(),this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.markRenderDirty(4),this.diagnostics.debug("interaction-start","Pointer interaction window opened; non-critical prefetch paused");else{const t=this.now()-this.interactionActiveSince;this.diagnostics.info("interaction-end","Pointer interaction window ended; resuming background work",{durationMs:Math.round(t),frameCount:this.interactionFrameCount,avgFrameMs:this.interactionFrameCount>0?Math.round(this.interactionFrameTotalMs/this.interactionFrameCount*10)/10:0,droppedFrames:this.interactionFrameDropped,droppedFramePct:this.interactionFrameCount>0?Math.round(this.interactionFrameDropped/this.interactionFrameCount*100):0}),this.interactionActive=!1,this.markRenderDirty(2),this.interactionActiveSince=0,this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.prefetchQueue.length>0&&!this.prefetchQueueRunning&&this.drainPrefetchQueue()}}markInteractionFrame(e){this.interactionActive&&(this.interactionFrameCount+=1,this.interactionFrameTotalMs+=e,e>33&&(this.interactionFrameDropped+=1))}markRenderDirty(e=4){this.renderDirtyFrames=Math.max(this.renderDirtyFrames,Math.max(1,Math.round(e)))}configureReadinessProfile(e){this.readinessRadius=At(Math.round(e.criticalRadius),1,3),this.diagnostics.info("readiness-profile","Applied readiness profile",{criticalRadius:this.readinessRadius,artworkCount:this.artworks.length})}configureStartupReadiness(e){this.startupReadinessMode=e.mode,this.startupEntryTargetCount=e.mode==="full"?this.artworks.length:Math.max(1,Math.min(this.artworks.length,Math.round(e.entryTargetCount))),this.diagnostics.info("startup-readiness","Applied startup readiness contract",{mode:this.startupReadinessMode,entryTargetCount:this.startupEntryTargetCount,artworkCount:this.artworks.length,criticalRadius:this.readinessRadius})}getStartupEntryTargets(e=0){const t=this.getBudgetedWarmOrder(e);return this.startupReadinessMode==="full"?t:t.slice(0,this.startupEntryTargetCount)}get isStagedStartup(){return this.startupReadinessMode!=="full"&&this.startupEntryTargetCount<this.artworks.length}applyPreset(e){var n;const t=this.currentPreset!==null;this.currentPreset=e,this.textureManager.setAnisotropyDivisor(e.anisotropyDivisor),this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy()),this.diagnostics.debug("preset-applied","Applied gallery quality preset",{shaderVariant:e.shaderVariant,anisotropy:this.textureManager.getEffectiveAnisotropy(),proceduralTileSize:e.proceduralTileSize,proceduralInspectionTileSize:e.proceduralInspectionTileSize,specularStrength:e.specularStrength,selfShadowBias:e.selfShadowBias}),this.markRenderDirty(4),t&&this.textureManager.get((n=this.artworks[this.currentIndex].webglImage)!=null?n:this.artworks[this.currentIndex].image)&&this.showArtwork(this.currentIndex)}setInspectionMode(e){e!==this.inspectionMode&&(this.inspectionMode=e,this.markRenderDirty(4),this.diagnostics.info("inspection-mode",`Inspection mode ${e?"enabled":"disabled"}`),this.currentPreset&&this.showArtwork(this.currentIndex))}async init(){const e=this.artworks.map(l=>({id:l.id,source:l.webglImage?"embedded-data-url":"file-url",urlType:l.webglImage?`data-uri:${l.webglImage.slice(5,l.webglImage.indexOf(";"))}`:"local-relative",hasWebglImage:!!l.webglImage,dimensions:l.dimensions}));this.diagnostics.info("init","Starting gallery init — preloading albedo textures",{artworkCount:e.length,artworks:e});const t=this.artworks.map(l=>{var c;return(c=l.webglImage)!=null?c:l.image});await this.textureManager.preload(t),this.readiness.forEach(l=>this.markReadiness(l.index,"albedoLoaded","init-preload"));const n=this.artworks.filter(l=>!!l.textureSet).length,r=new Set(this.getStartupEntryTargets(0)),s=({artwork:l,index:c})=>!!l.textureSet&&c<ms&&r.has(c),a=this.artworks.map((l,c)=>({artwork:l,index:c})).filter(s);this.diagnostics.info("init","Preloading entry-target PBR texture sets under loading overlay (v0.68 staged-readiness contract)",{mode:this.startupReadinessMode,pbrCount:a.length,textureSetCount:n,totalArtworks:this.artworks.length,entryTargetCount:r.size,safetyCap:ms,cappedArtworks:Math.max(0,this.artworks.length-ms)}),await Promise.allSettled(a.map(({artwork:l,index:c})=>this.preloadAuthoredTextureSet(c,"init-pbr-preload").then(()=>{this.prefetchedTextureSets.add(c),this.diagnostics.debug("preload-all","PBR texture set preloaded during init",{index:c,artworkId:l.id})})));const o=this.artworks.map((l,c)=>({artwork:l,index:c})).filter(({artwork:l,index:c})=>!!l.textureSet&&!this.prefetchedTextureSets.has(c));if(o.length>0){this.diagnostics.info("init","Queuing deferred artworks for deterministic near-next prefetch (v0.68 staged-readiness)",{mode:this.startupReadinessMode,deferredCount:o.length,entryTargetCount:r.size,safetyCap:ms});for(const{index:l}of o)this.scheduleTextureSetPrefetch(l,"init-staged-deferred-near-next","near-next")}this.preGenerateProceduralWindow(0,this.readinessRadius,"init-critical-window"),this.logGalleryScaleValidation(),this.diagnostics.info("init","Preload complete — showing first artwork",{artworkCount:t.length,pbrPreloaded:a.length,criticalProceduralReady:this.getCriticalWindowIndices(0,this.readinessRadius).length}),this.pendingResetAfterArtworkLoad=!0,await this.showArtwork(0),this.scheduleFullTextureSetPrefetch()}addZoomDelta(e){const t=this.getViewportMetrics(),n=this.getZoomBounds(t);this.targetZoom=this.clampZoom(this.targetZoom+e,n),this.clampPanTargets(t,n),this.markRenderDirty(4)}setPanOffset(e,t){const n=this.getViewportMetrics(),r=this.getZoomBounds(n),{x:s,y:a}=this.getPanLimits(this.targetZoom,n,r);this.targetPanX=At(this.targetPanX+e,-s,s),this.targetPanY=At(this.targetPanY+t,-a,a),this.markRenderDirty(4)}canPan(){const{x:e,y:t}=this.getPanLimits(this.targetZoom);return e>.01||t>.01}getHoverRotationScale(){const e=this.getZoomBounds(),t=Math.max(.001,e.maxOverviewZoom-e.minInspectionZoom),n=(this.clampZoom(this.targetZoom,e)-e.minInspectionZoom)/t;return{x:.03+n*.13,y:.018+n*.062}}async showArtwork(e){var x,E,I,A,C;const t=this.artworks[e],n=(x=t.webglImage)!=null?x:t.image,r=t.webglImage?"embedded-data-url":"file-url",s=this.textureManager.get(n),a=++this.artworkLoadToken,o=this.currentPreset,l=((E=this.pendingNavigationProbe)==null?void 0:E.toIndex)===e?this.pendingNavigationProbe:null;if(l&&!l.readinessBefore){const N=this.readiness[e];N&&(l.readinessBefore={pbrLoaded:N.pbrLoaded,proceduralReady:N.proceduralReady,gpuWarmed:N.gpuWarmed})}if(this.diagnostics.debugLazy("show-artwork","Preparing artwork render state",()=>{var N;return{index:e,artworkId:t.id,token:a,hasWebglImage:!!t.webglImage,webglImageSource:r,albedoUrlType:n.startsWith("data:")?`data-uri:${n.slice(5,n.indexOf(";"))}`:"local-relative",dimensions:t.dimensions,surface:(N=t.surface)!=null?N:null}}),!s||!o){this.diagnostics.warn("show-artwork-missing-state","Cannot render artwork because preset or albedo texture is missing",{artworkId:t.id,hasAlbedo:!!s,hasPreset:!!o,webglImageSource:r,albedoUrlType:n.startsWith("data:")?`data-uri:${n.slice(5,n.indexOf(";"))}`:"local-relative"});return}const c=await this.preloadAuthoredTextureSet(e,"show-artwork");if(t.textureSet&&this.prefetchedTextureSets.add(e),a!==this.artworkLoadToken){this.diagnostics.debugLazy("stale-load","Discarded stale artwork load",()=>({artworkId:t.id,token:a,latestToken:this.artworkLoadToken}));return}const u={albedo:(I=c.albedo)!=null?I:s},h=this.now();let d=!1;for(const N of yr)c[N]?u[N]=c[N]:this.shouldFillRole(N,o)&&(u[N]=this.generateProceduralMap(t.id,N,o),d=!0);this.markReadiness(e,"proceduralReady","show-artwork",{proceduralMs:d?this.now()-h:0}),this.artworkMesh.setPaintingTextures(u,o,t.dimensions),this.markReadiness(e,"materialApplied","show-artwork"),this.markRenderDirty(8);const f={albedo:c.albedo?"authored":"preloaded"};for(const N of yr)c[N]?f[N]="authored":u[N]?f[N]="procedural":f[N]="absent";this.diagnostics.debugLazy("show-artwork-maps","Resolved texture map for artwork",()=>({artworkId:t.id,maps:f,shaderVariant:o.shaderVariant,inspectionMode:this.inspectionMode}));const g=this.textureManager.isFallback(n,"albedo");g&&this.diagnostics.warn("show-artwork-fallback","Central 3D painting is using a GENERATED FALLBACK texture — the customer image could not be loaded as a WebGL texture",{artworkId:t.id,imageUrl:t.image,webglImageSource:r,manifestWidth:(A=t.dimensions)==null?void 0:A.width,manifestHeight:(C=t.dimensions)==null?void 0:C.height,fallbackUsed:!0});const v=this.getViewportMetrics(),p=this.getZoomBounds(v),m=this.getPanLimits(p.resetFitZoom,v,p),b=this.isPortraitResetArtwork();this.diagnostics.info("show-artwork-complete","Artwork is ready",{artworkId:t.id,activeMaps:this.artworkMesh.material.activeMaps(),inspectionMode:this.inspectionMode,fallbackUsed:g,webglImageSource:r,aspectSource:this.artworkMesh.lastAspectSource,manifestDimensions:this.artworkMesh.lastManifestDimensions,paintingWidth:this.artworkMesh.artworkWidth,paintingHeight:this.artworkMesh.artworkHeight,paintingAspect:this.artworkMesh.artworkAspect,resetZoom:p.resetFitZoom,minZoom:p.minInspectionZoom,closeZoomMinVisibleFraction:Ba,maxZoom:p.maxOverviewZoom,overviewHeadroom:p.maxOverviewZoom-p.resetFitZoom,panOverscrollX:lc,panOverscrollY:cc,panLimitAtReset:{x:m.x,y:m.y},portraitResetApplied:b,portraitResetExtra:b?oc:0,usableViewportWidth:v.usableW,usableViewportHeight:v.usableH,usableViewportFractionX:v.usableFracX,usableViewportFractionY:v.usableFracY,viewportOcclusion:{top:v.occlusionTop,right:v.occlusionRight,bottom:v.occlusionBottom,left:v.occlusionLeft},parallaxEnabled:o.parallaxEnabled,parallaxScale:o.parallaxScale,specularStrength:o.specularStrength,selfShadowBias:o.selfShadowBias,readiness:this.readiness[e]}),this.pendingResetAfterArtworkLoad?(this.pendingResetAfterArtworkLoad=!1,this.resetView()):(this.targetZoom=this.clampZoom(this.targetZoom,p),this.zoom=this.clampZoom(this.zoom,p)),this.clampPanTargets(v,p),this.prefetchAdjacentArtworks(e),this.queueProceduralWindow(e,this.readinessRadius,"show-artwork-adjacent"),this.logNavigationReadinessVerdict(e)}getBudgetedWarmOrder(e=this.currentIndex){const t=this.getCriticalWindowIndices(e,this.readinessRadius),n=this.artworks.map((r,s)=>s).filter(r=>!t.includes(r));return[...t,...n]}markGpuWarmed(e,t,n){this.markReadiness(e,"gpuWarmed",n,{lastWarmMs:t})}markShaderCompiled(e,t){this.markReadiness(e,"shaderCompiled",t)}markAllShaderCompiled(e){this.readiness.forEach(t=>this.markReadiness(t.index,"shaderCompiled",e))}promotePrefetchWindow(e,t){this.scheduleTextureSetPrefetch(e,t,"critical-now"),this.getCriticalWindowIndices(e,this.readinessRadius).forEach(n=>{n!==e&&this.scheduleTextureSetPrefetch(n,`${t}:nearby`,"near-next")}),this.queueProceduralWindow(e,this.readinessRadius,`${t}:nearby`)}hasReadinessWork(){if(this.prefetchQueue.length>0||this.activePrefetches.size>0)return!0;const e=this.readiness[this.currentIndex];return!!e&&(!e.pbrLoaded||!e.proceduralReady||!e.gpuWarmed)}getReadinessLedger(){return this.readiness.map(e=>({...e}))}getFullGalleryReadinessSummary(){const e=this.readiness,t=c=>c.albedoLoaded&&c.pbrLoaded&&c.proceduralReady&&c.materialApplied&&c.shaderCompiled&&c.gpuWarmed,n=e.filter(t).length,r=0,s=e.filter(c=>!t(c)).map(c=>c.artworkId),a=this.isStagedStartup,o=a?new Set(this.getStartupEntryTargets(this.currentIndex)):null,l=o?e.filter(c=>!o.has(c.index)&&!t(c)).length:0;return{totalArtworks:this.artworks.length,fullyReadyCount:n,pendingCount:this.artworks.length-n,gpuWarmedCount:e.filter(c=>c.gpuWarmed).length,pbrLoadedCount:e.filter(c=>c.pbrLoaded).length,proceduralReadyCount:e.filter(c=>c.proceduralReady).length,memoryCapApplied:!1,preloadMode:a?"staged":"strict",unresolvedArtworkIds:s,deferredArtworkCount:l,overflowArtworkCount:r}}getEntryWarmTargets(e,t){const n=Math.max(1,Math.min(this.artworks.length,Math.round(t)));return this.getBudgetedWarmOrder(e).slice(0,n)}async ensureEntryReadiness(e,t){var n;for(const r of e)await this.preloadAuthoredTextureSet(r,`${t}:critical-now`),(n=this.artworks[r])!=null&&n.textureSet&&this.prefetchedTextureSets.add(r),this.preGenerateProceduralWindow(r,0,`${t}:critical-now`),this.scheduleTextureSetPrefetch(r,`${t}:critical-now`,"critical-now")}getEntryReadinessContract(e){const t=[];for(const n of e){const r=this.readiness[n];if(!r){t.push(n);continue}(!r.albedoLoaded||!r.pbrLoaded||!r.proceduralReady||!r.materialApplied||!r.gpuWarmed)&&t.push(n)}return{ready:t.length===0,pendingIndices:t,targetIndices:[...e]}}warmArtworkForGPU(e,t="gpu-warm"){var u,h;const n=this.now(),r=this.artworks[e],s=this.currentPreset;if(!r||!s)return!1;const a=(u=r.webglImage)!=null?u:r.image,o=this.textureManager.get(a);if(!o)return this.diagnostics.warn("warm-gpu","Cannot warm artwork because albedo is not cached",{index:e,artworkId:r.id}),!1;const l={};if(r.textureSet){const d=r.textureSet.albedo?this.textureManager.getForRole(r.textureSet.albedo.url,"albedo"):void 0;d&&(l.albedo=d);for(const f of yr){const g=r.textureSet[f];if(!g)continue;const v=this.textureManager.getForRole(g.url,f);v&&(l[f]=v)}}const c={albedo:(h=l.albedo)!=null?h:o};for(const d of yr)l[d]?c[d]=l[d]:this.shouldFillRole(d,s)&&(c[d]=this.generateProceduralMap(r.id,d,s));return this.artworkMesh.setPaintingTextures(c,s,r.dimensions),this.markReadiness(e,"proceduralReady",t),this.markReadiness(e,"materialApplied",t),this.diagnostics.debug("warm-gpu","Cached artwork textures bound for GPU warm render",{index:e,artworkId:r.id,activeMaps:this.artworkMesh.material.activeMaps(),reason:t,bindMs:Math.round((this.now()-n)*10)/10}),!0}async preloadAuthoredTextureSet(e,t){const n=this.artworks[e];if(!(n!=null&&n.textureSet))return this.markReadiness(e,"pbrLoaded",t,{pbrMs:0}),{};const r=this.now(),s=await this.textureManager.preloadTextureSet(n.textureSet);return this.markReadiness(e,"pbrLoaded",t,{pbrMs:this.now()-r}),s}generateProceduralMap(e,t,n){const r=n.proceduralInspectionTileSize,a=this.inspectionMode&&r>0&&nv.includes(t)?r:n.proceduralTileSize;return this.procedural.generate(e,t,a)}preGenerateProceduralWindow(e,t,n){var s;const r=this.currentPreset;if(r)for(const a of this.getCriticalWindowIndices(e,t)){const o=this.artworks[a],l=this.now();let c=0;for(const u of yr)(s=o.textureSet)!=null&&s[u]||!this.shouldFillRole(u,r)||(this.generateProceduralMap(o.id,u,r),c+=1);this.markReadiness(a,"proceduralReady",n,{proceduralMs:c>0?this.now()-l:0}),this.diagnostics.debug("procedural-pregenerate","Procedural maps prepared for artwork",{index:a,artworkId:o.id,generated:c,reason:n,radius:t})}}getCriticalWindowIndices(e,t){const n=[],r=new Set,s=a=>{a<0||a>=this.artworks.length||r.has(a)||(r.add(a),n.push(a))};s(e);for(let a=1;a<=t;a+=1)s(e-a),s(e+a);return n}markReadiness(e,t,n,r={}){const s=this.readiness[e];s&&(s[t]=!0,s.lastReason=n,s.updatedAt=this.now(),r.pbrMs!==void 0&&(s.pbrMs=Math.round(r.pbrMs*10)/10),r.proceduralMs!==void 0&&(s.proceduralMs=Math.round(r.proceduralMs*10)/10),r.lastWarmMs!==void 0&&(s.lastWarmMs=Math.round(r.lastWarmMs*10)/10),this.markRenderDirty(2),this.diagnostics.debugLazy("readiness",`Artwork readiness updated: ${t}`,()=>({index:e,artworkId:s.artworkId,stage:t,reason:n,ready:{albedoLoaded:s.albedoLoaded,pbrLoaded:s.pbrLoaded,proceduralReady:s.proceduralReady,materialApplied:s.materialApplied,shaderCompiled:s.shaderCompiled,gpuWarmed:s.gpuWarmed},timings:{pbrMs:s.pbrMs,proceduralMs:s.proceduralMs,lastWarmMs:s.lastWarmMs}})))}now(){return typeof performance!="undefined"?performance.now():Date.now()}logGalleryScaleValidation(){const e=this.artworks.length,t=[4,15,20,50],n=t.reduce((r,s)=>Math.abs(s-e)<Math.abs(r-e)?s:r);this.diagnostics.info("validation","v0.23 gallery-size readiness profile",{artworkCount:e,nearestValidationBucket:n,validationBuckets:t,criticalWindowRadius:Ha,criticalWindow:this.getCriticalWindowIndices(0,Ha),warmOrderPreview:this.getBudgetedWarmOrder(0).slice(0,Math.min(e,12)),readinessLedger:this.getReadinessLedger()})}prefetchAdjacentArtworks(e){for(const t of[-1,1,-2,2]){const n=e+t;n<0||n>=this.artworks.length||this.scheduleTextureSetPrefetch(n,`adjacent:${t}`,"near-next")}}scheduleFullTextureSetPrefetch(){if(this.fullPrefetchScheduled)return;this.fullPrefetchScheduled=!0;let e=0;const t=()=>{var r;for(;e<this.artworks.length&&(!((r=this.artworks[e])!=null&&r.textureSet)||this.prefetchedTextureSets.has(e));)e+=1;if(e>=this.artworks.length){this.diagnostics.info("prefetch-complete","Idle artwork texture-set prefetch sweep complete",{artworkCount:this.artworks.length,prefetched:this.prefetchedTextureSets.size});return}const n=e;e+=1,this.scheduleTextureSetPrefetch(n,"idle-sweep","background",t)};this.scheduleIdle(t,500)}scheduleTextureSetPrefetch(e,t,n,r){const s=this.artworks[e];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(e)||this.activePrefetches.has(e)){r==null||r();return}const a=this.prefetchQueue.find(o=>o.index===e);if(a){gs[n]<gs[a.lane]&&(a.lane=n,a.reason=t,a.enqueuedAt=this.now(),this.sortPrefetchQueue()),r==null||r();return}this.prefetchQueue.push({index:e,reason:t,lane:n,enqueuedAt:this.now(),sequence:this.prefetchSequence++}),this.sortPrefetchQueue(),this.diagnostics.debug("prefetch-queued","Artwork texture-set prefetch queued",{index:e,artworkId:s.id,reason:t,lane:n,queueLength:this.prefetchQueue.length}),this.drainPrefetchQueue(r)}drainPrefetchQueue(e){if(this.prefetchQueueRunning){e==null||e();return}const t=()=>{if(!this.prefetchQueue.length){this.prefetchQueueRunning=!1,e==null||e();return}const n=this.prefetchQueue[0];if(this.interactionActive&&n&&n.lane!=="critical-now"){this.prefetchQueueRunning=!1,this.diagnostics.debug("prefetch-deferred-interaction","Non-critical prefetch paused for active interaction window",{deferredLane:n.lane,queueLength:this.prefetchQueue.length});return}const r=this.prefetchQueue.shift(),s=this.artworks[r.index];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(r.index)){this.scheduleIdle(t,50);return}this.activePrefetches.add(r.index),this.scheduleIdle(()=>{this.diagnostics.debug("prefetch-start","Prefetching artwork texture set",{index:r.index,artworkId:s.id,reason:r.reason,lane:r.lane,queueLength:this.prefetchQueue.length}),this.preloadAuthoredTextureSet(r.index,`prefetch:${r.reason}`).then(()=>{this.prefetchedTextureSets.add(r.index),this.diagnostics.debug("prefetch-complete","Artwork texture set prefetched",{index:r.index,artworkId:s.id,reason:r.reason})}).catch(a=>{this.prefetchedTextureSets.delete(r.index),this.diagnostics.warn("prefetch-failed","Artwork texture-set prefetch failed",{index:r.index,artworkId:s.id,reason:r.reason,message:a instanceof Error?a.message:String(a)})}).finally(()=>{this.activePrefetches.delete(r.index),t()})},250)};this.prefetchQueueRunning=!0,t()}sortPrefetchQueue(){const e=this.now(),t=n=>{const r=e-n.enqueuedAt;return n.lane==="background"&&r>=ev?gs["near-next"]:gs[n.lane]};this.prefetchQueue.sort((n,r)=>{const s=t(n)-t(r);return s!==0?s:n.sequence-r.sequence})}scheduleIdle(e,t){const n=window.requestIdleCallback;if(typeof n=="function"){n(e,{timeout:t});return}window.setTimeout(e,1)}shouldFillRole(e,t){switch(e){case"normal":return!0;case"detailNormal":return t.detailNormalEnabled&&t.detailNormalStrength>0;case"height":return t.bumpStrength>0||t.parallaxEnabled&&t.parallaxScale>0||t.selfShadowEnabled;case"roughness":return t.shaderVariant!=="painting-battery";case"specular":return t.specularStrength>0;case"ao":return t.aoEnabled;default:return!1}}navigate(e){var r,s,a,o;const t=this.currentIndex,n=At((this.currentIndex+e+this.artworks.length)%this.artworks.length,0,this.artworks.length-1);this.diagnostics.info("navigate",`Navigate ${e>0?"forward":"back"}`,{fromIndex:t,toIndex:n,fromArtworkId:(r=this.artworks[t])==null?void 0:r.id,toArtworkId:(s=this.artworks[n])==null?void 0:s.id,direction:e,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:e*fs,seedPositionZ:this.reducedMotion?0:ps,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/xr))}),this.reducedMotion||(this.artworkMesh.group.position.x=e*fs,this.artworkMesh.group.position.z=ps,this.artworkMesh.group.rotation.y=e*hc,this.artworkMesh.group.scale.set(Ui,Ui,Ui)),this.currentIndex=n,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:n,trigger:e>0?"navigate-next":"navigate-prev",startedAt:this.now()},this.promotePrefetchWindow(n,`navigate:${e>0?"next":"prev"}`),this.showArtwork(n),(a=this.frameBudgetNavigationMarker)==null||a.call(this),this.resetView(),(o=this.onNavigateCallback)==null||o.call(this,this.currentIndex)}goTo(e){var s,a,o,l;if(e===this.currentIndex)return;const t=this.currentIndex,n=e>this.currentIndex?1:-1,r=e-this.currentIndex;this.diagnostics.info("navigate","goTo direct navigation",{fromIndex:this.currentIndex,toIndex:e,fromArtworkId:(s=this.artworks[this.currentIndex])==null?void 0:s.id,toArtworkId:(a=this.artworks[e])==null?void 0:a.id,diff:r,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:(r>0?1:-1)*fs,seedPositionZ:this.reducedMotion?0:ps,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/xr))}),this.currentIndex=e,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:e,trigger:"timeline-select",startedAt:this.now()},this.promotePrefetchWindow(e,"timeline-select"),this.reducedMotion||(this.artworkMesh.group.position.x=(r>0?1:-1)*fs,this.artworkMesh.group.position.z=ps,this.artworkMesh.group.rotation.y=n*hc,this.artworkMesh.group.scale.set(Ui,Ui,Ui)),this.showArtwork(e),(o=this.frameBudgetNavigationMarker)==null||o.call(this),this.resetView(),(l=this.onNavigateCallback)==null||l.call(this,this.currentIndex)}setReducedMotion(e){this.reducedMotion=e}handleViewportMetricsChanged(){const e=Math.abs(this.targetZoom-this.lastResetFitZoom)<=Qg,t=this.getViewportMetrics(),n=this.getZoomBounds(t);e?this.targetZoom=n.resetFitZoom:this.targetZoom=At(this.targetZoom,n.minInspectionZoom,n.maxOverviewZoom),this.zoom=At(this.zoom,n.minInspectionZoom,n.maxOverviewZoom),this.lastResetFitZoom=n.resetFitZoom,this.clampPanTargets(t,n),this.markRenderDirty(4),this.diagnostics.info("viewport-refit","Artwork viewport metrics changed",{resetFitZoom:n.resetFitZoom,minInspectionZoom:n.minInspectionZoom,maxOverviewZoom:n.maxOverviewZoom,overviewHeadroom:n.maxOverviewZoom-n.resetFitZoom,wasNearReset:e,viewport:t})}setHoverTarget(e,t){this.targetY===e&&this.targetX===t||(this.targetY=e,this.targetX=t,this.markRenderDirty(2))}onNavigate(e){this.onNavigateCallback=e}get index(){return this.currentIndex}whenArtworkInteractive(e,t){const n=this.readiness[e];if(!n)return Promise.resolve("timeout");const r=()=>n.albedoLoaded&&n.materialApplied&&n.shaderCompiled;return r()?Promise.resolve("ready"):new Promise(s=>{const a=this.now(),o=()=>{if(r()){s("ready");return}if(this.now()-a>=t){s("timeout");return}window.setTimeout(o,50)};window.setTimeout(o,50)})}get artworkAspect(){return this.artworkMesh.artworkAspect}get proceduralFactory(){return this.procedural}update(e){const t=this.artworkMesh.group,n=this.readAnimationSnapshot();let r=0;this.lastUpdateTime>0&&(r=Math.min((e-this.lastUpdateTime)/1e3,Jg)),this.lastUpdateTime=e;const s=this.getViewportMetrics(),a=this.getZoomBounds(s);return this.targetZoom=this.clampZoom(this.targetZoom,a),this.clampPanTargets(s,a),r<=0?this.consumeRenderDirty()||this.animationSnapshotChanged(n):(t.rotation.x=Bt(t.rotation.x,this.targetX,uc,r),t.rotation.y=Bt(t.rotation.y,this.targetY,uc,r),t.position.x=Bt(t.position.x,0,xr,r),t.position.y=Bt(t.position.y,0,xr,r),t.position.z=Bt(t.position.z,0,xr,r),t.scale.x=Bt(t.scale.x,1,za,r),t.scale.y=Bt(t.scale.y,1,za,r),t.scale.z=Bt(t.scale.z,1,za,r),this.zoom=Bt(this.zoom,this.targetZoom,dc,r),this.camera.position.z=Bt(this.camera.position.z,this.zoom,dc,r),this.panX=Bt(this.panX,this.targetPanX,hs,r),this.panY=Bt(this.panY,this.targetPanY,hs,r),this.camera.position.x=Bt(this.camera.position.x,this.panX,hs,r),this.camera.position.y=Bt(this.camera.position.y,this.panY,hs,r),this.consumeRenderDirty()||this.animationSnapshotChanged(n))}resetView(){const e=this.getZoomBounds();this.targetPanX=0,this.targetPanY=0,this.targetZoom=e.resetFitZoom,this.lastResetFitZoom=e.resetFitZoom,this.targetX=0,this.targetY=0,this.markRenderDirty(4)}consumeRenderDirty(){return this.renderDirtyFrames<=0?!1:(this.renderDirtyFrames-=1,!0)}readAnimationSnapshot(){const e=this.artworkMesh.group;return{groupX:e.position.x,groupY:e.position.y,groupZ:e.position.z,groupRotX:e.rotation.x,groupRotY:e.rotation.y,groupScaleX:e.scale.x,groupScaleY:e.scale.y,groupScaleZ:e.scale.z,zoom:this.zoom,cameraX:this.camera.position.x,cameraY:this.camera.position.y,cameraZ:this.camera.position.z,panX:this.panX,panY:this.panY,targetX:this.targetX,targetY:this.targetY,targetZoom:this.targetZoom,targetPanX:this.targetPanX,targetPanY:this.targetPanY}}animationSnapshotChanged(e){const t=this.readAnimationSnapshot();return Object.keys(e).some(n=>{const r=n;return Math.abs(t[r]-e[r])>1e-5})}clampZoom(e,t=this.getZoomBounds()){return At(e,t.minInspectionZoom,t.maxOverviewZoom)}clampPanTargets(e=this.getViewportMetrics(),t=this.getZoomBounds(e)){const n=this.getPanLimits(this.targetZoom,e,t);this.targetPanX=At(this.targetPanX,-n.x,n.x),this.targetPanY=At(this.targetPanY,-n.y,n.y)}getFovTan(){const e=this.camera.fov;return e!==this._fovTanForFov&&(this._fovTanForFov=e,this._fovTanCache=Math.tan($u.degToRad(e*.5))),this._fovTanCache}getPanLimits(e,t=this.getViewportMetrics(),n=this.getZoomBounds(t)){const s=2*At(e,n.minInspectionZoom,n.maxOverviewZoom)*this.getFovTan()*t.usableFracY,a=s*t.effectiveAspect;return{x:Math.max(0,(this.artworkMesh.artworkWidth-a)*.5+lc),y:Math.max(0,(this.artworkMesh.artworkHeight-s)*.5+cc)}}getZoomBounds(e=this.getViewportMetrics()){const t=this.getInspectionMinZoom(e),n=this.getResetFitZoom(e),r=Math.max(Zg,n+Kg);return{minInspectionZoom:At(t,us,n),resetFitZoom:At(n,us,r),maxOverviewZoom:r}}getInspectionMinZoom(e){const t=this.getFovTan(),n=this.artworkMesh.artworkHeight*Ba,r=this.artworkMesh.artworkWidth*Ba,s=n/(2*t*e.usableFracY),a=r/(2*t*this.camera.aspect*e.usableFracX);return At(Math.max(us,s,a),us,_r)}getResetFitZoom(e){const t=this.artworkMesh.artworkWidth+.4,n=this.artworkMesh.artworkHeight+.4,r=this.getFovTan(),s=n*ac/(2*r*e.usableFracY),a=t*ac/(2*r*this.camera.aspect*e.usableFracX),o=Math.max(_r,s,a);return this.isPortraitResetArtwork()?o+oc:o}isPortraitResetArtwork(){return this.artworkMesh.artworkAspect<jg}getViewportMetrics(){var l,c;const e=(c=(l=this.viewportMetricsProvider)==null?void 0:l.call(this))!=null?c:this.getDefaultViewportMetrics(),t=Math.max(1,e.viewportW),n=Math.max(1,e.viewportH),r=At(e.usableW,t*ds,t),s=At(e.usableH,n*ds,n),a=At(e.usableFracX||r/t,ds,1),o=At(e.usableFracY||s/n,ds,1);return{viewportW:t,viewportH:n,usableW:r,usableH:s,usableFracX:a,usableFracY:o,effectiveAspect:Math.max(.1,e.effectiveAspect||r/s),occlusionTop:Math.max(0,e.occlusionTop),occlusionRight:Math.max(0,e.occlusionRight),occlusionBottom:Math.max(0,e.occlusionBottom),occlusionLeft:Math.max(0,e.occlusionLeft)}}getDefaultViewportMetrics(){const e=typeof window!="undefined"?window.innerWidth:1,t=typeof window!="undefined"?window.innerHeight:1;return{viewportW:e,viewportH:t,usableW:e,usableH:t,usableFracX:1,usableFracY:1,effectiveAspect:e/Math.max(1,t),occlusionTop:0,occlusionRight:0,occlusionBottom:0,occlusionLeft:0}}queueProceduralWindow(e,t,n){if(this.getCriticalWindowIndices(e,t).forEach(s=>this.proceduralQueue.add(s)),this.proceduralQueueRunning)return;this.proceduralQueueRunning=!0;const r=()=>{const s=this.proceduralQueue.values().next();if(s.done){this.proceduralQueueRunning=!1;return}const a=s.value;this.proceduralQueue.delete(a),this.scheduleIdle(()=>{this.preGenerateProceduralWindow(a,0,`${n}:queued`),r()},tv)};r()}logNavigationReadinessVerdict(e){const t=this.pendingNavigationProbe;if(!t||t.toIndex!==e)return;this.pendingNavigationProbe=null;const n=t.readinessBefore;if(!n)return;const r=this.readiness[e];if(!r)return;const s=!n.pbrLoaded,a=!n.proceduralReady,o=!n.gpuWarmed,l=s||a||o;this.diagnostics.info(l?"cold-path-detected":"hot-path-confirmed",l?"Navigation required remaining readiness work":"Navigation stayed on prepared hot path",{trigger:t.trigger,fromIndex:t.fromIndex,toIndex:t.toIndex,durationMs:Math.round((this.now()-t.startedAt)*10)/10,cold:{pbr:s,procedural:a,gpu:o},readiness:r})}}class rv{constructor(e){y(this,"el");y(this,"helpBtn");y(this,"infoBtn");y(this,"backBtn");y(this,"onHelpClick");y(this,"onInfoClick");y(this,"onBackClick");this.el=document.createElement("header"),this.el.className="topbar",this.el.setAttribute("role","banner");const t=document.createElement("div");t.className="topbar__left",this.backBtn=document.createElement("button"),this.backBtn.className="topbar__back-btn",this.backBtn.setAttribute("aria-label","Zurück zum Museum"),this.backBtn.innerHTML=`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      <span class="topbar__back-btn-label topbar__back-btn-label--full">Zurück zum Museum</span>
      <span class="topbar__back-btn-label topbar__back-btn-label--short">Museum</span>
    `,this.backBtn.addEventListener("click",()=>{var s;this.backBtn.disabled||(s=this.onBackClick)==null||s.call(this)});const n=document.createElement("div");n.className="topbar__brand-group",n.innerHTML=`
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `,t.appendChild(this.backBtn),t.appendChild(n),this.el.appendChild(t);const r=document.createElement("div");r.className="topbar__right",this.infoBtn=document.createElement("button"),this.infoBtn.className="topbar__chrome-btn",this.infoBtn.setAttribute("aria-label","Werkinformationen einblenden"),this.infoBtn.innerHTML=`
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span class="topbar__chrome-btn-label">Info</span>
    `,this.infoBtn.addEventListener("click",()=>{var s;return(s=this.onInfoClick)==null?void 0:s.call(this)}),this.helpBtn=document.createElement("button"),this.helpBtn.className="topbar__help-btn",this.helpBtn.setAttribute("aria-label","Tastaturkürzel anzeigen"),this.helpBtn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',this.helpBtn.addEventListener("click",()=>{var s;return(s=this.onHelpClick)==null?void 0:s.call(this)}),r.appendChild(this.infoBtn),r.appendChild(this.helpBtn),this.el.appendChild(r),e.appendChild(this.el)}setBackBusy(e){this.backBtn.disabled=e,this.backBtn.setAttribute("aria-busy",e?"true":"false")}dispose(){this.el.remove()}}const zs=class zs{constructor(e,t){y(this,"el");y(this,"eyebrow");y(this,"title");y(this,"meta");y(this,"description");y(this,"credit");this.el=document.createElement("section"),this.el.className="info-panel",this.el.setAttribute("aria-live","polite"),this.el.setAttribute("aria-label","Informationen zum aktuellen Werk"),this.eyebrow=document.createElement("p"),this.eyebrow.className="info-panel__eyebrow",this.title=document.createElement("h1"),this.title.className="info-panel__title",this.meta=document.createElement("p"),this.meta.className="info-panel__meta",this.description=document.createElement("p"),this.description.className="info-panel__description",this.credit=document.createElement("p"),this.credit.className="info-panel__credit",this.el.append(this.eyebrow,this.title,this.meta,this.description,this.credit),e.appendChild(this.el),this.update(t)}update(e,t=!1){t?(this.el.classList.add("is-transitioning"),window.setTimeout(()=>{this.setContent(e),window.requestAnimationFrame(()=>{this.el.classList.remove("is-transitioning")})},zs.CONTENT_SWAP_DELAY_MS)):this.setContent(e)}setCompact(e){this.el.classList.toggle("info-panel--compact",e)}setContent(e){this.eyebrow.textContent=`${e.subtitle} · ${e.year}`,this.title.textContent=e.title,this.meta.textContent=[e.medium,e.surface].filter(Boolean).join(" · "),this.description.textContent=e.description,this.credit.textContent=`© ${e.credit}`}dispose(){this.el.remove()}};y(zs,"CONTENT_SWAP_DELAY_MS",520);let Ga=zs;const Sn=class Sn{constructor(e){y(this,"el");y(this,"prevBtn");y(this,"nextBtn");y(this,"onPrevCallback",null);y(this,"onNextCallback",null);y(this,"hintIdleTimer",null);y(this,"hintAnimationTimer",null);y(this,"hintDismissed",!1);y(this,"hintStarted",!1);y(this,"hintKeydownListener",null);y(this,"onHintStartCallback",null);y(this,"onHintFinishedCallback",null);this.el=document.createElement("nav"),this.el.className="nav-controls",this.el.setAttribute("aria-label","Galerie-Navigation"),this.prevBtn=document.createElement("button"),this.prevBtn.className="nav-btn",this.prevBtn.setAttribute("aria-label","Vorheriges Werk"),this.prevBtn.textContent="←",this.prevBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onPrevCallback)==null||t.call(this)}),this.nextBtn=document.createElement("button"),this.nextBtn.className="nav-btn",this.nextBtn.setAttribute("aria-label","Nächstes Werk"),this.nextBtn.textContent="→",this.nextBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onNextCallback)==null||t.call(this)}),this.el.appendChild(this.prevBtn),this.el.appendChild(this.nextBtn),e.appendChild(this.el)}onHintStart(e){this.onHintStartCallback=e}onHintFinished(e){this.onHintFinishedCallback=e}setHiddenMode(e){this.el.classList.toggle("nav-controls--hidden",e)}enableIdleHint(){if(this.hintStarted||(this.hintStarted=!0,this.readHintSeen())||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;this.hintIdleTimer=window.setTimeout(()=>{var t;this.hintIdleTimer=null,this.hintDismissed||((t=this.onHintStartCallback)==null||t.call(this),document.documentElement.dataset.navHint="active",this.hintAnimationTimer=window.setTimeout(()=>{var n;this.hintAnimationTimer=null,this.hintDismissed||(delete document.documentElement.dataset.navHint,(n=this.onHintFinishedCallback)==null||n.call(this))},Sn.HINT_ANIM_DURATION_MS))},Sn.HINT_IDLE_DELAY_MS);const e=()=>this.dismissHint();this.prevBtn.addEventListener("pointerenter",e,{once:!0}),this.nextBtn.addEventListener("pointerenter",e,{once:!0}),this.prevBtn.addEventListener("focus",e,{once:!0}),this.nextBtn.addEventListener("focus",e,{once:!0}),this.hintKeydownListener=t=>{(t.key==="ArrowLeft"||t.key==="ArrowRight")&&this.dismissHint()},document.addEventListener("keydown",this.hintKeydownListener)}dismissHint(){var e;if(!this.hintDismissed){this.hintDismissed=!0,this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),delete document.documentElement.dataset.navHint,this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),(e=this.onHintFinishedCallback)==null||e.call(this);try{localStorage.setItem(Sn.HINT_STORAGE_KEY,"1")}catch(t){}}}readHintSeen(){try{return localStorage.getItem(Sn.HINT_STORAGE_KEY)==="1"}catch(e){return!1}}onPrev(e){this.onPrevCallback=e}onNext(e){this.onNextCallback=e}dispose(){this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),delete document.documentElement.dataset.navHint,this.el.remove()}};y(Sn,"HINT_STORAGE_KEY","freyraum-nav-hint-seen"),y(Sn,"HINT_IDLE_DELAY_MS",5e3),y(Sn,"HINT_ANIM_DURATION_MS",3*1600+300);let Va=Sn;class sv{constructor(e){y(this,"el");this.el=document.createElement("p"),this.el.className="hint-text",this.el.setAttribute("aria-hidden","true"),this.updateHint(),e.appendChild(this.el)}updateHint(){var t;const e=(t=document.documentElement.dataset.pointerPrimary)!=null?t:"fine";this.el.textContent=e==="coarse"?"Wischen zum Navigieren · Zwei Finger zum Zoomen.":"Scrollen zum Zoomen · Ziehen zum freien Bewegen."}dispose(){this.el.remove()}}const fc=.6;class av{constructor(e,t){y(this,"el");y(this,"galleryManager");this.galleryManager=t,this.el=document.createElement("div"),this.el.className="zoom-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Zoom-Steuerung");const n=this.createButton("zoom-controls__btn","Vergrößern","＋",()=>{this.galleryManager.addZoomDelta(-fc)}),r=this.createButton("zoom-controls__btn","Verkleinern","−",()=>{this.galleryManager.addZoomDelta(fc)}),s=this.createButton("zoom-controls__btn zoom-controls__btn--reset","Ansicht zurücksetzen","⟲",()=>{this.galleryManager.resetView()});this.el.append(n,r,s),e.appendChild(this.el)}createButton(e,t,n,r){const s=document.createElement("button");s.type="button",s.className=e,s.setAttribute("aria-label",t);const a=document.createElement("span");return a.className="zoom-controls__icon",a.setAttribute("aria-hidden","true"),a.textContent=n,s.appendChild(a),s.addEventListener("click",r),s}dispose(){this.el.remove()}}class ov{constructor(e,t=document.documentElement){y(this,"btn");y(this,"target");y(this,"toggle",()=>{if(!document.fullscreenEnabled){this.btn.setAttribute("aria-disabled","true");return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.target.requestFullscreen().catch(()=>{})});y(this,"handleChange",()=>{const e=!!document.fullscreenElement;this.btn.setAttribute("aria-pressed",e?"true":"false"),document.documentElement.dataset.presentation=e?"on":"off"});this.target=t,this.btn=document.createElement("button"),this.btn.type="button",this.btn.className="fullscreen-btn",this.btn.setAttribute("aria-pressed","false"),this.btn.setAttribute("aria-label","Vollbild umschalten"),this.btn.innerHTML=`
      <span class="fullscreen-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path class="fullscreen-btn__enter" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path class="fullscreen-btn__exit" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        </svg>
      </span>
    `,this.btn.addEventListener("click",this.toggle),document.addEventListener("fullscreenchange",this.handleChange),e.appendChild(this.btn)}dispose(){this.btn.removeEventListener("click",this.toggle),document.removeEventListener("fullscreenchange",this.handleChange),this.btn.remove()}}const Yn=.3;function vs(i){return Math.max(0,Math.min(100,i))/100*Yn}function _s(i){const e=Math.max(0,Math.min(Yn,i));return e<=0?0:Math.round(e/Yn*100)}const ki=vs(50);class lv{constructor(e,t){y(this,"root");y(this,"trigger");y(this,"panel");y(this,"isOpen",!1);y(this,"unsubscribe");y(this,"audioStatusMessage",null);y(this,"motionInput",null);y(this,"contrastInput",null);y(this,"chromeInput",null);y(this,"audioMutedInput",null);y(this,"audioVolumeInput",null);y(this,"audioValueLabel",null);y(this,"audioStatusEl",null);y(this,"isVolumeDragging",!1);y(this,"handleToggle",()=>{this.setOpen(!this.isOpen)});y(this,"handleOutsideClick",e=>{this.isOpen&&(this.root.contains(e.target)||(this.setOpen(!1),this.trigger.focus()))});y(this,"handleEscape",e=>{e.key==="Escape"&&this.isOpen&&(e.preventDefault(),e.stopPropagation(),this.setOpen(!1),this.trigger.focus())});this.prefs=t,this.root=document.createElement("div"),this.root.className="prefs",this.trigger=document.createElement("button"),this.trigger.type="button",this.trigger.className="prefs__trigger",this.trigger.setAttribute("aria-haspopup","true"),this.trigger.setAttribute("aria-expanded","false"),this.trigger.setAttribute("aria-controls","freyraum-prefs-panel"),this.trigger.setAttribute("aria-label","Einstellungen öffnen"),this.trigger.innerHTML=`
      <span class="prefs__trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
        </svg>
      </span>
    `,this.trigger.addEventListener("click",this.handleToggle),this.panel=document.createElement("div"),this.panel.id="freyraum-prefs-panel",this.panel.className="prefs__panel",this.panel.setAttribute("role","dialog"),this.panel.setAttribute("aria-labelledby","freyraum-prefs-heading"),this.panel.setAttribute("aria-modal","true"),this.panel.hidden=!0,this.buildPanel(),this.root.append(this.trigger,this.panel),e.appendChild(this.root),document.addEventListener("click",this.handleOutsideClick),document.addEventListener("keydown",this.handleEscape),this.unsubscribe=this.prefs.subscribe(()=>this.patchPanel())}buildPanel(){var c;const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:r,audioVolume:s,alwaysShowChrome:a}=this.prefs.current,o=Object.values(gr).map(u=>`
          <label class="prefs__radio">
            <input type="radio" name="freyraum-quality" value="${u.id}" ${n===u.id?"checked":""} />
            <span class="prefs__radio-label">
              <span class="prefs__radio-title">${u.label}</span>
              <span class="prefs__radio-desc">${u.description}</span>
            </span>
          </label>
        `).join(""),l=_s(s);this.panel.innerHTML=`
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
    `,this.motionInput=this.panel.querySelector("#freyraum-motion"),this.contrastInput=this.panel.querySelector("#freyraum-contrast"),this.chromeInput=this.panel.querySelector("#freyraum-chrome"),this.audioMutedInput=this.panel.querySelector("#freyraum-audio-muted"),this.audioVolumeInput=this.panel.querySelector("#freyraum-audio-volume"),this.audioValueLabel=this.panel.querySelector("#freyraum-audio-volume-label"),this.audioStatusEl=this.panel.querySelector("#freyraum-audio-status"),this.bindPanelEvents()}bindPanelEvents(){var e,t,n,r;if((e=this.motionInput)==null||e.addEventListener("change",s=>{this.prefs.setReducedMotion(s.target.checked)}),(t=this.contrastInput)==null||t.addEventListener("change",s=>{this.prefs.setContrastMode(s.target.checked?"high":"auto")}),(n=this.chromeInput)==null||n.addEventListener("change",s=>{this.prefs.setAlwaysShowChrome(s.target.checked)}),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(s=>{s.addEventListener("change",()=>{s.checked&&this.prefs.setQuality(s.value)})}),(r=this.audioMutedInput)==null||r.addEventListener("change",s=>{this.prefs.setAudioMuted(s.target.checked)}),this.audioVolumeInput){const s=this.audioVolumeInput;s.addEventListener("pointerdown",()=>{this.isVolumeDragging=!0}),s.addEventListener("pointerup",()=>{this.isVolumeDragging=!1}),s.addEventListener("pointercancel",()=>{this.isVolumeDragging=!1}),s.addEventListener("input",()=>{const a=Number(s.value);if(Number.isNaN(a))return;this.audioValueLabel&&(this.audioValueLabel.textContent=`${Math.round(a)}%`);const o=Math.round(a);s.style.setProperty("--volume-pct",`${o}%`),s.setAttribute("aria-valuetext",`${o} Prozent`),this.prefs.setAudioVolume(vs(a))}),s.addEventListener("change",()=>{this.isVolumeDragging=!1;const a=Number(s.value);Number.isNaN(a)||this.prefs.setAudioVolume(vs(a))})}}patchPanel(){const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:r,audioVolume:s,alwaysShowChrome:a}=this.prefs.current;if(this.motionInput&&(this.motionInput.checked=e),this.contrastInput&&(this.contrastInput.checked=t==="high"),this.chromeInput&&(this.chromeInput.checked=a),this.audioMutedInput&&(this.audioMutedInput.checked=r),!this.isVolumeDragging&&this.audioVolumeInput&&this.audioValueLabel){const o=_s(s);this.audioVolumeInput.value=String(o),this.audioVolumeInput.style.setProperty("--volume-pct",`${o}%`),this.audioVolumeInput.setAttribute("aria-valuetext",`${o} Prozent`),this.audioValueLabel.textContent=`${o}%`}this.audioStatusEl&&(this.audioStatusMessage?(this.audioStatusEl.textContent=this.audioStatusMessage,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden","")),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(o=>{o.checked=o.value===n})}setAudioStatusMessage(e){this.audioStatusMessage=e,this.audioStatusEl&&(e?(this.audioStatusEl.textContent=e,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden",""))}setOpen(e){var t;this.isOpen=e,this.trigger.setAttribute("aria-expanded",e?"true":"false"),this.panel.hidden=!e,e&&((t=this.panel.querySelector("input"))==null||t.focus())}dispose(){document.removeEventListener("click",this.handleOutsideClick),document.removeEventListener("keydown",this.handleEscape),this.unsubscribe(),this.root.remove()}}const cv={INFO_PANEL_TRIGGER_BAND_PX:120,NAV_TRIGGER_BAND_PX:220,HIDE_DELAY_MS:2500,NAV_HIDE_DELAY_MS:2e3,TOUCH_REVEAL_DURATION_MS:4e3,FORCE_REVEAL_DURATION_MS:3200,IOS_EDGE_DEAD_ZONE_PX:22,INFO_PANEL_TOUCH_MAX_PX:80};class uv{constructor(e,t,n,r={}){y(this,"diag",Zt("chrome-visibility"));y(this,"config");y(this,"options");y(this,"infoPanelEl");y(this,"prefs");y(this,"appRoot");y(this,"infoPanelPeekHit",null);y(this,"srStatusEl",null);y(this,"panels",new Map);y(this,"boundOnPointerMove");y(this,"boundOnPointerDown");y(this,"boundOnKeyDown");y(this,"boundOnViewportLeave");y(this,"unsubscribePrefs",null);y(this,"initialised",!1);y(this,"settleTimer",null);this.infoPanelEl=e,this.prefs=t,this.appRoot=n,this.options=r,this.config={...cv,...r.config},this.boundOnPointerMove=this.onPointerMove.bind(this),this.boundOnPointerDown=this.onPointerDown.bind(this),this.boundOnKeyDown=this.onKeyDown.bind(this),this.boundOnViewportLeave=this.onViewportLeave.bind(this)}init(){if(!this.initialised){this.initialised=!0,this.panels.set("info-panel",this.createPanelState("info-panel",this.infoPanelEl,"Werkinformationen")),this.applyMode(this.currentMode()),this.createPeekElements(),this.createSrStatusElement(),window.addEventListener("pointermove",this.boundOnPointerMove,{passive:!0}),window.addEventListener("pointerdown",this.boundOnPointerDown,{passive:!0}),document.addEventListener("keydown",this.boundOnKeyDown,{passive:!0}),document.addEventListener("mouseleave",this.boundOnViewportLeave,{passive:!0}),window.addEventListener("blur",this.boundOnViewportLeave,{passive:!0});for(const e of this.panels.values())e.el.addEventListener("focusin",e.onFocusIn),e.el.addEventListener("focusout",e.onFocusOut),e.el.addEventListener("pointerenter",e.onPointerEnter),e.el.addEventListener("pointerleave",e.onPointerLeave);this.unsubscribePrefs=this.prefs.subscribe(()=>this.applyMode(this.currentMode())),this.diag.info("init","ChromeVisibilityManager initialised",{mode:this.currentMode()})}}dispose(){var e,t,n;if(this.initialised){this.initialised=!1,window.removeEventListener("pointermove",this.boundOnPointerMove),window.removeEventListener("pointerdown",this.boundOnPointerDown),document.removeEventListener("keydown",this.boundOnKeyDown),document.removeEventListener("mouseleave",this.boundOnViewportLeave),window.removeEventListener("blur",this.boundOnViewportLeave),(e=this.unsubscribePrefs)==null||e.call(this),this.unsubscribePrefs=null;for(const r of this.panels.values())r.hideTimerId!==null&&clearTimeout(r.hideTimerId),r.el.removeEventListener("focusin",r.onFocusIn),r.el.removeEventListener("focusout",r.onFocusOut),r.el.removeEventListener("pointerenter",r.onPointerEnter),r.el.removeEventListener("pointerleave",r.onPointerLeave);this.panels.clear(),(t=this.infoPanelPeekHit)==null||t.remove(),(n=this.srStatusEl)==null||n.remove(),this.infoPanelPeekHit=null,this.srStatusEl=null,this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null),this.diag.info("dispose","ChromeVisibilityManager disposed")}}forceReveal(e){!this.initialised||this.currentMode()==="visible"||!this.panels.get(e)||(this.reveal(e,"forced"),this.scheduleHide(e,this.config.FORCE_REVEAL_DURATION_MS),this.diag.debug("force-reveal","Panel force-revealed",{panelId:e}))}registerNavControls(e,t){if(!this.initialised){this.diag.warn("register-nav","registerNavControls called before init() — ignored");return}if(this.panels.has("nav-controls")){this.diag.warn("register-nav","Nav controls already registered — ignored");return}const n=this.createPanelState("nav-controls",e,"Navigation");this.panels.set("nav-controls",n),e.addEventListener("focusin",n.onFocusIn),e.addEventListener("focusout",n.onFocusOut),e.addEventListener("pointerenter",n.onPointerEnter),e.addEventListener("pointerleave",n.onPointerLeave),this.currentMode()==="visible"&&this.reveal("nav-controls","preference"),t.onHintStart(()=>{this.reveal("nav-controls","hint"),this.diag.debug("nav-hint-start","Nav controls revealed for onboarding hint")}),t.onHintFinished(()=>{const r=this.panels.get("nav-controls");r&&(this.currentMode()==="clean"&&this.shouldHide(r)&&(this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-hint-dismiss","Nav hint finished; scheduled re-hide",{delay:this.config.NAV_HIDE_DELAY_MS})),this.triggerAffordanceSettle())}),this.diag.info("register-nav","Nav controls registered as managed chrome surface",{mode:this.currentMode()})}triggerAffordanceSettle(){window.matchMedia("(prefers-reduced-motion: reduce)").matches||(this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling")),this.appRoot.classList.add("affordance-settling"),this.diag.debug("affordance-settle-start","Affordance settle phase started"),this.settleTimer=window.setTimeout(()=>{this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null,this.diag.debug("affordance-settle-end","Affordance settle phase complete")},2100))}currentMode(){return this.prefs.current.alwaysShowChrome?"visible":"clean"}createPanelState(e,t,n){return{id:e,el:t,label:n,revealed:!1,reason:null,hideTimerId:null,focusActive:!1,pointerInZone:!1,pointerInPanel:!1,onFocusIn:()=>this.onPanelFocusIn(e),onFocusOut:()=>this.onPanelFocusOut(e),onPointerEnter:()=>this.onPanelPointerEnter(e),onPointerLeave:()=>this.onPanelPointerLeave(e)}}applyMode(e){if(document.documentElement.dataset.chromeMode=e,e==="visible")for(const t of this.panels.keys())this.reveal(t,"preference");else for(const t of this.panels.values())this.shouldHide(t)&&this.hide(t.id)}reveal(e,t){var r,s;const n=this.panels.get(e);n&&(n.hideTimerId!==null&&(clearTimeout(n.hideTimerId),n.hideTimerId=null),!(n.revealed&&n.reason===t)&&(n.el.classList.add("is-revealed"),n.revealed=!0,n.reason=t,this.announceToScreenReader(n,!0),(s=(r=this.options).onRevealChange)==null||s.call(r,e,!0,t),this.diag.debug("reveal","Panel revealed",{panelId:e,reason:t})))}hide(e){var n,r;const t=this.panels.get(e);t&&(t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),t.revealed&&(t.el.classList.remove("is-revealed"),t.revealed=!1,t.reason=null,this.announceToScreenReader(t,!1),(r=(n=this.options).onRevealChange)==null||r.call(n,e,!1,null),this.diag.debug("hide","Panel hidden",{panelId:e})))}scheduleHide(e,t=this.config.HIDE_DELAY_MS){const n=this.panels.get(e);n&&(n.hideTimerId!==null&&clearTimeout(n.hideTimerId),n.hideTimerId=setTimeout(()=>this.hide(e),t))}shouldHide(e){return!e.pointerInZone&&!e.pointerInPanel&&!e.focusActive}onPointerMove(e){if(this.currentMode()==="visible"||e.pointerType==="touch")return;const t=e.clientX,n=e.clientY,r=window.innerHeight;this.updateZone("info-panel",t<=this.config.INFO_PANEL_TRIGGER_BAND_PX),this.panels.has("nav-controls")&&this.updateZone("nav-controls",n>=r-this.config.NAV_TRIGGER_BAND_PX,this.config.NAV_HIDE_DELAY_MS)}onPointerDown(e){if(e.pointerType==="mouse"||this.currentMode()==="visible")return;const t=e.clientX;t>=this.config.IOS_EDGE_DEAD_ZONE_PX&&t<=this.config.INFO_PANEL_TOUCH_MAX_PX&&(this.reveal("info-panel","touch"),this.scheduleHide("info-panel",this.config.TOUCH_REVEAL_DURATION_MS))}onViewportLeave(){if(this.currentMode()!=="visible")for(const e of this.panels.keys())this.updateZone(e,!1)}onKeyDown(e){if(this.currentMode()==="visible"||((e.key==="ArrowLeft"||e.key==="ArrowRight")&&this.panels.has("nav-controls")&&(this.reveal("nav-controls","keyboard"),this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-keyboard-reveal","Nav controls revealed by keyboard",{key:e.key})),e.key!=="Escape"))return;let t=!1;for(const n of this.panels.values())n.revealed&&!n.el.contains(document.activeElement)&&(this.hide(n.id),t=!0);t&&this.diag.debug("escape-dismiss","Chrome dismissed via Escape")}onPanelFocusIn(e){const t=this.panels.get(e);t&&(t.focusActive=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),this.currentMode()==="clean"&&this.reveal(e,"focus"))}onPanelFocusOut(e){requestAnimationFrame(()=>{const t=this.panels.get(e);t&&(t.el.contains(document.activeElement)||(t.focusActive=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e)))})}onPanelPointerEnter(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null))}onPanelPointerLeave(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e))}updateZone(e,t,n){const r=this.panels.get(e);r&&t!==r.pointerInZone&&(r.pointerInZone=t,t?this.reveal(e,"proximity"):this.shouldHide(r)&&this.scheduleHide(e,n))}createPeekElements(){const e=this.makeEl("div","info-panel-chevron");this.infoPanelPeekHit=this.makeEl("div","info-panel-peek-hit",[this.makeEl("div","info-panel-peek"),e]),this.infoPanelPeekHit.setAttribute("aria-hidden","true"),this.appRoot.appendChild(this.infoPanelPeekHit),this.diag.debug("peek-affordances-created","Visual chrome affordances mounted",{infoPanel:["info-panel-peek","info-panel-chevron"]})}createSrStatusElement(){this.srStatusEl=this.makeEl("div","sr-only"),this.srStatusEl.id="freyraum-chrome-status",this.srStatusEl.setAttribute("aria-live","polite"),this.srStatusEl.setAttribute("aria-atomic","true"),this.appRoot.appendChild(this.srStatusEl)}announceToScreenReader(e,t){this.srStatusEl&&(this.srStatusEl.textContent=t?`${e.label} eingeblendet`:"")}makeEl(e,t,n=[]){const r=document.createElement(e);r.className=t;for(const s of n)r.appendChild(s);return r}}const xs=Zt("audio-controls");class dv{constructor(e,t,n){y(this,"el");y(this,"muteBtn");y(this,"volumeInput");y(this,"unsubscribe");y(this,"currentState");y(this,"handleMuteClick",()=>{const{muted:e,playing:t,autoplayBlocked:n,available:r}=this.currentState;r&&(e?(this.prefs.setAudioMuted(!1),xs.info("user-unmute","User unmuted audio via main-page control")):t?(this.prefs.setAudioMuted(!0),xs.info("user-mute","User muted audio via main-page control")):(this.audioManager.play("user-activate"),xs.info("user-activate","User activated audio via main-page control",{autoplayBlocked:n})))});y(this,"handleVolumeInput",()=>{const e=Number(this.volumeInput.value);if(Number.isNaN(e))return;const t=Math.round(e);this.volumeInput.style.setProperty("--volume-pct",`${t}%`),this.volumeInput.setAttribute("aria-valuenow",String(t)),this.volumeInput.setAttribute("aria-valuetext",`${t} Prozent`);const n=vs(e);this.prefs.setAudioVolume(n),xs.debug("user-volume","User adjusted volume via main-page slider",{displayPct:e,gain:n})});this.prefs=t,this.audioManager=n,this.currentState=n.getState(),this.el=document.createElement("div"),this.el.className="audio-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Hintergrundmusik"),this.muteBtn=document.createElement("button"),this.muteBtn.type="button",this.muteBtn.className="audio-controls__btn",this.muteBtn.addEventListener("click",this.handleMuteClick);const r=document.createElement("div");r.className="audio-controls__slider-wrap",this.volumeInput=document.createElement("input"),this.volumeInput.type="range",this.volumeInput.className="audio-controls__slider",this.volumeInput.min="0",this.volumeInput.max="100",this.volumeInput.step="1",this.volumeInput.setAttribute("aria-label","Lautstärke"),this.volumeInput.addEventListener("input",this.handleVolumeInput),r.appendChild(this.volumeInput),this.el.append(this.muteBtn,r),e.appendChild(this.el),this.unsubscribe=n.subscribe(s=>this.update(s))}update(e){if(this.currentState=e,this.el.hidden=!e.available,!e.available)return;const t=e.muted,n=e.autoplayBlocked,r=e.playing;this.muteBtn.classList.toggle("audio-controls__btn--muted",t),this.muteBtn.classList.toggle("audio-controls__btn--blocked",n&&!t),this.muteBtn.classList.toggle("audio-controls__btn--playing",r&&!t);let s;n&&!t?s="Klicken zum Aktivieren der Hintergrundmusik":t?s="Ton einschalten":r?s="Ton ausschalten":s="Hintergrundmusik abspielen",this.muteBtn.setAttribute("aria-label",s),this.muteBtn.setAttribute("aria-pressed",r&&!t?"true":"false"),this.muteBtn.innerHTML=`
      <span class="audio-controls__btn-icon" aria-hidden="true">
        ${t?fv:n?pv:hv}
      </span>
      ${n&&!t?'<span class="audio-controls__indicator" aria-hidden="true"></span>':""}
    `;const a=_s(e.targetVolume);this.volumeInput.value=String(a),this.volumeInput.disabled=t,this.volumeInput.setAttribute("aria-valuenow",String(a)),this.volumeInput.setAttribute("aria-valuetext",`${a} Prozent`),this.volumeInput.style.setProperty("--volume-pct",`${a}%`)}dispose(){this.unsubscribe(),this.el.remove()}}const hv=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`,fv=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`,pv=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="15" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/>
  </svg>`;function mv(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Wa(i,e,t){var h,d,f;const n=Li(),r=document.createElement("section");r.className="fallback-screen",r.setAttribute("role","alert"),r.setAttribute("aria-live","assertive"),t&&t.trim()&&(r.style.backgroundColor=t.trim());const a=((f=(d=(h=window.matchMedia)==null?void 0:h.call(window,"(pointer: coarse)"))==null?void 0:d.matches)!=null?f:!1)?`<p class="fallback-screen__body">
        Tipp: Deaktivieren Sie den privaten Browser-Modus und stellen Sie
        sicher, dass Hardware-Beschleunigung aktiviert ist.
       </p>`:"",l=n.getMode()!=="default"?`<p class="fallback-screen__detail">Technischer Hinweis: ${mv(e)}</p>`:"";r.innerHTML=`
    <div class="fallback-screen__card">
      <p class="fallback-screen__eyebrow">freyraum</p>
      <h1 class="fallback-screen__title">3D-Vorschau nicht verfügbar</h1>
      <p class="fallback-screen__body">
        Für die immersive Galerie wird WebGL benötigt. Bitte aktivieren Sie
        Hardware-Beschleunigung oder öffnen Sie die Vorschau in einem aktuellen
        Browser (Chrome, Edge, Firefox oder Safari).
      </p>
      ${a}
      ${l}
    </div>
  `,i.appendChild(r);const c=getComputedStyle(document.documentElement),u=getComputedStyle(r);n.info("fallback","surface-snapshot","Fallback surface colors resolved",{requestedSurfaceColor:t!=null?t:null,rootGalleryWall:c.getPropertyValue("--color-gallery-wall").trim(),rootMuseumWall:c.getPropertyValue("--color-museum-wall").trim(),fallbackBackgroundColor:u.backgroundColor,fallbackBackgroundImage:u.backgroundImage})}const pc=20,br=5;class gv{constructor(e,t){y(this,"diagnostics",Li());y(this,"el");y(this,"listEl");y(this,"counterEl");y(this,"prevButton");y(this,"nextButton");y(this,"artworks");y(this,"items",[]);y(this,"thumbs",[]);y(this,"virtualized");y(this,"currentIndex",0);y(this,"renderedStart",-1);y(this,"renderedEnd",-1);y(this,"onSelectCallback",null);y(this,"onPreviewCallback",null);y(this,"handleThumbKey",e=>{var r;const t=e.currentTarget,n=Number((r=t.dataset.index)!=null?r:"0");switch(e.key){case"ArrowRight":case"ArrowDown":e.preventDefault(),this.focusThumb((n+1)%this.artworks.length);break;case"ArrowLeft":case"ArrowUp":e.preventDefault(),this.focusThumb((n-1+this.artworks.length)%this.artworks.length);break;case"Home":e.preventDefault(),this.focusThumb(0);break;case"End":e.preventDefault(),this.focusThumb(this.artworks.length-1);break;case"Enter":case" ":{e.key===" "&&e.preventDefault();break}}});y(this,"onPrevPage",()=>{this.listEl.scrollBy({left:-this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});y(this,"onNextPage",()=>{this.listEl.scrollBy({left:this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});y(this,"onScroll",()=>{this.renderWindowFromScroll(),this.updateScrollState()});y(this,"onResize",()=>{this.virtualized&&this.renderWindowAround(this.currentIndex),this.updateScrollState()});this.artworks=t,this.virtualized=t.length>pc,this.el=document.createElement("nav"),this.el.className="timeline",this.el.setAttribute("aria-label","Werke der Ausstellung"),this.prevButton=this.createArrowButton("prev","Vorherige Werke anzeigen","‹"),this.nextButton=this.createArrowButton("next","Weitere Werke anzeigen","›"),this.counterEl=document.createElement("div"),this.counterEl.className="timeline__counter",this.counterEl.setAttribute("aria-live","polite");const n=document.createElement("ul");n.className="timeline__list",n.setAttribute("role","list"),this.listEl=n,this.el.append(this.prevButton,n,this.nextButton,this.counterEl),t.forEach((r,s)=>{const a=document.createElement("li");a.className="timeline__item",a.dataset.index=String(s),this.items.push(a),this.thumbs.push(null),n.appendChild(a)}),this.virtualized?(this.renderWindowAround(0),this.diagnostics.info("timeline","virtualization-enabled","Timeline virtual rendering enabled",{artworkCount:t.length,threshold:pc,buffer:br})):t.forEach((r,s)=>this.ensureThumb(s)),this.prevButton.addEventListener("click",this.onPrevPage),this.nextButton.addEventListener("click",this.onNextPage),this.listEl.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("resize",this.onResize,{passive:!0}),e.appendChild(this.el),this.setActive(0),this.updateScrollState(),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>this.centerThumb(0,"auto")))}createArrowButton(e,t,n){const r=document.createElement("button");return r.type="button",r.className=`timeline__arrow timeline__arrow--${e}`,r.setAttribute("aria-label",t),r.textContent=n,r}ensureThumb(e){if(e<0||e>=this.artworks.length)return null;const t=this.thumbs[e];if(t)return t;const n=this.artworks[e],r=this.items[e],s=document.createElement("button");s.type="button",s.className="timeline__thumb",s.setAttribute("aria-label",`${n.subtitle}: ${n.title}`),s.setAttribute("aria-pressed",e===this.currentIndex?"true":"false"),s.setAttribute("aria-current",e===this.currentIndex?"true":"false"),s.setAttribute("data-index",String(e)),s.tabIndex=e===this.currentIndex?0:-1;const a=n.dimensions.width/n.dimensions.height,o=document.createElement("span");o.className="timeline__frame",o.style.setProperty("--thumb-aspect",String(a.toFixed(4)));const l=document.createElement("span");l.className="timeline__skeleton",l.setAttribute("aria-hidden","true"),o.appendChild(l);const c=document.createElement("img");c.className="timeline__img",c.src=n.image,c.alt="",c.loading="lazy",c.decoding="async",c.addEventListener("load",()=>o.classList.add("is-loaded")),c.addEventListener("error",()=>o.classList.add("is-loaded","is-error")),o.appendChild(c);const u=document.createElement("span");return u.className="timeline__thumb-label",u.textContent=n.subtitle,s.append(o,u),s.addEventListener("click",()=>this.select(e)),s.addEventListener("pointerenter",()=>this.preview(e)),s.addEventListener("focus",()=>this.preview(e)),s.addEventListener("keydown",this.handleThumbKey),this.thumbs[e]=s,r.replaceChildren(s),s}unmountThumb(e){var n;if(e===this.currentIndex)return;const t=this.thumbs[e];!t||t.matches(":focus-within")||(t.removeEventListener("keydown",this.handleThumbKey),this.thumbs[e]=null,(n=this.items[e])==null||n.replaceChildren())}focusThumb(e){this.virtualized&&this.renderWindowAround(e);const t=this.ensureThumb(e);t&&(this.thumbs.forEach((n,r)=>{n&&(n.tabIndex=r===e?0:-1)}),t.focus(),this.centerThumb(e,this.preferredScrollBehavior()))}select(e){var t;(t=this.onSelectCallback)==null||t.call(this,e)}preview(e){var t;(t=this.onPreviewCallback)==null||t.call(this,e)}setActive(e){const t=this.thumbs[this.currentIndex];t&&(t.classList.remove("is-active"),t.setAttribute("aria-pressed","false"),t.setAttribute("aria-current","false")),this.currentIndex=e,this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(this.currentIndex);n&&(n.classList.add("is-active"),n.setAttribute("aria-pressed","true"),n.setAttribute("aria-current","true"),this.thumbs.forEach((r,s)=>{r&&(r.tabIndex=s===e?0:-1)}),this.centerThumb(e,this.preferredScrollBehavior())),this.updateCounter(),this.updateScrollState()}renderWindowAround(e){const t=Math.max(4,Math.ceil(this.listEl.clientWidth/this.approxThumbPitch())||4),n=Math.max(0,e-br),r=Math.min(this.artworks.length-1,e+t+br);this.renderWindow(n,r)}renderWindowFromScroll(){if(!this.virtualized)return;const e=this.approxThumbPitch(),t=Math.max(4,Math.ceil(this.listEl.clientWidth/e)||4),n=Math.max(0,Math.floor(this.listEl.scrollLeft/e)-br),r=Math.min(this.artworks.length-1,n+t+br*2);this.renderWindow(n,r)}renderWindow(e,t){if(!(e===this.renderedStart&&t===this.renderedEnd)){for(let n=e;n<=t;n+=1)this.ensureThumb(n);for(let n=0;n<this.thumbs.length;n+=1)(n<e||n>t)&&this.unmountThumb(n);this.renderedStart=e,this.renderedEnd=t}}approxThumbPitch(){const e=this.thumbs.find(Boolean);return e?e.getBoundingClientRect().width+12:162}centerThumb(e,t){this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(e);if(!n)return;const r=this.listEl.getBoundingClientRect(),s=n.getBoundingClientRect();if(r.width<=0||s.width<=0)return;const a=s.left+s.width*.5-(r.left+r.width*.5);if(Math.abs(a)<1)return;const o=this.listEl.scrollLeft+a;this.listEl.scrollTo({left:o,behavior:t}),this.diagnostics.getMode()!=="default"&&this.diagnostics.debug("timeline","center-active","Centered active timeline thumbnail",{index:e,delta:Math.round(a),targetLeft:Math.round(o),behavior:t})}updateCounter(){this.counterEl.textContent=`${this.currentIndex+1} / ${this.artworks.length}`}updateScrollState(){this.updateCounter();const e=Math.max(0,this.listEl.scrollWidth-this.listEl.clientWidth-1),t=this.listEl.scrollLeft<=1,n=this.listEl.scrollLeft>=e;this.prevButton.disabled=t,this.nextButton.disabled=n,this.el.classList.toggle("timeline--at-start",t),this.el.classList.toggle("timeline--at-end",n)}preferredScrollBehavior(){if(document.documentElement.dataset.motion==="reduced")return"auto";try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}catch(e){return"smooth"}}async prewarmUnderOverlay(){const e=[];for(let s=0;s<this.artworks.length;s+=1){const a=this.ensureThumb(s);if(!a)continue;const o=a.querySelector(".timeline__img");o&&(o.loading="eager",a.offsetWidth,a.getBoundingClientRect(),typeof o.decode=="function"&&e.push(o.decode().then(()=>"decoded").catch(()=>"failed")))}this.el.offsetHeight,this.listEl.scrollWidth,getComputedStyle(this.el).opacity;const t=await Promise.allSettled(e);let n=0,r=0;return t.forEach(s=>{s.status==="fulfilled"&&s.value==="decoded"?n+=1:r+=1}),this.updateScrollState(),this.diagnostics.info("timeline","prewarm-under-overlay","Timeline DOM and thumbnail images prebuilt under loading overlay",{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:r,virtualized:this.virtualized}),{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:r}}onSelect(e){this.onSelectCallback=e}onPreview(e){this.onPreviewCallback=e}dispose(){this.prevButton.removeEventListener("click",this.onPrevPage),this.nextButton.removeEventListener("click",this.onNextPage),this.listEl.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onResize),this.thumbs.forEach(e=>e==null?void 0:e.removeEventListener("keydown",this.handleThumbKey)),this.thumbs.length=0,this.items.length=0,this.el.remove()}}const mc=.6;function vv(i){if(!(i instanceof HTMLElement))return!1;const e=i.tagName;return!!(e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||i.isContentEditable)}class _v{constructor(e,t){y(this,"galleryManager");y(this,"keyboardHelp");y(this,"fullscreenTarget",document.documentElement);y(this,"enabled",!0);y(this,"onEscape");y(this,"handleKeyDown",e=>{var t,n;if(!(!this.enabled||e.defaultPrevented)&&!vv(e.target)&&!(e.target instanceof HTMLElement&&e.target.closest(".timeline")&&(e.key==="ArrowLeft"||e.key==="ArrowRight")))switch(e.key){case"ArrowLeft":e.preventDefault(),this.galleryManager.navigate(-1);break;case"ArrowRight":e.preventDefault(),this.galleryManager.navigate(1);break;case"+":case"=":e.preventDefault(),this.galleryManager.addZoomDelta(-mc);break;case"-":case"_":e.preventDefault(),this.galleryManager.addZoomDelta(mc);break;case"0":case"r":case"R":e.preventDefault(),this.galleryManager.resetView();break;case"f":case"F":e.preventDefault(),this.toggleFullscreen();break;case"?":e.preventDefault(),(t=this.keyboardHelp)==null||t.open();break;case"Escape":if(document.fullscreenElement)break;(n=this.onEscape)==null||n.call(this);break}});this.galleryManager=e,this.keyboardHelp=t,window.addEventListener("keydown",this.handleKeyDown)}setFullscreenTarget(e){this.fullscreenTarget=e}setEnabled(e){this.enabled=e}toggleFullscreen(){document.fullscreenEnabled&&(document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.fullscreenTarget.requestFullscreen().catch(()=>{}))}dispose(){window.removeEventListener("keydown",this.handleKeyDown)}}const ys=Zt("KeyboardHelp"),xv=[["←  →","Nächstes / vorheriges Bild"],["+  −","Heran-/Herauszoomen"],["R","Ansicht zurücksetzen"],["F","Vollbild ein-/ausschalten"],["Esc","Dialog schließen"],["?","Diese Hilfe anzeigen"]];class yv{constructor(){y(this,"dialog");y(this,"opener",null);y(this,"onKeyDown",e=>{if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.close();return}e.key==="Tab"&&this.trapFocus(e)});this.dialog=this.build(),document.body.appendChild(this.dialog),ys.debug("init","KeyboardHelp component created")}build(){const e=document.createElement("div");return e.id="keyboard-help",e.className="keyboard-help",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","keyboard-help-title"),e.hidden=!0,e.innerHTML=`
      <div class="keyboard-help__panel">
        <h2 id="keyboard-help-title" class="keyboard-help__title">Tastaturkürzel</h2>
        <table class="keyboard-help__table">
          <tbody>
            ${xv.map(([t,n])=>`<tr><td><kbd class="keyboard-help__key">${t}</kbd></td><td>${n}</td></tr>`).join("")}
          </tbody>
        </table>
        <p class="keyboard-help__hint">Mausbewegung zum unteren oder linken Bildschirmrand enthüllt Zeitleiste, Navigation und Bildinformationen.</p>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`,e.querySelector(".keyboard-help__close").addEventListener("click",()=>this.close()),e.addEventListener("click",t=>{t.target===e&&this.close()}),e}open(e){var t;this.opener=e!=null?e:null,this.dialog.hidden=!1,document.addEventListener("keydown",this.onKeyDown),(t=this.dialog.querySelector(".keyboard-help__close"))==null||t.focus(),ys.debug("open","keyboard help opened")}close(){var e;this.dialog.hidden=!0,document.removeEventListener("keydown",this.onKeyDown),(e=this.opener)==null||e.focus(),this.opener=null,ys.debug("close","keyboard help closed")}trapFocus(e){const t=Array.from(this.dialog.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'));if(!t.length)return;const n=t[0],r=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),n.focus())}dispose(){document.removeEventListener("keydown",this.onKeyDown),this.dialog.remove(),ys.debug("dispose","KeyboardHelp component disposed")}}const bv=50;class Sv{constructor(e,t){y(this,"canvas");y(this,"galleryManager");y(this,"diagnostics",Zt("interaction"));y(this,"usePointerEvents");y(this,"disposed",!1);y(this,"enabled",!0);y(this,"state","idle");y(this,"active",new Map);y(this,"lastPinchDist",0);y(this,"onPointerDown",e=>{if(this.enabled&&!(e.pointerType==="mouse"&&e.button!==0)){try{this.canvas.setPointerCapture(e.pointerId)}catch(t){}if(this.active.set(e.pointerId,{id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY}),this.active.size===1)this.state=this.galleryManager.canPan()?"panning":"swipe-candidate",this.diagnostics.debug("gesture-start","Pointer gesture started",{pointerType:e.pointerType,state:this.state});else if(this.active.size===2){const t=[...this.active.values()];this.lastPinchDist=gc(t[0].lastX,t[0].lastY,t[1].lastX,t[1].lastY),this.state="pinching",this.diagnostics.debug("gesture-start","Pinch gesture started",{})}}});y(this,"onPointerMove",e=>{this.handlePointerMove(e)});y(this,"onGlobalPointerMove",e=>{e.target!==this.canvas&&this.handlePointerMove(e)});y(this,"onPointerUp",e=>{if(!this.enabled)return;const t=this.active.get(e.pointerId);this.active.delete(e.pointerId);try{this.canvas.releasePointerCapture(e.pointerId)}catch(n){}if(this.state==="pinching"&&this.active.size<2){this.state=this.galleryManager.canPan()?"panning":"swipe-candidate";return}this.state==="swipe-candidate"&&t&&this.active.size===0&&this.resolveSwipe(t,e.clientX,e.clientY),this.active.size===0&&(this.state="idle")});y(this,"onGlobalPointerUp",e=>{e.target!==this.canvas&&this.onPointerUp(e)});y(this,"onPointerCancel",e=>{this.enabled&&(this.active.delete(e.pointerId),this.active.size===0&&(this.state="idle",this.diagnostics.debug("gesture-cancel","Pointer gesture cancelled",{})))});y(this,"onGlobalPointerCancel",e=>{e.target!==this.canvas&&this.onPointerCancel(e)});y(this,"onTouchStart",e=>{if(this.enabled)if(e.cancelable&&e.preventDefault(),e.touches.length===1){const t=e.touches[0];this.active.clear(),this.active.set(0,{id:0,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY}),this.state=this.galleryManager.canPan()?"panning":"swipe-candidate"}else e.touches.length===2&&(this.state="pinching",this.lastPinchDist=this.getTouchDist(e))});y(this,"onTouchMove",e=>{if(!this.enabled)return;if(e.touches.length>=2){e.cancelable&&e.preventDefault();const a=this.getTouchDist(e),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02),this.state="pinching";return}if(e.touches.length!==1)return;const t=this.active.get(0);if(!t)return;const n=e.touches[0],r=n.clientX-t.lastX,s=n.clientY-t.lastY;t.lastX=n.clientX,t.lastY=n.clientY,this.galleryManager.canPan()&&(e.cancelable&&e.preventDefault(),this.galleryManager.setPanOffset(r*.004,-s*.004),this.state="panning")});y(this,"onGlobalTouchMove",e=>{e.target===this.canvas||this.state==="idle"||this.onTouchMove(e)});y(this,"onTouchEnd",e=>{if(this.enabled){if(this.state==="swipe-candidate"&&e.changedTouches.length>0){const t=this.active.get(0);t&&this.resolveSwipe(t,e.changedTouches[0].clientX,e.changedTouches[0].clientY)}e.touches.length===0&&(this.active.clear(),this.state="idle")}});y(this,"onWheel",e=>{this.enabled&&this.galleryManager.addZoomDelta(e.deltaY*.0045)});y(this,"onLegacyMouseMove",e=>{this.enabled&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY)});this.canvas=e,this.galleryManager=t,this.usePointerEvents=typeof window.PointerEvent=="function",this.usePointerEvents?(this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointercancel",this.onPointerCancel),this.canvas.addEventListener("lostpointercapture",this.onPointerCancel),window.addEventListener("pointermove",this.onGlobalPointerMove,{passive:!0}),window.addEventListener("pointerup",this.onGlobalPointerUp,{passive:!0}),window.addEventListener("pointercancel",this.onGlobalPointerCancel,{passive:!0})):(this.canvas.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.onTouchEnd,{passive:!0}),this.canvas.addEventListener("touchcancel",this.onTouchEnd,{passive:!0}),window.addEventListener("mousemove",this.onLegacyMouseMove,{passive:!0}),window.addEventListener("touchmove",this.onGlobalTouchMove,{passive:!1})),this.canvas.addEventListener("wheel",this.onWheel,{passive:!0}),this.diagnostics.info("init","Canvas interaction initialised",{backend:this.usePointerEvents?"pointer-events":"touch-events-fallback"})}handlePointerMove(e){if(!this.enabled)return;const t=this.active.get(e.pointerId);if(!t){e.pointerType==="mouse"&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY);return}const n=e.clientX-t.lastX,r=e.clientY-t.lastY;if(t.lastX=e.clientX,t.lastY=e.clientY,this.state==="pinching"&&this.active.size===2){const s=[...this.active.values()],a=gc(s[0].lastX,s[0].lastY,s[1].lastX,s[1].lastY),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02);return}this.active.size===1&&this.galleryManager.canPan()&&(this.state="panning",this.galleryManager.setPanOffset(n*.004,-r*.004))}getTouchDist(e){const t=e.touches[0].clientX-e.touches[1].clientX,n=e.touches[0].clientY-e.touches[1].clientY;return Math.sqrt(t*t+n*n)}updateHoverRotation(e,t){if(document.documentElement.dataset.pointerPrimary==="coarse")return;const n=e/window.innerWidth*2-1,r=t/window.innerHeight*2-1,s=this.galleryManager.getHoverRotationScale();this.galleryManager.setHoverTarget(n*s.x,r*s.y)}resolveSwipe(e,t,n){const r=t-e.startX,s=n-e.startY;Math.abs(r)>Math.abs(s)&&Math.abs(r)>bv&&(this.galleryManager.navigate(r<0?1:-1),this.diagnostics.debug("swipe","Swipe resolved",{direction:r<0?"next":"prev"}))}setEnabled(e){this.enabled!==e&&(this.enabled=e,e||(this.active.clear(),this.state="idle",this.galleryManager.setHoverTarget(0,0)))}dispose(){this.disposed||(this.disposed=!0,this.usePointerEvents?(this.canvas.removeEventListener("pointerdown",this.onPointerDown),this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas.removeEventListener("pointerup",this.onPointerUp),this.canvas.removeEventListener("pointercancel",this.onPointerCancel),this.canvas.removeEventListener("lostpointercapture",this.onPointerCancel),window.removeEventListener("pointermove",this.onGlobalPointerMove),window.removeEventListener("pointerup",this.onGlobalPointerUp),window.removeEventListener("pointercancel",this.onGlobalPointerCancel)):(this.canvas.removeEventListener("touchstart",this.onTouchStart),this.canvas.removeEventListener("touchmove",this.onTouchMove),this.canvas.removeEventListener("touchend",this.onTouchEnd),this.canvas.removeEventListener("touchcancel",this.onTouchEnd),window.removeEventListener("mousemove",this.onLegacyMouseMove),window.removeEventListener("touchmove",this.onGlobalTouchMove)),this.canvas.removeEventListener("wheel",this.onWheel),this.active.clear())}}function gc(i,e,t,n){const r=t-i,s=n-e;return Math.sqrt(r*r+s*s)}const Ke=1e-6,G=(i,e)=>({x:i,y:e}),He=(i,e,t)=>({x:i,y:e,z:t});function tt(i){return{x:i.x,y:i.y}}function tn(i){return i.map(tt)}function Sr(i){let e=0;for(let t=0;t<i.length;t+=1){const n=i[t],r=i[(t+1)%i.length];e+=n.x*r.y-r.x*n.y}return e/2}function vc(i){return Sr(i)>0}function bs(i){return vc(i)?i:[i[0],i[3],i[2],i[1]]}function Oi(i){let e=0;for(let t=0;t<i.length;t+=1){const n=i[t],r=i[(t+1)%i.length],s=i[(t+2)%i.length],a=(r.x-n.x)*(s.y-r.y)-(r.y-n.y)*(s.x-r.x),o=Math.sign(a);if(o!==0){if(e!==0&&o!==e)return!1;e=o}}return e!==0}function Mr(i,e=Ke){return Math.abs(Sr(i))<=e}function Ss(i,e){return Math.hypot(e.x-i.x,e.y-i.y)}function _c(i){return Math.min(Ss(i[0],i[1]),Ss(i[1],i[2]),Ss(i[2],i[3]),Ss(i[3],i[0]))}function qn(i,e){let t=!1;for(let n=0,r=e.length-1;n<e.length;r=n,n+=1){const s=e[n],a=e[r],o=a.y-s.y,l=Math.abs(o)<=Ke?o<0?-Ke:Ke:o;s.y>i.y!=a.y>i.y&&i.x<(a.x-s.x)*(i.y-s.y)/l+s.x&&(t=!t)}return t}function xc(i,e){let t=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY;for(const r of i){const s=r.x*e.x+r.y*e.y;s<t&&(t=s),s>n&&(n=s)}return{min:t,max:n}}function Xa(i,e){const t=[i,e];for(const n of t)for(let r=0;r<n.length;r+=1){const s=n[r],a=n[(r+1)%n.length],o=G(a.x-s.x,a.y-s.y),l=G(-o.y,o.x),c=xc(i,l),u=xc(e,l);if(c.max<u.min||u.max<c.min)return!1}return!0}function $a(i,e){const t=i.reduce((n,r)=>G(n.x+r.x,n.y+r.y),G(0,0));return t.x/=i.length,t.y/=i.length,i.map(n=>G(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e))}function Bi(i){const e=bs(i);if(Mr(e)||!Oi(e))return null;const[t,n,r,s]=e,a=n.x-r.x,o=n.y-r.y,l=s.x-r.x,c=s.y-r.y,u=t.x-n.x+r.x-s.x,h=t.y-n.y+r.y-s.y,d=a*c-l*o;if(Math.abs(d)<=Ke)return null;const f=(u*c-l*h)/d,g=(a*h-u*o)/d,v=n.x-t.x+f*n.x,p=s.x-t.x+g*s.x,m=t.x,b=n.y-t.y+f*n.y,x=s.y-t.y+g*s.y,E=t.y;return[v,p,m,b,x,E,f,g,1]}function Ms(i){const[e,t,n,r,s,a,o,l,c]=i,u=s*c-a*l,h=-(r*c-a*o),d=r*l-s*o,f=-(t*c-n*l),g=e*c-n*o,v=-(e*l-t*o),p=t*a-n*s,m=-(e*a-n*r),b=e*s-t*r,x=e*u+t*h+n*d;if(Math.abs(x)<=Ke)return null;const E=1/x;return[u*E,f*E,p*E,h*E,g*E,m*E,d*E,v*E,b*E]}function yc(i,e){return[i[0]*e[0]+i[1]*e[3]+i[2]*e[6],i[0]*e[1]+i[1]*e[4]+i[2]*e[7],i[0]*e[2]+i[1]*e[5]+i[2]*e[8],i[3]*e[0]+i[4]*e[3]+i[5]*e[6],i[3]*e[1]+i[4]*e[4]+i[5]*e[7],i[3]*e[2]+i[4]*e[5]+i[5]*e[8],i[6]*e[0]+i[7]*e[3]+i[8]*e[6],i[6]*e[1]+i[7]*e[4]+i[8]*e[7],i[6]*e[2]+i[7]*e[5]+i[8]*e[8]]}function Zn(i,e,t){const[n,r,s,a,o,l,c,u,h]=i,d=c*e+u*t+h;return Math.abs(d)<=Ke?null:G((n*e+r*t+s)/d,(a*e+o*t+l)/d)}function bc(i,e,t){const n=Math.max(1,e),r=Math.max(1,t);return[i[0]/n,i[1]/r,i[2],i[3]/n,i[4]/r,i[5],i[6]/n,i[7]/r,i[8]]}function Sc(i){return`matrix3d(${i[0]}, ${i[3]}, 0, ${i[6]}, ${i[1]}, ${i[4]}, 0, ${i[7]}, 0, 0, 1, 0, ${i[2]}, ${i[5]}, 0, ${i[8]})`}function ws(i,e){const t=Bi(i.quad);if(!t)return null;const n=Ms(t);return n?Zn(n,e.x,e.y):null}function Mc(i){const e=i.map(o=>o.x),t=i.map(o=>o.y),n=Math.min(...e),r=Math.max(...e),s=Math.min(...t),a=Math.max(...t);return{minX:n,minY:s,maxX:r,maxY:a,width:r-n,height:a-s}}function wc(i,e){return He(i.x-e.x,i.y-e.y,i.z-e.z)}function Ya(i,e){return He(i.x+e.x,i.y+e.y,i.z+e.z)}function qa(i,e){return He(i.x*e,i.y*e,i.z*e)}function Za(i,e){return i.x*e.x+i.y*e.y+i.z*e.z}function Ka(i,e){return He(i.y*e.z-i.z*e.y,i.z*e.x-i.x*e.z,i.x*e.y-i.y*e.x)}function zi(i){const e=Math.hypot(i.x,i.y,i.z);return Number.isFinite(e)&&e>Ke?qa(i,1/e):null}function Ec(i){const e=zi(wc(i.target,i.position)),t=He(0,1,0),n=e?zi(Ka(e,t)):null,r=n&&e?zi(Ka(n,e)):null;return!e||!n||!r?null:{right:n,up:r,forward:e}}function Mv(i,e){if(!Number.isFinite(i.verticalFovDeg)||i.verticalFovDeg<=1||i.verticalFovDeg>=179||e.width<=0||e.height<=0)return null;const t=Math.tan(i.verticalFovDeg*Math.PI/360);if(!Number.isFinite(t)||t<=Ke)return null;const n=e.height/(2*t);return[n,0,e.width/2,0,-n,e.height/2,0,0,1]}function ja(i,e){const t=Ec(i);return t?He(t.right.x*e.x+t.up.x*e.y+t.forward.x*e.z,t.right.y*e.x+t.up.y*e.y+t.forward.y*e.z,t.right.z*e.x+t.up.z*e.y+t.forward.z*e.z):null}function Qa(i){return Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z)}function Hi(i,e){return Ya(Ya(i.origin,qa(i.axisU,e.x)),qa(i.axisV,e.y))}function Tc(i){return zi(Ka(i.axisU,i.axisV))}function wv(i,e){return[Hi(i,e[0]),Hi(i,e[1]),Hi(i,e[2]),Hi(i,e[3])]}function Ev(i){return[G(0,i.height),G(i.width,i.height),G(i.width,0),G(0,0)]}function Es(i,e,t){var g,v,p,m;if(!Qa(i.position)||!Qa(i.target)||!Qa(e)||!Number.isFinite(i.verticalFovDeg)||!Number.isFinite(i.near)||i.far!==void 0&&(!Number.isFinite(i.far)||i.far<=i.near)||i.verticalFovDeg<=1||i.verticalFovDeg>=179||i.near<=0||t.width<=0||t.height<=0)return null;const n=Ec(i);if(!n)return null;const r=wc(e,i.position),s=Za(r,n.right),a=Za(r,n.up),o=Za(r,n.forward);if(!Number.isFinite(s)||!Number.isFinite(a)||!Number.isFinite(o)||o<=i.near||i.far!==void 0&&o>=i.far)return null;const l=Math.tan(i.verticalFovDeg*Math.PI/360),c=t.width/t.height;if(!Number.isFinite(l)||l<=Ke||!Number.isFinite(c)||c<=Ke)return null;const u=s/(o*l*c),h=a/(o*l);if(!Number.isFinite(u)||!Number.isFinite(h))return null;const d=(v=(g=i.lensShift)==null?void 0:g.x)!=null?v:0,f=(m=(p=i.lensShift)==null?void 0:p.y)!=null?m:0;return G((u+1)*t.width/2+d*t.width,(1-h)*t.height/2+f*t.height)}function Ts(i,e,t,n){return Es(e,Hi(i,t),n)}function Ac(i,e,t){const n=Ev(i).map(s=>Ts(i,e,s,t));if(n.some(s=>s===null))return null;const r=[n[0],n[1],n[2],n[3]];return Mr(r)||!Oi(r)?null:bs(r)}function Ja(i,e,t,n){const r=t.map(s=>Ts(i,e,s,n));return r.some(s=>s===null)?null:r}function Cc(i,e,t){return i.doorwayExclusions.map(n=>Ja(i,e,n,t)).filter(n=>n!==null)}function Rc(i,e){if(!i||!e||i.length!==e.length||i.length===0)return{max:null,mean:null};const t=i.map((n,r)=>Math.hypot(n.x-e[r].x,n.y-e[r].y));return{max:Math.max(...t),mean:t.reduce((n,r)=>n+r,0)/t.length}}function Pc(i,e=.02){const t=i[1].x-i[0].x,n=Math.abs(t)<=Ke?0:(i[1].y-i[0].y)/t;return Math.abs(n)<=e?"flat":n>0?"left":"right"}function Ic(i,e,t,n,r,s,a=36){var b,x,E,I;const o=Rc(t,e),l=Rc(r,n),c=Math.hypot(i.axisU.x,i.axisU.y,i.axisU.z),u=Math.hypot(i.axisV.x,i.axisV.y,i.axisV.z),h=c>Ke&&u>Ke?(i.axisU.x*i.axisV.x+i.axisU.y*i.axisV.y+i.axisU.z*i.axisV.z)/(c*u):Number.POSITIVE_INFINITY,d=e[1].x-e[0].x,f=Math.abs(d)<=Ke?0:(e[1].y-e[0].y)/d,g=Pc(e),v=g===s,p=Sr(e)>Ke,m=p&&v&&Math.abs(c-1)<=.08&&Math.abs(u-1)<=.08&&Math.abs(h)<=.08&&((b=o.max)!=null?b:Number.POSITIVE_INFINITY)<=a&&((x=l.max)!=null?x:0)<=a;return{referenceResidualMaxPx:(E=o.max)!=null?E:Number.POSITIVE_INFINITY,referenceResidualMeanPx:(I=o.mean)!=null?I:Number.POSITIVE_INFINITY,safeResidualMaxPx:l.max,safeResidualMeanPx:l.mean,axisULength:c,axisVLength:u,axisDot:h,expectedConvergence:s,projectedConvergence:g,convergenceSlope:f,convergenceMatchesExpected:v,windingClockwise:p,thresholdPx:a,passes:m}}function Tv(i,e,t,n,r,s,a=36){const o=Bi(e),l=Mv(n,r);if(!o||!l)return null;const c=Ms(l);if(!c)return null;const u=(B,V)=>{const j=[1/Math.max(Ke,B),0,0,0,-1/Math.max(Ke,V),1,0,0,1],D=yc(o,j),J=yc(c,D),q=He(J[0],J[3],J[6]),ce=He(J[1],J[4],J[7]),fe=He(J[2],J[5],J[8]),me=Math.hypot(q.x,q.y,q.z),Ce=Math.hypot(ce.x,ce.y,ce.z);return me<=Ke||Ce<=Ke?null:{homography:D,basis1:q,basis2:ce,origin:fe,norm1:me,norm2:Ce}},h=u(i.width,i.height);if(!h)return null;const d=i.width*h.norm1,f=i.height*h.norm2,g=u(d,f);if(!g)return null;const v=He(g.origin.x,g.origin.y,g.origin.z),p=zi(g.basis1),m=zi(g.basis2),b=ja(n,v),x=p?ja(n,p):null,E=m?ja(n,m):null;if(!b||!x||!E)return null;const I=d/i.width,A=f/i.height,C=B=>G(B.x*I,B.y*A),N=t&&t.length>=3?(()=>{const B=Ms(g.homography);if(!B)return i.safePolygon.map(C);const V=t.map(j=>Zn(B,j.x,j.y)).filter(j=>j!==null);return V.length===t.length?V:i.safePolygon.map(C)})():i.safePolygon.map(C),S={origin:Ya(n.position,b),axisU:x,axisV:E,width:d,height:f,safePolygon:N,doorwayExclusions:i.doorwayExclusions.map(B=>B.map(C)),hangingBand:{minY:i.hangingBand.minY*A,maxY:i.hangingBand.maxY*A,margin:i.hangingBand.margin*A}},M=Ac(S,n,r);if(!M)return null;const P=Ja(S,n,S.safePolygon,r),X=Ic(S,M,e,P,t,s,a);return{room:S,scaleX:I,scaleY:A,projectedQuad:M,projectedSafePolygon:P,realism:X}}function Lc(i){return{minX:Math.min(...i.map(e=>e.x)),maxX:Math.max(...i.map(e=>e.x)),minY:Math.min(...i.map(e=>e.y)),maxY:Math.max(...i.map(e=>e.y))}}function Av(i,e,t){const n=e/2,r=t/2;return[G(i.x-n,i.y+r),G(i.x+n,i.y+r),G(i.x+n,i.y-r),G(i.x-n,i.y-r)]}function Dc(i,e,t,n){const r=Lc(i.safePolygon),s=Math.max(Ke,n),a=Math.max(Ke,r.maxX-r.minX),o=Math.max(Ke,i.hangingBand.maxY-i.hangingBand.minY-i.hangingBand.margin*2),l=Math.max(Ke,Math.min(t,o,a/s)),c=(C,N)=>{const S=Av(C,N*s,N),M=[...S,C].every(D=>Number.isFinite(D.x)&&Number.isFinite(D.y)),P=S.every(D=>qn(D,i.safePolygon)),X=i.doorwayExclusions.every(D=>!Xa(S,D)),B=S.every(D=>D.y>=i.hangingBand.minY+i.hangingBand.margin-Ke&&D.y<=i.hangingBand.maxY-i.hangingBand.margin+Ke),V=Oi(S)&&Math.abs(Sr(S))>Ke;return{anchor:C,mountedHeight:N,localQuad:S,validity:{finite:M,contained:P,doorwayClear:X,inHangingBand:B,orientationConsistent:V},moved:!1,scaleFactor:1,candidateCount:1,adjustmentReason:"none",rejectionReason:M?V?P?X?B?"none":"outside-hanging-band":"doorway-overlap":"outside-safe-region":"degenerate-local-quad":"non-finite"}},u=[1,.97,.94,.91,.88,.85,.82,.79,.76,.73,.7,.67,.64,.61,.58,.55],h=i.doorwayExclusions.map(C=>Lc(C)),d=C=>Math.round(C*1e4)/1e4,f=(C,N,S,M)=>{if(!Number.isFinite(N))return;const P=Math.min(M,Math.max(S,N));C.some(X=>Math.abs(X-P)<=1e-4)||C.push(d(P))},g=c(G(e.x,e.y),l);let v=g,p=null,m=Number.POSITIVE_INFINITY,b=0;for(const C of u){const N=Math.max(Ke,l*C),S=N*s/2,M=N/2,P=r.minX+S,X=r.maxX-S,B=i.hangingBand.minY+i.hangingBand.margin+M,V=i.hangingBand.maxY-i.hangingBand.margin-M;if(P>X||B>V)continue;const j=[],D=[],J=Math.min(X,Math.max(P,e.x)),q=Math.min(V,Math.max(B,e.y));f(j,J,P,X),f(j,P,P,X),f(j,X,P,X),f(D,q,B,V),f(D,B,B,V),f(D,V,B,V);for(const fe of i.safePolygon)f(j,fe.x,P,X),f(D,fe.y,B,V);const ce=Math.max(.01,i.hangingBand.margin*.5);for(const fe of h)f(j,fe.minX-S-ce,P,X),f(j,fe.maxX+S+ce,P,X),f(D,fe.maxY+M+ce,B,V),f(D,fe.minY-M-ce,B,V);for(const fe of D)for(const me of j){b+=1;const Ce=c(G(me,fe),N);if(Ce.scaleFactor=C,Ce.candidateCount=b,v=Ce,!Ce.validity.finite||!Ce.validity.contained||!Ce.validity.doorwayClear||!Ce.validity.inHangingBand||!Ce.validity.orientationConsistent)continue;const $e=Math.hypot(Ce.anchor.x-e.x,Ce.anchor.y-e.y),Q=Math.abs(l-N)/Math.max(l,Ke),ie=$e+Q*.75;ie<m-1e-6&&(m=ie,p=Ce)}if(p)break}const x=p!=null?p:v,E=Math.abs(x.anchor.x-e.x)>1e-6||Math.abs(x.anchor.y-e.y)>1e-6,I=Math.abs(x.mountedHeight-t)>1e-6;x.moved=E,x.candidateCount=Math.max(b,1),x.scaleFactor=Math.max(Ke,x.mountedHeight/Math.max(t,Ke));const A=!g.validity.doorwayClear;return x.adjustmentReason=p?E&&I?"shifted-and-shrunk":E?A?"shifted-away-from-doorway":"clamped-safe-region":I?"shrunk-to-fit":"none":"rejected",p?(x.rejectionReason="none",x):(x.rejectionReason=x.rejectionReason==="none"?"no-valid-candidate":x.rejectionReason,x)}function As(i,e,t,n){if(i.room&&i.camera&&e.anchor){const b=Dc(i.room,e.anchor,e.mountedHeight,t);if(!b.validity.finite||!b.validity.contained||!b.validity.doorwayClear||!b.validity.inHangingBand||!b.validity.orientationConsistent||i.projectionRealism&&!i.projectionRealism.passes)return null;const x=b.localQuad.map(M=>Ts(i.room,i.camera,M,n));if(x.some(M=>M===null))return null;const E=wv(i.room,b.localQuad),I=bs([x[0],x[1],x[2],x[3]]);if(Mr(I)||!Oi(I)||i.safePolygon&&!I.every(M=>qn(M,i.safePolygon)))return null;const A=Math.max(1,b.mountedHeight/i.room.height*n.height),C=Math.max(1,A*Math.max(Ke,t)),N=Bi(I);if(!N)return null;const S=bc(N,C,A);return{localQuad:b.localQuad,worldQuad:E,projectedQuad:I,bounds:Mc(I),sourceWidth:C,sourceHeight:A,cssMatrix3d:Sc(S),shortEdge:_c(I),placement:b,projectedAnchor:Ts(i.room,i.camera,b.anchor,n),validity:b.validity,realism:i.projectionRealism}}const r=Math.max(Ke,t),s=Math.max(Ke,Math.min(1,i.planeAspect/r)),a=Math.max(Ke,Math.min(e.mountedHeight,s)),l=a*r/Math.max(Ke,i.planeAspect)/2,c=a/2,u=[G(e.center.x-l,e.center.y-c),G(e.center.x+l,e.center.y-c),G(e.center.x+l,e.center.y+c),G(e.center.x-l,e.center.y+c)],h=Bi(i.quad);if(!h)return null;const d=u.map(b=>Zn(h,b.x,b.y));if(d.some(b=>b===null))return null;const f=bs([d[0],d[1],d[2],d[3]]),g=Math.max(1,a*n.height),v=Math.max(1,g*t),p=Bi(f);if(!p)return null;const m=bc(p,v,g);return{localQuad:u,projectedQuad:f,bounds:Mc(f),sourceWidth:v,sourceHeight:g,cssMatrix3d:Sc(m),shortEdge:_c(f),placement:null}}const Cv=new Set(["Backgrounds/museum-target.png"]);function Rv(i){return i.trim().replace(/^[./]+/,"").replace(/^backgrounds\//i,"Backgrounds/")}function Pv(i,e,t){return t||!i||!e||i===e?null:e}function eo(i){return i===404}function to(i){return i.trim()?Cv.has(Rv(i)):!1}const Iv=4,hn={width:1366,height:768},no=hn.width/hn.height,Gi="Backgrounds/museum-empty.png",Nc="#D8DDDB",Lv=1500,Cs=72,Rs={position:He(0,1.8,7.5),target:He(0,1.8,0),verticalFovDeg:42,near:.1,far:40,lensShift:G(0,0)};function Ps(i,e,t,n,r=[]){return{origin:i,axisU:e,axisV:He(0,1,0),width:t,height:n,safePolygon:[G(.14,.14),G(t-.14,.14),G(t-.14,n-.14),G(.14,n-.14)],doorwayExclusions:r,hangingBand:{minY:.42,maxY:n-.28,margin:.08}}}function Is(i,e,t,n){return{origin:i,axisU:e,axisV:He(0,1,0),width:t,height:n}}const Dv=[{id:"wall-left-outer",group:"left",planeAspect:.73,quad:[G(94,188),G(372,236),G(348,622),G(36,626)],safePolygon:[G(110,206),G(356,248),G(332,606),G(52,610)],drawableRegion:[G(.14,.14),G(2.633,.14),G(2.633,3.26),G(.14,3.26)],exclusionPolygons:[[G(0,0),G(.3,0),G(.3,1.35),G(0,1.35)]],transform:Is(He(-3.9,0,2),He(.433,0,-.902),2.773,3.4),hangingBand:{minY:.42,maxY:3.12,margin:.08},shadowVector:G(-14,18),room:Ps(He(-3.9,0,2),He(.433,0,-.902),2.773,3.4,[[G(0,0),G(.3,0),G(.3,1.35),G(0,1.35)]])},{id:"wall-left-inner",group:"left",planeAspect:1.06,quad:[G(362,234),G(688,246),G(732,610),G(332,614)],safePolygon:[G(376,250),G(674,260),G(712,594),G(348,598)],drawableRegion:[G(.14,.14),G(2.56,.14),G(2.56,2.86),G(.14,2.86)],exclusionPolygons:[[G(2.34,0),G(2.7,0),G(2.7,1.7),G(2.34,1.7)]],transform:Is(He(-2.7,0,-.5),He(1,0,0),2.7,3),hangingBand:{minY:.42,maxY:2.72,margin:.08},shadowVector:G(-8,14),room:Ps(He(-2.7,0,-.5),He(1,0,0),2.7,3,[[G(2.34,0),G(2.7,0),G(2.7,1.7),G(2.34,1.7)]])},{id:"wall-right-inner",group:"right",planeAspect:1.05,quad:[G(682,246),G(1006,234),G(1032,614),G(648,610)],safePolygon:[G(698,260),G(990,250),G(1012,598),G(666,594)],drawableRegion:[G(.14,.14),G(2.56,.14),G(2.56,2.86),G(.14,2.86)],exclusionPolygons:[[G(0,0),G(.36,0),G(.36,1.7),G(0,1.7)]],transform:Is(He(0,0,-.5),He(1,0,0),2.7,3),hangingBand:{minY:.42,maxY:2.72,margin:.08},shadowVector:G(8,14),room:Ps(He(0,0,-.5),He(1,0,0),2.7,3,[[G(0,0),G(.36,0),G(.36,1.7),G(0,1.7)]])},{id:"wall-right-outer",group:"right",planeAspect:.72,quad:[G(998,236),G(1274,188),G(1330,626),G(1014,622)],safePolygon:[G(1014,248),G(1256,206),G(1310,610),G(1032,606)],drawableRegion:[G(.14,.14),G(2.633,.14),G(2.633,3.26),G(.14,3.26)],exclusionPolygons:[[G(2.47,0),G(2.773,0),G(2.773,1.35),G(2.47,1.35)]],transform:Is(He(2.7,0,-.5),He(.433,0,.902),2.773,3.4),hangingBand:{minY:.42,maxY:3.12,margin:.08},shadowVector:G(14,18),room:Ps(He(2.7,0,-.5),He(.433,0,.902),2.773,3.4,[[G(2.47,0),G(2.773,0),G(2.773,1.35),G(2.47,1.35)]])}],io=[{suffix:"wall-left.outer",wallId:"wall-left-outer",intendedUse:"portrait",placement:{wallId:"wall-left-outer",center:G(.52,.58),anchor:G(1.4,1.78),uv:G(.5,.52),mountedHeight:1.24,targetSizePolicy:"contain",minScale:.7,maxScale:1,zOffset:.02}},{suffix:"wall-left.inner",wallId:"wall-left-inner",intendedUse:"landscape",placement:{wallId:"wall-left-inner",center:G(.52,.56),anchor:G(1.35,1.68),uv:G(.5,.56),mountedHeight:.84,targetSizePolicy:"contain",minScale:.7,maxScale:1,zOffset:.02}},{suffix:"wall-right.inner",wallId:"wall-right-inner",intendedUse:"square",placement:{wallId:"wall-right-inner",center:G(.49,.56),anchor:G(1.35,1.68),uv:G(.5,.56),mountedHeight:.9,targetSizePolicy:"contain",minScale:.7,maxScale:1,zOffset:.02}},{suffix:"wall-right.outer",wallId:"wall-right-outer",intendedUse:"panoramic",placement:{wallId:"wall-right-outer",center:G(.51,.56),anchor:G(1.38,1.7),uv:G(.5,.5),mountedHeight:.7,targetSizePolicy:"contain",minScale:.7,maxScale:1,zOffset:.02}}],Nv=new Map(io.map(i=>[i.suffix,i.wallId])),Fv={"room-01.wall-left.outer":"quiet-coastline","room-01.wall-left.inner":"electric-storm","room-01.wall-right.inner":"tokyo-passage","room-01.wall-right.outer":"golden-desert"},ut=i=>Math.min(1,Math.max(0,i)),Fc=i=>typeof i=="string"&&/^#[0-9a-fA-F]{6}$/.test(i.trim()),Uc=i=>`room-${String(i+1).padStart(2,"0")}`;function kc(i){return i<.9?"portrait":i<=1.15?"square":i<1.9?"landscape":"panoramic"}function ro(){return{galleryWall:Nc,museumWall:Nc}}function Ls(){return{verticalBand:{minY:.42,maxY:3.12},sideMargin:.14,doorwayClearance:.08}}function Uv(i){return Pc(i,.01)}function Oc(i){const e=Number.isFinite(i.width)?Math.max(640,Math.min(4096,i.width)):hn.width,t=Number.isFinite(i.height)?Math.max(360,Math.min(4096,i.height)):hn.height;return{width:e,height:t}}function Bc(i){return[tt(i[0]),tt(i[1]),tt(i[2]),tt(i[3])]}function gt(i){return He(i.x,i.y,i.z)}function so(i){return{origin:gt(i.origin),axisU:gt(i.axisU),axisV:gt(i.axisV),width:i.width,height:i.height}}function ao(i){return{origin:gt(i.origin),axisU:gt(i.axisU),axisV:gt(i.axisV),width:i.width,height:i.height,safePolygon:tn(i.safePolygon),doorwayExclusions:i.doorwayExclusions.map(e=>tn(e)),hangingBand:{...i.hangingBand}}}function wr(i){return{position:gt(i.position),target:gt(i.target),verticalFovDeg:i.verticalFovDeg,near:i.near,far:i.far,lensShift:i.lensShift?tt(i.lensShift):void 0}}function kv(i){var e,t;return{id:i.id,planeAspect:i.planeAspect,quad:i.quad,safePolygon:(t=(e=i.drawableRegion)!=null?e:i.safePolygon)!=null?t:tn($a(i.quad,.92)),shadowVector:i.shadowVector,room:i.room}}function Er(){return Dv.map(i=>{var e;return{...i,quad:Bc(i.quad),safePolygon:i.safePolygon?tn(i.safePolygon):void 0,drawableRegion:i.drawableRegion?tn(i.drawableRegion):void 0,exclusionPolygons:(e=i.exclusionPolygons)==null?void 0:e.map(t=>tn(t)),transform:i.transform?so(i.transform):void 0,hangingBand:i.hangingBand?{...i.hangingBand}:void 0,shadowVector:i.shadowVector?tt(i.shadowVector):void 0,room:i.room?ao(i.room):void 0}})}function zc(i){const e=[];for(const n of i){const r=n.transform;r&&e.push(gt(r.origin))}const t=[...i].reverse().find(n=>n.transform);return t!=null&&t.transform&&e.push(He(t.transform.origin.x+t.transform.axisU.x*t.transform.width,t.transform.origin.y+t.transform.axisU.y*t.transform.width,t.transform.origin.z+t.transform.axisU.z*t.transform.width)),e.length>=3?e:[He(-3.9,0,2),He(-2.7,0,-.5),He(2.7,0,-.5),He(3.9,0,2)]}function Hc(i,e){const t=i.flatMap(o=>{const l=o.transform;return l?[l.origin,He(l.origin.x+l.axisU.x*l.width,l.origin.y+l.axisU.y*l.width+l.axisV.y*l.height,l.origin.z+l.axisU.z*l.width+l.axisV.z*l.height)]:[]}),n=[...e,...t],r=n.map(o=>o.x),s=n.map(o=>o.y),a=n.map(o=>o.z);return{min:He(Math.min(...r),Math.min(...s),Math.min(...a)),max:He(Math.max(...r),Math.max(...s),Math.max(...a))}}function Ds(i){const e=zc(i),t=Hc(i,e);return{floorOutline:e,bounds:t,floorY:t.min.y,ceilingY:t.max.y,wallThickness:.08}}function oo(i){return io.map(e=>({id:`${Uc(i)}.${e.suffix}`,enabled:!0,selectable:!0,placement:{wallId:e.wallId,center:tt(e.placement.center),mountedHeight:e.placement.mountedHeight,anchor:e.placement.anchor?tt(e.placement.anchor):void 0,provisional:!1}}))}function Ns(i){return i.dimensions.height>0?i.dimensions.width/i.dimensions.height:1}function lo(i,e){return i.uv?tt(i.uv):i.anchor&&(e!=null&&e.room)?G(ut(i.anchor.x/Math.max(.001,e.room.width)),ut(i.anchor.y/Math.max(.001,e.room.height))):G(ut(i.center.x),ut(1-i.center.y))}function Ov(i,e){if(i.anchor)return tt(i.anchor);const t=lo(i,e);if(!(!t||!(e!=null&&e.room)))return G(t.x*e.room.width,t.y*e.room.height)}function Bv(i){const e=i.reduce((t,n)=>G(t.x+n.x,t.y+n.y),G(0,0));return G(e.x/Math.max(1,i.length),e.y/Math.max(1,i.length))}function zv(i,e,t){const n=Math.max(0,e.findIndex(r=>r.id===i));return[...e].sort((r,s)=>{const a=r.id===i?-1:0,o=s.id===i?-1:0;if(a!==o)return a-o;const l=r.group===t?0:1,c=s.group===t?0:1;return l!==c?l-c:Math.abs(n-e.findIndex(u=>u.id===r.id))-Math.abs(n-e.findIndex(u=>u.id===s.id))})}function Hv(i,e,t,n){if(i.room&&e.anchor){const b=Dc(i.room,e.anchor,e.mountedHeight,t);return{center:e.center,anchor:b.anchor,mountedHeight:b.mountedHeight,adjusted:Math.abs(b.anchor.x-e.anchor.x)>1e-6||Math.abs(b.anchor.y-e.anchor.y)>1e-6||Math.abs(b.mountedHeight-e.mountedHeight)>1e-6}}const r=Math.max(.25,t),s=Math.max(.25,i.planeAspect);let a=G(ut(e.center.x),ut(e.center.y)),o=Math.max(.04,Math.min(.9,e.mountedHeight)),l=a.x!==e.center.x||a.y!==e.center.y||o!==e.mountedHeight;const c=Math.max(.04,Math.min(.9,s/r));o>c&&(o=c,l=!0);const u=()=>{const x=o*r/s/2,E=o/2,I=Math.max(0,x),A=Math.min(1,1-x),C=Math.max(0,E),N=Math.min(1,1-E),S=Math.max(I,Math.min(A,a.x)),M=Math.max(C,Math.min(N,a.y));(S!==a.x||M!==a.y)&&(l=!0),a=G(S,M)};u();const h=()=>As(i,{wallId:e.wallId,center:a,mountedHeight:o},r,n),d=b=>b?b.projectedQuad.reduce((x,E)=>x+(qn(E,i.safePolygon)?1:0),0):-1;let f=d(h()),g=a,v=o;if(f===4)return{center:g,mountedHeight:v,adjusted:l};const p=(()=>{const b=ws(i,Bv(i.safePolygon));return b?G(ut(b.x),ut(b.y)):G(.5,.5)})();for(let b=0;b<36;b+=1){a=G(ut(a.x+(p.x-a.x)*.22),ut(a.y+(p.y-a.y)*.22)),o=Math.max(.04,Math.min(c,o*.985)),u();const x=h(),E=d(x);if(E>f&&(f=E,g=a,v=o),f===4)break}const m=Math.abs(g.x-e.center.x)>1e-6||Math.abs(g.y-e.center.y)>1e-6||Math.abs(v-e.mountedHeight)>1e-6;return{center:g,mountedHeight:v,adjusted:l||m}}function Kn(i,e=!1){if(!i||typeof i!="object")return null;const t=i,n=typeof t.x=="number"&&Number.isFinite(t.x)?t.x:NaN,r=typeof t.y=="number"&&Number.isFinite(t.y)?t.y:NaN;return Number.isNaN(n)||Number.isNaN(r)?null:e?G(ut(n),ut(r)):G(n,r)}function In(i){if(!i||typeof i!="object")return null;const e=i,t=e.x,n=e.y,r=e.z;return typeof t!="number"||typeof n!="number"||typeof r!="number"||!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(r)?null:He(t,n,r)}function Gc(i,e){if(!i||typeof i!="object")return null;const t=i,n=t.minY,r=t.maxY,s=t.margin;return typeof n!="number"||typeof r!="number"||typeof s!="number"||!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(s)||n<0||r>e||r-n<=.2||s<0||s*2>=r-n?null:{minY:n,maxY:r,margin:s}}function Vc(i){var u;if(!i||typeof i!="object")return null;const e=i,t=In(e.origin),n=In(e.axisU),r=(u=In(e.axisV))!=null?u:He(0,1,0),s=e.width,a=e.height;if(!t||!n||!r||typeof s!="number"||typeof a!="number"||!Number.isFinite(s)||!Number.isFinite(a)||s<=.25||a<=.25)return null;const o=Math.hypot(n.x,n.y,n.z),l=Math.hypot(r.x,r.y,r.z),c=n.x*r.x+n.y*r.y+n.z*r.z;return o<.92||o>1.08||l<.92||l>1.08||Math.abs(c)>.08?null:{origin:t,axisU:n,axisV:r,width:s,height:a}}function Wc(i){if(!i||typeof i!="object")return null;const e=i,t=e.verticalBand&&typeof e.verticalBand=="object"?e.verticalBand:null,n=t&&typeof t.minY=="number"&&Number.isFinite(t.minY)&&typeof t.maxY=="number"&&Number.isFinite(t.maxY)&&t.maxY>t.minY?{minY:t.minY,maxY:t.maxY}:void 0,r=typeof e.sideMargin=="number"&&Number.isFinite(e.sideMargin)?Math.max(0,e.sideMargin):void 0,s=typeof e.doorwayClearance=="number"&&Number.isFinite(e.doorwayClearance)?Math.max(0,e.doorwayClearance):void 0;return!n&&r===void 0&&s===void 0?null:{verticalBand:n,sideMargin:r,doorwayClearance:s}}function Xc(i){if(!i||typeof i!="object")return null;const e=i,t=Array.isArray(e.floorOutline)?e.floorOutline.map(c=>In(c)).filter(c=>c!==null):[],n=e.bounds&&typeof e.bounds=="object"?e.bounds:null,r=n?In(n.min):null,s=n?In(n.max):null,a=typeof e.floorY=="number"&&Number.isFinite(e.floorY)?e.floorY:void 0,o=typeof e.ceilingY=="number"&&Number.isFinite(e.ceilingY)?e.ceilingY:void 0,l=typeof e.wallThickness=="number"&&Number.isFinite(e.wallThickness)?Math.max(.01,e.wallThickness):void 0;return t.length===0&&(!r||!s)&&a===void 0&&o===void 0&&l===void 0?null:{floorOutline:t.length>=3?t:void 0,bounds:r&&s?{min:r,max:s}:void 0,floorY:a,ceilingY:o,wallThickness:l}}function Gv(i){if(!i||typeof i!="object")return null;const e=i,t=Vc(i);if(!t)return null;const n=Vi(e.safePolygon),s=(Array.isArray(e.doorwayExclusions)?e.doorwayExclusions:[]).map(l=>Vi(l)).filter(l=>l!==null),a=Gc(e.hangingBand,t.height);if(!n||!a)return null;const o=l=>l.x>=0&&l.x<=t.width&&l.y>=0&&l.y<=t.height;return!n.every(o)||s.some(l=>!l.every(o))?null:{origin:t.origin,axisU:t.axisU,axisV:t.axisV,width:t.width,height:t.height,safePolygon:n,doorwayExclusions:s,hangingBand:a}}function $c(i){if(!i||typeof i!="object")return null;const e=i,t=In(e.position),n=In(e.target),r=e.verticalFovDeg,s=e.near,a=typeof e.far=="number"&&Number.isFinite(e.far)?e.far:40,o=Kn(e.lensShift);return!t||!n||typeof r!="number"||typeof s!="number"||!Number.isFinite(r)||!Number.isFinite(s)||!Number.isFinite(a)||r<15||r>100||s<=0||a<=s||Math.hypot(t.x-n.x,t.y-n.y,t.z-n.z)<.1?null:{position:t,target:n,verticalFovDeg:r,near:s,far:a,lensShift:o!=null?o:void 0}}function Vv(i){if(!Array.isArray(i)||i.length!==4)return null;const e=i.map(t=>Kn(t));return e.some(t=>t===null)?null:[e[0],e[1],e[2],e[3]]}function Vi(i){if(!Array.isArray(i)||i.length<3)return null;const e=i.map(t=>Kn(t));return e.some(t=>t===null)?null:e}function Wv(i){const e=Kn(i);return e!=null?e:void 0}function Xv(i){if(!i||typeof i!="object")return{...hn};const e=i;return Oc({width:typeof e.width=="number"?e.width:hn.width,height:typeof e.height=="number"?e.height:hn.height})}function $v(i,e){var g,v,p,m,b,x;if(!i||typeof i!="object")return null;const t=i,n=typeof t.id=="string"?t.id.trim():"",r=t.group==="right"?"right":"left",s=typeof t.planeAspect=="number"&&Number.isFinite(t.planeAspect)?Math.max(.25,Math.min(8,t.planeAspect)):NaN,a=Vv(t.quad);if(!n||Number.isNaN(s)||!a)return e.push(`wall "${n||"?"}" ignored: requires id, planeAspect, and a four-corner quad.`),null;if(Mr(a)||!Oi(a))return e.push(`wall "${n}" ignored: quad must be convex and non-degenerate.`),null;const o=(g=Vi(t.safePolygon))!=null?g:tn($a(a,.92)),l=(p=(v=Vi(t.drawableRegion))!=null?v:Vi(t.safePolygon))!=null?p:void 0,c=Array.isArray(t.exclusionPolygons)?t.exclusionPolygons.map(E=>Vi(E)).filter(E=>E!==null):void 0,u=Vc(t.transform),h=u?Gc(t.hangingBand,u.height):null,d=Gv(t.room);let f=d!=null?d:void 0;return t.room!==void 0&&!d&&t.transform===void 0&&e.push(`wall "${n}": v3 room plane is invalid; using the calibrated default plane when available.`),t.transform!==void 0&&!u&&e.push(`wall "${n}": transform is invalid; falling back to the legacy room plane when available.`),u&&(f={origin:gt(u.origin),axisU:gt(u.axisU),axisV:gt(u.axisV),width:u.width,height:u.height,safePolygon:(m=l!=null?l:d==null?void 0:d.safePolygon)!=null?m:[G(.14,.14),G(u.width-.14,.14),G(u.width-.14,u.height-.14),G(.14,u.height-.14)],doorwayExclusions:(b=c!=null?c:d==null?void 0:d.doorwayExclusions)!=null?b:[],hangingBand:(x=h!=null?h:d==null?void 0:d.hangingBand)!=null?x:{minY:.42,maxY:u.height-.28,margin:.08}}),vc(a)||e.push(`wall "${n}": quad was normalized to clockwise winding.`),Math.abs(Sr(o))<=1e-6&&e.push(`wall "${n}": safePolygon is degenerate; using a derived inset polygon.`),{id:n,group:r,planeAspect:s,quad:a,safePolygon:o,drawableRegion:l?tn(l):void 0,exclusionPolygons:c==null?void 0:c.map(E=>tn(E)),transform:u?so(u):f?{origin:gt(f.origin),axisU:gt(f.axisU),axisV:gt(f.axisV),width:f.width,height:f.height}:void 0,hangingBand:h!=null?h:f==null?void 0:f.hangingBand,shadowVector:Wv(t.shadowVector),room:f!=null?f:void 0}}function Yv(i){var d;if(!i||typeof i!="object")return null;const e=i,t=typeof e.wallId=="string"?e.wallId.trim():"",n=Kn(e.uv,!0),r=(d=Kn(e.center,!0))!=null?d:n?G(ut(n.x),ut(1-n.y)):null,s=Kn(e.anchor),a=s||n?8:.9,o=typeof e.mountedHeight=="number"&&Number.isFinite(e.mountedHeight)?Math.max(.04,Math.min(a,e.mountedHeight)):NaN,l=e.targetSizePolicy==="fixed-height"?"fixed-height":"contain",c=typeof e.minScale=="number"&&Number.isFinite(e.minScale)?Math.max(.4,Math.min(1,e.minScale)):.7,u=typeof e.maxScale=="number"&&Number.isFinite(e.maxScale)?Math.max(1,Math.min(2.5,e.maxScale)):1,h=typeof e.zOffset=="number"&&Number.isFinite(e.zOffset)?Math.max(.001,Math.min(.12,e.zOffset)):.02;return!t||!r||Number.isNaN(o)?null:{wallId:t,center:r,mountedHeight:o,anchor:s!=null?s:void 0,uv:n!=null?n:void 0,targetSizePolicy:l,minScale:c,maxScale:u,zOffset:h,provisional:e.provisional===!0}}function qv(i){if(!i||typeof i!="object")return null;const e=i,t=typeof e.cx=="number"&&Number.isFinite(e.cx)?ut(e.cx):NaN,n=typeof e.cy=="number"&&Number.isFinite(e.cy)?ut(e.cy):NaN,r=typeof e.maxW=="number"&&Number.isFinite(e.maxW)?ut(e.maxW):NaN,s=typeof e.maxH=="number"&&Number.isFinite(e.maxH)?ut(e.maxH):NaN,a=typeof e.rotateYDeg=="number"&&Number.isFinite(e.rotateYDeg)?Math.max(-45,Math.min(45,e.rotateYDeg)):0;return[t,n,r,s].some(Number.isNaN)||r<=0||s<=0?null:{cx:t,cy:n,maxW:r,maxH:s,rotateYDeg:a}}function Yc(i,e,t,n){var p,m;const r=e.replace(/^room-\d+\./,""),s=Nv.get(r);let a=s!=null?s:"";a||(a=i.cx<.25?"wall-left-outer":i.cx<.5?"wall-left-inner":i.cx<.75?"wall-right-inner":"wall-right-outer");const o=(p=t.find(b=>b.id===a))!=null?p:t[0],l=kv(o),c=G(i.cx*n.width,i.cy*n.height),u=(m=ws(l,c))!=null?m:G(.5,.5),h=G(c.x,c.y-i.maxH*n.height/2),d=G(c.x,c.y+i.maxH*n.height/2),f=ws(l,h),g=ws(l,d),v=f&&g?Math.abs(g.y-f.y):Math.max(.08,i.maxH*1.35);return{wallId:o.id,center:G(ut(u.x),ut(u.y)),mountedHeight:Math.max(.06,Math.min(.9,v)),provisional:!0}}function co(i){const e=i&&typeof i=="object"?i:{},t=typeof e.selectionTimeoutMs=="number"&&Number.isFinite(e.selectionTimeoutMs)?Math.max(250,Math.min(1e4,e.selectionTimeoutMs)):Lv;return{requireAllMapped:e.requireAllMapped!==!1,autoPlaceUnmapped:e.autoPlaceUnmapped!==!1,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:t,selectionTimeout:"open-exact-target-procedural"}}function qc(i){var A,C,N;const e=[];if(i==null)return{config:null,warnings:e,source:"built-in-default"};if(typeof i!="object"||Array.isArray(i))return e.push("museum-hub config ignored: expected a JSON object."),{config:null,warnings:e,source:"built-in-default"};const t=i,n=ro(),r=t.visualTokens&&typeof t.visualTokens=="object"?t.visualTokens:{};r.galleryWall!==void 0&&(Fc(r.galleryWall)?n.galleryWall=r.galleryWall.trim():e.push("visualTokens.galleryWall is not a valid #RRGGBB color; using default.")),r.museumWall!==void 0&&(Fc(r.museumWall)?r.museumWall.trim().toUpperCase()!==n.galleryWall.toUpperCase()&&e.push("visualTokens.museumWall differs from galleryWall; the authoritative gallery wall token is used everywhere."):e.push("visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.")),n.museumWall=n.galleryWall;const s=Xv(t.stage);let a=no,o=Gi,l=Gi;if(t.background&&typeof t.background=="object"){const S=t.background;typeof S.aspect=="number"&&Number.isFinite(S.aspect)&&S.aspect>.5&&S.aspect<4&&(a=S.aspect),typeof S.src=="string"&&S.src.trim()&&(o=S.src.trim())}if(t.backgroundFallback&&typeof t.backgroundFallback=="object"){const S=t.backgroundFallback;typeof S.src=="string"&&S.src.trim()&&(l=S.src.trim())}to(o)&&e.push(`museum-hub background "${o}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds will fall back at runtime.`),to(l)&&e.push(`museum-hub background fallback "${l}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds may continue on the neutral wall token.`);const c=(A=$c(t.camera))!=null?A:wr(Rs);t.camera!==void 0&&!$c(t.camera)&&e.push("museum-hub camera is invalid; using built-in calibrated camera.");const u=(C=Wc(t.hangingRules))!=null?C:Ls();t.hangingRules!==void 0&&!Wc(t.hangingRules)&&e.push("museum-hub hangingRules are invalid; using built-in doorway/band defaults.");const h=co(t.fallbacks),d=Array.isArray(t.slots)?t.slots:[];if(d.length===0)return e.push("museum-hub config ignored: expected a non-empty slots array."),{config:null,warnings:e,source:"built-in-default"};const f=Array.isArray(t.walls)?t.walls:[],g=f.map(S=>$v(S,e)).filter(S=>S!==null),v=new Map(Er().map(S=>[S.id,S])),p=(g.length>0?g:Er()).map(S=>{var P;if(S.room)return S;const M=(P=v.get(S.id))==null?void 0:P.room;return M?(e.push(`wall "${S.id}": missing v3 room plane; using built-in calibrated room plane.`),{...S,room:ao(M)}):S});f.length>0&&g.length===0&&e.push("museum-hub walls were invalid; using built-in calibrated wall planes.");const m=(N=Xc(t.room))!=null?N:Ds(p);t.room!==void 0&&!Xc(t.room)&&e.push("museum-hub room is invalid; deriving floor/ceiling layout from wall transforms.");const b=typeof t.version=="number"?t.version:1,x=new Set,E=[];let I="injected";for(const S of d){if(!S||typeof S!="object"){e.push("slot ignored: not an object.");continue}const M=S,P=typeof M.id=="string"?M.id.trim():"";if(!P){e.push("slot ignored: missing id.");continue}if(x.has(P)){e.push(`slot "${P}" ignored: duplicate slot ID.`);continue}x.add(P);const X=typeof M.artworkId=="string"&&M.artworkId.trim()?M.artworkId.trim():void 0,B=M.placement,V=Yv(B);let j=null;if(V)j=V;else{const D=qv(B);D&&(j=Yc(D,P,p,s),I=b>=2?"injected":"v1-migrated")}if(!j){e.push(`slot "${P}" ignored: requires a valid v2 placement or migratable v1 placement.`);continue}E.push({id:P,enabled:M.enabled!==!1,selectable:M.selectable!==!1,...X?{artworkId:X}:{},placement:j})}return E.length===0?{config:null,warnings:e,source:"built-in-default"}:(I==="v1-migrated"&&e.push("Version-1 museum-hub slots were migrated to the wall-plane v2 model. Review calibration output and re-save customer-artworks/museum-hub.json."),{config:{version:Math.max(4,b),coverage:"all-active-artworks",stage:s,background:{src:o,aspect:a},backgroundFallback:{src:l},visualTokens:n,camera:c,room:m,hangingRules:u,walls:p,fallbacks:h,slots:E},warnings:e,source:I})}function Zv(i){const e=[];if(!Array.isArray(i)||i.length===0)return{config:null,warnings:e,source:"built-in-default"};e.push("Legacy hub-hotspots.json configuration migrated automatically. Please move to customer-artworks/museum-hub.json.");const t=Er(),n=[],r=new Set,s=oo(0);let a=0;for(const o of i){if(!o||typeof o!="object"){e.push("legacy hotspot ignored: not an object.");continue}const l=o,c=typeof l.artworkId=="string"?l.artworkId.trim():"",u=typeof l.cx=="number"&&Number.isFinite(l.cx)?ut(l.cx):NaN,h=typeof l.cy=="number"&&Number.isFinite(l.cy)?ut(l.cy):NaN,d=typeof l.w=="number"&&Number.isFinite(l.w)?ut(l.w):NaN,f=typeof l.h=="number"&&Number.isFinite(l.h)?ut(l.h):NaN;if(!c||/^@order:/.test(c)||[u,h,d,f].some(Number.isNaN)){e.push(`legacy hotspot "${c||"?"}" could not be migrated.`);continue}const g=s.find(m=>!r.has(m.id)&&Math.abs(m.placement.center.x-u)<.12&&Math.abs(m.placement.center.y-h)<.12),v=g?g.id:`${Uc(0)}.legacy-${a+=1}`;if(r.has(v))continue;r.add(v);const p=Yc({cx:u,cy:h,maxH:f},v,t,hn);n.push({id:v,enabled:!0,selectable:!0,artworkId:c,placement:p})}return n.length===0?{config:null,warnings:e,source:"built-in-default"}:{config:{version:4,coverage:"all-active-artworks",stage:{...hn},background:{src:Gi,aspect:no},backgroundFallback:{src:Gi},visualTokens:ro(),camera:wr(Rs),room:Ds(t),hangingRules:Ls(),walls:t,fallbacks:co(void 0),slots:n},warnings:e,source:"legacy-migrated"}}function Kv(i,e,t){var $e,Q,ie,xe,ve,Ne,Oe,Ge,st,L,dt,qe,et,Me,it,Le;let n=qc(e);if(!n.config){const R=Zv(t);R.config&&(n={...R,warnings:[...n.warnings,...R.warnings]})}const r=[...n.warnings];let s=n.config?n.source:"built-in-default",a;n.config?a=n.config:(a={version:4,coverage:"all-active-artworks",stage:{...hn},background:{src:Gi,aspect:no},backgroundFallback:{src:Gi},visualTokens:ro(),camera:wr(Rs),room:Ds(Er()),hangingRules:Ls(),walls:Er(),fallbacks:co(void 0),slots:oo(0).map(R=>{const T=Fv[R.id];return T!==void 0&&i.some(U=>U.id===T)?{...R,artworkId:T}:R})},s="built-in-default");const o=Oc(a.stage),l=a.visualTokens,c=a.background,u=a.backgroundFallback,h=a.camera?wr(a.camera):wr(Rs),d=($e=a.room)!=null?$e:Ds(a.walls),f=(Q=a.hangingRules)!=null?Q:Ls(),g=a.fallbacks.selectionTimeoutMs,v=a.fallbacks.autoPlaceUnmapped,p=[];for(const R of a.walls){const T=Bc(R.quad),_=R.safePolygon?tn(R.safePolygon):tn($a(T,.92));let U=R.room?ao(R.room):void 0,$=null,Z=null,K={x:1,y:1},ae;const ne=Uv(T);if(U){const Ee=Tv(U,T,_,h,o,ne);Ee?(U=Ee.room,$=Ee.projectedQuad,Z=Ee.projectedSafePolygon,K={x:Ee.scaleX,y:Ee.scaleY},ae=Ee.realism):(r.push(`wall "${R.id}": room plane could not be reconciled to the reference quad; using the stored room transform.`),$=Ac(U,h,o),Z=Ja(U,h,U.safePolygon,o),$&&(ae=Ic(U,$,T,Z,_,ne))),ae&&!ae.passes&&r.push(`wall "${R.id}": projection realism failed (max residual ${ae.referenceResidualMaxPx.toFixed(1)}px, axis dot ${ae.axisDot.toFixed(3)}, convergence ${ae.projectedConvergence}).`)}const ue=T,De=_,re=Bi(ue),de=re?Ms(re):null;if(!re||!de){r.push(`wall "${R.id}" could not build a homography and will be ignored.`);continue}const ze=R.transform?so(R.transform):U?{origin:gt(U.origin),axisU:gt(U.axisU),axisV:gt(U.axisV),width:U.width,height:U.height}:null;if(!ze){r.push(`wall "${R.id}" is missing a room transform and will be ignored.`);continue}p.push({id:R.id,group:R.group,transform:ze,planeAspect:R.planeAspect,quad:ue,safePolygon:De,shadowVector:R.shadowVector?tt(R.shadowVector):void 0,room:U,camera:U?h:void 0,referenceQuad:T,referenceSafePolygon:_,projectedQuad:$,projectedSafePolygon:Z,localCalibrationScale:K,projectionRealism:ae,expectedConvergence:ne,homography:re,inverseHomography:de})}const m=new Map(p.map(R=>[R.id,R])),b=(xe=(ie=d.floorOutline)==null?void 0:ie.map(R=>gt(R)))!=null?xe:zc(a.walls),x=d.bounds?{min:gt(d.bounds.min),max:gt(d.bounds.max)}:Hc(a.walls,b),E={floorOutline:b,bounds:x,dimensions:{width:Math.max(.01,x.max.x-x.min.x),height:Math.max(.01,((ve=d.ceilingY)!=null?ve:x.max.y)-((Ne=d.floorY)!=null?Ne:x.min.y)),depth:Math.max(.01,x.max.z-x.min.z)},floorY:(Oe=d.floorY)!=null?Oe:x.min.y,ceilingY:(Ge=d.ceilingY)!=null?Ge:x.max.y,wallThickness:(st=d.wallThickness)!=null?st:.08,wallIds:p.map(R=>R.id)},I=new Map;i.forEach((R,T)=>I.set(R.id,T));const A=new Set,C=[],N=[];for(const R of a.slots){const T=Math.max(0,jv(R.id)),_=m.get(R.placement.wallId),U=(L=_==null?void 0:_.group)!=null?L:R.placement.wallId.includes("right")?"right":"left",$=(dt=_==null?void 0:_.localCalibrationScale)!=null?dt:{x:1,y:1},Z=lo(R.placement,_);_!=null&&_.room&&!R.placement.anchor&&r.push(`slot "${R.id}": room-local anchor missing; deriving it from the normalized center for calibrated placement.`);const K=(()=>{const ne=Ov(R.placement,_);return ne?G(ne.x*$.x,ne.y*$.y):Z&&(_!=null&&_.room)?G(Z.x*_.room.width,Z.y*_.room.height):_!=null&&_.room?G(R.placement.center.x*_.room.width,(1-R.placement.center.y)*_.room.height):void 0})(),ae={id:R.id,pageIndex:T,placement:{wallId:R.placement.wallId,center:Z?G(Z.x,1-Z.y):tt(R.placement.center),mountedHeight:_!=null&&_.room?R.placement.mountedHeight*$.y:R.placement.mountedHeight,anchor:K?tt(K):void 0,uv:Z?tt(Z):void 0,targetSizePolicy:(qe=R.placement.targetSizePolicy)!=null?qe:"contain",minScale:(et=R.placement.minScale)!=null?et:.7,maxScale:(Me=R.placement.maxScale)!=null?Me:1,zOffset:(it=R.placement.zOffset)!=null?it:.02,provisional:R.placement.provisional===!0},wallGroup:U};if(!R.enabled){C.push({...ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"explicitly-disabled",mappingSource:"explicit",artworkAspect:1});continue}if(!_){r.push(`slot "${R.id}" references unknown wall "${R.placement.wallId}"; slot disabled.`),C.push({...ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"missing-wall",mappingSource:"explicit",artworkAspect:1});continue}if(R.artworkId){const ne=I.get(R.artworkId);if(ne===void 0){r.push(`slot "${R.id}": artwork ID "${R.artworkId}" not in the active manifest; slot disabled.`),C.push({...ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"invalid-mapping",mappingSource:"explicit",artworkAspect:1});continue}if(A.has(R.artworkId)){r.push(`slot "${R.id}": artwork "${R.artworkId}" is already mapped; duplicate slot disabled.`),C.push({...ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"duplicate-mapping",mappingSource:"explicit",artworkAspect:1});continue}A.add(R.artworkId);const ue=i[ne];C.push({...ae,artworkId:R.artworkId,artworkIndex:ne,displayLabel:ue.title,selectable:R.selectable,disabledReason:R.selectable?null:"explicitly-disabled",mappingSource:"explicit",artworkAspect:Ns(ue)});continue}N.push({...ae,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:R.selectable,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1})}const S=v?i.filter(R=>!A.has(R.id)):[],M=new Map(io.map(R=>[R.suffix,R.intendedUse])),P=R=>{const T=R.id.replace(/^room-\d+\./,"");return M.get(T)},X=(R,T)=>{R.artworkId=T.id,R.artworkIndex=I.get(T.id),R.displayLabel=T.title,R.artworkAspect=Ns(T),A.add(T.id)},B=[];for(const R of S){const T=kc(Ns(R)),_=N.findIndex(U=>U.selectable&&!U.artworkId&&P(U)===T);_>=0?X(N[_],R):B.push(R)}for(const R of B){const T=N.find(_=>_.selectable&&!_.artworkId);T&&X(T,R)}for(const R of N)R.artworkId&&C.push(R);let V=i.filter(R=>!A.has(R.id));if(v&&V.length>0){let R=C.reduce((T,_)=>Math.max(T,_.pageIndex),0)+1;for(;V.length>0;){const T=oo(R).map($=>{var ae,ne,ue,De,re;const Z=m.get($.placement.wallId),K=(ae=Z==null?void 0:Z.localCalibrationScale)!=null?ae:{x:1,y:1};return{id:$.id,pageIndex:R,placement:{wallId:$.placement.wallId,center:tt($.placement.center),mountedHeight:Z!=null&&Z.room?$.placement.mountedHeight*K.y:$.placement.mountedHeight,anchor:Z!=null&&Z.room&&$.placement.anchor?G($.placement.anchor.x*K.x,$.placement.anchor.y*K.y):$.placement.anchor?tt($.placement.anchor):void 0,uv:$.placement.uv?tt($.placement.uv):void 0,targetSizePolicy:(ne=$.placement.targetSizePolicy)!=null?ne:"contain",minScale:(ue=$.placement.minScale)!=null?ue:.7,maxScale:(De=$.placement.maxScale)!=null?De:1,zOffset:(re=$.placement.zOffset)!=null?re:.02,provisional:!1},artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!0,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1,wallGroup:$.placement.wallId.includes("right")?"right":"left"}}),_=V.slice(0,Iv),U=new Set;for(const $ of _){const Z=kc(Ns($)),K=T.find(ne=>!ne.artworkId&&P(ne)===Z&&!U.has(ne.id)),ae=K!=null?K:T.find(ne=>!ne.artworkId);U.add(ae.id),X(ae,$)}C.push(...T.filter($=>$.artworkId)),V=i.filter($=>!A.has($.id)),R+=1}}for(const R of C){if(!R.selectable||!R.artworkId)continue;const T=m.get(R.placement.wallId);if(!T)continue;const _=Hv(T,R.placement,R.artworkAspect,o);_.adjusted&&(R.placement.center=_.center,_.anchor&&(R.placement.anchor=_.anchor),_.anchor&&(T!=null&&T.room)&&(R.placement.uv=G(ut(_.anchor.x/Math.max(.001,T.room.width)),ut(_.anchor.y/Math.max(.001,T.room.height))),R.placement.center=G(R.placement.uv.x,1-R.placement.uv.y)),R.placement.mountedHeight=_.mountedHeight,R.placement.provisional&&r.push(`slot "${R.id}": provisional placement was clamped to the wall drawable region.`))}const j=(R,T)=>{var ne,ue,De,re,de,ze,Ee,ye;const _=(ue=(ne=R.placement.uv)!=null?ne:lo(R.placement,T))!=null?ue:G(R.placement.center.x,1-R.placement.center.y),U=m.get(R.placement.wallId),$=(ze=(de=(De=U==null?void 0:U.room)==null?void 0:De.height)!=null?de:(re=T.room)==null?void 0:re.height)!=null?ze:1,Z=(ye=(Ee=T.room)==null?void 0:Ee.height)!=null?ye:$,K=R.placement.mountedHeight/Math.max(.001,$),ae={wallId:T.id,center:G(_.x,1-_.y),anchor:T.room?G(_.x*T.room.width,_.y*T.room.height):void 0,uv:tt(_),mountedHeight:T.room?Math.max(.04,K*Z):R.placement.mountedHeight,targetSizePolicy:R.placement.targetSizePolicy,minScale:R.placement.minScale,maxScale:R.placement.maxScale,zOffset:R.placement.zOffset,provisional:R.placement.provisional};return{projection:As(T,ae,R.artworkAspect,o),placement:ae}},D=new Map;for(const R of C){if(!R.selectable||!R.artworkId)continue;const T=m.get(R.placement.wallId);if(!T)continue;let _=null,U=null,$=null;const Z=zv(T.id,p,T.group);for(const K of Z){if(K.projectionRealism&&!K.projectionRealism.passes)continue;const ae=j(R,K);if(!(!ae.projection||!ae.projection.projectedQuad.every(ue=>qn(ue,K.safePolygon)))){_=K,U=ae.placement,$=ae.projection;break}}if(D.set(R.id,$),!_||!U||!$){R.selectable=!1,R.disabledReason=T.projectionRealism&&!T.projectionRealism.passes?"projection-realism":"invalid-projection",r.push(`slot "${R.id}": projected geometry is invalid and the slot was suppressed.`);continue}_.id!==T.id?(R.placement={...U,center:tt(U.center),anchor:U.anchor?tt(U.anchor):void 0,uv:U.uv?tt(U.uv):void 0},R.wallGroup=_.group,r.push(`slot "${R.id}": moved from "${T.id}" to fallback wall "${_.id}" after doorway/containment validation.`)):R.placement={...R.placement,center:tt(U.center),anchor:U.anchor?tt(U.anchor):void 0,uv:U.uv?tt(U.uv):void 0,mountedHeight:U.mountedHeight},$.shortEdge<Cs&&r.push(`slot "${R.id}": projected short edge ${$.shortEdge.toFixed(1)}px is below the ${Cs}px desktop guidance.`),R.placement.provisional&&r.push(`slot "${R.id}": placement was migrated provisionally and should be recalibrated.`)}const J=new Map;for(const R of C){const T=(Le=J.get(R.pageIndex))!=null?Le:[];T.push(R),J.set(R.pageIndex,T)}const q=[...J.entries()].sort((R,T)=>R[0]-T[0]).map(([R,T])=>({pageIndex:R,slots:T}));for(const R of q){const T=R.slots.filter(_=>_.selectable&&_.artworkId);for(let _=0;_<T.length;_+=1){const U=T[_],$=D.get(U.id);if($)for(let Z=_+1;Z<T.length;Z+=1){const K=T[Z],ae=D.get(K.id);ae&&Xa($.projectedQuad,ae.projectedQuad)&&r.push(`page ${R.pageIndex+1}: slot "${U.id}" overlaps slot "${K.id}".`)}}}const ce=new Map,fe=new Map;for(const R of C)R.selectable&&R.artworkId&&(ce.set(R.id,R.artworkId),fe.set(R.artworkId,R.id));const me=i.filter(R=>!fe.has(R.id)).length;me>0&&v&&r.push(`${me} active artwork(s) without a selectable slot.`);const Ce=new Map;for(const R of i)Ce.set(R.id,R.image);return{pages:q,slotToArtwork:ce,artworkToSlot:fe,artworkImageById:Ce,background:c,backgroundFallback:u,stage:o,visualTokens:l,camera:h,room:E,hangingRules:f,walls:p,wallById:m,selectionTimeoutMs:g,source:s,warnings:r,unmappedArtworkCount:me}}function jv(i){const e=/^room-(\d+)\./.exec(i);if(!e)return 0;const t=Number.parseInt(e[1],10);return Number.isFinite(t)&&t>=1?t-1:0}async function Qv(i,e){if(typeof window=="undefined"||typeof window.fetch!="function")return{ok:null,status:null,reason:"unsupported"};let t="";try{t=new URL(i,window.location.href).protocol}catch(s){return{ok:null,status:null,reason:"unsupported"}}if(t!=="http:"&&t!=="https:")return{ok:null,status:null,reason:"unsupported"};const n=typeof AbortController=="function"?new AbortController:null,r=window.setTimeout(()=>n==null?void 0:n.abort(),Math.max(250,Math.min(e,4e3)));try{const s=await window.fetch(i,{method:"HEAD",cache:"no-store",signal:n==null?void 0:n.signal});return s.status===405||s.status===501?{ok:null,status:s.status,reason:"unsupported"}:{ok:s.ok,status:s.status,reason:s.ok?"ok":"http-error"}}catch(s){return s instanceof DOMException&&s.name==="AbortError"?{ok:null,status:null,reason:"probe-timeout"}:{ok:null,status:null,reason:"network-error"}}finally{window.clearTimeout(r)}}function Jv(i,e,t){return new Promise(n=>{let r=!1;const s=c=>{r||(r=!0,window.clearTimeout(l),i.removeEventListener("load",a),i.removeEventListener("error",o),n({status:c}))},a=()=>s("loaded"),o=()=>s("error"),l=window.setTimeout(()=>s("timeout"),t);i.addEventListener("load",a),i.addEventListener("error",o),i.src=e})}function Zc(i){return i===null?"http-error":eo(i)?"http-404":`http-${i}`}function Kc(i,e,t,n){var r,s,a;return{assetRole:i.role,attempt:e.role,path:e.path,url:e.url,primaryPath:i.primaryPath,primaryUrl:i.primaryUrl,fallbackPath:(r=i.fallbackPath)!=null?r:null,fallbackUrl:(s=i.fallbackUrl)!=null?s:null,httpStatus:n,reason:t,referenceOnly:to(e.path),context:(a=i.context)!=null?a:null}}function e_(i,e){var n;const t=Pv(i.primaryUrl,(n=i.fallbackUrl)!=null?n:"",e);return!t||!i.fallbackPath?null:{role:"fallback",path:i.fallbackPath,url:t}}function t_(i,e,t,n){const r=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":eo(n)?"returned 404":`returned ${Zc(n)}`;i.diagnostics.warn("hub-asset-missing",`Hub ${i.role} asset ${r}; retrying shipped fallback without aborting`,Kc(i,e,t,n))}function n_(i,e,t,n){const r=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":eo(n)?"returned 404":`returned ${Zc(n)}`;i.diagnostics.warn("hub-asset-fallback-failed",e.role==="fallback"?`Hub ${i.role} asset and fallback ${r}; continuing with neutral museum-grey surface`:`Hub ${i.role} asset ${r}; continuing with neutral museum-grey surface`,Kc(i,e,t,n))}async function i_(i,e){const t=await Qv(e.url,i.timeoutMs);if(t.ok===!1)return{status:"failed",reason:"http-error",httpStatus:t.status};const n=await Jv(i.image,e.url,i.timeoutMs);return n.status==="loaded"?{status:"loaded",httpStatus:t.status}:n.status==="timeout"?{status:"failed",reason:t.reason==="probe-timeout"?"probe-timeout":"timeout",httpStatus:t.status}:t.reason==="network-error"?{status:"failed",reason:"network-error",httpStatus:t.status}:{status:"failed",reason:"image-error",httpStatus:t.status}}async function r_(i){var r,s;let e={role:"primary",path:i.primaryPath,url:i.primaryUrl},t=!1,n=null;for(;e;){const a=await i_(i,e);if(a.status==="loaded")return{status:e.role==="primary"?"loaded":"fallback-loaded",finalPath:e.path,finalUrl:e.url,httpStatus:a.httpStatus};n=a.httpStatus;const o=e_(i,t);if(e.role==="primary"&&o){t=!0,t_(i,e,a.reason,a.httpStatus),e=o;continue}return n_(i,e,a.reason,a.httpStatus),(r=i.onNeutralFallback)==null||r.call(i),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}return(s=i.onNeutralFallback)==null||s.call(i),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}const jc=512;function uo(i,e){return new Ue(i).multiplyScalar(e)}function s_(i){var t,n,r,s,a,o,l,c;if(!i.room)return null;const e=new Pa;e.moveTo(0,0),e.lineTo(i.room.width,0),e.lineTo(i.room.width,i.room.height),e.lineTo(0,i.room.height),e.lineTo(0,0);for(const u of i.room.doorwayExclusions){const h=new Ra;h.moveTo((n=(t=u[0])==null?void 0:t.x)!=null?n:0,(s=(r=u[0])==null?void 0:r.y)!=null?s:0);for(let d=1;d<u.length;d+=1)h.lineTo(u[d].x,u[d].y);h.lineTo((o=(a=u[0])==null?void 0:a.x)!=null?o:0,(c=(l=u[0])==null?void 0:l.y)!=null?c:0),e.holes.push(h)}return e}function Qc(i){const e=new Pa,t=i[0];e.moveTo(t.x,t.y);for(let n=1;n<i.length;n+=1)e.lineTo(i[n].x,i[n].y);return e.lineTo(t.x,t.y),e}class a_{constructor(e,t){y(this,"canvas");y(this,"renderer");y(this,"scene",new Sa);y(this,"camera");y(this,"resolution");y(this,"pageGroups",new Map);y(this,"slotMeshes",new Map);y(this,"placeholderTextures",new Map);y(this,"wallMaterial");y(this,"floorMaterial");y(this,"ceilingMaterial");y(this,"shadowMaterial");y(this,"activePageIndex",0);y(this,"disposed",!1);var n;this.resolution=t,this.renderer=new Cl({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(t.stage.width,t.stage.height,!1),this.renderer.outputColorSpace=Ct,this.renderer.toneMapping=0,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.renderer.setClearColor(new Ue(t.visualTokens.museumWall),1),this.renderer.domElement.classList.add("museum-hub__canvas"),e.appendChild(this.renderer.domElement),this.canvas=this.renderer.domElement,this.camera=new Ut(t.camera.verticalFovDeg,t.stage.width/t.stage.height,t.camera.near,(n=t.camera.far)!=null?n:40),this.camera.position.set(t.camera.position.x,t.camera.position.y,t.camera.position.z),this.camera.lookAt(t.camera.target.x,t.camera.target.y,t.camera.target.z),this.applyLensShift(),this.wallMaterial=new Ri({color:uo(t.visualTokens.museumWall,1),roughness:.96,metalness:.02,side:2}),this.floorMaterial=new Ri({color:uo(t.visualTokens.museumWall,.92),roughness:1,metalness:.02,side:2}),this.ceilingMaterial=new Ri({color:uo(t.visualTokens.museumWall,1.03),roughness:.98,metalness:.01,side:2}),this.shadowMaterial=new gi({color:0,transparent:!0,opacity:.18,depthWrite:!1}),this.buildRoom(),this.buildLights(),this.setActivePage(0),this.render()}setActivePage(e){this.activePageIndex=e;for(const[t,n]of this.pageGroups)n.visible=t===e;this.render()}setSlotHidden(e){const t=this.slotMeshes.get(e);t&&(t.group.visible=!1,this.render())}upsertSlot(e,t,n,r){var m,b;const s=this.ensureSlotState(e);if(!s||!t.room||!e.selectable||!e.artworkId){s&&(s.group.visible=!1),this.render();return}const a=e.placement.anchor,o=Tc(t.room);if(!a||!o){s.group.visible=!1,this.render();return}const l=!r&&n&&n.complete&&n.naturalWidth>0?n.currentSrc||n.src||`${e.id}:image`:`${e.id}:placeholder:${e.displayLabel}`;if(s.textureKey!==l){const x=!r&&n&&n.complete&&n.naturalWidth>0?this.imageTexture(n):this.placeholderTexture(e.displayLabel);s.textureKind==="image"&&((m=s.artworkMesh.material.map)==null||m.dispose()),s.artworkMesh.material.map=x,s.artworkMesh.material.needsUpdate=!0,s.textureKey=l,s.textureKind=r?"placeholder":"image"}const c=e.placement.mountedHeight*Math.max(.25,e.artworkAspect),u=e.placement.mountedHeight,h=(b=e.placement.zOffset)!=null?b:.02,d=Hi(t.room,a),f=new F(t.room.axisU.x,t.room.axisU.y,t.room.axisU.z).normalize(),g=new F(t.room.axisV.x,t.room.axisV.y,t.room.axisV.z).normalize(),v=new F(o.x,o.y,o.z).normalize(),p=new ft().makeBasis(f,g,v);s.group.matrixAutoUpdate=!1,p.setPosition(d.x+v.x*h,d.y+v.y*h,d.z+v.z*h),s.group.matrix.copy(p),s.group.matrixWorldNeedsUpdate=!0,s.group.visible=s.pageIndex===this.activePageIndex,s.artworkMesh.scale.set(c,u,1),s.shadowMesh.scale.set(c*1.04,u*1.04,1),s.shadowMesh.position.set(0,0,-.018),this.render()}dispose(){var e;if(!this.disposed){this.disposed=!0;for(const t of this.slotMeshes.values())t.textureKind==="image"&&((e=t.artworkMesh.material.map)==null||e.dispose()),t.artworkMesh.material.dispose(),t.shadowMesh.material.dispose();for(const t of this.placeholderTextures.values())t.dispose();this.wallMaterial.dispose(),this.floorMaterial.dispose(),this.ceilingMaterial.dispose(),this.shadowMaterial.dispose(),this.renderer.dispose(),this.slotMeshes.clear(),this.pageGroups.clear()}}applyLensShift(){var r,s,a,o;const e=(s=(r=this.resolution.camera.lensShift)==null?void 0:r.x)!=null?s:0,t=(o=(a=this.resolution.camera.lensShift)==null?void 0:a.y)!=null?o:0;if(this.camera.updateProjectionMatrix(),e===0&&t===0)return;const n=this.camera.projectionMatrix.elements;n[8]+=e*2,n[9]-=t*2,this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert()}buildLights(){const e=new ql(16777215,.72),t=new rg(16777215,13226968,.64),n=new cg(16777215,.8);n.position.set(-2.8,4.8,5.6),n.castShadow=!0,n.shadow.mapSize.set(1024,1024),n.shadow.camera.near=.5,n.shadow.camera.far=24,n.shadow.bias=-5e-4,this.scene.add(e,t,n)}buildRoom(){var t,n,r;for(const s of this.resolution.walls){if(!s.room)continue;const a=s_(s);if(!a)continue;const o=new fr(a),l=new rt(o,this.wallMaterial);l.receiveShadow=!0,l.matrixAutoUpdate=!1;const c=Tc(s.room),u=new F(s.room.axisU.x,s.room.axisU.y,s.room.axisU.z).normalize(),h=new F(s.room.axisV.x,s.room.axisV.y,s.room.axisV.z).normalize(),d=new F((t=c==null?void 0:c.x)!=null?t:0,(n=c==null?void 0:c.y)!=null?n:0,(r=c==null?void 0:c.z)!=null?r:1).normalize(),f=new ft().makeBasis(u,h,d);f.setPosition(s.room.origin.x,s.room.origin.y,s.room.origin.z),l.matrix.copy(f),l.matrixWorldNeedsUpdate=!0,this.scene.add(l)}const e=this.resolution.room.floorOutline.map(s=>new he(s.x,s.z));if(e.length>=3){const s=new rt(new fr(Qc(e)),this.floorMaterial);s.rotation.x=-Math.PI/2,s.position.y=this.resolution.room.floorY,s.receiveShadow=!0,this.scene.add(s);const a=new rt(new fr(Qc(e)),this.ceilingMaterial);a.rotation.x=Math.PI/2,a.position.y=this.resolution.room.ceilingY,this.scene.add(a)}}ensureSlotState(e){const t=this.slotMeshes.get(e.id);if(t)return t;const n=new gi({transparent:!0,toneMapped:!1,side:2}),r=new rt(new zn(1,1),n);r.castShadow=!0,r.receiveShadow=!1;const s=new rt(new zn(1,1),this.shadowMaterial.clone());s.renderOrder=1,r.renderOrder=2;const a=new Wn;a.add(s,r),this.ensurePageGroup(e.pageIndex).add(a);const l={pageIndex:e.pageIndex,group:a,artworkMesh:r,shadowMesh:s,textureKind:null,textureKey:null};return this.slotMeshes.set(e.id,l),l}ensurePageGroup(e){const t=this.pageGroups.get(e);if(t)return t;const n=new Wn;return n.visible=e===this.activePageIndex,this.pageGroups.set(e,n),this.scene.add(n),n}imageTexture(e){const t=new Et(e);return t.colorSpace=Ct,t.needsUpdate=!0,t.anisotropy=4,t}placeholderTexture(e){const t=this.placeholderTextures.get(e);if(t)return t;const n=document.createElement("canvas");n.width=jc,n.height=jc;const r=n.getContext("2d");if(!r){const l=new Ma(n);return this.placeholderTextures.set(e,l),l}r.fillStyle=this.resolution.visualTokens.museumWall,r.fillRect(0,0,n.width,n.height),r.strokeStyle="rgba(24, 32, 38, 0.22)",r.lineWidth=12,r.strokeRect(28,28,n.width-56,n.height-56),r.fillStyle="rgba(24, 32, 38, 0.72)",r.font="600 42px Inter, system-ui, sans-serif",r.textAlign="center",r.textBaseline="middle";const a=e.split(/\s+/).reduce((l,c)=>{var d;const u=(d=l[l.length-1])!=null?d:"",h=u?`${u} ${c}`:c;return h.length>14&&u?l.push(c):u?l[l.length-1]=h:l.push(c),l},[]).slice(0,3);a.forEach((l,c)=>{r.fillText(l,n.width/2,n.height/2+(c-(a.length-1)/2)*52)});const o=new Ma(n);return o.colorSpace=Ct,this.placeholderTextures.set(e,o),o}render(){this.disposed||this.renderer.render(this.scene,this.camera)}}const Jc=window.location.protocol==="file:"?"../customer-artworks/":"/",eu=5e3,o_="(max-aspect-ratio: 4/5)",l_=()=>{try{return new URLSearchParams(window.location.search).get("hubCalibrate")==="1"}catch(i){return!1}},c_=()=>{try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(i){return!1}};function tu(i){return window.location.protocol==="file:"?`${Jc}${i}`:`${Jc}${i.replace(/^Backgrounds\//,"backgrounds/")}`}class u_{constructor(e,t){y(this,"element");y(this,"diagnostics",Zt("hub"));y(this,"resolution");y(this,"visual");y(this,"stage");y(this,"hubRoomRenderer");y(this,"roomLayers",[]);y(this,"slotViews",[]);y(this,"entryButton");y(this,"status");y(this,"pager");y(this,"pagerPrev");y(this,"pagerNext");y(this,"pagerCounter");y(this,"narrowQuery");y(this,"imageReady");y(this,"calibrating");y(this,"debugGeometry");y(this,"stageWidth");y(this,"stageHeight");y(this,"resizeObserver");y(this,"calibrationOutput",null);y(this,"calibrationWarnings",null);y(this,"calibrationRestoreButton",null);y(this,"calibrationWallSelect",null);y(this,"calibrationSvg",null);y(this,"calibrationDrag",null);y(this,"activeCalibrationWallId",null);y(this,"lastValidCalibrationSnapshot",null);y(this,"activateCallback",null);y(this,"selectSlotCallback",null);y(this,"disposed",!1);y(this,"pageCount",1);y(this,"viewIndex",0);y(this,"narrowMode",!1);y(this,"lastActivatedSlotId",null);y(this,"selectedArtworkId",null);y(this,"lastSelectionSignature",null);y(this,"decodedPages",new Set);y(this,"idleDecodeHandle",null);y(this,"idleDecodeNextPage",1);y(this,"projectedSlotGeometry",new Map);y(this,"debugProjectionSignatureBySlot",new Map);y(this,"swipeStartX",null);y(this,"swipeStartY",null);y(this,"resizeRafId",0);y(this,"handleActivate",()=>{var e;this.entryButton.disabled||(this.setButtonsDisabled(!0),(e=this.activateCallback)==null||e.call(this))});y(this,"handleNarrowChange",()=>{const e=this.narrowMode;if(this.narrowMode=this.narrowQuery.matches,e!==this.narrowMode){const t=e?Math.floor(this.viewIndex/2):this.viewIndex;this.viewIndex=this.narrowMode?t*2:t,this.applyView()}});y(this,"handleResize",()=>{this.resizeRafId===0&&(this.resizeRafId=requestAnimationFrame(()=>{this.resizeRafId=0,this.updateStageScale(),this.applyView(),this.applyAllSlotGeometry(),this.debugGeometry&&this.emitDebugGeometrySnapshot("resize")}))});y(this,"handleKeydown",e=>{this.calibrating||(e.key==="ArrowLeft"?(this.stepView(-1),e.preventDefault()):e.key==="ArrowRight"&&(this.stepView(1),e.preventDefault()))});y(this,"handleSwipeStart",e=>{this.calibrating||(this.swipeStartX=e.clientX,this.swipeStartY=e.clientY)});y(this,"handleSwipeEnd",e=>{if(this.swipeStartX===null||this.swipeStartY===null)return;const t=e.clientX-this.swipeStartX,n=e.clientY-this.swipeStartY;this.swipeStartX=null,this.swipeStartY=null,!(Math.abs(t)<56||Math.abs(t)<Math.abs(n)*1.4)&&this.stepView(t<0?1:-1)});y(this,"handleCalibrationMove",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;const n=this.pointerEventToStage(e);if(n){if(t.kind==="slot"){const r=this.resolution.wallById.get(t.slot.placement.wallId);if(!r)return;const s=r.inverseHomography?this.applyInverseHomography(r,n):null;if(!s)return;if(t.mode==="move")t.slot.placement.center=G(this.clampLocalX(s.x),this.clampLocalY(s.y)),r.room&&(t.slot.placement.uv=G(t.slot.placement.center.x,1-t.slot.placement.center.y),t.slot.placement.anchor=G(t.slot.placement.center.x*r.room.width,(1-t.slot.placement.center.y)*r.room.height));else{const a=Math.abs(s.y-t.slot.placement.center.y)*2;t.slot.placement.mountedHeight=r.room?Math.max(.12,Math.min(r.room.height,a*r.room.height)):Math.max(.04,Math.min(.9,a))}this.applySlotGeometry(t.button,t.slot)}else{const r=this.resolution.wallById.get(t.wallId);if(!r)return;const a=(t.target==="quad"?r.quad:r.safePolygon)[t.index];if(!a)return;a.x=n.x,a.y=n.y,this.applyAllSlotGeometry()}this.renderCalibrationOverlay(),this.updateCalibrationOutput(!1)}});y(this,"handleCalibrationEnd",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;this.calibrationDrag=null;const n=e.currentTarget;n==null||n.removeEventListener("pointermove",this.handleCalibrationMove),n==null||n.removeEventListener("pointerup",this.handleCalibrationEnd),n==null||n.removeEventListener("pointercancel",this.handleCalibrationEnd),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)});var C,N,S;this.resolution=t,this.calibrating=l_(),this.debugGeometry=c_(),this.pageCount=Math.max(1,t.pages.length),this.stageWidth=t.stage.width,this.stageHeight=t.stage.height,this.activeCalibrationWallId=(N=(C=t.walls[0])==null?void 0:C.id)!=null?N:null;const n=document.createElement("section");n.className="museum-hub",n.setAttribute("aria-labelledby","museum-hub-title"),n.style.setProperty("--hub-aspect",String(t.background.aspect)),n.style.setProperty("--hub-stage-width",`${this.stageWidth}px`),n.style.setProperty("--hub-stage-height",`${this.stageHeight}px`),n.style.setProperty("--hub-stage-scale","1"),this.calibrating&&n.classList.add("is-calibrating"),this.debugGeometry&&n.classList.add("is-debug-geometry");const r=document.createElement("div");r.className="museum-hub__visual";const s=document.createElement("div");s.className="museum-hub__stage";const a=document.createElement("img");a.className="museum-hub__image",a.alt="",a.decoding="async",a.draggable=!1;const o=tu(t.background.src),l=tu(t.backgroundFallback.src),c=r_({image:a,role:"background",primaryPath:t.background.src,primaryUrl:o,fallbackPath:t.backgroundFallback.src,fallbackUrl:l,timeoutMs:eu,diagnostics:this.diagnostics,context:{hubSource:t.source,stage:`${t.stage.width}x${t.stage.height}`,selectableSlots:t.slotToArtwork.size},onNeutralFallback:()=>{n.classList.add("has-image-error")}}).then(M=>{if(M.status==="neutral-fallback"){n.classList.add("has-image-error");return}n.classList.remove("has-image-error")}).catch(M=>{n.classList.add("has-image-error"),this.diagnostics.warn("hub-asset-loader-unexpected","Hub background loader threw unexpectedly; continuing with neutral museum-grey surface",{primaryPath:t.background.src,fallbackPath:t.backgroundFallback.src,error:M})});s.appendChild(a),this.hubRoomRenderer=new a_(s,t);const u=document.createElement("div");u.className="museum-hub__shade",u.setAttribute("aria-hidden","true");const h=document.createElement("header");h.className="museum-hub__header";const d=document.createElement("p");d.className="museum-hub__eyebrow",d.textContent="FREYRAUM";const f=document.createElement("h1");f.id="museum-hub-title",f.className="museum-hub__title",f.textContent="Museum";const g=document.createElement("p");g.className="museum-hub__introduction",g.textContent="Wählen Sie ein Kunstwerk, um die Ausstellung zu betreten.",h.append(d,f,g);const v=document.createElement("button");v.className="museum-hub__destination",v.type="button",v.setAttribute("aria-describedby","museum-hub-entry-description"),v.innerHTML=`
      <span class="museum-hub__destination-frame" aria-hidden="true"></span>
      <span class="museum-hub__destination-label">Ausstellung betreten</span>
    `;const p=document.createElement("p");p.id="museum-hub-entry-description",p.className="sr-only",p.textContent="Öffnet die interaktive Galerie mit Navigation, Detailansicht und Informationen zu den Kunstwerken.";const m=document.createElement("p");m.className="museum-hub__status sr-only",m.setAttribute("role","status"),m.setAttribute("aria-live","polite");const b=document.createElement("nav");b.className="museum-hub__pager",b.setAttribute("aria-label","Museumsräume");const x=document.createElement("button");x.type="button",x.className="museum-hub__pager-arrow museum-hub__pager-arrow--prev",x.setAttribute("aria-label","Vorherige Wand"),x.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';const E=document.createElement("span");E.className="museum-hub__pager-counter",E.setAttribute("aria-live","polite");const I=document.createElement("button");I.type="button",I.className="museum-hub__pager-arrow museum-hub__pager-arrow--next",I.setAttribute("aria-label","Nächste Wand"),I.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',b.append(x,E,I),s.appendChild(v),r.appendChild(s),n.append(r,u,h,p,b,m),e.appendChild(n),this.element=n,this.visual=r,this.stage=s,this.entryButton=v,this.status=m,this.pager=b,this.pagerPrev=x,this.pagerNext=I,this.pagerCounter=E,this.entryButton.addEventListener("click",this.handleActivate),x.addEventListener("click",()=>this.stepView(-1)),I.addEventListener("click",()=>this.stepView(1)),this.buildSlots();const A=this.resolution.slotToArtwork.size>0;this.entryButton.hidden=A,this.narrowQuery=window.matchMedia(o_),this.narrowMode=this.narrowQuery.matches,this.narrowQuery.addEventListener("change",this.handleNarrowChange),this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.handleResize()):null,(S=this.resizeObserver)==null||S.observe(this.visual),window.addEventListener("resize",this.handleResize),n.addEventListener("pointerdown",this.handleSwipeStart,{passive:!0}),n.addEventListener("pointerup",this.handleSwipeEnd,{passive:!0}),n.addEventListener("keydown",this.handleKeydown),(this.calibrating||this.debugGeometry)&&(this.buildCalibrationOverlay(),this.calibrating&&this.buildCalibrationPanel(n),this.renderCalibrationOverlay()),this.imageReady=Promise.all([c,this.decodePageImages(0)]).then(()=>{this.applyView(!0),this.updateStageScale(),this.applyAllSlotGeometry(),this.applySelectionState("composition-ready"),this.scheduleIdlePageDecode(),this.calibrating&&this.updateCalibrationOutput(!0),this.debugGeometry&&this.emitDebugGeometrySnapshot("composition-ready"),this.diagnostics.info("composition-ready","Hub composition prepared",{pages:this.pageCount,selectableSlots:this.resolution.slotToArtwork.size,source:this.resolution.source,debugGeometry:this.debugGeometry})})}onActivate(e){this.activateCallback=e}onSelectSlot(e){this.selectSlotCallback=e}setSelectedArtworkId(e,t={}){var s;const n=e&&this.resolution.artworkToSlot.has(e)?e:null;this.selectedArtworkId=n;const r=n?this.slotViews.find(a=>a.slot.artworkId===n&&!a.button.disabled):void 0;r&&t.alignPage!==!1&&this.goToPage(r.slot.pageIndex,r.slot),this.applySelectionState((s=t.source)!=null?s:"external-selection-sync",{restoreFocus:t.restoreFocus===!0})}prepare(){return this.imageReady}enter(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="",this.scheduleIdlePageDecode(),this.applySelectionState("enter"),requestAnimationFrame(()=>this.focusInitialTarget()))}async exit(e){this.disposed||(this.cancelIdlePageDecode(),this.setButtonsDisabled(!0),this.status.textContent="Ausstellung wird geöffnet.",this.element.classList.add("is-exiting"),e||await new Promise(t=>window.setTimeout(t,520)),this.disposed||(this.element.hidden=!0))}showError(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",this.focusInitialTarget())}focusInitialTarget(){var r;const e=this.selectedArtworkId?this.slotViews.find(s=>s.slot.artworkId===this.selectedArtworkId&&!s.button.disabled):void 0;if(e){this.goToPage(e.slot.pageIndex,e.slot),e.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-selected-target");return}const t=this.lastActivatedSlotId?this.slotViews.find(s=>s.slot.id===this.lastActivatedSlotId&&!s.button.disabled):void 0;if(t){this.goToPage(t.slot.pageIndex,t.slot),t.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-restored-slot");return}const n=this.slotViews.find(s=>s.slot.selectable);((r=n==null?void 0:n.button)!=null?r:this.entryButton).focus({preventScroll:!0}),this.logSelectionLifecycle("focus-first-target")}applySelectionState(e,t={}){var s,a;let n;for(const o of this.slotViews){const l=!!this.selectedArtworkId&&o.slot.artworkId===this.selectedArtworkId;o.button.classList.toggle("is-selected",l),l?(o.button.setAttribute("aria-current","true"),n=o):o.button.removeAttribute("aria-current")}const r=`${e}:${(s=this.selectedArtworkId)!=null?s:"none"}:${(a=n==null?void 0:n.slot.id)!=null?a:"none"}:${this.viewIndex}`;this.lastSelectionSignature!==r&&(this.lastSelectionSignature=r,this.logSelectionLifecycle(e)),t.restoreFocus&&n&&n.button.focus({preventScroll:!0})}logSelectionLifecycle(e){var n,r,s;const t=this.selectedArtworkId?this.slotViews.find(a=>a.slot.artworkId===this.selectedArtworkId):void 0;this.diagnostics.info("hub-selection-lifecycle","Hub selection lifecycle updated",{reason:e,selectedArtworkId:this.selectedArtworkId,selectedSlotId:(n=t==null?void 0:t.slot.id)!=null?n:null,selectedPageIndex:(r=t==null?void 0:t.slot.pageIndex)!=null?r:null,currentViewIndex:this.viewIndex,currentWallFocus:(s=this.element.dataset.wallFocus)!=null?s:"full",lastActivatedSlotId:this.lastActivatedSlotId,renderedSlots:this.slotViews.length})}setButtonsDisabled(e){this.entryButton.disabled=e;for(const t of this.slotViews)t.button.disabled=e||!t.slot.selectable;e?(this.pagerPrev.disabled=!0,this.pagerNext.disabled=!0):(this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1)}buildSlots(){const e=document.createElement("div");e.className="museum-hub__rooms";for(const t of this.resolution.pages){const n=document.createElement("div");n.className="museum-hub__room",n.dataset.page=String(t.pageIndex);for(const r of t.slots){if(!this.calibrating&&!this.debugGeometry&&(!r.selectable||!r.artworkId))continue;const s=this.buildSlotButton(r);n.appendChild(s.button),this.slotViews.push(s)}e.appendChild(n),this.roomLayers.push(n)}this.stage.appendChild(e)}buildSlotButton(e){const t=document.createElement("button");t.type="button",t.className="museum-hub__artwork",t.dataset.slotId=e.id,e.artworkId&&(t.dataset.artworkId=e.artworkId);let n=null;if(e.selectable&&e.artworkId){t.setAttribute("aria-label",`Kunstwerk „${e.displayLabel}“ in der Ausstellung öffnen`),n=document.createElement("img"),n.className="museum-hub__art",n.alt="",n.decoding="async",n.draggable=!1,n.addEventListener("load",()=>{t.classList.remove("has-missing-image"),this.syncSlotRenderer({slot:e,button:t,image:n})}),n.addEventListener("error",()=>{t.classList.add("has-missing-image"),this.syncSlotRenderer({slot:e,button:t,image:n}),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.id,artworkId:e.artworkId})}),t.appendChild(n);const a=document.createElement("span");a.className="museum-hub__art-placeholder",a.textContent=e.displayLabel,t.appendChild(a)}else t.disabled=!0,t.classList.add("is-disabled-slot"),t.setAttribute("aria-label","Nicht verfügbarer Ausstellungsplatz"),t.setAttribute("aria-disabled","true");const r=document.createElement("span");if(r.className="museum-hub__artwork-label",r.setAttribute("aria-hidden","true"),r.textContent=this.calibrating||this.debugGeometry?`${e.id} · ${e.displayLabel}`:e.displayLabel,t.appendChild(r),this.calibrating){const a=document.createElement("span");a.className="museum-hub__artwork-handle",a.setAttribute("aria-hidden","true"),t.appendChild(a),t.disabled=!1,t.addEventListener("pointerdown",o=>{const l=o.target;this.startSlotCalibrationDrag(o,e,t,l!=null&&l.classList.contains("museum-hub__artwork-handle")?"resize":"move")})}else e.selectable&&t.addEventListener("click",()=>this.handleSlotClick(e));this.applySlotGeometry(t,e);const s={slot:e,button:t,image:n};return this.syncSlotRenderer(s),s}applySlotGeometry(e,t){var u,h,d;const n=this.resolution.wallById.get(t.placement.wallId);if(!n){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),this.hubRoomRenderer.setSlotHidden(t.id),e.style.width="0px",e.style.height="0px",e.style.clipPath="none",e.style.removeProperty("--hub-clip-path"),this.diagnostics.warn("hub-slot-missing-wall","Hub slot geometry skipped because the wall is missing",{slotId:t.id,wallId:t.placement.wallId});return}const r=As(n,t.placement,Math.max(.25,t.artworkAspect),this.resolution.stage);if(!r){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),this.hubRoomRenderer.setSlotHidden(t.id),e.style.width="0px",e.style.height="0px",e.style.clipPath="none",e.style.removeProperty("--hub-clip-path"),this.diagnostics.warn("hub-slot-projection-invalid","Hub slot projection is invalid and will not render interactively",{slotId:t.id,artworkId:t.artworkId,wallId:n.id,projectionRealism:n.projectionRealism});return}this.projectedSlotGeometry.set(t.id,r),e.classList.remove("is-invalid-geometry");const s=r.projectedQuad.reduce((f,g)=>({minX:Math.min(f.minX,g.x),maxX:Math.max(f.maxX,g.x),minY:Math.min(f.minY,g.y),maxY:Math.max(f.maxY,g.y)}),{minX:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY}),a=Math.max(1,s.maxX-s.minX),o=Math.max(1,s.maxY-s.minY),l=`polygon(${r.projectedQuad.map(f=>`${((f.x-s.minX)/a*100).toFixed(3)}% ${((f.y-s.minY)/o*100).toFixed(3)}%`).join(", ")})`;e.style.left=`${s.minX}px`,e.style.top=`${s.minY}px`,e.style.width=`${a}px`,e.style.height=`${o}px`,e.style.transform="none",e.style.clipPath=l,e.style.setProperty("--hub-clip-path",l);const c=(u=n.shadowVector)!=null?u:G(n.group==="left"?-10:10,16);e.style.setProperty("--hub-shadow-x",`${c.x}px`),e.style.setProperty("--hub-shadow-y",`${c.y}px`),this.syncSlotRenderer({slot:t,button:e,image:(d=(h=this.slotViews.find(f=>f.slot.id===t.id))==null?void 0:h.image)!=null?d:null}),this.debugGeometry&&this.logSlotProjection(t,n,r)}syncSlotRenderer(e){const t=this.resolution.wallById.get(e.slot.placement.wallId);if(!t)return;const n=e.button.classList.contains("has-missing-image")||!e.image||!e.image.complete||e.image.naturalWidth<=0;this.hubRoomRenderer.upsertSlot(e.slot,t,e.image,n)}applyAllSlotGeometry(){for(const e of this.slotViews)this.applySlotGeometry(e.button,e.slot);this.applySelectionState("geometry-refresh"),(this.calibrating||this.debugGeometry)&&this.renderCalibrationOverlay()}logSlotProjection(e,t,n){var a,o,l,c,u,h;const r=n.projectedQuad.map(d=>`${d.x.toFixed(1)},${d.y.toFixed(1)}`).join("|");if(this.debugProjectionSignatureBySlot.get(e.id)===r)return;this.debugProjectionSignatureBySlot.set(e.id,r);const s=n.projectedQuad.every(d=>qn(d,t.safePolygon));this.diagnostics.info("hub-debug-slot-projection","Projected slot geometry snapshot",{slotId:e.id,wallId:t.id,selectedArtworkId:this.selectedArtworkId,localAnchor:(a=e.placement.anchor)!=null?a:null,localQuad:n.localQuad,worldQuad:(o=n.worldQuad)!=null?o:null,projectedAnchor:(l=n.projectedAnchor)!=null?l:null,projectedQuad:n.projectedQuad,homography:t.homography,inverseHomography:t.inverseHomography,withinSafePolygon:s,shortEdgePx:Math.round(n.shortEdge*100)/100,placement:n.placement,validity:(c=n.validity)!=null?c:null,realism:(h=(u=n.realism)!=null?u:t.projectionRealism)!=null?h:null})}emitDebugGeometrySnapshot(e){if(!this.debugGeometry)return;const t=this.slotViews.filter(({slot:n})=>n.selectable&&!!n.artworkId).map(({slot:n})=>{var a,o,l,c,u,h,d;const r=this.resolution.wallById.get(n.placement.wallId),s=this.projectedSlotGeometry.get(n.id);return{slotId:n.id,wallId:n.placement.wallId,localQuad:(a=s==null?void 0:s.localQuad)!=null?a:null,worldQuad:(o=s==null?void 0:s.worldQuad)!=null?o:null,projectedAnchor:(l=s==null?void 0:s.projectedAnchor)!=null?l:null,projectedQuad:(c=s==null?void 0:s.projectedQuad)!=null?c:null,homography:(u=r==null?void 0:r.homography)!=null?u:null,inverseHomography:(h=r==null?void 0:r.inverseHomography)!=null?h:null,withinSafePolygon:r&&s?s.projectedQuad.every(f=>qn(f,r.safePolygon)):!1,validity:(d=s==null?void 0:s.validity)!=null?d:null}});this.diagnostics.info("hub-debug-geometry","Hub debug geometry snapshot",{reason:e,stage:this.resolution.stage,visualTokens:this.resolution.visualTokens,backgroundState:{imageError:this.element.classList.contains("has-image-error")},selection:{selectedArtworkId:this.selectedArtworkId,lastActivatedSlotId:this.lastActivatedSlotId},walls:this.resolution.walls.map(n=>({id:n.id,group:n.group,quad:n.quad,safePolygon:n.safePolygon,referenceQuad:n.referenceQuad,referenceSafePolygon:n.referenceSafePolygon,projectedQuad:n.projectedQuad,projectedSafePolygon:n.projectedSafePolygon,projectedDoorways:n.room&&n.camera?Cc(n.room,n.camera,this.resolution.stage):[],projectionRealism:n.projectionRealism,expectedConvergence:n.expectedConvergence})),slots:t})}scheduleIdlePageDecode(){if(this.disposed||this.idleDecodeHandle!==null)return;for(;this.idleDecodeNextPage<this.pageCount&&this.decodedPages.has(this.idleDecodeNextPage);)this.idleDecodeNextPage+=1;if(this.idleDecodeNextPage>=this.pageCount)return;const e=typeof window.requestIdleCallback=="function"?t=>window.requestIdleCallback(t,{timeout:4e3}):t=>window.setTimeout(t,600);this.idleDecodeHandle=e(()=>{if(this.idleDecodeHandle=null,this.disposed)return;const t=this.idleDecodeNextPage;this.idleDecodeNextPage+=1,this.decodePageImages(t).then(()=>this.scheduleIdlePageDecode())})}cancelIdlePageDecode(){this.idleDecodeHandle!==null&&(typeof window.cancelIdleCallback=="function"?window.cancelIdleCallback(this.idleDecodeHandle):window.clearTimeout(this.idleDecodeHandle),this.idleDecodeHandle=null)}decodePageImages(e){if(this.decodedPages.has(e))return Promise.resolve();this.decodedPages.add(e);const t=[];for(const n of this.slotViews){if(n.slot.pageIndex!==e||!n.image||!n.slot.artworkId)continue;const r=this.artworkImageSrc(n.slot);if(!r){n.button.classList.add("has-missing-image"),this.syncSlotRenderer(n);continue}n.image.src=r,t.push(new Promise(s=>{const a=window.setTimeout(s,eu),o=()=>{window.clearTimeout(a),s()};if(n.image.complete&&n.image.naturalWidth>0){n.button.classList.remove("has-missing-image"),this.syncSlotRenderer(n),o();return}n.image.addEventListener("load",o,{once:!0}),n.image.addEventListener("error",o,{once:!0})}))}return Promise.all(t).then(()=>{})}artworkImageSrc(e){const t=e.artworkId?this.resolution.artworkImageById.get(e.artworkId):void 0;return t!=null?t:null}handleSlotClick(e){var t;this.entryButton.disabled||(this.setButtonsDisabled(!0),this.lastActivatedSlotId=e.id,this.setSelectedArtworkId(e.artworkId,{alignPage:!1,source:"slot-click"}),this.status.textContent="Ausstellung wird geöffnet.",(t=this.selectSlotCallback)==null||t.call(this,e))}get viewCount(){return this.narrowMode?this.pageCount*2:this.pageCount}stepView(e){const t=this.viewIndex+e;t<0||t>=this.viewCount||(this.viewIndex=t,this.applyView())}goToPage(e,t){if(this.narrowMode){const n=(t==null?void 0:t.wallGroup)==="right"?1:0;this.viewIndex=e*2+n}else this.viewIndex=e;this.applyView()}applyView(e=!1){var s;if(this.disposed)return;this.viewIndex=Math.max(0,Math.min(this.viewCount-1,this.viewIndex));const t=this.narrowMode?Math.floor(this.viewIndex/2):this.viewIndex,n=this.narrowMode?this.viewIndex%2===0?"left":"right":"full";this.hubRoomRenderer.setActivePage(t);for(const a of this.roomLayers){const o=Number.parseInt((s=a.dataset.page)!=null?s:"0",10);a.classList.toggle("is-active",o===t)}this.element.dataset.wallFocus=n,n==="full"?(this.visual.style.setProperty("--hub-focus-scale","1"),this.visual.style.setProperty("--hub-focus-x","0%")):(this.visual.style.setProperty("--hub-focus-scale","1.9"),this.visual.style.setProperty("--hub-focus-x",n==="left"?"24%":"-24%"));for(const a of this.slotViews)a.button.classList.toggle("is-off-wall",n!=="full"&&a.slot.wallGroup!==n);const r=this.viewCount>1;this.pager.hidden=!r,r&&(this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1,this.pagerCounter.textContent=this.narrowMode?`Raum ${t+1}/${this.pageCount} · ${n==="left"?"Linke":"Rechte"} Wand`:`Raum ${t+1} / ${this.pageCount}`),this.applySelectionState(e?"initial-view":"view-change"),e||this.decodePageImages(t)}updateStageScale(){const e=this.visual.getBoundingClientRect();if(e.width<=0||e.height<=0)return;const t=Math.min(e.width/this.stageWidth,e.height/this.stageHeight);this.element.style.setProperty("--hub-stage-scale",String(t))}buildCalibrationOverlay(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.classList.add("museum-hub__calibration-svg"),e.setAttribute("viewBox",`0 0 ${this.stageWidth} ${this.stageHeight}`),e.setAttribute("aria-hidden","true"),this.stage.appendChild(e),this.calibrationSvg=e}buildCalibrationPanel(e){const t=document.createElement("div");t.className="museum-hub__calibration";const n=document.createElement("p");n.className="museum-hub__calibration-title",n.textContent="Hub-Kalibrierung — Wände, Safe-Zonen und Bildgrößen in customer-artworks/museum-hub.json speichern";const r=document.createElement("div");r.className="museum-hub__calibration-controls";const s=document.createElement("label");s.className="museum-hub__calibration-label",s.textContent="Aktive Wand";const a=document.createElement("select");a.className="museum-hub__calibration-select";for(const h of this.resolution.walls){const d=document.createElement("option");d.value=h.id,d.textContent=`${h.id} (${h.group})`,a.appendChild(d)}this.activeCalibrationWallId&&(a.value=this.activeCalibrationWallId),a.addEventListener("change",()=>{this.activeCalibrationWallId=a.value,this.renderCalibrationOverlay()}),s.appendChild(a);const o=document.createElement("button");o.type="button",o.className="museum-hub__calibration-restore",o.textContent="Letzte gültige Konfiguration wiederherstellen",o.disabled=!0,o.addEventListener("click",()=>this.restoreLastValidCalibrationSnapshot()),r.append(s,o);const l=document.createElement("p");l.className="museum-hub__calibration-label",l.textContent="Prüfungen";const c=document.createElement("ul");c.className="museum-hub__calibration-warnings";const u=document.createElement("textarea");u.className="museum-hub__calibration-output",u.readOnly=!0,u.rows=16,u.setAttribute("aria-label","Museum-Hub-Konfiguration als JSON"),t.append(n,r,l,c,u),e.appendChild(t),this.calibrationOutput=u,this.calibrationWarnings=c,this.calibrationRestoreButton=o,this.calibrationWallSelect=a}startSlotCalibrationDrag(e,t,n,r){e.preventDefault(),this.calibrationDrag={kind:"slot",slot:t,button:n,pointerId:e.pointerId,mode:r},n.setPointerCapture(e.pointerId),n.addEventListener("pointermove",this.handleCalibrationMove),n.addEventListener("pointerup",this.handleCalibrationEnd),n.addEventListener("pointercancel",this.handleCalibrationEnd)}startWallPointCalibrationDrag(e,t,n,r){e.preventDefault();const s=e.currentTarget;this.calibrationDrag={kind:"wall-point",wallId:t,pointerId:e.pointerId,target:n,index:r},s.setPointerCapture(e.pointerId),s.addEventListener("pointermove",this.handleCalibrationMove),s.addEventListener("pointerup",this.handleCalibrationEnd),s.addEventListener("pointercancel",this.handleCalibrationEnd)}pointerEventToStage(e){const t=this.visual.getBoundingClientRect();return t.width<=0||t.height<=0?null:G(Math.min(this.stageWidth,Math.max(0,(e.clientX-t.left)/t.width*this.stageWidth)),Math.min(this.stageHeight,Math.max(0,(e.clientY-t.top)/t.height*this.stageHeight)))}renderCalibrationOverlay(){if(!this.calibrationSvg)return;this.calibrationSvg.replaceChildren();const e=this.activeCalibrationWallId;for(const t of this.resolution.walls){const n=this.calibrating?t.id===e:!0,r=document.createElementNS("http://www.w3.org/2000/svg","polygon");r.setAttribute("points",this.pointsToSvg(t.quad)),r.setAttribute("class",`museum-hub__calibration-wall${n?" is-active":""}`),this.calibrating&&r.addEventListener("pointerdown",()=>{this.activeCalibrationWallId=t.id,this.calibrationWallSelect&&(this.calibrationWallSelect.value=t.id),this.renderCalibrationOverlay()}),this.calibrationSvg.appendChild(r);const s=document.createElementNS("http://www.w3.org/2000/svg","polygon");s.setAttribute("points",this.pointsToSvg(t.safePolygon)),s.setAttribute("class",`museum-hub__calibration-safe${n?" is-active":""}`),this.calibrationSvg.appendChild(s),this.debugGeometry&&(this.renderProjectedDoorwayDebugOverlay(t),this.renderWallDebugAxes(t)),!(!this.calibrating||!n)&&(t.quad.forEach((a,o)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"quad",o,a,"museum-hub__calibration-handle"))),t.safePolygon.forEach((a,o)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"safe",o,a,"museum-hub__calibration-handle museum-hub__calibration-handle--safe"))))}this.debugGeometry&&(this.renderCameraDebugGuides(),this.renderProjectedSlotDebugOverlay())}createCalibrationHandle(e,t,n,r,s){const a=document.createElementNS("http://www.w3.org/2000/svg","circle");return a.setAttribute("class",s),a.setAttribute("cx",r.x.toFixed(2)),a.setAttribute("cy",r.y.toFixed(2)),a.setAttribute("r","8"),a.addEventListener("pointerdown",o=>this.startWallPointCalibrationDrag(o,e,t,n)),a}renderWallDebugAxes(e){if(!this.calibrationSvg||!e.homography)return;const t=Zn(e.homography,.1,.1),n=Zn(e.homography,.28,.1),r=Zn(e.homography,.1,.28);if(!t||!n||!r)return;this.appendSvgLine(t,n,"museum-hub__debug-axis museum-hub__debug-axis--x"),this.appendSvgLine(t,r,"museum-hub__debug-axis museum-hub__debug-axis--y"),this.appendSvgCircle(t,"museum-hub__debug-origin",3.8);const s=e.projectionRealism,a=s?`${e.id} · ref ${s.referenceResidualMaxPx.toFixed(1)}px · ${s.projectedConvergence}`:e.id;this.appendSvgLabel(G(t.x+8,t.y-8),a,"museum-hub__debug-wall-label")}renderProjectedDoorwayDebugOverlay(e){if(!(!this.calibrationSvg||!e.room||!e.camera))for(const t of Cc(e.room,e.camera,this.resolution.stage)){const n=document.createElementNS("http://www.w3.org/2000/svg","polygon");n.setAttribute("points",this.pointsToSvg(t)),n.setAttribute("class","museum-hub__debug-doorway"),this.calibrationSvg.appendChild(n)}}renderProjectedSlotDebugOverlay(){var e;if(this.calibrationSvg)for(const{slot:t}of this.slotViews){if(!t.selectable||!t.artworkId)continue;const n=this.resolution.wallById.get(t.placement.wallId),r=this.projectedSlotGeometry.get(t.id);if(!n||!r||!n.homography)continue;const s=Zn(n.homography,t.placement.center.x,t.placement.center.y);this.calibrationSvg.appendChild(this.createProjectedQuadElement(r.projectedQuad)),s&&this.appendSvgCircle(s,"museum-hub__debug-slot-center",3.2),r.projectedQuad.forEach(o=>this.appendSvgCircle(o,"museum-hub__debug-slot-corner",2.8));const a=r.projectedQuad[0];if(a){const o=t.placement.anchor?`L ${t.placement.anchor.x.toFixed(2)},${t.placement.anchor.y.toFixed(2)}`:`L ${t.placement.center.x.toFixed(2)},${t.placement.center.y.toFixed(2)}`,l=s?`S ${s.x.toFixed(0)},${s.y.toFixed(0)}`:"S –",c=r.projectedAnchor?`P ${r.projectedAnchor.x.toFixed(0)},${r.projectedAnchor.y.toFixed(0)}`:"P –",u=t.artworkId&&t.artworkId===this.selectedArtworkId?"selected":"idle";this.appendSvgLabel(G(a.x+8,a.y-8),`${t.id} · ${t.placement.wallId} · ${u} · ${o} · ${l} · ${c} · ${(e=r.validity)!=null&&e.contained&&r.validity.doorwayClear&&r.validity.inHangingBand?"valid":"invalid"}`,"museum-hub__debug-slot-label")}}}renderCameraDebugGuides(){const e=this.resolution.camera,t=Es(e,{x:e.target.x,y:e.target.y,z:e.target.z-24},this.resolution.stage);t&&(this.appendSvgLine(G(0,t.y),G(this.stageWidth,t.y),"museum-hub__debug-horizon"),this.appendSvgLabel(G(12,Math.max(18,t.y-8)),"camera horizon","museum-hub__debug-camera-label"));for(const n of this.resolution.walls){if(!n.room)continue;const r=G(n.room.width/2,n.room.height/2),s=l=>({x:n.room.origin.x+n.room.axisU.x*l+n.room.axisV.x*r.y,y:n.room.origin.y+n.room.axisU.y*l+n.room.axisV.y*r.y,z:n.room.origin.z+n.room.axisU.z*l+n.room.axisV.z*r.y}),a=Es(e,s(r.x),this.resolution.stage),o=Es(e,s(r.x+40),this.resolution.stage);a&&o&&this.appendSvgLine(a,o,"museum-hub__debug-vanishing")}}createProjectedQuadElement(e){const t=document.createElementNS("http://www.w3.org/2000/svg","polygon");return t.setAttribute("points",this.pointsToSvg(e)),t.setAttribute("class","museum-hub__debug-slot-quad"),t}appendSvgLine(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","line");r.setAttribute("class",n),r.setAttribute("x1",e.x.toFixed(2)),r.setAttribute("y1",e.y.toFixed(2)),r.setAttribute("x2",t.x.toFixed(2)),r.setAttribute("y2",t.y.toFixed(2)),this.calibrationSvg.appendChild(r)}appendSvgCircle(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.setAttribute("class",t),r.setAttribute("cx",e.x.toFixed(2)),r.setAttribute("cy",e.y.toFixed(2)),r.setAttribute("r",n.toFixed(1)),this.calibrationSvg.appendChild(r)}appendSvgLabel(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","text");r.setAttribute("class",n),r.setAttribute("x",e.x.toFixed(2)),r.setAttribute("y",e.y.toFixed(2)),r.textContent=t,this.calibrationSvg.appendChild(r)}pointsToSvg(e){return e.map(t=>`${t.x.toFixed(2)},${t.y.toFixed(2)}`).join(" ")}applyInverseHomography(e,t){if(!e.inverseHomography)return null;const[n,r,s,a,o,l,c,u,h]=e.inverseHomography,d=c*t.x+u*t.y+h;return Math.abs(d)<=1e-6?null:G((n*t.x+r*t.y+s)/d,(a*t.x+o*t.y+l)/d)}clampLocalX(e){return Math.min(1,Math.max(0,e))}clampLocalY(e){return Math.min(1,Math.max(0,e))}collectCalibrationWarnings(){var n;const e=[];for(const r of this.resolution.walls)(Mr(r.quad)||!Oi(r.quad))&&e.push(`Wall ${r.id}: the calibrated wall quad must remain convex and non-degenerate.`),r.safePolygon.length<3&&e.push(`Wall ${r.id}: the safe polygon needs at least three points.`);const t=new Map;for(const r of this.slotViews){const{slot:s}=r;if(!s.selectable||!s.artworkId)continue;const a=this.resolution.wallById.get(s.placement.wallId);if(!a){e.push(`Slot ${s.id}: wall ${s.placement.wallId} is missing.`);continue}const o=As(a,s.placement,s.artworkAspect,this.resolution.stage);if(!o){e.push(`Slot ${s.id}: projected geometry is invalid.`);continue}o.projectedQuad.every(c=>qn(c,a.safePolygon))||e.push(`Slot ${s.id}: artwork extends outside the wall safe zone.`),o.shortEdge<Cs&&e.push(`Slot ${s.id}: projected short edge ${o.shortEdge.toFixed(1)}px is below ${Cs}px.`);const l=(n=t.get(s.pageIndex))!=null?n:[];l.push({slot:s,quad:o}),t.set(s.pageIndex,l)}for(const[r,s]of t)for(let a=0;a<s.length;a+=1){const o=s[a];for(let l=a+1;l<s.length;l+=1){const c=s[l];Xa(o.quad.projectedQuad,c.quad.projectedQuad)&&e.push(`Page ${r+1}: ${o.slot.id} overlaps ${c.slot.id}.`)}}return e}buildCurrentCalibrationConfig(){return{version:4,coverage:"all-active-artworks",stage:this.resolution.stage,background:this.resolution.background,backgroundFallback:this.resolution.backgroundFallback,visualTokens:this.resolution.visualTokens,camera:this.resolution.camera,room:{dimensions:this.resolution.room.dimensions,floorY:this.resolution.room.floorY,ceilingY:this.resolution.room.ceilingY,floorOutline:this.resolution.room.floorOutline.map(e=>({x:this.round(e.x),z:this.round(e.z)}))},hangingRules:this.resolution.hangingRules,walls:this.resolution.walls.map(e=>({id:e.id,group:e.group,planeAspect:Math.round(e.planeAspect*1e3)/1e3,quad:e.quad.map(t=>this.roundPoint(t)),safePolygon:e.safePolygon.map(t=>this.roundPoint(t)),...e.shadowVector?{shadowVector:this.roundPoint(e.shadowVector)}:{},...e.room?{room:{origin:e.room.origin,axisU:e.room.axisU,axisV:e.room.axisV,width:e.room.width,height:e.room.height,safePolygon:e.room.safePolygon.map(t=>this.roundPoint(t)),doorwayExclusions:e.room.doorwayExclusions.map(t=>t.map(n=>this.roundPoint(n))),hangingBand:e.room.hangingBand}}:{},...e.transform?{transform:e.transform}:{},...e.drawableRegion?{drawableRegion:e.drawableRegion}:{},...e.exclusionPolygons?{exclusionPolygons:e.exclusionPolygons}:{},...e.hangingBand?{hangingBand:e.hangingBand}:{}})),fallbacks:{requireAllMapped:!0,autoPlaceUnmapped:!0,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:this.resolution.selectionTimeoutMs,selectionTimeout:"open-exact-target-procedural"},slots:this.slotViews.map(({slot:e})=>({id:e.id,enabled:e.disabledReason!=="explicitly-disabled",selectable:e.selectable,...e.artworkId?{artworkId:e.artworkId}:{},placement:{wallId:e.placement.wallId,center:this.roundPoint(e.placement.center),...e.placement.anchor?{anchor:this.roundPoint(e.placement.anchor)}:{},...e.placement.uv?{uv:this.roundPoint(e.placement.uv)}:{},mountedHeight:this.round(e.placement.mountedHeight),...typeof e.placement.targetSizePolicy=="string"?{targetSizePolicy:e.placement.targetSizePolicy}:{},...typeof e.placement.minScale=="number"?{minScale:this.round(e.placement.minScale)}:{},...typeof e.placement.maxScale=="number"?{maxScale:this.round(e.placement.maxScale)}:{},...typeof e.placement.zOffset=="number"?{zOffset:this.round(e.placement.zOffset)}:{},...e.placement.provisional?{provisional:!0}:{}}}))}}updateCalibrationOutput(e){const t=this.buildCurrentCalibrationConfig(),n=this.collectCalibrationWarnings(),r=JSON.stringify(t,null,2);if(this.calibrationOutput&&(this.calibrationOutput.value=r),this.calibrationWarnings){this.calibrationWarnings.replaceChildren();const s=n.length>0?n:["Keine Warnungen — Konfiguration erfüllt alle Kalibrierungsprüfungen."];for(const a of s){const o=document.createElement("li");o.textContent=a,this.calibrationWarnings.appendChild(o)}}n.length===0&&e&&(this.lastValidCalibrationSnapshot=r,this.calibrationRestoreButton&&(this.calibrationRestoreButton.disabled=!1)),this.diagnostics.info("hub-calibration","Museum hub wall-plane calibration snapshot",{warnings:n,config:t})}restoreLastValidCalibrationSnapshot(){var n,r;if(!this.lastValidCalibrationSnapshot)return;const t=qc(JSON.parse(this.lastValidCalibrationSnapshot)).config;if(t){for(const s of t.walls){const a=this.resolution.wallById.get(s.id);if(!a)continue;a.quad.forEach((l,c)=>{l.x=s.quad[c].x,l.y=s.quad[c].y});const o=(n=s.safePolygon)!=null?n:[];a.safePolygon.splice(0,a.safePolygon.length,...o.map(l=>tt(l))),a.planeAspect=s.planeAspect,s.shadowVector&&(a.shadowVector=tt(s.shadowVector)),s.transform&&(a.transform=s.transform),a.drawableRegion=s.drawableRegion,a.exclusionPolygons=s.exclusionPolygons,a.hangingBand=s.hangingBand,s.room&&(a.room={origin:{...s.room.origin},axisU:{...s.room.axisU},axisV:{...s.room.axisV},width:s.room.width,height:s.room.height,safePolygon:s.room.safePolygon.map(tt),doorwayExclusions:s.room.doorwayExclusions.map(l=>l.map(tt)),hangingBand:{...s.room.hangingBand}})}for(const s of t.slots){const a=(r=this.slotViews.find(o=>o.slot.id===s.id))==null?void 0:r.slot;a&&(a.placement.wallId=s.placement.wallId,a.placement.center=tt(s.placement.center),a.placement.anchor=s.placement.anchor?tt(s.placement.anchor):void 0,a.placement.uv=s.placement.uv?tt(s.placement.uv):void 0,a.placement.mountedHeight=s.placement.mountedHeight,a.placement.targetSizePolicy=s.placement.targetSizePolicy,a.placement.minScale=s.placement.minScale,a.placement.maxScale=s.placement.maxScale,a.placement.zOffset=s.placement.zOffset,a.placement.provisional=s.placement.provisional===!0)}this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)}}round(e){return Math.round(e*1e3)/1e3}roundPoint(e){return G(this.round(e.x),this.round(e.y))}dispose(){var e;this.disposed||(this.disposed=!0,this.cancelIdlePageDecode(),this.resizeRafId!==0&&cancelAnimationFrame(this.resizeRafId),(e=this.resizeObserver)==null||e.disconnect(),this.narrowQuery.removeEventListener("change",this.handleNarrowChange),window.removeEventListener("resize",this.handleResize),this.element.removeEventListener("pointerdown",this.handleSwipeStart),this.element.removeEventListener("pointerup",this.handleSwipeEnd),this.element.removeEventListener("keydown",this.handleKeydown),this.entryButton.removeEventListener("click",this.handleActivate),this.activateCallback=null,this.selectSlotCallback=null,this.hubRoomRenderer.dispose(),this.projectedSlotGeometry.clear(),this.debugProjectionSignatureBySlot.clear(),this.slotViews.length=0,this.roomLayers.length=0,this.element.remove())}}class d_{constructor(e={}){y(this,"destinations",new Map);y(this,"options");y(this,"active",null);y(this,"transition",null);y(this,"generation",0);y(this,"disposed",!1);y(this,"state","loading");this.options=e}register(e){if(this.disposed)throw new Error("Cannot register a destination after disposal.");if(this.destinations.has(e.id))throw new Error(`Destination "${e.id}" is already registered.`);this.destinations.set(e.id,e)}async startAt(e){var n;if(this.active||this.transition)throw new Error("Destination router has already started.");const t=this.requireDestination(e);await((n=t.prepare)==null?void 0:n.call(t)),!this.disposed&&(await t.enter(),!this.disposed&&(this.active=t,this.setState(e==="hub"?"hub":"destination")))}navigate(e){var r;if(this.disposed||((r=this.active)==null?void 0:r.id)===e)return Promise.resolve(!1);if(this.transition)return this.transition;const t=this.requireDestination(e),n=++this.generation;return this.setState("transitioning"),this.transition=this.runTransition(t,n).finally(()=>{this.generation===n&&(this.transition=null)}),this.transition}async runTransition(e,t){var r,s,a,o;const n=this.active;try{return await((r=e.prepare)==null?void 0:r.call(e)),!this.isCurrent(t)||(await((s=n==null?void 0:n.exit)==null?void 0:s.call(n)),!this.isCurrent(t))||(await e.enter(),!this.isCurrent(t))?!1:(this.active=e,this.setState(e.id==="hub"?"hub":"destination"),!0)}catch(l){if(!this.isCurrent(t))return!1;if(n){if(await n.enter(),!this.isCurrent(t))return!1;this.active=n,this.setState(n.id==="hub"?"hub":"destination")}return(o=(a=this.options).onTransitionError)==null||o.call(a,e,l),!1}}requireDestination(e){const t=this.destinations.get(e);if(!t)throw new Error(`Unknown destination "${e}".`);return t}isCurrent(e){return!this.disposed&&this.generation===e}setState(e){var t,n,r,s;this.state=e,(s=(r=this.options).onStateChange)==null||s.call(r,e,(n=(t=this.active)==null?void 0:t.id)!=null?n:null)}get currentState(){return this.state}dispose(){this.disposed||(this.disposed=!0,this.generation+=1,this.destinations.forEach(e=>{var t;return(t=e.dispose)==null?void 0:t.call(e)}),this.destinations.clear(),this.active=null,this.transition=null)}}const h_=300,nu=200,f_=50;class p_{constructor(){y(this,"diagnostics",Zt("audio"));y(this,"audio",new Audio);y(this,"source",null);y(this,"disposed",!1);y(this,"suspended",!1);y(this,"shouldResumeAfterSuspend",!1);y(this,"state",{available:!1,loaded:!1,playing:!1,muted:!1,targetVolume:ki,liveVolume:ki,autoplayBlocked:!1,message:null,activeSource:null});y(this,"listeners",new Set);y(this,"fadeRafHandle",null);y(this,"fadeStartTime",0);y(this,"fadeStartGain",0);y(this,"fadeTargetGain",0);y(this,"fadeDurationMs",0);y(this,"fadeOnComplete",null);y(this,"tickFade",e=>{this.fadeStartTime===0&&(this.fadeStartTime=e);const t=e-this.fadeStartTime,n=this.fadeDurationMs>0?Math.min(1,t/this.fadeDurationMs):1,r=this.fadeStartGain+(this.fadeTargetGain-this.fadeStartGain)*n;if(this.audio.volume=Math.max(0,Math.min(1,r)),this.state={...this.state,liveVolume:this.audio.volume},this.emit(),n<1)this.fadeRafHandle=requestAnimationFrame(this.tickFade);else{this.fadeRafHandle=null,this.diagnostics.debug("audio-fade-complete","Volume fade completed",{gain:this.fadeTargetGain});const s=this.fadeOnComplete;this.fadeOnComplete=null,s==null||s()}});this.audio.preload="auto",this.audio.loop=!0,this.audio.defaultMuted=!1,this.audio.removeAttribute("muted"),this.audio.muted=!1,this.audio.volume=ki,this.bindEvents()}load(e){if(this.disposed)return;this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-load-mute-desync","Repairing muted state desync before loading source",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted);const t=this.pickPlayableSource(e);if(!t){this.audio.removeAttribute("src"),this.audio.load(),this.state={...this.state,available:!1,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:null},this.emit(),this.diagnostics.info("audio-load-empty","No background audio source available");return}this.source=t,this.audio.src=t.src,this.audio.load(),this.state={...this.state,available:!0,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:t},this.emit(),this.diagnostics.info("audio-load-start","Background audio source selected",{file:t.filename,ext:t.ext,mime:t.mime})}subscribe(e){return this.listeners.add(e),e({...this.state}),()=>this.listeners.delete(e)}getState(){return{...this.state}}hasSource(){return!!this.source}async play(e){if(this.disposed||!this.source||this.suspended||this.state.muted)return!1;if(this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-play-mute-desync","Repairing muted state desync before play",{reason:e,expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),!this.audio.paused&&this.state.playing)return this.shouldResumeAfterSuspend=!0,this.diagnostics.debug("audio-play-skip","Play request ignored because audio is already playing",{reason:e}),!0;this.shouldResumeAfterSuspend=!0,this.cancelFade(),this.audio.volume=0,this.state={...this.state,liveVolume:0};try{return await this.audio.play(),this.startFade(this.state.targetVolume,h_,"fade-in"),this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-play",`Background audio playing (${e})`,{reason:e}),!0}catch(t){this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume};const r=(t instanceof Error?t.name:"UnknownError")==="NotAllowedError";return this.state={...this.state,playing:!1,autoplayBlocked:r,message:r?"Klicken Sie auf Ton aktivieren, um Hintergrundmusik zu starten.":"Hintergrundmusik konnte nicht gestartet werden."},this.emit(),this.diagnostics.warn(r?"audio-play-blocked":"audio-play-failed",r?"Background audio blocked by autoplay policy":"Background audio failed to start",{reason:e,error:t}),this.diagnostics.debug("audio-resume-attempt","Play attempt outcome",{reason:e,blocked:r,success:!1}),!1}}pause(e){this.disposed||!this.source||(this.shouldResumeAfterSuspend=!1,this.startFade(0,nu,"fade-out",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-pause",`Background audio paused (${e})`,{reason:e}))}setMuted(e,t){if(!this.disposed){if(this.state.muted===e&&this.audio.muted===e){this.diagnostics.debug("audio-mute-unchanged","Mute request ignored because state is unchanged",{reason:t,muted:e});return}this.state.muted===e&&this.audio.muted!==e&&this.diagnostics.warn("audio-mute-state-desync","Repairing muted state desync between manager and audio element",{reason:t,expectedMuted:e,actualMuted:this.audio.muted}),this.audio.muted=e,this.state={...this.state,muted:e},e?(this.shouldResumeAfterSuspend=!1,this.startFade(0,nu,"fade-out-mute",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1}):!this.disposed&&this.source&&!this.suspended&&this.play(`unmute:${t}`),this.emit(),this.diagnostics.info("audio-mute-change",`Background audio mute changed (${t})`,{reason:t,muted:e})}}setVolume(e,t){if(this.disposed)return;const n=Math.max(0,Math.min(Yn,e));this.fadeRafHandle!==null?this.fadeTargetGain=n:this.state.muted||(this.audio.volume=n,this.state={...this.state,liveVolume:n}),this.state={...this.state,targetVolume:n},this.emit(),this.diagnostics.info("audio-volume-change",`Background audio volume changed (${t})`,{reason:t,targetGain:n,liveGain:this.audio.volume}),this.diagnostics.debug("audio-volume-map","Volume mapping record",{targetGain:n,displayPct:_s(n),liveGain:this.audio.volume,reason:t})}handleSuspend(e){this.disposed||this.suspended||(this.suspended=!0,this.shouldResumeAfterSuspend=!this.audio.paused&&!this.state.muted,this.cancelFade(),this.audio.paused||this.audio.pause(),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-lifecycle-suspend",`Background audio suspended (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}))}handleResume(e){this.disposed||!this.suspended||(this.suspended=!1,this.diagnostics.info("audio-lifecycle-resume",`Background audio resumed (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}),this.shouldResumeAfterSuspend&&!this.state.muted&&(this.diagnostics.debug("audio-resume-attempt","Attempting auto-resume after lifecycle resume",{reason:e}),this.play(`resume:${e}`)))}dispose(){this.disposed||(this.disposed=!0,this.cancelFade(),this.listeners.clear(),this.audio.pause(),this.audio.removeAttribute("src"),this.audio.load())}bindEvents(){this.audio.addEventListener("canplay",()=>{this.state={...this.state,loaded:!0},this.emit(),this.diagnostics.info("audio-canplay","Background audio can play")}),this.audio.addEventListener("playing",()=>{this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-playing","Background audio playing event")}),this.audio.addEventListener("pause",()=>{this.state={...this.state,playing:!1},this.emit(),this.diagnostics.debug("audio-pause-event","Background audio pause event")}),this.audio.addEventListener("ended",()=>{this.source&&(this.diagnostics.warn("audio-loop-restart","Audio ended unexpectedly while loop is enabled; restarting"),this.startFade(0,f_,"fade-out-loop",()=>{this.audio.currentTime=0,this.play("ended-fallback")}))}),this.audio.addEventListener("error",()=>{const e=this.audio.error;this.state={...this.state,playing:!1,message:"Hintergrundmusik konnte nicht geladen werden."},this.emit(),this.diagnostics.warn("audio-error","Background audio element emitted an error event",{code:e==null?void 0:e.code,message:e==null?void 0:e.message})}),this.audio.addEventListener("volumechange",()=>{this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-volumechange-mute-desync","Repairing muted state desync during volumechange",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),this.state={...this.state,muted:this.state.muted,liveVolume:this.audio.volume},this.emit()})}pickPlayableSource(e){if(!e||!Array.isArray(e.sources)||e.sources.length===0)return null;const t=e.sources.filter(r=>!!r&&typeof r.src=="string"&&typeof r.ext=="string"&&typeof r.mime=="string"&&typeof r.filename=="string");if(t.length===0)return null;if(typeof this.audio.canPlayType=="function"){for(const r of t){const s=this.audio.canPlayType(r.mime);if(s==="probably"||s==="maybe")return r}return null}if(e.selectedByImporter){const r=t.find(s=>{var a;return s.src===((a=e.selectedByImporter)==null?void 0:a.src)});if(r)return r}return t[0]}startFade(e,t,n,r){this.cancelFade(),this.fadeStartGain=this.audio.volume,this.fadeTargetGain=Math.max(0,Math.min(Yn,e)),this.fadeDurationMs=t,this.fadeOnComplete=r!=null?r:null,this.fadeStartTime=0,this.fadeRafHandle=requestAnimationFrame(this.tickFade),this.diagnostics.debug("audio-fade-start","Volume fade started",{label:n,from:this.fadeStartGain,to:this.fadeTargetGain,durationMs:t})}cancelFade(){this.fadeRafHandle!==null&&(cancelAnimationFrame(this.fadeRafHandle),this.fadeRafHandle=null,this.fadeOnComplete=null,this.diagnostics.debug("audio-fade-cancel","Volume fade cancelled"))}emit(){const e={...this.state};this.listeners.forEach(t=>t(e))}}const ho="freyraum.preferences.v1",jn=Zt("preferences");function fo(){try{const i=localStorage.getItem(ho);if(!i)return{};const e=JSON.parse(i);if(e&&typeof e=="object")return e}catch(i){jn.warn("storage-read-failed","Could not read stored preferences; falling back to defaults")}return{}}function po(i){try{localStorage.setItem(ho,JSON.stringify({...i,audioMuted:!1}))}catch(e){jn.warn("storage-write-failed","Could not persist preferences to localStorage")}}function m_(){var i,e,t;return(t=(e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-reduced-motion: reduce)"))==null?void 0:e.matches)!=null?t:!1}function iu(){var i,e,t;return(t=(e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-contrast: more)"))==null?void 0:e.matches)!=null?t:!1}class ru{constructor(){y(this,"prefs");y(this,"listeners",new Set);y(this,"motionMedia",(mu=window.matchMedia)==null?void 0:mu.call(window,"(prefers-reduced-motion: reduce)"));y(this,"contrastMedia",(gu=window.matchMedia)==null?void 0:gu.call(window,"(prefers-contrast: more)"));y(this,"handleSystemMotionChange",e=>{fo().reducedMotion===void 0&&(this.prefs.reducedMotion=e.matches,this.emit())});y(this,"handleSystemContrastChange",e=>{this.prefs.contrastMode==="auto"&&(this.prefs.highContrast=e.matches,this.emit())});var o,l,c,u,h;const e=fo(),t=e.quality&&e.quality in gr?e.quality:Kl,n=e.contrastMode==="high"?"high":"auto";let r=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)?Math.max(0,Math.min(Yn,e.audioVolume)):ki;const s=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)&&e.audioVolume<=0;s&&(r=ki,jn.warn("audio-volume-normalized","Normalized stored zero-volume state to startup default",{key:ho,stored:e.audioVolume,normalizedTo:r})),this.prefs={reducedMotion:(o=e.reducedMotion)!=null?o:m_(),highContrast:n==="high"?!0:iu(),contrastMode:n,quality:t,audioMuted:!1,audioVolume:r,alwaysShowChrome:e.alwaysShowChrome===!0};const a=e.audioMuted!==!1;(s||a)&&(po(this.prefs),jn.info("audio-startup-normalized","Normalized persisted startup audio state",{storedMuted:e.audioMuted,storedVolume:e.audioVolume,normalizedMuted:this.prefs.audioMuted,normalizedVolume:this.prefs.audioVolume})),(c=(l=this.motionMedia)==null?void 0:l.addEventListener)==null||c.call(l,"change",this.handleSystemMotionChange),(h=(u=this.contrastMedia)==null?void 0:u.addEventListener)==null||h.call(u,"change",this.handleSystemContrastChange),this.applyToDocument()}get current(){return{...this.prefs}}setReducedMotion(e){this.prefs.reducedMotion=e,this.emit()}setContrastMode(e){this.prefs.contrastMode=e,this.prefs.highContrast=e==="high"?!0:iu(),this.emit()}setQuality(e){e in gr&&(this.prefs.quality=e,this.emit())}setAudioMuted(e){this.prefs.audioMuted=e,this.emit()}setAudioVolume(e){this.prefs.audioVolume=Math.max(0,Math.min(Yn,e)),this.emit()}setAlwaysShowChrome(e){this.prefs.alwaysShowChrome!==e&&(this.prefs.alwaysShowChrome=e,jn.info("always-show-chrome","Clean-chrome preference changed",{value:e}),this.emit())}normalizeStartupAudio(e,t=!0){const n=this.prefs.audioVolume>0?this.prefs.audioVolume:ki,r=this.prefs.audioMuted||this.prefs.audioVolume!==n;if(this.prefs={...this.prefs,audioMuted:!1,audioVolume:n},r?jn.info("audio-startup-reset","Reset audio to startup defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}):jn.debug("audio-startup-reset-skip","Startup audio already matches required defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}),t){this.emit();return}po(this.prefs)}static hasStoredQuality(){return fo().quality!==void 0}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(){this.applyToDocument(),po(this.prefs),this.listeners.forEach(e=>e(this.current))}applyToDocument(){const e=document.documentElement;e.dataset.motion=this.prefs.reducedMotion?"reduced":"full",e.dataset.contrast=this.prefs.highContrast?"high":"auto",e.dataset.quality=this.prefs.quality,e.dataset.chromeMode=this.prefs.alwaysShowChrome?"visible":"clean"}dispose(){var e,t,n,r;(t=(e=this.motionMedia)==null?void 0:e.removeEventListener)==null||t.call(e,"change",this.handleSystemMotionChange),(r=(n=this.contrastMedia)==null?void 0:n.removeEventListener)==null||r.call(n,"change",this.handleSystemContrastChange),this.listeners.clear()}}function g_(){try{const i=document.createElement("canvas");return!!(i.getContext("webgl2")||i.getContext("webgl")||i.getContext("experimental-webgl"))}catch(i){return!1}}class v_{constructor(e){y(this,"samples",[]);y(this,"writeIndex",0);y(this,"filled",!1);y(this,"ema",16.7);y(this,"rolling",16.7);y(this,"lastNow",0);y(this,"cooldownUntil",0);y(this,"_sum",0);y(this,"_aboveCount",0);y(this,"_severeCount",0);y(this,"_sampleOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});y(this,"_readOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});y(this,"budgetMs");y(this,"windowSize");y(this,"emaAlpha");y(this,"cooldownMs");y(this,"severeFrameMs");y(this,"severeFrameLimit");var t,n,r,s,a;this.budgetMs=e.budgetMs,this.windowSize=Math.max(8,(t=e.windowSize)!=null?t:60),this.emaAlpha=(n=e.emaAlpha)!=null?n:.1,this.cooldownMs=(r=e.cooldownMs)!=null?r:600,this.severeFrameMs=(s=e.severeFrameMs)!=null?s:33,this.severeFrameLimit=(a=e.severeFrameLimit)!=null?a:5,this.samples.length=this.windowSize,this.samples.fill(this.budgetMs)}sample(e){if(this.lastNow===0)return this.lastNow=e,this.writeSnapshot(this._sampleOut,0,this._aboveCount,this._severeCount);const t=e-this.lastNow;this.lastNow=e;const n=Math.min(t,250);if(this.filled){const s=this.samples[this.writeIndex];this._sum-=s,s>this.budgetMs&&(this._aboveCount-=1),s>=this.severeFrameMs&&(this._severeCount-=1)}this.samples[this.writeIndex]=n,this._sum+=n,n>this.budgetMs&&(this._aboveCount+=1),n>=this.severeFrameMs&&(this._severeCount+=1),this.writeIndex=(this.writeIndex+1)%this.windowSize,this.writeIndex===0&&(this.filled=!0);const r=this.filled?this.windowSize:this.writeIndex;return this.rolling=this._sum/Math.max(1,r),this.ema=this.ema+this.emaAlpha*(n-this.ema),this.writeSnapshot(this._sampleOut,n,this._aboveCount,this._severeCount)}markNavigation(){this.cooldownUntil=(typeof performance!="undefined"?performance.now():0)+this.cooldownMs}markReadinessWork(){this.markNavigation()}markPresetChange(){this.markNavigation()}writeSnapshot(e,t,n,r){const s=typeof performance!="undefined"?performance.now():0,a=n>this.windowSize*.7,o=r>=this.severeFrameLimit;return e.dtMs=t,e.emaMs=this.ema,e.rollingMs=this.rolling,e.rollingFps=1e3/Math.max(.1,this.rolling),e.belowBudget=a||o,e.severeFrameCount=r,e.inCooldown=s<this.cooldownUntil,e}readSnapshot(){return this.writeSnapshot(this._readOut,0,this._aboveCount,this._severeCount)}}const Fs={gcEventsPerMinute:4,gcPauseP99Ms:1};function __(i){const e=[];return i.gcEventsPerMinute>Fs.gcEventsPerMinute&&e.push(`GC events/min ${i.gcEventsPerMinute} exceeds ${Fs.gcEventsPerMinute}`),i.gcPauseP99Ms>Fs.gcPauseP99Ms&&e.push(`GC pause P99 ${i.gcPauseP99Ms}ms exceeds ${Fs.gcPauseP99Ms}ms`),{checked:2,violations:e}}function su(){const i=performance.memory;return i?i.usedJSHeapSize:null}function au(i,e){if(i.length===0)return 0;const t=Math.min(i.length-1,Math.max(0,Math.ceil(e*i.length)-1));return i[t]}class x_{constructor(){y(this,"running",!1);y(this,"rafId",null);y(this,"startTime",0);y(this,"lastNow",0);y(this,"frameMs",[]);y(this,"lastHeapBytes",null);y(this,"peakHeapBytes",0);y(this,"startHeapBytes",null);y(this,"gcEventFrameMs",[]);y(this,"longTasks",0);y(this,"longTaskObserver",null)}start(){var t;if(this.running||typeof window=="undefined")return;this.running=!0,this.frameMs.length=0,this.gcEventFrameMs=[],this.longTasks=0,this.startTime=performance.now(),this.lastNow=this.startTime,this.lastHeapBytes=su(),this.startHeapBytes=this.lastHeapBytes,this.peakHeapBytes=(t=this.lastHeapBytes)!=null?t:0,this.installLongTaskObserver();const e=n=>{this.running&&(this.recordFrame(n),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}stop(){var e;return this.running=!1,this.rafId!==null&&typeof cancelAnimationFrame!="undefined"&&cancelAnimationFrame(this.rafId),this.rafId=null,(e=this.longTaskObserver)==null||e.disconnect(),this.longTaskObserver=null,this.report()}installLongTaskObserver(){if(typeof PerformanceObserver!="undefined")try{this.longTaskObserver=new PerformanceObserver(e=>{this.longTasks+=e.getEntries().length}),this.longTaskObserver.observe({entryTypes:["longtask"]})}catch(e){this.longTaskObserver=null}}recordFrame(e){const t=e-this.lastNow;if(this.lastNow=e,t<=0)return;this.frameMs.push(t);const n=su();n!==null&&(n>this.peakHeapBytes&&(this.peakHeapBytes=n),this.lastHeapBytes!==null&&n<this.lastHeapBytes&&this.gcEventFrameMs.push(t),this.lastHeapBytes=n)}report(){var g;const e=this.frameMs.length,t=e>0?this.lastNow-this.startTime:0,n=this.frameMs.reduce((v,p)=>v+p,0),r=e>0?n/e:0,s=e>0?this.frameMs.reduce((v,p)=>v+(p-r)*(p-r),0)/e:0,a=[...this.frameMs].sort((v,p)=>v-p),o=this.frameMs.map(v=>1e3/v),l=o.length>0?o.reduce((v,p)=>v+p,0)/o.length:0,c=o.length>0?o.reduce((v,p)=>v+(p-l)*(p-l),0)/o.length:0,u=[...this.gcEventFrameMs].sort((v,p)=>v-p),h=t>0?this.gcEventFrameMs.length/t*6e4:0,d=this.peakHeapBytes>0?this.peakHeapBytes/(1024*1024):null,f=this.startHeapBytes!==null&&this.lastHeapBytes!==null?(this.lastHeapBytes-this.startHeapBytes)/(1024*1024):null;return{frames:e,durationMs:Math.round(t),avgFrameMs:fn(r),p99FrameMs:fn(au(a,.99)),maxFrameMs:fn((g=a[a.length-1])!=null?g:0),frameStdDevMs:fn(Math.sqrt(s)),avgFps:fn(l),fpsStdDev:fn(Math.sqrt(c)),gcEventsPerMinute:fn(h),gcPauseP99Ms:fn(au(u,.99)),longTasks:this.longTasks,peakHeapMb:d!==null?fn(d):null,heapDeltaMb:f!==null?fn(f):null}}get isRunning(){return this.running}}function fn(i){return Math.round(i*100)/100}function y_(i){if(!i)return 0;const e=i.getIndex();if(e)return e.count/3;const t=i.getAttribute("position");return t?t.count/3:0}function b_(i){const e=[];let t=0;t+=1;const n=i.artworkMesh.geometry;n?n.getAttribute("position")||e.push("artworkMesh.geometry has no position attribute (corrupt buffer)"):e.push("artworkMesh.geometry is null/undefined (geometry ownership lost)");const r=y_(n);typeof i.maxArtworkTriangles=="number"&&(t+=1,r>i.maxArtworkTriangles&&e.push(`artwork triangle count ${Math.round(r)} exceeds max ${i.maxArtworkTriangles}`)),t+=1;const s=i.artworkMesh.material;(!s||Array.isArray(s)&&s.length===0)&&e.push("artworkMesh.material is missing (broken material binding)"),t+=1;const a=i.lights.filter(u=>u.castShadow).length;a!==i.expectedShadowCasterCount&&e.push(`shadow-casting light count ${a} != expected ${i.expectedShadowCasterCount}`),t+=1;let o=0,l=0;i.scene.traverse(u=>{o+=1,u==null&&(l+=1)}),l>0&&e.push(`${l} null/undefined node(s) found in scene graph`);const c=i.artworkMesh.position;return(!Number.isFinite(c.x)||!Number.isFinite(c.y)||!Number.isFinite(c.z))&&e.push("artworkMesh.position contains a non-finite value"),{checked:t,violations:e,measured:{artworkTriangles:Math.round(r),sceneChildren:o,shadowCasterCount:a}}}function S_(i){const e=new x_,t=Li(),n={startPerf:()=>{e.start(),t.info("perf-tools","perf-start","Performance metrics session started")},stopPerf:()=>{const r=e.stop();return t.info("perf-tools","perf-stop","Performance metrics session stopped",r),r},perfReport:()=>e.report(),checkInvariants:()=>{const r=b_(i());return r.violations.length>0?t.warn("perf-tools","invariant-violation","Structural invariant violation(s) detected",r):t.info("perf-tools","invariant-ok","All structural invariants hold",r),r},checkTier1Thresholds:r=>{const s=__(r!=null?r:e.report());return s.violations.length>0?t.warn("perf-tools","tier1-threshold-failed","Tier 1 performance threshold(s) failed",s):t.info("perf-tools","tier1-threshold-ok","Tier 1 performance thresholds passed",s),s}};return typeof window!="undefined"&&(window.__FREYRAUM_PERF_TOOLS__=n),e}const M_={high:"balanced",balanced:"battery",battery:null};class w_{constructor(e,t=4e3,n=!1){y(this,"diagnostics",Zt("quality"));y(this,"current");y(this,"suspended",!1);y(this,"locked");y(this,"holdOffUntil",0);y(this,"holdOffMs");this.current=e,this.holdOffMs=t,this.locked=n}evaluate(e,t){if(this.suspended||e.inCooldown)return null;const n=typeof performance!="undefined"?performance.now():0;if(n<this.holdOffUntil||!e.belowBudget)return null;const r=M_[this.current];return r?this.locked?(this.diagnostics.warn("locked-pressure","Sustained frame-budget pressure detected; automatic quality changes are disabled (quality lock)",{preset:this.current,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.holdOffUntil=n+this.holdOffMs,null):(this.diagnostics.warn("downgrade","Adaptive quality controller requested a downgrade",{from:this.current,to:r,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.current=r,this.holdOffUntil=n+this.holdOffMs,t.markPresetChange(),r):null}notifyManualPreset(e){this.current=e,this.suspended=!0,this.diagnostics.info("manual-override","Adaptive quality suspended after manual preset change",{preset:e})}get isSuspended(){return this.suspended}get isLocked(){return this.locked}suspendForUserOverride(){this.suspended=!0}}const E_="freyraum.backend",Us=Zt("backend");function T_(){try{return typeof window=="undefined"?!1:new URLSearchParams(window.location.search).get("backend")==="webgpu"}catch(i){return!1}}function A_(){try{return localStorage.getItem(E_)==="webgpu"}catch(i){return!1}}function ou(){return typeof navigator!="undefined"&&"gpu"in navigator&&navigator.gpu!==void 0}async function C_(){const i=T_()||A_();return Us.debug("detect","Evaluating render backend",{optedIn:i,hasNavigatorGPU:ou()}),i&&ou()?"webgpu-experimental":"webgl"}async function R_(){if(await C_()!=="webgpu-experimental")return null;try{Us.info("probe-start","Starting WebGPU probe");const t=await import(new URL("./webgpu-probe.js",window.location.href).toString());if(typeof t.initWebGPUPrototype!="function")throw new Error("webgpu-probe.js does not export initWebGPUPrototype()");const n=await t.initWebGPUPrototype();return Us.info("probe-success","WebGPU probe completed successfully"),n}catch(e){return Us.warn("probe-failed","WebGPU probe failed; staying on WebGL",e),null}}function lu(){const i=window.innerWidth,e=window.innerHeight,t=e>=i,n=mo("(pointer: coarse)"),r=mo("(pointer: fine)"),s=mo("(hover: hover)"),a=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1;let o;return i<360?o="phone-small":i<600?o="phone-portrait":i<900&&t?o="tablet-portrait":i<900?o="phone-landscape":i<1180?o="tablet-landscape":o="desktop",{layoutTier:o,pointerPrimary:n?"coarse":r?"fine":"none",hasHover:s,dpr:a,orientation:t?"portrait":"landscape",viewportW:i,viewportH:e}}function cu(i){const e=document.documentElement;e.dataset.layoutTier=i.layoutTier,e.dataset.pointerPrimary=i.pointerPrimary,e.dataset.hover=i.hasHover?"true":"false",e.dataset.orientation=i.orientation,e.dataset.shortHeight=i.viewportH<500?"true":"false"}function mo(i){var e,t,n;try{return(n=(t=(e=window.matchMedia)==null?void 0:e.call(window,i))==null?void 0:t.matches)!=null?n:!1}catch(r){return!1}}const P_="entry-balanced",I_="freyraum:startup-readiness",L_="startup",go={defaultPreEntryWarmCount:5,defaultPostRevealFrameBudgetMs:8,defaultPostRevealBatchCap:2};function uu(i){if(!i)return null;const e=i.trim().toLowerCase();return e==="full"||e==="strict"||e==="all"?"full":e==="entry-balanced"||e==="balanced"?"entry-balanced":e==="entry-minimal"||e==="minimal"?"entry-minimal":null}function D_(){try{const i=new URLSearchParams(window.location.search),e=uu(i.get(L_));if(e)return e}catch(i){}try{const i=uu(localStorage.getItem(I_));if(i)return i}catch(i){}return P_}function N_(i){return i==="phone-small"||i==="phone-portrait"||i==="phone-landscape"}function F_(i,e,t,n){if(i==="full"||t<=1)return Math.max(1,t);const s=Math.max(1,Math.round(n))*2+1;if(i==="entry-minimal")return du(s,t);const a=N_(e)?2:4;return du(s+a,t)}function du(i,e){return Math.max(1,Math.min(e,Math.round(i)))}const hu=new F,fu=new F,U_=500,k_=go.defaultPreEntryWarmCount,O_=go.defaultPostRevealFrameBudgetMs,B_=go.defaultPostRevealBatchCap,z_=["high","balanced","battery"];function Qn(){return new Promise(i=>requestAnimationFrame(()=>i()))}async function pu(i){for(let e=0;e<i;e+=1)await Qn()}function ks(i){const e=Number.parseFloat(i);if(Number.isFinite(e))return e;const t=i.match(/-?\d+(?:\.\d+)?/);return t?Number.parseFloat(t[0]):0}function H_(){try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(i){return!1}}function nn(i){if(!i)return null;const e=i.trim();if(!e)return null;const t=new Ue;try{return t.setStyle(e),`#${t.getHexString().toUpperCase()}`}catch(n){return null}}function G_(i){if(!document.body)return null;const e=document.createElement("div");e.className=i,e.style.position="fixed",e.style.left="-10000px",e.style.top="-10000px",e.style.width="4px",e.style.height="4px",document.body.appendChild(e);const t=getComputedStyle(e),n={backgroundColor:t.backgroundColor,backgroundImage:t.backgroundImage};return e.remove(),n}function Ln(i){const e=new he;return i.getSize(e),{width:e.x,height:e.y,pixelRatio:i.getPixelRatio()}}function V_(i,e){const t=[".topbar",".info-panel",".nav-controls",".nav-btn",".zoom-controls",".zoom-btn",".prefs",".prefs__trigger",".timeline",".timeline__arrow",".timeline__counter",".timeline__thumb",".audio-controls",".audio-controls button",".fullscreen-btn"];let n=0;for(const a of t)i.querySelectorAll(a).forEach(o=>{o.offsetWidth,o.offsetHeight,o.getBoundingClientRect(),getComputedStyle(o).opacity,n+=1});let r=0;const s=i.querySelector(".prefs__panel");return s!=null&&s.hidden&&(s.hidden=!1,s.style.visibility="hidden",s.style.pointerEvents="none",s.offsetHeight,s.querySelectorAll("input, label, fieldset, legend, h2, p").forEach(a=>{a.offsetHeight,getComputedStyle(a).fontSize,n+=1}),s.hidden=!0,s.style.removeProperty("visibility"),s.style.removeProperty("pointer-events"),r+=1),e.info("boot","ui-prebuild-complete","Interactive chrome prebuilt under loading overlay",{elementsMeasured:n,temporarilyOpenedPanels:r}),{elementsMeasured:n,temporarilyOpenedPanels:r}}function W_(i,e){const t=i.layoutTier==="phone-small"||i.layoutTier==="phone-portrait"||i.layoutTier==="phone-landscape",n=i.layoutTier==="tablet-portrait"||i.layoutTier==="tablet-landscape",r=t?1:2;let s=k_,a=O_,o=B_;return t?(s=4,a=5,o=1):n?(s=5,a=6,o=1):(s=7,a=8,o=2),e>=50&&(s=Math.max(3,s-1),o=1),{criticalRadius:r,preEntryWarmCount:Math.min(e,s),postRevealFrameBudgetMs:a,postRevealBatchCap:o}}function X_(i,e){if(i==null)return null;if(!Array.isArray(i))return e.warn("boot","artworks-injected-invalid","Ignoring injected artworks: not an array",{typeOf:typeof i}),null;const t=[],n=new Set;let r=0;for(const s of i){if(!s||typeof s!="object"){r++;continue}const a=s,o=typeof a.id=="string"?a.id.trim():"",l=typeof a.image=="string"?a.image.trim():"",c=a.dimensions,u=typeof(c==null?void 0:c.width)=="number"&&Number.isFinite(c.width)?c.width:0,h=typeof(c==null?void 0:c.height)=="number"&&Number.isFinite(c.height)?c.height:0;if(!o||!l||u<=0||h<=0||n.has(o)){r++;continue}n.add(o);const d=typeof a.title=="string"&&a.title?a.title:o,f=a.tags,g=Array.isArray(f)?f.filter(m=>typeof m=="string"):[],v=typeof a.webglImage=="string"?a.webglImage:"",p=/^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/]/.test(v)?v:void 0;t.push({id:o,title:d,subtitle:typeof a.subtitle=="string"?a.subtitle:"",description:typeof a.description=="string"?a.description:"",year:typeof a.year=="number"&&Number.isFinite(a.year)?a.year:new Date().getFullYear(),medium:typeof a.medium=="string"?a.medium:"",image:l,...p?{webglImage:p}:{},dimensions:{width:u,height:h},alt:typeof a.alt=="string"?a.alt:d,credit:typeof a.credit=="string"?a.credit:"",tags:g,surface:typeof a.surface=="string"?a.surface:""})}return r>0&&e.warn("boot","artworks-injected-rejected","Some injected artworks were rejected",{rejected:r,accepted:t.length}),t}function $_(i,e){var o;if(i==null||typeof i!="object")return null;const t=i,r=(Array.isArray(t.sources)?t.sources:[]).map(l=>l).filter(l=>l&&typeof l.src=="string"&&typeof l.ext=="string"&&typeof l.mime=="string"&&typeof l.filename=="string").map(l=>({src:l.src.trim(),ext:l.ext.trim().toLowerCase(),mime:l.mime.trim().toLowerCase(),filename:l.filename.trim()})).filter(l=>l.src.startsWith("./audio/")&&/^audio\/[a-z0-9.+-]+$/.test(l.mime)&&[".mp3",".ogg",".m4a",".wav"].includes(l.ext));if(r.length===0)return null;const s=t.selectedByImporter&&typeof t.selectedByImporter=="object"?t.selectedByImporter:null,a=s?r.find(l=>l.src===s.src&&l.ext===s.ext&&l.mime===s.mime&&l.filename===s.filename):void 0;return e.info("boot","audio-source-resolved","Background audio payload resolved",{sources:r.map(l=>({file:l.filename,ext:l.ext,mime:l.mime})),selectedByImporter:(o=a==null?void 0:a.filename)!=null?o:null}),{sources:r,...a?{selectedByImporter:a}:{}}}function Os(i,e,t){var s,a;const n=(s=nn(e.galleryWall))!=null?s:e.galleryWall.trim(),r=(a=nn(e.museumWall))!=null?a:n;return document.documentElement.style.setProperty("--color-gallery-wall",n),document.documentElement.style.setProperty("--color-museum-wall",r),document.documentElement.style.backgroundColor=n,document.body.style.backgroundColor=n,i.style.backgroundColor=n,t==null||t.setWallClearColor(n),{galleryWall:n,museumWall:r}}function Y_(){const i=nn(getComputedStyle(document.documentElement).getPropertyValue("--color-gallery-wall"));return i!=null?i:"#D8DDDB"}function Bs(i,e,t,n,r,s,a){var P,X,B,V,j,D,J,q,ce;const o=getComputedStyle(document.documentElement),l=o.getPropertyValue("--color-gallery-wall").trim(),c=o.getPropertyValue("--color-museum-wall").trim(),u=(P=n==null?void 0:n.renderer.getClearColor(new Ue))!=null?P:null,h=u?`#${u.getHexString().toUpperCase()}`:null,d=r?getComputedStyle(r):null,f=G_("fallback-screen"),g=getComputedStyle(document.body),v=getComputedStyle(a),p=s?getComputedStyle(s):null,m=nn(t.galleryWall),b=nn(t.museumWall),x=nn(l),E=nn(c),I=nn((X=d==null?void 0:d.backgroundColor)!=null?X:null),A=nn((B=f==null?void 0:f.backgroundColor)!=null?B:null),C=nn(g.backgroundColor),N=nn(v.backgroundColor),S=[];m&&h&&h!==m&&S.push(`renderer-clear(${h}) != token.galleryWall(${m})`),m&&x&&x!==m&&S.push(`--color-gallery-wall(${x}) != token.galleryWall(${m})`),b&&E&&E!==b&&S.push(`--color-museum-wall(${E}) != token.museumWall(${b})`),b&&I&&I!==b&&S.push(`hub-background(${I}) != token.museumWall(${b})`),m&&A&&A!==m&&S.push(`fallback-background(${A}) != token.galleryWall(${m})`),m&&N&&N!==m&&S.push(`app-background(${N}) != token.galleryWall(${m})`);const M={reason:e,tokens:t,rootVariables:{gallery:l,museum:c,galleryHex:x,museumHex:E},rendererClearHex:h,surfaces:{hubBackgroundColor:(V=d==null?void 0:d.backgroundColor)!=null?V:null,hubBackgroundImage:(j=d==null?void 0:d.backgroundImage)!=null?j:null,loadingOverlayBackgroundColor:(D=p==null?void 0:p.backgroundColor)!=null?D:null,loadingOverlayBackgroundImage:(J=p==null?void 0:p.backgroundImage)!=null?J:null,fallbackProbeBackgroundColor:(q=f==null?void 0:f.backgroundColor)!=null?q:null,fallbackProbeBackgroundImage:(ce=f==null?void 0:f.backgroundImage)!=null?ce:null,bodyBackgroundColor:g.backgroundColor,bodyBackgroundImage:g.backgroundImage,bodyBackgroundHex:C,appBackgroundColor:v.backgroundColor,appBackgroundImage:v.backgroundImage,appBackgroundHex:N},mismatchSignals:S};S.length>0?i.warn("surface","wall-surface-snapshot-mismatch","Museum wall/clear-color consistency mismatch detected",M):i.info("surface","wall-surface-snapshot","Museum wall/clear-color surfaces resolved consistently",M)}function q_(i){const e=["Kunstwerke werden vorbereitet …","Texturen werden geladen …","Licht und Schatten werden berechnet …","Atmosphäre wird eingestellt …","Fast fertig …"],t=document.createElement("div");t.className="loading-overlay",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-label","Museum wird geladen"),[{x:"10%",y:"14%",size:"280px",color:"rgba(181,154,106,0.32)",duration:"4.2s",delay:"0s",dx1:"52px",dy1:"-44px",dx2:"-68px",dy2:"38px",dx3:"44px",dy3:"-58px"},{x:"78%",y:"12%",size:"340px",color:"rgba(200,214,229,0.26)",duration:"3.6s",delay:"-1.4s",dx1:"-48px",dy1:"60px",dx2:"72px",dy2:"-46px",dx3:"-56px",dy3:"42px"},{x:"16%",y:"74%",size:"400px",color:"rgba(200,214,229,0.24)",duration:"5.1s",delay:"-2.8s",dx1:"64px",dy1:"-52px",dx2:"-40px",dy2:"76px",dx3:"58px",dy3:"-38px"},{x:"84%",y:"70%",size:"290px",color:"rgba(181,154,106,0.28)",duration:"3.9s",delay:"-0.7s",dx1:"-62px",dy1:"42px",dx2:"48px",dy2:"-72px",dx3:"-44px",dy3:"66px"},{x:"50%",y:"6%",size:"220px",color:"rgba(181,154,106,0.22)",duration:"4.7s",delay:"-3.5s",dx1:"44px",dy1:"68px",dx2:"-76px",dy2:"-40px",dx3:"60px",dy3:"52px"},{x:"46%",y:"90%",size:"320px",color:"rgba(200,214,229,0.20)",duration:"3.3s",delay:"-2.1s",dx1:"-58px",dy1:"-62px",dx2:"82px",dy2:"44px",dx3:"-48px",dy3:"-70px"},{x:"26%",y:"50%",size:"240px",color:"rgba(181,154,106,0.18)",duration:"5.8s",delay:"-4.4s",dx1:"70px",dy1:"46px",dx2:"-44px",dy2:"-80px",dx3:"38px",dy3:"64px"},{x:"74%",y:"46%",size:"260px",color:"rgba(200,214,229,0.16)",duration:"4.4s",delay:"-1.9s",dx1:"-46px",dy1:"72px",dx2:"60px",dy2:"-48px",dx3:"-68px",dy3:"56px"},{x:"34%",y:"28%",size:"200px",color:"rgba(181,154,106,0.20)",duration:"3.8s",delay:"-0.5s",dx1:"58px",dy1:"-76px",dx2:"-50px",dy2:"60px",dx3:"76px",dy3:"-42px"},{x:"62%",y:"32%",size:"310px",color:"rgba(200,214,229,0.22)",duration:"5.4s",delay:"-3.1s",dx1:"-72px",dy1:"-48px",dx2:"44px",dy2:"84px",dx3:"-60px",dy3:"-52px"},{x:"8%",y:"44%",size:"350px",color:"rgba(181,154,106,0.16)",duration:"4.0s",delay:"-1.2s",dx1:"46px",dy1:"84px",dx2:"-80px",dy2:"-44px",dx3:"52px",dy3:"68px"},{x:"90%",y:"36%",size:"230px",color:"rgba(200,214,229,0.18)",duration:"5.6s",delay:"-2.5s",dx1:"-84px",dy1:"52px",dx2:"66px",dy2:"-76px",dx3:"-50px",dy3:"46px"}].forEach(v=>{const p=document.createElement("span");p.className="loading-particle",p.setAttribute("aria-hidden","true"),p.style.setProperty("--particle-x",v.x),p.style.setProperty("--particle-y",v.y),p.style.setProperty("--particle-size",v.size),p.style.setProperty("--particle-color",v.color),p.style.setProperty("--particle-duration",v.duration),p.style.setProperty("--particle-delay",v.delay),p.style.setProperty("--particle-drift-x",v.dx1),p.style.setProperty("--particle-drift-y",v.dy1),p.style.setProperty("--particle-drift-x2",v.dx2),p.style.setProperty("--particle-drift-y2",v.dy2),p.style.setProperty("--particle-drift-x3",v.dx3),p.style.setProperty("--particle-drift-y3",v.dy3),t.appendChild(p)});const r=document.createElement("div");r.className="loading-card";const s=document.createElement("div");s.className="loading-wordmark";const a=document.createElement("span");a.className="loading-wordmark__text",a.textContent="FREYRAUM",s.appendChild(a);const o=document.createElement("div");o.className="loading-subtitle",o.textContent="Museum wird geladen";const l=document.createElement("div");l.className="loading-progress-track";const c=document.createElement("div");c.className="loading-progress-fill",l.appendChild(c);const u=document.createElement("div");u.className="loading-progress-pct",u.textContent="0%";const h=document.createElement("div");h.className="loading-hint",h.textContent=e[0];const d=document.createElement("button");d.className="loading-start-btn",d.textContent="Museum betreten",d.setAttribute("aria-label","Museum betreten und Ausstellungen entdecken"),d.disabled=!0,r.append(s,o,l,u,h,d),t.appendChild(r),i.appendChild(t);let f=0;const g=window.setInterval(()=>{f=(f+1)%e.length,h.textContent=e[f]},2e3);return{overlay:t,setProgress(v){const p=Math.max(0,Math.min(100,Math.round(v)));c.style.width=`${p}%`,u.textContent=`${p}%`},setStatus(v){o.textContent=v,t.setAttribute("aria-label",v)},reveal(){return window.clearInterval(g),d.disabled=!1,d.classList.add("is-visible"),d.offsetHeight,getComputedStyle(d).backgroundColor,d.style.setProperty("will-change","background-color"),d.addEventListener("click",()=>{d.style.removeProperty("will-change")},{once:!0}),o.textContent="Museum bereit — zum Starten klicken",h.textContent="Alle Inhalte sind vollständig vorbereitet.",t.setAttribute("aria-label","Museum bereit — zum Starten klicken"),new Promise(v=>{let p=!1;const m=()=>{p||(p=!0,d.disabled=!0,d.removeEventListener("click",m),document.removeEventListener("keydown",b),t.classList.add("is-hidden"),window.setTimeout(()=>{t.remove(),v()},1300))},b=x=>{x.key!=="Enter"&&x.key!==" "||(x.preventDefault(),m())};d.addEventListener("click",m),document.addEventListener("keydown",b),d.addEventListener("transitionend",()=>d.focus(),{once:!0}),window.setTimeout(()=>d.focus(),650)})},dispose(){window.clearInterval(g)}}}async function Z_(){var Yi,Gs,Cr,vu,_u,xu;const i=performance.now(),e=Li(),t=H_();e.installGlobalHandlers(),e.info("boot","startup","Starting FREYRAUM runtime"),t&&e.info("boot","hub-debug-enabled","Museum hub debug overlay requested via ?hubDebug=1");const n=document.getElementById("app");if(!n){e.error("boot","missing-app-root","Missing #app root element");return}n.dataset.experience="loading";const r=new ru;e.debug("boot","preferences-ready","Preferences store created",r.current);const s=new p_,a=lu();if(cu(a),e.info("layout","capabilities","Device capabilities detected",{tier:a.layoutTier,pointer:a.pointerPrimary,hover:a.hasHover,orientation:a.orientation,viewportW:a.viewportW,viewportH:a.viewportH,dpr:a.dpr}),!ru.hasStoredQuality()){const z=gg();z!==r.current.quality&&e.info("quality","startup-suggestion-suppressed","Startup quality heuristic suppressed (quality lock); keeping deterministic default",{kept:r.current.quality,wouldSuggest:z,tier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr})}const o=window.__FREYRAUM_ARTWORKS,l=X_(o,e),c=l&&l.length>0?l:fg,u=c.map(z=>{var _e;return{id:z.id,hasWebglImage:!!z.webglImage,webglImageSource:z.webglImage?"embedded-data-url":"file-url",dimensions:z.dimensions,surface:(_e=z.surface)!=null?_e:null}});e.info("boot","artworks-source","Artwork source resolved",{source:l&&l.length>0?"customer":"built-in",count:c.length,artworks:u,withWebglImage:u.filter(z=>z.hasWebglImage).length,withoutWebglImage:u.filter(z=>!z.hasWebglImage).length});const h=window.__FREYRAUM_MUSEUM_HUB,d=window.__FREYRAUM_HUB_HOTSPOTS,f=Kv(c,h,d);e.info("boot","museum-hub-resolved","Museum hub configuration resolved",{source:f.source,pages:f.pages.length,selectableSlots:f.slotToArtwork.size,unmappedArtworkCount:f.unmappedArtworkCount,disabledSlots:f.pages.flatMap(z=>z.slots).filter(z=>!z.selectable).map(z=>({slotId:z.id,reason:z.disabledReason})),warnings:f.warnings});const g=f.visualTokens,v=Os(n,g);e.info("boot","visual-tokens-resolved","Wall color tokens resolved",v);const p=window.__FREYRAUM_AUDIO,m=$_(p,e);if(s.load(m),!g_()){e.error("boot","webgl-unavailable","WebGL is not available in the current browser"),Wa(n,"WebGL ist im aktuellen Browser nicht verfügbar.",v.galleryWall);return}const b=q_(n),x=new Hl;x.onStart=(z,_e,Ae)=>{b.setStatus("Texturen werden geladen"),b.setProgress(Ae>0?_e/Ae*40:8)},x.onProgress=(z,_e,Ae)=>{b.setProgress(Ae>0?Math.min(48,_e/Ae*48):35)},x.onLoad=()=>{b.setStatus("Galerie wird vorbereitet"),b.setProgress(50)},x.onError=z=>{e.warn("boot","loading-manager-error","Asset failed during loading-manager preload",{url:z.startsWith("data:")?`[data-uri:${z.length}bytes]`:z})};const E=ls(r.current.quality);let I;try{I=new wg(n,E,v.galleryWall)}catch(z){e.error("renderer","init-failed","RendererManager initialization failed",z),b.dispose(),b.overlay.remove(),Wa(n,z instanceof Error?z.message:"WebGL-Renderer konnte nicht initialisiert werden.",v.galleryWall);return}Os(n,v,I),I.renderer.domElement.classList.add("gallery-canvas","gallery-canvas--loading");let A=null;const C=document.createElement("div");C.className="webgl-restore-status",C.setAttribute("role","status"),C.setAttribute("aria-live","polite"),C.textContent="Grafik wird wiederhergestellt …",n.appendChild(C);let N;I.onContextChange(z=>{var _e,Ae;if(z==="lost"){clearTimeout(N),C.classList.add("is-visible"),e.warn("renderer","context-restore-visible","Showing WebGL restore status"),Bs(e,"renderer-context-lost",v,I,(_e=A==null?void 0:A.element)!=null?_e:null,b.overlay,n);return}Os(n,v,I),C.textContent="Grafik wiederhergestellt",e.info("renderer","context-restore-hidden","WebGL restore status will hide"),Bs(e,"renderer-context-restored",v,I,(Ae=A==null?void 0:A.element)!=null?Ae:null,b.overlay,n),N=setTimeout(()=>{C.classList.remove("is-visible"),C.textContent="Grafik wird wiederhergestellt …"},1200)});const S=new Tg(I.renderer),M=new kg(I.renderer,S.scene,S.camera,E),P=new Hg(x);P.init(I.renderer),P.setAnisotropyDivisor(E.anisotropyDivisor);const X=new zg(S.scene,E),B=new Yg(S.scene,E);S_(()=>({scene:S.scene,artworkMesh:B.getArtworkMeshObject(),lights:X.getLights(),expectedShadowCasterCount:X.getExpectedShadowCasterCount()}));const V={topbar:null,timeline:null,navControls:null,infoPanel:null},j=()=>{var Eu,Tu,Au,Cu,Ru;const z=window.visualViewport,_e=Math.max(1,Math.round((Eu=z==null?void 0:z.width)!=null?Eu:window.innerWidth)),Ae=Math.max(1,Math.round((Tu=z==null?void 0:z.height)!=null?Tu:window.innerHeight)),Ze=window.getComputedStyle(document.documentElement),bt=ks(Ze.getPropertyValue("--safe-left")),Lt=ks(Ze.getPropertyValue("--safe-right")),Xt=ks(Ze.getPropertyValue("--chrome-top")),K_=ks(Ze.getPropertyValue("--chrome-bottom")),yu=(Au=V.topbar)==null?void 0:Au.getBoundingClientRect(),j_=(Cu=V.timeline)==null?void 0:Cu.getBoundingClientRect(),Q_=(Ru=V.navControls)==null?void 0:Ru.getBoundingClientRect(),J_=yu?Math.max(0,Math.min(Ae,yu.bottom)):0,e0=[j_,Q_].filter(yo=>!!yo).reduce((yo,t0)=>Math.max(yo,Ae-Math.max(0,t0.top)),0),bu=Math.max(Xt,J_),Su=Math.max(K_,e0),Mu=bt,wu=Lt,_o=Math.max(1,_e-Mu-wu),xo=Math.max(1,Ae-bu-Su);return{viewportW:_e,viewportH:Ae,usableW:_o,usableH:xo,usableFracX:_o/_e,usableFracY:xo/Ae,effectiveAspect:_o/xo,occlusionTop:bu,occlusionRight:wu,occlusionBottom:Su,occlusionLeft:Mu}},D=new iv(c,B,P,S.camera,void 0,j);D.applyPreset(E);const J=W_(a,c.length);D.configureReadinessProfile({criticalRadius:J.criticalRadius});const q=D_(),ce=F_(q,a.layoutTier,c.length,J.criticalRadius);D.configureStartupReadiness({mode:q,entryTargetCount:ce}),e.info("boot","startup-readiness-mode","Resolved startup readiness contract",{mode:q,entryTargetCount:ce,artworkCount:c.length,criticalRadius:J.criticalRadius,layoutTier:a.layoutTier}),e.info("boot","warm-profile","Applied device-aware warm profile",{artworkCount:c.length,layoutTier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr,profile:J});const fe=!1,me=new v_({budgetMs:16.7}),Ce=new w_(r.current.quality,4e3,!fe);D.setFrameBudgetMarker(()=>me.markNavigation());let $e=!1,Q;R_();const ie=new rv(n),xe=new Ga(n,c[0]),ve=z=>{xe.setCompact(z==="phone-portrait"||z==="phone-small")};ve(a.layoutTier);const Ne=new Va(n),Oe=new av(n,D),Ge=new ov(n,document.documentElement),st=new lv(n,r),L=new dv(n,r,s),dt=new sv(n),qe=new gv(n,c);A=new u_(n,f),A.setSelectedArtworkId((Gs=(Yi=c[D.index])==null?void 0:Yi.id)!=null?Gs:null,{alignPage:!1,source:"boot-gallery-selection"}),Bs(e,"post-hub-composition-create",v,I,A.element,b.overlay,n);const et=s.subscribe(z=>{st.setAudioStatusMessage(z.message)});V.topbar=n.querySelector(".topbar"),V.timeline=n.querySelector(".timeline"),V.navControls=n.querySelector(".nav-controls"),V.infoPanel=n.querySelector(".info-panel");const Me=new uv(V.infoPanel,r,n);Me.init(),V.navControls&&Me.registerNavControls(V.navControls,Ne),await Promise.all([D.init(),new Promise(z=>window.setTimeout(z,U_))]),e.info("boot","gallery-ready","Gallery initialized",{artworkCount:c.length,quality:r.current.quality,lighting:"dramatic"});const it=I.renderer.domElement;it.tabIndex=-1,it.setAttribute("aria-label","Interaktive Galerie"),it.setAttribute("role","img"),it.setAttribute("aria-describedby","freyraum-canvas-help");const Le=document.createElement("p");Le.id="freyraum-canvas-help",Le.className="sr-only",Le.textContent="Interaktive 3D-Galerie. Navigation: Pfeiltasten links und rechts oder die Navigationsbuttons. Zoomen: Plus- und Minus-Buttons.",n.appendChild(Le);let R=null,T=null,_=null;const U=()=>{T!==null&&(cancelAnimationFrame(T),T=null),_!==null&&(cancelAnimationFrame(_),_=null)},$=z=>{R||(R=document.createElement("div"),R.id="freyraum-artwork-status",R.className="sr-only",R.setAttribute("aria-live","polite"),R.setAttribute("aria-atomic","true"),n.appendChild(R)),U(),R.textContent="";const _e=z?`Aktuelles Werk: ${z}`:"Aktuelles Werk gewechselt";T=requestAnimationFrame(()=>{T=null,_=requestAnimationFrame(()=>{_=null,R&&(R.textContent=_e)})})},Z=new Sv(it,D),K=new yv,ae=new _v(D,K);Z.setEnabled(!1),ae.setEnabled(!1),ie.onHelpClick=()=>K.open(ie.helpBtn),ie.onInfoClick=()=>Me.forceReveal("info-panel");let ne=!1;const ue=z=>{if(ne)return;const _e=r.current,Ae=s.getState();s.hasSource()&&!_e.audioMuted&&(Ae.autoplayBlocked||!Ae.playing&&Ae.available)&&(ne=!0,e.info("audio","autoplay-recovery-attempt","Retrying audio play after user interaction",{reason:z,autoplayBlocked:Ae.autoplayBlocked}),s.play(`interaction-recovery:${z}`))},De=()=>ue("pointerdown"),re=z=>{(z.key==="ArrowLeft"||z.key==="ArrowRight"||z.key===" "||z.key==="Enter")&&ue(`keydown:${z.key}`)};window.addEventListener("pointerdown",De,{passive:!0}),window.addEventListener("keydown",re);let de;const ze=200,Ee=()=>{de!==void 0&&(clearTimeout(de),de=void 0),D.setInteractionActive(!0)},ye=()=>{de!==void 0&&clearTimeout(de),de=setTimeout(()=>{de=void 0,D.setInteractionActive(!1)},ze)},ke=()=>Ee(),Be=()=>ye();window.addEventListener("pointerdown",ke,{passive:!0}),window.addEventListener("pointerup",Be,{passive:!0}),window.addEventListener("pointercancel",Be,{passive:!0});const je=c.length,k=new $t(4,4,{depthBuffer:!0,stencilBuffer:!1}),oe=(z,_e)=>{const Ae=performance.now();if(!D.warmArtworkForGPU(z,_e))return!1;const Ze=B.group.visible;B.group.visible=!0;const bt=I.renderer.getRenderTarget();return I.renderer.setRenderTarget(k),I.renderer.render(S.scene,S.camera),I.renderer.setRenderTarget(bt),B.group.visible=Ze,D.markGpuWarmed(z,performance.now()-Ae,_e),!0},te=(z,_e)=>{var bt;const Ae=performance.now();if(!D.warmArtworkForGPU(z,_e))return!1;const Ze=B.group.visible;return B.group.visible=!0,M.render(),B.group.visible=Ze,D.markGpuWarmed(z,performance.now()-Ae,_e),e.debug("boot","artwork-final-path-warm","Artwork rendered through final post-processing path under loading overlay",{index:z,artworkId:(bt=c[z])==null?void 0:bt.id,reason:_e,durationMs:Math.round((performance.now()-Ae)*10)/10,renderer:Ln(I.renderer)}),!0},ee=D.getBudgetedWarmOrder(0),se=D.getStartupEntryTargets(0),Re=Math.max(0,ee.length-se.length);e.info("boot","pre-entry-warm-contract","Pre-entry GPU warm contract resolved",{mode:q,warmOrderLength:ee.length,entryWarmCount:se.length,deferredWarmCount:Re,entryTargets:se}),await D.ensureEntryReadiness(se,"overlay-entry-readiness-contract"),b.setStatus("GPU wird vorbereitet"),b.setProgress(50);for(let z=0;z<se.length;z+=1)b.setStatus(`Gemälde ${z+1} / ${se.length} wird vorbereitet`),oe(se[z],"overlay-entry-readiness-contract"),b.setProgress(50+Math.round((z+1)/Math.max(1,se.length)*45)),await Qn();let Ve=D.getEntryReadinessContract(se),at=0;const vt=Math.max(2,se.length+1);for(;!Ve.ready&&at<vt;)at+=1,b.setStatus("Zusätzliche Vorbereitung läuft"),await D.ensureEntryReadiness(Ve.pendingIndices,`overlay-contract-retry-${at}`),Ve.pendingIndices.forEach(z=>oe(z,`overlay-contract-retry-${at}`)),Ve=D.getEntryReadinessContract(se);Ve.ready||e.warn("boot","entry-contract-unresolved","Full-gallery entry readiness contract could not be fully satisfied before reveal",{pendingIndices:Ve.pendingIndices,targetIndices:Ve.targetIndices,attempts:at,maxAttempts:vt}),D.warmArtworkForGPU(D.index,"restore-active-after-overlay-warm");const we=D.getFullGalleryReadinessSummary();if(e.info("boot","full-gallery-ready","Entry readiness contract resolved; enabling entry CTA",{artworkCount:je,fullyReadyCount:we.fullyReadyCount,pendingCount:we.pendingCount,gpuWarmedCount:we.gpuWarmedCount,pbrLoadedCount:we.pbrLoadedCount,proceduralReadyCount:we.proceduralReadyCount,memoryCapApplied:we.memoryCapApplied,preloadMode:we.preloadMode,deferredArtworkCount:we.deferredArtworkCount,overflowArtworkCount:we.overflowArtworkCount,entryContractPasses:at,entryContractMaxPasses:vt}),we.pendingCount>0){const z=we.preloadMode==="strict"?"warn":"info";e[z]("boot","entry-unresolved-artworks","Pre-entry unresolved artworks detected",{pendingCount:we.pendingCount,unresolvedArtworkIds:we.unresolvedArtworkIds,preloadMode:we.preloadMode,deferredArtworkCount:we.deferredArtworkCount,overflowArtworkCount:we.overflowArtworkCount,contractSatisfied:we.preloadMode!=="strict"})}e.info("boot","inp-acceptance-target",'INP acceptance criteria: interaction presentation delay must stay below 200 ms (Core Web Vitals "good" threshold)',{baseline_inp_ms:1024,target_inp_ms:200,preloadMode:we.preloadMode,artworkCount:je,note:"Measure with Chrome DevTools Performance > Interactions panel or CrUX field data after deploy."}),e.info("boot","gpu-warm-complete","Pre-entry GPU warm finished; entry target set warmed before reveal",{artworkCount:je,mode:q,entryWarmCount:se.length,deferredWarmCount:Re,warmOrder:ee,frameBudgetMs:J.postRevealFrameBudgetMs,batchCap:J.postRevealBatchCap});const Gt=3,Kt=performance.now();e.info("boot","gpu-warm-flush-start","Starting post-warm GPU drain frames before shader prewarm",{frames:Gt,artworkCount:je,pendingCount:we.pendingCount,preloadMode:we.preloadMode}),await pu(Gt),e.info("boot","gpu-warm-flush-complete","Post-warm GPU drain frames completed",{frames:Gt,durationMs:performance.now()-Kt,artworkCount:je,pendingCount:we.pendingCount,preloadMode:we.preloadMode}),b.setStatus("Shader werden vorbereitet"),b.setProgress(97),await I.prewarm(S.scene,S.camera),D.markAllShaderCompiled("boot-prewarm");const Jn=r.current.quality,jt=z_.filter(z=>z!==Jn);if(jt.length>0){const z=D.index,_e=performance.now();e.info("boot","quality-variant-prewarm-start","Prewarming non-active quality shader variants under loading overlay",{activeQuality:Jn,variants:jt,artworkIndex:z,artworkId:(Cr=c[z])==null?void 0:Cr.id});for(const Ze of jt){const bt=performance.now(),Lt=ls(Ze);I.applyPreset(Lt),M.applyPreset(Lt),X.applyPreset(Lt),B.applyPreset(Lt),D.applyPreset(Lt),D.warmArtworkForGPU(z,`overlay-quality-variant-${Ze}`),await I.prewarm(S.scene,S.camera),e.debug("boot","quality-variant-prewarmed","Quality shader variant prewarmed",{quality:Ze,artworkIndex:z,artworkId:(vu=c[z])==null?void 0:vu.id,durationMs:Math.round((performance.now()-bt)*10)/10,renderer:Ln(I.renderer)}),await Qn()}const Ae=ls(Jn);I.applyPreset(Ae),M.applyPreset(Ae),X.applyPreset(Ae),B.applyPreset(Ae),D.applyPreset(Ae),D.warmArtworkForGPU(D.index,"restore-active-after-quality-variant-prewarm"),await I.prewarm(S.scene,S.camera),e.info("boot","quality-variant-prewarm-complete","All non-active quality shader variants prewarmed under loading overlay",{activeQuality:Jn,variantsWarmed:jt,durationMs:Math.round((performance.now()-_e)*10)/10,renderer:Ln(I.renderer)})}const ei=new he;I.renderer.getSize(ei),e.info("boot","composer-prewarm-start","Starting EffectComposer shader prewarm (bloom+FXAA passes)"),M.prewarmComposer(ei.x,ei.y),e.info("boot","composer-prewarm-complete","EffectComposer shader prewarm complete"),await pu(1),b.setStatus("Finale Darstellung wird vorbereitet"),b.setProgress(98);const Hs=performance.now();let Wi=0;for(let z=0;z<se.length;z+=1)te(se[z],"overlay-final-path-warm")&&(Wi+=1),await Qn();te(D.index,"restore-active-after-final-path-warm"),e.info("boot","all-artworks-final-path-warmed","Entry target artworks rendered through final post-processing path under loading overlay",{artworkCount:je,mode:q,warmed:Wi,targetCount:se.length,deferredWarmCount:Re,durationMs:Math.round((performance.now()-Hs)*10)/10,renderer:Ln(I.renderer)}),b.setStatus("Bedienelemente werden vorbereitet");const ti=await qe.prewarmUnderOverlay(),Tr=V_(n,e);e.info("boot","entry-prebuild-complete","Main page, controls, timeline, and final render path are prebuilt under loading overlay",{timeline:ti,ui:Tr,artworkCount:je}),b.setProgress(99),we.preloadMode==="bounded-fallback"?b.setStatus(`${we.overflowArtworkCount} Gemälde werden noch optimiert – Galerie kann betreten werden`):we.preloadMode==="staged"&&Re>0?b.setStatus("Galerie bereit – weitere Gemälde werden im Hintergrund vorbereitet"):b.setStatus("Galerie bereit"),I.renderer.domElement.classList.remove("gallery-canvas--loading"),I.renderer.domElement.classList.add("gallery-canvas--ready");let pn=se.length;const Ar=()=>{if(pn>=ee.length){k.dispose(),D.warmArtworkForGPU(D.index,"restore-active-after-budget-warm"),e.info("boot","gpu-warm-post-reveal","Post-reveal budgeted warm queue complete; all artworks warmed",{artworkCount:je,mode:q,warmed:ee.length,deferredWarmCount:Re,readinessLedger:D.getReadinessLedger()});return}const z=performance.now();let _e=0;for(;pn<ee.length&&_e<J.postRevealBatchCap&&performance.now()-z<J.postRevealFrameBudgetMs;)oe(ee[pn],"post-reveal-budget"),pn+=1,_e+=1;D.warmArtworkForGPU(D.index,"restore-active-between-budget-warm"),e.debug("boot","gpu-warm-frame","Budgeted GPU warm frame completed",{warmedThisFrame:_e,warmCursor:pn,total:ee.length}),requestAnimationFrame(Ar)};requestAnimationFrame(Ar);let Xi,ni=0;const vo=()=>{var Lt,Xt;ni=0;const z=window.visualViewport,_e=Math.max(1,Math.round((Lt=z==null?void 0:z.width)!=null?Lt:window.innerWidth)),Ae=Math.max(1,Math.round((Xt=z==null?void 0:z.height)!=null?Xt:window.innerHeight));I.resize(_e,Ae),M.resize(_e,Ae),S.updateAspect(_e,Ae);const Ze=lu();cu(Ze),ve(Ze.layoutTier),dt.updateHint();const bt=j();D.handleViewportMetricsChanged(),e.info("layout","resize","Viewport resized",{tier:Ze.layoutTier,w:Ze.viewportW,h:Ze.viewportH,measuredW:_e,measuredH:Ae,orientation:Ze.orientation}),e.info("layout","art-viewport","Artwork-safe viewport measured",bt)},rn=()=>{clearTimeout(Xi),Xi=setTimeout(()=>{ni===0&&(ni=requestAnimationFrame(vo))},120)};window.addEventListener("resize",rn),window.addEventListener("orientationchange",rn);const w=window.visualViewport;w==null||w.addEventListener("resize",rn),w==null||w.addEventListener("scroll",rn);const O=typeof ResizeObserver=="function"?new ResizeObserver(rn):null;for(const z of[V.topbar,V.timeline,V.navControls,V.infoPanel])z&&(O==null||O.observe(z));const W=z=>{const{reducedMotion:_e,quality:Ae,audioMuted:Ze,audioVolume:bt}=r.current;D.setReducedMotion(_e),X.setAnimated(!_e),s.setVolume(bt,"preferences-apply"),s.setMuted(Ze,"preferences-apply");const Lt=s.getState();!Ze&&s.hasSource()&&(!Lt.playing||Lt.autoplayBlocked)&&s.play("preferences-apply"),B.material.setShadowProfileScale(.5);const Xt=ls(Ae);I.applyPreset(Xt),M.applyPreset(Xt),X.applyPreset(Xt),B.applyPreset(Xt),D.applyPreset(Xt),D.setInspectionMode(!1),B.material.setShadowFilterRadius(0,!1),me.markPresetChange(),D.markRenderDirty(6),z&&Ce.notifyManualPreset(Ae),e.debug("preferences","applied","Applied current preferences",{manual:z,reducedMotion:_e,quality:Ae,lighting:"dramatic",audioMuted:Ze,audioVolume:bt,inspection:!1})};W(!1);const Y=z=>{$e||($e=!0,s.handleSuspend(z),e.info("lifecycle","suspend",`Runtime suspended (${z})`,{reason:z,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},H=z=>{$e&&($e=!1,s.handleResume(z),me.markNavigation(),D.markRenderDirty(6),e.info("lifecycle","resume",`Runtime resumed (${z})`,{reason:z,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},le=()=>{document.visibilityState==="hidden"?Y("visibilitychange-hidden"):document.visibilityState==="visible"&&H("visibilitychange-visible")},ge=z=>{r.normalizeStartupAudio(z.persisted?"pagehide-bfcache":"pagehide-close",!1),e.info("audio","startup-audio-persisted","Persisted startup audio defaults during page hide",{persisted:z.persisted})},be=z=>{z.persisted&&(e.info("audio","startup-audio-restore","Restoring startup audio defaults after bfcache resume",{persisted:z.persisted}),r.normalizeStartupAudio("pageshow-bfcache"))},Se=()=>Y("page-lifecycle-freeze"),Fe=()=>H("page-lifecycle-resume");document.addEventListener("visibilitychange",le),window.addEventListener("pagehide",ge),window.addEventListener("pageshow",be),window.addEventListener("freeze",Se),window.addEventListener("resume",Fe);let Ie=null;if(e.getMode()!=="default"&&typeof PerformanceObserver=="function")try{Ie=new PerformanceObserver(z=>{for(const _e of z.getEntries())e.warn("perf","long-task","Long task blocked the main thread",{duration:Math.round(_e.duration),startTime:Math.round(_e.startTime),name:_e.name})}),Ie.observe({type:"longtask",buffered:!0}),e.info("perf","longtask-observer-active","Long Tasks API observer attached")}catch(z){e.info("perf","longtask-unsupported","Long Tasks API not available",{message:z instanceof Error?z.message:String(z)})}let Pe;e.getMode()!=="default"&&(Pe=setInterval(()=>{$e||e.info("renderer","snapshot","Renderer info snapshot",I.getRendererSnapshot())},5e3));const Je=Li().getMode()!=="default";let ot=!1,lt=!1;const It=z=>{Je&&(z.key==="a"||z.key==="A"?(ot=!ot,B.material.setAlbedoOnly(ot),e.info("debug","albedo-toggle",`Albedo-only ${ot?"ON":"OFF"}`)):(z.key==="s"||z.key==="S")&&(lt=!lt,B.material.setShadowDebug(lt),e.info("debug","shadow-toggle",`Shadow-only ${lt?"ON":"OFF"}`)))};Je&&(window.addEventListener("keydown",It),e.info("debug","controls",'Debug controls active: press "a" for albedo-only, "s" for shadow-only',{mode:e.getMode()}));let Qe=r.current;const Te=typeof window.requestIdleCallback=="function"?z=>window.requestIdleCallback(z,{timeout:200}):z=>window.setTimeout(z,0),_t=typeof window.cancelIdleCallback=="function"?z=>window.cancelIdleCallback(z):z=>window.clearTimeout(z);let Ye=null;const Vt=1e-6,Dn=r.subscribe(()=>{const z=r.current,_e=z.quality!==Qe.quality,Ae=z.audioMuted!==Qe.audioMuted||Math.abs(z.audioVolume-Qe.audioVolume)>Vt;if(Qe=z,Ae){Ye!==null&&(_t(Ye),Ye=null),W(_e);return}Ye!==null&&_t(Ye),Ye=Te(()=>{Ye=null,W(_e),I.prewarm(S.scene,S.camera)})}),kt=z=>{var _e,Ae,Ze,bt,Lt,Xt;xe.update(c[z],!0),qe.setActive(z),$((Ae=(_e=c[z])==null?void 0:_e.title)!=null?Ae:""),A==null||A.setSelectedArtworkId((bt=(Ze=c[z])==null?void 0:Ze.id)!=null?bt:null,{alignPage:!1,source:"gallery-navigate"}),e.info("gallery","navigate","Artwork changed",{index:z,artworkId:(Lt=c[z])==null?void 0:Lt.id,title:(Xt=c[z])==null?void 0:Xt.title})};D.onNavigate(kt),Ne.onPrev(()=>D.navigate(-1)),Ne.onNext(()=>D.navigate(1)),Ne.enableIdleHint(),qe.onSelect(z=>D.goTo(z)),qe.onPreview(z=>D.promotePrefetchWindow(z,"timeline-preview"));const sn=new d_({onStateChange:z=>{var _e;n.dataset.experience=z==="destination"?"gallery":z,Os(n,v,I),Bs(e,`experience-state:${z}`,v,I,(_e=A==null?void 0:A.element)!=null?_e:null,b.overlay.isConnected?b.overlay:null,n),e.info("navigation","experience-state","Experience state changed",{state:z})},onTransitionError:(z,_e)=>{A.showError(),e.error("navigation","destination-transition-failed",`Failed to enter destination "${z.id}"`,_e)}});sn.register({id:"hub",label:"Main Museum Hub",prepare:()=>A.prepare(),enter:()=>{var z,_e;B.group.visible=!1,Z.setEnabled(!1),ae.setEnabled(!1),A.setSelectedArtworkId((_e=(z=c[D.index])==null?void 0:z.id)!=null?_e:null,{alignPage:!0,source:"router-enter-hub"}),A.enter()},exit:()=>A.exit(r.current.reducedMotion)}),sn.register({id:"gallery",label:"Interaktive Galerie",prepare:async()=>{B.group.visible=!0,D.resetView(),await Qn()},enter:()=>{var z;Z.setEnabled(!0),ae.setEnabled(!0),it.focus({preventScroll:!0}),e.info("navigation","gallery-entered","Existing interactive gallery entered from museum hub",{artworkId:(z=c[D.index])==null?void 0:z.id})},exit:()=>{Z.setEnabled(!1),ae.setEnabled(!1)}}),A.onActivate(()=>{sn.navigate("gallery")});const mt=new Map;c.forEach((z,_e)=>mt.set(z.id,_e));let Wt=0;A.onSelectSlot(z=>{const _e=++Wt,Ae=z.artworkId,Ze=Ae!==null?mt.get(Ae):void 0;if(Ae===null||Ze===void 0){e.warn("navigation","hub-slot-invalid","Hub slot activation without a valid exact target; ignoring",{slotId:z.id,artworkId:Ae}),A.showError();return}e.info("navigation","hub-slot-select","Hub frame selected",{slotId:z.id,artworkId:Ae,artworkIndex:Ze,generation:_e}),D.goTo(Ze),D.promotePrefetchWindow(Ze,"hub-slot"),D.whenArtworkInteractive(Ze,f.selectionTimeoutMs).then(bt=>{if(_e!==Wt){e.info("navigation","hub-slot-stale-readiness","Ignoring stale hub readiness completion",{slotId:z.id,artworkId:Ae,generation:_e,currentGeneration:Wt});return}bt==="timeout"&&e.warn("navigation","hub-slot-readiness-timeout","Hub readiness gate timed out; entering exact target with procedural surface",{slotId:z.id,artworkId:Ae,timeoutMs:f.selectionTimeoutMs}),D.index!==Ze&&D.goTo(Ze),sn.navigate("gallery")})});const $i=()=>{Wt+=1,ie.setBackBusy(!0),sn.navigate("hub").finally(()=>ie.setBackBusy(!1))};ie.onBackClick=$i,ae.onEscape=()=>{document.querySelector(".keyboard-help:not([hidden])")||document.querySelector(".prefs__panel:not([hidden])")||$i()};const Ot=z=>{if(Q=requestAnimationFrame(Ot),I.isRenderPaused()||$e)return;D.hasReadinessWork()&&me.markReadinessWork();const _e=me.sample(z);D.markInteractionFrame(_e.dtMs);const Ae=Ce.evaluate(_e,me);Ae&&Ae!==r.current.quality&&(e.warn("quality","adaptive-downgrade","Adaptive quality downgrade triggered",{from:r.current.quality,to:Ae,rollingFps:Math.round(_e.rollingFps*10)/10,rollingMs:Math.round(_e.rollingMs*10)/10,severeFrameCount:_e.severeFrameCount}),r.setQuality(Ae));const Ze=X.update(z),bt=D.update(z);!Ze&&!bt&&!D.hasReadinessWork()||(S.camera.updateMatrixWorld(),X.getKeyLightWorldDir(hu),fu.copy(hu).transformDirection(S.camera.matrixWorldInverse),B.material.setKeyLightDirView(fu),M.render())};Q=requestAnimationFrame(Ot),e.info("boot","pre-entry-raf-start","Production RAF started under loading overlay before entry CTA",{artworkCount:je,renderer:Ln(I.renderer)}),await Qn(),e.info("boot","first-full-frame-rendered","First full-size production frame rendered under loading overlay",{activeArtwork:(_u=c[D.index])==null?void 0:_u.id,renderer:Ln(I.renderer)}),await Qn(),e.info("boot","second-full-frame-presented","Second full-size production frame presented under loading overlay; entry CTA may now be enabled",{activeArtwork:(xu=c[D.index])==null?void 0:xu.id,renderer:Ln(I.renderer)}),e.info("boot","entry-cta-enabled","Loading screen readiness gate complete; enabling entry CTA",{artworkCount:je,pendingCount:we.pendingCount,finalPathWarmed:Wi,timelinePrewarm:ti,uiPrewarm:Tr,renderer:Ln(I.renderer)}),e.info("boot","performance-gate","Startup performance gate (v0.67 P-07 acceptance evidence)",{schemaVersion:1,startupReadinessMode:q,artworkCount:je,automaticQualityChangesEnabled:fe,activeQuality:r.current.quality,entryWarmCount:se.length,deferredWarmCount:Re,preloadMode:we.preloadMode,startupMsToEntryCta:Math.round((performance.now()-i)*10)/10,postRevealFrameBudgetMs:J.postRevealFrameBudgetMs,postRevealBatchCap:J.postRevealBatchCap,fullyReadyCount:we.fullyReadyCount,pendingCount:we.pendingCount,deferredArtworkCount:we.deferredArtworkCount}),B.group.visible=!1,b.setStatus("Museum wird vorbereitet"),await sn.startAt("hub"),b.setProgress(100),await b.reveal(),b.dispose(),A.focusInitialTarget(),window.addEventListener("beforeunload",()=>{r.normalizeStartupAudio("beforeunload-close",!1),cancelAnimationFrame(Q),ni!==0&&cancelAnimationFrame(ni),Ye!==null&&_t(Ye),Ie==null||Ie.disconnect(),Pe!==void 0&&clearInterval(Pe),N!==void 0&&clearTimeout(N),document.removeEventListener("visibilitychange",le),window.removeEventListener("pagehide",ge),window.removeEventListener("pageshow",be),window.removeEventListener("freeze",Se),window.removeEventListener("resume",Fe),Dn(),et(),Je&&window.removeEventListener("keydown",It),window.removeEventListener("pointerdown",De),window.removeEventListener("keydown",re),window.removeEventListener("pointerdown",ke),window.removeEventListener("pointerup",Be),window.removeEventListener("pointercancel",Be),de!==void 0&&clearTimeout(de),window.removeEventListener("resize",rn),window.removeEventListener("orientationchange",rn),w==null||w.removeEventListener("resize",rn),w==null||w.removeEventListener("scroll",rn),O==null||O.disconnect(),clearTimeout(Xi),e.info("boot","shutdown","Disposing FREYRAUM runtime"),sn.dispose(),r.dispose(),Z.dispose(),Me.dispose(),ae.dispose(),K.dispose(),ie.dispose(),xe.dispose(),U(),R==null||R.remove(),R=null,Ne.dispose(),Oe.dispose(),Ge.dispose(),st.dispose(),L.dispose(),dt.dispose(),qe.dispose(),C.remove(),s.dispose(),B.dispose(),P.dispose(),D.proceduralFactory.disposeAll(),X.dispose(),M.dispose(),S.dispose(),I.dispose()})}Z_().catch(i=>{Li().error("boot","startup-failed","Fatal startup failure",i);const e=document.getElementById("app");if(e){const t=Y_();document.documentElement.style.backgroundColor=t,document.body.style.backgroundColor=t,e.style.backgroundColor=t,Wa(e,i instanceof Error?i.message:"Unbekannter Fehler beim Initialisieren.",t)}})})();
