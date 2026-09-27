import { a as e, c as t, i as n, l as r, n as i, o as a, r as o, s, t as c } from "./jsx-runtime-1iThtGjw.js";
//#region \0rolldown/runtime.js
var l = Object.defineProperty, u = (e, t) => {
	let n = {};
	for (var r in e) l(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || l(n, Symbol.toStringTag, { value: "Module" }), n;
}, d = globalThis.__FYUO_PLUGIN_HOST_V1__?.["react-router-dom"];
if (!d) throw Error("Plugin requires blog host API v1");
d.default, d.Await, d.BrowserRouter, d.Form, d.HashRouter, d.HydratedRouter, d.IDLE_BLOCKER, d.IDLE_FETCHER, d.IDLE_NAVIGATION, d.Link, d.Links, d.MemoryRouter, d.Meta, d.NavLink, d.Navigate, d.NavigationType, d.Outlet, d.PrefetchPageLinks, d.Route, d.Router, d.RouterContextProvider, d.RouterProvider, d.Routes, d.Scripts, d.ScrollRestoration, d.ServerRouter, d.StaticRouter, d.StaticRouterProvider, d.UNSAFE_AwaitContextProvider, d.UNSAFE_DataRouterContext, d.UNSAFE_DataRouterStateContext, d.UNSAFE_ErrorResponseImpl, d.UNSAFE_FetchersContext, d.UNSAFE_FrameworkContext, d.UNSAFE_LocationContext, d.UNSAFE_NavigationContext, d.UNSAFE_RSCDefaultRootErrorBoundary, d.UNSAFE_RemixErrorBoundary, d.UNSAFE_RouteContext, d.UNSAFE_ServerMode, d.UNSAFE_SingleFetchRedirectSymbol, d.UNSAFE_ViewTransitionContext, d.UNSAFE_WithComponentProps, d.UNSAFE_WithErrorBoundaryProps, d.UNSAFE_WithHydrateFallbackProps, d.UNSAFE_createBrowserHistory, d.UNSAFE_createClientRoutes, d.UNSAFE_createClientRoutesWithHMRRevalidationOptOut, d.UNSAFE_createHashHistory, d.UNSAFE_createMemoryHistory, d.UNSAFE_createRouter, d.UNSAFE_decodeViaTurboStream, d.UNSAFE_deserializeErrors, d.UNSAFE_getHydrationData, d.UNSAFE_getPatchRoutesOnNavigationFunction, d.UNSAFE_getTurboStreamSingleFetchDataStrategy, d.UNSAFE_hydrationRouteProperties, d.UNSAFE_invariant, d.UNSAFE_mapRouteProperties, d.UNSAFE_shouldHydrateRouteLoader, d.UNSAFE_useFogOFWarDiscovery, d.UNSAFE_useScrollRestoration, d.UNSAFE_withComponentProps, d.UNSAFE_withErrorBoundaryProps, d.UNSAFE_withHydrateFallbackProps, d.createBrowserRouter, d.createContext, d.createCookie, d.createCookieSessionStorage, d.createHashRouter, d.createMemoryRouter, d.createMemorySessionStorage, d.createPath, d.createRequestHandler, d.createRoutesFromChildren, d.createRoutesFromElements, d.createRoutesStub, d.createSearchParams, d.createSession, d.createSessionStorage, d.createStaticHandler, d.createStaticRouter, d.data, d.generatePath, d.href, d.isCookie, d.isRouteErrorResponse, d.isSession, d.matchPath, d.matchRoutes, d.parsePath, d.redirect, d.redirectDocument, d.renderMatches, d.replace, d.resolvePath, d.unstable_HistoryRouter, d.unstable_RSCStaticRouter, d.unstable_routeRSCServerRequest, d.unstable_setDevServerHooks, d.unstable_usePrompt, d.unstable_useRoute, d.unstable_useRouterState, d.useActionData, d.useAsyncError, d.useAsyncValue, d.useBeforeUnload, d.useBlocker, d.useFetcher, d.useFetchers, d.useFormAction, d.useHref, d.useInRouterContext, d.useLinkClickHandler, d.useLoaderData;
var f = d.useLocation;
d.useMatch, d.useMatches, d.useNavigate, d.useNavigation, d.useNavigationType, d.useOutlet, d.useOutletContext, d.useParams, d.useResolvedPath, d.useRevalidator, d.useRouteError, d.useRouteLoaderData, d.useRoutes, d.useSearchParams, d.useSubmit, d.useViewTransitionState;
//#endregion
//#region node_modules/axios/lib/helpers/bind.js
function p(e, t) {
	return function() {
		return e.apply(t, arguments);
	};
}
//#endregion
//#region node_modules/axios/lib/utils.js
var { toString: m } = Object.prototype, { getPrototypeOf: h } = Object, { iterator: g, toStringTag: _ } = Symbol, v = ((e) => (t) => {
	let n = m.call(t);
	return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(Object.create(null)), y = (e) => (e = e.toLowerCase(), (t) => v(t) === e), b = (e) => (t) => typeof t === e, { isArray: x } = Array, S = b("undefined");
function C(e) {
	return e !== null && !S(e) && e.constructor !== null && !S(e.constructor) && D(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
var w = y("ArrayBuffer");
function T(e) {
	let t;
	return t = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && w(e.buffer), t;
}
var E = b("string"), D = b("function"), O = b("number"), k = (e) => typeof e == "object" && !!e, A = (e) => e === !0 || e === !1, j = (e) => {
	if (v(e) !== "object") return !1;
	let t = h(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(_ in e) && !(g in e);
}, ee = (e) => {
	if (!k(e) || C(e)) return !1;
	try {
		return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
	} catch {
		return !1;
	}
}, te = y("Date"), ne = y("File"), re = (e) => !!(e && e.uri !== void 0), ie = (e) => e && e.getParts !== void 0, ae = y("Blob"), oe = y("FileList"), se = (e) => k(e) && D(e.pipe);
function ce() {
	return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
var le = ce(), ue = le.FormData === void 0 ? void 0 : le.FormData, de = (e) => {
	if (!e) return !1;
	if (ue && e instanceof ue) return !0;
	let t = h(e);
	if (!t || t === Object.prototype || !D(e.append)) return !1;
	let n = v(e);
	return n === "formdata" || n === "object" && D(e.toString) && e.toString() === "[object FormData]";
}, fe = y("URLSearchParams"), [pe, me, he, ge] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(y), _e = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function M(e, t, { allOwnKeys: n = !1 } = {}) {
	if (e == null) return;
	let r, i;
	if (typeof e != "object" && (e = [e]), x(e)) for (r = 0, i = e.length; r < i; r++) t.call(null, e[r], r, e);
	else {
		if (C(e)) return;
		let i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length, o;
		for (r = 0; r < a; r++) o = i[r], t.call(null, e[o], o, e);
	}
}
function ve(e, t) {
	if (C(e)) return null;
	t = t.toLowerCase();
	let n = Object.keys(e), r = n.length, i;
	for (; r-- > 0;) if (i = n[r], t === i.toLowerCase()) return i;
	return null;
}
var N = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, ye = (e) => !S(e) && e !== N;
function be(...e) {
	let { caseless: t, skipUndefined: n } = ye(this) && this || {}, r = {}, i = (e, i) => {
		if (i === "__proto__" || i === "constructor" || i === "prototype") return;
		let a = t && ve(r, i) || i, o = Me(r, a) ? r[a] : void 0;
		j(o) && j(e) ? r[a] = be(o, e) : j(e) ? r[a] = be({}, e) : x(e) ? r[a] = e.slice() : (!n || !S(e)) && (r[a] = e);
	};
	for (let t = 0, n = e.length; t < n; t++) e[t] && M(e[t], i);
	return r;
}
var xe = (e, t, n, { allOwnKeys: r } = {}) => (M(t, (t, r) => {
	n && D(t) ? Object.defineProperty(e, r, {
		__proto__: null,
		value: p(t, n),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : Object.defineProperty(e, r, {
		__proto__: null,
		value: t,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}, { allOwnKeys: r }), e), Se = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Ce = (e, t, n, r) => {
	e.prototype = Object.create(t.prototype, r), Object.defineProperty(e.prototype, "constructor", {
		__proto__: null,
		value: e,
		writable: !0,
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(e, "super", {
		__proto__: null,
		value: t.prototype
	}), n && Object.assign(e.prototype, n);
}, we = (e, t, n, r) => {
	let i, a, o, s = {};
	if (t ||= {}, e == null) return t;
	do {
		for (i = Object.getOwnPropertyNames(e), a = i.length; a-- > 0;) o = i[a], (!r || r(o, e, t)) && !s[o] && (t[o] = e[o], s[o] = !0);
		e = n !== !1 && h(e);
	} while (e && (!n || n(e, t)) && e !== Object.prototype);
	return t;
}, Te = (e, t, n) => {
	e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
	let r = e.indexOf(t, n);
	return r !== -1 && r === n;
}, Ee = (e) => {
	if (!e) return null;
	if (x(e)) return e;
	let t = e.length;
	if (!O(t)) return null;
	let n = Array(t);
	for (; t-- > 0;) n[t] = e[t];
	return n;
}, De = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && h(Uint8Array)), Oe = (e, t) => {
	let n = (e && e[g]).call(e), r;
	for (; (r = n.next()) && !r.done;) {
		let n = r.value;
		t.call(e, n[0], n[1]);
	}
}, ke = (e, t) => {
	let n, r = [];
	for (; (n = e.exec(t)) !== null;) r.push(n);
	return r;
}, Ae = y("HTMLFormElement"), je = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(e, t, n) {
	return t.toUpperCase() + n;
}), Me = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), Ne = y("RegExp"), Pe = (e, t) => {
	let n = Object.getOwnPropertyDescriptors(e), r = {};
	M(n, (n, i) => {
		let a;
		(a = t(n, i, e)) !== !1 && (r[i] = a || n);
	}), Object.defineProperties(e, r);
}, Fe = (e) => {
	Pe(e, (t, n) => {
		if (D(e) && [
			"arguments",
			"caller",
			"callee"
		].includes(n)) return !1;
		let r = e[n];
		if (D(r)) {
			if (t.enumerable = !1, "writable" in t) {
				t.writable = !1;
				return;
			}
			t.set ||= () => {
				throw Error("Can not rewrite read-only method '" + n + "'");
			};
		}
	});
}, Ie = (e, t) => {
	let n = {}, r = (e) => {
		e.forEach((e) => {
			n[e] = !0;
		});
	};
	return x(e) ? r(e) : r(String(e).split(t)), n;
}, Le = () => {}, Re = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function ze(e) {
	return !!(e && D(e.append) && e[_] === "FormData" && e[g]);
}
var Be = (e) => {
	let t = /* @__PURE__ */ new WeakSet(), n = (e) => {
		if (k(e)) {
			if (t.has(e)) return;
			if (C(e)) return e;
			if (!("toJSON" in e)) {
				t.add(e);
				let r = x(e) ? [] : {};
				return M(e, (e, t) => {
					let i = n(e);
					!S(i) && (r[t] = i);
				}), t.delete(e), r;
			}
		}
		return e;
	};
	return n(e);
}, Ve = y("AsyncFunction"), He = (e) => e && (k(e) || D(e)) && D(e.then) && D(e.catch), Ue = ((e, t) => e ? setImmediate : t ? ((e, t) => (N.addEventListener("message", ({ source: n, data: r }) => {
	n === N && r === e && t.length && t.shift()();
}, !1), (n) => {
	t.push(n), N.postMessage(e, "*");
}))(`axios@${Math.random()}`, []) : (e) => setTimeout(e))(typeof setImmediate == "function", D(N.postMessage)), P = {
	isArray: x,
	isArrayBuffer: w,
	isBuffer: C,
	isFormData: de,
	isArrayBufferView: T,
	isString: E,
	isNumber: O,
	isBoolean: A,
	isObject: k,
	isPlainObject: j,
	isEmptyObject: ee,
	isReadableStream: pe,
	isRequest: me,
	isResponse: he,
	isHeaders: ge,
	isUndefined: S,
	isDate: te,
	isFile: ne,
	isReactNativeBlob: re,
	isReactNative: ie,
	isBlob: ae,
	isRegExp: Ne,
	isFunction: D,
	isStream: se,
	isURLSearchParams: fe,
	isTypedArray: De,
	isFileList: oe,
	forEach: M,
	merge: be,
	extend: xe,
	trim: _e,
	stripBOM: Se,
	inherits: Ce,
	toFlatObject: we,
	kindOf: v,
	kindOfTest: y,
	endsWith: Te,
	toArray: Ee,
	forEachEntry: Oe,
	matchAll: ke,
	isHTMLForm: Ae,
	hasOwnProperty: Me,
	hasOwnProp: Me,
	reduceDescriptors: Pe,
	freezeMethods: Fe,
	toObjectSet: Ie,
	toCamelCase: je,
	noop: Le,
	toFiniteNumber: Re,
	findKey: ve,
	global: N,
	isContextDefined: ye,
	isSpecCompliantForm: ze,
	toJSONObject: Be,
	isAsyncFn: Ve,
	isThenable: He,
	setImmediate: Ue,
	asap: typeof queueMicrotask < "u" ? queueMicrotask.bind(N) : typeof process < "u" && process.nextTick || Ue,
	isIterable: (e) => e != null && D(e[g])
}, We = P.toObjectSet([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"user-agent"
]), Ge = (e) => {
	let t = {}, n, r, i;
	return e && e.split("\n").forEach(function(e) {
		i = e.indexOf(":"), n = e.substring(0, i).trim().toLowerCase(), r = e.substring(i + 1).trim(), !(!n || t[n] && We[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
	}), t;
};
//#endregion
//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
function Ke(e) {
	let t = 0, n = e.length;
	for (; t < n;) {
		let n = e.charCodeAt(t);
		if (n !== 9 && n !== 32) break;
		t += 1;
	}
	for (; n > t;) {
		let t = e.charCodeAt(n - 1);
		if (t !== 9 && t !== 32) break;
		--n;
	}
	return t === 0 && n === e.length ? e : e.slice(t, n);
}
var qe = /* @__PURE__ */ RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), Je = /* @__PURE__ */ RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function Ye(e, t) {
	return P.isArray(e) ? e.map((e) => Ye(e, t)) : Ke(String(e).replace(t, ""));
}
var Xe = (e) => Ye(e, qe), Ze = (e) => Ye(e, Je);
function Qe(e) {
	let t = Object.create(null);
	return P.forEach(e.toJSON(), (e, n) => {
		t[n] = Ze(e);
	}), t;
}
//#endregion
//#region node_modules/axios/lib/core/AxiosHeaders.js
var $e = Symbol("internals");
function F(e) {
	return e && String(e).trim().toLowerCase();
}
function I(e) {
	return e === !1 || e == null ? e : P.isArray(e) ? e.map(I) : Xe(String(e));
}
function et(e) {
	let t = Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g, r;
	for (; r = n.exec(e);) t[r[1]] = r[2];
	return t;
}
var tt = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function nt(e, t, n, r, i) {
	if (P.isFunction(r)) return r.call(this, t, n);
	if (i && (t = n), P.isString(t)) {
		if (P.isString(r)) return t.indexOf(r) !== -1;
		if (P.isRegExp(r)) return r.test(t);
	}
}
function rt(e) {
	return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
}
function it(e, t) {
	let n = P.toCamelCase(" " + t);
	[
		"get",
		"set",
		"has"
	].forEach((r) => {
		Object.defineProperty(e, r + n, {
			__proto__: null,
			value: function(e, n, i) {
				return this[r].call(this, t, e, n, i);
			},
			configurable: !0
		});
	});
}
var L = class {
	constructor(e) {
		e && this.set(e);
	}
	set(e, t, n) {
		let r = this;
		function i(e, t, n) {
			let i = F(t);
			if (!i) throw Error("header name must be a non-empty string");
			let a = P.findKey(r, i);
			(!a || r[a] === void 0 || n === !0 || n === void 0 && r[a] !== !1) && (r[a || t] = I(e));
		}
		let a = (e, t) => P.forEach(e, (e, n) => i(e, n, t));
		if (P.isPlainObject(e) || e instanceof this.constructor) a(e, t);
		else if (P.isString(e) && (e = e.trim()) && !tt(e)) a(Ge(e), t);
		else if (P.isObject(e) && P.isIterable(e)) {
			let n = {}, r, i;
			for (let t of e) {
				if (!P.isArray(t)) throw TypeError("Object iterator must return a key-value pair");
				n[i = t[0]] = (r = n[i]) ? P.isArray(r) ? [...r, t[1]] : [r, t[1]] : t[1];
			}
			a(n, t);
		} else e != null && i(t, e, n);
		return this;
	}
	get(e, t) {
		if (e = F(e), e) {
			let n = P.findKey(this, e);
			if (n) {
				let e = this[n];
				if (!t) return e;
				if (t === !0) return et(e);
				if (P.isFunction(t)) return t.call(this, e, n);
				if (P.isRegExp(t)) return t.exec(e);
				throw TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(e, t) {
		if (e = F(e), e) {
			let n = P.findKey(this, e);
			return !!(n && this[n] !== void 0 && (!t || nt(this, this[n], n, t)));
		}
		return !1;
	}
	delete(e, t) {
		let n = this, r = !1;
		function i(e) {
			if (e = F(e), e) {
				let i = P.findKey(n, e);
				i && (!t || nt(n, n[i], i, t)) && (delete n[i], r = !0);
			}
		}
		return P.isArray(e) ? e.forEach(i) : i(e), r;
	}
	clear(e) {
		let t = Object.keys(this), n = t.length, r = !1;
		for (; n--;) {
			let i = t[n];
			(!e || nt(this, this[i], i, e, !0)) && (delete this[i], r = !0);
		}
		return r;
	}
	normalize(e) {
		let t = this, n = {};
		return P.forEach(this, (r, i) => {
			let a = P.findKey(n, i);
			if (a) {
				t[a] = I(r), delete t[i];
				return;
			}
			let o = e ? rt(i) : String(i).trim();
			o !== i && delete t[i], t[o] = I(r), n[o] = !0;
		}), this;
	}
	concat(...e) {
		return this.constructor.concat(this, ...e);
	}
	toJSON(e) {
		let t = Object.create(null);
		return P.forEach(this, (n, r) => {
			n != null && n !== !1 && (t[r] = e && P.isArray(n) ? n.join(", ") : n);
		}), t;
	}
	[Symbol.iterator]() {
		return Object.entries(this.toJSON())[Symbol.iterator]();
	}
	toString() {
		return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join("\n");
	}
	getSetCookie() {
		return this.get("set-cookie") || [];
	}
	get [Symbol.toStringTag]() {
		return "AxiosHeaders";
	}
	static from(e) {
		return e instanceof this ? e : new this(e);
	}
	static concat(e, ...t) {
		let n = new this(e);
		return t.forEach((e) => n.set(e)), n;
	}
	static accessor(e) {
		let t = (this[$e] = this[$e] = { accessors: {} }).accessors, n = this.prototype;
		function r(e) {
			let r = F(e);
			t[r] || (it(n, e), t[r] = !0);
		}
		return P.isArray(e) ? e.forEach(r) : r(e), this;
	}
};
L.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]), P.reduceDescriptors(L.prototype, ({ value: e }, t) => {
	let n = t[0].toUpperCase() + t.slice(1);
	return {
		get: () => e,
		set(e) {
			this[n] = e;
		}
	};
}), P.freezeMethods(L);
//#endregion
//#region node_modules/axios/lib/core/AxiosError.js
var at = "[REDACTED ****]";
function ot(e) {
	if (P.hasOwnProp(e, "toJSON")) return !0;
	let t = Object.getPrototypeOf(e);
	for (; t && t !== Object.prototype;) {
		if (P.hasOwnProp(t, "toJSON")) return !0;
		t = Object.getPrototypeOf(t);
	}
	return !1;
}
function st(e, t) {
	let n = new Set(t.map((e) => String(e).toLowerCase())), r = [], i = (e) => {
		if (typeof e != "object" || !e || P.isBuffer(e)) return e;
		if (r.indexOf(e) !== -1) return;
		e instanceof L && (e = e.toJSON()), r.push(e);
		let t;
		if (P.isArray(e)) t = [], e.forEach((e, n) => {
			let r = i(e);
			P.isUndefined(r) || (t[n] = r);
		});
		else {
			if (!P.isPlainObject(e) && ot(e)) return r.pop(), e;
			t = Object.create(null);
			for (let [r, a] of Object.entries(e)) {
				let e = n.has(r.toLowerCase()) ? at : i(a);
				P.isUndefined(e) || (t[r] = e);
			}
		}
		return r.pop(), t;
	};
	return i(e);
}
var R = class e extends Error {
	static from(t, n, r, i, a, o) {
		let s = new e(t.message, n || t.code, r, i, a);
		return s.cause = t, s.name = t.name, t.status != null && s.status == null && (s.status = t.status), o && Object.assign(s, o), s;
	}
	constructor(e, t, n, r, i) {
		super(e), Object.defineProperty(this, "message", {
			__proto__: null,
			value: e,
			enumerable: !0,
			writable: !0,
			configurable: !0
		}), this.name = "AxiosError", this.isAxiosError = !0, t && (this.code = t), n && (this.config = n), r && (this.request = r), i && (this.response = i, this.status = i.status);
	}
	toJSON() {
		let e = this.config, t = e && P.hasOwnProp(e, "redact") ? e.redact : void 0, n = P.isArray(t) && t.length > 0 ? st(e, t) : P.toJSONObject(e);
		return {
			message: this.message,
			name: this.name,
			description: this.description,
			number: this.number,
			fileName: this.fileName,
			lineNumber: this.lineNumber,
			columnNumber: this.columnNumber,
			stack: this.stack,
			config: n,
			code: this.code,
			status: this.status
		};
	}
};
R.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE", R.ERR_BAD_OPTION = "ERR_BAD_OPTION", R.ECONNABORTED = "ECONNABORTED", R.ETIMEDOUT = "ETIMEDOUT", R.ECONNREFUSED = "ECONNREFUSED", R.ERR_NETWORK = "ERR_NETWORK", R.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS", R.ERR_DEPRECATED = "ERR_DEPRECATED", R.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE", R.ERR_BAD_REQUEST = "ERR_BAD_REQUEST", R.ERR_CANCELED = "ERR_CANCELED", R.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT", R.ERR_INVALID_URL = "ERR_INVALID_URL", R.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
//#endregion
//#region node_modules/axios/lib/helpers/toFormData.js
function ct(e) {
	return P.isPlainObject(e) || P.isArray(e);
}
function lt(e) {
	return P.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function ut(e, t, n) {
	return e ? e.concat(t).map(function(e, t) {
		return e = lt(e), !n && t ? "[" + e + "]" : e;
	}).join(n ? "." : "") : t;
}
function dt(e) {
	return P.isArray(e) && !e.some(ct);
}
var ft = P.toFlatObject(P, {}, null, function(e) {
	return /^is[A-Z]/.test(e);
});
function z(e, t, n) {
	if (!P.isObject(e)) throw TypeError("target must be an object");
	t ||= new FormData(), n = P.toFlatObject(n, {
		metaTokens: !0,
		dots: !1,
		indexes: !1
	}, !1, function(e, t) {
		return !P.isUndefined(t[e]);
	});
	let r = n.metaTokens, i = n.visitor || d, a = n.dots, o = n.indexes, s = n.Blob || typeof Blob < "u" && Blob, c = n.maxDepth === void 0 ? 100 : n.maxDepth, l = s && P.isSpecCompliantForm(t);
	if (!P.isFunction(i)) throw TypeError("visitor must be a function");
	function u(e) {
		if (e === null) return "";
		if (P.isDate(e)) return e.toISOString();
		if (P.isBoolean(e)) return e.toString();
		if (!l && P.isBlob(e)) throw new R("Blob is not supported. Use a Buffer instead.");
		return P.isArrayBuffer(e) || P.isTypedArray(e) ? l && typeof Blob == "function" ? new Blob([e]) : Buffer.from(e) : e;
	}
	function d(e, n, i) {
		let s = e;
		if (P.isReactNative(t) && P.isReactNativeBlob(e)) return t.append(ut(i, n, a), u(e)), !1;
		if (e && !i && typeof e == "object") {
			if (P.endsWith(n, "{}")) n = r ? n : n.slice(0, -2), e = JSON.stringify(e);
			else if (P.isArray(e) && dt(e) || (P.isFileList(e) || P.endsWith(n, "[]")) && (s = P.toArray(e))) return n = lt(n), s.forEach(function(e, r) {
				!(P.isUndefined(e) || e === null) && t.append(o === !0 ? ut([n], r, a) : o === null ? n : n + "[]", u(e));
			}), !1;
		}
		return ct(e) ? !0 : (t.append(ut(i, n, a), u(e)), !1);
	}
	let f = [], p = Object.assign(ft, {
		defaultVisitor: d,
		convertValue: u,
		isVisitable: ct
	});
	function m(e, n, r = 0) {
		if (!P.isUndefined(e)) {
			if (r > c) throw new R("Object is too deeply nested (" + r + " levels). Max depth: " + c, R.ERR_FORM_DATA_DEPTH_EXCEEDED);
			if (f.indexOf(e) !== -1) throw Error("Circular reference detected in " + n.join("."));
			f.push(e), P.forEach(e, function(e, a) {
				(!(P.isUndefined(e) || e === null) && i.call(t, e, P.isString(a) ? a.trim() : a, n, p)) === !0 && m(e, n ? n.concat(a) : [a], r + 1);
			}), f.pop();
		}
	}
	if (!P.isObject(e)) throw TypeError("data must be an object");
	return m(e), t;
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function pt(e) {
	let t = {
		"!": "%21",
		"'": "%27",
		"(": "%28",
		")": "%29",
		"~": "%7E",
		"%20": "+"
	};
	return encodeURIComponent(e).replace(/[!'()~]|%20/g, function(e) {
		return t[e];
	});
}
function mt(e, t) {
	this._pairs = [], e && z(e, this, t);
}
var ht = mt.prototype;
ht.append = function(e, t) {
	this._pairs.push([e, t]);
}, ht.toString = function(e) {
	let t = e ? function(t) {
		return e.call(this, t, pt);
	} : pt;
	return this._pairs.map(function(e) {
		return t(e[0]) + "=" + t(e[1]);
	}, "").join("&");
};
//#endregion
//#region node_modules/axios/lib/helpers/buildURL.js
function gt(e) {
	return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function _t(e, t, n) {
	if (!t) return e;
	let r = n && n.encode || gt, i = P.isFunction(n) ? { serialize: n } : n, a = i && i.serialize, o;
	if (o = a ? a(t, i) : P.isURLSearchParams(t) ? t.toString() : new mt(t, i).toString(r), o) {
		let t = e.indexOf("#");
		t !== -1 && (e = e.slice(0, t)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
	}
	return e;
}
//#endregion
//#region node_modules/axios/lib/core/InterceptorManager.js
var vt = class {
	constructor() {
		this.handlers = [];
	}
	use(e, t, n) {
		return this.handlers.push({
			fulfilled: e,
			rejected: t,
			synchronous: n ? n.synchronous : !1,
			runWhen: n ? n.runWhen : null
		}), this.handlers.length - 1;
	}
	eject(e) {
		this.handlers[e] && (this.handlers[e] = null);
	}
	clear() {
		this.handlers &&= [];
	}
	forEach(e) {
		P.forEach(this.handlers, function(t) {
			t !== null && e(t);
		});
	}
}, yt = {
	silentJSONParsing: !0,
	forcedJSONParsing: !0,
	clarifyTimeoutError: !1,
	legacyInterceptorReqResOrdering: !0
}, bt = {
	isBrowser: !0,
	classes: {
		URLSearchParams: typeof URLSearchParams < "u" ? URLSearchParams : mt,
		FormData: typeof FormData < "u" ? FormData : null,
		Blob: typeof Blob < "u" ? Blob : null
	},
	protocols: [
		"http",
		"https",
		"file",
		"blob",
		"url",
		"data"
	]
}, xt = /* @__PURE__ */ u({
	hasBrowserEnv: () => St,
	hasStandardBrowserEnv: () => wt,
	hasStandardBrowserWebWorkerEnv: () => Tt,
	navigator: () => Ct,
	origin: () => Et
}), St = typeof window < "u" && typeof document < "u", Ct = typeof navigator == "object" && navigator || void 0, wt = St && (!Ct || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(Ct.product) < 0), Tt = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Et = St && window.location.href || "http://localhost", B = {
	...xt,
	...bt
};
//#endregion
//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
function Dt(e, t) {
	return z(e, new B.classes.URLSearchParams(), {
		visitor: function(e, t, n, r) {
			return B.isNode && P.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : r.defaultVisitor.apply(this, arguments);
		},
		...t
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/formDataToJSON.js
function Ot(e) {
	return P.matchAll(/\w+|\[(\w*)]/g, e).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function kt(e) {
	let t = {}, n = Object.keys(e), r, i = n.length, a;
	for (r = 0; r < i; r++) a = n[r], t[a] = e[a];
	return t;
}
function At(e) {
	function t(e, n, r, i) {
		let a = e[i++];
		if (a === "__proto__") return !0;
		let o = Number.isFinite(+a), s = i >= e.length;
		return a = !a && P.isArray(r) ? r.length : a, s ? (P.hasOwnProp(r, a) ? r[a] = P.isArray(r[a]) ? r[a].concat(n) : [r[a], n] : r[a] = n, !o) : ((!P.hasOwnProp(r, a) || !P.isObject(r[a])) && (r[a] = []), t(e, n, r[a], i) && P.isArray(r[a]) && (r[a] = kt(r[a])), !o);
	}
	if (P.isFormData(e) && P.isFunction(e.entries)) {
		let n = {};
		return P.forEachEntry(e, (e, r) => {
			t(Ot(e), r, n, 0);
		}), n;
	}
	return null;
}
//#endregion
//#region node_modules/axios/lib/defaults/index.js
var V = (e, t) => e != null && P.hasOwnProp(e, t) ? e[t] : void 0;
function jt(e, t, n) {
	if (P.isString(e)) try {
		return (t || JSON.parse)(e), P.trim(e);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (n || JSON.stringify)(e);
}
var H = {
	transitional: yt,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function(e, t) {
		let n = t.getContentType() || "", r = n.indexOf("application/json") > -1, i = P.isObject(e);
		if (i && P.isHTMLForm(e) && (e = new FormData(e)), P.isFormData(e)) return r ? JSON.stringify(At(e)) : e;
		if (P.isArrayBuffer(e) || P.isBuffer(e) || P.isStream(e) || P.isFile(e) || P.isBlob(e) || P.isReadableStream(e)) return e;
		if (P.isArrayBufferView(e)) return e.buffer;
		if (P.isURLSearchParams(e)) return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
		let a;
		if (i) {
			let t = V(this, "formSerializer");
			if (n.indexOf("application/x-www-form-urlencoded") > -1) return Dt(e, t).toString();
			if ((a = P.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
				let n = V(this, "env"), r = n && n.FormData;
				return z(a ? { "files[]": e } : e, r && new r(), t);
			}
		}
		return i || r ? (t.setContentType("application/json", !1), jt(e)) : e;
	}],
	transformResponse: [function(e) {
		let t = V(this, "transitional") || H.transitional, n = t && t.forcedJSONParsing, r = V(this, "responseType"), i = r === "json";
		if (P.isResponse(e) || P.isReadableStream(e)) return e;
		if (e && P.isString(e) && (n && !r || i)) {
			let n = !(t && t.silentJSONParsing) && i;
			try {
				return JSON.parse(e, V(this, "parseReviver"));
			} catch (e) {
				if (n) throw e.name === "SyntaxError" ? R.from(e, R.ERR_BAD_RESPONSE, this, null, V(this, "response")) : e;
			}
		}
		return e;
	}],
	timeout: 0,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
	maxContentLength: -1,
	maxBodyLength: -1,
	env: {
		FormData: B.classes.FormData,
		Blob: B.classes.Blob
	},
	validateStatus: function(e) {
		return e >= 200 && e < 300;
	},
	headers: { common: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
P.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch",
	"query"
], (e) => {
	H.headers[e] = {};
});
//#endregion
//#region node_modules/axios/lib/core/transformData.js
function Mt(e, t) {
	let n = this || H, r = t || n, i = L.from(r.headers), a = r.data;
	return P.forEach(e, function(e) {
		a = e.call(n, a, i.normalize(), t ? t.status : void 0);
	}), i.normalize(), a;
}
//#endregion
//#region node_modules/axios/lib/cancel/isCancel.js
function Nt(e) {
	return !!(e && e.__CANCEL__);
}
//#endregion
//#region node_modules/axios/lib/cancel/CanceledError.js
var U = class extends R {
	constructor(e, t, n) {
		super(e ?? "canceled", R.ERR_CANCELED, t, n), this.name = "CanceledError", this.__CANCEL__ = !0;
	}
};
//#endregion
//#region node_modules/axios/lib/core/settle.js
function Pt(e, t, n) {
	let r = n.config.validateStatus;
	!n.status || !r || r(n.status) ? e(n) : t(new R("Request failed with status code " + n.status, n.status >= 400 && n.status < 500 ? R.ERR_BAD_REQUEST : R.ERR_BAD_RESPONSE, n.config, n.request, n));
}
//#endregion
//#region node_modules/axios/lib/helpers/parseProtocol.js
function Ft(e) {
	let t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
	return t && t[1] || "";
}
//#endregion
//#region node_modules/axios/lib/helpers/speedometer.js
function It(e, t) {
	e ||= 10;
	let n = Array(e), r = Array(e), i = 0, a = 0, o;
	return t = t === void 0 ? 1e3 : t, function(s) {
		let c = Date.now(), l = r[a];
		o ||= c, n[i] = s, r[i] = c;
		let u = a, d = 0;
		for (; u !== i;) d += n[u++], u %= e;
		if (i = (i + 1) % e, i === a && (a = (a + 1) % e), c - o < t) return;
		let f = l && c - l;
		return f ? Math.round(d * 1e3 / f) : void 0;
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/throttle.js
function Lt(e, t) {
	let n = 0, r = 1e3 / t, i, a, o = (t, r = Date.now()) => {
		n = r, i = null, a &&= (clearTimeout(a), null), e(...t);
	};
	return [(...e) => {
		let t = Date.now(), s = t - n;
		s >= r ? o(e, t) : (i = e, a ||= setTimeout(() => {
			a = null, o(i);
		}, r - s));
	}, () => i && o(i)];
}
//#endregion
//#region node_modules/axios/lib/helpers/progressEventReducer.js
var W = (e, t, n = 3) => {
	let r = 0, i = It(50, 250);
	return Lt((n) => {
		if (!n || typeof n.loaded != "number") return;
		let a = n.loaded, o = n.lengthComputable ? n.total : void 0, s = o == null ? a : Math.min(a, o), c = Math.max(0, s - r), l = i(c);
		r = Math.max(r, s), e({
			loaded: s,
			total: o,
			progress: o ? s / o : void 0,
			bytes: c,
			rate: l || void 0,
			estimated: l && o ? (o - s) / l : void 0,
			event: n,
			lengthComputable: o != null,
			[t ? "download" : "upload"]: !0
		});
	}, n);
}, Rt = (e, t) => {
	let n = e != null;
	return [(r) => t[0]({
		lengthComputable: n,
		total: e,
		loaded: r
	}), t[1]];
}, zt = (e) => (...t) => P.asap(() => e(...t)), Bt = B.hasStandardBrowserEnv ? ((e, t) => (n) => (n = new URL(n, B.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(new URL(B.origin), B.navigator && /(msie|trident)/i.test(B.navigator.userAgent)) : () => !0, Vt = B.hasStandardBrowserEnv ? {
	write(e, t, n, r, i, a, o) {
		if (typeof document > "u") return;
		let s = [`${e}=${encodeURIComponent(t)}`];
		P.isNumber(n) && s.push(`expires=${new Date(n).toUTCString()}`), P.isString(r) && s.push(`path=${r}`), P.isString(i) && s.push(`domain=${i}`), a === !0 && s.push("secure"), P.isString(o) && s.push(`SameSite=${o}`), document.cookie = s.join("; ");
	},
	read(e) {
		if (typeof document > "u") return null;
		let t = document.cookie.split(";");
		for (let n = 0; n < t.length; n++) {
			let r = t[n].replace(/^\s+/, ""), i = r.indexOf("=");
			if (i !== -1 && r.slice(0, i) === e) return decodeURIComponent(r.slice(i + 1));
		}
		return null;
	},
	remove(e) {
		this.write(e, "", Date.now() - 864e5, "/");
	}
} : {
	write() {},
	read() {
		return null;
	},
	remove() {}
};
//#endregion
//#region node_modules/axios/lib/helpers/isAbsoluteURL.js
function Ht(e) {
	return typeof e == "string" ? /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e) : !1;
}
//#endregion
//#region node_modules/axios/lib/helpers/combineURLs.js
function Ut(e, t) {
	return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
//#endregion
//#region node_modules/axios/lib/core/buildFullPath.js
function Wt(e, t, n) {
	let r = !Ht(t);
	return e && (r || n === !1) ? Ut(e, t) : t;
}
//#endregion
//#region node_modules/axios/lib/core/mergeConfig.js
var Gt = (e) => e instanceof L ? { ...e } : e;
function G(e, t) {
	t ||= {};
	let n = Object.create(null);
	Object.defineProperty(n, "hasOwnProperty", {
		__proto__: null,
		value: Object.prototype.hasOwnProperty,
		enumerable: !1,
		writable: !0,
		configurable: !0
	});
	function r(e, t, n, r) {
		return P.isPlainObject(e) && P.isPlainObject(t) ? P.merge.call({ caseless: r }, e, t) : P.isPlainObject(t) ? P.merge({}, t) : P.isArray(t) ? t.slice() : t;
	}
	function i(e, t, n, i) {
		if (!P.isUndefined(t)) return r(e, t, n, i);
		if (!P.isUndefined(e)) return r(void 0, e, n, i);
	}
	function a(e, t) {
		if (!P.isUndefined(t)) return r(void 0, t);
	}
	function o(e, t) {
		if (!P.isUndefined(t)) return r(void 0, t);
		if (!P.isUndefined(e)) return r(void 0, e);
	}
	function s(n, i, a) {
		if (P.hasOwnProp(t, a)) return r(n, i);
		if (P.hasOwnProp(e, a)) return r(void 0, n);
	}
	let c = {
		url: a,
		method: a,
		data: a,
		baseURL: o,
		transformRequest: o,
		transformResponse: o,
		paramsSerializer: o,
		timeout: o,
		timeoutMessage: o,
		withCredentials: o,
		withXSRFToken: o,
		adapter: o,
		responseType: o,
		xsrfCookieName: o,
		xsrfHeaderName: o,
		onUploadProgress: o,
		onDownloadProgress: o,
		decompress: o,
		maxContentLength: o,
		maxBodyLength: o,
		beforeRedirect: o,
		transport: o,
		httpAgent: o,
		httpsAgent: o,
		cancelToken: o,
		socketPath: o,
		allowedSocketPaths: o,
		responseEncoding: o,
		validateStatus: s,
		headers: (e, t, n) => i(Gt(e), Gt(t), n, !0)
	};
	return P.forEach(Object.keys({
		...e,
		...t
	}), function(r) {
		if (r === "__proto__" || r === "constructor" || r === "prototype") return;
		let a = P.hasOwnProp(c, r) ? c[r] : i, o = a(P.hasOwnProp(e, r) ? e[r] : void 0, P.hasOwnProp(t, r) ? t[r] : void 0, r);
		P.isUndefined(o) && a !== s || (n[r] = o);
	}), n;
}
//#endregion
//#region node_modules/axios/lib/helpers/resolveConfig.js
var Kt = ["content-type", "content-length"];
function qt(e, t, n) {
	if (n !== "content-only") {
		e.set(t);
		return;
	}
	Object.entries(t).forEach(([t, n]) => {
		Kt.includes(t.toLowerCase()) && e.set(t, n);
	});
}
var Jt = (e) => encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (e, t) => String.fromCharCode(parseInt(t, 16))), Yt = (e) => {
	let t = G({}, e), n = (e) => P.hasOwnProp(t, e) ? t[e] : void 0, r = n("data"), i = n("withXSRFToken"), a = n("xsrfHeaderName"), o = n("xsrfCookieName"), s = n("headers"), c = n("auth"), l = n("baseURL"), u = n("allowAbsoluteUrls"), d = n("url");
	if (t.headers = s = L.from(s), t.url = _t(Wt(l, d, u), e.params, e.paramsSerializer), c && s.set("Authorization", "Basic " + btoa((c.username || "") + ":" + (c.password ? Jt(c.password) : ""))), P.isFormData(r) && (B.hasStandardBrowserEnv || B.hasStandardBrowserWebWorkerEnv ? s.setContentType(void 0) : P.isFunction(r.getHeaders) && qt(s, r.getHeaders(), n("formDataHeaderPolicy"))), B.hasStandardBrowserEnv && (P.isFunction(i) && (i = i(t)), i === !0 || i == null && Bt(t.url))) {
		let e = a && o && Vt.read(o);
		e && s.set(a, e);
	}
	return t;
}, Xt = typeof XMLHttpRequest < "u" && function(e) {
	return new Promise(function(t, n) {
		let r = Yt(e), i = r.data, a = L.from(r.headers).normalize(), { responseType: o, onUploadProgress: s, onDownloadProgress: c } = r, l, u, d, f, p;
		function m() {
			f && f(), p && p(), r.cancelToken && r.cancelToken.unsubscribe(l), r.signal && r.signal.removeEventListener("abort", l);
		}
		let h = new XMLHttpRequest();
		h.open(r.method.toUpperCase(), r.url, !0), h.timeout = r.timeout;
		function g() {
			if (!h) return;
			let r = L.from("getAllResponseHeaders" in h && h.getAllResponseHeaders());
			Pt(function(e) {
				t(e), m();
			}, function(e) {
				n(e), m();
			}, {
				data: !o || o === "text" || o === "json" ? h.responseText : h.response,
				status: h.status,
				statusText: h.statusText,
				headers: r,
				config: e,
				request: h
			}), h = null;
		}
		"onloadend" in h ? h.onloadend = g : h.onreadystatechange = function() {
			!h || h.readyState !== 4 || h.status === 0 && !(h.responseURL && h.responseURL.startsWith("file:")) || setTimeout(g);
		}, h.onabort = function() {
			h &&= (n(new R("Request aborted", R.ECONNABORTED, e, h)), m(), null);
		}, h.onerror = function(t) {
			let r = new R(t && t.message ? t.message : "Network Error", R.ERR_NETWORK, e, h);
			r.event = t || null, n(r), m(), h = null;
		}, h.ontimeout = function() {
			let t = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded", i = r.transitional || yt;
			r.timeoutErrorMessage && (t = r.timeoutErrorMessage), n(new R(t, i.clarifyTimeoutError ? R.ETIMEDOUT : R.ECONNABORTED, e, h)), m(), h = null;
		}, i === void 0 && a.setContentType(null), "setRequestHeader" in h && P.forEach(Qe(a), function(e, t) {
			h.setRequestHeader(t, e);
		}), P.isUndefined(r.withCredentials) || (h.withCredentials = !!r.withCredentials), o && o !== "json" && (h.responseType = r.responseType), c && ([d, p] = W(c, !0), h.addEventListener("progress", d)), s && h.upload && ([u, f] = W(s), h.upload.addEventListener("progress", u), h.upload.addEventListener("loadend", f)), (r.cancelToken || r.signal) && (l = (t) => {
			h &&= (n(!t || t.type ? new U(null, e, h) : t), h.abort(), m(), null);
		}, r.cancelToken && r.cancelToken.subscribe(l), r.signal && (r.signal.aborted ? l() : r.signal.addEventListener("abort", l)));
		let _ = Ft(r.url);
		if (_ && !B.protocols.includes(_)) {
			n(new R("Unsupported protocol " + _ + ":", R.ERR_BAD_REQUEST, e));
			return;
		}
		h.send(i || null);
	});
}, Zt = (e, t) => {
	if (e = e ? e.filter(Boolean) : [], !t && !e.length) return;
	let n = new AbortController(), r = !1, i = function(e) {
		if (!r) {
			r = !0, o();
			let t = e instanceof Error ? e : this.reason;
			n.abort(t instanceof R ? t : new U(t instanceof Error ? t.message : t));
		}
	}, a = t && setTimeout(() => {
		a = null, i(new R(`timeout of ${t}ms exceeded`, R.ETIMEDOUT));
	}, t), o = () => {
		e &&= (a && clearTimeout(a), a = null, e.forEach((e) => {
			e.unsubscribe ? e.unsubscribe(i) : e.removeEventListener("abort", i);
		}), null);
	};
	e.forEach((e) => e.addEventListener("abort", i));
	let { signal: s } = n;
	return s.unsubscribe = () => P.asap(o), s;
}, Qt = function* (e, t) {
	let n = e.byteLength;
	if (!t || n < t) {
		yield e;
		return;
	}
	let r = 0, i;
	for (; r < n;) i = r + t, yield e.slice(r, i), r = i;
}, $t = async function* (e, t) {
	for await (let n of en(e)) yield* Qt(n, t);
}, en = async function* (e) {
	if (e[Symbol.asyncIterator]) {
		yield* e;
		return;
	}
	let t = e.getReader();
	try {
		for (;;) {
			let { done: e, value: n } = await t.read();
			if (e) break;
			yield n;
		}
	} finally {
		await t.cancel();
	}
}, tn = (e, t, n, r) => {
	let i = $t(e, t), a = 0, o, s = (e) => {
		o || (o = !0, r && r(e));
	};
	return new ReadableStream({
		async pull(e) {
			try {
				let { done: t, value: r } = await i.next();
				if (t) {
					s(), e.close();
					return;
				}
				let o = r.byteLength;
				n && n(a += o), e.enqueue(new Uint8Array(r));
			} catch (e) {
				throw s(e), e;
			}
		},
		cancel(e) {
			return s(e), i.return();
		}
	}, { highWaterMark: 2 });
};
//#endregion
//#region node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
function nn(e) {
	if (!e || typeof e != "string" || !e.startsWith("data:")) return 0;
	let t = e.indexOf(",");
	if (t < 0) return 0;
	let n = e.slice(5, t), r = e.slice(t + 1);
	if (/;base64/i.test(n)) {
		let e = r.length, t = r.length;
		for (let n = 0; n < t; n++) if (r.charCodeAt(n) === 37 && n + 2 < t) {
			let t = r.charCodeAt(n + 1), i = r.charCodeAt(n + 2);
			(t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102) && (i >= 48 && i <= 57 || i >= 65 && i <= 70 || i >= 97 && i <= 102) && (e -= 2, n += 2);
		}
		let n = 0, i = t - 1, a = (e) => e >= 2 && r.charCodeAt(e - 2) === 37 && r.charCodeAt(e - 1) === 51 && (r.charCodeAt(e) === 68 || r.charCodeAt(e) === 100);
		i >= 0 && (r.charCodeAt(i) === 61 ? (n++, i--) : a(i) && (n++, i -= 3)), n === 1 && i >= 0 && (r.charCodeAt(i) === 61 || a(i)) && n++;
		let o = Math.floor(e / 4) * 3 - (n || 0);
		return o > 0 ? o : 0;
	}
	if (typeof Buffer < "u" && typeof Buffer.byteLength == "function") return Buffer.byteLength(r, "utf8");
	let i = 0;
	for (let e = 0, t = r.length; e < t; e++) {
		let n = r.charCodeAt(e);
		if (n < 128) i += 1;
		else if (n < 2048) i += 2;
		else if (n >= 55296 && n <= 56319 && e + 1 < t) {
			let t = r.charCodeAt(e + 1);
			t >= 56320 && t <= 57343 ? (i += 4, e++) : i += 3;
		} else i += 3;
	}
	return i;
}
//#endregion
//#region node_modules/axios/lib/env/data.js
var rn = "1.16.1", an = 64 * 1024, { isFunction: K } = P, on = (e, ...t) => {
	try {
		return !!e(...t);
	} catch {
		return !1;
	}
}, sn = (e) => {
	let t = P.global !== void 0 && P.global !== null ? P.global : globalThis, { ReadableStream: n, TextEncoder: r } = t;
	e = P.merge.call({ skipUndefined: !0 }, {
		Request: t.Request,
		Response: t.Response
	}, e);
	let { fetch: i, Request: a, Response: o } = e, s = i ? K(i) : typeof fetch == "function", c = K(a), l = K(o);
	if (!s) return !1;
	let u = s && K(n), d = s && (typeof r == "function" ? ((e) => (t) => e.encode(t))(new r()) : async (e) => new Uint8Array(await new a(e).arrayBuffer())), f = c && u && on(() => {
		let e = !1, t = new a(B.origin, {
			body: new n(),
			method: "POST",
			get duplex() {
				return e = !0, "half";
			}
		}), r = t.headers.has("Content-Type");
		return t.body != null && t.body.cancel(), e && !r;
	}), p = l && u && on(() => P.isReadableStream(new o("").body)), m = { stream: p && ((e) => e.body) };
	s && [
		"text",
		"arrayBuffer",
		"blob",
		"formData",
		"stream"
	].forEach((e) => {
		!m[e] && (m[e] = (t, n) => {
			let r = t && t[e];
			if (r) return r.call(t);
			throw new R(`Response type '${e}' is not supported`, R.ERR_NOT_SUPPORT, n);
		});
	});
	let h = async (e) => {
		if (e == null) return 0;
		if (P.isBlob(e)) return e.size;
		if (P.isSpecCompliantForm(e)) return (await new a(B.origin, {
			method: "POST",
			body: e
		}).arrayBuffer()).byteLength;
		if (P.isArrayBufferView(e) || P.isArrayBuffer(e)) return e.byteLength;
		if (P.isURLSearchParams(e) && (e += ""), P.isString(e)) return (await d(e)).byteLength;
	}, g = async (e, t) => P.toFiniteNumber(e.getContentLength()) ?? h(t);
	return async (e) => {
		let { url: t, method: n, data: s, signal: l, cancelToken: u, timeout: d, onDownloadProgress: h, onUploadProgress: _, responseType: v, headers: y, withCredentials: b = "same-origin", fetchOptions: x, maxContentLength: S, maxBodyLength: C } = Yt(e), w = P.isNumber(S) && S > -1, T = P.isNumber(C) && C > -1, E = i || fetch;
		v = v ? (v + "").toLowerCase() : "text";
		let D = Zt([l, u && u.toAbortSignal()], d), O = null, k = D && D.unsubscribe && (() => {
			D.unsubscribe();
		}), A;
		try {
			if (w && typeof t == "string" && t.startsWith("data:") && nn(t) > S) throw new R("maxContentLength size of " + S + " exceeded", R.ERR_BAD_RESPONSE, e, O);
			if (T && n !== "get" && n !== "head") {
				let t = await g(y, s);
				if (typeof t == "number" && isFinite(t) && t > C) throw new R("Request body larger than maxBodyLength limit", R.ERR_BAD_REQUEST, e, O);
			}
			if (_ && f && n !== "get" && n !== "head" && (A = await g(y, s)) !== 0) {
				let e = new a(t, {
					method: "POST",
					body: s,
					duplex: "half"
				}), n;
				if (P.isFormData(s) && (n = e.headers.get("content-type")) && y.setContentType(n), e.body) {
					let [t, n] = Rt(A, W(zt(_)));
					s = tn(e.body, an, t, n);
				}
			}
			P.isString(b) || (b = b ? "include" : "omit");
			let i = c && "credentials" in a.prototype;
			if (P.isFormData(s)) {
				let e = y.getContentType();
				e && /^multipart\/form-data/i.test(e) && !/boundary=/i.test(e) && y.delete("content-type");
			}
			y.set("User-Agent", "axios/" + rn, !1);
			let l = {
				...x,
				signal: D,
				method: n.toUpperCase(),
				headers: Qe(y.normalize()),
				body: s,
				duplex: "half",
				credentials: i ? b : void 0
			};
			O = c && new a(t, l);
			let u = await (c ? E(O, x) : E(t, l));
			if (w) {
				let t = P.toFiniteNumber(u.headers.get("content-length"));
				if (t != null && t > S) throw new R("maxContentLength size of " + S + " exceeded", R.ERR_BAD_RESPONSE, e, O);
			}
			let d = p && (v === "stream" || v === "response");
			if (p && u.body && (h || w || d && k)) {
				let t = {};
				[
					"status",
					"statusText",
					"headers"
				].forEach((e) => {
					t[e] = u[e];
				});
				let n = P.toFiniteNumber(u.headers.get("content-length")), [r, i] = h && Rt(n, W(zt(h), !0)) || [], a = 0;
				u = new o(tn(u.body, an, (t) => {
					if (w && (a = t, a > S)) throw new R("maxContentLength size of " + S + " exceeded", R.ERR_BAD_RESPONSE, e, O);
					r && r(t);
				}, () => {
					i && i(), k && k();
				}), t);
			}
			v ||= "text";
			let j = await m[P.findKey(m, v) || "text"](u, e);
			if (w && !p && !d) {
				let t;
				if (j != null && (typeof j.byteLength == "number" ? t = j.byteLength : typeof j.size == "number" ? t = j.size : typeof j == "string" && (t = typeof r == "function" ? new r().encode(j).byteLength : j.length)), typeof t == "number" && t > S) throw new R("maxContentLength size of " + S + " exceeded", R.ERR_BAD_RESPONSE, e, O);
			}
			return !d && k && k(), await new Promise((t, n) => {
				Pt(t, n, {
					data: j,
					headers: L.from(u.headers),
					status: u.status,
					statusText: u.statusText,
					config: e,
					request: O
				});
			});
		} catch (t) {
			if (k && k(), D && D.aborted && D.reason instanceof R) {
				let n = D.reason;
				throw n.config = e, O && (n.request = O), t !== n && (n.cause = t), n;
			}
			throw t && t.name === "TypeError" && /Load failed|fetch/i.test(t.message) ? Object.assign(new R("Network Error", R.ERR_NETWORK, e, O, t && t.response), { cause: t.cause || t }) : R.from(t, t && t.code, e, O, t && t.response);
		}
	};
}, cn = /* @__PURE__ */ new Map(), ln = (e) => {
	let t = e && e.env || {}, { fetch: n, Request: r, Response: i } = t, a = [
		r,
		i,
		n
	], o = a.length, s, c, l = cn;
	for (; o--;) s = a[o], c = l.get(s), c === void 0 && l.set(s, c = o ? /* @__PURE__ */ new Map() : sn(t)), l = c;
	return c;
};
ln();
//#endregion
//#region node_modules/axios/lib/adapters/adapters.js
var un = {
	http: null,
	xhr: Xt,
	fetch: { get: ln }
};
P.forEach(un, (e, t) => {
	if (e) {
		try {
			Object.defineProperty(e, "name", {
				__proto__: null,
				value: t
			});
		} catch {}
		Object.defineProperty(e, "adapterName", {
			__proto__: null,
			value: t
		});
	}
});
var dn = (e) => `- ${e}`, fn = (e) => P.isFunction(e) || e === null || e === !1;
function pn(e, t) {
	e = P.isArray(e) ? e : [e];
	let { length: n } = e, r, i, a = {};
	for (let o = 0; o < n; o++) {
		r = e[o];
		let n;
		if (i = r, !fn(r) && (i = un[(n = String(r)).toLowerCase()], i === void 0)) throw new R(`Unknown adapter '${n}'`);
		if (i && (P.isFunction(i) || (i = i.get(t)))) break;
		a[n || "#" + o] = i;
	}
	if (!i) {
		let e = Object.entries(a).map(([e, t]) => `adapter ${e} ` + (t === !1 ? "is not supported by the environment" : "is not available in the build"));
		throw new R("There is no suitable adapter to dispatch the request " + (n ? e.length > 1 ? "since :\n" + e.map(dn).join("\n") : " " + dn(e[0]) : "as no adapter specified"), "ERR_NOT_SUPPORT");
	}
	return i;
}
var mn = {
	getAdapter: pn,
	adapters: un
};
//#endregion
//#region node_modules/axios/lib/core/dispatchRequest.js
function hn(e) {
	if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new U(null, e);
}
function gn(e) {
	return hn(e), e.headers = L.from(e.headers), e.data = Mt.call(e, e.transformRequest), [
		"post",
		"put",
		"patch"
	].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), mn.getAdapter(e.adapter || H.adapter, e)(e).then(function(t) {
		hn(e), e.response = t;
		try {
			t.data = Mt.call(e, e.transformResponse, t);
		} finally {
			delete e.response;
		}
		return t.headers = L.from(t.headers), t;
	}, function(t) {
		if (!Nt(t) && (hn(e), t && t.response)) {
			e.response = t.response;
			try {
				t.response.data = Mt.call(e, e.transformResponse, t.response);
			} finally {
				delete e.response;
			}
			t.response.headers = L.from(t.response.headers);
		}
		return Promise.reject(t);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/validator.js
var q = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((e, t) => {
	q[e] = function(n) {
		return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
	};
});
var _n = {};
q.transitional = function(e, t, n) {
	function r(e, t) {
		return "[Axios v" + rn + "] Transitional option '" + e + "'" + t + (n ? ". " + n : "");
	}
	return (n, i, a) => {
		if (e === !1) throw new R(r(i, " has been removed" + (t ? " in " + t : "")), R.ERR_DEPRECATED);
		return t && !_n[i] && (_n[i] = !0, console.warn(r(i, " has been deprecated since v" + t + " and will be removed in the near future"))), e ? e(n, i, a) : !0;
	};
}, q.spelling = function(e) {
	return (t, n) => (console.warn(`${n} is likely a misspelling of ${e}`), !0);
};
function vn(e, t, n) {
	if (typeof e != "object") throw new R("options must be an object", R.ERR_BAD_OPTION_VALUE);
	let r = Object.keys(e), i = r.length;
	for (; i-- > 0;) {
		let a = r[i], o = Object.prototype.hasOwnProperty.call(t, a) ? t[a] : void 0;
		if (o) {
			let t = e[a], n = t === void 0 || o(t, a, e);
			if (n !== !0) throw new R("option " + a + " must be " + n, R.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (n !== !0) throw new R("Unknown option " + a, R.ERR_BAD_OPTION);
	}
}
var J = {
	assertOptions: vn,
	validators: q
}, Y = J.validators, X = class {
	constructor(e) {
		this.defaults = e || {}, this.interceptors = {
			request: new vt(),
			response: new vt()
		};
	}
	async request(e, t) {
		try {
			return await this._request(e, t);
		} catch (e) {
			if (e instanceof Error) {
				let t = {};
				Error.captureStackTrace ? Error.captureStackTrace(t) : t = /* @__PURE__ */ Error();
				let n = (() => {
					if (!t.stack) return "";
					let e = t.stack.indexOf("\n");
					return e === -1 ? "" : t.stack.slice(e + 1);
				})();
				try {
					if (!e.stack) e.stack = n;
					else if (n) {
						let t = n.indexOf("\n"), r = t === -1 ? -1 : n.indexOf("\n", t + 1), i = r === -1 ? "" : n.slice(r + 1);
						String(e.stack).endsWith(i) || (e.stack += "\n" + n);
					}
				} catch {}
			}
			throw e;
		}
	}
	_request(e, t) {
		typeof e == "string" ? (t ||= {}, t.url = e) : t = e || {}, t = G(this.defaults, t);
		let { transitional: n, paramsSerializer: r, headers: i } = t;
		n !== void 0 && J.assertOptions(n, {
			silentJSONParsing: Y.transitional(Y.boolean),
			forcedJSONParsing: Y.transitional(Y.boolean),
			clarifyTimeoutError: Y.transitional(Y.boolean),
			legacyInterceptorReqResOrdering: Y.transitional(Y.boolean)
		}, !1), r != null && (P.isFunction(r) ? t.paramsSerializer = { serialize: r } : J.assertOptions(r, {
			encode: Y.function,
			serialize: Y.function
		}, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls === void 0 ? t.allowAbsoluteUrls = !0 : t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls), J.assertOptions(t, {
			baseUrl: Y.spelling("baseURL"),
			withXsrfToken: Y.spelling("withXSRFToken")
		}, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
		let a = i && P.merge(i.common, i[t.method]);
		i && P.forEach([
			"delete",
			"get",
			"head",
			"post",
			"put",
			"patch",
			"query",
			"common"
		], (e) => {
			delete i[e];
		}), t.headers = L.concat(a, i);
		let o = [], s = !0;
		this.interceptors.request.forEach(function(e) {
			if (typeof e.runWhen == "function" && e.runWhen(t) === !1) return;
			s &&= e.synchronous;
			let n = t.transitional || yt;
			n && n.legacyInterceptorReqResOrdering ? o.unshift(e.fulfilled, e.rejected) : o.push(e.fulfilled, e.rejected);
		});
		let c = [];
		this.interceptors.response.forEach(function(e) {
			c.push(e.fulfilled, e.rejected);
		});
		let l, u = 0, d;
		if (!s) {
			let e = [gn.bind(this), void 0];
			for (e.unshift(...o), e.push(...c), d = e.length, l = Promise.resolve(t); u < d;) l = l.then(e[u++], e[u++]);
			return l;
		}
		d = o.length;
		let f = t;
		for (; u < d;) {
			let e = o[u++], t = o[u++];
			try {
				f = e(f);
			} catch (e) {
				t.call(this, e);
				break;
			}
		}
		try {
			l = gn.call(this, f);
		} catch (e) {
			return Promise.reject(e);
		}
		for (u = 0, d = c.length; u < d;) l = l.then(c[u++], c[u++]);
		return l;
	}
	getUri(e) {
		return e = G(this.defaults, e), _t(Wt(e.baseURL, e.url, e.allowAbsoluteUrls), e.params, e.paramsSerializer);
	}
};
P.forEach([
	"delete",
	"get",
	"head",
	"options"
], function(e) {
	X.prototype[e] = function(t, n) {
		return this.request(G(n || {}, {
			method: e,
			url: t,
			data: (n || {}).data
		}));
	};
}), P.forEach([
	"post",
	"put",
	"patch",
	"query"
], function(e) {
	function t(t) {
		return function(n, r, i) {
			return this.request(G(i || {}, {
				method: e,
				headers: t ? { "Content-Type": "multipart/form-data" } : {},
				url: n,
				data: r
			}));
		};
	}
	X.prototype[e] = t(), e !== "query" && (X.prototype[e + "Form"] = t(!0));
});
//#endregion
//#region node_modules/axios/lib/cancel/CancelToken.js
var yn = class e {
	constructor(e) {
		if (typeof e != "function") throw TypeError("executor must be a function.");
		let t;
		this.promise = new Promise(function(e) {
			t = e;
		});
		let n = this;
		this.promise.then((e) => {
			if (!n._listeners) return;
			let t = n._listeners.length;
			for (; t-- > 0;) n._listeners[t](e);
			n._listeners = null;
		}), this.promise.then = (e) => {
			let t, r = new Promise((e) => {
				n.subscribe(e), t = e;
			}).then(e);
			return r.cancel = function() {
				n.unsubscribe(t);
			}, r;
		}, e(function(e, r, i) {
			n.reason || (n.reason = new U(e, r, i), t(n.reason));
		});
	}
	throwIfRequested() {
		if (this.reason) throw this.reason;
	}
	subscribe(e) {
		if (this.reason) {
			e(this.reason);
			return;
		}
		this._listeners ? this._listeners.push(e) : this._listeners = [e];
	}
	unsubscribe(e) {
		if (!this._listeners) return;
		let t = this._listeners.indexOf(e);
		t !== -1 && this._listeners.splice(t, 1);
	}
	toAbortSignal() {
		let e = new AbortController(), t = (t) => {
			e.abort(t);
		};
		return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
	}
	static source() {
		let t;
		return {
			token: new e(function(e) {
				t = e;
			}),
			cancel: t
		};
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/spread.js
function bn(e) {
	return function(t) {
		return e.apply(null, t);
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/isAxiosError.js
function xn(e) {
	return P.isObject(e) && e.isAxiosError === !0;
}
//#endregion
//#region node_modules/axios/lib/helpers/HttpStatusCode.js
var Sn = {
	Continue: 100,
	SwitchingProtocols: 101,
	Processing: 102,
	EarlyHints: 103,
	Ok: 200,
	Created: 201,
	Accepted: 202,
	NonAuthoritativeInformation: 203,
	NoContent: 204,
	ResetContent: 205,
	PartialContent: 206,
	MultiStatus: 207,
	AlreadyReported: 208,
	ImUsed: 226,
	MultipleChoices: 300,
	MovedPermanently: 301,
	Found: 302,
	SeeOther: 303,
	NotModified: 304,
	UseProxy: 305,
	Unused: 306,
	TemporaryRedirect: 307,
	PermanentRedirect: 308,
	BadRequest: 400,
	Unauthorized: 401,
	PaymentRequired: 402,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,
	NotAcceptable: 406,
	ProxyAuthenticationRequired: 407,
	RequestTimeout: 408,
	Conflict: 409,
	Gone: 410,
	LengthRequired: 411,
	PreconditionFailed: 412,
	PayloadTooLarge: 413,
	UriTooLong: 414,
	UnsupportedMediaType: 415,
	RangeNotSatisfiable: 416,
	ExpectationFailed: 417,
	ImATeapot: 418,
	MisdirectedRequest: 421,
	UnprocessableEntity: 422,
	Locked: 423,
	FailedDependency: 424,
	TooEarly: 425,
	UpgradeRequired: 426,
	PreconditionRequired: 428,
	TooManyRequests: 429,
	RequestHeaderFieldsTooLarge: 431,
	UnavailableForLegalReasons: 451,
	InternalServerError: 500,
	NotImplemented: 501,
	BadGateway: 502,
	ServiceUnavailable: 503,
	GatewayTimeout: 504,
	HttpVersionNotSupported: 505,
	VariantAlsoNegotiates: 506,
	InsufficientStorage: 507,
	LoopDetected: 508,
	NotExtended: 510,
	NetworkAuthenticationRequired: 511,
	WebServerIsDown: 521,
	ConnectionTimedOut: 522,
	OriginIsUnreachable: 523,
	TimeoutOccurred: 524,
	SslHandshakeFailed: 525,
	InvalidSslCertificate: 526
};
Object.entries(Sn).forEach(([e, t]) => {
	Sn[t] = e;
});
//#endregion
//#region node_modules/axios/lib/axios.js
function Cn(e) {
	let t = new X(e), n = p(X.prototype.request, t);
	return P.extend(n, X.prototype, t, { allOwnKeys: !0 }), P.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(t) {
		return Cn(G(e, t));
	}, n;
}
var Z = Cn(H);
Z.Axios = X, Z.CanceledError = U, Z.CancelToken = yn, Z.isCancel = Nt, Z.VERSION = rn, Z.toFormData = z, Z.AxiosError = R, Z.Cancel = Z.CanceledError, Z.all = function(e) {
	return Promise.all(e);
}, Z.spread = bn, Z.isAxiosError = xn, Z.mergeConfig = G, Z.AxiosHeaders = L, Z.formToJSON = (e) => At(P.isHTMLForm(e) ? new FormData(e) : e), Z.getAdapter = mn.getAdapter, Z.HttpStatusCode = Sn, Z.default = Z;
//#endregion
//#region src/api.js
var wn = "/api/v1", Tn = (e) => !!(e?.isBackendOffline || typeof e?.response?.status == "number" && e.response.status >= 500 || e?.code === "ERR_NETWORK" || e?.code === "ECONNABORTED" || e?.message === "Network Error" || !e?.response && e?.request), Q = Z.create({
	baseURL: wn,
	timeout: 3500
});
Q.interceptors.response.use((e) => e, (e) => (!e.response && (e.request || e.message === "Network Error") && (e.isBackendOffline = !0, e.message = "Backend is not connected. Start the backend server to enable blog data."), Promise.reject(e)));
var En = (e) => e ? { headers: { Authorization: `Bearer ${e}` } } : {}, Dn = () => Q.get("/travel-places"), On = (e, t) => Q.post("/travel-places", e, En(t)), kn = (e, t, n) => Q.put(`/travel-places/${e}`, t, En(n)), An = (e, t) => Q.delete(`/travel-places/${e}`, En(t));
//#endregion
//#region src/components/ConstructionNotice.jsx
function jn() {
	return /* @__PURE__ */ c("aside", {
		className: "construction-notice",
		role: "status",
		"aria-label": "施工中：此页面正在建设。",
		children: /* @__PURE__ */ i("div", {
			className: "construction-notice__band",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ c("span", { className: "construction-notice__clearance" }), /* @__PURE__ */ c("strong", { children: "施工中" })]
		})
	});
}
//#endregion
//#region src/pages/Travel.jsx
var Mn = n(() => import("./TravelGlobe-CtnYyHO3.js")), $ = {
	id: null,
	name: "",
	latitude: "",
	longitude: "",
	gallery: "",
	route: ""
};
function Nn(e) {
	return e ? {
		id: e.id,
		name: e.name,
		latitude: String(e.latitude),
		longitude: String(e.longitude),
		gallery: (e.gallery || []).join("\n"),
		route: (e.route || []).map((e) => `${e.latitude}, ${e.longitude}`).join("\n")
	} : $;
}
function Pn(e) {
	let t = e.route.split("\n").map((e) => e.trim()).filter(Boolean).map((e) => {
		let [t, n] = e.split(",").map((e) => Number(e.trim()));
		return {
			latitude: t,
			longitude: n
		};
	});
	return {
		name: e.name.trim(),
		latitude: Number(e.latitude),
		longitude: Number(e.longitude),
		gallery: e.gallery.split("\n").map((e) => e.trim()).filter(Boolean),
		route: t
	};
}
function Fn(e) {
	return `${Number(e.latitude).toFixed(4)}°, ${Number(e.longitude).toFixed(4)}°`;
}
function In({ user: n, onOpenSignIn: l, onLogout: u, onNotify: d }) {
	let p = f(), [m, h] = r([]), [g, _] = r(null), [v, y] = r($), [b, x] = r(!1), [S, C] = r(""), [w, T] = r(!1), E = t(""), D = s(() => m.find((e) => e.id === g) || null, [m, g]), O = e(async () => {
		C("");
		try {
			let e = (await Dn()).data?.data || [];
			h(e), _((t) => t ?? e[0]?.id ?? null);
		} catch (e) {
			C(Tn(e) ? "Travel records are waiting for the backend connection." : "Locations could not be loaded right now.");
		}
	}, []);
	a(() => {
		let e = window.setTimeout(() => {
			O();
		}, 0);
		return () => window.clearTimeout(e);
	}, [O]);
	let k = e((e) => {
		_(e.id), y(Nn(e)), T(!!n?.token);
	}, [n?.token]);
	a(() => {
		let e = () => {
			n?.token && (_(null), y($), C(""), T(!0));
		};
		return window.addEventListener("fyuo:edit-place", e), () => window.removeEventListener("fyuo:edit-place", e);
	}, [n?.token]), a(() => {
		let e = new URLSearchParams(p.search), t = e.get("desk");
		if (!n?.token || !t || E.current === p.search) return;
		let r = window.setTimeout(() => {
			if (t === "new") {
				_(null), y($), C(""), T(!0), E.current = p.search;
				return;
			}
			let n = Number(e.get("id")), r = m.find((e) => e.id === n);
			t === "edit" && r && (k(r), E.current = p.search);
		}, 0);
		return () => window.clearTimeout(r);
	}, [
		p.search,
		m,
		k,
		n?.token
	]);
	let A = (e) => {
		let { name: t, value: n } = e.target;
		y((e) => ({
			...e,
			[t]: n
		}));
	};
	return /* @__PURE__ */ i("div", {
		className: "travel-page travel-page--globe",
		children: [
			/* @__PURE__ */ c(jn, {}),
			/* @__PURE__ */ i("section", {
				className: "travel-globe-stage",
				"aria-label": "Interactive travel globe",
				children: [
					/* @__PURE__ */ i("header", {
						className: "travel-globe-stage__header",
						children: [
							/* @__PURE__ */ c("p", {
								className: "travel-globe-stage__edition",
								children: "FYUO863 / GEO ARCHIVE"
							}),
							/* @__PURE__ */ c("h1", { children: "Earth, marked." }),
							/* @__PURE__ */ c("p", { children: "Every pin starts with a coordinate. Routes are optional; the globe is the index." })
						]
					}),
					/* @__PURE__ */ c(o, {
						fallback: /* @__PURE__ */ c("div", {
							className: "travel-globe__fallback",
							role: "status",
							"aria-label": "Loading globe."
						}),
						children: /* @__PURE__ */ c(Mn, {
							places: m,
							onSelectPlace: k
						})
					}),
					D ? /* @__PURE__ */ i("article", {
						className: "travel-globe-note",
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ i("p", {
								className: "travel-globe-note__index",
								children: ["PIN ", String(m.indexOf(D) + 1).padStart(2, "0")]
							}),
							/* @__PURE__ */ c("h2", { children: D.name }),
							/* @__PURE__ */ c("p", { children: Fn(D) }),
							D.gallery?.[0] && /* @__PURE__ */ c("img", {
								src: D.gallery[0],
								alt: `${D.name} travel record`,
								loading: "lazy"
							})
						]
					}) : null
				]
			}),
			n && w && /* @__PURE__ */ i("section", {
				className: "travel-place-editor",
				"aria-labelledby": "travel-place-editor-title",
				children: [/* @__PURE__ */ i("header", { children: [/* @__PURE__ */ c("p", { children: "AUTHORISED FIELD EDITOR" }), /* @__PURE__ */ c("h2", {
					id: "travel-place-editor-title",
					children: v.id ? "Adjust a pin." : "Mark a place."
				})] }), /* @__PURE__ */ i("form", {
					onSubmit: async (e) => {
						if (e.preventDefault(), !n?.token) {
							u?.(), l();
							return;
						}
						let t = Pn(v);
						if (!t.name || !Number.isFinite(t.latitude) || !Number.isFinite(t.longitude)) {
							C("A name plus valid latitude and longitude are required.");
							return;
						}
						if (t.route.some((e) => !Number.isFinite(e.latitude) || !Number.isFinite(e.longitude))) {
							C("Each route waypoint needs a latitude and longitude, separated by a comma.");
							return;
						}
						x(!0), C("");
						try {
							let e = (v.id ? await kn(v.id, t, n.token) : await On(t, n.token)).data?.data;
							h((t) => v.id ? t.map((t) => t.id === e.id ? e : t) : [e, ...t]), k(e);
						} catch (e) {
							e?.response?.status === 401 && (u?.(), l());
							let t = Tn(e) ? "The backend is unavailable, so this location was not saved." : e?.response?.data?.error || "This location could not be saved.";
							C(t), d?.({
								title: "travel edit unavailable.",
								message: t
							});
						} finally {
							x(!1);
						}
					},
					children: [
						/* @__PURE__ */ i("label", { children: ["Name", /* @__PURE__ */ c("input", {
							name: "name",
							value: v.name,
							onChange: A,
							required: !0,
							placeholder: "Kyoto"
						})] }),
						/* @__PURE__ */ i("label", { children: ["Latitude", /* @__PURE__ */ c("input", {
							name: "latitude",
							value: v.latitude,
							onChange: A,
							required: !0,
							inputMode: "decimal",
							placeholder: "35.0116"
						})] }),
						/* @__PURE__ */ i("label", { children: ["Longitude", /* @__PURE__ */ c("input", {
							name: "longitude",
							value: v.longitude,
							onChange: A,
							required: !0,
							inputMode: "decimal",
							placeholder: "135.7681"
						})] }),
						/* @__PURE__ */ i("label", {
							className: "travel-place-editor__wide",
							children: [
								"Gallery URLs",
								/* @__PURE__ */ c("textarea", {
									name: "gallery",
									value: v.gallery,
									onChange: A,
									placeholder: "https://…/frame-01.jpg\\nhttps://…/frame-02.jpg"
								}),
								/* @__PURE__ */ c("small", { children: "One image URL per line. The first image becomes the pin preview." })
							]
						}),
						/* @__PURE__ */ i("label", {
							className: "travel-place-editor__wide",
							children: [
								"Route waypoints",
								/* @__PURE__ */ c("textarea", {
									name: "route",
									value: v.route,
									onChange: A,
									placeholder: "35.0116, 135.7681\\n35.0200, 135.7750"
								}),
								/* @__PURE__ */ c("small", { children: "Optional. One “latitude, longitude” pair per line." })
							]
						}),
						S && /* @__PURE__ */ c("p", {
							className: "travel-place-editor__error",
							role: "alert",
							children: S
						}),
						/* @__PURE__ */ i("div", {
							className: "travel-place-editor__actions",
							children: [/* @__PURE__ */ c("button", {
								className: "travel-globe__action",
								type: "submit",
								disabled: b,
								children: b ? "saving…" : v.id ? "save pin." : "add pin."
							}), v.id && /* @__PURE__ */ c("button", {
								className: "travel-globe__action travel-globe__action--quiet",
								type: "button",
								onClick: async () => {
									if (!v.id || !n?.token) {
										n?.token || (u?.(), l());
										return;
									}
									let e = m;
									h((e) => e.filter((e) => e.id !== v.id)), _(null), y($);
									try {
										await An(v.id, n.token);
									} catch (t) {
										t?.response?.status === 401 && (u?.(), l()), h(e), _(v.id);
										let n = Tn(t) ? "The backend is unavailable, so the location was restored." : t?.response?.data?.error || "The location could not be deleted and was restored.";
										C(n), d?.({
											title: "travel deletion unavailable.",
											message: n
										});
									}
								},
								children: "delete pin."
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { In as default };
