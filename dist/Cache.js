export class Cache{constructor(t){this.inItems=new Map,this.inKeys=new Set,this.inCapacity=t}get stored(){return this.inKeys.size}get capacity(){return this.inCapacity}has(t){return this.inKeys.has(t)}get(t){return this.inItems.get(t)}keys(){return new Set(this.inKeys)}values(){return[...this.inItems.values()]}entries(){return new Map(this.inItems.entries())}forget(t){this.has(t)&&(this.inItems.delete(t),this.inKeys.delete(t))}flush(){this.inItems.clear(),this.inKeys.clear()}remember(t,e){return this.has(t)?this.get(t):this.set(t,e())}set(t,e){if(this.inItems.has(t))return this.inItems.set(t,e),e;if(this.inKeys.add(t),this.inItems.set(t,e),this.inKeys.size>this.capacity){let[t]=this.inKeys;this.forget(t)}return e}setCapacity(t){this.inCapacity=t;let e=Math.max(0,this.inKeys.size-this.inCapacity);for(let t=0;t<e;t++){let[t]=this.inKeys;this.forget(t)}}}