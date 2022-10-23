// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

Object.create;
Object.defineProperty;
Object.getOwnPropertyDescriptor;
Object.getOwnPropertyNames;
Object.getPrototypeOf;
Object.prototype.hasOwnProperty;
((x)=>typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
        get: (a, b)=>(typeof require !== "undefined" ? require : a)[b]
    }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __accessCheck = (obj, member, msg)=>{
    if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter)=>{
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value)=>{
    if (member.has(obj)) throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter)=>{
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
};
var _hand;
var Player = class {
    constructor({ label , hand  }){
        __privateAdd(this, _hand, void 0);
        this.label = label;
        __privateSet(this, _hand, structuredClone(hand));
    }
    get hand() {
        return __privateGet(this, _hand);
    }
    removeCard(card) {
        const idx = __privateGet(this, _hand).findIndex((_card)=>{
            var _a;
            return ((_a = _card == null ? void 0 : _card.name) == null ? void 0 : _a.toLowerCase()) == card.name.toLowerCase();
        });
        __privateGet(this, _hand)[idx] = void 0;
    }
};
_hand = new WeakMap();
Player.One = "one";
Player.Two = "two";
var u = n;
function n(r, a) {
    if (!Array.isArray(r)) throw new Error("expected an array");
    if (r.length < 2) return r;
    for(var t = a && a.shuffleAll, l = r.slice(), e = r.length, f, h; --e > 0;){
        do f = Math.floor(Math.random() * (e + 1));
        while (t && f == e)
        (!t || f != e) && (h = l[e], l[e] = l[f], l[f] = h);
    }
    return l;
}
[
    Player.One,
    Player.Two
];
var version = "0.1.0";
var VERSION = version;
console.log(VERSION);
console.log(u([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
]));
