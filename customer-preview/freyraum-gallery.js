function freyraumPseudoRandom(){const cryptoApi=globalThis.crypto;if(cryptoApi&&cryptoApi.getRandomValues){const values=new Uint32Array(1);cryptoApi.getRandomValues(values);return values[0]/4294967296}const now=Date.now();const perf=globalThis.performance&&globalThis.performance.now?globalThis.performance.now():0;return (Math.sin(now+perf)*10000)%1}
var y_=Object.defineProperty;var b_=(dn,vn,Ni)=>vn in dn?y_(dn,vn,{enumerable:!0,configurable:!0,writable:!0,value:Ni}):dn[vn]=Ni;var v=(dn,vn,Ni)=>b_(dn,typeof vn!="symbol"?vn+"":vn,Ni);(function(){"use strict";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var pc,mc;const dn="166",xn="",kt="srgb",en="srgb-linear",ys="display-p3",hr="display-p3-linear",fr="linear",at="srgb",pr="rec709",mr="p3",Ba="300 es";class Yn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Et=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Oa=1234567;const Fi=Math.PI/180,jn=180/Math.PI;function Kn(){const i=freyraumPseudoRandom()*4294967295|0,e=freyraumPseudoRandom()*4294967295|0,t=freyraumPseudoRandom()*4294967295|0,n=freyraumPseudoRandom()*4294967295|0;return(Et[i&255]+Et[i>>8&255]+Et[i>>16&255]+Et[i>>24&255]+"-"+Et[e&255]+Et[e>>8&255]+"-"+Et[e>>16&15|64]+Et[e>>24&255]+"-"+Et[t&63|128]+Et[t>>8&255]+"-"+Et[t>>16&255]+Et[t>>24&255]+Et[n&255]+Et[n>>8&255]+Et[n>>16&255]+Et[n>>24&255]).toLowerCase()}function Tt(i,e,t){return Math.max(e,Math.min(t,i))}function bs(i,e){return(i%e+e)%e}function Rc(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Pc(i,e,t){return i!==e?(t-i)/(e-i):0}function Ui(i,e,t){return(1-t)*i+t*e}function Ic(i,e,t,n){return Ui(i,e,1-Math.exp(-t*n))}function Lc(i,e=1){return e-Math.abs(bs(i,e*2)-e)}function Dc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Nc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Fc(i,e){return i+Math.floor(freyraumPseudoRandom()*(e-i+1))}function Uc(i,e){return i+freyraumPseudoRandom()*(e-i)}function kc(i){return i*(.5-freyraumPseudoRandom())}function Bc(i){i!==void 0&&(Oa=i);let e=Oa+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Oc(i){return i*Fi}function Hc(i){return i*jn}function zc(i){return(i&i-1)===0&&i!==0}function Gc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wc(i,e,t,n,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),d=a((e+n)/2),u=s((e-n)/2),h=a((e-n)/2),m=s((n-e)/2),_=a((n-e)/2);switch(r){case"XYX":i.set(o*d,l*u,l*h,o*c);break;case"YZY":i.set(l*h,o*d,l*u,o*c);break;case"ZXZ":i.set(l*u,l*h,o*d,o*c);break;case"XZX":i.set(o*d,l*_,l*m,o*c);break;case"YXY":i.set(l*m,o*d,l*_,o*c);break;case"ZYZ":i.set(l*_,l*m,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Zn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Xc={DEG2RAD:Fi,RAD2DEG:jn,generateUUID:Kn,clamp:Tt,euclideanModulo:bs,mapLinear:Rc,inverseLerp:Pc,lerp:Ui,damp:Ic,pingpong:Lc,smoothstep:Dc,smootherstep:Nc,randInt:Fc,randFloat:Uc,randFloatSpread:kc,seededRandom:Bc,degToRad:Oc,radToDeg:Hc,isPowerOfTwo:zc,ceilPowerOfTwo:Gc,floorPowerOfTwo:Vc,setQuaternionFromProperEuler:Wc,normalize:Pt,denormalize:Zn};class Le{constructor(e=0,t=0){Le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class We{constructor(e,t,n,r,s,a,o,l,c){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=t,d[4]=s,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],u=n[7],h=n[2],m=n[5],_=n[8],g=r[0],f=r[3],p=r[6],y=r[1],M=r[4],E=r[7],R=r[2],T=r[5],A=r[8];return s[0]=a*g+o*y+l*R,s[3]=a*f+o*M+l*T,s[6]=a*p+o*E+l*A,s[1]=c*g+d*y+u*R,s[4]=c*f+d*M+u*T,s[7]=c*p+d*E+u*A,s[2]=h*g+m*y+_*R,s[5]=h*f+m*M+_*T,s[8]=h*p+m*E+_*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*s*d+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*s,m=c*s-a*l,_=t*u+n*h+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return e[0]=u*g,e[1]=(r*c-d*n)*g,e[2]=(o*n-r*a)*g,e[3]=h*g,e[4]=(d*t-r*l)*g,e[5]=(r*s-o*t)*g,e[6]=m*g,e[7]=(n*l-c*t)*g,e[8]=(a*t-n*s)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ms.makeScale(e,t)),this}rotate(e){return this.premultiply(Ms.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ms.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ms=new We;function Ha(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ki(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $c(){const i=ki("canvas");return i.style.display="block",i}const za={};function Ga(i){i in za||(za[i]=!0,console.warn(i))}function qc(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Va=new We().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Wa=new We().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gr={[en]:{transfer:fr,primaries:pr,toReference:i=>i,fromReference:i=>i},[kt]:{transfer:at,primaries:pr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[hr]:{transfer:fr,primaries:mr,toReference:i=>i.applyMatrix3(Wa),fromReference:i=>i.applyMatrix3(Va)},[ys]:{transfer:at,primaries:mr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Wa),fromReference:i=>i.applyMatrix3(Va).convertLinearToSRGB()}},Yc=new Set([en,hr]),Je={enabled:!0,_workingColorSpace:en,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Yc.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=gr[e].toReference,r=gr[t].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return gr[i].primaries},getTransfer:function(i){return i===xn?fr:gr[i].transfer}};function Qn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ss(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Jn;class jc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Jn===void 0&&(Jn=ki("canvas")),Jn.width=e.width,Jn.height=e.height;const n=Jn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Jn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=ki("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Qn(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Qn(t[n]/255)*255):t[n]=Qn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Kc=0;class Xa{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kc++}),this.uuid=Kn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ws(r[a].image)):s.push(ws(r[a]))}else s=ws(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function ws(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?jc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Zc=0;class Mt extends Yn{constructor(e=Mt.DEFAULT_IMAGE,t=Mt.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,l=1009,c=Mt.DEFAULT_ANISOTROPY,d=xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zc++}),this.uuid=Kn(),this.name="",this.source=new Xa(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Mt.DEFAULT_IMAGE=null,Mt.DEFAULT_MAPPING=300,Mt.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,t=0,n=0,r=1){lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],m=l[5],_=l[9],g=l[2],f=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-g)<.01&&Math.abs(_-f)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+g)<.1&&Math.abs(_+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,E=(m+1)/2,R=(p+1)/2,T=(d+h)/4,A=(u+g)/4,N=(_+f)/4;return M>E&&M>R?M<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(M),r=T/n,s=A/n):E>R?E<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),n=T/r,s=N/r):R<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),n=A/s,r=N/s),this.set(n,r,s,t),this}let y=Math.sqrt((f-_)*(f-_)+(u-g)*(u-g)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(f-_)/y,this.y=(u-g)/y,this.z=(h-d)/y,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this.w=freyraumPseudoRandom(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qc extends Yn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Mt(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Xa(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wt extends Qc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class $a extends Mt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Jc extends Mt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bi{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],d=n[r+2],u=n[r+3];const h=s[a+0],m=s[a+1],_=s[a+2],g=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=_,e[t+3]=g;return}if(u!==g||l!==h||c!==m||d!==_){let f=1-o;const p=l*h+c*m+d*_+u*g,y=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const R=Math.sqrt(M),T=Math.atan2(R,p*y);f=Math.sin(f*T)/R,o=Math.sin(o*T)/R}const E=o*y;if(l=l*f+h*E,c=c*f+m*E,d=d*f+_*E,u=u*f+g*E,f===1-o){const R=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=R,c*=R,d*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],d=n[r+3],u=s[a],h=s[a+1],m=s[a+2],_=s[a+3];return e[t]=o*_+d*u+l*m-c*h,e[t+1]=l*_+d*h+c*u-o*m,e[t+2]=c*_+d*m+o*h-l*u,e[t+3]=d*_-o*u-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(r/2),u=o(s/2),h=l(n/2),m=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"YXZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"ZXY":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"ZYX":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"YZX":this._x=h*d*u+c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u-h*m*_;break;case"XZY":this._x=h*d*u-c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u+h*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=n+o+u;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(d-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Tt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+r*c-s*l,this._y=r*d+a*l+s*o-n*c,this._z=s*d+a*c+n*l-r*o,this._w=a*d-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=n*u+this._x*h,this._y=r*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*freyraumPseudoRandom(),t=2*Math.PI*freyraumPseudoRandom(),n=freyraumPseudoRandom(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qa.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qa.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),d=2*(o*t-s*r),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*d,this.y=n+l*d+o*c-s*u,this.z=r+l*u+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Es.copy(this).projectOnVector(e),this.sub(Es)}reflect(e){return this.sub(Es.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=freyraumPseudoRandom(),this.y=freyraumPseudoRandom(),this.z=freyraumPseudoRandom(),this}randomDirection(){const e=freyraumPseudoRandom()*Math.PI*2,t=freyraumPseudoRandom()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Es=new H,qa=new Bi;class Oi{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,jt):jt.fromBufferAttribute(s,a),jt.applyMatrix4(e.matrixWorld),this.expandByPoint(jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_r.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_r.copy(n.boundingBox)),_r.applyMatrix4(e.matrixWorld),this.union(_r)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,jt),jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hi),vr.subVectors(this.max,Hi),ei.subVectors(e.a,Hi),ti.subVectors(e.b,Hi),ni.subVectors(e.c,Hi),yn.subVectors(ti,ei),bn.subVectors(ni,ti),Rn.subVectors(ei,ni);let t=[0,-yn.z,yn.y,0,-bn.z,bn.y,0,-Rn.z,Rn.y,yn.z,0,-yn.x,bn.z,0,-bn.x,Rn.z,0,-Rn.x,-yn.y,yn.x,0,-bn.y,bn.x,0,-Rn.y,Rn.x,0];return!Ts(t,ei,ti,ni,vr)||(t=[1,0,0,0,1,0,0,0,1],!Ts(t,ei,ti,ni,vr))?!1:(xr.crossVectors(yn,bn),t=[xr.x,xr.y,xr.z],Ts(t,ei,ti,ni,vr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const un=[new H,new H,new H,new H,new H,new H,new H,new H],jt=new H,_r=new Oi,ei=new H,ti=new H,ni=new H,yn=new H,bn=new H,Rn=new H,Hi=new H,vr=new H,xr=new H,Pn=new H;function Ts(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Pn.fromArray(i,s);const o=r.x*Math.abs(Pn.x)+r.y*Math.abs(Pn.y)+r.z*Math.abs(Pn.z),l=e.dot(Pn),c=t.dot(Pn),d=n.dot(Pn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const ed=new Oi,zi=new H,As=new H;class Cs{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ed.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;zi.subVectors(e,this.center);const t=zi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(zi,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(As.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(zi.copy(e.center).add(As)),this.expandByPoint(zi.copy(e.center).sub(As))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hn=new H,Rs=new H,yr=new H,Mn=new H,Ps=new H,br=new H,Is=new H;class td{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Rs.copy(e).add(t).multiplyScalar(.5),yr.copy(t).sub(e).normalize(),Mn.copy(this.origin).sub(Rs);const s=e.distanceTo(t)*.5,a=-this.direction.dot(yr),o=Mn.dot(this.direction),l=-Mn.dot(yr),c=Mn.lengthSq(),d=Math.abs(1-a*a);let u,h,m,_;if(d>0)if(u=a*l-o,h=a*o-l,_=s*d,u>=0)if(h>=-_)if(h<=_){const g=1/d;u*=g,h*=g,m=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=s,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h<=-_?(u=Math.max(0,-(-a*s+o)),h=u>0?-s:Math.min(Math.max(-s,-l),s),m=-u*u+h*(h+2*l)+c):h<=_?(u=0,h=Math.min(Math.max(-s,-l),s),m=h*(h+2*l)+c):(u=Math.max(0,-(a*s+o)),h=u>0?s:Math.min(Math.max(-s,-l),s),m=-u*u+h*(h+2*l)+c);else h=a>0?-s:s,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Rs).addScaledVector(yr,h),m}intersectSphere(e,t){hn.subVectors(e.center,this.origin);const n=hn.dot(this.direction),r=hn.dot(hn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),d>=0?(s=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,n,r,s){Ps.subVectors(t,e),br.subVectors(n,e),Is.crossVectors(Ps,br);let a=this.direction.dot(Is),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Mn.subVectors(this.origin,e);const l=o*this.direction.dot(br.crossVectors(Mn,br));if(l<0)return null;const c=o*this.direction.dot(Ps.cross(Mn));if(c<0||l+c>a)return null;const d=-o*Mn.dot(Is);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,t,n,r,s,a,o,l,c,d,u,h,m,_,g,f){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,d,u,h,m,_,g,f)}set(e,t,n,r,s,a,o,l,c,d,u,h,m,_,g,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=d,p[10]=u,p[14]=h,p[3]=m,p[7]=_,p[11]=g,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/ii.setFromMatrixColumn(e,0).length(),s=1/ii.setFromMatrixColumn(e,1).length(),a=1/ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const h=a*d,m=a*u,_=o*d,g=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=m+_*c,t[5]=h-g*c,t[9]=-o*l,t[2]=g-h*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,m=l*u,_=c*d,g=c*u;t[0]=h+g*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-_,t[6]=g+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,m=l*u,_=c*d,g=c*u;t[0]=h-g*o,t[4]=-a*u,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*d,t[9]=g-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,m=a*u,_=o*d,g=o*u;t[0]=l*d,t[4]=_*c-m,t[8]=h*c+g,t[1]=l*u,t[5]=g*c+h,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*c,_=o*l,g=o*c;t[0]=l*d,t[4]=g-h*u,t[8]=_*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*u+_,t[10]=h-g*u}else if(e.order==="XZY"){const h=a*l,m=a*c,_=o*l,g=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+g,t[5]=a*d,t[9]=m*u-_,t[2]=_*u-m,t[6]=o*d,t[10]=g*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nd,e,id)}lookAt(e,t,n){const r=this.elements;return Bt.subVectors(e,t),Bt.lengthSq()===0&&(Bt.z=1),Bt.normalize(),Sn.crossVectors(n,Bt),Sn.lengthSq()===0&&(Math.abs(n.z)===1?Bt.x+=1e-4:Bt.z+=1e-4,Bt.normalize(),Sn.crossVectors(n,Bt)),Sn.normalize(),Mr.crossVectors(Bt,Sn),r[0]=Sn.x,r[4]=Mr.x,r[8]=Bt.x,r[1]=Sn.y,r[5]=Mr.y,r[9]=Bt.y,r[2]=Sn.z,r[6]=Mr.z,r[10]=Bt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],u=n[5],h=n[9],m=n[13],_=n[2],g=n[6],f=n[10],p=n[14],y=n[3],M=n[7],E=n[11],R=n[15],T=r[0],A=r[4],N=r[8],S=r[12],x=r[1],P=r[5],V=r[9],k=r[13],z=r[2],j=r[6],D=r[10],Z=r[14],$=r[3],ue=r[7],he=r[11],L=r[15];return s[0]=a*T+o*x+l*z+c*$,s[4]=a*A+o*P+l*j+c*ue,s[8]=a*N+o*V+l*D+c*he,s[12]=a*S+o*k+l*Z+c*L,s[1]=d*T+u*x+h*z+m*$,s[5]=d*A+u*P+h*j+m*ue,s[9]=d*N+u*V+h*D+m*he,s[13]=d*S+u*k+h*Z+m*L,s[2]=_*T+g*x+f*z+p*$,s[6]=_*A+g*P+f*j+p*ue,s[10]=_*N+g*V+f*D+p*he,s[14]=_*S+g*k+f*Z+p*L,s[3]=y*T+M*x+E*z+R*$,s[7]=y*A+M*P+E*j+R*ue,s[11]=y*N+M*V+E*D+R*he,s[15]=y*S+M*k+E*Z+R*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],m=e[14],_=e[3],g=e[7],f=e[11],p=e[15];return _*(+s*l*u-r*c*u-s*o*h+n*c*h+r*o*m-n*l*m)+g*(+t*l*m-t*c*h+s*a*h-r*a*m+r*c*d-s*l*d)+f*(+t*c*u-t*o*m-s*a*u+n*a*m+s*o*d-n*c*d)+p*(-r*o*d-t*l*u+t*o*h+r*a*u-n*a*h+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],m=e[11],_=e[12],g=e[13],f=e[14],p=e[15],y=u*f*c-g*h*c+g*l*m-o*f*m-u*l*p+o*h*p,M=_*h*c-d*f*c-_*l*m+a*f*m+d*l*p-a*h*p,E=d*g*c-_*u*c+_*o*m-a*g*m-d*o*p+a*u*p,R=_*u*l-d*g*l-_*o*h+a*g*h+d*o*f-a*u*f,T=t*y+n*M+r*E+s*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=y*A,e[1]=(g*h*s-u*f*s-g*r*m+n*f*m+u*r*p-n*h*p)*A,e[2]=(o*f*s-g*l*s+g*r*c-n*f*c-o*r*p+n*l*p)*A,e[3]=(u*l*s-o*h*s-u*r*c+n*h*c+o*r*m-n*l*m)*A,e[4]=M*A,e[5]=(d*f*s-_*h*s+_*r*m-t*f*m-d*r*p+t*h*p)*A,e[6]=(_*l*s-a*f*s-_*r*c+t*f*c+a*r*p-t*l*p)*A,e[7]=(a*h*s-d*l*s+d*r*c-t*h*c-a*r*m+t*l*m)*A,e[8]=E*A,e[9]=(_*u*s-d*g*s-_*n*m+t*g*m+d*n*p-t*u*p)*A,e[10]=(a*g*s-_*o*s+_*n*c-t*g*c-a*n*p+t*o*p)*A,e[11]=(d*o*s-a*u*s-d*n*c+t*u*c+a*n*m-t*o*m)*A,e[12]=R*A,e[13]=(d*g*r-_*u*r+_*n*h-t*g*h-d*n*f+t*u*f)*A,e[14]=(_*o*r-a*g*r-_*n*l+t*g*l+a*n*f-t*o*f)*A,e[15]=(a*u*r-d*o*r+d*n*l-t*u*l-a*n*h+t*o*h)*A,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+n,d*l-r*a,0,c*l-r*o,d*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,d=a+a,u=o+o,h=s*c,m=s*d,_=s*u,g=a*d,f=a*u,p=o*u,y=l*c,M=l*d,E=l*u,R=n.x,T=n.y,A=n.z;return r[0]=(1-(g+p))*R,r[1]=(m+E)*R,r[2]=(_-M)*R,r[3]=0,r[4]=(m-E)*T,r[5]=(1-(h+p))*T,r[6]=(f+y)*T,r[7]=0,r[8]=(_+M)*A,r[9]=(f-y)*A,r[10]=(1-(h+g))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=ii.set(r[0],r[1],r[2]).length();const a=ii.set(r[4],r[5],r[6]).length(),o=ii.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Kt.copy(this);const c=1/s,d=1/a,u=1/o;return Kt.elements[0]*=c,Kt.elements[1]*=c,Kt.elements[2]*=c,Kt.elements[4]*=d,Kt.elements[5]*=d,Kt.elements[6]*=d,Kt.elements[8]*=u,Kt.elements[9]*=u,Kt.elements[10]*=u,t.setFromRotationMatrix(Kt),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=2e3){const l=this.elements,c=2*s/(t-e),d=2*s/(n-r),u=(t+e)/(t-e),h=(n+r)/(n-r);let m,_;if(o===2e3)m=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===2001)m=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=2e3){const l=this.elements,c=1/(t-e),d=1/(n-r),u=1/(a-s),h=(t+e)*c,m=(n+r)*d;let _,g;if(o===2e3)_=(a+s)*u,g=-2*u;else if(o===2001)_=s*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ii=new H,Kt=new ht,nd=new H(0,0,0),id=new H(1,1,1),Sn=new H,Mr=new H,Bt=new H,Ya=new ht,ja=new Bi;class tn{constructor(e=0,t=0,n=0,r=tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],d=r[9],u=r[2],h=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Tt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Tt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Tt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ya.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ya,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ja.setFromEuler(this),this.setFromQuaternion(ja,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}tn.DEFAULT_ORDER="XYZ";class Ka{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let rd=0;const Za=new H,ri=new Bi,fn=new ht,Sr=new H,Gi=new H,sd=new H,ad=new Bi,Qa=new H(1,0,0),Ja=new H(0,1,0),eo=new H(0,0,1),to={type:"added"},od={type:"removed"},si={type:"childadded",child:null},Ls={type:"childremoved",child:null};class St extends Yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new H,t=new tn,n=new Bi,r=new H(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ht},normalMatrix:{value:new We}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ri.setFromAxisAngle(e,t),this.quaternion.multiply(ri),this}rotateOnWorldAxis(e,t){return ri.setFromAxisAngle(e,t),this.quaternion.premultiply(ri),this}rotateX(e){return this.rotateOnAxis(Qa,e)}rotateY(e){return this.rotateOnAxis(Ja,e)}rotateZ(e){return this.rotateOnAxis(eo,e)}translateOnAxis(e,t){return Za.copy(e).applyQuaternion(this.quaternion),this.position.add(Za.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qa,e)}translateY(e){return this.translateOnAxis(Ja,e)}translateZ(e){return this.translateOnAxis(eo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Sr.copy(e):Sr.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(Gi,Sr,this.up):fn.lookAt(Sr,Gi,this.up),this.quaternion.setFromRotationMatrix(fn),r&&(fn.extractRotation(r.matrixWorld),ri.setFromRotationMatrix(fn),this.quaternion.premultiply(ri.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(to),si.child=e,this.dispatchEvent(si),si.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(od),Ls.child=e,this.dispatchEvent(Ls),Ls.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(to),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,e,sd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,ad,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=r,n;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}St.DEFAULT_UP=new H(0,1,0),St.DEFAULT_MATRIX_AUTO_UPDATE=!0,St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Zt=new H,pn=new H,Ds=new H,mn=new H,ai=new H,oi=new H,no=new H,Ns=new H,Fs=new H,Us=new H;class nn{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Zt.subVectors(e,t),r.cross(Zt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Zt.subVectors(r,t),pn.subVectors(n,t),Ds.subVectors(e,t);const a=Zt.dot(Zt),o=Zt.dot(pn),l=Zt.dot(Ds),c=pn.dot(pn),d=pn.dot(Ds),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const h=1/u,m=(c*l-o*d)*h,_=(a*d-o*l)*h;return s.set(1-m-_,_,m)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mn.x),l.addScaledVector(a,mn.y),l.addScaledVector(o,mn.z),l)}static isFrontFacing(e,t,n,r){return Zt.subVectors(n,t),pn.subVectors(e,t),Zt.cross(pn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zt.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),Zt.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return nn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return nn.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;ai.subVectors(r,n),oi.subVectors(s,n),Ns.subVectors(e,n);const l=ai.dot(Ns),c=oi.dot(Ns);if(l<=0&&c<=0)return t.copy(n);Fs.subVectors(e,r);const d=ai.dot(Fs),u=oi.dot(Fs);if(d>=0&&u<=d)return t.copy(r);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(ai,a);Us.subVectors(e,s);const m=ai.dot(Us),_=oi.dot(Us);if(_>=0&&m<=_)return t.copy(s);const g=m*c-l*_;if(g<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(oi,o);const f=d*_-m*u;if(f<=0&&u-d>=0&&m-_>=0)return no.subVectors(s,r),o=(u-d)/(u-d+(m-_)),t.copy(r).addScaledVector(no,o);const p=1/(f+g+h);return a=g*p,o=h*p,t.copy(n).addScaledVector(ai,a).addScaledVector(oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const io={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wn={h:0,s:0,l:0},wr={h:0,s:0,l:0};function ks(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Be{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Je.workingColorSpace){if(e=bs(e,1),t=Tt(t,0,1),n=Tt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=ks(a,s,e+1/3),this.g=ks(a,s,e),this.b=ks(a,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,t=kt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){const n=io[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Qn(e.r),this.g=Qn(e.g),this.b=Qn(e.b),this}copyLinearToSRGB(e){return this.r=Ss(e.r),this.g=Ss(e.g),this.b=Ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return Je.fromWorkingColorSpace(At.copy(this),e),Math.round(Tt(At.r*255,0,255))*65536+Math.round(Tt(At.g*255,0,255))*256+Math.round(Tt(At.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(At.copy(this),t);const n=At.r,r=At.g,s=At.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(At.copy(this),t),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=kt){Je.fromWorkingColorSpace(At.copy(this),e);const t=At.r,n=At.g,r=At.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(wn),this.setHSL(wn.h+e,wn.s+t,wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wn),e.getHSL(wr);const n=Ui(wn.h,wr.h,t),r=Ui(wn.s,wr.s,t),s=Ui(wn.l,wr.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new Be;Be.NAMES=io;let ld=0;class Vi extends Yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=Kn(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class Er extends Vi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new H,Tr=new Le;class rn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Ga("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Tr.fromBufferAttribute(this,t),Tr.applyMatrix3(e),this.setXY(t,Tr.x,Tr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),r=Pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),r=Pt(r,this.array),s=Pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}}class ro extends rn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class so extends rn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class gn extends rn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let cd=0;const Xt=new ht,Bs=new St,li=new H,Ot=new Oi,Wi=new Oi,yt=new H;class En extends Yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ha(e)?so:ro)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new We().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xt.makeRotationFromQuaternion(e),this.applyMatrix4(Xt),this}rotateX(e){return Xt.makeRotationX(e),this.applyMatrix4(Xt),this}rotateY(e){return Xt.makeRotationY(e),this.applyMatrix4(Xt),this}rotateZ(e){return Xt.makeRotationZ(e),this.applyMatrix4(Xt),this}translate(e,t,n){return Xt.makeTranslation(e,t,n),this.applyMatrix4(Xt),this}scale(e,t,n){return Xt.makeScale(e,t,n),this.applyMatrix4(Xt),this}lookAt(e){return Bs.lookAt(e),Bs.updateMatrix(),this.applyMatrix4(Bs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(li).negate(),this.translate(li.x,li.y,li.z),this}setFromPoints(e){const t=[];for(let n=0,r=e.length;n<r;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new gn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Ot.setFromBufferAttribute(s),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Ot.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Ot.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Ot.min),this.boundingBox.expandByPoint(Ot.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(Ot.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Wi.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(Ot.min,Wi.min),Ot.expandByPoint(yt),yt.addVectors(Ot.max,Wi.max),Ot.expandByPoint(yt)):(Ot.expandByPoint(Wi.min),Ot.expandByPoint(Wi.max))}Ot.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)yt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(yt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)yt.fromBufferAttribute(o,c),l&&(li.fromBufferAttribute(e,c),yt.add(li)),r=Math.max(r,n.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let N=0;N<n.count;N++)o[N]=new H,l[N]=new H;const c=new H,d=new H,u=new H,h=new Le,m=new Le,_=new Le,g=new H,f=new H;function p(N,S,x){c.fromBufferAttribute(n,N),d.fromBufferAttribute(n,S),u.fromBufferAttribute(n,x),h.fromBufferAttribute(s,N),m.fromBufferAttribute(s,S),_.fromBufferAttribute(s,x),d.sub(c),u.sub(c),m.sub(h),_.sub(h);const P=1/(m.x*_.y-_.x*m.y);isFinite(P)&&(g.copy(d).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(P),f.copy(u).multiplyScalar(m.x).addScaledVector(d,-_.x).multiplyScalar(P),o[N].add(g),o[S].add(g),o[x].add(g),l[N].add(f),l[S].add(f),l[x].add(f))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let N=0,S=y.length;N<S;++N){const x=y[N],P=x.start,V=x.count;for(let k=P,z=P+V;k<z;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const M=new H,E=new H,R=new H,T=new H;function A(N){R.fromBufferAttribute(r,N),T.copy(R);const S=o[N];M.copy(S),M.sub(R.multiplyScalar(R.dot(S))).normalize(),E.crossVectors(T,S);const P=E.dot(l[N])<0?-1:1;a.setXYZW(N,M.x,M.y,M.z,P)}for(let N=0,S=y.length;N<S;++N){const x=y[N],P=x.start,V=x.count;for(let k=P,z=P+V;k<z;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);const r=new H,s=new H,a=new H,o=new H,l=new H,c=new H,d=new H,u=new H;if(e)for(let h=0,m=e.count;h<m;h+=3){const _=e.getX(h+0),g=e.getX(h+1),f=e.getX(h+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,f),d.subVectors(a,s),u.subVectors(r,s),d.cross(u),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,f),o.add(d),l.add(d),c.add(d),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,s),u.subVectors(r,s),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let m=0,_=0;for(let g=0,f=l.length;g<f;g++){o.isInterleavedBufferAttribute?m=l[g]*o.data.stride+o.offset:m=l[g]*d;for(let p=0;p<d;p++)h[_++]=c[m++]}return new rn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new En,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],m=e(h,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const m=c[u];d.push(m.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],u=s[c];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ao=new ht,In=new td,Ar=new Cs,oo=new H,ci=new H,di=new H,ui=new H,Os=new H,Cr=new H,Rr=new Le,Pr=new Le,Ir=new Le,lo=new H,co=new H,uo=new H,Lr=new H,Dr=new H;class ct extends St{constructor(e=new En,t=new Er){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Cr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],u=s[l];d!==0&&(Os.fromBufferAttribute(u,e),a?Cr.addScaledVector(Os,d):Cr.addScaledVector(Os.sub(t),d))}t.add(Cr)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(s),In.copy(e.ray).recast(e.near),!(Ar.containsPoint(In.origin)===!1&&(In.intersectSphere(Ar,oo)===null||In.origin.distanceToSquared(oo)>(e.far-e.near)**2))&&(ao.copy(s).invert(),In.copy(e.ray).applyMatrix4(ao),!(n.boundingBox!==null&&In.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,In)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=h.length;_<g;_++){const f=h[_],p=a[f.materialIndex],y=Math.max(f.start,m.start),M=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let E=y,R=M;E<R;E+=3){const T=o.getX(E),A=o.getX(E+1),N=o.getX(E+2);r=Nr(this,p,e,n,c,d,u,T,A,N),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=f.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),g=Math.min(o.count,m.start+m.count);for(let f=_,p=g;f<p;f+=3){const y=o.getX(f),M=o.getX(f+1),E=o.getX(f+2);r=Nr(this,a,e,n,c,d,u,y,M,E),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,g=h.length;_<g;_++){const f=h[_],p=a[f.materialIndex],y=Math.max(f.start,m.start),M=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let E=y,R=M;E<R;E+=3){const T=E,A=E+1,N=E+2;r=Nr(this,p,e,n,c,d,u,T,A,N),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=f.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let f=_,p=g;f<p;f+=3){const y=f,M=f+1,E=f+2;r=Nr(this,a,e,n,c,d,u,y,M,E),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}}}}function dd(i,e,t,n,r,s,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===0,o),l===null)return null;Dr.copy(o),Dr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Dr);return c<t.near||c>t.far?null:{distance:c,point:Dr.clone(),object:i}}function Nr(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,ci),i.getVertexPosition(l,di),i.getVertexPosition(c,ui);const d=dd(i,e,t,n,ci,di,ui,Lr);if(d){r&&(Rr.fromBufferAttribute(r,o),Pr.fromBufferAttribute(r,l),Ir.fromBufferAttribute(r,c),d.uv=nn.getInterpolation(Lr,ci,di,ui,Rr,Pr,Ir,new Le)),s&&(Rr.fromBufferAttribute(s,o),Pr.fromBufferAttribute(s,l),Ir.fromBufferAttribute(s,c),d.uv1=nn.getInterpolation(Lr,ci,di,ui,Rr,Pr,Ir,new Le)),a&&(lo.fromBufferAttribute(a,o),co.fromBufferAttribute(a,l),uo.fromBufferAttribute(a,c),d.normal=nn.getInterpolation(Lr,ci,di,ui,lo,co,uo,new H),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new H,materialIndex:0};nn.getNormal(ci,di,ui,u.normal),d.face=u}return d}class hi extends En{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],u=[];let h=0,m=0;_("z","y","x",-1,-1,n,t,e,a,s,0),_("z","y","x",1,-1,n,t,-e,a,s,1),_("x","z","y",1,1,e,n,t,r,a,2),_("x","z","y",1,-1,e,n,-t,r,a,3),_("x","y","z",1,-1,e,t,n,r,s,4),_("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new gn(c,3)),this.setAttribute("normal",new gn(d,3)),this.setAttribute("uv",new gn(u,2));function _(g,f,p,y,M,E,R,T,A,N,S){const x=E/A,P=R/N,V=E/2,k=R/2,z=T/2,j=A+1,D=N+1;let Z=0,$=0;const ue=new H;for(let he=0;he<D;he++){const L=he*P-k;for(let ee=0;ee<j;ee++){const se=ee*x-V;ue[g]=se*y,ue[f]=L*M,ue[p]=z,c.push(ue.x,ue.y,ue.z),ue[g]=0,ue[f]=0,ue[p]=T>0?1:-1,d.push(ue.x,ue.y,ue.z),u.push(ee/A),u.push(1-he/N),Z+=1}}for(let he=0;he<N;he++)for(let L=0;L<A;L++){const ee=h+L+j*he,se=h+L+j*(he+1),X=h+(L+1)+j*(he+1),Y=h+(L+1)+j*he;l.push(ee,se,Y),l.push(se,X,Y),$+=6}o.addGroup(m,$,S),m+=$,h+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function fi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function It(i){const e={};for(let t=0;t<i.length;t++){const n=fi(i[t]);for(const r in n)e[r]=n[r]}return e}function ud(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ho(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Xi={clone:fi,merge:It};var hd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Lt extends Vi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hd,this.fragmentShader=fd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fi(e.uniforms),this.uniformsGroups=ud(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class fo extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=2e3}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Tn=new H,po=new Le,mo=new Le;class Ft extends fo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=jn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Fi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return jn*2*Math.atan(Math.tan(Fi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Tn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Tn.x,Tn.y).multiplyScalar(-e/Tn.z),Tn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Tn.x,Tn.y).multiplyScalar(-e/Tn.z)}getViewSize(e,t){return this.getViewBounds(e,po,mo),t.subVectors(mo,po)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Fi*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const pi=-90,mi=1;class pd extends St{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ft(pi,mi,e,t);r.layers=this.layers,this.add(r);const s=new Ft(pi,mi,e,t);s.layers=this.layers,this.add(s);const a=new Ft(pi,mi,e,t);a.layers=this.layers,this.add(a);const o=new Ft(pi,mi,e,t);o.layers=this.layers,this.add(o);const l=new Ft(pi,mi,e,t);l.layers=this.layers,this.add(l);const c=new Ft(pi,mi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,r),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class go extends Mt{constructor(e,t,n,r,s,a,o,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:301,super(e,t,n,r,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class md extends Wt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new go(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:1006}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new hi(5,5,5),s=new Lt({name:"CubemapFromEquirect",uniforms:fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new ct(r,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new pd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}const Hs=new H,gd=new H,_d=new We;class Ln{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Hs.subVectors(n,t).cross(gd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Hs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||_d.getNormalMatrix(e),r=this.coplanarPoint(Hs).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Dn=new Cs,Fr=new H;class zs{constructor(e=new Ln,t=new Ln,n=new Ln,r=new Ln,s=new Ln,a=new Ln){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],d=r[5],u=r[6],h=r[7],m=r[8],_=r[9],g=r[10],f=r[11],p=r[12],y=r[13],M=r[14],E=r[15];if(n[0].setComponents(l-s,h-c,f-m,E-p).normalize(),n[1].setComponents(l+s,h+c,f+m,E+p).normalize(),n[2].setComponents(l+a,h+d,f+_,E+y).normalize(),n[3].setComponents(l-a,h-d,f-_,E-y).normalize(),n[4].setComponents(l-o,h-u,f-g,E-M).normalize(),t===2e3)n[5].setComponents(l+o,h+u,f+g,E+M).normalize();else if(t===2001)n[5].setComponents(o,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Dn)}intersectsSprite(e){return Dn.center.set(0,0,0),Dn.radius=.7071067811865476,Dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Dn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Fr.x=r.normal.x>0?e.max.x:e.min.x,Fr.y=r.normal.y>0?e.max.y:e.min.y,Fr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function _o(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function vd(i){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const d=l.array,u=l._updateRange,h=l.updateRanges;if(i.bindBuffer(c,o),u.count===-1&&h.length===0&&i.bufferSubData(c,0,d),h.length!==0){for(let m=0,_=h.length;m<_;m++){const g=h[m];i.bufferSubData(c,g.start*d.BYTES_PER_ELEMENT,d,g.start,g.count)}l.clearUpdateRanges()}u.count!==-1&&(i.bufferSubData(c,u.offset*d.BYTES_PER_ELEMENT,d,u.offset,u.count),u.count=-1),l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class $i extends En{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,d=l+1,u=e/o,h=t/l,m=[],_=[],g=[],f=[];for(let p=0;p<d;p++){const y=p*h-a;for(let M=0;M<c;M++){const E=M*u-s;_.push(E,-y,0),g.push(0,0,1),f.push(M/o),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const M=y+c*p,E=y+c*(p+1),R=y+1+c*(p+1),T=y+1+c*p;m.push(M,E,T),m.push(E,R,T)}this.setIndex(m),this.setAttribute("position",new gn(_,3)),this.setAttribute("normal",new gn(g,3)),this.setAttribute("uv",new gn(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $i(e.width,e.height,e.widthSegments,e.heightSegments)}}var xd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yd=`#ifdef USE_ALPHAHASH
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
#endif`,bd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Md=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ed=`#ifdef USE_AOMAP
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
#endif`,Td=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ad=`#ifdef USE_BATCHING
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
#endif`,Cd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Id=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ld=`#ifdef USE_IRIDESCENCE
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
#endif`,Dd=`#ifdef USE_BUMPMAP
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
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ud=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Od=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zd=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Gd=`#define PI 3.141592653589793
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
} // validated`,Vd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wd=`vec3 transformedNormal = objectNormal;
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
#endif`,Xd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$d=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kd=`
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
}`,Zd=`#ifdef USE_ENVMAP
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
#endif`,Qd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jd=`#ifdef USE_ENVMAP
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
#endif`,eu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tu=`#ifdef USE_ENVMAP
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
#endif`,nu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,iu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ru=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,su=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,au=`#ifdef USE_GRADIENTMAP
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
}`,ou=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,du=`uniform bool receiveShadow;
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
#endif`,uu=`#ifdef USE_ENVMAP
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
#endif`,hu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gu=`PhysicalMaterial material;
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
#endif`,_u=`struct PhysicalMaterial {
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
}`,vu=`
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
#endif`,xu=`#if defined( RE_IndirectDiffuse )
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
#endif`,yu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Su=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Eu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Au=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cu=`#if defined( USE_POINTS_UV )
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
#endif`,Ru=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Iu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Du=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nu=`#ifdef USE_MORPHTARGETS
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
#endif`,Fu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ku=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ou=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zu=`#ifdef USE_NORMALMAP
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
#endif`,Gu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$u=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qu=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Yu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ju=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ku=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ju=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eh=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,th=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nh=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ih=`float getShadowMask() {
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
}`,rh=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sh=`#ifdef USE_SKINNING
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
#endif`,ah=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,oh=`#ifdef USE_SKINNING
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
#endif`,lh=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ch=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dh=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uh=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,hh=`#ifdef USE_TRANSMISSION
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
#endif`,fh=`#ifdef USE_TRANSMISSION
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
#endif`,ph=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_h=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xe={alphahash_fragment:xd,alphahash_pars_fragment:yd,alphamap_fragment:bd,alphamap_pars_fragment:Md,alphatest_fragment:Sd,alphatest_pars_fragment:wd,aomap_fragment:Ed,aomap_pars_fragment:Td,batching_pars_vertex:Ad,batching_vertex:Cd,begin_vertex:Rd,beginnormal_vertex:Pd,bsdfs:Id,iridescence_fragment:Ld,bumpmap_pars_fragment:Dd,clipping_planes_fragment:Nd,clipping_planes_pars_fragment:Fd,clipping_planes_pars_vertex:Ud,clipping_planes_vertex:kd,color_fragment:Bd,color_pars_fragment:Od,color_pars_vertex:Hd,color_vertex:zd,common:Gd,cube_uv_reflection_fragment:Vd,defaultnormal_vertex:Wd,displacementmap_pars_vertex:Xd,displacementmap_vertex:$d,emissivemap_fragment:qd,emissivemap_pars_fragment:Yd,colorspace_fragment:jd,colorspace_pars_fragment:Kd,envmap_fragment:Zd,envmap_common_pars_fragment:Qd,envmap_pars_fragment:Jd,envmap_pars_vertex:eu,envmap_physical_pars_fragment:uu,envmap_vertex:tu,fog_vertex:nu,fog_pars_vertex:iu,fog_fragment:ru,fog_pars_fragment:su,gradientmap_pars_fragment:au,lightmap_pars_fragment:ou,lights_lambert_fragment:lu,lights_lambert_pars_fragment:cu,lights_pars_begin:du,lights_toon_fragment:hu,lights_toon_pars_fragment:fu,lights_phong_fragment:pu,lights_phong_pars_fragment:mu,lights_physical_fragment:gu,lights_physical_pars_fragment:_u,lights_fragment_begin:vu,lights_fragment_maps:xu,lights_fragment_end:yu,logdepthbuf_fragment:bu,logdepthbuf_pars_fragment:Mu,logdepthbuf_pars_vertex:Su,logdepthbuf_vertex:wu,map_fragment:Eu,map_pars_fragment:Tu,map_particle_fragment:Au,map_particle_pars_fragment:Cu,metalnessmap_fragment:Ru,metalnessmap_pars_fragment:Pu,morphinstance_vertex:Iu,morphcolor_vertex:Lu,morphnormal_vertex:Du,morphtarget_pars_vertex:Nu,morphtarget_vertex:Fu,normal_fragment_begin:Uu,normal_fragment_maps:ku,normal_pars_fragment:Bu,normal_pars_vertex:Ou,normal_vertex:Hu,normalmap_pars_fragment:zu,clearcoat_normal_fragment_begin:Gu,clearcoat_normal_fragment_maps:Vu,clearcoat_pars_fragment:Wu,iridescence_pars_fragment:Xu,opaque_fragment:$u,packing:qu,premultiplied_alpha_fragment:Yu,project_vertex:ju,dithering_fragment:Ku,dithering_pars_fragment:Zu,roughnessmap_fragment:Qu,roughnessmap_pars_fragment:Ju,shadowmap_pars_fragment:eh,shadowmap_pars_vertex:th,shadowmap_vertex:nh,shadowmask_pars_fragment:ih,skinbase_vertex:rh,skinning_pars_vertex:sh,skinning_vertex:ah,skinnormal_vertex:oh,specularmap_fragment:lh,specularmap_pars_fragment:ch,tonemapping_fragment:dh,tonemapping_pars_fragment:uh,transmission_fragment:hh,transmission_pars_fragment:fh,uv_pars_fragment:ph,uv_pars_vertex:mh,uv_vertex:gh,worldpos_vertex:_h,background_vert:`varying vec2 vUv;
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
}`},fe={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},sn={basic:{uniforms:It([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:It([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Be(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:It([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:It([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:It([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new Be(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:It([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:It([fe.points,fe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:It([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:It([fe.common,fe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:It([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:It([fe.sprite,fe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:It([fe.common,fe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:It([fe.lights,fe.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};sn.physical={uniforms:It([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Ur={r:0,b:0,g:0},Nn=new tn,vh=new ht;function xh(i,e,t,n,r,s,a){const o=new Be(0);let l=s===!0?0:1,c,d,u=null,h=0,m=null;function _(y){let M=y.isScene===!0?y.background:null;return M&&M.isTexture&&(M=(y.backgroundBlurriness>0?t:e).get(M)),M}function g(y){let M=!1;const E=_(y);E===null?p(o,l):E&&E.isColor&&(p(E,1),M=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function f(y,M){const E=_(M);E&&(E.isCubeTexture||E.mapping===306)?(d===void 0&&(d=new ct(new hi(1,1,1),new Lt({name:"BackgroundCubeMaterial",uniforms:fi(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(R,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),Nn.copy(M.backgroundRotation),Nn.x*=-1,Nn.y*=-1,Nn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Nn.y*=-1,Nn.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(vh.makeRotationFromEuler(Nn)),d.material.toneMapped=Je.getTransfer(E.colorSpace)!==at,(u!==E||h!==E.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,h=E.version,m=i.toneMapping),d.layers.enableAll(),y.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new ct(new $i(2,2),new Lt({name:"BackgroundMaterial",uniforms:fi(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Je.getTransfer(E.colorSpace)!==at,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||h!==E.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,u=E,h=E.version,m=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,M){y.getRGB(Ur,ho(i)),n.buffers.color.setClear(Ur.r,Ur.g,Ur.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(y,M=1){o.set(y),l=M,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(o,l)},render:g,addToRenderList:f}}function yh(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,a=!1;function o(x,P,V,k,z){let j=!1;const D=u(k,V,P);s!==D&&(s=D,c(s.object)),j=m(x,k,V,z),j&&_(x,k,V,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,E(x,P,V,k),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function d(x){return i.deleteVertexArray(x)}function u(x,P,V){const k=V.wireframe===!0;let z=n[x.id];z===void 0&&(z={},n[x.id]=z);let j=z[P.id];j===void 0&&(j={},z[P.id]=j);let D=j[k];return D===void 0&&(D=h(l()),j[k]=D),D}function h(x){const P=[],V=[],k=[];for(let z=0;z<t;z++)P[z]=0,V[z]=0,k[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:V,attributeDivisors:k,object:x,attributes:{},index:null}}function m(x,P,V,k){const z=s.attributes,j=P.attributes;let D=0;const Z=V.getAttributes();for(const $ in Z)if(Z[$].location>=0){const he=z[$];let L=j[$];if(L===void 0&&($==="instanceMatrix"&&x.instanceMatrix&&(L=x.instanceMatrix),$==="instanceColor"&&x.instanceColor&&(L=x.instanceColor)),he===void 0||he.attribute!==L||L&&he.data!==L.data)return!0;D++}return s.attributesNum!==D||s.index!==k}function _(x,P,V,k){const z={},j=P.attributes;let D=0;const Z=V.getAttributes();for(const $ in Z)if(Z[$].location>=0){let he=j[$];he===void 0&&($==="instanceMatrix"&&x.instanceMatrix&&(he=x.instanceMatrix),$==="instanceColor"&&x.instanceColor&&(he=x.instanceColor));const L={};L.attribute=he,he&&he.data&&(L.data=he.data),z[$]=L,D++}s.attributes=z,s.attributesNum=D,s.index=k}function g(){const x=s.newAttributes;for(let P=0,V=x.length;P<V;P++)x[P]=0}function f(x){p(x,0)}function p(x,P){const V=s.newAttributes,k=s.enabledAttributes,z=s.attributeDivisors;V[x]=1,k[x]===0&&(i.enableVertexAttribArray(x),k[x]=1),z[x]!==P&&(i.vertexAttribDivisor(x,P),z[x]=P)}function y(){const x=s.newAttributes,P=s.enabledAttributes;for(let V=0,k=P.length;V<k;V++)P[V]!==x[V]&&(i.disableVertexAttribArray(V),P[V]=0)}function M(x,P,V,k,z,j,D){D===!0?i.vertexAttribIPointer(x,P,V,z,j):i.vertexAttribPointer(x,P,V,k,z,j)}function E(x,P,V,k){g();const z=k.attributes,j=V.getAttributes(),D=P.defaultAttributeValues;for(const Z in j){const $=j[Z];if($.location>=0){let ue=z[Z];if(ue===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(ue=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(ue=x.instanceColor)),ue!==void 0){const he=ue.normalized,L=ue.itemSize,ee=e.get(ue);if(ee===void 0)continue;const se=ee.buffer,X=ee.type,Y=ee.bytesPerElement,ae=X===i.INT||X===i.UNSIGNED_INT||ue.gpuType===1013;if(ue.isInterleavedBufferAttribute){const oe=ue.data,_e=oe.stride,Ie=ue.offset;if(oe.isInstancedInterleavedBuffer){for(let Ge=0;Ge<$.locationSize;Ge++)p($.location+Ge,oe.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Ge=0;Ge<$.locationSize;Ge++)f($.location+Ge);i.bindBuffer(i.ARRAY_BUFFER,se);for(let Ge=0;Ge<$.locationSize;Ge++)M($.location+Ge,L/$.locationSize,X,he,_e*Y,(Ie+L/$.locationSize*Ge)*Y,ae)}else{if(ue.isInstancedBufferAttribute){for(let oe=0;oe<$.locationSize;oe++)p($.location+oe,ue.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let oe=0;oe<$.locationSize;oe++)f($.location+oe);i.bindBuffer(i.ARRAY_BUFFER,se);for(let oe=0;oe<$.locationSize;oe++)M($.location+oe,L/$.locationSize,X,he,L*Y,L/$.locationSize*oe*Y,ae)}}else if(D!==void 0){const he=D[Z];if(he!==void 0)switch(he.length){case 2:i.vertexAttrib2fv($.location,he);break;case 3:i.vertexAttrib3fv($.location,he);break;case 4:i.vertexAttrib4fv($.location,he);break;default:i.vertexAttrib1fv($.location,he)}}}}y()}function R(){N();for(const x in n){const P=n[x];for(const V in P){const k=P[V];for(const z in k)d(k[z].object),delete k[z];delete P[V]}delete n[x]}}function T(x){if(n[x.id]===void 0)return;const P=n[x.id];for(const V in P){const k=P[V];for(const z in k)d(k[z].object),delete k[z];delete P[V]}delete n[x.id]}function A(x){for(const P in n){const V=n[P];if(V[x.id]===void 0)continue;const k=V[x.id];for(const z in k)d(k[z].object),delete k[z];delete V[x.id]}}function N(){S(),a=!0,s!==r&&(s=r,c(s.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:S,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:g,enableAttribute:f,disableUnusedAttributes:y}}function bh(i,e,t){let n;function r(c){n=c}function s(c,d){i.drawArrays(n,c,d),t.update(d,n,1)}function a(c,d,u){u!==0&&(i.drawArraysInstanced(n,c,d,u),t.update(d,n,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=d[_];t.update(m,n,1)}function l(c,d,u,h){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],d[_],h[_]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,d,0,h,0,u);let _=0;for(let g=0;g<u;g++)_+=d[g];for(let g=0;g<h.length;g++)t.update(_,n,h[g])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Mh(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(T){return!(T!==1023&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const A=T===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==1009&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==1015&&!A)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:p,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:E,maxSamples:R}}function Sh(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new Ln,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const m=u.length!==0||h||n!==0||r;return r=h,n=u.length,m},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){const _=u.clippingPlanes,g=u.clipIntersection,f=u.clipShadows,p=i.get(u);if(!r||_===null||_.length===0||s&&!f)s?d(null):c();else{const y=s?0:n,M=y*4;let E=p.clippingState||null;l.value=E,E=d(_,h,M,m);for(let R=0;R!==M;++R)E[R]=t[R];p.clippingState=E,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,h,m,_){const g=u!==null?u.length:0;let f=null;if(g!==0){if(f=l.value,_!==!0||f===null){const p=m+g*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(f===null||f.length<p)&&(f=new Float32Array(p));for(let M=0,E=m;M!==g;++M,E+=4)a.copy(u[M]).applyMatrix4(y,o),a.normal.toArray(f,E),f[E+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,f}}function wh(i){let e=new WeakMap;function t(a,o){return o===303?a.mapping=301:o===304&&(a.mapping=302),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===303||o===304)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new md(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class vo extends fo{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const gi=4,xo=[.125,.215,.35,.446,.526,.582],Fn=20,Gs=new vo,yo=new Be;let Vs=null,Ws=0,Xs=0,$s=!1;const Un=(1+Math.sqrt(5))/2,_i=1/Un,bo=[new H(-Un,_i,0),new H(Un,_i,0),new H(-_i,0,Un),new H(_i,0,Un),new H(0,Un,-_i),new H(0,Un,_i),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class qs{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Vs=this._renderer.getRenderTarget(),Ws=this._renderer.getActiveCubeFace(),Xs=this._renderer.getActiveMipmapLevel(),$s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=So(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vs,Ws,Xs),this._renderer.xr.enabled=$s,e.scissorTest=!1,kr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vs=this._renderer.getRenderTarget(),Ws=this._renderer.getActiveCubeFace(),Xs=this._renderer.getActiveMipmapLevel(),$s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:en,depthBuffer:!1},r=Mo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mo(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Eh(s)),this._blurMaterial=Th(s,e,t)}return r}_compileMaterial(e){const t=new ct(this._lodPlanes[0],e);this._renderer.compile(t,Gs)}_sceneToCubeUV(e,t,n,r){const o=new Ft(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(yo),d.toneMapping=0,d.autoClear=!1;const m=new Er({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),_=new ct(new hi,m);let g=!1;const f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,g=!0):(m.color.copy(yo),g=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):y===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const M=this._cubeSize;kr(r,y*M,p>2?M:0,M,M),d.setRenderTarget(r),g&&d.render(_,o),d.render(e,o)}_.geometry.dispose(),_.material.dispose(),d.toneMapping=h,d.autoClear=u,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=wo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=So());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new ct(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;kr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Gs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=bo[(r-s-1)%bo.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new ct(this._lodPlanes[r],c),h=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Fn-1),g=s/_,f=isFinite(s)?1+Math.floor(d*g):Fn;f>Fn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Fn}`);const p=[];let y=0;for(let A=0;A<Fn;++A){const N=A/g,S=Math.exp(-N*N/2);p.push(S),A===0?y+=S:A<f&&(y+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;h.envMap.value=e.texture,h.samples.value=f,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:M}=this;h.dTheta.value=_,h.mipInt.value=M-n;const E=this._sizeLods[r],R=3*E*(r>M-gi?r-M+gi:0),T=4*(this._cubeSize-E);kr(t,R,T,3*E,2*E),l.setRenderTarget(t),l.render(u,Gs)}}function Eh(i){const e=[],t=[],n=[];let r=i;const s=i-gi+1+xo.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>i-gi?l=xo[a-i+gi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,_=6,g=3,f=2,p=1,y=new Float32Array(g*_*m),M=new Float32Array(f*_*m),E=new Float32Array(p*_*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,N=T>2?0:-1,S=[A,N,0,A+2/3,N,0,A+2/3,N+1,0,A,N,0,A+2/3,N+1,0,A,N+1,0];y.set(S,g*_*T),M.set(h,f*_*T);const x=[T,T,T,T,T,T];E.set(x,p*_*T)}const R=new En;R.setAttribute("position",new rn(y,g)),R.setAttribute("uv",new rn(M,f)),R.setAttribute("faceIndex",new rn(E,p)),e.push(R),r>gi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Mo(i,e,t){const n=new Wt(i,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function kr(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Th(i,e,t){const n=new Float32Array(Fn),r=new H(0,1,0);return new Lt({name:"SphericalGaussianBlur",defines:{n:Fn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ys(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function So(){return new Lt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ys(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function wo(){return new Lt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ys(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ys(){return`

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
	`}function Ah(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===303||l===304,d=l===301||l===302;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new qs(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&r(m)?(t===null&&(t=new qs(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Ch(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Ga("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Rh(i,e,t,n){const r={},s=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);for(const _ in h.morphAttributes){const g=h.morphAttributes[_];for(let f=0,p=g.length;f<p;f++)e.remove(g[f])}h.removeEventListener("dispose",a),delete r[h.id];const m=s.get(h);m&&(e.remove(m),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const _ in h)e.update(h[_],i.ARRAY_BUFFER);const m=u.morphAttributes;for(const _ in m){const g=m[_];for(let f=0,p=g.length;f<p;f++)e.update(g[f],i.ARRAY_BUFFER)}}function c(u){const h=[],m=u.index,_=u.attributes.position;let g=0;if(m!==null){const y=m.array;g=m.version;for(let M=0,E=y.length;M<E;M+=3){const R=y[M+0],T=y[M+1],A=y[M+2];h.push(R,T,T,A,A,R)}}else if(_!==void 0){const y=_.array;g=_.version;for(let M=0,E=y.length/3-1;M<E;M+=3){const R=M+0,T=M+1,A=M+2;h.push(R,T,T,A,A,R)}}else return;const f=new(Ha(h)?so:ro)(h,1);f.version=g;const p=s.get(u);p&&e.remove(p),s.set(u,f)}function d(u){const h=s.get(u);if(h){const m=u.index;m!==null&&h.version<m.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function Ph(i,e,t){let n;function r(h){n=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,m){i.drawElements(n,m,s,h*a),t.update(m,n,1)}function c(h,m,_){_!==0&&(i.drawElementsInstanced(n,m,s,h*a,_),t.update(m,n,_))}function d(h,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,s,h,0,_);let f=0;for(let p=0;p<_;p++)f+=m[p];t.update(f,n,1)}function u(h,m,_,g){if(_===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<h.length;p++)c(h[p]/a,m[p],g[p]);else{f.multiDrawElementsInstancedWEBGL(n,m,0,s,h,0,g,0,_);let p=0;for(let y=0;y<_;y++)p+=m[y];for(let y=0;y<g.length;y++)t.update(p,n,g[y])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Ih(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Lh(i,e,t){const n=new WeakMap,r=new lt;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=n.get(o);if(h===void 0||h.count!==u){let S=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",S)};h!==void 0&&h.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let M=0;m===!0&&(M=1),_===!0&&(M=2),g===!0&&(M=3);let E=o.attributes.position.count*M,R=1;E>e.maxTextureSize&&(R=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const T=new Float32Array(E*R*4*u),A=new $a(T,E,R,u);A.type=1015,A.needsUpdate=!0;const N=M*4;for(let x=0;x<u;x++){const P=f[x],V=p[x],k=y[x],z=E*R*4*x;for(let j=0;j<P.count;j++){const D=j*N;m===!0&&(r.fromBufferAttribute(P,j),T[z+D+0]=r.x,T[z+D+1]=r.y,T[z+D+2]=r.z,T[z+D+3]=0),_===!0&&(r.fromBufferAttribute(V,j),T[z+D+4]=r.x,T[z+D+5]=r.y,T[z+D+6]=r.z,T[z+D+7]=0),g===!0&&(r.fromBufferAttribute(k,j),T[z+D+8]=r.x,T[z+D+9]=r.y,T[z+D+10]=r.z,T[z+D+11]=k.itemSize===4?r.w:1)}}h={count:u,texture:A,size:new Le(E,R)},n.set(o,h),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function Dh(i,e,t,n){let r=new WeakMap;function s(l){const c=n.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return u}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class Eo extends Mt{constructor(e,t,n,r,s,a,o,l,c,d=1026){if(d!==1026&&d!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===1026&&(n=1014),n===void 0&&d===1027&&(n=1020),super(null,r,s,a,o,l,d,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const To=new Mt,Ao=new Eo(1,1),Co=new $a,Ro=new Jc,Po=new go,Io=[],Lo=[],Do=new Float32Array(16),No=new Float32Array(9),Fo=new Float32Array(4);function vi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Io[r];if(s===void 0&&(s=new Float32Array(r),Io[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function _t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Br(i,e){let t=Lo[e];t===void 0&&(t=new Int32Array(e),Lo[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Nh(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Fh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2fv(this.addr,e),vt(t,e)}}function Uh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;i.uniform3fv(this.addr,e),vt(t,e)}}function kh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4fv(this.addr,e),vt(t,e)}}function Bh(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;Fo.set(n),i.uniformMatrix2fv(this.addr,!1,Fo),vt(t,n)}}function Oh(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;No.set(n),i.uniformMatrix3fv(this.addr,!1,No),vt(t,n)}}function Hh(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(_t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(_t(t,n))return;Do.set(n),i.uniformMatrix4fv(this.addr,!1,Do),vt(t,n)}}function zh(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Gh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2iv(this.addr,e),vt(t,e)}}function Vh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3iv(this.addr,e),vt(t,e)}}function Wh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4iv(this.addr,e),vt(t,e)}}function Xh(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function $h(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;i.uniform2uiv(this.addr,e),vt(t,e)}}function qh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;i.uniform3uiv(this.addr,e),vt(t,e)}}function Yh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;i.uniform4uiv(this.addr,e),vt(t,e)}}function jh(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Ao.compareFunction=515,s=Ao):s=To,t.setTexture2D(e||s,r)}function Kh(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Ro,r)}function Zh(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Po,r)}function Qh(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Co,r)}function Jh(i){switch(i){case 5126:return Nh;case 35664:return Fh;case 35665:return Uh;case 35666:return kh;case 35674:return Bh;case 35675:return Oh;case 35676:return Hh;case 5124:case 35670:return zh;case 35667:case 35671:return Gh;case 35668:case 35672:return Vh;case 35669:case 35673:return Wh;case 5125:return Xh;case 36294:return $h;case 36295:return qh;case 36296:return Yh;case 35678:case 36198:case 36298:case 36306:case 35682:return jh;case 35679:case 36299:case 36307:return Kh;case 35680:case 36300:case 36308:case 36293:return Zh;case 36289:case 36303:case 36311:case 36292:return Qh}}function ef(i,e){i.uniform1fv(this.addr,e)}function tf(i,e){const t=vi(e,this.size,2);i.uniform2fv(this.addr,t)}function nf(i,e){const t=vi(e,this.size,3);i.uniform3fv(this.addr,t)}function rf(i,e){const t=vi(e,this.size,4);i.uniform4fv(this.addr,t)}function sf(i,e){const t=vi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function af(i,e){const t=vi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function of(i,e){const t=vi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function lf(i,e){i.uniform1iv(this.addr,e)}function cf(i,e){i.uniform2iv(this.addr,e)}function df(i,e){i.uniform3iv(this.addr,e)}function uf(i,e){i.uniform4iv(this.addr,e)}function hf(i,e){i.uniform1uiv(this.addr,e)}function ff(i,e){i.uniform2uiv(this.addr,e)}function pf(i,e){i.uniform3uiv(this.addr,e)}function mf(i,e){i.uniform4uiv(this.addr,e)}function gf(i,e,t){const n=this.cache,r=e.length,s=Br(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||To,s[a])}function _f(i,e,t){const n=this.cache,r=e.length,s=Br(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Ro,s[a])}function vf(i,e,t){const n=this.cache,r=e.length,s=Br(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Po,s[a])}function xf(i,e,t){const n=this.cache,r=e.length,s=Br(t,r);_t(n,s)||(i.uniform1iv(this.addr,s),vt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Co,s[a])}function yf(i){switch(i){case 5126:return ef;case 35664:return tf;case 35665:return nf;case 35666:return rf;case 35674:return sf;case 35675:return af;case 35676:return of;case 5124:case 35670:return lf;case 35667:case 35671:return cf;case 35668:case 35672:return df;case 35669:case 35673:return uf;case 5125:return hf;case 36294:return ff;case 36295:return pf;case 36296:return mf;case 35678:case 36198:case 36298:case 36306:case 35682:return gf;case 35679:case 36299:case 36307:return _f;case 35680:case 36300:case 36308:case 36293:return vf;case 36289:case 36303:case 36311:case 36292:return xf}}class bf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Jh(t.type)}}class Mf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=yf(t.type)}}class Sf{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const js=/(\w+)(\])?(\[|\.)?/g;function Uo(i,e){i.seq.push(e),i.map[e.id]=e}function wf(i,e,t){const n=i.name,r=n.length;for(js.lastIndex=0;;){const s=js.exec(n),a=js.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Uo(t,c===void 0?new bf(o,i,e):new Mf(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Sf(o),Uo(t,u)),t=u}}}class Or{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);wf(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function ko(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Ef=37297;let Tf=0;function Af(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Cf(i){const e=Je.getPrimaries(Je.workingColorSpace),t=Je.getPrimaries(i);let n;switch(e===t?n="":e===mr&&t===pr?n="LinearDisplayP3ToLinearSRGB":e===pr&&t===mr&&(n="LinearSRGBToLinearDisplayP3"),i){case en:case hr:return[n,"LinearTransferOETF"];case kt:case ys:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Bo(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Af(i.getShaderSource(e),a)}else return r}function Rf(i,e){const t=Cf(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Pf(i,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="OptimizedCineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function If(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qi).join(`
`)}function Lf(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Df(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function qi(i){return i!==""}function Oo(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ho(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Nf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ks(i){return i.replace(Nf,Uf)}const Ff=new Map;function Uf(i,e){let t=Xe[e];if(t===void 0){const n=Ff.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ks(t)}const kf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zo(i){return i.replace(kf,Bf)}function Bf(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Go(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Of(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===1?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===2?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===3&&(e="SHADOWMAP_TYPE_VSM"),e}function Hf(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function zf(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function Gf(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function Vf(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Wf(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Of(t),c=Hf(t),d=zf(t),u=Gf(t),h=Vf(t),m=If(t),_=Lf(s),g=r.createProgram();let f,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(qi).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(qi).join(`
`),p.length>0&&(p+=`
`)):(f=[Go(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qi).join(`
`),p=[Go(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Xe.tonemapping_pars_fragment:"",t.toneMapping!==0?Pf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Rf("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(qi).join(`
`)),a=Ks(a),a=Oo(a,t),a=Ho(a,t),o=Ks(o),o=Oo(o,t),o=Ho(o,t),a=zo(a),o=zo(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",t.glslVersion===Ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=y+f+a,E=y+p+o,R=ko(r,r.VERTEX_SHADER,M),T=ko(r,r.FRAGMENT_SHADER,E);r.attachShader(g,R),r.attachShader(g,T),t.index0AttributeName!==void 0?r.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function A(P){if(i.debug.checkShaderErrors){const V=r.getProgramInfoLog(g).trim(),k=r.getShaderInfoLog(R).trim(),z=r.getShaderInfoLog(T).trim();let j=!0,D=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,g,R,T);else{const Z=Bo(r,R,"vertex"),$=Bo(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+V+`
`+Z+`
`+$)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(k===""||z==="")&&(D=!1);D&&(P.diagnostics={runnable:j,programLog:V,vertexShader:{log:k,prefix:f},fragmentShader:{log:z,prefix:p}})}r.deleteShader(R),r.deleteShader(T),N=new Or(r,g),S=Df(r,g)}let N;this.getUniforms=function(){return N===void 0&&A(this),N};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(g,Ef)),x},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Tf++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=T,this}let Xf=0;class $f{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new qf(e),t.set(e,n)),n}}class qf{constructor(e){this.id=Xf++,this.code=e,this.usedTimes=0}}function Yf(i,e,t,n,r,s,a){const o=new Ka,l=new $f,c=new Set,d=[],u=r.logarithmicDepthBuffer,h=r.vertexTextures;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return c.add(S),S===0?"uv":`uv${S}`}function f(S,x,P,V,k){const z=V.fog,j=k.geometry,D=S.isMeshStandardMaterial?V.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||D),$=Z&&Z.mapping===306?Z.image.height:null,ue=_[S.type];S.precision!==null&&(m=r.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const he=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,L=he!==void 0?he.length:0;let ee=0;j.morphAttributes.position!==void 0&&(ee=1),j.morphAttributes.normal!==void 0&&(ee=2),j.morphAttributes.color!==void 0&&(ee=3);let se,X,Y,ae;if(ue){const Se=sn[ue];se=Se.vertexShader,X=Se.fragmentShader}else se=S.vertexShader,X=S.fragmentShader,l.update(S),Y=l.getVertexShaderID(S),ae=l.getFragmentShaderID(S);const oe=i.getRenderTarget(),_e=k.isInstancedMesh===!0,Ie=k.isBatchedMesh===!0,Ge=!!S.map,tt=!!S.matcap,I=!!Z,ot=!!S.aoMap,Oe=!!S.lightMap,et=!!S.bumpMap,we=!!S.normalMap,nt=!!S.displacementMap,Fe=!!S.emissiveMap,Ce=!!S.metalnessMap,C=!!S.roughnessMap,b=S.anisotropy>0,q=S.clearcoat>0,ne=S.dispersion>0,re=S.iridescence>0,te=S.sheen>0,Ee=S.transmission>0,pe=b&&!!S.anisotropyMap,xe=q&&!!S.clearcoatMap,He=q&&!!S.clearcoatNormalMap,ce=q&&!!S.clearcoatRoughnessMap,me=re&&!!S.iridescenceMap,je=re&&!!S.iridescenceThicknessMap,Ue=te&&!!S.sheenColorMap,ye=te&&!!S.sheenRoughnessMap,ke=!!S.specularMap,ze=!!S.specularColorMap,Ke=!!S.specularIntensityMap,F=Ee&&!!S.transmissionMap,le=Ee&&!!S.thicknessMap,J=!!S.gradientMap,Q=!!S.alphaMap,ie=S.alphaTest>0,Re=!!S.alphaHash,Ve=!!S.extensions;let it=0;S.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(it=i.toneMapping);const ft={shaderID:ue,shaderType:S.type,shaderName:S.name,vertexShader:se,fragmentShader:X,defines:S.defines,customVertexShaderID:Y,customFragmentShaderID:ae,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Ie,batchingColor:Ie&&k._colorsTexture!==null,instancing:_e,instancingColor:_e&&k.instanceColor!==null,instancingMorph:_e&&k.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:en,alphaToCoverage:!!S.alphaToCoverage,map:Ge,matcap:tt,envMap:I,envMapMode:I&&Z.mapping,envMapCubeUVHeight:$,aoMap:ot,lightMap:Oe,bumpMap:et,normalMap:we,displacementMap:h&&nt,emissiveMap:Fe,normalMapObjectSpace:we&&S.normalMapType===1,normalMapTangentSpace:we&&S.normalMapType===0,metalnessMap:Ce,roughnessMap:C,anisotropy:b,anisotropyMap:pe,clearcoat:q,clearcoatMap:xe,clearcoatNormalMap:He,clearcoatRoughnessMap:ce,dispersion:ne,iridescence:re,iridescenceMap:me,iridescenceThicknessMap:je,sheen:te,sheenColorMap:Ue,sheenRoughnessMap:ye,specularMap:ke,specularColorMap:ze,specularIntensityMap:Ke,transmission:Ee,transmissionMap:F,thicknessMap:le,gradientMap:J,opaque:S.transparent===!1&&S.blending===1&&S.alphaToCoverage===!1,alphaMap:Q,alphaTest:ie,alphaHash:Re,combine:S.combine,mapUv:Ge&&g(S.map.channel),aoMapUv:ot&&g(S.aoMap.channel),lightMapUv:Oe&&g(S.lightMap.channel),bumpMapUv:et&&g(S.bumpMap.channel),normalMapUv:we&&g(S.normalMap.channel),displacementMapUv:nt&&g(S.displacementMap.channel),emissiveMapUv:Fe&&g(S.emissiveMap.channel),metalnessMapUv:Ce&&g(S.metalnessMap.channel),roughnessMapUv:C&&g(S.roughnessMap.channel),anisotropyMapUv:pe&&g(S.anisotropyMap.channel),clearcoatMapUv:xe&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:He&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:je&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:ye&&g(S.sheenRoughnessMap.channel),specularMapUv:ke&&g(S.specularMap.channel),specularColorMapUv:ze&&g(S.specularColorMap.channel),specularIntensityMapUv:Ke&&g(S.specularIntensityMap.channel),transmissionMapUv:F&&g(S.transmissionMap.channel),thicknessMapUv:le&&g(S.thicknessMap.channel),alphaMapUv:Q&&g(S.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(we||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!j.attributes.uv&&(Ge||Q),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:k.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:L,morphTextureStride:ee,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:it,decodeVideoTexture:Ge&&S.map.isVideoTexture===!0&&Je.getTransfer(S.map.colorSpace)===at,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===2,flipSided:S.side===1,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ve&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&S.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ft.vertexUv1s=c.has(1),ft.vertexUv2s=c.has(2),ft.vertexUv3s=c.has(3),c.clear(),ft}function p(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)x.push(P),x.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(y(x,S),M(x,S),x.push(i.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function y(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function M(S,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.skinning&&o.enable(4),x.morphTargets&&o.enable(5),x.morphNormals&&o.enable(6),x.morphColors&&o.enable(7),x.premultipliedAlpha&&o.enable(8),x.shadowMapEnabled&&o.enable(9),x.doubleSided&&o.enable(10),x.flipSided&&o.enable(11),x.useDepthPacking&&o.enable(12),x.dithering&&o.enable(13),x.transmission&&o.enable(14),x.sheen&&o.enable(15),x.opaque&&o.enable(16),x.pointsUvs&&o.enable(17),x.decodeVideoTexture&&o.enable(18),x.alphaToCoverage&&o.enable(19),S.push(o.mask)}function E(S){const x=_[S.type];let P;if(x){const V=sn[x];P=Xi.clone(V.uniforms)}else P=S.uniforms;return P}function R(S,x){let P;for(let V=0,k=d.length;V<k;V++){const z=d[V];if(z.cacheKey===x){P=z,++P.usedTimes;break}}return P===void 0&&(P=new Wf(i,x,S,s),d.push(P)),P}function T(S){if(--S.usedTimes===0){const x=d.indexOf(S);d[x]=d[d.length-1],d.pop(),S.destroy()}}function A(S){l.remove(S)}function N(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:E,acquireProgram:R,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:N}}function jf(){let i=new WeakMap;function e(s){let a=i.get(s);return a===void 0&&(a={},i.set(s,a)),a}function t(s){i.delete(s)}function n(s,a,o){i.get(s)[a]=o}function r(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:r}}function Kf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Vo(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Wo(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(u,h,m,_,g,f){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:h,material:m,groupOrder:_,renderOrder:u.renderOrder,z:g,group:f},i[e]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=m,p.groupOrder=_,p.renderOrder=u.renderOrder,p.z=g,p.group=f),e++,p}function o(u,h,m,_,g,f){const p=a(u,h,m,_,g,f);m.transmission>0?n.push(p):m.transparent===!0?r.push(p):t.push(p)}function l(u,h,m,_,g,f){const p=a(u,h,m,_,g,f);m.transmission>0?n.unshift(p):m.transparent===!0?r.unshift(p):t.unshift(p)}function c(u,h){t.length>1&&t.sort(u||Kf),n.length>1&&n.sort(h||Vo),r.length>1&&r.sort(h||Vo)}function d(){for(let u=e,h=i.length;u<h;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:d,sort:c}}function Zf(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new Wo,i.set(n,[a])):r>=s.length?(a=new Wo,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Qf(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new Be};break;case"SpotLight":t={position:new H,direction:new H,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new Be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":t={color:new Be,position:new H,halfWidth:new H,halfHeight:new H};break}return i[e.id]=t,t}}}function Jf(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let ep=0;function tp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function np(i){const e=new Qf,t=Jf(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);const r=new H,s=new ht,a=new ht;function o(c){let d=0,u=0,h=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let m=0,_=0,g=0,f=0,p=0,y=0,M=0,E=0,R=0,T=0,A=0;c.sort(tp);for(let S=0,x=c.length;S<x;S++){const P=c[S],V=P.color,k=P.intensity,z=P.distance,j=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=V.r*k,u+=V.g*k,h+=V.b*k;else if(P.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(P.sh.coefficients[D],k);A++}else if(P.isDirectionalLight){const D=e.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Z=P.shadow,$=t.get(P);$.shadowIntensity=Z.intensity,$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,n.directionalShadow[m]=$,n.directionalShadowMap[m]=j,n.directionalShadowMatrix[m]=P.shadow.matrix,y++}n.directional[m]=D,m++}else if(P.isSpotLight){const D=e.get(P);D.position.setFromMatrixPosition(P.matrixWorld),D.color.copy(V).multiplyScalar(k),D.distance=z,D.coneCos=Math.cos(P.angle),D.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),D.decay=P.decay,n.spot[g]=D;const Z=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,Z.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[g]=Z.matrix,P.castShadow){const $=t.get(P);$.shadowIntensity=Z.intensity,$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,n.spotShadow[g]=$,n.spotShadowMap[g]=j,E++}g++}else if(P.isRectAreaLight){const D=e.get(P);D.color.copy(V).multiplyScalar(k),D.halfWidth.set(P.width*.5,0,0),D.halfHeight.set(0,P.height*.5,0),n.rectArea[f]=D,f++}else if(P.isPointLight){const D=e.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),D.distance=P.distance,D.decay=P.decay,P.castShadow){const Z=P.shadow,$=t.get(P);$.shadowIntensity=Z.intensity,$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,$.shadowCameraNear=Z.camera.near,$.shadowCameraFar=Z.camera.far,n.pointShadow[_]=$,n.pointShadowMap[_]=j,n.pointShadowMatrix[_]=P.shadow.matrix,M++}n.point[_]=D,_++}else if(P.isHemisphereLight){const D=e.get(P);D.skyColor.copy(P.color).multiplyScalar(k),D.groundColor.copy(P.groundColor).multiplyScalar(k),n.hemi[p]=D,p++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;const N=n.hash;(N.directionalLength!==m||N.pointLength!==_||N.spotLength!==g||N.rectAreaLength!==f||N.hemiLength!==p||N.numDirectionalShadows!==y||N.numPointShadows!==M||N.numSpotShadows!==E||N.numSpotMaps!==R||N.numLightProbes!==A)&&(n.directional.length=m,n.spot.length=g,n.rectArea.length=f,n.point.length=_,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=E+R-T,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,N.directionalLength=m,N.pointLength=_,N.spotLength=g,N.rectAreaLength=f,N.hemiLength=p,N.numDirectionalShadows=y,N.numPointShadows=M,N.numSpotShadows=E,N.numSpotMaps=R,N.numLightProbes=A,n.version=ep++)}function l(c,d){let u=0,h=0,m=0,_=0,g=0;const f=d.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const M=c[p];if(M.isDirectionalLight){const E=n.directional[u];E.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(f),u++}else if(M.isSpotLight){const E=n.spot[m];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(f),E.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(f),m++}else if(M.isRectAreaLight){const E=n.rectArea[_];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(f),a.identity(),s.copy(M.matrixWorld),s.premultiply(f),a.extractRotation(s),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const E=n.point[h];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(f),h++}else if(M.isHemisphereLight){const E=n.hemi[g];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(f),g++}}}return{setup:o,setupView:l,state:n}}function Xo(i){const e=new np(i),t=[],n=[];function r(d){c.camera=d,t.length=0,n.length=0}function s(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function ip(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Xo(i),e.set(r,[o])):s>=a.length?(o=new Xo(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class rp extends Vi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sp extends Vi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ap=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,op=`uniform sampler2D shadow_pass;
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
}`;function lp(i,e,t){let n=new zs;const r=new Le,s=new Le,a=new lt,o=new rp({depthPacking:3201}),l=new sp,c={},d=t.maxTextureSize,u={0:1,1:0,2:2},h=new Lt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:ap,fragmentShader:op}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const _=new En;_.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ct(_,h),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(T,A,N){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||T.length===0)return;const S=i.getRenderTarget(),x=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),V=i.state;V.setBlending(0),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const k=p!==3&&this.type===3,z=p===3&&this.type!==3;for(let j=0,D=T.length;j<D;j++){const Z=T[j],$=Z.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;r.copy($.mapSize);const ue=$.getFrameExtents();if(r.multiply(ue),s.copy($.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/ue.x),r.x=s.x*ue.x,$.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/ue.y),r.y=s.y*ue.y,$.mapSize.y=s.y)),$.map===null||k===!0||z===!0){const L=this.type!==3?{minFilter:1003,magFilter:1003}:{};$.map!==null&&$.map.dispose(),$.map=new Wt(r.x,r.y,L),$.map.texture.name=Z.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const he=$.getViewportCount();for(let L=0;L<he;L++){const ee=$.getViewport(L);a.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),V.viewport(a),$.updateMatrices(Z,L),n=$.getFrustum(),E(A,N,$.camera,Z,this.type)}$.isPointLightShadow!==!0&&this.type===3&&y($,N),$.needsUpdate=!1}p=this.type,f.needsUpdate=!1,i.setRenderTarget(S,x,P)};function y(T,A){const N=e.update(g);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wt(r.x,r.y)),h.uniforms.shadow_pass.value=T.map.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,N,h,g,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,N,m,g,null)}function M(T,A,N,S){let x=null;const P=N.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)x=P;else if(x=N.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=x.uuid,k=A.uuid;let z=c[V];z===void 0&&(z={},c[V]=z);let j=z[k];j===void 0&&(j=x.clone(),z[k]=j,A.addEventListener("dispose",R)),x=j}if(x.visible=A.visible,x.wireframe=A.wireframe,S===3?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:u[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,N.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const V=i.properties.get(x);V.light=N}return x}function E(T,A,N,S,x){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===3)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,T.matrixWorld);const k=e.update(T),z=T.material;if(Array.isArray(z)){const j=k.groups;for(let D=0,Z=j.length;D<Z;D++){const $=j[D],ue=z[$.materialIndex];if(ue&&ue.visible){const he=M(T,ue,S,x);T.onBeforeShadow(i,T,A,N,k,he,$),i.renderBufferDirect(N,null,k,he,T,$),T.onAfterShadow(i,T,A,N,k,he,$)}}}else if(z.visible){const j=M(T,z,S,x);T.onBeforeShadow(i,T,A,N,k,j,null),i.renderBufferDirect(N,null,k,j,T,null),T.onAfterShadow(i,T,A,N,k,j,null)}}const V=T.children;for(let k=0,z=V.length;k<z;k++)E(V[k],A,N,S,x)}function R(T){T.target.removeEventListener("dispose",R);for(const N in c){const S=c[N],x=T.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}function cp(i){function e(){let F=!1;const le=new lt;let J=null;const Q=new lt(0,0,0,0);return{setMask:function(ie){J!==ie&&!F&&(i.colorMask(ie,ie,ie,ie),J=ie)},setLocked:function(ie){F=ie},setClear:function(ie,Re,Ve,it,ft){ft===!0&&(ie*=it,Re*=it,Ve*=it),le.set(ie,Re,Ve,it),Q.equals(le)===!1&&(i.clearColor(ie,Re,Ve,it),Q.copy(le))},reset:function(){F=!1,J=null,Q.set(-1,0,0,0)}}}function t(){let F=!1,le=null,J=null,Q=null;return{setTest:function(ie){ie?ae(i.DEPTH_TEST):oe(i.DEPTH_TEST)},setMask:function(ie){le!==ie&&!F&&(i.depthMask(ie),le=ie)},setFunc:function(ie){if(J!==ie){switch(ie){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}J=ie}},setLocked:function(ie){F=ie},setClear:function(ie){Q!==ie&&(i.clearDepth(ie),Q=ie)},reset:function(){F=!1,le=null,J=null,Q=null}}}function n(){let F=!1,le=null,J=null,Q=null,ie=null,Re=null,Ve=null,it=null,ft=null;return{setTest:function(Se){F||(Se?ae(i.STENCIL_TEST):oe(i.STENCIL_TEST))},setMask:function(Se){le!==Se&&!F&&(i.stencilMask(Se),le=Se)},setFunc:function(Se,Ht,qt){(J!==Se||Q!==Ht||ie!==qt)&&(i.stencilFunc(Se,Ht,qt),J=Se,Q=Ht,ie=qt)},setOp:function(Se,Ht,qt){(Re!==Se||Ve!==Ht||it!==qt)&&(i.stencilOp(Se,Ht,qt),Re=Se,Ve=Ht,it=qt)},setLocked:function(Se){F=Se},setClear:function(Se){ft!==Se&&(i.clearStencil(Se),ft=Se)},reset:function(){F=!1,le=null,J=null,Q=null,ie=null,Re=null,Ve=null,it=null,ft=null}}}const r=new e,s=new t,a=new n,o=new WeakMap,l=new WeakMap;let c={},d={},u=new WeakMap,h=[],m=null,_=!1,g=null,f=null,p=null,y=null,M=null,E=null,R=null,T=new Be(0,0,0),A=0,N=!1,S=null,x=null,P=null,V=null,k=null;const z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,D=0;const Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(Z)[1]),j=D>=1):Z.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),j=D>=2);let $=null,ue={};const he=i.getParameter(i.SCISSOR_BOX),L=i.getParameter(i.VIEWPORT),ee=new lt().fromArray(he),se=new lt().fromArray(L);function X(F,le,J,Q){const ie=new Uint8Array(4),Re=i.createTexture();i.bindTexture(F,Re),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ve=0;Ve<J;Ve++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,Q,0,i.RGBA,i.UNSIGNED_BYTE,ie):i.texImage2D(le+Ve,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ie);return Re}const Y={};Y[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),ae(i.DEPTH_TEST),s.setFunc(3),et(!1),we(1),ae(i.CULL_FACE),ot(0);function ae(F){c[F]!==!0&&(i.enable(F),c[F]=!0)}function oe(F){c[F]!==!1&&(i.disable(F),c[F]=!1)}function _e(F,le){return d[F]!==le?(i.bindFramebuffer(F,le),d[F]=le,F===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=le),F===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=le),!0):!1}function Ie(F,le){let J=h,Q=!1;if(F){J=u.get(le),J===void 0&&(J=[],u.set(le,J));const ie=F.textures;if(J.length!==ie.length||J[0]!==i.COLOR_ATTACHMENT0){for(let Re=0,Ve=ie.length;Re<Ve;Re++)J[Re]=i.COLOR_ATTACHMENT0+Re;J.length=ie.length,Q=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,Q=!0);Q&&i.drawBuffers(J)}function Ge(F){return m!==F?(i.useProgram(F),m=F,!0):!1}const tt={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};tt[103]=i.MIN,tt[104]=i.MAX;const I={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function ot(F,le,J,Q,ie,Re,Ve,it,ft,Se){if(F===0){_===!0&&(oe(i.BLEND),_=!1);return}if(_===!1&&(ae(i.BLEND),_=!0),F!==5){if(F!==g||Se!==N){if((f!==100||M!==100)&&(i.blendEquation(i.FUNC_ADD),f=100,M=100),Se)switch(F){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}p=null,y=null,E=null,R=null,T.set(0,0,0),A=0,g=F,N=Se}return}ie=ie||le,Re=Re||J,Ve=Ve||Q,(le!==f||ie!==M)&&(i.blendEquationSeparate(tt[le],tt[ie]),f=le,M=ie),(J!==p||Q!==y||Re!==E||Ve!==R)&&(i.blendFuncSeparate(I[J],I[Q],I[Re],I[Ve]),p=J,y=Q,E=Re,R=Ve),(it.equals(T)===!1||ft!==A)&&(i.blendColor(it.r,it.g,it.b,ft),T.copy(it),A=ft),g=F,N=!1}function Oe(F,le){F.side===2?oe(i.CULL_FACE):ae(i.CULL_FACE);let J=F.side===1;le&&(J=!J),et(J),F.blending===1&&F.transparent===!1?ot(0):ot(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),s.setFunc(F.depthFunc),s.setTest(F.depthTest),s.setMask(F.depthWrite),r.setMask(F.colorWrite);const Q=F.stencilWrite;a.setTest(Q),Q&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Fe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(F){S!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),S=F)}function we(F){F!==0?(ae(i.CULL_FACE),F!==x&&(F===1?i.cullFace(i.BACK):F===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):oe(i.CULL_FACE),x=F}function nt(F){F!==P&&(j&&i.lineWidth(F),P=F)}function Fe(F,le,J){F?(ae(i.POLYGON_OFFSET_FILL),(V!==le||k!==J)&&(i.polygonOffset(le,J),V=le,k=J)):oe(i.POLYGON_OFFSET_FILL)}function Ce(F){F?ae(i.SCISSOR_TEST):oe(i.SCISSOR_TEST)}function C(F){F===void 0&&(F=i.TEXTURE0+z-1),$!==F&&(i.activeTexture(F),$=F)}function b(F,le,J){J===void 0&&($===null?J=i.TEXTURE0+z-1:J=$);let Q=ue[J];Q===void 0&&(Q={type:void 0,texture:void 0},ue[J]=Q),(Q.type!==F||Q.texture!==le)&&($!==J&&(i.activeTexture(J),$=J),i.bindTexture(F,le||Y[F]),Q.type=F,Q.texture=le)}function q(){const F=ue[$];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ne(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function re(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function te(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ee(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function pe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function xe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function He(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ce(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function me(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function je(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ue(F){ee.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),ee.copy(F))}function ye(F){se.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),se.copy(F))}function ke(F,le){let J=l.get(le);J===void 0&&(J=new WeakMap,l.set(le,J));let Q=J.get(F);Q===void 0&&(Q=i.getUniformBlockIndex(le,F.name),J.set(F,Q))}function ze(F,le){const Q=l.get(le).get(F);o.get(le)!==Q&&(i.uniformBlockBinding(le,Q,F.__bindingPointIndex),o.set(le,Q))}function Ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},$=null,ue={},d={},u=new WeakMap,h=[],m=null,_=!1,g=null,f=null,p=null,y=null,M=null,E=null,R=null,T=new Be(0,0,0),A=0,N=!1,S=null,x=null,P=null,V=null,k=null,ee.set(0,0,i.canvas.width,i.canvas.height),se.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:ae,disable:oe,bindFramebuffer:_e,drawBuffers:Ie,useProgram:Ge,setBlending:ot,setMaterial:Oe,setFlipSided:et,setCullFace:we,setLineWidth:nt,setPolygonOffset:Fe,setScissorTest:Ce,activeTexture:C,bindTexture:b,unbindTexture:q,compressedTexImage2D:ne,compressedTexImage3D:re,texImage2D:me,texImage3D:je,updateUBOMapping:ke,uniformBlockBinding:ze,texStorage2D:He,texStorage3D:ce,texSubImage2D:te,texSubImage3D:Ee,compressedTexSubImage2D:pe,compressedTexSubImage3D:xe,scissor:Ue,viewport:ye,reset:Ke}}function $o(i,e,t,n){const r=dp(n);switch(t){case 1021:return i*e;case 1024:return i*e;case 1025:return i*e*2;case 1028:return i*e/r.components*r.byteLength;case 1029:return i*e/r.components*r.byteLength;case 1030:return i*e*2/r.components*r.byteLength;case 1031:return i*e*2/r.components*r.byteLength;case 1022:return i*e*3/r.components*r.byteLength;case 1023:return i*e*4/r.components*r.byteLength;case 1033:return i*e*4/r.components*r.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dp(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function up(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Le,d=new WeakMap;let u;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(C){}function _(C,b){return m?new OffscreenCanvas(C,b):ki("canvas")}function g(C,b,q){let ne=1;const re=Ce(C);if((re.width>q||re.height>q)&&(ne=q/Math.max(re.width,re.height)),ne<1)if(typeof HTMLImageElement!="undefined"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&C instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&C instanceof ImageBitmap||typeof VideoFrame!="undefined"&&C instanceof VideoFrame){const te=Math.floor(ne*re.width),Ee=Math.floor(ne*re.height);u===void 0&&(u=_(te,Ee));const pe=b?_(te,Ee):u;return pe.width=te,pe.height=Ee,pe.getContext("2d").drawImage(C,0,0,te,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+te+"x"+Ee+")."),pe}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),C;return C}function f(C){return C.generateMipmaps&&C.minFilter!==1003&&C.minFilter!==1006}function p(C){i.generateMipmap(C)}function y(C,b,q,ne,re=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let te=b;if(b===i.RED&&(q===i.FLOAT&&(te=i.R32F),q===i.HALF_FLOAT&&(te=i.R16F),q===i.UNSIGNED_BYTE&&(te=i.R8)),b===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(te=i.R8UI),q===i.UNSIGNED_SHORT&&(te=i.R16UI),q===i.UNSIGNED_INT&&(te=i.R32UI),q===i.BYTE&&(te=i.R8I),q===i.SHORT&&(te=i.R16I),q===i.INT&&(te=i.R32I)),b===i.RG&&(q===i.FLOAT&&(te=i.RG32F),q===i.HALF_FLOAT&&(te=i.RG16F),q===i.UNSIGNED_BYTE&&(te=i.RG8)),b===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(te=i.RG8UI),q===i.UNSIGNED_SHORT&&(te=i.RG16UI),q===i.UNSIGNED_INT&&(te=i.RG32UI),q===i.BYTE&&(te=i.RG8I),q===i.SHORT&&(te=i.RG16I),q===i.INT&&(te=i.RG32I)),b===i.RGB&&q===i.UNSIGNED_INT_5_9_9_9_REV&&(te=i.RGB9_E5),b===i.RGBA){const Ee=re?fr:Je.getTransfer(ne);q===i.FLOAT&&(te=i.RGBA32F),q===i.HALF_FLOAT&&(te=i.RGBA16F),q===i.UNSIGNED_BYTE&&(te=Ee===at?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT_4_4_4_4&&(te=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(te=i.RGB5_A1)}return(te===i.R16F||te===i.R32F||te===i.RG16F||te===i.RG32F||te===i.RGBA16F||te===i.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function M(C,b){let q;return C?b===null||b===1014||b===1020?q=i.DEPTH24_STENCIL8:b===1015?q=i.DEPTH32F_STENCIL8:b===1012&&(q=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===1014||b===1020?q=i.DEPTH_COMPONENT24:b===1015?q=i.DEPTH_COMPONENT32F:b===1012&&(q=i.DEPTH_COMPONENT16),q}function E(C,b){return f(C)===!0||C.isFramebufferTexture&&C.minFilter!==1003&&C.minFilter!==1006?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function R(C){const b=C.target;b.removeEventListener("dispose",R),A(b),b.isVideoTexture&&d.delete(b)}function T(C){const b=C.target;b.removeEventListener("dispose",T),S(b)}function A(C){const b=n.get(C);if(b.__webglInit===void 0)return;const q=C.source,ne=h.get(q);if(ne){const re=ne[b.__cacheKey];re.usedTimes--,re.usedTimes===0&&N(C),Object.keys(ne).length===0&&h.delete(q)}n.remove(C)}function N(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const q=C.source,ne=h.get(q);delete ne[b.__cacheKey],a.memory.textures--}function S(C){const b=n.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(b.__webglFramebuffer[ne]))for(let re=0;re<b.__webglFramebuffer[ne].length;re++)i.deleteFramebuffer(b.__webglFramebuffer[ne][re]);else i.deleteFramebuffer(b.__webglFramebuffer[ne]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[ne])}else{if(Array.isArray(b.__webglFramebuffer))for(let ne=0;ne<b.__webglFramebuffer.length;ne++)i.deleteFramebuffer(b.__webglFramebuffer[ne]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ne=0;ne<b.__webglColorRenderbuffer.length;ne++)b.__webglColorRenderbuffer[ne]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[ne]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const q=C.textures;for(let ne=0,re=q.length;ne<re;ne++){const te=n.get(q[ne]);te.__webglTexture&&(i.deleteTexture(te.__webglTexture),a.memory.textures--),n.remove(q[ne])}n.remove(C)}let x=0;function P(){x=0}function V(){const C=x;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),x+=1,C}function k(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function z(C,b){const q=n.get(C);if(C.isVideoTexture&&nt(C),C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){const ne=C.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{se(q,C,b);return}}t.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+b)}function j(C,b){const q=n.get(C);if(C.version>0&&q.__version!==C.version){se(q,C,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+b)}function D(C,b){const q=n.get(C);if(C.version>0&&q.__version!==C.version){se(q,C,b);return}t.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+b)}function Z(C,b){const q=n.get(C);if(C.version>0&&q.__version!==C.version){X(q,C,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+b)}const $={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},ue={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},he={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function L(C,b){if(b.type===1015&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===1006||b.magFilter===1007||b.magFilter===1005||b.magFilter===1008||b.minFilter===1006||b.minFilter===1007||b.minFilter===1005||b.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,$[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,$[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,$[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,ue[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,ue[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,he[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===1003||b.minFilter!==1005&&b.minFilter!==1008||b.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const q=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function ee(C,b){let q=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",R));const ne=b.source;let re=h.get(ne);re===void 0&&(re={},h.set(ne,re));const te=k(b);if(te!==C.__cacheKey){re[te]===void 0&&(re[te]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,q=!0),re[te].usedTimes++;const Ee=re[C.__cacheKey];Ee!==void 0&&(re[C.__cacheKey].usedTimes--,Ee.usedTimes===0&&N(b)),C.__cacheKey=te,C.__webglTexture=re[te].texture}return q}function se(C,b,q){let ne=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(ne=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(ne=i.TEXTURE_3D);const re=ee(C,b),te=b.source;t.bindTexture(ne,C.__webglTexture,i.TEXTURE0+q);const Ee=n.get(te);if(te.version!==Ee.__version||re===!0){t.activeTexture(i.TEXTURE0+q);const pe=Je.getPrimaries(Je.workingColorSpace),xe=b.colorSpace===xn?null:Je.getPrimaries(b.colorSpace),He=b.colorSpace===xn||pe===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let ce=g(b.image,!1,r.maxTextureSize);ce=Fe(b,ce);const me=s.convert(b.format,b.colorSpace),je=s.convert(b.type);let Ue=y(b.internalFormat,me,je,b.colorSpace,b.isVideoTexture);L(ne,b);let ye;const ke=b.mipmaps,ze=b.isVideoTexture!==!0,Ke=Ee.__version===void 0||re===!0,F=te.dataReady,le=E(b,ce);if(b.isDepthTexture)Ue=M(b.format===1027,b.type),Ke&&(ze?t.texStorage2D(i.TEXTURE_2D,1,Ue,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Ue,ce.width,ce.height,0,me,je,null));else if(b.isDataTexture)if(ke.length>0){ze&&Ke&&t.texStorage2D(i.TEXTURE_2D,le,Ue,ke[0].width,ke[0].height);for(let J=0,Q=ke.length;J<Q;J++)ye=ke[J],ze?F&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ye.width,ye.height,me,je,ye.data):t.texImage2D(i.TEXTURE_2D,J,Ue,ye.width,ye.height,0,me,je,ye.data);b.generateMipmaps=!1}else ze?(Ke&&t.texStorage2D(i.TEXTURE_2D,le,Ue,ce.width,ce.height),F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce.width,ce.height,me,je,ce.data)):t.texImage2D(i.TEXTURE_2D,0,Ue,ce.width,ce.height,0,me,je,ce.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ze&&Ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,Ue,ke[0].width,ke[0].height,ce.depth);for(let J=0,Q=ke.length;J<Q;J++)if(ye=ke[J],b.format!==1023)if(me!==null)if(ze){if(F)if(b.layerUpdates.size>0){const ie=$o(ye.width,ye.height,b.format,b.type);for(const Re of b.layerUpdates){const Ve=ye.data.subarray(Re*ie/ye.data.BYTES_PER_ELEMENT,(Re+1)*ie/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Re,ye.width,ye.height,1,me,Ve,0,0)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ye.width,ye.height,ce.depth,me,ye.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,Ue,ye.width,ye.height,ce.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ye.width,ye.height,ce.depth,me,je,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,Ue,ye.width,ye.height,ce.depth,0,me,je,ye.data)}else{ze&&Ke&&t.texStorage2D(i.TEXTURE_2D,le,Ue,ke[0].width,ke[0].height);for(let J=0,Q=ke.length;J<Q;J++)ye=ke[J],b.format!==1023?me!==null?ze?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,ye.width,ye.height,me,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,J,Ue,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?F&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ye.width,ye.height,me,je,ye.data):t.texImage2D(i.TEXTURE_2D,J,Ue,ye.width,ye.height,0,me,je,ye.data)}else if(b.isDataArrayTexture)if(ze){if(Ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,Ue,ce.width,ce.height,ce.depth),F)if(b.layerUpdates.size>0){const J=$o(ce.width,ce.height,b.format,b.type);for(const Q of b.layerUpdates){const ie=ce.data.subarray(Q*J/ce.data.BYTES_PER_ELEMENT,(Q+1)*J/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,ce.width,ce.height,1,me,je,ie)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,me,je,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ue,ce.width,ce.height,ce.depth,0,me,je,ce.data);else if(b.isData3DTexture)ze?(Ke&&t.texStorage3D(i.TEXTURE_3D,le,Ue,ce.width,ce.height,ce.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,me,je,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Ue,ce.width,ce.height,ce.depth,0,me,je,ce.data);else if(b.isFramebufferTexture){if(Ke)if(ze)t.texStorage2D(i.TEXTURE_2D,le,Ue,ce.width,ce.height);else{let J=ce.width,Q=ce.height;for(let ie=0;ie<le;ie++)t.texImage2D(i.TEXTURE_2D,ie,Ue,J,Q,0,me,je,null),J>>=1,Q>>=1}}else if(ke.length>0){if(ze&&Ke){const J=Ce(ke[0]);t.texStorage2D(i.TEXTURE_2D,le,Ue,J.width,J.height)}for(let J=0,Q=ke.length;J<Q;J++)ye=ke[J],ze?F&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,me,je,ye):t.texImage2D(i.TEXTURE_2D,J,Ue,me,je,ye);b.generateMipmaps=!1}else if(ze){if(Ke){const J=Ce(ce);t.texStorage2D(i.TEXTURE_2D,le,Ue,J.width,J.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,me,je,ce)}else t.texImage2D(i.TEXTURE_2D,0,Ue,me,je,ce);f(b)&&p(ne),Ee.__version=te.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function X(C,b,q){if(b.image.length!==6)return;const ne=ee(C,b),re=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+q);const te=n.get(re);if(re.version!==te.__version||ne===!0){t.activeTexture(i.TEXTURE0+q);const Ee=Je.getPrimaries(Je.workingColorSpace),pe=b.colorSpace===xn?null:Je.getPrimaries(b.colorSpace),xe=b.colorSpace===xn||Ee===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const He=b.isCompressedTexture||b.image[0].isCompressedTexture,ce=b.image[0]&&b.image[0].isDataTexture,me=[];for(let Q=0;Q<6;Q++)!He&&!ce?me[Q]=g(b.image[Q],!0,r.maxCubemapSize):me[Q]=ce?b.image[Q].image:b.image[Q],me[Q]=Fe(b,me[Q]);const je=me[0],Ue=s.convert(b.format,b.colorSpace),ye=s.convert(b.type),ke=y(b.internalFormat,Ue,ye,b.colorSpace),ze=b.isVideoTexture!==!0,Ke=te.__version===void 0||ne===!0,F=re.dataReady;let le=E(b,je);L(i.TEXTURE_CUBE_MAP,b);let J;if(He){ze&&Ke&&t.texStorage2D(i.TEXTURE_CUBE_MAP,le,ke,je.width,je.height);for(let Q=0;Q<6;Q++){J=me[Q].mipmaps;for(let ie=0;ie<J.length;ie++){const Re=J[ie];b.format!==1023?Ue!==null?ze?F&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie,0,0,Re.width,Re.height,Ue,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie,ke,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ze?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie,0,0,Re.width,Re.height,Ue,ye,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie,ke,Re.width,Re.height,0,Ue,ye,Re.data)}}}else{if(J=b.mipmaps,ze&&Ke){J.length>0&&le++;const Q=Ce(me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,le,ke,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ce){ze?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,me[Q].width,me[Q].height,Ue,ye,me[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ke,me[Q].width,me[Q].height,0,Ue,ye,me[Q].data);for(let ie=0;ie<J.length;ie++){const Ve=J[ie].image[Q].image;ze?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie+1,0,0,Ve.width,Ve.height,Ue,ye,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie+1,ke,Ve.width,Ve.height,0,Ue,ye,Ve.data)}}else{ze?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ue,ye,me[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ke,Ue,ye,me[Q]);for(let ie=0;ie<J.length;ie++){const Re=J[ie];ze?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie+1,0,0,Ue,ye,Re.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ie+1,ke,Ue,ye,Re.image[Q])}}}f(b)&&p(i.TEXTURE_CUBE_MAP),te.__version=re.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Y(C,b,q,ne,re,te){const Ee=s.convert(q.format,q.colorSpace),pe=s.convert(q.type),xe=y(q.internalFormat,Ee,pe,q.colorSpace);if(!n.get(b).__hasExternalTextures){const ce=Math.max(1,b.width>>te),me=Math.max(1,b.height>>te);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,te,xe,ce,me,b.depth,0,Ee,pe,null):t.texImage2D(re,te,xe,ce,me,0,Ee,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),we(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,re,n.get(q).__webglTexture,0,et(b)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ne,re,n.get(q).__webglTexture,te),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(C,b,q){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){const ne=b.depthTexture,re=ne&&ne.isDepthTexture?ne.type:null,te=M(b.stencilBuffer,re),Ee=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=et(b);we(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,te,b.width,b.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,te,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,te,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ee,i.RENDERBUFFER,C)}else{const ne=b.textures;for(let re=0;re<ne.length;re++){const te=ne[re],Ee=s.convert(te.format,te.colorSpace),pe=s.convert(te.type),xe=y(te.internalFormat,Ee,pe,te.colorSpace),He=et(b);q&&we(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,He,xe,b.width,b.height):we(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,He,xe,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,xe,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function oe(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),z(b.depthTexture,0);const ne=n.get(b.depthTexture).__webglTexture,re=et(b);if(b.depthTexture.format===1026)we(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0);else if(b.depthTexture.format===1027)we(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function _e(C){const b=n.get(C),q=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");oe(b.__webglFramebuffer,C)}else if(q){b.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[ne]),b.__webglDepthbuffer[ne]=i.createRenderbuffer(),ae(b.__webglDepthbuffer[ne],C,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=i.createRenderbuffer(),ae(b.__webglDepthbuffer,C,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(C,b,q){const ne=n.get(C);b!==void 0&&Y(ne.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&_e(C)}function Ge(C){const b=C.texture,q=n.get(C),ne=n.get(b);C.addEventListener("dispose",T);const re=C.textures,te=C.isWebGLCubeRenderTarget===!0,Ee=re.length>1;if(Ee||(ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture()),ne.__version=b.version,a.memory.textures++),te){q.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(b.mipmaps&&b.mipmaps.length>0){q.__webglFramebuffer[pe]=[];for(let xe=0;xe<b.mipmaps.length;xe++)q.__webglFramebuffer[pe][xe]=i.createFramebuffer()}else q.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){q.__webglFramebuffer=[];for(let pe=0;pe<b.mipmaps.length;pe++)q.__webglFramebuffer[pe]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(Ee)for(let pe=0,xe=re.length;pe<xe;pe++){const He=n.get(re[pe]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&we(C)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let pe=0;pe<re.length;pe++){const xe=re[pe];q.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[pe]);const He=s.convert(xe.format,xe.colorSpace),ce=s.convert(xe.type),me=y(xe.internalFormat,He,ce,xe.colorSpace,C.isXRRenderTarget===!0),je=et(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,je,me,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,q.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),ae(q.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(te){t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),L(i.TEXTURE_CUBE_MAP,b);for(let pe=0;pe<6;pe++)if(b.mipmaps&&b.mipmaps.length>0)for(let xe=0;xe<b.mipmaps.length;xe++)Y(q.__webglFramebuffer[pe][xe],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,xe);else Y(q.__webglFramebuffer[pe],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);f(b)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let pe=0,xe=re.length;pe<xe;pe++){const He=re[pe],ce=n.get(He);t.bindTexture(i.TEXTURE_2D,ce.__webglTexture),L(i.TEXTURE_2D,He),Y(q.__webglFramebuffer,C,He,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,0),f(He)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(pe=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,ne.__webglTexture),L(pe,b),b.mipmaps&&b.mipmaps.length>0)for(let xe=0;xe<b.mipmaps.length;xe++)Y(q.__webglFramebuffer[xe],C,b,i.COLOR_ATTACHMENT0,pe,xe);else Y(q.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,pe,0);f(b)&&p(pe),t.unbindTexture()}C.depthBuffer&&_e(C)}function tt(C){const b=C.textures;for(let q=0,ne=b.length;q<ne;q++){const re=b[q];if(f(re)){const te=C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Ee=n.get(re).__webglTexture;t.bindTexture(te,Ee),p(te),t.unbindTexture()}}}const I=[],ot=[];function Oe(C){if(C.samples>0){if(we(C)===!1){const b=C.textures,q=C.width,ne=C.height;let re=i.COLOR_BUFFER_BIT;const te=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=n.get(C),pe=b.length>1;if(pe)for(let xe=0;xe<b.length;xe++)t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let xe=0;xe<b.length;xe++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[xe]);const He=n.get(b[xe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,He,0)}i.blitFramebuffer(0,0,q,ne,0,0,q,ne,re,i.NEAREST),l===!0&&(I.length=0,ot.length=0,I.push(i.COLOR_ATTACHMENT0+xe),C.depthBuffer&&C.resolveDepthBuffer===!1&&(I.push(te),ot.push(te),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ot)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,I))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let xe=0;xe<b.length;xe++){t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[xe]);const He=n.get(b[xe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,He,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function et(C){return Math.min(r.maxSamples,C.samples)}function we(C){const b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function nt(C){const b=a.render.frame;d.get(C)!==b&&(d.set(C,b),C.update())}function Fe(C,b){const q=C.colorSpace,ne=C.format,re=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||q!==en&&q!==xn&&(Je.getTransfer(q)===at?(ne!==1023||re!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),b}function Ce(C){return typeof HTMLImageElement!="undefined"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame!="undefined"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=P,this.setTexture2D=z,this.setTexture2DArray=j,this.setTexture3D=D,this.setTextureCube=Z,this.rebindTextures=Ie,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=we}function hp(i,e){function t(n,r=xn){let s;const a=Je.getTransfer(r);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1024)return i.LUMINANCE;if(n===1025)return i.LUMINANCE_ALPHA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36492)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class fp extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Yi extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pp={type:"move"};class Zs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const g of e.hand.values()){const f=t.getJointPose(g,n),p=this._getHandJoint(c,g);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&h>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pp)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Yi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const mp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gp=`
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

}`;class _p{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new Mt,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Lt({vertexShader:mp,fragmentShader:gp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ct(new $i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class vp extends Yn{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,m=null,_=null;const g=new _p,f=t.getContextAttributes();let p=null,y=null;const M=[],E=[],R=new Le;let T=null;const A=new Ft;A.layers.enable(1),A.viewport=new lt;const N=new Ft;N.layers.enable(2),N.viewport=new lt;const S=[A,N],x=new fp;x.layers.enable(1),x.layers.enable(2);let P=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Y=M[X];return Y===void 0&&(Y=new Zs,M[X]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(X){let Y=M[X];return Y===void 0&&(Y=new Zs,M[X]=Y),Y.getGripSpace()},this.getHand=function(X){let Y=M[X];return Y===void 0&&(Y=new Zs,M[X]=Y),Y.getHandSpace()};function k(X){const Y=E.indexOf(X.inputSource);if(Y===-1)return;const ae=M[Y];ae!==void 0&&(ae.update(X.inputSource,X.frame,c||a),ae.dispatchEvent({type:X.type,data:X.inputSource}))}function z(){r.removeEventListener("select",k),r.removeEventListener("selectstart",k),r.removeEventListener("selectend",k),r.removeEventListener("squeeze",k),r.removeEventListener("squeezestart",k),r.removeEventListener("squeezeend",k),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",j);for(let X=0;X<M.length;X++){const Y=E[X];Y!==null&&(E[X]=null,M[X].disconnect(Y))}P=null,V=null,g.reset(),e.setRenderTarget(p),m=null,h=null,u=null,r=null,y=null,se.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",k),r.addEventListener("selectstart",k),r.addEventListener("selectend",k),r.addEventListener("squeeze",k),r.addEventListener("squeezestart",k),r.addEventListener("squeezeend",k),r.addEventListener("end",z),r.addEventListener("inputsourceschange",j),f.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(R),r.renderState.layers===void 0){const Y={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,Y),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Wt(m.framebufferWidth,m.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let Y=null,ae=null,oe=null;f.depth&&(oe=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Y=f.stencil?1027:1026,ae=f.stencil?1020:1014);const _e={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};u=new XRWebGLBinding(r,t),h=u.createProjectionLayer(_e),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new Wt(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new Eo(h.textureWidth,h.textureHeight,ae,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function j(X){for(let Y=0;Y<X.removed.length;Y++){const ae=X.removed[Y],oe=E.indexOf(ae);oe>=0&&(E[oe]=null,M[oe].disconnect(ae))}for(let Y=0;Y<X.added.length;Y++){const ae=X.added[Y];let oe=E.indexOf(ae);if(oe===-1){for(let Ie=0;Ie<M.length;Ie++)if(Ie>=E.length){E.push(ae),oe=Ie;break}else if(E[Ie]===null){E[Ie]=ae,oe=Ie;break}if(oe===-1)break}const _e=M[oe];_e&&_e.connect(ae)}}const D=new H,Z=new H;function $(X,Y,ae){D.setFromMatrixPosition(Y.matrixWorld),Z.setFromMatrixPosition(ae.matrixWorld);const oe=D.distanceTo(Z),_e=Y.projectionMatrix.elements,Ie=ae.projectionMatrix.elements,Ge=_e[14]/(_e[10]-1),tt=_e[14]/(_e[10]+1),I=(_e[9]+1)/_e[5],ot=(_e[9]-1)/_e[5],Oe=(_e[8]-1)/_e[0],et=(Ie[8]+1)/Ie[0],we=Ge*Oe,nt=Ge*et,Fe=oe/(-Oe+et),Ce=Fe*-Oe;Y.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ce),X.translateZ(Fe),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const C=Ge+Fe,b=tt+Fe,q=we-Ce,ne=nt+(oe-Ce),re=I*tt/b*C,te=ot*tt/b*C;X.projectionMatrix.makePerspective(q,ne,re,te,C,b),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function ue(X,Y){Y===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Y.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;g.texture!==null&&(X.near=g.depthNear,X.far=g.depthFar),x.near=N.near=A.near=X.near,x.far=N.far=A.far=X.far,(P!==x.near||V!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),P=x.near,V=x.far,A.near=P,A.far=V,N.near=P,N.far=V,A.updateProjectionMatrix(),N.updateProjectionMatrix(),X.updateProjectionMatrix());const Y=X.parent,ae=x.cameras;ue(x,Y);for(let oe=0;oe<ae.length;oe++)ue(ae[oe],Y);ae.length===2?$(x,A,N):x.projectionMatrix.copy(A.projectionMatrix),he(X,x,Y)};function he(X,Y,ae){ae===null?X.matrix.copy(Y.matrixWorld):(X.matrix.copy(ae.matrixWorld),X.matrix.invert(),X.matrix.multiply(Y.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Y.projectionMatrix),X.projectionMatrixInverse.copy(Y.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=jn*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(x)};let L=null;function ee(X,Y){if(d=Y.getViewerPose(c||a),_=Y,d!==null){const ae=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let oe=!1;ae.length!==x.cameras.length&&(x.cameras.length=0,oe=!0);for(let Ie=0;Ie<ae.length;Ie++){const Ge=ae[Ie];let tt=null;if(m!==null)tt=m.getViewport(Ge);else{const ot=u.getViewSubImage(h,Ge);tt=ot.viewport,Ie===0&&(e.setRenderTargetTextures(y,ot.colorTexture,h.ignoreDepthValues?void 0:ot.depthStencilTexture),e.setRenderTarget(y))}let I=S[Ie];I===void 0&&(I=new Ft,I.layers.enable(Ie),I.viewport=new lt,S[Ie]=I),I.matrix.fromArray(Ge.transform.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale),I.projectionMatrix.fromArray(Ge.projectionMatrix),I.projectionMatrixInverse.copy(I.projectionMatrix).invert(),I.viewport.set(tt.x,tt.y,tt.width,tt.height),Ie===0&&(x.matrix.copy(I.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),oe===!0&&x.cameras.push(I)}const _e=r.enabledFeatures;if(_e&&_e.includes("depth-sensing")){const Ie=u.getDepthInformation(ae[0]);Ie&&Ie.isValid&&Ie.texture&&g.init(e,Ie,r.renderState)}}for(let ae=0;ae<M.length;ae++){const oe=E[ae],_e=M[ae];oe!==null&&_e!==void 0&&_e.update(oe,Y,c||a)}L&&L(X,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),_=null}const se=new _o;se.setAnimationLoop(ee),this.setAnimationLoop=function(X){L=X},this.dispose=function(){}}}const kn=new tn,xp=new ht;function yp(i,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function n(f,p){p.color.getRGB(f.fogColor.value,ho(i)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function r(f,p,y,M,E){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(f,p):p.isMeshToonMaterial?(s(f,p),u(f,p)):p.isMeshPhongMaterial?(s(f,p),d(f,p)):p.isMeshStandardMaterial?(s(f,p),h(f,p),p.isMeshPhysicalMaterial&&m(f,p,E)):p.isMeshMatcapMaterial?(s(f,p),_(f,p)):p.isMeshDepthMaterial?s(f,p):p.isMeshDistanceMaterial?(s(f,p),g(f,p)):p.isMeshNormalMaterial?s(f,p):p.isLineBasicMaterial?(a(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?l(f,p,y,M):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===1&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===1&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const y=e.get(p),M=y.envMap,E=y.envMapRotation;M&&(f.envMap.value=M,kn.copy(E),kn.x*=-1,kn.y*=-1,kn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(kn.y*=-1,kn.z*=-1),f.envMapRotation.value.setFromMatrix4(xp.makeRotationFromEuler(kn)),f.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function a(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,y,M){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*y,f.scale.value=M*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function d(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function u(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function h(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,y){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=y.texture,f.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function _(f,p){p.matcap&&(f.matcap.value=p.matcap)}function g(f,p){const y=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(y.matrixWorld),f.nearDistance.value=y.shadow.camera.near,f.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function bp(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){const E=M.program;n.uniformBlockBinding(y,E)}function c(y,M){let E=r[y.id];E===void 0&&(_(y),E=d(y),r[y.id]=E,y.addEventListener("dispose",f));const R=M.program;n.updateUBOMapping(y,R);const T=e.render.frame;s[y.id]!==T&&(h(y),s[y.id]=T)}function d(y){const M=u();y.__bindingPointIndex=M;const E=i.createBuffer(),R=y.__size,T=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,R,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,E),E}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const M=r[y.id],E=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,A=E.length;T<A;T++){const N=Array.isArray(E[T])?E[T]:[E[T]];for(let S=0,x=N.length;S<x;S++){const P=N[S];if(m(P,T,S,R)===!0){const V=P.__offset,k=Array.isArray(P.value)?P.value:[P.value];let z=0;for(let j=0;j<k.length;j++){const D=k[j],Z=g(D);typeof D=="number"||typeof D=="boolean"?(P.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,V+z,P.__data)):D.isMatrix3?(P.__data[0]=D.elements[0],P.__data[1]=D.elements[1],P.__data[2]=D.elements[2],P.__data[3]=0,P.__data[4]=D.elements[3],P.__data[5]=D.elements[4],P.__data[6]=D.elements[5],P.__data[7]=0,P.__data[8]=D.elements[6],P.__data[9]=D.elements[7],P.__data[10]=D.elements[8],P.__data[11]=0):(D.toArray(P.__data,z),z+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,M,E,R){const T=y.value,A=M+"_"+E;if(R[A]===void 0)return typeof T=="number"||typeof T=="boolean"?R[A]=T:R[A]=T.clone(),!0;{const N=R[A];if(typeof T=="number"||typeof T=="boolean"){if(N!==T)return R[A]=T,!0}else if(N.equals(T)===!1)return N.copy(T),!0}return!1}function _(y){const M=y.uniforms;let E=0;const R=16;for(let A=0,N=M.length;A<N;A++){const S=Array.isArray(M[A])?M[A]:[M[A]];for(let x=0,P=S.length;x<P;x++){const V=S[x],k=Array.isArray(V.value)?V.value:[V.value];for(let z=0,j=k.length;z<j;z++){const D=k[z],Z=g(D),$=E%R;$!==0&&R-$<Z.boundary&&(E+=R-$),V.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=E,E+=Z.storage}}}const T=E%R;return T>0&&(E+=R-T),y.__size=E,y.__cache={},this}function g(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function f(y){const M=y.target;M.removeEventListener("dispose",f);const E=a.indexOf(M.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function p(){for(const y in r)i.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:l,update:c,dispose:p}}class Mp{constructor(e={}){const{canvas:t=$c(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,f=null;const p=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kt,this.toneMapping=0,this.toneMappingExposure=1;const M=this;let E=!1,R=0,T=0,A=null,N=-1,S=null;const x=new lt,P=new lt;let V=null;const k=new Be(0);let z=0,j=t.width,D=t.height,Z=1,$=null,ue=null;const he=new lt(0,0,j,D),L=new lt(0,0,j,D);let ee=!1;const se=new zs;let X=!1,Y=!1;const ae=new ht,oe=new H,_e=new lt,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function tt(){return A===null?Z:1}let I=n;function ot(w,U){return t.getContext(w,U)}try{const w={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${dn}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",Q,!1),t.addEventListener("webglcontextcreationerror",ie,!1),I===null){const U="webgl2";if(I=ot(U,w),I===null)throw ot(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Oe,et,we,nt,Fe,Ce,C,b,q,ne,re,te,Ee,pe,xe,He,ce,me,je,Ue,ye,ke,ze,Ke;function F(){Oe=new Ch(I),Oe.init(),ke=new hp(I,Oe),et=new Mh(I,Oe,e,ke),we=new cp(I),nt=new Ih(I),Fe=new jf,Ce=new up(I,Oe,we,Fe,et,ke,nt),C=new wh(M),b=new Ah(M),q=new vd(I),ze=new yh(I,q),ne=new Rh(I,q,nt,ze),re=new Dh(I,ne,q,nt),je=new Lh(I,et,Ce),He=new Sh(Fe),te=new Yf(M,C,b,Oe,et,ze,He),Ee=new yp(M,Fe),pe=new Zf,xe=new ip(Oe),me=new xh(M,C,b,we,re,h,l),ce=new lp(M,re,et),Ke=new bp(I,nt,et,we),Ue=new bh(I,Oe,nt),ye=new Ph(I,Oe,nt),nt.programs=te.programs,M.capabilities=et,M.extensions=Oe,M.properties=Fe,M.renderLists=pe,M.shadowMap=ce,M.state=we,M.info=nt}F();const le=new vp(M,I);this.xr=le,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const w=Oe.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Oe.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(w){w!==void 0&&(Z=w,this.setSize(j,D,!1))},this.getSize=function(w){return w.set(j,D)},this.setSize=function(w,U,G=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=w,D=U,t.width=Math.floor(w*Z),t.height=Math.floor(U*Z),G===!0&&(t.style.width=w+"px",t.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(j*Z,D*Z).floor()},this.setDrawingBufferSize=function(w,U,G){j=w,D=U,Z=G,t.width=Math.floor(w*G),t.height=Math.floor(U*G),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(x)},this.getViewport=function(w){return w.copy(he)},this.setViewport=function(w,U,G,W){w.isVector4?he.set(w.x,w.y,w.z,w.w):he.set(w,U,G,W),we.viewport(x.copy(he).multiplyScalar(Z).round())},this.getScissor=function(w){return w.copy(L)},this.setScissor=function(w,U,G,W){w.isVector4?L.set(w.x,w.y,w.z,w.w):L.set(w,U,G,W),we.scissor(P.copy(L).multiplyScalar(Z).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(w){we.setScissorTest(ee=w)},this.setOpaqueSort=function(w){$=w},this.setTransparentSort=function(w){ue=w},this.getClearColor=function(w){return w.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor.apply(me,arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha.apply(me,arguments)},this.clear=function(w=!0,U=!0,G=!0){let W=0;if(w){let O=!1;if(A!==null){const de=A.texture.format;O=de===1033||de===1031||de===1029}if(O){const de=A.texture.type,ge=de===1009||de===1014||de===1012||de===1020||de===1017||de===1018,be=me.getClearColor(),Me=me.getClearAlpha(),Ne=be.r,De=be.g,Pe=be.b;ge?(m[0]=Ne,m[1]=De,m[2]=Pe,m[3]=Me,I.clearBufferuiv(I.COLOR,0,m)):(_[0]=Ne,_[1]=De,_[2]=Pe,_[3]=Me,I.clearBufferiv(I.COLOR,0,_))}else W|=I.COLOR_BUFFER_BIT}U&&(W|=I.DEPTH_BUFFER_BIT),G&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",Q,!1),t.removeEventListener("webglcontextcreationerror",ie,!1),pe.dispose(),xe.dispose(),Fe.dispose(),C.dispose(),b.dispose(),re.dispose(),ze.dispose(),Ke.dispose(),te.dispose(),le.dispose(),le.removeEventListener("sessionstart",qt),le.removeEventListener("sessionend",Wn),Yt.stop()};function J(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Q(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const w=nt.autoReset,U=ce.enabled,G=ce.autoUpdate,W=ce.needsUpdate,O=ce.type;F(),nt.autoReset=w,ce.enabled=U,ce.autoUpdate=G,ce.needsUpdate=W,ce.type=O}function ie(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Re(w){const U=w.target;U.removeEventListener("dispose",Re),Ve(U)}function Ve(w){it(w),Fe.remove(w)}function it(w){const U=Fe.get(w).programs;U!==void 0&&(U.forEach(function(G){te.releaseProgram(G)}),w.isShaderMaterial&&te.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,G,W,O,de){U===null&&(U=Ie);const ge=O.isMesh&&O.matrixWorld.determinant()<0,be=qn(w,U,G,W,O);we.setMaterial(W,ge);let Me=G.index,Ne=1;if(W.wireframe===!0){if(Me=ne.getWireframeAttribute(G),Me===void 0)return;Ne=2}const De=G.drawRange,Pe=G.attributes.position;let Qe=De.start*Ne,rt=(De.start+De.count)*Ne;de!==null&&(Qe=Math.max(Qe,de.start*Ne),rt=Math.min(rt,(de.start+de.count)*Ne)),Me!==null?(Qe=Math.max(Qe,0),rt=Math.min(rt,Me.count)):Pe!=null&&(Qe=Math.max(Qe,0),rt=Math.min(rt,Pe.count));const st=rt-Qe;if(st<0||st===1/0)return;ze.setup(O,W,be,G,Me);let Ct,Ze=Ue;if(Me!==null&&(Ct=q.get(Me),Ze=ye,Ze.setIndex(Ct)),O.isMesh)W.wireframe===!0?(we.setLineWidth(W.wireframeLinewidth*tt()),Ze.setMode(I.LINES)):Ze.setMode(I.TRIANGLES);else if(O.isLine){let Te=W.linewidth;Te===void 0&&(Te=1),we.setLineWidth(Te*tt()),O.isLineSegments?Ze.setMode(I.LINES):O.isLineLoop?Ze.setMode(I.LINE_LOOP):Ze.setMode(I.LINE_STRIP)}else O.isPoints?Ze.setMode(I.POINTS):O.isSprite&&Ze.setMode(I.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Ze.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Oe.get("WEBGL_multi_draw"))Ze.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Te=O._multiDrawStarts,pt=O._multiDrawCounts,$e=O._multiDrawCount,zt=Me?q.get(Me).bytesPerElement:1,Cn=Fe.get(W).currentProgram.getUniforms();for(let Dt=0;Dt<$e;Dt++)Cn.setValue(I,"_gl_DrawID",Dt),Ze.render(Te[Dt]/zt,pt[Dt])}else if(O.isInstancedMesh)Ze.renderInstances(Qe,st,O.count);else if(G.isInstancedBufferGeometry){const Te=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,pt=Math.min(G.instanceCount,Te);Ze.renderInstances(Qe,st,pt)}else Ze.render(Qe,st)};function ft(w,U,G){w.transparent===!0&&w.side===2&&w.forceSinglePass===!1?(w.side=1,w.needsUpdate=!0,cn(w,U,G),w.side=0,w.needsUpdate=!0,cn(w,U,G),w.side=2):cn(w,U,G)}this.compile=function(w,U,G=null){G===null&&(G=w),f=xe.get(G),f.init(U),y.push(f),G.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),w!==G&&w.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();const W=new Set;return w.traverse(function(O){const de=O.material;if(de)if(Array.isArray(de))for(let ge=0;ge<de.length;ge++){const be=de[ge];ft(be,G,O),W.add(be)}else ft(de,G,O),W.add(de)}),y.pop(),f=null,W},this.compileAsync=function(w,U,G=null){const W=this.compile(w,U,G);return new Promise(O=>{function de(){if(W.forEach(function(ge){Fe.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){O(w);return}setTimeout(de,10)}Oe.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Se=null;function Ht(w){Se&&Se(w)}function qt(){Yt.stop()}function Wn(){Yt.start()}const Yt=new _o;Yt.setAnimationLoop(Ht),typeof self!="undefined"&&Yt.setContext(self),this.setAnimationLoop=function(w){Se=w,le.setAnimationLoop(w),w===null?Yt.stop():Yt.start()},le.addEventListener("sessionstart",qt),le.addEventListener("sessionend",Wn),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(U),U=le.getCamera()),w.isScene===!0&&w.onBeforeRender(M,w,U,A),f=xe.get(w,y.length),f.init(U),y.push(f),ae.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),se.setFromProjectionMatrix(ae),Y=this.localClippingEnabled,X=He.init(this.clippingPlanes,Y),g=pe.get(w,p.length),g.init(),p.push(g),le.enabled===!0&&le.isPresenting===!0){const de=M.xr.getDepthSensingMesh();de!==null&&Xn(de,U,-1/0,M.sortObjects)}Xn(w,U,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort($,ue),Ge=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Ge&&me.addToRenderList(g,w),this.info.render.frame++,X===!0&&He.beginShadows();const G=f.state.shadowsArray;ce.render(G,w,U),X===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=g.opaque,O=g.transmissive;if(f.setupLights(),U.isArrayCamera){const de=U.cameras;if(O.length>0)for(let ge=0,be=de.length;ge<be;ge++){const Me=de[ge];Pi(W,O,w,Me)}Ge&&me.render(w);for(let ge=0,be=de.length;ge<be;ge++){const Me=de[ge];vs(g,w,Me,Me.viewport)}}else O.length>0&&Pi(W,O,w,U),Ge&&me.render(w),vs(g,w,U);A!==null&&(Ce.updateMultisampleRenderTarget(A),Ce.updateRenderTargetMipmap(A)),w.isScene===!0&&w.onAfterRender(M,w,U),ze.resetDefaultState(),N=-1,S=null,y.pop(),y.length>0?(f=y[y.length-1],X===!0&&He.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,p.pop(),p.length>0?g=p[p.length-1]:g=null};function Xn(w,U,G,W){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||se.intersectsSprite(w)){W&&_e.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ae);const ge=re.update(w),be=w.material;be.visible&&g.push(w,ge,be,G,_e.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||se.intersectsObject(w))){const ge=re.update(w),be=w.material;if(W&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),_e.copy(w.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),_e.copy(ge.boundingSphere.center)),_e.applyMatrix4(w.matrixWorld).applyMatrix4(ae)),Array.isArray(be)){const Me=ge.groups;for(let Ne=0,De=Me.length;Ne<De;Ne++){const Pe=Me[Ne],Qe=be[Pe.materialIndex];Qe&&Qe.visible&&g.push(w,ge,Qe,G,_e.z,Pe)}}else be.visible&&g.push(w,ge,be,G,_e.z,null)}}const de=w.children;for(let ge=0,be=de.length;ge<be;ge++)Xn(de[ge],U,G,W)}function vs(w,U,G,W){const O=w.opaque,de=w.transmissive,ge=w.transparent;f.setupLightsView(G),X===!0&&He.setGlobalState(M.clippingPlanes,G),W&&we.viewport(x.copy(W)),O.length>0&&$n(O,U,G),de.length>0&&$n(de,U,G),ge.length>0&&$n(ge,U,G),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function Pi(w,U,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new Wt(1,1,{generateMipmaps:!0,type:Oe.has("EXT_color_buffer_half_float")||Oe.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const de=f.state.transmissionRenderTarget[W.id],ge=W.viewport||x;de.setSize(ge.z,ge.w);const be=M.getRenderTarget();M.setRenderTarget(de),M.getClearColor(k),z=M.getClearAlpha(),z<1&&M.setClearColor(16777215,.5),Ge?me.render(G):M.clear();const Me=M.toneMapping;M.toneMapping=0;const Ne=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),X===!0&&He.setGlobalState(M.clippingPlanes,W),$n(w,G,W),Ce.updateMultisampleRenderTarget(de),Ce.updateRenderTargetMipmap(de),Oe.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let Pe=0,Qe=U.length;Pe<Qe;Pe++){const rt=U[Pe],st=rt.object,Ct=rt.geometry,Ze=rt.material,Te=rt.group;if(Ze.side===2&&st.layers.test(W.layers)){const pt=Ze.side;Ze.side=1,Ze.needsUpdate=!0,cr(st,G,W,Ct,Ze,Te),Ze.side=pt,Ze.needsUpdate=!0,De=!0}}De===!0&&(Ce.updateMultisampleRenderTarget(de),Ce.updateRenderTargetMipmap(de))}M.setRenderTarget(be),M.setClearColor(k,z),Ne!==void 0&&(W.viewport=Ne),M.toneMapping=Me}function $n(w,U,G){const W=U.isScene===!0?U.overrideMaterial:null;for(let O=0,de=w.length;O<de;O++){const ge=w[O],be=ge.object,Me=ge.geometry,Ne=W===null?ge.material:W,De=ge.group;be.layers.test(G.layers)&&cr(be,U,G,Me,Ne,De)}}function cr(w,U,G,W,O,de){w.onBeforeRender(M,U,G,W,O,de),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),O.transparent===!0&&O.side===2&&O.forceSinglePass===!1?(O.side=1,O.needsUpdate=!0,M.renderBufferDirect(G,U,W,O,w,de),O.side=0,O.needsUpdate=!0,M.renderBufferDirect(G,U,W,O,w,de),O.side=2):M.renderBufferDirect(G,U,W,O,w,de),w.onAfterRender(M,U,G,W,O,de)}function cn(w,U,G){U.isScene!==!0&&(U=Ie);const W=Fe.get(w),O=f.state.lights,de=f.state.shadowsArray,ge=O.state.version,be=te.getParameters(w,O.state,de,U,G),Me=te.getProgramCacheKey(be);let Ne=W.programs;W.environment=w.isMeshStandardMaterial?U.environment:null,W.fog=U.fog,W.envMap=(w.isMeshStandardMaterial?b:C).get(w.envMap||W.environment),W.envMapRotation=W.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Ne===void 0&&(w.addEventListener("dispose",Re),Ne=new Map,W.programs=Ne);let De=Ne.get(Me);if(De!==void 0){if(W.currentProgram===De&&W.lightsStateVersion===ge)return Ii(w,be),De}else be.uniforms=te.getUniforms(w),w.onBeforeCompile(be,M),De=te.acquireProgram(be,Me),Ne.set(Me,De),W.uniforms=be.uniforms;const Pe=W.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Pe.clippingPlanes=He.uniform),Ii(w,be),W.needsLights=Qt(w),W.lightsStateVersion=ge,W.needsLights&&(Pe.ambientLightColor.value=O.state.ambient,Pe.lightProbe.value=O.state.probe,Pe.directionalLights.value=O.state.directional,Pe.directionalLightShadows.value=O.state.directionalShadow,Pe.spotLights.value=O.state.spot,Pe.spotLightShadows.value=O.state.spotShadow,Pe.rectAreaLights.value=O.state.rectArea,Pe.ltc_1.value=O.state.rectAreaLTC1,Pe.ltc_2.value=O.state.rectAreaLTC2,Pe.pointLights.value=O.state.point,Pe.pointLightShadows.value=O.state.pointShadow,Pe.hemisphereLights.value=O.state.hemi,Pe.directionalShadowMap.value=O.state.directionalShadowMap,Pe.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Pe.spotShadowMap.value=O.state.spotShadowMap,Pe.spotLightMatrix.value=O.state.spotLightMatrix,Pe.spotLightMap.value=O.state.spotLightMap,Pe.pointShadowMap.value=O.state.pointShadowMap,Pe.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=De,W.uniformsList=null,De}function dr(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=Or.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function Ii(w,U){const G=Fe.get(w);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function qn(w,U,G,W,O){U.isScene!==!0&&(U=Ie),Ce.resetTextureUnits();const de=U.fog,ge=W.isMeshStandardMaterial?U.environment:null,be=A===null?M.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:en,Me=(W.isMeshStandardMaterial?b:C).get(W.envMap||ge),Ne=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,De=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Pe=!!G.morphAttributes.position,Qe=!!G.morphAttributes.normal,rt=!!G.morphAttributes.color;let st=0;W.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(st=M.toneMapping);const Ct=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ze=Ct!==void 0?Ct.length:0,Te=Fe.get(W),pt=f.state.lights;if(X===!0&&(Y===!0||w!==S)){const Nt=w===S&&W.id===N;He.setState(W,w,Nt)}let $e=!1;W.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==pt.state.version||Te.outputColorSpace!==be||O.isBatchedMesh&&Te.batching===!1||!O.isBatchedMesh&&Te.batching===!0||O.isBatchedMesh&&Te.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Te.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Te.instancing===!1||!O.isInstancedMesh&&Te.instancing===!0||O.isSkinnedMesh&&Te.skinning===!1||!O.isSkinnedMesh&&Te.skinning===!0||O.isInstancedMesh&&Te.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Te.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Te.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Te.instancingMorph===!1&&O.morphTexture!==null||Te.envMap!==Me||W.fog===!0&&Te.fog!==de||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==He.numPlanes||Te.numIntersection!==He.numIntersection)||Te.vertexAlphas!==Ne||Te.vertexTangents!==De||Te.morphTargets!==Pe||Te.morphNormals!==Qe||Te.morphColors!==rt||Te.toneMapping!==st||Te.morphTargetsCount!==Ze)&&($e=!0):($e=!0,Te.__version=W.version);let zt=Te.currentProgram;$e===!0&&(zt=cn(W,U,O));let Cn=!1,Dt=!1,Jt=!1;const ut=zt.getUniforms(),Gt=Te.uniforms;if(we.useProgram(zt.program)&&(Cn=!0,Dt=!0,Jt=!0),W.id!==N&&(N=W.id,Dt=!0),Cn||S!==w){ut.setValue(I,"projectionMatrix",w.projectionMatrix),ut.setValue(I,"viewMatrix",w.matrixWorldInverse);const Nt=ut.map.cameraPosition;Nt!==void 0&&Nt.setValue(I,oe.setFromMatrixPosition(w.matrixWorld)),et.logarithmicDepthBuffer&&ut.setValue(I,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ut.setValue(I,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,Dt=!0,Jt=!0)}if(O.isSkinnedMesh){ut.setOptional(I,O,"bindMatrix"),ut.setOptional(I,O,"bindMatrixInverse");const Nt=O.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),ut.setValue(I,"boneTexture",Nt.boneTexture,Ce))}O.isBatchedMesh&&(ut.setOptional(I,O,"batchingTexture"),ut.setValue(I,"batchingTexture",O._matricesTexture,Ce),ut.setOptional(I,O,"batchingIdTexture"),ut.setValue(I,"batchingIdTexture",O._indirectTexture,Ce),ut.setOptional(I,O,"batchingColorTexture"),O._colorsTexture!==null&&ut.setValue(I,"batchingColorTexture",O._colorsTexture,Ce));const Li=G.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&je.update(O,G,zt),(Dt||Te.receiveShadow!==O.receiveShadow)&&(Te.receiveShadow=O.receiveShadow,ut.setValue(I,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Gt.envMap.value=Me,Gt.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&U.environment!==null&&(Gt.envMapIntensity.value=U.environmentIntensity),Dt&&(ut.setValue(I,"toneMappingExposure",M.toneMappingExposure),Te.needsLights&&Na(Gt,Jt),de&&W.fog===!0&&Ee.refreshFogUniforms(Gt,de),Ee.refreshMaterialUniforms(Gt,W,Z,D,f.state.transmissionRenderTarget[w.id]),Or.upload(I,dr(Te),Gt,Ce)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Or.upload(I,dr(Te),Gt,Ce),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ut.setValue(I,"center",O.center),ut.setValue(I,"modelViewMatrix",O.modelViewMatrix),ut.setValue(I,"normalMatrix",O.normalMatrix),ut.setValue(I,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Nt=W.uniformsGroups;for(let Di=0,xs=Nt.length;Di<xs;Di++){const ur=Nt[Di];Ke.update(ur,zt),Ke.bind(ur,zt)}}return zt}function Na(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function Qt(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(w,U,G){Fe.get(w.texture).__webglTexture=U,Fe.get(w.depthTexture).__webglTexture=G;const W=Fe.get(w);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||Oe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,U){const G=Fe.get(w);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,G=0){A=w,R=U,T=G;let W=!0,O=null,de=!1,ge=!1;if(w){const Me=Fe.get(w);Me.__useDefaultFramebuffer!==void 0?(we.bindFramebuffer(I.FRAMEBUFFER,null),W=!1):Me.__webglFramebuffer===void 0?Ce.setupRenderTarget(w):Me.__hasExternalTextures&&Ce.rebindTextures(w,Fe.get(w.texture).__webglTexture,Fe.get(w.depthTexture).__webglTexture);const Ne=w.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ge=!0);const De=Fe.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(De[U])?O=De[U][G]:O=De[U],de=!0):w.samples>0&&Ce.useMultisampledRTT(w)===!1?O=Fe.get(w).__webglMultisampledFramebuffer:Array.isArray(De)?O=De[G]:O=De,x.copy(w.viewport),P.copy(w.scissor),V=w.scissorTest}else x.copy(he).multiplyScalar(Z).floor(),P.copy(L).multiplyScalar(Z).floor(),V=ee;if(we.bindFramebuffer(I.FRAMEBUFFER,O)&&W&&we.drawBuffers(w,O),we.viewport(x),we.scissor(P),we.setScissorTest(V),de){const Me=Fe.get(w.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+U,Me.__webglTexture,G)}else if(ge){const Me=Fe.get(w.texture),Ne=U||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Me.__webglTexture,G||0,Ne)}N=-1},this.readRenderTargetPixels=function(w,U,G,W,O,de,ge){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Fe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ge!==void 0&&(be=be[ge]),be){we.bindFramebuffer(I.FRAMEBUFFER,be);try{const Me=w.texture,Ne=Me.format,De=Me.type;if(!et.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-W&&G>=0&&G<=w.height-O&&I.readPixels(U,G,W,O,ke.convert(Ne),ke.convert(De),de)}finally{const Me=A!==null?Fe.get(A).__webglFramebuffer:null;we.bindFramebuffer(I.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(w,U,G,W,O,de,ge){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Fe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ge!==void 0&&(be=be[ge]),be){we.bindFramebuffer(I.FRAMEBUFFER,be);try{const Me=w.texture,Ne=Me.format,De=Me.type;if(!et.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=w.width-W&&G>=0&&G<=w.height-O){const Pe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.bufferData(I.PIXEL_PACK_BUFFER,de.byteLength,I.STREAM_READ),I.readPixels(U,G,W,O,ke.convert(Ne),ke.convert(De),0),I.flush();const Qe=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);await qc(I,Qe,4);try{I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,de)}finally{I.deleteBuffer(Pe),I.deleteSync(Qe)}return de}}finally{const Me=A!==null?Fe.get(A).__webglFramebuffer:null;we.bindFramebuffer(I.FRAMEBUFFER,Me)}}},this.copyFramebufferToTexture=function(w,U=null,G=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,w=arguments[1]);const W=Math.pow(2,-G),O=Math.floor(w.image.width*W),de=Math.floor(w.image.height*W),ge=U!==null?U.x:0,be=U!==null?U.y:0;Ce.setTexture2D(w,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,ge,be,O,de),we.unbindTexture()},this.copyTextureToTexture=function(w,U,G=null,W=null,O=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,w=arguments[1],U=arguments[2],O=arguments[3]||0,G=null);let de,ge,be,Me,Ne,De;G!==null?(de=G.max.x-G.min.x,ge=G.max.y-G.min.y,be=G.min.x,Me=G.min.y):(de=w.image.width,ge=w.image.height,be=0,Me=0),W!==null?(Ne=W.x,De=W.y):(Ne=0,De=0);const Pe=ke.convert(U.format),Qe=ke.convert(U.type);Ce.setTexture2D(U,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,U.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,U.unpackAlignment);const rt=I.getParameter(I.UNPACK_ROW_LENGTH),st=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ct=I.getParameter(I.UNPACK_SKIP_PIXELS),Ze=I.getParameter(I.UNPACK_SKIP_ROWS),Te=I.getParameter(I.UNPACK_SKIP_IMAGES),pt=w.isCompressedTexture?w.mipmaps[O]:w.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,pt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,pt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,be),I.pixelStorei(I.UNPACK_SKIP_ROWS,Me),w.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,O,Ne,De,de,ge,Pe,Qe,pt.data):w.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,O,Ne,De,pt.width,pt.height,Pe,pt.data):I.texSubImage2D(I.TEXTURE_2D,O,Ne,De,de,ge,Pe,Qe,pt),I.pixelStorei(I.UNPACK_ROW_LENGTH,rt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,st),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ct),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ze),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Te),O===0&&U.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),we.unbindTexture()},this.copyTextureToTexture3D=function(w,U,G=null,W=null,O=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,w=arguments[2],U=arguments[3],O=arguments[4]||0);let de,ge,be,Me,Ne,De,Pe,Qe,rt;const st=w.isCompressedTexture?w.mipmaps[O]:w.image;G!==null?(de=G.max.x-G.min.x,ge=G.max.y-G.min.y,be=G.max.z-G.min.z,Me=G.min.x,Ne=G.min.y,De=G.min.z):(de=st.width,ge=st.height,be=st.depth,Me=0,Ne=0,De=0),W!==null?(Pe=W.x,Qe=W.y,rt=W.z):(Pe=0,Qe=0,rt=0);const Ct=ke.convert(U.format),Ze=ke.convert(U.type);let Te;if(U.isData3DTexture)Ce.setTexture3D(U,0),Te=I.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)Ce.setTexture2DArray(U,0),Te=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,U.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,U.unpackAlignment);const pt=I.getParameter(I.UNPACK_ROW_LENGTH),$e=I.getParameter(I.UNPACK_IMAGE_HEIGHT),zt=I.getParameter(I.UNPACK_SKIP_PIXELS),Cn=I.getParameter(I.UNPACK_SKIP_ROWS),Dt=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,st.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,st.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Me),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ne),I.pixelStorei(I.UNPACK_SKIP_IMAGES,De),w.isDataTexture||w.isData3DTexture?I.texSubImage3D(Te,O,Pe,Qe,rt,de,ge,be,Ct,Ze,st.data):U.isCompressedArrayTexture?I.compressedTexSubImage3D(Te,O,Pe,Qe,rt,de,ge,be,Ct,st.data):I.texSubImage3D(Te,O,Pe,Qe,rt,de,ge,be,Ct,Ze,st),I.pixelStorei(I.UNPACK_ROW_LENGTH,pt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,$e),I.pixelStorei(I.UNPACK_SKIP_PIXELS,zt),I.pixelStorei(I.UNPACK_SKIP_ROWS,Cn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Dt),O===0&&U.generateMipmaps&&I.generateMipmap(Te),we.unbindTexture()},this.initRenderTarget=function(w){Fe.get(w).__webglFramebuffer===void 0&&Ce.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Ce.setTextureCube(w,0):w.isData3DTexture?Ce.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Ce.setTexture2DArray(w,0):Ce.setTexture2D(w,0),we.unbindTexture()},this.resetState=function(){R=0,T=0,A=null,we.reset(),ze.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ys?"display-p3":"srgb",t.unpackColorSpace=Je.workingColorSpace===hr?"display-p3":"srgb"}}class qo extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tn,this.environmentIntensity=1,this.environmentRotation=new tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Sp extends Mt{constructor(e=null,t=1,n=1,r,s,a,o,l,c=1003,d=1003,u,h){super(null,a,o,l,c,d,r,s,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wp extends Mt{constructor(e,t,n,r,s,a,o,l,c){super(e,t,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ep extends Lt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Qs extends Vi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Tp extends Qs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Tt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Be(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Be(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Be(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}const xi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Yo{constructor(e,t,n){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(d){o++,s===!1&&r.onStart!==void 0&&r.onStart(d,a,o),s=!0},this.itemEnd=function(d){a++,r.onProgress!==void 0&&r.onProgress(d,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(d){r.onError!==void 0&&r.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,u){return c.push(d,u),this},this.removeHandler=function(d){const u=c.indexOf(d);return u!==-1&&c.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=c.length;u<h;u+=2){const m=c[u],_=c[u+1];if(m.global&&(m.lastIndex=0),m.test(d))return _}return null}}}const jo=new Yo;class Hr{constructor(e){this.manager=e!==void 0?e:jo,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Hr.DEFAULT_MATERIAL_NAME="__DEFAULT";class Ap extends Hr{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=xi.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=ki("img");function l(){d(),xi.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){d(),r&&r(u),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class Ko extends Hr{constructor(e){super(e)}load(e,t,n,r){const s=new Mt,a=new Ap(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class Js extends St{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const ea=new ht,Zo=new H,Qo=new H;class Jo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zs,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Zo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zo),Qo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qo),t.updateMatrixWorld(),ea.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ea),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ea)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Cp extends Jo{constructor(){super(new Ft(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=jn*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Rp extends Js{constructor(e,t,n=0,r=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.distance=n,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Cp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const el=new ht,ji=new H,ta=new H;class Pp extends Jo{constructor(){super(new Ft(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Le(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new H(1,0,0),new H(-1,0,0),new H(0,0,1),new H(0,0,-1),new H(0,1,0),new H(0,-1,0)],this._cubeUps=[new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,0,1),new H(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ji.setFromMatrixPosition(e.matrixWorld),n.position.copy(ji),ta.copy(n.position),ta.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ta),n.updateMatrixWorld(),r.makeTranslation(-ji.x,-ji.y,-ji.z),el.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(el)}}class tl extends Js{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new Pp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Ip extends Js{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Lp extends Hr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap=="undefined"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch=="undefined"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=xi.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{r&&r(c)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return xi.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),xi.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});xi.add(e,l),s.manager.itemStart(e)}}class Dp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=nl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=nl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function nl(){return(typeof performance=="undefined"?Date:performance).now()}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dn}})),typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dn);const Np=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"),zr=({title:i,width:e,height:t,background:n,accent:r,secondary:s,horizonPercent:a=58})=>{const o=Math.max(e,t),l=Math.min(e,t),c=t*(a/100),d=e*.06,u=t*.92,h=o*.035,m=o*.004,_=o*.012,g=o*.005,f=l*.11,p=Np(i),y=`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
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
  <path d="M${e*.08} ${t*.2} C ${e*.28} ${t*.08}, ${e*.5} ${t*.1}, ${e*.78} ${t*.24}" fill="none" stroke="#ffffff" stroke-width="${_}" stroke-linecap="round" opacity="0.32"/>
  <path d="M${e*.16} ${t*.82} C ${e*.36} ${t*.72}, ${e*.54} ${t*.9}, ${e*.86} ${t*.72}" fill="none" stroke="#11181d" stroke-width="${g}" stroke-linecap="round" opacity="0.18"/>
  <circle cx="${e*.72}" cy="${t*.26}" r="${f}" fill="#ffffff" opacity="0.16"/>
  <text x="${d}" y="${u}" fill="#11181d" opacity="0.28" font-size="${h}" font-family="Inter, Arial, sans-serif" letter-spacing="${m}">${p}</text>
</svg>`;return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(y)}`},Fp=[{id:"electric-storm",title:"Electric Storm",subtitle:"Artwork 01",description:"Eine ruhige immersive digitale Kunstpräsentation mit realistischer Materialität und hochwertiger Lichtführung.",year:2025,medium:"Digital painting · 2400 × 1600",image:zr({title:"Electric Storm",width:2400,height:1600,background:"#dfe5e9",secondary:"#9fb0ba",accent:"#c8b690",horizonPercent:54}),dimensions:{width:2400,height:1600},alt:"Abstrakte Landschaft mit weichen Wolken über einem warm getönten Horizont.",credit:"Freyraum Studio",tags:["landscape","soft-light","warm"],surface:"Matte Leinwand"},{id:"quiet-coastline",title:"Quiet Coastline",subtitle:"Artwork 02",description:"Minimalistische Küstenkomposition mit fein ausgearbeiteter Materialstruktur.",year:2025,medium:"Digital painting · 1800 × 2400",image:zr({title:"Quiet Coastline",width:1800,height:2400,background:"#eef1f3",secondary:"#c9d4d8",accent:"#a6b4ae",horizonPercent:62}),dimensions:{width:1800,height:2400},alt:"Hochformatige minimalistische Küstenszene in gedämpften Grautönen.",credit:"Freyraum Studio",tags:["portrait","coast","minimal"],surface:"Matte Leinwand"},{id:"tokyo-passage",title:"Tokyo Passage",subtitle:"Artwork 03",description:"Cinematische urbane Perspektiven mit dramatischem Streiflicht.",year:2025,medium:"Digital painting · 2100 × 2100",image:zr({title:"Tokyo Passage",width:2100,height:2100,background:"#e8e3da",secondary:"#b8c1c5",accent:"#8b9497",horizonPercent:48}),dimensions:{width:2100,height:2100},alt:"Quadratische urbane Szene mit dramatischem Streiflicht in kühlen Tönen.",credit:"Freyraum Studio",tags:["square","urban","cinematic"],surface:"Satinierte Leinwand"},{id:"golden-desert",title:"Golden Desert",subtitle:"Artwork 04",description:"Atmosphärische Lichtstimmung kombiniert mit realistischer Leinwandstruktur.",year:2025,medium:"Digital painting · 2800 × 1200",image:zr({title:"Golden Desert",width:2800,height:1200,background:"#f0ece4",secondary:"#d8c7a5",accent:"#a98f6d",horizonPercent:57}),dimensions:{width:2800,height:1200},alt:"Ultra-breite Wüstenkomposition in goldenen und sandfarbenen Tönen.",credit:"Freyraum Studio",tags:["ultrawide","desert","warm"],surface:"Matte Leinwand"}],Ki={high:{id:"high",label:"Hoch",description:"Volle Detailtiefe für moderne dedizierte GPUs.",pixelRatioCap:1.6,bloomStrength:.04,bloomRadius:.36,bloomThreshold:1.2,shadows:!0,artworkSegments:180,shaderVariant:"painting-high",normalStrength:.7,detailNormalStrength:.6,bumpStrength:0,specularStrength:.28,anisotropyDivisor:1,aoEnabled:!0,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:1024,proceduralInspectionTileSize:2048,parallaxEnabled:!0,parallaxSteps:10,parallaxScale:.012,selfShadowEnabled:!0,selfShadowSteps:6,selfShadowStrength:.3,selfShadowBias:.05,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:.002,clearcoatEnabled:!0,clearcoatStrength:.12,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0},balanced:{id:"balanced",label:"Ausgewogen",description:"Empfohlen für die meisten Laptops und Tablets.",pixelRatioCap:1.25,bloomStrength:.03,bloomRadius:.3,bloomThreshold:1.25,shadows:!0,artworkSegments:120,shaderVariant:"painting-balanced",normalStrength:.45,detailNormalStrength:.4,bumpStrength:.025,specularStrength:.3,anisotropyDivisor:2,aoEnabled:!1,grazingBoostEnabled:!0,detailNormalEnabled:!0,proceduralTileSize:512,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:.35,fxaaEnabled:!1,albedoFidelityFill:0},battery:{id:"battery",label:"Akkusparend",description:"Für integrierte GPUs und Akkubetrieb.",pixelRatioCap:1,bloomStrength:0,bloomRadius:.28,bloomThreshold:1.2,shadows:!1,artworkSegments:48,shaderVariant:"painting-battery",normalStrength:.25,detailNormalStrength:0,bumpStrength:0,specularStrength:0,anisotropyDivisor:4,aoEnabled:!1,grazingBoostEnabled:!1,detailNormalEnabled:!1,proceduralTileSize:256,proceduralInspectionTileSize:0,parallaxEnabled:!1,parallaxSteps:0,parallaxScale:0,selfShadowEnabled:!1,selfShadowSteps:0,selfShadowStrength:0,selfShadowBias:.03,selfShadowSoftness:.1,selfShadowMaxOcclusion:.28,selfShadowFilterRadius:0,clearcoatEnabled:!1,clearcoatStrength:0,clearcoatRoughnessValue:0,fxaaEnabled:!1,albedoFidelityFill:0}},il="balanced";function Gr(i){var e;return(e=Ki[i])!=null?e:Ki[il]}function Vr(i=1.8){var r,s,a;const e=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,n=((a=(s=(r=window.matchMedia)==null?void 0:r.call(window,"(pointer: coarse)"))==null?void 0:s.matches)!=null?a:!1)?Math.min(i,1.5):i;return Math.min(e,n)}const Up=.5,kp=2;function Bp(){var l,c,d;const i=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,e=(d=(c=(l=window.matchMedia)==null?void 0:l.call(window,"(pointer: coarse)"))==null?void 0:c.matches)!=null?d:!1,t=window.innerWidth*window.innerHeight,n=6e5,r=8e5,s=navigator,a=typeof s.deviceMemory=="number"?s.deviceMemory:void 0,o=typeof s.hardwareConcurrency=="number"?s.hardwareConcurrency:void 0;return a!==void 0&&a<=Up||o!==void 0&&o<=kp||e&&i>=2&&t<n?"battery":(e&&t<r,"balanced")}const rl="freyraum.diagnostics.mode",sl=500,Op=2500,yi={debug:10,info:20,warn:30,error:40};function al(i){if(!i)return null;const e=i.trim().toLowerCase();return e==="1"||e==="true"||e==="info"?"info":e==="verbose"||e==="2"?"verbose":e==="0"||e==="false"||e==="default"?"default":null}function Hp(){try{const i=new URLSearchParams(window.location.search);return al(i.get("debug"))}catch(i){return null}}function zp(){try{return al(localStorage.getItem(rl))}catch(i){return null}}function Gp(i){try{localStorage.setItem(rl,i)}catch(e){}}function Vp(i){switch(i){case"verbose":return"debug";case"info":return"info";default:return"warn"}}function na(i,e=0,t){if(i==null)return i;if(e>3)return"[max-depth]";if(typeof i=="function")return`[function ${i.name||"anonymous"}]`;if(typeof i=="bigint"||typeof i=="symbol")return i.toString();if(i instanceof Error)return{name:i.name,message:i.message,stack:i.stack};if(Array.isArray(i))return i.map(n=>na(n,e+1,t));if(typeof i=="object"){const n=i,r=t!=null?t:new WeakSet;if(r.has(n))return"[circular]";r.add(n);const s={};for(const[a,o]of Object.entries(n))s[a]=na(o,e+1,r);return s}return i}class Wp{constructor(){v(this,"startedAt",performance.now());v(this,"startedAtIso",new Date().toISOString());v(this,"entries",[]);v(this,"nextId",1);v(this,"mode");v(this,"dedupe",new Map);v(this,"globalHandlersInstalled",!1);v(this,"handlingGlobalError",!1);var e,t;this.mode=(t=(e=Hp())!=null?e:zp())!=null?t:"default",typeof window!="undefined"&&(window.__FREYRAUM_DIAGNOSTICS__=this.publicApi())}getMode(){return this.mode}setMode(e){this.mode=e,Gp(e),this.info("diagnostics","mode-changed",`Diagnostics mode set to ${e}`)}installGlobalHandlers(){this.globalHandlersInstalled||typeof window=="undefined"||(this.globalHandlersInstalled=!0,window.addEventListener("error",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","uncaught-error",e.message||"Uncaught window error",{filename:e.filename,lineno:e.lineno,colno:e.colno,error:e.error})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle global window error",t)}finally{this.handlingGlobalError=!1}}}),window.addEventListener("unhandledrejection",e=>{if(!this.handlingGlobalError){this.handlingGlobalError=!0;try{this.error("window","unhandled-rejection","Unhandled promise rejection",{reason:e.reason})}catch(t){console.error("[freyraum][diagnostics][error] Failed to handle unhandled rejection",t)}finally{this.handlingGlobalError=!1}}}))}debug(e,t,n,r){this.push("debug",e,t,n,r)}info(e,t,n,r){this.push("info",e,t,n,r)}warn(e,t,n,r){this.push("warn",e,t,n,r)}error(e,t,n,r){this.push("error",e,t,n,r)}child(e){return new Xp(this,e)}getEntries(){return this.entries}clear(){this.entries=[],this.dedupe.clear()}snapshot(){return{sessionStartedAt:this.startedAtIso,mode:this.mode,entries:this.entries}}print(e="info"){const t=yi[e];for(const n of this.entries)yi[n.level]<t||this.printEntry(n)}exportJson(){return JSON.stringify(this.snapshot(),null,2)}summarize(){const e=new Map;for(const t of this.entries){const n=`[${t.scope}] ${t.event}`,r=e.get(n);r?(r.count+=t.repeatCount,r.lastMessage=t.message,r.lastMs=t.relativeMs,yi[t.level]>yi[r.level]&&(r.level=t.level)):e.set(n,{count:t.repeatCount,level:t.level,lastMessage:t.message,lastMs:t.relativeMs})}console.group("[freyraum] Diagnostics summary");for(const[t,n]of e){const r=`${t} (×${n.count}, last +${n.lastMs}ms) — ${n.lastMessage}`;n.level==="error"?console.error(r):n.level==="warn"?console.warn(r):n.level==="info"?console.info(r):console.debug(r)}console.groupEnd()}publicApi(){return{getMode:()=>this.getMode(),setMode:e=>this.setMode(e),getEntries:()=>this.getEntries(),clear:()=>this.clear(),print:e=>this.print(e),snapshot:()=>this.snapshot(),exportJson:()=>this.exportJson(),summarize:()=>this.summarize()}}isLevelEnabled(e){return e!=="debug"||this.mode==="verbose"}push(e,t,n,r,s){if(!this.isLevelEnabled(e))return;const a=performance.now(),o=`${e}|${t}|${n}|${r}`,l=this.dedupe.get(o);if(l&&a-l.lastSeen<Op){const u=this.entries.find(h=>h.id===l.entryId);if(u){u.repeatCount+=1,l.lastSeen=a;return}}let c;try{const u=typeof s=="function"?s():s;c=u===void 0?void 0:na(u)}catch(u){c={serializationError:u instanceof Error?u.message:String(u)}}const d={id:this.nextId++,timestamp:new Date().toISOString(),relativeMs:Math.round(a-this.startedAt),level:e,scope:t,event:n,message:r,data:c,repeatCount:1};if(this.entries.push(d),this.entries.length>sl&&(this.entries=this.entries.slice(-sl)),this.dedupe.set(o,{entryId:d.id,lastSeen:a}),yi[e]>=yi[Vp(this.mode)])try{this.printEntry(d)}catch(u){console.error("[freyraum][diagnostics][error] Failed to print diagnostic entry",u)}}printEntry(e){const t=`[freyraum][${e.scope}][${e.level}] +${e.relativeMs}ms ${e.message}`,n={event:e.event};e.repeatCount>1&&(n.repeats=e.repeatCount);const r=e.data!==void 0,s=e.level==="error"?console.error:e.level==="warn"?console.warn:e.level==="info"?console.info:console.debug;if(r)try{console.groupCollapsed(t,n),s("data:",e.data),console.groupEnd()}catch(a){s(t,n,e.data)}else try{s(t,n)}catch(a){console.log(t,n)}}}class Xp{constructor(e,t){this.diagnostics=e,this.scope=t}isDebugEnabled(){return this.diagnostics.isLevelEnabled("debug")}debug(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}debugLazy(e,t,n){this.diagnostics.debug(this.scope,e,t,n)}info(e,t,n){this.diagnostics.info(this.scope,e,t,n)}warn(e,t,n){this.diagnostics.warn(this.scope,e,t,n)}error(e,t,n){this.diagnostics.error(this.scope,e,t,n)}}const ol=new Wp;function bi(){return ol}function $t(i){return ol.child(i)}const Zi=$t("renderer");class $p{constructor(e,t,n="#d8dddb"){v(this,"renderer");v(this,"preset");v(this,"wallClearColor");v(this,"renderPaused",!1);v(this,"disposed",!1);v(this,"contextChangeCallback",null);v(this,"_sizeScratch",new Le);v(this,"onContextLost",e=>{var t;e.preventDefault(),this.renderPaused=!0,(t=this.contextChangeCallback)==null||t.call(this,"lost"),Zi.warn("context-lost","WebGL context lost; render paused until restoration",{width:this.renderer.domElement.width,height:this.renderer.domElement.height})});v(this,"onContextRestored",()=>{var e;this.renderPaused=!1,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Vr(this.preset.pixelRatioCap)),this.renderer.setClearColor(new Be(this.wallClearColor)),(e=this.contextChangeCallback)==null||e.call(this,"restored"),Zi.info("context-restored","WebGL context restored",{})});this.preset=t,this.wallClearColor=n,this.renderer=new Mp({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Vr(t.pixelRatioCap)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=kt,this.renderer.toneMapping=0,this.renderer.toneMappingExposure=1,this.renderer.setClearColor(new Be(this.wallClearColor)),this.renderer.shadowMap.enabled=t.shadows,this.renderer.shadowMap.type=2,this.applyQualityDataAttribute(t.id);const r=this.renderer.domElement;r.addEventListener("webglcontextlost",this.onContextLost,!1),r.addEventListener("webglcontextrestored",this.onContextRestored,!1),e.appendChild(r)}applyPreset(e){this.preset=e,this.renderer.setPixelRatio(Vr(e.pixelRatioCap)),this.renderer.shadowMap.enabled=e.shadows,this.applyQualityDataAttribute(e.id)}setWallClearColor(e){this.wallClearColor=e,this.renderer.setClearColor(new Be(this.wallClearColor))}resize(e,t){this.renderer.setSize(Math.max(1,e),Math.max(1,t)),this.renderer.setPixelRatio(Vr(this.preset.pixelRatioCap))}isRenderPaused(){return this.renderPaused}onContextChange(e){this.contextChangeCallback=e}async prewarm(e,t){const n=this.renderer;try{typeof n.compileAsync=="function"?(await n.compileAsync(e,t),Zi.debug("prewarm-async","Shader programs pre-warmed via compileAsync()",{preset:this.preset.id})):(n.compile(e,t),Zi.debug("prewarm-sync","Shader programs pre-warmed via compile()",{preset:this.preset.id}))}catch(r){Zi.warn("prewarm-failed","Shader pre-warm failed; continuing normally",{message:r instanceof Error?r.message:String(r)})}}getRendererSnapshot(){var n,r;const e=this.renderer.info,t=this._sizeScratch;return this.renderer.getSize(t),{drawCalls:e.render.calls,triangles:e.render.triangles,points:e.render.points,lines:e.render.lines,geometries:e.memory.geometries,textures:e.memory.textures,programs:(r=(n=e.programs)==null?void 0:n.length)!=null?r:0,pixelRatio:this.renderer.getPixelRatio(),width:t.x,height:t.y,renderPaused:this.renderPaused,preset:this.preset.id}}applyQualityDataAttribute(e){try{typeof document!="undefined"&&document.documentElement&&(document.documentElement.dataset.quality=e)}catch(t){}}dispose(){if(this.disposed)return;this.disposed=!0;const e=this.renderer.domElement;e.removeEventListener("webglcontextlost",this.onContextLost,!1),e.removeEventListener("webglcontextrestored",this.onContextRestored,!1),this.contextChangeCallback=null,this.renderer.dispose()}}class qp extends qo{constructor(e=null){super();const t=new hi;t.deleteAttribute("uv");const n=new Qs({side:1}),r=new Qs,s=new tl(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new ct(t,n);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const o=new ct(t,r);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const l=new ct(t,r);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);const c=new ct(t,r);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const d=new ct(t,r);d.position.set(-2.017,.018,6.124),d.rotation.set(0,.333,0),d.scale.set(2.002,4.566,2.064),this.add(d);const u=new ct(t,r);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const h=new ct(t,r);h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),this.add(h);const m=new ct(t,Mi(50));m.position.set(-16.116,14.37,8.208),m.scale.set(.1,2.428,2.739),this.add(m);const _=new ct(t,Mi(50));_.position.set(-16.109,18.021,-8.207),_.scale.set(.1,2.425,2.751),this.add(_);const g=new ct(t,Mi(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);const f=new ct(t,Mi(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new ct(t,Mi(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const y=new ct(t,Mi(100));y.position.set(0,20,0),y.scale.set(1,.1,1),this.add(y)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Mi(i){const e=new Er;return e.color.setScalar(i),e}class Yp{constructor(e){v(this,"scene");v(this,"camera");v(this,"environmentTarget",null);this.scene=new qo,this.camera=new Ft(40,window.innerWidth/window.innerHeight,.1,100),this.camera.position.z=7;const t=new qs(e);t.compileEquirectangularShader();const n=new qp(e);this.environmentTarget=t.fromScene(n),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=.55,t.dispose(),n.dispose()}updateAspect(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix()}dispose(){var e;(e=this.environmentTarget)==null||e.dispose(),this.environmentTarget=null}}const ll={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Si{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const jp=new vo(-1,1,1,-1,0,1);class Kp extends En{constructor(){super(),this.setAttribute("position",new gn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new gn([0,2,0,0,2,0],2))}}const Zp=new Kp;class ia{constructor(e){this._mesh=new ct(Zp,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,jp)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class cl extends Si{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Lt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Xi.clone(e.uniforms),this.material=new Lt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ia(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class dl extends Si{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class Qp extends Si{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Jp{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Le);this._width=n.width,this._height=n.height,t=new Wt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:1016}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new cl(ll),this.copyPass.material.blending=0,this.clock=new Dp}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let r=0,s=this.passes.length;r<s;r++){const a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}dl!==void 0&&(a instanceof dl?n=!0:a instanceof Qp&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Le);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class em extends Si{constructor(e,t,n=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Be}render(e,t,n){const r=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}}const tm={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Be(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class wi extends Si{constructor(e,t,n,r){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=r,this.resolution=e!==void 0?new Le(e.x,e.y):new Le(256,256),this.clearColor=new Be(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Wt(s,a,{type:1016}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new Wt(s,a,{type:1016});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const m=new Wt(s,a,{type:1016});m.texture.name="UnrealBloomPass.v"+u,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),s=Math.round(s/2),a=Math.round(a/2)}const o=tm;this.highPassUniforms=Xi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Lt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Le(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const d=ll;this.copyUniforms=Xi.clone(d.uniforms),this.blendMaterial=new Lt({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Be,this.oldClearAlpha=1,this.basic=new Er,this.fsQuad=new ia(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,r),this.renderTargetsVertical[s].setSize(n,r),this.separableBlurMaterials[s].uniforms.invSize.value=new Le(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(e,t,n,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=wi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=wi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Lt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Le(.5,.5)},direction:{value:new Le(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new Lt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}wi.BlurDirectionX=new Le(1,0),wi.BlurDirectionY=new Le(0,1);const nm={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class im extends Si{constructor(){super();const e=nm;this.uniforms=Xi.clone(e.uniforms),this.material=new Ep({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ia(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Je.getTransfer(this._outputColorSpace)===at&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===7&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const rm={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Le(1/1024,1/512)}},vertexShader:`

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
	`};class sm{constructor(e,t,n,r){v(this,"composer");v(this,"bloomPass");v(this,"fxaaPass");v(this,"renderer");var o;this.renderer=e,this.composer=new Jp(e);const s=new em(t,n);this.composer.addPass(s),this.bloomPass=new wi(new Le(window.innerWidth,window.innerHeight),r.bloomStrength,r.bloomRadius,r.bloomThreshold),this.bloomPass.enabled=r.bloomStrength>0,this.composer.addPass(this.bloomPass),this.fxaaPass=new cl(rm),this.applyFXAAResolution(window.innerWidth,window.innerHeight),this.fxaaPass.enabled=(o=r.fxaaEnabled)!=null?o:!0,this.composer.addPass(this.fxaaPass);const a=new im;this.composer.addPass(a)}applyPreset(e){var t;this.bloomPass.strength=e.bloomStrength,this.bloomPass.radius=e.bloomRadius,this.bloomPass.threshold=e.bloomThreshold,this.bloomPass.enabled=e.bloomStrength>0,this.fxaaPass.enabled=(t=e.fxaaEnabled)!=null?t:!0}resize(e,t){this.composer.setSize(Math.max(1,e),Math.max(1,t)),this.applyFXAAResolution(e,t)}prewarmComposer(e,t){try{this.resize(4,4),this.composer.render()}finally{this.resize(e,t)}}render(){this.composer.render()}dispose(){this.composer.dispose()}applyFXAAResolution(e,t){const n=this.renderer.getPixelRatio();this.fxaaPass.material.uniforms.resolution.value.set(1/(e*n),1/(t*n))}}const am={ambientIntensity:.8,ambientKelvin:3e3,keys:[{kelvin:2700,intensity:200,position:{x:-9,y:6,z:6},angle:.4,penumbra:.8,decay:1.7}],accent:{kelvin:8e3,intensity:16,position:{x:7,y:-3,z:5},decay:2}};function ra(i,e){const t=Math.max(1e3,Math.min(4e4,i))/100;let n,r,s;t<=66?(n=255,r=99.4708025861*Math.log(t)-161.1195681661,s=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307):(n=329.698727446*Math.pow(t-60,-.1332047592),r=288.1221695283*Math.pow(t-60,-.0755148492),s=255),n=Math.max(0,Math.min(255,n))/255,r=Math.max(0,Math.min(255,r))/255,s=Math.max(0,Math.min(255,s))/255;const a=e!=null?e:new Be;return a.setRGB(n,r,s),a}const om=100;class lm{constructor(e,t){v(this,"scene");v(this,"ambientLight");v(this,"spots",[]);v(this,"spotTarget");v(this,"accent",null);v(this,"profile");v(this,"animate",!0);v(this,"lastUpdateTime",0);v(this,"animatedTime",0);v(this,"shadowsEnabled",!1);this.scene=e,this.profile=am,this.ambientLight=new Ip(16777215,this.profile.ambientIntensity),e.add(this.ambientLight),this.spotTarget=new St,this.spotTarget.position.set(0,0,0),e.add(this.spotTarget),this.applyProfile(this.profile),this.applyPreset(t)}applyPreset(e){this.shadowsEnabled=e.shadows;for(const t of this.spots)t.castShadow=e.shadows}getLights(){return[...this.spots,this.ambientLight]}getExpectedShadowCasterCount(){return this.shadowsEnabled?this.spots.length:0}setAnimated(e){this.animate=e}update(e){var r,s;if(!this.animate)return!1;this.lastUpdateTime>0&&(this.animatedTime+=Math.min(e-this.lastUpdateTime,om)),this.lastUpdateTime=e;const t=this.spots[0];if(!t)return!1;const n=(s=(r=this.profile.keys[0])==null?void 0:r.position.x)!=null?s:-3;return t.position.x=n+Math.sin(this.animatedTime*2e-4)*.25,!0}dispose(){this.ambientLight.dispose();for(const e of this.spots)this.scene.remove(e),e.dispose();this.spots.length=0,this.scene.remove(this.spotTarget),this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}getKeyLightWorldDir(e){const t=e!=null?e:new H,n=this.spots[0];return n?t.copy(n.position).normalize():t.set(0,0,1)}applyProfile(e){var t;for(this.ambientLight.intensity=e.ambientIntensity,ra(e.ambientKelvin,this.ambientLight.color);this.spots.length<e.keys.length;){const n=new Rp(16777215,0);this.scene.add(n),this.spots.push(n)}for(;this.spots.length>e.keys.length;){const n=this.spots.pop();this.scene.remove(n),n.dispose()}e.keys.forEach((n,r)=>this.applyKeyLight(this.spots[r],n)),e.accent?(this.accent||(this.accent=new tl(16777215,0,30),this.scene.add(this.accent)),ra(e.accent.kelvin,this.accent.color),this.accent.intensity=e.accent.intensity,this.accent.position.set(e.accent.position.x,e.accent.position.y,e.accent.position.z),this.accent.decay=(t=e.accent.decay)!=null?t:2):this.accent&&(this.scene.remove(this.accent),this.accent.dispose(),this.accent=null)}applyKeyLight(e,t){var n,r,s;ra(t.kelvin,e.color),e.intensity=t.intensity,e.distance=80,e.angle=(n=t.angle)!=null?n:.42,e.penumbra=(r=t.penumbra)!=null?r:.9,e.decay=(s=t.decay)!=null?s:1.8,e.position.set(t.position.x,t.position.y,t.position.z),e.target=this.spotTarget}}class cm{constructor(e=jo){v(this,"diagnostics",$t("texture"));v(this,"cache",new Map);v(this,"externalLoader");v(this,"localLoader");v(this,"maxAnisotropy",1);v(this,"maxTextureSize",0);v(this,"anisotropyDivisor",1);v(this,"renderer",null);v(this,"imageBitmapDecodeSupported",typeof createImageBitmap=="function"&&typeof Lp=="function");v(this,"fallbackKeys",new Set);this.externalLoader=new Ko(e),this.localLoader=new Ko(e),this.externalLoader.setCrossOrigin("anonymous")}init(e){this.renderer=e,this.maxAnisotropy=e.capabilities.getMaxAnisotropy(),this.maxTextureSize=e.capabilities.maxTextureSize,this.diagnostics.info("capabilities","Texture manager initialized",{maxAnisotropy:this.maxAnisotropy,maxTextureSize:this.maxTextureSize,imageBitmapDecodeSupported:this.imageBitmapDecodeSupported,imageBitmapStatus:this.imageBitmapDecodeSupported?"available-for-guarded-benchmark":"unsupported-or-unavailable",compressedTexturePipeline:"ktx2-basis-future-importer-milestone"})}setAnisotropyDivisor(e){const t=Math.max(1,e);if(t===this.anisotropyDivisor){this.diagnostics.debug("anisotropy-noop","Anisotropy divisor unchanged; skipping cache walk",{divisor:t,cacheSize:this.cache.size});return}this.anisotropyDivisor=t;const n=this.getEffectiveAnisotropy();this.cache.forEach(r=>{r.anisotropy=n,r.needsUpdate=!0}),this.diagnostics.debug("anisotropy-applied","Anisotropy divisor changed; cache marked for re-upload",{divisor:t,anisotropy:n,cacheSize:this.cache.size})}getEffectiveAnisotropy(){return Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor))}async preload(e){this.diagnostics.info("preload",`Preloading ${e.length} albedo texture(s)`,{count:e.length,urlTypes:e.map(t=>this.compactUrlType(t))}),await Promise.all(e.map(t=>this.load(t)))}load(e){return this.loadForRole(e,"albedo")}loadForRole(e,t){const n=`${t}::${e}`;if(this.cache.has(n))return Promise.resolve(this.cache.get(n));const r=/^https?:\/\//i.test(e),s=r?this.externalLoader:this.localLoader,a=this.classifyUrlType(e),o=this.redactUrlForLog(e);return this.diagnostics.debug("load-start",`Starting ${t} texture load`,{url:o,urlType:a,role:t,crossOrigin:r?"anonymous":"none"}),new Promise(l=>{s.load(e,c=>{var m;this.prepareTexture(c,t),this.cache.set(n,c),(m=this.renderer)==null||m.initTexture(c);const d=c.image,u="naturalWidth"in d?d.naturalWidth||d.width||0:d.width||0,h="naturalHeight"in d?d.naturalHeight||d.height||0:d.height||0;this.warnIfOversized(t,o,a,u,h),this.diagnostics.info("load-success",`Loaded ${t} texture`,{url:o,urlType:a,width:u,height:h,fallbackUsed:!1}),l(c)},void 0,c=>{var u;this.diagnostics.warn("load-fallback",`Failed to load ${t} texture — creating generated fallback`,{url:o,urlType:a,role:t,errorMessage:c instanceof Error?c.message:String(c)});const d=this.createFallbackTexture(e);this.cache.set(n,d),(u=this.renderer)==null||u.initTexture(d),this.fallbackKeys.add(n),l(d)})})}async preloadTextureSet(e){if(!e)return{};const t=["albedo","normal","detailNormal","height","roughness","specular","ao","varnish"],n=t.filter(s=>!!e[s]);this.diagnostics.debug("preload-texture-set",`Loading authored texture set (${n.length} role(s))`,{roles:n});const r={};return await Promise.all(t.map(async s=>{const a=e[s];if(!a)return;const o=await this.loadForRole(a.url,s);r[s]=o})),r}get(e){const t=`albedo::${e}`,n=this.cache.get(t);return n||this.diagnostics.debug("cache-miss","Albedo cache miss — texture not preloaded for this URL",{url:this.redactUrlForLog(e),cacheSize:this.cache.size}),n}getForRole(e,t){return this.cache.get(`${t}::${e}`)}isFallback(e,t="albedo"){return this.fallbackKeys.has(`${t}::${e}`)}dispose(){this.cache.forEach(e=>e.dispose()),this.cache.clear()}prepareTexture(e,t){t==="albedo"?e.colorSpace=kt:e.colorSpace=en,t==="detailNormal"&&(e.wrapS=1e3,e.wrapT=1e3);const n=Math.max(1,Math.floor(this.maxAnisotropy/this.anisotropyDivisor));e.anisotropy=n,e.needsUpdate=!0}createFallbackTexture(e){const t=document.createElement("canvas");t.width=1600,t.height=1100;const n=t.getContext("2d");if(n){const s=this.hash(e)%32,a=n.createLinearGradient(0,0,t.width,t.height);a.addColorStop(0,`hsl(${205+s}, 18%, 92%)`),a.addColorStop(.55,`hsl(${35+s}, 22%, 78%)`),a.addColorStop(1,`hsl(${205+s}, 12%, 62%)`),n.fillStyle=a,n.fillRect(0,0,t.width,t.height),n.strokeStyle="rgba(255,255,255,0.34)",n.lineWidth=28,n.beginPath(),n.moveTo(t.width*.08,t.height*.28),n.bezierCurveTo(t.width*.35,t.height*.08,t.width*.58,t.height*.32,t.width*.9,t.height*.22),n.stroke(),n.fillStyle="rgba(17,24,29,0.16)",n.font="700 58px Inter, Arial, sans-serif",n.fillText("FREYRAUM",96,t.height-96)}const r=new wp(t);return this.prepareTexture(r,"albedo"),r}warnIfOversized(e,t,n,r,s){this.maxTextureSize<=0||r<=this.maxTextureSize&&s<=this.maxTextureSize||this.diagnostics.warn("texture-oversized","Loaded texture exceeds device MAX_TEXTURE_SIZE",{role:e,url:t,urlType:n,width:r,height:s,maxTextureSize:this.maxTextureSize,likelyBrowserDownscale:!0})}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t}classifyUrlType(e){return e.startsWith("data:")?"data-uri":/^https?:\/\//i.test(e)?"external-http":"local-relative"}compactUrlType(e){const t=this.classifyUrlType(e);return t==="external-http"?"http":t==="local-relative"?"local":`data-uri:${this.dataUriMime(e)}`}redactUrlForLog(e){return this.classifyUrlType(e)!=="data-uri"?e:`[data-uri:${this.dataUriMime(e)}:${e.length}bytes]`}dataUriMime(e){const t=e.indexOf(";");return t<=5?"unknown":e.slice(5,t)}}const ul="#include <common>",dm="#include <map_fragment>",um="#include <normal_fragment_maps>",hl="#include <lights_fragment_end>";class hm extends Tp{constructor(t){super({roughness:.88,metalness:0,emissive:16777215,emissiveIntensity:t.albedoFidelityFill,clearcoat:0,specularIntensity:.3});v(this,"paintingUniforms");v(this,"currentVariant");v(this,"hasDetailNormal",!1);v(this,"hasBump",!1);v(this,"hasAO",!1);v(this,"grazingEnabled",!1);v(this,"parallaxEnabledFlag",!1);v(this,"selfShadowEnabledFlag",!1);v(this,"albedoOnlyEnabled",!1);v(this,"shadowDebugEnabled",!1);v(this,"shadowFilterEnabled",!1);v(this,"reducedMotion",!1);this.paintingUniforms={uDetailNormalStrength:{value:t.detailNormalStrength},uDetailTiling:{value:new Le(8,8)},uBumpStrength:{value:t.bumpStrength},uLightGrazingBoost:{value:.25},uReducedMotionScalar:{value:1},tDetailNormal:{value:null},uParallaxScale:{value:t.parallaxEnabled?t.parallaxScale:0},uParallaxSteps:{value:t.parallaxSteps},uShadowSteps:{value:t.selfShadowSteps},uShadowStrength:{value:t.selfShadowStrength},uShadowBias:{value:t.selfShadowBias},uShadowSoftness:{value:t.selfShadowSoftness},uShadowMaxOcclusion:{value:t.selfShadowMaxOcclusion},uShadowProfileScale:{value:.5},uShadowFilterRadius:{value:t.selfShadowFilterRadius},uKeyLightDir:{value:new H(0,0,1)},uAlbedoOnly:{value:0}},this.currentVariant=t.shaderVariant,this.normalScale.set(t.normalStrength,t.normalStrength),this.grazingEnabled=t.grazingBoostEnabled,this.parallaxEnabledFlag=t.parallaxEnabled,this.selfShadowEnabledFlag=t.selfShadowEnabled,this.onBeforeCompile=n=>{Object.assign(n.uniforms,this.paintingUniforms);const r=[];this.detailNormalActive()&&r.push("#define PAINTING_USE_DETAIL_NORMAL"),this.hasBump&&this.paintingUniforms.uBumpStrength.value>0&&r.push("#define PAINTING_USE_BUMP"),this.hasAO&&r.push("#define PAINTING_USE_AO"),this.grazingEnabled&&r.push("#define PAINTING_USE_GRAZING_BOOST"),this.parallaxActive()&&r.push("#define PAINTING_USE_PARALLAX"),this.selfShadowActive()&&r.push("#define PAINTING_USE_SELFSHADOW"),this.albedoOnlyEnabled&&r.push("#define PAINTING_DEBUG_ALBEDO_ONLY"),this.shadowDebugEnabled&&r.push("#define PAINTING_DEBUG_SHADOW"),this.shadowFilterEnabled&&this.selfShadowActive()&&this.paintingUniforms.uShadowFilterRadius.value>0&&r.push("#define PAINTING_USE_SHADOW_FILTER");let s=n.fragmentShader;s=s.replace(ul,`${ul}

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
`),s=s.replace(dm,`
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
`),s=s.replace(um,`
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
${hl}

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
`;s=s.replace(hl,c),n.fragmentShader=r.join(`
`)+`
`+s}}detailNormalActive(){return this.hasDetailNormal&&this.paintingUniforms.uDetailNormalStrength.value>0}parallaxActive(){return this.parallaxEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uParallaxScale.value>0}selfShadowActive(){return this.selfShadowEnabledFlag&&!!this.bumpMap&&this.paintingUniforms.uShadowStrength.value>0}applyPreset(t){this.normalScale.set(t.normalStrength,t.normalStrength),this.clearcoatRoughness=t.clearcoatRoughnessValue,this.emissiveIntensity=t.albedoFidelityFill,t.clearcoatEnabled||(this.clearcoat=0,this.clearcoatMap&&(this.clearcoatMap=null,this.needsUpdate=!0)),this.paintingUniforms.uDetailNormalStrength.value=t.detailNormalStrength,this.paintingUniforms.uBumpStrength.value=t.bumpStrength,this.paintingUniforms.uParallaxScale.value=t.parallaxEnabled?t.parallaxScale:0,this.paintingUniforms.uParallaxSteps.value=t.parallaxSteps,this.paintingUniforms.uShadowSteps.value=t.selfShadowSteps,this.paintingUniforms.uShadowStrength.value=t.selfShadowStrength,this.paintingUniforms.uShadowBias.value=t.selfShadowBias,this.paintingUniforms.uShadowSoftness.value=t.selfShadowSoftness,this.paintingUniforms.uShadowMaxOcclusion.value=t.selfShadowMaxOcclusion,this.paintingUniforms.uShadowFilterRadius.value=t.selfShadowFilterRadius,(!t.detailNormalEnabled||t.detailNormalStrength<=0)&&(this.paintingUniforms.tDetailNormal.value=null),t.shaderVariant==="painting-battery"&&(this.roughnessMap=null),t.specularStrength<=0&&(this.specularIntensityMap=null);const n=t.aoEnabled&&!!this.aoMap,r=t.detailNormalEnabled&&t.detailNormalStrength>0&&!!this.paintingUniforms.tDetailNormal.value,s=t.bumpStrength>0&&!!this.bumpMap,a=t.grazingBoostEnabled,o=t.parallaxEnabled&&!!this.bumpMap&&t.parallaxScale>0,l=t.selfShadowEnabled&&!!this.bumpMap&&t.selfShadowStrength>0,c=n!==this.hasAO||r!==this.detailNormalActive()||s!==this.hasBump||a!==this.grazingEnabled||o!==this.parallaxEnabledFlag||l!==this.selfShadowEnabledFlag||t.shaderVariant!==this.currentVariant;this.hasAO=n,this.hasDetailNormal=r,this.hasBump=s,this.grazingEnabled=a,this.parallaxEnabledFlag=o,this.selfShadowEnabledFlag=l,this.currentVariant=t.shaderVariant,n||(this.aoMap=null),!s&&!o&&!l&&(this.bumpMap=null),c&&(this.needsUpdate=!0)}applyTextures(t,n,r){var l,c,d,u,h,m,_;this.map=t.albedo,this.emissiveMap=t.albedo,this.emissiveIntensity=r.albedoFidelityFill,this.normalMap=(l=t.normal)!=null?l:null,this.roughnessMap=r.shaderVariant==="painting-battery"?null:(c=t.roughness)!=null?c:null,this.roughnessMap&&(this.roughness=1),this.specularIntensityMap=r.specularStrength>0&&(d=t.specular)!=null?d:null,this.specularIntensity=r.specularStrength>0?r.specularStrength:.3,this.paintingUniforms.tDetailNormal.value=r.detailNormalEnabled&&r.detailNormalStrength>0&&(u=t.detailNormal)!=null?u:null,this.paintingUniforms.uDetailTiling.value.copy(n);const s=r.bumpStrength>0||r.parallaxEnabled&&r.parallaxScale>0||r.selfShadowEnabled;this.bumpMap=s&&(h=t.height)!=null?h:null,this.bumpScale=1,this.aoMap=(m=t.ao)!=null?m:null,this.aoMapIntensity=1;const a=r.clearcoatEnabled&&(_=t.varnish)!=null?_:null,o=a!==this.clearcoatMap;this.clearcoatMap=a,this.clearcoat=r.clearcoatEnabled&&t.varnish?r.clearcoatStrength:0,this.clearcoatRoughness=r.clearcoatRoughnessValue,o&&(this.needsUpdate=!0),this.applyPreset(r)}setReducedMotion(t){this.reducedMotion!==t&&(this.reducedMotion=t,this.paintingUniforms.uReducedMotionScalar.value=1)}setKeyLightDirView(t){this.paintingUniforms.uKeyLightDir.value.copy(t)}setAlbedoOnly(t){this.albedoOnlyEnabled!==t&&(this.albedoOnlyEnabled=t,this.paintingUniforms.uAlbedoOnly.value=t?1:0,this.needsUpdate=!0)}setShadowProfileScale(t){this.paintingUniforms.uShadowProfileScale.value=Math.max(0,Math.min(2,t))}setShadowDebug(t){this.shadowDebugEnabled!==t&&(this.shadowDebugEnabled=t,this.needsUpdate=!0)}setShadowFilterRadius(t,n){this.paintingUniforms.uShadowFilterRadius.value=Math.max(0,t),n!==this.shadowFilterEnabled&&(this.shadowFilterEnabled=n,this.needsUpdate=!0)}get shaderVariant(){return this.currentVariant}activeMaps(){const t=["albedo"];return this.normalMap&&t.push("normal"),this.hasDetailNormal&&t.push("detailNormal"),this.bumpMap&&t.push("height"),this.roughnessMap&&t.push("roughness"),this.specularIntensityMap&&t.push("specular"),this.aoMap&&t.push("ao"),(this.clearcoatMap||this.clearcoat>0)&&t.push("varnish"),this.emissiveMap&&this.emissiveIntensity>0&&t.push("albedoFill"),t}}function fm(i){const e=i.image;let t=1,n=1;return"naturalWidth"in e?(t=e.naturalWidth||e.width||1,n=e.naturalHeight||e.height||1):(t=e.width||1,n=e.height||1),{width:t,height:n,aspect:t/n}}function pm(i,e,t){const n=Number.isFinite(i)&&i>0?i:1,r=e/t;return n>=r?{width:e,height:e/n}:{width:t*n,height:t}}class mm{constructor(e,t){v(this,"group");v(this,"artworkMesh");v(this,"material");v(this,"_artworkAspect",1);v(this,"_artworkWidth",4);v(this,"_artworkHeight",5.7);v(this,"currentSegments");v(this,"scene");v(this,"detailTilesPerWorldUnit",2);v(this,"_lastAspectSource","texture");v(this,"_lastManifestDimensions",null);this.scene=e,this.group=new Yi,this.currentSegments=t.artworkSegments;const n=this.makeArtworkGeometry(this.currentSegments);this.material=new hm(t),this.artworkMesh=new ct(n,this.material),this.group.add(this.artworkMesh),e.add(this.group)}getArtworkMeshObject(){return this.artworkMesh}makeArtworkGeometry(e){const t=new $i(4,5.7,e,e),n=t.getAttribute("uv");return n&&!t.getAttribute("uv1")&&t.setAttribute("uv1",n.clone()),t.computeTangents(),t}applyPreset(e){if(this.material.applyPreset(e),e.artworkSegments===this.currentSegments)return;this.currentSegments=e.artworkSegments;const t=this.artworkMesh.geometry,n=this.makeArtworkGeometry(this.currentSegments);this.artworkMesh.geometry=n,t.dispose(),this.artworkMesh.scale.set(this._artworkWidth/4,this._artworkHeight/5.7,1)}updateAspect(e,t){let n,r;t&&Number.isFinite(t.width)&&t.width>0&&Number.isFinite(t.height)&&t.height>0?(n=t.width/t.height,r="manifest"):(n=fm(e).aspect,r="texture"),this._artworkAspect=n;const{width:s,height:a}=pm(n,4.2,5.8);this._artworkWidth=s,this._artworkHeight=a,this.artworkMesh.scale.set(s/4,a/5.7,1),this._lastAspectSource=r,this._lastManifestDimensions=t!=null?t:null}setPaintingTextures(e,t,n){this.updateAspect(e.albedo,n);const r=new Le(this._artworkWidth*this.detailTilesPerWorldUnit,this._artworkHeight*this.detailTilesPerWorldUnit);this.material.applyTextures(e,r,t)}setTexture(e,t){this.setPaintingTextures({albedo:e},t)}get artworkAspect(){return this._artworkAspect}get artworkWidth(){return this._artworkWidth}get artworkHeight(){return this._artworkHeight}get lastAspectSource(){return this._lastAspectSource}get lastManifestDimensions(){return this._lastManifestDimensions}dispose(){this.scene.remove(this.group),this.artworkMesh.geometry.dispose(),this.material.dispose()}}class gm{constructor(){v(this,"cache",new Map);v(this,"currentAnisotropy",1)}generate(e,t,n){const r=Math.max(64,n!=null?n:256),s=`${e}::${t}::${r}`,a=this.cache.get(s);if(a)return a;const o=this.hash(e),l=Math.max(64,Math.floor(r/2));let c;switch(t){case"normal":c=this.generateNormal(o,r,14,6,3,.42);break;case"detailNormal":c=this.generateNormal(o*7+13,r,18,7,2.5,1.1),c.wrapS=1e3,c.wrapT=1e3;break;case"height":c=this.generateHeight(o,r);break;case"roughness":c=this.generateRoughness(o,l);break;case"specular":c=this.generateSpecular(o,l);break;case"ao":c=this.generateAO(o,r);break;case"varnish":c=this.generateVarnish(o,l);break;case"albedo":default:c=this.generateAlbedo(o);break}return this.cache.set(s,c),c.anisotropy=this.currentAnisotropy,c}disposeAll(){this.cache.forEach(e=>e.dispose()),this.cache.clear()}setAnisotropy(e){const t=Math.max(1,e|0);t!==this.currentAnisotropy&&(this.currentAnisotropy=t,this.cache.forEach(n=>{n.anisotropy=t,n.needsUpdate=!0}))}generateNormal(e,t,n,r,s,a){const o=new Uint8Array(t*t*4),l=.055*a,c=.14*a;for(let d=0;d<t;d+=1)for(let u=0;u<t;u+=1){const h=(d*t+u)*4,m=this.valueNoise2d(u*l,d*l,e),_=this.valueNoise2d((u+1)*l,d*l,e),g=this.valueNoise2d(u*l,(d+1)*l,e),f=this.valueNoise2d(u*c,d*c,e+17),p=this.valueNoise2d((u+1)*c,d*c,e+17),y=this.valueNoise2d(u*c,(d+1)*c,e+17),M=(_-m)*n+(p-f)*r,E=(g-m)*n+(y-f)*r;o[h+0]=this.clamp8(128+M*28),o[h+1]=this.clamp8(128+E*28),o[h+2]=255,o[h+3]=255}return this.makeDataTexture(o,t,t,!1)}generateHeight(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.04,r*.04,e)*90,l=this.valueNoise2d(s*.12,r*.09,e+7)*40,c=this.valueNoise2d(s*.55,r*.55,e+31)*3,d=this.clamp8(o+l+c);n[a+0]=d,n[a+1]=d,n[a+2]=d,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateRoughness(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.07,r*.07,e+3),l=this.valueNoise2d(s*.24,r*.24,e+19),c=o*.65+l*.35,d=this.clamp8(140+c*100);n[a+0]=d,n[a+1]=d,n[a+2]=d,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateSpecular(e,t){const n=new Uint8Array(t*t*4);for(let s=0;s<t*t;s+=1)n[s*4+0]=6,n[s*4+1]=6,n[s*4+2]=6,n[s*4+3]=255;const r=4+e%4;for(let s=0;s<r;s+=1){const a=e*(s+7)%t,o=e*(s+13)*3%t,l=14+e*(s+1)%18;for(let c=0;c<t;c+=1)for(let d=0;d<t;d+=1){const u=d-a,h=c-o,m=u*u+h*h,_=Math.exp(-m/(l*l))*50,g=(c*t+d)*4,f=this.clamp8(n[g]+_);n[g+0]=f,n[g+1]=f,n[g+2]=f}}return this.makeDataTexture(n,t,t,!1)}generateAO(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.11,r*.11,e)*18,l=this.clamp8(237+o);n[a+0]=l,n[a+1]=l,n[a+2]=l,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateVarnish(e,t){const n=new Uint8Array(t*t*4);for(let r=0;r<t;r+=1)for(let s=0;s<t;s+=1){const a=(r*t+s)*4,o=this.valueNoise2d(s*.035,r*.035,e+101),l=this.valueNoise2d(s*.18,r*.18,e+149),c=this.clamp8((o*.75+l*.25)*85);n[a+0]=c,n[a+1]=c,n[a+2]=c,n[a+3]=255}return this.makeDataTexture(n,t,t,!1)}generateAlbedo(e){const n=new Uint8Array(16384),r=e%32,s=200+r*3%30,a=200+r*5%30,o=200+r*7%30;for(let l=0;l<64*64;l+=1)n[l*4+0]=s,n[l*4+1]=a,n[l*4+2]=o,n[l*4+3]=255;return this.makeDataTexture(n,64,64,!0)}makeDataTexture(e,t,n,r){const s=new Sp(e,t,n,1023,1009);return s.colorSpace=r?kt:en,s.wrapS=1e3,s.wrapT=1e3,s.minFilter=1008,s.magFilter=1006,s.generateMipmaps=!0,s.needsUpdate=!0,s}clamp8(e){return e<0?0:e>255?255:e|0}hash(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)>>>0;return t||1}valueNoise2d(e,t,n){const r=Math.floor(e)|0,s=Math.floor(t)|0,a=e-Math.floor(e),o=t-Math.floor(t),l=a*a*(3-2*a),c=o*o*(3-2*o),d=this.latticeHash(r,s,n),u=this.latticeHash(r+1,s,n),h=this.latticeHash(r,s+1,n),m=this.latticeHash(r+1,s+1,n);return d*(1-l)*(1-c)+u*l*(1-c)+h*(1-l)*c+m*l*c}latticeHash(e,t,n){let r=n*1664525+e*1013904223>>>0;return r=(r^t*1540483477)>>>0,r=(r^r>>>16)>>>0,r=Math.imul(r,73244475)>>>0,r=(r^r>>>16)>>>0,(r>>>0)/4294967295}}function wt(i,e,t){return Math.max(e,Math.min(t,i))}function Ut(i,e,t,n){return n<=0?i:i+(e-i)*(1-Math.exp(-t*n))}const Qi=7,_m=18,vm=3.5,Wr=.2,sa=.12,fl=1.04,xm=.65,pl=1.5,Xr=.35,ym=.25,ml=1.2,gl=.6,_l=12,Ji=3.5,aa=3,vl=4,$r=5,qr=4.5,Yr=-.6,xl=.15,Ei=.88,bm=.1,jr=Number.MAX_SAFE_INTEGER,er=["normal","detailNormal","height","roughness","specular","ao","varnish"],oa=2,Mm=2500,Sm=250,Kr={"critical-now":0,"near-next":1,background:2},wm=["normal","detailNormal","height"];class Em{constructor(e,t,n,r,s,a){v(this,"diagnostics",$t("gallery"));v(this,"artworks");v(this,"currentIndex",0);v(this,"artworkMesh");v(this,"textureManager");v(this,"procedural");v(this,"camera");v(this,"_fovTanCache",NaN);v(this,"_fovTanForFov",NaN);v(this,"viewportMetricsProvider");v(this,"reducedMotion",!1);v(this,"currentPreset",null);v(this,"artworkLoadToken",0);v(this,"inspectionMode",!1);v(this,"pendingResetAfterArtworkLoad",!1);v(this,"lastResetFitZoom",Qi);v(this,"frameBudgetNavigationMarker",null);v(this,"interactionActive",!1);v(this,"interactionActiveSince",0);v(this,"interactionFrameCount",0);v(this,"interactionFrameTotalMs",0);v(this,"interactionFrameDropped",0);v(this,"prefetchedTextureSets",new Set);v(this,"fullPrefetchScheduled",!1);v(this,"readiness");v(this,"prefetchQueue",[]);v(this,"activePrefetches",new Set);v(this,"prefetchQueueRunning",!1);v(this,"prefetchSequence",0);v(this,"readinessRadius",oa);v(this,"startupReadinessMode","full");v(this,"startupEntryTargetCount",Number.MAX_SAFE_INTEGER);v(this,"pendingNavigationProbe",null);v(this,"proceduralQueue",new Set);v(this,"proceduralQueueRunning",!1);v(this,"renderDirtyFrames",8);v(this,"targetX",0);v(this,"targetY",0);v(this,"zoom",Qi);v(this,"targetZoom",Qi);v(this,"panX",0);v(this,"panY",0);v(this,"targetPanX",0);v(this,"targetPanY",0);v(this,"lastUpdateTime",0);v(this,"onNavigateCallback",null);this.artworks=e,this.artworkMesh=t,this.textureManager=n,this.camera=r,this.procedural=s!=null?s:new gm,this.viewportMetricsProvider=a!=null?a:null,this.readiness=e.map((o,l)=>({index:l,artworkId:o.id,albedoLoaded:!1,pbrLoaded:!o.textureSet,proceduralReady:!1,materialApplied:!1,shaderCompiled:!1,gpuWarmed:!1,pbrMs:0,proceduralMs:0,lastWarmMs:0,lastReason:"init",updatedAt:0}))}setFrameBudgetMarker(e){this.frameBudgetNavigationMarker=e}setInteractionActive(e){if(e!==this.interactionActive)if(e)this.interactionActive=!0,this.interactionActiveSince=this.now(),this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.markRenderDirty(4),this.diagnostics.debug("interaction-start","Pointer interaction window opened; non-critical prefetch paused");else{const t=this.now()-this.interactionActiveSince;this.diagnostics.info("interaction-end","Pointer interaction window ended; resuming background work",{durationMs:Math.round(t),frameCount:this.interactionFrameCount,avgFrameMs:this.interactionFrameCount>0?Math.round(this.interactionFrameTotalMs/this.interactionFrameCount*10)/10:0,droppedFrames:this.interactionFrameDropped,droppedFramePct:this.interactionFrameCount>0?Math.round(this.interactionFrameDropped/this.interactionFrameCount*100):0}),this.interactionActive=!1,this.markRenderDirty(2),this.interactionActiveSince=0,this.interactionFrameCount=0,this.interactionFrameTotalMs=0,this.interactionFrameDropped=0,this.prefetchQueue.length>0&&!this.prefetchQueueRunning&&this.drainPrefetchQueue()}}markInteractionFrame(e){this.interactionActive&&(this.interactionFrameCount+=1,this.interactionFrameTotalMs+=e,e>33&&(this.interactionFrameDropped+=1))}markRenderDirty(e=4){this.renderDirtyFrames=Math.max(this.renderDirtyFrames,Math.max(1,Math.round(e)))}configureReadinessProfile(e){this.readinessRadius=wt(Math.round(e.criticalRadius),1,3),this.diagnostics.info("readiness-profile","Applied readiness profile",{criticalRadius:this.readinessRadius,artworkCount:this.artworks.length})}configureStartupReadiness(e){this.startupReadinessMode=e.mode,this.startupEntryTargetCount=e.mode==="full"?this.artworks.length:Math.max(1,Math.min(this.artworks.length,Math.round(e.entryTargetCount))),this.diagnostics.info("startup-readiness","Applied startup readiness contract",{mode:this.startupReadinessMode,entryTargetCount:this.startupEntryTargetCount,artworkCount:this.artworks.length,criticalRadius:this.readinessRadius})}getStartupEntryTargets(e=0){const t=this.getBudgetedWarmOrder(e);return this.startupReadinessMode==="full"?t:t.slice(0,this.startupEntryTargetCount)}get isStagedStartup(){return this.startupReadinessMode!=="full"&&this.startupEntryTargetCount<this.artworks.length}applyPreset(e){var n;const t=this.currentPreset!==null;this.currentPreset=e,this.textureManager.setAnisotropyDivisor(e.anisotropyDivisor),this.procedural.setAnisotropy(this.textureManager.getEffectiveAnisotropy()),this.diagnostics.debug("preset-applied","Applied gallery quality preset",{shaderVariant:e.shaderVariant,anisotropy:this.textureManager.getEffectiveAnisotropy(),proceduralTileSize:e.proceduralTileSize,proceduralInspectionTileSize:e.proceduralInspectionTileSize,specularStrength:e.specularStrength,selfShadowBias:e.selfShadowBias}),this.markRenderDirty(4),t&&this.textureManager.get((n=this.artworks[this.currentIndex].webglImage)!=null?n:this.artworks[this.currentIndex].image)&&this.showArtwork(this.currentIndex)}setInspectionMode(e){e!==this.inspectionMode&&(this.inspectionMode=e,this.markRenderDirty(4),this.diagnostics.info("inspection-mode",`Inspection mode ${e?"enabled":"disabled"}`),this.currentPreset&&this.showArtwork(this.currentIndex))}async init(){const e=this.artworks.map(l=>({id:l.id,source:l.webglImage?"embedded-data-url":"file-url",urlType:l.webglImage?`data-uri:${l.webglImage.slice(5,l.webglImage.indexOf(";"))}`:"local-relative",hasWebglImage:!!l.webglImage,dimensions:l.dimensions}));this.diagnostics.info("init","Starting gallery init — preloading albedo textures",{artworkCount:e.length,artworks:e});const t=this.artworks.map(l=>{var c;return(c=l.webglImage)!=null?c:l.image});await this.textureManager.preload(t),this.readiness.forEach(l=>this.markReadiness(l.index,"albedoLoaded","init-preload"));const n=this.artworks.filter(l=>!!l.textureSet).length,r=new Set(this.getStartupEntryTargets(0)),s=({artwork:l,index:c})=>!!l.textureSet&&c<jr&&r.has(c),a=this.artworks.map((l,c)=>({artwork:l,index:c})).filter(s);this.diagnostics.info("init","Preloading entry-target PBR texture sets under loading overlay (v0.68 staged-readiness contract)",{mode:this.startupReadinessMode,pbrCount:a.length,textureSetCount:n,totalArtworks:this.artworks.length,entryTargetCount:r.size,safetyCap:jr,cappedArtworks:Math.max(0,this.artworks.length-jr)}),await Promise.allSettled(a.map(({artwork:l,index:c})=>this.preloadAuthoredTextureSet(c,"init-pbr-preload").then(()=>{this.prefetchedTextureSets.add(c),this.diagnostics.debug("preload-all","PBR texture set preloaded during init",{index:c,artworkId:l.id})})));const o=this.artworks.map((l,c)=>({artwork:l,index:c})).filter(({artwork:l,index:c})=>!!l.textureSet&&!this.prefetchedTextureSets.has(c));if(o.length>0){this.diagnostics.info("init","Queuing deferred artworks for deterministic near-next prefetch (v0.68 staged-readiness)",{mode:this.startupReadinessMode,deferredCount:o.length,entryTargetCount:r.size,safetyCap:jr});for(const{index:l}of o)this.scheduleTextureSetPrefetch(l,"init-staged-deferred-near-next","near-next")}this.preGenerateProceduralWindow(0,this.readinessRadius,"init-critical-window"),this.logGalleryScaleValidation(),this.diagnostics.info("init","Preload complete — showing first artwork",{artworkCount:t.length,pbrPreloaded:a.length,criticalProceduralReady:this.getCriticalWindowIndices(0,this.readinessRadius).length}),this.pendingResetAfterArtworkLoad=!0,await this.showArtwork(0),this.scheduleFullTextureSetPrefetch()}addZoomDelta(e){const t=this.getViewportMetrics(),n=this.getZoomBounds(t);this.targetZoom=this.clampZoom(this.targetZoom+e,n),this.clampPanTargets(t,n),this.markRenderDirty(4)}setPanOffset(e,t){const n=this.getViewportMetrics(),r=this.getZoomBounds(n),{x:s,y:a}=this.getPanLimits(this.targetZoom,n,r);this.targetPanX=wt(this.targetPanX+e,-s,s),this.targetPanY=wt(this.targetPanY+t,-a,a),this.markRenderDirty(4)}canPan(){const{x:e,y:t}=this.getPanLimits(this.targetZoom);return e>.01||t>.01}getHoverRotationScale(){const e=this.getZoomBounds(),t=Math.max(.001,e.maxOverviewZoom-e.minInspectionZoom),n=(this.clampZoom(this.targetZoom,e)-e.minInspectionZoom)/t;return{x:.03+n*.13,y:.018+n*.062}}async showArtwork(e){var M,E,R,T,A;const t=this.artworks[e],n=(M=t.webglImage)!=null?M:t.image,r=t.webglImage?"embedded-data-url":"file-url",s=this.textureManager.get(n),a=++this.artworkLoadToken,o=this.currentPreset,l=((E=this.pendingNavigationProbe)==null?void 0:E.toIndex)===e?this.pendingNavigationProbe:null;if(l&&!l.readinessBefore){const N=this.readiness[e];N&&(l.readinessBefore={pbrLoaded:N.pbrLoaded,proceduralReady:N.proceduralReady,gpuWarmed:N.gpuWarmed})}if(this.diagnostics.debugLazy("show-artwork","Preparing artwork render state",()=>{var N;return{index:e,artworkId:t.id,token:a,hasWebglImage:!!t.webglImage,webglImageSource:r,albedoUrlType:n.startsWith("data:")?`data-uri:${n.slice(5,n.indexOf(";"))}`:"local-relative",dimensions:t.dimensions,surface:(N=t.surface)!=null?N:null}}),!s||!o){this.diagnostics.warn("show-artwork-missing-state","Cannot render artwork because preset or albedo texture is missing",{artworkId:t.id,hasAlbedo:!!s,hasPreset:!!o,webglImageSource:r,albedoUrlType:n.startsWith("data:")?`data-uri:${n.slice(5,n.indexOf(";"))}`:"local-relative"});return}const c=await this.preloadAuthoredTextureSet(e,"show-artwork");if(t.textureSet&&this.prefetchedTextureSets.add(e),a!==this.artworkLoadToken){this.diagnostics.debugLazy("stale-load","Discarded stale artwork load",()=>({artworkId:t.id,token:a,latestToken:this.artworkLoadToken}));return}const d={albedo:(R=c.albedo)!=null?R:s},u=this.now();let h=!1;for(const N of er)c[N]?d[N]=c[N]:this.shouldFillRole(N,o)&&(d[N]=this.generateProceduralMap(t.id,N,o),h=!0);this.markReadiness(e,"proceduralReady","show-artwork",{proceduralMs:h?this.now()-u:0}),this.artworkMesh.setPaintingTextures(d,o,t.dimensions),this.markReadiness(e,"materialApplied","show-artwork"),this.markRenderDirty(8);const m={albedo:c.albedo?"authored":"preloaded"};for(const N of er)c[N]?m[N]="authored":d[N]?m[N]="procedural":m[N]="absent";this.diagnostics.debugLazy("show-artwork-maps","Resolved texture map for artwork",()=>({artworkId:t.id,maps:m,shaderVariant:o.shaderVariant,inspectionMode:this.inspectionMode}));const _=this.textureManager.isFallback(n,"albedo");_&&this.diagnostics.warn("show-artwork-fallback","Central 3D painting is using a GENERATED FALLBACK texture — the customer image could not be loaded as a WebGL texture",{artworkId:t.id,imageUrl:t.image,webglImageSource:r,manifestWidth:(T=t.dimensions)==null?void 0:T.width,manifestHeight:(A=t.dimensions)==null?void 0:A.height,fallbackUsed:!0});const g=this.getViewportMetrics(),f=this.getZoomBounds(g),p=this.getPanLimits(f.resetFitZoom,g,f),y=this.isPortraitResetArtwork();this.diagnostics.info("show-artwork-complete","Artwork is ready",{artworkId:t.id,activeMaps:this.artworkMesh.material.activeMaps(),inspectionMode:this.inspectionMode,fallbackUsed:_,webglImageSource:r,aspectSource:this.artworkMesh.lastAspectSource,manifestDimensions:this.artworkMesh.lastManifestDimensions,paintingWidth:this.artworkMesh.artworkWidth,paintingHeight:this.artworkMesh.artworkHeight,paintingAspect:this.artworkMesh.artworkAspect,resetZoom:f.resetFitZoom,minZoom:f.minInspectionZoom,closeZoomMinVisibleFraction:sa,maxZoom:f.maxOverviewZoom,overviewHeadroom:f.maxOverviewZoom-f.resetFitZoom,panOverscrollX:ml,panOverscrollY:gl,panLimitAtReset:{x:p.x,y:p.y},portraitResetApplied:y,portraitResetExtra:y?pl:0,usableViewportWidth:g.usableW,usableViewportHeight:g.usableH,usableViewportFractionX:g.usableFracX,usableViewportFractionY:g.usableFracY,viewportOcclusion:{top:g.occlusionTop,right:g.occlusionRight,bottom:g.occlusionBottom,left:g.occlusionLeft},parallaxEnabled:o.parallaxEnabled,parallaxScale:o.parallaxScale,specularStrength:o.specularStrength,selfShadowBias:o.selfShadowBias,readiness:this.readiness[e]}),this.pendingResetAfterArtworkLoad?(this.pendingResetAfterArtworkLoad=!1,this.resetView()):(this.targetZoom=this.clampZoom(this.targetZoom,f),this.zoom=this.clampZoom(this.zoom,f)),this.clampPanTargets(g,f),this.prefetchAdjacentArtworks(e),this.queueProceduralWindow(e,this.readinessRadius,"show-artwork-adjacent"),this.logNavigationReadinessVerdict(e)}getBudgetedWarmOrder(e=this.currentIndex){const t=this.getCriticalWindowIndices(e,this.readinessRadius),n=this.artworks.map((r,s)=>s).filter(r=>!t.includes(r));return[...t,...n]}markGpuWarmed(e,t,n){this.markReadiness(e,"gpuWarmed",n,{lastWarmMs:t})}markShaderCompiled(e,t){this.markReadiness(e,"shaderCompiled",t)}markAllShaderCompiled(e){this.readiness.forEach(t=>this.markReadiness(t.index,"shaderCompiled",e))}promotePrefetchWindow(e,t){this.scheduleTextureSetPrefetch(e,t,"critical-now"),this.getCriticalWindowIndices(e,this.readinessRadius).forEach(n=>{n!==e&&this.scheduleTextureSetPrefetch(n,`${t}:nearby`,"near-next")}),this.queueProceduralWindow(e,this.readinessRadius,`${t}:nearby`)}hasReadinessWork(){if(this.prefetchQueue.length>0||this.activePrefetches.size>0)return!0;const e=this.readiness[this.currentIndex];return!!e&&(!e.pbrLoaded||!e.proceduralReady||!e.gpuWarmed)}getReadinessLedger(){return this.readiness.map(e=>({...e}))}getFullGalleryReadinessSummary(){const e=this.readiness,t=c=>c.albedoLoaded&&c.pbrLoaded&&c.proceduralReady&&c.materialApplied&&c.shaderCompiled&&c.gpuWarmed,n=e.filter(t).length,r=0,s=e.filter(c=>!t(c)).map(c=>c.artworkId),a=this.isStagedStartup,o=a?new Set(this.getStartupEntryTargets(this.currentIndex)):null,l=o?e.filter(c=>!o.has(c.index)&&!t(c)).length:0;return{totalArtworks:this.artworks.length,fullyReadyCount:n,pendingCount:this.artworks.length-n,gpuWarmedCount:e.filter(c=>c.gpuWarmed).length,pbrLoadedCount:e.filter(c=>c.pbrLoaded).length,proceduralReadyCount:e.filter(c=>c.proceduralReady).length,memoryCapApplied:!1,preloadMode:a?"staged":"strict",unresolvedArtworkIds:s,deferredArtworkCount:l,overflowArtworkCount:r}}getEntryWarmTargets(e,t){const n=Math.max(1,Math.min(this.artworks.length,Math.round(t)));return this.getBudgetedWarmOrder(e).slice(0,n)}async ensureEntryReadiness(e,t){var n;for(const r of e)await this.preloadAuthoredTextureSet(r,`${t}:critical-now`),(n=this.artworks[r])!=null&&n.textureSet&&this.prefetchedTextureSets.add(r),this.preGenerateProceduralWindow(r,0,`${t}:critical-now`),this.scheduleTextureSetPrefetch(r,`${t}:critical-now`,"critical-now")}getEntryReadinessContract(e){const t=[];for(const n of e){const r=this.readiness[n];if(!r){t.push(n);continue}(!r.albedoLoaded||!r.pbrLoaded||!r.proceduralReady||!r.materialApplied||!r.gpuWarmed)&&t.push(n)}return{ready:t.length===0,pendingIndices:t,targetIndices:[...e]}}warmArtworkForGPU(e,t="gpu-warm"){var d,u;const n=this.now(),r=this.artworks[e],s=this.currentPreset;if(!r||!s)return!1;const a=(d=r.webglImage)!=null?d:r.image,o=this.textureManager.get(a);if(!o)return this.diagnostics.warn("warm-gpu","Cannot warm artwork because albedo is not cached",{index:e,artworkId:r.id}),!1;const l={};if(r.textureSet){const h=r.textureSet.albedo?this.textureManager.getForRole(r.textureSet.albedo.url,"albedo"):void 0;h&&(l.albedo=h);for(const m of er){const _=r.textureSet[m];if(!_)continue;const g=this.textureManager.getForRole(_.url,m);g&&(l[m]=g)}}const c={albedo:(u=l.albedo)!=null?u:o};for(const h of er)l[h]?c[h]=l[h]:this.shouldFillRole(h,s)&&(c[h]=this.generateProceduralMap(r.id,h,s));return this.artworkMesh.setPaintingTextures(c,s,r.dimensions),this.markReadiness(e,"proceduralReady",t),this.markReadiness(e,"materialApplied",t),this.diagnostics.debug("warm-gpu","Cached artwork textures bound for GPU warm render",{index:e,artworkId:r.id,activeMaps:this.artworkMesh.material.activeMaps(),reason:t,bindMs:Math.round((this.now()-n)*10)/10}),!0}async preloadAuthoredTextureSet(e,t){const n=this.artworks[e];if(!(n!=null&&n.textureSet))return this.markReadiness(e,"pbrLoaded",t,{pbrMs:0}),{};const r=this.now(),s=await this.textureManager.preloadTextureSet(n.textureSet);return this.markReadiness(e,"pbrLoaded",t,{pbrMs:this.now()-r}),s}generateProceduralMap(e,t,n){const r=n.proceduralInspectionTileSize,a=this.inspectionMode&&r>0&&wm.includes(t)?r:n.proceduralTileSize;return this.procedural.generate(e,t,a)}preGenerateProceduralWindow(e,t,n){var s;const r=this.currentPreset;if(r)for(const a of this.getCriticalWindowIndices(e,t)){const o=this.artworks[a],l=this.now();let c=0;for(const d of er)(s=o.textureSet)!=null&&s[d]||!this.shouldFillRole(d,r)||(this.generateProceduralMap(o.id,d,r),c+=1);this.markReadiness(a,"proceduralReady",n,{proceduralMs:c>0?this.now()-l:0}),this.diagnostics.debug("procedural-pregenerate","Procedural maps prepared for artwork",{index:a,artworkId:o.id,generated:c,reason:n,radius:t})}}getCriticalWindowIndices(e,t){const n=[],r=new Set,s=a=>{a<0||a>=this.artworks.length||r.has(a)||(r.add(a),n.push(a))};s(e);for(let a=1;a<=t;a+=1)s(e-a),s(e+a);return n}markReadiness(e,t,n,r={}){const s=this.readiness[e];s&&(s[t]=!0,s.lastReason=n,s.updatedAt=this.now(),r.pbrMs!==void 0&&(s.pbrMs=Math.round(r.pbrMs*10)/10),r.proceduralMs!==void 0&&(s.proceduralMs=Math.round(r.proceduralMs*10)/10),r.lastWarmMs!==void 0&&(s.lastWarmMs=Math.round(r.lastWarmMs*10)/10),this.markRenderDirty(2),this.diagnostics.debugLazy("readiness",`Artwork readiness updated: ${t}`,()=>({index:e,artworkId:s.artworkId,stage:t,reason:n,ready:{albedoLoaded:s.albedoLoaded,pbrLoaded:s.pbrLoaded,proceduralReady:s.proceduralReady,materialApplied:s.materialApplied,shaderCompiled:s.shaderCompiled,gpuWarmed:s.gpuWarmed},timings:{pbrMs:s.pbrMs,proceduralMs:s.proceduralMs,lastWarmMs:s.lastWarmMs}})))}now(){return typeof performance!="undefined"?performance.now():Date.now()}logGalleryScaleValidation(){const e=this.artworks.length,t=[4,15,20,50],n=t.reduce((r,s)=>Math.abs(s-e)<Math.abs(r-e)?s:r);this.diagnostics.info("validation","v0.23 gallery-size readiness profile",{artworkCount:e,nearestValidationBucket:n,validationBuckets:t,criticalWindowRadius:oa,criticalWindow:this.getCriticalWindowIndices(0,oa),warmOrderPreview:this.getBudgetedWarmOrder(0).slice(0,Math.min(e,12)),readinessLedger:this.getReadinessLedger()})}prefetchAdjacentArtworks(e){for(const t of[-1,1,-2,2]){const n=e+t;n<0||n>=this.artworks.length||this.scheduleTextureSetPrefetch(n,`adjacent:${t}`,"near-next")}}scheduleFullTextureSetPrefetch(){if(this.fullPrefetchScheduled)return;this.fullPrefetchScheduled=!0;let e=0;const t=()=>{var r;for(;e<this.artworks.length&&(!((r=this.artworks[e])!=null&&r.textureSet)||this.prefetchedTextureSets.has(e));)e+=1;if(e>=this.artworks.length){this.diagnostics.info("prefetch-complete","Idle artwork texture-set prefetch sweep complete",{artworkCount:this.artworks.length,prefetched:this.prefetchedTextureSets.size});return}const n=e;e+=1,this.scheduleTextureSetPrefetch(n,"idle-sweep","background",t)};this.scheduleIdle(t,500)}scheduleTextureSetPrefetch(e,t,n,r){const s=this.artworks[e];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(e)||this.activePrefetches.has(e)){r==null||r();return}const a=this.prefetchQueue.find(o=>o.index===e);if(a){Kr[n]<Kr[a.lane]&&(a.lane=n,a.reason=t,a.enqueuedAt=this.now(),this.sortPrefetchQueue()),r==null||r();return}this.prefetchQueue.push({index:e,reason:t,lane:n,enqueuedAt:this.now(),sequence:this.prefetchSequence++}),this.sortPrefetchQueue(),this.diagnostics.debug("prefetch-queued","Artwork texture-set prefetch queued",{index:e,artworkId:s.id,reason:t,lane:n,queueLength:this.prefetchQueue.length}),this.drainPrefetchQueue(r)}drainPrefetchQueue(e){if(this.prefetchQueueRunning){e==null||e();return}const t=()=>{if(!this.prefetchQueue.length){this.prefetchQueueRunning=!1,e==null||e();return}const n=this.prefetchQueue[0];if(this.interactionActive&&n&&n.lane!=="critical-now"){this.prefetchQueueRunning=!1,this.diagnostics.debug("prefetch-deferred-interaction","Non-critical prefetch paused for active interaction window",{deferredLane:n.lane,queueLength:this.prefetchQueue.length});return}const r=this.prefetchQueue.shift(),s=this.artworks[r.index];if(!(s!=null&&s.textureSet)||this.prefetchedTextureSets.has(r.index)){this.scheduleIdle(t,50);return}this.activePrefetches.add(r.index),this.scheduleIdle(()=>{this.diagnostics.debug("prefetch-start","Prefetching artwork texture set",{index:r.index,artworkId:s.id,reason:r.reason,lane:r.lane,queueLength:this.prefetchQueue.length}),this.preloadAuthoredTextureSet(r.index,`prefetch:${r.reason}`).then(()=>{this.prefetchedTextureSets.add(r.index),this.diagnostics.debug("prefetch-complete","Artwork texture set prefetched",{index:r.index,artworkId:s.id,reason:r.reason})}).catch(a=>{this.prefetchedTextureSets.delete(r.index),this.diagnostics.warn("prefetch-failed","Artwork texture-set prefetch failed",{index:r.index,artworkId:s.id,reason:r.reason,message:a instanceof Error?a.message:String(a)})}).finally(()=>{this.activePrefetches.delete(r.index),t()})},250)};this.prefetchQueueRunning=!0,t()}sortPrefetchQueue(){const e=this.now(),t=n=>{const r=e-n.enqueuedAt;return n.lane==="background"&&r>=Mm?Kr["near-next"]:Kr[n.lane]};this.prefetchQueue.sort((n,r)=>{const s=t(n)-t(r);return s!==0?s:n.sequence-r.sequence})}scheduleIdle(e,t){const n=window.requestIdleCallback;if(typeof n=="function"){n(e,{timeout:t});return}window.setTimeout(e,1)}shouldFillRole(e,t){switch(e){case"normal":return!0;case"detailNormal":return t.detailNormalEnabled&&t.detailNormalStrength>0;case"height":return t.bumpStrength>0||t.parallaxEnabled&&t.parallaxScale>0||t.selfShadowEnabled;case"roughness":return t.shaderVariant!=="painting-battery";case"specular":return t.specularStrength>0;case"ao":return t.aoEnabled;default:return!1}}navigate(e){var r,s,a,o;const t=this.currentIndex,n=wt((this.currentIndex+e+this.artworks.length)%this.artworks.length,0,this.artworks.length-1);this.diagnostics.info("navigate",`Navigate ${e>0?"forward":"back"}`,{fromIndex:t,toIndex:n,fromArtworkId:(r=this.artworks[t])==null?void 0:r.id,toArtworkId:(s=this.artworks[n])==null?void 0:s.id,direction:e,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:e*qr,seedPositionZ:this.reducedMotion?0:Yr,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/Ji))}),this.reducedMotion||(this.artworkMesh.group.position.x=e*qr,this.artworkMesh.group.position.z=Yr,this.artworkMesh.group.rotation.y=e*xl,this.artworkMesh.group.scale.set(Ei,Ei,Ei)),this.currentIndex=n,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:n,trigger:e>0?"navigate-next":"navigate-prev",startedAt:this.now()},this.promotePrefetchWindow(n,`navigate:${e>0?"next":"prev"}`),this.showArtwork(n),(a=this.frameBudgetNavigationMarker)==null||a.call(this),this.resetView(),(o=this.onNavigateCallback)==null||o.call(this,this.currentIndex)}goTo(e){var s,a,o,l;if(e===this.currentIndex)return;const t=this.currentIndex,n=e>this.currentIndex?1:-1,r=e-this.currentIndex;this.diagnostics.info("navigate","goTo direct navigation",{fromIndex:this.currentIndex,toIndex:e,fromArtworkId:(s=this.artworks[this.currentIndex])==null?void 0:s.id,toArtworkId:(a=this.artworks[e])==null?void 0:a.id,diff:r,motionMode:this.reducedMotion?"reduced":"full",seedPositionX:this.reducedMotion?0:(r>0?1:-1)*qr,seedPositionZ:this.reducedMotion?0:Yr,settleTargetMs:this.reducedMotion?0:Math.round(1e3*(-Math.log(.05)/Ji))}),this.currentIndex=e,this.pendingResetAfterArtworkLoad=!0,this.pendingNavigationProbe={fromIndex:t,toIndex:e,trigger:"timeline-select",startedAt:this.now()},this.promotePrefetchWindow(e,"timeline-select"),this.reducedMotion||(this.artworkMesh.group.position.x=(r>0?1:-1)*qr,this.artworkMesh.group.position.z=Yr,this.artworkMesh.group.rotation.y=n*xl,this.artworkMesh.group.scale.set(Ei,Ei,Ei)),this.showArtwork(e),(o=this.frameBudgetNavigationMarker)==null||o.call(this),this.resetView(),(l=this.onNavigateCallback)==null||l.call(this,this.currentIndex)}setReducedMotion(e){this.reducedMotion=e}handleViewportMetricsChanged(){const e=Math.abs(this.targetZoom-this.lastResetFitZoom)<=ym,t=this.getViewportMetrics(),n=this.getZoomBounds(t);e?this.targetZoom=n.resetFitZoom:this.targetZoom=wt(this.targetZoom,n.minInspectionZoom,n.maxOverviewZoom),this.zoom=wt(this.zoom,n.minInspectionZoom,n.maxOverviewZoom),this.lastResetFitZoom=n.resetFitZoom,this.clampPanTargets(t,n),this.markRenderDirty(4),this.diagnostics.info("viewport-refit","Artwork viewport metrics changed",{resetFitZoom:n.resetFitZoom,minInspectionZoom:n.minInspectionZoom,maxOverviewZoom:n.maxOverviewZoom,overviewHeadroom:n.maxOverviewZoom-n.resetFitZoom,wasNearReset:e,viewport:t})}setHoverTarget(e,t){this.targetY===e&&this.targetX===t||(this.targetY=e,this.targetX=t,this.markRenderDirty(2))}onNavigate(e){this.onNavigateCallback=e}get index(){return this.currentIndex}whenArtworkInteractive(e,t){const n=this.readiness[e];if(!n)return Promise.resolve("timeout");const r=()=>n.albedoLoaded&&n.materialApplied&&n.shaderCompiled;return r()?Promise.resolve("ready"):new Promise(s=>{const a=this.now(),o=()=>{if(r()){s("ready");return}if(this.now()-a>=t){s("timeout");return}window.setTimeout(o,50)};window.setTimeout(o,50)})}get artworkAspect(){return this.artworkMesh.artworkAspect}get proceduralFactory(){return this.procedural}update(e){const t=this.artworkMesh.group,n=this.readAnimationSnapshot();let r=0;this.lastUpdateTime>0&&(r=Math.min((e-this.lastUpdateTime)/1e3,bm)),this.lastUpdateTime=e;const s=this.getViewportMetrics(),a=this.getZoomBounds(s);return this.targetZoom=this.clampZoom(this.targetZoom,a),this.clampPanTargets(s,a),r<=0?this.consumeRenderDirty()||this.animationSnapshotChanged(n):(t.rotation.x=Ut(t.rotation.x,this.targetX,_l,r),t.rotation.y=Ut(t.rotation.y,this.targetY,_l,r),t.position.x=Ut(t.position.x,0,Ji,r),t.position.y=Ut(t.position.y,0,Ji,r),t.position.z=Ut(t.position.z,0,Ji,r),t.scale.x=Ut(t.scale.x,1,aa,r),t.scale.y=Ut(t.scale.y,1,aa,r),t.scale.z=Ut(t.scale.z,1,aa,r),this.zoom=Ut(this.zoom,this.targetZoom,vl,r),this.camera.position.z=Ut(this.camera.position.z,this.zoom,vl,r),this.panX=Ut(this.panX,this.targetPanX,$r,r),this.panY=Ut(this.panY,this.targetPanY,$r,r),this.camera.position.x=Ut(this.camera.position.x,this.panX,$r,r),this.camera.position.y=Ut(this.camera.position.y,this.panY,$r,r),this.consumeRenderDirty()||this.animationSnapshotChanged(n))}resetView(){const e=this.getZoomBounds();this.targetPanX=0,this.targetPanY=0,this.targetZoom=e.resetFitZoom,this.lastResetFitZoom=e.resetFitZoom,this.targetX=0,this.targetY=0,this.markRenderDirty(4)}consumeRenderDirty(){return this.renderDirtyFrames<=0?!1:(this.renderDirtyFrames-=1,!0)}readAnimationSnapshot(){const e=this.artworkMesh.group;return{groupX:e.position.x,groupY:e.position.y,groupZ:e.position.z,groupRotX:e.rotation.x,groupRotY:e.rotation.y,groupScaleX:e.scale.x,groupScaleY:e.scale.y,groupScaleZ:e.scale.z,zoom:this.zoom,cameraX:this.camera.position.x,cameraY:this.camera.position.y,cameraZ:this.camera.position.z,panX:this.panX,panY:this.panY,targetX:this.targetX,targetY:this.targetY,targetZoom:this.targetZoom,targetPanX:this.targetPanX,targetPanY:this.targetPanY}}animationSnapshotChanged(e){const t=this.readAnimationSnapshot();return Object.keys(e).some(n=>{const r=n;return Math.abs(t[r]-e[r])>1e-5})}clampZoom(e,t=this.getZoomBounds()){return wt(e,t.minInspectionZoom,t.maxOverviewZoom)}clampPanTargets(e=this.getViewportMetrics(),t=this.getZoomBounds(e)){const n=this.getPanLimits(this.targetZoom,e,t);this.targetPanX=wt(this.targetPanX,-n.x,n.x),this.targetPanY=wt(this.targetPanY,-n.y,n.y)}getFovTan(){const e=this.camera.fov;return e!==this._fovTanForFov&&(this._fovTanForFov=e,this._fovTanCache=Math.tan(Xc.degToRad(e*.5))),this._fovTanCache}getPanLimits(e,t=this.getViewportMetrics(),n=this.getZoomBounds(t)){const s=2*wt(e,n.minInspectionZoom,n.maxOverviewZoom)*this.getFovTan()*t.usableFracY,a=s*t.effectiveAspect;return{x:Math.max(0,(this.artworkMesh.artworkWidth-a)*.5+ml),y:Math.max(0,(this.artworkMesh.artworkHeight-s)*.5+gl)}}getZoomBounds(e=this.getViewportMetrics()){const t=this.getInspectionMinZoom(e),n=this.getResetFitZoom(e),r=Math.max(_m,n+vm);return{minInspectionZoom:wt(t,Wr,n),resetFitZoom:wt(n,Wr,r),maxOverviewZoom:r}}getInspectionMinZoom(e){const t=this.getFovTan(),n=this.artworkMesh.artworkHeight*sa,r=this.artworkMesh.artworkWidth*sa,s=n/(2*t*e.usableFracY),a=r/(2*t*this.camera.aspect*e.usableFracX);return wt(Math.max(Wr,s,a),Wr,Qi)}getResetFitZoom(e){const t=this.artworkMesh.artworkWidth+.4,n=this.artworkMesh.artworkHeight+.4,r=this.getFovTan(),s=n*fl/(2*r*e.usableFracY),a=t*fl/(2*r*this.camera.aspect*e.usableFracX),o=Math.max(Qi,s,a);return this.isPortraitResetArtwork()?o+pl:o}isPortraitResetArtwork(){return this.artworkMesh.artworkAspect<xm}getViewportMetrics(){var l,c;const e=(c=(l=this.viewportMetricsProvider)==null?void 0:l.call(this))!=null?c:this.getDefaultViewportMetrics(),t=Math.max(1,e.viewportW),n=Math.max(1,e.viewportH),r=wt(e.usableW,t*Xr,t),s=wt(e.usableH,n*Xr,n),a=wt(e.usableFracX||r/t,Xr,1),o=wt(e.usableFracY||s/n,Xr,1);return{viewportW:t,viewportH:n,usableW:r,usableH:s,usableFracX:a,usableFracY:o,effectiveAspect:Math.max(.1,e.effectiveAspect||r/s),occlusionTop:Math.max(0,e.occlusionTop),occlusionRight:Math.max(0,e.occlusionRight),occlusionBottom:Math.max(0,e.occlusionBottom),occlusionLeft:Math.max(0,e.occlusionLeft)}}getDefaultViewportMetrics(){const e=typeof window!="undefined"?window.innerWidth:1,t=typeof window!="undefined"?window.innerHeight:1;return{viewportW:e,viewportH:t,usableW:e,usableH:t,usableFracX:1,usableFracY:1,effectiveAspect:e/Math.max(1,t),occlusionTop:0,occlusionRight:0,occlusionBottom:0,occlusionLeft:0}}queueProceduralWindow(e,t,n){if(this.getCriticalWindowIndices(e,t).forEach(s=>this.proceduralQueue.add(s)),this.proceduralQueueRunning)return;this.proceduralQueueRunning=!0;const r=()=>{const s=this.proceduralQueue.values().next();if(s.done){this.proceduralQueueRunning=!1;return}const a=s.value;this.proceduralQueue.delete(a),this.scheduleIdle(()=>{this.preGenerateProceduralWindow(a,0,`${n}:queued`),r()},Sm)};r()}logNavigationReadinessVerdict(e){const t=this.pendingNavigationProbe;if(!t||t.toIndex!==e)return;this.pendingNavigationProbe=null;const n=t.readinessBefore;if(!n)return;const r=this.readiness[e];if(!r)return;const s=!n.pbrLoaded,a=!n.proceduralReady,o=!n.gpuWarmed,l=s||a||o;this.diagnostics.info(l?"cold-path-detected":"hot-path-confirmed",l?"Navigation required remaining readiness work":"Navigation stayed on prepared hot path",{trigger:t.trigger,fromIndex:t.fromIndex,toIndex:t.toIndex,durationMs:Math.round((this.now()-t.startedAt)*10)/10,cold:{pbr:s,procedural:a,gpu:o},readiness:r})}}class Tm{constructor(e){v(this,"el");v(this,"helpBtn");v(this,"infoBtn");v(this,"backBtn");v(this,"onHelpClick");v(this,"onInfoClick");v(this,"onBackClick");this.el=document.createElement("header"),this.el.className="topbar",this.el.setAttribute("role","banner");const t=document.createElement("div");t.className="topbar__left",this.backBtn=document.createElement("button"),this.backBtn.className="topbar__back-btn",this.backBtn.setAttribute("aria-label","Zurück zum Museum"),this.backBtn.innerHTML=`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      <span class="topbar__back-btn-label topbar__back-btn-label--full">Zurück zum Museum</span>
      <span class="topbar__back-btn-label topbar__back-btn-label--short">Museum</span>
    `,this.backBtn.addEventListener("click",()=>{var s;this.backBtn.disabled||(s=this.onBackClick)==null||s.call(this)});const n=document.createElement("div");n.className="topbar__brand-group",n.innerHTML=`
      <h1 class="topbar__brand">freyraum</h1>
      <div class="topbar__badge" role="note">IMMERSIVE DIGITALE AUSSTELLUNG</div>
    `,t.appendChild(this.backBtn),t.appendChild(n),this.el.appendChild(t);const r=document.createElement("div");r.className="topbar__right",this.infoBtn=document.createElement("button"),this.infoBtn.className="topbar__chrome-btn",this.infoBtn.setAttribute("aria-label","Werkinformationen einblenden"),this.infoBtn.innerHTML=`
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span class="topbar__chrome-btn-label">Info</span>
    `,this.infoBtn.addEventListener("click",()=>{var s;return(s=this.onInfoClick)==null?void 0:s.call(this)}),this.helpBtn=document.createElement("button"),this.helpBtn.className="topbar__help-btn",this.helpBtn.setAttribute("aria-label","Tastaturkürzel anzeigen"),this.helpBtn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',this.helpBtn.addEventListener("click",()=>{var s;return(s=this.onHelpClick)==null?void 0:s.call(this)}),r.appendChild(this.infoBtn),r.appendChild(this.helpBtn),this.el.appendChild(r),e.appendChild(this.el)}setBackBusy(e){this.backBtn.disabled=e,this.backBtn.setAttribute("aria-busy",e?"true":"false")}dispose(){this.el.remove()}}const _s=class _s{constructor(e,t){v(this,"el");v(this,"eyebrow");v(this,"title");v(this,"meta");v(this,"description");v(this,"credit");this.el=document.createElement("section"),this.el.className="info-panel",this.el.setAttribute("aria-live","polite"),this.el.setAttribute("aria-label","Informationen zum aktuellen Werk"),this.eyebrow=document.createElement("p"),this.eyebrow.className="info-panel__eyebrow",this.title=document.createElement("h1"),this.title.className="info-panel__title",this.meta=document.createElement("p"),this.meta.className="info-panel__meta",this.description=document.createElement("p"),this.description.className="info-panel__description",this.credit=document.createElement("p"),this.credit.className="info-panel__credit",this.el.append(this.eyebrow,this.title,this.meta,this.description,this.credit),e.appendChild(this.el),this.update(t)}update(e,t=!1){t?(this.el.classList.add("is-transitioning"),window.setTimeout(()=>{this.setContent(e),window.requestAnimationFrame(()=>{this.el.classList.remove("is-transitioning")})},_s.CONTENT_SWAP_DELAY_MS)):this.setContent(e)}setCompact(e){this.el.classList.toggle("info-panel--compact",e)}setContent(e){this.eyebrow.textContent=`${e.subtitle} · ${e.year}`,this.title.textContent=e.title,this.meta.textContent=[e.medium,e.surface].filter(Boolean).join(" · "),this.description.textContent=e.description,this.credit.textContent=`© ${e.credit}`}dispose(){this.el.remove()}};v(_s,"CONTENT_SWAP_DELAY_MS",520);let la=_s;const _n=class _n{constructor(e){v(this,"el");v(this,"prevBtn");v(this,"nextBtn");v(this,"onPrevCallback",null);v(this,"onNextCallback",null);v(this,"hintIdleTimer",null);v(this,"hintAnimationTimer",null);v(this,"hintDismissed",!1);v(this,"hintStarted",!1);v(this,"hintKeydownListener",null);v(this,"onHintStartCallback",null);v(this,"onHintFinishedCallback",null);this.el=document.createElement("nav"),this.el.className="nav-controls",this.el.setAttribute("aria-label","Galerie-Navigation"),this.prevBtn=document.createElement("button"),this.prevBtn.className="nav-btn",this.prevBtn.setAttribute("aria-label","Vorheriges Werk"),this.prevBtn.textContent="←",this.prevBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onPrevCallback)==null||t.call(this)}),this.nextBtn=document.createElement("button"),this.nextBtn.className="nav-btn",this.nextBtn.setAttribute("aria-label","Nächstes Werk"),this.nextBtn.textContent="→",this.nextBtn.addEventListener("click",()=>{var t;this.dismissHint(),(t=this.onNextCallback)==null||t.call(this)}),this.el.appendChild(this.prevBtn),this.el.appendChild(this.nextBtn),e.appendChild(this.el)}onHintStart(e){this.onHintStartCallback=e}onHintFinished(e){this.onHintFinishedCallback=e}setHiddenMode(e){this.el.classList.toggle("nav-controls--hidden",e)}enableIdleHint(){if(this.hintStarted||(this.hintStarted=!0,this.readHintSeen())||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;this.hintIdleTimer=window.setTimeout(()=>{var t;this.hintIdleTimer=null,this.hintDismissed||((t=this.onHintStartCallback)==null||t.call(this),document.documentElement.dataset.navHint="active",this.hintAnimationTimer=window.setTimeout(()=>{var n;this.hintAnimationTimer=null,this.hintDismissed||(delete document.documentElement.dataset.navHint,(n=this.onHintFinishedCallback)==null||n.call(this))},_n.HINT_ANIM_DURATION_MS))},_n.HINT_IDLE_DELAY_MS);const e=()=>this.dismissHint();this.prevBtn.addEventListener("pointerenter",e,{once:!0}),this.nextBtn.addEventListener("pointerenter",e,{once:!0}),this.prevBtn.addEventListener("focus",e,{once:!0}),this.nextBtn.addEventListener("focus",e,{once:!0}),this.hintKeydownListener=t=>{(t.key==="ArrowLeft"||t.key==="ArrowRight")&&this.dismissHint()},document.addEventListener("keydown",this.hintKeydownListener)}dismissHint(){var e;if(!this.hintDismissed){this.hintDismissed=!0,this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),delete document.documentElement.dataset.navHint,this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),(e=this.onHintFinishedCallback)==null||e.call(this);try{localStorage.setItem(_n.HINT_STORAGE_KEY,"1")}catch(t){}}}readHintSeen(){try{return localStorage.getItem(_n.HINT_STORAGE_KEY)==="1"}catch(e){return!1}}onPrev(e){this.onPrevCallback=e}onNext(e){this.onNextCallback=e}dispose(){this.hintIdleTimer!==null&&(clearTimeout(this.hintIdleTimer),this.hintIdleTimer=null),this.hintAnimationTimer!==null&&(clearTimeout(this.hintAnimationTimer),this.hintAnimationTimer=null),this.hintKeydownListener&&(document.removeEventListener("keydown",this.hintKeydownListener),this.hintKeydownListener=null),delete document.documentElement.dataset.navHint,this.el.remove()}};v(_n,"HINT_STORAGE_KEY","freyraum-nav-hint-seen"),v(_n,"HINT_IDLE_DELAY_MS",5e3),v(_n,"HINT_ANIM_DURATION_MS",3*1600+300);let ca=_n;class Am{constructor(e){v(this,"el");this.el=document.createElement("p"),this.el.className="hint-text",this.el.setAttribute("aria-hidden","true"),this.updateHint(),e.appendChild(this.el)}updateHint(){var t;const e=(t=document.documentElement.dataset.pointerPrimary)!=null?t:"fine";this.el.textContent=e==="coarse"?"Wischen zum Navigieren · Zwei Finger zum Zoomen.":"Scrollen zum Zoomen · Ziehen zum freien Bewegen."}dispose(){this.el.remove()}}const yl=.6;class Cm{constructor(e,t){v(this,"el");v(this,"galleryManager");this.galleryManager=t,this.el=document.createElement("div"),this.el.className="zoom-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Zoom-Steuerung");const n=this.createButton("zoom-controls__btn","Vergrößern","＋",()=>{this.galleryManager.addZoomDelta(-yl)}),r=this.createButton("zoom-controls__btn","Verkleinern","−",()=>{this.galleryManager.addZoomDelta(yl)}),s=this.createButton("zoom-controls__btn zoom-controls__btn--reset","Ansicht zurücksetzen","⟲",()=>{this.galleryManager.resetView()});this.el.append(n,r,s),e.appendChild(this.el)}createButton(e,t,n,r){const s=document.createElement("button");s.type="button",s.className=e,s.setAttribute("aria-label",t);const a=document.createElement("span");return a.className="zoom-controls__icon",a.setAttribute("aria-hidden","true"),a.textContent=n,s.appendChild(a),s.addEventListener("click",r),s}dispose(){this.el.remove()}}class Rm{constructor(e,t=document.documentElement){v(this,"btn");v(this,"target");v(this,"toggle",()=>{if(!document.fullscreenEnabled){this.btn.setAttribute("aria-disabled","true");return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.target.requestFullscreen().catch(()=>{})});v(this,"handleChange",()=>{const e=!!document.fullscreenElement;this.btn.setAttribute("aria-pressed",e?"true":"false"),document.documentElement.dataset.presentation=e?"on":"off"});this.target=t,this.btn=document.createElement("button"),this.btn.type="button",this.btn.className="fullscreen-btn",this.btn.setAttribute("aria-pressed","false"),this.btn.setAttribute("aria-label","Vollbild umschalten"),this.btn.innerHTML=`
      <span class="fullscreen-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path class="fullscreen-btn__enter" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path class="fullscreen-btn__exit" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        </svg>
      </span>
    `,this.btn.addEventListener("click",this.toggle),document.addEventListener("fullscreenchange",this.handleChange),e.appendChild(this.btn)}dispose(){this.btn.removeEventListener("click",this.toggle),document.removeEventListener("fullscreenchange",this.handleChange),this.btn.remove()}}const Bn=.3;function Zr(i){return Math.max(0,Math.min(100,i))/100*Bn}function Qr(i){const e=Math.max(0,Math.min(Bn,i));return e<=0?0:Math.round(e/Bn*100)}const Ti=Zr(50);class Pm{constructor(e,t){v(this,"root");v(this,"trigger");v(this,"panel");v(this,"isOpen",!1);v(this,"unsubscribe");v(this,"audioStatusMessage",null);v(this,"motionInput",null);v(this,"contrastInput",null);v(this,"chromeInput",null);v(this,"audioMutedInput",null);v(this,"audioVolumeInput",null);v(this,"audioValueLabel",null);v(this,"audioStatusEl",null);v(this,"isVolumeDragging",!1);v(this,"handleToggle",()=>{this.setOpen(!this.isOpen)});v(this,"handleOutsideClick",e=>{this.isOpen&&(this.root.contains(e.target)||(this.setOpen(!1),this.trigger.focus()))});v(this,"handleEscape",e=>{e.key==="Escape"&&this.isOpen&&(e.preventDefault(),e.stopPropagation(),this.setOpen(!1),this.trigger.focus())});this.prefs=t,this.root=document.createElement("div"),this.root.className="prefs",this.trigger=document.createElement("button"),this.trigger.type="button",this.trigger.className="prefs__trigger",this.trigger.setAttribute("aria-haspopup","true"),this.trigger.setAttribute("aria-expanded","false"),this.trigger.setAttribute("aria-controls","freyraum-prefs-panel"),this.trigger.setAttribute("aria-label","Einstellungen öffnen"),this.trigger.innerHTML=`
      <span class="prefs__trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
        </svg>
      </span>
    `,this.trigger.addEventListener("click",this.handleToggle),this.panel=document.createElement("div"),this.panel.id="freyraum-prefs-panel",this.panel.className="prefs__panel",this.panel.setAttribute("role","dialog"),this.panel.setAttribute("aria-labelledby","freyraum-prefs-heading"),this.panel.setAttribute("aria-modal","true"),this.panel.hidden=!0,this.buildPanel(),this.root.append(this.trigger,this.panel),e.appendChild(this.root),document.addEventListener("click",this.handleOutsideClick),document.addEventListener("keydown",this.handleEscape),this.unsubscribe=this.prefs.subscribe(()=>this.patchPanel())}buildPanel(){var c;const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:r,audioVolume:s,alwaysShowChrome:a}=this.prefs.current,o=Object.values(Ki).map(d=>`
          <label class="prefs__radio">
            <input type="radio" name="freyraum-quality" value="${d.id}" ${n===d.id?"checked":""} />
            <span class="prefs__radio-label">
              <span class="prefs__radio-title">${d.label}</span>
              <span class="prefs__radio-desc">${d.description}</span>
            </span>
          </label>
        `).join(""),l=Qr(s);this.panel.innerHTML=`
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
    `,this.motionInput=this.panel.querySelector("#freyraum-motion"),this.contrastInput=this.panel.querySelector("#freyraum-contrast"),this.chromeInput=this.panel.querySelector("#freyraum-chrome"),this.audioMutedInput=this.panel.querySelector("#freyraum-audio-muted"),this.audioVolumeInput=this.panel.querySelector("#freyraum-audio-volume"),this.audioValueLabel=this.panel.querySelector("#freyraum-audio-volume-label"),this.audioStatusEl=this.panel.querySelector("#freyraum-audio-status"),this.bindPanelEvents()}bindPanelEvents(){var e,t,n,r;if((e=this.motionInput)==null||e.addEventListener("change",s=>{this.prefs.setReducedMotion(s.target.checked)}),(t=this.contrastInput)==null||t.addEventListener("change",s=>{this.prefs.setContrastMode(s.target.checked?"high":"auto")}),(n=this.chromeInput)==null||n.addEventListener("change",s=>{this.prefs.setAlwaysShowChrome(s.target.checked)}),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(s=>{s.addEventListener("change",()=>{s.checked&&this.prefs.setQuality(s.value)})}),(r=this.audioMutedInput)==null||r.addEventListener("change",s=>{this.prefs.setAudioMuted(s.target.checked)}),this.audioVolumeInput){const s=this.audioVolumeInput;s.addEventListener("pointerdown",()=>{this.isVolumeDragging=!0}),s.addEventListener("pointerup",()=>{this.isVolumeDragging=!1}),s.addEventListener("pointercancel",()=>{this.isVolumeDragging=!1}),s.addEventListener("input",()=>{const a=Number(s.value);if(Number.isNaN(a))return;this.audioValueLabel&&(this.audioValueLabel.textContent=`${Math.round(a)}%`);const o=Math.round(a);s.style.setProperty("--volume-pct",`${o}%`),s.setAttribute("aria-valuetext",`${o} Prozent`),this.prefs.setAudioVolume(Zr(a))}),s.addEventListener("change",()=>{this.isVolumeDragging=!1;const a=Number(s.value);Number.isNaN(a)||this.prefs.setAudioVolume(Zr(a))})}}patchPanel(){const{reducedMotion:e,contrastMode:t,quality:n,audioMuted:r,audioVolume:s,alwaysShowChrome:a}=this.prefs.current;if(this.motionInput&&(this.motionInput.checked=e),this.contrastInput&&(this.contrastInput.checked=t==="high"),this.chromeInput&&(this.chromeInput.checked=a),this.audioMutedInput&&(this.audioMutedInput.checked=r),!this.isVolumeDragging&&this.audioVolumeInput&&this.audioValueLabel){const o=Qr(s);this.audioVolumeInput.value=String(o),this.audioVolumeInput.style.setProperty("--volume-pct",`${o}%`),this.audioVolumeInput.setAttribute("aria-valuetext",`${o} Prozent`),this.audioValueLabel.textContent=`${o}%`}this.audioStatusEl&&(this.audioStatusMessage?(this.audioStatusEl.textContent=this.audioStatusMessage,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden","")),this.panel.querySelectorAll('input[name="freyraum-quality"]').forEach(o=>{o.checked=o.value===n})}setAudioStatusMessage(e){this.audioStatusMessage=e,this.audioStatusEl&&(e?(this.audioStatusEl.textContent=e,this.audioStatusEl.removeAttribute("hidden")):this.audioStatusEl.setAttribute("hidden",""))}setOpen(e){var t;this.isOpen=e,this.trigger.setAttribute("aria-expanded",e?"true":"false"),this.panel.hidden=!e,e&&((t=this.panel.querySelector("input"))==null||t.focus())}dispose(){document.removeEventListener("click",this.handleOutsideClick),document.removeEventListener("keydown",this.handleEscape),this.unsubscribe(),this.root.remove()}}const Im={INFO_PANEL_TRIGGER_BAND_PX:120,NAV_TRIGGER_BAND_PX:220,HIDE_DELAY_MS:2500,NAV_HIDE_DELAY_MS:2e3,TOUCH_REVEAL_DURATION_MS:4e3,FORCE_REVEAL_DURATION_MS:3200,IOS_EDGE_DEAD_ZONE_PX:22,INFO_PANEL_TOUCH_MAX_PX:80};class Lm{constructor(e,t,n,r={}){v(this,"diag",$t("chrome-visibility"));v(this,"config");v(this,"options");v(this,"infoPanelEl");v(this,"prefs");v(this,"appRoot");v(this,"infoPanelPeekHit",null);v(this,"srStatusEl",null);v(this,"panels",new Map);v(this,"boundOnPointerMove");v(this,"boundOnPointerDown");v(this,"boundOnKeyDown");v(this,"boundOnViewportLeave");v(this,"unsubscribePrefs",null);v(this,"initialised",!1);v(this,"settleTimer",null);this.infoPanelEl=e,this.prefs=t,this.appRoot=n,this.options=r,this.config={...Im,...r.config},this.boundOnPointerMove=this.onPointerMove.bind(this),this.boundOnPointerDown=this.onPointerDown.bind(this),this.boundOnKeyDown=this.onKeyDown.bind(this),this.boundOnViewportLeave=this.onViewportLeave.bind(this)}init(){if(!this.initialised){this.initialised=!0,this.panels.set("info-panel",this.createPanelState("info-panel",this.infoPanelEl,"Werkinformationen")),this.applyMode(this.currentMode()),this.createPeekElements(),this.createSrStatusElement(),window.addEventListener("pointermove",this.boundOnPointerMove,{passive:!0}),window.addEventListener("pointerdown",this.boundOnPointerDown,{passive:!0}),document.addEventListener("keydown",this.boundOnKeyDown,{passive:!0}),document.addEventListener("mouseleave",this.boundOnViewportLeave,{passive:!0}),window.addEventListener("blur",this.boundOnViewportLeave,{passive:!0});for(const e of this.panels.values())e.el.addEventListener("focusin",e.onFocusIn),e.el.addEventListener("focusout",e.onFocusOut),e.el.addEventListener("pointerenter",e.onPointerEnter),e.el.addEventListener("pointerleave",e.onPointerLeave);this.unsubscribePrefs=this.prefs.subscribe(()=>this.applyMode(this.currentMode())),this.diag.info("init","ChromeVisibilityManager initialised",{mode:this.currentMode()})}}dispose(){var e,t,n;if(this.initialised){this.initialised=!1,window.removeEventListener("pointermove",this.boundOnPointerMove),window.removeEventListener("pointerdown",this.boundOnPointerDown),document.removeEventListener("keydown",this.boundOnKeyDown),document.removeEventListener("mouseleave",this.boundOnViewportLeave),window.removeEventListener("blur",this.boundOnViewportLeave),(e=this.unsubscribePrefs)==null||e.call(this),this.unsubscribePrefs=null;for(const r of this.panels.values())r.hideTimerId!==null&&clearTimeout(r.hideTimerId),r.el.removeEventListener("focusin",r.onFocusIn),r.el.removeEventListener("focusout",r.onFocusOut),r.el.removeEventListener("pointerenter",r.onPointerEnter),r.el.removeEventListener("pointerleave",r.onPointerLeave);this.panels.clear(),(t=this.infoPanelPeekHit)==null||t.remove(),(n=this.srStatusEl)==null||n.remove(),this.infoPanelPeekHit=null,this.srStatusEl=null,this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null),this.diag.info("dispose","ChromeVisibilityManager disposed")}}forceReveal(e){!this.initialised||this.currentMode()==="visible"||!this.panels.get(e)||(this.reveal(e,"forced"),this.scheduleHide(e,this.config.FORCE_REVEAL_DURATION_MS),this.diag.debug("force-reveal","Panel force-revealed",{panelId:e}))}registerNavControls(e,t){if(!this.initialised){this.diag.warn("register-nav","registerNavControls called before init() — ignored");return}if(this.panels.has("nav-controls")){this.diag.warn("register-nav","Nav controls already registered — ignored");return}const n=this.createPanelState("nav-controls",e,"Navigation");this.panels.set("nav-controls",n),e.addEventListener("focusin",n.onFocusIn),e.addEventListener("focusout",n.onFocusOut),e.addEventListener("pointerenter",n.onPointerEnter),e.addEventListener("pointerleave",n.onPointerLeave),this.currentMode()==="visible"&&this.reveal("nav-controls","preference"),t.onHintStart(()=>{this.reveal("nav-controls","hint"),this.diag.debug("nav-hint-start","Nav controls revealed for onboarding hint")}),t.onHintFinished(()=>{const r=this.panels.get("nav-controls");r&&(this.currentMode()==="clean"&&this.shouldHide(r)&&(this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-hint-dismiss","Nav hint finished; scheduled re-hide",{delay:this.config.NAV_HIDE_DELAY_MS})),this.triggerAffordanceSettle())}),this.diag.info("register-nav","Nav controls registered as managed chrome surface",{mode:this.currentMode()})}triggerAffordanceSettle(){window.matchMedia("(prefers-reduced-motion: reduce)").matches||(this.settleTimer!==null&&(clearTimeout(this.settleTimer),this.appRoot.classList.remove("affordance-settling")),this.appRoot.classList.add("affordance-settling"),this.diag.debug("affordance-settle-start","Affordance settle phase started"),this.settleTimer=window.setTimeout(()=>{this.appRoot.classList.remove("affordance-settling"),this.settleTimer=null,this.diag.debug("affordance-settle-end","Affordance settle phase complete")},2100))}currentMode(){return this.prefs.current.alwaysShowChrome?"visible":"clean"}createPanelState(e,t,n){return{id:e,el:t,label:n,revealed:!1,reason:null,hideTimerId:null,focusActive:!1,pointerInZone:!1,pointerInPanel:!1,onFocusIn:()=>this.onPanelFocusIn(e),onFocusOut:()=>this.onPanelFocusOut(e),onPointerEnter:()=>this.onPanelPointerEnter(e),onPointerLeave:()=>this.onPanelPointerLeave(e)}}applyMode(e){if(document.documentElement.dataset.chromeMode=e,e==="visible")for(const t of this.panels.keys())this.reveal(t,"preference");else for(const t of this.panels.values())this.shouldHide(t)&&this.hide(t.id)}reveal(e,t){var r,s;const n=this.panels.get(e);n&&(n.hideTimerId!==null&&(clearTimeout(n.hideTimerId),n.hideTimerId=null),!(n.revealed&&n.reason===t)&&(n.el.classList.add("is-revealed"),n.revealed=!0,n.reason=t,this.announceToScreenReader(n,!0),(s=(r=this.options).onRevealChange)==null||s.call(r,e,!0,t),this.diag.debug("reveal","Panel revealed",{panelId:e,reason:t})))}hide(e){var n,r;const t=this.panels.get(e);t&&(t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),t.revealed&&(t.el.classList.remove("is-revealed"),t.revealed=!1,t.reason=null,this.announceToScreenReader(t,!1),(r=(n=this.options).onRevealChange)==null||r.call(n,e,!1,null),this.diag.debug("hide","Panel hidden",{panelId:e})))}scheduleHide(e,t=this.config.HIDE_DELAY_MS){const n=this.panels.get(e);n&&(n.hideTimerId!==null&&clearTimeout(n.hideTimerId),n.hideTimerId=setTimeout(()=>this.hide(e),t))}shouldHide(e){return!e.pointerInZone&&!e.pointerInPanel&&!e.focusActive}onPointerMove(e){if(this.currentMode()==="visible"||e.pointerType==="touch")return;const t=e.clientX,n=e.clientY,r=window.innerHeight;this.updateZone("info-panel",t<=this.config.INFO_PANEL_TRIGGER_BAND_PX),this.panels.has("nav-controls")&&this.updateZone("nav-controls",n>=r-this.config.NAV_TRIGGER_BAND_PX,this.config.NAV_HIDE_DELAY_MS)}onPointerDown(e){if(e.pointerType==="mouse"||this.currentMode()==="visible")return;const t=e.clientX;t>=this.config.IOS_EDGE_DEAD_ZONE_PX&&t<=this.config.INFO_PANEL_TOUCH_MAX_PX&&(this.reveal("info-panel","touch"),this.scheduleHide("info-panel",this.config.TOUCH_REVEAL_DURATION_MS))}onViewportLeave(){if(this.currentMode()!=="visible")for(const e of this.panels.keys())this.updateZone(e,!1)}onKeyDown(e){if(this.currentMode()==="visible"||((e.key==="ArrowLeft"||e.key==="ArrowRight")&&this.panels.has("nav-controls")&&(this.reveal("nav-controls","keyboard"),this.scheduleHide("nav-controls",this.config.NAV_HIDE_DELAY_MS),this.diag.debug("nav-keyboard-reveal","Nav controls revealed by keyboard",{key:e.key})),e.key!=="Escape"))return;let t=!1;for(const n of this.panels.values())n.revealed&&!n.el.contains(document.activeElement)&&(this.hide(n.id),t=!0);t&&this.diag.debug("escape-dismiss","Chrome dismissed via Escape")}onPanelFocusIn(e){const t=this.panels.get(e);t&&(t.focusActive=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null),this.currentMode()==="clean"&&this.reveal(e,"focus"))}onPanelFocusOut(e){requestAnimationFrame(()=>{const t=this.panels.get(e);t&&(t.el.contains(document.activeElement)||(t.focusActive=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e)))})}onPanelPointerEnter(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!0,t.hideTimerId!==null&&(clearTimeout(t.hideTimerId),t.hideTimerId=null))}onPanelPointerLeave(e){const t=this.panels.get(e);t&&(t.pointerInPanel=!1,this.currentMode()==="clean"&&this.shouldHide(t)&&this.scheduleHide(e))}updateZone(e,t,n){const r=this.panels.get(e);r&&t!==r.pointerInZone&&(r.pointerInZone=t,t?this.reveal(e,"proximity"):this.shouldHide(r)&&this.scheduleHide(e,n))}createPeekElements(){const e=this.makeEl("div","info-panel-chevron");this.infoPanelPeekHit=this.makeEl("div","info-panel-peek-hit",[this.makeEl("div","info-panel-peek"),e]),this.infoPanelPeekHit.setAttribute("aria-hidden","true"),this.appRoot.appendChild(this.infoPanelPeekHit),this.diag.debug("peek-affordances-created","Visual chrome affordances mounted",{infoPanel:["info-panel-peek","info-panel-chevron"]})}createSrStatusElement(){this.srStatusEl=this.makeEl("div","sr-only"),this.srStatusEl.id="freyraum-chrome-status",this.srStatusEl.setAttribute("aria-live","polite"),this.srStatusEl.setAttribute("aria-atomic","true"),this.appRoot.appendChild(this.srStatusEl)}announceToScreenReader(e,t){this.srStatusEl&&(this.srStatusEl.textContent=t?`${e.label} eingeblendet`:"")}makeEl(e,t,n=[]){const r=document.createElement(e);r.className=t;for(const s of n)r.appendChild(s);return r}}const Jr=$t("audio-controls");class Dm{constructor(e,t,n){v(this,"el");v(this,"muteBtn");v(this,"volumeInput");v(this,"unsubscribe");v(this,"currentState");v(this,"handleMuteClick",()=>{const{muted:e,playing:t,autoplayBlocked:n,available:r}=this.currentState;r&&(e?(this.prefs.setAudioMuted(!1),Jr.info("user-unmute","User unmuted audio via main-page control")):t?(this.prefs.setAudioMuted(!0),Jr.info("user-mute","User muted audio via main-page control")):(this.audioManager.play("user-activate"),Jr.info("user-activate","User activated audio via main-page control",{autoplayBlocked:n})))});v(this,"handleVolumeInput",()=>{const e=Number(this.volumeInput.value);if(Number.isNaN(e))return;const t=Math.round(e);this.volumeInput.style.setProperty("--volume-pct",`${t}%`),this.volumeInput.setAttribute("aria-valuenow",String(t)),this.volumeInput.setAttribute("aria-valuetext",`${t} Prozent`);const n=Zr(e);this.prefs.setAudioVolume(n),Jr.debug("user-volume","User adjusted volume via main-page slider",{displayPct:e,gain:n})});this.prefs=t,this.audioManager=n,this.currentState=n.getState(),this.el=document.createElement("div"),this.el.className="audio-controls",this.el.setAttribute("role","group"),this.el.setAttribute("aria-label","Hintergrundmusik"),this.muteBtn=document.createElement("button"),this.muteBtn.type="button",this.muteBtn.className="audio-controls__btn",this.muteBtn.addEventListener("click",this.handleMuteClick);const r=document.createElement("div");r.className="audio-controls__slider-wrap",this.volumeInput=document.createElement("input"),this.volumeInput.type="range",this.volumeInput.className="audio-controls__slider",this.volumeInput.min="0",this.volumeInput.max="100",this.volumeInput.step="1",this.volumeInput.setAttribute("aria-label","Lautstärke"),this.volumeInput.addEventListener("input",this.handleVolumeInput),r.appendChild(this.volumeInput),this.el.append(this.muteBtn,r),e.appendChild(this.el),this.unsubscribe=n.subscribe(s=>this.update(s))}update(e){if(this.currentState=e,this.el.hidden=!e.available,!e.available)return;const t=e.muted,n=e.autoplayBlocked,r=e.playing;this.muteBtn.classList.toggle("audio-controls__btn--muted",t),this.muteBtn.classList.toggle("audio-controls__btn--blocked",n&&!t),this.muteBtn.classList.toggle("audio-controls__btn--playing",r&&!t);let s;n&&!t?s="Klicken zum Aktivieren der Hintergrundmusik":t?s="Ton einschalten":r?s="Ton ausschalten":s="Hintergrundmusik abspielen",this.muteBtn.setAttribute("aria-label",s),this.muteBtn.setAttribute("aria-pressed",r&&!t?"true":"false"),this.muteBtn.innerHTML=`
      <span class="audio-controls__btn-icon" aria-hidden="true">
        ${t?Fm:n?Um:Nm}
      </span>
      ${n&&!t?'<span class="audio-controls__indicator" aria-hidden="true"></span>':""}
    `;const a=Qr(e.targetVolume);this.volumeInput.value=String(a),this.volumeInput.disabled=t,this.volumeInput.setAttribute("aria-valuenow",String(a)),this.volumeInput.setAttribute("aria-valuetext",`${a} Prozent`),this.volumeInput.style.setProperty("--volume-pct",`${a}%`)}dispose(){this.unsubscribe(),this.el.remove()}}const Nm=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`,Fm=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`,Um=`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="15" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/>
  </svg>`;function km(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function da(i,e,t){var u,h,m;const n=bi(),r=document.createElement("section");r.className="fallback-screen",r.setAttribute("role","alert"),r.setAttribute("aria-live","assertive"),t&&t.trim()&&(r.style.backgroundColor=t.trim());const a=((m=(h=(u=window.matchMedia)==null?void 0:u.call(window,"(pointer: coarse)"))==null?void 0:h.matches)!=null?m:!1)?`<p class="fallback-screen__body">
        Tipp: Deaktivieren Sie den privaten Browser-Modus und stellen Sie
        sicher, dass Hardware-Beschleunigung aktiviert ist.
       </p>`:"",l=n.getMode()!=="default"?`<p class="fallback-screen__detail">Technischer Hinweis: ${km(e)}</p>`:"";r.innerHTML=`
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
  `,i.appendChild(r);const c=getComputedStyle(document.documentElement),d=getComputedStyle(r);n.info("fallback","surface-snapshot","Fallback surface colors resolved",{requestedSurfaceColor:t!=null?t:null,rootGalleryWall:c.getPropertyValue("--color-gallery-wall").trim(),rootMuseumWall:c.getPropertyValue("--color-museum-wall").trim(),fallbackBackgroundColor:d.backgroundColor,fallbackBackgroundImage:d.backgroundImage})}const bl=20,tr=5;class Bm{constructor(e,t){v(this,"diagnostics",bi());v(this,"el");v(this,"listEl");v(this,"counterEl");v(this,"prevButton");v(this,"nextButton");v(this,"artworks");v(this,"items",[]);v(this,"thumbs",[]);v(this,"virtualized");v(this,"currentIndex",0);v(this,"renderedStart",-1);v(this,"renderedEnd",-1);v(this,"onSelectCallback",null);v(this,"onPreviewCallback",null);v(this,"handleThumbKey",e=>{var r;const t=e.currentTarget,n=Number((r=t.dataset.index)!=null?r:"0");switch(e.key){case"ArrowRight":case"ArrowDown":e.preventDefault(),this.focusThumb((n+1)%this.artworks.length);break;case"ArrowLeft":case"ArrowUp":e.preventDefault(),this.focusThumb((n-1+this.artworks.length)%this.artworks.length);break;case"Home":e.preventDefault(),this.focusThumb(0);break;case"End":e.preventDefault(),this.focusThumb(this.artworks.length-1);break;case"Enter":case" ":{e.key===" "&&e.preventDefault();break}}});v(this,"onPrevPage",()=>{this.listEl.scrollBy({left:-this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});v(this,"onNextPage",()=>{this.listEl.scrollBy({left:this.listEl.clientWidth*.8,behavior:this.preferredScrollBehavior()})});v(this,"onScroll",()=>{this.renderWindowFromScroll(),this.updateScrollState()});v(this,"onResize",()=>{this.virtualized&&this.renderWindowAround(this.currentIndex),this.updateScrollState()});this.artworks=t,this.virtualized=t.length>bl,this.el=document.createElement("nav"),this.el.className="timeline",this.el.setAttribute("aria-label","Werke der Ausstellung"),this.prevButton=this.createArrowButton("prev","Vorherige Werke anzeigen","‹"),this.nextButton=this.createArrowButton("next","Weitere Werke anzeigen","›"),this.counterEl=document.createElement("div"),this.counterEl.className="timeline__counter",this.counterEl.setAttribute("aria-live","polite");const n=document.createElement("ul");n.className="timeline__list",n.setAttribute("role","list"),this.listEl=n,this.el.append(this.prevButton,n,this.nextButton,this.counterEl),t.forEach((r,s)=>{const a=document.createElement("li");a.className="timeline__item",a.dataset.index=String(s),this.items.push(a),this.thumbs.push(null),n.appendChild(a)}),this.virtualized?(this.renderWindowAround(0),this.diagnostics.info("timeline","virtualization-enabled","Timeline virtual rendering enabled",{artworkCount:t.length,threshold:bl,buffer:tr})):t.forEach((r,s)=>this.ensureThumb(s)),this.prevButton.addEventListener("click",this.onPrevPage),this.nextButton.addEventListener("click",this.onNextPage),this.listEl.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("resize",this.onResize,{passive:!0}),e.appendChild(this.el),this.setActive(0),this.updateScrollState(),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>this.centerThumb(0,"auto")))}createArrowButton(e,t,n){const r=document.createElement("button");return r.type="button",r.className=`timeline__arrow timeline__arrow--${e}`,r.setAttribute("aria-label",t),r.textContent=n,r}ensureThumb(e){if(e<0||e>=this.artworks.length)return null;const t=this.thumbs[e];if(t)return t;const n=this.artworks[e],r=this.items[e],s=document.createElement("button");s.type="button",s.className="timeline__thumb",s.setAttribute("aria-label",`${n.subtitle}: ${n.title}`),s.setAttribute("aria-pressed",e===this.currentIndex?"true":"false"),s.setAttribute("aria-current",e===this.currentIndex?"true":"false"),s.setAttribute("data-index",String(e)),s.tabIndex=e===this.currentIndex?0:-1;const a=n.dimensions.width/n.dimensions.height,o=document.createElement("span");o.className="timeline__frame",o.style.setProperty("--thumb-aspect",String(a.toFixed(4)));const l=document.createElement("span");l.className="timeline__skeleton",l.setAttribute("aria-hidden","true"),o.appendChild(l);const c=document.createElement("img");c.className="timeline__img",c.src=n.image,c.alt="",c.loading="lazy",c.decoding="async",c.addEventListener("load",()=>o.classList.add("is-loaded")),c.addEventListener("error",()=>o.classList.add("is-loaded","is-error")),o.appendChild(c);const d=document.createElement("span");return d.className="timeline__thumb-label",d.textContent=n.subtitle,s.append(o,d),s.addEventListener("click",()=>this.select(e)),s.addEventListener("pointerenter",()=>this.preview(e)),s.addEventListener("focus",()=>this.preview(e)),s.addEventListener("keydown",this.handleThumbKey),this.thumbs[e]=s,r.replaceChildren(s),s}unmountThumb(e){var n;if(e===this.currentIndex)return;const t=this.thumbs[e];!t||t.matches(":focus-within")||(t.removeEventListener("keydown",this.handleThumbKey),this.thumbs[e]=null,(n=this.items[e])==null||n.replaceChildren())}focusThumb(e){this.virtualized&&this.renderWindowAround(e);const t=this.ensureThumb(e);t&&(this.thumbs.forEach((n,r)=>{n&&(n.tabIndex=r===e?0:-1)}),t.focus(),this.centerThumb(e,this.preferredScrollBehavior()))}select(e){var t;(t=this.onSelectCallback)==null||t.call(this,e)}preview(e){var t;(t=this.onPreviewCallback)==null||t.call(this,e)}setActive(e){const t=this.thumbs[this.currentIndex];t&&(t.classList.remove("is-active"),t.setAttribute("aria-pressed","false"),t.setAttribute("aria-current","false")),this.currentIndex=e,this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(this.currentIndex);n&&(n.classList.add("is-active"),n.setAttribute("aria-pressed","true"),n.setAttribute("aria-current","true"),this.thumbs.forEach((r,s)=>{r&&(r.tabIndex=s===e?0:-1)}),this.centerThumb(e,this.preferredScrollBehavior())),this.updateCounter(),this.updateScrollState()}renderWindowAround(e){const t=Math.max(4,Math.ceil(this.listEl.clientWidth/this.approxThumbPitch())||4),n=Math.max(0,e-tr),r=Math.min(this.artworks.length-1,e+t+tr);this.renderWindow(n,r)}renderWindowFromScroll(){if(!this.virtualized)return;const e=this.approxThumbPitch(),t=Math.max(4,Math.ceil(this.listEl.clientWidth/e)||4),n=Math.max(0,Math.floor(this.listEl.scrollLeft/e)-tr),r=Math.min(this.artworks.length-1,n+t+tr*2);this.renderWindow(n,r)}renderWindow(e,t){if(!(e===this.renderedStart&&t===this.renderedEnd)){for(let n=e;n<=t;n+=1)this.ensureThumb(n);for(let n=0;n<this.thumbs.length;n+=1)(n<e||n>t)&&this.unmountThumb(n);this.renderedStart=e,this.renderedEnd=t}}approxThumbPitch(){const e=this.thumbs.find(Boolean);return e?e.getBoundingClientRect().width+12:162}centerThumb(e,t){this.virtualized&&this.renderWindowAround(e);const n=this.ensureThumb(e);if(!n)return;const r=this.listEl.getBoundingClientRect(),s=n.getBoundingClientRect();if(r.width<=0||s.width<=0)return;const a=s.left+s.width*.5-(r.left+r.width*.5);if(Math.abs(a)<1)return;const o=this.listEl.scrollLeft+a;this.listEl.scrollTo({left:o,behavior:t}),this.diagnostics.getMode()!=="default"&&this.diagnostics.debug("timeline","center-active","Centered active timeline thumbnail",{index:e,delta:Math.round(a),targetLeft:Math.round(o),behavior:t})}updateCounter(){this.counterEl.textContent=`${this.currentIndex+1} / ${this.artworks.length}`}updateScrollState(){this.updateCounter();const e=Math.max(0,this.listEl.scrollWidth-this.listEl.clientWidth-1),t=this.listEl.scrollLeft<=1,n=this.listEl.scrollLeft>=e;this.prevButton.disabled=t,this.nextButton.disabled=n,this.el.classList.toggle("timeline--at-start",t),this.el.classList.toggle("timeline--at-end",n)}preferredScrollBehavior(){if(document.documentElement.dataset.motion==="reduced")return"auto";try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}catch(e){return"smooth"}}async prewarmUnderOverlay(){const e=[];for(let s=0;s<this.artworks.length;s+=1){const a=this.ensureThumb(s);if(!a)continue;const o=a.querySelector(".timeline__img");o&&(o.loading="eager",a.offsetWidth,a.getBoundingClientRect(),typeof o.decode=="function"&&e.push(o.decode().then(()=>"decoded").catch(()=>"failed")))}this.el.offsetHeight,this.listEl.scrollWidth,getComputedStyle(this.el).opacity;const t=await Promise.allSettled(e);let n=0,r=0;return t.forEach(s=>{s.status==="fulfilled"&&s.value==="decoded"?n+=1:r+=1}),this.updateScrollState(),this.diagnostics.info("timeline","prewarm-under-overlay","Timeline DOM and thumbnail images prebuilt under loading overlay",{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:r,virtualized:this.virtualized}),{thumbsReady:this.thumbs.filter(Boolean).length,imagesDecoded:n,imagesFailed:r}}onSelect(e){this.onSelectCallback=e}onPreview(e){this.onPreviewCallback=e}dispose(){this.prevButton.removeEventListener("click",this.onPrevPage),this.nextButton.removeEventListener("click",this.onNextPage),this.listEl.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onResize),this.thumbs.forEach(e=>e==null?void 0:e.removeEventListener("keydown",this.handleThumbKey)),this.thumbs.length=0,this.items.length=0,this.el.remove()}}const Ml=.6;function Om(i){if(!(i instanceof HTMLElement))return!1;const e=i.tagName;return!!(e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||i.isContentEditable)}class Hm{constructor(e,t){v(this,"galleryManager");v(this,"keyboardHelp");v(this,"fullscreenTarget",document.documentElement);v(this,"enabled",!0);v(this,"onEscape");v(this,"handleKeyDown",e=>{var t,n;if(!(!this.enabled||e.defaultPrevented)&&!Om(e.target)&&!(e.target instanceof HTMLElement&&e.target.closest(".timeline")&&(e.key==="ArrowLeft"||e.key==="ArrowRight")))switch(e.key){case"ArrowLeft":e.preventDefault(),this.galleryManager.navigate(-1);break;case"ArrowRight":e.preventDefault(),this.galleryManager.navigate(1);break;case"+":case"=":e.preventDefault(),this.galleryManager.addZoomDelta(-Ml);break;case"-":case"_":e.preventDefault(),this.galleryManager.addZoomDelta(Ml);break;case"0":case"r":case"R":e.preventDefault(),this.galleryManager.resetView();break;case"f":case"F":e.preventDefault(),this.toggleFullscreen();break;case"?":e.preventDefault(),(t=this.keyboardHelp)==null||t.open();break;case"Escape":if(document.fullscreenElement)break;(n=this.onEscape)==null||n.call(this);break}});this.galleryManager=e,this.keyboardHelp=t,window.addEventListener("keydown",this.handleKeyDown)}setFullscreenTarget(e){this.fullscreenTarget=e}setEnabled(e){this.enabled=e}toggleFullscreen(){document.fullscreenEnabled&&(document.fullscreenElement?document.exitFullscreen().catch(()=>{}):this.fullscreenTarget.requestFullscreen().catch(()=>{}))}dispose(){window.removeEventListener("keydown",this.handleKeyDown)}}const es=$t("KeyboardHelp"),zm=[["←  →","Nächstes / vorheriges Bild"],["+  −","Heran-/Herauszoomen"],["R","Ansicht zurücksetzen"],["F","Vollbild ein-/ausschalten"],["Esc","Dialog schließen"],["?","Diese Hilfe anzeigen"]];class Gm{constructor(){v(this,"dialog");v(this,"opener",null);v(this,"onKeyDown",e=>{if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.close();return}e.key==="Tab"&&this.trapFocus(e)});this.dialog=this.build(),document.body.appendChild(this.dialog),es.debug("init","KeyboardHelp component created")}build(){const e=document.createElement("div");return e.id="keyboard-help",e.className="keyboard-help",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","keyboard-help-title"),e.hidden=!0,e.innerHTML=`
      <div class="keyboard-help__panel">
        <h2 id="keyboard-help-title" class="keyboard-help__title">Tastaturkürzel</h2>
        <table class="keyboard-help__table">
          <tbody>
            ${zm.map(([t,n])=>`<tr><td><kbd class="keyboard-help__key">${t}</kbd></td><td>${n}</td></tr>`).join("")}
          </tbody>
        </table>
        <p class="keyboard-help__hint">Mausbewegung zum unteren oder linken Bildschirmrand enthüllt Zeitleiste, Navigation und Bildinformationen.</p>
        <button class="keyboard-help__close nav-btn" aria-label="Hilfe schließen">✕</button>
      </div>`,e.querySelector(".keyboard-help__close").addEventListener("click",()=>this.close()),e.addEventListener("click",t=>{t.target===e&&this.close()}),e}open(e){var t;this.opener=e!=null?e:null,this.dialog.hidden=!1,document.addEventListener("keydown",this.onKeyDown),(t=this.dialog.querySelector(".keyboard-help__close"))==null||t.focus(),es.debug("open","keyboard help opened")}close(){var e;this.dialog.hidden=!0,document.removeEventListener("keydown",this.onKeyDown),(e=this.opener)==null||e.focus(),this.opener=null,es.debug("close","keyboard help closed")}trapFocus(e){const t=Array.from(this.dialog.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'));if(!t.length)return;const n=t[0],r=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),n.focus())}dispose(){document.removeEventListener("keydown",this.onKeyDown),this.dialog.remove(),es.debug("dispose","KeyboardHelp component disposed")}}const Vm=50;class Wm{constructor(e,t){v(this,"canvas");v(this,"galleryManager");v(this,"diagnostics",$t("interaction"));v(this,"usePointerEvents");v(this,"disposed",!1);v(this,"enabled",!0);v(this,"state","idle");v(this,"active",new Map);v(this,"lastPinchDist",0);v(this,"onPointerDown",e=>{if(this.enabled&&!(e.pointerType==="mouse"&&e.button!==0)){try{this.canvas.setPointerCapture(e.pointerId)}catch(t){}if(this.active.set(e.pointerId,{id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY}),this.active.size===1)this.state=this.galleryManager.canPan()?"panning":"swipe-candidate",this.diagnostics.debug("gesture-start","Pointer gesture started",{pointerType:e.pointerType,state:this.state});else if(this.active.size===2){const t=[...this.active.values()];this.lastPinchDist=Sl(t[0].lastX,t[0].lastY,t[1].lastX,t[1].lastY),this.state="pinching",this.diagnostics.debug("gesture-start","Pinch gesture started",{})}}});v(this,"onPointerMove",e=>{this.handlePointerMove(e)});v(this,"onGlobalPointerMove",e=>{e.target!==this.canvas&&this.handlePointerMove(e)});v(this,"onPointerUp",e=>{if(!this.enabled)return;const t=this.active.get(e.pointerId);this.active.delete(e.pointerId);try{this.canvas.releasePointerCapture(e.pointerId)}catch(n){}if(this.state==="pinching"&&this.active.size<2){this.state=this.galleryManager.canPan()?"panning":"swipe-candidate";return}this.state==="swipe-candidate"&&t&&this.active.size===0&&this.resolveSwipe(t,e.clientX,e.clientY),this.active.size===0&&(this.state="idle")});v(this,"onGlobalPointerUp",e=>{e.target!==this.canvas&&this.onPointerUp(e)});v(this,"onPointerCancel",e=>{this.enabled&&(this.active.delete(e.pointerId),this.active.size===0&&(this.state="idle",this.diagnostics.debug("gesture-cancel","Pointer gesture cancelled",{})))});v(this,"onGlobalPointerCancel",e=>{e.target!==this.canvas&&this.onPointerCancel(e)});v(this,"onTouchStart",e=>{if(this.enabled)if(e.cancelable&&e.preventDefault(),e.touches.length===1){const t=e.touches[0];this.active.clear(),this.active.set(0,{id:0,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY}),this.state=this.galleryManager.canPan()?"panning":"swipe-candidate"}else e.touches.length===2&&(this.state="pinching",this.lastPinchDist=this.getTouchDist(e))});v(this,"onTouchMove",e=>{if(!this.enabled)return;if(e.touches.length>=2){e.cancelable&&e.preventDefault();const a=this.getTouchDist(e),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02),this.state="pinching";return}if(e.touches.length!==1)return;const t=this.active.get(0);if(!t)return;const n=e.touches[0],r=n.clientX-t.lastX,s=n.clientY-t.lastY;t.lastX=n.clientX,t.lastY=n.clientY,this.galleryManager.canPan()&&(e.cancelable&&e.preventDefault(),this.galleryManager.setPanOffset(r*.004,-s*.004),this.state="panning")});v(this,"onGlobalTouchMove",e=>{e.target===this.canvas||this.state==="idle"||this.onTouchMove(e)});v(this,"onTouchEnd",e=>{if(this.enabled){if(this.state==="swipe-candidate"&&e.changedTouches.length>0){const t=this.active.get(0);t&&this.resolveSwipe(t,e.changedTouches[0].clientX,e.changedTouches[0].clientY)}e.touches.length===0&&(this.active.clear(),this.state="idle")}});v(this,"onWheel",e=>{this.enabled&&this.galleryManager.addZoomDelta(e.deltaY*.0045)});v(this,"onLegacyMouseMove",e=>{this.enabled&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY)});this.canvas=e,this.galleryManager=t,this.usePointerEvents=typeof window.PointerEvent=="function",this.usePointerEvents?(this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointercancel",this.onPointerCancel),this.canvas.addEventListener("lostpointercapture",this.onPointerCancel),window.addEventListener("pointermove",this.onGlobalPointerMove,{passive:!0}),window.addEventListener("pointerup",this.onGlobalPointerUp,{passive:!0}),window.addEventListener("pointercancel",this.onGlobalPointerCancel,{passive:!0})):(this.canvas.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.canvas.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.onTouchEnd,{passive:!0}),this.canvas.addEventListener("touchcancel",this.onTouchEnd,{passive:!0}),window.addEventListener("mousemove",this.onLegacyMouseMove,{passive:!0}),window.addEventListener("touchmove",this.onGlobalTouchMove,{passive:!1})),this.canvas.addEventListener("wheel",this.onWheel,{passive:!0}),this.diagnostics.info("init","Canvas interaction initialised",{backend:this.usePointerEvents?"pointer-events":"touch-events-fallback"})}handlePointerMove(e){if(!this.enabled)return;const t=this.active.get(e.pointerId);if(!t){e.pointerType==="mouse"&&this.state==="idle"&&this.updateHoverRotation(e.clientX,e.clientY);return}const n=e.clientX-t.lastX,r=e.clientY-t.lastY;if(t.lastX=e.clientX,t.lastY=e.clientY,this.state==="pinching"&&this.active.size===2){const s=[...this.active.values()],a=Sl(s[0].lastX,s[0].lastY,s[1].lastX,s[1].lastY),o=this.lastPinchDist-a;this.lastPinchDist=a,this.galleryManager.addZoomDelta(o*.02);return}this.active.size===1&&this.galleryManager.canPan()&&(this.state="panning",this.galleryManager.setPanOffset(n*.004,-r*.004))}getTouchDist(e){const t=e.touches[0].clientX-e.touches[1].clientX,n=e.touches[0].clientY-e.touches[1].clientY;return Math.sqrt(t*t+n*n)}updateHoverRotation(e,t){if(document.documentElement.dataset.pointerPrimary==="coarse")return;const n=e/window.innerWidth*2-1,r=t/window.innerHeight*2-1,s=this.galleryManager.getHoverRotationScale();this.galleryManager.setHoverTarget(n*s.x,r*s.y)}resolveSwipe(e,t,n){const r=t-e.startX,s=n-e.startY;Math.abs(r)>Math.abs(s)&&Math.abs(r)>Vm&&(this.galleryManager.navigate(r<0?1:-1),this.diagnostics.debug("swipe","Swipe resolved",{direction:r<0?"next":"prev"}))}setEnabled(e){this.enabled!==e&&(this.enabled=e,e||(this.active.clear(),this.state="idle",this.galleryManager.setHoverTarget(0,0)))}dispose(){this.disposed||(this.disposed=!0,this.usePointerEvents?(this.canvas.removeEventListener("pointerdown",this.onPointerDown),this.canvas.removeEventListener("pointermove",this.onPointerMove),this.canvas.removeEventListener("pointerup",this.onPointerUp),this.canvas.removeEventListener("pointercancel",this.onPointerCancel),this.canvas.removeEventListener("lostpointercapture",this.onPointerCancel),window.removeEventListener("pointermove",this.onGlobalPointerMove),window.removeEventListener("pointerup",this.onGlobalPointerUp),window.removeEventListener("pointercancel",this.onGlobalPointerCancel)):(this.canvas.removeEventListener("touchstart",this.onTouchStart),this.canvas.removeEventListener("touchmove",this.onTouchMove),this.canvas.removeEventListener("touchend",this.onTouchEnd),this.canvas.removeEventListener("touchcancel",this.onTouchEnd),window.removeEventListener("mousemove",this.onLegacyMouseMove),window.removeEventListener("touchmove",this.onGlobalTouchMove)),this.canvas.removeEventListener("wheel",this.onWheel),this.active.clear())}}function Sl(i,e,t,n){const r=t-i,s=n-e;return Math.sqrt(r*r+s*s)}const Ye=1e-6,K=(i,e)=>({x:i,y:e}),dt=(i,e,t)=>({x:i,y:e,z:t});function xt(i){return{x:i.x,y:i.y}}function On(i){return i.map(xt)}function nr(i){let e=0;for(let t=0;t<i.length;t+=1){const n=i[t],r=i[(t+1)%i.length];e+=n.x*r.y-r.x*n.y}return e/2}function wl(i){return nr(i)>0}function ts(i){return wl(i)?i:[i[0],i[3],i[2],i[1]]}function Ai(i){let e=0;for(let t=0;t<i.length;t+=1){const n=i[t],r=i[(t+1)%i.length],s=i[(t+2)%i.length],a=(r.x-n.x)*(s.y-r.y)-(r.y-n.y)*(s.x-r.x),o=Math.sign(a);if(o!==0){if(e!==0&&o!==e)return!1;e=o}}return e!==0}function ir(i,e=Ye){return Math.abs(nr(i))<=e}function ns(i,e){return Math.hypot(e.x-i.x,e.y-i.y)}function El(i){return Math.min(ns(i[0],i[1]),ns(i[1],i[2]),ns(i[2],i[3]),ns(i[3],i[0]))}function Hn(i,e){let t=!1;for(let n=0,r=e.length-1;n<e.length;r=n,n+=1){const s=e[n],a=e[r],o=a.y-s.y,l=Math.abs(o)<=Ye?o<0?-Ye:Ye:o;s.y>i.y!=a.y>i.y&&i.x<(a.x-s.x)*(i.y-s.y)/l+s.x&&(t=!t)}return t}function Tl(i,e){let t=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY;for(const r of i){const s=r.x*e.x+r.y*e.y;s<t&&(t=s),s>n&&(n=s)}return{min:t,max:n}}function ua(i,e){const t=[i,e];for(const n of t)for(let r=0;r<n.length;r+=1){const s=n[r],a=n[(r+1)%n.length],o=K(a.x-s.x,a.y-s.y),l=K(-o.y,o.x),c=Tl(i,l),d=Tl(e,l);if(c.max<d.min||d.max<c.min)return!1}return!0}function ha(i,e){const t=i.reduce((n,r)=>K(n.x+r.x,n.y+r.y),K(0,0));return t.x/=i.length,t.y/=i.length,i.map(n=>K(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e))}function Ci(i){const e=ts(i);if(ir(e)||!Ai(e))return null;const[t,n,r,s]=e,a=n.x-r.x,o=n.y-r.y,l=s.x-r.x,c=s.y-r.y,d=t.x-n.x+r.x-s.x,u=t.y-n.y+r.y-s.y,h=a*c-l*o;if(Math.abs(h)<=Ye)return null;const m=(d*c-l*u)/h,_=(a*u-d*o)/h,g=n.x-t.x+m*n.x,f=s.x-t.x+_*s.x,p=t.x,y=n.y-t.y+m*n.y,M=s.y-t.y+_*s.y,E=t.y;return[g,f,p,y,M,E,m,_,1]}function is(i){const[e,t,n,r,s,a,o,l,c]=i,d=s*c-a*l,u=-(r*c-a*o),h=r*l-s*o,m=-(t*c-n*l),_=e*c-n*o,g=-(e*l-t*o),f=t*a-n*s,p=-(e*a-n*r),y=e*s-t*r,M=e*d+t*u+n*h;if(Math.abs(M)<=Ye)return null;const E=1/M;return[d*E,m*E,f*E,u*E,_*E,p*E,h*E,g*E,y*E]}function Al(i,e){return[i[0]*e[0]+i[1]*e[3]+i[2]*e[6],i[0]*e[1]+i[1]*e[4]+i[2]*e[7],i[0]*e[2]+i[1]*e[5]+i[2]*e[8],i[3]*e[0]+i[4]*e[3]+i[5]*e[6],i[3]*e[1]+i[4]*e[4]+i[5]*e[7],i[3]*e[2]+i[4]*e[5]+i[5]*e[8],i[6]*e[0]+i[7]*e[3]+i[8]*e[6],i[6]*e[1]+i[7]*e[4]+i[8]*e[7],i[6]*e[2]+i[7]*e[5]+i[8]*e[8]]}function zn(i,e,t){const[n,r,s,a,o,l,c,d,u]=i,h=c*e+d*t+u;return Math.abs(h)<=Ye?null:K((n*e+r*t+s)/h,(a*e+o*t+l)/h)}function Cl(i,e,t){const n=Math.max(1,e),r=Math.max(1,t);return[i[0]/n,i[1]/r,i[2],i[3]/n,i[4]/r,i[5],i[6]/n,i[7]/r,i[8]]}function Rl(i){return`matrix3d(${i[0]}, ${i[3]}, 0, ${i[6]}, ${i[1]}, ${i[4]}, 0, ${i[7]}, 0, 0, 1, 0, ${i[2]}, ${i[5]}, 0, ${i[8]})`}function rs(i,e){const t=Ci(i.quad);if(!t)return null;const n=is(t);return n?zn(n,e.x,e.y):null}function Pl(i){const e=i.map(o=>o.x),t=i.map(o=>o.y),n=Math.min(...e),r=Math.max(...e),s=Math.min(...t),a=Math.max(...t);return{minX:n,minY:s,maxX:r,maxY:a,width:r-n,height:a-s}}function Il(i,e){return dt(i.x-e.x,i.y-e.y,i.z-e.z)}function fa(i,e){return dt(i.x+e.x,i.y+e.y,i.z+e.z)}function pa(i,e){return dt(i.x*e,i.y*e,i.z*e)}function ma(i,e){return i.x*e.x+i.y*e.y+i.z*e.z}function Ll(i,e){return dt(i.y*e.z-i.z*e.y,i.z*e.x-i.x*e.z,i.x*e.y-i.y*e.x)}function rr(i){const e=Math.hypot(i.x,i.y,i.z);return Number.isFinite(e)&&e>Ye?pa(i,1/e):null}function Dl(i){const e=rr(Il(i.target,i.position)),t=dt(0,1,0),n=e?rr(Ll(e,t)):null,r=n&&e?rr(Ll(n,e)):null;return!e||!n||!r?null:{right:n,up:r,forward:e}}function Xm(i,e){if(!Number.isFinite(i.verticalFovDeg)||i.verticalFovDeg<=1||i.verticalFovDeg>=179||e.width<=0||e.height<=0)return null;const t=Math.tan(i.verticalFovDeg*Math.PI/360);if(!Number.isFinite(t)||t<=Ye)return null;const n=e.height/(2*t);return[n,0,e.width/2,0,-n,e.height/2,0,0,1]}function ga(i,e){const t=Dl(i);return t?dt(t.right.x*e.x+t.up.x*e.y+t.forward.x*e.z,t.right.y*e.x+t.up.y*e.y+t.forward.y*e.z,t.right.z*e.x+t.up.z*e.y+t.forward.z*e.z):null}function _a(i){return Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z)}function $m(i,e){return fa(fa(i.origin,pa(i.axisU,e.x)),pa(i.axisV,e.y))}function qm(i){return[K(0,i.height),K(i.width,i.height),K(i.width,0),K(0,0)]}function ss(i,e,t){if(!_a(i.position)||!_a(i.target)||!_a(e)||!Number.isFinite(i.verticalFovDeg)||!Number.isFinite(i.near)||i.verticalFovDeg<=1||i.verticalFovDeg>=179||i.near<=0||t.width<=0||t.height<=0)return null;const n=Dl(i);if(!n)return null;const r=Il(e,i.position),s=ma(r,n.right),a=ma(r,n.up),o=ma(r,n.forward);if(!Number.isFinite(s)||!Number.isFinite(a)||!Number.isFinite(o)||o<=i.near)return null;const l=Math.tan(i.verticalFovDeg*Math.PI/360),c=t.width/t.height;if(!Number.isFinite(l)||l<=Ye||!Number.isFinite(c)||c<=Ye)return null;const d=s/(o*l*c),u=a/(o*l);return!Number.isFinite(d)||!Number.isFinite(u)?null:K((d+1)*t.width/2,(1-u)*t.height/2)}function va(i,e,t,n){return ss(e,$m(i,t),n)}function Nl(i,e,t){const n=qm(i).map(s=>va(i,e,s,t));if(n.some(s=>s===null))return null;const r=[n[0],n[1],n[2],n[3]];return ir(r)||!Ai(r)?null:ts(r)}function xa(i,e,t,n){const r=t.map(s=>va(i,e,s,n));return r.some(s=>s===null)?null:r}function Fl(i,e,t){return i.doorwayExclusions.map(n=>xa(i,e,n,t)).filter(n=>n!==null)}function Ul(i,e){if(!i||!e||i.length!==e.length||i.length===0)return{max:null,mean:null};const t=i.map((n,r)=>Math.hypot(n.x-e[r].x,n.y-e[r].y));return{max:Math.max(...t),mean:t.reduce((n,r)=>n+r,0)/t.length}}function kl(i,e=.02){const t=i[1].x-i[0].x,n=Math.abs(t)<=Ye?0:(i[1].y-i[0].y)/t;return Math.abs(n)<=e?"flat":n>0?"left":"right"}function Bl(i,e,t,n,r,s,a=36){var y,M,E,R;const o=Ul(t,e),l=Ul(r,n),c=Math.hypot(i.axisU.x,i.axisU.y,i.axisU.z),d=Math.hypot(i.axisV.x,i.axisV.y,i.axisV.z),u=c>Ye&&d>Ye?(i.axisU.x*i.axisV.x+i.axisU.y*i.axisV.y+i.axisU.z*i.axisV.z)/(c*d):Number.POSITIVE_INFINITY,h=e[1].x-e[0].x,m=Math.abs(h)<=Ye?0:(e[1].y-e[0].y)/h,_=kl(e),g=_===s,f=nr(e)>Ye,p=f&&g&&Math.abs(c-1)<=.08&&Math.abs(d-1)<=.08&&Math.abs(u)<=.08&&((y=o.max)!=null?y:Number.POSITIVE_INFINITY)<=a&&((M=l.max)!=null?M:0)<=a;return{referenceResidualMaxPx:(E=o.max)!=null?E:Number.POSITIVE_INFINITY,referenceResidualMeanPx:(R=o.mean)!=null?R:Number.POSITIVE_INFINITY,safeResidualMaxPx:l.max,safeResidualMeanPx:l.mean,axisULength:c,axisVLength:d,axisDot:u,expectedConvergence:s,projectedConvergence:_,convergenceSlope:m,convergenceMatchesExpected:g,windingClockwise:f,thresholdPx:a,passes:p}}function Ym(i,e,t,n,r,s,a=36){const o=Ci(e),l=Xm(n,r);if(!o||!l)return null;const c=is(l);if(!c)return null;const d=(k,z)=>{const j=[1/Math.max(Ye,k),0,0,0,-1/Math.max(Ye,z),1,0,0,1],D=Al(o,j),Z=Al(c,D),$=dt(Z[0],Z[3],Z[6]),ue=dt(Z[1],Z[4],Z[7]),he=dt(Z[2],Z[5],Z[8]),L=Math.hypot($.x,$.y,$.z),ee=Math.hypot(ue.x,ue.y,ue.z);return L<=Ye||ee<=Ye?null:{homography:D,basis1:$,basis2:ue,origin:he,norm1:L,norm2:ee}},u=d(i.width,i.height);if(!u)return null;const h=i.width*u.norm1,m=i.height*u.norm2,_=d(h,m);if(!_)return null;const g=dt(_.origin.x,_.origin.y,_.origin.z),f=rr(_.basis1),p=rr(_.basis2),y=ga(n,g),M=f?ga(n,f):null,E=p?ga(n,p):null;if(!y||!M||!E)return null;const R=h/i.width,T=m/i.height,A=k=>K(k.x*R,k.y*T),N=t&&t.length>=3?(()=>{const k=is(_.homography);if(!k)return i.safePolygon.map(A);const z=t.map(j=>zn(k,j.x,j.y)).filter(j=>j!==null);return z.length===t.length?z:i.safePolygon.map(A)})():i.safePolygon.map(A),S={origin:fa(n.position,y),axisU:M,axisV:E,width:h,height:m,safePolygon:N,doorwayExclusions:i.doorwayExclusions.map(k=>k.map(A)),hangingBand:{minY:i.hangingBand.minY*T,maxY:i.hangingBand.maxY*T,margin:i.hangingBand.margin*T}},x=Nl(S,n,r);if(!x)return null;const P=xa(S,n,S.safePolygon,r),V=Bl(S,x,e,P,t,s,a);return{room:S,scaleX:R,scaleY:T,projectedQuad:x,projectedSafePolygon:P,realism:V}}function Ol(i){return{minX:Math.min(...i.map(e=>e.x)),maxX:Math.max(...i.map(e=>e.x)),minY:Math.min(...i.map(e=>e.y)),maxY:Math.max(...i.map(e=>e.y))}}function jm(i,e,t){const n=e/2,r=t/2;return[K(i.x-n,i.y+r),K(i.x+n,i.y+r),K(i.x+n,i.y-r),K(i.x-n,i.y-r)]}function Hl(i,e,t,n){const r=Ol(i.safePolygon),s=Math.max(Ye,n),a=Math.max(Ye,r.maxX-r.minX),o=Math.max(Ye,i.hangingBand.maxY-i.hangingBand.minY-i.hangingBand.margin*2),l=Math.max(Ye,Math.min(t,o,a/s)),c=(A,N)=>{const S=jm(A,N*s,N),x=[...S,A].every(D=>Number.isFinite(D.x)&&Number.isFinite(D.y)),P=S.every(D=>Hn(D,i.safePolygon)),V=i.doorwayExclusions.every(D=>!ua(S,D)),k=S.every(D=>D.y>=i.hangingBand.minY+i.hangingBand.margin-Ye&&D.y<=i.hangingBand.maxY-i.hangingBand.margin+Ye),z=Ai(S)&&Math.abs(nr(S))>Ye;return{anchor:A,mountedHeight:N,localQuad:S,validity:{finite:x,contained:P,doorwayClear:V,inHangingBand:k,orientationConsistent:z},moved:!1,scaleFactor:1,candidateCount:1,adjustmentReason:"none",rejectionReason:x?z?P?V?k?"none":"outside-hanging-band":"doorway-overlap":"outside-safe-region":"degenerate-local-quad":"non-finite"}},d=[1,.97,.94,.91,.88,.85,.82,.79,.76,.73,.7,.67,.64,.61,.58,.55],u=i.doorwayExclusions.map(A=>Ol(A)),h=A=>Math.round(A*1e4)/1e4,m=(A,N,S,x)=>{if(!Number.isFinite(N))return;const P=Math.min(x,Math.max(S,N));A.some(V=>Math.abs(V-P)<=1e-4)||A.push(h(P))},_=c(K(e.x,e.y),l);let g=_,f=null,p=Number.POSITIVE_INFINITY,y=0;for(const A of d){const N=Math.max(Ye,l*A),S=N*s/2,x=N/2,P=r.minX+S,V=r.maxX-S,k=i.hangingBand.minY+i.hangingBand.margin+x,z=i.hangingBand.maxY-i.hangingBand.margin-x;if(P>V||k>z)continue;const j=[],D=[],Z=Math.min(V,Math.max(P,e.x)),$=Math.min(z,Math.max(k,e.y));m(j,Z,P,V),m(j,P,P,V),m(j,V,P,V),m(D,$,k,z),m(D,k,k,z),m(D,z,k,z);for(const he of i.safePolygon)m(j,he.x,P,V),m(D,he.y,k,z);const ue=Math.max(.01,i.hangingBand.margin*.5);for(const he of u)m(j,he.minX-S-ue,P,V),m(j,he.maxX+S+ue,P,V),m(D,he.maxY+x+ue,k,z),m(D,he.minY-x-ue,k,z);for(const he of D)for(const L of j){y+=1;const ee=c(K(L,he),N);if(ee.scaleFactor=A,ee.candidateCount=y,g=ee,!ee.validity.finite||!ee.validity.contained||!ee.validity.doorwayClear||!ee.validity.inHangingBand||!ee.validity.orientationConsistent)continue;const se=Math.hypot(ee.anchor.x-e.x,ee.anchor.y-e.y),X=Math.abs(l-N)/Math.max(l,Ye),Y=se+X*.75;Y<p-1e-6&&(p=Y,f=ee)}if(f)break}const M=f!=null?f:g,E=Math.abs(M.anchor.x-e.x)>1e-6||Math.abs(M.anchor.y-e.y)>1e-6,R=Math.abs(M.mountedHeight-t)>1e-6;M.moved=E,M.candidateCount=Math.max(y,1),M.scaleFactor=Math.max(Ye,M.mountedHeight/Math.max(t,Ye));const T=!_.validity.doorwayClear;return M.adjustmentReason=f?E&&R?"shifted-and-shrunk":E?T?"shifted-away-from-doorway":"clamped-safe-region":R?"shrunk-to-fit":"none":"rejected",f?(M.rejectionReason="none",M):(M.rejectionReason=M.rejectionReason==="none"?"no-valid-candidate":M.rejectionReason,M)}function as(i,e,t,n){if(i.room&&i.camera&&e.anchor){const y=Hl(i.room,e.anchor,e.mountedHeight,t);if(!y.validity.finite||!y.validity.contained||!y.validity.doorwayClear||!y.validity.inHangingBand||!y.validity.orientationConsistent||i.projectionRealism&&!i.projectionRealism.passes)return null;const M=y.localQuad.map(S=>va(i.room,i.camera,S,n));if(M.some(S=>S===null))return null;const E=ts([M[0],M[1],M[2],M[3]]);if(ir(E)||!Ai(E)||i.safePolygon&&!E.every(S=>Hn(S,i.safePolygon)))return null;const R=Math.max(1,y.mountedHeight/i.room.height*n.height),T=Math.max(1,R*Math.max(Ye,t)),A=Ci(E);if(!A)return null;const N=Cl(A,T,R);return{localQuad:y.localQuad,projectedQuad:E,bounds:Pl(E),sourceWidth:T,sourceHeight:R,cssMatrix3d:Rl(N),shortEdge:El(E),placement:y,validity:y.validity,realism:i.projectionRealism}}const r=Math.max(Ye,t),s=Math.max(Ye,Math.min(1,i.planeAspect/r)),a=Math.max(Ye,Math.min(e.mountedHeight,s)),l=a*r/Math.max(Ye,i.planeAspect)/2,c=a/2,d=[K(e.center.x-l,e.center.y-c),K(e.center.x+l,e.center.y-c),K(e.center.x+l,e.center.y+c),K(e.center.x-l,e.center.y+c)],u=Ci(i.quad);if(!u)return null;const h=d.map(y=>zn(u,y.x,y.y));if(h.some(y=>y===null))return null;const m=ts([h[0],h[1],h[2],h[3]]),_=Math.max(1,a*n.height),g=Math.max(1,_*t),f=Ci(m);if(!f)return null;const p=Cl(f,g,_);return{localQuad:d,projectedQuad:m,bounds:Pl(m),sourceWidth:g,sourceHeight:_,cssMatrix3d:Rl(p),shortEdge:El(m),placement:null}}const Km=new Set(["Backgrounds/museum-target.png"]);function Zm(i){return i.trim().replace(/^[./]+/,"").replace(/^backgrounds\//i,"Backgrounds/")}function Qm(i,e,t){return t||!i||!e||i===e?null:e}function ya(i){return i===404}function ba(i){return i.trim()?Km.has(Zm(i)):!1}const Jm=4,an={width:1366,height:768},Ma=an.width/an.height,Ri="Backgrounds/museum-empty.png",zl="#D8DDDB",eg=1500,os=72,ls={position:dt(0,1.8,7.5),target:dt(0,1.8,0),verticalFovDeg:42,near:.1};function cs(i,e,t,n,r=[]){return{origin:i,axisU:e,axisV:dt(0,1,0),width:t,height:n,safePolygon:[K(.14,.14),K(t-.14,.14),K(t-.14,n-.14),K(.14,n-.14)],doorwayExclusions:r,hangingBand:{minY:.42,maxY:n-.28,margin:.08}}}const tg=[{id:"wall-left-outer",group:"left",planeAspect:.73,quad:[K(94,188),K(372,236),K(348,622),K(36,626)],safePolygon:[K(110,206),K(356,248),K(332,606),K(52,610)],shadowVector:K(-14,18),room:cs(dt(-3.9,0,2),dt(.433,0,-.902),2.773,3.4,[[K(0,0),K(.3,0),K(.3,1.35),K(0,1.35)]])},{id:"wall-left-inner",group:"left",planeAspect:1.06,quad:[K(362,234),K(688,246),K(732,610),K(332,614)],safePolygon:[K(376,250),K(674,260),K(712,594),K(348,598)],shadowVector:K(-8,14),room:cs(dt(-2.7,0,-.5),dt(1,0,0),2.7,3,[[K(2.34,0),K(2.7,0),K(2.7,1.7),K(2.34,1.7)]])},{id:"wall-right-inner",group:"right",planeAspect:1.05,quad:[K(682,246),K(1006,234),K(1032,614),K(648,610)],safePolygon:[K(698,260),K(990,250),K(1012,598),K(666,594)],shadowVector:K(8,14),room:cs(dt(0,0,-.5),dt(1,0,0),2.7,3,[[K(0,0),K(.36,0),K(.36,1.7),K(0,1.7)]])},{id:"wall-right-outer",group:"right",planeAspect:.72,quad:[K(998,236),K(1274,188),K(1330,626),K(1014,622)],safePolygon:[K(1014,248),K(1256,206),K(1310,610),K(1032,606)],shadowVector:K(14,18),room:cs(dt(2.7,0,-.5),dt(.433,0,.902),2.773,3.4,[[K(2.47,0),K(2.773,0),K(2.773,1.35),K(2.47,1.35)]])}],Sa=[{suffix:"wall-left.outer",wallId:"wall-left-outer",intendedUse:"portrait",placement:{wallId:"wall-left-outer",center:K(.52,.58),anchor:K(1.4,1.78),mountedHeight:1.24}},{suffix:"wall-left.inner",wallId:"wall-left-inner",intendedUse:"landscape",placement:{wallId:"wall-left-inner",center:K(.52,.56),anchor:K(1.35,1.68),mountedHeight:.84}},{suffix:"wall-right.inner",wallId:"wall-right-inner",intendedUse:"square",placement:{wallId:"wall-right-inner",center:K(.49,.56),anchor:K(1.35,1.68),mountedHeight:.9}},{suffix:"wall-right.outer",wallId:"wall-right-outer",intendedUse:"panoramic",placement:{wallId:"wall-right-outer",center:K(.51,.56),anchor:K(1.38,1.7),mountedHeight:.7}}],ng=new Map(Sa.map(i=>[i.suffix,i.wallId])),ig={"room-01.wall-left.outer":"quiet-coastline","room-01.wall-left.inner":"electric-storm","room-01.wall-right.inner":"tokyo-passage","room-01.wall-right.outer":"golden-desert"},bt=i=>Math.min(1,Math.max(0,i)),Gl=i=>typeof i=="string"&&/^#[0-9a-fA-F]{6}$/.test(i.trim()),Vl=i=>`room-${String(i+1).padStart(2,"0")}`;function Wl(i){return i<.9?"portrait":i<=1.15?"square":i<1.9?"landscape":"panoramic"}function wa(){return{galleryWall:zl,museumWall:zl}}function rg(i){return kl(i,.01)}function Xl(i){const e=Number.isFinite(i.width)?Math.max(640,Math.min(4096,i.width)):an.width,t=Number.isFinite(i.height)?Math.max(360,Math.min(4096,i.height)):an.height;return{width:e,height:t}}function $l(i){return[xt(i[0]),xt(i[1]),xt(i[2]),xt(i[3])]}function sr(i){return dt(i.x,i.y,i.z)}function Ea(i){return{origin:sr(i.origin),axisU:sr(i.axisU),axisV:sr(i.axisV),width:i.width,height:i.height,safePolygon:On(i.safePolygon),doorwayExclusions:i.doorwayExclusions.map(e=>On(e)),hangingBand:{...i.hangingBand}}}function ar(i){return{position:sr(i.position),target:sr(i.target),verticalFovDeg:i.verticalFovDeg,near:i.near}}function sg(i){var e;return{id:i.id,planeAspect:i.planeAspect,quad:i.quad,safePolygon:(e=i.safePolygon)!=null?e:On(ha(i.quad,.92)),shadowVector:i.shadowVector,room:i.room}}function ds(){return tg.map(i=>({...i,quad:$l(i.quad),safePolygon:i.safePolygon?On(i.safePolygon):void 0,shadowVector:i.shadowVector?xt(i.shadowVector):void 0,room:i.room?Ea(i.room):void 0}))}function Ta(i){return Sa.map(e=>({id:`${Vl(i)}.${e.suffix}`,enabled:!0,selectable:!0,placement:{wallId:e.wallId,center:xt(e.placement.center),mountedHeight:e.placement.mountedHeight,anchor:e.placement.anchor?xt(e.placement.anchor):void 0,provisional:!1}}))}function us(i){return i.dimensions.height>0?i.dimensions.width/i.dimensions.height:1}function ag(i){const e=i.reduce((t,n)=>K(t.x+n.x,t.y+n.y),K(0,0));return K(e.x/Math.max(1,i.length),e.y/Math.max(1,i.length))}function og(i,e,t,n){if(i.room&&e.anchor){const y=Hl(i.room,e.anchor,e.mountedHeight,t);return{center:e.center,anchor:y.anchor,mountedHeight:y.mountedHeight,adjusted:Math.abs(y.anchor.x-e.anchor.x)>1e-6||Math.abs(y.anchor.y-e.anchor.y)>1e-6||Math.abs(y.mountedHeight-e.mountedHeight)>1e-6}}const r=Math.max(.25,t),s=Math.max(.25,i.planeAspect);let a=K(bt(e.center.x),bt(e.center.y)),o=Math.max(.04,Math.min(.9,e.mountedHeight)),l=a.x!==e.center.x||a.y!==e.center.y||o!==e.mountedHeight;const c=Math.max(.04,Math.min(.9,s/r));o>c&&(o=c,l=!0);const d=()=>{const M=o*r/s/2,E=o/2,R=Math.max(0,M),T=Math.min(1,1-M),A=Math.max(0,E),N=Math.min(1,1-E),S=Math.max(R,Math.min(T,a.x)),x=Math.max(A,Math.min(N,a.y));(S!==a.x||x!==a.y)&&(l=!0),a=K(S,x)};d();const u=()=>as(i,{wallId:e.wallId,center:a,mountedHeight:o},r,n),h=y=>y?y.projectedQuad.reduce((M,E)=>M+(Hn(E,i.safePolygon)?1:0),0):-1;let m=h(u()),_=a,g=o;if(m===4)return{center:_,mountedHeight:g,adjusted:l};const f=(()=>{const y=rs(i,ag(i.safePolygon));return y?K(bt(y.x),bt(y.y)):K(.5,.5)})();for(let y=0;y<36;y+=1){a=K(bt(a.x+(f.x-a.x)*.22),bt(a.y+(f.y-a.y)*.22)),o=Math.max(.04,Math.min(c,o*.985)),d();const M=u(),E=h(M);if(E>m&&(m=E,_=a,g=o),m===4)break}const p=Math.abs(_.x-e.center.x)>1e-6||Math.abs(_.y-e.center.y)>1e-6||Math.abs(g-e.mountedHeight)>1e-6;return{center:_,mountedHeight:g,adjusted:l||p}}function or(i,e=!1){if(!i||typeof i!="object")return null;const t=i,n=typeof t.x=="number"&&Number.isFinite(t.x)?t.x:NaN,r=typeof t.y=="number"&&Number.isFinite(t.y)?t.y:NaN;return Number.isNaN(n)||Number.isNaN(r)?null:e?K(bt(n),bt(r)):K(n,r)}function lr(i){if(!i||typeof i!="object")return null;const e=i,t=e.x,n=e.y,r=e.z;return typeof t!="number"||typeof n!="number"||typeof r!="number"||!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(r)?null:dt(t,n,r)}function lg(i,e){if(!i||typeof i!="object")return null;const t=i,n=t.minY,r=t.maxY,s=t.margin;return typeof n!="number"||typeof r!="number"||typeof s!="number"||!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(s)||n<0||r>e||r-n<=.2||s<0||s*2>=r-n?null:{minY:n,maxY:r,margin:s}}function cg(i){if(!i||typeof i!="object")return null;const e=i,t=lr(e.origin),n=lr(e.axisU),r=lr(e.axisV),s=e.width,a=e.height;if(!t||!n||!r||typeof s!="number"||typeof a!="number"||!Number.isFinite(s)||!Number.isFinite(a)||s<=.25||a<=.25)return null;const o=Math.hypot(n.x,n.y,n.z),l=Math.hypot(r.x,r.y,r.z),c=n.x*r.x+n.y*r.y+n.z*r.z;if(o<.92||o>1.08||l<.92||l>1.08||Math.abs(c)>.08)return null;const d=Aa(e.safePolygon),h=(Array.isArray(e.doorwayExclusions)?e.doorwayExclusions:[]).map(g=>Aa(g)).filter(g=>g!==null),m=lg(e.hangingBand,a);if(!d||!m)return null;const _=g=>g.x>=0&&g.x<=s&&g.y>=0&&g.y<=a;return!d.every(_)||h.some(g=>!g.every(_))?null:{origin:t,axisU:n,axisV:r,width:s,height:a,safePolygon:d,doorwayExclusions:h,hangingBand:m}}function ql(i){if(!i||typeof i!="object")return null;const e=i,t=lr(e.position),n=lr(e.target),r=e.verticalFovDeg,s=e.near;return!t||!n||typeof r!="number"||typeof s!="number"||!Number.isFinite(r)||!Number.isFinite(s)||r<15||r>100||s<=0||Math.hypot(t.x-n.x,t.y-n.y,t.z-n.z)<.1?null:{position:t,target:n,verticalFovDeg:r,near:s}}function dg(i){if(!Array.isArray(i)||i.length!==4)return null;const e=i.map(t=>or(t));return e.some(t=>t===null)?null:[e[0],e[1],e[2],e[3]]}function Aa(i){if(!Array.isArray(i)||i.length<3)return null;const e=i.map(t=>or(t));return e.some(t=>t===null)?null:e}function ug(i){const e=or(i);return e!=null?e:void 0}function hg(i){if(!i||typeof i!="object")return{...an};const e=i;return Xl({width:typeof e.width=="number"?e.width:an.width,height:typeof e.height=="number"?e.height:an.height})}function fg(i,e){var c;if(!i||typeof i!="object")return null;const t=i,n=typeof t.id=="string"?t.id.trim():"",r=t.group==="right"?"right":"left",s=typeof t.planeAspect=="number"&&Number.isFinite(t.planeAspect)?Math.max(.25,Math.min(8,t.planeAspect)):NaN,a=dg(t.quad);if(!n||Number.isNaN(s)||!a)return e.push(`wall "${n||"?"}" ignored: requires id, planeAspect, and a four-corner quad.`),null;if(ir(a)||!Ai(a))return e.push(`wall "${n}" ignored: quad must be convex and non-degenerate.`),null;const o=(c=Aa(t.safePolygon))!=null?c:On(ha(a,.92)),l=cg(t.room);return t.room!==void 0&&!l&&e.push(`wall "${n}": v3 room plane is invalid; using the calibrated default plane when available.`),wl(a)||e.push(`wall "${n}": quad was normalized to clockwise winding.`),Math.abs(nr(o))<=1e-6&&e.push(`wall "${n}": safePolygon is degenerate; using a derived inset polygon.`),{id:n,group:r,planeAspect:s,quad:a,safePolygon:o,shadowVector:ug(t.shadowVector),room:l!=null?l:void 0}}function pg(i){if(!i||typeof i!="object")return null;const e=i,t=typeof e.wallId=="string"?e.wallId.trim():"",n=or(e.center,!0),r=or(e.anchor),s=r?8:.9,a=typeof e.mountedHeight=="number"&&Number.isFinite(e.mountedHeight)?Math.max(.04,Math.min(s,e.mountedHeight)):NaN;return!t||!n||Number.isNaN(a)?null:{wallId:t,center:n,mountedHeight:a,anchor:r!=null?r:void 0,provisional:e.provisional===!0}}function mg(i){if(!i||typeof i!="object")return null;const e=i,t=typeof e.cx=="number"&&Number.isFinite(e.cx)?bt(e.cx):NaN,n=typeof e.cy=="number"&&Number.isFinite(e.cy)?bt(e.cy):NaN,r=typeof e.maxW=="number"&&Number.isFinite(e.maxW)?bt(e.maxW):NaN,s=typeof e.maxH=="number"&&Number.isFinite(e.maxH)?bt(e.maxH):NaN,a=typeof e.rotateYDeg=="number"&&Number.isFinite(e.rotateYDeg)?Math.max(-45,Math.min(45,e.rotateYDeg)):0;return[t,n,r,s].some(Number.isNaN)||r<=0||s<=0?null:{cx:t,cy:n,maxW:r,maxH:s,rotateYDeg:a}}function Yl(i,e,t,n){var f,p;const r=e.replace(/^room-\d+\./,""),s=ng.get(r);let a=s!=null?s:"";a||(a=i.cx<.25?"wall-left-outer":i.cx<.5?"wall-left-inner":i.cx<.75?"wall-right-inner":"wall-right-outer");const o=(f=t.find(y=>y.id===a))!=null?f:t[0],l=sg(o),c=K(i.cx*n.width,i.cy*n.height),d=(p=rs(l,c))!=null?p:K(.5,.5),u=K(c.x,c.y-i.maxH*n.height/2),h=K(c.x,c.y+i.maxH*n.height/2),m=rs(l,u),_=rs(l,h),g=m&&_?Math.abs(_.y-m.y):Math.max(.08,i.maxH*1.35);return{wallId:o.id,center:K(bt(d.x),bt(d.y)),mountedHeight:Math.max(.06,Math.min(.9,g)),provisional:!0}}function Ca(i){const e=i&&typeof i=="object"?i:{},t=typeof e.selectionTimeoutMs=="number"&&Number.isFinite(e.selectionTimeoutMs)?Math.max(250,Math.min(1e4,e.selectionTimeoutMs)):eg;return{requireAllMapped:e.requireAllMapped!==!1,autoPlaceUnmapped:e.autoPlaceUnmapped!==!1,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:t,selectionTimeout:"open-exact-target-procedural"}}function jl(i){var E;const e=[];if(i==null)return{config:null,warnings:e,source:"built-in-default"};if(typeof i!="object"||Array.isArray(i))return e.push("museum-hub config ignored: expected a JSON object."),{config:null,warnings:e,source:"built-in-default"};const t=i,n=wa(),r=t.visualTokens&&typeof t.visualTokens=="object"?t.visualTokens:{};r.galleryWall!==void 0&&(Gl(r.galleryWall)?n.galleryWall=r.galleryWall.trim():e.push("visualTokens.galleryWall is not a valid #RRGGBB color; using default.")),r.museumWall!==void 0&&(Gl(r.museumWall)?r.museumWall.trim().toUpperCase()!==n.galleryWall.toUpperCase()&&e.push("visualTokens.museumWall differs from galleryWall; the authoritative gallery wall token is used everywhere."):e.push("visualTokens.museumWall is not a valid #RRGGBB color; using galleryWall.")),n.museumWall=n.galleryWall;const s=hg(t.stage);let a=Ma,o=Ri,l=Ri;if(t.background&&typeof t.background=="object"){const R=t.background;typeof R.aspect=="number"&&Number.isFinite(R.aspect)&&R.aspect>.5&&R.aspect<4&&(a=R.aspect),typeof R.src=="string"&&R.src.trim()&&(o=R.src.trim())}if(t.backgroundFallback&&typeof t.backgroundFallback=="object"){const R=t.backgroundFallback;typeof R.src=="string"&&R.src.trim()&&(l=R.src.trim())}ba(o)&&e.push(`museum-hub background "${o}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds will fall back at runtime.`),ba(l)&&e.push(`museum-hub background fallback "${l}" is a reference-only asset and is not shipped to public/backgrounds; hosted builds may continue on the neutral wall token.`);const c=(E=ql(t.camera))!=null?E:ar(ls);t.camera!==void 0&&!ql(t.camera)&&e.push("museum-hub camera is invalid; using built-in calibrated camera.");const d=Ca(t.fallbacks),u=Array.isArray(t.slots)?t.slots:[];if(u.length===0)return e.push("museum-hub config ignored: expected a non-empty slots array."),{config:null,warnings:e,source:"built-in-default"};const h=Array.isArray(t.walls)?t.walls:[],m=h.map(R=>fg(R,e)).filter(R=>R!==null),_=new Map(ds().map(R=>[R.id,R])),g=(m.length>0?m:ds()).map(R=>{var A;if(R.room)return R;const T=(A=_.get(R.id))==null?void 0:A.room;return T?(e.push(`wall "${R.id}": missing v3 room plane; using built-in calibrated room plane.`),{...R,room:Ea(T)}):R});h.length>0&&m.length===0&&e.push("museum-hub walls were invalid; using built-in calibrated wall planes.");const f=typeof t.version=="number"?t.version:1,p=new Set,y=[];let M="injected";for(const R of u){if(!R||typeof R!="object"){e.push("slot ignored: not an object.");continue}const T=R,A=typeof T.id=="string"?T.id.trim():"";if(!A){e.push("slot ignored: missing id.");continue}if(p.has(A)){e.push(`slot "${A}" ignored: duplicate slot ID.`);continue}p.add(A);const N=typeof T.artworkId=="string"&&T.artworkId.trim()?T.artworkId.trim():void 0,S=T.placement,x=pg(S);let P=null;if(x)P=x;else{const V=mg(S);V&&(P=Yl(V,A,g,s),M=f>=2?"injected":"v1-migrated")}if(!P){e.push(`slot "${A}" ignored: requires a valid v2 placement or migratable v1 placement.`);continue}y.push({id:A,enabled:T.enabled!==!1,selectable:T.selectable!==!1,...N?{artworkId:N}:{},placement:P})}return y.length===0?{config:null,warnings:e,source:"built-in-default"}:(M==="v1-migrated"&&e.push("Version-1 museum-hub slots were migrated to the wall-plane v2 model. Review calibration output and re-save customer-artworks/museum-hub.json."),{config:{version:3,coverage:"all-active-artworks",stage:s,background:{src:o,aspect:a},backgroundFallback:{src:l},visualTokens:n,camera:c,walls:g,fallbacks:d,slots:y},warnings:e,source:M})}function gg(i){const e=[];if(!Array.isArray(i)||i.length===0)return{config:null,warnings:e,source:"built-in-default"};e.push("Legacy hub-hotspots.json configuration migrated automatically. Please move to customer-artworks/museum-hub.json.");const t=ds(),n=[],r=new Set,s=Ta(0);let a=0;for(const o of i){if(!o||typeof o!="object"){e.push("legacy hotspot ignored: not an object.");continue}const l=o,c=typeof l.artworkId=="string"?l.artworkId.trim():"",d=typeof l.cx=="number"&&Number.isFinite(l.cx)?bt(l.cx):NaN,u=typeof l.cy=="number"&&Number.isFinite(l.cy)?bt(l.cy):NaN,h=typeof l.w=="number"&&Number.isFinite(l.w)?bt(l.w):NaN,m=typeof l.h=="number"&&Number.isFinite(l.h)?bt(l.h):NaN;if(!c||/^@order:/.test(c)||[d,u,h,m].some(Number.isNaN)){e.push(`legacy hotspot "${c||"?"}" could not be migrated.`);continue}const _=s.find(p=>!r.has(p.id)&&Math.abs(p.placement.center.x-d)<.12&&Math.abs(p.placement.center.y-u)<.12),g=_?_.id:`${Vl(0)}.legacy-${a+=1}`;if(r.has(g))continue;r.add(g);const f=Yl({cx:d,cy:u,maxH:m},g,t,an);n.push({id:g,enabled:!0,selectable:!0,artworkId:c,placement:f})}return n.length===0?{config:null,warnings:e,source:"built-in-default"}:{config:{version:3,coverage:"all-active-artworks",stage:{...an},background:{src:Ri,aspect:Ma},backgroundFallback:{src:Ri},visualTokens:wa(),camera:ar(ls),walls:t,fallbacks:Ca(void 0),slots:n},warnings:e,source:"legacy-migrated"}}function _g(i,e,t){var Z,$,ue,he;let n=jl(e);if(!n.config){const L=gg(t);L.config&&(n={...L,warnings:[...n.warnings,...L.warnings]})}const r=[...n.warnings];let s=n.config?n.source:"built-in-default",a;n.config?a=n.config:(a={version:3,coverage:"all-active-artworks",stage:{...an},background:{src:Ri,aspect:Ma},backgroundFallback:{src:Ri},visualTokens:wa(),camera:ar(ls),walls:ds(),fallbacks:Ca(void 0),slots:Ta(0).map(L=>{const ee=ig[L.id];return ee!==void 0&&i.some(X=>X.id===ee)?{...L,artworkId:ee}:L})},s="built-in-default");const o=Xl(a.stage),l=a.visualTokens,c=a.background,d=a.backgroundFallback,u=a.camera?ar(a.camera):ar(ls),h=a.fallbacks.selectionTimeoutMs,m=a.fallbacks.autoPlaceUnmapped,_=[];for(const L of a.walls){const ee=$l(L.quad),se=L.safePolygon?On(L.safePolygon):On(ha(ee,.92));let X=L.room?Ea(L.room):void 0,Y=null,ae=null,oe={x:1,y:1},_e;const Ie=rg(ee);if(X){const Oe=Ym(X,ee,se,u,o,Ie);Oe?(X=Oe.room,Y=Oe.projectedQuad,ae=Oe.projectedSafePolygon,oe={x:Oe.scaleX,y:Oe.scaleY},_e=Oe.realism):(r.push(`wall "${L.id}": room plane could not be reconciled to the reference quad; using the stored room transform.`),Y=Nl(X,u,o),ae=xa(X,u,X.safePolygon,o),Y&&(_e=Bl(X,Y,ee,ae,se,Ie))),_e&&!_e.passes&&r.push(`wall "${L.id}": projection realism failed (max residual ${_e.referenceResidualMaxPx.toFixed(1)}px, axis dot ${_e.axisDot.toFixed(3)}, convergence ${_e.projectedConvergence}).`)}const Ge=ee,tt=se,I=Ci(Ge),ot=I?is(I):null;if(!I||!ot){r.push(`wall "${L.id}" could not build a homography and will be ignored.`);continue}_.push({id:L.id,group:L.group,planeAspect:L.planeAspect,quad:Ge,safePolygon:tt,shadowVector:L.shadowVector?xt(L.shadowVector):void 0,room:X,camera:X?u:void 0,referenceQuad:ee,referenceSafePolygon:se,projectedQuad:Y,projectedSafePolygon:ae,localCalibrationScale:oe,projectionRealism:_e,expectedConvergence:Ie,homography:I,inverseHomography:ot})}const g=new Map(_.map(L=>[L.id,L])),f=new Map;i.forEach((L,ee)=>f.set(L.id,ee));const p=new Set,y=[],M=[];for(const L of a.slots){const ee=Math.max(0,vg(L.id)),se=g.get(L.placement.wallId),X=(Z=se==null?void 0:se.group)!=null?Z:L.placement.wallId.includes("right")?"right":"left",Y=($=se==null?void 0:se.localCalibrationScale)!=null?$:{x:1,y:1};se!=null&&se.room&&!L.placement.anchor&&r.push(`slot "${L.id}": room-local anchor missing; deriving it from the normalized center for calibrated placement.`);const ae=(ue=L.placement.anchor?K(L.placement.anchor.x*Y.x,L.placement.anchor.y*Y.y):void 0)!=null?ue:se!=null&&se.room?K(L.placement.center.x*se.room.width,(1-L.placement.center.y)*se.room.height):void 0,oe={id:L.id,pageIndex:ee,placement:{wallId:L.placement.wallId,center:xt(L.placement.center),mountedHeight:se!=null&&se.room?L.placement.mountedHeight*Y.y:L.placement.mountedHeight,anchor:ae?xt(ae):void 0,provisional:L.placement.provisional===!0},wallGroup:X};if(!L.enabled){y.push({...oe,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"explicitly-disabled",mappingSource:"explicit",artworkAspect:1});continue}if(!se){r.push(`slot "${L.id}" references unknown wall "${L.placement.wallId}"; slot disabled.`),y.push({...oe,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"missing-wall",mappingSource:"explicit",artworkAspect:1});continue}if(L.artworkId){const _e=f.get(L.artworkId);if(_e===void 0){r.push(`slot "${L.id}": artwork ID "${L.artworkId}" not in the active manifest; slot disabled.`),y.push({...oe,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"invalid-mapping",mappingSource:"explicit",artworkAspect:1});continue}if(p.has(L.artworkId)){r.push(`slot "${L.id}": artwork "${L.artworkId}" is already mapped; duplicate slot disabled.`),y.push({...oe,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!1,disabledReason:"duplicate-mapping",mappingSource:"explicit",artworkAspect:1});continue}p.add(L.artworkId);const Ie=i[_e];y.push({...oe,artworkId:L.artworkId,artworkIndex:_e,displayLabel:Ie.title,selectable:L.selectable,disabledReason:L.selectable?null:"explicitly-disabled",mappingSource:"explicit",artworkAspect:us(Ie)});continue}M.push({...oe,artworkId:null,artworkIndex:-1,displayLabel:"",selectable:L.selectable,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1})}const E=m?i.filter(L=>!p.has(L.id)):[],R=new Map(Sa.map(L=>[L.suffix,L.intendedUse])),T=L=>{const ee=L.id.replace(/^room-\d+\./,"");return R.get(ee)},A=(L,ee)=>{L.artworkId=ee.id,L.artworkIndex=f.get(ee.id),L.displayLabel=ee.title,L.artworkAspect=us(ee),p.add(ee.id)},N=[];for(const L of E){const ee=Wl(us(L)),se=M.findIndex(X=>X.selectable&&!X.artworkId&&T(X)===ee);se>=0?A(M[se],L):N.push(L)}for(const L of N){const ee=M.find(se=>se.selectable&&!se.artworkId);ee&&A(ee,L)}for(const L of M)L.artworkId&&y.push(L);let S=i.filter(L=>!p.has(L.id));if(m&&S.length>0){let L=y.reduce((ee,se)=>Math.max(ee,se.pageIndex),0)+1;for(;S.length>0;){const ee=Ta(L).map(Y=>{var _e;const ae=g.get(Y.placement.wallId),oe=(_e=ae==null?void 0:ae.localCalibrationScale)!=null?_e:{x:1,y:1};return{id:Y.id,pageIndex:L,placement:{wallId:Y.placement.wallId,center:xt(Y.placement.center),mountedHeight:ae!=null&&ae.room?Y.placement.mountedHeight*oe.y:Y.placement.mountedHeight,anchor:ae!=null&&ae.room&&Y.placement.anchor?K(Y.placement.anchor.x*oe.x,Y.placement.anchor.y*oe.y):Y.placement.anchor?xt(Y.placement.anchor):void 0,provisional:!1},artworkId:null,artworkIndex:-1,displayLabel:"",selectable:!0,disabledReason:null,mappingSource:"auto-placed",artworkAspect:1,wallGroup:Y.placement.wallId.includes("right")?"right":"left"}}),se=S.slice(0,Jm),X=new Set;for(const Y of se){const ae=Wl(us(Y)),oe=ee.find(Ie=>!Ie.artworkId&&T(Ie)===ae&&!X.has(Ie.id)),_e=oe!=null?oe:ee.find(Ie=>!Ie.artworkId);X.add(_e.id),A(_e,Y)}y.push(...ee.filter(Y=>Y.artworkId)),S=i.filter(Y=>!p.has(Y.id)),L+=1}}for(const L of y){if(!L.selectable||!L.artworkId)continue;const ee=g.get(L.placement.wallId);if(!ee)continue;const se=og(ee,L.placement,L.artworkAspect,o);se.adjusted&&(L.placement.center=se.center,se.anchor&&(L.placement.anchor=se.anchor),L.placement.mountedHeight=se.mountedHeight,L.placement.provisional&&r.push(`slot "${L.id}": provisional placement was clamped to the wall drawable region.`))}const x=new Map;for(const L of y){if(!L.selectable||!L.artworkId)continue;const ee=g.get(L.placement.wallId);if(!ee)continue;if(ee.projectionRealism&&!ee.projectionRealism.passes){L.selectable=!1,L.disabledReason="projection-realism",r.push(`slot "${L.id}": wall projection realism rejected runtime composition.`);continue}const se=as(ee,L.placement,L.artworkAspect,o);if(x.set(L.id,se),!se){L.selectable=!1,L.disabledReason="invalid-projection",r.push(`slot "${L.id}": projected geometry is invalid and the slot was suppressed.`);continue}if(!se.projectedQuad.every(Y=>Hn(Y,ee.safePolygon))){L.selectable=!1,L.disabledReason="invalid-placement",r.push(`slot "${L.id}": projected artwork bounds extend outside wall safePolygon and the slot was suppressed.`),x.delete(L.id);continue}se.shortEdge<os&&r.push(`slot "${L.id}": projected short edge ${se.shortEdge.toFixed(1)}px is below the ${os}px desktop guidance.`),L.placement.provisional&&r.push(`slot "${L.id}": placement was migrated provisionally and should be recalibrated.`)}const P=new Map;for(const L of y){const ee=(he=P.get(L.pageIndex))!=null?he:[];ee.push(L),P.set(L.pageIndex,ee)}const V=[...P.entries()].sort((L,ee)=>L[0]-ee[0]).map(([L,ee])=>({pageIndex:L,slots:ee}));for(const L of V){const ee=L.slots.filter(se=>se.selectable&&se.artworkId);for(let se=0;se<ee.length;se+=1){const X=ee[se],Y=x.get(X.id);if(Y)for(let ae=se+1;ae<ee.length;ae+=1){const oe=ee[ae],_e=x.get(oe.id);_e&&ua(Y.projectedQuad,_e.projectedQuad)&&r.push(`page ${L.pageIndex+1}: slot "${X.id}" overlaps slot "${oe.id}".`)}}}const k=new Map,z=new Map;for(const L of y)L.selectable&&L.artworkId&&(k.set(L.id,L.artworkId),z.set(L.artworkId,L.id));const j=i.filter(L=>!z.has(L.id)).length;j>0&&m&&r.push(`${j} active artwork(s) without a selectable slot.`);const D=new Map;for(const L of i)D.set(L.id,L.image);return{pages:V,slotToArtwork:k,artworkToSlot:z,artworkImageById:D,background:c,backgroundFallback:d,stage:o,visualTokens:l,camera:u,walls:_,wallById:g,selectionTimeoutMs:h,source:s,warnings:r,unmappedArtworkCount:j}}function vg(i){const e=/^room-(\d+)\./.exec(i);if(!e)return 0;const t=Number.parseInt(e[1],10);return Number.isFinite(t)&&t>=1?t-1:0}async function xg(i,e){if(typeof window=="undefined"||typeof window.fetch!="function")return{ok:null,status:null,reason:"unsupported"};let t="";try{t=new URL(i,window.location.href).protocol}catch(s){return{ok:null,status:null,reason:"unsupported"}}if(t!=="http:"&&t!=="https:")return{ok:null,status:null,reason:"unsupported"};const n=typeof AbortController=="function"?new AbortController:null,r=window.setTimeout(()=>n==null?void 0:n.abort(),Math.max(250,Math.min(e,4e3)));try{const s=await window.fetch(i,{method:"HEAD",cache:"no-store",signal:n==null?void 0:n.signal});return s.status===405||s.status===501?{ok:null,status:s.status,reason:"unsupported"}:{ok:s.ok,status:s.status,reason:s.ok?"ok":"http-error"}}catch(s){return s instanceof DOMException&&s.name==="AbortError"?{ok:null,status:null,reason:"probe-timeout"}:{ok:null,status:null,reason:"network-error"}}finally{window.clearTimeout(r)}}function yg(i,e,t){return new Promise(n=>{let r=!1;const s=c=>{r||(r=!0,window.clearTimeout(l),i.removeEventListener("load",a),i.removeEventListener("error",o),n({status:c}))},a=()=>s("loaded"),o=()=>s("error"),l=window.setTimeout(()=>s("timeout"),t);i.addEventListener("load",a),i.addEventListener("error",o),i.src=e})}function Kl(i){return i===null?"http-error":ya(i)?"http-404":`http-${i}`}function Zl(i,e,t,n){var r,s,a;return{assetRole:i.role,attempt:e.role,path:e.path,url:e.url,primaryPath:i.primaryPath,primaryUrl:i.primaryUrl,fallbackPath:(r=i.fallbackPath)!=null?r:null,fallbackUrl:(s=i.fallbackUrl)!=null?s:null,httpStatus:n,reason:t,referenceOnly:ba(e.path),context:(a=i.context)!=null?a:null}}function bg(i,e){var n;const t=Qm(i.primaryUrl,(n=i.fallbackUrl)!=null?n:"",e);return!t||!i.fallbackPath?null:{role:"fallback",path:i.fallbackPath,url:t}}function Mg(i,e,t,n){const r=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":ya(n)?"returned 404":`returned ${Kl(n)}`;i.diagnostics.warn("hub-asset-missing",`Hub ${i.role} asset ${r}; retrying shipped fallback without aborting`,Zl(i,e,t,n))}function Sg(i,e,t,n){const r=t==="timeout"||t==="probe-timeout"?"timed out":t==="network-error"?"could not be reached":ya(n)?"returned 404":`returned ${Kl(n)}`;i.diagnostics.warn("hub-asset-fallback-failed",e.role==="fallback"?`Hub ${i.role} asset and fallback ${r}; continuing with neutral museum-grey surface`:`Hub ${i.role} asset ${r}; continuing with neutral museum-grey surface`,Zl(i,e,t,n))}async function wg(i,e){const t=await xg(e.url,i.timeoutMs);if(t.ok===!1)return{status:"failed",reason:"http-error",httpStatus:t.status};const n=await yg(i.image,e.url,i.timeoutMs);return n.status==="loaded"?{status:"loaded",httpStatus:t.status}:n.status==="timeout"?{status:"failed",reason:t.reason==="probe-timeout"?"probe-timeout":"timeout",httpStatus:t.status}:t.reason==="network-error"?{status:"failed",reason:"network-error",httpStatus:t.status}:{status:"failed",reason:"image-error",httpStatus:t.status}}async function Eg(i){var r,s;let e={role:"primary",path:i.primaryPath,url:i.primaryUrl},t=!1,n=null;for(;e;){const a=await wg(i,e);if(a.status==="loaded")return{status:e.role==="primary"?"loaded":"fallback-loaded",finalPath:e.path,finalUrl:e.url,httpStatus:a.httpStatus};n=a.httpStatus;const o=bg(i,t);if(e.role==="primary"&&o){t=!0,Mg(i,e,a.reason,a.httpStatus),e=o;continue}return Sg(i,e,a.reason,a.httpStatus),(r=i.onNeutralFallback)==null||r.call(i),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}return(s=i.onNeutralFallback)==null||s.call(i),{status:"neutral-fallback",finalPath:null,finalUrl:null,httpStatus:n}}const Ql=window.location.protocol==="file:"?"../customer-artworks/":"/",Jl=5e3,Tg="(max-aspect-ratio: 4/5)",Ag=()=>{try{return new URLSearchParams(window.location.search).get("hubCalibrate")==="1"}catch(i){return!1}},Cg=()=>{try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(i){return!1}};function ec(i){return window.location.protocol==="file:"?`${Ql}${i}`:`${Ql}${i.replace(/^Backgrounds\//,"backgrounds/")}`}class Rg{constructor(e,t){v(this,"element");v(this,"diagnostics",$t("hub"));v(this,"resolution");v(this,"visual");v(this,"stage");v(this,"roomLayers",[]);v(this,"slotViews",[]);v(this,"entryButton");v(this,"status");v(this,"pager");v(this,"pagerPrev");v(this,"pagerNext");v(this,"pagerCounter");v(this,"narrowQuery");v(this,"imageReady");v(this,"calibrating");v(this,"debugGeometry");v(this,"stageWidth");v(this,"stageHeight");v(this,"resizeObserver");v(this,"calibrationOutput",null);v(this,"calibrationWarnings",null);v(this,"calibrationRestoreButton",null);v(this,"calibrationWallSelect",null);v(this,"calibrationSvg",null);v(this,"calibrationDrag",null);v(this,"activeCalibrationWallId",null);v(this,"lastValidCalibrationSnapshot",null);v(this,"activateCallback",null);v(this,"selectSlotCallback",null);v(this,"disposed",!1);v(this,"pageCount",1);v(this,"viewIndex",0);v(this,"narrowMode",!1);v(this,"lastActivatedSlotId",null);v(this,"selectedArtworkId",null);v(this,"lastSelectionSignature",null);v(this,"decodedPages",new Set);v(this,"idleDecodeHandle",null);v(this,"idleDecodeNextPage",1);v(this,"projectedSlotGeometry",new Map);v(this,"debugProjectionSignatureBySlot",new Map);v(this,"swipeStartX",null);v(this,"swipeStartY",null);v(this,"resizeRafId",0);v(this,"handleActivate",()=>{var e;this.entryButton.disabled||(this.setButtonsDisabled(!0),(e=this.activateCallback)==null||e.call(this))});v(this,"handleNarrowChange",()=>{const e=this.narrowMode;if(this.narrowMode=this.narrowQuery.matches,e!==this.narrowMode){const t=e?Math.floor(this.viewIndex/2):this.viewIndex;this.viewIndex=this.narrowMode?t*2:t,this.applyView()}});v(this,"handleResize",()=>{this.resizeRafId===0&&(this.resizeRafId=requestAnimationFrame(()=>{this.resizeRafId=0,this.updateStageScale(),this.applyView(),this.applyAllSlotGeometry(),this.debugGeometry&&this.emitDebugGeometrySnapshot("resize")}))});v(this,"handleKeydown",e=>{this.calibrating||(e.key==="ArrowLeft"?(this.stepView(-1),e.preventDefault()):e.key==="ArrowRight"&&(this.stepView(1),e.preventDefault()))});v(this,"handleSwipeStart",e=>{this.calibrating||(this.swipeStartX=e.clientX,this.swipeStartY=e.clientY)});v(this,"handleSwipeEnd",e=>{if(this.swipeStartX===null||this.swipeStartY===null)return;const t=e.clientX-this.swipeStartX,n=e.clientY-this.swipeStartY;this.swipeStartX=null,this.swipeStartY=null,!(Math.abs(t)<56||Math.abs(t)<Math.abs(n)*1.4)&&this.stepView(t<0?1:-1)});v(this,"handleCalibrationMove",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;const n=this.pointerEventToStage(e);if(n){if(t.kind==="slot"){const r=this.resolution.wallById.get(t.slot.placement.wallId);if(!r)return;const s=r.inverseHomography?this.applyInverseHomography(r,n):null;if(!s)return;if(t.mode==="move")t.slot.placement.center=K(this.clampLocalX(s.x),this.clampLocalY(s.y)),r.room&&(t.slot.placement.anchor=K(t.slot.placement.center.x*r.room.width,(1-t.slot.placement.center.y)*r.room.height));else{const a=Math.abs(s.y-t.slot.placement.center.y)*2;t.slot.placement.mountedHeight=r.room?Math.max(.12,Math.min(r.room.height,a*r.room.height)):Math.max(.04,Math.min(.9,a))}this.applySlotGeometry(t.button,t.slot)}else{const r=this.resolution.wallById.get(t.wallId);if(!r)return;const a=(t.target==="quad"?r.quad:r.safePolygon)[t.index];if(!a)return;a.x=n.x,a.y=n.y,this.applyAllSlotGeometry()}this.renderCalibrationOverlay(),this.updateCalibrationOutput(!1)}});v(this,"handleCalibrationEnd",e=>{const t=this.calibrationDrag;if(!t||e.pointerId!==t.pointerId)return;this.calibrationDrag=null;const n=e.currentTarget;n==null||n.removeEventListener("pointermove",this.handleCalibrationMove),n==null||n.removeEventListener("pointerup",this.handleCalibrationEnd),n==null||n.removeEventListener("pointercancel",this.handleCalibrationEnd),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)});var A,N,S;this.resolution=t,this.calibrating=Ag(),this.debugGeometry=Cg(),this.pageCount=Math.max(1,t.pages.length),this.stageWidth=t.stage.width,this.stageHeight=t.stage.height,this.activeCalibrationWallId=(N=(A=t.walls[0])==null?void 0:A.id)!=null?N:null;const n=document.createElement("section");n.className="museum-hub",n.setAttribute("aria-labelledby","museum-hub-title"),n.style.setProperty("--hub-aspect",String(t.background.aspect)),n.style.setProperty("--hub-stage-width",`${this.stageWidth}px`),n.style.setProperty("--hub-stage-height",`${this.stageHeight}px`),n.style.setProperty("--hub-stage-scale","1"),this.calibrating&&n.classList.add("is-calibrating"),this.debugGeometry&&n.classList.add("is-debug-geometry");const r=document.createElement("div");r.className="museum-hub__visual";const s=document.createElement("div");s.className="museum-hub__stage";const a=document.createElement("img");a.className="museum-hub__image",a.alt="",a.decoding="async",a.draggable=!1;const o=ec(t.background.src),l=ec(t.backgroundFallback.src),c=Eg({image:a,role:"background",primaryPath:t.background.src,primaryUrl:o,fallbackPath:t.backgroundFallback.src,fallbackUrl:l,timeoutMs:Jl,diagnostics:this.diagnostics,context:{hubSource:t.source,stage:`${t.stage.width}x${t.stage.height}`,selectableSlots:t.slotToArtwork.size},onNeutralFallback:()=>{n.classList.add("has-image-error")}}).then(x=>{if(x.status==="neutral-fallback"){n.classList.add("has-image-error");return}n.classList.remove("has-image-error")}).catch(x=>{n.classList.add("has-image-error"),this.diagnostics.warn("hub-asset-loader-unexpected","Hub background loader threw unexpectedly; continuing with neutral museum-grey surface",{primaryPath:t.background.src,fallbackPath:t.backgroundFallback.src,error:x})});s.appendChild(a);const d=document.createElement("div");d.className="museum-hub__shade",d.setAttribute("aria-hidden","true");const u=document.createElement("header");u.className="museum-hub__header";const h=document.createElement("p");h.className="museum-hub__eyebrow",h.textContent="FREYRAUM";const m=document.createElement("h1");m.id="museum-hub-title",m.className="museum-hub__title",m.textContent="Museum";const _=document.createElement("p");_.className="museum-hub__introduction",_.textContent="Wählen Sie ein Kunstwerk, um die Ausstellung zu betreten.",u.append(h,m,_);const g=document.createElement("button");g.className="museum-hub__destination",g.type="button",g.setAttribute("aria-describedby","museum-hub-entry-description"),g.innerHTML=`
      <span class="museum-hub__destination-frame" aria-hidden="true"></span>
      <span class="museum-hub__destination-label">Ausstellung betreten</span>
    `;const f=document.createElement("p");f.id="museum-hub-entry-description",f.className="sr-only",f.textContent="Öffnet die interaktive Galerie mit Navigation, Detailansicht und Informationen zu den Kunstwerken.";const p=document.createElement("p");p.className="museum-hub__status sr-only",p.setAttribute("role","status"),p.setAttribute("aria-live","polite");const y=document.createElement("nav");y.className="museum-hub__pager",y.setAttribute("aria-label","Museumsräume");const M=document.createElement("button");M.type="button",M.className="museum-hub__pager-arrow museum-hub__pager-arrow--prev",M.setAttribute("aria-label","Vorherige Wand"),M.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';const E=document.createElement("span");E.className="museum-hub__pager-counter",E.setAttribute("aria-live","polite");const R=document.createElement("button");R.type="button",R.className="museum-hub__pager-arrow museum-hub__pager-arrow--next",R.setAttribute("aria-label","Nächste Wand"),R.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',y.append(M,E,R),s.appendChild(g),r.appendChild(s),n.append(r,d,u,f,y,p),e.appendChild(n),this.element=n,this.visual=r,this.stage=s,this.entryButton=g,this.status=p,this.pager=y,this.pagerPrev=M,this.pagerNext=R,this.pagerCounter=E,this.entryButton.addEventListener("click",this.handleActivate),M.addEventListener("click",()=>this.stepView(-1)),R.addEventListener("click",()=>this.stepView(1)),this.buildSlots();const T=this.resolution.slotToArtwork.size>0;this.entryButton.hidden=T,this.narrowQuery=window.matchMedia(Tg),this.narrowMode=this.narrowQuery.matches,this.narrowQuery.addEventListener("change",this.handleNarrowChange),this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.handleResize()):null,(S=this.resizeObserver)==null||S.observe(this.visual),window.addEventListener("resize",this.handleResize),n.addEventListener("pointerdown",this.handleSwipeStart,{passive:!0}),n.addEventListener("pointerup",this.handleSwipeEnd,{passive:!0}),n.addEventListener("keydown",this.handleKeydown),(this.calibrating||this.debugGeometry)&&(this.buildCalibrationOverlay(),this.calibrating&&this.buildCalibrationPanel(n),this.renderCalibrationOverlay()),this.imageReady=Promise.all([c,this.decodePageImages(0)]).then(()=>{this.applyView(!0),this.updateStageScale(),this.applyAllSlotGeometry(),this.applySelectionState("composition-ready"),this.scheduleIdlePageDecode(),this.calibrating&&this.updateCalibrationOutput(!0),this.debugGeometry&&this.emitDebugGeometrySnapshot("composition-ready"),this.diagnostics.info("composition-ready","Hub composition prepared",{pages:this.pageCount,selectableSlots:this.resolution.slotToArtwork.size,source:this.resolution.source,debugGeometry:this.debugGeometry})})}onActivate(e){this.activateCallback=e}onSelectSlot(e){this.selectSlotCallback=e}setSelectedArtworkId(e,t={}){var s;const n=e&&this.resolution.artworkToSlot.has(e)?e:null;this.selectedArtworkId=n;const r=n?this.slotViews.find(a=>a.slot.artworkId===n&&!a.button.disabled):void 0;r&&t.alignPage!==!1&&this.goToPage(r.slot.pageIndex,r.slot),this.applySelectionState((s=t.source)!=null?s:"external-selection-sync",{restoreFocus:t.restoreFocus===!0})}prepare(){return this.imageReady}enter(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="",this.scheduleIdlePageDecode(),this.applySelectionState("enter"),requestAnimationFrame(()=>this.focusInitialTarget()))}async exit(e){this.disposed||(this.cancelIdlePageDecode(),this.setButtonsDisabled(!0),this.status.textContent="Ausstellung wird geöffnet.",this.element.classList.add("is-exiting"),e||await new Promise(t=>window.setTimeout(t,520)),this.disposed||(this.element.hidden=!0))}showError(){this.disposed||(this.element.hidden=!1,this.element.classList.remove("is-exiting"),this.setButtonsDisabled(!1),this.status.textContent="Die Ausstellung konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",this.focusInitialTarget())}focusInitialTarget(){var r;const e=this.selectedArtworkId?this.slotViews.find(s=>s.slot.artworkId===this.selectedArtworkId&&!s.button.disabled):void 0;if(e){this.goToPage(e.slot.pageIndex,e.slot),e.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-selected-target");return}const t=this.lastActivatedSlotId?this.slotViews.find(s=>s.slot.id===this.lastActivatedSlotId&&!s.button.disabled):void 0;if(t){this.goToPage(t.slot.pageIndex,t.slot),t.button.focus({preventScroll:!0}),this.logSelectionLifecycle("focus-restored-slot");return}const n=this.slotViews.find(s=>s.slot.selectable);((r=n==null?void 0:n.button)!=null?r:this.entryButton).focus({preventScroll:!0}),this.logSelectionLifecycle("focus-first-target")}applySelectionState(e,t={}){var s,a;let n;for(const o of this.slotViews){const l=!!this.selectedArtworkId&&o.slot.artworkId===this.selectedArtworkId;o.button.classList.toggle("is-selected",l),l?(o.button.setAttribute("aria-current","true"),n=o):o.button.removeAttribute("aria-current")}const r=`${e}:${(s=this.selectedArtworkId)!=null?s:"none"}:${(a=n==null?void 0:n.slot.id)!=null?a:"none"}:${this.viewIndex}`;this.lastSelectionSignature!==r&&(this.lastSelectionSignature=r,this.logSelectionLifecycle(e)),t.restoreFocus&&n&&n.button.focus({preventScroll:!0})}logSelectionLifecycle(e){var n,r,s;const t=this.selectedArtworkId?this.slotViews.find(a=>a.slot.artworkId===this.selectedArtworkId):void 0;this.diagnostics.info("hub-selection-lifecycle","Hub selection lifecycle updated",{reason:e,selectedArtworkId:this.selectedArtworkId,selectedSlotId:(n=t==null?void 0:t.slot.id)!=null?n:null,selectedPageIndex:(r=t==null?void 0:t.slot.pageIndex)!=null?r:null,currentViewIndex:this.viewIndex,currentWallFocus:(s=this.element.dataset.wallFocus)!=null?s:"full",lastActivatedSlotId:this.lastActivatedSlotId,renderedSlots:this.slotViews.length})}setButtonsDisabled(e){this.entryButton.disabled=e;for(const t of this.slotViews)t.button.disabled=e||!t.slot.selectable;e?(this.pagerPrev.disabled=!0,this.pagerNext.disabled=!0):(this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1)}buildSlots(){const e=document.createElement("div");e.className="museum-hub__rooms";for(const t of this.resolution.pages){const n=document.createElement("div");n.className="museum-hub__room",n.dataset.page=String(t.pageIndex);for(const r of t.slots){if(!this.calibrating&&!this.debugGeometry&&(!r.selectable||!r.artworkId))continue;const s=this.buildSlotButton(r);n.appendChild(s.button),this.slotViews.push(s)}e.appendChild(n),this.roomLayers.push(n)}this.stage.appendChild(e)}buildSlotButton(e){const t=document.createElement("button");t.type="button",t.className="museum-hub__artwork",t.dataset.slotId=e.id,e.artworkId&&(t.dataset.artworkId=e.artworkId);let n=null;if(e.selectable&&e.artworkId){t.setAttribute("aria-label",`Kunstwerk „${e.displayLabel}“ in der Ausstellung öffnen`),n=document.createElement("img"),n.className="museum-hub__art",n.alt="",n.decoding="async",n.draggable=!1,n.addEventListener("error",()=>{t.classList.add("has-missing-image"),this.diagnostics.warn("artwork-image-missing","Hub artwork image failed; neutral placeholder retains exact target",{slotId:e.id,artworkId:e.artworkId})}),t.appendChild(n);const s=document.createElement("span");s.className="museum-hub__art-placeholder",s.textContent=e.displayLabel,t.appendChild(s)}else t.disabled=!0,t.classList.add("is-disabled-slot"),t.setAttribute("aria-label","Nicht verfügbarer Ausstellungsplatz"),t.setAttribute("aria-disabled","true");const r=document.createElement("span");if(r.className="museum-hub__artwork-label",r.setAttribute("aria-hidden","true"),r.textContent=this.calibrating||this.debugGeometry?`${e.id} · ${e.displayLabel}`:e.displayLabel,t.appendChild(r),this.calibrating){const s=document.createElement("span");s.className="museum-hub__artwork-handle",s.setAttribute("aria-hidden","true"),t.appendChild(s),t.disabled=!1,t.addEventListener("pointerdown",a=>{const o=a.target;this.startSlotCalibrationDrag(a,e,t,o!=null&&o.classList.contains("museum-hub__artwork-handle")?"resize":"move")})}else e.selectable&&t.addEventListener("click",()=>this.handleSlotClick(e));return this.applySlotGeometry(t,e),{slot:e,button:t,image:n}}applySlotGeometry(e,t){var a;const n=this.resolution.wallById.get(t.placement.wallId);if(!n){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),this.diagnostics.warn("hub-slot-missing-wall","Hub slot geometry skipped because the wall is missing",{slotId:t.id,wallId:t.placement.wallId});return}const r=as(n,t.placement,Math.max(.25,t.artworkAspect),this.resolution.stage);if(!r){e.classList.add("is-invalid-geometry"),this.projectedSlotGeometry.delete(t.id),this.diagnostics.warn("hub-slot-projection-invalid","Hub slot projection is invalid and will not render interactively",{slotId:t.id,artworkId:t.artworkId,wallId:n.id,projectionRealism:n.projectionRealism});return}this.projectedSlotGeometry.set(t.id,r),e.classList.remove("is-invalid-geometry"),e.style.left="0px",e.style.top="0px",e.style.width=`${r.sourceWidth}px`,e.style.height=`${r.sourceHeight}px`,e.style.transform=r.cssMatrix3d;const s=(a=n.shadowVector)!=null?a:K(n.group==="left"?-10:10,16);e.style.setProperty("--hub-shadow-x",`${s.x}px`),e.style.setProperty("--hub-shadow-y",`${s.y}px`),this.debugGeometry&&this.logSlotProjection(t,n,r)}applyAllSlotGeometry(){for(const e of this.slotViews)this.applySlotGeometry(e.button,e.slot);this.applySelectionState("geometry-refresh"),(this.calibrating||this.debugGeometry)&&this.renderCalibrationOverlay()}logSlotProjection(e,t,n){var a,o,l,c;const r=n.projectedQuad.map(d=>`${d.x.toFixed(1)},${d.y.toFixed(1)}`).join("|");if(this.debugProjectionSignatureBySlot.get(e.id)===r)return;this.debugProjectionSignatureBySlot.set(e.id,r);const s=n.projectedQuad.every(d=>Hn(d,t.safePolygon));this.diagnostics.info("hub-debug-slot-projection","Projected slot geometry snapshot",{slotId:e.id,wallId:t.id,selectedArtworkId:this.selectedArtworkId,localAnchor:(a=e.placement.anchor)!=null?a:null,localQuad:n.localQuad,projectedQuad:n.projectedQuad,homography:t.homography,inverseHomography:t.inverseHomography,withinSafePolygon:s,shortEdgePx:Math.round(n.shortEdge*100)/100,placement:n.placement,validity:(o=n.validity)!=null?o:null,realism:(c=(l=n.realism)!=null?l:t.projectionRealism)!=null?c:null})}emitDebugGeometrySnapshot(e){if(!this.debugGeometry)return;const t=this.slotViews.filter(({slot:n})=>n.selectable&&!!n.artworkId).map(({slot:n})=>{var a,o,l,c,d;const r=this.resolution.wallById.get(n.placement.wallId),s=this.projectedSlotGeometry.get(n.id);return{slotId:n.id,wallId:n.placement.wallId,localQuad:(a=s==null?void 0:s.localQuad)!=null?a:null,projectedQuad:(o=s==null?void 0:s.projectedQuad)!=null?o:null,homography:(l=r==null?void 0:r.homography)!=null?l:null,inverseHomography:(c=r==null?void 0:r.inverseHomography)!=null?c:null,withinSafePolygon:r&&s?s.projectedQuad.every(u=>Hn(u,r.safePolygon)):!1,validity:(d=s==null?void 0:s.validity)!=null?d:null}});this.diagnostics.info("hub-debug-geometry","Hub debug geometry snapshot",{reason:e,stage:this.resolution.stage,visualTokens:this.resolution.visualTokens,backgroundState:{imageError:this.element.classList.contains("has-image-error")},selection:{selectedArtworkId:this.selectedArtworkId,lastActivatedSlotId:this.lastActivatedSlotId},walls:this.resolution.walls.map(n=>({id:n.id,group:n.group,quad:n.quad,safePolygon:n.safePolygon,referenceQuad:n.referenceQuad,referenceSafePolygon:n.referenceSafePolygon,projectedQuad:n.projectedQuad,projectedSafePolygon:n.projectedSafePolygon,projectedDoorways:n.room&&n.camera?Fl(n.room,n.camera,this.resolution.stage):[],projectionRealism:n.projectionRealism,expectedConvergence:n.expectedConvergence})),slots:t})}scheduleIdlePageDecode(){if(this.disposed||this.idleDecodeHandle!==null)return;for(;this.idleDecodeNextPage<this.pageCount&&this.decodedPages.has(this.idleDecodeNextPage);)this.idleDecodeNextPage+=1;if(this.idleDecodeNextPage>=this.pageCount)return;const e=typeof window.requestIdleCallback=="function"?t=>window.requestIdleCallback(t,{timeout:4e3}):t=>window.setTimeout(t,600);this.idleDecodeHandle=e(()=>{if(this.idleDecodeHandle=null,this.disposed)return;const t=this.idleDecodeNextPage;this.idleDecodeNextPage+=1,this.decodePageImages(t).then(()=>this.scheduleIdlePageDecode())})}cancelIdlePageDecode(){this.idleDecodeHandle!==null&&(typeof window.cancelIdleCallback=="function"?window.cancelIdleCallback(this.idleDecodeHandle):window.clearTimeout(this.idleDecodeHandle),this.idleDecodeHandle=null)}decodePageImages(e){if(this.decodedPages.has(e))return Promise.resolve();this.decodedPages.add(e);const t=[];for(const n of this.slotViews){if(n.slot.pageIndex!==e||!n.image||!n.slot.artworkId)continue;const r=this.artworkImageSrc(n.slot);if(!r){n.button.classList.add("has-missing-image");continue}n.image.src=r,t.push(new Promise(s=>{const a=window.setTimeout(s,Jl),o=()=>{window.clearTimeout(a),s()};if(n.image.complete&&n.image.naturalWidth>0){o();return}n.image.addEventListener("load",o,{once:!0}),n.image.addEventListener("error",o,{once:!0})}))}return Promise.all(t).then(()=>{})}artworkImageSrc(e){const t=e.artworkId?this.resolution.artworkImageById.get(e.artworkId):void 0;return t!=null?t:null}handleSlotClick(e){var t;this.entryButton.disabled||(this.setButtonsDisabled(!0),this.lastActivatedSlotId=e.id,this.setSelectedArtworkId(e.artworkId,{alignPage:!1,source:"slot-click"}),this.status.textContent="Ausstellung wird geöffnet.",(t=this.selectSlotCallback)==null||t.call(this,e))}get viewCount(){return this.narrowMode?this.pageCount*2:this.pageCount}stepView(e){const t=this.viewIndex+e;t<0||t>=this.viewCount||(this.viewIndex=t,this.applyView())}goToPage(e,t){if(this.narrowMode){const n=(t==null?void 0:t.wallGroup)==="right"?1:0;this.viewIndex=e*2+n}else this.viewIndex=e;this.applyView()}applyView(e=!1){var s;if(this.disposed)return;this.viewIndex=Math.max(0,Math.min(this.viewCount-1,this.viewIndex));const t=this.narrowMode?Math.floor(this.viewIndex/2):this.viewIndex,n=this.narrowMode?this.viewIndex%2===0?"left":"right":"full";for(const a of this.roomLayers){const o=Number.parseInt((s=a.dataset.page)!=null?s:"0",10);a.classList.toggle("is-active",o===t)}this.element.dataset.wallFocus=n,n==="full"?(this.visual.style.setProperty("--hub-focus-scale","1"),this.visual.style.setProperty("--hub-focus-x","0%")):(this.visual.style.setProperty("--hub-focus-scale","1.9"),this.visual.style.setProperty("--hub-focus-x",n==="left"?"24%":"-24%"));for(const a of this.slotViews)a.button.classList.toggle("is-off-wall",n!=="full"&&a.slot.wallGroup!==n);const r=this.viewCount>1;this.pager.hidden=!r,r&&(this.pagerPrev.disabled=this.viewIndex===0,this.pagerNext.disabled=this.viewIndex===this.viewCount-1,this.pagerCounter.textContent=this.narrowMode?`Raum ${t+1}/${this.pageCount} · ${n==="left"?"Linke":"Rechte"} Wand`:`Raum ${t+1} / ${this.pageCount}`),this.applySelectionState(e?"initial-view":"view-change"),e||this.decodePageImages(t)}updateStageScale(){const e=this.visual.getBoundingClientRect();if(e.width<=0||e.height<=0)return;const t=Math.min(e.width/this.stageWidth,e.height/this.stageHeight);this.element.style.setProperty("--hub-stage-scale",String(t))}buildCalibrationOverlay(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.classList.add("museum-hub__calibration-svg"),e.setAttribute("viewBox",`0 0 ${this.stageWidth} ${this.stageHeight}`),e.setAttribute("aria-hidden","true"),this.stage.appendChild(e),this.calibrationSvg=e}buildCalibrationPanel(e){const t=document.createElement("div");t.className="museum-hub__calibration";const n=document.createElement("p");n.className="museum-hub__calibration-title",n.textContent="Hub-Kalibrierung — Wände, Safe-Zonen und Bildgrößen in customer-artworks/museum-hub.json speichern";const r=document.createElement("div");r.className="museum-hub__calibration-controls";const s=document.createElement("label");s.className="museum-hub__calibration-label",s.textContent="Aktive Wand";const a=document.createElement("select");a.className="museum-hub__calibration-select";for(const u of this.resolution.walls){const h=document.createElement("option");h.value=u.id,h.textContent=`${u.id} (${u.group})`,a.appendChild(h)}this.activeCalibrationWallId&&(a.value=this.activeCalibrationWallId),a.addEventListener("change",()=>{this.activeCalibrationWallId=a.value,this.renderCalibrationOverlay()}),s.appendChild(a);const o=document.createElement("button");o.type="button",o.className="museum-hub__calibration-restore",o.textContent="Letzte gültige Konfiguration wiederherstellen",o.disabled=!0,o.addEventListener("click",()=>this.restoreLastValidCalibrationSnapshot()),r.append(s,o);const l=document.createElement("p");l.className="museum-hub__calibration-label",l.textContent="Prüfungen";const c=document.createElement("ul");c.className="museum-hub__calibration-warnings";const d=document.createElement("textarea");d.className="museum-hub__calibration-output",d.readOnly=!0,d.rows=16,d.setAttribute("aria-label","Museum-Hub-Konfiguration als JSON"),t.append(n,r,l,c,d),e.appendChild(t),this.calibrationOutput=d,this.calibrationWarnings=c,this.calibrationRestoreButton=o,this.calibrationWallSelect=a}startSlotCalibrationDrag(e,t,n,r){e.preventDefault(),this.calibrationDrag={kind:"slot",slot:t,button:n,pointerId:e.pointerId,mode:r},n.setPointerCapture(e.pointerId),n.addEventListener("pointermove",this.handleCalibrationMove),n.addEventListener("pointerup",this.handleCalibrationEnd),n.addEventListener("pointercancel",this.handleCalibrationEnd)}startWallPointCalibrationDrag(e,t,n,r){e.preventDefault();const s=e.currentTarget;this.calibrationDrag={kind:"wall-point",wallId:t,pointerId:e.pointerId,target:n,index:r},s.setPointerCapture(e.pointerId),s.addEventListener("pointermove",this.handleCalibrationMove),s.addEventListener("pointerup",this.handleCalibrationEnd),s.addEventListener("pointercancel",this.handleCalibrationEnd)}pointerEventToStage(e){const t=this.visual.getBoundingClientRect();return t.width<=0||t.height<=0?null:K(Math.min(this.stageWidth,Math.max(0,(e.clientX-t.left)/t.width*this.stageWidth)),Math.min(this.stageHeight,Math.max(0,(e.clientY-t.top)/t.height*this.stageHeight)))}renderCalibrationOverlay(){if(!this.calibrationSvg)return;this.calibrationSvg.replaceChildren();const e=this.activeCalibrationWallId;for(const t of this.resolution.walls){const n=this.calibrating?t.id===e:!0,r=document.createElementNS("http://www.w3.org/2000/svg","polygon");r.setAttribute("points",this.pointsToSvg(t.quad)),r.setAttribute("class",`museum-hub__calibration-wall${n?" is-active":""}`),this.calibrating&&r.addEventListener("pointerdown",()=>{this.activeCalibrationWallId=t.id,this.calibrationWallSelect&&(this.calibrationWallSelect.value=t.id),this.renderCalibrationOverlay()}),this.calibrationSvg.appendChild(r);const s=document.createElementNS("http://www.w3.org/2000/svg","polygon");s.setAttribute("points",this.pointsToSvg(t.safePolygon)),s.setAttribute("class",`museum-hub__calibration-safe${n?" is-active":""}`),this.calibrationSvg.appendChild(s),this.debugGeometry&&(this.renderProjectedDoorwayDebugOverlay(t),this.renderWallDebugAxes(t)),!(!this.calibrating||!n)&&(t.quad.forEach((a,o)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"quad",o,a,"museum-hub__calibration-handle"))),t.safePolygon.forEach((a,o)=>this.calibrationSvg.appendChild(this.createCalibrationHandle(t.id,"safe",o,a,"museum-hub__calibration-handle museum-hub__calibration-handle--safe"))))}this.debugGeometry&&(this.renderCameraDebugGuides(),this.renderProjectedSlotDebugOverlay())}createCalibrationHandle(e,t,n,r,s){const a=document.createElementNS("http://www.w3.org/2000/svg","circle");return a.setAttribute("class",s),a.setAttribute("cx",r.x.toFixed(2)),a.setAttribute("cy",r.y.toFixed(2)),a.setAttribute("r","8"),a.addEventListener("pointerdown",o=>this.startWallPointCalibrationDrag(o,e,t,n)),a}renderWallDebugAxes(e){if(!this.calibrationSvg||!e.homography)return;const t=zn(e.homography,.1,.1),n=zn(e.homography,.28,.1),r=zn(e.homography,.1,.28);if(!t||!n||!r)return;this.appendSvgLine(t,n,"museum-hub__debug-axis museum-hub__debug-axis--x"),this.appendSvgLine(t,r,"museum-hub__debug-axis museum-hub__debug-axis--y"),this.appendSvgCircle(t,"museum-hub__debug-origin",3.8);const s=e.projectionRealism,a=s?`${e.id} · ref ${s.referenceResidualMaxPx.toFixed(1)}px · ${s.projectedConvergence}`:e.id;this.appendSvgLabel(K(t.x+8,t.y-8),a,"museum-hub__debug-wall-label")}renderProjectedDoorwayDebugOverlay(e){if(!(!this.calibrationSvg||!e.room||!e.camera))for(const t of Fl(e.room,e.camera,this.resolution.stage)){const n=document.createElementNS("http://www.w3.org/2000/svg","polygon");n.setAttribute("points",this.pointsToSvg(t)),n.setAttribute("class","museum-hub__debug-doorway"),this.calibrationSvg.appendChild(n)}}renderProjectedSlotDebugOverlay(){var e;if(this.calibrationSvg)for(const{slot:t}of this.slotViews){if(!t.selectable||!t.artworkId)continue;const n=this.resolution.wallById.get(t.placement.wallId),r=this.projectedSlotGeometry.get(t.id);if(!n||!r||!n.homography)continue;const s=zn(n.homography,t.placement.center.x,t.placement.center.y);this.calibrationSvg.appendChild(this.createProjectedQuadElement(r.projectedQuad)),s&&this.appendSvgCircle(s,"museum-hub__debug-slot-center",3.2),r.projectedQuad.forEach(o=>this.appendSvgCircle(o,"museum-hub__debug-slot-corner",2.8));const a=r.projectedQuad[0];if(a){const o=t.placement.anchor?`L ${t.placement.anchor.x.toFixed(2)},${t.placement.anchor.y.toFixed(2)}`:`L ${t.placement.center.x.toFixed(2)},${t.placement.center.y.toFixed(2)}`,l=s?`S ${s.x.toFixed(0)},${s.y.toFixed(0)}`:"S –";this.appendSvgLabel(K(a.x+8,a.y-8),`${t.id} · ${t.placement.wallId} · ${o} · ${l} · ${(e=r.validity)!=null&&e.contained&&r.validity.doorwayClear&&r.validity.inHangingBand?"valid":"invalid"}`,"museum-hub__debug-slot-label")}}}renderCameraDebugGuides(){const e=this.resolution.camera,t=ss(e,{x:e.target.x,y:e.target.y,z:e.target.z-24},this.resolution.stage);t&&(this.appendSvgLine(K(0,t.y),K(this.stageWidth,t.y),"museum-hub__debug-horizon"),this.appendSvgLabel(K(12,Math.max(18,t.y-8)),"camera horizon","museum-hub__debug-camera-label"));for(const n of this.resolution.walls){if(!n.room)continue;const r=K(n.room.width/2,n.room.height/2),s=l=>({x:n.room.origin.x+n.room.axisU.x*l+n.room.axisV.x*r.y,y:n.room.origin.y+n.room.axisU.y*l+n.room.axisV.y*r.y,z:n.room.origin.z+n.room.axisU.z*l+n.room.axisV.z*r.y}),a=ss(e,s(r.x),this.resolution.stage),o=ss(e,s(r.x+40),this.resolution.stage);a&&o&&this.appendSvgLine(a,o,"museum-hub__debug-vanishing")}}createProjectedQuadElement(e){const t=document.createElementNS("http://www.w3.org/2000/svg","polygon");return t.setAttribute("points",this.pointsToSvg(e)),t.setAttribute("class","museum-hub__debug-slot-quad"),t}appendSvgLine(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","line");r.setAttribute("class",n),r.setAttribute("x1",e.x.toFixed(2)),r.setAttribute("y1",e.y.toFixed(2)),r.setAttribute("x2",t.x.toFixed(2)),r.setAttribute("y2",t.y.toFixed(2)),this.calibrationSvg.appendChild(r)}appendSvgCircle(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.setAttribute("class",t),r.setAttribute("cx",e.x.toFixed(2)),r.setAttribute("cy",e.y.toFixed(2)),r.setAttribute("r",n.toFixed(1)),this.calibrationSvg.appendChild(r)}appendSvgLabel(e,t,n){if(!this.calibrationSvg)return;const r=document.createElementNS("http://www.w3.org/2000/svg","text");r.setAttribute("class",n),r.setAttribute("x",e.x.toFixed(2)),r.setAttribute("y",e.y.toFixed(2)),r.textContent=t,this.calibrationSvg.appendChild(r)}pointsToSvg(e){return e.map(t=>`${t.x.toFixed(2)},${t.y.toFixed(2)}`).join(" ")}applyInverseHomography(e,t){if(!e.inverseHomography)return null;const[n,r,s,a,o,l,c,d,u]=e.inverseHomography,h=c*t.x+d*t.y+u;return Math.abs(h)<=1e-6?null:K((n*t.x+r*t.y+s)/h,(a*t.x+o*t.y+l)/h)}clampLocalX(e){return Math.min(1,Math.max(0,e))}clampLocalY(e){return Math.min(1,Math.max(0,e))}collectCalibrationWarnings(){var n;const e=[];for(const r of this.resolution.walls)(ir(r.quad)||!Ai(r.quad))&&e.push(`Wall ${r.id}: the calibrated wall quad must remain convex and non-degenerate.`),r.safePolygon.length<3&&e.push(`Wall ${r.id}: the safe polygon needs at least three points.`);const t=new Map;for(const r of this.slotViews){const{slot:s}=r;if(!s.selectable||!s.artworkId)continue;const a=this.resolution.wallById.get(s.placement.wallId);if(!a){e.push(`Slot ${s.id}: wall ${s.placement.wallId} is missing.`);continue}const o=as(a,s.placement,s.artworkAspect,this.resolution.stage);if(!o){e.push(`Slot ${s.id}: projected geometry is invalid.`);continue}o.projectedQuad.every(c=>Hn(c,a.safePolygon))||e.push(`Slot ${s.id}: artwork extends outside the wall safe zone.`),o.shortEdge<os&&e.push(`Slot ${s.id}: projected short edge ${o.shortEdge.toFixed(1)}px is below ${os}px.`);const l=(n=t.get(s.pageIndex))!=null?n:[];l.push({slot:s,quad:o}),t.set(s.pageIndex,l)}for(const[r,s]of t)for(let a=0;a<s.length;a+=1){const o=s[a];for(let l=a+1;l<s.length;l+=1){const c=s[l];ua(o.quad.projectedQuad,c.quad.projectedQuad)&&e.push(`Page ${r+1}: ${o.slot.id} overlaps ${c.slot.id}.`)}}return e}buildCurrentCalibrationConfig(){return{version:3,coverage:"all-active-artworks",stage:this.resolution.stage,background:this.resolution.background,backgroundFallback:this.resolution.backgroundFallback,visualTokens:this.resolution.visualTokens,camera:this.resolution.camera,walls:this.resolution.walls.map(e=>({id:e.id,group:e.group,planeAspect:Math.round(e.planeAspect*1e3)/1e3,quad:e.quad.map(t=>this.roundPoint(t)),safePolygon:e.safePolygon.map(t=>this.roundPoint(t)),...e.shadowVector?{shadowVector:this.roundPoint(e.shadowVector)}:{},...e.room?{room:e.room}:{}})),fallbacks:{requireAllMapped:!0,autoPlaceUnmapped:!0,overflow:"paginate",invalidMapping:"disable-slot",missingImage:"placeholder-exact-target",selectionTimeoutMs:this.resolution.selectionTimeoutMs,selectionTimeout:"open-exact-target-procedural"},slots:this.slotViews.map(({slot:e})=>({id:e.id,enabled:e.disabledReason!=="explicitly-disabled",selectable:e.selectable,...e.artworkId?{artworkId:e.artworkId}:{},placement:{wallId:e.placement.wallId,center:this.roundPoint(e.placement.center),...e.placement.anchor?{anchor:this.roundPoint(e.placement.anchor)}:{},mountedHeight:this.round(e.placement.mountedHeight),...e.placement.provisional?{provisional:!0}:{}}}))}}updateCalibrationOutput(e){const t=this.buildCurrentCalibrationConfig(),n=this.collectCalibrationWarnings(),r=JSON.stringify(t,null,2);if(this.calibrationOutput&&(this.calibrationOutput.value=r),this.calibrationWarnings){this.calibrationWarnings.replaceChildren();const s=n.length>0?n:["Keine Warnungen — Konfiguration erfüllt alle Kalibrierungsprüfungen."];for(const a of s){const o=document.createElement("li");o.textContent=a,this.calibrationWarnings.appendChild(o)}}n.length===0&&e&&(this.lastValidCalibrationSnapshot=r,this.calibrationRestoreButton&&(this.calibrationRestoreButton.disabled=!1)),this.diagnostics.info("hub-calibration","Museum hub wall-plane calibration snapshot",{warnings:n,config:t})}restoreLastValidCalibrationSnapshot(){var n,r;if(!this.lastValidCalibrationSnapshot)return;const t=jl(JSON.parse(this.lastValidCalibrationSnapshot)).config;if(t){for(const s of t.walls){const a=this.resolution.wallById.get(s.id);if(!a)continue;a.quad.forEach((l,c)=>{l.x=s.quad[c].x,l.y=s.quad[c].y});const o=(n=s.safePolygon)!=null?n:[];a.safePolygon.splice(0,a.safePolygon.length,...o.map(l=>xt(l))),a.planeAspect=s.planeAspect,s.shadowVector&&(a.shadowVector=xt(s.shadowVector)),s.room&&(a.room={origin:{...s.room.origin},axisU:{...s.room.axisU},axisV:{...s.room.axisV},width:s.room.width,height:s.room.height,safePolygon:s.room.safePolygon.map(xt),doorwayExclusions:s.room.doorwayExclusions.map(l=>l.map(xt)),hangingBand:{...s.room.hangingBand}})}for(const s of t.slots){const a=(r=this.slotViews.find(o=>o.slot.id===s.id))==null?void 0:r.slot;a&&(a.placement.wallId=s.placement.wallId,a.placement.center=xt(s.placement.center),a.placement.anchor=s.placement.anchor?xt(s.placement.anchor):void 0,a.placement.mountedHeight=s.placement.mountedHeight,a.placement.provisional=s.placement.provisional===!0)}this.applyAllSlotGeometry(),this.renderCalibrationOverlay(),this.updateCalibrationOutput(!0)}}round(e){return Math.round(e*1e3)/1e3}roundPoint(e){return K(this.round(e.x),this.round(e.y))}dispose(){var e;this.disposed||(this.disposed=!0,this.cancelIdlePageDecode(),this.resizeRafId!==0&&cancelAnimationFrame(this.resizeRafId),(e=this.resizeObserver)==null||e.disconnect(),this.narrowQuery.removeEventListener("change",this.handleNarrowChange),window.removeEventListener("resize",this.handleResize),this.element.removeEventListener("pointerdown",this.handleSwipeStart),this.element.removeEventListener("pointerup",this.handleSwipeEnd),this.element.removeEventListener("keydown",this.handleKeydown),this.entryButton.removeEventListener("click",this.handleActivate),this.activateCallback=null,this.selectSlotCallback=null,this.projectedSlotGeometry.clear(),this.debugProjectionSignatureBySlot.clear(),this.slotViews.length=0,this.roomLayers.length=0,this.element.remove())}}class Pg{constructor(e={}){v(this,"destinations",new Map);v(this,"options");v(this,"active",null);v(this,"transition",null);v(this,"generation",0);v(this,"disposed",!1);v(this,"state","loading");this.options=e}register(e){if(this.disposed)throw new Error("Cannot register a destination after disposal.");if(this.destinations.has(e.id))throw new Error(`Destination "${e.id}" is already registered.`);this.destinations.set(e.id,e)}async startAt(e){var n;if(this.active||this.transition)throw new Error("Destination router has already started.");const t=this.requireDestination(e);await((n=t.prepare)==null?void 0:n.call(t)),!this.disposed&&(await t.enter(),!this.disposed&&(this.active=t,this.setState(e==="hub"?"hub":"destination")))}navigate(e){var r;if(this.disposed||((r=this.active)==null?void 0:r.id)===e)return Promise.resolve(!1);if(this.transition)return this.transition;const t=this.requireDestination(e),n=++this.generation;return this.setState("transitioning"),this.transition=this.runTransition(t,n).finally(()=>{this.generation===n&&(this.transition=null)}),this.transition}async runTransition(e,t){var r,s,a,o;const n=this.active;try{return await((r=e.prepare)==null?void 0:r.call(e)),!this.isCurrent(t)||(await((s=n==null?void 0:n.exit)==null?void 0:s.call(n)),!this.isCurrent(t))||(await e.enter(),!this.isCurrent(t))?!1:(this.active=e,this.setState(e.id==="hub"?"hub":"destination"),!0)}catch(l){if(!this.isCurrent(t))return!1;if(n){if(await n.enter(),!this.isCurrent(t))return!1;this.active=n,this.setState(n.id==="hub"?"hub":"destination")}return(o=(a=this.options).onTransitionError)==null||o.call(a,e,l),!1}}requireDestination(e){const t=this.destinations.get(e);if(!t)throw new Error(`Unknown destination "${e}".`);return t}isCurrent(e){return!this.disposed&&this.generation===e}setState(e){var t,n,r,s;this.state=e,(s=(r=this.options).onStateChange)==null||s.call(r,e,(n=(t=this.active)==null?void 0:t.id)!=null?n:null)}get currentState(){return this.state}dispose(){this.disposed||(this.disposed=!0,this.generation+=1,this.destinations.forEach(e=>{var t;return(t=e.dispose)==null?void 0:t.call(e)}),this.destinations.clear(),this.active=null,this.transition=null)}}const Ig=300,tc=200,Lg=50;class Dg{constructor(){v(this,"diagnostics",$t("audio"));v(this,"audio",new Audio);v(this,"source",null);v(this,"disposed",!1);v(this,"suspended",!1);v(this,"shouldResumeAfterSuspend",!1);v(this,"state",{available:!1,loaded:!1,playing:!1,muted:!1,targetVolume:Ti,liveVolume:Ti,autoplayBlocked:!1,message:null,activeSource:null});v(this,"listeners",new Set);v(this,"fadeRafHandle",null);v(this,"fadeStartTime",0);v(this,"fadeStartGain",0);v(this,"fadeTargetGain",0);v(this,"fadeDurationMs",0);v(this,"fadeOnComplete",null);v(this,"tickFade",e=>{this.fadeStartTime===0&&(this.fadeStartTime=e);const t=e-this.fadeStartTime,n=this.fadeDurationMs>0?Math.min(1,t/this.fadeDurationMs):1,r=this.fadeStartGain+(this.fadeTargetGain-this.fadeStartGain)*n;if(this.audio.volume=Math.max(0,Math.min(1,r)),this.state={...this.state,liveVolume:this.audio.volume},this.emit(),n<1)this.fadeRafHandle=requestAnimationFrame(this.tickFade);else{this.fadeRafHandle=null,this.diagnostics.debug("audio-fade-complete","Volume fade completed",{gain:this.fadeTargetGain});const s=this.fadeOnComplete;this.fadeOnComplete=null,s==null||s()}});this.audio.preload="auto",this.audio.loop=!0,this.audio.defaultMuted=!1,this.audio.removeAttribute("muted"),this.audio.muted=!1,this.audio.volume=Ti,this.bindEvents()}load(e){if(this.disposed)return;this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-load-mute-desync","Repairing muted state desync before loading source",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted);const t=this.pickPlayableSource(e);if(!t){this.audio.removeAttribute("src"),this.audio.load(),this.state={...this.state,available:!1,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:null},this.emit(),this.diagnostics.info("audio-load-empty","No background audio source available");return}this.source=t,this.audio.src=t.src,this.audio.load(),this.state={...this.state,available:!0,loaded:!1,playing:!1,autoplayBlocked:!1,message:null,activeSource:t},this.emit(),this.diagnostics.info("audio-load-start","Background audio source selected",{file:t.filename,ext:t.ext,mime:t.mime})}subscribe(e){return this.listeners.add(e),e({...this.state}),()=>this.listeners.delete(e)}getState(){return{...this.state}}hasSource(){return!!this.source}async play(e){if(this.disposed||!this.source||this.suspended||this.state.muted)return!1;if(this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-play-mute-desync","Repairing muted state desync before play",{reason:e,expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),!this.audio.paused&&this.state.playing)return this.shouldResumeAfterSuspend=!0,this.diagnostics.debug("audio-play-skip","Play request ignored because audio is already playing",{reason:e}),!0;this.shouldResumeAfterSuspend=!0,this.cancelFade(),this.audio.volume=0,this.state={...this.state,liveVolume:0};try{return await this.audio.play(),this.startFade(this.state.targetVolume,Ig,"fade-in"),this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-play",`Background audio playing (${e})`,{reason:e}),!0}catch(t){this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume};const r=(t instanceof Error?t.name:"UnknownError")==="NotAllowedError";return this.state={...this.state,playing:!1,autoplayBlocked:r,message:r?"Klicken Sie auf Ton aktivieren, um Hintergrundmusik zu starten.":"Hintergrundmusik konnte nicht gestartet werden."},this.emit(),this.diagnostics.warn(r?"audio-play-blocked":"audio-play-failed",r?"Background audio blocked by autoplay policy":"Background audio failed to start",{reason:e,error:t}),this.diagnostics.debug("audio-resume-attempt","Play attempt outcome",{reason:e,blocked:r,success:!1}),!1}}pause(e){this.disposed||!this.source||(this.shouldResumeAfterSuspend=!1,this.startFade(0,tc,"fade-out",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-pause",`Background audio paused (${e})`,{reason:e}))}setMuted(e,t){if(!this.disposed){if(this.state.muted===e&&this.audio.muted===e){this.diagnostics.debug("audio-mute-unchanged","Mute request ignored because state is unchanged",{reason:t,muted:e});return}this.state.muted===e&&this.audio.muted!==e&&this.diagnostics.warn("audio-mute-state-desync","Repairing muted state desync between manager and audio element",{reason:t,expectedMuted:e,actualMuted:this.audio.muted}),this.audio.muted=e,this.state={...this.state,muted:e},e?(this.shouldResumeAfterSuspend=!1,this.startFade(0,tc,"fade-out-mute",()=>{this.audio.paused||this.audio.pause(),this.audio.volume=this.state.targetVolume,this.state={...this.state,liveVolume:this.audio.volume}}),this.state={...this.state,playing:!1}):!this.disposed&&this.source&&!this.suspended&&this.play(`unmute:${t}`),this.emit(),this.diagnostics.info("audio-mute-change",`Background audio mute changed (${t})`,{reason:t,muted:e})}}setVolume(e,t){if(this.disposed)return;const n=Math.max(0,Math.min(Bn,e));this.fadeRafHandle!==null?this.fadeTargetGain=n:this.state.muted||(this.audio.volume=n,this.state={...this.state,liveVolume:n}),this.state={...this.state,targetVolume:n},this.emit(),this.diagnostics.info("audio-volume-change",`Background audio volume changed (${t})`,{reason:t,targetGain:n,liveGain:this.audio.volume}),this.diagnostics.debug("audio-volume-map","Volume mapping record",{targetGain:n,displayPct:Qr(n),liveGain:this.audio.volume,reason:t})}handleSuspend(e){this.disposed||this.suspended||(this.suspended=!0,this.shouldResumeAfterSuspend=!this.audio.paused&&!this.state.muted,this.cancelFade(),this.audio.paused||this.audio.pause(),this.state={...this.state,playing:!1},this.emit(),this.diagnostics.info("audio-lifecycle-suspend",`Background audio suspended (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}))}handleResume(e){this.disposed||!this.suspended||(this.suspended=!1,this.diagnostics.info("audio-lifecycle-resume",`Background audio resumed (${e})`,{reason:e,resumeEligible:this.shouldResumeAfterSuspend}),this.shouldResumeAfterSuspend&&!this.state.muted&&(this.diagnostics.debug("audio-resume-attempt","Attempting auto-resume after lifecycle resume",{reason:e}),this.play(`resume:${e}`)))}dispose(){this.disposed||(this.disposed=!0,this.cancelFade(),this.listeners.clear(),this.audio.pause(),this.audio.removeAttribute("src"),this.audio.load())}bindEvents(){this.audio.addEventListener("canplay",()=>{this.state={...this.state,loaded:!0},this.emit(),this.diagnostics.info("audio-canplay","Background audio can play")}),this.audio.addEventListener("playing",()=>{this.state={...this.state,playing:!0,autoplayBlocked:!1,message:null},this.emit(),this.diagnostics.info("audio-playing","Background audio playing event")}),this.audio.addEventListener("pause",()=>{this.state={...this.state,playing:!1},this.emit(),this.diagnostics.debug("audio-pause-event","Background audio pause event")}),this.audio.addEventListener("ended",()=>{this.source&&(this.diagnostics.warn("audio-loop-restart","Audio ended unexpectedly while loop is enabled; restarting"),this.startFade(0,Lg,"fade-out-loop",()=>{this.audio.currentTime=0,this.play("ended-fallback")}))}),this.audio.addEventListener("error",()=>{const e=this.audio.error;this.state={...this.state,playing:!1,message:"Hintergrundmusik konnte nicht geladen werden."},this.emit(),this.diagnostics.warn("audio-error","Background audio element emitted an error event",{code:e==null?void 0:e.code,message:e==null?void 0:e.message})}),this.audio.addEventListener("volumechange",()=>{this.audio.muted!==this.state.muted&&(this.diagnostics.warn("audio-volumechange-mute-desync","Repairing muted state desync during volumechange",{expectedMuted:this.state.muted,actualMuted:this.audio.muted}),this.audio.muted=this.state.muted),this.state={...this.state,muted:this.state.muted,liveVolume:this.audio.volume},this.emit()})}pickPlayableSource(e){if(!e||!Array.isArray(e.sources)||e.sources.length===0)return null;const t=e.sources.filter(r=>!!r&&typeof r.src=="string"&&typeof r.ext=="string"&&typeof r.mime=="string"&&typeof r.filename=="string");if(t.length===0)return null;if(typeof this.audio.canPlayType=="function"){for(const r of t){const s=this.audio.canPlayType(r.mime);if(s==="probably"||s==="maybe")return r}return null}if(e.selectedByImporter){const r=t.find(s=>{var a;return s.src===((a=e.selectedByImporter)==null?void 0:a.src)});if(r)return r}return t[0]}startFade(e,t,n,r){this.cancelFade(),this.fadeStartGain=this.audio.volume,this.fadeTargetGain=Math.max(0,Math.min(Bn,e)),this.fadeDurationMs=t,this.fadeOnComplete=r!=null?r:null,this.fadeStartTime=0,this.fadeRafHandle=requestAnimationFrame(this.tickFade),this.diagnostics.debug("audio-fade-start","Volume fade started",{label:n,from:this.fadeStartGain,to:this.fadeTargetGain,durationMs:t})}cancelFade(){this.fadeRafHandle!==null&&(cancelAnimationFrame(this.fadeRafHandle),this.fadeRafHandle=null,this.fadeOnComplete=null,this.diagnostics.debug("audio-fade-cancel","Volume fade cancelled"))}emit(){const e={...this.state};this.listeners.forEach(t=>t(e))}}const Ra="freyraum.preferences.v1",Gn=$t("preferences");function Pa(){try{const i=localStorage.getItem(Ra);if(!i)return{};const e=JSON.parse(i);if(e&&typeof e=="object")return e}catch(i){Gn.warn("storage-read-failed","Could not read stored preferences; falling back to defaults")}return{}}function Ia(i){try{localStorage.setItem(Ra,JSON.stringify({...i,audioMuted:!1}))}catch(e){Gn.warn("storage-write-failed","Could not persist preferences to localStorage")}}function Ng(){var i,e,t;return(t=(e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-reduced-motion: reduce)"))==null?void 0:e.matches)!=null?t:!1}function nc(){var i,e,t;return(t=(e=(i=window.matchMedia)==null?void 0:i.call(window,"(prefers-contrast: more)"))==null?void 0:e.matches)!=null?t:!1}class ic{constructor(){v(this,"prefs");v(this,"listeners",new Set);v(this,"motionMedia",(pc=window.matchMedia)==null?void 0:pc.call(window,"(prefers-reduced-motion: reduce)"));v(this,"contrastMedia",(mc=window.matchMedia)==null?void 0:mc.call(window,"(prefers-contrast: more)"));v(this,"handleSystemMotionChange",e=>{Pa().reducedMotion===void 0&&(this.prefs.reducedMotion=e.matches,this.emit())});v(this,"handleSystemContrastChange",e=>{this.prefs.contrastMode==="auto"&&(this.prefs.highContrast=e.matches,this.emit())});var o,l,c,d,u;const e=Pa(),t=e.quality&&e.quality in Ki?e.quality:il,n=e.contrastMode==="high"?"high":"auto";let r=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)?Math.max(0,Math.min(Bn,e.audioVolume)):Ti;const s=typeof e.audioVolume=="number"&&Number.isFinite(e.audioVolume)&&e.audioVolume<=0;s&&(r=Ti,Gn.warn("audio-volume-normalized","Normalized stored zero-volume state to startup default",{key:Ra,stored:e.audioVolume,normalizedTo:r})),this.prefs={reducedMotion:(o=e.reducedMotion)!=null?o:Ng(),highContrast:n==="high"?!0:nc(),contrastMode:n,quality:t,audioMuted:!1,audioVolume:r,alwaysShowChrome:e.alwaysShowChrome===!0};const a=e.audioMuted!==!1;(s||a)&&(Ia(this.prefs),Gn.info("audio-startup-normalized","Normalized persisted startup audio state",{storedMuted:e.audioMuted,storedVolume:e.audioVolume,normalizedMuted:this.prefs.audioMuted,normalizedVolume:this.prefs.audioVolume})),(c=(l=this.motionMedia)==null?void 0:l.addEventListener)==null||c.call(l,"change",this.handleSystemMotionChange),(u=(d=this.contrastMedia)==null?void 0:d.addEventListener)==null||u.call(d,"change",this.handleSystemContrastChange),this.applyToDocument()}get current(){return{...this.prefs}}setReducedMotion(e){this.prefs.reducedMotion=e,this.emit()}setContrastMode(e){this.prefs.contrastMode=e,this.prefs.highContrast=e==="high"?!0:nc(),this.emit()}setQuality(e){e in Ki&&(this.prefs.quality=e,this.emit())}setAudioMuted(e){this.prefs.audioMuted=e,this.emit()}setAudioVolume(e){this.prefs.audioVolume=Math.max(0,Math.min(Bn,e)),this.emit()}setAlwaysShowChrome(e){this.prefs.alwaysShowChrome!==e&&(this.prefs.alwaysShowChrome=e,Gn.info("always-show-chrome","Clean-chrome preference changed",{value:e}),this.emit())}normalizeStartupAudio(e,t=!0){const n=this.prefs.audioVolume>0?this.prefs.audioVolume:Ti,r=this.prefs.audioMuted||this.prefs.audioVolume!==n;if(this.prefs={...this.prefs,audioMuted:!1,audioVolume:n},r?Gn.info("audio-startup-reset","Reset audio to startup defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}):Gn.debug("audio-startup-reset-skip","Startup audio already matches required defaults",{reason:e,audioMuted:this.prefs.audioMuted,audioVolume:this.prefs.audioVolume}),t){this.emit();return}Ia(this.prefs)}static hasStoredQuality(){return Pa().quality!==void 0}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(){this.applyToDocument(),Ia(this.prefs),this.listeners.forEach(e=>e(this.current))}applyToDocument(){const e=document.documentElement;e.dataset.motion=this.prefs.reducedMotion?"reduced":"full",e.dataset.contrast=this.prefs.highContrast?"high":"auto",e.dataset.quality=this.prefs.quality,e.dataset.chromeMode=this.prefs.alwaysShowChrome?"visible":"clean"}dispose(){var e,t,n,r;(t=(e=this.motionMedia)==null?void 0:e.removeEventListener)==null||t.call(e,"change",this.handleSystemMotionChange),(r=(n=this.contrastMedia)==null?void 0:n.removeEventListener)==null||r.call(n,"change",this.handleSystemContrastChange),this.listeners.clear()}}function Fg(){try{const i=document.createElement("canvas");return!!(i.getContext("webgl2")||i.getContext("webgl")||i.getContext("experimental-webgl"))}catch(i){return!1}}class Ug{constructor(e){v(this,"samples",[]);v(this,"writeIndex",0);v(this,"filled",!1);v(this,"ema",16.7);v(this,"rolling",16.7);v(this,"lastNow",0);v(this,"cooldownUntil",0);v(this,"_sum",0);v(this,"_aboveCount",0);v(this,"_severeCount",0);v(this,"_sampleOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});v(this,"_readOut",{dtMs:0,emaMs:16.7,rollingMs:16.7,rollingFps:0,belowBudget:!1,severeFrameCount:0,inCooldown:!1});v(this,"budgetMs");v(this,"windowSize");v(this,"emaAlpha");v(this,"cooldownMs");v(this,"severeFrameMs");v(this,"severeFrameLimit");var t,n,r,s,a;this.budgetMs=e.budgetMs,this.windowSize=Math.max(8,(t=e.windowSize)!=null?t:60),this.emaAlpha=(n=e.emaAlpha)!=null?n:.1,this.cooldownMs=(r=e.cooldownMs)!=null?r:600,this.severeFrameMs=(s=e.severeFrameMs)!=null?s:33,this.severeFrameLimit=(a=e.severeFrameLimit)!=null?a:5,this.samples.length=this.windowSize,this.samples.fill(this.budgetMs)}sample(e){if(this.lastNow===0)return this.lastNow=e,this.writeSnapshot(this._sampleOut,0,this._aboveCount,this._severeCount);const t=e-this.lastNow;this.lastNow=e;const n=Math.min(t,250);if(this.filled){const s=this.samples[this.writeIndex];this._sum-=s,s>this.budgetMs&&(this._aboveCount-=1),s>=this.severeFrameMs&&(this._severeCount-=1)}this.samples[this.writeIndex]=n,this._sum+=n,n>this.budgetMs&&(this._aboveCount+=1),n>=this.severeFrameMs&&(this._severeCount+=1),this.writeIndex=(this.writeIndex+1)%this.windowSize,this.writeIndex===0&&(this.filled=!0);const r=this.filled?this.windowSize:this.writeIndex;return this.rolling=this._sum/Math.max(1,r),this.ema=this.ema+this.emaAlpha*(n-this.ema),this.writeSnapshot(this._sampleOut,n,this._aboveCount,this._severeCount)}markNavigation(){this.cooldownUntil=(typeof performance!="undefined"?performance.now():0)+this.cooldownMs}markReadinessWork(){this.markNavigation()}markPresetChange(){this.markNavigation()}writeSnapshot(e,t,n,r){const s=typeof performance!="undefined"?performance.now():0,a=n>this.windowSize*.7,o=r>=this.severeFrameLimit;return e.dtMs=t,e.emaMs=this.ema,e.rollingMs=this.rolling,e.rollingFps=1e3/Math.max(.1,this.rolling),e.belowBudget=a||o,e.severeFrameCount=r,e.inCooldown=s<this.cooldownUntil,e}readSnapshot(){return this.writeSnapshot(this._readOut,0,this._aboveCount,this._severeCount)}}const hs={gcEventsPerMinute:4,gcPauseP99Ms:1};function kg(i){const e=[];return i.gcEventsPerMinute>hs.gcEventsPerMinute&&e.push(`GC events/min ${i.gcEventsPerMinute} exceeds ${hs.gcEventsPerMinute}`),i.gcPauseP99Ms>hs.gcPauseP99Ms&&e.push(`GC pause P99 ${i.gcPauseP99Ms}ms exceeds ${hs.gcPauseP99Ms}ms`),{checked:2,violations:e}}function rc(){const i=performance.memory;return i?i.usedJSHeapSize:null}function sc(i,e){if(i.length===0)return 0;const t=Math.min(i.length-1,Math.max(0,Math.ceil(e*i.length)-1));return i[t]}class Bg{constructor(){v(this,"running",!1);v(this,"rafId",null);v(this,"startTime",0);v(this,"lastNow",0);v(this,"frameMs",[]);v(this,"lastHeapBytes",null);v(this,"peakHeapBytes",0);v(this,"startHeapBytes",null);v(this,"gcEventFrameMs",[]);v(this,"longTasks",0);v(this,"longTaskObserver",null)}start(){var t;if(this.running||typeof window=="undefined")return;this.running=!0,this.frameMs.length=0,this.gcEventFrameMs=[],this.longTasks=0,this.startTime=performance.now(),this.lastNow=this.startTime,this.lastHeapBytes=rc(),this.startHeapBytes=this.lastHeapBytes,this.peakHeapBytes=(t=this.lastHeapBytes)!=null?t:0,this.installLongTaskObserver();const e=n=>{this.running&&(this.recordFrame(n),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}stop(){var e;return this.running=!1,this.rafId!==null&&typeof cancelAnimationFrame!="undefined"&&cancelAnimationFrame(this.rafId),this.rafId=null,(e=this.longTaskObserver)==null||e.disconnect(),this.longTaskObserver=null,this.report()}installLongTaskObserver(){if(typeof PerformanceObserver!="undefined")try{this.longTaskObserver=new PerformanceObserver(e=>{this.longTasks+=e.getEntries().length}),this.longTaskObserver.observe({entryTypes:["longtask"]})}catch(e){this.longTaskObserver=null}}recordFrame(e){const t=e-this.lastNow;if(this.lastNow=e,t<=0)return;this.frameMs.push(t);const n=rc();n!==null&&(n>this.peakHeapBytes&&(this.peakHeapBytes=n),this.lastHeapBytes!==null&&n<this.lastHeapBytes&&this.gcEventFrameMs.push(t),this.lastHeapBytes=n)}report(){var _;const e=this.frameMs.length,t=e>0?this.lastNow-this.startTime:0,n=this.frameMs.reduce((g,f)=>g+f,0),r=e>0?n/e:0,s=e>0?this.frameMs.reduce((g,f)=>g+(f-r)*(f-r),0)/e:0,a=[...this.frameMs].sort((g,f)=>g-f),o=this.frameMs.map(g=>1e3/g),l=o.length>0?o.reduce((g,f)=>g+f,0)/o.length:0,c=o.length>0?o.reduce((g,f)=>g+(f-l)*(f-l),0)/o.length:0,d=[...this.gcEventFrameMs].sort((g,f)=>g-f),u=t>0?this.gcEventFrameMs.length/t*6e4:0,h=this.peakHeapBytes>0?this.peakHeapBytes/(1024*1024):null,m=this.startHeapBytes!==null&&this.lastHeapBytes!==null?(this.lastHeapBytes-this.startHeapBytes)/(1024*1024):null;return{frames:e,durationMs:Math.round(t),avgFrameMs:on(r),p99FrameMs:on(sc(a,.99)),maxFrameMs:on((_=a[a.length-1])!=null?_:0),frameStdDevMs:on(Math.sqrt(s)),avgFps:on(l),fpsStdDev:on(Math.sqrt(c)),gcEventsPerMinute:on(u),gcPauseP99Ms:on(sc(d,.99)),longTasks:this.longTasks,peakHeapMb:h!==null?on(h):null,heapDeltaMb:m!==null?on(m):null}}get isRunning(){return this.running}}function on(i){return Math.round(i*100)/100}function Og(i){if(!i)return 0;const e=i.getIndex();if(e)return e.count/3;const t=i.getAttribute("position");return t?t.count/3:0}function Hg(i){const e=[];let t=0;t+=1;const n=i.artworkMesh.geometry;n?n.getAttribute("position")||e.push("artworkMesh.geometry has no position attribute (corrupt buffer)"):e.push("artworkMesh.geometry is null/undefined (geometry ownership lost)");const r=Og(n);typeof i.maxArtworkTriangles=="number"&&(t+=1,r>i.maxArtworkTriangles&&e.push(`artwork triangle count ${Math.round(r)} exceeds max ${i.maxArtworkTriangles}`)),t+=1;const s=i.artworkMesh.material;(!s||Array.isArray(s)&&s.length===0)&&e.push("artworkMesh.material is missing (broken material binding)"),t+=1;const a=i.lights.filter(d=>d.castShadow).length;a!==i.expectedShadowCasterCount&&e.push(`shadow-casting light count ${a} != expected ${i.expectedShadowCasterCount}`),t+=1;let o=0,l=0;i.scene.traverse(d=>{o+=1,d==null&&(l+=1)}),l>0&&e.push(`${l} null/undefined node(s) found in scene graph`);const c=i.artworkMesh.position;return(!Number.isFinite(c.x)||!Number.isFinite(c.y)||!Number.isFinite(c.z))&&e.push("artworkMesh.position contains a non-finite value"),{checked:t,violations:e,measured:{artworkTriangles:Math.round(r),sceneChildren:o,shadowCasterCount:a}}}function zg(i){const e=new Bg,t=bi(),n={startPerf:()=>{e.start(),t.info("perf-tools","perf-start","Performance metrics session started")},stopPerf:()=>{const r=e.stop();return t.info("perf-tools","perf-stop","Performance metrics session stopped",r),r},perfReport:()=>e.report(),checkInvariants:()=>{const r=Hg(i());return r.violations.length>0?t.warn("perf-tools","invariant-violation","Structural invariant violation(s) detected",r):t.info("perf-tools","invariant-ok","All structural invariants hold",r),r},checkTier1Thresholds:r=>{const s=kg(r!=null?r:e.report());return s.violations.length>0?t.warn("perf-tools","tier1-threshold-failed","Tier 1 performance threshold(s) failed",s):t.info("perf-tools","tier1-threshold-ok","Tier 1 performance thresholds passed",s),s}};return typeof window!="undefined"&&(window.__FREYRAUM_PERF_TOOLS__=n),e}const Gg={high:"balanced",balanced:"battery",battery:null};class Vg{constructor(e,t=4e3,n=!1){v(this,"diagnostics",$t("quality"));v(this,"current");v(this,"suspended",!1);v(this,"locked");v(this,"holdOffUntil",0);v(this,"holdOffMs");this.current=e,this.holdOffMs=t,this.locked=n}evaluate(e,t){if(this.suspended||e.inCooldown)return null;const n=typeof performance!="undefined"?performance.now():0;if(n<this.holdOffUntil||!e.belowBudget)return null;const r=Gg[this.current];return r?this.locked?(this.diagnostics.warn("locked-pressure","Sustained frame-budget pressure detected; automatic quality changes are disabled (quality lock)",{preset:this.current,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.holdOffUntil=n+this.holdOffMs,null):(this.diagnostics.warn("downgrade","Adaptive quality controller requested a downgrade",{from:this.current,to:r,rollingMs:Math.round(e.rollingMs*10)/10,rollingFps:Math.round(e.rollingFps*10)/10,emaMs:Math.round(e.emaMs*10)/10,severeFrameCount:e.severeFrameCount}),this.current=r,this.holdOffUntil=n+this.holdOffMs,t.markPresetChange(),r):null}notifyManualPreset(e){this.current=e,this.suspended=!0,this.diagnostics.info("manual-override","Adaptive quality suspended after manual preset change",{preset:e})}get isSuspended(){return this.suspended}get isLocked(){return this.locked}suspendForUserOverride(){this.suspended=!0}}const Wg="freyraum.backend",fs=$t("backend");function Xg(){try{return typeof window=="undefined"?!1:new URLSearchParams(window.location.search).get("backend")==="webgpu"}catch(i){return!1}}function $g(){try{return localStorage.getItem(Wg)==="webgpu"}catch(i){return!1}}function ac(){return typeof navigator!="undefined"&&"gpu"in navigator&&navigator.gpu!==void 0}async function qg(){const i=Xg()||$g();return fs.debug("detect","Evaluating render backend",{optedIn:i,hasNavigatorGPU:ac()}),i&&ac()?"webgpu-experimental":"webgl"}async function Yg(){if(await qg()!=="webgpu-experimental")return null;try{fs.info("probe-start","Starting WebGPU probe");const t=await import(new URL("./webgpu-probe.js",window.location.href).toString());if(typeof t.initWebGPUPrototype!="function")throw new Error("webgpu-probe.js does not export initWebGPUPrototype()");const n=await t.initWebGPUPrototype();return fs.info("probe-success","WebGPU probe completed successfully"),n}catch(e){return fs.warn("probe-failed","WebGPU probe failed; staying on WebGL",e),null}}function oc(){const i=window.innerWidth,e=window.innerHeight,t=e>=i,n=La("(pointer: coarse)"),r=La("(pointer: fine)"),s=La("(hover: hover)"),a=typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1;let o;return i<360?o="phone-small":i<600?o="phone-portrait":i<900&&t?o="tablet-portrait":i<900?o="phone-landscape":i<1180?o="tablet-landscape":o="desktop",{layoutTier:o,pointerPrimary:n?"coarse":r?"fine":"none",hasHover:s,dpr:a,orientation:t?"portrait":"landscape",viewportW:i,viewportH:e}}function lc(i){const e=document.documentElement;e.dataset.layoutTier=i.layoutTier,e.dataset.pointerPrimary=i.pointerPrimary,e.dataset.hover=i.hasHover?"true":"false",e.dataset.orientation=i.orientation,e.dataset.shortHeight=i.viewportH<500?"true":"false"}function La(i){var e,t,n;try{return(n=(t=(e=window.matchMedia)==null?void 0:e.call(window,i))==null?void 0:t.matches)!=null?n:!1}catch(r){return!1}}const jg="entry-balanced",Kg="freyraum:startup-readiness",Zg="startup",Da={defaultPreEntryWarmCount:5,defaultPostRevealFrameBudgetMs:8,defaultPostRevealBatchCap:2};function cc(i){if(!i)return null;const e=i.trim().toLowerCase();return e==="full"||e==="strict"||e==="all"?"full":e==="entry-balanced"||e==="balanced"?"entry-balanced":e==="entry-minimal"||e==="minimal"?"entry-minimal":null}function Qg(){try{const i=new URLSearchParams(window.location.search),e=cc(i.get(Zg));if(e)return e}catch(i){}try{const i=cc(localStorage.getItem(Kg));if(i)return i}catch(i){}return jg}function Jg(i){return i==="phone-small"||i==="phone-portrait"||i==="phone-landscape"}function e_(i,e,t,n){if(i==="full"||t<=1)return Math.max(1,t);const s=Math.max(1,Math.round(n))*2+1;if(i==="entry-minimal")return dc(s,t);const a=Jg(e)?2:4;return dc(s+a,t)}function dc(i,e){return Math.max(1,Math.min(e,Math.round(i)))}const uc=new H,hc=new H,t_=500,n_=Da.defaultPreEntryWarmCount,i_=Da.defaultPostRevealFrameBudgetMs,r_=Da.defaultPostRevealBatchCap,s_=["high","balanced","battery"];function Vn(){return new Promise(i=>requestAnimationFrame(()=>i()))}async function fc(i){for(let e=0;e<i;e+=1)await Vn()}function ps(i){const e=Number.parseFloat(i);if(Number.isFinite(e))return e;const t=i.match(/-?\d+(?:\.\d+)?/);return t?Number.parseFloat(t[0]):0}function a_(){try{return new URLSearchParams(window.location.search).get("hubDebug")==="1"}catch(i){return!1}}function ln(i){if(!i)return null;const e=i.trim();if(!e)return null;const t=new Be;try{return t.setStyle(e),`#${t.getHexString().toUpperCase()}`}catch(n){return null}}function o_(i){if(!document.body)return null;const e=document.createElement("div");e.className=i,e.style.position="fixed",e.style.left="-10000px",e.style.top="-10000px",e.style.width="4px",e.style.height="4px",document.body.appendChild(e);const t=getComputedStyle(e),n={backgroundColor:t.backgroundColor,backgroundImage:t.backgroundImage};return e.remove(),n}function An(i){const e=new Le;return i.getSize(e),{width:e.x,height:e.y,pixelRatio:i.getPixelRatio()}}function l_(i,e){const t=[".topbar",".info-panel",".nav-controls",".nav-btn",".zoom-controls",".zoom-btn",".prefs",".prefs__trigger",".timeline",".timeline__arrow",".timeline__counter",".timeline__thumb",".audio-controls",".audio-controls button",".fullscreen-btn"];let n=0;for(const a of t)i.querySelectorAll(a).forEach(o=>{o.offsetWidth,o.offsetHeight,o.getBoundingClientRect(),getComputedStyle(o).opacity,n+=1});let r=0;const s=i.querySelector(".prefs__panel");return s!=null&&s.hidden&&(s.hidden=!1,s.style.visibility="hidden",s.style.pointerEvents="none",s.offsetHeight,s.querySelectorAll("input, label, fieldset, legend, h2, p").forEach(a=>{a.offsetHeight,getComputedStyle(a).fontSize,n+=1}),s.hidden=!0,s.style.removeProperty("visibility"),s.style.removeProperty("pointer-events"),r+=1),e.info("boot","ui-prebuild-complete","Interactive chrome prebuilt under loading overlay",{elementsMeasured:n,temporarilyOpenedPanels:r}),{elementsMeasured:n,temporarilyOpenedPanels:r}}function c_(i,e){const t=i.layoutTier==="phone-small"||i.layoutTier==="phone-portrait"||i.layoutTier==="phone-landscape",n=i.layoutTier==="tablet-portrait"||i.layoutTier==="tablet-landscape",r=t?1:2;let s=n_,a=i_,o=r_;return t?(s=4,a=5,o=1):n?(s=5,a=6,o=1):(s=7,a=8,o=2),e>=50&&(s=Math.max(3,s-1),o=1),{criticalRadius:r,preEntryWarmCount:Math.min(e,s),postRevealFrameBudgetMs:a,postRevealBatchCap:o}}function d_(i,e){if(i==null)return null;if(!Array.isArray(i))return e.warn("boot","artworks-injected-invalid","Ignoring injected artworks: not an array",{typeOf:typeof i}),null;const t=[],n=new Set;let r=0;for(const s of i){if(!s||typeof s!="object"){r++;continue}const a=s,o=typeof a.id=="string"?a.id.trim():"",l=typeof a.image=="string"?a.image.trim():"",c=a.dimensions,d=typeof(c==null?void 0:c.width)=="number"&&Number.isFinite(c.width)?c.width:0,u=typeof(c==null?void 0:c.height)=="number"&&Number.isFinite(c.height)?c.height:0;if(!o||!l||d<=0||u<=0||n.has(o)){r++;continue}n.add(o);const h=typeof a.title=="string"&&a.title?a.title:o,m=a.tags,_=Array.isArray(m)?m.filter(p=>typeof p=="string"):[],g=typeof a.webglImage=="string"?a.webglImage:"",f=/^data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/]/.test(g)?g:void 0;t.push({id:o,title:h,subtitle:typeof a.subtitle=="string"?a.subtitle:"",description:typeof a.description=="string"?a.description:"",year:typeof a.year=="number"&&Number.isFinite(a.year)?a.year:new Date().getFullYear(),medium:typeof a.medium=="string"?a.medium:"",image:l,...f?{webglImage:f}:{},dimensions:{width:d,height:u},alt:typeof a.alt=="string"?a.alt:h,credit:typeof a.credit=="string"?a.credit:"",tags:_,surface:typeof a.surface=="string"?a.surface:""})}return r>0&&e.warn("boot","artworks-injected-rejected","Some injected artworks were rejected",{rejected:r,accepted:t.length}),t}function u_(i,e){var o;if(i==null||typeof i!="object")return null;const t=i,r=(Array.isArray(t.sources)?t.sources:[]).map(l=>l).filter(l=>l&&typeof l.src=="string"&&typeof l.ext=="string"&&typeof l.mime=="string"&&typeof l.filename=="string").map(l=>({src:l.src.trim(),ext:l.ext.trim().toLowerCase(),mime:l.mime.trim().toLowerCase(),filename:l.filename.trim()})).filter(l=>l.src.startsWith("./audio/")&&/^audio\/[a-z0-9.+-]+$/.test(l.mime)&&[".mp3",".ogg",".m4a",".wav"].includes(l.ext));if(r.length===0)return null;const s=t.selectedByImporter&&typeof t.selectedByImporter=="object"?t.selectedByImporter:null,a=s?r.find(l=>l.src===s.src&&l.ext===s.ext&&l.mime===s.mime&&l.filename===s.filename):void 0;return e.info("boot","audio-source-resolved","Background audio payload resolved",{sources:r.map(l=>({file:l.filename,ext:l.ext,mime:l.mime})),selectedByImporter:(o=a==null?void 0:a.filename)!=null?o:null}),{sources:r,...a?{selectedByImporter:a}:{}}}function ms(i,e,t){var s,a;const n=(s=ln(e.galleryWall))!=null?s:e.galleryWall.trim(),r=(a=ln(e.museumWall))!=null?a:n;return document.documentElement.style.setProperty("--color-gallery-wall",n),document.documentElement.style.setProperty("--color-museum-wall",r),document.documentElement.style.backgroundColor=n,document.body.style.backgroundColor=n,i.style.backgroundColor=n,t==null||t.setWallClearColor(n),{galleryWall:n,museumWall:r}}function gs(i,e,t,n,r,s,a){var P,V,k,z,j,D,Z,$,ue;const o=getComputedStyle(document.documentElement),l=o.getPropertyValue("--color-gallery-wall").trim(),c=o.getPropertyValue("--color-museum-wall").trim(),d=(P=n==null?void 0:n.renderer.getClearColor(new Be))!=null?P:null,u=d?`#${d.getHexString().toUpperCase()}`:null,h=r?getComputedStyle(r):null,m=o_("fallback-screen"),_=getComputedStyle(document.body),g=getComputedStyle(a),f=s?getComputedStyle(s):null,p=ln(t.galleryWall),y=ln(t.museumWall),M=ln(l),E=ln(c),R=ln((V=h==null?void 0:h.backgroundColor)!=null?V:null),T=ln((k=m==null?void 0:m.backgroundColor)!=null?k:null),A=ln(_.backgroundColor),N=ln(g.backgroundColor),S=[];p&&u&&u!==p&&S.push(`renderer-clear(${u}) != token.galleryWall(${p})`),p&&M&&M!==p&&S.push(`--color-gallery-wall(${M}) != token.galleryWall(${p})`),y&&E&&E!==y&&S.push(`--color-museum-wall(${E}) != token.museumWall(${y})`),y&&R&&R!==y&&S.push(`hub-background(${R}) != token.museumWall(${y})`),p&&T&&T!==p&&S.push(`fallback-background(${T}) != token.galleryWall(${p})`),p&&N&&N!==p&&S.push(`app-background(${N}) != token.galleryWall(${p})`);const x={reason:e,tokens:t,rootVariables:{gallery:l,museum:c,galleryHex:M,museumHex:E},rendererClearHex:u,surfaces:{hubBackgroundColor:(z=h==null?void 0:h.backgroundColor)!=null?z:null,hubBackgroundImage:(j=h==null?void 0:h.backgroundImage)!=null?j:null,loadingOverlayBackgroundColor:(D=f==null?void 0:f.backgroundColor)!=null?D:null,loadingOverlayBackgroundImage:(Z=f==null?void 0:f.backgroundImage)!=null?Z:null,fallbackProbeBackgroundColor:($=m==null?void 0:m.backgroundColor)!=null?$:null,fallbackProbeBackgroundImage:(ue=m==null?void 0:m.backgroundImage)!=null?ue:null,bodyBackgroundColor:_.backgroundColor,bodyBackgroundImage:_.backgroundImage,bodyBackgroundHex:A,appBackgroundColor:g.backgroundColor,appBackgroundImage:g.backgroundImage,appBackgroundHex:N},mismatchSignals:S};S.length>0?i.warn("surface","wall-surface-snapshot-mismatch","Museum wall/clear-color consistency mismatch detected",x):i.info("surface","wall-surface-snapshot","Museum wall/clear-color surfaces resolved consistently",x)}function h_(i){const e=["Kunstwerke werden vorbereitet …","Texturen werden geladen …","Licht und Schatten werden berechnet …","Atmosphäre wird eingestellt …","Fast fertig …"],t=document.createElement("div");t.className="loading-overlay",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-label","Museum wird geladen"),[{x:"10%",y:"14%",size:"280px",color:"rgba(181,154,106,0.32)",duration:"4.2s",delay:"0s",dx1:"52px",dy1:"-44px",dx2:"-68px",dy2:"38px",dx3:"44px",dy3:"-58px"},{x:"78%",y:"12%",size:"340px",color:"rgba(200,214,229,0.26)",duration:"3.6s",delay:"-1.4s",dx1:"-48px",dy1:"60px",dx2:"72px",dy2:"-46px",dx3:"-56px",dy3:"42px"},{x:"16%",y:"74%",size:"400px",color:"rgba(200,214,229,0.24)",duration:"5.1s",delay:"-2.8s",dx1:"64px",dy1:"-52px",dx2:"-40px",dy2:"76px",dx3:"58px",dy3:"-38px"},{x:"84%",y:"70%",size:"290px",color:"rgba(181,154,106,0.28)",duration:"3.9s",delay:"-0.7s",dx1:"-62px",dy1:"42px",dx2:"48px",dy2:"-72px",dx3:"-44px",dy3:"66px"},{x:"50%",y:"6%",size:"220px",color:"rgba(181,154,106,0.22)",duration:"4.7s",delay:"-3.5s",dx1:"44px",dy1:"68px",dx2:"-76px",dy2:"-40px",dx3:"60px",dy3:"52px"},{x:"46%",y:"90%",size:"320px",color:"rgba(200,214,229,0.20)",duration:"3.3s",delay:"-2.1s",dx1:"-58px",dy1:"-62px",dx2:"82px",dy2:"44px",dx3:"-48px",dy3:"-70px"},{x:"26%",y:"50%",size:"240px",color:"rgba(181,154,106,0.18)",duration:"5.8s",delay:"-4.4s",dx1:"70px",dy1:"46px",dx2:"-44px",dy2:"-80px",dx3:"38px",dy3:"64px"},{x:"74%",y:"46%",size:"260px",color:"rgba(200,214,229,0.16)",duration:"4.4s",delay:"-1.9s",dx1:"-46px",dy1:"72px",dx2:"60px",dy2:"-48px",dx3:"-68px",dy3:"56px"},{x:"34%",y:"28%",size:"200px",color:"rgba(181,154,106,0.20)",duration:"3.8s",delay:"-0.5s",dx1:"58px",dy1:"-76px",dx2:"-50px",dy2:"60px",dx3:"76px",dy3:"-42px"},{x:"62%",y:"32%",size:"310px",color:"rgba(200,214,229,0.22)",duration:"5.4s",delay:"-3.1s",dx1:"-72px",dy1:"-48px",dx2:"44px",dy2:"84px",dx3:"-60px",dy3:"-52px"},{x:"8%",y:"44%",size:"350px",color:"rgba(181,154,106,0.16)",duration:"4.0s",delay:"-1.2s",dx1:"46px",dy1:"84px",dx2:"-80px",dy2:"-44px",dx3:"52px",dy3:"68px"},{x:"90%",y:"36%",size:"230px",color:"rgba(200,214,229,0.18)",duration:"5.6s",delay:"-2.5s",dx1:"-84px",dy1:"52px",dx2:"66px",dy2:"-76px",dx3:"-50px",dy3:"46px"}].forEach(g=>{const f=document.createElement("span");f.className="loading-particle",f.setAttribute("aria-hidden","true"),f.style.setProperty("--particle-x",g.x),f.style.setProperty("--particle-y",g.y),f.style.setProperty("--particle-size",g.size),f.style.setProperty("--particle-color",g.color),f.style.setProperty("--particle-duration",g.duration),f.style.setProperty("--particle-delay",g.delay),f.style.setProperty("--particle-drift-x",g.dx1),f.style.setProperty("--particle-drift-y",g.dy1),f.style.setProperty("--particle-drift-x2",g.dx2),f.style.setProperty("--particle-drift-y2",g.dy2),f.style.setProperty("--particle-drift-x3",g.dx3),f.style.setProperty("--particle-drift-y3",g.dy3),t.appendChild(f)});const r=document.createElement("div");r.className="loading-card";const s=document.createElement("div");s.className="loading-wordmark";const a=document.createElement("span");a.className="loading-wordmark__text",a.textContent="FREYRAUM",s.appendChild(a);const o=document.createElement("div");o.className="loading-subtitle",o.textContent="Museum wird geladen";const l=document.createElement("div");l.className="loading-progress-track";const c=document.createElement("div");c.className="loading-progress-fill",l.appendChild(c);const d=document.createElement("div");d.className="loading-progress-pct",d.textContent="0%";const u=document.createElement("div");u.className="loading-hint",u.textContent=e[0];const h=document.createElement("button");h.className="loading-start-btn",h.textContent="Museum betreten",h.setAttribute("aria-label","Museum betreten und Ausstellungen entdecken"),h.disabled=!0,r.append(s,o,l,d,u,h),t.appendChild(r),i.appendChild(t);let m=0;const _=window.setInterval(()=>{m=(m+1)%e.length,u.textContent=e[m]},2e3);return{overlay:t,setProgress(g){const f=Math.max(0,Math.min(100,Math.round(g)));c.style.width=`${f}%`,d.textContent=`${f}%`},setStatus(g){o.textContent=g,t.setAttribute("aria-label",g)},reveal(){return window.clearInterval(_),h.disabled=!1,h.classList.add("is-visible"),h.offsetHeight,getComputedStyle(h).backgroundColor,h.style.setProperty("will-change","background-color"),h.addEventListener("click",()=>{h.style.removeProperty("will-change")},{once:!0}),o.textContent="Museum bereit — zum Starten klicken",u.textContent="Alle Inhalte sind vollständig vorbereitet.",t.setAttribute("aria-label","Museum bereit — zum Starten klicken"),new Promise(g=>{let f=!1;const p=()=>{f||(f=!0,h.disabled=!0,h.removeEventListener("click",p),document.removeEventListener("keydown",y),t.classList.add("is-hidden"),window.setTimeout(()=>{t.remove(),g()},1300))},y=M=>{M.key!=="Enter"&&M.key!==" "||(M.preventDefault(),p())};h.addEventListener("click",p),document.addEventListener("keydown",y),h.addEventListener("transitionend",()=>h.focus(),{once:!0}),window.setTimeout(()=>h.focus(),650)})},dispose(){window.clearInterval(_)}}}async function f_(){var Di,xs,ur,gc,_c,vc;const i=performance.now(),e=bi(),t=a_();e.installGlobalHandlers(),e.info("boot","startup","Starting FREYRAUM runtime"),t&&e.info("boot","hub-debug-enabled","Museum hub debug overlay requested via ?hubDebug=1");const n=document.getElementById("app");if(!n){e.error("boot","missing-app-root","Missing #app root element");return}n.dataset.experience="loading";const r=new ic;e.debug("boot","preferences-ready","Preferences store created",r.current);const s=new Dg,a=oc();if(lc(a),e.info("layout","capabilities","Device capabilities detected",{tier:a.layoutTier,pointer:a.pointerPrimary,hover:a.hasHover,orientation:a.orientation,viewportW:a.viewportW,viewportH:a.viewportH,dpr:a.dpr}),!ic.hasStoredQuality()){const B=Bp();B!==r.current.quality&&e.info("quality","startup-suggestion-suppressed","Startup quality heuristic suppressed (quality lock); keeping deterministic default",{kept:r.current.quality,wouldSuggest:B,tier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr})}const o=window.__FREYRAUM_ARTWORKS,l=d_(o,e),c=l&&l.length>0?l:Fp,d=c.map(B=>{var ve;return{id:B.id,hasWebglImage:!!B.webglImage,webglImageSource:B.webglImage?"embedded-data-url":"file-url",dimensions:B.dimensions,surface:(ve=B.surface)!=null?ve:null}});e.info("boot","artworks-source","Artwork source resolved",{source:l&&l.length>0?"customer":"built-in",count:c.length,artworks:d,withWebglImage:d.filter(B=>B.hasWebglImage).length,withoutWebglImage:d.filter(B=>!B.hasWebglImage).length});const u=window.__FREYRAUM_MUSEUM_HUB,h=window.__FREYRAUM_HUB_HOTSPOTS,m=_g(c,u,h);e.info("boot","museum-hub-resolved","Museum hub configuration resolved",{source:m.source,pages:m.pages.length,selectableSlots:m.slotToArtwork.size,unmappedArtworkCount:m.unmappedArtworkCount,disabledSlots:m.pages.flatMap(B=>B.slots).filter(B=>!B.selectable).map(B=>({slotId:B.id,reason:B.disabledReason})),warnings:m.warnings});const _=m.visualTokens,g=ms(n,_);e.info("boot","visual-tokens-resolved","Wall color tokens resolved",g);const f=window.__FREYRAUM_AUDIO,p=u_(f,e);if(s.load(p),!Fg()){e.error("boot","webgl-unavailable","WebGL is not available in the current browser"),da(n,"WebGL ist im aktuellen Browser nicht verfügbar.",g.galleryWall);return}const y=h_(n),M=new Yo;M.onStart=(B,ve,Ae)=>{y.setStatus("Texturen werden geladen"),y.setProgress(Ae>0?ve/Ae*40:8)},M.onProgress=(B,ve,Ae)=>{y.setProgress(Ae>0?Math.min(48,ve/Ae*48):35)},M.onLoad=()=>{y.setStatus("Galerie wird vorbereitet"),y.setProgress(50)},M.onError=B=>{e.warn("boot","loading-manager-error","Asset failed during loading-manager preload",{url:B.startsWith("data:")?`[data-uri:${B.length}bytes]`:B})};const E=Gr(r.current.quality);let R;try{R=new $p(n,E,g.galleryWall)}catch(B){e.error("renderer","init-failed","RendererManager initialization failed",B),y.dispose(),y.overlay.remove(),da(n,B instanceof Error?B.message:"WebGL-Renderer konnte nicht initialisiert werden.",g.galleryWall);return}ms(n,g,R),R.renderer.domElement.classList.add("gallery-canvas","gallery-canvas--loading");let T=null;const A=document.createElement("div");A.className="webgl-restore-status",A.setAttribute("role","status"),A.setAttribute("aria-live","polite"),A.textContent="Grafik wird wiederhergestellt …",n.appendChild(A);let N;R.onContextChange(B=>{var ve,Ae;if(B==="lost"){clearTimeout(N),A.classList.add("is-visible"),e.warn("renderer","context-restore-visible","Showing WebGL restore status"),gs(e,"renderer-context-lost",g,R,(ve=T==null?void 0:T.element)!=null?ve:null,y.overlay,n);return}ms(n,g,R),A.textContent="Grafik wiederhergestellt",e.info("renderer","context-restore-hidden","WebGL restore status will hide"),gs(e,"renderer-context-restored",g,R,(Ae=T==null?void 0:T.element)!=null?Ae:null,y.overlay,n),N=setTimeout(()=>{A.classList.remove("is-visible"),A.textContent="Grafik wird wiederhergestellt …"},1200)});const S=new Yp(R.renderer),x=new sm(R.renderer,S.scene,S.camera,E),P=new cm(M);P.init(R.renderer),P.setAnisotropyDivisor(E.anisotropyDivisor);const V=new lm(S.scene,E),k=new mm(S.scene,E);zg(()=>({scene:S.scene,artworkMesh:k.getArtworkMeshObject(),lights:V.getLights(),expectedShadowCasterCount:V.getExpectedShadowCasterCount()}));const z={topbar:null,timeline:null,navControls:null,infoPanel:null},j=()=>{var wc,Ec,Tc,Ac,Cc;const B=window.visualViewport,ve=Math.max(1,Math.round((wc=B==null?void 0:B.width)!=null?wc:window.innerWidth)),Ae=Math.max(1,Math.round((Ec=B==null?void 0:B.height)!=null?Ec:window.innerHeight)),qe=window.getComputedStyle(document.documentElement),gt=ps(qe.getPropertyValue("--safe-left")),Rt=ps(qe.getPropertyValue("--safe-right")),Vt=ps(qe.getPropertyValue("--chrome-top")),p_=ps(qe.getPropertyValue("--chrome-bottom")),xc=(Tc=z.topbar)==null?void 0:Tc.getBoundingClientRect(),m_=(Ac=z.timeline)==null?void 0:Ac.getBoundingClientRect(),g_=(Cc=z.navControls)==null?void 0:Cc.getBoundingClientRect(),__=xc?Math.max(0,Math.min(Ae,xc.bottom)):0,v_=[m_,g_].filter(ka=>!!ka).reduce((ka,x_)=>Math.max(ka,Ae-Math.max(0,x_.top)),0),yc=Math.max(Vt,__),bc=Math.max(p_,v_),Mc=gt,Sc=Rt,Fa=Math.max(1,ve-Mc-Sc),Ua=Math.max(1,Ae-yc-bc);return{viewportW:ve,viewportH:Ae,usableW:Fa,usableH:Ua,usableFracX:Fa/ve,usableFracY:Ua/Ae,effectiveAspect:Fa/Ua,occlusionTop:yc,occlusionRight:Sc,occlusionBottom:bc,occlusionLeft:Mc}},D=new Em(c,k,P,S.camera,void 0,j);D.applyPreset(E);const Z=c_(a,c.length);D.configureReadinessProfile({criticalRadius:Z.criticalRadius});const $=Qg(),ue=e_($,a.layoutTier,c.length,Z.criticalRadius);D.configureStartupReadiness({mode:$,entryTargetCount:ue}),e.info("boot","startup-readiness-mode","Resolved startup readiness contract",{mode:$,entryTargetCount:ue,artworkCount:c.length,criticalRadius:Z.criticalRadius,layoutTier:a.layoutTier}),e.info("boot","warm-profile","Applied device-aware warm profile",{artworkCount:c.length,layoutTier:a.layoutTier,pointer:a.pointerPrimary,dpr:a.dpr,profile:Z});const he=!1,L=new Ug({budgetMs:16.7}),ee=new Vg(r.current.quality,4e3,!he);D.setFrameBudgetMarker(()=>L.markNavigation());let se=!1,X;Yg();const Y=new Tm(n),ae=new la(n,c[0]),oe=B=>{ae.setCompact(B==="phone-portrait"||B==="phone-small")};oe(a.layoutTier);const _e=new ca(n),Ie=new Cm(n,D),Ge=new Rm(n,document.documentElement),tt=new Pm(n,r),I=new Dm(n,r,s),ot=new Am(n),Oe=new Bm(n,c);T=new Rg(n,m),T.setSelectedArtworkId((xs=(Di=c[D.index])==null?void 0:Di.id)!=null?xs:null,{alignPage:!1,source:"boot-gallery-selection"}),gs(e,"post-hub-composition-create",g,R,T.element,y.overlay,n);const et=s.subscribe(B=>{tt.setAudioStatusMessage(B.message)});z.topbar=n.querySelector(".topbar"),z.timeline=n.querySelector(".timeline"),z.navControls=n.querySelector(".nav-controls"),z.infoPanel=n.querySelector(".info-panel");const we=new Lm(z.infoPanel,r,n);we.init(),z.navControls&&we.registerNavControls(z.navControls,_e),await Promise.all([D.init(),new Promise(B=>window.setTimeout(B,t_))]),e.info("boot","gallery-ready","Gallery initialized",{artworkCount:c.length,quality:r.current.quality,lighting:"dramatic"});const nt=R.renderer.domElement;nt.tabIndex=-1,nt.setAttribute("aria-label","Interaktive Galerie"),nt.setAttribute("role","img"),nt.setAttribute("aria-describedby","freyraum-canvas-help");const Fe=document.createElement("p");Fe.id="freyraum-canvas-help",Fe.className="sr-only",Fe.textContent="Interaktive 3D-Galerie. Navigation: Pfeiltasten links und rechts oder die Navigationsbuttons. Zoomen: Plus- und Minus-Buttons.",n.appendChild(Fe);let Ce=null,C=null,b=null;const q=()=>{C!==null&&(cancelAnimationFrame(C),C=null),b!==null&&(cancelAnimationFrame(b),b=null)},ne=B=>{Ce||(Ce=document.createElement("div"),Ce.id="freyraum-artwork-status",Ce.className="sr-only",Ce.setAttribute("aria-live","polite"),Ce.setAttribute("aria-atomic","true"),n.appendChild(Ce)),q(),Ce.textContent="";const ve=B?`Aktuelles Werk: ${B}`:"Aktuelles Werk gewechselt";C=requestAnimationFrame(()=>{C=null,b=requestAnimationFrame(()=>{b=null,Ce&&(Ce.textContent=ve)})})},re=new Wm(nt,D),te=new Gm,Ee=new Hm(D,te);re.setEnabled(!1),Ee.setEnabled(!1),Y.onHelpClick=()=>te.open(Y.helpBtn),Y.onInfoClick=()=>we.forceReveal("info-panel");let pe=!1;const xe=B=>{if(pe)return;const ve=r.current,Ae=s.getState();s.hasSource()&&!ve.audioMuted&&(Ae.autoplayBlocked||!Ae.playing&&Ae.available)&&(pe=!0,e.info("audio","autoplay-recovery-attempt","Retrying audio play after user interaction",{reason:B,autoplayBlocked:Ae.autoplayBlocked}),s.play(`interaction-recovery:${B}`))},He=()=>xe("pointerdown"),ce=B=>{(B.key==="ArrowLeft"||B.key==="ArrowRight"||B.key===" "||B.key==="Enter")&&xe(`keydown:${B.key}`)};window.addEventListener("pointerdown",He,{passive:!0}),window.addEventListener("keydown",ce);let me;const je=200,Ue=()=>{me!==void 0&&(clearTimeout(me),me=void 0),D.setInteractionActive(!0)},ye=()=>{me!==void 0&&clearTimeout(me),me=setTimeout(()=>{me=void 0,D.setInteractionActive(!1)},je)},ke=()=>Ue(),ze=()=>ye();window.addEventListener("pointerdown",ke,{passive:!0}),window.addEventListener("pointerup",ze,{passive:!0}),window.addEventListener("pointercancel",ze,{passive:!0});const Ke=c.length,F=new Wt(4,4,{depthBuffer:!0,stencilBuffer:!1}),le=(B,ve)=>{const Ae=performance.now();if(!D.warmArtworkForGPU(B,ve))return!1;const qe=k.group.visible;k.group.visible=!0;const gt=R.renderer.getRenderTarget();return R.renderer.setRenderTarget(F),R.renderer.render(S.scene,S.camera),R.renderer.setRenderTarget(gt),k.group.visible=qe,D.markGpuWarmed(B,performance.now()-Ae,ve),!0},J=(B,ve)=>{var gt;const Ae=performance.now();if(!D.warmArtworkForGPU(B,ve))return!1;const qe=k.group.visible;return k.group.visible=!0,x.render(),k.group.visible=qe,D.markGpuWarmed(B,performance.now()-Ae,ve),e.debug("boot","artwork-final-path-warm","Artwork rendered through final post-processing path under loading overlay",{index:B,artworkId:(gt=c[B])==null?void 0:gt.id,reason:ve,durationMs:Math.round((performance.now()-Ae)*10)/10,renderer:An(R.renderer)}),!0},Q=D.getBudgetedWarmOrder(0),ie=D.getStartupEntryTargets(0),Re=Math.max(0,Q.length-ie.length);e.info("boot","pre-entry-warm-contract","Pre-entry GPU warm contract resolved",{mode:$,warmOrderLength:Q.length,entryWarmCount:ie.length,deferredWarmCount:Re,entryTargets:ie}),await D.ensureEntryReadiness(ie,"overlay-entry-readiness-contract"),y.setStatus("GPU wird vorbereitet"),y.setProgress(50);for(let B=0;B<ie.length;B+=1)y.setStatus(`Gemälde ${B+1} / ${ie.length} wird vorbereitet`),le(ie[B],"overlay-entry-readiness-contract"),y.setProgress(50+Math.round((B+1)/Math.max(1,ie.length)*45)),await Vn();let Ve=D.getEntryReadinessContract(ie),it=0;const ft=Math.max(2,ie.length+1);for(;!Ve.ready&&it<ft;)it+=1,y.setStatus("Zusätzliche Vorbereitung läuft"),await D.ensureEntryReadiness(Ve.pendingIndices,`overlay-contract-retry-${it}`),Ve.pendingIndices.forEach(B=>le(B,`overlay-contract-retry-${it}`)),Ve=D.getEntryReadinessContract(ie);Ve.ready||e.warn("boot","entry-contract-unresolved","Full-gallery entry readiness contract could not be fully satisfied before reveal",{pendingIndices:Ve.pendingIndices,targetIndices:Ve.targetIndices,attempts:it,maxAttempts:ft}),D.warmArtworkForGPU(D.index,"restore-active-after-overlay-warm");const Se=D.getFullGalleryReadinessSummary();if(e.info("boot","full-gallery-ready","Entry readiness contract resolved; enabling entry CTA",{artworkCount:Ke,fullyReadyCount:Se.fullyReadyCount,pendingCount:Se.pendingCount,gpuWarmedCount:Se.gpuWarmedCount,pbrLoadedCount:Se.pbrLoadedCount,proceduralReadyCount:Se.proceduralReadyCount,memoryCapApplied:Se.memoryCapApplied,preloadMode:Se.preloadMode,deferredArtworkCount:Se.deferredArtworkCount,overflowArtworkCount:Se.overflowArtworkCount,entryContractPasses:it,entryContractMaxPasses:ft}),Se.pendingCount>0){const B=Se.preloadMode==="strict"?"warn":"info";e[B]("boot","entry-unresolved-artworks","Pre-entry unresolved artworks detected",{pendingCount:Se.pendingCount,unresolvedArtworkIds:Se.unresolvedArtworkIds,preloadMode:Se.preloadMode,deferredArtworkCount:Se.deferredArtworkCount,overflowArtworkCount:Se.overflowArtworkCount,contractSatisfied:Se.preloadMode!=="strict"})}e.info("boot","inp-acceptance-target",'INP acceptance criteria: interaction presentation delay must stay below 200 ms (Core Web Vitals "good" threshold)',{baseline_inp_ms:1024,target_inp_ms:200,preloadMode:Se.preloadMode,artworkCount:Ke,note:"Measure with Chrome DevTools Performance > Interactions panel or CrUX field data after deploy."}),e.info("boot","gpu-warm-complete","Pre-entry GPU warm finished; entry target set warmed before reveal",{artworkCount:Ke,mode:$,entryWarmCount:ie.length,deferredWarmCount:Re,warmOrder:Q,frameBudgetMs:Z.postRevealFrameBudgetMs,batchCap:Z.postRevealBatchCap});const Ht=3,qt=performance.now();e.info("boot","gpu-warm-flush-start","Starting post-warm GPU drain frames before shader prewarm",{frames:Ht,artworkCount:Ke,pendingCount:Se.pendingCount,preloadMode:Se.preloadMode}),await fc(Ht),e.info("boot","gpu-warm-flush-complete","Post-warm GPU drain frames completed",{frames:Ht,durationMs:performance.now()-qt,artworkCount:Ke,pendingCount:Se.pendingCount,preloadMode:Se.preloadMode}),y.setStatus("Shader werden vorbereitet"),y.setProgress(97),await R.prewarm(S.scene,S.camera),D.markAllShaderCompiled("boot-prewarm");const Wn=r.current.quality,Yt=s_.filter(B=>B!==Wn);if(Yt.length>0){const B=D.index,ve=performance.now();e.info("boot","quality-variant-prewarm-start","Prewarming non-active quality shader variants under loading overlay",{activeQuality:Wn,variants:Yt,artworkIndex:B,artworkId:(ur=c[B])==null?void 0:ur.id});for(const qe of Yt){const gt=performance.now(),Rt=Gr(qe);R.applyPreset(Rt),x.applyPreset(Rt),V.applyPreset(Rt),k.applyPreset(Rt),D.applyPreset(Rt),D.warmArtworkForGPU(B,`overlay-quality-variant-${qe}`),await R.prewarm(S.scene,S.camera),e.debug("boot","quality-variant-prewarmed","Quality shader variant prewarmed",{quality:qe,artworkIndex:B,artworkId:(gc=c[B])==null?void 0:gc.id,durationMs:Math.round((performance.now()-gt)*10)/10,renderer:An(R.renderer)}),await Vn()}const Ae=Gr(Wn);R.applyPreset(Ae),x.applyPreset(Ae),V.applyPreset(Ae),k.applyPreset(Ae),D.applyPreset(Ae),D.warmArtworkForGPU(D.index,"restore-active-after-quality-variant-prewarm"),await R.prewarm(S.scene,S.camera),e.info("boot","quality-variant-prewarm-complete","All non-active quality shader variants prewarmed under loading overlay",{activeQuality:Wn,variantsWarmed:Yt,durationMs:Math.round((performance.now()-ve)*10)/10,renderer:An(R.renderer)})}const Xn=new Le;R.renderer.getSize(Xn),e.info("boot","composer-prewarm-start","Starting EffectComposer shader prewarm (bloom+FXAA passes)"),x.prewarmComposer(Xn.x,Xn.y),e.info("boot","composer-prewarm-complete","EffectComposer shader prewarm complete"),await fc(1),y.setStatus("Finale Darstellung wird vorbereitet"),y.setProgress(98);const vs=performance.now();let Pi=0;for(let B=0;B<ie.length;B+=1)J(ie[B],"overlay-final-path-warm")&&(Pi+=1),await Vn();J(D.index,"restore-active-after-final-path-warm"),e.info("boot","all-artworks-final-path-warmed","Entry target artworks rendered through final post-processing path under loading overlay",{artworkCount:Ke,mode:$,warmed:Pi,targetCount:ie.length,deferredWarmCount:Re,durationMs:Math.round((performance.now()-vs)*10)/10,renderer:An(R.renderer)}),y.setStatus("Bedienelemente werden vorbereitet");const $n=await Oe.prewarmUnderOverlay(),cr=l_(n,e);e.info("boot","entry-prebuild-complete","Main page, controls, timeline, and final render path are prebuilt under loading overlay",{timeline:$n,ui:cr,artworkCount:Ke}),y.setProgress(99),Se.preloadMode==="bounded-fallback"?y.setStatus(`${Se.overflowArtworkCount} Gemälde werden noch optimiert – Galerie kann betreten werden`):Se.preloadMode==="staged"&&Re>0?y.setStatus("Galerie bereit – weitere Gemälde werden im Hintergrund vorbereitet"):y.setStatus("Galerie bereit"),R.renderer.domElement.classList.remove("gallery-canvas--loading"),R.renderer.domElement.classList.add("gallery-canvas--ready");let cn=ie.length;const dr=()=>{if(cn>=Q.length){F.dispose(),D.warmArtworkForGPU(D.index,"restore-active-after-budget-warm"),e.info("boot","gpu-warm-post-reveal","Post-reveal budgeted warm queue complete; all artworks warmed",{artworkCount:Ke,mode:$,warmed:Q.length,deferredWarmCount:Re,readinessLedger:D.getReadinessLedger()});return}const B=performance.now();let ve=0;for(;cn<Q.length&&ve<Z.postRevealBatchCap&&performance.now()-B<Z.postRevealFrameBudgetMs;)le(Q[cn],"post-reveal-budget"),cn+=1,ve+=1;D.warmArtworkForGPU(D.index,"restore-active-between-budget-warm"),e.debug("boot","gpu-warm-frame","Budgeted GPU warm frame completed",{warmedThisFrame:ve,warmCursor:cn,total:Q.length}),requestAnimationFrame(dr)};requestAnimationFrame(dr);let Ii,qn=0;const Na=()=>{var Rt,Vt;qn=0;const B=window.visualViewport,ve=Math.max(1,Math.round((Rt=B==null?void 0:B.width)!=null?Rt:window.innerWidth)),Ae=Math.max(1,Math.round((Vt=B==null?void 0:B.height)!=null?Vt:window.innerHeight));R.resize(ve,Ae),x.resize(ve,Ae),S.updateAspect(ve,Ae);const qe=oc();lc(qe),oe(qe.layoutTier),ot.updateHint();const gt=j();D.handleViewportMetricsChanged(),e.info("layout","resize","Viewport resized",{tier:qe.layoutTier,w:qe.viewportW,h:qe.viewportH,measuredW:ve,measuredH:Ae,orientation:qe.orientation}),e.info("layout","art-viewport","Artwork-safe viewport measured",gt)},Qt=()=>{clearTimeout(Ii),Ii=setTimeout(()=>{qn===0&&(qn=requestAnimationFrame(Na))},120)};window.addEventListener("resize",Qt),window.addEventListener("orientationchange",Qt);const w=window.visualViewport;w==null||w.addEventListener("resize",Qt),w==null||w.addEventListener("scroll",Qt);const U=typeof ResizeObserver=="function"?new ResizeObserver(Qt):null;for(const B of[z.topbar,z.timeline,z.navControls,z.infoPanel])B&&(U==null||U.observe(B));const G=B=>{const{reducedMotion:ve,quality:Ae,audioMuted:qe,audioVolume:gt}=r.current;D.setReducedMotion(ve),V.setAnimated(!ve),s.setVolume(gt,"preferences-apply"),s.setMuted(qe,"preferences-apply");const Rt=s.getState();!qe&&s.hasSource()&&(!Rt.playing||Rt.autoplayBlocked)&&s.play("preferences-apply"),k.material.setShadowProfileScale(.5);const Vt=Gr(Ae);R.applyPreset(Vt),x.applyPreset(Vt),V.applyPreset(Vt),k.applyPreset(Vt),D.applyPreset(Vt),D.setInspectionMode(!1),k.material.setShadowFilterRadius(0,!1),L.markPresetChange(),D.markRenderDirty(6),B&&ee.notifyManualPreset(Ae),e.debug("preferences","applied","Applied current preferences",{manual:B,reducedMotion:ve,quality:Ae,lighting:"dramatic",audioMuted:qe,audioVolume:gt,inspection:!1})};G(!1);const W=B=>{se||(se=!0,s.handleSuspend(B),e.info("lifecycle","suspend",`Runtime suspended (${B})`,{reason:B,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},O=B=>{se&&(se=!1,s.handleResume(B),L.markNavigation(),D.markRenderDirty(6),e.info("lifecycle","resume",`Runtime resumed (${B})`,{reason:B,visibility:typeof document!="undefined"?document.visibilityState:"unknown"}))},de=()=>{document.visibilityState==="hidden"?W("visibilitychange-hidden"):document.visibilityState==="visible"&&O("visibilitychange-visible")},ge=B=>{r.normalizeStartupAudio(B.persisted?"pagehide-bfcache":"pagehide-close",!1),e.info("audio","startup-audio-persisted","Persisted startup audio defaults during page hide",{persisted:B.persisted})},be=B=>{B.persisted&&(e.info("audio","startup-audio-restore","Restoring startup audio defaults after bfcache resume",{persisted:B.persisted}),r.normalizeStartupAudio("pageshow-bfcache"))},Me=()=>W("page-lifecycle-freeze"),Ne=()=>O("page-lifecycle-resume");document.addEventListener("visibilitychange",de),window.addEventListener("pagehide",ge),window.addEventListener("pageshow",be),window.addEventListener("freeze",Me),window.addEventListener("resume",Ne);let De=null;if(e.getMode()!=="default"&&typeof PerformanceObserver=="function")try{De=new PerformanceObserver(B=>{for(const ve of B.getEntries())e.warn("perf","long-task","Long task blocked the main thread",{duration:Math.round(ve.duration),startTime:Math.round(ve.startTime),name:ve.name})}),De.observe({type:"longtask",buffered:!0}),e.info("perf","longtask-observer-active","Long Tasks API observer attached")}catch(B){e.info("perf","longtask-unsupported","Long Tasks API not available",{message:B instanceof Error?B.message:String(B)})}let Pe;e.getMode()!=="default"&&(Pe=setInterval(()=>{se||e.info("renderer","snapshot","Renderer info snapshot",R.getRendererSnapshot())},5e3));const Qe=bi().getMode()!=="default";let rt=!1,st=!1;const Ct=B=>{Qe&&(B.key==="a"||B.key==="A"?(rt=!rt,k.material.setAlbedoOnly(rt),e.info("debug","albedo-toggle",`Albedo-only ${rt?"ON":"OFF"}`)):(B.key==="s"||B.key==="S")&&(st=!st,k.material.setShadowDebug(st),e.info("debug","shadow-toggle",`Shadow-only ${st?"ON":"OFF"}`)))};Qe&&(window.addEventListener("keydown",Ct),e.info("debug","controls",'Debug controls active: press "a" for albedo-only, "s" for shadow-only',{mode:e.getMode()}));let Ze=r.current;const Te=typeof window.requestIdleCallback=="function"?B=>window.requestIdleCallback(B,{timeout:200}):B=>window.setTimeout(B,0),pt=typeof window.cancelIdleCallback=="function"?B=>window.cancelIdleCallback(B):B=>window.clearTimeout(B);let $e=null;const zt=1e-6,Cn=r.subscribe(()=>{const B=r.current,ve=B.quality!==Ze.quality,Ae=B.audioMuted!==Ze.audioMuted||Math.abs(B.audioVolume-Ze.audioVolume)>zt;if(Ze=B,Ae){$e!==null&&(pt($e),$e=null),G(ve);return}$e!==null&&pt($e),$e=Te(()=>{$e=null,G(ve),R.prewarm(S.scene,S.camera)})}),Dt=B=>{var ve,Ae,qe,gt,Rt,Vt;ae.update(c[B],!0),Oe.setActive(B),ne((Ae=(ve=c[B])==null?void 0:ve.title)!=null?Ae:""),T==null||T.setSelectedArtworkId((gt=(qe=c[B])==null?void 0:qe.id)!=null?gt:null,{alignPage:!1,source:"gallery-navigate"}),e.info("gallery","navigate","Artwork changed",{index:B,artworkId:(Rt=c[B])==null?void 0:Rt.id,title:(Vt=c[B])==null?void 0:Vt.title})};D.onNavigate(Dt),_e.onPrev(()=>D.navigate(-1)),_e.onNext(()=>D.navigate(1)),_e.enableIdleHint(),Oe.onSelect(B=>D.goTo(B)),Oe.onPreview(B=>D.promotePrefetchWindow(B,"timeline-preview"));const Jt=new Pg({onStateChange:B=>{var ve;n.dataset.experience=B==="destination"?"gallery":B,ms(n,g,R),gs(e,`experience-state:${B}`,g,R,(ve=T==null?void 0:T.element)!=null?ve:null,y.overlay.isConnected?y.overlay:null,n),e.info("navigation","experience-state","Experience state changed",{state:B})},onTransitionError:(B,ve)=>{T.showError(),e.error("navigation","destination-transition-failed",`Failed to enter destination "${B.id}"`,ve)}});Jt.register({id:"hub",label:"Main Museum Hub",prepare:()=>T.prepare(),enter:()=>{var B,ve;k.group.visible=!1,re.setEnabled(!1),Ee.setEnabled(!1),T.setSelectedArtworkId((ve=(B=c[D.index])==null?void 0:B.id)!=null?ve:null,{alignPage:!0,source:"router-enter-hub"}),T.enter()},exit:()=>T.exit(r.current.reducedMotion)}),Jt.register({id:"gallery",label:"Interaktive Galerie",prepare:async()=>{k.group.visible=!0,D.resetView(),await Vn()},enter:()=>{var B;re.setEnabled(!0),Ee.setEnabled(!0),nt.focus({preventScroll:!0}),e.info("navigation","gallery-entered","Existing interactive gallery entered from museum hub",{artworkId:(B=c[D.index])==null?void 0:B.id})},exit:()=>{re.setEnabled(!1),Ee.setEnabled(!1)}}),T.onActivate(()=>{Jt.navigate("gallery")});const ut=new Map;c.forEach((B,ve)=>ut.set(B.id,ve));let Gt=0;T.onSelectSlot(B=>{const ve=++Gt,Ae=B.artworkId,qe=Ae!==null?ut.get(Ae):void 0;if(Ae===null||qe===void 0){e.warn("navigation","hub-slot-invalid","Hub slot activation without a valid exact target; ignoring",{slotId:B.id,artworkId:Ae}),T.showError();return}e.info("navigation","hub-slot-select","Hub frame selected",{slotId:B.id,artworkId:Ae,artworkIndex:qe,generation:ve}),D.goTo(qe),D.promotePrefetchWindow(qe,"hub-slot"),D.whenArtworkInteractive(qe,m.selectionTimeoutMs).then(gt=>{if(ve!==Gt){e.info("navigation","hub-slot-stale-readiness","Ignoring stale hub readiness completion",{slotId:B.id,artworkId:Ae,generation:ve,currentGeneration:Gt});return}gt==="timeout"&&e.warn("navigation","hub-slot-readiness-timeout","Hub readiness gate timed out; entering exact target with procedural surface",{slotId:B.id,artworkId:Ae,timeoutMs:m.selectionTimeoutMs}),D.index!==qe&&D.goTo(qe),Jt.navigate("gallery")})});const Li=()=>{Gt+=1,Y.setBackBusy(!0),Jt.navigate("hub").finally(()=>Y.setBackBusy(!1))};Y.onBackClick=Li,Ee.onEscape=()=>{document.querySelector(".keyboard-help:not([hidden])")||document.querySelector(".prefs__panel:not([hidden])")||Li()};const Nt=B=>{if(X=requestAnimationFrame(Nt),R.isRenderPaused()||se)return;D.hasReadinessWork()&&L.markReadinessWork();const ve=L.sample(B);D.markInteractionFrame(ve.dtMs);const Ae=ee.evaluate(ve,L);Ae&&Ae!==r.current.quality&&(e.warn("quality","adaptive-downgrade","Adaptive quality downgrade triggered",{from:r.current.quality,to:Ae,rollingFps:Math.round(ve.rollingFps*10)/10,rollingMs:Math.round(ve.rollingMs*10)/10,severeFrameCount:ve.severeFrameCount}),r.setQuality(Ae));const qe=V.update(B),gt=D.update(B);!qe&&!gt&&!D.hasReadinessWork()||(S.camera.updateMatrixWorld(),V.getKeyLightWorldDir(uc),hc.copy(uc).transformDirection(S.camera.matrixWorldInverse),k.material.setKeyLightDirView(hc),x.render())};X=requestAnimationFrame(Nt),e.info("boot","pre-entry-raf-start","Production RAF started under loading overlay before entry CTA",{artworkCount:Ke,renderer:An(R.renderer)}),await Vn(),e.info("boot","first-full-frame-rendered","First full-size production frame rendered under loading overlay",{activeArtwork:(_c=c[D.index])==null?void 0:_c.id,renderer:An(R.renderer)}),await Vn(),e.info("boot","second-full-frame-presented","Second full-size production frame presented under loading overlay; entry CTA may now be enabled",{activeArtwork:(vc=c[D.index])==null?void 0:vc.id,renderer:An(R.renderer)}),e.info("boot","entry-cta-enabled","Loading screen readiness gate complete; enabling entry CTA",{artworkCount:Ke,pendingCount:Se.pendingCount,finalPathWarmed:Pi,timelinePrewarm:$n,uiPrewarm:cr,renderer:An(R.renderer)}),e.info("boot","performance-gate","Startup performance gate (v0.67 P-07 acceptance evidence)",{schemaVersion:1,startupReadinessMode:$,artworkCount:Ke,automaticQualityChangesEnabled:he,activeQuality:r.current.quality,entryWarmCount:ie.length,deferredWarmCount:Re,preloadMode:Se.preloadMode,startupMsToEntryCta:Math.round((performance.now()-i)*10)/10,postRevealFrameBudgetMs:Z.postRevealFrameBudgetMs,postRevealBatchCap:Z.postRevealBatchCap,fullyReadyCount:Se.fullyReadyCount,pendingCount:Se.pendingCount,deferredArtworkCount:Se.deferredArtworkCount}),k.group.visible=!1,y.setStatus("Museum wird vorbereitet"),await Jt.startAt("hub"),y.setProgress(100),await y.reveal(),y.dispose(),T.focusInitialTarget(),window.addEventListener("beforeunload",()=>{r.normalizeStartupAudio("beforeunload-close",!1),cancelAnimationFrame(X),qn!==0&&cancelAnimationFrame(qn),$e!==null&&pt($e),De==null||De.disconnect(),Pe!==void 0&&clearInterval(Pe),N!==void 0&&clearTimeout(N),document.removeEventListener("visibilitychange",de),window.removeEventListener("pagehide",ge),window.removeEventListener("pageshow",be),window.removeEventListener("freeze",Me),window.removeEventListener("resume",Ne),Cn(),et(),Qe&&window.removeEventListener("keydown",Ct),window.removeEventListener("pointerdown",He),window.removeEventListener("keydown",ce),window.removeEventListener("pointerdown",ke),window.removeEventListener("pointerup",ze),window.removeEventListener("pointercancel",ze),me!==void 0&&clearTimeout(me),window.removeEventListener("resize",Qt),window.removeEventListener("orientationchange",Qt),w==null||w.removeEventListener("resize",Qt),w==null||w.removeEventListener("scroll",Qt),U==null||U.disconnect(),clearTimeout(Ii),e.info("boot","shutdown","Disposing FREYRAUM runtime"),Jt.dispose(),r.dispose(),re.dispose(),we.dispose(),Ee.dispose(),te.dispose(),Y.dispose(),ae.dispose(),q(),Ce==null||Ce.remove(),Ce=null,_e.dispose(),Ie.dispose(),Ge.dispose(),tt.dispose(),I.dispose(),ot.dispose(),Oe.dispose(),A.remove(),s.dispose(),k.dispose(),P.dispose(),D.proceduralFactory.disposeAll(),V.dispose(),x.dispose(),S.dispose(),R.dispose()})}f_().catch(i=>{bi().error("boot","startup-failed","Fatal startup failure",i);const e=document.getElementById("app");e&&da(e,i instanceof Error?i.message:"Unbekannter Fehler beim Initialisieren.")})})();
