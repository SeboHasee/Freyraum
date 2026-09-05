function freyraumPseudoRandom(){const cryptoApi=globalThis.crypto;if(cryptoApi&&cryptoApi.getRandomValues){const values=new Uint32Array(1);cryptoApi.getRandomValues(values);return values[0]/4294967296}const now=Date.now();const perf=globalThis.performance&&globalThis.performance.now?globalThis.performance.now():0;return (Math.sin(now+perf)*10000)%1}
var ob=Object.defineProperty;var lb=(Un,Yn,Pr)=>Yn in Un?ob(Un,Yn,{enumerable:!0,configurable:!0,writable:!0,value:Pr}):Un[Yn]=Pr;var x=(Un,Yn,Pr)=>lb(Un,typeof Yn!="symbol"?Yn+"":Yn,Pr);(function(){"use strict";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Yu,qu;const Un="166",qn="",Ot="srgb",on="srgb-linear",Ga="display-p3",ps="display-p3-linear",ms="linear",mt="srgb",gs="rec709",vs="p3",_l="300 es";class Ni{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sl=1234567;const Ir=Math.PI/180,Fi=180/Math.PI;function ci(){const r=freyraumPseudoRandom()*4294967295|0,e=freyraumPseudoRandom()*4294967295|0,t=freyraumPseudoRandom()*4294967295|0,n=freyraumPseudoRandom()*4294967295|0;return(Bt[r&255]+Bt[r>>8&255]+Bt[r>>16&255]+Bt[r>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function It(r,e,t){return Math.max(e,Math.min(t,r))}function Va(r,e){return(r%e+e)%e}function vh(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function yh(r,e,t){return r!==e?(t-r)/(e-r):0}function Lr(r,e,t){return(1-t)*r+t*e}function xh(r,e,t,n){return Lr(r,e,1-Math.exp(-t*n))}function bh(r,e=1){return e-Math.abs(Va(r,e*2)-e)}function _h(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Sh(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function wh(r,e){return r+Math.floor(freyraumPseudoRandom()*(e-r+1))}function Mh(r,e){return r+freyraumPseudoRandom()*(e-r)}function Eh(r){return r*(.5-freyraumPseudoRandom())}function Th(r){r!==void 0&&(Sl=r);let e=Sl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ah(r){return r*Ir}function Ch(r){return r*Fi}function Rh(r){return(r&r-1)===0&&r!==0}function Ph(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Ih(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Lh(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),d=a((e+n)/2),u=s((e-n)/2),h=a((e-n)/2),f=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(o*d,l*u,l*h,o*c);break;case"YZY":r.set(l*h,o*d,l*u,o*c);break;case"ZXZ":r.set(l*u,l*h,o*d,o*c);break;case"XZX":r.set(o*d,l*g,l*f,o*c);break;case"YXY":r.set(l*f,o*d,l*g,o*c);break;case"ZYZ":r.set(l*g,l*f,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Oi(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function $t(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const kh={DEG2RAD:Ir,RAD2DEG:Fi,generateUUID:ci,clamp:It,euclideanModulo:Va,mapLinear:vh,inverseLerp:yh,lerp:Lr,damp:xh,pingpong:bh,smoothstep:_h,smootherstep:Sh,randInt:wh,randFloat:Mh,randFloatSpread:Eh,seededRandom:Th,degToRad:Ah,radToDeg:Ch,isPowerOfTwo:Rh,ceilPowerOfTwo:Ph,floorPowerOfTwo:Ih,setQuaternionFromProperEuler:Lh,normalize:$t,denormalize:Oi};class he{constructor(e=0,t=0){he.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(It(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,n,i,s,a,o,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=i,d[2]=o,d[3]=t,d[4]=s,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],u=n[7],h=n[2],f=n[5],g=n[8],v=i[0],m=i[3],p=i[6],S=i[1],y=i[4],b=i[7],U=i[2],P=i[5],E=i[8];return s[0]=a*v+o*S+l*U,s[3]=a*m+o*y+l*P,s[6]=a*p+o*b+l*E,s[1]=c*v+d*S+u*U,s[4]=c*m+d*y+u*P,s[7]=c*p+d*b+u*E,s[2]=h*v+f*S+g*U,s[5]=h*m+f*y+g*P,s[8]=h*p+f*b+g*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*s*d+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*s,f=c*s-a*l,g=t*u+n*h+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-d*n)*v,e[2]=(o*n-i*a)*v,e[3]=h*v,e[4]=(d*t-i*l)*v,e[5]=(i*s-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Wa.makeScale(e,t)),this}rotate(e){return this.premultiply(Wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wa=new Ke;function wl(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function kr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Uh(){const r=kr("canvas");return r.style.display="block",r}const Ml={};function El(r){r in Ml||(Ml[r]=!0,console.warn(r))}function Dh(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Tl=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Al=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ys={[on]:{transfer:ms,primaries:gs,toReference:r=>r,fromReference:r=>r},[Ot]:{transfer:mt,primaries:gs,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[ps]:{transfer:ms,primaries:vs,toReference:r=>r.applyMatrix3(Al),fromReference:r=>r.applyMatrix3(Tl)},[Ga]:{transfer:mt,primaries:vs,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Al),fromReference:r=>r.applyMatrix3(Tl).convertLinearToSRGB()}},Nh=new Set([on,ps]),ut={enabled:!0,_workingColorSpace:on,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!Nh.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const n=ys[e].toReference,i=ys[t].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return ys[r].primaries},getTransfer:function(r){return r===qn?ms:ys[r].transfer}};function Bi(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Xa(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let zi;class Fh{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{zi===void 0&&(zi=kr("canvas")),zi.width=e.width,zi.height=e.height;const n=zi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=zi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=kr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Bi(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Bi(t[n]/255)*255):t[n]=Bi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Oh=0;class Cl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=ci(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push($a(i[a].image)):s.push($a(i[a]))}else s=$a(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function $a(r){return typeof HTMLImageElement!="undefined"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&r instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&r instanceof ImageBitmap?Fh.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Bh=0;class Lt extends Ni{constructor(e=Lt.DEFAULT_IMAGE,t=Lt.DEFAULT_MAPPING,n=1001,i=1001,s=1006,a=1008,o=1023,l=1009,c=Lt.DEFAULT_ANISOTROPY,d=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=ci(),this.name="",this.source=new Cl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Lt.DEFAULT_IMAGE=null,Lt.DEFAULT_MAPPING=300,Lt.DEFAULT_ANISOTROPY=1;class vt{constructor(e=0,t=0,n=0,i=1){vt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,b=(f+1)/2,U=(p+1)/2,P=(d+h)/4,E=(u+v)/4,L=(g+m)/4;return y>b&&y>U?y<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(y),i=P/n,s=E/n):b>U?b<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(b),n=P/i,s=L/i):U<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(U),n=E/s,i=L/s),this.set(n,i,s,t),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(h-d)*(h-d));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(h-d)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this.w=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zh extends Ni{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Lt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Cl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zt extends zh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Rl extends Lt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hh extends Lt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class di{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],d=n[i+2],u=n[i+3];const h=s[a+0],f=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==h||c!==f||d!==g){let m=1-o;const p=l*h+c*f+d*g+u*v,S=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const U=Math.sqrt(y),P=Math.atan2(U,p*S);m=Math.sin(m*P)/U,o=Math.sin(o*P)/U}const b=o*S;if(l=l*m+h*b,c=c*m+f*b,d=d*m+g*b,u=u*m+v*b,m===1-o){const U=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=U,c*=U,d*=U,u*=U}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],d=n[i+3],u=s[a],h=s[a+1],f=s[a+2],g=s[a+3];return e[t]=o*g+d*u+l*f-c*h,e[t+1]=l*g+d*h+c*u-o*f,e[t+2]=c*g+d*f+o*h-l*u,e[t+3]=d*g-o*u-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(i/2),u=o(s/2),h=l(n/2),f=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=h*d*u+c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u-h*f*g;break;case"YXZ":this._x=h*d*u+c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u+h*f*g;break;case"ZXY":this._x=h*d*u-c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u-h*f*g;break;case"ZYX":this._x=h*d*u-c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u+h*f*g;break;case"YZX":this._x=h*d*u+c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u-h*f*g;break;case"XZY":this._x=h*d*u-c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=n+o+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-l)*f,this._y=(s-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(d-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(s-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+d)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(s+c)/f,this._y=(l+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+i*c-s*l,this._y=i*d+a*l+s*o-n*c,this._z=s*d+a*c+n*l-i*o,this._w=a*d-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=n*u+this._x*h,this._y=i*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*freyraumPseudoRandom(),t=2*Math.PI*freyraumPseudoRandom(),n=freyraumPseudoRandom(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,t=0,n=0){R.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Pl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Pl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),d=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*d,this.y=n+l*d+o*c-s*u,this.z=i+l*u+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ya.copy(this).projectOnVector(e),this.sub(Ya)}reflect(e){return this.sub(Ya.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(It(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this}randomDirection(){const e=freyraumPseudoRandom()*Math.PI*2,t=freyraumPseudoRandom()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ya=new R,Pl=new di;class ui{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,pn):pn.fromBufferAttribute(s,a),pn.applyMatrix4(e.matrixWorld),this.expandByPoint(pn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xs.copy(n.boundingBox)),xs.applyMatrix4(e.matrixWorld),this.union(xs)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,pn),pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ur),bs.subVectors(this.max,Ur),Hi.subVectors(e.a,Ur),Gi.subVectors(e.b,Ur),Vi.subVectors(e.c,Ur),Zn.subVectors(Gi,Hi),Kn.subVectors(Vi,Gi),hi.subVectors(Hi,Vi);let t=[0,-Zn.z,Zn.y,0,-Kn.z,Kn.y,0,-hi.z,hi.y,Zn.z,0,-Zn.x,Kn.z,0,-Kn.x,hi.z,0,-hi.x,-Zn.y,Zn.x,0,-Kn.y,Kn.x,0,-hi.y,hi.x,0];return!qa(t,Hi,Gi,Vi,bs)||(t=[1,0,0,0,1,0,0,0,1],!qa(t,Hi,Gi,Vi,bs))?!1:(_s.crossVectors(Zn,Kn),t=[_s.x,_s.y,_s.z],qa(t,Hi,Gi,Vi,bs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Dn=[new R,new R,new R,new R,new R,new R,new R,new R],pn=new R,xs=new ui,Hi=new R,Gi=new R,Vi=new R,Zn=new R,Kn=new R,hi=new R,Ur=new R,bs=new R,_s=new R,fi=new R;function qa(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){fi.fromArray(r,s);const o=i.x*Math.abs(fi.x)+i.y*Math.abs(fi.y)+i.z*Math.abs(fi.z),l=e.dot(fi),c=t.dot(fi),d=n.dot(fi);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const Gh=new ui,Dr=new R,Za=new R;class Nr{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Gh.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Dr.subVectors(e,this.center);const t=Dr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Dr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Za.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Dr.copy(e.center).add(Za)),this.expandByPoint(Dr.copy(e.center).sub(Za))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Nn=new R,Ka=new R,Ss=new R,jn=new R,ja=new R,ws=new R,Qa=new R;class Vh{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Nn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Nn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Nn.copy(this.origin).addScaledVector(this.direction,t),Nn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Ka.copy(e).add(t).multiplyScalar(.5),Ss.copy(t).sub(e).normalize(),jn.copy(this.origin).sub(Ka);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Ss),o=jn.dot(this.direction),l=-jn.dot(Ss),c=jn.lengthSq(),d=Math.abs(1-a*a);let u,h,f,g;if(d>0)if(u=a*l-o,h=a*o-l,g=s*d,u>=0)if(h>=-g)if(h<=g){const v=1/d;u*=v,h*=v,f=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=s,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*l)+c;else h<=-g?(u=Math.max(0,-(-a*s+o)),h=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c):h<=g?(u=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(u=Math.max(0,-(a*s+o)),h=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c);else h=a>0?-s:s,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ka).addScaledVector(Ss,h),f}intersectSphere(e,t){Nn.subVectors(e.center,this.origin);const n=Nn.dot(this.direction),i=Nn.dot(Nn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,i=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,i=(e.min.x-h.x)*c),d>=0?(s=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Nn)!==null}intersectTriangle(e,t,n,i,s){ja.subVectors(t,e),ws.subVectors(n,e),Qa.crossVectors(ja,ws);let a=this.direction.dot(Qa),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;jn.subVectors(this.origin,e);const l=o*this.direction.dot(ws.crossVectors(jn,ws));if(l<0)return null;const c=o*this.direction.dot(ja.cross(jn));if(c<0||l+c>a)return null;const d=-o*jn.dot(Qa);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,n,i,s,a,o,l,c,d,u,h,f,g,v,m){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,d,u,h,f,g,v,m)}set(e,t,n,i,s,a,o,l,c,d,u,h,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Wi.setFromMatrixColumn(e,0).length(),s=1/Wi.setFromMatrixColumn(e,1).length(),a=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),d=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const h=a*d,f=a*u,g=o*d,v=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=h-v*c,t[9]=-o*l,t[2]=v-h*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,f=l*u,g=c*d,v=c*u;t[0]=h+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=f*o-g,t[6]=v+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,f=l*u,g=c*d,v=c*u;t[0]=h-v*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*d,t[9]=v-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,f=a*u,g=o*d,v=o*u;t[0]=l*d,t[4]=g*c-f,t[8]=h*c+v,t[1]=l*u,t[5]=v*c+h,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*d,t[4]=v-h*u,t[8]=g*u+f,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=f*u+g,t[10]=h-v*u}else if(e.order==="XZY"){const h=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+v,t[5]=a*d,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*d,t[10]=v*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wh,e,Xh)}lookAt(e,t,n){const i=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),Qn.crossVectors(n,tn),Qn.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),Qn.crossVectors(n,tn)),Qn.normalize(),Ms.crossVectors(tn,Qn),i[0]=Qn.x,i[4]=Ms.x,i[8]=tn.x,i[1]=Qn.y,i[5]=Ms.y,i[9]=tn.y,i[2]=Qn.z,i[6]=Ms.z,i[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],u=n[5],h=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],S=n[3],y=n[7],b=n[11],U=n[15],P=i[0],E=i[4],L=i[8],M=i[12],_=i[1],I=i[5],B=i[9],F=i[13],N=i[2],Y=i[6],X=i[10],Q=i[14],q=i[3],re=i[7],ce=i[11],ve=i[15];return s[0]=a*P+o*_+l*N+c*q,s[4]=a*E+o*I+l*Y+c*re,s[8]=a*L+o*B+l*X+c*ce,s[12]=a*M+o*F+l*Q+c*ve,s[1]=d*P+u*_+h*N+f*q,s[5]=d*E+u*I+h*Y+f*re,s[9]=d*L+u*B+h*X+f*ce,s[13]=d*M+u*F+h*Q+f*ve,s[2]=g*P+v*_+m*N+p*q,s[6]=g*E+v*I+m*Y+p*re,s[10]=g*L+v*B+m*X+p*ce,s[14]=g*M+v*F+m*Q+p*ve,s[3]=S*P+y*_+b*N+U*q,s[7]=S*E+y*I+b*Y+U*re,s[11]=S*L+y*B+b*X+U*ce,s[15]=S*M+y*F+b*Q+U*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+s*l*u-i*c*u-s*o*h+n*c*h+i*o*f-n*l*f)+v*(+t*l*f-t*c*h+s*a*h-i*a*f+i*c*d-s*l*d)+m*(+t*c*u-t*o*f-s*a*u+n*a*f+s*o*d-n*c*d)+p*(-i*o*d-t*l*u+t*o*h+i*a*u-n*a*h+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],S=u*m*c-v*h*c+v*l*f-o*m*f-u*l*p+o*h*p,y=g*h*c-d*m*c-g*l*f+a*m*f+d*l*p-a*h*p,b=d*v*c-g*u*c+g*o*f-a*v*f-d*o*p+a*u*p,U=g*u*l-d*v*l-g*o*h+a*v*h+d*o*m-a*u*m,P=t*S+n*y+i*b+s*U;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/P;return e[0]=S*E,e[1]=(v*h*s-u*m*s-v*i*f+n*m*f+u*i*p-n*h*p)*E,e[2]=(o*m*s-v*l*s+v*i*c-n*m*c-o*i*p+n*l*p)*E,e[3]=(u*l*s-o*h*s-u*i*c+n*h*c+o*i*f-n*l*f)*E,e[4]=y*E,e[5]=(d*m*s-g*h*s+g*i*f-t*m*f-d*i*p+t*h*p)*E,e[6]=(g*l*s-a*m*s-g*i*c+t*m*c+a*i*p-t*l*p)*E,e[7]=(a*h*s-d*l*s+d*i*c-t*h*c-a*i*f+t*l*f)*E,e[8]=b*E,e[9]=(g*u*s-d*v*s-g*n*f+t*v*f+d*n*p-t*u*p)*E,e[10]=(a*v*s-g*o*s+g*n*c-t*v*c-a*n*p+t*o*p)*E,e[11]=(d*o*s-a*u*s-d*n*c+t*u*c+a*n*f-t*o*f)*E,e[12]=U*E,e[13]=(d*v*i-g*u*i+g*n*h-t*v*h-d*n*m+t*u*m)*E,e[14]=(g*o*i-a*v*i-g*n*l+t*v*l+a*n*m-t*o*m)*E,e[15]=(a*u*i-d*o*i+d*n*l-t*u*l-a*n*h+t*o*h)*E,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,d*o+n,d*l-i*a,0,c*l-i*o,d*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,d=a+a,u=o+o,h=s*c,f=s*d,g=s*u,v=a*d,m=a*u,p=o*u,S=l*c,y=l*d,b=l*u,U=n.x,P=n.y,E=n.z;return i[0]=(1-(v+p))*U,i[1]=(f+b)*U,i[2]=(g-y)*U,i[3]=0,i[4]=(f-b)*P,i[5]=(1-(h+p))*P,i[6]=(m+S)*P,i[7]=0,i[8]=(g+y)*E,i[9]=(m-S)*E,i[10]=(1-(h+v))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=Wi.set(i[0],i[1],i[2]).length();const a=Wi.set(i[4],i[5],i[6]).length(),o=Wi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],mn.copy(this);const c=1/s,d=1/a,u=1/o;return mn.elements[0]*=c,mn.elements[1]*=c,mn.elements[2]*=c,mn.elements[4]*=d,mn.elements[5]*=d,mn.elements[6]*=d,mn.elements[8]*=u,mn.elements[9]*=u,mn.elements[10]*=u,t.setFromRotationMatrix(mn),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a,o=2e3){const l=this.elements,c=2*s/(t-e),d=2*s/(n-i),u=(t+e)/(t-e),h=(n+i)/(n-i);let f,g;if(o===2e3)f=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===2001)f=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=2e3){const l=this.elements,c=1/(t-e),d=1/(n-i),u=1/(a-s),h=(t+e)*c,f=(n+i)*d;let g,v;if(o===2e3)g=(a+s)*u,v=-2*u;else if(o===2001)g=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Wi=new R,mn=new dt,Wh=new R(0,0,0),Xh=new R(1,1,1),Qn=new R,Ms=new R,tn=new R,Il=new dt,Ll=new di;class _n{constructor(e=0,t=0,n=0,i=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],d=i[9],u=i[2],h=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-It(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(It(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(It(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Il.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Il,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ll.setFromEuler(this),this.setFromQuaternion(Ll,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class kl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let $h=0;const Ul=new R,Xi=new di,Fn=new dt,Es=new R,Fr=new R,Yh=new R,qh=new di,Dl=new R(1,0,0),Nl=new R(0,1,0),Fl=new R(0,0,1),Ol={type:"added"},Zh={type:"removed"},$i={type:"childadded",child:null},Ja={type:"childremoved",child:null};class Et extends Ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new R,t=new _n,n=new di,i=new R(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new dt},normalMatrix:{value:new Ke}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(Dl,e)}rotateY(e){return this.rotateOnAxis(Nl,e)}rotateZ(e){return this.rotateOnAxis(Fl,e)}translateOnAxis(e,t){return Ul.copy(e).applyQuaternion(this.quaternion),this.position.add(Ul.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Dl,e)}translateY(e){return this.translateOnAxis(Nl,e)}translateZ(e){return this.translateOnAxis(Fl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Es.copy(e):Es.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(Fr,Es,this.up):Fn.lookAt(Es,Fr,this.up),this.quaternion.setFromRotationMatrix(Fn),i&&(Fn.extractRotation(i.matrixWorld),Xi.setFromRotationMatrix(Fn),this.quaternion.premultiply(Xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ol),$i.child=e,this.dispatchEvent($i),$i.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Zh),Ja.child=e,this.dispatchEvent(Ja),Ja.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ol),$i.child=e,this.dispatchEvent($i),$i.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fr,e,Yh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fr,qh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Et.DEFAULT_UP=new R(0,1,0),Et.DEFAULT_MATRIX_AUTO_UPDATE=!0,Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gn=new R,On=new R,eo=new R,Bn=new R,Yi=new R,qi=new R,Bl=new R,to=new R,no=new R,io=new R;class Sn{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),gn.subVectors(e,t),i.cross(gn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){gn.subVectors(i,t),On.subVectors(n,t),eo.subVectors(e,t);const a=gn.dot(gn),o=gn.dot(On),l=gn.dot(eo),c=On.dot(On),d=On.dot(eo),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(c*l-o*d)*h,g=(a*d-o*l)*h;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Bn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Bn.x),l.addScaledVector(a,Bn.y),l.addScaledVector(o,Bn.z),l)}static isFrontFacing(e,t,n,i){return gn.subVectors(n,t),On.subVectors(e,t),gn.cross(On).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),gn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Sn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Sn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Sn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Sn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Sn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Yi.subVectors(i,n),qi.subVectors(s,n),to.subVectors(e,n);const l=Yi.dot(to),c=qi.dot(to);if(l<=0&&c<=0)return t.copy(n);no.subVectors(e,i);const d=Yi.dot(no),u=qi.dot(no);if(d>=0&&u<=d)return t.copy(i);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(Yi,a);io.subVectors(e,s);const f=Yi.dot(io),g=qi.dot(io);if(g>=0&&f<=g)return t.copy(s);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(qi,o);const m=d*g-f*u;if(m<=0&&u-d>=0&&f-g>=0)return Bl.subVectors(s,i),o=(u-d)/(u-d+(f-g)),t.copy(i).addScaledVector(Bl,o);const p=1/(m+v+h);return a=v*p,o=h*p,t.copy(n).addScaledVector(Yi,a).addScaledVector(qi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const zl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},Ts={h:0,s:0,l:0};function ro(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Pe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,ut.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=ut.workingColorSpace){if(e=Va(e,1),t=It(t,0,1),n=It(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=ro(a,s,e+1/3),this.g=ro(a,s,e),this.b=ro(a,s,e-1/3)}return ut.toWorkingColorSpace(this,i),this}setStyle(e,t=Ot){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){const n=zl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bi(e.r),this.g=Bi(e.g),this.b=Bi(e.b),this}copyLinearToSRGB(e){return this.r=Xa(e.r),this.g=Xa(e.g),this.b=Xa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return ut.fromWorkingColorSpace(zt.copy(this),e),Math.round(It(zt.r*255,0,255))*65536+Math.round(It(zt.g*255,0,255))*256+Math.round(It(zt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.fromWorkingColorSpace(zt.copy(this),t);const n=zt.r,i=zt.g,s=zt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=ut.workingColorSpace){return ut.fromWorkingColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Ot){ut.fromWorkingColorSpace(zt.copy(this),e);const t=zt.r,n=zt.g,i=zt.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Jn),this.setHSL(Jn.h+e,Jn.s+t,Jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Jn),e.getHSL(Ts);const n=Lr(Jn.h,Ts.h,t),i=Lr(Jn.s,Ts.s,t),s=Lr(Jn.l,Ts.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new Pe;Pe.NAMES=zl;let Kh=0;class Or extends Ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kh++}),this.uuid=ci(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class pi extends Or{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tt=new R,As=new he;class vn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return El("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)As.fromBufferAttribute(this,t),As.applyMatrix3(e),this.setXY(t,As.x,As.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Oi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$t(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Oi(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Oi(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Oi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Oi(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),i=$t(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),i=$t(i,this.array),s=$t(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}}class Hl extends vn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Gl extends vn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Yt extends vn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let jh=0;const ln=new dt,so=new Et,Zi=new R,nn=new ui,Br=new ui,kt=new R;class wn extends Ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wl(e)?Gl:Hl)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ke().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ln.makeRotationFromQuaternion(e),this.applyMatrix4(ln),this}rotateX(e){return ln.makeRotationX(e),this.applyMatrix4(ln),this}rotateY(e){return ln.makeRotationY(e),this.applyMatrix4(ln),this}rotateZ(e){return ln.makeRotationZ(e),this.applyMatrix4(ln),this}translate(e,t,n){return ln.makeTranslation(e,t,n),this.applyMatrix4(ln),this}scale(e,t,n){return ln.makeScale(e,t,n),this.applyMatrix4(ln),this}lookAt(e){return so.lookAt(e),so.updateMatrix(),this.applyMatrix4(so.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zi).negate(),this.translate(Zi.x,Zi.y,Zi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Yt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];nn.setFromBufferAttribute(s),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Br.setFromBufferAttribute(o),this.morphTargetsRelative?(kt.addVectors(nn.min,Br.min),nn.expandByPoint(kt),kt.addVectors(nn.max,Br.max),nn.expandByPoint(kt)):(nn.expandByPoint(Br.min),nn.expandByPoint(Br.max))}nn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)kt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(kt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)kt.fromBufferAttribute(o,c),l&&(Zi.fromBufferAttribute(e,c),kt.add(Zi)),i=Math.max(i,n.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<n.count;L++)o[L]=new R,l[L]=new R;const c=new R,d=new R,u=new R,h=new he,f=new he,g=new he,v=new R,m=new R;function p(L,M,_){c.fromBufferAttribute(n,L),d.fromBufferAttribute(n,M),u.fromBufferAttribute(n,_),h.fromBufferAttribute(s,L),f.fromBufferAttribute(s,M),g.fromBufferAttribute(s,_),d.sub(c),u.sub(c),f.sub(h),g.sub(h);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(v.copy(d).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(d,-g.x).multiplyScalar(I),o[L].add(v),o[M].add(v),o[_].add(v),l[L].add(m),l[M].add(m),l[_].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let L=0,M=S.length;L<M;++L){const _=S[L],I=_.start,B=_.count;for(let F=I,N=I+B;F<N;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const y=new R,b=new R,U=new R,P=new R;function E(L){U.fromBufferAttribute(i,L),P.copy(U);const M=o[L];y.copy(M),y.sub(U.multiplyScalar(U.dot(M))).normalize(),b.crossVectors(P,M);const I=b.dot(l[L])<0?-1:1;a.setXYZW(L,y.x,y.y,y.z,I)}for(let L=0,M=S.length;L<M;++L){const _=S[L],I=_.start,B=_.count;for(let F=I,N=I+B;F<N;F+=3)E(e.getX(F+0)),E(e.getX(F+1)),E(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new vn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const i=new R,s=new R,a=new R,o=new R,l=new R,c=new R,d=new R,u=new R;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),d.subVectors(a,s),u.subVectors(i,s),d.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(d),l.add(d),c.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)i.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,s),u.subVectors(i,s),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*d;for(let p=0;p<d;p++)h[g++]=c[f++]}return new vn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new wn,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],f=e(h,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const f=c[u];d.push(f.toJSON(e.data))}d.length>0&&(i[l]=d,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const d=i[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],u=s[c];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vl=new dt,mi=new Vh,Cs=new Nr,Wl=new R,Ki=new R,ji=new R,Qi=new R,ao=new R,Rs=new R,Ps=new he,Is=new he,Ls=new he,Xl=new R,$l=new R,Yl=new R,ks=new R,Us=new R;class Ge extends Et{constructor(e=new wn,t=new pi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){Rs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],u=s[l];d!==0&&(ao.fromBufferAttribute(u,e),a?Rs.addScaledVector(ao,d):Rs.addScaledVector(ao.sub(t),d))}t.add(Rs)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(s),mi.copy(e.ray).recast(e.near),!(Cs.containsPoint(mi.origin)===!1&&(mi.intersectSphere(Cs,Wl)===null||mi.origin.distanceToSquared(Wl)>(e.far-e.near)**2))&&(Vl.copy(s).invert(),mi.copy(e.ray).applyMatrix4(Vl),!(n.boundingBox!==null&&mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,mi)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){const m=h[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),y=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let b=S,U=y;b<U;b+=3){const P=o.getX(b),E=o.getX(b+1),L=o.getX(b+2);i=Ds(this,p,e,n,c,d,u,P,E,L),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=o.getX(m),y=o.getX(m+1),b=o.getX(m+2);i=Ds(this,a,e,n,c,d,u,S,y,b),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){const m=h[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let b=S,U=y;b<U;b+=3){const P=b,E=b+1,L=b+2;i=Ds(this,p,e,n,c,d,u,P,E,L),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=m,y=m+1,b=m+2;i=Ds(this,a,e,n,c,d,u,S,y,b),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Qh(r,e,t,n,i,s,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===0,o),l===null)return null;Us.copy(o),Us.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(Us);return c<t.near||c>t.far?null:{distance:c,point:Us.clone(),object:r}}function Ds(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,Ki),r.getVertexPosition(l,ji),r.getVertexPosition(c,Qi);const d=Qh(r,e,t,n,Ki,ji,Qi,ks);if(d){i&&(Ps.fromBufferAttribute(i,o),Is.fromBufferAttribute(i,l),Ls.fromBufferAttribute(i,c),d.uv=Sn.getInterpolation(ks,Ki,ji,Qi,Ps,Is,Ls,new he)),s&&(Ps.fromBufferAttribute(s,o),Is.fromBufferAttribute(s,l),Ls.fromBufferAttribute(s,c),d.uv1=Sn.getInterpolation(ks,Ki,ji,Qi,Ps,Is,Ls,new he)),a&&(Xl.fromBufferAttribute(a,o),$l.fromBufferAttribute(a,l),Yl.fromBufferAttribute(a,c),d.normal=Sn.getInterpolation(ks,Ki,ji,Qi,Xl,$l,Yl,new R),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};Sn.getNormal(Ki,ji,Qi,u.normal),d.face=u}return d}class Nt extends wn{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],u=[];let h=0,f=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(d,3)),this.setAttribute("uv",new Yt(u,2));function g(v,m,p,S,y,b,U,P,E,L,M){const _=b/E,I=U/L,B=b/2,F=U/2,N=P/2,Y=E+1,X=L+1;let Q=0,q=0;const re=new R;for(let ce=0;ce<X;ce++){const ve=ce*I-F;for(let te=0;te<Y;te++){const Ve=te*_-B;re[v]=Ve*S,re[m]=ve*y,re[p]=N,c.push(re.x,re.y,re.z),re[v]=0,re[m]=0,re[p]=P>0?1:-1,d.push(re.x,re.y,re.z),u.push(te/E),u.push(1-ce/L),Q+=1}}for(let ce=0;ce<L;ce++)for(let ve=0;ve<E;ve++){const te=h+ve+Y*ce,Ve=h+ve+Y*(ce+1),J=h+(ve+1)+Y*(ce+1),oe=h+(ve+1)+Y*ce;l.push(te,Ve,oe),l.push(Ve,J,oe),q+=6}o.addGroup(f,q,M),f+=q,h+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function qt(r){const e={};for(let t=0;t<r.length;t++){const n=Ji(r[t]);for(const i in n)e[i]=n[i]}return e}function Jh(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function ql(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}const er={clone:Ji,merge:qt};var ef=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ft extends Or{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ef,this.fragmentShader=tf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=Jh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Zl extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=2e3}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ei=new R,Kl=new he,jl=new he;class Ht extends Zl{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ir*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fi*2*Math.atan(Math.tan(Ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ei.x,ei.y).multiplyScalar(-e/ei.z),ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ei.x,ei.y).multiplyScalar(-e/ei.z)}getViewSize(e,t){return this.getViewBounds(e,Kl,jl),t.subVectors(jl,Kl)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ir*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const tr=-90,nr=1;class nf extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ht(tr,nr,e,t);i.layers=this.layers,this.add(i);const s=new Ht(tr,nr,e,t);s.layers=this.layers,this.add(s);const a=new Ht(tr,nr,e,t);a.layers=this.layers,this.add(a);const o=new Ht(tr,nr,e,t);o.layers=this.layers,this.add(o);const l=new Ht(tr,nr,e,t);l.layers=this.layers,this.add(l);const c=new Ht(tr,nr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,d),e.setRenderTarget(u,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ql extends Lt{constructor(e,t,n,i,s,a,o,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:301,super(e,t,n,i,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rf extends Zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ql(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:1006}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Nt(5,5,5),s=new Ft({name:"CubemapFromEquirect",uniforms:Ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new Ge(i,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new nf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}const oo=new R,sf=new R,af=new Ke;class gi{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=oo.subVectors(n,t).cross(sf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(oo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||af.getNormalMatrix(e),i=this.coplanarPoint(oo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const vi=new Nr,Ns=new R;class lo{constructor(e=new gi,t=new gi,n=new gi,i=new gi,s=new gi,a=new gi){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){const n=this.planes,i=e.elements,s=i[0],a=i[1],o=i[2],l=i[3],c=i[4],d=i[5],u=i[6],h=i[7],f=i[8],g=i[9],v=i[10],m=i[11],p=i[12],S=i[13],y=i[14],b=i[15];if(n[0].setComponents(l-s,h-c,m-f,b-p).normalize(),n[1].setComponents(l+s,h+c,m+f,b+p).normalize(),n[2].setComponents(l+a,h+d,m+g,b+S).normalize(),n[3].setComponents(l-a,h-d,m-g,b-S).normalize(),n[4].setComponents(l-o,h-u,m-v,b-y).normalize(),t===2e3)n[5].setComponents(l+o,h+u,m+v,b+y).normalize();else if(t===2001)n[5].setComponents(o,u,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),vi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),vi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(vi)}intersectsSprite(e){return vi.center.set(0,0,0),vi.radius=.7071067811865476,vi.applyMatrix4(e.matrixWorld),this.intersectsSphere(vi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ns.x=i.normal.x>0?e.max.x:e.min.x,Ns.y=i.normal.y>0?e.max.y:e.min.y,Ns.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ns)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Jl(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function of(r){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=r.createBuffer();r.bindBuffer(l,h),r.bufferData(l,c,d),o.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const d=l.array,u=l._updateRange,h=l.updateRanges;if(r.bindBuffer(c,o),u.count===-1&&h.length===0&&r.bufferSubData(c,0,d),h.length!==0){for(let f=0,g=h.length;f<g;f++){const v=h[f];r.bufferSubData(c,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}l.clearUpdateRanges()}u.count!==-1&&(r.bufferSubData(c,u.offset*d.BYTES_PER_ELEMENT,d,u.offset,u.count),u.count=-1),l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}class Kt extends wn{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,d=l+1,u=e/o,h=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<d;p++){const S=p*h-a;for(let y=0;y<c;y++){const b=y*u-s;g.push(b,-S,0),v.push(0,0,1),m.push(y/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){const y=S+c*p,b=S+c*(p+1),U=S+1+c*(p+1),P=S+1+c*p;f.push(y,b,P),f.push(b,U,P)}this.setIndex(f),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(v,3)),this.setAttribute("uv",new Yt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kt(e.width,e.height,e.widthSegments,e.heightSegments)}}var lf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cf=`#ifdef USE_ALPHAHASH
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
#endif`,df=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pf=`#ifdef USE_AOMAP
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
#endif`,mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gf=`#ifdef USE_BATCHING
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
#endif`,vf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_f=`#ifdef USE_IRIDESCENCE
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
#endif`,Sf=`#ifdef USE_BUMPMAP
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
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,If=`#define PI 3.141592653589793
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
} // validated`,Lf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,kf=`vec3 transformedNormal = objectNormal;
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
#endif`,Uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Df=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ff=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Of="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bf=`
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
}`,zf=`#ifdef USE_ENVMAP
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
#endif`,Hf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Gf=`#ifdef USE_ENVMAP
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
#endif`,Vf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$f=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zf=`#ifdef USE_GRADIENTMAP
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
}`,Kf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Jf=`uniform bool receiveShadow;
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
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,tp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ip=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sp=`PhysicalMaterial material;
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
#endif`,ap=`struct PhysicalMaterial {
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
}`,op=`
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
#endif`,lp=`#if defined( RE_IndirectDiffuse )
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
#endif`,cp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,up=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vp=`#if defined( USE_POINTS_UV )
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
#endif`,yp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_p=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wp=`#ifdef USE_MORPHTARGETS
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
#endif`,Mp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ep=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pp=`#ifdef USE_NORMALMAP
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
#endif`,Ip=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Up=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Np=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Fp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,$p=`float getShadowMask() {
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
}`,Yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qp=`#ifdef USE_SKINNING
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
#endif`,Zp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kp=`#ifdef USE_SKINNING
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
#endif`,jp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Jp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,em=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tm=`#ifdef USE_TRANSMISSION
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
#endif`,nm=`#ifdef USE_TRANSMISSION
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
#endif`,im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,am=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const je={alphahash_fragment:lf,alphahash_pars_fragment:cf,alphamap_fragment:df,alphamap_pars_fragment:uf,alphatest_fragment:hf,alphatest_pars_fragment:ff,aomap_fragment:pf,aomap_pars_fragment:mf,batching_pars_vertex:gf,batching_vertex:vf,begin_vertex:yf,beginnormal_vertex:xf,bsdfs:bf,iridescence_fragment:_f,bumpmap_pars_fragment:Sf,clipping_planes_fragment:wf,clipping_planes_pars_fragment:Mf,clipping_planes_pars_vertex:Ef,clipping_planes_vertex:Tf,color_fragment:Af,color_pars_fragment:Cf,color_pars_vertex:Rf,color_vertex:Pf,common:If,cube_uv_reflection_fragment:Lf,defaultnormal_vertex:kf,displacementmap_pars_vertex:Uf,displacementmap_vertex:Df,emissivemap_fragment:Nf,emissivemap_pars_fragment:Ff,colorspace_fragment:Of,colorspace_pars_fragment:Bf,envmap_fragment:zf,envmap_common_pars_fragment:Hf,envmap_pars_fragment:Gf,envmap_pars_vertex:Vf,envmap_physical_pars_fragment:ep,envmap_vertex:Wf,fog_vertex:Xf,fog_pars_vertex:$f,fog_fragment:Yf,fog_pars_fragment:qf,gradientmap_pars_fragment:Zf,lightmap_pars_fragment:Kf,lights_lambert_fragment:jf,lights_lambert_pars_fragment:Qf,lights_pars_begin:Jf,lights_toon_fragment:tp,lights_toon_pars_fragment:np,lights_phong_fragment:ip,lights_phong_pars_fragment:rp,lights_physical_fragment:sp,lights_physical_pars_fragment:ap,lights_fragment_begin:op,lights_fragment_maps:lp,lights_fragment_end:cp,logdepthbuf_fragment:dp,logdepthbuf_pars_fragment:up,logdepthbuf_pars_vertex:hp,logdepthbuf_vertex:fp,map_fragment:pp,map_pars_fragment:mp,map_particle_fragment:gp,map_particle_pars_fragment:vp,metalnessmap_fragment:yp,metalnessmap_pars_fragment:xp,morphinstance_vertex:bp,morphcolor_vertex:_p,morphnormal_vertex:Sp,morphtarget_pars_vertex:wp,morphtarget_vertex:Mp,normal_fragment_begin:Ep,normal_fragment_maps:Tp,normal_pars_fragment:Ap,normal_pars_vertex:Cp,normal_vertex:Rp,normalmap_pars_fragment:Pp,clearcoat_normal_fragment_begin:Ip,clearcoat_normal_fragment_maps:Lp,clearcoat_pars_fragment:kp,iridescence_pars_fragment:Up,opaque_fragment:Dp,packing:Np,premultiplied_alpha_fragment:Fp,project_vertex:Op,dithering_fragment:Bp,dithering_pars_fragment:zp,roughnessmap_fragment:Hp,roughnessmap_pars_fragment:Gp,shadowmap_pars_fragment:Vp,shadowmap_pars_vertex:Wp,shadowmap_vertex:Xp,shadowmask_pars_fragment:$p,skinbase_vertex:Yp,skinning_pars_vertex:qp,skinning_vertex:Zp,skinnormal_vertex:Kp,specularmap_fragment:jp,specularmap_pars_fragment:Qp,tonemapping_fragment:Jp,tonemapping_pars_fragment:em,transmission_fragment:tm,transmission_pars_fragment:nm,uv_pars_fragment:im,uv_pars_vertex:rm,uv_vertex:sm,worldpos_vertex:am,background_vert:`varying vec2 vUv;
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
}`},ge={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},Mn={basic:{uniforms:qt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:qt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Pe(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:qt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:qt([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:qt([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Pe(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:qt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:qt([ge.points,ge.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:qt([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:qt([ge.common,ge.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:qt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:qt([ge.sprite,ge.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:qt([ge.common,ge.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:qt([ge.lights,ge.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};Mn.physical={uniforms:qt([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const Fs={r:0,b:0,g:0},yi=new _n,om=new dt;function lm(r,e,t,n,i,s,a){const o=new Pe(0);let l=s===!0?0:1,c,d,u=null,h=0,f=null;function g(S){let y=S.isScene===!0?S.background:null;return y&&y.isTexture&&(y=(S.backgroundBlurriness>0?t:e).get(y)),y}function v(S){let y=!1;const b=g(S);b===null?p(o,l):b&&b.isColor&&(p(b,1),y=!0);const U=r.xr.getEnvironmentBlendMode();U==="additive"?n.buffers.color.setClear(0,0,0,1,a):U==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(S,y){const b=g(y);b&&(b.isCubeTexture||b.mapping===306)?(d===void 0&&(d=new Ge(new Nt(1,1,1),new Ft({name:"BackgroundCubeMaterial",uniforms:Ji(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(U,P,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(d)),yi.copy(y.backgroundRotation),yi.x*=-1,yi.y*=-1,yi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),d.material.uniforms.envMap.value=b,d.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(om.makeRotationFromEuler(yi)),d.material.toneMapped=ut.getTransfer(b.colorSpace)!==mt,(u!==b||h!==b.version||f!==r.toneMapping)&&(d.material.needsUpdate=!0,u=b,h=b.version,f=r.toneMapping),d.layers.enableAll(),S.unshift(d,d.geometry,d.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new Ge(new Kt(2,2),new Ft({name:"BackgroundMaterial",uniforms:Ji(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=ut.getTransfer(b.colorSpace)!==mt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(u!==b||h!==b.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,u=b,h=b.version,f=r.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,y){S.getRGB(Fs,ql(r)),n.buffers.color.setClear(Fs.r,Fs.g,Fs.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(S,y=1){o.set(S),l=y,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(o,l)},render:v,addToRenderList:m}}function cm(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=h(null);let s=i,a=!1;function o(_,I,B,F,N){let Y=!1;const X=u(F,B,I);s!==X&&(s=X,c(s.object)),Y=f(_,F,B,N),Y&&g(_,F,B,N),N!==null&&e.update(N,r.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,b(_,I,B,F),N!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return r.createVertexArray()}function c(_){return r.bindVertexArray(_)}function d(_){return r.deleteVertexArray(_)}function u(_,I,B){const F=B.wireframe===!0;let N=n[_.id];N===void 0&&(N={},n[_.id]=N);let Y=N[I.id];Y===void 0&&(Y={},N[I.id]=Y);let X=Y[F];return X===void 0&&(X=h(l()),Y[F]=X),X}function h(_){const I=[],B=[],F=[];for(let N=0;N<t;N++)I[N]=0,B[N]=0,F[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:B,attributeDivisors:F,object:_,attributes:{},index:null}}function f(_,I,B,F){const N=s.attributes,Y=I.attributes;let X=0;const Q=B.getAttributes();for(const q in Q)if(Q[q].location>=0){const ce=N[q];let ve=Y[q];if(ve===void 0&&(q==="instanceMatrix"&&_.instanceMatrix&&(ve=_.instanceMatrix),q==="instanceColor"&&_.instanceColor&&(ve=_.instanceColor)),ce===void 0||ce.attribute!==ve||ve&&ce.data!==ve.data)return!0;X++}return s.attributesNum!==X||s.index!==F}function g(_,I,B,F){const N={},Y=I.attributes;let X=0;const Q=B.getAttributes();for(const q in Q)if(Q[q].location>=0){let ce=Y[q];ce===void 0&&(q==="instanceMatrix"&&_.instanceMatrix&&(ce=_.instanceMatrix),q==="instanceColor"&&_.instanceColor&&(ce=_.instanceColor));const ve={};ve.attribute=ce,ce&&ce.data&&(ve.data=ce.data),N[q]=ve,X++}s.attributes=N,s.attributesNum=X,s.index=F}function v(){const _=s.newAttributes;for(let I=0,B=_.length;I<B;I++)_[I]=0}function m(_){p(_,0)}function p(_,I){const B=s.newAttributes,F=s.enabledAttributes,N=s.attributeDivisors;B[_]=1,F[_]===0&&(r.enableVertexAttribArray(_),F[_]=1),N[_]!==I&&(r.vertexAttribDivisor(_,I),N[_]=I)}function S(){const _=s.newAttributes,I=s.enabledAttributes;for(let B=0,F=I.length;B<F;B++)I[B]!==_[B]&&(r.disableVertexAttribArray(B),I[B]=0)}function y(_,I,B,F,N,Y,X){X===!0?r.vertexAttribIPointer(_,I,B,N,Y):r.vertexAttribPointer(_,I,B,F,N,Y)}function b(_,I,B,F){v();const N=F.attributes,Y=B.getAttributes(),X=I.defaultAttributeValues;for(const Q in Y){const q=Y[Q];if(q.location>=0){let re=N[Q];if(re===void 0&&(Q==="instanceMatrix"&&_.instanceMatrix&&(re=_.instanceMatrix),Q==="instanceColor"&&_.instanceColor&&(re=_.instanceColor)),re!==void 0){const ce=re.normalized,ve=re.itemSize,te=e.get(re);if(te===void 0)continue;const Ve=te.buffer,J=te.type,oe=te.bytesPerElement,_e=J===r.INT||J===r.UNSIGNED_INT||re.gpuType===1013;if(re.isInterleavedBufferAttribute){const me=re.data,Ue=me.stride,ke=re.offset;if(me.isInstancedInterleavedBuffer){for(let We=0;We<q.locationSize;We++)p(q.location+We,me.meshPerAttribute);_.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let We=0;We<q.locationSize;We++)m(q.location+We);r.bindBuffer(r.ARRAY_BUFFER,Ve);for(let We=0;We<q.locationSize;We++)y(q.location+We,ve/q.locationSize,J,ce,Ue*oe,(ke+ve/q.locationSize*We)*oe,_e)}else{if(re.isInstancedBufferAttribute){for(let me=0;me<q.locationSize;me++)p(q.location+me,re.meshPerAttribute);_.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let me=0;me<q.locationSize;me++)m(q.location+me);r.bindBuffer(r.ARRAY_BUFFER,Ve);for(let me=0;me<q.locationSize;me++)y(q.location+me,ve/q.locationSize,J,ce,ve*oe,ve/q.locationSize*me*oe,_e)}}else if(X!==void 0){const ce=X[Q];if(ce!==void 0)switch(ce.length){case 2:r.vertexAttrib2fv(q.location,ce);break;case 3:r.vertexAttrib3fv(q.location,ce);break;case 4:r.vertexAttrib4fv(q.location,ce);break;default:r.vertexAttrib1fv(q.location,ce)}}}}S()}function U(){L();for(const _ in n){const I=n[_];for(const B in I){const F=I[B];for(const N in F)d(F[N].object),delete F[N];delete I[B]}delete n[_]}}function P(_){if(n[_.id]===void 0)return;const I=n[_.id];for(const B in I){const F=I[B];for(const N in F)d(F[N].object),delete F[N];delete I[B]}delete n[_.id]}function E(_){for(const I in n){const B=n[I];if(B[_.id]===void 0)continue;const F=B[_.id];for(const N in F)d(F[N].object),delete F[N];delete B[_.id]}}function L(){M(),a=!0,s!==i&&(s=i,c(s.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:L,resetDefaultState:M,dispose:U,releaseStatesOfGeometry:P,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function dm(r,e,t){let n;function i(c){n=c}function s(c,d){r.drawArrays(n,c,d),t.update(d,n,1)}function a(c,d,u){u!==0&&(r.drawArraysInstanced(n,c,d,u),t.update(d,n,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,u);let f=0;for(let g=0;g<u;g++)f+=d[g];t.update(f,n,1)}function l(c,d,u,h){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],d[g],h[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,d,0,h,0,u);let g=0;for(let v=0;v<u;v++)g+=d[v];for(let v=0;v<h.length;v++)t.update(g,n,h[v])}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function um(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(P){return!(P!==1023&&n.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const E=P===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==1009&&n.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==1015&&!E)}function l(P){if(P==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),f=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_TEXTURE_SIZE),v=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),p=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),y=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),b=f>0,U=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:v,maxAttributes:m,maxVertexUniforms:p,maxVaryings:S,maxFragmentUniforms:y,vertexTextures:b,maxSamples:U}}function hm(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new gi,o=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||n!==0||i;return i=h,n=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=r.get(u);if(!i||g===null||g.length===0||s&&!m)s?d(null):c();else{const S=s?0:n,y=S*4;let b=p.clippingState||null;l.value=b,b=d(g,h,y,f);for(let U=0;U!==y;++U)b[U]=t[U];p.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,h,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,b=f;y!==v;++y,b+=4)a.copy(u[y]).applyMatrix4(S,o),a.normal.toArray(m,b),m[b+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function fm(r){let e=new WeakMap;function t(a,o){return o===303?a.mapping=301:o===304&&(a.mapping=302),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===303||o===304)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new rf(l.height);return c.fromEquirectangularTexture(r,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Os extends Zl{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ir=4,ec=[.125,.215,.35,.446,.526,.582],xi=20,co=new Os,tc=new Pe;let uo=null,ho=0,fo=0,po=!1;const bi=(1+Math.sqrt(5))/2,rr=1/bi,nc=[new R(-bi,rr,0),new R(bi,rr,0),new R(-rr,0,bi),new R(rr,0,bi),new R(0,bi,-rr),new R(0,bi,rr),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class Bs{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){uo=this._renderer.getRenderTarget(),ho=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(uo,ho,fo),this._renderer.xr.enabled=po,e.scissorTest=!1,zs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),uo=this._renderer.getRenderTarget(),ho=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:on,depthBuffer:!1},i=ic(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ic(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=pm(s)),this._blurMaterial=mm(s,e,t)}return i}_compileMaterial(e){const t=new Ge(this._lodPlanes[0],e);this._renderer.compile(t,co)}_sceneToCubeUV(e,t,n,i){const o=new Ht(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(tc),d.toneMapping=0,d.autoClear=!1;const f=new pi({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),g=new Ge(new Nt,f);let v=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,v=!0):(f.color.copy(tc),v=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):S===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const y=this._cubeSize;zs(i,S*y,p>2?y:0,y,y),d.setRenderTarget(i),v&&d.render(g,o),d.render(e,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===301||e.mapping===302;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=sc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rc());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new Ge(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;zs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,co)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=nc[(i-s-1)%nc.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new Ge(this._lodPlanes[i],c),h=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*xi-1),v=s/g,m=isFinite(s)?1+Math.floor(d*v):xi;m>xi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xi}`);const p=[];let S=0;for(let E=0;E<xi;++E){const L=E/v,M=Math.exp(-L*L/2);p.push(M),E===0?S+=M:E<m&&(S+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/S;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:y}=this;h.dTheta.value=g,h.mipInt.value=y-n;const b=this._sizeLods[i],U=3*b*(i>y-ir?i-y+ir:0),P=4*(this._cubeSize-b);zs(t,U,P,3*b,2*b),l.setRenderTarget(t),l.render(u,co)}}function pm(r){const e=[],t=[],n=[];let i=r;const s=r-ir+1+ec.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>r-ir?l=ec[a-r+ir-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,g=6,v=3,m=2,p=1,S=new Float32Array(v*g*f),y=new Float32Array(m*g*f),b=new Float32Array(p*g*f);for(let P=0;P<f;P++){const E=P%3*2/3-1,L=P>2?0:-1,M=[E,L,0,E+2/3,L,0,E+2/3,L+1,0,E,L,0,E+2/3,L+1,0,E,L+1,0];S.set(M,v*g*P),y.set(h,m*g*P);const _=[P,P,P,P,P,P];b.set(_,p*g*P)}const U=new wn;U.setAttribute("position",new vn(S,v)),U.setAttribute("uv",new vn(y,m)),U.setAttribute("faceIndex",new vn(b,p)),e.push(U),i>ir&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ic(r,e,t){const n=new Zt(r,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function zs(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function mm(r,e,t){const n=new Float32Array(xi),i=new R(0,1,0);return new Ft({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:mo(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function rc(){return new Ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mo(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function sc(){return new Ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function mo(){return`

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
	`}function gm(r){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===303||l===304,d=l===301||l===302;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Bs(r)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||d&&f&&i(f)?(t===null&&(t=new Bs(r)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function vm(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&El("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function ym(r,e,t,n){const i={},s=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const v=h.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)e.remove(v[m])}h.removeEventListener("dispose",a),delete i[h.id];const f=s.get(h);f&&(e.remove(f),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return i[h.id]===!0||(h.addEventListener("dispose",a),i[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const g in h)e.update(h[g],r.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)e.update(v[m],r.ARRAY_BUFFER)}}function c(u){const h=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const S=f.array;v=f.version;for(let y=0,b=S.length;y<b;y+=3){const U=S[y+0],P=S[y+1],E=S[y+2];h.push(U,P,P,E,E,U)}}else if(g!==void 0){const S=g.array;v=g.version;for(let y=0,b=S.length/3-1;y<b;y+=3){const U=y+0,P=y+1,E=y+2;h.push(U,P,P,E,E,U)}}else return;const m=new(wl(h)?Gl:Hl)(h,1);m.version=v;const p=s.get(u);p&&e.remove(p),s.set(u,m)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function xm(r,e,t){let n;function i(h){n=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,f){r.drawElements(n,f,s,h*a),t.update(f,n,1)}function c(h,f,g){g!==0&&(r.drawElementsInstanced(n,f,s,h*a,g),t.update(f,n,g))}function d(h,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,h,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(h,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,h,0,v,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S];for(let S=0;S<v.length;S++)t.update(p,n,v[S])}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function bm(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function _m(r,e,t){const n=new WeakMap,i=new vt;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=n.get(o);if(h===void 0||h.count!==u){let M=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",M)};h!==void 0&&h.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let y=0;f===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let b=o.attributes.position.count*y,U=1;b>e.maxTextureSize&&(U=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const P=new Float32Array(b*U*4*u),E=new Rl(P,b,U,u);E.type=1015,E.needsUpdate=!0;const L=y*4;for(let _=0;_<u;_++){const I=m[_],B=p[_],F=S[_],N=b*U*4*_;for(let Y=0;Y<I.count;Y++){const X=Y*L;f===!0&&(i.fromBufferAttribute(I,Y),P[N+X+0]=i.x,P[N+X+1]=i.y,P[N+X+2]=i.z,P[N+X+3]=0),g===!0&&(i.fromBufferAttribute(B,Y),P[N+X+4]=i.x,P[N+X+5]=i.y,P[N+X+6]=i.z,P[N+X+7]=0),v===!0&&(i.fromBufferAttribute(F,Y),P[N+X+8]=i.x,P[N+X+9]=i.y,P[N+X+10]=i.z,P[N+X+11]=F.itemSize===4?i.w:1)}}h={count:u,texture:E,size:new he(b,U)},n.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(r,"morphTargetBaseInfluence",g),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",h.size)}return{update:s}}function Sm(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,d=l.geometry,u=e.get(l,d);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;i.get(h)!==c&&(h.update(),i.set(h,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class ac extends Lt{constructor(e,t,n,i,s,a,o,l,c,d=1026){if(d!==1026&&d!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===1026&&(n=1014),n===void 0&&d===1027&&(n=1020),super(null,i,s,a,o,l,d,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const oc=new Lt,lc=new ac(1,1),cc=new Rl,dc=new Hh,uc=new Ql,hc=[],fc=[],pc=new Float32Array(16),mc=new Float32Array(9),gc=new Float32Array(4);function sr(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=hc[i];if(s===void 0&&(s=new Float32Array(i),hc[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Ct(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Rt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Hs(r,e){let t=fc[e];t===void 0&&(t=new Int32Array(e),fc[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function wm(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Mm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;r.uniform2fv(this.addr,e),Rt(t,e)}}function Em(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ct(t,e))return;r.uniform3fv(this.addr,e),Rt(t,e)}}function Tm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;r.uniform4fv(this.addr,e),Rt(t,e)}}function Am(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(Ct(t,n))return;gc.set(n),r.uniformMatrix2fv(this.addr,!1,gc),Rt(t,n)}}function Cm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(Ct(t,n))return;mc.set(n),r.uniformMatrix3fv(this.addr,!1,mc),Rt(t,n)}}function Rm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(Ct(t,n))return;pc.set(n),r.uniformMatrix4fv(this.addr,!1,pc),Rt(t,n)}}function Pm(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Im(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;r.uniform2iv(this.addr,e),Rt(t,e)}}function Lm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;r.uniform3iv(this.addr,e),Rt(t,e)}}function km(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;r.uniform4iv(this.addr,e),Rt(t,e)}}function Um(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Dm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;r.uniform2uiv(this.addr,e),Rt(t,e)}}function Nm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;r.uniform3uiv(this.addr,e),Rt(t,e)}}function Fm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;r.uniform4uiv(this.addr,e),Rt(t,e)}}function Om(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(lc.compareFunction=515,s=lc):s=oc,t.setTexture2D(e||s,i)}function Bm(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||dc,i)}function zm(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||uc,i)}function Hm(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||cc,i)}function Gm(r){switch(r){case 5126:return wm;case 35664:return Mm;case 35665:return Em;case 35666:return Tm;case 35674:return Am;case 35675:return Cm;case 35676:return Rm;case 5124:case 35670:return Pm;case 35667:case 35671:return Im;case 35668:case 35672:return Lm;case 35669:case 35673:return km;case 5125:return Um;case 36294:return Dm;case 36295:return Nm;case 36296:return Fm;case 35678:case 36198:case 36298:case 36306:case 35682:return Om;case 35679:case 36299:case 36307:return Bm;case 35680:case 36300:case 36308:case 36293:return zm;case 36289:case 36303:case 36311:case 36292:return Hm}}function Vm(r,e){r.uniform1fv(this.addr,e)}function Wm(r,e){const t=sr(e,this.size,2);r.uniform2fv(this.addr,t)}function Xm(r,e){const t=sr(e,this.size,3);r.uniform3fv(this.addr,t)}function $m(r,e){const t=sr(e,this.size,4);r.uniform4fv(this.addr,t)}function Ym(r,e){const t=sr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function qm(r,e){const t=sr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Zm(r,e){const t=sr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Km(r,e){r.uniform1iv(this.addr,e)}function jm(r,e){r.uniform2iv(this.addr,e)}function Qm(r,e){r.uniform3iv(this.addr,e)}function Jm(r,e){r.uniform4iv(this.addr,e)}function eg(r,e){r.uniform1uiv(this.addr,e)}function tg(r,e){r.uniform2uiv(this.addr,e)}function ng(r,e){r.uniform3uiv(this.addr,e)}function ig(r,e){r.uniform4uiv(this.addr,e)}function rg(r,e,t){const n=this.cache,i=e.length,s=Hs(t,i);Ct(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||oc,s[a])}function sg(r,e,t){const n=this.cache,i=e.length,s=Hs(t,i);Ct(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||dc,s[a])}function ag(r,e,t){const n=this.cache,i=e.length,s=Hs(t,i);Ct(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||uc,s[a])}function og(r,e,t){const n=this.cache,i=e.length,s=Hs(t,i);Ct(n,s)||(r.uniform1iv(this.addr,s),Rt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||cc,s[a])}function lg(r){switch(r){case 5126:return Vm;case 35664:return Wm;case 35665:return Xm;case 35666:return $m;case 35674:return Ym;case 35675:return qm;case 35676:return Zm;case 5124:case 35670:return Km;case 35667:case 35671:return jm;case 35668:case 35672:return Qm;case 35669:case 35673:return Jm;case 5125:return eg;case 36294:return tg;case 36295:return ng;case 36296:return ig;case 35678:case 36198:case 36298:case 36306:case 35682:return rg;case 35679:case 36299:case 36307:return sg;case 35680:case 36300:case 36308:case 36293:return ag;case 36289:case 36303:case 36311:case 36292:return og}}class cg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gm(t.type)}}class dg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lg(t.type)}}class ug{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const go=/(\w+)(\])?(\[|\.)?/g;function vc(r,e){r.seq.push(e),r.map[e.id]=e}function hg(r,e,t){const n=r.name,i=n.length;for(go.lastIndex=0;;){const s=go.exec(n),a=go.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){vc(t,c===void 0?new cg(o,r,e):new dg(o,r,e));break}else{let u=t.map[o];u===void 0&&(u=new ug(o),vc(t,u)),t=u}}}class Gs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),a=e.getUniformLocation(t,s.name);hg(s,a,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function yc(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const fg=37297;let pg=0;function mg(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function gg(r){const e=ut.getPrimaries(ut.workingColorSpace),t=ut.getPrimaries(r);let n;switch(e===t?n="":e===vs&&t===gs?n="LinearDisplayP3ToLinearSRGB":e===gs&&t===vs&&(n="LinearSRGBToLinearDisplayP3"),r){case on:case ps:return[n,"LinearTransferOETF"];case Ot:case Ga:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function xc(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+mg(r.getShaderSource(e),a)}else return i}function vg(r,e){const t=gg(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function yg(r,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="OptimizedCineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function xg(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zr).join(`
`)}function bg(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function _g(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function zr(r){return r!==""}function bc(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _c(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Sg=/^[ \t]*#include +<([\w\d./]+)>/gm;function vo(r){return r.replace(Sg,Mg)}const wg=new Map;function Mg(r,e){let t=je[e];if(t===void 0){const n=wg.get(e);if(n!==void 0)t=je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return vo(t)}const Eg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sc(r){return r.replace(Eg,Tg)}function Tg(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function wc(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ag(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===1?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===2?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===3&&(e="SHADOWMAP_TYPE_VSM"),e}function Cg(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Rg(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function Pg(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function Ig(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Lg(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Ag(t),c=Cg(t),d=Rg(t),u=Pg(t),h=Ig(t),f=xg(t),g=bg(s),v=i.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(zr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(zr).join(`
`),p.length>0&&(p+=`
`)):(m=[wc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zr).join(`
`),p=[wc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?je.tonemapping_pars_fragment:"",t.toneMapping!==0?yg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,vg("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(zr).join(`
`)),a=vo(a),a=bc(a,t),a=_c(a,t),o=vo(o),o=bc(o,t),o=_c(o,t),a=Sc(a),o=Sc(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===_l?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_l?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=S+m+a,b=S+p+o,U=yc(i,i.VERTEX_SHADER,y),P=yc(i,i.FRAGMENT_SHADER,b);i.attachShader(v,U),i.attachShader(v,P),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function E(I){if(r.debug.checkShaderErrors){const B=i.getProgramInfoLog(v).trim(),F=i.getShaderInfoLog(U).trim(),N=i.getShaderInfoLog(P).trim();let Y=!0,X=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(Y=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,v,U,P);else{const Q=xc(i,U,"vertex"),q=xc(i,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+B+`
`+Q+`
`+q)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(F===""||N==="")&&(X=!1);X&&(I.diagnostics={runnable:Y,programLog:B,vertexShader:{log:F,prefix:m},fragmentShader:{log:N,prefix:p}})}i.deleteShader(U),i.deleteShader(P),L=new Gs(i,v),M=_g(i,v)}let L;this.getUniforms=function(){return L===void 0&&E(this),L};let M;this.getAttributes=function(){return M===void 0&&E(this),M};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=i.getProgramParameter(v,fg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=U,this.fragmentShader=P,this}let kg=0;class Ug{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Dg(e),t.set(e,n)),n}}class Dg{constructor(e){this.id=kg++,this.code=e,this.usedTimes=0}}function Ng(r,e,t,n,i,s,a){const o=new kl,l=new Ug,c=new Set,d=[],u=i.logarithmicDepthBuffer,h=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,_,I,B,F){const N=B.fog,Y=F.geometry,X=M.isMeshStandardMaterial?B.environment:null,Q=(M.isMeshStandardMaterial?t:e).get(M.envMap||X),q=Q&&Q.mapping===306?Q.image.height:null,re=g[M.type];M.precision!==null&&(f=i.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ce=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ve=ce!==void 0?ce.length:0;let te=0;Y.morphAttributes.position!==void 0&&(te=1),Y.morphAttributes.normal!==void 0&&(te=2),Y.morphAttributes.color!==void 0&&(te=3);let Ve,J,oe,_e;if(re){const Fe=Mn[re];Ve=Fe.vertexShader,J=Fe.fragmentShader}else Ve=M.vertexShader,J=M.fragmentShader,l.update(M),oe=l.getVertexShaderID(M),_e=l.getFragmentShaderID(M);const me=r.getRenderTarget(),Ue=F.isInstancedMesh===!0,ke=F.isBatchedMesh===!0,We=!!M.map,rt=!!M.matcap,D=!!Q,ft=!!M.aoMap,Ze=!!M.lightMap,Ie=!!M.bumpMap,Ee=!!M.normalMap,pt=!!M.displacementMap,De=!!M.emissiveMap,Be=!!M.metalnessMap,k=!!M.roughnessMap,w=M.anisotropy>0,Z=M.clearcoat>0,ie=M.dispersion>0,se=M.iridescence>0,ne=M.sheen>0,Re=M.transmission>0,fe=w&&!!M.anisotropyMap,Se=Z&&!!M.clearcoatMap,Xe=Z&&!!M.clearcoatNormalMap,le=Z&&!!M.clearcoatRoughnessMap,xe=se&&!!M.iridescenceMap,$e=se&&!!M.iridescenceThicknessMap,Ne=ne&&!!M.sheenColorMap,we=ne&&!!M.sheenRoughnessMap,ze=!!M.specularMap,Ye=!!M.specularColorMap,C=!!M.specularIntensityMap,A=Re&&!!M.transmissionMap,O=Re&&!!M.thicknessMap,z=!!M.gradientMap,H=!!M.alphaMap,ee=M.alphaTest>0,ae=!!M.alphaHash,ue=!!M.extensions;let Ce=0;M.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(Ce=r.toneMapping);const qe={shaderID:re,shaderType:M.type,shaderName:M.name,vertexShader:Ve,fragmentShader:J,defines:M.defines,customVertexShaderID:oe,customFragmentShaderID:_e,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:ke,batchingColor:ke&&F._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&F.instanceColor!==null,instancingMorph:Ue&&F.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:me===null?r.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:on,alphaToCoverage:!!M.alphaToCoverage,map:We,matcap:rt,envMap:D,envMapMode:D&&Q.mapping,envMapCubeUVHeight:q,aoMap:ft,lightMap:Ze,bumpMap:Ie,normalMap:Ee,displacementMap:h&&pt,emissiveMap:De,normalMapObjectSpace:Ee&&M.normalMapType===1,normalMapTangentSpace:Ee&&M.normalMapType===0,metalnessMap:Be,roughnessMap:k,anisotropy:w,anisotropyMap:fe,clearcoat:Z,clearcoatMap:Se,clearcoatNormalMap:Xe,clearcoatRoughnessMap:le,dispersion:ie,iridescence:se,iridescenceMap:xe,iridescenceThicknessMap:$e,sheen:ne,sheenColorMap:Ne,sheenRoughnessMap:we,specularMap:ze,specularColorMap:Ye,specularIntensityMap:C,transmission:Re,transmissionMap:A,thicknessMap:O,gradientMap:z,opaque:M.transparent===!1&&M.blending===1&&M.alphaToCoverage===!1,alphaMap:H,alphaTest:ee,alphaHash:ae,combine:M.combine,mapUv:We&&v(M.map.channel),aoMapUv:ft&&v(M.aoMap.channel),lightMapUv:Ze&&v(M.lightMap.channel),bumpMapUv:Ie&&v(M.bumpMap.channel),normalMapUv:Ee&&v(M.normalMap.channel),displacementMapUv:pt&&v(M.displacementMap.channel),emissiveMapUv:De&&v(M.emissiveMap.channel),metalnessMapUv:Be&&v(M.metalnessMap.channel),roughnessMapUv:k&&v(M.roughnessMap.channel),anisotropyMapUv:fe&&v(M.anisotropyMap.channel),clearcoatMapUv:Se&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Xe&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:$e&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:we&&v(M.sheenRoughnessMap.channel),specularMapUv:ze&&v(M.specularMap.channel),specularColorMapUv:Ye&&v(M.specularColorMap.channel),specularIntensityMapUv:C&&v(M.specularIntensityMap.channel),transmissionMapUv:A&&v(M.transmissionMap.channel),thicknessMapUv:O&&v(M.thicknessMap.channel),alphaMapUv:H&&v(M.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(Ee||w),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!Y.attributes.uv&&(We||H),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:F.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:te,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:r.shadowMap.enabled&&I.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ce,decodeVideoTexture:We&&M.map.isVideoTexture===!0&&ut.getTransfer(M.map.colorSpace)===mt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===2,flipSided:M.side===1,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ue&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ue&&M.extensions.multiDraw===!0||ke)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return qe.vertexUv1s=c.has(1),qe.vertexUv2s=c.has(2),qe.vertexUv3s=c.has(3),c.clear(),qe}function p(M){const _=[];if(M.shaderID?_.push(M.shaderID):(_.push(M.customVertexShaderID),_.push(M.customFragmentShaderID)),M.defines!==void 0)for(const I in M.defines)_.push(I),_.push(M.defines[I]);return M.isRawShaderMaterial===!1&&(S(_,M),y(_,M),_.push(r.outputColorSpace)),_.push(M.customProgramCacheKey),_.join()}function S(M,_){M.push(_.precision),M.push(_.outputColorSpace),M.push(_.envMapMode),M.push(_.envMapCubeUVHeight),M.push(_.mapUv),M.push(_.alphaMapUv),M.push(_.lightMapUv),M.push(_.aoMapUv),M.push(_.bumpMapUv),M.push(_.normalMapUv),M.push(_.displacementMapUv),M.push(_.emissiveMapUv),M.push(_.metalnessMapUv),M.push(_.roughnessMapUv),M.push(_.anisotropyMapUv),M.push(_.clearcoatMapUv),M.push(_.clearcoatNormalMapUv),M.push(_.clearcoatRoughnessMapUv),M.push(_.iridescenceMapUv),M.push(_.iridescenceThicknessMapUv),M.push(_.sheenColorMapUv),M.push(_.sheenRoughnessMapUv),M.push(_.specularMapUv),M.push(_.specularColorMapUv),M.push(_.specularIntensityMapUv),M.push(_.transmissionMapUv),M.push(_.thicknessMapUv),M.push(_.combine),M.push(_.fogExp2),M.push(_.sizeAttenuation),M.push(_.morphTargetsCount),M.push(_.morphAttributeCount),M.push(_.numDirLights),M.push(_.numPointLights),M.push(_.numSpotLights),M.push(_.numSpotLightMaps),M.push(_.numHemiLights),M.push(_.numRectAreaLights),M.push(_.numDirLightShadows),M.push(_.numPointLightShadows),M.push(_.numSpotLightShadows),M.push(_.numSpotLightShadowsWithMaps),M.push(_.numLightProbes),M.push(_.shadowMapType),M.push(_.toneMapping),M.push(_.numClippingPlanes),M.push(_.numClipIntersection),M.push(_.depthPacking)}function y(M,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.skinning&&o.enable(4),_.morphTargets&&o.enable(5),_.morphNormals&&o.enable(6),_.morphColors&&o.enable(7),_.premultipliedAlpha&&o.enable(8),_.shadowMapEnabled&&o.enable(9),_.doubleSided&&o.enable(10),_.flipSided&&o.enable(11),_.useDepthPacking&&o.enable(12),_.dithering&&o.enable(13),_.transmission&&o.enable(14),_.sheen&&o.enable(15),_.opaque&&o.enable(16),_.pointsUvs&&o.enable(17),_.decodeVideoTexture&&o.enable(18),_.alphaToCoverage&&o.enable(19),M.push(o.mask)}function b(M){const _=g[M.type];let I;if(_){const B=Mn[_];I=er.clone(B.uniforms)}else I=M.uniforms;return I}function U(M,_){let I;for(let B=0,F=d.length;B<F;B++){const N=d[B];if(N.cacheKey===_){I=N,++I.usedTimes;break}}return I===void 0&&(I=new Lg(r,_,M,s),d.push(I)),I}function P(M){if(--M.usedTimes===0){const _=d.indexOf(M);d[_]=d[d.length-1],d.pop(),M.destroy()}}function E(M){l.remove(M)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:U,releaseProgram:P,releaseShaderCache:E,programs:d,dispose:L}}function Fg(){let r=new WeakMap;function e(s){let a=r.get(s);return a===void 0&&(a={},r.set(s,a)),a}function t(s){r.delete(s)}function n(s,a,o){r.get(s)[a]=o}function i(){r=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Og(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function Mc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Ec(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(u,h,f,g,v,m){let p=r[e];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},r[e]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),e++,p}function o(u,h,f,g,v,m){const p=a(u,h,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):t.push(p)}function l(u,h,f,g,v,m){const p=a(u,h,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):t.unshift(p)}function c(u,h){t.length>1&&t.sort(u||Og),n.length>1&&n.sort(h||Mc),i.length>1&&i.sort(h||Mc)}function d(){for(let u=e,h=r.length;u<h;u++){const f=r[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:o,unshift:l,finish:d,sort:c}}function Bg(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Ec,r.set(n,[a])):i>=s.length?(a=new Ec,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function zg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Pe};break;case"SpotLight":t={position:new R,direction:new R,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new R,halfWidth:new R,halfHeight:new R};break}return r[e.id]=t,t}}}function Hg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let Gg=0;function Vg(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Wg(r){const e=new zg,t=Hg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const i=new R,s=new dt,a=new dt;function o(c){let d=0,u=0,h=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,S=0,y=0,b=0,U=0,P=0,E=0;c.sort(Vg);for(let M=0,_=c.length;M<_;M++){const I=c[M],B=I.color,F=I.intensity,N=I.distance,Y=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=B.r*F,u+=B.g*F,h+=B.b*F;else if(I.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(I.sh.coefficients[X],F);E++}else if(I.isDirectionalLight){const X=e.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const Q=I.shadow,q=t.get(I);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize=Q.mapSize,n.directionalShadow[f]=q,n.directionalShadowMap[f]=Y,n.directionalShadowMatrix[f]=I.shadow.matrix,S++}n.directional[f]=X,f++}else if(I.isSpotLight){const X=e.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(B).multiplyScalar(F),X.distance=N,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,n.spot[v]=X;const Q=I.shadow;if(I.map&&(n.spotLightMap[U]=I.map,U++,Q.updateMatrices(I),I.castShadow&&P++),n.spotLightMatrix[v]=Q.matrix,I.castShadow){const q=t.get(I);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize=Q.mapSize,n.spotShadow[v]=q,n.spotShadowMap[v]=Y,b++}v++}else if(I.isRectAreaLight){const X=e.get(I);X.color.copy(B).multiplyScalar(F),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=X,m++}else if(I.isPointLight){const X=e.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),X.distance=I.distance,X.decay=I.decay,I.castShadow){const Q=I.shadow,q=t.get(I);q.shadowIntensity=Q.intensity,q.shadowBias=Q.bias,q.shadowNormalBias=Q.normalBias,q.shadowRadius=Q.radius,q.shadowMapSize=Q.mapSize,q.shadowCameraNear=Q.camera.near,q.shadowCameraFar=Q.camera.far,n.pointShadow[g]=q,n.pointShadowMap[g]=Y,n.pointShadowMatrix[g]=I.shadow.matrix,y++}n.point[g]=X,g++}else if(I.isHemisphereLight){const X=e.get(I);X.skyColor.copy(I.color).multiplyScalar(F),X.groundColor.copy(I.groundColor).multiplyScalar(F),n.hemi[p]=X,p++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;const L=n.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==v||L.rectAreaLength!==m||L.hemiLength!==p||L.numDirectionalShadows!==S||L.numPointShadows!==y||L.numSpotShadows!==b||L.numSpotMaps!==U||L.numLightProbes!==E)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=b+U-P,n.spotLightMap.length=U,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=E,L.directionalLength=f,L.pointLength=g,L.spotLength=v,L.rectAreaLength=m,L.hemiLength=p,L.numDirectionalShadows=S,L.numPointShadows=y,L.numSpotShadows=b,L.numSpotMaps=U,L.numLightProbes=E,n.version=Gg++)}function l(c,d){let u=0,h=0,f=0,g=0,v=0;const m=d.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const y=c[p];if(y.isDirectionalLight){const b=n.directional[u];b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),u++}else if(y.isSpotLight){const b=n.spot[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const b=n.rectArea[g];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),a.identity(),s.copy(y.matrixWorld),s.premultiply(m),a.extractRotation(s),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const b=n.point[h];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),h++}else if(y.isHemisphereLight){const b=n.hemi[v];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function Tc(r){const e=new Wg(r),t=[],n=[];function i(d){c.camera=d,t.length=0,n.length=0}function s(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function Xg(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new Tc(r),e.set(i,[o])):s>=a.length?(o=new Tc(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class $g extends Or{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Yg extends Or{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const qg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zg=`uniform sampler2D shadow_pass;
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
}`;function Kg(r,e,t){let n=new lo;const i=new he,s=new he,a=new vt,o=new $g({depthPacking:3201}),l=new Yg,c={},d=t.maxTextureSize,u={0:1,1:0,2:2},h=new Ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:qg,fragmentShader:Zg}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new wn;g.setAttribute("position",new vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ge(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(P,E,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const M=r.getRenderTarget(),_=r.getActiveCubeFace(),I=r.getActiveMipmapLevel(),B=r.state;B.setBlending(0),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const F=p!==3&&this.type===3,N=p===3&&this.type!==3;for(let Y=0,X=P.length;Y<X;Y++){const Q=P[Y],q=Q.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;i.copy(q.mapSize);const re=q.getFrameExtents();if(i.multiply(re),s.copy(q.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(s.x=Math.floor(d/re.x),i.x=s.x*re.x,q.mapSize.x=s.x),i.y>d&&(s.y=Math.floor(d/re.y),i.y=s.y*re.y,q.mapSize.y=s.y)),q.map===null||F===!0||N===!0){const ve=this.type!==3?{minFilter:1003,magFilter:1003}:{};q.map!==null&&q.map.dispose(),q.map=new Zt(i.x,i.y,ve),q.map.texture.name=Q.name+".shadowMap",q.camera.updateProjectionMatrix()}r.setRenderTarget(q.map),r.clear();const ce=q.getViewportCount();for(let ve=0;ve<ce;ve++){const te=q.getViewport(ve);a.set(s.x*te.x,s.y*te.y,s.x*te.z,s.y*te.w),B.viewport(a),q.updateMatrices(Q,ve),n=q.getFrustum(),b(E,L,q.camera,Q,this.type)}q.isPointLightShadow!==!0&&this.type===3&&S(q,L),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(M,_,I)};function S(P,E){const L=e.update(v);h.defines.VSM_SAMPLES!==P.blurSamples&&(h.defines.VSM_SAMPLES=P.blurSamples,f.defines.VSM_SAMPLES=P.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Zt(i.x,i.y)),h.uniforms.shadow_pass.value=P.map.texture,h.uniforms.resolution.value=P.mapSize,h.uniforms.radius.value=P.radius,r.setRenderTarget(P.mapPass),r.clear(),r.renderBufferDirect(E,null,L,h,v,null),f.uniforms.shadow_pass.value=P.mapPass.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,r.setRenderTarget(P.map),r.clear(),r.renderBufferDirect(E,null,L,f,v,null)}function y(P,E,L,M){let _=null;const I=L.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(I!==void 0)_=I;else if(_=L.isPointLight===!0?l:o,r.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const B=_.uuid,F=E.uuid;let N=c[B];N===void 0&&(N={},c[B]=N);let Y=N[F];Y===void 0&&(Y=_.clone(),N[F]=Y,E.addEventListener("dispose",U)),_=Y}if(_.visible=E.visible,_.wireframe=E.wireframe,M===3?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:u[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,L.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const B=r.properties.get(_);B.light=L}return _}function b(P,E,L,M,_){if(P.visible===!1)return;if(P.layers.test(E.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&_===3)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,P.matrixWorld);const F=e.update(P),N=P.material;if(Array.isArray(N)){const Y=F.groups;for(let X=0,Q=Y.length;X<Q;X++){const q=Y[X],re=N[q.materialIndex];if(re&&re.visible){const ce=y(P,re,M,_);P.onBeforeShadow(r,P,E,L,F,ce,q),r.renderBufferDirect(L,null,F,ce,P,q),P.onAfterShadow(r,P,E,L,F,ce,q)}}}else if(N.visible){const Y=y(P,N,M,_);P.onBeforeShadow(r,P,E,L,F,Y,null),r.renderBufferDirect(L,null,F,Y,P,null),P.onAfterShadow(r,P,E,L,F,Y,null)}}const B=P.children;for(let F=0,N=B.length;F<N;F++)b(B[F],E,L,M,_)}function U(P){P.target.removeEventListener("dispose",U);for(const L in c){const M=c[L],_=P.target.uuid;_ in M&&(M[_].dispose(),delete M[_])}}}function jg(r){function e(){let A=!1;const O=new vt;let z=null;const H=new vt(0,0,0,0);return{setMask:function(ee){z!==ee&&!A&&(r.colorMask(ee,ee,ee,ee),z=ee)},setLocked:function(ee){A=ee},setClear:function(ee,ae,ue,Ce,qe){qe===!0&&(ee*=Ce,ae*=Ce,ue*=Ce),O.set(ee,ae,ue,Ce),H.equals(O)===!1&&(r.clearColor(ee,ae,ue,Ce),H.copy(O))},reset:function(){A=!1,z=null,H.set(-1,0,0,0)}}}function t(){let A=!1,O=null,z=null,H=null;return{setTest:function(ee){ee?_e(r.DEPTH_TEST):me(r.DEPTH_TEST)},setMask:function(ee){O!==ee&&!A&&(r.depthMask(ee),O=ee)},setFunc:function(ee){if(z!==ee){switch(ee){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}z=ee}},setLocked:function(ee){A=ee},setClear:function(ee){H!==ee&&(r.clearDepth(ee),H=ee)},reset:function(){A=!1,O=null,z=null,H=null}}}function n(){let A=!1,O=null,z=null,H=null,ee=null,ae=null,ue=null,Ce=null,qe=null;return{setTest:function(Fe){A||(Fe?_e(r.STENCIL_TEST):me(r.STENCIL_TEST))},setMask:function(Fe){O!==Fe&&!A&&(r.stencilMask(Fe),O=Fe)},setFunc:function(Fe,tt,gt){(z!==Fe||H!==tt||ee!==gt)&&(r.stencilFunc(Fe,tt,gt),z=Fe,H=tt,ee=gt)},setOp:function(Fe,tt,gt){(ae!==Fe||ue!==tt||Ce!==gt)&&(r.stencilOp(Fe,tt,gt),ae=Fe,ue=tt,Ce=gt)},setLocked:function(Fe){A=Fe},setClear:function(Fe){qe!==Fe&&(r.clearStencil(Fe),qe=Fe)},reset:function(){A=!1,O=null,z=null,H=null,ee=null,ae=null,ue=null,Ce=null,qe=null}}}const i=new e,s=new t,a=new n,o=new WeakMap,l=new WeakMap;let c={},d={},u=new WeakMap,h=[],f=null,g=!1,v=null,m=null,p=null,S=null,y=null,b=null,U=null,P=new Pe(0,0,0),E=0,L=!1,M=null,_=null,I=null,B=null,F=null;const N=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,X=0;const Q=r.getParameter(r.VERSION);Q.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(Q)[1]),Y=X>=1):Q.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),Y=X>=2);let q=null,re={};const ce=r.getParameter(r.SCISSOR_BOX),ve=r.getParameter(r.VIEWPORT),te=new vt().fromArray(ce),Ve=new vt().fromArray(ve);function J(A,O,z,H){const ee=new Uint8Array(4),ae=r.createTexture();r.bindTexture(A,ae),r.texParameteri(A,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(A,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ue=0;ue<z;ue++)A===r.TEXTURE_3D||A===r.TEXTURE_2D_ARRAY?r.texImage3D(O,0,r.RGBA,1,1,H,0,r.RGBA,r.UNSIGNED_BYTE,ee):r.texImage2D(O+ue,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ee);return ae}const oe={};oe[r.TEXTURE_2D]=J(r.TEXTURE_2D,r.TEXTURE_2D,1),oe[r.TEXTURE_CUBE_MAP]=J(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[r.TEXTURE_2D_ARRAY]=J(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),oe[r.TEXTURE_3D]=J(r.TEXTURE_3D,r.TEXTURE_3D,1,1),i.setClear(0,0,0,1),s.setClear(1),a.setClear(0),_e(r.DEPTH_TEST),s.setFunc(3),Ie(!1),Ee(1),_e(r.CULL_FACE),ft(0);function _e(A){c[A]!==!0&&(r.enable(A),c[A]=!0)}function me(A){c[A]!==!1&&(r.disable(A),c[A]=!1)}function Ue(A,O){return d[A]!==O?(r.bindFramebuffer(A,O),d[A]=O,A===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=O),A===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=O),!0):!1}function ke(A,O){let z=h,H=!1;if(A){z=u.get(O),z===void 0&&(z=[],u.set(O,z));const ee=A.textures;if(z.length!==ee.length||z[0]!==r.COLOR_ATTACHMENT0){for(let ae=0,ue=ee.length;ae<ue;ae++)z[ae]=r.COLOR_ATTACHMENT0+ae;z.length=ee.length,H=!0}}else z[0]!==r.BACK&&(z[0]=r.BACK,H=!0);H&&r.drawBuffers(z)}function We(A){return f!==A?(r.useProgram(A),f=A,!0):!1}const rt={100:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};rt[103]=r.MIN,rt[104]=r.MAX;const D={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,204:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,205:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function ft(A,O,z,H,ee,ae,ue,Ce,qe,Fe){if(A===0){g===!0&&(me(r.BLEND),g=!1);return}if(g===!1&&(_e(r.BLEND),g=!0),A!==5){if(A!==v||Fe!==L){if((m!==100||y!==100)&&(r.blendEquation(r.FUNC_ADD),m=100,y=100),Fe)switch(A){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",A);break}else switch(A){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",A);break}p=null,S=null,b=null,U=null,P.set(0,0,0),E=0,v=A,L=Fe}return}ee=ee||O,ae=ae||z,ue=ue||H,(O!==m||ee!==y)&&(r.blendEquationSeparate(rt[O],rt[ee]),m=O,y=ee),(z!==p||H!==S||ae!==b||ue!==U)&&(r.blendFuncSeparate(D[z],D[H],D[ae],D[ue]),p=z,S=H,b=ae,U=ue),(Ce.equals(P)===!1||qe!==E)&&(r.blendColor(Ce.r,Ce.g,Ce.b,qe),P.copy(Ce),E=qe),v=A,L=!1}function Ze(A,O){A.side===2?me(r.CULL_FACE):_e(r.CULL_FACE);let z=A.side===1;O&&(z=!z),Ie(z),A.blending===1&&A.transparent===!1?ft(0):ft(A.blending,A.blendEquation,A.blendSrc,A.blendDst,A.blendEquationAlpha,A.blendSrcAlpha,A.blendDstAlpha,A.blendColor,A.blendAlpha,A.premultipliedAlpha),s.setFunc(A.depthFunc),s.setTest(A.depthTest),s.setMask(A.depthWrite),i.setMask(A.colorWrite);const H=A.stencilWrite;a.setTest(H),H&&(a.setMask(A.stencilWriteMask),a.setFunc(A.stencilFunc,A.stencilRef,A.stencilFuncMask),a.setOp(A.stencilFail,A.stencilZFail,A.stencilZPass)),De(A.polygonOffset,A.polygonOffsetFactor,A.polygonOffsetUnits),A.alphaToCoverage===!0?_e(r.SAMPLE_ALPHA_TO_COVERAGE):me(r.SAMPLE_ALPHA_TO_COVERAGE)}function Ie(A){M!==A&&(A?r.frontFace(r.CW):r.frontFace(r.CCW),M=A)}function Ee(A){A!==0?(_e(r.CULL_FACE),A!==_&&(A===1?r.cullFace(r.BACK):A===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):me(r.CULL_FACE),_=A}function pt(A){A!==I&&(Y&&r.lineWidth(A),I=A)}function De(A,O,z){A?(_e(r.POLYGON_OFFSET_FILL),(B!==O||F!==z)&&(r.polygonOffset(O,z),B=O,F=z)):me(r.POLYGON_OFFSET_FILL)}function Be(A){A?_e(r.SCISSOR_TEST):me(r.SCISSOR_TEST)}function k(A){A===void 0&&(A=r.TEXTURE0+N-1),q!==A&&(r.activeTexture(A),q=A)}function w(A,O,z){z===void 0&&(q===null?z=r.TEXTURE0+N-1:z=q);let H=re[z];H===void 0&&(H={type:void 0,texture:void 0},re[z]=H),(H.type!==A||H.texture!==O)&&(q!==z&&(r.activeTexture(z),q=z),r.bindTexture(A,O||oe[A]),H.type=A,H.texture=O)}function Z(){const A=re[q];A!==void 0&&A.type!==void 0&&(r.bindTexture(A.type,null),A.type=void 0,A.texture=void 0)}function ie(){try{r.compressedTexImage2D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function se(){try{r.compressedTexImage3D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function ne(){try{r.texSubImage2D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function Re(){try{r.texSubImage3D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function fe(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function Se(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function Xe(){try{r.texStorage2D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function le(){try{r.texStorage3D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function xe(){try{r.texImage2D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function $e(){try{r.texImage3D.apply(r,arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function Ne(A){te.equals(A)===!1&&(r.scissor(A.x,A.y,A.z,A.w),te.copy(A))}function we(A){Ve.equals(A)===!1&&(r.viewport(A.x,A.y,A.z,A.w),Ve.copy(A))}function ze(A,O){let z=l.get(O);z===void 0&&(z=new WeakMap,l.set(O,z));let H=z.get(A);H===void 0&&(H=r.getUniformBlockIndex(O,A.name),z.set(A,H))}function Ye(A,O){const H=l.get(O).get(A);o.get(O)!==H&&(r.uniformBlockBinding(O,H,A.__bindingPointIndex),o.set(O,H))}function C(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),c={},q=null,re={},d={},u=new WeakMap,h=[],f=null,g=!1,v=null,m=null,p=null,S=null,y=null,b=null,U=null,P=new Pe(0,0,0),E=0,L=!1,M=null,_=null,I=null,B=null,F=null,te.set(0,0,r.canvas.width,r.canvas.height),Ve.set(0,0,r.canvas.width,r.canvas.height),i.reset(),s.reset(),a.reset()}return{buffers:{color:i,depth:s,stencil:a},enable:_e,disable:me,bindFramebuffer:Ue,drawBuffers:ke,useProgram:We,setBlending:ft,setMaterial:Ze,setFlipSided:Ie,setCullFace:Ee,setLineWidth:pt,setPolygonOffset:De,setScissorTest:Be,activeTexture:k,bindTexture:w,unbindTexture:Z,compressedTexImage2D:ie,compressedTexImage3D:se,texImage2D:xe,texImage3D:$e,updateUBOMapping:ze,uniformBlockBinding:Ye,texStorage2D:Xe,texStorage3D:le,texSubImage2D:ne,texSubImage3D:Re,compressedTexSubImage2D:fe,compressedTexSubImage3D:Se,scissor:Ne,viewport:we,reset:C}}function Ac(r,e,t,n){const i=Qg(n);switch(t){case 1021:return r*e;case 1024:return r*e;case 1025:return r*e*2;case 1028:return r*e/i.components*i.byteLength;case 1029:return r*e/i.components*i.byteLength;case 1030:return r*e*2/i.components*i.byteLength;case 1031:return r*e*2/i.components*i.byteLength;case 1022:return r*e*3/i.components*i.byteLength;case 1023:return r*e*4/i.components*i.byteLength;case 1033:return r*e*4/i.components*i.byteLength;case 33776:case 33777:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(r,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(r,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(r/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(r/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Qg(r){switch(r){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}function Jg(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new he,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(k){}function g(k,w){return f?new OffscreenCanvas(k,w):kr("canvas")}function v(k,w,Z){let ie=1;const se=Be(k);if((se.width>Z||se.height>Z)&&(ie=Z/Math.max(se.width,se.height)),ie<1)if(typeof HTMLImageElement!="undefined"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&k instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&k instanceof ImageBitmap||typeof VideoFrame!="undefined"&&k instanceof VideoFrame){const ne=Math.floor(ie*se.width),Re=Math.floor(ie*se.height);u===void 0&&(u=g(ne,Re));const fe=w?g(ne,Re):u;return fe.width=ne,fe.height=Re,fe.getContext("2d").drawImage(k,0,0,ne,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+ne+"x"+Re+")."),fe}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),k;return k}function m(k){return k.generateMipmaps&&k.minFilter!==1003&&k.minFilter!==1006}function p(k){r.generateMipmap(k)}function S(k,w,Z,ie,se=!1){if(k!==null){if(r[k]!==void 0)return r[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let ne=w;if(w===r.RED&&(Z===r.FLOAT&&(ne=r.R32F),Z===r.HALF_FLOAT&&(ne=r.R16F),Z===r.UNSIGNED_BYTE&&(ne=r.R8)),w===r.RED_INTEGER&&(Z===r.UNSIGNED_BYTE&&(ne=r.R8UI),Z===r.UNSIGNED_SHORT&&(ne=r.R16UI),Z===r.UNSIGNED_INT&&(ne=r.R32UI),Z===r.BYTE&&(ne=r.R8I),Z===r.SHORT&&(ne=r.R16I),Z===r.INT&&(ne=r.R32I)),w===r.RG&&(Z===r.FLOAT&&(ne=r.RG32F),Z===r.HALF_FLOAT&&(ne=r.RG16F),Z===r.UNSIGNED_BYTE&&(ne=r.RG8)),w===r.RG_INTEGER&&(Z===r.UNSIGNED_BYTE&&(ne=r.RG8UI),Z===r.UNSIGNED_SHORT&&(ne=r.RG16UI),Z===r.UNSIGNED_INT&&(ne=r.RG32UI),Z===r.BYTE&&(ne=r.RG8I),Z===r.SHORT&&(ne=r.RG16I),Z===r.INT&&(ne=r.RG32I)),w===r.RGB&&Z===r.UNSIGNED_INT_5_9_9_9_REV&&(ne=r.RGB9_E5),w===r.RGBA){const Re=se?ms:ut.getTransfer(ie);Z===r.FLOAT&&(ne=r.RGBA32F),Z===r.HALF_FLOAT&&(ne=r.RGBA16F),Z===r.UNSIGNED_BYTE&&(ne=Re===mt?r.SRGB8_ALPHA8:r.RGBA8),Z===r.UNSIGNED_SHORT_4_4_4_4&&(ne=r.RGBA4),Z===r.UNSIGNED_SHORT_5_5_5_1&&(ne=r.RGB5_A1)}return(ne===r.R16F||ne===r.R32F||ne===r.RG16F||ne===r.RG32F||ne===r.RGBA16F||ne===r.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function y(k,w){let Z;return k?w===null||w===1014||w===1020?Z=r.DEPTH24_STENCIL8:w===1015?Z=r.DEPTH32F_STENCIL8:w===1012&&(Z=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===1014||w===1020?Z=r.DEPTH_COMPONENT24:w===1015?Z=r.DEPTH_COMPONENT32F:w===1012&&(Z=r.DEPTH_COMPONENT16),Z}function b(k,w){return m(k)===!0||k.isFramebufferTexture&&k.minFilter!==1003&&k.minFilter!==1006?Math.log2(Math.max(w.width,w.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?w.mipmaps.length:1}function U(k){const w=k.target;w.removeEventListener("dispose",U),E(w),w.isVideoTexture&&d.delete(w)}function P(k){const w=k.target;w.removeEventListener("dispose",P),M(w)}function E(k){const w=n.get(k);if(w.__webglInit===void 0)return;const Z=k.source,ie=h.get(Z);if(ie){const se=ie[w.__cacheKey];se.usedTimes--,se.usedTimes===0&&L(k),Object.keys(ie).length===0&&h.delete(Z)}n.remove(k)}function L(k){const w=n.get(k);r.deleteTexture(w.__webglTexture);const Z=k.source,ie=h.get(Z);delete ie[w.__cacheKey],a.memory.textures--}function M(k){const w=n.get(k);if(k.depthTexture&&k.depthTexture.dispose(),k.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray(w.__webglFramebuffer[ie]))for(let se=0;se<w.__webglFramebuffer[ie].length;se++)r.deleteFramebuffer(w.__webglFramebuffer[ie][se]);else r.deleteFramebuffer(w.__webglFramebuffer[ie]);w.__webglDepthbuffer&&r.deleteRenderbuffer(w.__webglDepthbuffer[ie])}else{if(Array.isArray(w.__webglFramebuffer))for(let ie=0;ie<w.__webglFramebuffer.length;ie++)r.deleteFramebuffer(w.__webglFramebuffer[ie]);else r.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&r.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&r.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ie=0;ie<w.__webglColorRenderbuffer.length;ie++)w.__webglColorRenderbuffer[ie]&&r.deleteRenderbuffer(w.__webglColorRenderbuffer[ie]);w.__webglDepthRenderbuffer&&r.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const Z=k.textures;for(let ie=0,se=Z.length;ie<se;ie++){const ne=n.get(Z[ie]);ne.__webglTexture&&(r.deleteTexture(ne.__webglTexture),a.memory.textures--),n.remove(Z[ie])}n.remove(k)}let _=0;function I(){_=0}function B(){const k=_;return k>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+i.maxTextures),_+=1,k}function F(k){const w=[];return w.push(k.wrapS),w.push(k.wrapT),w.push(k.wrapR||0),w.push(k.magFilter),w.push(k.minFilter),w.push(k.anisotropy),w.push(k.internalFormat),w.push(k.format),w.push(k.type),w.push(k.generateMipmaps),w.push(k.premultiplyAlpha),w.push(k.flipY),w.push(k.unpackAlignment),w.push(k.colorSpace),w.join()}function N(k,w){const Z=n.get(k);if(k.isVideoTexture&&pt(k),k.isRenderTargetTexture===!1&&k.version>0&&Z.__version!==k.version){const ie=k.image;if(ie===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ve(Z,k,w);return}}t.bindTexture(r.TEXTURE_2D,Z.__webglTexture,r.TEXTURE0+w)}function Y(k,w){const Z=n.get(k);if(k.version>0&&Z.__version!==k.version){Ve(Z,k,w);return}t.bindTexture(r.TEXTURE_2D_ARRAY,Z.__webglTexture,r.TEXTURE0+w)}function X(k,w){const Z=n.get(k);if(k.version>0&&Z.__version!==k.version){Ve(Z,k,w);return}t.bindTexture(r.TEXTURE_3D,Z.__webglTexture,r.TEXTURE0+w)}function Q(k,w){const Z=n.get(k);if(k.version>0&&Z.__version!==k.version){J(Z,k,w);return}t.bindTexture(r.TEXTURE_CUBE_MAP,Z.__webglTexture,r.TEXTURE0+w)}const q={1e3:r.REPEAT,1001:r.CLAMP_TO_EDGE,1002:r.MIRRORED_REPEAT},re={1003:r.NEAREST,1004:r.NEAREST_MIPMAP_NEAREST,1005:r.NEAREST_MIPMAP_LINEAR,1006:r.LINEAR,1007:r.LINEAR_MIPMAP_NEAREST,1008:r.LINEAR_MIPMAP_LINEAR},ce={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function ve(k,w){if(w.type===1015&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===1006||w.magFilter===1007||w.magFilter===1005||w.magFilter===1008||w.minFilter===1006||w.minFilter===1007||w.minFilter===1005||w.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(k,r.TEXTURE_WRAP_S,q[w.wrapS]),r.texParameteri(k,r.TEXTURE_WRAP_T,q[w.wrapT]),(k===r.TEXTURE_3D||k===r.TEXTURE_2D_ARRAY)&&r.texParameteri(k,r.TEXTURE_WRAP_R,q[w.wrapR]),r.texParameteri(k,r.TEXTURE_MAG_FILTER,re[w.magFilter]),r.texParameteri(k,r.TEXTURE_MIN_FILTER,re[w.minFilter]),w.compareFunction&&(r.texParameteri(k,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(k,r.TEXTURE_COMPARE_FUNC,ce[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===1003||w.minFilter!==1005&&w.minFilter!==1008||w.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");r.texParameterf(k,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function te(k,w){let Z=!1;k.__webglInit===void 0&&(k.__webglInit=!0,w.addEventListener("dispose",U));const ie=w.source;let se=h.get(ie);se===void 0&&(se={},h.set(ie,se));const ne=F(w);if(ne!==k.__cacheKey){se[ne]===void 0&&(se[ne]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,Z=!0),se[ne].usedTimes++;const Re=se[k.__cacheKey];Re!==void 0&&(se[k.__cacheKey].usedTimes--,Re.usedTimes===0&&L(w)),k.__cacheKey=ne,k.__webglTexture=se[ne].texture}return Z}function Ve(k,w,Z){let ie=r.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ie=r.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ie=r.TEXTURE_3D);const se=te(k,w),ne=w.source;t.bindTexture(ie,k.__webglTexture,r.TEXTURE0+Z);const Re=n.get(ne);if(ne.version!==Re.__version||se===!0){t.activeTexture(r.TEXTURE0+Z);const fe=ut.getPrimaries(ut.workingColorSpace),Se=w.colorSpace===qn?null:ut.getPrimaries(w.colorSpace),Xe=w.colorSpace===qn||fe===Se?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,w.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,w.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);let le=v(w.image,!1,i.maxTextureSize);le=De(w,le);const xe=s.convert(w.format,w.colorSpace),$e=s.convert(w.type);let Ne=S(w.internalFormat,xe,$e,w.colorSpace,w.isVideoTexture);ve(ie,w);let we;const ze=w.mipmaps,Ye=w.isVideoTexture!==!0,C=Re.__version===void 0||se===!0,A=ne.dataReady,O=b(w,le);if(w.isDepthTexture)Ne=y(w.format===1027,w.type),C&&(Ye?t.texStorage2D(r.TEXTURE_2D,1,Ne,le.width,le.height):t.texImage2D(r.TEXTURE_2D,0,Ne,le.width,le.height,0,xe,$e,null));else if(w.isDataTexture)if(ze.length>0){Ye&&C&&t.texStorage2D(r.TEXTURE_2D,O,Ne,ze[0].width,ze[0].height);for(let z=0,H=ze.length;z<H;z++)we=ze[z],Ye?A&&t.texSubImage2D(r.TEXTURE_2D,z,0,0,we.width,we.height,xe,$e,we.data):t.texImage2D(r.TEXTURE_2D,z,Ne,we.width,we.height,0,xe,$e,we.data);w.generateMipmaps=!1}else Ye?(C&&t.texStorage2D(r.TEXTURE_2D,O,Ne,le.width,le.height),A&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,le.width,le.height,xe,$e,le.data)):t.texImage2D(r.TEXTURE_2D,0,Ne,le.width,le.height,0,xe,$e,le.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ye&&C&&t.texStorage3D(r.TEXTURE_2D_ARRAY,O,Ne,ze[0].width,ze[0].height,le.depth);for(let z=0,H=ze.length;z<H;z++)if(we=ze[z],w.format!==1023)if(xe!==null)if(Ye){if(A)if(w.layerUpdates.size>0){const ee=Ac(we.width,we.height,w.format,w.type);for(const ae of w.layerUpdates){const ue=we.data.subarray(ae*ee/we.data.BYTES_PER_ELEMENT,(ae+1)*ee/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,z,0,0,ae,we.width,we.height,1,xe,ue,0,0)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,z,0,0,0,we.width,we.height,le.depth,xe,we.data,0,0)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,z,Ne,we.width,we.height,le.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ye?A&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,z,0,0,0,we.width,we.height,le.depth,xe,$e,we.data):t.texImage3D(r.TEXTURE_2D_ARRAY,z,Ne,we.width,we.height,le.depth,0,xe,$e,we.data)}else{Ye&&C&&t.texStorage2D(r.TEXTURE_2D,O,Ne,ze[0].width,ze[0].height);for(let z=0,H=ze.length;z<H;z++)we=ze[z],w.format!==1023?xe!==null?Ye?A&&t.compressedTexSubImage2D(r.TEXTURE_2D,z,0,0,we.width,we.height,xe,we.data):t.compressedTexImage2D(r.TEXTURE_2D,z,Ne,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?A&&t.texSubImage2D(r.TEXTURE_2D,z,0,0,we.width,we.height,xe,$e,we.data):t.texImage2D(r.TEXTURE_2D,z,Ne,we.width,we.height,0,xe,$e,we.data)}else if(w.isDataArrayTexture)if(Ye){if(C&&t.texStorage3D(r.TEXTURE_2D_ARRAY,O,Ne,le.width,le.height,le.depth),A)if(w.layerUpdates.size>0){const z=Ac(le.width,le.height,w.format,w.type);for(const H of w.layerUpdates){const ee=le.data.subarray(H*z/le.data.BYTES_PER_ELEMENT,(H+1)*z/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,H,le.width,le.height,1,xe,$e,ee)}w.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,xe,$e,le.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Ne,le.width,le.height,le.depth,0,xe,$e,le.data);else if(w.isData3DTexture)Ye?(C&&t.texStorage3D(r.TEXTURE_3D,O,Ne,le.width,le.height,le.depth),A&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,xe,$e,le.data)):t.texImage3D(r.TEXTURE_3D,0,Ne,le.width,le.height,le.depth,0,xe,$e,le.data);else if(w.isFramebufferTexture){if(C)if(Ye)t.texStorage2D(r.TEXTURE_2D,O,Ne,le.width,le.height);else{let z=le.width,H=le.height;for(let ee=0;ee<O;ee++)t.texImage2D(r.TEXTURE_2D,ee,Ne,z,H,0,xe,$e,null),z>>=1,H>>=1}}else if(ze.length>0){if(Ye&&C){const z=Be(ze[0]);t.texStorage2D(r.TEXTURE_2D,O,Ne,z.width,z.height)}for(let z=0,H=ze.length;z<H;z++)we=ze[z],Ye?A&&t.texSubImage2D(r.TEXTURE_2D,z,0,0,xe,$e,we):t.texImage2D(r.TEXTURE_2D,z,Ne,xe,$e,we);w.generateMipmaps=!1}else if(Ye){if(C){const z=Be(le);t.texStorage2D(r.TEXTURE_2D,O,Ne,z.width,z.height)}A&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,xe,$e,le)}else t.texImage2D(r.TEXTURE_2D,0,Ne,xe,$e,le);m(w)&&p(ie),Re.__version=ne.version,w.onUpdate&&w.onUpdate(w)}k.__version=w.version}function J(k,w,Z){if(w.image.length!==6)return;const ie=te(k,w),se=w.source;t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+Z);const ne=n.get(se);if(se.version!==ne.__version||ie===!0){t.activeTexture(r.TEXTURE0+Z);const Re=ut.getPrimaries(ut.workingColorSpace),fe=w.colorSpace===qn?null:ut.getPrimaries(w.colorSpace),Se=w.colorSpace===qn||Re===fe?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,w.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,w.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const Xe=w.isCompressedTexture||w.image[0].isCompressedTexture,le=w.image[0]&&w.image[0].isDataTexture,xe=[];for(let H=0;H<6;H++)!Xe&&!le?xe[H]=v(w.image[H],!0,i.maxCubemapSize):xe[H]=le?w.image[H].image:w.image[H],xe[H]=De(w,xe[H]);const $e=xe[0],Ne=s.convert(w.format,w.colorSpace),we=s.convert(w.type),ze=S(w.internalFormat,Ne,we,w.colorSpace),Ye=w.isVideoTexture!==!0,C=ne.__version===void 0||ie===!0,A=se.dataReady;let O=b(w,$e);ve(r.TEXTURE_CUBE_MAP,w);let z;if(Xe){Ye&&C&&t.texStorage2D(r.TEXTURE_CUBE_MAP,O,ze,$e.width,$e.height);for(let H=0;H<6;H++){z=xe[H].mipmaps;for(let ee=0;ee<z.length;ee++){const ae=z[ee];w.format!==1023?Ne!==null?Ye?A&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee,0,0,ae.width,ae.height,Ne,ae.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee,ze,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ye?A&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee,0,0,ae.width,ae.height,Ne,we,ae.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee,ze,ae.width,ae.height,0,Ne,we,ae.data)}}}else{if(z=w.mipmaps,Ye&&C){z.length>0&&O++;const H=Be(xe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,O,ze,H.width,H.height)}for(let H=0;H<6;H++)if(le){Ye?A&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,0,0,xe[H].width,xe[H].height,Ne,we,xe[H].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,ze,xe[H].width,xe[H].height,0,Ne,we,xe[H].data);for(let ee=0;ee<z.length;ee++){const ue=z[ee].image[H].image;Ye?A&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee+1,0,0,ue.width,ue.height,Ne,we,ue.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee+1,ze,ue.width,ue.height,0,Ne,we,ue.data)}}else{Ye?A&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,0,0,Ne,we,xe[H]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,ze,Ne,we,xe[H]);for(let ee=0;ee<z.length;ee++){const ae=z[ee];Ye?A&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee+1,0,0,Ne,we,ae.image[H]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+H,ee+1,ze,Ne,we,ae.image[H])}}}m(w)&&p(r.TEXTURE_CUBE_MAP),ne.__version=se.version,w.onUpdate&&w.onUpdate(w)}k.__version=w.version}function oe(k,w,Z,ie,se,ne){const Re=s.convert(Z.format,Z.colorSpace),fe=s.convert(Z.type),Se=S(Z.internalFormat,Re,fe,Z.colorSpace);if(!n.get(w).__hasExternalTextures){const le=Math.max(1,w.width>>ne),xe=Math.max(1,w.height>>ne);se===r.TEXTURE_3D||se===r.TEXTURE_2D_ARRAY?t.texImage3D(se,ne,Se,le,xe,w.depth,0,Re,fe,null):t.texImage2D(se,ne,Se,le,xe,0,Re,fe,null)}t.bindFramebuffer(r.FRAMEBUFFER,k),Ee(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ie,se,n.get(Z).__webglTexture,0,Ie(w)):(se===r.TEXTURE_2D||se>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ie,se,n.get(Z).__webglTexture,ne),t.bindFramebuffer(r.FRAMEBUFFER,null)}function _e(k,w,Z){if(r.bindRenderbuffer(r.RENDERBUFFER,k),w.depthBuffer){const ie=w.depthTexture,se=ie&&ie.isDepthTexture?ie.type:null,ne=y(w.stencilBuffer,se),Re=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,fe=Ie(w);Ee(w)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,fe,ne,w.width,w.height):Z?r.renderbufferStorageMultisample(r.RENDERBUFFER,fe,ne,w.width,w.height):r.renderbufferStorage(r.RENDERBUFFER,ne,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Re,r.RENDERBUFFER,k)}else{const ie=w.textures;for(let se=0;se<ie.length;se++){const ne=ie[se],Re=s.convert(ne.format,ne.colorSpace),fe=s.convert(ne.type),Se=S(ne.internalFormat,Re,fe,ne.colorSpace),Xe=Ie(w);Z&&Ee(w)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Xe,Se,w.width,w.height):Ee(w)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Xe,Se,w.width,w.height):r.renderbufferStorage(r.RENDERBUFFER,Se,w.width,w.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function me(k,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,k),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),N(w.depthTexture,0);const ie=n.get(w.depthTexture).__webglTexture,se=Ie(w);if(w.depthTexture.format===1026)Ee(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ie,0,se):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ie,0);else if(w.depthTexture.format===1027)Ee(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ie,0,se):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function Ue(k){const w=n.get(k),Z=k.isWebGLCubeRenderTarget===!0;if(k.depthTexture&&!w.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");me(w.__webglFramebuffer,k)}else if(Z){w.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer[ie]),w.__webglDepthbuffer[ie]=r.createRenderbuffer(),_e(w.__webglDepthbuffer[ie],k,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=r.createRenderbuffer(),_e(w.__webglDepthbuffer,k,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function ke(k,w,Z){const ie=n.get(k);w!==void 0&&oe(ie.__webglFramebuffer,k,k.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),Z!==void 0&&Ue(k)}function We(k){const w=k.texture,Z=n.get(k),ie=n.get(w);k.addEventListener("dispose",P);const se=k.textures,ne=k.isWebGLCubeRenderTarget===!0,Re=se.length>1;if(Re||(ie.__webglTexture===void 0&&(ie.__webglTexture=r.createTexture()),ie.__version=w.version,a.memory.textures++),ne){Z.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0){Z.__webglFramebuffer[fe]=[];for(let Se=0;Se<w.mipmaps.length;Se++)Z.__webglFramebuffer[fe][Se]=r.createFramebuffer()}else Z.__webglFramebuffer[fe]=r.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){Z.__webglFramebuffer=[];for(let fe=0;fe<w.mipmaps.length;fe++)Z.__webglFramebuffer[fe]=r.createFramebuffer()}else Z.__webglFramebuffer=r.createFramebuffer();if(Re)for(let fe=0,Se=se.length;fe<Se;fe++){const Xe=n.get(se[fe]);Xe.__webglTexture===void 0&&(Xe.__webglTexture=r.createTexture(),a.memory.textures++)}if(k.samples>0&&Ee(k)===!1){Z.__webglMultisampledFramebuffer=r.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let fe=0;fe<se.length;fe++){const Se=se[fe];Z.__webglColorRenderbuffer[fe]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,Z.__webglColorRenderbuffer[fe]);const Xe=s.convert(Se.format,Se.colorSpace),le=s.convert(Se.type),xe=S(Se.internalFormat,Xe,le,Se.colorSpace,k.isXRRenderTarget===!0),$e=Ie(k);r.renderbufferStorageMultisample(r.RENDERBUFFER,$e,xe,k.width,k.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+fe,r.RENDERBUFFER,Z.__webglColorRenderbuffer[fe])}r.bindRenderbuffer(r.RENDERBUFFER,null),k.depthBuffer&&(Z.__webglDepthRenderbuffer=r.createRenderbuffer(),_e(Z.__webglDepthRenderbuffer,k,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ne){t.bindTexture(r.TEXTURE_CUBE_MAP,ie.__webglTexture),ve(r.TEXTURE_CUBE_MAP,w);for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0)for(let Se=0;Se<w.mipmaps.length;Se++)oe(Z.__webglFramebuffer[fe][Se],k,w,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Se);else oe(Z.__webglFramebuffer[fe],k,w,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(w)&&p(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let fe=0,Se=se.length;fe<Se;fe++){const Xe=se[fe],le=n.get(Xe);t.bindTexture(r.TEXTURE_2D,le.__webglTexture),ve(r.TEXTURE_2D,Xe),oe(Z.__webglFramebuffer,k,Xe,r.COLOR_ATTACHMENT0+fe,r.TEXTURE_2D,0),m(Xe)&&p(r.TEXTURE_2D)}t.unbindTexture()}else{let fe=r.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(fe=k.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(fe,ie.__webglTexture),ve(fe,w),w.mipmaps&&w.mipmaps.length>0)for(let Se=0;Se<w.mipmaps.length;Se++)oe(Z.__webglFramebuffer[Se],k,w,r.COLOR_ATTACHMENT0,fe,Se);else oe(Z.__webglFramebuffer,k,w,r.COLOR_ATTACHMENT0,fe,0);m(w)&&p(fe),t.unbindTexture()}k.depthBuffer&&Ue(k)}function rt(k){const w=k.textures;for(let Z=0,ie=w.length;Z<ie;Z++){const se=w[Z];if(m(se)){const ne=k.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,Re=n.get(se).__webglTexture;t.bindTexture(ne,Re),p(ne),t.unbindTexture()}}}const D=[],ft=[];function Ze(k){if(k.samples>0){if(Ee(k)===!1){const w=k.textures,Z=k.width,ie=k.height;let se=r.COLOR_BUFFER_BIT;const ne=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Re=n.get(k),fe=w.length>1;if(fe)for(let Se=0;Se<w.length;Se++)t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Se,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Se,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Se=0;Se<w.length;Se++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(se|=r.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(se|=r.STENCIL_BUFFER_BIT)),fe){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Re.__webglColorRenderbuffer[Se]);const Xe=n.get(w[Se]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Xe,0)}r.blitFramebuffer(0,0,Z,ie,0,0,Z,ie,se,r.NEAREST),l===!0&&(D.length=0,ft.length=0,D.push(r.COLOR_ATTACHMENT0+Se),k.depthBuffer&&k.resolveDepthBuffer===!1&&(D.push(ne),ft.push(ne),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ft)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,D))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),fe)for(let Se=0;Se<w.length;Se++){t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Se,r.RENDERBUFFER,Re.__webglColorRenderbuffer[Se]);const Xe=n.get(w[Se]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Se,r.TEXTURE_2D,Xe,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&l){const w=k.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[w])}}}function Ie(k){return Math.min(i.maxSamples,k.samples)}function Ee(k){const w=n.get(k);return k.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function pt(k){const w=a.render.frame;d.get(k)!==w&&(d.set(k,w),k.update())}function De(k,w){const Z=k.colorSpace,ie=k.format,se=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||Z!==on&&Z!==qn&&(ut.getTransfer(Z)===mt?(ie!==1023||se!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),w}function Be(k){return typeof HTMLImageElement!="undefined"&&k instanceof HTMLImageElement?(c.width=k.naturalWidth||k.width,c.height=k.naturalHeight||k.height):typeof VideoFrame!="undefined"&&k instanceof VideoFrame?(c.width=k.displayWidth,c.height=k.displayHeight):(c.width=k.width,c.height=k.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=I,this.setTexture2D=N,this.setTexture2DArray=Y,this.setTexture3D=X,this.setTextureCube=Q,this.rebindTextures=ke,this.setupRenderTarget=We,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=Ue,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=Ee}function ev(r,e){function t(n,i=qn){let s;const a=ut.getTransfer(i);if(n===1009)return r.UNSIGNED_BYTE;if(n===1017)return r.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return r.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===1010)return r.BYTE;if(n===1011)return r.SHORT;if(n===1012)return r.UNSIGNED_SHORT;if(n===1013)return r.INT;if(n===1014)return r.UNSIGNED_INT;if(n===1015)return r.FLOAT;if(n===1016)return r.HALF_FLOAT;if(n===1021)return r.ALPHA;if(n===1022)return r.RGB;if(n===1023)return r.RGBA;if(n===1024)return r.LUMINANCE;if(n===1025)return r.LUMINANCE_ALPHA;if(n===1026)return r.DEPTH_COMPONENT;if(n===1027)return r.DEPTH_STENCIL;if(n===1028)return r.RED;if(n===1029)return r.RED_INTEGER;if(n===1030)return r.RG;if(n===1031)return r.RG_INTEGER;if(n===1033)return r.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===mt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===mt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===mt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36492)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}class tv extends Ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ti extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nv={type:"move"};class yo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ti,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ti,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ti,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nv)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ti;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rv=`
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

}`;class sv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Lt,s=e.properties.get(i);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ft({vertexShader:iv,fragmentShader:rv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ge(new Kt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class av extends Ni{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,f=null,g=null;const v=new sv,m=t.getContextAttributes();let p=null,S=null;const y=[],b=[],U=new he;let P=null;const E=new Ht;E.layers.enable(1),E.viewport=new vt;const L=new Ht;L.layers.enable(2),L.viewport=new vt;const M=[E,L],_=new tv;_.layers.enable(1),_.layers.enable(2);let I=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let oe=y[J];return oe===void 0&&(oe=new yo,y[J]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(J){let oe=y[J];return oe===void 0&&(oe=new yo,y[J]=oe),oe.getGripSpace()},this.getHand=function(J){let oe=y[J];return oe===void 0&&(oe=new yo,y[J]=oe),oe.getHandSpace()};function F(J){const oe=b.indexOf(J.inputSource);if(oe===-1)return;const _e=y[oe];_e!==void 0&&(_e.update(J.inputSource,J.frame,c||a),_e.dispatchEvent({type:J.type,data:J.inputSource}))}function N(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",Y);for(let J=0;J<y.length;J++){const oe=b[J];oe!==null&&(b[J]=null,y[J].disconnect(oe))}I=null,B=null,v.reset(),e.setRenderTarget(p),f=null,h=null,u=null,i=null,S=null,Ve.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(U.width,U.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",N),i.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(U),i.renderState.layers===void 0){const oe={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,oe),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Zt(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let oe=null,_e=null,me=null;m.depth&&(me=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=m.stencil?1027:1026,_e=m.stencil?1020:1014);const Ue={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};u=new XRWebGLBinding(i,t),h=u.createProjectionLayer(Ue),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new Zt(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new ac(h.textureWidth,h.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Ve.setContext(i),Ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function Y(J){for(let oe=0;oe<J.removed.length;oe++){const _e=J.removed[oe],me=b.indexOf(_e);me>=0&&(b[me]=null,y[me].disconnect(_e))}for(let oe=0;oe<J.added.length;oe++){const _e=J.added[oe];let me=b.indexOf(_e);if(me===-1){for(let ke=0;ke<y.length;ke++)if(ke>=b.length){b.push(_e),me=ke;break}else if(b[ke]===null){b[ke]=_e,me=ke;break}if(me===-1)break}const Ue=y[me];Ue&&Ue.connect(_e)}}const X=new R,Q=new R;function q(J,oe,_e){X.setFromMatrixPosition(oe.matrixWorld),Q.setFromMatrixPosition(_e.matrixWorld);const me=X.distanceTo(Q),Ue=oe.projectionMatrix.elements,ke=_e.projectionMatrix.elements,We=Ue[14]/(Ue[10]-1),rt=Ue[14]/(Ue[10]+1),D=(Ue[9]+1)/Ue[5],ft=(Ue[9]-1)/Ue[5],Ze=(Ue[8]-1)/Ue[0],Ie=(ke[8]+1)/ke[0],Ee=We*Ze,pt=We*Ie,De=me/(-Ze+Ie),Be=De*-Ze;oe.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Be),J.translateZ(De),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();const k=We+De,w=rt+De,Z=Ee-Be,ie=pt+(me-Be),se=D*rt/w*k,ne=ft*rt/w*k;J.projectionMatrix.makePerspective(Z,ie,se,ne,k,w),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function re(J,oe){oe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(oe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;v.texture!==null&&(J.near=v.depthNear,J.far=v.depthFar),_.near=L.near=E.near=J.near,_.far=L.far=E.far=J.far,(I!==_.near||B!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),I=_.near,B=_.far,E.near=I,E.far=B,L.near=I,L.far=B,E.updateProjectionMatrix(),L.updateProjectionMatrix(),J.updateProjectionMatrix());const oe=J.parent,_e=_.cameras;re(_,oe);for(let me=0;me<_e.length;me++)re(_e[me],oe);_e.length===2?q(_,E,L):_.projectionMatrix.copy(E.projectionMatrix),ce(J,_,oe)};function ce(J,oe,_e){_e===null?J.matrix.copy(oe.matrixWorld):(J.matrix.copy(_e.matrixWorld),J.matrix.invert(),J.matrix.multiply(oe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(oe.projectionMatrix),J.projectionMatrixInverse.copy(oe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Fi*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(J){l=J,h!==null&&(h.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let ve=null;function te(J,oe){if(d=oe.getViewerPose(c||a),g=oe,d!==null){const _e=d.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let me=!1;_e.length!==_.cameras.length&&(_.cameras.length=0,me=!0);for(let ke=0;ke<_e.length;ke++){const We=_e[ke];let rt=null;if(f!==null)rt=f.getViewport(We);else{const ft=u.getViewSubImage(h,We);rt=ft.viewport,ke===0&&(e.setRenderTargetTextures(S,ft.colorTexture,h.ignoreDepthValues?void 0:ft.depthStencilTexture),e.setRenderTarget(S))}let D=M[ke];D===void 0&&(D=new Ht,D.layers.enable(ke),D.viewport=new vt,M[ke]=D),D.matrix.fromArray(We.transform.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale),D.projectionMatrix.fromArray(We.projectionMatrix),D.projectionMatrixInverse.copy(D.projectionMatrix).invert(),D.viewport.set(rt.x,rt.y,rt.width,rt.height),ke===0&&(_.matrix.copy(D.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),me===!0&&_.cameras.push(D)}const Ue=i.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")){const ke=u.getDepthInformation(_e[0]);ke&&ke.isValid&&ke.texture&&v.init(e,ke,i.renderState)}}for(let _e=0;_e<y.length;_e++){const me=b[_e],Ue=y[_e];me!==null&&Ue!==void 0&&Ue.update(me,oe,c||a)}ve&&ve(J,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),g=null}const Ve=new Jl;Ve.setAnimationLoop(te),this.setAnimationLoop=function(J){ve=J},this.dispose=function(){}}}const _i=new _n,ov=new dt;function lv(r,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,ql(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,S,y,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),d(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,S,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),y=S.envMap,b=S.envMapRotation;y&&(m.envMap.value=y,_i.copy(b),_i.x*=-1,_i.y*=-1,_i.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),m.envMapRotation.value.setFromMatrix4(ov.makeRotationFromEuler(_i)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function cv(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,y){const b=y.program;n.uniformBlockBinding(S,b)}function c(S,y){let b=i[S.id];b===void 0&&(g(S),b=d(S),i[S.id]=b,S.addEventListener("dispose",m));const U=y.program;n.updateUBOMapping(S,U);const P=e.render.frame;s[S.id]!==P&&(h(S),s[S.id]=P)}function d(S){const y=u();S.__bindingPointIndex=y;const b=r.createBuffer(),U=S.__size,P=S.usage;return r.bindBuffer(r.UNIFORM_BUFFER,b),r.bufferData(r.UNIFORM_BUFFER,U,P),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,y,b),b}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const y=i[S.id],b=S.uniforms,U=S.__cache;r.bindBuffer(r.UNIFORM_BUFFER,y);for(let P=0,E=b.length;P<E;P++){const L=Array.isArray(b[P])?b[P]:[b[P]];for(let M=0,_=L.length;M<_;M++){const I=L[M];if(f(I,P,M,U)===!0){const B=I.__offset,F=Array.isArray(I.value)?I.value:[I.value];let N=0;for(let Y=0;Y<F.length;Y++){const X=F[Y],Q=v(X);typeof X=="number"||typeof X=="boolean"?(I.__data[0]=X,r.bufferSubData(r.UNIFORM_BUFFER,B+N,I.__data)):X.isMatrix3?(I.__data[0]=X.elements[0],I.__data[1]=X.elements[1],I.__data[2]=X.elements[2],I.__data[3]=0,I.__data[4]=X.elements[3],I.__data[5]=X.elements[4],I.__data[6]=X.elements[5],I.__data[7]=0,I.__data[8]=X.elements[6],I.__data[9]=X.elements[7],I.__data[10]=X.elements[8],I.__data[11]=0):(X.toArray(I.__data,N),N+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,B,I.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(S,y,b,U){const P=S.value,E=y+"_"+b;if(U[E]===void 0)return typeof P=="number"||typeof P=="boolean"?U[E]=P:U[E]=P.clone(),!0;{const L=U[E];if(typeof P=="number"||typeof P=="boolean"){if(L!==P)return U[E]=P,!0}else if(L.equals(P)===!1)return L.copy(P),!0}return!1}function g(S){const y=S.uniforms;let b=0;const U=16;for(let E=0,L=y.length;E<L;E++){const M=Array.isArray(y[E])?y[E]:[y[E]];for(let _=0,I=M.length;_<I;_++){const B=M[_],F=Array.isArray(B.value)?B.value:[B.value];for(let N=0,Y=F.length;N<Y;N++){const X=F[N],Q=v(X),q=b%U;q!==0&&U-q<Q.boundary&&(b+=U-q),B.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=b,b+=Q.storage}}}const P=b%U;return P>0&&(b+=U-P),S.__size=b,S.__cache={},this}function v(S){const y={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(y.boundary=4,y.storage=4):S.isVector2?(y.boundary=8,y.storage=8):S.isVector3||S.isColor?(y.boundary=16,y.storage=12):S.isVector4?(y.boundary=16,y.storage=16):S.isMatrix3?(y.boundary=48,y.storage=48):S.isMatrix4?(y.boundary=64,y.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),y}function m(S){const y=S.target;y.removeEventListener("dispose",m);const b=a.indexOf(y.__bindingPointIndex);a.splice(b,1),r.deleteBuffer(i[y.id]),delete i[y.id],delete s[y.id]}function p(){for(const S in i)r.deleteBuffer(i[S]);a=[],i={},s={}}return{bind:l,update:c,dispose:p}}class dv{constructor(e={}){const{canvas:t=Uh(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=a;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ot,this.toneMapping=0,this.toneMappingExposure=1;const y=this;let b=!1,U=0,P=0,E=null,L=-1,M=null;const _=new vt,I=new vt;let B=null;const F=new Pe(0);let N=0,Y=t.width,X=t.height,Q=1,q=null,re=null;const ce=new vt(0,0,Y,X),ve=new vt(0,0,Y,X);let te=!1;const Ve=new lo;let J=!1,oe=!1;const _e=new dt,me=new R,Ue=new vt,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let We=!1;function rt(){return E===null?Q:1}let D=n;function ft(T,G){return t.getContext(T,G)}try{const T={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Un}`),t.addEventListener("webglcontextlost",z,!1),t.addEventListener("webglcontextrestored",H,!1),t.addEventListener("webglcontextcreationerror",ee,!1),D===null){const G="webgl2";if(D=ft(G,T),D===null)throw ft(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ze,Ie,Ee,pt,De,Be,k,w,Z,ie,se,ne,Re,fe,Se,Xe,le,xe,$e,Ne,we,ze,Ye,C;function A(){Ze=new vm(D),Ze.init(),ze=new ev(D,Ze),Ie=new um(D,Ze,e,ze),Ee=new jg(D),pt=new bm(D),De=new Fg,Be=new Jg(D,Ze,Ee,De,Ie,ze,pt),k=new fm(y),w=new gm(y),Z=new of(D),Ye=new cm(D,Z),ie=new ym(D,Z,pt,Ye),se=new Sm(D,ie,Z,pt),$e=new _m(D,Ie,Be),Xe=new hm(De),ne=new Ng(y,k,w,Ze,Ie,Ye,Xe),Re=new lv(y,De),fe=new Bg,Se=new Xg(Ze),xe=new lm(y,k,w,Ee,se,h,l),le=new Kg(y,se,Ie),C=new cv(D,pt,Ie,Ee),Ne=new dm(D,Ze,pt),we=new xm(D,Ze,pt),pt.programs=ne.programs,y.capabilities=Ie,y.extensions=Ze,y.properties=De,y.renderLists=fe,y.shadowMap=le,y.state=Ee,y.info=pt}A();const O=new av(y,D);this.xr=O,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=Ze.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ze.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(T){T!==void 0&&(Q=T,this.setSize(Y,X,!1))},this.getSize=function(T){return T.set(Y,X)},this.setSize=function(T,G,K=!0){if(O.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=T,X=G,t.width=Math.floor(T*Q),t.height=Math.floor(G*Q),K===!0&&(t.style.width=T+"px",t.style.height=G+"px"),this.setViewport(0,0,T,G)},this.getDrawingBufferSize=function(T){return T.set(Y*Q,X*Q).floor()},this.setDrawingBufferSize=function(T,G,K){Y=T,X=G,Q=K,t.width=Math.floor(T*K),t.height=Math.floor(G*K),this.setViewport(0,0,T,G)},this.getCurrentViewport=function(T){return T.copy(_)},this.getViewport=function(T){return T.copy(ce)},this.setViewport=function(T,G,K,j){T.isVector4?ce.set(T.x,T.y,T.z,T.w):ce.set(T,G,K,j),Ee.viewport(_.copy(ce).multiplyScalar(Q).round())},this.getScissor=function(T){return T.copy(ve)},this.setScissor=function(T,G,K,j){T.isVector4?ve.set(T.x,T.y,T.z,T.w):ve.set(T,G,K,j),Ee.scissor(I.copy(ve).multiplyScalar(Q).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(T){Ee.setScissorTest(te=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){re=T},this.getClearColor=function(T){return T.copy(xe.getClearColor())},this.setClearColor=function(){xe.setClearColor.apply(xe,arguments)},this.getClearAlpha=function(){return xe.getClearAlpha()},this.setClearAlpha=function(){xe.setClearAlpha.apply(xe,arguments)},this.clear=function(T=!0,G=!0,K=!0){let j=0;if(T){let W=!1;if(E!==null){const de=E.texture.format;W=de===1033||de===1031||de===1029}if(W){const de=E.texture.type,pe=de===1009||de===1014||de===1012||de===1020||de===1017||de===1018,ye=xe.getClearColor(),Me=xe.getClearAlpha(),Oe=ye.r,He=ye.g,Le=ye.b;pe?(f[0]=Oe,f[1]=He,f[2]=Le,f[3]=Me,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=Oe,g[1]=He,g[2]=Le,g[3]=Me,D.clearBufferiv(D.COLOR,0,g))}else j|=D.COLOR_BUFFER_BIT}G&&(j|=D.DEPTH_BUFFER_BIT),K&&(j|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",z,!1),t.removeEventListener("webglcontextrestored",H,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),fe.dispose(),Se.dispose(),De.dispose(),k.dispose(),w.dispose(),se.dispose(),Ye.dispose(),C.dispose(),ne.dispose(),O.dispose(),O.removeEventListener("sessionstart",gt),O.removeEventListener("sessionend",Pt),ht.stop()};function z(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const T=pt.autoReset,G=le.enabled,K=le.autoUpdate,j=le.needsUpdate,W=le.type;A(),pt.autoReset=T,le.enabled=G,le.autoUpdate=K,le.needsUpdate=j,le.type=W}function ee(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ae(T){const G=T.target;G.removeEventListener("dispose",ae),ue(G)}function ue(T){Ce(T),De.remove(T)}function Ce(T){const G=De.get(T).programs;G!==void 0&&(G.forEach(function(K){ne.releaseProgram(K)}),T.isShaderMaterial&&ne.releaseShaderCache(T))}this.renderBufferDirect=function(T,G,K,j,W,de){G===null&&(G=ke);const pe=W.isMesh&&W.matrixWorld.determinant()<0,ye=gl(T,G,K,j,W);Ee.setMaterial(j,pe);let Me=K.index,Oe=1;if(j.wireframe===!0){if(Me=ie.getWireframeAttribute(K),Me===void 0)return;Oe=2}const He=K.drawRange,Le=K.attributes.position;let lt=He.start*Oe,yt=(He.start+He.count)*Oe;de!==null&&(lt=Math.max(lt,de.start*Oe),yt=Math.min(yt,(de.start+de.count)*Oe)),Me!==null?(lt=Math.max(lt,0),yt=Math.min(yt,Me.count)):Le!=null&&(lt=Math.max(lt,0),yt=Math.min(yt,Le.count));const xt=yt-lt;if(xt<0||xt===1/0)return;Ye.setup(W,j,ye,K,Me);let Vt,ct=Ne;if(Me!==null&&(Vt=Z.get(Me),ct=we,ct.setIndex(Vt)),W.isMesh)j.wireframe===!0?(Ee.setLineWidth(j.wireframeLinewidth*rt()),ct.setMode(D.LINES)):ct.setMode(D.TRIANGLES);else if(W.isLine){let Te=j.linewidth;Te===void 0&&(Te=1),Ee.setLineWidth(Te*rt()),W.isLineSegments?ct.setMode(D.LINES):W.isLineLoop?ct.setMode(D.LINE_LOOP):ct.setMode(D.LINE_STRIP)}else W.isPoints?ct.setMode(D.POINTS):W.isSprite&&ct.setMode(D.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)ct.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(Ze.get("WEBGL_multi_draw"))ct.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Te=W._multiDrawStarts,Mt=W._multiDrawCounts,ot=W._multiDrawCount,Wt=Me?Z.get(Me).bytesPerElement:1,bn=De.get(j).currentProgram.getUniforms();for(let Xt=0;Xt<ot;Xt++)bn.setValue(D,"_gl_DrawID",Xt),ct.render(Te[Xt]/Wt,Mt[Xt])}else if(W.isInstancedMesh)ct.renderInstances(lt,xt,W.count);else if(K.isInstancedBufferGeometry){const Te=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Mt=Math.min(K.instanceCount,Te);ct.renderInstances(lt,xt,Mt)}else ct.render(lt,xt)};function qe(T,G,K){T.transparent===!0&&T.side===2&&T.forceSinglePass===!1?(T.side=1,T.needsUpdate=!0,Ui(T,G,K),T.side=0,T.needsUpdate=!0,Ui(T,G,K),T.side=2):Ui(T,G,K)}this.compile=function(T,G,K=null){K===null&&(K=T),m=Se.get(K),m.init(G),S.push(m),K.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(m.pushLight(W),W.castShadow&&m.pushShadow(W))}),T!==K&&T.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(m.pushLight(W),W.castShadow&&m.pushShadow(W))}),m.setupLights();const j=new Set;return T.traverse(function(W){const de=W.material;if(de)if(Array.isArray(de))for(let pe=0;pe<de.length;pe++){const ye=de[pe];qe(ye,K,W),j.add(ye)}else qe(de,K,W),j.add(de)}),S.pop(),m=null,j},this.compileAsync=function(T,G,K=null){const j=this.compile(T,G,K);return new Promise(W=>{function de(){if(j.forEach(function(pe){De.get(pe).currentProgram.isReady()&&j.delete(pe)}),j.size===0){W(T);return}setTimeout(de,10)}Ze.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Fe=null;function tt(T){Fe&&Fe(T)}function gt(){ht.stop()}function Pt(){ht.start()}const ht=new Jl;ht.setAnimationLoop(tt),typeof self!="undefined"&&ht.setContext(self),this.setAnimationLoop=function(T){Fe=T,O.setAnimationLoop(T),T===null?ht.stop():ht.start()},O.addEventListener("sessionstart",gt),O.addEventListener("sessionend",Pt),this.render=function(T,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),O.enabled===!0&&O.isPresenting===!0&&(O.cameraAutoUpdate===!0&&O.updateCamera(G),G=O.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,G,E),m=Se.get(T,S.length),m.init(G),S.push(m),_e.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Ve.setFromProjectionMatrix(_e),oe=this.localClippingEnabled,J=Xe.init(this.clippingPlanes,oe),v=fe.get(T,p.length),v.init(),p.push(v),O.enabled===!0&&O.isPresenting===!0){const de=y.xr.getDepthSensingMesh();de!==null&&Gt(de,G,-1/0,y.sortObjects)}Gt(T,G,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(q,re),We=O.enabled===!1||O.isPresenting===!1||O.hasDepthSensing()===!1,We&&xe.addToRenderList(v,T),this.info.render.frame++,J===!0&&Xe.beginShadows();const K=m.state.shadowsArray;le.render(K,T,G),J===!0&&Xe.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=v.opaque,W=v.transmissive;if(m.setupLights(),G.isArrayCamera){const de=G.cameras;if(W.length>0)for(let pe=0,ye=de.length;pe<ye;pe++){const Me=de[pe];$n(j,W,T,Me)}We&&xe.render(T);for(let pe=0,ye=de.length;pe<ye;pe++){const Me=de[pe];st(v,T,Me,Me.viewport)}}else W.length>0&&$n(j,W,T,G),We&&xe.render(T),st(v,T,G);E!==null&&(Be.updateMultisampleRenderTarget(E),Be.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(y,T,G),Ye.resetDefaultState(),L=-1,M=null,S.pop(),S.length>0?(m=S[S.length-1],J===!0&&Xe.setGlobalState(y.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function Gt(T,G,K,j){if(T.visible===!1)return;if(T.layers.test(G.layers)){if(T.isGroup)K=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(G);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Ve.intersectsSprite(T)){j&&Ue.setFromMatrixPosition(T.matrixWorld).applyMatrix4(_e);const pe=se.update(T),ye=T.material;ye.visible&&v.push(T,pe,ye,K,Ue.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Ve.intersectsObject(T))){const pe=se.update(T),ye=T.material;if(j&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ue.copy(T.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ue.copy(pe.boundingSphere.center)),Ue.applyMatrix4(T.matrixWorld).applyMatrix4(_e)),Array.isArray(ye)){const Me=pe.groups;for(let Oe=0,He=Me.length;Oe<He;Oe++){const Le=Me[Oe],lt=ye[Le.materialIndex];lt&&lt.visible&&v.push(T,pe,lt,K,Ue.z,Le)}}else ye.visible&&v.push(T,pe,ye,K,Ue.z,null)}}const de=T.children;for(let pe=0,ye=de.length;pe<ye;pe++)Gt(de[pe],G,K,j)}function st(T,G,K,j){const W=T.opaque,de=T.transmissive,pe=T.transparent;m.setupLightsView(K),J===!0&&Xe.setGlobalState(y.clippingPlanes,K),j&&Ee.viewport(_.copy(j)),W.length>0&&sn(W,G,K),de.length>0&&sn(de,G,K),pe.length>0&&sn(pe,G,K),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function $n(T,G,K,j){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[j.id]===void 0&&(m.state.transmissionRenderTarget[j.id]=new Zt(1,1,{generateMipmaps:!0,type:Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ut.workingColorSpace}));const de=m.state.transmissionRenderTarget[j.id],pe=j.viewport||_;de.setSize(pe.z,pe.w);const ye=y.getRenderTarget();y.setRenderTarget(de),y.getClearColor(F),N=y.getClearAlpha(),N<1&&y.setClearColor(16777215,.5),We?xe.render(K):y.clear();const Me=y.toneMapping;y.toneMapping=0;const Oe=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),m.setupLightsView(j),J===!0&&Xe.setGlobalState(y.clippingPlanes,j),sn(T,K,j),Be.updateMultisampleRenderTarget(de),Be.updateRenderTargetMipmap(de),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Le=0,lt=G.length;Le<lt;Le++){const yt=G[Le],xt=yt.object,Vt=yt.geometry,ct=yt.material,Te=yt.group;if(ct.side===2&&xt.layers.test(j.layers)){const Mt=ct.side;ct.side=1,ct.needsUpdate=!0,hn(xt,K,j,Vt,ct,Te),ct.side=Mt,ct.needsUpdate=!0,He=!0}}He===!0&&(Be.updateMultisampleRenderTarget(de),Be.updateRenderTargetMipmap(de))}y.setRenderTarget(ye),y.setClearColor(F,N),Oe!==void 0&&(j.viewport=Oe),y.toneMapping=Me}function sn(T,G,K){const j=G.isScene===!0?G.overrideMaterial:null;for(let W=0,de=T.length;W<de;W++){const pe=T[W],ye=pe.object,Me=pe.geometry,Oe=j===null?pe.material:j,He=pe.group;ye.layers.test(K.layers)&&hn(ye,G,K,Me,Oe,He)}}function hn(T,G,K,j,W,de){T.onBeforeRender(y,G,K,j,W,de),T.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.transparent===!0&&W.side===2&&W.forceSinglePass===!1?(W.side=1,W.needsUpdate=!0,y.renderBufferDirect(K,G,j,W,T,de),W.side=0,W.needsUpdate=!0,y.renderBufferDirect(K,G,j,W,T,de),W.side=2):y.renderBufferDirect(K,G,j,W,T,de),T.onAfterRender(y,G,K,j,W,de)}function Ui(T,G,K){G.isScene!==!0&&(G=ke);const j=De.get(T),W=m.state.lights,de=m.state.shadowsArray,pe=W.state.version,ye=ne.getParameters(T,W.state,de,G,K),Me=ne.getProgramCacheKey(ye);let Oe=j.programs;j.environment=T.isMeshStandardMaterial?G.environment:null,j.fog=G.fog,j.envMap=(T.isMeshStandardMaterial?w:k).get(T.envMap||j.environment),j.envMapRotation=j.environment!==null&&T.envMap===null?G.environmentRotation:T.envMapRotation,Oe===void 0&&(T.addEventListener("dispose",ae),Oe=new Map,j.programs=Oe);let He=Oe.get(Me);if(He!==void 0){if(j.currentProgram===He&&j.lightsStateVersion===pe)return Rr(T,ye),He}else ye.uniforms=ne.getUniforms(T),T.onBeforeCompile(ye,y),He=ne.acquireProgram(ye,Me),Oe.set(Me,He),j.uniforms=ye.uniforms;const Le=j.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Le.clippingPlanes=Xe.uniform),Rr(T,ye),j.needsLights=Na(T),j.lightsStateVersion=pe,j.needsLights&&(Le.ambientLightColor.value=W.state.ambient,Le.lightProbe.value=W.state.probe,Le.directionalLights.value=W.state.directional,Le.directionalLightShadows.value=W.state.directionalShadow,Le.spotLights.value=W.state.spot,Le.spotLightShadows.value=W.state.spotShadow,Le.rectAreaLights.value=W.state.rectArea,Le.ltc_1.value=W.state.rectAreaLTC1,Le.ltc_2.value=W.state.rectAreaLTC2,Le.pointLights.value=W.state.point,Le.pointLightShadows.value=W.state.pointShadow,Le.hemisphereLights.value=W.state.hemi,Le.directionalShadowMap.value=W.state.directionalShadowMap,Le.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Le.spotShadowMap.value=W.state.spotShadowMap,Le.spotLightMatrix.value=W.state.spotLightMatrix,Le.spotLightMap.value=W.state.spotLightMap,Le.pointShadowMap.value=W.state.pointShadowMap,Le.pointShadowMatrix.value=W.state.pointShadowMatrix),j.currentProgram=He,j.uniformsList=null,He}function Di(T){if(T.uniformsList===null){const G=T.currentProgram.getUniforms();T.uniformsList=Gs.seqWithValue(G.seq,T.uniforms)}return T.uniformsList}function Rr(T,G){const K=De.get(T);K.outputColorSpace=G.outputColorSpace,K.batching=G.batching,K.batchingColor=G.batchingColor,K.instancing=G.instancing,K.instancingColor=G.instancingColor,K.instancingMorph=G.instancingMorph,K.skinning=G.skinning,K.morphTargets=G.morphTargets,K.morphNormals=G.morphNormals,K.morphColors=G.morphColors,K.morphTargetsCount=G.morphTargetsCount,K.numClippingPlanes=G.numClippingPlanes,K.numIntersection=G.numClipIntersection,K.vertexAlphas=G.vertexAlphas,K.vertexTangents=G.vertexTangents,K.toneMapping=G.toneMapping}function gl(T,G,K,j,W){G.isScene!==!0&&(G=ke),Be.resetTextureUnits();const de=G.fog,pe=j.isMeshStandardMaterial?G.environment:null,ye=E===null?y.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:on,Me=(j.isMeshStandardMaterial?w:k).get(j.envMap||pe),Oe=j.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,He=!!K.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Le=!!K.morphAttributes.position,lt=!!K.morphAttributes.normal,yt=!!K.morphAttributes.color;let xt=0;j.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(xt=y.toneMapping);const Vt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,ct=Vt!==void 0?Vt.length:0,Te=De.get(j),Mt=m.state.lights;if(J===!0&&(oe===!0||T!==M)){const en=T===M&&j.id===L;Xe.setState(j,T,en)}let ot=!1;j.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==Mt.state.version||Te.outputColorSpace!==ye||W.isBatchedMesh&&Te.batching===!1||!W.isBatchedMesh&&Te.batching===!0||W.isBatchedMesh&&Te.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Te.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Te.instancing===!1||!W.isInstancedMesh&&Te.instancing===!0||W.isSkinnedMesh&&Te.skinning===!1||!W.isSkinnedMesh&&Te.skinning===!0||W.isInstancedMesh&&Te.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Te.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Te.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Te.instancingMorph===!1&&W.morphTexture!==null||Te.envMap!==Me||j.fog===!0&&Te.fog!==de||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==Xe.numPlanes||Te.numIntersection!==Xe.numIntersection)||Te.vertexAlphas!==Oe||Te.vertexTangents!==He||Te.morphTargets!==Le||Te.morphNormals!==lt||Te.morphColors!==yt||Te.toneMapping!==xt||Te.morphTargetsCount!==ct)&&(ot=!0):(ot=!0,Te.__version=j.version);let Wt=Te.currentProgram;ot===!0&&(Wt=Ui(j,G,W));let bn=!1,Xt=!1,li=!1;const wt=Wt.getUniforms(),fn=Te.uniforms;if(Ee.useProgram(Wt.program)&&(bn=!0,Xt=!0,li=!0),j.id!==L&&(L=j.id,Xt=!0),bn||M!==T){wt.setValue(D,"projectionMatrix",T.projectionMatrix),wt.setValue(D,"viewMatrix",T.matrixWorldInverse);const en=wt.map.cameraPosition;en!==void 0&&en.setValue(D,me.setFromMatrixPosition(T.matrixWorld)),Ie.logarithmicDepthBuffer&&wt.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&wt.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Xt=!0,li=!0)}if(W.isSkinnedMesh){wt.setOptional(D,W,"bindMatrix"),wt.setOptional(D,W,"bindMatrixInverse");const en=W.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),wt.setValue(D,"boneTexture",en.boneTexture,Be))}W.isBatchedMesh&&(wt.setOptional(D,W,"batchingTexture"),wt.setValue(D,"batchingTexture",W._matricesTexture,Be),wt.setOptional(D,W,"batchingIdTexture"),wt.setValue(D,"batchingIdTexture",W._indirectTexture,Be),wt.setOptional(D,W,"batchingColorTexture"),W._colorsTexture!==null&&wt.setValue(D,"batchingColorTexture",W._colorsTexture,Be));const an=K.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&$e.update(W,K,Wt),(Xt||Te.receiveShadow!==W.receiveShadow)&&(Te.receiveShadow=W.receiveShadow,wt.setValue(D,"receiveShadow",W.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(fn.envMap.value=Me,fn.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&G.environment!==null&&(fn.envMapIntensity.value=G.environmentIntensity),Xt&&(wt.setValue(D,"toneMappingExposure",y.toneMappingExposure),Te.needsLights&&us(fn,li),de&&j.fog===!0&&Re.refreshFogUniforms(fn,de),Re.refreshMaterialUniforms(fn,j,Q,X,m.state.transmissionRenderTarget[T.id]),Gs.upload(D,Di(Te),fn,Be)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Gs.upload(D,Di(Te),fn,Be),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&wt.setValue(D,"center",W.center),wt.setValue(D,"modelViewMatrix",W.modelViewMatrix),wt.setValue(D,"normalMatrix",W.normalMatrix),wt.setValue(D,"modelMatrix",W.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const en=j.uniformsGroups;for(let hs=0,vl=en.length;hs<vl;hs++){const kn=en[hs];C.update(kn,Wt),C.bind(kn,Wt)}}return Wt}function us(T,G){T.ambientLightColor.needsUpdate=G,T.lightProbe.needsUpdate=G,T.directionalLights.needsUpdate=G,T.directionalLightShadows.needsUpdate=G,T.pointLights.needsUpdate=G,T.pointLightShadows.needsUpdate=G,T.spotLights.needsUpdate=G,T.spotLightShadows.needsUpdate=G,T.rectAreaLights.needsUpdate=G,T.hemisphereLights.needsUpdate=G}function Na(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,G,K){De.get(T.texture).__webglTexture=G,De.get(T.depthTexture).__webglTexture=K;const j=De.get(T);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=K===void 0,j.__autoAllocateDepthBuffer||Ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,G){const K=De.get(T);K.__webglFramebuffer=G,K.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(T,G=0,K=0){E=T,U=G,P=K;let j=!0,W=null,de=!1,pe=!1;if(T){const Me=De.get(T);Me.__useDefaultFramebuffer!==void 0?(Ee.bindFramebuffer(D.FRAMEBUFFER,null),j=!1):Me.__webglFramebuffer===void 0?Be.setupRenderTarget(T):Me.__hasExternalTextures&&Be.rebindTextures(T,De.get(T.texture).__webglTexture,De.get(T.depthTexture).__webglTexture);const Oe=T.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(pe=!0);const He=De.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(He[G])?W=He[G][K]:W=He[G],de=!0):T.samples>0&&Be.useMultisampledRTT(T)===!1?W=De.get(T).__webglMultisampledFramebuffer:Array.isArray(He)?W=He[K]:W=He,_.copy(T.viewport),I.copy(T.scissor),B=T.scissorTest}else _.copy(ce).multiplyScalar(Q).floor(),I.copy(ve).multiplyScalar(Q).floor(),B=te;if(Ee.bindFramebuffer(D.FRAMEBUFFER,W)&&j&&Ee.drawBuffers(T,W),Ee.viewport(_),Ee.scissor(I),Ee.setScissorTest(B),de){const Me=De.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+G,Me.__webglTexture,K)}else if(pe){const Me=De.get(T.texture),Oe=G||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Me.__webglTexture,K||0,Oe)}L=-1},this.readRenderTargetPixels=function(T,G,K,j,W,de,pe){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=De.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pe!==void 0&&(ye=ye[pe]),ye){Ee.bindFramebuffer(D.FRAMEBUFFER,ye);try{const Me=T.texture,Oe=Me.format,He=Me.type;if(!Ie.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ie.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=T.width-j&&K>=0&&K<=T.height-W&&D.readPixels(G,K,j,W,ze.convert(Oe),ze.convert(He),de)}finally{const Me=E!==null?De.get(E).__webglFramebuffer:null;Ee.bindFramebuffer(D.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(T,G,K,j,W,de,pe){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=De.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pe!==void 0&&(ye=ye[pe]),ye){Ee.bindFramebuffer(D.FRAMEBUFFER,ye);try{const Me=T.texture,Oe=Me.format,He=Me.type;if(!Ie.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ie.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=T.width-j&&K>=0&&K<=T.height-W){const Le=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Le),D.bufferData(D.PIXEL_PACK_BUFFER,de.byteLength,D.STREAM_READ),D.readPixels(G,K,j,W,ze.convert(Oe),ze.convert(He),0),D.flush();const lt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await Dh(D,lt,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,Le),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,de)}finally{D.deleteBuffer(Le),D.deleteSync(lt)}return de}}finally{const Me=E!==null?De.get(E).__webglFramebuffer:null;Ee.bindFramebuffer(D.FRAMEBUFFER,Me)}}},this.copyFramebufferToTexture=function(T,G=null,K=0){T.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,T=arguments[1]);const j=Math.pow(2,-K),W=Math.floor(T.image.width*j),de=Math.floor(T.image.height*j),pe=G!==null?G.x:0,ye=G!==null?G.y:0;Be.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,K,0,0,pe,ye,W,de),Ee.unbindTexture()},this.copyTextureToTexture=function(T,G,K=null,j=null,W=0){T.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,T=arguments[1],G=arguments[2],W=arguments[3]||0,K=null);let de,pe,ye,Me,Oe,He;K!==null?(de=K.max.x-K.min.x,pe=K.max.y-K.min.y,ye=K.min.x,Me=K.min.y):(de=T.image.width,pe=T.image.height,ye=0,Me=0),j!==null?(Oe=j.x,He=j.y):(Oe=0,He=0);const Le=ze.convert(G.format),lt=ze.convert(G.type);Be.setTexture2D(G,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,G.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,G.unpackAlignment);const yt=D.getParameter(D.UNPACK_ROW_LENGTH),xt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Vt=D.getParameter(D.UNPACK_SKIP_PIXELS),ct=D.getParameter(D.UNPACK_SKIP_ROWS),Te=D.getParameter(D.UNPACK_SKIP_IMAGES),Mt=T.isCompressedTexture?T.mipmaps[W]:T.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,Mt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Mt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ye),D.pixelStorei(D.UNPACK_SKIP_ROWS,Me),T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,W,Oe,He,de,pe,Le,lt,Mt.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,W,Oe,He,Mt.width,Mt.height,Le,Mt.data):D.texSubImage2D(D.TEXTURE_2D,W,Oe,He,de,pe,Le,lt,Mt),D.pixelStorei(D.UNPACK_ROW_LENGTH,yt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Vt),D.pixelStorei(D.UNPACK_SKIP_ROWS,ct),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Te),W===0&&G.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),Ee.unbindTexture()},this.copyTextureToTexture3D=function(T,G,K=null,j=null,W=0){T.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),K=arguments[0]||null,j=arguments[1]||null,T=arguments[2],G=arguments[3],W=arguments[4]||0);let de,pe,ye,Me,Oe,He,Le,lt,yt;const xt=T.isCompressedTexture?T.mipmaps[W]:T.image;K!==null?(de=K.max.x-K.min.x,pe=K.max.y-K.min.y,ye=K.max.z-K.min.z,Me=K.min.x,Oe=K.min.y,He=K.min.z):(de=xt.width,pe=xt.height,ye=xt.depth,Me=0,Oe=0,He=0),j!==null?(Le=j.x,lt=j.y,yt=j.z):(Le=0,lt=0,yt=0);const Vt=ze.convert(G.format),ct=ze.convert(G.type);let Te;if(G.isData3DTexture)Be.setTexture3D(G,0),Te=D.TEXTURE_3D;else if(G.isDataArrayTexture||G.isCompressedArrayTexture)Be.setTexture2DArray(G,0),Te=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,G.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,G.unpackAlignment);const Mt=D.getParameter(D.UNPACK_ROW_LENGTH),ot=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Wt=D.getParameter(D.UNPACK_SKIP_PIXELS),bn=D.getParameter(D.UNPACK_SKIP_ROWS),Xt=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,xt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Me),D.pixelStorei(D.UNPACK_SKIP_ROWS,Oe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,He),T.isDataTexture||T.isData3DTexture?D.texSubImage3D(Te,W,Le,lt,yt,de,pe,ye,Vt,ct,xt.data):G.isCompressedArrayTexture?D.compressedTexSubImage3D(Te,W,Le,lt,yt,de,pe,ye,Vt,xt.data):D.texSubImage3D(Te,W,Le,lt,yt,de,pe,ye,Vt,ct,xt),D.pixelStorei(D.UNPACK_ROW_LENGTH,Mt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ot),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Wt),D.pixelStorei(D.UNPACK_SKIP_ROWS,bn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Xt),W===0&&G.generateMipmaps&&D.generateMipmap(Te),Ee.unbindTexture()},this.initRenderTarget=function(T){De.get(T).__webglFramebuffer===void 0&&Be.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Be.setTextureCube(T,0):T.isData3DTexture?Be.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Be.setTexture2DArray(T,0):Be.setTexture2D(T,0),Ee.unbindTexture()},this.resetState=function(){U=0,P=0,E=null,Ee.reset(),Ye.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Ga?"display-p3":"srgb",t.unpackColorSpace=ut.workingColorSpace===ps?"display-p3":"srgb"}}class Hr extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class xo extends Lt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=1003,d=1003,u,h){super(null,a,o,l,c,d,i,s,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Cc extends vn{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ar=new dt,Rc=new dt,Vs=[],Pc=new ui,uv=new dt,Gr=new Ge,Vr=new Nr;class hv extends Ge{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Cc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,uv)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ar),Pc.copy(e.boundingBox).applyMatrix4(ar),this.boundingBox.union(Pc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Nr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ar),Vr.copy(e.boundingSphere).applyMatrix4(ar),this.boundingSphere.union(Vr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Gr.geometry=this.geometry,Gr.material=this.material,Gr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vr.copy(this.boundingSphere),Vr.applyMatrix4(n),e.ray.intersectsSphere(Vr)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ar),Rc.multiplyMatrices(n,ar),Gr.matrixWorld=Rc,Gr.raycast(e,Vs);for(let a=0,o=Vs.length;a<o;a++){const l=Vs[a];l.instanceId=s,l.object=this,t.push(l)}Vs.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Cc(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new xo(new Float32Array(i*this.count),i,this.count,1028,1015));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class bo extends Lt{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class En{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);const d=n[i],h=n[i+1]-d,f=(a-d)/h;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new he:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new R,i=[],s=[],a=[],o=new R,l=new dt;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new R)}s[0]=new R,a[0]=new R;let c=Number.MAX_VALUE;const d=Math.abs(i[0].x),u=Math.abs(i[0].y),h=Math.abs(i[0].z);d<=c&&(c=d,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(It(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(It(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class _o extends En{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new he){const n=t,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*d-f*u+this.aX,c=h*u+f*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class fv extends _o{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function So(){let r=0,e=0,t=0,n=0;function i(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,d,u){let h=(a-s)/c-(o-s)/(c+d)+(o-a)/d,f=(o-a)/d-(l-a)/(d+u)+(l-o)/u;h*=d,f*=d,i(a,o,h,f)},calc:function(s){const a=s*s,o=a*s;return r+e*s+t*a+n*o}}}const Ws=new R,wo=new So,Mo=new So,Eo=new So;class pv extends En{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new R){const n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,d;this.closed||o>0?c=i[(o-1)%s]:(Ws.subVectors(i[0],i[1]).add(i[0]),c=Ws);const u=i[o%s],h=i[(o+1)%s];if(this.closed||o+2<s?d=i[(o+2)%s]:(Ws.subVectors(i[s-1],i[s-2]).add(i[s-1]),d=Ws),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(d),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),wo.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,g,v,m),Mo.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,g,v,m),Eo.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,g,v,m)}else this.curveType==="catmullrom"&&(wo.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),Mo.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),Eo.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return n.set(wo.calc(l),Mo.calc(l),Eo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new R().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Ic(r,e,t,n,i){const s=(n-e)*.5,a=(i-t)*.5,o=r*r,l=r*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*r+t}function mv(r,e){const t=1-r;return t*t*e}function gv(r,e){return 2*(1-r)*r*e}function vv(r,e){return r*r*e}function Wr(r,e,t,n){return mv(r,e)+gv(r,t)+vv(r,n)}function yv(r,e){const t=1-r;return t*t*t*e}function xv(r,e){const t=1-r;return 3*t*t*r*e}function bv(r,e){return 3*(1-r)*r*r*e}function _v(r,e){return r*r*r*e}function Xr(r,e,t,n,i){return yv(r,e)+xv(r,t)+bv(r,n)+_v(r,i)}class Lc extends En{constructor(e=new he,t=new he,n=new he,i=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new he){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Xr(e,i.x,s.x,a.x,o.x),Xr(e,i.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Sv extends En{constructor(e=new R,t=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new R){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Xr(e,i.x,s.x,a.x,o.x),Xr(e,i.y,s.y,a.y,o.y),Xr(e,i.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class kc extends En{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class wv extends En{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Uc extends En{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Wr(e,i.x,s.x,a.x),Wr(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Mv extends En{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Wr(e,i.x,s.x,a.x),Wr(e,i.y,s.y,a.y),Wr(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Dc extends En{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){const n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],d=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Ic(o,l.x,c.x,d.x,u.x),Ic(o,l.y,c.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new he().fromArray(i))}return this}}var Nc=Object.freeze({__proto__:null,ArcCurve:fv,CatmullRomCurve3:pv,CubicBezierCurve:Lc,CubicBezierCurve3:Sv,EllipseCurve:_o,LineCurve:kc,LineCurve3:wv,QuadraticBezierCurve:Uc,QuadraticBezierCurve3:Mv,SplineCurve:Dc});class Ev extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nc[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const a=i[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const a=s[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Nc[i.type]().fromJSON(i))}return this}}class $r extends Ev{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new kc(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new Uc(this.currentPoint.clone(),new he(e,t),new he(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){const o=new Lc(this.currentPoint.clone(),new he(e,t),new he(n,i),new he(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Dc(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,o,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,i,s,a,o,l),this}absellipse(e,t,n,i,s,a,o,l){const c=new _o(e,t,n,i,s,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class To extends $r{constructor(e){super(e),this.uuid=ci(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new $r().fromJSON(i))}return this}}const Tv={triangulate:function(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=Fc(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,d,u,h,f;if(n&&(s=Iv(r,e,s,t)),r.length>80*t){o=c=r[0],l=d=r[1];for(let g=t;g<i;g+=t)u=r[g],h=r[g+1],u<o&&(o=u),h<l&&(l=h),u>c&&(c=u),h>d&&(d=h);f=Math.max(c-o,d-l),f=f!==0?32767/f:0}return Yr(s,a,t,o,l,f,0),a}};function Fc(r,e,t,n,i){let s,a;if(i===Gv(r,e,t,n)>0)for(s=e;s<t;s+=n)a=zc(s,r[s],r[s+1],a);else for(s=t-n;s>=e;s-=n)a=zc(s,r[s],r[s+1],a);return a&&Xs(a,a.next)&&(Zr(a),a=a.next),a}function Si(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(Xs(t,t.next)||bt(t.prev,t,t.next)===0)){if(Zr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Yr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&Nv(r,n,i,s);let o=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?Cv(r,n,i,s):Av(r)){e.push(l.i/t|0),e.push(r.i/t|0),e.push(c.i/t|0),Zr(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=Rv(Si(r),e,t),Yr(r,e,t,n,i,s,2)):a===2&&Pv(r,e,t,n,i,s):Yr(Si(r),e,t,n,i,s,1);break}}}function Av(r){const e=r.prev,t=r,n=r.next;if(bt(e,t,n)>=0)return!1;const i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,d=i<s?i<a?i:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,h=i>s?i>a?i:a:s>a?s:a,f=o>l?o>c?o:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=h&&g.y>=u&&g.y<=f&&or(i,o,s,l,a,c,g.x,g.y)&&bt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Cv(r,e,t,n){const i=r.prev,s=r,a=r.next;if(bt(i,s,a)>=0)return!1;const o=i.x,l=s.x,c=a.x,d=i.y,u=s.y,h=a.y,f=o<l?o<c?o:c:l<c?l:c,g=d<u?d<h?d:h:u<h?u:h,v=o>l?o>c?o:c:l>c?l:c,m=d>u?d>h?d:h:u>h?u:h,p=Ao(f,g,e,t,n),S=Ao(v,m,e,t,n);let y=r.prevZ,b=r.nextZ;for(;y&&y.z>=p&&b&&b.z<=S;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==i&&y!==a&&or(o,d,l,u,c,h,y.x,y.y)&&bt(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==i&&b!==a&&or(o,d,l,u,c,h,b.x,b.y)&&bt(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==i&&y!==a&&or(o,d,l,u,c,h,y.x,y.y)&&bt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=S;){if(b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==i&&b!==a&&or(o,d,l,u,c,h,b.x,b.y)&&bt(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Rv(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!Xs(i,s)&&Oc(i,n,n.next,s)&&qr(i,s)&&qr(s,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Zr(n),Zr(n.next),n=r=s),n=n.next}while(n!==r);return Si(n)}function Pv(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Bv(a,o)){let l=Bc(a,o);a=Si(a,a.next),l=Si(l,l.next),Yr(a,e,t,n,i,s,0),Yr(l,e,t,n,i,s,0);return}o=o.next}a=a.next}while(a!==r)}function Iv(r,e,t,n){const i=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=Fc(r,o,l,n,!1),c===c.next&&(c.steiner=!0),i.push(Ov(c));for(i.sort(Lv),s=0;s<i.length;s++)t=kv(i[s],t);return t}function Lv(r,e){return r.x-e.x}function kv(r,e){const t=Uv(r,e);if(!t)return e;const n=Bc(t,r);return Si(n,n.next),Si(t,t.next)}function Uv(r,e){let t=e,n=-1/0,i;const s=r.x,a=r.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const h=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=s&&h>n&&(n=h,i=t.x<t.next.x?t:t.next,h===s))return i}t=t.next}while(t!==e);if(!i)return null;const o=i,l=i.x,c=i.y;let d=1/0,u;t=i;do s>=t.x&&t.x>=l&&s!==t.x&&or(a<c?s:n,a,l,c,a<c?n:s,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(s-t.x),qr(t,r)&&(u<d||u===d&&(t.x>i.x||t.x===i.x&&Dv(i,t)))&&(i=t,d=u)),t=t.next;while(t!==o);return i}function Dv(r,e){return bt(r.prev,r,e.prev)<0&&bt(e.next,r,r.next)<0}function Nv(r,e,t,n){let i=r;do i.z===0&&(i.z=Ao(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Fv(i)}function Fv(r){let e,t,n,i,s,a,o,l,c=1;do{for(t=r,r=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,c*=2}while(a>1);return r}function Ao(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function Ov(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function or(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function Bv(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!zv(r,e)&&(qr(r,e)&&qr(e,r)&&Hv(r,e)&&(bt(r.prev,r,e.prev)||bt(r,e.prev,e))||Xs(r,e)&&bt(r.prev,r,r.next)>0&&bt(e.prev,e,e.next)>0)}function bt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Xs(r,e){return r.x===e.x&&r.y===e.y}function Oc(r,e,t,n){const i=Ys(bt(r,e,t)),s=Ys(bt(r,e,n)),a=Ys(bt(t,n,r)),o=Ys(bt(t,n,e));return!!(i!==s&&a!==o||i===0&&$s(r,t,e)||s===0&&$s(r,n,e)||a===0&&$s(t,r,n)||o===0&&$s(t,e,n))}function $s(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Ys(r){return r>0?1:r<0?-1:0}function zv(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Oc(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function qr(r,e){return bt(r.prev,r,r.next)<0?bt(r,e,r.next)>=0&&bt(r,r.prev,e)>=0:bt(r,e,r.prev)<0||bt(r,r.next,e)<0}function Hv(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Bc(r,e){const t=new Co(r.i,r.x,r.y),n=new Co(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function zc(r,e,t,n){const i=new Co(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Zr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Co(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Gv(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class Kr{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return Kr.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Hc(e),Gc(n,e);let a=e.length;t.forEach(Hc);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Gc(n,t[l]);const o=Tv.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Hc(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Gc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class qs extends wn{constructor(e=new To([new he(0,.5),new he(-.5,-.5),new he(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let d=0;d<e.length;d++)c(e[d]),this.addGroup(o,l,d),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Yt(i,3)),this.setAttribute("normal",new Yt(s,3)),this.setAttribute("uv",new Yt(a,2));function c(d){const u=i.length/3,h=d.extractPoints(t);let f=h.shape;const g=h.holes;Kr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const S=g[m];Kr.isClockWise(S)===!0&&(g[m]=S.reverse())}const v=Kr.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const S=g[m];f=f.concat(S)}for(let m=0,p=f.length;m<p;m++){const S=f[m];i.push(S.x,S.y,0),s.push(0,0,1),a.push(S.x,S.y)}for(let m=0,p=v.length;m<p;m++){const S=v[m],y=S[0]+u,b=S[1]+u,U=S[2]+u;n.push(y,b,U),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Vv(t,e)}static fromJSON(e,t){const n=[];for(let i=0,s=e.shapes.length;i<s;i++){const a=t[e.shapes[i]];n.push(a)}return new qs(n,e.curveSegments)}}function Vv(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){const i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}class Ro extends wn{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const d=[],u=new R,h=new R,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const S=[],y=p/n;let b=0;p===0&&a===0?b=.5/t:p===n&&l===Math.PI&&(b=-.5/t);for(let U=0;U<=t;U++){const P=U/t;u.x=-e*Math.cos(i+P*s)*Math.sin(a+y*o),u.y=e*Math.cos(a+y*o),u.z=e*Math.sin(i+P*s)*Math.sin(a+y*o),g.push(u.x,u.y,u.z),h.copy(u).normalize(),v.push(h.x,h.y,h.z),m.push(P+b,1-y),S.push(c++)}d.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){const y=d[p][S+1],b=d[p][S],U=d[p+1][S],P=d[p+1][S+1];(p!==0||a>0)&&f.push(y,b,P),(p!==n-1||l<Math.PI)&&f.push(b,U,P)}this.setIndex(f),this.setAttribute("position",new Yt(g,3)),this.setAttribute("normal",new Yt(v,3)),this.setAttribute("uv",new Yt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ro(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Wv extends Ft{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class yn extends Or{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Vc extends yn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new he(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return It(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Pe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Pe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Pe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}const lr={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class Wc{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(d){o++,s===!1&&i.onStart!==void 0&&i.onStart(d,a,o),s=!0},this.itemEnd=function(d){a++,i.onProgress!==void 0&&i.onProgress(d,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(d){i.onError!==void 0&&i.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,u){return c.push(d,u),this},this.removeHandler=function(d){const u=c.indexOf(d);return u!==-1&&c.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=c.length;u<h;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(d))return g}return null}}}const Xc=new Wc;class Zs{constructor(e){this.manager=e!==void 0?e:Xc,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Zs.DEFAULT_MATERIAL_NAME="__DEFAULT";class Xv extends Zs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=lr.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=kr("img");function l(){d(),lr.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){d(),i&&i(u),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class $c extends Zs{constructor(e){super(e)}load(e,t,n,i){const s=new Lt,a=new Xv(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class cr extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class $v extends cr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Po=new dt,Yc=new R,qc=new R;class Io{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lo,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Yc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yc),qc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qc),t.updateMatrixWorld(),Po.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Po),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Po)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Yv extends Io{constructor(){super(new Ht(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Fi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class qv extends cr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Yv}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Zc=new dt,jr=new R,Lo=new R;class Zv extends Io{constructor(){super(new Ht(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new he(4,2),this._viewportCount=6,this._viewports=[new vt(2,1,1,1),new vt(0,1,1,1),new vt(3,1,1,1),new vt(1,1,1,1),new vt(3,0,1,1),new vt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),jr.setFromMatrixPosition(e.matrixWorld),n.position.copy(jr),Lo.copy(n.position),Lo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Lo),n.updateMatrixWorld(),i.makeTranslation(-jr.x,-jr.y,-jr.z),Zc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zc)}}class Kc extends cr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Zv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Kv extends Io{constructor(){super(new Os(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jc extends cr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new Kv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class jv extends cr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Qc extends cr{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class Qv extends Zs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=lr.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return lr.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),lr.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});lr.add(e,l),s.manager.itemStart(e)}}class Jv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Jc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Jc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Jc(){return(typeof performance=="undefined"?Date:performance).now()}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Un}})),typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Un);const e0=r=>r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"),Ks=({title:r,width:e,height:t,background:n,accent:i,secondary:s,horizonPercent:a=58})=>{const o=Math.max(e,t),l=Math.min(e,t),c=t*(a/100),d=e*.06,u=t*.92,h=o*.035,f=o*.004,g=o*.012,v=o*.005,m=l*.11,p=e0(r),S=`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${n}"/>
      <stop offset="0.52" stop-color="${s}"/>
      <stop offset="1" stop-color="${i}"/>
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
</svg>`;return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(S)}`},ed=[{id:"electric-storm",title:"Electric Storm",subtitle:"Artwork 01",description:"Eine ruhige immersive digitale Kunstpräsentation mit realistischer Materialität und hochwertiger Lichtführung.",year:2025,medium:"Digital painting · 2400 × 1600",image:Ks({title:"Electric Storm",width:2400,height:1600,background:"#dfe5e9",secondary:"#9fb0ba",accent:"#c8b690",horizonPercent:54}),dimensions:{width:2400,height:1600},alt:"Abstrakte Landschaft mit weichen Wolken über einem warm getönten Horizont.",credit:"Freyraum Studio",tags:["landscape","soft-light","warm"],surface:"Matte Leinwand",presentation:"canvas"},{id:"quiet-coastline",title:"Quiet Coastline",subtitle:"Artwork 02",description:"Minimalistische Küstenkomposition mit fein ausgearbeiteter Materialstruktur.",year:2025,medium:"Digital painting · 1800 × 2400",image:Ks({title:"Quiet Coastline",width:1800,height:2400,background:"#eef1f3",secondary:"#c9d4d8",accent:"#a6b4ae",horizonPercent:62}),dimensions:{width:1800,height:2400},alt:"Hochformatige minimalistische Küstenszene in gedämpften Grautönen.",credit:"Freyraum Studio",tags:["portrait","coast","minimal"],surface:"Matte Leinwand",presentation:"canvas"},{id:"tokyo-passage",title:"Tokyo Passage",subtitle:"Artwork 03",description:"Cinematische urbane Perspektiven mit dramatischem Streiflicht.",year:2025,medium:"Digital painting · 2100 × 2100",image:Ks({title:"Tokyo Passage",width:2100,height:2100,background:"#e8e3da",secondary:"#b8c1c5",accent:"#8b9497",horizonPercent:48}),dimensions:{width:2100,height:2100},alt:"Quadratische urbane Szene mit dramatischem Streiflicht in kühlen Tönen.",credit:"Freyraum Studio",tags:["square","urban","cinematic"],surface:"Satinierte Leinwand",presentation:"canvas"},{id:"golden-desert",title:"Golden Desert",subtitle:"Artwork 04",description:"Atmosphärische Lichtstimmung kombiniert mit realistischer Leinwandstruktur.",year:2025,medium:"Digital painting · 2800 × 1200",image:Ks({title:"Golden Desert",width:2800,height:1200,background:"#f0ece4",secondary:"#d8c7a5",accent:"#a98f6d",horizonPercent:57}),dimensions:{width:2800,height:1200},alt:"Ultra-breite Wüstenkomposition in goldenen und sandfarbenen Tönen.",credit:"Freyraum Studio",tags:["ultrawide","desert","warm"],surface:"Matte Leinwand",presentation:"canvas"}],Qr={high:{id:"high",label:"Hoch",description:"Volle Detailtiefe für moderne dedizierte GPUs.",pixelRatioCap:1.6,bloomStrength:.04,bloomRadius:.36,bloomThreshold:1.2,shadows:!0,artworkSegments:180,shaderVariant:"painting-high",normalStrength:.7,detailNormalStrength:.6,bumpStrength:0,specularStrength:.28,anisotropyDivisor:1,aoEnabled:!0,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:1024,proceduralInspectionTileSize:2048,parallaxEnabled:!0,parallaxSteps:10,parallaxScale:.012,selfShadowEnabled:!0,selfShadowSteps:6,selfShadowStrength:.3,selfShadowBias:.05,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:.002,clearcoatEnabled:!0,clearcoatStrength:.12,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0,hubReflection:"planar",hubReflectionDivisor:2,hubSurfaceTileSize:1024,hubShadows:!0},balanced:{id:"balanced",label:"Ausgewogen",description:"Empfohlen für die meisten Laptops und Tablets.",pixelRatioCap:1.25,bloomStrength:.03,bloomRadius:.3,bloomThreshold:1.25,shadows:!0,artworkSegments:120,shaderVariant:"painting-balanced",normalStrength:.45,detailNormalStrength:.4,bumpStrength:.025,specularStrength:.3,anisotropyDivisor:2,aoEnabled:!1,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:512,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0,hubReflection:"ibl",hubReflectionDivisor:3,hubSurfaceTileSize:512,hubShadows:!0},battery:{id:"battery",label:"Akkusparend",description:"Für integrierte GPUs und Akkubetrieb.",pixelRatioCap:1,bloomStrength:0,bloomRadius:.28,bloomThreshold:1.2,shadows:!1,artworkSegments:48,shaderVariant:"painting-battery",normalStrength:.25,detailNormalStrength:0,bumpStrength:0,specularStrength:0,anisotropyDivisor:4,aoEnabled:!1,grazingBoostEnabled:!1,detailNormalEnabled:!1,proceduralTileSize:256,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:0,fxaaEnabled:!1,albedoFidelityFill:0,hubReflection:"off",hubReflectionDivisor:4,hubSurfaceTileSize:256,hubShadows:!1}},td="balanced";function Jr(r){var e;return(e=Qr[r])!=null?e:Qr[td]}function dr(r=1.8){var i,s,a;const e=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,n=((a=(s=(i=window.matchMedia)==null?void 0:i.call(window,"(pointer: coarse)"))==null?void 0:s.matches)!=null?a:!1)?Math.min(r,1.5):r;return Math.min(e,n)}const t0=.5,n0=2;function i0(){var l,c,d;const r=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,e=(d=(c=(l=window.matchMedia)==null?void 0:l.call(window,"(pointer: coarse)"))==null?void 0:c.matches)!=null?d:!1,t=window.innerWidth*window.innerHeight,n=6e5,i=8e5,s=navigator,a=typeof s.deviceMemory=="number"?s.deviceMemory:void 0,o=typeof s.hardwareConcurrency=="number"?s.hardwareConcurrency:void 0;return a!==void 0&&a<=t0||o!==void 0&&o<=n0||e&&r>=2&&t<n?"battery":(e&&t<i,"balanced")}const nd="freyraum.diagnostics.mode",id=500,r0=2500,ur={debug:10,info:20,warn:30,error:40};function rd(r){if(!r)return null;const e=r.trim().toLowerCase();return e==="1"||e==="true"||e==="info"?"info":e==="verbose"||e==="2"?"verbose":e==="0"||e==="false"||e==="default"?"default":null}function s0(){try{const r=new URLSearchParams(window.location.search);return rd(r.get("debug"))}catch(r){return null}}function a0(){try{return rd(localStorage.getItem(nd))}catch(r){return null}}function o0(r){try{localStorage.setItem(nd,r)}catch(e){}}function l0(r){switch(r){case"verbose":return"debug";case"info":return"info";default:return"warn"}}function ko(r,e=0,t){if(r==null)return r;if(e>3)return"[max-depth]";if(typeof r=="function")return`[function ${r.name||"anonymous"}]`;if(typeof r=="bigint"||typeof r=="symbol")return r.toString();if(r instanceof Error)return{name:r.name,message:r.message,stack:r.stack};if(Array.isArray(r))return r.map(n=>ko(n,e+1,t));if(typeof r=="object"){const n=r,i=t!=null?t:new WeakSet;if(i.has(n))return"[circular]";i.add(n);const s={};for(const[a,o]of Object.entries(n))s[a]=ko(o,e+1,i);return s}return r}class c0{constructor(){x(this,"startedAt",performance.now());x(this,"startedAtIso",new Date().toISOString());x(this,"entries",[]);x(this,"nextId",1);x(this,"mode");x(this,"dedupe",new Map);x(this,"globalHandlersInstalled",!1);x(this,"handlingGlobalError",!1);var e,t;this.mode=(t=(e=s0())!=null?e:a0())!=null?t:"default",typeof window!="undefined"&&(window.__FREYRAUM_DIAGNOSTICS__=this.publicApi())}getMode(){return this.mode}setMode(e){this.mode=e,o0(e),this.info("diagnostics","mode-changed",`Diagnostics mode set to ${e}`)}installGlobalHandlers(){this.globalHandlersInstalled||typeof window=="undefined"||(this.globalHandlersInstalled=!0,window.addEventListener("error",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","uncaught-error",e.message||"Uncaught window error",{filename:e.filename,lineno:e.lineno,colno:e.colno,error:e.error})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle global window error",t)}finally{this.handlingGlobalError=!1}}}),window.addEventListener("unhandledrejection",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","unhandled-rejection","Unhandled promise rejection",{reason:e.reason})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle unhandled rejection",t)}finally{this.handlingGlobalError=!1}}}))}debug(e,t,n,i){this.push("debug",e,t,n,i)}info(e,t,n,i){this.push("info",e,t,n,i)}warn(e,t,n,i){this.push("warn",e,t,n,i)}error(e,t,n,i){this.push("error",e,t,n,i)}child(e){return new d0(this,e)}getEntries(){return this.entries}clear(){this.entries=[],this.dedupe.clear()}snapshot(){return{sessionStartedAt:this.startedAtIso,mode:this.mode,entries:this.entries}}print(e="info"){const t=ur[e];for(const n of this.entries)ur[n.level]<t||this.printEntry(n)}exportJson(){return JSON.stringify(this.snapshot(),null,2)}summarize(){const e=new Map;for(const t of this.entries){const n=`[${t.scope}] ${t.event}`,i=e.get(n);i?(i.count+=t.repeatCount,i.lastMessage=t.message,i.lastMs=t.relativeMs,ur[t.level]>ur[i.level]&&(i.level=t.level)):e.set(n,{count:t.repeatCount,level:t.level,lastMessage:t.message,lastMs:t.relativeMs})}console.group("[freyraum] Diagnostics summary");for(const[t,n]of e){const i=`${t} (×${n.count}, last +${n.lastMs}ms) — ${n.lastMessage}`;n.level==="error"?console.error(i):n.level==="warn"?console.warn(i):n.level==="info"?console.info(i):console.debug(i)}console.groupEnd()}publicApi(){return{getMode:()=>this.getMode(),setMode:e=>this.setMode(e),getEntries:()=>this.getEntries(),clear:()=>this.clear(),print:e=>this.print(e),snapshot:()=>this.snapshot(),exportJson:()=>this.exportJson(),summarize:()=>this.summarize()}}isLevelEnabled(e){return e!=="debug"||this.mode==="verbose"}push(e,t,n,i,s){if(!this.isLevelEnabled(e))return;const a=performance.now(),o=`${e}|${t}|${n}|${i}`,l=this.dedupe.get(o);if(l&&a-l.lastSeen<r0){const u=this.entries.find(h=>h.id===l.entryId);if(u){u.repeatCount+=1,l.lastSeen=a;return}}let c;try{const u=typeof s=="function"?s():s;c=u===void 0?void 0:ko(u)}catch(u){c={serializationError:u instanceof Error?u.message:String(u)}}const d={id:this.nextId++,timestamp:new Date().toISOString(),relativeMs:Math.round(a-this.startedAt),level:e,scope:t,event:n,message:i,data:c,repeatCount:1};if(this.entries.push(d),this.entries.length>id&&(this.entries=this.entries.slice(-id)),this.dedupe.set(o,{entryId:d.id,lastSeen:a}),ur[e]>=ur[l0(this.mode)])try{this.printEntry(d)}catch(u){console.error("[freyraum][diagnostics][error] Failed to print diagnostic entry",u)}}printEntry(e){const t=`[freyraum][${e.scope}][${e.level}] +${e.relativeMs}ms ${e.message}`,n={event:e.event};e.repeatCount>1&&(n.repeats=e.repeatCount);const i=e.data!==void 0,s=e.level==="error"?console.error:e.level==="warn"?console.warn:e.level==="info"?console.info:console.debug;if(i)try{console.groupCollapsed(t,n),s("data:",e.data),console.groupEnd()}catch(a){s(t,n,e.data)}else try{s(t,n)}catch(a){console.log(t,n)}}}class d0{constructor(e,t){this.diagnostics=e,this.scope=t}isDebugEnabled(){return this.diagnostics.isLevelEnabled("debug")}debug(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}debugLazy(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}info(e,t,n){this.diagnostics.info(this.scope,e,t,n)}warn(e,t,n){this.diagnostics.warn(this.scope,e,t,n)}error(e,t,n){this.diagnostics.error(this.scope,e,t,n)}}const sd=new c0;function hr(){return sd}function rn(r){return sd.child(r)}class u0 extends Error{constructor(t,n){super("WebGL renderer initialization failed");x(this,"attempts");x(this,"causeMessage");this.name="WebGLRendererCreationError",this.attempts=t,this.causeMessage=n instanceof Error?n.message:String(n!=null?n:"unknown")}}const h0={createCanvas:()=>document.createElement("canvas"),createRenderer:r=>new dv(r)};function ad(r){var e;(e=r==null?void 0:r.getExtension("WEBGL_lose_context"))==null||e.loseContext()}function od(r={},e=h0){const t=[];let n;const i=[{mode:"preferred",parameters:{...r,antialias:!0,powerPreference:"high-performance"}},{mode:"compatibility",parameters:{...r,antialias:!1,powerPreference:"default",depth:!0,stencil:!1,failIfMajorPerformanceCaveat:!1}},{mode:"battery",parameters:{...r,antialias:!1,powerPreference:"low-power",depth:!0,stencil:!1,failIfMajorPerformanceCaveat:!1}}];for(const s of i){t.push(s.mode);const a=e.createCanvas();let o=null;try{if(o=a.getContext("webgl2",s.parameters),!o)throw new Error("WebGL 2 context creation returned null");return{renderer:e.createRenderer({...s.parameters,canvas:a,context:o}),mode:s.mode,attempts:[...t]}}catch(l){n=l,ad(o)}}throw new u0(t,n)}function ld(r){var t,n;const e=r.getContext().getContextAttributes();return{version:"webgl2",antialias:(t=e==null?void 0:e.antialias)!=null?t:!1,powerPreference:(n=e==null?void 0:e.powerPreference)!=null?n:"default"}}const fr=rn("renderer");class f0{constructor(e,t,n="#c7ced4"){x(this,"renderer");x(this,"rendererMode");x(this,"preset");x(this,"wallClearColor");x(this,"renderPaused",!1);x(this,"disposed",!1);x(this,"contextChangeCallback",null);x(this,"_sizeScratch",new he);x(this,"onContextLost",e=>{var t;e.preventDefault(),this.renderPaused=!0,(t=this.contextChangeCallback)==null||t.call(this,"lost"),fr.warn("context-lost","WebGL context lost; render paused until restoration",{width:this.renderer.domElement.width,height:this.renderer.domElement.height})});x(this,"onContextRestored",()=>{var e;this.renderPaused=!1,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(this.rendererMode==="preferred"?dr(this.preset.pixelRatioCap):1),this.renderer.setClearColor(new Pe(this.wallClearColor)),(e=this.contextChangeCallback)==null||e.call(this,"restored"),fr.info("context-restored","WebGL context restored",{})});this.preset=t,this.wallClearColor=n;const i=od();this.renderer=i.renderer,this.rendererMode=i.mode,this.renderer.setPixelRatio(i.mode==="preferred"?dr(t.pixelRatioCap):1),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=Ot,this.renderer.toneMapping=0,this.renderer.toneMappingExposure=1,this.renderer.setClearColor(new Pe(this.wallClearColor)),this.renderer.shadowMap.enabled=t.shadows&&i.mode==="preferred",this.renderer.shadowMap.type=2,this.applyQualityDataAttribute(t.id);const s=this.renderer.domElement;s.addEventListener("webglcontextlost",this.onContextLost,!1),s.addEventListener("webglcontextrestored",this.onContextRestored,!1),e.appendChild(s),fr.info("created","WebGL renderer initialized",{mode:i.mode,attempts:i.attempts,context:ld(this.renderer),protocol:window.location.protocol})}applyPreset(e){this.preset=e,this.renderer.setPixelRatio(this.rendererMode==="preferred"?dr(e.pixelRatioCap):1),this.renderer.shadowMap.enabled=e.shadows&&this.rendererMode==="preferred",this.applyQualityDataAttribute(e.id)}setWallClearColor(e){this.wallClearColor=e,this.renderer.setClearColor(new Pe(this.wallClearColor))}resize(e,t){this.renderer.setSize(Math.max(1,e),Math.max(1,t)),this.renderer.setPixelRatio(this.rendererMode==="preferred"?dr(this.preset.pixelRatioCap):1)}isRenderPaused(){return this.renderPaused}onContextChange(e){this.contextChangeCallback=e}async prewarm(e,t){const n=this.renderer;try{typeof n.compileAsync=="function"?(await n.compileAsync(e,t),fr.debug("prewarm-async","Shader programs pre-warmed via compileAsync()",{preset:this.preset.id})):(n.compile(e,t),fr.debug("prewarm-sync","Shader programs pre-warmed via compile()",{preset:this.preset.id}))}catch(i){fr.warn("prewarm-failed","Shader pre-warm failed; continuing normally",{message:i instanceof Error?i.message:String(i)})}}getRendererSnapshot(){var n,i;const e=this.renderer.info,t=this._sizeScratch;return this.renderer.getSize(t),{drawCalls:e.render.calls,triangles:e.render.triangles,points:e.render.points,lines:e.render.lines,geometries:e.memory.geometries,textures:e.memory.textures,programs:(i=(n=e.programs)==null?void 0:n.length)!=null?i:0,pixelRatio:this.renderer.getPixelRatio(),width:t.x,height:t.y,renderPaused:this.renderPaused,preset:this.preset.id}}applyQualityDataAttribute(e){try{typeof document!="undefined"&&document.documentElement&&(document.documentElement.dataset.quality=e)}catch(t){}}dispose(){if(this.disposed)return;this.disposed=!0;const e=this.renderer.domElement;e.removeEventListener("webglcontextlost",this.onContextLost,!1),e.removeEventListener("webglcontextrestored",this.onContextRestored,!1),this.contextChangeCallback=null,this.renderer.dispose()}}const es={artworkBodyDepth:.04,artworkWallGap:.14,artworkBodyFrontClearance:.002,artworkWallZ:-.18200000000000002,roomHalfWidth:18,roomRearZ:24,floorY:-6.6,ceilingY:7.2,skirtingHeight:.08,skirtingDepth:.018,revealDepth:.14,revealDrop:.16,lightStripDepth:.22,lightStripLift:.006},cd=2.6,dd=1.9,js=Object.freeze({wallColor:"#f3f3ef",wallRoughness:.86,ceilingRoughness:.93,floorRoughness:.6,colorVariation:0,roughnessVariation:0,wallNormalStrength:0,floorNormalStrength:0,floorColorVariation:0});class ud{constructor(e,t="gallery"){x(this,"textureCache",new Map);x(this,"materials",null);x(this,"tileSize");x(this,"anisotropy",1);x(this,"surfaceProfile");this.tileSize=Math.max(64,e|0),this.surfaceProfile=t}getMaterials(e){if(this.materials)return this.materials;const t=this.surfaceProfile==="hub"?new Pe(js.wallColor):new Pe(e.wall),n=t.clone().multiplyScalar(1.04),i=this.surfaceProfile==="hub"?new Pe("#d2d4d3"):t.clone().multiplyScalar(.82).lerp(new Pe("#aab2ba"),.18),s=this.surfaceProfile==="gallery"?this.detailTexture("plasterNormal"):null,a=this.surfaceProfile==="gallery"?this.detailTexture("plasterRoughness"):null,o=this.surfaceProfile==="gallery"?this.detailTexture("floorNormal"):null,l=this.surfaceProfile==="gallery"?this.detailTexture("floorRoughness"):null,c=new yn({color:t,roughness:this.surfaceProfile==="hub"?js.wallRoughness:.965,metalness:0,normalMap:this.surfaceProfile==="gallery"?s:null,normalScale:new he(this.surfaceProfile==="gallery"?.14:0,this.surfaceProfile==="gallery"?.14:0),roughnessMap:a});this.surfaceProfile==="hub"&&(c.userData.architecturalSurfaceProfile="hub-smooth-plaster");const d=new yn({color:n,roughness:this.surfaceProfile==="hub"?js.ceilingRoughness:.97,metalness:0,normalMap:s,normalScale:new he(this.surfaceProfile==="gallery"?.06:0,this.surfaceProfile==="gallery"?.06:0)});this.surfaceProfile==="hub"&&(d.userData.architecturalSurfaceProfile="hub-matte-ceiling");const u=new yn({color:i,roughness:this.surfaceProfile==="hub"?js.floorRoughness:.62,metalness:0,normalMap:o,normalScale:new he(this.surfaceProfile==="gallery"?.22:0,this.surfaceProfile==="gallery"?.22:0),roughnessMap:l,envMapIntensity:.5});this.surfaceProfile==="hub"&&(u.userData.architecturalSurfaceProfile="hub-satin-mineral");const h=new yn({color:new Pe("#31363a"),roughness:.58,metalness:.32}),f=new yn({color:new Pe(this.surfaceProfile==="hub"?"#8c8f8b":"#565b5e"),roughness:this.surfaceProfile==="hub"?.94:.96,metalness:0}),g=new Pe(this.surfaceProfile==="hub"?"#eef3f1":"#e8edef"),v=new yn({color:g,emissive:g,emissiveIntensity:this.surfaceProfile==="hub"?.72:.56,roughness:.48,metalness:0}),m=new yn({color:new Pe("#d8dde1"),roughness:.9,metalness:0});return this.materials={wall:c,ceiling:d,floor:u,trim:h,pocket:f,lightStrip:v,artworkEdge:m},this.materials}setTileSize(e){const t=Math.max(64,e|0);if(t===this.tileSize||(this.tileSize=t,!this.materials))return;const n=[...this.textureCache.values()];this.textureCache.clear(),this.surfaceProfile==="gallery"&&(this.materials.wall.normalMap=this.detailTexture("plasterNormal"),this.materials.wall.roughnessMap=this.detailTexture("plasterRoughness")),this.surfaceProfile==="gallery"&&(this.materials.ceiling.normalMap=this.detailTexture("plasterNormal"),this.materials.floor.normalMap=this.detailTexture("floorNormal"),this.materials.floor.roughnessMap=this.detailTexture("floorRoughness")),this.materials.wall.needsUpdate=!0,this.materials.ceiling.needsUpdate=!0,this.materials.floor.needsUpdate=!0;for(const i of n)i.dispose()}setAnisotropy(e){const t=Math.max(1,e|0);t!==this.anisotropy&&(this.anisotropy=t,this.textureCache.forEach(n=>{n.anisotropy=t,n.needsUpdate=!0}))}dispose(){if(this.textureCache.forEach(e=>e.dispose()),this.textureCache.clear(),this.materials){for(const e of Object.values(this.materials))e.dispose();this.materials=null}}detailTexture(e){const t=`${e}::${this.tileSize}`,n=this.textureCache.get(t);if(n)return n;let i;switch(e){case"plasterNormal":i=this.generateNormal(11,1.9,.42,.05),i.repeat.setScalar(1/cd);break;case"plasterRoughness":i=this.generateGrayscale(29,220,34,.62),i.repeat.setScalar(1/cd);break;case"floorNormal":i=this.generateNormal(53,3.4,.5,.02),i.repeat.setScalar(1/dd);break;case"floorRoughness":default:i=this.generateGrayscale(71,152,30,.85),i.repeat.setScalar(1/dd);break}return i.anisotropy=this.anisotropy,this.textureCache.set(t,i),i}generateNormal(e,t,n,i){const s=this.tileSize,a=4*t,o=13*t,l=new Float32Array(s*s);for(let d=0;d<s;d+=1)for(let u=0;u<s;u+=1){const h=u/s,f=d/s;l[d*s+u]=this.tileNoise(h,f,a,e)*(1-n)+this.tileNoise(h,f,o,e+7)*n}const c=new Uint8Array(s*s*4);for(let d=0;d<s;d+=1){const u=(d-1+s)%s,h=(d+1)%s;for(let f=0;f<s;f+=1){const g=(d*s+f)*4,v=(f-1+s)%s,m=(f+1)%s,p=(l[d*s+m]-l[d*s+v])*s*.5,S=(l[h*s+f]-l[u*s+f])*s*.5,y=-p*i,b=-S*i,U=1/Math.sqrt(y*y+b*b+1);c[g+0]=Qs(128+y*U*127),c[g+1]=Qs(128+b*U*127),c[g+2]=Qs(128+U*127),c[g+3]=255}}return this.makeTexture(c,s)}generateGrayscale(e,t,n,i){const s=this.tileSize,a=new Uint8Array(s*s*4);for(let o=0;o<s;o+=1)for(let l=0;l<s;l+=1){const c=(o*s+l)*4,d=l/s,u=o/s,h=this.tileNoise(d,u,3,e)-.5,f=this.tileNoise(d,u,17,e+13)-.5,g=Qs(t+(h*i+f*(1-i))*2*n);a[c+0]=g,a[c+1]=g,a[c+2]=g,a[c+3]=255}return this.makeTexture(a,s)}makeTexture(e,t){const n=new xo(e,t,t,1023,1009);return n.colorSpace=on,n.wrapS=1e3,n.wrapT=1e3,n.minFilter=1008,n.magFilter=1006,n.generateMipmaps=!0,n.needsUpdate=!0,n}tileNoise(e,t,n,i){const s=e*n,a=t*n,o=Math.floor(s),l=Math.floor(a),c=s-o,d=a-l,u=c*c*(3-2*c),h=d*d*(3-2*d),f=(S,y)=>this.latticeHash((S%n+n)%n,(y%n+n)%n,i),g=f(o,l),v=f(o+1,l),m=f(o,l+1),p=f(o+1,l+1);return g*(1-u)*(1-h)+v*u*(1-h)+m*(1-u)*h+p*u*h}latticeHash(e,t,n){let i=n*1664525+e*1013904223>>>0;return i=(i^t*1540483477)>>>0,i=(i^i>>>16)>>>0,i=Math.imul(i,73244475)>>>0,i=(i^i>>>16)>>>0,(i>>>0)/4294967295}}function Qs(r){return r<0?0:r>255?255:r|0}class p0{constructor(e,t,n,i,s=es){x(this,"group",new ti);x(this,"scene");x(this,"config");x(this,"surfaceFactory");x(this,"materials");x(this,"disposed",!1);this.scene=e,this.config=s,this.surfaceFactory=new ud(n.hubSurfaceTileSize),this.surfaceFactory.setAnisotropy(i),this.materials=this.surfaceFactory.getMaterials(t),this.buildStage(),this.scene.add(this.group)}applyPreset(e,t){this.disposed||(this.surfaceFactory.setTileSize(e.hubSurfaceTileSize),this.surfaceFactory.setAnisotropy(t))}setVisible(e){this.group.visible=e}dispose(){this.disposed||(this.disposed=!0,this.scene.remove(this.group),this.group.traverse(e=>{const t=e;t.isMesh&&t.geometry.dispose()}),this.surfaceFactory.dispose())}buildStage(){const{roomHalfWidth:e,roomRearZ:t,artworkWallZ:n,floorY:i,ceilingY:s}=this.config,a=e*2,o=s-i,l=t-n,c=i+o*.5,d=n+l*.5,u=new Ge(new Kt(a,o),this.materials.wall);u.position.set(0,c,n),u.receiveShadow=!0,this.group.add(u);const h=new Ge(new Kt(a,l),this.materials.floor);h.rotation.x=-Math.PI/2,h.position.set(0,i,d),h.receiveShadow=!0,this.group.add(h);const f=new Ge(new Kt(a,l),this.materials.ceiling);f.rotation.x=Math.PI/2,f.position.set(0,s,d),f.receiveShadow=!0,this.group.add(f);const g=new Ge(new Kt(l,o),this.materials.wall);g.rotation.y=Math.PI/2,g.position.set(-e,c,d),g.receiveShadow=!0,this.group.add(g);const v=new Ge(new Kt(l,o),this.materials.wall);v.rotation.y=-Math.PI/2,v.position.set(e,c,d),v.receiveShadow=!0,this.group.add(v),this.group.add(this.makeSkirting(a,i,n),this.makeSideSkirting(-e,d,l,i,!0),this.makeSideSkirting(e,d,l,i,!1),this.makeFrontReveal(a,s,n),this.makeLightStrip(a,s,n),this.makeSideReveal(-e,d,l,s,!0),this.makeSideReveal(e,d,l,s,!1))}makeSkirting(e,t,n){const i=new Ge(new Nt(e,this.config.skirtingHeight,this.config.skirtingDepth),this.materials.trim);return i.position.set(0,t+this.config.skirtingHeight*.5,n+this.config.skirtingDepth*.5),i}makeSideSkirting(e,t,n,i,s){const a=new Ge(new Nt(this.config.skirtingDepth,this.config.skirtingHeight,n),this.materials.trim);return a.position.set(e+(s?this.config.skirtingDepth*.5:-this.config.skirtingDepth*.5),i+this.config.skirtingHeight*.5,t),a}makeFrontReveal(e,t,n){const i=new Ge(new Nt(e,this.config.revealDrop,this.config.revealDepth),this.materials.trim);return i.position.set(0,t-this.config.revealDrop*.5,n+this.config.revealDepth*.5),i}makeSideReveal(e,t,n,i,s){const a=new Ge(new Nt(this.config.revealDepth,this.config.revealDrop,n),this.materials.trim);return a.position.set(e+(s?this.config.revealDepth*.5:-this.config.revealDepth*.5),i-this.config.revealDrop*.5,t),a}makeLightStrip(e,t,n){const i=new Ge(new Kt(e-1.2,this.config.lightStripDepth),this.materials.lightStrip);return i.rotation.x=Math.PI/2,i.position.set(0,t-this.config.revealDrop+this.config.lightStripLift,n+this.config.lightStripDepth*.5),i}}class m0 extends Hr{constructor(e=null){super();const t=new Nt;t.deleteAttribute("uv");const n=new yn({side:1}),i=new yn,s=new Kc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new Ge(t,n);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const o=new Ge(t,i);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const l=new Ge(t,i);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);const c=new Ge(t,i);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const d=new Ge(t,i);d.position.set(-2.017,.018,6.124),d.rotation.set(0,.333,0),d.scale.set(2.002,4.566,2.064),this.add(d);const u=new Ge(t,i);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const h=new Ge(t,i);h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),this.add(h);const f=new Ge(t,pr(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);const g=new Ge(t,pr(50));g.position.set(-16.109,18.021,-8.207),g.scale.set(.1,2.425,2.751),this.add(g);const v=new Ge(t,pr(17));v.position.set(14.904,12.198,-1.832),v.scale.set(.15,4.265,6.331),this.add(v);const m=new Ge(t,pr(43));m.position.set(-.462,8.89,14.52),m.scale.set(4.38,5.441,.088),this.add(m);const p=new Ge(t,pr(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const S=new Ge(t,pr(100));S.position.set(0,20,0),S.scale.set(1,.1,1),this.add(S)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function pr(r){const e=new pi;return e.color.setScalar(r),e}class g0{constructor(e){x(this,"scene");x(this,"camera");x(this,"environmentTarget",null);this.scene=new Hr,this.camera=new Ht(40,window.innerWidth/window.innerHeight,.1,100),this.camera.position.z=7;const t=new Bs(e);t.compileEquirectangularShader();const n=new m0(e);this.environmentTarget=t.fromScene(n),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=.55,t.dispose(),n.dispose()}updateAspect(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix()}dispose(){var e;(e=this.environmentTarget)==null||e.dispose(),this.environmentTarget=null}}const hd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class mr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const v0=new Os(-1,1,1,-1,0,1);class y0 extends wn{constructor(){super(),this.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Yt([0,2,0,0,2,0],2))}}const x0=new y0;class Uo{constructor(e){this._mesh=new Ge(x0,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,v0)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class fd extends mr{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=er.clone(e.uniforms),this.material=new Ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Uo(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class pd extends mr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}}class b0 extends mr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class _0{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new he);this._width=n.width,this._height=n.height,t=new Zt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:1016}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new fd(hd),this.copyPass.material.blending=0,this.clock=new Jv}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,s=this.passes.length;i<s;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}pd!==void 0&&(a instanceof pd?n=!0:a instanceof b0&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new he);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class S0 extends mr{constructor(e,t,n=null,i=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pe}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=i}}const w0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class gr extends mr{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new he(e.x,e.y):new he(256,256),this.clearColor=new Pe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Zt(s,a,{type:1016}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new Zt(s,a,{type:1016});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const f=new Zt(s,a,{type:1016});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),a=Math.round(a/2)}const o=w0;this.highPassUniforms=er.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ft({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new he(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const d=hd;this.copyUniforms=er.clone(d.uniforms),this.blendMaterial=new Ft({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Pe,this.oldClearAlpha=1,this.basic=new pi,this.fsQuad=new Uo(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,i),this.renderTargetsVertical[s].setSize(n,i),this.separableBlurMaterials[s].uniforms.invSize.value=new he(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=gr.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=gr.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Ft({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new he(.5,.5)},direction:{value:new he(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}}gr.BlurDirectionX=new he(1,0),gr.BlurDirectionY=new he(0,1);const M0={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class E0 extends mr{constructor(){super();const e=M0;this.uniforms=er.clone(e.uniforms),this.material=new Wv({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Uo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ut.getTransfer(this._outputColorSpace)===mt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===7&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const T0={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new he(1/1024,1/512)}},vertexShader:`

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
	`};class A0{constructor(e,t,n,i){x(this,"composer");x(this,"bloomPass");x(this,"fxaaPass");x(this,"renderer");var o;this.renderer=e,this.composer=new _0(e);const s=new S0(t,n);this.composer.addPass(s),this.bloomPass=new gr(new he(window.innerWidth,window.innerHeight),i.bloomStrength,i.bloomRadius,i.bloomThreshold),this.bloomPass.enabled=i.bloomStrength>0,this.composer.addPass(this.bloomPass),this.fxaaPass=new fd(T0),this.applyFXAAResolution(window.innerWidth,window.innerHeight),this.fxaaPass.enabled=(o=i.fxaaEnabled)!=null?o:!0,this.composer.addPass(this.fxaaPass);const a=new E0;this.composer.addPass(a)}applyPreset(e){var t;this.bloomPass.strength=e.bloomStrength,this.bloomPass.radius=e.bloomRadius,this.bloomPass.threshold=e.bloomThreshold,this.bloomPass.enabled=e.bloomStrength>0,this.fxaaPass.enabled=(t=e.fxaaEnabled)!=null?t:!0}resize(e,t){this.composer.setSize(Math.max(1,e),Math.max(1,t)),this.applyFXAAResolution(e,t)}prewarmComposer(e,t){try{this.resize(4,4),this.composer.render()}finally{this.resize(e,t)}}render(){this.composer.render()}dispose(){this.composer.dispose()}applyFXAAResolution(e,t){const n=this.renderer.getPixelRatio();this.fxaaPass.material.uniforms.resolution.value.set(1/(e*n),1/(t*n))}}const C0={ambientIntensity:.75,ambientKelvin:4900,keys:[{kelvin:4400,intensity:78,position:{x:-4.2,y:6,z:5.1},angle:.66,penumbra:.97,decay:1.6},{kelvin:5100,intensity:28,position:{x:4.4,y:5.1,z:4.8},angle:.82,penumbra:.99,decay:1.5}]};function Do(r,e){const t=Math.max(1e3,Math.min(4e4,r))/100;let n,i,s;t<=66?(n=255,i=99.4708025861*Math.log(t)-161.1195681661,s=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307):(n=329.698727446*Math.pow(t-60,-.1332047592),i=288.1221695283*Math.pow(t-60,-.0755148492),s=255),n=Math.max(0,Math.min(255,n))/255,i=Math.max(0,Math.min(255,i))/255,s=Math.max(0,Math.min(255,s))/255;const a=e!=null?e:new Pe;return a.setRGB(n,i,s),a}const R0=100;class P0{constructor(e,t){x(this,"scene");x(this,"ambientLight");x(this,"spots",[]);x(this,"spotTarget");x(this,"accent",null);x(this,"profile");x(this,"animate",!0);x(this,"lastUpdateTime",0);x(this,"animatedTime",0);x(this,"shadowsEnabled",!1);this.scene=e,this.profile=C0,this.ambientLight=new jv(16777215,this.profile.ambientIntensity),e.add(this.ambientLight),this.spotTarget=new Et,this.spotTarget.position.set(0,0,0),e.add(this.spotTarget),this.applyProfile(this.profile),this.applyPreset(t)}applyPreset(e){this.shadowsEnabled=e.shadows,this.spots.forEach((t,n)=>this.applyShadowPreset(t,e,n===0))}getLights(){return[...this.spots,this.ambientLight]}getExpectedShadowCasterCount(){return this.shadowsEnabled?this.spots.length:0}setAnimated(e){this.animate=e}update(e){var i,s;if(!this.animate)return!1;this.lastUpdateTime>0&&(this.animatedTime+=Math.min(e-this.lastUpdateTime,R0)),this.lastUpdateTime=e;const t=this.spots[0];if(!t)return!1;const n=(s=(i=this.profile.keys[0])==null?void 0:i.position.x)!=null?s:-3;return t.position.x=n+Math.sin(this.animatedTime*2e-4)*.25,!0}dispose(){this.ambientLight.dispose();for(const e of this.spots)this.scene.remove(e),e.dispose();this.spots.length=0,this.scene.remove(this.spotTarget),this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}getKeyLightWorldDir(e){const t=e!=null?e:new R,n=this.spots[0];return n?t.copy(n.position).normalize():t.set(0,0,1)}applyProfile(e){var t;for(this.ambientLight.intensity=e.ambientIntensity,Do(e.ambientKelvin,this.ambientLight.color);this.spots.length<e.keys.length;){const n=new qv(16777215,0);this.scene.add(n),this.spots.push(n)}for(;this.spots.length>e.keys.length;){const n=this.spots.pop();this.scene.remove(n),n.dispose()}e.keys.forEach((n,i)=>this.applyKeyLight(this.spots[i],n)),e.accent?(this.accent||(this.accent=new Kc(16777215,0,30),this.scene.add(this.accent)),Do(e.accent.kelvin,this.accent.color),this.accent.intensity=e.accent.intensity,this.accent.position.set(e.accent.position.x,e.accent.position.y,e.accent.position.z),this.accent.decay=(t=e.accent.decay)!=null?t:2):this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}applyKeyLight(e,t){var n,i,s;Do(t.kelvin,e.color),e.intensity=t.intensity,e.distance=80,e.angle=(n=t.angle)!=null?n:.42,e.penumbra=(i=t.penumbra)!=null?i:.9,e.decay=(s=t.decay)!=null?s:1.8,e.position.set(t.position.x,t.position.y,t.position.z),e.target=this.spotTarget}applyShadowPreset(e,t,n){var a;const i=t.shadows&&n;if(e.castShadow!==i&&(e.castShadow=i),!i)return;const s=t.id==="high"?1024:512;(e.shadow.mapSize.x!==s||e.shadow.mapSize.y!==s)&&(e.shadow.mapSize.set(s,s),(a=e.shadow.map)==null||a.dispose(),e.shadow.map=null),e.shadow.bias=-15e-5,e.shadow.normalBias=.025,e.shadow.radius=2.4,e.shadow.camera.near=.5,e.shadow.camera.far=28,e.shadow.focus=.9,e.shadow.camera.updateProjectionMatrix()}}function Js(r){return r.startsWith("data:")?"data-uri":/^https?:\/\//i.test(r)?"external-http":/^file:\/\//i.test(r)?"file-url":"local-relative"}function I0(r,e){var n,i;if(Js(r)!=="local-relative")return r;const t=(i=(n=e==null?void 0:e.assetBaseUrl)==null?void 0:n.trim())!=null?i:"";if(t)try{return new URL(r,t).href}catch(s){return r}if(typeof window=="undefined")return r;try{return new URL(r,window.location.href).href}catch(s){return r}}function md(r,e,t){var s;const n=r.trim(),i=I0(n,t);return{declaredUrl:n,resolvedUrl:i,mode:e,declaredUrlType:Js(n),resolvedUrlType:Js(i),bundleId:((s=t==null?void 0:t.bundleId)==null?void 0:s.trim())||null}}function wi(r){var a,o,l,c;const e=r==null?void 0:r.imageSourceContext,t=(o=(a=r==null?void 0:r.image)==null?void 0:a.trim())!=null?o:"",n=(c=(l=r==null?void 0:r.webglImage)==null?void 0:l.trim())!=null?c:"",i=t?md(t,"declared-image",e):null,s=n&&n!==t?md(n,"embedded-webgl-fallback",e):null;return{primary:i,fallback:s}}function nt(r){if(Js(r)!=="data-uri")return r;const e=r.indexOf(";");return`[data-uri:${e<=5?"unknown":r.slice(5,e)}:${r.length}bytes]`}function L0(r,e,t){const n=Math.max(0,Math.floor(r)),i=Math.max(0,Math.floor(e));if(t<=0||n<=0||i<=0||n<=t&&i<=t)return{needsDownscale:!1,sourceWidth:n,sourceHeight:i,targetWidth:n,targetHeight:i};const a=Math.min(t/n,t/i);return{needsDownscale:!0,sourceWidth:n,sourceHeight:i,targetWidth:Math.max(1,Math.floor(n*a)),targetHeight:Math.max(1,Math.floor(i*a))}}function gd(r,e,t,n){const i=L0(e,t,n);if(!i.needsDownscale)return{image:r,fit:i,downscaleApplied:!1};const s=document.createElement("canvas");s.width=i.targetWidth,s.height=i.targetHeight;const a=s.getContext("2d");return a?(a.drawImage(r,0,0,i.targetWidth,i.targetHeight),{image:s,fit:i,downscaleApplied:!0}):{image:r,fit:i,downscaleApplied:!1}}const cn=4,vd=new WeakMap;function k0(r){const e=vd.get(r);if(e)return e;const t=new Zt(cn,cn,{depthBuffer:!1,stencilBuffer:!1}),n=new Hr,i=new Os(-1,1,1,-1,0,2);i.position.z=1;const s=new pi({toneMapped:!1,transparent:!0}),a=new Ge(new Kt(2,2),s);n.add(a);const o={renderTarget:t,scene:n,camera:i,material:s,buffer:new Uint8Array(cn*cn*4)};return vd.set(r,o),o}function yd(r,e){var t,n,i,s;try{const a=k0(r);a.material.map=e,a.material.needsUpdate=!0;const o=r.getRenderTarget();r.setRenderTarget(a.renderTarget),r.render(a.scene,a.camera),r.readRenderTargetPixels(a.renderTarget,0,0,cn,cn,a.buffer),r.setRenderTarget(o),a.material.map=null;const l=cn*cn;let c=0,d=0,u=0,h=0;for(let v=0;v<a.buffer.length;v+=4)c+=(t=a.buffer[v])!=null?t:0,d+=(n=a.buffer[v+1])!=null?n:0,u+=(i=a.buffer[v+2])!=null?i:0,h+=(s=a.buffer[v+3])!=null?s:0;const f={r:Math.round(c/l),g:Math.round(d/l),b:Math.round(u/l),a:Math.round(h/l)},g=f.a>0;return{pass:g,probeWidth:cn,probeHeight:cn,averageColor:f,reason:g?void 0:"zero-alpha-readback"}}catch(a){return{pass:!1,probeWidth:cn,probeHeight:cn,averageColor:{r:0,g:0,b:0,a:0},reason:a instanceof Error?a.message:"probe-error"}}}function zn(){return typeof window=="undefined"||!window.location?null:window.location.protocol||null}function No(r){return r.debugEnabled?!0:r.runtimeProtocol==="file:"&&r.resolvedUrlType==="file-url"}function U0(r,e){return e&&r.runtimeProtocol==="file:"&&r.resolvedUrlType==="file-url"}function xd(r,e){return e&&No(r)}function vr(r,e){var i;const t=e.result==="success"?r.info.bind(r):r.warn.bind(r),n=e.result==="success"?`${e.route==="hub"?"Hub":"Gallery"} artwork proved source→decode→GPU→pixels`:`${e.route==="hub"?"Hub":"Gallery"} artwork failed source-to-pixel proof at ${(i=e.firstFailedStage)!=null?i:"unknown"} stage`;t("source-to-pixel-outcome",n,e)}class D0{constructor(e=Xc){x(this,"diagnostics",rn("texture"));x(this,"cache",new Map);x(this,"externalLoader");x(this,"localLoader");x(this,"maxAnisotropy",1);x(this,"maxTextureSize",0);x(this,"anisotropyDivisor",1);x(this,"renderer",null);x(this,"imageBitmapDecodeSupported",typeof createImageBitmap=="function"&&typeof Qv=="function");x(this,"fallbackKeys",new Set);x(this,"artworkAlbedoSelections",new Map);x(this,"uploadFits",new Map);this.externalLoader=new $c(e),this.localLoader=new $c(e),this.externalLoader.setCrossOrigin("anonymous")}init(e){this.renderer=e,this.maxAnisotropy=e.capabilities.getMaxAnisotropy(),this.maxTextureSize=e.capabilities.maxTextureSize,this.diagnostics.info("capabilities","Texture manager initialized",{maxAnisotropy:this.maxAnisotropy,maxTextureSize:this.maxTextureSize,imageBitmapDecodeSupported:this.imageBitmapDecodeSupported,imageBitmapStatus:this.imageBitmapDecodeSupported?"available-for-guarded-benchmark":"unsupported-or-unavailable",compressedTexturePipeline:"ktx2-basis-future-importer-milestone"})}setAnisotropyDivisor(e){const t=Math.max(1,e);if(t===this.anisotropyDivisor){this.diagnostics.debug("anisotropy-noop","Anisotropy divisor unchanged; skipping cache walk",{divisor:t,cacheSize:this.cache.size});return}this.anisotropyDivisor=t;const n=this.getEffectiveAnisotropy();this.cache.forEach(i=>{i.anisotropy=n,i.needsUpdate=!0}),this.diagnostics.debug("anisotropy-applied","Anisotropy divisor changed; cache marked for re-upload",{divisor:t,anisotropy:n,cacheSize:this.cache.size})}getEffectiveAnisotropy(){return Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor))}async preload(e){this.diagnostics.info("preload",`Preloading ${e.length} albedo texture(s)`,{count:e.length,urlTypes:e.map(t=>this.compactUrlType(t))}),await Promise.all(e.map(t=>this.load(t)))}async preloadArtworkAlbedos(e){this.diagnostics.info("preload",`Preloading ${e.length} artwork albedo texture(s)`,{count:e.length,artworks:e.map(t=>{var i,s,a,o,l,c,d,u;const n=wi(t);return{artworkId:t.id,bundleId:(s=(i=n.primary)==null?void 0:i.bundleId)!=null?s:null,declaredImageUrlType:(o=(a=n.primary)==null?void 0:a.declaredUrlType)!=null?o:null,resolvedImageUrlType:(c=(l=n.primary)==null?void 0:l.resolvedUrlType)!=null?c:null,hasEmbeddedFallback:!!n.fallback,embeddedFallbackUrlType:(u=(d=n.fallback)==null?void 0:d.resolvedUrlType)!=null?u:null}})}),await Promise.all(e.map(t=>this.loadArtworkAlbedo(t)))}async loadArtworkAlbedo(e){var l,c,d,u,h,f,g,v,m,p,S;const t=wi(e),n=t.primary,i=this.artworkAlbedoSelections.get(e.id);if(i){const y=(l=this.cache.get(`albedo::${i.selectedUrl}`))!=null?l:n?this.cache.get(`albedo::${n.resolvedUrl}`):void 0;if(y)return y}const s=this.now();if(!n){const y=this.createFallbackTexture(e.id);return(c=this.renderer)==null||c.initTexture(y),this.artworkAlbedoSelections.set(e.id,{selectedUrl:e.image,selectedUrlType:"local-relative",declaredUrl:e.image,declaredUrlType:"local-relative",sourceMode:"declared-image",bundleId:null,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,generatedFallback:!0}),vr(this.diagnostics,{route:"gallery",artworkId:e.id,bundleId:null,runtimeProtocol:zn(),candidateMode:null,resolvedUrlType:null,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,result:"failed",firstFailedStage:"candidate-selected",failureReason:"no-declared-source",elapsedMs:Math.round(this.now()-s),sourceWidth:null,sourceHeight:null,uploadWidth:null,uploadHeight:null,downscaleApplied:!1,rendererMaxTextureSize:this.maxTextureSize||null,visibleProbe:null}),y}const a=await this.loadForRole(n.resolvedUrl,"albedo");if(!this.isFallback(n.resolvedUrl,"albedo")){const y=this.probeArtworkTexture(a,n.resolvedUrlType),b=xd({runtimeProtocol:zn(),resolvedUrlType:n.resolvedUrlType,debugEnabled:this.diagnostics.isDebugEnabled()},!!t.fallback);if(y.failureReason&&b&&t.fallback){const U=t.fallback,P=`${n.mode}:visible-pixel-probe:${y.failureReason}`;this.diagnostics.warn("artwork-albedo-retry","Declared artwork image failed after GPU upload; retrying embedded fallback",{artworkId:e.id,bundleId:n.bundleId,declaredImageUrl:nt(n.declaredUrl),fallbackImageUrl:nt(U.resolvedUrl),declaredImageUrlType:n.declaredUrlType,fallbackImageUrlType:U.resolvedUrlType,fallbackReason:P,visibleProbe:y.visibleProbe});const E=await this.loadForRole(U.resolvedUrl,"albedo");if(!this.isFallback(U.resolvedUrl,"albedo")){const L=this.probeArtworkTexture(E,U.resolvedUrlType);return L.failureReason?(this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:U.bundleId,candidateMode:U.mode,resolvedUrlType:U.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,stage:"visible-pixel-probe",failureReason:`${U.mode}:visible-pixel-probe:${L.failureReason}`,fit:(u=this.uploadFits.get(`albedo::${U.resolvedUrl}`))!=null?u:null,visibleProbe:L.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)):(this.promoteArtworkAlbedo(n.resolvedUrl,E,(d=this.uploadFits.get(`albedo::${U.resolvedUrl}`))!=null?d:null),this.artworkAlbedoSelections.set(e.id,{selectedUrl:U.resolvedUrl,selectedUrlType:U.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:U.mode,bundleId:U.bundleId,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,generatedFallback:!1}),this.diagnostics.info("artwork-albedo-fallback","Artwork albedo resolved through embedded fallback",{artworkId:e.id,bundleId:U.bundleId,declaredImageUrl:nt(n.declaredUrl),resolvedImageUrl:nt(U.resolvedUrl),declaredImageUrlType:n.declaredUrlType,resolvedImageUrlType:U.resolvedUrlType}),this.recordAlbedoOutcome(e.id,U.resolvedUrl,U.bundleId,U.mode,U.resolvedUrlType,{usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,texture:E,visibleProbe:L.visibleProbe}),E)}return this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:n.bundleId,candidateMode:n.mode,resolvedUrlType:n.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,startedAt:s,stage:"visible-pixel-probe",failureReason:P,fit:(h=this.uploadFits.get(`albedo::${n.resolvedUrl}`))!=null?h:null,visibleProbe:y.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)}return y.failureReason?(this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:n.bundleId,candidateMode:n.mode,resolvedUrlType:n.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,startedAt:s,stage:"visible-pixel-probe",failureReason:`${n.mode}:visible-pixel-probe:${y.failureReason}`,fit:(f=this.uploadFits.get(`albedo::${n.resolvedUrl}`))!=null?f:null,visibleProbe:y.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)):(this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,generatedFallback:!1}),this.recordAlbedoOutcome(e.id,n.resolvedUrl,n.bundleId,n.mode,n.resolvedUrlType,{usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,startedAt:s,texture:a,visibleProbe:y.visibleProbe}),a)}const o=t.fallback;if(o){this.diagnostics.warn("artwork-albedo-retry","Declared artwork image failed; retrying embedded fallback",{artworkId:e.id,bundleId:n.bundleId,declaredImageUrl:nt(n.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:n.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType});const y=await this.loadForRole(o.resolvedUrl,"albedo");if(!this.isFallback(o.resolvedUrl,"albedo")){const b=this.probeArtworkTexture(y,o.resolvedUrlType);return b.failureReason?(this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,stage:"visible-pixel-probe",failureReason:`${o.mode}:visible-pixel-probe:${b.failureReason}`,fit:(v=this.uploadFits.get(`albedo::${o.resolvedUrl}`))!=null?v:null,visibleProbe:b.visibleProbe}),this.cache.get(`albedo::${n.resolvedUrl}`)):(this.promoteArtworkAlbedo(n.resolvedUrl,y,(g=this.uploadFits.get(`albedo::${o.resolvedUrl}`))!=null?g:null),this.artworkAlbedoSelections.set(e.id,{selectedUrl:o.resolvedUrl,selectedUrlType:o.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:o.mode,bundleId:o.bundleId,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,generatedFallback:!1}),this.diagnostics.info("artwork-albedo-fallback","Artwork albedo resolved through embedded fallback",{artworkId:e.id,bundleId:o.bundleId,declaredImageUrl:nt(n.declaredUrl),resolvedImageUrl:nt(o.resolvedUrl),declaredImageUrlType:n.declaredUrlType,resolvedImageUrlType:o.resolvedUrlType}),this.recordAlbedoOutcome(e.id,o.resolvedUrl,o.bundleId,o.mode,o.resolvedUrlType,{usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:s,texture:y,visibleProbe:b.visibleProbe}),y)}}return this.installGeneratedFallbackTexture(n.resolvedUrl,e.id),this.artworkAlbedoSelections.set(e.id,{selectedUrl:n.resolvedUrl,selectedUrlType:n.resolvedUrlType,declaredUrl:n.declaredUrl,declaredUrlType:n.declaredUrlType,sourceMode:n.mode,bundleId:n.bundleId,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!!o,generatedFallback:!0}),this.recordFailedAlbedoOutcome(e.id,{bundleId:n.bundleId,candidateMode:(m=o==null?void 0:o.mode)!=null?m:n.mode,resolvedUrlType:(p=o==null?void 0:o.resolvedUrlType)!=null?p:n.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!!o,startedAt:s,stage:"request",failureReason:o?"primary-and-fallback-load-failed":"primary-load-failed-no-fallback",fit:null,visibleProbe:null}),(S=this.cache.get(`albedo::${n.resolvedUrl}`))!=null?S:a}recordAlbedoOutcome(e,t,n,i,s,a){var l,c,d,u,h,f,g;const o=(l=this.uploadFits.get(`albedo::${t}`))!=null?l:null;vr(this.diagnostics,{route:"gallery",artworkId:e,bundleId:n,runtimeProtocol:zn(),candidateMode:i,resolvedUrlType:s,usedEmbeddedFallback:a.usedEmbeddedFallback,attemptedEmbeddedFallback:a.attemptedEmbeddedFallback,result:"success",firstFailedStage:null,failureReason:null,elapsedMs:Math.round(this.now()-a.startedAt),sourceWidth:(c=o==null?void 0:o.sourceWidth)!=null?c:null,sourceHeight:(d=o==null?void 0:o.sourceHeight)!=null?d:null,uploadWidth:(u=o==null?void 0:o.targetWidth)!=null?u:null,uploadHeight:(h=o==null?void 0:o.targetHeight)!=null?h:null,downscaleApplied:(f=o==null?void 0:o.needsDownscale)!=null?f:!1,rendererMaxTextureSize:this.maxTextureSize||null,visibleProbe:(g=a.visibleProbe)!=null?g:null})}getArtworkAlbedoSelection(e){return this.artworkAlbedoSelections.get(e.id)}load(e){return this.loadForRole(e,"albedo")}loadForRole(e,t){const n=`${t}::${e}`;if(this.cache.has(n))return Promise.resolve(this.cache.get(n));const i=/^https?:\/\//i.test(e),s=i?this.externalLoader:this.localLoader,a=this.classifyUrlType(e),o=this.redactUrlForLog(e);return this.diagnostics.debug("load-start",`Starting ${t} texture load`,{url:o,urlType:a,role:t,crossOrigin:i?"anonymous":"none"}),new Promise(l=>{s.load(e,c=>{var d,u;try{this.prepareTexture(c,t);const h=c.image,f="naturalWidth"in h?h.naturalWidth||h.width||0:h.width||0,g="naturalHeight"in h?h.naturalHeight||h.height||0:h.height||0,v=gd(h,f,g,this.maxTextureSize);v.downscaleApplied?(c.image=v.image,c.needsUpdate=!0,this.diagnostics.warn("texture-downscaled",`Downscaled oversized ${t} texture to fit device capability`,{role:t,url:o,urlType:a,sourceWidth:f,sourceHeight:g,uploadWidth:v.fit.targetWidth,uploadHeight:v.fit.targetHeight,maxTextureSize:this.maxTextureSize})):v.fit.needsDownscale&&this.warnIfOversized(t,o,a,f,g),this.uploadFits.set(n,v.fit),(d=this.renderer)==null||d.initTexture(c),this.cache.set(n,c),this.fallbackKeys.delete(n),this.diagnostics.info("load-success",`Loaded ${t} texture`,{url:o,urlType:a,width:v.fit.targetWidth,height:v.fit.targetHeight,sourceWidth:f,sourceHeight:g,downscaleApplied:v.downscaleApplied,fallbackUsed:!1}),l(c)}catch(h){c.dispose(),this.uploadFits.delete(n),this.diagnostics.warn("load-fallback",`Failed to prepare ${t} texture for upload — creating generated fallback`,{url:o,urlType:a,role:t,failureStage:"gpu-upload",errorMessage:h instanceof Error?h.message:String(h)});const f=this.createFallbackTexture(e);this.cache.set(n,f),this.uploadFits.delete(n),(u=this.renderer)==null||u.initTexture(f),this.fallbackKeys.add(n),l(f)}},void 0,c=>{var u;this.diagnostics.warn("load-fallback",`Failed to load ${t} texture — creating generated fallback`,{url:o,urlType:a,role:t,errorMessage:c instanceof Error?c.message:String(c)});const d=this.createFallbackTexture(e);this.cache.set(n,d),this.uploadFits.delete(n),(u=this.renderer)==null||u.initTexture(d),this.fallbackKeys.add(n),l(d)})})}async preloadTextureSet(e){if(!e)return{};const t=["albedo","normal","detailNormal","height","roughness","specular","ao","varnish"],n=t.filter(s=>!!e[s]);this.diagnostics.debug("preload-texture-set",`Loading authored texture set (${n.length} role(s))`,{roles:n});const i={};return await Promise.all(t.map(async s=>{const a=e[s];if(!a)return;const o=await this.loadForRole(a.url,s);i[s]=o})),i}get(e){const t=`albedo::${e}`,n=this.cache.get(t);return n||this.diagnostics.debug("cache-miss","Albedo cache miss — texture not preloaded for this URL",{url:this.redactUrlForLog(e),cacheSize:this.cache.size}),n}getForRole(e,t){return this.cache.get(`${t}::${e}`)}isFallback(e,t="albedo"){return this.fallbackKeys.has(`${t}::${e}`)}dispose(){this.cache.forEach(e=>e.dispose()),this.cache.clear(),this.fallbackKeys.clear(),this.artworkAlbedoSelections.clear(),this.uploadFits.clear()}promoteArtworkAlbedo(e,t,n){const i=`albedo::${e}`,s=this.cache.get(i);s&&s!==t&&s.dispose(),this.cache.set(i,t),this.fallbackKeys.delete(i),n?this.uploadFits.set(i,n):this.uploadFits.delete(i)}installGeneratedFallbackTexture(e,t){var a;const n=`albedo::${e}`,i=this.cache.get(n);i&&i.dispose();const s=this.createFallbackTexture(t);return this.cache.set(n,s),this.uploadFits.delete(n),this.fallbackKeys.add(n),(a=this.renderer)==null||a.initTexture(s),s}recordFailedAlbedoOutcome(e,t){var n,i,s,a,o,l,c,d,u,h;vr(this.diagnostics,{route:"gallery",artworkId:e,bundleId:t.bundleId,runtimeProtocol:zn(),candidateMode:t.candidateMode,resolvedUrlType:t.resolvedUrlType,usedEmbeddedFallback:t.usedEmbeddedFallback,attemptedEmbeddedFallback:t.attemptedEmbeddedFallback,result:"failed",firstFailedStage:t.stage,failureReason:t.failureReason,elapsedMs:Math.round(this.now()-t.startedAt),sourceWidth:(i=(n=t.fit)==null?void 0:n.sourceWidth)!=null?i:null,sourceHeight:(a=(s=t.fit)==null?void 0:s.sourceHeight)!=null?a:null,uploadWidth:(l=(o=t.fit)==null?void 0:o.targetWidth)!=null?l:null,uploadHeight:(d=(c=t.fit)==null?void 0:c.targetHeight)!=null?d:null,downscaleApplied:(h=(u=t.fit)==null?void 0:u.needsDownscale)!=null?h:!1,rendererMaxTextureSize:this.maxTextureSize||null,visibleProbe:t.visibleProbe})}probeArtworkTexture(e,t){var s;if(!No({runtimeProtocol:zn(),resolvedUrlType:t,debugEnabled:this.diagnostics.isDebugEnabled()})||!this.renderer)return{visibleProbe:null,failureReason:null};const i=yd(this.renderer,e);return{visibleProbe:i,failureReason:i.pass?null:(s=i.reason)!=null?s:"probe-failed"}}now(){return typeof performance!="undefined"?performance.now():Date.now()}prepareTexture(e,t){t==="albedo"?e.colorSpace=Ot:e.colorSpace=on,t==="detailNormal"&&(e.wrapS=1e3,e.wrapT=1e3);const n=Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor));e.anisotropy=n,e.needsUpdate=!0}createFallbackTexture(e){const t=document.createElement("canvas");t.width=1600,t.height=1100;const n=t.getContext("2d");if(n){const s=this.hash(e)%32,a=n.createLinearGradient(0,0,t.width,t.height);a.addColorStop(0,`hsl(${205+s}, 18%, 92%)`),a.addColorStop(.55,`hsl(${35+s}, 22%, 78%)`),a.addColorStop(1,`hsl(${205+s}, 12%, 62%)`),n.fillStyle=a,n.fillRect(0,0,t.width,t.height),n.strokeStyle="rgba(255,255,255,0.34)",n.lineWidth=28,n.beginPath(),n.moveTo(t.width*.08,t.height*.28),n.bezierCurveTo(t.width*.35,t.height*.08,t.width*.58,t.height*.32,t.width*.9,t.height*.22),n.stroke(),n.fillStyle="rgba(17,24,29,0.16)",n.font="700 58px Inter, Arial, sans-serif",n.fillText("FREYRAUM",96,t.height-96)}const i=new bo(t);return this.prepareTexture(i,"albedo"),i}warnIfOversized(e,t,n,i,s){this.maxTextureSize<=0||i<=this.maxTextureSize&&s<=this.maxTextureSize||this.diagnostics.warn("texture-oversized","Loaded texture exceeds device MAX_TEXTURE_SIZE",{role:e,url:t,urlType:n,width:i,height:s,maxTextureSize:this.maxTextureSize,likelyBrowserDownscale:!0})}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t}classifyUrlType(e){return e.startsWith("data:")?"data-uri":/^https?:\/\//i.test(e)?"external-http":/^file:\/\//i.test(e)?"file-url":"local-relative"}compactUrlType(e){const t=this.classifyUrlType(e);return t==="external-http"?"http":t==="file-url"?"file":t==="local-relative"?"local":`data-uri:${this.dataUriMime(e)}`}redactUrlForLog(e){return this.classifyUrlType(e)!=="data-uri"?e:`[data-uri:${this.dataUriMime(e)}:${e.length}bytes]`}dataUriMime(e){const t=e.indexOf(";");return t<=5?"unknown":e.slice(5,t)}}const yr="matte-print",Tn={canvas:{id:"canvas",label:"Canvas",proceduralRoles:["normal","detailNormal","height","roughness","specular"],bodyDepth:.05,backerColor:"#E6E1D5",baseRoughness:.92,specularScale:.42,clearcoatStrength:0,clearcoatRoughness:.36},"fine-art-paper":{id:"fine-art-paper",label:"Fine art paper",proceduralRoles:["roughness"],bodyDepth:.026,backerColor:"#F1ECE2",baseRoughness:.985,specularScale:0,clearcoatStrength:0,clearcoatRoughness:.36},"matte-print":{id:"matte-print",label:"Matte print",proceduralRoles:["roughness"],bodyDepth:.03,backerColor:"#DDD8CE",baseRoughness:.96,specularScale:0,clearcoatStrength:0,clearcoatRoughness:.36},"satin-print":{id:"satin-print",label:"Satin print",proceduralRoles:["roughness","specular"],bodyDepth:.03,backerColor:"#DDD8CE",baseRoughness:.82,specularScale:.82,clearcoatStrength:0,clearcoatRoughness:.32},"glazed-print":{id:"glazed-print",label:"Glazed print",proceduralRoles:["roughness","specular","varnish"],bodyDepth:.03,backerColor:"#DCD7CD",baseRoughness:.8,specularScale:.9,clearcoatStrength:.12,clearcoatRoughness:.26}};function bd(r){if(typeof r!="string")return null;const e=r.trim().toLowerCase();return e&&e in Tn?e:null}function N0(r){var e;return(e=bd(r))!=null?e:yr}const _d="#include <common>",F0="#include <map_fragment>",O0="#include <normal_fragment_maps>",Sd="#include <lights_fragment_end>";class B0 extends Vc{constructor(t){const n=Tn[yr],i=n.clearcoatStrength>0?.06:n.specularScale>0?.04:.015;super({roughness:n.baseRoughness,metalness:0,emissive:16777215,emissiveIntensity:t.albedoFidelityFill,clearcoat:0,specularIntensity:i});x(this,"paintingUniforms");x(this,"currentVariant");x(this,"activePresentation",yr);x(this,"hasDetailNormal",!1);x(this,"hasBump",!1);x(this,"hasAO",!1);x(this,"grazingEnabled",!1);x(this,"parallaxEnabledFlag",!1);x(this,"selfShadowEnabledFlag",!1);x(this,"albedoOnlyEnabled",!1);x(this,"shadowDebugEnabled",!1);x(this,"shadowFilterEnabled",!1);x(this,"reducedMotion",!1);this.paintingUniforms={uDetailNormalStrength:{value:t.detailNormalStrength},uDetailTiling:{value:new he(8,8)},uBumpStrength:{value:t.bumpStrength},uLightGrazingBoost:{value:.16},uReducedMotionScalar:{value:1},tDetailNormal:{value:null},uParallaxScale:{value:t.parallaxEnabled?t.parallaxScale:0},uParallaxSteps:{value:t.parallaxSteps},uShadowSteps:{value:t.selfShadowSteps},uShadowStrength:{value:t.selfShadowStrength},uShadowBias:{value:t.selfShadowBias},uShadowSoftness:{value:t.selfShadowSoftness},uShadowMaxOcclusion:{value:t.selfShadowMaxOcclusion},uShadowProfileScale:{value:.5},uShadowFilterRadius:{value:t.selfShadowFilterRadius},uKeyLightDir:{value:new R(0,0,1)},uAlbedoOnly:{value:0}},this.currentVariant=t.shaderVariant,this.normalScale.set(t.normalStrength,t.normalStrength),this.grazingEnabled=t.grazingBoostEnabled,this.parallaxEnabledFlag=t.parallaxEnabled,this.selfShadowEnabledFlag=t.selfShadowEnabled,this.applyPresentation(yr,t),this.onBeforeCompile=s=>{Object.assign(s.uniforms,this.paintingUniforms);const a=[];this.detailNormalActive()&&a.push("#define PAINTING_USE_DETAIL_NORMAL"),this.hasBump&&this.paintingUniforms.uBumpStrength.value>0&&a.push("#define PAINTING_USE_BUMP"),this.hasAO&&a.push("#define PAINTING_USE_AO"),this.grazingEnabled&&a.push("#define PAINTING_USE_GRAZING_BOOST"),this.parallaxActive()&&a.push("#define PAINTING_USE_PARALLAX"),this.selfShadowActive()&&a.push("#define PAINTING_USE_SELFSHADOW"),this.albedoOnlyEnabled&&a.push("#define PAINTING_DEBUG_ALBEDO_ONLY"),this.shadowDebugEnabled&&a.push("#define PAINTING_DEBUG_SHADOW"),this.shadowFilterEnabled&&this.selfShadowActive()&&this.paintingUniforms.uShadowFilterRadius.value>0&&a.push("#define PAINTING_USE_SHADOW_FILTER");let o=s.fragmentShader;o=o.replace(_d,`${_d}

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
`),o=o.replace(F0,`
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
`),o=o.replace(O0,`
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
${Sd}

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
`;o=o.replace(Sd,u),s.fragmentShader=a.join(`
`)+`
`+o}}detailNormalActive(){return this.hasDetailNormal&&this.paintingUniforms.uDetailNormalStrength.value>0}parallaxActive(){return this.parallaxEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uParallaxScale.value>0}selfShadowActive(){return this.selfShadowEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uShadowStrength.value>0}applyPreset(t){this.normalScale.set(t.normalStrength,t.normalStrength),this.emissiveIntensity=t.albedoFidelityFill,this.applyPresentationSettings(t),(!t.clearcoatEnabled||Tn[this.activePresentation].clearcoatStrength<=0)&&(this.clearcoat=0,this.clearcoatMap&&(this.clearcoatMap=null,this.needsUpdate=!0)),this.paintingUniforms.uDetailNormalStrength.value=t.detailNormalStrength,this.paintingUniforms.uBumpStrength.value=t.bumpStrength,this.paintingUniforms.uParallaxScale.value=t.parallaxEnabled?t.parallaxScale:0,this.paintingUniforms.uParallaxSteps.value=t.parallaxSteps,this.paintingUniforms.uShadowSteps.value=t.selfShadowSteps,this.paintingUniforms.uShadowStrength.value=t.selfShadowStrength,this.paintingUniforms.uShadowBias.value=t.selfShadowBias,this.paintingUniforms.uShadowSoftness.value=t.selfShadowSoftness,this.paintingUniforms.uShadowMaxOcclusion.value=t.selfShadowMaxOcclusion,this.paintingUniforms.uShadowFilterRadius.value=t.selfShadowFilterRadius,(!t.detailNormalEnabled||t.detailNormalStrength<=0)&&(this.paintingUniforms.tDetailNormal.value=null),t.shaderVariant==="painting-battery"&&(this.roughnessMap=null),t.specularStrength<=0&&(this.specularIntensityMap=null);const n=t.aoEnabled&&!!this.aoMap,i=t.detailNormalEnabled&&t.detailNormalStrength>0&&!!this.paintingUniforms.tDetailNormal.value,s=t.bumpStrength>0&&!!this.bumpMap,a=t.grazingBoostEnabled,o=t.parallaxEnabled&&!!this.bumpMap&&t.parallaxScale>0,l=t.selfShadowEnabled&&!!this.bumpMap&&t.selfShadowStrength>0,c=n!==this.hasAO||i!==this.detailNormalActive()||s!==this.hasBump||a!==this.grazingEnabled||o!==this.parallaxEnabledFlag||l!==this.selfShadowEnabledFlag||t.shaderVariant!==this.currentVariant;this.hasAO=n,this.hasDetailNormal=i,this.hasBump=s,this.grazingEnabled=a,this.parallaxEnabledFlag=o,this.selfShadowEnabledFlag=l,this.currentVariant=t.shaderVariant,n||(this.aoMap=null),!s&&!o&&!l&&(this.bumpMap=null),c&&(this.needsUpdate=!0)}applyTextures(t,n,i){var d,u,h,f,g,v,m;this.map=t.albedo,this.emissiveMap=t.albedo,this.emissiveIntensity=i.albedoFidelityFill,this.normalMap=(d=t.normal)!=null?d:null;const s=Tn[this.activePresentation];this.roughnessMap=i.shaderVariant==="painting-battery"?null:(u=t.roughness)!=null?u:null,this.roughness=s.baseRoughness;const a=i.specularStrength*s.specularScale;this.specularIntensityMap=a>0&&(h=t.specular)!=null?h:null,this.specularIntensity=a>0?a:this.getPresentationBaseSpecularIntensity(s),this.paintingUniforms.tDetailNormal.value=i.detailNormalEnabled&&i.detailNormalStrength>0&&(f=t.detailNormal)!=null?f:null,this.paintingUniforms.uDetailTiling.value.copy(n);const o=i.bumpStrength>0||i.parallaxEnabled&&i.parallaxScale>0||i.selfShadowEnabled;this.bumpMap=o&&(g=t.height)!=null?g:null,this.bumpScale=1,this.aoMap=(v=t.ao)!=null?v:null,this.aoMapIntensity=1;const l=i.clearcoatEnabled&&s.clearcoatStrength>0&&(m=t.varnish)!=null?m:null,c=l!==this.clearcoatMap;this.clearcoatMap=l,this.clearcoat=i.clearcoatEnabled?s.clearcoatStrength:0,this.clearcoatRoughness=s.clearcoatStrength>0?s.clearcoatRoughness:i.clearcoatRoughnessValue,c&&(this.needsUpdate=!0),this.applyPreset(i)}setReducedMotion(t){this.reducedMotion!==t&&(this.reducedMotion=t,this.paintingUniforms.uReducedMotionScalar.value=1)}applyPresentation(t,n){this.activePresentation=t,this.applyPresentationSettings(n)}setKeyLightDirView(t){this.paintingUniforms.uKeyLightDir.value.copy(t)}setAlbedoOnly(t){this.albedoOnlyEnabled!==t&&(this.albedoOnlyEnabled=t,this.paintingUniforms.uAlbedoOnly.value=t?1:0,this.needsUpdate=!0)}setShadowProfileScale(t){this.paintingUniforms.uShadowProfileScale.value=Math.max(0,Math.min(2,t))}setShadowDebug(t){this.shadowDebugEnabled!==t&&(this.shadowDebugEnabled=t,this.needsUpdate=!0)}setShadowFilterRadius(t,n){this.paintingUniforms.uShadowFilterRadius.value=Math.max(0,t),n!==this.shadowFilterEnabled&&(this.shadowFilterEnabled=n,this.needsUpdate=!0)}get shaderVariant(){return this.currentVariant}activeMaps(){const t=["albedo"];return this.normalMap&&t.push("normal"),this.hasDetailNormal&&t.push("detailNormal"),this.bumpMap&&t.push("height"),this.roughnessMap&&t.push("roughness"),this.specularIntensityMap&&t.push("specular"),this.aoMap&&t.push("ao"),(this.clearcoatMap||this.clearcoat>0)&&t.push("varnish"),this.emissiveMap&&this.emissiveIntensity>0&&t.push("albedoFill"),t}applyPresentationSettings(t){const n=Tn[this.activePresentation];this.roughness=n.baseRoughness,this.clearcoatRoughness=n.clearcoatStrength>0?n.clearcoatRoughness:t.clearcoatRoughnessValue;const i=t.specularStrength*n.specularScale;this.specularIntensity=i>0?i:this.getPresentationBaseSpecularIntensity(n),n.clearcoatStrength<=0?this.clearcoat=0:t.clearcoatEnabled?this.clearcoat=n.clearcoatStrength:this.clearcoat=0}getPresentationBaseSpecularIntensity(t){return t.clearcoatStrength>0?.06:t.specularScale>0?.04:.015}}function z0(r){const e=r.image;let t=1,n=1;return"naturalWidth"in e?(t=e.naturalWidth||e.width||1,n=e.naturalHeight||e.height||1):(t=e.width||1,n=e.height||1),{width:t,height:n,aspect:t/n}}function H0(r,e,t){const n=Number.isFinite(r)&&r>0?r:1,i=e/t;return n>=i?{width:e,height:e/n}:{width:t*n,height:t}}class G0{constructor(e,t){x(this,"group");x(this,"artworkMesh");x(this,"artworkBodyMesh");x(this,"artworkBodyMaterial");x(this,"material");x(this,"_artworkAspect",1);x(this,"_artworkWidth",4);x(this,"_artworkHeight",5.7);x(this,"currentSegments");x(this,"scene");x(this,"detailTilesPerWorldUnit",2);x(this,"_lastAspectSource","texture");x(this,"_lastManifestDimensions",null);x(this,"activePresentation",yr);x(this,"activeBodyDepth",es.artworkBodyDepth);this.scene=e,this.group=new ti,this.currentSegments=t.artworkSegments;const n=this.makeArtworkGeometry(this.currentSegments);this.material=new B0(t),this.artworkMesh=new Ge(n,this.material),this.artworkMesh.castShadow=!1,this.artworkMesh.receiveShadow=!1,this.artworkMesh.renderOrder=3,this.artworkBodyMaterial=new yn({color:new Pe(Tn[this.activePresentation].backerColor),roughness:.9,metalness:0}),this.artworkBodyMesh=new Ge(new Nt(1,1,1),this.artworkBodyMaterial),this.artworkBodyMesh.castShadow=!0,this.artworkBodyMesh.receiveShadow=!1,this.artworkBodyMesh.renderOrder=2,this.group.add(this.artworkBodyMesh,this.artworkMesh),this.updateMountedBody(),e.add(this.group)}getArtworkMeshObject(){return this.artworkMesh}makeArtworkGeometry(e){const t=new Kt(4,5.7,e,e),n=t.getAttribute("uv");return n&&!t.getAttribute("uv1")&&t.setAttribute("uv1",n.clone()),t.computeTangents(),t}applyPreset(e){if(this.material.applyPreset(e),e.artworkSegments===this.currentSegments)return;this.currentSegments=e.artworkSegments;const t=this.artworkMesh.geometry,n=this.makeArtworkGeometry(this.currentSegments);this.artworkMesh.geometry=n,t.dispose(),this.artworkMesh.scale.set(this._artworkWidth/4,this._artworkHeight/5.7,1),this.updateMountedBody()}applyPresentation(e,t){const n=Tn[e];this.activePresentation=e,this.activeBodyDepth=n.bodyDepth,this.artworkBodyMaterial.color.set(n.backerColor),this.material.applyPresentation(e,t),this.updateMountedBody()}updateAspect(e,t){let n,i;t&&Number.isFinite(t.width)&&t.width>0&&Number.isFinite(t.height)&&t.height>0?(n=t.width/t.height,i="manifest"):(n=z0(e).aspect,i="texture"),this._artworkAspect=n;const{width:s,height:a}=H0(n,4.2,5.8);this._artworkWidth=s,this._artworkHeight=a,this.artworkMesh.scale.set(s/4,a/5.7,1),this._lastAspectSource=i,this._lastManifestDimensions=t!=null?t:null}setPaintingTextures(e,t,n,i=yr){this.applyPresentation(i,t),this.updateAspect(e.albedo,n);const s=new he(this._artworkWidth*this.detailTilesPerWorldUnit,this._artworkHeight*this.detailTilesPerWorldUnit);this.material.applyTextures(e,s,t),this.updateMountedBody()}setTexture(e,t){this.setPaintingTextures({albedo:e},t)}get artworkAspect(){return this._artworkAspect}get artworkWidth(){return this._artworkWidth}get artworkHeight(){return this._artworkHeight}get bodyBackExtent(){return this.activeBodyDepth+es.artworkBodyFrontClearance}get lastAspectSource(){return this._lastAspectSource}get lastManifestDimensions(){return this._lastManifestDimensions}dispose(){this.scene.remove(this.group),this.artworkMesh.geometry.dispose(),this.material.dispose(),this.artworkBodyMesh.geometry.dispose(),this.artworkBodyMaterial.dispose()}updateMountedBody(){const e=this._artworkWidth,t=this._artworkHeight;this.artworkBodyMesh.scale.set(e,t,this.activeBodyDepth),this.artworkBodyMesh.position.set(0,0,-(this.activeBodyDepth*.5+es.artworkBodyFrontClearance))}}class V0{constructor(){x(this,"cache",new Map);x(this,"currentAnisotropy",1)}generate(e,t,n){const i=Math.max(64,n!=null?n:256),s=`${e}::${t}::${i}`,a=this.cache.get(s);if(a)return a;const o=this.hash(e),l=Math.max(64,Math.floor(i/2));let c;switch(t){case"normal":c=this.generateNormal(o,i,14,6,3,.42);break;case"detailNormal":c=this.generateNormal(o*7+13,i,18,7,2.5,1.1),c.wrapS=1e3,c.wrapT=1e3;break;case"height":c=this.generateHeight(o,i);break;case"roughness":c=this.generateRoughness(o,l);break;case"specular":c=this.generateSpecular(o,l);break;case"ao":c=this.generateAO(o,i);break;case"varnish":c=this.generateVarnish(o,l);break;case"albedo":default:c=this.generateAlbedo(o);break}return this.cache.set(s,c),c.anisotropy=this.currentAnisotropy,c}disposeAll(){this.cache.forEach(e=>e.dispose()),this.cache.clear()}setAnisotropy(e){const t=Math.max(1,e|0);t!==this.currentAnisotropy&&(this.currentAnisotropy=t,this.cache.forEach(n=>{n.anisotropy=t,n.needsUpdate=!0}))}generateNormal(e,t,n,i,s,a){const o=new Uint8Array(t*t*4),l=.055*a,c=.14*a;for(let d=0;d<t;d+=1)for(let u=0;u<t;u+=1){const h=(d*t+u)*4,f=this.valueNoise2d(u*l,d*l,e),g=this.valueNoise2d((u+1)*l,d*l,e),v=this.valueNoise2d(u*l,(d+1)*l,e),m=this.valueNoise2d(u*c,d*c,e+17),p=this.valueNoise2d((u+1)*c,d*c,e+17),S=this.valueNoise2d(u*c,(d+1)*c,e+17),y=(g-f)*n+(p-m)*i,b=(v-f)*n+(S-m)*i;o[h+0]=this.clamp8(128+y*28),o[h+1]=this.clamp8(128+b*28),o[h+2]=255,o[h+3]=255}return this.makeDataTexture(o,t,t,!1)}generateHeight(e,t){const n=new Uint8Array(t*t*4);for(let i=0;i<t;i+=1)for(let s=0;s<t;s+=1){const a=(i*t+s)*4,o=this.valueNoise2d(s*.04,i*.04,e)*90,l=this.valueNoise2d(s*.12,i*.09,e+7)*40,c=this.valueNoise2d(s*.55,i*.55,e+31)*3,d=this.clamp8(o+l+c);n[a+0]=d,n[a+1]=d,n[a+2]=d,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateRoughness(e,t){const n=new Uint8Array(t*t*4);for(let i=0;i<t;i+=1)for(let s=0;s<t;s+=1){const a=(i*t+s)*4,o=this.valueNoise2d(s*.07,i*.07,e+3),l=this.valueNoise2d(s*.24,i*.24,e+19),c=o*.65+l*.35,d=this.clamp8(140+c*100);n[a+0]=d,n[a+1]=d,n[a+2]=d,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateSpecular(e,t){const n=new Uint8Array(t*t*4);for(let s=0;s<t*t;s+=1)n[s*4+0]=6,n[s*4+1]=6,n[s*4+2]=6,n[s*4+3]=255;const i=4+e%4;for(let s=0;s<i;s+=1){const a=e*(s+7)%t,o=e*(s+13)*3%t,l=14+e*(s+1)%18;for(let c=0;c<t;c+=1)for(let d=0;d<t;d+=1){const u=d-a,h=c-o,f=u*u+h*h,g=Math.exp(-f/(l*l))*50,v=(c*t+d)*4,m=this.clamp8(n[v]+g);n[v+0]=m,n[v+1]=m,n[v+2]=m}}return this.makeDataTexture(n,t,t,!1)}generateAO(e,t){const n=new Uint8Array(t*t*4);for(let i=0;i<t;i+=1)for(let s=0;s<t;s+=1){const a=(i*t+s)*4,o=this.valueNoise2d(s*.11,i*.11,e)*18,l=this.clamp8(237+o);n[a+0]=l,n[a+1]=l,n[a+2]=l,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateVarnish(e,t){const n=new Uint8Array(t*t*4);for(let i=0;i<t;i+=1)for(let s=0;s<t;s+=1){const a=(i*t+s)*4,o=this.valueNoise2d(s*.035,i*.035,e+101),l=this.valueNoise2d(s*.18,i*.18,e+149),c=this.clamp8((o*.75+l*.25)*85);n[a+0]=c,n[a+1]=c,n[a+2]=c,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateAlbedo(e){const n=new Uint8Array(16384),i=e%32,s=200+i*3%30,a=200+i*5%30,o=200+i*7%30;for(let l=0;l<64*64;l+=1)n[l*4+0]=s,n[l*4+1]=a,n[l*4+2]=o,n[l*4+3]=255;return this.makeDataTexture(n,64,64,!0)}makeDataTexture(e,t,n,i){const s=new xo(e,t,n,1023,1009);return s.colorSpace=i?Ot:on,s.wrapS=1e3,s.wrapT=1e3,s.minFilter=1008,s.magFilter=1006,s.generateMipmaps=!0,s.needsUpdate=!0,s}clamp8(e){return e<0?0:e>255?255:e|0}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t||1}valueNoise2d(e,t,n){const i=Math.floor(e)|0,s=Math.floor(t)|0,a=e-Math.floor(e),o=t-Math.floor(t),l=a*a*(3-2*a),c=o*o*(3-2*o),d=this.latticeHash(i,s,n),u=this.latticeHash(i+1,s,n),h=this.latticeHash(i,s+1,n),f=this.latticeHash(i+1,s+1,n);return d*(1-l)*(1-c)+u*l*(1-c)+h*(1-l)*c+f*l*c}latticeHash(e,t,n){let i=n*1664525+e*1013904223>>>0;return i=(i^t*1540483477)>>>0,i=(i^i>>>16)>>>0,i=Math.imul(i,73244475)>>>0,i=(i^i>>>16)>>>0,(i>>>0)/4294967295}}function Ut(r,e,t){return Math.max(e,Math.min(t,r))}function jt(r,e,t,n){return n<=0?r:r+(e-r)*(1-Math.exp(-t*n))}const wd=[-1,1],Md=.45,Ed=.24;function W0(r){return{x:Math.max(0,(r.artworkWidth-r.visibleWidth)*.5+r.overscrollX),y:Math.max(0,(r.artworkHeight-r.visibleHeight)*.5+r.overscrollY)}}function Fo(r,e,t,n,i){const s=Math.max(0,t)*.5,a=Math.max(0,n)*.5,o=Math.max(0,i),l=Math.sin(r),c=Math.cos(r),d=Math.sin(e),u=Math.cos(e);let h=0;const f=(g,v,m)=>{const p=-g*d+(v*l+m*c)*u;h=Math.max(h,-p)};for(const g of wd)for(const v of wd){const m=g*s,p=v*a;f(m,p,0),f(m,p,-o)}return h}function X0(r){const e=Math.max(0,Math.abs(r.wallZ)-Math.max(0,r.clearanceMargin)),t=Number.isFinite(r.targetRotX)?r.targetRotX:0,n=Number.isFinite(r.targetRotY)?r.targetRotY:0;if(e<=0||t===0&&n===0)return{targetRotX:0,targetRotY:0,appliedScale:0,maxBackShift:0,availableClearance:e};const i=Fo(t,n,r.artworkWidth,r.artworkHeight,r.bodyBackDepth);if(i<=e)return{targetRotX:t,targetRotY:n,appliedScale:1,maxBackShift:i,availableClearance:e};let s=0,a=1;for(let d=0;d<18;d+=1){const u=(s+a)*.5;Fo(t*u,n*u,r.artworkWidth,r.artworkHeight,r.bodyBackDepth)<=e?s=u:a=u}const o=Ut(s,0,1),l=t*o,c=n*o;return{targetRotX:l,targetRotY:c,appliedScale:o,maxBackShift:Fo(l,c,r.artworkWidth,r.artworkHeight,r.bodyBackDepth),availableClearance:e}}const ts=7,$0=18,Y0=3.5,ea=.2,Oo=.12,Td=1.04,q0=.65,Ad=1.5,ta=.35,Z0=.25,K0=.004,Cd=12,ns=3.5,Bo=3,Rd=4,na=5,ia=4.5,ra=-.6,Pd=.15,xr=.88,j0=.1,sa=Number.MAX_SAFE_INTEGER,is=["normal","detailNormal","height","roughness","specular","ao","varnish"],zo=2,Q0=2500,J0=250,aa={"critical-now":0,"near-next":1,background:2},ey=["normal","detailNormal","height"];class ty{constructor(e,t,n,i,s,a){x(this,"diagnostics",rn("gallery"));x(this,"artworks");x(this,"currentIndex",0);x(this,"artworkMesh");x(this,"textureManager");x(this,"procedural");x(this,"camera");x(this,"_fovTanCache",NaN);x(this,"_fovTanForFov",NaN);x(this,"viewportMetricsProvider");x(this,"reducedMotion",!1);x(this,"currentPreset",null);x(this,"artworkLoadToken",0);x(this,"inspectionMode",!1);x(this,"pendingResetAfterArtworkLoad",!1);x(this,"lastResetFitZoom",ts);x(this,"frameBudgetNavigationMarker",null);x(this,"interactionActive",!1);x(this,"interactionActiveSince",0);x(this,"interactionFrameCount",0);x(this,"interactionFrameTotalMs",0);x(this,"interactionFrameDropped",0);x(this,"prefetchedTextureSets",new Set);x(this,"fullPrefetchScheduled",!1);x(this,"readiness");x(this,"prefetchQueue",[]);x(this,"activePrefetches",new Set);x(this,"prefetchQueueRunning",!1);x(this,"prefetchSequence",0);x(this,"readinessRadius",zo);x(this,"startupReadinessMode","full");x(this,"startupEntryTargetCount",Number.MAX_SAFE_INTEGER);x(this,"pendingNavigationProbe",null);x(this,"proceduralQueue",new Set);x(this,"proceduralQueueRunning",!1);x(this,"renderDirtyFrames",8);x(this,"disposed",!1);x(this,"targetX",0);x(this,"targetY",0);x(this,"zoom",ts);x(this,"targetZoom",ts);x(this,"panX",0);x(this,"panY",0);x(this,"targetPanX",0);x(this,"targetPanY",0);x(this,"lastUpdateTime",0);x(this,"onNavigateCallback",null);this.artworks=e,this.artworkMesh=t,this.textureManager=n,this.camera=i,this.procedural=s!=null?s:new V0,this.viewportMetricsProvider=a!=null?a:null,this.readiness=e.map((o,l)=>({index:l,artworkId:o.id,albedoLoaded:!1,pbrLoaded:!o.textureSet,proceduralReady:!1,materialApplied:!1,shaderCompiled:!1,gpuWarmed:!1,pbrMs:0,proceduralMs:0,lastWarmMs:0,lastReason:"init",updatedAt:0}))}setFrameBudgetMarker(e){this.frameBudgetNavigationMarker=e}setInteractionActive(e){if(e!==this.interactionActive)if(e)this.interactionActive=!0,this.interactionActiveSince=this.now(),this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.markRenderDirty(4),this.diagnostics.debug("interaction-start","Pointer interaction window opened; non-critical prefetch paused");else{const t=this.now()-this.interactionActiveSince;this.diagnostics.info("interaction-end","Pointer interaction window ended; resuming background work",{durationMs:Math.round(t),frameCount:this.interactionFrameCount,avgFrameMs:this.interactionFrameCount>0?Math.round(this.interactionFrameTotalMs/this.interactionFrameCount*10)/10:0,droppedFrames:this.interactionFrameDropped,droppedFramePct:this.interactionFrameCount>0?Math.round(this.interactionFrameDropped/this.interactionFrameCount*100):0}),this.interactionActive=!1,this.markRenderDirty(2),this.interactionActiveSince=0,this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.prefetchQueue.length>0&&!this.prefetchQueueRunning&&this.drainPrefetchQueue()}}markInteractionFrame(e){this.interactionActive&&(this.interactionFrameCount+=1,this.interactionFrameTotalMs+=e,e>33&&(this.interactionFrameDropped+=1))}markRenderDirty(e=4){this.renderDirtyFrames=Math.max(this.renderDirtyFrames,Math.max(1,Math.round(e)))}configureReadinessProfile(e){this.readinessRadius=Ut(Math.round(e.criticalRadius),1,3),this.diagnostics.info("readiness-profile","Applied readiness profile",{criticalRadius:this.readinessRadius,artworkCount:this.artworks.length})}configureStartupReadiness(e){this.startupReadinessMode=e.mode,this.startupEntryTargetCount=e.mode==="full"?this.artworks.length:Math.max(1,Math.min(this.artworks.length,Math.round(e.entryTargetCount))),this.diagnostics.info("startup-readiness","Applied startup readiness contract",{mode:this.startupReadinessMode,entryTargetCount:this.startupEntryTargetCount,artworkCount:this.artworks.length,criticalRadius:this.readinessRadius})}getStartupEntryTargets(e=0){const t=this.getBudgetedWarmOrder(e);return this.startupReadinessMode==="full"?t:t.slice(0,this.startupEntryTargetCount)}get isStagedStartup(){return this.startupReadinessMode!=="full"&&this.startupEntryTargetCount<this.artworks.length}applyPreset(e){const t=this.currentPreset!==null;this.currentPreset=e,this.textureManager.setAnisotropyDivisor(e.anisotropyDivisor),this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy()),this.diagnostics.debug("preset-applied","Applied gallery quality preset",{shaderVariant:e.shaderVariant,anisotropy:this.textureManager.getEffectiveAnisotropy(),proceduralTileSize:e.proceduralTileSize,proceduralInspectionTileSize:e.proceduralInspectionTileSize,specularStrength:e.specularStrength,selfShadowBias:e.selfShadowBias}),this.markRenderDirty(4),t&&this.textureManager.get(this.artworks[this.currentIndex].image)&&this.showArtwork(this.currentIndex)}setInspectionMode(e){e!==this.inspectionMode&&(this.inspectionMode=e,this.markRenderDirty(4),this.diagnostics.info("inspection-mode",`Inspection mode ${e?"enabled":"disabled"}`),this.currentPreset&&this.showArtwork(this.currentIndex))}async init(){const e=this.artworks.map(o=>{var c,d,u,h,f,g,v,m;const l=wi(o);return{id:o.id,bundleId:(d=(c=l.primary)==null?void 0:c.bundleId)!=null?d:null,declaredImageUrlType:(h=(u=l.primary)==null?void 0:u.declaredUrlType)!=null?h:null,resolvedImageUrlType:(g=(f=l.primary)==null?void 0:f.resolvedUrlType)!=null?g:null,hasEmbeddedFallback:!!l.fallback,embeddedFallbackUrlType:(m=(v=l.fallback)==null?void 0:v.resolvedUrlType)!=null?m:null,dimensions:o.dimensions}});this.diagnostics.info("init","Starting gallery init — preloading albedo textures",{artworkCount:e.length,artworks:e}),await this.textureManager.preloadArtworkAlbedos(this.artworks),this.readiness.forEach(o=>this.markReadiness(o.index,"albedoLoaded","init-preload"));const t=this.artworks.filter(o=>!!o.textureSet).length,n=new Set(this.getStartupEntryTargets(0)),i=({artwork:o,index:l})=>!!o.textureSet&&l<sa&&n.has(l),s=this.artworks.map((o,l)=>({artwork:o,index:l})).filter(i);this.diagnostics.info("init","Preloading entry-target PBR texture sets under loading overlay (v0.68 staged-readiness contract)",{mode:this.startupReadinessMode,pbrCount:s.length,textureSetCount:t,totalArtworks:this.artworks.length,entryTargetCount:n.size,safetyCap:sa,cappedArtworks:Math.max(0,this.artworks.length-sa)}),await Promise.allSettled(s.map(({artwork:o,index:l})=>this.preloadAuthoredTextureSet(l,"init-pbr-preload").then(()=>{this.prefetchedTextureSets.add(l),this.diagnostics.debug("preload-all","PBR texture set preloaded during init",{index:l,artworkId:o.id})})));const a=this.artworks.map((o,l)=>({artwork:o,index:l})).filter(({artwork:o,index:l})=>!!o.textureSet&&!this.prefetchedTextureSets.has(l));if(a.length>0){this.diagnostics.info("init","Queuing deferred artworks for deterministic near-next prefetch (v0.68 staged-readiness)",{mode:this.startupReadinessMode,deferredCount:a.length,entryTargetCount:n.size,safetyCap:sa});for(const{index:o}of a)this.scheduleTextureSetPrefetch(o,"init-staged-deferred-near-next","near-next")}this.preGenerateProceduralWindow(0,this.readinessRadius,"init-critical-window"),this.logGalleryScaleValidation(),this.diagnostics.info("init","Preload complete — showing first artwork",{artworkCount:this.artworks.length,pbrPreloaded:s.length,criticalProceduralReady:this.getCriticalWindowIndices(0,this.readinessRadius).length}),this.pendingResetAfterArtworkLoad=!0,await this.showArtwork(0),this.scheduleFullTextureSetPrefetch()}addZoomDelta(e){const t=this.getViewportMetrics(),n=this.getZoomBounds(t);this.targetZoom=this.clampZoom(this.targetZoom+e,n),this.clampPanTargets(t,n),this.markRenderDirty(4)}setPanOffset(e,t){const n=this.getViewportMetrics(),i=this.getZoomBounds(n),{x:s,y:a}=this.getPanLimits(this.targetZoom,n,i);this.targetPanX=Ut(this.targetPanX+e,-s,s),this.targetPanY=Ut(this.targetPanY+t,-a,a),this.markRenderDirty(4)}canPan(){const{x:e,y:t}=this.getPanLimits(this.targetZoom);return e>.01||t>.01}getHoverRotationScale(){const e=this.getZoomBounds(),t=Math.max(.001,e.maxOverviewZoom-e.minInspectionZoom),n=(this.clampZoom(this.targetZoom,e)-e.minInspectionZoom)/t;return{x:.03+n*.13,y:.018+n*.062}}async showArtwork(e){var E,L,M,_,I,B,F,N,Y,X,Q,q,re,ce,ve,te,Ve,J,oe,_e,me,Ue,ke,We,rt,D,ft,Ze;const t=this.artworks[e],n=this.resolvePresentation(e),i=Tn[n],s=wi(t),a=this.textureManager.getArtworkAlbedoSelection(t),o=(M=(L=a==null?void 0:a.selectedUrl)!=null?L:(E=s.primary)==null?void 0:E.resolvedUrl)!=null?M:t.image,l=this.textureManager.get(o),c=++this.artworkLoadToken,d=this.currentPreset,u=((_=this.pendingNavigationProbe)==null?void 0:_.toIndex)===e?this.pendingNavigationProbe:null;if(u&&!u.readinessBefore){const Ie=this.readiness[e];Ie&&(u.readinessBefore={pbrLoaded:Ie.pbrLoaded,proceduralReady:Ie.proceduralReady,gpuWarmed:Ie.gpuWarmed})}if(this.diagnostics.debugLazy("show-artwork","Preparing artwork render state",()=>{var Ie,Ee,pt,De,Be,k,w,Z,ie,se;return{index:e,artworkId:t.id,token:c,bundleId:(pt=(Ee=a==null?void 0:a.bundleId)!=null?Ee:(Ie=s.primary)==null?void 0:Ie.bundleId)!=null?pt:null,hasEmbeddedFallback:!!t.webglImage,albedoSourceMode:(De=a==null?void 0:a.sourceMode)!=null?De:"declared-image",albedoDeclaredUrlType:(k=(Be=s.primary)==null?void 0:Be.declaredUrlType)!=null?k:"local-relative",albedoResolvedUrlType:(w=a==null?void 0:a.selectedUrlType)!=null?w:"local-relative",usedEmbeddedFallback:(Z=a==null?void 0:a.usedEmbeddedFallback)!=null?Z:!1,generatedFallback:(ie=a==null?void 0:a.generatedFallback)!=null?ie:!1,dimensions:t.dimensions,surface:(se=t.surface)!=null?se:null,presentation:n}}),!l||!d){this.diagnostics.warn("show-artwork-missing-state","Cannot render artwork because preset or albedo texture is missing",{artworkId:t.id,hasAlbedo:!!l,hasPreset:!!d,bundleId:(F=(B=a==null?void 0:a.bundleId)!=null?B:(I=s.primary)==null?void 0:I.bundleId)!=null?F:null,albedoSourceMode:(N=a==null?void 0:a.sourceMode)!=null?N:"declared-image",albedoDeclaredUrlType:(X=(Y=s.primary)==null?void 0:Y.declaredUrlType)!=null?X:"local-relative",albedoResolvedUrlType:(Q=a==null?void 0:a.selectedUrlType)!=null?Q:"local-relative"});return}const h=await this.preloadAuthoredTextureSet(e,"show-artwork");if(t.textureSet&&this.prefetchedTextureSets.add(e),c!==this.artworkLoadToken){this.diagnostics.debugLazy("stale-load","Discarded stale artwork load",()=>({artworkId:t.id,token:c,latestToken:this.artworkLoadToken}));return}const f={albedo:(q=h.albedo)!=null?q:l},g=this.now();let v=!1;for(const Ie of is)h[Ie]?f[Ie]=h[Ie]:this.shouldFillRole(Ie,d,i)&&(f[Ie]=this.generateProceduralMap(t.id,Ie,d),v=!0);this.markReadiness(e,"proceduralReady","show-artwork",{proceduralMs:v?this.now()-g:0}),this.artworkMesh.setPaintingTextures(f,d,t.dimensions,n);const m=this.clampHoverTargetToStageClearance(this.targetX,this.targetY);this.targetX=m.targetRotX,this.targetY=m.targetRotY,this.markReadiness(e,"materialApplied","show-artwork"),this.markRenderDirty(8);const p={albedo:h.albedo?"authored":"preloaded"};for(const Ie of is)h[Ie]?p[Ie]="authored":f[Ie]?p[Ie]="procedural":p[Ie]="absent";this.diagnostics.debugLazy("show-artwork-maps","Resolved texture map for artwork",()=>({artworkId:t.id,maps:p,shaderVariant:d.shaderVariant,inspectionMode:this.inspectionMode,presentation:n}));const S=this.textureManager.isFallback(o,"albedo");S&&this.diagnostics.warn("show-artwork-fallback","Central 3D painting is using a GENERATED FALLBACK texture — the customer image could not be loaded as a WebGL texture",{artworkId:t.id,bundleId:(ve=(ce=a==null?void 0:a.bundleId)!=null?ce:(re=s.primary)==null?void 0:re.bundleId)!=null?ve:null,imageUrl:(Ve=(te=s.primary)==null?void 0:te.declaredUrl)!=null?Ve:t.image,resolvedImageUrl:(J=a==null?void 0:a.selectedUrl)!=null?J:o,albedoSourceMode:(oe=a==null?void 0:a.sourceMode)!=null?oe:"declared-image",usedEmbeddedFallback:(_e=a==null?void 0:a.usedEmbeddedFallback)!=null?_e:!1,manifestWidth:(me=t.dimensions)==null?void 0:me.width,manifestHeight:(Ue=t.dimensions)==null?void 0:Ue.height,fallbackUsed:!0});const y=this.getViewportMetrics(),b=this.getZoomBounds(y),U=this.getPanLimits(b.resetFitZoom,y,b),P=this.isPortraitResetArtwork();this.diagnostics.info("show-artwork-complete","Artwork is ready",{artworkId:t.id,bundleId:(rt=(We=a==null?void 0:a.bundleId)!=null?We:(ke=s.primary)==null?void 0:ke.bundleId)!=null?rt:null,activeMaps:this.artworkMesh.material.activeMaps(),inspectionMode:this.inspectionMode,fallbackUsed:S,albedoSourceMode:(D=a==null?void 0:a.sourceMode)!=null?D:"declared-image",usedEmbeddedFallback:(ft=a==null?void 0:a.usedEmbeddedFallback)!=null?ft:!1,generatedFallback:(Ze=a==null?void 0:a.generatedFallback)!=null?Ze:S,aspectSource:this.artworkMesh.lastAspectSource,manifestDimensions:this.artworkMesh.lastManifestDimensions,paintingWidth:this.artworkMesh.artworkWidth,paintingHeight:this.artworkMesh.artworkHeight,paintingAspect:this.artworkMesh.artworkAspect,resetZoom:b.resetFitZoom,minZoom:b.minInspectionZoom,closeZoomMinVisibleFraction:Oo,maxZoom:b.maxOverviewZoom,overviewHeadroom:b.maxOverviewZoom-b.resetFitZoom,panOverscrollX:Md,panOverscrollY:Ed,panLimitAtReset:{x:U.x,y:U.y},portraitResetApplied:P,portraitResetExtra:P?Ad:0,usableViewportWidth:y.usableW,usableViewportHeight:y.usableH,usableViewportFractionX:y.usableFracX,usableViewportFractionY:y.usableFracY,viewportOcclusion:{top:y.occlusionTop,right:y.occlusionRight,bottom:y.occlusionBottom,left:y.occlusionLeft},parallaxEnabled:d.parallaxEnabled,parallaxScale:d.parallaxScale,presentation:n,specularStrength:d.specularStrength,selfShadowBias:d.selfShadowBias,readiness:this.readiness[e]}),this.pendingResetAfterArtworkLoad?(this.pendingResetAfterArtworkLoad=!1,this.resetView()):(this.targetZoom=this.clampZoom(this.targetZoom,b),this.zoom=this.clampZoom(this.zoom,b)),this.clampPanTargets(y,b),this.prefetchAdjacentArtworks(e),this.queueProceduralWindow(e,this.readinessRadius,"show-artwork-adjacent"),this.logNavigationReadinessVerdict(e)}getBudgetedWarmOrder(e=this.currentIndex){const t=this.getCriticalWindowIndices(e,this.readinessRadius),n=this.artworks.map((i,s)=>s).filter(i=>!t.includes(i));return[...t,...n]}markGpuWarmed(e,t,n){this.markReadiness(e,"gpuWarmed",n,{lastWarmMs:t})}markShaderCompiled(e,t){this.markReadiness(e,"shaderCompiled",t)}markAllShaderCompiled(e){this.readiness.forEach(t=>this.markReadiness(t.index,"shaderCompiled",e))}promotePrefetchWindow(e,t){this.scheduleTextureSetPrefetch(e,t,"critical-now"),this.getCriticalWindowIndices(e,this.readinessRadius).forEach(n=>{n!==e&&this.scheduleTextureSetPrefetch(n,`${t}:nearby`,"near-next")}),this.queueProceduralWindow(e,this.readinessRadius,`${t}:nearby`)}hasReadinessWork(){if(this.prefetchQueue.length>0||this.activePrefetches.size>0)return!0;const e=this.readiness[this.currentIndex];return!!e&&(!e.pbrLoaded||!e.proceduralReady||!e.gpuWarmed)}getReadinessLedger(){return this.readiness.map(e=>({...e}))}getFullGalleryReadinessSummary(){const e=this.readiness,t=c=>c.albedoLoaded&&c.pbrLoaded&&c.proceduralReady&&c.materialApplied&&c.shaderCompiled&&c.gpuWarmed,n=e.filter(t).length,i=0,s=e.filter(c=>!t(c)).map(c=>c.artworkId),a=this.isStagedStartup,o=a?new Set(this.getStartupEntryTargets(this.currentIndex)):null,l=o?e.filter(c=>!o.has(c.index)&&!t(c)).length:0;return{totalArtworks:this.artworks.length,fullyReadyCount:n,pendingCount:this.artworks.length-n,gpuWarmedCount:e.filter(c=>c.gpuWarmed).length,pbrLoadedCount:e.filter(c=>c.pbrLoaded).length,proceduralReadyCount:e.filter(c=>c.proceduralReady).length,memoryCapApplied:!1,preloadMode:a?"staged":"strict",unresolvedArtworkIds:s,deferredArtworkCount:l,overflowArtworkCount:i}}getEntryWarmTargets(e,t){const n=Math.max(1,Math.min(this.artworks.length,Math.round(t)));return this.getBudgetedWarmOrder(e).slice(0,n)}async ensureEntryReadiness(e,t){var n;for(const i of e)await this.preloadAuthoredTextureSet(i,`${t}:critical-now`),(n=this.artworks[i])!=null&&n.textureSet&&this.prefetchedTextureSets.add(i),this.preGenerateProceduralWindow(i,0,`${t}:critical-now`),this.scheduleTextureSetPrefetch(i,`${t}:critical-now`,"critical-now")}getEntryReadinessContract(e){const t=[];for(const n of e){const i=this.readiness[n];if(!i){t.push(n);continue}(!i.albedoLoaded||!i.pbrLoaded||!i.proceduralReady||!i.materialApplied||!i.gpuWarmed)&&t.push(n)}return{ready:t.length===0,pendingIndices:t,targetIndices:[...e]}}warmArtworkForGPU(e,t="gpu-warm"){var h,f,g,v,m;const n=this.now(),i=this.artworks[e],s=this.resolvePresentation(e),a=Tn[s],o=this.currentPreset;if(!i||!o)return!1;const l=(v=(g=(h=this.textureManager.getArtworkAlbedoSelection(i))==null?void 0:h.selectedUrl)!=null?g:(f=wi(i).primary)==null?void 0:f.resolvedUrl)!=null?v:i.image,c=this.textureManager.get(l);if(!c)return this.diagnostics.warn("warm-gpu","Cannot warm artwork because albedo is not cached",{index:e,artworkId:i.id}),!1;const d={};if(i.textureSet){const p=i.textureSet.albedo?this.textureManager.getForRole(i.textureSet.albedo.url,"albedo"):void 0;p&&(d.albedo=p);for(const S of is){const y=i.textureSet[S];if(!y)continue;const b=this.textureManager.getForRole(y.url,S);b&&(d[S]=b)}}const u={albedo:(m=d.albedo)!=null?m:c};for(const p of is)d[p]?u[p]=d[p]:this.shouldFillRole(p,o,a)&&(u[p]=this.generateProceduralMap(i.id,p,o));return this.artworkMesh.setPaintingTextures(u,o,i.dimensions,s),this.markReadiness(e,"proceduralReady",t),this.markReadiness(e,"materialApplied",t),this.diagnostics.debug("warm-gpu","Cached artwork textures bound for GPU warm render",{index:e,artworkId:i.id,activeMaps:this.artworkMesh.material.activeMaps(),reason:t,bindMs:Math.round((this.now()-n)*10)/10}),!0}async preloadAuthoredTextureSet(e,t){const n=this.artworks[e];if(!(n!=null&&n.textureSet))return this.markReadiness(e,"pbrLoaded",t,{pbrMs:0}),{};const i=this.now(),s=await this.textureManager.preloadTextureSet(n.textureSet);return this.markReadiness(e,"pbrLoaded",t,{pbrMs:this.now()-i}),s}generateProceduralMap(e,t,n){const i=n.proceduralInspectionTileSize,a=this.inspectionMode&&i>0&&ey.includes(t)?i:n.proceduralTileSize;return this.procedural.generate(e,t,a)}preGenerateProceduralWindow(e,t,n){var s;const i=this.currentPreset;if(i)for(const a of this.getCriticalWindowIndices(e,t)){const o=this.artworks[a],l=Tn[this.resolvePresentation(a)],c=this.now();let d=0;for(const u of is)(s=o.textureSet)!=null&&s[u]||!this.shouldFillRole(u,i,l)||(this.generateProceduralMap(o.id,u,i),d+=1);this.markReadiness(a,"proceduralReady",n,{proceduralMs:d>0?this.now()-c:0}),this.diagnostics.debug("procedural-pregenerate","Procedural maps prepared for artwork",{index:a,artworkId:o.id,generated:d,reason:n,radius:t})}}getCriticalWindowIndices(e,t){const n=[],i=new Set,s=a=>{a<0||a>=this.artworks.length||i.has(a)||(i.add(a),n.push(a))};s(e);for(let a=1;a<=t;a+=1)s(e-a),s(e+a);return n}markReadiness(e,t,n,i={}){const s=this.readiness[e];s&&(s[t]=!0,s.lastReason=n,s.updatedAt=this.now(),i.pbrMs!==void 0&&(s.pbrMs=Math.round(i.pbrMs*10)/10),i.proceduralMs!==void 0&&(s.proceduralMs=Math.round(i.proceduralMs*10)/10),i.lastWarmMs!==void 0&&(s.lastWarmMs=Math.round(i.lastWarmMs*10)/10),this.markRenderDirty(2),this.diagnostics.debugLazy("readiness",`Artwork readiness updated: ${t}`,()=>({index:e,artworkId:s.artworkId,stage:t,reason:n,ready:{albedoLoaded:s.albedoLoaded,pbrLoaded:s.pbrLoaded,proceduralReady:s.proceduralReady,materialApplied:s.materialApplied,shaderCompiled:s.shaderCompiled,gpuWarmed:s.gpuWarmed},timings:{pbrMs:s.pbrMs,proceduralMs:s.proceduralMs,lastWarmMs:s.lastWarmMs}})))}now(){return typeof performance!="undefined"?performance.now():Date.now()}logGalleryScaleValidation(){const e=this.artworks.length,t=[4,15,20,50],n=t.reduce((i,s)=>Math.abs(s-e)<Math.abs(i-e)?s:i);this.diagnostics.info("validation","v0.23 gallery-size readiness profile",{artworkCount:e,nearestValidationBucket:n,validationBuckets:t,criticalWindowRadius:zo,criticalWindow:this.getCriticalWindowIndices(0,zo),warmOrderPreview:this.getBudgetedWarmOrder(0).slice(0,Math.min(e,12)),readinessLedger:this.getReadinessLedger()})}prefetchAdjacentArtworks(e){for(const t of[-1,1,-2,2]){const n=e+t;n<0||n>=this.artworks.length||this.scheduleTextureSetPrefetch(n,`adjacent:${t}`,"near-next")}}scheduleFullTextureSetPrefetch(){if(this.fullPrefetchScheduled)return;this.fullPrefetchScheduled=!0;let e=0;const t=()=>{var i;for(;e<this.artworks.length&&(!((i=this.artworks[e])!=null&&i.textureSet)||this.prefetchedTextureSets.has(e));)e+=1;if(e>=this.artworks.length){this.diagnostics.info("prefetch-complete","Idle artwork texture-set prefetch sweep complete",{artworkCount:this.artworks.length,prefetched:this.prefetchedTextureSets.size});return}const n=e;e+=1,this.scheduleTextureSetPrefetch(n,"idle-sweep","background",t)};this.scheduleIdle(t,500)}scheduleTextureSetPrefetch(e,t,n,i){const s=this.artworks[e];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(e)||this.activePrefetches.has(e)){i==null||i();return}const a=this.prefetchQueue.find(o=>o.index===e);if(a){aa[n]<aa[a.lane]&&(a.lane=n,a.reason=t,a.enqueuedAt=this.now(),this.sortPrefetchQueue()),i==null||i();return}this.prefetchQueue.push({index:e,reason:t,lane:n,enqueuedAt:this.now(),sequence:this.prefetchSequence++}),this.sortPrefetchQueue(),this.diagnostics.debug("prefetch-queued","Artwork texture-set prefetch queued",{index:e,artworkId:s.id,reason:t,lane:n,queueLength:this.prefetchQueue.length}),this.drainPrefetchQueue(i)}drainPrefetchQueue(e){if(this.prefetchQueueRunning){e==null||e();return}const t=()=>{if(!this.prefetchQueue.length){this.prefetchQueueRunning=!1,e==null||e();return}const n=this.prefetchQueue[0];if(this.interactionActive&&n&&n.lane!=="critical-now"){this.prefetchQueueRunning=!1,this.diagnostics.debug("prefetch-deferred-interaction","Non-critical prefetch paused for active interaction window",{deferredLane:n.lane,queueLength:this.prefetchQueue.length});return}const i=this.prefetchQueue.shift(),s=this.artworks[i.index];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(i.index)){this.scheduleIdle(t,50);return}this.activePrefetches.add(i.index),this.scheduleIdle(()=>{this.diagnostics.debug("prefetch-start","Prefetching artwork texture set",{index:i.index,artworkId:s.id,reason:i.reason,lane:i.lane,queueLength:this.prefetchQueue.length}),this.preloadAuthoredTextureSet(i.index,`prefetch:${i.reason}`).then(()=>{this.prefetchedTextureSets.add(i.index),this.diagnostics.debug("prefetch-complete","Artwork texture set prefetched",{index:i.index,artworkId:s.id,reason:i.reason})}).catch(a=>{this.prefetchedTextureSets.delete(i.index),this.diagnostics.warn("prefetch-failed","Artwork texture-set prefetch failed",{index:i.index,artworkId:s.id,reason:i.reason,message:a instanceof Error?a.message:String(a)})}).finally(()=>{this.activePrefetches.delete(i.index),t()})},250)};this.prefetchQueueRunning=!0,t()}sortPrefetchQueue(){const e=this.now(),t=n=>{const i=e-n.enqueuedAt;return n.lane==="background"&&i>=Q0?aa["near-next"]:aa[n.lane]};this.prefetchQueue.sort((n,i)=>{const s=t(n)-t(i);return s!==0?s:n.sequence-i.sequence})}scheduleIdle(e,t){const n=()=>{this.disposed||e()},i=window.requestIdleCallback;if(typeof i=="function"){i(n,{timeout:t});return}window.setTimeout(n,1)}shouldFillRole(e,t,n){if(!n.proceduralRoles.includes(e))return!1;switch(e){case"normal":return!0;case"detailNormal":return t.detailNormalEnabled&&t.detailNormalStrength>0;case"height":return t.bumpStrength>0||t.parallaxEnabled&&t.parallaxScale>0||t.selfShadowEnabled;case"roughness":return t.shaderVariant!=="painting-battery";case"specular":return t.specularStrength>0;case"varnish":return t.clearcoatEnabled&&n.clearcoatStrength>0;case"ao":return t.aoEnabled;default:return!1}}resolvePresentation(e){var t;return N0((t=this.artworks[e])==null?void 0:t.presentation)}navigate(e){var i,s,a,o;const t=this.currentIndex,n=Ut((this.currentIndex+e+this.artworks.length)%this.artworks.length,0,this.artworks.length-1);this.diagnostics.info("navigate",`Navigate ${e>0?"forward":"back"}`,{fromIndex:t,toIndex:n,fromArtworkId:(i=this.artworks[t])==null?void 0:i.id,toArtworkId:(s=this.artworks[n])==null?void 0:s.id,direction:e,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:e*ia,seedPositionZ:this.reducedMotion?0:ra,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/ns))}),this.reducedMotion||(this.artworkMesh.group.position.x=e*ia,this.artworkMesh.group.position.z=ra,this.artworkMesh.group.rotation.y=e*Pd,this.artworkMesh.group.scale.set(xr,xr,xr)),this.currentIndex=n,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:n,trigger:e>0?"navigate-next":"navigate-prev",startedAt:this.now()},this.promotePrefetchWindow(n,`navigate:${e>0?"next":"prev"}`),this.showArtwork(n),(a=this.frameBudgetNavigationMarker)==null||a.call(this),this.resetView(),(o=this.onNavigateCallback)==null||o.call(this,this.currentIndex)}goTo(e){var s,a,o,l;if(e===this.currentIndex)return;const t=this.currentIndex,n=e>this.currentIndex?1:-1,i=e-this.currentIndex;this.diagnostics.info("navigate","goTo direct navigation",{fromIndex:this.currentIndex,toIndex:e,fromArtworkId:(s=this.artworks[this.currentIndex])==null?void 0:s.id,toArtworkId:(a=this.artworks[e])==null?void 0:a.id,diff:i,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:(i>0?1:-1)*ia,seedPositionZ:this.reducedMotion?0:ra,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/ns))}),this.currentIndex=e,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:e,trigger:"timeline-select",startedAt:this.now()},this.promotePrefetchWindow(e,"timeline-select"),this.reducedMotion||(this.artworkMesh.group.position.x=(i>0?1:-1)*ia,this.artworkMesh.group.position.z=ra,this.artworkMesh.group.rotation.y=n*Pd,this.artworkMesh.group.scale.set(xr,xr,xr)),this.showArtwork(e),(o=this.frameBudgetNavigationMarker)==null||o.call(this),this.resetView(),(l=this.onNavigateCallback)==null||l.call(this,this.currentIndex)}setReducedMotion(e){this.reducedMotion=e}handleViewportMetricsChanged(){const e=Math.abs(this.targetZoom-this.lastResetFitZoom)<=Z0,t=this.getViewportMetrics(),n=this.getZoomBounds(t);e?this.targetZoom=n.resetFitZoom:this.targetZoom=Ut(this.targetZoom,n.minInspectionZoom,n.maxOverviewZoom),this.zoom=Ut(this.zoom,n.minInspectionZoom,n.maxOverviewZoom),this.lastResetFitZoom=n.resetFitZoom,this.clampPanTargets(t,n),this.markRenderDirty(4),this.diagnostics.info("viewport-refit","Artwork viewport metrics changed",{resetFitZoom:n.resetFitZoom,minInspectionZoom:n.minInspectionZoom,maxOverviewZoom:n.maxOverviewZoom,overviewHeadroom:n.maxOverviewZoom-n.resetFitZoom,wasNearReset:e,viewport:t})}setHoverTarget(e,t){const n=this.clampHoverTargetToStageClearance(t,e);this.targetY===n.targetRotY&&this.targetX===n.targetRotX||(this.targetY=n.targetRotY,this.targetX=n.targetRotX,this.markRenderDirty(2))}onNavigate(e){this.onNavigateCallback=e}get index(){return this.currentIndex}whenArtworkInteractive(e,t){const n=this.readiness[e];if(!n||this.disposed)return Promise.resolve("timeout");const i=()=>n.albedoLoaded&&n.materialApplied&&n.shaderCompiled;return i()?Promise.resolve("ready"):new Promise(s=>{const a=this.now(),o=()=>{if(this.disposed||!this.readiness[e]){s("timeout");return}if(i()){s("ready");return}if(this.now()-a>=t){s("timeout");return}window.setTimeout(o,50)};window.setTimeout(o,50)})}get artworkAspect(){return this.artworkMesh.artworkAspect}get proceduralFactory(){return this.procedural}update(e){const t=this.artworkMesh.group,n=this.readAnimationSnapshot();let i=0;this.lastUpdateTime>0&&(i=Math.min((e-this.lastUpdateTime)/1e3,j0)),this.lastUpdateTime=e;const s=this.getViewportMetrics(),a=this.getZoomBounds(s);this.targetZoom=this.clampZoom(this.targetZoom,a),this.clampPanTargets(s,a);const o=this.clampHoverTargetToStageClearance(this.targetX,this.targetY);return this.targetX=o.targetRotX,this.targetY=o.targetRotY,i<=0?this.consumeRenderDirty()||this.animationSnapshotChanged(n):(t.rotation.x=jt(t.rotation.x,this.targetX,Cd,i),t.rotation.y=jt(t.rotation.y,this.targetY,Cd,i),t.position.x=jt(t.position.x,0,ns,i),t.position.y=jt(t.position.y,0,ns,i),t.position.z=jt(t.position.z,0,ns,i),t.scale.x=jt(t.scale.x,1,Bo,i),t.scale.y=jt(t.scale.y,1,Bo,i),t.scale.z=jt(t.scale.z,1,Bo,i),this.zoom=jt(this.zoom,this.targetZoom,Rd,i),this.camera.position.z=jt(this.camera.position.z,this.zoom,Rd,i),this.panX=jt(this.panX,this.targetPanX,na,i),this.panY=jt(this.panY,this.targetPanY,na,i),this.camera.position.x=jt(this.camera.position.x,this.panX,na,i),this.camera.position.y=jt(this.camera.position.y,this.panY,na,i),this.consumeRenderDirty()||this.animationSnapshotChanged(n))}resetView(){const e=this.getZoomBounds();this.targetPanX=0,this.targetPanY=0,this.targetZoom=e.resetFitZoom,this.lastResetFitZoom=e.resetFitZoom,this.targetX=0,this.targetY=0,this.markRenderDirty(4)}consumeRenderDirty(){return this.renderDirtyFrames<=0?!1:(this.renderDirtyFrames-=1,!0)}readAnimationSnapshot(){const e=this.artworkMesh.group;return{groupX:e.position.x,groupY:e.position.y,groupZ:e.position.z,groupRotX:e.rotation.x,groupRotY:e.rotation.y,groupScaleX:e.scale.x,groupScaleY:e.scale.y,groupScaleZ:e.scale.z,zoom:this.zoom,cameraX:this.camera.position.x,cameraY:this.camera.position.y,cameraZ:this.camera.position.z,panX:this.panX,panY:this.panY,targetX:this.targetX,targetY:this.targetY,targetZoom:this.targetZoom,targetPanX:this.targetPanX,targetPanY:this.targetPanY}}animationSnapshotChanged(e){const t=this.readAnimationSnapshot();return Object.keys(e).some(n=>{const i=n;return Math.abs(t[i]-e[i])>1e-5})}clampZoom(e,t=this.getZoomBounds()){return Ut(e,t.minInspectionZoom,t.maxOverviewZoom)}clampPanTargets(e=this.getViewportMetrics(),t=this.getZoomBounds(e)){const n=this.getPanLimits(this.targetZoom,e,t);this.targetPanX=Ut(this.targetPanX,-n.x,n.x),this.targetPanY=Ut(this.targetPanY,-n.y,n.y)}getFovTan(){const e=this.camera.fov;return e!==this._fovTanForFov&&(this._fovTanForFov=e,this._fovTanCache=Math.tan(kh.degToRad(e*.5))),this._fovTanCache}getPanLimits(e,t=this.getViewportMetrics(),n=this.getZoomBounds(t)){const s=2*Ut(e,n.minInspectionZoom,n.maxOverviewZoom)*this.getFovTan()*t.usableFracY,a=s*t.effectiveAspect;return W0({artworkWidth:this.artworkMesh.artworkWidth,artworkHeight:this.artworkMesh.artworkHeight,visibleWidth:a,visibleHeight:s,overscrollX:Md,overscrollY:Ed})}clampHoverTargetToStageClearance(e,t){return X0({targetRotX:e,targetRotY:t,artworkWidth:this.artworkMesh.artworkWidth,artworkHeight:this.artworkMesh.artworkHeight,bodyBackDepth:this.artworkMesh.bodyBackExtent,wallZ:es.artworkWallZ,clearanceMargin:K0})}getZoomBounds(e=this.getViewportMetrics()){const t=this.getInspectionMinZoom(e),n=this.getResetFitZoom(e),i=Math.max($0,n+Y0);return{minInspectionZoom:Ut(t,ea,n),resetFitZoom:Ut(n,ea,i),maxOverviewZoom:i}}getInspectionMinZoom(e){const t=this.getFovTan(),n=this.artworkMesh.artworkHeight*Oo,i=this.artworkMesh.artworkWidth*Oo,s=n/(2*t*e.usableFracY),a=i/(2*t*this.camera.aspect*e.usableFracX);return Ut(Math.max(ea,s,a),ea,ts)}getResetFitZoom(e){const t=this.artworkMesh.artworkWidth+.4,n=this.artworkMesh.artworkHeight+.4,i=this.getFovTan(),s=n*Td/(2*i*e.usableFracY),a=t*Td/(2*i*this.camera.aspect*e.usableFracX),o=Math.max(ts,s,a);return this.isPortraitResetArtwork()?o+Ad:o}isPortraitResetArtwork(){return this.artworkMesh.artworkAspect<q0}getViewportMetrics(){var l,c;const e=(c=(l=this.viewportMetricsProvider)==null?void 0:l.call(this))!=null?c:this.getDefaultViewportMetrics(),t=Math.max(1,e.viewportW),n=Math.max(1,e.viewportH),i=Ut(e.usableW,t*ta,t),s=Ut(e.usableH,n*ta,n),a=Ut(e.usableFracX||i/t,ta,1),o=Ut(e.usableFracY||s/n,ta,1);return{viewportW:t,viewportH:n,usableW:i,usableH:s,usableFracX:a,usableFracY:o,effectiveAspect:Math.max(.1,e.effectiveAspect||i/s),occlusionTop:Math.max(0,e.occlusionTop),occlusionRight:Math.max(0,e.occlusionRight),occlusionBottom:Math.max(0,e.occlusionBottom),occlusionLeft:Math.max(0,e.occlusionLeft)}}getDefaultViewportMetrics(){const e=typeof window!="undefined"?window.innerWidth:1,t=typeof window!="undefined"?window.innerHeight:1;return{viewportW:e,viewportH:t,usableW:e,usableH:t,usableFracX:1,usableFracY:1,effectiveAspect:e/Math.max(1,t),occlusionTop:0,occlusionRight:0,occlusionBottom:0,occlusionLeft:0}}queueProceduralWindow(e,t,n){if(this.getCriticalWindowIndices(e,t).forEach(s=>this.proceduralQueue.add(s)),this.proceduralQueueRunning)return;this.proceduralQueueRunning=!0;const i=()=>{const s=this.proceduralQueue.values().next();if(s.done){this.proceduralQueueRunning=!1;return}const a=s.value;this.proceduralQueue.delete(a),this.scheduleIdle(()=>{this.preGenerateProceduralWindow(a,0,`${n}:queued`),i()},J0)};i()}logNavigationReadinessVerdict(e){const t=this.pendingNavigationProbe;if(!t||t.toIndex!==e)return;this.pendingNavigationProbe=null;const n=t.readinessBefore;if(!n)return;const i=this.readiness[e];if(!i)return;const s=!n.pbrLoaded,a=!n.proceduralReady,o=!n.gpuWarmed,l=s||a||o;this.diagnostics.info(l?"cold-path-detected":"hot-path-confirmed",l?"Navigation required remaining readiness work":"Navigation stayed on prepared hot path",{trigger:t.trigger,fromIndex:t.fromIndex,toIndex:t.toIndex,durationMs:Math.round((this.now()-t.startedAt)*10)/10,cold:{pbr:s,procedural:a,gpu:o},readiness:i})}dispose(){this.disposed=!0,this.prefetchQueue.length=0,this.proceduralQueue.clear(),this.activePrefetches.clear(),this.onNavigateCallback=null,this.pendingNavigationProbe=null}}class ny{constructor(e){x(this,"el");x(this,"helpBtn");x(this,"infoBtn");x(this,"backBtn");x(this,"onHelpClick");x(this,"onInfoClick");x(this,"onBackClick");this.el=document.createElement("header"),this.el.className="topbar",this.el.setAttribute("role","banner");const t=document.createElement("div");t.className="topbar__left",this.backBtn=document.createElement("button"),this.backBtn.className="topbar__back-btn",this.backBtn.setAttribute("aria-label","Zurück zum Museum"),this.backBtn.innerHTML=`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      <span class="topbar__back-btn-label topbar__back-btn-label--full">Zurück zum Museum</span>
      <span class="topbar__back-btn-label topbar__back-btn-label--short">Museum</span>
    `,this.backBtn.addEventListener("click",()=>{var s;this.backBtn.disabled||(s=this.onBackClick)==null||s.call(this)});const n=document.createElement("div");n.className="topbar__brand-group",n.innerHTML=`
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `,t.appendChild(this.backBtn),t.appendChild(n),this.el.appendChild(t);const i=document.createElement("div");i.className="topbar__right",this.infoBtn=document.createElement("button"),this.infoBtn.className="topbar__chrome-btn",this.infoBtn.setAttribute("aria-label","Werkinformationen einblenden"),this.infoBtn.innerHTML=`
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span class="topbar__chrome-btn-label">Info</span>
    `,this.infoBtn.addEventListener("click",()=>{var s;return(s=this.onInfoClick)==null?void 0:s.call(this)}),this.helpBtn=document.createElement("button"),this.helpBtn.className="topbar__help-btn",this.helpBtn.setAttribute("aria-label","Tastaturkürzel anzeigen"),this.helpBtn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',this.helpBtn.addEventListener("click",()=>{var s;return(s=this.onHelpClick)==null?void 0:s.call(this)}),i.appendChild(this.infoBtn),i.appendChild(this.helpBtn),this.el.appendChild(i),e.appendChild(this.el)}setBackBusy(e){this.backBtn.disabled=e,this.backBtn.setAttribute("aria-busy",e?"true":"false")}dispose(){this.el.remove()}}const Da=class Da{constructor(e,t){x(this,"el");x(this,"eyebrow");x(this,"title");x(this,"meta");x(this,"description");x(this,"credit");this.el=document.createElement("section"),this.el.className="info-panel",this.el.setAttribute("aria-live","polite"),this.el.setAttribute("aria-label","Informationen zum aktuellen Werk"),this.eyebrow=document.createElement("p"),this.eyebrow.className="info-panel__eyebrow",this.title=document.createElement("h1"),this.title.className="info-panel__title",this.meta=document.createElement("p"),this.meta.className="info-panel__meta",this.description=document.createElement("p"),this.description.className="info-panel__description",this.credit=document.createElement("p"),this.credit.className="info-panel__credit",this.el.append(this.eyebrow,this.title,this.meta,this.description,this.credit),e.appendChild(this.el),this.update(t)}update(e,t=!1){t?(this.el.classList.add("is-transitioning"),window.setTimeout(()=>{this.setContent(e),window.requestAnimationFrame(()=>{this.el.classList.remove("is-transitioning")})},Da.CONTENT_SWAP_DELAY_MS)):this.setContent(e)}setCompact(e){this.el.classList.toggle("info-panel--compact",e)}setContent(e){this.eyebrow.textContent=`${e.subtitle} · ${e.year}`,this.title.textContent=e.title,this.meta.textContent=[e.medium,e.surface].filter(Boolean).join(" · "),this.description.textContent=e.description,this.credit.textContent=`© ${e.credit}`}dispose(){this.el.remove()}};x(Da,"CONTENT_SWAP_DELAY_MS",520);let Ho=Da;const Xn=class Xn{constructor(e){x(this,"el");x(this,"prevBtn");x(this,"nextBtn");x(this,"onPrevCallback",null);x(this,"onNextCallback",null);x(this,"hintIdleTimer",null);x(this,"hintAnimationTimer",null);x(this,"hintDismissed",!1);x(this,"hintStarted",!1);x(this,"hintKeydownListener",null);x(this,"onHintStartCallback",null);x(this,"onHintFinishedCallback",null);this.el=document.createElement("nav"),this.el.className="nav-controls",this.el.setAttribute("aria-label","Galerie-Navigation"),this.prevBtn=document.createElement("button"),this.prevBtn.className="nav-btn",this.prevBtn.setAttribute("aria-label","Vorheriges Werk"),this.prevBtn.textContent="←",this.prevBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onPrevCallback)==null||t.call(this)}),this.nextBtn=document.createElement("button"),this.nextBtn.className="nav-btn",this.nextBtn.setAttribute("aria-label","Nächstes Werk"),this.nextBtn.textContent="→",this.nextBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onNextCallback)==null||t.call(this)}),this.el.appendChild(this.prevBtn),this.el.appendChild(this.nextBtn),e.appendChild(this.el)}onHintStart(e){this.onHintStartCallback=e}onHintFinished(e){this.onHintFinishedCallback=e}setHiddenMode(e){this.el.classList.toggle("nav-controls--hidden",e)}enableIdleHint(){if(this.hintStarted||(this.hintStarted=!0,this.readHintSeen())||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;this.hintIdleTimer=window.setTimeout(()=>{var t;this.hintIdleTimer=null,this.hintDismissed||((t=this.onHintStartCallback)==null||t.call(this),document.documentElement.dataset.navHint="active",this.hintAnimationTimer=window.setTimeout(()=>{var n;this.hintAnimationTimer=null,this.hintDismissed||(delete document.documentElement.dataset.navHint,(n=this.onHintFinishedCallback)==null||n.call(this))},Xn.HINT_ANIM_DURATION_MS))},Xn.HINT_IDLE_DELAY_MS);const e=()=>this.dismissHint();this.prevBtn.addEventListener("pointerenter",e,{once:!0}),this.nextBtn.addEventListener("pointerenter",e,{once:!0}),this.prevBtn.addEventListener("focus",e,{once:!0}),this.nextBtn.addEventListener("focus",e,{once:!0}),this.hintKeydownListener=t=>{(t.key==="ArrowLeft"||t.key==="ArrowRight")&&this.dismissHint()},document.addEventListener("keydown",this.hintKeydownListener)}dismissHint(){var e;if(!this.hintDismissed){this.hintDismissed=!0,this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),delete document.documentElement.dataset.navHint,this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),(e=this.onHintFinishedCallback)==null||e.call(this);try{localStorage.setItem(Xn.HINT_STORAGE_KEY,"1")}catch(t){}}}readHintSeen(){try{return localStorage.getItem(Xn.HINT_STORAGE_KEY)==="1"}catch(e){return!1}}onPrev(e){this.onPrevCallback=e}onNext(e){this.onNextCallback=e}dispose(){this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),delete document.documentElement.dataset.navHint,this.el.remove()}};x(Xn,"HINT_STORAGE_KEY","freyraum-nav-hint-seen"),x(Xn,"HINT_IDLE_DELAY_MS",5e3),x(Xn,"HINT_ANIM_DURATION_MS",3*1600+300);let Go=Xn;class iy{constructor(e){x(this,"el");this.el=document.createElement("p"),this.el.className="hint-text",this.el.setAttribute("aria-hidden","true"),this.updateHint(),e.appendChild(this.el)}updateHint(){var t;const e=(t=document.documentElement.dataset.pointerPrimary)!=null?t:"fine";this.el.textContent=e==="coarse"?"Wischen zum Navigieren · Zwei Finger zum Zoomen.":"Scrollen zum Zoomen · Ziehen zum freien Bewegen."}dispose(){this.el.remove()}}const Id=.6;class ry{constructor(e,t){x(this,"el");x(this,"galleryManager");this.galleryManager=t,this.el=document.createElement("div"),this.el.className="zoom-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Zoom-Steuerung");const n=this.createButton("zoom-controls__btn","Vergrößern","＋",()=>{this.galleryManager.addZoomDelta(-Id)}),i=this.createButton("zoom-controls__btn","Verkleinern","−",()=>{this.galleryManager.addZoomDelta(Id)}),s=this.createButton("zoom-controls__btn zoom-controls__btn--reset","Ansicht zurücksetzen","⟲",()=>{this.galleryManager.resetView()});this.el.append(n,i,s),e.appendChild(this.el)}createButton(e,t,n,i){const s=document.createElement("button");s.type="button",s.className=e,s.setAttribute("aria-label",t);const a=document.createElement("span");return a.className="zoom-controls__icon",a.setAttribute("aria-hidden","true"),a.textContent=n,s.appendChild(a),s.addEventListener("click",i),s}dispose(){this.el.remove()}}class sy{constructor(e,t=document.documentElement){x(this,"btn");x(this,"target");x(this,"toggle",()=>{if(!document.fullscreenEnabled){this.btn.setAttribute("aria-disabled","true");return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.target.requestFullscreen().catch(()=>{})});x(this,"handleChange",()=>{const e=!!document.fullscreenElement;this.btn.setAttribute("aria-pressed",e?"true":"false"),document.documentElement.dataset.presentation=e?"on":"off"});this.target=t,this.btn=document.createElement("button"),this.btn.type="button",this.btn.className="fullscreen-btn",this.btn.setAttribute("aria-pressed","false"),this.btn.setAttribute("aria-label","Vollbild umschalten"),this.btn.innerHTML=`
      <span class="fullscreen-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path class="fullscreen-btn__enter" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path class="fullscreen-btn__exit" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        </svg>
      </span>
    `,this.btn.addEventListener("click",this.toggle),document.addEventListener("fullscreenchange",this.handleChange),e.appendChild(this.btn)}dispose(){this.btn.removeEventListener("click",this.toggle),document.removeEventListener("fullscreenchange",this.handleChange),this.btn.remove()}}const Mi=.3;function oa(r){return Math.max(0,Math.min(100,r))/100*Mi}function la(r){const e=Math.max(0,Math.min(Mi,r));return e<=0?0:Math.round(e/Mi*100)}const br=oa(50);class ay{constructor(e,t){x(this,"root");x(this,"trigger");x(this,"panel");x(this,"isOpen",!1);x(this,"unsubscribe");x(this,"audioStatusMessage",null);x(this,"motionInput",null);x(this,"contrastInput",null);x(this,"chromeInput",null);x(this,"audioMutedInput",null);x(this,"audioVolumeInput",null);x(this,"audioValueLabel",null);x(this,"audioStatusEl",null);x(this,"isVolumeDragging",!1);x(this,"handleToggle",()=>{this.setOpen(!this.isOpen)});x(this,"handleOutsideClick",e=>{this.isOpen&&(this.root.contains(e.target)||(this.setOpen(!1),this.trigger.focus()))});x(this,"handleEscape",e=>{e.key==="Escape"&&this.isOpen&&(e.preventDefault(),e.stopPropagation(),this.setOpen(!1),this.trigger.focus())});this.prefs=t,this.root=document.createElement("div"),this.root.className="prefs",this.trigger=document.createElement("button"),this.trigger.type="button",this.trigger.className="prefs__trigger",this.trigger.setAttribute("aria-haspopup","true"),this.trigger.setAttribute("aria-expanded","false"),this.trigger.setAttribute("aria-controls","freyraum-prefs-panel"),this.trigger.setAttribute("aria-label","Einstellungen öffnen"),this.trigger.innerHTML=`
      <span class="prefs__trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
        </svg>
      </span>
    `,this.trigger.addEventListener("click",this.handleToggle),this.panel=document.createElement("div"),this.panel.id="freyraum-prefs-panel",this.panel.className="prefs__panel",this.panel.setAttribute("role","dialog"),this.panel.setAttribute("aria-labelledby","freyraum-prefs-heading"),this.panel.setAttribute("aria-modal","true"),this.panel.hidden=!0,this.buildPanel(),this.root.append(this.trigger,this.panel),e.appendChild(this.root),document.addEventListener("click",this.handleOutsideClick),document.addEventListener("keydown",this.handleEscape),this.unsubscribe=this.prefs.subscribe(()=>this.patchPanel())}buildPanel(){var c;const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:i,audioVolume:s,alwaysShowChrome:a}=this.prefs.current,o=Object.values(Qr).map(d=>`
          <label class="prefs__radio">
            <input type="radio" name="freyraum-quality" value="${d.id}" ${n===d.id?"checked":""} />
            <span class="prefs__radio-label">
              <span class="prefs__radio-title">${d.label}</span>
              <span class="prefs__radio-desc">${d.description}</span>
            </span>
          </label>
        `).join(""),l=la(s);this.panel.innerHTML=`
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
        <input type="checkbox" id="freyraum-audio-muted" ${i?"checked":""} />
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
    `,this.motionInput=this.panel.querySelector("#freyraum-motion"),this.contrastInput=this.panel.querySelector("#freyraum-contrast"),this.chromeInput=this.panel.querySelector("#freyraum-chrome"),this.audioMutedInput=this.panel.querySelector("#freyraum-audio-muted"),this.audioVolumeInput=this.panel.querySelector("#freyraum-audio-volume"),this.audioValueLabel=this.panel.querySelector("#freyraum-audio-volume-label"),this.audioStatusEl=this.panel.querySelector("#freyraum-audio-status"),this.bindPanelEvents()}bindPanelEvents(){var e,t,n,i;if((e=this.motionInput)==null||e.addEventListener("change",s=>{this.prefs.setReducedMotion(s.target.checked)}),(t=this.contrastInput)==null||t.addEventListener("change",s=>{this.prefs.setContrastMode(s.target.checked?"high":"auto")}),(n=this.chromeInput)==null||n.addEventListener("change",s=>{this.prefs.setAlwaysShowChrome(s.target.checked)}),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(s=>{s.addEventListener("change",()=>{s.checked&&this.prefs.setQuality(s.value)})}),(i=this.audioMutedInput)==null||i.addEventListener("change",s=>{this.prefs.setAudioMuted(s.target.checked)}),this.audioVolumeInput){const s=this.audioVolumeInput;s.addEventListener("pointerdown",()=>{this.isVolumeDragging=!0}),s.addEventListener("pointerup",()=>{this.isVolumeDragging=!1}),s.addEventListener("pointercancel",()=>{this.isVolumeDragging=!1}),s.addEventListener("input",()=>{const a=Number(s.value);if(Number.isNaN(a))return;this.audioValueLabel&&(this.audioValueLabel.textContent=`${Math.round(a)}%`);const o=Math.round(a);s.style.setProperty("--volume-pct",`${o}%`),s.setAttribute("aria-valuetext",`${o} Prozent`),this.prefs.setAudioVolume(oa(a))}),s.addEventListener("change",()=>{this.isVolumeDragging=!1;const a=Number(s.value);Number.isNaN(a)||this.prefs.setAudioVolume(oa(a))})}}patchPanel(){const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:i,audioVolume:s,alwaysShowChrome:a}=this.prefs.current;if(this.motionInput&&(this.motionInput.checked=e),this.contrastInput&&(this.contrastInput.checked=t==="high"),this.chromeInput&&(this.chromeInput.checked=a),this.audioMutedInput&&(this.audioMutedInput.checked=i),!this.isVolumeDragging&&this.audioVolumeInput&&this.audioValueLabel){const o=la(s);this.audioVolumeInput.value=String(o),this.audioVolumeInput.style.setProperty("--volume-pct",`${o}%`),this.audioVolumeInput.setAttribute("aria-valuetext",`${o} Prozent`),this.audioValueLabel.textContent=`${o}%`}this.audioStatusEl&&(this.audioStatusMessage?(this.audioStatusEl.textContent=this.audioStatusMessage,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden","")),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(o=>{o.checked=o.value===n})}setAudioStatusMessage(e){this.audioStatusMessage=e,this.audioStatusEl&&(e?(this.audioStatusEl.textContent=e,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden",""))}setOpen(e){var t;this.isOpen=e,this.trigger.setAttribute("aria-expanded",e?"true":"false"),this.panel.hidden=!e,e&&((t=this.panel.querySelector("input"))==null||t.focus())}dispose(){document.removeEventListener("click",this.handleOutsideClick),document.removeEventListener("keydown",this.handleEscape),this.unsubscribe(),this.root.remove()}}const oy={INFO_PANEL_TRIGGER_BAND_PX:120,NAV_TRIGGER_BAND_PX:220,HIDE_DELAY_MS:2500,NAV_HIDE_DELAY_MS:2e3,TOUCH_REVEAL_DURATION_MS:4e3,FORCE_REVEAL_DURATION_MS:3200,IOS_EDGE_DEAD_ZONE_PX:22,INFO_PANEL_TOUCH_MAX_PX:80};class ly{constructor(e,t,n,i={}){x(this,"diag",rn("chrome-visibility"));x(this,"config");x(this,"options");x(this,"infoPanelEl");x(this,"prefs");x(this,"appRoot");x(this,"infoPanelPeekHit",null);x(this,"srStatusEl",null);x(this,"panels",new Map);x(this,"boundOnPointerMove");x(this,"boundOnPointerDown");x(this,"boundOnKeyDown");x(this,"boundOnViewportLeave");x(this,"unsubscribePrefs",null);x(this,"initialised",!1);x(this,"settleTimer",null);this.infoPanelEl=e,this.prefs=t,this.appRoot=n,this.options=i,this.config={...oy,...i.config},this.boundOnPointerMove=this.onPointerMove.bind(this),this.boundOnPointerDown=this.onPointerDown.bind(this),this.boundOnKeyDown=this.onKeyDown.bind(this),this.boundOnViewportLeave=this.onViewportLeave.bind(this)}init(){if(!this.initialised){this.initialised=!0,this.panels.set("info-panel",this.createPanelState("info-panel",this.infoPanelEl,"Werkinformationen")),this.applyMode(this.currentMode()),this.createPeekElements(),this.createSrStatusElement(),window.addEventListener("pointermove",this.boundOnPointerMove,{passive:!0}),window.addEventListener("pointerdown",this.boundOnPointerDown,{passive:!0}),document.addEventListener("keydown",this.boundOnKeyDown,{passive:!0}),document.addEventListener("mouseleave",this.boundOnViewportLeave,{passive:!0}),window.addEventListener("blur",this.boundOnViewportLeave,{passive:!0});for(const e of this.panels.values())e.el.addEventListener("focusin",e.onFocusIn),e.el.addEventListener("focusout",e.onFocusOut),e.el.addEventListener("pointerenter",e.onPointerEnter),e.el.addEventListener("pointerleave",e.onPointerLeave);this.unsubscribePrefs=this.prefs.subscribe(()=>this.applyMode(this.currentMode())),this.diag.info("init","ChromeVisibilityManager initialised",{mode:this.currentMode()})}}dispose(){var e,t,n;if(this.initialised){this.initialised=!1,window.removeEventListener("pointermove",this.boundOnPointerMove),window.removeEventListener("pointerdown",this.boundOnPointerDown),document.removeEventListener("keydown",this.boundOnKeyDown),document.removeEventListener("mouseleave",this.boundOnViewportLeave),window.removeEventListener("blur",this.boundOnViewportLeave),(e=this.unsubscribePrefs)==null||e.call(this),this.unsubscribePrefs=null;for(const i of this.panels.values())i.hideTimerId!==null&&clearTimeout(i.hideTimerId),i.el.removeEventListener("focusin",i.onFocusIn),i.el.removeEventListener("focusout",i.onFocusOut),i.el.removeEventListener("pointerenter",i.onPointerEnter),i.el.removeEventListener("pointerleave",i.onPointerLeave);this.panels.clear(),(t=this.infoPanelPeekHit)==null||t.remove(),(n=this.srStatusEl)==null||n.remove(),this.infoPanelPeekHit=null,this.srStatusEl=null,this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null),this.diag.info("dispose","ChromeVisibilityManager disposed")}}forceReveal(e){!this.initialised||this.currentMode()==="visible"||!this.panels.get(e)||(this.reveal(e,"forced"),this.scheduleHide(e,this.config.FORCE_REVEAL_DURATION_MS),this.diag.debug("force-reveal","Panel force-revealed",{panelId:e}))}registerNavControls(e,t){if(!this.initialised){this.diag.warn("register-nav","registerNavControls called before init() — ignored");return}if(this.panels.has("nav-controls")){this.diag.warn("register-nav","Nav controls already registered — ignored");return}const n=this.createPanelState("nav-controls",e,"Navigation");this.panels.set("nav-controls",n),e.addEventListener("focusin",n.onFocusIn),e.addEventListener("focusout",n.onFocusOut),e.addEventListener("pointerenter",n.onPointerEnter),e.addEventListener("pointerleave",n.onPointerLeave),this.currentMode()==="visible"&&this.reveal("nav-controls","preference"),t.onHintStart(()=>{this.reveal("nav-controls","hint"),this.diag.debug("nav-hint-start","Nav controls revealed for onboarding hint")}),t.onHintFinished(()=>{const i=this.panels.get("nav-controls");i&&(this.currentMode()==="clean"&&this.shouldHide(i)&&(this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-hint-dismiss","Nav hint finished; scheduled re-hide",{delay:this.config.NAV_HIDE_DELAY_MS})),this.triggerAffordanceSettle())}),this.diag.info("register-nav","Nav controls registered as managed chrome surface",{mode:this.currentMode()})}triggerAffordanceSettle(){window.matchMedia("(prefers-reduced-motion: reduce)").matches||(this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling")),this.appRoot.classList.add("affordance-settling"),this.diag.debug("affordance-settle-start","Affordance settle phase started"),this.settleTimer=window.setTimeout(()=>{this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null,this.diag.debug("affordance-settle-end","Affordance settle phase complete")},2100))}currentMode(){return this.prefs.current.alwaysShowChrome?"visible":"clean"}createPanelState(e,t,n){return{id:e,el:t,label:n,revealed:!1,reason:null,hideTimerId:null,focusActive:!1,pointerInZone:!1,pointerInPanel:!1,onFocusIn:()=>this.onPanelFocusIn(e),onFocusOut:()=>this.onPanelFocusOut(e),onPointerEnter:()=>this.onPanelPointerEnter(e),onPointerLeave:()=>this.onPanelPointerLeave(e)}}applyMode(e){if(document.documentElement.dataset.chromeMode=e,e==="visible")for(const t of this.panels.keys())this.reveal(t,"preference");else for(const t of this.panels.values())this.shouldHide(t)&&this.hide(t.id)}reveal(e,t){var i,s;const n=this.panels.get(e);n&&(n.hideTimerId!==null&&(clearTimeout(n.hideTimerId),n.hideTimerId=null),!(n.revealed&&n.reason===t)&&(n.el.classList.add("is-revealed"),n.revealed=!0,n.reason=t,this.announceToScreenReader(n,!0),(s=(i=this.options).onRevealChange)==null||s.call(i,e,!0,t),this.diag.debug("reveal","Panel revealed",{panelId:e,reason:t})))}hide(e){var n,i;const t=this.panels.get(e);t&&(t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),t.revealed&&(t.el.classList.remove("is-revealed"),t.revealed=!1,t.reason=null,this.announceToScreenReader(t,!1),(i=(n=this.options).onRevealChange)==null||i.call(n,e,!1,null),this.diag.debug("hide","Panel hidden",{panelId:e})))}scheduleHide(e,t=this.config.HIDE_DELAY_MS){const n=this.panels.get(e);n&&(n.hideTimerId!==null&&clearTimeout(n.hideTimerId),n.hideTimerId=setTimeout(()=>this.hide(e),t))}shouldHide(e){return!e.pointerInZone&&!e.pointerInPanel&&!e.focusActive}onPointerMove(e){if(this.currentMode()==="visible"||e.pointerType==="touch")return;const t=e.clientX,n=e.clientY,i=window.innerHeight;this.updateZone("info-panel",t<=this.config.INFO_PANEL_TRIGGER_BAND_PX),this.panels.has("nav-controls")&&this.updateZone("nav-controls",n>=i-this.config.NAV_TRIGGER_BAND_PX,this.config.NAV_HIDE_DELAY_MS)}onPointerDown(e){if(e.pointerType==="mouse"||this.currentMode()==="visible")return;const t=e.clientX;t>=this.config.IOS_EDGE_DEAD_ZONE_PX&&t<=this.config.INFO_PANEL_TOUCH_MAX_PX&&(this.reveal("info-panel","touch"),this.scheduleHide("info-panel",this.config.TOUCH_REVEAL_DURATION_MS))}onViewportLeave(){if(this.currentMode()!=="visible")for(const e of this.panels.keys())this.updateZone(e,!1)}onKeyDown(e){if(this.currentMode()==="visible"||((e.key==="ArrowLeft"||e.key==="ArrowRight")&&this.panels.has("nav-controls")&&(this.reveal("nav-controls","keyboard"),this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-keyboard-reveal","Nav controls revealed by keyboard",{key:e.key})),e.key!=="Escape"))return;let t=!1;for(const n of this.panels.values())n.revealed&&!n.el.contains(document.activeElement)&&(this.hide(n.id),t=!0);t&&this.diag.debug("escape-dismiss","Chrome dismissed via Escape")}onPanelFocusIn(e){const t=this.panels.get(e);t&&(t.focusActive=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),this.currentMode()==="clean"&&this.reveal(e,"focus"))}onPanelFocusOut(e){requestAnimationFrame(()=>{const t=this.panels.get(e);t&&(t.el.contains(document.activeElement)||(t.focusActive=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e)))})}onPanelPointerEnter(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null))}onPanelPointerLeave(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e))}updateZone(e,t,n){const i=this.panels.get(e);i&&t!==i.pointerInZone&&(i.pointerInZone=t,t?this.reveal(e,"proximity"):this.shouldHide(i)&&this.scheduleHide(e,n))}createPeekElements(){const e=this.makeEl("div","info-panel-chevron");this.infoPanelPeekHit=this.makeEl("div","info-panel-peek-hit",[this.makeEl("div","info-panel-peek"),e]),this.infoPanelPeekHit.setAttribute("aria-hidden","true"),this.appRoot.appendChild(this.infoPanelPeekHit),this.diag.debug("peek-affordances-created","Visual chrome affordances mounted",{infoPanel:["info-panel-peek","info-panel-chevron"]})}createSrStatusElement(){this.srStatusEl=this.makeEl("div","sr-only"),this.srStatusEl.id="freyraum-chrome-status",this.srStatusEl.setAttribute("aria-live","polite"),this.srStatusEl.setAttribute("aria-atomic","true"),this.appRoot.appendChild(this.srStatusEl)}announceToScreenReader(e,t){this.srStatusEl&&(this.srStatusEl.textContent=t?`${e.label} eingeblendet`:"")}makeEl(e,t,n=[]){const i=document.createElement(e);i.className=t;for(const s of n)i.appendChild(s);return i}}const ca=rn("audio-controls");class cy{constructor(e,t,n){x(this,"el");x(this,"muteBtn");x(this,"volumeInput");x(this,"unsubscribe");x(this,"currentState");x(this,"handleMuteClick",()=>{const{muted:e,playing:t,autoplayBlocked:n,available:i}=this.currentState;i&&(e?(this.prefs.setAudioMuted(!1),ca.info("user-unmute","User unmuted audio via main-page control")):t?(this.prefs.setAudioMuted(!0),ca.info("user-mute","User muted audio via main-page control")):(this.audioManager.play("user-activate"),ca.info("user-activate","User activated audio via main-page control",{autoplayBlocked:n})))});x(this,"handleVolumeInput",()=>{const e=Number(this.volumeInput.value);if(Number.isNaN(e))return;const t=Math.round(e);this.volumeInput.style.setProperty("--volume-pct",`${t}%`),this.volumeInput.setAttribute("aria-valuenow",String(t)),this.volumeInput.setAttribute("aria-valuetext",`${t} Prozent`);const n=oa(e);this.prefs.setAudioVolume(n),ca.debug("user-volume","User adjusted volume via main-page slider",{displayPct:e,gain:n})});this.prefs=t,this.audioManager=n,this.currentState=n.getState(),this.el=document.createElement("div"),this.el.className="audio-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Hintergrundmusik"),this.muteBtn=document.createElement("button"),this.muteBtn.type="button",this.muteBtn.className="audio-controls__btn",this.muteBtn.addEventListener("click",this.handleMuteClick);const i=document.createElement("div");i.className="audio-controls__slider-wrap",this.volumeInput=document.createElement("input"),this.volumeInput.type="range",this.volumeInput.className="audio-controls__slider",this.volumeInput.min="0",this.volumeInput.max="100",this.volumeInput.step="1",this.volumeInput.setAttribute("aria-label","Lautstärke"),this.volumeInput.addEventListener("input",this.handleVolumeInput),i.appendChild(this.volumeInput),this.el.append(this.muteBtn,i),e.appendChild(this.el),this.unsubscribe=n.subscribe(s=>this.update(s))}update(e){if(this.currentState=e,this.el.hidden=!e.available,!e.available)return;const t=e.muted,n=e.autoplayBlocked,i=e.playing;this.muteBtn.classList.toggle("audio-controls__btn--muted",t),this.muteBtn.classList.toggle("audio-controls__btn--blocked",n&&!t),this.muteBtn.classList.toggle("audio-controls__btn--playing",i&&!t);let s;n&&!t?s="Klicken zum Aktivieren der Hintergrundmusik":t?s="Ton einschalten":i?s="Ton ausschalten":s="Hintergrundmusik abspielen",this.muteBtn.setAttribute("aria-label",s),this.muteBtn.setAttribute("aria-pressed",i&&!t?"true":"false"),this.muteBtn.innerHTML=`
      <span class="audio-controls__btn-icon" aria-hidden="true">
        ${t?uy:n?hy:dy}
      </span>
      ${n&&!t?'<span class="audio-controls__indicator" aria-hidden="true"></span>':""}
    `;const a=la(e.targetVolume);this.volumeInput.value=String(a),this.volumeInput.disabled=t,this.volumeInput.setAttribute("aria-valuenow",String(a)),this.volumeInput.setAttribute("aria-valuetext",`${a} Prozent`),this.volumeInput.style.setProperty("--volume-pct",`${a}%`)}dispose(){this.unsubscribe(),this.el.remove()}}const dy=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`,uy=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`,hy=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="15" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/>
  </svg>`,Ld={"webgl-unavailable":{title:"Museum im 2D-Modus",body:"Auf diesem Gerät steht WebGL nicht zur Verfügung. Sie können die Kunstwerke weiterhin ansehen und lesen."},"renderer-initialization":{title:"Museum im 2D-Modus",body:"Die immersive 3D-Ansicht konnte nicht gestartet werden. Die Kunstwerke bleiben hier vollständig zugänglich."},startup:{title:"Vorschau konnte nicht vollständig starten",body:"Beim Laden ist ein unerwarteter Fehler aufgetreten. Dies ist nicht automatisch ein WebGL-Problem."},"preview-assets":{title:"Vorschau ist unvollständig",body:"Erforderliche lokale Vorschaudateien fehlen. Bitte erstellen Sie die Kundenvorschau erneut."}};function fy(r){return r.image||r.webglImage||""}function kd(r,e){var c,d,u,h,f,g,v;const t=hr();r.dataset.experience="fallback",(c=r.querySelector(".fallback-screen"))==null||c.remove(),(d=r.querySelector(".loading-overlay"))==null||d.remove();const n=document.createElement("section");n.className="fallback-screen",n.setAttribute("aria-labelledby","fallback-screen-title"),(u=e.surfaceColor)!=null&&u.trim()&&(n.style.backgroundColor=e.surfaceColor.trim());const i=document.createElement("div");i.className="fallback-screen__card";const s=document.createElement("p");s.className="fallback-screen__eyebrow",s.textContent="FREYRAUM";const a=document.createElement("h1");a.id="fallback-screen-title",a.className="fallback-screen__title",a.textContent=Ld[e.category].title;const o=document.createElement("p");o.className="fallback-screen__body",o.textContent=Ld[e.category].body,i.append(s,a,o);const l=document.createElement("div");if(l.className="fallback-screen__actions",(h=e.artworks)!=null&&h.length){const m=document.createElement("a");m.className="fallback-screen__action",m.href="#fallback-artworks",m.textContent="In 2D fortfahren",l.appendChild(m)}if(e.onRetry){const m=document.createElement("button");m.className="fallback-screen__action",m.type="button",m.textContent="3D erneut versuchen",m.addEventListener("click",()=>{var p;m.disabled=!0,m.textContent="3D wird erneut gestartet …",(p=e.onRetry)==null||p.call(e)},{once:!0}),l.appendChild(m)}if(l.childElementCount&&i.appendChild(l),t.getMode()!=="default"){const m=document.createElement("details");m.className="fallback-screen__detail";const p=document.createElement("summary");p.textContent="Technische Details";const S=document.createElement("p");S.textContent=e.reason,m.append(p,S),i.appendChild(m)}if(n.appendChild(i),(f=e.artworks)!=null&&f.length){const m=document.createElement("section");m.id="fallback-artworks",m.className="fallback-screen__museum",m.setAttribute("aria-label","Kunstwerke");for(const p of e.artworks){const S=document.createElement("article");S.className="fallback-screen__artwork";const y=document.createElement("img");y.loading="lazy",y.decoding="async",y.alt=p.alt;const b=fy(p);y.src=b,p.webglImage&&p.webglImage!==b&&y.addEventListener("error",()=>{var _;y.src=(_=p.webglImage)!=null?_:""},{once:!0});const U=document.createElement("div"),P=document.createElement("h2");P.textContent=p.title;const E=document.createElement("p");E.className="fallback-screen__metadata",E.textContent=`${p.year} · ${p.medium}`;const L=document.createElement("p");L.textContent=p.description;const M=document.createElement("p");M.className="fallback-screen__metadata",M.textContent=p.credit,U.append(P,E,L,M),S.append(y,U),m.appendChild(S)}n.appendChild(m)}r.appendChild(n),t.info("fallback","shown","Fallback experience shown",{category:e.category,artworkCount:(v=(g=e.artworks)==null?void 0:g.length)!=null?v:0,protocol:window.location.protocol})}const Ud=20,rs=5;class py{constructor(e,t){x(this,"diagnostics",hr());x(this,"el");x(this,"listEl");x(this,"counterEl");x(this,"prevButton");x(this,"nextButton");x(this,"artworks");x(this,"items",[]);x(this,"thumbs",[]);x(this,"virtualized");x(this,"currentIndex",0);x(this,"renderedStart",-1);x(this,"renderedEnd",-1);x(this,"onSelectCallback",null);x(this,"onPreviewCallback",null);x(this,"handleThumbKey",e=>{var i;const t=e.currentTarget,n=Number((i=t.dataset.index)!=null?i:"0");switch(e.key){case"ArrowRight":case"ArrowDown":e.preventDefault(),this.focusThumb((n+1)%this.artworks.length);break;case"ArrowLeft":case"ArrowUp":e.preventDefault(),this.focusThumb((n-1+this.artworks.length)%this.artworks.length);break;case"Home":e.preventDefault(),this.focusThumb(0);break;case"End":e.preventDefault(),this.focusThumb(this.artworks.length-1);break;case"Enter":case" ":{e.key===" "&&e.preventDefault();break}}});x(this,"onPrevPage",()=>{this.listEl.scrollBy({left:-this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});x(this,"onNextPage",()=>{this.listEl.scrollBy({left:this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});x(this,"onScroll",()=>{this.renderWindowFromScroll(),this.updateScrollState()});x(this,"onResize",()=>{this.virtualized&&this.renderWindowAround(this.currentIndex),this.updateScrollState()});this.artworks=t,this.virtualized=t.length>Ud,this.el=document.createElement("nav"),this.el.className="timeline",this.el.setAttribute("aria-label","Werke der Ausstellung"),this.prevButton=this.createArrowButton("prev","Vorherige Werke anzeigen","‹"),this.nextButton=this.createArrowButton("next","Weitere Werke anzeigen","›"),this.counterEl=document.createElement("div"),this.counterEl.className="timeline__counter",this.counterEl.setAttribute("aria-live","polite");const n=document.createElement("ul");n.className="timeline__list",n.setAttribute("role","list"),this.listEl=n,this.el.append(this.prevButton,n,this.nextButton,this.counterEl),t.forEach((i,s)=>{const a=document.createElement("li");a.className="timeline__item",a.dataset.index=String(s),this.items.push(a),this.thumbs.push(null),n.appendChild(a)}),this.virtualized?(this.renderWindowAround(0),this.diagnostics.info("timeline","virtualization-enabled","Timeline virtual rendering enabled",{artworkCount:t.length,threshold:Ud,buffer:rs})):t.forEach((i,s)=>this.ensureThumb(s)),this.prevButton.addEventListener("click",this.onPrevPage),this.nextButton.addEventListener("click",this.onNextPage),this.listEl.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("resize",this.onResize,{passive:!0}),e.appendChild(this.el),this.setActive(0),this.updateScrollState(),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>this.centerThumb(0,"auto")))}createArrowButton(e,t,n){const i=document.createElement("button");return i.type="button",i.className=`timeline__arrow timeline__arrow--${e}`,i.setAttribute("aria-label",t),i.textContent=n,i}ensureThumb(e){if(e<0||e>=this.artworks.length)return null;const t=this.thumbs[e];if(t)return t;const n=this.artworks[e],i=this.items[e],s=document.createElement("button");s.type="button",s.className="timeline__thumb",s.setAttribute("aria-label",`${n.subtitle}: ${n.title}`),s.setAttribute("aria-pressed",e===this.currentIndex?"true":"false"),s.setAttribute("aria-current",e===this.currentIndex?"true":"false"),s.setAttribute("data-index",String(e)),s.tabIndex=e===this.currentIndex?0:-1;const a=n.dimensions.width/n.dimensions.height,o=document.createElement("span");o.className="timeline__frame",o.style.setProperty("--thumb-aspect",String(a.toFixed(4)));const l=document.createElement("span");l.className="timeline__skeleton",l.setAttribute("aria-hidden","true"),o.appendChild(l);const c=document.createElement("img");c.className="timeline__img",c.src=n.image,c.alt="",c.loading="lazy",c.decoding="async",c.addEventListener("load",()=>o.classList.add("is-loaded")),c.addEventListener("error",()=>o.classList.add("is-loaded","is-error")),o.appendChild(c);const d=document.createElement("span");return d.className="timeline__thumb-label",d.textContent=n.subtitle,s.append(o,d),s.addEventListener("click",()=>this.select(e)),s.addEventListener("pointerenter",()=>this.preview(e)),s.addEventListener("focus",()=>this.preview(e)),s.addEventListener("keydown",this.handleThumbKey),this.thumbs[e]=s,i.replaceChildren(s),s}unmountThumb(e){var n;if(e===this.currentIndex)return;const t=this.thumbs[e];!t||t.matches(":focus-within")||(t.removeEventListener("keydown",this.handleThumbKey),this.thumbs[e]=null,(n=this.items[e])==null||n.replaceChildren())}focusThumb(e){this.virtualized&&this.renderWindowAround(e);const t=this.ensureThumb(e);t&&(this.thumbs.forEach((n,i)=>{n&&(n.tabIndex=i===e?0:-1)}),t.focus(),this.centerThumb(e,this.preferredScrollBehavior()))}select(e){var t;(t=this.onSelectCallback)==null||t.call(this,e)}preview(e){var t;(t=this.onPreviewCallback)==null||t.call(this,e)}setActive(e){const t=this.thumbs[this.currentIndex];t&&(t.classList.remove("is-active"),t.setAttribute("aria-pressed","false"),t.setAttribute("aria-current","false")),this.currentIndex=e,this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(this.currentIndex);n&&(n.classList.add("is-active"),n.setAttribute("aria-pressed","true"),n.setAttribute("aria-current","true"),this.thumbs.forEach((i,s)=>{i&&(i.tabIndex=s===e?0:-1)}),this.centerThumb(e,this.preferredScrollBehavior())),this.updateCounter(),this.updateScrollState()}renderWindowAround(e){const t=Math.max(4,Math.ceil(this.listEl.clientWidth/this.approxThumbPitch())||4),n=Math.max(0,e-rs),i=Math.min(this.artworks.length-1,e+t+rs);this.renderWindow(n,i)}renderWindowFromScroll(){if(!this.virtualized)return;const e=this.approxThumbPitch(),t=Math.max(4,Math.ceil(this.listEl.clientWidth/e)||4),n=Math.max(0,Math.floor(this.listEl.scrollLeft/e)-rs),i=Math.min(this.artworks.length-1,n+t+rs*2);this.renderWindow(n,i)}renderWindow(e,t){if(!(e===this.renderedStart&&t===this.renderedEnd)){for(let n=e;n<=t;n+=1)this.ensureThumb(n);for(let n=0;n<this.thumbs.length;n+=1)(n<e||n>t)&&this.unmountThumb(n);this.renderedStart=e,this.renderedEnd=t}}approxThumbPitch(){const e=this.thumbs.find(Boolean);return e?e.getBoundingClientRect().width+12:162}centerThumb(e,t){this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(e);if(!n)return;const i=this.listEl.getBoundingClientRect(),s=n.getBoundingClientRect();if(i.width<=0||s.width<=0)return;const a=s.left+s.width*.5-(i.left+i.width*.5);if(Math.abs(a)<1)return;const o=this.listEl.scrollLeft+a;this.listEl.scrollTo({left:o,behavior:t}),this.diagnostics.getMode()!=="default"&&this.diagnostics.debug("timeline","center-active","Centered active timeline thumbnail",{index:e,delta:Math.round(a),targetLeft:Math.round(o),behavior:t})}updateCounter(){this.counterEl.textContent=`${this.currentIndex+1} / ${this.artworks.length}`}updateScrollState(){this.updateCounter();const e=Math.max(0,this.listEl.scrollWidth-this.listEl.clientWidth-1),t=this.listEl.scrollLeft<=1,n=this.listEl.scrollLeft>=e;this.prevButton.disabled=t,this.nextButton.disabled=n,this.el.classList.toggle("timeline--at-start",t),this.el.classList.toggle("timeline--at-end",n)}preferredScrollBehavior(){if(document.documentElement.dataset.motion==="reduced")return"auto";try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}catch(e){return"smooth"}}async prewarmUnderOverlay(){const e=[];for(let s=0;s<this.artworks.length;s+=1){const a=this.ensureThumb(s);if(!a)continue;const o=a.querySelector(".timeline__img");o&&(o.loading="eager",a.offsetWidth,a.getBoundingClientRect(),typeof o.decode=="function"&&e.push(o.decode().then(()=>"decoded").catch(()=>"failed")))}this.el.offsetHeight,this.listEl.scrollWidth,getComputedStyle(this.el).opacity;const t=await Promise.allSettled(e);let n=0,i=0;return t.forEach(s=>{s.status==="fulfilled"&&s.value==="decoded"?n+=1:i+=1}),this.updateScrollState(),this.diagnostics.info("timeline","prewarm-under-overlay","Timeline DOM and thumbnail images prebuilt under loading overlay",{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:i,virtualized:this.virtualized}),{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:i}}onSelect(e){this.onSelectCallback=e}onPreview(e){this.onPreviewCallback=e}dispose(){this.prevButton.removeEventListener("click",this.onPrevPage),this.nextButton.removeEventListener("click",this.onNextPage),this.listEl.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onResize),this.thumbs.forEach(e=>e==null?void 0:e.removeEventListener("keydown",this.handleThumbKey)),this.thumbs.length=0,this.items.length=0,this.el.remove()}}const Dd=.6;function my(r){if(!(r instanceof HTMLElement))return!1;const e=r.tagName;return!!(e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||r.isContentEditable)}class gy{constructor(e,t){x(this,"galleryManager");x(this,"keyboardHelp");x(this,"fullscreenTarget",document.documentElement);x(this,"enabled",!0);x(this,"onEscape");x(this,"handleKeyDown",e=>{var t,n;if(!(!this.enabled||e.defaultPrevented)&&!my(e.target)&&!(e.target instanceof HTMLElement&&e.target.closest(".timeline")&&(e.key==="ArrowLeft"||e.key==="ArrowRight")))switch(e.key){case"ArrowLeft":e.preventDefault(),this.galleryManager.navigate(-1);break;case"ArrowRight":e.preventDefault(),this.galleryManager.navigate(1);break;case"+":case"=":e.preventDefault(),this.galleryManager.addZoomDelta(-Dd);break;case"-":case"_":e.preventDefault(),this.galleryManager.addZoomDelta(Dd);break;case"0":case"r":case"R":e.preventDefault(),this.galleryManager.resetView();break;case"f":case"F":e.preventDefault(),this.toggleFullscreen();break;case"?":e.preventDefault(),(t=this.keyboardHelp)==null||t.open();break;case"Escape":if(document.fullscreenElement)break;(n=this.onEscape)==null||n.call(this);break}});this.galleryManager=e,this.keyboardHelp=t,window.addEventListener("keydown",this.handleKeyDown)}setFullscreenTarget(e){this.fullscreenTarget=e}setEnabled(e){this.enabled=e}toggleFullscreen(){document.fullscreenEnabled&&(document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.fullscreenTarget.requestFullscreen().catch(()=>{}))}dispose(){window.removeEventListener("keydown",this.handleKeyDown)}}const da=rn("KeyboardHelp"),vy=[["←  →","Nächstes / vorheriges Bild"],["+  −","Heran-/Herauszoomen"],["R","Ansicht zurücksetzen"],["F","Vollbild ein-/ausschalten"],["Esc","Dialog schließen"],["?","Diese Hilfe anzeigen"]];class yy{constructor(){x(this,"dialog");x(this,"opener",null);x(this,"onKeyDown",e=>{if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.close();return}e.key==="Tab"&&this.trapFocus(e)});this.dialog=this.build(),document.body.appendChild(this.dialog),da.debug("init","KeyboardHelp component created")}build(){const e=document.createElement("div");return e.id="keyboard-help",e.className="keyboard-help",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","keyboard-help-title"),e.hidden=!0,e.innerHTML=`
      <div class="keyboard-help__panel">
        <h2 id="keyboard-help-title" class="keyboard-help__title">Tastaturkürzel</h2>
        <table class="keyboard-help__table">
          <tbody>
            ${vy.map(([t,n])=>`<tr><td><kbd class="keyboard-help__key">${t}</kbd></td><td>${n}</td></tr>`).join("")}
          </tbody>
        </table>
        <p class="keyboard-help__hint">Mausbewegung zum unteren oder linken Bildschirmrand enthüllt Zeitleiste, Navigation und Bildinformationen.</p>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`,e.querySelector(".keyboard-help__close").addEventListener("click",()=>this.close()),e.addEventListener("click",t=>{t.target===e&&this.close()}),e}open(e){var t;this.opener=e!=null?e:null,this.dialog.hidden=!1,document.addEventListener("keydown",this.onKeyDown),(t=this.dialog.querySelector(".keyboard-help__close"))==null||t.focus(),da.debug("open","keyboard help opened")}close(){var e;this.dialog.hidden=!0,document.removeEventListener("keydown",this.onKeyDown),(e=this.opener)==null||e.focus(),this.opener=null,da.debug("close","keyboard help closed")}trapFocus(e){const t=Array.from(this.dialog.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'));if(!t.length)return;const n=t[0],i=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),n.focus())}dispose(){document.removeEventListener("keydown",this.onKeyDown),this.dialog.remove(),da.debug("dispose","KeyboardHelp component disposed")}}const xy=50;class by{constructor(e,t){x(this,"canvas");x(this,"galleryManager");x(this,"diagnostics",rn("interaction"));x(this,"usePointerEvents");x(this,"disposed",!1);x(this,"enabled",!0);x(this,"state","idle");x(this,"active",new Map);x(this,"lastPinchDist",0);x(this,"onPointerDown",e=>{if(this.enabled&&!(e.pointerType==="mouse"&&e.button!==0)){try{this.canvas.setPointerCapture(e.pointerId)}catch(t){}if(this.active.set(e.pointerId,{id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY}),this.active.size===1)this.state=this.galleryManager.canPan()?"panning":"swipe-candidate",this.diagnostics.debug("gesture-start","Pointer gesture started",{pointerType:e.pointerType,state:this.state});else if(this.active.size===2){const t=[...this.active.values()];this.lastPinchDist=Nd(t[0].lastX,t[0].lastY,t[1].lastX,t[1].lastY),this.state="pinching",this.diagnostics.debug("gesture-start","Pinch gesture started",{})}}});x(this,"onPointerMove",e=>{this.handlePointerMove(e)});x(this,"onGlobalPointerMove",e=>{e.target!==this.canvas&&this.handlePointerMove(e)});x(this,"onPointerUp",e=>{if(!this.enabled)return;const t=this.active.get(e.pointerId);this.active.delete(e.pointerId);try{this.canvas.releasePointerCapture(e.pointerId)}catch(n){}if(this.state==="pinching"&&this.active.size<2){this.state=this.galleryManager.canPan()?"panning":"swipe-candidate";return}this.state==="swipe-candidate"&&t&&this.active.size===0&&this.resolveSwipe(t,e.clientX,e.clientY),this.active.size===0&&(this.state="idle")});x(this,"onGlobalPointerUp",e=>{e.target!==this.canvas&&this.onPointerUp(e)});x(this,"onPointerCancel",e=>{this.enabled&&(this.active.delete(e.pointerId),this.active.size===0&&(this.state="idle",this.diagnostics.debug("gesture-cancel","Pointer gesture cancelled",{})))});x(this,"onGlobalPointerCancel",e=>{e.target!==this.canvas&&this.onPointerCancel(e)});x(this,"onTouchStart",e=>{if(this.enabled)if(e.cancelable&&e.preventDefault(),e.touches.length===1){const t=e.touches[0];this.active.clear(),this.active.set(0,{id:0,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY}),this.state=this.galleryManager.canPan()?"panning":"swipe-candidate"}else e.touches.length===2&&(this.state="pinching",this.lastPinchDist=this.getTouchDist(e))});x(this,"onTouchMove",e=>{if(!this.enabled)return;if(e.touches.length>=2){e.cancelable&&e.preventDefault();const a=this.getTouchDist(e),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02),this.state="pinching";return}if(e.touches.length!==1)return;const t=this.active.get(0);if(!t)return;const n=e.touches[0],i=n.clientX-t.lastX,s=n.clientY-t.lastY;t.lastX=n.clientX,t.lastY=n.clientY,this.galleryManager.canPan()&&(e.cancelable&&e.preventDefault(),this.galleryManager.setPanOffset(i*.004,-s*.004),this.state="panning")});x(this,"onGlobalTouchMove",e=>{e.target===this.canvas||this.state==="idle"||this.onTouchMove(e)});x(this,"onTouchEnd",e=>{if(this.enabled){if(this.state==="swipe-candidate"&&e.changedTouches.length>0){const t=this.active.get(0);t&&this.resolveSwipe(t,e.changedTouches[0].clientX,e.changedTouches[0].clientY)}e.touches.length===0&&(this.active.clear(),this.state="idle")}});x(this,"onWheel",e=>{this.enabled&&this.galleryManager.addZoomDelta(e.deltaY*.0045)});x(this,"onLegacyMouseMove",e=>{this.enabled&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY)});this.canvas=e,this.galleryManager=t,this.usePointerEvents=typeof window.PointerEvent=="function",this.usePointerEvents?(this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointercancel",this.onPointerCancel),this.canvas.addEventListener("lostpointercapture",this.onPointerCancel),window.addEventListener("pointermove",this.onGlobalPointerMove,{passive:!0}),window.addEventListener("pointerup",this.onGlobalPointerUp,{passive:!0}),window.addEventListener("pointercancel",this.onGlobalPointerCancel,{passive:!0})):(this.canvas.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.onTouchEnd,{passive:!0}),this.canvas.addEventListener("touchcancel",this.onTouchEnd,{passive:!0}),window.addEventListener("mousemove",this.onLegacyMouseMove,{passive:!0}),window.addEventListener("touchmove",this.onGlobalTouchMove,{passive:!1})),this.canvas.addEventListener("wheel",this.onWheel,{passive:!0}),this.diagnostics.info("init","Canvas interaction initialised",{backend:this.usePointerEvents?"pointer-events":"touch-events-fallback"})}handlePointerMove(e){if(!this.enabled)return;const t=this.active.get(e.pointerId);if(!t){e.pointerType==="mouse"&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY);return}const n=e.clientX-t.lastX,i=e.clientY-t.lastY;if(t.lastX=e.clientX,t.lastY=e.clientY,this.state==="pinching"&&this.active.size===2){const s=[...this.active.values()],a=Nd(s[0].lastX,s[0].lastY,s[1].lastX,s[1].lastY),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02);return}this.active.size===1&&this.galleryManager.canPan()&&(this.state="panning",this.galleryManager.setPanOffset(n*.004,-i*.004))}getTouchDist(e){const t=e.touches[0].clientX-e.touches[1].clientX,n=e.touches[0].clientY-e.touches[1].clientY;return Math.sqrt(t*t+n*n)}updateHoverRotation(e,t){if(document.documentElement.dataset.pointerPrimary==="coarse")return;const n=e/window.innerWidth*2-1,i=t/window.innerHeight*2-1,s=this.galleryManager.getHoverRotationScale();this.galleryManager.setHoverTarget(n*s.x,i*s.y)}resolveSwipe(e,t,n){const i=t-e.startX,s=n-e.startY;Math.abs(i)>Math.abs(s)&&Math.abs(i)>xy&&(this.galleryManager.navigate(i<0?1:-1),this.diagnostics.debug("swipe","Swipe resolved",{direction:i<0?"next":"prev"}))}setEnabled(e){this.enabled!==e&&(this.enabled=e,e||(this.active.clear(),this.state="idle",this.galleryManager.setHoverTarget(0,0)))}dispose(){this.disposed||(this.disposed=!0,this.usePointerEvents?(this.canvas.removeEventListener("pointerdown",this.onPointerDown),this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas.removeEventListener("pointerup",this.onPointerUp),this.canvas.removeEventListener("pointercancel",this.onPointerCancel),this.canvas.removeEventListener("lostpointercapture",this.onPointerCancel),window.removeEventListener("pointermove",this.onGlobalPointerMove),window.removeEventListener("pointerup",this.onGlobalPointerUp),window.removeEventListener("pointercancel",this.onGlobalPointerCancel)):(this.canvas.removeEventListener("touchstart",this.onTouchStart),this.canvas.removeEventListener("touchmove",this.onTouchMove),this.canvas.removeEventListener("touchend",this.onTouchEnd),this.canvas.removeEventListener("touchcancel",this.onTouchEnd),window.removeEventListener("mousemove",this.onLegacyMouseMove),window.removeEventListener("touchmove",this.onGlobalTouchMove)),this.canvas.removeEventListener("wheel",this.onWheel),this.active.clear())}}function Nd(r,e,t,n){const i=t-r,s=n-e;return Math.sqrt(i*i+s*s)}const Qe=1e-6,Fd=.022,_y=.002,$=(r,e)=>({x:r,y:e}),Je=(r,e,t)=>({x:r,y:e,z:t});function it(r){return{x:r.x,y:r.y}}function Qt(r){return r.map(it)}function ss(r){let e=0;for(let t=0;t<r.length;t+=1){const n=r[t],i=r[(t+1)%r.length];e+=n.x*i.y-i.x*n.y}return e/2}function Od(r){return ss(r)>0}function ua(r){return Od(r)?r:[r[0],r[3],r[2],r[1]]}function Ei(r){let e=0;for(let t=0;t<r.length;t+=1){const n=r[t],i=r[(t+1)%r.length],s=r[(t+2)%r.length],a=(i.x-n.x)*(s.y-i.y)-(i.y-n.y)*(s.x-i.x),o=Math.sign(a);if(o!==0){if(e!==0&&o!==e)return!1;e=o}}return e!==0}function _r(r,e=Qe){return Math.abs(ss(r))<=e}function ha(r,e){return Math.hypot(e.x-r.x,e.y-r.y)}function Bd(r){return Math.min(ha(r[0],r[1]),ha(r[1],r[2]),ha(r[2],r[3]),ha(r[3],r[0]))}function ni(r,e){let t=!1;for(let n=0,i=e.length-1;n<e.length;i=n,n+=1){const s=e[n],a=e[i],o=a.y-s.y,l=Math.abs(o)<=Qe?o<0?-Qe:Qe:o;s.y>r.y!=a.y>r.y&&r.x<(a.x-s.x)*(r.y-s.y)/l+s.x&&(t=!t)}return t}function zd(r,e){let t=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY;for(const i of r){const s=i.x*e.x+i.y*e.y;s<t&&(t=s),s>n&&(n=s)}return{min:t,max:n}}function Vo(r,e){const t=[r,e];for(const n of t)for(let i=0;i<n.length;i+=1){const s=n[i],a=n[(i+1)%n.length],o=$(a.x-s.x,a.y-s.y),l=$(-o.y,o.x),c=zd(r,l),d=zd(e,l);if(c.max<d.min||d.max<c.min)return!1}return!0}function Wo(r,e){const t=r.reduce((n,i)=>$(n.x+i.x,n.y+i.y),$(0,0));return t.x/=r.length,t.y/=r.length,r.map(n=>$(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e))}function Sr(r){const e=ua(r);if(_r(e)||!Ei(e))return null;const[t,n,i,s]=e,a=n.x-i.x,o=n.y-i.y,l=s.x-i.x,c=s.y-i.y,d=t.x-n.x+i.x-s.x,u=t.y-n.y+i.y-s.y,h=a*c-l*o;if(Math.abs(h)<=Qe)return null;const f=(d*c-l*u)/h,g=(a*u-d*o)/h,v=n.x-t.x+f*n.x,m=s.x-t.x+g*s.x,p=t.x,S=n.y-t.y+f*n.y,y=s.y-t.y+g*s.y,b=t.y;return[v,m,p,S,y,b,f,g,1]}function fa(r){const[e,t,n,i,s,a,o,l,c]=r,d=s*c-a*l,u=-(i*c-a*o),h=i*l-s*o,f=-(t*c-n*l),g=e*c-n*o,v=-(e*l-t*o),m=t*a-n*s,p=-(e*a-n*i),S=e*s-t*i,y=e*d+t*u+n*h;if(Math.abs(y)<=Qe)return null;const b=1/y;return[d*b,f*b,m*b,u*b,g*b,p*b,h*b,v*b,S*b]}function Hd(r,e){return[r[0]*e[0]+r[1]*e[3]+r[2]*e[6],r[0]*e[1]+r[1]*e[4]+r[2]*e[7],r[0]*e[2]+r[1]*e[5]+r[2]*e[8],r[3]*e[0]+r[4]*e[3]+r[5]*e[6],r[3]*e[1]+r[4]*e[4]+r[5]*e[7],r[3]*e[2]+r[4]*e[5]+r[5]*e[8],r[6]*e[0]+r[7]*e[3]+r[8]*e[6],r[6]*e[1]+r[7]*e[4]+r[8]*e[7],r[6]*e[2]+r[7]*e[5]+r[8]*e[8]]}function Ti(r,e,t){const[n,i,s,a,o,l,c,d,u]=r,h=c*e+d*t+u;return Math.abs(h)<=Qe?null:$((n*e+i*t+s)/h,(a*e+o*t+l)/h)}function Gd(r,e,t){const n=Math.max(1,e),i=Math.max(1,t);return[r[0]/n,r[1]/i,r[2],r[3]/n,r[4]/i,r[5],r[6]/n,r[7]/i,r[8]]}function Vd(r){return`matrix3d(${r[0]}, ${r[3]}, 0, ${r[6]}, ${r[1]}, ${r[4]}, 0, ${r[7]}, 0, 0, 1, 0, ${r[2]}, ${r[5]}, 0, ${r[8]})`}function pa(r,e){const t=Sr(r.quad);if(!t)return null;const n=fa(t);return n?Ti(n,e.x,e.y):null}function Wd(r){const e=r.map(o=>o.x),t=r.map(o=>o.y),n=Math.min(...e),i=Math.max(...e),s=Math.min(...t),a=Math.max(...t);return{minX:n,minY:s,maxX:i,maxY:a,width:i-n,height:a-s}}function Hn(r,e){return Je(r.x-e.x,r.y-e.y,r.z-e.z)}function Gn(r,e){return Je(r.x+e.x,r.y+e.y,r.z+e.z)}function Ai(r,e){return Je(r.x*e,r.y*e,r.z*e)}function wr(r,e){return r.x*e.x+r.y*e.y+r.z*e.z}function as(r,e){return Je(r.y*e.z-r.z*e.y,r.z*e.x-r.x*e.z,r.x*e.y-r.y*e.x)}function An(r){const e=Math.hypot(r.x,r.y,r.z);return Number.isFinite(e)&&e>Qe?Ai(r,1/e):null}function Xd(r){const e=An(Hn(r.target,r.position)),t=Je(0,1,0),n=e?An(as(e,t)):null,i=n&&e?An(as(n,e)):null;return!e||!n||!i?null:{right:n,up:i,forward:e}}function Sy(r,e){if(!Number.isFinite(r.verticalFovDeg)||r.verticalFovDeg<=1||r.verticalFovDeg>=179||e.width<=0||e.height<=0)return null;const t=Math.tan(r.verticalFovDeg*Math.PI/360);if(!Number.isFinite(t)||t<=Qe)return null;const n=e.height/(2*t);return[n,0,e.width/2,0,-n,e.height/2,0,0,1]}function Xo(r,e){const t=Xd(r);return t?Je(t.right.x*e.x+t.up.x*e.y+t.forward.x*e.z,t.right.y*e.x+t.up.y*e.y+t.forward.y*e.z,t.right.z*e.x+t.up.z*e.y+t.forward.z*e.z):null}function $o(r){return Number.isFinite(r.x)&&Number.isFinite(r.y)&&Number.isFinite(r.z)}function os(r,e){return Gn(Gn(r.origin,Ai(r.axisU,e.x)),Ai(r.axisV,e.y))}function ma(r){return An(as(r.axisU,r.axisV))}function $d(r,e,t,n,i){const s=Ai(e,n/2),a=Ai(t,i/2);return[Gn(Hn(r,s),a),Gn(Gn(r,s),a),Hn(Gn(r,s),a),Hn(Hn(r,s),a)]}function Yd(r,e,t,n){const i=(r.x-e.x)*(t.y-n.y)-(r.y-e.y)*(t.x-n.x);if(Math.abs(i)<=Qe)return null;const s=r.x*e.y-r.y*e.x,a=t.x*n.y-t.y*n.x;return $((s*(t.x-n.x)-(r.x-e.x)*a)/i,(s*(t.y-n.y)-(r.y-e.y)*a)/i)}function wy(r,e,t,n){const i=Hn(e.frontQuad[1],e.frontQuad[0]),s=Hn(e.frontQuad[3],e.frontQuad[0]),a=An(as(i,s)),o=ma(r),l=a&&o?Math.abs(wr(a,o)):0,c=e.frontQuad.map(p=>wr(Hn(p,e.wallCenter),e.basisN)),d=Math.max(...c)-Math.min(...c),u=Yd(t[0],t[1],t[3],t[2]),h=Yd(n[0],n[1],n[3],n[2]),f=u&&h?Math.hypot(u.x-h.x,u.y-h.y):null,v=Zo(n)!=="flat"?f!==null&&f<=.01:u===null&&h===null,m=l>=1-1e-6&&d<=1e-6&&v;return{normalDot:l,wallOffsetSpread:d,artworkHorizontalVanishingPoint:u,wallHorizontalVanishingPoint:h,horizontalVanishingResidualPx:f,passes:m}}function qd(r,e,t,n,i=_y,s=Fd){const a=An(r.axisU),o=An(r.axisV);if(!a||!o||Math.abs(wr(a,o))>1e-5||!Number.isFinite(t)||t<=Qe||!Number.isFinite(n)||n<=Qe||!Number.isFinite(i)||i<0||!Number.isFinite(s)||s<=Qe)return null;const l=An(as(a,o));if(!l)return null;const c=t*n,d=os(r,e),u=Gn(d,Ai(l,i)),h=Gn(u,Ai(l,s));return{basisU:a,basisV:o,basisN:l,wallCenter:d,backCenter:u,frontCenter:h,width:c,height:t,depth:s,mountingGap:i,backQuad:$d(u,a,o,c,t),frontQuad:$d(h,a,o,c,t)}}function My(r){return[$(0,r.height),$(r.width,r.height),$(r.width,0),$(0,0)]}function Mr(r,e,t){var g,v,m,p;if(!$o(r.position)||!$o(r.target)||!$o(e)||!Number.isFinite(r.verticalFovDeg)||!Number.isFinite(r.near)||r.far!==void 0&&(!Number.isFinite(r.far)||r.far<=r.near)||r.verticalFovDeg<=1||r.verticalFovDeg>=179||r.near<=0||t.width<=0||t.height<=0)return null;const n=Xd(r);if(!n)return null;const i=Hn(e,r.position),s=wr(i,n.right),a=wr(i,n.up),o=wr(i,n.forward);if(!Number.isFinite(s)||!Number.isFinite(a)||!Number.isFinite(o)||o<=r.near||r.far!==void 0&&o>=r.far)return null;const l=Math.tan(r.verticalFovDeg*Math.PI/360),c=t.width/t.height;if(!Number.isFinite(l)||l<=Qe||!Number.isFinite(c)||c<=Qe)return null;const d=s/(o*l*c),u=a/(o*l);if(!Number.isFinite(d)||!Number.isFinite(u))return null;const h=(v=(g=r.lensShift)==null?void 0:g.x)!=null?v:0,f=(p=(m=r.lensShift)==null?void 0:m.y)!=null?p:0;return $((d+1)*t.width/2+h*t.width,(1-u)*t.height/2+f*t.height)}function Zd(r,e,t,n){return Mr(e,os(r,t),n)}function Yo(r,e,t){const n=My(r).map(s=>Zd(r,e,s,t));if(n.some(s=>s===null))return null;const i=[n[0],n[1],n[2],n[3]];return _r(i)||!Ei(i)?null:ua(i)}function qo(r,e,t,n){const i=t.map(s=>Zd(r,e,s,n));return i.some(s=>s===null)?null:i}function Kd(r,e,t){return r.doorwayExclusions.map(n=>qo(r,e,n,t)).filter(n=>n!==null)}function jd(r,e){if(!r||!e||r.length!==e.length||r.length===0)return{max:null,mean:null};const t=r.map((n,i)=>Math.hypot(n.x-e[i].x,n.y-e[i].y));return{max:Math.max(...t),mean:t.reduce((n,i)=>n+i,0)/t.length}}function Zo(r,e=.02){const t=r[1].x-r[0].x,n=Math.abs(t)<=Qe?0:(r[1].y-r[0].y)/t;return Math.abs(n)<=e?"flat":n>0?"left":"right"}function Qd(r,e,t,n,i,s,a=36){var S,y,b,U;const o=jd(t,e),l=jd(i,n),c=Math.hypot(r.axisU.x,r.axisU.y,r.axisU.z),d=Math.hypot(r.axisV.x,r.axisV.y,r.axisV.z),u=c>Qe&&d>Qe?(r.axisU.x*r.axisV.x+r.axisU.y*r.axisV.y+r.axisU.z*r.axisV.z)/(c*d):Number.POSITIVE_INFINITY,h=e[1].x-e[0].x,f=Math.abs(h)<=Qe?0:(e[1].y-e[0].y)/h,g=Zo(e),v=g===s,m=ss(e)>Qe,p=m&&v&&Math.abs(c-1)<=.08&&Math.abs(d-1)<=.08&&Math.abs(u)<=.08&&((S=o.max)!=null?S:Number.POSITIVE_INFINITY)<=a&&((y=l.max)!=null?y:0)<=a;return{referenceResidualMaxPx:(b=o.max)!=null?b:Number.POSITIVE_INFINITY,referenceResidualMeanPx:(U=o.mean)!=null?U:Number.POSITIVE_INFINITY,safeResidualMaxPx:l.max,safeResidualMeanPx:l.mean,axisULength:c,axisVLength:d,axisDot:u,expectedConvergence:s,projectedConvergence:g,convergenceSlope:f,convergenceMatchesExpected:v,windingClockwise:m,thresholdPx:a,passes:p}}function Ey(r,e,t,n,i,s,a=36){const o=Sr(e),l=Sy(n,i);if(!o||!l)return null;const c=fa(l);if(!c)return null;const d=(F,N)=>{const Y=[1/Math.max(Qe,F),0,0,0,-1/Math.max(Qe,N),1,0,0,1],X=Hd(o,Y),Q=Hd(c,X),q=Je(Q[0],Q[3],Q[6]),re=Je(Q[1],Q[4],Q[7]),ce=Je(Q[2],Q[5],Q[8]),ve=Math.hypot(q.x,q.y,q.z),te=Math.hypot(re.x,re.y,re.z);return ve<=Qe||te<=Qe?null:{homography:X,basis1:q,basis2:re,origin:ce,norm1:ve,norm2:te}},u=d(r.width,r.height);if(!u)return null;const h=r.width*u.norm1,f=r.height*u.norm2,g=d(h,f);if(!g)return null;const v=Je(g.origin.x,g.origin.y,g.origin.z),m=An(g.basis1),p=An(g.basis2),S=Xo(n,v),y=m?Xo(n,m):null,b=p?Xo(n,p):null;if(!S||!y||!b)return null;const U=h/r.width,P=f/r.height,E=F=>$(F.x*U,F.y*P),L=t&&t.length>=3?(()=>{const F=fa(g.homography);if(!F)return r.safePolygon.map(E);const N=t.map(Y=>Ti(F,Y.x,Y.y)).filter(Y=>Y!==null);return N.length===t.length?N:r.safePolygon.map(E)})():r.safePolygon.map(E),M={origin:Gn(n.position,S),axisU:y,axisV:b,width:h,height:f,safePolygon:L,doorwayExclusions:r.doorwayExclusions.map(F=>F.map(E)),hangingBand:{minY:r.hangingBand.minY*P,maxY:r.hangingBand.maxY*P,margin:r.hangingBand.margin*P}},_=Yo(M,n,i);if(!_)return null;const I=qo(M,n,M.safePolygon,i),B=Qd(M,_,e,I,t,s,a);return{room:M,scaleX:U,scaleY:P,projectedQuad:_,projectedSafePolygon:I,realism:B}}function Jd(r){return{minX:Math.min(...r.map(e=>e.x)),maxX:Math.max(...r.map(e=>e.x)),minY:Math.min(...r.map(e=>e.y)),maxY:Math.max(...r.map(e=>e.y))}}function Ty(r,e,t){const n=e/2,i=t/2;return[$(r.x-n,r.y+i),$(r.x+n,r.y+i),$(r.x+n,r.y-i),$(r.x-n,r.y-i)]}function eu(r,e,t,n){const i=Jd(r.safePolygon),s=Math.max(Qe,n),a=Math.max(Qe,i.maxX-i.minX),o=Math.max(Qe,r.hangingBand.maxY-r.hangingBand.minY-r.hangingBand.margin*2),l=Math.max(Qe,Math.min(t,o,a/s)),c=(E,L)=>{const M=Ty(E,L*s,L),_=[...M,E].every(X=>Number.isFinite(X.x)&&Number.isFinite(X.y)),I=M.every(X=>ni(X,r.safePolygon)),B=r.doorwayExclusions.every(X=>!Vo(M,X)),F=M.every(X=>X.y>=r.hangingBand.minY+r.hangingBand.margin-Qe&&X.y<=r.hangingBand.maxY-r.hangingBand.margin+Qe),N=Ei(M)&&Math.abs(ss(M))>Qe;return{anchor:E,mountedHeight:L,localQuad:M,validity:{finite:_,contained:I,doorwayClear:B,inHangingBand:F,orientationConsistent:N},moved:!1,scaleFactor:1,candidateCount:1,adjustmentReason:"none",rejectionReason:_?N?I?B?F?"none":"outside-hanging-band":"doorway-overlap":"outside-safe-region":"degenerate-local-quad":"non-finite"}},d=[1,.97,.94,.91,.88,.85,.82,.79,.76,.73,.7,.67,.64,.61,.58,.55],u=r.doorwayExclusions.map(E=>Jd(E)),h=E=>Math.round(E*1e4)/1e4,f=(E,L,M,_)=>{if(!Number.isFinite(L))return;const I=Math.min(_,Math.max(M,L));E.some(B=>Math.abs(B-I)<=1e-4)||E.push(h(I))},g=c($(e.x,e.y),l);let v=g,m=null,p=Number.POSITIVE_INFINITY,S=0;for(const E of d){const L=Math.max(Qe,l*E),M=L*s/2,_=L/2,I=i.minX+M,B=i.maxX-M,F=r.hangingBand.minY+r.hangingBand.margin+_,N=r.hangingBand.maxY-r.hangingBand.margin-_;if(I>B||F>N)continue;const Y=[],X=[],Q=Math.min(B,Math.max(I,e.x)),q=Math.min(N,Math.max(F,e.y));f(Y,Q,I,B),f(Y,I,I,B),f(Y,B,I,B),f(X,q,F,N),f(X,F,F,N),f(X,N,F,N);for(const ce of r.safePolygon)f(Y,ce.x,I,B),f(X,ce.y,F,N);const re=Math.max(.01,r.hangingBand.margin*.5);for(const ce of u)f(Y,ce.minX-M-re,I,B),f(Y,ce.maxX+M+re,I,B),f(X,ce.maxY+_+re,F,N),f(X,ce.minY-_-re,F,N);for(const ce of X)for(const ve of Y){S+=1;const te=c($(ve,ce),L);if(te.scaleFactor=E,te.candidateCount=S,v=te,!te.validity.finite||!te.validity.contained||!te.validity.doorwayClear||!te.validity.inHangingBand||!te.validity.orientationConsistent)continue;const Ve=Math.hypot(te.anchor.x-e.x,te.anchor.y-e.y),J=Math.abs(l-L)/Math.max(l,Qe),oe=Ve+J*.75;oe<p-1e-6&&(p=oe,m=te)}if(m)break}const y=m!=null?m:v,b=Math.abs(y.anchor.x-e.x)>1e-6||Math.abs(y.anchor.y-e.y)>1e-6,U=Math.abs(y.mountedHeight-t)>1e-6;y.moved=b,y.candidateCount=Math.max(S,1),y.scaleFactor=Math.max(Qe,y.mountedHeight/Math.max(t,Qe));const P=!g.validity.doorwayClear;return y.adjustmentReason=m?b&&U?"shifted-and-shrunk":b?P?"shifted-away-from-doorway":"clamped-safe-region":U?"shrunk-to-fit":"none":"rejected",m?(y.rejectionReason="none",y):(y.rejectionReason=y.rejectionReason==="none"?"no-valid-candidate":y.rejectionReason,y)}function Ci(r,e,t,n){if(r.room&&r.camera&&e.anchor){const S=eu(r.room,e.anchor,e.mountedHeight,t);if(!S.validity.finite||!S.validity.contained||!S.validity.doorwayClear||!S.validity.inHangingBand||!S.validity.orientationConsistent||r.projectionRealism&&!r.projectionRealism.passes)return null;const y=qd(r.room,S.anchor,S.mountedHeight,t,e.mountingGap);if(!y)return null;const b=y.frontQuad.map(N=>Mr(r.camera,N,n));if(b.some(N=>N===null))return null;const U=y.frontQuad,P=[b[0],b[1],b[2],b[3]],E=ua(P);if(_r(E)||!Ei(E)||r.safePolygon&&!E.every(N=>ni(N,r.safePolygon)))return null;const L=Math.max(1,S.mountedHeight/r.room.height*n.height),M=Math.max(1,L*Math.max(Qe,t)),_=Sr(E);if(!_)return null;const I=Gd(_,M,L),B=Yo(r.room,r.camera,n);if(!B)return null;const F=wy(r.room,y,P,B);return F.passes?{localQuad:S.localQuad,worldQuad:U,projectedQuad:E,bounds:Wd(E),sourceWidth:M,sourceHeight:L,cssMatrix3d:Vd(I),shortEdge:Bd(E),placement:S,projectedAnchor:Mr(r.camera,y.frontCenter,n),validity:S.validity,realism:r.projectionRealism,alignment:F}:null}const i=Math.max(Qe,t),s=Math.max(Qe,Math.min(1,r.planeAspect/i)),a=Math.max(Qe,Math.min(e.mountedHeight,s)),l=a*i/Math.max(Qe,r.planeAspect)/2,c=a/2,d=[$(e.center.x-l,e.center.y-c),$(e.center.x+l,e.center.y-c),$(e.center.x+l,e.center.y+c),$(e.center.x-l,e.center.y+c)],u=Sr(r.quad);if(!u)return null;const h=d.map(S=>Ti(u,S.x,S.y));if(h.some(S=>S===null))return null;const f=ua([h[0],h[1],h[2],h[3]]),g=Math.max(1,a*n.height),v=Math.max(1,g*t),m=Sr(f);if(!m)return null;const p=Gd(m,v,g);return{localQuad:d,projectedQuad:f,bounds:Wd(f),sourceWidth:v,sourceHeight:g,cssMatrix3d:Vd(p),shortEdge:Bd(f),placement:null}}const Ay=new Set(["Backgrounds/museum-target.png"]);function Cy(r){return r.trim().replace(/^[./]+/,"").replace(/^backgrounds\//i,"Backgrounds/")}function Ry(r,e,t){return t||!r||!e||r===e?null:e}function Ko(r){return r===404}function jo(r){return r.trim()?Ay.has(Cy(r)):!1}const Cn=4,Rn={width:1366,height:768},Qo=Rn.width/Rn.height,Er="Backgrounds/museum-empty.png",tu="#C7CED4",Py=1500,ga=72,va={position:Je(0,1.72,9),target:Je(0,2.05,-1.2),verticalFovDeg:48,near:.1,far:40,lensShift:$(0,0)},Ri=9,Vn=12,Jt=5.2,dn=-5.5,Pn=dn+Vn,nu=1.5,Wn=2.5,ii=Wn+1.05,ri=2.3;function Jo(r,e,t,n,i=[]){return{origin:r,axisU:e,axisV:Je(0,1,0),width:t,height:n,safePolygon:[$(.14,.14),$(t-.14,.14),$(t-.14,n-.14),$(.14,n-.14)],doorwayExclusions:i,hangingBand:{minY:.42,maxY:n-.28,margin:.08}}}function ya(r,e,t,n){return{origin:r,axisU:e,axisV:Je(0,1,0),width:t,height:n}}const Iy=[{id:"wall-front",group:"front",planeAspect:Ri/Jt,quad:[$(417.26,206.29),$(948.74,206.29),$(951.84,514.71),$(414.16,514.71)],safePolygon:[$(422.61,506.32),$(943.39,506.32),$(940.55,214.5),$(425.45,214.5)],drawableRegion:[$(.14,.14),$(8.86,.14),$(8.86,4.92),$(.14,4.92)],transform:ya(Je(-4.5,0,dn),Je(1,0,0),Ri,Jt),hangingBand:{minY:.42,maxY:3.4,margin:.08},shadowVector:$(0,14),room:Jo(Je(-4.5,0,dn),Je(1,0,0),Ri,Jt)},{id:"wall-right",group:"right",planeAspect:Vn/Jt,quad:[$(948.74,206.29),$(2169.34,-738.13),$(2271.63,1019.43),$(951.84,514.71)],safePolygon:[$(954.38,507.24),$(2182.95,938.83),$(2096.06,-637.45),$(951.4,212.59)],drawableRegion:[$(.14,.14),$(11.86,.14),$(11.86,4.92),$(.14,4.92)],exclusionPolygons:[[$(Wn-dn,0),$(ii-dn,0),$(ii-dn,ri),$(Wn-dn,ri)]],transform:ya(Je(4.5,0,dn),Je(0,0,1),Vn,Jt),hangingBand:{minY:.42,maxY:3.4,margin:.08},shadowVector:$(8,14),room:Jo(Je(4.5,0,-5.5),Je(0,0,1),Vn,Jt,[[$(Wn-dn,0),$(ii-dn,0),$(ii-dn,ri),$(Wn-dn,ri)]])},{id:"wall-rear",group:"rear",role:"bounds-only",planeAspect:Ri/Jt,transform:ya(Je(4.5,0,Pn),Je(-1,0,0),Ri,Jt)},{id:"wall-left",group:"left",planeAspect:Vn/Jt,quad:[$(-803.34,-738.13),$(417.26,206.29),$(414.16,514.71),$(-905.63,1019.43)],safePolygon:[$(-816.95,938.83),$(411.62,507.24),$(414.6,212.59),$(-730.06,-637.45)],drawableRegion:[$(.14,.14),$(11.86,.14),$(11.86,4.92),$(.14,4.92)],exclusionPolygons:[[$(Pn-ii,0),$(Pn-Wn,0),$(Pn-Wn,ri),$(Pn-ii,ri)]],transform:ya(Je(-4.5,0,Pn),Je(0,0,-1),Vn,Jt),hangingBand:{minY:.42,maxY:3.4,margin:.08},shadowVector:$(-8,14),room:Jo(Je(-4.5,0,6.5),Je(0,0,-1),Vn,Jt,[[$(Pn-ii,0),$(Pn-Wn,0),$(Pn-Wn,ri),$(Pn-ii,ri)]])}],iu=2.32,Ly=2.3,ky=2.28,xa=.002,ba=.5,ru=.35,su=4,Uy=.5,Dy=.5;function _a(r,e,t,n,i){const s=xa;return{wallId:r,horizontalPosition:e,centerHeight:i,physicalHeight:n,mountingGap:s,center:$(e,1-i/Jt),anchor:$(e*t,i),uv:$(e,i/Jt),mountedHeight:n,targetSizePolicy:"fixed-height",minScale:1,maxScale:1,zOffset:s+.022}}const el=[{suffix:"wall-front.a",wallId:"wall-front",intendedUse:"portrait",placement:_a("wall-front",.3,Ri,1.62,iu)},{suffix:"wall-front.b",wallId:"wall-front",intendedUse:"panoramic",placement:_a("wall-front",.7,Ri,1.48,iu)},{suffix:"wall-left.a",wallId:"wall-left",intendedUse:"landscape",placement:_a("wall-left",Uy,Vn,1.45,Ly)},{suffix:"wall-right.a",wallId:"wall-right",intendedUse:"landscape",placement:_a("wall-right",Dy,Vn,1.45,ky)}],Ny=new Map(el.map(r=>[r.suffix,r.wallId])),Fy={"room-01.wall-front.a":"quiet-coastline","room-01.wall-front.b":"golden-desert","room-01.wall-left.a":"electric-storm","room-01.wall-right.a":"tokyo-passage"},at=r=>Math.min(1,Math.max(0,r)),au=r=>typeof r=="string"&&/^#[0-9a-fA-F]{6}$/.test(r.trim()),ou=r=>`room-${String(r+1).padStart(2,"0")}`;function lu(r){return r<.9?"portrait":r<=1.15?"square":r<1.9?"landscape":"panoramic"}function tl(){return{galleryWall:tu,museumWall:tu}}function Sa(){return{verticalBand:{minY:.42,maxY:3.12},sideMargin:.14,doorwayClearance:.35}}function Oy(r){return Zo(r,.01)}function cu(r){const e=Number.isFinite(r.width)?Math.max(640,Math.min(4096,r.width)):Rn.width,t=Number.isFinite(r.height)?Math.max(360,Math.min(4096,r.height)):Rn.height;return{width:e,height:t}}function nl(r){return[it(r[0]),it(r[1]),it(r[2]),it(r[3])]}function _t(r){return Je(r.x,r.y,r.z)}function wa(r){return{origin:_t(r.origin),axisU:_t(r.axisU),axisV:_t(r.axisV),width:r.width,height:r.height}}function il(r){return{origin:_t(r.origin),axisU:_t(r.axisU),axisV:_t(r.axisV),width:r.width,height:r.height,safePolygon:Qt(r.safePolygon),doorwayExclusions:r.doorwayExclusions.map(e=>Qt(e)),hangingBand:{...r.hangingBand}}}function ls(r){return{position:_t(r.position),target:_t(r.target),verticalFovDeg:r.verticalFovDeg,near:r.near,far:r.far,lensShift:r.lensShift?it(r.lensShift):void 0}}function By(r){var t,n;const e=r.quad?nl(r.quad):[$(0,0),$(1,0),$(1,1),$(0,1)];return{id:r.id,planeAspect:r.planeAspect,quad:e,safePolygon:(n=(t=r.drawableRegion)!=null?t:r.safePolygon)!=null?n:Qt(Wo(e,.92)),shadowVector:r.shadowVector,room:r.room}}function cs(){return Iy.map(r=>{var e;return{...r,quad:r.quad?nl(r.quad):void 0,safePolygon:r.safePolygon?Qt(r.safePolygon):void 0,drawableRegion:r.drawableRegion?Qt(r.drawableRegion):void 0,exclusionPolygons:(e=r.exclusionPolygons)==null?void 0:e.map(t=>Qt(t)),transform:r.transform?wa(r.transform):void 0,hangingBand:r.hangingBand?{...r.hangingBand}:void 0,shadowVector:r.shadowVector?it(r.shadowVector):void 0,room:r.room?il(r.room):void 0}})}function du(r){const e=[];for(const n of r){const i=n.transform;i&&e.push(_t(i.origin))}const t=[...r].reverse().find(n=>n.transform);return t!=null&&t.transform&&e.push(Je(t.transform.origin.x+t.transform.axisU.x*t.transform.width,t.transform.origin.y+t.transform.axisU.y*t.transform.width,t.transform.origin.z+t.transform.axisU.z*t.transform.width)),e.length>=3?e:[Je(-3.5,0,-2.5),Je(3.5,0,-2.5),Je(3.5,0,4.5),Je(-3.5,0,4.5)]}function uu(r,e){const t=r.flatMap(o=>{const l=o.transform;return l?[l.origin,Je(l.origin.x+l.axisU.x*l.width,l.origin.y+l.axisU.y*l.width+l.axisV.y*l.height,l.origin.z+l.axisU.z*l.width+l.axisV.z*l.height)]:[]}),n=[...e,...t],i=n.map(o=>o.x),s=n.map(o=>o.y),a=n.map(o=>o.z);return{min:Je(Math.min(...i),Math.min(...s),Math.min(...a)),max:Je(Math.max(...i),Math.max(...s),Math.max(...a))}}function Ma(r){const e=du(r),t=uu(r,e);return{floorOutline:e,bounds:t,floorY:t.min.y,ceilingY:t.max.y,wallThickness:.08}}function Ea(r){return el.map(e=>({id:`${ou(r)}.${e.suffix}`,enabled:!0,selectable:!0,placement:{wallId:e.wallId,center:it(e.placement.center),mountedHeight:e.placement.mountedHeight,anchor:e.placement.anchor?it(e.placement.anchor):void 0,uv:e.placement.uv?it(e.placement.uv):void 0,horizontalPosition:e.placement.horizontalPosition,centerHeight:e.placement.centerHeight,physicalHeight:e.placement.physicalHeight,mountingGap:e.placement.mountingGap,targetSizePolicy:e.placement.targetSizePolicy,minScale:e.placement.minScale,maxScale:e.placement.maxScale,zOffset:e.placement.zOffset,provisional:!1}}))}function Ta(r){return r.dimensions.height>0?r.dimensions.width/r.dimensions.height:1}function rl(r,e){return r.horizontalPosition!==void 0&&r.centerHeight!==void 0&&(e!=null&&e.room)?$(at(r.horizontalPosition),at(r.centerHeight/Math.max(.001,e.room.height))):r.uv?it(r.uv):r.anchor&&(e!=null&&e.room)?$(at(r.anchor.x/Math.max(.001,e.room.width)),at(r.anchor.y/Math.max(.001,e.room.height))):$(at(r.center.x),at(1-r.center.y))}function zy(r,e){if(r.horizontalPosition!==void 0&&r.centerHeight!==void 0&&(e!=null&&e.room))return $(at(r.horizontalPosition)*e.room.width,r.centerHeight);if(r.anchor)return it(r.anchor);const t=rl(r,e);if(!(!t||!(e!=null&&e.room)))return $(t.x*e.room.width,t.y*e.room.height)}function Hy(r){const e=r.reduce((t,n)=>$(t.x+n.x,t.y+n.y),$(0,0));return $(e.x/Math.max(1,r.length),e.y/Math.max(1,r.length))}function Gy(r,e){if(!e||!r.room||r.group!=="left"&&r.group!=="right")return!0;const t=r.room.doorwayExclusions[0];if(!t)return!0;const n=e.localQuad.map(c=>c.x),i=t.map(c=>c.x),s=Math.min(...n),a=Math.max(...n),o=Math.min(...i),l=Math.max(...i);return r.group==="left"?s-l>=ru-1e-6&&r.room.width-a>=su-1e-6:s>=su-1e-6&&o-a>=ru-1e-6}function Vy(r,e,t,n){if(r.room&&e.anchor){const S=eu(r.room,e.anchor,e.mountedHeight,t);return{center:e.center,anchor:S.anchor,mountedHeight:S.mountedHeight,adjusted:Math.abs(S.anchor.x-e.anchor.x)>1e-6||Math.abs(S.anchor.y-e.anchor.y)>1e-6||Math.abs(S.mountedHeight-e.mountedHeight)>1e-6}}const i=Math.max(.25,t),s=Math.max(.25,r.planeAspect);let a=$(at(e.center.x),at(e.center.y)),o=Math.max(.04,Math.min(.9,e.mountedHeight)),l=a.x!==e.center.x||a.y!==e.center.y||o!==e.mountedHeight;const c=Math.max(.04,Math.min(.9,s/i));o>c&&(o=c,l=!0);const d=()=>{const y=o*i/s/2,b=o/2,U=Math.max(0,y),P=Math.min(1,1-y),E=Math.max(0,b),L=Math.min(1,1-b),M=Math.max(U,Math.min(P,a.x)),_=Math.max(E,Math.min(L,a.y));(M!==a.x||_!==a.y)&&(l=!0),a=$(M,_)};d();const u=()=>Ci(r,{wallId:e.wallId,center:a,mountedHeight:o},i,n),h=S=>S?S.projectedQuad.reduce((y,b)=>y+(ni(b,r.mountingZone)?1:0),0):-1;let f=h(u()),g=a,v=o;if(f===4)return{center:g,mountedHeight:v,adjusted:l};const m=(()=>{const S=pa(r,Hy(r.mountingZone));return S?$(at(S.x),at(S.y)):$(.5,.5)})();for(let S=0;S<36;S+=1){a=$(at(a.x+(m.x-a.x)*.22),at(a.y+(m.y-a.y)*.22)),o=Math.max(.04,Math.min(c,o*.985)),d();const y=u(),b=h(y);if(b>f&&(f=b,g=a,v=o),f===4)break}const p=Math.abs(g.x-e.center.x)>1e-6||Math.abs(g.y-e.center.y)>1e-6||Math.abs(v-e.mountedHeight)>1e-6;return{center:g,mountedHeight:v,adjusted:l||p}}function Pi(r,e=!1){if(!r||typeof r!="object")return null;const t=r,n=typeof t.x=="number"&&Number.isFinite(t.x)?t.x:NaN,i=typeof t.y=="number"&&Number.isFinite(t.y)?t.y:NaN;return Number.isNaN(n)||Number.isNaN(i)?null:e?$(at(n),at(i)):$(n,i)}function si(r){if(!r||typeof r!="object")return null;const e=r,t=e.x,n=e.y,i=e.z;return typeof t!="number"||typeof n!="number"||typeof i!="number"||!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(i)?null:Je(t,n,i)}function hu(r,e){if(!r||typeof r!="object")return null;const t=r,n=t.minY,i=t.maxY,s=t.margin;return typeof n!="number"||typeof i!="number"||typeof s!="number"||!Number.isFinite(n)||!Number.isFinite(i)||!Number.isFinite(s)||n<0||i>e||i-n<=.2||s<0||s*2>=i-n?null:{minY:n,maxY:i,margin:s}}function sl(r){var d;if(!r||typeof r!="object")return null;const e=r,t=si(e.origin),n=si(e.axisU),i=(d=si(e.axisV))!=null?d:Je(0,1,0),s=e.width,a=e.height;if(!t||!n||!i||typeof s!="number"||typeof a!="number"||!Number.isFinite(s)||!Number.isFinite(a)||s<=.25||a<=.25)return null;const o=Math.hypot(n.x,n.y,n.z),l=Math.hypot(i.x,i.y,i.z),c=n.x*i.x+n.y*i.y+n.z*i.z;return o<.92||o>1.08||l<.92||l>1.08||Math.abs(c)>.08?null:{origin:t,axisU:n,axisV:i,width:s,height:a}}function fu(r){if(!r||typeof r!="object")return null;const e=r,t=e.verticalBand&&typeof e.verticalBand=="object"?e.verticalBand:null,n=t&&typeof t.minY=="number"&&Number.isFinite(t.minY)&&typeof t.maxY=="number"&&Number.isFinite(t.maxY)&&t.maxY>t.minY?{minY:t.minY,maxY:t.maxY}:void 0,i=typeof e.sideMargin=="number"&&Number.isFinite(e.sideMargin)?Math.max(0,e.sideMargin):void 0,s=typeof e.doorwayClearance=="number"&&Number.isFinite(e.doorwayClearance)?Math.max(0,e.doorwayClearance):void 0;return!n&&i===void 0&&s===void 0?null:{verticalBand:n,sideMargin:i,doorwayClearance:s}}function pu(r){if(!r||typeof r!="object")return null;const e=r,t=Array.isArray(e.floorOutline)?e.floorOutline.map(c=>si(c)).filter(c=>c!==null):[],n=e.bounds&&typeof e.bounds=="object"?e.bounds:null,i=n?si(n.min):null,s=n?si(n.max):null,a=typeof e.floorY=="number"&&Number.isFinite(e.floorY)?e.floorY:void 0,o=typeof e.ceilingY=="number"&&Number.isFinite(e.ceilingY)?e.ceilingY:void 0,l=typeof e.wallThickness=="number"&&Number.isFinite(e.wallThickness)?Math.max(.01,e.wallThickness):void 0;return t.length===0&&(!i||!s)&&a===void 0&&o===void 0&&l===void 0?null:{floorOutline:t.length>=3?t:void 0,bounds:i&&s?{min:i,max:s}:void 0,floorY:a,ceilingY:o,wallThickness:l}}function Wy(r){if(!r||typeof r!="object")return null;const e=r,t=sl(r);if(!t)return null;const n=Ii(e.safePolygon),s=(Array.isArray(e.doorwayExclusions)?e.doorwayExclusions:[]).map(l=>Ii(l)).filter(l=>l!==null),a=hu(e.hangingBand,t.height);if(!n||!a)return null;const o=l=>l.x>=0&&l.x<=t.width&&l.y>=0&&l.y<=t.height;return!n.every(o)||s.some(l=>!l.every(o))?null:{origin:t.origin,axisU:t.axisU,axisV:t.axisV,width:t.width,height:t.height,safePolygon:n,doorwayExclusions:s,hangingBand:a}}function mu(r){if(!r||typeof r!="object")return null;const e=r,t=si(e.position),n=si(e.target),i=e.verticalFovDeg,s=e.near,a=typeof e.far=="number"&&Number.isFinite(e.far)?e.far:40,o=Pi(e.lensShift);return!t||!n||typeof i!="number"||typeof s!="number"||!Number.isFinite(i)||!Number.isFinite(s)||!Number.isFinite(a)||i<15||i>100||s<=0||a<=s||Math.hypot(t.x-n.x,t.y-n.y,t.z-n.z)<.1?null:{position:t,target:n,verticalFovDeg:i,near:s,far:a,lensShift:o!=null?o:void 0}}function Xy(r){if(!Array.isArray(r)||r.length!==4)return null;const e=r.map(t=>Pi(t));return e.some(t=>t===null)?null:[e[0],e[1],e[2],e[3]]}function Ii(r){if(!Array.isArray(r)||r.length<3)return null;const e=r.map(t=>Pi(t));return e.some(t=>t===null)?null:e}function $y(r){const e=Pi(r);return e!=null?e:void 0}function Yy(r){if(!r||typeof r!="object")return{...Rn};const e=r;return cu({width:typeof e.width=="number"?e.width:Rn.width,height:typeof e.height=="number"?e.height:Rn.height})}function qy(r){return r==="right"||r==="front"||r==="rear"?r:"left"}function Zy(r,e){var m,p,S,y,b,U,P;if(!r||typeof r!="object")return null;const t=r,n=typeof t.id=="string"?t.id.trim():"",i=qy(t.group),s=t.role==="bounds-only"?"bounds-only":"rendered",a=typeof t.planeAspect=="number"&&Number.isFinite(t.planeAspect)?Math.max(.25,Math.min(8,t.planeAspect)):NaN;if(s==="bounds-only"){const E=sl(t.transform);return!n||!E?(e.push(`wall "${n||"?"}" ignored: bounds-only walls require an id and a valid transform.`),null):{id:n,group:i,role:s,planeAspect:Number.isNaN(a)?Math.max(.25,Math.min(8,E.width/Math.max(.001,E.height))):a,transform:wa(E)}}const o=Xy(t.quad);if(!n||Number.isNaN(a)||!o)return e.push(`wall "${n||"?"}" ignored: requires id, planeAspect, and a four-corner quad.`),null;if(_r(o)||!Ei(o))return e.push(`wall "${n}" ignored: quad must be convex and non-degenerate.`),null;const l=(m=Ii(t.safePolygon))!=null?m:Qt(Wo(o,.92)),c=(p=Ii(t.mountingZone))!=null?p:Qt(l),d=(y=(S=Ii(t.drawableRegion))!=null?S:Ii(t.safePolygon))!=null?y:void 0,u=Array.isArray(t.exclusionPolygons)?t.exclusionPolygons.map(E=>Ii(E)).filter(E=>E!==null):void 0,h=sl(t.transform),f=h?hu(t.hangingBand,h.height):null,g=Wy(t.room);let v=g!=null?g:void 0;return t.room!==void 0&&!g&&t.transform===void 0&&e.push(`wall "${n}": v3 room plane is invalid; using the calibrated default plane when available.`),t.transform!==void 0&&!h&&e.push(`wall "${n}": transform is invalid; falling back to the legacy room plane when available.`),h&&(v={origin:_t(h.origin),axisU:_t(h.axisU),axisV:_t(h.axisV),width:h.width,height:h.height,safePolygon:(b=d!=null?d:g==null?void 0:g.safePolygon)!=null?b:[$(.14,.14),$(h.width-.14,.14),$(h.width-.14,h.height-.14),$(.14,h.height-.14)],doorwayExclusions:(U=u!=null?u:g==null?void 0:g.doorwayExclusions)!=null?U:[],hangingBand:(P=f!=null?f:g==null?void 0:g.hangingBand)!=null?P:{minY:.42,maxY:h.height-.28,margin:.08}}),Od(o)||e.push(`wall "${n}": quad was normalized to clockwise winding.`),Math.abs(ss(l))<=1e-6&&e.push(`wall "${n}": safePolygon is degenerate; using a derived inset polygon.`),{id:n,group:i,role:"rendered",planeAspect:a,quad:o,safePolygon:l,mountingZone:c,mountingZoneConfirmed:t.mountingZoneConfirmed===!0,drawableRegion:d?Qt(d):void 0,exclusionPolygons:u==null?void 0:u.map(E=>Qt(E)),transform:h?wa(h):v?{origin:_t(v.origin),axisU:_t(v.axisU),axisV:_t(v.axisV),width:v.width,height:v.height}:void 0,hangingBand:f!=null?f:v==null?void 0:v.hangingBand,shadowVector:$y(t.shadowVector),room:v!=null?v:void 0}}function Ky(r){var m,p;if(!r||typeof r!="object")return null;const e=r,t=typeof e.wallId=="string"?e.wallId.trim():"",n=typeof e.horizontalPosition=="number"&&Number.isFinite(e.horizontalPosition)?at(e.horizontalPosition):void 0,i=typeof e.centerHeight=="number"&&Number.isFinite(e.centerHeight)?Math.max(0,Math.min(8,e.centerHeight)):void 0,s=typeof e.physicalHeight=="number"&&Number.isFinite(e.physicalHeight)?Math.max(.04,Math.min(8,e.physicalHeight)):void 0,a=Pi(e.uv,!0),o=(p=(m=Pi(e.center,!0))!=null?m:a?$(at(a.x),at(1-a.y)):null)!=null?p:n!==void 0&&i!==void 0?$(n,1-at(i/Jt)):null,l=Pi(e.anchor),c=l||a?8:.9,d=typeof e.mountedHeight=="number"&&Number.isFinite(e.mountedHeight)?Math.max(.04,Math.min(c,e.mountedHeight)):s!=null?s:NaN,u=e.targetSizePolicy==="fixed-height"||s!==void 0?"fixed-height":"contain",h=typeof e.minScale=="number"&&Number.isFinite(e.minScale)?Math.max(.4,Math.min(1,e.minScale)):.7,f=typeof e.maxScale=="number"&&Number.isFinite(e.maxScale)?Math.max(1,Math.min(2.5,e.maxScale)):1,g=typeof e.zOffset=="number"&&Number.isFinite(e.zOffset)?Math.max(.001,Math.min(.12,e.zOffset)):.02,v=typeof e.mountingGap=="number"&&Number.isFinite(e.mountingGap)?Math.max(.001,Math.min(.03,e.mountingGap)):xa;return!t||!o||Number.isNaN(d)?null:{wallId:t,horizontalPosition:n,centerHeight:i,physicalHeight:s!=null?s:d,mountingGap:v,center:o,mountedHeight:d,anchor:l!=null?l:void 0,uv:a!=null?a:void 0,targetSizePolicy:u,minScale:h,maxScale:f,zOffset:g,provisional:e.provisional===!0}}function jy(r){if(!r||typeof r!="object")return null;const e=r,t=typeof e.cx=="number"&&Number.isFinite(e.cx)?at(e.cx):NaN,n=typeof e.cy=="number"&&Number.isFinite(e.cy)?at(e.cy):NaN,i=typeof e.maxW=="number"&&Number.isFinite(e.maxW)?at(e.maxW):NaN,s=typeof e.maxH=="number"&&Number.isFinite(e.maxH)?at(e.maxH):NaN,a=typeof e.rotateYDeg=="number"&&Number.isFinite(e.rotateYDeg)?Math.max(-45,Math.min(45,e.rotateYDeg)):0;return[t,n,i,s].some(Number.isNaN)||i<=0||s<=0?null:{cx:t,cy:n,maxW:i,maxH:s,rotateYDeg:a}}function gu(r,e,t,n){var p,S,y;const i=e.replace(/^room-\d+\./,""),s=Ny.get(i);let a=s!=null?s:"";a||(a=r.cx<.33?"wall-left":r.cx<.67?"wall-front":"wall-right");const o=t.filter(b=>b.role!=="bounds-only"),l=(S=(p=o.find(b=>b.id===a))!=null?p:o[0])!=null?S:t[0],c=By(l),d=$(r.cx*n.width,r.cy*n.height),u=(y=pa(c,d))!=null?y:$(.5,.5),h=$(d.x,d.y-r.maxH*n.height/2),f=$(d.x,d.y+r.maxH*n.height/2),g=pa(c,h),v=pa(c,f),m=g&&v?Math.abs(v.y-g.y):Math.max(.08,r.maxH*1.35);return{wallId:l.id,center:$(at(u.x),at(u.y)),mountedHeight:Math.max(.06,Math.min(.9,m)),provisional:!0}}function al(r){const e=r&&typeof r=="object"?r:{},t=typeof e.selectionTimeoutMs=="number"&&Number.isFinite(e.selectionTimeoutMs)?Math.max(250,Math.min(1e4,e.selectionTimeoutMs)):Py;return{requireAllMapped:e.requireAllMapped!==!1,autoPlaceUnmapped:e.autoPlaceUnmapped!==!1,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:t,selectionTimeout:"open-exact-target-procedural"}}function ds(r){var E,L,M;const e=[];if(r==null)return{config:null,warnings:e,source:"built-in-default"};if(typeof r!="object"||Array.isArray(r))return e.push("museum-hub config ignored: expected a JSON object."),{config:null,warnings:e,source:"built-in-default"};const t=r,n=tl(),i=t.visualTokens&&typeof t.visualTokens=="object"?t.visualTokens:{};i.galleryWall!==void 0&&(au(i.galleryWall)?n.galleryWall=i.galleryWall.trim():e.push("visualTokens.galleryWall is not a valid #RRGGBB color; using default.")),i.museumWall!==void 0&&(au(i.museumWall)?i.museumWall.trim().toUpperCase()!==n.galleryWall.toUpperCase()&&e.push("visualTokens.museumWall differs from galleryWall; the authoritative gallery wall token is used everywhere."):e.push("visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.")),n.museumWall=n.galleryWall;const s=Yy(t.stage);let a=Qo,o=Er,l=Er;if(t.background&&typeof t.background=="object"){const _=t.background;typeof _.aspect=="number"&&Number.isFinite(_.aspect)&&_.aspect>.5&&_.aspect<4&&(a=_.aspect),typeof _.src=="string"&&_.src.trim()&&(o=_.src.trim())}if(t.backgroundFallback&&typeof t.backgroundFallback=="object"){const _=t.backgroundFallback;typeof _.src=="string"&&_.src.trim()&&(l=_.src.trim())}jo(o)&&e.push(`museum-hub background "${o}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds will fall back at runtime.`),jo(l)&&e.push(`museum-hub background fallback "${l}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds may continue on the neutral wall token.`);const c=(E=mu(t.camera))!=null?E:ls(va);t.camera!==void 0&&!mu(t.camera)&&e.push("museum-hub camera is invalid; using built-in calibrated camera.");const d=(L=fu(t.hangingRules))!=null?L:Sa();t.hangingRules!==void 0&&!fu(t.hangingRules)&&e.push("museum-hub hangingRules are invalid; using built-in doorway/band defaults.");const u=al(t.fallbacks),h=typeof t.slotsPerPage=="number"&&Number.isFinite(t.slotsPerPage)?Math.max(1,Math.min(Cn,Math.round(t.slotsPerPage))):Cn;t.slotsPerPage!==void 0&&h!==t.slotsPerPage&&e.push(`museum-hub slotsPerPage was clamped to ${h} (this room supports at most ${Cn} artworks).`);const f=Array.isArray(t.slots)?t.slots:[];if(f.length===0)return e.push("museum-hub config ignored: expected a non-empty slots array."),{config:null,warnings:e,source:"built-in-default"};const g=Array.isArray(t.walls)?t.walls:[],v=g.map(_=>Zy(_,e)).filter(_=>_!==null),m=new Map(cs().map(_=>[_.id,_])),p=(v.length>0?v:cs()).map(_=>{var B;if(_.room||_.role==="bounds-only")return _;const I=(B=m.get(_.id))==null?void 0:B.room;return I?(e.push(`wall "${_.id}": missing v3 room plane; using built-in calibrated room plane.`),{..._,room:il(I)}):_});g.length>0&&v.length===0&&e.push("museum-hub walls were invalid; using built-in calibrated wall planes.");const S=(M=pu(t.room))!=null?M:Ma(p);t.room!==void 0&&!pu(t.room)&&e.push("museum-hub room is invalid; deriving floor/ceiling layout from wall transforms.");const y=typeof t.version=="number"?t.version:1,b=new Set,U=[];let P="injected";for(const _ of f){if(!_||typeof _!="object"){e.push("slot ignored: not an object.");continue}const I=_,B=typeof I.id=="string"?I.id.trim():"";if(!B){e.push("slot ignored: missing id.");continue}if(b.has(B)){e.push(`slot "${B}" ignored: duplicate slot ID.`);continue}b.add(B);const F=typeof I.artworkId=="string"&&I.artworkId.trim()?I.artworkId.trim():void 0,N=I.placement,Y=Ky(N);let X=null;if(Y)X=Y;else{const Q=jy(N);Q&&(X=gu(Q,B,p,s),P=y>=2?"injected":"v1-migrated")}if(!X){e.push(`slot "${B}" ignored: requires a valid v2 placement or migratable v1 placement.`);continue}U.push({id:B,enabled:I.enabled!==!1,selectable:I.selectable!==!1,...F?{artworkId:F}:{},placement:X})}return U.length===0?{config:null,warnings:e,source:"built-in-default"}:(P==="v1-migrated"&&e.push("Version-1 museum-hub slots were migrated to the wall-plane v2 model. Review calibration output and re-save customer-artworks/museum-hub.json."),{config:{version:Math.max(5,y),coverage:"all-active-artworks",stage:s,background:{src:o,aspect:a},backgroundFallback:{src:l},visualTokens:n,camera:c,room:S,hangingRules:d,walls:p,fallbacks:u,slotsPerPage:h,slots:U},warnings:e,source:P})}function Qy(r){const e=[];if(!Array.isArray(r)||r.length===0)return{config:null,warnings:e,source:"built-in-default"};e.push("Legacy hub-hotspots.json configuration migrated automatically. Please move to customer-artworks/museum-hub.json.");const t=cs(),n=[],i=new Set,s=Ea(0);let a=0;for(const o of r){if(!o||typeof o!="object"){e.push("legacy hotspot ignored: not an object.");continue}const l=o,c=typeof l.artworkId=="string"?l.artworkId.trim():"",d=typeof l.cx=="number"&&Number.isFinite(l.cx)?at(l.cx):NaN,u=typeof l.cy=="number"&&Number.isFinite(l.cy)?at(l.cy):NaN,h=typeof l.w=="number"&&Number.isFinite(l.w)?at(l.w):NaN,f=typeof l.h=="number"&&Number.isFinite(l.h)?at(l.h):NaN;if(!c||/^@order:/.test(c)||[d,u,h,f].some(Number.isNaN)){e.push(`legacy hotspot "${c||"?"}" could not be migrated.`);continue}const g=s.find(p=>!i.has(p.id)&&Math.abs(p.placement.center.x-d)<.12&&Math.abs(p.placement.center.y-u)<.12),v=g?g.id:`${ou(0)}.legacy-${a+=1}`;if(i.has(v))continue;i.add(v);const m=gu({cx:d,cy:u,maxH:f},v,t,Rn);n.push({id:v,enabled:!0,selectable:!0,artworkId:c,placement:m})}return n.length===0?{config:null,warnings:e,source:"built-in-default"}:{config:{version:5,coverage:"all-active-artworks",stage:{...Rn},background:{src:Er,aspect:Qo},backgroundFallback:{src:Er},visualTokens:tl(),camera:ls(va),room:Ma(t),hangingRules:Sa(),walls:t,fallbacks:al(void 0),slotsPerPage:Cn,slots:n},warnings:e,source:"legacy-migrated"}}function Jy(r,e,t){var D,ft,Ze,Ie,Ee,pt,De,Be,k,w,Z,ie,se,ne,Re,fe,Se,Xe,le,xe,$e,Ne,we,ze,Ye;let n=ds(e);if(!n.config){const C=Qy(t);C.config&&(n={...C,warnings:[...n.warnings,...C.warnings]})}const i=[...n.warnings];let s=n.config?n.source:"built-in-default",a;n.config?a=n.config:(a={version:5,coverage:"all-active-artworks",stage:{...Rn},background:{src:Er,aspect:Qo},backgroundFallback:{src:Er},visualTokens:tl(),camera:ls(va),room:Ma(cs()),hangingRules:Sa(),walls:cs(),fallbacks:al(void 0),slotsPerPage:Cn,slots:Ea(0).map(C=>{const A=Fy[C.id];return A!==void 0&&r.some(z=>z.id===A)?{...C,artworkId:A}:C})},s="built-in-default");const o=cu(a.stage),l=a.visualTokens,c=a.background,d=a.backgroundFallback,u=a.camera?ls(a.camera):ls(va),h=(D=a.room)!=null?D:Ma(a.walls),f=(ft=a.hangingRules)!=null?ft:Sa(),g=a.fallbacks.selectionTimeoutMs,v=a.fallbacks.autoPlaceUnmapped,m=(Ze=a.slotsPerPage)!=null?Ze:Cn,p=[];for(const C of a.walls){if(C.role==="bounds-only")continue;if(!C.quad){i.push(`wall "${C.id}" is missing a reference quad and will be ignored.`);continue}const A=nl(C.quad),O=C.safePolygon?Qt(C.safePolygon):Qt(Wo(A,.92));let z=C.room?il(C.room):void 0,H=null,ee=null,ae={x:1,y:1},ue;const Ce=Oy(A);if(z){const ht=Ey(z,A,O,u,o,Ce);if(ht){if(z=ht.room,H=ht.projectedQuad,ee=ht.projectedSafePolygon,ae={x:ht.scaleX,y:ht.scaleY},ue=ht.realism,C.transform&&z.width>1e-6){const Gt=C.transform.width/z.width;Number.isFinite(Gt)&&Gt>0&&(z=ex(z,u.position,Gt),ae={x:ht.scaleX*Gt,y:ht.scaleY*Gt})}}else i.push(`wall "${C.id}": room plane could not be reconciled to the reference quad; using the stored room transform.`),H=Yo(z,u,o),ee=qo(z,u,z.safePolygon,o),H&&(ue=Qd(z,H,A,ee,O,Ce));ue&&!ue.passes&&i.push(`wall "${C.id}": projection realism failed (max residual ${ue.referenceResidualMaxPx.toFixed(1)}px, axis dot ${ue.axisDot.toFixed(3)}, convergence ${ue.projectedConvergence}).`)}const qe=A,Fe=O,tt=Sr(qe),gt=tt?fa(tt):null;if(!tt||!gt){i.push(`wall "${C.id}" could not build a homography and will be ignored.`);continue}const Pt=C.transform?wa(C.transform):z?{origin:_t(z.origin),axisU:_t(z.axisU),axisV:_t(z.axisV),width:z.width,height:z.height}:null;if(!Pt){i.push(`wall "${C.id}" is missing a room transform and will be ignored.`);continue}p.push({id:C.id,group:C.group,transform:Pt,planeAspect:C.planeAspect,quad:qe,safePolygon:Fe,mountingZone:C.mountingZone?Qt(C.mountingZone):Qt(Fe),mountingZoneConfirmed:C.mountingZoneConfirmed===!0,shadowVector:C.shadowVector?it(C.shadowVector):void 0,room:z,camera:z?u:void 0,referenceQuad:A,referenceSafePolygon:O,projectedQuad:H,projectedSafePolygon:ee,localCalibrationScale:ae,projectionRealism:ue,expectedConvergence:Ce,homography:tt,inverseHomography:gt})}const S=new Map(p.map(C=>[C.id,C]));tx(a,i);const y=(Ee=(Ie=h.floorOutline)==null?void 0:Ie.map(C=>_t(C)))!=null?Ee:du(a.walls),b=h.bounds?{min:_t(h.bounds.min),max:_t(h.bounds.max)}:uu(a.walls,y),U={floorOutline:y,bounds:b,dimensions:{width:Math.max(.01,b.max.x-b.min.x),height:Math.max(.01,((pt=h.ceilingY)!=null?pt:b.max.y)-((De=h.floorY)!=null?De:b.min.y)),depth:Math.max(.01,b.max.z-b.min.z)},floorY:(Be=h.floorY)!=null?Be:b.min.y,ceilingY:(k=h.ceilingY)!=null?k:b.max.y,wallThickness:(w=h.wallThickness)!=null?w:.08,wallIds:p.map(C=>C.id)},P=new Map;r.forEach((C,A)=>P.set(C.id,A));const E=new Set,L=[],M=[];for(const C of a.slots){const A=Math.max(0,nx(C.id)),O=S.get(C.placement.wallId),z=(Z=O==null?void 0:O.group)!=null?Z:ol(C.placement.wallId),H=(ie=O==null?void 0:O.localCalibrationScale)!=null?ie:{x:1,y:1},ee=C.placement.horizontalPosition!==void 0&&C.placement.centerHeight!==void 0&&C.placement.physicalHeight!==void 0,ae=rl(C.placement,O);O!=null&&O.room&&!C.placement.anchor&&(C.placement.horizontalPosition===void 0||C.placement.centerHeight===void 0)&&i.push(`slot "${C.id}": room-local anchor missing; deriving it from the normalized center for calibrated placement.`);const ue=(()=>{const qe=zy(C.placement,O);return qe?ee?qe:$(qe.x*H.x,qe.y*H.y):ae&&(O!=null&&O.room)?$(ae.x*O.room.width,ae.y*O.room.height):O!=null&&O.room?$(C.placement.center.x*O.room.width,(1-C.placement.center.y)*O.room.height):void 0})(),Ce={id:C.id,pageIndex:A,placement:{wallId:C.placement.wallId,center:ae?$(ae.x,1-ae.y):it(C.placement.center),mountedHeight:ee?C.placement.physicalHeight:O!=null&&O.room?C.placement.mountedHeight*H.y:C.placement.mountedHeight,anchor:ue?it(ue):void 0,uv:ae?it(ae):void 0,horizontalPosition:ue&&(O!=null&&O.room)?at(ue.x/Math.max(.001,O.room.width)):ae==null?void 0:ae.x,centerHeight:ue==null?void 0:ue.y,physicalHeight:ee?C.placement.physicalHeight:O!=null&&O.room?C.placement.mountedHeight*H.y:C.placement.mountedHeight,mountingGap:(se=C.placement.mountingGap)!=null?se:xa,targetSizePolicy:(ne=C.placement.targetSizePolicy)!=null?ne:"contain",minScale:(Re=C.placement.minScale)!=null?Re:.7,maxScale:(fe=C.placement.maxScale)!=null?fe:1,zOffset:(Se=C.placement.zOffset)!=null?Se:.02,provisional:C.placement.provisional===!0},wallGroup:z};if(!C.enabled){L.push({...Ce,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"explicitly-disabled",mappingSource:"explicit",artworkAspect:1});continue}if(!O){i.push(`slot "${C.id}" references unknown wall "${C.placement.wallId}"; slot disabled.`),L.push({...Ce,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"missing-wall",mappingSource:"explicit",artworkAspect:1});continue}if(C.artworkId){const qe=P.get(C.artworkId);if(qe===void 0){i.push(`slot "${C.id}": artwork ID "${C.artworkId}" not in the active manifest; slot disabled.`),L.push({...Ce,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"invalid-mapping",mappingSource:"explicit",artworkAspect:1});continue}if(E.has(C.artworkId)){i.push(`slot "${C.id}": artwork "${C.artworkId}" is already mapped; duplicate slot disabled.`),L.push({...Ce,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"duplicate-mapping",mappingSource:"explicit",artworkAspect:1});continue}E.add(C.artworkId);const Fe=r[qe];L.push({...Ce,artworkId:C.artworkId,artworkIndex:qe,displayLabel:Fe.title,selectable:C.selectable,disabledReason:C.selectable?null:"explicitly-disabled",mappingSource:"explicit",artworkAspect:Ta(Fe)});continue}M.push({...Ce,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:C.selectable,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1})}const _=v?r.filter(C=>!E.has(C.id)):[],I=new Map(el.map(C=>[C.suffix,C.intendedUse])),B=C=>{const A=C.id.replace(/^room-\d+\./,"");return I.get(A)},F=(C,A)=>{C.artworkId=A.id,C.artworkIndex=P.get(A.id),C.displayLabel=A.title,C.artworkAspect=Ta(A),E.add(A.id)},N=[];for(const C of _){const A=lu(Ta(C)),O=M.findIndex(z=>z.selectable&&!z.artworkId&&B(z)===A);O>=0?F(M[O],C):N.push(C)}for(const C of N){const A=M.find(O=>O.selectable&&!O.artworkId);A&&F(A,C)}for(const C of M)C.artworkId&&L.push(C);let Y=r.filter(C=>!E.has(C.id));if(v&&Y.length>0){let C=L.reduce((A,O)=>Math.max(A,O.pageIndex),0)+1;for(;Y.length>0;){const A=Ea(C).map(H=>{var ue,Ce,qe,Fe,tt,gt,Pt,ht;const ee=S.get(H.placement.wallId),ae=(ue=ee==null?void 0:ee.localCalibrationScale)!=null?ue:{x:1,y:1};return{id:H.id,pageIndex:C,placement:{wallId:H.placement.wallId,center:it(H.placement.center),mountedHeight:(Ce=H.placement.physicalHeight)!=null?Ce:ee!=null&&ee.room?H.placement.mountedHeight*ae.y:H.placement.mountedHeight,anchor:ee!=null&&ee.room&&H.placement.anchor?H.placement.horizontalPosition!==void 0&&H.placement.centerHeight!==void 0?it(H.placement.anchor):$(H.placement.anchor.x*ae.x,H.placement.anchor.y*ae.y):H.placement.anchor?it(H.placement.anchor):void 0,uv:H.placement.uv?it(H.placement.uv):void 0,horizontalPosition:H.placement.horizontalPosition,centerHeight:H.placement.centerHeight,physicalHeight:(qe=H.placement.physicalHeight)!=null?qe:ee!=null&&ee.room?H.placement.mountedHeight*ae.y:H.placement.mountedHeight,mountingGap:(Fe=H.placement.mountingGap)!=null?Fe:xa,targetSizePolicy:(tt=H.placement.targetSizePolicy)!=null?tt:"contain",minScale:(gt=H.placement.minScale)!=null?gt:.7,maxScale:(Pt=H.placement.maxScale)!=null?Pt:1,zOffset:(ht=H.placement.zOffset)!=null?ht:.02,provisional:!1},artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!0,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1,wallGroup:ol(H.placement.wallId)}}),O=Y.slice(0,Math.min(m,A.length)),z=new Set;for(const H of O){const ee=lu(Ta(H)),ae=A.find(Ce=>!Ce.artworkId&&B(Ce)===ee&&!z.has(Ce.id)),ue=ae!=null?ae:A.find(Ce=>!Ce.artworkId);z.add(ue.id),F(ue,H)}L.push(...A.filter(H=>H.artworkId)),Y=r.filter(H=>!E.has(H.id)),C+=1}}let X=L.reduce((C,A)=>Math.max(C,A.pageIndex),0)+1;const Q=new Map;for(const C of L){const A=(Xe=Q.get(C.pageIndex))!=null?Xe:[];A.push(C),Q.set(C.pageIndex,A)}for(const[C,A]of Q)if(!(A.length<=Cn)){for(let O=0;O<A.length;O+=Cn){const z=O===0?C:X++,H=Ea(z);for(const[ee,ae]of A.slice(O,O+Cn).entries()){const ue=H[ee];ae.pageIndex=z,ae.placement={...ue.placement,center:it(ue.placement.center),anchor:ue.placement.anchor?it(ue.placement.anchor):void 0,uv:ue.placement.uv?it(ue.placement.uv):void 0},ae.wallGroup=ol(ue.placement.wallId)}}i.push(`museum-hub page ${C+1} exceeded ${Cn} artworks; overflow was moved to additional rooms.`)}for(const C of L){if(!C.selectable||!C.artworkId)continue;const A=S.get(C.placement.wallId);if(!A)continue;const O=Vy(A,C.placement,C.artworkAspect,o);O.adjusted&&(C.placement.center=O.center,O.anchor&&(C.placement.anchor=O.anchor),O.anchor&&(A!=null&&A.room)&&(C.placement.uv=$(at(O.anchor.x/Math.max(.001,A.room.width)),at(O.anchor.y/Math.max(.001,A.room.height))),C.placement.center=$(C.placement.uv.x,1-C.placement.uv.y)),C.placement.mountedHeight=O.mountedHeight,C.placement.physicalHeight=O.mountedHeight,C.placement.horizontalPosition=(le=C.placement.uv)==null?void 0:le.x,C.placement.centerHeight=(xe=O.anchor)==null?void 0:xe.y,i.push(`slot "${C.id}": authored wall placement was adjusted to remain inside the usable mounting area.`),C.placement.provisional&&i.push(`slot "${C.id}": provisional placement was clamped to the wall drawable region.`))}const q=(C,A)=>{var Fe,tt,gt,Pt,ht,Gt,st,$n;const O=(tt=(Fe=C.placement.uv)!=null?Fe:rl(C.placement,A))!=null?tt:$(C.placement.center.x,1-C.placement.center.y),z=S.get(C.placement.wallId),H=O,ee=(Gt=(ht=(gt=z==null?void 0:z.room)==null?void 0:gt.height)!=null?ht:(Pt=A.room)==null?void 0:Pt.height)!=null?Gt:1,ae=($n=(st=A.room)==null?void 0:st.height)!=null?$n:ee,ue=C.placement.mountedHeight/Math.max(.001,ee),Ce={wallId:A.id,center:$(H.x,1-H.y),anchor:A.room?$(H.x*A.room.width,H.y*A.room.height):void 0,uv:it(H),mountedHeight:A.room?A.id===(z==null?void 0:z.id)?C.placement.mountedHeight:Math.max(.04,ue*ae):C.placement.mountedHeight,targetSizePolicy:C.placement.targetSizePolicy,minScale:C.placement.minScale,maxScale:C.placement.maxScale,zOffset:C.placement.zOffset,horizontalPosition:H.x,centerHeight:A.room?H.y*A.room.height:void 0,physicalHeight:A.room?A.id===(z==null?void 0:z.id)?C.placement.physicalHeight:ue*A.room.height:C.placement.physicalHeight,mountingGap:C.placement.mountingGap,provisional:C.placement.provisional},qe=Ci(A,Ce,C.artworkAspect,o);if(qe!=null&&qe.placement&&A.room){const sn=qe.placement,hn=Math.abs(sn.mountedHeight-Ce.mountedHeight)<1e-9?Ce.mountedHeight:sn.mountedHeight;Ce.anchor=it(sn.anchor),Ce.mountedHeight=hn,Ce.physicalHeight=hn,Ce.uv=$(at(sn.anchor.x/Math.max(.001,A.room.width)),at(sn.anchor.y/Math.max(.001,A.room.height))),Ce.horizontalPosition=Ce.uv.x,Ce.centerHeight=sn.anchor.y,Ce.center=$(Ce.uv.x,1-Ce.uv.y)}return{projection:qe,placement:Ce}},re=new Map;for(const C of L){if(!C.selectable||!C.artworkId)continue;const A=S.get(C.placement.wallId);if(!A)continue;let O=null,z=null,H=null;const ee=[A];for(const ae of ee){if(ae.projectionRealism&&!ae.projectionRealism.passes)continue;const ue=q(C,ae);if(!(!ue.projection||!Gy(ae,ue.projection)||!ue.projection.projectedQuad.every(qe=>ni(qe,ae.mountingZone)))){O=ae,z=ue.placement,H=ue.projection;break}}if(re.set(C.id,H),!O||!z||!H){C.selectable=!1,C.disabledReason=A.projectionRealism&&!A.projectionRealism.passes?"projection-realism":"invalid-projection",i.push(`slot "${C.id}": projected geometry is invalid and the slot was suppressed.`);continue}O.id!==A.id?(C.placement={...z,center:it(z.center),anchor:z.anchor?it(z.anchor):void 0,uv:z.uv?it(z.uv):void 0},C.wallGroup=O.group,i.push(`slot "${C.id}": moved from "${A.id}" to fallback wall "${O.id}" after doorway/containment validation.`)):C.placement={...z,center:it(z.center),anchor:z.anchor?it(z.anchor):void 0,uv:z.uv?it(z.uv):void 0},C.placement.provisional&&i.push(`slot "${C.id}": placement was migrated provisionally and should be recalibrated.`)}let ce=L.reduce((C,A)=>Math.max(C,A.pageIndex),0)+1,ve=!0;for(;ve;){ve=!1;const C=new Map;for(const A of L){if(!A.selectable||!A.artworkId||!A.placement.anchor)continue;const O=`${A.pageIndex}:${A.placement.wallId}`,z=($e=C.get(O))!=null?$e:[];z.push(A),C.set(O,z)}for(const A of C.values()){A.sort((O,z)=>O.placement.anchor.x-z.placement.anchor.x);for(let O=0;O<A.length;O+=1){const z=A[O];for(let H=O+1;H<A.length;H+=1){const ee=A[H];if(ee.placement.anchor.x-ee.placement.mountedHeight*ee.artworkAspect*.5-z.placement.anchor.x-z.placement.mountedHeight*z.artworkAspect*.5+1e-6>=ba)continue;const ue=ee.mappingSource==="auto-placed"?ee:z.mappingSource==="auto-placed"?z:null;if(ue){ue.pageIndex=ce,ce+=1,ve=!0,i.push(`slot "${ue.id}": moved to an overflow page to preserve ${ba.toFixed(2)} m wall spacing.`);break}}if(ve)break}if(ve)break}}for(const C of L){if(!C.selectable||!C.artworkId)continue;const A=S.get(C.placement.wallId);if(!A)continue;const O=Ci(A,C.placement,C.artworkAspect,o);re.set(C.id,O),O&&O.shortEdge<ga&&i.push(`slot "${C.id}": projected short edge ${O.shortEdge.toFixed(1)}px is below the ${ga}px desktop guidance.`)}const te=new Map;for(const C of L){if(!C.selectable||!C.artworkId||!C.placement.anchor)continue;const A=`${C.pageIndex}:${C.placement.wallId}`,O=(Ne=te.get(A))!=null?Ne:[];O.push(C),te.set(A,O)}for(const C of te.values()){C.sort((A,O)=>A.placement.anchor.x-O.placement.anchor.x);for(let A=0;A<C.length;A+=1){const O=C[A];for(let z=A+1;z<C.length;z+=1){const H=C[z],ee=H.placement.anchor.x-H.placement.mountedHeight*H.artworkAspect*.5-O.placement.anchor.x-O.placement.mountedHeight*O.artworkAspect*.5;ee+1e-6<ba&&i.push(`slots "${O.id}" and "${H.id}": wall spacing ${ee.toFixed(3)} m is below the ${ba.toFixed(2)} m curator minimum.`)}}}const Ve=[...new Set(L.map(C=>C.pageIndex))].sort((C,A)=>C-A),J=new Map(Ve.map((C,A)=>[C,A]));for(const C of L)C.pageIndex=(we=J.get(C.pageIndex))!=null?we:0;const oe=new Map;for(const C of L){const A=(ze=oe.get(C.pageIndex))!=null?ze:[];A.push(C),oe.set(C.pageIndex,A)}const _e=[...oe.entries()].sort((C,A)=>C[0]-A[0]).map(([C,A])=>({pageIndex:C,slots:A}));for(const C of _e){const A=C.slots.filter(O=>O.selectable&&O.artworkId);for(let O=0;O<A.length;O+=1){const z=A[O],H=re.get(z.id);if(H)for(let ee=O+1;ee<A.length;ee+=1){const ae=A[ee],ue=re.get(ae.id);ue&&Vo(H.projectedQuad,ue.projectedQuad)&&i.push(`page ${C.pageIndex+1}: slot "${z.id}" overlaps slot "${ae.id}".`)}}}const me=new Map,Ue=new Map;for(const C of L)C.selectable&&C.artworkId&&(me.set(C.id,C.artworkId),Ue.set(C.artworkId,C.id));const ke=r.filter(C=>!Ue.has(C.id)).length;ke>0&&v&&i.push(`${ke} active artwork(s) without a selectable slot.`);const We=new Map,rt=new Map;for(const C of r)We.set(C.id,C.image),rt.set(C.id,{image:C.image,webglImage:(Ye=C.webglImage)!=null?Ye:null,dimensions:C.dimensions,...C.imageSourceContext?{imageSourceContext:C.imageSourceContext}:{}});return{pages:_e,slotToArtwork:me,artworkToSlot:Ue,artworkImageById:We,artworkSourceById:rt,background:c,backgroundFallback:d,stage:o,visualTokens:l,camera:u,room:U,hangingRules:f,configuredWalls:a.walls,walls:p,wallById:S,slotsPerPage:m,fallbacks:a.fallbacks,selectionTimeoutMs:g,source:s,warnings:i,unmappedArtworkCount:ke}}function ol(r){return r.includes("front")?"front":r.includes("rear")?"rear":r.includes("right")?"right":"left"}const Tr=.01;function ex(r,e,t){const n=i=>$(i.x*t,i.y*t);return{origin:Je(e.x+(r.origin.x-e.x)*t,e.y+(r.origin.y-e.y)*t,e.z+(r.origin.z-e.z)*t),axisU:_t(r.axisU),axisV:_t(r.axisV),width:r.width*t,height:r.height*t,safePolygon:r.safePolygon.map(n),doorwayExclusions:r.doorwayExclusions.map(i=>i.map(n)),hangingBand:{minY:r.hangingBand.minY*t,maxY:r.hangingBand.maxY*t,margin:r.hangingBand.margin*t}}}function vu(r){const e=r.map(t=>t.x);return{min:Math.min(...e),max:Math.max(...e)}}function yu(r){const e=r.map(t=>t.y);return{min:Math.min(...e),max:Math.max(...e)}}function tx(r,e){const t=r.walls.find(o=>o.role!=="bounds-only"&&o.group==="left"),n=r.walls.find(o=>o.role!=="bounds-only"&&o.group==="right");if(!(t!=null&&t.room)||!(n!=null&&n.room))return;if(Math.abs(t.room.width-n.room.width)>Tr||Math.abs(t.room.height-n.room.height)>Tr){e.push("museum-hub mirror symmetry: left/right wall dimensions differ beyond the 1 cm tolerance.");return}const i=t.room.width,s=t.room.doorwayExclusions,a=n.room.doorwayExclusions;if(s.length!==a.length)e.push(`museum-hub mirror symmetry: left wall has ${s.length} doorway(s) but right wall has ${a.length}.`);else for(const o of s){const l=vu(o),c=yu(o);if(!a.some(u=>{const h=vu(u),f=yu(u);return Math.abs(h.min-(i-l.max))<=Tr&&Math.abs(h.max-(i-l.min))<=Tr&&Math.abs(f.min-c.min)<=Tr&&Math.abs(f.max-c.max)<=Tr})){e.push("museum-hub mirror symmetry: side-wall doorways are not mirrored within the 1 cm tolerance.");break}}for(const o of r.slots){if(o.placement.wallId!==t.id)continue;const l=o.id.replace("wall-left","wall-right");if(l===o.id)continue;const c=r.slots.find(d=>d.id===l);(!c||c.placement.wallId!==n.id)&&e.push(`museum-hub mirror symmetry: slot "${o.id}" has no mirrored counterpart "${l}".`)}}function nx(r){const e=/^room-(\d+)\./.exec(r);if(!e)return 0;const t=Number.parseInt(e[1],10);return Number.isFinite(t)&&t>=1?t-1:0}async function ix(r,e){if(typeof window=="undefined"||typeof window.fetch!="function")return{ok:null,status:null,reason:"unsupported"};let t="";try{t=new URL(r,window.location.href).protocol}catch(s){return{ok:null,status:null,reason:"unsupported"}}if(t!=="http:"&&t!=="https:")return{ok:null,status:null,reason:"unsupported"};const n=typeof AbortController=="function"?new AbortController:null,i=window.setTimeout(()=>n==null?void 0:n.abort(),Math.max(250,Math.min(e,4e3)));try{const s=await window.fetch(r,{method:"HEAD",cache:"no-store",signal:n==null?void 0:n.signal});return s.status===405||s.status===501?{ok:null,status:s.status,reason:"unsupported"}:{ok:s.ok,status:s.status,reason:s.ok?"ok":"http-error"}}catch(s){return s instanceof DOMException&&s.name==="AbortError"?{ok:null,status:null,reason:"probe-timeout"}:{ok:null,status:null,reason:"network-error"}}finally{window.clearTimeout(i)}}function rx(r,e,t){return new Promise(n=>{let i=!1;const s=c=>{i||(i=!0,window.clearTimeout(l),r.removeEventListener("load",a),r.removeEventListener("error",o),n({status:c}))},a=()=>s("loaded"),o=()=>s("error"),l=window.setTimeout(()=>s("timeout"),t);r.addEventListener("load",a),r.addEventListener("error",o),r.src=e})}function xu(r){return r===null?"http-error":Ko(r)?"http-404":`http-${r}`}function bu(r,e,t,n){var i,s,a;return{assetRole:r.role,attempt:e.role,path:e.path,url:e.url,primaryPath:r.primaryPath,primaryUrl:r.primaryUrl,fallbackPath:(i=r.fallbackPath)!=null?i:null,fallbackUrl:(s=r.fallbackUrl)!=null?s:null,httpStatus:n,reason:t,referenceOnly:jo(e.path),context:(a=r.context)!=null?a:null}}function sx(r,e){var n;const t=Ry(r.primaryUrl,(n=r.fallbackUrl)!=null?n:"",e);return!t||!r.fallbackPath?null:{role:"fallback",path:r.fallbackPath,url:t}}function ax(r,e,t,n){const i=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":Ko(n)?"returned 404":`returned ${xu(n)}`;r.diagnostics.warn("hub-asset-missing",`Hub ${r.role} asset ${i}; retrying shipped fallback without aborting`,bu(r,e,t,n))}function ox(r,e,t,n){const i=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":Ko(n)?"returned 404":`returned ${xu(n)}`;r.diagnostics.warn("hub-asset-fallback-failed",e.role==="fallback"?`Hub ${r.role} asset and fallback ${i}; continuing with neutral museum-grey surface`:`Hub ${r.role} asset ${i}; continuing with neutral museum-grey surface`,bu(r,e,t,n))}async function lx(r,e){const t=await ix(e.url,r.timeoutMs);if(t.ok===!1)return{status:"failed",reason:"http-error",httpStatus:t.status};const n=await rx(r.image,e.url,r.timeoutMs);return n.status==="loaded"?{status:"loaded",httpStatus:t.status}:n.status==="timeout"?{status:"failed",reason:t.reason==="probe-timeout"?"probe-timeout":"timeout",httpStatus:t.status}:t.reason==="network-error"?{status:"failed",reason:"network-error",httpStatus:t.status}:{status:"failed",reason:"image-error",httpStatus:t.status}}async function cx(r){var i,s;let e={role:"primary",path:r.primaryPath,url:r.primaryUrl},t=!1,n=null;for(;e;){const a=await lx(r,e);if(a.status==="loaded")return{status:e.role==="primary"?"loaded":"fallback-loaded",finalPath:e.path,finalUrl:e.url,httpStatus:a.httpStatus};n=a.httpStatus;const o=sx(r,t);if(e.role==="primary"&&o){t=!0,ax(r,e,a.reason,a.httpStatus),e=o;continue}return ox(r,e,a.reason,a.httpStatus),(i=r.onNeutralFallback)==null||i.call(r),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}return(s=r.onNeutralFallback)==null||s.call(r),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}class Aa extends Ge{constructor(){const e=Aa.SkyShader,t=new Ft({name:e.name,uniforms:er.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:1,depthWrite:!1});super(new Nt(1,1,1),t),this.isSky=!0}}Aa.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new R},up:{value:new R(0,1,0)}},vertexShader:`
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

		}`};const _u=512,Ar=1.15,Su=.026,wu=.012,Mu=.34,Ca=.55,Eu=.72,Tu=.06,Au=2.7,Cu=1.55,Cr=.82,ai=.72,dx=.006,Ru=Object.freeze({hemisphere:Object.freeze({sky:15397622,ground:13091769,intensity:.14}),key:Object.freeze({color:16054262,intensity:.55,position:Object.freeze([-3.4,9.8,5.9]),target:Object.freeze([.2,1.1,-1.8])}),fill:Object.freeze({color:15265263,intensity:.16,position:Object.freeze([3.8,5.8,5.2]),target:Object.freeze([-.6,1.6,-1.6])}),ceilingPanel:Object.freeze({color:16054522,intensity:5,edgeInset:.05,ceilingOffset:.045}),skylightPanel:Object.freeze({color:15266034,intensity:3.2,edgeInset:.12,ceilingOffset:.12})}),ll=Object.freeze([0,-1,0]),In=Object.freeze({turbidity:5.6,rayleigh:1.25,mieCoefficient:.004,mieDirectionalG:.78,sunDirection:Object.freeze([-.3,.87,.39]),roofRise:ai,ribCount:9,glassRoughness:.19,glassTransmission:.72}),Ra=Object.freeze({toneMappingExposure:.92,environmentIntensity:.18,planarReflectionHigh:.16,planarReflectionBalanced:0});class ux{constructor(e,t,n){x(this,"canvas");x(this,"diagnostics",rn("hub-room"));x(this,"renderer");x(this,"rendererMode");x(this,"scene",new Hr);x(this,"camera");x(this,"cameraTarget",new R);x(this,"resolution");x(this,"pageGroups",new Map);x(this,"slotMeshes",new Map);x(this,"placeholderTextures",new Map);x(this,"surfaceFactory");x(this,"materials");x(this,"edgeGeometry",new Nt(1,1,1));x(this,"artworkPlaneGeometry",new Kt(1,1));x(this,"floorMeshes",[]);x(this,"keyLight",null);x(this,"fillLight",null);x(this,"ceilingPanelLights",[]);x(this,"sky",null);x(this,"batterySky",null);x(this,"skylightGlassMaterial",null);x(this,"skylightGlassFallback",null);x(this,"skylightGlassMeshes",[]);x(this,"environmentTarget",null);x(this,"reflectionTarget",null);x(this,"reflectionCamera",new Ht);x(this,"reflectionMatrix",new dt);x(this,"reflectionUniforms",{uReflectionMap:{value:null},uReflectionMatrix:{value:new dt},uReflectionStrength:{value:0}});x(this,"preset");x(this,"activePageIndex",0);x(this,"disposed",!1);var s;this.resolution=t,this.preset=n;const i=od({alpha:!1});this.renderer=i.renderer,this.rendererMode=i.mode,this.renderer.setPixelRatio(i.mode==="preferred"?dr(n.pixelRatioCap):1),this.renderer.setSize(t.stage.width,t.stage.height,!1),this.renderer.outputColorSpace=Ot,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=Ra.toneMappingExposure,this.renderer.shadowMap.enabled=i.mode==="preferred",this.renderer.shadowMap.type=2,this.renderer.setClearColor(new Pe(t.visualTokens.museumWall),1),this.renderer.domElement.classList.add("museum-hub__canvas"),e.appendChild(this.renderer.domElement),this.canvas=this.renderer.domElement,this.diagnostics.info("created","Hub WebGL renderer initialized",{mode:i.mode,attempts:i.attempts,context:ld(this.renderer),protocol:window.location.protocol}),this.camera=new Ht(t.camera.verticalFovDeg,t.stage.width/t.stage.height,t.camera.near,(s=t.camera.far)!=null?s:40),this.camera.position.set(t.camera.position.x,t.camera.position.y,t.camera.position.z),this.cameraTarget.set(t.camera.target.x,t.camera.target.y,t.camera.target.z),this.camera.lookAt(this.cameraTarget),this.applyLensShift(),this.surfaceFactory=new ud(n.hubSurfaceTileSize,"hub"),this.surfaceFactory.setAnisotropy(this.effectiveAnisotropy()),this.materials=this.surfaceFactory.getMaterials({wall:t.visualTokens.museumWall}),this.materials.ceiling.shadowSide=2,this.materials.trim.shadowSide=2,this.attachFloorReflectionShader(this.materials.floor),this.buildRoom(),this.buildLights(),this.applyEnvironment(),this.applyReflectionMode(),this.setActivePage(0),this.render(),this.logRenderingDiagnostics()}applyPreset(e){this.disposed||(this.preset=e,this.renderer.setPixelRatio(this.rendererMode==="preferred"?dr(e.pixelRatioCap):1),this.renderer.setSize(this.resolution.stage.width,this.resolution.stage.height,!1),this.surfaceFactory.setTileSize(e.hubSurfaceTileSize),this.applyLightingPreset(),this.applySkyPreset(),this.applyShadowPreset(),this.applyEnvironment(),this.applyReflectionMode(),this.render(),this.logRenderingDiagnostics())}setActivePage(e){this.activePageIndex=e;for(const[t,n]of this.pageGroups)n.visible=t===e;this.render()}setSlotHidden(e){const t=this.slotMeshes.get(e);t&&(t.group.visible=!1,this.render())}getMaxTextureSize(){return this.renderer.capabilities.maxTextureSize}upsertSlot(e,t,n,i,s){var S,y,b;const a=this.ensureSlotState(e);if(!a||!t.room||!e.selectable||!e.artworkId)return a&&(a.group.visible=!1),this.render(),{applied:!1,usedImage:!1};const o=e.placement.anchor;if(!o)return a.group.visible=!1,this.render(),{applied:!1,usedImage:!1};const l=!i&&n&&n.complete&&n.naturalWidth>0?n.currentSrc||n.src||`${e.id}:image`:`${e.id}:placeholder:${e.displayLabel}`;let c,d;if(a.textureKey!==l){let U;if(!i&&n&&n.complete&&n.naturalWidth>0){const P=this.imageTexture(n);U=P.texture,c=P.fit;try{this.renderer.initTexture(U)}catch(L){U!==a.artworkMesh.material.map&&U.dispose();const M=L instanceof Error?L.message:String(L);return this.diagnostics.warn("hub-slot-texture-upload-failed","Hub artwork texture failed during GPU upload",{slotId:e.id,artworkId:e.artworkId,sourceUrlType:s,fit:c,failureReason:M}),{applied:!0,usedImage:!1,fit:c,failureStage:"gpu-upload",failureReason:M}}if(No({runtimeProtocol:zn(),resolvedUrlType:s,debugEnabled:this.diagnostics.isDebugEnabled()})&&(d=yd(this.renderer,U),!d.pass))return U!==a.artworkMesh.material.map&&U.dispose(),this.diagnostics.warn("hub-slot-visible-probe-failed","Hub artwork texture bound but produced no visible pixels",{slotId:e.id,artworkId:e.artworkId,sourceUrlType:s,probe:d}),{applied:!0,usedImage:!1,fit:c,visibleProbe:d,failureStage:"visible-pixel-probe",failureReason:(S=d.reason)!=null?S:"probe-failed"}}else U=this.placeholderTexture(e.displayLabel),this.renderer.initTexture(U);a.textureKind==="image"&&((y=a.artworkMesh.material.map)==null||y.dispose()),a.artworkMesh.material.map=U,a.artworkMesh.material.needsUpdate=!0,a.textureKey=l,a.textureKind=i?"placeholder":"image"}const u=qd(t.room,o,(b=e.placement.physicalHeight)!=null?b:e.placement.mountedHeight,Math.max(.25,e.artworkAspect),e.placement.mountingGap);if(!u)return a.group.visible=!1,this.render(),{applied:!1,usedImage:!1};const{width:h,height:f}=u,g=new R(u.basisU.x,u.basisU.y,u.basisU.z),v=new R(u.basisV.x,u.basisV.y,u.basisV.z),m=new R(u.basisN.x,u.basisN.y,u.basisN.z),p=new dt().makeBasis(g,v,m);return a.group.matrixAutoUpdate=!1,p.setPosition(u.frontCenter.x,u.frontCenter.y,u.frontCenter.z),a.group.matrix.copy(p),a.group.matrixWorldNeedsUpdate=!0,a.group.visible=a.pageIndex===this.activePageIndex,a.artworkMesh.scale.set(h,f,1),a.edgeMesh.scale.set(h,f,Fd-.001),a.edgeMesh.position.set(0,0,-.023/2),this.render(),{applied:!0,usedImage:!i,fit:c,visibleProbe:d}}dispose(){var e,t,n,i,s,a,o,l,c;if(!this.disposed){this.disposed=!0;for(const d of this.slotMeshes.values())d.textureKind==="image"&&((e=d.artworkMesh.material.map)==null||e.dispose()),d.artworkMesh.material.dispose();for(const d of this.placeholderTextures.values())d.dispose();this.edgeGeometry.dispose(),this.artworkPlaneGeometry.dispose(),this.scene.traverse(d=>{const u=d;u.isMesh&&u.geometry!==this.edgeGeometry&&u.geometry!==this.artworkPlaneGeometry&&u.geometry.dispose()}),(n=(t=this.keyLight)==null?void 0:t.shadow.map)==null||n.dispose(),(i=this.reflectionTarget)==null||i.dispose(),(s=this.environmentTarget)==null||s.dispose(),(a=this.sky)==null||a.material.dispose(),(o=this.batterySky)==null||o.material.dispose(),(l=this.skylightGlassMaterial)==null||l.dispose(),(c=this.skylightGlassFallback)==null||c.dispose(),this.surfaceFactory.dispose(),this.renderer.dispose(),this.slotMeshes.clear(),this.pageGroups.clear()}}applyLensShift(){var n,i,s,a;const e=(i=(n=this.resolution.camera.lensShift)==null?void 0:n.x)!=null?i:0,t=(a=(s=this.resolution.camera.lensShift)==null?void 0:s.y)!=null?a:0;if(this.camera.updateProjectionMatrix(),e!==0||t!==0){const o=this.camera.projectionMatrix.elements;o[8]+=e*2,o[9]-=t*2,this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert()}this.reflectionCamera.projectionMatrix.copy(this.camera.projectionMatrix),this.reflectionCamera.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse)}buildLights(){const e=Ru,t=new $v(e.hemisphere.sky,e.hemisphere.ground,e.hemisphere.intensity),n=new jc(e.key.color,e.key.intensity);n.position.set(...e.key.position),n.target.position.set(...e.key.target);const i=new jc(e.fill.color,e.fill.intensity);i.position.set(...e.fill.position),i.target.position.set(...e.fill.target),this.keyLight=n,this.fillLight=i,this.scene.add(t,n,n.target,i,i.target);for(const o of this.coveRects()){const l=Math.max(.1,o.maxX-o.minX-e.ceilingPanel.edgeInset*2),c=Math.max(.1,o.maxZ-o.minZ-e.ceilingPanel.edgeInset),d=new Qc(e.ceilingPanel.color,e.ceilingPanel.intensity,l,c);d.position.set((o.minX+o.maxX)/2,this.resolution.room.ceilingY-e.ceilingPanel.ceilingOffset,(o.minZ+o.maxZ)/2),this.orientAreaLightIntoRoom(d),this.ceilingPanelLights.push(d),this.scene.add(d)}const s=this.clerestoryRect(),a=new Qc(e.skylightPanel.color,e.skylightPanel.intensity,Math.max(.1,s.maxX-s.minX-e.skylightPanel.edgeInset*2),Math.max(.1,s.maxZ-s.minZ-e.skylightPanel.edgeInset*2));a.position.set(0,this.resolution.room.ceilingY+Cr-e.skylightPanel.ceilingOffset,(s.minZ+s.maxZ)/2),this.orientAreaLightIntoRoom(a),this.ceilingPanelLights.push(a),this.scene.add(a),this.applyLightingPreset(),this.applyShadowPreset()}orientAreaLightIntoRoom(e){e.lookAt(e.position.x+ll[0],e.position.y+ll[1],e.position.z+ll[2])}applyLightingPreset(){const e=this.preset.id!=="battery";for(const t of this.ceilingPanelLights)t.visible=e;this.fillLight&&(this.fillLight.visible=!e)}applySkyPreset(){const e=this.preset.id==="battery";this.sky&&(this.sky.visible=!e),this.batterySky&&(this.batterySky.visible=e);const t=e?this.skylightGlassFallback:this.skylightGlassMaterial;if(t)for(const n of this.skylightGlassMeshes)n.material=t}applyShadowPreset(){var a;const e=this.keyLight;if(!e)return;const t=this.preset.hubShadows;e.castShadow!==t&&(e.castShadow=t);const n=this.preset.id==="high"?2048:1024;e.shadow.mapSize.x!==n&&(e.shadow.mapSize.set(n,n),(a=e.shadow.map)==null||a.dispose(),e.shadow.map=null);const i=this.resolution.room.bounds,s=Math.max(i.max.x-i.min.x,i.max.z-i.min.z)*.72;e.shadow.camera.left=-s,e.shadow.camera.right=s,e.shadow.camera.top=s,e.shadow.camera.bottom=-s,e.shadow.camera.near=.5,e.shadow.camera.far=24,e.shadow.bias=-6e-4,e.shadow.normalBias=.02,e.shadow.camera.updateProjectionMatrix()}logRenderingDiagnostics(){var s,a,o,l,c;const e=new R,t=new di,n=this.ceilingPanelLights.map(d=>(d.getWorldQuaternion(t),e.set(0,0,-1).applyQuaternion(t).normalize(),{intensity:d.intensity,size:`${d.width.toFixed(2)}x${d.height.toFixed(2)}`,direction:e.toArray().map(u=>Number(u.toFixed(3))),visible:d.visible})),i=this.renderer.info;this.diagnostics.info("rendering-profile","Hub architectural rendering profile",{preset:this.preset.id,toneMapping:this.renderer.toneMapping,exposure:this.renderer.toneMappingExposure,environmentIntensity:this.scene.environment?this.scene.environmentIntensity:0,hemisphereIntensity:Ru.hemisphere.intensity,directionalIntensity:(a=(s=this.keyLight)==null?void 0:s.intensity)!=null?a:0,areaLights:n,shadowMapSize:(o=this.keyLight)!=null&&o.castShadow?this.keyLight.shadow.mapSize.x:0,reflectionTarget:this.reflectionTarget?`${this.reflectionTarget.width}x${this.reflectionTarget.height}`:"off",drawCalls:i.render.calls,triangles:i.render.triangles,textures:i.memory.textures,programs:(c=(l=i.programs)==null?void 0:l.length)!=null?c:0})}applyEnvironment(){const e=this.preset.hubReflection!=="off";if(e&&!this.environmentTarget){const t=new Bs(this.renderer);t.compileCubemapShader();const n=new Hr;n.add(this.createAtmosphericSky()),this.environmentTarget=t.fromScene(n,.08),t.dispose(),n.traverse(i=>{const s=i;s.isMesh&&(s.geometry.dispose(),s.material.dispose())}),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=Ra.environmentIntensity}else!e&&this.environmentTarget&&(this.scene.environment=null,this.environmentTarget.dispose(),this.environmentTarget=null)}attachFloorReflectionShader(e){const t=this.reflectionUniforms,n=e.onBeforeCompile;e.onBeforeCompile=s=>{n(s,this.renderer),s.uniforms.uReflectionMap=t.uReflectionMap,s.uniforms.uReflectionMatrix=t.uReflectionMatrix,s.uniforms.uReflectionStrength=t.uReflectionStrength,s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
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
#include <opaque_fragment>`)};const i=e.customProgramCacheKey;e.customProgramCacheKey=()=>`hub-floor-reflection-${i()}`}applyReflectionMode(){var t,n;const e=this.preset.hubReflection;if(e==="planar"){const i=Math.max(1,this.preset.hubReflectionDivisor),s=Math.max(64,Math.floor(this.resolution.stage.width/i)),a=Math.max(64,Math.floor(this.resolution.stage.height/i));(!this.reflectionTarget||this.reflectionTarget.width!==s||this.reflectionTarget.height!==a)&&((t=this.reflectionTarget)==null||t.dispose(),this.reflectionTarget=new Zt(s,a,{minFilter:1006,magFilter:1006}),this.reflectionTarget.texture.colorSpace=on),this.reflectionUniforms.uReflectionMap.value=this.reflectionTarget.texture,this.reflectionUniforms.uReflectionStrength.value=this.preset.id==="high"?Ra.planarReflectionHigh:Ra.planarReflectionBalanced,this.materials.floor.roughness=.6}else this.reflectionUniforms.uReflectionMap.value=null,this.reflectionUniforms.uReflectionStrength.value=0,(n=this.reflectionTarget)==null||n.dispose(),this.reflectionTarget=null,this.materials.floor.roughness=e==="ibl"?.62:.76}renderReflection(){const e=this.reflectionTarget;if(!e||this.reflectionUniforms.uReflectionStrength.value<=0)return;const t=this.resolution.room.floorY,n=this.reflectionCamera;n.position.copy(this.camera.position),n.position.y=2*t-n.position.y,n.up.set(0,-1,0),n.lookAt(this.cameraTarget.x,2*t-this.cameraTarget.y,this.cameraTarget.z),n.updateMatrixWorld(!0),n.projectionMatrix.copy(this.camera.projectionMatrix),this.reflectionMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),this.reflectionMatrix.multiply(n.projectionMatrix),this.reflectionMatrix.multiply(n.matrixWorldInverse),this.reflectionUniforms.uReflectionMatrix.value.copy(this.reflectionMatrix);for(const s of this.floorMeshes)s.visible=!1;const i=this.renderer.toneMapping;this.renderer.toneMapping=0,this.renderer.setRenderTarget(e),this.renderer.render(this.scene,n),this.renderer.setRenderTarget(null),this.renderer.toneMapping=i;for(const s of this.floorMeshes)s.visible=!0}shellBounds(){const e=this.resolution.room.bounds,t=new R(e.min.x,this.resolution.room.floorY,e.min.z),n=new R(e.max.x,this.resolution.room.ceilingY,e.max.z),i=this.resolution.camera.position.z;return i+nu>n.z&&(n.z=i+nu),{min:t,max:n}}addQuad(e,t,n,i,s,a,o=this.scene){const l=new Kt(s,a),c=l.attributes.uv;for(let f=0;f<c.count;f+=1)c.setXY(f,c.getX(f)*s,c.getY(f)*a);const d=new Ge(l,e),u=new R().crossVectors(n,i).normalize(),h=new dt().makeBasis(n,i,u);return h.setPosition(t.x+n.x*(s/2)+i.x*(a/2),t.y+n.y*(s/2)+i.y*(a/2),t.z+n.z*(s/2)+i.z*(a/2)),d.matrixAutoUpdate=!1,d.matrix.copy(h),d.matrixWorldNeedsUpdate=!0,d.receiveShadow=!0,o.add(d),d}buildRoom(){this.buildCalibratedWalls(),this.buildFloorAndCeiling(),this.buildEntryShell(),this.buildDoorwayPockets(),this.buildSkirting(),this.buildCeilingReveal()}buildCalibratedWalls(){var e,t,n;for(const i of this.resolution.walls){if(!i.room)continue;const s=hx(i);if(!s)continue;const a=new qs(s),o=new Ge(a,this.materials.wall);o.receiveShadow=!0,o.matrixAutoUpdate=!1;const l=ma(i.room),c=new R(i.room.axisU.x,i.room.axisU.y,i.room.axisU.z).normalize(),d=new R(i.room.axisV.x,i.room.axisV.y,i.room.axisV.z).normalize(),u=new R((e=l==null?void 0:l.x)!=null?e:0,(t=l==null?void 0:l.y)!=null?t:0,(n=l==null?void 0:l.z)!=null?n:1).normalize(),h=new dt().makeBasis(c,d,u);h.setPosition(i.room.origin.x,i.room.origin.y,i.room.origin.z),o.matrix.copy(h),o.matrixWorldNeedsUpdate=!0,this.scene.add(o)}}buildFloorAndCeiling(){const e=this.shellBounds(),t=this.addQuad(this.materials.floor,new R(e.min.x,e.min.y,e.max.z),new R(1,0,0),new R(0,0,-1),e.max.x-e.min.x,e.max.z-e.min.z);this.floorMeshes.push(t);const n=this.coveRects(),i=this.clerestoryRect(),s=new To;s.moveTo(e.min.x,e.min.z),s.lineTo(e.max.x,e.min.z),s.lineTo(e.max.x,e.max.z),s.lineTo(e.min.x,e.max.z),s.closePath();for(const l of n){const c=new $r;c.moveTo(l.minX,l.minZ),c.lineTo(l.maxX,l.minZ),c.lineTo(l.maxX,l.maxZ),c.lineTo(l.minX,l.maxZ),c.closePath(),s.holes.push(c)}const a=new $r;a.moveTo(i.minX,i.minZ),a.lineTo(i.maxX,i.minZ),a.lineTo(i.maxX,i.maxZ),a.lineTo(i.minX,i.maxZ),a.closePath(),s.holes.push(a);const o=new Ge(new qs(s),this.materials.ceiling);o.rotation.x=Math.PI/2,o.position.y=e.max.y,o.castShadow=!0,o.receiveShadow=!0,this.scene.add(o);for(const l of n)this.buildCove(l,e.max.y);this.buildClerestory(i,e.max.y)}coveRects(){const e=this.resolution.room.bounds,t=e.max.z-e.min.z;if(e.max.x-e.min.x<4||t<5)return[];const n=e.min.z+Eu,i=e.max.z-Eu;return[{minX:e.min.x+Ca,maxX:e.min.x+Ca+Mu,minZ:n,maxZ:i},{minX:e.max.x-Ca-Mu,maxX:e.max.x-Ca,minZ:n,maxZ:i}]}clerestoryRect(){const e=this.resolution.room.bounds;return{minX:-Au/2,maxX:Au/2,minZ:e.min.z+Cu,maxZ:e.max.z-Cu}}buildCove(e,t){const n=e.maxZ-e.minZ;this.addQuad(this.materials.trim,new R(e.minX,t,e.maxZ),new R(0,0,-1),new R(0,1,0),n,Tu).castShadow=!0,this.addQuad(this.materials.trim,new R(e.maxX,t,e.minZ),new R(0,0,1),new R(0,1,0),n,Tu).castShadow=!0,this.addQuad(this.materials.lightStrip,new R(e.minX-.04,t+dx,e.minZ-.04),new R(1,0,0),new R(0,0,1),e.maxX-e.minX+.08,n+.08)}buildClerestory(e,t){const n=e.maxX-e.minX,i=e.maxZ-e.minZ,s=t+Cr;this.addQuad(this.materials.ceiling,new R(e.minX,t,e.maxZ),new R(0,0,-1),new R(0,1,0),i,Cr).castShadow=!0,this.addQuad(this.materials.ceiling,new R(e.maxX,t,e.minZ),new R(0,0,1),new R(0,1,0),i,Cr).castShadow=!0,this.addQuad(this.materials.ceiling,new R(e.minX,t,e.minZ),new R(1,0,0),new R(0,1,0),n,Cr).castShadow=!0,this.addQuad(this.materials.ceiling,new R(e.maxX,t,e.maxZ),new R(-1,0,0),new R(0,1,0),n,Cr).castShadow=!0,this.buildSkylightRoof(e,s),this.sky||(this.sky=this.createAtmosphericSky(),this.batterySky=this.createBatterySky(),this.scene.add(this.sky,this.batterySky)),this.applySkyPreset()}buildSkylightRoof(e,t){var p,S;const n=(e.maxX-e.minX)/2,i=e.maxZ-e.minZ,s=Math.hypot(n,ai),a=Math.atan2(ai,n);for(const y of this.skylightGlassMeshes)y.removeFromParent(),y.geometry.dispose();this.skylightGlassMeshes.length=0,(p=this.skylightGlassMaterial)==null||p.dispose(),(S=this.skylightGlassFallback)==null||S.dispose(),this.skylightGlassMaterial=new Vc({color:new Pe("#dbe8e9"),roughness:In.glassRoughness,metalness:0,transmission:In.glassTransmission,thickness:.018,ior:1.48,transparent:!0,opacity:.62,side:2,depthWrite:!1,envMapIntensity:.72}),this.skylightGlassFallback=new pi({color:new Pe("#d8e5e7"),transparent:!0,opacity:.42,side:2,depthWrite:!1,toneMapped:!0});const o=this.addQuad(this.skylightGlassMaterial,new R(e.minX,t,e.minZ),new R(0,0,1),new R(n/s,ai/s,0),i,s),l=this.addQuad(this.skylightGlassMaterial,new R(e.maxX,t,e.maxZ),new R(0,0,-1),new R(-n/s,ai/s,0),i,s);o.renderOrder=-1,l.renderOrder=-1,this.skylightGlassMeshes.push(o,l);const c=.045,d=new Ge(new Nt(c,c,i+.08),this.materials.trim);d.position.set(0,t+ai,(e.minZ+e.maxZ)/2),d.castShadow=!0,this.scene.add(d);const u=new Nt(s+.06,c,c),h=new hv(u,this.materials.trim,In.ribCount*2),f=new dt,g=new R,v=new di,m=new R(1,1,1);for(let y=0;y<In.ribCount;y+=1){const b=e.minZ+i*y/(In.ribCount-1);g.set(-n/2,t+ai/2,b),v.setFromAxisAngle(new R(0,0,1),a),f.compose(g,v,m),h.setMatrixAt(y*2,f),g.set(n/2,t+ai/2,b),v.setFromAxisAngle(new R(0,0,1),-a),f.compose(g,v,m),h.setMatrixAt(y*2+1,f)}h.instanceMatrix.needsUpdate=!0,h.castShadow=!0,this.scene.add(h)}createAtmosphericSky(){const e=new Aa;e.scale.setScalar(80);const t=e.material.uniforms;return t.turbidity.value=In.turbidity,t.rayleigh.value=In.rayleigh,t.mieCoefficient.value=In.mieCoefficient,t.mieDirectionalG.value=In.mieDirectionalG,t.sunPosition.value.set(...In.sunDirection),e.material.depthWrite=!1,e.renderOrder=-10,e}createBatterySky(){const e=new Ft({side:1,depthWrite:!1,toneMapped:!0,vertexShader:["varying vec3 vWorldDirection;","void main() {","  vec4 worldPosition = modelMatrix * vec4(position, 1.0);","  vWorldDirection = normalize(worldPosition.xyz - cameraPosition);","  gl_Position = projectionMatrix * viewMatrix * worldPosition;","}"].join(`
`),fragmentShader:["varying vec3 vWorldDirection;","void main() {","  float horizon = smoothstep(-0.12, 0.72, vWorldDirection.y);","  vec3 low = vec3(0.78, 0.82, 0.82);","  vec3 high = vec3(0.60, 0.72, 0.80);","  gl_FragColor = vec4(mix(low, high, horizon), 1.0);","}"].join(`
`)}),t=new Ge(new Ro(60,16,8),e);return t.renderOrder=-10,t}buildEntryShell(){const e=this.shellBounds(),t=this.resolution.room.bounds.max.z;if(e.max.z<=t+.01)return;const n=e.max.z-t,i=e.max.y-e.min.y;this.addQuad(this.materials.wall,new R(e.min.x,e.min.y,e.max.z),new R(0,0,-1),new R(0,1,0),n,i),this.addQuad(this.materials.wall,new R(e.max.x,e.min.y,t),new R(0,0,1),new R(0,1,0),n,i),this.addQuad(this.materials.wall,new R(e.max.x,e.min.y,e.max.z),new R(-1,0,0),new R(0,1,0),e.max.x-e.min.x,i)}buildDoorwayPockets(){for(const e of this.resolution.walls){const t=e.room;if(!t||t.doorwayExclusions.length===0)continue;const n=ma(t);if(!n)continue;const i=new R(t.axisU.x,t.axisU.y,t.axisU.z).normalize(),s=new R(t.axisV.x,t.axisV.y,t.axisV.z).normalize(),a=new R(-n.x,-n.y,-n.z);for(const o of t.doorwayExclusions){const l=o.map(p=>p.x),c=o.map(p=>p.y),d=Math.min(...l),u=Math.max(...l),h=Math.min(...c),f=Math.max(...c),g=(p,S,y)=>{const b=os(t,{x:p,y:S});return new R(b.x,b.y,b.z).addScaledVector(a,y)},v=u-d,m=f-h;this.addQuad(this.materials.pocket,g(d,h,0),a.clone(),s.clone(),Ar,m).castShadow=!0,this.addQuad(this.materials.pocket,g(u,h,Ar),a.clone().negate(),s.clone(),Ar,m).castShadow=!0,this.addQuad(this.materials.pocket,g(d,f,0),a.clone(),i.clone(),Ar,v).castShadow=!0,this.floorMeshes.push(this.addQuad(this.materials.floor,g(d,h,0),i.clone(),a.clone(),v,Ar)),this.addQuad(this.materials.pocket,g(d,h,Ar),i.clone(),s.clone(),v,m)}}}buildSkirting(){const e=this.shellBounds(),t=this.resolution.room.bounds.max.z,n=new Nt(1,1,1),i=(s,a,o,l)=>{if(o<=.02)return;const c=new Ge(n,this.materials.trim);c.scale.set(o,Su,wu);const d=s.clone().addScaledVector(a,o/2).addScaledVector(l,-wu*.25).setY(e.min.y+Su/2);c.position.copy(d),Math.abs(a.z)>Math.abs(a.x)&&(c.rotation.y=Math.PI/2),this.scene.add(c)};for(const s of this.resolution.walls){const a=s.room;if(!a)continue;const o=ma(a);if(!o)continue;const l=new R(a.axisU.x,a.axisU.y,a.axisU.z).normalize(),c=new R(o.x,o.y,o.z),d=a.doorwayExclusions.filter(f=>Math.min(...f.map(g=>g.y))<=.01).map(f=>({from:Math.min(...f.map(g=>g.x)),to:Math.max(...f.map(g=>g.x))})).sort((f,g)=>f.from-g.from);let u=0;for(const f of d){const g=os(a,{x:u,y:0});i(new R(g.x,g.y,g.z),l,f.from-u,c),u=f.to}const h=os(a,{x:u,y:0});i(new R(h.x,h.y,h.z),l,a.width-u,c)}if(e.max.z>t+.01){const s=e.max.z-t;i(new R(e.min.x,0,t),new R(0,0,1),s,new R(1,0,0)),i(new R(e.max.x,0,t),new R(0,0,1),s,new R(-1,0,0)),i(new R(e.min.x,0,e.max.z),new R(1,0,0),e.max.x-e.min.x,new R(0,0,-1))}}buildCeilingReveal(){const e=this.shellBounds(),t=this.resolution.room.bounds.min.z,n=new Nt(1,1,1),i=(s,a)=>{const o=new Ge(n,this.materials.trim);o.position.copy(s),o.scale.copy(a),this.scene.add(o)};i(new R(0,e.max.y-.018,t+.012),new R(e.max.x-e.min.x,.025,.024)),i(new R(e.min.x+.012,e.max.y-.018,(e.min.z+e.max.z)/2),new R(.024,.025,e.max.z-e.min.z)),i(new R(e.max.x-.012,e.max.y-.018,(e.min.z+e.max.z)/2),new R(.024,.025,e.max.z-e.min.z))}ensureSlotState(e){const t=this.slotMeshes.get(e.id);if(t)return t;const n=new pi({transparent:!0,toneMapped:!1}),i=new Ge(this.artworkPlaneGeometry,n);i.castShadow=!1,i.receiveShadow=!1;const s=new Ge(this.edgeGeometry,this.materials.artworkEdge);s.castShadow=!0,s.receiveShadow=!1,s.renderOrder=2,i.renderOrder=3;const a=new ti;a.add(s,i),this.ensurePageGroup(e.pageIndex).add(a);const l={pageIndex:e.pageIndex,group:a,artworkMesh:i,edgeMesh:s,textureKind:null,textureKey:null};return this.slotMeshes.set(e.id,l),l}ensurePageGroup(e){const t=this.pageGroups.get(e);if(t)return t;const n=new ti;return n.visible=e===this.activePageIndex,this.pageGroups.set(e,n),this.scene.add(n),n}effectiveAnisotropy(){try{return Math.min(4,this.renderer.capabilities.getMaxAnisotropy())}catch(e){return 1}}imageTexture(e){const t=this.renderer.capabilities.maxTextureSize,n=e.naturalWidth||e.width,i=e.naturalHeight||e.height,s=gd(e,n,i,t);s.downscaleApplied?this.diagnostics.warn("hub-slot-texture-downscaled","Downscaled oversized hub artwork texture to fit device capability",{sourceWidth:n,sourceHeight:i,uploadWidth:s.fit.targetWidth,uploadHeight:s.fit.targetHeight,maxTextureSize:t}):s.fit.needsDownscale&&this.diagnostics.warn("hub-slot-texture-oversized","Hub artwork texture exceeds device MAX_TEXTURE_SIZE and could not be downscaled",{sourceWidth:n,sourceHeight:i,maxTextureSize:t});const a=new Lt(s.image);return a.colorSpace=Ot,a.needsUpdate=!0,a.anisotropy=this.effectiveAnisotropy(),{texture:a,fit:s.fit}}placeholderTexture(e){const t=this.placeholderTextures.get(e);if(t)return t;const n=document.createElement("canvas");n.width=_u,n.height=_u;const i=n.getContext("2d");if(!i){const l=new bo(n);return this.placeholderTextures.set(e,l),l}i.fillStyle=this.resolution.visualTokens.museumWall,i.fillRect(0,0,n.width,n.height),i.strokeStyle="rgba(24, 32, 38, 0.22)",i.lineWidth=12,i.strokeRect(28,28,n.width-56,n.height-56),i.fillStyle="rgba(24, 32, 38, 0.72)",i.font="600 42px Inter, system-ui, sans-serif",i.textAlign="center",i.textBaseline="middle";const a=e.split(/\s+/).reduce((l,c)=>{var h;const d=(h=l[l.length-1])!=null?h:"",u=d?`${d} ${c}`:c;return u.length>14&&d?l.push(c):d?l[l.length-1]=u:l.push(c),l},[]).slice(0,3);a.forEach((l,c)=>{i.fillText(l,n.width/2,n.height/2+(c-(a.length-1)/2)*52)});const o=new bo(n);return o.colorSpace=Ot,this.placeholderTextures.set(e,o),o}render(){this.disposed||(this.renderReflection(),this.renderer.render(this.scene,this.camera))}}function hx(r){var t,n,i,s,a,o,l,c;if(!r.room)return null;const e=new To;e.moveTo(0,0),e.lineTo(r.room.width,0),e.lineTo(r.room.width,r.room.height),e.lineTo(0,r.room.height),e.lineTo(0,0);for(const d of r.room.doorwayExclusions){const u=new $r;u.moveTo((n=(t=d[0])==null?void 0:t.x)!=null?n:0,(s=(i=d[0])==null?void 0:i.y)!=null?s:0);for(let h=1;h<d.length;h+=1)u.lineTo(d[h].x,d[h].y);u.lineTo((o=(a=d[0])==null?void 0:a.x)!=null?o:0,(c=(l=d[0])==null?void 0:l.y)!=null?c:0),e.holes.push(u)}return e}const Pu=window.location.protocol==="file:"?"../customer-artworks/":"/",cl=5e3,fx=2e4,px="(max-aspect-ratio: 4/5)",mx=()=>{try{return new URLSearchParams(window.location.search).get("hubCalibrate")==="1"}catch(r){return!1}},gx=()=>{try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(r){return!1}};function Iu(r){return window.location.protocol==="file:"?`${Pu}${r}`:`${Pu}${r.replace(/^Backgrounds\//,"backgrounds/")}`}const un=class un{constructor(e,t,n){x(this,"element");x(this,"diagnostics",rn("hub"));x(this,"resolution");x(this,"visual");x(this,"stage");x(this,"hubRoomRenderer");x(this,"roomLayers",[]);x(this,"slotViews",[]);x(this,"entryButton");x(this,"status");x(this,"pager");x(this,"pagerPrev");x(this,"pagerNext");x(this,"pagerCounter");x(this,"narrowQuery");x(this,"imageReady");x(this,"calibrating");x(this,"debugGeometry");x(this,"stageWidth");x(this,"stageHeight");x(this,"resizeObserver");x(this,"calibrationOutput",null);x(this,"calibrationWarnings",null);x(this,"calibrationRestoreButton",null);x(this,"calibrationWallSelect",null);x(this,"calibrationSlotSelect",null);x(this,"calibrationFields",new Map);x(this,"calibrationCopyButton",null);x(this,"calibrationDownloadButton",null);x(this,"calibrationUndoButton",null);x(this,"calibrationRedoButton",null);x(this,"calibrationActionStatus",null);x(this,"calibrationSvg",null);x(this,"calibrationDrag",null);x(this,"activeCalibrationWallId",null);x(this,"activeCalibrationSlotId",null);x(this,"lastValidCalibrationSnapshot",null);x(this,"initialCalibrationSnapshot",null);x(this,"calibrationUndoStack",[]);x(this,"calibrationRedoStack",[]);x(this,"calibrationExportValid",!1);x(this,"calibrationWallOwnership",new Map);x(this,"activateCallback",null);x(this,"selectSlotCallback",null);x(this,"disposed",!1);x(this,"pageCount",1);x(this,"viewIndex",0);x(this,"narrowMode",!1);x(this,"lastActivatedSlotId",null);x(this,"selectedArtworkId",null);x(this,"lastSelectionSignature",null);x(this,"decodedPages",new Set);x(this,"idleDecodeHandle",null);x(this,"idleDecodeNextPage",1);x(this,"projectedSlotGeometry",new Map);x(this,"debugProjectionSignatureBySlot",new Map);x(this,"swipeStartX",null);x(this,"swipeStartY",null);x(this,"resizeRafId",0);x(this,"handleActivate",()=>{var e;this.entryButton.disabled||(this.setButtonsDisabled(!0),(e=this.activateCallback)==null||e.call(this))});x(this,"handleNarrowChange",()=>{const e=this.narrowMode;if(this.narrowMode=this.narrowQuery.matches,e!==this.narrowMode){const t=e?Math.floor(this.viewIndex/un.NARROW_VIEWS_PER_PAGE):this.viewIndex;this.viewIndex=this.narrowMode?t*un.NARROW_VIEWS_PER_PAGE:t,this.applyView()}});x(this,"handleResize",()=>{this.resizeRafId===0&&(this.resizeRafId=requestAnimationFrame(()=>{this.resizeRafId=0,this.updateStageScale(),this.applyView(),this.applyAllSlotGeometry(),this.debugGeometry&&this.emitDebugGeometrySnapshot("resize")}))});x(this,"handleKeydown",e=>{if(this.calibrating){if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)||e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLButtonElement)return;const t=this.activeCalibrationSlot,n=t?this.resolution.wallById.get(t.placement.wallId):null;if(!t||!n)return;this.recordCalibrationHistory();const i=e.shiftKey?.01:.002,s=t.placement.center,a=$(s.x+(e.key==="ArrowLeft"?-i:e.key==="ArrowRight"?i:0),s.y+(e.key==="ArrowUp"?-i:e.key==="ArrowDown"?i:0));this.setSlotCenterClampedToMountingZone(t,n,a),this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0),this.syncCalibrationControls(),e.preventDefault();return}e.key==="ArrowLeft"?(this.stepView(-1),e.preventDefault()):e.key==="ArrowRight"&&(this.stepView(1),e.preventDefault())});x(this,"handleSwipeStart",e=>{this.calibrating||(this.swipeStartX=e.clientX,this.swipeStartY=e.clientY)});x(this,"handleSwipeEnd",e=>{if(this.swipeStartX===null||this.swipeStartY===null)return;const t=e.clientX-this.swipeStartX,n=e.clientY-this.swipeStartY;this.swipeStartX=null,this.swipeStartY=null,!(Math.abs(t)<56||Math.abs(t)<Math.abs(n)*1.4)&&this.stepView(t<0?1:-1)});x(this,"handleCalibrationMove",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;const n=this.pointerEventToStage(e);if(n){if(t.kind==="slot"){const i=this.resolution.wallById.get(t.slot.placement.wallId);if(!i)return;const s=i.inverseHomography?this.applyInverseHomography(i,n):null;if(!s)return;if(t.mode==="move")this.setSlotCenterClampedToMountingZone(t.slot,i,$(this.clampLocalX(s.x),this.clampLocalY(s.y)));else{const a=Math.abs(s.y-t.slot.placement.center.y)*2;t.slot.placement.mountedHeight=i.room?Math.max(.12,Math.min(i.room.height,a*i.room.height)):Math.max(.04,Math.min(.9,a)),t.slot.placement.physicalHeight=t.slot.placement.mountedHeight}this.applySlotGeometry(t.button,t.slot)}else{const i=this.resolution.wallById.get(t.wallId);if(!i||t.target==="quad")return;const a=(t.target==="safe"?i.safePolygon:i.mountingZone)[t.index];if(!a)return;a.x=n.x,a.y=n.y,t.target==="mounting-zone"&&(i.mountingZoneConfirmed=!1),this.applyAllSlotGeometry()}this.renderCalibrationOverlay(),this.updateCalibrationOutput(!1),this.syncCalibrationControls()}});x(this,"handleCalibrationEnd",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;this.calibrationDrag=null;const n=e.currentTarget;n==null||n.removeEventListener("pointermove",this.handleCalibrationMove),n==null||n.removeEventListener("pointerup",this.handleCalibrationEnd),n==null||n.removeEventListener("pointercancel",this.handleCalibrationEnd),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)});var M,_,I,B;this.resolution=t,this.calibrating=mx(),this.debugGeometry=gx(),this.pageCount=Math.max(1,t.pages.length),this.stageWidth=t.stage.width,this.stageHeight=t.stage.height,this.activeCalibrationWallId=(_=(M=t.walls[0])==null?void 0:M.id)!=null?_:null;const i=document.createElement("section");i.className="museum-hub",i.setAttribute("aria-labelledby","museum-hub-title"),i.style.setProperty("--hub-aspect",String(t.background.aspect)),i.style.setProperty("--hub-stage-width",`${this.stageWidth}px`),i.style.setProperty("--hub-stage-height",`${this.stageHeight}px`),i.style.setProperty("--hub-stage-scale","1"),this.calibrating&&i.classList.add("is-calibrating"),this.debugGeometry&&i.classList.add("is-debug-geometry");const s=document.createElement("div");s.className="museum-hub__visual";const a=document.createElement("div");a.className="museum-hub__stage";const o=document.createElement("img");o.className="museum-hub__image",o.alt="",o.decoding="async",o.draggable=!1;const l=Iu(t.background.src),c=Iu(t.backgroundFallback.src),d=cx({image:o,role:"background",primaryPath:t.background.src,primaryUrl:l,fallbackPath:t.backgroundFallback.src,fallbackUrl:c,timeoutMs:cl,diagnostics:this.diagnostics,context:{hubSource:t.source,stage:`${t.stage.width}x${t.stage.height}`,selectableSlots:t.slotToArtwork.size},onNeutralFallback:()=>{i.classList.add("has-image-error")}}).then(F=>{if(F.status==="neutral-fallback"){i.classList.add("has-image-error");return}i.classList.remove("has-image-error")}).catch(F=>{i.classList.add("has-image-error"),this.diagnostics.warn("hub-asset-loader-unexpected","Hub background loader threw unexpectedly; continuing with neutral museum-grey surface",{primaryPath:t.background.src,fallbackPath:t.backgroundFallback.src,error:F})});a.appendChild(o);let u=null;try{u=new ux(a,t,n)}catch(F){const N=a.querySelector("canvas");ad((I=N==null?void 0:N.getContext("webgl2"))!=null?I:null),N==null||N.remove(),i.classList.add("is-2d"),this.diagnostics.warn("renderer-fallback","Hub renderer failed; continuing with the accessible DOM museum",{stage:"hub-renderer-initialization",message:F instanceof Error?F.message:String(F),protocol:window.location.protocol})}this.hubRoomRenderer=u;const h=document.createElement("div");h.className="museum-hub__shade",h.setAttribute("aria-hidden","true");const f=document.createElement("header");f.className="museum-hub__header";const g=document.createElement("p");g.className="museum-hub__eyebrow",g.textContent="FREYRAUM";const v=document.createElement("h1");v.id="museum-hub-title",v.className="museum-hub__title",v.textContent="Museum";const m=document.createElement("p");m.className="museum-hub__introduction",m.textContent="Wählen Sie ein Kunstwerk, um die Ausstellung zu betreten.",f.append(g,v,m);const p=document.createElement("button");p.className="museum-hub__destination",p.type="button",p.setAttribute("aria-describedby","museum-hub-entry-description"),p.innerHTML=`
      <span class="museum-hub__destination-frame" aria-hidden="true"></span>
      <span class="museum-hub__destination-label">Ausstellung betreten</span>
    `;const S=document.createElement("p");S.id="museum-hub-entry-description",S.className="sr-only",S.textContent="Öffnet die interaktive Galerie mit Navigation, Detailansicht und Informationen zu den Kunstwerken.";const y=document.createElement("p");y.className="museum-hub__status sr-only",y.setAttribute("role","status"),y.setAttribute("aria-live","polite");const b=document.createElement("nav");b.className="museum-hub__pager",b.setAttribute("aria-label","Museumsräume");const U=document.createElement("button");U.type="button",U.className="museum-hub__pager-arrow museum-hub__pager-arrow--prev",U.setAttribute("aria-label","Vorherige Wand"),U.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';const P=document.createElement("span");P.className="museum-hub__pager-counter",P.setAttribute("aria-live","polite");const E=document.createElement("button");E.type="button",E.className="museum-hub__pager-arrow museum-hub__pager-arrow--next",E.setAttribute("aria-label","Nächste Wand"),E.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',b.append(U,P,E),a.appendChild(p),s.appendChild(a),i.append(s,h,f,S,b,y),e.appendChild(i),this.element=i,this.visual=s,this.stage=a,this.entryButton=p,this.status=y,this.pager=b,this.pagerPrev=U,this.pagerNext=E,this.pagerCounter=P,this.entryButton.addEventListener("click",this.handleActivate),U.addEventListener("click",()=>this.stepView(-1)),E.addEventListener("click",()=>this.stepView(1)),this.buildSlots();for(const{slot:F}of this.slotViews)this.calibrationWallOwnership.set(F.id,F.placement.wallId);const L=this.resolution.slotToArtwork.size>0;this.entryButton.hidden=L,this.narrowQuery=window.matchMedia(px),this.narrowMode=this.narrowQuery.matches,this.narrowQuery.addEventListener("change",this.handleNarrowChange),this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.handleResize()):null,(B=this.resizeObserver)==null||B.observe(this.visual),window.addEventListener("resize",this.handleResize),i.addEventListener("pointerdown",this.handleSwipeStart,{passive:!0}),i.addEventListener("pointerup",this.handleSwipeEnd,{passive:!0}),i.addEventListener("keydown",this.handleKeydown),(this.calibrating||this.debugGeometry)&&(this.buildCalibrationOverlay(),this.calibrating&&this.buildCalibrationPanel(i),this.renderCalibrationOverlay()),this.imageReady=Promise.all([d,this.decodePageImages(0)]).then(()=>{this.applyView(!0),this.updateStageScale(),this.applyAllSlotGeometry(),this.applySelectionState("composition-ready"),this.scheduleIdlePageDecode(),this.calibrating&&this.updateCalibrationOutput(!0),this.debugGeometry&&this.emitDebugGeometrySnapshot("composition-ready"),this.diagnostics.info("composition-ready","Hub composition prepared",{pages:this.pageCount,selectableSlots:this.resolution.slotToArtwork.size,source:this.resolution.source,debugGeometry:this.debugGeometry})})}onActivate(e){this.activateCallback=e}applyPreset(e){var t;this.disposed||(t=this.hubRoomRenderer)==null||t.applyPreset(e)}onSelectSlot(e){this.selectSlotCallback=e}setSelectedArtworkId(e,t={}){var s;const n=e&&this.resolution.artworkToSlot.has(e)?e:null;this.selectedArtworkId=n;const i=n?this.slotViews.find(a=>a.slot.artworkId===n&&!a.button.disabled):void 0;i&&t.alignPage!==!1&&this.goToPage(i.slot.pageIndex,i.slot),this.applySelectionState((s=t.source)!=null?s:"external-selection-sync",{restoreFocus:t.restoreFocus===!0})}prepare(){return this.imageReady}enter(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="",this.scheduleIdlePageDecode(),this.applySelectionState("enter"),requestAnimationFrame(()=>this.focusInitialTarget()))}async exit(e){this.disposed||(this.cancelIdlePageDecode(),this.setButtonsDisabled(!0),this.status.textContent="Ausstellung wird geöffnet.",this.element.classList.add("is-exiting"),e||await new Promise(t=>window.setTimeout(t,520)),this.disposed||(this.element.hidden=!0))}showError(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",this.focusInitialTarget())}focusInitialTarget(){var i;const e=this.selectedArtworkId?this.slotViews.find(s=>s.slot.artworkId===this.selectedArtworkId&&!s.button.disabled):void 0;if(e){this.goToPage(e.slot.pageIndex,e.slot),e.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-selected-target");return}const t=this.lastActivatedSlotId?this.slotViews.find(s=>s.slot.id===this.lastActivatedSlotId&&!s.button.disabled):void 0;if(t){this.goToPage(t.slot.pageIndex,t.slot),t.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-restored-slot");return}const n=this.slotViews.find(s=>s.slot.selectable);((i=n==null?void 0:n.button)!=null?i:this.entryButton).focus({preventScroll:!0}),this.logSelectionLifecycle("focus-first-target")}applySelectionState(e,t={}){var s,a;let n;for(const o of this.slotViews){const l=!!this.selectedArtworkId&&o.slot.artworkId===this.selectedArtworkId;o.button.classList.toggle("is-selected",l),l?(o.button.setAttribute("aria-current","true"),n=o):o.button.removeAttribute("aria-current")}const i=`${e}:${(s=this.selectedArtworkId)!=null?s:"none"}:${(a=n==null?void 0:n.slot.id)!=null?a:"none"}:${this.viewIndex}`;this.lastSelectionSignature!==i&&(this.lastSelectionSignature=i,this.logSelectionLifecycle(e)),t.restoreFocus&&n&&n.button.focus({preventScroll:!0})}logSelectionLifecycle(e){var n,i,s;const t=this.selectedArtworkId?this.slotViews.find(a=>a.slot.artworkId===this.selectedArtworkId):void 0;this.diagnostics.info("hub-selection-lifecycle","Hub selection lifecycle updated",{reason:e,selectedArtworkId:this.selectedArtworkId,selectedSlotId:(n=t==null?void 0:t.slot.id)!=null?n:null,selectedPageIndex:(i=t==null?void 0:t.slot.pageIndex)!=null?i:null,currentViewIndex:this.viewIndex,currentWallFocus:(s=this.element.dataset.wallFocus)!=null?s:"full",lastActivatedSlotId:this.lastActivatedSlotId,renderedSlots:this.slotViews.length})}setButtonsDisabled(e){this.entryButton.disabled=e;for(const t of this.slotViews)t.button.disabled=e||!t.slot.selectable;e?(this.pagerPrev.disabled=!0,this.pagerNext.disabled=!0):(this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1)}buildSlots(){const e=document.createElement("div");e.className="museum-hub__rooms";for(const t of this.resolution.pages){const n=document.createElement("div");n.className="museum-hub__room",n.dataset.page=String(t.pageIndex);for(const i of t.slots){if(!this.calibrating&&!this.debugGeometry&&(!i.selectable||!i.artworkId))continue;const s=this.buildSlotButton(i);n.appendChild(s.button),this.slotViews.push(s)}e.appendChild(n),this.roomLayers.push(n)}this.stage.appendChild(e)}buildSlotButton(e){const t=document.createElement("button");t.type="button",t.className="museum-hub__artwork",t.dataset.slotId=e.id,e.artworkId&&(t.dataset.artworkId=e.artworkId);let n=null;if(e.selectable&&e.artworkId){t.setAttribute("aria-label",`Kunstwerk „${e.displayLabel}“ in der Ausstellung öffnen`),n=document.createElement("img"),n.className="museum-hub__art",n.alt="",n.decoding="async",n.draggable=!1,t.appendChild(n);const a=document.createElement("span");a.className="museum-hub__art-placeholder",a.textContent=e.displayLabel,t.appendChild(a)}else t.disabled=!0,t.classList.add("is-disabled-slot"),t.setAttribute("aria-label","Nicht verfügbarer Ausstellungsplatz"),t.setAttribute("aria-disabled","true");const i=document.createElement("span");if(i.className="museum-hub__artwork-label",i.setAttribute("aria-hidden","true"),i.textContent=this.calibrating||this.debugGeometry?`${e.id} · ${e.displayLabel}`:e.displayLabel,t.appendChild(i),this.calibrating){const a=document.createElement("span");a.className="museum-hub__artwork-handle",a.setAttribute("aria-hidden","true"),t.appendChild(a),t.disabled=!1,t.addEventListener("pointerdown",o=>{const l=o.target;this.startSlotCalibrationDrag(o,e,t,l!=null&&l.classList.contains("museum-hub__artwork-handle")?"resize":"move")})}else e.selectable&&t.addEventListener("click",()=>this.handleSlotClick(e));this.applySlotGeometry(t,e);const s={slot:e,button:t,image:n,imageLoadToken:0,imageState:"idle",resolvedSource:null,fallbackReason:null,lastUpsertResult:null};return this.syncSlotRenderer(s),s}applySlotGeometry(e,t){var u,h,f;const n=this.resolution.wallById.get(t.placement.wallId);if(!n){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),(u=this.hubRoomRenderer)==null||u.setSlotHidden(t.id),e.style.width="0px",e.style.height="0px",e.style.clipPath="none",e.style.removeProperty("--hub-clip-path"),this.diagnostics.warn("hub-slot-missing-wall","Hub slot geometry skipped because the wall is missing",{slotId:t.id,wallId:t.placement.wallId});return}const i=Ci(n,t.placement,Math.max(.25,t.artworkAspect),this.resolution.stage);if(!i){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),(h=this.hubRoomRenderer)==null||h.setSlotHidden(t.id),e.style.width="0px",e.style.height="0px",e.style.clipPath="none",e.style.removeProperty("--hub-clip-path"),this.diagnostics.warn("hub-slot-projection-invalid","Hub slot projection is invalid and will not render interactively",{slotId:t.id,artworkId:t.artworkId,wallId:n.id,projectionRealism:n.projectionRealism});return}this.projectedSlotGeometry.set(t.id,i),e.classList.remove("is-invalid-geometry");const s=i.projectedQuad.reduce((g,v)=>({minX:Math.min(g.minX,v.x),maxX:Math.max(g.maxX,v.x),minY:Math.min(g.minY,v.y),maxY:Math.max(g.maxY,v.y)}),{minX:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY}),a=Math.max(1,s.maxX-s.minX),o=Math.max(1,s.maxY-s.minY),l=`polygon(${i.projectedQuad.map(g=>`${((g.x-s.minX)/a*100).toFixed(3)}% ${((g.y-s.minY)/o*100).toFixed(3)}%`).join(", ")})`;e.style.left=`${s.minX}px`,e.style.top=`${s.minY}px`,e.style.width=`${a}px`,e.style.height=`${o}px`,e.style.transform="none",e.style.clipPath=l,e.style.setProperty("--hub-clip-path",l);const c=(f=n.shadowVector)!=null?f:$(n.group==="left"?-10:10,16);e.style.setProperty("--hub-shadow-x",`${c.x}px`),e.style.setProperty("--hub-shadow-y",`${c.y}px`);const d=this.slotViews.find(g=>g.slot.id===t.id);d&&this.syncSlotRenderer(d),this.debugGeometry&&this.logSlotProjection(t,n,i)}syncSlotRenderer(e){var i,s;if(!this.hubRoomRenderer){e.lastUpsertResult=null;return}const t=this.resolution.wallById.get(e.slot.placement.wallId);if(!t)return;const n=e.imageState!=="ready"||!e.image||!e.image.complete||e.image.naturalWidth<=0;e.lastUpsertResult=this.hubRoomRenderer.upsertSlot(e.slot,t,e.image,n,(s=(i=e.resolvedSource)==null?void 0:i.resolvedUrlType)!=null?s:null)}applyAllSlotGeometry(){for(const e of this.slotViews)this.applySlotGeometry(e.button,e.slot);this.applySelectionState("geometry-refresh"),(this.calibrating||this.debugGeometry)&&this.renderCalibrationOverlay()}logSlotProjection(e,t,n){var a,o,l,c,d,u,h;const i=n.projectedQuad.map(f=>`${f.x.toFixed(1)},${f.y.toFixed(1)}`).join("|");if(this.debugProjectionSignatureBySlot.get(e.id)===i)return;this.debugProjectionSignatureBySlot.set(e.id,i);const s=n.projectedQuad.every(f=>ni(f,t.safePolygon));this.diagnostics.info("hub-debug-slot-projection","Projected slot geometry snapshot",{slotId:e.id,wallId:t.id,selectedArtworkId:this.selectedArtworkId,localAnchor:(a=e.placement.anchor)!=null?a:null,localQuad:n.localQuad,worldQuad:(o=n.worldQuad)!=null?o:null,projectedAnchor:(l=n.projectedAnchor)!=null?l:null,projectedQuad:n.projectedQuad,homography:t.homography,inverseHomography:t.inverseHomography,withinSafePolygon:s,shortEdgePx:Math.round(n.shortEdge*100)/100,placement:n.placement,validity:(c=n.validity)!=null?c:null,realism:(u=(d=n.realism)!=null?d:t.projectionRealism)!=null?u:null,alignment:(h=n.alignment)!=null?h:null})}emitDebugGeometrySnapshot(e){if(!this.debugGeometry)return;const t=this.slotViews.filter(({slot:n})=>n.selectable&&!!n.artworkId).map(({slot:n,imageState:i,resolvedSource:s,fallbackReason:a})=>{var c,d,u,h,f,g,v,m,p,S,y;const o=this.resolution.wallById.get(n.placement.wallId),l=this.projectedSlotGeometry.get(n.id);return{slotId:n.id,wallId:n.placement.wallId,imageState:i,sourceMode:(c=s==null?void 0:s.mode)!=null?c:null,sourceUrlType:(d=s==null?void 0:s.resolvedUrlType)!=null?d:null,bundleId:(u=s==null?void 0:s.bundleId)!=null?u:null,fallbackReason:a,localQuad:(h=l==null?void 0:l.localQuad)!=null?h:null,worldQuad:(f=l==null?void 0:l.worldQuad)!=null?f:null,projectedAnchor:(g=l==null?void 0:l.projectedAnchor)!=null?g:null,projectedQuad:(v=l==null?void 0:l.projectedQuad)!=null?v:null,homography:(m=o==null?void 0:o.homography)!=null?m:null,inverseHomography:(p=o==null?void 0:o.inverseHomography)!=null?p:null,withinSafePolygon:o&&l?l.projectedQuad.every(b=>ni(b,o.safePolygon)):!1,validity:(S=l==null?void 0:l.validity)!=null?S:null,alignment:(y=l==null?void 0:l.alignment)!=null?y:null}});this.diagnostics.info("hub-debug-geometry","Hub debug geometry snapshot",{reason:e,stage:this.resolution.stage,visualTokens:this.resolution.visualTokens,backgroundState:{imageError:this.element.classList.contains("has-image-error")},selection:{selectedArtworkId:this.selectedArtworkId,lastActivatedSlotId:this.lastActivatedSlotId},walls:this.resolution.walls.map(n=>({id:n.id,group:n.group,quad:n.quad,safePolygon:n.safePolygon,referenceQuad:n.referenceQuad,referenceSafePolygon:n.referenceSafePolygon,projectedQuad:n.projectedQuad,projectedSafePolygon:n.projectedSafePolygon,projectedDoorways:n.room&&n.camera?Kd(n.room,n.camera,this.resolution.stage):[],projectionRealism:n.projectionRealism,expectedConvergence:n.expectedConvergence})),slots:t})}scheduleIdlePageDecode(){if(this.disposed||this.idleDecodeHandle!==null)return;for(;this.idleDecodeNextPage<this.pageCount&&this.decodedPages.has(this.idleDecodeNextPage);)this.idleDecodeNextPage+=1;if(this.idleDecodeNextPage>=this.pageCount)return;const e=typeof window.requestIdleCallback=="function"?t=>window.requestIdleCallback(t,{timeout:4e3}):t=>window.setTimeout(t,600);this.idleDecodeHandle=e(()=>{if(this.idleDecodeHandle=null,this.disposed)return;const t=this.idleDecodeNextPage;this.idleDecodeNextPage+=1,this.decodePageImages(t).then(()=>this.scheduleIdlePageDecode())})}cancelIdlePageDecode(){this.idleDecodeHandle!==null&&(typeof window.cancelIdleCallback=="function"?window.cancelIdleCallback(this.idleDecodeHandle):window.clearTimeout(this.idleDecodeHandle),this.idleDecodeHandle=null)}decodePageImages(e){if(this.decodedPages.has(e))return Promise.resolve();this.decodedPages.add(e);const t=[];for(const n of this.slotViews)n.slot.pageIndex!==e||!n.image||!n.slot.artworkId||t.push(this.resolveSlotImage(n));return Promise.all(t).then(()=>{})}async resolveSlotImage(e){var h,f,g,v,m,p,S,y,b,U,P,E,L,M;const t=e.slot.artworkId&&(h=this.resolution.artworkSourceById.get(e.slot.artworkId))!=null?h:null,n=wi(t),i=zn(),s=U0({runtimeProtocol:i,resolvedUrlType:(g=(f=n.primary)==null?void 0:f.resolvedUrlType)!=null?g:null,debugEnabled:this.diagnostics.isDebugEnabled()},!!n.fallback),a=s&&n.fallback?n.fallback:n.primary,o=s?null:n.fallback,l=(a==null?void 0:a.mode)==="embedded-webgl-fallback",c=this.now();if(!a||!e.image||!e.slot.artworkId){this.setSlotImageState(e,"missing",null,"no-source"),this.diagnostics.warn("artwork-image-missing","Hub artwork image is unavailable; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:(m=(v=n.fallback)==null?void 0:v.bundleId)!=null?m:null,fallbackReason:"no-source"}),e.slot.artworkId&&vr(this.diagnostics,{route:"hub",artworkId:e.slot.artworkId,bundleId:(S=(p=n.fallback)==null?void 0:p.bundleId)!=null?S:null,runtimeProtocol:i,candidateMode:null,resolvedUrlType:null,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!1,result:"failed",firstFailedStage:"candidate-selected",failureReason:"no-source",elapsedMs:Math.round(this.now()-c),sourceWidth:null,sourceHeight:null,uploadWidth:null,uploadHeight:null,downscaleApplied:!1,rendererMaxTextureSize:(b=(y=this.hubRoomRenderer)==null?void 0:y.getMaxTextureSize())!=null?b:null,visibleProbe:null});return}this.setSlotImageState(e,"loading",null,null);const d=await this.loadSlotImageCandidate(e,a);if(d.status==="ready"){const _=this.applyResolvedSlotSource(e,a,null,"loaded",d);if(_.status==="ready"){this.recordHubSourceToPixelOutcome(e,{bundleId:a.bundleId,candidateMode:a.mode,resolvedUrlType:a.resolvedUrlType,usedEmbeddedFallback:l,attemptedEmbeddedFallback:l,startedAt:c});return}const I=`${a.mode}:${_.stage}:${_.reason}`,B=e.lastUpsertResult,F=xd({runtimeProtocol:i,resolvedUrlType:a.resolvedUrlType,debugEnabled:this.diagnostics.isDebugEnabled()},!!o);if(o&&F){this.diagnostics.warn("artwork-image-retry","Hub artwork source failed after GPU upload; retrying embedded fallback",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:I,visibleProbe:(U=B==null?void 0:B.visibleProbe)!=null?U:null});const N=await this.loadSlotImageCandidate(e,o);if(N.status==="ready"){const X=this.applyResolvedSlotSource(e,o,I,"fallback-loaded",N);if(X.status==="ready"){this.recordHubSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c});return}const Q=`${o.mode}:${X.stage}:${X.reason}`,q=e.lastUpsertResult;this.setSlotImageState(e,"missing",null,Q),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:Q,attemptedSources:[{sourceMode:a.mode,url:nt(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:nt(o.resolvedUrl),urlType:o.resolvedUrlType}],visibleProbe:(P=q==null?void 0:q.visibleProbe)!=null?P:null}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c,stage:X.stage,failureReason:Q,upsert:q});return}const Y=`${o.mode}:${N.reason}`;this.setSlotImageState(e,"missing",null,Y),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:Y,attemptedSources:[{sourceMode:a.mode,url:nt(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:nt(o.resolvedUrl),urlType:o.resolvedUrlType}]}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,startedAt:c,stage:this.slotAttemptFailureStage(N.reason),failureReason:Y,upsert:null});return}this.setSlotImageState(e,"missing",null,I),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:a.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:o?nt(o.resolvedUrl):null,declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:(E=o==null?void 0:o.resolvedUrlType)!=null?E:null,fallbackReason:I,attemptedSources:[{sourceMode:a.mode,url:nt(a.resolvedUrl),urlType:a.resolvedUrlType},...F&&o?[{sourceMode:o.mode,url:nt(o.resolvedUrl),urlType:o.resolvedUrlType}]:[]],visibleProbe:(L=B==null?void 0:B.visibleProbe)!=null?L:null}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:a.bundleId,candidateMode:a.mode,resolvedUrlType:a.resolvedUrlType,usedEmbeddedFallback:l,attemptedEmbeddedFallback:l,startedAt:c,stage:_.stage,failureReason:I,upsert:B});return}const u=`${a.mode}:${d.reason}`;if(o){this.diagnostics.warn("artwork-image-retry","Hub artwork source failed; retrying embedded fallback",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:u});const _=await this.loadSlotImageCandidate(e,o);if(_.status==="ready"){const B=this.applyResolvedSlotSource(e,o,u,"fallback-loaded",_);if(B.status==="ready"){this.recordHubSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c});return}const F=`${o.mode}:${B.stage}:${B.reason}`,N=e.lastUpsertResult;this.setSlotImageState(e,"missing",null,F),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:F,attemptedSources:[{sourceMode:a.mode,url:nt(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:nt(o.resolvedUrl),urlType:o.resolvedUrlType}],visibleProbe:(M=N==null?void 0:N.visibleProbe)!=null?M:null}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!0,attemptedEmbeddedFallback:!0,startedAt:c,stage:B.stage,failureReason:F,upsert:N});return}const I=`${o.mode}:${_.reason}`;this.setSlotImageState(e,"missing",null,I),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:o.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:nt(o.resolvedUrl),declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:o.resolvedUrlType,fallbackReason:I,attemptedSources:[{sourceMode:a.mode,url:nt(a.resolvedUrl),urlType:a.resolvedUrlType},{sourceMode:o.mode,url:nt(o.resolvedUrl),urlType:o.resolvedUrlType}]}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:o.bundleId,candidateMode:o.mode,resolvedUrlType:o.resolvedUrlType,usedEmbeddedFallback:!1,attemptedEmbeddedFallback:!0,startedAt:c,stage:this.slotAttemptFailureStage(_.reason),failureReason:I,upsert:null});return}this.setSlotImageState(e,"missing",null,u),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:a.bundleId,declaredImageUrl:nt(a.declaredUrl),fallbackImageUrl:null,declaredImageUrlType:a.declaredUrlType,fallbackImageUrlType:null,fallbackReason:u,attemptedSources:[{sourceMode:a.mode,url:nt(a.resolvedUrl),urlType:a.resolvedUrlType}]}),this.recordHubFailedSourceToPixelOutcome(e,{bundleId:a.bundleId,candidateMode:a.mode,resolvedUrlType:a.resolvedUrlType,usedEmbeddedFallback:l,attemptedEmbeddedFallback:l,startedAt:c,stage:this.slotAttemptFailureStage(d.reason),failureReason:u,upsert:null})}recordHubSourceToPixelOutcome(e,t){var i,s,a,o,l,c,d,u,h,f,g,v,m;if(!e.slot.artworkId)return;const n=e.lastUpsertResult;vr(this.diagnostics,{route:"hub",artworkId:e.slot.artworkId,bundleId:t.bundleId,runtimeProtocol:zn(),candidateMode:t.candidateMode,resolvedUrlType:t.resolvedUrlType,usedEmbeddedFallback:t.usedEmbeddedFallback,attemptedEmbeddedFallback:t.attemptedEmbeddedFallback,result:"success",firstFailedStage:null,failureReason:null,elapsedMs:Math.round(this.now()-t.startedAt),sourceWidth:(s=(i=n==null?void 0:n.fit)==null?void 0:i.sourceWidth)!=null?s:null,sourceHeight:(o=(a=n==null?void 0:n.fit)==null?void 0:a.sourceHeight)!=null?o:null,uploadWidth:(c=(l=n==null?void 0:n.fit)==null?void 0:l.targetWidth)!=null?c:null,uploadHeight:(u=(d=n==null?void 0:n.fit)==null?void 0:d.targetHeight)!=null?u:null,downscaleApplied:(f=(h=n==null?void 0:n.fit)==null?void 0:h.needsDownscale)!=null?f:!1,rendererMaxTextureSize:(v=(g=this.hubRoomRenderer)==null?void 0:g.getMaxTextureSize())!=null?v:null,visibleProbe:(m=n==null?void 0:n.visibleProbe)!=null?m:null})}recordHubFailedSourceToPixelOutcome(e,t){var n,i,s,a,o,l,c,d,u,h,f,g,v,m,p,S,y,b,U;e.slot.artworkId&&vr(this.diagnostics,{route:"hub",artworkId:e.slot.artworkId,bundleId:t.bundleId,runtimeProtocol:zn(),candidateMode:t.candidateMode,resolvedUrlType:t.resolvedUrlType,usedEmbeddedFallback:t.usedEmbeddedFallback,attemptedEmbeddedFallback:t.attemptedEmbeddedFallback,result:"failed",firstFailedStage:t.stage,failureReason:t.failureReason,elapsedMs:Math.round(this.now()-t.startedAt),sourceWidth:(s=(i=(n=t.upsert)==null?void 0:n.fit)==null?void 0:i.sourceWidth)!=null?s:null,sourceHeight:(l=(o=(a=t.upsert)==null?void 0:a.fit)==null?void 0:o.sourceHeight)!=null?l:null,uploadWidth:(u=(d=(c=t.upsert)==null?void 0:c.fit)==null?void 0:d.targetWidth)!=null?u:null,uploadHeight:(g=(f=(h=t.upsert)==null?void 0:h.fit)==null?void 0:f.targetHeight)!=null?g:null,downscaleApplied:(p=(m=(v=t.upsert)==null?void 0:v.fit)==null?void 0:m.needsDownscale)!=null?p:!1,rendererMaxTextureSize:(y=(S=this.hubRoomRenderer)==null?void 0:S.getMaxTextureSize())!=null?y:null,visibleProbe:(U=(b=t.upsert)==null?void 0:b.visibleProbe)!=null?U:null})}applyResolvedSlotSource(e,t,n,i,s){this.setSlotImageState(e,"ready",t,n);const a=this.getSlotRenderFailure(e);return a?{status:"failed",...a}:(this.diagnostics.info("artwork-source-resolved","Hub artwork source resolved",{slotId:e.slot.id,artworkId:e.slot.artworkId,bundleId:t.bundleId,sourceMode:t.mode,declaredImageUrl:nt(t.declaredUrl),resolvedImageUrl:nt(t.resolvedUrl),declaredImageUrlType:t.declaredUrlType,resolvedImageUrlType:t.resolvedUrlType,requestStatus:i,decodeStatus:"decoded",textureWidth:s.width,textureHeight:s.height,fallbackReason:n}),{status:"ready"})}getSlotRenderFailure(e){var n,i,s;const t=(n=e.lastUpsertResult)==null?void 0:n.failureStage;return t?{stage:t,reason:(s=(i=e.lastUpsertResult)==null?void 0:i.failureReason)!=null?s:"unknown-failure"}:null}slotAttemptFailureStage(e){return e==="decode-error"||e==="decode-timeout"?"decode":e==="no-source"?"candidate-selected":"request"}now(){return typeof performance!="undefined"?performance.now():Date.now()}setSlotImageState(e,t,n,i){e.imageState=t,e.resolvedSource=n,e.fallbackReason=i,e.button.classList.toggle("has-missing-image",t==="missing"),e.button.dataset.artworkSourceState=t,n?(e.button.dataset.artworkSourceMode=n.mode,e.button.dataset.artworkUrlType=n.resolvedUrlType):(delete e.button.dataset.artworkSourceMode,delete e.button.dataset.artworkUrlType),i?e.button.dataset.artworkFallbackReason=i:delete e.button.dataset.artworkFallbackReason,this.syncSlotRenderer(e)}async loadSlotImageCandidate(e,t){if(!e.image)return{status:"failed",reason:"no-source"};const n=++e.imageLoadToken,i=e.image,s=t.resolvedUrlType==="data-uri"?fx:cl,a=await new Promise(l=>{let c=!1;const d=g=>{c||(c=!0,window.clearTimeout(f),i.removeEventListener("load",u),i.removeEventListener("error",h),l(g))},u=()=>d("loaded"),h=()=>d("error"),f=window.setTimeout(()=>d("timeout"),s);i.addEventListener("load",u),i.addEventListener("error",h),i.src=t.resolvedUrl,i.complete&&i.naturalWidth>0&&d("loaded")});if(n!==e.imageLoadToken)return{status:"failed",reason:"load-timeout"};if(a==="error")return{status:"failed",reason:"load-error"};if(a==="timeout")return{status:"failed",reason:"load-timeout"};if(i.naturalWidth<=0||i.naturalHeight<=0)return{status:"failed",reason:"load-error"};const o=await this.decodeSlotImage(i,s);return o!=="decoded"?{status:"failed",reason:o==="timeout"?"decode-timeout":"decode-error"}:{status:"ready",width:i.naturalWidth,height:i.naturalHeight}}async decodeSlotImage(e,t=cl){return typeof e.decode!="function"?"decoded":new Promise(n=>{let i=!1;const s=o=>{i||(i=!0,window.clearTimeout(a),n(o))},a=window.setTimeout(()=>s("timeout"),t);e.decode().then(()=>s("decoded"),()=>s("error"))})}handleSlotClick(e){var t;this.entryButton.disabled||(this.setButtonsDisabled(!0),this.lastActivatedSlotId=e.id,this.setSelectedArtworkId(e.artworkId,{alignPage:!1,source:"slot-click"}),this.status.textContent="Ausstellung wird geöffnet.",(t=this.selectSlotCallback)==null||t.call(this,e))}get viewCount(){return this.narrowMode?this.pageCount*un.NARROW_VIEWS_PER_PAGE:this.pageCount}stepView(e){const t=this.viewIndex+e;t<0||t>=this.viewCount||(this.viewIndex=t,this.applyView())}goToPage(e,t){var n;if(this.narrowMode){const i=Math.max(0,un.NARROW_WALL_ORDER.indexOf((n=t==null?void 0:t.wallGroup)!=null?n:"front"));this.viewIndex=e*un.NARROW_VIEWS_PER_PAGE+i}else this.viewIndex=e;this.applyView()}applyView(e=!1){var s,a;if(this.disposed)return;this.viewIndex=Math.max(0,Math.min(this.viewCount-1,this.viewIndex));const t=this.narrowMode?Math.floor(this.viewIndex/un.NARROW_VIEWS_PER_PAGE):this.viewIndex,n=this.narrowMode?un.NARROW_WALL_ORDER[this.viewIndex%un.NARROW_VIEWS_PER_PAGE]:"full";(s=this.hubRoomRenderer)==null||s.setActivePage(t);for(const o of this.roomLayers){const l=Number.parseInt((a=o.dataset.page)!=null?a:"0",10);o.classList.toggle("is-active",l===t)}this.element.dataset.wallFocus=n,n==="full"?(this.visual.style.setProperty("--hub-focus-scale","1"),this.visual.style.setProperty("--hub-focus-x","0%")):n==="front"?(this.visual.style.setProperty("--hub-focus-scale","1.45"),this.visual.style.setProperty("--hub-focus-x","0%")):(this.visual.style.setProperty("--hub-focus-scale","1.9"),this.visual.style.setProperty("--hub-focus-x",n==="left"?"24%":"-24%"));for(const o of this.slotViews)o.button.classList.toggle("is-off-wall",n!=="full"&&o.slot.wallGroup!==n);const i=this.viewCount>1;if(this.pager.hidden=!i,i){this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1;const o=n==="front"?"Frontwand":n==="left"?"Linke Wand":"Rechte Wand";this.pagerCounter.textContent=this.narrowMode?`Raum ${t+1}/${this.pageCount} · ${o}`:`Raum ${t+1} / ${this.pageCount}`}this.applySelectionState(e?"initial-view":"view-change"),e||this.decodePageImages(t)}updateStageScale(){const e=this.visual.getBoundingClientRect();if(e.width<=0||e.height<=0)return;const t=Math.min(e.width/this.stageWidth,e.height/this.stageHeight);this.element.style.setProperty("--hub-stage-scale",String(t))}buildCalibrationOverlay(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.classList.add("museum-hub__calibration-svg"),e.setAttribute("viewBox",`0 0 ${this.stageWidth} ${this.stageHeight}`),e.setAttribute("aria-hidden","true"),this.stage.appendChild(e),this.calibrationSvg=e}buildCalibrationPanel(e){const t=document.createElement("div");t.className="museum-hub__calibration";const n=document.createElement("h2");n.className="museum-hub__calibration-title",n.textContent="Artwork Placement Editor";const i=document.createElement("p");i.className="museum-hub__calibration-intro",i.textContent="Platzieren Sie Ihre Kunstwerke direkt im Museum.";const s=document.createElement("ol");s.className="museum-hub__calibration-steps";for(const I of["Wand und Kunstwerk auswählen.","Bild ziehen; roten Eckgriff zum Skalieren ziehen.","Grüne Wandfläche prüfen und bestätigen.","Wenn alle Prüfungen grün sind: Konfiguration herunterladen."]){const B=document.createElement("li");B.textContent=I,s.appendChild(B)}const a=document.createElement("p");a.className="museum-hub__calibration-help",a.textContent="Tipp: Pfeiltasten verschieben fein, Umschalt + Pfeiltaste verschiebt schneller. Rot bedeutet: Position noch ungültig.";const o=document.createElement("div");o.className="museum-hub__calibration-controls";const l=document.createElement("label");l.className="museum-hub__calibration-label",l.textContent="1. Wand auswählen";const c=document.createElement("select");c.className="museum-hub__calibration-select";for(const I of this.resolution.walls){const B=document.createElement("option");B.value=I.id,B.textContent=`${I.id} (${I.group})`,c.appendChild(B)}this.activeCalibrationWallId&&(c.value=this.activeCalibrationWallId),c.addEventListener("change",()=>{this.activeCalibrationWallId=c.value,this.renderCalibrationOverlay()}),l.appendChild(c);const d=document.createElement("label");d.className="museum-hub__calibration-label",d.textContent="2. Kunstwerk auswählen";const u=document.createElement("select");u.className="museum-hub__calibration-select";for(const{slot:I}of this.slotViews){if(!I.artworkId)continue;const B=document.createElement("option");B.value=I.id,B.textContent=`${I.displayLabel} · ${I.placement.wallId}`,u.appendChild(B)}this.activeCalibrationSlotId=u.value||null,u.addEventListener("change",()=>this.selectCalibrationSlot(u.value)),d.appendChild(u);const h=document.createElement("div");h.className="museum-hub__calibration-numeric-grid";const f=[["horizontalPosition","Position links/rechts",0,1,.001],["centerHeight","Höhe der Bildmitte (m)",0,8,.01],["physicalHeight","Bildgröße/Höhe (m)",.04,8,.01],["mountingGap","Abstand zur Wand (m)",.001,.03,.001]];for(const[I,B,F,N,Y]of f){const X=document.createElement("label");X.className="museum-hub__calibration-number",X.textContent=B;const Q=document.createElement("input");Q.type="number",Q.min=String(F),Q.max=String(N),Q.step=String(Y),Q.addEventListener("change",()=>this.applyCalibrationNumber(I,Q.valueAsNumber)),X.appendChild(Q),h.appendChild(X),this.calibrationFields.set(I,Q)}const g=document.createElement("div");g.className="museum-hub__calibration-actions";const v=(I,B,F=g)=>{const N=document.createElement("button");return N.type="button",N.className="museum-hub__calibration-action",N.textContent=I,N.addEventListener("click",B),F.appendChild(N),N},m=v("Zwischen Grenzen zentrieren",()=>this.centerActiveSlotInMountingZone());m.title="Zentriert den vollständigen Bildkörper im gültigen Wandpolygon.",v("Grüne Wandfläche bestätigen",()=>this.confirmActiveMountingZone()),this.calibrationUndoButton=v("Rückgängig",()=>this.undoCalibration()),this.calibrationRedoButton=v("Wiederholen",()=>this.redoCalibration()),v("Ausgangszustand",()=>this.resetCalibration());const p=document.createElement("button");p.type="button",p.className="museum-hub__calibration-restore",p.textContent="Letzte gültige Konfiguration wiederherstellen",p.disabled=!0,p.addEventListener("click",()=>this.restoreLastValidCalibrationSnapshot()),o.append(l,d,h,g,p);const S=document.createElement("p");S.className="museum-hub__calibration-label",S.textContent="3. Automatische Prüfung";const y=document.createElement("ul");y.className="museum-hub__calibration-warnings";const b=document.createElement("textarea");b.className="museum-hub__calibration-output",b.readOnly=!0,b.rows=16,b.setAttribute("aria-label","Museum-Hub-Konfiguration als JSON");const U=document.createElement("div");U.className="museum-hub__calibration-actions",this.calibrationCopyButton=v("JSON kopieren",()=>void this.copyCalibrationJson(),U),this.calibrationDownloadButton=v("4. Konfiguration herunterladen",()=>this.downloadCalibrationJson(),U);const P=document.createElement("p");P.className="museum-hub__calibration-action-status",P.setAttribute("role","status"),P.setAttribute("aria-live","polite");const E=document.createElement("label");E.className="museum-hub__calibration-import",E.textContent="Vorhandene Konfiguration öffnen";const L=document.createElement("input");L.type="file",L.accept="application/json,.json",L.addEventListener("change",()=>{var I,B;return void this.importCalibrationFile((B=(I=L.files)==null?void 0:I[0])!=null?B:null)}),E.appendChild(L);const M=document.createElement("details");M.className="museum-hub__calibration-advanced";const _=document.createElement("summary");_.textContent="Technische JSON-Ansicht",M.append(_,b),t.append(n,i,s,a,o,S,y,U,P,E,M),e.appendChild(t),this.calibrationOutput=b,this.calibrationWarnings=y,this.calibrationActionStatus=P,this.calibrationRestoreButton=p,this.calibrationWallSelect=c,this.calibrationSlotSelect=u,this.initialCalibrationSnapshot=JSON.stringify(this.buildCurrentCalibrationConfig(),null,2),this.activeCalibrationSlotId?this.selectCalibrationSlot(this.activeCalibrationSlotId):this.syncCalibrationControls()}startSlotCalibrationDrag(e,t,n,i){e.preventDefault(),this.selectCalibrationSlot(t.id),this.recordCalibrationHistory(),this.calibrationDrag={kind:"slot",slot:t,button:n,pointerId:e.pointerId,mode:i},n.setPointerCapture(e.pointerId),n.addEventListener("pointermove",this.handleCalibrationMove),n.addEventListener("pointerup",this.handleCalibrationEnd),n.addEventListener("pointercancel",this.handleCalibrationEnd)}startWallPointCalibrationDrag(e,t,n,i){e.preventDefault(),this.recordCalibrationHistory();const s=e.currentTarget;this.calibrationDrag={kind:"wall-point",wallId:t,pointerId:e.pointerId,target:n,index:i},s.setPointerCapture(e.pointerId),s.addEventListener("pointermove",this.handleCalibrationMove),s.addEventListener("pointerup",this.handleCalibrationEnd),s.addEventListener("pointercancel",this.handleCalibrationEnd)}pointerEventToStage(e){const t=this.visual.getBoundingClientRect();return t.width<=0||t.height<=0?null:$(Math.min(this.stageWidth,Math.max(0,(e.clientX-t.left)/t.width*this.stageWidth)),Math.min(this.stageHeight,Math.max(0,(e.clientY-t.top)/t.height*this.stageHeight)))}renderCalibrationOverlay(){if(!this.calibrationSvg)return;this.calibrationSvg.replaceChildren();const e=this.activeCalibrationWallId;for(const t of this.resolution.walls){const n=this.calibrating?t.id===e:!0,i=document.createElementNS("http://www.w3.org/2000/svg","polygon");i.setAttribute("points",this.pointsToSvg(t.quad)),i.setAttribute("class",`museum-hub__calibration-wall${n?" is-active":""}`),this.calibrationSvg.appendChild(i);const s=document.createElementNS("http://www.w3.org/2000/svg","polygon");s.setAttribute("points",this.pointsToSvg(t.safePolygon)),s.setAttribute("class",`museum-hub__calibration-safe${n?" is-active":""}`),this.calibrationSvg.appendChild(s);const a=document.createElementNS("http://www.w3.org/2000/svg","polygon");a.setAttribute("points",this.pointsToSvg(t.mountingZone)),a.setAttribute("class",`museum-hub__calibration-mounting-zone${n?" is-active":""}${t.mountingZoneConfirmed?" is-confirmed":" is-unconfirmed"}`),this.calibrationSvg.appendChild(a),this.debugGeometry&&(this.renderProjectedDoorwayDebugOverlay(t),this.renderWallDebugAxes(t)),!(!this.calibrating||!n)&&(t.safePolygon.forEach((o,l)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"safe",l,o,"museum-hub__calibration-handle museum-hub__calibration-handle--safe"))),t.mountingZone.forEach((o,l)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"mounting-zone",l,o,"museum-hub__calibration-handle museum-hub__calibration-handle--mounting-zone"))))}this.debugGeometry&&(this.renderCameraDebugGuides(),this.renderProjectedSlotDebugOverlay())}createCalibrationHandle(e,t,n,i,s){const a=document.createElementNS("http://www.w3.org/2000/svg","circle");return a.setAttribute("class",s),a.setAttribute("cx",i.x.toFixed(2)),a.setAttribute("cy",i.y.toFixed(2)),a.setAttribute("r","8"),a.addEventListener("pointerdown",o=>this.startWallPointCalibrationDrag(o,e,t,n)),a}renderWallDebugAxes(e){if(!this.calibrationSvg||!e.homography)return;const t=Ti(e.homography,.1,.1),n=Ti(e.homography,.28,.1),i=Ti(e.homography,.1,.28);if(!t||!n||!i)return;this.appendSvgLine(t,n,"museum-hub__debug-axis museum-hub__debug-axis--x"),this.appendSvgLine(t,i,"museum-hub__debug-axis museum-hub__debug-axis--y"),this.appendSvgCircle(t,"museum-hub__debug-origin",3.8);const s=e.projectionRealism,a=s?`${e.id} · ref ${s.referenceResidualMaxPx.toFixed(1)}px · ${s.projectedConvergence}`:e.id;this.appendSvgLabel($(t.x+8,t.y-8),a,"museum-hub__debug-wall-label")}renderProjectedDoorwayDebugOverlay(e){if(!(!this.calibrationSvg||!e.room||!e.camera))for(const t of Kd(e.room,e.camera,this.resolution.stage)){const n=document.createElementNS("http://www.w3.org/2000/svg","polygon");n.setAttribute("points",this.pointsToSvg(t)),n.setAttribute("class","museum-hub__debug-doorway"),this.calibrationSvg.appendChild(n)}}renderProjectedSlotDebugOverlay(){var e;if(this.calibrationSvg)for(const{slot:t}of this.slotViews){if(!t.selectable||!t.artworkId)continue;const n=this.resolution.wallById.get(t.placement.wallId),i=this.projectedSlotGeometry.get(t.id);if(!n||!i||!n.homography)continue;const s=Ti(n.homography,t.placement.center.x,t.placement.center.y);this.calibrationSvg.appendChild(this.createProjectedQuadElement(i.projectedQuad)),s&&this.appendSvgCircle(s,"museum-hub__debug-slot-center",3.2),i.projectedQuad.forEach(o=>this.appendSvgCircle(o,"museum-hub__debug-slot-corner",2.8));const a=i.projectedQuad[0];if(a){const o=t.placement.anchor?`L ${t.placement.anchor.x.toFixed(2)},${t.placement.anchor.y.toFixed(2)}`:`L ${t.placement.center.x.toFixed(2)},${t.placement.center.y.toFixed(2)}`,l=s?`S ${s.x.toFixed(0)},${s.y.toFixed(0)}`:"S –",c=i.projectedAnchor?`P ${i.projectedAnchor.x.toFixed(0)},${i.projectedAnchor.y.toFixed(0)}`:"P –",d=t.artworkId&&t.artworkId===this.selectedArtworkId?"selected":"idle";this.appendSvgLabel($(a.x+8,a.y-8),`${t.id} · ${t.placement.wallId} · ${d} · ${o} · ${l} · ${c} · ${(e=i.validity)!=null&&e.contained&&i.validity.doorwayClear&&i.validity.inHangingBand?"valid":"invalid"}`,"museum-hub__debug-slot-label")}}}renderCameraDebugGuides(){const e=this.resolution.camera,t=Mr(e,{x:e.target.x,y:e.target.y,z:e.target.z-24},this.resolution.stage);t&&(this.appendSvgLine($(0,t.y),$(this.stageWidth,t.y),"museum-hub__debug-horizon"),this.appendSvgLabel($(12,Math.max(18,t.y-8)),"camera horizon","museum-hub__debug-camera-label"));for(const n of this.resolution.walls){if(!n.room)continue;const i=$(n.room.width/2,n.room.height/2),s=l=>({x:n.room.origin.x+n.room.axisU.x*l+n.room.axisV.x*i.y,y:n.room.origin.y+n.room.axisU.y*l+n.room.axisV.y*i.y,z:n.room.origin.z+n.room.axisU.z*l+n.room.axisV.z*i.y}),a=Mr(e,s(i.x),this.resolution.stage),o=Mr(e,s(i.x+40),this.resolution.stage);a&&o&&this.appendSvgLine(a,o,"museum-hub__debug-vanishing")}}createProjectedQuadElement(e){const t=document.createElementNS("http://www.w3.org/2000/svg","polygon");return t.setAttribute("points",this.pointsToSvg(e)),t.setAttribute("class","museum-hub__debug-slot-quad"),t}appendSvgLine(e,t,n){if(!this.calibrationSvg)return;const i=document.createElementNS("http://www.w3.org/2000/svg","line");i.setAttribute("class",n),i.setAttribute("x1",e.x.toFixed(2)),i.setAttribute("y1",e.y.toFixed(2)),i.setAttribute("x2",t.x.toFixed(2)),i.setAttribute("y2",t.y.toFixed(2)),this.calibrationSvg.appendChild(i)}appendSvgCircle(e,t,n){if(!this.calibrationSvg)return;const i=document.createElementNS("http://www.w3.org/2000/svg","circle");i.setAttribute("class",t),i.setAttribute("cx",e.x.toFixed(2)),i.setAttribute("cy",e.y.toFixed(2)),i.setAttribute("r",n.toFixed(1)),this.calibrationSvg.appendChild(i)}appendSvgLabel(e,t,n){if(!this.calibrationSvg)return;const i=document.createElementNS("http://www.w3.org/2000/svg","text");i.setAttribute("class",n),i.setAttribute("x",e.x.toFixed(2)),i.setAttribute("y",e.y.toFixed(2)),i.textContent=t,this.calibrationSvg.appendChild(i)}pointsToSvg(e){return e.map(t=>`${t.x.toFixed(2)},${t.y.toFixed(2)}`).join(" ")}applyInverseHomography(e,t){if(!e.inverseHomography)return null;const[n,i,s,a,o,l,c,d,u]=e.inverseHomography,h=c*t.x+d*t.y+u;return Math.abs(h)<=1e-6?null:$((n*t.x+i*t.y+s)/h,(a*t.x+o*t.y+l)/h)}clampLocalX(e){return Math.min(1,Math.max(0,e))}clampLocalY(e){return Math.min(1,Math.max(0,e))}collectCalibrationWarnings(){var n,i;const e=[];for(const s of this.resolution.walls)(_r(s.quad)||!Ei(s.quad))&&e.push(`Wand ${s.id}: Die Wandfläche ist ungültig.`),s.safePolygon.length<3&&e.push(`Wand ${s.id}: Der Sicherheitsbereich benötigt mindestens drei Punkte.`),s.mountingZone.length<3?e.push(`Wand ${s.id}: Die grüne Wandfläche benötigt mindestens drei Punkte.`):(s.mountingZone.length!==4||_r(s.mountingZone)||!Ei(s.mountingZone))&&e.push(`Wand ${s.id}: Die grüne Wandfläche darf sich nicht überkreuzen.`),s.mountingZoneConfirmed||e.push(`Wand ${s.id}: Grüne Wandfläche ausrichten und bestätigen.`);const t=new Map;for(const s of this.slotViews){const{slot:a}=s;if(!a.selectable||!a.artworkId)continue;const o=this.resolution.wallById.get(a.placement.wallId);if(!o){e.push(`Bild ${a.id}: Zugewiesene Wand ${a.placement.wallId} fehlt.`);continue}const l=this.calibrationWallOwnership.get(a.id);l&&a.placement.wallId!==l&&e.push(`Bild ${a.id}: Wandzuordnung wurde von ${l} zu ${a.placement.wallId} geändert.`);const c=Ci(o,a.placement,a.artworkAspect,this.resolution.stage);if(!c){e.push(`Bild ${a.id}: Position kann nicht berechnet werden.`);continue}c.projectedQuad.every(u=>ni(u,o.mountingZone))||e.push(`Bild ${a.id}: Das vollständige Bild liegt außerhalb der grünen Wandfläche.`),(n=c.validity)!=null&&n.doorwayClear||e.push(`Bild ${a.id}: Das Bild überschneidet einen Türbereich.`),c.shortEdge<ga&&e.push(`Bild ${a.id}: Die sichtbare Kante (${c.shortEdge.toFixed(1)} px) ist kleiner als ${ga} px.`);const d=(i=t.get(a.pageIndex))!=null?i:[];d.push({slot:a,quad:c}),t.set(a.pageIndex,d)}for(const[s,a]of t)for(let o=0;o<a.length;o+=1){const l=a[o];for(let c=o+1;c<a.length;c+=1){const d=a[c];Vo(l.quad.projectedQuad,d.quad.projectedQuad)&&e.push(`Raum ${s+1}: ${l.slot.id} überschneidet ${d.slot.id}.`)}}return e}collectCalibrationProofs(){const e=[],t=(n,i,s)=>{const a=s.x-i.x,o=s.y-i.y,l=a*a+o*o;if(l<=1e-9)return Math.hypot(n.x-i.x,n.y-i.y);const c=Math.max(0,Math.min(1,((n.x-i.x)*a+(n.y-i.y)*o)/l));return Math.hypot(n.x-(i.x+a*c),n.y-(i.y+o*c))};for(const{slot:n}of this.slotViews){if(!n.selectable||!n.artworkId)continue;const i=this.resolution.wallById.get(n.placement.wallId),s=i?Ci(i,n.placement,n.artworkAspect,this.resolution.stage):null;if(!(i!=null&&i.room)||!s)continue;const a=Math.min(...s.projectedQuad.flatMap(d=>i.mountingZone.map((u,h)=>t(d,u,i.mountingZone[(h+1)%i.mountingZone.length])))),o=s.localQuad.map(d=>d.x),l=Math.min(Math.min(...o),i.room.width-Math.max(...o))/Math.max(.001,i.localCalibrationScale.x),c=i.room.doorwayExclusions.length===0?null:Math.min(...i.room.doorwayExclusions.map(d=>{const u=d.map(m=>m.x),h=Math.min(...o),f=Math.max(...o),g=Math.min(...u),v=Math.max(...u);return Math.max(0,f<=g?g-f:h-v)/Math.max(.001,i.localCalibrationScale.x)}));e.push(`✓ ${n.displayLabel}: ${i.id}; mounting-zone ${a.toFixed(1)} px; corner ${l.toFixed(2)} m`+(c===null?"":`; doorway ${c.toFixed(2)} m`))}return e}buildCurrentCalibrationConfig(){return{version:5,coverage:"all-active-artworks",stage:this.resolution.stage,background:this.resolution.background,backgroundFallback:this.resolution.backgroundFallback,visualTokens:this.resolution.visualTokens,camera:this.resolution.camera,room:{dimensions:this.resolution.room.dimensions,floorY:this.resolution.room.floorY,ceilingY:this.resolution.room.ceilingY,wallThickness:this.resolution.room.wallThickness,floorOutline:this.resolution.room.floorOutline.map(e=>({x:this.round(e.x),z:this.round(e.z)}))},hangingRules:this.resolution.hangingRules,walls:this.resolution.configuredWalls.map(e=>{const t=this.resolution.wallById.get(e.id);return t?{id:t.id,group:t.group,...e.role?{role:e.role}:{},planeAspect:Math.round(t.planeAspect*1e3)/1e3,quad:t.quad.map(n=>this.roundPoint(n)),safePolygon:t.safePolygon.map(n=>this.roundPoint(n)),mountingZone:t.mountingZone.map(n=>this.roundPoint(n)),mountingZoneConfirmed:t.mountingZoneConfirmed,...t.shadowVector?{shadowVector:this.roundPoint(t.shadowVector)}:{},...t.room?{room:{origin:t.room.origin,axisU:t.room.axisU,axisV:t.room.axisV,width:t.room.width,height:t.room.height,safePolygon:t.room.safePolygon.map(n=>this.roundPoint(n)),doorwayExclusions:t.room.doorwayExclusions.map(n=>n.map(i=>this.roundPoint(i))),hangingBand:t.room.hangingBand}}:{},...t.transform?{transform:t.transform}:{},...t.drawableRegion?{drawableRegion:t.drawableRegion}:{},...t.exclusionPolygons?{exclusionPolygons:t.exclusionPolygons}:{},...t.hangingBand?{hangingBand:t.hangingBand}:{}}:e}),fallbacks:this.resolution.fallbacks,slotsPerPage:this.resolution.slotsPerPage,slots:this.slotViews.map(({slot:e})=>{var t,n,i,s,a,o,l,c;return{id:e.id,enabled:e.disabledReason!=="explicitly-disabled",selectable:e.selectable,...e.artworkId?{artworkId:e.artworkId}:{},placement:{wallId:e.placement.wallId,horizontalPosition:this.round((i=(n=e.placement.horizontalPosition)!=null?n:(t=e.placement.uv)==null?void 0:t.x)!=null?i:0),centerHeight:this.round((o=(a=e.placement.centerHeight)!=null?a:(s=e.placement.anchor)==null?void 0:s.y)!=null?o:0),physicalHeight:this.round((l=e.placement.physicalHeight)!=null?l:e.placement.mountedHeight),mountingGap:this.round((c=e.placement.mountingGap)!=null?c:.002),...e.placement.targetSizePolicy?{targetSizePolicy:e.placement.targetSizePolicy}:{},...e.placement.minScale!==void 0?{minScale:e.placement.minScale}:{},...e.placement.maxScale!==void 0?{maxScale:e.placement.maxScale}:{},...e.placement.zOffset!==void 0?{zOffset:e.placement.zOffset}:{},...e.placement.provisional!==void 0?{provisional:e.placement.provisional}:{}}}})}}get activeCalibrationSlot(){var e,t;return(t=(e=this.slotViews.find(({slot:n})=>n.id===this.activeCalibrationSlotId))==null?void 0:e.slot)!=null?t:null}selectCalibrationSlot(e){const t=this.slotViews.find(({slot:n})=>n.id===e);if(t){this.activeCalibrationSlotId=e,this.activeCalibrationWallId=t.slot.placement.wallId,this.calibrationSlotSelect&&(this.calibrationSlotSelect.value=e),this.calibrationWallSelect&&(this.calibrationWallSelect.value=t.slot.placement.wallId);for(const n of this.slotViews)n.button.classList.toggle("is-calibration-selected",n.slot.id===e);this.syncCalibrationControls(),this.renderCalibrationOverlay()}}syncCanonicalPlacement(e,t){var i,s,a,o,l,c,d;if(!t.room)return;const n=(a=e.placement.uv)!=null?a:$((i=e.placement.horizontalPosition)!=null?i:e.placement.center.x,((s=e.placement.centerHeight)!=null?s:t.room.height/2)/t.room.height);e.placement.uv=$(this.clampLocalX(n.x),this.clampLocalY(n.y)),e.placement.anchor=$(e.placement.uv.x*t.room.width,e.placement.uv.y*t.room.height),e.placement.center=$(e.placement.uv.x,1-e.placement.uv.y),e.placement.horizontalPosition=e.placement.uv.x,e.placement.centerHeight=e.placement.anchor.y,(l=(o=e.placement).physicalHeight)!=null||(o.physicalHeight=e.placement.mountedHeight),e.placement.mountedHeight=e.placement.physicalHeight,(d=(c=e.placement).mountingGap)!=null||(c.mountingGap=.002)}setSlotCenterClampedToMountingZone(e,t,n){if(!t.room)return!1;const i={center:it(e.placement.center),uv:e.placement.uv?it(e.placement.uv):void 0,anchor:e.placement.anchor?it(e.placement.anchor):void 0},s=d=>{var h;e.placement.center=$(this.clampLocalX(d.x),this.clampLocalY(d.y)),e.placement.uv=$(e.placement.center.x,1-e.placement.center.y),this.syncCanonicalPlacement(e,t);const u=Ci(t,e.placement,e.artworkAspect,this.resolution.stage);return!!(u&&((h=u.validity)!=null&&h.doorwayClear)&&u.projectedQuad.every(f=>ni(f,t.mountingZone)))};if(s(n))return!0;const a=t.mountingZone.reduce((d,u)=>$(d.x+u.x,d.y+u.y),$(0,0));a.x/=Math.max(1,t.mountingZone.length),a.y/=Math.max(1,t.mountingZone.length);const o=this.applyInverseHomography(t,a);if(!o||!s(o))return e.placement.center=i.center,e.placement.uv=i.uv,e.placement.anchor=i.anchor,this.syncCanonicalPlacement(e,t),!1;let l=0,c=1;for(let d=0;d<16;d+=1){const u=(l+c)/2,h=$(n.x+(o.x-n.x)*u,n.y+(o.y-n.y)*u);s(h)?c=u:l=u}return s($(n.x+(o.x-n.x)*c,n.y+(o.y-n.y)*c))}syncCalibrationControls(){var i,s,a,o,l,c;const e=this.activeCalibrationSlot,t=e?this.resolution.wallById.get(e.placement.wallId):null;e&&t&&this.syncCanonicalPlacement(e,t);const n={horizontalPosition:(i=e==null?void 0:e.placement.horizontalPosition)!=null?i:0,centerHeight:(s=e==null?void 0:e.placement.centerHeight)!=null?s:0,physicalHeight:(a=e==null?void 0:e.placement.physicalHeight)!=null?a:0,mountingGap:(o=e==null?void 0:e.placement.mountingGap)!=null?o:.002};for(const[d,u]of this.calibrationFields)u.value=(c=(l=n[d])==null?void 0:l.toFixed(d==="mountingGap"?3:2))!=null?c:"",u.disabled=!e;this.calibrationUndoButton&&(this.calibrationUndoButton.disabled=this.calibrationUndoStack.length===0),this.calibrationRedoButton&&(this.calibrationRedoButton.disabled=this.calibrationRedoStack.length===0)}applyCalibrationNumber(e,t){const n=this.activeCalibrationSlot;if(!n||!Number.isFinite(t))return;const i=this.resolution.wallById.get(n.placement.wallId);i!=null&&i.room&&(this.recordCalibrationHistory(),e==="horizontalPosition"?this.setSlotCenterClampedToMountingZone(n,i,$(this.clampLocalX(t),n.placement.center.y)):e==="centerHeight"?this.setSlotCenterClampedToMountingZone(n,i,$(n.placement.center.x,1-this.clampLocalY(t/i.room.height))):e==="physicalHeight"?(n.placement.physicalHeight=Math.max(.04,Math.min(i.room.height,t)),n.placement.mountedHeight=n.placement.physicalHeight):e==="mountingGap"&&(n.placement.mountingGap=Math.max(.001,Math.min(.03,t))),this.syncCanonicalPlacement(n,i),this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0),this.syncCalibrationControls())}centerActiveSlotInMountingZone(){const e=this.activeCalibrationSlot;if(!e)return;const t=this.resolution.wallById.get(e.placement.wallId);if(!t||t.mountingZone.length<3)return;const n=t.mountingZone.reduce((s,a)=>$(s.x+a.x,s.y+a.y),$(0,0));n.x/=t.mountingZone.length,n.y/=t.mountingZone.length;const i=this.applyInverseHomography(t,n);i&&(this.recordCalibrationHistory(),this.setSlotCenterClampedToMountingZone(e,t,$(this.clampLocalX(i.x),this.clampLocalY(i.y))),this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0),this.syncCalibrationControls())}confirmActiveMountingZone(){const e=this.activeCalibrationWallId?this.resolution.wallById.get(this.activeCalibrationWallId):null;e&&(this.recordCalibrationHistory(),e.mountingZoneConfirmed=!0,this.updateCalibrationOutput(!0),this.renderCalibrationOverlay(),this.syncCalibrationControls())}recordCalibrationHistory(){const e=JSON.stringify(this.buildCurrentCalibrationConfig(),null,2);this.calibrationUndoStack[this.calibrationUndoStack.length-1]!==e&&this.calibrationUndoStack.push(e),this.calibrationUndoStack.length>50&&this.calibrationUndoStack.shift(),this.calibrationRedoStack=[],this.syncCalibrationControls()}undoCalibration(){const e=this.calibrationUndoStack.pop();e&&(this.calibrationRedoStack.push(JSON.stringify(this.buildCurrentCalibrationConfig(),null,2)),this.applyCalibrationSnapshot(e))}redoCalibration(){const e=this.calibrationRedoStack.pop();e&&(this.calibrationUndoStack.push(JSON.stringify(this.buildCurrentCalibrationConfig(),null,2)),this.applyCalibrationSnapshot(e))}resetCalibration(){this.initialCalibrationSnapshot&&(this.recordCalibrationHistory(),this.applyCalibrationSnapshot(this.initialCalibrationSnapshot))}announceCalibrationAction(e){this.calibrationActionStatus&&(this.calibrationActionStatus.textContent=e)}async copyCalibrationJson(){var i;if(!this.calibrationExportValid||!this.calibrationOutput)return;const e=document.activeElement instanceof HTMLElement?document.activeElement:null;let t=!1;try{if(!((i=navigator.clipboard)!=null&&i.writeText))throw new Error("Clipboard API unavailable");await navigator.clipboard.writeText(this.calibrationOutput.value),t=!0}catch(s){const a=this.calibrationOutput.closest("details");a&&!a.open&&(a.open=!0,await new Promise(o=>requestAnimationFrame(()=>o()))),this.calibrationOutput.focus(),this.calibrationOutput.select();try{t=document.execCommand("copy")}catch(o){t=!1}t&&(e==null||e.focus())}const n=t?"Gültige Museum-Konfiguration wurde kopiert.":"Kopieren fehlgeschlagen. Bitte den JSON-Text manuell kopieren.";this.announceCalibrationAction(n)}downloadCalibrationJson(){if(!this.calibrationExportValid||!this.calibrationOutput)return;const e=URL.createObjectURL(new Blob([this.calibrationOutput.value],{type:"application/json"})),t=document.createElement("a");t.href=e,t.download="museum-hub.json",t.click(),URL.revokeObjectURL(e),this.announceCalibrationAction("museum-hub.json wurde heruntergeladen. Ersetzen Sie damit die Datei im Ordner customer-artworks.")}async importCalibrationFile(e){if(!e)return;let t;try{t=JSON.parse(await e.text())}catch(d){this.announceCalibrationAction("Import blockiert: Datei enthält kein gültiges JSON.");return}const n=ds(t);if(!n.config||n.warnings.length>0){this.announceCalibrationAction(`Import blockiert: ${n.warnings.join(" ")||"ungültige Konfiguration"}`);return}const i=ds(this.buildCurrentCalibrationConfig()).config;if(!i||this.fixedCalibrationConfigSignature(n.config)!==this.fixedCalibrationConfigSignature(i)){this.announceCalibrationAction("Import blockiert: Kamera, Raum, Wandmodell oder andere feste Editor-Einstellungen weichen ab.");return}const s=new Map(this.slotViews.map(({slot:d})=>[d.id,d]));if(!(n.config.slots.length===s.size&&n.config.slots.every(d=>{var h;const u=s.get(d.id);return!!(u&&d.artworkId===((h=u.artworkId)!=null?h:void 0)&&d.enabled===(u.disabledReason!=="explicitly-disabled")&&d.selectable===u.selectable)}))){this.announceCalibrationAction("Import blockiert: Kunstwerk-Liste, Zuordnung oder Aktivierungsstatus weicht vom geöffneten Editor ab.");return}const o=n.config.walls.filter(d=>d.role!=="bounds-only");if(!(o.length===this.resolution.walls.length&&o.every(d=>{const u=this.resolution.wallById.get(d.id);return!!(u&&d.quad&&d.quad.length===u.quad.length&&d.quad.every((h,f)=>{const g=u.quad[f];return!!(g&&Math.abs(h.x-g.x)<=.001&&Math.abs(h.y-g.y)<=.001)}))}))){this.announceCalibrationAction("Import blockiert: Die feste Wandprojektion weicht von diesem Editor-Build ab.");return}const c=n.config.slots.find(d=>{const u=this.calibrationWallOwnership.get(d.id);return u&&u!==d.placement.wallId});if(c){this.announceCalibrationAction(`Import blockiert: ${c.id} muss auf ${this.calibrationWallOwnership.get(c.id)} bleiben.`);return}this.recordCalibrationHistory(),this.applyCalibrationSnapshot(JSON.stringify(n.config)),this.announceCalibrationAction("Konfiguration wurde importiert und erneut geprüft.")}fixedCalibrationConfigSignature(e){return JSON.stringify({version:e.version,coverage:e.coverage,stage:e.stage,background:e.background,backgroundFallback:e.backgroundFallback,visualTokens:e.visualTokens,camera:e.camera,room:e.room,hangingRules:e.hangingRules,slotsPerPage:e.slotsPerPage,fallbacks:e.fallbacks,walls:e.walls.map(t=>{const n={...t};return delete n.safePolygon,delete n.mountingZone,delete n.mountingZoneConfirmed,n}),slots:e.slots.map(t=>({id:t.id,enabled:t.enabled,selectable:t.selectable,artworkId:t.artworkId,placement:{wallId:t.placement.wallId,targetSizePolicy:t.placement.targetSizePolicy,minScale:t.placement.minScale,maxScale:t.placement.maxScale,zOffset:t.placement.zOffset,provisional:t.placement.provisional}}))})}calibrationRoundTripWarnings(e){const t=ds(JSON.parse(e));if(!t.config)return["Exportprüfung fehlgeschlagen: Konfiguration ist ungültig."];const n=[...t.warnings],i=this.buildCurrentCalibrationConfig(),s=new Map(t.config.slots.map(a=>[a.id,a]));for(const a of i.slots){const o=s.get(a.id);if(!o||o.placement.wallId!==a.placement.wallId){n.push(`Bild ${a.id}: Wandzuordnung hat sich bei der Exportprüfung geändert.`);continue}for(const l of["horizontalPosition","centerHeight","physicalHeight","mountingGap"]){const c=a.placement[l],d=o.placement[l];(typeof c!="number"||typeof d!="number"||Math.abs(c-d)>.001)&&n.push(`Bild ${a.id}: ${l} hat sich bei der Exportprüfung geändert.`)}}return n}updateCalibrationOutput(e){const t=this.buildCurrentCalibrationConfig(),n=JSON.stringify(t,null,2),i=[...this.collectCalibrationWarnings(),...this.calibrationRoundTripWarnings(n)];this.calibrationExportValid=i.length===0,this.calibrationOutput&&(this.calibrationOutput.value=n),this.calibrationCopyButton&&(this.calibrationCopyButton.disabled=!this.calibrationExportValid),this.calibrationDownloadButton&&(this.calibrationDownloadButton.disabled=!this.calibrationExportValid),this.calibrationActionStatus&&(this.calibrationActionStatus.textContent=this.calibrationExportValid?"Alles gültig. Die Konfiguration kann jetzt heruntergeladen werden.":"Speichern ist gesperrt, bis alle Meldungen oben behoben sind.");for(const s of this.slotViews){const a=i.some(o=>o.includes(`Bild ${s.slot.id}:`));s.button.classList.toggle("is-invalid-calibration",a),s.button.setAttribute("aria-invalid",String(a))}if(this.calibrationWarnings){this.calibrationWarnings.replaceChildren();const s=i.length>0?i:["Keine Warnungen — Export und Wandzuordnung sind gültig.",...this.collectCalibrationProofs()];for(const a of s){const o=document.createElement("li");o.textContent=a,this.calibrationWarnings.appendChild(o)}}this.calibrationExportValid&&e&&(this.lastValidCalibrationSnapshot=n,this.calibrationRestoreButton&&(this.calibrationRestoreButton.disabled=!1)),this.diagnostics.info("hub-calibration","Museum hub wall-plane calibration snapshot",{warnings:i,config:t})}restoreLastValidCalibrationSnapshot(){this.lastValidCalibrationSnapshot&&(this.recordCalibrationHistory(),this.applyCalibrationSnapshot(this.lastValidCalibrationSnapshot))}applyCalibrationSnapshot(e){var i,s,a,o,l,c,d,u,h,f;const n=ds(JSON.parse(e)).config;if(n){for(const g of n.walls){const v=this.resolution.wallById.get(g.id);if(!v)continue;const m=(i=g.safePolygon)!=null?i:[];v.safePolygon.splice(0,v.safePolygon.length,...m.map(p=>it(p))),v.mountingZone.splice(0,v.mountingZone.length,...((a=(s=g.mountingZone)!=null?s:g.safePolygon)!=null?a:[]).map(p=>it(p))),v.mountingZoneConfirmed=g.mountingZoneConfirmed===!0}for(const g of n.slots){const v=(o=this.slotViews.find(p=>p.slot.id===g.id))==null?void 0:o.slot;if(!v)continue;if(g.placement.wallId!==v.placement.wallId){this.diagnostics.warn("hub-calibration-wall-ownership","Calibration snapshot slot skipped because wall ownership is immutable",{slotId:g.id,expectedWallId:v.placement.wallId,receivedWallId:g.placement.wallId});continue}const m=this.resolution.wallById.get(g.placement.wallId);m!=null&&m.room&&(v.placement.horizontalPosition=(l=g.placement.horizontalPosition)!=null?l:v.placement.horizontalPosition,v.placement.centerHeight=(c=g.placement.centerHeight)!=null?c:v.placement.centerHeight,v.placement.physicalHeight=(d=g.placement.physicalHeight)!=null?d:v.placement.physicalHeight,v.placement.mountingGap=g.placement.mountingGap,v.placement.mountedHeight=(u=v.placement.physicalHeight)!=null?u:v.placement.mountedHeight,v.placement.uv=$((h=v.placement.horizontalPosition)!=null?h:v.placement.center.x,((f=v.placement.centerHeight)!=null?f:m.room.height/2)/m.room.height),this.syncCanonicalPlacement(v,m))}this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0),this.syncCalibrationControls()}}round(e){return Math.round(e*1e3)/1e3}roundPoint(e){return $(this.round(e.x),this.round(e.y))}dispose(){var e,t;this.disposed||(this.disposed=!0,this.cancelIdlePageDecode(),this.resizeRafId!==0&&cancelAnimationFrame(this.resizeRafId),(e=this.resizeObserver)==null||e.disconnect(),this.narrowQuery.removeEventListener("change",this.handleNarrowChange),window.removeEventListener("resize",this.handleResize),this.element.removeEventListener("pointerdown",this.handleSwipeStart),this.element.removeEventListener("pointerup",this.handleSwipeEnd),this.element.removeEventListener("keydown",this.handleKeydown),this.entryButton.removeEventListener("click",this.handleActivate),this.activateCallback=null,this.selectSlotCallback=null,(t=this.hubRoomRenderer)==null||t.dispose(),this.projectedSlotGeometry.clear(),this.debugProjectionSignatureBySlot.clear(),this.slotViews.length=0,this.roomLayers.length=0,this.element.remove())}};x(un,"NARROW_VIEWS_PER_PAGE",3),x(un,"NARROW_WALL_ORDER",["front","left","right"]);let dl=un;class vx{constructor(e={}){x(this,"destinations",new Map);x(this,"options");x(this,"active",null);x(this,"transition",null);x(this,"generation",0);x(this,"disposed",!1);x(this,"state","loading");this.options=e}register(e){if(this.disposed)throw new Error("Cannot register a destination after disposal.");if(this.destinations.has(e.id))throw new Error(`Destination "${e.id}" is already registered.`);this.destinations.set(e.id,e)}async startAt(e){var n;if(this.active||this.transition)throw new Error("Destination router has already started.");const t=this.requireDestination(e);await((n=t.prepare)==null?void 0:n.call(t)),!this.disposed&&(await t.enter(),!this.disposed&&(this.active=t,this.setState(e==="hub"?"hub":"destination")))}navigate(e){var i;if(this.disposed||((i=this.active)==null?void 0:i.id)===e)return Promise.resolve(!1);if(this.transition)return this.transition;const t=this.requireDestination(e),n=++this.generation;return this.setState("transitioning"),this.transition=this.runTransition(t,n).finally(()=>{this.generation===n&&(this.transition=null)}),this.transition}async runTransition(e,t){var i,s,a,o;const n=this.active;try{return await((i=e.prepare)==null?void 0:i.call(e)),!this.isCurrent(t)||(await((s=n==null?void 0:n.exit)==null?void 0:s.call(n)),!this.isCurrent(t))||(await e.enter(),!this.isCurrent(t))?!1:(this.active=e,this.setState(e.id==="hub"?"hub":"destination"),!0)}catch(l){if(!this.isCurrent(t))return!1;if(n){if(await n.enter(),!this.isCurrent(t))return!1;this.active=n,this.setState(n.id==="hub"?"hub":"destination")}return(o=(a=this.options).onTransitionError)==null||o.call(a,e,l),!1}}requireDestination(e){const t=this.destinations.get(e);if(!t)throw new Error(`Unknown destination "${e}".`);return t}isCurrent(e){return!this.disposed&&this.generation===e}setState(e){var t,n,i,s;this.state=e,(s=(i=this.options).onStateChange)==null||s.call(i,e,(n=(t=this.active)==null?void 0:t.id)!=null?n:null)}get currentState(){return this.state}dispose(){this.disposed||(this.disposed=!0,this.generation+=1,this.destinations.forEach(e=>{var t;return(t=e.dispose)==null?void 0:t.call(e)}),this.destinations.clear(),this.active=null,this.transition=null)}}const yx=300,Lu=200,xx=50;class bx{constructor(){x(this,"diagnostics",rn("audio"));x(this,"audio",new Audio);x(this,"source",null);x(this,"disposed",!1);x(this,"suspended",!1);x(this,"shouldResumeAfterSuspend",!1);x(this,"state",{available:!1,loaded:!1,playing:!1,muted:!1,targetVolume:br,liveVolume:br,autoplayBlocked:!1,message:null,activeSource:null});x(this,"listeners",new Set);x(this,"fadeRafHandle",null);x(this,"fadeStartTime",0);x(this,"fadeStartGain",0);x(this,"fadeTargetGain",0);x(this,"fadeDurationMs",0);x(this,"fadeOnComplete",null);x(this,"tickFade",e=>{this.fadeStartTime===0&&(this.fadeStartTime=e);const t=e-this.fadeStartTime,n=this.fadeDurationMs>0?Math.min(1,t/this.fadeDurationMs):1,i=this.fadeStartGain+(this.fadeTargetGain-this.fadeStartGain)*n;if(this.audio.volume=Math.max(0,Math.min(1,i)),this.state={...this.state,liveVolume:this.audio.volume},this.emit(),n<1)this.fadeRafHandle=requestAnimationFrame(this.tickFade);else{this.fadeRafHandle=null,this.diagnostics.debug("audio-fade-complete","Volume fade completed",{gain:this.fadeTargetGain});const s=this.fadeOnComplete;this.fadeOnComplete=null,s==null||s()}});this.audio.preload="auto",this.audio.loop=!0,this.audio.defaultMuted=!1,this.audio.removeAttribute("muted"),this.audio.muted=!1,this.audio.volume=br,this.bindEvents()}load(e){if(this.disposed)return;this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-load-mute-desync","Repairing muted state desync before loading source",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted);const t=this.pickPlayableSource(e);if(!t){this.audio.removeAttribute("src"),this.audio.load(),this.state={...this.state,available:!1,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:null},this.emit(),this.diagnostics.info("audio-load-empty","No background audio source available");return}this.source=t,this.audio.src=t.src,this.audio.load(),this.state={...this.state,available:!0,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:t},this.emit(),this.diagnostics.info("audio-load-start","Background audio source selected",{file:t.filename,ext:t.ext,mime:t.mime})}subscribe(e){return this.listeners.add(e),e({...this.state}),()=>this.listeners.delete(e)}getState(){return{...this.state}}hasSource(){return!!this.source}async play(e){if(this.disposed||!this.source||this.suspended||this.state.muted)return!1;if(this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-play-mute-desync","Repairing muted state desync before play",{reason:e,expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),!this.audio.paused&&this.state.playing)return this.shouldResumeAfterSuspend=!0,this.diagnostics.debug("audio-play-skip","Play request ignored because audio is already playing",{reason:e}),!0;this.shouldResumeAfterSuspend=!0,this.cancelFade(),this.audio.volume=0,this.state={...this.state,liveVolume:0};try{return await this.audio.play(),this.startFade(this.state.targetVolume,yx,"fade-in"),this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-play",`Background audio playing (${e})`,{reason:e}),!0}catch(t){this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume};const i=(t instanceof Error?t.name:"UnknownError")==="NotAllowedError";return this.state={...this.state,playing:!1,autoplayBlocked:i,message:i?"Klicken Sie auf Ton aktivieren, um Hintergrundmusik zu starten.":"Hintergrundmusik konnte nicht gestartet werden."},this.emit(),this.diagnostics.warn(i?"audio-play-blocked":"audio-play-failed",i?"Background audio blocked by autoplay policy":"Background audio failed to start",{reason:e,error:t}),this.diagnostics.debug("audio-resume-attempt","Play attempt outcome",{reason:e,blocked:i,success:!1}),!1}}pause(e){this.disposed||!this.source||(this.shouldResumeAfterSuspend=!1,this.startFade(0,Lu,"fade-out",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-pause",`Background audio paused (${e})`,{reason:e}))}setMuted(e,t){if(!this.disposed){if(this.state.muted===e&&this.audio.muted===e){this.diagnostics.debug("audio-mute-unchanged","Mute request ignored because state is unchanged",{reason:t,muted:e});return}this.state.muted===e&&this.audio.muted!==e&&this.diagnostics.warn("audio-mute-state-desync","Repairing muted state desync between manager and audio element",{reason:t,expectedMuted:e,actualMuted:this.audio.muted}),this.audio.muted=e,this.state={...this.state,muted:e},e?(this.shouldResumeAfterSuspend=!1,this.startFade(0,Lu,"fade-out-mute",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1}):!this.disposed&&this.source&&!this.suspended&&this.play(`unmute:${t}`),this.emit(),this.diagnostics.info("audio-mute-change",`Background audio mute changed (${t})`,{reason:t,muted:e})}}setVolume(e,t){if(this.disposed)return;const n=Math.max(0,Math.min(Mi,e));this.fadeRafHandle!==null?this.fadeTargetGain=n:this.state.muted||(this.audio.volume=n,this.state={...this.state,liveVolume:n}),this.state={...this.state,targetVolume:n},this.emit(),this.diagnostics.info("audio-volume-change",`Background audio volume changed (${t})`,{reason:t,targetGain:n,liveGain:this.audio.volume}),this.diagnostics.debug("audio-volume-map","Volume mapping record",{targetGain:n,displayPct:la(n),liveGain:this.audio.volume,reason:t})}handleSuspend(e){this.disposed||this.suspended||(this.suspended=!0,this.shouldResumeAfterSuspend=!this.audio.paused&&!this.state.muted,this.cancelFade(),this.audio.paused||this.audio.pause(),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-lifecycle-suspend",`Background audio suspended (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}))}handleResume(e){this.disposed||!this.suspended||(this.suspended=!1,this.diagnostics.info("audio-lifecycle-resume",`Background audio resumed (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}),this.shouldResumeAfterSuspend&&!this.state.muted&&(this.diagnostics.debug("audio-resume-attempt","Attempting auto-resume after lifecycle resume",{reason:e}),this.play(`resume:${e}`)))}dispose(){this.disposed||(this.disposed=!0,this.cancelFade(),this.listeners.clear(),this.audio.pause(),this.audio.removeAttribute("src"),this.audio.load())}bindEvents(){this.audio.addEventListener("canplay",()=>{this.state={...this.state,loaded:!0},this.emit(),this.diagnostics.info("audio-canplay","Background audio can play")}),this.audio.addEventListener("playing",()=>{this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-playing","Background audio playing event")}),this.audio.addEventListener("pause",()=>{this.state={...this.state,playing:!1},this.emit(),this.diagnostics.debug("audio-pause-event","Background audio pause event")}),this.audio.addEventListener("ended",()=>{this.source&&(this.diagnostics.warn("audio-loop-restart","Audio ended unexpectedly while loop is enabled; restarting"),this.startFade(0,xx,"fade-out-loop",()=>{this.audio.currentTime=0,this.play("ended-fallback")}))}),this.audio.addEventListener("error",()=>{const e=this.audio.error;this.state={...this.state,playing:!1,message:"Hintergrundmusik konnte nicht geladen werden."},this.emit(),this.diagnostics.warn("audio-error","Background audio element emitted an error event",{code:e==null?void 0:e.code,message:e==null?void 0:e.message})}),this.audio.addEventListener("volumechange",()=>{this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-volumechange-mute-desync","Repairing muted state desync during volumechange",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),this.state={...this.state,muted:this.state.muted,liveVolume:this.audio.volume},this.emit()})}pickPlayableSource(e){if(!e||!Array.isArray(e.sources)||e.sources.length===0)return null;const t=e.sources.filter(i=>!!i&&typeof i.src=="string"&&typeof i.ext=="string"&&typeof i.mime=="string"&&typeof i.filename=="string");if(t.length===0)return null;if(typeof this.audio.canPlayType=="function"){for(const i of t){const s=this.audio.canPlayType(i.mime);if(s==="probably"||s==="maybe")return i}return null}if(e.selectedByImporter){const i=t.find(s=>{var a;return s.src===((a=e.selectedByImporter)==null?void 0:a.src)});if(i)return i}return t[0]}startFade(e,t,n,i){this.cancelFade(),this.fadeStartGain=this.audio.volume,this.fadeTargetGain=Math.max(0,Math.min(Mi,e)),this.fadeDurationMs=t,this.fadeOnComplete=i!=null?i:null,this.fadeStartTime=0,this.fadeRafHandle=requestAnimationFrame(this.tickFade),this.diagnostics.debug("audio-fade-start","Volume fade started",{label:n,from:this.fadeStartGain,to:this.fadeTargetGain,durationMs:t})}cancelFade(){this.fadeRafHandle!==null&&(cancelAnimationFrame(this.fadeRafHandle),this.fadeRafHandle=null,this.fadeOnComplete=null,this.diagnostics.debug("audio-fade-cancel","Volume fade cancelled"))}emit(){const e={...this.state};this.listeners.forEach(t=>t(e))}}const ul="freyraum.preferences.v1",Li=rn("preferences");function hl(){try{const r=localStorage.getItem(ul);if(!r)return{};const e=JSON.parse(r);if(e&&typeof e=="object")return e}catch(r){Li.warn("storage-read-failed","Could not read stored preferences; falling back to defaults")}return{}}function fl(r){try{localStorage.setItem(ul,JSON.stringify({...r,audioMuted:!1}))}catch(e){Li.warn("storage-write-failed","Could not persist preferences to localStorage")}}function _x(){var r,e,t;return(t=(e=(r=window.matchMedia)==null?void 0:r.call(window,"(prefers-reduced-motion: reduce)"))==null?void 0:e.matches)!=null?t:!1}function ku(){var r,e,t;return(t=(e=(r=window.matchMedia)==null?void 0:r.call(window,"(prefers-contrast: more)"))==null?void 0:e.matches)!=null?t:!1}class Uu{constructor(){x(this,"prefs");x(this,"listeners",new Set);x(this,"motionMedia",(Yu=window.matchMedia)==null?void 0:Yu.call(window,"(prefers-reduced-motion: reduce)"));x(this,"contrastMedia",(qu=window.matchMedia)==null?void 0:qu.call(window,"(prefers-contrast: more)"));x(this,"handleSystemMotionChange",e=>{hl().reducedMotion===void 0&&(this.prefs.reducedMotion=e.matches,this.emit())});x(this,"handleSystemContrastChange",e=>{this.prefs.contrastMode==="auto"&&(this.prefs.highContrast=e.matches,this.emit())});var o,l,c,d,u;const e=hl(),t=e.quality&&e.quality in Qr?e.quality:td,n=e.contrastMode==="high"?"high":"auto";let i=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)?Math.max(0,Math.min(Mi,e.audioVolume)):br;const s=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)&&e.audioVolume<=0;s&&(i=br,Li.warn("audio-volume-normalized","Normalized stored zero-volume state to startup default",{key:ul,stored:e.audioVolume,normalizedTo:i})),this.prefs={reducedMotion:(o=e.reducedMotion)!=null?o:_x(),highContrast:n==="high"?!0:ku(),contrastMode:n,quality:t,audioMuted:!1,audioVolume:i,alwaysShowChrome:e.alwaysShowChrome===!0};const a=e.audioMuted!==!1;(s||a)&&(fl(this.prefs),Li.info("audio-startup-normalized","Normalized persisted startup audio state",{storedMuted:e.audioMuted,storedVolume:e.audioVolume,normalizedMuted:this.prefs.audioMuted,normalizedVolume:this.prefs.audioVolume})),(c=(l=this.motionMedia)==null?void 0:l.addEventListener)==null||c.call(l,"change",this.handleSystemMotionChange),(u=(d=this.contrastMedia)==null?void 0:d.addEventListener)==null||u.call(d,"change",this.handleSystemContrastChange),this.applyToDocument()}get current(){return{...this.prefs}}setReducedMotion(e){this.prefs.reducedMotion=e,this.emit()}setContrastMode(e){this.prefs.contrastMode=e,this.prefs.highContrast=e==="high"?!0:ku(),this.emit()}setQuality(e){e in Qr&&(this.prefs.quality=e,this.emit())}setAudioMuted(e){this.prefs.audioMuted=e,this.emit()}setAudioVolume(e){this.prefs.audioVolume=Math.max(0,Math.min(Mi,e)),this.emit()}setAlwaysShowChrome(e){this.prefs.alwaysShowChrome!==e&&(this.prefs.alwaysShowChrome=e,Li.info("always-show-chrome","Clean-chrome preference changed",{value:e}),this.emit())}normalizeStartupAudio(e,t=!0){const n=this.prefs.audioVolume>0?this.prefs.audioVolume:br,i=this.prefs.audioMuted||this.prefs.audioVolume!==n;if(this.prefs={...this.prefs,audioMuted:!1,audioVolume:n},i?Li.info("audio-startup-reset","Reset audio to startup defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}):Li.debug("audio-startup-reset-skip","Startup audio already matches required defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}),t){this.emit();return}fl(this.prefs)}static hasStoredQuality(){return hl().quality!==void 0}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(){this.applyToDocument(),fl(this.prefs),this.listeners.forEach(e=>e(this.current))}applyToDocument(){const e=document.documentElement;e.dataset.motion=this.prefs.reducedMotion?"reduced":"full",e.dataset.contrast=this.prefs.highContrast?"high":"auto",e.dataset.quality=this.prefs.quality,e.dataset.chromeMode=this.prefs.alwaysShowChrome?"visible":"clean"}dispose(){var e,t,n,i;(t=(e=this.motionMedia)==null?void 0:e.removeEventListener)==null||t.call(e,"change",this.handleSystemMotionChange),(i=(n=this.contrastMedia)==null?void 0:n.removeEventListener)==null||i.call(n,"change",this.handleSystemContrastChange),this.listeners.clear()}}class Sx{constructor(e){x(this,"samples",[]);x(this,"writeIndex",0);x(this,"filled",!1);x(this,"ema",16.7);x(this,"rolling",16.7);x(this,"lastNow",0);x(this,"cooldownUntil",0);x(this,"_sum",0);x(this,"_aboveCount",0);x(this,"_severeCount",0);x(this,"_sampleOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});x(this,"_readOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});x(this,"budgetMs");x(this,"windowSize");x(this,"emaAlpha");x(this,"cooldownMs");x(this,"severeFrameMs");x(this,"severeFrameLimit");var t,n,i,s,a;this.budgetMs=e.budgetMs,this.windowSize=Math.max(8,(t=e.windowSize)!=null?t:60),this.emaAlpha=(n=e.emaAlpha)!=null?n:.1,this.cooldownMs=(i=e.cooldownMs)!=null?i:600,this.severeFrameMs=(s=e.severeFrameMs)!=null?s:33,this.severeFrameLimit=(a=e.severeFrameLimit)!=null?a:5,this.samples.length=this.windowSize,this.samples.fill(this.budgetMs)}sample(e){if(this.lastNow===0)return this.lastNow=e,this.writeSnapshot(this._sampleOut,0,this._aboveCount,this._severeCount);const t=e-this.lastNow;this.lastNow=e;const n=Math.min(t,250);if(this.filled){const s=this.samples[this.writeIndex];this._sum-=s,s>this.budgetMs&&(this._aboveCount-=1),s>=this.severeFrameMs&&(this._severeCount-=1)}this.samples[this.writeIndex]=n,this._sum+=n,n>this.budgetMs&&(this._aboveCount+=1),n>=this.severeFrameMs&&(this._severeCount+=1),this.writeIndex=(this.writeIndex+1)%this.windowSize,this.writeIndex===0&&(this.filled=!0);const i=this.filled?this.windowSize:this.writeIndex;return this.rolling=this._sum/Math.max(1,i),this.ema=this.ema+this.emaAlpha*(n-this.ema),this.writeSnapshot(this._sampleOut,n,this._aboveCount,this._severeCount)}markNavigation(){this.cooldownUntil=(typeof performance!="undefined"?performance.now():0)+this.cooldownMs}markReadinessWork(){this.markNavigation()}markPresetChange(){this.markNavigation()}writeSnapshot(e,t,n,i){const s=typeof performance!="undefined"?performance.now():0,a=n>this.windowSize*.7,o=i>=this.severeFrameLimit;return e.dtMs=t,e.emaMs=this.ema,e.rollingMs=this.rolling,e.rollingFps=1e3/Math.max(.1,this.rolling),e.belowBudget=a||o,e.severeFrameCount=i,e.inCooldown=s<this.cooldownUntil,e}readSnapshot(){return this.writeSnapshot(this._readOut,0,this._aboveCount,this._severeCount)}}const Pa={gcEventsPerMinute:4,gcPauseP99Ms:1};function wx(r){const e=[];return r.gcEventsPerMinute>Pa.gcEventsPerMinute&&e.push(`GC events/min ${r.gcEventsPerMinute} exceeds ${Pa.gcEventsPerMinute}`),r.gcPauseP99Ms>Pa.gcPauseP99Ms&&e.push(`GC pause P99 ${r.gcPauseP99Ms}ms exceeds ${Pa.gcPauseP99Ms}ms`),{checked:2,violations:e}}function Du(){const r=performance.memory;return r?r.usedJSHeapSize:null}function Nu(r,e){if(r.length===0)return 0;const t=Math.min(r.length-1,Math.max(0,Math.ceil(e*r.length)-1));return r[t]}class Mx{constructor(){x(this,"running",!1);x(this,"rafId",null);x(this,"startTime",0);x(this,"lastNow",0);x(this,"frameMs",[]);x(this,"lastHeapBytes",null);x(this,"peakHeapBytes",0);x(this,"startHeapBytes",null);x(this,"gcEventFrameMs",[]);x(this,"longTasks",0);x(this,"longTaskObserver",null)}start(){var t;if(this.running||typeof window=="undefined")return;this.running=!0,this.frameMs.length=0,this.gcEventFrameMs=[],this.longTasks=0,this.startTime=performance.now(),this.lastNow=this.startTime,this.lastHeapBytes=Du(),this.startHeapBytes=this.lastHeapBytes,this.peakHeapBytes=(t=this.lastHeapBytes)!=null?t:0,this.installLongTaskObserver();const e=n=>{this.running&&(this.recordFrame(n),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}stop(){var e;return this.running=!1,this.rafId!==null&&typeof cancelAnimationFrame!="undefined"&&cancelAnimationFrame(this.rafId),this.rafId=null,(e=this.longTaskObserver)==null||e.disconnect(),this.longTaskObserver=null,this.report()}installLongTaskObserver(){if(typeof PerformanceObserver!="undefined")try{this.longTaskObserver=new PerformanceObserver(e=>{this.longTasks+=e.getEntries().length}),this.longTaskObserver.observe({entryTypes:["longtask"]})}catch(e){this.longTaskObserver=null}}recordFrame(e){const t=e-this.lastNow;if(this.lastNow=e,t<=0)return;this.frameMs.push(t);const n=Du();n!==null&&(n>this.peakHeapBytes&&(this.peakHeapBytes=n),this.lastHeapBytes!==null&&n<this.lastHeapBytes&&this.gcEventFrameMs.push(t),this.lastHeapBytes=n)}report(){var g;const e=this.frameMs.length,t=e>0?this.lastNow-this.startTime:0,n=this.frameMs.reduce((v,m)=>v+m,0),i=e>0?n/e:0,s=e>0?this.frameMs.reduce((v,m)=>v+(m-i)*(m-i),0)/e:0,a=[...this.frameMs].sort((v,m)=>v-m),o=this.frameMs.map(v=>1e3/v),l=o.length>0?o.reduce((v,m)=>v+m,0)/o.length:0,c=o.length>0?o.reduce((v,m)=>v+(m-l)*(m-l),0)/o.length:0,d=[...this.gcEventFrameMs].sort((v,m)=>v-m),u=t>0?this.gcEventFrameMs.length/t*6e4:0,h=this.peakHeapBytes>0?this.peakHeapBytes/(1024*1024):null,f=this.startHeapBytes!==null&&this.lastHeapBytes!==null?(this.lastHeapBytes-this.startHeapBytes)/(1024*1024):null;return{frames:e,durationMs:Math.round(t),avgFrameMs:Ln(i),p99FrameMs:Ln(Nu(a,.99)),maxFrameMs:Ln((g=a[a.length-1])!=null?g:0),frameStdDevMs:Ln(Math.sqrt(s)),avgFps:Ln(l),fpsStdDev:Ln(Math.sqrt(c)),gcEventsPerMinute:Ln(u),gcPauseP99Ms:Ln(Nu(d,.99)),longTasks:this.longTasks,peakHeapMb:h!==null?Ln(h):null,heapDeltaMb:f!==null?Ln(f):null}}get isRunning(){return this.running}}function Ln(r){return Math.round(r*100)/100}function Ex(r){if(!r)return 0;const e=r.getIndex();if(e)return e.count/3;const t=r.getAttribute("position");return t?t.count/3:0}function Tx(r){const e=[];let t=0;t+=1;const n=r.artworkMesh.geometry;n?n.getAttribute("position")||e.push("artworkMesh.geometry has no position attribute (corrupt buffer)"):e.push("artworkMesh.geometry is null/undefined (geometry ownership lost)");const i=Ex(n);typeof r.maxArtworkTriangles=="number"&&(t+=1,i>r.maxArtworkTriangles&&e.push(`artwork triangle count ${Math.round(i)} exceeds max ${r.maxArtworkTriangles}`)),t+=1;const s=r.artworkMesh.material;(!s||Array.isArray(s)&&s.length===0)&&e.push("artworkMesh.material is missing (broken material binding)"),t+=1;const a=r.lights.filter(d=>d.castShadow).length;a!==r.expectedShadowCasterCount&&e.push(`shadow-casting light count ${a} != expected ${r.expectedShadowCasterCount}`),t+=1;let o=0,l=0;r.scene.traverse(d=>{o+=1,d==null&&(l+=1)}),l>0&&e.push(`${l} null/undefined node(s) found in scene graph`);const c=r.artworkMesh.position;return(!Number.isFinite(c.x)||!Number.isFinite(c.y)||!Number.isFinite(c.z))&&e.push("artworkMesh.position contains a non-finite value"),{checked:t,violations:e,measured:{artworkTriangles:Math.round(i),sceneChildren:o,shadowCasterCount:a}}}function Ax(r){const e=new Mx,t=hr(),n={startPerf:()=>{e.start(),t.info("perf-tools","perf-start","Performance metrics session started")},stopPerf:()=>{const i=e.stop();return t.info("perf-tools","perf-stop","Performance metrics session stopped",i),i},perfReport:()=>e.report(),checkInvariants:()=>{const i=Tx(r());return i.violations.length>0?t.warn("perf-tools","invariant-violation","Structural invariant violation(s) detected",i):t.info("perf-tools","invariant-ok","All structural invariants hold",i),i},checkTier1Thresholds:i=>{const s=wx(i!=null?i:e.report());return s.violations.length>0?t.warn("perf-tools","tier1-threshold-failed","Tier 1 performance threshold(s) failed",s):t.info("perf-tools","tier1-threshold-ok","Tier 1 performance thresholds passed",s),s}};return typeof window!="undefined"&&(window.__FREYRAUM_PERF_TOOLS__=n),e}const Cx={high:"balanced",balanced:"battery",battery:null};class Rx{constructor(e,t=4e3,n=!1){x(this,"diagnostics",rn("quality"));x(this,"current");x(this,"suspended",!1);x(this,"locked");x(this,"holdOffUntil",0);x(this,"holdOffMs");this.current=e,this.holdOffMs=t,this.locked=n}evaluate(e,t){if(this.suspended||e.inCooldown)return null;const n=typeof performance!="undefined"?performance.now():0;if(n<this.holdOffUntil||!e.belowBudget)return null;const i=Cx[this.current];return i?this.locked?(this.diagnostics.warn("locked-pressure","Sustained frame-budget pressure detected; automatic quality changes are disabled (quality lock)",{preset:this.current,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.holdOffUntil=n+this.holdOffMs,null):(this.diagnostics.warn("downgrade","Adaptive quality controller requested a downgrade",{from:this.current,to:i,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.current=i,this.holdOffUntil=n+this.holdOffMs,t.markPresetChange(),i):null}notifyManualPreset(e){this.current=e,this.suspended=!0,this.diagnostics.info("manual-override","Adaptive quality suspended after manual preset change",{preset:e})}get isSuspended(){return this.suspended}get isLocked(){return this.locked}suspendForUserOverride(){this.suspended=!0}}const Px="freyraum.backend",Ia=rn("backend");function Ix(){try{return typeof window=="undefined"?!1:new URLSearchParams(window.location.search).get("backend")==="webgpu"}catch(r){return!1}}function Lx(){try{return localStorage.getItem(Px)==="webgpu"}catch(r){return!1}}function Fu(){return typeof navigator!="undefined"&&"gpu"in navigator&&navigator.gpu!==void 0}async function kx(){const r=Ix()||Lx();return Ia.debug("detect","Evaluating render backend",{optedIn:r,hasNavigatorGPU:Fu()}),r&&Fu()?"webgpu-experimental":"webgl"}async function Ux(){if(await kx()!=="webgpu-experimental")return null;try{Ia.info("probe-start","Starting WebGPU probe");const t=await import(new URL("./webgpu-probe.js",window.location.href).toString());if(typeof t.initWebGPUPrototype!="function")throw new Error("webgpu-probe.js does not export initWebGPUPrototype()");const n=await t.initWebGPUPrototype();return Ia.info("probe-success","WebGPU probe completed successfully"),n}catch(e){return Ia.warn("probe-failed","WebGPU probe failed; staying on WebGL",e),null}}function Ou(){const r=window.innerWidth,e=window.innerHeight,t=e>=r,n=pl("(pointer: coarse)"),i=pl("(pointer: fine)"),s=pl("(hover: hover)"),a=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1;let o;return r<360?o="phone-small":r<600?o="phone-portrait":r<900&&t?o="tablet-portrait":r<900?o="phone-landscape":r<1180?o="tablet-landscape":o="desktop",{layoutTier:o,pointerPrimary:n?"coarse":i?"fine":"none",hasHover:s,dpr:a,orientation:t?"portrait":"landscape",viewportW:r,viewportH:e}}function Bu(r){const e=document.documentElement;e.dataset.layoutTier=r.layoutTier,e.dataset.pointerPrimary=r.pointerPrimary,e.dataset.hover=r.hasHover?"true":"false",e.dataset.orientation=r.orientation,e.dataset.shortHeight=r.viewportH<500?"true":"false"}function pl(r){var e,t,n;try{return(n=(t=(e=window.matchMedia)==null?void 0:e.call(window,r))==null?void 0:t.matches)!=null?n:!1}catch(i){return!1}}const Dx="entry-balanced",Nx="freyraum:startup-readiness",Fx="startup",ml={defaultPreEntryWarmCount:5,defaultPostRevealFrameBudgetMs:8,defaultPostRevealBatchCap:2};function zu(r){if(!r)return null;const e=r.trim().toLowerCase();return e==="full"||e==="strict"||e==="all"?"full":e==="entry-balanced"||e==="balanced"?"entry-balanced":e==="entry-minimal"||e==="minimal"?"entry-minimal":null}function Ox(){try{const r=new URLSearchParams(window.location.search),e=zu(r.get(Fx));if(e)return e}catch(r){}try{const r=zu(localStorage.getItem(Nx));if(r)return r}catch(r){}return Dx}function Bx(r){return r==="phone-small"||r==="phone-portrait"||r==="phone-landscape"}function zx(r,e,t,n){if(r==="full"||t<=1)return Math.max(1,t);const s=Math.max(1,Math.round(n))*2+1;if(r==="entry-minimal")return Hu(s,t);const a=Bx(e)?2:4;return Hu(s+a,t)}function Hu(r,e){return Math.max(1,Math.min(e,Math.round(r)))}const Gu=new R,Vu=new R,Hx=500,Gx=ml.defaultPreEntryWarmCount,Vx=ml.defaultPostRevealFrameBudgetMs,Wx=ml.defaultPostRevealBatchCap,Xx=["high","balanced","battery"];let Wu=ed;function ki(){return new Promise(r=>requestAnimationFrame(()=>r()))}async function Xu(r){for(let e=0;e<r;e+=1)await ki()}function La(r){const e=Number.parseFloat(r);if(Number.isFinite(e))return e;const t=r.match(/-?\d+(?:\.\d+)?/);return t?Number.parseFloat(t[0]):0}function $x(){try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(r){return!1}}function Yx(){try{return document.body.classList.contains("placement-editor")||new URLSearchParams(window.location.search).get("placementEditor")==="1"}catch(r){return!1}}function xn(r){if(!r)return null;const e=r.trim();if(!e)return null;const t=new Pe;try{return t.setStyle(e),`#${t.getHexString().toUpperCase()}`}catch(n){return null}}function qx(r){if(!document.body)return null;const e=document.createElement("div");e.className=r,e.style.position="fixed",e.style.left="-10000px",e.style.top="-10000px",e.style.width="4px",e.style.height="4px",document.body.appendChild(e);const t=getComputedStyle(e),n={backgroundColor:t.backgroundColor,backgroundImage:t.backgroundImage};return e.remove(),n}function oi(r){const e=new he;return r.getSize(e),{width:e.x,height:e.y,pixelRatio:r.getPixelRatio()}}function Zx(r,e){const t=[".topbar",".info-panel",".nav-controls",".nav-btn",".zoom-controls",".zoom-btn",".prefs",".prefs__trigger",".timeline",".timeline__arrow",".timeline__counter",".timeline__thumb",".audio-controls",".audio-controls button",".fullscreen-btn"];let n=0;for(const a of t)r.querySelectorAll(a).forEach(o=>{o.offsetWidth,o.offsetHeight,o.getBoundingClientRect(),getComputedStyle(o).opacity,n+=1});let i=0;const s=r.querySelector(".prefs__panel");return s!=null&&s.hidden&&(s.hidden=!1,s.style.visibility="hidden",s.style.pointerEvents="none",s.offsetHeight,s.querySelectorAll("input, label, fieldset, legend, h2, p").forEach(a=>{a.offsetHeight,getComputedStyle(a).fontSize,n+=1}),s.hidden=!0,s.style.removeProperty("visibility"),s.style.removeProperty("pointer-events"),i+=1),e.info("boot","ui-prebuild-complete","Interactive chrome prebuilt under loading overlay",{elementsMeasured:n,temporarilyOpenedPanels:i}),{elementsMeasured:n,temporarilyOpenedPanels:i}}function Kx(r,e){const t=r.layoutTier==="phone-small"||r.layoutTier==="phone-portrait"||r.layoutTier==="phone-landscape",n=r.layoutTier==="tablet-portrait"||r.layoutTier==="tablet-landscape",i=t?1:2;let s=Gx,a=Vx,o=Wx;return t?(s=4,a=5,o=1):n?(s=5,a=6,o=1):(s=7,a=8,o=2),e>=50&&(s=Math.max(3,s-1),o=1),{criticalRadius:i,preEntryWarmCount:Math.min(e,s),postRevealFrameBudgetMs:a,postRevealBatchCap:o}}function jx(r){return typeof r=="string"&&r.trim()?r.trim().slice(0,96):null}function Qx(r){if(typeof r!="string"||!r.trim())return null;const e=typeof window!="undefined"?window.location.href:"http://localhost/";try{const t=new URL(r.trim(),e);return["http:","https:","file:"].includes(t.protocol)?new URL("./",t.href).href:null}catch(t){return null}}function Jx(r){var t,n,i;if(!r)return!1;if(/^data:image\//i.test(r))return!0;const e=(i=(n=(t=/^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(r))==null?void 0:t[1])==null?void 0:n.toLowerCase())!=null?i:null;return e?e==="http"||e==="https"||e==="file":!0}function $u(r,e,t){if(r==null)return null;if(!Array.isArray(r))return e.warn("boot","artworks-injected-invalid","Ignoring injected artworks: not an array",{typeOf:typeof r}),null;const n=[],i=new Set;let s=0;for(const a of r){if(!a||typeof a!="object"){s++;continue}const o=a,l=typeof o.id=="string"?o.id.trim():"",c=typeof o.image=="string"?o.image.trim():"",d=o.dimensions,u=typeof(d==null?void 0:d.width)=="number"&&Number.isFinite(d.width)?d.width:0,h=typeof(d==null?void 0:d.height)=="number"&&Number.isFinite(d.height)?d.height:0;if(!l||!c||u<=0||h<=0||i.has(l)||!Jx(c)){s++;continue}i.add(l);const f=typeof o.title=="string"&&o.title?o.title:l,g=o.tags,v=Array.isArray(g)?g.filter(b=>typeof b=="string"):[],m=typeof o.webglImage=="string"?o.webglImage:"",p=/^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/]/.test(m)?m:void 0,S=typeof o.presentation=="string"?o.presentation:void 0,y=bd(S);S&&!y&&e.warn("boot","artwork-presentation-invalid","Ignoring invalid injected artwork presentation",{artworkId:l,presentation:S}),n.push({id:l,title:f,subtitle:typeof o.subtitle=="string"?o.subtitle:"",description:typeof o.description=="string"?o.description:"",year:typeof o.year=="number"&&Number.isFinite(o.year)?o.year:new Date().getFullYear(),medium:typeof o.medium=="string"?o.medium:"",image:c,...p?{webglImage:p}:{},dimensions:{width:u,height:h},alt:typeof o.alt=="string"?o.alt:f,credit:typeof o.credit=="string"?o.credit:"",tags:v,surface:typeof o.surface=="string"?o.surface:"",...y?{presentation:y}:{},...t?{imageSourceContext:t}:{}})}return s>0&&e.warn("boot","artworks-injected-rejected","Some injected artworks were rejected",{rejected:s,accepted:n.length}),n}function eb(r,e,t){if(r!=null)if(!r||typeof r!="object"||Array.isArray(r))t.warn("boot","artworks-bundle-invalid","Ignoring injected artwork bundle: expected an object envelope",{typeOf:typeof r});else{const i=r,s=jx(i.bundleId),a=Qx(i.assetBaseUrl);i.assetBaseUrl!==void 0&&i.assetBaseUrl!==null&&!a&&t.warn("boot","artworks-bundle-base-invalid","Ignoring invalid injected artwork asset base URL",{assetBaseUrlType:typeof i.assetBaseUrl});const o=s||a?{...s?{bundleId:s}:{},...a?{assetBaseUrl:a}:{}}:void 0,l=$u(i.artworks,t,o);if(l)return{artworks:l,source:"customer-bundle",bundleId:s,assetBaseUrl:a}}const n=$u(e,t);return n?{artworks:n,source:"customer-legacy-array",bundleId:null,assetBaseUrl:null}:null}function tb(r,e){var o;if(r==null||typeof r!="object")return null;const t=r,i=(Array.isArray(t.sources)?t.sources:[]).map(l=>l).filter(l=>l&&typeof l.src=="string"&&typeof l.ext=="string"&&typeof l.mime=="string"&&typeof l.filename=="string").map(l=>({src:l.src.trim(),ext:l.ext.trim().toLowerCase(),mime:l.mime.trim().toLowerCase(),filename:l.filename.trim()})).filter(l=>l.src.startsWith("./audio/")&&/^audio\/[a-z0-9.+-]+$/.test(l.mime)&&[".mp3",".ogg",".m4a",".wav"].includes(l.ext));if(i.length===0)return null;const s=t.selectedByImporter&&typeof t.selectedByImporter=="object"?t.selectedByImporter:null,a=s?i.find(l=>l.src===s.src&&l.ext===s.ext&&l.mime===s.mime&&l.filename===s.filename):void 0;return e.info("boot","audio-source-resolved","Background audio payload resolved",{sources:i.map(l=>({file:l.filename,ext:l.ext,mime:l.mime})),selectedByImporter:(o=a==null?void 0:a.filename)!=null?o:null}),{sources:i,...a?{selectedByImporter:a}:{}}}function ka(r,e,t){var s,a;const n=(s=xn(e.galleryWall))!=null?s:e.galleryWall.trim(),i=(a=xn(e.museumWall))!=null?a:n;return document.documentElement.style.setProperty("--color-gallery-wall",n),document.documentElement.style.setProperty("--color-museum-wall",i),document.documentElement.style.backgroundColor=n,document.body.style.backgroundColor=n,r.style.backgroundColor=n,t==null||t.setWallClearColor(n),{galleryWall:n,museumWall:i}}function nb(){const r=xn(getComputedStyle(document.documentElement).getPropertyValue("--color-gallery-wall"));return r!=null?r:"#C7CED4"}function Ua(r,e,t,n,i,s,a){var I,B,F,N,Y,X,Q,q,re;const o=getComputedStyle(document.documentElement),l=o.getPropertyValue("--color-gallery-wall").trim(),c=o.getPropertyValue("--color-museum-wall").trim(),d=(I=n==null?void 0:n.renderer.getClearColor(new Pe))!=null?I:null,u=d?`#${d.getHexString().toUpperCase()}`:null,h=i?getComputedStyle(i):null,f=qx("fallback-screen"),g=getComputedStyle(document.body),v=getComputedStyle(a),m=s?getComputedStyle(s):null,p=xn(t.galleryWall),S=xn(t.museumWall),y=xn(l),b=xn(c),U=xn((B=h==null?void 0:h.backgroundColor)!=null?B:null),P=xn((F=f==null?void 0:f.backgroundColor)!=null?F:null),E=xn(g.backgroundColor),L=xn(v.backgroundColor),M=[];p&&u&&u!==p&&M.push(`renderer-clear(${u}) != token.galleryWall(${p})`),p&&y&&y!==p&&M.push(`--color-gallery-wall(${y}) != token.galleryWall(${p})`),S&&b&&b!==S&&M.push(`--color-museum-wall(${b}) != token.museumWall(${S})`),S&&U&&U!==S&&M.push(`hub-background(${U}) != token.museumWall(${S})`),p&&P&&P!==p&&M.push(`fallback-background(${P}) != token.galleryWall(${p})`),p&&L&&L!==p&&M.push(`app-background(${L}) != token.galleryWall(${p})`);const _={reason:e,tokens:t,rootVariables:{gallery:l,museum:c,galleryHex:y,museumHex:b},rendererClearHex:u,surfaces:{hubBackgroundColor:(N=h==null?void 0:h.backgroundColor)!=null?N:null,hubBackgroundImage:(Y=h==null?void 0:h.backgroundImage)!=null?Y:null,loadingOverlayBackgroundColor:(X=m==null?void 0:m.backgroundColor)!=null?X:null,loadingOverlayBackgroundImage:(Q=m==null?void 0:m.backgroundImage)!=null?Q:null,fallbackProbeBackgroundColor:(q=f==null?void 0:f.backgroundColor)!=null?q:null,fallbackProbeBackgroundImage:(re=f==null?void 0:f.backgroundImage)!=null?re:null,bodyBackgroundColor:g.backgroundColor,bodyBackgroundImage:g.backgroundImage,bodyBackgroundHex:E,appBackgroundColor:v.backgroundColor,appBackgroundImage:v.backgroundImage,appBackgroundHex:L},mismatchSignals:M};M.length>0?r.warn("surface","wall-surface-snapshot-mismatch","Museum wall/clear-color consistency mismatch detected",_):r.info("surface","wall-surface-snapshot","Museum wall/clear-color surfaces resolved consistently",_)}function ib(r){const e=Yx(),t=["Kunstwerke werden vorbereitet …","Texturen werden geladen …","Licht und Schatten werden berechnet …","Atmosphäre wird eingestellt …","Fast fertig …"],n=document.createElement("div");n.className="loading-overlay",n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.setAttribute("aria-label","Museum wird geladen"),[{x:"10%",y:"14%",size:"280px",color:"rgba(181,154,106,0.32)",duration:"4.2s",delay:"0s",dx1:"52px",dy1:"-44px",dx2:"-68px",dy2:"38px",dx3:"44px",dy3:"-58px"},{x:"78%",y:"12%",size:"340px",color:"rgba(200,214,229,0.26)",duration:"3.6s",delay:"-1.4s",dx1:"-48px",dy1:"60px",dx2:"72px",dy2:"-46px",dx3:"-56px",dy3:"42px"},{x:"16%",y:"74%",size:"400px",color:"rgba(200,214,229,0.24)",duration:"5.1s",delay:"-2.8s",dx1:"64px",dy1:"-52px",dx2:"-40px",dy2:"76px",dx3:"58px",dy3:"-38px"},{x:"84%",y:"70%",size:"290px",color:"rgba(181,154,106,0.28)",duration:"3.9s",delay:"-0.7s",dx1:"-62px",dy1:"42px",dx2:"48px",dy2:"-72px",dx3:"-44px",dy3:"66px"},{x:"50%",y:"6%",size:"220px",color:"rgba(181,154,106,0.22)",duration:"4.7s",delay:"-3.5s",dx1:"44px",dy1:"68px",dx2:"-76px",dy2:"-40px",dx3:"60px",dy3:"52px"},{x:"46%",y:"90%",size:"320px",color:"rgba(200,214,229,0.20)",duration:"3.3s",delay:"-2.1s",dx1:"-58px",dy1:"-62px",dx2:"82px",dy2:"44px",dx3:"-48px",dy3:"-70px"},{x:"26%",y:"50%",size:"240px",color:"rgba(181,154,106,0.18)",duration:"5.8s",delay:"-4.4s",dx1:"70px",dy1:"46px",dx2:"-44px",dy2:"-80px",dx3:"38px",dy3:"64px"},{x:"74%",y:"46%",size:"260px",color:"rgba(200,214,229,0.16)",duration:"4.4s",delay:"-1.9s",dx1:"-46px",dy1:"72px",dx2:"60px",dy2:"-48px",dx3:"-68px",dy3:"56px"},{x:"34%",y:"28%",size:"200px",color:"rgba(181,154,106,0.20)",duration:"3.8s",delay:"-0.5s",dx1:"58px",dy1:"-76px",dx2:"-50px",dy2:"60px",dx3:"76px",dy3:"-42px"},{x:"62%",y:"32%",size:"310px",color:"rgba(200,214,229,0.22)",duration:"5.4s",delay:"-3.1s",dx1:"-72px",dy1:"-48px",dx2:"44px",dy2:"84px",dx3:"-60px",dy3:"-52px"},{x:"8%",y:"44%",size:"350px",color:"rgba(181,154,106,0.16)",duration:"4.0s",delay:"-1.2s",dx1:"46px",dy1:"84px",dx2:"-80px",dy2:"-44px",dx3:"52px",dy3:"68px"},{x:"90%",y:"36%",size:"230px",color:"rgba(200,214,229,0.18)",duration:"5.6s",delay:"-2.5s",dx1:"-84px",dy1:"52px",dx2:"66px",dy2:"-76px",dx3:"-50px",dy3:"46px"}].forEach(m=>{const p=document.createElement("span");p.className="loading-particle",p.setAttribute("aria-hidden","true"),p.style.setProperty("--particle-x",m.x),p.style.setProperty("--particle-y",m.y),p.style.setProperty("--particle-size",m.size),p.style.setProperty("--particle-color",m.color),p.style.setProperty("--particle-duration",m.duration),p.style.setProperty("--particle-delay",m.delay),p.style.setProperty("--particle-drift-x",m.dx1),p.style.setProperty("--particle-drift-y",m.dy1),p.style.setProperty("--particle-drift-x2",m.dx2),p.style.setProperty("--particle-drift-y2",m.dy2),p.style.setProperty("--particle-drift-x3",m.dx3),p.style.setProperty("--particle-drift-y3",m.dy3),n.appendChild(p)});const s=document.createElement("div");s.className="loading-card";const a=document.createElement("div");a.className="loading-wordmark";const o=document.createElement("span");o.className="loading-wordmark__text",o.textContent="FREYRAUM",a.appendChild(o);const l=document.createElement("div");l.className="loading-subtitle",l.textContent=e?"Artwork Placement Editor wird geladen":"Museum wird geladen";const c=document.createElement("div");c.className="loading-progress-track";const d=document.createElement("div");d.className="loading-progress-fill",c.appendChild(d);const u=document.createElement("div");u.className="loading-progress-pct",u.textContent="0%";const h=document.createElement("div");h.className="loading-hint",h.textContent=t[0];const f=document.createElement("button");f.className="loading-start-btn",f.textContent=e?"Placement Editor öffnen":"Museum betreten",f.setAttribute("aria-label",e?"Artwork Placement Editor öffnen":"Museum betreten und Ausstellungen entdecken"),f.disabled=!0,s.append(a,l,c,u,h,f),n.appendChild(s),r.appendChild(n);let g=0;const v=window.setInterval(()=>{g=(g+1)%t.length,h.textContent=t[g]},2e3);return{overlay:n,setProgress(m){const p=Math.max(0,Math.min(100,Math.round(m)));d.style.width=`${p}%`,u.textContent=`${p}%`},setStatus(m){l.textContent=m,n.setAttribute("aria-label",m)},reveal(){return window.clearInterval(v),f.disabled=!1,f.classList.add("is-visible"),f.offsetHeight,getComputedStyle(f).backgroundColor,f.style.setProperty("will-change","background-color"),f.addEventListener("click",()=>{f.style.removeProperty("will-change")},{once:!0}),l.textContent=e?"Placement Editor bereit":"Museum bereit — zum Starten klicken",h.textContent=e?"Klicken Sie unten, um Ihre Kunstwerke zu platzieren.":"Alle Inhalte sind vollständig vorbereitet.",n.setAttribute("aria-label",e?"Placement Editor bereit":"Museum bereit — zum Starten klicken"),new Promise(m=>{let p=!1;const S=()=>{p||(p=!0,f.disabled=!0,f.removeEventListener("click",S),document.removeEventListener("keydown",y),n.classList.add("is-hidden"),window.setTimeout(()=>{n.remove(),m()},1300))},y=b=>{b.key!=="Enter"&&b.key!==" "||(b.preventDefault(),S())};f.addEventListener("click",S),document.addEventListener("keydown",y),f.addEventListener("transitionend",()=>f.focus(),{once:!0}),window.setTimeout(()=>f.focus(),650)})},dispose(){window.clearInterval(v)}}}async function rb(){var Qu,Ju,eh,th,nh,ih,rh,sh,ah,oh;const r=performance.now(),e=hr(),t=$x();e.installGlobalHandlers(),e.info("boot","startup","Starting FREYRAUM runtime"),t&&e.info("boot","hub-debug-enabled","Museum hub debug overlay requested via ?hubDebug=1");const n=document.getElementById("app");if(!n){e.error("boot","missing-app-root","Missing #app root element");return}n.dataset.experience="loading";const i=new Uu;e.debug("boot","preferences-ready","Preferences store created",i.current);const s=new bx,a=Ou();if(Bu(a),e.info("layout","capabilities","Device capabilities detected",{tier:a.layoutTier,pointer:a.pointerPrimary,hover:a.hasHover,orientation:a.orientation,viewportW:a.viewportW,viewportH:a.viewportH,dpr:a.dpr}),!Uu.hasStoredQuality()){const V=i0();V==="battery"&&V!==i.current.quality&&(i.setQuality(V),e.info("quality","startup-capability-default","Applied conservative first-run quality",{applied:V,tier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr}))}const o=window.__FREYRAUM_ARTWORK_BUNDLE__,l=window.__FREYRAUM_ARTWORKS,c=eb(o,l,e),d=(Qu=c==null?void 0:c.artworks)!=null?Qu:null,u=d&&d.length>0?d:ed;Wu=u;const h=u.map(V=>{var Ae,et,St,At,Dt,Oa,fs,Ba,za,Ha;const be=wi(V);return{id:V.id,bundleId:(et=(Ae=be.primary)==null?void 0:Ae.bundleId)!=null?et:null,declaredImageUrlType:(At=(St=be.primary)==null?void 0:St.declaredUrlType)!=null?At:null,resolvedImageUrlType:(Oa=(Dt=be.primary)==null?void 0:Dt.resolvedUrlType)!=null?Oa:null,hasEmbeddedFallback:!!be.fallback,embeddedFallbackUrlType:(Ba=(fs=be.fallback)==null?void 0:fs.resolvedUrlType)!=null?Ba:null,dimensions:V.dimensions,surface:(za=V.surface)!=null?za:null,presentation:(Ha=V.presentation)!=null?Ha:null}});e.info("boot","artworks-source","Artwork source resolved",{source:d&&d.length>0?(Ju=c==null?void 0:c.source)!=null?Ju:"customer-legacy-array":"built-in",bundleId:(eh=c==null?void 0:c.bundleId)!=null?eh:null,assetBaseUrl:(th=c==null?void 0:c.assetBaseUrl)!=null?th:null,count:u.length,artworks:h,withEmbeddedFallback:h.filter(V=>V.hasEmbeddedFallback).length,withoutEmbeddedFallback:h.filter(V=>!V.hasEmbeddedFallback).length});const f=window.__FREYRAUM_MUSEUM_HUB,g=window.__FREYRAUM_HUB_HOTSPOTS,v=Jy(u,f,g);e.info("boot","museum-hub-resolved","Museum hub configuration resolved",{source:v.source,pages:v.pages.length,selectableSlots:v.slotToArtwork.size,unmappedArtworkCount:v.unmappedArtworkCount,disabledSlots:v.pages.flatMap(V=>V.slots).filter(V=>!V.selectable).map(V=>({slotId:V.id,reason:V.disabledReason})),warnings:v.warnings});const m=v.visualTokens,p=ka(n,m);e.info("boot","visual-tokens-resolved","Wall color tokens resolved",p);const S=window.__FREYRAUM_AUDIO,y=tb(S,e);s.load(y);const b=ib(n),U=new Wc;U.onStart=(V,be,Ae)=>{b.setStatus("Texturen werden geladen"),b.setProgress(Ae>0?be/Ae*40:8)},U.onProgress=(V,be,Ae)=>{b.setProgress(Ae>0?Math.min(48,be/Ae*48):35)},U.onLoad=()=>{b.setStatus("Galerie wird vorbereitet"),b.setProgress(50)},U.onError=V=>{e.warn("boot","loading-manager-error","Asset failed during loading-manager preload",{url:V.startsWith("data:")?`[data-uri:${V.length}bytes]`:V})};const P=Jr(i.current.quality);let E;try{E=new f0(n,P,p.galleryWall)}catch(V){e.error("renderer","init-failed","RendererManager initialization failed",V),b.dispose(),b.overlay.remove(),kd(n,{category:"renderer-initialization",reason:V instanceof Error?V.message:"WebGL-Renderer konnte nicht initialisiert werden.",surfaceColor:p.galleryWall,artworks:u,onRetry:()=>window.location.reload()});return}ka(n,p,E),E.renderer.domElement.classList.add("gallery-canvas","gallery-canvas--loading");let L=null;const M=document.createElement("div");M.className="webgl-restore-status",M.setAttribute("role","status"),M.setAttribute("aria-live","polite"),M.textContent="Grafik wird wiederhergestellt …",n.appendChild(M);let _,I=null,B=null,F=null,N=null;E.onContextChange(V=>{var be,Ae;if(V==="lost"){clearTimeout(_),M.classList.add("is-visible"),e.warn("renderer","context-restore-visible","Showing WebGL restore status"),Ua(e,"renderer-context-lost",p,E,(be=L==null?void 0:L.element)!=null?be:null,b.overlay,n);return}ka(n,p,E),N&&B&&N.applyPreset(Jr(i.current.quality),B.getEffectiveAnisotropy()),M.textContent="Grafik wiederhergestellt",e.info("renderer","context-restore-hidden","WebGL restore status will hide"),F==null||F.markRenderDirty(8),I&&E.prewarm(I.scene,I.camera),Ua(e,"renderer-context-restored",p,E,(Ae=L==null?void 0:L.element)!=null?Ae:null,b.overlay,n),_=setTimeout(()=>{M.classList.remove("is-visible"),M.textContent="Grafik wird wiederhergestellt …"},1200)});const Y=new g0(E.renderer);I=Y;const X=new A0(E.renderer,Y.scene,Y.camera,P),Q=new D0(U);B=Q,Q.init(E.renderer),Q.setAnisotropyDivisor(P.anisotropyDivisor),N=new p0(Y.scene,{wall:p.galleryWall},P,Q.getEffectiveAnisotropy());const q=new P0(Y.scene,P),re=new G0(Y.scene,P);Ax(()=>({scene:Y.scene,artworkMesh:re.getArtworkMeshObject(),lights:q.getLights(),expectedShadowCasterCount:q.getExpectedShadowCasterCount()}));const ce={topbar:null,timeline:null,navControls:null,infoPanel:null},ve=()=>{var hh,fh,ph,mh,gh;const V=window.visualViewport,be=Math.max(1,Math.round((hh=V==null?void 0:V.width)!=null?hh:window.innerWidth)),Ae=Math.max(1,Math.round((fh=V==null?void 0:V.height)!=null?fh:window.innerHeight)),et=window.getComputedStyle(document.documentElement),St=La(et.getPropertyValue("--safe-left")),At=La(et.getPropertyValue("--safe-right")),Dt=La(et.getPropertyValue("--chrome-top")),Oa=La(et.getPropertyValue("--chrome-bottom")),fs=(ph=ce.topbar)==null?void 0:ph.getBoundingClientRect(),Ba=(mh=ce.timeline)==null?void 0:mh.getBoundingClientRect(),za=(gh=ce.navControls)==null?void 0:gh.getBoundingClientRect(),Ha=fs?Math.max(0,Math.min(Ae,fs.bottom)):0,sb=[Ba,za].filter(bl=>!!bl).reduce((bl,ab)=>Math.max(bl,Ae-Math.max(0,ab.top)),0),lh=Math.max(Dt,Ha),ch=Math.max(Oa,sb),dh=St,uh=At,yl=Math.max(1,be-dh-uh),xl=Math.max(1,Ae-lh-ch);return{viewportW:be,viewportH:Ae,usableW:yl,usableH:xl,usableFracX:yl/be,usableFracY:xl/Ae,effectiveAspect:yl/xl,occlusionTop:lh,occlusionRight:uh,occlusionBottom:ch,occlusionLeft:dh}},te=new ty(u,re,Q,Y.camera,void 0,ve);F=te,te.applyPreset(P);const Ve=Kx(a,u.length);te.configureReadinessProfile({criticalRadius:Ve.criticalRadius});const J=Ox(),oe=zx(J,a.layoutTier,u.length,Ve.criticalRadius);te.configureStartupReadiness({mode:J,entryTargetCount:oe}),e.info("boot","startup-readiness-mode","Resolved startup readiness contract",{mode:J,entryTargetCount:oe,artworkCount:u.length,criticalRadius:Ve.criticalRadius,layoutTier:a.layoutTier}),e.info("boot","warm-profile","Applied device-aware warm profile",{artworkCount:u.length,layoutTier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr,profile:Ve});const _e=!1,me=new Sx({budgetMs:16.7}),Ue=new Rx(i.current.quality,4e3,!_e);te.setFrameBudgetMarker(()=>me.markNavigation());let ke=!1,We;Ux();const rt=new ny(n),D=new Ho(n,u[0]),ft=V=>{D.setCompact(V==="phone-portrait"||V==="phone-small")};ft(a.layoutTier);const Ze=new Go(n),Ie=new ry(n,te),Ee=new sy(n,document.documentElement),pt=new ay(n,i),De=new cy(n,i,s),Be=new iy(n),k=new py(n,u);L=new dl(n,v,P),L.setSelectedArtworkId((ih=(nh=u[te.index])==null?void 0:nh.id)!=null?ih:null,{alignPage:!1,source:"boot-gallery-selection"}),Ua(e,"post-hub-composition-create",p,E,L.element,b.overlay,n);const w=s.subscribe(V=>{pt.setAudioStatusMessage(V.message)});ce.topbar=n.querySelector(".topbar"),ce.timeline=n.querySelector(".timeline"),ce.navControls=n.querySelector(".nav-controls"),ce.infoPanel=n.querySelector(".info-panel");const Z=new ly(ce.infoPanel,i,n);Z.init(),ce.navControls&&Z.registerNavControls(ce.navControls,Ze),await Promise.all([te.init(),new Promise(V=>window.setTimeout(V,Hx))]),e.info("boot","gallery-ready","Gallery initialized",{artworkCount:u.length,quality:i.current.quality,lighting:"dramatic"});const ie=E.renderer.domElement;ie.tabIndex=-1,ie.setAttribute("aria-label","Interaktive Galerie"),ie.setAttribute("role","img"),ie.setAttribute("aria-describedby","freyraum-canvas-help");const se=document.createElement("p");se.id="freyraum-canvas-help",se.className="sr-only",se.textContent="Interaktive 3D-Galerie. Navigation: Pfeiltasten links und rechts oder die Navigationsbuttons. Zoomen: Plus- und Minus-Buttons.",n.appendChild(se);let ne=null,Re=null,fe=null;const Se=()=>{Re!==null&&(cancelAnimationFrame(Re),Re=null),fe!==null&&(cancelAnimationFrame(fe),fe=null)},Xe=V=>{ne||(ne=document.createElement("div"),ne.id="freyraum-artwork-status",ne.className="sr-only",ne.setAttribute("aria-live","polite"),ne.setAttribute("aria-atomic","true"),n.appendChild(ne)),Se(),ne.textContent="";const be=V?`Aktuelles Werk: ${V}`:"Aktuelles Werk gewechselt";Re=requestAnimationFrame(()=>{Re=null,fe=requestAnimationFrame(()=>{fe=null,ne&&(ne.textContent=be)})})},le=new by(ie,te),xe=new yy,$e=new gy(te,xe);le.setEnabled(!1),$e.setEnabled(!1),rt.onHelpClick=()=>xe.open(rt.helpBtn),rt.onInfoClick=()=>Z.forceReveal("info-panel");let Ne=!1;const we=V=>{if(Ne)return;const be=i.current,Ae=s.getState();s.hasSource()&&!be.audioMuted&&(Ae.autoplayBlocked||!Ae.playing&&Ae.available)&&(Ne=!0,e.info("audio","autoplay-recovery-attempt","Retrying audio play after user interaction",{reason:V,autoplayBlocked:Ae.autoplayBlocked}),s.play(`interaction-recovery:${V}`))},ze=()=>we("pointerdown"),Ye=V=>{(V.key==="ArrowLeft"||V.key==="ArrowRight"||V.key===" "||V.key==="Enter")&&we(`keydown:${V.key}`)};window.addEventListener("pointerdown",ze,{passive:!0}),window.addEventListener("keydown",Ye);let C;const A=200,O=()=>{C!==void 0&&(clearTimeout(C),C=void 0),te.setInteractionActive(!0)},z=()=>{C!==void 0&&clearTimeout(C),C=setTimeout(()=>{C=void 0,te.setInteractionActive(!1)},A)},H=()=>O(),ee=()=>z();window.addEventListener("pointerdown",H,{passive:!0}),window.addEventListener("pointerup",ee,{passive:!0}),window.addEventListener("pointercancel",ee,{passive:!0});const ae=u.length,ue=new Zt(4,4,{depthBuffer:!0,stencilBuffer:!1}),Ce=(V,be)=>{const Ae=performance.now();if(!te.warmArtworkForGPU(V,be))return!1;const et=re.group.visible;re.group.visible=!0;const St=E.renderer.getRenderTarget();return E.renderer.setRenderTarget(ue),E.renderer.render(Y.scene,Y.camera),E.renderer.setRenderTarget(St),re.group.visible=et,te.markGpuWarmed(V,performance.now()-Ae,be),!0},qe=(V,be)=>{var St;const Ae=performance.now();if(!te.warmArtworkForGPU(V,be))return!1;const et=re.group.visible;return re.group.visible=!0,X.render(),re.group.visible=et,te.markGpuWarmed(V,performance.now()-Ae,be),e.debug("boot","artwork-final-path-warm","Artwork rendered through final post-processing path under loading overlay",{index:V,artworkId:(St=u[V])==null?void 0:St.id,reason:be,durationMs:Math.round((performance.now()-Ae)*10)/10,renderer:oi(E.renderer)}),!0},Fe=te.getBudgetedWarmOrder(0),tt=te.getStartupEntryTargets(0),gt=Math.max(0,Fe.length-tt.length);e.info("boot","pre-entry-warm-contract","Pre-entry GPU warm contract resolved",{mode:J,warmOrderLength:Fe.length,entryWarmCount:tt.length,deferredWarmCount:gt,entryTargets:tt}),await te.ensureEntryReadiness(tt,"overlay-entry-readiness-contract"),b.setStatus("GPU wird vorbereitet"),b.setProgress(50);for(let V=0;V<tt.length;V+=1)b.setStatus(`Gemälde ${V+1} / ${tt.length} wird vorbereitet`),Ce(tt[V],"overlay-entry-readiness-contract"),b.setProgress(50+Math.round((V+1)/Math.max(1,tt.length)*45)),await ki();let Pt=te.getEntryReadinessContract(tt),ht=0;const Gt=Math.max(2,tt.length+1);for(;!Pt.ready&&ht<Gt;)ht+=1,b.setStatus("Zusätzliche Vorbereitung läuft"),await te.ensureEntryReadiness(Pt.pendingIndices,`overlay-contract-retry-${ht}`),Pt.pendingIndices.forEach(V=>Ce(V,`overlay-contract-retry-${ht}`)),Pt=te.getEntryReadinessContract(tt);Pt.ready||e.warn("boot","entry-contract-unresolved","Full-gallery entry readiness contract could not be fully satisfied before reveal",{pendingIndices:Pt.pendingIndices,targetIndices:Pt.targetIndices,attempts:ht,maxAttempts:Gt}),te.warmArtworkForGPU(te.index,"restore-active-after-overlay-warm");const st=te.getFullGalleryReadinessSummary();if(e.info("boot","full-gallery-ready","Entry readiness contract resolved; enabling entry CTA",{artworkCount:ae,fullyReadyCount:st.fullyReadyCount,pendingCount:st.pendingCount,gpuWarmedCount:st.gpuWarmedCount,pbrLoadedCount:st.pbrLoadedCount,proceduralReadyCount:st.proceduralReadyCount,memoryCapApplied:st.memoryCapApplied,preloadMode:st.preloadMode,deferredArtworkCount:st.deferredArtworkCount,overflowArtworkCount:st.overflowArtworkCount,entryContractPasses:ht,entryContractMaxPasses:Gt}),st.pendingCount>0){const V=st.preloadMode==="strict"?"warn":"info";e[V]("boot","entry-unresolved-artworks","Pre-entry unresolved artworks detected",{pendingCount:st.pendingCount,unresolvedArtworkIds:st.unresolvedArtworkIds,preloadMode:st.preloadMode,deferredArtworkCount:st.deferredArtworkCount,overflowArtworkCount:st.overflowArtworkCount,contractSatisfied:st.preloadMode!=="strict"})}e.info("boot","inp-acceptance-target",'INP acceptance criteria: interaction presentation delay must stay below 200 ms (Core Web Vitals "good" threshold)',{baseline_inp_ms:1024,target_inp_ms:200,preloadMode:st.preloadMode,artworkCount:ae,note:"Measure with Chrome DevTools Performance > Interactions panel or CrUX field data after deploy."}),e.info("boot","gpu-warm-complete","Pre-entry GPU warm finished; entry target set warmed before reveal",{artworkCount:ae,mode:J,entryWarmCount:tt.length,deferredWarmCount:gt,warmOrder:Fe,frameBudgetMs:Ve.postRevealFrameBudgetMs,batchCap:Ve.postRevealBatchCap});const $n=3,sn=performance.now();e.info("boot","gpu-warm-flush-start","Starting post-warm GPU drain frames before shader prewarm",{frames:$n,artworkCount:ae,pendingCount:st.pendingCount,preloadMode:st.preloadMode}),await Xu($n),e.info("boot","gpu-warm-flush-complete","Post-warm GPU drain frames completed",{frames:$n,durationMs:performance.now()-sn,artworkCount:ae,pendingCount:st.pendingCount,preloadMode:st.preloadMode}),b.setStatus("Shader werden vorbereitet"),b.setProgress(97),await E.prewarm(Y.scene,Y.camera),te.markAllShaderCompiled("boot-prewarm");const hn=i.current.quality,Ui=hn==="battery"||a.pointerPrimary==="coarse"||E.rendererMode!=="preferred",Di=Ui?[]:Xx.filter(V=>V!==hn);if(Ui&&e.info("boot","quality-variant-prewarm-skipped","Skipped non-active shader variants on a constrained renderer",{activeQuality:hn,pointer:a.pointerPrimary,rendererMode:E.rendererMode}),Di.length>0){const V=te.index,be=performance.now();e.info("boot","quality-variant-prewarm-start","Prewarming non-active quality shader variants under loading overlay",{activeQuality:hn,variants:Di,artworkIndex:V,artworkId:(rh=u[V])==null?void 0:rh.id});for(const et of Di){const St=performance.now(),At=Jr(et);E.applyPreset(At),X.applyPreset(At),q.applyPreset(At),re.applyPreset(At),te.applyPreset(At),N==null||N.applyPreset(At,Q.getEffectiveAnisotropy()),te.warmArtworkForGPU(V,`overlay-quality-variant-${et}`),await E.prewarm(Y.scene,Y.camera),e.debug("boot","quality-variant-prewarmed","Quality shader variant prewarmed",{quality:et,artworkIndex:V,artworkId:(sh=u[V])==null?void 0:sh.id,durationMs:Math.round((performance.now()-St)*10)/10,renderer:oi(E.renderer)}),await ki()}const Ae=Jr(hn);E.applyPreset(Ae),X.applyPreset(Ae),q.applyPreset(Ae),re.applyPreset(Ae),te.applyPreset(Ae),N==null||N.applyPreset(Ae,Q.getEffectiveAnisotropy()),te.warmArtworkForGPU(te.index,"restore-active-after-quality-variant-prewarm"),await E.prewarm(Y.scene,Y.camera),e.info("boot","quality-variant-prewarm-complete","All non-active quality shader variants prewarmed under loading overlay",{activeQuality:hn,variantsWarmed:Di,durationMs:Math.round((performance.now()-be)*10)/10,renderer:oi(E.renderer)})}const Rr=new he;E.renderer.getSize(Rr),e.info("boot","composer-prewarm-start","Starting EffectComposer shader prewarm (bloom+FXAA passes)"),X.prewarmComposer(Rr.x,Rr.y),e.info("boot","composer-prewarm-complete","EffectComposer shader prewarm complete"),await Xu(1),b.setStatus("Finale Darstellung wird vorbereitet"),b.setProgress(98);const gl=performance.now();let us=0;for(let V=0;V<tt.length;V+=1)qe(tt[V],"overlay-final-path-warm")&&(us+=1),await ki();qe(te.index,"restore-active-after-final-path-warm"),e.info("boot","all-artworks-final-path-warmed","Entry target artworks rendered through final post-processing path under loading overlay",{artworkCount:ae,mode:J,warmed:us,targetCount:tt.length,deferredWarmCount:gt,durationMs:Math.round((performance.now()-gl)*10)/10,renderer:oi(E.renderer)}),b.setStatus("Bedienelemente werden vorbereitet");const Na=await k.prewarmUnderOverlay(),T=Zx(n,e);e.info("boot","entry-prebuild-complete","Main page, controls, timeline, and final render path are prebuilt under loading overlay",{timeline:Na,ui:T,artworkCount:ae}),b.setProgress(99),st.preloadMode==="bounded-fallback"?b.setStatus(`${st.overflowArtworkCount} Gemälde werden noch optimiert – Galerie kann betreten werden`):st.preloadMode==="staged"&&gt>0?b.setStatus("Galerie bereit – weitere Gemälde werden im Hintergrund vorbereitet"):b.setStatus("Galerie bereit"),E.renderer.domElement.classList.remove("gallery-canvas--loading"),E.renderer.domElement.classList.add("gallery-canvas--ready");let G=tt.length;const K=()=>{if(G>=Fe.length){ue.dispose(),te.warmArtworkForGPU(te.index,"restore-active-after-budget-warm"),e.info("boot","gpu-warm-post-reveal","Post-reveal budgeted warm queue complete; all artworks warmed",{artworkCount:ae,mode:J,warmed:Fe.length,deferredWarmCount:gt,readinessLedger:te.getReadinessLedger()});return}const V=performance.now();let be=0;for(;G<Fe.length&&be<Ve.postRevealBatchCap&&performance.now()-V<Ve.postRevealFrameBudgetMs;)Ce(Fe[G],"post-reveal-budget"),G+=1,be+=1;te.warmArtworkForGPU(te.index,"restore-active-between-budget-warm"),e.debug("boot","gpu-warm-frame","Budgeted GPU warm frame completed",{warmedThisFrame:be,warmCursor:G,total:Fe.length}),requestAnimationFrame(K)};requestAnimationFrame(K);let j,W=0;const de=()=>{var At,Dt;W=0;const V=window.visualViewport,be=Math.max(1,Math.round((At=V==null?void 0:V.width)!=null?At:window.innerWidth)),Ae=Math.max(1,Math.round((Dt=V==null?void 0:V.height)!=null?Dt:window.innerHeight));E.resize(be,Ae),X.resize(be,Ae),Y.updateAspect(be,Ae);const et=Ou();Bu(et),ft(et.layoutTier),Be.updateHint();const St=ve();te.handleViewportMetricsChanged(),e.info("layout","resize","Viewport resized",{tier:et.layoutTier,w:et.viewportW,h:et.viewportH,measuredW:be,measuredH:Ae,orientation:et.orientation}),e.info("layout","art-viewport","Artwork-safe viewport measured",St)},pe=()=>{clearTimeout(j),j=setTimeout(()=>{W===0&&(W=requestAnimationFrame(de))},120)};window.addEventListener("resize",pe),window.addEventListener("orientationchange",pe);const ye=window.visualViewport;ye==null||ye.addEventListener("resize",pe),ye==null||ye.addEventListener("scroll",pe);const Me=typeof ResizeObserver=="function"?new ResizeObserver(pe):null;for(const V of[ce.topbar,ce.timeline,ce.navControls,ce.infoPanel])V&&(Me==null||Me.observe(V));const Oe=V=>{const{reducedMotion:be,quality:Ae,audioMuted:et,audioVolume:St}=i.current;te.setReducedMotion(be),q.setAnimated(!be),s.setVolume(St,"preferences-apply"),s.setMuted(et,"preferences-apply");const At=s.getState();!et&&s.hasSource()&&(!At.playing||At.autoplayBlocked)&&s.play("preferences-apply"),re.material.setShadowProfileScale(.5);const Dt=Jr(Ae);E.applyPreset(Dt),X.applyPreset(Dt),q.applyPreset(Dt),re.applyPreset(Dt),te.applyPreset(Dt),N==null||N.applyPreset(Dt,Q.getEffectiveAnisotropy()),L==null||L.applyPreset(Dt),te.setInspectionMode(!1),re.material.setShadowFilterRadius(0,!1),me.markPresetChange(),te.markRenderDirty(6),V&&Ue.notifyManualPreset(Ae),e.debug("preferences","applied","Applied current preferences",{manual:V,reducedMotion:be,quality:Ae,lighting:"dramatic",audioMuted:et,audioVolume:St,inspection:!1})};Oe(!1);const He=V=>{ke||(ke=!0,s.handleSuspend(V),e.info("lifecycle","suspend",`Runtime suspended (${V})`,{reason:V,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},Le=V=>{ke&&(ke=!1,s.handleResume(V),me.markNavigation(),te.markRenderDirty(6),e.info("lifecycle","resume",`Runtime resumed (${V})`,{reason:V,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},lt=()=>{document.visibilityState==="hidden"?He("visibilitychange-hidden"):document.visibilityState==="visible"&&Le("visibilitychange-visible")},yt=V=>{i.normalizeStartupAudio(V.persisted?"pagehide-bfcache":"pagehide-close",!1),e.info("audio","startup-audio-persisted","Persisted startup audio defaults during page hide",{persisted:V.persisted})},xt=V=>{V.persisted&&(e.info("audio","startup-audio-restore","Restoring startup audio defaults after bfcache resume",{persisted:V.persisted}),i.normalizeStartupAudio("pageshow-bfcache"))},Vt=()=>He("page-lifecycle-freeze"),ct=()=>Le("page-lifecycle-resume");document.addEventListener("visibilitychange",lt),window.addEventListener("pagehide",yt),window.addEventListener("pageshow",xt),window.addEventListener("freeze",Vt),window.addEventListener("resume",ct);let Te=null;if(e.getMode()!=="default"&&typeof PerformanceObserver=="function")try{Te=new PerformanceObserver(V=>{for(const be of V.getEntries())e.warn("perf","long-task","Long task blocked the main thread",{duration:Math.round(be.duration),startTime:Math.round(be.startTime),name:be.name})}),Te.observe({type:"longtask",buffered:!0}),e.info("perf","longtask-observer-active","Long Tasks API observer attached")}catch(V){e.info("perf","longtask-unsupported","Long Tasks API not available",{message:V instanceof Error?V.message:String(V)})}let Mt;e.getMode()!=="default"&&(Mt=setInterval(()=>{ke||e.info("renderer","snapshot","Renderer info snapshot",E.getRendererSnapshot())},5e3));const ot=hr().getMode()!=="default";let Wt=!1,bn=!1;const Xt=V=>{ot&&(V.key==="a"||V.key==="A"?(Wt=!Wt,re.material.setAlbedoOnly(Wt),e.info("debug","albedo-toggle",`Albedo-only ${Wt?"ON":"OFF"}`)):(V.key==="s"||V.key==="S")&&(bn=!bn,re.material.setShadowDebug(bn),e.info("debug","shadow-toggle",`Shadow-only ${bn?"ON":"OFF"}`)))};ot&&(window.addEventListener("keydown",Xt),e.info("debug","controls",'Debug controls active: press "a" for albedo-only, "s" for shadow-only',{mode:e.getMode()}));let li=i.current;const wt=typeof window.requestIdleCallback=="function"?V=>window.requestIdleCallback(V,{timeout:200}):V=>window.setTimeout(V,0),fn=typeof window.cancelIdleCallback=="function"?V=>window.cancelIdleCallback(V):V=>window.clearTimeout(V);let an=null;const en=1e-6,hs=i.subscribe(()=>{const V=i.current,be=V.quality!==li.quality,Ae=V.audioMuted!==li.audioMuted||Math.abs(V.audioVolume-li.audioVolume)>en;if(li=V,Ae){an!==null&&(fn(an),an=null),Oe(be);return}an!==null&&fn(an),an=wt(()=>{an=null,Oe(be),E.prewarm(Y.scene,Y.camera)})}),vl=V=>{var be,Ae,et,St,At,Dt;D.update(u[V],!0),k.setActive(V),Xe((Ae=(be=u[V])==null?void 0:be.title)!=null?Ae:""),L==null||L.setSelectedArtworkId((St=(et=u[V])==null?void 0:et.id)!=null?St:null,{alignPage:!1,source:"gallery-navigate"}),e.info("gallery","navigate","Artwork changed",{index:V,artworkId:(At=u[V])==null?void 0:At.id,title:(Dt=u[V])==null?void 0:Dt.title})};te.onNavigate(vl),Ze.onPrev(()=>te.navigate(-1)),Ze.onNext(()=>te.navigate(1)),Ze.enableIdleHint(),k.onSelect(V=>te.goTo(V)),k.onPreview(V=>te.promotePrefetchWindow(V,"timeline-preview"));const kn=new vx({onStateChange:V=>{var be;n.dataset.experience=V==="destination"?"gallery":V,ka(n,p,E),Ua(e,`experience-state:${V}`,p,E,(be=L==null?void 0:L.element)!=null?be:null,b.overlay.isConnected?b.overlay:null,n),e.info("navigation","experience-state","Experience state changed",{state:V})},onTransitionError:(V,be)=>{L==null||L.showError(),e.error("navigation","destination-transition-failed",`Failed to enter destination "${V.id}"`,be)}});kn.register({id:"hub",label:"Main Museum Hub",prepare:()=>L.prepare(),enter:()=>{var V,be;re.group.visible=!1,N==null||N.setVisible(!1),le.setEnabled(!1),$e.setEnabled(!1),L.setSelectedArtworkId((be=(V=u[te.index])==null?void 0:V.id)!=null?be:null,{alignPage:!0,source:"router-enter-hub"}),L.enter()},exit:()=>L.exit(i.current.reducedMotion)}),kn.register({id:"gallery",label:"Interaktive Galerie",prepare:async()=>{re.group.visible=!0,N==null||N.setVisible(!0),te.resetView(),await ki()},enter:()=>{var V;le.setEnabled(!0),$e.setEnabled(!0),ie.focus({preventScroll:!0}),e.info("navigation","gallery-entered","Existing interactive gallery entered from museum hub",{artworkId:(V=u[te.index])==null?void 0:V.id})},exit:()=>{le.setEnabled(!1),$e.setEnabled(!1)}}),L.onActivate(()=>{kn.navigate("gallery")});const Zu=new Map;u.forEach((V,be)=>Zu.set(V.id,be));let Fa=0;L.onSelectSlot(V=>{const be=++Fa,Ae=V.artworkId,et=Ae!==null?Zu.get(Ae):void 0;if(Ae===null||et===void 0){e.warn("navigation","hub-slot-invalid","Hub slot activation without a valid exact target; ignoring",{slotId:V.id,artworkId:Ae}),L.showError();return}e.info("navigation","hub-slot-select","Hub frame selected",{slotId:V.id,artworkId:Ae,artworkIndex:et,generation:be}),te.goTo(et),te.promotePrefetchWindow(et,"hub-slot"),te.whenArtworkInteractive(et,v.selectionTimeoutMs).then(St=>{if(be!==Fa){e.info("navigation","hub-slot-stale-readiness","Ignoring stale hub readiness completion",{slotId:V.id,artworkId:Ae,generation:be,currentGeneration:Fa});return}St==="timeout"&&e.warn("navigation","hub-slot-readiness-timeout","Hub readiness gate timed out; entering exact target with procedural surface",{slotId:V.id,artworkId:Ae,timeoutMs:v.selectionTimeoutMs}),te.index!==et&&te.goTo(et),kn.navigate("gallery")})});const Ku=()=>{Fa+=1,rt.setBackBusy(!0),kn.navigate("hub").finally(()=>rt.setBackBusy(!1))};rt.onBackClick=Ku,$e.onEscape=()=>{document.querySelector(".keyboard-help:not([hidden])")||document.querySelector(".prefs__panel:not([hidden])")||Ku()};const ju=V=>{if(We=requestAnimationFrame(ju),E.isRenderPaused()||ke)return;te.hasReadinessWork()&&me.markReadinessWork();const be=me.sample(V);te.markInteractionFrame(be.dtMs);const Ae=Ue.evaluate(be,me);Ae&&Ae!==i.current.quality&&(e.warn("quality","adaptive-downgrade","Adaptive quality downgrade triggered",{from:i.current.quality,to:Ae,rollingFps:Math.round(be.rollingFps*10)/10,rollingMs:Math.round(be.rollingMs*10)/10,severeFrameCount:be.severeFrameCount}),i.setQuality(Ae));const et=q.update(V),St=te.update(V);!et&&!St&&!te.hasReadinessWork()||(Y.camera.updateMatrixWorld(),q.getKeyLightWorldDir(Gu),Vu.copy(Gu).transformDirection(Y.camera.matrixWorldInverse),re.material.setKeyLightDirView(Vu),X.render())};We=requestAnimationFrame(ju),e.info("boot","pre-entry-raf-start","Production RAF started under loading overlay before entry CTA",{artworkCount:ae,renderer:oi(E.renderer)}),await ki(),e.info("boot","first-full-frame-rendered","First full-size production frame rendered under loading overlay",{activeArtwork:(ah=u[te.index])==null?void 0:ah.id,renderer:oi(E.renderer)}),await ki(),e.info("boot","second-full-frame-presented","Second full-size production frame presented under loading overlay; entry CTA may now be enabled",{activeArtwork:(oh=u[te.index])==null?void 0:oh.id,renderer:oi(E.renderer)}),e.info("boot","entry-cta-enabled","Loading screen readiness gate complete; enabling entry CTA",{artworkCount:ae,pendingCount:st.pendingCount,finalPathWarmed:us,timelinePrewarm:Na,uiPrewarm:T,renderer:oi(E.renderer)}),e.info("boot","performance-gate","Startup performance gate (v0.67 P-07 acceptance evidence)",{schemaVersion:1,startupReadinessMode:J,artworkCount:ae,automaticQualityChangesEnabled:_e,activeQuality:i.current.quality,entryWarmCount:tt.length,deferredWarmCount:gt,preloadMode:st.preloadMode,startupMsToEntryCta:Math.round((performance.now()-r)*10)/10,postRevealFrameBudgetMs:Ve.postRevealFrameBudgetMs,postRevealBatchCap:Ve.postRevealBatchCap,fullyReadyCount:st.fullyReadyCount,pendingCount:st.pendingCount,deferredArtworkCount:st.deferredArtworkCount}),re.group.visible=!1,N==null||N.setVisible(!1),b.setStatus("Museum wird vorbereitet"),await kn.startAt("hub"),b.setProgress(100),await b.reveal(),b.dispose(),L.focusInitialTarget(),window.addEventListener("beforeunload",()=>{i.normalizeStartupAudio("beforeunload-close",!1),cancelAnimationFrame(We),W!==0&&cancelAnimationFrame(W),an!==null&&fn(an),Te==null||Te.disconnect(),Mt!==void 0&&clearInterval(Mt),_!==void 0&&clearTimeout(_),document.removeEventListener("visibilitychange",lt),window.removeEventListener("pagehide",yt),window.removeEventListener("pageshow",xt),window.removeEventListener("freeze",Vt),window.removeEventListener("resume",ct),hs(),w(),ot&&window.removeEventListener("keydown",Xt),window.removeEventListener("pointerdown",ze),window.removeEventListener("keydown",Ye),window.removeEventListener("pointerdown",H),window.removeEventListener("pointerup",ee),window.removeEventListener("pointercancel",ee),C!==void 0&&clearTimeout(C),window.removeEventListener("resize",pe),window.removeEventListener("orientationchange",pe),ye==null||ye.removeEventListener("resize",pe),ye==null||ye.removeEventListener("scroll",pe),Me==null||Me.disconnect(),clearTimeout(j),e.info("boot","shutdown","Disposing FREYRAUM runtime"),kn.dispose(),i.dispose(),le.dispose(),Z.dispose(),$e.dispose(),xe.dispose(),rt.dispose(),D.dispose(),Se(),ne==null||ne.remove(),ne=null,Ze.dispose(),Ie.dispose(),Ee.dispose(),pt.dispose(),De.dispose(),Be.dispose(),k.dispose(),M.remove(),s.dispose(),te.dispose(),re.dispose(),N==null||N.dispose(),Q.dispose(),te.proceduralFactory.disposeAll(),q.dispose(),X.dispose(),Y.dispose(),E.dispose()})}rb().catch(r=>{hr().error("boot","startup-failed","Fatal startup failure",r);const e=document.getElementById("app");if(e){const t=nb();document.documentElement.style.backgroundColor=t,document.body.style.backgroundColor=t,e.style.backgroundColor=t,kd(e,{category:"startup",reason:r instanceof Error?r.message:"Unbekannter Fehler beim Initialisieren.",surfaceColor:t,artworks:Wu,onRetry:()=>window.location.reload()})}})})();
